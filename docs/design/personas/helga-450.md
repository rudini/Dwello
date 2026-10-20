# Helga – Issue #450: Einstellungen speichern, wenn zur IBAN der Ort fehlt

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (zusätzlich 200 %), Maus.
Ausgangslage: In den Einstellungen sind Firmenname «Muster Immobilien AG», «Bahnhofstrasse 1», PLZ «8001» und eine IBAN hinterlegt, der Ort ist leer (ältere Installation).
Gespeichert habe ich nur Stände ohne Ort; Dwello hat jedes Mal abgelehnt, in der Datenbank hat sich nichts geändert (nach dem Neuladen wieder «Muster Immobilien AG», Ort leer, Mahnfrist 14).

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen, Absender | Die Meldung sagt nicht, *was* fehlt. Sie lautet immer «Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort.», egal ob nur der Ort fehlt oder Ort und Firmenname. Ich muss selbst nachschauen, welches der drei Felder leer ist. |
| P-2 | Minor | Einstellungen, Absender | Rot umrandet wird nur das IBAN-Feld, und das ist eigentlich in Ordnung. Das leere Feld «Ort» (und im zweiten Versuch das leere Feld «Firmenname») bleibt grau. Ich habe zuerst gedacht, mit meiner IBAN stimme etwas nicht. Bei 200 % ist das Feld «Ort» nach dem Speichern gar nicht mehr zu sehen, weil die Seite zur IBAN springt. |
| P-3 | Nit | Einstellungen, Absender | In der Meldung steht «Name», das Feld heisst aber «Firmenname». Ausserdem steht da «Firmenadresse», gebraucht werden aber nur Name, PLZ und Ort, die Strasse nicht. Ich habe mich gefragt, ob ich die Strasse auch noch ändern muss. |

## Beobachtungen

- Die Hilfe bei der IBAN sagt es schon vorher: «Mit einer IBAN braucht es Firmenname, PLZ und Ort.» Das ist gut, aber sie steht als letzter Satz am Ende eines langen Textes über Rückerstattungen. Gelesen habe ich ihn erst, als ich ihn gesucht habe.
- Beim Öffnen der Seite gibt es keinen Hinweis darauf, dass bei mir der Ort schon fehlt. Ich merke es erst beim Speichern. Für eine alte Installation, die ich nur selten öffne, wäre ein Hinweis beim Öffnen hilfreich. (Das ist kein Befund zur Aufgabe, nur ein Gedanke.)
- Nach der Ablehnung bleibt meine Eingabe im Formular stehen (eine geänderte Mahnfrist 21 war noch da). Gespeichert wurde aber gar nichts, auch nicht die Mahnfrist. Dass «nichts» gespeichert wurde, steht nirgends ausdrücklich. Eine Meldung oben auf der Seite gibt es nicht.
- Nach dem Speichern springt die Seite zum IBAN-Feld, der Cursor steht dort, und die rote Meldung mit Ausrufezeichen-Symbol steht direkt darunter. Die Meldung ist in grosser, gut lesbarer Schrift und nicht nur durch die Farbe zu erkennen.
- Technisch: Das IBAN-Feld bekommt `aria-invalid=true` und verweist auf die Meldung (`iban-error`). Die Felder «Ort» und «Firmenname» bekommen keinen Hinweis.
- Ohne Firmenname kommt genau dieselbe Meldung wie ohne Ort. Dwello lehnt auch hier ab, das ist richtig.

## Aufgabe geschafft: ja

Ich habe verstanden, dass zur IBAN Firmenname, PLZ und Ort gehören und dass ich etwas ergänzen muss. Welches Feld genau fehlt, musste ich selbst herausfinden (P-1, P-2).

## Aufwand

Ungefähr 6 Minuten, 9 Schritte: Menü öffnen, «Einstellungen», IBAN-Hilfe lesen, speichern, Meldung lesen, Seite neu laden, Firmenname leeren, speichern, Meldung lesen. Dazu ein Kontrollgang bei 200 % mit geänderter Mahnfrist.

## Ablauf

1. **Einstellungen finden.** Erwartet: ein Link «Einstellungen». Gesehen: Bei 150 % ist die Seitenleiste zu einem Menü-Knopf (drei Striche) oben links zusammengeklappt. Darin steht «Einstellungen» unter den anderen Bereichen. Gefunden, aber erst im Menü.
2. **Seite «Einstellungen» (Bild 05).** Erwartet: meine Absenderangaben. Gesehen: die Karte «Absender» mit Firmenname, Strasse, PLZ 8001, Ort leer, IBAN CH44 3199 9123 0008 8901 2. Kein Hinweis, dass der Ort fehlt.
3. **Hilfe bei der IBAN lesen.** Erwartet: eine Erklärung, wofür die IBAN da ist. Gesehen: ein langer Text über Nachzahlungen, Rückerstattungen und die IBAN des Mieters. Erst im letzten Satz steht: «Mit einer IBAN braucht es Firmenname, PLZ und Ort.» Danach folgt das Beispiel.
4. **Speichern ohne Ort (Bild 06/07).** Erwartet: entweder «gespeichert» oder eine Meldung beim Feld «Ort». Gesehen: Die Seite springt zur IBAN. Das IBAN-Feld ist rot umrandet, darunter steht rot mit Ausrufezeichen: «Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort.» Das Feld «Ort» knapp darüber ist leer und grau umrandet. Oben auf der Seite steht nichts. Nach dem Neuladen ist alles wie vorher.
5. **Neu laden, Firmenname leeren, speichern (Bild 09–11).** Erwartet: eine Meldung, dass jetzt auch der Firmenname fehlt. Gesehen: wörtlich dieselbe Meldung, wieder nur beim IBAN-Feld. Das leere Feld «Firmenname» ist grau, nicht rot. Nach dem Neuladen ist «Muster Immobilien AG» wieder da, es wurde also nichts gespeichert.
6. **Kontrolle bei 200 % (Bild 12).** Mahnfrist auf 21 gesetzt und gespeichert. Gesehen: dieselbe Meldung bei der IBAN. Das Feld «Ort» ist nach dem Sprung nicht mehr im Bild. Die 21 bleibt im Formular stehen, gespeichert wird sie nicht (nach dem Neuladen 14).

## Verwirrung

- «Firmenadresse» und «Name»: Die Felder heissen «Firmenname», «PLZ» und «Ort». Zur Adresse gehört für mich auch die Strasse, und die wird gar nicht verlangt.
- Rot beim IBAN-Feld: Ich dachte zuerst, meine IBAN sei falsch. Dabei fehlt etwas in einem anderen Feld.
- «Absender» als Titel ist verständlich, weil darunter «Steht auf jeder Abrechnung und jeder Mahnung» steht.

## Fehlerrisiken

- Wer die IBAN für falsch hält, löscht sie vielleicht, damit das Speichern klappt. Dann gibt es keine QR-Rechnung mehr. Das habe ich nicht ausprobiert, weil es nicht zur Aufgabe gehörte.
- Wer andere Einstellungen ändert (z. B. die Mahnfrist) und die Meldung bei der IBAN übersieht, glaubt vielleicht, die Mahnfrist sei gespeichert. Sie ist es nicht.

## Vorschläge

- **P-1:** Einstellungen öffnen (Ort leer, IBAN vorhanden), «Einstellungen speichern» klicken. Danach neu laden, zusätzlich Firmenname leeren und erneut speichern. Beide Male kommt dieselbe Meldung. Hilfreich: die fehlenden Felder nennen, z. B. «Es fehlt: Ort.» bzw. «Es fehlen: Firmenname, Ort.»
- **P-2:** Gleiche Schritte, bei 150 % und 200 % ansehen. Hilfreich: Das leere Pflichtfeld selbst rot markieren und mit einer kurzen Meldung versehen («Mit einer IBAN braucht es den Ort.») und den Cursor dorthin setzen statt in das richtige IBAN-Feld. Oder zumindest die Meldung so formulieren, dass klar ist: Die IBAN ist in Ordnung.
- **P-3:** Meldung lesen. Hilfreich: dieselben Wörter wie die Feldbeschriftungen («Firmenname, PLZ und Ort») und «Firmenadresse» weglassen oder sagen, dass die Strasse freiwillig ist.

## Nicht geprüft

- Ort ergänzen und erfolgreich speichern: ausdrücklich nicht erlaubt, weil eine zweite Persona den fehlenden Ort gleichzeitig braucht.
- IBAN löschen, um ohne Ort zu speichern: nicht Teil der Aufgabe, und ich wollte die gemeinsamen Daten nicht verändern.
- Wie sich der fehlende Ort auf Abrechnungen oder QR-Rechnungen auswirkt: nicht Teil der Aufgabe.
- Andere Sprachen und Dunkelmodus: nicht Teil der Aufgabe.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/helga-450/`
