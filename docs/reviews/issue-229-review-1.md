# Code-Review #229, Runde 1

Worktree: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-229-code`, Bereich `aa36a10a..7afac56b` (9dbc4816 `@wip`-Szenario, 7afac56b Umsetzung, `@wip` entfernt). Gelesen: alle 12 geänderten Dateien, dazu `calculation.service.ts` (Berechnung von `period_share`), `statement-pdf.service.ts` vollständig im betroffenen Teil, `api-contracts.pg.test.ts`, `src/lib/names.ts`, `CostTable.svelte`, Issue #229 mit Kommentar, #232.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | implementation_plan.md:17-22 | F-7 (Detailseite nennt das gespeicherte Heizprofil) und die Rundungskorrektur (Erläuterung = Position) sind Verhaltensänderungen, die der Verwalter sieht, ohne Szenario und ohne `No scenario: <reason>`; F-3 (alte Abrechnung) fehlt ebenfalls die `No scenario:`-Zeile |
| C-2 | Minor | backend/src/services/statement-pdf.service.ts:155-162 | Eine Abrechnung von vor #209 über eine Periode unter einem Jahr druckt die Monate weiterhin ohne die Summen (F-6 bleibt dort bestehen); `shared.periodPercentage` liegt im Ergebnis von `handleMidYearMoves` schon vor, wird aber nicht als `periodPercent` weitergegeben |
| C-3 | Minor | backend/src/services/statement-pdf.service.ts:161 | Der Vergleich `Math.round(percentage * 100)` rundet anders als die Berechnung (`Math.round(percentage / 100 * 10000)`): beim Fall aus dem Issue-Kommentar (68.88499999999999) gibt es 6888 gegen 6889, also fallen die Monate einer alten Abrechnung weg, obwohl das Profil unverändert ist (sichere Richtung, aber unnötig); gleiche Formel wie in `heatingOfRun` nehmen |
| C-4 | Minor | tests/contracts/statement.json:37; src/__tests__/statement-mapping.test.ts:20 | Der Vertrag hat `heatingShare: null`, `drift()` prüft bei `null` nichts unterhalb; die Form, die der Mapper liest (`heatingShare.names`), ist von Hand im Test gebaut und nicht gegen die echte API geprüft (die Abrechnung im Vertragstest hat keine Heizkostenrechnung) |
| C-5 | Minor | backend/src/services/statement-pdf.service.ts:153-162 | Alte Abrechnung, deren Heizposition nach Tagen verteilt wurde (`billedDays` gesetzt), deren Profil heute aber Monate gibt: die Erläuterung nennt das Heizprofil mit dem Tagesanteil der Position. Bestand vorher in anderer Form (früher mit neu berechnetem Anteil und Monaten) |
| C-6 | Minor | src/lib/server/statement.ts:25-29 | Bei einer nach Tagen verteilten Abrechnung speichert `heatingShare` keine Namen; die Detailseite (`CostTable.svelte:73`) nennt dann weiter das Profil, wie es heute heisst. Das dritte «Done means» gilt nur für Abrechnungen nach Profil; im Plan nicht vermerkt |
| C-7 | Nit | implementation_plan.md:12 | `Scenario red:` nennt die alte Formulierung «zusammen 43.00 % von 50.00 % der Abrechnungsperiode», die nach F-1 der Fachprüfung nicht mehr im Szenario steht |
| C-8 | Nit | backend/src/__tests__/statement-pdf.pg.test.ts:320 | Variable `half` in einem Test über ein ganzes Jahr (kopiert aus dem Test davor) |

## C-1 (Major): Verhaltensänderungen ohne Szenario oder Begründung

`CLAUDE.md`, Workflow 1: jede Verhaltensänderung, die ein Benutzer sieht, beginnt mit einem Szenario; einen Zustand, den der E2E-Stack nicht erreicht, deckt ein Test auf tieferer Ebene ab, plus `No scenario: <reason>` im Plan. Im Diff gibt es nur ein neues Szenario, das zu F-6 (`statement-detail.feature:246-256`).

- **F-7, Detailseite:** Nach dem Umbenennen eines eigenen Heizprofils zeigt die Detailseite jetzt den gespeicherten Namen statt des aktuellen. Das sieht man in der Oberfläche, und der E2E-Stack kann den Zustand erreichen (eigenes Profil erfassen, Abrechnung erstellen, Profil umbenennen, Detailseite öffnen). Abgedeckt ist es nur durch den Mapper-Test `statement-mapping.test.ts:17-22`. Das Issue verlangt für die Detailseite zwar «a DOM or load test», hebt aber «the general finish in CLAUDE.md» nicht auf. Ohne Szenario fehlt mindestens die `No scenario:`-Zeile mit Begründung.
- **Rundung (Issue-Kommentar):** Erläuterung und Position im PDF zeigen jetzt denselben Wert (70.98 % statt 70.97 % / 70.98 %). Das ist eine Fehlerkorrektur, die man im PDF sieht. Abgedeckt nur durch `statement-pdf.pg.test.ts:304-327`, kein Szenario und keine `No scenario:`-Zeile.
- **F-3, alte Abrechnung:** Eine Abrechnung ohne `heating_share` kann E2E vermutlich nicht erzeugen. Der Test auf tieferer Ebene ist da (`statement-pdf.pg.test.ts:364-385`), es fehlt nur `No scenario: <reason>`.

Nachweis: `grep -n "No scenario" implementation_plan.md` findet nichts; in `git diff aa36a10a 7afac56b -- tests/e2e` steht nur das eine Szenario zu F-6.

Behebung: ein Szenario für F-7 (oder eine Begründung, warum E2E das nicht erreicht) und für die Rundung, dazu `No scenario:`-Zeilen, wo ein Szenario nicht möglich ist.

## Bestätigt durch Code und Test

- **Ältere Abrechnung druckt keine Monate, die den Anteil nicht ergeben:** `recomputedHeating` vergleicht mit `period_share` der Heizposition. Ist er anders, druckt das PDF keine Monate, und der Prozentsatz kommt aus der Position (`statement-pdf.pg.test.ts:364-385`, 50 % ohne «Anteile der Monate»). Grenzfälle siehe C-3 und C-5. Ein `period_share` aus der DB, der `null` ist, führt zum alten Verhalten.
- **Periode unter einem Jahr:** `periodPercent` wird gespeichert (`calculation.service.ts:423`), der Zusatz `heatingPeriodSums` steht in de/fr/it/en, mit geschütztem Leerzeichen vor «%». Die Bedingung `periodPercent == null || periodPercent === 100` lässt den Zusatz bei Abrechnungen aus #209 (Feld fehlt) und bei einem ganzen Jahr weg (Test `statement-pdf.pg.test.ts:83`). Die Summe des Mieters wird aus den gedruckten, gerundeten Monaten in ganzen Hundertsteln gebildet, ohne Gleitkomma-Drift. Test `:279-302` und Szenario `statement-detail.feature:246-256`. Für ältere Abrechnungen siehe C-2.
- **Gespeicherter Prozentsatz:** `Math.round(result.percentage / 100 * 10000) / 100` ist dieselbe Rechnung wie `periodShare: Math.round(periodShare * 10000) / 10000` mit `periodShare = percentage / 100` (`calculation.service.ts:334, 355`). Erläuterung und Position zeigen also denselben Wert, Test `:304-327`.
- **Detailseite:** `profileName` nimmt `heatingShare.names`, wenn vorhanden, sonst `heatingProfile`. `localName` aus `$lib/names` passt zur gespeicherten Form der Namen. Grenzfall nach Tagen: C-6.
- **Vertrag:** Der Schlüssel `heatingShare` ist im Vertrag aufgenommen, und `drift()` prüft, dass er vorhanden ist. Grenze: C-4.
- **Konventionen:** keine UI-Texte (PDF-Texte liegen wie bisher in `pdf.service.ts`), keine neuen Bildschirme oder Zustände, keine E2E-Schicht-Code-Änderung (Szenario nutzt bestehende Schritte), keine unbeteiligten Änderungen gefunden. Fachprüfung F-1 bis F-6 umgesetzt, F-2 (Teil), F-7, F-8 nach #232 (offen, `fachlich`, `entscheiden`).
- **Plan:** `Skills: tdd, ponytail, ponytail-review` vorhanden, `Test red:` für jeden der vier neuen Tests vorhanden.

## Nicht bestätigt

- Frontend `bun run test:coverage` (2487), `bun run lint`, `bun run check`, `bun run deepcheck:audit`, `bunx fallow audit`: vom Aufrufer gemeldet.
- Backend `bun run test` (633), `bun run type-check`: vom Aufrufer gemeldet.
- E2E chromium + api (121 passed) und dass das Szenario vorher rot war: vom Aufrufer gemeldet.
- `bunx vitest run src/__tests__/statement-mapping.test.ts` wollte ich erneut laufen lassen; der Zugriff auf `node_modules` war gesperrt, deshalb nicht erneut ausgeführt.
- Die fr/it/en-Fassungen von `heatingPeriodSums` prüft kein Test. Gelesen habe ich sie gegen die bestehenden Nachbarschlüssel (`heatingMonths`, `heatingNote`), nicht gegen `docs/design/i18n-begriffe.md` im Einzelnen. Ob «; zusammen …» nach dem Komma-Satz für den Mieter verständlich ist, gehört zur Fachprüfung und zur Persona (Dr. Weber).
- Den Zweig `share == null` in `recomputedHeating` (sehr alte Position ohne `period_share`) deckt kein Test ab. Er gibt dasselbe aus wie vor dem Diff.
