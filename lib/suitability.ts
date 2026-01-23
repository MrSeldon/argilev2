import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { SuitabilityLocation } from "./types";

// Winnie's home base
const HOME_TIMEZONE = "Africa/Kigali";
const HOME_UTC_OFFSET = 2; // UTC+2

interface SuitabilityDataFile {
  version: string;
  generated: string;
  locations: Record<string, SuitabilityLocation>;
}

// Cache the suitability data
let suitabilityCache: SuitabilityDataFile | null = null;

async function loadSuitabilityData(): Promise<SuitabilityDataFile> {
  if (suitabilityCache) {
    return suitabilityCache;
  }

  const filePath = path.join(process.cwd(), "data", "suitability", "index.json");
  const data = await fs.readFile(filePath, "utf-8");
  suitabilityCache = JSON.parse(data);
  return suitabilityCache!;
}

/**
 * Get suitability data for a specific location string
 */
export async function getSuitabilityByLocation(
  location: string
): Promise<SuitabilityLocation | null> {
  const data = await loadSuitabilityData();
  return data.locations[location] || null;
}

/**
 * Get all suitability locations
 */
export async function getAllSuitabilityLocations(): Promise<SuitabilityLocation[]> {
  const data = await loadSuitabilityData();
  return Object.values(data.locations);
}

/**
 * Get suitability data for an opportunity by matching its location
 */
export async function getSuitabilityForOpportunity(
  city: string,
  region: string,
  country: string
): Promise<SuitabilityLocation | null> {
  // Try exact match first
  const exactKey = `${city}, ${region}, ${country}`;
  const exactMatch = await getSuitabilityByLocation(exactKey);
  if (exactMatch) return exactMatch;

  // Try without region
  const data = await loadSuitabilityData();
  for (const [key, location] of Object.entries(data.locations)) {
    if (location.city === city && location.country === country) {
      return location;
    }
  }

  return null;
}

/**
 * Calculate the overall suitability score for a location
 * Based on Winnie's priorities from the design docs
 *
 * Weights:
 * - Climate comfort: 35%
 * - Culture & local color: 25%
 * - Food (chili, coffee): 20%
 * - Bug factor: 15%
 * - Timezone alignment: 5%
 */
export function calculateSuitabilityScore(location: SuitabilityLocation): number {
  const climateScore = calculateClimateScore(location);
  const cultureScore = calculateCultureScore(location);
  const foodScore = calculateFoodScore(location);
  const bugScore = calculateBugScore(location);
  const timezoneScore = calculateTimezoneScore(location);

  return Math.round(climateScore + cultureScore + foodScore + bugScore + timezoneScore);
}

/**
 * Climate score (0-35)
 * Ideal: Average highs 20-25°C year-round
 */
function calculateClimateScore(location: SuitabilityLocation): number {
  if (!location.climate || !Array.isArray(location.climate)) return 0;

  const idealLow = 20;
  const idealHigh = 25;
  let totalDeviation = 0;

  for (const month of location.climate) {
    const avgTemp = (month.tempHigh + month.tempLow) / 2;
    if (avgTemp < idealLow) {
      totalDeviation += (idealLow - avgTemp);
    } else if (avgTemp > idealHigh) {
      totalDeviation += (avgTemp - idealHigh);
    }
  }

  // Average deviation per month, then convert to score
  const avgDeviation = totalDeviation / 12;
  // 0 deviation = 35 points, 15+ deviation = 0 points
  const score = Math.max(0, 35 - (avgDeviation * 2.33));
  return score;
}

/**
 * Culture score (0-25)
 * Based on blooms, festivals, natural phenomena, ceramics ecosystem
 */
function calculateCultureScore(location: SuitabilityLocation): number {
  let score = 0;

  // Blooms (up to 8 points)
  const blooms = location.localColor?.blooms || [];
  score += Math.min(8, blooms.length * 2);

  // Festivals (up to 8 points)
  const festivals = location.localColor?.festivals || [];
  score += Math.min(8, festivals.length * 2);

  // Natural phenomena (up to 4 points)
  const phenomena = location.localColor?.naturalPhenomena || [];
  score += Math.min(4, phenomena.length * 2);

  // Ceramics ecosystem (up to 5 points)
  if (location.ceramicsEcosystem) {
    const ecosystem = location.ceramicsEcosystem;
    if (ecosystem.studios && ecosystem.studios.length > 0) score += 2;
    if (ecosystem.galleries && ecosystem.galleries.length > 0) score += 1.5;
    if (ecosystem.suppliers && ecosystem.suppliers.length > 0) score += 1.5;
  }

  return Math.min(25, score);
}

/**
 * Food score (0-20)
 * Based on chili and coffee availability
 */
function calculateFoodScore(location: SuitabilityLocation): number {
  let score = 0;

  // Probability of Chili (up to 10 points)
  if (location.probabilityOfChili) {
    score += (location.probabilityOfChili.score / 100) * 10;
  }

  // Probability of Coffee (up to 10 points)
  if (location.probabilityOfCoffee) {
    score += (location.probabilityOfCoffee.score / 100) * 10;
  }

  return Math.min(20, score);
}

/**
 * Bug score (0-15)
 * Lower bugs = higher score
 */
function calculateBugScore(location: SuitabilityLocation): number {
  if (!location.creepyCrawlies) return 15; // No data = assume low

  const bugs = location.creepyCrawlies;
  let score = 15;

  // Mosquitoes
  if (bugs.mosquitoes === "high") score -= 5;
  else if (bugs.mosquitoes === "moderate" || bugs.mosquitoes === "seasonal") score -= 2;

  // Spiders
  if (bugs.spiders === "high") score -= 4;
  else if (bugs.spiders === "moderate") score -= 1;

  // Snakes
  if (bugs.snakes === "high") score -= 4;
  else if (bugs.snakes === "moderate") score -= 1;

  return Math.max(0, score);
}

/**
 * Timezone score (0-5)
 * Based on alignment with Kigali (UTC+2)
 */
function calculateTimezoneScore(location: SuitabilityLocation): number {
  const offset = typeof location.utcOffset === "number" ? location.utcOffset : 0;
  const difference = Math.abs(offset - HOME_UTC_OFFSET);

  if (difference === 0) return 5;
  if (difference <= 3) return 4;
  if (difference <= 6) return 3;
  if (difference <= 9) return 2;
  return 1;
}

/**
 * Format timezone comparison between home and destination
 */
export function formatTimezoneComparison(destinationOffset: number): {
  difference: string;
  alignment: "same" | "close" | "moderate" | "challenging";
  homeTime: string;
  destTime: string;
  overlapHours: number;
} {
  const diff = destinationOffset - HOME_UTC_OFFSET;
  const absDiff = Math.abs(diff);

  // Current time calculation (simplified for display)
  const now = new Date();
  const homeHours = (now.getUTCHours() + HOME_UTC_OFFSET + 24) % 24;
  const destHours = (now.getUTCHours() + destinationOffset + 24) % 24;

  const formatTime = (hours: number) => {
    const h = hours % 12 || 12;
    const ampm = hours < 12 ? "AM" : "PM";
    return `${h}:00 ${ampm}`;
  };

  // Calculate working hours overlap (9am-5pm)
  // Simplified: assume 8-hour overlap at same timezone
  const overlapHours = Math.max(0, 8 - absDiff);

  let alignment: "same" | "close" | "moderate" | "challenging";
  if (absDiff === 0) alignment = "same";
  else if (absDiff <= 3) alignment = "close";
  else if (absDiff <= 6) alignment = "moderate";
  else alignment = "challenging";

  return {
    difference: diff >= 0 ? `+${diff}h` : `${diff}h`,
    alignment,
    homeTime: formatTime(homeHours),
    destTime: formatTime(destHours),
    overlapHours,
  };
}

/**
 * Get a summary description for a location's suitability
 */
export function getSuitabilitySummary(location: SuitabilityLocation): string {
  const parts: string[] = [];

  // Climate summary
  if (location.seasons) {
    const winterComfort = location.seasons.winter?.comfort;
    const summerComfort = location.seasons.summer?.comfort;

    if (winterComfort === "cold") parts.push("Cold winter");
    else if (winterComfort === "cool") parts.push("Cool winter");

    if (summerComfort === "hot") parts.push("Hot summer");
    else if (summerComfort === "comfortable") parts.push("Pleasant summer");
  }

  // Timezone
  const offset = typeof location.utcOffset === "number" ? location.utcOffset : 0;
  const tzDiff = Math.abs(offset - HOME_UTC_OFFSET);
  if (tzDiff === 0) {
    parts.push("Same timezone as Kigali");
  } else if (tzDiff <= 3) {
    parts.push(`Easy calls home (${tzDiff}h difference)`);
  } else if (tzDiff >= 8) {
    parts.push(`Challenging calls home (${tzDiff}h difference)`);
  }

  // Food
  if (location.probabilityOfChili?.rating === "High" || location.probabilityOfChili?.rating === "Excellent") {
    parts.push("Good comfort food options");
  } else if (location.probabilityOfChili?.rating === "Low") {
    parts.push("Limited comfort food");
  }

  return parts.join(". ") + (parts.length > 0 ? "." : "");
}

/**
 * Get comfort zone description for a temperature
 */
export function getComfortDescription(tempC: number): {
  label: string;
  inComfort: boolean;
} {
  const COMFORT_MIN = 21; // 70°F
  const COMFORT_MAX = 28; // 82°F

  if (tempC < COMFORT_MIN - 10) {
    return { label: "Very cold", inComfort: false };
  } else if (tempC < COMFORT_MIN) {
    return { label: "Too cold", inComfort: false };
  } else if (tempC <= COMFORT_MAX) {
    return { label: "In comfort zone", inComfort: true };
  } else if (tempC <= COMFORT_MAX + 5) {
    return { label: "Too warm", inComfort: false };
  } else {
    return { label: "Very hot", inComfort: false };
  }
}
