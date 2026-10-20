# Collected workflow review (2026-10-20)

Collected review per skill `workflow-review`, "Collected review", asked for by the product owner («Analysiere die workflow reviews der letzten 24h … wo man Token sparen könnte»). Only findings and proposals; nothing here is applied. The product owner decides which to apply.

## Files covered

In no collected review yet (the last one is `workflow-rules-review-2026-10-19-2.md`, groups J1 to J5; points it or `workflow-rules-review-2026-10-19.md` (H1 to H11) already propose are cited «as in …» with only what is new):

- Notes (11): `workflow-notes-tokens.md`, `workflow-notes-ci-less-runs.md`, `workflow-notes-invalid-id-and-statement-gap.md`, `workflow-notes-issue-199.md`, `-448.md`, `-450.md`, `-451.md`, `-453.md`, `-458.md`, `-461.md`, `-479.md`.
- No per-task review.
- For the token part also the review reports of the same tasks (`199-*`, `448-*`, `450-*`, `451-*`, `453-*`, `455-*`, `458-*`, `461-*`, `479-*` in `docs/reviews/`, persona reports in `docs/design/personas/`), counted by file and size, not re-judged.

Older notes such as `workflow-notes-issue-100.md` are not named by file in any dated review either; they were covered before the dated reviews named files, and are left out.

## Groups

| # | Rule location | Count | Proposal |
|---|---|---|---|
| K1 | One session in `implementation_plan.md` (Workflow 8, `open-work.test.ts`) | 9 (+1 in J1, +3 in I1) | Parallel case: checklist in the pull request, session straight into the archive; a merged pull request's session counts as finished |
| K2 | Sessions without the Agent tool (Workflow 4, 5, skill `slice-review`) | 4 | Fixed hand-over format for reviewer prompts; draft pull request when no coordinator exists |
| K3 | Parallel workers sharing one container (scratchpad, migration numbers, E2E lock, timeouts) | 8 | Worker prefix, migration number taken at the last merge, affected features as the local E2E duty |
| K4 | Glossary edits ordered by the product owner (Design-Regeln «never edit», `pull-request`) | 3 | As in H10; new: record the order as a line in «Decided (product owner)» |
| K5 | fallow duplication on touched files (Gotchas «Commit gates») | 2 | As in J4; new: inherited when the changed lines lie outside the clone block |
| K6 | Round limit and the closing round (Workflow 7) | 1 | The closing round before a push has its own three rounds (state what `pull-request` step 2 already implies) |
| K7 | Red run of review-fix scenarios (Workflow 2) | 1 | As in H3; new: skip the E2E red run when the lower-layer test of the same fix was seen red |
| K8 | "No scenario" kinds (`tests/e2e/CLAUDE.md`) | 1 | Sixth kind: a global `configuration` state that would break parallel scenarios |
| K9 | Persona round against an outside service (personas README) | 1 | One probe call through the persona stack before starting personas (the proxy fix is already in `persona-stack.sh:26-27`) |
| K10 | "More visible" for an existing finding ("Done means") | 1 | «Visible in the persona's task of this change» counts as more visible |
| K11 | Native reads and ICU escapes (`slice-review` «Triage») | 1 | Native reads list keys with placeholders or escapes apart; or a render test over all messages with braces |
| K12 | Later decision vs. prescribed text (Coding guidelines) | 1 | The later decision wins, the pull request names both |
| K13 | Harness-only points (Bash guard, stop hook, `/compact`) | 5 | No repo change; as in H8 for the stop hook |
| T1–T7 | Token cost of the workflow | – | See "Token" below |

### K1 One session per plan (9, plus J1 and I1)

- Files: 199, 448, 450, 453, 458, 461 (ten parallel workers; the coordinator ruled «checklist in the pull request, session straight into the archive»), ci-less-runs and invalid-id (Session C1 of a merged pull request stayed open on `main` with its item "PR" unticked), tokens (a `###` part under another session).
- Cost: every worker hit it at once; three tasks touched another session's text; the coordinator had to issue the same ruling ten times.
- What the rule caught: nothing in these notes; the test guards against a forgotten archive move, which K1's second half also covers.
- Proposal: in Workflow 8, two sentences: «With parallel sessions (a coordinator's workers) the checklist lives in the pull request description and the session goes straight into the archive at the end; `implementation_plan.md` stays untouched.» and «A session whose pull request is merged counts as finished: tick its "PR" item with the pull request number when archiving; CI results after the archive go into the pull request, not the plan.» This is the third review in a row with this group (H/I1, J1, K1).

### K2 Sessions without subagents (4)

- Files: 453, 199 (every reviewer ran through the coordinator, one round trip each, six rounds in 199), invalid-id (no coordinator: nothing pushed although the product owner asked for a merge), 461 (#501 decided by the coordinator).
- Proposal: in `slice-review`, a short «Hand-over» block: the fields a worker sends (requirement, worktree, range with pathspec, checks run, report path, round number). In Workflow 4/5: a session with neither subagents nor a coordinator pushes, opens a draft pull request and names the missing reviews under "Blocked on me".

### K3 Parallel workers in one container (8)

- Scratchpad overwritten without a worker prefix: 199, 448, 451.
- Migration numbers 0026/0027 taken by three branches, renamed on every merge: 448, 461.
- E2E: a full local run took 40–60 minutes under load 23 on 4 CPUs, a queued run broke on a Paraglide regeneration (453), `webServer` timed out (199); the coordinator limited local runs to the affected features: 450, 461, 199, 453.
- vitest 5 s timeouts in `tools/` and `tests/unit/` under load, green alone: 199.
- Persona servers lost after a container restart, `persona-stack.sh` always recreates `dwello_persona` and would drop the persona's records: 199.
- Proposal: (a) `CLAUDE.md` «Cloud sessions»: scratchpad files start with the worker or session name; (b) `backend/CLAUDE.md`: the migration number is fixed at the last merge of `main` before the push; (c) `tests/e2e/CLAUDE.md` «Run»: the affected features (`-g` over their tags and their axe rows) are the local duty, the full suite is CI's, and no Paraglide regeneration or merge while a queued run waits; (d) `persona-stack.sh --keep-db`; (e) a longer timeout only for the process-spawning tests in `tools/`.

### K4 Glossary edits (3, plus H10)

- Files: 199 (#487), 448 (#484, V-15), 453 (#480): each time the product owner ordered the edit through the coordinator, against «never edit».
- Proposal: as in H10. New: the order is a line in the issue's «Decided (product owner)» naming the rows; then the pull request writes them and says so.

### K5 fallow on inherited clones (2, plus J4)

- Files: 448 (an 8-line clone across five list pages, a component extracted only for the gate, later obsolete), 451 (the change was routed through another file to keep `invoices/+page.svelte` untouched).
- Proposal: as in J4. New: count a clone group as inherited when the changed lines lie outside the cloned block. Two workarounds in one day changed the shape of the code to please the gate.

### K6 Closing round limit (1)

- File: 451 (a fourth round for C-12, C-13; the coordinator allowed it).
- `pull-request` step 2 already says the closing round is «its own slice for the round limit»; Workflow 7 does not. Proposal: one clause in Workflow 7 pointing there.

### K7 to K12 Single points

- K7 (451): taking two fixes out by script and running the scenarios red cost about 10 minutes under the E2E lock. Proposal: as in H3, plus the exception named in the table.
- K8 (450): the PDF refusal on an incomplete Firmenadresse; the reason had to be argued with two reviewers. Proposal: the sixth kind in the table.
- K9 (479): a whole persona round (five agents, about 93 KB of reports) answered «nicht erreichbar» because Node's `fetch` ignored the proxy. The script is fixed; the README still lacks the probe.
- K10 (479): Sven's P-2 was on the base commit but became far more visible; first a row, then a fix.
- K11 (461): about 170 pasted values, one doubled escape caught only by 461-review-2 C-6.
- K12 (453): «Geleistete Akontobeiträge ab {date}» vs. #477's «Akontobeiträge»; the coordinator relayed which wins.

### K13 Harness-only (5)

- Bash guard refusing loops, heredocs, `$VAR` before `sed`, `flock` with `|` (448, 451, 453, 199): each needed a script file. No repo change; at most a line in «Formatting» to format one file per command.
- Stop hook asking four times to push while personas wrote (479): as in H8.
- `/compact` cannot be run by the agent (tokens): check after a few sessions whether the 30 % autocompact fires.

## Token

Counted for the nine tasks above (mostly within the last 24 hours): 46 `code-reviewer` rounds, 22 `fach-reviewer` rounds, 5 `daten-pruefer` runs, 6 native reads, 24 persona runs, together about 100 subagent runs and about 1.1 MB of reports (830 KB review reports, 300 KB persona reports). Each subagent loads `CLAUDE.md` (21.7 KB, about 6k tokens) and its agent file before reading any code.

| # | Where | Evidence | Proposal | Saving (rough) |
|---|---|---|---|---|
| T1 | Merge reviews (`pull-request` step 2 and «Open and drive») | 7 rounds mainly on a merge of `main` or its conflict (448-5, 448-6, 451-6, 451-7, 199-5, 450-6, 458-5), together about 33 KB; one finding in all of them (C-20 in 451-6, Minor: a merge lost a reviewed Italian text in `pdf.service.ts`). Several conflicts were only in `tests/e2e/fixtures/` (448-5) or in `messages/` keys. | Review a merge only when `git show --remerge-diff <merge>` is not empty in `src/`, `backend/src/`, `backend/migrations/` or `messages/`; a clean merge or a conflict only in `tests/`, `docs/` or generated files gets a one-line note in the next round instead. C-20 would still have been found (it is in `backend/src/`). | about 7 subagent runs per day at ten workers |
| T2 | How often `main` is merged (`pull-request` «Merge a newer `main` … when GitHub refuses the merge because the branch is behind») | 451 merged `main` five times, 448 four times, 199 three times in one day; each merge restarts CI, often an E2E run and a review round. | Check whether the branch protection «Require branches to be up to date» is needed; without it a merge of `main` happens only for a real conflict or a red check that `main` fixes. Or merge pull requests in a fixed order so each branch merges `main` once. | T1's runs plus full CI runs |
| T3 | Rounds per slice (Workflow 7) | code-reviewer rounds: 451: 8, 448: 6, 450: 6, 461: 6, 199: 5, 458: 5. Four of them reviewed only a CI fix in `tests/e2e/` (450-5, 458-4, 461-5, 451-8), each 2–8 KB, no Blocker/Major. | A CI fix that only touches `tests/e2e/fixtures` or step files, with a green run, goes into the next round that already runs (or the merge round), not a round of its own. | 3–4 runs per day |
| T4 | Report length (agent files `code-reviewer`, `fach-reviewer`, native read prompts) | fach-reviews 14–24 KB each (458-fachreview-1: 21 KB), native reads 35–39 KB each (3 per task in 453, 461), first code reviews 6–13 KB. The caller reads every report into its own context, and the next round reads the previous one. Short re-reviews (448-4: 3 KB) show the form that is enough. | Fix a form: findings table, status of open IDs, «Nicht bestätigt»; no prose of what was confirmed. Native reads return only the keys they change (key, old, new), not the whole message set. | the native reads alone about 70 KB per task; reports roughly halved |
| T5 | Persona runs (personas README, «Which personas») | 24 runs, 9–19 KB each; 479 used five (93 KB), one whole round wasted (K9). | Keep «at most two»; add the probe of K9 before a round; a persona re-run only for the screens its Blocker/Major was on. | one round of 5 in 479; 1–2 re-runs per task |
| T6 | Domain rounds (Workflow 1, 5, 7) | fach-reviewer: 448: 4, 451: 3, 455: 3, 479: 3, and a second round in 461 only for the native reads' text changes. | As in H2; new: native reads run before the step-1 fach-review is closed, so their legal-text changes go into the same round (as done in 461). | one round per task with native reads |
| T7 | Fixed context per agent (`CLAUDE.md`, agent files) | `CLAUDE.md` 21.7 KB is loaded by every one of about 100 subagent runs; the reviewers need only Conventions, Design-Regeln and parts of Workflow. `docs/archive/implementation-plan-verlauf.md` is 335 KB and grows with every session (appended, not read, in these notes). | Move the Workflow steps the reviewers never use (8, 9, "When to ask", the closing headings) into the skills that run them (`pull-request`, `workflow-review`), so `CLAUDE.md` shrinks for every agent. Keep the archive append-only (`cat >>`), never `Read` it. | about 2k tokens per subagent run, cached, so mostly latency |

T1, T2 and T4 save the most; T1 and T3 are each one sentence in `pull-request` and `slice-review`.
