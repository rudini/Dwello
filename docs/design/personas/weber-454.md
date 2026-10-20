# Persona-Review Dr. Weber, Runde 454: Abrechnungen, die nach dem Erstellen nicht mehr stimmen

Persona: Dr. Weber, 52, liest alles, prüft rechtliche Aussagen und rechnet nach. Desktop 1440 × 900, Maus (Playwright über `persona-kit.mjs`, Zoom 100 %). App: Persona-Stack auf http://localhost:3300, Demo-Daten, Version 0.69.3+134-g5dde9bb9. Gespeichert habe ich nur im Gebäude «Seepark Residenz».

**Gespeicherte Datensätze (für die Datenprüfung):**

- Abrechnung **NK-22222222-2025-0001** (Thomas Weber, Seepark Residenz, Wohnung A1, 01.01.–31.12.2025, Rückerstattung CHF 34.60) per E-Mail **versendet** am 20.10.2026, danach **«Nicht berichtigen»** bestätigt (Verlauf: «Nicht berichtigt 20.10.2026»). Nicht berichtigt, nicht als bezahlt markiert.
- Rechnung **7274c66b-1749-4b6e-8147-9acd2acba019**: Seepark Residenz, Rechnungsdatum 20.05.2025, ohne Leistungszeitraum, CHF 900.00, Rechnungssteller «Hauswartdienst Seeblick GmbH», Beschreibung «Hauswart Zusatzaufwand Frühling 2025», Kategorie Hauswart, Verteilschlüssel Pro Fläche (m²), umlagefähig, ohne Beleg.
- Die Entwürfe NK-22222222-2025-0002/-0003/-0004 habe ich nicht neu berechnet und nicht versendet. Beim Entwurf -0004 (Bernasconi) habe ich nur den Sendedialog geöffnet und abgebrochen.

Die Aufgabe «Abrechnung berichtigen» für Hans Müller (NK-11111111-2025-0001, Musterhaus Zentrum) und die Entwürfe von Musterhaus Zentrum stammen aus Annas Lauf. Sie zählen hier nicht als Befund.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung (versendet), Dialog «Abrechnung nicht berichtigen?» | Der Dialog nennt die Folge nicht, um die es geht: das Geld. Weder der Hinweis noch der Dialog sagen, welche Rechnung dazugekommen ist und wie stark sie den Saldo ändert (hier etwa CHF 197 zulasten des Mieters, aus der Rückerstattung CHF 34.60 wird eine Nachzahlung von etwa CHF 162). Auch steht nirgends, dass der Vermieter diesen Anteil selbst trägt, wenn er nicht berichtigt. Der Dialog sagt nur, dass die Aufgabe verschwindet und der Verlauf den Entscheid festhält. |
| P-2 | Major | Entwurf (nicht aktuell), Dialog «Abrechnung per E-Mail senden» | Den Entwurf, den Dwello selbst als «nicht aktuell» kennzeichnet, kann ich ohne jede Warnung versenden. Der Sendedialog sieht genau gleich aus wie bei einem aktuellen Entwurf. Der Mieter bekommt so eine Abrechnung, von der Dwello schon weiss, dass sie falsch ist. |
| P-3 | Minor | Übersicht, Abrechnung, Rechnung | Die Aussage zur Verjährung ist zu pauschal. «Forderungen aus der Nebenkostenabrechnung verjähren in der Regel nach fünf Jahren (Art. 128 Ziff. 1 OR)» stimmt für die Nachforderung des Vermieters. Der Text liest sich aber so, als gelte er für beide Seiten. Will der Mieter zu viel Bezahltes zurück, gilt nach meinem Wissen das Bereicherungsrecht (Art. 67 OR) mit eigenen Fristen. Gerade wenn eine Berichtigung zugunsten des Mieters ausfällt, ist das wichtig. |
| P-4 | Minor | Hinweis auf Abrechnung und Rechnung, Aufgabe auf der Übersicht | «Die berichtigte Abrechnung rechnet an, was schon bezahlt ist» ist bei einer Rückerstattung missverständlich. Hier zahlt nicht der Mieter, sondern der Vermieter. Der Dialog «Abrechnung berichtigen» macht es richtig («Bereits zurückerstattet»), der Hinweis vorher nicht. |
| P-5 | Minor | Übersicht, Aufgabe «Abrechnung berichtigen» | Die Aufgabe befiehlt «Berichtigen Sie die Abrechnung». Dass Berichtigen eine Wahl ist («Nicht berichtigen») und dass eine Frist läuft (Verjährung), erfahre ich erst auf der Abrechnung. Auch hier fehlt, welche Rechnung es betrifft und um welchen Betrag. |
| P-6 | Minor | Rechnungsliste aus der Erinnerung «Rechnungen von Alpenblick für 2025 ansehen» | Laut Überschrift «fallen» alle Rechnungen in die Periode 2025 (nach Leistungszeitraum, sonst Rechnungsdatum). Die Zeilen zeigen aber nur Rechnungsdatum und vollen Betrag, keinen Leistungszeitraum und keinen Anteil. Die Heizölrechnung (CHF 4’880.00, 25.08.2025) steht mit vollem Betrag da, obwohl Heizöl laut Formularhilfe über den Tankbestand zählt. Die Heizölrechnung 2024, deren Öl vielleicht 2025 verbrannt wurde, fehlt in der Liste. Welcher Teil zählt, kann ich so nicht beurteilen. |
| P-7 | Minor | Abrechnungsliste (Filter Entwürfe Seepark 2025) | Die Aufgabe auf der Übersicht führt zu den Entwürfen, aber die Liste zeigt nicht, welche davon nicht aktuell sind. Das sehe ich erst, wenn ich jede Abrechnung einzeln öffne. |
| P-8 | Nit | Abrechnung, Verlauf | Der Eintrag «Nicht berichtigt 20.10.2026» hat keine Uhrzeit und nennt die Rechnung nicht, für die ich entschieden habe. Als Beleg für später («warum habe ich damals nicht nachgefordert?») reicht das kaum. |
| P-9 | Nit | Rechnung (nach «Nicht berichtigen») | Die Rechnung zeigt weiter «Abrechnungen nicht aktuell … Versendete Abrechnungen berichtigen Sie …». Dass ich für die Abrechnung von Thomas Weber schon entschieden habe, steht dort nicht. Für die Entwürfe ist der Text weiterhin richtig. |
| P-10 | Nit | Abrechnung (versendet), Hinweis | Der Hinweis steht auf der Abrechnung und sagt «… berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung». Der Zusatz «auf der Abrechnung» ist hier überflüssig. |

## Beobachtungen

- Die Abrechnung von Thomas Weber habe ich nachgerechnet, sie stimmt. Positionen: 228.00 + 650.25 + 874.44 + 437.75 + 106.10 = 2’296.54. Die Verwaltungspauschale beträgt 3 % = 68.90, die Nebenkosten also 2’365.44. Nach Abzug der Akonto von 2’400.00 bleiben 34.56, gerundet 34.60.
- Nach dem Versand bietet die Abrechnung «Als bezahlt markieren» an, und unter «Fristen» steht «Zahlungsfrist · Thomas Weber». Es ist aber eine Rückerstattung, also zahle ich. «Rückerstattung bis» auf der Abrechnung stimmt, die Frist auf der Übersicht nicht.
- Im Formular ist der Verteilschlüssel bei Kategorie «Hauswart» nicht vorbelegt. Ohne Wahl würde gleichmässig pro Wohnung verteilt, die übrigen Hauswartrechnungen der Abrechnung laufen aber «Pro Fläche». Ich habe Pro Fläche von Hand gewählt. Wer das übersieht, verteilt dieselbe Kostenart in einer Abrechnung auf zwei Arten.
- Die Begründung zur Umlagefähigkeit auf der Rechnung sagt «Verwaltung und Reparaturen nicht». Dieselbe Abrechnung verrechnet aber eine Verwaltungspauschale von 3 %. Für einen Laien widerspricht sich das. Ausserdem fehlt der Hinweis, dass eine Nebenkostenart nur verrechnet werden darf, wenn der Mietvertrag sie nennt (Art. 257a Abs. 2 OR).
- Der Text der Entwurfsaufgabe nennt «oder der Tankbestand geändert». Seepark Residenz hat Fernwärme und keinen Tank. Ein allgemeiner Text, der hier nicht passt.
- Der Dialog «Abrechnung berichtigen» ist gut: Die bisherige Abrechnung bleibt erhalten, «Bereits zurückerstattet» lässt sich mit einem Teilbetrag erfassen, und er sagt «Das lässt sich nicht rückgängig machen». Ich habe ihn nur geöffnet und abgebrochen.
- Die Alpenblick-Liste 2025 hat nur «Wasser und Abwasser H1 2025» und keinen Kaminfeger, 2024 gab es H1, H2 und Kaminfeger. Die Erinnerung sagt «Erfassen Sie zuerst alle Rechnungen», hilft aber nicht zu erkennen, was gegenüber dem Vorjahr fehlt.
- Auf der Rechnungsliste steht der Filter «Jahr» auf «Alle Jahre», obwohl die Liste auf die Periode 2025 gefiltert ist. Die Periode steht nur im Satz über der Liste und lässt sich nicht als eigener Filter sehen oder ändern.

## Aufgabe geschafft: ja

Alle fünf Schritte durchgeführt. Gespeichert habe ich nur in Seepark Residenz, bei Alpenblick nichts.

## Aufwand

Etwa 25 Minuten, 14 Durchgänge, rund 30 Bedienschritte: Versand 3, Rechnung erfassen 9, Lesen von Übersicht, Abrechnung, Rechnung und Entwürfen 8, beide Dialoge öffnen und «Nicht berichtigen» bestätigen 5, Alpenblick-Rechnungen 5.

## Ablauf

1. **Abrechnung von Thomas Weber öffnen.** Erwartet: ein Entwurf mit nachvollziehbaren Zahlen. Gesehen: Entwurf, Saldo Rückerstattung CHF 34.60, Rechnung stimmt (Bildschirmfoto 03: Positionen mit aufklappbaren Rechnungen, Verlauf «Erstellt / PDF erstellt»).
2. **«Per E-Mail senden».** Erwartet: ein Dialog mit Empfänger und Folgen. Gesehen: Empfänger, Kanal, Datierung auf den Versandtag, Zahlungsfrist aus den Einstellungen, PDF-Vorschau (04). Nach dem Bestätigen: Status «Versendet», Verlauf «Versendet 20.10.2026», «Abrechnung berichtigen» unter «Weitere Aktionen» (05).
3. **Rechnung erfassen** (Übersicht → «Rechnung erfassen»). Erwartet: das Formular mit Hilfetexten. Gesehen: lange, aber gute Hilfe zum Leistungszeitraum. Die Kategorie erscheint erst nach Wahl des Gebäudes, der Verteilschlüssel ist nicht vorbelegt (07). Gespeichert: Die Rechnungsseite zeigt sofort «Abrechnungen nicht aktuell» mit dem Text zu Neu berechnen, Berichtigen, Anrechnen und Verjährung (08).
4. **Übersicht lesen.** Erwartet: eine Aufgabe für Weber und eine für die Entwürfe. Gesehen (09): «Nächster Schritt: Abrechnung berichtigen – Seit dem Erstellen der Abrechnung NK-22222222-2025-0001 von Thomas Weber wurde 1 Rechnung … erfasst, geändert oder gelöscht. Berichtigen Sie …», dazu «6 Entwürfe sind nicht aktuell» mit Links pro Gebäude und Periode. Welche Rechnung und welcher Betrag, sehe ich nicht (P-5).
5. **Hinweis auf der Abrechnung von Weber.** Erwartet: was sich ändert und welche Möglichkeiten ich habe. Gesehen (10): Kasten «Rechnungen seit der Abrechnung geändert» mit Berichtigen, Anrechnen und Verjährung, Knopf «Nicht berichtigen». Kein Betrag, keine Rechnung (P-1, P-3, P-4, P-10).
6. **Dialog «Abrechnung berichtigen» nur geöffnet** (11). Gut erklärt, abgebrochen.
7. **«Nicht berichtigen» geöffnet** (12). Erwartet: die Folge in Franken. Gesehen: «bleibt, wie sie ist … Aufgabe verschwindet … Verlauf hält fest … später trotzdem berichtigen … erscheint wieder, wenn eine weitere Rechnung den Saldo ändert». Kein Wort zum Betrag oder dazu, wer ihn trägt (P-1).
8. **Bestätigt.** Erwartet: was der Dialog versprochen hat. Gesehen (13): Der Hinweis lautet jetzt «Am 20.10.2026 haben Sie entschieden, die Abrechnung nicht zu berichtigen.», im Verlauf steht «Nicht berichtigt 20.10.2026» (P-8), «Abrechnung berichtigen» bleibt verfügbar. Auf der Übersicht ist die Weber-Aufgabe verschwunden, die Entwurfsaufgabe steht noch da (14). Die Behauptungen des Dialogs stimmen also.
9. **Rechnung erneut geöffnet** (15). Sie zeigt weiter «Abrechnungen nicht aktuell», «In Abrechnungen enthalten: Keine» (P-9).
10. **Entwürfe Seepark 2025** (16, 17). Die Liste zeigt keinen Unterschied zwischen aktuellen und nicht aktuellen Entwürfen (P-7). Im Entwurf Bernasconi steht ein passender Hinweis «Wählen Sie «Neu berechnen» …». Den Sendedialog öffnete ich zur Probe: keine Warnung (18, P-2), abgebrochen.
11. **Alpenblick-Erinnerung → «Rechnungen von Alpenblick für 2025 ansehen»** (19). Erwartet: welche Rechnungen in die Periode fallen und welcher Teil zählt. Gesehen: Satz «Rechnungen von Alpenblick, die in die Abrechnungsperiode 01.01.2025 – 31.12.2025 fallen (nach Leistungszeitraum, sonst Rechnungsdatum)», sechs Rechnungen mit Rechnungsdatum und vollem Betrag. Die Detailseite der Heizölrechnung (20) zeigt weder Leistungszeitraum noch Tankbezug (P-6). Nichts gespeichert.

## Verwirrung

- «erfasst, geändert oder gelöscht»: Welches davon ist passiert, und welche Rechnung? Ich habe sie selbst erfasst und weiss es, ein Vermieter nach Monaten nicht.
- «rechnet an, was schon bezahlt ist» bei einer Rückerstattung: Wer hat bezahlt?
- «Nicht berichtigen»: Ist das ein Verzicht auf die Nachforderung? Bindet er mich gegenüber dem Mieter? Der Dialog sagt nur, dass ich später doch noch berichtigen kann, aber nicht, bis wann (Verjährung, Treu und Glauben des Mieters).
- «Zahlungsfrist · Thomas Weber» auf der Übersicht, obwohl ich erstatte.
- «fallen in die Abrechnungsperiode» bei Heizöl, das über den Tank zählt.

## Fehlerrisiken

- Der Vermieter verzichtet aus Unwissen auf eine Nachforderung von rund CHF 160–200, weil der Dialog den Betrag verschweigt (P-1).
- Er versendet einen bekannt veralteten Entwurf, weil der Sendedialog nicht warnt (P-2). Danach braucht es eine Berichtigung beim Mieter, die vermeidbar gewesen wäre.
- Er glaubt, auch Rückforderungen des Mieters verjährten erst nach fünf Jahren (P-3).
- Er verteilt eine Hauswartrechnung pro Wohnung statt pro Fläche, weil der Verteilschlüssel leer bleibt (Beobachtung).
- Er prüft Heizkosten auf der Rechnungsliste mit dem vollen Rechnungsbetrag statt dem Verbrauch (P-6).

## Vorschläge

- **P-1:** Reproduktion: Abrechnung NK-…-0001 von Thomas Weber versenden, eine Rechnung «Hauswart» CHF 900.00 vom 20.05.2025 in Seepark Residenz erfassen, die Abrechnung öffnen und «Nicht berichtigen» wählen. Hilfreich wäre im Hinweis und im Dialog die betroffene Rechnung (mit Link) und die voraussichtliche Änderung des Saldos, etwa «Saldo heute: Rückerstattung CHF 34.60, nach Berichtigung etwa Nachzahlung CHF 162.45». Dazu ein Satz zur Folge: «Den Anteil dieser Rechnung von etwa CHF … tragen Sie dann selbst, solange Sie nicht berichtigen.»
- **P-2:** Reproduktion: wie oben, dann einen Entwurf von Seepark 2025 öffnen und «Per E-Mail senden» wählen. Hilfreich wäre im Sendedialog eines nicht aktuellen Entwurfs ein Warnsatz wie «Dieser Entwurf ist nicht aktuell: Seit dem Erstellen wurde 1 Rechnung erfasst. Berechnen Sie ihn zuerst neu.», besser noch ein Knopf «Zuerst neu berechnen».
- **P-3:** Verjährungstext auf allen drei Bildschirmen prüfen lassen und auf die Forderung des Vermieters einschränken, etwa «Ihre Nachforderung verjährt in der Regel nach fünf Jahren …». Für Rückforderungen des Mieters braucht es einen eigenen, fachlich geprüften Satz.
- **P-4:** Reproduktion: Hinweis auf einer versendeten Rückerstattung lesen. Hilfreich wäre ein Text, der vom Saldo abhängt: «rechnet an, was der Mieter schon bezahlt hat» bzw. «was Sie schon zurückerstattet haben».
- **P-5:** Reproduktion: Übersicht nach Schritt 3. Hilfreich wären «Prüfen Sie, ob Sie die Abrechnung berichtigen» statt des Befehls, die betroffene Rechnung und der Betrag, und dass man auch «Nicht berichtigen» wählen kann.
- **P-6:** Reproduktion: Übersicht → «Rechnungen von Alpenblick für 2025 ansehen». Hilfreich wären in jeder Zeile Leistungszeitraum und zählender Anteil (Tage in der Periode), und bei Heizöl ein Satz wie «zählt über den Tankbestand, nicht mit dem Rechnungsbetrag». Ausserdem sollte klar sein, dass frühere Öllieferungen über den Tank mitzählen können.
- **P-7:** Reproduktion: Übersicht → «Seepark Residenz, 2025» unter «Entwürfe sind nicht aktuell». Hilfreich wäre eine Kennzeichnung «Nicht aktuell» in der Zeile, mit Text, nicht nur mit Farbe.
- **P-8:** Verlaufseintrag mit Uhrzeit und der Rechnung (Rechnungssteller, Betrag, Datum), für die nicht berichtigt wurde.
- **P-9:** Auf der Rechnung pro Abrechnung zeigen, was offen und was entschieden ist, etwa «NK-…-0001: nicht berichtigt am 20.10.2026; 3 Entwürfe: neu berechnen».
- **P-10:** «auf der Abrechnung» im Hinweis auf der Abrechnungsseite weglassen.

## Nicht geprüft

- «Abrechnung berichtigen» bis zum Ende habe ich nicht durchgeführt (nur den Dialog geöffnet). Die Aufgabe verlangte «Nicht berichtigen», und ich wollte den Zustand für die Datenprüfung nicht verändern.
- «Neu berechnen» der Seepark-Entwürfe habe ich nicht ausgeführt, also auch nicht nachgerechnet, ob die CHF 900 dort richtig verteilt werden. Der Datensatz bleibt für die Datenprüfung so.
- Ob die Aufgabe wieder erscheint, wenn eine weitere Rechnung den Saldo ändert: Dafür hätte ich eine zweite Rechnung speichern müssen, das gehörte nicht zur Aufgabe.
- Das PDF der versendeten Abrechnung habe ich nicht angesehen, es war nicht Teil der Aufgabe.
- Rechnungen mit Leistungszeitraum über den Jahreswechsel: Bei Alpenblick 2025 gibt es keine, darum konnte ich die Anzeige eines Teilbetrags nicht sehen.
- Die Verjährungsaussagen habe ich nur nach meinem Wissen beurteilt, nicht mit Quellen geprüft (P-3: fach-reviewer).

Bildschirmfotos und Skripte: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/weber-454/` (01–20).
