# Subagent effort: benchmark low, medium and high

Question: «Getting the most out of Opus 5.5» says that at its lowest effort Opus 5.5 caught more bugs than Opus 5 at high effort. Can the reviewer subagents run at `effort: low` without losing findings? Without an `effort` field a subagent takes the caller's session effort (frontmatter reference: «Overrides the session effort level»), so until now a session on low effort ran its reviewers on low too.

Method as in `agent-models-benchmark.md` (git history, 94082bd7): each agent ran once with `effort: low` and once with `effort: high` on an old commit whose findings are known, with the same prompt and the agent texts of `main` after #853. Code and domain reviewers got their own worktree of the old commit (node_modules linked from `main`); the persona ran against the persona stack of `70fbc67` with its own `bun install`, the database recreated between the two runs. Reports: `docs/reviews/agent-effort/` in the git history (`git show 294f77f6:docs/reviews/agent-effort/<run>.md`).

## A: `code-reviewer` on #233 round 3 (`1d9d3019..a09ae7f6`)

Reference `233-review-3.md`: C-11 Blocker (`fileType(row.file).then` reads a removed row), C-12 Minor (link inert until `fileType` resolves), C-13 Major (state «Hinweise zum Beleg» not in `screens.json`), C-14 Minor (no length limit on Rechnungsnummer), C-15 Minor (changed text M-6 not in axe/language checks), C-16 Nit (`?upload` stays in the address).

| Known finding | low | high |
|---|---|---|
| C-11 Blocker | not found | partly (C-5: the race as a test flake and a leaked object URL, not the wrong row) |
| C-12 | not found | found (C-5) |
| C-13 Major | found (C-1) | found (C-1, with why no run reaches it) |
| C-14 | not found | found (C-8) |
| C-15 | found (in C-1) | not found |
| C-16 | not found | found (C-7) |
| New | C-2 Minor (refactor of untouched code) | C-2, C-3 Major (no scenario for two visible texts), C-4, C-6 Minor (checks that cannot fail) |

Tokens: low 56k (11 tool calls, 1 min), high 115k (41, 6 min). **high clearly better; neither caught the Blocker fully.**

## B: `code-reviewer` on 790a (`ddce6ae..56635d3`)

Reference `790a-review-1.md`: C-1 Blocker (`@elysiajs/openapi` makes the global `uuid` format strict: 39 demo-data ids refused), C-2 Minor (`isRealDate` dead code).

| Known finding | low | high |
|---|---|---|
| C-1 Blocker | not found (C-2: the stricter `date` format, as a missing scenario) | not found (shown by a run that the import makes `date` strict, judged invisible to the user) |
| C-2 | not found | found (C-2) |
| New | C-1 Major (unrelated dependency bumps), C-3, C-4 | C-1 Major (reformatted untouched line), C-3, C-4 (stale comment and API doc) |

Tokens: low 30k (6 tool calls), high 91k (42; ran seven backend test files). **high better (closer to the Blocker's cause, the known Minor); neither found the Blocker.**

## C: `fach-reviewer` on #459 slice B step 1 (`35db6f79`)

Reference `459-B-fachreview-1.md`: R-1 Blocker (sent statement PDFs keep name and address, against Art. 6 Abs. 4 DSG and the decided texts), R-2 Major (`documents.recipient` keeps the e-mail address).

| Known finding | low | high |
|---|---|---|
| R-1 Blocker | not found | found (R-1, Blocker, same evidence) |
| R-2 Major | not found | found (in V-3 with `documents.title` and `file_name`) |
| Fedlex wording | not fetched, all legal claims **unsicher** | fetched through the SPARQL route of #853 (OR 1.10.2026, DSG 7.7.2025) |
| New | V-1 Major (a statement sent after move-out moves the date) | V-1, V-2 (same as low's V-1), V-4 Major, V-7 Minor (scenario fails from 2030) |

Tokens: low 24k (3 tool calls), high 118k (33). **high clearly better: low missed the Blocker and quoted no law.**

## D: `persona` Marco on `70fbc67` (#233)

Reference as in `agent-models-benchmark.md` C (7 known findings; Opus at the session's effort found 6).

| Known finding | low | high |
|---|---|---|
| P-1 credit note can be created as an invoice | not found | not found |
| P-2 credit-note hint names no amount | found (P-1) | found (P-1) |
| P-3 rows unchecked without a reason | not found | found (P-2) |
| P-4 preview above the fields on the phone | not found | not found |
| P-5 Akontozahlungen vs Akontorechnungen | not found | not found |
| P-6 red «Abbrechen und verwerfen» after creating | found (P-2) | found (P-3) |
| P-7 link text in two columns at 390 px | not found | observation |

Tokens: low 51k (15 tool calls), high 108k (36). **high better (4 of 7 vs 2 of 7).** Both ran one task path; the empty test PDFs kept both from comparing the file.

## E: `medium` against `high` (2026-10-26, same cases and prompts)

Run reports: `docs/reviews/agent-effort/*-medium.md`.

| Case | high | medium |
|---|---|---|
| A `code-reviewer` #233 | C-11 partly, C-12, C-13, C-14, C-16; two new Majors | C-11 and C-12 partly (C-2, C-3), C-13, C-16; C-14 not found; C-15 named outside the table |
| B `code-reviewer` 790a | C-2; Blocker not found | C-2; Blocker not found |
| C `fach-reviewer` #459 B | R-1 (Blocker), R-2 (in V-3), law fetched | R-1 (as Major), R-2 (in R-1), law fetched |
| D `persona` Marco #233 | P-2, P-3, P-6, P-7 (observation) | P-2, P-3, P-6 (observation), P-7 (observation) |

Tokens high → medium: A 115k → 108k, B 91k → 70k, C 118k → 91k, D 108k → 76k (6 to 30 % fewer). **medium found what high found in B, C and D and nearly so in A.** C's medium run read issue #459 on GitHub, which by now holds the product owner's answers to the original round; it says it judged by the decisions as of the commit, but the issue may have helped it. C rated the Blocker a Major; both block the merge.

## Decision

| Agent | Effort | Why |
|---|---|---|
| `code-reviewer` | `medium` | A, B: low missed known findings; medium found about what high found at 6 to 23 % fewer tokens |
| `fach-reviewer` | `medium` | C: low missed the Blocker and fetched no law; medium found the Blocker and the Major and fetched the law |
| `persona` | `medium` | D: low 2 of 7 known findings, medium and high 4 of 7; medium 30 % fewer tokens |
| `daten-pruefer` | `high` | Not measured; pinned so a low-effort session does not weaken the check to the Rappen |

Tokens, tool calls and durations come from the Agent tool's usage line of each run, not from the reports.

Limits: one run per level and case, so one run's luck weighs in; the reference reports came from Opus at the effort of their session, unknown today. A finding a later review shows that a `medium` reviewer missed is a reason to move that agent back to `high`.
