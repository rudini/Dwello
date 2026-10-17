# Fach-Review Workflow 1, Runde 2: #96 und #104 (Commit 58d49f6)

Gegenstand: `git diff 00a419d 58d49f6` (Umsetzung), Worktree `/tmp/claude-0/-home-user-Dwello/448bd968-db3f-51d5-8b5a-96a95e074d39/scratchpad/review-s1-fach2`. Vorbericht: `docs/reviews/w1b-fachreview-1.md`.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | (Major) erledigt | Rückerstattung steht jetzt in `statements_later_sent` und `invoices_missed_text` (alle vier Sprachen, DOM-Tests) |
| V-1 | Verwalter | (Major) erledigt | Tankbestand mit `fuelStock` gespeichert, ohne Link mit PDF-Text gezeigt, im Hinweis ausdrücklich ausgeschlossen, #307 offen |
| V-15 | Verwalter | Major | Abrechnungen von vor Migration 0008 verlieren alle Warnungen: kein Hinweis an der Abrechnung, kein «Rechnung schon abgerechnet», keine Warnung beim Löschen einer abgerechneten Rechnung mit Beleg |
| V-14 | Verwalter | Minor | Negativer Betrag (Tankbestand gestiegen, Gutschrift) erscheint als «CHF-500.00», auch in der Formel «Ihr Anteil»; das PDF zeigt «-500.00» |
| V-16 | Verwalter | Minor | Zeitanteil «100.00 %» auf der Detailseite, wo das PDF «366/366 Tage» zeigt (Mieter über die ganze Periode, Rechnungen über verschiedene Tage) |
| M-3 | Mietrecht | Minor | «Ist der Betrag zu hoch, erstatten Sie ihm die Differenz.» passt nicht, wenn der Mieter die Nachzahlung noch nicht bezahlt hat |
| V-17 | Verwalter | Nit | DOM-Test zeigt eine rechnerisch falsche Formel «… + 500.00 × 139/365) / 2’300.00 = 306.52» (richtig wären 314.40) |
| M-2 | Mietrecht | Nit (Rest) | Rechnungsseite erledigt; auf der Abrechnungsseite fehlt der pg-Test «danach nicht umlagefähig», den der Plan nennt |
| V-12 | Verwalter | Nit (Rest) | Alle vier Varianten umgesetzt und gleich wie im PDF; `partNoPeriod` und `partBeyond` ohne DOM-Test |

Wie die übrigen Befunde aus Runde 1 umgesetzt wurden:

- **V-2:** erledigt. Der Titel lautet jetzt «Rechnungen seit der Abrechnung geändert» (fr/it/en entsprechend).
- **V-3:** erledigt. Der Titel lautet «Abrechnungen nicht aktuell», der Folgetext «… dann rechnen sie die Rechnung so ab, wie sie jetzt ist.» Dass beide Warnungen zusammen erscheinen, legt der pg-Test «nennt bei einer danach geänderten Rechnung die Periode als abgerechnet und als verpasst» fest (statement-invoices.pg.test.ts:157). Das Szenario prüft das nicht, das genügt aber.
- **V-13:** erledigt (docs/PRD-Dwello.md:540).
- **Nicht angesprochen:** V-4 bis V-11 waren Minor oder Nit und sind unverändert, ausser V-10: Die Detailseite zeigt jetzt Mietverhältnis und Mietstage untereinander, aber weiter ohne «von 366 Tagen». Der Auftrag fragte nicht nach diesen Befunden.

## Nachgerechnet

- **Szenario «verschiedene Leistungszeiträume»** (unverändert): 900 × (600 × 0/91 + 1’200 × 47/92) / 1’800 = 900 × 613.0435 / 1’800 = 306.52. Bestätigt. Formeltext der UI (`statements_part_share`) = PDF `partShare` (pdf.service.ts:81).
- **Randfall null:** Die Rechnung 600 → 900 im Zeitraum mit 0 Mietstagen ändert 306.52 nicht. Der Hinweis zählt sie trotzdem (V-4, unverändert).
- **Tankbestand im DOM-Test** (statement-pages.dom.test.ts:588–595): 1’200 × 47/92 = 613.04; 500 × 139/365 = 190.41; Summe 803.45. 900 × 803.45 / 2’300 = 314.40, nicht 306.52 (V-17). Die Seite gibt nur `tenantShare` aus, rechnet also nicht selbst. Die Abweichung steckt in den Testdaten, nicht in der App.
- **Hinweislogik** (statement-invoices.service.ts:153–180): Eine Rechnung gilt als «so abgerechnet», wenn Kategorie, Verteilschlüssel, Betrag in der Periode und Tage gleich sind. Neu, geändert (Betrag, Leistungszeitraum, Kategorie, Verteilschlüssel), gelöscht und «nicht mehr umlagefähig» werden je einmal gezählt. Eine Änderung nur der Beschreibung zählt nicht. Ändert sich der ganze Leistungszeitraum, aber nicht sein Teil in der Periode, zählt das ebenfalls nicht; der Mieterbetrag bleibt dann gleich. Bestätigt.
- **Gespeicherter Betrag** = `inPeriod.amount` (invoice.service.ts:507–521), also der Teil in der Periode. Das entspricht der Frage aus Runde 1 («Nicht bestätigt»). `deductedAmount` fliesst nicht in die Berechnung ein (gesucht in calculation.service.ts, statement*.ts, fuel-stock.service.ts). Er kann den Hinweis also nicht auslösen.

## Befunde

### M-1 (erledigt)

**Beleg:** `messages/de.json` `statements_later_sent` und `invoices_missed_text`: «… Ist der Betrag zu hoch, erstatten Sie ihm die Differenz. Ob Sie zusätzliche Kosten noch nachverlangen können, ist nicht in jedem Fall sicher …». fr, it und en sind gleich aufgebaut. Tests: invoice-pages.dom.test.ts:277, statement-pages.dom.test.ts:500. Der Fall «gelöscht» ist mit pg getestet (statement-invoices.pg.test.ts:117).

Art. 257b Abs. 1 OR (Fedlex): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …» Der Text nennt jetzt beide Richtungen. Restpunkt: siehe M-3.

### V-1 (erledigt)

**Beleg:**
- Speicherung: `BilledInvoice.fuelStock` (schema.ts) und calculation.service.ts:371–378. `invoiceParts` und `invoices` stammen beide aus `group.invoices` und haben dieselbe Reihenfolge (calculation.service.ts:157, 371). Die Zuordnung `part: item.invoiceParts?.[index]` (src/lib/server/statement.ts) stimmt deshalb.
- Anzeige: Die Veränderung Tankbestand erscheint ohne Link, mit `statements_part_stock` = PDF `partStock` (pdf.service.ts:79) und Test (statement-pages.dom.test.ts:593–597).
- Hinweis: Sie ist ausgeschlossen (`!billed.fuelStock`, statement-invoices.service.ts:177; `getInvoicesForStatement` enthält sie nicht).
- Offene Arbeit: #307 (produkt, entscheiden) beschreibt Ursache, Vorschlag und «Done means».

Das ist die zweite Variante aus Runde 1. Ein pg-Test, der eine Abrechnung mit Tankbestand ohne Änderungen prüft (erwartet `[]`), fehlt. Die Logik ist aber richtig, deshalb nur als Empfehlung.

### V-15 (Verwalter, Major): Bestehende Abrechnungen verlieren alle Warnungen

**Beleg:**
- `statement-invoices.service.ts:165, 172`: `if (!known(positions)) return [];` und `:203` `if (!known(positions)) continue;`. Abrechnungen von vor Migration 0008 haben `invoices = NULL` (0008_line_item_invoices.sql: «Empty for statements created before»; docs/data-model.md:321: «Statements created before keep it empty and report no change»).
- Bisher (`git show 00a419d:src/lib/server/invoice.ts`, `statementPeriods`) erkannte die App solche Abrechnungen über Periode und Zeitstempel. Für sie erschienen «Rechnung schon abgerechnet», der Beleg-Hinweis und die Warnung beim Löschen, und an der Abrechnung der Hinweis auf später erfasste Rechnungen.
- Nach der Änderung hängen an `billedIn` die Warnung auf der Bearbeitungsseite (edit/+page.svelte:117), `InvoiceBeleg billed=` mit «Die Rechnung ist abgerechnet; Mieter können den Beleg verlangen.» (+page.svelte:115) und `DeleteConsequences` (Löschwarnung und `invoices_delete_beleg_billed`). Für alte Abrechnungen ist `billedIn` immer leer.
- Art. 257b Abs. 2 OR (Fedlex): «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»

**Warum falsch:** Ein Vermieter mit Abrechnungen aus dem letzten Jahr, die er schon versendet hat (vor dem Update erstellt), kann eine abgerechnete Rechnung samt Beleg löschen oder ändern, ohne jede Warnung. Die Abrechnung meldet danach auch nichts. Gerade bei versendeten Abrechnungen braucht er den Beleg noch für die Belegeinsicht des Mieters. Bisher hat die App ihn gewarnt. Die Änderung entfernt diese Schutzfunktion für alle Bestandsdaten. Bei neuen Abrechnungen fällt die Lücke nicht auf, im Betrieb aber sofort.

**Korrektur:** Für Abrechnungen ohne gespeicherte Rechnungen (`!known`) die bisherige Regel weiterführen: Periode überschneidet die Rechnung, und die Rechnung wurde vor bzw. nach der Abrechnung erfasst. Für jede Richtung (`billedIn`, `missedIn`, Hinweis an der Abrechnung) einen pg-Test. Alternative: eine Rückfüllung in der Migration, soweit möglich. Wenn feststeht, dass es keine Bestandsdaten gibt (Produktentscheid), sinkt die Schwere auf Minor. Dann gehört das in docs/data-model.md und in den Pull Request.

### V-14 (Verwalter, Minor): Negative Beträge auf der Detailseite

**Beleg:**
- `formatCurrency(-500)` ergibt «CHF-500.00» (Intl de-CH, nachgeprüft mit Node).
- LineInvoices.svelte:12: `number = (amount) => formatCurrency(amount).replace(/^CHF\s/, '')` entfernt bei negativen Beträgen nichts. Die Formel lautet dann «Ihr Anteil: 900.00 × (… + CHF-500.00 × 139/365) / …».
- Das PDF zeigt «-500.00» (pdf-format.ts:10–13).
- Eine negative Veränderung Tankbestand ist häufig (Endbestand > Anfangsbestand, Tank im Herbst gefüllt; fuel-stock.service.ts: `opening − closing`). Gutschriften sind ebenfalls negativ.

**Warum falsch:** Die Formel ist nicht mehr lesbar und weicht vom PDF ab. #104 verlangt aber dieselben Angaben wie im PDF.

**Korrektur:** In `number` das Vorzeichen erhalten, z. B. `formatCurrency(amount).replace(/^CHF\s?/, '')`. Bei der Zeilenangabe prüfen, ob «CHF -500.00» gewünscht ist. Ein DOM-Test mit negativem Tankbestand.

### V-16 (Verwalter, Minor): Zeitanteil in Prozent statt in Tagen wie im PDF

**Beleg:**
- calculation.service.ts:151–167: Ein Mieter über die ganze Periode mit Rechnungen über verschiedene Tage bekommt `noDays` (`shareDays = null`, `invoiceParts = null`).
- UI CostTable.svelte (`timeShare`): Ohne `shareDays` erscheint `periodShare` in Prozent, also «100.00 %».
- PDF pdf.service.ts:483–484: Ist `periodShare` gleich Mietstage/Periodentage, zeigt das PDF «366/366 Tage».
- Dasselbe gilt für Abrechnungen von vor #208 ohne Tage.

**Warum falsch:** Zelle «Zeitanteil» auf der Seite und im PDF weichen voneinander ab. Das widerspricht #104.

**Korrektur:** Die Regel des PDFs übernehmen: ohne `shareDays` und `invoiceParts` und nicht nach Heizprofil, bei `periodShare ≈ rentalDays/periodDays` «{rentalDays}/{periodDays} Tage». Ein DOM-Test.

### M-3 (Mietrecht, Minor): Rückerstattung bei unbezahlter Nachzahlung

**Beleg:** «Ist der Betrag zu hoch, erstatten Sie ihm die Differenz.» (`statements_later_sent`, `invoices_missed_text`).

Art. 62 Abs. 1 OR (Fedlex): «Wer in ungerechtfertigter Weise aus dem Vermögen eines andern bereichert worden ist, hat die Bereicherung zurückzuerstatten.»

**Warum problematisch:** «Erstatten» setzt voraus, dass der Mieter schon bezahlt hat. Bei einer versendeten, noch offenen Nachzahlung muss der Vermieter weniger verlangen und nichts erstatten. Bei einem Guthaben muss er mehr auszahlen. «Der Betrag» lässt offen, ob der Saldo oder die Kosten gemeint sind.

**Korrektur:** «Verlangt die Abrechnung zu viel, schulden Sie dem Mieter die Differenz: Ziehen Sie sie von der Nachzahlung ab oder erstatten Sie sie.» Dazu fr/it/en und die zwei DOM-Tests anpassen.

### V-17 (Nit): Inkonsistente Testdaten

statement-pages.dom.test.ts:588–595 erwartet «… + 500.00 × 139/365) / 2’300.00 = 306.52». Nachgerechnet ergibt das 314.40. Der Test prüft nur die Darstellung, er belegt aber eine falsche Rechnung. `tenantShare` in den Testdaten auf 314.40 setzen.

### M-2 (Rest, Nit)

Die Rechnungsseite ist erledigt: Die Abkürzung `isValidUtilityCost === false` ist entfernt. Der pg-Test «nennt bei einer abgerechneten, danach nicht umlagefähigen Rechnung die Periode als abgerechnet» steht in statement-invoices.pg.test.ts:166. Auf der Abrechnungsseite fehlt der Test «danach nicht umlagefähig» (der describe-Block «Geänderte Rechnungen seit der Abrechnung», Z. 84–134, hat nur «gelöscht»). Der Plan (implementation_plan.md) nennt ihn aber. Der Codepfad ist derselbe wie bei «gelöscht», das Verhalten stimmt also. Test ergänzen oder den Plan berichtigen.

### V-12 (Rest, Nit)

Die Texte `statements_part_line`, `_no_period`, `_beyond`, `_stock` und `_share` entsprechen in allen vier Sprachen den PDF-Texten (pdf.service.ts:77–81, 154–158, 231–235, 308–312). Unterschiede: die Tausender-Apostrophe ’ gegenüber ' und `formatCurrency` mit «CHF ». Das sind Formatfragen. Getestet sind nur `partLine` und `partStock`. `partNoPeriod` und `partBeyond` wählt LineInvoices.svelte:558–566 über `part.noPeriod` und `part.whole`. Je ein DOM-Test fehlt.

## Fehlende Begriffe

Unverändert aus Runde 1 (Kostenanteil / «Ihre Nebenkosten», Mietverhältnis in der Abrechnungsperiode, Abgerechnete Rechnungen einer Abrechnungsposition). Ein Issue dazu habe ich im Worktree nicht gefunden (nicht gesucht: GitHub-Issues ausser #307 und #132). Neue Begriffe kommen nicht dazu.

## Nicht bestätigt

- **Bestandsdaten (V-15):** Ob es produktive Abrechnungen von vor 0008 gibt, weiss ich nicht. Davon hängt die Schwere ab. Gelesen: Migration 0008, docs/data-model.md:321, der frühere `statementPeriods` in 00a419d.
- **Rechtsgrundlage der Rückforderung des Mieters** (Saldo aus Vertrag oder Art. 62 ff. OR): weiterhin **unsicher**. Art. 63 Abs. 1 OR (Fedlex: «Wer eine Nichtschuld freiwillig bezahlt, kann das Geleistete nur dann zurückfordern, wenn er nachzuweisen vermag, dass er sich über die Schuldpflicht im Irrtum befunden hat.») könnte die Rückforderung bei Zahlung auf eine falsche Abrechnung einschränken. Rechtsprechung dazu habe ich nicht geprüft. Der Text «erstatten Sie ihm die Differenz» bleibt fachlich die richtige Empfehlung.
- **Fedlex:** Die Zitate stammen aus der Datei vom ersten Durchgang (OR, Fassung 1.10.2026, scratchpad/fedlex/or.html). `mmx search` lieferte keine Fedlex-Treffer.
- **E2E-Szenarien:** gelesen, nicht ausgeführt. Ob die Steps die Texte vollständig prüfen, habe ich nur an den Szenariozeilen beurteilt.
- **#307:** gelesen (offen, `produkt` und `entscheiden`). Die Formulierung des vorgeschlagenen Satzes habe ich nicht fachlich geprüft, sie ist noch nicht entschieden.
