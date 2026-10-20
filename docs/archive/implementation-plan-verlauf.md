## Session 2026-10-16 (17): Akonto hint and glossary translations (#222)

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
- [x] Personas Helga and Dr. Weber again, task on the two changed hints only (Workflow 6)
  persona Helga round 2 (docs/design/personas/helga-222-2.md): round-1 P-1 confirmed fixed; open P-1..P-3 (Minor), P-4 (Nit) → #268
  persona Dr. Weber round 2 (docs/design/personas/weber-222-2.md): round-1 P-1 and P-6 confirmed fixed (CHF 1’250.00 over both periods); open P-1, P-2 (Minor), P-3 (Nit) → #261, P-4 (Nit) → #268
  Checks on 1c81c7e4: `bun run test:coverage` exit 0, `bun run check` exit 0, backend `bun run test` exit 0, `bun run type-check` exit 0, `playwright test --project=chromium` 756 passed, 0 failed
- [x] Reviews (`code-reviewer`; feature review: personas and `fach-reviewer` where they apply)
- [x] Before marking complete: all checks in `CLAUDE.md`
- [x] Workflow notes `docs/reviews/workflow-notes-issue-222.md`
## Session 2026-10-17 W12: Fedlex check of the statement requirements (#77)

- [x] Read Art. 67, 128, 257a, 257b, 269d, 270b OR (Fedlex, SR 220, as of 1.10.2026, de/fr/it) and Art. 4–8 VMWG (SR 221.213.11, as of 1.10.2025, de/fr/it) on fedlex.data.admin.ch
- [x] Compare the PDF notes in `pdf.service.ts` (de/fr/it/en): all match Fedlex, no change
- [x] Compare the help texts in `messages/*.json` that cite these articles: `contracts_fee_help` (Art. 269d OR) lacked the ten-day lead time, the reasons and «nächstmöglichen»; fixed in all four languages, `contract-wizard.dom.test.ts` red first
- [x] `docs/nebenkostenabrechnung-anforderungen.md`: Fedlex link and version per requirement, «Sicherheit» checked on Fedlex, wrong statements corrected (Art. 269d nullity, Art. 6 VMWG scope, Art. 5 Abs. 2 lit. a–i wording)
- [x] Glossary deviations listed in #77 (glossary not edited; the three the issue named were already gone, none left)
- [x] `fach-reviewer` round 1: `docs/reviews/fedlex77-fachreview-1.md`
- [x] `code-reviewer` round 1: `docs/reviews/fedlex77-review-1.md`
- [x] Scenario «Hilfe zu einer neuen Verwaltungspauschale während der Mietdauer» (`contract-new.feature`), red against the old text, green; help paragraph of `RadioGroup` gets `data-testid="<testid>-help"`
- [x] `code-reviewer` round 2 on the scenario: `docs/reviews/fedlex77-review-2.md`
- [x] Workflow note: `docs/reviews/workflow-notes-issue-77.md`
- [x] Pull request (opened after archiving this session)

Files: `docs/nebenkostenabrechnung-anforderungen.md`, `messages/{de,fr,it,en}.json`, `src/__tests__/contract-wizard.dom.test.ts`, `src/lib/ui/RadioGroup.svelte`, `tests/e2e/{features/contract-new.feature,steps/contract-form.steps.ts,targets/contract-form.ts,questions/contract-form.ts}`, `docs/reviews/fedlex77-{fachreview-1,review-1,review-2}.md`, `docs/reviews/workflow-notes-issue-77.md`

## Session 2026-10-17 W2e: berichtigte Abrechnung (#120, #358)

- [x] Implementation issue #358 created (A-11, «Done means» from #120)
- [x] @wip scenarios: statement-detail.feature (berichtigen, Bestätigung, Anrechnung, ersetzte bleibt unverändert, ohne Mietstage, Navigation), contract-edit.feature and contract-detail.feature (Vertragsdaten nach dem Berichtigen)
- [x] fach-reviewer on the scenarios and planned texts before implementing (`docs/reviews/w2e-fachreview-1.md`; new issues #360 partial payments, #362 glossary)
- [x] Slice 1 backend: migration 0018 (`replaces_id`, `prior_payments`, status `replaced`), `replaceStatement`, `correctStatement`, offset in `calculateStatement`/`generateStatement`, contract dates ignore replaced statements; BFF run and missing statements ignore them (files: `backend/migrations/0018_statement_correction.sql`, `backend/src/db/schema.ts`, `backend/src/services/statement.service.ts`, `contract.service.ts`, `backend/src/routes/statements.ts`, `src/lib/server/statement-generation.ts`, `src/routes/contracts/[id]/+page.server.ts`, `tests/contracts/statement.json`)
- [x] Code review slice 1 (`docs/reviews/w2e1-review-1.md`): dashboard counts replaced statements (C-2), codes without messages (C-1), literal codes, `STATEMENT_REPLACED` from `PUT /:id`, tests for the period rule and the chain order, API docs
- [x] Slice 2 UI: «Abrechnung berichtigen» with confirmation per status, status «Ersetzt», «Ersetzt durch» / «Ersetzt die Abrechnung», row «Bereits bezahlt auf …», «Berichtigte Abrechnung erstellen», texts that sent the landlord outside Dwello, four languages; a11y and language rows for the new states (files: `src/routes/statements/[id]/*`, `src/lib/statement.ts`, `src/lib/types.ts`, `src/lib/server/statement*.ts`, `src/routes/dashboard/+page.server.ts`, `src/routes/contracts/[id]/DeleteContract.svelte`, `src/routes/statements/StatusFilter.svelte`, `messages/*.json`, `tests/a11y/screens.json`, `tests/e2e/fixtures/screens.ts`)
- [x] Slice 3 PDF: «Diese Abrechnung ersetzt …», the row «Bereits bezahlt auf …» and the derivation line (`backend/src/services/pdf.service.ts`, `statement-pdf.service.ts`)
- [x] Docs: A-11 implemented, data-model.md, api-specification.md; markers #120 removed
- [x] Code review slices 2, 3 and the merge (`docs/reviews/w2e2-review-1.md`): scenario for the statement run (C-1), success and focus after replacing, amount offset in the dialog, busy button, empty card, replaced summary, overdue test, #362 marker in the PDF
- [x] Feature review: fach-reviewer round 2 (`docs/reviews/w2e-fachreview-2.md`), personas Anna, Helga, Dr. Weber, Marco, Sven (`docs/design/personas/*-w2e.md`), daten-pruefer (`docs/reviews/w2e-datenpruefung-1.md`); pre-existing Majors of Anna as #378, #379, #380
- [x] Fixes of the feature review: dialog wording per status (sent refund, settled, offset of the chain), confirm button «Abrechnung berichtigen», replaced statement says it no longer applies, no hint on later invoices, link to the contract, PDF «Die Abrechnung NK-… gilt nicht mehr.», English terms, francs format in refusals, «Bezahlt diesen Monat» keeps a payment of a replaced statement, `i18n-begriffe.md` rows
- [x] Full E2E after the fixes: 948 passed, 8 failed; `statement-generate invoice-hints` (a11y, i18n) came from the a11y seed (Carla's replaced 2025 statement counted as billed for January–May 2025, moved to 2022); the 5 others (contract-new, settings) passed on a rerun
- [x] Closing code review (`docs/reviews/w2e3-review-1.md`): steps for the visible fixes in «Versendete Abrechnung berichtigen» and «Ersetzte Abrechnung bleibt unverändert», navigation scenario to the Mietvertrag, DOM test for the success message, chain wording, no Zahlungsfrist on a replaced statement, `busy` button, 48 px links; dashboard «Bezahlt diesen Monat»: No scenario: the figure sums every statement of the database, which parallel scenarios change; `dashboard.pg.test.ts` compares before and after
- [x] Workflow note: `docs/reviews/workflow-notes-issue-358.md`
- [x] Re-review of the closing fixes (`docs/reviews/w2e3-review-2.md`): no Blocker/Major
- [x] Merge of origin/main: `generateStatements` returns the ids now (#356), two tests follow; E2E of the statement and contract features after the merge: 295 passed, `statement-generate preview-all-billed` (a11y) flaky under load, passed on a rerun
- [x] Archive the session, push, pull request, CI, merge
- [x] Audit log (#111) pointer left for the correction (`replaceStatement`)

## Session 2026-10-16: fourth guide review T-1 to T-6

Request (chat): «Setze deine Empfehlung um» for `docs/reviews/opus55-guide-review-4.md` (T-1 to T-6). Rules only, no app behaviour, so no scenario.

- [x] T-1: step 1 loads the skill `bdd-acceptance`; its description says when; its run and selector lines point to `tests/e2e/CLAUDE.md` and "Conventions"
- [x] T-2: step 8 in three parts (start, during, end); the details of workflow notes in the skill `workflow-review`
- [x] T-3, T-4: "Done means" says the plan's session is moved to the archive, with several pull requests before the last one
- [x] T-5: step 4 says to keep working while the review runs
- [x] T-6: the test-database rule once (`backend/CLAUDE.md`), the other places point there; the UI-only sentence on `tdd`/`ponytail` goes
- [x] `code-reviewer` round 1 (docs/reviews/t16-review-1.md): C-1 (Minor: two run facts missing in `tests/e2e/CLAUDE.md`), C-2, C-3 fixed, no further round
- [x] Checks: lint, the tests that read rule files
- [x] Archive the session, push, pull request, CI, merge
  Files: `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `docs/test-pyramid.md`, `.claude/skills/{bdd-acceptance,workflow-review}/SKILL.md`; reports `docs/reviews/opus55-guide-review-4.md`, `docs/reviews/t16-review-1.md`

## Session 2026-10-16: project rules only (guide review G-9)

Request (chat): «Setze G-9 um» from `docs/reviews/opus55-guide-review.md`. Rules only, no app behaviour, so no scenario.

- [x] `CLAUDE.md`, "Coding guidelines": only the Dwello rules stay (issue text wrong in a detail, decided texts, one mapper per response); generic advice goes ("state assumptions", "push back", "Stay in scope", "Surgical changes": the ask list, the formatting gotcha, fallow and `code-reviewer` cover them)
- [x] `.claude/skills/tdd`: philosophy, SOLID and the checklist per cycle go; `mocking.md`, `tests.md`, `refactoring.md` go, `docs/test-pyramid.md` is the source for test doubles (`mocking.md` allowed mocking the database, which Dwello forbids)
- [x] `code-reviewer` round 1 (docs/reviews/g9-review-1.md): C-1 (Major: refactor step widened to untouched code) and C-2 fixed; round 2 (docs/reviews/g9-review-2.md) confirmed, its Nit C-3 fixed
- [x] Checks: lint, the tests that read rule files
- [x] Archive the session, push, pull request, CI, merge
  Files: `CLAUDE.md`, `.claude/skills/tdd/SKILL.md` (`mocking.md`, `tests.md`, `refactoring.md` removed); reports `docs/reviews/g9-review-{1,2}.md`

## Session 2026-10-16: third guide review S-1 to S-6

Request (chat): «Setze deine Empfehlung um» for `docs/reviews/opus55-guide-review-3.md` (S-1 to S-6). Rules only, no app behaviour, so no scenario. Own pull request after #271 is merged.

- [x] S-2: `bdd-acceptance` keeps the Dwello part and the Gherkin rules that hold here; the generic phases, examples and API variant go (2'073 → 465 words; the rule files together 14'939 → 13'380)
- [x] S-1: the `bdd-acceptance` question out of "When to ask"
- [x] S-3: workflow-note rule from step 7 "Rounds" to step 8 "Plan"
- [x] S-4: the two new facts of `arbeitsregeln.md`, "Persona runs: how", into the personas README; `persona.md` and the README point to the README only
- [x] S-5: circular pointer in `backend/CLAUDE.md` out
- [x] S-6: `pull-request` points to "Before marking anything complete" instead of a short copy
- [x] `code-reviewer` round 1 (docs/reviews/s16-review-1.md): C-1 (Major: navigation-scenario rule lost in the cut) restored, C-2..C-4 fixed; round 2 (docs/reviews/s16-review-2.md) confirmed, its Nit C-5 fixed
- [x] Checks: lint, check, the tests that read rule files
- [x] Archive the session, push after #271 is merged, pull request, CI, merge
  Files: `CLAUDE.md`, `backend/CLAUDE.md`, `.claude/agents/persona.md`, `.claude/skills/{bdd-acceptance,pull-request,workflow-review}/SKILL.md`, `docs/design/personas/{README,demo-records}.md`, `docs/design/arbeitsregeln.md`, `docs/design/offene-punkte.md` (H-13); reports `docs/reviews/opus55-guide-review-3.md`, `docs/reviews/s16-review-{1,2}.md`

## Session 2026-10-16: no shouting in the tdd skill (guide review G-11)

Request (chat): «Setze G-11 um» from `docs/reviews/opus55-guide-review.md`. Rules only, no app behaviour, so no scenario. Own pull request after #270 is merged.

- [x] `.claude/skills/tdd/SKILL.md`: «DO NOT», «ONE … ONE» and «Never refactor while RED» in plain words with their reason; labels in examples (WRONG/RIGHT, GOOD/BAD) stay
- [x] `code-reviewer` round 1 (docs/reviews/g11-review-1.md): C-1 fixed («WHAT, not HOW» in `tdd/tests.md` and `bdd-acceptance`), C-2 left: the `ponytail` skills are a third-party plugin
- [x] Checks: lint, the tests that read rule files
- [x] Archive the session, push after #270 is merged, pull request, CI, merge
  Files: `.claude/skills/tdd/SKILL.md`, `.claude/skills/tdd/tests.md`, `.claude/skills/bdd-acceptance/SKILL.md`; report `docs/reviews/g11-review-1.md`

## Session 2026-10-16: one source for the E2E rules (guide review G-10)

Request (chat): «Setze G-10 um» from `docs/reviews/opus55-guide-review.md`. Rules only, no app behaviour, so no scenario. Own pull request after #269 is merged.

- [x] `tests/e2e/CLAUDE.md`, "Rules", is the one source for failure states, negative checks, isolation and `@api`; `CLAUDE.md`, `docs/test-pyramid.md` and `.claude/agents/code-reviewer.md` point there; the `bdd-acceptance` skill too (code review C-1)
- [x] Nothing lost: every detail of the removed copies is in `tests/e2e/CLAUDE.md`
- [x] `code-reviewer` round 1 (docs/reviews/g10-review-1.md); its Minor and Nits fixed, no further round
- [x] Checks: lint, check, the tests that read rule files
- [x] Archive the session, push after #269 is merged, pull request, CI, merge
  Files: `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `docs/test-pyramid.md`, `.claude/agents/code-reviewer.md`, `.claude/skills/bdd-acceptance/SKILL.md`; report `docs/reviews/g10-review-1.md`

## Session 2026-10-16: second guide review R-1 to R-8

Request (chat): «Setze deine Empfehlung um, R-4 auch» from `docs/reviews/opus55-guide-review-2.md`. Rules only, no app behaviour, so no scenario. Same pull request as the G findings (not pushed yet).

- [x] R-2: one source per rule (rounds, the two exception kinds, Minor/Nit triage, `Refs` in the KI case, one pull request per issue); elsewhere only a pointer
- [x] R-4: glossary-term merge condition, split issues and a fix that closes two issues to skill `pull-request`; "its own slice for this limit" out of `CLAUDE.md`
- [x] R-1: cut, not move: the longest lines of `CLAUDE.md` (UI languages, Open work); `CLAUDE.md` 3'229 → 3'146 words, the rule files together 6'095 → 6'005
- [x] R-3: friction with a rule is noted at once as a plan item «Workflow note: …»
- [x] R-5: «or a loaded skill says to ask» out of "When to ask"
- [x] R-6: affected tests include those that read a changed file
- [x] R-7: descriptions of `slice-review` and `workflow-review` match their text
- [x] R-8: finish line of an issue is its "Done means" plus the workflow's "Done means"
- [x] `code-reviewer` round 1 (docs/reviews/r18-review-1.md); its Minors/Nits fixed, no further round
- [x] Checks: lint, check, type-check, the tests that read rule files
- [x] Archive the session, push after #266 is merged, pull request, CI, merge
  Files: `CLAUDE.md`, `.claude/skills/{slice-review,pull-request,workflow-review}/SKILL.md`; report `docs/reviews/r18-review-1.md`

## Session 2026-10-16: less bookkeeping, findings and checks (guide review G-3, G-4, G-6)

Request (chat): «Setze auch G-3, G-4 und G-6 um» from `docs/reviews/opus55-guide-review.md`. Rules only, no app behaviour, so no scenario. Goes into the same pull request as G-1/G-2/G-5/G-8 (not pushed yet).

- [x] G-3: no `Red:` lines, no plan line per reviewer and round, no exit codes handed to reviewers; the checklist stays, a review item names its report (`CLAUDE.md`, `slice-review`, `code-reviewer`, `docs/test-pyramid.md`)
- [x] G-4: a Minor/Nit is fixed when trivial, else it stays in its report; open work only for a Blocker/Major of the two kinds; persona "Beobachtungen" stay in the report (`CLAUDE.md`, `slice-review`, `pull-request`, `docs/design/arbeitsregeln.md`)
- [x] G-6: before every push lint, check, type-check, the affected tests and scenarios; CI runs the full suites with the coverage floors (`CLAUDE.md` "Before marking anything complete", `pull-request`)
- [x] `code-reviewer` round 1 (docs/reviews/g346-review-1.md)
- [x] Row O-34 in `offene-punkte.md`: the axe upload states that time out in CI (red on `main` and #266)
- [x] Checks: lint, check, type-check, the rule tests (`open-work`, `commit-msg-gate`, deepcheck `readme`, `check-issues`)
- [x] Archive the session, push after #266 is merged, pull request, CI, merge
  Files: `CLAUDE.md`, `.claude/agents/code-reviewer.md`, `.claude/skills/{slice-review,pull-request}/SKILL.md`, `docs/test-pyramid.md`, `docs/design/arbeitsregeln.md`, `docs/design/offene-punkte.md`; report `docs/reviews/g346-review-1.md`

## Session 2026-10-16: shorter CLAUDE.md (guide review G-1, G-2, G-5, G-8)

Request (chat): «Setze G-1, G-2, G-5 und G-8 um» from `docs/reviews/opus55-guide-review.md`. Rules only, no app behaviour, so no scenario. Own pull request after #266 is merged. Step numbers 1–9 stay, since agents, skills and tools cite them.

- [x] G-1 (4'955 → about 3'200 words; the rest are daily rules: conventions, design, gotchas, so the 2'000 of the proposal is not reached): rare procedures out of `CLAUDE.md` into what loads on demand: skills `pull-request`, `workflow-review`, `commit-gates`; findings and rounds to `slice-review`; feature-review details to `docs/design/personas/README.md`; the KI eval case to `backend/CLAUDE.md`; target about 2'000 words
- [x] G-2: round limit and closing round in one sentence each
- [x] G-5: every point where to ask in one list
- [x] G-8: a short "Done means" list at the start of "Workflow"
- [x] Nothing lost: every rule that left `CLAUDE.md` exists at its new place, `CLAUDE.md` points there
- [x] `code-reviewer` round
  code-reviewer round 1 (docs/reviews/shorter-review-1.md): fixed C-1 (Major: check for open `entscheiden` issues back in "Open work"), C-2 (Major: stop hook rule back in step 9), C-3..C-13, C-15, C-16; rejected C-14: «or that there is none» names the case of a pull request without UI changes, where CI posts no screenshot comment (#264)
- [x] Checks (exit 0 each, frontend 2619, backend 683): `bun run test:coverage`, `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`
- [x] Archive the session, push after #266 is merged, pull request, CI, merge
  code-reviewer round 2 (docs/reviews/shorter-review-2.md): C-1..C-16 confirmed fixed, C-14 rejection accepted, no Blocker/Major; fixed the rest of C-5 (Nit: a skill that says to ask, e.g. `bdd-acceptance`), no further round
  Files: `CLAUDE.md`, `backend/CLAUDE.md`, `.claude/skills/{pull-request,workflow-review,commit-gates}/SKILL.md` (new), `.claude/skills/slice-review/SKILL.md`, `docs/design/personas/README.md`; reports `docs/reviews/shorter-review-{1,2}.md`

## Session 2026-10-16: the other proposals of the guardrail analysis

Request (chat): «setze alle Vorschläge um», the proposals of the guardrail analysis not in PR #264. Rules, hooks, tooling and one test; no app behaviour, so no scenario. Own pull request after #264 is merged. Not in the repository: the stop hook `~/.claude/stop-hook-git-check.sh` (Blocked on me).

- [x] Fewer duplicate checks: no `deepcheck:audit` by hand after each step (the commit hook runs it; `tools/deepcheck/README.md`, its readme test and the `tdd` skill follow), full checks before the first push only, later pushes lint, check and the affected tests (`CLAUDE.md` Workflow 3, 4, 9). Kept: the fallow and deepcheck hooks on `git push`, which also gate merge commits that no commit hook sees (`git merge` commits without `git commit`)
- [x] `ponytail-review` as part of `code-reviewer` instead of its own step (`CLAUDE.md` Workflow 3, `.claude/agents/code-reviewer.md`)
- [x] Feature review: 1–2 personas by the matrix, all only for a new screen or flow; `fach-reviewer` only when texts or rules changed after its first review; `daten-pruefer` after the persona whose records it needs; SQL in `dwello_persona` also to clear blocking demo records (`CLAUDE.md` Workflow 5, `docs/design/personas/README.md`)
- [x] Persona stack builds into its own directories (`BUILD_DIR=/tmp/persona-app`, SvelteKit's `outDir` `.svelte-kit/persona`: outside the project Node cannot resolve the packages), so E2E may run while personas run (`svelte.config.js`, `persona-stack.sh`, Gotchas «One build»); shown: persona app answered 200 while `navigation.feature` «Fusszeile» ran, 3 passed
- [x] Triage: same cause from several reviewers is one finding; checks reported with exit codes (`slice-review`, Workflow 4)
- [x] Reviewed translation wording needs no red test of its own; work allowed while `fach-reviewer` runs (Workflow 1, 6)
- [x] Test: row IDs in `offene-punkte.md` are unique (`open-work.test.ts`)
- [x] Commit gate `--check "<subject>"` (`.claude/hooks/commit-msg-gate.mjs`, test); fallow gate: stash for a slice while the next is in progress (Gotchas)
- [x] Issue templates: how a landlord reaches the state, tests that pin today's behaviour; before starting, check open `entscheiden` issues on the same data (`.github/ISSUE_TEMPLATE/`, «Open work»)
- [x] `grill-me`: check decided texts against the cases the code produces
- [x] Split issue: several pull requests (`Refs`, last `Fixes`); a Major whose fix is another ready issue's decided text closes both (Workflow 8)
- [x] PDF strings outside `messages/*.json`: they are already one structure (`translations` in `pdf.service.ts`); the gap was a text missing in a language, which falls back to German: `backend/src/__tests__/pdf-translations.test.ts` (today complete except the shared `m²`)
- [x] Shorter `CLAUDE.md`: the «No scenario» cases to `tests/e2e/CLAUDE.md`, the persona details to `docs/design/personas/README.md`
- [x] `code-reviewer` round
  code-reviewer round 1 (docs/reviews/guardrails2-review-1.md): no Blocker/Major; fixed C-1 (Minor: the persona stack's KI stand-in on its own port 2528, run with `--no-build`: ready, stand-in answered), C-2 (`arbeitsregeln.md`, `--no-build` without a build stops with a message), C-3 (matrix names the personas, at most two unless a screen or flow is added), C-4, C-5; rejected C-6: `docs(config)` matches the earlier commits of this work, the diff is mostly rules. No further round: Minor/Nit fixes in docs and a script outside the code paths of Workflow 6
- [x] Independent review against the guide «Getting the most out of Opus 5.5» (docs/reviews/opus55-guide-review.md): G-1..G-12 go to the product owner to decide (Workflow 7: only write)
- [x] Checks (exit 0 each, frontend 2608 tests, backend 683): `bun run test:coverage`, `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`
- [x] Archive the session, push after #264 is merged, pull request, CI, merge
  Files: `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `.claude/agents/code-reviewer.md`, `.claude/hooks/commit-msg-gate.mjs`, `.claude/skills/{grill-me,slice-review,tdd}/SKILL.md`, `.github/ISSUE_TEMPLATE/task.md`, `svelte.config.js`, `docs/design/tools/persona-stack.sh`, `docs/design/personas/README.md`, `docs/design/arbeitsregeln.md`, `tools/deepcheck/README.md`, tests `src/__tests__/open-work.test.ts`, `tools/claude-hooks/commit-msg-gate.test.ts`, `tools/deepcheck/test/readme.test.ts`, `backend/src/__tests__/pdf-translations.test.ts`; reports `docs/reviews/guardrails2-review-1.md`, `docs/reviews/opus55-guide-review.md`

## Session 2026-10-16: fewer review rounds and less bookkeeping

Request (chat): apply the three proposals of the guardrail analysis: re-review only for Blocker/Major plus one closing round before the pull request; red evidence in the commit instead of plan lines, no Major for missing notes; workflow reviews collected instead of one per task, with the right to propose removing rules. Rules only, so no scenario and no workflow review (Workflow 7).

- [x] Re-review only for a Blocker/Major fix; Minor/Nit code fixes go into the closing `code-reviewer` round before the push (`CLAUDE.md` Workflow 6, 9)
- [x] Red evidence in the slice's commit message (`Red:` lines) instead of `Scenario red`/`Test red`/`Skills` plan lines; a missing one is a Minor (`CLAUDE.md` Workflow 1–3, `.claude/agents/code-reviewer.md`)
- [x] Workflow notes per task only when something came up; a collected workflow review on request, which may propose removing or shortening rules (`CLAUDE.md` Workflow 7)
- [x] `code-reviewer` round on the rule diff
- [x] Checks (exit 0 each): `bun run test:coverage`, `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`
- [x] Archive the session, push, pull request, CI, merge
  code-reviewer round 1 (docs/reviews/guardrails-review-1.md): fixed C-1 (Major: closing round without end; Minor/Nit fixes from it get no further round), C-2 (test pyramid), C-3, C-4, C-5, C-6, C-7
  code-reviewer round 2 (docs/reviews/guardrails-review-2.md): C-1..C-7 confirmed fixed, no Blocker/Major; fixed C-8 (Minor: pattern named the per-task reviews too broadly), C-9, C-10 (Nits), no further round (Workflow 9)
  Files: `CLAUDE.md`, `.claude/agents/code-reviewer.md`, `docs/test-pyramid.md`, `docs/reviews/guardrails-review-{1,2}.md`

## Session 2026-10-16 (16): #233 open points of «Rechnungen hochladen»

Branch `feat/upload-followups-233`. Issue #233 "Decided (product owner)" and "Done means" plus `CLAUDE.md`, "Workflow". Each point is fixed as its finding suggests; where it offers two ways, the simpler one.

Upload dialog (`src/lib/invoice-upload.ts`, `src/routes/invoices/*Upload*`):
- [x] Count on the button (Helga P-1): counts rows without errors, adds «(1 unvollständig)»
- [x] Notes of a row: title «Hinweise zu {Datei}» (Sven P-1, Helga P-4 round 2); required Kategorie first, «Prüfen Sie» only for unsure fields, «Ergänzen Sie, falls auf der Rechnung» for fields not found, none on a Sammelscan (Anna P-5, Helga P-4); a field filled in by hand is neither unsure nor missing (C-42)
- [x] Sammelscan names a way forward (Anna P-3); Gutschrift says to create no invoice and to lower the invoice it belongs to (Weber P-3)
- [x] «Dwello speichert die Datei jeder erstellten Rechnung als Beleg» (Weber P-4)
- [x] After a partial create the result names the files still open (Anna P-2); the cancel question says created invoices stay (Anna P-4); `oncreated` after discarding tested (C-39)
- [x] Links of created invoices named with their date (C-27)
- [x] KI answers nothing readable: own code `EXTRACTION_UNREADABLE`, text and «Erneut versuchen» (V-14)
- [x] V-13: the hint on costs not allocable only when the chosen Kategorie is allocable (prompt unchanged, domain review V-1)
- [x] Screen reader: dialog described by its first sentence (Sven P-2), removing a file announced (Sven P-3), result of reading announced (Sven P-4), KI note first in the field description (Sven P-5); date error once in the accessibility tree (Anna P-9)
- [x] Kategorie list there at once (Anna P-10): rejected, not reproducible: Anna 6 tries and Helga 11 tries found all categories after 11–17 ms and the KI's choice selected; the accessibility snapshot lists no options in `optgroup`s, which most likely read as an empty list in #217's round 1
- [x] Preview opens large in a new tab (Helga P-3, Marco P-10)
- [x] Comment of `valuesOf` above it (C-41)
  Test red (slice 1): dialog «zählt auf dem Knopf nur Rechnungen, die sich erstellen lassen …» – received «2 Rechnungen erstellen»; invoice-upload.test: Sammelscan without check notes, Mahnung/Kategorie first, V-1 mixed only allocable, Gutschrift text, required/unsure/optional apart, Kategorie first, C-42 – 7 failed on the old notes; dialog «nennt im Hinweis einer Datei ihren Namen …» – received «Zu dieser Datei»; dialog «nimmt Dateien erst …» (Beleg sentence) – old «jede Datei» sentence; backend «meldet eine Antwort der KI ohne lesbare Angaben …» – expected 502, received 503; dialog «bietet erneutes Lesen an …» – received «… weil Dwello nicht geantwortet hat»; dialog «nennt nach einem Teil-Erfolg …» and «liest jede Datei …» (name with date) – no «Noch offen», name without date
  Slice 1 (upload dialog notes, count, partial create, V-14) Skills: tdd, ponytail, ponytail-review (`several` computed once); scenarios green: the 6 upload scenarios, `invoices.feature` 22 passed (chromium, api)
  code-reviewer round 1 (docs/reviews/233-review-1.md): fixed C-1 (Major; test «nimmt eine Aufforderung zurück, sobald das Feld ausgefüllt ist» red: the to-do notes are derived from the current values, `toDoOf`), C-2 (Major; states `upload-partial`, `upload-discard-created`, `upload-unreadable` in `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`: 10 rows green), C-3 (test red without `new Set`: each_key_duplicate), C-4 (test red: «Noch offen» named the Gutschrift; now the files still chosen), C-5 (assertion added); rejected C-6: the decided wording counts what is created, «0 Rechnungen erstellen (2 unvollständig)» says that nothing is complete yet, and pressing it shows what is missing
  Test red (slice 2): dialog «beschreibt sich mit seinem ersten Satz …» – no aria-describedby; dialog «sagt nach dem Lesen, was zu tun ist, und meldet jede entfernte Datei …» – received «2 von 2 Dateien gelesen»; dialog «liest den Hinweis der KI vor der Hilfe des Feldes vor» – first description was the help; date-input «nimmt die Ansage nach einem Moment zurück» – the error stayed in the live region; dialog «öffnet die Datei gross in einem neuen Tab …» – no link
  Slice 2 (screen reader, large preview, review fixes) Skills: tdd, ponytail, ponytail-review (shim for object URLs dropped: Node has them); fallow: template expressions of the dialog moved to `$derived`
  code-reviewer round 2 (docs/reviews/233-review-2.md): C-1..C-5 confirmed, C-6 rejection accepted; fixed C-7 (Major; test «zeigt eine Datei gross nur als das, was ihre ersten Bytes sagen …» red: the blob takes the type its first bytes show, `fileType`), C-8 (Major; scenarios «Dwello sagt, was nach dem Lesen zu tun ist, und meldet eine entfernte Datei» – received «2 von 2 Dateien gelesen», and «Eine hochgeladene Datei gross ansehen» – no link, both red on e30b1913's dialog and row, green now; the «No scenario» for the blob link is withdrawn: `OpenInNewTab` reads a `blob:` file in the page), C-9 (test red: old «… entfernt.» after reopening), C-10 (test red: link without the file name)
  fach-reviewer round 2 (docs/reviews/233-fachreview-2.md): no Blocker/Major; V-1..V-6, M-1, M-2, R-1, T-1..T-3 confirmed; fixed V-8 (test «folgt mit dem Hinweis auf gemischte Kosten der Kategorie …» red: the hint is derived from the current values in `toDoOf`), P-1 (this plan); open V-9 (the dialog's decided Akonto text, comment in #222), V-10 (Nit, wording of the status line: open work)
  Test red (slice 3 and round 2): invoice-pages «rät beim Löschen … (M-6)» – testid missing, old sentence; «sagt beim Beleg, dass erst die Datei …» – no help testid; «zeigt sichtbar, dass der Beleg in einem neuen Tab …» – span was sr-only; invoice-pages «sagt bei „Umlagefähig“, was das Kästchen gerade bewirkt» – no help testid, help unchanged; invoice-pages «lässt die Rechnungsnummer korrigieren» – no field; dialog «zeigt eine Datei gross nur als das, was ihre ersten Bytes sagen …» (C-7) – blob type text/html; dialog «beginnt nach dem Schliessen wieder ohne alte Meldung» (C-9) – old «… entfernt.»; «nennt beim Link …, welche Datei er öffnet» (C-10) – no aria-describedby; backend «behält die Hinweise aus dem Hochladen und verliert sie mit einem neuen Beleg» – no fields; invoice-upload «schickt die Angaben so …» and endpoint «schickt die Rechnung mit ihrer Datei …» – no hints; invoice-pages «zeigt, was die KI beim Hochladen auf dem Beleg gesehen hat» – no hints; invoices-pages M-2 edit warning – old text; dashboard «bietet die häufigen Arbeiten direkt an» – no /invoices?upload; invoice-pages «öffnet «Rechnungen hochladen» gleich …» – dialog closed; help «nennt das Hochladen mehrerer Rechnungen» – sentence missing; privacy «keine KI …» and «spricht in jeder Sprache … von der KI» – «Sprachmodell» in all variants
  Slice 3 (invoice page, forms, Übersicht, Hilfe, privacy; migration `0006_beleg_hints.sql`) Skills: tdd, ponytail, ponytail-review (help built with `join`, hints derived once); the hint «(öffnet in neuem Tab)» is visible in `Button.svelte` itself, so also on the building card's route link and the statement's send dialog (same reason, three uses); E2E: no `@wip` left, 12 features 148 passed (chromium, api), axe and language rows of the affected screens 88 passed; `Beleg ersetzen` waited for nothing after saving (flaky, 3 of 3 green alone): the task now waits for the confirmation
  code-reviewer round 3 (docs/reviews/233-review-3.md): fixed C-11 (Blocker, in slice 2's fix of C-7, its 3rd round: shown red and green without a 4th round, `bunx vitest run src/__tests__/invoice-upload-dialog.dom.test.ts` exit 1 with 2 unhandled rejections before, exit 0 after: the file is read before the type is known, a late result after the row is gone is dropped), C-12 (the link only once its file is ready), C-13 (Major; the seeded invoice of `invoice-detail` is created with a Beleg and its hints, so axe and the language check see «Hinweise zum Beleg»: rows green), C-15 (the billed invoice of `invoice-billed-detail` has a Beleg, so its delete dialog shows M-6: rows green; the file name has digits only, a word in it counts as German), C-18 (test red: `invoice` «null» gave 500); open C-14 (no field of the app limits its length: row O-31); rejected C-16: the address the property manager followed opens the dialog again on reload, as it did the first time; C-17: the new help sentence uses «…» like every other help text in English, the dialog texts use “…” like theirs; C-19: a deducted amount of more than ten digits is not a reading of a real invoice
  personas round 1 (docs/design/personas/{helga,marco,anna,weber,sven}-233.md): no Blocker/Major caused by the change; fixed Weber P-4 / Marco P-1 (nothing to fill in on a Gutschrift or Mahnung, test), Weber P-3 first part (with V-8), Marco P-7 / Anna (label and tab hint in one run, test), Helga P-1 (without KI the required fields named at once, test); Weber P-1 (Major), P-2, Marco P-5, Anna P-3: the dialog's decided Akonto text, existed before → #222 (comment, Blocked on me); Sven P-1, P-2 existed before → O-31; Sven P-3 is U-3; rejected Weber P-7: the sentence shows only when the KI runs on the operator's server, the page chooses its text by that; Anna P-2: «Noch offen» names what was chosen and not created (C-4), a Sammelscan is not to be created; open (#245): Weber P-3 rest, P-5, P-6, P-8, Marco P-2, P-3, P-4, P-6, Anna P-1, P-4, Helga P-2..P-6, V-10 and the observations
  code-reviewer round 4 (docs/reviews/233-review-4.md, slice 4 round 1): fixed C-20 (Major; checks added to «Rechnung ohne KI aus einer Datei erfassen», «Rechnung mit Kosten, die nicht umlagefähig sind», «Eine Gutschrift ist nicht zum Erstellen ausgewählt»; Scenario red with a09ae7f6's `invoice-upload.ts`: «Füllen Sie aus: …» missing, «nicht umlagefähig sind» still there after «Reparaturen», «Wählen Sie eine Kategorie.» on the Gutschrift; green now), C-21 (test «zeigt den Link … erst, wenn die Datei bereit ist» red with a09ae7f6's row), C-22 (Skills line), C-23 (comment), C-24 (test red: `[]` passed); open C-25 (a row whose reading failed names no required fields; existed before → #245)
  code-reviewer round 5 (docs/reviews/233-review-5.md, slice 4 round 2): C-20..C-24 confirmed fixed, no Blocker/Major; open C-26 (Nit, `toDoOf` repeats `checkRow`'s check: row O-32); rejected C-27: the new lines are as long as the lines around them in the same files
  persona Helga round 2 (docs/design/personas/helga-233-2.md): her P-1 confirmed fixed; fixed the new P-1 (Minor; test red: «abc» as Betrag or spaces as Rechnungssteller counted as filled in, now counted as the create button counts them); P-2 (Nit, order of the fields named) → #245
  Slice 4 (fixes of the feature review) Skills: tdd, ponytail, ponytail-review (`Button`: the tab hint as text after the label instead of a branch, for fallow)
  Test red (slice 4, review fixes): invoice-upload «folgt mit dem Hinweis auf gemischte Kosten der Kategorie …» (V-8) – hint stayed; dialog test file exit 1 with 2 unhandled rejections (C-11), exit 0 after; «verlangt bei einer Gutschrift und einer Mahnung nichts zum Ausfüllen» (Weber P-4) – Kategorie and Rechnungsdatum asked; endpoint «lehnt es mit 400 ab …» with invoice «null» (C-18) – received 500; invoice-pages «zeigt sichtbar, dass der Beleg …» (Marco P-7) – hint in its own span beside the label; invoice-upload «nennt ohne KI gleich die Pflichtangaben …» (Helga P-1) – only the Kategorie named

Invoice pages:
- [x] Hints of the upload kept with the Beleg and shown on the invoice page (Anna P-8): deducted Akonto, costs not allocable
- [x] Rechnungsnummer in «Rechnung bearbeiten» (Helga P-4)
- [x] Help of «Umlagefähig» follows the checkbox, also on «Neue Rechnung» (Marco P-6)
- [x] «Beleg anzeigen (öffnet in neuem Tab)» visible (Helga P-5); help «Wählen Sie die Datei und klicken Sie dann auf …» (Helga P-6)
- [x] Delete confirmation of a billed invoice with a Beleg: «Laden Sie den Beleg vorher herunter, wenn Sie ihn für die Belegeinsicht brauchen.» (M-6)

Elsewhere:
- [x] «Rechnungen hochladen» in «Häufige Arbeiten» and in the Hilfe (Anna P-7)
- [x] «KI» instead of «Sprachmodell» on the privacy page (Weber P-7)

Finish:
- [x] `@wip` scenarios, red; `fach-reviewer` on them (legal text, KI prompt, domain hints)
  Scenario red (chromium, before the code): «Mehrere Rechnungen …» – created links without date; «Eine Datei mit mehreren Rechnungen» – old Sammelscan text; «Eine Gutschrift …» – old text; «Unsichere und nicht gefundene Angaben …» – received «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.»; «Nur vollständige Rechnungen …» – no «Wählen Sie eine Kategorie.» (category among «Prüfen Sie»); «Die KI antwortet nichts Lesbares» – received «Die KI ist nicht verfügbar …»; «Der Hinweis auf abgezogene Akontozahlungen …» – `invoice-document-hints` null; dashboard «Rechnungen von der Übersicht aus hochladen» – no quick action; help – section without the sentence; privacy – «KI» missing (says «Sprachmodell»); «Rechnungsnummer korrigieren» – `invoice-number-input` missing; «Nicht umlagefähige Kategorie wählen» – help testid null; «Beleg ersetzen» – help testid null; «Abgerechnete Rechnung mit Beleg löschen» – `invoice-delete-billed-document-note` null
  fach-reviewer round 1 (docs/reviews/233-fachreview-1.md): fixed in scenarios and plan V-1 (Major: prompt unchanged; the hint on costs not allocable is left out only when the chosen Kategorie is not allocable, preselection stays blocked), V-2, M-1 (Gutschrift text), V-3, V-4 (hints on the invoice page), V-5 (required «Füllen Sie aus», optional «Ergänzen Sie, wenn …»), V-6 (Sammelscan), R-1 (wording, lower test for all variants), T-1 (markers on #222), T-2, T-3; M-2 (existed before, more visible) fixed here; V-7 withdrawn by the reviewer in round 2 (no duplicate sentence), M-3 confirmed (decided text, no change)
  No scenario: the visible «(öffnet in neuem Tab)» (Helga P-5): Playwright reads a screen-reader-only text like a visible one, DOM test instead; screen-reader announcements and descriptions (Sven P-1..P-5, Anna P-9): DOM tests; the Kategorie list at once (Anna P-10): DOM test
- [x] Slice reviews (`code-reviewer`), feature review (personas, `fach-reviewer`)
- [x] Before marking complete: all checks in `CLAUDE.md` on 8f562ea1: test:coverage exit 0 (157 files, 2606), lint, check, backend test (659/0, exit 0) + type-check, deepcheck:audit; E2E chromium+api of invoices, invoice-detail/-new/-edit, dashboard, help, privacy, tenant-documents, documents, categories-ki, buildings, statement-detail (148), axe and language rows of the affected screens (88)
- [x] Workflow review `docs/reviews/workflow-rules-review-issue-233.md` (W-1..W-7)
- Merged origin/main (glossary decisions of #222's round, PR #244): «Gutschrift» and «Akontorechnung» are in `UBIQUITOUS_LANGUAGE.md` now, so the two markers `TODO(fachlich prüfen, #222)` were removed

Files: `src/lib/invoice-upload.ts`, `src/routes/invoices/{InvoiceUploadDialog,InvoiceUploadRow,UploadRowNotes,UploadRowFields,UploadResult,InvoiceCategoryFields,+page}.svelte`, `src/routes/invoices/[id]/{InvoiceBeleg,DeleteConsequences}.svelte`, `src/routes/invoices/[id]/edit/+page.svelte`, `src/routes/api/invoices/+server.ts`, `src/lib/server/invoice.ts`, `src/lib/types.ts`, `src/lib/ui/{Dialog,Field,Checkbox,Button,DateInput}.svelte`, `src/routes/dashboard/+page.svelte`, `src/routes/help/+page.svelte`, `messages/*.json`, `backend/migrations/0006_beleg_hints.sql`, `backend/src/{db/schema.ts,routes/invoices.ts,services/invoice.service.ts,services/llm.service.ts}`, `backend/scripts/llm-stub.ts`, tests in `src/__tests__/`, `backend/src/__tests__/`, `tests/e2e/` (features, steps, screenplay, fixtures), `tests/a11y/screens.json`, `tests/contracts/{invoice,invoice-extraction-unreadable}.json`, `docs/{api-specification,data-model}.md`, `docs/design/offene-punkte.md` (O-31, O-32), reviews `docs/reviews/233-*.md`, personas `docs/design/personas/*-233*.md`, `docs/reviews/workflow-rules-review-issue-233.md`.

## Session 2026-10-16 (15): #217 create Rechnungen from uploaded invoice files

Branch `feat/invoice-upload-217`. Issue #217 "Done means" plus `CLAUDE.md`, "Workflow".

- [x] Glossary term «Beleg» added on the product owner's request in this session (`UBIQUITOUS_LANGUAGE.md`, commit 6adf5a6)
- [x] Scenarios green, `@wip` removed: 15 in `invoices.feature`/`invoice-detail.feature`; affected feature files (invoices, invoice-detail/-new/-edit, tenant-documents, documents, privacy, categories-ki) 65 passed (chromium, api)
- [x] `@wip` scenarios in `tests/e2e/features/invoices.feature` (8) and `invoice-detail.feature` (4), steps in `tests/e2e/steps/invoice-upload.steps.ts`
  Scenario red: all 12 at the missing behavior: `getByTestId('invoice-upload-button')` not found (list), `PUT /invoices/:id/beleg` answers 404 (seed), `getByTestId('invoice-beleg-file-input')` not found (detail)
- [x] `fach-reviewer` on the scenarios (new KI prompt, privacy statement, domain term «Beleg»); product owner decided V-1, V-2, M-1, M-2, M-3 (recorded in #217); scenarios revised (Datei for unsaved files, Kategorie required, new hints)
  fach-reviewer round 1 (docs/reviews/upload-fachreview-1.md): open –; fixed in scenarios/plan V-1, V-2, V-4, V-5, V-7, M-1, M-2, M-3, M-4, R-1, R-3, R-5 (code follows), confirmed V-8; rejected V-3a: the product owner decided unsure fields are marked, not blocking; V-3b: an invoice without Leistungszeitraum is the subject of #131 and #134; V-6: duplicate rule decided by the product owner; R-2: the local text's condition is #216's, unchanged here; R-4: the file name often names supplier and period and helps the model, the privacy text names it, and the E2E stand-in reads it; missing terms (Konfidenz, Auslesen, Rechnung vs. Beleg) go into one issue
- [x] Backend: migration `0005_invoice_documents.sql` (table `invoice_documents`, drop `invoices.invoice_pdf`), schema, `docs/data-model.md`
  Test red: `invoice-beleg.pg.test.ts` «wird mit der neuen Rechnung gespeichert …» – expected beleg {fileName, mimeType}, received undefined
- [x] Backend: Beleg with a new invoice (`POST /invoices` with `beleg`), download, replace; deleted with the invoice; file checks shared with tenant documents (`checkedFile`), download headers shared (`routes/file-response.ts`)
  Test red: «wird zu einer Rechnung ohne Beleg hinzugefügt …» – 404 for PUT; «lehnt eine Datei ab …» and «wird mit der Rechnung gelöscht» written after the code, red shown by taking out the check and the cascade
- [x] Backend: `POST /invoices/extract` (KI reads the file: fields with confidence, several invoices, category through the existing categorization), possible duplicate in the Gebäude; prompt after the domain review (total before deductions, document type, items not allocable, no due date from «innert 30 Tagen»)
  Test red: `llm-extraction.test.ts` – import missing; `invoice-extraction.pg.test.ts` «schickt die Seiten …» – 404; KI down and duplicate written after the code, red shown by taking the code out
- [x] Backend: default model `qwen2.5vl:7b`; README (with OpenRouter), docker-compose, docs
- [ ] (open, Blocked on me) `llm:eval` before/after with the default model: the session cannot pull Ollama models → Blocked on me, PR says `Refs #217`
- [x] KI stand-in answers the extraction prompt (by file name) and categorizes only the upload scenarios' suppliers
- [x] Frontend: dialog «Rechnungen hochladen» on `/invoices` (Hochladen, Prüfen, Erstellen; at most 20 files; PDF pages rendered in the browser with the pdf.js legacy build, bundled, no CDN; file sent as multipart, BFF converts to Base64)
  Test red: `invoice-upload.test.ts` (module missing), `invoice-upload-endpoints.test.ts` (routes missing), `api-form.dom.test.ts` (body JSON), `ui-dialog.dom.test.ts` (3 new), `invoice-upload-dialog.dom.test.ts` written after the component, red shown with an empty component
- [x] Frontend: «Beleg anzeigen», «Beleg ersetzen»/«Beleg hinzufügen», billed warning, keep-original hint on the invoice; delete confirmation names the Beleg (paths and test ids say `document`: no German in code strings)
  Test red: `invoices.test.ts` «nennt den Beleg …», `invoice-pages.dom.test.ts` «Beleg einer Rechnung» (4)
- [x] Privacy statement: invoice files to the KI (local and external text), stored Belege with purpose and retention (R-1, R-3)
  Test red: `privacy-page.dom.test.ts` (3 new) with the texts before this task
- [x] UI texts in de/fr/it/en (`docs/design/i18n-begriffe.md`: Beleg); `tests/a11y/screens.json` (`upload-dialog`, `upload-discard-dialog`; Beleg seeded on the detail screen), `accessibility.feature`, `sprachen-bildschirme.feature`: 48 rows of the invoice, tenant, privacy and document screens green
- [x] API contracts (`invoice.json` beleg, new `invoice-extraction.json`), `docs/api-specification.md`
- [x] Slice reviews (`code-reviewer`), feature review (personas, `fach-reviewer`)
  Slice 1 (backend, 90631a2..f63afb6) Skills: tdd, ponytail, ponytail-review (reuse: one mapping of the KI suggestion)
  Slice 2 (frontend, 56a2b3d..) Skills: tdd, ponytail, ponytail-review (app code typed its proposal from a test contract: own type); fallow: shared `proxyFile`, `UploadResult`, row and file chooser split
  code-reviewer round 3 (docs/reviews/upload-frontend-review-1.md, frontend and backend round-2 delta): backend delta C-12..C-15 confirmed; fixed C-16 (Major; test «markiert unsichere und nicht gefundene Werte …» red; Fälligkeitsdatum shown, `Field` note linked by aria-describedby), C-17 (Major; test «lehnt eine zu grosse Datei ab …» red), C-19..C-26, C-28 (tests where behavior), C-22 with C-16, C-27 open in #233; rejected C-18: the hint holds two sentences, so the step checks that it contains the decided one
  fach-reviewer round 2 (docs/reviews/upload-fachreview-2.md): fixed V-9 (Major; Gutschrift not preselected, test and scenario), V-10, V-11 (note on more than 3 pages), V-12 (backend test), M-5, R-6, R-7, R-8 (privacy tests red), T-1; open V-13, V-14 (Nits, #233); missing terms Gutschrift, Mahnung eines Rechnungsstellers added to #222
  persona round 1 (docs/design/personas/*-rechnungen-hochladen.md): product owner decided Weber P-1/Anna P-5/Marco P-2 (Akonto text), Weber P-2/Anna P-2/Marco P-3 (mixed: not preselected, how to split), Weber P-3/Helga P-3 (preselection stays, reason shown); fixed Sven P-1..P-9, P-12, P-13 (DOM tests), Anna P-3/Marco P-1 (result gets the focus), Anna P-4, P-6/Helga P-2 («Prüfen Sie: …»), Weber P-4, P-6, Helga P-4 (number on the invoice page), P-5/Marco P-5 (Beleg shown in a new tab), P-7/Marco P-10 (preview height), P-8, P-9, P-10, Marco P-4 (focus on the first field to fill), P-7, P-9; rejected Anna P-1 and Helga P-6: Playwright's `setFiles` with an «ü» in the path sends no change event (Helga's run), the scenario «Mehrere Rechnungen …» uploads «Gartenbau Grün ….png»; Weber P-5: `privacy_llm_external` names the whole file with names and addresses and the transfer on cancelling (section KI, not «Weitergabe an Dritte»); Sven P-10, Anna P-11, Marco P-8: the browser's own file button in the headless locale; Sven P-14: dialogs start on «Abbrechen» (Dialog.svelte, design decision); open (open work): issue #233 (Weber P-7, Anna P-7, P-8, P-9, P-10, Helga P-1, Helga P-4 in the edit form, Marco P-6 existed before, V-13, V-14, C-27), Sven P-11 → `offene-punkte.md`
  Slice 3 (review fixes) Skills: tdd, ponytail, ponytail-review; fallow: `DeleteConsequences`, stand-in `readsAs`, `localCategory` not exported
  Scenario red (slice 3, run on 3e3f99c with the new steps): «Schlussrechnung mit abgezogenen Akontozahlungen» – received the old hint; «Rechnung mit Kosten, die nicht umlagefähig sind» – received the old hint; «Mehrere Rechnungen …» – «Prüfen Sie: …» null; «Eine Gutschrift ist nicht zum Erstellen ausgewählt» – checked true; «Beleg einer Rechnung anzeigen» – shown false (download)
  Test red (slice 3): `invoice-upload.test.ts` (Gutschrift/Mahnung, nicht gefunden, 3 Seiten, Hinweistexte, eingetippte Werte, Kategorie und umlagefähig, fehlende Kategorie, selbst ausgefülltes Feld), `invoice-upload-dialog.dom.test.ts` (Feldhinweise, 2 Auswahlen, Abbrechen, Ergebnis-Fokus, Fortschritt, Fokus nach Entfernen, Gebäude-Erklärung, Knöpfe beschrieben, Sammelscan), `ui-dialog.dom.test.ts` (breit ohne Beschreibung; Tab über gesperrte Felder war in jsdom schon grün), `invoice-pages.dom.test.ts` (neuer Tab, Warnung nur mit Beleg, zu grosse Datei, keine Datei, Löschtext, Rechnungsnummer, Absage), `invoices.test.ts` (Choices einmal), `invoice-upload-endpoints.test.ts` (400 bei kaputtem Formular und JSON), `privacy-page.dom.test.ts` (R-7, R-8), backend `llm-extraction.test.ts` (V-12); written after the code, red shown on e029963a by taking the code out: «verlinkt eine schon erfasste Rechnung im selben Tab» – expected true to be false (target added), «gibt … den Fokus, wenn nichts erstellt wurde» – expected null to be 'true' (focusFirstError removed), «zeigt die Rechnungsnummer des Backends» – expected undefined to be 'R-1001', «lehnt es mit 400 ab …» – expected 200 to be 400
  code-reviewer round 4 (docs/reviews/upload-frontend-review-2.md): merge resolution confirmed; C-16..C-26, C-28 confirmed; fixed C-29 (Major: the scenario-red line above, red shown on 3e3f99c), C-30 (the test-red line above), C-31 (contract `invoiceNumber`, load test), C-32 (400 for invalid JSON), C-33 (tests; `oncreated` after discarding untested, C-39), C-35, C-36 (test), C-37, C-38 (C-27 is open in #233, not fixed); rejected C-34: one config request more on two pages costs less than a second variant of `invoiceChoices`
  fach-reviewer round 3 (docs/reviews/upload-fachreview-3.md): V-9 Major confirmed fixed; fixed M-5 (last sentence of the delete text names the Originalrechnung, test), V-15 (test), V-16 (scenario title), T-1 (fr with M-5); T-2 needs the product owner: proposed term in #222
  code-reviewer round 5 (docs/reviews/upload-frontend-review-3.md): no Blocker/Major; C-29, C-31, C-32, C-35..C-38 confirmed, C-34 rejection accepted; fixed C-30/C-40 (red of the tests written after the code shown, line «Test red (slice 3)»); open as Minor/Nits in #233: C-39, C-41, C-42 (fixing them would change code for another round without a Blocker/Major)
  fach-reviewer round 4 (docs/reviews/upload-fachreview-4.md): M-5, V-15, V-16, T-1 confirmed fixed; open M-6 (Nit, delete text tells what to do with the Beleg; decided text M-3, needs the product owner) → comment in #233; T-2 waits in #222
  persona round 2 (docs/design/personas/*-rechnungen-hochladen-2.md): no Blocker/Major; round-1 findings answered as listed there; fixed Anna P-1/Helga P-1/Weber P-5 (a missing Kategorie is named in «Prüfen Sie: …», test); open as Minors/Nits in #233: Weber P-3, P-4, Sven P-1..P-5, Anna P-2..P-5, Helga P-2..P-6, Marco P-1 rest, P-9, P-10
  code-reviewer round 1 (docs/reviews/upload-backend-review-1.md): fixed C-1 (Major; test «lässt ein Datum mit unmöglichem Monat leer …» red, `isRealDate` no longer throws), C-2, C-3 (tests), C-4 (code EXTRACTION_UNAVAILABLE), C-5 (code BELEG_NOT_FOUND, invoice checked before the file), C-6 (transaction; no test: a failing insert after the file check cannot be produced), C-7, C-8, C-9, C-10, C-11
  code-reviewer round 2 (docs/reviews/upload-backend-review-2.md): C-1..C-11 confirmed fixed; fixed C-13 (test), C-14 (`isRealDate` moved to `services/real-date.ts`), C-15 (test red: `-2`, `1.5`, `true` counted); C-12: the texts of the dialog and the privacy statement stay in this branch, their tests come with slice 2 (frontend)
  code-reviewer merge round 1 (docs/reviews/upload-merge-review-1.md, merge 7579d685 of origin/main; migration renamed to `0005_invoice_documents.sql`): no Blocker/Major; fixed C-1 (O-29 removed, 01dda352)
- [x] Before marking complete: all checks in `CLAUDE.md` on the merge 7579d685: test:coverage (157 files, 2576), lint, check, backend test (650/0) + type-check, E2E chromium+api of invoices, invoice-detail/-new/-edit, tenant-documents, documents, privacy, categories-ki, apartments (74), axe/language rows of invoice*, tenant-detail, privacy, documents (50); merge of origin/main (migration renamed `0005_invoice_documents.sql`)
- [x] Workflow review `docs/reviews/workflow-rules-review-issue-217.md` (W-1..W-8)
- Found: `swiss-today.pg.test.ts` fails in its cleanup on `origin/main` too (utility_statements still reference the apartment) → row O-29 in `docs/design/offene-punkte.md`; fixed on `main` (a7f0dcab) and merged, row removed

Files: `backend/migrations/0005_invoice_documents.sql`, `backend/src/{db/schema.ts,config/llm.ts,routes/invoices.ts,routes/file-response.ts}`, `backend/src/services/{invoice,document,llm,real-date}.service.ts`, `backend/scripts/llm-stub.ts`, `src/lib/{invoice-upload.ts,file-pages.ts,api.ts}`, `src/lib/ui/{Dialog,Field,Button,TextInput,DateInput,MoneyInput,Textarea}.svelte`, `src/lib/server/{invoice.ts,file-proxy.ts}`, `src/routes/invoices/*` (upload dialog and rows, detail `InvoiceBeleg`, `DeleteConsequences`, `InvoiceFacts`), `src/routes/api/invoices/{extract,[id]/document}`, `src/routes/invoices/[id]/document/+server.ts`, `messages/*.json`, tests in `src/__tests__/`, `backend/src/__tests__/`, `tests/e2e/` (features, steps, screenplay, fixtures), `tests/a11y/screens.json`, `tests/contracts/{invoice,invoice-extraction}.json`, docs (`api-specification`, `data-model`, `tech-stack`, README, `.env.example`, docker-compose, `i18n-begriffe`, `offene-punkte` O-30, personas README, `persona-stack.sh`), `UBIQUITOUS_LANGUAGE.md` (Beleg, on request), reviews `docs/reviews/upload-*`, `docs/design/personas/*-rechnungen-hochladen*.md`, `docs/reviews/workflow-rules-review-issue-217.md`.

## Session 2026-10-16 (14): persona kit finds Playwright wherever the repo is checked out

Request (chat): `docs/design/tools/persona-kit.mjs` resolved `package.json` from `/home/user/Dwello`; in cloud sessions checked out as `/home/user/dwello` it could not load Playwright, and every persona copied and patched the kit (five times in the persona runs of #217). No scenario: tooling of the persona runs.

- [x] `persona-kit.mjs`: `createRequire(new URL('../../../package.json', import.meta.url))`, resolved from the kit itself
- [x] `.claude/agents/persona.md`, `docs/design/arbeitsregeln.md`: import the kit in place instead of copying it (a copy would resolve `package.json` from the scratchpad); `persona-stack.sh` already resolves its own path on `main`
- [x] Smoke run: `persona-stack.sh`, a script in the scratchpad imports the kit and opens `/login` (200, signed in, redirected to `/dashboard` «Übersicht - Dwello»), also from a worktree checked out as `…/lc/dwello`
  Skills: none loaded (one-line tooling fix); no tdd: the kit has no test layer, the smoke run shows it
- [x] Checks: lint (first run red: `'URL' is not defined` in the kit, fixed), check (0 errors), test:coverage (2486), backend test (630) + type-check, fallow and deepcheck gates
- [x] code-reviewer round(s)
  code-reviewer round 1 (`docs/reviews/persona-kit-review-1.md`; general-purpose subagent with `.claude/agents/code-reviewer.md`, the agent type is not registered in this session): fixed C-1 (Minor, items ticked before done), C-2 (Minor, no `Skills:` line)
- [x] Archive session, push, PR (opened after archiving)

Files: `docs/design/tools/persona-kit.mjs`, `.claude/agents/persona.md`, `docs/design/arbeitsregeln.md`, `docs/reviews/persona-kit-review-1.md`.

## Session 2026-10-16 (13): #209 statement PDF recomputes the heating share with the current Heizprofil

Request (chat): work through the open bug issues one by one (sessions 10 to 12 in the archive); this is the fourth and last one without `entscheiden`, #208 merged in #228.

Cause: `heatingOf` (`backend/src/services/statement-pdf.service.ts`) calls `handleMidYearMoves` with the profile as it is when the PDF is made; the line amounts were calculated with the profile as it was when the statement was created. Plan: the calculation returns the heating share and the month list it used, the statement stores them (new jsonb column `heating_share`, migration `0004`), the PDF prints them; a statement created before keeps today's recomputation.

- [x] Scenario «PDF zeigt den Heizanteil, mit dem die Abrechnung erstellt wurde» (`statement-detail.feature`, `@wip`) red
  Scenario red: `steht im PDF "43.00 % der Heizkosten"` – the PDF shows the share by the changed profile (Januar 30 + Februar 20 + März 10)
- [x] fach-reviewer on the `@wip` scenario before implementing
  fach-reviewer round 1 (`docs/reviews/issue-209-fachreview-1.md`): fixed F-1 (Major, the profile's names are stored too, so a renamed or deleted own profile is still named), F-2 (Major, «shared by days» is stored as `{ byDays: true }`, null means created before), F-4 (Minor, the scenario checks the line «43.00 % 430.00»; F-1 and F-2 shown in pg tests), F-5 title (scenario renamed without a new term); open F-5 terms (Minor) -> #75; F-3 (Minor, older statements), F-6 (Minor, existed before, months of a short period do not add up to the printed percent), F-7 (Minor, detail page names the current profile) -> #229; F-8 (Nit, help text or block when an own profile changes) -> #230 (`entscheiden`)
- [x] Test first (`statement-pdf.pg.test.ts`: a statement with a custom profile, the profile changes, the PDF keeps the share), column `heating_share` (migration `0004_statement_heating_share.sql`, `schema.ts`, `docs/data-model.md`), calculation returns it (`heatingOfRun`), statement stores it with the profile's names, PDF prints it
  Test red: «druckt den Anteil und die Monate, mit denen die Abrechnung gerechnet ist» – the note with the changed profile's 40 %; «nennt das Heizprofil auch nach dem Umbenennen und Löschen …» – no profile note after the deletion; «bleibt bei den Mietstagen, wenn das Heizprofil später den Monaten der Periode einen Anteil gibt» – the changed profile's note instead of 62/92 Tage
  Skills: tdd, ponytail, ponytail-review (no findings)
- [x] Checks: test:coverage (2486), lint, check, backend test (630) + type-check, deepcheck:audit, `bunx fallow audit`, E2E chromium + api on all statement features, dashboard and heating profiles (120 passed)
- [x] code-reviewer round(s)
  code-reviewer round 2 (`docs/reviews/issue-209-review-2.md`): C-1 to C-4 confirmed; fixed C-5 (Nit, the fallback test's name and comment say what it shows and name #229), C-6 (Nit, plan wording); the branch without a profile in `heatingOfRun` has no own test: the foreign key of `heating_profile_id` refuses a statement with an unknown profile, so it is reached only if the profile is deleted between calculation and saving
  code-reviewer round 1 (`docs/reviews/issue-209-review-1.md`): fixed C-1 (Minor, test «rechnet bei einer früher erstellten Abrechnung mit dem Heizprofil, wie es jetzt ist», red without the fallback), C-2 (Minor, `docs/api-specification.md` names `heating` of the preview and `heatingShare` of the detail), C-3 (Nit, `heatingOfRun` reads the profile and its names itself; the helper with two non-null assertions is gone; `handleMidYearMoves` reads the profile once more), C-4 (Nit, double blank line gone with it)
- [x] Feature review: fach-reviewer, daten-pruefer (PDF, statements), persona Dr. Weber only if a PDF text changes (none changes: no persona)
  fach-reviewer round 2 (`docs/reviews/issue-209-fachreview-2.md`): F-1, F-2, F-4, F-5 title confirmed, hand-offs #229, #230, #75 confirmed; fixed V-1 (Nit, `docs/data-model.md`: empty also without heating costs), V-2 (Nit, the fallback test names #229)
  daten-pruefer round 1 (`docs/reviews/issue-209-datenpruefung-1.md`; a first run was lost to a container restart and started again): all 17 demo statements to the Rappen, unchanged since #208, `heating_share` right in all (15 by days, two moves by the profile with names), PDFs in four languages and 14 QR-bills right; fixed D-1 (Nit, the stored percent was unrounded, 44.199999…; stored on two places like the months; test «speichert den Anteil nach dem Heizprofil auf zwei Stellen», red with 44.199999999999996); observation (detail page names the linked profile) -> already #229 (F-7)
- [x] Fixes of the feature review as a new slice (Workflow 7)
  Skills: tdd, ponytail, ponytail-review (no findings)
  code-reviewer round 1 of this slice (`docs/reviews/issue-209-review-3.md`): rounding confirmed (the note equals the earlier one); open C-1 (Minor, existed before: note and line can differ by 0.01 % on an exact half-way share) -> #229; fixed C-2 (Minor, this Skills line), C-3 (Nit, this item ticked only with its round)
- [x] Workflow review `docs/reviews/workflow-rules-review-issue-209.md`
- [x] Archive session, push, PR `Fixes #209`, CI, merge (pull request opened after archiving; merge follows green CI)

Files: `backend/src/services/{calculation,statement,statement-pdf}.service.ts`, `backend/src/db/schema.ts`, `backend/migrations/0004_statement_heating_share.sql`, `backend/src/__tests__/statement-pdf.pg.test.ts`, `tests/e2e/features/statement-detail.feature`, `tests/e2e/steps/statement-detail.steps.ts`, `tests/e2e/fixtures/backend.ts`, `docs/data-model.md`, `docs/api-specification.md`, `docs/reviews/issue-209-{fachreview-1,fachreview-2,datenpruefung-1,review-1,review-2,review-3}.md`, `docs/reviews/workflow-rules-review-issue-209.md`

## Session 2026-10-16 (14): #229 Heizprofil share in statements: older PDFs, short periods, detail page

Request (chat): after the bugs, work through the open issues without `entscheiden` whose «Done means» needs no confirmation, one pull request each; this is the first, a follow-up of #209.

Plan: F-6: the stored share also keeps the period's sum (`periodPercent`); the PDF adds «zusammen x % von y % der Abrechnungsperiode» to the month list (new text, four languages). F-3: a statement created before #209 prints the month list only when the recomputed share equals its heating position's `period_share`, and takes the percent from that position. F-7: the detail page names the profile as stored. Rounding (comment on the issue): the stored percent is computed as `period_share`, so note and line show one value.

- [x] Scenario «PDF nennt bei einer Periode unter einem Jahr die Monatsanteile der Periode» (`statement-detail.feature`, `@wip`) red
  Scenario red: `steht im PDF "zusammen 43.00 % von 50.00 % der Abrechnungsperiode"` – the PDF lists the months without their sums (86.00 % and the months are there); the wording changed after fach-reviewer F-1 to «zusammen 43.00 %. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen 50.00 %»
- [x] fach-reviewer on the `@wip` scenario and the new text before implementing
  fach-reviewer round 1 (`docs/reviews/issue-229-fachreview-1.md`): fixed F-1 (Major, «43 % von 50 %» read as a product and as half the period: new wording «; zusammen x %. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen y %», without the proposed division because of F-2), F-2 (Minor, part: the tenant's sum from the printed months; whether the share should follow the rounded months changes amounts -> #232 `entscheiden`), F-3 (Minor, the clause whenever the period does not carry 100.00 %, also over a year or with a profile at 100.05 %), F-4 (Minor, a whole-year test checks no clause), F-5 (Nit, scenario title «… die Summen der Monatsanteile»), F-6 (Nit, non-breaking space before «%»); F-7 (Nit, the period's months are not listed) and F-8 (Nit, the old-statement check compares the result only) -> #232
- [x] F-6: test first, `periodPercent` stored (from `handleMidYearMoves`), PDF text `heatingPeriodSums` in de/fr/it/en
  Test red: «nennt bei einer Periode unter einem Jahr die Summen der Monate» – the month list without the sums
- [x] F-3: test first (statement without `heating_share`, profile changed: no months, percent from the line); `heatingOf` split into stored and `recomputedHeating` (fallow CRAP)
  Test red: «nennt bei einer früher erstellten Abrechnung keine Monate, die nicht mehr zum Anteil passen» – 40.00 % with the changed profile's months
- [x] F-7: test first (detail page names the stored profile; `tests/contracts/statement.json` names `heatingShare`)
  Test red: «nennt das Heizprofil, wie die Abrechnung es gespeichert hat» – expected 'Standard' to be 'Winter'
- [x] Rounding: test first (half-way share 70.975 %: note and line equal), the stored percent computed like `period_share`
  Test red: «nennt in der Erläuterung denselben Anteil wie in der Position» – note 70.97 %, line 70.98 %
  Skills: tdd, ponytail, ponytail-review (no findings)
- [x] Checks (final): test:coverage (2487), lint, check, backend test (636) + type-check, deepcheck:audit, `bunx fallow audit`, E2E chromium + api on all statement features, dashboard and heating profiles (123 passed)
- [x] code-reviewer round(s)
  code-reviewer round 1 (`docs/reviews/issue-229-review-1.md`): fixed C-1 (Major, scenarios «Abrechnung nennt ihr Heizprofil auch nach dem Umbenennen» and «PDF nennt in der Erläuterung denselben Anteil nach dem Heizprofil wie in der Position», each red with its fix taken out: «Heizprofil Sommer …» instead of «Winter …», and no «70.98 % der Heizkosten»; F-3: No scenario: a statement created before #209 has no `heating_share`, a state the E2E stack cannot produce, as it creates every statement with the current code; the pg tests show it), C-2 (Minor, an older statement of a short period prints the sums too), C-3 (Minor, the older-statement check rounds as the calculation; test «nennt bei einer früher erstellten Abrechnung die Monate und Summen, solange sie zur Position passen», red: no months on the half-way share), C-7 (Nit, scenario-red line), C-8 (Nit, variable name); rejected C-4: the contract's `heatingShare` stays `null` because the API test's statement has no heating invoice (code review round 2, C-11), the names' shape is typed in `schema.ts` and set by `heatingOfRun`; C-5 (Minor, an older statement shared by days whose profile now gives months names the profile; existed before) -> comment on #232; C-6 (Minor, a statement shared by days names the profile as it is now on the detail page) -> comment on #227
  Scenario red (C-1): «Abrechnung nennt ihr Heizprofil auch nach dem Umbenennen» – `nennt die Abrechnung das Heizprofil "Winter"`: received «Heizprofil Sommer …»; «PDF nennt in der Erläuterung denselben Anteil …» – `steht im PDF "70.98 % der Heizkosten"`: the note said 70.97 %
  Test red (C-2, C-3): «nennt bei einer früher erstellten Abrechnung die Monate und Summen, solange sie zur Position passen» – no «Anteile der Monate» on the half-way share
  code-reviewer round 2 (`docs/reviews/issue-229-review-2.md`): C-1 to C-3, C-7, C-8 confirmed, rejection of C-4 holds; fixed C-9 (Nit, these red lines), C-10 (Nit, the older whole-year statement prints no sums), C-11 (Nit, reason of C-4)
- [x] Feature review: fach-reviewer, daten-pruefer, persona Dr. Weber (PDF text), persona for the detail page if its text changes (no text changes there)
  fach-reviewer round 2 (`docs/reviews/issue-229-fachreview-2.md`): F-1 to F-6 confirmed, hand-offs to #232 confirmed; fixed V-1 (Minor, a share stored under #209 had the old rounding and no period sum: the note takes the heating position's share; test «nennt bei einer unter #209 gespeicherten Abrechnung den Anteil der Position», red: 70.97 %), V-2 (Nit, English «in total»)
  Test red (V-1): «nennt bei einer unter #209 gespeicherten Abrechnung den Anteil der Position» – the note printed 70.97 %
- [x] Fixes of the feature review as a new slice (Workflow 7)
  Skills: tdd, ponytail, ponytail-review (no findings)
  code-reviewer round 1 of this slice (`docs/reviews/issue-229-review-3.md`): V-1 confirmed; fixed C-12 (Minor, render test «nennt bei einer Periode unter einem Jahr die Summen der Monate, auch auf Englisch», red with «together»), C-13 (Minor, this Skills line), C-14 (Nit, the Test red line above)
  daten-pruefer round 1 (`docs/reviews/issue-229-datenpruefung-1.md`): 17 statements, amounts, stored shares, PDFs in four languages and the QR-bill right; the clause's case (a period under a year with a move) is not in the demo data -> round 2 after the persona creates it
  persona Dr. Weber round 1 (`docs/design/personas/weber-issue-229.md`): no review: the four demo drafts 2025 of «Seepark Residenz» overlap the period 01.01.–30.09.2025, the persona may not delete them -> run again after deleting them in `dwello_persona` by SQL
  persona Dr. Weber round 2 (`docs/design/personas/weber-issue-229-2.md`; the four drafts deleted by SQL first, `DELETE FROM utility_statements … building 22222222-…, period_start 2025-01-01, status draft`): the share recomputes (55.80 / 66.80 = 83.53 %); fixed P-2 in part (Minor, the clause ends with a full stop, four languages; tests pin it, red without); P-1 (Minor, the period's months are not listed) and the division of P-2 -> already #232 (F-7, F-2); P-3, P-4 (Nit, existed before: no pointer from the line to page 2, «Heizkosten Ihrer Wohnung» against «Wohnungsanteil») and observations -> `offene-punkte.md` U-38
  daten-pruefer round 2 (`docs/reviews/issue-229-datenpruefung-2.md`): the four drafts 01.01.–30.09.2025 of «Seepark Residenz» to the Rappen, stored shares (83.53 % and 16.47 % of 66.80 %), the clause in four languages and the QR-bill right; no findings
- [x] Workflow review `docs/reviews/workflow-rules-review-issue-229.md`
- [x] Archive session, push, PR `Fixes #229`, CI, merge (pull request opened after archiving; merge follows green CI)

Files: `backend/src/services/{prorating,calculation,statement-pdf,pdf}.service.ts`, `backend/src/db/schema.ts`, `backend/src/__tests__/{statement-pdf.pg,statement-pdf-render}.test.ts`, `src/lib/server/statement.ts`, `src/__tests__/statement-mapping.test.ts`, `tests/contracts/statement.json`, `tests/e2e/features/statement-detail.feature`, `tests/e2e/steps/statement-detail.steps.ts`, `tests/e2e/fixtures/backend.ts`, `docs/design/offene-punkte.md`, `docs/design/personas/weber-issue-229{,-2}.md`, `docs/reviews/issue-229-{fachreview-1,fachreview-2,datenpruefung-1,datenpruefung-2,review-1,review-2,review-3}.md`, `docs/reviews/workflow-rules-review-issue-229.md`

## Session 2026-10-16 (glossary from the entscheiden round)

Task: add to `UBIQUITOUS_LANGUAGE.md` the terms the product owner decided in the issues, at the product owner's request in this session (CLAUDE.md says Claude never edits the glossary; the product owner asked for it explicitly).

- [x] Glossary entries and changes from #56, #58, #62, #63, #68, #75, #79, #85, #100, #102, #120, #133, #140, #205, #222, #239
- [x] Checks: test:coverage (2577), lint, check, backend test (656) + type-check; no E2E (docs only)
- [x] fach-reviewer round on the diff
  fach-reviewer round 1 (`docs/reviews/glossary-decisions-fachreview-1.md`): fixed V-1 (Major), V-2 (Major, product owner confirmed changing the #239 wording), V-3, M-1, M-2 (product owner: with «Ersatzmieter»), V-4, V-5, V-6, M-3, V-7, V-8, V-9 (V-4, V-7, V-9 decided by the product owner in this session), V-11, V-12, V-13, V-14, V-16, V-17, V-18, V-19; open V-10 (Minor, requirement docs follow with #79, #120: comments there), V-15 (Nit) and the missing terms -> #243
  fach-reviewer round 2 (`docs/reviews/glossary-decisions-fachreview-2.md`): round-1 fixes confirmed; fixed V-20 (Minor), M-4 (Minor, wording of Art. 264 Abs. 1 OR), V-21 (Nit), V-22 (Nit); no re-review: Minor/Nit wording in docs only (Workflow 6)
- [x] Archive session, push, PR (`Refs` the issues: their implementation is still open), CI, merge

Files: `UBIQUITOUS_LANGUAGE.md`, `docs/reviews/glossary-decisions-fachreview-{1,2}.md`

## Session 2026-10-16 (15): #226 statement PDF: a position over different Leistungszeiträume cannot be recomputed

Request (chat): work through the open issues without `entscheiden` one by one (session 14 in the archive); this is the second, #229 merged in #235.

Plan: the line items keep the days of each invoice when any invoice of the position bills other days than the whole period (new jsonb column `invoice_parts`: start, end, amount in the period, the tenant's days, the days billed; migration `0006`, renumbered after #238 took `0005`); the PDF lists them under the position («01.07.2025 – 30.09.2025: 1'200.00, 47/92 Tage») with the formula that weighs them, so the weighted share can be recomputed and the denominator of a single Leistungszeitraum is checkable (comment V-3); positions with stored parts never use the fallback «Mietstage / Tage der Periode» (comment C-5).

- [x] Scenario «PDF nennt bei Rechnungen über verschiedene Leistungszeiträume die Tage jeder Rechnung» (`statement-detail.feature`, `@wip`) red
  Scenario red: `steht im PDF "01.04.2025 – 30.06.2025: 900.00, 0/91 Tage"` – Expected substring not in the PDF text (b170c5cc); after fach-reviewer V-2 the amounts became 600/1'200 and a formula line was added (cf49fa58): these changed expectations were not run red in E2E, the same lines are shown red at the pg layer (tests below)
  Test red: `statement-pdf.pg.test.ts` «druckt den Anteil in Prozent, wenn die Rechnungen einer Position verschiedene Tage abrechnen» – Expected to contain "01.06.2025 – 30.06.2025: 600.00, 16/30 Tage"
- [x] fach-reviewer on the `@wip` scenario and the planned PDF lines before implementing
- fach-reviewer round 1 (docs/reviews/226-fachreview-1.md): fixed V-1 (Major: formula line «(600.00 × 0/91 + 1'200.00 × 47/92) / 1'800.00 = 34.06 %» under the invoices), V-2 (amounts 600/1'200 in the scenario), V-4 (the formula gives «Ihr Anteil» exactly as Wohnungsanteil × it), V-5 (rule 5 names the lines; a tenant over the whole period keeps «x/x Tage» as rule 5 says, without lines; C-5 test with 1'810/1'840), V-7 (one muted line per invoice, kept with its position on a page break; render test), V-6 for #226 (no lines when the invoices sum to zero; test); open V-3, V-8 (#236), the rest of V-6 (#237)
- [x] Test first (`statement-pdf.pg.test.ts`), column `invoice_parts` (migration, `schema.ts`, `docs/data-model.md`), calculation stores it, PDF prints it, fallback only without parts
  No red: «druckt keine Rechnungen unter einer Position, deren Rechnungen zusammen null ergeben» guards the new code (passes before it, since nothing was printed then; it fails if `daysOf` stores parts for a zero sum)
  Test red: «druckt bei Rechnungen über verschiedene Tage die Rechnungen, auch wenn der Anteil den Mietstagen entspricht» – Expected to contain "(1'810.00 × 0/181 + 1'840.00 × 139/184) / 3'650.00 = 38.08 %"
  Test red (written after the code, shown by taking it out): render test «hält die Rechnungen beim Seitenwechsel bei ihrer Position» – Expected 5 table headers, received 3 (without the `room()` for the lines); «nennt die Tage jeder Rechnung auch auf fr/it/en» – red with «Tage» hard-coded
  Scenario red after the code: the E2E PDF reader (`backend/src/__tests__/helpers/pdf-text.ts`) under Node decodes `windows-1252` as Latin-1, so «–» read as U+0096; fixed with the 0x80–0x9F table (Bun was right already)
  Files: `backend/migrations/0006_line_item_invoice_parts.sql`, `backend/src/db/schema.ts`, `backend/src/services/{calculation,statement,statement-pdf,pdf}.service.ts`, `backend/src/__tests__/{statement-pdf.pg,statement-pdf-render}.test.ts`, `backend/src/__tests__/helpers/pdf-text.ts`, `docs/data-model.md`, `docs/nebenkostenabrechnung-anforderungen.md` (rule 5), `tests/e2e/features/statement-detail.feature`
  Skills: tdd, ponytail, ponytail-review (shrink: `LineItem.invoiceParts` takes null, no mapping helper)
- [x] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, affected E2E (on 3067d30b: backend 647 pass, 93.8 % lines; test:coverage 2487 passed; lint, check, type-check clean; full E2E chromium+api 731 passed)
- [x] code-reviewer round(s)
- code-reviewer round 1 (docs/reviews/226-review-1.md): fixed C-1 (height of the position measured, `positionHeight`), C-2 (`room()` only for a position with lines), C-3 (= P-1), C-4 and C-5 (plan lines), C-6 (`rentalShare` uses `rentedIn`); rejected C-7: `LineItem.periodShare` is optional, the check narrows its type
  Test red: render test «hält die Rechnungen auch bei einer langen Kategorie nach %i Positionen bei ihr» (20, 21, 62; found by sweeping 0–69) – the formula on the next page, 3 fail on cf49fa58; per-page text added to `readPdf` (`pageTexts`)
- [x] Feature review: fach-reviewer, daten-pruefer, persona Dr. Weber (PDF text)
- persona Dr. Weber (docs/design/personas/dr-weber-226.md): fixed P-1 (Major: the note under the table did not explain positions over different days; clause `sharesNoteParts` in four languages, `sharesNoteDays` also for positions with lines), P-2 and P-3 (the same clause names «Ihre Mietstage darin von dessen Tagen» and that the lines are the invoices; amounts in the «(CHF)» table); rejected P-4: the PDF prints the rounded Wohnungsanteil 784.13, and 784.13 × 50 % is the printed 392.07
  Test red: render test «erklärt die Rechnungen unter der Position und ihre Gewichtung nach den Beträgen» – Expected to contain «… bei Rechnungen über verschiedene …» (4e18ec6e); the pg expectation `not.toContain('Ihre Mietstage darin')` inverted
  Setup: SQL in `dwello_persona` deleted Nina Brunner's draft 2025 before the run; the persona created NK-22222222-2025-0005
  Beobachtungen (checked against `main`: all exist before #226, which changed only the PDF): the dashboard/invoice-form contradiction added to #211; the rest collected in #240 (`entscheiden`); the heating note was praised
- code-reviewer round 2 (docs/reviews/226-review-2.md): C-1 to C-6 confirmed fixed, C-7 rejection holds; fixed C-8 (the new clause in fr/it/en with «poste du décompte», «voce del conteggio», «statement line» from `docs/design/i18n-begriffe.md`), C-9 (plan lines below), C-10 (the render test checks the clause in fr/it/en)
  Test red: «nennt die Tage jeder Rechnung und ihre Gewichtung auch auf fr/it/en» – 3 fail with «position»/«posizione» (53b3db99)
- code-reviewer round 3 (docs/reviews/226-review-3.md): C-8, C-9, C-10 confirmed fixed, no new Blocker/Major; fixed C-11 (Nit: «Test red» for the whole-period test of V-12)
- persona Dr. Weber round 2 (docs/design/personas/dr-weber-226-2.md, task only on the new note): P-1 of round 1 confirmed fixed (the note leads to 392.07); open P-1, P-2, P-3 (Minor), P-4 (Nit) of round 2: readability and labels, with the persona's proposals in #241 (`entscheiden`); Beobachtungen before #226 added to #240
- fach-reviewer round 2 (docs/reviews/226-fachreview-2.md): fixed V-9 (= P-1), V-11 («Berechnung» in rule 5 and the scenario comment), V-12 (tests: no lines for a tenant over the whole period; a mixed position with an invoice without Leistungszeitraum); Test red (written after the code, shown by taking it out): the whole-period test fails without the whole-period check in `daysOf`; No red: the second pins the whole-period dates of an invoice without Leistungszeitraum, behaviour the slice already had; open V-10 (#239, `entscheiden`: term «Veränderung Tankbestand»)
- daten-pruefer round 1 (docs/reviews/226-datenpruefung-1.md): fixed D-1 (= P-1); amounts, `invoice_parts`, lines and formula of NK-22222222-2025-0005 recomputed to the Rappen; not confirmed: fr/it/en PDF (covered by the render tests)
- [x] Workflow review `docs/reviews/workflow-rules-review-issue-226.md`
- [x] Archive session, push, PR `Fixes #226`, CI, merge (pull request opened after archiving; merge follows green CI)
- Merged `origin/main` (0d970be0, #238) without conflicts (e6d88e55); #238 took migration `0005`, so this branch's migration became `0006_line_item_invoice_parts.sql` (23cd2f35); `bun install` for `pdfjs-dist` of #238
- code-reviewer round 4 (docs/reviews/226-review-4.md, merge and renumbering): no Blocker/Major; fixed C-12 (these lines); C-13 (Nit, two «Session … (15)» in the archive) left: the archive's numbering was already mixed on main
- Checks on the merged tree: backend 667 pass, 93.9 % lines; type-check, lint, check, fallow, deepcheck:audit clean; test:coverage 2577 passed; full E2E chromium+api 750 passed, 1 failed («Beleg ersetzen», #217, passes alone three times; O-31 in `docs/design/offene-punkte.md`)
- CI E2E red twice on #242 (dda043d green on its one re-run, 4275652 red; log and report not readable: blob storage outside the session's network policy); found locally in one of two full runs: «Beleg ersetzen» (`invoice-detail.feature`, #217) opened the old Beleg («huber-q1.pdf») because the step opened it before the upload was saved. Fixed in `tests/e2e/steps/invoice-upload.steps.ts`: the step waits for «Beleg <Datei> gespeichert»; O-31 removed. Shown red: 1 failed in the full run before the fix (Received "huber-q1.pdf")
- code-reviewer round 5 (docs/reviews/226-review-5.md, the step fix): no Blocker/Major; fixed C-14 (comment named the removed O-31); rejected C-15: waiting in the step follows `tenants.steps.ts` and `contract-form.steps.ts`

Files: `backend/migrations/0006_line_item_invoice_parts.sql`, `backend/src/db/schema.ts`, `backend/src/services/{calculation,statement,statement-pdf,pdf}.service.ts`, `backend/src/__tests__/{statement-pdf.pg,statement-pdf-render}.test.ts`, `backend/src/__tests__/helpers/pdf-text.ts`, `docs/data-model.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `tests/e2e/features/statement-detail.feature`, reviews in `docs/reviews/226-*.md`, `docs/reviews/workflow-rules-review-issue-226.md`, `docs/design/personas/dr-weber-226{,-2}.md`. Issues opened: #236, #237, #239, #240, #241; comments on #211, #240.

## Session 2026-10-16 (glossary #243)

Task: add the terms the product owner decided in #243 to `UBIQUITOUS_LANGUAGE.md`, at the product owner's request (as in #244), and remove the two `TODO(fachlich prüfen, #75)` markers the glossary now answers.

- [x] Glossary: Abgerechnete Tage, Mietstage der Position, Monatsanteil, Anteil nach Heizprofil, Hinweis auf fehlende Abrechnungen; Saldo 0.00 and the PDF sign of the rounding; «Zeitanteil» refers to the new terms
- [x] Markers `#75` removed from `backend/src/db/schema.ts` and `backend/src/services/pdf.service.ts` (comments only)
- [x] Checks: test:coverage (2606), lint, check, backend test (670) + type-check; no E2E (docs and comments only)
- [x] fach-reviewer and code-reviewer round
  code-reviewer round 1 (`docs/reviews/glossary-243-review-1.md`): fixed C-1 (Minor, «No scenario» in the PR text), C-2 (Nit), C-3 (Nit)
  fach-reviewer round 1 (`docs/reviews/glossary-243-fachreview-1.md`): fixed V-1 (Major, product owner confirmed changing the #243 wording), V-2 (Major, existed before: «geplant (#79)»), V-3, V-4, V-5, V-6, V-7, V-9, V-10, V-11, V-12; V-8 fixed with V-1 («über die Mietstage»)
  fach-reviewer round 2 (`docs/reviews/glossary-243-fachreview-2.md`): V-1 to V-12 confirmed; fixed V-13, V-14, V-15 (Nits); no re-review (Nits in docs)
- [x] Archive session, push, PR `Fixes #243` with «No scenario: glossary and comments only, no behaviour change», CI, merge
  Skills: none (no behaviour change; tdd and ponytail do not apply to glossary text and comment removal)

Files: `UBIQUITOUS_LANGUAGE.md`, `docs/reviews/glossary-243-{review-1,fachreview-1,fachreview-2}.md`, `backend/src/db/schema.ts`, `backend/src/services/pdf.service.ts`

## Session 2026-10-16 (16): #241 statement PDF: shorter note and labelled invoice lines

Request (chat): work through the open issues one by one; before each, check its related issues and do them too, one pull request each (CLAUDE.md, Workflow 8). Related to #241: #239 and #236 (the same invoice lines, next), #237 (waits for the product owner since 16.10.: the credit case cannot be entered in the app, comment there), #75 (glossary, product owner). Decision issues #240 and #227: their implementation issues to open.

Plan: the decided texts of #241 (P-1 note in short sentences, P-2 labelled lines, P-3 the step to «Ihr Anteil») in `backend/src/services/pdf.service.ts` (`sharesNote`, `partLines`), in de/fr/it/en.

- [x] Scenario «PDF nennt bei Rechnungen über verschiedene Leistungszeiträume die Tage jeder Rechnung» (`statement-detail.feature`) updated, `@wip`, red
  Scenario red: `steht im PDF "Leistungszeitraum 01.04.2025 – 30.06.2025: CHF 600.00, Ihre Mietstage 0 von 91 Tagen"` – Expected substring not in the PDF text
- [x] Decision issues: #227 → implementation issue #247, closed; #240 → #248 to #253, its detail-page point added to #104 and its recalculation point to #132, closed
- [x] fach-reviewer on the scenario and the fr/it/en wording before implementing
- fach-reviewer round 1 (docs/reviews/241-fachreview-1.md): V-1 (Major), V-2, V-6, V-7, V-8 asked in the chat and decided by the product owner (16.10.2026, recorded in #241): fixed V-1 (lines «Ohne Leistungszeitraum: …» and «Leistungszeitraum … (Rechnung CHF …), davon …», the latter the first point of #236), V-2 (percentage kept, note «Der Prozentwert ist gerundet; …»), V-6, V-7, V-8 (P-1 corrected); fixed V-3 (pinned old texts: scenario line in «PDF erklärt …», pg and render tests), V-4 (rule 5), V-5 (`t.colon` in the lines), V-10 (word order fr/en), V-11 (row «Leistungszeitraum» in `docs/design/i18n-begriffe.md`); rejected V-9: the lines name the divisor («von 92 Tagen»)
- [x] Render tests in four languages first (`statement-pdf-render.test.ts`), pg tests updated, then `pdf.service.ts`
  Test red: «beschriftet jede Rechnung mit ihrem Leistungszeitraum und rechnet bis zu Ihrem Anteil» – Expected to contain "Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 1'200.00, …"
  Test red: «erklärt die Rechnungen unter der Position und den gerundeten Prozentwert in kurzen Sätzen» – old note
  Test red: pg «nennt eine Rechnung ohne Leistungszeitraum …» – Expected "Ohne Leistungszeitraum: CHF 365.00, …"; pg «druckt den Anteil in Prozent, …» – Expected "Leistungszeitraum 01.07.2025 – 30.09.2025 (Rechnung CHF 900.00), davon …"
  Test red (written after the code, shown by taking it out): render «nennt eine Rechnung ohne und eine über die Periode hinaus auf %s als solche» – 4 fail with `partText` always `partLine`
  Files: `backend/src/services/{pdf,invoice,calculation}.service.ts`, `backend/src/db/schema.ts` (`InvoicePart.noPeriod`, `whole`, no migration: jsonb), `backend/src/__tests__/{statement-pdf.pg,statement-pdf-render}.test.ts`, `tests/e2e/features/statement-detail.feature`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/data-model.md`, `docs/design/i18n-begriffe.md`
  Skills: tdd, ponytail, ponytail-review
- [x] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, affected E2E (on 9cade5b6: backend 680 pass, 94.0 % lines; test:coverage 2606 passed; lint, check, type-check, fallow, deepcheck clean; full E2E chromium+api 769 passed; later commits change docs only)
- [x] code-reviewer round(s)
- code-reviewer round 1 (docs/reviews/241-review-1.md): fixed C-1 (Major: the change of the Tankbestand got the label «Leistungszeitraum»; now «Veränderung Tankbestand …», the decided text of #239, so this pull request also closes #239: Workflow 7 asks to fix a Major the change makes worse, CLAUDE.md's one pull request per issue would leave it open), C-2 (test: no rounding sentence without invoice lines), C-5 (row U-37), C-7 (plan); open C-6 (O-33); rejected C-3: pg and render tests show each label, the scenario shows the path; rejected C-4: the PDF's French spacing is U-26/U-37, the same in every text
- code-reviewer round 2 (docs/reviews/241-review-2.md): C-1 to C-7 confirmed; fixed C-8 (plan: feature review of the #239 line, PR closes #239)
  Test red: pg «nennt die Veränderung des Tankbestands unter einer Heizposition nach Tagen als solche» – Expected "Veränderung Tankbestand 01.01.2025 – 31.12.2025: CHF 500.00, …", received «Leistungszeitraum 01.01.2025 – 31.12.2025: CHF 500.00»
  Scenario red (#239, written after the code, shown by taking it out): «PDF nennt die Veränderung des Tankbestands unter den Heizkosten als solche» – Expected substring "Veränderung Tankbestand …" without `partStock`; green with it
  Test red (written after the code, shown by taking it out): render «nennt die Veränderung des Tankbestands auf %s als solche» (4 fail), pg «erklärt den Bruch …» `not.toContain('Der Prozentwert ist gerundet')` (fails with the sentence always shown)
- [x] Feature review: fach-reviewer, daten-pruefer (the PDF), persona Dr. Weber (the new texts)
- persona Dr. Weber (docs/design/personas/dr-weber-241.md; setup: SQL deleted Nina Brunner's draft 2025 in `dwello_persona`; the persona set the Hauswart Leistungszeiträume Q1, Q2, none, 01.10.2025–31.01.2026): could recompute «Ihr Anteil» CHF 245.45 from the PDF; open P-1 (Minor, the line names no receipt: #236, comment), P-2, P-3 (Minor), P-4, P-5 (Nit): #256 (`entscheiden`); Beobachtungen all before #241: wizard time (#252), «Kosten Liegenschaft» (#249), detail page (#104), help text (#250), drafts not recomputed (#132), invoice filter once lost the year (not reproduced, no row)
- daten-pruefer round 1 (docs/reviews/241-datenpruefung-1.md): no findings; NK-22222222-2025-0005 recomputed to the Rappen (lines, `invoice_parts` with `noPeriod` and `whole`, «Ihr Anteil» line, totals); observation: fr/it/en lines end «sur/su/of {total}» without the word for days (kept: word order of fach-review V-10)
- fach-reviewer round 2 (docs/reviews/241-fachreview-2.md): round-1 findings confirmed fixed; fixed V-2 (render fixture 0.7338 / 512.08), V-3 (= C-2), V-5 (= C-5); open V-1 (Minor, rounding sentence at heating positions: #256, `entscheiden`); rejected V-4 (= C-4)
- [x] Workflow review `docs/reviews/workflow-rules-review-issue-241.md`
- [x] Feature review of the #239 line (`partStock`, four languages): fach-reviewer round 3 on the delta; daten-pruefer not again (the line prints the stored part, no amount changes; the pg test shows its amount); no persona (it answers no persona finding)
- fach-reviewer round 3 (docs/reviews/241-fachreview-3.md, the #239 line): the line meets #239's decision, also for a negative change; fixed V-3 (`fuelStock` in `docs/data-model.md`), V-4 (row «Veränderung Tankbestand» in `docs/design/i18n-begriffe.md`); open V-1 (Major, existed before: tank fuel shared by delivery dates instead of consumption, the same on the base commit since #226; #257, `entscheiden`, under «Blocked on me»: merging waits for the product owner, Workflow 9), V-2 (Nit, «+ -300.00»: in #257)
- [x] Archive session, push, PR `Fixes #241`, `Fixes #239`, CI, merge (pull request opened after archiving; the merge waits for the product owner because #257, a Major from before, is open)

Issues opened: #247 to #253 (from #227, #240), #256, #257; closed #227, #240; comments on #104, #132, #236, #237.

## Session: subagent models (no issue)

Request: pin `code-reviewer` and `fach-reviewer` to Opus, move `persona` and `daten-pruefer` to Sonnet where a benchmark first shows no loss. Changes only agent definitions and docs: no scenario, no `code-reviewer` round (`.claude/agents/` is not code in Workflow 6), no workflow review (Workflow 7: not for a task that changes only rules).

- [x] Benchmark A: `daten-pruefer` Opus vs Sonnet on `cbbaafa` (#137; known D-1 Major, D-2, D-3 Minor): round 1 ran on the wrong app (the old stack script changed to the main tree; both models noticed), round 2 on `cbbaafa`: both found D-1 in data; Opus D-3, Sonnet D-2
- [x] Benchmark B: persona Dr. Weber Opus vs Sonnet on `cf49fa5` (#226; known P-1 Major, P-2, P-3 Minor, P-4 Nit): both found all four
- [x] Benchmark C: persona Marco Opus vs Sonnet on `70fbc67` (#233; known P-1..P-5 Minor, P-6, P-7 Nit): Opus 6 of 7, Sonnet 2 of 7 plus 2 partly
- [x] Benchmark report `docs/reviews/agent-models-benchmark.md` with the runs' reports in `docs/reviews/agent-models/`
- [x] `model:` in `.claude/agents/*.md` as the benchmark decides: `code-reviewer`, `fach-reviewer`, `persona` `opus`; `daten-pruefer` `sonnet`
- [x] Before marking complete (CLAUDE.md): `test:coverage`, `lint`, `check`, backend `test` and `type-check` pass; no E2E scenario is affected

Files: `.claude/agents/{code-reviewer,fach-reviewer,persona,daten-pruefer}.md`, `docs/reviews/agent-models-benchmark.md`, `docs/reviews/agent-models/*`.

## Session 2026-10-16 (faster local E2E runs)

Task (product owner, in chat): speed up E2E runs during ATDD, not on CI. Measured on `buildings.feature` (7 scenarios): 46 s per run, of which ~40 s the frontend build; recreating `dwello_e2e` 0.26 s, so a file-based database would not help. Proposals 1 and 3 accepted: build the frontend only when its inputs changed since the last E2E build (always on CI), and start the empty instance (3102/3103) and the demo frontend (3104) only when the generated tests need them. No issue (operator-only change); PR with «No scenario: test tooling only, no app behaviour change».

- [x] Build only when an input changed (`tools/e2e/build-if-changed.mjs`, unit tests), always on CI
  Test red: «baut beim ersten Lauf» – Cannot find module; «baut nicht neu, wenn sich nichts geändert hat» – expected 2 to be 1; «baut neu, wenn eine Datei geändert wurde» – expected 1 to be 2; «baut neu, wenn sich ein Text oder die Konfiguration geändert hat» – expected 1 to be 2; «baut nicht neu, wenn nur ein Unit-Test dazukam» – expected 2 to be 1 (shown by taking the filter out); «baut auf CI immer» – expected 1 to be 2
  No red: «baut neu, wenn eine Datei gelöscht wurde» passed at once (the folder's mtime changes); kept as a pin
- [x] Extra servers only for the generated features that use them (`playwright.config.ts`)
  No unit test (no test loads the Playwright config); shown by runs: after `bddgen --tags @buildings` 4 web servers and 8 s per run (46 s before), after a full `bddgen` `demo.feature` started all 7
- [x] Docs: `tests/e2e/CLAUDE.md` (Run)
  Skills: tdd, ponytail, ponytail-review (lean already), slice-review
- [x] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, E2E (wip-style subset and full chromium+api)
  On 744e229: test:coverage 2617 passed; lint, check clean; backend 670 pass, 93.9 % lines, type-check clean; deepcheck:audit, fallow clean. Full E2E chromium+api 768 passed (13.0 min, on b50c148; the later commits change only the build check and comments). Two runs of `buildings.feature` after `bddgen --tags @buildings`: 46 s (stamp of the old script, rebuilt), then 8 s without a build
- [x] code-reviewer rounds
  code-reviewer round 1 (`docs/reviews/e2e-speed-review-1.md`): fixed C-1 (`src/lib/paraglide` written by the build no longer counts; likely the one 48 s run), C-2 (`playwright.config.ts` with APP_VERSION is an input; the stamp lists the inputs that existed, so a deleted configuration file counts), C-3 (test for a file saved during the build), C-4 (comments in `tasks/demo.ts`, `tasks/accessibility.ts`), C-5 (plan lines added after the reviewed commit); rejected C-6: Node 20.0 runs nowhere (CI `NODE_VERSION: 22`, local 22, Docker `node:20` takes the latest 20.x and runs no E2E)
  Test red: «baut neu, wenn während des Builds eine Datei gespeichert wurde» – expected 1 to be 2 (written after the code, shown by taking `utimesSync` out); «baut nicht neu, wenn der Build nur die Übersetzungen aus messages/ erzeugt hat» – expected 2 to be 1; «baut neu, wenn sich die Version für den Build geändert hat» and «baut neu, wenn eine Konfigurationsdatei gelöscht wurde» – expected 1 to be 2
  code-reviewer round 2 (`docs/reviews/e2e-speed-review-2.md`): C-1 to C-5 confirmed fixed, C-6 rejection holds; fixed C-7 (Nit: `tests/e2e/CLAUDE.md` names `playwright.config.ts` as an input); no re-review (docs only)
- [x] Workflow review `docs/reviews/workflow-rules-review-e2e-speed.md`
- [x] Archive session, push, PR, CI, merge

Files: `tools/e2e/build-if-changed.mjs`, `tools/e2e/build-if-changed.test.ts`, `playwright.config.ts`, `tests/e2e/CLAUDE.md`, `tests/e2e/tasks/{demo,accessibility}.ts`, `docs/reviews/e2e-speed-review-{1,2}.md`, `docs/reviews/workflow-rules-review-e2e-speed.md`

## Session: axe check only on UI changes

Request: the CI accessibility (axe) check runs only when a pull request changes the UI. No issue. No scenario: CI only, no app behaviour changes.

- [x] `changes` job outputs `ui`; job "Accessibility (axe)" skips its steps when it is `false`, so the required check still reports (`.github/workflows/ci.yml`)
- [x] Filter checked locally with sample change lists (backend only, unit tests only, other feature file, docs/tools: skipped; page, messages, e2e steps, accessibility.feature, bun.lock: runs)
- [x] `docs/test-pyramid.md` row "Accessibility" updated
- [x] lint, check, test:coverage, backend test and type-check green on 35c743f (no E2E: no scenario affected)
- [x] code-reviewer round
- code-reviewer round 1 (docs/reviews/axe-ui-only-review-1.md): fixed C-1, C-3, C-4 (`--no-renames`, also helps `backend`/`app`), C-6; rejected C-2: the helper under `backend/src/__tests__/` breaks the job "E2E tests" as well, which loads the same steps; C-5: the Postgres service start (~15 s) cannot be skipped per matrix entry without splitting the job. No re-review: the fixes change no code in the sense of Workflow 6
- [x] Workflow review `docs/reviews/workflow-rules-review-axe-ui-only.md`
- [x] Checks before push green; push, pull request and merge follow (CLAUDE.md, Workflow 9)

Files: `.github/workflows/ci.yml`, `docs/test-pyramid.md`, `docs/reviews/axe-ui-only-review-1.md`, `docs/reviews/workflow-rules-review-axe-ui-only.md`.

## Session: shard E2E and axe in CI

Request: make the CI E2E tests faster (follow-up to "axe check only on UI changes"). No issue. No scenario: CI only, no app behaviour changes.

- [x] `e2e-tests` matrix: "E2E tests" in 2, "Accessibility (axe)" in 3 Playwright shards; artifact names per shard (`.github/workflows/ci.yml`)
- [x] Job `e2e-results` keeps the checks "E2E tests" and "Accessibility (axe)" under their names (branch rules may require them): fails when a shard of its suite did
- [x] Workers stay at 2: the repository is private, its `ubuntu-latest` runners have 2 cores
- [x] actionlint clean; gate filter checked with a sample job list
- [x] `docs/test-pyramid.md` rows "Acceptance" and "Accessibility"
- [x] Checks: lint, check (the rest unaffected: no app code changed)
- [x] code-reviewer round
- code-reviewer round 1 (docs/reviews/ci-shards-review-1.md): fixed C-1 (gate requires `changes` to succeed and, on app changes, all shards of its suite to pass), C-3 (no longer applies: the gate counts passed shards), C-4; C-2 (more runner minutes) accepted as the price of the agreed approach, named in the pull request. No re-review: CI config, not code in the sense of Workflow 6
- [x] Checks before push: test:coverage, lint, check, backend test + type-check green on 2c37a21 (no E2E: no scenario affected)
- [x] Push, pull request, CI shows shard times, merge (CLAUDE.md, Workflow 9)

Files: `.github/workflows/ci.yml`, `docs/test-pyramid.md`

## Session: O-34, upload axe states time out in CI

Request: fix O-34 (`docs/design/offene-punkte.md`): the axe states `invoices upload-dialog` and `invoices upload-discard-created` time out in CI. No issue. No scenario: test reliability only, no app behaviour changes.

- [x] Cause: `startUpload` (`tests/e2e/tasks/accessibility.ts`) picks the first building of the select (`index: 1`), in the shared E2E database often a parallel scenario's «Bergsicht …»/«Seeblick …» that its cleanUp deletes while the files are read (extract 404: row «failed», no unsure hint) or created (no result). The KI 503s in the log are the categorization of the «Werke …» files, expected
- [x] Red: the two states (`--repeat-each=3`) with a parallel churn of buildings «Aarhof …» created and deleted after 4 s: 5 of 6 failed with the CI's timeouts (unsure hint, upload result); without churn, even under CPU load, all pass
- [x] Fix: all five upload states upload into the example's own building (`uploadBelege` of `tasks/invoice-upload.ts`); under the same churn 15 of 15 pass (`invoices upload-.* @a11y`, `--repeat-each=3`), axe and language checks of the upload states 10 of 10
- [x] O-34 removed from `docs/design/offene-punkte.md`
- [x] Checks: lint, check, backend type-check, `open-work.test.ts`, the a11y and language upload states
- [x] code-reviewer round 1 (docs/reviews/o34-review-1.md)
- [x] Workflow notes `docs/reviews/workflow-notes-o34.md`
- [x] Checks before push green; push, pull request, CI and merge follow (CLAUDE.md, Workflow 9)

Files: `tests/e2e/tasks/accessibility.ts`, `docs/design/offene-punkte.md`, `docs/reviews/o34-review-1.md`, `docs/reviews/workflow-notes-o34.md`.

## Session 2026-10-16 W4: Heizprofil on the detail page, help text, rounded months (#247, #230, #232)

- [x] @wip scenarios (statement-detail.feature, heating-profiles.feature), fach-reviewer before implementing (`docs/reviews/w4-fachreview-1.md`)
- [x] #247: a statement shared by days stores the chosen Heizprofil's names and why it was not applied; the detail page names it «(nicht angewendet: …)»
- [x] #230: help text at the Monatsanteile of an own profile: existing statements keep their shares (four languages)
- [x] #232: share from the months rounded to two places; PDF prints the division and the period's months where they do not carry 100 %
- [x] #232 C-5: no recompute for statements without a stored share (no Heizprofil note)
- Files: `backend/src/services/{heating-profile,prorating,calculation,statement-pdf,pdf}.service.ts`, `backend/src/db/schema.ts`, `src/lib/server/statement.ts`, `src/routes/config/heating-profiles/HeatingProfileForm.svelte`, `messages/*.json`, `docs/data-model.md`, `docs/api-specification.md`, tests and scenarios
- [x] Code review round 1 (`docs/reviews/w4-review-1.md`)
- [x] Persona Helga (`docs/design/personas/helga-w4.md`)
- [x] Persona Dr. Weber (`docs/design/personas/dr-weber-w4.md`)
- [x] fach-reviewer round 2 (`docs/reviews/w4-fachreview-2.md`)
- [x] daten-pruefer (`docs/reviews/w4-datenpruefung-1.md`)
- [x] Closing code review (`docs/reviews/w4-review-2.md`)
- [x] Workflow notes (`docs/reviews/workflow-notes-issue-247-230-232.md`)
- [x] Workflow review, archive the session, pull request

## Session 2026-10-16 (#250, #254: Leistungszeitraum over several years)

- [x] #250: help text and field examples of the Leistungszeitraum use one year (the current year, as the date fields' examples), all four languages; DOM tests pin it (form, help page). No scenario: wording without new behaviour, as #250 says; covered by `sprachen-bildschirme.feature`
- [x] #254: help at the Leistungszeitraum (invoice form, edit form, upload dialog) and on the help page names a cost over several years, all four languages; scenarios in `invoice-new.feature`, `help.feature`
- [x] #254: scenario in `statement-generate.feature`: CHF 500 over 01.04.2026 – 31.03.2031 counts CHF 75.30 in 2026 and CHF 99.95 in 2027 (green on the base: the behaviour exists)
- [x] #254: lower-layer test of `inPeriod` over five years (`service-period.pg.test.ts`, red with the prorating taken out)
- [x] fach-reviewer round 1 on scenarios and texts: `docs/reviews/w3-fachreview-1.md`; V-2 → #276
- [x] code-reviewer round 1: `docs/reviews/w3-review-1.md`; C-1 → #282 (decision)
- [x] personas: `docs/design/personas/weber-w3-leistungszeitraum.md`, `docs/design/personas/helga-w3-leistungszeitraum.md`
- [x] fach-reviewer round 2 on the changed texts: `docs/reviews/w3-fachreview-2.md`
- [x] Workflow note: scenario of existing behaviour, one pull request for two issues, contradicting decisions block the merge (`docs/reviews/workflow-notes-issue-250-254.md`)
- [x] closing code-reviewer round: `docs/reviews/w3-review-2.md`
- [x] Checks before push green; push and pull request follow (CLAUDE.md, Workflow 9); the merge waits for the product owner's decision in #282

Files: `messages/{de,fr,it,en}.json`, `src/routes/invoices/InvoiceDataFields.svelte`, `src/routes/help/+page.svelte`, `src/__tests__/{invoice-pages,invoice-upload-dialog,help-page}.dom.test.ts`, `backend/src/__tests__/service-period.pg.test.ts`, `tests/e2e/features/{statement-generate,help,invoice-new}.feature`, `tests/e2e/{steps,targets,questions}/invoice-form*`, `docs/nebenkostenabrechnung-anforderungen.md`

## Session 2026-10-16 W6: Reminder deadlines and posting (#107, #193, #194)

- [x] #107: scenario «Nächste Mahnung erst nach der Zahlungsfrist der letzten» (`statement-reminder.feature`) replaces «Zweite Mahnung» (the E2E clock cannot age a reminder past its deadline: the allowed 2nd Mahnung is a `reminders.pg.test.ts` case)
- [x] #107: `documents.payment_deadline` (`0007_reminder_payment_deadline.sql`, backfilled from the Swiss creation day, `schema.ts`, `docs/data-model.md`); statement responses carry `nextReminderFrom` (none after the 3rd)
- [x] #107: coded refusal `REMINDER_TOO_EARLY`, `backend_reminder_too_early` in all four languages, dates in Swiss format (`backend-error.ts`); pg tests refused and allowed
- [x] #107: reminder rows show their Zahlungsfrist (`DocumentItem.svelte`, marker #277); detail page hides «Mahnung senden» and shows «Nächste Mahnung möglich ab» (`StatusActions`, `PaymentPanel`); list row (`StatementRow`); the overview leaves out a statement while a Mahnung's Zahlungsfrist runs (`overview.ts`, unit test: the overview count cannot be isolated in E2E)
- [x] #193: marking a reminder as sent remakes its letter with today's date and deadline (`markDocumentPosted`); No scenario: needs the backend clock to move between creating and posting (`reminders.pg.test.ts` with a set clock). Texts now say: mark as sent on the day of posting, then print (`documents_purpose`, `dashboard_task_letters_text_*`, `backend_mail_delivery_failed`, `help_payments_4`, `statements_reminder_by_letter`)
- [x] #194: scenario «Nach gescheiterter E-Mail per Post versendete Mahnung gilt als Brief»; pg test
- [x] fach-reviewer round 1 on the @wip scenarios: `docs/reviews/reminders-fachreview-1.md`
- [x] contracts `statement.json`, `documents.json`; axe and language rows `statement-reminded-detail`
- [x] Workflow note: «failing request» is not the only state E2E cannot reach: `tests/e2e` has no way to age a stored record (a reminder's deadline), so «Zweite Mahnung» had to move to a pg test
- [x] code-reviewer round 1: `docs/reviews/reminders-review-1.md`
- [x] persona Helga: `docs/design/personas/helga-issue-107-193-194.md`
- [x] fach-reviewer round 2: `docs/reviews/reminders-fachreview-2.md`
- [x] daten-pruefer: `docs/reviews/reminders-datenpruefung-1.md`
- [x] review fixes: no next reminder date once paid (C-1/V-13), test after the 3rd (C-2), re-marking on a later day (C-4), `docs/api-specification.md` (C-3), one `swissDate` (C-8), «Als versendet markieren» names the letter and offers its remade PDF (V-14, P-4; `documents/+page.server.ts`, `MarkedSentNotice.svelte`, state `documents marked-sent`), overview subtracts only overdue statements (V-16, C-6), «sends a reminder» waits for its outcome (E2E race)
- [x] code-reviewer round 2: `docs/reviews/reminders-review-2.md`; persona Helga re-run on the notice: `docs/design/personas/helga-issue-107-193-194-2.md`
- [x] round-2 fixes: scenario step for the notice (C-11), notice in a live region with its button as the Alert action (C-12, C-17), no «Keine Briefe zu versenden» beside it (Helga P-1), `marked-sent` not in the seed list (C-16); the filter links' ternaries moved into `filters` because the fallow gate counted them against the documents template (C-13)
- [x] code-reviewer round 3: `docs/reviews/reminders-review-3.md` (no Blocker/Major); new step seen red without the notice
- [x] workflow notes: `docs/reviews/workflow-notes-issue-107-193-194.md`
- [x] full E2E (chromium, api) on the merged commit: 778 passed
- [x] plan archived; push, pull request (one for the three issues: the changes share `markDocumentPosted` and the deadline), CI, merge

## Session: moves within the house and contracts that continue by law (#156, #155)

Request: «Setze #156 #155 um».

- [x] #156 «Nächste Schritte» get «Neuen Mietvertrag für {name} erfassen» to `/contracts/new?tenant=…` (scenario in `contract-detail.feature`, DOM test `NextSteps.svelte`)
- [x] #156 «Neuer Mietvertrag» hints when the chosen tenant still has an open-ended Mietvertrag for another apartment (not blocking)
- [x] #156 «Neuen Mietvertrag erfassen» on «Mietvertrag bearbeiten» fills in the tenant and the earliest start (`?start=`)
- [x] #155 help text (four languages) and `docs/anforderungen-vertragsende.md`: death keeps the Mietvertrag (heirs' address as Korrespondenzadresse); transfer or court assignment is Vertragsende plus new Mietvertrag
- [x] fach-reviewer on the `@wip` scenarios before implementing
- [x] fach-reviewer round 1 (`docs/reviews/w10-fachreview-1.md`)
- [x] #155 also in the dialog «Mietvertrag beenden» (Fachreview W10 M-1); the edit link names the tenant (V-1)
- [x] code-reviewer round 1 (`docs/reviews/w10-review-1.md`)
- [x] fach-reviewer round 2 (`docs/reviews/w10-fachreview-2.md`)
- [x] persona Helga (`docs/design/personas/helga-b16.md`), persona Dr. Weber (`docs/design/personas/weber-f23.md`)
- [x] fach-reviewer round 3 (`docs/reviews/w10-fachreview-3.md`), Dr. Weber re-run (`docs/design/personas/weber-f23-2.md`), closing code-reviewer round 2 (`docs/reviews/w10-review-2.md`)
- [x] Workflow note: «every new test seen red» for a scenario added after a review; collected review with parallel sessions (`docs/reviews/workflow-notes-issue-156.md`)
- [x] Checks before push; workflow review; archive session
- [x] Push, pull request, CI and merge follow (CLAUDE.md, Workflow 9)

Files: `messages/{de,fr,it,en}.json`, `src/routes/contracts/[id]/NextSteps.svelte`, `src/routes/contracts/[id]/+page.svelte`, `src/routes/contracts/ContractForm.svelte`, `src/routes/contracts/new/ContractWizard.svelte`, `src/routes/contracts/new/OpenContracts.svelte`, `src/lib/contract-form.ts`, `src/lib/contract-wizard.ts`, `src/lib/utils/contract-availability.ts`, `docs/anforderungen-vertragsende.md`, tests in `src/__tests__/` and `tests/e2e/`.

## Session W7: #141 and #116 (draft delete in one step, delete a started Mietvertrag)

- [x] #141 `@wip` scenario «Abgelehntes Vertragsende behält den Entwurf» (`contract-detail.feature`), seen red
- [x] #116 `@wip` scenarios «Irrtümlich erfassten Mietvertrag löschen», «… nur mit Bestätigung», «Mietvertrag mit Abrechnung kann nicht gelöscht werden» (`contract-detail.feature`), seen red
- [x] fach-reviewer on the #116 scenarios and texts before implementing
- [x] #141 backend: `PUT /contracts/:id` with `deleteDraft` in the body deletes the draft and changes the contract in one transaction (`contract-end.pg.test.ts`: refused → draft kept, accepted → draft gone)
- [x] #141 BFF end dialog (`endDeletingDraft`) and edit form (`deleteDraftAndSave`) use it (DOM test: no separate DELETE)
- [x] #116 backend: `DELETE /contracts/:id` refuses a started contract without `?confirmMistake=true` (`CONTRACT_STARTED`) and one with statements (`CONTRACT_HAS_STATEMENTS`); pg tests
- [x] #116 dialog: confirmation checkbox for a started contract; help text `contracts_parties_fixed_mistake` names started contracts
- [x] Test clean-up (`tests/e2e/fixtures/backend.ts`, backend helpers) passes the flag
- [x] `tests/contracts/*.json`, `docs/api-specification.md`, `docs/anforderungen-vertragsende.md` (A-7 implemented), `tests/a11y/screens.json` + `accessibility.feature` + `sprachen-bildschirme.feature` for the dialog state
- [x] fach-reviewer round 1: `docs/reviews/w7-fachreview-1.md`; glossary «Leerstand» → #279
- [x] fach-reviewer round 2: `docs/reviews/w7-fachreview-2.md`
- [x] code-reviewer round 1: `docs/reviews/w7-review-1.md`
- [x] personas: `docs/design/personas/anna-w7.md`, `docs/design/personas/helga-w7.md`
- [x] Helga again on the new text of a billed contract: `docs/design/personas/helga-w7-2.md`
- [x] code-reviewer round 2: `docs/reviews/w7-review-2.md` (C-13, C-17 fixed)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-116-141.md`
- [x] Checks before push green; push, pull request, CI and merge follow (CLAUDE.md, Workflow 9)

Files: `backend/src/services/contract.service.ts`, `backend/src/routes/contracts.ts`, `src/routes/contracts/[id]/+page.server.ts`, `src/routes/contracts/[id]/+page.svelte`, `src/routes/contracts/[id]/DeleteContract.svelte`, `src/routes/contracts/ContractForm.svelte`, `messages/*.json`, tests (`contract-end.pg`, `contract-delete.pg`, `api-contracts.pg`, test clean-ups, `contract-actions`, `contract-detail-page.dom`, `contract-edit.dom`), `tests/e2e/**`, `tests/a11y/screens.json`, `tests/contracts/*`, `docs/api-specification.md`, `docs/anforderungen-vertragsende.md`.

## Session: statement wizard (#251, #252, #201)

Request: «Setze #251 #252 #201 um». Branch `claude/statement-wizard-251-252-201`.

- [x] #251: step 4 asks «trotzdem erstellen» only for real findings, not for existing statements alone (scenario, unit test of `needsConfirmation`)
- [x] #252: the wizard's saved time in Swiss time (`DraftNotice`, `SaveStatus`). No scenario: the E2E browser runs in the machine's time zone and the stack sets none per scenario; DOM test with a set time zone
- [x] #201 a: «Alle Gebäude» leaves out buildings whose Mietverträge all have a statement in the period, said next to the counter (scenario)
- [x] #201 b: step 2 adds «Wenn Sie es wählen, wird dafür nichts erstellt.» and how an existing draft is recalculated (today: delete it and create again; «Neu berechnen» of #132 does not exist yet) (scenario)
- [x] #201 c: a restored wizard opens in the step it was left in, if still valid (scenario)
- [x] #201 d: discarding the input asks first («Ihre Angaben werden gelöscht.»); the notice can be closed (scenarios; new dialog state in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`)
- [x] fach-reviewer on the scenarios before the first test turns green
- [x] fach-reviewer round 1 (`docs/reviews/wizard-fachreview-1.md`)
- [x] Fachreview M-1: a statement that covers only part of a contract's days in the period stays a finding (confirmation in step 4, kept by «Alle Gebäude»); `billedContracts` counts such contracts (`partly`), the preview passes them on (`partlyBilled`)
- [x] Checks on the slice: lint, check, backend type-check, all vitest, E2E `statement-generate.feature`, `contract-new.feature`, axe and language rows of both wizards
- [x] code-reviewer round 1 (`docs/reviews/wizard-review-1.md`)
- [x] fach-reviewer round 2 (`docs/reviews/wizard-fachreview-2.md`)
- [x] Persona Anna (`docs/design/personas/anna-issue-201.md`), persona Dr. Weber (`docs/design/personas/dr-weber-issue-251.md`); no daten-pruefer: no amounts, PDFs or QR-bills change
- [x] Fixes from the reviews: discard button «Angaben verwerfen» as in the dialog (#57's word; Anna P-1 in part); focus on the step heading after closing the notice (Anna, C-5); step 2 says that a run leaves days open instead of «Sie müssen es nicht wählen» and the delete advice when a statement covers only part of the period (V-9, C-3, Dr. Weber P-1/P-2); «Alle Gebäude» stays empty when every building is left out (C-1); scenario waits for the note (C-2); contracts from `tests/contracts` (C-7); C-8; fr/it wording (V-10, V-11, C-9)
- [x] E2E full suite (chromium, api) on b881ac0: 779 passed; after the fixes `statement-generate.feature`, `contract-new.feature` and their axe and language rows again green
- [x] fach-reviewer round 3 (`docs/reviews/wizard-fachreview-3.md`): V-12, V-13 wording applied («Mietstage», fr/it word for the run)
- [x] Closing code-reviewer round (`docs/reviews/wizard-review-2.md`): fixed Major C-1 (empty preview with open days no longer advises deleting drafts, `PreviewEmpty.svelte`), C-2 (test), C-3 in part, C-6
- [x] Re-review of the C-1 fix (code-reviewer round 3, `docs/reviews/wizard-review-3.md`): fixed the rest of C-1 (the error after «Weiter» on an empty preview with open days no longer advises deleting drafts) and C-10 (scenario «Eine leere Vorschau mit offenen Mietstagen rät nicht, Entwürfe zu löschen»), C-12 (`statements_all_billed` composed from its two sentences), C-13; C-11 left (Minor)
- [x] Workflow note `docs/reviews/workflow-notes-issue-201.md`
- [x] Feature review (personas, fach-reviewer)
- [x] Closing code-reviewer round before push (`docs/reviews/wizard-review-4.md`): no Blocker/Major; C-11, C-14 left (Minor/Nit)
- [x] Merge of origin/main (plan only); checks before push: lint, check, backend type-check, vitest 2659, full E2E chromium + api
- [x] Archive session; pull request, CI (merge waits for the product owner: open Majors from before the change, see the pull request)

Files: `src/lib/ui/{DraftNotice,SaveStatus}.svelte`, `src/lib/utils/format.ts`, `src/lib/statement-wizard.ts`, `src/lib/server/statement-generation.ts`, `src/routes/statements/generate/{+page.server.ts,StatementWizard,BuildingStep,BuildingChoice,PreviewChecks}.svelte`, `messages/{de,fr,it,en}.json`, tests in `src/__tests__/`, `tests/e2e/` (features, steps, tasks, questions, targets), `tests/a11y/screens.json`, `docs/reviews/wizard-fachreview-1.md`

## Session: statement list tenancy dates and missing PDF (#248, #253)

- [x] #248 scenario `@wip` in `statements.feature`: list shows the tenancy dates within the period
- [x] #248 lower-layer test of the list mapping (the stored rent days)
- [x] #253 scenario `@wip` in `statements.feature`: a draft without PDF says «PDF noch nicht erstellt» and leads to its detail page
- [x] #253 DOM test of the row; texts in de/fr/it/en
- [x] #253 new state in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- Files: `src/lib/server/statement.ts` (maps the stored `rentalStart`/`rentalEnd`), `docs/api-specification.md`, `src/routes/statements/+page.server.ts` (reuses `toStatement`), `StatementRow.svelte`, `src/lib/types.ts`, `messages/*.json`, `tests/contracts/statements.json`, tests
- [x] Slice review round 1: `docs/reviews/list-review-1.md`
- [x] Feature review: `docs/design/personas/dr-weber-list.md`, `marco-list.md`, `dr-weber-list-2.md` (draft without PDF prepared by SQL in `dwello_persona`)
- [x] Fixes: the list maps the stored `rentalStart`/`rentalEnd` (no contract join); row locator by statement number; the row names the dates with the Mietstage (the detail page's dates stay with #104)
- [x] Slice review round 2: `docs/reviews/list-review-2.md` (detail change taken out)
- [x] Closing review round 3: `docs/reviews/list-review-3.md`
- [x] CI fix: the `statements`/`pdf-missing` example seeded nothing (`?status=draft` has no placeholder, `fixtures/screens.ts` `seedFor`) and relied on other scenarios' drafts; now `?status=draft&building={building}`. Review: `docs/reviews/list-review-4.md`
- [x] Merge of main with W6 (#193/#194/#107): the list keeps `toStatement`, which maps `nextReminderFrom`; the list contract names it. Review: `docs/reviews/list-review-5.md`
- [x] Persona re-run on the labelled dates: `docs/design/personas/dr-weber-list-3.md` (the Major P-1 resolved in the list; a Minor, no label word before the dates, stays in the report; its detail-page dates were taken out again in ca4a9d7, see #104)
- [x] Workflow note: demo PDFs and the collected review in parallel sessions (`docs/reviews/workflow-notes-issue-248-253.md`)
- [x] Before marking complete: lint, check, type-check, affected tests and E2E

## Session W7b: Kündigungsfrist hint and «Kündigung aufheben» help (#112, #52)

- [x] #112: `@wip` scenarios «Kündigung mit zu kurzer Frist» and «Kündigung mit genügend Frist» in `contract-detail.feature`, seen red; `fach-reviewer` before implementing
- [x] #112: rule «less than 3 calendar months between receipt and Vertragsende» (day clamped) with the four unit cases of the issue
- [x] #112: optional field «Kündigung erhalten am» in «Mietvertrag beenden», help with the form, hint (no block)
- [x] #112: column `notice_received_on` (migration, schema, API, contract, `docs/data-model.md`), shown on the detail page, cleared when the notice is withdrawn
- [x] #112: dialog state with the hint in `tests/a11y/screens.json`; `docs/anforderungen-vertragsende.md` A-3 implemented
- [x] #52: `contracts_withdraw_notice_help` per the glossary in four languages, scenario «Kündigung aufheben» checks it, marker removed
- [x] Fach review round 1: `docs/reviews/w7b-fachreview-1.md` (no Blocker/Major; M-5, V-1, V-3 taken)
- [x] Code review round 1: `docs/reviews/w7b-review-1.md` (no Blocker/Major; C-6, C-10 fixed; C-9 rejected: both callers hold the form, the field is read once in `endOn`)
- [x] Fach review round 2: `docs/reviews/w7b-fachreview-2.md` (no Blocker/Major; M-6, M-7, V-4 fixed)
- [x] Personas: `docs/design/personas/helga-w7b.md`, `docs/design/personas/weber-w7b.md` (no Blocker/Major)
- [x] Closing code review: `docs/reviews/w7b-review-2.md` (no Blocker/Major; C-11 fixed)
- [x] Workflow note: one pull request per issue decided only at the push; worktree vitest (`docs/reviews/workflow-notes-issue-112-52.md`)
- [x] #52 split into its own pull request #301 (branch `claude/w7b-withdraw-help-52`)
- [x] Plan archived; pull request for #112 opened (merge: see closing report)

Files: `backend/migrations/0008_contract_notice_received.sql`, `backend/src/db/schema.ts`, `backend/src/routes/contracts.ts`, `backend/src/services/contract.service.ts`, `src/lib/contract-status.ts`, `src/lib/types.ts`, `src/routes/contracts/[id]/{+page.svelte,+page.server.ts,ContractTerms.svelte}`, `src/routes/contracts/new/PeriodStep.svelte`, `messages/*.json`, tests (`contract-status`, `contract-actions`, `contract-end.pg`, `tests/contracts/contract.json`, E2E contract-detail/contract-edit, a11y), docs (`anforderungen-vertragsende.md`, `data-model.md`, `api-specification.md`).

## Session 2026-10-16: #124, #89, #60 Verwaltungspauschale

- [x] #60: remove the marker in `SettingsStep.svelte`, cite the Mieterverband leaflet 2026 in the comment (No scenario: code comment only, no behaviour change)
- [x] #124: preview and generate refuse a rate above 10 % (route schema), `PUT /api/v1/config` refuses `management_fee_pct` above 10 (validator); `*.pg.test.ts` for 10 accepted and stored, 10.01 refused, no 500
- [x] #124: wizard step «Einstellungen» and settings page refuse above 10 at the field; `statements_error_fee` «von 0 bis 10» in four languages; unit tests in `statement-wizard.test.ts` and for `saveSettings`; hint above 3 % unchanged
- [x] #124: scenario in `statement-management-fee.feature`: «1000» shows the field error, the wizard stays on the step
- [x] #89: Mietvertrag gets «Verwaltungspauschale vereinbart» (ja/nein, optional own rate): migration, schema, `docs/data-model.md`, API contracts
- [x] #89: new contract: ja or nein must be chosen (no default); existing contracts start with «nein»; edit and detail page show it
- [x] #89: the run rate applies only to contracts with «ja» (or their own rate); «nein» gets 0 %
- [x] #89: the statement wizard points out the contracts with «nein»
- [x] #89: help texts (`statements_fee_help`), requirements doc rule 9, four languages
- [x] fach-reviewer on the @wip scenarios before implementing (`docs/reviews/issue-89-fachreview-1.md`: M-1, V-1, V-2, V-5, V-6, M-2 fixed; V-3, V-4 rejected; #286 opened for the glossary)
- [x] code-reviewer round 1 (`docs/reviews/issue-89-review-1.md`): no Blocker/Major; C-1, C-2, C-3, C-7, C-9–C-11 fixed; C-4, C-5, C-6, C-8 left as reported
- [x] Persona Helga (`docs/design/personas/helga-issue-89.md`): P-1, P-2 fixed; P-3, P-4, P-5 left as reported
- [x] Persona Dr. Weber (`docs/design/personas/dr-weber-issue-89.md`): P-1, P-2, P-3 fixed; P-4 left as reported
- [x] fach-reviewer round 2 (`docs/reviews/issue-89-fachreview-2.md`): M-3, M-4, V-5, V-11, V-13, V-15 fixed; V-12, V-14, V-16 left as reported
- [x] daten-pruefer (`docs/reviews/issue-89-datenpruefung-1.md`): 19 statements match to the Rappen; D-1 fixed, D-2, D-3 existed before
- [x] E2E isolation: UI runs of the statement wizard name a predefined heating profile (`tests/e2e/{steps,tasks}/statement-generate*`)
- [x] Workflow note: a notice inside a wizard step vs. a state of `tests/a11y/screens.json`; reviewers cannot run checks in their worktree; stop hook vs. step 9 (`docs/reviews/workflow-notes-issue-89.md`)
- [x] Merge of main (migration renamed to 0009, after a second merge 0011)
- [x] Closing code-reviewer round (`docs/reviews/issue-89-review-2.md`): Major C-1 fixed (heating profile again from the other statements, notice names where the fee comes from), C-2, C-4, C-6, C-7, C-8 fixed; C-9 holds again after the C-1 fix; C-3, C-5 rejected; C-10 noted (dev databases only)
- [x] Closing re-review (`docs/reviews/issue-89-review-3.md`): C-1 confirmed; Major C-11 fixed (scenario «Neue Abrechnung übernimmt das Heizprofil, die Verwaltungspauschale kommt aus den Einstellungen», red on 7d81829); C-13, C-7, C-14, C-15, C-16 fixed; C-12 left as reported
- [x] Closing re-review (`docs/reviews/issue-89-review-4.md`): C-11 and the delta confirmed, no Blocker/Major open; C-18 fixed, C-17 left (accessibility targets keep their own module)
- [x] PR
- Files: `backend/migrations/0011_contract_management_fee.sql`, `backend/src/{db/schema.ts,routes/contracts.ts,routes/statements.ts,services/calculation.service.ts,services/config.service.ts,services/contract.service.ts}`, `backend/demo/demo-data.sql`, `src/lib/{contract-form.ts,contract-wizard.ts,statement-wizard.ts,types.ts,utils/format.ts,server/settings.ts,server/statement-generation.ts}`, `src/routes/contracts/{new/RentStep.svelte,[id]/*}`, `src/routes/statements/generate/{+page.server.ts,FeeNotAgreed.svelte,SettingsStep.svelte,StatementStep.svelte}`, `messages/*.json`, docs

## Session 2026-10-16 (#97, #101: identity of a statement)

- [x] #97: a per-building, per-year number sequence that never gives a number twice; a deleted draft leaves a gap (`*.pg.test.ts`: two drafts, delete the second, generate again → `…-0003`); existing numbers unchanged; `docs/data-model.md` names where the sequence is kept
- [x] #97: scenario in `statement-generate.feature` (names its heating profile: the wizard's preselection can be a parallel scenario's deleted profile)
- [x] #101: the PDF download is named after the statement number (safe ASCII), download and inline view; unit test of the BFF route; scenario in `statement-detail.feature`
- [x] fach-reviewer on the scenarios before implementing: `docs/reviews/w3b-fachreview-1.md`; V-1 → #294
- [x] code-reviewer round 1: `docs/reviews/w3b-review-1.md`; C-1, C-3, C-7 fixed
- [x] persona Dr. Weber: `docs/design/personas/weber-w3-abrechnungsnummer.md` (no Blocker/Major); daten-pruefer not run: no amount, PDF content or QR-bill field changed
- [x] Workflow note: preselected heating profile in parallel E2E, daten-pruefer scope, migration numbers (`docs/reviews/workflow-notes-issue-97-101.md`); the generate scenarios name their heating profile (the flaky preselection, fixed here instead of an `offene-punkte.md` row)
- [x] closing code-reviewer round: `docs/reviews/w3b-review-2.md`
- [x] Checks before push green; push, pull request and merge follow (CLAUDE.md, Workflow 9)

Files: `backend/migrations/0009_statement_numbers.sql`, `backend/src/db/schema.ts`, `backend/src/services/calculation.service.ts`, `backend/src/routes/statements.ts`, `src/lib/server/statement.ts`, `src/routes/statements/[id]/pdf/+server.ts`, `src/routes/api/statements/[id]/pdf/+server.ts`, `docs/data-model.md`, tests (`statement-creation.pg`, `statement.routes.pg`, `statement-endpoints`, `statement-list-load`), E2E (`statement-generate`, `statement-detail` features, steps, tasks, questions), `docs/api-specification.md`, `docs/design/offene-punkte.md` (O-34), `docs/design/personas/weber-w3-abrechnungsnummer.md`, `docs/reviews/w3b-*.md`, `docs/reviews/workflow-notes-issue-97-101.md`

## Session W5b: #166 and #219 (predefined categories marked and protected, no KI check while the KI is off)

No implementation issue exists for either decision issue: their "Decided (product owner)" sections are the requirement.

- [x] #166 `@wip` scenarios (`categories.feature`): badges «Von Dwello» / «Eigene», delete disabled with its reason, hint on the edit page; seen red
- [x] fach-reviewer round 1 on the scenarios and texts before implementing (`docs/reviews/w5b-fachreview-1.md`); V-2 → #302
- [x] #166 backend: `deleteCategory` refuses a predefined category (`CATEGORY_PREDEFINED`), `updateCategory` keeps its key (pg tests)
- [x] #166 list: badge, disabled delete button described by its reason; edit page: hint (its KI sentence only while the KI is on)
- [x] #219 new-category page loads whether the KI is on and hides «Von der KI prüfen lassen» when it is off (No scenario: the E2E backend always starts with the KI on; `LLM_ENABLED` is read at the backend start)
- [x] messages in all four languages; no new `tests/a11y` state (list and `category-edit-predefined` are already checked)
- [x] code-reviewer round 1 (`docs/reviews/w5b-review-1.md`)
- [x] fach-reviewer round 2 (`docs/reviews/w5b-fachreview-2.md`), personas Helga (`docs/design/personas/helga-w5b.md`) and Dr. Weber (`docs/design/personas/weber-w5b.md`)
- [x] Fix slice: hint reworded (P-1 Helga/Weber), allocability sentence follows the saved choice (V-8, V-9), translations (V-10), fallback test (C-2), shared backend URL (C-3), term table (C-6); confirmation on save → #309 (Weber P-2)
- [x] code-reviewer round 2 (`docs/reviews/w5b-review-2.md`; C-10 fixed), fach-reviewer round 3 (`docs/reviews/w5b-fachreview-3.md`; M-3 added to #309), Helga and Dr. Weber again on the new hint (`docs/design/personas/helga-w5b-2.md`, `weber-w5b-2.md`; Weber P-12 fixed)
- [x] Workflow note: decision issue without implementation issue, how to show a test-after red without a prompt (`docs/reviews/workflow-notes-issue-166-219.md`)
- [x] closing code-reviewer round (`docs/reviews/w5b-review-3.md`)
- [x] Checks before push; archive session
- [x] Push, pull request and CI follow (CLAUDE.md, Workflow 9); merge waits for the product owner on #302 and #309

Files: `backend/src/services/category.service.ts`, `src/lib/server/category.ts`, `src/routes/config/categories/{+page.svelte,CategoryRow.svelte,CategoryForm.svelte,new/*,[id]/edit/*}`, `messages/*.json`, `docs/api-specification.md`, `docs/design/i18n-begriffe.md`, reviews (`docs/reviews/w5b-*.md`, `docs/design/personas/*-w5b*.md`, `docs/reviews/workflow-notes-issue-166-219.md`), tests (`category-predefined.pg`, `categories`, `categories-page.dom`, `category-predefined.dom`, `config-pages`, `focus-error.dom`, `tests/e2e/**`).

## Session: invoice check hints (#130, #131, #134)

- [ ] #130 rhythm: blocked on the product owner (fach-review V-1 Major: the literal rule hides a missing Q4; proposal in #130, label `entscheiden`)
- [x] #130 Leistungszeitraum: a `deviation`/`gap` finding names how many invoices count only in part (unit + DOM test, four languages)
- [ ] #130 scenario (rhythm): waits for the decision; the Leistungszeitraum part has its scenario
- [x] #131 late invoices without Leistungszeitraum within 90 days after the period end, listed per building with edit link (pg test, scenario, four languages)
- [x] #134 period under a year: invoices without Leistungszeitraum listed per building with edit link, a hint only (scenario, four languages)
- [x] a11y/language state `invoice-hints` for the new hints (screens.json, accessibility.feature, sprachen-bildschirme.feature)
- [x] fach-reviewer round 1 on the scenarios: `docs/reviews/hints-fachreview-1.md`
- [x] code-reviewer round 1: `docs/reviews/hints-review-1.md` (C-1, C-2 fixed: scenario «Hinweis auf eine Rechnung, die nur teilweise zählt» and pg test, both seen red without the source line)
- [x] personas round 1: `docs/design/personas/helga-invoice-hints.md`, `marco-invoice-hints-1.md` (no review: all contracts billed), `marco-invoice-hints-2.md`; P-1 (Heizöl listed) fixed with a pg test
- [x] code-reviewer round 2 on the fixes: `docs/reviews/hints-review-2.md` (C-10 fixed: scenario «Heizöl für den Tank …», seen red without the filter; C-11, C-13 fixed)
- [x] Helga round 2 on the row text: `docs/design/personas/helga-invoice-hints-2.md` (no findings)
- Files: `backend/src/services/invoice-completeness.service.ts`, `src/lib/statement-wizard.ts`, `src/routes/statements/generate/{PreviewChecks,InvoiceHint}.svelte`, `messages/*.json`, tests (`invoice-completeness*.test.ts`, `api-contracts.pg.test.ts`, `statement-wizard*.test.ts`, `tests/contracts/invoice-completeness.json`, `statement-generate.feature` and steps, a11y screens)
- [x] workflow-review: `docs/reviews/workflow-notes-issue-131.md`; session archived
- [x] code-reviewer round 3 (closing): `docs/reviews/hints-review-3.md` (no new findings)

## Session 2026-10-16 W4b: payment of a statement (#138, #93, #92)

- [x] @wip scenarios (statement-detail.feature), fach-reviewer before implementing (`docs/reviews/w4b-fachreview-1.md`; V-5 and V-3 → #291, V-9 → #290)
- [x] #138: Zahlungsdatum not before the Abrechnungsdatum, not after today, a real calendar date; backend refuses with codes `PAID_DATE_INVALID`, `PAID_DATE_BEFORE_STATEMENT`, `PAID_DATE_IN_FUTURE` (four languages, api-specification; tests in `statement-lock.pg.test.ts`, where the sent statements are); BFF checks the same with the bound and shows backend refusals with `backendMessage`
- [x] #93: setting a statement to paid stores its Saldo as `paid_amount` when no amount is given; `paidThisMonth` counts only Nachzahlungen; dashboard.pg.test without hand-written `paid_amount`; demo-data.pg.test adjusted. No scenario: `paid_amount` and `paidThisMonth` appear on no screen
- [x] #92: «Zahlung zurücksetzen» on a paid statement, confirmed with its consequence; back to Versendet (Überfällig after the Zahlungsfrist), paid date and amount cleared; the reset stored and listed in the Verlauf (JSONB column `payment_resets`, migration 0010)
- [x] a11y and language rows for the new dialog state
- No scenario: a refusal of the backend's paid-date check and a failed reset are failures between the BFF and the backend; the page's own check refuses every date first. Covered in `statement-actions.test.ts`, `statement-status.test.ts` (#138, #92). The stale-page refusal of a reset (`STATEMENT_NOT_PAID`) has its scenario (code review C-13)
- «Zahlungseingang mit Datum festhalten» enters the Abrechnungsdatum, which for a statement sent in the scenario is today; that the entered day (not the day of entry) is stored is shown in `statement-actions.test.ts` («speichert das gewählte Zahlungsdatum»)
- Files: `backend/migrations/0010_statement_payment_resets.sql`, `backend/src/db/schema.ts`, `backend/src/services/statement.service.ts`, `backend/src/routes/{statements,dashboard}.ts`, `src/lib/{statement,backend-error,types}.ts`, `src/lib/server/{statement,statement-actions}.ts`, `src/routes/statements/` (detail page, StatusActions, MetadataCard, list, mark-paid), `messages/*.json`, `tests/contracts/`, `docs/{api-specification,data-model,PRD-Dwello}.md`, tests, scenarios and a11y rows
- [x] Code review round 1 (`docs/reviews/w4b-review-1.md`)
- [x] fach-reviewer round 2 (`docs/reviews/w4b-fachreview-2.md`)
- [x] Personas Marco (`docs/design/personas/marco-w4b.md`), Dr. Weber (`docs/design/personas/dr-weber-w4b.md`)
- [x] Code review round 2 (`docs/reviews/w4b-review-2.md`): C-11/C-12 (PDF kept by the time the payment was recorded, `payment_recorded_at`; scenario), C-13 (scenario), C-14, C-15
- [x] daten-pruefer (`docs/reviews/w4b-datenpruefung-1.md`)
- [x] Code review round 3 (closing, `docs/reviews/w4b-review-3.md`): C-17 fixed; C-16, C-18 left as Minor/Nit
- [x] Merged origin/main (W6 reminders: a11y lists, seed, `src/lib/statement.ts`; migration renamed to 0010); merge review `docs/reviews/w4b-review-merge.md`: no Blocker/Major, C-2 (reset of a reminded statement untested) left as Minor
- [x] Workflow notes (`docs/reviews/workflow-notes-issue-138-93-92.md`)
- [x] Workflow notes, archive the session, pull request

## Session: contract wizard keeps the apartment and takes over the rent (#144)

Request: «Setze #144 um» (coordinator W10). #144's "Done means" still asks for an implementation issue; the decided Option A is the requirement, the pull request says `Fixes #144`.

- [x] The preselected apartment survives the detour to «Neuen Mieter erfassen» (scenario in `contract-new.feature`)
- [x] Nettomiete, Zusatzmiete and Akonto are preset from the apartment's last Mietvertrag, editable, marked as taken over (scenario in `contract-new.feature`)
- [x] fach-reviewer on the `@wip` scenarios before implementing (amounts)
- [x] fach-reviewer round 1 (`docs/reviews/p17-fachreview-1.md`): took V-1, V-2, V-3, V-6, M-1, M-3
- [x] axe/language state `rent-taken-over` (`tests/a11y/screens.json`)
- [x] Found: suggested Vertragsbeginn 01.01.2100 refused by the wizard's own check → #296
- [x] code-reviewer round 1 (`docs/reviews/p17-review-1.md`): fixed C-7, C-8; C-1..C-6 stay in the report
- [x] persona Helga (`docs/design/personas/helga-p17.md`): fixed P-1 (parking sentence only with a Zusatzmiete) and P-2 (wording)
- [x] Workflow note: decision issue implemented directly; persona re-run after a rewording (`docs/reviews/workflow-notes-issue-144.md`)
- [x] Checks before push; workflow review; archive session
- [x] Push, pull request, CI and merge follow (CLAUDE.md, Workflow 9)

Files: `src/lib/contract-wizard.ts`, `src/routes/contracts/new/{ContractWizard,RentStep,TenantStep}.svelte`, `src/routes/tenants/TenantForm.svelte`, `src/routes/tenants/new/+page.svelte`, `src/lib/server/tenant-form.ts`, `messages/*.json`, `tests/a11y/screens.json`, tests in `src/__tests__/` and `tests/e2e/`.

## Session: Remove the building map (#129)

- [x] `@wip` scenarios: building page shows the address without a map (`building-detail.feature`), privacy page no longer names CARTO (`privacy.feature`); seen red
- [x] `fach-reviewer` on the scenario before implementing (privacy text): `docs/reviews/map-fachreview-1.md`
- [x] Remove `BuildingMiniMap.svelte`, its DOM test, `leaflet`, `@types/leaflet`, the `.leaflet-container` rule, the `buildings_map*` messages and the CARTO paragraph `privacy_third_2` (all four languages); the unused `latitude`/`longitude` mapping of the building loads (columns stay)
- [x] Remove `PUBLIC_CARTO_API_KEY` and the map from `.env.example`, `deploy/demo/.env.example`, `docker-compose.prod.yml`, `docs/tech-stack.md`, README, PRD (marked dropped), U-23 in `offene-punkte.md` (no CSP exists)
- [x] Comment on #82 that CARTO is no longer a third party (R-1)
- [x] Slice review (`code-reviewer`): `docs/reviews/map-review-1.md`; closing round `docs/reviews/map-review-2.md`
- [x] Feature review: personas Dr. Weber (`docs/design/personas/weber-map129.md`) and Marco (`docs/design/personas/marco-map129.md`); no second `fach-reviewer` (the privacy text is the one reviewed before implementing)
- [x] Workflow review (`docs/reviews/workflow-notes-issue-129.md`), archive session
- [x] Before marking complete: lint, check, type-check, affected tests and E2E
- [x] Pull request (Fixes #129)

Files changed: `src/routes/buildings/BuildingMiniMap.svelte` (deleted), `src/__tests__/building-mini-map.dom.test.ts` (deleted), `src/routes/buildings/[id]/BuildingFacts.svelte`, building loads, `src/lib/types.ts`, `src/routes/privacy/+page.svelte`, `messages/*.json`, `src/styles/globals.css`, `package.json`, `bun.lock`, privacy and token tests, deployment files and docs, `tests/e2e/features/building-detail.feature`, `tests/e2e/features/privacy.feature`, `tests/e2e/fixtures/backend.ts`, `tests/e2e/{targets,questions,steps}/building-detail*`

## Session W6b: #63, #105 and #106 (the tenant's Sprache)

- [x] #63 `@wip` scenario: the Sprache offers Deutsch, Französisch, Italienisch, Englisch only (`tenant-edit.feature`), seen red
- [x] #105 `@wip` scenarios: label «Sprache für Abrechnung und Mahnungen» (`tenant-edit.feature`), «PDF auf Französisch» on the statement detail (`statement-detail.feature`), seen red
- [x] #106 `@wip` scenario: a reminder to a French-speaking tenant has a French title (`statement-reminder.feature`), seen red
- [x] fach-reviewer on the scenarios and the reminder texts in fr/it/en before implementing
- [x] #63 migration `0012` (renumbered from 0008 after merging main, C-12) (tenants and `default_language` `rm` → `de`, CHECK without `rm`), backend validators, `Language` type, frontend type and labels, help text in four languages (pg test of the migration)
- [x] #106 `reminderLetter` per language (unit test per language for all three Mahnstufen), `reminder.service` passes the tenant's Sprache; `statements_reminder_emailed` / `_letter` name the title in quotes
- [x] #105 label and «PDF auf {Sprache}» in `PdfAction.svelte` (DOM test)
- [x] docs: `docs/api-specification.md`, `docs/data-model.md`, `docs/tech-stack.md`, `docs/nebenkostenabrechnung-anforderungen.md`
- [x] fach-reviewer round 1: `docs/reviews/w6b-fachreview-1.md` (V-1 to V-4, V-6 to V-9 fixed; V-5 → new issue; V-10 existed before)
- [x] code-reviewer round 1: `docs/reviews/w6b-review-1.md` (C-1, C-4, C-6 fixed; others Nit/Minor, stay in the report)
- [x] fach-reviewer round 2: `docs/reviews/w6b-fachreview-2.md` (V-13, V-14 fixed; V-12 glossary → product owner)
- [x] persona Helga: `docs/design/personas/helga-w6b.md`
- [x] persona Dr. Weber: `docs/design/personas/weber-w6b.md` (P-1 → #305)
- [x] daten-pruefer: `docs/reviews/w6b-datenpruefung-1.md` (D-1 fixed)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-63-105-106.md`
- [x] closing code-reviewer round: `docs/reviews/w6b-review-2.md` (C-10 answered by the E2E run, C-11 fixed)
- [x] Feature review: persona, fach-reviewer, daten-pruefer (items above) (PDF texts)
- [x] Checks before push; workflow review; archive session
- [x] Push, pull request, CI and merge follow (CLAUDE.md, Workflow 9)

No scenario for the migration of existing `rm` tenants: E2E starts from fresh migrations, so no record with `rm` can exist (`migrations.pg.test.ts`).

Files: `backend/migrations/0012_tenant_language_without_rm.sql`, `backend/src/services/{reminder-letter,reminder.service,pdf.service,statement-pdf.service,config.service}.ts`, `backend/src/routes/{tenants,statements}.ts`, `backend/src/db/schema.ts`, `messages/*.json`, `src/lib/{tenant,types}.ts`, `src/lib/server/{statement,documents,statement-actions}.ts`, `src/routes/statements/[id]/{PdfAction,+page}.svelte`, `src/routes/tenants/+page.server.ts`, tests, `tests/e2e/**`, `tests/contracts/statement.json`, docs (`README.md`, PRD, api-specification, data-model, tech-stack, nebenkostenabrechnung-anforderungen).

## Session W5c: #74 (F-14c) Tankbestand with an allocable invoice in a non-allocable category

- [x] Read #74, #257, #130: neither `entscheiden` issue changes #74's outcome (#257 is how consumption is spread over days, #130 the invoice check)
- [x] Found: since #25 (merged 2026-10-08, before #74 was written) the backend keeps no invoice of a non-allocable category allocable (`applyCategory` on create and update, the recategorize path, `updateCategory`), so the state Option A answers cannot arise and Option A would be a dead branch in `fuelStockChange`. Followed the code (CLAUDE.md, "Coding guidelines"), said so in the pull request
- [x] Regression test of #74's case, red with the guard in `applyCategory` taken out (purchase CHF 2000 billed, no stock change)
- [x] code-reviewer round 1: `docs/reviews/74-review-1.md` (C-1, C-2 fixed; C-3 rejected; C-4 moot after archiving)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-74.md`
- [x] Checks before push; archive session
- [x] Push, pull request, CI and merge follow (CLAUDE.md, Workflow 9)

No scenario: the state #74 describes cannot be reached through the UI or the API since #25; the pg test pins it.

Files: `backend/src/__tests__/fuel-stock.pg.test.ts`, `docs/reviews/74-review-1.md`, `docs/reviews/workflow-notes-issue-74.md`

## Session 2026-10-16 W4b-Mietstatus: an apartment's tenancy (#117, #145, #58)

- [x] @wip scenarios: earlier contracts and the delete dialog's statements (#117), «Leer seit» (#145), «Vermietet ab» and Mieter «Künftig» (#58); fach-reviewer before implementing (`docs/reviews/w4bm-fachreview-1.md`: no Blocker/Major; V-2 wording taken, V-3 covered by `tenant-status.pg.test.ts`, V-6 translations taken)
- [x] #117: apartment page lists contracts by time, ended ones under «Frühere Mietverträge» with the history help; delete dialog of an ended contract says whether statements exist and links them; `docs/anforderungen-vertragsende.md` marks A-8 implemented
- [x] #145: backend gives the apartment's last Vertragsende; «Leer seit {Datum}» with the help on the apartment page and in the overview
- [x] #58: Mietstatus `relet` as «Vermietet ab {Datum}» on overview, building cards and apartment pages; Mieter «Künftig» with only a future contract, «Aktiv» only with a running one (backend status filter)
- [x] a11y and language rows for new states (`apartment-detail-vacant`, `contract-detail-ended`; seed: Emil 2.02 ended 2014, Fritz 2.03 from 2100)
- Files: `backend/src/services/{apartment,tenant}.service.ts`, `backend/src/routes/tenants.ts`, `src/lib/apartment.ts`, `src/lib/types.ts`, `src/lib/server/apartment.ts`, `src/routes/apartments/{+page.server.ts,[id]/ApartmentFacts.svelte,[id]/ContractHistory.svelte}`, `src/routes/buildings/{+page.server.ts,[id]/+page.server.ts}`, `src/routes/dashboard/{+page.server.ts,BuildingFigures.svelte}`, `src/routes/contracts/[id]/{+page.server.ts,+page.svelte,DeleteContract.svelte}`, `src/routes/tenants/{+page.server.ts,TenantFilters.svelte,TenantRow.svelte}`, `messages/*.json`, `tests/contracts/tenants.json`, `docs/design/i18n-begriffe.md`, `docs/anforderungen-vertragsende.md`
- [x] Code review round 1 (`docs/reviews/w4bm-review-1.md`): C-1 (Major, «keine Abrechnung» on a failed load) fixed; C-2, C-3 (API contract `apartments.json`), C-5, C-6, C-8 fixed; C-7 left (existing step wording)
- [x] fach-reviewer round 2 (`docs/reviews/w4bm-fachreview-2.md`): no Blocker/Major; V-9 fixed
- [x] Personas Anna (`docs/design/personas/anna-w4b-mietstatus.md`), Marco (`docs/design/personas/marco-w4b-mietstatus.md`): Anna P-1 (Major, overview names only empty apartments that had a contract) fixed with «Wohnung {Nr} leer»; P-3 (help on every empty apartment) fixed; Marco P-1 rejected (he typed `status=former`, not a filter value)
- [x] Fallow gate on the fixes: shared select fields in `apartment.service.ts`, `historyPeriod` for both contract histories (also `TenantContracts.svelte`, no behaviour change), dialog notes as `$derived`
- [x] Anna re-run (section «Nachprüfung» in her report): P-1 and P-3 (never-rented apartment) fixed; P-8 and the rest of P-3 Minor
- [x] Code review round 2 (`docs/reviews/w4bm-review-2.md`): C-1 closed; C-9 (Major, help on a never-rented empty apartment untested) fixed with scenario lines and a page test; C-10 (round-1 C-4 was wrong, the wizard never shows the status) reverted; C-11 rejected: the 3.02 part of Anna's P-3 is V-1 of the domain review, a product-owner decision; C-12, C-13 fixed
- [x] Merged origin/main (no conflicts); lint, check, type-check, vitest (2725), backend pg tests (47), E2E of the affected features
- [x] Closing code review (`docs/reviews/w4bm-review-3.md`): no Blocker/Major; C-14 (Nit) fixed
- [x] Workflow notes (`docs/reviews/workflow-notes-issue-117-145-58.md`)
- [x] Archive the session, pull request (one pull request for the three issues, as the coordinator's brief asks)

## Session: Login and header follow the browser language (#110)

Request: «Setze #110 um» (coordinator W9b). #110's "Done means" asks for an implementation issue; none exists, the decided Option 2 is the requirement, the pull request says `Fixes #110`.

- [x] `@wip` scenarios in `sprachen.feature`: login page in French for a French browser without cookie; overview follows the browser; the chosen language wins over the browser; seen red
- [x] fach-reviewer on the `@wip` scenarios before implementing (privacy text: the cookie is now set from the browser language)
- [x] fach-reviewer round 1 (`docs/reviews/p14-fachreview-1.md`): took R-1 (privacy sentence, four languages), V-1 (scenario: the first visit's language stays), V-2 (no `@wip` on «Die gewählte Sprache gilt …», its red shown by swapping the strategy order in the unit test)
- [x] Strategy `cookie, preferredLanguage, baseLocale` in `package.json` (`i18n`), `vite.config.ts`, `vitest.config.ts`; `Vary: Accept-Language` on pages
- [x] E2E and a11y language tests keep German (Playwright already pins `locale: 'de-CH'`); DOM tests pin `navigator.languages` to de-CH (`tests/mocks/browser-language.ts`)
- [x] Found: the old step «bevorzugt Englisch» never reached the server (Chromium sends the context locale over an extra header); `Browser.preferLanguages` now changes the request
- [x] code-reviewer round 1 (`docs/reviews/p14-review-1.md`): fixed C-1, C-3 (Vary on every answer), C-4; C-2, C-5 stay in the report; closing round `docs/reviews/p14-review-2.md` (C-6 already resolved)
- [x] Feature review: personas Anna (`docs/design/personas/anna-p14.md`) and Dr. Weber (`docs/design/personas/weber-p14.md`); no second `fach-reviewer` (the privacy sentence is the one reviewed before implementing)
- [x] Workflow note: decision issue implemented directly; personas README «language stored on the account» is outdated (`docs/reviews/workflow-notes-issue-110.md`)
- [x] Checks before push; workflow review; archive session
- [x] Push, pull request, CI and merge follow (CLAUDE.md, Workflow 9)

Files: `package.json`, `vite.config.ts`, `vitest.config.ts`, `src/hooks.server.ts`, `messages/*.json`, `tests/mocks/browser-language.ts`, `src/__tests__/{i18n.test.ts,privacy-page.dom.test.ts}`, `tests/e2e/features/sprachen.feature`, `tests/e2e/{screenplay/interactions,tasks/language,steps/language.steps}.ts`, `docs/reviews/p14-{fachreview,review}-1.md`, persona reports, `docs/reviews/workflow-notes-issue-110.md`

## Session 2026-10-16 W2c: help texts (#109, #67, #69)

- [x] #109: `@wip` scenarios in `help.feature` (new terms, contents list to the glossary) and their steps, seen red
- [x] #67, #69: `fach-reviewer` reads the proposed and listed help texts before implementing (help glossary, `config_help_*`, IBAN help with refunds, category sort order and translations): `docs/reviews/help-fachreview-{1,2}.md`, `docs/reviews/help-review-1.md`, `docs/design/personas/{helga,marco}-help-texts.md`
- [x] #109: contents list with anchors, glossary anchor `/help#glossary`, four new glossary terms (de, fr, it, en)
- [x] #67: `glossary_period_text` (same wording as PR #289) and `config_help_distribution_key` follow the glossary
- [x] #69: fach-reviewer findings fixed in all four languages; IBAN help names refunds; help under «Übersetzungen» (new `categories_translations_help`); product-owner points: #317 (new), #279, #83 (comments)
- [x] Slice review round 1 (`code-reviewer`): `docs/reviews/help-review-1.md`; C-1 (scenarios for the text fixes of #67/#69), C-2, C-4, C-5 fixed, C-3 left in its report
- [x] Feature review: `fach-reviewer` round 2 `docs/reviews/help-fachreview-2.md` (V-14 to V-17 fixed); personas `docs/design/personas/helga-help-texts.md`, `marco-help-texts.md` (no Blocker/Major)
- [x] Closing `code-reviewer` round before the push: `docs/reviews/help-review-2.md` (C-6 Nit left in its report)
- [x] Checks: lint, check, type-check, unit tests (all), E2E help, settings, categories, distribution keys and the axe/language rows of help, config, category and distribution-key screens
- [x] Workflow note: `docs/reviews/workflow-notes-issue-109-67-69.md`; collected review left to the coordinator
- [x] Session to archive; pull request (one for all three issues, as the coordinator asked)

Files: `src/lib/ui/Panel.svelte`, `src/lib/ui/PageHeader.svelte`, `src/routes/help/+page.svelte`, `src/routes/help/Glossary.svelte`, `src/routes/config/categories/CategoryForm.svelte`, `messages/{de,fr,it,en}.json`, `tests/e2e/features/{settings,distribution-keys}.feature`, `tests/e2e/{steps,questions}/settings…`, `tests/e2e/{features/help.feature,steps,questions,targets,tasks}/…app-frame…`, `src/__tests__/{help-page.dom,distribution-keys-pages.dom,categories-page.dom,config-pages}.test.ts`, `docs/reviews/help-fachreview-{1,2}.md`, `docs/reviews/help-review-1.md`, `docs/design/personas/{helga,marco}-help-texts.md`

## Session 2026-10-16 W4c: Fristen und Belegung (#64, #87, #55)

- [x] @wip scenarios: Mahnung task after the Mahnfrist (#64), Zahlungsfrist and Mahnfrist in the settings (#87), Belegung without percentage (#55)
- [x] fach-reviewer on the scenarios before implementing (`docs/reviews/w4c-fachreview-1.md`; V-1: a Rückerstattung stays a task from the day after its Zahlungsfrist)
- [x] #55: drop the percentage and its marker in `BuildingFigures.svelte`
- [x] #64: overview proposes a Mahnung only after Zahlungsfrist + Mahnfrist; markers in `src/lib/overview.ts` replaced. No scenario for the task's absence during the Mahnfrist: the task counts the statements of every parallel scenario (unit tests in `overview.test.ts`, `dashboard.test.ts`)
- [x] #87: settings «Zahlungsfrist (Tage)» and «Mahnfrist (Tage)» with help and range errors; overview window follows the configured Zahlungsfrist (No scenario for a value other than the default: settings are global to parallel scenarios; unit tests); contract `tests/contracts/config.json`
- [x] slice review 1 (code-reviewer, `docs/reviews/w4c-review-1.md`)
- [x] feature review: persona Helga (`docs/design/personas/helga-w4c-fristen.md`), Dr. Weber (`docs/design/personas/weber-w4c-fristen.md`), fach-reviewer round 2 (`docs/reviews/w4c-fachreview-2.md`)
- [x] findings: help texts with the allowed range, the Mahnfrist only for a Nachzahlung, «vue d'ensemble» (Helga P-2/P-3/P-5, Weber P-1, V-10–V-12); config load that is not JSON keeps the defaults (C-6); step «erklärt die Einstellung» (C-1)
- No scenario for an overdue Rückerstattung shown before the Mahnfrist ends (C-5): the task counts statements of all parallel scenarios; unit tests in `overview.test.ts` and `dashboard.test.ts`
- [x] Workflow note: one pull request for #64 and #87, which refer to each other; No scenario for aggregated counts and global settings (`docs/reviews/workflow-notes-issue-64-87-55.md`)
- [x] closing code-reviewer round (`docs/reviews/w4c-review-2.md`), session to archive; pull request (one for all three issues, as the coordinator asked)
- Files: `src/lib/overview.ts`, `src/routes/dashboard/+page.server.ts`, `src/routes/dashboard/BuildingFigures.svelte`, `src/lib/server/settings.ts`, `src/routes/config/+page.svelte`, `src/routes/config/SettingField.svelte`, `messages/*.json`, `tests/contracts/config.json`, `docs/nebenkostenabrechnung-anforderungen.md`, tests

## Session W7c: #115 (A-6) expired fixed-term contract

The issue's "Done means" is worded for a decision issue; its "Decided (product owner)" section (option 2) is the requirement and is implemented here (no implementation issue exists).

- [x] `@wip` scenarios in `dashboard.feature` and `contract-detail.feature`, seen red
- [x] Fachreview round 1 of the scenarios: `docs/reviews/a6-fachreview-1.md`; issue #308 opened, V-2 added to #120
- [x] Migration 0013: `rental_contracts.moved_out`, schema, `docs/data-model.md`
- [x] Backend: PUT accepts `movedOut`; any change of the end clears it; list and detail return it; API contracts (`contract-moved-out.pg.test.ts`)
- [x] Overview task «Befristeten Mietvertrag prüfen» for every expired, agreed end without successor and without `movedOut` (`overview.ts`, `dashboard/+page.server.ts`)
- [x] Contract detail: `FixedTermCheck.svelte` with «Unbefristet weiterführen» and «Mieter ist ausgezogen»; draft refusal offers delete, a sent one says it cannot continue (Fachreview V-2)
- [x] Texts in `messages/{de,fr,it,en}.json`; screen `contract-detail-expired` in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [x] `docs/anforderungen-vertragsende.md`: A-6 implemented, A-1 point 5 and the J-1 note; `docs/api-specification.md`
- [x] Code review round 1: `docs/reviews/a6-review-1.md`
- [x] Feature review: personas Anna and Dr. Weber (`docs/design/personas/anna-a6.md`, `weber-a6.md`; persona DB seeded by SQL with two expired fixed-term contracts, Lea Huber on Musterhaus 2.02 and Jonas Graf on Seepark B1), Fachreview round 2 `docs/reviews/a6-fachreview-2.md`
- [x] Fixes: consequence line and move-out dialog (personas P-1/P-2), M-3 wording, V-11/V-12/V-15; M-4 and new texts added to #308
- [x] Persona re-run on the fixes: `anna-a6-2.md`, `weber-a6-2.md`
- [x] Full axe and language suites (the shared a11y seed gained the building Talblick): 332 passed
- [x] Closing code review before the push: `docs/reviews/a6-review-2.md` (after the merge of `main`; migration renamed to 0013)
- [x] Workflow review notes: `docs/reviews/workflow-notes-issue-115.md`
- [x] Second merge of `main` (pull request conflicted): additive test conflicts; the a11y seed tenant renamed «Gina» because main added «Emil», whose expired agreed end now also shows the A-6 panel on `contract-detail-ended` (no cut-off, #115); code review round 3 `docs/reviews/a6-review-3.md`, E2E and the full axe/language suites (346) green
- [x] Pull request `Fixes #115`, CI green, merged (session archived before the push)

## Session W1b: statement position ↔ invoices (#96) and statement detail like the PDF (#104)

- [x] #96 Each statement position stores the invoices it billed (id, description, amount and days in the period; the change of the Tankbestand with `fuelStock`): migration `0014_line_item_invoices.sql`, `schema.ts`, `calculation.service.ts`, `statement.service.ts`, `docs/data-model.md`; `statement-invoices.pg.test.ts`
- [x] #96 The statement detail's hint counts invoices of the period recorded, changed or deleted since, from the stored link (`statement-invoices.service.ts`, `GET /statements/:id/changed-invoices`, `+page.server.ts`); pg tests for new, changed amount, changed category, deleted, made non-allocable, none, statement without stored link
- [x] #96 «Rechnung schon abgerechnet» / «Abrechnungen nicht aktuell» from the stored link (`GET /invoices/:id/statements`, `src/lib/server/invoice.ts`); scenario «Warnung bei einer nach der Abrechnung geänderten Rechnung»
- [x] #104 Statement detail: tenancy dates in the period (`PartiesPanel.svelte`), Wohnungsanteil and Zeitanteil per line, total «Ihre Nebenkosten» (`CostTable.svelte`), each line links to its invoices, with their days where they differ (`LineInvoices.svelte`, #240); mapper `src/lib/server/statement.ts`, `src/lib/types.ts`
- [x] Texts in `messages/{de,fr,it,en}.json`; contracts `statement.json`, `statement-changed-invoices.json`, `invoice-statements.json`; `docs/PRD-Dwello.md`
- [x] fach-reviewer on the @wip scenarios before implementing: `docs/reviews/w1b-fachreview-1.md`
- [x] Slice review round 1: `docs/reviews/w1b-review-1.md`
- [x] fach-reviewer round 2: `docs/reviews/w1b-fachreview-2.md`
- [x] Personas: `docs/design/personas/marco-w1b.md`, `docs/design/personas/dr-weber-w1b.md`
- [x] Fixes (V-15/C-1 statements before #96 by time as before; V-16/C-2 Zeitanteil in days like the PDF; C-3 screen `statement-parts-detail` in the axe and language checks, and the rounding rows of the cost table as valid `<dl>`; C-4 Tankbestand pg test; C-6, C-8, C-10, C-12; Marco P-1 Zeitanteil «nach Heizprofil»; M-3/Dr. Weber P-1 refund wording; V-14, V-17, P-6); issue #307 for a changed Tankbestand
- [x] Slice review round 2: `docs/reviews/w1b-review-2.md`; C-17 scenarios for the Zeitanteil in days and by heating profile
- [x] daten-pruefer: `docs/reviews/w1b-datenpruefung-1.md`
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-96-104.md`
- [x] Closing code-reviewer round (merge with main, C-17): `docs/reviews/w1b-review-3.md`
- [x] Contracts, lint, check, type-check, all tests and E2E (chromium + api, 812 passed) before the push

Files: `backend/migrations/0014_line_item_invoices.sql`, `backend/src/db/schema.ts`, `backend/src/services/calculation.service.ts`, `statement.service.ts`, `statement-invoices.service.ts`, `backend/src/routes/statements.ts`, `invoices.ts`, `src/lib/server/statement.ts`, `invoice.ts`, `src/lib/types.ts`, `src/routes/statements/[id]/` (`+page.server.ts`, `CostTable.svelte`, `LineInvoices.svelte`, `PartiesPanel.svelte`), `src/routes/invoices/[id]/` loads, `messages/*.json`, `tests/contracts/`, `tests/e2e/` (features, steps, fixtures, `screens.json`), `docs/data-model.md`, `docs/api-specification.md`, `docs/PRD-Dwello.md`, `docs/reviews/w1b-*`, `docs/reviews/workflow-notes-issue-96-104.md`; issue #307 opened.

## Session 2026-10-16 W8b: Tankbestand checks in the statement wizard (#136, #72, #73, #61)

- [x] @wip scenarios (statement-generate.feature, building-edit.feature), fach-reviewer before implementing (`docs/reviews/w8b-fachreview-1.md`; V-1, V-2, V-3, V-4, V-5, V-7, V-10, M-1 fixed; V-6, V-8, V-9 recorded)
- [x] #136: a missing reading whose Stichtag lies after today (Swiss day) is no finding
- [x] #72: building property «Kein Tank oder Tank stillgelegt» (migration, edit form, building page); with it the tank question stops; earlier readings without it give the missing-reading finding
- [x] #73: plausibility hint on the readings, never blocking: closing above opening + purchases, consumption ±25 % and CHF 100 against the year before
- [x] #61: valuation marker removed from `FuelStocks.svelte` (No scenario: a code comment only)
- Files: `backend/migrations/0015_building_no_tank.sql`, `backend/src/db/schema.ts`, `backend/src/routes/buildings.ts`, `backend/src/services/{fuel-stock,invoice-completeness}.service.ts`, `src/lib/{statement-wizard,types}.ts`, `src/lib/server/{building,building-form}.ts` (one mapper for the building of detail and edit), `src/routes/buildings/` (BuildingForm, BuildingFacts, FuelStocks, loads), `src/routes/statements/generate/{TankQuestion,CategoryCheck,CategoryFindingItem,PreviewChecks}.svelte`, `messages/*.json`, `docs/{data-model,api-specification}.md`, `tests/contracts/building.json`, tests and scenarios
- [x] code-reviewer round 1: `docs/reviews/w8b-review-1.md` (C-1, C-3, C-4, C-5, C-7 fixed; C-2, C-6 left)
- [x] fach-reviewer round 2: `docs/reviews/w8b-fachreview-2.md` (V-11 Major fixed with pg test and scenario, both seen red; V-12, V-14, V-15 fixed; V-13 with Anna P-1)
- [x] personas round 1: `docs/design/personas/helga-w8b.md` (P-1 fixed: help names where and in which order; tank question not reached: demo drafts), `docs/design/personas/anna-w8b.md` (P-1 framing fixed with a DOM test; that a negative consumption does not block is #73's decision)
- No daten-pruefer: no billed amount, statement, PDF or QR-bill changes; the checks only hint
- [x] Helga round 2: `docs/design/personas/helga-w8b-2.md` (tank question, link and saving work; no Blocker/Major), Seepark drafts removed by SQL first
- [x] fach-reviewer round 3: `docs/reviews/w8b-fachreview-3.md` (V-11 resolved; V-16 fixed with a pg test seen red; V-17, V-18 left)
- [x] Merged origin/main (mini map removed: the shared mapper drops latitude/longitude; migration renamed to 0013); second merge (conflict in this archive only; main had taken 0013): migration renamed to 0014, review `docs/reviews/w8b-review-4.md`; third merge (main had taken 0014): renamed to 0015
- [x] closing code-reviewer round (incl. the merge commit): `docs/reviews/w8b-review-2.md` (C-8, C-9 Nits fixed; one more round on that delta: `docs/reviews/w8b-review-3.md`)
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-136-72-73-61.md` (collected review left to the coordinator, see the note)
- Open, needs the product owner: glossary #315; that a negative consumption needs no confirmation (#73) although Anna P-1 asked for one
- [x] workflow-review, session archived, pull request

## Session 2026-10-17 W8c: statement wizard check thresholds (#65)

- [x] #130 read: its open rhythm question refines `missingParts` only with a year before, which already needs at least 2 invoices; the two rules stay apart
- [x] Thresholds confirmed as UX choices (15 % / 30 % Akonto, 25 % and CHF 100, 92 days): `#65` markers replaced by comments naming the issue (No scenario: code comments only); the F-16 half (#76) and the #130 marker in `CategoryCheck.svelte` stay
- [ ] 3-month gap only for categories with more than one invoice the year before: blocked, the hint runs per building and only without a year before; options A/B/C asked in #65 (label `entscheiden`); its markers in `statement-wizard.ts` (`GAP_DAYS`) and `PreviewChecks.svelte` stay
- Files: `src/lib/statement-wizard.ts`, `src/routes/statements/generate/CategoryCheck.svelte`, `backend/src/services/invoice-completeness.service.ts`, `implementation_plan.md`, this archive, `docs/reviews/{w8c-review-1,workflow-notes-issue-65}.md`
- [x] code-reviewer round 1: `docs/reviews/w8c-review-1.md` (C-1, C-2, C-3 Nits fixed)
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-65.md`
- [x] workflow-review, session archived, pull request (`Refs #65`)

## Session W6c: QR payment part on reminders (#108), Art. 257d OR hint (#59)

- [x] @wip scenarios: reminder PDF with payment part (statement-reminder.feature), help hint (help.feature); dialog after the 3rd Mahnung: DOM test (`No scenario`: the E2E stack cannot age three reminders)
- [x] fach-reviewer on the scenarios and texts before implementing (`docs/reviews/w6c-fachreview-1.md`; V-1 open question: #322)
- [x] #108: payment part for the open Saldo on every reminder PDF, reference of the statement (`reminder-pdf.ts`, `reminder.service.ts`, `pdf.service.ts`, `statement-pdf.service.ts`); none for a statement paid since (V-1)
- [x] #59: hint in the help «Zahlungen und Mahnungen» and the dialog after the 3rd Mahnung, four languages; TODO marker in `ReminderModal.svelte` removed (`messages/*.json` `statements_reminder_257d`, `help/+page.svelte`)
- [x] slice review (code-reviewer): `docs/reviews/w6c-review-1.md`
- [x] feature review: personas `docs/design/personas/helga-w6c.md`, `dr-weber-w6c.md`; `docs/reviews/w6c-fachreview-2.md`, `w6c-datenpruefung-1.md`
- [x] fixes: reminder with payment part on one page (D-1, C-1, V-6, C-13), tests C-2/V-9, scenario title C-7, PRD C-8, M-4; re-reviews `docs/reviews/w6c-datenpruefung-2.md`, `w6c-review-2.md` (no Blocker/Major)
- [x] Workflow note: one pull request per issue found only at the push (`docs/reviews/workflow-notes-issue-108-59.md`)
- [x] workflow-review, session archived; two pull requests: #59 (branch `claude/w6c-reminder-hint-59`), then #108 (this branch)

Files: `backend/src/services/{pdf.service,reminder-pdf,reminder.service,statement-pdf.service}.ts`, `backend/src/__tests__/reminders.pg.test.ts`, `messages/*.json`, `src/routes/help/+page.svelte`, `src/routes/statements/[id]/ReminderModal.svelte`, `src/__tests__/statement-pages.dom.test.ts`, `tests/e2e/features/{statement-reminder,help}.feature`, `tests/e2e/{steps/documents.steps,tasks/documents,targets/documents}.ts`, `docs/PRD-Dwello.md`, reviews `docs/reviews/w6c-*.md`, persona reports `helga-w6c.md`, `dr-weber-w6c.md`

## Session W2d: Saldo rounded in the tenant's favour (#79)

- [x] `statement-rounding.feature`: Nachzahlung rounded down, Rückerstattung up (`@wip`, seen red)
- [x] fach-reviewer on the scenario and on stored statements (old rounding kept)
- [x] `roundTo5Rappen` rounds in the tenant's favour (unit test red first)
- [x] Help text «Saldo» in all four languages, `docs/nebenkostenabrechnung-anforderungen.md` (lines 94, 148)
- [x] Fachreview round 1 (`docs/reviews/w2d-fachreview-1.md`): scenario «unter 5 Rappen», float-safe rounding, drafts re-rounded by migration `0014`, PDF/DOM cases, docs
- [x] Slice review round 1 (`docs/reviews/w2d-review-1.md`)
- [x] Feature review: fach round 2 (`docs/reviews/w2d-fachreview-2.md`), daten-pruefer (`docs/reviews/w2d-datenpruefung-1.md`), Dr. Weber (`docs/design/personas/dr-weber-w2d.md`)
- [x] Merge `main`, migration renamed to the next free number (C-1)
- [x] Workflow note (`docs/reviews/workflow-notes-issue-79.md`)
- [x] Lint, check, type-check, affected tests and E2E
- [x] Closing code review before the push: `docs/reviews/w2d-review-2.md` (after the merge of `main`; migration renamed to 0014, then 0016 after two more merges)
- [x] Pull request `Fixes #79` (session archived before the push)

Files: `backend/src/services/pdf-format.ts`, `backend/migrations/0016_statement_balance_tenant_favour.sql`, `messages/*.json`, `tests/e2e/features/statement-rounding.feature`, tests (`statement-pdf-data`, `statement-pdf-render`, `statement-generation.pg`, `migrations.pg`, `help-page.dom`, `statement-pages.dom`), docs (`PRD-Dwello.md`, `data-model.md`, `design-decisions.md`, `nebenkostenabrechnung-anforderungen.md`)

## Session: no Vertragsbeginn the wizard's own check refuses (#296)

Request: «Setze #296 um» (coordinator W10b). Chosen fix: suggest nothing outside the accepted years 19xx/20xx; widening the range would weaken the typo check for a case only test data reaches.

#296: the contract wizard never suggests a Vertragsbeginn its own date check refuses.

- [x] Unit test: `suggestedStartDate` suggests nothing when the day the apartment becomes free lies in a year `impossible` refuses (red first)
- [x] Fix: `impossible` moves to `contract-form.ts`, `suggestedStartDate` uses it (no import cycle); `statement-wizard.ts` imports it from there
- [x] Test data that meant "free in the future" with a contract ending 2099-12-31 now ends 2098-12-31 (free from 2099): `contract-wizard.dom.test.ts`, `tests/e2e/fixtures/screens.ts`, axe state `overlap-warning` in `tests/e2e/tasks/accessibility.ts`
- [x] Slice review round 1 (`code-reviewer`): `docs/reviews/296-review-1.md`
- [x] Same check for the start taken over from the URL (`initialContractValues`, «Neuen Mietvertrag … erfassen» after a contract ending 2099); `impossibleYear` moves with `impossible`
- [x] Closing code review round 2 (`docs/reviews/296-review-2.md`): no findings
- [x] Checks: lint, check, type-check, full vitest, axe/language rows of the contract screens
- [x] Workflow note: session started detached without a branch (`docs/reviews/workflow-notes-issue-296.md`)
- [x] Merged origin/main (conflicts in `statement-wizard.ts` imports, Carla's contract in `screens.ts` next to #89's management fee, this archive); merge review `docs/reviews/296-review-merge.md`: no Blocker/Major
- [x] Push, pull request, CI and merge follow (CLAUDE.md, Workflow 9)

Files: `src/lib/{contract-form,contract-wizard,statement-wizard}.ts`, tests in `src/__tests__/{contract-form,contract-wizard.dom,contracts-i18n}.test.ts`, `tests/e2e/fixtures/screens.ts`, `tests/e2e/tasks/accessibility.ts`.

No scenario: the E2E data would need a contract that ends in 2099 (issue #296).

## Session: Korrespondenzadresse, country and IBAN (#68, #102, #191, #114)

Branch `claude/w3c-korrespondenzadresse-68-102-191-114`. The issues' "Decided (product owner)" sections are the requirement (#68, #102, #191); #114 has its own "Done means".

- [x] #191: scenarios in `settings.feature` (Liechtenstein IBAN saved; error names CH and LI), `@wip`
- [x] #68: scenario in `tenant-new.feature` (field «Korrespondenzadresse» with its help), `@wip`
- [x] #102: scenarios for a Korrespondenzadresse abroad (tenant detail; statement PDF address block and payment part), `@wip`
- [x] #114: scenario «Abrechnung an einen ausgezogenen Mieter mit alter Adresse» in `statement-detail.feature`, `@wip`
- [x] fach-reviewer on the `@wip` scenarios before implementing: `docs/reviews/w3c-fachreview-1.md`
- [x] #191: settings form accepts CH and LI with MOD-97; `settings_error_iban` in four languages; PRD one rule
- [x] #68: legend «Korrespondenzadresse» and help at the field (four languages); tenant detail label
- [x] #102: migration `0017_tenant_country.sql` (default CH); form select; BFF and backend validation; QR-bill debtor country; PDF address block of statement and reminder
- [x] #114: next-steps text, `nextStepsDue` keeps the address step; warning in wizard preview and send dialog; overview task; `docs/anforderungen-vertragsende.md` A-5 implemented
- [x] slice reviews (code-reviewer) per slice
  - [x] iban: `docs/reviews/iban-review-1.md` (Nits C-1 to C-3 fixed)
  - [x] address: `docs/reviews/address-review-1.md` (Major C-1 fixed), round 2 `docs/reviews/address-review-2.md`
  - [x] oldaddr: `docs/reviews/oldaddr-review-1.md` (Major C-1: scenario checks the recipient abroad)
  - [x] oldaddr round 2 `docs/reviews/oldaddr-review-2.md` (Majors C-9, C-10 fixed)
  - [x] oldaddr round 3 `docs/reviews/oldaddr-review-3.md` (Major C-16 fixed)
  - [x] closing review `docs/reviews/closing-review-1.md` (merge resolution confirmed; Minor C-1 fixed: the PDF as sent is made when sending)
  - [x] closing review round 2 `docs/reviews/closing-review-2.md` (Minors C-3 to C-5 fixed)
  - [x] closing review round 3 `docs/reviews/closing-review-3.md` (C-8 to C-10 fixed; stay: C-4 test of a PDF failure on sending, C-6, C-7 — the parties panel showing the building's address predates this change and is not part of #114)
  - [x] merge with main (A-6 #115): `docs/reviews/merge-review-2.md` (Major C-1 fixed: an agreed end counts for A-5 as A-6 sees it), round 2 `docs/reviews/merge-review-3.md` (Major C-4 fixed: a later contract in the apartment counts too)
- [x] feature review: persona(s), fach-reviewer, daten-pruefer (QR-bill, PDF)
  - [x] fach-reviewer `docs/reviews/w3c-fachreview-2.md` (V-11, V-12, V-14 fixed)
  - [x] personas `docs/design/personas/anna-w3c.md`, `helga-w3c.md` (P-1 both, Helga P-2: a draft's PDF is made afresh on request; Anna P-2: the draft's page warns too)
  - [x] daten-pruefer `docs/reviews/w3c-datenpruefung-1.md` (no findings)
  - [x] Anna re-run `docs/design/personas/anna-w3c-2.md` (P-2 fixed; her new Minors stay: sending despite the warning was decided in #114); daten-pruefer round 2 `docs/reviews/w3c-datenpruefung-2.md` (Minor D-1 stays: only the API reaches it, named in the API specification)
- [x] a11y and language screens: `dashboard` `old-address-task`, `statement-generate` `old-address-preview`, new screens `statement-old-address-detail`, `contract-moved-out-detail`; the language check masks country names from Intl
- [x] Blocked on me: the glossary already has «Korrespondenzadresse» with country; only its code column («Land geplant (#102)») is the product owner's

- [x] Workflow note: `docs/reviews/workflow-notes-w3c.md`

Files changed (#114 too: `backend/src/services/{old-address,contract}.ts`, `src/routes/contracts/[id]/`, `src/routes/statements/[id]/`, `src/routes/statements/generate/`, `src/lib/overview.ts`, `src/routes/dashboard/+page.server.ts`, `tests/a11y/screens.json`, `docs/api-specification.md`): `src/lib/server/settings.ts`, `messages/*.json`, `docs/PRD-Dwello.md`, `backend/migrations/0017_tenant_country.sql`, `backend/src/db/schema.ts`, `docs/data-model.md`, `backend/src/routes/tenants.ts`, `backend/src/services/{tenant,statement,qr-bill,pdf,reminder-pdf,postal-address}.ts`, `src/lib/{tenant,types}.ts`, `src/lib/server/{tenant,tenant-form}.ts`, `src/routes/tenants/TenantFormFields.svelte`, `src/routes/tenants/[id]/TenantContactCard.svelte`, `docs/design/i18n-begriffe.md`, `docs/anforderungen-vertragsende.md`, `tests/contracts/tenant.json`, E2E features and steps.

## Session 2026-10-17 W8d: e-mail statements (#86, Option 2)

- [x] #86 read (no comments, no implementation issue): the decision is the requirement; #283, #305, #322 do not change its outcome
- [x] @wip scenarios `tests/e2e/features/statement-send.feature` incl. failure states (no e-mail address, mail refused; «not set up»: `No scenario`, the E2E stack always sends to the mail catcher, covered by `statement-mail.pg.test.ts`), seen red at the missing behaviour
- [x] fach-reviewer round 1 before implementing: `docs/reviews/w8d-fachreview-1.md` (V-1 Major fixed: Zahlungsfrist step and pg check; R-1 Major: the provider's country is #82's decision, done by W9c; V-2, V-3, V-7, V-8, V-9, R-2 fixed; V-4, V-5, V-6 to an issue)
- [x] backend: `POST /statements/:id/send` (`statement-send.service.ts`): e-mail with the PDF dated today in the tenant's Sprache, Dokument `type: statement`; letter or `byLetter` only marks sent; a failed e-mail is a coded refusal and leaves «Entwurf»
- [x] frontend: send dialog per channel, failure alert with «Per Brief zustellen», Dokument title in the UI language, the statement's Dokument not counted as Mahnung; help text `help_statements_4`; texts in four languages
- [x] privacy statement: `privacy_third_1` names statements by e-mail and what their PDF holds (country of the provider: #82, W9c)
- [x] screens.json / accessibility.feature / sprachen-bildschirme.feature: `statement-empty-detail` `send-dialog`, `send-refused` (Carla wants e-mail without an address)
- [x] code-reviewer round 1: `docs/reviews/w8d-review-1.md` (C-1 Major fixed with a DOM test seen red; C-3, C-4, C-10 fixed; C-2, C-5 to C-9, C-11 left, reasons in the report summary)
- [x] personas round 1: `docs/design/personas/helga-w8d.md` (P-1 = C-1; P-2 to #366; P-5 button wording fixed), `docs/design/personas/dr-weber-w8d.md` (P-1, P-2, P-6 wording fixed with tests seen red; P-3 to #366; P-4 is #82's)
- [x] fach-reviewer round 2: `docs/reviews/w8d-fachreview-2.md` (no Blocker/Major; V-11 = C-1; V-13, V-14 fixed; V-10, V-12, V-15, V-16 left)
- [x] new issues: #364 (letter offered up front, missing address before sending, later bounces), #366 (record how and when a statement was sent)
- No daten-pruefer: no amount, statement PDF or QR-bill changes; the e-mail attaches the PDF as stored (byte comparison in `statement-mail.pg.test.ts`), the Zahlungsfrist recomputed by fach-reviewer in both rounds
- [x] persona-stack sends e-mail to the mail catcher (`docs/design/tools/persona-stack.sh`: MAIL_FROM and the catcher were missing, every e-mail failed as «not set up»)
- [x] personas round 2: `docs/design/personas/helga-w8d-2.md` (P-1, P-5 fixed, nothing new), `docs/design/personas/dr-weber-w8d-2.md` (P-1, P-2 fixed; Minors and Nits left: the letter dialog not naming the Zahlungsfrist, the help calling it a period; in the report)
- [x] Merged origin/main (W3c: the PDF as sent made at sending, `changeStatementStatus`): conflicts only in `messages/*.json` (both sides kept); the send service now uses `changeStatementStatus` (pg test seen red)
- [x] closing code-reviewer round: `docs/reviews/w8d-review-2.md` (no Blocker/Major; C-14 fixed; C-12, C-13, C-15 left)
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-86.md`
- [x] workflow-review, session archived, pull request `Fixes #86`
- Files: `backend/src/services/{statement-send,pdf,reminder-letter,statement-pdf}.service.ts` (`reminder-letter.ts`), `backend/src/routes/statements.ts`, `backend/src/db/schema.ts` (comment), `backend/scripts/mail-catcher.ts`, `src/lib/server/{statement-actions,documents}.ts`, `src/lib/types.ts`, `src/routes/statements/[id]/{+page.svelte,+page.server.ts,SendDialog.svelte,SendFeedback.svelte,StatusActions.svelte}`, `messages/*.json`, `docs/{PRD-Dwello,api-specification,data-model}.md`, `tests/contracts/statement-send-refused.json`, tests and scenarios

## Session 2026-10-17 W4d: #83 #84 (W4d) fr/it/en terms from Fedlex, AI native read of tenant texts

Request (coordinator): «Setze #83 #84 um». #83 Option B: the Fedlex word (OR/ZGB, VMWG in fr/it) where one exists, a native speaker only for the rest, English plain words. #84 Option B: an AI model reads the texts a tenant sees (statement PDF, reminder letters, e-mails) as a native speaker; the landlord UI later. Both "Done means" are worded as decision issues: the decision is the requirement. Fedlex read with single `curl` downloads (WebFetch got 503): SR 220 of 1.10.2026, SR 221.213.11 of 1.10.2025, fr and it.

- [x] fach-reviewer on the term proposal (Fedlex words for the ❓ terms and «Kündigungsfrist»), before any text changes: `docs/reviews/w4d-terms-fachreview-1.md`
- [x] #83: terms with a Fedlex word in `docs/design/i18n-begriffe.md`, `messages/{fr,it,en}.json`, PDF and letter texts; terms pinned in `src/__tests__/i18n.test.ts` (red first). Kündigungsfrist fr «délai de congé», it «termine di preavviso»; Kündigungstermin fr «terme de congé»; it «addebitabile» settled; English ❓ removed. Files: `messages/{fr,it}.json`, `docs/design/i18n-begriffe.md`, `src/__tests__/i18n.test.ts`. No scenario: wording of existing texts only, pinned by `i18n.test.ts`; `sprachen-bildschirme.feature` checks the screens
- [x] #83: remaining ❓ terms (no Fedlex word: Umlagefähig fr, Mahnung family, Abrechnungslauf, Konfidenz, Kündigung aufheben) for a native speaker: #342; scope of Option B for «inquilino»/«pigione»: #343
- [x] #84: AI native reads (fr, it, en) of statement PDF, reminder letters and e-mail: `docs/reviews/w4d-native-{fr,it,en}.md`; triage reviewed by fach-reviewer (`docs/reviews/w4d-tenanttexts-fachreview-1.md`), applied as text changes in `backend/src/services/pdf.service.ts`, `backend/src/services/reminder-letter.ts`, `messages/{fr,en}.json` (`statements_balance_settled`, V-1), `docs/design/i18n-begriffe.md` (row «Ausgeglichen»); pinned tests updated (`statements-i18n.test.ts`, `statement-pdf-render.test.ts`). Deferred: invoice lines to #256, tenancy line to #325, salutation, «umgehend» with a deadline and English floors to #344, master-data names to #345. No scenario: reviewed translation wording (skill slice-review, Triage)
- [x] code-reviewer slice 1: `docs/reviews/w4d-s1-review-1.md`
- [x] code-reviewer slice 2: `docs/reviews/w4d-s2-review-1.md`
- [x] #84: German findings of `i18n-native-de.md` still open listed in the issue (comment on #84) and in implementation issue #348; landlord UI read later: #349
- [x] code-reviewer per slice; feature review: persona Dr. Weber on the fr/it/en PDFs and letters, 2 rounds (`docs/design/personas/dr-weber-w4d.md`; round 1 read German refund PDFs cached before the SQL language change → bug #351); fach-reviewer covered by the two reviews before implementation (no domain change since); no daten-pruefer (no amounts changed)
- [x] Workflow review: `docs/reviews/workflow-notes-issue-83-84.md`; E2E: language and axe rows of contract, statement and help screens and `statement-reminder.feature` (148 passed); archive the session
- [ ] PR `Fixes #83` `Fixes #84`, CI, merge

## Session W3d: Monatlich total names and «Tankbestand» title (#62, #75)

Branch `claude/w3d-monatlich-total-tankbestand-62-75`. Both issues have "Done means" worded like decision issues; their "Decided (product owner)" sections are the requirement.

- [x] #62, #75: glossary checked: «Monatlich total» no longer compares with «Bruttomiete»; «Zeitanteil», «Heizmaterial», «Empfangsschein» are entries; no `TODO(fachlich prüfen, #62|#75)` markers left
- [x] #75: scenario «Der Abschnitt zum Heizmaterial heisst Tankbestand» in `building-detail.feature`, seen red, green
- [x] fach-reviewer on the `@wip` scenario and the fr/it/en words before implementing: `docs/reviews/w3d-fachreview-1.md`
- [x] #75: `buildings_fuel_title` «Tankbestand» in four languages (fr/it/en from `docs/design/i18n-begriffe.md`, not the «citerne / serbatoio» of #315); fr intro «le dépôt» (V-1)
- [x] #62: rename `grossRent`, `rentBrutto`, `totalBrutto` and the test «Bruttomiete» to Monatlich total names (No scenario: internal names only, no behaviour change; no API field involved); `grossRent`, `rentBrutto`, `totalBrutto` → `monthlyTotal`
- [x] slice review rename (code-reviewer): `docs/reviews/rename-review-1.md`
- [x] #62 after review: tenant rental `rent` → `monthlyTotal` (V-5), E2E step «beträgt das Monatlich total der Wohnung» (V-6, C-1)
- [x] slice review title (code-reviewer): `docs/reviews/title-review-1.md` (Nits stay)
- [x] feature review: persona `docs/design/personas/helga-w3d.md` (no Blocker/Major; P-1 to P-5 stay in the report); fach-reviewer not again: no words changed after round 1 apart from its own V-1
- [x] Workflow note: `docs/reviews/workflow-notes-w3d.md`
- [x] Blocked on me: none for the glossary; «Monatlich total» without «Bruttomiete» and the entries «Zeitanteil», «Heizmaterial», «Empfangsschein» are already in `UBIQUITOUS_LANGUAGE.md`

Files: `src/lib/server/{contract-history,apartment}.ts`, `src/lib/types.ts`, `src/routes/apartments/[id]/{ContractHistory,MonthlyCostsCard}.svelte`, `src/routes/tenants/[id]/{+page.server.ts,TenantContracts.svelte,TenantRentalCard.svelte}`, `messages/*.json`, tests in `src/__tests__/{apartment,apartments-pages.dom,tenant-detail,tenant-detail-page.dom,buildings-pages.dom}.test.ts`, E2E `building-detail` and `apartment-detail` features, steps, questions, targets.

## Session 2026-10-17: #111 (P-16) planned PRD features, ZIP of a run (#356)

- [x] Search open issues; create #356 (ZIP of a run) and #357 (audit log)
- [x] PRD: ZIP and audit point to #356 / #357; automatic reminders and Swiss eID «Vision, nicht geplant»; database SSL and field encryption vision with O-3 / O-6
- [x] @wip scenarios «Alle Abrechnungen eines Laufs als ZIP herunterladen» and «ZIP eines Laufs mit einer inzwischen gelöschten Abrechnung anfordern», seen red at the missing button
- [x] `generateStatements` returns the created statements; BFF route zips their PDFs (fflate, already in the lockfile)
- [x] Result step: button «Alle als ZIP herunterladen» (full page load: the client router took `/statements/zip` for `/statements/[id]`), texts in four languages
- Files: `src/routes/statements/zip/+server.ts`, `src/lib/server/statement-generation.ts`, `src/lib/statement-wizard.ts`, `src/routes/statements/generate/{StatementWizard,StatementStep,GenerationStep}.svelte`, `messages/*.json`, `package.json`/`bun.lock` (fflate as devDependency, already in the lockfile), tests in `src/__tests__/` and `tests/e2e/`, `docs/PRD-Dwello.md`
- [x] Code review round 1: `docs/reviews/zip-review-1.md`
- [x] Personas Helga and Marco: `docs/design/personas/helga-zip.md`, `docs/design/personas/marco-zip.md`
- [x] Review fixes: axe and language states `statement-generate` `generation-result` and `statement-zip-refused`; ids encoded; generate answer from its contract
- [x] Code review round 2: `docs/reviews/zip-review-2.md`; C-11 fixed (year per look counted per worker)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-356.md`
- [x] Code review round 3: `docs/reviews/zip-review-3.md` (Nits C-13, C-14 fixed)
- [x] Session archived, PR (Fixes #356, Fixes #111; #357 stays open: large, its correction entry depends on #120's implementation)

## Session W9d: statement PDF language and «Gebäude» (#351, #249)

- [x] #351: main already makes a draft's PDF afresh on every request and the PDF as sent when sending (PR #361); scenario «PDF eines Entwurfs folgt der geänderten Sprache des Mieters» and two tests in `statement-pdf.pg.test.ts` (draft, sent): green on main, the draft cases red with the old `getStatementPdf` (stored PDF reused on the same day)
- [x] #249: scenario «Das PDF erklärt die Verteilung und den Heizölverbrauch» reads «Kosten des Gebäudes» and no «Liegenschaft», `@wip`
- [x] fach-reviewer on the `@wip` scenarios before implementing: `docs/reviews/w9d-fachreview-1.md`
- [x] #249: German PDF texts say «Gebäude» / «Kosten des Gebäudes», the Wohnungsanteil note «der Anteil Ihrer Wohnung an den Kosten des Gebäudes» (fr/it/en already say the app's words, pinned by render tests, seen red by changing those words for a moment); render tests; `docs/nebenkostenabrechnung-anforderungen.md`, `docs/design/i18n-begriffe.md`
- [x] slice review (code-reviewer): `docs/reviews/w9d-review-1.md`
- [x] feature review: fach-reviewer, daten-pruefer (PDF), persona
  - [x] persona Dr. Weber `docs/design/personas/dr-weber-w9d.md` (P-1 fixed: fr/it Wohnungsanteil note in the wording of fach-reviewer V-1; P-2 to P-4 predate the change and stay)
  - [x] fach-reviewer: no new round, the only wording changed after round 1 is its own proposal (V-1)
  - [x] daten-pruefer `docs/reviews/w9d-datenpruefung-1.md` (no findings)
- [x] closing review (code-reviewer) of the merge and the fr/it fix: `docs/reviews/w9d-review-2.md` (C-3 fr/it wording and C-4 its render test fixed)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-351-249.md`
- [x] Blocked on me: `UBIQUITOUS_LANGUAGE.md` lists «Liegenschaft» as a synonym of Gebäude and lacks «Kosten des Gebäudes» (product owner's edit): #374

Files changed: `tests/e2e/features/statement-detail.feature`, `backend/src/__tests__/statement-pdf.pg.test.ts`, `backend/src/__tests__/statement-pdf-render.test.ts`, `backend/src/services/pdf.service.ts`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/design/i18n-begriffe.md`, `docs/reviews/w9d-fachreview-1.md`, `docs/reviews/w9d-review-1.md`, `docs/design/personas/dr-weber-w9d.md`, `docs/reviews/w9d-datenpruefung-1.md`, `docs/reviews/w9d-review-2.md`, `docs/reviews/workflow-notes-issue-351-249.md`

## Session W3e: German wording findings of the native read (#348)

Branch `claude/w3e-de-wording-348`. All findings of the issue checked against `main` (74f223f): all still open. No scenario: wording of existing texts only; rules pinned in `src/__tests__/i18n.test.ts`, pinned texts in unit tests and E2E features updated (red first).

- [x] Rule tests (red first) in `src/__tests__/i18n.test.ts`: no straight quotes in de/en, every `*_error_*` ends with a period; pinned texts in unit tests and E2E updated
- [x] fach-reviewer on the proposed wording before any text turns green: `docs/reviews/w3e-fachreview-1.md` (V-1 «2,5» stays: rejected the finding; V-2, V-3, V-4, V-6 taken; V-5, V-7 stay)
- [x] Texts in `messages/{de,fr,it,en}.json`; gap list with `Intl.ListFormat` («Januar, Februar und März»), keys `statements_part_month`, `statements_list_and` removed; backend German texts of the coded refusals follow de.json («») in `backend/src/services/{category,heating-profile,distribution-key,formula}.service.ts`
- [x] code-reviewer slice: `docs/reviews/w3e-review-1.md` (no Blocker/Major; C-2, C-5, C-6 fixed; C-1 reviewed wording, C-3, C-4 stay); closing round `docs/reviews/w3e-review-2.md` (C-7 Nit stays)
- [x] Workflow note: nothing came up; E2E of the affected features and `sprachen-bildschirme` (187 + 242 passed); archive the session
- [ ] PR `Fixes #348`, CI, merge

Files: `messages/*.json`, `src/lib/statement-wizard.ts`, `backend/src/services/{category,heating-profile,distribution-key,formula}.service.ts`, tests in `src/__tests__/`, `src/lib/utils/__tests__/contract-availability.test.ts`, `backend/src/__tests__/`, E2E features, steps and questions that pin the texts.

## Session W3f: #76 Akonto and new-cost hints for a befristeter Mietvertrag, #119 preset with differing statements

- [x] #76: `@wip` scenario (Akonto-raise and new-cost hints of a running befristeter Mietvertrag), fach-reviewer before implementing
- [x] Fach review round 1 of both scenarios: `docs/reviews/w3f-fachreview-1.md` (V-1 to issue #387; M-1 to issue #388 after code review C-3)
- [x] #76: befristeter Mietvertrag gets the decided text (option A) in `akontoHint` and the new-cost finding (after the form rule, V-4); unbefristete keep today's text; F-10b thresholds stay
- [x] #76: `TODO(fachlich prüfen, #76)` marker removed from `src/lib/statement-wizard.ts`
- [x] #119: scenario (other statements of the period with different Heizprofile)
- [x] #119: `chosen()` keeps the settings' defaults when the other statements differ in Heizprofil or Verwaltungspauschale (null profiles skipped, V-5), `PresetNotice.svelte` says so (four languages); tests in `statement-generate-actions.test.ts`
- [x] code-reviewer slice: `docs/reviews/w3f-review-1.md`, round 2 `docs/reviews/w3f-review-2.md` (no Blocker/Major open)
- [x] Feature review: fach-reviewer round 2 `docs/reviews/w3f-fachreview-2.md`; personas `docs/design/personas/weber-w3f.md` (P-1 to #388), `docs/design/personas/anna-w3f.md` (P-1, P-2 to #387)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-76-119.md`
- [ ] PR `Fixes #76`, `Fixes #119`, CI; merge waits for the product owner (Majors needing a decision: #387, #388)

Files: `src/lib/statement-wizard.ts`, `src/lib/server/statement-generation.ts`, `src/routes/statements/generate/{+page.server.ts,preview.ts,PresetNotice.svelte,CategoryCheck.svelte,CategoryFindingItem.svelte}`, `messages/*.json`, tests in `src/__tests__/statement-{wizard,generation,generate-actions}*.ts`, `tests/contracts/building-contracts.json`, `tests/e2e/{features/statement-generate.feature,steps,targets,questions}`

## Session W4e: word-wise search (#160, #373)

Branch `claude/w4e-search-160`.

- [x] Implementation issue for #160 created: #373
- [x] Scenarios `@wip` (apartments.feature, buildings.feature) seen red
- [x] Word-wise apartment search (number, building name, street, place; «Wohnung» ignored), pg test
- [x] Word-wise building search, pg test
- [x] Help text at the apartment search field, empty state names the term (de/fr/it/en)
- [x] Code review round 1: `docs/reviews/search-review-1.md`
- [x] Personas: `docs/design/personas/helga-search-160.md`, `marco-search-160.md`
- [x] Fix Helga P-1 (Major): help text shows a pattern instead of the example «Seepark 3.02», which found nothing
- [x] Helga round 2 on the new help text: P-1 closed (same report)
- [x] Closing code review: `docs/reviews/search-review-2.md` (C-1 rejected: the wording was this session's own proposal in #373, not a decided text; C-2, C-3 fixed)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-160.md`
- [x] Found: fr/it/en card word («Appartement 3.02») not ignored, decision issue #376
- [ ] Session archived, pull request merged (Fixes #160, Fixes #373)

Files: `backend/src/services/{word-search,apartment.service,building.service}.ts`, `backend/src/__tests__/{apartment,building}-search.pg.test.ts`, `src/routes/apartments/{+page,ApartmentFilters}.svelte`, `src/lib/ui/TextInput.svelte` (`helpTestid`), `src/__tests__/apartments-pages.dom.test.ts`, `messages/*.json`, `tests/e2e/features/{apartments,buildings}.feature`, steps, targets, questions, `tests/e2e/fixtures/{backend,screens}.ts` (`withNames`; a11y search term without German, since the empty state repeats it)

## Session W6e: hints after saving an invoice of a billed period (#378, #379)

Branch `claude/w6e-invoice-hints-378-379`. #379 is not ready: the code has no rule for an invoice without a Verteilschlüssel beyond the settings' default key (preselected in the form) and «Gleichmässig» in the calculation; refuse or propose the category's key is the product owner's choice (issue "Stop and ask"). No fach-reviewer before implementing: navigation only, no domain rule or text changes.

- [x] #378: scenario «Rechnung einer schon abgerechneten Periode erfassen» in `invoice-new.feature`, `@wip`, seen red (landed on «Rechnungen»)
- [x] #378: after saving a new invoice whose periods have statements without it, Dwello opens the invoice's page with its warning (`MissedWarning`); DOM test seen red; edit already returns to that page (no `invoice-edit.feature` change). The warning's wording is #358's (PR #385), unchanged here: no new texts
- [x] slice review (code-reviewer): `docs/reviews/w6e-review-1.md`
- [x] feature review: personas `docs/design/personas/anna-w6e.md`, `docs/design/personas/marco-w6e.md`
- [x] fixes: in the statement wizard (returnTo) the save goes back to the wizard; «Speichern» stays busy until the page changes; a failed check opens the invoice's page; the warning links the building's statements of each period («Abrechnungen von … ansehen», existing text); DOM tests seen red, scenario «Von der Warnung zu den Abrechnungen der Periode» seen red
- [x] re-review (code-reviewer) of the fixes: `docs/reviews/w6e-review-2.md` (C-7 scenario checks the period, C-8 links described by their period: fixed, seen red; C-5, C-9, C-10 stay)
- [x] #379: under "Blocked on me" with the two options; what the code shows commented on #379
- [x] persona Majors not fixed here: Anna P-1 (Übersicht) → #386 (existed before); Marco P-2 / Anna P-4 (order of the warning's sentences) → comment on #338, which rewrites them
- [x] merge `main` once PR #385 (wording «Abrechnung berichtigen») is in, before the push, and check «Abrechnung berichtigen» in the scenario (review C-1): merged; the scenario checks the sentence (absent on the base commit); lint, check, type-check, DOM/open-work/design-guard tests, E2E invoice and statement-generate features with the axe and language rows (84 passed)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-378-379.md` (dependency on an open PR; collected review with parallel sessions left to the coordinator)
- [x] archive the session
- [x] persona Marco re-run on the link: `docs/design/personas/marco-w6e-2.md` (P-1 fixed; P-2 now Minor, stays, comment on #338)
- [x] closing review (code-reviewer): `docs/reviews/w6e-review-3.md` (no Blocker/Major; C-12 fixed; C-11, C-13 stay)
- [ ] PR `Fixes #378`, CI, merge

Files: `src/routes/invoices/new/+page.svelte`, `src/routes/invoices/MissedWarning.svelte`, `src/routes/invoices/[id]/+page.svelte`, `src/routes/invoices/[id]/edit/+page.svelte`, `src/routes/api/invoices/[id]/statements/+server.ts` (new), `src/__tests__/invoice-pages.dom.test.ts`, `tests/e2e/features/{invoice-new,invoice-detail}.feature`, `tests/e2e/steps/{invoice-detail,statements}.steps.ts`, `tests/e2e/{targets,tasks}/invoice-detail.ts`, reviews `docs/reviews/w6e-review-{1,2,3}.md`, personas `docs/design/personas/{anna-w6e,marco-w6e,marco-w6e-2}.md`, `docs/reviews/workflow-notes-issue-378-379.md`

## Session W11: PDF invoice line names the invoice (#236)

Branch `claude/w11-pdf-rechnung-236`. The issue's first point (whole Leistungszeitraum and amount) is done in #241; left: V-8 of #226.

- [x] Scenario «PDF nennt die Rechnung, wenn Daten und Betrag sie nicht unterscheiden» in `statement-detail.feature`, seen red at the missing name
- [x] fach-reviewer on the `@wip` scenario before implementing: `docs/reviews/w11-fachreview-1.md` (V-1 taken: a line without Leistungszeitraum always names its invoice; V-2 description vs Rechnungsdatum: the issue decided «description or Rechnungssteller», proposal added to #256; V-3 name as a suffix, no capital after a dash; V-4 scenario covers both cases)
- [x] Tests red first: `statement-pdf.pg.test.ts` (de, real statement), `statement-pdf-render.test.ts` (four languages); the PDF takes each part's description from the statement's stored `invoices` (same order, no migration), `partNamed` in four languages
- [x] slice review (code-reviewer): `docs/reviews/w11-review-1.md` (C-1 fixed, C-2 Nit stays: the Edit tool could not match the invisible U+00A0, output correct; C-3 Minor stays)
- [x] feature review
  - [x] fach-reviewer round 2: `docs/reviews/w11-fachreview-2.md` (V-5 added to #256, V-6 doc half-sentence)
  - [x] persona Dr. Weber `docs/design/personas/dr-weber-w11.md` (round 1 blocked by the demo draft NK-22222222-2025-0003, removed by SQL; rerun: #241 P-1 resolved; P-1 to P-3 Minor/Nit stay, wording belongs to #256)
  - [x] daten-pruefer `docs/reviews/w11-datenpruefung-1.md` (no findings)
- [x] Workflow note: nothing came up
- [x] closing review (code-reviewer) of e59119b and the merge of main: `docs/reviews/w11-review-2.md`
- [ ] PR `Fixes #236`, CI, merge

Files changed: `backend/src/services/pdf.service.ts`, `backend/src/services/statement-pdf.service.ts`, `backend/src/__tests__/statement-pdf.pg.test.ts`, `backend/src/__tests__/statement-pdf-render.test.ts`, `tests/e2e/features/statement-detail.feature`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/reviews/w11-*.md`, `docs/design/personas/dr-weber-w11.md`

## Session W10c: agreed Nebenkosten per Mietvertrag (#91)

- [x] Implementation issue for #91 created (own "Done means"): #363; decision issues #368 (agreed from a date, follow-up contract), #369 (glossary)
- [x] `@wip` scenarios (`statement-agreed-costs.feature`, `contract-new.feature`, `contract-edit.feature`) committed, `fach-reviewer` before implementing: `docs/reviews/w10c-fachreview-1.md`
- [x] Slice 1, backend: `contract_categories` (migration 0020, after main took 0018 and 0019; schema, `docs/data-model.md`), new contract with all umlagefähige categories, existing contracts from their statements, calculation bills only agreed categories, API to read and answer; heating profile and Tankbestand only when agreed (V-3), no «Rechnung geändert» for not agreed categories (V-2), demo contracts agree everything
- [x] Code review slice 1: `docs/reviews/w10c-s1-review-1.md`, re-review `w10c-s1-review-2.md`
- [x] Slice 2, statement wizard: question for unanswered categories in the step «Einstellungen», answer stored on the Mietvertrag (saved note); notice of not agreed costs; text of the «Neu» finding; a11y/language state `agreed-costs`
- [x] Code review slice 2 and 4: `docs/reviews/w10c-s2-review-1.md` (C-1 questions loading/failing block «Weiter», C-2 state `agreement-save-failed`, C-6, C-7, C-9 fixed)
- [x] Re-review slice 2 fixes and review slice 3: `docs/reviews/w10c-s3-review-1.md` (C-1 saving the form keeps unanswered categories unanswered, C-2, C-3 state `agreements-failed`, C-6, C-9, C-14, C-15 fixed)
- [x] Closing code review (slice 3 fixes, merge a9bd54a, feature review fixes): `docs/reviews/w10c-close-review-1.md` (C-1 to C-4 scenarios and state, C-5 fixed); `fach-reviewer` round 3 `w10c-fachreview-3.md` (V-12 = C-5, V-11, V-14 fixed)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-363.md`
- [x] Slice 3, contract: checkboxes in «Neuer Mietvertrag» and «Mietvertrag bearbeiten» (help texts per domain review V-6), list in «Prüfen» and on the detail page
- [x] Slice 4, PDF names the agreed categories it bills (domain review M-2), only on statements created since (agreed_category_ids)
- [x] a11y screens and languages for the new states (`statement-generate` `agreed-costs`, `agreement-save-failed`; the contract screens show the boxes in their existing states)
- [x] Feature review: personas `docs/design/personas/marco-w10c.md` (P-1 note when nothing is agreed, P-3 fixed), `weber-w10c.md`; `docs/reviews/w10c-fachreview-2.md` (M-1 PDF line only without uncategorised positions, V-1, V-2 fixed; #382 opened, M-2 added to #368); `docs/reviews/w10c-datenpruefung-1.md` (no findings)
- [x] Marco re-run on the note (P-1 fixed, P-5 Minor stays), `fach-reviewer` round 3 on M-1 (`w10c-fachreview-3.md`)
- [x] Closing re-review round 2: `docs/reviews/w10c-close-review-2.md` (C-11 scenario waits for the save, shown red without the fix; C-12, C-13, C-17 fixed)
- [x] Closing review of the merge of main (ced8426) and the `generation-result` fix: `docs/reviews/w10c-merge-review-1.md`
- [x] Merge of main with migration 0018 of #120: this migration renamed to 0019, and to 0020 after main took 0019 (#357); merge review `docs/reviews/w10c-merge-review-2.md` (C-1: the berichtigte Abrechnung refuses while a category with costs is unanswered, `STATEMENT_AGREEMENTS_OPEN`, scenario and pg test red before)
- [x] Re-review of the correction refusal: `docs/reviews/w10c-merge-review-3.md` (no Blocker/Major; C-5 fr «rectificatif» and C-7 API spec fixed, C-6, C-8, C-9 stay); merge of main with `0019_audit_log.sql` of #357: this migration renamed to 0020, merge review `docs/reviews/w10c-merge-review-4.md`
- [x] Session archived, push, pull request, CI, merge

Files changed: `backend/migrations/0020_contract_categories.sql`, `backend/src/db/schema.ts`, `backend/src/services/agreed-category.service.ts`, `contract.service.ts`, `calculation.service.ts`, `statement.service.ts`, `statement-invoices.service.ts`, `backend/src/routes/contracts.ts`, `backend/demo/demo-data.sql`, `docs/data-model.md`, `docs/api-specification.md`, `backend/src/services/pdf.service.ts`, `statement-pdf.service.ts`, `src/lib/server/statement-generation.ts`, `src/lib/server/api-proxy.ts`, `src/routes/api/statements/agreements/`, `src/routes/api/contracts/[id]/agreements/`, `src/routes/statements/generate/AgreedCosts.svelte`, `AgreementQuestion.svelte`, `StatementStep.svelte`, `StatementWizard.svelte`, `messages/*.json`, `tests/a11y/screens.json`, `tests/contracts/contract-agreements.json`, `tests/contracts/contract.json`, `src/lib/contract-form.ts`, `src/lib/contract-wizard.ts`, `src/lib/server/category.ts`, `src/lib/types.ts`, `src/routes/contracts/AgreedCategories.svelte`, `ContractForm.svelte`, `new/` (load, wizard, rent and review step), `[id]/` (load, terms, edit), tests (`agreed-categories.pg.test.ts`, `migrations.pg.test.ts`, `tests/e2e/…`)

## Session 2026-10-17 W7e: audit log (#357)

- [x] Scenarios in `settings.feature` («Protokoll öffnen», «Änderungen im Protokoll sehen», «Eintrag im Protokoll löschen»), breadcrumb example, `privacy.feature`; fach-reviewer before implementing: `docs/reviews/w7e-fachreview-1.md` (R-1, R-2, V-1 Major fixed; V-2–V-9, R-3 fixed or answered)
- [x] Migration `0019_audit_log.sql`, `schema.ts`, `docs/data-model.md`, `docs/api-specification.md` (11a)
- [x] Backend: `audit-log.service.ts` and route; entries for the Verwaltungspauschale rate, a category's Umlagefähigkeit (with the invoices it excluded), an invoice that becomes (not) umlagefähig (form, category, KI), a reset payment, logins; `recordStatementCorrection` for #358 (W2e); `audit-log.pg.test.ts`, contract `audit-log.json`
- [x] BFF: login entry from `src/routes/auth/callback` (`recordLogin` in `login-flow.ts`, fails open)
- [x] Page `/config/audit-log` with delete confirmation; link under «Einstellungen»; texts in four languages, term `TODO(fachlich prüfen, #370)`
- [x] a11y: `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature` (default, empty, delete-dialog)
- [x] Privacy statement names the log (PR #359 not merged: paragraph `audit_privacy` under «Welche Daten Dwello speichert», demo note)
- [x] `docs/PRD-Dwello.md` audit lines point to what is built
- [x] Code review round 1: `docs/reviews/w7e-review-1.md`
- [x] Fach review round 2 (feature review): `docs/reviews/w7e-fachreview-2.md`
- [x] Personas: `docs/design/personas/{helga,marco,weber,sven,anna}-w7e.md`
- [x] Re-reviews of the Major fixes, closing code-reviewer round: `docs/reviews/w7e-review-2.md` (C-1 closed); personas `anna-w7e-2.md`, `sven-w7e-2.md`
- [x] Workflow note: commit gate refuses red tests that import a missing module; detached session start; CRAP of a new page template (`docs/reviews/workflow-notes-issue-357.md`)
- [x] Code review rounds 3 and 4 (closing): `docs/reviews/w7e-review-3.md` (C-24 Major fixed), `-4`
- [x] Full E2E (chromium + api): 950 passed; 5 failed under load (contract-new, the IBAN race O-34), green alone; archive the session
- [x] #358 merged first (PR #385): «Abrechnung berichtigen» (`replaceStatement`) records the replacement in its transaction; `recordStatementCorrection(replaced)`; privacy paragraph names it (R-4); migration renumbered to `0019_audit_log.sql` after `0018_statement_correction.sql`

## Session W6d: minimum Saldo of CHF 5 (#94)

- [x] @wip scenarios: Nachzahlung and Rückerstattung below CHF 5 in the PDF sent to the tenant (no payment part, no IBAN request), settled on sending with the detail page's text, boundary with rounded examples (`statement-minimum-balance.feature`)
- [x] fach-reviewer round 1 on the scenarios and texts before implementing: `docs/reviews/w6d-fachreview-1.md` (M-1 needs the product owner: #352; glossary: #353; small Saldo noted in #291)
- [x] merged main with #341 (Saldo rounded in the tenant's favour); the threshold reads the stored, rounded `balance`
- [x] backend: settled on sending below CHF 5 with amount paid 0.00 (`updateStatementStatus`), PDF text without payment part or IBAN request (`pdf.service.ts`), Mahnung refused `REMINDER_BELOW_MINIMUM` also after a payment reset (`reminder.service.ts`), `belowMinimum` in `pdf-format.ts`
- [x] detail page: the payment panel says the amount is waived or not paid out, without Zahlungsfrist and «Bezahlt am»; no Mahnung offered (`PaymentPanel.svelte`, `+page.svelte`, `$lib/statement.ts`, `messages/*.json`)
- [x] docs: `data-model.md`, `nebenkostenabrechnung-anforderungen.md`, `PRD-Dwello.md`; O-36 (config insert race seen in E2E) in `offene-punkte.md`
- [x] slice review (code-reviewer) round 1: `docs/reviews/w6d-review-1.md` (C-1, C-2 Major fixed with a DOM test and a scenario, both seen red; C-3, C-8, C-9 fixed; C-7 rejected; C-4 to #291, C-5, C-6 left)
- [x] personas: `docs/design/personas/marco-w6d.md` (P-1 Major fixed: no deadline field below CHF 5, DOM and action test seen red), `docs/design/personas/dr-weber-w6d.md` (P-1 to #353, P-2 = M-1 #352, P-3 fixed with Marco P-1, P-4 #291); staged by SQL `stage-w6d.sql` (Seepark Weber/Brunner, Musterhaus Schmidt)
- [x] fach-reviewer round 2: `docs/reviews/w6d-fachreview-2.md` (no new Blocker/Major; M-1 open in #352; V-12 fixed; V-10, V-11 left: V-11 to #291)
- [x] daten-pruefer round 1: `docs/reviews/w6d-datenpruefung-1.md` (D-1 Major fixed: paid amount 0.00 also when marked paid after a reset, pg test seen red; D-2 to #291, D-3 to D-5 left)
- [x] closing code-reviewer round: `docs/reviews/w6d-review-2.md` (C-10 Major fixed with a scenario seen red; C-15 fixed; C-14 rejected: the object keeps the template under the complexity gate; C-11 to C-13 left)
- [x] closing code-reviewer round on the fixes since 4e7bad1: `docs/reviews/w6d-review-3.md` (no Blocker/Major; C-16, C-17 fixed; C-18 left)
- [x] Workflow note: a product-decision Major and the merge; fallow gate vs. ponytail (`docs/reviews/workflow-notes-issue-94.md`)
- [x] workflow-review, session archived, pull request (waits for the product owner on #352 / #353 before the merge)

Files: `backend/src/services/{pdf-format,pdf.service,reminder.service,statement.service}.ts`, `backend/src/__tests__/{statement-lock.pg,reminders.pg,statement-pdf-render}.test.ts`, `src/lib/statement.ts`, `src/routes/statements/+page.svelte`, `src/routes/statements/[id]/{+page,PaymentPanel}.svelte`, `src/routes/statements/[id]/edit/{+page.svelte,+page.server.ts}`, `src/__tests__/{statement-pages.dom,statement-edit-actions}.test.ts`, `messages/*.json`, `tests/e2e/features/statement-minimum-balance.feature`, `tests/e2e/{steps,questions,targets,tasks}/statement-{detail,edit}*.ts`, `docs/{data-model,PRD-Dwello,nebenkostenabrechnung-anforderungen}.md`, `docs/design/offene-punkte.md` (O-36), reviews `docs/reviews/w6d-*.md`, persona reports `dr-weber-w6d.md`, `marco-w6d.md`

## Session 2026-10-16 W5d: «Abgerechnet bis» on the Mietvertrag (#133)

- [x] Read #133 and its comments (Option 3; a period past «Abgerechnet bis» bills Mietstage and Akonto from the day after); #281 and #130 do not change its outcome; no implementation issue exists, the decision is the requirement
- [x] @wip scenarios (run skips, Mietstage from the day after, contract page, edit form and help), seen red at the missing behaviour
- [x] fach-reviewer before implementing (`docs/reviews/w5d-fachreview-1.md`): V-1 (Akonto checked with a Saldo), M-1 (PDF tenancy line), V-2 (lock of billed Mietstage uses the same first day; a changed «Abgerechnet bis» goes through it), V-3, V-5, V-7 (hint checked), V-9 fixed; V-4 covered by `contract-actions.test.ts`; V-6 → #327, wizard field (V-7) → #328, wordings (M-1, V-8) → #325
- [x] Backend: migration `0022_contract_billed_until.sql`, contract API, `billingStart` for Mietstage, Zeitanteil, heating share and Akonto, the lock of billed Mietstage, PDF tenancy line (`billed-until.pg.test.ts`)
- [x] BFF: `billsIn` (`src/lib/contract-status.ts`) for the run and `missingStatements`; #211 reuses it
- [x] UI: field and help in the edit form, «Abgerechnet bis» on the contract page, hint in the missing-statements warning; texts in four languages; term row in `i18n-begriffe.md` (❓, #325); a11y seed Dora with «Abgerechnet bis»
- Files: `backend/migrations/0022_contract_billed_until.sql`, `backend/src/db/schema.ts`, `backend/src/routes/contracts.ts`, `backend/src/services/{contract,calculation,prorating,statement-pdf,pdf}.service.ts`, `src/lib/{contract-status,contract-form,types}.ts`, `src/lib/server/statement-generation.ts`, `src/lib/ui/DateInput.svelte`, `src/routes/contracts/{ContractForm.svelte,[id]/+page.server.ts,[id]/+page.svelte,[id]/ContractTerms.svelte,[id]/MissingStatement.svelte}`, `messages/*.json`, `tests/contracts/{contract,building-contracts}.json`, `tests/e2e/**`, `docs/{data-model,api-specification}.md`, `docs/design/i18n-begriffe.md`
- [x] Code review round 1 (`docs/reviews/w5d-review-1.md`): C-1 (scenario moved with today), C-2 (mistyped date cleared «Abgerechnet bis»), C-3 (refusal scenario), C-6, C-7 fixed; C-4 covered by the part-month test; C-5 → #325; C-8 left
- [x] Persona Helga (`docs/design/personas/helga-w5d-abgerechnet-bis.md`): no Blocker/Major; P-1 to P-5 stay in the report
- [x] Persona Dr. Weber (`docs/design/personas/weber-w5d-abgerechnet-bis.md`): P-1 (Major, preview names no days or «Abgerechnet bis») → #327, P-2 (Major, Akonto row without derivation) → #325, both need the product owner's decision; P-3, P-4 → #325; P-6 → #337
- [x] fach-reviewer round 2 (`docs/reviews/w5d-fachreview-2.md`): V-10 (Major, a draft «Abgerechnet bis» covers promised a new statement) fixed; V-14 fixed; V-11 left in the report; V-12 → #337; V-13 → #327
- [x] daten-pruefer (`docs/reviews/w5d-datenpruefung-1.md`): no discrepancy
- [x] Merged origin/main (conflicts in schema, contract route and service, contract page loader, docs; migration renumbered to 0015)
- [x] Code review round 2 (`docs/reviews/w5d-review-2.md`): C-1, C-2, C-3 closed; C-9 (Major, = V-15) fixed; C-12 fixed; C-10, C-11 left (Minor, Nit)
- [x] fach-reviewer round 3 (`docs/reviews/w5d-fachreview-3.md`): V-10 closed; V-15 fixed (test seen red), V-16 wording taken, V-18 step added; V-17 existed before (left in the report)
- [x] Workflow notes (`docs/reviews/workflow-notes-issue-133.md`)
- [x] Code review round 3, closing (`docs/reviews/w5d-review-3.md`): C-9 closed; C-13 fixed; no Blocker/Major
- [x] Checks before push; archive the session
- [x] Push and pull request follow (CLAUDE.md, Workflow 9); the merge waits on the product owner (open Majors that need a decision: #327, #325; glossary row of «Abgerechnet bis»)

## Session W9c: privacy statement (#82) and documents of former tenants (#178)

Branch `claude/w9c-privacy-82-178`. Both issues' "Decided" sections are the requirement (no separate implementation issues exist).

- [x] #82 `@wip` scenarios (privacy.feature, authentication.feature, sprachen.feature, demo.feature), committed and reviewed by `fach-reviewer` before implementing (round 1: `docs/reviews/w9c-fachreview-1.md`)
- [x] #82 controller from `OPERATOR_*`, «Betreiber» explained, right of access (DSG) (R-1 open: #330)
- [x] #82 retention: kept until the landlord deletes, 10 years (Art. 958f OR, only for those required to keep books), no automatic deletion (R-2 follow-up: #332)
- [x] #82 third parties per configured provider (sign-in, mail transport via `GET /api/v1/mail-transport`, OpenPLZ, Google Maps): country, disclosure abroad, link; what the sign-in provider learns (SMTP provider and server country: #333)
- [x] #82 Google sign-in without `access_type=offline`/`prompt=consent`, no profile picture taken over (JWT, refresh, `/auth/me`)
- [x] #82 server log: purpose, reader, retention set by the operator
- [x] #82 cookie lifetime from `JWT_EXPIRY`; cookies can be refused (Art. 45c lit. b FMG, fach-reviewer agreed, R-9)
- [x] #82 sign-in page links the privacy statement
- [x] #82 terms: demo paragraph (screens.json `terms`/`demo`); «Liegenschaftsverwalter»; FR «rappels de paiement et les rappels»; draft notice reviewed, `TODO(fachlich prüfen, #82)` removed
- [x] #178 tenant page and overview name uploaded documents older than the end of the tenant's last Mietvertrag (No scenario: the upload API stamps the current time, so a document from before a past Vertragsende cannot be seeded; unit and DOM tests). Overview task that never ends: #331; glossary terms: #334
- [x] code-reviewer round 1 (`docs/reviews/w9c-review-1.md`)
- [x] fach-reviewer round 2 (`docs/reviews/w9c-fachreview-2.md`)
- [x] personas (`docs/design/personas/helga-w9c.md`, `docs/design/personas/dr-weber-w9c.md`)
- [x] closing code-reviewer round (`docs/reviews/w9c-review-2.md`)
- [x] workflow notes (`docs/reviews/workflow-notes-issue-82-178.md`)
- [x] merge of main reviewed (`docs/reviews/w9c-review-merge.md`, `-2`, `-3`): A-6 and #178 agree
- [x] plan archived; pull request open, merge waits for the product decisions (#330, #331)

Files: `src/routes/privacy/*`, `src/routes/terms/*`, `src/routes/login/+page.svelte`, `src/lib/server/{oauth,auth,operator}.ts`, `src/routes/auth/{me,refresh}/+server.ts`, `src/hooks.server.ts`, `src/app.d.ts`, `src/lib/stores.ts`, `src/lib/former-tenant-documents.ts`, `src/lib/overview.ts`, `src/routes/dashboard/+page.server.ts`, `src/routes/tenants/[id]/*`, `backend/src/{app.ts,mail/index.ts}`, `messages/*.json`, tests and features.

## Session 2026-10-17: QR-bill against SIX IG v2.4 (#78, W13)

- [x] Field-by-field check of `qr-bill.service.ts` and the payment part of `pdf.service.ts` against IG QR-bill v2.4 (six-group.com blocked by the network policy: guideline excerpts through `mmx search`, cross-checked with the `swissqrbill` 4.4.2 package); no change of the stored data needed, so the «Stop and ask» does not apply
- [x] Scenario `@wip` «Der Zahlteil ohne Korrespondenzadresse hat ein Feld für Name und Adresse» (`statement-detail.feature`), seen red
- [x] fach-reviewer round 1 on the scenario and the planned changes (`docs/reviews/78-fachreview-1.md`)
- [x] QR payload only with the permitted character set (IG 4.1.1), IBAN in capitals, no line break after EPD; unit tests first. No scenario: the payload is only readable by a decoder, covered in `qr-bill.service.test.ts`
- [x] «Zahlbar durch (Name/Adresse)» with a blank field with corner marks (52 × 20 mm receipt, 65 × 25 mm payment part) when the QR code names no debtor; the payment part prints creditor and debtor as in the QR code; unit tests first, scenario green
- [x] House number in the street line: decided in #102 (no separate field), no new issue
- [x] Issue #395 for the made-up creditor without Firmenadresse (pre-existing, fach-review V-1)
- [x] code-reviewer round 1 (`docs/reviews/78-review-1.md`): C-1 to C-7 fixed (field size test, receipt field ends above the amount, lengths cut in the QR data, scenario step without Korrespondenzadresse)
- [x] persona Dr. Weber (`docs/design/personas/dr-weber-78.md`): nothing to fix
- [x] daten-pruefer round 1 (`docs/reviews/78-datenpruefung-1.md`): no findings
- [x] code-reviewer round 2 (`docs/reviews/78-review-2.md`): no Blocker/Major
- [x] Result with guideline chapters noted in #78
- [x] Workflow notes (`docs/reviews/workflow-notes-issue-78.md`)
- [x] plan archived; pull request open, merge waits for the product owner (V-1, #395)

Files: `tests/e2e/features/statement-detail.feature`, `tests/e2e/steps/tenant-form.steps.ts`, `backend/src/services/{qr-bill,pdf}.service.ts`, `backend/src/__tests__/{qr-bill.service,statement-pdf-render}.test.ts`, `backend/src/__tests__/helpers/pdf-text.ts`, reviews and persona report.

## Session W14: #80 July share of «Heizung Bergregion»

- [x] Compare the Bergregion row with the source table: Mieterverband merkblatt_nebenkostenabrechnung_waehrend_periode.pdf (PDF dated 2023-09-09), page 2, «Verteilungsschlüssel in Bergebieten und im Tessin», row «Berggebiete»: 14.0, 11.5, 11.5, 9.0, 7.0, 4.5, 1.0, 4.0, 5.5, 8.5, 10.5, 13.0, the same as the migration (no misprint); mietrecht.ch and HEV not reachable from the cloud session
- [x] Name the source in the test comment (`backend/src/__tests__/heating-profiles.pg.test.ts`); No scenario: only a test comment changes, no behaviour
- [x] Note the source in issue #80 (comment 6232504741)
- [x] Slice review round 1 (`code-reviewer`): `docs/reviews/w14-review-1.md`
- [x] Closing code-reviewer round 2: `docs/reviews/w14-review-2.md`
- [x] Session archived before the pull request

Files: `backend/src/__tests__/heating-profiles.pg.test.ts` (comment), `implementation_plan.md`, this file, `docs/reviews/w14-review-{1,2}.md`.

## Session 2026-10-17 W8c-2: remove the 3-month hint (#65, option A)

- [x] Decision recorded in #65 (option A, label `entscheiden` removed)
- [x] @wip scenario «Ohne Vorjahr weist die Vorschau nicht auf Monate ohne Rechnung hin» (statement-generate.feature), seen red at the hint
- [x] fach-reviewer round 1: `docs/reviews/w8c2-fachreview-1.md` (V-2 fixed: Kaminfeger as the yearly invoice; V-1 Minor left in the report)
- [x] Remove the hint: `partly`/`GAP_DAYS`/`partial` and the unused `period` parameter of `invoiceRows` in `src/lib/statement-wizard.ts` (callers `PreviewStep.svelte`, `StatementStep.svelte`), the alert and its marker in `PreviewChecks.svelte`, `statements_partial_*` in `messages/*.json`; unit and DOM tests turned red first
- Files: those above, `src/__tests__/statement-wizard{,.dom}.test.ts`, `tests/e2e/{features/statement-generate.feature,steps/statement-generate.steps.ts,questions/statement-generate.ts,targets/statement-generate.ts}`
- [x] code-reviewer round 1: `docs/reviews/w8c2-review-1.md` (C-1 fixed: the DOM test checks the text «Teil der Periode», seen red on the old code; C-2 fixed)
- [x] workflow-review: no new point (the two of W8c are in `docs/reviews/workflow-notes-issue-65.md`)
- [x] session archived, pull request (`Fixes #65`)

## Session 2026-10-16 W5: category descriptions with exclusions (#204, #220, #221)

- [x] Migration `0021_category_descriptions.sql`: new descriptions for Heizung, Gartenpflege, Kehricht, TV/Kabelanschluss, Gebäudeversicherung, Verwaltung, only where a row still holds the seeded text (#204, #220)
- [x] pg test: the migration changes only untouched rows (`migrations.pg.test.ts`)
- [x] pg test: the categorisation prompt carries the new descriptions (`invoice-categorization.pg.test.ts`; #220 names `llm-prompt.test.ts`, which has no database)
- [x] `llm-eval.ts`: cases for heating insurance and administration, Baumfällung, Rasensanierung, a cable installation, a clearance, base fees by value (#204, #220); `llm:eval` before and after (MiniMax-M2.5, 47 cases: before 42/47 = 89 %, after 45/47 = 96 %; default model not runnable here)
- [x] `fach-reviewer` on the wording before the tests turn green: `docs/reviews/204-fachreview-1.md` (V-1 to V-7 applied; M-1, M-2 open)
- [x] #221: implementation issue #292 with its own "Done means" (takes M-2 of the domain review), #221 closed (decision issue)
- [x] `docs/data-model.md` if it lists descriptions
- [x] Slice review round 1: `docs/reviews/204-review-1.md` (C-1, C-3 fixed; C-4 rejected)
- [x] Persona review (Dr. Weber, Marco) of the category edit page: `docs/design/personas/{weber,marco}-204.md`; P-1 of both (description cut off) fixed with a multi-line field (`CategoryForm.svelte`, DOM test); Weber P-2 = fach M-1 (Kehricht text decided in #220) under "Blocked on me"
- [x] Workflow note: `docs/reviews/workflow-notes-issue-204.md`
- [x] Closing review round 2: `docs/reviews/204-review-2.md`; C-5 (Major, three rows still hid the text at 390 px) fixed with six rows and scenario «Ganze Beschreibung einer vordefinierten Kategorie auf dem Telefon» (seen red: 72 px hidden; the category row target now matches the exact name, since «Heizung» appears in other descriptions); C-6, C-7 fixed
- [x] Re-review of C-5: `docs/reviews/204-review-3.md` (C-5 to C-7 fixed; Nits C-8, C-9 stay in the report)
- [x] Archive the session, push, pull request, CI; the merge waits on the product owner (Weber P-2 / fach M-1 on the Kehricht text decided in #220)
- [x] Merge reviews after main took the migration number: `docs/reviews/204-review-4.md`, `204-review-5.md` (migration now `0021`, after main took 0018 to 0020)

Files: `backend/migrations/0021_category_descriptions.sql`, `backend/scripts/llm-eval.ts`, `backend/src/__tests__/{migrations,invoice-categorization,heating-profiles}.pg.test.ts`, `docs/data-model.md`, `docs/reviews/204-*.md`, `src/routes/config/categories/CategoryForm.svelte`, `src/__tests__/category-predefined.dom.test.ts`, `tests/e2e/{features/categories.feature,steps/categories.steps.ts,tasks/categories.ts,questions/categories.ts,targets/categories.ts,screenplay/questions.ts}`

## Session W16: categories marked «Brennstoff» hold a Tankbestand (#100)

Branch `claude/w16-brennstoff-100`. #100's "Decided" section (option 2) is the requirement; implemented directly, no separate implementation issue. The glossary already has «Brennstoff (Kategorie)» (an attribute of an allocable heating cost category), so no marker.

- [x] `@wip` scenarios (building-detail.feature: own heating category and the chimney sweep are not offered; categories.feature: an own category marked Brennstoff is offered), committed and reviewed by `fach-reviewer` before implementing
- [x] fach-reviewer round 1 (`docs/reviews/w16-fachreview-1.md`)
- [x] migration `0024_category_fuel.sql`: `categories.is_fuel`, set for the predefined «Heating» and every heating cost category that already has a Tankbestand; schema, data-model.md, PRD, contracts
- [x] backend: `isFuelCategory` reads the flag (no name check); create/update take `isFuel`, stored only with `isHeatingCost`; a category with a Tankbestand stays Brennstoff (`CATEGORY_FUEL_HAS_STOCK`); `*.pg.test.ts` for the predefined chimney sweep and an own heating category
- [x] frontend: building page filters by the flag; category form checkbox «Brennstoff» with help (only with «Heizkosten nach dem Heizprofil verteilen»); texts in four languages
- [x] a11y state `category-new` `fuel` (screens.json, accessibility.feature, sprachen-bildschirme.feature)
- [x] code-reviewer round 1 (`docs/reviews/w16-review-1.md`)
- [x] personas (`docs/design/personas/helga-w16.md`, `docs/design/personas/marco-w16.md`); fach-reviewer round 2 (`docs/reviews/w16-fachreview-2.md`)
- [x] fixes of the review findings: refusal scenario and a11y screen `category-edit-fuel`, texts naming both checkboxes, migration only for heating costs, api-specification, translation terms
- [x] Workflow note: auto mode refuses running a test with the code taken out to show its red (the E2E scenario of the refusal was written after the backend rule; its pg test was seen red)
- [x] Helga round 2 (`docs/design/personas/helga-w16.md`, «Runde 2»): P-1 fixed; P-2, P-3, P-6 Minor/Nit stay in the report
- [x] closing code-reviewer round (`docs/reviews/w16-review-2.md`): C-12, C-13 fixed; C-4, C-9, C-14 Nits left
- [x] workflow notes (`docs/reviews/workflow-notes-issue-100.md`); archive the session; pull request (Fixes #100)

Files: `backend/migrations/0024_category_fuel.sql`, `backend/src/db/schema.ts`, `backend/src/services/{category,fuel-stock}.service.ts`, `backend/src/routes/{categories,buildings}.ts`, `src/lib/{types.ts,server/category.ts}`, `src/routes/buildings/[id]/+page.server.ts`, `src/routes/config/categories/{CategoryForm,HeatingChoice}.svelte`, `messages/*.json`, `tests/contracts/category{,-fuel-refused}.json`, `docs/{data-model,PRD-Dwello,api-specification}.md`, tests and features.

## Session 2026-10-17 W18: «Ihre Angaben» instead of «Entwurf» for the wizard input (#57)

- [x] `@wip` scenarios: both wizards say the input is kept only in this browser and not saved yet, and «Angaben wiederhergestellt»; «Angaben verwerfen» (contract wizard); privacy notice; help `help_tenants_3`
- [x] `fach-reviewer` on the scenarios and the proposed texts before implementing (`docs/reviews/57-fachreview-1.md`; all Minors and Nits adopted)
- [x] Texts in `messages/{de,fr,it,en}.json`: `ui_draft_saved`, `ui_draft_restored`, `ui_draft_back` (V-2), `help_tenants_3`, `privacy_draft_notice`, `gallery_toast_info`; no success icon in the save status (V-1)
- [x] Unit/DOM tests updated red first (`ui-feedback`, `contract-wizard`, `statement-wizard`, `privacy-page`)
- [x] Scenarios green without `@wip`; a11y/language rows of both wizards still green
- [x] Slice review: `docs/reviews/57-review-1.md` (C-1 to C-4 fixed)
- [x] Feature review: `docs/design/personas/anna-57.md`, `docs/design/personas/dr-weber-57.md` (no Blocker/Major; Minors stay in the reports)
- [x] Closing review: `docs/reviews/57-review-2.md` (Nit C-1: fr guard for a space before «, `i18n.test.ts`)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-57.md`
- [x] Archive the session, pull request `Fixes #57`

Files: `messages/{de,fr,it,en}.json`, `src/lib/ui/SaveStatus.svelte`, `src/__tests__/{ui-feedback,contract-wizard,statement-wizard,privacy-page}.dom.test.ts`, `src/__tests__/i18n.test.ts`, `tests/e2e/features/{contract-new,statement-generate,privacy,help}.feature`, `tests/e2e/{steps/{contract-form,statement-generate,app-frame}.steps.ts,tasks/{contract-form,statement-generate,accessibility}.ts,questions/{contract-form,statement-generate,wizard}.ts,targets/wizard.ts}`, `tests/a11y/screens.json`, `docs/design/offene-punkte.md`, `docs/reviews/57-*.md`, `docs/reviews/workflow-notes-issue-57.md`, `docs/design/personas/{anna,dr-weber}-57.md`

## Session W7d: #71 Heizprofil within the Leistungszeitraum

- [x] Read #71 and the open `entscheiden` issues on the same calculation (#257, #256, #280, #237); #257 (Tankbestand) proposes that a delivery's Leistungszeitraum does not count in a tank category: tank categories keep today's sharing until #257 is decided
- [x] Scenario `@wip` in `tests/e2e/features/statement-detail.feature` (amount and PDF), seen red
- [x] `fach-reviewer` on the scenario before implementing (amounts change): `docs/reviews/71-fachreview-1.md`; M-2 → #335 (entscheiden), V-7 → #336 (entscheiden), V-6 → comment on #237
- [x] Calculation: a heating invoice with a Leistungszeitraum is shared by the Heizprofil's months inside it, normalised to 100 % (tdd, `calculation.service.ts`)
- [x] PDF: each invoice of such a position with its months and the division, recomputable from the printed values (#232)
- [x] `docs/nebenkostenabrechnung-anforderungen.md` rule 5, `docs/data-model.md` (CR2-N2)
- Files: `backend/src/services/{calculation,pdf,statement-pdf}.service.ts`, `backend/src/db/schema.ts` (`InvoicePart.profile`, jsonb, no migration), tests `heating-distribution.pg.test.ts`, `statement-pdf-render.test.ts`, `statement-pdf.pg.test.ts`, `statement-detail.feature` + step, docs rule 5 and `data-model.md`
- [x] Slice review round 1: `docs/reviews/71-review-1.md` (C-1, C-5 to C-8 fixed; C-2 answered by the domain review; C-3, C-4, C-9, C-10 stay in the report; C-11: V-3 stated in rule 5, V-4 stays in report 1)
- [x] Domain review round 2: `docs/reviews/71-fachreview-2.md` (M-4, V-9 to V-13 fixed)
- [x] Persona Dr. Weber: `docs/design/personas/dr-weber-71.md` (P-1 → #339 entscheiden; P-3 fixed; P-2, P-4 stay in the report)
- [x] Domain review round 3: `docs/reviews/71-fachreview-3.md` (M-4 closed; V-14 fixed)
- [x] Closing `code-reviewer` round 2: `docs/reviews/71-review-2.md` (C-1 fixed with a test, C-2 and C-4 fixed, C-3 accepted: reviewed wording)
- [x] `daten-pruefer` on Seepark Residenz A2 and controls: `docs/reviews/71-datenpruefung-1.md` (no findings)
- [x] Merge `origin/main` (conflict in the schema import of `calculation.service.ts` only)
- [x] Closing code review round 3: `docs/reviews/71-review-3.md` (C-1 Major: a decommissioned tank no longer keeps the exception, `periodReadings().covered`, test first; C-2 settled by it); re-review round 4: `docs/reviews/71-review-4.md` (C-1, C-2 closed; C-3 Minor stays in the report)
- [x] Merge of main after the product owner's go (conflicts in calculation, PDF texts, render test, rule 5): review of the merge commit `docs/reviews/71-review-5.md` (no Blocker/Major; C-1, C-2 stay in the report)
- [x] Further merge of main and test fix (part order of two invoices with one date): review round 6 `docs/reviews/71-review-6.md` (no Blocker/Major; C-1 pre-existing, C-2 stay in the report)
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-71.md`
- [ ] Pull request `Fixes #71`, CI green; merge waits for the product owner (open decision Majors #335, #339; session archived before the push)

## Session: #292 reasons of predefined categories on the invoice (W17)

- [x] `@wip` scenarios: invoice detail (reason of a predefined category, excluded invoice, own non-allocable category), changed texts in `categories.feature`
- [x] Draft texts (de, fr, it, en) and domain review by `fach-reviewer` before implementing: `docs/reviews/292-fachreview-1.md`; terms #397 (VMWG), #398 (Vollservicevertrag), Lift description #399 (now #407, point 5)
- [x] Reasons end with their conclusion; OR and VMWG spelled out per reason; Feuerlöscher and Schädlingsbekämpfung «umstritten» with the leaflet; lift with full-service contract; Gebäudeversicherung with the heating exception (204 M-2); help text and `invoices_legal_text` with OR spelled out
- [x] Contract note and unsure-KI hint with the decided wording
- [x] Invoice detail shows the category's reason in the categorisation panel, not as a warning; the general note only without a reason (backend: category `type` in the invoice response, contract `invoice.json`)
- [x] Demo invoices «Wartungsabonnement Lift 2024/2025»
- [x] Existing tests pinning the old texts updated
- [x] Slice review by `code-reviewer`: `docs/reviews/292-review-1.md` (C-1, C-4 to C-6 fixed; C-7 rejected)
- [x] Feature review: personas `docs/design/personas/{weber,helga}-292.md`; key row of a non-allocable invoice without a key removed (Helga P-1, Weber P-5); badge tone and the rest to `offene-punkte.md` U-39, Lift description in #407
- [x] Closing `code-reviewer` rounds on the fixes: `docs/reviews/292-review-2.md` (C-1 step «sagt die Rechnung ohne Verteilschlüssel nicht, wie sie verteilt würde» with its own precondition, seen red; C-2, C-3 comment; C-4), `docs/reviews/292-review-3.md`
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-292.md`
- [ ] Pull request `Fixes #292`, CI green, merge (session archived before the push)

Files: `messages/{de,fr,it,en}.json`, `src/routes/config/categories/CategoryReason.svelte`, `src/routes/invoices/[id]/{+page,CategorizationPanel}.svelte`, `src/lib/types.ts`, `backend/src/services/invoice.service.ts`, `backend/demo/demo-data.sql`, `tests/contracts/invoice.json`, `tests/e2e/{features,steps,questions,targets,fixtures}`, `src/__tests__/{categories-page.dom,categories,invoice-pages.dom,help-page.dom}.test.ts`, `docs/design/offene-punkte.md` (U-39)

## Session 2026-10-17: fewer review rounds (T1, T4 of `docs/reviews/workflow-rules-review-2026-10-17-2.md`)

- [x] Collected review on token cost: `docs/reviews/workflow-rules-review-2026-10-17-2.md`
- [x] T1: fixes of feature-review Minors/Nits form no slice; the closing round reviews them (`.claude/skills/slice-review/SKILL.md`, "Rounds")
- [x] T4: no closing round for a delta of reports, personas, plan or archive; the round's range leaves them out (`.claude/skills/pull-request/SKILL.md`, `CLAUDE.md` Workflow 7)
- [x] code-reviewer round 1: `docs/reviews/t1t4-review-1.md` (C-1 fixed: the range keeps `docs/design/personas/README.md` and `demo-records.md`; C-4 fixed; C-2, C-3 stay in the report)
- [x] session archived, pull request

Files: `CLAUDE.md`, `.claude/skills/{slice-review,pull-request}/SKILL.md`, `docs/reviews/workflow-rules-review-2026-10-17-2.md`, `docs/reviews/t1t4-review-1.md`

## Session 2026-10-17 CI: complete runs on main, balanced E2E shards, cached browsers

No scenario: CI configuration only, no app behaviour changes.

- [x] Runs on main are no longer cancelled by the next merge (`concurrency.cancel-in-progress` only for pull requests; 26 of the last 28 runs on main were cancelled)
- [x] E2E and axe shards balanced by measured duration instead of test count: 5 shards each (full PR suite timed locally: longest E2E shard 561 s → 235 s, axe 367 s → 245 s; a split by tag @i18n gave 241 s with more matrix code)
- [x] Playwright browsers cached between runs (a shared frontend build from the job Build was dropped: the shards would wait for it, about as long as they now build)
- [x] Slice review round 1: `docs/reviews/ci-review-1.md` (no Blocker/Major; C-1, C-4 fixed; C-2, C-3 stay)
- [x] Workflow note: `docs/reviews/workflow-notes-ci-main-runs.md`
- [x] Plan archived, pull request, CI

Files: `.github/workflows/ci.yml`, `docs/test-pyramid.md`

## Session W1c: outdated drafts and other settings in the wizard preview (#132)

- [x] Plan: #132's "Done means" is worded like a decision issue; the decision (options 1 and 4) is the requirement. Option 1 here; option 4 («Neu berechnen» on a single draft) split off into #338
- [x] `@wip` scenarios in `tests/e2e/features/statement-generate.feature` and their steps, seen failing
- [x] fach-reviewer on the scenarios before implementing: `docs/reviews/w1c-fachreview-1.md` (V-1, V-2, M-1, V-4, V-5, V-7 taken into the scenarios and tests)
- [x] Preview names outdated drafts (stored invoice links of #96, `GET /statements/:id/changed-invoices`, helper `changedInvoiceCount` now shared with the statement detail) and, in the same period, statements with another Heizprofil, one edited since, or another rate per contract (run's, own, none), links to them, says existing statements are kept and where to choose the same settings (`src/lib/server/statement-generation.ts`, `src/lib/statement-wizard.ts`, `PreviewChecks.svelte`, `src/lib/server/statement.ts`, `src/routes/statements/[id]/+page.server.ts`); unit and DOM tests first (`statement-generation.test.ts`, `statement-wizard.dom.test.ts`)
- [x] Contracts: `statements.json` (contractId, heatingProfileId, managementFeePercent, createdAt), new `heating-profiles.json` with its check in `api-contracts.pg.test.ts`
- [x] Texts in `messages/{de,fr,it,en}.json`; a11y/language state `preview-outdated` (`tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`, `tasks/accessibility.ts`, `fixtures/screens.ts`)
- [x] Preview without new statements (every contract billed, `PreviewEmpty.svelte`) names the outdated drafts only; scenario «Vorschau ohne neue Abrechnung nennt einen Entwurf, dem eine danach erfasste Rechnung fehlt»
- [x] Merge of `main` (additive conflicts in E2E steps and tasks only)
- [x] Slice review round 1: `docs/reviews/w1c-review-1.md` (C-1, C-5, C-8 fixed)
- [x] Feature review: personas Marco (`docs/design/personas/marco-w1c.md`, P-3 fixed, P-1 added to #338) and Dr. Weber (`weber-w1c.md`, P-2 fixed, P-1 under "Blocked on me"), Fachreview round 2 `docs/reviews/w1c-fachreview-2.md` (V-14, V-15 fixed)
- [x] `docs/PRD-Dwello.md`, wizard step «Review & Calculate»
- [x] Workflow review notes: `docs/reviews/workflow-notes-issue-132.md`
- [x] Second merge of `main` (no conflicts)
- [x] Closing code review round 2: `docs/reviews/w1c-review-2.md` (C-12 scenario «Vorschau nennt kein anderes Heizprofil bei einer Abrechnung über die ganze Periode», C-13 fixed)
- [x] Code review round 3 on the C-12/C-13 fix: `docs/reviews/w1c-review-3.md` (none open)
- [x] Pull request `Fixes #132` (session archived before the push; merge waits for the product owner: open Majors Dr. Weber P-1, Marco P-1)

Files: `src/lib/server/statement-generation.ts`, `src/lib/server/statement.ts`, `src/lib/statement-wizard.ts`, `src/routes/statements/generate/{PreviewChecks,PreviewEmpty,ChangedStatements}.svelte`, `src/routes/statements/[id]/+page.server.ts`, `messages/*.json`, `tests/contracts/{statements,heating-profiles}.json`, `backend/src/__tests__/api-contracts.pg.test.ts`, tests (`statement-generation`, `statement-wizard.dom`, `statement-wizard`, `statement-generate-actions`), E2E (`statement-generate.feature`, steps, tasks, targets, questions, a11y state `preview-outdated`), docs (`PRD-Dwello.md`, reviews, personas)

## Session 2026-10-17: shorter reports, one merge, kept-behaviour tests (T3, T2, T6 of `docs/reviews/workflow-rules-review-2026-10-17-2.md`)

- [x] T3: `fach-reviewer` writes a Minor/Nit as its row only; both reviewers report only the delta on a re-review (`.claude/agents/{fach-reviewer,code-reviewer}.md`)
- [x] T2: merge `main` once before the push, reviewed in the closing round; no further merges while the pull request waits (`CLAUDE.md` Gotchas "Branches", `.claude/skills/pull-request/SKILL.md`)
- [x] T6: a test that pins kept behaviour needs no red run (`CLAUDE.md` "Done means" and Workflow 2, `.claude/agents/code-reviewer.md`)
- [x] code-reviewer round 1: `docs/reviews/t3t2t6-review-1.md` (C-1 Major fixed: merge only before the first push; C-2 to C-4 fixed; C-5 stays in the report)
- [x] code-reviewer round 2: `docs/reviews/t3t2t6-review-2.md` (C-1 to C-4 closed; C-6 Major fixed: range up to the merge's first parent, remerge-diff, then after it; C-7 Nit stays)
- [x] code-reviewer round 3: `docs/reviews/t3t2t6-review-3.md` (C-6 closed; C-8 Nit fixed; C-5, C-7 stay in the reports)
- [x] session archived, pull request

Files: `CLAUDE.md`, `.claude/agents/{fach-reviewer,code-reviewer}.md`, `.claude/skills/pull-request/SKILL.md`, `docs/reviews/t3t2t6-review-{1,2,3}.md`

## Session W9: #211, #199 missing statements (Refs #408, #199)

- [x] Merge `origin/main` (#133 «Abgerechnet bis», #120 replaced statements) into the branch; drop the step-2 scenarios that wait on #281
- [x] Scenarios: partial range without a wizard button, «Abgerechnet bis» on dashboard and list, V-4 and V-8 of fachreview 1
- [x] fach-reviewer round 2 on the scenarios and the new texts (`docs/reviews/issue-211-fachreview-2.md`)
- [x] `missingPeriods` (accounting-period): uncovered intervals per ended period with rent days, «Abgerechnet bis», replaced statements
- [x] Contract page: uncovered ranges, invoice link per range, no wizard button for a partial range (#408)
- [x] Dashboard: every ended period since the Vertragsbeginn, by building
- [x] Contract list: badge «Abrechnung fehlt»
- [x] Texts in de/fr/it/en
- [x] Slice review (code-reviewer): `docs/reviews/issue-211-review-1.md`, round 2 `issue-211-review-2.md`
- [x] Feature review: personas `docs/design/personas/anna-211.md`, `helga-211.md`; fach-reviewer `docs/reviews/issue-211-fachreview-3.md`
- [x] Workflow note: issues closed into #408 during the task (markers and «Fixes» line), persona state set up by SQL (`docs/reviews/workflow-notes-issue-211.md`)
- [x] Slice review round 3: `docs/reviews/issue-211-review-3.md` (C-16, C-17 fixed)
- [x] Plan archived, pull request (Refs #408, #199; #211 closed into #408), CI

Files: `src/lib/accounting-period.ts`, `src/lib/server/missing-statements.ts`, `src/lib/overview.ts`, `src/lib/types.ts`, `src/routes/dashboard/+page.server.ts`, `src/routes/contracts/+page.server.ts`, `src/routes/contracts/ContractRow.svelte`, `src/routes/contracts/[id]/+page.server.ts`, `src/routes/contracts/[id]/MissingStatement.svelte`, `src/lib/server/statement-generation.ts` (marker), `messages/*.json`, tests and scenarios

## Session 2026-10-17 CI: E2E shards on main within their time limit

No scenario: CI configuration only, no app behaviour changes.

- [x] E2E shards on main get 60 minutes instead of 30 (run #534 on main: both E2E shards cancelled at 30:20 with every browser; pull requests keep 30)
- [x] Slice review round 1: `docs/reviews/ci2-review-1.md` (no Blocker/Major; C-1, C-2 fixed)
- [x] Plan archived, pull request, CI

Files: `.github/workflows/ci.yml`

## Session 2026-10-17: default KI model qwen3-vl:8b-instruct (#419)

- [x] Default model `qwen3-vl:8b-instruct` in `backend/src/config/llm.ts`, `.env.example`, Compose files, README, demo README, `docs/tech-stack.md`, `docs/PRD-Dwello.md`
- [x] README: upgrade note for installations that relied on the old default
- [x] `backend/CLAUDE.md`: `llm:eval` through OpenRouter counts as the default model's run
- [x] `llm:eval` with the new default through OpenRouter (baseline 43/47, #415): the run of #415 measured this model on unchanged prompts; no new run
- [x] Manual check: reading of a sample invoice through OpenRouter with the new model: a quarterly invoice and a Schlussrechnung with two deducted Akontorechnungen, every field right (amount 1'250.00 before the deduction, deducted 500.00), about 7 s each
- [x] Lint, check, type-check, affected tests; `code-reviewer` round 1 (`docs/reviews/419-review-1.md`)
- [x] Session to the archive; pull request
- [x] Workflow note: `docs/reviews/workflow-notes-issue-419.md`
- Files: `backend/src/config/llm.ts`, `.env.example`, `docker-compose.dev.yml`, `docker-compose.prod.yml`, `README.md`, `deploy/demo/README.md`, `docs/tech-stack.md`, `docs/PRD-Dwello.md`, `backend/CLAUDE.md`

## Session 2026-10-17: KI timeouts for installations without a GPU (#419, product owner: 120 s)

- [x] BFF: a request the KI answers (POST `/invoices`, `/invoices/extract`, `/invoices/categorize`, `/invoices/:id/recategorize`) waits 300 s, every other one 30 s
- [x] Backend: `LLM_TIMEOUT` default 120000
- [x] Docs: `.env.example`, README, `docs/tech-stack.md` name the new defaults and the CPU timings
- [x] Checks; closing `code-reviewer` round (`docs/reviews/419-review-2.md`): C-1 Major (no scenario) fixed with «Dwello wartet auf eine KI, die zum Lesen länger als eine halbe Minute braucht», red on be454eb6 (BFF 504, Betrag empty), green now; C-2 to C-5 fixed, C-6 kept
- [x] Re-review of the C-1 fix (`docs/reviews/419-review-3.md`): C-1 closed, C-7 Nit kept (the long wait stays out of the shared step)
- Files: `src/lib/server/api-proxy.ts`, `tests/unit/api-proxy.test.ts`, `backend/src/config/llm.ts`, `backend/src/__tests__/llm-recipient.test.ts`, `.env.example`, `README.md`, `docs/tech-stack.md`
- Measured on 4 CPU cores without GPU, model loaded: qwen3-vl:8b-instruct categorize 37 s, read 77–90 s; qwen2.5vl:7b 21 s and 75 s
- Files (round 2): `tests/e2e/features/invoices.feature`, `tests/e2e/steps/invoice-upload.steps.ts`, `tests/e2e/tasks/invoice-upload.ts`, `tests/e2e/screenplay/interactions.ts` (`Wait.until` timeout), `backend/scripts/llm-stub.ts`

## Session W15: Akonto and rent hints in the contract forms (#66)

Branch `claude/w15-akonto-hints-66`. The pull request says `Refs #66`: one of the three decided parts waits on the product owner.

- [x] @wip scenarios in `contract-new.feature` (Akonto help) and `contract-edit.feature` (running contract: Art. 269d OR, befristet)
- [x] fach-reviewer round 1 on the scenarios and texts before implementing (`docs/reviews/66-fachreview-1.md`)
- [x] Akonto help names the Nebenkosten agreed in the Mietvertrag, examples stay (option A)
- [x] Hint for a contract without Akonto: not built; fach-review M-1 contradicts the decided text, question to the product owner in #66 (label `entscheiden`)
- [x] Running-contract hint names Art. 269d OR (befristet: #76's sentence, `TODO(fachlich prüfen, #388)`)
- [x] `TODO(fachlich prüfen, #66)` markers removed; all four languages
- Files: `messages/{de,fr,it,en}.json`, `src/routes/contracts/ContractForm.svelte`, `src/routes/contracts/new/RentStep.svelte`, `src/lib/ui/MoneyInput.svelte` (help testid), `src/__tests__/contract-edit.dom.test.ts`, `src/__tests__/contract-wizard.dom.test.ts`, `tests/e2e/{features,steps,questions,targets}`
- [x] Code review round 1 (`docs/reviews/66-review-1.md`)
- [x] Fach review round 2 (`docs/reviews/66-fachreview-2.md`)
- [x] Feature review round 1: personas `docs/design/personas/weber-66.md`, `helga-66.md`; P-1 fix (hint says what Dwello does and when to enter an increase)
- [x] Persona round 2 on the P-1 fix (same reports, «Runde 2»)
- [x] Code review round 2 (`docs/reviews/66-review-2.md`)
- [x] Fach review round 3 on the P-1 fix (`docs/reviews/66-fachreview-3.md`)
- [x] Workflow note: split of a decided issue and the fach round limit (`docs/reviews/workflow-notes-issue-66.md`)
- [x] Push and pull request follow (CLAUDE.md, Workflow 9)

## Session W15b: hint without Akonto, Nebenkostenpauschale, form rule for befristet (#66, #388)

Branch `claude/w15-akonto-hints-66` (PR #401). Product owner 2026-10-17: #66 option A of the comment plus the glossary term «Nebenkostenpauschale», #388 option A.

- [x] @wip scenarios: hint without Akonto (`contract-new.feature`), form rule in the befristet running-contract hint (`contract-edit.feature`) and in the Akonto hint of the statement preview (`statement-generate.feature`)
- [x] fach-reviewer round 1 before implementing (`docs/reviews/66b-fachreview-1.md`)
- [x] `contracts_no_advance_text` per #66 (all four languages)
- [x] Form rule appended to `contracts_running_text_fixed_term` and `statements_akonto_raise_fixed_term`; `TODO(fachlich prüfen, #388)` removed
- [x] «Nebenkostenpauschale» in `UBIQUITOUS_LANGUAGE.md` (product owner's instruction, against CLAUDE.md «never edit it») and `docs/design/i18n-begriffe.md`
- Files: `messages/*.json`, `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `src/routes/contracts/ContractForm.svelte` (marker), tests `contract-wizard`, `contracts-i18n`, `contract-edit.dom`, `statement-wizard`, E2E `contract-new`, `contract-edit`, `statement-generate`
- [x] Code review rounds 1 and 2 (`docs/reviews/66b-review-{1,2}.md`); fach-review rounds 2 and 3 (`docs/reviews/66b-fachreview-{2,3}.md`)
- [x] Personas `docs/design/personas/{helga,weber}-66b.md`: Helga P-2 fixed (`contracts_agreed_costs_none_text`), Helga P-1 → #428 (product decision)
- [x] Workflow note: glossary edit on the product owner's instruction, round limit (`docs/reviews/workflow-notes-issue-66.md`)
- [x] Push and pull request follow (PR #401 says `Fixes #66`, `Fixes #388`)

## Session 2026-10-17 CI: readable E2E logs, no archive conflicts

No scenario: CI and repository configuration only, no app behaviour changes.

- [x] Reporter `list` on CI, so the log names each failed test (run #540 named none)
- [x] `.gitattributes`: `merge=union` for `docs/archive/implementation-plan-verlauf.md` (every task appends there; four conflicts in one session; a simulated merge of two appended sessions conflicts without it and keeps both with it)
- [x] Slice review round 1: `docs/reviews/ci3-review-1.md` (no Blocker/Major; C-1 fixed in the commit message; C-2 to C-4 stay)
- [x] Plan archived, pull request, CI

Files: `.gitattributes`, `playwright.config.ts`

## Session W16b: E2E races O-36 and O-37 (product owner's choice for PR #417)

Branch `claude/w16b-e2e-races`. Non-functional (rows in `docs/design/offene-punkte.md`); no issue. No scenario: it fixes a race between test data and a backend write, not a behaviour the Liegenschaftsverwalter sees.

- [x] O-37 root cause: the whole E2E database had no building while «draft-dropped» and «draft-discard-dialog» ran first; `restoreDraft` ticks the first building (or tenant) but the two draft states seeded nothing. Fix: `seedFor` seeds the screen records for `draft-restored` and `draft-discard-dialog` (the failing pair seen red, then green; all 8 draft rows green)
- [x] O-36: `saveConfig` upserts on `key`; pg test with ten parallel first writes (red with a warmed pool, then green)
- [x] rows moved to `docs/archive/offene-punkte-verlauf.md`
- [x] code-reviewer round 1 (`docs/reviews/w16b-review-1.md`): no Blocker/Major; C-1 (draft state ticks its own building) and C-2 (select only for the audited rate) fixed; C-3 accepted (a race test), C-4 done at the merge into #417
- [x] closing code-reviewer round 2 (`docs/reviews/w16b-review-2.md`): no Blocker/Major; C-5 (lost line break) fixed, C-6 Nit left
- [x] session archived; pull request and merge, then main merged into #417 (O-37 row removed there)

Files: `backend/src/services/config.service.ts`, `backend/src/__tests__/config.pg.test.ts`, `tests/e2e/fixtures/screens.ts`, `docs/design/offene-punkte.md`, `docs/archive/offene-punkte-verlauf.md`.

## Session 2026-10-18: E2E in Firefox and WebKit (#424)

- [x] Reproduce group 1 (page wider than 390 px) in Firefox and WebKit, find the cause: (a) test names ended in a full UUID, whose digit groups Firefox and WebKit do not break (fieldset min-content); (b) WebKit widens the field around a select by its options' flex boxes
- [x] Fix group 1: (a) test fault: `seed.unique` appends 12 hex digits, the language check masks them; (b) app fault: `select { contain: paint }` in `globals.css`, the screen checks red in WebKit before
- [x] Group 2: statement wizard stays on step «Gebäude» in Firefox: passes on current `main` (statement-generate.feature, Firefox and WebKit, 194 tests), fixed by #427 (O-37)
- [x] Group 3: sign-in race (test fault: `signOut` now waits for the sign-in page); WebKit shows a JPEG sent as attachment instead of saving it (app: `download` on the document links, `Button` prop with DOM test seen red)
- [x] code-reviewer round 1 (`docs/reviews/424-review-1.md`): no Blocker/Major; C-2 to C-5 fixed (C-2: `download` asserted in `documents.dom` and `tenant-detail-page.dom`, seen red); C-1 (long unbreakable words in names, exists on the base commit), C-6, C-7 stay in the report
- [x] First shard run (as CI on main): group 2 came back in Firefox (step 2's rows moved under the click when the billed text arrived after the invoice counts): `BuildingStep` shows both at once (DOM test seen red), `chooseBuilding` waits for its row; contract list search raced the next navigation (WebKit): `searchContracts`/`filterContracts` wait for the URL like the other lists
- [x] code-reviewer round 2 (`docs/reviews/424-review-2.md`): no Blocker/Major; C-8 (a failing answer hides not the other) pinned by a DOM test of kept behaviour, C-10 fixed; C-9 (latent hang if /invoices fails, no scenario does), C-11 stay in the report
- [x] Second shard run: only `statement-correction-detail` in Firefox (399 px, 2 of 3 runs, 6 of 10 alone with --repeat-each): the correction rows' statement number did not break beside the nowrap amount; `min-w-0 break-words` on that `dt` (`CostTable.svelte`), 30 of 30 in all browsers
- [x] code-reviewer round 3 (`docs/reviews/424-review-3.md`): no findings
- [x] Final shard run and axe run: E2E 2706 of 2707 in Chromium, Firefox and WebKit, axe 204 of 204; the one failure is O-34 (two scenarios share the IBAN, WebKit, in `offene-punkte.md`, not browser-specific)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-424.md`
- [x] Checks, reviews, archive, pull request
- Files: `tests/e2e/fixtures/backend.ts`, `tests/e2e/questions/language.ts`, `tests/e2e/CLAUDE.md`, `src/styles/globals.css`, `tests/e2e/tasks/authentication.ts`, `src/lib/ui/Button.svelte`, `src/__tests__/ui-button.dom.test.ts`, `src/routes/tenants/[id]/TenantDocumentRow.svelte`, `src/routes/documents/DocumentItem.svelte`, `src/routes/statements/generate/BuildingStep.svelte`, `src/__tests__/statement-wizard.dom.test.ts`, `tests/e2e/{targets,tasks}/statement-generate.ts`, `tests/e2e/tasks/contracts.ts`
## Session 2026-10-17: related issues together, decision issues implemented directly (G2, G1 of `docs/reviews/workflow-rules-review-2026-10-17.md`)

- [x] G2: related issues of one request go into one pull request with one `Fixes #n` each (`.claude/skills/pull-request/SKILL.md`, `CLAUDE.md` "Open work")
- [x] G1: a decision implemented in the same task closes the decision issue directly, no implementation issue (`.github/ISSUE_TEMPLATE/decision.md`, `CLAUDE.md` "Open work")
- [x] code-reviewer round 1: `docs/reviews/g2g1-review-1.md` (no Blocker/Major; C-1 to C-4 fixed: `entscheiden` removed once the decision is recorded, each issue's scenario named, markers removed on direct implementation, `Fixes #n` per issue)
- [x] session archived, pull request

Files: `CLAUDE.md`, `.claude/skills/pull-request/SKILL.md`, `.github/ISSUE_TEMPLATE/decision.md`, `docs/reviews/g2g1-review-1.md`

## Session W15c: Nebenkostenpauschale on the Mietvertrag (#429)

Branch `claude/w15c-pauschale-429`. Product owner 2026-10-17: field «Nebenkostenpauschale pro Monat», shown everywhere the Akonto is, counts in «Monatlich total», never billed, not on the PDF.

- [x] @wip scenarios: record in the wizard (review step, total), edit and contract page, apartment monthly costs, statement does not bill it (the statement scenario pins kept behaviour), warning, carry-over
- [x] fach-reviewer on scenarios, texts and glossary rows before implementing (`docs/reviews/429-fachreview-1.md`)
- [x] Migration 0025 `flat_rate_utility_charge` (not null, default 0), schema, routes, service, API contracts, `docs/data-model.md`
- [x] Form: field in `RentStep`, `contract-form`, `contract-wizard` (summary, total, carry-over, `flatRateNotice`), hint «Kein Akonto» points to it
- [x] Display: contract page (`ContractTerms`), apartment monthly costs (`MonthlyCostsCard`), every «Monatlich total» (`contract-history.monthlyTotal`, contract list)
- [x] Glossary rows «Nebenkostenpauschale», «Monatlich total» (product owner confirms the wording in the PR); i18n-begriffe already has the term (#66)
- [x] Axe and language state `flat-rate-warning` on `contract-new` and `contract-edit`
- [x] Slice review round 1 (`docs/reviews/429-review-1.md`)
- [x] Feature review: fach-reviewer round 2 (`docs/reviews/429-fachreview-2.md`), personas Helga and Dr. Weber (`docs/design/personas/helga-429.md`, `weber-429.md`), daten-pruefer round 1 (`docs/reviews/429-datenpruefung-1.md`)
- [x] Fixes from the feature review: the note «Keine Nebenkosten vereinbart» informs instead of warning when a Pauschale is entered (`AgreedCategories.svelte`, `agreed-categories.dom.test.ts`); reviewed wording of the hint «Kein Akonto», the warning title and en text; glossary row without the repeated sentence; `monthlyTotal` test (`tenant-detail.test.ts`)
- [x] Dr. Weber P-1 (warning with Akonto and Pauschale) contradicts the decision in #429: #432
- [x] Product owner confirms the glossary rows and the hint sentence in #429 (2026-10-18); #432 decided option 1 (warn in the mixed case too), its own task
- [x] Closing code-review rounds (`docs/reviews/429-review-2.md`, C-14 fixed with a scenario; `429-review-3.md`, no Blocker/Major)
- [x] Workflow notes (`docs/reviews/workflow-notes-issue-429.md`)
- [x] PR `Fixes #429`

Files: `backend/migrations/0025_contract_flat_rate.sql`, `backend/src/{db/schema.ts,routes/contracts.ts,services/contract.service.ts}`, `src/lib/{types,contract-form,contract-wizard}.ts`, `src/lib/server/{apartment,contract-history}.ts`, `src/lib/ui/Alert.svelte`, `src/routes/contracts/{+page.server.ts,AgreedCategories.svelte,[id]/+page.server.ts,[id]/ContractTerms.svelte,new/RentStep.svelte}`, `src/routes/apartments/[id]/MonthlyCostsCard.svelte`, `messages/*.json`, `UBIQUITOUS_LANGUAGE.md`, `tests/contracts/contract{,s}.json`, `tests/a11y/screens.json`, `tests/e2e/**`.

## Session G3: Glossary from the decisions of 2026-10-18

Branch `claude/brave-babbage-d7bnoa`. Product owner 2026-10-18: the open `entscheiden` issues were decided by adopting the fach-reviewer's unambiguous recommendations; «Führe das Glossar nach» updates the glossary from them.

- [x] `UBIQUITOUS_LANGUAGE.md`: rows from #402 (Leerstand, Verwaltungspauschale family, Abrechnungsdatum, Zahlung zurücksetzen, Abrechnungsnummer, Gebäude ohne Tank, Verbrauch, Bereits bezahlt, Saldo, Vereinbarte Nebenkosten, Nicht vereinbart, Umlagefähige Nebenkosten, Protokoll, Kosten/Nebenkosten des Gebäudes, VMWG, Vollservicevertrag), #407 (Vereinbart ab), #408 (Tage ohne Abrechnung, Kurze Abrechnungsperiode, Hinweis auf fehlende Abrechnungen, Abgerechnet bis, Mietstage, Geleistete Akontobeiträge, Nebenkostenabrechnung), #409 (Akontorechnung, Abgerechnet), #410 (Befristet / Unbefristet, Auszug bestätigt), #411 (Betreiber, Verantwortlicher, Auftragsbearbeiter, Mietzinsdepot, Freigabe, Protokoll des Servers, Ausweiskopie)
- [x] `docs/design/i18n-begriffe.md`: rows for the new terms as the app already words them; ❓ removed where #405 (1b, 1c) and #408 (point 3) kept the word; changed words (#405 1e, 2b; it «Costi dell’immobile») wait for their implementation
- [x] Markers of #140, #397, #398 removed (they waited only for the glossary); markers of #294, #334, #362, #370 now say the row exists and the help texts follow
- [x] Closing code-review round 1 (`docs/reviews/g3-glossary-review-1.md`: C-1 Major, C-2 to C-12 fixed or answered)
- [x] Re-review of the C-1 fix (`docs/reviews/g3-glossary-review-2.md`: no Blocker/Major; C-4 «Ersatzmieter» row added, its Italian word shared with «Nachmieter» goes to #405)
- [ ] PR `Fixes #140`, `Fixes #397`, `Fixes #398`, «No scenario: glossary and code comments only»

Files: `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `docs/reviews/g3-glossary-review-{1,2}.md`, comments in `src/lib/overview.ts`, `src/routes/config/{categories/CategoryReason,audit-log/+page}.svelte`, `src/routes/contracts/[id]/NextSteps.svelte`, `src/routes/tenants/[id]/TenantDocumentsCard.svelte`, `src/routes/statements/[id]/CostTable.svelte`, `backend/src/services/pdf.service.ts`, `tests/e2e/features/{settings,statement-generate,statement-detail}.feature`.

## Session L1: Building lists to 1000, O-38 (after #424)

Branch `ccr-240d3fd7-ogc0me`. A second session solved #424 in parallel; #438 solved it first (main CI #593 green with every browser), so this session's own fix was dropped. What #438 does not carry came along: the building lists of the BFF load 1000 instead of 100 (product owner 2026-10-19), the E2E cleanup leak as O-38, two workflow notes.

- [x] `invoices.test.ts` expects `buildings?limit=1000` (seen red), the eight loads ask for 1000
- [x] O-38 in `docs/design/offene-punkte.md`, two notes in `docs/reviews/workflow-notes-issue-424.md`
- [x] Closing code-review round
- [x] PR, «No scenario: a list limit no realistic data reaches; docs»

Files: `src/routes/{apartments,apartments/new,invoices,invoices/new,invoices/[id]/edit,contracts,statements,statements/generate}/+page.server.ts`, `src/__tests__/invoices.test.ts`, `docs/design/offene-punkte.md`, `docs/reviews/workflow-notes-issue-424.md`.

## Session L2: Tests of the building limit (C-1, C-3 of #440)

Branch `ccr-240d3fd7-ogc0me`. Product owner 2026-10-19: «Setze C1 und C3 um» (closing review of #440).

- [x] C-1: `building-lists-load.test.ts` checks `buildings?limit=1000` in all eight loads (seen red with the contracts load set back to 100); it replaces the invoice-only test in `invoices.test.ts`
- [x] C-3: the test name says the limit («bis zu 1000 Gebäude, nicht nur die ersten 20 des Backends»)
- [x] PR, «No scenario: tests only»

Files: `src/__tests__/building-lists-load.test.ts`, `src/__tests__/invoices.test.ts`.
## Session R1: «Found» names where you looked

Branch `ccr-9b88c9f2-p44e0b`. Review of the instructions against the Opus 5.5 guide (product owner 2026-10-19): point 2, «Found» also says where an unconfirmed point was looked for, as the «Nicht bestätigt» of `code-reviewer` and `fach-reviewer` already does.

- [x] `CLAUDE.md`, «When to ask», closing headings: «what could not be confirmed and where you looked»
- [x] Closing code-review round (`docs/reviews/r1-review-1.md`: no Blocker/Major; C-1 fixed, C-2 left as is: `issue-triage` defines its own «Found» for an unattended run)
- [x] PR, «No scenario: rule text only»

Files: `CLAUDE.md`, `docs/reviews/r1-review-1.md`.

## Session T1: Tokens and speed of the agent workflow (2026-10-19)

Branch `ccr-3dfff432-ljcit4`. Product owner: implement recommendations 1 to 5 of the token measurement (session W16: 95 % of the tokens are cache reads of the main session, whose context grew to 690k without a compaction). No scenario: tooling and rules only, no app behaviour.

- [x] 1. Autocompact at 30 % instead of 75 % (`.claude/settings.json`); a run ending above 200k tokens suggests `/compact` or a new session once (`CLAUDE.md`, Gotchas, «Context»)
- [x] 2. CI diagnosis: failing job only, its log tailed or grepped, at most one log subagent per round (skill `pull-request`)
- [x] 3. Targeted reads instead of whole files (`CLAUDE.md`, Gotchas)
- [x] 4. fallow gate prints the findings, not the whole JSON (`.claude/hooks/fallow-gate.sh`, test in `tools/claude-hooks/fallow-gate.test.ts`, red first)
- [x] 5. Faster local checks: `eslint --cache`, DOM tests in `vmThreads` (45 s -> 25 s; `fsModuleCache`, which Vitest's own hint names, is no option of Vitest 5), `vitest run --changed` named (`package.json`, `vitest.config.ts`, `CLAUDE.md`)
- [x] Workflow note: one session in the plan while another session's is open (`docs/reviews/workflow-notes-tokens.md`)
- [x] Slice review round 1 (`docs/reviews/tokens-review-1.md`, no Blocker/Major; C-1 to C-3 fixed)
- [x] Closing code-review round 2 (`docs/reviews/tokens-review-2.md`, no Blocker/Major; C-4 Nit kept: the block message was untested on the base too)
- [x] PR, «No scenario: tooling and rules only»

Files: `.claude/settings.json`, `.claude/hooks/fallow-gate.sh`, `.claude/skills/pull-request/SKILL.md`, `CLAUDE.md`, `.gitignore`, `package.json`, `vitest.config.ts`, `tools/claude-hooks/fallow-gate.test.ts`, `docs/reviews/tokens-review-{1,2}.md`, `docs/reviews/workflow-notes-tokens.md`.
## Session I1: open issues, one after another (2026-10-19)

Branch `ccr-6c5f45f8-br8wl9`. Product owner: work the open issues one by one, bugs first, one pull request each.

### #439 «Weiter» in step 3 while the agreements load

- [x] @wip scenario: «Weiter» after the check failed says why the wizard waits (`statement-agreed-costs.feature`)
- [x] DOM test: the same while the check loads (`agreed-costs.dom.test.ts`)
- [x] Message in `AgreedCosts.svelte`, text in all four languages; axe and language state `agreements-failed` clicks «Weiter» too
- [x] Slice review round 1 (`docs/reviews/439-review-1.md`)
- [x] Feature review: personas Helga and Sven (`docs/design/personas/{helga,sven}-439.md`)
- [x] Fix Sven P-1, P-3 and Helga P-1: the wizard goes on once the check is done; failed text names «Erneut versuchen»
- [x] Re-review: code-reviewer round 2 (`docs/reviews/439-review-2.md`; C-4 fixed with the scenario «Nach erneuter Prüfung geht der Assistent zur Vorschau»), Sven and Helga (`docs/design/personas/{sven,helga}-439-2.md`)
- [x] Closing code-review round (`docs/reviews/439-review-3.md`, no Blocker/Major)
- [ ] PR `Fixes #439`

### #432 Warning with Akonto and Nebenkostenpauschale

- [x] @wip scenario «Mit Akonto und Nebenkostenpauschale warnt das Formular vor angekreuzten Nebenkosten» (`contract-new.feature`)
- [x] fach-reviewer on the scenario and the proposed variant text before implementing (`docs/reviews/432-fachreview-1.md`)
- [x] Product owner confirms the variant text (decision of #432, 2026-10-19, recorded in the issue)
- [x] `flatRateNotice` warns with Akonto too (variant text), unit test; texts in all four languages; axe and language state `flat-rate-warning-advance` on `contract-new` and `contract-edit`
- [x] Slice review round 1 (`docs/reviews/432-review-1.md`, two Nits; C-1 fixed)
- [x] Feature review: personas Dr. Weber and Helga (`docs/design/personas/{weber,helga}-432.md`)
- [x] Helga 432 P-1 (Major, contradicted the decision): product owner 2026-10-19: with an Akonto the warning shows only while every box is ticked; unit test, scenario, a11y state ticks all first
- [x] Re-review: code-reviewer round 2 (`docs/reviews/432-review-2.md`), Helga (`docs/design/personas/helga-432-2.md`)
- [x] Issue for Helga 432 P-2 (Akonto without agreed Nebenkosten, existed before): #444
- [x] Closing code-review round (`docs/reviews/432-review-3.md`, no findings)
- [ ] PR `Fixes #432`

### #444 Akonto without agreed Nebenkosten

- [x] @wip scenario «Mit Akonto und ohne angekreuzte Nebenkosten warnt das Formular» (`contract-new.feature`)
- [x] fach-reviewer on the scenario and the proposed sentence before implementing (`docs/reviews/444-fachreview-1.md`); product owner confirmed the wording (recorded in #444)
- [x] `AgreedCategories.svelte`: caution tone and the Akonto variant text when an Akonto is entered; DOM test; texts in all four languages; axe and language state `agreed-costs-none-advance`
- [x] Slice review round 1 (`docs/reviews/444-review-1.md`, C-1 and C-3 fixed), feature review (persona Helga, `docs/design/personas/helga-444.md`, no Blocker/Major)
- [x] Closing code-review round (`docs/reviews/444-review-2.md`, no Blocker/Major)
- [ ] PR `Fixes #444`

### #130 Invoice check after a change of billing rhythm (divisor rule of #409 point 1)

- [x] @wip scenario «Kein Hinweis, wenn der Rechnungssteller von monatlich auf vierteljährlich wechselt» (`statement-generate.feature`); unit tests (two red, three pin kept behaviour)
- [x] fach-reviewer on the scenario before implementing (`docs/reviews/130-fachreview-1.md`, no Blocker/Major; V-1 to V-4 tests added)
- [x] Divisor rule in `missingParts` (`invoice-completeness.service.ts`, `coarserRhythm`)
- [x] Marker `TODO(fachlich prüfen, #130)` in `CategoryCheck.svelte` removed (product owner 2026-10-19: settled by #409)
- [x] Slice review round 1 (`docs/reviews/130-review-1.md`, three Nits; C-1, C-3 fixed)
- [x] Feature review: persona Dr. Weber (`docs/design/personas/weber-130.md`, one Nit), data prepared by SQL in `dwello_persona`
- [x] Closing code-review round (`docs/reviews/130-review-2.md`; C-4: the #405 review moved out of this branch)
- [ ] PR `Fixes #130`

### #457 Objection help after a fixed-term end (closes #308)

- [x] @wip scenario «Der Hinweis nach dem Vertragsende nennt die stillschweigende Fortsetzung» (`contract-detail.feature`), DOM test; both red
- [x] fach-reviewer on the fr/it/en drafts before the text turns green (`docs/reviews/457-fachreview-1.md`, recommended wording taken)
- [x] `contracts_fixed_term_objection` with the second sentence in four languages; markers `#308` removed
- [x] Slice review round 1 (`docs/reviews/457-review-1.md`, one Nit, fixed)
- [x] Feature review: persona Dr. Weber (`docs/design/personas/weber-457.md`, two Minors on the decided text, one Nit)
- [x] Closing code-review round (`docs/reviews/457-review-2.md`, no findings)
- [x] PR `Fixes #457`, `Fixes #308` (#462, merged)

### #338 «Neu berechnen» on a single draft

- [x] @wip scenario «Entwurf neu berechnen» (`statement-detail.feature`), seen red at the missing button
- [x] `statement-recalculation.pg.test.ts` (same number, new amounts, no changed invoices after; sent refused), red first
- [x] Backend: `recalculateStatement`, `POST /statements/:id/recalculation`; `generateStatement` shares `calculatedRows`
- [x] Frontend: «Neu berechnen» in «Weitere Aktionen» of a draft, confirmation dialog `statement-recalculate-confirm`; texts that said «delete and create again» point to «Neu berechnen» (statement, wizard, invoice, Tankbestand, Heizprofil texts), four languages; DOM tests and scenarios updated red first; axe and language state `recalculate-dialog`
- [x] Slice review round 1 (`docs/reviews/338-review-1.md`: C-1 Blocker, C-2 to C-4 Major) and persona Helga (`docs/design/personas/helga-338.md`: P-1, P-2 Major)
- [x] Fixes: a berichtigte Abrechnung keeps `replaces` and `priorPayments` (C-1); own codes `STATEMENT_NOT_RECALCULABLE`, `STATEMENT_RECALCULATION_AGREEMENTS_OPEN` with texts (C-2, C-3); paid refused tested (C-4); kept fields tested (C-9); confirmation dialog naming what stays and changes, success toast at the top (P-1, P-2, C-6); it «Ricalcolare» (C-7); API spec and PRD (C-10); nits C-11, C-12
- [x] Re-review round 2 (`docs/reviews/338-review-2.md`: no Blocker/Major; C-14 saldo of a recalculated berichtigte Abrechnung pinned, C-15 duplicate step removed; C-16 to C-18 kept)
- [x] daten-pruefer on the recalculated draft (`docs/reviews/338-datenpruefung-1.md`: every amount to the Rappen, no findings; preview endpoint and PDF not checked)
- [x] Helga round 2 (`docs/design/personas/helga-338-2.md`: P-1, P-2 of round 1 fixed; new P-1, P-2 Minor on the toast, P-3, P-4 Nit, kept); closing code-review round 3 after merging `main` (`docs/reviews/338-review-3.md`, no findings); lint, check, type-check, affected vitest (760) and pg tests, E2E Chromium statement rows (157 passed)
- [x] PR `Fixes #338` (#467, merged)

### Main CI red since #440: E2E leftovers (O-38)

Branch `ccr-01e823d6-yhj5kc`. Runs 595 to 606 on `main` failed in the Firefox and WebKit shards (PRs run Chromium only): the statement wizard's buildings step (two backend requests per building, all buildings up to 1000 since #440) and step 3's agreement check took longer than 5 s, because every scenario with a sent statement left its building, apartment and tenant in `dwello_e2e`. Reproduced in Chromium with 600 leftover buildings (all three «Schon abgerechnet» scenarios fail as on CI). No scenario: test infrastructure only.

- [x] `backend/scripts/e2e-purge-statements.ts`: deletes a scenario's statements and their documents in the E2E database only; `tests/e2e/fixtures/backend.ts` calls it in `cleanUp` (statement-detail.feature left 23 buildings, apartments and tenants before, none after)
- [x] O-38 moved to `docs/archive/offene-punkte-verlauf.md`
- [x] Full Chromium + API run: 1153 passed, 1 failed (O-34, the known IBAN race of `settings.feature`); no tenant or statement left, but 256 buildings «Talblick»: the screen examples seed «Talblick» twice and the second name replaced the first one's token, so the cleanup now keeps every token it handed out
- [x] Slice review round 1 (`docs/reviews/o38-review-1.md`; C-1 fixed: the purge always gets the E2E database's URL, never `backend/.env`'s; C-3 not taken: the extra branch pushed `cleanUp` over fallow's complexity limit, and a scenario without names is rare)
- [x] `previewOf` (axe and language rows of `statement-generate`) waits for step 2's texts before ticking a building, as `chooseBuilding` does (#424; «preview-all-billed» once failed locally with «Clicking the checkbox did not change its state»); the statement-generate rows of both features: 38 passed, nothing left in `dwello_e2e`
- [x] Re-review and closing round 2 (`docs/reviews/o38-review-2.md`, no Blocker/Major; C-5 Nit kept); after the purge refactor statement-detail and statement-generate (Chromium + API): 156 passed, nothing left
- [x] PR #463 (merged); run 612 on `main`: the statement wizard failures are gone, one new failure in Firefox: «contract-new overlap-warning» stayed on step «Wohnung» (screenshot): the open-contract notice, shown once the apartment's contracts are loaded, moved «Weiter» under the second click (#424 kind; the same double click in `goToRentWith` explains WebKit's `start-date-input` timeout of run 600)
- [x] `keepApartment` (`tests/e2e/tasks/contract-form.ts`) waits for the apartment choice before «Weiter»; used by `goToRentWith` and the axe and language states `overlap-warning`, `rent-taken-over`; Chromium: those rows 13 passed, `contract-new.feature` (Chromium + API) 33 passed
- [x] Slice review round 1 (`docs/reviews/612-review-1.md`; C-1: `toRentStep`, used by four `contract-new` rows, clicked twice too, now `keepApartment`; C-2 comment fixed)
- [x] Re-review and closing round 2 (`docs/reviews/612-review-2.md`, no findings)
- [x] PR #466 (merged); run 614 on `main` failed once more: #468

### #51 Sign-in only for configured e-mail addresses (O-1)

- [x] @wip scenario «Sitzung eines Kontos ohne Zugang» (`authentication.feature`), red at the missing refusal
- [x] `isAllowed` (`ALLOWED_EMAILS`: list ignoring spaces and case, verified Google only, Microsoft refused, `*` or unset allows every account); unit tests red first
- [x] Callback refuses with `/login?error=not_allowed`, `login_error_not_allowed` in four languages; `hooks.server.ts` and `/auth/refresh` treat a session not allowed as signed out (`tests/unit/auth-routes.test.ts`)
- [x] `init` hook: production without `ALLOWED_EMAILS` refuses to start (unit test)
- [x] E2E stack and `persona-stack.sh` set `ALLOWED_EMAILS=verwalter@example.com`; demo `ALLOWED_EMAILS=*`; `.env.example`, `docker-compose.prod.yml`, README (also `JWT_SECRET` ends all sessions)
- [x] a11y and language state `login-not-allowed`
- Files: `src/lib/server/allowed-emails.ts` (new), `src/hooks.server.ts`, `src/routes/auth/callback/+server.ts`, `src/routes/auth/refresh/+server.ts`, `src/lib/server/oauth.ts` (`emailVerified`), `src/lib/server/login-flow.ts`, `messages/*.json`, tests (`tests/unit/allowed-emails.test.ts`, `auth-routes.test.ts`, `oauth.test.ts`, `src/__tests__/hooks.server.test.ts`), E2E (`authentication.feature`, session fixture, a11y rows), `playwright.config.ts`, `persona-stack.sh`, `docker-compose.prod.yml`, `.env.example`, `deploy/demo/`, README
- [x] Slice review round 1 (`docs/reviews/51-review-1.md`: no Blocker/Major; C-1 missing `verified_email` counts as unverified, C-2 `/auth/me` refuses, C-3 README restricted and O-39 in `offene-punkte.md`, C-5 fixed; C-4, C-6 Nits kept) and persona Helga (`docs/design/personas/helga-51.md`: P-1 Major)
- [x] Helga P-1: Google lets the visitor choose the account (`prompt=select_account`, not `consent`), scenario «Bei Google das Konto wählen» seen red first; P-2, P-3 Minor kept
- [x] Re-review: code-reviewer round 2, also closing (`docs/reviews/51-review-2.md`, no findings); Helga round 2 (`docs/design/personas/helga-51-2.md`: P-1 fixed, P-2 and P-3 Minor kept); lint, check, vitest 201, E2E Chromium auth, login and demo rows 34 passed
- [x] PR `Fixes #51` (#469, merged)

### #456 Link from a building to its invoices

- [x] @wip scenario «Rechnungen eines Gebäudes öffnen» (`building-detail.feature`), red at the missing link
- [x] DOM test of the building detail page for `building-invoices-button` (link `/invoices?building=<id>`), red first
- [x] Secondary button «Rechnungen ansehen» in the page header (the primary action stays «Wohnung hinzufügen»), the text of the overview's same link (`dashboard_invoices`, review C-1); files: `src/routes/buildings/[id]/+page.svelte`, `messages/*.json`, `buildings-pages.dom.test.ts`, `building-detail.feature` and its steps, task and target
- [x] Slice review round 1 (`docs/reviews/456-review-1.md`: no Blocker/Major; C-1 reuse `dashboard_invoices`, C-2, C-3 import order, fixed); persona Helga (`docs/design/personas/helga-456.md`: task done, no Blocker/Major; P-1 no link back from the filtered list, P-2 filter shown only in the select (existed before), P-3 Nit; kept)
- [x] Closing review round 2 (`docs/reviews/456-review-2.md`: C-1 to C-3 done, C-4 Nit in this plan fixed); E2E Chromium building-detail scenarios plus axe and language rows: 17 passed
- [x] PR `Fixes #456` (#472, merged)

### #468 «Weiter» waits while a step loads

Branch `ccr-01e823d6-yhj5kc`. Run 614 on `main` failed once more in Firefox (statement-generate «generation-result»: «Weiter» on step 2 clicked while the buildings' texts loaded). Product owner: lock «Weiter» while a step loads instead of more waits in the tests. No scenario: the loading state lasts only as long as a request; the E2E stack cannot hold one open.

- [x] DOM: contract wizard step «Wohnung»: «Weiter» locked («Bitte warten …») until the apartments' contracts are loaded (`WizardNav` `loading`)
- [x] DOM: statement wizard step «Gebäude»: locked until invoice counts and billed contracts are loaded; «Zurück» while loading leaves step 1 free (red first: a real bug of the first version)
- [x] DOM: statement wizard step 3: locked while the agreed Nebenkosten are checked and the contracts without a Verwaltungspauschale load (`FeeNotAgreed` moves «Weiter» too); after a failed check as before (#439)
- [x] E2E tasks: `tickBuilding` waits for step «Gebäude» before ticking (four places in `accessibility.ts`, two did not wait: run 614); `keepApartment` (#466) removed, as «Weiter» now waits itself and Playwright clicks only an enabled button
- [x] Affected E2E (Chromium + API): statement-generate, statement-agreed-costs, statement-management-fee, contract-new, statement-minimum-balance, statement-rounding 164 passed; axe and language rows of statement-generate and contract-new 64 passed
- [x] Slice review round 1 (`docs/reviews/468-review-1.md`): C-1 (Major, an answer of a step left before unlocked the step opened anew) fixed with a test seen red; C-2 a failed load lifts the lock, pinned (kept behaviour, green at once); C-6 fixed
- [x] Re-review round 2 (`docs/reviews/468-review-2.md`, no Blocker/Major); C-9 (the C-1 fix of `FeeNotAgreed` had no test): test added, red with the fix taken out
- [x] Feature review: personas Sven and Marco (`docs/design/personas/{sven,marco}-468.md`, locked state reached by delaying the requests); Sven no Blocker/Major; Marco P-1 Major: the notice that arrives as «Weiter» unlocks pushes the button down, a tap lands on its link; it existed before the change: product owner 2026-10-19: merge #468, layout in #470 (`entscheiden`)
- [x] Closing code-review round 3 (`docs/reviews/468-review-3.md`, no findings)
- [x] PR `Fixes #468` (#471, merged)

### #435 Export a tenant's data (Art. 28 DSG)

Decided in #435 and the domain review (`docs/reviews/435-fachreview-1.md`): one ZIP, named and foldered in the tenant's language (`Daten-…`, `daten.json`, `dokumente/`, `abrechnungen/`); `daten.json` with English keys, no internal ids, no Base64; drafts only as data; each statement's PDF as the tenant received it (e-mailed copy, else the stored PDF, else none, never made by the export); uploads and reminder letters as files; no Protokoll entry; no glossary row.

- [x] @wip scenario «Daten eines Mieters exportieren» (`tenants.feature`), committed; fach-reviewer before the implementation
- [x] Steps and tests red (no production code, no texts) until the review reports
- [x] fach-reviewer round 1 (`docs/reviews/435-fachreview-1.md`: F-1 to F-4 Major, F-5 to F-14 Minor/Nit, no Blocker); product owner on F-12 (2026-10-19, recorded in #435): reminder letters and e-mailed statement copies go in as files; no glossary row for «Daten exportieren»
- [x] Scenario after the review: IBAN, reminder, another tenant (F-1, F-2, F-9); seen red at the missing button, then at the missing PDF of a sent statement whose deadline the seed changed (the export makes none, F-4)
- [x] `tenant-export.pg.test.ts` (6 tests, each red first or shown red without its code): data and files; no Vormieter data; a draft without PDF and no change to the statements; e-mailed copy first, reminders as data and files; safe, unique file names with their extension; folders in the tenant's language
- [x] Backend `exportTenant` (`tenant-export.service.ts`), `GET /tenants/:id/export`; BFF `src/routes/tenants/[id]/export/+server.ts` (ZIP with fflate, `filename*`), contract `tests/contracts/tenant-export.json` with `api-contracts.pg.test.ts`; `TenantExportCard` (secondary button, help text of F-3) with DOM test; texts in four languages from the review; API spec
- [x] Reviews: fach-reviewer round 2 (`docs/reviews/435-fachreview-2.md`: F-1 to F-14 fixed; F-15 to F-19 Minor, F-20 to F-25 Nit), code review round 1 (`docs/reviews/435-review-1.md`: C-1 Major = F-17), persona Dr. Weber (`docs/design/personas/weber-435.md`: P-1 Major)
- [x] Fixes: dates by the Swiss day (F-17, C-1); a draft without statement date and payment deadline (P-1); contract PDF if stored (F-18, C-3); backend 404 and «overdue» tests (C-10, C-6); files stored uncompressed (C-9), no buffer copy (C-12); API spec under Tenants (F-19, C-2); en «themselves» (F-22); README line in German (C-13); plan (F-21). Kept: F-15, F-16, P-2, P-4 (category names in the tenant's language, more position fields like the PDF), C-5 (invoice lines per position: the domain review asks for them), C-7, C-8, C-14, P-3, P-5, P-6, F-20, F-23 to F-25; C-11 rejected (lint forbids computed access in questions)
- [x] Re-review: code-reviewer round 2, also closing (`docs/reviews/435-review-2.md`: no Blocker/Major; C-16 API spec and C-9 row O-40 fixed; C-15, C-17 kept); Dr. Weber round 2 (`docs/design/personas/weber-435-2.md`: P-1 fixed; P-2 to P-7 Minor/Nit kept)
- [x] Workflow review: note `docs/reviews/workflow-notes-session-i1.md`, collected review `docs/reviews/workflow-rules-review-2026-10-19.md` (end of the request: the product owner said to stop after #435)
- [x] PR `Fixes #435` (the pull request that archives this session)

## Session T2: code-reviewer reports no Nits (2026-10-19)

Branch `ccr-3dfff432-ljcit4`. Product owner: after the review against «Getting the most out of Opus 5.5» («List only problems you'd block the merge for»), `code-reviewer` reports Blockers, Majors and Minors that are real defects, no Nits. No scenario: agent instructions only.

- [x] `.claude/agents/code-reviewer.md`: severities Blocker / Major / Minor, Minor defined as a real defect, Nits left out; ponytail findings are Minors
- [x] Slice review round 1 (`docs/reviews/nits-review-1.md`, no Blocker/Major; C-1 fixed: ponytail findings only as defects)
- [x] PR, «No scenario: agent instructions only»

Files: `.claude/agents/code-reviewer.md`, `docs/reviews/nits-review-1.md`.

## Session W9a: one list section for the list pages (2026-10-19)

Branch `w9-issue-455-resultlist`. Product owner (via coordinator), for #455: the fallow clone group dup:4489c5c6 (count heading, list, Pagination of the list pages) blocked a change to `src/routes/invoices/+page.svelte`; it moves into one component, with no change in behaviour. No scenario: refactoring without behaviour change.

- [x] `src/lib/ui/ResultList.svelte`, used by the lists of buildings, apartments, contracts, invoices, statements and tenants; each keeps its list class; `docs/design/token-referenz.md` (Lists)
- [x] Slice review round 1 (`docs/reviews/resultlist-review-1.md`, no Blocker/Major; C-1 token reference and C-2 apartment list fixed); closing round 2 (`docs/reviews/resultlist-review-2.md`, no findings)
- [x] CI: «Mietvertrag ohne vereinbarte Verwaltungspauschale öffnen» red once in Firefox; cause: the task clicked the link and did not wait for the navigation, the next step's 5 s expectation ran out while the contract page loaded (reproduced with its data 6 s late); the task and `openContractWithNotAgreedCosts` now wait for the contract's address
- [x] Closing round 3 (`docs/reviews/resultlist-review-3.md`: no Blocker/Major; C-1 the second task fixed)
- [x] PR `Refs #455`

Files: `src/lib/ui/ResultList.svelte`, `tests/e2e/tasks/statement-generate.ts`, `src/routes/{buildings,apartments,contracts,invoices,statements,tenants}/+page.svelte`, `docs/design/token-referenz.md`, `docs/reviews/resultlist-review-{1,2,3}.md`.
## Session C1: E2E in every browser on pull requests

Branch `ccr-01e823d6-yhj5kc`. Product owner 2026-10-19: instead of a merge queue (only for repositories of an organisation), pull requests run the E2E tests in every browser, so a race only Firefox or WebKit loses shows before the merge (runs 595 to 614 on `main`). No scenario: CI only.

- [x] `ci.yml`: E2E on pull requests with Chromium, Firefox, WebKit and `api` (60 min, as `main`); the axe check stays Chromium; `docs/test-pyramid.md`, `tests/e2e/CLAUDE.md`
- [x] Slice review (`docs/reviews/ci-browsers-review-1.md`): C-1 `docs/tech-stack.md` fixed; C-2 (the axe shards get 60 min on pull requests too) kept, harmless
- [x] PR (#473, merged): the first pull request with every browser shows the time it takes; its first run found a Firefox failure in «Suche ohne Treffer», cause not found (O-41)
## Session I2: open issues, one after another, continued (2026-10-19)

Branch `ccr-6c5f45f8-br8wl9`. Product owner: «Weiter mit issues» after Session I1. No open bug; #470 waits for a decision.

### #464 Akonto with a validity date and PDF line months × amount

Design: a table of Akonto amounts per Mietvertrag with the day from which each applies (migration: one row per contract from its Vertragsbeginn with today's amount; sent statements keep their stored totals); the statement sums each amount over the months (split months by days, as today) it applied; a berichtigte Abrechnung recalculates and so uses the amounts of its period; the contract keeps `monthlyAdvancePayment` as the amount that applies today. Coordinate with #453 (Akonto row «ab {Datum}»).

- [x] @wip scenarios (contract-edit, statement-generate, statement-detail), committed; fach-reviewer before the implementation (domain rule, amounts, PDF)
- [x] Steps and tests red until the review reports
- [x] fach-reviewer round 1 (`docs/reviews/464-fachreview-1.md`: F-1 to F-6 Major, F-7 to F-14 Minor, F-15 Nit); product owner 2026-10-19 (recorded in #464): F-4 option A (warning at the correction), «Gültig ab» only the first of a month within the contract, refusal when a stored statement's Akonto would change, the same day replaces and later entries can be deleted; glossary issue #477 (F-11, marker on «Gültig ab»)
- [x] Scenarios after the review: correction with a change inside 2024 (F-8), PDF lines with closed ranges and «Monate», total and the note (F-6, F-7, F-9), refusal (F-3), warning (F-4); all seven seen red at the missing behaviour
- [x] Migration and schema; calculation over several amounts; contract API and form (amount with «gültig ab»); contract page lists the amounts; PDF lines; help texts in four languages (backend 7ff3c3db; frontend: `contract-form.ts`, `RentStep.svelte`, `ContractForm.svelte`, `ContractTerms.svelte`, contract page action `deleteAdvance`, `Correction.svelte`, `CostTable.svelte`, `messages/*.json`, `docs/data-model.md`, `docs/api-specification.md`)
- [x] Delete a later Akonto (product owner on F-13): scenario «Ein späteres Akonto löschen», seen red; axe and language state `advance-delete-dialog`; the berichtigte Abrechnung of the axe check warns (Carla 2024)
- [x] The first amount keeps its day when the Vertragsbeginn moves (pg test seen red); refusals before the start and after the end name the day
- [x] All eight scenarios green without `@wip`
- [x] Fallow: the action `end` uses `endOnFormDay`, `endDeletingDraft` keeps its order (review C-3); the Akonto rows and «Gültig ab» are components of their own (`AdvancePeriods.svelte`, `AdvanceFrom.svelte`)
- [x] Slice review round 1 (`docs/reviews/464-review-1.md`), fach-reviewer round 2 (`docs/reviews/464-fachreview-2.md`), personas Helga and Dr. Weber (`docs/design/personas/helga-464.md`, `weber-464.md`: both stopped at saving, demo contracts had no Akonto rows; fixed in 8fd1c700)
- [x] Fixes: refusal compares with the stored total too; first amount moves with the Vertragsbeginn, start or end beyond a later Akonto refused; own codes for a refused delete; «Gültig ab» proposes the next first in a running contract, an unchanged Akonto is not sent, an empty «Gültig ab» is refused; the rules of an increase only in a running contract; texts V-4, V-7 to V-9; scenario «Ein Akonto, das eine Abrechnung zählt, lässt sich nicht löschen» and axe states `advance-delete-refused`, `advance-refused`
- [x] Re-reviews: code-reviewer round 2 (`docs/reviews/464-review-2.md`), fach-reviewer round 3 (`docs/reviews/464-fachreview-3.md`), personas again (`docs/design/personas/helga-464-2.md`, `weber-464-2.md`)
- [x] Fixes: V-12 (the new Vertragsbeginn as «Gültig ab» corrects the first amount), V-14, V-15; C-10/C-11 («Beenden» shows a refusal with its message, scenario «Mietvertrag vor einem späteren Akonto beenden», states `end-dialog-advance-refused`, `advance-from-missing`); C-12 (codes as literals), C-13 (contracts for the delete and end refusals, API spec); Helga P-1 (the form lists the amounts), P-2 and Weber P-1 (the refusal says when to correct and names the earliest day), P-3 (example a first of a month), P-4 (toast after deleting)
- [x] daten-pruefer (`docs/reviews/464-datenpruefung-1.md`: no finding above Nit)
- [x] Closing code-review round 1 (`docs/reviews/464-review-3.md`): C-14 (toast after deleting, DOM test with reactive props seen red), C-15 (scenarios «Das Formular nennt die eingetragenen Akonto-Beträge», «Vertragsbeginn und erstes Akonto zusammen korrigieren», toast step in «Ein späteres Akonto löschen», two seen red), C-12 (codes written out), C-17 (subject of d486f1e2 reworded before the push)
- [x] Closing code-review round 2 (`docs/reviews/464-review-4.md`): no finding open above Minor
- [x] #477 part (product owner 2026-10-19, recorded in #477): the line «Geleistete Akontobeiträge» becomes «Akontobeiträge» in the app, the PDF and the help texts, in this pull request; @wip scenario seen red, then folded into «Das PDF nennt das Akonto als Monate mal Betrag» (fach review 477-1 V-5); fach-reviewer round 1 (`docs/reviews/477-fachreview-1.md`): V-2 to V-8 fixed, V-1 (glossary row) is the product owner's edit; render test per language and DOM test seen red
- [x] Code-review of the #477 part (`docs/reviews/464-review-5.md`: no finding)
- [x] Re-sign the commits `git filter-branch` left unsigned (now aa2e0360, 3fa73919, bcb86319)
- [x] PR `Fixes #464`, `Refs #477`: pushed after this archive; merged once the product owner changed the glossary row (fach review 477-1 V-1)
- [x] Slice review, persona, daten-pruefer, closing review; PR `Fixes #464` (items below)
- [x] Workflow note: Session C1 of another branch is on `main` unfinished, so `open-work.test.ts` counted two sessions; moved below this one as a section, as in Session I1 (`docs/reviews/workflow-notes-issue-464.md`; collected review `docs/reviews/workflow-rules-review-2026-10-19-2.md`)

## Session W5-450: QR-bill creditor (#450) and the IBAN help (#490) (2026-10-19)

Worker W5 of ten in parallel: the checklist ran in the pull request, the session goes straight here (coordinator rule; Session C1 of another branch stays in the plan).

- [x] @wip scenario «IBAN ohne Firmenadresse» and red lower-layer tests (config, statement PDF, reminder, QR country 9484/9485/9498/9499, BFF), committed; fach-reviewer round 1 before the implementation (`docs/reviews/450-fachreview-1.md`: V-1 Major, V-2 to V-11)
- [x] Implementation: IBAN only with name, postal code and town (field and backend `IBAN_COMPANY_ADDRESS_MISSING`); a PDF or reminder with a payment part refused (`CREDITOR_ADDRESS_MISSING`); invented creditor gone; creditor country from the postal code; V-1 (marking a reminder sent returns the code), V-2 to V-5, V-11
- [x] No scenario for the PDF refusal in `statement-detail.feature`: the settings are global for parallel scenarios and the state exists only in installations from before (comment in #450); contract `statement-pdf-creditor-refused.json`
- [x] Issues from the review: #490 (glossary, IBAN help; decided and implemented here), #491 (letter while the PDF is refused; decided, comes with #449), #503 (Verlauf «PDF erstellt» while refused)
- [x] code-reviewer round 1 (`docs/reviews/450-review-1.md`: C-1 Major, C-2) and round 2 (`450-review-2.md`: both fixed)
- [x] #490: help text in four languages and the glossary rows the product owner asked for; fach-reviewer round 2 (`docs/reviews/450-fachreview-2.md`: no Blocker/Major)
- [x] Personas Helga and Dr. Weber (`docs/design/personas/helga-450.md`, `weber-450.md`): Helga P-2, Dr. Weber P-1, P-2 fixed with tests seen red; observations: U-42, #503
- [x] Closing code-review round 3 (`docs/reviews/450-review-3.md`: C-1 Major, C-2, C-3): scenario step for the marked fields (seen red), marks end with any input, all three codes tested
- [x] O-34 closed: lock on the global settings (`tests/e2e/fixtures/settings-lock.ts`), seen red without it (3 of 8) and green with it (24 of 24)
- [x] Closing code-review round 4 (`docs/reviews/450-review-4.md`: no finding)
- [x] PR `Fixes #450`, `Fixes #490`
## Session W6-458: legal texts, split responsibility (2026-10-19)

Branch `w6-issue-458`, worker W6 of a coordinated run (the checklist was kept in the pull request; `implementation_plan.md` keeps another worker's open session, coordinator's rule). Issue #458, closes #330 and #333.

- [x] @wip scenarios in `privacy.feature`, `terms.feature`, `demo.feature`, `authentication.feature` (9251867b); all 11 seen red at the missing behaviour; 15 DOM and unit tests seen red
- [x] fach-reviewer round 1 (`docs/reviews/458-fachreview-1.md`): R-1 to R-3 decided by the product owner as proposed; R-4 to R-10, R-13 applied; R-6 with a test seen red
- [x] Implementation (0d847905): `src/lib/server/operator.ts` (`loadHosting`), `src/routes/privacy/+page.server.ts`, `src/routes/privacy/+page.svelte`, `src/routes/terms/+page.svelte`, `src/routes/login/+page.svelte`, `src/lib/utils/format.ts`, `messages/*.json`, `.env.example`, `docker-compose.prod.yml`, `README.md`; markers #330 and #333 removed
- [x] PO wording R-1 to R-3 (ab6bcc58), tests seen red; E2E countries «Liechtenstein», since the language check flags German country names
- [x] code-reviewer round 1 (`docs/reviews/458-review-1.md`: no finding)
- [x] Personas Helga and Dr. Weber (`docs/design/personas/helga-458.md`, `dr-weber-458.md`); Dr. Weber P-1 (deletion after retention) moved to #459
- [x] Anchors on the privacy sections, glossary note «in der Datenschutzerklärung geplant, #411» removed on the PO's order (8807e6ae)
- [x] fach-reviewer round 2 (`docs/reviews/458-fachreview-2.md`): links, when and how, export, Art. 9 DSG on /terms (b6006970), tests and a navigation scenario seen red
- [x] Closing code-reviewer rounds (`docs/reviews/458-review-2.md`, after the date fix R-12 and the merge with #479 `458-review-3.md`: no finding)
- [x] Affected E2E (chromium) green; PR `Fixes #458`, `Fixes #330`, `Fixes #333`
## Session W1: «Abgerechnet bis» lines, preview, wizard field, refusals (#453, #325, #480) (2026-10-19)

Branch `w1-issue-453`, worker W1 of a parallel run; the checklist lived in the pull request (one session per plan, another worker's open session in `implementation_plan.md`, coordinator's consent) and comes here at the end.

- [x] @wip scenarios in `statement-generate`, `statement-detail`, `contract-new`, `contract-edit.feature`, seen red at the missing behaviour (one passes on the base: no field for a future start)
- [x] fach-reviewer before implementing (`docs/reviews/453-fachreview-1.md`: V-1 Major fixed; V-3 became #480)
- [x] Backend refusals `BILLED_UNTIL_FUTURE`, `BILLED_UNTIL_BEFORE_START` (create, update, stored value kept), PDF tenancy line, Akonto line «Akontobeiträge ab» (#477), page 2 texts
- [x] Preview: days and Akonto per row, «Abgerechnet bis» line, skipped contracts with link, own text per building, total note
- [x] Wizard: field in «Vertragsdauer» for a start before today, warning points to it, check step row, refusals at the field in wizard and edit form
- [x] Messages in four languages, `glossary_days_text`; a11y states `billed-until-refused`, `preview-skipped`
- [x] #480 (decided, glossary edit ordered by the product owner): glossary row and help text
- [x] Reviews: code-reviewer rounds 1 to 3 (`docs/reviews/453-review-1..3.md`), personas Dr. Weber and Helga (`docs/design/personas/weber-453.md`, `helga-453.md`), daten-pruefer (`docs/reviews/453-datenpruefung-1.md`), native reads (`docs/reviews/453-native-fr/it/en.md`)
- [x] Found: #499 (dead end after «Abgerechnet bis» over a billed statement, decided option 1), #500 («Wohnung EG, EG»)
- [x] Merge of `origin/main` with #464, conflicts resolved
- [x] Workflow note: `docs/reviews/workflow-notes-issue-453.md`
- [x] PR `Fixes #453`, `Fixes #325`, `Fixes #480`

Files: `backend/src/services/{contract,pdf}.service.ts`, `backend/src/routes/contracts.ts`, `src/lib/{contract-form,contract-wizard,statement-wizard}.ts`, `src/lib/server/statement-generation.ts`, `src/routes/contracts/{ContractForm.svelte,new/ContractWizard.svelte,new/PeriodStep.svelte}`, `src/routes/statements/generate/` (`+page.server.ts`, `PreviewStep`, `PreviewSkipped`, `PreviewEmpty`), `messages/*.json`, `UBIQUITOUS_LANGUAGE.md`, tests and E2E files.
## Session W10: fr/it/en words of #405 (#461, with #501) (2026-10-19)

Branch `w10-issue-461`, worker W10 of a coordinated run (checklist also in the pull request; Session C1 of another branch stays in the plan, coordinator's rule).

- [x] `@wip` scenarios «Die Wohnungssuche übergeht das Wort für Wohnung in jeder Sprache» (`apartments.feature`) and «Eigener Verteilschlüssel mit französischem Namen» (`distribution-keys.feature`), seen red at the missing behaviour
- [x] fach-reviewer before implementing (`docs/reviews/461-fachreview-1.md`), Ersatzmieter review as `docs/reviews/405-fachreview-1.md`
- [x] 1a «répercutable», 1d «degré de confiance» / «grado di certezza», 1e «annullare la disdetta», 2b «frais d’administration» / «spese amministrative» (UI and PDF), Ersatzmieter it «inquilino sostitutivo»; guard tests in `src/__tests__/i18n.test.ts`
- [x] 3a migration `0027_master_data_names.sql` (renumbered twice after merges of `main`) with `migrations.pg.test.ts`; `PREDEFINED_DISTRIBUTION_KEYS` and `POST /distribution-keys/initialize` removed
- [x] 3b optional fr/it/en names on the forms of Verteilschlüssel and Heizprofil (`NameTranslations.svelte`, shared with the category form), API accepts `null`
- [x] 4 apartment search ignores «wohnung», «appartement», «appartamento», «apartment» (`word-search.test.ts`)
- [x] `docs/design/i18n-begriffe.md` without ❓ (Nebenkostenpauschale: product owner option A, 2026-10-19), new rows Umlagefähigkeit, Akonto verrechnen, Vordefiniert
- [x] 5 native reads fr/it/en (`docs/reviews/461-native-{fr,it,en}.md`) applied; FR-6 U+00A0, EN-4 «», IT-20 lowercase courtesy forms, EN-32 English floor ordinals (UI and PDF); `glossary_fee_text` left to #447 (W7)
- [x] Code review rounds 1–3 (`docs/reviews/461-review-{1,2,3}.md`), fach-reviewer round 2 (`461-fachreview-2.md`)
- [x] #501 (decided on the product owner's delegation): `contracts_notice_period_short` names the proposed Ersatzmieter (Art. 264 Abs. 1 OR)
- [x] Personas Helga and Dr. Weber (`docs/design/personas/helga-461.md`, `weber-461.md`), daten-pruefer (`docs/reviews/461-datenpruefung-1.md`, no finding); Weber P-2–P-5 as #511, Helga P-1 as U-41
- [x] Workflow note (`docs/reviews/workflow-notes-issue-461.md`)
- [x] Affected E2E features green; PR `Fixes #461`, `Fixes #501`
## Session B1: malformed id and statement gap (2026-10-19)

Branch `claude/fix-invalid-id-and-statement-gap`. Product owner: two bugs from the persona stack. (1) A detail page with an id that is no UUID (`/invoices/abc`, `/invoices/upload`, `/buildings/abc` …) answers 500 instead of 404. (2) The statement detail page shows an empty gap of about 150 px between «Status» and «Kostenaufstellung».

- [x] @wip scenario «Eine Seite mit ungültiger Kennung gibt es nicht» (`navigation.feature`, all 17 detail and edit pages), seen red at the 500 page ("Fehler beim Laden …")
- [x] Backend test `error-codes.pg.test.ts`: a path id that is no UUID answers 404 `NOT_FOUND` (11 paths), seen red (500, 422); fix: one global `onTransform` in `backend/src/app.ts` (root cause: the id reached PostgreSQL, which refused the cast); `backend_not_found` in four languages; API spec. Tests that used a malformed id to provoke a PDF failure now use a PDF language without texts (pins kept behaviour); `fuel-stock.pg.test.ts` expects 404 instead of 422
- [x] @wip scenario «Die Kostenaufstellung folgt im üblichen Abstand auf den Status» (`statement-detail.feature`, web question `Gap.between`), seen red at 128 px: three empty items in the page column (gap-8 each): the form of `Correction`'s `FormDialog` (now `hidden`) and the live regions of `ReminderFeedback` and `SendFeedback` (kept in the accessibility tree, `empty:-mt-8` cancels their gap while empty)
- [x] Slice review (code-reviewer) of both slices, persona review of the statement page (run by the calling session): `docs/reviews/b1-review-1.md` (no Blocker/Major; C-1 fixed in `statement-detail.steps.ts`, C-2 Minor not trivial, stays in the report), `docs/design/personas/marco-b1.md` and `sven-b1.md` (no Blocker/Major; their findings show on the base commit too and stay in the reports)
- [x] Merge of `origin/main` (conflicts in imports of `api-contracts.pg.test.ts` and `tests/e2e/questions/statement-detail.ts`, both sides kept); checks again green; closing code-reviewer round `docs/reviews/b1-review-2.md`
- [x] Workflow note: no subagents, and an unfinished earlier session in the plan (`docs/reviews/workflow-notes-invalid-id-and-statement-gap.md`)
- [x] Checks of «Before marking anything complete»: lint, check, backend type-check, backend `bun run test` (1002, coverage 93.6 %), frontend `test:coverage` (3143), E2E chromium of `navigation`, `statement-detail`, `statement-send`, `statement-reminder` (119) and the axe and language rows of the statement detail screens (44)
- [x] Workflow review (`docs/reviews/workflow-notes-invalid-id-and-statement-gap.md`); session to the archive; PR
- [x] CI red on the axe and language rows `error-server server-error` (all browsers; green on `main`): the screen reached its failed load through the malformed id `/buildings/kein-gebaeude`, now a 404. The state now opens «Zur Übersicht» from that 404 page while the dashboard's data request fails (`FailRequests`, `tests/e2e/tasks/accessibility.ts`); merge of `origin/main` without conflicts; closing review `docs/reviews/b1-review-3.md` (no Blocker/Major; C-1 rejected; the error page's «Internal Error» heading: #519)
## Session W7: glossary help texts of #402 (#447) (2026-10-19)

Branch `w7-issue-447`. Issue #447 (closes #286, #294, #362, #369, #370, #485). Worker W7 of the parallel run; the checklist was kept in the pull request (coordinator rule for `implementation_plan.md`).

- [x] Scenarios «Eigener Satz von 0 % wird abgelehnt» (`contract-new.feature`), «… beim Bearbeiten abgelehnt» (`contract-edit.feature`), help examples «Verwaltungspauschale», «Saldo» (`help.feature`), «Vor dem Berichtigen einer Kette nennt die Bestätigung, was insgesamt zurückerstattet ist» (`statement-detail.feature`); all seen red
- [x] Fach-review before implementing (`docs/reviews/447-fachreview-1.md`): V-1 to V-12 and M-1 fixed; V-7 became #485 (decided: rows in `i18n-begriffe.md`)
- [x] Own rate above 0: `src/lib/contract-form.ts`, `backend/src/routes/contracts.ts`, `contracts_error_fee_rate_zero`, `contracts_error_fee_rate`
- [x] «bis 3 %» with Art. 4 Abs. 3 VMWG; it «Costi dell’immobile»; `glossary_balance_text`, `audit_empty_text`, `statements_correct_refunded_chain`; markers removed
- [x] Slice review round 1 (`docs/reviews/447-review-1.md`): C-1 fixed with the chain scenario
- [x] Personas Helga and Dr. Weber (`docs/design/personas/helga-447.md`, `weber-447.md`): no Blocker/Major; Minors stay in the reports
- [x] Native readings of #461 on `glossary_fee_text` and `config_help_management_fee` (fr FR-7, it IT-17, IT-18, IT-20) applied
- [x] Closing review and PR

Files: `messages/{de,fr,it,en}.json`, `src/lib/contract-form.ts`, `src/routes/statements/[id]/Correction.svelte`, `backend/src/routes/contracts.ts`, `backend/src/services/pdf.service.ts`, marker files, `docs/design/i18n-begriffe.md`, `docs/nebenkostenabrechnung-anforderungen.md`, tests and scenarios above.
## Session G1: Gebäude mit allen Wohnungen aus dem Gebäuderegister (#479)

Branch `claude/nifty-tesla-gmus4a`. «Setze #479 um»: address search through the BFF against geo.admin.ch (GWR) instead of OpenPLZ; a preview of the register's Wohnungen; Gebäude and Wohnungen created in one transaction.

- [x] Scenarios in `building-new.feature` (17), `privacy.feature`; GWR stand-in `backend/scripts/gwr-stub.ts` (2529)
- [x] fach-reviewer round 1 (`docs/reviews/479-fachreview-1.md`), product owner answers in #479 (V-1, V-2, V-3, V-10); round 2 (`docs/reviews/479-fachreview-2.md`); glossary issue #488
- [x] Backend: `POST /buildings` with `apartments[]` in one transaction (`building.routes.pg.test.ts`; response unchanged, no contract change)
- [x] BFF: `/api/addresses`, `/api/addresses/[egid]`, `src/lib/server/building-register.ts`, `parseRegisterApartments` (unit tests)
- [x] UI: `AddressSearch.svelte`, `RegisterApartments.svelte`, `BuildingForm.svelte` (hints, preview); `Select` takes a `note`; OpenPLZ removed
- [x] Privacy statement, texts in four languages, docs (`tech-stack.md`, `PRD-Dwello.md`, `api-specification.md`, U-23 P-7/P-8)
- [x] a11y and language screens: `building-new` states `register-preview`, `register-submit-missing`, `register-no-apartments`, `register-no-hit`, `register-unreachable`
- [x] Code review round 1 (`docs/reviews/479-review-1.md`): C-1 contract `building-apartment-number-taken.json` and BFF test (kept behaviour), C-2 = V-15, C-3 proposals of a second address, C-5 coordinates removed; C-4 kept (no test for a failing `/api/addresses/<egid>`)
- [x] fach-reviewer round 3 (`docs/reviews/479-fachreview-3.md`): V-15 numbers checked (comma, > 0, half rooms), V-16 apartment form keeps values outside its choices, V-17, V-18 (`i18n-begriffe.md`), V-19
- [x] Persona round 1 (`docs/design/personas/{helga,marco,weber,sven,anna}-479.md`): the persona server could not reach geo.admin.ch (Node `fetch` ignores `HTTPS_PROXY`): `persona-stack.sh` starts with `NODE_USE_ENV_PROXY=1`, O-42; Sven P-1 hints announced (live region), P-3 clearing the search; P-2 existing before (O-43)
- [x] Persona round 2 (same reports, «Runde 2»): every task done; fixed: focus after a refused save behind the skip link (Sven P-2, made more visible by the Wohnungen; `focus-error.ts`, scenario), unit m² at «Fläche» (five personas), Wohnungen ordered by floor and number (Marco P-2, Weber P-12); rejected: saving an address already entered (Anna P-5, Helga P-9: decided in #479)
- [x] Workflow note `docs/reviews/workflow-notes-issue-479.md`
- [x] Closing review round 2 (`docs/reviews/479-review-2.md`): no Blocker/Major; C-4, C-6 to C-9 Minor, kept (C-9: the test «behält, was der Liegenschaftsverwalter selbst eingetragen hat» pins kept behaviour)
- [x] PR `Fixes #479` (the pull request that archives this session)

Files: `backend/scripts/gwr-stub.ts`, `backend/src/routes/{buildings,apartments}.ts`, `backend/src/services/building.service.ts`, `src/lib/server/{building-register,building-form}.ts`, `src/routes/api/addresses/`, `src/routes/buildings/{AddressSearch,BuildingForm,RegisterApartments,RegisterNotices}.svelte`, `src/lib/{apartment.ts,ui/Select.svelte,ui/focus-error.ts}`, `src/routes/privacy/+page.svelte`, `messages/*.json`, `tests/e2e/…`, `tests/contracts/building-apartment-number-taken.json`, docs.
## Session C1: E2E in every browser on pull requests

Branch `ccr-01e823d6-yhj5kc`. Product owner 2026-10-19: instead of a merge queue (only for repositories of an organisation), pull requests run the E2E tests in every browser, so a race only Firefox or WebKit loses shows before the merge (runs 595 to 614 on `main`). No scenario: CI only.

- [x] `ci.yml`: E2E on pull requests with Chromium, Firefox, WebKit and `api` (60 min, as `main`); the axe check stays Chromium; `docs/test-pyramid.md`, `tests/e2e/CLAUDE.md`
- [x] Slice review (`docs/reviews/ci-browsers-review-1.md`): C-1 `docs/tech-stack.md` fixed; C-2 (the axe shards get 60 min on pull requests too) kept, harmless
- [x] PR (#473, merged): the first pull request with every browser shows the time it takes; its first run found a Firefox failure in «Suche ohne Treffer», cause not found (O-41)

## Session C2: less CI per change, run 634 (2026-10-19)

Branch `ccr-3510fafb-cx2ywk`. Product owner 2026-10-19: proposals A, C, D and the cause of the red run 634 on `main`. Merge queues exist only for organisations (Session C1), so the pull request stays the full check. No scenario: CI only.

- [x] A: pushes to `main` run build, lint, unit tests and fallow only; the full run (every browser, axe) runs nightly and on `workflow_dispatch`; `main` has no branch protection yet (API 2026-10-19): the product owner turns it on with «Require branches to be up to date»
- [x] C: the axe check in 3 shards instead of 5
- [x] D: skill `pull-request`: reports, plan and archive are committed before the first push
- [x] Run 634: `gh api` answered HTTP 502 in the job "Accessibility (axe)" of `e2e-results`, and `fail-fast` cancelled "E2E tests"; retry and no fail-fast (simulated with a `gh` that answers 502 once: old step exit 1, new exit 0; always 502: exit 1)
- [x] `docs/test-pyramid.md`, `docs/tech-stack.md`; files: `.github/workflows/ci.yml`, `.claude/skills/pull-request/SKILL.md`
- [x] Slice review (`docs/reviews/c2-review-1.md`): C-1 (Minor, plan said fallow does not run on push) fixed
- [x] Workflow note (`docs/reviews/workflow-notes-ci-less-runs.md`)
- [x] PR: pushed after this archive

## Session G2: Glossar «Gebäuderegister» (#488)

Branch `claude/nifty-tesla-gmus4a` (anew from `main`). Product owner 2026-10-20: the proposal of #488 as it stands, entered by this session. No scenario: glossary only.

- [x] `UBIQUITOUS_LANGUAGE.md`: row «Gebäuderegister»; `docs/design/i18n-begriffe.md` without the issue note
- [x] PR `Fixes #488`

## Session W2-199: one Abrechnungsperiode per day and building (#199, #408, #486, #487)

Branch `w2-issue-199` (worker W2; reviewers started by the coordinator). Fixes #199 (decision #408 point 2, texts in https://github.com/rudini/Dwello/issues/408#issuecomment-6249569443), #408 (its last marker), #486 and #487 (product owner decisions 2026-10-19/20). The checklist was kept in the pull request description: ten parallel workers share `implementation_plan.md` (coordinator's rule).

- [x] Scenarios `@wip` in `statement-generate.feature` (refused overlap, way to the existing period, short period, «Alle Gebäude») and `contract-detail.feature` (short period, days in another contract's period); red at the missing behaviour (9 of 9). The `@api` scenario «Die kurze Abrechnungsperiode rechnet eine Rechnung nur in ihrer Periode ab» pins kept behaviour.
- [x] fach-reviewer round 1 (`docs/reviews/199-fachreview-1.md`): V-1 (product owner: a period equal to an existing one is allowed, also with overlapping old data), V-2 to V-7, V-9 (product owner's wording), V-10 fixed; M-1 → #486, V-8/V-11 → #487
- [x] BFF, step 2, backend `statements/generate` (`STATEMENT_PERIOD_OVERLAPS`) refuse a period that overlaps a statement period of the building and equals none; ways out: the existing period, short periods for ended days with Mietstage, vacancy sentence; `*.pg.test.ts` with the domain review's example (no distribution above 100 %)
- [x] Contract page: each part of the missing days with its way (existing period, short period), the contract's own days, no way when its own statement overlaps the period
- [x] Unreachable «partly billed» path removed (BFF, wizard, texts, tests); V-6 texts without «ganz oder teilweise»
- [x] Marker `TODO(fachlich prüfen, #408)` and the comments naming #199/#408 removed or repointed
- [x] Texts in de/fr/it/en; screen state `buildings-overlap` in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature` (axe and languages green)
- [x] code-reviewer rounds 1 to 3 (`docs/reviews/199-review-1.md` to `-3.md`): C-1 to C-12 fixed (C-8 by the coordinator's decision: a replaced statement without its berichtigte Abrechnung keeps its period)
- [x] Personas Helga and Dr. Weber (`docs/design/personas/helga-199.md`, `weber-199.md`): Weber P-1 = Helga P-3 → fach-reviewer round 2 (`docs/reviews/199-fachreview-2.md`, M-2) and the product owner's help text of #486 (2026-10-20); Weber P-2 = Helga P-1 (existed on `main`) → #512; P-5 fixed; P-3, P-4, P-6, Helga P-2, P-4 stay in the reports; V-3 → #521
- [x] daten-pruefer (`docs/reviews/199-datenpruefung-1.md`): no findings
- [x] #487: glossary rows entered as the product owner ordered
- [x] Merge of `origin/main` (conflict in `UBIQUITOUS_LANGUAGE.md` only); closing code-reviewer round (`docs/reviews/199-review-4.md`)
- [x] Workflow note: parallel workers share `implementation_plan.md`, the scratchpad, the E2E lock and the persona stack (`docs/reviews/workflow-notes-issue-199.md`)

Files: `src/lib/accounting-period.ts`, `src/lib/server/statement-generation.ts`, `src/lib/statement-wizard.ts`, `src/routes/statements/generate/{+page.server.ts,BuildingStep,BuildingChoice,OverlapWays,PreviewChecks,PreviewEmpty,StatementWizard}.svelte`, `src/routes/contracts/[id]/{+page.server.ts,MissingStatement.svelte}`, `backend/src/services/statement.service.ts`, `messages/*.json`, `UBIQUITOUS_LANGUAGE.md`, `docs/api-specification.md`, tests and E2E files.
## Session W9b: Akontorechnungen, «In Abrechnungen enthalten», upload bugs of #268 (2026-10-19 to 2026-10-20)

Branch `w9-issue-455`. Issue #455 (points 2 to 6 of #409) with the hint texts of #222 (#245), #481, #482, #483; product owner decisions via the coordinator during the task, recorded in #455 «Decided (product owner)» (V-1, V-2, «Manuell», Verteilschlüssel; option C after domain review 455-3; the delete text of 2026-10-20). The list section of the list pages moved out first (PR #494, session W9a).

- [x] `@wip` scenarios (invoices, invoice-detail, invoice-edit, invoice-new), red on the base build (11 at the missing behaviour; «Eine ausgewählte Akontorechnung erstellen» passes on the base, which reads an advance invoice as a plain invoice)
- [x] Domain review round 1 (`docs/reviews/455-fachreview-1.md`): V-1, V-2 decided by the product owner; V-3, V-6, V-8 became #481, #482, #483, decided; V-4, V-5, V-7, V-9, V-11 (en) fixed; V-10 kept
- [x] Prompt: document type `advance_invoice` (glossary words, an instalment invoice is none); `llm:eval` (qwen/qwen3-vl-8b-instruct via OpenRouter) 45/47 before and after
- [x] Upload: Akontorechnung not preselected, its hint, to-dos once ticked; deducted line with the proposed total (and without one), the rule as help after the to-dos; key of the building's newest invoice with a key in the Kategorie, unless the landlord chose one
- [x] Invoice page and «Rechnung bearbeiten»: hint at the Betrag (`DeductedHint`), not in the Beleg card; «In Abrechnungen enthalten» with number and status, linked (backend `statements`, contract, API spec); en «in a statement»; help on the Leistungszeitraum over several years
- [x] Bugs of #268, each with a test red first: own file button (`FileInput`), Escape in a select, empty paragraph under a date field, «Rechnungen hochladen» as a link to `?upload`; «Manuell kategorisiert» kept (product owner: not a bug)
- [x] Code review round 1 (`docs/reviews/455-review-1.md`): C-1, C-2, C-4 to C-7 fixed; C-3 kept (Escape in a closed select no longer closes a dialog)
- [x] Domain review round 2 (`docs/reviews/455-fachreview-2.md`): V-12, V-13, V-14, V-15 fixed; V-16 scenario added; V-4 kept (no extraction cases in `llm:eval`)
- [x] Personas round 1: Dr. Weber (`docs/design/personas/weber-455.md`, P-1 Major), Marco (`docs/design/personas/marco-455.md`, Minors kept)
- [x] Domain review round 3 (`docs/reviews/455-fachreview-3.md`): option C decided; texts, glossary rows «Akontorechnung», «Schlussrechnung», delete text; scenarios red on e3cb329e first
- [x] Code review round 2 (`docs/reviews/455-review-2.md`, no new findings); closing round 3 (`docs/reviews/455-review-3.md`: C-8 Major, a scenario step for the delete text; C-9) and re-check 4 (`docs/reviews/455-review-4.md`, clean); Dr. Weber round 2 (`docs/design/personas/weber-455-2.md`: P-1 to P-4 done, P-6/P-7 fixed by the delete text of 2026-10-20, P-5 kept)
- [x] PR `Fixes #455`, `Fixes #481`, `Fixes #482`, `Fixes #483`, `Refs #245`

Files: `backend/src/config/llm.ts`, `backend/src/services/statement-invoices.service.ts`, `backend/scripts/llm-stub.ts`, `src/lib/invoice-upload.ts`, `src/lib/server/invoice.ts`, `src/lib/types.ts`, `src/lib/ui/{FileInput,Dialog,DateInput,Button}.svelte`, `src/routes/invoices/` (`+page.svelte`, `DeductedHint`, `InvoiceDataFields`, `InvoiceUploadDialog`, `InvoiceUploadRow`, `UploadFiles`, `UploadRowNotes`, `[id]/{+page,InvoiceFacts,InvoiceBeleg}.svelte`, `[id]/edit/+page.svelte`), `messages/*.json`, `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `docs/api-specification.md`, `tests/contracts/{invoice-statements,invoice-list}.json`, tests and E2E layers.
