# Dwello Design System

**Version:** 1.1
**Date:** January 23, 2026 (corrected against the code: October 2026)
**Status:** Extracted from UX wireframes, colors checked against `tailwind.config.js` and `src/styles/globals.css`
**Framework:** Tailwind CSS 3 + Material Symbols

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [UI Components](#ui-components)
4. [Spacing & Layout](#spacing--layout)
5. [Shadows & Elevation](#shadows--elevation)
6. [Border Radius](#border-radius)
7. [Icons](#icons)
8. [Accessibility](#accessibility)
9. [Not Implemented](#not-implemented)

---

## Color Palette

### Design Tokens (source of truth)

Custom colors in `tailwind.config.js` (`theme.extend.colors`), usable as Tailwind classes (`bg-primary`, `text-text-dark`, ...):

| Token | Hex Code | Usage |
|-------|----------|-------|
| `primary` | `#135bec` | CTAs, active states, primary actions, accents (tint: `bg-primary/10`) |
| `success` | `#10b981` | Positive status |
| `text-dark` | `#111318` | Primary text |
| `text-secondary` | `#616f89` | Secondary text, subtitles |
| `border-light` | `#dbdfe6` | Borders, dividers |

CSS custom properties in `src/styles/globals.css` (`:root`):

| Variable | Hex Code |
|----------|----------|
| `--color-primary` | `#135bec` |
| `--color-secondary` | `#616f89` |
| `--color-success` | `#10b981` |
| `--color-warning` | `#f59e0b` |
| `--color-error` | `#ef4444` |
| `--color-text-dark` | `#111318` |
| `--color-border-light` | `#dbdfe6` |

There are no custom tokens for backgrounds or surfaces; components use Tailwind defaults (`bg-white`, `bg-gray-50`). Neutral colors come mostly from the Tailwind `gray` palette (`slate` appears in a few places).

### Status Colors (as used in `Badge.svelte` / `StatusBadge.svelte`)

Status badges use Tailwind default colors rather than the tokens above:

| Status | Background | Text | Dot |
|--------|-----------|------|-----|
| Success | `bg-green-100` | `text-green-700` | `bg-green-500` |
| Warning | `bg-amber-100` | `text-amber-700` | `bg-amber-500` |
| Error / Danger | `bg-red-100` | `text-red-700` | `bg-red-500` |
| Info | `bg-blue-100` | `text-blue-700` | `bg-blue-500` |
| Neutral | `bg-gray-100` / `bg-slate-100` | `text-gray-700` / `text-slate-600` | `bg-slate-400` |
| Primary | `bg-primary/10` | `text-primary` | - |

### Semantic Color Usage

```
Active/Selected:     Primary Blue (#135bec)
Warning:             Amber (#f59e0b, amber-*)
Error:               Red (#ef4444, red-*)
Success:             Green (#10b981, green-*)
Info:                Blue (blue-*)
Inactive/Disabled:   Gray (#616f89, gray-*)
```

---

## Typography

### Font Family

**Primary Font:** Manrope (sans-serif)
- Google Fonts: `https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap`
- Weights: 400 (Regular), 500 (Medium), 700 (Bold), 800 (Black)
- Character set: Latin extended

### Font Weights

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Body text, standard UI elements |
| 500 | Medium | Secondary text, form labels |
| 700 | Bold | Headings, card titles, emphasis |
| 800 | Black | Page titles, major headings |

### Text Styles

| Component | Size | Weight | Color | Line Height | Letter Spacing | Usage |
|-----------|------|--------|-------|-------------|----------------|-------|
| **H1 - Page Title** | 2.25rem (36px) | 800 (Black) | `#111318` | 1.25 (tight) | -0.033em | Primary page headers |
| **H2 - Section Title** | 1.875rem (30px) | 800 (Black) | `#111318` | 1.25 (tight) | -0.033em | Section headings |
| **H3 - Card Title** | 1.125rem (18px) | 700 (Bold) | `#111318` | 1.25 (tight) | normal | Card titles, subsections |
| **H4 - Component Title** | 1rem (16px) | 700 (Bold) | `#111318` | 1.25 (tight) | normal | Component headings |
| **Body - Large** | 1rem (16px) | 400 (Regular) | `#111318` | 1.5 (normal) | normal | Large body text |
| **Body - Standard** | 0.875rem (14px) | 400 (Regular) | `#111318` | 1.5 (normal) | normal | Standard body text |
| **Body - Small** | 0.75rem (12px) | 400 (Regular) | `#616f89` | 1.5 (normal) | normal | Secondary text, captions |
| **Label** | 0.75rem (12px) | 500 (Medium) | `#616f89` | normal | 0.05em (wider) | Form labels, UI labels |
| **Caption/XS** | 0.625rem (10px) | 400 (Regular) | `#616f89` | 1.25 (tight) | normal | Timestamps, helper text |

### Visual Hierarchy

```
Page Title (H1)
  ├─ 36px / 800 weight
  ├─ Primary text color
  └─ Used once per page

Section Title (H2)
  ├─ 30px / 800 weight
  ├─ Primary text color
  └─ Major section breaks

Card Title (H3)
  ├─ 18px / 700 weight
  ├─ Primary text color
  └─ Content cards

Body Text
  ├─ 14-16px / 400 weight
  ├─ Primary text color
  └─ Readable, scannable

Secondary Text
  ├─ 12-14px / 400-500 weight
  ├─ Gray color (#616f89)
  └─ Subtitles, descriptions

Labels/UI Text
  ├─ 12px / 500 weight
  ├─ Secondary gray color
  └─ Form labels, badges

Captions/Timestamps
  ├─ 10px / 400 weight
  ├─ Muted gray color
  └─ Timestamps, metadata
```

---

## UI Components

### 1. Sidebar Navigation

**Structure:**
- Left sidebar, 240px width (`w-60`), `sticky top-16` below the header
- Sticky to viewport
- Scrollable for long navigation lists
- Bottom section separated with border-top

**States:**

| State | Styling | Usage |
|-------|---------|-------|
| **Active** | `bg-primary text-white` (or `bg-primary/10 border-l-4 border-primary`) | Currently selected nav item |
| **Hover** | `hover:bg-slate-100` | Mouse over inactive item |
| **Inactive** | `text-slate-600` | Default navigation item |
| **Disabled** | `text-slate-400 opacity-50 cursor-not-allowed` | Unavailable item |

**Spacing:**
- Nav items: `px-3 py-2.5` (12px horizontal, 10px vertical)
- Icon-text gap: `gap-3`
- Sidebar padding: `p-4`
- Section spacing: `gap-1` between items, `gap-4` between sections

**Example Structure:**
```
Sidebar (w-60)
├─ Header (p-4, border-b)
│  ├─ Logo icon (size-10)
│  └─ Brand name (text-base font-bold)
├─ Navigation (flex-1, py-4 px-3, flex flex-col gap-1)
│  ├─ Nav Item (flex items-center gap-3, px-3 py-2.5)
│  └─ ...more items
└─ Footer (p-4, border-t)
   └─ User info or settings
```

### 2. Buttons

**Primary Button**
- Background: `bg-primary` (`#135bec`)
- Hover: `hover:bg-blue-700`
- Text: `text-white` with `font-bold`
- Padding: `py-2.5 px-4` or `py-3 px-6` (based on size)
- Border radius: `rounded-lg` (8px)
- Transition: `transition-colors`
- Shadow: `shadow-sm shadow-primary/30`
- Size: `h-10` (40px) to `h-12` (48px)

**Secondary Button**
- Background: `bg-slate-100`
- Text: `text-slate-600`
- Hover: `hover:bg-slate-200`
- Border: `border border-slate-300`
- Padding: `py-2 px-4`

**Icon Button**
- Size: `size-10` (40px x 40px)
- Background: `bg-slate-100`
- Icon color: `text-slate-600`
- Hover: `hover:text-primary hover:bg-primary/10`
- Border radius: `rounded-lg`

**Button States**

| State | Classes |
|-------|---------|
| **Default** | `bg-primary text-white` |
| **Hover** | `bg-blue-700` |
| **Active** | `bg-blue-800 shadow-md` |
| **Disabled** | `bg-slate-300 text-slate-500 cursor-not-allowed` |

### 3. Cards

**Standard Card**
- Background: `bg-white` (`#ffffff`)
- Border: `border border-slate-200` (1px)
- Border radius: `rounded-xl` (12px)
- Padding: `p-5` or `p-6`
- Shadow: `shadow-sm`
- Hover: `hover:shadow-md transition-all`

**Card with Image**
- Image container height: `h-48` (192px)
- Image overlay: `absolute inset-0`
- Image zoom on hover: `group-hover:scale-105 transition-transform`
- Status badge: Absolute positioned `top-3 right-3`

**Stat Card**
- Padding: `p-5` or `p-6`
- Grid layout: `grid grid-cols-2 gap-3`
- Icon background: `bg-primary/10`
- Icon: Material Symbols, 20px-24px

**Example Structure:**
```
Card
├─ Image Container (h-48, relative)
│  ├─ Image (absolute inset-0)
│  ├─ Status Badge (absolute top-3 right-3)
│  └─ Action Button (absolute bottom-3 right-3)
├─ Content Container (p-5 flex flex-col gap-4)
│  ├─ Title (text-lg font-bold)
│  ├─ Subtitle (text-sm text-gray-500)
│  ├─ Stats Grid (grid grid-cols-2 gap-3)
│  │  ├─ Stat 1 (flex flex-col)
│  │  └─ Stat 2 (flex flex-col)
│  └─ Actions (flex gap-2)
│     ├─ Primary Button (flex-1)
│     └─ Icon Button (h-9 w-9)
```

### 4. Status Badges

**Active/Success Badge**
- Background: `bg-green-100`
- Text: `text-green-700`
- Padding: `px-2 py-0.5`
- Border radius: `rounded`
- Indicator dot: `w-2 h-2 rounded-full bg-green-500`

**Warning/Pending Badge**
- Background: `bg-amber-100`
- Text: `text-amber-700`
- Indicator dot: `bg-amber-500`

**Error/Vacant Badge**
- Background: `bg-red-100`
- Text: `text-red-700`
- Indicator dot: `bg-red-500`

**Structure:**
```
Badge
├─ Indicator Dot (w-2 h-2 rounded-full)
└─ Text (text-xs font-medium)
```

### 5. Input Fields

**Text Input**
- Background: `bg-slate-100`
- Border: `border-none` with `ring-1 ring-slate-300`
- Height: `h-10` or `h-11`
- Padding: `px-3 py-2.5` (12px left/right)
- Border radius: `rounded-lg`
- Focus: `focus:ring-2 focus:ring-primary`
- Placeholder: `placeholder:text-slate-500`

**Search Input**
- Icon left: `pl-10` with icon positioned `absolute inset-y-0 left-0 pl-3`
- Width: `w-full` or `max-w-64`
- Focus ring: `focus-within:ring-2 focus-within:ring-primary/50`

### 6. Filter/Chip Buttons

**Active Chip**
- Background: `bg-primary`
- Text: `text-white`
- Padding: `px-3 py-1.5`

**Inactive Chip**
- Background: `bg-slate-100`
- Text: `text-slate-600`
- Hover: `hover:bg-slate-200`

**Chip with Icon**
- Gap between icon and text: `gap-2`
- Indicator dot: `size-2 rounded-full` (small colored circle)

### 7. Tables

**Header Row**
- Sticky: `sticky top-0 z-10`
- Text: `text-xs font-semibold uppercase tracking-wider`
- Color: `text-slate-500`
- Border: `border-b border-slate-200`
- Padding: `py-3 px-2`

**Data Row**
- Padding: `py-4 px-2`
- Border: `border-b border-slate-200`
- Hover: `hover:bg-slate-50`

### 8. Activity Feed Items

**Activity Item**
- Container: `flex gap-4 p-4`
- Icon container: `size-10 rounded-full flex items-center justify-center`
- Content: `flex flex-col flex-1 gap-1`
- Text styles:
  - Title: `text-sm font-bold`
  - Description: `text-xs text-slate-500`
  - Timestamp: `text-[10px] text-slate-400 font-medium`
- Hover: `hover:bg-slate-50`
- Divider: `divide-y divide-slate-100`

**Icon Background Colors:**
- Success: `bg-green-100` with `text-green-600`
- Error: `bg-red-100` with `text-red-600`
- Info: `bg-blue-100` with `text-blue-600`
- Warning: `bg-amber-100` with `text-amber-600`

### 9. Modal/Overlay Patterns

**Modal Header**
- Padding: `px-6 py-4` or `p-6`
- Border bottom: `border-b border-slate-100`
- Title: `text-lg font-bold`
- Close button: Top right corner

**Modal Content**
- Padding: `p-6`
- Scrollable if needed: `overflow-y-auto`

**Modal Actions**
- Footer border: `border-t border-slate-100`
- Button layout: `flex justify-end gap-2 p-4`

---

## Spacing & Layout

### Padding Scale

| Class | Value | Usage |
|-------|-------|-------|
| `p-1` | 4px | Very tight spacing |
| `p-2` | 8px | Tight spacing |
| `p-3` | 12px | Compact spacing |
| `p-4` | 16px | Standard spacing |
| `p-5` | 20px | Content padding |
| `p-6` | 24px | Card padding |
| `p-8` | 32px | Large padding, sections |

**Directional Padding:**
- `px-*` = horizontal (left/right)
- `py-*` = vertical (top/bottom)
- `pl-*` = left only
- `pr-*` = right only
- `pt-*` = top only
- `pb-*` = bottom only

**Example Usage:**
- Sidebar: `p-4`
- Cards: `p-5` or `p-6`
- Page sections: `p-6` or `p-8`
- Button padding: `py-2.5 px-4`

### Gap (Margin between children)

| Class | Value | Usage |
|-------|-------|-------|
| `gap-1` | 4px | Very tight gaps (nav items) |
| `gap-2` | 8px | Compact gaps (buttons) |
| `gap-3` | 12px | Standard gaps (nav items, flex items) |
| `gap-4` | 16px | Comfortable gaps (sections) |
| `gap-6` | 24px | Large gaps (major sections) |

**Example Usage:**
- Navigation items: `gap-1`
- Icon + text: `gap-3`
- Card elements: `gap-2` to `gap-4`
- Page sections: `gap-6` to `gap-8`

### Container Max-Width

- `max-w-7xl` = 80rem (1280px) - Main dashboard content
- `max-w-[1200px]` = Explicit 1200px for certain pages

### Grid Layout

**Responsive Grids:**
```
1 column:  grid-cols-1 (mobile)
2 columns: md:grid-cols-2 (tablet)
3 columns: lg:grid-cols-3 (desktop)
4 columns: xl:grid-cols-4 (large desktop)
```

**Common Grid Patterns:**
- Stats row: `grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4`
- Properties: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6`
- Buttons/Actions: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`

### Page Structure

```
Body
├─ Header/TopNav (py-3 px-6/px-10)
├─ Main Container
│  └─ Page Content (p-6 md:p-8)
│     ├─ Page Title (mb-6)
│     ├─ Stats Row (mb-6)
│     ├─ Filters (mb-4)
│     └─ Content Grid (pb-8)
```

---

## Shadows & Elevation

### Shadow Scale

| Class | CSS | Usage |
|-------|-----|-------|
| `shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` | Default cards, subtle elevation |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Hover state, medium elevation |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Modals, high elevation |
| `shadow-primary/30` | Primary blue shadow | CTA buttons |

**Usage Examples:**
- Default cards: `shadow-sm`
- Hover state: `hover:shadow-md transition-all`
- Buttons: `shadow-sm shadow-primary/30`
- Modals: `shadow-lg`

---

## Border Radius

### Radius Scale (Tailwind Config)

| Class | Value | Usage |
|-------|-------|-------|
| `rounded` (default) | 0.25rem (4px) | Small elements, input fields |
| `rounded-lg` | 0.5rem (8px) | Buttons, smaller cards |
| `rounded-xl` | 0.75rem (12px) | Cards, modal panels |
| `rounded-full` | 9999px | Avatars, badges, pill buttons |

**Examples:**
- Input fields: `rounded-lg`
- Buttons: `rounded-lg`
- Cards: `rounded-xl`
- Avatars: `rounded-full size-10`
- Badges: `rounded` or `rounded-lg`
- Status dots: `rounded-full size-2`

---

## Icons

### Icon Library

**Material Symbols Outlined** (Google Fonts)
- Stylesheet: `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap`
- Loaded in `src/styles/globals.css`
- Component: `src/lib/components/Icon.svelte` (`<Icon name="edit" size={20} />`), renders a `material-symbols-outlined` span, `aria-hidden` by default
- Default settings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`

### Icon Sizes

Set with the `size` prop of `Icon.svelte` (pixels, default 24):

| Size | Value | Usage |
|------|-------|-------|
| Small | `16` | Badges, side icons |
| Standard | `20` | Nav items |
| Large | `24` (default) | Feature icons |
| XL | `28` | Hero icons |

### Icon States

Only the outlined style (`'FILL' 0`, `'wght' 400`) is used; there is no filled or weight variant class.

### Icon + Text Layout

```
flex items-center gap-3
├─ Icon (size 20)
└─ Text (text-sm font-medium)
```

### Common Icons Used

| Icon | Usage |
|------|-------|
| `dashboard` | Dashboard navigation |
| `apartment` / `domain` | Buildings/properties |
| `group` / `groups` | Tenants/people |
| `payments` / `receipt_long` | Invoices/finances |
| `edit` | Edit action |
| `delete` | Delete action |
| `search` | Search functionality |
| `settings` | Settings |
| `add` / `add_business` | Add/create action |
| `map` | Location/map view |
| `trending_up` / `arrow_upward` | Positive trend |
| `warning` / `priority_high` | Warning status |
| `check_circle` | Success status |
| `person_add` | User added |
| `build` | Maintenance/repair |

---

## Accessibility

### Focus States

**Keyboard Navigation:**
- Focus ring: `focus:ring-2 focus:ring-primary`
- Ring offset: Standard (transparent)
- Applied to: Buttons, inputs, interactive elements

**Visual Indicators:**
- Color: Primary blue (#135bec)
- Ring width: 2px
- Contrast ratio: WCAG AA compliant (4.5:1 minimum)

### ARIA Attributes

**Examples:**
- `aria-label="Delete"` - Icon-only buttons
- `aria-hidden="true"` - Decorative icons
- `role="button"` - Custom button elements
- `aria-expanded="true/false"` - Expandable sections

### Color Contrast

| Element | Colors | Ratio |
|---------|--------|-------|
| Primary text on white | #111318 on #ffffff | 18.6:1 |
| White text on primary | #ffffff on #135bec | 5.6:1 |
| Secondary text | #616f89 on #ffffff | 5.1:1 |

### Touch Targets

- Minimum size: `40px` (40x40px or larger)
- Padding around interactive elements: `4px` minimum
- Examples:
  - Buttons: `h-10` (40px), `h-12` (48px)
  - Icon buttons: `size-10` (40x40px)
  - Link targets: `p-2` or larger

---

## Not Implemented

- **Dark mode:** not implemented. `tailwind.config.js` sets no `darkMode`, and no component uses `dark:` classes. The earlier wireframe colors for dark mode (`#101622`, `#1a2230`, `#2a3441`) are not part of the code.

---

## Implementation Guide

### Using this Design System

#### 1. Color Usage
```html
<!-- Primary actions -->
<button class="bg-primary hover:bg-blue-700 text-white">
  Action
</button>

<!-- Secondary elements -->
<div class="text-slate-600">
  Secondary text
</div>

<!-- Status indicators -->
<span class="text-green-700 bg-green-100 px-2 py-0.5 rounded">
  Active
</span>
```

#### 2. Typography
```html
<!-- Page title -->
<h1 class="text-4xl font-black text-slate-900 leading-tight tracking-tight">
  Page Title
</h1>

<!-- Card title -->
<h3 class="text-lg font-bold text-slate-900">
  Card Title
</h3>

<!-- Body text -->
<p class="text-sm font-normal text-slate-600">
  Description text
</p>
```

#### 3. Cards
```html
<div class="bg-white
            rounded-xl border border-slate-200
            shadow-sm hover:shadow-md transition-all
            p-6 flex flex-col gap-4">
  <!-- Card content -->
</div>
```

#### 4. Buttons
```html
<!-- Primary button -->
<button class="bg-primary hover:bg-blue-700 text-white
               font-bold py-2.5 px-4 rounded-lg
               transition-colors shadow-sm shadow-primary/30">
  Primary Action
</button>

<!-- Secondary button -->
<button class="bg-slate-100 hover:bg-slate-200
               text-slate-900
               border border-slate-300
               py-2 px-4 rounded-lg transition-colors">
  Secondary Action
</button>

<!-- Icon button -->
<button class="size-10 rounded-lg
               bg-slate-100
               text-slate-600
               hover:text-primary hover:bg-primary/10
               transition-colors">
  <Icon name="edit" />
</button>
```

#### 5. Inputs
```html
<label class="flex items-center w-full h-10
              bg-slate-100
              rounded-lg px-3 gap-3
              focus-within:ring-2 focus-within:ring-primary/50
              transition-all">
  <span class="material-symbols-outlined text-slate-600">search</span>
  <input class="w-full bg-transparent border-none
                text-sm text-slate-900
                placeholder:text-slate-500 focus:ring-0"
         placeholder="Search..." />
</label>
```

---

## Component Library Checklist

- [x] Color Palette (Primary, Secondary, Status, Semantic)
- [x] Typography (Font family, weights, sizes, hierarchy)
- [x] Buttons (Primary, Secondary, Icon, States)
- [x] Cards (Standard, Image, Stat, Activity)
- [x] Inputs (Text, Search, Filters)
- [x] Navigation (Sidebar, Top nav)
- [x] Icons (Material Symbols, sizing, states)
- [x] Spacing (Padding, Gap, Layout)
- [x] Shadows (Elevation levels)
- [x] Border Radius (Scale)
- [ ] Dark Mode (not implemented)
- [x] Accessibility (Focus, contrast, ARIA)

---

## Resources

### Fonts
- **Manrope:** https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap
- **Material Symbols:** https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap

### CSS Framework
- **Tailwind CSS:** https://tailwindcss.com
- **Version Used:** Tailwind CSS 3 (npm, `tailwind.config.js`)

### Color References
- **Material Design Colors:** https://material.io/design/color/
- **Tailwind Default Palette:** https://tailwindcss.com/docs/customization/colors

### Accessibility
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

**Last Updated:** October 2026
**Design System Version:** 1.1
