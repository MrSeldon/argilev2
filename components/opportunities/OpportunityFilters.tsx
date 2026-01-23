"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface FiltersProps {
  types: string[];
  countries: string[];
  levels: string[];
  currentParams: {
    type?: string;
    country?: string;
    level?: string;
    funding?: string;
    q?: string;
  };
}

export function OpportunityFilters({
  types,
  countries,
  levels,
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
    router.push(pathname);
  };

  const hasActiveFilters =
    currentParams.type ||
    currentParams.country ||
    currentParams.level ||
    currentParams.funding;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-body-sm font-medium text-clay-700 mb-2">
          Search
        </label>
        <input
          type="text"
          placeholder="Search opportunities..."
          defaultValue={currentParams.q || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleFilterChange("q", e.currentTarget.value);
            }
          }}
          className="input"
        />
      </div>

      {/* Type Filter */}
      <div>
        <label className="block text-body-sm font-medium text-clay-700 mb-2">
          Type
        </label>
        <select
          value={currentParams.type || ""}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="input"
        >
          <option value="">All types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Country Filter */}
      <div>
        <label className="block text-body-sm font-medium text-clay-700 mb-2">
          Country
        </label>
        <select
          value={currentParams.country || ""}
          onChange={(e) => handleFilterChange("country", e.target.value)}
          className="input"
        >
          <option value="">All countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Level Filter */}
      <div>
        <label className="block text-body-sm font-medium text-clay-700 mb-2">
          Level
        </label>
        <select
          value={currentParams.level || ""}
          onChange={(e) => handleFilterChange("level", e.target.value)}
          className="input"
        >
          <option value="">All levels</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Funding Available */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={currentParams.funding === "true"}
            onChange={(e) =>
              handleFilterChange("funding", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded border-ash-300 text-glaze-600 focus:ring-glaze-500"
          />
          <span className="text-body-sm text-clay-700">
            Funding available
          </span>
        </label>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button onClick={clearFilters} className="btn-ghost text-body-sm w-full">
          Clear all filters
        </button>
      )}
    </div>
  );
}
