# Le Four Argile — Complete Handoff for Claude Code

> Generated: January 22, 2026
> This document consolidates all planning from the architecture session
> Place in `/argile/claude/` folder

---

## CRITICAL CONTEXT

**V1 is live at:** argile.room527.com — This is the design reference. Do not redesign.

**V2 goals:**
1. Proper URL routing (Next.js App Router) — every page has a URL, back/forward works
2. Port existing suitability index modal exactly as-is
3. Ensure ALL JSON data fields are populated (flag incomplete entries)
4. Infinite scroll on opportunities (not paginated)
5. Clean architecture — no Winchester House sprawl

**What NOT to do:**
- Do not redesign the suitability index UI
- Do not create new Vercel projects (use existing)
- Do not add suitability data to opportunity cards (keep cards clean)
- Do not skip data fields — populate all or flag as incomplete

---

## FILE STRUCTURE

```
argile/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── glazes/
│   │   ├── page.tsx
│   │   ├── [slug]/page.tsx
│   │   └── my-materials/page.tsx
│   ├── inspirations/
│   │   ├── page.tsx
│   │   ├── [slug]/page.tsx
│   │   └── connections/page.tsx
│   ├── opportunities/
│   │   ├── page.tsx
│   │   ├── [slug]/page.tsx
│   │   └── map/page.tsx
│   └── api/
│       └── chat/route.ts
├── components/
│   ├── ui/
│   ├── glazes/
│   ├── inspirations/
│   ├── opportunities/
│   │   └── SuitabilityModal.tsx  ← PORT FROM V1
│   └── mentor/
├── data/
│   ├── glazes/index.json
│   ├── inspirations/index.json
│   ├── opportunities/index.json
│   ├── materials/index.json
│   └── user/ (localStorage, not files)
├── lib/
│   ├── data.ts
│   └── ai.ts
├── claude/
│   ├── HANDOFF.md (this file)
│   └── ARCHITECTURE.md (full spec)
└── public/
```

---

## OPPORTUNITY DATA SCHEMA

Every opportunity must have ALL these fields. If data is missing, add `"_incomplete": true` and list missing fields in `"_missing": []`.

```json
{
  "id": "string",
  "slug": "string (URL-safe)",
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
    "summary": "string (one-line summary)",
    
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
      { "name": "string", "description": "string", "timing": "string" }
    ],
    
    "ceramicsEcosystem": {
      "tradition": { "name": "string", "since": "string | null" },
      "studios": { "count": "string", "note": "string" },
      "museums": { "count": "string", "note": "string" }
    },
    
    "indigenousRoots": {
      "title": "string",
      "description": "string",
      "links": ["string"]
    },
    
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
    },
    
    "personalCare": {
      "pilates": { "distanceKm": "number", "name": "string", "rating": "string" },
      "afroHairCare": { "availability": "string", "note": "string" }
    }
  },
  
  "ccMode": {
    "cannabis": {
      "grade": "A+ | A | B | C | D | F",
      "legalStatus": "string",
      "history": "string",
      "stories": ["string"],
      "tourism": "string | null",
      "priceQuality": "string"
    },
    "fashion": {
      "textileScene": "string",
      "fabricMarkets": ["string"],
      "manufacturing": { "available": "boolean", "moqNotes": "string | null" },
      "fashionEvents": ["string"],
      "opportunities": ["string"],
      "heritage": "string | null"
    }
  },
  
  "_incomplete": "boolean (true if any required fields missing)",
  "_missing": ["array of missing field names"]
}
```

---

## OPPORTUNITY CARDS — KEEP CLEAN

Cards in the browse view show ONLY:
- Name
- Type badge
- Location (City, Country)
- Small suitability score number

Cards do NOT show any suitability details. The richness is revealed in the modal.

```
┌─────────────────────────────────┐
│                                 │
│  Haystack Mountain School       │
│  RESIDENCY · Deer Isle, USA     │
│                          [72]   │
│                                 │
└─────────────────────────────────┘
```

---

## SUITABILITY MODAL — PORT FROM V1

The suitability index modal at argile.room527.com is already well-designed. Port it exactly.

**Sections (in order):**
1. Header: "SUITABILITY INDEX" + location + CC Mode toggle + close
2. Score circle + one-line summary
3. Climate Almanac (temperature graph with comfort zone)
4. Seasonal Rhythm (4 columns)
5. Local Color (list with timing)
6. Ceramics Ecosystem (3 columns: tradition, studios, museums)
7. Indigenous Roots (highlighted callout — if applicable)
8. Food Constellation (chili, chocolate cake, coffee)
9. Beach & Escape (distance + drive time)
10. Time zone widget (Kigali vs destination)
11. Day & Night Alignment visualization
12. Personal Care (pilates, hair care)

**CC Mode:** When toggled, sections 4-6 swap to fashion/cannabis content. Same structure, different data.

---

## PHASE 1 TASKS (Immediate)

### 1. Initialize Next.js Project
```bash
npx create-next-app@latest argile --typescript --tailwind --app --src-dir=false
```

### 2. Set Up Routing Structure
Create all route files as listed in file structure above. Every page must have its own URL.

### 3. Import Existing Data
- Copy opportunities JSON from v1
- Validate all entries have required fields
- Add `_incomplete: true` and `_missing: []` to any incomplete entries
- Generate report of incomplete entries

### 4. Build Opportunities List
- Infinite scroll (not paginated)
- Clean cards (name, type, location, score only)
- Filter sidebar (type, region, score range)
- Click card → navigate to `/opportunities/[slug]`

### 5. Build Opportunity Detail Page
- Display practical info (description, dates, cost, link)
- "Discover this place" button opens suitability modal
- Port suitability modal component from v1

### 6. Deploy to Vercel
- Use existing Vercel project (do not create new)
- Set environment variables if needed
- Verify deployment works

---

## DATA VALIDATION CHECKLIST

Before considering opportunities complete, run validation:

```javascript
// Pseudo-code for validation
opportunities.forEach(opp => {
  const missing = [];
  
  // Required fields
  if (!opp.location?.coordinates) missing.push('coordinates');
  if (!opp.suitability?.score) missing.push('suitability.score');
  if (!opp.suitability?.climate?.monthly) missing.push('climate.monthly');
  if (!opp.suitability?.seasonalRhythm) missing.push('seasonalRhythm');
  if (!opp.suitability?.localColor?.length) missing.push('localColor');
  if (!opp.suitability?.ceramicsEcosystem) missing.push('ceramicsEcosystem');
  if (!opp.suitability?.foodConstellation) missing.push('foodConstellation');
  if (!opp.suitability?.personalCare) missing.push('personalCare');
  
  // CC Mode fields (can be empty initially, but flag)
  if (!opp.ccMode?.cannabis) missing.push('ccMode.cannabis');
  if (!opp.ccMode?.fashion) missing.push('ccMode.fashion');
  
  if (missing.length > 0) {
    opp._incomplete = true;
    opp._missing = missing;
  }
});
```

Output a report: `data-validation-report.md` listing all incomplete entries and what they're missing.

---

## FUTURE PHASES (Do not implement yet)

**Phase 2:** Map view with Mapbox/Leaflet
**Phase 3:** Glazes section (browse, detail, my-materials)
**Phase 4:** Inspirations with D3 connections graph
**Phase 5:** AI Mentor integration
**Phase 6:** Living Pulse (astronomy, ceramics news, magic hour alerts)

---

## GIT WORKFLOW

1. Make changes
2. Test locally: `npm run dev`
3. Commit with clear message
4. `git pull origin main` (in case of conflicts)
5. `git push origin main`
6. Verify on Vercel deployment
7. If deployment fails, read logs and fix before continuing

---

## QUESTIONS? ASK DEVIN

If unclear about design decisions, data structure, or priorities — stop and ask rather than guessing.
