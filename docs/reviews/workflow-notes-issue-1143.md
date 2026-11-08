# Workflow notes: issue 1143

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 1 (a text with domain terms: «commit the `@wip` scenario locally» before `fach-reviewer`) | The change was one line of a scenario that is not `@wip` on `main`, approved by the issue. Tagging it `@wip` would itself be a spec change, so the proposed line was committed untagged for the review and turned red only after the reviewed wording replaced it. | Say that an approved change to a line of a scenario not `@wip` on `main` is committed as that line, without `@wip`, for the step-1 review. |
| `CLAUDE.md`, Workflow 5 (no persona «for a text the issue decided whose `fach-reviewer` round read it in all four languages») | The text was decided in the issue and read by `fach-reviewer` in all four languages, so the rule asks for no persona; the product owner's task asked for one, so Helga ran. | None, or name in the rule that the task may still ask for a persona. |
