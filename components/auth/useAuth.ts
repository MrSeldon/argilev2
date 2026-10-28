"use client";

import { useSyncExternalStore } from "react";
import { getSupabase } from "@/lib/supabase/client";

export interface AuthUser {
  id: string;
  email: string | null;
}
interface AuthState {
  ready: boolean;
  user: AuthUser | null;
}

const SERVER_STATE: AuthState = { ready: false, user: null };
let state: AuthState = SERVER_STATE;
const listeners = new Set<() => void>();
let started = false;

function set(next: AuthState) {
  if (next.ready === state.ready && next.user?.id === state.user?.id && next.user?.email === state.user?.email) return;
  state = next;
  listeners.forEach((l) => l());
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  const sb = getSupabase();
  if (!sb) {
    set({ ready: true, user: null });
    return;
  }
  // onAuthStateChange fires INITIAL_SESSION straight away, then SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED.
  sb.auth.onAuthStateChange((_event, session) => {
    const u = session?.user;
    set({ ready: true, user: u ? { id: u.id, email: u.email ?? null } : null });
  });
}

/** Subscribe to auth from anywhere (the shelf store uses this too). */
export function subscribeAuth(fn: () => void) {
  start();
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export function getAuth() {
  start();
  return state;
}

/** Who is signed in. `ready` is false until the stored session has been read. */
export function useAuth(): AuthState {
  return useSyncExternalStore(subscribeAuth, getAuth, () => SERVER_STATE);
}

/** Sign out on this device. Hooks registered here run first (e.g. flush unsynced shelf edits). */
const beforeSignOut = new Set<() => Promise<void>>();
export function onBeforeSignOut(fn: () => Promise<void>) {
  beforeSignOut.add(fn);
  return () => beforeSignOut.delete(fn);
}
export async function signOut() {
  const sb = getSupabase();
  if (!sb) return;
  for (const fn of beforeSignOut) {
    try {
      await fn();
    } catch {
      /* best effort */
    }
  }
  await sb.auth.signOut({ scope: "local" });
}
