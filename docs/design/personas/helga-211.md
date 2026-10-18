# Helga, Runde 211: Hinweis «Abrechnungen fehlen» im Mietvertrag

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Gegenprobe 200 %), Maus. Nur geschaut, nichts gespeichert.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/helga-211/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag Thomas Weber, Hinweis | Für die Lücke 01.10.2025 – 31.12.2025 gibt es keine Schaltfläche zum Abrechnen, nur «Rechnungen 2025 ansehen». Der Text sagt «Jede Schaltfläche öffnet den Assistenten», sagt aber nicht, was ich für die drei Monate tun soll (Periode im Assistenten selbst eintippen?). |
| P-2 | Major | Mietvertrag Thomas Weber → «Rechnungen 2025 ansehen» | Die Liste filtert nach dem Jahr des Rechnungsdatums. Die Rechnung «Fernwärme Q4 2025» (Leistungszeitraum 01.10.–31.12.2025, Rechnungsdatum 20.01.2026), also genau die Lücke, fehlt. Dafür steht «Fernwärme Q4 2024» drin. Ich würde glauben, alle Rechnungen für die Lücke seien erfasst. |
| P-3 | Minor | Mietvertrag Thomas Weber, Hinweis | Die Überschrift sagt «3 Abrechnungen fehlen». Im Text steht aber «Eine bestehende Abrechnung deckt nur einen Teil … ab». Ich verstehe nicht, ob 2025 nun fehlt oder schon gemacht ist. |
| P-4 | Minor | Mietvertrag Weber und Müller, Schaltflächen im Hinweis | Die Links laufen als Fliesstext durch. Bei 150 % und 200 % steht «Rechnungen 2025 ansehen» neben «2023 abrechnen» und «Rechnungen 2022 ansehen» neben «2021 abrechnen». Was zusammengehört, sehe ich nicht. |
| P-5 | Minor | Mietvertrag Hans Müller → «Rechnungen 2023 ansehen» | Die leere Liste sagt «Keine Rechnungen gefunden. Versuchen Sie es mit anderen Filtern.» Der Hinweis hat mir aber gesagt, ich soll zuerst die Rechnungen erfassen. Die Liste schickt mich zu den Filtern statt zu «Rechnung erfassen». |
| P-6 | Nit | Mietvertrag Thomas Weber, Hinweis | Der Satz zu «Abgerechnet bis» (bei Müller vorhanden) fehlt bei Weber. Wenn ich die drei Monate auf Papier abgerechnet hätte, wüsste ich hier nicht, wo ich das eintrage. |

## Beobachtungen

- Die Mietvertragsliste zeigt bei Weber «Abrechnung fehlt seit 01.04.2022». Das «seit» gehört zum Vertragsbeginn, liest sich aber so, als fehle seit 2022 jede Abrechnung.
- Abrechnungsliste des Vertrags Weber: «01.01.2025 – 31.12.2025, 365 Mietstage». Die Detailseite derselben Abrechnung NK-22222222-2025-0001: «Abrechnungsperiode 01.01.2025 – 30.09.2025», die Tabelle zeigt aber «365/365 Tage» und enthält die Q4-Rechnungen. Das sieht nach den von Hand vorbereiteten Testdaten aus, als Dr. Weber würde ich aber stutzen. Darum ohne Schwere.
- Die Detailseite dieser Abrechnung zeigt: «Seit dem Erstellen dieses Entwurfs wurden 15 Rechnungen … geändert. Löschen Sie ihn und erstellen Sie die Abrechnung erneut.» Das ist ein anderer Weg als «Lücke abrechnen». Was ich tun soll, ist für mich nicht eindeutig.
- «2023 abrechnen» springt im Assistenten direkt zu Schritt 3 (Periode und Gebäude sind schon gewählt). Das ist praktisch, aber der Hilfetext zum Heizprofil ist dort eine Textwand.
- Im Assistenten kam nach «Weiter» in Schritt 1 die Meldung «Entwurf gespeichert, 10:41», obwohl ich nichts erstellen wollte. Gemeint ist vermutlich nur der Zwischenstand des Assistenten. Ich habe danach nichts mehr angeklickt.
- Bei 150 % und 200 % ist alles gut lesbar, nichts muss seitlich gescrollt werden, die Schaltflächen sind gross genug.

## Aufgabe geschafft: teilweise

Welche Tage fehlen, habe ich verstanden (01.10.–31.12.2025). Was ich dafür tun soll, sagt mir die Seite nicht. Nur durch Ausprobieren habe ich gefunden, dass ich im Assistenten die Periode selbst auf 01.10.2025 – 31.12.2025 setzen kann. Bei Müller sind Hinweis und Weg klar, bis auf die leere Rechnungsliste.

## Aufwand

Etwa 15 Minuten und 9 Seitenaufrufe: Übersicht, Menü, Mietverträge, Vertrag Weber, Abrechnungen Weber, Abrechnung 2025, Rechnungen 2025, Assistent, Vertrag Müller, Rechnungen 2023, Bearbeiten Müller.

## Ablauf

1. **Übersicht.** Erwartet: etwas zu Weber. Gesehen: «Noch nicht abgerechnet: … Seepark Residenz (01.10.2025 – 31.12.2025, 2023, 2022, 2021)». Gut: Die Lücke steht mit Daten da.
2. **Menü → Mietverträge → Thomas Weber.** Erwartet: ein klarer Hinweis. Gesehen: ein gelber Kasten «3 Abrechnungen fehlen», zwei Absätze und dann fünf Links und Schaltflächen durcheinander.
3. **Den Satz zur Teil-Abrechnung lesen.** Erwartet: was fehlt und was ich tun soll. Gesehen: «für 01.10.2025 – 31.12.2025 gibt es noch keine Abrechnung». Die Tage verstehe ich. Ich suche eine Schaltfläche «Oktober bis Dezember 2025 abrechnen» und finde nur «Rechnungen 2025 ansehen» (P-1).
4. **«Rechnungen 2025 ansehen».** Erwartet: die Rechnungen für Oktober bis Dezember 2025. Gesehen: 15 Rechnungen nach Rechnungsdatum, darunter «Fernwärme Q4 2024» (Rechnungsdatum 20.01.2025). «Fernwärme Q4 2025» fehlt. Erst auf der Detailseite dieser Rechnung habe ich gesehen, dass sie das Datum 20.01.2026 trägt (P-2).
5. **Vertrag → «Nebenkostenabrechnungen».** Gesehen: 2025 als Entwurf, 2024 bezahlt. Die Liste nennt «01.01.2025 – 31.12.2025», die Detailseite «01.01.2025 – 30.09.2025» (Beobachtung).
6. **«Abrechnungen erstellen», Periode 01.10.2025 – 31.12.2025 eingetippt, «Weiter».** Erwartet: dass das geht. Gesehen: Schritt 2, Seepark Residenz «3 Rechnungen in der Abrechnungsperiode». Es geht also. Ich habe abgebrochen, nichts erstellt.
7. **Vertrag Hans Müller.** Erwartet: derselbe Kasten. Gesehen: «3 Abrechnungen fehlen», 2023, 2022 und 2021 je mit «abrechnen» und «Rechnungen … ansehen», dazu der Satz «Haben Sie eine dieser Perioden ausserhalb von Dwello abgerechnet? Tragen Sie beim Bearbeiten des Mietvertrags «Abgerechnet bis» ein.» Das ist klar.
8. **«Rechnungen 2023 ansehen».** Erwartet: die Rechnungen 2023. Gesehen: «Keine Rechnungen gefunden. Versuchen Sie es mit anderen Filtern.» (P-5)
9. **«2023 abrechnen».** Gesehen: Der Assistent öffnet bei Schritt 3, gewählt sind «Musterhaus Zentrum, 01.01.2023 – 31.12.2023». Der Weg ist klar.
10. **«Bearbeiten» bei Müller.** Gesehen: Das Feld «Abgerechnet bis (optional)» mit langem, aber verständlichem Hilfetext und Beispiel. Nicht gespeichert.

## Verwirrung

- «Mietstage»: Ich verstehe es als «Tage, an denen er Mieter war». Das passt.
- «Abrechnungsperiode» und «Rechnungen 2025»: Ich dachte, beides meint dasselbe Jahr. Die Rechnungsliste meint aber das Rechnungsdatum (die kleine Hilfe «Jahr des Rechnungsdatums» steht beim Filter, nicht im Hinweis).
- «3 Abrechnungen fehlen», obwohl eine davon schon zum Teil da ist.
- «Jede Schaltfläche öffnet den Assistenten …», aber für 2025 gibt es keine Schaltfläche.
- «Entwurf gespeichert» im Assistenten, obwohl ich nichts erstellt habe.

## Fehlerrisiken

- Ich prüfe über «Rechnungen 2025 ansehen», ob alles erfasst ist, übersehe die Heizrechnung Q4 2025 und erfasse sie doppelt, weil ich sie nicht finde. Oder ich rechne die Lücke ohne sie ab (P-2).
- Ich erstelle 2025 nochmals für das ganze Jahr statt nur für die Lücke, weil kein Weg für «nur Oktober bis Dezember» angeboten wird (P-1).
- Ich klicke wegen der Anordnung den falschen Knopf (P-4).

## Vorschläge

- **P-1.** Nachstellen: Mietvertrag Thomas Weber öffnen und den Hinweis lesen. Neben «Rechnungen 2025 ansehen» fehlt eine Schaltfläche. Hilfreich wäre «01.10.2025 – 31.12.2025 abrechnen», die den Assistenten mit genau dieser Periode öffnet. Oder ein Satz: «Geben Sie im Assistenten als Abrechnungsperiode 01.10.2025 – 31.12.2025 ein.»
- **P-2.** Nachstellen: Vertrag Weber → «Rechnungen 2025 ansehen». «Fernwärme Q4 2025» (Rechnungsdatum 20.01.2026) fehlt, «Fernwärme Q4 2024» erscheint. Hilfreich: Der Link filtert nach Leistungszeitraum in der fehlenden Periode statt nach Rechnungsjahr, oder der Link sagt deutlich «Rechnungen mit Rechnungsdatum 2025».
- **P-3.** Nachstellen: Vertrag Weber, Überschrift neben dem Teil-Satz. Hilfreich: eine eigene Zeile «2025: nur bis 30.09.2025 abgerechnet, es fehlen 01.10.2025 – 31.12.2025» statt eines Satzes zwischen allgemeinem Text.
- **P-4.** Nachstellen: Vertrag Weber oder Müller bei 150 % oder 200 % Zoom. Hilfreich: je Periode eine eigene Zeile mit dem Jahr vorne, dann «abrechnen» und «Rechnungen ansehen» nebeneinander.
- **P-5.** Nachstellen: Vertrag Müller → «Rechnungen 2023 ansehen». Hilfreich: Ist die Liste leer, weil ein Jahr gefiltert ist, steht dort «Für 2023 sind keine Rechnungen erfasst» mit der Schaltfläche «Rechnung erfassen».
- **P-6.** Nachstellen: Vertrag Weber, im Hinweis fehlt der Satz zu «Abgerechnet bis». Hilfreich: denselben Satz wie bei Müller zeigen, falls er hier auch gilt. Sonst ein Satz, was gilt, wenn ich die drei Monate ausserhalb von Dwello abgerechnet habe.

## Nicht geprüft

- Abrechnung der Lücke wirklich erstellen und «Abgerechnet bis» speichern: Ich sollte nur schauen.
- Mobile Ansicht, Tastatur und andere Sprachen: nicht Helgas Profil.
- Ob die Abrechnung 2025 von Weber tatsächlich nur bis 30.09.2025 gerechnet ist: Liste und Detail widersprechen sich, die Beträge habe ich nicht nachgerechnet (Sache von Dr. Weber und daten-pruefer).
