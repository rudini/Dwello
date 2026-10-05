# Dwello Design System

**Version:** 1.0
**Date:** January 23, 2026
**Status:** Extracted from UX Wireframes
**Framework:** Tailwind CSS + Material Design Icons

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
9. [Dark Mode](#dark-mode)

---

## Color Palette

### Primary Colors

| Name | Hex Code | Usage | Light Mode | Dark Mode |
|------|----------|-------|-----------|-----------|
| **Primary Blue** | `#135bec` | CTAs, active states, primary actions, accents | ✅ Primary | ✅ Primary |
| **Primary Blue Tint** | `#135bec/10` | Background highlight for primary elements | Light background | Dark transparent |

### Background Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| **Background Light** | `#f6f6f8` | Page background (light mode) |
| **Background Dark** | `#101622` | Page background (dark mode) |

### Surface Colors

| Name | Hex Code | Usage | Light Mode | Dark Mode |
|------|----------|-------|-----------|-----------|
| **Surface Light** | `#ffffff` | Cards, panels, surfaces (light mode) | ✅ White | ✅ Surfaces |
| **Surface Dark** | `#1a2230` / `#1a202c` | Cards, panels, surfaces (dark mode) | - | ✅ Dark surfaces |

### Text Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| **Text Dark** | `#111318` | Primary text (light mode) |
| **Text Light** | `#ffffff` | Primary text (dark mode), white text on dark backgrounds |
| **Text Secondary** | `#616f89` | Secondary text, subtitles (light mode) |
| **Text Secondary Dark** | `#9ca3af` / `#9ca3af` | Secondary text (dark mode) |
| **Text Muted** | `#616f89` | Disabled text, hints, placeholders |

### Border Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| **Border Light** | `#dbdfe6` | Borders, dividers (light mode) |
| **Border Slate** | `#f0f2f4` | Light borders, backgrounds (light mode) |
| **Border Dark** | `#2a3441` | Borders (dark mode) |
| **Border Darker** | `#e5e7eb` | Borders |

### Status Colors

| Name | Hex Code | Usage | Component |
|------|----------|-------|-----------|
| **Success/Green** | `#07883b` | Positive status, success indicators | Status badges |
| **Success Light** | `green-100` / `green-50` | Success backgrounds | Light backgrounds |
| **Success Dark** | `green-900/30` | Success backgrounds (dark) | Dark backgrounds |
| **Warning/Amber** | `#fbbf24` / `#f59e0b` | Warnings, pending status | Status badges |
| **Warning Light** | `amber-100` | Warning backgrounds | Light backgrounds |
| **Error/Red** | `#e73908` / `#ef4444` | Errors, danger indicators | Status badges |
| **Error Light** | `red-100` / `red-50` | Error backgrounds | Light backgrounds |
| **Error Dark** | `red-900/20` | Error backgrounds (dark) | Dark backgrounds |
| **Info/Blue** | `#3b82f6` | Information, alerts | Status badges |

### Semantic Color Usage

```
✅ Active/Selected:     Primary Blue (#135bec)
⚠️  Warning:           Amber (#fbbf24)
❌ Error:              Red (#e73908)
✔️  Success:           Green (#07883b)
ℹ️  Info:              Blue (#3b82f6)
○  Inactive/Disabled:  Gray (#616f89, #9ca3af)
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

### Text Styles - Light Mode

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

### Text Styles - Dark Mode

| Component | Color |
|-----------|-------|
| Headings | `#ffffff` (white) |
| Body | `#ffffff` (white) |
| Secondary | `#9ca3af` (gray) |
| Muted | `#616f89` (dimmed) |

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
- Fixed left sidebar, 256px width (`w-64`)
- Sticky to viewport
- Scrollable for long navigation lists
- Bottom section separated with border-top

**States:**

| State | Styling | Usage |
|-------|---------|-------|
| **Active** | `bg-primary text-white` (or `bg-primary/10 border-l-4 border-primary`) | Currently selected nav item |
| **Hover** | `hover:bg-slate-100 dark:hover:bg-slate-800` | Mouse over inactive item |
| **Inactive** | `text-slate-600 dark:text-slate-400` | Default navigation item |
| **Disabled** | `text-slate-400 opacity-50 cursor-not-allowed` | Unavailable item |

**Spacing:**
- Nav items: `px-3 py-2.5` (12px horizontal, 10px vertical)
- Icon-text gap: `gap-3`
- Sidebar padding: `p-4`
- Section spacing: `gap-1` between items, `gap-4` between sections

**Example Structure:**
```
Sidebar (w-64)
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
- Background: `bg-slate-100 dark:bg-slate-800`
- Text: `text-slate-600 dark:text-slate-300`
- Hover: `hover:bg-slate-200 dark:hover:bg-slate-700`
- Border: `border border-slate-300 dark:border-slate-600`
- Padding: `py-2 px-4`

**Icon Button**
- Size: `size-10` (40px x 40px)
- Background: `bg-slate-100 dark:bg-slate-800`
- Icon color: `text-slate-600 dark:text-slate-300`
- Hover: `hover:text-primary hover:bg-primary/10`
- Border radius: `rounded-lg`

**Button States**

| State | Light Mode | Dark Mode |
|-------|-----------|-----------|
| **Default** | `bg-primary text-white` | `bg-primary text-white` |
| **Hover** | `bg-blue-700` | `bg-blue-600` |
| **Active** | `bg-blue-800 shadow-md` | `bg-blue-700 shadow-md` |
| **Disabled** | `bg-slate-300 text-slate-500 cursor-not-allowed` | `bg-slate-600 text-slate-400` |

### 3. Cards

**Standard Card**
- Background: `bg-white dark:bg-surface-dark` (`#ffffff` / `#1a2230`)
- Border: `border border-slate-200 dark:border-slate-700` (1px)
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
- Background: `bg-green-100 dark:bg-green-900/30`
- Text: `text-green-600`
- Padding: `px-2 py-0.5`
- Border radius: `rounded`
- Indicator dot: `w-2 h-2 rounded-full bg-green-500`

**Warning/Pending Badge**
- Background: `bg-amber-100 dark:bg-amber-900/30`
- Text: `text-amber-600`
- Indicator dot: `bg-yellow-500` or `bg-amber-400`

**Error/Vacant Badge**
- Background: `bg-red-100 dark:bg-red-900/30`
- Text: `text-red-600`
- Indicator dot: `bg-red-500`

**Structure:**
```
Badge
├─ Indicator Dot (w-2 h-2 rounded-full)
└─ Text (text-xs font-medium)
```

### 5. Input Fields

**Text Input**
- Background: `bg-slate-100 dark:bg-slate-800`
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
- Background: `bg-slate-100 dark:bg-slate-800`
- Text: `text-slate-600 dark:text-slate-300`
- Hover: `hover:bg-slate-200 dark:hover:bg-slate-700`

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
- Hover: `hover:bg-slate-50 dark:hover:bg-slate-800/50`

### 8. Activity Feed Items

**Activity Item**
- Container: `flex gap-4 p-4`
- Icon container: `size-10 rounded-full flex items-center justify-center`
- Content: `flex flex-col flex-1 gap-1`
- Text styles:
  - Title: `text-sm font-bold`
  - Description: `text-xs text-slate-500`
  - Timestamp: `text-[10px] text-slate-400 font-medium`
- Hover: `hover:bg-slate-50 dark:hover:bg-slate-800/50`
- Divider: `divide-y divide-slate-100 dark:divide-slate-800`

**Icon Background Colors:**
- Success: `bg-green-100 dark:bg-green-900/20` with `text-green-600`
- Error: `bg-red-100 dark:bg-red-900/20` with `text-red-600`
- Info: `bg-blue-100 dark:bg-blue-900/20` with `text-blue-600`
- Warning: `bg-amber-100 dark:bg-amber-900/20` with `text-amber-600`

### 9. Modal/Overlay Patterns

**Modal Header**
- Padding: `px-6 py-4` or `p-6`
- Border bottom: `border-b border-slate-100 dark:border-slate-800`
- Title: `text-lg font-bold`
- Close button: Top right corner

**Modal Content**
- Padding: `p-6`
- Scrollable if needed: `overflow-y-auto`

**Modal Actions**
- Footer border: `border-t border-slate-100 dark:border-slate-800`
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
- Class: `material-symbols-outlined`
- Default settings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`

### Icon Sizes

| Size | Value | Usage |
|------|-------|-------|
| Small | `text-[16px]` | 16px icons (badges, side icons) |
| Standard | `text-[20px]` | 20px icons (nav items) |
| Large | `text-[24px]` | 24px icons (feature icons) |
| XL | `text-[28px]` | 28px icons (hero icons) |
| XXL | `text-3xl` (30px) | 30px icons (large features) |

### Icon States

**Normal Icon:**
- Class: `material-symbols-outlined`
- Default fill: 0 (outline)

**Filled Icon:**
- Class: `material-symbols-outlined icon-filled`
- Variation: `'FILL' 1` (solid)

**Icon Weight Variations:**
- Light: `'wght' 200`
- Regular: `'wght' 400` (default)
- Bold: `'wght' 600`

### Icon + Text Layout

```
flex items-center gap-3
├─ Icon (text-[20px])
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

| Element | Light Mode | Dark Mode | Ratio |
|---------|-----------|-----------|-------|
| Primary text on white | #111318 on #ffffff | #ffffff on #1a2230 | 12.6:1 |
| Primary text on primary | #ffffff on #135bec | #ffffff on #135bec | 7.8:1 |
| Secondary text | #616f89 on #ffffff | #9ca3af on #1a2230 | 6.5:1 |
| Placeholder text | #9ca3af on #f6f6f8 | #616f89 on #101622 | 5.2:1 |

### Touch Targets

- Minimum size: `40px` (40x40px or larger)
- Padding around interactive elements: `4px` minimum
- Examples:
  - Buttons: `h-10` (40px), `h-12` (48px)
  - Icon buttons: `size-10` (40x40px)
  - Link targets: `p-2` or larger

---

## Dark Mode

### Implementation

**Method:** CSS Class-based (`darkMode: "class"`)
- Applied to `<html>` element: `class="light"` or `class="dark"`
- User can toggle between modes
- Preference persists in localStorage

### Dark Mode Colors

**Backgrounds:**
- Page: `dark:bg-background-dark` (#101622)
- Surfaces: `dark:bg-surface-dark` (#1a2230)
- UI elements: `dark:bg-slate-800`

**Text:**
- Primary: `dark:text-white`
- Secondary: `dark:text-slate-400` / `dark:text-gray-400`
- Muted: `dark:text-slate-500` / `dark:text-gray-500`

**Borders:**
- Primary: `dark:border-slate-700` / `dark:border-gray-700`
- Secondary: `dark:border-slate-800` / `dark:border-gray-800`

**Shadows:**
- Reduced opacity: `dark:shadow-lg dark:shadow-black/20`

### Component Overrides

```html
<!-- Example: Card that adapts to dark mode -->
<div class="bg-white dark:bg-surface-dark
            text-slate-900 dark:text-white
            border border-slate-200 dark:border-slate-700
            shadow-sm dark:shadow-md">
  Content
</div>
```

### Transition Effects

- Add smooth transitions: `transition-colors`
- Applies to: Backgrounds, text colors, borders
- Duration: `duration-200` (default)

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
<div class="text-slate-600 dark:text-slate-400">
  Secondary text
</div>

<!-- Status indicators -->
<span class="text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">
  Active
</span>
```

#### 2. Typography
```html
<!-- Page title -->
<h1 class="text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
  Page Title
</h1>

<!-- Card title -->
<h3 class="text-lg font-bold text-slate-900 dark:text-white">
  Card Title
</h3>

<!-- Body text -->
<p class="text-sm font-normal text-slate-600 dark:text-slate-400">
  Description text
</p>
```

#### 3. Cards
```html
<div class="bg-white dark:bg-surface-dark
            rounded-xl border border-slate-200 dark:border-slate-700
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
               dark:bg-slate-800 dark:hover:bg-slate-700
               text-slate-900 dark:text-white
               border border-slate-300 dark:border-slate-600
               py-2 px-4 rounded-lg transition-colors">
  Secondary Action
</button>

<!-- Icon button -->
<button class="size-10 rounded-lg
               bg-slate-100 dark:bg-slate-800
               text-slate-600 dark:text-slate-300
               hover:text-primary hover:bg-primary/10
               transition-colors">
  <span class="material-symbols-outlined">edit</span>
</button>
```

#### 5. Inputs
```html
<label class="flex items-center w-full h-10
              bg-slate-100 dark:bg-slate-800
              rounded-lg px-3 gap-3
              focus-within:ring-2 focus-within:ring-primary/50
              transition-all">
  <span class="material-symbols-outlined text-slate-600">search</span>
  <input class="w-full bg-transparent border-none
                text-sm text-slate-900 dark:text-white
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
- [x] Dark Mode (Implementation, colors)
- [x] Accessibility (Focus, contrast, ARIA)

---

## Resources

### Fonts
- **Manrope:** https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap
- **Material Symbols:** https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap

### CSS Framework
- **Tailwind CSS:** https://tailwindcss.com
- **Version Used:** Latest (from CDN)

### Color References
- **Material Design Colors:** https://material.io/design/color/
- **Tailwind Default Palette:** https://tailwindcss.com/docs/customization/colors

### Accessibility
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

**Last Updated:** January 23, 2026
**Design System Version:** 1.0
**Status:** Ready for Implementation
