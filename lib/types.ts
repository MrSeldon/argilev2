// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  city: string;
  region: string;
  country: string;
  coordinates?: Coordinates;
  approximate?: boolean;
}

// =============================================================================
// OPPORTUNITY TYPES
// =============================================================================

export type OpportunityType =
  | "school"
  | "residency"
  | "apprenticeship"
  | "grant"
  | "scholarship"
  | "internship"
  | "mentorship"
  | "fellowship"
  | "workshop"
  | "studio"
  | "artist"
  | "gallery"
  | "supplier"
  | "materials"
  | "community";

export interface OpportunityDuration {
  display: string;
  minMonths?: number;
  maxMonths?: number;
}

export interface OpportunityCost {
  tuition?: string;
  estimate?: {
    low: number;
    high: number;
    currency: string;
  };
}

export interface OpportunityApplication {
  deadline?: string;
  portfolio?: boolean;
  fee?: number;
  process?: string;
}

export interface OpportunityFunding {
  available?: boolean;
  stipend?: string;
  notes?: string;
}

export interface OpportunityHousing {
  included?: boolean;
  type?: string;
  notes?: string;
}

export interface Opportunity {
  id: string;
  name: string;
  type: OpportunityType;
  status?: string;
  location: Location;
  level?: string;
  focusAreas?: string[];
  duration?: OpportunityDuration;
  programDates?: {
    type?: string;
  };
  deadline?: string;
  cost?: OpportunityCost;
  housing?: OpportunityHousing;
  funding?: OpportunityFunding;
  application?: OpportunityApplication;
  description?: string;
  details?: string;
  facilities?: string[];
  goodFor?: string;
  eligibility?: string;
  website?: string;
  tags?: string[];
  /** Bay Area scouting fields */
  category?: string;
  categories?: string[];
  source?: string;
  lastVerified?: string;
}

export interface OpportunitiesData {
  metadata: {
    version: string;
    lastUpdated: string;
    totalEntries: number;
    types: Record<string, number>;
  };
  opportunities: Opportunity[];
}

// =============================================================================
// GLAZE TYPES
// =============================================================================

export interface GlazeIngredient {
  material: string;
  amount: number;
  isAddition?: boolean;
}

export interface Glaze {
  id?: string;
  code: string;
  name: string;
  cone?: string;
  surface?: string;
  atmosphere?: string;
  transparency?: string;
  ingredients?: GlazeIngredient[];
  description?: string;
  notes?: string;
  url?: string;
  color?: string;
  subtype?: string;
}

export interface GlazesData {
  source?: string;
  fetchDate?: string;
  totalRecipes?: number;
  recipes: Glaze[];
}

// =============================================================================
// INSPIRATION TYPES
// =============================================================================

export type InspirationType =
  | "traditions"
  | "artists"
  | "places"
  | "surfaces"
  | "techniques"
  | "ideas"
  | "moments";

export interface InspirationEntry {
  name: string;
  description?: string;
  period?: string;
  region?: string;
  imageUrl?: string;
  tags?: string[];
  related?: string[];
}

export interface InspirationsData {
  traditions?: InspirationEntry[];
  artists?: InspirationEntry[];
  places?: InspirationEntry[];
  surfaces?: InspirationEntry[];
  techniques?: InspirationEntry[];
  ideas?: InspirationEntry[];
  moments?: InspirationEntry[];
}

// =============================================================================
// SUITABILITY TYPES
// =============================================================================

export interface SuitabilityMonthlyClimate {
  month: string;
  tempHigh: number;
  tempLow: number;
  rainfall: number;
  daylightHours: number;
  humidity: number;
}

export interface SuitabilityCostOfLiving {
  level?: string;
  monthlyEstimate?: string;
  indexScore?: number;
}

export interface SuitabilitySeasonData {
  summary?: string;
  comfort?: "cold" | "cool" | "comfortable" | "warm" | "hot" | string;
}

export interface SuitabilityLocalColorItem {
  month?: string;
  season?: string;
  name: string;
  notes?: string;
}

export interface SuitabilityLocalColor {
  blooms?: SuitabilityLocalColorItem[];
  festivals?: SuitabilityLocalColorItem[];
  naturalPhenomena?: SuitabilityLocalColorItem[];
}

export interface SuitabilityProbabilityScore {
  score: number;
  rating: "Low" | "Moderate" | "High" | "Excellent" | string;
  nearest?: string;
  notes?: string;
}

export interface SuitabilityCreepyCrawlies {
  mosquitoes: "low" | "moderate" | "high" | "seasonal" | string;
  spiders: "low" | "moderate" | "high" | string;
  snakes: "low" | "moderate" | "high" | string;
  other?: string;
}

export interface SuitabilityBeachAccess {
  distance: string;
  type: string;
  beaches?: string[];
  swimmable?: string;
  notes?: string;
  nearestBeachFlight?: {
    destination: string;
    beach: string;
    flightDuration: string;
    approximateCost: string;
    notes?: string;
  };
}

export interface SuitabilityCeramicsEcosystemItem {
  name: string;
  url?: string;
  notes?: string;
}

export interface SuitabilityCeramicsEcosystem {
  studios?: SuitabilityCeramicsEcosystemItem[] | string[];
  suppliers?: SuitabilityCeramicsEcosystemItem[] | string[];
  galleries?: SuitabilityCeramicsEcosystemItem[] | string[];
  community?: SuitabilityCeramicsEcosystemItem[] | string[];
}

export interface SuitabilityLocation {
  location: string;
  city: string;
  region: string;
  country: string;
  coordinates?: Coordinates;
  timezone?: string;
  utcOffset?: number | string;
  opportunities?: string[];
  opportunityTypes?: string[];
  climate?: SuitabilityMonthlyClimate[];
  costOfLiving?: SuitabilityCostOfLiving;
  seasons?: {
    winter?: SuitabilitySeasonData;
    spring?: SuitabilitySeasonData;
    summer?: SuitabilitySeasonData;
    autumn?: SuitabilitySeasonData;
  };
  localColor?: SuitabilityLocalColor;
  probabilityOfChili?: SuitabilityProbabilityScore;
  probabilityOfCoffee?: SuitabilityProbabilityScore;
  creepyCrawlies?: SuitabilityCreepyCrawlies;
  beachAccess?: SuitabilityBeachAccess;
  ceramicsEcosystem?: SuitabilityCeramicsEcosystem;
  practicalInfo?: {
    language?: string;
    visaInfo?: string;
    healthcareAccess?: string;
    internetQuality?: string;
  };
}

export interface SuitabilityData {
  metadata?: {
    version: string;
    totalLocations: number;
  };
  locations: SuitabilityLocation[];
}
