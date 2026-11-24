# Code-Review 1470-3 (Re-Review, Delta 7b690a1..00b41eb)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen oder neuen Befunde. |

Geschlossen: C-2

## Nicht bestätigt

- Vom Aufrufer gemeldet: Das neue Szenario war rot am Schritt zum Heizungsabschnitt, als `runShareNote` fest `'heatingNoteParts'` lieferte. Der Schritt zur Zeile der Lieferung blieb dabei grün. Nach dem Zurücksetzen lief E2E `statement-detail.feature` chromium+api mit 170 passed. Selbst nachgestellt habe ich das nicht, weil der Worktree kein `node_modules` hat. Gelesen habe ich `pdf-heating.ts:13` (`ownProfileDays`, `noRunShare`, `runShareNote`) und `pdf-cost-table.ts:122-159`. Daraus folgt: Mit der zweiten Rechnung (184 Franken, 01.07.–31.12.) trägt die Position `invoiceParts`, und die Lieferung verhindert `noRunShare`. Der rote Lauf ist daher plausibel.

Geprüft: Die erwartete Zeile der Lieferung setzt sich aus Kopf `partDelivery` bis `{amount}` und `partProfileRun` zusammen (`pdf-cost-table.ts:126-128`, `de.ts:73,89`). Der Satz zum Heizungsabschnitt entspricht dem Ende von `heatingNoteDelivery` (`de.ts:59`) und unterscheidet sich von `heatingNoteParts`. Das Szenario ist neu, die Änderung also frei. Die Commit-Nachricht nennt den roten Lauf. Das Delta enthält nichts, was nicht zur Aufgabe gehört.
