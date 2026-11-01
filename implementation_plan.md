# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: structure report history and English report

Request from the product owner (chat, 1.11.2026): history of the structure report, retroactive (daily snapshots of `main`, last 60 days: its history has a gap from April to late September) and ongoing (CI on every push to `main`); the report in English. No scenario: developer tooling, nothing a landlord sees.

- [x] Report texts in English
- [x] Snapshot summary per commit (KPIs, module lights, functions over the thresholds, I and A per module)
- [x] `tools/arch-baseline/structure-history.sh`: daily first-parent samples (60 days) of `main` and HEAD, measured with today's tools and fallow config (`ARCH_ROOT`), cached per commit
- [x] History section: one chart per measure, modules whose distance D changed most
- [x] CI workflow on push to `main`: cache of snapshots, report as artifact, trend table in the job summary
- [ ] Results to the product owner
- [ ] Slice review, PR
