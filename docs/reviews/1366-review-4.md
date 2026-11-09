# Review 4 zu #1366 (PR #1369): Abschlussrunde CI-Fix, Delta fcfd2b3..12520c1

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `withPositionKeys` (src/lib/statement.ts:159-172) rechnet denselben Schlüssel wie der entfernte Code in CostTable.svelte (`Kategorie ?? id` / `Schlüssel ?? id` / Zahl der früheren Positionen mit demselben Paar); `positions.slice` statt `all.slice` ist dasselbe Array. `$derived(withPositionKeys(statement.lineItems))` verfolgt `statement.lineItems` weiter, da der Zugriff synchron im Ausdruck geschieht. Der Typ `Position` passt strukturell zu `StatementLineItem` (`Pick<ApiLineItem, 'id' | 'categoryId' | 'distributionKeyId'>`), der generische Parameter `P` erhält den vollen Positionstyp für das `{#each}` (Zeilen 136, 165). `Item` in CostTable bleibt verwendet (Zeilen 95-107), nichts Unbenutztes bleibt zurück. Der Kommentar wurde sinngemäss unverändert übernommen und stimmt. Keine Texte, kein E2E, keine Verhaltensänderung im Delta.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: lint, check, `fitness --base origin/main` (0 Fehler), `vitest --changed origin/main` (916) inkl. `cost-table.svelte.dom` (3) und `statement-pages.dom`.
- Dass der Fallow-Wert von CostTable.svelte damit wieder über der Basis liegt, zeigt nur der gemeldete Fitness-Lauf; nicht nachgerechnet.
