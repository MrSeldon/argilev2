"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Opportunity } from "@/lib/types";
import { formatLocation } from "@/lib/utils";
import {
  REGIONS,
  inScope,
  isCeramics,
  type Craft,
  WORLD_VIEW,
  addressOf,
  categoriesOf,
  sourceLabel,
  sourceUrl,
  titleCase,
  typeHex,
  type MapOpportunity,
  type MapScope,
} from "@/lib/opportunity-map";
import { ChipScroller } from "@/components/site/ChipScroller";
import { isUnconfirmed, prettyDate, typeLabel } from "./facts";

interface Props {
  opportunities: Opportunity[];
  initialScope?: MapScope;
  initialSelected?: string;
  initialCraft?: Craft;
}

export default function OpportunityMapInner({ opportunities, initialScope = "bay", initialSelected, initialCraft = "ceramics" }: Props) {
  const all = opportunities as MapOpportunity[];
  const [scope, setScope] = useState<MapScope>(initialScope);
  const [craft, setCraft] = useState<Craft>(initialCraft);
  const [types, setTypes] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelected || null);

  const changeScope = (s: MapScope) => {
    setScope(s);
    setSelectedId(null);
    try {
      const url = new URL(window.location.href);
      if (s !== "bay") url.searchParams.set("scope", s);
      else url.searchParams.delete("scope");
      url.searchParams.delete("focus");
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
        if (craft === "ceramics" && !isCeramics(o as { discipline?: string })) return false;
        return inScope(scope, c.lat, c.lng);
      }),
    [all, scope, craft]
  );

  const typeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    scoped.forEach((o) => counts.set(o.type, (counts.get(o.type) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [scoped]);

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    scoped.forEach((o) => categoriesOf(o).forEach((c) => counts.set(c, (counts.get(c) || 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [scoped]);

  const filtered = useMemo(
    () =>
      scoped.filter((o) => {
        if (types.length && !types.includes(o.type)) return false;
        if (cats.length && !categoriesOf(o).some((c) => cats.includes(c))) return false;
        return true;
      }),
    [scoped, types, cats]
  );

  const selected = useMemo(() => filtered.find((o) => o.id === selectedId) || null, [filtered, selectedId]);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const resetFilters = () => {
    setTypes([]);
    setCats([]);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Toolbar */}
      <div className="wrap shrink-0 pb-3 space-y-2">
        <Segmented
          label="Area"
          value={scope}
          onChange={(v) => changeScope(v as MapScope)}
          options={[
            { value: "bay", label: "Bay Area" },
            { value: "colombia", label: "Colombia" },
            { value: "east-africa", label: "East Africa" },
            { value: "world", label: "World" },
          ]}
        />
        <Segmented
          label="Craft"
          value={craft}
          onChange={(v) => {
            setCraft(v as Craft);
            resetFilters();
            try {
              const url = new URL(window.location.href);
              if (v === "all") url.searchParams.set("making", "all");
              else url.searchParams.delete("making");
              window.history.replaceState(window.history.state, "", url.toString());
            } catch {
              /* non-critical */
            }
          }}
          options={[
            { value: "ceramics", label: "Ceramics" },
            { value: "all", label: "All making" },
          ]}
        />

        <ChipScroller label="Filter by type">
          <Chip active={types.length === 0} onClick={() => setTypes([])}>
            All types
          </Chip>
          {typeOptions.map(([t, n]) => (
            <Chip key={t} active={types.includes(t)} onClick={() => toggle(types, setTypes, t)} dot={typeHex(t)}>
              {typeLabel(t)} <span className="opacity-60 tabular-nums">{n}</span>
            </Chip>
          ))}
        </ChipScroller>

        {categoryOptions.length > 0 && (
          <ChipScroller label="Filter by category">
            <Chip active={cats.length === 0} onClick={() => setCats([])}>
              Any category
            </Chip>
            {categoryOptions.map(([c, n]) => (
              <Chip key={c} active={cats.includes(c)} onClick={() => toggle(cats, setCats, c)}>
                {titleCase(c)} <span className="opacity-60 tabular-nums">{n}</span>
              </Chip>
            ))}
          </ChipScroller>
        )}
      </div>

      {/* Map */}
      <div className="relative flex-1 min-h-[320px] border-t border-line">
        <LeafletCanvas
          scope={scope}
          items={filtered}
          selectedId={selected?.id ?? null}
          onSelect={setSelectedId}
          onBackground={() => setSelectedId(null)}
        />

        <div className="absolute top-3 left-3 z-[500] bg-paper-soft/95 border border-line px-3 py-2 text-caption text-ink-2 pointer-events-none">
          {filtered.length} {filtered.length === 1 ? "place" : "places"}
          {scope === "world" ? " worldwide" : ` ${REGIONS[scope].phrase}`}
        </div>

        {filtered.length === 0 && (
          <EmptyState
            scope={scope}
            onReset={resetFilters}
            onWorld={() => changeScope("world")}
            className="absolute inset-x-0 top-1/3 z-[500] px-6"
          />
        )}

        {selected && <PinSheet opp={selected} onClose={() => setSelectedId(null)} />}
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
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = !firstFit.current && !reduce;
    if (scope !== "world") {
      map.fitBounds(REGIONS[scope].bounds, { padding: [8, 8], animate });
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
      const dot = selected ? 26 : scope === "world" ? 13 : 18;
      const hit = 44;
      const ring = selected ? "0 0 0 6px rgba(34,33,30,0.18)," : "";
      const icon = L.divIcon({
        className: "argile-pin",
        html: `<div style="width:${hit}px;height:${hit}px;display:flex;align-items:center;justify-content:center"><div style="width:${dot}px;height:${dot}px;background:${typeHex(
          o.type
        )};border:2px solid #FBF8F3;border-radius:50%;box-shadow:${ring}0 1px 4px rgba(34,33,30,0.35)"></div></div>`,
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
    if (!map || !sel || !ready) return;
    const z = Math.max(map.getZoom(), scope === "world" ? 3 : map.getZoom());
    const p = map.project([sel.lat, sel.lng], z);
    if (map.getSize().x < 768) p.y += Math.min(150, map.getSize().y * 0.25);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.setView(map.unproject(p, z), z, { animate: !reduce });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, ready]);

  return <div ref={elRef} className="absolute inset-0 z-0" />;
}

/* -------------------------------------------------------------------------- */
/* Bottom sheet (phones) / side card (desktop)                                */
/* -------------------------------------------------------------------------- */

function PinSheet({ opp, onClose }: { opp: MapOpportunity; onClose: () => void }) {
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
      className="absolute z-[1100] bottom-0 inset-x-0 max-h-[62%] overflow-y-auto bg-paper-soft shadow-elevated rounded-t-2xl px-5 pt-3 pb-5 animate-rise-in md:inset-x-auto md:right-4 md:bottom-4 md:w-[380px] md:max-h-[80%] md:rounded-card"
    >
      <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-line md:hidden" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
            <span className="eyebrow text-ink-2 inline-flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: typeHex(opp.type) }} />
              {typeLabel(opp.type)}
            </span>
            {cats
              .filter((c) => c !== opp.type)
              .map((c) => (
                <span key={c} className="text-caption text-ink-3">
                  {titleCase(c)}
                </span>
              ))}
          </div>
          <h2 className="font-serif text-[1.5rem] leading-tight">{opp.name}</h2>
          {opp.nameEnglish && <p className="text-caption italic text-ink-3">{opp.nameEnglish}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mt-2 -mr-3 shrink-0 w-11 h-11 flex items-center justify-center text-ink-3 hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.3" fill="none" />
          </svg>
        </button>
      </div>

      <p className="text-body-sm text-ink-2 mt-1">{address || formatLocation(opp.location)}</p>
      {address && <p className="text-caption text-ink-3">{formatLocation(opp.location)}</p>}
      {isUnconfirmed(opp as Opportunity) && <p className="text-caption italic text-ink-3 mt-1">Not recently confirmed</p>}

      {opp.description && <p className="text-body-sm text-ink-2 mt-3 line-clamp-4">{opp.description}</p>}

      <div className="flex gap-2 mt-4">
        <Link href={`/opportunities/${opp.id}`} className="btn-primary flex-1">
          View details
        </Link>
        {src && (
          <a href={src} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1">
            {sourceLabel(opp) === "Source" ? "Website" : sourceLabel(opp)} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
      {opp.lastVerified && <p className="text-[11px] text-ink-3 mt-3">Last verified {prettyDate(opp.lastVerified)}</p>}
    </aside>
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
      <div className="bg-paper-soft shadow-card p-5 text-center max-w-sm mx-auto">
        <p className="text-body-sm text-ink-2 mb-3">No places match these filters.</p>
        <div className="flex gap-2 justify-center">
          <button type="button" onClick={onReset} className="btn-secondary">
            Clear filters
          </button>
          {scope !== "world" && (
            <button type="button" onClick={onWorld} className="btn-primary">
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
    <div role="group" aria-label={label} className="inline-flex p-1 rounded-full bg-oat/80 border border-line">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`min-h-11 px-2.5 sm:px-5 rounded-full text-[13px] sm:text-body-sm whitespace-nowrap transition-colors duration-400 ${
              active ? "bg-paper-soft text-ink shadow-subtle" : "text-ink-3 hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
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
    <button type="button" aria-pressed={active} onClick={onClick} className={`chip ${active ? "chip-on" : "chip-off"}`}>
      {dot && <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: dot }} />}
      {children}
    </button>
  );
}
