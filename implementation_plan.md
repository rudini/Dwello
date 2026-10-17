# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W1c: outdated drafts and other settings in the wizard preview (#132)

- [ ] Plan: #132's "Done means" is worded like a decision issue; the decision (options 1 and 4) is the requirement. Option 1 here; option 4 («Neu berechnen» on a single draft) gets its own implementation issue
- [ ] `@wip` scenarios in `tests/e2e/features/statement-generate.feature` and their steps, seen failing
- [ ] fach-reviewer on the scenarios before implementing
- [ ] Preview names outdated drafts (stored invoice links of #96, `GET /statements/:id/changed-invoices`) and statements with another Heizprofil or rate, links to them, says existing drafts are kept (`src/lib/server/statement-generation.ts`, `PreviewChecks.svelte`); unit and DOM tests first
- [ ] Texts in `messages/{de,fr,it,en}.json`
- [ ] Slice review, feature review (personas), closing review
- [ ] Workflow review, session archived, pull request `Fixes #132`, merged
