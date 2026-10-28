"use client";

import dynamic from "next/dynamic";
import type { Opportunity } from "@/lib/types";

// Leaflet touches `window`, so the whole map experience is client-only.
const OpportunityMapInner = dynamic(() => import("./OpportunityMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 min-h-[300px] bg-clay-100 flex items-center justify-center">
      <p className="text-clay-500">Loading map...</p>
    </div>
  ),
});

interface OpportunityMapProps {
  opportunities: Opportunity[];
  initialScope?: "bay" | "world";
}

export function OpportunityMap({ opportunities, initialScope }: OpportunityMapProps) {
  return (
    <OpportunityMapInner
      opportunities={opportunities}
      initialScope={initialScope}
    />
  );
}
