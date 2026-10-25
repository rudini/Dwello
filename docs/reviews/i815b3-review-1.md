# Code-Review i815b3, Runde 1 (99ffc069..71567741: B3c `covered`, check-start)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/routes/contracts/new/ContractWizard.svelte:93, 189-196, 288, 298; src/routes/contracts/ContractForm.svelte:69-75 | `startPast` bleibt nach einem neuen Vertragsbeginn auf der Antwort für den alten, bis die neue Antwort kommt. «Weiter» vor der Antwort lässt die Rückfrage aus, oder es fragt mit falschem Text nach («1. Januar 2027 liegt in der Vergangenheit»). Der alte synchrone Vergleich hatte dieses Fenster nicht. |
| C-2 | Minor | src/routes/contracts/ContractForm.svelte:73; src/__tests__/contract-edit.dom.test.ts:87-91 | Im Bearbeiten-Formular prüft kein Test den neuen Weg: einen früheren Vertragsbeginn, den das Backend vergangen nennt, mit Hinweis, und ohne, wenn es ihn nicht vergangen nennt. Der Fake in contract-edit.dom beantwortet `check-start` mit `{ contracts: [] }`, also `past` undefined. Damit bleibt auch der bestehende Test «fragt bei unverändertem Beginn nicht nach» grün, selbst wenn das Formular gar nicht fragt. |
| C-3 | Minor | src/lib/contract-wizard.ts:577-583 | Scheitert `check-start` (Backend/BFF-Fehler, Sitzung), gibt `startInPast` stillschweigend `false` zurück. Der Assistent bietet dann bei einem alten Vertrag weder Rückfrage noch «Abgerechnet bis» an, und keine Meldung sagt das. Dieser neue Fehlerzustand hat keinen Test (DOM) und keinen `No scenario`-Grund. |
| C-4 | Minor | backend/src/__tests__/billed-until.pg.test.ts:87-99; backend/src/__tests__/apartment-availability.pg.test.ts:49-54 (Commit 0604401c) | Beide neuen Backend-Tests halten Verhalten fest, das schon auf 99ffc069 gilt: Der Diff ändert weder die POST-Prüfung noch die Verfügbarkeit. Ohne die Änderung sind sie also grün. Die Commit-Nachricht nennt sie aber nicht als Tests, die bestehendes Verhalten festhalten (CLAUDE.md, Workflow 2). |

## C-1 (Major): veraltete Antwort von `check-start`

Der Effekt (ContractWizard.svelte:189-196) verwirft nur eine *spätere* Antwort zu einem älteren Datum. Er setzt `startPast` aber nicht zurück, wenn sich `values.startDate` ändert. Bis die neue Antwort über BFF und Backend da ist, entscheiden `periodWarnings()` (:288), `stepErrors(..., startPast)` (:298) und der Hinweis in PeriodStep mit dem Wert für das *vorherige* Datum. Das Ergebnis heisst aber «Verhalten unverändert», und der alte Vergleich `startDate < today` war synchron.

- Vergangen → Zukunft: Der Verwalter ändert im Feld nur die Jahresziffer oder wählt im Kalender (DateInput.svelte:165-170 setzt den Wert direkt). Dann zeigt `role="status"` kurz «Der Vertragsbeginn Freitag, 1. Januar 2027 liegt in der Vergangenheit», und ein Screenreader liest das vor. «Weiter» in diesem Fenster blockiert mit `contracts_confirm_past` und dem falschen Text.
- Leer/Zukunft → Vergangen: Mit «Weiter» (oder Enter) vor der Antwort geht der Assistent ohne Rückfrage zu Schritt 4. «Abgerechnet bis» erscheint nie, und bei einem alten Vertrag fehlt damit genau der Hinweis aus #453.
- Bearbeiten-Formular (ContractForm.svelte:69-75): Dort gilt dasselbe für den Hinweis, der Speichern-Weg ist nicht betroffen.

So zeigt man es:
- Der Diff zeigt es selbst: Der bestehende DOM-Test brauchte ein neues `await settle()` vor dem Prüfen (contract-wizard.dom.test.ts:389, «the backend says the start lies in the past»). Ohne das bleibt die Rückfrage aus.
- Roter DOM-Test 1: `type('start-date-input', '01.01.2020'); await settle(); type('start-date-input', '01.01.2027'); next(); await settle();`. Erwartet wird kein Text «liegt in der Vergangenheit» und Schritt 4. Heute steht Schritt 3 mit der Rückfrage für 2027 da.
- Roter DOM-Test 2: auf einem frischen Schritt 3 `type('start-date-input', '11.01.2020'); next();` ohne `settle` dazwischen. Erwartet wird die Rückfrage, heute folgt Schritt 4.
- Das E2E-Szenario deckt es nicht auf. Der Task `fillContract` (tests/e2e/tasks/contract-form.ts:76-84) klickt direkt nach `EnterDate` auf «Weiter», ohne auf den Hinweis zu warten. Bleibt die Rückfrage aus, landet der zweite Klick (`confirmPastStart`) auf Schritt 4 und bleibt dort ohne Grundmiete wirkungslos. «Vertragsbeginn in der Vergangenheit bestätigen» bleibt so grün, ob gefragt wurde oder nicht.

Behebung, kurz: Die Antwort zusammen mit ihrem Datum halten (`{ start, past }`) und nur gelten lassen, solange `start === values.startDate`. Im Submit von Schritt 3 die Antwort für das aktuelle Datum abwarten (`await startInPast(values.startDate)`) und erst dann `stepErrors` und `periodWarnings` rechnen.

## Nicht bestätigt

- Die Läufe `bunx vitest run` (3645), `bun run lint`, `bun run check`, Backend `type-check`, `contract-check-start.pg.test.ts` und `api-contracts.pg.test.ts` (85), `bun run fitness`, die vier E2E-Features in Chromium und Prettier hat der Aufrufer gemeldet. Ich habe keinen davon wiederholt.
- Ob der C-1-Test für den Schweizer Tag (contract-wizard.dom.test.ts:409-418) ohne die Änderung rot ist, habe ich nur gelesen. Er ist es nur, wenn die Tests nicht in `Europe/Zurich` laufen. Weder `vitest.config.ts` noch `package.json` setzen `TZ`, und die Shell hier läuft in UTC. CI habe ich nicht angesehen.
- Ob Elysia `/check-start` vor `/:id` auflöst, habe ich nur gelesen (backend/src/routes/contracts.ts:163). Belegt ist es nur durch die gemeldeten pg-Tests.
- Die neue BFF-Route `src/routes/api/contracts/check-start/+server.ts` hat keinen Unit-Test. Andere Contracts-Routen haben auch keinen. Abgedeckt ist sie nur durch das gemeldete E2E-Szenario zu «Abgerechnet bis» (contract-new.feature:36).

Geprüft: `covered` im Backend rechnet mit denselben zusammengeführten Daten wie der frühere Frontend-Vergleich, und eine Eingabe setzt `refused` zurück. Das Frontend-`billsIn` und `billingStart` sind ohne Restverwender entfernt. Der API-Vertrag `contract-check-start.json`, `covered` in `contract-end-refused.json`, der api-contracts-Test und die API-Spezifikation sind nachgeführt. Die Auth-Middleware schützt den neuen Endpunkt. Die Fitness-Einträge sind ehrlich: Die Vorprüfung `stepErrors` nutzt `today` nur für BILLED_UNTIL_FUTURE, `start < savedStart` vergleicht laut Anforderung mit dem gespeicherten Beginn und nicht mit heute, und Ausnahmen 27 → 19 entspricht den 8 entfernten Einträgen. Neue Texte gibt es keine.
