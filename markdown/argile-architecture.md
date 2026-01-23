# Le Four Argile — Architecture Document

> A ceramics learning portal for Winnie
> Rebuilt from the ground up with proper routing, JSON-based data, and room to grow

---

## V1 BASELINE — WHAT EXISTS

**Live at:** argile.room527.com

V1 is already a thoughtfully designed implementation. V2 should **port existing functionality first**, then enhance. Do not redesign what's working.

**What to port exactly as-is:**
- Suitability Index modal (all sections, all styling)
- Climate almanac graph
- Seasonal rhythm layout
- Local color list format
- Ceramics ecosystem three-column layout
- Indigenous roots callout style
- Food constellation (Probability of Chili™, etc.)
- Beach & escape section
- Time zone widget with day/night alignment
- Personal care section

**What to improve in v2:**
- Proper URL routing (every page has a URL)
- Infinite scroll on opportunities (not load-more)
- Complete data for ALL opportunities
- Add new suitability fields (dark sky, elevation) as enhancements
- Living Pulse feature (new)

**The v2 rebuild is about architecture, not aesthetics.**
The look and feel is already correct. Focus on:
1. Clean Next.js App Router structure
2. JSON data fully populated
3. All routes working with back/forward
4. No Winchester House sprawl

---

## Guiding Principles

1. **Utility first** — It needs to work reliably before it's beautiful
2. **Proper routing** — Every page has a real URL (Next.js App Router), not state-based views. Back/forward must work.
3. **No Winchester House** — Planned architecture, not rooms bolted on
4. **JSON-native** — All data lives in JSON files, no Airtable dependency
5. **Evolvable** — Structure allows new features without rewrites
6. **Design inspiration** — ash.design.fr aesthetic (editorial, spacious, sophisticated)

---

## Visual Design Principles

**Overall feel:** Editorial, spacious, sophisticated. Like a well-designed magazine or museum catalog.

**Depth & Richness:**
Cards and content blocks should have subtle depth:
- Soft background tint (slightly different from page background)
- Subtle drop shadows (`shadow-md` or custom soft shadow)
- **Hover lift** — Cards rise slightly on hover (`hover:-translate-y-1 hover:shadow-lg transition`)
- Varying card sizes where appropriate (featured items larger)

**Layering techniques:**
- Frosted glass for overlays/modals (`backdrop-blur-sm bg-white/80`)
- Inset shadows on input fields
- 1px borders slightly darker than background for definition
- Overlapping elements where it adds interest

**Typography:**
- Editorial serif for headings (Instrument Serif, Fraunces, or similar)
- Clean sans-serif for body (Inter, Source Sans, or similar)
- Generous line height and letter spacing
- Restrained use of bold — let hierarchy come from size

**Color:**
- Muted, warm palette
- Cards can have subtle tinted backgrounds
- Avoid pure black — use warm darks
- Accent color used sparingly

**Spacing:**
- Generous whitespace
- Let content breathe
- Asymmetry where it adds interest

**Interactions:**
- Smooth transitions (150-300ms)
- Hover states that feel responsive but not jumpy
- Loading states that don't jar

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14+ (App Router) | File-based routing, SSG for speed, API routes for AI |
| Styling | Tailwind CSS | Utility-first, consistent with XO |
| Data | Local JSON files | Simple, no external dependencies, version controlled |
| Visualization | D3.js | Connections graph, map view |
| Maps | Mapbox or Leaflet | Opportunities map view |
| AI | Claude API | Winnie's ceramics mentor |
| Hosting | Vercel | Seamless Next.js deployment |

---

## Site Structure

```
/                           → Landing / Dashboard
/glazes                     → Glaze recipe browser (cards view)
/glazes/[slug]              → Individual glaze detail
/glazes/my-materials        → Material inventory + filtered recipes
/inspirations               → Inspiration browser (multiple view modes)
/inspirations/[slug]        → Individual inspiration detail
/inspirations/connections   → D3 network graph exploration
/opportunities              → Opportunities browser (list + filters)
/opportunities/[slug]       → Individual opportunity detail
/opportunities/map          → Map view of all opportunities
/mentor                     → AI chat interface (or persistent drawer?)
```

---

## Data Architecture

All data lives in `/data/` folder:

```
data/
├── glazes/
│   ├── index.json          → All glaze recipes (from Digital Fire)
│   └── schema.json         → Glaze data structure reference
├── inspirations/
│   ├── index.json          → All inspiration entries
│   ├── tags.json           → Tag taxonomy for connections
│   └── schema.json         → Inspiration data structure
├── opportunities/
│   ├── index.json          → All opportunities (master file)
│   ├── suitability.json    → Suitability index calculations
│   └── schema.json         → Opportunity data structure
├── materials/
│   └── index.json          → All glaze materials/ingredients
└── user/
    ├── inventory.json      → Winnie's material inventory
    ├── saved.json          → Saved/favorited items
    └── notes.json          → Personal notes on glazes
```

**Data Persistence Strategy:**

| Data Type | Storage | Rationale |
|-----------|---------|-----------|
| Glazes, Opportunities, Inspirations | JSON in repo | Version controlled, deploys with site |
| Materials list | JSON in repo | Reference data, changes rarely |
| Winnie's inventory | localStorage | Personal data, single user |
| Saved/favorited items | localStorage | Personal preferences |
| Notes | localStorage | Personal annotations |
| Chat history | sessionStorage | Clears on close, not permanent |

Since this is Winnie's personal tool (not multi-user), localStorage is sufficient for her data. No backend needed. Her preferences persist across sessions on the same device.

### Glaze Schema
```json
{
  "id": "string",
  "slug": "string",
  "name": "string",
  "source": "Digital Fire",
  "sourceUrl": "string",
  "cone": "string",
  "atmosphere": "oxidation | reduction | both",
  "surface": "matte | satin | gloss",
  "colorFamily": ["string"],
  "materials": [
    { "name": "string", "percentage": "number" }
  ],
  "image": {
    "url": "string | null",
    "placeholder": { "colors": ["#hex"], "pattern": "solid | gradient" }
  },
  "tags": ["string"],
  "notes": "string | null"
}
```

### Opportunity Schema
```json
{
  "id": "string",
  "slug": "string",
  "name": "string",
  "type": "school | residency | apprenticeship | grant | scholarship | internship | mentorship",
  "location": {
    "city": "string",
    "region": "string",
    "country": "string",
    "coordinates": { "lat": "number", "lng": "number" },
    "timezoneOffset": "number (hours from UTC)"
  },
  "details": {
    "duration": "string",
    "cost": "string",
    "deadline": "string | null",
    "url": "string",
    "description": "string"
  },
  "suitability": {
    "score": "number (0-100)",
    "summary": "string (one-line like 'Cold winter. Challenging time for calls home.')",
    
    "climate": {
      "monthly": [
        { "month": "J", "tempC": "number", "rainMm": "number" }
      ],
      "comfortZone": { "min": 21, "max": 28 },
      "events": [
        { "name": "string", "month": "string", "type": "event" }
      ]
    },
    
    "seasonalRhythm": {
      "winter": { "months": "Dec-Feb", "description": "string" },
      "spring": { "months": "Mar-May", "description": "string" },
      "summer": { "months": "Jun-Aug", "description": "string" },
      "autumn": { "months": "Sep-Nov", "description": "string" }
    },
    
    "localColor": [
      { 
        "name": "string", 
        "description": "string", 
        "timing": "string (APR, YEAR-ROUND, etc.)" 
      }
    ],
    
    "ceramicsEcosystem": {
      "tradition": { "name": "string", "since": "string | null" },
      "studios": { "count": "string (200+ potters)", "note": "string" },
      "museums": { "count": "string (3 ceramic museums)", "note": "string" }
    },
    
    "indigenousRoots": {
      "title": "string (Jōmon pottery tradition — 16,000 years)",
      "description": "string",
      "links": ["Archaeological sites nearby", "Museum exhibits"]
    } | null,
    
    "foodConstellation": {
      "chili": { "score": "number", "label": "string", "note": "string" },
      "chocolateCake": { "score": "number", "label": "string", "note": "string" },
      "specialtyCoffee": { "score": "number", "label": "string", "note": "string" }
    },
    
    "beachEscape": {
      "name": "string",
      "description": "string",
      "distanceKm": "number",
      "driveTime": "string"
    } | null,
    
    "personalCare": {
      "pilates": { "distanceKm": "number", "name": "string", "rating": "string" },
      "afroHairCare": { "availability": "string", "note": "string" }
    }
  },
  "tags": ["string"]
}
```

**Note:** This schema matches the v1 suitability index implementation. All fields should be populated for each opportunity. The `indigenousRoots` and `beachEscape` fields can be null if not applicable.

### Inspiration Schema
```json
{
  "id": "string",
  "slug": "string",
  "title": "string",
  "type": "visual | story | connection",
  "content": {
    "image": "string | null",
    "text": "string | null",
    "source": "string | null",
    "sourceUrl": "string | null"
  },
  "tags": ["string"],
  "connections": ["inspiration-id"]
}
```

---

## Feature Specifications

### 1. Glazes

**Browse View** (`/glazes`)
- Card grid with visual thumbnails (placeholder colors if no photo)
- Each card: image, name, cone, surface type
- Click card → detail page
- Filter bar: cone range, surface, color family, atmosphere
- "My Materials" button → filtered view

**Detail View** (`/glazes/[slug]`)
- Hero image (or color placeholder)
- Recipe breakdown (materials + percentages)
- Properties (cone, atmosphere, surface)
- Tags
- "View on Digital Fire" external link
- Save button, notes field
- AI mentor: "Ask about this glaze"

**My Materials** (`/glazes/my-materials`)
- Left panel: material inventory (add/remove)
- Right panel: recipes you can make
- "Almost there" section: recipes needing 1-2 more ingredients
- AI suggestion: "To unlock more glazes, consider adding: [X, Y, Z]"

### 2. Inspirations

**Browse View** (`/inspirations`)
- Mixed card grid (visual cards + story cards)
- Visual cards: image-dominant, minimal text
- Story cards: text-forward, maybe a small image
- Filter by tags
- View toggle: Grid | Connections

**Connections View** (`/inspirations/connections`)
- D3 force-directed graph
- Nodes = inspiration entries
- Edges = shared tags
- Click node → shows detail panel
- Hover → highlights connected nodes
- Can navigate infinitely through the network
- 2-3 degrees visible from selected node

**Detail View** (`/inspirations/[slug]`)
- Full content display
- Related inspirations (via tags)
- Click related → navigates to that detail

### 3. Opportunities (HIGHEST PRIORITY)

**Browse View** (`/opportunities`)
- Infinite scroll (NOT paginated)
- Filter sidebar:
  - Type (school, residency, etc.)
  - Region/country
  - Suitability score range
  - Cost (free, paid, stipend)
- Sort: suitability score, alphabetical, deadline

**Opportunity Cards — KEEP CLEAN**

Cards should be minimal and restrained. NO suitability data bleeding into cards.

Card shows ONLY:
- Name
- Type badge (School / Residency / Grant / etc.)
- Location (City, Country)
- Small suitability score indicator (just the number, subtle)

Card does NOT show:
- Climate info
- Local color
- Ceramics ecosystem details
- Any other suitability enrichment

The suitability content is a REWARD for clicking into an opportunity, not a distraction while browsing. Keep the browse experience clean, museum-grade, professional.

```
┌─────────────────────────────────┐
│                                 │
│  Haystack Mountain School       │
│  RESIDENCY · Deer Isle, USA     │
│                          [72]   │
│                                 │
└─────────────────────────────────┘
```

**Map View** (`/opportunities/map`)
- Full-screen map
- Pins colored by type
- Click pin → popup with summary
- Same filters as list view
- Toggle between map and list

**Detail View** (`/opportunities/[slug]`)

**Primary content (always visible):**
- Name, type badge, location
- Description
- Practical details: duration, cost, deadlines
- Application link
- Save/favorite button

**Suitability Index — Modal Overlay (PORT FROM V1 EXACTLY)**

The suitability index opens as a **separate modal/overlay**, not inline expansion. This is already implemented beautifully at argile.room527.com. Port it exactly.

**Modal structure:**
```
┌─────────────────────────────────────────────────────────┐
│  SUITABILITY INDEX                    [CC Mode]  [×]   │
│  Chicago, Illinois                                      │
│                                                         │
│  ┌────┐                                                │
│  │ 24 │  Cold winter. Challenging time for calls       │
│  └────┘  home (8h difference).                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CLIMATE ALMANAC                                        │
│  [Temperature graph with comfort zone band,            │
│   monthly temps, rain indicators, event markers]       │
│                                                         │
│  SEASONAL RHYTHM                                        │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │ WINTER   │ SPRING   │ SUMMER   │ AUTUMN   │        │
│  │ Dec-Feb  │ Mar-May  │ Jun-Aug  │ Sep-Nov  │        │
│  │ [desc]   │ [desc]   │ [desc]   │ [desc]   │        │
│  └──────────┴──────────┴──────────┴──────────┘        │
│                                                         │
│  LOCAL COLOR                                            │
│  ● Cherry blossoms                              APR    │
│    Parks and rivers filled with pink...                │
│  ● Annual Pottery Festival                      MAY    │
│    500+ potters gather...                              │
│  ● Autumn colors                                OCT    │
│    Mountain foliage spectacular...                     │
│                                                         │
│  CERAMICS ECOSYSTEM                                     │
│  ┌──────────────┬──────────────┬──────────────┐       │
│  │ TRADITION    │ STUDIOS      │ MUSEUMS      │       │
│  │ Mingei folk  │ 200+ potters │ 3 ceramic    │       │
│  │ Since 1853   │ Open year-   │ Including    │       │
│  │              │ round        │ Hamada coll. │       │
│  └──────────────┴──────────────┴──────────────┘       │
│                                                         │
│  INDIGENOUS ROOTS                                       │
│  ┃ Jōmon pottery tradition — 16,000 years             │
│  ┃ This region was home to Jōmon people who created   │
│  ┃ some of the world's oldest pottery...              │
│  ┃ Archaeological sites nearby · Museum exhibits      │
│                                                         │
│  FOOD CONSTELLATION                                     │
│  ┌──────────────┬──────────────┬──────────────┐       │
│  │ PROBABILITY  │ CHOCOLATE    │ SPECIALTY    │       │
│  │ OF CHILI™    │ CAKE         │ COFFEE       │       │
│  │ 23 Low       │ 87 Excellent │ 94 Paradise  │       │
│  │ Nearest 12km │ 3 great spots│ Rwandan beans│       │
│  └──────────────┴──────────────┴──────────────┘       │
│                                                         │
│  BEACH & ESCAPE                                         │
│  Nearest beautiful beach                     45 km     │
│  Oarai Beach — sandy, good swimming          ~1 hour → │
│  [Expanded card with map link]                         │
│                                                         │
│  [Time zone widget: Kigali vs Destination]             │
│  [Day & Night Alignment visualization]                 │
│                                                         │
│  PERSONAL CARE                                          │
│  ┌─────────────────────┬─────────────────────┐        │
│  │ PILATES STUDIO      │ AFRO HAIR CARE      │        │
│  │ 8 km away           │ Limited options     │        │
│  │ Studio Breath 4.7★  │ Nearest 45km (city) │        │
│  └─────────────────────┴─────────────────────┘        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key design elements to preserve:**
- Modal with "SUITABILITY INDEX" header, CC Mode toggle, close button
- Score in circle with one-line summary
- ALL CAPS section labels with subtle underlines
- Climate almanac graph (temperature + comfort zone + rain + events)
- Four-column seasonal rhythm
- Local color as list with month/timing on right
- Ceramics ecosystem as three equal columns
- Indigenous roots as highlighted callout with left border
- Food constellation with playful personal metrics (Probability of Chili™)
- Beach & escape with distance and drive time
- Time zone comparison widget (Kigali vs destination)
- Day & night alignment visualization (awake/sleeping overlap)
- Personal care section (pilates, hair care — personalized for Winnie)

---

### CC Mode — A Parallel Universe

CC Mode is an easter egg with gravity. When toggled, the suitability index transforms to serve CC's interests instead of Winnie's ceramics focus.

**Who is CC:**
CC is Winnie's best friend — a fashion designer who's sweet, fun, and supportive. She deserves her own doorway.

**What changes in CC Mode:**

| Winnie Mode | CC Mode |
|-------------|---------|
| Ceramics Ecosystem | Fashion & Textile Scene |
| Indigenous Roots (pottery) | Textile traditions, craft heritage |
| Studios & Museums | Ateliers, fabric markets, fashion shows |
| Probability of Chili™ | Cannabis culture & accessibility |
| Local Color (ceramics events) | Fashion weeks, sample sales, vintage markets |

**CC Mode: Fashion Focus**
For each location, surface:
- Nearby fabric markets & textile districts
- Garment manufacturing (with MOQ info where available)
- Fashion shows, design weeks
- Grants, competitions, awards for emerging designers
- Opportunities to show work (not school — she wants to *show*, not learn)
- Famous fashion houses with roots in the area
- Atelier culture, apprenticeship possibilities

**CC Mode: Cannabis Culture**
The playful layer. For each location:
- **Legal status** — Letter grade (A+ to F) for accessibility
- **History** — Landrace strains from the region, hash traditions, cultural context
- **Stories** — Interesting grows, famous busts, counterculture moments
- **Tourism** — Can you visit farms? Dispensaries? Cannabis cafes?
- **Price/quality** — What's the scene actually like?

Example regional flavor:
- *Northern California*: A+ accessibility, legendary growing region, Emerald Triangle history
- *Thailand*: Was F (death penalty), now shifting — complex legal history
- *Amsterdam*: Historic coffee shop culture, hash traditions, tourism infrastructure
- *Morocco*: Hash heartland, Rif Mountains, traditional production

**CC Mode data structure:**
```json
{
  "ccMode": {
    "cannabis": {
      "grade": "A+ | A | B | C | D | F",
      "legalStatus": "string",
      "history": "string (landrace strains, cultural context)",
      "stories": ["string"],
      "tourism": "string | null",
      "priceQuality": "string"
    },
    "fashion": {
      "textileScene": "string",
      "fabricMarkets": ["string"],
      "manufacturing": {
        "available": "boolean",
        "moqNotes": "string | null"
      },
      "fashionEvents": ["string"],
      "opportunities": ["string (grants, competitions, shows)"],
      "heritage": "string | null"
    }
  }
}
```

**UI behavior:**
- Toggle in top-right of suitability modal (already exists in v1)
- Smooth transition between modes
- Dark mode aesthetic when CC Mode active (optional enhancement)
- Content sections swap, structure stays same

**Phase:** CC Mode is a delight layer — build after core Winnie functionality works. But design the data structure now so it can be populated incrementally. The toggle already exists in v1; the work is populating the CC-specific data.

---

**Data requirements per opportunity (Winnie mode):**
All of these sections need data. For v2, ensure every opportunity has:
- climate data (monthly temps, rain, events)
- seasonal descriptions
- local color events (2-4 per location)
- ceramics ecosystem info
- indigenous pottery history (where applicable)
- food constellation scores
- nearest beach
- time zone offset from Kigali
- personal care availability

**Implementation notes:**
- This is ALREADY BUILT in v1. Port the component wholesale.
- Do not redesign. Do not simplify. Keep all sections.
- Focus energy on ensuring DATA is complete for all opportunities.
- Future enhancements (dark sky, living pulse) ADD to this, not replace.

### 4. AI Mentor

**Implementation: Persistent drawer**
- Slides in from right side, accessible from any page via floating button
- Stays open while navigating (doesn't reset)
- Can be minimized/collapsed
- Conversation history persists in session

**Context awareness:**
The mentor knows which page the user is on and adjusts accordingly:

| Page | Context Behavior |
|------|------------------|
| `/glazes` | Focuses on recipe queries, ingredient questions |
| `/glazes/[slug]` | Has current glaze in context, can explain it |
| `/glazes/my-materials` | Knows inventory, suggests what to add |
| `/opportunities` | Can explain suitability scores, compare options |
| `/opportunities/[slug]` | Has current opportunity details |
| `/inspirations` | More open-ended creative discussion |

**Glaze-specific capabilities:**
- "What glazes can I make with these materials?"
- "What's one ingredient I could add to unlock more recipes?"
- "Explain the role of [material] in this glaze"
- "Why might this glaze be running/crawling/pinholing?"
- "Suggest a base cone 6 glaze palette"
- "What materials should I buy first as a beginner?"

**Formulation assistance:**
- Can help compose new recipes
- Suggests substitutions when missing ingredients
- Explains chemistry basics (silica:alumina ratio, flux, etc.)
- Warns about potentially problematic combinations

**Troubleshooting:**
- Firing issue diagnosis
- Surface defect identification
- Adjustment recommendations

**Data context (injected into system prompt):**
- Full glaze database
- Materials database  
- Winnie's current inventory
- Her saved glazes and notes
- Current page context

---

## File Structure

```
argile/
├── app/
│   ├── layout.tsx                 → Root layout, nav, AI drawer
│   ├── page.tsx                   → Landing/dashboard
│   ├── glazes/
│   │   ├── page.tsx               → Browse glazes
│   │   ├── [slug]/page.tsx        → Glaze detail
│   │   └── my-materials/page.tsx  → Material inventory
│   ├── inspirations/
│   │   ├── page.tsx               → Browse inspirations
│   │   ├── [slug]/page.tsx        → Inspiration detail
│   │   └── connections/page.tsx   → D3 graph view
│   ├── opportunities/
│   │   ├── page.tsx               → Browse opportunities
│   │   ├── [slug]/page.tsx        → Opportunity detail
│   │   └── map/page.tsx           → Map view
│   ├── mentor/
│   │   └── page.tsx               → AI chat (if standalone)
│   └── api/
│       └── chat/route.ts          → Claude API endpoint
├── components/
│   ├── ui/                        → Shared UI components
│   ├── glazes/                    → Glaze-specific components
│   ├── inspirations/              → Inspiration components
│   ├── opportunities/             → Opportunity components
│   └── mentor/                    → AI chat components
├── data/                          → All JSON data files
├── lib/
│   ├── data.ts                    → Data loading utilities
│   └── ai.ts                      → Claude API helpers
├── claude/
│   ├── ARCHITECTURE.md            → This document
│   ├── TASKS.md                   → Current implementation tasks
│   └── COWORKER.md                → Desktop automation instructions
└── public/
    └── images/                    → Local images if needed
```

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Initialize Next.js project with App Router
- [ ] Set up Tailwind with design tokens (colors, typography)
- [ ] Create root layout with navigation
- [ ] Set up data loading utilities
- [ ] Import existing opportunity JSON data
- [ ] Build opportunities list with infinite scroll
- [ ] Build opportunity detail page with full suitability index

### Phase 2: Opportunities Complete
- [ ] Add filter sidebar
- [ ] Implement map view with Mapbox/Leaflet
- [ ] Add save functionality (local storage or JSON)
- [ ] Ensure all suitability fields are populated in data

### Phase 3: Glazes
- [ ] Import Digital Fire glaze data
- [ ] Build glaze browse view with filters
- [ ] Build glaze detail page
- [ ] Implement materials inventory system
- [ ] Build "recipes you can make" filter
- [ ] Add "almost there" suggestions

### Phase 4: Inspirations
- [ ] Define tag taxonomy
- [ ] Build browse view with mixed card types
- [ ] Build detail view with related items
- [ ] Implement D3 connections graph

### Phase 5: AI Mentor
- [ ] Set up Claude API route
- [ ] Build chat interface
- [ ] Add context awareness (current page, user data)
- [ ] Train on glaze troubleshooting patterns

### Phase 6: Polish
- [ ] Responsive design pass
- [ ] Performance optimization
- [ ] ash.design.fr aesthetic refinement
- [ ] Edge cases and error states

---

## Coworker Tasks

Coworker is ideal for:

1. **Glaze image curation** — Visit Digital Fire pages, identify best representative image for each glaze, download with proper naming
2. **JSON compilation** — Combine multiple JSON exports into master files, validate formatting, fix bracket issues
3. **Data enrichment** — For each opportunity, search for nearby studios/museums and add to suitability index
4. **Bulk file renaming** — Organize downloaded assets with consistent naming conventions

---

## Living Pulse — The Breathing Layer

Argile isn't just a database. It's connected to larger rhythms — cosmic, seasonal, cultural. This layer makes it feel alive.

### Static Sense of Place (Suitability Additions)

Each opportunity location gets enriched with:

```json
{
  "suitability": {
    "darkSky": {
      "bortleClass": 4,
      "bortleDescription": "Rural/suburban transition",
      "starsVisible": "Milky Way visible but washed out near horizon",
      "clearNightsPerYear": 180,
      "nearestDarkSkyPark": "Cherry Springs State Park (2 hr drive)"
    },
    "daylight": {
      "summerSolstice": "15.5 hours",
      "winterSolstice": "9 hours",
      "variation": "high",
      "note": "Long summer evenings, short winter days"
    },
    "elevation": {
      "meters": 450,
      "feet": 1476,
      "note": "Moderate altitude — no kiln adjustments needed"
    }
  }
}
```

**Data sources for Coworker to populate:**
- Dark sky: lightpollutionmap.info, darksky.org
- Clear nights: climate data, weather APIs
- Daylight: calculated from latitude
- Elevation: Google Elevation API, topographic data

---

### Dynamic Pulse (Background Agent)

A Vercel cron job that runs daily, fetching current information:

**Cosmic Weather**
| Data | Source | Update Frequency |
|------|--------|------------------|
| Solar activity (flares, storms) | NOAA Space Weather API | Daily |
| Aurora forecast | NOAA OVATION model | Daily |
| Geomagnetic storm alerts | spaceweather.com | Daily |

**Astronomy Events**
| Data | Source | Update Frequency |
|------|--------|------------------|
| Moon phase & rise/set times | USNO API or astronomy libraries | Daily |
| Meteor showers | IMO calendar | Weekly |
| Eclipses, conjunctions | Astronomy event feeds | Weekly |
| Planets visible tonight | Stellarium API or calculated | Daily |

**Ceramics World**
| Data | Source | Update Frequency |
|------|--------|------------------|
| Exhibition openings | Ceramic Arts Network RSS | Weekly |
| Competition deadlines | NCECA, craft org feeds | Weekly |
| Notable news | Curated RSS feeds | Weekly |

**Output:** `/data/pulse/current.json` — refreshed by cron, read by site

---

### Celestial Moment Detection — "Magic Hour Alerts"

The crown jewel. Predicting moments of beauty and surfacing them.

**Full Moon at Sunset**
When the full moon rises within ±30 minutes of sunset, AND clear skies are forecast:
→ Alert: "Tonight: Full moon rises as the sun sets. Find a clear eastern horizon around 6:45pm."

**Calculation:**
- Full moon dates are known years in advance
- Moon rise time = calculable from date + location
- Sunset time = calculable from date + location
- Weather = forecast API (OpenWeather, Tomorrow.io)
- If |moonrise - sunset| < 30 min AND cloud_cover < 30%: trigger alert

**Other detectable moments:**
| Moment | Trigger Condition |
|--------|-------------------|
| **Moonrise at sunset** | Full moon ± 1 day, times within 30 min |
| **Golden hour** | 1 hour before sunset, clear skies |
| **Blue hour** | 20-40 min after sunset, clear skies |
| **Meteor shower peak** | Known dates + clear skies + moon below horizon |
| **Aurora possible** | Kp index ≥ 5 + location latitude + clear skies |
| **Planetary conjunction** | Two bright planets within 2° |
| **ISS visible pass** | NASA Spot the Station data |

**Location awareness:**
For these alerts to work, we need Winnie's current location (or default to a saved location). Could be:
- Manual setting in preferences
- Browser geolocation (with permission)
- Default to a "home base" location

---

### UI: The Pulse Component

Small, elegant, non-intrusive. Lives on dashboard or as collapsible section.

**Normal state:**
```
┌─────────────────────────────────────────┐
│  ✧ RIGHT NOW                            │
├─────────────────────────────────────────┤
│  ☽ Waxing gibbous · 87% illuminated     │
│  ☉ Sunset today: 5:23pm                 │
│  ✦ Solar activity: Quiet                │
│                                         │
│  THIS WEEK IN CERAMICS                  │
│  → "Radical Clay" closes Sunday at MFA  │
│  → NCECA proposals due Feb 1            │
└─────────────────────────────────────────┘
```

**Magic moment state (highlighted):**
```
┌─────────────────────────────────────────┐
│  ✧ TONIGHT                         ★    │
├─────────────────────────────────────────┤
│  ┃ FULL MOON RISING AT SUNSET           │
│  ┃                                      │
│  ┃ The moon rises at 5:18pm, just 5     │
│  ┃ minutes before sunset. Clear skies   │
│  ┃ forecast. Find an eastern horizon.   │
│  ┃                                      │
│  ┃ Peak color: ~5:15-5:45pm             │
└─────────────────────────────────────────┘
```

---

### Implementation Phase

This is Phase 6+ (delight layer), but designed-for now:

**Phase 6a: Static enrichment**
- Add dark sky, daylight, elevation to opportunity suitability
- Coworker researches and populates

**Phase 6b: Basic pulse**
- Vercel cron job fetching moon phase, sunset times
- Simple "Right Now" component on dashboard

**Phase 6c: Ceramics feed**
- RSS aggregation for ceramics news
- Weekly digest

**Phase 6d: Magic moment detection**
- Full moon/sunset calculation
- Weather integration
- Alert surfacing

**Phase 6e: Extended moments**
- Aurora alerts
- Meteor shower conditions
- ISS passes

---

## Questions to Resolve

1. ~~Should the AI mentor be a persistent drawer or a dedicated page?~~ **RESOLVED: Persistent drawer with page context awareness**
2. What's the tag taxonomy for inspirations? (Need to define upfront for connections to work)
3. ~~Where do glaze images come from initially?~~ **RESOLVED: Start with placeholder colors, Coworker scrapes images where available**
4. ~~Should user data (inventory, saves, notes) persist locally or sync somewhere?~~ **RESOLVED: localStorage for single-user simplicity**

**New questions:**
5. What cone ranges does Winnie primarily work with? (Affects suggested base glazes)
6. What categories should materials be organized into? (Fluxes, silica sources, colorants, opacifiers, etc.)

---

## Notes for Claude Code

- ALWAYS use Next.js App Router (`/app` directory), not Pages Router
- Every view must have its own URL route
- Use `loading.tsx` for loading states
- Data fetching should happen in Server Components where possible
- Test on deployed Vercel, not just localhost
- When adding new data fields, add them to ALL entries, not just some
- If something works locally but not on Vercel, check: env vars, build-time vs runtime data, case sensitivity
