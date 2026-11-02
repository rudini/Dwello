# Code-Review #1002, Runde 1 (90e0e7b..1498f90)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `backend/src/routes/dashboard.ts:141-150` (die Summe über `payments` nach `p ->> 'date' >= monthStart`, sonst `paidAmount` auf `paidDate`; `balance > 0` lässt Rückerstattungen weg), `backend/src/__tests__/dashboard.pg.test.ts:159-168`, `docs/api-specification.md:351`. Die Entwurfsentscheide halten: `payments` wird nur in `recordPayment` geschrieben (`statement.service.ts:813`, Status bezahlt oder versendet mit Teilzahlung) und in `resetPayment` gekürzt (`:857`). Beim Ersetzen werden die Zahlungen nicht auf die berichtigte Abrechnung kopiert (`replaceStatement` setzt nur `paidAmount`, `:893`), also wird nichts doppelt gezählt. Ein `paidDate` haben nur bezahlte Abrechnungen (`:818`) und ersetzte, die vorher bezahlt waren. Deshalb ändert der Wegfall der Statusbedingung nichts für Entwürfe, versendete, erledigte und durch Übertrag oder von Hand ausgeglichene Abrechnungen (`offsetOf` setzt kein `paidDate`, `:910`). Eine Abrechnung mit Kleinbetrag (#94, `waived`) bekommt keinen Eintrag in `payments` und bleibt auf der alten Regel, wie vorher. Der alte Zweig ist weiter abgedeckt: Abrechnung 8 (ersetzt, leere Liste, `paidDate` heute) steckt im Wert 270 von `:146`; die Rückerstattung 7 läuft jetzt über `payments` und bleibt draussen. Der neue Test wird ohne die Änderung rot (alt: 12 ist versendet und zählt 0, 13 zählt `paidAmount` 300, erwartet sind 50 + 200 = 250). Die Imports `or`, `gte` und `replacedInSql` werden in `dashboard.ts` sonst nirgends verwendet. Das Antwortformat bleibt gleich (`tests/contracts/dashboard.json` unverändert). `paidThisMonth` erscheint im Frontend nur als Typ (`src/routes/dashboard/+page.server.ts:29`) und in Testdaten. Damit trägt die Begründung für «No scenario».

## Nicht bestätigt

- `bun test src/__tests__/dashboard.pg.test.ts` (10 bestanden, neuer Test vorher rot mit 300 statt 250), `bun run type-check`, eslint, Prettier, `bun run fitness`: vom Aufrufer gemeldet.
- Dass die SQL-Abfrage läuft (Alias `p` für den Rückgabewert von `jsonb_array_elements`, Parameter `monthStart` als Text gegen `date`): nur gelesen, nicht ausgeführt.
- `No scenario: <reason>` muss im Text des Pull Requests stehen (CI, `tools/open-work/check-issues.mjs`); der Commit nennt nur `Fixes #1002`. Der Text des Pull Requests liegt noch nicht vor.
