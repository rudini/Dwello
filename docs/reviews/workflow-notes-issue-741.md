# Workflow notes: issue #741

| Rule | What happened | Proposed change |
|---|---|---|
| `docs/design/tools/persona-stack.sh` (skill `slice-review`, 1: personas get the running app) | In a fresh cloud container the script stopped right after `dropdb` without «ready» or «not ready»: `bun run build` failed because `.svelte-kit/tsconfig.json` and `src/lib/paraglide/` did not exist yet. Finding it took a `bash -x` run and a manual build. | Run `svelte-kit sync` and `bun run i18n` in the script before the build, or print the build's error and «not ready» when it fails. |
| Skill `slice-review`, 2 (personas write their report into the tree) | A persona wrote `docs/design/personas/marco-741.md` while I committed the code-review Minor fixes with `git add -A`, so the report went into an unrelated commit. | Say in the skill: while a persona runs in the tree, stage files by name, not with `git add -A`. |
