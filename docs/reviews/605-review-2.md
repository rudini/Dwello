# Code-Review #605, Runde 2 (Abschluss, 954a436..1eaebd4)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta. |

## Status der offenen IDs aus Runde 1

- **C-1 (Minor): geschlossen.** `+page.server.ts:178` liest jetzt einmal `statements?status=open&limit=1000`. `once` und der zweite Lesevorgang sind entfernt. Was das Backend dazu tut:
  - Die Route `GET /statements` (backend/src/routes/statements.ts:50-72) gibt `query.status` ungeprüft an `listStatements` weiter. `statusCondition('open')` (statement.service.ts:116) ist `status = 'sent'`. Das ist genau die Vereinigung der bisherigen Filter `overdue` (sent und Frist < heute) und `sent` (sent und Frist >= heute oder NULL). Abrechnungen ohne Zahlungsfrist bleiben also enthalten. Weil alles in einer Abfrage liegt, kann keine Abrechnung mehr doppelt vorkommen oder fehlen.
  - `limit` wird nur mit `parseInt` gelesen, es gibt keine Obergrenze. 1000 kommt also an, und andere Ladevorgänge der Übersicht verwenden 1000 ebenso.
  - Die Reihenfolge ist `statementDate desc, createdAt desc, id desc` (statement.service.ts:191). Für die Übersicht spielt sie keine Rolle: `overviewDeadlines` sortiert selbst, `workTasks` (overview.ts:225-232) zählt nur.
  - Der Ladetest `dashboard.test.ts:228-242` ist mit dem Code von main rot: Main liest `overdue` und `sent` getrennt, der Fake liefert dieselbe Abrechnung in beiden, also stünde `s9` zweimal in den Fristen. Mit 1eaebd4 ist er grün.
  - Die übrigen Fakes sind auf die URL mit `status=open` umgestellt (Z. 94, 216). Den Test für die Mahnfrist trifft das nicht: s1 (überfällig) und s2 (versendet) stehen jetzt in einer Liste.

Geprüft: Delta vollständig gelesen (`+page.server.ts`, `dashboard.test.ts`). Weitere Nutzer von `statusCondition('open')` sind backend/src/routes/dashboard.ts:127-128, die Bedeutung bleibt unverändert. Keine Texte, Tokens, E2E-Schritte oder API-Antworten geändert, also kein Vertrag nötig: die Antwortform von `/statements` bleibt `tests/contracts/statements.json`.

## Nicht bestätigt

- lint, check, Dashboard- und Dashboard-Seiten-Tests (31), dashboard.feature in chromium und api (50), Sprachzeilen der Übersicht in chromium (16): vom Aufrufer gemeldet, nicht selbst ausgeführt. Dass der Filter `status=open` am Listen-Endpunkt mit dem echten Backend funktioniert, stützt sich auf diesen E2E-Lauf (dashboard.feature Z. 102-165: überfällige und versendete Zahlungsfristen). Ein eigener `*.pg.test.ts` für `GET /statements?status=open` existiert nicht (grep in backend/src/__tests__ ohne Treffer). Ich werte das nicht als Befund, weil der E2E-Lauf den Pfad abdeckt.
- Firefox-Lauf: im Container nicht installiert, laut Aufrufer nicht ausgeführt.
