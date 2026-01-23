# Le Four Argile — Suitability Index Implementation

> The Suitability Index is the heart of Le Four Argile. It helps Winnie evaluate ceramic opportunities based on personal priorities: climate comfort, timezone compatibility, local culture, and practical concerns.

---

## Overview

The Suitability Index is a rich, data-driven modal that appears when viewing an opportunity. It provides personalized information about the location including:

1. **Suitability Score** — An overall rating (0-100)
2. **Quick Summary** — One-sentence overview of the location
3. **Climate Chart** — Monthly temperature and rainfall visualization
4. **Seasonal Rhythm** — Four seasons with descriptions and comfort ratings
5. **Time Zone Comparison** — User's location vs destination with day/night alignment
6. **Local Color** — Blooms, festivals, natural phenomena
7. **Personal Care** — Pilates studios, Afro hair care availability
8. **Creepy Crawlies** — Mosquitoes, snakes, spiders ratings
9. **Additional Context** — Probability of chili, coffee, beach access, etc.

---

## Data Location

**Suitability data exists at:** `data/suitability/index.json`

This file contains ~275 locations with full suitability data, keyed by location string (e.g., "Berkeley, California, USA").

### Data Schema

```typescript
interface SuitabilityData {
  location: string;           // Full location string
  city: string;
  region: string;
  country: string;
  coordinates: { lat: number; lng: number };
  timezone: string;           // e.g., "America/Los_Angeles"
  utcOffset: number;          // e.g., -8
  opportunities: string[];    // Opportunity names at this location

  climate: Array<{
    month: string;            // "January", "February", etc.
    tempHigh: number;         // Celsius
    tempLow: number;          // Celsius
    rainfall: number;         // mm
    daylightHours: number;
    humidity: number;         // percentage
  }>;

  seasons: {
    winter: { summary: string; comfort: "cold" | "cool" | "comfortable" | "hot" };
    spring: { summary: string; comfort: string };
    summer: { summary: string; comfort: string };
    autumn: { summary: string; comfort: string };
  };

  localColor: {
    blooms: Array<{ month: string; name: string; notes: string }>;
    festivals: Array<{ month: string; name: string; notes: string }>;
    naturalPhenomena?: Array<{ season: string; name: string; notes: string }>;
  };

  probabilityOfChili: {
    score: number;            // 0-100
    rating: string;           // "Low", "Moderate", "High"
    nearest: string;
    notes: string;
  };

  creepyCrawlies: {
    mosquitoes: "low" | "moderate" | "high" | "seasonal";
    spiders: "low" | "moderate" | "high";
    snakes: "low" | "moderate" | "high";
    other?: string;
  };

  // Additional optional fields
  ceramicsEcosystem?: { studios: string[]; suppliers: string[]; galleries: string[]; };
  beachAccess?: { distance: string; type: string; swimmable: string; };
  indigenousTraditions?: { peoples: string[]; ceramicsHeritage: string; };
  probabilityOfCoffee?: { score: number; rating: string; roasters: string[]; };
  localDessert?: { signature: string; bakeries: string[]; };
  practicalNotes?: string;
}
```

---

## Task 1: Create Suitability Data Utilities

**Prompt for Claude Code:**

```
Create a data utility module for the Suitability Index.

File: lib/suitability.ts

Functions needed:
1. getSuitabilityByLocation(location: string) — Returns suitability data for a location
2. getSuitabilityForOpportunity(opportunityId: string) — Gets suitability via opportunity's location
3. calculateSuitabilityScore(data: SuitabilityData, userPrefs?: UserPrefs) — Calculates overall score
4. formatTimezoneComparison(destinationTz: string, userTz: string) — Returns time difference and alignment

The calculateSuitabilityScore function should consider:
- Climate comfort (weight: 30%)
- Timezone compatibility with Kigali, Rwanda (weight: 25%)
- Local amenities/creepy crawlies (weight: 20%)
- Chili/coffee/comfort food availability (weight: 15%)
- Ceramics ecosystem richness (weight: 10%)

User's home location: Kigali, Rwanda (UTC+2, timezone "Africa/Kigali")
```

---

## Task 2: Create Climate Chart Component

**Prompt for Claude Code:**

```
Create a climate visualization component for the Suitability Index.

File: components/suitability/ClimateChart.tsx

Requirements:
1. Display 12 months on X-axis (J F M A M J J A S O N D)
2. Temperature range visualization (high/low)
3. Rainfall bars (secondary axis)
4. Current month highlighted
5. Hover state showing exact values

Style guidelines:
- Use warm earth tones from the design guide
- Matte, minimal look — no harsh gradients
- SVG-based (can use D3.js or just SVG elements)
- Responsive sizing

Example from V1:
- Temperature shown as a range band
- Rainfall as subtle bars behind
- Current month has a vertical indicator line
```

---

## Task 3: Create Suitability Modal Component

**Prompt for Claude Code:**

```
Create the main Suitability Index modal component.

File: components/suitability/SuitabilityModal.tsx

This modal displays all suitability information. Structure:

1. Header
   - Location name (large, serif)
   - Score badge (circular, showing 0-100)
   - Quick summary text

2. Climate Section
   - ClimateChart component
   - Legend showing temperature/rainfall

3. Seasonal Rhythm Section
   - 4 cards (Winter, Spring, Summer, Autumn)
   - Each shows comfort level and summary
   - Visual indicator for comfort (cold=blue, comfortable=green, hot=orange)

4. Time Zone Section
   - Side-by-side comparison: "Kigali" vs "Destination"
   - Current time in each
   - Day/Night alignment visualization (semi-circle showing day/night overlap)
   - "+Xh" or "-Xh" indicator

5. Local Color Section
   - Blooms with timing (icons or tags)
   - Festivals with month
   - Natural phenomena

6. Personal Care Section (if data available)
   - Pilates studios (distance)
   - Afro hair care options
   - Styled as simple cards

7. Creepy Crawlies Section
   - Mosquitoes, Snakes, Spiders
   - Each with severity indicator (low/moderate/high)
   - "Tap to reveal" interaction for snakes (some people prefer not to know)

8. Footer
   - "Close" button
   - Link to opportunity detail page

Style:
- Full-screen modal on mobile, centered modal on desktop
- Cream background, charcoal text
- Generous padding between sections
- Serif headings, sans-serif body
- Scroll inside modal if content is long
```

---

## Task 4: Add Suitability Trigger to Opportunity Cards

**Prompt for Claude Code:**

```
Add a suitability index trigger to opportunity cards.

Files to modify:
- components/opportunities/OpportunityCard.tsx (or wherever the card is)

Requirements:
1. Add a small icon/button in the corner of each opportunity card
2. Icon: A simple gauge or "i" icon that hints at suitability data
3. On click: Opens the SuitabilityModal for that opportunity's location
4. Icon should have hover state showing "View Suitability"

The trigger should be subtle — it's not the main action (that's viewing the opportunity detail), but it's easily discoverable.

Also add suitability trigger to:
- Opportunity detail page (/opportunities/[slug])
- A visible "Suitability Index" button or link in the sidebar
```

---

## Task 5: Create Time Zone Visualization

**Prompt for Claude Code:**

```
Create the day/night alignment visualization component.

File: components/suitability/TimezoneAlignment.tsx

This shows how well aligned the user's day is with the destination.

Visual representation:
1. Two horizontal bars representing 24 hours
2. Top bar: User's location (Kigali)
3. Bottom bar: Destination
4. Daytime hours filled with light color
5. Nighttime hours filled with dark color
6. Vertical line showing "now"
7. Overlap area highlighted to show alignment

The goal is to show at a glance:
- "If it's 2pm for me, what time is it there?"
- "How many of my working hours overlap with theirs?"

Additional info to show:
- Current time in both locations
- Time difference (e.g., "+7 hours")
- Best times to call home
```

---

## Task 6: Create Creepy Crawlies Component

**Prompt for Claude Code:**

```
Create the creepy crawlies display component.

File: components/suitability/CreepyCrawlies.tsx

Requirements:
1. Display three main categories: Mosquitoes, Snakes, Spiders
2. Each shows severity level with visual indicator
3. Severity levels: low (green), moderate (yellow), high (red), seasonal (blue)
4. For Snakes: "Tap to reveal" interaction (hidden by default)
5. If "other" hazards exist, show them below

Visual style:
- Simple icons for each creature
- Severity as a colored badge or bar
- Subtle, not alarming — informative tone
- Optional: Show seasonal timing for mosquitoes if relevant
```

---

## Task 7: Create Local Color Section

**Prompt for Claude Code:**

```
Create the local color display component.

File: components/suitability/LocalColor.tsx

This showcases the cultural and natural highlights of a location.

Sections:
1. Blooms — Flowers and plants, when they bloom
   - Display as cards with month tag
   - Example: "Cherry Blossoms (APR)", "Autumn Colors (OCT)"

2. Festivals — Cultural events
   - Name, month, brief description
   - Example: "Annual Pottery Festival (MAY)"

3. Natural Phenomena — Ongoing natural features
   - Example: "Ancient cedar groves (YEAR-ROUND)"
   - Example: "Northern lights (WINTER)"

Style:
- Pull-quote style for standout items
- Month shown as small caps tag
- Warm, inviting presentation
- Could use small illustrations or icons if appropriate
```

---

## Task 8: Wire Up Suitability to Opportunities

**Prompt for Claude Code:**

```
Connect suitability data to opportunities.

Update lib/data.ts (or relevant data module) to:
1. When loading an opportunity, also load its suitability data
2. Match by location string (opportunity.location.display → suitability key)
3. Handle cases where suitability data doesn't exist for a location

Update app/opportunities/[slug]/page.tsx to:
1. Fetch suitability data for the opportunity's location
2. Pass it to a SuitabilitySection or SuitabilitySidebar component
3. Add "View Full Suitability Index" button that opens modal

Create a new component: components/suitability/SuitabilityPreview.tsx
- Shows a condensed version of suitability data
- Score, quick climate summary, timezone difference
- "See Full Details" expands to modal
- This goes in the opportunity detail page sidebar
```

---

## Task 9: Create Beach Access Component

**Prompt for Claude Code:**

```
Create the beach access display component.

File: components/suitability/BeachAccess.tsx

This shows how close the location is to beautiful beaches.

Two display modes:

1. **Nearby Beach** (when distance is available):
   - Distance (e.g., "15 min", "2 hour drive")
   - Beach names (clickable if we have coords for Google Maps)
   - Water type (Pacific Ocean, Mediterranean, etc.)
   - Swimmable indicator (Yes - warm water, Cold but beautiful, etc.)
   - Brief notes

2. **Flight Required** (for landlocked locations):
   - "Nearest Beach by Flight" header
   - Destination city and beach name
   - Flight duration (e.g., "2 hours from Denver")
   - Approximate cost ("$150-300 round trip")
   - Notes about the beach

Visual style:
- Beach icon (wave or umbrella)
- For nearby: Green/positive indicator
- For flight: Airplane icon, neutral presentation
- Cost shown in friendly format, not scary
- Link to Google Maps for beach location if coordinates available

Data schema for flight-required locations:
{
  "beachAccess": {
    "distance": "N/A",
    "type": "Landlocked",
    "nearestBeachFlight": {
      "destination": "San Diego, California",
      "beach": "La Jolla Cove",
      "flightDuration": "2 hours",
      "approximateCost": "$150-300 round trip",
      "notes": "Beautiful Pacific beaches, great for a weekend escape"
    }
  }
}
```

---

## Task 10: Style the Suitability Components

**Prompt for Claude Code:**

```
Apply the Le Four Argile design aesthetic to all suitability components.

Following DESIGN-GUIDE.md:
1. Cream backgrounds (#FAFAF8)
2. Charcoal text (#2D2D2A)
3. Serif font (Cormorant Garamond) for headers
4. Sans-serif (Inter) for body text
5. Generous whitespace
6. No harsh shadows or borders
7. Subtle, earthy accent colors

Specific styling needs:
- Modal: Full-bleed on mobile, centered with subtle shadow on desktop
- Score badge: Large, circular, elegant typography
- Climate chart: Muted colors (warm browns, soft blues for rainfall)
- Season cards: No visible borders, just spacing and typography
- Creepy crawlies: Subtle severity indicators, not alarm colors
- All hover states: Subtle opacity or underline, never jarring
```

---

## Implementation Notes

### Score Calculation Logic

The suitability score should reflect Winnie's priorities:

1. **Climate comfort** — BIGGEST factor. How close to ideal temperatures (20-25°C)?
2. **Culture & local color** — Blooms, festivals, traditions, ceramics ecosystem richness
3. **Food access** — Chili and coffee scores, local food scene
4. **Bug factor** — Inverse of creepy crawlies severity
5. **Timezone alignment** — SMALLEST factor. Hours overlap with Kigali working hours

**Revised Weights:**
```typescript
function calculateScore(data: SuitabilityData): number {
  const climateScore = calculateClimateScore(data.climate);       // 0-35 (35%)
  const cultureScore = calculateCultureScore(data.localColor, data.ceramicsEcosystem); // 0-25 (25%)
  const foodScore = calculateFoodScore(data.probabilityOfChili, data.probabilityOfCoffee); // 0-20 (20%)
  const bugScore = calculateBugScore(data.creepyCrawlies);        // 0-15 (15%)
  const timezoneScore = calculateTimezoneScore(data.utcOffset);   // 0-5 (5%)

  return Math.round(climateScore + cultureScore + foodScore + bugScore + timezoneScore);
}
```

**Climate Score Details (0-35):**
- Ideal: Average highs 20-25°C year-round = 35 points
- Penalty for extremes: Hot summers (>30°C) or cold winters (<5°C)
- Bonus for pleasant shoulder seasons

**Culture Score Details (0-25):**
- Rich blooms calendar: up to 8 points
- Festivals (especially ceramics): up to 8 points
- Natural phenomena: up to 4 points
- Strong ceramics ecosystem: up to 5 points

**Food Score Details (0-20):**
- Probability of Chili: up to 10 points
- Probability of Coffee: up to 10 points

**Bug Score Details (0-15):**
- Low everything: 15 points
- Moderate mosquitoes: -5 points
- High anything: -10 points

**Timezone Score Details (0-5):**
- Same timezone as Kigali (UTC+2): 5 points
- Within 3 hours: 4 points
- Within 6 hours: 3 points
- 7-9 hours difference: 2 points
- 10+ hours difference: 1 point

### Mobile Considerations

- Modal should be full-screen on mobile
- Climate chart should be horizontally scrollable if too wide
- Time zone visualization should stack vertically on narrow screens
- Touch-friendly tap targets (48px minimum)

### Accessibility

- Score should have aria-label explaining the rating
- Creepy crawlies "tap to reveal" should be keyboard accessible
- Climate chart should have text alternative
- Modal should trap focus and be dismissable with Escape

---

## Reference: V1 Screenshots

The V1 suitability index (visible at argile.room527.com) shows:

**Screenshot 1 — Montelupo Fiorentino:**
- Score: 26
- Summary: "TUSCAN CERAMICS TOWN! Cold winter. Hot summer. Easy calls home (1h difference). Limited comfort food options."
- Climate chart with monthly data
- Seasonal Rhythm cards
- Local Color: Cherry blossoms (APR), Annual Pottery Festival (MAY), Autumn colors (OCT), Ancient cedar groves (YEAR-ROUND)

**Screenshot 2 — San Francisco:**
- Time zone comparison: Kigali 13:51 vs Destination 20:51 (+7h)
- Day/Night alignment visualization
- Personal Care: Pilates Studio (8 km away), Afro Hair Care (Limited options, 45km)
- Creepy Crawlies: Mosquitoes (Jun-Sep), Snakes (Tap to reveal), Spiders (Common)

---

## File Structure

After implementation, suitability-related files should be:

```
lib/
  suitability.ts              # Data fetching and calculations

components/suitability/
  SuitabilityModal.tsx        # Main modal container
  SuitabilityPreview.tsx      # Condensed sidebar version
  ClimateChart.tsx            # Temperature/rainfall visualization
  TimezoneAlignment.tsx       # Day/night overlap visualization
  SeasonalRhythm.tsx          # Four seasons display
  LocalColor.tsx              # Blooms, festivals, phenomena
  CreepyCrawlies.tsx          # Bug severity display
  BeachAccess.tsx             # Beach distance or flight info
  CeramicsEcosystem.tsx       # Studios, suppliers, galleries with links
  PersonalCare.tsx            # Pilates, hair care, etc.
  SuitabilityScore.tsx        # Score badge component

data/suitability/
  index.json                  # Full suitability data (already exists)
```

---

## Priority Order

1. **Task 1** — Data utilities (foundation)
2. **Task 8** — Wire up to opportunities (makes it usable)
3. **Task 3** — Main modal (most visible)
4. **Task 2** — Climate chart (key visual — Winnie loves this!)
5. **Task 7** — Local color (culture is high priority)
6. **Task 9** — Beach access (including flight details for landlocked)
7. **Task 6** — Creepy crawlies
8. **Task 5** — Timezone visualization (lowest priority per Winnie)
9. **Task 4** — Triggers on cards
10. **Task 10** — Final styling polish

---

## Data Enrichment Required

Before implementation, the suitability data needs enrichment. See **DATA-ENRICHMENT-TASKS.md** for details:

1. **32 landlocked locations** need `nearestBeachFlight` data with flight duration and cost
2. **All 155 locations** need ceramics ecosystem converted from strings to objects with URLs

Example ceramics ecosystem enhancement:
```json
// Current (strings):
"studios": ["Humboldt State ceramics", "Arcata Artisans"]

// Needed (objects with URLs):
"studios": [
  { "name": "Cal Poly Humboldt Ceramics", "url": "https://...", "notes": "University program" },
  { "name": "Arcata Artisans", "url": "https://arcataartisans.com", "notes": "Co-op gallery" }
]
```

This allows the UI to render clickable links in the Ceramics Ecosystem section.
9. **Task 9** — Final styling polish
