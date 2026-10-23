# Dr. Weber – Hinweise zu Heizkosten in der Vorschau einer berichtigten Abrechnung (#647)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Nur angesehen, nichts gespeichert, keine Abrechnung erstellt.
Persona-App http://localhost:3300 (Version 0.88.1+53-geeaa1c10d), Datenbank `dwello_persona` mit Demodaten.

Vom Aufrufer per SQL vorbereitet:

- `UPDATE invoices SET service_period_start = NULL, service_period_end = NULL WHERE id = 'c0000002-2025-4000-8000-000000000018';` (Seepark Residenz, «Fernwärme Q1 2025» ohne Leistungszeitraum)
- `UPDATE utility_statements SET status = 'replaced' WHERE contract_id = 'b0000002-0002-0002-0002-000000000002' AND period_start = '2025-01-01' AND period_end = '2025-12-31';` (Abrechnung 2025 von Sarah Meier, Seepark A2, «Ersetzt»)

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/993b3d4b-822a-5c76-922e-2cd5ca0ef8e1/scratchpad/weber-647/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungen erstellen, Schritt 4 Vorschau | Der Hinweis «Heizkosten: Rechnungen ohne Leistungszeitraum» erscheint, sagt aber nicht, warum er gerade hier zählt: dass Sarah Meier nur bis 30.06.2025 gemietet hat und die berichtigte Abrechnung deshalb vom Leistungszeitraum abhängt. Die Vorschau nennt den Lauf nirgends «berichtigte Abrechnung». |
| P-2 | Minor | Schritt 4 Vorschau | Der Hinweis sagt nicht, was Dwello tut, wenn ich nichts eintrage, und wie viel es ausmacht. Nachgerechnet: Ohne Leistungszeitraum trägt Sarah Meier CHF 177.29 weniger (Rückerstattung CHF 35.70 statt Nachzahlung CHF 141.60 auf der ersetzten Abrechnung). Trotzdem ist der Hinweis blau als Information gestaltet, gleich wie der Tank-Hinweis, und nicht als Warnung. |
| P-3 | Minor | Rechnung bearbeiten → zurück in den Assistenten | Der Link in der Rechnung führt zu «Rechnung bearbeiten». «Abbrechen» (`returnTo=/statements/generate?schritt=3`) bringt mich zurück zu Schritt 3, nicht zur Vorschau, wo der Hinweis stand. Die Eingaben (Heizprofil) bleiben erhalten. |
| P-4 | Minor | Schritt 4 Vorschau, Kasten «Es gibt schon Abrechnungen» | Im selben Lauf steht: «schon 4 Nebenkostenabrechnungen», es sind aber nur 3 Entwürfe aufgeführt, und: «Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue». Gleich darunter bekommt Sarah Meier eine neue. Bei einer Berichtigung ist das widersprüchlich. Wahrscheinlich gab es das schon vor der Änderung, aber dieser Lauf macht es sichtbar. |

## Beobachtungen

- In der Rechnungsliste von Seepark 2025 tragen vier Rechnungen die Kategorie «Heizung» (Fernwärme Q1 bis Q4). Q2 hat den Leistungszeitraum 01.04.–30.06.2025 und ist korrekt nicht aufgeführt. Der Hinweis nennt genau die eine Rechnung ohne Leistungszeitraum, mit Lieferant, Beschreibung, Rechnungsdatum und Betrag. Das ist plausibel.
- Der Text des Hinweises ist verständlich und gibt eine klare Handlung vor («Tragen Sie bei jeder den Leistungszeitraum ein …», Ausweichregel für die ganze Abrechnungsperiode). «damit jeder Mieter die Kosten seiner Monate trägt» erklärt den Zweck, aber nur allgemein.
- Auf «Rechnung bearbeiten» stehen über dem Formular zwei gelbe Kästen («Abrechnungen nicht aktuell», «Rechnung schon abgerechnet» mit NK-…-0002, Ersetzt). Ihr Text spricht von «Neu berechnen» und «Abrechnung berichtigen», aber nicht davon, dass die noch zu erstellende berichtigte Abrechnung die Änderung von selbst übernimmt. Darüber bin ich eine Weile gestolpert: Muss ich nach dem Eintragen noch etwas tun?
- Die Fernwärme-Rechnungen haben den Verteilschlüssel «Pro Fläche (m²)», obwohl es «Heizung (Fläche 70 % / Einheit 30 %)» gibt. Das betrifft die Demodaten, nicht die Änderung.
- Der Tank-Hinweis («Heizen Sie mit Öl …») erscheint auch bei einem Gebäude, dessen Heizrechnungen alle «Fernwärme» heissen. Er ist erklärt und lässt sich abstellen («Kein Tank festhalten»).
- Die Übersicht und Schritt 2 (Gebäude) sagen nirgends, dass für Seepark eine berichtigte Abrechnung offen ist. Seepark erscheint nur unter «Noch nicht abgerechnet: … Seepark Residenz (2025 …)».
- Die ersetzte Abrechnung NK-22222222-2025-0002 hat eine eigene Schaltfläche «Berichtigte Abrechnung erstellen». Ich habe den Weg über den Assistenten gewählt, weil die Aufgabe das verlangt.
- In der Vorschau steht «15 Rechnungen vom 31.01.2025 bis 31.12.2025». Die Rechnung «Fernwärme Q4 2025» ist aber auf den 20.01.2026 datiert. Gemeint ist vermutlich der Leistungszeitraum. Das ist nicht falsch, aber ich musste kurz nachdenken.
- Der Barrierebaum zeigt im Feld «Kategorie» auf «Rechnung bearbeiten» nur «Kategorie auswählen». Auf dem Bildschirm steht korrekt «Heizung». Ich werte das nicht als Befund, weil ich mit der Maus arbeite.

## Aufgabe geschafft: ja

Vorschau erreicht, Hinweis gefunden, verstanden und den Link bis zur Rechnung verfolgt. Nichts gespeichert, nichts erstellt.

## Aufwand

Etwa 25 Minuten, davon 10 Minuten Nachrechnen. Rund 12 Schritte: Übersicht, Abrechnungsliste Seepark 2025, Assistent Schritte 1–4 (einmal mit «Heizung + Warmwasser», einmal mit «Heizung Mittelland»), Link zur Rechnung, Abbrechen, Rechnungsdetail, Rechnungsliste, ersetzte Abrechnung.

## Ablauf

1. **Abrechnungsliste Seepark 2025.** Erwartet: Sarah Meier mit «Ersetzt». Gesehen: NK-22222222-2025-0002, 01.01.–30.06.2025, 181 Mietstage, Nachzahlung CHF 141.60, «Ersetzt». Dazu drei Entwürfe (Bernasconi, Brunner, Weber).
2. **Assistent, Schritt 1.** Erwartet: Periode 2025 vorgeschlagen. Gesehen: 01.01.2025 – 31.12.2025. Weiter.
3. **Schritt 2 Gebäude.** Erwartet: ein Hinweis auf die offene Berichtigung bei Seepark. Gesehen: kein solcher Hinweis, nur «15 Rechnungen in der Abrechnungsperiode, 4 Wohnungen». Seepark gewählt.
4. **Schritt 3.** Heizprofil «Heizung + Warmwasser (100%)» vorgeschlagen, Verwaltungspauschale 3 %, beides so übernommen. Ein zweiter Durchgang mit «Heizung Mittelland» zeigte dieselben Hinweise.
5. **Schritt 4 Vorschau** (Screenshot `07-preview.png`). Erwartet: ein Hinweis, dass «Fernwärme Q1 2025» keinen Leistungszeitraum hat. Gesehen: Oben vier Kacheln (Anzahl Abrechnungen 1, Kosten CHF 1’284.31). Dann der blaue Tank-Hinweis, direkt darunter der blaue Hinweis «Heizkosten: Rechnungen ohne Leistungszeitraum» mit Untertitel «Seepark Residenz» und dem Link «ewl Energie Wasser Luzern: Fernwärme Q1 2025. Rechnungsdatum 31.03.2025, CHF 1’520.00». Danach der gelbe Kasten «Es gibt schon Abrechnungen» und unten «Sarah Meier, Wohnung A2, 01.01.2025 – 30.06.2025, 181 Mietstage, Akonto CHF 1’320.00, Kosten CHF 1’284.31, Rückerstattung CHF 35.70». Den Hinweis habe ich gleich bemerkt, er hebt sich aber farblich nicht vom Tank-Hinweis ab.
6. **Nachrechnen.** Die ersetzte Abrechnung (Screenshot `13-sarah-replaced.png`) zählte Fernwärme Q1 mit «Leistungszeitraum 01.01.–31.03.2025, Anteil nach Heizprofil 100 %». Ohne Leistungszeitraum fallen nach dem Profil nur Januar bis Juni auf Sarah Meier: 13.6 + 12.1 + 11.5 + 9.3 + 5.6 + 3.7 = 55.8 %. Ihr Flächenanteil ist 1’054.47 / 4’115 = 25.6 %. Differenz: 1’520 × 25.6 % × 44.2 % ≈ CHF 172.20, mit 3 % Verwaltungspauschale ≈ CHF 177.30. Das deckt sich genau mit 1’461.60 − 1’284.31 = CHF 177.29. Der Hinweis ist also berechtigt und betrifft einen Betrag, der zählt. Die Vorschau zeigt diesen Unterschied aber nirgends.
7. **Link zur Rechnung.** Erwartet: Bearbeitungsformular mit leeren Feldern für den Leistungszeitraum. Gesehen (`10-invoice-edit-wait.png`): «Rechnung bearbeiten», zwei gelbe Kästen zum Abrechnungsstand, dann das Formular. «Leistungszeitraum (optional)» ist leer, Beginn und Ende sind leer, Kategorie «Heizung». Ich hätte 01.01.2025 – 31.03.2025 eintragen können. Nicht gespeichert.
8. **Abbrechen.** Erwartet: zurück zur Vorschau. Gesehen: Assistent bei «Schritt 3 von 5», Heizprofil «Heizung Mittelland» noch gewählt. Ein Klick auf «Weiter» bringt mich zur Vorschau.

## Verwirrung

- «Berichtigte Abrechnung»: Auf der ersetzten Abrechnung heisst der Vorgang so, im Assistenten kommt das Wort nicht vor. Ich musste aus «Anzahl Abrechnungen 1» und der Zeile «Sarah Meier» selbst schliessen, dass das die Berichtigung ist.
- «Es gibt schon Abrechnungen … Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue»: Hat Sarah Meier nun eine oder nicht? Die ersetzte zählt offenbar bei den «4» mit, ist aber nicht aufgeführt.
- «Andere derselben Kategorie schon»: verständlich, aber ich musste in der Rechnungsliste prüfen, welche gemeint sind.

## Fehlerrisiken

- Wer den blauen Hinweis für ebenso unwichtig hält wie den Tank-Hinweis, erstellt die berichtigte Abrechnung ohne Leistungszeitraum. Sarah Meier würden dann CHF 177.29 zu wenig belastet: statt der Nachzahlung der ersetzten Abrechnung erhielte sie eine Rückerstattung. Die Mieterin wird sich über die geänderte Richtung kaum beschweren, ich als Vermieter verliere den Betrag.
- Nach dem Eintragen springt der Assistent auf Schritt 3. Wer dort nur «Weiter» und dann «Erstellen» klickt, ohne die Vorschau nochmals zu lesen, bemerkt nicht, ob der Hinweis verschwunden ist.
- Der Text «erhalten keine neue» könnte jemanden glauben lassen, die Berichtigung werde gar nicht erstellt, und ihn den Assistenten abbrechen lassen.

## Vorschläge

- **P-1:** Assistent mit Periode 2025, Seepark Residenz, Heizprofil wie vorgeschlagen, Vorschau. Hilfreich wäre ein Satz im Hinweis, wenn der Lauf eine berichtigte Abrechnung enthält, etwa: «Die berichtigte Abrechnung von Sarah Meier umfasst nur einen Teil der Periode: Ohne Leistungszeitraum verteilt Dwello diese Rechnung über die ganze Periode.» Ausserdem in «Abrechnungen pro Mietvertrag» bei Sarah Meier: «Berichtigte Abrechnung, ersetzt NK-22222222-2025-0002».
- **P-2:** Gleiche Schritte. Der Hinweis sollte sagen, was ohne Eintrag geschieht («Ohne Leistungszeitraum verteilt Dwello die Kosten nach dem Heizprofil auf die ganze Abrechnungsperiode»). Weil sich Beträge eines Mieters ändern, sollte er als Warnung (gelb) erscheinen. Bei einer Berichtigung wäre zudem der Betrag der ersetzten Abrechnung neben dem neuen hilfreich.
- **P-3:** In der Vorschau auf den Link zur Rechnung klicken und dann «Abbrechen» (oder speichern). Der Rücksprung sollte zur Vorschau (Schritt 4) führen, damit ich sehe, ob der Hinweis weg ist.
- **P-4:** Gleiche Schritte, Kasten «Es gibt schon Abrechnungen». Die ersetzte Abrechnung entweder mitzählen und aufführen («NK-…-0002, Sarah Meier: ersetzt, wird mit diesem Lauf berichtigt») oder nicht mitzählen. Den Satz «erhalten keine neue» ergänzen: «… ausser ersetzte Abrechnungen: Für sie entsteht die berichtigte Abrechnung.»

## Nicht geprüft

- Leistungszeitraum eintragen und speichern: Ich sollte nur ansehen. Deshalb habe ich nicht gesehen, ob der Hinweis nach dem Speichern verschwindet und ob der Betrag von Sarah Meier wieder auf die Nachzahlung steigt.
- Schritt 5 «Erstellen» und die Schaltfläche «Berichtigte Abrechnung erstellen» auf der ersetzten Abrechnung: Beides würde eine Abrechnung anlegen.
- Der Vergleich mit dem Stand vor der Änderung (kein Hinweis bei reinen Berichtigungen): Mir stand nur diese Version zur Verfügung.
- PDF der ersetzten Abrechnung: nicht Teil der Aufgabe.
