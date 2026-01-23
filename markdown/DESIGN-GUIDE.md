# Le Four Argile — Design Guide

> Inspired by ash-design.fr — Editorial, spacious, sophisticated ceramics aesthetic

---

## Design Philosophy

The goal is to transform Le Four Argile from a utilitarian app into an **immersive, gallery-like experience** that feels like browsing a high-end ceramics publication. Every page should feel spacious and considered.

**Key principles:**
1. **Let images breathe** — generous whitespace, no cramped layouts
2. **Cinematic heroes** — full-bleed images that set mood before content
3. **Minimal UI chrome** — the navigation should almost disappear
4. **Editorial typography** — elegant serif headlines, clean sans-serif body
5. **Muted, earthy palette** — warm neutrals, no harsh colors
6. **Asymmetric layouts** — break the grid, offset images and text

---

## Color Palette

### Primary Colors
```css
--color-bg: #FAFAF8;           /* Warm off-white background */
--color-bg-dark: #1A1A18;      /* Deep charcoal for dark sections */
--color-text: #2D2D2A;         /* Near-black text */
--color-text-light: #6B6B66;   /* Secondary/muted text */
--color-text-inverse: #FAFAF8; /* White text on dark backgrounds */
```

### Accent Colors (use sparingly)
```css
--color-accent: #8B7355;       /* Warm brown/taupe */
--color-accent-light: #C4B5A0; /* Light taupe for borders */
--color-gold: #B8956E;         /* Bronze/gold for special elements */
```

### Surface Colors
```css
--color-surface: #FFFFFF;      /* Card backgrounds */
--color-surface-warm: #F5F3EF; /* Warm gray sections */
--color-border: #E5E3DF;       /* Subtle borders */
```

---

## Typography

### Font Stack
```css
/* Headlines - use a refined serif */
--font-headline: 'Cormorant Garamond', 'Times New Roman', serif;

/* Body - clean, readable sans */
--font-body: 'Inter', 'Helvetica Neue', sans-serif;

/* Accent - for small caps, labels */
--font-accent: 'Inter', sans-serif;
```

### Type Scale
```css
/* Headlines */
--text-hero: 4rem;      /* 64px - Main hero headlines */
--text-h1: 3rem;        /* 48px - Page titles */
--text-h2: 2rem;        /* 32px - Section headers */
--text-h3: 1.5rem;      /* 24px - Card titles */

/* Body */
--text-body: 1rem;      /* 16px - Paragraph text */
--text-small: 0.875rem; /* 14px - Captions, metadata */
--text-xs: 0.75rem;     /* 12px - Labels, tags */

/* Letter spacing */
--tracking-tight: -0.02em;  /* Headlines */
--tracking-wide: 0.1em;     /* All-caps labels */
```

### Typography Patterns from Ash Design

1. **Hero headlines**: Large serif, minimal weight, centered
2. **Section titles**: All-caps, wide letter-spacing, thin weight
3. **Body text**: Justified or left-aligned, generous line-height (1.7)
4. **Italic pull quotes**: Large, centered, italicized serif
5. **Navigation**: All-caps, small, wide tracking

---

## Layout Patterns

### 1. Cinematic Hero Sections
Every page opens with a full-bleed hero image (50-60% viewport height) before any content.

```jsx
<section className="relative h-[60vh] w-full">
  <Image
    src={heroImage}
    alt=""
    fill
    className="object-cover"
  />
  {/* Minimal overlay text, positioned bottom or center */}
  <div className="absolute inset-0 flex items-center justify-center">
    <h1 className="text-white text-5xl font-serif">SCULPTURE</h1>
  </div>
</section>
```

### 2. Asymmetric Two-Column Layout
Text and images offset from each other, not aligned.

```jsx
<section className="grid grid-cols-12 gap-8 py-24">
  {/* Image takes 5 columns, starts at column 1 */}
  <div className="col-span-5 col-start-1">
    <Image src={image} className="w-full" />
  </div>

  {/* Text takes 4 columns, starts at column 8, vertically centered */}
  <div className="col-span-4 col-start-8 flex flex-col justify-center">
    <h2 className="text-4xl font-serif mb-6">TALISMAN</h2>
    <p className="text-gray-600 leading-relaxed">
      Description text here...
    </p>
  </div>
</section>
```

### 3. Pull Quote Sections
Large, centered italic text between content blocks.

```jsx
<section className="py-24 px-8 max-w-4xl mx-auto text-center">
  <p className="text-3xl font-serif italic text-gray-700 leading-relaxed">
    Inspired from wilderness, touched by powerful landscapes,
    driven by the effortless beauty of nature.
  </p>
</section>
```

### 4. Product Grid (Stock/Available Work)
Clean 4-column grid with minimal card styling.

```jsx
<section className="py-16">
  {/* Filter tabs - horizontal, centered, separated by pipes */}
  <div className="flex justify-center gap-4 mb-12 text-sm tracking-widest">
    <button className="uppercase">All</button>
    <span className="text-gray-300">|</span>
    <button className="uppercase text-gray-400">Sculpture</button>
  </div>

  {/* Grid - generous gaps, no card borders */}
  <div className="grid grid-cols-4 gap-6">
    {items.map(item => (
      <div key={item.id} className="group cursor-pointer">
        <div className="aspect-square overflow-hidden mb-4">
          <Image
            src={item.image}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <p className="text-center text-sm tracking-wider uppercase">
          {item.name}
        </p>
      </div>
    ))}
  </div>
</section>
```

---

## Navigation

### Desktop Navigation
- Minimal, almost invisible
- Position: top-right corner
- Style: All-caps, small text, wide letter-spacing
- No background, just text over hero image
- Logo: top-left, handwritten/signature style or simple wordmark

```jsx
<nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6">
  <Link href="/" className="text-xl font-serif">
    Le Four Argile
  </Link>
  <div className="flex gap-8 text-xs tracking-widest uppercase">
    <Link href="/opportunities">Opportunities</Link>
    <Link href="/glazes">Glazes</Link>
    <Link href="/inspirations">Inspirations</Link>
    <Link href="/mentor">Mentor</Link>
  </div>
</nav>
```

---

## Component Patterns

### Cards (Target Style)
- No visible card borders
- Image-dominant, minimal text below
- Text: centered, small caps
- Hover: subtle image zoom

### Buttons
- Primary: Simple underline or thin border
- No heavy fills
- All-caps, small text, wide tracking

```jsx
<button className="uppercase text-sm tracking-widest border-b border-current pb-1 hover:opacity-70 transition-opacity">
  View Collection
</button>
```

### Form Inputs
Simple underline-only inputs, no visible borders or backgrounds.

```jsx
<input
  type="text"
  placeholder="First Name"
  className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:border-gray-800 focus:outline-none transition-colors"
/>
```

---

## What to Remove/Reduce

1. **Rounded corners** on cards — go flat or very subtle
2. **Colored badges** (like "275+") — replace with elegant typography
3. **Heavy shadows** — remove or make extremely subtle
4. **Dense information layout** — spread things out
5. **Bright accent colors** — mute everything
6. **Visible card borders** — let images float

---

## Tailwind Config Additions

```js
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        cream: '#FAFAF8',
        charcoal: '#1A1A18',
        warm: {
          50: '#F5F3EF',
          100: '#E5E3DF',
          200: '#C4B5A0',
          500: '#8B7355',
          700: '#5C4D3C',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Times New Roman', 'serif'],
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
      letterSpacing: {
        'extra-wide': '0.15em',
      },
    },
  },
}
```

---

## Reference

All design inspiration from: **ash-design.fr** (Margaux Leycuras — Ceramic Sculptural Design)
