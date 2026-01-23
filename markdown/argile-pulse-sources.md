# Le Four Argile — Living Pulse Source Discovery

> Coworker task: Find and document all data sources needed for the Living Pulse feature
> This is research/discovery work, not implementation

---

## Goal

Find APIs, RSS feeds, and data sources for:
1. Astronomical data (moon, sun, planets)
2. Space weather (solar flares, aurora)
3. Ceramics world news
4. Dark sky / light pollution data
5. Weather forecasts

For each source, document:
- URL / endpoint
- Whether it's free or requires API key
- Data format (JSON, RSS, etc.)
- Update frequency
- Rate limits
- Example response

---

## Part 1: Astronomical APIs

### Moon Data
Need: phase, illumination %, rise/set times by location

**Search for:**
- USNO (US Naval Observatory) API
- Astronomy API services
- Open-source astronomy libraries (SunCalc, etc.)

**Document:**
```markdown
### [Source Name]
- URL: 
- Free tier: Yes/No
- API key required: Yes/No
- Provides: [list what data]
- Example endpoint: 
- Rate limit:
- Notes:
```

### Sun Data
Need: sunrise, sunset, golden hour, blue hour times by location

**Search for:**
- Sunrise-sunset.org API
- TimeAndDate.com
- SunCalc library

### Planet Visibility
Need: which planets visible tonight, positions

**Search for:**
- Stellarium web API
- Astronomy APIs
- NASA JPL Horizons

### Celestial Events Calendar
Need: meteor showers, eclipses, conjunctions

**Search for:**
- International Meteor Organization (IMO)
- NASA eclipse data
- Astronomy event feeds/calendars

---

## Part 2: Space Weather

### Solar Activity
Need: flare activity, sunspot count, X-ray flux

**Search for:**
- NOAA Space Weather Prediction Center API
  - Try: https://services.swpc.noaa.gov/
- SpaceWeatherLive.com API

### Aurora Forecast
Need: Kp index, aurora oval position, visibility forecast

**Search for:**
- NOAA OVATION Aurora model
- AuroraWatch UK
- Aurora forecast apps/APIs

### Geomagnetic Storms
Need: storm alerts, G-scale ratings

**Search for:**
- NOAA alerts
- spaceweather.com RSS

---

## Part 3: Ceramics World

### News & Exhibitions
Need: exhibition openings, museum shows, artist news

**Search for RSS feeds from:**
- Ceramic Arts Network / Ceramics Monthly
- American Craft Council
- Craft in America
- Major ceramics museums:
  - Everson Museum of Art
  - Museum of Arts and Design (MAD)
  - Victoria & Albert Museum ceramics
  - LACMA ceramics

### Competitions & Deadlines
Need: submission deadlines, calls for entry

**Search for:**
- NCECA (National Council on Education for the Ceramic Arts)
- CFile (contemporary ceramics)
- Craft organization newsletters
- Residency deadline aggregators

**For each source found:**
```markdown
### [Publication/Organization]
- RSS URL: 
- Website: 
- Content type: [news/exhibitions/deadlines]
- Update frequency: 
- Notes:
```

---

## Part 4: Dark Sky Data

### Light Pollution Maps
Need: Bortle class by coordinates, light pollution levels

**Search for:**
- Light Pollution Map (lightpollutionmap.info) — do they have an API?
- Globe at Night data
- Dark Sky International data

### Dark Sky Parks/Preserves
Need: locations of certified dark sky areas

**Search for:**
- International Dark-Sky Association database
- National Park Service dark sky parks

---

## Part 5: Weather

### Forecast APIs
Need: cloud cover, precipitation, clear sky predictions by location

**Compare:**
- OpenWeatherMap (free tier)
- Tomorrow.io
- WeatherAPI.com
- National Weather Service API (US only, free)

**Key criteria:**
- Cloud cover percentage (essential for astronomy)
- Hourly forecasts
- Free tier limits
- Location-based queries

### Clear Sky Charts
Need: astronomical seeing forecasts

**Search for:**
- ClearDarkSky.com
- Meteoblue seeing forecasts
- Astrospheric

---

## Part 6: Bonus Sources

### ISS Passes
- NASA Spot the Station
- Heavens-Above.com

### Astrology (if desired)
- Ephemeris data sources
- Transit calculators

---

## Output Format

Create a document called `living-pulse-sources.md` with:

```markdown
# Living Pulse Data Sources

## Astronomy

### Moon & Sun
| Data | Source | URL | Free | API Key | Format | Notes |
|------|--------|-----|------|---------|--------|-------|
| Moon phase | [name] | [url] | Yes | No | JSON | [notes] |
| Sunrise/set | [name] | [url] | Yes | No | JSON | [notes] |

### Celestial Events
...

## Space Weather

### Solar Activity
...

## Ceramics

### RSS Feeds
| Source | URL | Content | Frequency |
|--------|-----|---------|-----------|
| Ceramic Arts Network | [url] | News, features | Weekly |

## Dark Sky

...

## Weather

...

## Recommendations

### Best Free Stack
- Moon/Sun: [recommendation]
- Space weather: [recommendation]
- Weather: [recommendation]
- Ceramics: [list of RSS feeds]

### If Budget Available
- [premium options worth considering]
```

---

## Process

1. For each category, search for available APIs/sources
2. Test endpoints where possible (paste into browser, check if they work)
3. Note any that require registration/API keys
4. Look for rate limits and terms of service
5. Find example responses to understand data structure
6. Document everything in the output format above

---

## Priority Order

1. **Moon/Sun data** — Essential for magic moment detection
2. **Weather (cloud cover)** — Essential for "is it viewable" logic
3. **Space weather** — Fun, adds cosmic awareness
4. **Ceramics RSS** — Practical for Winnie
5. **Dark sky data** — Nice to have for suitability

---

## When Complete

Report back with:
1. The `living-pulse-sources.md` document
2. Any sources that require API key signup (note which ones)
3. Any surprises or particularly good finds
4. Recommendations for what to use

This gives Claude Code everything needed to build the cron job.
