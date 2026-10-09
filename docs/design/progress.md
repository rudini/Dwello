# Redesign progress

Brief: `docs/REDESIGN_BRIEF.md`. Resume rules: `docs/design/arbeitsregeln.md`.

## Status

| Stage | Status | Review | Axe | ui-screenshots |
|---|---|---|---|---|
| 0 Analysis | done | 1 round, 3 Majors fixed (`reviews/0-review-1.md`) | n/a (test from stage 2) | docs-only push: job skips its steps (no routes) |
| 1 Plan | done | 1 round, 6 Majors fixed (`reviews/1-review-1.md`) | n/a | docs-only push: job skips its steps |
| 2 Tokens + base components + axe | in progress | | | |
| 3 Icons + illustrations | open | | | |
| 4 Shell, navigation, dashboard | open | | | |
| 5 Rental contract wizard | open | | | |
| 6 Statement wizard | open | | | |
| 7 Remaining screens | open | | | |
| 8 Remove old design system | open | | | |
| 9 Final | open | | | |

**Next step:** stage 2 – tokens, font, Tailwind mapping, base components (TDD), design guard, axe feature.

## Log

### Stage 0 – Analysis

- Environment: PostgreSQL 16 started locally, role/db `dwello`; dependencies installed. The pre-installed Chromium is older than the project's Playwright and the newer browser cannot be downloaded (proxy); symlinked the old headless shell under the expected path (see `arbeitsregeln.md`). Works for the E2E suite.
- Branch: the brief and the user ask for `feature/new-design`; the session was started on `claude/clever-galileo-lemeud`. Decision: work on `feature/new-design` as explicitly requested by the user.
- Skills: `/tdd` and `/ponytail` exist in `.claude/skills` and are used for every code change.
- `gh` CLI is not available in this session; GitHub operations (PR, checks, comments) go through the GitHub MCP tools. Decision: equivalent to `gh pr create --draft` / `gh pr checks`.
- `cy.yml` does not exist; the job `ui-screenshots` is in `.github/workflows/ci.yml` and runs on draft PRs too (no draft condition), so `gh pr ready` is not needed.
- Found a label bug in the rental contract form: "Nebenkosten Akonto" writes `additionalRent` (Zusatzmiete) and "Parkplatz / Sonstiges" writes `monthlyAdvancePayment` (Akonto). The contract detail page repeats the swap. Planned fix: relabel in the contract wizard (stage 5) and on the contract detail page (stage 7); no logic change.
- Draft PR: rudini/Dwello#32. Review round 1: 3 Majors (contract detail label swap, missing axe states, incomplete term table) fixed.

### Stage 1 – Plan

- `01-plan.md` written: 19 design decisions, token proposal (contrast checked with a script: all text pairs ≥ 6.9:1, most ≥ 7:1), component set, migration via a shrinking design-guard list, axe check as a Gherkin Szenariogrundriss inside the existing `chromium` project (CI runs it without workflow changes).
- Decision: Inter (variable, `@fontsource-variable/inter`) over Source Sans 3 / IBM Plex Sans – larger x-height at 16 px, tabular figures.
- Decision: dark mode only via `prefers-color-scheme` (no toggle).
- Review round 1: 6 Majors (send copy, task data sources, dark mode timing, axe timeout, empty-state claim, remnant scope/fallow) fixed in the plan.
- `/tdd` asks to confirm interfaces with the user; the user asked for autonomous work, so the plan (`01-plan.md`) serves as the agreed interface and behaviour list.

### Stage 2 – Tokens, base components, axe check

- Tokens in `src/styles/tokens.css` (light; dark scoped to `:root[data-dark-ready]` until stage 8), mapped to Tailwind under new names next to the old palette; Inter served from `@fontsource-variable/inter`; global `:focus-visible` ring and `prefers-reduced-motion`.
- New components in `src/lib/ui/` (all with DOM tests written first): Icon (Lucide, stroke 1.75), Button, IconButton, Field + TextInput/MoneyInput/Select/Textarea, Checkbox, RadioGroup, Dialog, Alert, Badge, EmptyState, SaveStatus, ProgressBar, Stepper, Tabs, Table, ToastRegion, PageHeader (with breadcrumb), Panel, NavList.
- Decision (/ponytail): no separate Spinner – the busy state is a text ("Wird gespeichert …") on the button; no `iconEnd` on buttons until a screen needs it.
- Decision: form controls use `aria-required` instead of native `required`, so empty submits reach the inline validation (native bubbles would block it and are not readable for everyone).
- Design guard `src/__tests__/design-guard.test.ts` with 129 legacy files in `design-guard-legacy.json` (shrinks per stage).
- Axe check: `tests/e2e/features/accessibility.feature` (76 screen × state examples, 6 more `@wip` until their UI exists), steps `tests/e2e/steps/accessibility.steps.ts`, driver `tests/e2e/interactions/accessibility.ts`; desktop, tablet, mobile; consistency test `tests/unit/a11y-screens.test.ts`. Runs in the `chromium` project, so CI's E2E job runs it unchanged; Firefox/WebKit skip `@a11y`.
- First axe run on the old UI: 304 violations on all 76 examples (contrast of `gray-400/500`, `green-600` …; `dt`/`dd` outside `dl`; a scrollable table not reachable by keyboard). Fixed by mapping low-contrast text colours to tokens across the legacy files, restructuring the tenant contact list, and making scroll regions focusable (with a targeted `svelte-ignore a11y_no_noninteractive_tabindex`, because Svelte's lint and WCAG 2.1.1 disagree here). Result: 0 violations.
- Found: several old confirmation dialogs (building, contract end/delete) have no `role="dialog"`; fixed when they move to the new `Dialog` in stage 7.
