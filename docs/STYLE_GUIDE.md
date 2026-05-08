# ITWala Design System & Style Guide

> **Reusable reference** for this project and future projects built on the same stack (Next.js + Tailwind CSS).

---

## 1. Color Palette

### Primary — Steel Blue
Used for: headings, CTA buttons, links, active states, borders, gradients.

| Token | Hex | Usage |
|---|---|---|
| `primary-50` | `#eff6ff` | Tinted backgrounds, hover fills |
| `primary-100` | `#dbeafe` | Card borders, badge backgrounds |
| `primary-200` | `#bfdbfe` | Dividers, subtle outlines |
| `primary-300` | `#93c5fd` | Decorative accents |
| `primary-400` | `#60a5fa` | Hover icon fills |
| **`primary-500`** | **`#2b74b3`** | **Brand primary — buttons, icons, links** |
| `primary-600` | `#1e5a90` | Button hover, active nav |
| `primary-700` | `#154270` | Dark text on light background |
| `primary-800` | `#0e2d50` | Dark section cards |
| `primary-900` | `#071c33` | Body text default |

### Secondary — Light Blue
Used for: gradient pair with primary, secondary buttons, supporting decorative elements.

| Token | Hex | Usage |
|---|---|---|
| `secondary-50` | `#f4f8fd` | Section background tints |
| `secondary-100` | `#e8f1fb` | Scrollbar track |
| `secondary-200` | `#ccdff5` | Soft borders |
| `secondary-300` | `#a4c7ec` | Decorative fills |
| `secondary-400` | `#71a9dc` | Icon accents |
| **`secondary-500`** | **`#4388c6`** | **Secondary buttons, gradient end** |
| `secondary-600` | `#2e6da8` | Button hover |
| `secondary-700` | `#1e5388` | Dark secondary text |
| `secondary-800` | `#133b68` | — |
| `secondary-900` | `#0a2548` | — |

### Accent — Warm Orange
Used for: highlights, badges, star ratings, CTAs that need contrast, "featured" indicators, pulse dots.

| Token | Hex | Usage |
|---|---|---|
| `accent-50` | `#fff4f0` | Very light tint |
| `accent-100` | `#ffe4d8` | Badge background |
| `accent-200` | `#ffc5a9` | Soft highlight |
| `accent-300` | `#ff9a6c` | Icon fills |
| `accent-400` | `#f76a38` | Hover accent |
| **`accent-500`** | **`#dc6428`** | **Star ratings, accent badges, featured bars** |
| `accent-600` | `#b34d1b` | Hover state |
| `accent-700` | `#8b3912` | Dark text on orange |
| `accent-800` | `#67280b` | — |
| `accent-900` | `#461a06` | — |

### Gray — Cool Blue-Grey Slate
Used for: body text, borders, muted labels, section backgrounds.

| Token | Hex | Usage |
|---|---|---|
| `gray-50` | `#f8fafc` | Page / section background (light) |
| `gray-100` | `#f1f5f9` | Card hover background |
| `gray-200` | `#e2e8f0` | Dividers, input borders |
| `gray-300` | `#cbd5e1` | Placeholder text borders |
| `gray-400` | `#94a3b8` | Muted labels, sub-roles |
| `gray-500` | `#64748b` | Secondary body text |
| `gray-600` | `#475569` | Body text |
| `gray-700` | `#334155` | Sub-headings |
| `gray-800` | `#1e293b` | Dark headings |
| `gray-900` | `#0f172a` | Near-black text |

### Semantic / Status Colors

| Token | Hex | Usage |
|---|---|---|
| `success-500` | `#15803d` | Success messages, positive badges |
| `warning-500` | `#d97706` | Warning states |
| `error-500` | `#dc2626` | Error states, validation |

---

## 2. CSS Variables (Light / Dark Mode)

Defined in `src/styles/globals.css` via `:root` and `.dark-theme`.

```css
/* Light mode (default) */
:root {
  --slate-1: #fbfcfd;
  --slate-2: #f8f9fa;
  --slate-3: #f1f3f5;

  --color-bg:         #ffffff;
  --color-bg-inset:   var(--slate-2);
  --color-bg-overlay: #ffffff;
}

/* Dark mode — apply .dark-theme to <html> or a wrapper */
.dark-theme {
  --slate-1: #111113;
  --slate-2: #18191b;
  --slate-3: #212225;

  --color-bg:         var(--slate-1);
  --color-bg-inset:   #000000;
  --color-bg-overlay: var(--slate-3);
}
```

Tailwind tokens for these variables: `bg-bg`, `bg-bg-inset`, `bg-bg-overlay`.

---

## 3. Typography

### Font Families

| Role | Font | Fallbacks |
|---|---|---|
| **Sans** (body, UI) | `Space Grotesk` | system-ui, -apple-system, Segoe UI, Roboto, Arial |
| **Serif** (display, editorial) | `Playfair Display` | Georgia, Times New Roman |

Tailwind classes: `font-sans`, `font-serif`.

### Type Scale (Tailwind defaults + usage patterns)

| Use Case | Class |
|---|---|
| Hero heading | `text-4xl md:text-5xl lg:text-6xl font-bold` |
| Section heading | `text-3xl md:text-4xl lg:text-5xl font-bold` |
| Sub-heading | `text-xl md:text-2xl font-semibold` |
| Card title | `text-lg font-semibold` |
| Body / paragraph | `text-base leading-relaxed` |
| Small / meta | `text-sm text-gray-500` |
| Micro / label | `text-xs uppercase tracking-widest` |

### Gradient Text

```html
<!-- Primary → Secondary gradient text -->
<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
  Heading text
</span>

<!-- Primary → Accent gradient text -->
<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-400">
  Heading text
</span>
```

---

## 4. Gradients

### Hero / Section Backgrounds

```css
/* Standard hero gradient */
.bg-gradient-hero {
  background: linear-gradient(to bottom right, #1e5a90, #154270, #2e6da8);
  /* Tailwind: bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 */
}
```

### Card Gradients (dark cards)

```html
<!-- Dark enterprise card -->
<div class="bg-gradient-to-b from-primary-800/60 to-gray-900/80">...</div>
```

### Light Section Background

```html
<!-- Clean light background for sections (testimonials, features, etc.) -->
<section class="bg-gray-50">...</section>
<section class="bg-gradient-to-b from-gray-50 via-white to-gray-50">...</section>
```

---

## 5. Buttons

All buttons extend the `.btn` base class defined in `globals.css`.

```html
<!-- Primary -->
<button class="btn btn-primary">Get Started</button>
<!-- bg-primary-500 text-white hover:bg-primary-600 -->

<!-- Secondary -->
<button class="btn btn-secondary">Learn More</button>
<!-- bg-secondary-500 text-white hover:bg-secondary-600 -->

<!-- Accent (high-visibility CTA) -->
<button class="btn btn-accent">Enroll Now</button>
<!-- bg-accent-500 text-white hover:bg-accent-600 -->

<!-- Outline -->
<button class="btn btn-outline">View Portfolio</button>
<!-- bg-white text-primary-600 border-2 border-primary-500 -->

<!-- Hero Primary -->
<button class="btn-hero-primary">Start Learning</button>

<!-- Hero Secondary -->
<button class="btn-hero-secondary">View Courses</button>
```

### Button Sizing

```html
<!-- Small -->
<button class="btn btn-primary px-3 py-1.5 text-xs">Small</button>

<!-- Default -->
<button class="btn btn-primary">Default</button>

<!-- Large -->
<button class="btn btn-primary px-8 py-3 text-lg">Large</button>

<!-- Pill (rounded-full) -->
<button class="btn btn-primary rounded-full px-6">Pill</button>
```

---

## 6. Cards

### Light Card (default)

```html
<div class="bg-white rounded-2xl border border-primary-100 shadow-md hover:shadow-xl
            hover:border-primary-200 transition-all duration-300 overflow-hidden">
  <!-- Top accent stripe -->
  <div class="h-1 w-full bg-gradient-to-r from-primary-500 to-secondary-500"></div>
  <div class="p-6">...</div>
</div>
```

### Dark / Enterprise Card

```html
<div class="rounded-2xl border border-primary-700/40
            bg-gradient-to-b from-primary-800/60 to-gray-900/80
            backdrop-blur-sm overflow-hidden
            hover:shadow-2xl hover:shadow-primary-900/40 transition-shadow duration-300">
  <!-- Accent top bar -->
  <div class="h-1 w-full bg-primary-500"></div>
  <div class="p-7 md:p-8">...</div>
</div>
```

### Simple Card (globals.css utility)

```html
<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body">Content</div>
  <div class="card-footer">Footer</div>
</div>
```

---

## 7. Badges / Labels

```html
<!-- Section label / eyebrow -->
<div class="inline-flex items-center gap-2 bg-primary-50 border border-primary-100
            text-primary-600 text-xs font-semibold tracking-widest uppercase
            px-4 py-1.5 rounded-full">
  <span class="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse"></span>
  Section Label
</div>

<!-- Primary badge -->
<span class="badge badge-primary">Primary</span>

<!-- Accent badge -->
<span class="badge badge-accent">New</span>

<!-- Success badge -->
<span class="badge badge-success">Active</span>
```

---

## 8. Shadows

| Class | Usage |
|---|---|
| `shadow-sm` | Subtle — inputs, small cards |
| `shadow` | Default card elevation |
| `shadow-md` | Standard cards |
| `shadow-lg` | Elevated cards, dropdowns |
| `shadow-xl` | Modals, popovers |
| `shadow-2xl` | Hero overlays |
| `shadow-inner` | Inset — pressed states, inputs |

---

## 9. Spacing & Layout

### Container

```html
<div class="container mx-auto px-4">
  <!-- max-width: 1280px, horizontal padding: 16px -->
</div>
```

### Section Padding Pattern

```html
<!-- Standard section -->
<section class="py-16 md:py-24">...</section>

<!-- Compact section -->
<section class="py-10 md:py-14">...</section>

<!-- Dense section (e.g. testimonials) -->
<section class="pt-10 pb-11 md:pt-14 md:pb-16">...</section>
```

### Breakpoints (Tailwind defaults)

| Prefix | Min Width | Typical use |
|---|---|---|
| *(none)* | 0px | Mobile first |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large monitors |

---

## 10. Animations

### Tailwind animation utilities

```html
<div class="animate-fade-in">...</div>
<div class="animate-slide-up">...</div>
<div class="animate-slide-down">...</div>
```

### Marquee (horizontal auto-scroll)

```css
@keyframes marquee-rtl {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-track {
  animation: marquee-rtl 50s linear infinite;
  will-change: transform;
}
.marquee-track:hover {
  animation-play-state: paused;
}
/* Disable on mobile — use touch scroll instead */
@media (max-width: 767px) {
  .marquee-track { animation: none; }
}
```

### Framer Motion patterns

```tsx
// Fade-in on scroll
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>

// Card hover lift
<motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
```

---

## 11. Dark Mode

Toggle dark mode by adding/removing `.dark-theme` on `<html>` or a wrapper element.

```html
<!-- Enable dark mode -->
<html class="dark-theme">
```

In Tailwind:
```html
<div class="bg-white dark-theme:bg-slate-1 text-gray-900 dark-theme:text-gray-100">
```

---

## 12. Forms

All form inputs are globally styled in `globals.css`:

```html
<input type="text" class="..." />
<!-- appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
     placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 -->
```

---

## 13. Section Patterns

### Section Header (reusable pattern)

```html
<div class="text-center mb-12">
  <!-- Eyebrow label -->
  <div class="inline-flex items-center gap-2 bg-primary-50 border border-primary-100
              text-primary-600 text-xs font-semibold tracking-widest uppercase
              px-4 py-1.5 rounded-full mb-5">
    <span class="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse"></span>
    Section Label
  </div>

  <!-- Heading -->
  <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
    Main Heading with
    <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
      Gradient Highlight
    </span>
  </h2>

  <!-- Sub-text -->
  <p class="text-gray-500 text-lg max-w-2xl mx-auto">
    Supporting description text.
  </p>
</div>
```

### Stats Row

```html
<div class="flex items-stretch divide-x divide-gray-200">
  <div class="px-6 first:pl-0">
    <div class="text-2xl font-bold text-gray-900">50+</div>
    <div class="text-xs uppercase tracking-widest text-gray-400 mt-1">Projects</div>
  </div>
  <!-- repeat... -->
</div>
```

---

## 14. Scrollbar

```css
::-webkit-scrollbar       { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: #e8f1fb; /* secondary-100 */ }
::-webkit-scrollbar-thumb { background: #93c5fd; /* primary-300 */ border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: #60a5fa; /* primary-400 */ }
```

---

## 15. Mobile Utilities

```html
<!-- Hide scrollbar (horizontal scroll strips) -->
<div class="no-scrollbar overflow-x-auto">...</div>

<!-- Touch-friendly tap target (min 44×44px) -->
<button class="touch-target">...</button>

<!-- Touch scroll with snap -->
<div class="overflow-x-auto" style="
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
">
  <div class="flex">
    <div style="scroll-snap-align: start;"><!-- card --></div>
  </div>
</div>
```

---

## 16. Tailwind Plugins Used

| Plugin | Purpose |
|---|---|
| `@tailwindcss/forms` | Normalises and styles form inputs |
| `@tailwindcss/typography` | `.prose` rich-text styles |
| `@tailwindcss/aspect-ratio` | `aspect-w-*` / `aspect-h-*` utilities |

---

## 17. Quick Reference Cheatsheet

```
BACKGROUNDS
  Light section    →  bg-gray-50
  White card       →  bg-white
  Hero / banner    →  bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600
  Dark card        →  bg-gradient-to-b from-primary-800/60 to-gray-900/80

TEXT
  Headings         →  text-gray-900
  Body             →  text-gray-600
  Muted            →  text-gray-400 / text-gray-500
  Primary link     →  text-primary-600 hover:text-primary-700
  Gradient         →  text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500

BORDERS
  Default card     →  border border-primary-100
  Dark card        →  border border-primary-700/40
  Divider          →  border-t border-gray-200

BUTTONS
  Primary          →  bg-primary-500 text-white hover:bg-primary-600
  Accent CTA       →  bg-accent-500 text-white hover:bg-accent-600
  Outline          →  border-2 border-primary-500 text-primary-600 hover:bg-primary-50

ROUNDED
  Cards / sections →  rounded-2xl
  Buttons          →  rounded-lg  (pill: rounded-full)
  Badges           →  rounded-full
  Avatars          →  rounded-full

SHADOWS
  Card default     →  shadow-md
  Card hover       →  hover:shadow-xl
  Button           →  shadow-sm
```
