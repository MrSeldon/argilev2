"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Opportunity } from "@/lib/types";
import { formatLocation } from "@/lib/utils";
import {
  BAY_BOUNDS,
  WORLD_VIEW,
  addressOf,
  categoriesOf,
  inBayArea,
  sourceLabel,
  sourceUrl,
  titleCase,
  typeHex,
  type MapOpportunity,
  type MapScope,
} from "@/lib/opportunity-map";

interface Props {
  opportunities: Opportunity[];
  initialScope?: MapScope;
}

type View = "map" | "list";

export default function OpportunityMapInner({
  opportunities,
  initialScope = "bay",
}: Props) {
  const all = opportunities as MapOpportunity[];
  const [scope, setScope] = useState<MapScope>(initialScope);
  const [view, setView] = useState<View>("map");
  const [types, setTypes] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const changeScope = (s: MapScope) => {
    setScope(s);
    setSelectedId(null);
    try {
      const url = new URL(window.location.href);
      if (s === "world") url.searchParams.set("scope", "world");
      else url.searchParams.delete("scope");
      window.history.replaceState(window.history.state, "", url.toString());
    } catch {
      /* non-critical */
    }
  };

  // Everything in the current scope (before type / category chips)
  const scoped = useMemo(
    () =>
      all.filter((o) => {
        const c = o.location.coordinates;
        if (!c) return false;
        return scope === "world" ? true : inBayArea(c.lat, c.lng);
      }),
    [all, scope]
  );

  const typeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    scoped.forEach((o) => counts.set(o.type, (counts.get(o.type) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [scoped]);

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    scoped.forEach((o) =>
      categoriesOf(o).forEach((c) => counts.set(c, (counts.get(c) || 0) + 1))
    );
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [scoped]);

  const filtered = useMemo(
    () =>
      scoped.filter((o) => {
        if (types.length && !types.includes(o.type)) return false;
        if (cats.length && !categoriesOf(o).some((c) => cats.includes(c)))
          return false;
        return true;
      }),
    [scoped, types, cats]
  );

  const selected = useMemo(
    () => filtered.find((o) => o.id === selectedId) || null,
    [filtered, selectedId]
  );

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const resetFilters = () => {
    setTypes([]);
    setCats([]);
  };

  const showOnMap = (id: string) => {
    setSelectedId(id);
    setView("map");
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Toolbar */}
      <div className="border-b border-warm-100 bg-cream py-2 space-y-2">
        <div className="flex gap-2 px-5 md:px-8 max-w-6xl mx-auto w-full">
          <Segmented
            label="Area"
            value={scope}
            onChange={(v) => changeScope(v as MapScope)}
            options={[
              { value: "bay", label: "Bay Area" },
              { value: "world", label: "World" },
            ]}
          />
          <Segmented
            label="View"
            value={view}
            onChange={(v) => setView(v as View)}
            options={[
              { value: "map", label: "Map" },
              { value: "list", label: "List" },
            ]}
          />
        </div>

        <ChipRow label="Filter by type">
          <Chip active={types.length === 0} onClick={() => setTypes([])}>
            All
          </Chip>
          {typeOptions.map(([t, n]) => (
            <Chip
              key={t}
              active={types.includes(t)}
              onClick={() => toggle(types, setTypes, t)}
              dot={typeHex(t)}
            >
              {t} <span className="opacity-60">{n}</span>
            </Chip>
          ))}
        </ChipRow>

        {categoryOptions.length > 0 && (
          <ChipRow label="Filter by category">
            <Chip active={cats.length === 0} onClick={() => setCats([])}>
              Any category
            </Chip>
            {categoryOptions.map(([c, n]) => (
              <Chip
                key={c}
                active={cats.includes(c)}
                onClick={() => toggle(cats, setCats, c)}
              >
                {titleCase(c)} <span className="opacity-60">{n}</span>
              </Chip>
            ))}
          </ChipRow>
        )}
      </div>

      {/* Body */}
      <div className="relative flex-1 min-h-[320px]">
        {view === "map" ? (
          <>
            <LeafletCanvas
              scope={scope}
              items={filtered}
              selectedId={selected?.id ?? null}
              onSelect={setSelectedId}
              onBackground={() => setSelectedId(null)}
            />

            <div className="absolute top-3 left-3 z-[500] bg-white/95 shadow-subtle px-3 py-2 text-xs text-warm-700 pointer-events-none">
              {filtered.length} {filtered.length === 1 ? "place" : "places"}
              {scope === "bay" ? " in the Bay Area" : " worldwide"}
            </div>

            {filtered.length === 0 && (
              <EmptyState
                scope={scope}
                onReset={resetFilters}
                onWorld={() => changeScope("world")}
                className="absolute inset-x-0 top-1/3 z-[500] px-6"
              />
            )}

            {selected && (
              <PinSheet opp={selected} onClose={() => setSelectedId(null)} />
            )}
          </>
        ) : (
          <div className="absolute inset-0 overflow-y-auto bg-cream">
            <div className="max-w-6xl mx-auto px-5 md:px-8 pb-10">
              <p className="py-3 text-xs text-warm-500">
                {filtered.length} {filtered.length === 1 ? "place" : "places"}
                {scope === "bay" ? " in the Bay Area" : " worldwide"}
              </p>
              {filtered.length === 0 ? (
                <EmptyState
                  scope={scope}
                  onReset={resetFilters}
                  onWorld={() => changeScope("world")}
                />
              ) : (
                <ul className="md:grid md:grid-cols-2 md:gap-x-10">
                  {filtered.map((o) => (
                    <ListRow key={o.id} opp={o} onShowOnMap={showOnMap} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Map internals                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Plain Leaflet wrapped in an effect. (react-leaflet's MapContainer creates the
 * map from a ref callback, which React 19 strict mode invokes twice in dev,
 * giving "Map container is already initialized".) Creating the map in an effect
 * with a proper cleanup is strict-mode safe.
 */
function LeafletCanvas({
  scope,
  items,
  selectedId,
  onSelect,
  onBackground,
}: {
  scope: MapScope;
  items: MapOpportunity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBackground: () => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const firstFit = useRef(true);
  const cb = useRef({ onSelect, onBackground });
  cb.current = { onSelect, onBackground };
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const map = L.map(el, {
      zoomControl: false,
      zoomSnap: 0.5,
      minZoom: 1,
      center: [37.78, -122.3],
      zoom: 9,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "topright" }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    map.on("click", () => cb.current.onBackground());
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el);
    mapRef.current = map;
    firstFit.current = true;
    setReady(true);
    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      setReady(false);
    };
  }, []);

  // Frame the Bay Area / the world whenever the scope toggles
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.invalidateSize();
    const animate = !firstFit.current;
    if (scope === "bay") {
      map.fitBounds(BAY_BOUNDS, { padding: [8, 8], animate });
    } else {
      const narrow = map.getSize().x < 600;
      map.setView(WORLD_VIEW.center, narrow ? 1.5 : WORLD_VIEW.zoom, { animate });
    }
    firstFit.current = false;
  }, [scope, ready]);

  // Draw pins. Visible dot sits inside a larger transparent hit area so it is
  // easy to tap with a thumb.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !ready) return;
    layer.clearLayers();
    items.forEach((o) => {
      const c = o.location.coordinates;
      if (!c) return;
      const selected = o.id === selectedId;
      const dot = selected ? 30 : scope === "bay" ? 24 : 16;
      const hit = scope === "bay" ? 44 : 32;
      const ring = selected ? "0 0 0 5px rgba(45,45,42,0.28)," : "";
      const icon = L.divIcon({
        className: "argile-pin",
        html: `<div style="width:${hit}px;height:${hit}px;display:flex;align-items:center;justify-content:center"><div style="width:${dot}px;height:${dot}px;background:${typeHex(
          o.type
        )};border:2.5px solid #fff;border-radius:50%;box-shadow:${ring}0 2px 5px rgba(0,0,0,0.35)"></div></div>`,
        iconSize: [hit, hit],
        iconAnchor: [hit / 2, hit / 2],
      });
      L.marker([c.lat, c.lng], {
        icon,
        title: o.name,
        alt: o.name,
        zIndexOffset: selected ? 1000 : 0,
      })
        .on("click", () => cb.current.onSelect(o.id))
        .addTo(layer);
    });
  }, [items, selectedId, scope, ready]);

  // Bring a selected pin into the part of the map not covered by the sheet
  useEffect(() => {
    const map = mapRef.current;
    const sel = items.find((o) => o.id === selectedId)?.location.coordinates;
    if (!map || !sel) return;
    const z = map.getZoom();
    const p = map.project([sel.lat, sel.lng], z);
    if (map.getSize().x < 768) p.y += Math.min(150, map.getSize().y * 0.25);
    map.setView(map.unproject(p, z), z, { animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return <div ref={elRef} className="absolute inset-0 z-0" />;
}

/* -------------------------------------------------------------------------- */
/* Bottom sheet (phones) / side card (desktop)                                */
/* -------------------------------------------------------------------------- */

function PinSheet({
  opp,
  onClose,
}: {
  opp: MapOpportunity;
  onClose: () => void;
}) {
  const src = sourceUrl(opp);
  const address = addressOf(opp);
  const cats = categoriesOf(opp);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <aside
      role="dialog"
      aria-label={opp.name}
      className="absolute z-[1100] bottom-0 inset-x-0 max-h-[62%] overflow-y-auto bg-white shadow-elevated rounded-t-2xl px-5 pt-3 pb-5 md:inset-x-auto md:right-4 md:bottom-4 md:w-[380px] md:max-h-[80%] md:rounded-card"
    >
      <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-warm-100 md:hidden" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-warm-700"
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: typeHex(opp.type) }}
              />
              {opp.type}
            </span>
            {cats.map((c) => (
              <span key={c} className="tag !py-0.5 !px-2 !text-[10px]">
                {titleCase(c)}
              </span>
            ))}
          </div>
          <h2 className="font-serif text-xl leading-snug">{opp.name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mt-2 -mr-3 shrink-0 w-11 h-11 flex items-center justify-center text-warm-500"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-warm-500 mt-1">{address || formatLocation(opp.location)}</p>
      {address && (
        <p className="text-xs text-warm-500">{formatLocation(opp.location)}</p>
      )}

      {opp.description && (
        <p className="text-sm text-warm-700 mt-3 line-clamp-4">{opp.description}</p>
      )}

      <div className="flex gap-2 mt-4">
        <Link
          href={`/opportunities/${opp.id}`}
          className="flex-1 inline-flex items-center justify-center min-h-11 px-4 text-xs uppercase tracking-wider bg-charcoal text-cream"
        >
          View details
        </Link>
        {src && (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center min-h-11 px-4 text-xs uppercase tracking-wider border border-charcoal text-charcoal"
          >
            {sourceLabel(opp) === "Source" ? "Source" : sourceLabel(opp)} &#8599;
          </a>
        )}
      </div>
      {opp.lastVerified && (
        <p className="text-[11px] text-warm-500 mt-3">Last verified {opp.lastVerified}</p>
      )}
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* List view                                                                  */
/* -------------------------------------------------------------------------- */

function ListRow({
  opp,
  onShowOnMap,
}: {
  opp: MapOpportunity;
  onShowOnMap: (id: string) => void;
}) {
  return (
    <li className="flex items-stretch border-b border-warm-100">
      <Link
        href={`/opportunities/${opp.id}`}
        className="flex-1 min-w-0 py-4 min-h-[64px] block"
      >
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-warm-500 mb-1">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: typeHex(opp.type) }}
          />
          {opp.type}
        </span>
        <span className="block text-sm tracking-wide uppercase">{opp.name}</span>
        <span className="block text-xs text-warm-500 mt-0.5">
          {addressOf(opp) || formatLocation(opp.location)}
        </span>
      </Link>
      <button
        type="button"
        onClick={() => onShowOnMap(opp.id)}
        aria-label={`Show ${opp.name} on map`}
        className="shrink-0 w-12 flex items-center justify-center text-warm-500"
      >
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M9 19s6-5.4 6-10a6 6 0 10-12 0c0 4.6 6 10 6 10z" />
          <circle cx="9" cy="9" r="2" />
        </svg>
      </button>
    </li>
  );
}

function EmptyState({
  scope,
  onReset,
  onWorld,
  className = "",
}: {
  scope: MapScope;
  onReset: () => void;
  onWorld: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="bg-white shadow-card p-5 text-center max-w-sm mx-auto">
        <p className="text-sm text-warm-700 mb-3">No places match these filters.</p>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={onReset}
            className="min-h-11 px-4 text-xs uppercase tracking-wider border border-charcoal"
          >
            Clear filters
          </button>
          {scope === "bay" && (
            <button
              type="button"
              onClick={onWorld}
              className="min-h-11 px-4 text-xs uppercase tracking-wider bg-charcoal text-cream"
            >
              Show world
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small controls                                                             */
/* -------------------------------------------------------------------------- */

function Segmented({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-1 md:flex-none md:w-60 border border-warm-200 bg-white"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`flex-1 min-h-11 px-2 text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
              active ? "bg-charcoal text-cream" : "text-warm-700"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ChipRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex gap-2 overflow-x-auto scrollbar-hide px-5 md:px-8 max-w-6xl mx-auto w-full"
    >
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  dot,
  children,
}: {
  active: boolean;
  onClick: () => void;
  dot?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 min-h-10 px-4 text-xs uppercase tracking-wider border transition-colors ${
        active
          ? "bg-charcoal text-cream border-charcoal"
          : "bg-white text-warm-700 border-warm-200"
      }`}
    >
      {dot && (
        <span
          className="inline-block w-2.5 h-2.5 rounded-full border border-white/70"
          style={{ background: dot }}
        />
      )}
      {children}
    </button>
  );
}
