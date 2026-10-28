# Opportunity images, pass 3

Third pass on `data/opportunities/`, covering the three files the earlier passes left alone:
`bay-ceramics.json`, `bay-making.json` and `funding.json`. None of their 179 entries had a photo. This pass added
**147 images**; **32 entries still have none**. Only those three data files, `public/images/opportunities/` and
`scripts/images/` changed; no app, component, lib or style code was touched.

## Coverage

| File | Entries | Before | After | Added | Added weight |
| --- | ---: | ---: | ---: | ---: | ---: |
| `bay-ceramics.json` | 73 | 0 (0%) | 55 (75%) | 55 | 6.6 MB |
| `bay-making.json` | 89 | 0 (0%) | 82 (92%) | 82 | 10.1 MB |
| `funding.json` | 17 | 0 (0%) | 10 (59%) | 10 | 1.0 MB |
| **Total** | **179** | **0 (0%)** | **147 (82%)** | **147** | **17.7 MB** |

All 147 files are WebP in `public/images/opportunities/<id>.webp`, long side at most 1400 px (nothing is upscaled, so
some are smaller), quality about 78 stepped down where needed so every file is under 200 KB (largest 199 KB, average
117 KB). `public/images/opportunities/` is now 48 MB in total. The JSON files keep their original layout
(`bay-ceramics.json` indent 1, the other two indent 2, trailing newline), so the diff is one `image` block per entry plus
the comma on the previous line.

Where the picture came from:

- 120 are publisher images taken from the entry's own site (or the page it links to): the studio, wheels and kilns,
  people at work, finished pots, looms and yarn, workshops and machines, the building. Credit is `Image: <organisation>`,
  `creditUrl` is the site, licence `publisher image`.
- 27 are Wikimedia Commons photographs of the institution or place, used where the site blocked automated fetches, had
  only posters and logos, or the entry is a museum, college or funder. Author and licence are read from the Commons file
  page and `creditUrl` points to it. Licences: CC BY-SA 4.0 (6), GFDL (5), CC0 (4), public domain (4), CC BY 2.0 (4),
  CC BY-SA 3.0 (2), CC BY-SA 2.0 (2).
- None come from Instagram, Facebook or Winnie's accounts (every chosen source URL was checked for instagram, facebook,
  fbcdn).

How it was checked: every candidate was downloaded and looked at on a contact sheet before it was kept, and the 147
finished WebPs were looked at again on a final sheet. Rejected: logos, text banners and posters, collages, event
flyers, maps, headshot grids, film stills, small thumbnails (under 600 px wide), blurred or tinted hero overlays,
and images that were really about something else (the Commons article for "Studio One Art Center" returned a
photo of a different building, the Los Medanos search returned the Large Magellanic Cloud, the UNESCO article
returned a Dutch water institute; none used).

Judgement calls worth a look. Where the picture is a building or campus rather than ceramics or making, the alt text
says so. If you would rather leave these without a picture, drop the `image` object for:

- Colleges and campuses: `baycer-skyline-college-ceramics`, `baycer-college-of-san-mateo-ceramics`,
  `baycer-de-anza-college-ceramics`, `baycer-cal-state-east-bay-art-and-design-ceramics`,
  `baycer-chabot-college-ceramics`, `baycer-northeastern-university-oakland-ceramics-studio-former-mills` (the old
  Mills College lawn).
- Museums, libraries and venues: `baycer-sfmoma-go-your-own-way-northern-california-craft-1945-80`, `baymk-sfmoma`,
  `baycer-de-young-museum-rose-b-simpson-lexicon`, `baymk-de-young`, `baycer-asian-art-museum-of-san-francisco`,
  `baymk-asian-art-museum`, `baymk-oakland-museum`, `baymk-cantor-arts-center`, `baymk-bampfa` (gallery interior),
  `baymk-uc-botanical-garden`, `baymk-exploratorium-tinkering`, `baymk-sfpl-craft-workshops` (Main Library),
  `baymk-fort-mason-center`, `baymk-long-now-talks` (the Interval bar), `baymk-maker-faire-bay-area` (the shark art car),
  `baymk-cal-academy` (jellyfish), `baymk-museum-american-indian` (redwoods from the museum's own site),
  `baymk-bolinas-museum`.
- Places standing in for a programme: `baycer-shipyard-open-studios-hunters-point-shipyard` and
  `baymk-hunters-point-shipyard-artists` (aerial of the shipyard), `baycer-point-reyes-open-studios` (main street of
  Point Reyes Station), `baycer-ccaca-california-conference-for-the-advancement-of-ceramic-a` (a building at night with
  sculptures out front).
- Funders: `fund-unesco-ifcd` (UNESCO headquarters), `fund-winterthur-maker-creator` (Winterthur gardens),
  `fund-bellagio-center-residency` (the villa), `fund-rijksakademie-residency` (an exhibition space),
  `fund-mino-international-ceramics-competition` (an exhibition hall, 800 px), `fund-premio-faenza` (white ceramic forms
  from the prize site), `fund-loewe-foundation-craft-prize` (craft objects from the prize site),
  `fund-kohler-arts-industry` (a resident modelling clay), `fund-acta-apprenticeship` and
  `fund-creative-capital-award` (photographs from their own sites, not necessarily of a funded project).
- Same photo on two related entries (one file each): Douglas and Sturgess (Richmond and SF), Root Division
  (`baycer-` and `baymk-`), Marin Open Studios, Creativity Explored, NIAD Art Center, Creative Growth, and the
  SFMOMA, de Young, Asian Art Museum and Hunters Point pairs.
- Lowest resolution kept: `baymk-minnesota-street-project` (600 px), `baycer-mt-vision-ceramics-studio-jess-taylor`
  (600 px), `baymk-bay-area-basket-makers` (640 px), `baycer-yolin-art-studio` (846 px).

## Dead, parked and moved links

Checked for all 179 entries (curl with a desktop-browser User-Agent, then the browser pane for sites that blocked
curl). Several sites answer HTTP 406 to a short or bot-like User-Agent (Arion Press, CNCH, Graphic Arts Workshop,
Joy Imai, Minnesota Street Project); they load normally with a full Chrome User-Agent, so they are not dead. No
entry was edited or deleted. I did not try to get around Cloudflare or other bot challenges: those sites were
checked in the browser pane and their pictures came from Commons or were skipped.

**No dead (non-resolving or 404) links and no parked or domain-for-sale pages were found.** Every URL loaded.
`yolinartstudio.com` was flagged for "coming soon", but that is only "November-December classes are coming soon" on a live
Shopify site. `clayroomsf.com/san-mateo` says "Coming Soon" only for the kids' classes.

**Live but moved (consider updating the URL)**

| Entry | Link | Where it goes |
| --- | --- | --- |
| `baycer-uncle-pauls-ceramics-haight-street` | `https://unclepaulshaight.com` | Redirects to `https://www.unclepaulsceramics.com/` (the same site as the North Beach entry) |
| `baycer-studio-one-art-center-city-of-oakland` | `https://www.oaklandca.gov/topics/studio-one-arts-center` | Redirects to `https://www.oaklandca.gov/Community/Parks-Facilities/Recreation-Centers/Studio-One-Art-Center` |
| `fund-goethe-aepc-mobility` | `https://www.goethe.de/aepc` | Redirects to `https://www.goethe.de/prj/aep/en/index.html?wt_sc=aepc` |
| `baycer-blossom-hill-ceramics` | `https://www.blossomhillcrafts.com` | Trailing redirect to `/index.html` only |

**Blocked to curl, live in the browser pane (not dead)**: `famsf.org` (de Young, two entries), `deanza.edu/creativearts`,
`museum.stanford.edu` (Cantor), `communityarts.org` (two Walnut Creek entries), `oaklandca.gov` (Studio One),
`goethe.de/aepc`.

**Unverifiable**: `https://www.shipyardartists.com` (`baycer-shipyard-open-studios-hunters-point-shipyard` and
`baymk-hunters-point-shipyard-artists`) answers 403 "Access Denied" to curl and "Bad Bot Request" (SiteDistrict) in the
browser pane; probably alive, a person has to open it. `https://www.artspan.org` (two entries) loads but is a
JavaScript shell of 1.4 KB with no images to fetch.

## Entries still without an image (32)

**Site has no usable photograph, nothing suitable on Commons**

- Funders whose pages carry logos, portraits, flags or text graphics only: `fund-officine-saffi-award` (portraits),
  `fund-prince-claus-seed-award` (digital art), `fund-us-embassy-kigali-pd-grants` (a seal),
  `fund-fulbright-visiting-scholar-rwanda` (flags, selfies), `fund-fca-emergency-grants` (two 600 x 400 pictures
  unrelated to making), `fund-cac-individual-artists-fellowship-bay-area` (generic arts-in-education photographs,
  Commons search returned nothing relevant), `fund-goethe-aepc-mobility` (site blocked curl; the page was only read, not mined for photographs).
- `baycer-ceramic-art-center-of-marin-cacm`, `baycer-cacm-artist-in-residence-2027`: only the wordmark.
- `baycer-art-space-on-the-coast`: banners only. `baycer-art-beat-studio`, `baycer-south-bay-ceramics`: pages load but
  carry no extractable images.
- `baycer-joy-imai-special-handling-pottery`: tiny images only.
- `baycer-studio-one-art-center-city-of-oakland`: the city page blocked curl and the Commons search for the centre returned a photo of a different building.
- `baycer-rebecca-camacho-presents`, `baycer-silicon-valley-open-studios`, `baymk-silicon-valley-open-studios`,
  `baymk-bay-quilts`, `baymk-art-explosion-studios`, `baymk-stained-glass-garden`, `baymk-mendels`,
  `baymk-creative-reuse-east-bay`: posters, collages, logos or product banners.
- `baycer-west-valley-college-ceramics`, `baycer-ohlone-college-ceramics-part-time-faculty-pool`,
  `baycer-los-medanos-college-ceramics`: only a 1600 x 319 banner, headshots and event graphics; nothing on Commons.
- `baycer-foster-city-community-center-ceramics-studio`, `baycer-pacifica-community-center-ceramics`,
  `baycer-southside-community-center-ceramics-san-jose-prns`, `baycer-center-for-community-arts-walnut-creek-ceramics`,
  `baycer-walnut-creek-chili-bowl-and-handcrafted-holiday-sale`: city class listings with stock or storm-warning
  graphics.
- `baycer-artspan-sf-open-studios`, `baymk-artspan-sf-open-studios`: JavaScript shell with no images.

## Tooling

New scripts in `scripts/images/`, all `pass3_*` (scratch downloads and contact sheets live outside the repo):
`pass3_crawl.py` (fetch each site and subpages, collect image URLs), `pass3_dl.py` (download, filter, contact sheet;
now encodes spaces in URLs), `pass3_batch.py` (stack sheets for review), `pass3_retry.py` (re-crawl with a full
desktop-browser User-Agent), `pass3_wiki.py`, `pass3_csearch.py` and `pass3_meta.py` (Commons fallbacks, with
`pass3_wiki_queries.json`), `pass3_pages.py` and `pass3_urls.py` (hand-found pages and URLs), `pass3_picks.py` (the
chosen candidate per entry), `pass3_apply.py` (WebP conversion and `image` blocks, keeps each file's JSON layout),
`pass3_links.py` (link health from the crawl). A few credit and alt strings were tidied by hand after the apply step
(two Commons author fields, a Premio Faenza alt, the Oakland Art Murmur credit, two files recompressed under 200 KB).
