# Stage 2 – review 1

Reviewer: independent general-purpose agent, read-only, fresh context. Input: brief, glossary, plan, token reference, diff `4fc78a1..afcda10`, test/axe/CI results, the ui-screenshots images of commit afcda10 (sampled: dashboard, tenants_id, contracts_new, statements_id, login – no missing elements, truncation, overlaps or broken layouts).

Verdict: 0 Blockers, 3 Majors, 9 Minors. Axe tags correct, no disabled rules; mechanical colour replacement changed styling only; all stage 2 components present.

## Majors

| # | Finding | Resolution |
|---|---|---|
| M1 | "submit-empty" ran axe before the validation errors arrived (forms use `use:enhance`): possible silent pass. | Every state now proves it was reached before axe runs (`shows(...)`: errors visible, empty state visible, login error, menus, dialogs). This immediately found two real problems: the distribution-key form's first submit button is "Formel testen" (the step now presses the last submit button), and the apartment list ignores `?search=` (backend bug, recorded in `offene-punkte.md`; the check uses the building filter). |
| M2 | filtered-empty, login-error, user-menu-open, mobile-menu-open never confirmed. | Same fix as M1; the desktop variant of mobile-menu-open checks the sidebar (no drawer exists there), stated in the step. |
| M3 | New components never axe-checked in a browser. | New gallery page `/gallery` (404 unless `UI_GALLERY=on`, which only the E2E stack sets; unit-tested) shows every component in every state incl. error, disabled, busy, open dialog, busy dialog, toasts, stepper, tabs, table; added to `screens.json` and the feature (3 examples). 0 violations. |

## Minors

| # | Finding | Resolution |
|---|---|---|
| 4 | Design guard false negatives (`class:` directives, arbitrary values, logical radius/spacing, inline style colours, SVG fills, more old-token prefixes). | Rules widened; a self-test with 19 bad and 4 good samples guards the guard. Surfaced `min-h-[50vh]` on the redirect page (fixed). |
| 5 | Dialog: busy state let focus escape, Escape only inside the panel. | Panel keeps focus while busy, Tab is held, Escape handled on the window; tests added. Focus trap split out to stay under the fallow complexity limit. |
| 6 | Random/global ids in Dialog and Tabs. | `$props.id()`. |
| 7 | Nested live regions in toasts; overflow on mobile. | Wrapper has no `aria-live` (each toast announces by role); `inset-x-4 sm:left-auto sm:w-96`. |
| 8 | Field dropped `example` without `help`; RadioGroup ids from values; invalid state. | Fixed with tests. `aria-invalid` goes on the `radiogroup` (ARIA does not allow it on `radio`, Svelte flags it). Checkbox error state: not added until a form needs it (ponytail), noted here. |
| 9 | Scroll regions always tab stops; generic "Liste" label. | `RecordTable` takes a specific label (Kategorien, Verteilschlüssel). Tab stop on a non-scrolling table kept: harmless, and detecting overflow needs JS – revisit if personas find it noisy. |
| 10 | Thin tests; missing token pairs; dark `ink-muted` on `accent-soft` 6.8:1. | Tests for Tabs Home/End, Dialog busy, IconButton, Table hidden columns; four more contrast pairs; dark `accent-soft` darkened to `#172C37` (now ≥ 7:1). |
| 11 | Material Symbols still from Google; old `.focus-ring*` utilities override the new focus outline. | Both belong to the old system: icons replaced in stage 3, utilities removed in stage 8 (checklist). |
| 12 | Leftovers (dashboard `iconColor: ''`, keys by label, shared `main-nav-link` test id). | Keys now by index. Dashboard is rebuilt in stage 4. `main-nav-link` is the test id the existing navigation scenarios use; kept. |
