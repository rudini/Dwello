# Workflow notes: #1209

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Done means" and "Open work" (a Minor two personas meet becomes an issue); skill `slice-review`, "Triage" | Helga P-1 (Minor: «Abbrechen» looks pressable while busy) is what the product owner decided in #1209 (c); Sven P-1 met the same spot by screen reader. "Done means" says what to do with a Blocker/Major that contradicts the decision, not with a Minor. I opened #1261 with `needs-decision` and told the orchestrating session. | Say that a Minor two personas meet, which contradicts what the issue decided, becomes a `needs-decision` issue and does not hold up the pull request. |
| `docs/design/personas/README.md`, "Running a review" | The persona agent read `demo-records.md` ("for the caller, not for the persona") to find its tenant. | Name in `.claude/agents/persona.md` that it reads no other file in that folder. |
