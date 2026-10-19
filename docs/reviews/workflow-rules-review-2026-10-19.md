# Collected workflow review (2026-10-19)

Collected review per skill `workflow-review`, "Collected review", at the end of a request that covered several issues. Only findings and proposals; nothing here is applied. The product owner decides which to apply.

## Files covered

In no collected review yet (the last ones are `workflow-rules-review-2026-10-17.md`, groups G1 to G24, and `workflow-rules-review-2026-10-17-2.md`, T1 to T11; points they already propose are cited «as in G…/T…» with only what is new):

- Notes (15): `workflow-notes-ci-main-runs.md`, `-issue-100.md`, `-issue-132.md`, `-issue-211.md`, `-issue-222.md`, `-issue-292.md`, `-issue-419.md`, `-issue-424.md`, `-issue-429.md`, `-issue-57.md`, `-issue-66.md`, `-issue-71.md`, `-issue-77.md`, `-issue-78.md`, `-session-i1.md`.
- No per-task review: the request named `workflow-rules-review-issue-222.md`, which does not exist; `workflow-notes-issue-222.md` is the file for #222 and is covered instead.

Short names drop the prefix (`211` = `workflow-notes-issue-211.md`, `i1` = `workflow-notes-session-i1.md`, `ci-main` = `workflow-notes-ci-main-runs.md`).

Rules applied since 2026-10-17 and not proposed again: no red run for a test that pins kept behaviour (T6), one merge of `main` before the first push (T2), no closing round for reports and the plan (T4), Minor/Nit fixes without a round of their own (T1), related issues in one pull request (G2), decision issues closed by their fix (G1).

## Groups, most frequent first

| # | Rule location | Count | Proposal |
|---|---|---|---|
| H1 | Edits of special characters and many message keys (coordinator's Edit-only rule, `docs/design/i18n-begriffe.md:5`) | 6 | A test for French spacing, one escape line, a key-replace script |
| H2 | Review rounds and the pre-implementation `fach-reviewer` (Workflow 1, 5, 7) | 5 (+3 "paid off") | Count the pre-implementation review apart |
| H3 | "Seen red" (Workflow 2, "Done means") | 4 | Name three more ways to show red, or none |
| H4 | Issue state during a task ("Open work", Gotchas "Branches") | 5 | Re-check issues and pull requests before each round |
| H5 | Browsers, network and load in cloud sessions (Gotchas "Cloud sessions", "One build", `ci.yml`) | 5 | Chromium locally, all browsers on a label |
| H6 | Merge and push while blocked (`pull-request` "Never without the product owner", Workflow 9) | 3 | As G19, plus push a blocked branch |
| H7 | Scenario-first scope (Workflow 1) | 3 | Three cases in one sentence |
| H8 | Branch start and upstream (Gotchas "Branches", stop hook) | 3 | `--no-track` and `--prune` |
| H9 | Reviewer agents and persona data (`daten-pruefer`, `fach-reviewer`, personas README) | 5 | Sign-in for `daten-pruefer`, term check for `fach-reviewer` |
| H10 | Glossary edits (Design-Regeln "Copy", `pull-request`) | 2 | Issue that names the rows lets the session write them |
| H11 | Single points | 5 | See list |

### H1 Special characters and bulk message edits (6)

- Files: 57 (Edit dropped or replaced U+00A0 in `fr.json`; code review C-1), 429 (as in 57; a partial replacement before a guillemet keeps the existing U+00A0), 78 (Edit turns `\uXXXX` in `new_string` into the raw character; needed `perl -i` and `python3`), 100 (Edit dropped a trailing space twice, C-2 and C-8), 292 (25 keys × 4 files = 100 Edit calls; a scratchpad script replaced the value lines), 222 W-4 (GitHub stores U+0020 where the issue's French text needs U+00A0; V-9).
- Cost: three code-review findings (57 C-1, 100 C-2, C-8), one domain finding, hand checks with `od -c`, and three workarounds of the Edit-only rule (a coordinator prompt rule, not in the repo).
- What the rule caught: nothing in these notes; the Edit-only rule keeps unattended edits reviewable.
- Proposal: (a) a test in `i18n.test.ts`: every « in `fr.json` is followed, every » and every `:`/`;`/`?`/`!` preceded by U+00A0; this replaces care in every session and answers 222 W-4 (typography follows `i18n-begriffe.md`, not the issue). (b) One line in Gotchas: «the Edit tool writes `\uXXXX` as the character; write escapes in code as `\u{…}` built by `String.fromCodePoint`, check invisible characters with `od -c`, and check `git diff` after an Edit whose string ends in a space». (c) A script under `tools/` that sets named keys in all four `messages/*.json` from a JSON file and runs `JSON.parse`, allowed instead of Edit for more than a few keys.

### H2 Review rounds and the pre-implementation `fach-reviewer` (5, plus 3 "paid off")

- Files: 66 rows 2 and 4 (the pre-implementation round and the feature round used two of three `fach-reviewer` rounds; a persona Major on a legal text used the third; round-3 Minors could no longer be applied, since every text change needs a domain review), 222 W-1 (each new product-owner decision started a domain round; round 3 before the first string was written), 222 W-2 (a further round would reread eight texts round 3 already checked word for word; skipped with a reason), 100 row 2 (fach and code review found the same three gaps: V-9/C-6, V-10/C-5, V-5/C-4).
- What the rule caught: 100 round 1, two Majors before any code; 211 M-1 (over 100 % sharing, now #281); i1 #435, four Majors in the scenario. Keep Workflow 1.
- Proposal: in Workflow 7, «the review before implementing (Workflow 1) and a round started by a new product-owner decision do not count toward the three rounds»; in Workflow 5, «a pre-implementation round on the final texts is the feature review when the code-reviewer confirms the strings equal them». The overlap in 100 is cheaper to keep than to merge (one shared finding list per round would need a coordinator); "Findings with one cause are one fix" in `slice-review` already covers the triage.

### H3 "Seen red" (4)

- Files: 100 (the classifier refused taking a backend rule out for an E2E run, «Security Test Removal»; its pg test had been red), 292 (guard tests of new limits pass on the base commit; red only by taking the guard out, code review C-3), 71 (cases the tracer's general rule already covered passed at once), 419 (a changed default value has no behaviour short of pinning the string).
- What the rule caught: 292 C-3 (red not shown); earlier R-217 C-29, R-226 C-4 (G6).
- Proposal: as G6, still open in the part not applied by T6. Add to Workflow 2: «a scenario added after the rule it covers may take its red from the lower-layer test of that rule seen red, when taking the rule out is refused; a test of a case the general code already covers is kept as characterisation and says so; a changed default or configuration value with «Scenario: none» in the issue needs no test». 292's case is already Workflow 2 («taking the code out again»); no change.

### H4 Issue state during a task (5)

- Files: 211 row 1 («depends on #133»: #133 decided but not implemented, no `entscheiden` label; the task stopped only at domain review V-3), 211 row 4 (#211 and #281 closed as duplicates of #408 mid-task; a marker named #281, both reviewers raised a Major), 424 row 4 (a second session found another's merged pull request for #424 only at the merge of `main`, after three review rounds), 132 (a decision-style "Done means" while "Decided" asks two implementations; option 4 split into #338), 222 W-6 (`gh api search/issues` refused with 403; listing `repos/rudini/Dwello/issues` worked).
- Cost: in 424 a whole implementation and three rounds; in 211 a red slice and two Majors.
- Proposal: "Open work": «an issue naming "depends on #n" is ready only when #n is closed or the issue says what to do until then»; «at the start and before each review round, re-read the state of the issue, of every issue the markers and plan name, and look for an open or merged pull request that closes it (`search_pull_requests`)»; name `gh api 'repos/rudini/Dwello/issues?state=open'` as the search when `search_issues` is missing. 132: as G1 (applied for the close; the template could open the implementation issue when the decision is recorded).

### H5 Browsers, network and load in cloud sessions (5)

- Files: 424 rows 1, 2, 5 (all four projects at once put over 1000 apartments into `dwello_e2e`, 30 failures that CI does not show; Firefox and WebKit needed `cdn.playwright.dev`, `playwright.download.prss.microsoft.com` and `playwright install-deps`; a Firefox-only fix cannot be seen green on a pull request, so five shards ran locally for about an hour), 222 W-5 (1198 launch failures: only Chromium in the image), 132 (persona build plus DOM vitest, exit 137: as G13), 78 (network policy refused six-group.com, paymentstandards.ch, fedlex; field check rests on `mmx search` snippets and the `swissqrbill` package), ci-main (shard re-balance needed a 30-minute timing run).
- Proposal: "Before marking anything complete": «locally Chromium is enough when other browsers cannot start; a change aimed at Firefox or WebKit runs the five shards one after another (`--shard=i/5`), or, better, a pull-request label that runs every browser in CI». Gotchas "Cloud sessions": the two hosts and two commands. "One build": as G13, with 132 as the third out-of-memory case. "Web search": a primary source behind the policy is read via `mmx search` plus a package that implements the standard, unconfirmed points go to the report (2877e3de now asks where they were looked for); allowing six-group.com and fedlex.admin.ch is the product owner's environment setting. Keep the shard timing recipe in `docs/test-pyramid.md`.

### H6 Merge and push while blocked (3)

- Files: 71 (two decision Majors, one confirmed outside the decided requirement; pull request unmerged, the coordinator's merge request unmet), 78 (a Major that existed before, tracked as #395; a green #78 waits), 211 row 3 (a blocked task's commits live only in the ephemeral container; issue comments name a branch nobody can see).
- What the rule caught: nothing in these notes.
- Proposal: as G19 and T5 (still open: `pull-request` line 28 keeps the stricter reading), with 78's condition: «a Blocker/Major tracked in its own issue that the change does not make worse does not block the merge». New: Workflow 9 «a task that ends blocked pushes its branch without a pull request, so the work survives the container».

### H7 Scenario-first scope (3)

- Files: 77 (a corrected legal help text got only a DOM test, as #89 had done; code review Major, a second round and an E2E run), 419 (measurement turned «configuration only» into a fix the landlord sees; closing review C-1 asked for the scenario), 424 row 3 (existing Firefox/WebKit scenarios showed every fix red; the PR said so instead of `No scenario`).
- Proposal: one sentence in Workflow 1: «a corrected help or hint text counts as a visible fix; when a task's finding turns the issue's «Scenario: none» into a visible fix, the scenario comes before the fix; an existing scenario that shows the fix red is named in the pull request instead of a new one».

### H8 Branch start and upstream (3)

- Files: ci-main (`git switch -C <branch> origin/main` sets the upstream to `origin/main`: a bare `git push` would go to `main`; the stop hook counted 41 commits against a stale `origin/<branch>`), i1 (as in 358; after the same command the hook reported 6 or 7 unpushed commits for 1 or 2), 292 (detached start without a named branch: as G12).
- Proposal: Gotchas "Branches": `git fetch --prune origin main` and `git switch -C <branch> --no-track origin/main`; this removes the wrong upstream and, once the merged remote branch is pruned, the hook's wrong count. Detached start: as G12.

### H9 Reviewer agents and persona data (5)

- Files: 71 row 2 (`daten-pruefer` had no session for the persona backend: no detail page, no fr/it/en PDFs), 71 row 3 (as G11: no `bun test` in the worktree), 77 (`fach-reviewer` proposed «terme de résiliation», against «terme de congé» in `i18n-begriffe.md`; `i18n.test.ts` caught it), 211 row 5 (a partial statement made by SQL on `period_end` alone; another persona reported the contradiction as a Major, rejected), 429 (unclear whether a displayed total counts as «amounts»; 36 totals confirmed, nothing found: as G18 and T8).
- Proposal: in `daten-pruefer.md`, «the caller creates the PDFs in each language it needs before starting it», or a session cookie like the E2E fixture; in `fach-reviewer.md`, «check a fr/it/en wording against `docs/design/i18n-begriffe.md` before proposing it»; personas README "Running a review": «make a state through the app or the seed API; SQL on one column only with every persona that shares the database told which records changed».

### H10 Glossary edits (2)

- Files: 429 (the issue lists the rows and asks only for confirmation; the session wrote them, code review C-1 Major for the missing confirmation; the task waited), 66 row 3 (the product owner wrote «ergänze Glossar»; the session's definition was corrected by fach-review M-1, confirmation still open).
- Proposal: «when an issue names the glossary rows, or the product owner asks for one, the session writes them; the product owner's confirmation of the wording is a "Done means" item, asked together with the issue's other open points». Keeps «never edit it» for everything else.

### H11 Single points

- 292: `sameEverywhere` in `tests/e2e/questions/language.ts` (a German source title cited in every language) is in no rule; second note after `82-178` (T-review "New"). Name it in `tests/e2e/CLAUDE.md` next to the language check.
- 419: a model change without a prompt change needs one `llm:eval` of the new model (as G24, R-217 W-1); `backend/CLAUDE.md` now covers the cloud run only.
- 66 row 1: part of a decided issue wrong in law: shipped with `Refs #66`, `entscheiden` set (as G14, still open).
- 222 W-3: a slice that changes only `messages/*.json` and the tests pinning them needs no `tdd`/`ponytail` Skills line (C-1 raised it); keep `Test red`.
- i1 row 1: three plan conflicts from other branches' sections (as G23); i1 row 3: the dashboard seed sets the deadline after sending and loses the PDF (a step fix, not a rule).
