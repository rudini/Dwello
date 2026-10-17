# Code-Review W1c (#132), Runde 7: Merge-Commit f4904748

Geprüft: `git show --cc f4904748` sowie `git diff 600f25e5 f4904748` (Merge gegen origin/main, was also nur noch die Änderung dieses Branches zeigt).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| –  | –       | –           | Keine Befunde. |

## Bestätigt

- `messages/{de,fr,it,en}.json`: Die Konfliktlösung behält `statements_existing_note` (geänderter Text) und die sieben `statements_existing_*`-Schlüssel des Branches. `statements_partial_title`/`_text` bleiben gelöscht. Alle vier Dateien sind gültiges JSON mit gleichen Schlüsselmengen (1739 Schlüssel).
- `src/routes/statements/generate/PreviewChecks.svelte`: `partial` und der Hinweis aus #396 sind entfernt. `existingNote` (`sameSettingsNote` + `statements_existing_note`), `existingTone` (caution bei `unbilledDays` oder `row.changed.length`) und `ChangedStatements` pro Gebäude sind noch da.
- `src/lib/statement-wizard.ts`: Das Feld `partial` und `partly(...)` sind weg. `ChangedStatement`, `changed` in `Coverage`/`invoiceRows`, `changedNotes`, `sameSettingsNote` und der auf Modulebene verschobene Helfer `step` sind noch da. Gegenüber main bleibt nur die Änderung des Branches übrig.
- `src/__tests__/statement-wizard.test.ts`: Die erwarteten Zeilen haben kein `partial` mehr, `changed: []` ist geblieben.
- `tests/e2e/steps/statement-generate.steps.ts`: `partialInvoicesHints` stammt aus main (#396). Es ist dort die negative Prüfung `toBe(0)` (Zeile 258), keine Referenz auf die gelöschten Schlüssel. `notesOnExistingStatement` aus dem Branch ist geblieben.
- `git grep` nach `statements_partial`, `row.partial`, `partly(` in `src`, `tests`, `messages`: keine Treffer. Die Treffer zu `partial` im Backend (`invoice-completeness`) sind ein anderes Feld und vom Merge nicht berührt.

## Nicht bestätigt

- lint, check, Backend-Type-Check, `bunx vitest run` (3040 bestanden), E2E `statement-generate.feature` (80 bestanden) und `git grep "fachlich prüfen, #65"`: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Die von main übernommenen Dateien (Reviews und Archiv von w8c2, `PreviewStep.svelte`, `StatementStep.svelte`, `statement-wizard.dom.test.ts`, Feature und Targets) sind Inhalt von main. Ich habe sie nur darauf geprüft, ob sie mit den Branch-Zeilen kollidieren, und nicht inhaltlich reviewt.
