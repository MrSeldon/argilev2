# Coworker Task: Extract Suitability Modal from V1

> The V2 suitability modal keeps getting worse. We need to copy the working V1 code directly.

---

## Goal

Find and copy all files related to the Suitability Index modal from the V1 codebase into V2.

---

## Step 1: Locate V1 Codebase

The V1 site is live at: argile.room527.com

Find where the source code lives:
- Local folder on Devin's machine?
- GitHub repository?
- Vercel project with linked repo?

---

## Step 2: Find the Modal Component Files

Look in the V1 project for files related to the suitability modal. They're likely named something like:

**Main component:**
- `SuitabilityModal.tsx` or `SuitabilityModal.jsx`
- `SuitabilityIndex.tsx` or `SuitabilityIndex.jsx`
- Could be in `/components/` or `/components/opportunities/`

**Sub-components (the modal likely imports these):**
- `ClimateAlmanac.tsx` — The temperature/rainfall graph
- `SeasonalRhythm.tsx` — The four-column seasons section
- `LocalColor.tsx` — The events list with colored dots
- `CeramicsEcosystem.tsx` — Three-column tradition/studios/museums
- `IndigenousRoots.tsx` — The highlighted callout section
- `FoodConstellation.tsx` — Chili/chocolate/coffee scores
- `BeachEscape.tsx` — Nearest beach section
- `TimeZoneWidget.tsx` or `CCOverlap.tsx` — The time comparison
- `DayNightAlignment.tsx` — The awake/sleeping visualization
- `PersonalCare.tsx` — Pilates/hair care section
- `CreepyCrawlies.tsx` — Bugs section

**Styles:**
- Any `.css` or `.module.css` files associated with these components
- Or Tailwind classes if using Tailwind
- Or styled-components if using that

---

## Step 3: Copy Files to V2

Create a folder in V2: `/components/suitability/`

Copy all the V1 modal files into this folder.

---

## Step 4: Note Any Dependencies

Check if the V1 modal uses any specific libraries:
- Chart libraries (Recharts, Chart.js, D3, etc.) for the climate almanac
- Date libraries
- Any custom hooks

Note these so they can be installed in V2 if not already present.

---

## Step 5: Create a Manifest

Create a file listing what was copied:

```markdown
# V1 Suitability Modal Files

## Components Copied
- SuitabilityModal.tsx
- ClimateAlmanac.tsx
- SeasonalRhythm.tsx
- [etc.]

## Styles Copied
- suitability.module.css
- [etc.]

## Dependencies Required
- recharts (for climate graph)
- [etc.]

## Notes
- [Any observations about the code structure]
```

---

## Output

1. All V1 modal files copied to V2's `/components/suitability/` folder
2. Manifest file documenting what was copied
3. List of any missing dependencies

Then Claude Code can wire up the V1 modal to replace the broken V2 version.
