# Argile V2 — Critical Fixes

> Priority fixes to bring V2 up to V1 quality
> Reference: argile.room527.com (V1) is the visual standard

---

## CRITICAL FIX 1: Remove Suitability Info from Opportunity Detail Page

**Problem:** The opportunity detail page (`/opportunities/[slug]`) is showing suitability index information directly on the page.

**Required:** The opportunity detail page should show ONLY:
- Program name
- Institution
- Location
- Type badge
- Description of the program itself
- Practical details (duration, cost, deadlines, how to apply)
- Link to official website
- "Discover this place" button that opens suitability modal
- **NEW: Related Opportunities section** (see below)

**The opportunity detail page should NOT show:**
- Climate almanac
- Seasonal rhythm
- Local color
- Ceramics ecosystem
- Indigenous roots
- Food constellation
- Beach & escape
- Time zone widget
- Personal care
- Creepy crawlies
- ANY suitability data

All suitability information lives ONLY in the suitability modal. The modal is the reward for clicking "Discover this place."

---

## CRITICAL FIX 2: Climate Almanac Clipping/Distortion

**Problem:** The climate almanac graph is clipping and distorted in V2. It looks scrunched and ugly compared to V1's beautiful, clean graph.

**V1 Reference (correct):**
- Full-width graph with comfortable padding
- Temperature line clearly visible from J to D
- Comfort zone (21-28°C) shown as subtle tan/cream band
- Rainfall bars beneath the temperature line
- Event dots (colored circles) above the graph
- Hover state shows: "July 32°/22°C · in comfort zone" and "112mm rain · 14.4h daylight"
- Legend below: "Comfort zone (21-28°C) · 20mm rain · Event"
- Months clearly labeled: J F M A M J J A S O N D

**Fix required:**
- Ensure the chart container has proper width/height
- Remove any `overflow: hidden` that's cutting off content
- Match V1's proportions exactly
- The graph should breathe — generous padding around it

---

## CRITICAL FIX 3: Suitability Modal Styling to Match V1

**V1 styling to replicate:**

### Header
- "SUITABILITY INDEX" in small caps, subtle gray
- Location name large, serif font (like the body)
- Score in cream/tan circle (not black), positioned top-right
- One-line summary next to or below location name
- CC Mode button top-right, close X button

### Section Headers
- ALL CAPS
- Small size
- Subtle gray color
- Letter-spacing
- Thin underline or separator

### Climate Almanac
- As described above — not clipped, not distorted

### Seasonal Rhythm
- Four equal columns
- Season name in small caps (WINTER, SPRING, etc.)
- Date range below (Dec-Feb, etc.)
- Description text below that
- Subtle borders between columns

### Local Color
- List format
- Colored dot on left (matches event dots on almanac)
- Event name bold
- Description below in regular weight
- Timing (APR, YEAR-ROUND, etc.) aligned right

### Ceramics Ecosystem
- Three equal columns
- Header in small caps (TRADITION, STUDIOS, MUSEUMS)
- Main stat large
- Supporting text smaller
- **ADD: Make each clickable with URL**

### Indigenous Roots
- Left border accent (tan/cream colored)
- Title bold with em-dash and years
- Description paragraph
- Links at bottom ("Archaeological sites nearby · Museum exhibits")

### Food Constellation
- Three equal columns
- Header in small caps (PROBABILITY OF CHILI™, etc.)
- Large number
- Label next to number (Low, Excellent, Paradise)
- Note below (Nearest 12km, 3 great spots, etc.)
- **NEW: LOCAL DISCOVERY callout** below (e.g., "Famous for handmade udon...")

### Beach & Escape
- Card format
- "Nearest beautiful beach" label
- Beach name and description
- Distance and drive time on right (45 km, ~1 hour →)
- Expandable dark card with more details and map link

### CC Overlap (Time Zone)
- Two large times side by side
- "KIGALI (WINNIE)" and "DESTINATION (YOU)" labels
- Time difference in middle (+7h)
- "Morning" / "Afternoon" / "Night" labels
- Draggable slider to pick a time
- "← Now" link to reset

### Day & Night Alignment
- Two horizontal bars (Kigali, Destination)
- Colored segments: cream = Awake (6am-10pm), dark = Sleeping
- Red outline box showing selected time on both
- 24-hour scale below (12am, 6am, 12pm, 6pm, 12am)
- Legend: Awake (6am-10pm) · Sleeping · Selected time

### Personal Care
- Two columns
- PILATES STUDIO / AFRO HAIR CARE headers
- Distance or availability
- Specific place name with rating
- **ADD: Make clickable with URL or map search**

### Creepy Crawlies
- **SMALL** — this should be a minor footnote, not prominent
- Three columns: Mosquitoes, Snakes, Spiders
- Timing or "Tap to reveal" or "Common"
- Muted styling, bottom of modal

---

## NEW FEATURE: Related Opportunities

On the opportunity detail page (NOT the modal), add a "Related Opportunities" section showing:

- Grants that could fund this program
- Scholarships applicable to this type of study
- Financial aid relevant to this location/institution

**Logic:**
- If viewing a SCHOOL in Japan → show Japanese scholarships/grants
- If viewing a RESIDENCY in Europe → show European arts grants
- Match by: country, region, type compatibility

**Display:**
- Small cards or list items
- Name, type badge, brief description
- Click to navigate to that opportunity's detail page

---

## NEW FEATURE: Clickable URLs Throughout

Add clickable links to:

### Ceramics Ecosystem
- Tradition → Wikipedia or authoritative source
- Studios → Google Maps search or directory
- Museums → Museum website or Google Maps

### Personal Care
- Pilates → Google Maps link to the specific studio
- Afro Hair Care → Google Maps search for the area

### Beach & Escape
- "Click to view on map" → Google Maps or Apple Maps

### Indigenous Roots
- "Archaeological sites nearby" → Search or specific link
- "Museum exhibits" → Relevant museum page

---

## COWORKER TASK: Opportunity Hero Images

For each opportunity, we want a hero image showing the actual place (university building, residency studio, etc.).

**Coworker instructions:**
1. For each opportunity, visit the official website
2. Find the best representative image (building exterior, studio space, campus)
3. Download at high resolution
4. Save as: `[opportunity-slug].jpg` in `/public/images/opportunities/`
5. If no good image found, note in a log file

**Priority:** Start with schools and residencies (most likely to have good imagery)

This is a background task — can run overnight.

---

## Summary of Changes

| Area | Current (V2) | Required |
|------|--------------|----------|
| Opportunity detail page | Shows suitability info | NO suitability info, only program details |
| Climate almanac | Clipped/distorted | Full-width, clean, matches V1 |
| Creepy crawlies | Large/prominent | Small, bottom, footnote-style |
| Section styling | Inconsistent | Match V1 exactly (small caps, spacing, colors) |
| Ceramics ecosystem | Static | Clickable URLs |
| Personal care | Static | Clickable URLs |
| Related opportunities | Missing | Add section on detail page |
| Hero images | Generic gradient | Actual place photos (Coworker task) |

---

## Reference Screenshots

V1 (CORRECT — replicate this):
- Clean climate almanac with full visibility
- Proper proportions
- Subtle, restrained styling
- Everything has breathing room

V2 (NEEDS FIXING):
- Climate almanac clipped
- Styling inconsistent
- Creepy crawlies too large
- Suitability info on detail page (should only be in modal)

---

## Testing Checklist

After fixes:
- [ ] Opportunity detail page shows NO suitability data
- [ ] "Discover this place" button opens modal
- [ ] Climate almanac renders fully without clipping
- [ ] All 12 months visible (J through D)
- [ ] Hover on graph shows temperature/rain/daylight
- [ ] Seasonal rhythm has 4 equal columns
- [ ] Local color items have colored dots and right-aligned timing
- [ ] Ceramics ecosystem URLs are clickable
- [ ] Personal care URLs are clickable
- [ ] Creepy crawlies is small at bottom
- [ ] Related opportunities section appears on detail page
- [ ] Modal can be closed with X button
- [ ] CC Mode toggle works
