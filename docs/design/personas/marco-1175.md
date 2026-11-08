# Marco – Einstellungen, Konto: anderer Kontoinhaber (#1175)

Persona: Marco, 38, Smartphone 390 × 844, Touch. Persona-App http://localhost:3300 mit Demodaten. Nicht gespeichert (globale Einstellungen, andere Persona auf derselben Seite).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen, Konto | Wer das Häkchen «Kontoinhaber ist der Absender» wieder setzt (z. B. aus Versehen beim Scrollen), verliert alles, was er unter «Kontoinhaber» eingetippt hat: nach erneutem Entfernen des Häkchens sind Name und PLZ leer, ohne Hinweis. |
| P-2 | Minor | Einstellungen, Absender und Konto | «Strasse und Hausnummer» heisst beim Kontoinhaber «(optional)», beim Absender direkt darüber steht dasselbe Feld ohne «(optional)». Ich habe kurz gezweifelt, ob die Strasse beim Absender Pflicht ist und beim Kontoinhaber nicht, oder ob das Gleiche gemeint ist. |

## Beobachtungen

- Insgesamt verstanden: Häkchen weg, darunter erscheint sofort die Gruppe «Kontoinhaber» mit Name, Strasse und Hausnummer (optional), PLZ, Ort, jeweils mit Beispiel. Der Hilfetext beim Häkchen sagt klar, wofür (QR-Rechnung «Konto / Zahlbar an») und dass der Kopf der Abrechnung weiter den Absender nennt. Genau meine Frage, beantwortet.
- Was Pflicht ist, steht nur im Hilfetext beim Häkchen («Mit einer IBAN braucht es dann Name, PLZ und Ort des Kontoinhabers») und indirekt über das «(optional)» bei der Strasse. Die Pflichtfelder selbst tragen keine Markierung. Für mich reicht das, weil «(optional)» nur bei einem Feld steht und der Rest damit Pflicht sein muss.
- Der Hilfetext beim Häkchen ist auf dem Handy 10 Zeilen lang, der IBAN-Hilfetext darüber nochmals 9. Ich habe ihn gelesen, weil ich genau das wissen wollte; bei weniger Zeit hätte ich ihn übersprungen.
- Die Gruppenüberschrift «Kontoinhaber» steht direkt über «Name des Kontoinhabers», fast ohne Abstand und kaum grösser; sie wirkt eher wie eine zweite Feldbeschriftung als wie ein Abschnittstitel (Screenshot 07).
- Die Felder sind beim Entfernen des Häkchens leer, nicht mit den Absenderdaten vorbefüllt. Für meinen Fall (Partnerin) richtig; wer nur eine andere Adresse braucht, muss alles neu tippen.
- PLZ öffnet auf dem Handy die normale Buchstabentastatur, keine Zahlentastatur (gilt auch für die PLZ des Absenders).
- Im Bedienungsbaum heissen die Felder «PLZ» und «Ort» beim Absender und beim Kontoinhaber gleich; sie sind nur über die Gruppe «Kontoinhaber» auseinanderzuhalten. Für mich als Sehenden kein Problem.
- Alle Felder 48 px hoch und volle Breite, kein seitliches Scrollen (Seitenbreite 390 px). Das Häkchen lässt sich über die ganze Beschriftung (48 px hoch) antippen.
- «Einstellungen speichern» liegt ganz unten (ca. 3500 px Seitenhöhe), weit weg vom Konto-Block.
- Das Antippen des Häkchens und das Tippen in die Felder schickte keine Anfrage ans System; erst Speichern würde etwas ändern.

## Aufgabe geschafft: ja

Ich weiss, was in jedes Feld gehört (Name der Person oder Firma, der das Konto gehört; deren Adresse) und dass Name, PLZ und Ort Pflicht sind, die Strasse nicht. Nicht gespeichert, wie verlangt.

## Aufwand

ca. 3 Minuten, 6 Schritte (Menü, Einstellungen, zum Konto scrollen, Häkchen entfernen, Felder lesen, Probeeingabe).

## Ablauf

- Häkchen wieder gesetzt und erneut entfernt, um zu sehen, ob meine Eingaben bleiben. Erwartet: «Laura Bernasconi» und «80» stehen noch da. Gesehen: alle Kontoinhaber-Felder leer (P-1).
- Pflichtfelder gesucht. Erwartet: ein Sternchen oder «Pflicht» an Name, PLZ, Ort. Gesehen: keine Markierung an den Feldern, nur «(optional)» an der Strasse und der Satz im Hilfetext beim Häkchen; beim Absender fehlt das «(optional)» an der Strasse (P-2).

## Vorschläge

- **P-1:** Einstellungen öffnen, bei «Konto» das Häkchen «Kontoinhaber ist der Absender» entfernen, «Name des Kontoinhabers» und PLZ ausfüllen, Häkchen setzen, Häkchen wieder entfernen: die Felder sind leer. Hilfreich: die Eingaben bis zum Verlassen der Seite behalten und erst beim Speichern mit gesetztem Häkchen verwerfen.
- **P-2:** Einstellungen öffnen, Block «Absender» und Gruppe «Kontoinhaber» vergleichen: gleiches Feld, einmal mit, einmal ohne «(optional)». Hilfreich: beide Strassenfelder gleich beschriften (beim Absender ebenfalls «(optional)», falls es dort auch freiwillig ist), oder sonst im Hilfetext sagen, warum es beim Absender nötig ist.

## Nicht geprüft

- Speichern und die Fehlermeldungen beim Speichern (z. B. Kontoinhaber ohne Name oder mit PLZ «80»): laut Auftrag nicht gespeichert, weil die Einstellungen ein Datensatz für die ganze App sind. Eine Prüfung schon beim Verlassen des Feldes gab es nicht (PLZ «80» blieb ohne Meldung).
- Wie die QR-Rechnung den Kontoinhaber tatsächlich druckt: dafür hätte ich speichern und eine Abrechnung erzeugen müssen.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/5d7f70d4-0be2-5903-a4e8-3a73471da3fb/scratchpad/marco-1175/` (06/07: Konto-Block vor und nach dem Entfernen des Häkchens, 08: Probeeingabe).
