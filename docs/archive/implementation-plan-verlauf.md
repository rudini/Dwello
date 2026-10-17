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
