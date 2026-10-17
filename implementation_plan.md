# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #83 #84 (W4d) fr/it/en terms from Fedlex, AI native read of tenant texts

Request (coordinator): «Setze #83 #84 um». #83 Option B: the Fedlex word (OR/ZGB, VMWG in fr/it) where one exists, a native speaker only for the rest, English plain words. #84 Option B: an AI model reads the texts a tenant sees (statement PDF, reminder letters, e-mails) as a native speaker; the landlord UI later. Both "Done means" are worded as decision issues: the decision is the requirement. Fedlex read with single `curl` downloads (WebFetch got 503): SR 220 of 1.10.2026, SR 221.213.11 of 1.10.2025, fr and it.

- [x] fach-reviewer on the term proposal (Fedlex words for the ❓ terms and «Kündigungsfrist»), before any text changes: `docs/reviews/w4d-terms-fachreview-1.md`
- [x] #83: terms with a Fedlex word in `docs/design/i18n-begriffe.md`, `messages/{fr,it,en}.json`, PDF and letter texts; terms pinned in `src/__tests__/i18n.test.ts` (red first). Kündigungsfrist fr «délai de congé», it «termine di preavviso»; Kündigungstermin fr «terme de congé»; it «addebitabile» settled; English ❓ removed. Files: `messages/{fr,it}.json`, `docs/design/i18n-begriffe.md`, `src/__tests__/i18n.test.ts`. No scenario: wording of existing texts only, pinned by `i18n.test.ts`; `sprachen-bildschirme.feature` checks the screens
- [x] #83: remaining ❓ terms (no Fedlex word: Umlagefähig fr, Mahnung family, Abrechnungslauf, Konfidenz, Kündigung aufheben) for a native speaker: #342; scope of Option B for «inquilino»/«pigione»: #343
- [x] #84: AI native reads (fr, it, en) of statement PDF, reminder letters and e-mail: `docs/reviews/w4d-native-{fr,it,en}.md`; triage reviewed by fach-reviewer (`docs/reviews/w4d-tenanttexts-fachreview-1.md`), applied as text changes in `backend/src/services/pdf.service.ts`, `backend/src/services/reminder-letter.ts`, `messages/{fr,en}.json` (`statements_balance_settled`, V-1), `docs/design/i18n-begriffe.md` (row «Ausgeglichen»); pinned tests updated (`statements-i18n.test.ts`, `statement-pdf-render.test.ts`). Deferred: invoice lines to #256, tenancy line to #325, salutation, «umgehend» with a deadline and English floors to #344, master-data names to #345. No scenario: reviewed translation wording (skill slice-review, Triage)
- [x] code-reviewer slice 1: `docs/reviews/w4d-s1-review-1.md`
- [ ] #84: German findings of `i18n-native-de.md` still open listed in the issue
- [ ] code-reviewer per slice; feature review (persona on the fr/it PDF and letters, fach-reviewer)
- [ ] Workflow review, archive the session, PR `Fixes #83` `Fixes #84`, CI, merge
