"use client";

import dynamic from "next/dynamic";
import type { Opportunity } from "@/lib/types";

// Leaflet touches `window`, so the whole map experience is client-only.
const OpportunityMapInner = dynamic(() => import("./OpportunityMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 min-h-[300px] bg-oat flex items-center justify-center">
      <p className="eyebrow animate-breathe">Unfolding the map</p>
    </div>
  ),
});

interface OpportunityMapProps {
  opportunities: Opportunity[];
  initialScope?: import("@/lib/opportunity-map").MapScope;
  initialSelected?: string;
}

export function OpportunityMap({ opportunities, initialScope, initialSelected }: OpportunityMapProps) {
  return (
    <OpportunityMapInner opportunities={opportunities} initialScope={initialScope} initialSelected={initialSelected} />
  );
}
