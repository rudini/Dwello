# Workflow notes: issue 1002

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 5 (amounts changed: `daten-pruefer`) against an amount no screen, PDF or QR-bill shows | `paidThisMonth` of `GET /dashboard` changed, but no page shows it (the BFF only types it). The session first ran no `daten-pruefer`, as the pg test recomputes the sum from the records it inserts; after the fallback review of #1061 asked for a skipped reviewer, it ran one on the API (`1002-datenpruefung-1.md`, no findings), which added nothing the pg test had not shown. Also no step-1 `fach-reviewer` round: the rule is the domain review's own (959-1, rule 4). | Step 5: «`daten-pruefer` when amounts a screen, PDF or QR-bill shows changed; an amount only the API returns is pinned by its pg test.» |
