"use client";

/**
 * Shelf storage.
 *
 * Signed out: the shelf lives in this browser (localStorage), as before.
 * Signed in:  the shelf lives in Supabase (public.argile_shelf, one row per person)
 *             and localStorage is only an offline cache of that row plus any edits
 *             that haven't reached the server yet ("pending ops").
 *
 * Edits are kept as small operations (add / remove / clear) and replayed on top of
 * the newest server copy, and every write is conditional on the updated_at we last
 * saw. If another tab or device wrote in between, we refetch and replay, so two open
 * tabs never clobber each other. We also refetch whenever the tab regains focus.
 *
 * On first sign-in on a device, whatever was on the signed-out local shelf is merged
 * into the account (union by material id), then the local shelf is emptied.
 */

import { getSupabase } from "@/lib/supabase/client";
import { getAuth, onBeforeSignOut, subscribeAuth, type AuthUser } from "@/components/auth/useAuth";
import { applyOps, clean, now, type Op, type ShelfEntry } from "@/lib/shelf/ops";

export type { ShelfEntry };

interface Remote {
  materials: ShelfEntry[];
  updatedAt: string | null; // null: the person has no row yet
}
interface AccountCache {
  owner: string;
  remote: Remote | null; // null: never fetched on this device
  pending: Op[];
}

export type SyncStatus = "idle" | "syncing" | "synced" | "offline" | "error";
export interface ShelfState {
  loaded: boolean;
  mode: "local" | "cloud";
  status: SyncStatus;
  email: string | null;
  entries: ShelfEntry[];
  ids: string[];
}

const ANON_KEY = "argile-shelf-v2:local";
const ACCOUNT_KEY = "argile-shelf-v2:account";
const V1_KEY = "argile-shelf-v1";
const TABLE = "argile_shelf";

// ---------------------------------------------------------------- localStorage (never throws)
function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function write(key: string, value: unknown) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota: the cache just won't persist */
  }
}

/** Signed-out shelf. The first time, it is migrated from the v1 key (a plain list of ids). */
function readAnon(): ShelfEntry[] {
  const v2 = read<ShelfEntry[]>(ANON_KEY);
  if (v2) return clean(v2);
  const v1 = clean(read<string[]>(V1_KEY));
  write(ANON_KEY, v1); // from now on v2 is the source of truth, even when empty
  return v1;
}

// ---------------------------------------------------------------- store
const SERVER_STATE: ShelfState = { loaded: false, mode: "local", status: "idle", email: null, entries: [], ids: [] };
let state: ShelfState = SERVER_STATE;
const listeners = new Set<() => void>();
let user: AuthUser | null = null;
let account: AccountCache | null = null;
let started = false;
let syncing: Promise<void> | null = null;
let again = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let lastFocusSync = 0;
let authSeen = false;

function emit(patch: Partial<ShelfState>) {
  // Keep the same arrays when nothing changed, so a focus refetch doesn't re-run shelf analysis.
  if (patch.entries && JSON.stringify(patch.entries) === JSON.stringify(state.entries)) {
    const { entries: _same, ...rest } = patch;
    patch = rest;
  }
  const next = { ...state, ...patch };
  if (patch.entries) next.ids = patch.entries.map((e) => e.id);
  state = next;
  listeners.forEach((l) => l());
}

function cloudEntries(acc: AccountCache) {
  return applyOps(acc.remote?.materials || [], acc.pending);
}

function saveAccount() {
  if (account) write(ACCOUNT_KEY, account);
}

function errStatus(): SyncStatus {
  return typeof navigator !== "undefined" && navigator.onLine === false ? "offline" : "error";
}

async function pull(uid: string): Promise<void> {
  const sb = getSupabase()!;
  const { data, error } = await sb.from(TABLE).select("materials, updated_at").eq("user_id", uid).maybeSingle();
  if (error) throw error;
  if (!account || account.owner !== uid) return;
  account.remote = data ? { materials: clean(data.materials), updatedAt: data.updated_at as string } : { materials: [], updatedAt: null };
  saveAccount();
}

/** Write pending ops on top of the newest server copy. Conditional on updated_at; retries on conflict. */
async function push(uid: string): Promise<void> {
  const sb = getSupabase()!;
  for (let attempt = 0; attempt < 5; attempt++) {
    if (!account || account.owner !== uid || account.pending.length === 0) return;
    if (!account.remote) await pull(uid);
    const acc = account;
    if (!acc || !acc.remote) return;
    const n = acc.pending.length;
    const next = applyOps(acc.remote.materials, acc.pending.slice(0, n));
    const stamp = now();
    let row: { materials: unknown; updated_at: string } | null = null;
    if (acc.remote.updatedAt) {
      const { data, error } = await sb
        .from(TABLE)
        .update({ materials: next, updated_at: stamp })
        .eq("user_id", uid)
        .eq("updated_at", acc.remote.updatedAt)
        .select("materials, updated_at");
      if (error) throw error;
      row = data && data.length ? data[0] : null;
    } else {
      const { data, error } = await sb.from(TABLE).insert({ user_id: uid, materials: next, updated_at: stamp }).select("materials, updated_at");
      if (error && error.code !== "23505") throw error; // 23505: another device created the row first
      row = data && data.length ? data[0] : null;
    }
    if (!row) {
      await pull(uid); // someone else wrote in between: replay on their version
      continue;
    }
    if (account !== acc) return;
    acc.remote = { materials: clean(row.materials), updatedAt: row.updated_at };
    acc.pending = acc.pending.slice(n);
    saveAccount();
    emit({ entries: cloudEntries(acc) });
  }
}

/** Pull (unless only pushing), then push. Coalesces overlapping calls. */
function sync(opts: { pull?: boolean } = { pull: true }): Promise<void> {
  const u = user;
  if (!u || !account || !getSupabase()) return Promise.resolve();
  if (syncing) {
    again = true;
    return syncing;
  }
  emit({ status: "syncing" });
  syncing = (async () => {
    try {
      if (opts.pull || !account?.remote) await pull(u.id);
      await push(u.id);
      if (account && account.owner === u.id) emit({ entries: cloudEntries(account), status: "synced", loaded: true });
    } catch {
      if (account && account.owner === u.id) emit({ status: errStatus(), loaded: true });
    } finally {
      syncing = null;
      if (again) {
        again = false;
        void sync({ pull: false });
      }
    }
  })();
  return syncing;
}

function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void sync({ pull: false });
  }, 400);
}

function onAuth(next: AuthUser | null) {
  const prev = user;
  if (authSeen && prev?.id === next?.id) return;
  authSeen = true;
  user = next;
  if (!next) {
    // Signed out (or never signed in): back to the browser-only shelf.
    if (prev && account && account.pending.length === 0) write(ACCOUNT_KEY, null);
    account = null;
    emit({ mode: "local", status: "idle", email: null, entries: readAnon(), loaded: true });
    return;
  }
  // Signed in. Reuse this device's cache only if it belongs to this person.
  const cached = read<AccountCache>(ACCOUNT_KEY);
  account = cached && cached.owner === next.id ? { owner: next.id, remote: cached.remote, pending: Array.isArray(cached.pending) ? cached.pending : [] } : { owner: next.id, remote: null, pending: [] };
  // Merge the signed-out shelf into the account (union by id), then empty it.
  const anon = readAnon();
  if (anon.length) {
    account.pending.push(...anon.map((e): Op => ({ t: "add", e, overwrite: false })));
    write(ANON_KEY, []);
  }
  saveAccount();
  emit({ mode: "cloud", email: next.email, entries: cloudEntries(account), loaded: Boolean(account.remote) });
  void sync({ pull: true });
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  if (!getSupabase()) {
    emit({ mode: "local", entries: readAnon(), loaded: true });
  } else {
    const a = getAuth();
    if (a.ready) onAuth(a.user);
    // Defer: Supabase calls must not run inside its own auth callback.
    subscribeAuth(() => {
      const s = getAuth();
      if (s.ready) setTimeout(() => onAuth(s.user), 0);
    });
    onBeforeSignOut(async () => {
      if (pushTimer) {
        clearTimeout(pushTimer);
        pushTimer = null;
      }
      if (account?.pending.length) await sync({ pull: false });
    });
  }
  const refresh = () => {
    if (!user || document.visibilityState === "hidden") return;
    const t = Date.now();
    if (t - lastFocusSync < 3000) return;
    lastFocusSync = t;
    void sync({ pull: true });
  };
  window.addEventListener("focus", refresh);
  window.addEventListener("online", () => void sync({ pull: true }));
  document.addEventListener("visibilitychange", refresh);
  // Another tab of this browser changed the shelf.
  window.addEventListener("storage", (e) => {
    if (e.key === ANON_KEY && !user) emit({ entries: readAnon() });
    if (e.key === ACCOUNT_KEY && user) {
      const c = read<AccountCache>(ACCOUNT_KEY);
      if (c && c.owner === user.id) {
        account = c;
        emit({ entries: cloudEntries(c) });
      }
    }
  });
}

function mutate(op: Op) {
  start();
  if (user && account) {
    account.pending.push(op);
    saveAccount();
    emit({ entries: cloudEntries(account) });
    schedulePush();
  } else {
    const list = applyOps(readAnon(), [op]);
    write(ANON_KEY, list);
    emit({ entries: list });
  }
}

// ---------------------------------------------------------------- public API
export const shelfStore = {
  subscribe(fn: () => void) {
    start();
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  get: () => state,
  getServer: () => SERVER_STATE,
  add(id: string, name?: string) {
    if (state.ids.includes(id)) return;
    mutate({ t: "add", e: { id, name, source: "manual", added_at: now() } });
  },
  /** Add (or update the amount of) several materials, e.g. from a confirmed photo. */
  addEntries(entries: Omit<ShelfEntry, "added_at">[]) {
    for (const e of entries) mutate({ t: "add", e: { ...e, added_at: now() }, overwrite: true });
  },
  remove(id: string) {
    mutate({ t: "remove", id });
  },
  clear() {
    mutate({ t: "clear" });
  },
  /** Try syncing now (e.g. a "retry" button). */
  retry: () => sync({ pull: true }),
};
