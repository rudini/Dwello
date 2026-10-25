# Workflow notes: module dependency graph (`bun run deps:graph`)

| Rule location | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Documentation (read when relevant)" | The request was a madge graph plus a CI cycle check. Only after the first madge run did a search show that `tools/arch-baseline/02-imports.ts` already builds the import graph (with `.svelte`) and that the fitness check `module-cycle` already gates cycles in CI. Two questions to the product owner revised an earlier answer. | Add `docs/architecture/fitness-functions.md` (architecture checks in CI, import graph, `bun run deps:graph`) to the documentation list. |
