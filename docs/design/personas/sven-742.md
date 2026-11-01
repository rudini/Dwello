# Sven – Slice 742 (Rechnungen hochladen: Statuszeile und Anzahl)

Persona: Sven, 45, blind, nur Tastatur und Screenreader (beurteilt am Accessibility-Tree und an dem, was `role="status"` ansagt). Desktop 1440 × 900.
App: Persona-Stack auf http://localhost:3300 mit Demodaten und KI-Ersatz, angemeldet über das Persona-Kit.
Gebäude: «Musterhaus Zentrum». Dateien: `02-hauswart-fellmann-gisler.pdf`, `06-gartenpflege-lindenhof.pdf`.
Skripte und Screenshots: `/tmp/sven-742/`. Nichts erstellt, am Ende abgebrochen und verworfen.

Die Ansagen unten habe ich mitgeschrieben, indem ich jede Textänderung der Statuszeile im Dialog mitprotokolliert habe. Die Beschriftung des Erstellen-Knopfs habe ich nur zur Kontrolle gelesen, nicht für mein Urteil.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog «Rechnungen hochladen», Statuszeile | Die Statuszeile nennt nie «unvollständig» und nie «nicht ausgewählt». Darum klingen verschiedene Zustände gleich. Nach dem Lesen (beide Dateien ohne Kategorie, Knopf «0 Rechnungen erstellen (2 unvollständig)») höre ich «Bitte prüfen: 2.». Sind beide Dateien vollständig, aber abgewählt (Knopf «0 Rechnungen erstellen», deaktiviert), höre ich genau dasselbe: «Bitte prüfen: 2.». Ist eine Datei unvollständig, höre ich «Bitte prüfen: 2. Bereit zum Erstellen: 1.» (Knopf «1 Rechnung erstellen (1 unvollständig)»). Ist eine Datei abgewählt, höre ich denselben Satz (Knopf «1 Rechnung erstellen»). Die Zahl, die erstellt wird, kann ich aus «Bereit zum Erstellen: n» ablesen; fehlt der Satz, muss ich selbst auf 0 schliessen. Warum die andere Datei nicht dabei ist (fehlt etwas oder habe ich sie abgewählt), sagt mir nur der Knopf. |
| P-2 | Minor | Dialog «Rechnungen hochladen», Statuszeile und Status je Datei | «Bitte prüfen: 2.» bleibt bis zum Schluss stehen. Das gilt auch, nachdem ich bei beiden Dateien Kategorie und Verteilschlüssel ergänzt und das Rechnungsdatum neu eingetippt habe, und auch für eine abgewählte Datei. Am Ende höre ich «Bitte prüfen: 2. Bereit zum Erstellen: 2.» bei nur 2 Dateien. Das ergibt zusammen 4. Ich weiss nicht, ob ich mit dem Prüfen fertig bin und ob die beiden «Bereit»-Dateien dieselben sind wie die beiden «Bitte prüfen»-Dateien. Der Hinweis «Prüfen Sie: Rechnungsdatum.» und «Die KI ist unsicher. Bitte prüfen Sie den Wert.» lässt sich offenbar nicht quittieren. |
| P-3 | Minor | Dialog «Rechnungen hochladen», Kategorie und Datumsfelder | Die Statuszeile ändert sich bei jedem Zwischenschritt. Gehe ich mit Pfeil runter durch die Kategorien, wie ich es in einer geschlossenen Auswahlliste gewohnt bin, wechselt sie bei jedem Schritt hin und her: Heizung «Bitte prüfen: 2. Bereit zum Erstellen: 1.», Warmwasser «Bitte prüfen: 2.», Kaltwasser «… Bereit zum Erstellen: 1.», Abwasser «Bitte prüfen: 2.», Allgemeinstrom «… Bereit zum Erstellen: 1.». Tippe ich ein Datum neu (alles markieren, neu tippen), kommen zwei Ansagen innerhalb von 0,1 s: «… Bereit zum Erstellen: 1.» und gleich danach «… Bereit zum Erstellen: 2.». Dazu kommt das ausgeschriebene Datum «Dienstag, 31. März 2026». Ich höre Zwischenstände, die nichts bedeuten, und kann den letzten leicht verpassen. |

## Beobachtungen

- Ansagen beim Lesen, genau so mitgeschrieben (in allen fünf Läufen gleich): «Gelesen: 0 von 2», «Gelesen: 1 von 2», dann im selben Moment (unter 0,1 s danach) «Bitte prüfen: 2.». «Gelesen: 2 von 2» kommt nie. Weil «1 von 2» und das Ergebnis fast gleichzeitig kommen, sagt ein Screenreader wohl nur das letzte an. Das stört nicht: «Bitte prüfen» sagt mir, dass das Lesen fertig ist.
- Name des Erstellen-Knopfs nach dem Lesen: «0 Rechnungen erstellen (2 unvollständig)», nicht deaktiviert. Nach Kategorie bei Datei 1: «1 Rechnung erstellen (1 unvollständig)». Nach beiden Kategorien: «2 Rechnungen erstellen». Datei 2 abgewählt: «1 Rechnung erstellen». Beide abgewählt: «0 Rechnungen erstellen», deaktiviert. Der Knopf ist für mich genauer als die Statuszeile, weil er «unvollständig» nennt.
- Ergänzt habe ich nur die Kategorie (Hauswart, Gartenpflege). Den Verteilschlüssel schlug Dwello danach selbst vor («Pro Fläche (m²)»), der Hinweis «Wählen Sie, wie die Kosten verteilt werden.» verschwand damit. Das Fälligkeitsdatum ist optional und blieb leer.
- Gut: Wähle ich die Kategorie per Tippen («Haus», «Gart»), höre ich genau eine Ansage, z. B. «Bitte prüfen: 2. Bereit zum Erstellen: 1.». Auch jedes Häkchen bei «Diese Rechnung erstellen» ergibt genau eine Ansage, die zur neuen Zahl passt.
- Gut: «Diese Rechnung erstellen», «Angaben prüfen» und «Datei entfernen» tragen über `aria-describedby` den Dateinamen und den Status, z. B. «Diese Rechnung erstellen, Kontrollkästchen, aktiviert – 06-gartenpflege-lindenhof.pdf, Bitte prüfen». So weiss ich, welche Datei gemeint ist. Bei einer abgewählten Datei lautet die Beschreibung aber weiter «Bitte prüfen» (siehe P-2).
- Enter auf «0 Rechnungen erstellen (2 unvollständig)» schickt nichts ab (keine Anfrage gesehen). Der Fokus springt auf «Kategorie» der ersten Datei, die Felder Kategorie und Verteilschlüssel beider Dateien sind als ungültig markiert. Eine Ansage, was fehlt, gibt es dabei nicht. Ich höre nur «Kategorie, ungültig». Das reicht mir knapp.
- Öffne ich den Dialog, steht der Fokus auf «Abbrechen», nicht auf dem Feld «Gebäude». Der Dialog ist benannt und beschrieben (`aria-modal`, `aria-describedby`), darum höre ich den Einleitungstext. Ich muss aber erst mit Umschalt+Tab zurück zum Gebäude.
- Der Fokus bleibt im Dialog: Nach dem Erstellen-Knopf springt Tab zurück zum Dateiknopf.
- Nach dem Auswählen der Dateien bleibt der Fokus auf dem Dateiknopf. Die Statuszeile ist die einzige Rückmeldung, und die kommt.
- Das Gebäudefeld ist nach dem Hochladen gesperrt, mit dem Hinweis «Das Gebäude gilt für alle Dateien. Entfernen Sie die Dateien, um ein anderes zu wählen.». Klar.
- Aus Versehen habe ich einmal «Umlagefähig» statt «Diese Rechnung erstellen» abgewählt (beim Rückwärtstabben kommt es zuerst). Die Statuszeile blieb gleich, wie zu erwarten.
- Abbrechen: Der Dialog «Hochladen abbrechen?» sagt «Hochgeladene Dateien und Ihre Eingaben gehen verloren.», der Fokus steht auf «Weiter prüfen» (sicher). «Abbrechen und verwerfen» schliesst alles, der Fokus landet auf dem Link «Rechnungen hochladen». Gut, so weiss ich, wo ich bin.
- Der Leistungszeitraum hat drei lange Hilfetexte (Boiler, VMWG). Pro Datei sind das beim Durchlesen viele Absätze, bevor ich zu Betrag, Kategorie und Verteilschlüssel komme.

## Aufgabe geschafft: ja

Weiss ich jederzeit, wie viele Rechnungen Dwello erstellt, ohne auf den Knopf zu schauen? Meistens, aber nur durch Schliessen: «Bereit zum Erstellen: n» stimmte jedes Mal mit dem Knopf überein, und fehlt der Satz, sind es 0. Warum eine Datei nicht dabei ist (fehlt etwas oder abgewählt), sagt mir die Statuszeile nicht (P-1), und «Bitte prüfen: 2.» verwirrt bis zum Schluss (P-2).

## Aufwand

Rund 20 Minuten, 11 Skriptläufe (jeder Lauf beginnt neu beim Hochladen). Weg: 10 Tabs bis «Rechnungen», 18 Tabs bis «Rechnungen hochladen», 1 Umschalt+Tab zum Gebäude, 4 × Pfeil runter, 1 Tab und Leertaste zum Dateiknopf. Pro Datei: «Angaben prüfen», etwa 15 Tabs bis «Kategorie», 4 Buchstaben tippen. Häkchen: je Leertaste. Abbrechen: 1 Enter, 1 Tab, 1 Enter.

## Ablauf

- Beide Dateien gelesen. Erwartet: «2 von 2 gelesen» und wie viele Rechnungen bereit oder unvollständig sind. Gehört: «Bitte prüfen: 2.». Ob etwas fehlt oder ob ich nur nachsehen soll, höre ich nicht; dass 0 erstellt werden, auch nicht (P-1).
- Bei beiden Dateien die Kategorie ergänzt. Erwartet: «Bereit zum Erstellen: 2.» und kein «Bitte prüfen» mehr. Gehört: «Bitte prüfen: 2. Bereit zum Erstellen: 2.» (P-2).
- Rechnungsdatum neu eingetippt, damit «Bitte prüfen» verschwindet. Erwartet: Der Hinweis geht weg. Gehört: zwei schnelle Ansagen («… 1.», «… 2.»), «Bitte prüfen: 2.» bleibt (P-2, P-3).
- Kategorie mit Pfeil runter gewählt. Erwartet: eine Ansage, wenn ich bei «Hauswart» bin. Gehört: fünf wechselnde Ansagen auf dem Weg (P-3).
- Datei 2 abgewählt. Erwartet: «Bereit zum Erstellen: 1», dazu ein Hinweis, dass eine Datei nicht erstellt wird. Gehört: «Bitte prüfen: 2. Bereit zum Erstellen: 1.», derselbe Satz wie bei einer unvollständigen Datei (P-1). Wieder gewählt: «Bitte prüfen: 2. Bereit zum Erstellen: 2.», wie erwartet.
- Beide abgewählt. Erwartet: «Bereit zum Erstellen: 0» oder «Keine Rechnung ausgewählt». Gehört: «Bitte prüfen: 2.», derselbe Satz wie direkt nach dem Lesen (P-1).

## Vorschläge

- **P-1:** Musterhaus Zentrum wählen, die beiden Dateien hochladen und das Lesen abwarten. Status «Bitte prüfen: 2.». Dann bei beiden die Kategorie ergänzen und beide «Diese Rechnung erstellen» abwählen. Status wieder «Bitte prüfen: 2.». Hilfe: Die Statuszeile nennt wie der Knopf alle drei Zahlen, auch die 0, z. B. «Bereit zum Erstellen: 1. Unvollständig: 1.» bzw. «Bereit zum Erstellen: 0. Nicht ausgewählt: 2.».
- **P-2:** Wie oben, bei beiden die Kategorie ergänzen, das Rechnungsdatum neu eintippen. Status bleibt «Bitte prüfen: 2. Bereit zum Erstellen: 2.», jede Datei weiter «Bitte prüfen». Hilfe: Eine vollständige Datei nicht mehr als «Bitte prüfen» zählen. Oder klar trennen: «Bereit zum Erstellen: 2, davon mit Hinweis der KI: 2». Den Hinweis zum unsicheren Datum quittieren lassen, z. B. durch Bearbeiten des Felds. Abgewählte Dateien nicht mitzählen.
- **P-3:** Nach dem Lesen bei Datei 1 «Angaben prüfen», zur Kategorie tabben, Pfeil runter fünfmal. Jede Taste ergibt eine eigene, wechselnde Ansage. Hilfe: Die Statuszeile erst nach einer kurzen Ruhepause (etwa 1 s ohne Änderung) neu setzen, damit nur der Endstand angesagt wird.

## Nicht geprüft

- Echter Screenreader (NVDA/VoiceOver): beurteilt nur am Accessibility-Tree, an Fokus und an den mitprotokollierten Änderungen der Statuszeile. Ob ein Screenreader zwei Änderungen innerhalb von 0,1 s beide ansagt, habe ich nicht prüfen können.
- Dateien per Ziehen ablegen: geht ohne Maus nicht, ich habe die Dateiauswahl per Leertaste geöffnet.
- «Datei entfernen» und das Erstellen selbst: nicht Teil der Aufgabe.
- Eine Datei, die die KI nicht lesen kann (Statuszeile im Fehlerfall): nicht Teil der Aufgabe.
