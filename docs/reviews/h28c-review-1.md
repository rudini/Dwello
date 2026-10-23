# Code-Review H-28 (Heizkosten-Hinweise des Laufs), Runde 1

Bereich: `git diff c16418984 0669cb270` (ohne docs/reviews, implementation_plan.md, docs/archive), Worktree review-h28c-code bei 0669cb270.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| E-1 | Major | backend/src/services/statement-run.service.ts:268 | Die gewollte Abweichung (ein Mietvertrag, dessen Abrechnung genau dieser Periode ersetzt ist, zählt jetzt als vom Lauf abgerechnet) ändert, was die Vorschau zeigt, ist aber von keinem Test belegt und hat weder ein Szenario noch ein begründetes `No scenario`. Die Commit-Nachricht nennt die Abweichung nicht. |
| E-2 | Minor | backend/src/services/statement-run.service.ts:272 | `c.id !== sent.contractId` ist toter Code: `oldHeatingRule` nennt nur versendete oder bezahlte Abrechnungen genau dieser Periode (invoice-completeness.service.ts:311-321). Deren Mietvertrag ist in `planRun` immer `billed` und wird vorher durch `!c.billed` aussortiert. |
| E-3 | Minor | Commit 0669cb270 (Nachricht) | Die beiden BFF-Tests, die gleichbleibendes Verhalten festhalten (src/__tests__/statement-generation.test.ts:350 und :358), stehen nicht als solche in der Commit-Nachricht (CLAUDE.md, Workflow 2). |

## E-1 (Major): Die Abweichung bei ersetzten Abrechnungen ist ungetestet und hat kein Szenario

**Warum falsch:**
- Bisher galten im BFF alle Abrechnungen, die die Periode überlappen, als «hat schon eine Abrechnung», auch eine mit Status `replaced`. Dazu gehören die frühere `runContracts`-Filterung und `overlapping`.
- Jetzt nimmt `runHeatingHints` die Mietverträge aus `planRun`. Dort zählt eine in genau dieser Periode ersetzte Abrechnung nicht (`replacedHere`, statement-run.service.ts:51).
- Diesen Zustand kann der Verwalter erreichen: `replaceStatement` (statement.service.ts:824-835) setzt nur `status: 'replaced'`. Eine berichtigte Abrechnung entsteht erst mit dem nächsten Lauf; Szenario «Der Abrechnungslauf rechnet einen Mietvertrag mit ersetzter Abrechnung wieder ab», statement-generate.feature:49.
- Beispiel: Ein Mietvertrag mit Einzug in der Periode und Heizprofil hat eine ersetzte Abrechnung 2024. Vorher zeigte die Vorschau im Assistenten keinen Hinweis auf Heizrechnungen ohne Leistungszeitraum. Jetzt zeigt sie ihn.
- Ebenso kann jetzt eine versendete Abrechnung derselben Wohnung als «nach der alten Regel» erscheinen (#335), weil der Mietvertrag mit der ersetzten Abrechnung als «vom Lauf abgerechnet» gilt.
- Das sichtbare Verhalten ändert sich also, auch wenn die Änderung fachlich richtig ist: Der Lauf erstellt ja die berichtigte Abrechnung.
- Kein neuer Test enthält eine Abrechnung mit Status `replaced`: weder die Unit-Tests von `runHeatingHints` (statement-run.test.ts:97-131) noch invoice-completeness.pg.test.ts:51-77. Der Code könnte also ohne `replacedHere` oder mit der alten Zählung laufen, und jeder neue Test bliebe grün.
- Die Angabe «No scenario: behaviour unchanged» stimmt für diesen Fall nicht.

**So zeigt man es:** In statement-run.test.ts einen Fall `hintsOf([tenancy('einzug', 'w1', '2024-05-01', null)], 'hp1', [{ ...statement('einzug', '2024-01-01', '2024-12-31', 'replaced'), id: 's1', apartmentId: 'w1' }])` ergänzen. Er erwartet `hinted`; mit der Zählung des alten BFF käme `[]`.

**Was nötig ist:**
- dieser Unit-Test (rot ohne die Ausnahme in `planRun` bzw. mit der alten Zählung), und
- entweder ein Szenario in statement-generate.feature (ersetzte Abrechnung eines Einzugs → Hinweis auf Heizrechnungen ohne Leistungszeitraum) oder ein begründetes `No scenario: <reason>`, das die Abweichung nennt.

Die Gleichsetzung «gleiche Wohnung» über `apartmentId` statt über die Wohnungsnummer verhält sich innerhalb eines Gebäudes gleich; dafür ist kein Befund nötig.

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet; ich habe keinen selbst wiederholt: lint, check, Backend type-check, `bunx vitest run` (3633), die fünf Backend-Testdateien (173), E2E statement-generate.feature (88), fallow audit, Prettier auf neuen Dateien.
- Die Rot-Läufe der neuen Tests hat ebenfalls der Aufrufer gemeldet. Durch Lesen bestätigt:
  - Der BFF-Test zur alten Regel (statement-generation.test.ts:382) und der Test mit Abfrage-URL (:337) schlagen auf der Basis fehl.
  - :350 und :358 bestehen schon auf der Basis. :358 prüft dort nur eine URL, die es noch nicht gab, ist dort also inhaltsleer.
- Die Auth-Prüfung der neuen Route habe ich nur über ihre Lage in `statementRoutes` neben `/run-differences` angenommen, nicht in der Montage geprüft.

Geprüft: Gleichwertigkeit der Regeln #339/#335 zum früheren BFF (bis auf E-1); Fehlerfall und Fall ohne Hinweise im BFF; leeres Heizprofil; unveränderte Antwort der Vollständigkeitsprüfung; neuer API-Vertrag und sein Drift-Test; Gemeinsamkeiten von `runQuery`/`runOf`; Ponytail (abgesehen von E-2 schlank, BFF kürzer).
