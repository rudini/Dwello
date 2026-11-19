# Workflow notes: switch help (#1456) and glossary row «Sicherung» (#1457)

| Rule | What happened | Proposed change |
|---|---|---|
| Skill `pull-request`, first paragraph («Only the session that holds the product owner's task runs this skill, never a subagent or a session it started») | The task came from a coordinator session whose brief told this worker session to push, open the pull request and merge. The brief was followed, as the product owner's instruction relayed by the parent; the skill's sentence read alone forbids it, while its «After the merge» already speaks of worker sessions with one issue each. | Say «never a subagent; a worker session only when its brief hands it the pull request». |
| `CLAUDE.md`, Workflow 1 (fach review before a text turns green) and «Coding guidelines» (a decided text is the product owner's) | Both texts were decided word for word, so the fach review could only report its two points as Minors that the task may not act on. | For a text decided word for word, let the brief or the issue say whether the review reads it; otherwise the round only confirms the translations. |
