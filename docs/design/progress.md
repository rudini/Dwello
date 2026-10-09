# Redesign progress

Brief: `docs/REDESIGN_BRIEF.md`. Resume rules: `docs/design/arbeitsregeln.md`.

## Status

| Stage | Status | Review | Axe | ui-screenshots |
|---|---|---|---|---|
| 0 Analysis | in progress | – | n/a (test from stage 2) | – |
| 1 Plan | open | | | |
| 2 Tokens + base components + axe | open | | | |
| 3 Icons + illustrations | open | | | |
| 4 Shell, navigation, dashboard | open | | | |
| 5 Rental contract wizard | open | | | |
| 6 Statement wizard | open | | | |
| 7 Remaining screens | open | | | |
| 8 Remove old design system | open | | | |
| 9 Final | open | | | |

**Next step:** finish `00-analyse.md`, commit, push, open the draft PR, run the stage 0 review.

## Log

### Stage 0 – Analysis

- Environment: PostgreSQL 16 started locally, role/db `dwello`; dependencies installed. The pre-installed Chromium is older than the project's Playwright and the newer browser cannot be downloaded (proxy); symlinked the old headless shell under the expected path (see `arbeitsregeln.md`). Works for the E2E suite.
- Branch: the brief and the user ask for `feature/new-design`; the session was started on `claude/clever-galileo-lemeud`. Decision: work on `feature/new-design` as explicitly requested by the user.
- Skills: `/tdd` and `/ponytail` exist in `.claude/skills` and are used for every code change.
- `gh` CLI is not available in this session; GitHub operations (PR, checks, comments) go through the GitHub MCP tools. Decision: equivalent to `gh pr create --draft` / `gh pr checks`.
- `cy.yml` does not exist; the job `ui-screenshots` is in `.github/workflows/ci.yml` and runs on draft PRs too (no draft condition), so `gh pr ready` is not needed.
- Found a label bug in the rental contract form: "Nebenkosten Akonto" writes `additionalRent` (Zusatzmiete) and "Parkplatz / Sonstiges" writes `monthlyAdvancePayment` (Akonto). Fixed by relabelling in the contract wizard (stage 5); no logic change.
