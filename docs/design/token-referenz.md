# Token reference

All design values live in `src/styles/tokens.css` and reach components through the Tailwind names below (`tailwind.config.js`). Components never use raw colours, the old Tailwind palette, arbitrary values or other radii/shadows; `src/__tests__/design-guard.test.ts` enforces it, `src/__tests__/tokens.test.ts` checks the contrast ratios.

## Colour

| Tailwind | CSS variable | Light | Dark (from stage 8) | Use |
|---|---|---|---|---|
| `canvas` | `--color-canvas` | `#F5F7F8` | `#111518` | page background |
| `surface` | `--color-surface` | `#FFFFFF` | `#1A1F23` | panels, inputs, dialogs |
| `sunken` | `--color-sunken` | `#EBEFF2` | `#242B30` | table heads, muted areas, disabled fields |
| `line` | `--color-line` | `#D3DAE0` | `#3A444C` | decorative dividers and panel borders only |
| `line-strong` | `--color-line-strong` | `#68747F` | `#8693A0` | input, checkbox and secondary button borders (≥ 3:1) |
| `ink` | `--color-ink` | `#161C21` | `#ECEFF2` | text |
| `ink-muted` | `--color-ink-muted` | `#3F4A54` | `#B4BEC7` | secondary text, help texts (≥ 7:1) |
| `accent` | `--color-accent` | `#1B5873` | `#86BFDA` | primary buttons, links, active navigation |
| `accent-strong` | `--color-accent-strong` | `#123F54` | `#B3D8EA` | hover, text on `accent-soft` |
| `accent-soft` | `--color-accent-soft` | `#E3EEF3` | `#172C37` | selected and info backgrounds |
| `on-accent` | `--color-on-accent` | `#FFFFFF` | `#0D1A20` | text on `accent`/`critical` |
| `positive`, `positive-soft` | `--color-positive(-soft)` | `#17542E` / `#E3F1E7` | `#8FD1A5` / `#1C3326` | success |
| `caution`, `caution-soft` | `--color-caution(-soft)` | `#663E00` / `#FBF0DC` | `#F0C27A` / `#3A2C14` | warnings, plausibility checks |
| `critical`, `critical-soft` | `--color-critical(-soft)` | `#8A1C24` / `#FAE6E7` | `#F4A3A8` / `#3D1D20` | errors, destructive actions |
| `focus` | `--color-focus` | `#1B5873` | `#F0C27A` | focus outline |
| `scrim` | `--color-scrim` | `rgb(22 28 33 / .6)` | same | behind dialogs and the mobile menu |

Tailwind opacity modifiers (`bg-accent/10`) do not work with these variables and are not used.

## Type

| Class | Size | Use |
|---|---|---|
| `text-sm` | 14 px | badges and navigation group labels only |
| `text-base` | 16 px | body, inputs, help texts, buttons (default) |
| `text-lg` | 18 px | page purpose, table captions |
| `text-xl` | 20 px | panel and dialog titles |
| `text-2xl` | 24 px | section titles |
| `text-3xl` | 30 px | page title (h1) |

Font: Inter Variable (`@fontsource-variable/inter`, bundled). Line height 1.5 for text (`--leading-text`), `leading-tight` (1.25) for headings. Amounts, dates and tables use `tabular-nums`.

## Space, shape, depth, motion

| Token | Value | Tailwind |
|---|---|---|
| spacing | 8 px grid: steps 1 (4 px, inside controls only), 2, 4, 6, 8, 10, 12, 16, 20, 24 | `p-4`, `gap-6`, … |
| `--size-control` | 48 px | `min-h-12`, `size-12` (buttons, inputs, icon buttons, rows) |
| `--size-header` | 64 px | header height `h-16`; `max-h-below-header` (sticky sidebar) |
| `--radius-control` | 6 px | `rounded-control` (controls, badges, small surfaces) |
| `--radius-panel` | 12 px | `rounded-panel` (panels, dialogs, tables) |
| `--shadow-raised` | `0 2px 8px rgb(0 0 0 / .12)` | `shadow-raised` (menus, toasts) |
| `--shadow-overlay` | `0 12px 32px rgb(0 0 0 / .24)` | `shadow-overlay` (dialogs, drawer) |
| `--duration-fast` | 150 ms | `duration-fast`; `prefers-reduced-motion` turns all motion off |
| focus | `3px solid var(--color-focus)`, offset 2 px | global `:focus-visible` |
| `--illu-line`, `--illu-fill`, `--illu-accent` | ink-muted, sunken, accent | illustrations |
