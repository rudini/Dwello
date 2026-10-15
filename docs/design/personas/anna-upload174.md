# Anna – Dokumente eines Mieters finden (upload174)

Persona: Anna, 29, vermietet zum ersten Mal und kommt nach Monaten zurück, ohne sich an etwas zu erinnern. Desktop 1440 × 900 mit Maus, ein Teil auf dem Handy 390 × 844 mit Touch.
Aufgabe: Das Übergabeprotokoll von Marco Bernasconi finden und öffnen, danach herausfinden, wo ich künftig weitere Unterlagen eines Mieters ablege (nur schauen: nichts gespeichert, hochgeladen oder gelöscht).
App: http://localhost:3300 (Persona-Stack mit Demodaten). Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/9ef0e447-cbd4-5868-810d-381376519773/scratchpad/anna-upload174/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mieterseite, Karte «Dokumente» | Den Link zum Öffnen beschriftet nur der Dateityp («PDF», «JPG»), ohne Verb. In der Liste «Dokumente» heisst derselbe Link «Datei herunterladen». Ich habe einen Knopf «Öffnen» gesucht und «PDF» erst auf den zweiten Blick als Link erkannt. |
| P-2 | Minor | Mieterseite, Karte «Dokumente» (vor allem Handy) | Der Link «PDF» ist nur 31 × 24 px gross (gemessen auf 390 px, auf dem Desktop gleich hoch), also deutlich unter 48 px. Gleich daneben steht der rote Knopf «Löschen» (48 px hoch). Auf dem Handy kann ich mich leicht vertippen, und dann bin ich beim Löschen statt beim Öffnen. |
| P-3 | Minor | Liste «Dokumente» | Über das Menü «Dokumente» lande ich in der Liste, aber dort kann ich nichts hochladen, und nichts sagt mir, wo das geht. Der Einleitungstext nennt «Dokumente, die Sie zu Mietern hochgeladen haben», aber nicht, wo man hochlädt. Ohne den Umweg über die Hilfe hätte ich das nicht herausgefunden. |
| P-4 | Minor | Liste «Dokumente» | Der Mietername («Zu Marco Bernasconi») ist kein Link, und ich kann nicht nach Mieter filtern oder suchen. Die Liste ist nach Hochladedatum sortiert, neueste zuoberst. Mein altes Protokoll von 2023 ist auf dem Handy schon nach wenigen neuen Uploads ganz nach unten gerutscht (siebter Eintrag, nach rund 1500 px Scrollen). |
| P-5 | Nit | Hilfe, Abschnitt «Mieter und Mietverträge verwalten» | «Unter «Dokumente» auf der Seite eines Mieters laden Sie Dateien hoch» ist richtig. Aber «Dokumente» heisst auch der Menüpunkt in der Seitenleiste. Beim ersten Lesen habe ich an den Menüpunkt gedacht, erst «auf der Seite eines Mieters» hat es geklärt. Der Satz steht auch nur unter Mieter und Mietverträge, nicht bei «Briefe erscheinen unter «Dokumente»» weiter unten. |
| P-6 | Nit | Mieterseite und Liste «Dokumente» | Wer auf «PDF» oder «Datei herunterladen» klickt, öffnet das Dokument nicht im Browser. Die Datei wird heruntergeladen (Antwort mit `Content-Disposition: attachment`, Datei `Uebergabeprotokoll-B2.pdf`). Ich wollte das Protokoll «öffnen» und musste es dann im Download-Ordner suchen. |

## Beobachtungen

- Das Dateifeld zeigt im Testbrowser «Choose File / No file chosen» auf Englisch. Das kommt wohl vom Browser und nicht von Dwello, ich konnte es aber nicht mit einem deutschen Browser gegenschauen. Der Screenreader nennt es nur «Datei» (button «Datei»).
- Auf dem Handy liegt die Karte «Dokumente» ganz unten auf der Mieterseite, nach Kontaktdaten, aktueller Miete und Mietverträgen (ab etwa 1800 px von 2586 px). Ich musste weit scrollen, habe sie aber gefunden.
- Die Mieterseite kündigt die Dokumente schon im Untertitel an («Kontaktdaten, Miete, Mietverträge und Dokumente dieses Mieters»). Das hat mir Mut gemacht, dort weiterzuscrollen.
- Der Hilfetext beim Hochladen («Löschen Sie Ausweiskopien und Betreibungsauszüge, sobald Sie sie nicht mehr brauchen») ist gut. Ich wusste aber nicht, warum ich das tun soll (Datenschutz?).
- In der Liste und auf Marcos Seite standen Einträge anderer Personas («IMG_2041», «Uebergabeprotokoll» bei Hans Müller, «Mietvertrag unterschrieben» und «Übergabeprotokoll Einzug» bei Laura Keller). Die habe ich nicht angefasst und nicht bewertet. Sie zeigen aber, wie schnell die Liste ohne Filter unübersichtlich wird (siehe P-4).
- Auf der Übersicht führt nichts zu Dokumenten, und unter «Häufige Arbeiten» fehlt «Dokument ablegen». Für meine Aufgabe war das kein Hindernis.

## Aufgabe geschafft: ja

Das Protokoll habe ich gefunden und geöffnet (heruntergeladen, Inhalt «Übergabeprotokoll Wohnung B2 (Beispiel) … Übergabe an Marco Bernasconi am 30.06.2023»). Wo ich künftig ablege, habe ich auch herausgefunden: auf der Seite des Mieters unter «Dokument hochladen».

## Aufwand

- Etwa 6 Minuten im Selbstversuch.
- Desktop: 3 Klicks bis zum Dokument (Seitenleiste «Mieter», «Marco Bernasconi», «PDF»). Um den Ablageort zu klären, kamen 2 Umwege dazu (Menü «Dokumente», «Hilfe»).
- Handy: Menü öffnen, «Dokumente», «Datei herunterladen» (3 Tipps plus viel Scrollen). Zum Vergleich habe ich die Mieterseite direkt geöffnet.

## Ablauf

1. **Übersicht (Desktop).** Erwartet: ein Hinweis auf Dokumente oder Mieter. Gesehen: Aufgaben zu Nebenkostenabrechnungen und Fristen, nichts zu Dokumenten. In der Seitenleiste stehen aber «Mieter» und unter «Nebenkosten» «Dokumente». Dass Dokumente unter «Nebenkosten» einsortiert sind, hat mich kurz irritiert, mein Protokoll hat mit Nebenkosten nichts zu tun.
2. **Mieter.** Erwartet: eine Liste mit Marco. Gesehen: 10 Mieter, Marco Bernasconi zuoberst, mit Wohnung B2, Seepark Residenz, «Aktiv». Einfach.
3. **Mieterseite Marco Bernasconi** (Screenshot `03-tenant.png`). Erwartet: irgendwo seine Unterlagen. Gesehen: Untertitel «Kontaktdaten, Miete, Mietverträge und Dokumente dieses Mieters». Rechts unten die Karte «Dokumente» mit «Übergabeprotokoll Wohnung B2, Hochgeladen am 30.06.2023», daneben ein kleiner unterstrichener Link «PDF» und ein roter «Löschen». Darunter der Bereich «Dokument hochladen» mit Datei, Titel (optional) und dem Knopf «Dokument hochladen». Gefunden! Aber «PDF» als Linktext (P-1).
4. **«PDF» angeklickt.** Erwartet: das Protokoll öffnet sich im Browser. Gesehen: Der Browser lädt `Uebergabeprotokoll-B2.pdf` herunter, die Seite bleibt stehen (P-6). Der Inhalt passt (Übergabe an Marco Bernasconi am 30.06.2023).
5. **Wo lege ich künftig ab?** Auf der Mieterseite habe ich das Formular ja schon gesehen. Weil ich unsicher war, ob es noch einen «richtigen» Ort gibt, habe ich in der Seitenleiste «Dokumente» angeklickt (Screenshot `04-documents.png`). Erwartet: eine Ablage mit einem Knopf «Dokument hochladen». Gesehen: eine Liste mit Filtern «Alle» und «Zu versenden», je Eintrag Titel, «Zu <Mieter>, hochgeladen am …» und «Datei herunterladen», aber kein Hochladen und kein Hinweis darauf (P-3). Den Mieternamen konnte ich nicht anklicken (P-4).
6. **Hilfe** (`05-help.png`). Erwartet: ein Abschnitt zu Dokumenten. Gesehen: kein eigener Abschnitt, aber unter «Mieter und Mietverträge verwalten» der Satz «Unter «Dokumente» auf der Seite eines Mieters laden Sie Dateien hoch, etwa ein Übergabeprotokoll (PDF, JPG oder PNG, höchstens 10 MB) …». Damit war es klar, nur das doppelte «Dokumente» hat mich kurz stolpern lassen (P-5).
7. **Handy, Übersicht** (`10-m-dashboard.png`). Gesehen: Menü hinter «Menü öffnen», kein seitliches Scrollen (Breite 390 px).
8. **Handy, Menü → «Dokumente»** (`13-m-menu.png`, `12-m-documents.png`). Gesehen: Einträge untereinander, jeder mit einem grossen Knopf «Datei herunterladen» (48 px hoch, gut zu treffen). Mein Protokoll von 2023 stand als siebter und letzter Eintrag ganz unten (P-4). Getippt: Die Datei wird heruntergeladen.
9. **Handy, Mieterseite Marco** (`11-m-tenant.png`, Ausschnitt `11-m-tenant-crop.png`). Gesehen: Karte «Dokumente» ganz unten, je Eintrag «PDF» oder «JPG» als kleiner Link links und «Löschen» rot rechts daneben. Danach folgt das Formular «Dokument hochladen» über die volle Breite. Kein seitliches Scrollen. Den Link «PDF» habe ich mit 31 × 24 px gemessen (P-2).

## Verwirrung

- **«PDF» / «JPG» als Linktext:** Für mich ist das eine Dateiart, kein Befehl. Ich habe «Öffnen» oder «Ansehen» erwartet.
- **«Dokumente» zweimal:** einmal der Menüpunkt (Liste aller Dokumente und Briefe) und einmal die Karte auf der Mieterseite (mit Hochladen). Dass man nur in der Karte ablegen kann, im Menüpunkt aber nicht, war nicht selbsterklärend.
- **«Dokumente» unter «Nebenkosten» in der Seitenleiste:** Ein Übergabeprotokoll hätte ich dort nicht gesucht.
- **«Zu versenden»:** Für mich als Ablage-Sucherin unklar, ob meine hochgeladenen Dateien auch «versendet» werden müssen. Der Einleitungstext erklärt es, aber erst im dritten Satz.

## Fehlerrisiken

- Auf dem Handy liegen der kleine Link «PDF» und der rote Knopf «Löschen» direkt nebeneinander. Ich habe nicht auf «Löschen» getippt, wie also eine Rückfrage aussieht, weiss ich nicht. Wenn sie fehlt, ist das Protokoll mit einem Fehltipp weg.
- Wer im Menüpunkt «Dokumente» ablegen will und es dort nicht kann, gibt vielleicht auf oder legt die Unterlagen ausserhalb von Dwello ab.
- Nach dem Herunterladen landen mehrere Dateien mit ähnlichen Namen im Download-Ordner (zum Beispiel «Uebergabeprotokoll»). Später weiss man nicht mehr, welche zu wem gehört.

## Vorschläge

- **P-1:** Mieter → Marco Bernasconi → Karte «Dokumente». Ein Verb als Linktext, gleich wie in der Liste, zum Beispiel «Datei öffnen» oder «Datei herunterladen». Den Dateityp kann man klein dazuschreiben («PDF»).
- **P-2:** Auf 390 px die Mieterseite öffnen, ganz nach unten scrollen und die Grösse des Links «PDF» messen (31 × 24 px). Hilfreich wäre ein Knopf mit mindestens 48 px Höhe wie in der Liste «Dokumente», mit mehr Abstand zu «Löschen» oder «Löschen» in einer eigenen Zeile.
- **P-3:** Seitenleiste «Dokumente». Ein Satz in der Einleitung oder über der Liste wie «Dokumente zu einem Mieter laden Sie auf der Seite des Mieters hoch», idealerweise mit Link auf «Mieter».
- **P-4:** Seitenleiste «Dokumente» mit mehreren Uploads. Den Mieternamen als Link auf die Mieterseite machen, oder die ganze Zeile als Link, oder einen Filter beziehungsweise eine Suche nach Mieter anbieten.
- **P-5:** Hilfe, Abschnitt «Mieter und Mietverträge verwalten». Eindeutiger formulieren, etwa «Auf der Seite eines Mieters laden Sie unter «Dokument hochladen» Dateien hoch …», und im Abschnitt zu Briefen sagen, dass der Menüpunkt «Dokumente» auch diese Dateien zeigt.
- **P-6:** Auf «PDF» klicken. Die Datei, wenn möglich, im Browser anzeigen (in einem neuen Tab) statt sie herunterzuladen, oder den Link ehrlich «herunterladen» nennen (siehe P-1).

## Nicht geprüft

- Hochladen, Speichern und Löschen: Die Aufgabe war nur schauen. Ob «Löschen» nachfragt und welche Folge es nennt, habe ich deshalb nicht gesehen.
- Fehlerzustände (zu grosse Datei, falscher Dateityp, Server-Fehler beim Herunterladen): Der Auftrag nannte keine fehlschlagende Anfrage.
- Ein Bild-Dokument (JPG) öffnen: Die JPG-Einträge stammen von anderen Personas, die habe ich nicht angefasst.
- Wie das Dateifeld in einem deutschsprachigen Browser beschriftet ist (siehe Beobachtungen).
- Andere Sprachen (fr/it/en) und der Dunkelmodus.
