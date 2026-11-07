# Workflow notes: issue #733

| Rule location | What happened in this task | Proposed change |
|---|---|---|
| `docs/design/tools/persona-stack.sh` (build) | In a fresh cloud container the first start failed: `bun run build` stopped with 143 errors «Tsconfig not found …/.svelte-kit/tsconfig.json»; `bunx svelte-kit sync` and a second start fixed it. | Run `bunx svelte-kit sync` in the script before the build, or say in `docs/design/personas/README.md` that a fresh container needs it. |
| `tests/e2e/CLAUDE.md`, "Run" | Every E2E run prints `[WebServer] … KI-Modell konnte nicht geladen werden … error: "Error: no space left on device"` from the KI stand-in. It reads like a full disk; I checked `df` and a write before seeing it is the stand-in's simulated answer. | Name this line in "Run" as expected output, or let the stand-in say that the error is simulated. |
| `CLAUDE.md`, Workflow 2 (pinned behaviour) | The first scenario pinned kept behaviour, so it needed no red run; at the sizes first chosen (390×844, 1024×768, 1440×900) it stayed green even with the guarded code taken out, so it checked nothing. Only a mutation run showed which sizes test the rule. | Ask for one run with the guarded code taken out also for a test that pins kept behaviour (as already asked for a guard of new code). |
