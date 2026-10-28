# SF Bay Area ceramics scouting report

Verified 2026-10-27. Data: `data/opportunities/sf-bay.json` (49 entries), loaded with `index.json` by `getOpportunities()` in `lib/data.ts`.

The target was roughly 80-150 entries. I stopped at 49 because I would not include anything I could not open and confirm as active in 2026. Many sites were JS-only, rate-limited (429), blocked (403), or showed no 2026 activity.

## Counts

Primary category (the `category` field and `type`; "class" is stored as type `workshop`):

| category | entries |
|---|---|
| studio | 15 |
| class | 11 |
| residency | 5 |
| community | 5 |
| supplier | 5 |
| materials | 4 |
| gallery | 3 |
| artist | 1 |
| mentorship | 0 (see gaps) |

Entries appear under more than one category, so counts by `categories` membership are larger: class 27, studio 19, community 10, supplier 7, materials 6, residency 5, gallery 5, mentorship 3, artist 2.

Geocoding used Nominatim. 10 entries are `"approximate": true` (city or area centre): Chalk Hill and Headlands residencies (Nominatim could not resolve the rural street), Cobb Mountain, Recology, Matt Fishman (city only), SF Ceramic Artists Guild market (venue address not published), and the four park-rule entries.

## Notable finds for Winnie

- **Sonoma Community Center Ceramics** (Sonoma): a six-month paid residency ($750/month, housing, free glazing and firing, about 20 hours/week of studio tasks plus paid teaching). It is open to ceramic artists living in the US. The 2027 sessions closed June 15, 2026, and the next cycle is not posted. The centre also has an open studio with soda, raku and gas kilns.
- **Laney College wood-firing workshop** (Oakland): a train-kiln course run by Ian Bassett, Feb 4 - Apr 22, 2027, $765 public / $665 students.
- **Cobb Mountain Art and Ecology Project** (Lake County): a one-year wood-fire residency with rolling applications for 2027-28. Residents pay rent. It is outside the core Bay Area.
- **Hickory Clay** (SF Mission): membership, a glaze design and mixing series ($450), and a wild-clay workshop named without date or price.
- **Berkeley Art Studio** (UC Berkeley): an intermediate glaze class (Oct 26 - Dec 7, 2026) with glaze composition, and studio clay at $15-$35 per 25 lb bag.
- **Clay Creations Pacifica, Common Clay Space**: raku, pit, soda and wood firing workshops.
- **Berkeley Potters Guild**: a Saturday gallery, seasonal sales and East Bay Open Studios. This is the natural way to meet working potters.
- **Wheelhouse Clay Studio** (SF): classes of 6 weeks cover wheel, pinch/coil and slab. Membership requires a 6-week course plus instructor referral.
- **Silica / SiO2** at Santa Cruz MAH (to Jan 3, 2027, panel Nov 8) and the SF Ceramic Artists Guild holiday market (Nov 29, 2026).
- **Materials rules**: EBRPD Ordinance 38 s.805 bars removing earth, rocks and minerals, and s.804 bars collecting plants including dead wood. 14 CCR 4307 (State Parks) bans removing geological features except where "rockhounding" is permitted. The GGNRA 2025 compendium requires a permit to collect rocks or minerals and bans firewood gathering. Wild clay digging in public parks is therefore generally not allowed without a permit. The Artillery Ceramics foraging trip at Thornton State Beach (Mission Local, 2024) cites an educational/rockhounding exception with a 15 lb cap. That comes from a comment by the article's author, so treat it as hearsay and ask State Parks. Private land with the owner's permission is the safe route.

## Gaps

- **Mentorship, apprenticeship and studio-assistant jobs: none verified as open.** The FLM Ceramics and Tile one-year studio apprenticeship in Petaluma (301 2nd St, up to 15 hours a week, 24-hour studio access, email flmceramics@gmail.com) is a strong fit, but its page is undated and I could not confirm it is open, so I left it out. The Richmond Art Center teaching-artist posting is dated January 2025. Mill Valley Potter's Studio listed a work-trade tech role but said it was not hiring (page last updated July 2025). Practical route: ask Berkeley Potters Guild members, Wheelhouse, Sonoma Community Center, Hickory Clay and Petaluma Pottery directly.
- **Working artists who take assistants**: only one artist entry. Open Studios listings (East Bay, SF, Marin, Shipyard) name no ceramic artists and have ended for 2026. Check the 2027 listings.
- **Residencies**: Headlands and Recology are not ceramics-specific (Recology needs Bay Area residency). Chalk Hill ($500/week) is not confirmed to have a kiln. Merritt Ceramics (Oakland) closed its 2026-27 resident call on Aug 1, 2026 and requires Oakland residence. I could not fetch its page (429), so it is not in the data.
- **Galleries and exhibits**: few ceramics shows dated on or after Oct 27 turned up. Museum of Craft and Design's OBJECTS: USA (to Jan 17, 2027) is not confirmed as ceramics-specific. Ruby's Clay Studio & Gallery (Noe St) has a show ending Oct 30. OMCA, BAMPFA and Marin MOCA showed no ceramics.
- **Suppliers**: Leslie Ceramic Supply (Richmond) may have closed; its domains are dead or for sale. Douglas & Sturgess, Heath Ceramics (clay, tours, November sale) and Blick returned 429 or blocks, so they are unverified. No verified Bay Area source for wood ash, lime, or feldspar/silica/ball clay. Gladding McBean (Lincoln) lists bulk clay but it is unknown whether it sells to individuals.
- **Wood ash**: no verified source. Arborist Now (SF urban wood milling) is a lead only and its page does not mention ash.
- **Clubs and guilds**: SF Ceramic Artists Guild appears via sfcag.org (Zeffy page is 403). ACGA's 2027 festival date is not announced.

## Uncertain entries (weaker 2026 evidence, stated in each `details`)

- Marin Pottery: 2025 footer, links a 2026 summer camp page.
- The Potters' Studio (Berkeley): membership page is current but has no explicit 2026 date.
- Common Clay Space (footer 2024; January 2027 pit-firing workshop is the evidence), SebArts (verified a Feb-Apr 2026 series only), Earthfire Arts Studio (mostly pottery painting and molding).
- Sharon Art Studio, Mission Arts Center, Alameda Pots, Mill Valley, Cass Ceramics, Kollektiv: dates shown without a year, but the weekdays match 2026.
- Palo Alto Art Center: ceramics schedule not on the page; address taken from a 2024 Mountain View Voice article.
- Fellowship of Craft (Oakland) address came from a search snippet. West Coast Craft address came from the organiser's summer listing. Ceramics vendors are not itemised for either.
- Hickory Clay supplier side, Gladding McBean, Creative Ceramics and Glass (Santa Rosa, outside the core area).
- Matt Fishman: evidence is a January 2026 Studio Potter article; no teaching or assistant offer stated.
- Clay By The Bay (SF) was dropped: it closed in July 2026 per Hoodline.
- SF Clayworks (Bayview, $190/month, 24/7) and Clay Clubhouse (Oakland, 3463 Champion St) were excluded for lack of 2026 evidence (2025 and 2020 footers); both may still be active.
- Fetched pages gave no street address for several places (Clayroom's SF studios, Clay Clubhouse's membership details). The Clayroom entry uses its Oakland Temescal studio address for the pin.
- The source URL is the page the scouts opened. Some facts (for example the Berkeley Potters Guild holiday sale, Heath events) appeared only in search snippets and were excluded.
