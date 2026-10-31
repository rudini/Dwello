## Session: #932 E2E purge after a berichtigte Abrechnung

- [x] Cause: `createCorrection` only clicked «Berichtigte Abrechnung erstellen»; the next step could pass on the replaced statement (same Akonto) and the clean-up deleted it while the new one was still saved (FK `replaces_id`, CI run 40708772660)
- [x] Fix: the task waits for the new statement or the refusal (`correctionAnswer`); `statement-detail.feature` and `statement-agreed-costs.feature` green (124, chromium)
- [x] No scenario: a fix of the test harness; the failing scenario covers it unchanged («Berichtigte Abrechnung rechnet mit dem damaligen Akonto»)
- [x] Slice review round 1 (closing): `docs/reviews/i932-review-1.md`, no findings
- [x] PR `Fixes #932`: pushed after this archive

## Session: Phase 2 leftovers (fitness values, #815 note)

- [x] `docs/architecture/fitness-functions.md`: column «Aktueller Wert» updated from `bun run fitness` and `ratchet.json` on e9950ebb (literal sets 8, entity mirrors 43, frontend findings 59, module cycles 0, technical 8)
- [x] Review point «Not checked» (#815, staged file in the import scan) checked: a staged probe file importing backend code is reported; moved to «Applied since the note»
- [x] No scenario: documentation only; no review round: no code changed
- [x] PR: pushed after this archive
- [x] CI fix: the frontend's health check asked `localhost`, which busybox wget took as ::1 on the runner while the app listens on 0.0.0.0; 127.0.0.1 in both compose files and the Dockerfile (seen in the CI health log, test red first) ; review `docs/reviews/578-review-3.md` (no findings)

## Session: workflow review proposals (tools)

- [x] Proposal 3: `tools/arch-baseline/run.sh` takes `ARCH_OUT` (checked by hand: a run into a temporary directory left `out/` unchanged)
- [x] Proposal 4: the literal-set measurement skips the keys of `Pick`/`Omit` (`lib.test.ts`, seen red); ratchet exception `billedUntil|endDate|startDate` removed with `--update`
- [x] Slice review round 1: `docs/reviews/wrr-tools-review-1.md`, Minor C-1 (generic first type argument) fixed with a test seen red
- [x] Closing round: `docs/reviews/wrr-tools-review-2.md`, C-1 closed; Minor C-2 (a union after a `Pick` with non-literal keys) fixed with a test seen red, no re-review (Workflow 7: Minor)
- [x] No scenario: tooling only
- [x] PR: pushed after this archive

## Session: workflow review proposals (rules)

- [x] Proposals 2, 5, 6 (ratchet only), 7, 8, 10, 11, 12, 13 of `workflow-rules-review-2026-10-28.md` in the skills, `CLAUDE.md`, `tests/e2e/CLAUDE.md`, the persona README and `code-reviewer`; 9 and 14 not applied
- [x] No scenario: rules only; no review round: no code changed
- [x] PR: pushed after this archive

## Session: collected workflow review (end of Phase 2)

- [x] `docs/reviews/workflow-rules-review-2026-10-28.md`: the 15 workflow notes since review 6, each point checked against `main` (0efe4eb1); 14 open proposals, 11 applied since
- [x] No scenario: documentation only; no review round: no code changed
- [x] PR: pushed after this archive



## Session: #916 and #917 pin R1 and S2 (Phase 2, from #723)

- [x] #916: an invoice without a category is saved while the KI is unreachable, without a KI category (`invoice-categorization.pg.test.ts`, pins kept behaviour; red with both catches of the KI call removed: 400)
- [x] #917: the session cookie is HttpOnly and SameSite, Secure with COOKIE_SECURE, which production sets (`session-cookie.test.ts`, pins kept behaviour; red with `httpOnly: false`)
- [x] Slice review round 1 (closing): `docs/reviews/i916-review-1.md`, no findings
- [x] No scenario: tests that pin kept behaviour
- [x] PR `Fixes #916`, `Fixes #917`: pushed after this archive

## Session: architecture process status, #860 decided (2026-10-28)

- [x] Read `docs/architecture/` and the open issues for what is still open
- [x] Issues for open points without one: #934 (P1 benchmark), #935 (weekly release tag), #936 (S1: 401 on every route)
- [x] #860 decided with the product owner (grill-me): definitions as proposed, Italian «copia di sicurezza», «die Person, die Dwello betreut» with a sentence for self-operated installations; label `needs-decision` removed
- [x] CI re-measured (Actions API, 28.10.2026): `main` median 13 min over 29 runs, PR median 10 min over 30 runs
- [x] `utility-tree.md`, `fitness-functions.md`: T1 and S1 «Heute», P1/U1/S1 issue references; matrix Ä1, Ä4 H/H → H/L and T1 H/H → H/M (decided by the product owner 28.10.2026)
- [x] No scenario: docs only, no app change
- [x] PR: pushed after this archive

## Session: #860 glossary rows for the backup (2026-10-28)

- [x] Rows Sicherung, Wiederherstellungscode, Notfallblatt, Wiederherstellung and the addition to «Betreiber» in `UBIQUITOUS_LANGUAGE.md`, translations in `docs/design/i18n-begriffe.md`, as decided in #860
- [x] Fach review round 1: `docs/reviews/860-fachreview-1.md` (V-1, V-2 Minor, fixed)
- [x] No scenario: glossary text only, no app change
- [x] PR `Fixes #860`: pushed after this archive

## Session: #718 part 1, the Sicherung in the backend (2026-10-28)

- [x] Product owner decided 2026-10-28 (in #718): split into three pull requests; spec change of `einrichtung.feature` for part 2
- [x] Unit tests `backup-crypto.test.ts` (code, encryption, wrong code, changed file), `backup-due.test.ts` (schedule); seen red
- [x] pg tests `backup.pg.test.ts` (Sicherung, Wiederherstellung with later migrations, retention, state, schedule tick, before a migration, `/health`), `migrations.pg.test.ts` (hook before a migration), `init-secrets.test.ts` (folder `backups`); seen red
- [x] Code: `backup-crypto.ts`, `backup.service.ts`, `0038_backups.sql`, `scripts/restore.ts`, `migrate.ts`, `/health`, `index.ts`; Docker: pg_dump 16, folder `backups`, service `restore`
- [x] R1 fitness: `tools/fitness/restore-check.ts` in `upgrade-check.sh`, red with a table left out
- [x] No scenario: the backend start, the schedule, the migration step and the restore command (CLI) cannot be reached from the E2E stack; the setup in the UI comes with part 2
- [x] Slice review round 1: `docs/reviews/718a-review-1.md` (C-1 to C-3 Major, C-4 to C-8 Minor, all fixed)
- [x] Re-review round 2: `docs/reviews/718a-review-2.md` (all closed, no new findings)
- [x] PR `Refs #718`: pushed after this archive

## Session: open functional issues, one pull request each (2026-10-28)

### #773 «Bitte ausfüllen» and «Gelesen» in «Rechnungen hochladen»
- [x] Scenarios: badge and status line in «Rechnungen hochladen, wenn keine KI gewählt ist»; changed status line in «Das Auslesen einer Datei scheitert» and «Dwello sagt, was nach dem Lesen zu tun ist …» (`Spec change approved: #773`); seen red
- [x] DOM tests: «Gelesen: …», badge «Bitte ausfüllen» for a file nobody read, no progress with «Keine KI»; seen red
- [x] Code: `stateOf` in `src/lib/invoice-upload.ts`, `InvoiceUploadRow.svelte`, `InvoiceUploadDialog.svelte`, `messages/*.json`
- [x] Slice review round 1: `docs/reviews/773-review-1.md`
- [x] Persona Helga: `docs/design/personas/helga-773.md` (run 1 with a reading KI stand-in did not reach the state, not kept)
- [x] Helga P-1 (Major, «Gelesen: 1 von 1» next to «nicht gelesen»): product owner decided 2026-10-28, counts only once all are read; DOM tests seen red
- [x] Closing review: `docs/reviews/773-review-2.md`
- [x] PR merged: #929

### #484 Glossary row «Erledigt»
- [x] Row «Erledigt» in `UBIQUITOUS_LANGUAGE.md` as decided on 2026-10-28 (proposal of domain review 448-4 V-28, `settled`)
- [x] Help texts checked: `glossary_balance_text`, `glossary_settled_text` and the help at «Bezahlt am» already follow #448; no marker names #484
- [x] No scenario: glossary text only, no app change
- [x] PR merged: #930

### #512 Missing statements before a change of the period setting
- [x] `@wip` scenarios (contract page, wizard link, Übersicht), seen red at the missing behaviour; the setting stays «Kalenderjahr», the building's statements follow «Juli – Juni» (no global setting changed)
- [x] `fach-reviewer` round 1: `docs/reviews/512-fachreview-1.md`; V-1 (switch point by the first statement under the setting), V-2 (hint #486 in the row of the short period, new scenario), V-3 (Übersicht reads the building's statements) fixed before green; V-4 (two changes of the setting) stays in the report
- [x] Unit tests of the rule in `backend/src/__tests__/accounting-period.test.ts`, seen red; case a of V-1 pins kept behaviour
- [x] Code: `backend/src/services/accounting-period.ts`, `statement-run.service.ts`, `src/routes/contracts/[id]/MissingStatement.svelte`
- [x] Slice review round 1: `docs/reviews/512-review-1.md` (C-1 DOM test of the hint's row, C-2 pg test of the Übersicht wiring, C-3 API docs; all three fixed, both tests seen red by taking the code out)
- [x] Persona Dr. Weber: `docs/design/personas/weber-512.md`; P-1 (Major, a year ended before the change cut by the new setting): product owner decided 2026-10-28 to store the day of the change and the type before (`accounting_period_changed`, no migration: key-value table); unit and pg tests seen red. P-2 to P-5 Minor stay in the report
- [x] No scenario for the stored change: a state of the global setting `accounting_period` that would break the parallel scenarios (`tests/e2e/CLAUDE.md`, "No scenario"); `statement-run.pg.test.ts` shows it
- [x] Re-review round 2: `docs/reviews/512-review-2.md` (C-1 to C-3 closed; C-4 Major, a setting changed back on a later day became the earlier type: fixed, pg test seen red); persona Weber again: `docs/design/personas/weber-512-2.md` (P-1 fixed; two Minors stay)
- [x] Re-review round 3: `docs/reviews/512-review-3.md` (C-4 closed; C-5 Minor, the day of a brief change kept, fixed with a unit test seen red; C-6 Minor, one `month` helper, fixed)
- [x] Closing review: `docs/reviews/512-review-4.md` (C-5, C-6 closed; C-7 Minor: the PR text names the two tests that pin kept behaviour)
- [x] CI fix: fitness P2 counted one more query on `/dashboard` and `/contracts/missing-statements`; `periodSetting()` reads the setting and its change in one query
- [x] Glossary «Hinweis auf fehlende Abrechnungen»: sentence on how periods are cut, decided by the product owner on 2026-10-28 in chat (proposal of Fachreview 512-1)
- [x] PR merged: #938

### #506 Übertrag that reaches no statement
- [x] `@wip` scenarios in `statement-minimum-balance.feature` (C: send dialog of a draft whose Übertrag changed; B: task on the Übersicht and «als ausgeglichen markieren»), seen red at the missing behaviour
- [x] Decided by recommendation (product owner 2026-10-28: decide by my recommendations): C stays in the send dialog (the overview text of outdated drafts is pinned by a scenario and stays); B «settled by hand» is a date on the statement (`carry_settled_on`, migration) set from the statement page after a confirmation
- [x] `fach-reviewer` round 1: `docs/reviews/506-fachreview-1.md`; V-1 to V-3 (Major) and V-4 to V-7, V-9 fixed before green, decided by recommendation and recorded in #506; V-8 fixed after code review 506-1 C-1
- [x] pg tests (`statement-carry-over.pg.test.ts`), DOM and unit tests, seen red (those written after the code by taking it out)
- [x] Code: migration `0038_carry_settled_on.sql`, `carry-over.ts`, `statement.service.ts`, `statement-invoices.service.ts`, `contract-tasks.service.ts`, route `POST /statements/:id/carry-settled`; frontend `PaymentPanel`, `CarrySettleDialog`, send dialog, Übersicht; texts in four languages; glossary; contracts; a11y screen `statement-open-carry-detail`
- [x] Slice review round 1: `docs/reviews/506-review-1.md`; C-1 (Major, V-8 decided but not built): fixed without an extra query (the draft list computes `carryChanged` in SQL), pg test seen red; C-2, C-4, C-5 fixed (C-2 tests red by taking each condition out); C-3 rejected: the decision in #506 names a Nebenkostenpauschale only
- [x] Persona Helga: `docs/design/personas/helga-506.md` (no Blocker/Major; P-1 to P-3 Minor stay)
- [x] `daten-pruefer`: `docs/reviews/506-datenpruefung-1.md` (to the Rappen; D-1 Minor, an off-grid legacy Saldo is not rounded again when a draft loses its Übertrag, «Neu berechnen» heals it, stays)
- [x] Re-review round 2: `docs/reviews/506-review-2.md` (C-1 closed; C-6 Major rejected: the «zu versenden» count is global over every draft of `dwello_e2e`, which parallel scenarios change at any time, so no scenario can assert it (`tests/e2e/CLAUDE.md`, Isolation); `statement-carry-over.pg.test.ts` asserts it; C-7 Minor fixed: one SQL rule `carriedNow` for the calculation and the draft check)
- [x] Closing review: `docs/reviews/506-review-3.md` (no findings; C-6 rejection holds)
- [x] CI fix: Architecture fitness Ä4, a changed status branch in the statement page; the allowed line stays as it was, the Übertrag part beside it (fitness reproduced locally first)
- [x] Copilot review of #941: Akonto from the day after the period (pg test red first), settling checked in its update (no sequential test can show a race), the correction dialog names a hand-settled Übertrag (DOM test red first, four languages); the reset-dialog point answered on its thread, not built
- [x] Closing review of the Copilot fixes: `docs/reviews/506-review-5.md` (C-1 Major: a scenario for the correction dialog, its DOM test was red first; C-2 comment; C-3 refusal test red by taking the conditions out)
- [x] Re-review: `docs/reviews/506-review-6.md` (C-1 to C-3 closed)
- [x] PR merged: #941

### #817 MCP server with access keys («Zugangsschlüssel für KI-Programme»)
- [x] «Done means» written in #817 from the decisions (product owner 2026-10-28)
- [x] `@wip` scenarios: `zugangsschluessel.feature` (open, create once, an AI program reads the buildings, revoke); `privacy.feature` (new section, Protokoll text)
- [x] `fach-reviewer` round 1: `docs/reviews/817-fachreview-1.md` (R-1 to R-3, V-1 Major; decided by recommendation and recorded in #817: texts only, no confirmation step; glossary terms in #942)
- [x] Steps, pg tests (keys, check on `/mcp`, expiry, same refusals), DOM, mapping and proxy tests; seen red
- [x] Code: migration `0039_access_keys.sql`, `access-key.service.ts`, routes `access-keys.ts` and `mcp.ts`, web app pass-through `src/routes/mcp/+server.ts`, settings page `config/access-keys`, privacy section, Protokoll texts; four languages (it «disattivare», `revoca` is the Disdetta's)
- [x] Docs: ADR 0007, S1 in `docs/architecture/utility-tree.md`, glossary row, `docs/design/i18n-begriffe.md`, `docs/api-specification.md`, `docs/data-model.md`, `docs/installation.md`
- [x] a11y and language screen `access-keys` (`default`, `empty`, `key-created`, `key-create-refused`, `key-revoke-dialog`)
- [x] Workflow note: two scenarios not `@wip` pin old legal sentences and the «Stand» date; the additions are sentences of their own, the date waits for the product owner
- [x] Slice review round 1: `docs/reviews/817-review-1.md`; `fach-reviewer` round 2: `docs/reviews/817-fachreview-2.md`; personas `helga-817.md`, `marco-817.md`, `weber-817.md`
- [x] Fixes: lists page with `limit`/`offset` (C-1, V-6), action tests, scenario and a11y state for the refused name (C-2), revoke toast names the key (C-3, personas; scenario red first), copy buttons and the address in the new key's panel (Helga P-1, Marco P-1, Helga P-3, Weber P-3), no contract PDF or notes (C-7, R-11), documents of a statement (C-5, V-9), wording V-7, V-8, V-10, V-11, R-8, R-10, name length C-8, MCP scenarios through the web app (C-4), C-9, C-10, terms link (Weber P-4); tests red first
- [x] Re-reviews: `docs/reviews/817-review-2.md` (C-1, C-3 closed; C-2 rest rejected: «nicht erstellt» and «nicht widerrufen» come only from a failing call between web app and backend, `tests/e2e/CLAUDE.md` «No scenario»; the action tests show them), `docs/reviews/817-fachreview-3.md` (V-6 closed), personas `helga-817-2.md`, `marco-817-2.md` (no Blocker/Major)
- [x] Product owner 2026-10-29: «Stand» becomes the day of the merge (`Spec change approved: #817`, scenarios «Stand der Datenschutzerklärung», «Stand der Nutzungsbedingungen»; DOM tests red first); glossary rows of #942 in this pull request
- [x] Minor fixes: paging wording V-12, the address with its own copy button in the panel and one confirmation per button (Helga 817-2 P-1, P-3, Marco 817-2 P-1), tests of a failed copy (C-11) and the demo sentence (C-12)
- [x] Closing review: `docs/reviews/817-review-3.md` (C-2 rejection holds, closed; C-13 Major: a scenario for copying, red without the buttons, Chromium gets `clipboard-write`; C-14 Minor: tests of the address toast and the refused revoke, red by taking the lines out)
- [x] Closing review of the C-13 fix: `docs/reviews/817-review-4.md` (C-13, C-14 closed; Firefox and WebKit checked by a full CI run on the branch)
- [x] PR pushed after this review
- [x] CI fix: fitness P2, the Protokoll list needed 4 queries for recording expiries; one statement now (reproduced locally first); review `docs/reviews/817-review-5.md` (no findings)
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-817.md` (the session is archived before the last pull request of this request, #578)
- [x] PR merged: #943

### #578 Published images and compose.yaml without build
- [x] Repository public: the «Stop and ask» of #578 does not apply
- [x] No scenario: an operator change (images, compose file, release workflow), nothing a landlord sees in the app
- [x] Tests seen red first: `backend/src/__tests__/compose-images.test.ts` (images only, the keys script inside, project name, only the web app's port, the same services and settings as `docker-compose.prod.yml`), `tools/release/release.test.ts` (the version handed to the workflow)
- [x] `compose.yaml`; `release.yml` publishes frontend and backend images for amd64 and arm64 with version and `latest`; CI job «Docker images» starts `compose.yaml` with the images it built and checks `/health`
- [x] `docs/installation.md` (download, update, moving from a clone), `README.md` «Deployment», `marketing/index.html` «Einrichten»; O-46 of the former `offene-punkte.md` is archived, the test «veröffentlicht nur den Port der Web-App» covers it
- [x] Collected workflow review: `docs/reviews/workflow-rules-review-2026-10-29.md`
- [x] Session archived before the last pull request
- [x] Slice review round 1: `docs/reviews/578-review-1.md` (C-1 Major `--pull never` kept postgres and alpine out; C-2 Major fr/it/en site still showed the clone: rebuilt with `marketing/i18n/build.py`, two stale keys of `main` removed so the build runs; C-3 to C-7 fixed: `docker compose -f docker-compose.yml` for development, Compose 2.23.1, Apple silicon is arm64, CI runs the backend tests when a compose file changes, `APP_VERSION` only for the frontend)
- [x] Re-review: `docs/reviews/578-review-2.md` (C-1 to C-7 closed, no new findings)
- [x] PR: pushed after this archive

## Session: red main after #944 (2026-10-29)

### #945 CI auf main ist rot
- [x] Release job «Images (frontend)»: Paraglide fails under QEMU for arm64 («Invalid Lix schema definition»); the frontend's deps and build stages now run on `$BUILDPLATFORM` (output is JavaScript, no native runtime dependencies), only `runner` per target platform; test in `compose-images.test.ts` red first
- [x] CI «Docker images» on main: `curl` exit 56 while the backend image fetched the PostgreSQL apt key (network, not this change); failed job re-run once
- [x] Slice review: `docs/reviews/945-review-1.md` (C-1 Minor: the comment now names the optional canvas binary of pdfjs-dist, unused on the server)
- [x] PR: pushed after this archive (the next release publishes both images)
## Session: #718 part 2, «Sicherung einrichten» (2026-10-29)

- [x] Spec change of `einrichtung.feature` approved by the product owner in #718 (the setup now leads to the Sicherung)
- [x] `@wip` scenarios `sicherung.feature` and the privacy scenario first; fach review of step 1: `docs/reviews/718b-fachreview-1.md`, `718b-fachreview-2.md` (all fixed)
- [x] Backend: `0040_backup_pending_code.sql`, `/api/v1/backup` (setup, confirm, Notfallblatt), state `setup` in `/health`; frontend: `/backup`, redirect while not set up, notice in the overview, privacy lines; seen red
- [x] a11y and language rows: `backup` (default, backup-error), `dashboard` (backup-confirmed, backup-stale)
- [x] Slice review round 1: `docs/reviews/718b-review-1.md` (C-1 to C-3 Major, fixed); round 2: `718b-review-2.md` (C-12 to C-14 Minor, fixed)
- [x] Fach review step 5: `docs/reviews/718b-fachreview-3.md` (V-1, R-1 Major, fixed), `718b-fachreview-4.md` (closed; V-5, R-3 adopted)
- [x] Personas: `helga-718b.md` (P-1 Major, fixed; re-run `helga-718b-2.md`), `sven-718b.md`, `marco-718b.md`, `weber-718b.md` (P-1 Major, fixed), `anna-718b.md`; Minors met by two personas: #947
- [x] PR `Refs #718`, `Spec change approved: #718`: pushed after this archive

## Session: rule changes from the collected review (2026-10-29)

### #948 Workflow: three rule changes
- [x] Product owner 2026-10-29: apply proposals 1 to 3 of `docs/reviews/workflow-rules-review-2026-10-29.md`
- [x] `CLAUDE.md` Workflow 1 («Stand» date with the legal text), `tests/e2e/CLAUDE.md` «Failure states» (`FailRequests` never reaches `fail()`), `no-german-in-code.test.ts` (code words such as `lang`)
- [x] No scenario: rules and a test helper; nothing in the app changes
- [x] Review: `docs/reviews/948-review-1.md` (C-1 Minor fixed: the rule names the `Spec change approved` line)
- [x] PR: pushed after this archive

## Session: #718 part 3, «Neuer Wiederherstellungscode» (2026-10-30)

- [x] `@wip` scenarios first; fach review of step 1: `docs/reviews/718c-fachreview-1.md` (V-1 Major fixed: a backup right after the confirmation; V-2 Major a product decision: #953)
- [x] Backend: `POST /api/v1/backup/new-code` (the password again, or a sign-in with Google of the last 10 minutes), a new code waits 30 minutes, `BACKUP_CODE_EXPIRED`, Sicherungen one after the other; frontend: `/config/backup`, the card in «Einstellungen», `reauth=1` → `prompt=login`; seen red
- [x] a11y and language rows: `config` (backup-links), `config-backup` (7 states)
- [x] Code review: `docs/reviews/718c-review-1.md` (no Blocker/Major), closing round `718c-review-2.md` (C-5 fixed)
- [x] Fach review step 5: `718c-fachreview-2.md` (V-1 Major fixed), `-3.md`, `-4.md` (closed)
- [x] Personas: `helga-718c.md` (P-1 Major fixed; `-2`), `sven-718c.md` (P-1, P-2 Major fixed; `-2`), `marco-718c.md`, `weber-718c.md`, `anna-718c.md` (P-1 Major fixed; `-2`); Minors met by several personas: #956, #957
- [x] No scenario for an expired code: the 30 minutes need the server clock; `backup-new-code.pg.test.ts`
- [x] PR `Fixes #718`, `Fixes #957`: pushed after this archive
## Session: #951 Protokoll names access keys and AI program queries

- [x] @wip scenario «Das Protokoll nennt die Zugangsschlüssel und die Abrufe von KI-Programmen» (`settings.feature`), seen red at the old description
- [x] `fach-reviewer` round 1 on the scenario and the wording in four languages (`docs/reviews/951-fachreview-1.md`)
- [x] `audit_link`, `audit_purpose`, `audit_empty_text` in `messages/{de,fr,it,en}.json`; DOM test of the empty state follows
- [x] Scenario green without `@wip`
- [x] Closing `code-reviewer` round (`docs/reviews/951-review-1.md`)
- [x] PR (Fixes #951), pushed after this archive

## Session: #954 main red in the scheduled run (2026-10-30)

- [x] Run 41028478233 on b5d45ce: two Firefox failures, read from the traces of `e2e-reports-3` and `e2e-reports-4`
- [x] «Hochladen abbrechen verwirft die Dateien»: the KI answer came 24 ms before the click; the hints pushed «Abbrechen» down and the click hit them. The step waits until no file is still read; both cancel scenarios green in Chromium, 3 times each
- [ ] «Suche ohne Treffer» (Firefox, third time after #754, #869): no request after the click, the caret stays in the field. Cause not confirmed: this container has no Firefox; comment on #954
- [x] No review of its own: a test-only CI fix (Workflow 7)
- [x] PR `Refs #954`: pushed after this archive

## Session: #954 main red after #955 (2026-10-30)

- [x] Push run 41048205819 on f8bd05f: language row «access-keys key-created» found «her» in the random key «dwello_HEr374…»
- [x] `tests/e2e/questions/language.ts` masks access keys as it masks the Wiederherstellungscode; 10'000 random keys masked completely, the access-keys language rows green
- [x] Firefox (loaded with the product owner's approval): «Suche ohne Treffer» not reproduced (90, 240 and 507 runs green); comment on #954
- [x] No review of its own: a test-only CI fix (Workflow 7)
- [x] PR `Refs #954`: pushed after this archive

## Session: #936, S1 for every registered route (2026-10-31)

- [x] `auth.pg.test.ts`: every route of `app.routes` without a session → 401, except 11 public routes with a reason each, and each of them still registered
- [x] Red before the fix: 40 guarded routes answered 422 (Elysia validated before the auth hook); red again with one route module registered before `authMiddleware` (2 routes)
- [x] Fix: `authMiddleware` refuses in `derive` with `status(401)`, before the route's validation
- [x] `utility-tree.md` S1 «Heute» and matrix, `fitness-functions.md` overview
- [x] Code review: `docs/reviews/936-review-1.md` (no findings)
- [x] No scenario: nothing a user sees changes (an unauthenticated request gets 401 instead of 422)
- [x] PR `Fixes #936`: pushed after this archive
## Session: #953 restore keeps the newer Wiederherstellungscode (2026-10-31)

- [x] Decisions of 17 needs-decision issues recorded (product owner: decide by the recommendations); #495 closed (done in #817/#943); #959 opened (#523 option B)
- [x] pg test: a restore of an older Sicherung keeps the newer code (seen red: the new Sicherung opened only with the old code)
- [x] `restoreBackup` reads the code in force before the restore and writes it back after the migrations (`backend/src/services/backup.service.ts`)
- [x] `docs/installation.md`: which Notfallblatt opens which backup
- [x] code-reviewer round 1 (`docs/reviews/953-review-1.md`)
- [x] PR pushed after this archive (No scenario: the restore is a Betreiber command outside the E2E stack)

## Session: #523 partial payment hint in «Als bezahlt markieren» (2026-10-31)

- [x] Scenario «Der Zahlungseingang sagt, was bei einer Teilzahlung gilt» (`statement-detail.feature`, seen red as @wip)
- [x] DOM test for the Nachzahlung and the Rückerstattung (`statement-pages.dom.test.ts`, seen red)
- [x] the sentence in `PaidDateFields.svelte`, texts de/fr/it/en as checked by `fach-reviewer` (#448 round 4, comment on #523); no persona: a decided text read in all four languages (CLAUDE.md, Workflow 5)
- [x] code-reviewer round (`docs/reviews/523-review-1.md`)
## Session: #545 a Mahnung counts from its sending (2026-10-31)

- [x] @wip scenarios in `statement-reminder.feature`; «Nächste Mahnung erst nach der Zahlungsfrist der letzten» reminds by e-mail (Spec change approved: #545)
- [x] fach-reviewer step 1 (`docs/reviews/545-fachreview-1.md`): V-1 to V-7 taken
- [x] pg tests in `reminders.pg.test.ts`, `swiss-today.pg.test.ts` (seen red); the date of the last reminder derived from the reminders that went out (`statement.service.ts`), no column writes (`reminder.service.ts`)
- [x] hint on the detail page and «Mahnung noch zu versenden» in the list, only when overdue; texts in de/fr/it/en
- [x] code-reviewer round 1 (`docs/reviews/545-review-1.md`)
- [x] persona Dr. Weber (`docs/design/personas/weber-545.md`): P-1 fixed (Zahlungsfrist only for a sent reminder, DOM test seen red)
- [x] code-reviewer round 2 (`docs/reviews/545-review-2.md`): C-6 fixed (scenario step, seen red)
- [x] code-reviewer round 3 (`docs/reviews/545-review-3.md`)
- [x] CI fix: Architecture fitness Ä4, the backend answers `reminderToPost` (`docs/reviews/545ci-review-1.md`)
- [x] PR pushed after this archive

## Session: #524 the sent PDF stays in the Verlauf (2026-10-31)

- [x] @wip scenarios in `statement-detail.feature`; fach-reviewer step 1 (`docs/reviews/524-fachreview-1.md`): V-1 to V-7 and M-1 taken, V-8 not (Minor: a status branch on the edit page would need a backend field), M-2 is #966, missing terms #965 (marker in `MetadataCard.svelte`)
- [x] pg tests `statement.routes.pg.test.ts`, contract `statement-updated.json` (seen red); `pdfChange` in the answer of `PUT /statements/:id` (`statement.service.ts`, `PdfChange` in `api/statement.ts`)
- [x] hint after saving (`?pdf-change=`), «Versendetes PDF herunterladen» and «Neues PDF erstellt» in the Verlauf; DOM tests seen red; texts de/fr/it/en from the fach review
- [x] screen state `statement-reminded-detail` `pdf-changed`; `statement-sent-detail` sent by letter in the screen seeds
- [x] code-reviewer rounds 1 to 3 (`docs/reviews/524-review-1.md`, `-2.md`, `-3.md`)
- [x] persona Dr. Weber (`docs/design/personas/weber-524.md`): P-1 and P-2 beyond the decision, #968 and #969
- [x] Workflow note: the step «der Liegenschaftsverwalter die Abrechnung versendet» does not wait for the sending; a scenario that leaves the page right after it needs «hat die Abrechnung den Status "Versendet"»
- [x] PR pushed after this archive
## Session: #934, P1 measured on a runner-like machine (2026-10-31)

- [x] `tools/fitness/p1-benchmark.ts` (`bun run fitness:p1`): 1 building, 50 rental contracts, the wizard's form action «generate» through the BFF, then the PDFs as the run's ZIP; its own ports (3320/3321) and build (`/tmp/p1-app`)
- [x] Measured on 4 vCPU Xeon 2.1 GHz, 15 GB: run 3.0 s, PDFs 3.5 s, together 6.5 s (seven runs 6.4–7.5 s); P1 holds by a factor of 4.6; `utility-tree.md` P1 and A4, `fitness-functions.md` §4
- [x] Code review: `docs/reviews/934-review-1.md` (C-1, C-2 Major fixed), `934-review-2.md` (closed, C-4 Minor stays)
- [x] No scenario: a measuring script, nothing a user sees changes
- [ ] The demo VM run and the decision on a CI guard: the product owner (#934 stays open)
- [x] PR `Refs #934`: pushed after this archive
