# issue-triage skill: review against "Getting the most out of Opus 5.5" (round 2, delta)

- Delta: `git diff a1043b7..f7e0650`. I read `.claude/skills/issue-triage/SKILL.md` in full at f7e0650 (63 lines), plus the `implementation_plan.md` diff and `docs/reviews/issue-triage-review-1.md` (the parallel code review, C-1 to C-8).
- Scope: the delta and the open findings G-1 to G-12. G-13 (model choice) is noted in the plan and is not re-reviewed.
- Run model as before: a nightly unattended routine on Haiku. The Haiku notes are inferences; I did not run the skill.

## Status of round-1 findings

| ID | Sev. | Status | Evidence at f7e0650 |
|---|---|---|---|
| G-1 | Major | fixed | `SKILL.md:57-63`: a "Report" section uses the three CLAUDE.md headings, with the owner's items under "Blocked on me" first. `SKILL.md:10` names this as the one CLAUDE.md rule that applies. |
| G-2 | Major | fixed (remaining gap in G-15, Nit) | `SKILL.md:53-55`: "When to stop" stops the run without retrying on a failed write, a failed step-6 check, or rate limiting, and rules out a second `Triage:` comment. |
| G-3 | Major | fixed (follow-up in G-16, Minor) | `SKILL.md:51`: `issue_read` before the write, the full list rebuilt from the fresh labels, a second read afterwards, and the run stops on a missing label. `SKILL.md:12` names `method: "update"`. |
| G-4 | Major | fixed | `SKILL.md:10`: "This is not a code task: the `CLAUDE.md` workflow (plan, tests, reviews, opening issues or `offene-punkte.md` rows) does not apply, except …". |
| G-5 | Major | fixed | `SKILL.md:8`: "never stop to ask or to offer to continue: work through every picked issue, then report." This does not conflict with "When to stop": stopping on a failure is not asking. |
| G-6 | Minor | fixed | `SKILL.md:16`: "The 20 oldest … (all of them if fewer) carry `triaged`." |
| G-7 | Minor | partly fixed, rest in G-14 | `SKILL.md:32` now sends skipped issues to step 6. `SKILL.md:17` still says "Each of them has its label gaps filled", but a skipped issue never runs step 3, so its gaps are not filled (see G-14). |
| G-8 | Minor | fixed | `SKILL.md:40-48`: the template uses `#<older>`, `#<n>` and `<label>`, with a note that they stand for real numbers. |
| G-9 | Minor | fixed | `SKILL.md:63`: "**Found:** … and what could not be checked." |
| G-10 | Minor | fixed in step 3, gap in G-18 | `SKILL.md:34`: the topic labels are defined in the skill (no longer attributed to CLAUDE.md), and non-functional points get no topic label. Step 5 and the template were not updated to match (G-18). |
| G-11 | Nit | fixed | `SKILL.md:31`: "for step 4". |
| G-12 | Nit | fixed | `SKILL.md:40`: "with only the lines that apply". |
| G-13 | Nit | noted (plan) | Not re-reviewed, as instructed. |

## New findings from the delta

### G-14 (Minor): after a broken-off run, the comment can say "Labels added" for labels that were never set

- Guide: "When a subagent reports back, check its evidence before you accept it." (a result must match what was actually done) and "Say what 'done' looks like" (`SKILL.md:17`).
- Skill `SKILL.md:40-47` / `SKILL.md:51` / `SKILL.md:32`: step 5 writes the comment, including "Labels added: `<label>`", before step 6 sets those labels. If the run stops between the two (a failed write, a rate limit, or a step-6 check: exactly the cases in "When to stop"), the next night's run sees the `Triage:` comment. Step 2 then sends the issue "straight to step 6", where "those from step 3" is empty, so only `triaged` is set. The issue keeps a comment claiming a label that it does not carry, and `SKILL.md:17` ("has its label gaps filled") is false for it. The report does not show it either, because the second run only "added `triaged`".
- Haiku: transfers. The resume path is mechanical, and a small model will follow step 2 literally.
- Proposed rewording for `SKILL.md:32`:
  > 2. **Skip done ones:** if the issue already has a comment starting with `Triage:`, an earlier run stopped halfway: take the labels listed in its «Labels added» line as the labels from step 3 (those the issue still lacks), and go straight to step 6.

  This also closes the rest of G-7.

### G-15 (Nit): the step-6 check catches lost labels but not unintended new ones

- Guide: "keep your own check before anything risky or hard to undo."
- Skill `SKILL.md:51`: "if a label it had before is missing, or `triaged` is not set, stop the run."
- Problem: the check never compares the result with the intended list. A misspelt or extra label, such as `Produkt`, or `duplicate` (which exists in the repository), passes the check unseen. GitHub creates an unknown label name when it is set on an issue. The plan relies on that for `triaged` (C-6: "exists after the first run"), so a typo would also silently create a new repository label. `SKILL.md:22` ("a label named below") reduces the risk but is not checked.
- Haiku: transfers. A typo or a capitalisation slip is more likely on a small model.
- Proposed rewording for the last sentence of `SKILL.md:51`:
  > Read it once more: the labels must be exactly the earlier ones plus those you meant to add, each spelt as in this skill (`fachlich`, `produkt`, `bug`, `entscheiden`, `triaged`). Otherwise stop the run.

### G-16 (Minor): when a label is lost, the run stops but the report does not name the label

- Guide: "look first for anything Claude is waiting on you for, like a decision it left open or a change it wants you to approve."
- Skill `SKILL.md:51` ("stop the run") and `SKILL.md:61` ("why the run stopped early, if it did").
- Problem: a missing earlier label is the one hard-rule breach the skill can cause ("never remove a label", `SKILL.md:25`). The run then stops, which is right, but nothing asks the report to name the issue and the label that went missing. "Why the run stopped" can be filled with "label check failed", and the owner has to search the issue timeline to repair it. Round 1 proposed putting the label back once. Whether to retry is a design choice; naming it is the cheap minimum.
- Haiku: transfers.
- Proposed rewording for `SKILL.md:61`:
  > - **Blocked on me:** suggested duplicates, unclear topic labels, non-functional points, and why the run stopped early, if it did (for a failed label check: the issue number and each label that is missing or unexpected).

### G-17 (Nit): "Done means" does not mention the stop case

- Guide: "With a clear finish line, it knows when it's done."
- Skill `SKILL.md:16-18` versus `SKILL.md:55`.
- Problem: a run stopped under "When to stop" cannot meet `SKILL.md:16`. That is intended, but a literal model may treat the stop rule and the finish line as conflicting and keep going after a failed write to reach "done".
- Haiku: transfers (inference).
- Proposed: append to `SKILL.md:16`: "…, unless the run stopped under "When to stop"."

### G-18 (Minor): a non-functional point gets no comment, because step 5 and the template were not updated

- Guide: "Say what 'done' looks like" (the steps must lead to the result they promise).
- Skill `SKILL.md:34`: "A non-functional point … gets none: the comment says it belongs in `docs/design/offene-punkte.md`". But `SKILL.md:40` says "Comment **only if** a label was added, a topic label is unclear, or a duplicate or related issue was found". A non-functional issue with no duplicates meets none of these conditions, so no comment is written. The template (`SKILL.md:42-49`) also has no line for it. The report lists non-functional points under "Blocked on me" (`SKILL.md:61`), but the issue itself says nothing. In passing: `SKILL.md:34` lists four kinds (security, operations, performance, accessibility), while `CLAUDE.md` "Open work" lists seven (it adds reliability, usability, maintainability).
- Haiku: transfers. "Comment only if" is a hard gate that a small model will apply as written.
- Proposed rewording:
  - `SKILL.md:40`: "**Comment** only if a label was added, a topic label is unclear, the issue is a non-functional point, or a duplicate or related issue was found."
  - Add a template line: `Non-functional: belongs in docs/design/offene-punkte.md (CLAUDE.md, "Open work"), <why>.`
  - In `SKILL.md:34`: "A non-functional point (as listed in `CLAUDE.md`, "Open work": security, operations, reliability, performance, usability and accessibility, maintainability) gets none".

### G-19 (Nit): the `entscheiden` heading is pinned to one level

- Guide: as in round 1, specific patterns work better than general ones. Here the pattern is too narrow.
- Skill `SKILL.md:35`: "the body has the heading `## Proposed (confirm before starting)`". CI (`tools/open-work/check-issues.mjs`, cited in C-8) matches the heading at any level (`^#+`). An issue that uses `###` gets no `entscheiden` from the triage, although CI requires it.
- Haiku: transfers. A literal string match is how a small model will read it.
- Proposed: "the body has a heading `Proposed (confirm before starting)` (any level: `##`, `###` …)".

## Delta in line with the guide

- The three-heading report with the owner's items first (G-1) matches "read what it needs from you first" and the guide's example CLAUDE.md format.
- "Never stop to ask or to offer to continue" (`SKILL.md:8`) is the guide's "keep going" rule adapted to an unattended run. "When to stop" (`SKILL.md:53-55`) is its counterpart for real failures, with no retry and no duplicate comment.
- The fresh read before writing and the check after it (`SKILL.md:51`) apply "keep your own check before anything risky".
- The finish line is now a target, not a cap (`SKILL.md:16`).
- The code-review fixes C-1 (no `entscheiden` for «Options») and C-4 (one rule for doubt: `SKILL.md:39`) remove two rules that competed with each other. This also makes the per-issue stop rule clearer than in round 1.
- No "think carefully" lines were added.

## Summary

| ID | Severity | Status |
|---|---|---|
| G-1 … G-6, G-8 … G-12 | 5 Major, 4 Minor, 2 Nit | fixed |
| G-7 | Minor | partly fixed; rest in G-14 |
| G-14 | Minor | new: false "Labels added" after a resumed run |
| G-15 | Nit | new: step-6 check misses unintended labels |
| G-16 | Minor | new: lost label not named in the report |
| G-17 | Nit | new: Done means vs. stop case |
| G-18 | Minor | new: non-functional points get no comment |
| G-19 | Nit | new: `entscheiden` heading pinned to `##` |

There are no open Blocker or Major findings.
