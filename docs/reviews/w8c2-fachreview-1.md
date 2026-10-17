# Fach-Review W8c-2 (#65), Runde 1

Gegenstand: `git diff 0f3d5d1d 0c9c2c59 -- tests/e2e/features`, Szenario «Ohne Vorjahr weist die Vorschau nicht auf Monate ohne Rechnung hin» (`tests/e2e/features/statement-generate.feature:200-206`), Worktree `review-w8c2-fach` (detached bei 0c9c2c59).

Ergebnis: kein Blocker, kein Major. Das Szenario setzt den Entscheid von #65 (Option A) um, und seine Daten erzeugen den Fall wirklich.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Minor | Ohne Vorjahr bleibt in Gebäuden mit Mieterwechsel oder ohne Akonto gar kein Hinweis auf fehlende Rechnungen, auch nicht die Akonto-Prüfung. Der Entscheid geht davon aus, dass die Akonto-Prüfung diese Lücke deckt. |
| V-2 | Verwalter | Nit | Das Beispiel «Kaltwasser» vom 15.03. passt nur halb zum Kommentar «eine Rechnung im Jahr kann vollständig sein». |

## V-1 (Minor): Was ohne Vorjahr noch warnt, ist schmaler, als der Entscheid annimmt

Belege:
- Laut #65, «Decided (product owner)», weist ohne Vorjahr nur noch die Akonto-Prüfung auf fehlende Rechnungen hin: «In a period without a year before, missing invoices are hinted only by the Akonto check (costs more than 30 % below the Akonto)».
- `src/lib/statement-wizard.ts:220`: `if (!(totalAdvancePayments > 0)) return null;`. Ohne Akonto gibt es also keinen Hinweis.
- `src/lib/statement-wizard.ts:230-231`: Der Hinweis «zu tief» gilt nur bei `wholePeriod` (`rentalDays >= totalPeriodDays`). Ein Mietvertrag, der nur einen Teil der Periode läuft, bekommt ihn nicht.
- Die Grundlage des Szenarios zeigt genau diesen Fall. Eva Frei mietet vom 01.01. bis 31.03.2024, dann steht die Wohnung leer, Marc Huber mietet ab 01.05.2024. Beide haben kein Akonto. Die Vorschau zeigt nach der Änderung nur noch «1 Rechnung vom 15.03.2024». Die Abschnittsprüfung nach Kategorie greift nicht (`hasComparison: false`, siehe unten), die Warnung «keine Rechnungen» auch nicht (count = 1).

Nachgerechnet:
- Szenario: 1 Wohnung, Kaltwasser 800 ohne Leistungszeitraum, abgerechnete Tage 366. Eva 91 Mietstage, Marc 245. Beide `wholePeriod = false`, beide ohne Akonto, also `akontoHint` = null. Es erscheint kein Hinweis.
- Gegenbeispiel: Ein Mieter über die ganze Periode zahlt 150 Akonto pro Monat, total 1800. Ist nur die Kaltwasserrechnung 800 erfasst, kommen mit 3 % Verwaltungspauschale 824 zusammen. Abweichung (824 − 1800) / 1800 = −54 %, also erscheint der Hinweis «zu tief».
- Randfall: Kosten 1400 bei Akonto 1800 (etwa wenn nur die Heizrechnung für das 4. Quartal fehlt) ergeben −22 %, also keinen Hinweis. Fehlt nur ein Teil, fällt das auch beim Mieter über die ganze Periode nicht auf.

Bewertung: Der Entscheid selbst steht nicht zur Diskussion. Er hat aber nicht berücksichtigt, dass die Akonto-Prüfung bei Mieterwechsel und ohne Akonto schweigt. Das betrifft gerade das erste Jahr in Dwello: Dann fehlt das Vorjahr immer, und einzelne Rechnungen gehen am ehesten vergessen. Der Mieter trägt kein Risiko, denn fehlende Rechnungen senken nur seine Kosten. Der Vermieter verrechnet zu wenig. Das mildert die Lücke:
- Die Vorschau nennt weiter Anzahl und Datum der Rechnungen («1 Rechnung vom 15.03.2024», `statements_coverage_one`). Das Szenario prüft das in Zeile 205.
- Eine später erfasste Rechnung lässt sich mit einer berichtigten Abrechnung nachverlangen (`statement-detail.feature`, #120).

Vorschlag (kein Code in diesem Slice):
- Im PR unter «Found» vermerken, dass ohne Vorjahr bei Mieterwechsel oder ohne Akonto keine Prüfung auf Vollständigkeit läuft.
- Falls der Product Owner das anders gewichten will, kommt es in ein eigenes Issue (Labels `fachlich`, `entscheiden`). Möglicher Inhalt: die Akonto-Prüfung ohne Vorjahr auch für Teilperioden anhand der Kosten pro Mietstag laufen lassen.
- Kein neuer Begriff nötig.

## V-2 (Nit): Beispielkategorie

Der Kommentar in Zeile 200 lautet «eine Rechnung im Jahr kann vollständig sein». In #65 ist das Beispiel eine Öllieferung pro Jahr. Eine Wasserrechnung der Gemeinde im März rechnet in der Praxis oft das Vorjahr ab (Ablesung am Jahresende). Ohne Leistungszeitraum zählt sie in Dwello nach dem Rechnungsdatum zu 2024 (UL «Abgerechnete Tage»). Das ist bestehendes Verhalten und nicht Gegenstand dieses Slices. Eindeutiger wäre «Kaminfeger»: Der Kaminfeger kommt typischerweise einmal im Jahr, und die Kategorie steht in der UL-Liste der Kategorien (Zeile 91). Fachlich falsch ist das Szenario mit «Kaltwasser» trotzdem nicht. Ändern ist optional.

## Bestätigt

- **Entscheid abgebildet:** Titel und letzter Schritt «weist die Vorschau nicht auf Monate ohne Rechnung hin» prüfen, dass `data-testid="partial-invoices"` nicht vorkommt (`tests/e2e/targets/statement-generate.ts:44`, `tests/e2e/steps/statement-generate.steps.ts:243-245`). Das ist genau der Hinweis, den #65 entfernt (`PreviewChecks.svelte:120-123`, `statements_partial_title/text` in `messages/de.json:1267-1268`). Das entspricht dem «Done means» von #65: «a period without a year before whose invoices cover only part of it shows no such hint».
- **Die Daten erzeugen den Fall (heute rot):**
  - Die einzige Rechnung ist vom 2024-03-15 und hat keinen Leistungszeitraum. Damit gilt first = last = 2024-03-15 (`src/lib/server/statement-generation.ts:203-213`, ohne Leistungszeitraum zählt das Rechnungsdatum).
  - Abstand zum Periodenbeginn: 2024-01-01 bis 2024-03-15 sind 74 Tage, also nicht über 90. Abstand zum Periodenende: 2024-03-15 bis 2024-12-31 sind 291 Tage, also über `GAP_DAYS = 90`. Damit ist `partly` wahr (`statement-wizard.ts:246-250`).
  - Ein Vorjahr fehlt doppelt. Es gibt keine Rechnung 2023 (`previous.length === 0`). Zudem liegt die erste Rechnung des Gebäudes (2024-03-15) nach 2023-01-01 + 92 Tagen = 2023-04-04, also `partlyRecorded` (`invoice-completeness.service.ts:173-174`). Daraus folgt `hasComparison: false`, also `partial: true`. Heute erscheint der Hinweis, der Schritt scheitert also am fehlenden Verhalten.
  - Die Grundlage legt das Gebäude ohne weitere Rechnungen neu an.
- **Schutz gegen eine leere Vorschau:** Der Schritt «nennt die Vorschau für "Lindenhof" 1 erfasste Rechnung» stellt sicher, dass die Vorschau geladen ist. «Kein Hinweis» kann also nicht von selbst grün werden.
- **Abgrenzung:** Der Hinweis zählte nie zu `needsConfirmation` (`statement-wizard.ts:258-259`). Sein Wegfall ändert also an der Bestätigungspflicht nichts. Die Prüfung nach Kategorie mit `gap` erst ab 2 Rechnungen im Vorjahr (`invoice-completeness.service.ts:120-121`) bleibt, ebenso das Szenario «Hinweis auf fehlende Rechnungen einer Kategorie» (Zeile 208 ff.).
- **Begriffe:** Diese Begriffe stehen im UL: «Gebäude», «Rechnung», «Kategorie», «Kaltwasser» (UL:91), «Abrechnungsperiode» (UL:150), «Liegenschaftsverwalter». «Vorschau» und «Vorjahr» sind keine UL-Begriffe, aber gewöhnliche Wörter, die die Feature-Datei schon führt (65-mal «Vorschau», «Vorjahr» in Zeile 208 und 323). «Monate ohne Rechnung» beschreibt nur den entfernten Hinweis und braucht keinen eigenen Begriff. Es gibt keine fehlenden Begriffe. Der Slice bringt keinen neuen Text, also gibt es auch keinen Übersetzungsbedarf.
- **Mietrecht:** Das Entfernen eines internen Hinweises an den Vermieter ändert nichts an dem, was der Mieter erhält. Für den Mieter ist nichts Unzulässiges oder Irreführendes erkennbar. Für diese Aussage war kein Artikelzitat nötig.

## Nicht bestätigt

- Ob und bis wann der Vermieter vergessene Nebenkosten nachträglich mit einer berichtigten Abrechnung nachfordern darf, etwa nach der vorbehaltlosen Annahme durch den Mieter. Diese Aussage ist **unsicher**. Ich habe dazu nicht auf Fedlex gesucht, weil sie nur für die Einordnung von V-1 dient, nicht für das Szenario. Gesucht habe ich nur in `statement-detail.feature` (#120) nach dem Verhalten der App.
- Die Gewichtung der Praxis «Wasserrechnung im März betrifft das Vorjahr» in V-2 beruht auf Erfahrung als Verwalter, ohne Quelle.
