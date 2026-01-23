# Claude Code Instructions — Argil v2

> A ceramics learning portal for Winnie, rebuilt from scratch with Next.js App Router

---

## What This Is

You're building **Le Four Argile v2** — a personal ceramics resource app. The folder structure is already created. Your job is to populate it with working code.

---

## Tech Stack

- **Framework:** Next.js 14+ with App Router (`/app` directory, NOT Pages Router)
- **Styling:** Tailwind CSS
- **Data:** Local JSON files (no database, no Airtable)
- **Visualization:** D3.js for the connections graph
- **Maps:** Mapbox or Leaflet for opportunities map
- **AI:** Claude API for the mentor feature
- **Hosting:** Vercel

---

## Current Folder Structure

```
Argil-v2/
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
│   │   └── page.tsx               → AI chat interface
│   └── api/
│       └── chat/route.ts          → Claude API endpoint
├── components/
│   ├── ui/                        → Shared UI components
│   ├── glazes/                    → Glaze-specific components
│   ├── inspirations/              → Inspiration components
│   ├── opportunities/             → Opportunity components
│   └── mentor/                    → AI chat components
├── data/
│   ├── glazes/
│   │   ├── index.json             → All glaze recipes
│   │   └── schema.json            → Glaze data structure
│   ├── inspirations/
│   │   ├── index.json             → All inspiration entries
│   │   ├── tags.json              → Tag taxonomy
│   │   └── schema.json            → Inspiration structure
│   ├── opportunities/
│   │   ├── index.json             → All opportunities
│   │   ├── suitability.json       → Suitability calculations
│   │   └── schema.json            → Opportunity structure
│   ├── materials/
│   │   └── index.json             → All glaze materials
│   └── user/
│       ├── inventory.json         → User's material inventory
│       ├── saved.json             → Saved/favorited items
│       └── notes.json             → Personal notes
├── lib/
│   ├── data.ts                    → Data loading utilities
│   └── ai.ts                      → Claude API helpers
├── claude/                        → Documentation (reference only)
└── public/
    └── images/                    → Local images
```

---

## Priority Order

### Phase 1: Foundation (DO THIS FIRST)

1. Initialize Next.js project (`npx create-next-app@latest . --typescript --tailwind --app`)
2. Set up Tailwind with design tokens
3. Create root `layout.tsx` with navigation
4. Create `lib/data.ts` for loading JSON files
5. Create placeholder JSON files in `/data` with sample entries

### Phase 2: Opportunities (HIGHEST PRIORITY FEATURE)

1. Build `/opportunities/page.tsx` — card grid with infinite scroll
2. Build `/opportunities/[slug]/page.tsx` — full detail with suitability index
3. Add filter sidebar (type, region, suitability score, cost)
4. Build `/opportunities/map/page.tsx` with Mapbox or Leaflet

### Phase 3: Glazes

1. Build `/glazes/page.tsx` — card grid with filters
2. Build `/glazes/[slug]/page.tsx` — recipe detail
3. Build `/glazes/my-materials/page.tsx` — inventory system

### Phase 4: Inspirations

1. Build `/inspirations/page.tsx` — mixed card grid
2. Build `/inspirations/[slug]/page.tsx` — detail view
3. Build `/inspirations/connections/page.tsx` — D3 force graph

### Phase 5: AI Mentor

1. Set up `/api/chat/route.ts` with Claude API
2. Build chat UI in `/mentor/page.tsx`
3. Add context awareness

---

## Data Schemas

### Opportunity
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
    "coordinates": { "lat": "number", "lng": "number" }
  },
  "suitability": {
    "score": "number (0-100)",
    "localColor": "string",
    "nearbyStudios": ["string"],
    "nearbyMuseums": ["string"],
    "ceramicsScene": "string",
    "climate": "string",
    "costOfLiving": "low | medium | high",
    "languageRequirement": "string",
    "visaComplexity": "low | medium | high"
  },
  "details": {
    "duration": "string",
    "cost": "string",
    "deadline": "string | null",
    "url": "string",
    "description": "string"
  },
  "tags": ["string"]
}
```

### Glaze
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

### Inspiration
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

## Critical Rules

1. **ALWAYS use App Router** (`/app` directory) — never Pages Router
2. **Every view needs its own URL** — back/forward must work
3. **Use `loading.tsx`** for loading states
4. **Server Components by default** — fetch data there when possible
5. **JSON data lives in `/data`** — use `lib/data.ts` to load it
6. **Test on Vercel, not just localhost** — check env vars, case sensitivity
7. **When adding data fields, add to ALL entries** — not just some

---

## Design Direction

Aesthetic inspiration: **ash.design.fr** — editorial, spacious, sophisticated. Utility first, but aim for that refined, minimal feel.

---

## Existing Data

Check the parent folder `../data-clean/` for existing JSON data that can be imported:
- `opportunities/` — may have opportunity data to migrate
- `glazes/` — may have glaze data
- `reference/` — reference materials

---

## Environment Variables Needed

```
ANTHROPIC_API_KEY=your-claude-api-key
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token (if using Mapbox)
```

---

## Get Started

```bash
cd Argil-v2
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"
```

Then start building Phase 1!
