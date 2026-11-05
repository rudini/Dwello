# Workflow notes: issue #1122

| Rule | What happened | Proposed change |
| --- | --- | --- |
| `CLAUDE.md`, Workflow 2: «Every bug fix also gets a test that reproduces it first, at the lowest layer that can show it» | The bug lives in persona tooling (`docs/design/tools/persona-kit.mjs`), which has no test harness; the reproduction (a local server offering a non-ASCII download, opened through `open()`) ran as a scratch script, red before and green after, and was not committed. A committed version would launch Chromium from vitest. | Say that a fix in persona or review tooling without a harness may show its red with a scratch reproduction named in the commit message and the pull request, as for kept behaviour. |
