# Helga – #573: Verteilschlüssel bleibt nicht mehr rot, wenn die Kategorie ihn bringt

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. App: Persona-Stack auf http://localhost:3300 (Demodaten). Gespeichert nur im Gebäude «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/helga-573/` (`s3.mjs` Hauptablauf, `s4.mjs` Bearbeiten, `s6.mjs` Gegenprobe).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | Neue Rechnung, Rechnung bearbeiten | Kein Befund zur Änderung. Nachdem ich «Hauswart» gewählt habe, füllt Dwello «Pro Fläche (m²)» ein. Danach ist der rote Rahmen weg, der Satz «Wählen Sie, wie die Kosten verteilt werden.» ist verschwunden und das Feld ist nicht mehr als fehlerhaft markiert. Unter «Bearbeiten» ist das Feld ohne Fehler. |

## Beobachtungen

- Das Rechnungsdatum ist schon mit dem heutigen Datum (21.10.2026) ausgefüllt. Deshalb meldet die Seite nach «Rechnung speichern» dort nichts als fehlend. Der Hilfetext sagt zwar «Übernehmen Sie das Datum von der Rechnung, nicht das heutige», aber wenn ich das überlese, speichere ich das falsche Datum, und die Rechnung landet in der falschen Abrechnungsperiode.
- Nach dem Speichern mit leerem Formular springt der Cursor auf «Gebäude», und jedes fehlende Feld hat rot seinen eigenen Satz. Oben steht aber keine Zusammenfassung wie «5 Angaben fehlen». Bei 150 % Zoom ist die Seite sehr lang, und den roten Verteilschlüssel ganz unten sehe ich erst, wenn ich hinunterscrolle.
- «Kategorie» ist als «(optional)» angeschrieben, der Verteilschlüssel aber nicht. Die Fehlermeldung beim Verteilschlüssel sagt nicht, dass ich auch zuerst die Kategorie wählen kann und Dwello ihn dann einsetzt. Das steht nur im Hilfetext darüber («Dwello schlägt den Verteilschlüssel vor, den die letzte Rechnung dieser Kategorie im Gebäude hat …»). Ich habe es erst gemerkt, als das Feld plötzlich ausgefüllt war.
- Gegenprobe ohne Gebäude: Ich habe die Kategorie «Lift» gewählt, ohne ein Gebäude ausgewählt zu haben. Dann bleibt der Verteilschlüssel leer und rot. Das stimmt, denn das Feld ist ja leer. Ich hätte aber nach dem Hilfetext («sonst den aus den Einstellungen») einen Vorschlag erwartet. Wahrscheinlich braucht es dafür zuerst das Gebäude.
- Nach dem Speichern zeigt die Detailseite den Kasten «Abrechnungen nicht aktuell» für die Periode 2025 mit einem langen Rechtstext (Art. 128 OR). Für mich ist das viel auf einmal. Was ich tun soll («Neu berechnen»), steht aber drin.
- In den ganzseitigen Screenshots erscheint die feste Kopfzeile mitten im Bild. Das kommt vom Screenshot, im Fenster ist das nicht so.

## Aufgabe geschafft: ja

## Aufwand

Etwa 3 Minuten und 10 Schritte: Liste öffnen, «Rechnung erfassen», leer speichern, 6 Felder ausfüllen, speichern, dann «Rechnung bearbeiten».

## Ablauf

| # | Schritt | Erwartet | Gesehen |
|---|---|---|---|
| 1 | «Rechnungen» → «Rechnung erfassen» | Ein leeres Formular | «Neue Rechnung» mit den Bereichen «Rechnungsdaten» und «Kategorie und Verteilung». Das Rechnungsdatum ist schon mit 21.10.2026 ausgefüllt, und «Umlagefähig» ist angekreuzt. |
| 2 | «Rechnung speichern» bei leerem Formular | Die Seite sagt mir, was fehlt | Rot sind: Gebäude («Bitte wählen Sie ein Gebäude.»), Betrag («Bitte geben Sie einen gültigen Betrag ein.»), Rechnungssteller, Beschreibung und Verteilschlüssel («Wählen Sie, wie die Kosten verteilt werden.»). Die Kategorie ist nicht rot, weil sie optional ist. Der Cursor steht auf «Gebäude» (`04-nach-speichern-leer.png`). |
| 3 | Gebäude «Seepark Residenz» | Gebäude nicht mehr rot | Stimmt. Noch rot sind Betrag, Rechnungssteller, Beschreibung und Verteilschlüssel. Das passt, denn die habe ich noch nicht ausgefüllt. |
| 4 | Rechnungssteller «Hauswart Huber» | Feld nicht mehr rot | Stimmt. Noch rot sind Betrag, Beschreibung und Verteilschlüssel. |
| 5 | Beschreibung «Treppenhausreinigung Q3» | Feld nicht mehr rot | Stimmt. Noch rot sind Betrag und Verteilschlüssel. |
| 6 | Betrag 450.00 | Feld nicht mehr rot | Stimmt. Noch rot ist nur der Verteilschlüssel. |
| 7 | Rechnungsdatum 30.09.2025 | Datum übernommen | Unter dem Feld steht jetzt «Dienstag, 30. September 2025». Rot ist weiterhin nur der Verteilschlüssel mit rotem Rahmen und Satz (`09-datum.png`). Das passt, denn er ist noch leer. |
| 8 | Kategorie «Hauswart» | Dwello setzt den Verteilschlüssel ein, und das Rot verschwindet | Stimmt. Der Verteilschlüssel zeigt «Pro Fläche (m²)», der Rahmen ist grau, und der Satz ist weg (`10-kategorie.png`). Auf der Seite ist nichts mehr als fehlend markiert. «Pro Fläche (m²)» ist derselbe Verteilschlüssel wie bei der letzten Hauswart-Rechnung im Seepark («Facility Service AG, Hauswartung Q4 2025»). |
| 9 | «Rechnung speichern» | Die Rechnung wird gespeichert | Die Detailseite «Hauswart Huber» zeigt 30.09.2025, CHF 450.00, Seepark Residenz, Kategorie Hauswart, Verteilschlüssel «Pro Fläche (m²)» und «Umlagefähig». Dazu kommt der Hinweis «Abrechnungen nicht aktuell» (`11-nach-speichern.png`). |
| 10 | «Rechnung bearbeiten», nichts ändern | Verteilschlüssel ohne Fehler | Der Verteilschlüssel zeigt «Pro Fläche (m²)», der Rahmen ist grau, und es gibt keinen Fehlersatz. Kein einziges Feld ist als fehlerhaft markiert (`13-bearbeiten.png`). Ich habe nicht gespeichert. |
| Gegenprobe | Neue Rechnung leer speichern, dann den Verteilschlüssel «Pro Einheit» von Hand wählen und danach wieder auf «auswählen» zurückstellen | Rot verschwindet und kommt wieder | Stimmt: Nach meiner Wahl ist das Feld nicht mehr rot, nach dem Zurückstellen wieder rot mit dem Satz. Diese Rechnung habe ich nicht gespeichert. |

## Verwirrung

- «Verteilschlüssel»: Mit dem Hilfetext verstehe ich es («Wie die Kosten auf die Wohnungen des Gebäudes verteilt werden»). Ob «Pro Fläche» für den Hauswart richtig ist, kann ich nicht beurteilen. Dass Dwello den Schlüssel der letzten Rechnung übernimmt, beruhigt mich aber.
- «Kategorie (optional)», obwohl die Kategorie den Verteilschlüssel mitbringt: Ich wusste nicht, ob ich die Kategorie wählen soll oder nicht.
- Beim Rechnungsdatum war ich unsicher, ob das heutige Datum stimmt. Es ist ja schon ausgefüllt.

## Fehlerrisiken

- Das vorausgefüllte heutige Datum: Wer es nicht ändert, speichert ein falsches Rechnungsdatum und damit eine falsche Abrechnungsperiode. Die Seite warnt dabei nicht.
- Der vorgeschlagene Verteilschlüssel wird stillschweigend eingesetzt. Wer nicht hinschaut, übernimmt ihn ungeprüft. Der Hilfetext erklärt das aber.

## Vorschläge

Es gibt keine Befund-IDs. Für die Beobachtungen:
- Rechnungsdatum leer lassen oder beim heutigen Datum einen Hinweis zeigen. Dann bemerkt man ein vergessenes Rechnungsdatum.
- In der Fehlermeldung beim Verteilschlüssel ergänzen: «… oder wählen Sie zuerst die Kategorie.»
- Nach einem abgelehnten Speichern oben eine kurze Zusammenfassung der fehlenden Angaben zeigen.

## Nicht geprüft

- 200 % Zoom: In dieser Runde nur 150 %.
- Eine Kategorie ohne frühere Rechnung im Gebäude, bei der der Vorschlag aus den Einstellungen kommen müsste. Ich habe nur «Lift» ohne Gebäude ausprobiert.
- Leeren eines Feldes unter «Bearbeiten» mit anschliessendem Speichern: Das war laut Aufgabe nicht verlangt.
