## Session 2026-11-04: #1094 keep the list filter from the statement detail

- [x] Decision recorded in #1094 (product owner: «nach deiner Empfehlung»): breadcrumb and the PDF refusal page of the detail page keep the list's filter; the refusal page does not name the statement
- [x] Scenarios in `statements.feature`, seen red at the missing filter; `openStatement` waits for the detail page (a deletion meanwhile overtook it)
- [x] `pdfRefusal` takes the filtered list from `?list=` of the PDF link for a gone record; breadcrumb uses the list (as `$derived`, fallow template complexity); D7c
- [x] Code review: round 1 C-1 Major (the way back to the list of a gone statement read «Zurück»; the load names it, `way`) and C-2 fixed, C-3 Minor (SendDialog «PDF ansehen» passes no list) stays in the report; closing round 2 clean (`docs/reviews/1094-review-1.md`, `-2.md`)
- [x] Persona Helga: no findings; «Alpenblick» had no draft, she checked the same way on «Musterhaus Zentrum» (`docs/design/personas/helga-1094.md`); her note «Zurück sagt nicht wohin» is C-1
- [x] PR: merge of origin/main clean

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

## Session: #935 a release weekly, Monday 06:00 (2026-10-31)

- [x] Decided (product owner, #935): weekly on Monday at 06:00 Swiss time; a week without changes gets no tag
- [x] `release.yml`: two Monday crons (04:00 and 05:00 UTC), `release.sh` lets only the one that is 06:00 in Zurich release; no tag and no images when main is tagged already; a manual run releases at once, the version optional (tests in `release.test.ts`, seen red)
- [x] `upgrade-check.sh` thereby tests against the last weekly release; footer unchanged (`git describe`, `0.4.0+3-gabc1234` between releases); the demo updates per release
- [x] Docs: README «Versions», `deploy/demo/README.md`, `docs/installation.md`, `utility-tree.md` U1 and «Releases», `risks-and-tradeoffs.md` SP-U1-5, `fitness-functions.md`
- [x] Code review: `docs/reviews/935-review-1.md` (no Blocker/Major; C-1, C-2 Minor fixed)
- [x] No scenario: CI release tooling, nothing a user sees in the app changes
- [x] Workflow notes: none for #935; collected review of this request `docs/reviews/workflow-rules-review-2026-10-31.md`
- [x] PR `Fixes #935`: pushed after this archive

## Session: #947 and #956 a refused backup code, the end of a new code (2026-10-31)

- [x] Scenarios in `sicherung.feature`: «Den Wiederherstellungscode leer lassen», «Nur einen Teil des Wiederherstellungscodes eingeben», «Nach der Bestätigung bietet die Seite keinen weiteren neuen Code an», «Von der Bestätigung des neuen Codes zurück zu den Einstellungen» (seen red as @wip)
- [x] Backend `confirmBackupCode`: `BACKUP_CODE_EMPTY`, `BACKUP_CODE_INCOMPLETE` (typed, of), pg tests seen red; messages de/fr/it/en; `docs/api-specification.md`
- [x] `/config/backup?confirmed`: the confirmation and «Zurück zu den Einstellungen», no form (a11y meaning `new-code-confirmed`)
- [x] Optional «Code kopieren» of #947 not built: the message now says how many characters are missing
- [x] Code review `docs/reviews/947-review-1.md` (C-1 Minor fixed), closing round `947c-review-1.md` (no findings)
- [x] Personas `marco-947.md`, `sven-947.md`: no Blocker/Major; Minors Marco P-1, Sven P-1, P-2 stay in the reports (each met by one persona, the last two also on the base commit)
- [x] Workflow notes `docs/reviews/workflow-notes-issue-947.md`
- [x] PR `Fixes #947`, `Fixes #956`: pushed after this archive

## Session 31.10.2026: #528 Kategorie mit zwei Verteilschlüsseln

- [x] @wip scenarios in `statement-detail.feature` (draft hint, link, «Neu berechnen» question, PDF) and `statement-generate.feature` (preview), seen red at the missing behaviour
- [x] fach-reviewer step 1 (`docs/reviews/528-fachreview-1.md`)
- [x] Backend: pure `splitKeysOf` (`split-keys.ts`); `getStatement` marks `otherKey` and returns `splitKeys` from the lines; lines of one Kategorie together (`calculation.service.ts`); `invoiceSplitKeys` in the completeness check and `changed-invoices` (pg and unit tests)
- [x] PDF: the marked line names its invoices after the Kategorie (`statement-pdf.service.ts`, unit test)
- [x] Preview, draft and «Neu berechnen» question: `SplitKeysHint.svelte` with a link to each invoice (DOM tests, texts in four languages)
- [x] Screen states `statement-generate split-keys`, `statement-split-keys-detail` `default` and `recalculate-dialog` (`screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`)
- [x] Spec change approved: #528 — the tank scenario (#770) names the invoice in its «Pro Einheit» line
- [x] code-reviewer `docs/reviews/528-review-1.md`, `528-review-2.md`, `528-review-3.md`
- [x] Persona Dr. Weber `docs/design/personas/weber-528.md`
- [x] daten-pruefer `docs/reviews/528-datenpruefung-1.md`
- [x] fach-reviewer step 5 `docs/reviews/528-fachreview-2.md`
- [x] Workflow notes `docs/reviews/workflow-notes-issue-528.md`
- [x] Closing review `docs/reviews/528close-review-1.md`, `528close-review-2.md`
- [x] PR: pushed after this archive

## Session: #974 R1, the restore of a database after 10 years (2026-10-31)

- [x] Issue #974 opened (A2 / R1, product owner chose it)
- [x] `tools/fitness/r1-benchmark.ts` (`bun run fitness:r1`): 5 buildings, 50 apartments, 75 contracts, 2016–2025, 40 Belege per building and year, one statement PDF per tenant and year, random content; options `--belege`, `--beleg-kb`, `--pdf-kb`; backup and restore through `restore-check.ts`
- [x] `restore-check.ts` reads the Sicherung in pieces (`file-contains.ts`, test seen red without the carry-over): a 2 GB file failed with ENOMEM
- [x] Measured: Belege of 400 KB → database 1.2 GB, Sicherung 864 MB in 50 s, restore 24 s; Belege of 1 MB → 2.8 GB, 2.0 GB in 109 s, restore 97 s; `utility-tree.md` R1 and A2, `fitness-functions.md`
- [x] Code review `docs/reviews/974-review-1.md` (C-1 to C-3 Minor fixed), closing round `974c-review-1.md` (C-1 Minor stays: no caller searches a one-character text)
- [x] No scenario: a measuring script, nothing a user sees changes
- [ ] The volume assumptions (40 Belege per building and year, 400 KB to 1 MB per Beleg): the product owner confirms (A2)
- [x] PR `Fixes #974`: pushed after this archive

## Session 31.10.2026: #534 Erneut per Brief zustellen, #968 neues PDF als versendet, #965 Glossar

- [x] @wip scenarios `statement-redeliver.feature` (#534) and in `statement-detail.feature` (#968), seen red at the missing behaviour
- [x] fach-reviewer step 1 (`docs/reviews/534-fachreview-1.md`); follow-up decisions recorded in #534, #968, #965
- [x] Backend #534: `redeliverByLetter` (dated today, Zahlungsfrist as at the first sending, PDF anew as a Dokument by letter, nothing changes without the PDF); reminders count only since the last sending (`delivery.ts`)
- [x] Backend #968: `keepNewPdf` keeps the new PDF as a Dokument to send; posted without redating; refused once paid or replaced
- [x] UI: action and confirmation, the new PDF's hint and confirmation, a confirmation before «Als versendet markieren», Verlauf of every sending and PDF
- [x] Glossary rows (#534, #965) in `UBIQUITOUS_LANGUAGE.md` and `docs/design/i18n-begriffe.md`; the #524 hints say to send the new PDF (Spec change approved: #968)
- [x] Screen states `statement-sent-detail redeliver-dialog`, `new-pdf-sent-dialog`, `documents mark-sent-dialog`
- [x] code-reviewer `docs/reviews/534-review-1.md`, `534-review-2.md`, `534-review-3.md`
- [x] Persona Dr. Weber `docs/design/personas/weber-534.md`, `weber-534-2.md`
- [x] daten-pruefer `docs/reviews/534-datenpruefung-1.md`
- [x] fach-reviewer step 5 `docs/reviews/534-fachreview-2.md`, `534-fachreview-3.md`
- [x] Workflow notes `docs/reviews/workflow-notes-issue-534.md`
- [x] Closing review `docs/reviews/534close-review-1.md`, `534close-review-2.md`
- [x] PR: pushed after this archive

## Session 31.10.2026: #511 Texte zu Verwaltungspauschale, Vertragsende, Kündigung und Kündigungstermin

- [x] @wip scenarios (statement-detail, contract-detail, help), seen red at the missing texts (the PDF negative pins the base)
- [x] fach-reviewer step 1 (`docs/reviews/511-fachreview-1.md`) with the wording in four languages; follow-up decision recorded in #511
- [x] P-2: PDF note on the agreed Verwaltungspauschale, only when one is billed (`pdf.service.ts`, `agreed-categories.pg.test.ts`)
- [x] P-3, P-4, P-5: `contracts_end_date_help`, `contracts_notice_received_help`, `glossary_termination_date_text` in four languages; glossary rows «Kündigungstermin», «Kündigungsfrist», «Vertragsende»
- [x] No persona: the decided texts were read in four languages by the fach-reviewer (`CLAUDE.md`, Workflow 5)
- [x] code-reviewer `docs/reviews/511-review-1.md`; daten-pruefer `docs/reviews/511-datenpruefung-1.md`
- [x] Closing review `docs/reviews/511close-review-1.md`
- [x] PR: pushed after this archive

## Session 31.10.2026: #623 Glossar «Mieter anonymisieren»

- [x] Glossary rows «Mieter anonymisieren» (reviewer wording from #459, Fachreview 459-B) and «Anonymisierter Mieter» (comment in #623), as decided in #623
- [x] fr/it/en in `docs/design/i18n-begriffe.md`, from the words the UI already uses (`tenants_anonymise_*`)
- [x] Markers `TODO(fachlich prüfen, #623)` removed (`tenant-anonymise.service.ts`, `TenantAnonymiseCard.svelte`)
- [x] No scenario, no review round: glossary and comments only, no behaviour change
- [x] PR: pushed after this archive

## Session 31.10.2026: #619 Glossar «Dokumente geprüft»

- [x] Glossary row «Dokumente geprüft» as proposed in #619 (Option 1, decided in #619), with fr/it/en in `docs/design/i18n-begriffe.md`
- [x] No markers name #619; no scenario, no review round: glossary only
- [x] PR: pushed after this archive

## Session 31.10.2026: #538 Glossar «Nicht berichtigt»

- [x] Glossary row «Nicht berichtigt» as proposed in #538 (Option 1, decided in #538), with fr/it/en from the UI (`statements_history_correction_declined`)
- [x] Marker `TODO(fachlich prüfen, #538)` removed (`backend/src/db/schema.ts`, a comment only)
- [x] No scenario, no review round: glossary and a comment only
- [x] PR: pushed after this archive

## Session: #721 a Content-Security-Policy (2026-10-31)

- [x] `svelte.config.js` `kit.csp` (mode auto): script-src 'self' with SvelteKit's nonce, default-src 'self', style-src 'self' 'unsafe-inline', img-src 'self' data: blob:, object-src 'none', base-uri 'self', form-action 'self', frame-ancestors 'none'; `src/__tests__/csp.test.ts` (seen red)
- [x] Checked: E2E in Chromium for hydration, authentication, invoice-new, sicherung, documents, statement-detail (186 passed); a console scan of 11 pages and an upload of two invoice PDFs on the production persona build: no CSP violation
- [x] The PDF refusal page is HTML from a `+server.ts` route, outside `kit.csp`; it works unchanged
- [x] Code review `docs/reviews/721-review-1.md` (C-1 Minor fixed), closing round `721c-review-1.md` (no findings)
- [x] No scenario: a response header the landlord does not see
- [x] Also: A2 volumes confirmed by the product owner in `utility-tree.md` (#974)
- [x] PR `Fixes #721`: pushed after this archive

## Session 31.10.2026: #532 Glossar «Zahlungsfrist einer Mahnung», «Mahnung», «Nicht mehr versenden»

- [x] Glossary: new last sentence at «Zahlungsfrist einer Mahnung», the sentence at «Mahnung», the row «Nicht mehr versenden», in the wording of round 2 (N-4), as decided in #532; fr/it/en from the UI (`documents_not_to_send_paid`)
- [x] Requirements, point 11: the same rule for the next Mahnstufe
- [x] Marker `TODO(fachlich prüfen, #532)` removed (`src/lib/document-status.ts`, a comment only)
- [x] No scenario, no review round: glossary, requirements and a comment only
- [x] PR: pushed after this archive

## Session 31.10.2026: #986 Main CI rot auf fd00105 (Download des versendeten PDF in Firefox)

- [x] Root cause from the job log: the Verlauf names the new PDF before «PDF erstellen» ends (#968); the re-render takes the download click
- [x] `generateStatementPdf` waits for the success toast; the 29 scenarios that make a PDF pass in chromium (no Firefox locally)
- [x] PR: pushed after this archive

## Session 31.10.2026: #529 Glossar «Nicht aktuelle Abrechnung»

- [x] fach-reviewer checks the proposed row against what the code counts, as decided in #529 (`docs/reviews/529-fachreview-1.md`)
- [x] Glossary row «Nicht aktuelle Abrechnung» in the wording the review corrected (V-1 to V-3), with fr/it/en from the UI
- [x] V-4 and V-5 existed before (issues #980, #981); V-6 (Minor) stays in the report
- [x] No scenario, no further review round: glossary only
- [x] PR: pushed after this archive

## Session 31.10.2026: #980 Rechnungsseite warnt nach dem Berichtigen weiter

- [x] pg test (`statement-invoices.pg.test.ts`) and scenario «Nach dem Berichtigen warnt die geänderte Rechnung nicht mehr», both seen red without the fix
- [x] `invoiceStatements`: a replaced statement misses nothing (`isReplaced`); `billedIn` and `statements` keep it
- [x] code-reviewer `docs/reviews/980-review-1.md` (C-1 Minor fixed: docstring and API spec)
- [x] Persona Dr. Weber `docs/design/personas/weber-980.md`: P-1 to P-3 Minor, existed before (P-3 = 529-fachreview-1 V-6); stay in the report
- [x] PR: pushed after this archive

## Session 31.10.2026: #981 Entwurf mit geändertem Übertrag fehlt in der Übersicht

- [x] @wip scenario «Ein Entwurf mit geändertem Übertrag ist nicht aktuell» and pg test (`statement-carry-over.pg.test.ts`), both seen red
- [x] fach-reviewer step 1 `docs/reviews/981-fachreview-1.md`: V-1 (task text in four languages) done; V-2 Minor existed before, stays in the report
- [x] `outdatedStatements` counts `carryChanged` drafts (#981 A); `dashboard_task_outdated_drafts_text` names the third reason; scenario «Nicht aktuelle Entwürfe als eigene Aufgabe» takes the new text (Spec change approved: #981)
- [x] code-reviewer `docs/reviews/981-review-1.md`: no findings
- [x] No persona: the decided text was read in four languages by the fach-reviewer; no step-5 fach-reviewer: nothing changed since step 1
- [x] PR: pushed after this archive

## Session 31.10.2026: #966 Zahlungsfrist einer versendeten Abrechnung nicht verkürzen

- [x] @wip scenario «Die Zahlungsfrist einer versendeten Nachzahlung lässt sich nicht vorverlegen» and pg tests (`statement-mail.pg.test.ts`), seen red; the refund test pins kept behaviour
- [x] fach-reviewer step 1 `docs/reviews/966-fachreview-1.md`: V-1, M-1 (Major) and V-2 done; the refinement (only a Nachzahlung, the PDF the tenant got last) recorded in #966
- [x] `refuseEarlierDeadline` with `toldDeadline` (`delivery.ts`); the e-mail Dokument stores its Zahlungsfrist; message at the field in four languages
- [x] code-reviewer `docs/reviews/966-review-1.md`: C-1 (action test with contract), C-2 (docs) done, C-3 noted
- [x] Closing review `docs/reviews/966close-review-1.md`: C-1 (restore in the contract test) done
- [x] No persona: the decided message was read in four languages by the fach-reviewer
- [x] PR: pushed after this archive

## Session: #722 HTTPS with compose.yaml (2026-10-31)

- [x] `compose.yaml`: service `caddy` under the profile `https` (ports 80/443, inline Caddyfile like the demo's, volume `caddy_data`), started with `COMPOSE_PROFILES=https` and `DWELLO_DOMAIN` in `.env`; `DWELLO_DOMAIN` optional, since a required variable stopped `docker compose config` without the profile
- [x] `compose-images.test.ts`: Caddy in the profile, ports without HTTPS unchanged, parity with `docker-compose.prod.yml` without profile services (seen red)
- [x] Docs: `docs/installation.md` §7, `.env.example`, README
- [x] Code review `docs/reviews/722-review-1.md` (C-1 to C-3 Minor fixed), closing round `722c-review-1.md` (no findings)
- [x] No scenario: deployment configuration, nothing in the app changes; a real certificate needs a public domain and was not fetched
- [x] PR `Fixes #722`: pushed after this archive

## Session 31.10.2026: #969 PDF einer vor #449 versendeten Abrechnung vor der Änderung behalten

- [x] @wip scenario «Vor der Änderung einer Abrechnung ohne Dokument des Versands bleibt ihr PDF» and pg test, seen red
- [x] fach-reviewer step 1 `docs/reviews/969-fachreview-1.md`: V-1 to V-4 (Major), V-6 to V-8 done; V-5 covered by DOM tests; glossary term: #994 (marker in `delivery.ts`)
- [x] `keepPdfBeforeChange` before a change, a payment reset and a redelivery; Verlauf links and hint; documents without Versandstatus; export takes the first copy; texts in four languages
- [x] code-reviewer `docs/reviews/969-review-1.md` (C-1, C-2, C-4, C-7 to C-9 done; C-3 rejected: the screens seed shows the variants; C-5 stays; C-6 noted), `969-review-2.md` (C-10 done)
- [x] No persona: the decided texts were read in four languages by the fach-reviewer
- [x] PR: pushed after this archive

## Session: utility tree brought up to date after #718, #935, #974 (2026-10-31)

- [x] `utility-tree.md`: context «Backup», U1 environment and «Heute» (backup before every migration), U1 fitness function (the Compose update of the images is missing)
- [x] Difficulty re-rated (derived; importance unchanged as the PO confirmed it): R1 H/H → H/L, U1 H/H → H/M, O1 H/M → H/L; matrix and candidates: no H/H left, next U1 with the Compose update
- [x] `risks-and-tradeoffs.md`: SP-U1-3, SP-R1-4, RI-U1-1, RI-U1-2, RI-R1-3, RI-R1-4 marked done with their issues
- [x] Docs only: no code review, no scenario
- [x] PR (no issue; the product owner asked for it in the conversation): pushed after this archive

## Session: #997 U1 update with Compose from the last release

- [x] `tools/fitness/compose-update-check.sh`: release compose.yaml and images with demo data and a confirmed code, then `docker compose up -d` with this change's images on the kept compose.yaml; healthy, Sicherung before new migrations, rows and sums
- [x] `--broken` negative test: failing migration stops with file and cause from the log, after a Sicherung
- [x] counts, sums and the fixture shared with `upgrade-check.sh` (`tools/fitness/data-totals.sh`)
- [x] CI job «Docker images»: both runs; on every PR with app changes and on main
- [x] Seen red locally: broken image without `--broken`; new migration without `backupBeforeMigration`
- [x] Docs: utility tree U1 (H/L), fitness-functions table and counter-checks
- [x] Slice review round 1 (`docs/reviews/997-review-1.md`): C-1 Major fixed, C-2 and C-3 fixed
- [x] Re-review and closing round (`docs/reviews/997-review-2.md`): no findings, C-1 to C-3 closed
- [x] Workflow note: the local Docker daemon cannot pull from ghcr.io or reach deb.debian.org; old and new images built from the tags on local stand-in base images (`docs/reviews/workflow-notes-issue-997.md`)
- [x] PR: pushed after this archive

## Session: #959 Teilzahlung (A)

- [x] fach-reviewer step 1 `docs/reviews/959-fachreview-1.md`: rules 1–7 recorded in #959 «Decided»; V-1 to V-4 (Major) done; M-1, V-5 to #1000, #1001
- [x] Backend: part payments in `payments` (migration 0041), `paidAmount` their sum, paid once they reach the Saldo on the latest day; reset takes back the last payment; Mahnung letter and QR part, overview sums name the open amount
- [x] UI: «Bezahlter Betrag» prefilled with the open amount, «Teilzahlung festhalten», «Bezahlt: …, offen: …» on detail page and list row, correction prefilled; help text replaces the #523 sentence (Spec change approved: #959)
- [x] Scenarios «Eine Teilzahlung lässt die Abrechnung mit dem Rest offen», «Nach einer Teilzahlung mahnt der Liegenschaftsverwalter den Rest»; axe and language rows `statement-part-paid-detail`; No scenario for the overview sums: they add up every statement of the database, so parallel scenarios change them (`dashboard.pg.test.ts`)
- [x] code-reviewer `docs/reviews/959a-review-1.md`, `959b-review-1.md`, `959b-review-2.md` (C-7, C-12 done), closing `959c-review-1.md`
- [x] Personas `docs/design/personas/helga-959.md`, `weber-959.md` (P-1, Helga P-2 done; Minors stay, Weber P-2/P-3 in #1000)
- [x] daten-pruefer `docs/reviews/959-datenpruefung-1.md`: no findings
- [x] Glossary rows decided in #959; follow-up issues #999 to #1003
- [x] PR: pushed after this archive

## Session: #1004 main red, «vor 40 Tagen» across summer time

- [x] Cause: `backend/scripts/e2e-sent-days-ago.ts` moved `sent_at` by 40 × 24 h in UTC; at 23:12 Zurich (CET) that lands at 00:12 of the next Swiss day in summer time, while the step expects today minus 40 Swiss days
- [x] Reproducing test `backend/src/__tests__/e2e-sent-days-ago.pg.test.ts`, seen red («2026-09-22 00:12» against «2026-09-21 23:12»)
- [x] Fix: move `sent_at` in Swiss local time; test green, scenario «Eine per E-Mail versendete Abrechnung erneut per Brief zustellen» green in Chromium
- [x] No code-reviewer round: test-only CI fix (`CLAUDE.md`, Workflow 7)
- [x] PR: pushed after this archive

## Session: #535 Upload result names the mixed rest

Parallel session (the #671 session stays in `implementation_plan.md`): checklist kept here and in the pull request.

- [x] @wip scenario «Nach dem Erstellen nennt Dwello den Rest einer Rechnung mit Kosten, die nicht umlagefähig sind», seen red
- [x] fach-reviewer step 1 `docs/reviews/535-fachreview-1.md`: V-1 wording taken, V-2 amount step, V-4 in the DOM test; V-3 «Reparaturen» kept as recommended
- [x] Upload result: line and link «Rechnung erfassen» at each created invoice with mixed costs, four languages; DOM test seen red; state `upload-mixed-rest`
- [x] code-reviewer `docs/reviews/535-review-1.md` (C-1, C-2 done), closing `535b-review-1.md` (no findings)
- [x] Persona `docs/design/personas/marco-535.md`: four Minors, stay in the report
- [x] Workflow note: `docs/design/personas/demo-records.md` is missing, which the persona README names for records
- [x] Workflow note: a merge of `main` drops the archive's last line «PR: pushed after this archive» (seen twice in #959)

## Session: fallback code review with MiniMax (#1007)

- [x] Workflow: review when Copilot reports an error, by hand, and when Copilot stays silent after CI (green or red) or after ready for review; once per pull request; drafts skipped
- [x] Workflow: lock files out of the diff, cut off over 400 kB with a note, review in English, one review comment
- [x] Workflow: MiniMax failure turns the run red and comments "No review: <reason>"
- [x] Skill `pull-request`: wait for a review after CI, answer it like Copilot's, merge after 15 minutes without one
- [x] Local runs against real pull requests (error, silent, real Copilot review, draft, failure)
- [x] Files: `.github/workflows/fallback-review.yml`, `.claude/skills/pull-request/SKILL.md`; local runs found a made-up tool call and a "missing file" behind the cut, both answered in the prompt (tool call: second try, then «No review»)
- [x] Slice review round 1: `docs/reviews/1007-review-1.md`
- [x] Its Minors fixed: reason when the answer stays empty, Copilot waited for 5 minutes, concurrency on the job, diff per file (GitHub refuses large diffs)
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-1007.md`
- [x] PR: pushed after this archive

## Session: #1003 new PDF after a part payment asks for the open amount

- [x] @wip scenario «Ein neues PDF nach einer Teilzahlung verlangt den offenen Betrag» and pg test, seen red
- [x] fach-reviewer step 1 `docs/reviews/1003-fachreview-1.md`: decided by recommendation (product owner 01.11.2026) and recorded in #1003; V-3 to #1015, V-4 to #1016
- [x] PDF: box, request, «Betrag der Abrechnung … – Bereits bezahlt …», QR code, receipt, payment part and payment info with the open amount; part refund; corrected statement (V-5, V-9); glossary rows (V-8)
- [x] code-reviewer `docs/reviews/1003-review-1.md`: C-1 (Major) and C-2 tests added, seen red; closing round `1003b-review-1.md`
- [x] Persona `docs/design/personas/weber-1003.md`: four Minors, stay in the report (P-1 is the decided cost table)
- [x] daten-pruefer `docs/reviews/1003-datenpruefung-1.md`: no findings, QR payload decoded with 35.80

## Session: fallback review without Copilot triggers (#1007 follow-up)

- [x] Runs triggered by Copilot's review wait for an approval no setting gives and expire (#1009, run 41256102317): `pull_request_review` and `issue_comment` triggers removed; an error review of Copilot still counts as no review when CI finishes
- [x] Local run of the bash step: #1009 and #941 already reviewed, missing key → «No review»
- [x] PR: pushed after this archive

## Session: #994 glossary row «PDF vor der Änderung» (Option 1)

- [x] `UBIQUITOUS_LANGUAGE.md`: row «PDF vor der Änderung» as decided, the row «Dokument» names it; `docs/design/i18n-begriffe.md` fr/it/en; marker in `delivery.ts` removed
- [x] No scenario: glossary and a code comment only, the UI texts already use the terms in all four languages
- [x] PR: pushed after this archive

## Session: NFR issues on my own (#671 first)

- [x] #671 part 1: new-tab links send no Referer (`Button.svelte`, `ui-button.dom.test.ts` seen red)
- [x] #671 part 2: @wip scenario seen red; `fach-reviewer` (`docs/reviews/671-fachreview-1.md`): V-1 wording «rappels suivants» taken, V-2 English gap taken; Stand stays (no content change)
- [x] fr and en texts of `privacy_mail_smtp`, `privacy_mail_resend`, `privacy_mail_smtp_provider`; scenario green without @wip, privacy.feature 37 passed
- [x] Slice review (`docs/reviews/671-review-1.md`): C-1 smtp/resend variants now in `privacy-i18n.dom.test.ts` (red with the old texts), C-2 scenario title
- [x] #671 PR: pushed
- [x] #847: a 413 shows «Die Datei ist zu gross.» and what to do in four languages (`error-page.test.ts` seen red); No scenario: with JavaScript the browser refuses the file first (tests/e2e/CLAUDE.md, No scenario, item 4)
- [x] #847 review (`docs/reviews/847-review-1.md`): no findings
- [x] #847 PR: pushed
- [x] #713: PreToolUse hook `main-push-guard.mjs` asks before a push whose resolved target is main; tests red first
- [x] #713 reviews: `docs/reviews/713-review-1.md` (C-1 Major: cd not followed, fixed; C-2 to C-5 fixed), `713-review-2.md` (C-6 to C-8 Minor, fixed), `713-review-3.md` (closing round, C-9 to C-11 Minor, fixed without a further round)
- [x] #713 PR: pushed
- [x] #713 Copilot review on #1011 (six findings, all held, fixed with tests red first); closing rounds `713-review-4.md` (C-12 to C-15), `713-review-5.md` (C-16), `713-review-6.md` (C-17, C-18), all Minor and fixed; the last fixes without a further round (three rounds reached)
- [x] #724: cause found (cold import in the first test against the old 5 s timeout, removed by #849); three full server runs green; issue closed with the evidence, no code change
- [x] #728: footer shows «Version unbekannt» in four languages when the build has no version (`src/lib/app-version.ts`, `shell.dom.test.ts` seen red); No scenario: the E2E app is always a build with a version
- [x] #728 review (`docs/reviews/728-review-1.md`): no findings
- [x] #728 PR: pushed
- [x] #710: one matcher for the commit gates and the main push guard (`.claude/hooks/git-calls.mjs`): -C (quoted, -C/x), -c key=val, cd and subshells, heredoc text skipped; ten gate tests seen red first
- [x] #710 review `docs/reviews/710-review-1.md`: C-1 Major (shell keywords before git), C-2 to C-4 Minor, fixed with tests seen red (C-3 documented)
- [x] #710 re-review `docs/reviews/710-review-2.md` (closing round): C-1 to C-4 closed; C-5 Minor (crash tests only for the deepcheck gate) stays in the report
- [x] #710 Copilot review on #1017 (four findings, all held, fixed with tests red first); closing round `docs/reviews/710-review-3.md`: C-6 to C-8 Minor fixed without a further round (three rounds reached), C-5 stays in the report
- [x] #661: scenario outline «Bereich über das Menü im schmalen Fenster öffnen» (13 areas, the same targets as the sidebar) pins existing behaviour, so no red run; navigation.feature 51 passed
- [x] #661 review `docs/reviews/661-review-1.md` (closing round): C-1 formatting slip and C-2 duplicate target, both Minor, fixed (13 scenarios green again)
- [x] #750: recording already covered by `trace: retain-on-failure` (#849); issue commented, left open for the cause at the next failure
- [x] #739 deferred: naming the Heizprofil changes scenarios that are not @wip, which needs a product-owner decision (Blocked on me)
- [x] Workflow notes `docs/reviews/workflow-notes-issue-710.md`; collected review `docs/reviews/workflow-rules-review-2026-11-01.md`
- [x] #661 PR: pushed after this archive
- Deferred (need thresholds first): #748 tenant export streaming, #746 Protokoll paging («once the length is felt»)

## Session: #1015 resetting a part payment drops its PDF

- [x] pg tests in `statement-lock.pg.test.ts`, seen red; fix in `recordPayment` and `resetPayment`
- [x] No scenario: the UI cannot reset a part payment yet (#999); two tried scenarios failed at the missing button
- [x] code-reviewer `docs/reviews/1015-review-1.md`: C-1 test added (seen red); C-2 (reachable with #999 only) and C-3 (database not on UTC) stay in the report
- [x] PR: pushed after this archive

## Session: #1016 a part payment makes the waiting new PDF anew

- [x] pg test in `statement-mail.pg.test.ts` seen red; fix in the payment route (`keepNewPdf` after a part payment)
- [x] code-reviewer `docs/reviews/1016-review-1.md`: C-1 scenario «Nach einer Teilzahlung verlangt das bereitliegende neue PDF den offenen Betrag» (seen red), C-2 the pg test reads the PDF text; re-review `1016b-review-1.md`
- [x] PR: pushed after this archive

## Session: #546 the hint to correct names the recalculated Saldo

- [x] @wip scenario and pg test seen red; fach-reviewer step 1 `docs/reviews/546-fachreview-1.md`: V-1 to V-5 taken, M-1 to #1023 (needs-decision)
- [x] Backend `recalculated` (Saldo, difference, below CHF 5, cost sentence), BFF mapper, `recalculatedText`, 11 texts in four languages; unit tests and scenario seen red
- [x] code-reviewer `docs/reviews/546-review-1.md`: C-1 (Major) and C-2 tests seen red, C-3 done; closing round `546b-review-1.md`
- [x] Persona `docs/design/personas/weber-546.md`: amounts plausible; P-1, P-2 (Minor) stay in the report (P-2 is the open point the issue left as is)
- [x] PR: pushed after this archive

## Session: Copilot's refusal is no outside review (#1007 follow-up)

- [x] #1024 was merged a minute after CI, 15 seconds before its fallback review, after Copilot's «unable to review … quota»: skill `pull-request` says such a refusal is not a review and the session waits for the fallback
- [x] PR: pushed after this archive

## Session: #521 letter for the tenants' consent to a new Abrechnungsperiode

- [x] @wip scenario seen red; fach-reviewer step 1 `docs/reviews/521-fachreview-1.md`: V-1 to V-6, M-1, M-2 taken; glossary term to #1035 (needs-decision)
- [x] Backend letter PDF (`consent-letter.ts`, `consent-letter.service.ts`, `consentPeriod`), route, `consent` flags, links on the contract page and in wizard step 2; three scenarios green without @wip
- [x] code-reviewer `docs/reviews/521-review-1.md`: C-1 (Major) refusal as a page, C-2 to C-5 fixed; re-review `521b-review-1.md`: C-1 file-name step, C-3 code CONTRACT_NOT_FOUND fixed, C-2 stays (way back of the refusal page, noted in #734)
- [x] fach-reviewer step 5 `docs/reviews/521-fachreview-2.md`: V-7 to V-9 fixed, V-10 to #1036 (needs-decision)
- [x] Persona `docs/design/personas/helga-521.md`: P-3 fixed; P-1 (Major), P-2 to #1036; P-4 to P-7 stay in the report
- [x] daten-pruefer `docs/reviews/521-datenpruefung-1.md`: no findings
- [x] Workflow note: `docs/reviews/workflow-notes-issue-521.md`

## Session: NFR issues on my own, part 2 (#742 first)

- [x] #742: the status line of «Rechnungen hochladen» says how many invoices are ready to create; @wip scenario seen red (received «Bitte prüfen: 1.»)
- [x] #742: text «Bereit zum Erstellen» in de, fr, it, en (`InvoiceUploadDialog.svelte`, `messages/*.json`, two DOM expectations); scenario green without @wip; invoices + ki-einstellungen 59 passed; axe and language rows of the five upload screens 10 passed
- [x] #742 slice review: no Blocker/Major, Minor C-1 stays in `docs/reviews/742-review-1.md` (needs a PO decision on the exact status text)
- [x] #742 persona Sven (screen reader) on the upload dialog: P-1 to P-3 Minor, not trivial (status wording needs decisions), stay in `docs/design/personas/sven-742.md`
- [x] #742 PR #1027 merged (2e7e7e892); Copilot out of quota, fallback review: no issues
- [x] #683: @wip scenario «Begründung der Umlagefähigkeit beim Bearbeiten einer vordefinierten Kategorie» seen red at the missing label, then at the missing description; green without @wip; categories.feature 28 passed, axe and language rows 12 passed
- [x] #683 slice review: `docs/reviews/683-review-1.md`, Minor C-1 fixed (DOM test for `describedby`, seen red)
- [x] #683 personas Helga and Sven: `docs/design/personas/{helga,sven}-683.md`; Sven P-1 (Major, from the #186 rule) tracked in #1029 on the product owner's decision to merge as built; the rest of #683 split into #1028
- [x] #683 closing round: `docs/reviews/683-review-2.md`, no Blocker/Major; C-1 rest (label only in the scenario) stays in the report
- [x] #683 PR #1030 merged (b6b80a5cd); fallback review Low finding answered (stays, goes with #1029)
- [x] #681: scenarios «Nach dem Zurücksetzen der Filter …», «Nach dem Zurückgehen im Browser …» (apartments) and «Leere Rechnungssuche setzt die Filter zurück» (invoices) seen red; unit test for `isListNavigation` seen red; apartments + invoices 51 passed, axe and language rows 28 passed
- [x] #681 slice review: `docs/reviews/681-review-1.md`, Major C-1 (back scenario could not fail) fixed, seen red without popstate; round 2 `681-review-2.md` closes it
- [x] #681 persona Sven: `docs/design/personas/sven-681.md`, P-1 and P-2 Minor (need new texts), stay in the report
- [x] #681 PR: pushed after this archive
- [x] Workflow notes `docs/reviews/workflow-notes-nfr-part-2.md`, collected review `workflow-rules-review-2026-11-01-2.md`

## Session: structure report (Structure101-style, A/I graph, traffic lights)

Request from the product owner (chat, 1.11.2026): build the structure report as a tool in the repo, show the results with the full Git history, add an Abstractness/Instability graph and scores with a traffic-light system. No scenario: developer tooling, nothing a landlord sees. Parallel session (the #742 session opened on `main` meanwhile): checklist also in the pull request.

- [x] `tools/arch-baseline/structure.ts` with tests: Lakos levels from module edges and cycles
- [x] Abstractness per module (exported types and interfaces / all exports), instability, distance from the main sequence
- [x] Traffic lights per module (distance, complexity findings, hotspot) and per KPI (tangles, health score, duplication, maintainability)
- [x] HTML report: KPI tiles, DSM with back-edges red, A/I graph, module table worst first
- [x] `bun run structure:report` (01-map, 02-imports, fallow health without cache, structure.ts), docs in `docs/architecture/fitness-functions.md`
- [x] code-reviewer round 1: `docs/reviews/structure-report-review-1.md`; closing round: `docs/reviews/structure-report-review-2.md`
- [x] Workflow note: `docs/reviews/workflow-notes-structure-report.md`; issue #1032 (fallow churn cache after unshallow)
- [x] Results with full history to the product owner (chat)

## Session: #508 the statement run names the heating sum of an apartment

- [x] @wip scenario seen red; fach-reviewer step 1 `docs/reviews/508-fachreview-1.md`: M-1 (vacancy), V-1, V-3 to V-6 taken; V-2 to #1026 (needs-decision)
- [x] Backend `heatingSums` on GET /statements/run-heating, BFF mapper, `heatingSumText`, six texts in four languages; pg, unit and text tests seen red
- [x] code-reviewer `docs/reviews/508-review-1.md`: C-1 to C-5 fixed (C-1 contract `statement-run-heating-sum.json`, C-2 and C-5 tests seen red); re-review `508b-review-1.md`: C-6 (two distribution keys) fixed, test seen red; round 3 `508c-review-1.md`
- [x] daten-pruefer `docs/reviews/508-datenpruefung-1.md`: every amount holds to the Rappen
- [x] Persona `docs/design/personas/dr-weber-508.md`: P-1 (Major, no advice at «zu wenig») to #1026; P-2 to P-5 (Minor) stay in the report
- [x] PR: pushed after this archive


## Session: structure report history and English report

Request from the product owner (chat, 1.11.2026): history of the structure report, retroactive (one snapshot per day with commits on `main`, whole history from 23.1.2026; a pause April to late September shows as a gap on a time axis) and ongoing (CI on every push to `main`); the report in English. No scenario: developer tooling, nothing a landlord sees.

- [x] Report texts in English
- [x] Snapshot summary per commit (KPIs, module lights, functions over the thresholds, I and A per module)
- [x] `tools/arch-baseline/structure-history.sh`: last first-parent commit of each day with commits of `main` and HEAD, measured with today's tools and fallow config (`ARCH_ROOT`), cached per commit
- [x] History section: one chart per measure, modules whose distance D changed most
- [x] CI workflow on push to `main`: cache of snapshots, report as artifact, trend table in the job summary
- [x] code-reviewer round 1: `docs/reviews/structure-history-review-1.md` (C-1 Major cache keyed by commit only, C-2 Minor same-day order: fixed)
- [x] code-reviewer round 2: `docs/reviews/structure-history-review-2.md` (C-1, C-2 closed; Minors C-3 script in the cache fingerprint, C-4 comment: fixed)
- [x] Results to the product owner (chat, page updated)
- [x] code-reviewer closing round: `docs/reviews/structure-history-review-3.md` (no findings)
- [x] Workflow note: none new (stop hook as in `workflow-notes-architecture-phase-2.md`)

## Session: fallback review thinks harder (#1007 follow-up)

- [x] MiniMax with `reasoning_effort: medium` gave mostly false or known findings (#1021 to #1033); `high` run locally on #1024, #1031, #1033 dropped the false ones in about two minutes each: `REASONING_EFFORT: high`
- [x] PR: pushed after this archive


## Session: structure report like Structure101 (XS, drill-down DSM, tests and change coupling)

Request from the product owner (chat, 1.11.2026): add what the report misses compared with Structure101 and in quantitative quality: an XS value (fat and tangles) with traffic light and history, a DSM that opens to files and to the imports behind a cell, and per module the test reach and the change coupling without import. No scenario: developer tooling, nothing a landlord sees. Test reach is fallow's static estimate (a test imports the file), not line coverage: that needs the test suites with PostgreSQL.

- [x] XS: share of production lines in excess (tangled modules, fat modules, files and functions), KPI with light, module light "fat"
- [x] Test reach per module (fallow `--coverage-gaps`), KPI and module light
- [x] Hidden change coupling (file pairs changed together, modules without import), KPI and module light
- [x] DSM drill-down: module details with files and the imports behind each cell
- [x] History: XS chart; snapshots and CI measure coverage gaps too
- [x] Hidden coupling leaves out pairs in one folder: SvelteKit's page and load function change together without import (16 of 49 pairs)
- [x] code-reviewer round 1: `docs/reviews/structure-s101-review-1.md` (C-1 Major: folder rule only for route folders, C-2 empty gaps file, C-3 Ce test: fixed; C-4 Minor, no test for the inline script that opens details: stays in the report)
- [x] code-reviewer round 2: `docs/reviews/structure-s101-review-2.md` (C-1 to C-3 closed, no new finding; C-4 stays)
- [x] Fallback review on #1045: missing coverage gaps showed green (fixed, n/a), drill-down table counts code files only (fixed, header); fat light without functions and no DOM test for the inline script: answered on the pull request
- [x] code-reviewer round 3 (closing): `docs/reviews/structure-s101-review-3.md` (no new finding)
- [x] Workflow note: none new

## Session: #496 export of all data

- [x] @wip scenarios seen red, draft `docs/reviews/496-entwurf.md`; fach-reviewer step 1 `docs/reviews/496-fachreview-1.md`: V-1, V-2 (Major), R-1 (no privacy change, «Stand» stays) and the Minors taken; glossary terms to #1039 (needs-decision)
- [x] Backend export service and route, BFF CSV and ZIP, control under Einstellungen, Protokoll entry; nine scenarios green without @wip
- [x] code-reviewer `docs/reviews/496-review-1.md` (Minors fixed), re-review `496b-review-1.md` (C-1, C-3 fixed; C-2 rejected, accepted by the fach-reviewer), `496c-review-1.md` (C-1, C-2 fixed; C-3 stays), closing round `496d-review-1.md`
- [x] fach-reviewer step 5 `docs/reviews/496-fachreview-2.md` (V-11 Major fixed), `-3.md`, `-4.md`: all wording taken
- [x] Persona `docs/design/personas/helga-496.md` (P-1 Major fixed), re-run `helga-496b.md` (P-1 to P-3 Minor fixed)
- [x] daten-pruefer `docs/reviews/496-datenpruefung-1.md`: amounts and QR-bills right; D-1, D-2 Minor stay
- [x] Workflow note: `docs/reviews/workflow-notes-issue-496.md`
- [x] PR: pushed after this archive

## Session: #679 list filter and stale pages after deleting a draft

- [x] Scenarios `@wip` in `statements.feature`, both seen red at the missing behaviour (filter gone after delete; back shows the deleted draft from the browser cache)
- [x] Delete returns to the list with the filter it was opened from (`list` field, only `/statements?…`; unit tests seen red, the guard ones by taking the check out)
- [x] Every page answers `Cache-Control: no-store` (`src/hooks.server.ts`, unit test seen red)
- [x] E2E: the affected feature files (statements, statement-detail, navigation, authentication, apartments, invoices; chromium + api: 267 passed); the full run with every axe row was too slow next to the personas and is left to CI
- [x] Slice review round 1: `docs/reviews/679-review-1.md` (C-1 Minor fixed: return on page 1)
- [x] Persona review: `docs/design/personas/sven-679.md`, `weber-679.md` (both P-1 Minor in the same place: issue #1047)
- [x] Workflow note: `docs/design/personas/README.md` («Who saves») names `demo-records.md`, which does not exist; the demo records are in `backend/demo/demo-data.sql` and `backend/src/db/demo-data.ts` (in `docs/reviews/workflow-notes-issue-679.md`)
- [x] Closing `code-reviewer` round: `docs/reviews/679-review-2.md` (no findings)
- [x] Archive, PR: pushed after this archive

## Session: #999 take back a part payment and name it in the Verlauf

- [x] @wip scenarios seen red, draft `docs/reviews/999-entwurf.md`; fach-reviewer step 1 `docs/reviews/999-fachreview-1.md`: V-1 (Major) decided by the product owner (option A, spec change of «Zahlung zurücksetzen» approved in #999), M-1 decided (final payment with amount), V-2 to V-5 taken
- [x] Backend reset keeps `part` and the audit amount; reset button on sent and overdue statements with a payment; Verlauf rows per payment and reset; texts in four languages from the review's table; scenarios green without @wip
- [x] code-reviewer `docs/reviews/999-review-1.md` (C-1 Major fixed, C-2, C-4 fixed, C-3 rejected after 999b: it changed the text M-1 decided), `999b-review-1.md` (C-1, C-3, C-4 fixed), closing round `999c-review-1.md`
- [x] Persona `docs/design/personas/helga-999.md`: P-1 (order of the Verlauf) stays (resets hold dates only), P-2, P-3 stay
- [x] daten-pruefer `docs/reviews/999-datenpruefung-1.md`: D-1 (Major, PDF kept after the second reset) fixed with pg test and scenario; D-2 = P-1
- [x] PR: pushed after this archive

## Session: XS ratchet in the fitness checks (request in chat, follow-up to #1045)

- [x] Issues (`nfr:maintainability`): #1052 fat files and modules, #1053 hidden coupling pairs
- [x] Check `fat` in `tools/fitness/fitness.ts`: no new file over 400 lines, no new code module over 30 files or 15 module dependencies, listed ones may not grow; composition roots listed with a reason (tests first)
- [x] `ratchet.json`: today's fat files, modules and roots; `docs/architecture/fitness-functions.md` row
- [x] code-reviewer: `docs/reviews/xs-ratchet-review-1.md` (C-1 Major: a removed `fat` list switched the check off, fixed; C-2 Minor: `fatItems` untested, fixed), `-2.md` (both closed, nothing new)
- [x] Workflow note: none new (the stop hook asked to push during the review again, as in `workflow-notes-structure-report.md`)
- [x] Archive the session; PR pushed after this archive

## Session: #691 cut-off cost table on the statement edit page

- [x] Reproduced at 1440 × 900 (persona stack, demo data): the table needs 1010 px, the edit page's panel gives 716 px; «Zeitanteil» is cut, the scroll bar sits below the whole table. The detail page is 22 px short too, but its mid widths are #658 (`needs-decision`), so it stays as is
- [x] Scenario in `statement-edit.feature` seen red (203 px hidden sideways), then green: the edit page shows the lines one below the other at every width (`CostTable` `stacked`), as phones already do
- [x] E2E: `statement-edit.feature`, `statement-detail.feature` (132 passed), axe and language rows of `statement-edit` (4 passed); unit tests on changed files (322 passed)
- [x] Slice review round 1: `docs/reviews/691-review-1.md` (C-1, C-2 Minor fixed; the DOM test seen red without `stacked`)
- [x] Persona review: `docs/design/personas/anna-691.md` (task done; P-1, P-2 Minor, both on the base already, stay in the report; the detail page observation added to #658)
- [x] Closing `code-reviewer` round: `docs/reviews/691-review-2.md`
- [x] Workflow notes: nothing came up
- [x] Archive, PR: pushed after this archive

## Session: dependency direction check, A/I in the report (request in chat, follow-up to #1054)

- [x] Structure report: dependencies against stability (Stable Dependencies Principle, I gap > 0.2) per module and as KPI; distance D out of the overall light; the A/I section says why A says little for modules that export functions (tests first)
- [x] Fitness check `unstable-dependency` (issue #1055) with today's 4 listed (reason each), shrink-only; docs row
- [x] code-reviewer: `docs/reviews/sdp-review-1.md` (no Blocker/Major; C-1 to C-3 Minor fixed: comment order, tighten keeps a measured entry, message names a new dependency as possible cause), `-2.md` (closing round, all closed)
- [x] Fallback review on #1056: the gap was rounded before the comparison (fixed, test seen red); `docs/reviews/sdp-review-3.md` (closing round, nothing new)
- [x] Workflow note: none new
- [x] Archive the session; PR pushed after this archive

## Session: fallback review sees the changed files whole (#1007 follow-up)

- [x] Evaluation of the high reviews (7 reviews, 13 findings: 5 fixed, 4 known, 1 declined, 3 false); two false ones came from code outside the diff (#1045, #1049)
- [x] The changed files at the head commit go along with the diff (up to 200 kB); run locally: #1049's false «two buttons» finding gone, #1045's design question stays; about 1½ minutes each
- [x] PR: pushed after this archive

## Session: #1002 «Diesen Monat bezahlt» by the day of each payment

- [x] pg test in `dashboard.pg.test.ts` seen red (300 instead of 250), then green: `paidThisMonth` sums each recorded payment by its day, part payments included (domain review 959-1, rule 4); a statement paid before #959 (no `payments`) counts as before; `docs/api-specification.md` names it
- [x] No scenario: no page shows `paidThisMonth` (only `src/routes/dashboard/+page.server.ts` types it)
- [x] Slice review round 1: `docs/reviews/1002-review-1.md` (no findings)
- [x] Data check: `docs/reviews/1002-datenpruefung-1.md` (no findings; eight cases recomputed from `dwello_persona`, API equal to the Rappen)
- [x] Workflow note: a `daten-pruefer` round for an amount no screen, PDF or QR-bill shows (`docs/reviews/workflow-notes-issue-1002.md`)
- [x] Archive, PR: pushed after this archive

## Session: #1001 each part payment in the tenant's export

- [x] pg test in `tenant-export.pg.test.ts` seen red, then green: each statement of the export lists `payments` as `{ date, amount }` (domain review 959-1, V-5); `docs/api-specification.md` names it
- [x] No scenario: the export is a file the existing export scenario covers (the issue says so)
- [x] Slice review round 1: `docs/reviews/1001-review-1.md` (no findings)
- [x] Domain review (step 5): `docs/reviews/1001-fachreview-1.md` (Minor V-1, a statement paid before #959: fixed, the tenant export gives that payment as the data export does)
- [x] Closing review: `docs/reviews/1001b-review-1.md` (no findings)
- [x] Workflow note: the same as #1000 (no step-1 `fach-reviewer` round for a rule a domain review already decided), in `docs/reviews/workflow-notes-issue-1000.md`
- [x] Archive, PR: pushed after this archive

## Session: #1000 2nd and 3rd Mahnung after a part payment

- [x] Unit test in `reminder-letter.test.ts` seen red (8 cases: levels 2 and 3 in de, fr, it, en), then green: after a part payment the 2nd and 3rd Mahnung say «noch nicht vollständig bezahlt», texts of M-1 in `docs/reviews/959-fachreview-1.md` word for word; level 1 and letters without a part stay
- [x] No scenario: the letter text is pinned at the lowest layer (the issue says so)
- [x] Slice review round 1: `docs/reviews/1000-review-1.md` (C-1 Minor: the control test pins kept behaviour, named in the pull request)
- [x] Data check: `docs/reviews/1000-datenpruefung-1.md` (no findings; 53 PDFs, opening, amounts and QR amount per level and language)
- [x] Domain review (step 5, asked by the fallback review of PR #1061): `docs/reviews/1000-fachreview-1.md` (no Blocker/Major; Minor V-1, fr/it «rappel de paiement»/«promemoria di pagamento» in the level-2 text, stays in its report: the issue decided the M-1 texts)
- [x] Workflow note: no step-1 `fach-reviewer` round for texts a domain review already gives word for word (`docs/reviews/workflow-notes-issue-1000.md`)
- [x] Archive, PR: pushed after this archive

## Session: #1057 sending dated back across summer time

Cause: `documents.sent_at` is `timestamp` without zone (UTC), but `e2e-sent-days-ago.ts` (#1004) and its test treat it as `timestamptz`: in the late evening the shown time lands on the next day.

- [x] Test on the real column type (`timestamp`, UTC), seen red
- [x] Script converts UTC → Zurich, moves Swiss days back, converts back
- [x] Affected E2E scenario green (statement-redeliver, 4 passed)
- [x] Code review: `docs/reviews/1057-review-1.md` (no findings; covers all code, so no closing round)
- [x] Checks: lint, check, type-check, backend test, Prettier
- [x] Workflow note: `docs/reviews/workflow-notes-issue-1057.md`
- [x] Archive, PR: pushed after this archive

## Session: stability and changes instead of the A/I graph (request in chat, follow-up to #1056)

- [x] Structure report: graph «Stability and changes» (I over the commits of a module's most-changed file in fallow's hotspot window) with the zone stable and changing often; light per module (I ≤ 0.3 and Ca ≥ 5: green up to 12 changes, yellow up to 25, else red); A, D, the A/I graph and the D history table removed (tests first)
- [x] Docs: report bullet and fitness row without A/D
- [x] code-reviewer: `docs/reviews/change-graph-review-1.md` (no Blocker/Major; C-1 unused `--band`, C-2 zone text and tooltip without Ca: fixed), `-2.md` (closing round, both closed)
- [x] Workflow note: none new
- [x] Archive the session; PR pushed after this archive, once #1056 is merged

## Session: #1047 no deleted statement in the history

- [x] @wip scenario «Nach dem Löschen eines Entwurfs führt Zurück im Browser nicht auf den Entwurf», seen red (address of the deleted statement after back)
- [x] Delete redirect replaces the history entry in `dialogSubmit` (all its redirects are deletes: statement, tenant, contract), DOM test red first
- [x] Scenario green without @wip; statements, statement-detail, tenants, contract-detail, contracts: 227 passed (after C-2)
- [x] Code review: `docs/reviews/1047-review-1.md` (C-1 replace only for deletes, C-2 @wip left: fixed); `docs/reviews/1047-review-2.md` (closing round: C-1, C-2 closed; Minor C-3 untested ActionDialog flag: test added, red without it)
- [x] Persona: `docs/design/personas/sven-1047.md` (no 404 any more; P-1 Minor: back shows the same list silently, stays in its report)
- [x] Checks: lint, check, type-check, tests --changed, Prettier
- [x] Archive, PR: pushed after this archive

## Session: #736 undelivered reminder e-mail: address and links

- [x] @wip scenarios in `statement-reminder.feature` (address in «Dokumente», no «Dokumente» there; ways to the tenant, from the feedback and from the tenant page to «Dokumente»), seen red
- [x] Backend: a reminder by e-mail keeps its `recipient`; a letter posted after it has none (pg tests red first)
- [x] `DeliveryFailure.svelte` in «Dokumente», tenant page and reminder feedback; texts without «unter «Dokumente»» in de/fr/it/en (DOM tests red first)
- [x] a11y/language: «Dokumente» default shows the row; new screens `tenant-detail-undelivered`, `statement-detail-undelivered` (default: its reminder list; `reminder-undelivered`: the feedback, each look reminds another of 9 overdue statements seeded for that state); list screens 114 passed
- [x] Scenarios green without @wip: statement-reminder, documents, tenant-detail 36 passed; axe/language rows of the touched screens 62 passed
- [x] Code review: `docs/reviews/736-review-1.md` (C-1 statement page row: added; C-3, C-4 Minor: tests added); `docs/reviews/736-review-2.md` (C-2 feedback row: added, one overdue statement per look; C-5 scenario for P-1: added); `docs/reviews/736-review-3.md` (closing round: all closed)
- [x] Persona: `docs/design/personas/helga-736.md` (P-1 Major, «Mahnung senden» offered while the last one waits: fixed, button hidden; P-2 to P-6 Minor stay in the report)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-736.md`
- [x] Archive, PR: pushed after this archive
- [x] Fallback review of PR #1067 (contract of the undelivered reminder answer): `tests/contracts/reminder-undelivered.json`; closing round `docs/reviews/736c-review-1.md` (no findings)

## Session: #1065 «rappel de paiement» / «promemoria di pagamento» after a part payment

- [x] Unit test rows in `reminder-letter.test.ts` (level 2, fr and it) seen red, then green: the texts of the decision in #1065 (domain review 1000-1, V-1)
- [x] No scenario: the letter text is pinned at the lowest layer, as in #1000
- [x] Slice review round 1, also the closing round: `docs/reviews/1065-review-1.md` (no findings)
- [x] No `fach-reviewer` round: the texts are its own (1000-fachreview-1, V-1), read in all four languages
- [x] Archive, PR: pushed after this archive

## Session: #1026 advice after the heating sum in the preview

- [x] Scenarios in `statement-generate.feature`: «zu viel», «zu wenig» and the advice to enter the Leistungszeitraum first, seen red, then green; the #451 sentence replaced (Spec change approved: #1026)
- [x] Domain review of the scenarios: `docs/reviews/1026-fachreview-1.md` (V-1 Blocker fixed: Heizöl with a Leistungszeitraum over the whole year in the new scenarios; V-2 decided by the PO on 02.11.2026, the sentence names the tenant; V-3 fixed)
- [x] Unit tests in `statement-heating-sum.test.ts` and the BFF test in `statement-generation.test.ts` seen red, then green
- [x] No persona: the texts are the PO's and the domain review's, read in all four languages
- [x] Slice review round 1, also the closing round: `docs/reviews/1026-review-1.md` (no findings)
- [x] CI fix (fitness Ä1, `statement-wizard.ts` over 400 lines): the heating sum moved to `src/lib/heating-sum.ts`; closing round `docs/reviews/1026b-review-1.md` (no findings)
- [x] Archive, PR: pushed after this archive

## Session: #1023 «Nicht berichtigen» compares the raw Saldos, below CHF 5 too

- [x] Scenario «Sinkt ein Saldo unter CHF 5 weiter, bietet die Abrechnung «Nicht berichtigen» nicht an» (`statement-minimum-balance.feature`), seen red, then green
- [x] Domain review of the scenario: `docs/reviews/1023-fachreview-1.md` (V-1 Major fixed: the pg test of V-30 A reversed; V-2, V-3 and M-1 fixed, M-1 with a pin test seen red)
- [x] pg tests in `statement-invoices.pg.test.ts` seen red, then green
- [x] Slice review round 1, also the closing round: `docs/reviews/1023-review-1.md` (C-1 Minor fixed: JSDoc)
- [x] Archive, PR: pushed after this archive

## Session: #1046 red main run, a Firefox click that missed its target

- [x] Cause from the trace of run 41327289095: the click on «Dokument hochladen» right after filling the title field sent no request and left the field focused; reproduced in plain Firefox (7 of 600 clicks after a fill below the fold missed; with the target scrolled into view first, 0 of 600)
- [x] Fix: `Click.on` scrolls its target into view before clicking (`tests/e2e/screenplay/interactions.ts`)
- [x] No scenario: a fix of the E2E harness; the scenario that failed is the test (Firefox ×5 green)
- [x] Slice review round 1, also the closing round: `docs/reviews/1046-review-1.md` (no findings)
- [x] Archive, PR: pushed after this archive

## Session: #1039, #1035 glossary rows (export of all data, data file, export of a tenant, consent letter)

- [x] Rows in `UBIQUITOUS_LANGUAGE.md` and `docs/design/i18n-begriffe.md` as the product owner decided on 02.11.2026; the TODO markers naming #1039 and #1035 removed
- [x] No scenario: glossary and code comments only; the help texts already use the terms in all four languages
- [x] Slice review round 1, also the closing round: `docs/reviews/1039-review-1.md` (C-1 Minor, fixed: issue references in brackets, as in the two-column table)
- [x] Archive, PR: pushed after this archive

## Session: #738 statement wizard step «Gebäude»

- [x] Scenarios (`statement-generate.feature`): failed invoice count, failed existing-statements check, name and description of a building's choice, 390 px, focus on the step when resumed; seen red (390 px: red only at the missing test id, the overflow does not reproduce; it pins kept behaviour)
- [x] A failed state per count (`BuildingStep.svelte`, `statements_buildings_invoices_failed`, `statements_buildings_billed_failed` in de/fr/it/en)
- [x] Checkbox named by building and address, counts and apartments as description; «1 Wohnung» singular (`BuildingChoice.svelte`)
- [x] Focus on the step heading when the wizard opens in a later step (`StatementWizard.svelte`)
- [x] a11y and language rows: state `buildings-counts-failed`
- [x] Code review round 1: `docs/reviews/738-review-1.md`
- [x] Persona round 1: `docs/design/personas/sven-738.md`, `docs/design/personas/marco-738.md`
- [x] Code review round 2 (closing round): `docs/reviews/738-review-2.md`
- [x] Workflow note: `docs/reviews/workflow-notes-issue-738.md`
- [x] Issue for the Minor two personas met (Marco P-3, Sven P-4): #1068
- [x] PR: pushed after this archive

## Session: #1071 red main run, the building card measured in Firefox

- [x] Product-owner decision recorded in #1071 (2026-11-03): the step «zeigt die Wahl das Gebäude {string} ganz» measures by bounding rectangles
- [x] `ReachingOut` (`tests/e2e/screenplay/questions.ts`): how far a part or a text line of the card reaches beyond it, and the card beyond the window; seen red in Chromium with a part 600 px wide (310 px)
- [x] No scenario: a fix of a step definition; the scenario that failed, «Die Wahl der Gebäude passt in ein schmales Fenster», is the test
- [x] Slice review round 1, also the closing round: `docs/reviews/1071-review-1.md` (C-1 fixed: text lines measured too, seen red with a nowrap address)
- [x] Slice review round 2: `docs/reviews/1071-review-2.md`
- [x] Archive, PR: pushed after this archive

## Session: #1029 consequence of switching describes the allocability question

- [x] Product-owner decision recorded in #1029 (2026-11-03): option 2, the info box's consequence describes the radio group
- [x] Scenario «Folgen des Umstellens einer vordefinierten Kategorie gehören zur Frage» (`categories.feature`), seen red at the missing description
- [x] `CategoryForm` links `category-consequence` (the edit page's info box paragraph) for predefined categories
- [x] Slice review round 1: `docs/reviews/1029-review-1.md` (C-1 Minor fixed: DOM tests in `category-predefined.dom.test.ts`)
- [x] Persona Sven: `docs/design/personas/sven-1029.md` (P-1 Major needs a product decision: #1084; P-2 to P-4 Minor stay in the report)
- [x] Closing round: `docs/reviews/1029-review-2.md` (C-2 Minor fixed: the test checks the switch took effect)
- [x] Archive, PR: pushed after this archive

## Session: #1087 red main run, a recipient address wider than the phone

- [x] Cause from the CI screenshot of run 41706105448: the sentence naming the recipient of an undelivered e-mail (#736, `DeliveryFailure.svelte`) holds `<UUID>@abgewiesen.dwello.test` without a break opportunity; Firefox showed «tenant-detail-undelivered» 560 px wide in fr, it and en
- [x] Fix: `wrap-anywhere` on that sentence (lowers its min-content width in a flex row)
- [x] No scenario: the failing language row «tenant-detail-undelivered default» covers it unchanged
- [x] Slice review round 1, also the closing round: `docs/reviews/1087-review-1.md` (no findings)
- [x] Archive, PR: pushed after this archive

## Session: #1088 Abrechnungsperiode per building, fixed; no short periods

- [x] Product-owner decisions recorded in #1088 (2026-11-03): wizard step 2 offers only fitting buildings; Fachreview 1088-1 (no short periods at all, period never changed, glossary rows, proposals, help to the Mietvertrag); Fachreview 1088-2 V-10 (statements of other periods or under a year must not occur, the backend enforces it)
- [x] `@wip` scenarios (building-new, building-edit, settings, contract-detail, dashboard, statement-generate), seen red at the missing behaviour; Fachreview step 1: `docs/reviews/1088-fachreview-1.md`
- [x] Migration 0042, field and lock at the building (`BUILDING_PERIOD_LOCKED`), `GET /buildings/new-defaults`, missing periods per building, wizard `otherPeriod`, backend refusal `STATEMENT_PERIOD_OF_BUILDING` and of overlaps with older statements; setting, consent letter (#521), change (#512) and short periods removed
- [x] Slice reviews: `docs/reviews/1088-review-1.md` (C-1 to C-6 fixed), `docs/reviews/1088-review-2.md`
- [x] Feature review: `docs/reviews/1088-fachreview-2.md` (V-10 decided, V-11 Minor stays, V-12 rejected: #1099), personas `docs/design/personas/helga-1088.md`, `weber-1088.md` (Minors stay; the one both met: #1098)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-1088.md`
- [x] Archive, PR: pushed after this archive
## Session 2026-11-03: #734 refused PDF opens the app's error page

- [x] Scenarios: decided sentence and step «liest der Liegenschaftsverwalter auf der Fehlerseite {string}» (statements, statement-detail, statement-generate, contract-detail); new: tab title and app navigation, back to the filtered list, letter's tab title and back to the contract; seen red at the missing behaviour
- [x] `pdfRefusal` redirects (303) to `/documents/refused` with the code, `view`/`letter` and the Dwello referrer; a gone statement leads back only to the list (the other pages show that statement); unit tests seen red
- [x] Page `src/routes/documents/refused` in the look of `+error.svelte`; texts in four languages; endpoint unit tests follow the redirect
- [x] lint, check, vitest (4060), E2E of the four features (319) and the rows of the three refusal screens green
- [x] code-reviewer round 1 (`docs/reviews/734-review-1.md`): C-1 open redirect fixed with a test seen red, C-2 screen row `documents-refused-settings`, C-3 tests pin the PDF title and view sentence, C-4 docs (D7c)
- [x] Personas Helga and Marco (`docs/design/personas/helga-734.md`, `marco-734.md`): no Blocker/Major; P-1 and P-2 met by both became #1094
- [x] Issue for the `proxyFile` downloads: #1093
- [x] code-reviewer round 2 (`docs/reviews/734-review-2.md`): C-1 still open (a path resolving to //x), C-5 an invalid URL threw; both fixed with test cases seen red
- [x] code-reviewer round 3 (`docs/reviews/734-review-3.md`): C-1 and C-5 closed, nothing new (closing round)
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-734.md`
- [x] PR (`Fixes #734`, `Spec change approved: #734`): pushed after this archive

## Session 2026-11-03: #1081 success toast never covers the focused content

- [x] Scenario outline «Die Erfolgsmeldung verdeckt nicht, was den Fokus hat» (zugangsschluessel.feature) at 390 × 844, 1024 × 768 and 960 × 600 (150 % of 1440 × 900), with the copy at the bottom edge of the window; seen red (the toast stood 96 px over the focused button)
- [x] `ToastRegion`: while a confirmation shows, `scroll-padding-bottom` and a spacer keep its height plus 16 px clear below the focused part, which scrolls above it; on phones it already sat at the bottom
- [x] lint, check, `vitest --changed`
- [x] Chromium E2E of categories, zugangsschluessel, tenant-documents, statement-detail (181); the full suite (1739 tests, hours locally) runs in the PR's CI
- [x] code-reviewer round 1 (`docs/reviews/1081-review-1.md`): C-1 a dialog opened while a confirmation shows sat under it on phones: scenario in categories.feature seen red (−80 px), fixed with `--toast-room` as the dialog's bottom padding; C-2 Minor stays in the report
- [x] Personas Helga (150 %, 200 %) and Marco (phone, 1024 px): `docs/design/personas/helga-1081.md`, `marco-1081.md`, no Blocker/Major
- [x] code-reviewer round 2 (`docs/reviews/1081-review-2.md`): C-1 closed, nothing new (closing round); C-2 Minor stays
- [x] Persona Minors around toasts: #1096
- [ ] Firefox and WebKit: not installed here; the all-browser CI run (workflow_dispatch) before the merge
- [x] PR (`Fixes #1081`): pushed after this archive

## Session 2026-11-04: #1089 Verlauf labels and the Italian Heizprofil choice

- [x] Verlauf (`MetadataCard.svelte`): a long entry (an e-mail address) wraps its words, never its date; dates flush right on one line. Scenario «Im Verlauf stehen die Daten bündig untereinander» (statement-send.feature, 390 px), seen red (a date on 2 lines, edges 2 px apart)
- [x] Italian Heizprofil choice at 390 px: scenario «Die Wahl des Heizprofils passt auf Italienisch aufs Telefon» (statement-generate.feature); it pins kept behaviour, the base already shows the whole name (no red run)
- [x] lint, check, Chromium E2E of statement-send, statement-generate, statement-detail (243)
- [x] code-reviewer round 1 (`docs/reviews/1089-review-1.md`): no Blocker/Major; C-2 (an empty font shorthand in Firefox measured nothing) fixed, C-1 (the select's arrow not subtracted) stays
- [x] Persona Marco (phone, `docs/design/personas/marco-1089.md`): no Blocker/Major; P-1 (a long address breaks over several lines at 390 px) needs another arrangement on phones and stays in the report (`break-words` tried: the address is longer than the label column)
- [x] code-reviewer closing round (`docs/reviews/1089-review-2.md`): C-2 closed, nothing new
- [ ] Firefox and WebKit: the all-browser CI run (workflow_dispatch) before the merge
- [x] PR (`Fixes #1089`): pushed after this archive

## Session: fallback review after CI started by hand, lock files named (#1007 follow-up)

- [x] #1101's CI was started by hand (workflow_dispatch), which carries no pull request, so the fallback skipped it: such a run on a branch other than main now finds the open pull request by its branch
- [x] Dependabot's PRs got «lock file not updated» findings (#1075, #1077, #1078, #1080) because lock files were left out silently: a changed lock file is now named in the diff without its content
- [x] Local runs: #1077 now «No issues found»; a branch without an open PR exits; the branch query returns #1101 for its branch
- [x] PR: pushed after this archive
## Session 2026-11-04: #1102 red main after #1101 (proposal scenario)

- [x] Cause: `building-new.feature` «Die Erfassung schlägt die Abrechnungsperiode der meisten Gebäude vor …» seeded no building; the proposal counts all buildings, and in Firefox a parallel scenario's July – June building won (code review 1088-5 C-10, left open in #1101)
- [x] Product owner approved the scenario change in #1102 («Decided (product owner)»): four own calendar-year buildings, then the page opened again
- [x] Reproduced: the old scenario with one extra July – June building fails with «Juli – Juni», the new one passes (temporary feature, not committed)
- [x] lint; building-new.feature in Chromium and Firefox (44)
- [ ] All-browser CI run (workflow_dispatch) before the merge
- [x] PR (`Fixes #1102`, `Spec change approved: #1102`): pushed after this archive

## Session 2026-11-04: #1098 Tankbestand help names the building's own period end

- [x] Scenario outline «Die Hilfe zum Tankbestand nennt den letzten Tag der Abrechnungsperiode des Gebäudes» (building-detail.feature), seen red at the July – June and November – October rows; the calendar row pins kept behaviour. New axe and language rows `building-detail-other-period default`
- [x] Fachreview 1098-1 before implementing (`docs/reviews/1098-fachreview-1.md`): texts correct in all four languages; V-1 (Major, the Stichtag example stayed 31.12.) fixed: the example is the next end of the building's period; Fachreview 1098-2 closed it
- [x] Help per Abrechnungsperiode (`buildings_fuel_intro_july_june`, `buildings_fuel_intro_november_october`), calendar text unchanged; DOM tests red first
- [x] code-reviewer round 1 (`docs/reviews/1098-review-1.md`): no Blocker/Major; C-1 rejected (without the fallback svelte-check fails)
- [x] Personas Helga and Dr. Weber (`docs/design/personas/helga-1098.md`, `weber-1098.md`): no Blocker/Major; P-1 of both (example and help name different years): #1103
- [x] Workflow notes `docs/reviews/workflow-notes-issue-1098.md`
- [x] lint, check, type-check, vitest, E2E building features (44) and the building-detail axe and language rows (23)
- [x] PR (`Fixes #1098`): pushed after this archive
- [x] CI fix: Architecture fitness (Ä4/AP2) refused the date rule in the frontend; the backend sends `nextPeriodEnd` on `GET /buildings/:id` (red first: unit, route and DOM tests); closing round `docs/reviews/1098-review-2.md`: nothing found

## Session 2026-11-04: #1103 one Stichtag in the Tankbestand help and its example

- [x] Scenario outline «Die Hilfe zum Tankbestand und das Beispiel beim Stichtag nennen denselben Stichtag» (building-detail.feature), seen red in all three rows
- [x] Fachreview 1103-1 before implementing (`docs/reviews/1103-fachreview-1.md`): the last ended end is right; V-1 (Major, the scenario must pin the rule) and V-2 to V-4 fixed; Fachreview 1103-2 closed all
- [x] `stockPeriods { ended, next }` on `GET /buildings/:id` instead of `nextPeriodEnd`; the help fills {end}, {ended}, {next}; calendar text «bei diesem Gebäude am 31.12.»; red first: unit, route and DOM tests
- [x] code-reviewer round 1 (`docs/reviews/1103-review-1.md`): C-1 (Major, yes/no questions) fixed, red with the code taken out; round 2 (`1103-review-2.md`) closed it
- [x] Persona Helga (`docs/design/personas/helga-1103.md`): no Blocker/Major; P-1, P-2 Minor stay
- [x] PR (`Fixes #1103`): pushed after this archive
## Session 2026-11-04: #1093 refused Beleg or Dokument opens the error page

- [x] Scenarios (`invoice-detail.feature`, `tenant-documents.feature`), seen red at the missing error page
- [x] `proxyFile` redirects a refusal through `pdfRefusal`; the Beleg of a deleted invoice says `INVOICE_NOT_FOUND`; the error page names a gone invoice or Dokument and leads to the invoice list
- [x] Dokument links without `download` (it saved the error page as a file); `reload` as the statement list's PDF link
- [x] Screen rows `invoice-document-refused`, `document-pdf-refused`; D7c, API spec
- [x] Code review round 1 (`docs/reviews/1093-review-1.md`)
- [x] Personas Helga, Marco (`helga-1093.md`, `marco-1093.md`); their P-1 and C-2 fixed: the error page says a gone invoice or Dokument was deleted
- [x] Closing review (`docs/reviews/1093c-review-1.md`); C-1 Minor stays in its report
- [x] Workflow note (`docs/reviews/workflow-notes-issue-1093.md`)
- [x] CI all browsers (WebKit: an image Dokument without `download`, #424): hand-run of ci.yml, result in the pull request
- [x] PR: pushed after this archive

## Session 2026-11-04: #1068 one short sentence on billed contracts per building

- [x] Scenarios in `statement-generate.feature` changed as #1068 decided (Spec change approved: #1068), seen red at the old texts
- [x] One sentence per building card: none, some or all contracts billed (singular and plural); the «Neu berechnen» sentence once under the buildings, read with the group; red first in DOM and i18n tests
- [x] Fachreview 1068-1 (`docs/reviews/1068-fachreview-1.md`); wording decided by the product owner
- [x] Code review round 1 (`docs/reviews/1068-review-1.md`): C-1, C-2 Minor fixed; closing round 2 (`1068-review-2.md`) clean
- [x] Personas Marco, Sven (`marco-1068.md`, `sven-1068.md`): no Blocker/Major; Sven P-1, P-2 fixed, red first; the other Minors existed before and stay in their reports
- [x] PR (`Fixes #1068`): pushed after this archive

## Session: search engine tags for dwello.ch

- [x] Landing pages: canonical, absolute hreflang with x-default, Open Graph, JSON-LD SoftwareApplication; `i18n/build.py` sets canonical, og:url, og:image and og:locale per language
- [x] Slice review (`docs/reviews/seotags-review-1.md`); C-1 fixed: JPEG link preview per language
- [x] PR #1109: pushed after this archive

## Session: www.dwello.ch to dwello.ch

- [x] `marketing/.htaccess`: 301 from www.dwello.ch to https://dwello.ch with the path (Infomaniak's web redirection served a self-signed certificate on HTTPS and dropped the path; the owner deleted it)
- [x] Slice review (`docs/reviews/www-review-1.md`); C-1 fixed: host with trailing dot or port
- [x] PR: pushed after this archive

## Session 2026-11-04: #651 the page behind the mobile menu is inert

- [x] No scenario: inert changes only what assistive technology reads; Playwright's aria snapshot and role locators still list inert content (checked with a test page), and focus and pointer already stayed in the drawer. DOM tests instead, red first
- [x] MobileNav makes the page around it inert with the Dialog's `makeInert` (shared in `src/lib/inert.ts`, a module of its own for fitness Ä1); the scrim stays clickable, toasts readable; the menu closes at `lg` (64rem)
- [x] Code review round 1 (`docs/reviews/651-review-1.md`): C-1 Minor fixed; closing rounds 2 and 3 (`651-review-2.md`, `651-review-3.md`, the move for fitness Ä1) clean
- [x] Fallback review of #1115: Medium (focus after a wide window closed the menu) and Low (stub ignored the query) fixed, scenario red first; closing round 4 (`651-review-4.md`): C-1 Minor (pages without a main navigation area keep the old fallback to the page) stays in its report
- [x] No persona: what the screen shows is unchanged, and the persona tools list inert content too
- [ ] Manual check of toast announcements with NVDA and VoiceOver: product owner (stays in #651)
- [x] PR (`Refs #651`): pushed after this archive
## Session #1096: toasts never move the page; focus after removal

Branch `ccr-7b33ff2a-sj3b8c`. Decided (product owner) 2026-11-04 in #1096. Spec change approved: #1096 (the step «verdeckt die Erfolgsmeldung nicht, was den Fokus hat» checks no overlap instead of «below the focus»: the toast may stand at the top).

- [x] S1 @wip scenario «Die Erfolgsmeldung bewegt die Seite nicht» (zugangsschluessel.feature), seen red (the page moved 112 px); the step «verdeckt … nicht» now measures above, below and beside (spec change #1096)
- [x] S1 ToastRegion: no scroll padding, spacer, `scrollIntoView` or `--toast-room`; top placement when the focused element lies where the toast would stand. Files: `src/lib/ui/ToastRegion.svelte`, `Dialog.svelte`, `tests/e2e/{features/zugangsschluessel.feature,questions/app-frame.ts,screenplay/{interactions,questions}.ts,steps/app-frame.steps.ts,tasks/{access-keys,categories}.ts}`
- [x] S2 @wip scenario «Eine neue Erfolgsmeldung ersetzt die ältere» (categories.feature) and DOM test, both seen red
- [x] S2 implementation (`addToast` in `src/lib/stores.ts`); code review 1096-1: C-1 (close button focus moved the toast) and C-3 fixed, C-2 covered by a DOM test seen red without the focusin handler
- [x] S3 @wip scenarios «Nach dem Löschen steht der Fokus auf der nächsten Kategorie» (categories.feature) and «Nach dem Neuberechnen bleibt der Liegenschaftsverwalter, wo er war» (statement-detail.feature), both seen red with the focus on the page title
- [x] S3 implementation: `src/lib/ui/focus-after-action.ts` (noteFocus on focusin, refocus when the confirmation shows), its DOM tests; `DeleteDialog` reloads the same list without scrolling; the statement `FormDialog` no longer focuses the title (two DOM tests now check it does not); a contract DOM test checks each confirmation after its own action
- [x] Slice reviews: 1096-review-1 (S1: C-1..C-3 Minor fixed), -2 (S2: none), -3 (S3: C-1 Major, C-2, C-3 fixed), -4 (re-review: closed)
- [x] Personas Helga (150 %, 200 %) and Marco (phone, tablet): `docs/design/personas/helga-1096.md`, `marco-1096.md`. Marco P-1 (Major: the toast covers the next row's «Löschen») contradicts what #1096 decided (covering content without focus is accepted) and, with Helga P-1 to P-4 (same pattern), is #1113 (needs-decision); Marco P-2, P-3 stay in the report
- [x] Before marking complete: lint, check, backend type-check, affected vitest and E2E, Prettier on added files; workflow note `docs/reviews/workflow-notes-issue-1096.md`
- [x] Archive the session; PR pushed after this archive

## Session: collected workflow review 2026-11-04 (parallel: checklist in the pull request)

Branch `ccr-33d8e016-x8cm7h`. Request: look for workflow notes on `main` not covered by a review and apply the improvements the product owner chose.

- [x] Collected review `docs/reviews/workflow-rules-review-2026-11-04.md` of 15 notes; decisions recorded there
- [x] Restore `docs/design/personas/demo-records.md`; `tests/unit/persona-readme.test.ts` seen red without it
- [x] Rules applied: proposals 3 to 7, 9 to 15, 8 (already on `main`), and 6 and 13 of `2026-11-01`; `seedFor` message as #1119
- [x] Code review wfr-1104-review-1 (C-1 Major, C-2..C-6 Minor fixed), -2 (closing round: none open)
- [x] Before marking complete: lint, check, backend type-check, fitness, rule-file tests, Prettier on added files
- [x] Archive the session; PR pushed after this archive

## Session: #1113 the toast avoids the focused row

- [x] Scenario «Die Erfolgsmeldung verdeckt die Kategorie mit dem Fokus nicht» (`categories.feature`), seen red at its last step (-93 px)
- [x] DOM test in `ui-layout-parts.dom.test.ts`, seen red; `place()` in `src/lib/ui/ToastRegion.svelte` measures the focused element's `li`/`tr`
- [x] Slice review round 1 (`docs/reviews/1113-review-1.md`)
- [x] Personas Marco and Helga (`docs/design/personas/marco-1113.md`, `helga-1113.md`)
- [x] Fixes: button group of a new key (`data-focus-row`), tall rows count by the focused part, focus to the row now in place when the next row went too (#1123)
- [x] Slice review round 2 (`docs/reviews/1113-review-2.md`); C-3 kept in this PR as the product owner decided
- [x] PR: pushed after this archive

## Session 2026-11-05: #656 keys and landmarks in the header

- [x] Decided in #656 (product owner): implement now; after a language change the focus is back on the language choice and a message in the new language names it
- [x] Scenarios (navigation, sprachen), red first: arrow keys, Home and End in the user menu; the footer marks the open legal page; after a language change the focus is on the language choice and Dwello names the language; «Anmelden» and «Hilfe» sit in the header area
- [x] The user menu moves like the language choice (`src/lib/menu-keys.ts`, shared); `aria-current="page"` in the footer; a session flag carries the change across the reload; the public layout's top bar is a `<header>`
- [x] Screen state `language-changed` for login and dashboard (screens.json, accessibility and language rows)
- [x] Code review round 1 (`docs/reviews/656-review-1.md`): C-1 Blocker (a layout test expected no header), C-2 Major (screen state), C-3 Minor fixed; round 2 (`656-review-2.md`) clean
- [x] Persona Sven (`docs/design/personas/sven-656.md`): P-1 Minor (the language already shown left the list open and set the flag) fixed, DOM test red first; his notes (no menu role, the account language) stay in the report
- [x] PR (`Fixes #656`): pushed after this archive
## Session 2026-11-05: #653 shared dialogs: tab order, initial focus, description

- [x] Scenarios (contract-detail, invoice-detail, statement-detail), red first: the dialog «Mietvertrag beenden» starts in its field; the long delete confirmation opens at its top on a phone and describes itself with its first paragraph; after sending, the focus is on the status
- [x] Dialog: focus starts in the first field (a danger dialog with fields on the panel), the confirm button comes after the fields; the description is the first paragraph (not field help, not a live line) unless a dialog names its own (`describedby`, the correction: consequence and «nicht rückgängig»); a button press does not move the dialog under the pointer
- [x] Scrollbar: product owner decided to leave it to the system setting («System lassen»)
- [x] Focus after saving: the status line (`#statement-status-line`) when the action's button is gone; a button that stays keeps it (#1096); after «bezahlt» in the list, the row's link or the list's result
- [x] Code review rounds 1 and 2 (`docs/reviews/653-review-1.md`, `-2.md`) fixed; closing round 3 (`653-review-3.md`) on the merge with #1096: C-6 Blocker («Neu berechnen» lost its focus) and C-7 Major fixed, DOM test red first; round 4 (`653-review-4.md`): C-8 Minor fixed
- [x] Personas Sven and Marco (`docs/design/personas/sven-653.md`, `marco-653.md`): P-1 (the live date line read as description) fixed
- [x] Fallback review of #1127 (Medium: the send dialog's switch to the letter left the description on a removed paragraph and the focus on the page) fixed, DOM test red first; review round 5 (`653-review-5.md`) C-1 Major (no scenario) answered by a new scenario in `statement-send.feature`; round 6 (`653-review-6.md`) clean
- [x] PR (`Fixes #653`): pushed after this archive
## Session 2026-11-05: #1123 isolation, #1124 focus after saving

- [x] Record the product owner's decisions in #1123 and #1124
- [x] #1123: the scenario «Nach dem Löschen steht der Fokus auf der nächsten Kategorie» seeds its next row right after its first (`tests/e2e/fixtures/backend.ts`, steps, tasks, targets); spec change approved: #1123
- [x] #1124: scenario «Nach dem Speichern steht der Fokus auf der gespeicherten Kategorie» seen red; DOM test seen red; `focusRowLinkingTo` in `src/lib/focus-after-action.ts`, called by `src/routes/config/SaveForm.svelte`
- [x] Code review round 1 (`docs/reviews/1124-review-1.md`)
- [x] Personas Helga and Sven (`docs/design/personas/helga-1124.md`, `sven-1124.md`); Minors stay in the reports, #1128 opened (create flow)
- [x] Workflow 9: no closing round needed (no code since 962382c3c); PR pushed after this archive

## Session 2026-11-05: #659 the meter warning under the heating profile choice

- [x] Decided in #659 (product owner): split the help; the sentences about meters become a warning directly under the choice, wording unchanged, in all four languages
- [x] `@wip` scenario first, `fach-reviewer` round 1 (`docs/reviews/659-fachreview-1.md`) before any code: the split loses nothing; V-1 Major (warning before the chart) and the Minors V-2 (title from the warning's own words) and V-3 (scenario checks the short help) fixed; the missing glossary terms went to #1130 (`needs-decision`)
- [x] Scenario reads «without scrolling past the help» as: scrolled to the choice, the warning is in the window (at 390 × 844 the page head and the preset notice already fill the first screen); new interaction `Scroll.toTop`
- [x] Code review round 1 (`docs/reviews/659-review-1.md`): C-1 Blocker (the #1089 phone scenario had lost its last step to the new one) and C-2 Minor (warning before the chart pinned) fixed; round 2 (`659-review-2.md`)
- [x] Persona Marco (`docs/design/personas/marco-659.md`): task done; three Minors about the warning's length and wording (decided to stay) and the profile pre-selection stay in the report
- [x] PR (`Fixes #659`): pushed after this archive
## Session 2026-11-05: #1128 focus after creating

- [x] Record the product owner's decision in #1128
- [x] Scenario «Nach dem Erfassen steht der Fokus auf der neuen Kategorie» seen red; DOM test seen red; `focusSavedRow` (renamed from `focusRowLinkingTo`) falls back to the row link named as entered, in `src/lib/focus-after-action.ts` and `src/routes/config/SaveForm.svelte`
- [x] Code review round 1 (`docs/reviews/1128-review-1.md`); C-1 fixed with a test (links in `nav` left out), C-2 (Minor) stays in the report
- [x] Closing code review round 2 (`docs/reviews/1128-review-2.md`)
- [x] Fallback review on #1131 (Medium, = C-2) fixed with a test; closing round 3 (`docs/reviews/1128-review-3.md`), C-3 (Minor) stays in the report
- [x] Personas Helga and Sven (`docs/design/personas/helga-1128.md`, `sven-1128.md`): no findings
- [x] Workflow 9: PR pushed after this archive

## Session 2026-11-05: #663 refused draft in a new tab; the wizard names its run

- [x] Persona re-run on main (Helga, Anna, Sven 663, `docs/design/personas/*-663.md`): findings 1 («Schlussabrechnung» without year), 2 (yellow message read as part of the notice) and 5 («… trotzdem erstellen») are gone; 3 (refused draft link loses the entries) and 4 (wizard steps are bare check marks, step 5 names nothing) hold
- [x] Decided in #663 (product owner): the link opens the draft in a new tab and says so, the scenario «Abgelehnter Entwurf ist verlinkt» changes with it; finished steps show their value, step 5 sums up the run
- [x] New tab: `RefusedStatements` with `target="_blank"` and the existing `ui_opens_new_tab`; changed scenario red first; Helga's re-check: P-1 fixed
- [x] Wizard: `Stepper` takes values (period, buildings, heating profile), shown from md and in the accessible name; step 5 summary in `GenerationStep`; existing texts only. Workflow note: the scenario came after the DOM tests and was seen red with the code taken out
- [x] Code review round 1 (`docs/reviews/663-review-1.md`): C-1 Blocker (the changed step no longer checked which draft opens) and C-2 Major (values only from xl) fixed with C-3, C-4, C-5, C-7; round 2 (`663-review-2.md`) clean but C-8 (a comment, fixed); C-6 Minor (step 3's value names only the heating profile) stays in its report
- [x] PR (`Fixes #663`, `Spec change approved: #663`): pushed after this archive

## Session 2026-11-05: #664 usability pass (contract «Beenden», move-out hint, wizard announcement, refusal naming)

- [x] Start: issue read, «Decided (product owner)» items 1–4 are the requirement; persona reports `helga-664.md`, `sven-664.md` committed
- [x] Step 1: `@wip` scenarios (contract-detail, apartments, statement-generate), steps red at the missing behaviour; the two «nicht mehr» scenarios pin the end of the hint
- [x] Step 1: `fach-reviewer` of the `@wip` scenarios and proposed texts before implementing (items 1, 2, 4): `docs/reviews/664-1-fachreview-1.md`
- [x] Slice 1: «Beenden» becomes «Enddatum erfassen» (`contracts_end_action`), texts quoting it follow
- [x] Slice 2: move-out hint in the apartment lists and on the ended contract (backend `moveOut`, timing as the missing-statement rule; none while `fixedTermCheck` holds, M-1; list rows without a link: the row is the apartment's link; new a11y screen `contract-final-due-detail`)
- [x] Slice 3: wizard result in the live region, focus on a heading that names the result
- [x] Slice 4: refused draft named by tenant and period (`RefusedStatements`)
- [x] Code review round 1 of slices 1–4 (`code-reviewer`, handed to the coordinator): `docs/reviews/664-review-1.md`
- [x] Workflow note: a worker without the Agent tool waits for each hand-over; the step-1 gate let slice 3 (a11y only, no domain text) go ahead meanwhile
- [x] Feature review: personas Helga and Sven (`persona-stack.sh`): `docs/design/personas/helga-664-2.md`, `sven-664-2.md`; fixes of code review C-1..C-5 and Helga P-2 in 62614c7
- [x] Closing code-review round (`code-reviewer`): `docs/reviews/664-review-2.md`; C-6 fixed (fixture), C-7 stays in the report
- [x] Checks: lint, check, backend type-check, full vitest, full backend suite, affected E2E and axe/language rows, fallow audit, Prettier on added files; workflow notes `docs/reviews/workflow-notes-issue-664.md`
- [x] PR (`Fixes #664`, `Spec change approved: #664`): pushed by the coordinating session after this archive
## Session #1119: seedFor names itself when a state gets no records (parallel: checklist in the pull request)

Branch `ccr-33d8e016-x8cm7h`. No scenario: test tooling of the axe and language checks; a unit test shows the hint.

- [x] `tests/unit/screens-seed-hint.test.ts` seen red (`withSeedHint is not a function`), then `withSeedHint` in `tests/e2e/fixtures/screens.ts`, applied in `lookAt` (`tests/e2e/tasks/accessibility.ts`)
- [x] E2E: `invoice-hints` taken out of the list by hand fails with the hint; restored, 6 rows pass (chromium)
- [x] Code review 1119-review-1: no findings; -2 (German test titles after the fallback review): no findings
- [x] Before marking complete: lint, check, fitness, backend type-check, Prettier on added files
- [x] Archive the session; PR pushed after this archive
## Session: #1126 Kostenabstimmung (preview and «Berichte»)

- [x] `@wip` scenarios: preview (`statement-cost-reconciliation.feature`) and «Berichte» (`reports.feature`), steps seen red; `@wip` removed, all green
- [x] `fach-reviewer` round 1 on the scenarios: `docs/reviews/1126-fachreview-1.md` (M-1, V-1 decided by the PO 05.11.2026: note on statements not up to date; V-7: no notes in the preview)
- [x] `fach-reviewer` round 2 on the M-1/V-1 fix: `docs/reviews/1126-fachreview-2.md` (V-9 to V-12 fixed; V-10 partial correction and «Nicht berichtigen» not pinned)
- [x] Backend: building costs per position, tenant shares of valid statements and of the run, fee, non-allocable invoices (`cost-reconciliation.pg.test.ts`, each behaviour seen red)
- [x] Backend: «Berichte» periods list, notes (contracts without statement, drafts, statements not up to date); 404 for an unknown building
- [x] API contracts for the new responses; `docs/api-specification.md`
- [x] Preview: Kostenabstimmung per building replaces «Kosten aller Abrechnungen» and the vacancy note (Spec change approved: #1126)
- [x] «Berichte»: list building × period and the Kostenabstimmung page; replaces the coming-soon scenario (Spec change approved: #1126)
- [x] Texts in de/fr/it/en; `UBIQUITOUS_LANGUAGE.md` row for the title (product owner confirms in the PR)
- [x] Screens in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [x] Code review 1126-1 (backend): `docs/reviews/1126-review-1.md` (C-1, C-3, C-4 fixed; C-2, C-5 Minor, stay in the report)
- [x] Code review 1126-2 (frontend): `docs/reviews/1126-review-2.md` (C-1, C-2, C-3 fixed; C-4: the apostrophe test pins kept behaviour)
- [x] Personas Helga, Marco, Dr. Weber, Sven, Anna: `docs/design/personas/*-1126.md` (P-1 «Berichte» not reachable: menu item and help text; Sven P-4 row headers fixed; Minors met by several personas: #1138; Sven P-2 drafts without link: product decision)
- [x] `daten-pruefer`: `docs/reviews/1126-datenpruefung-1.md` (all amounts to the Rappen; D-1 = code review C-1, fixed)
- [x] `fach-reviewer` 1126-3 on the help text and menu label: `docs/reviews/1126-fachreview-3.md` (V-14, V-15 fixed); closing `code-reviewer` 1126-3: `docs/reviews/1126-review-3.md` (C-5 scenario added, C-6 fixed; C-7, C-8 Minor stay)
- [x] PO 05.11.2026 on persona Sven P-2: the drafts note names its tenants as links
- [x] `fach-reviewer` 1126-4 on the drafts texts: `docs/reviews/1126-fachreview-4.md` (V-16 fixed); `code-reviewer` 1126-4: `docs/reviews/1126-review-4.md` (C-7 to C-9 Minor, stay)
- [x] Merged `origin/main` (clean); for `bun run fitness` the Kostenabstimmung components moved to `src/lib/statement-wizard/`, the report types to `backend/src/api/report.ts`
- [x] `code-reviewer` 1126-5 on the move: `docs/reviews/1126-review-5.md` (no findings)
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-1126.md`
- [x] Before marking complete: lint, check, fitness, backend type-check, affected tests and E2E, Prettier on added files
- [x] Archive the session; PR `Fixes #1126` pushed after this archive

## Session: #1122 persona Chromium locale

- [x] Reproduction: a non-ASCII download through persona-kit's `open()` named «download» with LANG unset and with LC_ALL=C (scratch script, red)
- [x] persona-kit launches Chromium with `LC_ALL=C.UTF-8`; the export in `persona-stack.sh` removed (green in four shell setups)
- [x] Code review 1122-1: `docs/reviews/1122-review-1.md` (no findings)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-1122.md`
- [x] Before marking complete: lint, check, fitness, backend type-check, Prettier on added files
- [x] Archive the session; PR `Fixes #1122` pushed after this archive

## Session: contracts-not-loaded hint linked and shorter (#665, #666)

- [x] @wip scenarios: the hint is the description of «Wohnung» and «Vertragsbeginn» (#665); its shorter wording (#666)
- [x] fach-reviewer step 1 on the wording of #666 (`docs/reviews/b665-fachreview-1.md`); V-1 fixed (af5fab3), issues #1142, #1143
- [x] Product decision on the changed lines of the non-@wip scenarios that quote the old wording (#666, «Decided (product owner)»)
- [x] Slice 1 (#665): `Field` `describedby` through `Select` and `DateInput`; the hint linked (`Field`, `Select`, `DateInput`, `ContractsUnknown`, `ApartmentStep`, `PeriodStep`)
- [x] Slice 2 (#665): `src/lib/ui/LiveRegion.svelte` replaces the hand-made `role="status"` wrappers (also `ContractForm`); the round-3 region at «Vertragsbeginn» was dropped again (C-1: unreachable since #468)
- [x] code-reviewer slice 1+2 (`docs/reviews/b665-review-1.md`); C-1 fixed (8e11340)
- [x] Slice 3 (#666): shorter wording in all four languages (`messages/*.json`, `ContractsUnknown.svelte`, scenarios, DOM tests)
- [x] code-reviewer round 2: af5fab3, C-1 fix, #666 (`docs/reviews/b665-review-2.md`; C-1 closed, C-2 Minor fixed: `fe:ui` ratchet 56 → 46 files)
- [x] fitness split: `fe:ui/illustrations` module (8c17129)
- [x] Feature review: Sven (`docs/design/personas/sven-b665.md`)
- [x] Feature review of #666: no persona (a text the issue decided whose `fach-reviewer` round read it in all four languages, `CLAUDE.md` step 5)
- [x] #665 «the rest»: round 3 unreachable since #468 (C-1); H7/Sven 7 gone since #152 (the edit form names the apartment); H6, H8, Sven 6 stay (files not touched)
- [x] Checks: lint, check, backend type-check, full vitest, fitness `--base origin/main`, fallow audit, Prettier on added files, affected E2E and axe/language rows
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-665.md`
- [x] Archive the session; PR (step 9 by the coordinator) pushed after this archive
## Session: #1121 outside review as a required status

- [x] `fallback-review.yml` sets the commit status «Outside review» on the head after a Copilot review, a fallback review or «No review» (`statuses: write`)
- [x] `tools/ci/fallback-review.test.ts`: the step's script with gh, curl and sleep stubbed; three tests, red against the workflow of main
- [x] Skill `pull-request` names the status; without it after 15 minutes, re-run the latest «Fallback review» run
- [x] Code review 1121-1: `docs/reviews/1121-review-1.md` (C-1 fixed in the skill; C-2 rejected: a function does not inherit the ERR trap without `set -E`, so a failed status call ends the script before the trap, as a test showed)
- [x] Before marking complete: lint, check, testcheck, Prettier on added files, tools/ci tests
- [x] Archive the session; PR `Fixes #1121` pushed after this archive; the ruleset command for the owner under "Blocked on me"
## Session: overlap refusal and contract wizard repetitions (#667)

- [x] @wip scenarios: overlap refusal names the other contract and advises per case, hint gone after it (W-03, W-04, W-07); past-start warning once (W-08); stepper names unbroken at 1440 px (W-10)
- [x] fach-reviewer step 1: every new or changed text in de/fr/it/en (`docs/reviews/b667-fachreview-1.md`; V-1, V-2, M-1, M-2, V-3, V-4 taken)
- [x] Backend: CONTRACT_OVERLAP names the earliest other contract's tenant (none when anonymised) and period; `tenantAnonymised` in the contract list; API contracts `contract-overlap.json`, `contracts.json`
- [x] Frontend: refusal and step-3 error from one builder (`overlapRefusal`, `overlapError`), hint hidden after the refusal, field error without the repeated notice, stepper `flex-auto`; axe and language rows `overlap-error`, `overlap-refused`, screen `contract-edit-earlier`
- [x] code-reviewer round 1 (`docs/reviews/b667-review-1.md`): C-1 Major fixed (the a11y state fails only the load and waits for the hints to go), C-2, C-4, C-5 fixed, C-3 to fach-reviewer step 5
- [x] Feature review: persona Dr. Weber (`docs/design/personas/weber-b667.md`): W-03, W-04, W-07, W-08, W-10 confirmed fixed; P-1, P-2 fixed, P-3, P-4 to fach-reviewer step 5, P-5 stays (#1142), P-6 stays (rule on main)
- [x] fach-reviewer step 5 (`docs/reviews/b667-fachreview-2.md`): V-1, M-1 Major and M-2, V-2, V-3, V-5 fixed (advice with condition, check of the signed lease, link to the other contract); V-4 eased by the wording
- [x] Fitness: the other contract's status (`seit`/`ab`) from the backend (param `status`), not the frontend's today
- [x] Stepper: `flex-auto` only without values; the statement wizard keeps `flex-1` (its names break on main too: #1146)
- [x] code-reviewer round 2 (`docs/reviews/b667-review-2.md`): C-1 to C-5 closed; C-6, C-7 Minor fixed (0ab2f38); fallow and fitness fixes (00709bc, 6f2b776)
- [x] Issue #1146 opened: the statement wizard's stepper breaks names at xl (on main too)
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-667.md`
- [x] Checks: full vitest, fitness `--base origin/main`, backend tests and p2 queries, fallow audit, Prettier on added files, lint, check, type-check, affected E2E with axe and language rows
- [x] Closing code-reviewer round on the delta since 00709bc (`docs/reviews/b667-review-3.md`, no findings)
- [x] Archive the session; PR (step 9 by the coordinator) pushed after this archive
## Session: #669 contracts-retry toasts (personas B-15 round 3)

- [x] Read #669; Helga's b15-3 report from history (`ebc0708`), Sven's not in the history (issue text used)
- [x] @wip scenarios and failing steps (db9466c), seen red at the missing behaviour; Helga P-1 already fixed on main (#1096), pinned
- [x] Product owner decided P-4 (toasts after `<main>`), P-5 (hint at the top, Spec change approved: #669 for three lines in contract-edit.feature), P-2 also in the wizard; recorded in #669
- [x] fach-reviewer step 1, round 1 (`docs/reviews/669-1-fach-review.md`): V-1 to V-4 fixed
- [x] Fixes P-1, P-3, P-4, P-5, P-2 (034c8db..5b569bc), each test seen red
- [x] code-reviewer round 1 (`docs/reviews/669-review-1.md`): C-1 Major, C-2, C-3
- [x] Feature review round 1: personas Sven and Helga (`docs/design/personas/sven-669.md`, `helga-669.md`): S-1, S-2/H-3, H-1 Major; S-3 rejected (decided P-3); S-4, S-5, H-4, H-5 stay
- [x] fach-reviewer round 2 (`docs/reviews/669-2-fach-review.md`): texts for C-2, S-2/H-3, H-1 (V-5 to V-7)
- [x] Fixes C-1/S-6, S-1, H-2, C-3, C-2, S-2/H-3, H-1 with new state `overlap-review` (dc51001..5af99a9), each test seen red
- [x] code-reviewer round 2 (`docs/reviews/669-review-2.md`): C-1 to C-3 closed; C-4, C-5 Minor fixed (7b1dc69)
- [x] Persona re-runs (`sven-669-2.md`, `helga-669-2.md`): S-1, S-2, H-1, H-3 fixed; S-6, H-2 partly, Minor, stay; S-7 = H-6 became #1153
- [x] Issues opened: #1152 (overlap check loads at most 50 contracts), #1153 (name the blocking contract in step 2)
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-669.md`
- [x] Archive the session; PR pushed after this archive
## Session: #668 usability pass, contract edit form and rent step (personas B-15)

- [x] Read #668 and the B-15 reports (`helga-b15*.md` from history at `c893731^`; no Sven B-15 report exists, the issue text names his findings)
- [x] @wip scenarios (contract-edit, contract-new), seen red at the missing behaviour (84e7003)
- [x] fach-reviewer step 1, round 1: texts of S-4 and H15-3 in de/fr/it/en (`docs/reviews/668-fachreview-1.md`); M-1 became #1148
- [x] S-3: «Monatlich total» announced by a screen-reader-only status 1 s after typing (`RentStep.svelte`, 8497f84, 3b1476c)
- [x] H15-9: apartment written «Wohnung X · Gebäude» in the wizard's choice and review (`apartmentName` in `contract-form.ts`, `contract-wizard.ts`, edit `+page.server.ts`; 6913ed8); the tenant list's hyphen became #1149
- [x] H15-3: notice hint wording of fach review 668-1 (`messages/*.json`, dfb15f9)
- [x] S-4: heading and page title name the tenant (012dc33); Spec change approved: #668 for `contracts.feature:61`, `contract-detail.feature:138`
- [x] S-7: already fixed by #654 (`RadioGroup` labels an option by its label, describes it once); no change
- [x] H15-10: #1096 decided that a toast may briefly cover content without the focus; the «Vertragsstatus» filter is not focused after saving; no change
- [x] N-3 / n-4: product owner chose option 1; @wip scenarios and DOM tests seen red; fach-reviewer step 1 (`docs/reviews/668-n3-fachreview-1.md`): texts word for word, V-1 (every way out, breadcrumb scenario), V-2 (lands where clicked) fixed; `LeaveConfirm.svelte` with `beforeNavigate` (back button included), the form's own `goto` not asked; axe and language rows `contract-edit leave-dialog`
- [x] code-reviewer round 1, slice 668-n3 (`docs/reviews/668-n3-review-1.md`): C-1 (discard after «Zurück» goes back in history), C-2 (compare what would be saved), C-3 (every `goto` asks except the save and the discard) fixed, each test seen red
- [x] Persona re-runs: `docs/design/personas/helga-668-2.md` (P-1 = round-1 P-2, stays), `sven-668-2.md` (P-1 field validation of «2x0», on main; P-2 total heard twice when reading the page: both stay)
- [x] Issues opened: #1148 (end by agreement vs. notice, fach M-1, Helga P-4), #1149 (tenant list hyphen)
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-668.md`
- [x] code-reviewer round 1, slice 668-s3 (`docs/reviews/668-s3-review-1.md`)
- [x] code-reviewer round 1, slice 668-texts (`docs/reviews/668-texts-review-1.md`)
- [x] C-1, C-2, Sven P-2, Helga P-1 fixed, each test seen red (3b1476c)
- [x] code-reviewer round 2, slice 668-s3 (`docs/reviews/668-s3-review-2.md`): C-1, C-2 closed
- [x] Feature review round 1: personas Helga and Sven (`docs/design/personas/helga-668.md`, `sven-668.md`)
- [x] Persona re-run after S-4 and N-3
- [x] Checks on 30ee569: full vitest (4220 passed), lint, check, backend type-check, fitness `--base origin/main`, fallow audit, Prettier on added files; E2E contract-edit, contract-new, contracts, contract-detail, breadcrumb, statement-agreed-costs (220 passed); axe and language rows of contract-edit, contract-edit-notice, contract-edit-earlier, contract-new (76 passed)
- [x] Closing code-reviewer round 1 (`docs/reviews/668-closing-review-1.md`): C-1, C-2 closed; C-4 Major (the way to /login no longer asks: the session is gone after «Abmelden» or a 401; a narrower reading of «the menu asks», named in the PR), C-5 Major (scenario «Nach dem Verwerfen führt «Zurück» weiter zurück», red against the former goto), C-6 Minor (a link while the PUT runs asks) fixed in b7e7a40
- [x] Closing code-reviewer round 2 (`docs/reviews/668-closing-review-2.md`): C-4, C-5, C-6 closed; C-7 Minor (comment wording in `LeaveConfirm.svelte`) fixed
- [x] Archive the session; PR (step 9 by the coordinator) pushed after this archive
## Session: #1152 overlap check sees every contract of an apartment

- [x] No scenario: the state needs more than 50 contracts on one apartment, which the E2E stack does not seed; pg route test «liefert alle Mietverträge der Wohnung, auch mehr als 50», seen red (50 of 51)
- [x] `listContracts` applies no default limit when filtered by apartment; an explicit `limit` still applies; API doc updated (4bbfe5629)
- [x] code-reviewer round 1 (`docs/reviews/1152-review-1.md`, no findings)
- [x] Checks: lint, check, fitness, backend type-check, Prettier, backend tests api-contracts, contract-overlap, contract.routes, apartment* (147 passed)
- [x] Workflow notes: nothing came up
- [x] Archive the session
## Session: #672 category form help, delete dialog and reachability (persona Helga on #99)

- [x] Read #672 and Helga's report from history; P-5 (Übersetzungen), P-7 (main navigation has «Kategorien»), P-8 (#1096: a toast may cover content without the focus) already hold on main, no change
- [x] @wip scenarios and a unit test, seen red (1897008)
- [x] fach-reviewer step 1 (`docs/reviews/672-1-fach-review.md`): V-1 Major (deleting a category clears statement items' category, existed before) became #1160 (needs-decision); M-1, V-2 fixed; V-3: the claim about equal numbers dropped from the help, sorting unchanged
- [x] P-9 bug: an emptied «Reihenfolge» kept the old number; now saved as 0 (8ed2b9c), unit test seen red
- [x] P-3, P-5, P-6, P-9 texts in de/fr/it/en; description help composed by new/own/predefined and KI on/off (3894cf5)
- [x] code-reviewer round 1 (`docs/reviews/672-review-1.md`): C-1 Minor fixed (8386bde), C-2 Minor stays
- [x] Persona Helga (`docs/design/personas/helga-672.md`): P-3, P-5, P-6, P-7, P-9 fixed; H-1 (contract sentence always shown, per fach-review) and H-2 (= P-8) Minor, stay
## Session: #1153 name the blocking contract when step 2 clears an apartment

- [x] @wip scenarios in `contract-new.feature` (the box, the link to the blocking contract), seen red at the missing hint (4976c1d5f)
- [x] fach-reviewer step 1, round 1 (`docs/reviews/1153-fachreview-1.md`): wording de/fr/it/en; V-1, V-2, V-3, M-1 taken; V-4 covered by the DOM test
- [x] `clearedApartment` (unit test seen red), the box `apartment-cleared` in `ApartmentStep.svelte` (DOM test seen red), texts in `messages/*.json`; the toast and its scenario on `main` unchanged
- [x] Fat-file limit: draft restore moved to `restoredDraft` in `contract-wizard.ts`
- [x] Axe and language rows `contract-new apartment-cleared`
- [x] code-reviewer round 1 (`docs/reviews/1153-review-1.md`): C-1, C-2 Minor fixed, the DOM test seen red without the fix
- [x] Personas Helga and Sven (`docs/design/personas/helga-1153.md`, `sven-1153.md`): Minors only; those two personas met in one place became #1158
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-1153.md`
- [x] Closing code-reviewer round on the delta since ee376e46c
- [x] Archive the session
## Session: #670 apartment list count heading and building filter order (personas B-1)

- [x] Read #670; U-12 (filters on change) left to #662 as the issue says
- [x] @wip scenarios (heading names range and page; filter in the list's order), seen red; three DOM tests seen red
- [x] Heading «Wohnungen 1–12 von 13, Seite 1 von 2» when there is more than one page (`src/routes/apartments/+page.svelte`); building filter sorted by name (`ApartmentFilters.svelte`); texts in de/fr/it/en (40dc123)
- [x] code-reviewer round 1 (`docs/reviews/670-review-1.md`): C-1 Minor (locale for `localeCompare`) fixed (162ee5c)
- [x] Persona Marco (`docs/design/personas/marco-670.md`): P-5, P-6 fixed; M-1 (heading below the fold on phones), M-2 (page out of range) Minor, stay
- [x] Issue opened: #1156 (the same heading for the other lists)
- [x] Workflow notes: nothing came up
- [x] Archive the session; PR pushed after this archive
## Session: #1149 tenant list writes the apartment with ·

- [x] No scenario (the issue's «Done means»: separator only); `tenant-list.test.ts` pins it, seen red
- [x] `TenantRow.svelte`: « · » as on the contract pages; E2E step «wohnt … laut Mieterliste in der Wohnung …» checks the same with the new separator (no spec change)
- [x] code-reviewer round 1 (`docs/reviews/1149-review-1.md`): C-1 Blocker («Wohnung Wohnung»), C-2 Major (test input not the load's) fixed, test seen red on the doubled word
- [x] code-reviewer round 2 (`docs/reviews/1149-review-2.md`): C-1, C-2 closed
- [x] No persona: only the separator changes, to the format personas read on the contract pages (#668)
- [x] Checks: lint, check, fitness, vitest, E2E `tenants.feature` (8 passed), axe and language rows `tenants` (6 passed)
- [x] Workflow notes: nothing came up
- [x] Archive the session
## Session: #675 demo notice inside the app (personas B-162)

- [x] Read #675; only Weber's b162 report is in the history, the other findings from the issue and U-27
- [x] @wip scenarios and unit tests, seen red (b2e6d6b)
- [x] Product owner decided F1 (today's sentence in the line), F2 (link to /help#demo), F3 (own installation through the demo's operator), F5 (dialog issue apart: #1167); F4 by the coordinator's recommendation (the same line on /help, /privacy, /terms)
- [x] fach-reviewer step 1 (`docs/reviews/675-1-fach-review.md`): R-1 Major (backups survive the nightly reset) fixed by an empty BACKUP_DIR in the demo (dfbe414); R-2 Major (demo can start without operator) became #1170; V-1..V-5 fixed
- [x] One line in the app, full notice on the sign-in page and in the help (980afab)
- [x] code-reviewer round 1 (`docs/reviews/675-review-1.md`): C-1, C-2 Minor fixed (fdbb758); closing rounds (`675-review-2.md`, `675-review-3.md`): C-3 Minor of fdbb758 fixed (f8a3ce3)
- [x] Personas Sven, Marco, Helga (`docs/design/personas/{sven,marco,helga}-675.md`): P-1, P-2, P-4, Anna P-2, C-11 fixed; Helga H-1 = Marco N-5 (mailto) fixed; Minors that stay: Marco M-1, M-2, Helga H-2
- [x] Issues opened: #1167 (dialogs show a disabled action), #1170 (require operator for the demo)
## Session: #673 statement list filters, breadcrumb and wizard progress (personas B-2)

- [x] Read #673; Helga's b2 report from `c893731^`, Marco's not in the history (issue text and `marco-list.md`); already fixed on main, no change: Marco P-3/Helga P-5 (#1094), Marco P-6 (hyphenated title), Helga P-7 (#253)
- [x] @wip scenarios, seen red (b89b921)
- [x] Product owner decided P-4, P-2, P-5, P-7 (recorded in #673); P-6 by the coordinator's recommendation (current step named from md, #1146 separate)
- [x] fach-reviewer step 1 (`docs/reviews/673-1-fach-review.md`): V-1 Major (empty state reset follows P-4), V-2, V-3 fixed
- [x] Implementation (9ab37a9), each test seen red
- [x] code-reviewer round 1 (`docs/reviews/673-review-1.md`): C-1, C-2 Minor fixed; a11y and language row `statements-period list-scoped` added (29aaf89); closing round without findings
- [x] Personas Marco and Helga (`docs/design/personas/{marco,helga}-673.md`): P-2 to P-7 fixed; Minors that stay: M-1, M-3, H-2; M-2 = H-1 became #1162
- [x] Issue opened: #1162 (keep the chosen tile in view), #1163 (E2E contract row depends on the list page)
- [x] Workflow notes: nothing came up
- [x] Archive the session; PR pushed after this archive
## Session: #1146 statement wizard step display keeps words whole

- [x] Read #1146; layout by my recommendation (the issue's option «the numbers only as below xl»): with values only the current step is named, every step keeps its words whole
- [x] #1143 needs a spec change (`contract-edit.feature:239` pins the text): proposed text in the issue, `needs-decision`
- [x] Scenario «Die Schrittanzeige trennt keinen Namen eines Schritts» in `statement-generate.feature`, seen red (Abrechnungsperiode, Verwaltungspauschale); DOM test in `ui-navigation-parts.dom.test.ts`, seen red (cb86a4a)
- [x] code-reviewer round 1 (`docs/reviews/1146-review-1.md`): C-1 Major (step 3 unchecked) fixed, seen red; C-2 fixed; C-3 rejected
- [x] Personas Dr. Weber and Helga (`docs/design/personas/{weber,helga}-1146.md`): P-1 Major of both (values broken) fixed, seen red (1968f5c); the Minors that stay are in the reports; Helga P-2 (on `main` too) and the Minors two personas share became #1179
- [x] code-reviewer round 2 (`docs/reviews/1146-review-2.md`): C-1, C-2 closed, C-3 rejection accepted; C-4 Major (negative checks without anchor) fixed, anchor seen red (3d87398)
- [x] code-reviewer round 3, closing round (`docs/reviews/1146-review-3.md`): C-4 closed, no new findings
- [x] Checks: lint, check, fitness, backend type-check, Prettier, vitest (ui-navigation-parts, open-work), E2E statement-generate + contract-new, axe and language rows of both wizards
## Session: #677 busy buttons, field errors and the document list (personas upload174)

- [x] Read #677 and the upload174 reports (from PR #183); Sven 2 P-4 focus already fixed on main
- [x] @wip scenarios and red DOM tests (9670954)
- [x] Product owner decided 1, 5, 6, 8; 2–4, 7, 9–11 by the coordinator on the implementer's recommendation (recorded in #677); 11 became #1173
- [x] fach-reviewer step 1 (`docs/reviews/677-1-fach-review.md`): V-1..V-4 Minor fixed
- [x] Busy Button with aria-disabled and status, dialog focus, Field describedby order (b272fc6); document list filter, links, file names, duplicate hint (ce92205)
- [x] code-reviewer round 1 (`docs/reviews/677-review-1.md`): C-1 Major (scenarios) and C-2..C-5 fixed (0e25e25..e9c00c2); round 2 (`677-review-2.md`): C-6, C-7 Minor fixed (e83126d, ddf7bae)
- [x] Personas Sven, Helga, Anna (`docs/design/personas/{sven,helga,anna}-677.md`): P-3, P-7, P-4, Helga P-3, Anna P-3/P-4, Weber P-4, Marco 2 fixed; Sven S-1 Major (focus left the filter) and S-2, Anna A-1 = Helga N-6 fixed; Minors that stay: A-2, H-1, H-2, S-3, S-4
- [x] Issue opened: #1173 (page title announced again after a form action)
- [x] Workflow notes: nothing came up
- [x] Archive the session; PR pushed after this archive

## Session: README opening for search engines

- [x] `README.md`: first paragraph says what Dwello is (English and the German sentence of dwello.ch), links to dwello.ch, the demo and the installation guide; the stale «Status» and «Version» lines are gone
- [x] PR: pushed after this archive
## Session: #678 category allocability help and KI check feedback (personas on #176)

- [x] Read #678 (Enter decided by the product owner); Sven P-7, P-8, P-10 already fixed on main; E-12 (save during the KI check) kept as decided; only Sven's and Helga R2's #176 reports in the history
- [x] @wip scenarios and red DOM tests (bb3c361); coordinator decisions F1, F2 (help part of #1028 here), F4–F7 recorded in #678; #1182, #1183 opened
- [x] fach-reviewer step 1 (`docs/reviews/678-1-fach-review.md`): M-1, V-1..V-3 Minor fixed
- [x] Enter submits the save action in SaveForm, help in paragraphs, KI feedback, toast in the UI language (7c24245)
- [x] code-reviewer (`docs/reviews/678-review-1.md`): C-1..C-3 Major and C-4 fixed (2cf3607); round 2 without findings
- [x] Personas Helga, Sven (`docs/design/personas/{helga,sven}-678.md`): P-4..P-11 fixed; H-2 fixed; Minors that stay: Helga H-1, Sven S-1
- [x] Workflow notes: nothing came up
- [x] Archive the session; PR pushed after this archive

## Session: #1166 Kontoinhaber for the QR payment part

- [x] `@wip` scenarios (settings.feature, statement-detail.feature) written, steps seen red
- [x] `fach-reviewer` round on scenarios and texts (de/fr/it/en), findings fixed before the first green test: `docs/reviews/1166-fachreview-1.md`; V-2 and the row «Absender» decided in #1166
- [x] Backend: keys `account_holder_*`, required name/PLZ/Ort with IBAN and separate holder (`config.service`), creditor from the Kontoinhaber (`qr-bill.service`, statement and reminder), data export labels
- [x] BFF and form: block «Konto» with IBAN, checkbox «Kontoinhaber ist der Absender», fields; re-check deletes the fields
- [x] Contract `tests/contracts/` for the config response; texts in `messages/{de,fr,it,en}.json`; `UBIQUITOUS_LANGUAGE.md` row «Kontoinhaber»
- [x] a11y/language screens: `config` states with the cleared checkbox and the refusal
- [x] Slice review round 1: `docs/reviews/1166-review-1.md`
- [x] Feature review: personas `docs/design/personas/helga-1166.md`, `docs/design/personas/marco-1166.md` (Minors only; two-persona Minor → #1175); `daten-pruefer` `docs/reviews/1166-datenpruefung-1.md` (no findings); Dr. Weber not run (no PDF text changed, only the creditor's data); no step-5 `fach-reviewer` (texts unchanged since its round read them in all four languages)
- [x] Privacy statement question (Kontoinhaber in the mailed PDF) → #1176 (`needs-decision`)
- [x] Re-review of C-1 with the closing round: `docs/reviews/1166-review-2.md` (C-1 closed; Minor C-3 stays in the report)
- [x] Before marking complete: lint, check, fitness, backend type-check, affected tests, E2E, Prettier on new files
- [x] Workflow notes: `docs/reviews/workflow-notes-issue-1166.md`
- [x] Archive session; PR `Fixes #1166`: pushed after this archive
## Session: #1162 statement list keeps the chosen status tile in view

- [x] Read #1162; cause: the root layout focuses the list heading after every list navigation and scrolls the tiles away
- [x] Scenario «Der gewählte Statusfilter bleibt im Bild» (390×844, 960×600), seen red; layout DOM test seen red
- [x] Tiles keep focus and scroll (`data-sveltekit-keepfocus`, `-noscroll`, click focuses the link for WebKit); the layout leaves the focus on such a link (df1a2fa)
- [x] code-reviewer round 1 (`docs/reviews/1162-review-1.md`): no findings; WebKit unconfirmed locally, `ci.yml` started on the branch
- [x] Personas Marco and Helga (`docs/design/personas/{marco,helga}-1162.md`): no Blocker/Major; the Minors both met (no status at the list, the result below the window) became #1186
- [x] Checks: lint, check, fitness, vitest (layout-hydrated, statement-pages), E2E statements.feature, axe and language rows `statements`
- [x] Workflow notes: nothing came up
- [x] Archive the session; PR pushed after this archive
## Session: #1163 E2E finds the own contract on any list page

- [x] Read #1163; reproduced with a temporary precondition of 13 later contracts (timeout at «… ansieht», as in the issue), removed again
- [x] `viewContract`/`editContract` search the list by the tenant's suffixed name when the open page lacks the row; only then, so a page that shows it keeps its address and history (an unconditional search broke contract-edit «Nach dem Verwerfen führt «Zurück» weiter zurück») (67c42ed)
- [x] No scenario: test-only change; no persona: nothing a screen shows changed
- [x] code-reviewer round 1 (`docs/reviews/1163-review-1.md`): no findings; the full parallel run is the pull request's CI
- [x] Checks: lint, check, E2E chromium + api contracts, contract-new, contract-edit (139 passed)
- [x] Workflow notes: nothing came up
- [x] Archive the session; PR pushed after this archive

## Session: demo deploys the newest tag on main (#1184)

No scenario: the demo's update script runs on the VM outside the E2E stack; `tools/release/demo-update.test.ts` covers it.

- [x] Test: a commit merged after the tag still builds the tag, once (seen red)
- [x] `deploy/demo/update.sh`: newest version tag on `main` instead of an exact tag on its tip
- [x] `deploy/demo/README.md`, "7. Automatic updates": what is deployed
- [x] code-reviewer round 1: `docs/reviews/demo-tag-review-1.md`
- [x] C-1: record the tag's commit, not HEAD, in `.git/demo-deployed` (test seen red)
- [x] closing code-reviewer round: `docs/reviews/demo-tag-review-2.md`
- [x] PR: pushed after this archive
- [x] Fallback review on #1190 (build from the tag's commit, `reset --keep`): closing round `docs/reviews/demo-tag-review-3.md`

## Session: #685 statement PDF explanations of heating and time shares (Dr. Weber on #208)

- [x] Read #685; triage on main (`docs/reviews/685-triage.md`): P-1, P-3, the percent precision and the page break hold; #325, the Zeitanteil column and #249 done
- [x] Product owner decisions recorded in #685: 2 decimals, page break (last row and header with the totals, explanation with them); spec changes `percent()` 0–2 decimals and `statement-detail.feature` line 406
- [x] Red tests and @wip scenarios (b13ad0d); fach-reviewer step 1 (`docs/reviews/685-1-fach-review.md`): V-1..V-3 Minor fixed
- [x] PDF texts in four languages (379a795), page break (7214378), two decimals (692bdd5), scenarios run (bd83d34)
- [x] code-reviewer (`docs/reviews/685-review-{1,2}.md`): C-1 fixed (6574fcd), C-2 fixed (f09db09); PDF texts moved to `pdf-texts/` to stay within the line cap (e975f66)
- [x] Persona Dr. Weber (`docs/design/personas/weber-685.md`): W-1, W-2 Minor stay; daten-pruefer (`docs/reviews/685-datenpruefung-1.md`): no findings, 188 checks to the Rappen
## Session: #682 list screens: filters, landmarks, headings (personas on #159)

- [x] Read #682; triage on main (`docs/reviews/682-triage.md`): 7 findings hold, 4 and 5 partly fixed (#670), 10 mostly fixed (#681); only Sven's #159 report in the history
- [x] Product owner decisions 1–10 recorded in #682
- [x] Scenarios in buildings, apartments, contracts features and DOM tests, each seen red; search drops `page` (4825890); one search landmark, count heading, reset and labels on every list (1d179be)
- [x] code-reviewer (`docs/reviews/682-review-{1,2}.md`): C-1, C-2 Minor fixed (2b58c0b), C-3 rejected (same address, nothing new to focus)
- [x] Personas Sven, Marco (`docs/design/personas/{sven,marco}-682.md`): no finding of the change from Sven; Marco M-1 Minor stays (the building search finds neither a comma address nor the postcode)
## Session: #1172 UI screenshot job, the report page (part)

- [x] Read #1172; reproduced locally with a worktree of main as UI_BASE_DIR: only `/reports/[buildingId]` came out as a new page
- [x] Cause: no record and no period for `/reports` in `screenshots.spec.ts` (404 on both branches); it now opens the seeded Kostenabstimmung of Seeblick 2025 (194fbb3); `Refs #1172`
- [x] The other pages differ only at a few corners of rounded cards (276–1116 pixels on PR #1187's images) and do not reproduce locally; findings and next steps in #1172, which stays open
- [x] code-reviewer round 1 (`docs/reviews/1172-review-1.md`): no findings
- [x] No scenario: CI tooling only; checks: lint, Prettier, the screenshot run locally (3 passed)
- [x] Workflow notes: nothing came up
- [x] Archive the session; PR pushed after this archive

## Session: #662 list filters: selects apply on change

- [x] Read #662 (decided 2026-11-04); it contradicted the «Suchen» rule just merged with #682: the product owner confirmed #662; spec change of the #682 apartments scenario approved in #662
- [x] Selects apply on change on apartments, tenants, contracts, invoices, statements; apartments and invoices work as plain GET forms; scenarios and DOM tests seen red (d7474ba)
- [x] code-reviewer (`docs/reviews/662-review-{1,2,3}.md`): C-1..C-3 Minor fixed (609aaec); C-4 Major (axe and language state `empty-year`), C-5, C-6 fixed (219ab27); round 3 without findings
- [x] Personas Sven, Helga (`docs/design/personas/{sven,helga}-662.md`), two rounds: Sven S-1 Major (no announcement of the result) and S-2, S-4, S-5 fixed (4dd4526, 219ab27); Helga H-1 Major (unsent text applied; decided: only the selects apply, per #680) and H-2 fixed (6202bf9); Minors that stay: Sven S-3 (#1173), Helga H-3, H-4
- [x] Workflow notes: before asking a product question, search the open issues on the same behaviour (#662, #680 had decided what #682 asked again)
## Session: #688 agreements check retry: focus and announcement (personas on #439)

- [x] Read #688; triage on main (`docs/reviews/688-triage.md`): P-2, P-5, Helga P-3 hold; the #439 reports are not in the shallow history, every point confirmed in the code
- [x] Coordinator decision: after a successful retry the focus goes to the check's status line
- [x] Busy retry keeps the alert and the focus, a new text after a failed retry, a focused status line after success; DOM tests and two scenarios seen red; a11y and language rows (cc9b406)
- [x] code-reviewer (`docs/reviews/688-review-{1,2}.md`): C-1..C-3 Minor fixed (0b4d981)
- [x] Personas Sven, Helga (`docs/design/personas/{sven,helga}-688.md`): no Blocker or Major; Minors that stay: Helga H-1, Sven S-1, S-3; Helga H-2 = Sven S-2 (two alerts give opposite advice) is #1197
- [x] Workflow notes: `git stash` is shared by all worktrees; parallel agents must not use it (one popped another's stash)
- [x] Archive the session; PR pushed after this archive
## Session: #1176 Kontoinhaber in the privacy statement

- [x] `@wip` scenario (privacy.feature) and the changed «Stand der Datenschutzerklärung» (Spec change approved: #1176), seen red
- [x] `fach-reviewer` `docs/reviews/1176-fachreview-1.md`: the addition to `privacy_mail_smtp`, `privacy_mail_resend`, `privacy_mail_smtp_provider` in de/fr/it/en
- [x] Texts in `messages/*.json` (with R-3, Variante B, decided in #1176); Stand of the privacy statement only (`LegalHeader.svelte` shared with the terms, which keep 29. Oktober 2026)
- [x] Slice review `docs/reviews/1176-review-1.md` (Minor C-1 fixed in tests); no persona and no step-5 `fach-reviewer`: the legal texts are word for word from the `fach-reviewer` round, which read them in all four languages
- [x] Checks: lint, check, fitness, backend type-check, vitest --changed, privacy/terms E2E and their axe/language rows
- [x] Archive session; PR `Fixes #1176`: pushed after this archive

## Session: #1173 Do not announce the page title again after a form action

Parallel session: checklist kept in the pull request.

- [x] Decisions 1–3 recorded in #1173 under «Decided (product owner)»
- [x] Scenarios in `tenant-documents.feature`: upload heard without the title (seen red: title «Lea Frei … - Dwello» heard), opening a tenant reads its title once (pins kept behaviour)
- [x] Screen reader recorder for E2E (`ListenToAnnouncements`, `Announcements`)
- [x] Root layout: SvelteKit's announcer muted and hidden, own announcer reads the title on a change of path; DOM tests in `layout-hydrated.dom.test.ts`, each seen red
- [x] code-reviewer `docs/reviews/1173-review-1.md`: no findings
- [x] Persona Sven `docs/design/personas/sven-1173.md`: no Blocker, Major or Minor; observation «title twice in the tree» caused by the change, fixed (aria-hidden, 0f2d074)
- [x] Closing code-reviewer `docs/reviews/1173-review-2.md`
- [x] Checks: lint, check, fitness, backend type-check, vitest --changed, E2E tenant-documents/tenants/documents, axe and language rows of the tenant screens
- [x] Archive the session; PR `Fixes #1173`: pushed after this archive
## Session: #731 Older persona observations on the Übersicht

- [x] Each point checked on `main`; decisions in #731 «Decided (product owner, 07.11.2026)»: explain «Vermietet ab …» and «Gesperrt» at the tile; the tab title keeps its hyphen on all pages; 1280 px no longer touches, the lone «…» is fixed by a non-breaking space
- [x] Scenario «Kennzahl mit Mietstatus erklärt» (dashboard.feature) and i18n unit test, seen red; implemented (ceef116)
- [x] code-reviewer `docs/reviews/731-review-1.md`: no findings
- [x] Persona Helga (`docs/design/personas/helga-731.md`): no Blocker or Major; Minors P-1..P-3 stay in the report (P-3 before the change)
- [x] Checks: lint, check, fitness, backend type-check, vitest --changed, dashboard E2E with its axe/language rows
- [x] Archive session; PR `Fixes #731`: pushed after this archive
