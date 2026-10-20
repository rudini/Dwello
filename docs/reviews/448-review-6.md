# Code-Review 448, Runde 6: Merge von origin/main (59c9c2ff, #525/#199) in w4-issue-448

Geprüft: Merge-Commit `e5abce99` (Eltern `1ce6d086` = #448, `59c9c2ff` = main), Merge-Basis `984a3232`. Worktree `review-448-code6` (detached, read-only). Grundlage: `git show --remerge-diff e5abce99`, `git diff e5abce99^1 e5abce99` für alle Dateien, die beide Seiten seit der Basis geändert haben (16 Dateien), und der Code von #448 und #199 in `backend/src/services/statement.service.ts` und `src/lib/server/statement-generation.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. Kein Blocker, kein Major, kein Minor. |

## Konfliktauflösungen

- `docs/api-specification.md`: `POST /generate` entspricht wörtlich main (mit `STATEMENT_PERIOD_OVERLAPS`), `GET /:id` wörtlich #448 (`final`, `carriedFrom`, `offsetWith`). Jede Seite hat nur eine der zwei Zeilen geändert; nichts geht verloren.
- `tests/e2e/fixtures/screens.ts`: beide Blöcke bleiben. #448 legt die Gebäude Uferweg und Hafenblick mit den Perioden 2023 und 2024 an, #199 Rechnungen in Seeblick 2026. Es sind verschiedene Gebäude, also gibt es keine Überschneidung. `replaceStatement('Kai', 2023, true)` erstellt die berichtigte Abrechnung mit derselben Periode, und `refuseOverlappingPeriod` erlaubt sie.
- `messages/{de,fr,it,en}.json`: Ich habe für alle vier Dateien einen Drei-Wege-Vergleich pro Schlüssel gerechnet (Basis, #448, main gegen den Merge): 1861 Schlüssel pro Datei, 0 Abweichungen, kein Schlüssel von beiden Seiten verschieden geändert.
- Die automatisch gemergten Dateien (`UBIQUITOUS_LANGUAGE.md`, `statement.service.ts`, `statement-correction.pg.test.ts`, `statement-pdf.pg.test.ts`, `statement-endpoints.test.ts`, `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`, `tasks/accessibility.ts`, Archiv des Plans) bringen nur die Zeilen von main. Die Helfer, die main in den Tests verwendet (`removeStatements`, `sentStatement`, `replace`, `createRental` mit `own.remove()`), gibt es in der #448-Fassung noch (`statement-correction.pg.test.ts:33,46,48`).

## Widersprechen sich #199 und #448?

Ich habe keinen Widerspruch gefunden:

1. **Berichtigte Abrechnung** (#120/#448, auch einer übertragenen oder «Erledigt»-Abrechnung, `replaceStatement` mit Status `settled`): Sie entsteht über `generateStatement` mit derselben Periode. `refuseOverlappingPeriod` (`statement.service.ts:508-528`) lässt eine gleiche Periode zu (`some(... === periodStart && ... === periodEnd)`). Die ersetzte Abrechnung hält ihre Periode bis dahin. `recalculateStatement` prüft keine Überschneidung und behält die Periode des Entwurfs. Daraus entsteht keine Überschneidung.
2. **Nächste Periode mit Übertrag**: `carriedOver` (`statement.service.ts:405-424`) nimmt nur eine Abrechnung des Mietvertrags mit `periodEnd < periodStart` der neuen Periode. Ein Übertrag setzt also immer eine Periode ohne Überschneidung voraus, und #199 verlangt genau das. Eine kurze Abrechnungsperiode (#199) nach einer «Erledigt»-Abrechnung übernimmt den Übertrag auf dem gleichen Weg.
3. **Schlussabrechnung** (`final`, `statement.service.ts:62-66`): Sie hängt nur davon ab, dass das Vertragsende in der Periode liegt. Sie braucht keine eigene, kürzere Periode und gerät deshalb nicht in die Sperre von #199.
4. **Status «Erledigt» (`settled`) im Abrechnungslauf von #199**: `overlapOf`, `contractsOf` (`src/lib/server/statement-generation.ts:63-120`) und `accounting-period.ts:66,111` schliessen nur `replaced` aus. `settled` zählt als abgerechnet, wie es soll. `GET /statements?buildingId=` ohne `status` liefert alle Status (`statementFilterConditions`, `statement.service.ts:126-142`). Sonst würde der Lauf einen Mietvertrag mit einer «Erledigt»-Abrechnung noch einmal anbieten.
5. **Tests von #448 unter der neuen Sperre**: Die neuen Erzeugungen in den pg-Tests von #448 (`statement-carry-over`, `api-contracts`, `statement-recalculation`, `contract-end`) laufen über Kalenderjahre in eigenen Gebäuden (`createRental(crypto.randomUUID())`). Keine davon überschneidet eine andere Periode desselben Gebäudes.

## Nicht bestätigt

- lint, check, type-check, vitest, Backend-Tests und E2E der betroffenen Features: vom Aufrufer gemeldet (laut Aufrufer laufen sie noch). Selbst ausgeführt habe ich keinen davon: Der Worktree hat kein `node_modules`, und ein Link darauf hätte den Worktree verändert. Ob die pg-Tests von #448 (vor allem `statement-carry-over.pg.test.ts` mit der berichtigten Abrechnung) mit `refuseOverlappingPeriod` grün sind, weiss ich nur aus dem Lesen der Tests (oben, Punkt 5), nicht aus einem Lauf.
- E2E-Szenarien von #448 in den Gebäuden Lindenhof und Seeblick: Ich habe nur die Seeds und die geänderten Szenarien gelesen (`git diff 984a3232 e5abce99^1 -- tests/e2e`). Sie erzeugen ganze Jahre beziehungsweise berichtigte Abrechnungen mit derselben Periode. Ein Lauf steht aus (vom Aufrufer gemeldet).
