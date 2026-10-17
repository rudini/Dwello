# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-17 W8d: e-mail statements (#86, Option 2)

- [x] #86 read (no comments, no implementation issue): the decision is the requirement; #283, #305, #322 do not change its outcome
- [ ] @wip scenarios `tests/e2e/features/statement-send.feature` incl. failure states (no e-mail address, mail refused), fach-reviewer before implementing (privacy: data leaves the server in a new way)
- [ ] backend: «Versenden» e-mails the PDF (with QR-bill) for Korrespondenzkanal E-Mail and stores a Dokument; failure keeps «Entwurf» with a coded refusal; Zahlungsfrist from the successful sending
- [ ] frontend: send dialog per channel, failure alert with «send again» or «deliver as letter»; texts in four languages
- [ ] privacy statement: statements by e-mail through the mail provider (after merging W9c's rewrite)
- [ ] screens.json / accessibility.feature / sprachen-bildschirme.feature for the new states
- [ ] slice review, feature review (personas, fach-reviewer, daten-pruefer), plan archived, pull request `Fixes #86`
