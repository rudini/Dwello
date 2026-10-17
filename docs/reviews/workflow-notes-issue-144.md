# Workflow notes: #144 (contract wizard keeps the apartment, takes over the rent)

| Rule location | What happened in this task | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Open work" (issue "Done means") | #144's "Done means" still read like a decision issue («an implementation issue is created») although the decision was recorded; the coordinator said to treat Option A as the requirement and close #144 with the pull request. | When a decision issue's only open item is «create an implementation issue», allow implementing it directly and say so in the pull request. |
| `.claude/skills/slice-review`, "Triage" (persona re-run) | Helga P-1 led to a conditional sentence and a reworded one (P-2) in a text she had seen; the rule leaves open whether a reworded sentence is «a text it has not seen». Not re-run: the meaning, reviewed by fach-reviewer, is unchanged. | Say that a rewording of a reviewed text without new content needs no persona re-run. |
| `CLAUDE.md`, Design-Regeln "Process" (axe state data) | The obvious axe state data (apartment free from 01.01.2100) is refused by the wizard's own date check (#296); the state moved to another seeded apartment. | None: found and filed. |
