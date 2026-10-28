# Suitability: Fairfax (new) and a deeper San Francisco (October 2026)

A data-only change to `data/suitability/index.json` and `data/suitability/ccMode.json`. No UI files were touched. San Francisco's `forWinnie` and `foodScene.notes` were deliberately left as they were, because another session is rewriting them. No other places were edited.

Following Devin's rule, the new and rewritten text describes places on their own terms (studios, materials, markets, music, walks, practicalities). It does not frame anything around Winnie's ethnicity or nationality, or around any community feeling familiar. The only mention of Rwanda in the new Fairfax entry is `practicalInfo.visaInfo`, which is copied word for word from San Rafael as asked.

## Fairfax, California, USA (new)

Inserted right after San Rafael in both files, with the full San Rafael schema: climate, seasons, localColor, ceramicsEcosystem, chili, creepy crawlies, practicalNotes, indigenousTraditions, coffee, dessert, beach, practicalInfo, foodScene, liveMusic, everydayLife and forWinnie.

- **Coordinates**: 37.9873, -122.588, from Nominatim ("Fairfax, Marin County, California, 94930", addresstype town).
- **Climate**: NOAA NCEI U.S. Climate Normals 1991-2020, monthly, metric, station **USC00044500 Kentfield**. Kentfield (37.9567, -122.5447) is the nearest normals station, about 5 km southeast of downtown Fairfax in the same Ross Valley. Values are °C and mm to one decimal, as published. The annual rain is 1,127.6 mm. Fetched from `https://www.ncei.noaa.gov/access/services/data/v1?dataset=normals-monthly-1991-2020&stations=USC00044500&units=metric&dataTypes=MLY-TMAX-NORMAL,MLY-TMIN-NORMAL,MLY-PRCP-NORMAL`.
- **Daylight**: astronomical day length (sunrise to sunset, with refraction) on the 15th of each month at 37.9873° N.
- **Humidity**: the same Oakland International (USW00023230) proxy used for San Rafael, because no humidity normals exist for Kentfield. It's a proxy, and summer afternoons in Fairfax are drier than it suggests.
- **ceramicsEcosystem**: built only from verified entries already in `data/opportunities/*.json` within about 15 km of downtown Fairfax, with their URLs:
  - Studios: CACM (2.6 km), the CACM 2027 residency, Amphora (6.8 km), Terra Linda Ceramic Artists (4.0 km; flagged "unconfirmed" in the repo, so the note says so), Art Works Downtown (5.3 km), Mill Valley Potter's Studio (13 km; also "unconfirmed") and Marin Pottery (13.5 km).
  - Suppliers: Dharma Trading (4.8 km) and Atelier Yarns San Rafael (4.7 km).
  - Galleries: MarinMOCA (5.4 km), Bolinas Museum (12 km), Museum of the American Indian (14.3 km) and Heath Sausalito (15.2 km, just over the line).

  No clay supplier lies within 15 km, so the `community` note names Douglas & Sturgess (Richmond) and Creative Ceramics and Glass (Santa Rosa) by distance only.
- **opportunities**: CACM, the CACM residency, Amphora and Marin Open Studios.
- **practicalInfo.visaInfo**: copied exactly from San Rafael. `healthcareAccess` was copied too, and `indigenousTraditions` is San Rafael's (Coast Miwok; Graton Rancheria).
- **ccMode**: Fairfax-specific cannabis rules, real fabric, theatre and dance places, and trim work "not available" (San Rafael's text).

### Fairfax sources

| Item | Verified by |
|---|---|
| Fairfax Festival & Ecofest (47th, June 12-14, 2026) | Marin Mommies 2026 listing; Town of Fairfax festival page |
| Fairfax Farmers Market (Wed 4-8pm, May 6-Oct 28, 2026, Bolinas Park, live music) | Town of Fairfax events calendar (fetched Oct 28, 2026); Marin Mommies |
| Halloween Parade and Haunted Grove (Oct 31, 2026); Día de los Muertos ofrenda (Oct 30, 2026) | Town of Fairfax events calendar |
| Marin Open Studios (May 2-3 and 9-10, 2026) | marinopenstudios.org |
| Mountain Play | mountainplay.org (2025-26 sponsors, 2027 season); The Wizard of Oz in 2026 comes from a Harvard Club of SF event listing |
| Wildflowers (Lake Lagunitas, Yolanda Trail, Mt Tam lupine; February to mid-April) | Visit Marin "Marin Wildflower Walks"; parks.ca.gov March-April 2026 Mt Tam wildflower walks |
| Coho run (Nov-Feb, peak Dec-Jan; Leo T. Cronin about 8 miles west) | SPAWN / Turtle Island Restoration Network viewing guide; 2025-26 creekwalk post (Dec 2025) |
| Restaurants and cafés (Barefoot Cafe, Mas Masa, Cafe Lotus, Fradelizio's, Village Sake, Fairfax Scoop, The Coffee Roastery) | Marin Magazine "Where to Eat in Fairfax" (July 2, 2026, updated August 2026); own sites for Barefoot, Fradelizio's (©2026), Village Sake (2026 Michelin) |
| Good Earth Natural Foods | genatural.com (©2026, October specials) |
| Peri's Tavern (29 Broadway, live music four nights a week) | peristavern.com (©2026); JamBase show Oct 7, 2026 |
| Mac's at 19 Broadway | macsat19broadway.com (dated shows Oct 25 and 31, 2026) |
| Sweetwater, 142 Throckmorton, Marin Symphony | own sites with 2026-27 dates |
| Marin Museum of Bicycling | mmbhof.org (Fall Bike Swap Oct 24, 2026) |
| Marin Transit routes 23, 228, 68 | marintransit.gov route pages |
| Cannabis: La Flor, 1601 Sir Francis Drake Blvd | California DCC licence search (C10-0001670-LIC, active, adult-use and medicinal retailer; Marin Retail Ventures LLC); Leafly Fairfax listing; town permit programme (application period opened March 2025, per search results; the town site blocks bots) |
| Cannabis: Marin Alliance | DCC licence C10-0000609-LIC at 6 School St: **expired** |
| Ross Valley Players 2026-27 (97th season) | TicketTailor season listing; Pacific Sun 2026-27 preview |
| Marin Ballet (2026-27 school calendar), Dharma Trading, Atelier Yarns | own sites (©2026) |
| Rent | Trulia (one-bedroom average about $2,106, August 2026) and Rentometer (median near $2,800, June 2026), via search results. Both sites block bots, so these figures are reported as a range. |

## San Francisco, California, USA (deepened)

`forWinnie` and `foodScene.notes` are unchanged; the script asserts this before writing.

- **everydayLife.neighborhoods**: 4 → 8 entries. They are Mission/Bernal, Potrero/SoMa, Dogpatch/Bayview, Castro/Duboce/Haight, Richmond, Sunset, Excelsior/Glen Park/Outer Mission and North Beach/Chinatown. Each one says which studios are there (taken from the addresses in the repo's opportunity data), gives a rough relative rent level, describes daily life, and says whether it's on the foggy or sunny side.
- **everydayLife.markets**: 5 → 8. The new ones are Mission Community Market (Foodwise), Fort Mason Center (CFMA) and Outer Sunset. Heart of the City is corrected: it moved from UN Plaza to Fulton Plaza in 2023.
- **everydayLife.walks**: 4 → 7. Sunset Dunes, the 16th Avenue Tiled Steps and Glen Canyon are new.
- **everydayLife.gettingAround**: rewritten with current Muni fares from sfmta.com: $2.85 with Clipper or a card, $3 cash, a $86 monthly pass, and $104 with BART inside the city. It also covers Muni Metro lines, BART, Caltrain, the ferries, contactless bank cards on Clipper, the Wiggle, JFK Promenade, Bay Wheels and parking.
- **everydayLife.notes**: adds that neighbourhood rent differences are modest.
- **liveMusic.venues**: 9 → 12. Golden Gate Park Band (free, Sundays April-September, 2026 season), The Chapel and Old First Concerts are new. The notes mention the free park concerts and chamber music.
- **foodScene.favorites**: 9 → 12.
  - **Removed**: New Eritrea and Sheba Piano Lounge, which had been picked for her background.
  - **Added**: Bi-Rite Market, La Taqueria, Good Mong Kok Bakery, Arsicault Bakery and Outerlands.
  - The list now runs from takeaway dim sum and burritos to Zuni.
- **localColor.blooms**:
  - Cherry blossoms moved from April to **March**: the Gardens of Golden Gate Park say mid-March to early April.
  - Magnolia and dahlia notes are updated, including the 2026 centenary of the dahlia as the official flower and its June-to-October bloom.
- **localColor.festivals**: 7 → 16, in month order, each with a verified 2026 edition or a published 2027 date. The new ones are Noise Pop, Bay to Breakers, SF Pride, Sunday Streets, Outside Lands, Flower Piano, Fleet Week, Día de los Muertos and Lightscape. Chinese New Year now gives the February 20, 2027 parade date, ArtSpan gives the 2026 dates (Sept 18-Oct 25) and the Shipyard hub, and the craft-fair note names West Coast Craft's winter show.
- **Two small rule fixes outside the listed fields**:
  - The MoAD gallery note no longer says "an important home for a Rwandan maker".
  - The coffee note no longer says "Ethiopian beans are on almost every menu"; it now says "single-origin beans".

### San Francisco sources

| Item | Verified by |
|---|---|
| Ferry Plaza, Alemany, Mission Community Market hours | foodwise.org/markets; sf.gov |
| Clement Street market (Sun 9-2, 244 Clement) | Agricultural Institute of Marin page (©2026) |
| Fort Mason market (Sun 9:30-1:30) | California Farmers' Markets Association page |
| Outer Sunset market (Sun 9-2, 37th Ave) | Mato listing for May 24, 2026 |
| Heart of the City (Fulton Plaza, Wed and Sun) | CBS/Wind Newspaper on the September 2023 move; Accrue listing for Feb 11, 2026 |
| Rainbow, La Palma, Burma Superstar (current hours), Tartine, Arsicault, Bi-Rite, Outerlands (current hours), Zuni | own sites, fetched Oct 28, 2026 |
| La Taqueria, Good Mong Kok | The Infatuation review pages (no closure notice) |
| Stern Grove, Fillmore, GAMH, Black Cat, Bird & Beckett, YBG Festival, Hardly Strictly, The Chapel (Oct-Dec 2026 shows), Golden Gate Park Band (2026 season), Old First Concerts (Nov-Dec 2026) | own sites |
| SFJAZZ | 2026-27 "Forward Motion" season page (via search; the site blocks bots) |
| SF Symphony | site live (behind a waiting room) |
| Chinese New Year (Feb 20, 2027), Cherry Blossom (60th, April 2027), Carnaval (May 29-30, 2027), Bay to Breakers (May 16, 2027), SF Pride (June 26-27, 2027), Outside Lands (Aug 6-8, 2027), Fleet Week (Oct 4-12, 2026), Sunday Streets 2026, Noise Pop 2027, Renegade (Nov 14-15, 2026) | organisers' sites |
| West Coast Craft | Fort Mason "West Coast Craft Summer 2026" page; winter show Nov 21-22, 2026 per a third-party listing |
| ArtSpan SF Open Studios 2026 | Hoodline, Oct 7, 2026 |
| Día de los Muertos | Calle 24 page for the 44th procession (Nov 2, 2025) |
| Magnolias, cherry blossoms, Flower Piano (Sept 10-20, 2026), Lightscape (Nov 20-Jan 3) | gggp.org |
| Dahlia Dell centenary | Richmond Sunset News press release (Apr 21, 2026); Boston Globe (Aug 29, 2026) |
| Sunset Dunes and Prop G | Local News Matters (Apr 13, 2026); GrowSF November 2026 voter guide |
| 16th Avenue Tiled Steps | 16thavenuetiledsteps.com |
| Muni fares | sfmta.com/getting-around/muni/fares |

## Uncertain items

- **Kentfield as Fairfax's station**: it's about 5 km down the same valley. Fairfax, closer to the hills, is probably slightly cooler at night and similar or a little wetter.
- **Humidity** for Fairfax is a proxy (Oakland International).
- **La Flor**: the state licence is active (created February 2026), but no opening date was found. The ccMode text says to check that it has opened. The Town of Fairfax's cannabis pages return 403 to automated fetches, so the permit-programme description comes from search results.
- **Fairfax rent**: only a small sample of listings exists, and estimates disagree ($2,100-2,800 for a one-bedroom).
- **Mountain Play 2026 title** comes from a third-party event listing; the Mountain Play site now shows its 2027 season.
- **Fairfax Scoop, Mas Masa and Cafe Lotus** have no working website that we could fetch (fairfaxscoop.com and masmasa.com don't respond), so their `url` points to Marin Magazine's August 2026 guide.
- **Not used for Fairfax**: Public House Marin (its own site says it won't reopen), the 19broadway.com and perisbar.com domains (both now hijacked; the venues use macsat19broadway.com and peristavern.com), the Peri Park summer concerts (no 2026 date found), Sleeping Lady (no current listing found), M.H. Bread & Butter (bot wall, unverified), Magpie consignment (no site), and the Fairfax Scarecrow Festival (no evidence it runs).
- **San Francisco neighbourhood rents** are described relatively. Zumper's neighbourhood pages gave conflicting numbers (Central Sunset was quoted at both $3,500 and $4,000 in 2026).
- **Heart of the City**: the closing time varies by listing (4pm or later), and its old domain is now parked.
- **Día de los Muertos 2026**: the 2026 route wasn't published at the time of checking. The note gives the usual 22nd and Bryant start.
- **Not used for San Francisco**:
  - Bottom of the Hill: its owners are leaving after December 2026 and the venue's future format is unclear.
  - Noe Valley Farmers Market: its site has no dated content.
  - North Beach Festival: the domain is hijacked.
  - Queen Wilhelmina tulips: no 2026 bloom source was found.
  - Swan Oyster Depot: the domain is hijacked.
- **Left as found** (outside this task): San Francisco's `forWinnie` and `foodScene.notes` still mention injera, New Eritrea and Kigali; the other session is rewriting them. San Rafael's `forWinnie` and `foodScene.notes` also compare it to Kigali and mention East African food, but San Rafael was out of scope.
