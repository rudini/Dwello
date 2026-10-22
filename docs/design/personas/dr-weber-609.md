# Persona-Review: Dr. Weber, Slice 609 (Verlauf und PDF einer Abrechnung)

Desktop 1440 × 900, Maus, Persona-App auf http://localhost:3300 mit frischen Demodaten. Nichts gespeichert, nichts versendet, nichts markiert. Skripte, Screenshots und die heruntergeladenen PDFs liegen in `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/dr-weber-609/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung (versendet/bezahlt), Karte «Verlauf» | «PDF erstellt 22.10.2026, 11:07» steht vor «Versendet 28.09.2026» (Hans Müller) bzw. «Versendet 14.04.2025» (Kevin Fischer). Damit wäre das PDF erst nach dem Versand entstanden, was zeitlich unmöglich ist. Die Liste ist auch nicht nach Datum geordnet. Vermutlich kommt das von den Demodaten (Ladezeitpunkt), aber genau so sehe ich es. |
| P-2 | Minor | Abrechnung (Entwurf), Verlauf und «PDF herunterladen» | Beim Entwurf sagt der Verlauf vor und nach dem Herunterladen (auch nach dem Neuladen) nur «Erstellt». Nirgends steht, dass das PDF eines Entwurfs bei jedem Klick neu erzeugt und nicht aufbewahrt wird. Aus dem Fehlen eines Eintrags muss ich das selbst schliessen. |
| P-3 | Nit | Abrechnung (versendet), Verlauf | «PDF erstellt» sagt nicht, dass «PDF herunterladen» genau dieses aufbewahrte PDF liefert, also das versendete. Das stimmt zwar (siehe Ablauf), steht aber nirgends. |
| P-4 | Nit | Verlauf | «Erstellt» und «PDF erstellt» haben eine Uhrzeit, «Versendet» und «Bezahlt» nur ein Datum. Darum lässt sich die Reihenfolge am selben Tag nicht prüfen. |

## Beobachtungen

- Das heruntergeladene PDF von Pierre Dubois ist französisch («Décompte des charges», auch der PDF-Titel). Die Oberfläche sagt mir das vor dem Herunterladen nicht. Ein Hinweis wie «PDF in der Sprache des Mieters: Französisch» fehlt. Hans Müllers PDF ist deutsch.
- Im PDF von Kevin Fischer steht «Abrechnungsdatum 14.04.2025», das PDF selbst wurde laut Verlauf und PDF-Metadaten am 22.10.2026 erzeugt. Das gehört zum Widerspruch in P-1.
- Der Download funktioniert beim Entwurf und bei der versendeten Abrechnung: Antwort 200, `application/pdf`, Dateiname = Abrechnungsnummer (`NK-11111111-2025-0003.pdf`).
- Die Liste hat pro Zeile einen eigenen Link «PDF» mit einer guten Vorlesebeschriftung («PDF herunterladen: Abrechnung NK-11111111-2025-0003 von Pierre Dubois»).

## Aufgabe geschafft: ja

## Aufwand

Etwa 12 Minuten, 9 Schritte: Liste, Entwurf Dubois, Download, Neuladen, zweiter Download, Hans Müller (versendet) mit Download und Neuladen, zweiter Download, Kevin Fischer (bezahlt) zum Vergleich, PDFs mit pdfinfo/pdftotext prüfen.

## Ablauf

1. **Nebenkostenabrechnungen öffnen.** Erwartet: eine Liste mit Status. Gesehen: 17 Abrechnungen, Pierre Dubois NK-11111111-2025-0003 im Status «Entwurf», Nachzahlung CHF 142.35. Hans Müller NK-11111111-2025-0001 ist die einzige im Status «Versendet».
2. **Entwurf Dubois öffnen, Verlauf lesen.** Erwartet: ein Hinweis zum PDF. Gesehen: Verlauf «Erstellt 22.10.2026, 11:07», sonst nichts. Oben stehen «PDF herunterladen» und «Per E-Mail senden», ohne Erklärung, was mit dem PDF eines Entwurfs geschieht.
3. **«PDF herunterladen» klicken.** Erwartet: entweder ein Eintrag im Verlauf oder der Hinweis «Vorschau, wird nicht aufbewahrt». Gesehen: Die Datei `NK-11111111-2025-0003.pdf` kommt (französisch, 2 Seiten, mit Zahlteil). Der Verlauf bleibt unverändert bei «Erstellt».
4. **Seite neu laden.** Erwartet: Wenn das PDF gespeichert worden wäre, stünde jetzt «PDF erstellt» da. Gesehen: weiterhin nur «Erstellt». Daraus schliesse ich: Ein Entwurf bewahrt kein PDF auf.
5. **Zweiter Download des Entwurfs.** Gesehen: andere Datei (andere Prüfsumme), Erstellzeit im PDF 09:10:14 UTC statt 09:09:43 UTC. Das PDF wird also jedes Mal neu erzeugt. Das passt zum leeren Verlauf, steht aber nirgends.
6. **Versendete Abrechnung Hans Müller öffnen.** Erwartet: Im Verlauf steht, wann das versendete PDF entstanden ist. Gesehen: «Erstellt 22.10.2026, 11:07 / PDF erstellt 22.10.2026, 11:07 / Versendet 28.09.2026», die Liste ist nicht chronologisch. Der Screenshot `mueller-verlauf.png` zeigt die Karte «Verlauf» mit diesen drei Zeilen untereinander, das Datum jeweils rechtsbündig. Das PDF wäre demnach dreieinhalb Wochen nach dem Versand entstanden (P-1).
7. **PDF Müller herunterladen, neu laden, nochmals herunterladen.** Gesehen: Beide Dateien sind byte-gleich. Die Erstellzeit im PDF (09:07:57 UTC = 11:07 Ortszeit) entspricht genau «PDF erstellt 11:07». Der Verlauf ändert sich durch den Download nicht. Abrechnungsdatum im PDF: 28.09.2026, wie auf der Seite.
8. **Zum Vergleich: bezahlte Abrechnung Kevin Fischer.** Gesehen: «Erstellt 22.10.2026, 11:07 / PDF erstellt 22.10.2026, 11:07 / Versendet 14.04.2025 / Bezahlt 05.05.2025». Die Erstellzeit im PDF ist wieder 11:07, das Abrechnungsdatum im PDF 14.04.2025.
9. **Abgleich.** Der Verlauf passt technisch zu dem, was ich herunterladen kann: Beim Entwurf gibt es keinen Eintrag und jedes Mal ein neues PDF. Bei versendeten Abrechnungen gibt es einen Eintrag und immer dasselbe aufbewahrte PDF mit genau dieser Erstellzeit. Nur das Datum dieses Eintrags widerspricht dem Versanddatum (P-1).

## Verwirrung

- «PDF erstellt»: Heisst das «das PDF, das der Mieter bekommen hat» oder nur «irgendwann wurde ein PDF erzeugt»? Erst durch Prüfsummen und Metadaten habe ich herausgefunden, dass es das aufbewahrte, versendete PDF ist. Eine normale Vermieterin kann das nicht.
- Beim Entwurf: Ist das heruntergeladene PDF schon «das» PDF? Wenn ich es ausdrucke und von Hand übergebe, gilt dann dieses oder das, das Dwello beim Versenden erzeugt?
- Die Sprache des PDFs (französisch) war für mich eine Überraschung.

## Fehlerrisiken

- Eine Vermieterin lädt den Entwurf herunter, übergibt ihn auf Papier und versendet später per E-Mail. Danach gibt es zwei verschiedene PDFs. Der Verlauf zeigt nur das spätere. Mit Fristen und Beweisen kann das im Streitfall heikel werden.
- Bei einer Rückfrage des Mieters würde ich den Verlauf als Beleg zeigen. Mit «PDF erstellt» nach «Versendet» (P-1) wirkt er unglaubwürdig.

## Vorschläge

- **P-1:** Nebenkostenabrechnungen → «Hans Müller NK-11111111-2025-0001» → Karte «Verlauf» (dasselbe bei Kevin Fischer). In den Demodaten sollte «PDF erstellt» am Versanddatum oder davor liegen, dann wäre der Verlauf glaubwürdig. Ausserdem sollte die Liste nach Datum geordnet sein. Wenn das bei echten Daten nie vorkommen kann, genügt die Korrektur der Demodaten.
- **P-2:** Nebenkostenabrechnungen → «Pierre Dubois NK-11111111-2025-0003» (Entwurf) → «PDF herunterladen» → Seite neu laden. Hilfreich wäre ein sichtbarer Satz beim Knopf oder im Verlauf, z. B. «Entwurf: Das PDF wird bei jedem Herunterladen neu erstellt und nicht aufbewahrt. Beim Versenden bewahrt Dwello das versendete PDF auf.»
- **P-3:** Versendete Abrechnung öffnen → Verlauf. Hilfreich wäre ein Hilfetext wie «PDF erstellt: Dieses PDF wurde versendet. ‹PDF herunterladen› liefert genau dieses PDF.»
- **P-4:** Versendete Abrechnung → Verlauf. «Versendet» und «Bezahlt» wie die anderen Einträge mit Uhrzeit zeigen, wo eine bekannt ist.

## Nicht geprüft

- Wie der Verlauf aussieht, wenn ich einen Entwurf selbst versende oder als versendet markiere: Laut Auftrag darf ich nichts versenden und nichts markieren.
- «Abrechnung berichtigen» bei einer versendeten Abrechnung (ob danach ein neues «PDF erstellt» kommt): Das hätte gespeichert.
- Ob P-1 nur in den Demodaten vorkommt: Echte Abläufe kann ich ohne Versand nicht erzeugen.
- Die Beträge im PDF habe ich nicht nachgerechnet; das ist Aufgabe des Daten-Prüfers.
