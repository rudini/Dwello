# Code-Review W10c, Slice 1 (Backend), Runde 2

Geprüft: nur das Delta `git diff e266800 8b1a322` im Worktree `review-w10c-s1-code2` (Commit 8b1a322). Alle acht geänderten Dateien sind gelesen. `docs/reviews/w10c-s1-review-1.md` ist der Bericht aus Runde 1. Er ist unverändert übernommen.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | erledigt | backend/src/services/statement-invoices.service.ts:57-65 | `billed` hängt nicht mehr von der Vereinbarung ab. Nur `missed` filtert über `agreedIn` mit der heutigen Kategorie aus `now`. Der Test (agreed-categories.pg.test.ts:195) wäre auf e266800 rot: Die Abrechnung vereinbart nur Caretaker, die Rechnung ist jetzt Elevator, also hätte der alte Filter sie entfernt und `billedIn` wäre `[]` |
| C-2 | erledigt | backend/migrations/0018_contract_categories.sql:20 | Join auf `is_allowed_utility_cost`. Der Test hat eine Administration-Position (0002: `false`) und erwartet `['Caretaker', 'Elevator']`, wäre also vorher rot. 0018 ist nicht auf `origin/main`, die Migration zu ändern ist deshalb zulässig |
| C-3 | erledigt | agreed-categories.pg.test.ts:109 | Je eine Kategorie mit Summe 0 (80 / -80) und eine mit Leistungszeitraum 2019 vor dem Beginn 2020-01-01. Ohne den jeweiligen Filter erscheint die Kategorie in der Liste, der Test wird also rot |
| C-5 | erledigt | agreed-categories.pg.test.ts:208-252 | `POST /contracts` mit `[Caretaker]` erwartet genau `[Caretaker]` und wäre ohne die Liste rot (dann alle umlagefähigen Kategorien). Eine eigene Kategorie, die vor dem Mietvertrag angelegt ist, ist vereinbart |
| C-6 | erledigt (teilweise) | migrations.pg.test.ts:153 | Snow Removal 2019-12-31 vor dem Beginn ist belegt. Eine Rechnung nach einem `end_date` vor der letzten Abrechnung und `is_valid_utility_cost = false` sind weiter ungeprüft. Laut Runde 1 ist das eine Minor-Lücke, kein Blocker |
| C-9 | erledigt | contracts.ts:8,42; calculation.service.ts:26,319 | Aliase entfernt |
| C-11 | erledigt | agreed-category.service.ts:21-34 | Join auf `isAllowedUtilityCost`. Der Test (agreed-categories.pg.test.ts:242) setzt die Kategorie auf nicht umlagefähig und erwartet, dass sie fehlt. Auch `agreedCategoryIds` der neuen Abrechnung (calculation.service.ts:436) nennt sie damit nicht mehr. Das ist folgenlos, weil die Rechnungen einer nicht umlagefähigen Kategorie ohnehin nicht abgerechnet werden |
| C-4 | Minor (offen, bleibt) | contracts.ts, agreed-category.service.ts | Wie in Runde 1, unverändert |
| C-7 | Minor (offen) | docs/api-specification.md | Laut Aufrufer im nächsten Slice, im Delta nicht enthalten |
| C-8 | Minor (offen) | tests/e2e/tasks/statement-generate.ts | Laut Aufrufer im nächsten Slice, im Delta nicht enthalten |
| C-10 | Nit (offen, bleibt) | agreed-categories.pg.test.ts | Neu kommt hinzu: «nennt keine Kategorie mehr, die nicht mehr umlagefähig ist» (:242) ändert `ownId` für den ganzen Block, der Test davor setzt die umlagefähige Kategorie voraus. Die Reihenfolge trägt weiter |
| C-12 | Nit | backend/src/__tests__/agreed-categories.pg.test.ts:133,250 | `it(` ist mit zwei Tabs statt einem eingerückt. Prettier meldet es nicht, weil `bunx prettier` für die Datei kein Diff liefert, vermutlich ist das Backend ignoriert. Die Zeilen stehen trotzdem schief zum Rest |
| C-13 | Nit | agreed-categories.pg.test.ts:108,195,208,241 | Die neuen Code-Kommentare sind deutsch («nichts zu fragen ohne Betrag …», «eine abgerechnete Rechnung bleibt abgerechnet …»). Laut CLAUDE.md sind Kommentare englisch, und die übrigen Kommentare der Datei sind es auch. Ausserdem steht dort «Mietstage» statt «Miettage» |
| C-14 | Nit | agreed-categories.pg.test.ts:200 | Der C-1-Test prüft den Status von `PUT /invoices/:id` nicht. Lehnt das Backend die Änderung ab, bleibt die Kategorie Caretaker, und der Test wäre auch ohne die Behebung grün. Ein `expect(response.status).toBe(200)` macht die Rotprobe dauerhaft |

`ponytail-review` auf das Delta: `stateIn` ist nötig, weil das Fallow-Gate die Komplexität begrenzt (laut Aufrufer). Die Funktion ist nicht länger als die Inline-Fassung. Die Abfrage `categoryId` aus `invoiceStatements` ist entfernt, nichts Unbenutztes bleibt zurück. Nichts zu kürzen.

Keine Blocker oder Majors.

## Nicht bestätigt

- `cd backend && bun run type-check` und `bun test` von `agreed-categories.pg.test.ts`, `statement-invoices.pg.test.ts` und `migrations.pg.test.ts` (29 + 6 grün) sind vom Aufrufer gemeldet und nicht wiederholt: Backend-Tests waren mir untersagt.
- «Rot vor der Behebung» habe ich bei C-1, C-2, C-3, C-5, C-6 und C-11 nur durch Lesen beurteilt (siehe Tabelle). Bei C-1 setzt die Rotprobe voraus, dass der PUT erfolgreich ist (C-14).
- `stateIn` für eine Abrechnung ohne gespeicherte Rechnungen (`!known`): `billed` filtert nicht nach Vereinbarung. Solche Abrechnungen stammen von vor #96, also auch von vor #91, und haben `agreedCategoryIds = null`. Der Fall tritt damit nicht auf. Geprüft habe ich das in `agreedIn` und `known` (statement-invoices.service.ts:29-33), nicht gegen eine Datenbank.
- `bun run lint` und die Frontend-Tests sind nicht betroffen, weil das Delta nur das Backend ändert. Nicht ausgeführt.
- Spaltenreihenfolge in `0002_stammdaten.sql`: Dass der erste Boolean `is_allowed_utility_cost` ist (Administration `false`, Snow Removal `true`), habe ich aus dem Muster der Zeilen geschlossen. Die Kopfzeile des INSERT habe ich nicht gelesen.
