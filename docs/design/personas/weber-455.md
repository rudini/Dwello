# Persona-Review: Dr. Weber, Akontorechnungen und Schlussrechnung (#455)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus.
App: http://localhost:3300 (Persona-Stack, Demodaten), Gebäude «Musterhaus Zentrum» (Speichern dort Teil der Aufgabe).
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/weber-455/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Rechnungen hochladen (Hinweis Schlussrechnung), Rechnungsseite und «Rechnung bearbeiten» (Hinweis am Betrag) | Für eine schon abgerechnete Akontorechnung rät Dwello, den Restbetrag der Schlussrechnung in die **nächste** Abrechnungsperiode zu schieben («lassen Sie den Leistungszeitraum erst nach der Abrechnungsperiode beginnen»), bei einem Überschuss (weniger als 0) aber, die **alten** Abrechnungen zu berichtigen. Damit zahlt bei einer Nachbelastung der Mieter der Folgeperiode Kosten einer Zeit, in der er vielleicht noch gar nicht wohnte. Das widerspricht Art. 257b OR (tatsächliche Kosten der Periode) und dem eigenen Satz der Leistungszeitraum-Hilfe «Wer später einzieht, zahlt nur für seine Zeit». Die beiden Fälle werden ungleich behandelt. |
| P-2 | Minor | Rechnungsseite und «Rechnung bearbeiten» (Hinweis am Betrag) | «Prüfen Sie, dass sie nur einmal zählen: Die Akontorechnungen sind nicht zusätzlich erfasst.» Der zweite Satz steht im Indikativ und klingt wie ein Prüfergebnis von Dwello («sind nicht erfasst»), ist aber nur die Bedingung, die ich prüfen soll. Gleich danach geht es so weiter («bleibt sie erfasst, ihr Betrag ist vom Total abgezogen»). Ein vorsichtiger Leser glaubt, Dwello habe das schon geprüft. |
| P-3 | Minor | Hinweis Schlussrechnung / Betrag zusammen mit «In Abrechnungen enthalten» | In den Hinweisen heisst es «Ist eine davon schon abgerechnet …», in der Zeile «In Abrechnungen enthalten» stehen aber auch Abrechnungen im **Entwurf** (z. B. «NK-11111111-2025-0004, Entwurf»). Es steht nirgends, ob eine Akontorechnung, die nur in Entwürfen steckt, als «abgerechnet» gilt (also stehen bleibt und abgezogen wird) oder ob ich sie löschen und den Entwurf neu erstellen soll. |
| P-4 | Minor | Rechnungen hochladen (Hinweis Akontorechnung) | «Kommt sie erst nach der Abrechnung dieser Periode, …»: Das «sie» bezieht sich grammatisch auf die Schlussrechnung, beim schnellen Lesen aber auf die Akontorechnung, um die es im Kasten geht. Erst beim zweiten Lesen war mir klar, was gemeint ist. |
| P-5 | Nit | Rechnungen hochladen, Rechnungsseite, «Rechnung bearbeiten» | Der Hinweis ist ein einziger langer Absatz mit vier Fällen (schon erfasst, Datei hier ausgewählt, schon abgerechnet, Ergebnis 0 oder kleiner 0). Als kurze Aufzählung je Fall wäre er leichter nachzuprüfen. |

## Beobachtungen

- Der Betrag von CHF 1’250.00 (Total vor dem Abzug) ist für meinen Fall richtig: Die Akontorechnung über CHF 1’000.00 ist im selben Leistungszeitraum (01.01.–31.03.2026) und wird nicht zusätzlich erfasst. Die tatsächlichen Kosten zählen also genau einmal. Das ist Art. 257b OR entsprechend.
- Das Häkchen «Diese Rechnung erstellen» ist bei der Akontorechnung von sich aus leer, bei der Schlussrechnung gesetzt. Das ist die sichere Voreinstellung. Der Knopf hiess danach «1 Rechnung erstellen», die Meldung «1 Rechnung erstellt, Werke Schlussrechnung, 31.03.2026».
- Vor der Wahl der Kategorie hiess der Knopf «0 Rechnungen erstellen (1 unvollständig)». Das ist klar. Nach der Wahl «Allgemeinstrom» setzte Dwello den Verteilschlüssel «Pro Fläche (m²)» ein, ohne dass ich etwas tun musste.
- Auf der Rechnungsseite und beim Bearbeiten fehlt der Zahlbetrag laut Beleg (CHF 250.00). Für den Abgleich mit der Bank müsste ich die Datei öffnen.
- Der Hinweis am Betrag bleibt auf Dauer da, auch wenn ich alles geprüft habe. Es gibt keine Möglichkeit, «geprüft» zu vermerken.
- Beim Hochladen ist die Kategorie Pflicht, beim Bearbeiten und bei «Neue Rechnung» steht «Kategorie (optional)».
- «Rechnung bearbeiten» sagt «Bestehende Abrechnungen ändern sich dadurch nicht.» Ob das auch für Entwürfe gilt, steht nicht da (nicht geprüft).
- «In Abrechnungen enthalten» (ewz Allgemeinstrom Q4 2025, Heizöl Brunner 22.09.2025, Wasser Q3 2024) zeigt Abrechnungsnummer und Status als Link, z. B. «NK-11111111-2025-0001, Versendet» oder «NK-11111111-2024-0001, Bezahlt». Bei der neuen Rechnung steht «Keine». Das ist sachlich richtig und hilft. Die Nummer allein sagt mir aber nicht, welcher Mieter und welche Wohnung betroffen sind. Mieter oder Wohnung in der Zeile würden mir das Durchklicken ersparen.
- Die Leistungszeitraum-Hilfe (Kosten über mehrere Jahre, Beispiel Boiler entkalken 01.04.2026–31.03.2031, rund CHF 100 pro Jahr) ist rechnerisch richtig (500 / 5). Die Verteilung nach Tagen ist eine vertretbare Praxis für periodische Kosten. Der Verweis auf Art. 5 Abs. 2 Bst. e VMWG stimmt: Dort ist das Entkalken der Warmwasseranlage, der Boiler und des Leitungsnetzes genannt. «Bei einem Boiler in der Wohnung ist das umstritten … Im Zweifel ist es nicht umlagefähig» ist vorsichtig formuliert, damit kann ich leben.
- «Kommt die Arbeit früher wieder … Bis zu seinem Ende zählen dann beide Rechnungen.» Das liest sich zuerst wie eine Doppelzählung. Gemeint ist aber, dass der Rest der alten Rechnung weiterläuft. Jede Rechnung zählt also insgesamt einmal. Ein Satz «So zählt jede Rechnung insgesamt genau einmal» würde mich beruhigen.
- Die Leistungszeitraum-Hilfe ist bei jeder neuen Rechnung sehr lang: drei Absätze, einer davon nur zum Boiler.
- Der Filter Gebäude + Jahr auf der Rechnungsliste griff in meinem Skript nicht («83 Rechnungen» blieb stehen). Möglicherweise hat mein Skript etwas falsch gemacht. Ich habe das nicht weiter verfolgt.

## Aufgabe geschafft: ja

Schlussrechnung erfasst (Allgemeinstrom, CHF 1’250.00, Leistungszeitraum 01.01.–31.03.2026), Akontorechnung bewusst nicht erfasst. Alle verlangten Texte gelesen und beurteilt.

## Aufwand

Etwa 15 Minuten, 10 Skriptläufe. In der App: Gebäude wählen, 2 Dateien wählen, «Angaben prüfen», Kategorie wählen, «1 Rechnung erstellen», danach Rechnungsseite, «Rechnung bearbeiten», 3 ältere Rechnungen, «Neue Rechnung». Zwei Fehlversuche lagen an meinem Skript (Dateiauswahl, Name des Knopfs), nicht an der App.

## Ablauf

1. **Übersicht, «Rechnungen hochladen».** Erwartet: ein Dialog mit Gebäudeauswahl. Gesehen: Dialog «Rechnungen hochladen». Der Knopf «Dateien auswählen» bleibt gesperrt, bis ein Gebäude gewählt ist («Wählen Sie zuerst das Gebäude.»). Der Hinweis zur Aufbewahrung des Originals ist gut.
2. **Musterhaus Zentrum gewählt, beide PDFs gewählt.** Erwartet: Dwello erkennt Schlussrechnung und Akontorechnung. Gesehen: «2 von 2 Dateien gelesen. Bitte prüfen: 2.» Zur Schlussrechnung: «Auf der Rechnung sind Akontorechnungen von CHF 1’000.00 abgezogen. Als Betrag ist das Total vor dem Abzug vorgeschlagen: CHF 1’250.00.» Dazu der lange Absatz zu Doppelzählung, schon abgerechneten Akontorechnungen und Ergebnis 0 oder kleiner 0. Zur Akontorechnung: «Das ist eine Akontorechnung: ein Vorschuss … Erfassen Sie in der Regel nur die Schlussrechnung mit dem Total.» Häkchen leer.
3. **Entscheid.** Beide Rechnungen betreffen dieselbe Periode, die Akontorechnung ist noch nicht erfasst und nicht abgerechnet. Also nur die Schlussrechnung mit dem Total CHF 1’250.00 erfassen, die Akontorechnung nicht. Das entspricht der Empfehlung, und rechtlich ist es korrekt.
4. **«Angaben prüfen» bei der Schlussrechnung.** Gesehen: Rechnungsnummer R-1001, Rechnungsdatum 31.03.2026 («Die KI ist unsicher»), Leistungszeitraum 01.01.–31.03.2026, Betrag 1250.00, Rechnungssteller «Werke Schlussrechnung», Beschreibung «Allgemeinstrom Q1», Kategorie leer. Kategorie «Allgemeinstrom» gewählt, Verteilschlüssel wurde «Pro Fläche (m²)».
5. **«1 Rechnung erstellen».** Erwartet: Bestätigung. Gesehen: «1 Rechnung erstellt, Werke Schlussrechnung, 31.03.2026». Die Akontorechnung blieb unerstellt im Dialog stehen.
6. **Rechnungsseite der neuen Rechnung.** Gesehen: Betrag CHF 1’250.00 und darunter: «Auf dem Beleg sind Akontorechnungen von CHF 1’000.00 abgezogen. Der Betrag ist das Total vor dem Abzug, weniger die Akontorechnungen, die schon abgerechnet sind.» Dann der Prüfabsatz (P-1, P-2). «In Abrechnungen enthalten: Keine». Das stimmt.
7. **«Rechnung bearbeiten».** Erwartet: derselbe Hinweis direkt am Betrag. Gesehen (Bildschirmfoto 12-edit-betrag.png): Unter dem Feld «CHF 1250.00» steht ein gelber Warnkasten mit Dreieck-Symbol. Der erste Satz ist fett, der Prüfabsatz normal. Hier heisst es «löschen Sie diese Rechnung auf der Seite der Rechnung mit «Rechnung löschen»». Das passt, weil man auf der Bearbeitungsseite nicht löschen kann. Inhaltlich gilt dasselbe wie in Schritt 6.
8. **Ältere Rechnungen.** ewz Allgemeinstrom Q4 2025: «In Abrechnungen enthalten» mit NK-11111111-2025-0004/0003/0002 (Entwurf) und 0001 (Versendet). Heizöl Brunner 2025: dieselbe Liste. Wasser Q3 2024: vier Abrechnungen, alle «Bezahlt». Erwartet: Ich sehe, ob eine Rechnung abgerechnet ist. Gesehen: ja, mit Status. Unklar bleibt, ob «Entwurf» schon «abgerechnet» heisst (P-3).
9. **«Neue Rechnung», Hilfe zum Leistungszeitraum.** Gesehen: dieselben drei Absätze wie beim Hochladen und Bearbeiten (Quartal, mehrjährige Kosten mit Boiler-Beispiel, VMWG-Hinweis). Beurteilung unter Beobachtungen.

## Verwirrung

- «abgerechnet»: Heisst das «in einer versendeten oder bezahlten Abrechnung» oder auch «in einem Entwurf»? (P-3)
- «sie» im Akonto-Hinweis (P-4).
- «Die Akontorechnungen sind nicht zusätzlich erfasst.»: Aussage oder Aufforderung? (P-2)
- «Verringern Sie den Betrag der abgerechneten Akontorechnungen um den Unterschied, und berichtigen Sie die Abrechnungen mit ihnen.»: Wie ich eine versendete oder bezahlte Abrechnung berichtige, sagt Dwello nicht. Ich habe auch keinen Weg dafür gesehen (nicht weiter gesucht).
- «Total vor dem Abzug»: verständlich. Den Begriff «Schlussrechnung» erklärt Dwello nur indirekt über den Akonto-Hinweis.

## Fehlerrisiken

- Wer der Anleitung bei einer schon abgerechneten Akontorechnung folgt, verschiebt eine Nachbelastung in die Folgeperiode. Bei einem Mieterwechsel zahlt der neue Mieter Kosten des Vormieters. Das kann ein Mieter anfechten (P-1).
- Wer «sind nicht zusätzlich erfasst» als Prüfergebnis liest, prüft nicht und zählt die Akontorechnungen doppelt (P-2).
- Wer eine Akontorechnung löscht, die nur in einem Entwurf steckt, oder sie stehen lässt, obwohl er den Entwurf neu erstellt, rechnet falsch ab (P-3).
- Wer den Leistungszeitraum einer Schlussrechnung nach der Anleitung verschiebt, widerspricht der Hilfe zum Leistungszeitraum («Für welche Zeit gilt die Rechnung?»). Der erfasste Zeitraum stimmt dann nicht mehr mit dem Beleg überein. Das fällt spätestens auf, wenn ein Mieter Einsicht in die Belege verlangt.

## Vorschläge

- **P-1.** Reproduktion: Rechnungen hochladen, Musterhaus Zentrum, «Werke Schlussrechnung.pdf» wählen, den Hinweis lesen. Oder auf der Rechnungsseite bzw. bei «Rechnung bearbeiten» den Kasten am Betrag lesen. Was hilft: beide Fälle gleich behandeln. Ist eine Akontorechnung schon in einer versendeten Abrechnung, wird der Unterschied (Nachbelastung wie Gutschrift) der Periode zugeordnet, für die die Kosten angefallen sind. Also entweder die alte Abrechnung berichtigen oder, wenn das nicht mehr geht (Mieter ausgezogen, Frist), den Restbetrag nicht verrechnen. Das Verschieben in die Folgeperiode höchstens mit dem ausdrücklichen Hinweis, dass dann ein Mieter, der neu eingezogen ist, nicht belastet werden darf. Das sollte `fach-reviewer` entscheiden.
- **P-2.** Reproduktion: die Rechnungsseite der neuen Schlussrechnung, Kasten am Betrag. Was hilft: als Aufforderung formulieren, z. B. «Prüfen Sie, dass die Akontorechnungen nicht zusätzlich erfasst sind.» und «Ist eine davon schon abgerechnet, lassen Sie sie stehen und ziehen Sie ihren Betrag vom Total ab …».
- **P-3.** Reproduktion: eine ältere Rechnung von Musterhaus Zentrum 2025 öffnen (z. B. ewz Allgemeinstrom Q4 2025), die Zeile «In Abrechnungen enthalten» mit dem Hinweis vergleichen. Was hilft: im Hinweis «abgerechnet» genauer fassen, z. B. «in einer versendeten oder bezahlten Abrechnung», und sagen, was bei Entwürfen zu tun ist (Akontorechnung löschen, Entwurf neu erstellen).
- **P-4.** Reproduktion: hochladen, «Werke Akontorechnung.pdf», Hinweis lesen. Was hilft: «Kommt die Schlussrechnung erst nach der Abrechnung dieser Periode, …».
- **P-5.** Was hilft: den Prüfabsatz als kurze Liste je Fall gliedern.

## Nicht geprüft

- Eine Akontorechnung, die schon erfasst und abgerechnet ist: In «Musterhaus Zentrum» gibt es keine. Fremde Rechnungen ändere oder lösche ich nicht. Der Fall aus P-1 ist deshalb nur am Text beurteilt.
- Ob «Rechnung löschen» bei einer Rechnung in einem Entwurf oder in einer versendeten Abrechnung geht oder abgelehnt wird: Dafür hätte ich Demodaten löschen müssen.
- Wie eine versendete Abrechnung zu «berichtigen» ist: nicht gesucht, das gehört nicht zur Aufgabe.
- Ob «Bestehende Abrechnungen ändern sich dadurch nicht» auch für Entwürfe gilt: Ich habe keine Rechnung bearbeitet, die in Abrechnungen steckt.
- PDF der Abrechnung, andere Sprachen, dunkler Modus: nicht Teil der Aufgabe.
