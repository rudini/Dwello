# Helga – Fristen, Mahnfrist und Belegung (w4c)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. Sprache Deutsch, Demodaten des Persona-Stacks (http://localhost:3300). Gespeichert habe ich nur die Einstellungen (Mahnfrist 7 Tage). Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/1d798145-76bc-59e3-a308-cd244ffd6342/scratchpad/helga-w4c-fristen/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Übersicht, «Fristen» (vorher) | Die Zahlungsfrist von Hans Müller steht rot mit «seit 11 Tagen abgelaufen», aber unter «Als Nächstes zu tun» steht nichts dazu. Ich weiss nicht, ob ich jetzt etwas tun muss oder ab wann Dwello mir eine Mahnung vorschlägt. |
| P-2 | Minor | Einstellungen, «Mahnfrist (Tage)» und «Zahlungsfrist (Tage)» | Die erlaubten Werte (Mahnfrist 7 bis 60, Zahlungsfrist 7 bis 90 Tage) stehen nur in der Fehlermeldung, nicht im Hilfetext. Ich erfahre sie erst, wenn ich etwas Falsches eingebe. |
| P-3 | Minor | Einstellungen, Hilfetext «Mahnfrist (Tage)» | Der letzte Satz «Die nächste Mahnung schlägt die Übersicht nach der Zahlungsfrist der letzten Mahnung vor.» ist für mich unverständlich. Dass eine Mahnung eine eigene Zahlungsfrist hat, wird nirgends erklärt. Auch das Wort «Mahnfrist» habe ich zuerst als Frist verstanden, die in der Mahnung an den Mieter steht. |
| P-4 | Nit | Einstellungen, Fehlermeldung Mahnfrist | Bei «7,5» heisst es «Geben Sie für die Mahnfrist 7 bis 60 Tage ein.» 7,5 liegt aber zwischen 7 und 60. Dass nur ganze Tage gehen, sagt die Meldung nicht. |
| P-5 | Nit | Einstellungen, Hilfetext «Zahlungsfrist (Tage)» | «Anzahl Tage vom Versand bis zur Zahlungsfrist» erklärt die Zahlungsfrist mit dem Wort Zahlungsfrist. Klarer wäre etwa: «So viele Tage hat der Mieter nach dem Versand Zeit zum Bezahlen.» |

## Beobachtungen

- Nach dem Speichern erscheint oben «Überfällige Abrechnungen prüfen» als «Nächster Schritt». Der Text ist gut: «Prüfen Sie, ob das Geld eingegangen ist: Dann markieren Sie die Abrechnung als bezahlt, sonst können Sie eine Mahnung senden.» Der Name des Mieters steht aber nicht dabei, nur «1 Nebenkostenabrechnung».
- «Überfällige ansehen» führt zur gefilterten Liste mit Hans Müller. In der Zeile stehen nur «PDF» und «Als bezahlt markieren». «Mahnung senden» finde ich erst, wenn ich die Abrechnung öffne. Dabei hatte der Text mir genau das vorgeschlagen.
- Die Zeile unter «Fristen» sieht vor und nach dem Speichern gleich aus. Den Unterschied sehe ich nur oben unter «Als Nächstes zu tun».
- Die Zeile unter «Fristen» ist ein Link zur Abrechnung, dort gibt es «Mahnung senden». Das war schon vor dem Speichern so. Mahnen hätte ich also schon gekonnt, die Übersicht sagt es mir aber nicht.
- Die Speicherbestätigung «Einstellungen gespeichert – Absender, Verwaltungspauschale, Fristen und Vorschläge gespeichert.» ist klar. Nach dem Neuladen steht 7 im Feld.
- Fehlermeldungen: Das Feld wird rot umrandet, die Meldung steht direkt darunter mit Symbol, und der Cursor springt ins Feld. Das hat mir geholfen.
- «Vermietete Wohnungen pro Gebäude» habe ich sofort verstanden. «4/6 vermietet, Wohnung 2.02 leer, Wohnung 3.02 leer» nennt die leeren Wohnungen beim Namen. 4 + 3 + 2 = 9 stimmt mit «9 Vermietet» oben, und 4 leere mit «4 Leer». Der Satz «Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.» ist nützlich. Die Gebäudeseite sagt das Gleiche: «6, davon 4 vermietet und 2 leer».
- «4/6» mit Schrägstrich ist knapp; «4 von 6 vermietet» würde ich schneller lesen.
- In der Liste ist nur der Gebäudename ein Link, nicht die ganze Zeile.
- Darüber, in «Gebäude und Wohnungen», sind mir die Kacheln «Vermietet ab …» (0) und «Gesperrt» (0) unklar. Was «ab …» bedeutet, steht nirgends.
- «seit 11 Tagen abgelaufen» bei Frist 06.10.2026: Die Browseruhr zeigte 16.10. 23:18 UTC, in der Schweiz also schon der 17.10. Damit stimmt die Zahl.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 14 Schritte: Übersicht lesen, Fristzeile öffnen, Menü, Einstellungen, 6 ungültige Versuche (5 Mahnfrist, 1 Zahlungsfrist), 1 gültiges Speichern, Neuladen, Übersicht, «Überfällige ansehen», Belegung ansehen, ein Gebäude öffnen.

## Ablauf

1. **Übersicht öffnen.** Erwartet: ein Hinweis, dass Hans Müller nicht bezahlt hat, und was ich tun soll. Gesehen: Unter «Fristen» «06.10.2026 · Zahlungsfrist · Hans Müller · seit 11 Tagen abgelaufen» mit rotem Abzeichen. Oben stehen nur «Nebenkostenabrechnungen erstellen» (Alpenblick) und «Abrechnungen prüfen und versenden». Ob ich etwas tun muss, bleibt offen (P-1). Bildschirmfoto `01-uebersicht.png`.
2. **Fristzeile anklicken.** Erwartet: die Abrechnung. Gesehen: Abrechnung NK-11111111-2025-0001, Status «Überfällig», Knöpfe «Mahnung senden» und «Als bezahlt markieren». Nichts gespeichert.
3. **Menü → Einstellungen.** Erwartet: ein Feld, wann gemahnt wird. Gesehen: Abschnitt «Fristen» mit «Zahlungsfrist (Tage)» = 30 und «Mahnfrist (Tage)» = 14 samt Hilfetexten. Aus dem Hilfetext verstehe ich: Nach 14 Tagen schlägt die Übersicht eine Mahnung vor. Deshalb habe ich bei 11 Tagen noch nichts gesehen. Diese Erklärung hätte ich aber schon in der Übersicht gebraucht. Bildschirmfoto `04-einstellungen.png`.
4. **Ungültige Werte bei der Mahnfrist.** Ausprobiert: «-7», «0», «eine Woche», «7,5», «400». Erwartet: eine verständliche Meldung. Gesehen: jedes Mal «Geben Sie für die Mahnfrist 7 bis 60 Tage ein.», rot unter dem Feld, Cursor im Feld. Der Bereich war mir vorher nicht bekannt (P-2). Bei «7,5» passt die Meldung nicht ganz (P-4). Bildschirmfoto `05-ungueltig-4.png` zeigt das rot umrandete Feld mit «7,5» und der Meldung.
5. **Ungültige Zahlungsfrist «0».** Gesehen: «Geben Sie für die Zahlungsfrist 7 bis 90 Tage ein.»
6. **Mahnfrist 7 speichern.** Erwartet: eine Bestätigung. Gesehen: «Einstellungen gespeichert». Nach dem Neuladen steht Mahnfrist 7, die Zahlungsfrist bleibt 30. Bildschirmfoto `06-gespeichert.png`.
7. **Übersicht nachher.** Erwartet: jetzt ein Mahnungsvorschlag. Gesehen: neuer «Nächster Schritt» «Überfällige Abrechnungen prüfen» mit der Erklärung zu «bezahlt markieren» oder «Mahnung senden». Die Fristzeile ist unverändert. Bildschirmfoto `07-uebersicht-nachher.png`.
8. **«Überfällige ansehen».** Gesehen: Liste «1 Abrechnung», Hans Müller, CHF 215.80, «Überfällig», aber ohne «Mahnung senden» in der Zeile. Bildschirmfoto `08-ueberfaellige.png`.
9. **Vermietete Wohnungen pro Gebäude.** Erwartet: wie viele Wohnungen vermietet sind. Gesehen: drei Zeilen mit «x/y vermietet» und den leeren Wohnungen beim Namen. Verstanden. Bildschirmfoto `09-belegung.png`. Ein Klick auf «Musterhaus Zentrum» öffnet das Gebäude mit «6, davon 4 vermietet und 2 leer».

## Verwirrung

- «Mahnfrist»: Ich dachte zuerst an die Frist in der Mahnung an den Mieter, nicht an meine Wartezeit, bis Dwello mich erinnert.
- «Zahlungsfrist der letzten Mahnung»: Diesen Begriff kenne ich nicht.
- «Vorgabe: 14 Tage»: Ich verstehe das als ursprünglichen Wert, aber «Vorgabe» klingt nach Vorschrift.
- «Vermietet ab …» und «Gesperrt» in der Kachelreihe.
- Die rote Fristzeile ohne Anweisung: Ich weiss nicht, ob ich jetzt handeln muss.

## Fehlerrisiken

- Eine Vermieterin, die wie ich «Mahnfrist» als Frist in der Mahnung versteht, stellt etwa 30 ein und wird dann viel später erinnert, als sie denkt.
- Wer die rote Fristzeile sieht, aber oben keinen Schritt findet, mahnt vielleicht vorschnell oder gar nicht. Die Übersicht sagt nicht, ab wann der Vorschlag kommt.
- Wer in der Liste «Überfällige» nur «Als bezahlt markieren» sieht, klickt das vielleicht aus Versehen, statt die Abrechnung zu öffnen und zu mahnen.

## Vorschläge

- **P-1:** Übersicht mit Mahnfrist 14 öffnen, Zahlungsfrist vor 11 Tagen abgelaufen. Hilfreich wäre ein Satz bei der Fristzeile oder unter «Als Nächstes zu tun», z. B. «Überfällig. Dwello schlägt am 20.10.2026 eine Mahnung vor; mahnen können Sie schon jetzt.»
- **P-2:** Einstellungen → «Mahnfrist (Tage)». Den Bereich in den Hilfetext aufnehmen: «Erlaubt: 7 bis 60 Tage. Vorgabe: 14 Tage.» Bei der Zahlungsfrist ebenso mit 7 bis 90.
- **P-3:** Einstellungen → Hilfetext «Mahnfrist (Tage)». Mit einem Satz beginnen, der ohne Fachwort auskommt: «So viele Tage nach Ablauf der Zahlungsfrist erinnert Sie die Übersicht daran, eine Mahnung zu senden.» Den Satz über die nächste Mahnung erklären, z. B. «Jede Mahnung hat wieder eine eigene Frist; nach deren Ablauf erinnert Sie die Übersicht erneut.»
- **P-4:** Einstellungen → Mahnfrist «7,5» → «Einstellungen speichern». Die Meldung sollte «ganze Tage» nennen: «Geben Sie für die Mahnfrist eine ganze Zahl von 7 bis 60 Tagen ein.»
- **P-5:** Einstellungen → Hilfetext «Zahlungsfrist (Tage)». Die Erklärung sollte ohne das Wort Zahlungsfrist auskommen, z. B. «So viele Tage hat der Mieter nach dem Versand der Abrechnung Zeit zum Bezahlen.»

## Nicht geprüft

- Mahnfrist 7 bis 13 Tage mit einer Abrechnung, die weniger als 7 Tage überfällig ist: Dazu gab es in den Demodaten keinen Fall.
- Eine Mahnung tatsächlich senden: nicht Teil der Aufgabe, und gespeichert werden durften nur die Einstellungen.
- Ansicht bei 200 % Zoom und die Werte an den Grenzen 7, 60 und 90 im Einzelnen. Nur 7 wurde gespeichert, 0, 400 und andere wurden abgelehnt.
- Ziel der Kachel «Vermietet ab …»: Mein Klick blieb auf der Übersicht. Ob es dort ein Ziel gibt, konnte ich nicht klären.
