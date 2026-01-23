# Le Four Argile — Styling Implementation Tasks

> Break this into separate Claude Code sessions. Each task should be one focused session.

---

## Pre-requisites: Assets Needed

Before starting the styling work, we need some hero images. These don't need to be perfect — they set the mood.

**Needed:**
1. **Homepage hero** — A cinematic ceramics image (hands on clay, kiln, finished pieces)
2. **Opportunities hero** — Workshop/studio scene, or a beautiful location shot
3. **Glazes hero** — Close-up of glaze texture, or fired pieces with interesting surfaces
4. **Inspirations hero** — Abstract/artistic ceramics shot, or nature textures

**Image sources:** Winnie's Instagram (@laini_studio) and laini-studio.com have beautiful imagery that can be used.

**Placeholder option:** If images aren't ready yet, use solid color backgrounds or gradient placeholders initially.

---

## Task 1: Foundation — Colors, Typography, Tailwind Config

**Prompt for Claude Code:**

```
I need you to update the styling foundation for Le Four Argile to match a high-end ceramics gallery aesthetic (inspired by ash-design.fr).

Read the markdown/DESIGN-GUIDE.md file first for full context.

For this task, ONLY do the following:

1. Update tailwind.config.ts with:
   - New color palette (cream, charcoal, warm tones)
   - Font families (Cormorant Garamond for serif, Inter for sans)
   - Extended letter-spacing values

2. Update app/layout.tsx to:
   - Import Google Fonts (Cormorant Garamond + Inter)
   - Set the base background to cream (#FAFAF8)
   - Set default text color to charcoal (#2D2D2A)

3. Update globals.css with:
   - Base typography styles
   - Smooth scrolling
   - Any CSS custom properties needed

DO NOT touch any other components or pages yet. Just the foundation.
```

---

## Task 2: Navigation Restyle

**Prompt for Claude Code:**

```
I need you to restyle the navigation for Le Four Argile to be minimal and elegant.

Read the markdown/DESIGN-GUIDE.md file for context.

Target state:
- Fixed position, transparent background (floats over hero images)
- Logo: "Le Four Argile" in serif font, top-left
- Links: top-right, all-caps, small text (text-xs), wide letter-spacing (tracking-widest)
- Text should be white when over dark heroes
- Remove any background color or borders from the nav

Update the navigation component and layout to achieve this. The nav should feel almost invisible.
```

---

## Task 3: Homepage Hero & Redesign

**Prompt for Claude Code:**

```
I need you to redesign the homepage (app/page.tsx) for Le Four Argile.

Read the markdown/DESIGN-GUIDE.md file for context.

Target state:
1. Full-viewport hero section (100vh) with:
   - Background: dark gradient placeholder (bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950)
   - Or use /images/hero-home.jpg if it exists
   - Centered content: "Le Four Argile" logo/wordmark
   - Subtle tagline below: "A ceramics learning portal"

2. Below the hero, a spacious section introducing the four areas:
   - Use large serif typography for section names
   - NO card borders or shadows
   - NO colored badges with numbers
   - Just elegant typography and generous whitespace

3. Overall feel: Gallery entrance, not a dashboard

Remove the current card-based layout entirely.
```

---

## Task 4: Opportunities Page Restyle

**Prompt for Claude Code:**

```
I need you to restyle the Opportunities page (/opportunities) for Le Four Argile.

Read the markdown/DESIGN-GUIDE.md file for context.

Target layout:
1. Full-bleed hero (60vh) with:
   - Background: warm gradient (bg-gradient-to-br from-amber-800 via-stone-800 to-stone-900)
   - Or use /images/hero-opportunities.jpg if it exists
   - Large centered title: "OPPORTUNITIES" in serif font, white text

2. Below hero:
   - Horizontal filter tabs, centered, separated by " | "
   - All-caps, small text, wide letter-spacing

3. Grid of opportunities:
   - 3 columns on desktop, 2 on tablet, 1 on mobile
   - NO visible card borders or shadows
   - Each card: image (or placeholder), then name below in small caps
   - Subtle hover effect: image scales slightly (1.02)

Remove all badges, colored tags, and dense metadata from the card view.
```

---

## Task 5: Opportunity Detail Page Restyle

**Prompt for Claude Code:**

```
I need you to restyle the Opportunity detail page (/opportunities/[slug]).

Read the markdown/DESIGN-GUIDE.md file for context.

Target layout:
1. Hero section (50vh) with the opportunity's image or gradient placeholder
2. Below hero: Large serif title of the opportunity

3. Two-column asymmetric layout:
   - Left (wider): Image of the location/program
   - Right: Details in elegant typography

4. Suitability Index section:
   - Present as elegant prose, NOT as a data table or badges
   - Use a pull-quote style for the "local color" description

5. Call to action: Simple underlined link "Visit Website →"

The page should feel like reading about a destination in a travel magazine.
```

---

## Task 6: Glazes Page Restyle

**Prompt for Claude Code:**

```
I need you to restyle the Glazes page (/glazes).

Read the markdown/DESIGN-GUIDE.md file for context.

Target layout:
1. Full-bleed hero (50vh) with gradient or glaze texture image
2. "GLAZES" title centered below hero

3. Filter bar:
   - Horizontal, centered
   - Minimal dropdowns or tab-style filters

4. Grid of glazes:
   - 4 columns desktop, 3 tablet, 2 mobile
   - Each card: square image (or color placeholder if no image)
   - Name below in small centered text
   - Hover: slight zoom on image

The glaze color placeholders actually work well with this aesthetic.
```

---

## Task 7: Final Polish

**Prompt for Claude Code:**

```
Final polish pass on Le Four Argile styling.

1. Ensure all pages have consistent:
   - Spacing (generous padding, py-24 between sections)
   - Typography (serif headlines, sans body)
   - Colors (cream background, charcoal text)

2. Check responsive behavior on all pages

3. Add subtle page transitions if not present

4. Review and remove any remaining:
   - Harsh shadows
   - Bright colored badges
   - Dense/cramped layouts
   - Visible card borders

5. Test the flow: Home → Opportunities → Detail → Back
   Make sure it feels like browsing a gallery, not using an app.
```

---

## Image Placeholders

If hero images aren't ready, use these Tailwind gradients:

```jsx
// Dark moody gradient (for homepage)
className="bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950"

// Warm gradient (for opportunities)
className="bg-gradient-to-br from-amber-800 via-stone-800 to-stone-900"

// Cool gradient (for glazes)
className="bg-gradient-to-br from-slate-700 via-stone-700 to-stone-800"

// Neutral gradient (for inspirations)
className="bg-gradient-to-br from-stone-600 via-stone-700 to-stone-800"
```

These can be swapped for real images later.
