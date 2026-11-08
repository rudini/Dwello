# Helga – Slice 1262: Dokument hochladen beim Mieter, gesperrte Felder während des Wartens

Desktop 1440 × 900 bei 150 % Zoom, Maus. Mieter Thomas Weber (Seepark Residenz). Den Upload (POST `/tenants/<id>?/upload`) habe ich zuerst festgehalten, dann mit Status 500 beantwortet, dann durchgelassen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mieter Thomas Weber, «Dokument hochladen», nach dem Fehler | Nach dem Fehler springt die Seite nach unten zur roten Meldung und zum Knopf. Bei 150 % sind «Datei auswählen» und der Dateiname dann nicht mehr zu sehen. Ich musste hochscrollen, um zu sehen, ob meine Datei noch ausgewählt ist. |

## Beobachtungen

- **Während des Wartens** (Knopf «Bitte warten …» mit Drehkreis): «Datei auswählen» und das Feld «Titel (optional)» sind hellgrau hinterlegt statt weiss. Über beiden zeigt der Mauszeiger ein Verbotszeichen. Das hellgraue Feld neben den weissen Feldern von vorher habe ich als «gesperrt» erkannt, allerdings erst beim zweiten Hinsehen. Es gibt keinen Satz, der sagt, dass man jetzt nichts ändern kann. Weil der Knopf aber «Bitte warten …» heisst, war mir klar, was los ist.
- **Lesbarkeit beim Warten:** Gut. Der Titel «Übergabeprotokoll» bleibt dunkel auf Hellgrau. «Datei auswählen» ist mittelgrau auf Hellgrau, der Dateiname «Uebergabeprotokoll.pdf» steht daneben. Nichts ist verblasst, alles ist bei 150 % gut lesbar.
- **Ändern beim Warten:** Ins Titelfeld getippter Text kam nicht an, der Titel blieb «Übergabeprotokoll». Ein Klick auf «Datei auswählen» öffnete kein Dateifenster. Beides wie erwartet.
- **Nach dem Fehler (500):** Die rote Meldung «Das hat nicht geklappt – Das Dokument wurde nicht gespeichert, weil Dwello nicht geantwortet hat. Wählen Sie noch einmal «Dokument hochladen».» erscheint. Datei und Titel sind noch da, beide wieder weiss und änderbar. Ich habe den Titel auf «Übergabeprotokoll A1» geändert, das Dateifenster liess sich wieder öffnen.
- Die Meldung sagt «weil Dwello nicht geantwortet hat». Gemeldet hat sich Dwello aber, nur mit einem Fehler. Für mich spielt das keine Rolle: Ich weiss, was ich tun soll.
- **Erfolgreicher Upload:** In der Liste steht «Übergabeprotokoll A1 – Hochgeladen am 08.11.2026 um 16:08, Datei «Uebergabeprotokoll.pdf»», mit «Datei herunterladen» und «Löschen». Unten erscheint die Meldung «Dokument «Übergabeprotokoll A1» hochgeladen». Das Formular ist danach wieder leer.
- In einem zweiten Durchgang habe ich dieselbe Datei noch einmal gewählt (wieder mit 500, also nicht gespeichert). Dwello warnt dann gut verständlich in Braun: «Eine Datei «Uebergabeprotokoll.pdf» haben Sie schon am 08.11.2026 hochgeladen …». Das ist hilfreich.
- **Rechnungen hochladen, noch ohne Gebäude:** Das gestrichelte Feld zeigt «Dateien hierher ziehen oder auswählen». Direkt darunter steht «Wählen Sie zuerst das Gebäude.», dann der hellgraue Knopf «Dateien auswählen» mit Verbotszeichen-Zeiger, und ein Klick öffnet nichts. Der Knopf ist gut lesbar, und der Satz darüber erklärt, warum er gesperrt ist. Das liest sich gut, besser als beim Mieter, wo ein solcher Satz fehlt. Unten rechts ist «0 Rechnungen erstellen» auf andere Art gesperrt (blasses Blau statt Hellgrau). Gestört hat mich das nicht.
- Die Bildschirmleser-Bezeichnung des Dateiknopfs beim Mieter lautet doppelt «Datei Datei auswählen», bei den Rechnungen «Dateien hierher ziehen oder auswählen Dateien auswählen». Ich selbst sehe das nicht, es fiel mir nur im Baum auf.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 20 Schritte: Seite öffnen, Datei wählen, Titel tippen, Hochladen beim Warten, Änderungsversuche, Fehler, Titel ändern, erneut hochladen, Rechnungs-Dialog ansehen.

## Ablauf

- Nach dem Fehler: Ich erwartete, Datei und Titel gleich neben der Fehlermeldung zu sehen. Gesehen habe ich nur noch das Titelfeld, die rote Meldung und den Knopf. Die Datei-Zeile war aus dem Bild gerollt, also musste ich hochscrollen (P-1).

## Vorschläge

- **P-1:** Beim Mieter Thomas Weber bei 150 % Zoom eine PDF wählen, einen Titel eintragen und auf «Dokument hochladen» klicken. Der Upload muss mit 500 scheitern. Danach steht die Seite so, dass «Datei auswählen» und der Dateiname oberhalb des Bildausschnitts liegen. Mir würde helfen, wenn die Seite nach dem Fehler beim Anfang von «Dokument hochladen» stehen bliebe. Oder die Fehlermeldung könnte den Dateinamen nennen («Ihre Datei «Uebergabeprotokoll.pdf» ist noch ausgewählt»).
- Freiwillig: Während des Wartens ein kurzer Satz wie bei den Rechnungen, z. B. «Datei und Titel können Sie ändern, sobald das Hochladen fertig ist.»

## Nicht geprüft

- 200 % Zoom: In der Aufgabe nicht verlangt, nur 150 % geprüft.
- Ziehen einer Datei ins Feld (Drag and drop) während des Wartens: Das ist mit der Maus im Testbrowser nicht wie bei einem Menschen möglich, deshalb nicht versucht.
- Dunkler Modus: nicht angesehen.
