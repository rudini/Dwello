# Workflow notes: issue 1007

| Rule | What happened in this task | Proposed change |
| --- | --- | --- |
| `CLAUDE.md`, Workflow 2 (`/tdd`, every new test seen red) | The change is a GitHub Actions workflow; its triggers (`workflow_run`, `workflow_dispatch`) only run once the file is on `main`. No rule says how to test one, so the bash step was extracted from the YAML and run locally against real pull requests with a `gh` shim that prints instead of posting. | Add a line for workflows: run the step locally against real data with writes stubbed, and name the runs in the review prompt and the pull request. |
| Skill `pull-request`, "Before each push", step 2 (closing review paths) | The code list (`src/`, `backend/src/`, …, `tools/`, `.claude/hooks/`) leaves out `.github/workflows/` and `.claude/skills/`, so the Minor fixes of this task's workflow need no closing round, although a workflow carries logic like a script in `tools/`. | Add `.github/workflows/` to the list. |
