# V1 Suitability Modal Files - Extraction Manifest

## Overview
Extracted and adapted the working V1 suitability modal code from `LegacyApp.tsx` (lines 3882-4755) into a standalone component for V2.

## Components Created

### Main Component
- `SuitabilityModalV1.tsx` - Complete modal with all sections using V1 inline styles

## Sections Included
1. **Header** - Location name, summary, score badge (cream/tan), CC Mode toggle, close button
2. **Climate Almanac** - SVG temperature graph with comfort zone band, rainfall bars, event dots
3. **Seasonal Rhythm** - Four-column grid (Winter, Spring, Summer, Autumn)
4. **Local Color** - Events list with colored dots and timing
5. **Ceramics Ecosystem** - Studios, Suppliers, Galleries, Community (with URLs)
6. **Probability of Chili™** - Score with hover tooltip explanation
7. **CC Overlap (Time Zone)** - Interactive time comparison with slider and day/night visualization
8. **CC Mode** - Cannabis friendliness, Fabric & Fashion, Market Intel, Seasonal Opportunities
9. **Practical Info** - Language, Visa, Healthcare, Internet quality
10. **Creepy Crawlies** - Mosquitoes, Snakes (with reveal steps), Spiders, Other

## Dependencies
- React (useState, useEffect)
- No external chart libraries - uses custom SVG

## Styling Approach
- **All inline styles** matching V1 exactly
- Colors: `#faf8f5` (cream), `#292524` (charcoal), `#C4A77D` (tan accent), `#78716c`, `#a8a29e`
- Typography: Georgia serif for headings, system font for body
- Small caps for section headers with letter-spacing

## Data Compatibility
Adapted to work with both V1 and V2 data formats:
- Climate: Handles both `avgHigh`/`avgLow` (V1) and `tempHigh`/`tempLow` (V2)
- LocalColor: Handles both array format (V1) and object with blooms/festivals (V2)
- BeachAccess: Handles both `drivingDistance` (V1) and `distance` (V2)
- CeramicsEcosystem: Handles both string and array formats
- PracticalInfo: Adapted from string to object format

## Wiring
Modified `OpportunityDetailClient.tsx` to import and use `SuitabilityModalV1` instead of `SuitabilityModal`.

## Notes
- Score is calculated dynamically based on climate comfort, ceramics ecosystem, timezone overlap, chili probability, and beach access
- Summary is generated from community description and practical info
- CC Mode toggle shows additional data for "Cece's visit"
- Snakes reveal has 4-step confirmation flow (Devin Easter egg)

## Next Steps
- Test with real data to verify all sections render
- Verify responsive behavior on mobile
- Consider extracting individual sections into sub-components for maintainability
