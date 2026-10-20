# Fach-Review 1 zu #454 (#408 Punkte 1, 7, 8): @wip-Szenarien vor der Umsetzung

Gegenstand: `git diff 8a6c757c~1 8a6c757c -- tests/e2e/features` im Worktree `review-454-fach` (Commit 8a6c757c), dazu die geplanten Regeln und Texte aus dem Auftrag. Grundlage: Issue #454, `review-454-decision-408.md` (Punkte 1, 7, 8), `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md` («Regeln in Dwello»), Code im Worktree.

Fedlex (Filestore, OR «Stand am 1. Oktober 2026», VMWG «Stand am 1. Oktober 2025», heute abgerufen):
- Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …»
- Art. 4 Abs. 1 VMWG: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»
- Art. 5 Abs. 2 lit. a VMWG: «die Brennstoffe und die Energie, die verbraucht wurden»
- Art. 8 Abs. 2 VMWG: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»
- Art. 128 Ziff. 1 OR: «Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen;»
- Art. 130 Abs. 1 OR: «Die Verjährung beginnt mit der Fälligkeit der Forderung.»
- Art. 67 Abs. 1 OR: «Der Bereicherungsanspruch verjährt mit Ablauf von drei Jahren, nachdem der Verletzte von seinem Anspruch Kenntnis erhalten hat, in jedem Fall aber mit Ablauf von zehn Jahren seit der Entstehung des Anspruchs.»

## Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Filter «Abrechnungsperiode» nur mit umlagefähigen Rechnungen: der entschiedene Text verschweigt das, und wer eine als nicht umlagefähig erfasste Rechnung sucht, erfasst sie doppelt. Produktentscheid E-1. |
| V-2 | Verwalter | Major | Tage ohne Abrechnung in der Abrechnungsperiode einer bestehenden Abrechnung des Gebäudes (#408 Punkt 2.1): der Link muss diese Abrechnungsperiode filtern, nicht nur die fehlenden Tage; kein Szenario. |
| V-3 | Verwalter | Major | Regel «vorher keine Zeile, jetzt eine» meldet jede Abrechnung vor Migration 0014 (Positionen ohne `invoices`) mit Tank als geändert, auch auf der Übersicht als «Abrechnung berichtigen». Vergleich auf `utility_statements.fuel_stock` stützen. |
| V-4 | Verwalter | Major | «Abrechnung berichtigen» auch dann, wenn die Änderung den Mieter nicht trifft (Leistungszeitraum ausserhalb seiner Mietstage): die Aufgabe verlangt eine berichtigte Abrechnung mit gleichem Saldo. Produktentscheid E-3. |
| V-5 | Verwalter | Minor | Gleicher Verbrauch mit anderen Einzelwerten: kein Hinweis, obwohl das PDF Anfangs- und Endbestand druckt (`statement-pdf.service.ts:170–190`) und der Mieter darüber Auskunft verlangen kann (Art. 8 Abs. 2 VMWG). Lösung: die Stichtage und Werte vergleichen (mit V-3). Produktentscheid E-2. Zudem passt der Kommentar des Szenarios «Kein Hinweis, …» («demselben Verbrauch») nicht zu seinen Schritten (es ändert nichts). |
| V-6 | Verwalter | Minor | Der vorgeschlagene Text der Übersicht, wenn nur der Tankbestand geändert ist, lässt «erfasst» weg, also den Hauptfall von #386 (eine neu erfasste Rechnung). Wortlaut siehe E-4. |
| V-7 | Verwalter | Minor | Text der Aufgabe «Abrechnung berichtigen»: «ihrer Abrechnungsperiode» und «Berichtigen Sie sie» beziehen sich bei einer Mieterin («von Anna Keller») auf sie; «erfasst» fehlt; der Satz «Die berichtigte Abrechnung rechnet an, was schon bezahlt ist.» aus `statements_later_sent` fehlt. Vorschlag siehe E-4. |
| V-8 | Verwalter | Nit | Mehrzahl mit beidem: «wurden 3 Rechnungen … gelöscht und der Tankbestand … geändert» hat nur ein Hilfsverb im Plural für ein Subjekt im Singular. Besser: «… erfasst, geändert oder gelöscht, und der Tankbestand wurde geändert» (ohne zweites «der Abrechnungsperiode»). |
| V-9 | Verwalter | Minor | `statements_recalculate_text` und `statements_recalculated` (messages/de.json) nennen nur «die Rechnungen, wie sie jetzt sind». Wer wegen des Tankbestands neu berechnet, erfährt nicht, dass der neue Stand gilt. Fix: «… mit den Rechnungen und dem Tankbestand, wie sie jetzt sind». |
| V-10 | Verwalter | Minor | Der Link der Aufgabe zu fehlenden Abrechnungen auf der Übersicht (`src/lib/overview.ts:179`, `invoicesOf(newest(…))` ohne Gebäude) ist auch ein «Hinweis auf fehlende Abrechnungen» (#211: eine Regel für alle Orte). Der Text des Filters braucht aber ein Gebäude. Festlegen: Gebäude der neuesten Lücke setzen, oder je Gebäude ein Link wie in Punkt 7. Kein Szenario. |
| V-11 | Verwalter | Minor | Die gefilterte Liste zeigt bei einem Leistungszeitraum über die Periode hinaus den ganzen Betrag. «Die in die Abrechnungsperiode fallen» lässt glauben, alles zähle. Fix: den Teil in der Periode nennen («davon CHF … in der Periode»), wie das PDF (#241). |
| V-12 | Verwalter | Minor | Bei einer versendeten Abrechnung mit offener Zahlungsfrist kann die Übersicht neben «Abrechnung berichtigen» eine Mahnung derselben Abrechnung vorschlagen. Die Mahnaufgabe sollte bei dieser Abrechnung zuerst auf das Berichtigen verweisen oder nach ihr stehen. |
| V-13 | Verwalter | Nit | Das Szenario «Rechnungen einer Abrechnungsperiode anzeigen» hat keine Rechnung mit Leistungszeitraum, der die Periode nur teilweise berührt, und keine nicht umlagefähige Rechnung. Ergänzen, sobald E-1 entschieden ist, oder im `*.pg.test.ts` festhalten. |
| V-14 | Verwalter | Nit | Der Link «Seeblick, 2025» muss `periodName` nehmen (`src/lib/accounting-period.ts:150`): bei Juli – Juni zeigt er die Daten, nicht «2025» (Dr. Weber P-5). |
| V-15 | Verwalter | Nit | Lower-layer-Tests für den Tankbestand ergänzen: geänderter Anfangsbestand (= Endbestand der Vorperiode, trifft beide Perioden), negative Veränderung, Bestand nachträglich erfasst oder gelöscht, Heizkategorie nicht vereinbart (kein Hinweis). Der Schritt «weist … auf keine geänderten Rechnungen hin» im Tankbestand-Szenario ist missverständlich benannt. |
| M-1 | Mietrecht | Minor | Fünf Jahre: «Abrechnung berichtigen» nicht nach fünf Jahren abschneiden. Wann die Frist beginnt, ist offen (Art. 130 Abs. 1 OR, Fälligkeit; `nebenkostenabrechnung-anforderungen.md`, Unsicherheit 6), und eine Rückforderung des Mieters kann bereicherungsrechtlich bis zehn Jahre laufen (Art. 67 Abs. 1 OR, **unsicher**, welches Regime gilt). Produktentscheid E-5. |
| M-2 | Mietrecht | Minor | Erhöht die Änderung nur den Anteil des Mieters, darf der Vermieter auf die Nachforderung verzichten. Eine Aufgabe, die nur das Berichtigen beendet, drängt zu einer Forderung, die er nicht stellen will. Produktentscheid E-6. |

## Begründung der Major-Befunde

### V-1: Filter nur mit umlagefähigen Rechnungen

- **Beleg:** `backend/src/services/invoice.service.ts:552–563`: `getInvoicesForStatement` wählt nur `eq(invoices.isValidUtilityCost, true)`. Der entschiedene Text sagt aber «Rechnungen von {Gebäude}, die in die Abrechnungsperiode … fallen (nach Leistungszeitraum, sonst Rechnungsdatum)» und nennt die Umlagefähigkeit nicht. Die Rechnungsliste hat schon einen Filter «Umlagefähigkeit» (`src/routes/invoices/+page.server.ts:17`, `validity`) und zeigt die Gruppen «Umlagefähige Kosten» / «Nicht umlagefähige Kosten» (`messages/de.json:904–905`).
- **Warum falsch:** Der Grund für Punkt 1 ist in der Entscheidung genannt: «wer sie für fehlend hält, erfasst sie doppelt». Eine Rechnung, die die KI oder der Vermieter als nicht umlagefähig erfasst hat (oder eine ausgeschlossene), fehlt im Filter genau so wie heute die Rechnung «Fernwärme Q4 2025» bei Helga. Wer sie nicht findet, erfasst sie neu. Wird die erste später umlagefähig gesetzt, rechnet die Abrechnung sie doppelt ab, also mehr als «die tatsächlichen Aufwendungen des Vermieters» (Art. 257b Abs. 1 OR). Und der Text behauptet, es seien alle Rechnungen der Periode.
- **Fix:** siehe E-1. Empfehlung: Option A.

### V-2: Tage in der Periode einer bestehenden Abrechnung des Gebäudes

- **Beleg:** Szenario `contract-detail.feature` «Fehlende Tage in der Abrechnungsperiode eines anderen Mietvertrags»: Anna fehlen 01.04.2024 – 30.06.2024. Dwello bietet dafür «Abrechnungsperiode 01.07.2023 – 30.06.2024 wählen» an (#408 Punkt 2.1). Die Entscheidung sagt zu Punkt 1: der Link setzt «genau die fehlenden Tage bzw. die Periode». Die neuen @wip-Szenarien decken nur eine ganze Periode und eine kurze Abrechnungsperiode ab.
- **Warum falsch, wenn der Link die Tage setzt:** Die Abrechnung, die Dwello hier anbietet, rechnet über 01.07.2023 – 30.06.2024 ab (366 Tage) und nimmt jede Rechnung ohne Leistungszeitraum mit Rechnungsdatum in dieser Periode (Regel 1). Nachgerechnet mit Pro Einheit und 2 Wohnungen:
  - Rechnung Hauswart CHF 600, 15.11.2023, ohne Leistungszeitraum: Wohnungsanteil 300.00, Anna 300 × 91/366 = 74.59 (Mietstage 01.04. – 30.06.2024 = 30 + 31 + 30 = 91). Der Filter 01.04. – 30.06.2024 zeigt diese Rechnung nicht, der Filter 01.07.2023 – 30.06.2024 zeigt sie.
  - Rechnung CHF 400, 10.05.2024, ohne Leistungszeitraum: 200 × 91/366 = 49.73. Beide Filter zeigen sie.
  - Randfall: Rechnung mit Leistungszeitraum 01.01. – 31.03.2024: Anna trägt 0.00. Die Abrechnung nimmt sie trotzdem, also gehört sie in den Filter der Periode.

  Ein Filter nur auf die Tage wiederholt also den Fehler P-2 aus `helga-211.md` (es fehlt eine Rechnung, die zählt).
- **Fix:** Der Link setzt immer die Abrechnungsperiode, die der Hinweis zum Abrechnen anbietet: die bestehende Periode des Gebäudes («Rechnungen für 01.07.2023 – 30.06.2024 ansehen»), sonst die kurze Abrechnungsperiode oder die ganze Periode. Dazu ein Szenario «Rechnungen der Abrechnungsperiode eines anderen Mietvertrags anzeigen». Das folgt aus Punkt 2.1 und Regel 1 und braucht keinen neuen Entscheid. Steht es so nicht im Plan, ist es ein Befund.

### V-3: Tankbestand-Regel bei älteren Abrechnungen

- **Beleg:** `backend/migrations/0014_line_item_invoices.sql`: «The change of the Tankbestand is kept with fuelStock (it is no invoice). Empty for statements created before.» `statement-invoices.service.ts:31–35` behandelt solche Abrechnungen eigens (`known()`, V-15 aus #96). Die Spalte `utility_statements.fuel_stock` mit den Stichtagen und Werten, mit denen die Abrechnung erstellt wurde, gibt es dagegen seit `0001_schema.sql:246` (`schema.ts:448–449`). Sie wird mit `agreedStock` geschrieben (`statement.service.ts:385–388`, nur bei vereinbarter Kategorie).
- **Warum falsch:** Mit «Betrag der Zeile «Veränderung Tankbestand» der Positionen, auch: vorher keine Zeile, jetzt eine» hat jede Abrechnung vor 0014 mit Tank «vorher keine Zeile», obwohl sie den Verbrauch abgerechnet hat. Dwello meldet sie als geändert. Die neue Übersicht macht daraus je versendete oder bezahlte Abrechnung eine Aufgabe «Abrechnung berichtigen», also die Aufforderung, Mietern eine berichtigte Abrechnung ohne Änderung zuzustellen.
- **Fix:** Den Tankbestand der Abrechnung `utility_statements.fuel_stock` mit `agreedStock(...)` von heute vergleichen: andere Stichtage, Werte oder Kategorie, oder vorher null und jetzt ein Wert (und umgekehrt), heisst geändert. Das deckt «nur bei vereinbarter Heizkategorie» mit derselben Funktion ab, mit der die Abrechnung erstellt wird, braucht keinen Vergleich von Gleitkommazahlen und löst V-5 gleich mit. Will der Product Owner beim Betrag bleiben (E-2, Option B): den Betrag aus `fuel_stock` (opening − closing) nehmen, nicht aus den Positionen.

### V-4: «Abrechnung berichtigen» ohne Wirkung auf den Mieter

- **Beleg:** `statement-invoices.service.ts:37–49` (`changedInvoices`) zählt jede Rechnung des Gebäudes in der Periode, die eine vereinbarte Kategorie hat (`agreedIn`). Ob die Rechnung Tage in den Mietstagen dieses Mietvertrags hat, prüft sie nicht. Auf der Abrechnungsseite ist das heute ein Hinweis; neu wird es auf der Übersicht eine Aufgabe, die zum Berichtigen auffordert.
- **Nachgerechnet** (Gebäude mit 4 Wohnungen, Pro Einheit; Mieterwechsel: A 01.01. – 31.03.2025 mit 90 Mietstagen, B 01.04. – 31.12.2025 mit 275 Mietstagen; danach erfasst):
  - Hauswart CHF 300, Leistungszeitraum 01.10. – 31.12.2025 (92 Tage): Wohnungsanteil 75.00. A: 75 × 0/92 = 0.00, die Berichtigung ändert nichts. B: 75 × 92/92 = 75.00. Trotzdem bekommen A und B je eine Aufgabe.
  - Hauswart CHF 300, 15.11.2025, ohne Leistungszeitraum: A 75 × 90/365 = 18.49, B 75 × 275/365 = 56.51, zusammen 75.00. Beide ändern sich.
  - Randfall Heizkosten mit Heizprofil und Leistungszeitraum Oktober – Dezember: A trägt 0 % (Regel 5), wie im ersten Fall.
- **Warum falsch:** Eine berichtigte Abrechnung ersetzt die alte, bekommt eine neue Abrechnungsnummer und geht an einen ehemaligen Mieter, mit demselben Saldo. Für den Mieter ist das unverständlich, für den Vermieter unnötige Arbeit. Gerade die Zielgruppe folgt einer Aufgabe der Übersicht.
- **Fix:** siehe E-3.

## Entscheidungen für den Product Owner

- **E-1 (V-1), Auswahl des Filters «Abrechnungsperiode»:**
  - A (empfohlen): Der Filter wählt nach Regel 1 alle Rechnungen des Gebäudes, auch nicht umlagefähige und ausgeschlossene, gruppiert wie heute nach Umlagefähigkeit. Die Gruppe «Umlagefähige Kosten» ist dann genau die Auswahl von `getInvoicesForStatement`. Der entschiedene Text bleibt und stimmt.
  - B: Genau die Auswahl von `getInvoicesForStatement` (wie entschieden). Dann muss der Text das sagen: «Umlagefähige Rechnungen von {Gebäude}, die in die Abrechnungsperiode … fallen (nach Leistungszeitraum, sonst Rechnungsdatum)», dazu ein Link «Auch nicht umlagefähige Rechnungen zeigen». Das ändert den entschiedenen Text.
  - C: B mit dem Filter «Umlagefähigkeit» auf «umlagefähig» gesetzt und sichtbar, so dass der Vermieter ihn selbst lösen kann.
- **E-2 (V-5), was beim Tankbestand als geändert gilt:**
  - A (empfohlen, mit V-3): Stichtage oder Werte des Anfangs- und Endbestands anders als beim Erstellen. Das PDF druckt sie, und Art. 8 Abs. 2 VMWG gibt dem Mieter Anspruch auf Auskunft über sie.
  - B: wie entschieden nur der Betrag der Veränderung. Dann druckt ein zugestellter Entwurf Werte, die der Vermieter korrigiert hat.
- **E-3 (V-4), wann «Abrechnung berichtigen» eine Aufgabe ist:**
  - A (empfohlen): nur wenn das Neuberechnen den Saldo oder eine Abrechnungsposition dieses Mietvertrags ändern würde (die Berechnung von «Neu berechnen» testweise ausführen und vergleichen).
  - B: nur Rechnungen zählen, deren Tage in der Periode die Mietstage des Mietvertrags berühren, oder ohne Leistungszeitraum. Tankbestand und Lieferungen in den Tank zählen immer, denn sie gelten für die ganze Periode (#257).
  - C: wie geplant, mit dem Text «Prüfen Sie, ob sich der Saldo ändert, und berichtigen Sie die Abrechnung, wenn ja».
  - A und B weichen von «same hint» ab. Für den Hinweis auf der Abrechnungsseite selbst entscheidet der Product Owner, ob dieselbe Regel gilt.
- **E-4 (V-6, V-7), Texte bei geändertem Tankbestand:**
  - Übersicht, ein Text für alle Ursachen (empfohlen, denn die Aufgabe fasst Entwürfe mit verschiedenen Ursachen zusammen): «Seit dem Erstellen wurden Rechnungen ihrer Abrechnungsperiode erfasst, geändert oder gelöscht oder der Tankbestand geändert. Berechnen Sie diese Entwürfe neu, bevor Sie sie zustellen.» Alternative: der entschiedene Text, wenn alle Entwürfe nur Rechnungen betreffen, sonst dieser.
  - «Abrechnung berichtigen» (je Abrechnung, also genau mit den Bausteinen der Abrechnungsseite, `statements_later_one/many` und dem Tankbestand): «Seit dem Erstellen der Abrechnung {Nummer} von {Mieter} {later}. Berichtigen Sie die Abrechnung mit «Abrechnung berichtigen». Die berichtigte Abrechnung rechnet an, was schon bezahlt ist.»
  - Titel «Tankbestand seit der Abrechnung geändert» und «Rechnungen und Tankbestand seit der Abrechnung geändert»: bestätigt.
- **E-5 (M-1), Abrechnungen älter als fünf Jahre:**
  - A (empfohlen): Aufgabe auch dann. Der Satz zur Verjährung steht schon auf der Abrechnung (`statements_later_sent`); die Aufgabe kann für Perioden, die vor über fünf Jahren endeten, anfügen: «Diese Abrechnungsperiode endete vor mehr als fünf Jahren. Lassen Sie sich beraten, ob die Forderung verjährt ist.»
  - B: keine Aufgabe, wenn das Abrechnungsdatum mehr als fünf Jahre zurückliegt, auf der Abrechnung bleibt der Hinweis. Das kann eine noch nicht verjährte Rückforderung des Mieters verbergen.
- **E-6 (M-2), Aufgabe ohne Berichtigen beenden:** A: der Vermieter kann sie mit «Nicht berichtigen» schliessen, und das Protokoll hält es fest. B: Sie bleibt, bis er berichtigt. Empfehlung A, wenn E-3 nicht Option A wird.

## Fehlende Begriffe

- **Nicht aktuelle Abrechnung** (für `UBIQUITOUS_LANGUAGE.md`, Issue mit `fachlich`, `entscheiden`): «Abrechnung, für deren Abrechnungsperiode seit dem Erstellen Rechnungen der vereinbarten Kategorien erfasst, geändert oder gelöscht wurden oder deren Tankbestand (Anfangs- oder Endbestand) sich geändert hat. Einen Entwurf berechnet der Liegenschaftsverwalter neu, eine versendete oder bezahlte Abrechnung berichtigt er. In der Oberfläche «nicht aktuell».» Code: Berechnung (`changedInvoices`). Heute nur als UI-Text (`invoices_missed_title` «Abrechnungen nicht aktuell», neu «Entwürfe sind nicht aktuell»).

## Bestätigt

- Filtertext, Linkbeschriftungen («Rechnungen 2025 ansehen» nur beim Kalenderjahr, sonst Daten, auch für eine ganze Periode Juli – Juni) und der Link mit Gebäude und Daten über den Jahreswechsel und für Perioden älter als fünf Jahre: wie entschieden (Punkt 1), passend zu `periodName` und `periodDays` (`accounting-period.ts:146–153`).
- Auswahl nach Regel 1: Rechnungen ohne Leistungszeitraum nach Rechnungsdatum, mit Leistungszeitraum, wenn er die Periode berührt (`invoice.service.ts:552–563`, `nebenkostenabrechnung-anforderungen.md`, Regel 1). Szenario nachgeprüft für die Periode 01.10. – 31.12.2025: Heizung 20.01.2026 mit Leistungszeitraum Q4 2025 gehört dazu; Hauswart 15.11.2025 gehört dazu; Hauswart 30.09.2025 (Tag vor Beginn) nicht; Hauswart 20.12.2025 mit Leistungszeitraum 01.01. – 31.03.2026 nicht. Genau 2, wenn die Grundlage-Rechnung «Treppenhausreinigung Q1» nicht in Q4 2025 datiert ist (nicht geprüft, Testfrage). Lieferungen in den Tank wählt dieselbe Funktion, die Rechnung verteilt sie nach Verbrauch (#257); der Filter stimmt also auch für sie.
- Szenario «Rechnungen der fehlenden Periode anzeigen»: Anna mietet ab 01.04.2024, der Link filtert 01.01. – 31.12.2024. Richtig, denn die Abrechnung 2024 nimmt die Rechnungen der ganzen Periode und teilt sie nach Mietstagen (Regel 1, Regel 5).
- Szenario «Rechnungen der fehlenden Tage anzeigen»: Link und Filter 01.10. – 31.12.2024 = die angebotene kurze Abrechnungsperiode (Punkt 2.2).
- Tankbestand als Grund für «nicht aktuell»: Art. 5 Abs. 2 lit. a VMWG (Wortlaut oben), Glossar «Veränderung Tankbestand» und «Verbrauch (Heizmaterial)». Szenarien nachgerechnet: 600 − 100 = 500.00; danach Endbestand 200: 600 − 200 = 400.00, also anders, also ein Hinweis. Ohne Änderung kein Hinweis. Randfall mit negativer Veränderung (Endbestand 700): 600 − 700 = −100.00, auch anders. Nur bei vereinbarter Heizkategorie: wie `agreedStock` (`statement.service.ts:385–388`, #91). Mieterwechsel: der Betrag in `fuel-stock-<Periodenende>` gilt für das Gebäude (`fuel-stock.service.ts:100`) und ist für beide Mietverträge gleich, also richtig verglichen.
- Texte der Abrechnungsseite (Entwurf «… dieses Entwurfs …», versendet «… dieser Abrechnung …»), «Neu berechnen» rechnet mit dem Tankbestand von heute (`calculatedRows` → `agreedStock`, `statement.service.ts:390 ff.`): wie entschieden (Punkt 8). Die Variante mit «Neu berechnen» ist richtig, denn #338 ist umgesetzt (`statements_recalculate`).
- Übersicht: Titel «1 Entwurf ist nicht aktuell» / «{count} Entwürfe sind nicht aktuell», der entschiedene Text, die Aufgabe vor «Abrechnungen prüfen und versenden», die Entwurfsaufgabe zählt nur aktuelle Entwürfe und fehlt ohne sie, je Gebäude und Periode ein Link auf die Liste der Abrechnungen (die Liste filtert nach Gebäude, Periode und Status, `src/routes/statements/+page.server.ts:40–60`): wie entschieden (Punkt 7). Grund: Art. 257b Abs. 1 OR.
- «Abrechnung berichtigen» je versendete oder bezahlte, nicht ersetzte Abrechnung, Knopf «Abrechnung öffnen»: wie entschieden (Punkt 7). «Ersetzte» fallen weg (Glossar «Ersetzt»: «zählt nicht als Abrechnung der Periode»).
- Begriffe in den Szenarien (Abrechnungsperiode, Entwurf, Tankbestand, Leistungszeitraum, Rechnungsdatum, berichtigte Abrechnung, Umlagefähige Rechnung): im Glossar. «nicht aktuell» fehlt (siehe oben).

## Nicht bestätigt

- Ob eine Nachforderung aus der Nebenkostenabrechnung unter Art. 128 Ziff. 1 OR fällt, ab wann die Frist läuft (Abrechnungsdatum oder Periodenende) und ob eine Rückforderung des Mieters vertraglich (fünf Jahre) oder bereicherungsrechtlich (Art. 67 OR) verjährt: nur der Wortlaut von Art. 67, 128, 130 OR auf Fedlex. BGE 126 III 119 und BGer 4A_209/2019 nicht gelesen (Unsicherheit 6 der Anforderungen). **unsicher**
- Dass ein Vermieter auf eine Nachforderung aus einer zu tiefen Abrechnung verzichten kann (M-2): Grundsatz der Privatautonomie, keine Fedlex-Stelle gesucht. **unsicher**
- Ob es im Betrieb Abrechnungen von vor Migration 0014 gibt (V-3): nur Migration und `demo-data.sql` gelesen (keine Abrechnungen in den Demo-Daten). Die Datenbank habe ich nicht abgefragt.
- Ob jede Position die Rechnungen mit einem Anteil von 0 % für diesen Mietvertrag behält (wichtig für V-4, Option B, und dafür, dass ein neu berechneter Entwurf danach als aktuell gilt): `calculation.service.ts:395–410` nur überflogen.
- Ob die Grundlage-Rechnung des Szenarios in `invoices.feature` ausserhalb von Q4 2025 datiert ist: Fixture nicht nachverfolgt (Testfrage, nicht fachlich).
- Wie der Plan V-2 und V-10 umsetzt: Im Auftrag stehen nur die Linkbeschriftungen. Code für Punkt 1 gibt es im Commit noch nicht.
- fr/it/en der neuen Texte: nicht Gegenstand dieser Runde, keine Native-Lesung.
