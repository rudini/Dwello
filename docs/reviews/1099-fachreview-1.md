# Fachreview #1099, Runde 1 (Umfang vor der Umsetzung, Commit 4d8e61f)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Blocker | (c) ist nicht tot: Berichtigte Abrechnung und «Neu berechnen» rechnen eine Abrechnung unter einem Jahr von vor #1088 neu, ohne Prüfung der Periode; ohne den Zweig `noHeatingMonths` gibt das 0/0 = NaN |
| V-2 | Verwalter | Major | Die Begründung im Plan («No scenario: … unreachable», «nothing a user can reach changes») trifft nicht zu. Die Teilung durch die Periodenmonate (b) und die Berechnung von (c) laufen weiter für Perioden unter einem Jahr. Plan und Kommentare müssen das sagen, und die beibehaltene Berechnung braucht einen Test, der sie festhält |
| V-3 | Verwalter | Minor | Kommentare zu (b) nicht durch «nur 100 % ± 0.1» ersetzen. Richtig ist: «Monate tragen nicht 100 %: ein Profil mit 100 % ± 0.1 oder eine Periode unter einem Jahr von vor #1088 und deren berichtigte Abrechnung» (`pdf.service.ts:683`, `prorating.service.ts:176`) |

## V-1 (Blocker)

Beleg:
- `backend/src/services/statement-run.service.ts:83-92`: Nur `generateInPeriod` (Route `POST /statements/generate`, `routes/statements.ts:172`) lehnt mit `STATEMENT_PERIOD_OF_BUILDING` ab. Der eigene Kommentar dort sagt: «a berichtigte Abrechnung keeps the period of the replaced one (correctStatement)».
- `backend/src/services/statement.service.ts:947-965` (`correctStatement`, Route `/:id/correction`, `routes/statements.ts:285`) ruft `generateStatement` direkt auf, mit `periodStart`/`periodEnd` und `heatingProfileId` der ersetzten Abrechnung.
- `statement.service.ts:596-603` (`recalculateStatement`, Route `/:id/recalculation`) → `recalculated` (l.547-556) rechnet einen Entwurf mit dessen Periode neu.
- Beide laufen über `calculation.service.ts:201` (`byRunProfile`) und `:482` (`heatingOfRun`) in `handleMidYearMoves`.
- Es gibt solche Abrechnungen: `backend/migrations/0042_building_accounting_period.sql` nimmt die Periode des Gebäudes ausdrücklich nur aus «its latest whole statement». Andere Abrechnungen (unter einem Jahr) bleiben bestehen (PO #1088: «bestehende Abrechnungen bleiben»).
- Sie sind rechtmässig. VMWG Art. 4 Abs. 1 (Stand 1. Oktober 2025): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Eine kürzere Periode ist also zulässig. Eine Berichtigung muss dieselbe Periode abrechnen. Sonst bleibt ein Teil unabgerechnet oder wird doppelt abgerechnet.

Warum falsch: Nehmen wir eine Abrechnung 01.06.–31.08.2024 mit Profil Mittelland und Einzug am 15.07. (Fall aus `prorating.pg.test.ts:112-126`). Dann ist `period.percentage = 0` und `tenant.percentage = 0`. Ohne `prorating.service.ts:180` gilt `roundToRappen(0/0*100)` = NaN, und `share` = NaN geht in die Heizkostenposition. Die Berichtigung bricht ab oder speichert unsinnige Beträge. Heute verteilt sie richtig nach Tagen und nennt den Grund (`statements_profile_reason_no_heating_months`).

Nachrechnung mit einem zweiten Wert: Periode Juli–Dezember, Einzug am 1. Oktober (`prorating.pg.test.ts` ~l.128). Das ergibt 40.5/41.5 = 97.59 %. Die Teilung (b) ist hier nur für die Periode unter einem Jahr nötig, und sie bleibt laut Plan.

Korrektur: Bei (c) nicht nur Schema-Typ und Text behalten, sondern auch die Berechnung in `prorating.service.ts:180` und ihren Rückgabetyp (l.155). Ihr Test `prorating.pg.test.ts:112` bleibt. Punkt (c) fällt aus dem Umfang von #1099. Alternativ müssten Berichtigung und Neuberechnung solche Perioden ablehnen. Das widerspricht aber «bestehende Abrechnungen bleiben» und wäre eine PO-Entscheidung (`needs-decision`), kein Aufräumen.

## V-2 (Major)

Beleg: Plan `implementation_plan.md:15` («the paths are unreachable since #1088 … no user can see the change»). Erreichbar sind sie über `correctStatement` und `recalculateStatement` (siehe V-1).

Warum falsch: Die Aussage stimmt nur für (a). Die Vorschau der Hilfe (`checkBuildingInvoices`, `invoice-completeness.service.ts:382-400`) zeigt nur der Assistent, und Schritt 2 lehnt eine andere Periode ab (`src/lib/server/statement-generation.ts:86-93`). Berichtigung und Neuberechnung laufen ohne Vorschau und haben den Hinweis auch vorher nie gezeigt. Deshalb ändert das Entfernen von (a) nichts, was ein Nutzer sieht.

Korrektur: Die Begründung von «No scenario» auf (a) beschränken. Für (b) und (c) einen `*.pg.test.ts` aufnehmen, der festhält: die berichtigte Abrechnung einer ersetzten Abrechnung unter einem Jahr (z. B. 01.07.–31.12., Einzug am 1.10., und 01.06.–31.08. ohne Heizmonate) teilt wie bisher bzw. verteilt nach Tagen mit `reason: 'noHeatingMonths'`. Er hält Verhalten fest, das bleibt, also ist kein roter Lauf nötig. Der Commit sagt das. Das Gleiche gilt für die Docs-Zeile `docs/data-model.md:344`: sie bleibt.

## Antworten auf die Fragen

- Eine bestehende Abrechnung unter einem Jahr darf ersetzt und berichtigt werden, mit derselben Periode. Der Code tut das heute, ohne Ablehnung: V-1.
- Heizrechnung mit eigenem Leistungszeitraum: Sie läuft über `byProfile` / `sharedByInvoices` (`calculation.service.ts:189-193`), also mit den Profilmonaten in den Tagen der Rechnung. Dafür braucht es weder `invoicesWithoutServicePeriod` noch `noHeatingMonths`. Der Hinweis `heatingWithoutServicePeriod` (`heatingHintsOf`, l.361-364) bleibt.

Geprüft: Befund 1 des Aufrufers stimmt. Die Toleranz von ± 0.1 steht in `heating-profile.service.ts:130-132`. Nachgerechnet: 50.10/100.10 = 50.05 %, 49.9/99.9 = 49.95 %. `periodSums` (`pdf.service.ts:685-691`) und `periodMonths` (`calculation.service.ts:491`) bleiben. Befund 3 (a) ist erreichbar nur im Assistenten und kann weg. `runDifferences` mit gespeichertem `noHeatingMonths` (`statement-run.test.ts:251-259`) braucht den Typ im Schema, und der bleibt.

## Nicht bestätigt

- Ob die Oberfläche «Berichtigen» bzw. «Neu berechnen» für eine Abrechnung unter einem Jahr anbietet, habe ich nicht auf dem Bildschirm geprüft. Geprüft habe ich nur, dass die Routen `routes/statements.ts:282-307` die Periode nicht prüfen. Ob es solche Abrechnungen in einer produktiven Datenbank gibt, habe ich nicht geprüft. Die Migration 0042 rechnet mit ihnen.
