# Workflow notes: #731

| Rule location | What happened in this task | Proposed change |
|---|---|---|
| `docs/design/tools/persona-stack.sh` (`docs/design/personas/README.md`, "Running a review") | On a fresh cloud checkout the script exited 1 with no output: its build failed (`Tsconfig not found .svelte-kit/tsconfig.json`), seen only in `/tmp/persona-build.log`. `bunx svelte-kit sync` fixed it; `tests/e2e/CLAUDE.md` names that step for `bddgen`, the persona stack does not. | Run `svelte-kit sync` in the script before the build (as `test:e2e` does), and print the end of the build log when the build fails. |
