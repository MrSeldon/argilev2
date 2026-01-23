# Le Four Argile — Current Tasks

> Instructions for Claude Code
> Last updated: January 21, 2026

---

## Project Setup

**Repository:** Start fresh or use existing argile repo
**Branch:** `main`
**Deployment:** Vercel (set up after initial structure is in place)

---

## CRITICAL RULES

1. **Use Next.js App Router** — All pages in `/app` directory
2. **Real URLs for everything** — No state-based view switching
3. **Do not create new Vercel projects** — If one exists, use it
4. **Test on Vercel, not just localhost** — Deploy and verify
5. **When adding data fields, add to ALL entries** — No lazy partial updates
6. **Commit messages should be clear** — Describe what changed and why

---

## Immediate Task: Project Initialization

### Step 1: Create Next.js project
```bash
npx create-next-app@latest argile --typescript --tailwind --app --src-dir=false
cd argile
```

### Step 2: Create folder structure
```
app/
├── layout.tsx
├── page.tsx
├── glazes/
│   ├── page.tsx
│   ├── [slug]/page.tsx
│   └── my-materials/page.tsx
├── inspirations/
│   ├── page.tsx
│   ├── [slug]/page.tsx
│   └── connections/page.tsx
├── opportunities/
│   ├── page.tsx
│   ├── [slug]/page.tsx
│   └── map/page.tsx
└── api/
    └── chat/route.ts

components/
├── ui/
├── glazes/
├── inspirations/
├── opportunities/
└── mentor/

data/
├── glazes/
├── inspirations/
├── opportunities/
├── materials/
└── user/

lib/
├── data.ts
└── ai.ts

claude/
├── ARCHITECTURE.md
├── TASKS.md
└── COWORKER.md
```

### Step 3: Set up basic layout with navigation
- Header with site title "Le Four Argile"
- Navigation: Glazes | Inspirations | Opportunities
- Clean, minimal aesthetic
- Typography: editorial feel (consider fonts like: Instrument Serif, Fraunces, or similar)

### Step 4: Copy existing data
If there's existing JSON data from the previous Argile build:
- Copy opportunities data to `/data/opportunities/index.json`
- Copy any glaze data to `/data/glazes/index.json`
- Validate JSON formatting (proper brackets, no trailing commas)

---

## Priority Task: Opportunities Section

This is the most important section. Build it first.

### Opportunities List (`/opportunities`)

**Requirements:**
- Load data from `/data/opportunities/index.json`
- Display as cards in a grid
- Each card shows: name, type badge, location, suitability score
- **INFINITE SCROLL** — Not "load more" buttons, not pagination
- Filter sidebar with:
  - Type checkboxes (school, residency, apprenticeship, grant, scholarship, internship, mentorship)
  - Region/country dropdown or search
  - Suitability score slider
- Clicking a card navigates to `/opportunities/[slug]`

**Card design:**
- Clean, minimal
- Type shown as subtle badge/pill
- Location as secondary text
- Suitability score as visual indicator (bar, number, or both)

### Opportunity Detail (`/opportunities/[slug]`)

**Requirements:**
- Full opportunity information
- Suitability index displayed prominently:
  - Overall score
  - Local color (text description)
  - Nearby studios (list)
  - Nearby museums (list)
  - Ceramics scene description
  - Climate
  - Cost of living indicator
  - Language requirements
  - Visa complexity
- External link to source website
- Save/favorite button (store in localStorage for now)
- Back button that works (real routing)

---

## Data Validation Task

Before building UI, validate the opportunities JSON:

1. Check that ALL entries have ALL suitability fields filled
2. If any fields are empty/null, flag them — do not skip them
3. Ensure coordinates exist for map view
4. Ensure slugs are URL-safe (lowercase, hyphens, no spaces)

If data is incomplete, stop and report which entries/fields need attention.

---

## Do NOT Do Yet

- AI mentor integration (Phase 5)
- D3 connections graph (Phase 4)
- Map view (Phase 2)
- Glaze scraping (needs Coworker)

Focus on getting the opportunities list and detail pages working perfectly first.

---

## Environment Variables Needed

For Vercel deployment, ensure these are set:
- `ANTHROPIC_API_KEY` — For AI mentor (can add later)

For local development, create `.env.local`:
```
ANTHROPIC_API_KEY=your_key_here
```

---

## Git Workflow

1. Make changes
2. Test locally with `npm run dev`
3. Commit with clear message
4. Push to `main`
5. Verify on Vercel deployment
6. If deployment fails, read the error log and fix before continuing

---

## Questions? Ask Devin

If unclear about:
- Design decisions
- Data structure
- Feature priority
- Aesthetic direction

Stop and ask rather than guessing.
