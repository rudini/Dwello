# Code-Review H-28 (#717) Schritt 2: Tankbestand im Backend geprüft, Einstellungen C-1..C-5, Runde 1

Bereich: `git diff 4924ec23c eee932dcc -- . ':!docs/reviews'` (2 Commits, 17 Dateien), Worktree `review-h28h-code`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/routes/buildings/[id]/+page.server.ts:31-35 | Was der Verwalter sieht, ändert sich in einem Randfall. `notSaved` zeigt jetzt die Meldung zu jedem Code, nicht mehr `buildings_fuel_not_saved`. Ohne Kategorie für Brennstoff (`fuel-stock-no-category`) oder wenn die Kategorien nicht geladen werden konnten, schickt das Formular `categoryId: ''`. Das Elysia-Schema (`format: 'uuid'`) antwortet darauf mit 422 `VALIDATION_ERROR`. Bisher sah der Verwalter bei leerem Stichtag oder Betrag die Meldungen am Feld. Bei gültigen Feldern sah er «Der Bestand konnte nicht gespeichert werden». Jetzt sieht er in beiden Fällen «Die Anfrage war ungültig. Laden Sie die Seite neu …». Bei einem Gebäude, das es nicht mehr gibt (404 `BUILDING_NOT_FOUND`), ändert sich der Text ebenfalls. Das widerspricht «Was der Verwalter sieht, bleibt gleich». Kein Test zeigt diesen Fall. |
| C-2 | Minor | src/__tests__/building-actions.test.ts:340 | «zeigt die Ablehnung von Stichtag und Betrag am Feld» wäre auf dem Basis-Commit grün. Das alte BFF prüfte `''`/`'viel'` selbst und gab dieselben zwei Texte mit Status 400 zurück, ohne das Backend zu fragen. Der Test prüft nicht, dass die Ablehnung vom Backend kommt (etwa mit `calls` wie im ersten Test). Ein BFF, das wieder selbst prüft, bliebe so unbemerkt. |
| C-3 | Minor | backend/src/services/fuel-stock.service.ts:16-18 | Der JSDoc `/** The new reading; none if the building already has one on that day */` steht jetzt über `typedAmount` statt über `createFuelStock`. Der Kommentar beschreibt damit die falsche Funktion, und `createFuelStock` hat keinen mehr. |
| C-4 | Minor | backend/src/__tests__/fuel-stock.pg.test.ts:421 | Die Anforderung nennt «1'450.-» (ganze Franken). Kein Backend-Test prüft diese Eingabe, die Zeile `.replace(/\.[-–—]+$/, '')` in `typedAmount` ist ungetestet. Getestet ist nur «2'650,5». Der bisherige BFF-Test über `plainAmount` deckt die neue Backend-Kopie nicht. |
| C-5 | Minor | backend/src/__tests__/config.pg.test.ts:240-250 | Befund C-2 aus h28g ist nur teilweise behoben: Der Fall `reminder_after_days` «6» → 400 fehlt. Ändert man die Untergrenze `v >= 7` (config.service.ts:101) zu `v >= 6`, bleibt das unbemerkt. |

Status der Befunde aus `docs/reviews/h28g-review-1.md`:
- C-1 behoben: `setMultipleConfig` meldet die fehlende Firmenadresse, wenn die IBAN selbst nicht abgelehnt ist. Das entspricht der alten Bedingung im BFF. Ein Test zeigt es (E-Mail + Firmenadresse).
- C-2 teilweise behoben, Rest siehe C-5 oben. Die Grenzen 7/90/6/91 der Zahlungsfrist, 7/60/61 der Mahnfrist und die LI-IBAN mit falscher Prüfziffer (`LI22…`, Prüfsumme nachgerechnet: falsch) sind getestet.
- C-3 behoben: `try/catch` und der Import von `CodedError` sind entfernt. `errorBody` braucht `PUT /:key` noch.
- C-4 behoben: Der Test in `audit-log.pg.test.ts` leert die Pauschale über `PUT /config` und prüft den Eintrag im Protokoll.
- C-5 behoben: `^(CH|LI)\d{7}[A-Z0-9]{12}$` steht vor `validateIBAN`. `CH97 A483 …` hat eine gültige Prüfsumme (nachgerechnet), der Test schlägt also wegen der Regex fehl und nicht wegen der Prüfziffer. Weil die Regex keine Leerzeichen zulässt, normalisiert `setConfig` jetzt mit `asStored`. Das hält z. B. `statement-mail.pg.test.ts:87` (`setConfig('iban', 'CH93 0076 …')`) grün.

## Nicht bestätigt

- Diese Checks hat nur der Aufrufer ausgeführt (vom Aufrufer gemeldet, nicht wiederholt):
  - die Rot-Läufe von `fuel-stock.pg.test.ts`, `building-actions.test.ts` und den C-1/C-4/C-5-Tests
  - `api-contracts.pg.test.ts`, `config.pg.test.ts`, `audit-log.pg.test.ts`
  - `bun run lint`, `bun run check`, Backend-Typprüfung, `bunx vitest run --changed origin/main`, `bunx fallow audit`
  - E2E `building-detail.feature` und `settings.feature`
- Selbst ausgeführt: `bunx vitest run src/__tests__/building-actions.test.ts` (31 bestanden).
- Ob die Backend-Tests ohne die Änderung rot wären, habe ich durch Lesen beurteilt: Vorher lehnte `format: 'date'`/`pattern` mit 422 ab, und die Antworten auf 409 hatten keinen `code`. Wegen der gemeinsamen Datenbanken habe ich keinen Backend-Test ausgeführt.
- `setConfig` normalisiert jetzt auch bei `PUT /config/:key`. Damit wird z. B. «4,5» für die Pauschale angenommen und als «4.5» gespeichert. Ein Test dafür auf diesem Weg fehlt; nur indirekt deckt `statement-mail.pg.test.ts` die IBAN mit Leerzeichen ab. Einen Aufrufer im Frontend für `PUT /config/:key` habe ich nicht gefunden (`grep setConfig`, `tests/e2e/tasks`).

Geprüft: Texte (die vier `backend_fuel_stock_*` entsprechen in de/fr/it/en wörtlich den entfernten `buildings_fuel_*`, die alten Schlüssel werden nirgends mehr verwendet), Verträge mit Vertragstest und Verwendung im BFF, `api-specification.md`, Reihenfolge der Prüfungen in der Route, `isRealDate` ersetzt `format: 'date'`.
