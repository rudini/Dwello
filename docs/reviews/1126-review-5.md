# Code-Review 1126-5 (Schlussrunde vor dem Push)

Bereich: `git diff 23d75d8 11399da -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` (Worktree `review-1126-code5`, Commit 11399da).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: V-16 – `reports_note_drafts_one`/`_many` stimmen in allen vier `messages/*.json` Wort für Wort mit `docs/reviews/1126-fachreview-4.md:17–18` überein (fr mit U+00A0 vor «:»). Die DOM-Erwartung `reports-pages.dom.test.ts:77` und der Schritt `reports.feature:59` schlagen mit dem alten Text fehl, also rot ohne die Änderung; das Szenario ist neu auf dem Branch (laut Fachreview steht auf `main` nur `@coming-soon`), deshalb ist keine Spec-Freigabe nötig. Verschiebung – die vier Komponenten sind unverändert umbenannt (100 %, ausser dem relativen Import in `PreviewReconciliations.svelte`); kein Test, kein Doku- oder Fitness-Eintrag nennt noch die alten Pfade; `$lib/statement-wizard` löst weiter zu `statement-wizard.ts` auf (der neue Ordner hat keinen Index). `backend/src/api/report.ts` hält nur Typen aus `schema.ts`, wie die übrigen `api/*`-Module (`date()` im String-Modus, also `string`). `Omit<GenerationRequest,'buildingIds'> & {buildingIds}` entspricht dem alten `Run`. Das Destrukturieren in `runReconciliations`, `reportPeriods` und `reportReconciliation` erzeugt dieselben Abfragen und Links; der Aufruf mit `period` samt `buildingName` liest nur die drei Schlüssel. Die Aufrufer und `cost-reconciliation.test.ts` sind angepasst. Ponytail-Review: kein ungenutzter Code und keine Kopie eines vorhandenen Helfers.

## Nicht bestätigt

- `bun run lint`, `bun run check` (0 Fehler), `bun run fitness`, Backend-Type-Check, `bunx vitest run --changed origin/main` (2596 bestanden), E2E chromium statement-cost-reconciliation, reports, navigation, statement-generate (170 bestanden), Commit-Hooks (fallow, deepcheck, testcheck, Betreff): vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Dass `reports.feature:59` auf `main` nicht ohne `@wip` steht, habe ich nur der Aussage in `docs/reviews/1126-fachreview-4.md:9` entnommen; `origin/main` ist im Worktree nicht gegen die Feature-Datei geprüft.
