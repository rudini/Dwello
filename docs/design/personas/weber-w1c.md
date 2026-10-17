# Persona-Review: Dr. Weber, Runde w1c – Hinweis «Es gibt schon Abrechnungen» in der Vorschau

Desktop 1440 × 900, Maus, Persona-App auf http://localhost:3300, gespeichert nur in «Musterhaus Zentrum». Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/e2b820b1-99c9-50ff-9309-d5cdef855e91/scratchpad/weber-w1c/`.

Hinweis vorweg: Beim Einlesen habe ich versehentlich `demo-records.md` geöffnet, eine Datei, die für den Auftraggeber bestimmt ist. Jede Aussage unten habe ich trotzdem in der App selbst nachgeprüft (Abrechnungen, Mietverträge, Heizprofile).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritt 4 Vorschau | Bei der versendeten Abrechnung von Hans Müller (NK-11111111-2025-0001) fehlt der Hinweis, dass seit dem Erstellen eine Rechnung erfasst wurde. Bei den Entwürfen steht er. Wähle ich die empfohlenen Einstellungen, verschwindet Hans Müller ganz aus der Liste. Die Vorschau wirkt dann, als stimme bei ihm alles, obwohl seine Abrechnung die neue Rechnung über CHF 380.00 nicht enthält und die neue Abrechnung von Anna Schmidt schon. Die Detailseite von Hans Müller nennt den Unterschied («1 Rechnung … erfasst, geändert oder gelöscht», mit Anleitung für versendete Abrechnungen), die Vorschau nicht. |
| P-2 | Minor | Schritt 4 Vorschau | Der Hinweis meldet einen Heizprofil-Unterschied («Heizung Mittelland» gegenüber «Heizung Bergregion») und empfiehlt, dasselbe Heizprofil zu wählen. Alle drei bestehenden Abrechnungen sagen aber selbst «Heizung Mittelland (nicht angewendet: Mietvertrag über die ganze Periode)». Auch Anna Schmidts neue Abrechnung läuft über die ganze Periode. Der Unterschied ändert hier keinen Franken. Wer vorsichtig ist, löscht deshalb vielleicht Entwürfe, ohne dass es nötig wäre. |
| P-3 | Minor | Schritt 3 / Schritt 4 | Schritt 3 schlägt «Heizung + Warmwasser» vor, obwohl alle Abrechnungen 2025 dieses Gebäudes mit «Heizung Mittelland» erstellt wurden. Ohne eigene Änderung erscheint der Unterschied-Hinweis also schon mit dem Vorschlag der App. Erst die Vorschau sagt, was die bestehenden Abrechnungen verwendet haben. Schritt 3, wo ich die Wahl treffe, sagt es nicht. |
| P-4 | Minor | Schritt 4 Vorschau | Die Liste nennt bei keiner Abrechnung den Status (Entwurf oder Versendet). Die Empfehlung «Um einen Entwurf neu zu berechnen, löschen Sie ihn» hilft nur, wenn ich weiss, welche Abrechnungen Entwürfe sind. Nach der Umstellung heisst es zudem «schon 3 Nebenkostenabrechnungen», es sind aber nur 2 aufgeführt. Warum die dritte fehlt, steht nirgends. |
| P-5 | Nit | Schritt 4 Vorschau | Bei jeder Abrechnung steht derselbe lange Satz zu Heizprofil und Satz, dreimal fast wortgleich. Ein Satz für alle betroffenen Abrechnungen wäre leichter zu lesen. Der Satz zu den Rechnungen nennt keine Anzahl («wurden Rechnungen … erfasst»), die Detailseite schon («1 Rechnung»). |

## Beobachtungen

- **Rechnung erfassen: Die Liste «Kategorie (optional)» ist leer.** Im Formular «Neue Rechnung» enthält die Auswahl nur «Kategorie auswählen». Ich habe es dreimal versucht: sofort, nach Wahl des Gebäudes mit Wartezeit und nach 4 s Wartezeit vor der Wahl. Auch im Bearbeiten-Formular einer bestehenden Hauswart-Rechnung (Hauswartung Q1 2025) ist die Liste leer, und es ist keine Kategorie gewählt. Speichert man dieses Formular, geht die Kategorie womöglich verloren; das habe ich nicht ausprobiert. Die Rechnungsliste und «Kategorien» zeigen alle 21 Kategorien. Den Schritt «allocable category» konnte ich so nicht wie verlangt erledigen.
- **Rechnungen hochladen reagiert nicht.** Gebäude gewählt, Datei «Gartenbau Grün Herbstpflege 2025.pdf» ausgewählt (zweimal über den Dateidialog, einmal direkt): Es kommt keine Anfrage, nichts wird ausgelesen, der Knopf bleibt bei «0 Rechnungen erstellen».
- Deshalb habe ich die Rechnung ohne Kategorie gespeichert: Hauswartdienst Zentrum GmbH, «Zusatzreinigung Treppenhaus November 2025», 15.11.2025, CHF 380.00, Pro Fläche (m²), umlagefähig. Die Vorschau rechnet sie ein: 20 statt 19 Rechnungen. Sie weist aber nicht darauf hin, dass eine umlagefähige Rechnung keine Kategorie hat.
- Der Dialog zum Löschen des Entwurfs ist klar: «Die Abrechnung NK-11111111-2025-0002 von Anna Schmidt wird gelöscht. Das lässt sich nicht rückgängig machen.» Danach kommt man zurück auf die Liste, mit 6 statt 7 Entwürfen.
- Auf der Detailseite (Sicht des Vermieters) steht «Ihr Mietverhältnis in dieser Periode». Das klingt, als würde der Mieter angesprochen.
- Die Fortschrittsanzeige des Assistenten trennt Wörter mitten im Wort: «Abrechnun / gsperiode», «Verwaltung / spauschale» (Screenshot `31-step4.png`).
- «Entwurf gespeichert, 00:53» zeigt UTC. Die Detailseiten zeigen Schweizer Zeit (02:46). Wahrscheinlich liegt das an der Zeitzone des Testbrowsers; mit einem echten Browser nicht geprüft.

## Aufgabe geschafft: teilweise

Schritt 1 und Schritt 3 mit Rücksprung habe ich vollständig erledigt. Schritt 2 ging nicht mit Kategorie, weil das Formular keine anbietet und das Hochladen nicht reagiert. Ersatzweise habe ich die Rechnung ohne Kategorie erfasst.

## Aufwand

Etwa 20 Minuten, rund 30 Skriptläufe. Davon gingen etwa 8 Läufe in die Suche nach einer Kategorie (Formular, Bearbeiten-Formular, Hochladen).

## Ablauf

1. **Bestand prüfen.** Erwartet: 4 Abrechnungen 2025 in Musterhaus Zentrum. Gesehen: Hans Müller versendet; Anna Schmidt, Pierre Dubois und Maria Rossi im Entwurf. Alle vier: «Heizprofil: Heizung Mittelland (nicht angewendet: Mietvertrag über die ganze Periode)», «Verwaltungspauschale 3 % der Zwischensumme». Alle vier Mietverträge: «Verwaltungspauschale: Vereinbart, Satz des Abrechnungslaufs». Die 3 % sind also der Satz des Laufs, kein eigener Satz im Vertrag.
2. **Entwurf Anna Schmidt löschen.** Erwartet: Bestätigung mit Folge. Gesehen: wie erwartet; danach 6 Entwürfe.
3. **Rechnung erfassen.** Erwartet: Kategorie wählen, zum Beispiel Hauswart. Gesehen: Die Kategorienliste ist leer, das Hochladen reagiert nicht (siehe Beobachtungen). Ersatz: Rechnung ohne Kategorie, CHF 380.00, Pro Fläche, gespeichert; die Liste zeigt 85 statt 84 Rechnungen.
4. **Assistent, Schritte 1–3.** Periode 01.01.–31.12.2025 vorgeschlagen; Musterhaus Zentrum mit «19 Rechnungen» (vor Schritt 3 der Aufgabe), später 20. Vorschlag in Schritt 3: «Heizung + Warmwasser», 3 %. Gewählt: «Heizung Bergregion», 2 %.
5. **Vorschau, abweichende Einstellungen.** Erwartet: ein Hinweis auf die drei bestehenden Abrechnungen mit ihren Werten. Gesehen: «Es gibt schon Abrechnungen … schon 3 Nebenkostenabrechnungen», je Abrechnung «Erstellt mit dem Heizprofil «Heizung Mittelland», die neuen Abrechnungen mit «Heizung Bergregion». Erstellt mit 3 % Verwaltungspauschale, die neuen Abrechnungen mit 2 %.» Bei Maria Rossi und Pierre Dubois steht zusätzlich «Seit dem Erstellen dieses Entwurfs wurden Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht.» Bei Hans Müller fehlt dieser Satz (P-1). Darunter: «Damit alle Abrechnungen … gleich gerechnet sind, wählen Sie im Schritt 3 … dasselbe Heizprofil und denselben Satz … Bestehende Abrechnungen bleiben, wie sie sind, auch Entwürfe. Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue. Um einen Entwurf neu zu berechnen, löschen Sie ihn …», dazu das Kästchen «Die Abrechnungen trotzdem erstellen».
   - Faktencheck: Mittelland und 3 % stimmen für alle drei. Die Anzahl 3 stimmt. «Bleiben, wie sie sind» und «keine neue» sind klar. Den Betrag habe ich nachgerechnet: Anna Schmidt vorher Zwischensumme CHF 3’488.85; neue Rechnung 380 × 18.68 % = 70.98, ergibt 3’559.83; × 1.02 = CHF 3’631.03, wie angezeigt. Akonto 3’600 ergibt eine Nachzahlung von 31.03, gerundet 31.05. Stimmt. Ohne die neue Rechnung (erster Lauf): 3’488.85 × 1.02 = 3’558.63, Rückerstattung 41.35. Stimmt ebenfalls.
6. **Zurück, Mittelland und 3 %.** Erwartet: Der Unterschied-Hinweis entfällt; was abweicht, bleibt sichtbar. Gesehen: Kosten CHF 3’666.62 (3’559.83 × 1.03, richtig), Nachzahlung 66.60. Der Satz «Damit alle …» entfällt. Es bleiben Maria Rossi und Pierre Dubois mit dem Rechnungs-Hinweis. Hans Müller ist weg, obwohl auch ihm die neue Rechnung fehlt (P-1). Der Kopf sagt weiter «schon 3» (P-4).

## Verwirrung

- «Erstellt mit dem Heizprofil …»: Ich verstehe das Heizprofil als Verteilung bei Mieterwechsel. Warum ein Unterschied wichtig ist, wenn es bei allen «nicht angewendet» war, erklärt der Hinweis nicht (P-2).
- «Rechnungen … erfasst, geändert oder gelöscht»: Welche Rechnung? Wie viel macht das aus? Die Detailseite sagt wenigstens «1 Rechnung».
- Warum verschwindet Hans Müller nach der Umstellung, wenn der Kopf weiter 3 Abrechnungen zählt?
- «Die Abrechnungen trotzdem erstellen»: Erstellt das nur die neue für Anna Schmidt? Nach dem Satz «Mietverträge mit einer Abrechnung … erhalten keine neue» vermutlich ja, aber das steht nicht direkt beim Kästchen.

## Fehlerrisiken

- Wer der Vorschau nach der Umstellung vertraut, erstellt Anna Schmidts Abrechnung mit der neuen Rechnung. Hans Müllers versendete Abrechnung bleibt ohne sie. Der Mieter Hans Müller zahlt dann zu wenig, Anna Schmidt ihren Anteil. Die Abrechnungen der Periode sind ungleich gerechnet, ohne dass der Assistent das sagt (P-1).
- Wer der Heizprofil-Empfehlung folgt, löscht vielleicht Entwürfe, deren Betrag sich gar nicht ändert (P-2).
- Wer den Vorschlag von Schritt 3 übernimmt, rechnet ohne Absicht mit einem anderen Heizprofil als der Rest der Periode (P-3).

## Vorschläge

- **P-1:** Musterhaus Zentrum, Abrechnungen 2025 vorhanden (eine versendet). Entwurf Anna Schmidt löschen, Rechnung 2025 erfassen, Assistent 2025 und Musterhaus Zentrum, in Schritt 3 die gleichen Werte wie die bestehenden Abrechnungen, Vorschau: Hans Müller fehlt in der Liste. Hilfreich: Auch versendete Abrechnungen mit geänderten Rechnungen aufführen, mit dem Status und dem Satz von der Detailseite (berichtigen ausserhalb von Dwello, Differenz).
- **P-2:** Gleiche Schritte, in Schritt 3 ein anderes Heizprofil. Hilfreich: den Heizprofil-Unterschied nur melden, wenn das Profil bei einer bestehenden oder neuen Abrechnung angewendet wurde bzw. würde, oder dazuschreiben «hat den Betrag nicht beeinflusst, weil …».
- **P-3:** Assistent 2025, Musterhaus Zentrum, Schritt 3: Vorschlag «Heizung + Warmwasser». Hilfreich: Heizprofil und Satz der bestehenden Abrechnungen der Periode vorschlagen oder in Schritt 3 nennen («Die bestehenden Abrechnungen 2025 verwenden Heizung Mittelland und 3 %»).
- **P-4:** Gleiche Schritte, nach Umstellung auf Mittelland und 3 %. Hilfreich: Status je Abrechnung nennen (Entwurf / Versendet); den Kopfsatz auf die aufgeführten Abrechnungen beziehen oder sagen, dass die übrigen gleich gerechnet sind.
- **P-5:** Gleiche Schritte mit abweichenden Werten. Hilfreich: einen gemeinsamen Satz für alle Abrechnungen mit denselben Werten und beim Rechnungs-Hinweis die Anzahl nennen.

## Nicht geprüft

- Rechnung mit Kategorie: nicht möglich, weil das Formular keine anbietet und das Hochladen nicht reagiert.
- Das Erstellen selbst (Schritt 5) und das Kästchen «trotzdem erstellen»: gehört nicht zur Aufgabe.
- Einen eigenen Satz im Mietvertrag, der vom Satz des Laufs abweicht: In Musterhaus Zentrum hat kein Vertrag einen; Verträge habe ich nicht geändert.
- Ob der Assistent die Wahl in Schritt 3 beim Zurückgehen in derselben Sitzung behält: Jeder Lauf war eine neue Browsersitzung. Dort startete der Assistent wieder bei Schritt 1 mit dem Vorschlag «Heizung + Warmwasser», obwohl «Entwurf gespeichert» angezeigt wurde.
- PDF: nicht Teil der Aufgabe.
