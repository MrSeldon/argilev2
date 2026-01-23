# Le Four Argile — Phase 0: Data Audit & Consolidation

> Coworker task: Before building, consolidate all existing data into clean master files
> This must happen BEFORE Claude Code starts the rebuild

---

## Goal

Go through all existing Argile files and:
1. Identify what data already exists
2. Find gaps and inconsistencies
3. Merge into clean master JSON files
4. Preserve design decisions and logic already implemented
5. Create a manifest of what we have vs. what we need

---

## Step 1: Inventory Existing Files

Look in the existing Argile project folder for:

**Data files:**
- Any `.json` files (glazes, opportunities, inspirations, materials, etc.)
- Any `.csv` exports
- Any data embedded in component files

**Design decisions:**
- Color mappings for glazes (placeholder colors when no image)
- Any style/theme configuration
- Component styling choices

**Logic/Features:**
- How materials/ingredients are displayed (should show ALL, not just top 5)
- Filter implementations
- Any sorting logic

**Create a file listing:**
```
existing-files.md
- /data/glazes.json (X entries)
- /data/opportunities.json (X entries)
- /components/GlazeCard.tsx (has color mapping logic)
- etc.
```

---

## Step 2: Audit Each Data File

For each JSON file found:

### Check 1: Valid JSON
- Does it parse without errors?
- Fix any syntax issues (brackets, quotes, commas)

### Check 2: Schema consistency
- Do all entries have the same fields?
- List any entries missing fields
- List any fields that only some entries have

### Check 3: Data completeness
For **Opportunities**, check each entry for:
- [ ] id
- [ ] slug
- [ ] name
- [ ] type
- [ ] location.city
- [ ] location.region
- [ ] location.country
- [ ] location.coordinates.lat
- [ ] location.coordinates.lng
- [ ] suitability.score
- [ ] suitability.localColor
- [ ] suitability.nearbyStudios
- [ ] suitability.nearbyMuseums
- [ ] suitability.ceramicsScene
- [ ] suitability.climate
- [ ] suitability.costOfLiving
- [ ] suitability.languageRequirement
- [ ] suitability.visaComplexity
- [ ] details.duration
- [ ] details.cost
- [ ] details.url
- [ ] details.description

For **Glazes**, check each entry for:
- [ ] id
- [ ] slug
- [ ] name
- [ ] source
- [ ] sourceUrl
- [ ] cone
- [ ] atmosphere
- [ ] surface
- [ ] colorFamily
- [ ] materials (array with name + percentage)
- [ ] placeholderColors (for card display)
- [ ] tags

For **Materials/Ingredients**:
- [ ] Complete list of all materials used in any glaze recipe
- [ ] Each material should have: id, name, category (if applicable)

### Check 4: Version comparison
If multiple versions of a file exist:
- Which has more entries?
- Which has more complete fields?
- Are there entries in the older version not in the newer?
- Merge: take the most complete version of each entry

---

## Step 3: Create Gap Report

Generate a markdown file listing:

```markdown
# Data Gap Report

## Opportunities
Total entries: X
Complete entries: X
Incomplete entries: X

### Missing suitability data:
- Opportunity Name 1: missing localColor, nearbyStudios
- Opportunity Name 2: missing coordinates
- ...

### Missing basic info:
- Opportunity Name 3: missing type
- ...

## Glazes
Total entries: X
With images: X
With placeholder colors: X
Missing both: X

### Missing recipe data:
- Glaze Name 1: missing materials
- ...

## Materials
Total unique materials across all recipes: X
Materials in master list: X
Missing from master list: X
- Material 1
- Material 2
- ...
```

---

## Step 4: Preserve Design Decisions

Look for and document:

### Glaze placeholder colors
Find where colors are assigned to glazes that don't have images. This might be:
- In the JSON data itself
- In a separate mapping file
- Hardcoded in a component

Extract this mapping and ensure it's preserved in the clean data.

### UI/UX decisions
Document any implemented features:
- "Materials selector shows all ingredients, scrollable"
- "Glazes can be filtered by cone, atmosphere, surface"
- "Opportunity cards show suitability score as [describe how]"
- etc.

Save as: `design-decisions.md`

---

## Step 5: Create Master Files

After audit and gap identification, create clean master files:

### `/data/opportunities/index.json`
- All opportunities merged
- Consistent schema
- Flag incomplete entries with `"_incomplete": true`

### `/data/glazes/index.json`
- All glazes merged
- Include placeholder colors
- Consistent schema

### `/data/materials/index.json`
- Complete list of all materials
- Derived from all glaze recipes

### `/data/inspirations/index.json`
- If any inspiration content exists, consolidate
- If not, create empty array placeholder

---

## Step 6: Output Manifest

Create a final status file:

```markdown
# Argile Data Manifest
Generated: [date]

## Ready for Build
- [x] opportunities/index.json (X entries, Y complete, Z incomplete)
- [x] glazes/index.json (X entries)
- [x] materials/index.json (X materials)
- [ ] inspirations/index.json (empty - needs content)

## Gaps Requiring Attention
1. X opportunities missing suitability data
2. X glazes missing placeholder colors
3. Materials list needs category assignments

## Design Decisions Preserved
- Glaze color mapping: [location]
- UI patterns documented in design-decisions.md

## Files to Delete (superseded)
- /old/glazes-v1.json
- /data/opportunities-backup.json
- etc.
```

---

## Important Notes

- **Do not delete original files** until Devin confirms the merge is correct
- **Screenshot anything ambiguous** for review
- **Ask if unsure** whether two entries are duplicates or distinct
- **Preserve all data** — even if incomplete, keep it and flag it rather than removing

---

## When Complete

Report back with:
1. The manifest file
2. The gap report
3. The design decisions document
4. Confirmation that master JSON files are created and valid

Then Claude Code can begin the rebuild with confidence that the data foundation is solid.
