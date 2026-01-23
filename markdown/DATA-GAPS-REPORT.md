# Suitability Data Gaps Report

Generated: 2026-01-22
Total Locations: 155

## Summary

| Field | Missing Count | Percentage |
|-------|---------------|------------|
| Beach Access | 0 | 0% |
| Ceramics Ecosystem | 0 | 0% |
| Local Color | 0 | 0% |
| Climate Data | 0 | 0% |

---

## Locations Missing Beach Access



---

## Locations Missing Ceramics Ecosystem



---

## Locations Missing Local Color (Blooms/Festivals)



---

## Beach Access Schema (for data entry)

Each location should have:

```json
"beachAccess": {
  "distance": "15 min",           // or "2 hour drive", "30 min flight"
  "type": "Pacific Ocean",        // Ocean/Lake/River type
  "beaches": ["Beach Name 1"],    // Named beaches
  "swimmable": "Yes - warm",      // Yes/No + condition
  "notes": "Beautiful sandy beach with calm waters",
  "flightRequired": false,        // true if no nearby beach
  "flightDetails": {              // only if flightRequired: true
    "destination": "Mombasa",
    "duration": "1.5 hours",
    "approximateCost": "$150-250"
  }
}
```

---

## Ceramics Ecosystem Schema (for data entry)

Each location should have clickable links where possible:

```json
"ceramicsEcosystem": {
  "studios": [
    { "name": "Studio Name", "url": "https://...", "notes": "Community classes" }
  ],
  "suppliers": [
    { "name": "Clay Supplier", "url": "https://...", "notes": "Local stoneware" }
  ],
  "galleries": [
    { "name": "Gallery Name", "url": "https://...", "notes": "Shows ceramics" }
  ],
  "community": [
    { "name": "Potters Guild", "url": "https://...", "notes": "Monthly meetups" }
  ]
}
```

---

## Local Color Schema (for data entry)

```json
"localColor": {
  "blooms": [
    { "month": "April", "name": "Cherry Blossoms", "notes": "Peak bloom in parks" }
  ],
  "festivals": [
    { "month": "May", "name": "Pottery Festival", "notes": "Annual ceramics fair" }
  ],
  "naturalPhenomena": [
    { "season": "year-round", "name": "Mountain views", "notes": "Visible from downtown" }
  ]
}
```
