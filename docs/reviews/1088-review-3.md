# Code-Review #1088, Runde 3 (letzte)

Gegenstand: `git diff b7b0b62 7c8642d -- . ':!docs/reviews' ':!docs/archive'` (Worktree review-1088d-code, 7c8642d). Vorheriger Bericht: docs/reviews/1088-review-2.md.

Geschlossen: C-3, C-4, C-7

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-8 | Minor | src/lib/server/statement-generation.ts:89, :92; backend/src/services/statement-run.service.ts:108-113, :131-133 | Drei geänderte Stellen haben keinen Test. Erstens die Ablehnung im BFF vor dem ersten Entwurf (`b.overlap?.length` mit `overlapText`): Der Fake in statement-generation.test.ts:49-77 kennt kein `overlap`, und kein Test ruft `previewStatements` oder die Erstellung mit einer Überschneidung auf. Zweitens und drittens die Übergabe der Abrechnungen des Gebäudes an `missingPeriods` in `missingOfContract` und `missingByContract`. Nur der Unit-Test prüft `missingPeriods` direkt. Nimmt man das fünfte Argument in einem der beiden Aufrufer heraus, wird kein Test rot (statement-run.pg.test.ts:76-117 hat keine Abrechnung einer anderen Periode). |
| C-9 | Major (Produktentscheid) | backend/src/services/accounting-period.ts:44-53 | Der Hinweis am Mietvertrag, die Mietvertragsliste und die Übersicht verschweigen jetzt die Tage aus Altdaten. Das deckt der Entscheid in #1088 nicht ab. Einzelheiten unten. |
| C-10 | Minor | tests/e2e/steps/statement-generate.steps.ts:735-739; statement-generate.feature:478-482 | Die Prüfung der Periode stützt sich auf die Gebäude paralleler Szenarien. Der Kommentar sagt selbst: «the parallel scenarios' buildings bill the calendar year». tests/e2e/CLAUDE.md, «Rules», Isolation, verbietet das: «Never rely on data from another scenario». Erstellen gleichzeitig mehrere Szenarien Gebäude mit Juli – Juni (statement-generate.steps.ts:414, building-form-Szenarien, a11y `building-edit-open-period`), kippt die Mehrheit. Dann scheitert das Szenario, obwohl der Code stimmt. Umgekehrt bleibt die Periodenzeile grün, wenn `runDefaultsOf` wieder fest `'calendar'` nimmt: Alle Gebäude des Szenarios rechnen das Kalenderjahr ab. Die Mehrheitsregel pinnt nur der pg-Test. Rot ohne die Änderung wird das Szenario nur durch den Satz. Der neue Satz selbst ist damit gepinnt, also ist C-3 geschlossen. |

## C-9: Die Tage aus Altdaten verschwinden aus dem Hinweis

Der Entscheid in #1088 lautet: «Decided (product owner), Fachreview 1088-2», 03.11.2026, V-10. Er sagt, Abrechnungen einer anderen Periode «must not occur, and Dwello enforces it». Er sagt auch: «The ways into the periods of older statements … go» und «Existing statements stay as they are».

Was der Entscheid abdeckt:
- Dwello rechnet diese Tage nicht ab.
- Es gibt keinen Weg in die alten Perioden.
- Altdaten bleiben bestehen. Der Zustand kommt also vor.

Was der Entscheid nicht sagt: was der Hinweis zu den offenen Tagen solcher Altdaten zeigt. Genau diese Frage stellt V-10. Der Fachreview schreibt (1088-fachreview-2.md:33): «Der Entscheid … deckt ab, dass Dwello die Tage nicht abrechnet. Er deckt nicht ab, dass Dwello verschweigt, dass sie offen sind.» Der Fachreview hat zwei Varianten vorgelegt. Der Entscheid wählt keine davon ausdrücklich. Variante (a) hätte die Tage weiter genannt, mit dem Text `contracts_statement_missing_uncovered`. Das Verschweigen ist eine dritte Lösung, und über sie hat der Product Owner nicht entschieden.

Die Folge ist im Aufbau von statement-run.pg.test.ts:155-158 nachvollziehbar:
- «Alt» hat eine Abrechnung vom 01.07.2022 bis 30.06.2023. «Neu» mietet seit dem 01.07.2022 und hat keine Abrechnung.
- `missingPeriods` lässt jetzt 2022 und 2023 weg, denn beide schneiden die Abrechnung von «Alt».
- `GET /contracts/<Neu>/missing-statements` antwortet deshalb ab 2024. Die 549 Mietstage von «Neu» zwischen dem 01.07.2022 und dem 31.12.2023 nennt kein Hinweis, keine Liste und keine Übersicht. Die Abrechnung von «Alt» deckt keinen dieser Tage ab, denn sie gehört zu einem anderen Mietvertrag.
- Der Unit-Test (accounting-period.test.ts:45-48) pinnt genau dieses Verhalten.

Die Akontobeiträge dieser Tage bleiben ohne Abrechnung, und Dwello sagt es nicht. Das widerspricht Art. 4 Abs. 1 VMWG, wie der Fachreview V-10 begründet. Es widerspricht auch den Design-Regeln: Fehler sagen, was zu tun ist.

Vor 7c8642d nannte der Hinweis die Periode und führte in eine Ablehnung (C-7). Diese Änderung ersetzt den falschen Weg durch Schweigen und nicht durch einen Hinweis. Im Code ist C-7 damit gelöst: Schritt 2 sperrt das Gebäude, das BFF lehnt den Lauf vor dem ersten Entwurf ab, und der Link führt nicht mehr in die Ablehnung. Offen bleibt, ob Schweigen gewollt ist. Das kann nur der Product Owner entscheiden. Es gehört unter «Blocked on me», mit dem Vorschlag, Variante (a) oder das Schweigen in #1088 festzuhalten.

So zeigt man es: im Aufbau von statement-run.pg.test.ts:155 ff. `GET /api/v1/contracts/<later>/missing-statements` aufrufen. Die Antwort enthält weder 2022 noch 2023.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt (Worktree ohne node_modules): lint, check, Backend type-check, vitest (4040 grün), Backend-Suite (1992 grün, Abdeckung 97 %), fitness, Hooks. Ebenso E2E in Chromium für das neue Szenario und die a11y- und Sprachzeilen building-edit*, buildings-other-period und period-locked-refused (13 grün).
- Ob die Tests rot waren, habe ich nur durch Lesen beurteilt:
  - Unit `missingPeriods` mit `building`: rot ohne den Filter.
  - pg `overlap`: rot ohne das Feld in `runPlan`.
  - DOM Schritt 2: rot ohne `overlap` in `unchoosable`.
  - Neues Szenario: rot nur am Satz, siehe C-10.
  - Zeile `period-locked-refused`: Seeblick hat im Seed Abrechnungen (screens.ts:125), und `updateBuilding` lehnt vor dem Update ab (building.service.ts:202-206).
- Für die Sperre in Schritt 2 wegen einer Überschneidung gibt es kein Szenario und keine a11y- oder Sprachzeile. Das E2E-Gerüst kann solche Altdaten wohl nicht herstellen: Das Backend lehnt jede Abrechnung einer anderen Periode ab, und die Periode ist gesperrt, sobald es Abrechnungen gibt. Ob der Pull-Request-Text dafür `No scenario: <Grund>` nennt, konnte ich nicht sehen. Das Commit sagt es nicht.
- Den Entscheidtext habe ich über die REST-API aus #1088 gelesen, Abschnitt «Decided (product owner), Fachreview 1088-2».

Geprüft: `overlapped` in `runPlan` und `generateInPeriod` gleich (ersetzte Abrechnungen zählen in beiden, `same` ausgenommen); `contractsInPeriod` lehnt vor jeder Erstellung ab; der Vertrag statement-run.json hat `overlap: []`; `overlapText` mit denselben Parametern wie die Meldung des Backends; Text und `disabled` im DOM-Test; `data-testid="period-proposed"`; die Schichten Target, Question und Step im Screenplay; die a11y-Task postet wie aus einem veralteten Tab; ponytail-review: nichts zu kürzen.
