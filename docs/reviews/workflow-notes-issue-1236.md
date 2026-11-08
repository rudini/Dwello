# Workflow notes: issue-1236 (and #1237)

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Design-Regeln, «Process» (a new screen or state goes into `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`) | #1236 shows a new message on the existing error page, reached only by a failure between BFF and backend; `tests/e2e/CLAUDE.md`, «No scenario», covers the scenario but the Process rule names no exception for the axe and language rows, so the task had to argue why it adds none. | Add to «Process»: a state the E2E stack cannot produce («No scenario») gets no rows; its texts are covered by the i18n tests. |
