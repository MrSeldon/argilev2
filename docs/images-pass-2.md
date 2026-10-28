# Opportunity images, pass 2

Second pass on `data/opportunities/` (index, sf-bay, sf-studios, colombia). The first pass left 238 of 343
entries without a photo. This pass added **207 images**; **31 entries still have none**.
`bay-ceramics.json` and `bay-making.json` (other agents) were not touched.

## Coverage

| File | Entries | Before | After | Added | Added weight |
| --- | ---: | ---: | ---: | ---: | ---: |
| `index.json` | 246 | 80 (33%) | 225 (91%) | 145 | 16.0 MB |
| `sf-bay.json` | 49 | 16 (33%) | 44 (90%) | 28 | 3.1 MB |
| `sf-studios.json` | 14 | 0 (0%) | 12 (86%) | 12 | 1.4 MB |
| `colombia.json` | 34 | 9 (26%) | 31 (91%) | 22 | 2.1 MB |
| **Total** | **343** | **105 (31%)** | **312 (91%)** | **207** | **22.6 MB** |

All 207 files are WebP in `public/images/opportunities/<id>.webp`, long side at most 1400 px
(every source was at least 600 px wide and nothing is upscaled, so some files are smaller), quality about 78 and stepped
down where needed so every file is under 200 KB (largest 199 KB, average 111 KB). `public/images/opportunities/` is now 32 MB in total.

Where the picture came from:

- 144 are publisher images, taken from the entry's own site (or the page it links to): the
  studio, kilns and wheels, people working, finished pots, the building or campus. Credit is
  `Image: <organisation>`, `creditUrl` is the entry's page, licence `publisher image`.
  This includes the SF studios (Clayroom SoMa and Potrero, The Pottery Studio, Artillery, RedBrick,
  sfclayworks, Dusted and Blue, Brick and Mortar, Stone Gold x3, Heath), from their homepages,
  gallery, about and membership pages, and the Squarespace, Wix and Weebly image CDNs they use.
- 63 are Wikimedia Commons photographs of the institution or place (campus buildings, Fort Worden,
  Dallas Museum of Art, Kigali and so on), used where the site blocked automated fetches, had only
  logos and banners, or the entry is a funder with no photography of its own. Author and licence
  are read from the Commons file page and `creditUrl` points to it. Licences: CC BY-SA 4.0 (20),
  GFDL (14), CC BY-SA 3.0 (8), CC0 (6), public domain (6), CC BY 2.0 (3), CC BY-SA 2.0 (3),
  CC BY 4.0, CC BY 3.0, CC BY-SA 2.5 AU (1 each). Credit strings show the author's Commons
  name, so they are not always a real name.
- None come from Instagram, Facebook or Winnie's accounts (checked against every chosen source URL).

How it was checked: every candidate was downloaded and viewed on a contact sheet before it was
kept. Rejected: logos, text banners and posters, collages, maps, avatars and headshot grids,
shop banners, images under 600 px wide, stock-looking photos and AI-looking pictures
(Primitivo Studio). A few earlier choices were taken back after the final review (a Japanese
poster for Shigaraki, a collage for Silpakorn). One file name was made ASCII
(`royal-danish-academy-nexo.webp`).

Judgement calls worth a look: some funder and regulation entries use a place or institution
picture rather than a photograph of the programme itself (Budapest for Stipendium Hungaricum,
Kigali for the Fulbright Rwanda and Awesome Foundation Kigali entries, the FCDO courtyard for
Chevening, the Tilden Regional Park sign for the East Bay Parks ordinance, Point Lobos for the
state parks regulation, Corferias for Expoartesanias, the Pitalito valley for the two Pitalito
clay entries). Where an image is a campus or town rather than ceramics, the alt text says so.
If you would rather leave those without a picture, drop the `image` object for: `stipendium-hungaricum`,
`fulbright-rwanda`, `awesome-foundation-kigali`, `chevening-rwanda`, `daad-germany`,
`dallas-foundation`, `pola-art-foundation`, `jerome`, `brooklyn-arts`, the two `sfbay-` regulation
entries, `co-expoartesanias-2026`, `co-pitalito-ceramica-laboyana`, `co-pitalito-arcilla-yacimientos`.

## Dead, parked and moved links

Checked for the 238 entries that had no image (curl with a browser-style User-Agent, then the
browser pane for sites that blocked curl; a 403 or "Just a moment" page was not counted as dead
when the browser pane loaded the page). No entry was deleted or edited.

No parked or domain-for-sale pages were found (all 238 pages were scanned for sale, parked,
expired and suspended wording). `transmissiongallery.com` is not referenced by these four files.
The scan flagged Castro Clay, but that is a live GoDaddy site builder page whose header shows a
placeholder `filler@godaddy.com` login; the site itself is fine.

**Dead or broken**

| Entry | Link | What happens |
| --- | --- | --- |
| `kutani-technical` | `https://www.th-kutaniyaki.or.jp` | Domain does not resolve (DNS failure). Dead. |
| `jingdezhen` | `https://jingdezhenstudio.com` | HTTPS certificate is self-signed (browser refuses it); plain HTTP returns an empty reply. Broken. |
| `sfbay-terra-linda-ceramic-artists` | `https://terralindaceramicartists.com` | TLS handshake fails. `https://www.terralindaceramicartists.com` loads (200), so adding `www.` fixes it. |
| `craft-potters-association-trust` | `https://cpa.ceramicreview.com/?p=332` | HTTP 522 (origin timed out) on every try, curl and browser. |
| `pottery-nw-apprentice` | `https://potterynorthwest.org/studio-apprenticeship` | 404. The site root (`https://www.potterynorthwest.org/`) loads, the page is gone. |
| `weissensee-berlin` | `https://kh-berlin.de/hochschule/einrichtungen/werkstaetten/keramik` | 404. `https://kh-berlin.de` loads; needs a new path. |
| `emily-carr-ceramics` | `https://www.ecuad.ca/academics/all-programs/undergraduate-programs/ceramics` | Redirects to the generic undergraduate programmes list; the ceramics page has moved. |
| `china-academy-art` | `https://en.caa.edu.cn` | Connection times out from curl and the browser pane refused it. Unverified, may be blocked outside China. |

**Unverifiable (bot challenge)**

- `co-pitalito-ceramica-laboyana` and `co-pitalito-arcilla-yacimientos` share one link,
  `https://ridum.umanizales.edu.co/bitstreams/07c946dc-.../download`, which answers 403 with a
  challenge redirect. Probably alive (a thesis PDF), but a person has to open it to be sure.
- `u-wolverhampton-ceramics`: returns 202 with an empty body (challenge page) to curl, so not confirmed.

**Live but redirected (consider updating the URL)**

`anu-canberra` (soa.anu.edu.au to soad.cass.anu.edu.au), `cal-poly-humboldt` (art.humboldt.edu to
humboldt.edu), `u-delaware-ceramics` (art.udel.edu to udel.edu), `utah-state-ceramics` (art.usu.edu
to artsci.usu.edu), `u-north-texas-ceramics` (art.unt.edu to cvad.unt.edu), `head-geneva`
(hesge.ch/head to head.hesge.ch), `sturt-pottery` (sturt.nsw.edu.au to sturtgalleryandstudios.com.au),
`elizabeth-greenshields` (.org to elizabethgreenshieldsfoundation.ca), `itb-bandung` (www.itb.ac.id
to itb.ac.id).

**Blocked curl but live in the browser pane (not dead)**: `anderson-ranch`, `anderson-ranch-residency`,
`csm-ma-design-ceramics`, `cove-park`, `harvard-ceramics`, `nyfa`, `sfbay-palo-alto-art-center`,
`chevening-rwanda`, `elizabeth-greenshields`. Blocked and not opened by hand (Cloudflare or 403 to
curl only): `aauw-international`, `ccsf-ceramics`, `florida-state-ceramics`, `uc-davis-tb9`,
`ulster-university-belfast`.

**Stale**: `xiem-clay-center` (`http://xiemclaycenter.com/`) works over plain HTTP only and its
newest banner is "Session 2 of 2020".

PDF links (`ebparks.org` ordinance, the two Rosario and Uniandes course PDFs) all returned 200 as
`application/pdf`.

## Entries still without an image (31)

**Site has no usable photograph, nothing suitable on Commons**

- `african-culture-fund`, `mmeg-grant`, `peo-peace-scholarship`, `usa-fellowship`,
  `color-network-career`, `color-network-community`, `asian-cultural-council`, `pro-helvetia-research`:
  grant or scholarship programmes whose sites carry logos, portraits or text graphics only.
- `aauw-international`: site blocks automated access; Commons has only archival documents.
- `nyfa`: Cloudflare blocked the download; the page itself loads.
- `elizabeth-greenshields`: the site answers curl with a bot checkpoint (429); in the browser it is a
  text-only splash page.
- `caldera-arts`: every photo on the site has lettering over it.
- `creta-rome-mentorship`: only a line drawing of the Pantheon.
- `kitamura`, `arquetopia`: Japanese flyer and colour-filtered text graphics.
- `ash-street-project`: Squarespace site with a wordmark and a few small headshots, nothing 600 px wide.
- `xiem-clay-center`: only 2020 text banners.
- `pottery-nw-apprentice`: only a collage of thumbnails (and the linked page is a 404).
- `arco-lisbon`: only small images.
- `china-academy-art`: site unreachable; the Commons results were all metro-station shots.

**Studios whose photos are too small or are text banners**

- `sfst-smaart-sutter`, `sfst-smaart-24th`: the Wix site only serves images up to 475 px, the rest are logos.
- `sfbay-castro-clay`: a single banner crop of a butterfly on a clay slab.
- `sfbay-earthfire-arts-studio`: a selfie and a funding banner.
- `sfbay-sebastopol-center-for-the-arts-sebarts-ceramics`: posters and one stock-looking wheel photo.
- `sfbay-clay-planet`: product banners with text.

**Dead link and nothing else to use**

- `sfbay-terra-linda-ceramic-artists`: site not reachable over `https://` without `www.` (see above);
  nothing on Commons.

**Colombia**

- `co-bogota-primitivo-studio-pottery`: the site's pictures look AI-generated.
- `co-bogota-rosario-ceramica`, `co-bogota-udistrital-asab-ceramica`: the aprendemas.com course
  pages only have small thumbnails.

`craft-potters-association-trust` has no image either (its link returns 522; nothing on Commons).

## Tooling

New scripts in `scripts/images/` (all `pass2_*`; scratch downloads and contact sheets live outside
the repo): `pass2_crawl.py` (fetch each site and subpages, collect image URLs), `pass2_dl.py`
(download, filter, contact sheet), `pass2_batch.py` (stack sheets for review), `pass2_wayback.py`,
`pass2_wiki.py` and `pass2_csearch.py` (Commons fallbacks), `pass2_pages.py` and `pass2_urls.py`
(hand-found pages and URLs), `pass2_picks.py` (the chosen candidate per entry), `pass2_apply.py`
(WebP conversion and `image` blocks), `pass2_fix.py` (credit tidy and size cap), `pass2_reformat.py`
(keeps each JSON file's original layout), `pass2_links.py`, `pass2_stats.py`, `pass2_verify.py`.

`data/opportunities/index.json` metadata still says `totalEntries: 247` while the file holds 246
entries. That mismatch was already there and is untouched.
