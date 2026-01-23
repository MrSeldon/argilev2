# Le Four Argile — Coworker Tasks

> Desktop automation instructions for Coworker
> These tasks involve browser interaction, file management, and data entry

---

## Task 1: Glaze Image Curation from Digital Fire

**Goal:** For each glaze in our database, find and download the best representative image from Digital Fire.

**Process:**
1. Open the Digital Fire URL for each glaze (stored in `sourceUrl` field)
2. On the page, look for images. Note: pages often have multiple images, some may be:
   - The actual glaze result
   - Reference images from other recipes
   - Diagrams or charts
3. Identify the PRIMARY glaze image — usually the first/largest image that shows a fired ceramic piece
4. Download that image
5. Save to `/downloads/glaze-images/` with naming convention: `[glaze-slug].jpg`
6. If no clear image exists, note the glaze name in a `no-image.txt` file

**Quality criteria for image selection:**
- Shows the actual glaze surface clearly
- Good lighting, not blurry
- Shows color accurately
- Preferably on a simple form (bowl, tile) not a complex sculptural piece

**Batch approach:**
- Process 10-20 glazes at a time
- Create a log of what was downloaded vs skipped
- Report back when batch is complete

---

## Task 2: JSON Compilation and Validation

**Goal:** Combine multiple JSON exports into clean master files.

**Common issues to fix:**
- Mismatched brackets `{` vs `[`
- Trailing commas after last item
- Inconsistent quote styles (curly quotes from copy-paste)
- Missing required fields
- Duplicate entries

**Process:**
1. Open each JSON file that needs to be merged
2. Validate JSON syntax (can use browser console or jsonlint.com)
3. If syntax errors, identify and fix:
   - Replace curly quotes `""` with straight quotes `""`
   - Remove trailing commas
   - Fix bracket mismatches
4. Combine arrays from multiple files into single array
5. Remove duplicate entries (match by `id` or `name`)
6. Save to master file location
7. Validate final file loads correctly

**For Opportunities specifically:**
- Master file: `/data/opportunities/index.json`
- All entries must have:
  - `id` (unique)
  - `slug` (URL-safe)
  - `name`
  - `type`
  - `location` with `coordinates`
  - `suitability` with ALL sub-fields

---

## Task 3: Suitability Index Data Enrichment

**Goal:** For opportunities with incomplete suitability data, research and fill in missing fields.

**Process for each opportunity:**
1. Check which suitability fields are empty/null:
   - localColor
   - nearbyStudios
   - nearbyMuseums
   - ceramicsScene
   - climate
   - costOfLiving
   - languageRequirement
   - visaComplexity

2. For `nearbyStudios`:
   - Search: "[city name] ceramics studio" or "[city name] pottery studio"
   - Find 2-3 notable studios within reasonable distance
   - Add as array of strings

3. For `nearbyMuseums`:
   - Search: "[city name] art museum" or "[city name] ceramics museum"
   - Prioritize museums with ceramics collections
   - Add as array of strings

4. For `localColor`:
   - Search for general information about the city/area
   - Write 2-3 sentences describing the vibe, culture, artistic scene
   - Example: "A quiet coastal town with a strong tradition of folk pottery. The local clay has a distinctive red color."

5. For `ceramicsScene`:
   - Search: "[city name] ceramics community" or "[region] pottery tradition"
   - Describe the local ceramics culture
   - Example: "Home to several cooperative studios and an annual ceramics festival in September."

6. For `climate`:
   - Search: "[city name] climate"
   - Brief description: "Mediterranean climate with mild, wet winters and hot, dry summers."

7. For `costOfLiving`:
   - Search: "[city name] cost of living"
   - Categorize as: "low" | "medium" | "high"
   - Relative to US/Western European standards

8. For `languageRequirement`:
   - What language is instruction in?
   - Is English sufficient?
   - Example: "Instruction in French, intermediate French required" or "English-friendly"

9. For `visaComplexity`:
   - For US citizens, how hard is it to get appropriate visa?
   - Categorize as: "low" | "medium" | "high"
   - EU countries = low, countries requiring sponsorship = high

**Output:**
- Update the JSON entry with researched information
- Do NOT leave fields empty — if truly unknown, write "Information not available"
- Keep descriptions concise but informative

---

## Task 4: File Organization

**Goal:** Organize downloaded assets with consistent naming.

**Naming conventions:**
- Glaze images: `[glaze-slug].jpg` (lowercase, hyphens)
- Inspiration images: `[inspiration-slug].jpg`
- All lowercase
- Hyphens instead of spaces
- No special characters

**Folder structure:**
```
downloads/
├── glaze-images/
├── inspiration-images/
└── temp/
```

**Process:**
1. Review files in source folder
2. Rename according to convention
3. Move to appropriate subfolder
4. Delete duplicates
5. Report what was organized

---

## Task 5: Airtable to JSON Export (if needed)

**Goal:** Export Airtable data to clean JSON format.

**Process:**
1. Open Airtable base
2. Go to the relevant table
3. Use Airtable's "Download CSV" feature
4. Convert CSV to JSON (can use online converter or script)
5. Clean up field names to match our schema
6. Validate JSON syntax
7. Save to appropriate location in `/data/`

---

## General Guidelines

- **Take screenshots** of anything ambiguous for Devin to review
- **Create logs** of what was done in each session
- **Ask before bulk operations** — confirm approach before processing 100+ items
- **Save incrementally** — don't wait until the end to save work
- **Report errors** — if something doesn't work as expected, note it

---

## Priority Order

1. JSON validation and compilation (unblock Claude Code)
2. Suitability index enrichment (most impactful for Winnie)
3. Glaze image curation (can happen in parallel)
4. File organization (as needed)
