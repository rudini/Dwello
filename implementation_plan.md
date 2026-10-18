# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: Akonto hint and glossary translations (#222)

Branch `feat/glossary-texts-222`. Issue #222 "Decided (product owner)" (the glossary entries are in `UBIQUITOUS_LANGUAGE.md` since #244) plus `CLAUDE.md`, "Workflow".

- [x] `@wip` scenario «Schlussrechnung mit abgezogenen Akontorechnungen» with the decided text, red; `fach-reviewer` on it (domain term)
  Scenario red (chromium): received the old hint «… Vorgeschlagen ist das Total der Leistungen vor dem Abzug. Erfassen Sie die Akontozahlungen nicht zusätzlich …»
  fach-reviewer round 1 (docs/reviews/222-fachreview-1.md): V-1, V-2 (Major) and V-3 answered by the product owner: the hint names one way only («… Haben Sie die Akontorechnungen schon erfasst, löschen Sie sie, sonst zählen sie doppelt.», recorded in #222), so glossary and hint agree, no amount below 0, the costs fall into the periods of the Schlussrechnung; V-5: the help text stays (product owner); V-4: rows «Auslesen» and «Mahnung eines Rechnungsstellers» planned for `i18n-begriffe.md` with the words the UI uses; V-6, V-7 (Nits) left as they are: the prompt changes only with `llm:eval`
  fach-reviewer round 2 (docs/reviews/222-fachreview-2.md): V-1 (Major, evidence checked: sent statements are not recomputed, `invoices_delete_billed_text` says to delete only wrongly entered invoices) waits for the product owner (variant A or B); V-2, V-3 (Minor) change decided texts, asked with V-1; V-4 fixed (this plan); V-5 taken for the rows; V-6 (Nit, before) → #262
  Product owner 2026-10-16 (recorded in #222): V-1 variant A (an advance invoice already in a statement stays, its amount is deducted from the total; the glossary sentence on «Akontorechnung» is the product owner's edit), V-2 and V-3 accepted; both scenarios changed
  fach-reviewer round 3 (docs/reviews/222-fachreview-3.md): round-2 V-1..V-3 fixed; V-9 fixed (U+00A0 in `messages/fr.json`; GitHub stores the issue text with a plain space); V-11 rejected: no change needed (reviewer); open V-7, V-8 (Minor) → #261, V-10 (Nit) and the term «abgerechnet» → #263
  Scenario red (chromium, round 2 texts): upload hint received «… Erfassen Sie die Akontozahlungen nicht zusätzlich …» (stale build of the old text, the message is not changed yet); invoice page received «… Ist der Betrag das Total vor dem Abzug, dürfen …»
  Test red: invoice-upload.test.ts (2) and invoice-pages.dom.test.ts «zeigt, was die KI beim Hochladen auf dem Beleg gesehen hat» – expected the decided texts, received the old ones
- [x] `invoices_upload_deducted` in de/fr/it/en as decided (one way, «Akontorechnung»)
- [x] `invoices_beleg_deducted` in de/fr/it/en as decided (V-3)
  Scenario green (chromium): both scenarios, `@wip` removed; unit and DOM tests green
- [x] `docs/design/i18n-begriffe.md`: rows «Akontorechnung (eines Rechnungsstellers)» facture d’acompte / fattura d’acconto / advance invoice, «Mahnung eines Rechnungsstellers» and «Auslesen»
- [ ] Blocked on the product owner: the sentence on billed advance invoices (variant A) in «Akontorechnung», `UBIQUITOUS_LANGUAGE.md`; the pull request is merged only after that edit (`CLAUDE.md`, Design-Regeln)
  Skills: ponytail-review (text-only diff, «Lean already»); tdd and ponytail were not loaded for this slice, the tests were changed and shown red before the texts
  code-reviewer round 1 (docs/reviews/222-review-1.md): fixed C-1 (Skills line), C-2 (plan item for the glossary edit), C-3 (issue numbers, 0489f9ab), C-4 (rows and files named), C-5 (brackets in the row «Mahnung eines Rechnungsstellers»)
  Files: `messages/{de,fr,it,en}.json`, `tests/e2e/features/invoices.feature`, `src/__tests__/invoice-upload.test.ts`, `src/__tests__/invoice-pages.dom.test.ts`, `docs/design/i18n-begriffe.md`, `docs/reviews/222-*.md`, `implementation_plan.md`
  Checks on 017fd97d: `bun run test:coverage` exit 0, `bun run check` exit 0, backend `bun run test` exit 0, `bun run type-check` exit 0, `bun run test:e2e`: chromium 769 passed, 0 failed (incl. invoices and the a11y/language screens); firefox and webkit did not start (browser executables missing in this container), CI runs them
  Feature review: personas Dr. Weber (texts), Helga (terms for beginners), Marco (phone); `fach-reviewer` round 3 already checked the final texts, and code-reviewer round 1 confirmed the strings in `messages/*.json` equal them, so no separate domain round
  persona Marco (docs/design/personas/marco-222.md): open P-1..P-4 (Minor), P-5 (Nit) → #268
  persona Helga (docs/design/personas/helga-222.md): P-1 (Major) fixed by the product owner's decision (separate sentences, where to delete); open P-2..P-4 (Minor), P-5 (Nit) → #268
  persona Dr. Weber (docs/design/personas/weber-222.md): P-1 (Major, = #261 first part) fixed by the product owner's decision (service period after the period already in a statement); open P-2..P-5 (Minor), P-6, P-7 (Nit) → #268
  Product owner 2026-10-16 (recorded in #222): both hints changed for Helga P-1 and Weber P-1
  Scenario red (chromium, persona fixes): upload hint received «… Haben Sie die Akontorechnungen schon erfasst oder hier ausgewählt, löschen oder entfernen Sie sie …»; invoice page received the hint without the service period
  Test red: invoice-upload.test.ts (2) and invoice-pages.dom.test.ts «zeigt, was die KI beim Hochladen auf dem Beleg gesehen hat» – expected the new texts, received the round-2 ones
  fach-reviewer round 4 (docs/reviews/222-fachreview-4.md): Helga P-1 and Weber P-1 confirmed fixed; V-12 (Minor) and V-13 (Nit) fixed by the product owner's decision 2026-10-18 («Abrechnungsperiode, in der sie abgerechnet ist»; «mit «Datei entfernen»»), wording as the reviewer proposed (pronoun form «retirez-les / li rimuova / remove them» as the product owner saw it in de)
  Scenario green (chromium): both scenarios with the final texts, `@wip` removed; unit and DOM tests green
  code-reviewer round 2 (docs/reviews/222-review-2.md): C-2..C-5 confirmed fixed; C-1/C-6 (Minor) accepted, not fixable after the fact: `tdd` and `ponytail` were not loaded for the text slices (workflow review W-3); C-7 fixed (item below)
- [ ] Personas Helga and Dr. Weber again, task on the two changed hints only (Workflow 6)
- [ ] Reviews (`code-reviewer`; feature review: personas and `fach-reviewer` where they apply)
- [ ] Before marking complete: all checks in `CLAUDE.md`
- [x] Workflow review `docs/reviews/workflow-rules-review-issue-222.md`
