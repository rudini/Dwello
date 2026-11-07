# Workflow notes: #707

| Rule | What happened | Proposed change |
|---|---|---|
| `docs/design/tools/persona-stack.sh`, `slice-review` 1 (personas get the running app) | In a fresh cloud container the persona build failed (`Tsconfig not found .svelte-kit/tsconfig.json`, 143 errors); the script exits 1 with only a `dropdb` notice, the cause is in `/tmp/persona-build.log`. It worked after `bun run i18n` and `bunx svelte-kit sync`. | Run `bunx svelte-kit sync` (and `bun run i18n`) in the script before `bun run build`, and print the end of the failing step's log on exit. |
| `tests/e2e/CLAUDE.md`, "No scenario" (a CLI script) | Demo data is loaded by a CLI script, so the whole issue had `No scenario`; the persona and `daten-pruefer` still saw the changes on screen. Clear, but only by inference: demo data is not named. | Name the demo data (`bun run db:demo`) as an example under "the backend start or a CLI script". |
