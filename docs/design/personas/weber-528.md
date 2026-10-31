# Dr. Weber – Verschiedene Verteilschlüssel in einer Kategorie (#528)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Persona-App auf :3300 mit Demodaten. Gespeichert habe ich nur in Musterhaus Zentrum (Rechnung «Hauswartung Q4 2025», Entwurf NK-11111111-2025-0002). Am Ende hat die Rechnung wieder «Pro Fläche (m²)», und der Entwurf ist mit diesem Stand neu berechnet.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung NK-11111111-2025-0002 (Entwurf, noch nicht neu berechnet) | Der Hinweis «Verschiedene Verteilschlüssel in einer Kategorie» sagt: «Hauswart steht in mehreren Positionen». Die Kostenaufstellung darunter zeigt aber nur **eine** Position Hauswart («Pro Fläche (m²)», CHF 3’680.00, mit Q4 darin). Der Hinweis beschreibt, was erst nach «Neu berechnen» gilt, und widerspricht damit der Tabelle auf demselben Bildschirm. Ich habe zuerst angenommen, die Tabelle sei falsch. |
| P-2 | Minor | Abrechnung (Hinweis) und Dialog «Entwurf neu berechnen» | «Die grösste wird nach «Pro Fläche (m²)» verteilt»: Die grösste was? Nach Betrag, nach Anzahl Rechnungen? Und dass die übrigen Rechnungen (Q1–Q3) damit gemeint sind, muss ich selbst erschliessen. |
| P-3 | Minor | Dialog «Entwurf neu berechnen» (erstes Neu berechnen) | «Sonst rechnet Dwello die Kategorie **wieder** in mehreren Positionen ab.» Der Entwurf war zu diesem Zeitpunkt noch nie aufgeteilt. «wieder» lässt vermuten, dass er schon aufgeteilt ist (passt zu P-1, ist aber trotzdem falsch). |
| P-4 | Minor | PDF des Entwurfs, Kostenübersicht | Die zweite Zeile heisst «Hauswart (Hauswartung Q4 2025)», die erste nur «Hauswart». Dass in der ersten Zeile Q1–Q3 stecken, muss die Mieterin selbst erschliessen. Warum eine Rechnung der gleichen Kategorie anders verteilt ist, erklärt das PDF nirgends, auch nicht unter «Hinweise». Eine Mieterin, deren Vertrag «nach Fläche» vorsieht, fragt da sofort nach. |
| P-5 | Minor | Abrechnungen erstellen, Schritt 4 «Vorschau» | Zu den Hauswartkosten sagt die Vorschau nichts. Sie listet die drei Entwürfe von Musterhaus Zentrum nur mit «Seit dem Erstellen dieses Entwurfs wurden Rechnungen … geändert». Der verschiedene Verteilschlüssel erscheint erst auf der Seite der Abrechnung. (Hier entstanden 0 neue Abrechnungen, weil alle Mietverträge schon eine haben. Ob die Vorschau den Hinweis bei neu zu erstellenden Abrechnungen zeigt, konnte ich nicht prüfen.) |

## Beobachtungen

- Rechnung bearbeiten: Wenn ich «Pro Einheit» wähle, erscheint kein Hinweis, dass die anderen drei Hauswart-Rechnungen von 2025 «Pro Fläche (m²)» haben. Es bleibt beim festen Hilfetext «Verwenden Sie für eine Kategorie immer denselben Verteilschlüssel.» Auch die Rechnungsseite nach dem Speichern sagt dazu nichts, sie zeigt nur «Abrechnungen nicht aktuell». Das Speichern geht also ohne jede Warnung durch.
- Rechnung bearbeiten: Der Einleitungssatz «Bestehende Abrechnungen ändern sich dadurch nicht.» steht direkt über dem Kasten «Rechnung schon abgerechnet … stimmen diese Abrechnungen nicht mehr». Beides stimmt, liest sich aber zuerst wie ein Widerspruch.
- Rechnung bearbeiten: «Änderungen speichern» ist ausgegraut, bis man etwas ändert. Warum, steht nirgends (erst nach einer Änderung erscheint «Ungespeicherte Änderungen»).
- Gegenrichtung nach dem Zurückstellen auf «Pro Fläche (m²)": Bevor ich neu berechne, zeigt der Entwurf noch zwei Hauswart-Zeilen, aber keinen Hinweis mehr zum Verteilschlüssel. Es steht nur der allgemeine Kasten «Rechnungen seit der Abrechnung geändert» da. Das ist das Spiegelbild von P-1. Weil der allgemeine Kasten zum Neu berechnen auffordert, hat es mich nicht behindert.
- Nach dem zweiten Neu berechnen fragt der Dialog nicht mehr nach der Rechnung, und der Entwurf zeigt eine Hauswart-Zeile (CHF 3’680.00, Anteil CHF 687.43, Saldo wieder Rückerstattung CHF 6.50). So erwartet.
- Nachgerechnet: Aufgeteilt ergibt sich 2’760.00 × 92.00/492.50 = 515.57 und 920.00 / 6 = 153.33, zusammen 668.90 statt vorher 687.43. Der Saldo steigt von CHF 6.50 auf 25.60. Die Zahlen sind plausibel.
- Der Hinweis «Legt der Mietvertrag einen Verteilschlüssel fest, gilt er für alle Rechnungen der Kategorie» ist rechtlich vernünftig. Wo ich den Verteilschlüssel im Mietvertrag in Dwello nachsehe, sagt er aber nicht.
- Unter «Verlauf» auf der Abrechnung steht nach zweimal Neu berechnen weiterhin nur «Erstellt 31.10.2026, 13:20». Dass und wann neu berechnet wurde, ist nicht nachvollziehbar.
- In der Rechnung steht unter «In Abrechnungen enthalten» auch NK-11111111-2025-0001 (Überfällig). Der Hinweis sagt richtig, dass ich diese mit «Abrechnung berichtigen» korrigieren muss.
- Der Link «Hauswartung Q4 2025» im Hinweis und im Dialog führt korrekt auf die Rechnung.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 30 Schritte (Seitenaufrufe, Auswahl, Speichern, zweimal Dialog, PDF erstellen und herunterladen).

## Ablauf

- Schritt 1, Verteilschlüssel wählen. Erwartet: ein Hinweis, dass die übrigen Hauswart-Rechnungen anders verteilt sind. Gesehen: kein Hinweis, nur «Ungespeicherte Änderungen». Gespeichert wurde ohne Warnung.
- Schritt 2, Vorschau. Erwartet: ein Satz zu den Hauswartkosten (zwei Positionen, verschiedene Verteilschlüssel). Gesehen: «Anzahl Abrechnungen 0» und die drei Entwürfe mit dem allgemeinen Satz «Rechnungen … erfasst, geändert oder gelöscht», nichts zu Hauswart (P-5). Den Assistenten habe ich über die Brotkrume «Nebenkostenabrechnungen» verlassen, ohne zu erstellen.
- Schritt 3, Entwurf 0002. Erwartet: entweder eine Hauswart-Zeile und ein Hinweis «nach Neu berechnen entstehen zwei Positionen», oder zwei Zeilen. Gesehen: eine Zeile und ein Hinweis «steht in mehreren Positionen» (P-1). Den Grund (eine Rechnung «Pro Einheit») und was zu tun ist, habe ich verstanden, aber erst durch Kombinieren mit dem Kasten «Rechnungen seit der Abrechnung geändert».
- Schritt 4, Dialog. Erwartet: die Folge des Neu berechnens. Gesehen: Die Folge ist klar beschrieben (zwei Positionen, Verteilschlüssel zuerst ändern, falls nicht gewollt). «wieder» passt aber nicht (P-3). Nach dem Bestätigen waren zwei Hauswart-Zeilen da, und die Meldung «Der Entwurf ist neu berechnet.» erschien.
- Schritt 5, PDF. Nach dem Neu berechnen gab es zuerst nur «PDF erstellen». Nach dem Erstellen konnte ich «PDF herunterladen» (NK-11111111-2025-0002.pdf, 2 Seiten). Erwartet: beide Zeilen benannt und eine Erklärung. Gesehen: nur die zweite Zeile nennt ihre Rechnung, und eine Erklärung fehlt (P-4).

## Vorschläge

- **P-1:** Rechnung «Hauswartung Q4 2025» auf «Pro Einheit» stellen und speichern, dann Entwurf NK-11111111-2025-0002 öffnen, ohne neu zu berechnen. Hilfreich: Solange der Entwurf noch nicht neu berechnet ist, den Hinweis in der Zukunft formulieren, etwa «Diese Rechnung hat einen anderen Verteilschlüssel als die übrigen Rechnungen der Kategorie Hauswart. Wenn Sie neu berechnen, steht Hauswart in zwei Positionen: …». Oder den Hinweis an die tatsächlichen Positionen des Entwurfs binden.
- **P-2:** Gleiche Schritte, den Hinweis lesen. Hilfreich: «Die übrigen Rechnungen der Kategorie werden nach «Pro Fläche (m²)» verteilt, diese Rechnung nach «Pro Einheit»» oder «die Position mit dem höchsten Betrag».
- **P-3:** Gleiche Schritte, dann «Neu berechnen» wählen und den Dialog lesen. Hilfreich: «wieder» streichen («Sonst rechnet Dwello die Kategorie in mehreren Positionen ab.»).
- **P-4:** Nach Schritt 4 «PDF erstellen» wählen und das PDF herunterladen, dann die Kostenübersicht ansehen. Hilfreich: Die erste Zeile ebenfalls benennen (etwa «Hauswart (übrige Rechnungen)») und unter «Hinweise» einen Satz ergänzen, warum eine Rechnung der Kategorie anders verteilt ist.
- **P-5:** Rechnung wie in P-1 ändern, dann «Abrechnungen erstellen» mit 01.01.2025 – 31.12.2025 und Musterhaus Zentrum bis zur Vorschau durchgehen. Hilfreich: In der Liste der betroffenen Entwürfe den Verteilschlüssel-Hinweis mit anzeigen (oder bestätigen, dass er bei neu zu erstellenden Abrechnungen erscheint).

## Nicht geprüft

- Wie die Vorschau aussieht, wenn für Musterhaus Zentrum wirklich neue Abrechnungen entstehen: Alle Mietverträge 2025 haben schon eine Abrechnung. Löschen durfte und wollte ich keine, und der Assistent bietet sonst keinen Weg.
- Wie die Entwürfe 0003 und 0004 und die überfällige 0001 aussehen: Das war nicht Teil der Aufgabe, und ich habe dort nichts geändert.
- Andere Sprachen des PDFs («PDF auf Deutsch» ist eine Auswahl): Ich habe nur das deutsche PDF angesehen.
