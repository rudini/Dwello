# Fach-Review 2 zu #454: Szenarien und Texte nach den PO-Entscheiden E-1 bis E-6 (2026-10-20)

Gegenstand: `git diff 59c9c2ff 6c3e95f3 -- tests/e2e/features` (nur die #454-Teile; die Szenarien zu #403, #448 und #450 aus dem Merge von `main` sind nicht Gegenstand) und `git diff b77a98aa 6c3e95f3 -- src/__tests__ backend/src/__tests__`, im Worktree `review-454-fach2` (Commit 6c3e95f3). Dazu die Texte und Umsetzungsregeln aus dem Auftrag. Grundlage: #454 («Decided (product owner)», E-1 bis E-6), `docs/reviews/454-fachreview-1.md`, `UBIQUITOUS_LANGUAGE.md`, Code im Worktree. Produktionscode gibt es noch nicht.

Fedlex (Filestore, OR «Stand am 1. Oktober 2026», heute abgerufen):
- Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- Art. 62 Abs. 1 OR: «Wer in ungerechtfertigter Weise aus dem Vermögen eines andern bereichert worden ist, hat die Bereicherung zurückzuerstatten.»
- Art. 63 Abs. 1 OR: «Wer eine Nichtschuld freiwillig bezahlt, kann das Geleistete nur dann zurückfordern, wenn er nachzuweisen vermag, dass er sich über die Schuldpflicht im Irrtum befunden hat.»
- Art. 128 Ziff. 1, Art. 130 Abs. 1, Art. 67 Abs. 1 OR, Art. 8 Abs. 2 VMWG: wörtlich in Runde 1, unverändert.

## Status der Befunde aus Runde 1

| ID | Status |
|---|---|
| V-1 | Erledigt: E-1 entschieden. Szenario «Rechnungen einer Abrechnungsperiode anzeigen» mit «Reparaturen» unter «Nicht umlagefähige Kosten»; `invoice-period-filter.pg.test.ts` mit einer ausgeschlossenen Rechnung (`not allocable`, `isValidUtilityCost: false`). |
| V-2 | Erledigt: Szenario «Rechnungen der Abrechnungsperiode eines anderen Mietvertrags anzeigen» (Link und Filter 01.07.2023 – 30.06.2024, wie der Hinweis zum Abrechnen, `contract-detail.feature:280–289`). |
| V-3 | Erledigt in den Tests: `statement-invoices.pg.test.ts:184` («ohne gespeicherte Rechnungen keinen unveränderten Tankbestand»). |
| V-4 | Erledigt: E-3 entschieden; Szenario «Keine Aufgabe «Abrechnung berichtigen», wenn die Änderung den Mieter nicht trifft», `statement-invoices.pg.test.ts:349`. Folgefragen: V-17, V-18. |
| V-5 | Offen, siehe V-16: E-2 entschieden, das E2E-Szenario folgt ihm, ein Backend-Test hält das Gegenteil fest. Kommentar und Schritt des Szenarios «Kein Hinweis, …» sind neu benannt: erledigt. |
| V-6, V-7 | Erledigt: E-4, Texte in `overview.test.ts:262`, `:309` und `dashboard.feature` wörtlich. |
| V-8 | Erledigt: Wortlaut bestätigt (siehe «Bestätigt»). |
| V-9 | Erledigt für `statements_recalculate_text` und `statements_recalculated`; dieselbe Lücke steckt noch in zwei weiteren Texten (V-20). |
| V-10 | Teilweise: der Link setzt das Gebäude (`overview.test.ts:198`), die Beschriftung nennt es nicht (V-22). |
| V-11 | Erledigt: «davon CHF 310.00 in der Abrechnungsperiode», nachgerechnet (siehe «Bestätigt»). |
| V-12 | Erledigt: `overview.test.ts:341` («nennt das Berichtigen vor den überfälligen Abrechnungen»). |
| V-13 | Erledigt (mit V-1 und V-11). |
| V-14 | Erledigt: «Seeblick, 2025», «Ahornhof, 01.07.2024 – 30.06.2025» (`overview.test.ts:264–271`). |
| V-15 | Erledigt: Tests für einen gelöschten, nachträglich erfassten und nicht vereinbarten Tankbestand (`statement-invoices.pg.test.ts:194–219`). Ein geänderter Anfangsbestand ist nur im Test mit gleichem Verbrauch, der falsch erwartet (V-16). Die negative Veränderung fehlt, das ist ein Nit und braucht keine eigene Zeile. |
| M-1 | Erledigt: E-5, Satz wörtlich (`overview.test.ts:364`), Szenario 2020. |
| M-2 | Erledigt mit E-6, aber der Entscheid reicht weiter als M-2 (M-3). |

## Neue Befunde

| ID | Rolle | Schwere | PO-Entscheid | Befund |
|---|---|---|---|---|
| V-16 | Verwalter | Major | nein | `statement-invoices.pg.test.ts:171` «meldet nichts, wenn der Verbrauch gleich bleibt» erwartet `fuelStockChanged: false` für 600/100 → 700/200. Das widerspricht E-2 und dem neuen Szenario «… mit demselben Verbrauch hin». |
| V-17 | Verwalter | Major | ja | Ist eine Änderung für den Mieter ohne Wirkung (E-3) oder schon «Nicht berichtigt» (E-6), sagt der Hinweis auf der Abrechnungsseite weiter «Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen»». Die Seite verlangt dann, was die Übersicht nicht verlangt (der Fall V-4, nur eine Ebene tiefer). |
| V-19 | Verwalter | Major | nein | Liste «Bestehende Abrechnungen» im Abrechnungsassistenten (PR #367): Punkt 8 und «Done means» Punkt 3 verlangen dort den Tankbestand. Kein Szenario, kein Test, und der Text `statements_existing_outdated` nennt nur Rechnungen. |
| M-3 | Mietrecht | Major | ja | «Nicht berichtigen» ist auch möglich, wenn die Neuberechnung den Saldo zugunsten des Mieters senkt. Dann verlangt und mahnt Dwello wissentlich mehr als die tatsächlichen Aufwendungen, und die Bestätigung sagt das nicht. |
| V-18 | Verwalter | Minor | nein | E-3 als Bedingung festhalten: Hinweis vorhanden **und** Ergebnis anders. Eine reine Neuberechnung ändert sich auch durch Daten, die der Hinweis nicht nennt (Akonto, vereinbarte Kategorien, Übertrag). Die Aufgabe hätte dann ein leeres `{later}`. |
| V-20 | Verwalter | Minor | nein | Wie V-9: `statements_later_draft` («dann rechnet er die Rechnungen ab, wie sie jetzt sind») und `statements_recalculate_hint` («Geänderte Rechnungen übernimmt «Neu berechnen»») folgen auch auf eine reine Änderung des Tankbestands. |
| V-21 | Verwalter | Minor | nein | E-6, Wiederkehr der Aufgabe: Gibt eine spätere Änderung wieder das ursprüngliche Ergebnis (die Abrechnung stimmt wieder), wäre das Ergebnis «anders als gespeichert», und die Aufgabe käme zurück. Regel: fällig nur, wenn die Neuberechnung von der Abrechnung **und** vom gespeicherten Ergebnis abweicht. Dazu einen Test. |
| V-22 | Verwalter | Minor | nein | Übersicht, fehlende Abrechnungen: der Link führt zu den Rechnungen eines Gebäudes, heisst aber «Rechnungen 2025 ansehen», obwohl der Text mehrere Gebäude nennt (`overview.test.ts:195–201`). Fix: «Rechnungen von Ahornhof für 2025 ansehen», sobald der Text mehr als ein Gebäude nennt. |
| V-23 | Verwalter | Minor | nein | «Abrechnung berichtigen» und «Nicht berichtigen» auch bei «Erledigt» (`settled`, #448). Das Glossar «Berichtigte Abrechnung» nennt «versendete, bezahlte oder erledigte» Abrechnungen; die Tests haben nur `sent` und `paid`. |
| V-24 | Verwalter | Minor | nein | Wortlaut der Bestätigung «Nicht berichtigen»: «Ändert eine spätere Änderung …» doppelt sich, und es fehlt, dass der Vermieter später doch berichtigen kann. Vorschlag unten. |
| V-25 | Verwalter | Nit | nein | Ablehnung «… ist kein Berichtigen offen» ist ein ungewohntes Nomen. Vorschlag: «Diese Abrechnung muss nicht mehr berichtigt werden. Laden Sie die Seite neu.» |
| V-26 | Verwalter | Nit | nein | #454 «Done means» Punkt 1 («exactly the invoices a statement … takes») und Punkt 1 des Entscheids («exactly the missing days») widersprechen E-1 und V-2; ebenso der Kopfkommentar von `invoice-period-filter.pg.test.ts:1–4`. Im Issue einen Kommentar ergänzen, den Kommentar im Test anpassen. |
| V-27 | Verwalter | Nit | nein | E-5: «heute minus fünf Jahre» als Schweizer Datum (`swissToday`) und als Kalenderrechnung festlegen; am 29.02.2028 gilt 28.02.2023, nicht 01.03.2023 (`setFullYear` gibt den 01.03.). |
| V-28 | Verwalter | Nit | nein | V-9-Texte nennen den Tankbestand auch bei Gebäuden ohne Tank (Szenario «Entwurf neu berechnen», Lindenhof ohne Tankbestand). Vertretbar. Wer es schärfer will: «… mit den Rechnungen und, wenn es einen gibt, dem Tankbestand …». |
| V-29 | Verwalter | Nit | nein | `dashboard.feature`, «Abrechnung nicht berichtigen»: «nennt der Verlauf «Nicht berichtigt» am Tag des Versands» stimmt nur, weil die Abrechnung heute versendet wurde. Gemeint ist heute; Schritt «… am heutigen Tag» nennen. |

## Begründung der Major-Befunde

### V-16: Backend-Test erwartet das Gegenteil von E-2

- **Beleg:** `backend/src/__tests__/statement-invoices.pg.test.ts:171–180`: Ablesungen 600.00 / 100.00, Abrechnung, dann 700.00 / 200.00, `expect(await fuelStockChanged(id)).toBe(false)`. Dagegen erwartet `statement-detail.feature`, «Entwurf weist auf einen danach geänderten Tankbestand mit demselben Verbrauch hin», genau für diese Werte den Hinweis. E-2: «counts as changed when the dates or values of the opening or closing stock differ».
- **Nachgerechnet:** vorher 600 − 100 = 500.00, nachher 700 − 200 = 500.00. Die Veränderung ist gleich, die Werte nicht. Das PDF druckt Anfangs- und Endbestand (`statement-pdf.service.ts:170–190`, Runde 1), Art. 8 Abs. 2 VMWG.
- **Warum falsch:** Wer den roten Test grün macht, baut die Regel vor E-2 (Betrag) und das E2E-Szenario bleibt rot. Oder umgekehrt, je nachdem, was zuerst grün wird. Der Test stammt aus 1ceee973 (Runde 1) und wurde nach E-2 nicht angepasst.
- **Fix:** Erwartung auf `true` drehen, Name «meldet andere Werte auch bei gleichem Verbrauch». Dazu einen Fall «nur der Anfangsbestand geändert» (er ist auch der Endbestand der Vorperiode und trifft beide Abrechnungen), und einen mit negativer Veränderung (Endbestand 700: 600 − 700 = −100.00).

### V-17: Hinweis der Abrechnungsseite verlangt das Berichtigen, wo die Übersicht es nicht tut

- **Beleg:** Plan: «Der Hinweis auf der Abrechnungsseite bleibt wie heute (jede Änderung), die Regel gilt nur für die Aufgabe und den Knopf «Nicht berichtigen».» `messages/de.json:1220` (`statements_later_sent`): «… Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung. Die berichtigte Abrechnung rechnet an, was schon bezahlt ist. …». `statement-pages.dom.test.ts:641` («bietet «Nicht berichtigen» nicht an, wenn das Berichtigen nichts ändert»).
- **Warum falsch:** Im Fall des Szenarios «Keine Aufgabe … wenn die Änderung den Mieter nicht trifft» (Bruno, Rechnung nach dem Auszug, Anteil 0.00) zeigt die Übersicht nichts. Die Abrechnung sagt aber, er solle berichtigen, und bietet weder «Nicht berichtigen» noch eine Erklärung an. Der Hinweis bleibt für immer stehen. Folgt der Vermieter ihm, erhält Bruno eine berichtigte Abrechnung mit neuer Nummer und gleichem Saldo, also genau das, was V-4 und E-3 verhindern sollten. Nach «Nicht berichtigt» gilt dasselbe: der Hinweis fordert weiter zum Berichtigen auf, obwohl der Verlauf den Entscheid festhält. Die Zielgruppe folgt dem Text auf der Seite. Vor #454 war der Hinweis derselbe, aber ohne eine Übersicht, die das Gegenteil sagt; die Änderung macht ihn widersprüchlich.
- **Fix (PO, denn der Satz nach `{later}` ist in Punkt 8 entschieden: «followed by the sentence to … correct as for invoices»):**
  - A (empfohlen): Der erste Satz bleibt (er nennt die Tatsache), der Satz zum Berichtigen hängt vom Zustand ab. Nicht fällig: «Für {Mieter} ändert das weder den Saldo noch eine Position. Sie müssen die Abrechnung nicht berichtigen.» Nach «Nicht berichtigt»: «Am {Datum} haben Sie entschieden, die Abrechnung nicht zu berichtigen.» Sonst bleibt `statements_later_sent`.
  - B: Hinweis nur zeigen, wenn das Berichtigen fällig ist (wie die Aufgabe). Dann sieht der Vermieter die Tatsache nicht mehr, die er dem Mieter auf Nachfrage erklären muss (Art. 8 Abs. 2 VMWG bei geändertem Tankbestand).
  - C: wie geplant.

### V-19: Tankbestand in der Liste der bestehenden Abrechnungen des Assistenten

- **Beleg:** #454, Punkt 8: «counts like a changed invoice everywhere (statement detail, outdated-drafts list of PR #367, point 7)»; «Done means»: «… makes a statement «not current» on its detail page, in the outdated-drafts list and in the Übersicht, with the texts above». Code: `src/lib/server/statement-generation.ts:335`, `outdated = status === 'draft' && (await changedInvoiceCount(fetch, id)) > 0`; Text `statements_existing_outdated` (`messages/de.json:1384`): «Seit dem Erstellen dieses Entwurfs wurden Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht.» `statement-generate.feature:607`, `:618` und `statement-wizard.dom.test.ts:607`, `:1071` haben nur Rechnungen; im Diff steht dazu nichts.
- **Warum falsch:** Ist nur der Tankbestand geändert, nennt der Assistent den Entwurf nicht als nicht aktuell, oder (wenn nur die Bedingung erweitert wird) mit einem Text, der eine Rechnungsänderung behauptet. Der Vermieter erstellt die Abrechnungen des Gebäudes dann mit einem Entwurf, der den alten Verbrauch abrechnet.
- **Fix:** Szenario in `statement-generate.feature` («Bestehender Entwurf mit danach geändertem Tankbestand»), Test in `statement-wizard.dom.test.ts`, Text in derselben Logik wie die Abrechnungsseite: «Seit dem Erstellen dieses Entwurfs wurde der Tankbestand der Abrechnungsperiode geändert.» bzw. «… wurden Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht, und der Tankbestand wurde geändert.» Braucht keinen PO-Entscheid: die Texte sind die entschiedenen von Punkt 8 und V-8.

### M-3: «Nicht berichtigen» bei einer Änderung zugunsten des Mieters

- **Beleg:** E-6: «the landlord can close the task with «Nicht berichtigen» without correcting the statement». M-2 (Runde 1), aus dem E-6 hervorging, begründete das nur mit dem Verzicht auf eine Nachforderung. Der Bestätigungstext im Auftrag nennt nicht, in welche Richtung sich der Saldo ändert. `statement-invoices.pg.test.ts:358` prüft nur eine zusätzliche Rechnung (Anteil steigt).
- **Nachgerechnet** (4 Wohnungen, Pro Einheit, ganzes Jahr; Akonto 1200.00, Kosten 1387.45, Saldo Nachzahlung 187.45; danach wird die doppelt erfasste Rechnung Hauswart CHF 732 gelöscht):
  - Anteil 732 / 4 = 183.00. Neu 1387.45 − 183.00 = 1204.45, Saldo 4.45. Mit «Nicht berichtigen» verlangt und mahnt Dwello weiter 187.45, also 183.00 mehr als die Kosten.
  - Guthaben: Saldo −50.00, dieselbe Löschung gibt −233.00. Der Mieter erhält 50.00 statt 233.00.
  - Umgekehrt (eine Rechnung 732 kommt dazu): +183.00, neu 370.45. «Nicht berichtigen» heisst hier: der Vermieter verzichtet auf 183.00. Das ist der Fall von M-2 und zulässig.
- **Warum falsch:** Nebenkosten sind «die tatsächlichen Aufwendungen des Vermieters» (Art. 257b Abs. 1 OR). Was der Mieter darüber hinaus bezahlt, hat der Vermieter «in ungerechtfertigter Weise» erhalten (Art. 62 Abs. 1 OR). Wer im Irrtum über die Schuld bezahlt hat, kann es zurückfordern (Art. 63 Abs. 1 OR). Der Mieter kennt die gelöschte Rechnung nicht, also ist der Irrtum naheliegend (**unsicher**, siehe «Nicht bestätigt»). Dwello würde den Vermieter wissentlich einen zu hohen Saldo einfordern und mahnen lassen, ohne Warnung, und das gerade bei der Zielgruppe, die einer Bestätigung folgt.
- **Fix (PO, weil B den Entscheid E-6 einschränkt):**
  - A: «Nicht berichtigen» bleibt immer möglich. Senkt die Neuberechnung den Saldo, nennt die Bestätigung es: «Die Neuberechnung ergibt für {Mieter} CHF {Betrag} weniger. Bleibt die Abrechnung, wie sie ist, verlangen Sie mehr als die tatsächlichen Kosten, und {Mieter} kann zu viel Bezahltes zurückfordern.» Das braucht keinen PO-Entscheid (der Text ist nicht entschieden).
  - B (empfohlen): «Nicht berichtigen» nur, wenn der neue Saldo für den Mieter höher ist (Nachforderung, auf die der Vermieter verzichtet). Senkt er sich, bleibt die Aufgabe, bis berichtigt ist. Das trifft den Grund von M-2 und lässt keinen Saldo stehen, der zu hoch ist.
  - Maßgeblich ist der Saldo, nicht die einzelne Position (Positionen können sich gegenläufig ändern).

## Vorschläge zum Wortlaut

- **V-24, Bestätigung «Nicht berichtigen»:** Titel «Abrechnung nicht berichtigen?» bestätigt. Text: «Die Abrechnung {number} bleibt, wie sie ist. Die Aufgabe «Abrechnung berichtigen» verschwindet von der Übersicht, und der Verlauf der Abrechnung hält fest, dass Sie nicht berichtigt haben. Sie können die Abrechnung später trotzdem berichtigen. Ändert eine weitere Rechnung oder der Tankbestand den Saldo oder eine Position noch einmal, erscheint die Aufgabe wieder.» Mit M-3 A zusätzlich der Satz zum tieferen Saldo. Knöpfe «Nicht berichtigen», «Abbrechen»: bestätigt.
- **Verlauf «Nicht berichtigt» mit Datum:** bestätigt. Die anderen Einträge sind ebenfalls Partizipien («Versendet», «Bezahlt»); «verzichtet» wäre falsch, denn rechtlich verzichtet der Vermieter mit dem Knopf auf nichts.

## Fehlende Begriffe

- **Nicht berichtigt** (für `UBIQUITOUS_LANGUAGE.md`, Issue mit `fachlich`, `entscheiden`): «Entscheid des Liegenschaftsverwalters, eine versendete, bezahlte oder erledigte Abrechnung nicht zu berichtigen, obwohl eine Neuberechnung den Saldo oder eine Abrechnungsposition des Mietvertrags ändern würde. Der Verlauf der Abrechnung hält ihn mit Datum fest; die Aufgabe «Abrechnung berichtigen» erscheint erst wieder, wenn eine weitere Änderung ein anderes Ergebnis gibt. Er ändert die Abrechnung nicht und ist kein Verzicht auf eine Forderung.» Code: geplant `correctionDeclined` (`statement-pages.dom.test.ts:648`).
- «Nicht aktuell»: in #529, nicht Teil dieser Aufgabe. Wenn E-3 so bleibt, braucht #529 den Zusatz, dass eine versendete Abrechnung nur dann zu berichtigen ist, wenn sich der Saldo oder ein Anteil ändert.
- Sonst keine neuen Begriffe: «Abrechnungsperiode», «Tankbestand», «Abrechnungsposition», «Saldo», «Verlauf» (im Glossar bei «Zahlung zurücksetzen» verwendet), «Umlagefähige/Nicht umlagefähige Kosten» (bestehende UI-Gruppen, `messages/de.json:922–923`).

## Bestätigt

- **E-1:** Gruppen nur mit dem Filter «Abrechnungsperiode», ohne ihn ungruppiert; ausgeschlossene Rechnungen unter «Nicht umlagefähige Kosten». Das trifft E-1 («allocable and not, grouped by allocability»). Die Gruppe «Umlagefähige Kosten» ist dann genau die Auswahl von `getInvoicesForStatement` (`invoice.service.ts:552–563`, `eq(isValidUtilityCost, true)`). «Reparaturen» ist vordefiniert nicht umlagefähig (`0002_stammdaten.sql:30`, Glossar «Nicht umlagefähig»). Szenario nachgeprüft für 01.10. – 31.12.2025: Heizung 20.01.2026 mit Leistungszeitraum Q4: ja; Hauswart 15.11.2025: ja; Hauswart 30.09.2025: nein; Hauswart 20.12.2025 für 2026: nein; Reparaturen 20.11.2025: ja, nicht umlagefähig. Genau 3, wie erwartet.
- **V-11:** 01.12.2025 – 28.02.2026 = 31 + 31 + 28 = 90 Tage, davon in der Periode 31: 900 × 31 / 90 = 310.00. Zweites Beispiel aus den Tests: 1200 × 31 / 90 = 413.333…, auf Rappen 413.33 (`roundToRappen`, `pdf-format.ts:17`). Randfall: ein Leistungszeitraum ganz in der Periode zeigt kein «davon» (`invoice.service.ts:544`, `beyond`). Der Betrag ist derselbe, den die Abrechnung als Gesamtbetrag nimmt (`calculation.service.ts:123`, `group.totalAmount += invoice.inPeriod.amount`), auch bei Heizkosten mit Heizprofil (das Heizprofil verteilt erst den Anteil des Mieters).
- **E-2:** Vergleich von `utility_statements.fuel_stock` mit `agreedStock` (Kategorie, Stichtage, Werte, auch null gegen Wert): trifft E-2. Szenario nachgerechnet: 600 − 100 = 500.00, danach Endbestand 200: 400.00; mit demselben Verbrauch 700 − 200 = 500.00, aber andere Werte, also ein Hinweis. Vor Migration 0014 und mit nicht vereinbarter Heizkategorie: `statement-invoices.pg.test.ts:184`, `:203`. Der letzte Test setzt die gespeicherten `agreedCategoryIds` der Abrechnung; der Vergleich nimmt also die beim Erstellen vereinbarten Kategorien, wie `changedInvoices` (`statement-invoices.service.ts:29–30`). Ändert der Vermieter später die vereinbarten Kategorien, meldet der Hinweis deshalb keinen geänderten Tankbestand. Das ist richtig.
- **E-3:** «würde ändern» als anderer Saldo oder anderer Anteil des Mieters an einer Position (Kategorie und Verteilschlüssel), mit Heizprofil und Verwaltungspauschale der Abrechnung (`statements_recalculate_text`: «Nummer, Heizprofil, Verwaltungspauschale … bleiben»). Der Gesamtbetrag zählt nicht: sonst gäbe gerade der Fall, der E-3 ausgelöst hat (V-4, Rechnung nach dem Auszug, Anteil 0.00), weiter eine Aufgabe. Nachgerechnet wie in Runde 1: A 75 × 0/92 = 0.00 (keine Aufgabe), ohne Leistungszeitraum A 75 × 90/365 = 18.49 (Aufgabe). Lieferungen in den Tank zählen über die ganze Periode (Glossar «Anteil nach Heizprofil»); die Neuberechnung erfasst das von selbst. Die Aufgabe zu nicht aktuellen Entwürfen zählt jede Änderung: richtig, ein Entwurf wird ohne Kosten neu berechnet. Bedingung siehe V-18.
- **E-4:** alle Texte wörtlich wie entschieden (`overview.test.ts:262`, `:309`, `dashboard.feature`).
- **E-5:** «vor mehr als fünf Jahren» = Periodenende vor heute minus fünf Jahre; 09.10.2021 am 10.10.2026: ja, 10.10.2021: nein (genau fünf Jahre sind nicht «mehr als»). Szenario: Periodenende 31.12.2020, heute 20.10.2026, Grenze 20.10.2021: ja. Anna mietet seit 01.01.2020 (`dashboard.feature:13`), trägt also einen Anteil an der Rechnung vom 15.06.2020, damit ist das Berichtigen nach E-3 fällig. Der Satz behauptet keine Verjährung (deren Beginn nach Art. 130 Abs. 1 OR die Fälligkeit ist), er rät zur Beratung: richtig.
- **E-6:** Datum und Ergebnis speichern, Hinweis bleibt, Knopf verschwindet, kein Eintrag im Protokoll unter «Einstellungen» (das Glossar «Protokoll» nennt Änderungen, die Abrechnungen beeinflussen; «Nicht berichtigen» ändert nichts), Verlauf mit «Nicht berichtigt»: trifft E-6 («the statement's history records it»). Ablehnung mit Code `STATEMENT_CORRECTION_NOT_DUE` (`statement-invoices.pg.test.ts:369`): richtig. Einschränkungen: V-17, V-21, M-3.
- **V-8:** «Seit dem Erstellen dieses Entwurfs wurden 2 Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht, und der Tankbestand wurde geändert.» und die Einzahl «wurde 1 Rechnung … , und der Tankbestand wurde geändert»: grammatisch richtig, jeder Teilsatz mit eigenem Hilfsverb. In der Aufgabe: «Seit dem Erstellen der Abrechnung NK-… von Anna Keller wurde 1 Rechnung …, und der Tankbestand wurde geändert. Berichtigen Sie …»: liest sich richtig. Szenario: Hauswart 15.06.2024 liegt in 2024, also 1 Rechnung.
- **V-9:** «Dwello berechnet den Entwurf {number} mit den Rechnungen und dem Tankbestand, wie sie jetzt sind. …» und «Der Entwurf ist neu berechnet. Er rechnet mit den Rechnungen und dem Tankbestand, wie sie jetzt sind.»: bestätigt (`calculatedRows` → `agreedStock`, `statement.service.ts:456–474`). Dazu V-20, V-28.
- **V-12:** «Abrechnung berichtigen» vor «Überfällige Abrechnungen prüfen»: erfüllt V-12 («oder nach ihr stehen»).
- **V-14:** Links «{Gebäude}, {periodName}»: bestätigt.
- **«Kein Hinweis, wenn der Tankbestand der Periode unverändert ist»** ohne @wip: hält das heutige Verhalten fest (heute gibt es keinen Hinweis zum Tankbestand) und bleibt nach der Umsetzung wahr, sofern unveränderte Werte nicht als geändert gelten. Neuer Schritt «weist … auf keine Änderung seit dem Erstellen hin» (`statement-detail.steps.ts:353`): passt.
- **«Entwurf neu berechnen»**: erwartet den V-9-Text, bestätigt.

## Nicht bestätigt

- Ob ein Mieter, der einen zu hohen Saldo bezahlt hat, nach Art. 62/63 OR (Irrtum nachzuweisen) oder vertraglich aus dem Mietvertrag zurückfordert, und ob der Vermieter einen ihm bekannten zu hohen Saldo weiter einfordern darf (M-3): nur der Wortlaut von Art. 62, 63 und 257b OR auf Fedlex; keine Rechtsprechung gelesen. **unsicher**. Die Empfehlung zu M-3 hängt nicht davon ab, denn Art. 257b Abs. 1 OR begrenzt die Nebenkosten so oder so auf die tatsächlichen Aufwendungen.
- Ob die Neuberechnung bei einer berichtigten oder einer Abrechnung mit Übertrag (#448) dieselben `priorPayments` und denselben Übertrag nimmt wie beim Erstellen, so dass E-3 keine Scheinänderung meldet: `calculatedRows` nur bis `carriedFromId` gelesen (`statement.service.ts:478–480`), die Berechnung des Übertrags nicht.
- Ob `periodReadings` (Anfangsbestand am Tag vor Beginn, Endbestand am letzten Tag, Glossar «Stichtag») auch Ablesungen an anderen Tagen nimmt, so dass E-2 «Stichtage» praktisch vorkommt: `fuel-stock.service.ts` nur ab Zeile 60 gelesen.
- E-5 im Unit-Test (`overview.test.ts:364`): ob der Test heute auf 10.10.2026 fixiert ist (sonst wäre 10.10.2021 am 20.10.2026 auch «vor mehr als fünf Jahren»): `input()` nicht nachverfolgt (Testfrage, nicht fachlich).
- fr/it/en der neuen Texte: nicht Gegenstand, keine Lesung.
