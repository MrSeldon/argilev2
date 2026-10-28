"use client";

import { useRouter, useSearchParams } from "next/navigation";

/** Compact native select that sets one query parameter on /opportunities (country, city...). `reset` clears dependent params. */
export function ParamSelect({
  param,
  label,
  anyLabel,
  options,
  value,
  reset = [],
}: {
  param: string;
  label: string;
  anyLabel: string;
  options: [string, number][];
  value?: string;
  reset?: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  return (
    <label className="relative inline-flex items-center max-w-full">
      <span className="sr-only">{label}</span>
      <select
        value={value || ""}
        onChange={(e) => {
          const p = new URLSearchParams(params.toString());
          if (e.target.value) p.set(param, e.target.value);
          else p.delete(param);
          reset.forEach((r) => p.delete(r));
          p.delete("type");
          const qs = p.toString();
          router.push(`/opportunities${qs ? `?${qs}` : ""}`, { scroll: false });
        }}
        className={`appearance-none max-w-full min-h-11 pl-4 pr-9 rounded-full border text-body-sm bg-paper-soft transition-colors duration-400 focus:outline-none focus:border-ink ${
          value ? "border-ink text-ink" : "border-line text-ink-2"
        }`}
      >
        <option value="">{anyLabel}</option>
        {options.map(([c, n]) => (
          <option key={c} value={c}>
            {c} ({n})
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3.5 text-ink-3" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M2.5 4.5L6 8l3.5-3.5" />
      </svg>
    </label>
  );
}
