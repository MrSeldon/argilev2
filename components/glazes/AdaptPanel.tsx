"use client";

import { useEffect, useRef, useState } from "react";
import type { Ingredient } from "@/lib/glazes/types";
import { BatchCalculator } from "./BatchCalculator";

interface AdaptResult {
  chemistry: string;
  why?: string;
  expect?: string;
  test?: string;
  applied?: {
    summary: string;
    ingredients: Ingredient[];
    siAlBefore?: number;
    siAlAfter?: number;
    onShelf: boolean | null;
    variable?: boolean;
    note?: string;
  } | null;
}

export function AdaptPanel({
  code,
  goal,
  shelf,
  groupOf,
  autoStart = false,
}: {
  autoStart?: boolean;
  code: string;
  goal: string;
  shelf: string[];
  groupOf: (id: string) => string | undefined;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error" | "nokey">("idle");
  const [msg, setMsg] = useState("");
  const [res, setRes] = useState<AdaptResult | null>(null);

  async function run() {
    setState("loading");
    setMsg("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "adapt", code, goal, shelf }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.status === 503 && data.error === "missing_key") {
        setState("nokey");
        setMsg(data.message);
        return;
      }
      if (!r.ok) throw new Error(data.error || "Something went wrong");
      setRes(data);
      setState("done");
    } catch (e) {
      setState("error");
      setMsg(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  const started = useRef(false);
  useEffect(() => {
    if (autoStart && !started.current) {
      started.current = true;
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  if (state === "idle")
    return (
      <button type="button" onClick={run} className="btn-primary w-full sm:w-auto">
        Adapt this toward my description
      </button>
    );

  if (state === "loading")
    return (
      <div className="p-4 bg-oat/70 text-body-sm text-ink-2 animate-breathe">
        Reading the chemistry and choosing one change…
      </div>
    );

  if (state === "nokey" || state === "error")
    return (
      <div className="p-4 border border-line bg-oat/60 text-body-sm text-ink-2">
        <p>{msg}</p>
        {state === "error" && (
          <button type="button" onClick={run} className="mt-1 inline-flex items-center min-h-11 underline underline-offset-4">
            Try again
          </button>
        )}
      </div>
    );

  return (
    <div className="space-y-4 border-l border-terracotta pl-4">
      <div>
        <h4 className="text-caption uppercase tracking-wider text-warm-500 mb-1">The chemistry, plainly</h4>
        {(res?.chemistry || "").split(/\n{2,}/).map((p, k) => (
          <p key={k} className="text-body-sm text-charcoal mb-2">
            {p}
          </p>
        ))}
      </div>
      {res?.applied ? (
        <div>
          <h4 className="text-caption uppercase tracking-wider text-warm-500 mb-1">One change</h4>
          <p className="font-medium text-body-md">{res.applied.summary}</p>
          {res.why && <p className="text-body-sm text-warm-700 mt-1">{res.why}</p>}
          {res.applied.onShelf === false && <p className="text-caption text-rust mt-1">That material isn’t on your shelf yet.</p>}
          {res.applied.variable && <p className="text-caption text-terracotta-deep mt-1">{res.applied.note || "Variable material: test tile first."}</p>}
          {res.applied.siAlBefore !== undefined && res.applied.siAlAfter !== undefined && res.applied.siAlBefore !== res.applied.siAlAfter && (
            <p className="text-caption text-warm-500 mt-1">
              Silica:alumina ratio {res.applied.siAlBefore} → {res.applied.siAlAfter} (computed)
            </p>
          )}
          <div className="mt-3">
            <p className="text-caption text-warm-500 mb-2">Adapted recipe (re-totalled to 100 in code):</p>
            <BatchCalculator ingredients={res.applied.ingredients} shelf={shelf} groupOf={groupOf} />
          </div>
        </div>
      ) : (
        res?.why && <p className="text-body-sm">{res.why}</p>
      )}
      {res?.expect && (
        <p className="text-body-sm">
          <span className="text-caption uppercase tracking-wider text-warm-500">Look for · </span>
          {res.expect}
        </p>
      )}
      {res?.test && (
        <p className="text-body-sm">
          <span className="text-caption uppercase tracking-wider text-warm-500">Test · </span>
          {res.test}
        </p>
      )}
    </div>
  );
}
