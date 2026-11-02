# Code-Review 1001b, Runde 1 (Abschlussrunde, 9ba246c)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. |

Keine Blocker/Major.

Geprüft: `recordedPayments` (`backend/src/services/payment-entry.ts:30-34`) gibt genau den bisherigen Ausdruck aus `data-export.service.ts:539` wieder, der Datenexport des Liegenschaftsverwalters verhält sich also gleich. Der Mieterexport (`tenant-export.service.ts:135`) gibt bei leerer Liste und gesetztem `paidDate` jetzt `[{ date, amount }]` aus und ohne `paidDate` weiterhin `[]`. Der neue Test (`tenant-export.pg.test.ts:290-303`) schlägt ohne die Änderung fehl, weil der alte Code `[]` liefert. Er räumt `paidDate`/`paidAmount` wieder auf; `payments` steht vorher schon auf `[]` (Default, und der Test davor setzt die Liste ebenfalls zurück). Die Form der Antwort bleibt gleich (`{ date, amount }`), daher braucht es keinen Vertrag in `tests/contracts`. Auch `docs/api-specification.md:90` stimmt weiterhin. Es gibt keine UI-Texte, keine E2E-Dateien und nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `cd backend && bun run type-check`, `bun test src/__tests__/tenant-export.pg.test.ts src/__tests__/data-export.pg.test.ts` (30 bestanden), der neue Test vor dem Code rot (1 Fehlschlag), `bun run lint`, `bun run fitness` (645 Zeilen, genau an der Grenze). Ich habe keine Tests ausgeführt.
- Szenario: Eine Abrechnung ohne Zahlungsliste mit gesetztem `paidDate` lässt sich nur mit Daten aus der Zeit vor #959 herstellen, über die Oberfläche nicht. Der Pull Request braucht daher `No scenario: <reason>`. Den Text des Pull Requests habe ich nicht gesehen.
- Der Rückfall mit `paidDate` gesetzt und `paidAmount` null würde `amount: null` ausgeben. Das verhielt sich im Datenexport schon vor dieser Änderung so. Ob es solche Datensätze gibt, habe ich nicht geprüft; ich habe keine Datenbank abgefragt.
