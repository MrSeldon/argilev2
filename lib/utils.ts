import { Location, OpportunityType } from "./types";

// =============================================================================
// UTILITY FUNCTIONS (client-safe)
// =============================================================================

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatLocation(location: Location): string {
  const parts = [location.city, location.region, location.country].filter(
    Boolean
  );
  return parts.join(", ");
}

export function getOpportunityTypeColor(type: OpportunityType): string {
  const colors: Record<OpportunityType, string> = {
    school: "bg-blue-100 text-blue-700",
    residency: "bg-green-100 text-green-700",
    apprenticeship: "bg-amber-100 text-amber-700",
    grant: "bg-purple-100 text-purple-700",
    scholarship: "bg-pink-100 text-pink-700",
    internship: "bg-cyan-100 text-cyan-700",
    mentorship: "bg-rose-100 text-rose-700",
    fellowship: "bg-indigo-100 text-indigo-700",
    workshop: "bg-orange-100 text-orange-700",
    studio: "bg-teal-100 text-teal-700",
    artist: "bg-fuchsia-100 text-fuchsia-700",
    gallery: "bg-violet-100 text-violet-700",
    supplier: "bg-lime-100 text-lime-700",
    materials: "bg-yellow-100 text-yellow-800",
    community: "bg-sky-100 text-sky-700",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
}
