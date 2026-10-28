import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type {
  Opportunity,
  OpportunitiesData,
  Glaze,
  GlazesData,
  InspirationsData,
  SuitabilityLocation,
  SuitabilityData,
} from "./types";

// Re-export types and utils for convenience
export * from "./types";
export * from "./utils";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Load JSON data from a file in the /data directory
 */
export async function loadData<T>(filePath: string): Promise<T> {
  const fullPath = path.join(DATA_DIR, filePath);
  const content = await fs.readFile(fullPath, "utf-8");
  return JSON.parse(content);
}

/**
 * Check if a file exists in the /data directory
 */
export async function dataExists(filePath: string): Promise<boolean> {
  const fullPath = path.join(DATA_DIR, filePath);
  try {
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}

// =============================================================================
// DATA LOADING FUNCTIONS
// =============================================================================

export async function getOpportunities(): Promise<Opportunity[]> {
  const data = await loadData<OpportunitiesData>("opportunities/index.json");
  const extra: Opportunity[] = [];
  // Additional regional datasets (flat arrays) loaded alongside index.json
  for (const file of ["opportunities/sf-bay.json"]) {
    if (await dataExists(file)) {
      extra.push(...(await loadData<Opportunity[]>(file)));
    }
  }
  const known = new Set(data.opportunities.map((o) => o.id));
  return [...data.opportunities, ...extra.filter((o) => !known.has(o.id))];
}

export async function getOpportunityById(
  id: string
): Promise<Opportunity | undefined> {
  const opportunities = await getOpportunities();
  return opportunities.find((opp) => opp.id === id);
}

export async function getGlazes(source: "digitalfire" | "glazy" = "digitalfire"): Promise<Glaze[]> {
  const data = await loadData<GlazesData>(`glazes/${source}.json`);
  return data.recipes;
}

export async function getInspirations(): Promise<InspirationsData> {
  return loadData<InspirationsData>("inspirations/index.json");
}

export async function getSuitabilityData(): Promise<SuitabilityLocation[]> {
  const data = await loadData<{ locations: Record<string, SuitabilityLocation> }>("suitability/index.json");
  return Object.values(data.locations);
}

/**
 * Find related opportunities (grants/scholarships that could fund a program)
 * Logic:
 * - If viewing a SCHOOL/RESIDENCY/WORKSHOP → show matching grants/scholarships
 * - Match by country, region, or global availability
 */
export async function getRelatedOpportunities(
  opportunity: Opportunity,
  limit: number = 4
): Promise<Opportunity[]> {
  const allOpportunities = await getOpportunities();

  // Types that can be funded
  const fundableTypes = ["school", "residency", "workshop", "apprenticeship"];
  // Types that provide funding
  const fundingTypes = ["grant", "scholarship", "fellowship"];

  // If viewing a fundable type, find funding opportunities
  if (fundableTypes.includes(opportunity.type)) {
    const related = allOpportunities.filter((opp) => {
      // Must be a funding type
      if (!fundingTypes.includes(opp.type)) return false;
      // Don't include self
      if (opp.id === opportunity.id) return false;

      // Match by country
      const sameCountry = opp.location.country === opportunity.location.country;
      // Match by region (e.g., Europe, Asia, North America)
      const sameRegion = getRegion(opp.location.country) === getRegion(opportunity.location.country);
      // Some grants are international/global
      const isInternational = opp.eligibility?.toLowerCase().includes("international") ||
        opp.name.toLowerCase().includes("international");

      return sameCountry || sameRegion || isInternational;
    });

    // Sort by relevance: same country first, then same region, then international
    related.sort((a, b) => {
      const aCountry = a.location.country === opportunity.location.country ? 0 : 1;
      const bCountry = b.location.country === opportunity.location.country ? 0 : 1;
      return aCountry - bCountry;
    });

    return related.slice(0, limit);
  }

  // If viewing a funding type, find programs it could fund
  if (fundingTypes.includes(opportunity.type)) {
    const related = allOpportunities.filter((opp) => {
      if (!fundableTypes.includes(opp.type)) return false;
      if (opp.id === opportunity.id) return false;

      const sameCountry = opp.location.country === opportunity.location.country;
      const sameRegion = getRegion(opp.location.country) === getRegion(opportunity.location.country);

      return sameCountry || sameRegion;
    });

    return related.slice(0, limit);
  }

  return [];
}

// Helper to determine broad region
function getRegion(country: string): string {
  const regions: Record<string, string[]> = {
    "North America": ["USA", "Canada", "Mexico"],
    "Europe": ["UK", "France", "Germany", "Italy", "Spain", "Netherlands", "Belgium", "Denmark", "Sweden", "Norway", "Finland", "Ireland", "Portugal", "Austria", "Switzerland", "Czech Republic", "Poland", "Hungary", "Greece", "Croatia"],
    "Asia": ["Japan", "China", "South Korea", "Taiwan", "Thailand", "Vietnam", "Indonesia", "India", "Singapore", "Malaysia"],
    "Oceania": ["Australia", "New Zealand"],
    "South America": ["Brazil", "Argentina", "Chile", "Colombia", "Peru"],
    "Africa": ["South Africa", "Morocco", "Kenya", "Ghana", "Nigeria"],
  };

  for (const [region, countries] of Object.entries(regions)) {
    if (countries.includes(country)) return region;
  }
  return "Other";
}
