# Dr. Weber – Runde W3: Abrechnungsnummer, PDF-Dateien, Löschen und neu Erstellen

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Persona-App http://localhost:3300, Demodaten. Gespeichert nur in «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/6050a3a3-7490-5b40-bfeb-092820c8b3e3/scratchpad/weber-w3/` (heruntergeladene PDFs in `dl/`).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Bestätigung «Abrechnung löschen» (Detailseite) | Der Dialog sagt nur «Die Abrechnung NK-22222222-2025-0003 von Nina Brunner wird gelöscht. Das lässt sich nicht rückgängig machen.» Er sagt nicht, dass die Nummer 0003 nicht wieder vergeben wird und dass die neu erstellte Abrechnung eine neue Nummer bekommt. Gerade wenn ich das PDF schon verschickt habe, muss ich das wissen, bevor ich lösche. |
| P-2 | Minor | Liste der Abrechnungen, Detailseite der neuen Abrechnung | Nach dem neu Erstellen heisst Nina Brunners Abrechnung NK-22222222-2025-0005. Zwischen 0002 und 0004 fehlt 0003, und nirgends steht warum. Die Suche nach «NK-22222222-2025-0003» zeigt «Keine Abrechnungen gefunden»; der Verlauf der neuen Abrechnung zeigt nur «Erstellt» und «PDF erstellt», keinen Hinweis, dass sie 0003 ersetzt. Fragt die Mieterin nach dem Schreiben mit 0003, finde ich in Dwello keine Spur davon. |

## Beobachtungen

- Das PDF eines Entwurfs ist nicht als Entwurf gekennzeichnet: Es sieht genau aus wie eine gültige Abrechnung (Abrechnungsnr., Abrechnungsdatum, Rückerstattungsfrist). Genau so passiert der Fehler, den ich in dieser Aufgabe annehmen sollte.
- PDF aus der Detailseite und PDF aus der Liste sind dieselbe Datei: beide heissen `NK-22222222-2025-0001.pdf` und sind Byte für Byte gleich (3720 Bytes). Der Dateiname ist die Abrechnungsnummer, die auch im Kopf jeder Seite («NK-22222222-2025-0001 · Seite 1 von 1») und unter dem Titel («Abrechnungsnr. NK-22222222-2025-0001 · Abrechnungsdatum 16.10.2026») steht. Das ist gut so.
- Das alte (0003) und das neue PDF (0005) von Nina Brunner unterscheiden sich nur in der Nummer und in der Reihenfolge einer Zeile: «Hauswart» steht im neuen PDF an anderer Stelle der Kostenübersicht. Beträge identisch (Rückerstattung CHF 93.85). Die geänderte Reihenfolge irritiert beim Vergleichen zweier Fassungen.
- Die neu erstellte Abrechnung hat zunächst kein PDF: In der Liste fehlt in ihrer Zeile der Link «PDF», auf der Detailseite steht «PDF erstellen» statt «PDF herunterladen». Bei den Demo-Entwürfen war das PDF schon da. Nach Klick auf «PDF erstellen» erscheint «PDF herunterladen» und im Verlauf «PDF erstellt».
- Assistent Schritt 4: Die Warnung «Es gibt schon Abrechnungen … schon 3 Nebenkostenabrechnungen» verlangt das Häkchen «Die Abrechnungen trotzdem erstellen». Sie erklärt gut, dass nur der Mietvertrag ohne Abrechnung eine neue bekommt (Vorschau: nur Nina Brunner, 1 Abrechnung). Eine künftige Nummer zeigt die Vorschau nicht.
- Nach dem Löschen erscheint die Meldung «Abrechnung NK-22222222-2025-0003 gelöscht» über der Liste, die Zähler gehen von 7 auf 6 Entwürfe. Die Meldung nennt die Nummer, was ich schätze.
- Die Hilfe-Seite sagt nichts über Abrechnungsnummern oder das Löschen von Abrechnungen.
- In der Liste stehen Sarah Meier (0002) und Nina Brunner beide bei Wohnung A2 für 2025, das ist ein Mieterwechsel (Nina Brunner 184 Mietstage). Passt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 Minuten, rund 20 Schritte: Liste öffnen, Detailseite Thomas Weber, zweimal PDF herunterladen (Detail und Liste), Detailseite Nina Brunner, PDF herunterladen, löschen und bestätigen, Assistent mit 5 Schritten (Periode, Gebäude, Heizprofil, Vorschau mit Häkchen, Erstellen), Liste der Entwürfe, neue Detailseite, «PDF erstellen», PDF herunterladen, Suche nach der alten Nummer.

## Ablauf

1. **Liste «Nebenkostenabrechnungen».** Erwartet: die Entwürfe 2025 von Seepark Residenz mit Nummer. Gesehen: 17 Abrechnungen; Seepark Residenz 2025: Thomas Weber 0001, Sarah Meier 0002, Nina Brunner 0003, Marco Bernasconi 0004, alle «Entwurf», jede Zeile mit «PDF». Der PDF-Link hat den zugänglichen Namen «PDF herunterladen: Abrechnung NK-22222222-2025-0001 von Thomas Weber».
2. **Detailseite Thomas Weber.** Erwartet: Nummer im Titel. Gesehen: «Abrechnung NK-22222222-2025-0001», Status Entwurf, Kostenaufstellung, Saldo Rückerstattung CHF 34.55, Verlauf «Erstellt», «PDF erstellt».
3. **PDF von der Detailseite.** Erwartet: ein Dateiname, an dem ich die Abrechnung erkenne. Gesehen: `NK-22222222-2025-0001.pdf`.
4. **PDF aus der Liste.** Erwartet: dieselbe Datei. Gesehen: wieder `NK-22222222-2025-0001.pdf`, inhaltlich identisch. Im PDF steht die Nummer im Seitenkopf und in der Zeile «Abrechnungsnr.». Zuordnung eindeutig. Aber: nirgends «Entwurf».
5. **Detailseite Nina Brunner, PDF.** Datei `NK-22222222-2025-0003.pdf` (das «verschickte» PDF), 2 Seiten, Rückerstattung CHF 93.85.
6. **«Abrechnung löschen».** Erwartet: eine Bestätigung, die sagt, was mit der Nummer passiert, und vielleicht eine Warnung für schon verschickte PDFs. Gesehen: Dialog «Abrechnung löschen – Die Abrechnung NK-22222222-2025-0003 von Nina Brunner wird gelöscht. Das lässt sich nicht rückgängig machen.» mit «Abbrechen» und «Abrechnung löschen». Nichts zur Nummer (P-1).
7. **Bestätigt.** Zurück auf der Liste, Meldung «Abrechnung NK-22222222-2025-0003 gelöscht», 16 Abrechnungen, 6 Entwürfe.
8. **«Abrechnungen erstellen», Schritt 1.** Periode 01.01.2025 – 31.12.2025 vorgeschlagen. Weiter.
9. **Schritt 2 Gebäude.** Bei Seepark Residenz: «Von 4 Mietverträgen in dieser Abrechnungsperiode haben 3 schon eine Abrechnung …». Musterhaus Zentrum: es entsteht keine neue Abrechnung. Seepark Residenz gewählt.
10. **Schritt 3.** Heizprofil «Heizung + Warmwasser», Verwaltungspauschale 3 %, unverändert. Weiter.
11. **Schritt 4 Vorschau.** 1 Abrechnung, Nina Brunner, Wohnung A2, Kosten CHF 1’346.13, Rückerstattung CHF 93.85. Warnung «Es gibt schon Abrechnungen»; ohne Häkchen kommt «Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.» Häkchen gesetzt. Erwartet: eine Angabe, welche Nummer entsteht. Gesehen: keine.
12. **Schritt 5.** «Es wird 1 Nebenkostenabrechnung als Entwurf erstellt. Es wird nichts verschickt.» «Entwürfe erstellen» geklickt. Ergebnis: «1 Nebenkostenabrechnung ist als Entwurf erstellt.»
13. **Liste der Entwürfe.** Erwartet hatte ich, ehrlich gesagt, offen: entweder wieder 0003 oder eine neue Nummer. Gesehen: Nina Brunner **NK-22222222-2025-0005** zuoberst, dann 0004, 0002, 0001. 0003 fehlt, ohne Erklärung (P-2). Ihre Zeile hat noch keinen PDF-Link.
14. **Detailseite der neuen Abrechnung.** «Abrechnung NK-22222222-2025-0005», Beträge gleich wie vorher, Verlauf nur «Erstellt». «PDF erstellen» geklickt, dann «PDF herunterladen»: `NK-22222222-2025-0005.pdf`, Nummer im Kopf und bei «Abrechnungsnr.».
15. **Suche nach «NK-22222222-2025-0003».** «Keine Abrechnungen gefunden».

**Urteil zur Plausibilität:** Dass die neue Abrechnung eine neue, höhere Nummer bekommt (0005, nach der höchsten bestehenden 0004) und 0003 nicht wieder vergeben wird, halte ich für richtig und vorsichtig: Ein schon verschicktes PDF mit 0003 kann so nie mit einer anderen Fassung unter derselben Nummer verwechselt werden. Die anderen Nummern (0001, 0002, 0004) bleiben unverändert, auch das ist richtig. Was fehlt, ist die Erklärung: Weder Löschdialog noch Liste noch Detailseite sagen das. Ich musste es selbst herausfinden, indem ich es ausprobierte.

## Verwirrung

- «Die Abrechnungen trotzdem erstellen»: Das «trotzdem» klingt, als täte ich etwas Riskantes, obwohl gerade nur die fehlende Abrechnung entsteht. Der Text darüber erklärt es aber.
- Warum hat die neue Abrechnung kein PDF, die alten Entwürfe aber schon? «PDF erstellen» vs. «PDF herunterladen» ist verständlich, der Unterschied zur Ausgangslage nicht.
- Die Lücke 0003 in der Liste: Ohne mein eigenes Wissen hätte ich gedacht, da sei etwas verloren gegangen.

## Fehlerrisiken

- Ein Entwurfs-PDF lässt sich herunterladen und weitergeben, ohne dass es als Entwurf erkennbar ist. Genau so geht ein falsches Schreiben an die Mieterin.
- Nach dem Löschen gibt es in Dwello keine Spur der Nummer 0003. Hat die Mieterin das Schreiben mit 0003, kann ich nicht nachweisen, was darin stand oder dass es ersetzt wurde (ausser mit meiner eigenen Kopie der Datei).
- Wer den Löschdialog bestätigt in der Annahme, die neue Abrechnung bekomme wieder 0003, schickt der Mieterin vielleicht ein Begleitschreiben mit der falschen Nummer.

## Vorschläge

- **P-1:** Reproduktion: Liste «Nebenkostenabrechnungen» → Nina Brunner (NK-22222222-2025-0003) → «Abrechnung löschen». Der Dialog nennt nur Löschen und «nicht rückgängig». Hilfreich: ein Satz wie «Die Nummer NK-22222222-2025-0003 wird nicht wieder vergeben. Erstellen Sie die Abrechnung neu, erhält sie eine neue Nummer. Haben Sie das PDF schon verschickt, teilen Sie der Mieterin mit, dass die neue Abrechnung sie ersetzt.»
- **P-2:** Reproduktion: wie P-1 löschen, dann «Abrechnungen erstellen» für 2025, Seepark Residenz, mit Häkchen «trotzdem erstellen» → Liste zeigt Nina Brunner NK-22222222-2025-0005, 0003 fehlt; Suche nach 0003 findet nichts; Verlauf der neuen Abrechnung zeigt nur «Erstellt». Hilfreich: ein kurzer Hilfetext bei der Abrechnungsnummer (Detailseite), dass Nummern gelöschter Abrechnungen nicht wieder vergeben werden; oder ein Verlaufseintrag/Hinweis «Ersetzt die gelöschte Abrechnung NK-22222222-2025-0003», wenn für denselben Mietvertrag und dieselbe Periode neu erstellt wird.

## Nicht geprüft

- Löschen einer versendeten oder bezahlten Abrechnung: nicht in der Aufgabe, und die versendete gehört zu «Musterhaus Zentrum», das ich nicht ändern durfte.
- Ob eine gelöschte Nummer auch dann nicht wiederkommt, wenn ich die höchste Nummer (0004) lösche: nicht probiert, um nicht weitere Daten zu ändern.
- Ob das PDF mit Einzahlungsschein (Nachzahlung) die Nummer im QR-Teil trägt: Thomas Weber und Nina Brunner haben Rückerstattungen, also keinen QR-Einzahlungsschein.
- Andere Sprachen und andere Bildschirmgrössen.
