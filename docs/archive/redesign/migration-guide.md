# Migration guide (stage 7)

How a legacy screen moves to the new design system. Read together with `CLAUDE.md`, `docs/design/arbeitsregeln.md` and `docs/design/01-plan.md`.

## Rules

- A migrated file uses only `src/lib/ui/*` components and the token classes (`text-ink`, `text-ink-muted`, `bg-surface`, `bg-sunken`, `border-line`, `border-line-strong`, `text-accent`, `bg-accent`, `text-critical`, `text-caution`, `text-positive`, `rounded-control`, `rounded-panel`, `shadow-raised`, spacing on the 8 px grid: 2, 4, 6, 8, 10, 12 …). No `gray-*`, `blue-*`, `red-*`, `primary`, arbitrary values (`w-[…]`), `text-xs`, or imports from `$lib/components/*` (the old design system). `src/__tests__/design-guard.test.ts` checks every file under `src/` (no exception list since stage 8).
- The old `src/lib/components/` folder is gone (stage 8). A screen that needs a part builds it from `src/lib/ui` or as a small component in its own route folder.
- Keep every `data-testid` that E2E tests use (`grep -rn "getByTestId('…')" tests/e2e`). Behaviour that changes on purpose: change the Gherkin scenario first (ATDD) and the E2E driver layers (`tests/e2e/{steps,tasks,interactions,questions}`).
- No business logic, data model, migration, seed or CI changes. UI-only aggregation in `+page.server.ts` and BFF mapping are fine.
- German UI copy, formal "Sie", Swiss "ss"; domain terms exactly from `UBIQUITOUS_LANGUAGE.md` (never edit it). Missing terms: `TODO(fachlich prüfen)` + entry in `docs/design/offene-punkte.md`. One name per thing: "Verwaltungspauschale" (not "Verwaltungsgebühr"/"Verwaltungskosten"), "Akonto", "Mietstage", "Korrespondenzkanal".
- Master data names: categories, distribution keys and heating profiles carry `nameDE`; show `germanName(record)` from `$lib/names` everywhere they are displayed.
- Dates: `formatDate` (de-CH, "1.1.2025"), long form `formatDateLong`; amounts `formatCurrency` (CHF 1’234.50). Plural/singular right ("1 Abrechnung").

## Components (src/lib/ui)

- Page frame: `PageHeader` (`title`, `purpose`, `trail` breadcrumb with `data-testid="breadcrumb-link"`, `action` snippet), `Panel` (`title`, `level`), `Tabs`.
- Actions: `Button` (`variant` primary/secondary/ghost/danger/danger-ghost, `icon`, `href`, `busy`, `busyLabel`, `target="_blank"`, `testid`), `IconButton` (needs `label`). One primary action per screen.
- Forms: `TextInput`, `MoneyInput`, `Select`, `EarlySelect` (a select whose choice made before hydration is kept, for filters and forms that work without JavaScript), `Textarea`, `Checkbox`, `RadioGroup`, `Field` (custom control) – each with `label`, `help`, `example`, `error`, `optional`, `testid`. Errors appear as `data-testid="form-error"` and are tied to the field.
- Feedback: `Alert` (tone info/positive/caution/critical, `title`, `action` snippet), `Badge` (tone, `label`), `EmptyState` (`title`, `text`, `actionLabel`, `actionHref`, `illustration`), toasts via `addToast` from `$lib/stores`, `SaveStatus`, `ProgressBar`.
- Overlays: `Dialog` (confirmation with `confirmLabel`, `danger`, `busy`, `confirmTestid`; focus trap and Escape built in).
- Lists: `Table` (`caption`, `columns`, rows as children) for wide screens; on phones (below `md`) show the same records as a list of cards/rows without sideways scrolling. A whole row/card is one link (the name is the link text; avoid "Ansehen" links that do not name the record).
- Icons: `Icon` with names from `src/lib/ui/icons.ts`; illustrations: `Illustration` / `EmptyState` with names from `src/lib/ui/illustrations`.

## Accessibility (WCAG 2.2 AA)

Every control 48 px high (`min-h-12`), visible focus (global), headings in order (one `h1` from `PageHeader`), labels and errors tied to fields, status texts as `role="status"`, no information by colour alone. The axe check (`tests/e2e/features/accessibility.feature` + `tests/a11y/screens.json`) must stay at 0 violations; new states go into both files (`tests/unit/a11y-screens.test.ts` checks they match).

## Tests and checks

- TDD (`/tdd`): DOM tests (`src/__tests__/*.dom.test.ts`, jsdom) or SSR render tests for behaviour and texts; pure logic in `src/lib` with unit tests. A test fails first.
- Before committing: `npx vitest run`, `npm run lint`, `npm run check`, `npx fallow audit` (a hook runs it on every commit: no unused exports/files, no duplication, no complex templates – split components), `npx prettier --write` on the files you changed (only under `src/`).
- E2E (`npm run test:e2e -- --project=chromium --project=api`) needs the fixed ports 3100/3101/2525; it is run centrally after merging.
