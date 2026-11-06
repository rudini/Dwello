# Helga – Kontoinhaber für die QR-Rechnung (#1166)

Desktop 1440 × 900, 150 % Zoom (Kontrolle bei 200 %), Maus. App: http://localhost:3300 (Persona-Stack, Demodaten).
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/5d7f70d4-0be2-5903-a4e8-3a73471da3fb/scratchpad/helga-1166/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen, Bereich «Konto» / «Kontoinhaber» | Habe ich den Ort meiner Schwester vergessen, steht die rote Meldung unter dem **Namen**, den ich ausgefüllt hatte. Das Namensfeld ist rot umrandet und bekommt den Cursor; das leere Feld «Ort» ist nur rot umrandet, ohne eigene Meldung. Die Meldung sagt «Erfassen Sie Name, PLZ und Ort», aber nicht, dass nur der Ort fehlt. Ich habe zuerst gedacht, mit dem Namen «Erika Muster» stimme etwas nicht. |
| P-2 | Minor | Einstellungen, Meldung nach dem Speichern | Nach dem Speichern steht «Absender, Verwaltungspauschale, Fristen und Vorschläge gespeichert.» Vom Konto oder vom Kontoinhaber steht nichts darin. Ich war unsicher, ob die Angaben meiner Schwester mitgespeichert wurden, und musste die Seite neu laden, um es zu sehen. |

## Beobachtungen

- Das Häkchen «Kontoinhaber ist der Absender» habe ich unter «Konto» gleich gefunden. Der Hilfetext darunter erklärt genau meinen Fall («Entfernen Sie das Häkchen, wenn das Konto jemand anderem gehört …») und sagt auch, dass der Kopf von Abrechnungen und Mahnungen weiter den Absender nennt. Das hat mir Sicherheit gegeben.
- Nach dem Entfernen des Häkchens erscheint ein Abschnitt «Kontoinhaber» mit Name, Strasse und Hausnummer, PLZ und Ort. Die Felder des Absenders oben haben ein «Beispiel: …» darunter, die Felder des Kontoinhabers keines. Gestört hat es mich nicht.
- Der Hilfetext bei der IBAN sagt weiter «Mit einer IBAN braucht es Firmenname, PLZ und Ort.» Ohne Häkchen braucht es zusätzlich die Angaben des Kontoinhabers. Das steht aber gleich darunter im Text zum Häkchen.
- Meine Eingaben sind nach der Fehlermeldung stehen geblieben, und das Häkchen blieb weg. Ich musste nur noch «Luzern» eintragen. Die rote Meldung unter dem Namen blieb aber stehen, bis ich wieder gespeichert hatte.
- Nach dem Neuladen der Seite stehen Erika Muster, Seeweg 5, 6003 Luzern weiter da, und das Häkchen ist nicht gesetzt.
- Bei 200 % Zoom ist der Abschnitt «Kontoinhaber» gut lesbar, und die Seite lässt sich nicht seitwärts schieben.
- **PDF von Anna Schmidt (NK-11111111-2025-0002, Musterhaus Zentrum, Entwurf):** Das PDF hat 2 Seiten. Anna Schmidt bekommt CHF 6.50 zurück, deshalb hat das PDF **keinen Einzahlungsschein**. Briefkopf, Hinweis zur Einsicht in die Belege und Gruss nennen «Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich», also weiter meine Verwaltung. Meine Schwester steht nirgends im Brief, und so habe ich es auch gewollt. Auf der Seite der Abrechnung steht unter «Zahlung» nur «Sie erstatten dem Mieter CHF 6.50 zurück.» Ich hatte einen Einzahlungsschein erwartet. Dass bei einer Rückerstattung keiner beiliegt, ist eigentlich logisch, ich musste es aber erst merken.
- Um meine Schwester trotzdem auf einem Einzahlungsschein zu sehen, habe ich die PDFs der anderen Entwürfe im selben Haus heruntergeladen, ohne etwas zu ändern. Bei Pierre Dubois (NK-11111111-2025-0003, französisch, Nachzahlung CHF 142.35) ist Seite 3 der Einzahlungsschein. Im Empfangsschein und im Zahlteil steht unter «Compte / Payable à» CH44 3199 9123 0008 8901 2, Erika Muster, Seeweg 5, 6003 Luzern. Der Kopf aller Seiten und der Gruss nennen weiter Muster Immobilien AG. Bei Maria Rossi (NK-11111111-2025-0004, italienisch) ist es gleich. Genau so wollte ich es.

## Aufgabe geschafft: ja

Meine Schwester ist als Kontoinhaberin gespeichert, und der Brief kommt weiter von meiner Verwaltung. Am PDF von Anna Schmidt konnte ich nur den Brief prüfen, weil es dort wegen der Rückerstattung keinen Einzahlungsschein gibt. Den Einzahlungsschein habe ich an zwei anderen Entwürfen im selben Haus geprüft.

## Aufwand

Etwa 15 Minuten. Übersicht → Benutzermenü → Einstellungen (3 Schritte) → Häkchen entfernen und 3 Felder ausfüllen → speichern (Fehlermeldung) → Ort eintragen → speichern → Seite neu laden zur Kontrolle → Nebenkostenabrechnungen, Entwürfe → Anna Schmidt → PDF herunterladen → 2 weitere PDFs aus der Liste. Rund 15 Schritte.

## Ablauf

- **Einstellungen suchen:** Erwartet habe ich einen Eintrag «Einstellungen» im Menü links. Er steht aber im Benutzermenü oben rechts (unter «Vera Verwalter»). Ich habe ihn dort gefunden.
- **Speichern ohne Ort:** Erwartet habe ich eine Meldung beim Feld «Ort» wie «Bitte Ort eintragen». Die Meldung stand unter dem Namen, der Name war rot umrandet und hatte den Cursor, und der Text nannte Name, PLZ und Ort zusammen (P-1).
- **Speichern mit Ort:** Erwartet habe ich «Kontoinhaber gespeichert» oder Ähnliches. Die Meldung nennt Absender, Verwaltungspauschale, Fristen und Vorschläge, aber nicht das Konto (P-2).
- **PDF von Anna Schmidt:** Erwartet habe ich einen Einzahlungsschein mit meiner Schwester. Das PDF hat keinen, weil Anna Schmidt Geld zurückbekommt. Den Einzahlungsschein habe ich an den Entwürfen von Pierre Dubois und Maria Rossi gesehen.

## Vorschläge

- **P-1:** Einstellungen öffnen → Häkchen «Kontoinhaber ist der Absender» entfernen → Name «Erika Muster», Strasse «Seeweg 5», PLZ «6003» eintragen, Ort leer lassen → «Einstellungen speichern». Hilfreich wäre die Meldung beim Feld, das wirklich fehlt (hier «Ort»), mit dem Cursor dort, zum Beispiel «Erfassen Sie den Ort des Kontoinhabers.». Ein ausgefülltes Namensfeld sollte nicht rot werden.
- **P-2:** Gleich wie oben, mit Ort «Luzern» → «Einstellungen speichern». Hilfreich wäre eine Meldung, die auch Konto und Kontoinhaber nennt, oder ein allgemeines «Ihre Einstellungen sind gespeichert.».

## Nicht geprüft

- Den Einzahlungsschein auf dem PDF von Anna Schmidt: Es hat keinen, weil sie eine Rückerstattung bekommt. Ich habe ihn stattdessen auf den PDFs von Pierre Dubois und Maria Rossi angesehen. Einen deutschsprachigen Einzahlungsschein habe ich nicht gesehen: Diese beiden PDFs sind französisch und italienisch, und Thomas Weber (Seepark Residenz) bekommt ebenfalls eine Rückerstattung.
- Mahnungen: Laut Hilfetext nennen auch sie den Absender im Kopf. Ich habe keine Mahnung erstellt, weil das nicht zu meiner Aufgabe gehörte und es sonst Daten ändern würde.
