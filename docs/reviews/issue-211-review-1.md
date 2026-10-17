# Code-Review #211 / #199, Runde 1

Worktree: `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/review-211-code` (Commit ca7170e7), Diff `6a76fbcf..ca7170e7`. Alle 38 geänderten Dateien gelesen.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `src/routes/contracts/[id]/MissingStatement.svelte:30` | Der Marker `TODO(fachlich prüfen, #281)` nennt ein geschlossenes Issue (#281 am 17.10. 10:34 als Duplikat von #408 geschlossen). Damit scheitert `check-issues` in CI. |
| C-2 | Major (Produktentscheid) | `src/lib/overview.ts:185-196`, `MissingStatement.svelte:20-28` | #211 und #281 sind seit 10:34 in #408 zusammengefasst (offen, `entscheiden`). #408 Punkt 1 führt den Rechnungslink als «Still open» («link anyway, or filter the list by period»), Punkt 2 die Behandlung der Teilbereiche. Der Diff setzt je eine Option um, und «Fixes #211» schliesst ein bereits geschlossenes Issue. |
| C-3 | Major | `messages/*.json:1612` mit `MissingStatement.svelte:517-519, 564-576` | Bei mehreren fehlenden Abrechnungen bleibt der Text «… aber noch keine Nebenkostenabrechnung in Dwello. Jede Schaltfläche öffnet den Assistenten …». Neben jeder Periode steht jetzt aber auch eine Schaltfläche «Rechnungen … ansehen», und ein Teilbereich hat keine Schaltfläche zum Assistenten. Der Text ist damit in jedem Mehrzahl-Fall falsch (V-10). |
| C-4 | Major | `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature` | Der neue Zustand am Mietvertrag fehlt in allen drei Dateien: ein Teilbereich mit eigenem Text, ohne «Abgerechnet bis» und ohne Schaltfläche zum Assistenten. `contracts_statement_missing_partial` in fr/it/en prüft damit niemand auf Deutsch oder auf axe. |
| C-5 | Minor | `messages/de.json:1618` | #199 (entschieden) und Fachreview 2 V-9, Korrektur 1, verlangen, dass der Text die Periode der bestehenden Abrechnung nennt. Der Text sagt nur «Eine bestehende Abrechnung». V-9 (Major des fach-reviewer) ist ohne neue Runde nicht als erledigt bestätigt. |
| C-6 | Minor | `MissingStatement.svelte:522-528` | Gibt es auch nur einen Teilbereich, fällt der Hinweis «Abgerechnet bis» auch für die ganzen Perioden weg. V-9, Korrektur 3, will ihn nur beim Teilbereich weglassen. |
| C-7 | Minor | `src/lib/accounting-period.ts:140-142` | Ein Teilbereich wird nicht auf die Mietstage gekürzt. Beispiel: Vertragsbeginn 01.04.2024, Abrechnung 01.07.–31.12.2024. Dann sagt der Text «für 01.01.2024 – 30.06.2024 gibt es noch keine Abrechnung»; mitgezählt sind Tage vor dem Vertragsbeginn bzw. bis «Abgerechnet bis» (#133). Dafür gibt es keinen Test. |
| C-8 | Minor | `src/lib/overview.ts:241`, `messages/de.json:270-271` | Der Rechnungslink der Übersicht hat keinen Gebäudefilter, auch wenn nur ein Gebäude genannt ist. «Erstellen Sie dann die Abrechnungen» passt nicht zu einem Teilbereich (Fachreview 2 V-11). |
| C-9 | Minor | `src/lib/overview.ts:204-206, 190-195` | Ungetestet: die Wahl Einzahl/Mehrzahl («dieser Periode»/«dieser Perioden») und `invoicesOf` mit Gebäude über den Jahreswechsel (`/invoices?building=…`). Beide Verzweigungen kann man ändern, ohne dass ein Test rot wird. |
| C-10 | Minor | `src/routes/contracts/+page.server.ts:338`, `src/routes/dashboard/+page.server.ts:667` | `missingByContract` läuft nach dem bestehenden `Promise.all`, also nacheinander: zwei Anfragen mehr in Reihe. Die Übersicht lädt `/config` zweimal. |
| C-11 | Minor | neue Texte (`contracts_statement_missing_partial`, `dashboard_task_missing_periods_text`) | Fachreview 2 V-7: Der UL-Eintrag «Hinweis auf fehlende Abrechnungen» ist veraltet. Die neuen Texte tragen keinen Marker und haben kein Issue. |
| C-12 | Nit | `src/routes/contracts/[id]/+page.server.ts:461-469` | ponytail `shrink:` `endedPeriodsSince` läuft ein zweites Mal, nur um «ganze Periode» zu erkennen. Besser liefert `missingPeriods` das selbst mit (z. B. `whole: gap === period`). |
| C-13 | Nit | `src/lib/accounting-period.ts:109-110, 121` | ponytail `reuse:` `dayAfter(start, -1)` ist ein «day before» und wiederholt die Tagesrechnung aus `billsIn` (`src/lib/contract-status.ts:31`). |
| C-14 | Nit | `MissingStatement.svelte:564-576` | Zwei Teilbereiche im selben Jahr ergeben zwei gleiche Links «Rechnungen 2024 ansehen» (V-13). |
| C-15 | Nit | `src/routes/dashboard/+page.server.ts:631` | Die Übersicht gruppiert nach `buildingName` statt nach Gebäude-Id. Zwei gleichnamige Gebäude fallen so zusammen. |

ponytail-review: L461-469 shrink (C-12), L109-121 reuse (C-13). net: etwa −6 Zeilen möglich.

## C-1 (Major): Marker auf geschlossenes Issue

**Warum falsch.** `tools/open-work/check-issues.mjs:62-63` meldet jeden Marker, dessen Issue nicht `open` ist: «#281 is closed; remove or repoint these markers». `gh api repos/rudini/Dwello/issues/281` liefert `state: closed`, `state_reason: duplicate` mit dem Kommentar «Consolidated into #408». CI wird beim Pull Request rot.

**Zeigen.** `node tools/open-work/check-issues.mjs` mit Netz, oder CI-Lauf des Pull Requests.

**Korrektur.** Den Marker auf #408 umstellen; die Kommentare zu #281 können bleiben.

## C-2 (Major, Produktentscheid): Umsetzung von Optionen eines offenen `entscheiden`-Issues

**Warum falsch.** #408 ist um 10:32 entstanden, also zwei Minuten vor dem Commit. Es ist mit `entscheiden` gelabelt und fasst #211 und #281 zusammen. Unter Punkt 1 steht ausdrücklich: «Still open: the invoice list filters by the year of the Rechnungsdatum … link anyway, or filter the list by period». Der Diff wählt «link anyway» (Gebäude und Jahr, sonst nur das Gebäude). Unter Punkt 2 (#281) stehen die Optionen 1–3; der Diff setzt sinngemäss Option 3 um, nur die Tage nennen, als Zwischenstand. Nach CLAUDE.md, «When to ask», ist bei einem offenen `entscheiden`-Issue zu denselben Daten, das das Ergebnis ändern würde, zuerst zu fragen. Dazu kommt:
- «Fixes #211» zielt auf ein geschlossenes Issue. Den Fortschritt verfolgt jetzt #408.
- Der vierte entschiedene Punkt von #211 ist weder umgesetzt noch begründet ausgelassen: das Rechnungsformular «Rechnung schon abgerechnet» folgt derselben Regel (Kommentar aus #226).

**Zeigen.** `gh api repos/rudini/Dwello/issues/408` (Labels `fachlich,entscheiden`, Punkt 1 «Still open», Punkt 2 mit Optionen).

**Weiter.** Unter «Blocked on me»: ob Punkt 1 (Link nach Gebäude und Jahr) und der Zwischenstand zu Punkt 2 so bleiben dürfen. Ausserdem, worauf der Pull Request verweist (Refs #408) und was mit dem Punkt zum Rechnungsformular geschieht.

## C-3 (Major): Mehrzahltext widerspricht den neuen Schaltflächen

**Warum falsch.** Bei mehr als einer Periode zeigt `MissingStatement.svelte:517-519` immer `contracts_statements_missing_text`: «Der Mietvertrag hat Mietstage in diesen Abrechnungsperioden, aber noch keine Nebenkostenabrechnung in Dwello. Jede Schaltfläche öffnet den Assistenten für alle Mietverträge des Gebäudes in dieser Periode.» Seit diesem Diff hat jede Periode zusätzlich ein `Button` (ghost) «Rechnungen … ansehen», der zur Rechnungsliste führt. Ein Teilbereich hat keine Schaltfläche zum Assistenten und liegt in einer Periode, für die es eine Abrechnung gibt. Der Satz ist also in jedem Mehrzahl-Fall falsch, auch im geseedeten a11y-Zustand `missing-statements` (vier Schaltflächen, zwei davon nicht zum Assistenten). Bei einem Teilbereich stehen zudem «aber noch keine Nebenkostenabrechnung» und «Eine bestehende Abrechnung deckt nur einen Teil … ab» nebeneinander. Die Zielgruppe glaubt dem Text.

**Zeigen.** `src/__tests__/contract-detail-page.dom.test.ts:276` erwartet den Satz «Jede Schaltfläche öffnet den Assistenten …». Dieselbe Seite rendert dort aber mit `open()` je Periode eine Rechnungs-Schaltfläche (Default `invoices` in `open`, Zeilen 69-73). Der Test bestätigt den Widerspruch, statt ihn zu fangen. Im Szenario «Teilweise abgerechnete Periode am Mietvertrag» (2025 ganz, 01.10.–31.12.2024 teilweise) stehen beide Sätze zusammen.

**Korrektur.** Text nach V-10, Korrektur, in allen vier Sprachen: «Der Mietvertrag hat in diesen Abrechnungsperioden Mietstage ohne Nebenkostenabrechnung in Dwello.» Den Satz über den Assistenten an die Schaltfläche «… abrechnen» binden. Vorher ein roter DOM-Test.

## C-4 (Major): Neuer Zustand fehlt in a11y und Sprachen

**Warum falsch.** Nach CLAUDE.md, «Process», gehört jeder neue Zustand in `tests/a11y/screens.json` (mit `stateMeanings`), `accessibility.feature` und `sprachen-bildschirme.feature`. Neu ist am Mietvertrag der Hinweis für einen Teilbereich: anderer Titel, `contracts_statement_missing_partial` statt «Abgerechnet bis», keine Schaltfläche zum Assistenten. Geändert wurde nur die Bedeutung von `missing-statements` (`screens.json:55`), und dessen Seed (seit 2015, Abrechnungen 2024/2025) erzeugt keinen Teilbereich. Damit prüft kein Lauf axe hell/dunkel für diesen Zustand. Ebenso wenig prüft einer, dass fr/it/en dort kein Deutsch zeigen.

**Zeigen.** `grep -n partial tests/a11y/screens.json tests/e2e/tasks/accessibility.ts` findet nichts. `tests/e2e/tasks/accessibility.ts:222-223` seedet nur den Fall mit ganzen Perioden.

**Korrektur.** Einen Zustand (z. B. `missing-statement-partial`) mit Seed «Abrechnung 01.04.–30.09. des Vorjahres» anlegen und in beiden Features eintragen.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`: vom Aufrufer gemeldet.
- `bunx vitest run` (3027 Tests): vom Aufrufer gemeldet. Selbst nachgelaufen auf ca7170e7: `missing-statements`, `overview`, `dashboard`, `contract-actions`, `contract-list`, `contract-detail-page.dom`, `open-work`. Ergebnis: 7 Dateien, 166 Tests grün.
- E2E (139 grün): vom Aufrufer gemeldet, und zwar auf dem Commit vor der letzten Umstellung von `MissingStatement.svelte`. Auf ca7170e7 lief E2E nicht; ich habe es nicht gestartet. Die DOM-Tests decken die Textwahl ab, die Szenarien «Teilweise abgerechnete Periode am Mietvertrag» und «Rechnungen der fehlenden Periode anzeigen» sind auf ca7170e7 also nicht gesehen.
- `backend/src/__tests__/api-contracts.pg.test.ts` für `contracts.json` (`billedUntil`): nicht gelaufen (schreibt in die Test-DB). Laut Kommentar `api-contracts.pg.test.ts:347` prüft `drift` Felder mit `null` nicht. Der Vertrag belegt also nicht, dass `billedUntil` in der Liste kommt. Laut Code ja: `backend/src/services/contract.service.ts:37` (`contractFields`), `:60`.
- `tools/open-work/check-issues.mjs`: nicht gelaufen. Den Zustand von #281 habe ich über `gh api` bestätigt (C-1).
- Rote Tests nur durch Lesen beurteilt. `missing-statements.test.ts` scheitert ohne `missingPeriods` am Import. Die Erwartungen in `dashboard.test.ts`/`overview.test.ts` (Perioden in Klammern, `Leerbau`) scheitern mit der alten Logik «nur letzte Periode». Ebenso die neuen DOM-Tests (Rechnungslink, Teilbereich) ohne die Änderung an `MissingStatement.svelte`. Die E2E-Schritte für den Teilbereich und die Liste scheitern ohne Badge bzw. Text, das Szenario «Rechnungen der fehlenden Periode» ohne Link. Plausibel, aber nicht ausgeführt.
- Ob die Personas Anna/Helga und der fach-reviewer (V-9 bis V-13) nach der Umsetzung zustimmen: offen (Plan, Punkt «Slice review … feature review»).
