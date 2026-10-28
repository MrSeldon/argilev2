# Bay Area ceramics pass (second, deeper sweep)

Verified 2026-10-27, stamped `lastVerified: "2026-10-28"`. Data: `data/opportunities/bay-ceramics.json` (73 entries, ids `baycer-*`, `discipline: "ceramics"`), loaded by `getOpportunities()` in `lib/data.ts` alongside `index.json`, `sf-bay.json`, `sf-studios.json` and `colombia.json`.

Nothing here duplicates an entry already in `sf-bay.json`, `sf-studios.json` or the Bay Area rows of `index.json`. Every entry has a `source` page that was actually opened (WebFetch, or curl with a browser User-Agent) and shows activity in 2025-2026. Geocoding is OpenStreetMap Nominatim via curl, one request at a time. Eight entries are `"approximate": true`: Moon Jelly (Berkeley centre), Waveform (Aileen St), Jered's Pottery (Horton St), Mt Vision (Inverness), and the four region-wide open studios events (Point Reyes, Marin, East Bay, Silicon Valley).

The target was 60-120; this pass stops at 73. The shared web-search budget ran out part-way through, and several city rec catalogues (Walnut Creek city site, Sunnyvale, SF Rec & Park ActiveNet, HARD, Livermore) block bots or render only with JavaScript. See Gaps.

## Counts

By type and area:

| area | studio | workshop | school | community | gallery | artist | supplier | residency | total |
|---|---|---|---|---|---|---|---|---|---|
| San Francisco | 4 | 2 | 1 | 5 | 4 | 0 | 1 | 0 | 17 |
| East Bay | 9 | 3 | 6 | 4 | 0 | 1 | 1 | 0 | 24 |
| Marin and North Bay | 2 | 0 | 0 | 3 | 1 | 2 | 0 | 1 | 9 |
| Peninsula | 4 | 2 | 3 | 0 | 0 | 1 | 0 | 0 | 10 |
| South Bay | 6 | 1 | 4 | 1 | 0 | 0 | 0 | 0 | 12 |
| Outside core Bay Area (Davis) | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 |
| **all** | 25 | 8 | 14 | 14 | 5 | 4 | 2 | 1 | 73 |

Category memberships (an entry can carry several; these become filter chips on the map): class 43, community 36, studio 31, **teaching 24**, school 15, gallery 11, artist 7, supplier 6, residency 3, materials 3, mentorship 2.

The new `teaching` category is applied only where there is an actionable route: a posted role, a standing faculty pool, or an explicit "teach with us" or guest-workshop invitation. Leads that only say "watch the district jobs site" stay in `details` but do not get the chip.

With the four new SF studios, SF now has about 25 places with ceramics classes or memberships on the map (studios plus the Rec & Park and Ruby's programmes), against the roughly 26 studios expected. The likely missing two are Sunset Clay House and Richmond Clay House (see Gaps).

## Teaching leads for Winnie

Ordered by how ready each one is to act on. All of them are in the data with the exact wording in `details` under "Teaching lead:".

1. **Clayroom, all five studios** (SoMa, Potrero, San Mateo, Oakland Temescal, West Oakland). The careers page says they are "always looking for talented individuals in... ceramics": email jobs@clayroomsf.com with a resume. The Oakland membership page also says members take part in "mentorship, teaching opportunities". Since Clayroom has already approached Winnie, the West Oakland studio is worth asking about: it is the only Clayroom with cone 10 gas reduction, which suits a glaze-chemistry class.
2. **Ohlone College, Fremont.** A standing part-time pool just for ceramics (job 202300013), $73.90-$124.47 per hour. Applications are accepted year-round and kept for two years. Minimum qualification is a Master's in fine arts (ceramics counts), art or art history, or an equivalency. Foreign transcripts need a course-by-course evaluation.
3. **West Valley-Mission Community College District.** West Valley College's Part-Time Ceramics Instructor pool was posted April 8, 2026. A Mission College ceramics pool (posted May 2025, open until filled) lists a lower bar: a bachelor's plus two years of related professional experience. Both pay $38,464-$55,582 per semester prorated. Apply at wvm.peopleadmin.com.
4. **Cal State East Bay, Art & Design.** The AY 2026-27 lecturer pool (job 557363, posted April 23, 2026, open until filled) lists ceramics among the teaching duties. It needs a Master's plus some college teaching. The university does not sponsor visas for lecturers.
5. **SF State School of Art.** Standing lecturer pool: email a CV and cover letter to sch_art@sfsu.edu with the subject "Lecturer Pool". Needs a graduate degree or equivalent experience. SF State teaches ART 548 Glaze Calculation, which fits Winnie directly.
6. **The Crucible, Oakland.** Part-time faculty hiring is open now (page dated June 30, 2026). Lead faculty earn $25.00-$27.50 per hour and teaching assistants from $19.44. Apply through the Faculty Job Application form (choose Ceramics); questions to teaching@thecrucible.org.
7. **Center for Community Arts, Walnut Creek.** Its Opportunities page says it is "currently seeking professional, practicing visual and performing artists" for afterschool, camp and 10-session quarterly classes, as contract roles. It has a large ceramics studio at Civic Park.
8. **South Bay Ceramics, Mountain View.** "Always looking for wheel-throwing and handbuilding instructors." Needs 3+ years in ceramics and some teaching experience. Apply at southbayceramics.com/careers.
9. **Colibri Pottery Studio, San Jose.** An open Pottery Instructor role, applied for through the form at colibripotterystudio.com/jobs. **Spiffy Pottery Studio, Menlo Park** is hiring a part-time kids handbuilding instructor at $25-32 per hour (email spiffy@thespiffystudio.info).
10. **SFArtsED, SF.** Places artists in SF public schools and lists ceramics among the disciplines it hires for. It interviews all year; contact Program Director Mia Waller.
11. **Creativity Explored, SF.** Hired part-time ceramics teaching artists in 2023 and 2024 ($24-25 per hour). No role is open now; watch creativityexplored.org/careers (jobs@creativityexplored.org). **NIAD, Richmond** has a Studio Manager role ($35-38 per hour, posted 10/16/26, priority review 10/30/26) and rolling substitute facilitator applications. **Creative Growth, Oakland** has a ceramics studio but no facilitator role is posted.
12. **The Pottery Studio, SF** (already on the map). Its employment page says "always looking to meet fellow potters": send a resume, work samples and location preference to clayandsupply@thepotterystudio.com.
13. **Guest-workshop pitches** (no posting, but explicit invitations or guest series): Speckle Studio ("visiting artist workshops... get in touch", hello@specklestudio.com); Uncle Paul's Featured Artist Series run with the SF Ceramic Artists Guild (unclepaulsceramics@gmail.com); CACM's mentor-led Ateliers and Clay Talks (info@cacm.studio); Merritt Ceramics' guest workshops (info@merrittceramics.com). A wild-clay or glaze-chemistry workshop is the natural pitch for each.
14. **Run your own class:** Art Space on the Coast (Pacifica) rents its learning room for a class series of up to 8 people. Root Division studio artists can teach adult classes as their monthly work-trade; the next deadline is Nov 1, 2026, a studio tour is required three months ahead, and its studios list no kiln.
15. **Foster City's new Community Center** (opened Sept 19, 2026, with a ceramics studio). In February 2026 the city asked for class instructors. The application link now 404s, so contact Recreation Manager Tiffany Oren at (650) 286-3395.

Also worth knowing: the Peralta, San Mateo, Chabot-Las Positas and Contra Costa college districts all posted ceramics adjunct roles in 2024-25 that have since closed. Check their job boards each semester. The California minimum qualification for art is a Master's in fine arts, art or art history, or an equivalency.

## The 10 best finds

1. **Clayroom West Oakland** (1723 Peralta St): a 5,700 sq ft member studio with both cone 5 electric and cone 10 gas reduction, and the Clayroom route to teaching.
2. **Ohlone College ceramics faculty pool**: a year-round, ceramics-specific adjunct pool with hourly pay stated.
3. **Merritt Ceramics** (Oakland): classes, memberships, a priced outside firing service (cone 5/6, from $15), a work-exchange track, a 2026-27 residency and MerrittFest (Nov 7, 2026).
4. **Ceramic Art Center of Marin** (San Anselmo): a cone 10 gas studio for intermediate-to-professional potters with mentor-led Ateliers and a Clay Talks series. Its free 2027 residency closes Jan 30, 2027.
5. **Mt Vision Ceramics** (Inverness): Jess Taylor makes glazes from local Mount Vision granite and publishes the tests. The closest peer to Winnie's wild-clay and glaze-chemistry practice found anywhere in this pass.
6. **The Crucible** (West Oakland): ceramics faculty hiring is open now, with pay stated.
7. **Douglas & Sturgess** (Richmond and SF Bryant St): open, with hours and prices. Laguna B-Mix at cone 5 and cone 10 ($24-26 per 25 lb), plasters for slip-casting molds and mold-making classes. This fills the supplier gap that Leslie's closure leaves.
8. **Speckle Studio** (Bernal Heights, the former Pinckney Clay): 18 wheels, memberships at $250-295 a month, and it invites visiting-artist workshops.
9. **Blossom Hill Ceramics** (Los Gatos): a 55-year-old South Bay school with 40+ wheels, mid and high fire, and open studio 7am-11pm every day of the year.
10. **SFMOMA "Go Your Own Way: Northern California Craft, 1945-80"** (Feb 13 - Nov 14, 2027): the first major survey of postwar NorCal craft, ceramics included. Also on now: Rose B. Simpson's "LEXICON" at the de Young (through Feb 7, 2027).

Also useful for selling work: Renegade Craft SF (Fort Mason, Nov 14-15, 2026; booths $400-$2,000), the Walnut Creek Chili Bowl (Nov 14) and Handcrafted Holiday Sale (Dec 5), East Bay Open Studios winter edition (Dec 5-6 and 12-13), Silicon Valley Open Studios 2027 (artist registration opens Dec 1), and the Mill Valley Fall Arts Festival (juried, one-off work only).

Watch for Winnie: **Amphora (San Rafael) and Art Space on the Coast (Pacifica) both refuse wild clay and homemade glazes** in their firing services. Merritt fires cone 5/6 outside work only on clay bought there or with proof of a cone 5/6 body.

## Wrong or stale entries already on the map

These are reported only; the files were not edited.

- **`sfbay-clayroom-sf-oakland-san-mateo` (sf-bay.json)**: one combined entry for five studios, pinned in Oakland (37.83192, -122.2538) with no street address. Clayroom now has separate studios at 375 9th St and 1431 17th St (both in sf-studios.json) and at 3050 S Delaware St Ste 100 San Mateo, 4268 Broadway Oakland (Temescal) and 1723 Peralta St Oakland (West Oakland), all three new here. Suggest turning it into a workshops and firings entry (raku and obvara at Temescal) or removing it.
- **`cca-mfa-ceramics` (index.json)**: California College of the Arts announced on Jan 13, 2026 that it will close at the end of the 2026-27 academic year. Vanderbilt is buying the SF campus and taking over the former Oakland Rockridge campus (KQED, https://www.kqed.org/arts/13985359/california-college-of-the-arts-closing-vanderbilt-university). Flag it as closing, and don't list it as a teaching or MFA option after 2027.
- **Duplicate Potters' Studio**: `potters-studio-berkeley` (index.json, berkeleypottersstudio.com) and `sfbay-the-potters-studio` (sf-bay.json, thepottersstudio.org) are the same place; berkeleypottersstudio.com 301-redirects to thepottersstudio.org.
- **Duplicate Headlands**: `headlands-center` (index.json) and `sfbay-headlands-center-for-the-arts-artist-in-residence-program` (sf-bay.json).
- **`ccsf-ceramics` (index.json)**: could not be verified because ccsf.edu returned 403. Search results suggest the Fort Mason art campus closed around 2020, so ceramics is probably only at Ocean campus. Not confirmed from an opened page.
- **`sfbay-laney-college-ceramics-wood-firing-workshop`**: points at a one-off Eventbrite page. https://laney.edu/art/ (opened, ©2026) lists the Ceramics A.A. and ceramics faculty (MC Bassett, Martha Storm, Pamela Thomas). Repoint the entry or add the department.
- **`sfbay-ruby-s-clay-studio-gallery`**: points at /gallery. The nonprofit's classes page (https://www.rubysclaystudio.org/classes) has 8-week ($425) and 16-week ($850) classes, with Session 6 running Oct 13 - Dec 12, 2026; managers@rubysclaystudio.org, 415-558-9819.
- **`sfst-heath-ceramics-sf`**: could add the Heath Clay Studio's "Hands-on Heath: Making a Bud Vase" workshops (555 Alabama St, Boiler Room entrance, listed Sept 19, 2026 - Jan 23, 2027) and its weekday observation hours.
- **`sfst-the-pottery-studio-sf`**: could add the standing employment invitation (teaching lead 12 above).
- **`sfbay-mill-valley-potter-s-studio`**: its careers page (last updated July 7, 2025) says it is not hiring. The only "teacher wanted" listing found is from 2017. Do not show it as a teaching lead.
- **`sfbay-clay-planet`**: leslieceramicsupply.com now 301-redirects to Clay Planet's shop and leslieceramics.com is a parked for-sale domain. **Leslie Ceramic Supply is effectively closed or absorbed**, so don't send Winnie there.
- **`sfbay-museum-of-craft-and-design`**: confirmed active, showing "OBJECTS: USA" Sept 5, 2026 - Jan 17, 2027, Thu-Sun 12-5.

## Closed, paused or skipped (not in the data)

- **Closed or paused:**
  - Clay By The Bay (Fisherman's Wharf) closed in July 2026 after an eviction filing (Hoodline). Already excluded earlier.
  - The Clay Studio (61 Bluxome St) is marked closed on Yelp.
  - JCCSF youth ceramics has been paused since January 2025.
  - Kiln Gods Pottery (San Rafael) has classes on pause while it looks for a new studio.
  - Sausalito Art Festival has been on hiatus since 2021.
  - Urban Air Market shows only "Coming Soon".
  - Mission Cultural Center was reported closed in January 2026. Seen only in a search result; not opened.
- **Live site but no 2025-26 evidence:**
  - Sunset Clay House (2550 Judah St) and Richmond Clay House (1017 Clement St); both sites are JS-heavy or carry a 2019 footer.
  - Red Ox Clay Studio (Concord): only dated notice is from 2021.
  - Clay Clubhouse (3463 Champion St, Oakland): footer ©2020.
  - Merritt College ceramics, Skyline Ceramics (a splash page only), Marinship Studios (Sausalito rentals, hosts a "Marin Ceramic Cooperative"), Glaze & Confused (San Rafael), Lyra Ceramics.
- **Unverifiable:**
  - Sunnyvale city pottery studio: the city site returns 403 and the registration site's certificate has expired.
  - Bay Ceramic Supply, BACAG and the old ASFP: domains do not resolve. ASFP became ACGA.
  - Mutual Stores (an Oakland ceramic-waste and wild-clay collective): last evidence is from 2018. Worth asking about locally.
  - Transmission Gallery (Oakland): domain is parked.
  - The FM Oakland kiln-repair lead: no dated page for the repair business.
- **Out of scope:** NCECA 2027 (Baltimore); Pleasanton Firehouse Arts (no ceramics in its 2026 classes).

## Gaps

- **City and county rec programmes are thin.** Not verified: Walnut Creek city site (Center for Community Arts is in via communityarts.org), HARD Hayward, LARPD Livermore, Fremont/Olive Hyde, Pleasant Hill, Lafayette, Moraga, San Ramon, Danville; Mountain View, Santa Clara, Cupertino, Sunnyvale, Menlo Park (Arrillaga), Redwood City, Burlingame, Belmont, San Carlos, Los Gatos-Saratoga rec; Novato, Fairfax, Sausalito; and adult schools (Piedmont, Mt. Diablo, Acalanes, Berkeley, Fremont). SF Rec & Park's ceramics classes beyond the Randall Museum need the ActiveNet catalogue, which needs JavaScript.
- **Colleges not checked:** College of Marin, Diablo Valley College, Contra Costa College, College of Alameda, Berkeley City College, Cañada, Las Positas, Evergreen Valley and San Jose City College. Also the district job boards for CCSF, Peralta, SMCCD, Chabot-Las Positas and 4CD.
- **Individual artists who take assistants or apprentices:** still thin (4 artist entries). No current apprenticeship call was found, FLM Ceramics' included. The best list of working Bay Area teachers to follow up is The Potters' Studio teaching-artist roster (thepottersstudio.org/our-team-1): Ian Bassett, Scott Jennings, Bob Johnson, Jim Newton, Phoebe Deutsch, Lyra Dela Rosa, Ahn Lee, Jason Stern, Siegfried Oyales, Haley Tessler (raku), Katie Gibbs (local materials), Antonia Casino and Todd Pletcher. Open studios ceramic participants (ArtSpan, Shipyard, EBOS, SVOS) were not listed by name.
- **Kiln-firing services and private studio rental in SF:** none found with 2025-26 evidence. Firing is members-only at the SF studios checked. Outside SF: Merritt (Oakland), Amphora (San Rafael) and Art Space on the Coast (Pacifica).
- **Suppliers:** no verified Bay Area Laguna distributor besides Douglas & Sturgess, and no raw-materials source (feldspars, ball clays, wood ash) beyond what sf-bay.json already has.
- **Lecture series:** CACM Clay Talks (Oct 24 and Nov 21, 2026) and CCACA are in. CCA, SFSU and Asian Art Museum ceramics talks were not verified.
- **Guilds:** no independent potters' guild on the Peninsula, in the South Bay or in Marin could be verified.

Re-running the gaps above needs a fresh web-search budget; the per-turn search limit was reached during this pass.
