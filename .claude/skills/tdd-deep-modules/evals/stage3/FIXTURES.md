# Stage 3 fixture format

Each fixture is a directory `fixtures/<id>/` (visible tasks) or `holdout/<id>/` (opened only for the final run). The harness copies parts of it mechanically; nothing in a fixture may depend on the harness reading it by hand.

| Path | Content |
|---|---|
| `task.md` | The task text, given verbatim to every arm. English. Names the public entry point the hidden tests use (file path, exported names, signatures, promised behaviour) and nothing about internal structure, method or testing style. |
| `starter/` | The project the arm starts from: `package.json` with `"type": "module"`, `"scripts": { "test": "bun test" }` and no dependencies; TypeScript sources under `src/`; at least one existing test (`*.test.ts`, `bun:test` only) that passes, so `bun test` is green before the task. |
| `hidden/` | Acceptance tests (`*.test.ts`, `bun:test` only). The harness copies them to `<run>/__acceptance__/` and runs `bun test ./__acceptance__`; they import only the entry point named in `task.md` (`../src/...`). At least one fails on `starter/`; all pass on `reference/`. They test behaviour through the entry point only, so any internal design passes. |
| `reference/` | Files laid over `starter/` that make every hidden and starter test pass (a full reference solution). Never shown to an arm or a reviewer. |
| `meta.json` | `{"id", "kind", "interacting_modules": true/false, "holdout": true/false}`; `kind` is one of `stateful`, `parsing`, `bugfix`, `multi-module`. |

Sizing: about 5 to 12 test-first cycles, a reference solution of roughly 150 to 400 lines of production code. Bun runs TypeScript directly; no `tsconfig.json`, no `node_modules`.
