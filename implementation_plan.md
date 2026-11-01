# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: structure report like Structure101 (XS, drill-down DSM, tests and change coupling)

Request from the product owner (chat, 1.11.2026): add what the report misses compared with Structure101 and in quantitative quality: an XS value (fat and tangles) with traffic light and history, a DSM that opens to files and to the imports behind a cell, and per module the test reach and the change coupling without import. No scenario: developer tooling, nothing a landlord sees. Test reach is fallow's static estimate (a test imports the file), not line coverage: that needs the test suites with PostgreSQL.

- [x] XS: share of production lines in excess (tangled modules, fat modules, files and functions), KPI with light, module light "fat"
- [x] Test reach per module (fallow `--coverage-gaps`), KPI and module light
- [x] Hidden change coupling (file pairs changed together, modules without import), KPI and module light
- [x] DSM drill-down: module details with files and the imports behind each cell
- [x] History: XS chart; snapshots and CI measure coverage gaps too
- [x] Hidden coupling leaves out pairs in one folder: SvelteKit's page and load function change together without import (16 of 49 pairs)
- [x] code-reviewer round 1: `docs/reviews/structure-s101-review-1.md` (C-1 Major: folder rule only for route folders, C-2 empty gaps file, C-3 Ce test: fixed; C-4 Minor, no test for the inline script that opens details: stays in the report)
- [ ] Re-review, PR
