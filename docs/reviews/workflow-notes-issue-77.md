# Workflow notes: issue #77

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 1 («a bug fix a user can see» starts with a scenario) | A wrong legal hint in a help text (`contracts_fee_help`, Art. 269d OR) was first fixed with a DOM test only, as #89 had done for the same text; `code-reviewer` then reported the missing scenario as Major, which cost a second round and an E2E run. | Say in Workflow 1 that a corrected help or hint text the user reads counts as a visible bug fix and gets a scenario that asserts the corrected statement. |
| `.claude/agents/fach-reviewer.md` (sources it checks) | `fach-reviewer` proposed the Fedlex word «terme de résiliation» for French; the app's term rule (`docs/design/i18n-begriffe.md`, #83, enforced by `i18n.test.ts`) requires «terme de congé». The test caught it; the finding was rejected. | Have `fach-reviewer` check a wording proposal for fr/it/en against `docs/design/i18n-begriffe.md` before proposing it. |
