# issue-triage skill: review against "Getting the most out of Opus 5.5" (round 1)

- Skill: `.claude/skills/issue-triage/SKILL.md` at commit a1043b7 (worktree `review-triage-blog`), 51 lines
- Guide: claude.dev blog, 22 Sep 2026 (extracted text `review-triage-blog-source.txt`, read in full)
- Context read: `CLAUDE.md` ("Open work", "Workflow" 8, lines 76 and 78), `.github/ISSUE_TEMPLATE/task.md`, `decision.md`
- Run model: a nightly cloud routine, unattended, on Haiku, using GitHub MCP tools under the owner's account
- The owner's fixed decisions are taken as given: suggestions only, fill missing labels only, `triaged` marker, 20 oldest per night, one English `Triage:` comment, duplicate reported on the newer issue, up to 3 related issues, rules referenced from CLAUDE.md.

Every finding says whether it transfers to Haiku ("Haiku:"). I did not run the skill, so its behaviour on Haiku is not confirmed. The Haiku notes are inferences from the guide and the skill text.

## Findings

### G-1 (Major): the end-of-run report conflicts with the CLAUDE.md report format, and what the owner must act on is not first

- Guide: "When a long run ends, look first for anything Claude is waiting on you for, like a decision it left open or a change it wants you to approve." / "To change the summary's format, say so in CLAUDE.md, for example, 'End every run with three headings: Blocked on me, Changed, Found.'"
- Skill `SKILL.md:18`: "The run ends with a short report: per issue, the labels added and what the comment says (or "nothing found"); then the number of open issues still without `triaged`."
- Problem: `CLAUDE.md:78` says "End every run with three headings: Blocked on me, Changed, Found". The routine loads both files and gets two different formats with no rule for which one wins. In a per-issue list, the items the owner has to decide (a possible duplicate, an unclear topic label, a failed write) are mixed in with "nothing found" lines.
- Haiku: transfers fully. A smaller model handed two format rules tends to mix them or pick one at random.
- Proposed rewording for line 18:
  > - The run ends with the three headings from `CLAUDE.md`: **Blocked on me**: issues the owner should look at (possible duplicates, unclear topic labels, writes that failed or were skipped, each with its number); **Changed**: per issue, the labels added and the comment link, or "nothing found"; **Found**: the number of open issues still without `triaged`, and what could not be checked (see "When to stop").

### G-2 (Major): there is no run-level rule for when to stop, only a per-issue one

- Guide: "Say what 'done' looks like and when you want it to stop and ask." / "Stop and ask me only if a test fails for a reason you can't explain."
- Skill `SKILL.md:8`: "Nobody answers questions during the run: when unsure, say so in the comment instead of acting." This covers doubt about one issue's content. Nothing covers the run itself failing: `list_issues` errors or returns a partial list, `issue_write` or `add_issue_comment` fails, a rate limit is hit, the label `triaged` (or a topic label) does not exist in the repository, or a fresh read shows labels that differ from the earlier list.
- Problem: unattended, "stop and ask" means "stop writing and report under Blocked on me". Without that rule the model may retry blindly or carry on with stale data. Retrying a comment can produce a second `Triage:` comment, which breaks "exactly one" (line 17). A misspelt label can also be created, because GitHub creates unknown labels when they are set on an issue.
- Haiku: transfers fully, and matters more on Haiku than on Opus, because Haiku is less likely to infer a safe stopping point on its own.
- Proposed new section after "Allowed actions":
  > ## When to stop
  > Keep going from issue to issue without asking or offering to continue. Stop writing to an issue, leave it without `triaged`, and list it under **Blocked on me** when: a GitHub call fails twice, a label you would add does not already exist in the repository (never create one), or the labels you read right before writing differ from what you expected. Stop the whole run (and report) when listing issues fails or the rate limit is reached. Never retry `add_issue_comment` without first re-reading the comments for a `Triage:` comment.

### G-3 (Major): the label write is not checked, although a mistake there breaks a hard rule

- Guide: "When a subagent reports back, check its evidence before you accept it." (in general: check a result before accepting it)
- Skill `SKILL.md:25`: "`issue_write` sets the full label list: send the existing labels plus the new ones." and `SKILL.md:31`: "Keep the titles and labels of all open issues for step 3."
- Problem: the labels kept from step 1 can be stale by the time of the write, because the owner may label issues during the night and steps 3 and 6 write twice. If the model sends that stale list, or forgets a label, `issue_write` removes a label, which is exactly what line 25 forbids. Nothing tells the model to read the labels fresh or to check the result.
- Haiku: transfers fully. Rebuilding a full list is the kind of mechanical step where a small model drops an item.
- Proposed rewording for line 25:
  > `issue_write` replaces the whole label list. Before each write, read the issue again with `issue_read` and send its current labels plus the new ones. After the write, compare: if any earlier label is missing, put it back at once and list the issue under **Blocked on me**.

### G-4 (Major): it is not stated that the CLAUDE.md task workflow does not apply to this run

- Guide: "Hand over the whole task. Say what 'done' looks like" and, for CLAUDE.md, "Tell it which stops you want … It follows instructions that name these stops."
- Skill `SKILL.md:10` / `SKILL.md:12`: "Read them first" (CLAUDE.md) and "Change no files, make no commits, push nothing."
- Problem: the routine sees all of CLAUDE.md. Its Workflow says, for every task, to update `implementation_plan.md` at the start (step 8), to run the full check list "Before marking anything complete", to run reviewers, and to open issues for points found. Line 12 implicitly contradicts these steps but never says that this run is outside that workflow. CLAUDE.md ("Coding guidelines") also tells the model to say which instruction it follows when two disagree. An unattended run spends effort on that, or worse, runs tests or edits the plan.
- Haiku: transfers. A smaller model is more likely to follow the long, prominent CLAUDE.md workflow than an implicit override.
- Proposed rewording for line 10:
  > Read `CLAUDE.md`, "Open work", and the templates `.github/ISSUE_TEMPLATE/task.md` and `decision.md`; this skill does not repeat their rules. The rest of `CLAUDE.md` ("Workflow", "Before marking anything complete", the plan file, opening issues) is for code tasks and does not apply to this run; only its end-of-run headings do (see "Done means").

### G-5 (Major): nothing prevents the run stopping early to report or to offer to continue

- Guide: "On a long task, it sometimes stops to report instead of going on: a summary that names the next step without taking it, an offer to continue, or a list of choices that don't block the work. It follows instructions that name these stops." / "When a step doesn't need my input, keep going."
- Skill: missing. `SKILL.md:8` says nobody answers questions, but not "do not stop until Done means holds".
- Problem: an unattended run that ends with "Shall I continue with the remaining 14 issues?" just ends. The leftovers are picked up the next night, but each night then triages fewer than 20 and the backlog grows.
- Haiku: transfers. Early stops with a progress summary are, if anything, more common on smaller models. This is an inference, not confirmed.
- Proposed addition to line 8:
  > … You only suggest; the owner decides. Do not stop to report progress or to offer to continue: work through all picked issues, then write the one final report.

  (This is included in the G-2 section text. Use one of the two, not both.)

### G-6 (Minor): "At most 20" lets an empty run count as done

- Guide: "Name the finish line, like 'the tests pass' or 'every endpoint is migrated.' … With a clear finish line, it knows when it's done."
- Skill `SKILL.md:16`: "At most 20 open issues without the label `triaged`, oldest first, are checked".
- Problem: "at most" is the cap, not the finish line. Checking 3 issues and stopping meets the letter of it. The finish line should be "the 20 oldest, or all of them if fewer, unless stopped under 'When to stop'".
- Haiku: transfers.
- Proposed rewording:
  > - The 20 oldest open issues without `triaged` (all of them, if fewer) are checked and carry `triaged`, except those listed under **Blocked on me** (see "When to stop").

### G-7 (Minor): the "Done means" bullet does not cover issues skipped in step 2

- Guide: same passage as G-6 (a finish line the model can check itself against).
- Skill `SKILL.md:17` ("Each checked issue has the gaps below filled") versus `SKILL.md:32` ("if the issue already has a comment starting with `Triage:`, only add `triaged`").
- Problem: for a skipped issue the gaps are not re-checked, so line 17 is never true for it. A literal model may fill labels on it anyway (a second write) or count the run as not done.
- Haiku: transfers.
- Proposed rewording for line 17: "Each checked issue, except those skipped in step 2, has the label gaps below filled and, when there is something to say, exactly one comment starting with `Triage:`."

### G-8 (Minor): the comment template uses real-looking issue numbers that a smaller model may copy

- Guide: "Name the patterns" / "A list of specific patterns works much better" (an example steers output strongly; this is the design section, applied here to the comment template by analogy).
- Skill `SKILL.md:45-46`: "Possible duplicate of #84: …", "Related: #83 (…), #131 (…)".
- Problem: #83, #84 and #131 look like real numbers. On Haiku, a filled-in example is sometimes copied literally, so a comment could point to #84 although no match was found there. Placeholders cannot be confused with real numbers.
- Haiku: transfers more strongly than on Opus (inference).
- Proposed rewording: `Possible duplicate of #<older>: <one sentence …>.` / `Related: #<n> (<one sentence>), #<n> (<one sentence>).`

### G-9 (Minor): the report has no place for what could not be confirmed

- Guide: "Ask it to mark what it couldn't confirm … Add 'Mark anything you couldn't confirm, and say where you looked'".
- Skill `SKILL.md:18` (report) and `SKILL.md:36` ("compare … by title, then read the bodies of the likely matches").
- Problem: duplicate detection compares titles first and reads bodies only for likely matches. When a body could not be read, or the open-issue list was too long to compare fully, the report does not say so, and the owner reads "nothing found" as "checked, no duplicate".
- Haiku: transfers.
- Proposed rewording: covered by G-1 ("**Found**: … what could not be checked"). Also add to step 4: "If you could not read a candidate's body, say so in the report instead of deciding."

### G-10 (Minor): the topic-label gloss is attributed to CLAUDE.md, but CLAUDE.md does not contain it, and non-functional issues are not handled

- Guide: "Say what 'done' looks like" (a correct and complete decision rule per issue). The rest is a correctness check against CLAUDE.md, under "anything else relevant".
- Skill `SKILL.md:34`: "Pick by what the issue is about, as `CLAUDE.md`, "Open work" separates them: `fachlich` for domain rules, law, glossary terms and amounts; `produkt` for … ; `bug` for …".
- Problem: `CLAUDE.md:84` only says "Functional points (domain, features, bugs) … topic label `fachlich`, `produkt` or `bug`". The finer gloss is the skill's own, which is fine and short, but "as CLAUDE.md separates them" sends the model looking for text that is not there. CLAUDE.md also says that non-functional points (security, operations, performance, accessibility …) do not belong in issues at all. An issue of that kind fits no topic label, and the skill would report it as "unclear: X or Y" instead of saying what it is.
- Haiku: transfers.
- Proposed rewording:
  > Pick by what the issue is about (`CLAUDE.md`, "Open work": domain, features, bugs): `fachlich` for …; `produkt` for …; `bug` for …. If it is a non-functional point (security, operations, reliability, performance, usability, accessibility, maintainability), add no topic label and say in the comment: "Looks non-functional; per CLAUDE.md, "Open work", this belongs in `docs/design/offene-punkte.md`."

  The comment template (lines 42-49) needs a matching optional line.

### G-11 (Nit): the step reference is wrong

- Skill `SKILL.md:31`: "Keep the titles and labels of all open issues for step 3." The titles are used in step 4 (duplicates and related issues).
- Proposed rewording: "… for step 4."

### G-12 (Nit): "leaving out empty lines" can be read two ways

- Skill `SKILL.md:40`: "English, this form, leaving out empty lines:"
- Problem: this can mean "leave out the lines that have nothing to report" or "remove the blank separator lines".
- Proposed rewording: "English, this form; leave out each line that has nothing to report:"

### G-13 (Nit, model choice): Haiku fits the mechanical steps; the duplicate judgment may need a stronger model

- Guide: "Opus 5.5 always thinks before it replies, and it decides how much. You don't need to ask it to think." / "To change how much it thinks in Claude Code, change effort."
- Skill: whole file, especially steps 3-4.
- Note: the guide's advice to delete "think carefully" lines is Opus-specific: it relies on the model always thinking. The skill has no such lines, which is right for Haiku too, because the explicit steps replace them. Whether Haiku thinks at all in the routine depends on the routine's model and effort settings. That is the lever, not prompt text. Steps 1-3, 5 and 6 are mechanical and suit Haiku. Step 4 (one implementation meets both «Done means»; same file, screen or rule) is the one judgment where line 39 says a wrong suggestion costs the owner more than a missed one. If the first nights show wrong duplicate or related suggestions, run the routine on Sonnet (or a higher effort) before adding more prompt text. Unconfirmed: I have no run data.

## Already in line with the guide

- **Finish line stated** (`SKILL.md:14-18`, "Done means"): a countable target, a per-issue result and a final report. This is the guide's core "say what done looks like" advice. Refinements are in G-6 and G-7.
- **No "think carefully / step by step" lines** anywhere in the file. This matches "Delete 'think carefully' lines". It suits Haiku too, since the numbered steps carry the method (G-13).
- **Unattended stance is explicit** (`SKILL.md:8`): "Nobody answers questions … say so in the comment instead of acting." This is the guide's "when to stop and ask", adapted to having no one to ask. It only needs a run-level counterpart (G-2).
- **Durable progress outside the context** (`SKILL.md:32`, `SKILL.md:51`): the `Triage:` comment and the `triaged` label, written last, are the run's task list kept outside the scrollback. This is the guide's "Keep the task list in a file" for a run that must change no files: a broken-off run resumes correctly the next night.
- **Destructive actions ruled out with specifics** (`SKILL.md:20-25`): never close, reopen, remove or change labels, edit titles or bodies, create issues, or touch markers. This is the guide's "keep your own check before anything risky or hard to undo", stated as a closed allow-list, which is safer than a general caution.
- **Specific negative patterns instead of a vague "be careful"** (`SKILL.md:39`): "A shared word in the title is not enough … When in doubt, leave it out". This follows the guide's point that naming concrete patterns works better than a general instruction.
- **A short explanation instead of reasoning** (`SKILL.md:45-48`): each suggestion carries "one sentence: why". This matches "Explain why you chose this approach in three sentences" rather than asking it to reproduce its reasoning.
- **Prompt-injection guard** (`SKILL.md:27`): issue text is treated as data. The guide does not cover this, but it is essential for a run with write access under the owner's account.
- **Rules referenced, not copied** (`SKILL.md:10`), as the owner decided. G-4 and G-10 only sharpen what is referenced.
- **Not applicable to this run, correctly absent:** fanning out to subagents (20 issues are small, and on Haiku a fan-out adds coordination risk with no gain), design-style lists, attaching screenshots, fast mode, settled-answer project instructions, and model-switch flags. For flags: if a message is flagged, the routine continues on the fallback model without a prompt change.

## Summary of severities

| ID | Severity | Topic |
|---|---|---|
| G-1 | Major | Report format conflicts with CLAUDE.md; owner's items not first |
| G-2 | Major | No run-level stop rule (errors, missing labels, retries) |
| G-3 | Major | Full-list label write not re-read or verified |
| G-4 | Major | CLAUDE.md code-task workflow not excluded for this run |
| G-5 | Major | No "do not stop early / offer to continue" rule |
| G-6 | Minor | "At most 20" is a cap, not a finish line |
| G-7 | Minor | Done means vs. step-2 skipped issues |
| G-8 | Minor | Real-looking issue numbers in the template |
| G-9 | Minor | Nothing on what could not be confirmed |
| G-10 | Minor | Topic gloss attributed to CLAUDE.md; non-functional issues |
| G-11 | Nit | Wrong step reference |
| G-12 | Nit | "Empty lines" is ambiguous |
| G-13 | Nit | Model choice for the duplicate judgment |
