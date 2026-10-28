"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Opportunity } from "@/lib/types";
import { formatLocation, getOpportunityTypeColor } from "@/lib/utils";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface OpportunityMapProps {
  opportunities: Opportunity[];
}

export function OpportunityMap({ opportunities }: OpportunityMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[500px] bg-clay-100 flex items-center justify-center">
        <p className="text-clay-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[600px]">
      <MapWithMarkers opportunities={opportunities} />
    </div>
  );
}

function MapWithMarkers({ opportunities }: OpportunityMapProps) {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  if (!L) {
    return (
      <div className="w-full h-full min-h-[500px] bg-clay-100 flex items-center justify-center">
        <p className="text-clay-500">Loading map...</p>
      </div>
    );
  }

  // Create custom icon
  const createIcon = (type: string) => {
    const colors: Record<string, string> = {
      school: "#3b82f6",
      residency: "#22c55e",
      grant: "#a855f7",
      scholarship: "#ec4899",
      fellowship: "#6366f1",
      apprenticeship: "#f59e0b",
      mentorship: "#f43f5e",
      workshop: "#f97316",
      studio: "#14b8a6",
      artist: "#d946ef",
      gallery: "#8b5cf6",
      supplier: "#84cc16",
      materials: "#ca8a04",
      community: "#0ea5e9",
    };

    return L.divIcon({
      className: "custom-marker",
      html: `<div style="
        width: 24px;
        height: 24px;
        background: ${colors[type] || "#6b7280"};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <MapContainer
        center={[30, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", minHeight: "600px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {opportunities.map((opp) => {
          if (!opp.location.coordinates) return null;

          return (
            <Marker
              key={opp.id}
              position={[opp.location.coordinates.lat, opp.location.coordinates.lng]}
              icon={createIcon(opp.type)}
            >
              <Popup>
                <div className="max-w-xs">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${getOpportunityTypeColor(
                      opp.type
                    )}`}
                  >
                    {opp.type}
                  </span>
                  <h3 className="font-semibold text-sm mb-1">{opp.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {formatLocation(opp.location)}
                  </p>
                  {opp.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {opp.description}
                    </p>
                  )}
                  <a
                    href={`/opportunities/${opp.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View details &rarr;
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}
