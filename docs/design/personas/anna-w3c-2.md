# Anna, 29: Was ist vor dem Versand der Abrechnung 2025 von Sarah Meier zu tun? (Runde w3c-2)

Persona: Anna, Desktop 1440 × 900, Maus; die Abrechnung zusätzlich auf dem Handy 390 × 844 angesehen.
App: Persona-Stack auf http://localhost:3300. Nur angesehen, nichts gespeichert, nichts versendet (Versand-Dialog geöffnet und mit «Abbrechen» geschlossen).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/9763c2a5-bde2-588e-97c1-9dbf2545f8c8/scratchpad/anna-w3c-2/`

Bezug: P-2 aus `anna-w3c.md` (auf der Abrechnung fehlte ein Hinweis auf den Auszug und die fehlende Adresse). **P-2 ist behoben:** Der Hinweis steht jetzt auf der Abrechnung und im Versand-Dialog.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung NK-22222222-2025-0002 (Entwurf), Versand-Dialog | Der gelbe Hinweis steht unter der Hauptschaltfläche «Als versendet markieren», und diese bleibt aktiv. Im Dialog steht «Per Brief, Seeweg 15, 6003 Luzern» (die Adresse der Wohnung, aus der sie ausgezogen ist), direkt darunter die Warnung, und «Als versendet markieren» lässt sich trotzdem bestätigen. Wer die Warnung überliest, schickt den Brief an die leere Wohnung. |
| P-2 | Nit | Abrechnung, Hinweis | «Die Adresse ist noch die der Wohnung» sagt nicht, *welche* Adresse und wozu. Auf dem Mietvertrag stand in der letzten Runde «Dorthin geht die Nebenkostenabrechnung». Dieser Satz hätte mir hier sofort gesagt, warum ich vor dem Versand handeln muss. |
| P-3 | Minor | «Mieter bearbeiten», geöffnet über «Neue Adresse eintragen» der Abrechnung | Das Formular führt nicht zurück zur Abrechnung: Der Brotkrümelpfad lautet «Mieter › Sarah Meier», und «Abbrechen» führt zum Mieter. Ich komme von der Abrechnung und will nach dem Eintragen dorthin zurück, um sie zu versenden. Was nach dem Speichern kommt, habe ich nicht geprüft (nichts gespeichert); in der letzten Runde endete das Speichern auf dem Mieter-Detail ohne Weg zur Abrechnung (dort P-3). |

## Beobachtungen

- Der Hinweis ist auf dem Desktop ohne Scrollen sichtbar: gelber Kasten mit Warnsymbol direkt unter «Status: Entwurf», fett: «Sarah Meier ist ausgezogen. Die Adresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein.», darunter der Link «Neue Adresse eintragen» (Screenshot `04-abrechnung-desktop-oben.png`). Er ist nicht nur farbig, sondern hat auch ein Symbol und einen klaren Text.
- Auf dem Handy (390 px) steht derselbe Kasten im ersten Bildschirm unter den beiden Schaltflächen, ohne seitliches Scrollen (`04-abrechnung-mobile-oben.png`).
- Im Dialog «Abrechnung als versendet markieren» steht dieselbe Warnung mit Link noch einmal, direkt unter Empfänger und Korrespondenzkanal (`05-dialog.png`). Das ist eine gute zweite Chance.
- Der Link führt direkt zu «Mieter bearbeiten» mit dem Bereich «Korrespondenzadresse» und dem Hilfetext «Hierhin gehen Abrechnungen und Mahnungen; nach dem Auszug die neue Adresse eintragen» (`06-mieter-bearbeiten.png`). Dort habe ich verstanden, wozu die Adresse dient.
- Die Übersicht zeigt weiterhin die Karte «Neue Adresse eintragen». Über «Entwürfe ansehen» sieht man in der Liste bei Sarah Meier aber noch keinen Hinweis (nur «Entwurf»).
- Das PDF zeigt jetzt dieselbe Adresse wie der Dialog: «Sarah Meier, Seeweg 15, 6003 Luzern». In der letzten Runde stand dort eine dritte Adresse (Hirschmattstrasse 21). Ob das PDF nach dem Eintragen einer neuen Adresse mitzieht (P-1 der letzten Runde), konnte ich ohne Speichern nicht prüfen.
- Kopf der Abrechnung: «Abrechnungsperiode 01.01.2025 – 31.12.2025», obwohl sie am 30.06.2025 ausgezogen ist. Die Liste zeigt «01.01.2025 – 30.06.2025, 181 Mietstage», das PDF erklärt «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 30.06.2025». Auf der Seite selbst habe ich kurz gestutzt.
- «Mieter und Wohnung» zeigt weiterhin nur die E-Mail und «Seeweg 15» unter der Wohnung, nicht die Korrespondenzadresse.

## Aufgabe geschafft: ja

Die Seite sagt mir klar, dass vor dem Versand die neue Adresse fehlt, und der Link «Neue Adresse eintragen» bringt mich mit einem Klick ins richtige Formular.

## Aufwand

Etwa 3 Minuten, 5 Schritte: Übersicht, «Entwürfe ansehen», Abrechnung von Sarah Meier, Versand-Dialog öffnen und abbrechen, «Neue Adresse eintragen».

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis, was zu tun ist. Gesehen: «Abrechnungen prüfen und versenden» (7 Entwürfe) und «Neue Adresse eintragen – Sarah Meier ist ausgezogen …». Ich bin bewusst über «Entwürfe ansehen» gegangen, wie in der letzten Runde.
2. **Entwürfe.** Gesehen: Sarah Meier, NK-22222222-2025-0002, «01.01.2025 – 30.06.2025, 181 Mietstage», Nachzahlung CHF 138.00, «Entwurf». Kein Hinweis in der Liste, das hatte ich auch nicht erwartet.
3. **Abrechnung 2025.** Erwartet (nach der letzten Runde): wieder kein Hinweis. Gesehen: der gelbe Kasten mit «Sarah Meier ist ausgezogen … Tragen Sie die neue Adresse ein.» und dem Link. Sofort klar, was zu tun ist. Darüber steht allerdings weiterhin die blaue Hauptschaltfläche «Als versendet markieren» (P-1).
4. **Versand-Dialog (nur geöffnet).** Erwartet: dass er mich bremst. Gesehen: «Per Brief, Seeweg 15, 6003 Luzern», darunter dieselbe Warnung mit Link; «Als versendet markieren» ist aber bedienbar (P-1). Mit «Abbrechen» geschlossen.
5. **«Neue Adresse eintragen».** Erwartet: das Adressformular. Gesehen: «Mieter bearbeiten», Bereich «Korrespondenzadresse» mit Hilfetext. Zurück zur Abrechnung führt von dort nichts (P-3). Nicht gespeichert.

## Verwirrung

- «Die Adresse ist noch die der Wohnung»: Welche Adresse? Erst im Formular habe ich gelesen, dass die Korrespondenzadresse gemeint ist und die Abrechnung dorthin geht (P-2).
- «Abrechnungsperiode 01.01.2025 – 31.12.2025» im Kopf, obwohl sie Ende Juni ausgezogen ist.

## Fehlerrisiken

- Die Hauptschaltfläche steht über der Warnung und bleibt aktiv; auch im Dialog lässt sich trotz Warnung bestätigen. Ein eiliger Klick schickt die Abrechnung an Seeweg 15, wo sie nicht mehr wohnt, und die Zahlungsfrist läuft ab dem Versandtag (P-1).
- Nach dem Eintragen der Adresse muss ich die Abrechnung selbst wiederfinden (P-3).

## Vorschläge

- **P-1:** Übersicht → «Entwürfe ansehen» → Sarah Meier → «Als versendet markieren». Hilfreich wäre, solange die Adresse fehlt, «Neue Adresse eintragen» als Hauptaktion zu zeigen und «Als versendet markieren» zurückzustufen, oder im Dialog eine ausdrückliche Bestätigung wie «Trotzdem an Seeweg 15 versenden».
- **P-2:** Abrechnung von Sarah Meier, gelber Hinweis: zum Beispiel «Die Abrechnung geht per Brief an die Adresse der Wohnung, aus der sie ausgezogen ist. Tragen Sie zuerst die neue Adresse ein.»
- **P-3:** Abrechnung → «Neue Adresse eintragen» → Formular: Ein Weg zurück zur Abrechnung (nach dem Speichern zurück zur Abrechnung oder eine Meldung mit Link «Zurück zur Abrechnung 2025») würde mir den Rückweg ersparen.

## Nicht geprüft

- Speichern einer neuen Adresse und was danach auf der Abrechnung, im Dialog und im PDF steht (Auftrag: nur ansehen).
- Versenden (Auftrag: nichts versenden).
- Andere Sprachen und der Dunkelmodus.
