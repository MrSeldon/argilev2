# Colombia, all making (deep focus on Cali): scouting report

Data file: `data/opportunities/colombia-making.json` (87 entries, id prefix `comk-`, loaded by `getOpportunities()` in `lib/data.ts`).
Research dates: 27-28 October 2026. `lastVerified` is `2026-10-28` on every entry.

## Method

- Every entry has a `source` URL that was opened (WebFetch, or curl with a browser User-Agent) and showed 2025-2026 activity: dated news, city bulletins, course pages, a 2026 call, fair dates, or dated posts. Search-result snippets alone were not accepted.
- Deduplicated against `colombia.json`. Expoartesanías 2026 and Expoartesano are already there and were not repeated.
- Coordinates come from OpenStreetMap Nominatim via curl, at most 1 request per second. 63 of 87 pins carry `"approximate": true`. These are town or neighbourhood centres, street centroids where Nominatim matched only the street, or a nearby landmark. Examples: Escuela de Artes y Oficios Santo Domingo is pinned at Museo Santa Clara, two blocks away, because Nominatim does not know Calle 10 # 8-73. The IUIPC degrees are pinned at the IPC's El Lido campus; the source gives the Coltabaco site (Calle 12 # 1-12), which Nominatim could not find.
- Every Cali entry has `location.city` exactly `"Cali"`. Calima El Darién and Roldanillo keep their own town names.
- Only existing `type` values are used: community, gallery, school, workshop, artist, studio, mentorship, apprenticeship, supplier and grant. Museums are `gallery` with discipline `museum`. Fairs and festivals are `community` with discipline `market`. Ceramics places use discipline `ceramics`, so they show under the Ceramics filter. Everything else uses the bay-making values and carries the `beyond-ceramics` tag.
- **The 10 August 2026 earthquake.** Cali sources report a magnitude 7.4 quake that damaged parts of the city. La Tertulia was closed for evaluation. The La Merced convent (MUSA), the Centro Cultural de Cali and the Biblioteca Departamental were restricted or closed. The 30th Petronio Álvarez was suspended. Affected entries stay `status: "active"`, and the post-quake situation is written into their `details`. Treat every Cali venue as "check before visiting".

## Counts

| area | ceramics | textiles | multi | museum | market | print | wood | jewelry | metal | glass | collective | lectures | total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Cali** | 5 | 9 | 11 | 5 | 6 | 2 | 0 | 1 | 0 | 1 | 1 | 0 | **41** |
| Valle del Cauca, outside Cali (Calima El Darién, Roldanillo) | 0 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Bolívar (Cartagena 5, San Jacinto, Mompox 2) | 0 | 1 | 1 | 3 | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 8 |
| Atlántico (Barranquilla 2, Galapa 3, Ponedera 2, Usiacurí) | 2 | 1 | 0 | 1 | 2 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 8 |
| Bogotá | 0 | 0 | 3 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 5 |
| Santander (Barichara 3, Curití) | 0 | 1 | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 4 |
| Nariño (Pasto) | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 3 |
| Boyacá (Guacamayas, Nobsa, Tenza) | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| Cauca (Popayán) | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Quindío (Armenia, Filandia) | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Antioquia (Medellín) | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| La Guajira (Uribia, Riohacha) | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 2 |
| Caldas (Manizales) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Córdoba (Tuchín) | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Sucre (Morroa) | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Cesar (Pueblo Bello, Sierra Nevada) | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Magdalena (Santa Marta) | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| **total** | **7** | **19** | **20** | **15** | **13** | **3** | **3** | **2** | **1** | **1** | **2** | **1** | **87** |

The `multi` count in Cali is mostly schools: Bellas Artes (degree and extension courses), Univalle, Javeriana, the IUIPC (two entries), UAO Industrial Design and the Academia de Dibujo Profesional. It also includes the city's Litoral programme, the Artesanías de Colombia design lab and the 2026 culture-grants portfolio. Weaving and basketry are filed as `textiles`. That includes the werregue, paja tetera and natural-fibre basket makers in Cali, and caña flecha, iraca, fique, chin and bejuco elsewhere.

## Ten best finds in Cali

1. **Litoral: Artesanías del Pacífico (Secretaría de Cultura).** City-paid master-apprentice cycles: 30 masters and 150 apprentices per semester, with a stipend tied to attendance. They teach weaving, basketry, ceramics, embroidery, filigree, wood, leather and lutherie from the Pacific and the southwest. Apprentices for 2026-II were selected on 18 August 2026; watch culturaenlineacali.com for the 2027-I call. This is the deepest way into Cali's craft scene.
2. **ANGELIQUE Ceramics (San Vicente).** A ceramics studio and showroom with wheel and hand-building classes and two kilns (bisque 900°C, glaze 1250°C). It also runs a firing service for outside potters, by WhatsApp appointment. It posted actively in October 2026, and its owner also lectures at Icesi.
3. **La Alfarería Cali (San Antonio).** Wheel classes Monday to Friday and hand-building packs of 2, 4 or 8 sessions (September 2026 flyers).
4. **Rosana Ocaña / Rao Cerámica (Carrera 6 # 4-08, San Antonio).** A ceramics technologist with about 30 years in clay. She teaches wheel, coil, slab and pinch, fires a gas kiln, and learned paddling (paleteado) in Peru.
5. **Parque Artesanal Loma de la Cruz.** Cali's permanent craft park since 1990. In October-November 2025 its artisans taught ten free 20-hour community workshops, and the Artesanías de Colombia lab also works there.
6. **La Linterna (San Antonio).** A letterpress and linocut poster shop founded in 1934, still printing on 19th-century presses. **Tropical Press** by the Plazoleta de San Francisco lets visitors set type and print their own cards. Together they are Cali's living print scene.
7. **Casa Velasco & Cía. (San Fernando Viejo).** Described in El País (June 2025) as Colombia's oldest stained-glass house, still working with traditional techniques and training apprentices.
8. **Museo del Oro Calima and MUSA La Merced.** Pre-Hispanic Calima ceramics and goldwork (Banco de la República) and southwestern pre-Hispanic pottery in Cali's oldest convent. Both are essential for the history of clay in the region. MUSA's building was restricted after the quake.
9. **Pacífico Artesanal and Feria Entre Manos.** Artesanías de Colombia's December fair brings about 60 Pacific craft workshops with live demonstrations. Entre Manos is the city's post-quake sales fair for Litoral artisans, showing basketry, chaquira, wood, ceramics and weaving.
10. **The weavers.** Bertha Helena Mosquera (AneleH, floor-loom weaving), Carmencita Cárdenas (Wounaan werregue basketry, Siloé), Rosa Imelda Cabeza (Tradición Entretejida, natural fibres and natural dyes) and the 500-strong **Cali Entretejida** crochet movement. For supplies, **Piolas y Piolas** (Av 5N # 37A-136) sells yarn, macramé cord and dyes, and **MAO - Manos a la Obra** posts dated small-group crochet, macramé and embroidery workshops through December 2026.

Also worth a look: the IUIPC's new Licenciatura en Artes Plásticas y Visuales Populares (registered January 2026; the admission test includes clay modelling), Lugar a Dudas (artist library and programmes), Festival de Macetas (alfeñique sugar craft, national heritage), Museo Rayo in Roldanillo (prints), and Museo Arqueológico Calima in Calima El Darién.

## Ten best finds elsewhere in Colombia

1. **Escuela de Artes y Oficios Santo Domingo (Bogotá, La Candelaria).** Floor, vertical and treadle-loom weaving, natural dyeing, embroidery, wood, leather, metal and bookbinding, with published dates and fees. Enrolment for the vertical-loom course closes 15 December 2026. Its **Maestros Internacionales** programme brings visiting masters (silversmithing with Vicky Ambery Smith, 3-24 November 2026).
2. **"Tejiendo con Barichara" (Universidad del Rosario and Fundación Montechico).** A 44-hour course on papermaking, weaving, indigo and achiote dyeing and earth building with local materials. It ran in 2025 and from 23 June to 3 July 2026.
3. **Artecano, Ponedera (Atlántico).** A family pottery throwing local river clay on the wheel, with weekend immersive sessions where visitors tread clay barefoot (El Heraldo, 15 June 2026). **Osman Cano**, a few streets away, throws on an old non-electric wheel and fires a gas kiln.
4. **Taller Granja, Pasto.** Barniz de Pasto (mopa-mopa resin on wood). It holds a Homo Faber badge and offers a bookable half-day hands-on workshop for 2-5 people.
5. **Fundación San Lorenzo paper workshop, Barichara.** Handmade paper from fique and pineapple fibre, tinted with turmeric and achiote, with group sessions.
6. **Ecofibras fique tour, Curití.** Washing, drying and dyeing fique, then weaving with the artisans (Vanguardia, October 2025).
7. **Escuela de Artes y Oficios de Galapa.** Free carnival-mask wood carving and papier-mâché at the Casa de la Cultura, with more than 800 students in 2024-2026. Mask-maker **Fernando Padilla** teaches there, and the town museum pairs pre-Columbian pottery with mask-making.
8. **Festival de la Cultura Wayuu (Uribia, June 2026)** and the **Feria del Sombrero Fino Vueltiao (Tuchín, 9-11 January 2026)**. These are the two big moments to see Wayuu weaving and Zenú caña flecha in one place.
9. **Feria AMA (Barranquilla).** A curated Caribbean craft fair with more than 130 stands (2nd edition, 14-17 May 2026), open to exhibitor applications. The new **Artesanías del Atlántico** flagship shop opened 30 April 2026 with iraca, bejuco, enea, wood, totumo and clay.
10. **Mompox filigree: Eligio Rojas Quintana.** A goldsmith who trains apprentices in three-dimensional filigrana momposina. The Holy Week craft fair (29 March-4 April 2026) is the main filigree showcase.

Close runners-up: Usiacurí's Centro Artesanal Corina Urueta (iraca palm, some natural pigments), San Jacinto's artisans' cooperative (vertical-loom hammocks), Asoseynekun (Arhuaco mochilas, Pueblo Bello), Guacamayas fique coil basketry, Nobsa wool ruanas, Museo de Oficios in Bocachica, and the free Medellín library makerspaces.

## Gaps

- **Cali ceramics is thinner than hoped (5 entries).** The web-search budget for this run (200 searches, shared by five research passes) ran out before a second sweep. Not added:
  - Taller El Jardín (@ceramicatallereneljardin): active in 2026 but no city stated.
  - El Pincel de Marisol (high-fire glazes, pigments, moulds; Cra 17 # 1-66, San Cayetano), Marino Olave (moulds, slip, kiln repair) and Agenquimicos (feldspar, kaolin, borax): these come only from an undated (© 2021) Entregrietas supplier list.
  - Alpa Jaguar (2022-2024 only).
  - The Zahav studio visit in San Antonio: Airbnb listing sold out with no dates, domain parked.
  - GetYourGuide and Superprof ceramics listings: blocked.
  - **There is no verified clay, glaze or kiln supplier in Cali.** This is the biggest practical gap.
- **No Cali university offers a dedicated ceramics course** on the pages checked (Bellas Artes, Univalle, Javeriana, IUIPC, UAO, FADP, Icesi). A 2010 page lists an IPC "Técnico laboral en cerámica artística", which is not in the current offer. Worth asking Bellas Artes and the IUIPC directly.
- **Cali makerspaces.** Sources for FabLab UAO, SENA Tecnoparque Cali, Icesi ProtoLAB, Javeriana's Design Factory and the Siloé and Biblioteca Departamental maker labs were all 2013-2022 or undated, so none were added.
- **Cali jewellery, wood and leather studios.** Joyeros de Occidente ("Joyero por un día", © 2023), Fundación Escuela Taller de Cali (© 2025 footer, no dated course), and the Loma de la Cruz workshops Oggun (copper) and Wounaan Den (werregue), whose profiles are undated. Nasa weavers Tejedoras Ancestrales de Vida were last mentioned in 2022.
- **Metro towns (Jamundí, Palmira, Yumbo, Buga, Ginebra, Dagua).** Nothing verifiable for 2025-2026. palmira.gov.co blocked requests.
- **Galleries.** La Sucursal, Jenny Vilá, Casa Tomada, Proartes and Helena Producciones had nothing dated 2025-2026. The new Bienal Internacional de Artes Gráficas (29 September-19 October 2026 on the city agenda) could not be confirmed after the quake.
- **Banco de la República cultural pages** (banrepcultural.org) sit behind a bot check. The Calima, Zenú and Tairona gold museums are sourced from city bulletins and 2025 news instead.
- **Artesanías de Colombia regional labs** (Atlántico, Bolívar, Córdoba, La Guajira, Sucre) had no dated activity. Only the Valle del Cauca lab and the 2026 national call are included.
- **Not reached, or no dated source found:**
  - Aguadas iraca hats (Museo Nacional del Sombrero, newest coverage December 2023).
  - Silvia and the Misak weavers (Espiral Misak pages undated; the area also saw violent clashes in May 2026).
  - Sandoná toquilla weavers, Universidad de Caldas craft courses, and Villa de Leyva markets.
  - Medellín weaving and natural-dye studios (Casa Taller Pallay appears only on Airbnb).
  - Museo del Caribe in Barranquilla (conflicting reports that it is closed).
  - The Manaure Wayuu fair (last seen 2024).
  - Escuela Taller Mompox (site down).

## Uncertain items (check before relying on them)

- **Every Cali venue after the 10 August 2026 earthquake**, especially Museo La Tertulia (closed for evaluation), MUSA La Merced (restricted), and the Petronio Álvarez craft component (festival suspended; officials said it would still be held in the second half of 2026, no date).
- **Instagram-verified Cali studios.** Angelique, La Alfarería, El Palomar, Rao Cerámica and Taller Cerámica Creativa were verified mainly through Instagram post dates. El Palomar's own posts are from 2025; its 2026 activity is tagged posts by others. Rosana Ocaña's address comes from a Colombia Artesanal profile last updated November 2024.
- **2025-only evidence:** Museo del Oro Calima, Museo Hernando Tejada and Loma de la Cruz (2025 city items), Filandia basketry (January 2025 travel piece), Casa Velasco (June 2025), Salón ViveArte (2025 edition), Escuela Taller Cartagena (January 2025), and the Cartagena museums (April 2025 hours and prices).
- **Weak or indirect sources:**
  - Tenza chin basketry: only the July 2026 law (Ley 2614) naming the craft; no workshop or venue.
  - Guacamayas: the denominación de origen was seen only in search snippets.
  - Armenia expo: the source is the 2025 edition; the 2026 edition was seen only as a headline.
  - Escuela Johanna Ortiz: the FashionUnited article carries no visible date; it reads as March 2026 from the URL.
  - Morroa: a thin December 2025 article.
  - Casa del Artesano de La Guajira: no address; pinned at Riohacha.
- **Small factual conflicts:**
  - Tropical Press founder: García in the text, González in the captions.
  - Casa Obeso Mejía: Av 4 Oeste # 4-50 (El País) or # 4-59 (older source).
  - Salón BAT, Bogotá: two press addresses for La Salle.
  - Museo Rayo after the quake: one report says undamaged, another says hit.
  - Taller Granja, Pasto: address given as "3050 Calle 19a", which looks garbled; pinned approximately.
- **Individual Cali makers** (José Miguel García Villa, AneleH, Carmencita Cárdenas, Artesanía Magüí, Tradición Entretejida) come from Cali city bulletins (September 2025 and 2026). They have no published class schedules or studio addresses, and are pinned at the city or neighbourhood centre.
