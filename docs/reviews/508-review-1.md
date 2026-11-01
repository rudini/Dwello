# Code-Review 508-1: Summe der Heizkosten in der Vorschau (d87e53f..1a57dde)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tests/contracts/statement-run-heating.json:13, src/__tests__/statement-generation.test.ts:604 | Für die neue Antwort `heatingSums[]` gibt es keinen Vertrag: der Vertrag hat nur `[]`, und der Frontend-Test baut das Element von Hand. |
| C-2 | Major | backend/src/services/statement-run.service.ts:361-381, backend/src/__tests__/invoice-completeness.pg.test.ts:58-83 | Die Zusammenrechnung pro Wohnung hat nur einen Test mit zwei Mietverträgen. Ersetzte Abrechnung, Vertrag ohne Heizkosten, «zu wenig», «gleich viel» und drei Mietverträge sind nicht getestet, obwohl Fachreview 508-1 V-1 sie verlangt. |
| C-3 | Minor | backend/src/services/statement-run.service.ts:373, 376 | `costs` ist das Maximum der Wohnungsanteile pro Vertrag, und `unagreed` heisst «keine einzige Heizposition». Vereinbart ein Vertrag nur eine von zwei Heizkategorien, ist die Zahl falsch: Die Heizkosten der Wohnung sind zu tief, wenn kein Vertrag alle Heizkategorien vereinbart, und der Teil, den der Vertrag nicht verrechnet, heisst «Leerstand» statt `leases`. Das widerspricht Definition 1 und V-3. |
| C-4 | Minor | backend/src/services/statement-run.service.ts:357, 365 | Der Kommentar sagt, die Zeile stehe auf der ersten Abrechnung nach der alten Regel. `new Map(...)` behält aber bei doppeltem Schlüssel den letzten Wert, die Zeile steht also auf der letzten. Ungetestet. |
| C-5 | Minor | backend/src/services/statement-run.service.ts:336 | Mit `unagreed` ist `landlordFor` immer `'leases'`, auch wenn der Anteil des Vermieters unter CHF 0.05 liegt. Beispiel: ein Vertrag ohne Heizkosten nur in Monaten mit 0 % im Heizprofil. Dann steht dort «Sie CHF 0.00 für Leerstand und Mietverträge …». Bei `vacancy` gilt die Schwelle 0.05, hier nicht. |

## C-1 (Major): kein API-Vertrag für `heatingSums`

**Warum falsch.** CLAUDE.md, Gotchas «API contracts»: Ein Frontend-Test, der eine Backend-Antwort liest, nimmt sie aus `tests/contracts/*.json`. Eine geänderte Antwort braucht einen nachgeführten Vertrag. Der Vertrag enthält aber nur `"heatingSums": []`, und `drift()` in `api-contracts.pg.test.ts:317` vergleicht bei einem leeren Array keine Felder eines Elements. In `statement-generation.test.ts:604` steht das Element als Literal. Die Form `{ statementId, costs, tenants, landlord, billed, difference, result, landlordFor }` hält also keine Prüfung zwischen Backend und BFF fest. `HeatingSum` in `src/lib/statement-wizard.ts:122-131` ist eine Kopie von Hand.

**So zeigt man den Fehler.** `landlordFor` in `heatingSum()` (statement-run.service.ts:338) umbenennen, z. B. in `landlordPart`. `api-contracts.pg.test.ts` und `statement-generation.test.ts` bleiben grün. Nur der Text in der Vorschau fällt still weg, und das E2E-Szenario sieht es erst spät.

**Fix.** Im Vertragstest einen Aufbau mit einer versendeten Abrechnung nach der alten Regel wählen, damit `heatingSums` ein Element hat. Dieses Element in `statement-run-heating.json` aufnehmen und im Frontend-Test `heatingSums` aus dem Vertrag nehmen.

## C-2 (Major): die Regeln der Zusammenrechnung sind nicht getestet

**Warum falsch.** `heatingSumsOf` legt Regeln aus Definition 3 und V-3 fest, die nur der Code zeigt:
- eine bestehende Abrechnung derselben Periode zählt gespeichert, alle anderen Verträge werden gerechnet;
- eine ersetzte Abrechnung zählt nicht, an ihrer Stelle zählt die berichtigte (Zeile 363, `same` mit `!isReplaced`);
- Entwürfe zählen mit;
- ein Vertrag ohne Heizpositionen führt zu `leases` (Zeile 376);
- `costs` ist das Maximum über die Verträge (Zeile 373).

Der einzige Test (`invoice-completeness.pg.test.ts:58`) hat einen gespeicherten und einen gerechneten Vertrag. Er prüft nur `result: 'more'`, `vacancy` und Summen-Identitäten. Die Fälle `less`, `equal` und `leases` in `heating-sum.test.ts` geben die schon zusammengerechneten Zahlen vor und prüfen nur `heatingSum()`. Fachreview 508-1, V-1 «Fix», verlangt ausdrücklich: «Die Fälle «zu wenig» (530.00, dritte Stichprobe), «gleich viel» und drei Mietverträge auf einer tieferen Schicht prüfen (`runHeatingHints`, *.pg.test.ts)».

**So zeigt man den Fehler.** Den Filter `!isReplaced(s)` in `same` (Zeile 363) entfernen, oder `sum.unagreed ||= !items.length` durch `false` ersetzen. Kein Test wird rot: Das E2E-Szenario und der pg-Test haben weder eine ersetzte Abrechnung noch einen Vertrag ohne Heizkosten. Das Gleiche gilt, wenn man `sum.billed +=` beim gerechneten Zweig durch `=` ersetzt: Es gibt nur einen gerechneten Vertrag.

**Fix.** pg-Tests, die durch `runHeatingHintsOf` gehen:
- die dritte Stichprobe, «zu wenig» 530.00;
- die zweite Stichprobe, «gleich viel»;
- drei Mietverträge in einer Wohnung;
- eine ersetzte Abrechnung mit ihrer berichtigten;
- ein Vertrag ohne vereinbarte Heizkosten.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bun run lint`, `bun run check`, `cd backend && bun run type-check`;
  - backend `api-contracts.pg.test.ts`, `invoice-completeness.pg.test.ts`, `heating-sum.test.ts` (121 pass);
  - `bunx vitest run --changed origin/main` (829 pass);
  - E2E `statement-generate.feature` chromium (93 passed);
  - Prettier --check auf den neuen Dateien;
  - die roten Läufe (pg-Test vor dem Code, `heating-sum.test.ts` «equal» und «leases» durch Herausnehmen des Codes, `statement-heating-sum.test.ts`).

  Beim Lesen: Ohne den Code ist `heatingSums` undefined, der pg-Test und das Szenario würden also an der fehlenden Antwort rot.
- Ob `calculateStatement` für einen Vertrag aus `planRun` (`billsIn` mit «Abgerechnet bis») mit `CONTRACT_NOT_IN_PERIOD` werfen kann (`calculateApartmentProrating`, prorating.service.ts:271ff.). Das würde `runHeatingHintsOf` scheitern lassen. Dann fiele mit `.catch(() => ({}))` (statement-generation.ts:276) auch der schon vorhandene Hinweis auf die alte Regel weg, nicht nur die neue Zeile. `handleMultipleContracts` habe ich nicht bis zum Ende verfolgt.
- Verträge mit einer gespeicherten Abrechnung einer anderen, überlappenden Periode. `planRun` setzt sie auf `billed`, `same` findet aber keine eigene Abrechnung, also zählen sie gerechnet. Das ist neutral für den Unterschied (gleicher Betrag in `tenants` und `billed`). Die Fachreview lässt den Fall offen.
- Die Sätze in fr/it/en prüft kein Bildschirm auf deutsche Wörter: Den Hinweis auf die alte Regel gibt es weder in `tests/a11y/screens.json` noch in `sprachen-bildschirme.feature`. Das gilt schon auf der Basis, die neue Zeile hat keine eigenen Bedienelemente.
- Die Stelle nur unter #339 (Wortlaut der Fachreview) ist nicht gebaut. Der Bericht findet selbst keinen solchen Fall (508-fachreview-1.md, «Nicht bestätigt»), deshalb gebe ich dazu keinen Befund.

Geprüft: alle 14 geänderten Dateien, die Texte in allen vier `messages/*.json` gleich wie die Tabelle «Wortlaut», der Platz direkt nach `statements_existing_old_heating_rule`, das Szenario (neu auf dem Branch, also frei; keine Wörter der Oberfläche; die Erwartung ist der ganze Text nach V-1/V-6), der Schritt prüft mit `toContain` über eine Question, Rechnung und Rundung von `heatingSum` (V-4), ponytail-review (nichts zu streichen, was ein Defekt wäre).
