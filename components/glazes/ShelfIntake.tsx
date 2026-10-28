"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";
import { supabaseConfigured, UPLOAD_BUCKET } from "@/lib/supabase/env";
import { ImagePrepError, toUploadJpeg } from "@/lib/shelf/image";
import type { ResolvedItem } from "@/lib/shelf/match";
import { useAuth } from "@/components/auth/useAuth";
import { useShelf } from "./useShelf";
import { IntakeSheet, type IntakePhoto, type IntakeRow } from "./IntakeSheet";

const MAX_PHOTOS = 10;
const PARALLEL = 3;

function rowsFrom(items: ResolvedItem[]): IntakeRow[] {
  return items.map((it, k) => ({
    key: String(k),
    printed: it.printed,
    language: it.language,
    checked: it.status === "matched",
    material: it.material,
    status: it.status,
    quantity: it.quantity != null ? String(it.quantity) : "",
    unit: it.unit || "kg",
    suggestions: it.suggestions,
  }));
}

/** "Add from a photo or receipt": pick/take photos -> upload -> Claude reads -> she confirms. */
export function ShelfIntake() {
  const { ready, user } = useAuth();
  const { addEntries } = useShelf();
  const [photos, setPhotos] = useState<IntakePhoto[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const pickRef = useRef<HTMLInputElement>(null);

  const patch = useCallback((key: string, p: Partial<IntakePhoto>) => {
    setPhotos((list) => (list ? list.map((x) => (x.key === key ? { ...x, ...p } : x)) : list));
  }, []);

  const processOne = useCallback(
    async (photo: IntakePhoto, file: File, uid: string, i: number) => {
      const sb = getSupabase();
      if (!sb) return;
      try {
        patch(photo.key, { stage: "preparing" });
        const jpeg = await toUploadJpeg(file);
        patch(photo.key, { stage: "uploading" });
        const path = `${uid}/${Date.now()}-${i}.jpg`;
        const up = await sb.storage.from(UPLOAD_BUCKET).upload(path, jpeg, { contentType: "image/jpeg", upsert: false });
        if (up.error) throw new Error("upload");
        const signed = await sb.storage.from(UPLOAD_BUCKET).createSignedUrl(path, 60 * 60);
        if (signed.data?.signedUrl) patch(photo.key, { thumbUrl: signed.data.signedUrl });
        const ins = await sb.from("argile_intake").insert({ user_id: uid, kind: "photo", photo_path: path }).select("id").single();
        if (ins.error || !ins.data) throw new Error("intake");
        const intakeId = ins.data.id as string;
        patch(photo.key, { stage: "reading", intakeId });
        const r = await fetch("/api/shelf/read", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ intakeId }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) {
          patch(photo.key, { stage: "error", error: d?.message || "Couldn’t read this photo. Try again.", signedOut: r.status === 401 });
          return;
        }
        patch(photo.key, { stage: "done", document: d.document, readable: d.readable, note: d.note, rows: rowsFrom(d.items || []) });
      } catch (e) {
        const msg =
          e instanceof ImagePrepError
            ? e.message
            : typeof navigator !== "undefined" && navigator.onLine === false
            ? "You’re offline. Connect and try again."
            : "Couldn’t upload this photo. Check your connection and try again.";
        patch(photo.key, { stage: "error", error: msg });
      }
    },
    [patch]
  );

  const onFiles = useCallback(
    async (list: FileList | null) => {
      if (!list || !list.length || !user) return;
      const files = Array.from(list).slice(0, MAX_PHOTOS);
      const batch: IntakePhoto[] = files.map((f, i) => ({
        key: `${Date.now()}-${i}`,
        name: f.name,
        localUrl: URL.createObjectURL(f),
        stage: "preparing",
        rows: [],
      }));
      setPhotos((prev) => [...(prev || []), ...batch]);
      let next = 0;
      const worker = async () => {
        while (next < files.length) {
          const i = next++;
          await processOne(batch[i], files[i], user.id, i);
        }
      };
      await Promise.all(Array.from({ length: Math.min(PARALLEL, files.length) }, worker));
    },
    [user, processOne]
  );

  const close = useCallback(() => {
    setPhotos((list) => {
      list?.forEach((p) => URL.revokeObjectURL(p.localUrl));
      return null;
    });
  }, []);

  const confirm = useCallback(
    async (list: IntakePhoto[]) => {
      // Combine the same material across photos (amounts add up when the unit matches).
      const byId = new Map<string, { id: string; name: string; amount?: number; unit?: string; source: "photo" | "receipt" }>();
      for (const p of list) {
        for (const r of p.rows) {
          if (!r.checked || !r.material) continue;
          const amount = r.quantity.trim() ? Number(r.quantity.replace(",", ".")) : undefined;
          const ok = amount !== undefined && Number.isFinite(amount) && amount > 0 ? amount : undefined;
          const prev = byId.get(r.material.id);
          const source = p.document === "receipt" ? "receipt" : "photo";
          if (prev && prev.unit === r.unit && prev.amount !== undefined && ok !== undefined) prev.amount += ok;
          else if (!prev) byId.set(r.material.id, { id: r.material.id, name: r.material.name, amount: ok, unit: ok !== undefined ? r.unit : undefined, source });
        }
      }
      const entries = [...byId.values()];
      if (entries.length) addEntries(entries);
      // Keep a record of what she kept on each intake row (best effort; the shelf is already updated).
      const sb = getSupabase();
      if (sb) {
        await Promise.all(
          list
            .filter((p) => p.intakeId && p.stage === "done")
            .map((p) =>
              sb
                .from("argile_intake")
                .update({
                  confirmed: p.rows
                    .filter((r) => r.checked && r.material)
                    .map((r) => ({ id: r.material!.id, name: r.material!.name, printed: r.printed, quantity: r.quantity ? Number(r.quantity.replace(",", ".")) || null : null, unit: r.quantity ? r.unit : null })),
                })
                .eq("id", p.intakeId!)
            )
        ).catch(() => {});
      }
      close();
      setToast(entries.length ? `Added ${entries.length} material${entries.length === 1 ? "" : "s"} to your shelf.` : "Nothing added.");
      setTimeout(() => setToast(null), 4000);
    },
    [addEntries, close]
  );

  if (!supabaseConfigured) return null;

  return (
    <div className="mt-4">
      {ready && !user ? (
        <Link
          href="/login?next=%2Fglazes%2Fmy-materials"
          className="flex items-center justify-center gap-2 w-full min-h-[52px] px-4 border border-warm-200 bg-white text-body-md"
        >
          <CameraIcon /> Sign in to add from a photo or receipt
        </Link>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!user}
            onClick={() => cameraRef.current?.click()}
            className="flex items-center justify-center gap-2 min-h-[52px] px-3 bg-charcoal text-cream text-body-md disabled:opacity-50"
          >
            <CameraIcon /> Take a photo
          </button>
          <button
            type="button"
            disabled={!user}
            onClick={() => pickRef.current?.click()}
            className="flex items-center justify-center gap-2 min-h-[52px] px-3 border border-warm-200 bg-white text-body-md disabled:opacity-50"
          >
            Choose photos
          </button>
        </div>
      )}
      <p className="mt-2 text-caption text-warm-500">Bags, labels or receipts, in Italian, French, English or Kinyarwanda. You check everything before it’s added.</p>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          void onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={pickRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {toast && (
        <p role="status" className="mt-3 p-3 text-body-sm bg-glaze-50 border border-glaze-200 text-glaze-800">
          {toast}
        </p>
      )}
      {photos && (
        <IntakeSheet
          photos={photos}
          setPhotos={setPhotos}
          onAddMore={() => pickRef.current?.click()}
          onClose={close}
          onConfirm={confirm}
        />
      )}
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}
