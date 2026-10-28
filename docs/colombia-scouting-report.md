# Colombia ceramics scouting report

Scouted 2026-10-27. Output: `data/opportunities/colombia.json` (34 entries, ids prefixed `co-`). Every entry carries the source page that was opened and read. Names stay in Spanish with `nameEnglish`; summaries are in `descriptionOriginal`.

## Counts

By primary type: community 11, workshop 7, school 4, artist 2, materials 2, residency 2, supplier 2, gallery 2, mentorship 1, studio 1.

By category (an entry can carry several): workshop 18, community 15, materials 6, festival 5, school 5, studio 4, artist 3, mentorship 3, supplier 3, residency 2, gallery 2. "Festival" is a category only (type `community`); no new types were added.

By region: Bogotá D.C. 10, Boyacá 5 (Ráquira, Villa de Leyva), Huila 5 (Pitalito), Antioquia 4, Tolima 3 (La Chamba), Santander 2 (Barichara, Los Santos), Bolívar 2 (Mompox), Cundinamarca 1, Nariño 1, Putumayo 1.

Status values: most entries are `active`. `unconfirmed` means the only evidence is older than 2025 or a listing without dates. `past-2026` means a 2026 event that has ended.

## Best finds for Winnie

**Wild clay and local materials (the strongest finds)**
- `co-la-chamba-arcilla-predio`: La Chamba's black-clay plot. Artisans extract by hand from open pits about 0.5 m deep. The Tolima government owns the plot, and a 2023 effort sought to give artisans legal access. The Superindustria denomination (Dec 2019) says the black ware blends three local clays: smooth (plasticity), sandy (even drying) and red (for the final smoking).
- `co-pitalito-arcilla-yacimientos` and `co-pitalito-ceramica-laboyana`: a 2025 master's thesis surveyed 69 Pitalito potters. Clay extraction is informal. The deposits have no environmental management plans or recognised legal status. It also cites a government guide advising sieving, ageing clay for 3 to 6 months, and separating by veins. This documents the custom and the legal grey zone of wild-clay collecting in Colombia.
- `co-sibundoy-daniel-hurtado`: hand-gathered clay, taught through pinch, coil and slab.
- `co-raquira-santiago-rodriguez-ruiz`: a contemporary sculptor working Ráquira red clay with slips and sgraffito (2026).

**Traditional techniques**
- La Chamba: smoke-fired, burnished black ware (`co-la-chamba-ceramica-negra`), with a visitable workshop-school (`co-la-chamba-taller-escuela-manos-de-oro`).
- El Carmen de Viboral: hand-painted underglaze tableware, now on the national heritage list, with visitable workshops (`co-carmen-de-viboral-ceramica`).
- Ráquira: wheel-throwing town with a potters' wheel contest in June (`co-raquira-concurso-torneros`).
- Barichara: Guane-technique hand-building (`co-barichara-taller-guane`).
- Los Santos: a community-built kiln and clay water filters (`co-los-santos-ceramica-por-el-agua`).

**Glaze chemistry**
- `co-bogota-sirena-azuleja`: glaze, engobe and cone supplies, with formulation advice and workshops listed for 2026.
- `co-bogota-primitivo-studio-pottery`: glaze masterclass, firing service and coworking.
- `co-bogota-uniandes-opcion-ceramica`: a university ceramics option that teaches glaze and engobe formulation (for Uniandes undergraduates only).

**Residencies**
- `co-mompox-casa-taller-el-boga`: year-round applications, about EUR 890 per month, linked to local artisans. No kiln or clay facilities are listed, so ask first.
- `co-artesumapaz`: lists a "ceramic facility" (kiln unconfirmed).

## Gaps and what to check next

- No dedicated ceramics residency was found in Colombia. The two entries are general-arts residencies.
- Cali, the Eje Cafetero, Cartagena, Santa Marta, the Llanos and the Amazon have almost no entries. Searches returned nothing usable there. Caribbean and Wayuu ceramics (for example the Cambio Colombia piece on Franco Urariyu) could not be opened because of a paywall.
- No master-potter apprenticeship programme was found. Mentorship appears only through `co-sibundoy-daniel-hurtado`, the Magma/Rosa María Jerez workshop and the Mompox programme.
- Clay and glaze suppliers outside Bogotá are missing. A suppliers list on entregrietas.com (undated, 2021 copyright) names, unverified: Arka Galería y Taller (Zipaquirá), Ceramyst, Keramos, Caolines La Pirámide (Bogotá), Taller Cerámico Girona (Envigado), Minerales y Servicios (Medellín), Cerámicas Ríos (Caldas), Martín Darío Bolaños (San Agustín, clay), El Pincel de Marisol (Cali). None were added without a source of their own.
- Leads seen only in search results, not opened: Barichara's Guayabal clay deposit (a 2025 study mentions a 400 ha deposit and a potters' association founded in 1996), Habita Cerámica, Vértice, Ceramiquiando and Cerámica Tierra Santa (Revista Diners, Sept 2024), Alharaca (Bogotá), Zahav (Cali), the Barirí terracotta of Zapatoca and Barichara, the Wayuu potter Franco Urariyu, and Universidad Nacional's ceramics area in the Escuela de Artes Plásticas.
- Ráquira, La Chamba, Pitalito and El Carmen have strong traditions, but individual workshop names, contacts and clay-pit rules need a visit or a call to Artesanías de Colombia, the Alcaldías or the artisan associations (ASOARCH, COARPI, Aproloza).

## Uncertain items

- Evidence older than 2025 (flagged `unconfirmed`): La Chamba clay plot (2023 article), La Chamba Manos de Oro (Aug 2024), Nariño women potters (2023), Sibundoy (2022), Feria Nacional Artesanal de Pitalito (2024; 2026 dates unknown), Los Santos (Nov 2024).
- Aggregator or listing pages without dates, so contact first: Ráquira minube workshop, Barichara and Pitalito Civitatis tours (operators not named), the Aprendemas course listings for UNAL, Rosario and Universidad Distrital, ArteSumapaz (Rivet), Ceramyst (no content later than 2023).
- Finished 2026 events: Mompox Summer pottery module (1 to 8 June), Expoartesano (10 to 19 July), the Ráquira festival (12 to 15 June). Expoartesanías runs 7 to 20 December 2026.
- Geocoding: most entries use a town or neighbourhood centre with `approximate: true`. Street addresses did not geocode reliably for Magma, MUSA and Ceramyst, so those sit at neighbourhood or city centres. Only Casa Terracota sits at an exact position.
