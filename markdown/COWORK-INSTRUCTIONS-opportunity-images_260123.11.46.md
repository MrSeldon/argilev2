# Cowork Task: Download Images for Ceramics Opportunities

## Goal
Find and download representative images for each opportunity in the Le Four Argile ceramics opportunities database. These images will be used in the Opportunities section of the app.

## Source Data
The opportunities are in: `ceramics-opportunities-merged.json` (or your current opportunities JSON)
- ~275 opportunities total
- Types: Schools, Residencies, Grants, Fellowships, Workshops, Apprenticeships

## Image Requirements

### Technical Specs
- **Format**: JPG or PNG (prefer JPG for photos)
- **Size**: Minimum 800px wide, ideally 1200-1600px
- **Aspect ratio**: Roughly 16:9 or 4:3 (landscape preferred)
- **Quality**: High quality, no watermarks

### Content Guidelines
For each opportunity type, prioritize these image subjects:

**Schools/Universities:**
1. Campus ceramics studio or kiln area
2. Student work exhibition
3. Building exterior (art building)
4. Faculty demonstrations

**Residencies:**
1. Studio space
2. Kiln/firing facilities
3. Campus/grounds
4. Artist at work (if available)

**Grants/Fellowships:**
1. Logo of granting organization
2. Past recipient work
3. Organization building/headquarters

## File Naming Convention
```
{opportunity-id}.jpg
```
Examples:
- `archie-bray-foundation.jpg`
- `penland-school.jpg`
- `ekwc-netherlands.jpg`
- `pollock-krasner-grant.jpg`

Use the `id` field from the JSON if available, otherwise create a slug from the name.

## Workflow

### Step 1: Create a working folder
```
mkdir -p ~/argile-opportunity-images
cd ~/argile-opportunity-images
```

### Step 2: For each opportunity, search for images
Priority sources (in order):
1. **Official website** - Best source, most legitimate
2. **Wikimedia Commons** - CC-licensed images
3. **Flickr Creative Commons** - Search with CC filter
4. **Instagram embeds** - Reference only (don't download directly)

### Step 3: Search strategy by opportunity
For "Archie Bray Foundation":
- Go to archiebray.org, look for press/media images
- Search Wikimedia: "Archie Bray Foundation ceramics"
- Search Flickr CC: "Archie Bray"

For universities:
- Check university art department website for studio photos
- Search: "[University name] ceramics studio"

### Step 4: Download and rename
```bash
# Example using curl
curl -o archie-bray-foundation.jpg "https://example.com/image.jpg"
```

### Step 5: Create a manifest
Keep a simple CSV or JSON tracking what you found:
```csv
id,source_url,license,notes
archie-bray-foundation,https://archiebray.org/media/studio.jpg,used with permission,from official site
penland-school,https://commons.wikimedia.org/...,CC-BY-SA,wikimedia
```

## Priority Opportunities (Start Here)

### Tier 1 - Must Have (Famous/Important)
1. Archie Bray Foundation (Helena, MT)
2. Penland School of Craft (NC)
3. Haystack Mountain School (ME)
4. Anderson Ranch Arts Center (CO)
5. Watershed Center for the Ceramic Arts (ME)
6. EKWC - European Ceramic Work Centre (Netherlands)
7. Guldagergaard (Denmark)
8. La Meridiana (Italy)
9. Shigaraki Ceramic Cultural Park (Japan)
10. Jingdezhen International Studio (China)

### Tier 2 - Major Schools
1. Alfred University (NY)
2. Cranbrook Academy (MI)
3. Rhode Island School of Design
4. UCLA Ceramics
5. Ohio University
6. Virginia Commonwealth University
7. University of Colorado Boulder
8. Arizona State University
9. Cal State Long Beach
10. University of Minnesota

### Tier 3 - Grants/Fellowships
1. Pollock-Krasner Foundation
2. United States Artists Fellowship
3. NCECA Emerging Artist Award
4. Groot Foundation Grant
5. Windgate Fellowship

## Image Fallbacks
If no good image is found:
1. Use a solid color placeholder matching their brand
2. Use a generic ceramics studio image (create a small set of fallbacks)
3. Mark as "needs-image" in manifest for later

## Output Structure
```
~/argile-opportunity-images/
├── manifest.csv
├── tier-1/
│   ├── archie-bray-foundation.jpg
│   ├── penland-school.jpg
│   └── ...
├── tier-2/
│   └── ...
├── tier-3/
│   └── ...
└── fallbacks/
    ├── generic-studio-1.jpg
    ├── generic-kiln-1.jpg
    └── ...
```

## License Notes
- Always prefer CC0, CC-BY, or CC-BY-SA licensed images
- For official website images, note "used for educational/informational purposes"
- Avoid Getty, Shutterstock, or other stock photo watermarked images
- Museum images often have open access programs (Met, Smithsonian)

## When Done
1. Zip the folder: `zip -r argile-opportunity-images.zip argile-opportunity-images/`
2. The images can then be uploaded to the Argile project
3. Update the opportunities JSON to reference image filenames

## Sample Searches to Try

```
# Wikimedia Commons
site:commons.wikimedia.org "Archie Bray" ceramics
site:commons.wikimedia.org "Penland School"

# Official sites
site:archiebray.org press OR media OR images
site:penland.org gallery OR studio

# Flickr Creative Commons
https://www.flickr.com/search/?text=penland%20ceramics&license=4%2C5%2C6%2C9%2C10
```

## Notes
- This will take time - prioritize Tier 1 first
- Quality over quantity - better to have 50 great images than 275 mediocre ones
- Some opportunities (especially grants) may not have good images - that's okay
- The goal is visual richness for browsing, not comprehensive documentation
