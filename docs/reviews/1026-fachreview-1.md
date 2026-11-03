# Fachreview 1026-1: Rat nach der Summe der Heizkosten (Fall 1 #339, Fall 2 «zu wenig»)

Gegenstand: Commit 73a3ed1, tests/e2e/features/statement-generate.feature:798-841 (Szenario #451 geändert, Szenario #508 erweitert, zwei neue @wip-Szenarien). Entscheid #1026 Option A (PO 02.11.2026).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Blocker | Der Hinweis #339 erscheint auch im Szenario #508 («zu viel») und im neuen Szenario «zu wenig». Ersetzt Fall 1 den Rat nach dem Ergebnis, scheitern beide. Hängt er den Satz an, scheitert das Szenario zu Fall 1. Die drei Szenarien lassen sich nicht zusammen erfüllen. |
| V-2 | Verwalter | Minor | «die Abrechnung» im Satz «zu wenig» folgt direkt auf «Die Abrechnungen der Wohnung …». Gemeint ist die versendete Abrechnung von {tenant}, das sagt der Satz aber nicht. Fix: «die Abrechnung von {tenant}» wie im Rat «zu viel» (Wortlaut unten). Das ändert einen entschiedenen Text, darum muss der PO zustimmen. |
| V-3 | Verwalter | Minor | Das Szenario «zu wenig» prüft den Betrag nicht (feature:826 prüft nur «zu wenig. Den Unterschied …»), und dem Kommentar fehlt die Summe. Fix: im Dann «CHF 1’370.00 ohne Verwaltungspauschale, CHF 550.00 zu wenig. Den Unterschied …» prüfen, im Kommentar «verrechnet 900.00 + 470.00 = 1'370.00 gegen 1'920.00» ergänzen. |

## V-1 (Blocker): Die Bedingung von Fall 1 gilt in allen drei Szenarien

**Beleg.**
- `withoutBesideWith` (backend/src/services/invoice-completeness.service.ts:325-330) nennt jede Heizrechnung ohne Leistungszeitraum, wenn eine andere Rechnung derselben Kategorie einen hat. `runHeatingHints` (statement-run.service.ts:340-357) behält den Hinweis bei einem Mieterwechsel mit Heizprofil (Eva zieht am 31.03. aus, Heizprofil «Winter»).
- «Heizkostenrechnung über "1000" Franken für 2024» ist «Heizöl 2024» vom 30.06., Kategorie `Heating` = nameDE «Heizung», ohne Leistungszeitraum (tests/e2e/fixtures/backend.ts:461-463). «Rechnung der Kategorie "Heizung"» ist dieselbe Kategorie (backend.ts:45-46, 487-490). In Lindenhof gibt es keinen Tankbestand, `covered` ist also falsch (fuel-stock.service.ts:57), und Heizöl zählt als Heizrechnung.
- Damit hat der Lauf den Hinweis #339 in feature:803-812 (#508, Dann «… CHF 450.00 zu viel. Erstellen Sie für Marc Huber»), in feature:817-826 («zu wenig. Den Unterschied tragen Sie …») und in feature:830-841 («zu viel. Fehlt einer Heizrechnung …»).
- Das Szenario #508 und das zu Fall 1 haben dieselbe Bedingung (beide Hinweise, Ergebnis «zu viel»), erwarten nach «zu viel.» aber verschiedene Sätze. Die Prüfung ist `toContain` (statement-generate.steps.ts:613), die Notizen sind mit einem Leerzeichen verbunden (ChangedStatements.svelte:18).

**Warum falsch.** Keine Umsetzung erfüllt alle drei Szenarien. Fachlich ist der Plan richtig: Fall 1 ersetzt den Rat nach dem Ergebnis, bei jedem Ergebnis. Stünden beide Sätze da («Erstellen Sie … eine berichtigte Abrechnung. … Erst dann zeigt sich, ob eine Abrechnung berichtigt werden muss.»), widerspräche der zweite dem ersten. Fehlt der Leistungszeitraum, ist auch «zu wenig» oder «gleich viel» noch nicht sicher (508-1 V-2, P-3). Der Aufbau der Szenarien muss die beiden Fälle trennen.

**Fix.**
1. Szenario #508 (feature:812): das Dann wie auf `main` lassen, mit dem Ende «… CHF 450.00 zu viel.». Es hält mit beiden Sätzen dahinter, eine Spec-Änderung ist nicht nötig. Den Zusatz «Erstellen Sie für Marc Huber» aus diesem Commit zurücknehmen.
2. Neues Szenario für den Rat «zu viel»: Aufbau wie #508, aber Heizöl mit Leistungszeitraum über die ganze Periode, also `Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2024-06-30" für die Zeit vom "2024-01-01" bis "2024-12-31"` statt «Heizkostenrechnung … für 2024». Dann: `"CHF 450.00 zu viel. Erstellen Sie für Marc Huber eine berichtigte Abrechnung."`
3. Szenario «zu wenig» (feature:819): dieselbe Rechnung über das ganze Jahr statt «Heizkostenrechnung … für 2024».
4. Nachgerechnet mit diesem Aufbau. Beim Versand haben beide Rechnungen die ganze Periode, die Gruppe wird nach dem Heizprofil über die Periode verteilt (calculation.service.ts:228-229). Marc alt bekommt 2'000 × 45 % = 900.00, wie bisher. Heute hat «Heizung» eigene Tage, darum wird pro Rechnung gerechnet (`byProfile`). Heizöl ganzes Jahr: Marc 450.00, Eva 470.00, Leerstand 80.00, wie ohne Leistungszeitraum. Der Hinweis auf die alte Regel bleibt (invoice-completeness.service.ts:337: eine Rechnung hat nicht die ganze Periode; Marcs Positionen haben keine `profile`-Teile). `withoutBesideWith` ist leer, der Hinweis #339 fällt also weg. Die Beträge bleiben gleich.

Die Antwort auf die Frage des Callers: Ja, in Fall 1 steht nach den Zahlen nur `statements_heating_sum_period_first`, bei «zu viel», «zu wenig» und «gleich viel». Das ist eine Auslegung von «a sentence follows the numbers» in Option A. Der Pull Request soll sie nennen.

## Beträge

- «zu wenig» (feature:817-826). Heizung 1'000.00 Okt.-Dez. Marc alt bekam nach «Winter» Mai-Dez. (4+1+0+0+3+9+13+15) = 45 %, also 450.00. Heute trägt Marc 100 % davon, also 1'000.00, Eva 0. Heizöl 1'000.00 ganzes Jahr: Marc 45 % = 450.00, Eva Jan.-März 47 % = 470.00, Leerstand April 8 % = 80.00.
  - Heizkosten der Wohnung **2'000.00**. Davon tragen die Mieter 450 + 1'000 + 470 = **1'920.00**, der Vermieter **80.00**.
  - Verrechnet: Marc alt 900.00 + Eva neu 470.00 = **1'370.00**. Unterschied 1'370 − 1'920 = **−550.00, zu wenig**.
  - Gegenprobe: Marc heute 1'450.00 − Marc alt 900.00 = 550.00. Mit 3 % Verwaltungspauschale steigt Marcs Nachzahlung bei einer Berichtigung um 566.50. Die 550.00 ohne Pauschale sind der richtige Unterschied (Art. 4 Abs. 3 VMWG, 508-1). Das stimmt mit dem roten Lauf überein.
- Fall 1 (feature:830-841). Heizung 1'520.00 ohne Leistungszeitraum, 1'000.00 Jan.-März. Marc alt: 2'520 × 45 % = 1'134.00. Eva neu: 1'520 × 47 % + 1'000 = 1'714.40. Verrechnet 2'848.40.
  - Mieteranteil: Marc heute 684.00 + Eva 1'714.40 = 2'398.40. Leerstand 1'520 × 8 % = 121.60. Ergebnis: **450.00 zu viel**, wie erwartet.
  - Randfall: Trägt man bei der 1'520 den Leistungszeitraum Jan.-März ein, trägt Eva 2'520.00, Marc 0, kein Leerstand. Das ergibt 1'134.00 zu viel. Der Satz «Erst dann zeigt sich …» stimmt, der Betrag ändert sich.
- Randfall null: Szenario «Kein Hinweis …» (feature:843 ff.), 450.00 + 1'470.00 = 1'920.00, also gleich viel (508-1).

## Satz «zu wenig»: wer trägt was, welche Abrechnung, Mietrecht

- **Wer trägt was.** Der Mieter schuldet nur, was ihm die Abrechnung verrechnet. Was keine Abrechnung verrechnet, bleibt beim Vermieter. «Den Unterschied tragen Sie» stimmt also. Die Verwaltungspauschale auf diesem Unterschied entgeht dem Vermieter zusätzlich. Sie ist aber kein Aufwand, den er trägt, und muss im Satz nicht stehen.
- **Welche Abrechnung.** Die versendete nach der alten Regel (hier Marc). Die neue Abrechnung des Laufs rechnet mit den heutigen Rechnungen und der heutigen Regel. Ohne Hinweis #339, also in Fall 2, ist sie richtig. Eine Abrechnung im Entwurf würde der Lauf ohnehin neu berechnen. Darum V-2.
- **Ist die Berichtigung zulasten des Mieters zulässig?** Das ist ein Wahlrecht, keine Pflicht, und stimmt mit dem Begriff überein. UBIQUITOUS_LANGUAGE.md:199: «sinkt der Saldo dabei nicht, kann er stattdessen «Nicht berichtigen» wählen». Zeile 201: «Nicht berichtigt … ist kein Verzicht auf eine Forderung». Der Satz verspricht nicht, dass der Mieter den Unterschied bezahlen muss, er sagt nur, wer ihn ohne Berichtigung trägt. Er ist darum auch dann richtig, wenn eine Nachforderung nach Bezahlung strittig ist.
  - OR Art. 257b Abs. 1 (Stand 1. Oktober 2026): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, …». Die richtig berechneten 1'920.00 übersteigen die tatsächlichen Aufwendungen nicht. Die Berichtigung auf 1'450.00 für Marc ist also mit Art. 257b Abs. 1 vereinbar.
  - OR Art. 257a Abs. 2 (Stand 1. Oktober 2026): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Das ist erfüllt, weil der Lauf nur vereinbarte Heizkosten zählt (508-1 V-3).
  - VMWG Art. 7 Abs. 1 (Stand 1. Oktober 2025): «Die Heizungskosten für nicht vermietete Wohn- und Geschäftsräume trägt der Vermieter.» Der Leerstand (80.00) ist aus dem Mieteranteil herausgerechnet.
  - OR Art. 128 Ziff. 1 (Stand 1. Oktober 2026): «Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen». Das ist die Frist. Ob eine Nachforderung nach vorbehaltloser Zahlung noch geltend gemacht werden kann, regelt das Gesetz nicht: **unsicher**, siehe unten.

## Wortlaut

Reihenfolge: `statements_existing_old_heating_rule` (nur noch die ersten zwei Sätze), dann die Zahlen (`_costs*`, `_more`/`_less`/`_equal`). Danach mit Hinweis #339 nur `_period_first`. Sonst `_advice_more` bei «zu viel», `_advice_less` bei «zu wenig» und nichts bei «gleich viel». Die Schlüssel `_advice_*` sind ein Vorschlag. `_advice_less` mit {tenant} folgt V-2. Stimmt der PO nicht zu, gilt der entschiedene Text ohne «von {tenant}»: de «Den Unterschied tragen Sie, wenn Sie die Abrechnung nicht berichtigen.», fr «Si vous ne rectifiez pas le décompte, la différence est à votre charge.», it «Se non rettifica il conteggio, la differenza è a carico Suo.», en «If you do not correct the statement, you bear the difference.»

| key | de | fr | it | en |
|---|---|---|---|---|
| statements_existing_old_heating_rule | Die Abrechnung von {tenant} ist schon versendet. Sie verteilt die Heizkosten noch über die ganze Abrechnungsperiode, nicht nach dem Leistungszeitraum der Heizrechnungen. | Le décompte de {tenant} a déjà été envoyé. Il répartit encore les frais de chauffage sur toute la période de décompte, et non selon la période de prestation des factures. | Il conteggio di {tenant} è già stato inviato. Ripartisce ancora le spese di riscaldamento sull’intero periodo di conteggio, non secondo il periodo di prestazione delle fatture. | The statement for {tenant} has already been sent. It still spreads the heating costs over the whole billing period, not by the service period of the invoices. |
| statements_heating_sum_advice_more | Erstellen Sie für {tenant} eine berichtigte Abrechnung. | Établissez un décompte rectificatif pour {tenant}. | Allestisca un conteggio rettificato per {tenant}. | Create a corrected statement for {tenant}. |
| statements_heating_sum_advice_less | Den Unterschied tragen Sie, wenn Sie die Abrechnung von {tenant} nicht berichtigen. | Si vous ne rectifiez pas le décompte de {tenant}, la différence est à votre charge. | Se non rettifica il conteggio di {tenant}, la differenza è a carico Suo. | If you do not correct the statement for {tenant}, you bear the difference. |
| statements_heating_sum_period_first | Fehlt einer Heizrechnung der Leistungszeitraum, tragen Sie ihn zuerst ein und öffnen Sie die Vorschau erneut. Erst dann zeigt sich, ob eine Abrechnung berichtigt werden muss. | S’il manque la période de prestation d’une facture de chauffage, saisissez-la d’abord et rouvrez l’aperçu. Vous verrez alors seulement si un décompte doit être rectifié. | Se a una fattura del riscaldamento manca il periodo di prestazione, lo inserisca prima e riapra l’anteprima. Solo allora si vedrà se un conteggio va rettificato. | If a heating invoice has no service period, enter it first and open the preview again. Only then will you see whether a statement needs to be corrected. |

Die Begriffe stammen aus docs/design/i18n-begriffe.md:94, 97 (décompte rectificatif / conteggio rettificato / corrected statement, Rectifier / Rettificare / Correct). «à votre charge» und «a carico Suo» wie in `statements_heating_sum_costs_vacancy` (508-1). Fehlende Begriffe: keine.

## Nicht bestätigt

- Ob der Vermieter eine Nachforderung durchsetzen kann, wenn der Mieter die versendete Abrechnung schon vorbehaltlos bezahlt hat, ist **unsicher**. Weder OR Art. 257a/257b noch Art. 128 (Stand 1. Oktober 2026) oder VMWG Art. 4-8 (Stand 1. Oktober 2025) regeln das. UBIQUITOUS_LANGUAGE.md:200 sagt «nicht einheitlich geklärt». Den Satz «zu wenig» betrifft das nicht, weil er keine Durchsetzbarkeit verspricht.
- Dass der Hinweis #339 in den Szenarien #508 und «zu wenig» erscheint, habe ich aus dem Code abgeleitet (Seeds, `withoutBesideWith`, `runHeatingHints`), nicht in einem E2E-Lauf gesehen. Ebenso habe ich die Beträge mit dem Heizöl über das ganze Jahr (Fix V-1) nur aus calculation.service.ts:174-233 nachgerechnet.

Geprüft: die Beträge 550.00 (zu wenig) und 450.00 (Fall 1) mit Gegenprobe und Randfall, die Kürzung von `statements_existing_old_heating_rule` auf zwei Sätze (#451-Szenario feature:798 hält), Art. 257a Abs. 2 und 257b Abs. 1 OR, Art. 7 Abs. 1 VMWG, die Begriffe nach i18n-begriffe.md.
