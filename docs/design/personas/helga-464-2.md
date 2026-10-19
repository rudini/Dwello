# Helga – Akonto ab einem Datum ändern (#464), zweiter Durchgang

Persona: Helga, 68, Desktop 1440 × 900 mit 150 % Zoom, Maus. App: Persona-Stack http://localhost:3300, Deutsch, frische Demodaten. Gespeichert habe ich nur in «Seepark Residenz» (Mietvertrag Thomas Weber, Wohnung A1). Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/helga-464-2/`.

Am Ende steht der Mietvertrag wieder wie am Anfang: Akonto CHF 200.00, kein späteres Akonto. Gespeichert wurden das Akonto von CHF 220 ab 01.01.2027, einmal das Formular ohne Änderung und das Löschen des Akontos von CHF 220.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag bearbeiten | Öffne ich «Bearbeiten», nachdem ich CHF 220 ab 01.01.2027 gespeichert habe, steht im Formular wieder «Akonto pro Monat 200.00» und «Gültig ab 01.11.2026». Vom gespeicherten Akonto von CHF 220 sieht man hier nichts. Ich hätte gedacht, mein Eintrag sei verloren, und hätte ihn noch einmal eingetragen. Die Hilfe bei «Gültig ab» verweist auf «Akonto nach Zeitraum», aber diese Liste gibt es nur auf der Seite des Mietvertrags, nicht im Formular. |
| P-2 | Major | Mietvertrag bearbeiten, Fehlermeldung | Für ein tieferes Akonto ab 01.07.2025 sagt Dwello: «Das Akonto ab 01.07.2025 ändert den Entwurf NK-22222222-2025-0001. Löschen Sie zuerst den Entwurf, oder wählen Sie ein späteres «Gültig ab».» Ich weiss nicht, was dieser Entwurf ist und wo ich ihn finde: Die Nummer ist kein Link, und es steht nicht da, dass es eine Nebenkostenabrechnung ist. «Ein späteres «Gültig ab»» sagt nicht, welcher Tag frühestens geht. Und es steht nicht da, was mit dem Akonto von CHF 220 ab 2027 passieren würde, wenn ich jetzt ein tieferes ab 2025 eintrage. |
| P-3 | Minor | Mietvertrag bearbeiten, «Gültig ab» | Die Hilfe sagt «der Erste eines Monats», das Beispiel daneben heisst aber «31.12.2026». Habe ich genau dieses Beispiel eingetragen, kam: «Ein neues Akonto gilt ab dem Ersten eines Monats. Tragen Sie bei «Gültig ab» zum Beispiel 01.01.2027 ein.» Die Meldung ist gut, aber das Beispiel hat mich erst in den Fehler geführt. |
| P-4 | Minor | Mietvertrag ansehen | Nach «Akonto löschen» kommt keine Bestätigung. Die Liste «Akonto nach Zeitraum» verschwindet einfach. Beim Speichern kam «Mietvertrag von Thomas Weber gespeichert», beim Löschen nichts. Ich war nicht sicher, ob es geklappt hat, bis ich nachgeschaut habe. |
| P-5 | Minor | Mietvertrag ansehen | Oben bei «Miete pro Monat» steht nach dem Speichern weiterhin nur «Akonto CHF 200.00» und «Monatlich total CHF 1’400.00». Dass das der Betrag von heute ist, merke ich erst an der Liste «Akonto nach Zeitraum» weiter unten. Ein Wort wie «heute» oder «zurzeit» würde mir helfen. |
| P-6 | Minor | Mietvertrag bearbeiten | Fehlermeldungen erscheinen nur ganz unten über den Knöpfen. Das Feld «Gültig ab», um das es geht, ist weder rot markiert noch steht der Fehler beim Feld. Bei 150 % liegt das Feld etwa zwei Bildschirmhöhen weiter oben. |

## Beobachtungen

- Der Fehler aus dem ersten Durchgang ist behoben: Speichern geht, und das Feld «Gültig ab» gibt es jetzt direkt unter dem Akonto, mit Kalenderknopf. Unter dem Datum steht der Wochentag ausgeschrieben («Freitag, 1. Januar 2027»). Das gefällt mir sehr, so sehe ich, dass ich das richtige Datum habe.
- «Gültig ab» ist schon mit 01.11.2026 ausgefüllt (der nächste Monatserste, «Sonntag, 1. November 2026»). Das ist praktisch, aber ich habe mich gefragt, ob Dwello beim Speichern auch ohne Änderung ein neues Akonto ab November anlegt. Ich habe es ausprobiert: Ohne Änderung bleibt alles wie vorher.
- Die Liste «Akonto nach Zeitraum» auf der Vertragsseite ist sehr verständlich: «CHF 200.00 vom 01.04.2022 bis 31.12.2026», «CHF 220.00 ab 01.01.2027», daneben rot «Akonto ab 01.01.2027 löschen». Genau so habe ich es mir gewünscht.
- Die Rückfrage beim Löschen ist klar: «Akonto ab 01.01.2027 löschen? Das Akonto von CHF 220.00 ab 01.01.2027 wird gelöscht. Ab dann gilt wieder das Akonto von CHF 200.00.» Knöpfe «Abbrechen» und «Akonto löschen». Ich wusste genau, was passiert.
- Die Hilfe beim Akonto ist immer noch sehr lang (neun Zeilen bei 150 %). «Kündigungstermin», «amtliches Formular» und «nichtig» machen mir weiter Angst. Dass Thomas Weber einverstanden ist, kommt nicht vor: Darf ich das dann einfach eintragen? Der Hinweis «Für eine Senkung genügt eine schriftliche Mitteilung» hat mir bei Schritt 3 aber geholfen.
- «Monatlich total» springt im Formular sofort auf CHF 1’420.00 (bei 180: CHF 1’380.00), ohne Datum. Ich würde meinen, das gelte ab heute.
- Die Meldung «Mietvertrag von Thomas Weber gespeichert» erscheint rechts oben und liegt bei 150 % über dem gelben Kasten «2 Abrechnungen fehlen», genau über «Rechnungen 2023 ansehen» und «Rechnungen 2022 ansehen» (Screenshot 05).
- Der gelbe Kasten «2 Abrechnungen fehlen» (2023, 2022) steht weiterhin oben. Mit meiner Aufgabe hat er nichts zu tun, verunsichert mich aber.

## Aufgabe geschafft: ja

Alle vier Schritte gingen: CHF 220 ab 01.01.2027 gespeichert, auf der Vertragsseite angesehen, ein tieferes Akonto ab 01.07.2025 versucht (abgelehnt, mit Begründung), CHF 220 wieder gelöscht.

## Aufwand

Etwa 12 Minuten und 9 Durchgänge: Vertragsseite, Bearbeiten, Speichern, Vertragsseite, erneut Bearbeiten mit 180 ab 01.07.2025, Meldung lesen, Gegenprobe ohne Änderung, Löschen mit Rückfrage, ein Versuch mit dem Beispieldatum 31.12.2026. Am längsten habe ich über der Meldung zum Entwurf gesessen.

## Ablauf

1. **Vertragsseite Thomas Weber.** Erwartet: Akonto CHF 200. Gesehen: «Akonto CHF 200.00», «Monatlich total CHF 1’400.00», Knöpfe «Bearbeiten», «Beenden», «Löschen». Klar.
2. **«Bearbeiten», Akonto und «Gültig ab».** Erwartet: ein Datumsfeld zum Akonto. Gesehen: «Akonto pro Monat (optional)» mit 200.00, darunter «Gültig ab» mit 01.11.2026 und der Hilfe «Tag, ab dem das neue Akonto gilt: der Erste eines Monats …» (Screenshot 04: Betrag 220, Datum 01.01.2027, darunter «Freitag, 1. Januar 2027»). Ich habe 220 und 01.01.2027 eingetippt. Klar, bis auf das Beispiel 31.12.2026 (P-3).
3. **«Änderungen speichern».** Erwartet: gespeichert, zurück auf die Vertragsseite. Gesehen: genau das, mit der Meldung «Mietvertrag von Thomas Weber gespeichert».
4. **Was die Vertragsseite zeigt.** Erwartet: dass ab 2027 CHF 220 gelten. Gesehen: oben weiter «Akonto CHF 200.00» (P-5), unten neu «Akonto nach Zeitraum» mit «CHF 200.00 vom 01.04.2022 bis 31.12.2026» und «CHF 220.00 ab 01.01.2027» und dem Knopf «Akonto ab 01.01.2027 löschen» (Screenshot 05). Die Liste verstehe ich sofort.
5. **Erneut «Bearbeiten», 180 ab 01.07.2025.** Erwartet: im Formular die 220 ab 2027 zu sehen. Gesehen: 200.00 und 01.11.2026, als hätte ich nie etwas gespeichert (P-1). Ich habe 180 und 01.07.2025 eingetragen und gespeichert.
6. **Meldung.** Erwartet: entweder gespeichert oder eine Erklärung. Gesehen: roter Kasten unten «Der Mietvertrag wurde nicht gespeichert. Das Akonto ab 01.07.2025 ändert den Entwurf NK-22222222-2025-0001. Löschen Sie zuerst den Entwurf, oder wählen Sie ein späteres «Gültig ab».» (Screenshot 09). Dass nichts gespeichert wurde, ist klar. Was der Entwurf ist, nicht (P-2).
   **Was ich tun würde:** Ich würde nichts löschen, was ich nicht kenne. Ich würde «Abbrechen» drücken und das tiefere Akonto nicht rückwirkend eintragen, sondern ab dem nächsten Monatsersten, oder meinen Sohn bzw. eine Fachperson fragen, was dieser Entwurf ist. Ein Akonto, das schon über ein Jahr zurückliegt, nachträglich zu senken, wäre mir ohnehin nicht geheuer.
7. **Gegenprobe: Formular ohne Änderung speichern.** Erwartet: nichts ändert sich. Gesehen: gespeichert, die Liste zeigt weiterhin CHF 220 ab 01.01.2027. Gut.
8. **«Akonto ab 01.01.2027 löschen».** Erwartet: eine Rückfrage. Gesehen: der Dialog mit dem Text oben, «Akonto löschen» bestätigt. Danach ist die Liste weg, oben steht «Akonto CHF 200.00». Eine Meldung, dass gelöscht wurde, kam nicht (P-4). Im Formular steht wieder 200.00 / 01.11.2026.
9. **Nebenbei: Beispieldatum 31.12.2026 bei «Gültig ab».** Abgelehnt mit «Ein neues Akonto gilt ab dem Ersten eines Monats. Tragen Sie bei «Gültig ab» zum Beispiel 01.01.2027 ein.» Nicht gespeichert.

## Verwirrung

- **«Entwurf NK-22222222-2025-0001»:** Ich weiss nicht, dass ein «Entwurf» eine noch nicht fertige Nebenkostenabrechnung ist, und die lange Nummer sagt mir nichts. Ob ich ihn löschen darf und was ich dabei verliere, steht nirgends.
- **«ein späteres «Gültig ab»»:** Wie viel später? Ein konkretes Datum wie bei der Meldung zum Monatsersten («zum Beispiel 01.01.2027») hätte mir geholfen.
- **Formular zeigt 200, nicht 220 (P-1):** Ich habe kurz gedacht, das Speichern habe doch wieder nicht geklappt.
- **«Akonto» oben auf der Vertragsseite:** Welches Akonto, das von heute oder das neue?
- **«Kündigungstermin», «amtliches Formular», «nichtig»:** wie im ersten Durchgang. Bei einer Erhöhung, mit der der Mieter einverstanden ist, weiss ich nicht, ob ich das Formular trotzdem brauche.
- **Beispiel 31.12.2026 bei «Gültig ab»:** widerspricht «der Erste eines Monats».

## Fehlerrisiken

- Weil das Formular die 220 ab 2027 nicht zeigt, würde ich sie womöglich ein zweites Mal eintragen oder, schlimmer, versuchen, «200» ab einem späteren Datum einzutragen, um «das Richtige» zu sehen, und so mein Akonto von 2027 überschreiben.
- Die Meldung zum Entwurf lädt dazu ein, «zuerst den Entwurf» zu löschen. Hätte ich ihn gefunden, hätte ich vielleicht eine angefangene Abrechnung gelöscht, nur um ein Akonto zu ändern.
- Ohne Bestätigung nach dem Löschen würde ich nochmals klicken oder an der Löschung zweifeln.
- «Monatlich total» ohne Datum: Ich würde dem Mieter vielleicht sagen, er zahle ab sofort CHF 1’420.

## Vorschläge

- **P-1:** CHF 220 ab 01.01.2027 speichern, dann «Bearbeiten» öffnen: Das Formular zeigt 200.00 / 01.11.2026. Im Formular beim Akonto die Liste «Akonto nach Zeitraum» oder wenigstens einen Satz zeigen wie «Ab 01.01.2027 gilt schon CHF 220.00 (eingetragen).»
- **P-2:** CHF 180 ab 01.07.2025 eintragen und speichern. Die Meldung soll sagen, dass es sich um den Entwurf einer Nebenkostenabrechnung handelt, die Nummer als Link zum Entwurf zeigen, den frühesten möglichen Tag nennen (wie «zum Beispiel 01.01.2027» bei der Meldung zum Monatsersten) und sagen, was mit einem schon eingetragenen späteren Akonto passiert.
- **P-3:** Bei «Gültig ab» das Beispiel durch einen Monatsersten ersetzen, etwa 01.01.2027.
- **P-4:** Nach «Akonto löschen» eine Meldung wie «Akonto ab 01.01.2027 gelöscht» zeigen, wie beim Speichern.
- **P-5:** Oben auf der Vertragsseite «Akonto (heute)» oder einen Hinweis «ab 01.01.2027: CHF 220.00» direkt beim Akonto.
- **P-6:** 31.12.2026 bei «Gültig ab» eintragen und speichern: Die Meldung steht nur unten. Das Feld markieren und den Text auch beim Feld zeigen, oder zum Feld springen.

## Nicht geprüft

- 200 % Zoom: In diesem Durchgang nur bei 150 % geprüft; wie die Liste «Akonto nach Zeitraum» und der Lösch-Knopf bei 200 % umbrechen, habe ich nicht gesehen.
- Den Entwurf NK-22222222-2025-0001 habe ich weder gesucht noch gelöscht: Er gehört nicht zu meiner Aufgabe, und ich hätte ihn als Helga nicht gelöscht.
- Wie eine Nebenkostenabrechnung 2027 das Akonto von CHF 220 abzieht: In der Zukunft, nicht prüfbar.
- Ein Akonto, das schon in einer fertigen (nicht mehr Entwurf) Abrechnung liegt: nicht versucht.
