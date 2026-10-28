"use client";

// Embeds the describe-it query in the browser with the same model and
// quantisation used by scripts/glazes/build-index.mjs (Xenova/all-MiniLM-L6-v2, q8).
// transformers.js is loaded from a CDN on first use, so it never enters the
// app's JS bundle; the ~23 MB model is cached by the browser after the first load.

const CDN = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0/dist/transformers.min.js";
const MODEL = "Xenova/all-MiniLM-L6-v2";

type Extractor = (text: string, opts: { pooling: "mean"; normalize: boolean }) => Promise<{ data: Float32Array }>;

let pipe: Promise<Extractor> | null = null;
let ready = false;
const listeners = new Set<(p: number) => void>();

export function embedderReady() {
  return ready;
}

export function onEmbedderProgress(fn: (pct: number) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function loadEmbedder(): Promise<Extractor> {
  if (!pipe) {
    pipe = (async () => {
      // Plain dynamic import of a URL, hidden from the bundler.
      const importUrl = new Function("u", "return import(u)") as (u: string) => Promise<any>;
      const mod = await importUrl(CDN);
      mod.env.allowLocalModels = false;
      const files: Record<string, { loaded: number; total: number }> = {};
      const extractor = await mod.pipeline("feature-extraction", MODEL, {
        dtype: "q8",
        progress_callback: (e: { status: string; file?: string; loaded?: number; total?: number }) => {
          if (e.status === "progress" && e.file && e.total) {
            files[e.file] = { loaded: e.loaded || 0, total: e.total };
            const all = Object.values(files);
            const pct = (all.reduce((s, f) => s + f.loaded, 0) / all.reduce((s, f) => s + f.total, 0)) * 100;
            listeners.forEach((l) => l(Math.round(pct)));
          }
        },
      });
      ready = true;
      listeners.forEach((l) => l(100));
      return extractor as Extractor;
    })().catch((e) => {
      pipe = null;
      throw e;
    });
  }
  return pipe;
}

export async function embed(text: string): Promise<number[]> {
  const extractor = await loadEmbedder();
  const out = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(out.data);
}
