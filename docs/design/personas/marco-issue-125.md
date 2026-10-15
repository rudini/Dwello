# Persona-Lauf: Marco – Issue #125 (PDF einer gelöschten Abrechnung)

Marco, 38, Smartphone (390 × 844, Touch), wenig Zeit. Persona-App auf http://localhost:3300 (Datenbank `dwello_persona`, Demodaten). Gespeichert bzw. gelöscht nur im Gebäude «Musterhaus Zentrum».

Aufgabe: Den Entwurf 2025 von Anna Schmidt (Musterhaus Zentrum, Wohnung 1.02) in zwei Tabs öffnen, die Liste der Nebenkostenabrechnungen in einem dritten Tab. In einem Tab löschen, dann in den anderen Tabs «PDF herunterladen» und den PDF-Knopf der Liste antippen. Danach prüfen, ob das PDF von Pierre Dubois (2.01) noch herunterlädt. Das Ganze auf Deutsch und einmal auf Italienisch.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/marco-issue-125/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Tab nach «PDF herunterladen» (Detail) und nach «PDF» (Liste) für eine gelöschte Abrechnung | Auf dem Handy ist der Satz «Abrechnung nicht gefunden.» winzig. Die Seite ist reiner Text ohne Mobil-Layout, wird 980 px breit dargestellt und auf 390 px verkleinert, in Maschinenschrift oben links. Ohne Zoomen mit zwei Fingern kann ich ihn nicht lesen. |
| P-2 | Minor | dieselbe Seite | Der Satz sagt nur, was passiert ist, aber nicht, was ich tun soll (z. B. «Die Abrechnung wurde gelöscht. Gehen Sie zurück zur Liste.»). Es gibt keinen Link zurück zu Dwello, keine Kopfzeile und kein Menü. Zurück komme ich nur mit der Zurück-Geste des Browsers. |
| P-3 | Nit | dieselbe Seite | Der Tab hat keinen Titel. In der Tab-Übersicht des Handys sehe ich nur die URL `…/api/statements/<id>/pdf` und weiss nicht, welcher Tab das ist. |
| P-4 | Nit | Liste, PDF-Knopf | Das PDF aus der Liste heisst `statement-<id>.pdf` (Englisch, auch in der deutschen Oberfläche). Aus der Detailseite heisst das gleiche PDF `abrechnung-<id>.pdf`. In meinem Download-Ordner landen so zwei verschieden benannte Dateien für dieselbe Abrechnung. |

## Beobachtungen

- Nach dem Löschen landet Tab A auf `/statements` **ohne** den Filter «Entwurf». Vorher war ich in der Entwurfsliste; jetzt zeigt die Seite «15 Abrechnungen» über zwei Seiten. Die Bestätigung «Abrechnung NK-11111111-2025-0002 gelöscht» erscheint als Meldung und überdeckt dabei teilweise das Feld «Gebäude (optional)» (Screenshot `11-A-after-delete.png`).
- Der Löschdialog ist gut: «Die Abrechnung NK-11111111-2025-0002 von Anna Schmidt wird gelöscht. Das lässt sich nicht rückgängig machen.»
- Mit der Zurück-Geste von der Fehlerseite zeigt Tab B wieder die alte Detailseite der gelöschten Abrechnung, mit Status «Entwurf» und allen Knöpfen. Nichts sagt mir, dass die Abrechnung inzwischen weg ist. Ich könnte «PDF herunterladen» erneut antippen und lande wieder auf der Fehlerseite. Tab C (Liste) zeigt nach «Zurück» ebenfalls noch den alten Stand.
- Die Anzahl der Entwürfe sprang nach meinem Löschen von 7 auf 5. Wahrscheinlich hat die andere Persona in Seepark Residenz gleichzeitig etwas gelöscht; das zählt nicht als Befund.
- Auf der Detailseite heisst der Knopf «PDF herunterladen», nicht «Herunterladen» wie im Auftrag. Das PDF von Anna war schon erstellt («PDF erstellt 15.10.2026, 08:24»), ich musste es nicht erzeugen.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 12 Schritte: 3 Tabs öffnen, löschen und bestätigen, 2 PDF-Taps auf die gelöschte Abrechnung, 2× zurück, 2 PDF-Taps für Pierre auf Deutsch, Sprache auf Italienisch wechseln, 1 PDF-Tap für Pierre auf Italienisch, 2 Aufrufe der gelöschten Abrechnung auf Italienisch.

## Ablauf

1. **Tab A und B: Detailseite von Anna Schmidt, Tab C: Liste der Entwürfe.**
   - Erwartet: Detailseite mit einem Download-Knopf.
   - Gesehen: «Abrechnung NK-11111111-2025-0002», «Anna Schmidt, Musterhaus Zentrum, Wohnung 1.02», ganz oben der Link «PDF herunterladen». Die Liste zeigt pro Zeile einen kleinen Link «PDF».
2. **Tab A: «Abrechnung löschen» antippen und im Dialog bestätigen.**
   - Erwartet: eine Rückfrage, danach zurück zur Liste.
   - Gesehen: wie erwartet. Die Liste ist allerdings ungefiltert (siehe Beobachtungen).
3. **Tab B (noch der alte Stand): «PDF herunterladen» antippen.**
   - Erwartet: ein verständlicher Hinweis, dass es die Abrechnung nicht mehr gibt, und ein Weg zurück.
   - Gesehen: Der Tab wechselt zu `/statements/<id>/pdf`. Die Antwort ist 404, als reiner Text. Auf weisser Seite steht oben links in winziger Maschinenschrift «Abrechnung nicht gefunden.» (Screenshot `12-B-detail-pdf.png`, als 980 px breite Seite dargestellt). Es gibt keinen Link und kein Menü. Kein JSON mehr, das ist besser. Aber auf dem Handy muss ich zoomen, um den Satz überhaupt zu lesen.
4. **Tab C (Liste, alter Stand): «PDF» bei Anna Schmidt antippen.**
   - Erwartet: dasselbe wie in Schritt 3, im gleichen Tab.
   - Gesehen: Der gleiche Tab wechselt zu `/api/statements/<id>/pdf` (es geht kein neuer Tab auf). Darauf derselbe winzige Satz «Abrechnung nicht gefunden.» (`13-C-list-pdf.png`).
5. **Zurück-Geste in Tab B und C.**
   - Erwartet: zurück in Dwello, im besten Fall mit dem aktuellen Stand.
   - Gesehen: Ich bin zurück, sehe aber den alten Stand: Detailseite und Liste zeigen die gelöschte Abrechnung noch (`14-C-back.png`, `15-B-back.png`).
6. **Pierre Dubois, Entwurf 2025: «PDF» in der Liste antippen.**
   - Erwartet: Das PDF lädt herunter, und ich bleibe auf der Liste.
   - Gesehen: Antwort 200 als PDF, Download `statement-f6ab72d6-….pdf` (gültige PDF-Datei, 24.8 kB). Ich bleibe auf der Liste.
7. **Pierre Dubois, Detailseite: «PDF herunterladen».**
   - Erwartet: ebenso.
   - Gesehen: Antwort 200, Download `abrechnung-f6ab72d6-….pdf` (gleicher Inhalt, anderer Dateiname). Ich bleibe auf der Seite.
8. **Sprachmenü «Sprache: Deutsch» → «Italiano».**
   - Gesehen: Die Liste heisst nun «Conteggi spese accessorie», der Link lautet «Scaricare il PDF: Conteggio … di Pierre Dubois». Das PDF von Pierre lädt auch auf Italienisch herunter.
9. **Gelöschte Abrechnung auf Italienisch.**
   - Weil Anna nicht mehr in der Liste steht, habe ich die beiden Download-Adressen aus den alten Tabs erneut aufgerufen.
   - Gesehen: «Conteggio non trovato.», auf beiden Wegen gleich und in gleicher Darstellung: winzig, ohne Link, ohne Tab-Titel (`25-…`, `26-…`). Die Sprache stimmt.

## Verwirrung

- «Abrechnung nicht gefunden.» klingt, als hätte ich mich vertippt oder als sei etwas kaputt. Dass die Abrechnung **gelöscht** wurde, steht nirgends. Ich hatte sie selbst gelöscht und wusste es; jemand, der den alten Tab später findet, wüsste es nicht.
- Die Seite sieht nicht nach Dwello aus: kein Logo, keine Farben, Maschinenschrift. Kurz dachte ich, das Handy zeige eine Systemmeldung.

## Fehlerrisiken

- Unterwegs übersehe ich den winzigen Satz leicht und halte die Seite für leer oder hängend. Dann tippe ich erneut oder gebe auf.
- Nach «Zurück» wirkt die gelöschte Abrechnung wieder vorhanden. Ich könnte glauben, das Löschen habe nicht geklappt.
- Zwei Dateinamen für dasselbe PDF führen im Download-Ordner zu Duplikaten oder dazu, dass ich die falsche Datei an den Mieter schicke.

## Vorschläge

- **P-1:** Mobil (390 px) einen Entwurf in zwei Tabs öffnen, in einem löschen und im anderen «PDF herunterladen» bzw. den PDF-Link der Liste antippen. Hilfreich wäre eine kleine HTML-Seite mit Viewport-Angabe und normaler Schriftgrösse, am besten im Dwello-Layout, statt reinem Text.
- **P-2:** Gleiche Schritte. Hilfreich wäre ein zweiter Satz mit dem nächsten Schritt («Sie wurde möglicherweise gelöscht. Öffnen Sie die Liste der Nebenkostenabrechnungen.») und ein Link oder Knopf «Zur Liste der Nebenkostenabrechnungen».
- **P-3:** Gleiche Schritte, dann die Tab-Übersicht ansehen. Hilfreich wäre ein Seitentitel, z. B. «Abrechnung nicht gefunden – Dwello».
- **P-4:** Bei Pierre Dubois das PDF einmal aus der Liste und einmal aus der Detailseite laden. Hilfreich wäre auf beiden Wegen derselbe Dateiname in der Sprache der Oberfläche, am besten mit der Abrechnungsnummer statt der internen ID. Vielleicht war das schon vor der Änderung so; das bitte am Basis-Commit prüfen.

## Nicht geprüft

- Ein echtes Handy mit eingebautem PDF-Viewer: Die Test-Chromium lädt PDFs nur herunter und zeigt sie nicht an. Ob das PDF im Tab angezeigt wird, konnte ich daher nicht beurteilen, nur dass kein neuer Tab aufgeht und der Download startet.
- Auf Italienisch habe ich die gelöschte Abrechnung nicht über einen angetippten Knopf erreicht, sondern über die Adressen aus den alten Tabs. Nach dem Sprachwechsel stand Anna nicht mehr in der Liste.
- Französisch und Englisch.
- Andere Fehlerfälle als «gelöscht» (z. B. Server nicht erreichbar): Der Auftrag nannte keine Anfrage, die ich fehlschlagen lassen sollte.
