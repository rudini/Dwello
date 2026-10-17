# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-17: #111 (P-16) planned PRD features, ZIP of a run (#356)

- [x] Search open issues; create #356 (ZIP of a run) and #357 (audit log)
- [x] PRD: ZIP and audit point to #356 / #357; automatic reminders and Swiss eID «Vision, nicht geplant»; database SSL and field encryption vision with O-3 / O-6
- [x] @wip scenarios «Alle Abrechnungen eines Laufs als ZIP herunterladen» and «ZIP eines Laufs mit einer inzwischen gelöschten Abrechnung anfordern», seen red at the missing button
- [x] `generateStatements` returns the created statements; BFF route zips their PDFs (fflate, already in the lockfile)
- [x] Result step: button «Alle als ZIP herunterladen» (full page load: the client router took `/statements/zip` for `/statements/[id]`), texts in four languages
- Not in `tests/a11y/screens.json`: the result step was never an axe state (the wizard check stops before saving); the change adds one button to it
- Files: `src/routes/statements/zip/+server.ts`, `src/lib/server/statement-generation.ts`, `src/lib/statement-wizard.ts`, `src/routes/statements/generate/{StatementWizard,StatementStep,GenerationStep}.svelte`, `messages/*.json`, `package.json`/`bun.lock` (fflate as devDependency, already in the lockfile), tests in `src/__tests__/` and `tests/e2e/`, `docs/PRD-Dwello.md`
- [x] Code review round 1: `docs/reviews/zip-review-1.md`
- [x] Personas Helga and Marco: `docs/design/personas/helga-zip.md`, `docs/design/personas/marco-zip.md`
- [x] Review fixes: axe and language states `statement-generate` `generation-result` and `statement-zip-refused`; ids encoded; generate answer from its contract
- [ ] Code review round 2 (Major fixes)
- [ ] Session archived, PR (Fixes #356, Fixes #111; #357 stays open)
