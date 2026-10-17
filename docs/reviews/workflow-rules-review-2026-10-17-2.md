# Collected workflow review (2026-10-17, 2): token cost

Collected review per skill `workflow-review`, "Collected review", asked for by the product owner with one question: where can the workflow save tokens? Only findings and proposals; nothing here is applied. The product owner decides which to apply.

## Files covered

- Notes written 2026-10-17 (15): `workflow-notes-issue-133.md`, `-issue-65.md`, `-issue-82-178.md`, `-issue-83-84.md`, `-issue-94.md`, `-issue-356.md`, `-issue-86.md`, `-issue-351-249.md`, `-issue-357.md`, `-issue-160.md`, `-issue-358.md`, `-issue-363.md`, `-issue-378-379.md`, `-issue-76-119.md`, `-w3d.md`. Five of them (`133`, `82-178`, `94`, `378-379`, `76-119`) are in no collected review yet; the other ten are in `workflow-rules-review-2026-10-17.md` and are read here again only for their cost.
- Notes of 2026-10-16 that `workflow-rules-review-2026-10-17.md` left out (4): `workflow-notes-issue-250-254.md`, `-issue-201.md`, `-issue-204.md`, `-issue-166-219.md`.
- `workflow-rules-review-2026-10-17.md` (the first collected review of the day), for its groups G1 to G23.
- The reviewer reports committed on 2026-10-17 as a measure of cost (no note counts tokens): 134 files in `docs/reviews/` and 36 in `docs/design/personas/`.

The repository holds no token counts. Cost below is measured by what can be counted: subagent runs (one report each), report size (1 KB is about 300 tokens written, then read again by the caller and by the next round) and extra turns of the main session. Severity counts are table rows (`| Major |`), so a finding repeated in a later table counts twice.

## What a day costs

| Kind of run | Runs | Avg. report | Sum | Runs with a Blocker/Major |
|---|---|---|---|---|
| `code-reviewer`, slice and closing rounds | 54 | 6 KB | 330 KB | 21 |
| `code-reviewer`, merge and close rounds | 21 | 6 KB | 130 KB | 7 |
| `fach-reviewer` | 26 | 17 KB (max 35 KB) | 444 KB | 17 |
| `daten-pruefer` | 6 | 8 KB | 48 KB | 1 |
| `persona` | 36 | 11 KB | 387 KB | 20 |

About 140 subagent runs and 1.5 MB of reports in one day. Each run also loads `CLAUDE.md` (20 KB), its agent definition and the files the agent reads every time (`code-reviewer`: `ponytail-review/SKILL.md`; `fach-reviewer`: `UBIQUITOUS_LANGUAGE.md` and two requirement documents), before reading any of the diff.

## Proposals, largest saving first

| # | Rule location | Count | Proposal |
|---|---|---|---|
| T1 | Workflow 4 and 7, skill `slice-review` "Rounds" (feature-review fixes form a new slice; a closing round before each push) | 19 rounds | A Minor/Nit fix gets no review round of its own |
| T2 | Gotchas "Branches" (merge-commit review) and skill `pull-request` (merge `main` before each push) | 21 rounds, 5 notes | One merge, reviewed in the closing round |
| T3 | Agent `fach-reviewer`, report format | 26 runs | Rows only for Minor/Nit, delta only on a re-review |
| T4 | Closing round on a delta of reports and plan only | 6 rounds | No round for a delta in `docs/reviews`, `docs/design/personas`, the plan or the archive |
| T5 | "Done means" vs skill `pull-request` on product-decision Majors (G19) | 5 notes + coordinator | Merge the decided part; stop the extra merges and check-ins |
| T6 | Workflow 2 «every new test was seen red» (G6) | 6 notes | No red run for a test that pins kept behaviour |
| T7 | Workflow 6 and Coding guidelines, a reviewer finding against a decided text (G15) | 3 notes | Straight to `entscheiden`, no fix-revert round |
| T8 | Workflow 5, `daten-pruefer` trigger (G18) | 6 runs, 1 Major | Narrow the trigger |
| T9 | Fallow gate vs `ponytail` review (G3) | 4 notes | Name the shape that passes both |
| T10 | Stop hook, permission prompts, machine load (G7, G13, G22) | 9 notes + coordinator | Extra turns and lost runs; change the hook and the ask rules |
| T11 | Always-loaded rules (`CLAUDE.md`, 20 KB) | every run | Move rules that only some tasks need into skills |

### T1 Rounds after a clean round

- Evidence: of the 54 numbered rounds, 19 followed a round of the same session with no Blocker/Major (`204-6`, `search-2`, `w2d-3`, `w3e-2`, `w3f-3`, `w3f-4`, `w5d-4`, `w5d-5`, `w6e-3`, `w7e-3`, `w7e-5`, `w7e-6`, `w8c-2`, `w8c2-2`, `w8d-3`, `w9c-2`, `w9d-2`, `w11-2`, `zip-4`; `w3f-4`, `w5d-4` and `w5d-5` are merge rounds, see T2). Two of them found a Major: `w7e-review-3` C-1 (a 404 exception copied into `load`) and `search-review-2` C-1 (a decided help text changed, a T7 case). The other 17 found Minors and Nits about the plan, reports or wording. They come from three rules adding up: every slice gets a review (Workflow 4), fixes of feature-review findings form a new slice (`slice-review`, "Rounds"), and a closing round before each push reviews what is not reviewed yet (Workflow 7).
- What the rule caught: the two Majors above (`search-review-2` C-1 would also be caught by T7); persona-fix slices with new behaviour (W2e, W10c) found Majors in their first round.
- Proposal: in `slice-review`, "Rounds": «A slice that only fixes Minors/Nits or rewords a reviewed text gets no round of its own; the closing round reviews it. A feature-review fix that adds behaviour is a slice.» Saves about one round per task (10 to 15 runs a day).

### T2 Merges of `main`

- Evidence: 21 merge and close rounds today, up to five per session (W9c: `w9c-review-merge` to `-5`; W6d: four; W10c: five with the close rounds). Each newer `main` from a parallel session meant another merge, another merge-commit review and often another CI run. 7 of 21 found a Major, mostly in the conflict resolution (`merge-review-2`/`-3`, `w10c-close-review-1` with seven, `w10c-merge-review-2`, `w9c-review-merge`). Notes `358` (an append conflict dropped closing brackets) and `378-379` (finish line waiting on another open pull request) show why the review is useful; `133`, `82-178`, `94`, `204`, `250-254` show why merges repeat: the pull request waits (T5) while `main` moves.
- Proposal: in Gotchas "Branches": «Merge `main` once, right before the push, and review the merge in the closing round (one `code-reviewer` run for both). While a pull request waits on the product owner, do not merge newer `main` again until it is ready to merge.» Keeps what the merge review caught, drops about half of the 21 runs.

### T3 `fach-reviewer` reports

- Evidence: average 17 KB, three times a code review; `w9c-fachreview-1` 35 KB. The agent writes evidence, why and fix for every finding, Minor and Nit included, and lists each confirmed rule (`w2e-fachreview-2`: 18 Minor rows with full sections, plus a numbered «Bestätigt» list). A second round repeats the whole table of round 1 with status (`w2e-fachreview-2` «Runde 1: Stand der Befunde», `w7e-fachreview-2`, `w9c-fachreview-2`), and its new findings are mostly Minor/Nit (`w2e-2`: 0 Majors in its own words, 18 Minor and 12 Nit rows; `w7e-3`, `w10c-3`, `w3f-2`, `w6d-2`, `w8d-2`: no Major). `code-reviewer` already says «A Minor/Nit needs nothing beyond its row».
- Proposal: copy that line into `.claude/agents/fach-reviewer.md`, and add for both reviewers: «On a re-review, report only the status of the open IDs and new findings in the delta; confirmed rules are not listed again.» This halves the largest kind of report without dropping a Major.

### T4 Closing rounds on reports and the plan

- Evidence: `zip-review-4` read five files, three of them review reports and the plan; `w8b-review-5`, `w5b-review-4`, `w3f-review-3` similar. Findings of these rounds are about the plan or reports (`w9c-review-2` C-3 «findings stay out of the plan», `search-review-2` C-2 a persona report not committed, `w6e-review-3` C-11 a plan line in a merge).
- Proposal: Workflow 7, closing round: «Changes only in `docs/reviews/`, `docs/design/personas/`, `implementation_plan.md` and `docs/archive/` need no closing round.» A plan check, if wanted, belongs in `open-work.test.ts`, which runs for free.

### T5 Pull requests that wait on a product decision

- Evidence: notes `133`, `82-178`, `94`, `204`, `250-254` and the coordinator (12 of about 45 pull requests green but unmerged): a Major that only needs a product decision may stay open under "Done means", but `pull-request` forbids the merge. Each waiting pull request then costs more merges of `main` (T2), CI runs, check-ins and a closing round when it finally merges.
- Proposal: as G19 in `workflow-rules-review-2026-10-17.md`; the token saving adds a reason. When the Major is moved to an `entscheiden` issue and the decided part meets its issue today (`250-254`), the pull request merges.

### T6 Red runs for tests that pin kept behaviour

- Evidence: `133` (Akonto test green from the start), `250-254` (scenario of existing behaviour), `351-249` (bug `main` already fixed, texts already right), `378-379` (added assertion), `201` (two extra E2E builds with code taken out by `sed`), `166-219` (taking code out in a compound command stalled 30 minutes on a prompt). Each red run is two edits, a test or E2E run and a revert, in the main session with its full context.
- Proposal: as G6, narrowed: «A test or scenario that pins behaviour the change keeps, or that an issue asks for on existing behaviour, needs no red run; the plan names it as such.» The code reviewer already judges red tests by reading (`code-reviewer.md`, "Red tests").

### T7 Decided texts and reviewer findings

- Evidence: `76-119` (fach-reviewer Major M-1 added a sentence to a decided text, code-reviewer Major C-3 asked to revert it: one fix, one revert, one extra round each), `166-219` (three rounds rewording a decided hint), `204` (persona Major against a decided text).
- Proposal: as G15: «A finding whose fix changes a text an issue decided goes to an `entscheiden` issue at once; the text is built as decided.» Tell reviewers in the prompt which texts are decided (`slice-review`, "The prompt").

### T8 `daten-pruefer`

- Evidence: six runs, one Major (`w6d-datenpruefung-1`); four found nothing (`w10c`, `w2e`, `w5d`, `w9d`). Each needs a persona's records first, so it also waits on a persona run.
- Proposal: as G18; run it only when the change alters a formula, an amount or what a PDF or QR-bill prints, not for a change of text or a screen around them.

### T9 Fallow gate and `ponytail`

- Evidence: `133`, `94`, `357`, `358`: the CRAP gate forced derived values or new components; in `94` the code reviewer then asked to inline them again (C-14), costing another fix and round.
- Proposal: as G3, plus one line in `code-reviewer.md`: «A shape the fallow gate requires (derived values, a split component) is no ponytail finding.»

### T10 Extra turns that do no work

- Evidence: stop hook asked to commit and push four to five times per task (`86`, `358`, `76-119`, `250-254`); every answer is a full turn of the main session, with its whole context read again. Permission prompts in unattended sessions (`82-178`, `204`, `166-219`) stalled a session until the coordinator noticed: the coordinator's polling turns cost too. `358`: two container restarts (exit 137) lost a background E2E run, which had to run again.
- Proposal: as G7 (change the hook outside the repo: skip a branch without a pull request), G22 (allow `rm` in the scratchpad) and G13 (one heavy run at a time). No repository rule saves these turns; the hook and `.claude/settings.json` do.

### T11 Always-loaded rules

- Evidence: `CLAUDE.md` is 20 KB, loaded by every session and every one of the ~140 subagent runs. Parts of it apply only to some tasks or to the main session: "Design-Regeln" "Process" (a11y states), "Open work" (issues and markers), Workflow 8 and 9 (plan, pull request), "When to ask". Reviewers do not use them; their agent definitions repeat what they need.
- What the rules catch: nothing in the notes says a reviewer needed these sections.
- Proposal: move "Open work" and Workflow 8 to 9 into the skills that already exist for them (`pull-request`, `workflow-review`, a short pointer stays), and the a11y "Process" into `bdd-acceptance`. Prompt caching makes a repeated `CLAUDE.md` cheap within one session, but not across 140 fresh subagents; a smaller file saves on each of them. Lower value than T1 to T4, and a larger edit: decide last.

## Points of the five new notes that are not about cost

Grouped with `workflow-rules-review-2026-10-17.md`, only what is new:

- G12 (branch at start): `133` as in `129` and `357`.
- G19 (merge with a product-decision Major): `133`, `82-178`, `94`; see T5.
- G9 (E2E isolation): `94` (a global setting written by every scenario races on a fresh database, O-36), `76-119` (a preselection from shared settings cannot be checked; the scenario checks what the page says, a unit test checks the choice).
- G14 (partial delivery): `378-379`, a finish line that depends on another open pull request: merge `main` after it lands, else `Refs #n`.
- G8 (collected review with parallel sessions): `378-379`.
- G15 (decided texts): `76-119`; see T7.
- G10 (No scenario): `82-178`, a state the upload API cannot reach (server time); what replaces the axe check is open.
- G11 (`slice-review` prompt): `82-178`, shell rules for unattended reviewers belong in the agent definitions.
- New: `94`, `backend-codes.test.ts` finds `CodedError(` and `refusal(` only, so codes of subclasses (`new ReminderError('REMINDER_…')`) are never checked for a `backend_<code>` message. A test gap, not a rule; it belongs in an issue if the product owner agrees.
- New: `82-178`, the language check's list of names that stay the same in every language (`tests/e2e/questions/language.ts`) is not mentioned next to `sprachen-bildschirme.feature`.
