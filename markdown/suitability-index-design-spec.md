# Winnie Suitability Index — Design Specification for Claude Code

## Overview

The Suitability Index is a drill-down panel accessible from each opportunity modal. It provides climate, local color, and personalized metrics for each location. **The current implementation needs significant aesthetic refinement.**

This document captures the design decisions made to transform it from "Microsoft clip art graph" energy to museum-catalog elegance.

---

## Core Design Philosophy

### What We're Moving Away From
- Cold, clinical grays
- Generic dashboard/widget aesthetic  
- Bright, circus-y colors everywhere
- Emoji icons floating around
- Chartjunk (unnecessary grid lines, boxes, decorative elements)
- Disconnected sections without visual flow
- "Claude built a dashboard" energy

### What We're Moving Toward
- **Edward Tufte principles**: Maximize data-ink ratio, let data speak through form not decoration
- **Museum-catalog aesthetic**: Clean, elegant, editorial
- **Warm palette**: Stone tones, not cold grays
- **Refined, calm, quiet**: Every element earns its place
- **Progressive disclosure**: Hover states for detail, not visual clutter
- **Negative-space-forward**: Breathing room, not cluttered

---

## Color Palette

### Primary Palette (Stone Tones)
```
Background:       #FAF8F5 (warm off-white)
Card background:  #F5F2EE (slightly darker warm)
Text primary:     #57534E (warm stone)
Text secondary:   #A8A29E (stone-400)
Text muted:       #D6D3D1 (stone-300)
Borders:          rgba(214, 211, 209, 0.6) — stone-200/60
```

### Accent Colors (Muted, Purposeful)
```
Terracotta/Warm:  #C4A77D, #8B7355
Amber (daylight): #D4A574
Blue (rain):      #93C5FD at 60% opacity
```

### Event Marker Colors (Desaturated Earth Tones)
```
Blooms:           #D4A5A5 (dusty rose)
Festival:         #C4A77D (terracotta)
Foliage:          Muted orange
Solstice:         Muted amber
```

**Critical**: Avoid bright, saturated colors. Everything should feel calm and refined.

---

## Typography

### Hierarchy
- **Micro-labels**: `text-[9px] uppercase tracking-[0.2em] text-stone-400`
- **Section headers**: `text-sm font-medium text-stone-700`
- **Data values**: Light-weight numbers, proper font scaling
- **Body text**: `text-xs text-stone-600 leading-relaxed`

### Spacing Rhythm
- Section spacing: `mb-12` or `mb-16`
- Card padding: Consistent internal padding
- Label/content gap: Small, tight

---

## Climate Almanac (The Main Chart)

### The Problem with the Current Implementation
"This just feels like a Microsoft clip art graph or something. There's nothing imaginative or beautiful here."

### The Solution: Tufte-Inspired Layered Visualization

#### Temperature Display
- **Single elegant line/curve** showing temperature across 12 months
- Line color: `#57534E` (warm stone)
- NO grid lines, NO boxes, NO chart borders
- Minimal Y-axis labels (just key temperatures: 30°, 50°, 70°, 90°)
- X-axis: Single letter month abbreviations (J F M A M J J A S O N D)

#### Comfort Zone Visualization
- **Winnie's comfort zone** (70–83°F): Horizontal band with subtle fill `rgba(196, 167, 125, 0.15)`
- **Devin's comfort zone** (55–82°F): Toggle-able, different subtle color `rgba(167, 139, 250, 0.1)`
- The temperature line flows through these bands — visually obvious when she's comfortable vs. not
- Concept: Show *deviation from comfort*, not just absolute temperature

#### Rainfall Visualization
**"Rainfall as countable blocks"** — Very Tufte.
- Each small square = 1 inch of rain
- Stack from the bottom of each month column
- Subtle blue fill: `#93C5FD` at 60% opacity
- Small squares (6x6px), rounded corners (1px radius)
- You literally *see* the accumulation — countable, not abstract

#### Daylight Hours (Optional Layer Toggle)
**"Daylight as a secondary curve that rises and falls across the year"**
- When enabled: Dashed line in muted amber `#D4A574`
- Secondary Y-axis on right side (9h, 12h, 15h)
- Dawn → midday → dusk maps to a wave form
- Rises in summer, falls in winter

#### Moon Phases (Optional Layer Toggle)
**"Moon as silhouettes — no yellow"**
- Small SVG moon shapes above the chart
- Just the shape: dark circle with lit portion as subtle lighter tone or outline
- NO bright colors, NO emoji moons
- Subtle, discoverable

#### Program Window Highlighting
- **Fixed dates**: That slice of the year highlighted with subtle background
- **Rolling admission**: Draggable window that can slide across the year
- Shows fall start, spring start, or other entry points

#### Hover Interaction
- Hovering on any month reveals tooltip with:
  - Exact average temperature
  - Rainfall amount  
  - Hours of daylight
  - Any active program windows
- Clean, minimal tooltip design

#### Event Markers
- **NOT emojis floating above** — integrated notation with refined marks
- Small dots on the chart in desaturated earth tones
- Clicking opens clean modal with event detail
- Event types: blooms, festivals, foliage, solstices, meteor showers

---

## Toggleable Overlay Layers

Provide subtle toggle buttons (not chunky switches) to enable/disable:

1. **Winnie's Comfort Zone** (default ON)
2. **Devin's Comfort Zone** (default OFF)  
3. **Daylight Hours** (default OFF)
4. **Moon Phases** (default OFF)
5. **Mosquito Season** (default OFF)
6. **Pollen/Allergens** (default OFF)

Toggle design: Small, refined, possibly just text links or minimal pill buttons.

---

## Probability of Chili™

### Concept
A persistent, discoverable element that appears on every location. Started as an inside joke, became a real metric.

### Implementation
- **Tiny icon** in the header area — subtle, not prominent
- **Hover reveals**: Score, rating, nearest distance
- **Click opens modal** with the full story

### The Story (for the modal)
> "Probability of Chili™ began with Winnie's first taste of chili at The River Time bar in Guerneville. That single bite became her favorite food discovery—warmth, spice, comfort in a bowl. What started as tracking 'can we find chili here?' for her became a running joke, then a genuine metric. The score represents likelihood of finding a satisfying bowl within reasonable distance: density of diners, Tex-Mex presence, regional food culture."

### Display
```
Score: 23 (numeric)
Rating: Low / Moderate / Good / Excellent / God-level
Nearest: "12km (Asheville)"
```

For Texas, North Carolina, etc. — show "God-level" status and info about chili competitions, regional styles.

---

## Section Layout & Visual Flow

### Problem
"It's too abrupt the change from one thing to the next. They need to be a little bit closer."

### Solution
- Sections should flow into each other, not feel like separate cards
- Use subtle dividers (`border-t border-stone-200/60`) not hard card edges
- Consistent padding rhythm creates visual continuity
- Left border accent on key quotes/summaries

### Section Order (Example)
1. Climate Almanac (the chart)
2. Seasonal Summary (4-column grid: Winter, Spring, Summer, Autumn)
3. Local Color (blooms, festivals, culture)
4. Probability of Chili™
5. Practical Notes (if any)

---

## Seasonal Summary

Four-column grid with minimal, warm prose:

```
WINTER
Cold. Below comfort Dec–Mar. Good for indoor studio work.

SPRING  
Warming. April blooms, May festival. Pollen peaks.

SUMMER
In comfort Jun–Sep. Peak humidity & mosquitoes July.

AUTUMN
October foliage spectacular. Cooling rapidly November.
```

Style:
- `text-stone-400 uppercase tracking-wider text-[9px] mb-1` for season labels
- `text-stone-600 leading-relaxed text-xs` for description

---

## Month Detail Panel (Click to Expand)

When clicking a month, show detailed panel:

1. **Temperature** with comfort badge ("In Winnie's comfort" / "Too cold" / "Too hot")
2. **Rainfall** with count
3. **24-hour daylight visualization**: Simple bar showing dark-light-dark with sunrise/sunset markers
4. **Conditions**: Mosquitoes level, pollen level
5. **Events**: All events for that month with full details
6. **Night sky**: Meteor showers, notable astronomy

Close on click outside or explicit close button.

---

## Empty State Behavior

**Critical principle**: If a field has no data, it doesn't show.

- No empty sections saying "No data available"
- Populated fields surface naturally
- The index should feel full and relevant, not sparse

---

## Things to Avoid

1. ❌ Bright emoji icons
2. ❌ Saturated colors
3. ❌ Grid lines on charts
4. ❌ Card-heavy layouts with hard borders
5. ❌ Generic dashboard widget aesthetic
6. ❌ Cluttered hover states
7. ❌ "Microsoft clip art graph" energy
8. ❌ Too much visual distance between related elements
9. ❌ Cold gray color palette

---

## Implementation Notes for Claude Code

### CSS/Tailwind Priorities
- Use stone color scale (stone-50 through stone-900)
- Opacity modifiers for subtle overlays (e.g., `bg-stone-200/60`)
- `tracking-wider` or `tracking-[0.2em]` for micro-labels
- Transitions for hover states (`transition-all duration-200`)

### SVG for Data Visualization
- Build the climate chart as SVG, not canvas
- Use `<path>` for temperature curve
- Use `<rect>` for rainfall blocks
- Use `<circle>` or custom paths for moon phases
- Keep everything crisp at any zoom level

### Interaction Model
- Hover for preview/tooltips
- Click for full detail panels
- Toggle buttons for layer visibility
- Modal for Probability of Chili story

### Data Requirements
Each opportunity location needs:
- Monthly temperature averages (12 values)
- Monthly rainfall averages (12 values)
- Monthly daylight hours (12 values)
- Program dates (start, end, or "rolling")
- Events (optional array of {month, type, label, detail})
- Chili data (score, rating, nearest, notes)

---

## Reference Files

The opportunities JSON (`ceramics-opportunities-master-v3.json`) includes coordinates for every location. Use these to:
- Fetch climate data from appropriate APIs
- Calculate distances for "nearest chili" etc.
- Display on maps if needed

---

## Summary

Transform the Suitability Index from a functional but flat dashboard widget into an elegant, Tufte-inspired information display that feels like opening a beautifully designed museum catalog page. Warm tones, refined typography, layered data that rewards attention, and playful elements (Probability of Chili™) that maintain elegance.

The goal: Something Winnie would actually enjoy looking at while making important decisions about where to spend months of her life.
