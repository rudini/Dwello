# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-17: Fedlex check of the statement requirements (#77)

- [x] Read Art. 67, 128, 257a, 257b, 269d, 270b OR (Fedlex, SR 220, as of 1.10.2026, de/fr/it) and Art. 4–8 VMWG (SR 221.213.11, as of 1.10.2025, de/fr/it) on fedlex.data.admin.ch
- [x] Compare the PDF notes in `pdf.service.ts` (de/fr/it/en): all match Fedlex, no change
- [x] Compare the help texts in `messages/*.json` that cite these articles: all match Fedlex, no change
- [ ] `docs/nebenkostenabrechnung-anforderungen.md`: Fedlex link and version per requirement, «Sicherheit» checked on Fedlex, wrong statements corrected
- [ ] Glossary deviations listed in #77 (glossary not edited)
- [ ] Feature review: `fach-reviewer` on the doc change
- [ ] Pull request (No scenario: documentation only, the app does not change)
