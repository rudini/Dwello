# Workflow rules review: issue #159

Task: the filter forms of the apartment, building and invoice lists kept old values after a navigation within the list; they now follow the address.

## Findings

1. **`persona-kit.mjs` loads Playwright from a path with a capital letter.**
   - Rule: `docs/design/personas/README.md` and `.claude/agents/persona.md` (personas copy and run `docs/design/tools/persona-kit.mjs`).
   - What happened: `persona-kit.mjs:7` calls `createRequire('/home/user/Dwello/package.json')`; in this session the clone is `/home/user/dwello` (the clone URL `add_repo` returns is lower case). Helga and Sven each patched their copy to run at all. A persona that does not see the cause stops without a review.
   - Proposed change: resolve the path from the script's own place (`import.meta.url`) or from `process.cwd()`, as `persona-stack.sh` was changed to do (review 174 W-1).

2. **The isolation rule is easy to break with the existing steps of a list.**
   - Rule: `tests/e2e/CLAUDE.md`, "Rules: Isolation".
   - What happened: the first version of the scenario checked «ist die Wohnung "2.01" "Leer"» on the unfiltered list; the step finds an apartment by its number only, so parallel scenarios with their own «2.01» made it fail in strict mode. It passed when run alone (`test:e2e:wip -g`), so the problem showed only in the feature run.
   - Proposed change: in "Isolation", add that a step that finds a record by a name without the seeded suffix (an apartment number) works only on a list filtered to the scenario's own records; or run `test:e2e:wip` for the whole feature file instead of one scenario.

3. **Persona findings about unsent entries repeat a code-review finding.**
   - Rule: `CLAUDE.md`, Workflow 5 and 6 (each persona finding is checked on the base commit; one row per task for what existed before).
   - What happened: code review C-1, Helga P-1 and Marco P-1 are the same kind (text typed but not searched survives a navigation). The rules have no place to say that findings of different reviewers are one point, so they went into one row (U-32) by judgement.
   - Proposed change: say in the skill `slice-review`, "Triage", that findings of different reviewers with the same cause share one row or issue and each plan line names it.

4. **A backend test fails on `main` depending on the hour.**
   - Rule: `CLAUDE.md`, "Before marking anything complete" (`cd backend && bun run test` passes).
   - What happened: `swiss-today.pg.test.ts` fails in its `afterAll` between 22:00 and 24:00 UTC, also on `main` (recorded as H-27). The rule has no word for a check that is red on `main` for a reason outside the change; I went on and named it in the plan and the pull request. Workflow 9 asks before merging with a check red on `main`, but says nothing about the local checks.
   - Proposed change: in "Before marking anything complete", allow a check that fails identically on `origin/main` when it is recorded as open work and named under "Blocked on me".
