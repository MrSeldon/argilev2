"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface FiltersProps {
  cones: string[];
  surfaces: string[];
  atmospheres: string[];
  currentParams: {
    source?: string;
    cone?: string;
    surface?: string;
    atmosphere?: string;
    q?: string;
  };
}

export function GlazeFilters({
  cones,
  surfaces,
  atmospheres,
  currentParams,
}: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (currentParams.source) {
      params.set("source", currentParams.source);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters =
    currentParams.cone || currentParams.surface || currentParams.atmosphere || currentParams.q;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Source Toggle */}
      <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
        <button
          onClick={() => handleFilterChange("source", "")}
          className={`transition-opacity hover:opacity-100 ${
            !currentParams.source || currentParams.source === "digitalfire"
              ? "opacity-100"
              : "opacity-40"
          }`}
        >
          Digital Fire
        </button>
        <span className="text-warm-200">|</span>
        <button
          onClick={() => handleFilterChange("source", "glazy")}
          className={`transition-opacity hover:opacity-100 ${
            currentParams.source === "glazy" ? "opacity-100" : "opacity-40"
          }`}
        >
          Glazy
        </button>
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          defaultValue={currentParams.q || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleFilterChange("q", e.currentTarget.value);
            }
          }}
          className="px-4 py-2 text-sm bg-transparent border-b border-warm-200 focus:border-charcoal outline-none transition-colors w-48"
        />

        {/* Cone */}
        <select
          value={currentParams.cone || ""}
          onChange={(e) => handleFilterChange("cone", e.target.value)}
          className="px-4 py-2 text-sm bg-transparent border-b border-warm-200 focus:border-charcoal outline-none cursor-pointer appearance-none"
        >
          <option value="">All cones</option>
          {cones.map((cone) => (
            <option key={cone} value={cone}>
              Cone {cone}
            </option>
          ))}
        </select>

        {/* Surface */}
        <select
          value={currentParams.surface || ""}
          onChange={(e) => handleFilterChange("surface", e.target.value)}
          className="px-4 py-2 text-sm bg-transparent border-b border-warm-200 focus:border-charcoal outline-none cursor-pointer appearance-none"
        >
          <option value="">All surfaces</option>
          {surfaces.map((surface) => (
            <option key={surface} value={surface}>
              {surface}
            </option>
          ))}
        </select>

        {/* Atmosphere */}
        <select
          value={currentParams.atmosphere || ""}
          onChange={(e) => handleFilterChange("atmosphere", e.target.value)}
          className="px-4 py-2 text-sm bg-transparent border-b border-warm-200 focus:border-charcoal outline-none cursor-pointer appearance-none"
        >
          <option value="">All atmospheres</option>
          {atmospheres.map((atm) => (
            <option key={atm} value={atm}>
              {atm}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-warm-400 hover:text-charcoal transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
