# Workflow notes: issue #74

| Rule (where) | What happened in this task | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Coding guidelines" (issue wrong in a detail → follow the code) | The whole premise of #74 (an allocable invoice in a non-allocable category) was closed by #190 three days after the issue was written and before the decision was recorded. The rule names "a cause it names wrongly" as a detail; here the wrong cause made the decided change a dead branch. I read it as covered (no visible result changes under either reading) and added only a regression test, but the rule does not say so. | Add: "an issue whose problem a later change already fixed: pin it with a test that reproduces it when that fix is taken out, close it with the test and name the fixing pull request". |
| `CLAUDE.md`, "Working on an issue" / issue template | #74's "Done means" was the decision template's ("decision recorded … or an implementation issue created") although the issue carried a decision to implement; the coordinator's brief had to explain how to read it. | When a decision issue is decided, rewrite its "Done means" to the implementation's, or the template says so. |
