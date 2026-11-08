# Workflow notes #1138

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Design-Regeln", Process (screens rows: «once per variant with its own controls») | The Kostenabstimmung got two new sentences without controls. No row was needed, but then no state of `tests/e2e/fixtures/screens.ts` shows the Tankbestand sentence, so the check «fr/it/en show no German» never sees it; code review 1138-1 C-2 caught that the texts were only pinned by the Fachreview report, and a JSON pin test was added. | Say that a new text in an existing state that no screens row shows gets its four languages pinned in a test (as Workflow 1 says for texts a `fach-reviewer` report gives word for word), so the gap is closed before the code review. |
