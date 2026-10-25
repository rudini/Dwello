# Code-Review #788 Teil 4b, Runde 2 (Abschluss, Delta 36870aef..65df78c6)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/__tests__/dashboard-tasks.pg.test.ts:134-145 | Behoben. Der spätere Vertrag (Beginn 2024) hat jetzt einen Entwurf für die Periode 2025. `listContracts` liefert ihn zuerst (`orderBy(desc(startDate))`, contract.service.ts:161), und `missingByContract` zählt die Abrechnungen je `contractId` (statement-run.service.ts:117). Er trägt also nur 2024 ein, der erste Vertrag danach 2025 und 2023 bis 2020. Ohne die Sortierung in contract-tasks.service.ts:74 käme [2024, 2025, 2023, …] heraus, und `expect(starts).toEqual([...starts].sort().reverse())` schlägt fehl. Das passt zum Rot-Lauf, den der Aufrufer meldet. Das Aufräumen in `finally` löscht den Entwurf vor dem Vertrag und hält damit die Reihenfolge der Fremdschlüssel ein. |

Keine neuen Befunde. Geprüft: Das Delta ändert nur die Testdatei (dazu kommt der Plan in 6e0ed2d9, der vom Diff ausgenommen ist). Der Kommentar im Test beschreibt den Ablauf richtig. Die Commit-Nachricht hält die Konventionen ein.

## Nicht bestätigt

- Backend `bun test src/__tests__/dashboard-tasks.pg.test.ts` (8 grün), der Rot-Lauf ohne die Sortierung und Backend `bun run type-check`: vom Aufrufer gemeldet, nicht erneut ausgeführt. Der Rot-Lauf ist nach dem Lesen von `missingByContract`, `listContracts` und `missingStatements` plausibel.
- Dass die Abrechnungsperiode der Testdatenbank das Kalenderjahr ist, sodass der Entwurf 2025-01-01 bis 2025-12-31 die Periode ganz abdeckt: aus dem gemeldeten Rot-Lauf geschlossen, die Konfiguration der Test-DB habe ich nicht angesehen.
