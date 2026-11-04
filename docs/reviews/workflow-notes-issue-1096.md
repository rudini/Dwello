# Workflow notes: issue #1096

| Rule | What happened | Proposed change |
|---|---|---|
| `tests/e2e/CLAUDE.md`, "Run": «while one waits or builds, neither run `bun run i18n` nor merge `main`» | A background E2E run of seven feature files failed in 8 scenarios with «Cannot find package '$lib'» and missing `src/lib/paraglide/messages/*.js`, because `bun run check` and `bunx vitest run --changed` ran at the same time and regenerated `src/lib/paraglide/` and `.svelte-kit/`. The rerun alone was green (203 passed); the real failure among them was hidden in the noise. | Name `bun run check` and `vitest` next to `bun run i18n`: they regenerate the same files; run them before or after an E2E run, not during it. |
