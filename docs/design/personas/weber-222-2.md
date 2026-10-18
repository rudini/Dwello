# Dr. Weber, Runde 2: geänderte Hinweise zu abgezogenen Akontobeträgen (Issue #222)

Persona: Dr. Weber, 52. Ich bin rechtlich vorsichtig, lese alles und rechne nach. Desktop 1440 × 900, Maus.
App: Persona-Stack auf http://localhost:3300 (Version 0.5.4+87-g778f061e) mit dem KI-Stand-in.
Gespeichert habe ich eine Rechnung im Gebäude «Musterhaus Zentrum»: Werke Schlussrechnung 2025, CHF 1’250.00, Allgemeinstrom. Dazu kam ein Speicherversuch auf ihrer Bearbeiten-Seite, den Dwello abgelehnt hat (siehe Ablauf, Schritt 5).
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/weber-222-2/`.
Ich bewerte nur die zwei geänderten Hinweistexte. Punkte aus Runde 1, die schon in #268, #261 und #263 stehen, wiederhole ich nicht.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen hochladen (Hinweis) und Rechnungsdetail «Hinweise zum Beleg» | Wer dem Hinweis folgt, rechnet über beide Jahre zusammen genau die tatsächlichen Kosten ab (1’250.00). Pro Abrechnungsperiode stimmt es aber nicht: Die Differenz zwischen der schon abgerechneten Akontorechnung (250.00) und dem tatsächlichen Anteil der alten Periode (zeitanteilig 315.07) landet stillschweigend in der neuen Periode. Wechselt der Mieter zum Jahreswechsel, zahlt der neue Mieter CHF 65.07 Verbrauch aus der Zeit, in der er noch nicht da war. Die Hinweise erwähnen das nicht. |
| P-2 | Minor | beide Hinweise | Der Fall «alle Akontorechnungen schon abgerechnet» bleibt offen. Der Hinweis verlangt dann einen Leistungszeitraum, der nach der letzten Abrechnungsperiode beginnt. Er würde also nach dem Ende der Werksperiode beginnen. Dwello lehnt das ab: «Das Ende darf nicht vor dem Beginn liegen.» Wohin der Restbetrag (im Beispiel CHF 250.00) gehört, sagt keiner der beiden Hinweise. |
| P-3 | Nit | beide Hinweise | «Ist eine davon schon abgerechnet … ihren Betrag … in der sie abgerechnet ist» steht in der Einzahl. Sind mehrere abgerechnet, vielleicht in verschiedenen Perioden, muss ich selbst darauf kommen, alle Beträge abzuziehen und die späteste Periode zu nehmen. |
| P-4 | Nit | beide Hinweise | Wer dem Hinweis folgt, erfasst einen Leistungszeitraum, der nicht mehr zum Beleg passt: Auf dem Beleg steht 01.10.2024–30.09.2025, in Dwello 01.01.2025–30.09.2025. Auf derselben Seite steht «Mieter dürfen sie einsehen». Ein Mieter, der den Beleg prüft, sieht diese Abweichung und eine andere Summe ohne Begründung. Ein Satz wie «Notieren Sie den Grund in der Beschreibung» fehlt. |

Mein Runde-1-Befund P-1 (fehlender Leistungszeitraum, CHF 187 bis 252 zu wenig abgerechnet) ist für den Normalfall behoben, siehe Nachrechnung. Auch P-6 aus Runde 1 («löschen oder entfernen») ist behoben: Der Hinweis nennt jetzt die Schaltflächen «Rechnung löschen» und «Datei entfernen», und beide gibt es mit genau diesem Namen.

## Beobachtungen

- Der Text im Detail ist unverändert, bis auf den angehängten Satzteil zum Leistungszeitraum. Er beginnt weiterhin mit «Der Betrag ist das Total vor dem Abzug» und sagt danach «ihr Betrag ist vom Total abgezogen». Mit drei Teilsätzen hinter «Ist eine davon schon abgerechnet» ist der Satz jetzt noch länger (Runde 1, P-3). In der schmalen Karte «Beleg» braucht der Hinweis 19 Zeilen (Screenshot `05-rechnung-detail.png`).
- Der Hinweis setzt voraus, dass ich weiss, wann die Abrechnungsperiode endet, in der eine Akontorechnung abgerechnet ist. Beim Hochladen und im Detail sehe ich das nirgends. Ich habe es nicht weiter gesucht.
- Auf der Seite «Rechnung bearbeiten» zeigte die Auswahl «Kategorie (optional)» direkt nach dem Laden nur «Kategorie auswählen», obwohl die Rechnung die Kategorie Allgemeinstrom hat. Ich habe nicht geprüft, ob die Auswahl nachlädt.
- Wie in Runde 1 liest der Stand-in die Werks-Schlussrechnung als «Allgemeinstrom Q1» mit 01.01.2026–31.03.2026. Das liegt am Stand-in.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten. Vier Skriptläufe: Hochladen mit Erstellen, Detail, Bearbeiten ansehen, Bearbeiten mit dem Grenzfall. Sechs Klicks in der App bis zur erstellten Rechnung.

## Ablauf

1. **Rechnungen > «Rechnungen hochladen», Gebäude Musterhaus Zentrum, Datei «Werke Schlussrechnung 2025.pdf».**
   - Erwartet: derselbe gelbe Hinweis wie in Runde 1, jetzt mit einer Angabe zum Leistungszeitraum.
   - Gesehen (`01-dialog-hinweis.png`: gelber Kasten «Hinweise zu Werke Schlussrechnung 2025.pdf» mit Warndreieck, über den Feldern), wörtlich:
     > Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Vorgeschlagen ist das Total vor dem Abzug. Haben Sie die Akontorechnungen schon erfasst, löschen Sie sie auf ihrer Seite mit «Rechnung löschen». Sind ihre Dateien hier ausgewählt, entfernen Sie diese mit «Datei entfernen». Sonst zählen sie doppelt. Ist eine davon schon abgerechnet, löschen Sie sie nicht, sondern ziehen Sie ihren Betrag vom Total ab und lassen Sie den Leistungszeitraum erst nach der Abrechnungsperiode beginnen, in der sie abgerechnet ist.
   - Urteil: Jeder Fall bekommt jetzt einen eigenen Satz, das ist klarer. Die Ergänzung zum Leistungszeitraum ist das, was mir in Runde 1 gefehlt hat.
2. **Nachrechnen mit meinem Runde-1-Beispiel** (siehe unten). Ergebnis: Im Normalfall stimmt die Summe genau. Pro Periode bleibt eine kleine Verschiebung (P-1), und ein Grenzfall ist nicht geregelt (P-2).
3. **Kategorie «Allgemeinstrom», sonst alles wie vorgeschlagen, «1 Rechnung erstellen».**
   - Gesehen: «1 Rechnung erstellt» mit einem Link. In der Liste steht «Werke Schlussrechnung 2025 Allgemeinstrom Q1 Musterhaus Zentrum, 31.03.2026, CHF 1’250.00».
4. **Rechnung öffnen.**
   - Gesehen (`05-rechnung-detail.png`: Karte «Beleg» rechts mit gelbem Kasten «Hinweise zum Beleg»), wörtlich:
     > Auf dem Beleg sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Prüfen Sie, dass sie nur einmal zählen: Der Betrag ist das Total vor dem Abzug, und die Akontorechnungen sind nicht zusätzlich erfasst. Ist eine davon schon abgerechnet, bleibt sie erfasst, ihr Betrag ist vom Total abgezogen, und der Leistungszeitraum beginnt erst nach der Abrechnungsperiode, in der sie abgerechnet ist.
   - Vergleich: Die Regel zum Leistungszeitraum ist in beiden Hinweisen gleich. Beim Hochladen heisst es «lassen Sie … beginnen», im Detail «beginnt erst nach». Das eine ist eine Anleitung, das andere eine Prüfliste. Inhaltlich sagen beide dasselbe, ich finde keinen Widerspruch.
5. **Grenzfall auf der Seite «Rechnung bearbeiten» meiner eigenen Rechnung ausprobiert.** Annahme: Alle vier Akontorechnungen sind abgerechnet, die letzte in der Periode 2025. Laut Hinweis: Betrag 250.00, Beginn nach 31.12.2025, also 01.01.2026, Ende wie auf dem Beleg 30.09.2025.
   - Erwartet: Dwello lehnt ab oder hilft weiter.
   - Gesehen (`06-bearbeiten-zeitraum.png`): Das Feld Ende ist als ungültig markiert, darunter steht «Das Ende darf nicht vor dem Beginn liegen.», und der Status lautet «Ungespeicherte Änderungen». Gespeichert wurde nichts, die Rechnung ist unverändert. Der Hinweis sagt nicht, was ich in diesem Fall stattdessen tun soll (P-2).

### Nachrechnung mit dem Runde-1-Beispiel

Ausgangslage: Werke-Schlussrechnung Allgemeinstrom für die Ableseperiode 01.10.2024–30.09.2025, Total 1’250.00, abzüglich Akonto 4 × 250.00, zu zahlen 250.00. Die Abrechnungsperiode ist das Kalenderjahr. Die Akontorechnung Q4 2024 ist mit der versendeten Abrechnung 2024 abgerechnet. Die Akontorechnungen Q1–Q3 2025 sind erfasst, aber noch nicht abgerechnet.

So befolge ich den Hinweis:
- Q1–Q3 2025 lösche ich mit «Rechnung löschen».
- Q4 2024 bleibt erfasst.
- Den Betrag setze ich auf 1’250 − 250 = 1’000.00.
- Den Leistungszeitraum lasse ich erst nach der Periode 2024 beginnen: 01.01.2025–30.09.2025.

Was Dwello daraus macht («Nur die Tage in der Abrechnungsperiode zählen»):
- Alle 273 Tage liegen in 2025, also gehen 1’000.00 in die Abrechnung 2025.
- 2024 hat 250.00 getragen.
- Zusammen sind das 1’250.00, genau das Total der Werksrechnung. Nichts geht verloren, nichts zählt doppelt.

Pro Periode sieht es anders aus:
- Zeitanteilig gehören 1’250 × 92/365 = 315.07 zu 2024 und 1’250 × 273/365 = 934.93 zu 2025.
- Die Mieter 2024 haben nur 250.00 bezahlt, die Mieter 2025 zahlen 1’000.00, also 65.07 mehr als ihr Anteil.
- Bei gleichen Mietern gleicht sich das aus. Bei einem Mieterwechsel zum 01.01.2025 nicht (P-1).
- Die Abrechnung 2024 lässt sich nachträglich nicht mehr ändern. Deshalb halte ich den Weg des Hinweises für vertretbar. Er sollte die Verschiebung aber offen nennen.

Antwort auf die Frage der Aufgabe: Wer dem Hinweis folgt, rechnet in der Summe genau die tatsächlichen Kosten ab. Pro Abrechnungsperiode sind es nur annähernd die tatsächlichen Kosten.

Grenzfall: Ist auch Q1–Q3 2025 schon mit einer versendeten Abrechnung 2025 abgerechnet, verlangt der Hinweis einen Beginn am 01.01.2026 bei einem Ende am 30.09.2025. Das geht nicht (Schritt 5). Die 250.00 Nachzahlung kann ich dann nach keinem der beiden Texte erfassen (P-2).

## Verwirrung

- «erst nach der Abrechnungsperiode beginnen»: Ich verstehe es als «am ersten Tag nach dem Ende dieser Periode». Das ist eindeutig. Es setzt aber voraus, dass ich das Ende der Periode kenne.
- Im Detail: «ihr Betrag ist vom Total abgezogen» und davor «Total vor dem Abzug». Hier heissen zwei verschiedene Abzüge gleich, wie schon in Runde 1.

## Fehlerrisiken

- Mieterwechsel zwischen den Perioden: Der neue Mieter trägt die Differenz der alten Periode (P-1).
- Alle Akontorechnungen sind schon abgerechnet: Der Vermieter findet keinen gültigen Leistungszeitraum. Lässt er den Leistungszeitraum leer, entscheidet das Rechnungsdatum über die Periode. Das sagt ihm der Hinweis nicht. Oder er lässt die Nachzahlung ganz weg (P-2).
- Mehrere abgerechnete Akontorechnungen in verschiedenen Perioden: Wer nur eine abzieht oder die frühere Periode nimmt, rechnet doppelt oder zu wenig ab (P-3).

## Vorschläge

- **P-1**
  - Nachstellen: Rechnungen > Rechnungen hochladen > Musterhaus Zentrum > «Werke Schlussrechnung 2025.pdf». Den Hinweis lesen und mit dem Beispiel oben nachrechnen.
  - Hilfreich wäre ein kurzer Zusatz, etwa: «Die Differenz zur abgerechneten Akontorechnung fällt damit in die neue Abrechnungsperiode.»
- **P-2**
  - Nachstellen: Die eigene Rechnung bearbeiten, Beginn 01.01.2026, Ende 30.09.2025, Betrag 250.00 eingeben, «Änderungen speichern». Dwello zeigt «Das Ende darf nicht vor dem Beginn liegen.»
  - Hilfreich wäre ein Satz für diesen Fall, etwa: «Sind alle Akontorechnungen abgerechnet, erfassen Sie den Restbetrag ohne Leistungszeitraum; er zählt dann nach dem Rechnungsdatum.» Das müsste fachlich bestätigt werden.
- **P-3**
  - Hilfreich: «Sind welche davon schon abgerechnet, ziehen Sie deren Beträge vom Total ab und lassen Sie den Leistungszeitraum nach der letzten dieser Abrechnungsperioden beginnen.»
- **P-4**
  - Hilfreich: «Notieren Sie in der Beschreibung, warum Betrag und Zeitraum vom Beleg abweichen.»

## Nicht geprüft

- Wie sich das Beispiel in einer echten Abrechnung auswirkt. Ich habe keine Akontorechnungen angelegt und keine Abrechnung erzeugt. Die Zahlen beruhen auf dem Text «Nur die Tage in der Abrechnungsperiode zählen.»
- Ob Dwello eine Rechnung aus einer versendeten Abrechnung löschen lässt. Ich habe keine fremden Datensätze angefasst.
- Wo Dwello das Ende einer Abrechnungsperiode anzeigt. Ich bin davon ausgegangen, dass die Periode das Kalenderjahr ist.
- Ob die Kategorie-Auswahl auf «Rechnung bearbeiten» nachlädt (Beobachtungen).
