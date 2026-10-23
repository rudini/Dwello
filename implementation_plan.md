# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-23: #648 non-functional points as nfr issues, English labels

No scenario: rules, templates and tooling only, no app change.

- [ ] Check all 107 rows of `offene-punkte.md` against the code (four checkers)
- [ ] Open an issue per row that holds (`nfr` + `nfr:<category>`); archive the file with the issue per row
- [ ] Template `.github/ISSUE_TEMPLATE/nfr.md`
- [ ] Rules: `CLAUDE.md`, skills, `fach-reviewer`, templates, `docs/test-pyramid.md` name `domain`, `product`, `needs-decision`, `nfr` instead of the German labels and `offene-punkte.md`
- [ ] Tooling: `check-issues.mjs` checks `needs-decision`; `open-work.test.ts` without `offene-punkte.md`
- [ ] Label rename on GitHub (product owner, `gh label edit`), `betrieb` dropped
- [ ] code-reviewer round
- [ ] PR
