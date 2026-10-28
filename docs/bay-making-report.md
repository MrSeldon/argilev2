# Bay Area making beyond ceramics: scouting report

Data file: `data/opportunities/bay-making.json` (89 entries, id prefix `baymk-`, loaded by `getOpportunities()` in `lib/data.ts`).
Research dates: 27-28 October 2026. `lastVerified` is `2026-10-28` on every entry.

## Method

- Every entry has a `source` URL that was opened (curl with a browser User-Agent, or WebFetch) and showed 2025-2026 activity: dated classes, events, exhibitions, newsletters or schedules.
- Coordinates come from OpenStreetMap Nominatim, at most 1 request per second. Where the site gives no street address, the address comes from the OpenStreetMap record and is marked "(per OpenStreetMap)" (Mission Community Woodshop, Dharma Trading, BAGI).
- 11 pins carry `"approximate": true`. These are city or neighbourhood centres for groups with no fixed public venue: SF Quilters Guild, SFPL workshops, Bay Area Basket Makers, Metal Arts Guild, Graphic Arts Workshop, ArtSpan, Long Now Talks, East Bay Open Studios, Marin Open Studios, Silicon Valley Open Studios and Maker Faire.
- Deduplicated against `sf-bay.json`, `sf-studios.json` and `index.json`. Djerassi and Montalvo (Lucas Artists) were dropped because they are already in `index.json`. Museum of Craft and Design, Richmond Art Center, Headlands, West Coast Craft and the Fellowship of Craft are already in `sf-bay.json`, so they were left out.
- Only existing `type` values are used (community, gallery, supplier, workshop, studio, residency), so `lib/types.ts` and `TYPE_HEX` did not need changes. Museums are `gallery` and markets and guilds are `community`. The new `discipline` field holds the finer split. Categories reuse the existing labels and add `museum`, `market` and `lecture`.

## Counts

| discipline | San Francisco | East Bay | Marin | Peninsula | South Bay | North Bay | total |
|---|---|---|---|---|---|---|---|
| textiles | 5 | 10 | 3 | 1 | 1 | 0 | 20 |
| multi (makerspace / mixed) | 7 | 5 | 0 | 1 | 1 | 0 | 14 |
| collective | 6 | 4 | 3 | 1 | 0 | 0 | 14 |
| museum | 6 | 3 | 2 | 1 | 1 | 0 | 13 |
| market | 3 | 2 | 0 | 0 | 0 | 1 | 6 |
| print | 4 | 2 | 0 | 0 | 0 | 0 | 6 |
| lectures | 4 | 1 | 0 | 0 | 0 | 0 | 5 |
| wood | 2 | 1 | 1 | 0 | 0 | 0 | 4 |
| jewelry | 3 | 0 | 1 | 0 | 0 | 0 | 4 |
| glass | 1 | 1 | 0 | 0 | 1 | 0 | 3 |
| **total** | **41** | **29** | **10** | **4** | **4** | **1** | **89** |

Textile-related places are spread across several disciplines. For example, the Textile Arts Council is filed under lectures, its Bazaar under market, the SJ Museum of Quilts & Textiles under museum, and Creative Growth's fiber studio under collective. Counting those, about 28 entries are textile-focused.

## Ten finds Winnie would love most

1. **Textile Arts Council (de Young)**: lectures, tours, an Ethnic Textiles Study Group and recorded talks. This is the fastest way into San Francisco's textile scholars and collectors. Its Textile Bazaar on Nov 7, 2026 at St Mary's Cathedral is a first place to look, buy and later show.
2. **Lacis Museum of Lace and Textiles (Berkeley)**: a free lace museum attached to a textile-arts store and class room (embroidery, lace-making, garment construction). Nothing else like it in the Bay.
3. **Fibershed (Point Reyes Station)**: the organisation behind locally grown, locally dyed cloth, with workshops and markets at its Learning Center. It is the bridge between her weaving past and California soil, the way local clay is for her pottery.
4. **A Verb for Keeping Warm (Oakland)**: a natural-dye yarn and fabric shop selling mordants and dyeables and running classes. It is the most practical place to start dyeing here.
5. **Loom and Shuttle Guild (SF) and Golden Gate Weavers (Berkeley)**: the city and East Bay weaving guilds, both welcoming to visitors. Golden Gate Weavers is visibly active, with monthly newsletters through October 2026 and a 2026 joint show with the Bay Area Basket Makers at Richmond Art Center.
6. **Museum of the African Diaspora (MoAD)**: Black art across the diaspora, with an Emerging Artist Program and residencies. It is a natural community and a possible future venue for a Kigali-born maker.
7. **San Francisco Center for the Book**: letterpress, bookbinding and risograph workshops plus certificate tracks. It is a good second craft for a potter who thinks about surface and pattern. The Spring 2027 schedule posts Nov 14.
8. **The Crucible (Oakland)**: glass, metal, wood and foundry classes with studio access and scholarships. Its GIFTY holiday craft fair (Dec 5-6, 2026) is a ready-made selling venue.
9. **Hunters Point Shipyard Artists and ArtSpan SF Open Studios**: the city's open-studio season (Sept-Oct) and the 130+ studio Shipyard weekends each spring and fall. This is how she would find a shared studio, and in time open her own door.
10. **Creative Growth Art Center (Oakland)**: a 12,000 sq ft studio for artists with disabilities, with fiber arts, woodwork, printmaking and ceramics. It is inspiring to visit and a good place to volunteer as a maker.

Close runners-up: San Jose Museum of Quilts & Textiles, Humanmade (SoMa makerspace with a textiles shop), Hida Tool (Japanese hand tools, Berkeley), Bay Area Basket Makers, SCRAP (Ruth Asawa's creative-reuse depot) and Public Glass.

## Gaps

- **Floor-loom rental and open weaving studios.** No public, bookable floor-loom studio was found in SF or Oakland. CCA's weaving studio is students only. The guilds (Loom and Shuttle, Golden Gate Weavers, Black Sheep) are the realistic route to loom time and second-hand looms, and Ace Makerspace and Humanmade have textile areas.
- **Natural dye.** Only A Verb for Keeping Warm, Dharma Trading and Fibershed are covered. Berkeley Art Studio ran an Intro to Natural Dyes workshop in April 2026 (found in search, not re-verified, and Berkeley Art Studio is already in sf-bay.json for ceramics).
- **Leather and bookbinding studios** beyond WorkshopSF and SFCB were not found as stand-alone shops.
- **Peninsula and South Bay** are thin (8 entries). Sanchez Art Center (Pacifica), the Palo Alto Cubberley Artist Studios and San Jose Museum of Art all blocked automated checks or timed out.
- **Lecture series and extension courses.** CCA Extension, City College of SF (free for SF residents), UC Berkeley Extension and Stanford Continuing Studies are not included: the pages could not be fetched (403 or 404) or showed no craft courses. City College's fashion and textiles programme is worth checking by hand.
- **Markets.** Renegade, GIFTY, Root Division's Artist Fair, the TAC Bazaar, Maker Faire and the Alameda Antiques Faire are covered (West Coast Craft is already in sf-bay.json). KPFA's crafts fair and Patchwork Show Oakland could not be confirmed for 2026.

## Uncertain items (check before relying on them)

- **Loom and Shuttle Guild**: the website is current (© 2026) and gives the in-person meeting address, but its online programme calendar was last updated for 2021-22. Confirm dates by email.
- **de Young**: famsf.org returned 403 to every automated request. The entry is sourced from the Textile Arts Council page, which gives the de Young address and hours and describes TAC's support for the museum's textile department.
- **Hunters Point Shipyard Artists**: shipyardartists.com blocks automated requests. The source is the Fall 2026 Funcheap listing (Oct 17-18, 2026, 451 Galvez Ave). Funcheap also gives "Horn Ave, Building 101".
- **ArtSpan**: the artspan.org pages render empty to non-browser clients. 2026 dates (Sept 18-Oct 25) come from Hoodline (Oct 7, 2026).
- **Mission Community Woodshop, Dharma Trading, BAGI**: street addresses come from OpenStreetMap, not from their own pages.
- **Bay Area Basket Makers, Spindles & Flyers, Black Sheep, Golden Gate Weavers**: meeting places come from the CNCH guild list (cnch.org/guilds). Spindles & Flyers' November 2026 meeting is Zoom-only.
- **SF Quilters Guild**: meets at St. Anne of the Sunset, but Nominatim could not find the church, so the pin is approximate.
- **Long Now Talks**: the venue is not stated on the talks page, so the pin is approximate.

## Skipped (closed, stale or unverifiable)

Hello Stitch Studio (closing end of 2026), Contemporary Jewish Museum (temporarily closed), Peninsula Museum of Art (permanently closed), Phoebe A. Hearst Museum (gallery currently closed), Mission Cultural Center / Mission Grafica (website expired), Revere Academy (website expired), Workshop Residence (domain now redirects elsewhere), Baulines Craft Guild, Stash Yarn and San Jose Quilt Museum's old domain (taken over by spam), Urban Ore (site has injected spam; address unconfirmed), Magnolia Editions (latest news 2022), Sausalito Art Festival (site still on 2023), Hayko rug weaving (based in New York), Jewelry Arts Inc (New York), Noisebridge, American Steel Studios, Article Pract, Piedmont Yarn, Treasure Island Flea, Box Shop, Mill Valley Fall Arts Festival and Palo Alto Festival of the Arts (no response, bot wall or no 2025-26 evidence), and Tamalpais Textile Arts Guild (site not loading properly).
