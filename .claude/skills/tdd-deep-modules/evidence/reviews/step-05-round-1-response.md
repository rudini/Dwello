# Response to step 05 (SKILL.md), round 1

- [major] hard rule 2 unfollowable: rule 2 now points to section 4's "way back from a wrong red": undo the open red with `git reset --soft HEAD~1`, fix, commit the red again; a test from an earlier cycle is a question for the user. Verified end to end in a throwaway vitest repo: wrong red, reset, corrected red, green, `tdd_replay` ACCEPT. Cycle: red "SKILL.md way back from red", green after it.
- [major] dependency dead end: section 4 says test configuration (`package.json`, dependencies, `vitest.config.*`, `vite.config.*`) changes in the red or a refactor before it, and the way back covers a green that turns out to need it. Same cycle.
- [major] weak tests: one red per section: context (commands, the escape), test list (one line per behaviour, `tdd-step test`, hidden decision, both sketches), cycle (`tdd-step red/green/refactor`, one behaviour per cycle, the reset, package.json), depth check (tests keep name and file). Each red failed on an assertion; each green added only the text its test asks for.
- [minor] tooling.md exit code: "test run changed the working tree" moved to the refusals (exit 1).
- [minor] DESIGN.md:81 updated to the dynamic-import pattern; the stale claim about replay ranges removed.
- [minor] refactor moving tests: section 5 says to keep every test's name and file.
- [minor] no escape: section 1 says the skill is only for vitest and bun test projects and what to do elsewhere (stop, tell the user, no production edits because the hook stays active). The description already says "for vitest and bun projects".
- [minor] no command: section 1 names `npx vitest run` and the `bun test` part of `scripts.test`.
- [nit] tdd_replay list completed (non-phase commits, tests added outside red).
- [nit] sketches: section 3 puts the hidden decision, both sketches and the choice at the head of the test list.
- [nit] TypeScript typing of the dynamic import: tooling.md names a cast or a static import in the next refactor.
- [pending] `scripts/depth_report` exists now (step 2, under way).
