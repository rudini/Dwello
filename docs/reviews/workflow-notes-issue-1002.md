# Workflow notes: issue 1002

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 5 (amounts changed: `daten-pruefer`) against an amount no screen, PDF or QR-bill shows | `paidThisMonth` of `GET /dashboard` changed, but no page shows it (the BFF only types it). The session ran no `daten-pruefer`: there is nothing it could read from the app, and the pg test recomputes the sum from the records it inserts. Also no step-1 `fach-reviewer` round: the rule is the domain review's own (959-1, rule 4). | Step 5: «`daten-pruefer` when amounts a screen, PDF or QR-bill shows changed; an amount only the API returns is pinned by its pg test.» |
