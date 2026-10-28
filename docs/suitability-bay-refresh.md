# Suitability Index: Bay Area refresh (October 2026)

A data-only refresh of the San Francisco Bay Area in `data/suitability/index.json` and `data/suitability/ccMode.json`, written for Winnie. No UI files were touched.

## What changed

| Place | Status | Represents |
|---|---|---|
| San Francisco, California, USA | refreshed | the city |
| Oakland, California, USA | **new** | Oakland and Emeryville |
| Berkeley, California, USA | refreshed | Berkeley, Albany, El Cerrito |
| Sausalito, California, USA | refreshed | southern Marin |
| San Rafael, California, USA | **new** | northern Marin (San Rafael, San Anselmo, Novato) |
| Palo Alto, California, USA | **new** | the Peninsula (Palo Alto, Menlo Park, Mountain View) |
| San Jose, California, USA | refreshed | the South Bay |
| Petaluma, California, USA | **new** | the Sonoma side |

For every place, every existing field was rewritten: climate, seasons, localColor, ceramicsEcosystem, probabilityOfChili, creepyCrawlies, practicalNotes, indigenousTraditions, probabilityOfCoffee, localDessert, beachAccess and practicalInfo. New entries copy the full schema of the San Francisco entry. Existing `opportunities` lists were left as they were. New entries list local opportunity names from the opportunity data.

Four new fields were added to each Bay entry:

- `foodScene` `{score, rating, notes, favorites[{name, what, neighborhood, url}]}`. Each has 5 to 9 places, with farmers' markets and East African food where it exists.
- `liveMusic` `{score, rating, notes, venues[{name, kind, neighborhood, url}]}`. Each has 5 to 9 venues, including free and outdoor series.
- `everydayLife` `{markets[], walks[{name, notes}], gettingAround, neighborhoods[{name, why}], notes}`.
- `forWinnie`: 3 or 4 sentences in the second person.

All eight places in `ccMode.json` now have accurate cannabis rules, real fabric, vintage and dance places, and a trim-work entry that says plainly it isn't a route for Winnie. Employment needs work authorization, and federal law creates immigration risk. `fashionEcosystem` keeps its four string fields and gains a `places` array of `{name, kind, url, notes}`.

### Facts corrected

- **Visa** (all 8 places): the old text was "90 days visa-free (ESTA) for most countries". It now says Rwandan citizens need a B-1/B-2 visitor visa from the US Embassy in Kigali. It also says ESTA only covers Visa Waiver Program countries (Rwanda is not one), that paid work or teaching needs a status with work authorization, and that she should check travel.state.gov.
- **Leslie Ceramic Supply** is closed: its domains redirect or are parked, per `docs/bay-ceramics-report.md`. It has been removed from SF, Berkeley, Sausalito and San Jose. Douglas & Sturgess (SF and Richmond) and Clay Planet (Santa Clara, not San Jose) replace it.
- **Sausalito Art Festival** has been on hiatus since 2021. It was removed from the SF and Sausalito festivals.
- **"How Berkeley Can You Be?"** (listed for December) no longer runs and was removed.
- **Bay Area Maker Faire** is now on Mare Island in Vallejo, in September, not in SF in May. It was removed from SF.
- **Blue Bottle** was founded in Oakland in 2002, not San Francisco. The SF coffee note is fixed and Oakland's credits it.
- **Tilden newts** migrate in winter (South Park Drive closes November to March), not spring. **The Berkeley Rose Garden** peaks in May, not April.
- **Oakland Pride** is in August (August 16, 2026).
- **San Jose**: the monarchs are at Natural Bridges in Santa Cruz, now labelled as about an hour away. The unverified "almond blossoms in south county" item was dropped.
- **SF Indigenous section**: it pointed to Sogorea Te' Land Trust, a Lisjan (East Bay) organisation. It now names the Association of Ramaytush Ohlone for the Peninsula. Sogorea Te' moved to Oakland and Berkeley. Berkeley now notes that the West Berkeley Shellmound (1900 Fourth St) was returned to Sogorea Te' in April 2024.
- **Removed from ceramicsEcosystem**: every null-URL or stale item. This covers "Clayhouse at SFAI" (SFAI closed in 2022), SFMOMA "craft collection", Xanadu and Japonesque (unverified), "Bay Area suppliers", "Ships easily from Bay Area", "Floating homes studios" and similar placeholders. Each list is now rebuilt only from the verified entries in `data/opportunities/{sf-studios,bay-ceramics,sf-bay,bay-making}.json`, with their URLs and a short note. Textile shops are listed under suppliers and marked "Textiles:". Textile museums are listed under galleries, and guilds are named in `community`.
- **Chili**: "Halfway Club" (SF) and Tommy's Joynt chili could not be verified, so they were dropped.
- **Climate**: all monthly values were replaced with NOAA 1991-2020 normals (below). Most of the old values were close but unsourced and rounded. The notable fixes:
  - December rain: San Francisco 99 → 121 mm, Berkeley 114 → 135 mm.
  - San Jose's July high: 29 → 27.1 °C.
  - Berkeley's summer lows were about 1 °C too warm.

### Per place, in brief

- **San Francisco**: 14 studios, 8 suppliers and 9 galleries from the verified data. The food list has Ferry Plaza (now run by Foodwise, not CUESA), Alemany, Rainbow, La Palma, New Eritrea, Sheba Piano Lounge, Burma Superstar, Tartine and Zuni. The music list has Stern Grove, SFJAZZ, the SF Symphony, Great American Music Hall, the Fillmore, Black Cat, Bird & Beckett, Yerba Buena Gardens Festival and Hardly Strictly. The community note says Clay by the Bay closed in July 2026 and that CCA closes after 2026-27.
- **Oakland (new)**: Clayroom (two studios), The Crucible, Merritt Ceramics (firing service and a residency for Black and Indigenous artists), Kollektiv, YoLin, Waveform, Studio One, Laney College and Creative Growth. A Verb for Keeping Warm is listed for natural dye. Food: Grand Lake and Temescal markets, Café Colucci (Ethiopian), Burdell, Cholita Linda, Rockridge Market Hall, Fentons and Commis. Music: Yoshi's, the Fox, Oakland Symphony, The New Parish and First Fridays.
- **Berkeley**: The Potters' Studio, Moon Jelly, the Berkeley Art Studio, UC Art Practice, Cass and Mudworks. Stonemountain, Lacis and ImagiKnit cover textiles. Food: the three Ecology Center markets, Berkeley Bowl, Monterey Market, Cheese Board, Meskie's Kitchen (Ethiopian), Tacubaya, Acme and Chez Panisse. Music: the Freight, Ashkenaz, the UC Theatre, the Greek, Cal Performances, Berkeley Symphony and Cornerstone. Café Ohlone by mak-'amham is added to the Indigenous section.
- **Sausalito / southern Marin**: Heath's 1959 factory, ICB/ART, Sausalito Center for the Arts, Mill Valley Potter's Studio, CACM and Mt Vision Ceramics (local-materials glazes). Music: Sweetwater, 142 Throckmorton, Jazz & Blues by the Bay, Mountain Play and Marin Symphony. The entry says plainly that there is no East African food locally.
- **San Rafael (new)**: Amphora (note: no wild clay or homemade glazes), CACM and its 2027 residency (deadline January 30, 2027), Marin Pottery and Art Works Downtown. Dharma Trading covers natural dyes. Food: the Sunday and Thursday Civic Center markets, the summer market, Sol Food, Lotus, Il Davide and Woodlands.
- **Palo Alto / Peninsula (new)**: Palo Alto Art Center, the Stanford Ceramics Studio, South Bay Ceramics, Spiffy, Halo, Foothill, Clay Lounge and Pacific Art League, plus the Cantor Arts Center and the ACGA festival. Food: the Downtown and Mountain View markets, Zareen's, Bevri, Coupa, Manresa Bread, Draeger's and LeYou (in San Jose). Music: Stanford Live, Twilight Concerts, Music@Menlo, the Stanford Jazz Festival and Shoreline. The Stanford Powwow is in May.
- **San Jose**: SJSU, Colibri, Higher Fire, Blossom Hill, De Anza, Mission College and others, with Clay Planet for supplies. Galleries: SJMA, the Quilt & Textile Museum, MACLA and Triton. Food: the Japantown market, San Pedro Square, LeYou, Zeni, La Victoria, Original Joe's and Lee's. Music: San Jose Jazz Summer Fest and the SJZ Break Room, Symphony San José, Opera San José, Montalvo and the Mountain Winery. Tamien Nation is added to the Indigenous section.
- **Petaluma (new)**: Petaluma Pottery, FLM Ceramics & Tile, SebArts, Sonoma Community Center and Marin Pottery. Supplies: Creative Ceramics and Glass (Santa Rosa), Dharma Trading and Baker Creek's Seed Bank. Food: the Saturday and Tuesday markets, Della Fattoria, Marin French Cheese and Stockhome. Music: the Mystic, the Phoenix, Cinnabar and the Petaluma Music Festival.

## Sources

### Climate

**Temperatures and rainfall** come from the NOAA NCEI U.S. Climate Normals 1991-2020, monthly dataset, metric units. They were fetched from `https://www.ncei.noaa.gov/access/services/data/v1?dataset=normals-monthly-1991-2020&stations=<ID>&units=metric&dataTypes=MLY-TMAX-NORMAL,MLY-TMIN-NORMAL,MLY-PRCP-NORMAL`. Temperatures are rounded to 0.1 °C and rainfall to the nearest mm.

| Place | Station | Annual rain |
|---|---|---|
| San Francisco | USW00023272 San Francisco Downtown | 581 mm |
| Oakland | USC00046336 Oakland Museum | 574 mm |
| Berkeley | USC00040693 Berkeley | 663 mm |
| Sausalito | USW00023272 San Francisco Downtown (proxy; see uncertain items) | 581 mm |
| San Rafael | USC00047880 San Rafael Civic Center | 875 mm |
| Palo Alto | USC00046646 Palo Alto | 384 mm |
| San Jose | USW00023293 San Jose | 342 mm |
| Petaluma | USC00046826 Petaluma Airport | 649 mm |

USC00044500 Kentfield (1,128 mm a year; summer highs 28 °C) is quoted in the Sausalito seasons text for inland southern Marin.

**Humidity** is the monthly mean relative humidity, computed from NOAA 1991-2020 *hourly* temperature and dew-point normals with the Magnus formula. Those normals exist here only for Oakland International (USW00023230) and SFO (USW00023234). Oakland's values are used for Oakland, Berkeley, San Rafael and Petaluma, and SFO's for San Francisco, Sausalito, Palo Alto and San Jose. **The San Jose, Palo Alto, San Rafael and Petaluma values are proxies.** Inland summer afternoons are drier than these numbers suggest.

**Daylight hours** are astronomical day length (sunrise to sunset, with refraction) on the 15th of each month at each city's latitude.

### Visa

- U.S. Department of State, Visa Waiver Program: https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visa-waiver-program.html. Rwanda is not a participant. The page returns 403 to automated fetches, so the membership was cross-checked against the "Visa requirements for Rwandan citizens" Wikipedia table, which lists the United States as "Visa required".
- U.S. Department of State, Visitor Visa (B-1/B-2): https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html
- U.S. Embassy in Kigali, Visas: https://rw.usembassy.gov/visas/ (fetched October 2026)
- 2025-26 changes: press reports conflict on whether visa bonds or issuance pauses apply to Rwandan B-1/B-2 applicants. That's why the text tells her to check travel.state.gov before applying instead of stating a rule.

### Other sources

- **Rent**: Zumper national rent reports, as reported by KTVU and NBC Bay Area (mid-2026). SF one-bedroom about $4,000+, Oakland about $2,100, San Jose about $2,800. No verified figures were found for Berkeley, Palo Alto, San Rafael or Petaluma, so those entries describe cost without numbers.
- **Cannabis**:
  - State rules: California Department of Cannabis Control (cannabis.ca.gov).
  - Sausalito: the city's marijuana regulations page (no storefronts; delivery allowed).
  - Palo Alto: Palo Alto Daily Post (business ban other than deliveries).
  - Petaluma: Hoodline, December 2025 (first in-person storefront).
  - Federal immigration risk: the USCIS Policy Manual, vol. 12, part F, ch. 5.
- **Indigenous**:
  - Tribe sites: ramaytush.org, muwekma.org, tamien.org and gratonrancheria.com (each fetched in October 2026).
  - Café Ohlone: makamham.com.
  - West Berkeley Shellmound transfer: City of Berkeley, March 2024 agenda, and ABC7.
  - Stanford Powwow 2026 dates: Stanford Daily, May 18, 2026.

### How venues were verified

Every URL was fetched with a browser User-Agent, checked for a live page with 2025 or 2026 content, and scanned for closure language.

Some places were confirmed from a recent third-party listing instead, because their own site blocks bots or is a placeholder:

| Place | Confirmed by |
|---|---|
| Café Colucci, Meskie's Kitchen | KQED, July 18, 2025 |
| New Eritrea, Sheba Piano Lounge | The Infatuation, January 28, 2025 |
| Zeni | sanjose.org listing, 2026 |
| SFJAZZ | 2026-27 season coverage |
| Freight & Salvage | November and December 2026 ticket listings |
| Mystic Theatre | November 2026 ticket listings |
| Temescal Farmers Market | Visit Oakland |
| Petaluma farmers markets | Visit Petaluma (2026 page) |
| Palo Alto Twilight Concerts | paloalto.gov 2026 event pages (in search results) |
| Sausalito Jazz & Blues by the Bay | sausalito.gov 2026 page (in search results) |
| Japantown SJ market | japantownsanjose.org, 2026 season May 3 to October 25 |

Ceramics ecosystem items come from the repo's opportunity data (lastVerified 2026-10-28). The exceptions were checked directly:

- Sausalito Center for the Arts
- ICB/ART (icb-artists.com now redirects to icbart.com)
- SJSU Art
- San Jose Museum of Art
- MACLA (its correct domain is maclaarte.org; macla.org is an unrelated charity)
- Triton Museum
- Petaluma Arts Center
- Baker Creek Seed Bank

## Uncertain items

- **Sausalito climate** uses San Francisco Downtown, about 8 km away across the Golden Gate, because no NOAA normals station exists in Sausalito. The waterfront climate is similar. Rainfall is probably somewhat higher in Sausalito: the old unsourced data said 137 mm in January against 112 mm in San Francisco. Inland southern Marin is much warmer and wetter (Kentfield figures are quoted in the seasons text).
- **Humidity proxies** for four places (see above).
- **Studios flagged "unconfirmed" in the repo data** are listed with a note saying their 2026 schedule isn't confirmed: The Potters' Studio (Berkeley; current membership page but no 2026 date), Mill Valley Potter's Studio, Terra Linda Ceramic Artists and Higher Fire Clayspace.
- **Stanford Ceramics Studio** may be limited to the Stanford community. The note tells her to check eligibility.
- **Festival months** not confirmed with a 2026 date on the organiser's site:
  - Solano Stroll (September)
  - Oakland First Fridays (described as "most months")
  - Fruitvale Día de los Muertos (late October or early November)
  - Petaluma Music Festival (August; its site shows a 2026 lineup but no date was extracted)
  - ACGA Clay & Glass Festival (usually July; the 2027 date isn't announced)
- **Cannabis storefront rules** for San Rafael are not confirmed. The text says "few storefronts; check city rules".
- **Rent figures** come from different months and are only indicative.
- **Meskie's Kitchen** URL is its Instagram (from KQED). Its founder has died; KQED (July 2025) still lists it.
- **New Eritrea** has no working website, so its `url` points to The Infatuation's guide.

### Considered and left out (unverified, closed or a hijacked domain)

- **Food**: Enssaro and Asmara (Oakland; their domains now host gambling sites), Kingston 11, Thistle Meats (domain hijacked), Fred's Coffee Shop, Bar Bocce and Joe's Taco Lounge (bot wall), Sancho's Taqueria, Falafel's Drive-In (server error), Adega and Tin Pot Creamery (domains don't resolve), Café Ethiopia SF (website expired), Tadu and Massawa (no site), Addis (Berkeley; only an older listing).
- **Music**: Fenix San Rafael (no 2026 shows found), The Ritz SJ and The Big Easy Petaluma (no dated events), Starline Social Club (site only shows 2024).
- **Festivals**: Art + Soul Oakland (no 2026 edition evident), Italian Street Painting Marin (domain hijacked), Sonoma-Marin Fair (site error), Berkeley Kite Festival and May Fete Parade (domains don't resolve).

## Visa audit: other entries that claim visa-free entry wrongly for a Rwandan citizen

These entries were **not edited**. Each claims visa-free entry, but Rwandan citizens need a visa for all of these countries (checked against the Wikipedia "Visa requirements for Rwandan citizens" table, October 2026).

**USA, "90 days visa-free (ESTA) for most countries" (72 entries):**

- **California**: Arcata, Chico, Davis, Idyllwild, Long Beach, Los Angeles, Mendocino, Northridge, Pasadena, Santa Monica, Saratoga, Woodside
- **Pacific Northwest**: Eugene OR, Otis OR, Portland OR, Sisters OR, Oysterville WA, Port Townsend WA, Seattle WA, Seaview WA
- **Alaska and Hawaii**: Fairbanks AK, Honolulu HI
- **Southeast**: Asheville NC, Boone NC, Charlotte NC, Greenville NC, Star NC, Athens GA, Atlanta GA, Rabun Gap GA, Chattanooga TN, Gatlinburg TN, Knoxville TN, Englewood FL, Gainesville FL, Tallahassee FL, Baton Rouge LA, Fayetteville AR, Lexington KY, Richmond VA, Morgantown WV
- **Northeast**: Boston MA, Dartmouth MA, West Hartford CT, Layton NJ, Newark DE, Edinboro PA, Philadelphia PA, State College PA, Rochester NY, Syracuse NY
- **Texas and the Southwest**: Denton TX, Lubbock TX, Albuquerque NM, Tempe AZ
- **Midwest**: Athens OH, Bowling Green OH, Cincinnati OH, Chicago IL, Edwardsville IL, Normal IL, Bloomington IN, Iowa City IA, Kansas City MO, Lincoln NE, Madison WI, Minneapolis MN
- **Mountain West**: Boulder CO, Snowmass Village CO, Bozeman MT, Missoula MT, Logan UT

**UK, "6 months visa-free for most countries" (11 entries):** Bath, Belfast, Brighton, Cardiff, Edinburgh, Farnham, Glasgow, London, Stoke-on-Trent, Sunderland, Wolverhampton. Rwandans need a UK Standard Visitor visa.

**Japan, "90 days visa-free for most countries" (11 entries):** Arita, Hachioji, Itoshima, Kanazawa, Kyoto, Nagakute, Nomi, Onishi, Osaka, Tajimi, Tokyo.

**Taiwan, "90 days visa-free for most countries" (3 entries):** New Taipei City, Tainan, Taipei.

**South Korea, "90 days visa-free for most countries" (1 entry):** Seoul.

**Ireland, "90 days visa-free for most" (1 entry):** Dublin.

**Israel, "90 days visa-free for most" (1 entry):** Jerusalem.

**Thailand, "30-60 days visa-free or visa on arrival" (1 entry):** Bangkok. Rwandans need an e-Visa; they are not visa-exempt.

**Indonesia, "30 days visa-free or visa on arrival" (1 entry):** Bandung. This one is only partly wrong: Rwandans do get a paid visa on arrival or e-VOA (since February 2023), but not visa-free entry.

These entries don't say "visa-free" but are misleading for a Rwandan, who needs a full visa in each case:

- **Schengen, "Schengen 90/180 days" (31 entries):** Brussels; Prague; Aakirkeby, Nexø; Tallinn; Espoo; Limoges, Strasbourg; Berlin, Halle (Saale), Höhr-Grenzhausen, Kiel, Landshut; Budapest; Faenza, Montelupo Fiorentino; Amsterdam, Eindhoven, Leusden; Bergen, Oslo; Wrocław; Caldas da Rainha, Lisbon, Lousã; La Bisbal d'Empordà, Manises; Gothenburg, Leksand, Stockholm, Vickleby; Geneva. Rwandans need a Schengen short-stay visa.
- **Canada, "eTA required for visa-exempt travelers" (9 entries):** Banff, Calgary, Halifax, Medicine Hat, Montreal, Oakville, Toronto, Vancouver, Winnipeg. Rwandans need a visitor visa, not an eTA.
- **Australia, "ETA required for most countries" (5 entries):** Adelaide, Canberra, Melbourne, Mittagong, Sydney. Rwandans need a Visitor visa (subclass 600), not an ETA.

China ("Visa required for most", 3 entries) is correct for Rwandans.

## Notes for the UI

- `climate` temperatures now have one decimal place; rainfall is still an integer.
- New optional fields: `foodScene`, `liveMusic`, `everydayLife` and `forWinnie` on Bay entries (index.json), and `fashionEcosystem.places` on Bay entries (ccMode.json). Every other field keeps its existing shape.
- Some `localColor.festivals` items use `"month": "Monthly"` for monthly events (Oakland First Fridays, San Rafael's 2nd Friday Art Walk).
