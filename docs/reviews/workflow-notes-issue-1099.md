# Workflow notes: issue #1099

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Coding guidelines", "Before coding" (an issue's text wrong in a detail that does not change the task) | The issue asked to remove code it called dead. Two of its three parts were still live: the Heizprofil division serves profiles of 100 % ± 0.1 (#232), and `noHeatingMonths` serves berichtigte Abrechnungen of statements under a year from before #1088 (Fachreview 1099-1 V-1). That shrinks the task, so it is more than "a detail that does not change the task". No rule says whether that needs the product owner. I kept the live code without asking, because keeping it changes no behaviour, and wrote the scope into the issue. | Add: "When an issue removes code as unreachable and part of it is still reached, keep that part, pin it in a test and say so in the issue and the pull request; ask only when removing it is still wanted." |
