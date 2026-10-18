# Code-Review W5d «Abgerechnet bis» (#133), Runde 1

Worktree `review-w5d-code`, Commit fd56594, Bereich `git diff c3d7758 fd56594` (48 Dateien, alle gelesen).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/features/contract-detail.feature:236-241 | Das Szenario mischt «Abrechnung des letzten Jahres» (wandert mit heute) mit dem festen «Abgerechnet bis» 31.12.2024. Ab 01.01.2027 fehlt 2025, und «meldet keine fehlende Abrechnung» wird rot |
| C-2 | Major | src/lib/contract-form.ts:135, src/routes/contracts/ContractForm.svelte:256-263 | Ein falsch getipptes «Abgerechnet bis» (z. B. «31.06.2024», «30/06/2024») wird beim Speichern zu `null` gesendet. Ein gespeichertes Datum wird ohne Hinweis gelöscht, die Seite meldet «gespeichert» |
| C-3 | Major | tests/e2e/features/contract-edit.feature:111-117 | Kein Szenario für die neue Ablehnung: ein geändertes «Abgerechnet bis», das die Mietstage einer gespeicherten Abrechnung ändert (V-2), wird im Formular abgelehnt. Das zeigt nur `billed-until.pg.test.ts` |
| C-4 | Minor | backend/src/__tests__/billed-until.pg.test.ts:96-108 | V-1 verlangt auch einen Test für «Abgerechnet bis» mitten im Monat (Akonto 120 × 16/31, Saldo −29.00). Geprüft sind nur Monatsgrenzen |
| C-5 | Minor | backend/src/services/pdf.service.ts:670 | M-1 (Behebung, 2. Satz): «Geleistete Akontobeiträge» nennen im PDF nicht den Zeitraum («ab 01.05.2024»). Weder umgesetzt noch in #325 aufgenommen |
| C-6 | Nit | backend/src/services/contract.service.ts:315 | Der Kommentar nennt `billedFrom`, die BFF-Funktion heisst `billsIn` |
| C-7 | Nit | tests/e2e/steps/statement-generate.steps.ts:111 | shrink: eigener Step «genau 1 Abrechnung» neben «genau {int} Abrechnungen». Ersatz: ein Step `'die Vorschau enthält genau {int} Abrechnung(en)'` |
| C-8 | Nit | src/routes/contracts/[id]/+page.server.ts:79 | Der Cast `contract as Parameters<typeof billsIn>[0]` ersetzt das bisherige `String(...)`. Ein typisierter Mapper oder `String(contract.startDate)` wie vorher wäre ehrlicher |

Ponytail-Review: C-7 und C-8 (`net: -3 lines possible`). Sonst ist der Diff schlank: eine Regel je Seite (`billingStart`, `billsIn`), keine toten Reste.

---

### C-1 (Major): Szenario wird ab 2027 rot

**Warum falsch.** `"Anna Keller" hat die Abrechnung des letzten Jahres` (`dashboard.steps.ts:74`) legt die Abrechnung für das Vorjahr von heute an. «Abgerechnet bis» steht fest auf 2024-12-31, Anna mietet seit 2024-04-01. Heute (2026) gilt: 2024 ist ausserhalb abgerechnet, 2025 hat die Abrechnung, also fehlt nichts. Ab 01.01.2027 ist 2026 das letzte Jahr. Dann fehlt 2025, `missingStatementsShown` ist `true`, und das Szenario schlägt in CI fehl, ohne dass sich Code geändert hat. Das verletzt `tests/e2e/CLAUDE.md`, «Isolation»: «Enter periods and dates that match the seeded records, never a default of the app that moves with today».

**So zeigt man den Fehler.** Die Uhr des E2E-Stacks auf 2027-01-15 stellen, oder die Rechnung nachvollziehen: `endedPeriodsSince('calendar', '2024-04-01')` ergibt 2024, 2025 und 2026. Davon nimmt `billsIn` nur 2024 heraus, 2026 hat eine Abrechnung, 2025 bleibt fehlend.

**Behebung.** Feste Jahre verwenden (z. B. eine Abrechnung 2025 statt «des letzten Jahres» und Dann die fehlenden Perioden nach 2025 nicht prüfen) oder «Abgerechnet bis» relativ zum letzten Jahr seeden. Die Grenze «Periode endet genau an «Abgerechnet bis»» muss dabei erhalten bleiben.

### C-2 (Major): Ein Tippfehler löscht «Abgerechnet bis» ohne Hinweis

**Warum falsch.** `DateInput` setzt bei einem ungültigen Text `value = ''` (`onblur`: `parseSwissDate(text) ?? ''`). Beim Absenden ruft der Submit-Listener `onblur` auf, dann `valid()` (`ContractForm.svelte`). `validateContract` und `stepErrors` kennen `billedUntil` nicht, also ist das Formular gültig. `contractBody` sendet `billedUntil: '' || null`, das Backend löscht das Datum, und die Seite meldet «gespeichert» und wechselt zur Detailseite. Die Fehlermeldung unter dem Feld sieht der Liegenschaftsverwalter nicht mehr. Ohne gespeicherte Abrechnung nimmt das Backend das Löschen an (`statementsChanged` findet nichts). Der nächste Lauf rechnet dann wieder ab Vertragsbeginn ab, also genau die Doppelabrechnung, die #133 verhindern soll. Bei `noticeReceivedOn` gibt es dasselbe Muster schon, dort ist die Folge aber kleiner. Hier ist das Verhalten neu.

**So zeigt man den Fehler.** In `contract-edit.dom.test.ts` den Mietvertrag mit `billedUntil: '2024-12-31'` öffnen, `type('billed-until-input', '31.06.2024')` eingeben und `save()` aufrufen. Dann ist `puts()[0].body.billedUntil` gleich `null`, und gespeichert wird trotzdem.

**Behebung.** Den ungültigen Text als Feldfehler in `valid()` sehen (z. B. ein `error` für `billedUntil`, wenn das Feld Text, aber keinen Wert hat) und dann nicht speichern. Dazu ein DOM-Test, der zuerst rot ist.

### C-3 (Major): Die Ablehnung eines geänderten «Abgerechnet bis» hat kein Szenario

**Warum falsch.** V-2 macht eine neue Ablehnung sichtbar: Im Formular «Bearbeiten» lehnt Dwello ein neues oder geändertes «Abgerechnet bis» ab, wenn es die Mietstage einer versendeten oder bezahlten Abrechnung ändert, und nennt die Abrechnung. Bei einem Entwurf bietet Dwello «Entwurf löschen und speichern» an. Das ist eine Verhaltensänderung, die der Liegenschaftsverwalter sieht, und der E2E-Stack kann sie mit echten Daten erzeugen (kein Fehlerzustand). CLAUDE.md, Workflow 1, verlangt dafür ein Szenario. Abgedeckt ist sie nur im Backend (`billed-until.pg.test.ts:143-150`). Ob der Text `contracts_billed_locked_*` («… lässt sich das Datum nicht speichern. Prüfen Sie das Datum.») zu diesem Feld passt, prüft kein Test.

**So zeigt man den Fehler.** `grep -n "Abgerechnet bis" tests/e2e/features/*.feature`: Kein Szenario hat eine gespeicherte Abrechnung und ändert danach «Abgerechnet bis».

**Behebung.** Ein Szenario in `contract-edit.feature`: Angenommen eine versendete Abrechnung 2024. Wenn der Liegenschaftsverwalter einträgt, dass die Nebenkosten bis "2024-06-30" ausserhalb von Dwello abgerechnet sind, dann meldet das Formular, dass die Abrechnung … mit den bisherigen Vertragsdaten berechnet wurde (bestehende Steps und Fragen für `form-error` wiederverwenden).

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht selbst wiederholt:** `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2731), `cd backend && bun run test` (763 mit Coverage-Check), nach dem Refactor `bun test billed-until.pg.test.ts contract-end.pg.test.ts` (27) und E2E chromium/api für contract-detail, contract-edit und statement-generate (99 grün, 1 nach einer Korrektur der testid wieder grün). Mein Versuch, die betroffenen Vitest-Dateien zu wiederholen, scheiterte: `node_modules` des Worktrees verweist auf `/home/user/Dwello/node_modules`, und eine Deny-Regel blockiert den Zugriff. Backend-Tests und E2E durfte ich nicht starten.
- **Axe- und Sprachzeilen** der Vertragsseiten liefen laut Aufrufer noch. Dass `contract-detail-notice` und `contract-edit-notice` (Dora mit «Abgerechnet bis» 31.12.2014, `tests/e2e/fixtures/screens.ts:84`) und der Zustand `missing-statements` mit dem neuen Hinweissatz 0 Verstösse haben und in fr/it/en kein Deutsch zeigen, ist nicht bestätigt. Die Einträge in `screens.json` gibt es schon (`contract-detail`, `contract-edit`, `-notice`). Neue Zustände braucht es keine, weil das Feld und der Satz in bestehenden Zuständen erscheinen.
- **Rot ohne Änderung**, nur durch Lesen beurteilt: Ohne die Änderung schlagen alle neuen Unit-, DOM- und pg-Tests und die fünf neuen Szenarien fehl (fehlendes Feld bzw. fehlende testid, `billsIn`, `billingStart` in Prorating, Heizanteil, Akonto und `statementsChanged`, PDF-Zeile). Die zwei pg-Tests zur Sperre unterscheiden beide Teile von V-2.
- **PDF in FR/IT/EN:** `tenancyBilledLine` gibt es in allen vier Sprachen. Geprüft ist nur der deutsche Text (`billed-until.pg.test.ts:160`). Den Wortlaut entscheidet #325 (Marker `pdf.service.ts:546`).
- **#325:** Das Issue ist offen und deckt die Begriffe, die PDF-Zeile und das Glossar (gelesen über `gh api`). C-5 (Zeitraum bei den Akontobeiträgen) steht nicht darin.
- **Leerstand:** Mit `billingStart` in `handleMultipleContracts` zählt `handleVacancy` die Tage vor «Abgerechnet bis» als Leerstand. Das Ergebnis `vacancy` liest heute niemand (`grep calculateApartmentProrating`: nur `calculation.service.ts`, das nur `contracts` und `totalPeriodDays` nutzt). Darum ist das kein Befund. Wer `vacancy` künftig nutzt, muss das beachten.
- **Andere Anzeigen:** Dashboard und Vertragsliste (#211) und die Vorschau-Erklärung (V-6 → #327) liegen laut Auftrag ausserhalb. In der App zeigt nur `StatementRow.svelte:46` die abgerechneten Tage als «Mietstage». Das ist richtig, eine falsche Angabe zum «Mietverhältnis» gibt es in der App nicht.
