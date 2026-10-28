"use client";

import { useState } from "react";
import type { Ingredient } from "@/lib/glazes/types";
import { batchWeights, fmtGrams, round } from "@/lib/glazes/math";

const SIZES = [100, 500, 1000, 5000];

export function BatchCalculator({
  ingredients,
  shelf,
  groupOf,
}: {
  ingredients: Ingredient[];
  shelf?: string[];
  groupOf?: (id: string) => string | undefined;
}) {
  const [size, setSize] = useState(1000);
  const [custom, setCustom] = useState("");
  const grams = custom ? Math.max(1, Math.min(100000, Number(custom) || 0)) : size;
  const { rows, baseGrams, addGrams, totalGrams } = batchWeights(ingredients, grams);
  const shelfGroups = new Set((shelf || []).map((id) => groupOf?.(id)).filter(Boolean));
  const has = (i: Ingredient) =>
    !!i.id && (!!shelf?.includes(i.id) || (!!groupOf && !!groupOf(i.id) && shelfGroups.has(groupOf(i.id))));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-caption uppercase tracking-wider text-warm-500 mr-1">Batch</span>
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSize(s);
              setCustom("");
            }}
            className={`px-3 py-1.5 text-body-sm border transition-colors ${
              !custom && size === s ? "bg-charcoal text-cream border-charcoal" : "border-warm-100 text-warm-700 hover:border-warm-300"
            }`}
          >
            {s >= 1000 ? `${s / 1000} kg` : `${s} g`}
          </button>
        ))}
        <label className="flex items-center gap-1 text-body-sm text-warm-500">
          <input
            inputMode="decimal"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^\d.]/g, ""))}
            placeholder="other"
            className="w-20 px-2 py-1.5 border border-warm-100 bg-white text-charcoal focus:outline-none focus:border-warm-300"
            aria-label="Custom batch size in grams"
          />
          g
        </label>
      </div>
      <table className="w-full text-body-sm">
        <thead>
          <tr className="text-caption uppercase tracking-wider text-warm-500 border-b border-warm-100">
            <th className="text-left font-normal py-1.5">Material</th>
            <th className="text-right font-normal py-1.5 w-16">%</th>
            <th className="text-right font-normal py-1.5 w-20">grams</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, k) => (
            <tr key={k} className="border-b border-warm-50 align-top">
              <td className="py-1.5 pr-2">
                <span className={shelf && shelf.length > 0 && !has(r) && r.kind !== "additive" ?"text-red-800" : ""}>{r.name}</span>
                {r.add && <span className="ml-1 text-caption text-warm-500">+ addition</span>}
                {r.variable && <span className="ml-1 text-caption text-amber-700">variable: test tile first</span>}
                {r.original && <span className="block text-caption text-warm-500">“{r.original}”</span>}
                {!r.id && <span className="block text-caption text-warm-500">not in glossary</span>}
              </td>
              <td className="py-1.5 text-right tabular-nums text-warm-700">{round(r.pct, 1)}</td>
              <td className="py-1.5 text-right tabular-nums font-medium">{fmtGrams(r.grams)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="text-body-sm">
            <td className="pt-2 text-warm-500">Base{addGrams > 0 ? " + additions" : ""}</td>
            <td />
            <td className="pt-2 text-right tabular-nums font-medium">
              {fmtGrams(baseGrams)}
              {addGrams > 0 && <span className="block text-caption text-warm-500">total {fmtGrams(totalGrams)} g</span>}
            </td>
          </tr>
        </tfoot>
      </table>
      {shelf && shelf.length > 0 && rows.some((r) => !has(r) && r.kind !== "additive") && (
        <p className="mt-2 text-caption text-red-800">Red = not on your shelf yet.</p>
      )}
    </div>
  );
}
