# Redesign progress

Brief: `docs/REDESIGN_BRIEF.md`. Resume rules: `docs/design/arbeitsregeln.md`.

## Status

| Stage | Status | Review | Axe | ui-screenshots |
|---|---|---|---|---|
| 0 Analysis | done | 1 round, 3 Majors fixed (`reviews/0-review-1.md`) | n/a (test from stage 2) | docs-only push: job skips its steps (no routes) |
| 1 Plan | in progress | | | |
| 2 Tokens + base components + axe | open | | | |
| 3 Icons + illustrations | open | | | |
| 4 Shell, navigation, dashboard | open | | | |
| 5 Rental contract wizard | open | | | |
| 6 Statement wizard | open | | | |
| 7 Remaining screens | open | | | |
| 8 Remove old design system | open | | | |
| 9 Final | open | | | |

**Next step:** stage 1 review of `01-plan.md`.

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
