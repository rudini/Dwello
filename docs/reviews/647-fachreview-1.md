# Fachreview #647, Runde 1 (Szenario vor der Umsetzung)

Gegenstand: `tests/e2e/features/statement-generate.feature:789-802` (Commit 3e2826d8c), Szenario «Hinweis auf Rechnungen der Heizkosten ohne Leistungszeitraum beim Lauf einer berichtigten Abrechnung».

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| F-1 | Verwalter | Major | Die Regel «es zählen die Mietverträge, die der Lauf abrechnet» ist unterhalb des Szenarios nicht festgehalten: der bestehende Unit-Test hält das Gegenteil fest, der Fall #335 und die Grenze «nur in genau dieser Periode ersetzt» haben keinen Test |
| F-2 | Verwalter | Minor | Titel und Kommentar sagen «Lauf einer berichtigten Abrechnung»; laut Glossar gibt es nur den Abrechnungslauf, der die berichtigte Abrechnung erstellt (Zeile 169, 190). Vorschlag: «… wenn der Abrechnungslauf eine berichtigte Abrechnung erstellt», im Kommentar «der Abrechnungslauf erstellt die berichtigte Abrechnung und rechnet ihren Mietvertrag wieder ab (#120)» |

## F-1 (Major): die Regel ist unterhalb des Szenarios nicht festgehalten

**Belege**
- `backend/src/__tests__/statement-run.test.ts:457-462`, Test «nennt sie nicht, wenn die Abrechnung des Mietvertrags mit dem Einzug in der Periode ersetzt ist» (Code-Review E-1): Er hält genau das Verhalten fest, das #647 aufhebt.
- `backend/src/services/statement-run.service.ts:260`: `billed` schliesst jede Abrechnung aus, die die Periode schneidet. `planRun` (Zeilen 51-53) zählt dagegen eine ersetzte Abrechnung nur dann nicht, wenn sie **genau diese** Abrechnungsperiode hat (`replacedHere`). Eine ersetzte Abrechnung einer kurzen oder überschneidenden Periode rechnet den Mietvertrag dort weiter ab (#199); der Lauf erstellt für ihn nichts.
- Das Szenario prüft nur #339. Für #335 (`oldHeatingRule`, Zeilen 263-267) gibt es keinen Fall mit ersetzter Abrechnung (Test Zeilen 466-474).

**Warum das falsch ist:** Nach dem Entscheid zählen genau die Mietverträge, die der Lauf abrechnet. Bleibt der E-1-Test stehen, widerspricht er dem Entscheid. Schliesst die Umsetzung einfach alle `replaced` aus (statt nur die ersetzten Abrechnungen dieser Periode), zeigt die Vorschau die Hinweise auch für einen Mietvertrag, den der Lauf gar nicht abrechnet. Kein Test würde das merken: Im Szenario hat die ersetzte Abrechnung genau die Periode des Laufs.

**Fachlich zu #335:** Der Fall ist richtig und gehört dazu. Ein Beispiel: Die Abrechnung von Marc Huber ist versendet und verteilt die Heizkosten noch nach der alten Regel über das ganze Jahr. Die Abrechnung von Eva Frei ist ersetzt, und eine Heizrechnung hat inzwischen den Leistungszeitraum Januar bis März. Dann rechnet die berichtigte Abrechnung von Eva Frei die Monate im Leistungszeitraum. Beide Abrechnungen zusammen können mehr als die Heizkosten der Wohnung tragen. Das ist genau der Fall, für den es den Hinweis aus #335 gibt. Die ersetzte Abrechnung selbst erscheint zu Recht nicht im Hinweis: `oldHeatingRule` nimmt nur Abrechnungen mit Status `sent` oder `paid` (`invoice-completeness.service.ts:318`), und die berichtigte Abrechnung tritt an ihre Stelle.

**Ein eigenes Szenario für #335?** Nicht nötig. Beide Hinweise hängen an derselben Menge `billed`, und die Anzeige des Hinweises aus #335 zeigt schon das Szenario in `statement-generate.feature:750`. Ein Test der reinen Funktion `runHeatingHints` deckt den Fall ab.

**Behebung** (in `statement-run.test.ts`, «Hinweise zu den Heizkosten eines Laufs»):
1. Den Test aus E-1 umkehren: Ist die Abrechnung des Mietvertrags mit dem Einzug in genau dieser Periode ersetzt, nennt der Lauf die Heizrechnungen ohne Leistungszeitraum (`hinted`).
2. Einen neuen Fall ergänzen: Eine ersetzte Abrechnung einer anderen Periode, die die Periode des Laufs schneidet (z.B. 2024-05-01..2024-10-31), zählt weiter als abgerechnet, also kein Hinweis. In der Umsetzung dieselbe Regel wie `replacedHere` in `planRun` verwenden, keine zweite Regel.
3. Eine Zeile zu #335 ergänzen: Die Abrechnung des Vormieters ist in der Periode ersetzt, die des Nachmieters ist versendet und steht in `oldHeatingRule`. Erwartet wird die versendete Abrechnung.
4. Den Kommentar in `statement-run.service.ts:258-259` («whether … is open in #647») anpassen.

## Nicht bestätigt
- Ob `seed.replaceStatement` (`tests/e2e/fixtures/backend.ts:379`) die Abrechnung ohne `correct` nur auf `replaced` setzt, ohne eine berichtigte Abrechnung anzulegen. Das Szenario setzt voraus, dass es noch keine gibt. Ich habe nur die Signatur gelesen. Das bestandene Szenario «Der Abrechnungslauf rechnet einen Mietvertrag mit ersetzter Abrechnung wieder ab» (Zeile 49) spricht dafür.
- Fedlex nicht abgefragt: Das Szenario und sein Kommentar stellen keine rechtliche Behauptung auf.

Geprüft: Ablauf des Szenarios gegen `runHeatingHints`/`planRun` (Eva Frei: Abrechnung 2024 ersetzt, Auszug 31.03. mit Heizprofil, also Hinweis; Marc Huber: Abrechnung vorhanden, also nicht abgerechnet), Abgleich mit den Nachbarszenarien zu #339, #335 und #120. Begriffe Leistungszeitraum, Heizprofil, berichtigte Abrechnung und Ersetzt gegen `UBIQUITOUS_LANGUAGE.md`. Keine Beträge oder Formeln.
