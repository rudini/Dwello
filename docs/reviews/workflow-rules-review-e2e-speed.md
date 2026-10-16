# Workflow rules review: faster local E2E runs

Task: build the E2E frontend only when it changed and start the empty and demo instances only when needed (request in chat, no issue). Rules reviewed: `CLAUDE.md`, `tests/e2e/CLAUDE.md`, the skills `tdd`, `ponytail`, `ponytail-review`, `slice-review`, the hooks that ran (commit subject gate, fallow, deepcheck).

## W-1: "A test must fail first" has no answer for a test-runner configuration

- Rule: `CLAUDE.md`, Workflow 2 («A test must fail before the code changes; note it in the plan»).
- What happened: the build script got unit tests shown red, but the server selection lives in `playwright.config.ts`, which no unit test loads. It was shown by runs instead (4 web servers after `bddgen --tags @buildings`, 7 after a full `bddgen`), and the plan says so. The rule does not say whether that counts.
- Proposal: add to Workflow 2: «A change to a test runner's configuration that no test can load is shown by a run before and after (name both in the plan).»

## W-2: Workflow 9 assumes an issue

- Rule: `CLAUDE.md`, Workflow 9 («pull request (English, `Fixes #n` …)») and "Open work" («Working on an issue»).
- What happened: the product owner asked for the change in chat; there is no issue, so neither `Fixes #n` nor `Refs #n` applies, and Workflow 1's «No scenario: <reason>» is only checked by CI for a PR that closes an issue.
- Proposal: add to Workflow 9: «Without an issue (a request in chat), the PR names the request in its text and still states the scenario or `No scenario: <reason>`.»

## W-3: The measurement that motivated the task is not a rule anywhere

- Rule: none; `tests/e2e/CLAUDE.md`, "Run", described the reuse of a running frontend but not what a run costs.
- What happened: a run of 7 scenarios took 46 s, of which ~40 s the production build; the database (0.26 s) was suspected first. This task documents the build skip, not the cost breakdown.
- Proposal: none needed beyond the new sentence in `tests/e2e/CLAUDE.md`; noted so a later task does not optimise the database first.
