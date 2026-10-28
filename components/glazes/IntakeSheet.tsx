"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import { searchGlossary, useGlossary, type SlimMaterial } from "./useShelf";

export interface IntakeRow {
  key: string;
  printed: string;
  language: string;
  checked: boolean;
  material: { id: string; name: string } | null;
  status: "matched" | "unmatched";
  quantity: string;
  unit: string;
  suggestions: { id: string; name: string }[];
}

export interface IntakePhoto {
  key: string;
  name: string;
  localUrl: string;
  thumbUrl?: string;
  stage: "preparing" | "uploading" | "reading" | "done" | "error";
  error?: string;
  signedOut?: boolean;
  intakeId?: string;
  document?: "label" | "bag" | "receipt" | "other";
  readable?: boolean;
  note?: string | null;
  rows: IntakeRow[];
}

const UNITS = ["kg", "g", "lb", "oz", "l", "bag", "pcs"];
const LANG: Record<string, string> = { it: "Italian", fr: "French", en: "English", rw: "Kinyarwanda", es: "Spanish", de: "German", pt: "Portuguese" };
const STAGE: Record<IntakePhoto["stage"], string> = {
  preparing: "Preparing photo…",
  uploading: "Uploading…",
  reading: "Reading the label…",
  done: "",
  error: "",
};

/** Full-screen confirm sheet: what each photo was read as. Nothing is added until "Add to my shelf". */
export function IntakeSheet({
  photos,
  setPhotos,
  onAddMore,
  onClose,
  onConfirm,
}: {
  photos: IntakePhoto[];
  setPhotos: Dispatch<SetStateAction<IntakePhoto[] | null>>;
  onAddMore: () => void;
  onClose: () => void;
  onConfirm: (photos: IntakePhoto[]) => Promise<void>;
}) {
  const glossary = useGlossary();
  const [saving, setSaving] = useState(false);
  const busy = photos.some((p) => p.stage !== "done" && p.stage !== "error");
  const count = photos.reduce((n, p) => n + p.rows.filter((r) => r.checked && r.material).length, 0);

  // lock page scroll behind the sheet; Escape closes
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const editRow = (pk: string, rk: string, p: Partial<IntakeRow>) =>
    setPhotos((list) => (list ? list.map((x) => (x.key !== pk ? x : { ...x, rows: x.rows.map((r) => (r.key === rk ? { ...r, ...p } : r)) })) : list));
  const addRow = (pk: string) =>
    setPhotos((list) =>
      list
        ? list.map((x) =>
            x.key !== pk ? x : { ...x, rows: [...x.rows, { key: `m${Date.now()}`, printed: "", language: "", checked: false, material: null, status: "unmatched", quantity: "", unit: "kg", suggestions: [] }] }
          )
        : list
    );

  return (
    <div className="fixed inset-0 z-[1300] bg-cream flex flex-col" role="dialog" aria-modal="true" aria-labelledby="intake-title">
      <header className="flex items-center justify-between gap-3 px-4 h-14 border-b border-warm-100 bg-white shrink-0">
        <h2 id="intake-title" className="font-serif text-heading-md truncate">
          {busy ? "Reading your photos…" : "Check what we found"}
        </h2>
        <button type="button" onClick={onClose} className="min-h-[44px] min-w-[44px] -mr-2 text-2xl text-warm-700" aria-label="Close without adding">
          ×
        </button>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-narrow mx-auto px-4 py-4 space-y-6">
          {photos.map((p) => (
            <section key={p.key} className="bg-white border border-warm-100">
              <div className="flex gap-3 p-3 items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.thumbUrl || p.localUrl} alt="" className="w-20 h-20 object-cover bg-warm-50 shrink-0" />
                <div className="min-w-0 flex-1 text-body-sm">
                  {p.stage !== "done" && p.stage !== "error" && (
                    <p className="text-warm-700 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full border-2 border-warm-300 border-t-transparent animate-spin" aria-hidden />
                      {STAGE[p.stage]}
                    </p>
                  )}
                  {p.stage === "error" && (
                    <p className="text-red-700">
                      {p.error}{" "}
                      {p.signedOut && (
                        <Link href="/login?next=%2Fglazes%2Fmy-materials" className="underline">
                          Sign in
                        </Link>
                      )}
                    </p>
                  )}
                  {p.stage === "done" && (
                    <>
                      <p className="text-warm-700">
                        {p.document === "receipt" ? "Receipt" : p.document === "bag" ? "Bag" : p.document === "label" ? "Label" : "Photo"} ·{" "}
                        {p.rows.length ? `${p.rows.length} item${p.rows.length === 1 ? "" : "s"} found` : "no materials found"}
                      </p>
                      {p.note && <p className="text-caption text-warm-500 mt-1">{p.note}</p>}
                    </>
                  )}
                </div>
              </div>

              {p.stage === "done" && (
                <ul className="divide-y divide-warm-50 border-t border-warm-50">
                  {p.rows.map((r) => (
                    <RowEditor key={r.key} row={r} glossary={glossary} onChange={(patch) => editRow(p.key, r.key, patch)} />
                  ))}
                  <li>
                    <button type="button" onClick={() => addRow(p.key)} className="w-full min-h-[48px] px-3 text-left text-body-sm text-warm-700 underline">
                      + Something’s missing: add it by hand
                    </button>
                  </li>
                </ul>
              )}
            </section>
          ))}
          <button type="button" onClick={onAddMore} className="w-full min-h-[48px] border border-dashed border-warm-200 text-body-sm text-warm-700">
            + Add another photo
          </button>
          <p className="text-caption text-warm-500 pb-2">Prices and totals are ignored. Photos are kept privately in your account.</p>
        </div>
      </div>

      <footer className="shrink-0 border-t border-warm-100 bg-white px-4 pt-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <div className="max-w-narrow mx-auto flex gap-2">
          <button type="button" onClick={onClose} className="min-h-[52px] px-4 border border-warm-200 text-body-md">
            Cancel
          </button>
          <button
            type="button"
            disabled={count === 0 || saving || busy}
            onClick={async () => {
              setSaving(true);
              try {
                await onConfirm(photos);
              } finally {
                setSaving(false);
              }
            }}
            className="flex-1 min-h-[52px] bg-charcoal text-cream text-body-md disabled:opacity-50"
          >
            {saving ? "Adding…" : busy ? "Still reading…" : count ? `Add ${count} to my shelf` : "Tick what to add"}
          </button>
        </div>
      </footer>
    </div>
  );
}

function RowEditor({ row, glossary, onChange }: { row: IntakeRow; glossary: SlimMaterial[] | null; onChange: (p: Partial<IntakeRow>) => void }) {
  const [picking, setPicking] = useState(!row.material && !row.printed);
  const [q, setQ] = useState("");
  const results = useMemo(() => (glossary && q ? searchGlossary(glossary, q, 6) : []), [glossary, q]);
  const choose = (m: { id: string; name: string }) => {
    onChange({ material: { id: m.id, name: m.name }, checked: true });
    setPicking(false);
    setQ("");
  };

  return (
    <li className="p-3 space-y-2">
      <div className="flex items-start gap-3">
        <label className="flex items-center justify-center min-w-[44px] min-h-[44px] -m-2 shrink-0">
          <input
            type="checkbox"
            checked={row.checked}
            disabled={!row.material}
            onChange={(e) => onChange({ checked: e.target.checked })}
            className="w-6 h-6 accent-charcoal"
            aria-label={`Add ${row.material?.name || row.printed}`}
          />
        </label>
        <div className="min-w-0 flex-1">
          {row.printed && (
            <p className="text-body-sm text-warm-700 break-words">
              “{row.printed}”{row.language && LANG[row.language] ? <span className="text-caption text-warm-500"> · {LANG[row.language]}</span> : null}
            </p>
          )}
          {row.material ? (
            <p className="text-body-md">
              {row.material.name}{" "}
              <button type="button" onClick={() => setPicking((v) => !v)} className="text-caption underline text-warm-500 min-h-[32px] px-1">
                change
              </button>
            </p>
          ) : (
            <p className="text-body-sm text-amber-700">
              {row.printed ? "Not sure which material this is: choose one" : "Choose a material"}{" "}
              {!picking && (
                <button type="button" onClick={() => setPicking(true)} className="underline min-h-[32px] px-1">
                  search
                </button>
              )}
            </p>
          )}
        </div>
      </div>

      {(picking || !row.material) && row.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-9">
          {row.suggestions.filter((s) => s.id !== row.material?.id).map((s) => (
            <button key={s.id} type="button" onClick={() => choose(s)} className="min-h-[40px] px-3 border border-warm-200 bg-cream text-body-sm">
              {s.name}
            </button>
          ))}
        </div>
      )}

      {picking && (
        <div className="pl-9">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search materials (any language)…"
            autoComplete="off"
            className="w-full min-h-[44px] px-3 text-[16px] bg-white border border-warm-200 focus:outline-none focus:border-charcoal"
          />
          {q && (
            <ul className="border border-t-0 border-warm-100 divide-y divide-warm-50">
              {results.length === 0 && <li className="p-3 text-body-sm text-warm-500">No material found for “{q}”.</li>}
              {results.map(({ m, via }) => (
                <li key={m.id}>
                  <button type="button" onClick={() => choose(m)} className="w-full text-left min-h-[44px] px-3 py-2 hover:bg-warm-50">
                    <span className="text-body-sm">{m.name}</span>
                    {via && <span className="block text-caption text-warm-500">also called “{via}”</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 pl-9">
        <label className="text-caption text-warm-500" htmlFor={`qty-${row.key}`}>
          Amount
        </label>
        <input
          id={`qty-${row.key}`}
          inputMode="decimal"
          value={row.quantity}
          onChange={(e) => onChange({ quantity: e.target.value.replace(/[^0-9.,]/g, "") })}
          placeholder="-"
          className="w-20 min-h-[40px] px-2 text-[16px] bg-white border border-warm-200 focus:outline-none focus:border-charcoal"
        />
        <select
          value={row.unit}
          onChange={(e) => onChange({ unit: e.target.value })}
          aria-label="Unit"
          className="min-h-[40px] px-2 text-[16px] bg-white border border-warm-200"
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
}
