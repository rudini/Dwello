# Persona Marco – Issue #222 (Hinweise zu abgezogenen Akonto-Beträgen)

Marco, 38, auf dem Smartphone (390 × 844, Touch), wenig Zeit. Gebäude «Alpenblick», gespeichert habe ich nur die eine Rechnung «Werke Schlussrechnung 2025». Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/marco-222/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen hochladen, Karte «Werke Schlussrechnung 2025.pdf» | Der Hinweis ist auf dem Handy 13 Zeilen lang, in einer schmalen Spalte (rund 234 px, links frei für das Warnsymbol). Drei Fälle stecken in einem Absatz. «erfasst oder hier ausgewählt» gehört zu «löschen oder entfernen», das muss man über Kreuz zuordnen. Ich musste ihn zweimal lesen. |
| P-2 | Minor | Rechnungen hochladen, Karte «Werke …» | «… ziehen Sie ihren Betrag vom Total ab.» Das Feld «Betrag» ist an dieser Stelle zugeklappt (zuerst «Angaben prüfen» antippen) und steht rund 20 Felder weiter unten. Der Hinweis sagt nicht, wo ich den Betrag ändere. |
| P-3 | Minor | Beide Hinweise | «Ist eine davon schon abgerechnet»: Woran sehe ich das? Die Rechnungsliste zeigt nicht, ob eine Rechnung eine Akontorechnung ist oder schon abgerechnet wurde, und kein Hinweis führt mich dorthin. Ich musste selbst filtern (Alpenblick + Allgemeinstrom) und raten. |
| P-4 | Minor | Rechnung (Detail), «Hinweise zum Beleg» | «Prüfen Sie, dass sie nur einmal zählen: Der Betrag ist das Total vor dem Abzug, und die Akontorechnungen sind nicht zusätzlich erfasst. Ist eine davon schon abgerechnet, bleibt sie erfasst, und ihr Betrag ist vom Total abgezogen.» Der Hinweis beschreibt nur, wie es richtig wäre. Er sagt nicht, was ich tun soll, wenn es nicht so ist (Rechnung bearbeiten? Akontorechnung löschen?). Den letzten Satz habe ich zuerst so gelesen, als hätte Dwello das schon gemacht. |
| P-5 | Nit | Beide Hinweise | Dieselbe Sache heisst einmal «Rechnung» und einmal «Beleg» («Auf der Rechnung sind …» beim Hochladen, «Auf dem Beleg sind …» im Detail). Dazu kommt «bereits bezahlte Beträge» neben «Akontorechnungen». Dass beides dasselbe meint, muss ich selbst zusammenbringen. |

Kein Querscrollen: Auf beiden Seiten ist die Seite 390 px breit (scrollWidth = clientWidth = 390). Beide Hinweise passen in die Breite, die Schrift ist 16 px gross und gut lesbar.

## Beobachtungen

- Die KI-Attrappe schlägt als Rechnungssteller den Dateinamen vor («Werke Schlussrechnung 2025») und für eine «Schlussrechnung 2025» das Rechnungsdatum 31.03.2026 mit dem Leistungszeitraum 01.01.–31.03.2026. Das passt nicht zum Namen, kommt aber von der Attrappe.
- Im selben gelben Kasten stehen beim Hochladen auch «Wählen Sie eine Kategorie.», «Prüfen Sie: Rechnungsdatum.» und «Ergänzen Sie …: Fälligkeitsdatum.». Neben dem langen Akonto-Absatz gehen diese kurzen Aufgaben fast unter.
- Der Knopf heisst zuerst «1 Rechnung erstellen (1 unvollständig)», nach dem Wählen der Kategorie und dem Abwählen von Elektro Blitz «1 Rechnung erstellen». Das ist verständlich.
- Nach dem Erstellen bleibt der Dialog offen und zeigt «1 Rechnung erstellt» mit einem Link auf die neue Rechnung. Die abgewählte Elektro-Blitz-Datei bleibt stehen. Das ist gut.
- Im Feld «Rechnungsdatum» steht «Die KI ist unsicher. Bitte prüfen Sie den Wert.» und darunter ein leerer Absatz (im Accessibility-Tree als leerer `paragraph` zu sehen).

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten, 12 Schritte: Menü → Rechnungen → Rechnungen hochladen → Gebäude wählen → Dateien wählen → Hinweis lesen → Liste nach Akontorechnungen durchsuchen (eigener Ausflug) → Angaben prüfen → Kategorie → Elektro Blitz abwählen → erstellen → Rechnung öffnen → Hinweis lesen.

## Ablauf

1. **Menü → «Rechnungen».** Erwartet: die Liste. Gesehen: «Rechnungen» mit 83 Einträgen, oben «Rechnungen hochladen». Passt.
2. **«Rechnungen hochladen».** Erwartet: Dateiauswahl. Gesehen: ein Dialog. Erst muss ich das Gebäude wählen, vorher ist der Dateiknopf gesperrt («Wählen Sie zuerst das Gebäude.»). Ich wähle «Alpenblick – Bergstrasse 8, 3800 Interlaken».
3. **Beide PDFs auswählen.** Nach etwa 4,5 Sekunden: «2 von 2 Dateien gelesen. Bitte prüfen: 2.»
4. **Hinweis auf der Werke-Karte.** Erwartet: ein kurzer Satz wie «Achtung, Akonto abgezogen». Gesehen (Screenshot `06-hint-viewport.png`): gelber Kasten «Hinweise zu Werke Schlussrechnung 2025.pdf» mit dem Text: «Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Vorgeschlagen ist das Total vor dem Abzug. Haben Sie die Akontorechnungen schon erfasst oder hier ausgewählt, löschen oder entfernen Sie sie, sonst zählen sie doppelt. Ist eine davon schon abgerechnet, löschen Sie sie nicht, sondern ziehen Sie ihren Betrag vom Total ab.» Auf dem Bildschirm sind das 13 Zeilen. Es passt in die Breite und ich muss nicht seitlich scrollen. Die ersten zwei Sätze verstehe ich sofort. Ab «Haben Sie …» lese ich ein zweites Mal. Was ich tun muss, ist klar: Habe ich Akontorechnungen von den Werken erfasst, lösche ich sie. Nicht klar ist, wie ich das herausfinde (P-3) und wo ich den Betrag ändere (P-2).
5. **Nachsehen, ob Akontorechnungen da sind.** Ich filtere die Liste nach Alpenblick und Allgemeinstrom: 4 Rechnungen der BKW Energie AG aus 2024 und 2025, keine von den Werken für 2026. Ich nehme also an, dass nichts doppelt zählt, und lasse den vorgeschlagenen Betrag.
6. **«Angaben prüfen», Kategorie «Allgemeinstrom».** Erwartet: die Felder. Gesehen: Vorschau, Betrag 1250.00, Kategorie leer. Ich wähle «Allgemeinstrom». Danach verschwindet «Wählen Sie eine Kategorie.» aus dem Kasten, der Akonto-Hinweis bleibt (richtig so).
7. **Elektro Blitz abwählen und «1 Rechnung erstellen».** Gesehen: «1 Rechnung erstellt» und der Link «Werke Schlussrechnung 2025, 31.03.2026».
8. **Rechnung öffnen.** Erwartet: Details mit dem Hinweis. Gesehen: Betrag CHF 1’250.00, Kategorie Allgemeinstrom, unten im Abschnitt «Beleg» der Kasten «Hinweise zum Beleg» (Screenshot `12-hinweise-beleg.png`), 12 Zeilen, ohne Querscrollen: «Auf dem Beleg sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Prüfen Sie, dass sie nur einmal zählen: Der Betrag ist das Total vor dem Abzug, und die Akontorechnungen sind nicht zusätzlich erfasst. Ist eine davon schon abgerechnet, bleibt sie erfasst, und ihr Betrag ist vom Total abgezogen.» Ich verstehe, dass ich das prüfen soll. Was ich tun soll, wenn etwas nicht stimmt, steht nicht da (P-4). Der Hinweis steht ganz unten beim Beleg und nicht beim Betrag, den er betrifft. Ich habe ihn nur gefunden, weil ich danach gesucht habe.

## Verwirrung

- «abgerechnet»: Heisst das «in einer Nebenkostenabrechnung verwendet» oder «bezahlt»? Neben «bereits bezahlte Beträge» liegt beides nahe.
- «Akontorechnungen» und «bereits bezahlte Beträge»: zwei Begriffe für dieselbe Sache.
- «löschen oder entfernen»: Den Unterschied (erfasste Rechnung löschen, Datei aus dem Upload entfernen) verstehe ich erst beim zweiten Lesen.
- Im Detail: Ist «bleibt sie erfasst, und ihr Betrag ist vom Total abgezogen» eine Anweisung oder eine Feststellung?

## Fehlerrisiken

- Unterwegs lese ich den langen Absatz nicht zu Ende und erstelle die Rechnung mit 1’250.00, obwohl schon Akontorechnungen erfasst sind. Dann zählen die Kosten in der Abrechnung doppelt.
- Ich lösche eine Akontorechnung, die schon abgerechnet ist, weil ich den letzten Satz überlesen habe.
- Im Detail fällt der Hinweis unten beim Beleg nicht auf, wer nur den Betrag oben anschaut.

## Vorschläge

- **P-1:** Hochladen → Alpenblick → «Werke Schlussrechnung 2025.pdf» wählen, Hinweis auf 390 px lesen. Hilfreich wären eine kurze erste Zeile («CHF 1’000.00 schon bezahlt – Total vor Abzug vorgeschlagen») und danach die Fälle als kurze Liste: «Akontorechnung schon erfasst: löschen.» / «Hier mit ausgewählt: entfernen.» / «Schon abgerechnet: nicht löschen, Betrag hier um ihren Betrag kürzen.»
- **P-2:** Gleiche Schritte, Feld «Betrag» suchen. Hilfreich: «… und kürzen Sie den Betrag unter «Angaben prüfen».» Oder der Hinweis steht auch direkt beim Feld «Betrag».
- **P-3:** Gleiche Schritte, danach versuchen herauszufinden, ob es schon abgerechnete Akontorechnungen gibt. Hilfreich: ein Link «Rechnungen dieses Gebäudes ansehen» oder ein Satz, wo man das sieht (zum Beispiel an der Abrechnung).
- **P-4:** Rechnung «Werke Schlussrechnung 2025» öffnen, nach unten zu «Hinweise zum Beleg» scrollen. Hilfreich: eine Anweisung für den Fehlerfall, zum Beispiel «Sind die Akontorechnungen auch erfasst, löschen Sie sie oder ändern Sie den Betrag mit «Rechnung bearbeiten».» Den Hinweis eventuell beim Betrag zeigen.
- **P-5:** Beide Hinweise vergleichen. Hilfreich: in beiden dasselbe Wort, dazu einmal «bereits bezahlte Beträge (Akontozahlungen)».

## Nicht geprüft

- Den Fall, dass Akontorechnungen schon erfasst oder abgerechnet sind: In Alpenblick gab es keine passenden, und ich habe keine erfunden, weil das nicht zur Aufgabe gehört.
- Elektro Blitz AG habe ich nicht erstellt (die Aufgabe nennt nur die Werke-Rechnung). Die Datei hatte keinen Akonto-Hinweis.
- Dark Mode und Querformat.
