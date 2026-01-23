# Le Four Argile — Data Enrichment Tasks

> This document outlines the data gaps found in `data/suitability/index.json` and provides guidance for fixing them.

**Validation Date:** January 22, 2026
**Total Locations:** 155

---

## Summary of Gaps

| Issue | Count | Priority |
|-------|-------|----------|
| Beach Access needs flight details (landlocked) | 32 | High |
| Ceramics Ecosystem needs URLs | 155 | High |
| All other fields | Complete | ✅ |

---

## Issue 1: Beach Access for Landlocked Locations

**32 locations** have `"distance": "N/A"` because they're landlocked. These need flight details to the nearest beautiful beach.

### Schema to Add

```json
"beachAccess": {
  "distance": "N/A",
  "type": "Landlocked",
  "beaches": [],
  "swimmable": "No ocean beaches",
  "notes": "High desert location",
  "nearestBeachFlight": {
    "destination": "San Diego, California",
    "beach": "La Jolla Cove",
    "flightDuration": "2 hours",
    "approximateCost": "$150-300 round trip",
    "notes": "Beautiful Pacific beaches, warm water"
  }
}
```

### Locations Needing Flight Details

**United States (Interior):**
1. Fairbanks, Alaska, USA → Suggest: Hawaii or Seattle area
2. Chattanooga, Tennessee, USA → Suggest: Gulf Coast (Destin, FL)
3. Fayetteville, Arkansas, USA → Suggest: Gulf Coast
4. Gatlinburg, Tennessee, USA → Suggest: Charleston, SC or Gulf Coast
5. Knoxville, Tennessee, USA → Suggest: Charleston, SC
6. Lexington, Kentucky, USA → Suggest: Gulf Coast or Outer Banks
7. Morgantown, West Virginia, USA → Suggest: Virginia Beach or OBX
8. State College, Pennsylvania, USA → Suggest: Jersey Shore or Ocean City MD
9. Albuquerque, New Mexico, USA → Suggest: San Diego or Rocky Point, MX
10. Athens, Ohio, USA → Suggest: Outer Banks or Myrtle Beach
11. Bloomington, Indiana, USA → Suggest: Lake Michigan or Gulf Coast
12. Boulder, Colorado, USA → Suggest: San Diego or Cabo
13. Bozeman, Montana, USA → Suggest: Pacific Northwest or Hawaii
14. Cincinnati, Ohio, USA → Suggest: Lake Michigan or Gulf Coast
15. Edwardsville, Illinois, USA → Suggest: Gulf Coast
16. Iowa City, Iowa, USA → Suggest: Lake Michigan or Gulf Coast
17. Kansas City, Missouri, USA → Suggest: Gulf Coast (Destin, FL)
18. Lincoln, Nebraska, USA → Suggest: Gulf Coast or San Diego
19. Logan, Utah, USA → Suggest: San Diego or Hawaii
20. Missoula, Montana, USA → Suggest: Pacific Northwest or Hawaii
21. Normal, Illinois, USA → Suggest: Lake Michigan or Gulf Coast
22. Snowmass Village, Colorado, USA → Suggest: San Diego or Cabo

**Europe (Interior):**
23. Halle (Saale), Germany → Suggest: Baltic Sea or Mediterranean
24. Höhr-Grenzhausen, Germany → Suggest: North Sea or Mediterranean
25. Landshut, Germany → Suggest: Adriatic (Croatia) or Mediterranean
26. Prague, Czech Republic → Suggest: Croatian coast or Baltic
27. Strasbourg, France → Suggest: Mediterranean (Nice)
28. Wrocław, Poland → Suggest: Baltic Sea or Croatian coast

**Asia:**
29. Jingdezhen, China → Suggest: East China Sea coast

**Canada:**
30. Banff, Alberta, Canada → Suggest: Vancouver Island or Hawaii
31. Calgary, Alberta, Canada → Suggest: Vancouver Island or Hawaii
32. Medicine Hat, Alberta, Canada → Suggest: Vancouver Island

---

## Issue 2: Ceramics Ecosystem Needs URLs

**All 155 locations** have ceramics ecosystem data, but it's stored as simple strings without clickable links.

### Current Format (String)
```json
"ceramicsEcosystem": {
  "studios": [
    "Humboldt State University ceramics",
    "Arcata Artisans"
  ],
  "suppliers": [
    "Seattle Pottery Supply (ships)",
    "Leslie Ceramics (Berkeley)"
  ],
  "galleries": [
    "Humboldt Arts Council",
    "First Street Gallery"
  ]
}
```

### Required Format (Object with URLs)
```json
"ceramicsEcosystem": {
  "studios": [
    {
      "name": "Cal Poly Humboldt Ceramics",
      "url": "https://art.humboldt.edu/ceramics",
      "notes": "University program, community classes available"
    },
    {
      "name": "Arcata Artisans",
      "url": "https://arcataartisans.com",
      "notes": "Cooperative gallery with studio space"
    }
  ],
  "suppliers": [
    {
      "name": "Seattle Pottery Supply",
      "url": "https://seattlepotterysupply.com",
      "notes": "Ships nationwide, good clay selection"
    },
    {
      "name": "Leslie Ceramics",
      "url": "https://lfranceramics.com",
      "notes": "Bay Area institution, local clays"
    }
  ],
  "galleries": [
    {
      "name": "Humboldt Arts Council",
      "url": "https://humboldtarts.org",
      "notes": "Regional arts organization"
    },
    {
      "name": "First Street Gallery",
      "url": "https://firststgallery.com",
      "notes": "Downtown Eureka, shows ceramics"
    }
  ],
  "community": [
    {
      "name": "North Coast Potters Guild",
      "url": "https://...",
      "notes": "Monthly meetings, annual sale"
    }
  ]
}
```

### Enrichment Process

For each location, research and add:
1. **Studios** — URL to website, social media, or Google Maps listing
2. **Suppliers** — URL to online store or location
3. **Galleries** — URL to website or Instagram
4. **Community** — Guilds, groups, Facebook groups, meetups

If no URL exists, use Google Maps link:
```json
{
  "name": "Small Town Pottery",
  "url": "https://maps.google.com/?q=Small+Town+Pottery+Location",
  "notes": "Local studio (no website)"
}
```

---

## Issue 3: Verify Local Color Data Quality

While local color data exists for all locations, spot-check for:
- Generic or vague entries ("Various flowers bloom")
- Missing festival dates
- Outdated festival information

### Good Example
```json
"localColor": {
  "blooms": [
    { "month": "April", "name": "Cherry Blossoms", "notes": "Peak bloom in Tidal Basin" },
    { "month": "May", "name": "Azaleas", "notes": "Hillwood Estate gardens" }
  ],
  "festivals": [
    { "month": "June", "name": "Smithsonian Folklife Festival", "notes": "Free, on the Mall" },
    { "month": "October", "name": "Clarice Smith Ceramics Exhibition", "notes": "National Gallery" }
  ],
  "naturalPhenomena": [
    { "season": "fall", "name": "Fall foliage", "notes": "Peak mid-October in Shenandoah" }
  ]
}
```

### Weak Example (Needs Improvement)
```json
"localColor": {
  "blooms": [
    { "month": "Spring", "name": "Flowers", "notes": "Various blooms" }
  ],
  "festivals": [],
  "naturalPhenomena": []
}
```

---

## Data Enrichment Script Approach

To systematically enrich the data, use Claude or an AI assistant with web access:

### Prompt Template for Beach Flight Details

```
For the location [CITY, STATE, COUNTRY], which is landlocked with no beach access:

1. What is the nearest beautiful beach destination accessible by flight?
2. What is the typical flight duration from [nearest major airport]?
3. What is the approximate round-trip flight cost?
4. What makes this beach special?

Format the response as JSON:
{
  "destination": "City, Region",
  "beach": "Beach Name",
  "flightDuration": "X hours",
  "approximateCost": "$XXX-XXX round trip",
  "notes": "Brief description of beach"
}
```

### Prompt Template for Ceramics Ecosystem URLs

```
For ceramics resources in [CITY, STATE, COUNTRY], find website URLs for:

Studios:
- [Studio Name 1]
- [Studio Name 2]

Suppliers:
- [Supplier Name 1]

Galleries:
- [Gallery Name 1]

For each, provide:
- Verified URL (or Google Maps link if no website)
- Brief notes about what they offer

Format as JSON objects with name, url, notes fields.
```

---

## Priority Order for Enrichment

1. **High-value locations first** — Start with locations that have the most opportunities or are most popular
2. **US locations** — Likely easier to find URLs
3. **European locations** — May need local language searches
4. **Asian locations** — May need help with language barriers

### Suggested High-Priority Locations

These have multiple opportunities and deserve complete data:

1. Berkeley, California, USA
2. Portland, Oregon, USA
3. Seattle, Washington, USA
4. Los Angeles, California, USA
5. New York, New York, USA
6. San Francisco, California, USA
7. Kyoto, Japan
8. London, UK
9. Amsterdam, Netherlands
10. Copenhagen, Denmark

---

## Validation Script

After enrichment, run the validation script again:

```bash
node validate-suitability.js
```

This will confirm:
- All beach access entries have flight details where needed
- Ceramics ecosystem entries have URL objects (not just strings)
- No placeholder text remains

---

## Notes on Data Quality

**Winnie's priorities (from conversation):**
- Climate is HUGE — make sure all 12 months are accurate
- Culture and food matter a lot
- Bugs are a factor
- Timezone is smallest priority (but still useful)
- Beach access should show flights for landlocked places with approximate costs

**Display considerations:**
- Ceramics ecosystem links should be clickable in the UI
- Beach flight info should show duration AND cost
- All text should be actual content, not placeholders
