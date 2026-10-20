# Persona-Review Dr. Weber – Slice 448 (kleiner Saldo unter CHF 5.00)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: http://localhost:3300 (Demo-Daten, Abrechnung 2024 von Thomas Weber per SQL vorbereitet: erledigt, Rückerstattung CHF 3.00, übertragen). Gespeichert habe ich nur im Gebäude «Seepark Residenz»: PDF der Abrechnung 2024 erstellt, Entwurf 2025 neu berechnet, PDF 2025 erstellt. Nichts versendet, nichts berichtigt.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/dr-weber-448/` (PDFs unter `pdf/`).

| ID | Schwere | Bildschirm | Befund |
| --- | --- | --- | --- |
| P-1 | Major | Abrechnung berichtigen (Bestätigung), Abrechnung 2024 | Die Bestätigung sagt nur, was geschieht, wenn eine **versendete** nächste Abrechnung den Übertrag enthält. Hier enthält ein **Entwurf** (2025) den Übertrag von CHF 3.00. Was mit diesem Betrag im Entwurf geschieht, ob ich den Entwurf neu berechnen muss und ob der Mieter das Geld doppelt oder gar nicht bekommt, steht nirgends. Der Begriff «Bereits verrechnet» wird nicht erklärt. |
| P-2 | Major | Abrechnungsliste, Statusfilter | «Erledigt» steht gleichrangig neben «Bezahlt», wird aber weder in der Liste, noch in der Abrechnung, noch auf der Seite «Hilfe» erklärt. Ich lese «Erledigt» als «Geld ist geflossen». Tatsächlich hat der Mieter seine CHF 3.00 noch nicht; sie sind nur übertragen. |
| P-3 | Minor | PDF 2025, Kostenübersicht | Die Zeile lautet «Übertrag aus Abrechnung NK-22222222-2024-0001: CHF 3.00», umbrochen auf drei Zeilen, rechts «– 3.00». Nach dem Doppelpunkt steht nur der Betrag noch einmal; ob es ein Guthaben (Rückerstattung) oder eine Schuld (Nachzahlung) ist, steht nicht da, man sieht es nur am Vorzeichen. Im Kopfkasten heisst es nur «– Übertrag CHF 3.00». |
| P-4 | Minor | Abrechnung 2024, Zahlung und Verlauf | «Er wird mit der nächsten Abrechnung verrechnet.» Welche Abrechnung, steht nicht da, auch nicht, nachdem der Entwurf 2025 den Betrag übernommen hat: kein Verweis auf NK-22222222-2025-0001, kein Eintrag im Verlauf (z. B. «Übertragen in …»). |
| P-5 | Minor | PDF 2024, Kopfkasten | «Wir verrechnen ihn mit der nächsten Nebenkostenabrechnung.» Der Mieter erfährt nicht, was bei einem Auszug passiert. In der Hilfe steht es («die Schlussabrechnung kennt keinen Mindestbetrag»), im PDF nicht. |

## Beobachtungen

- Die Rechnung geht auf. 2024: 228.00 + 637.50 + 862.75 + 428.19 + 105.46 = 2'261.90; 3 % = 67.857, gerundet 67.86; 2'329.76 − 2'332.76 = −3.00, also Rückerstattung CHF 3.00. 2025: 228.00 + 874.44 + 650.25 + 437.75 + 106.10 = 2'296.54; 3 % = 68.896, gerundet 68.90; 2'365.44 − 2'400.00 − 3.00 = −37.56, auf 5 Rappen aufgerundet 37.60. Bildschirm und PDF zeigen dieselben Zahlen.
- Das Vorzeichen des Übertrags («− CHF 3.00») folgt derselben Logik wie die Akontobeiträge. Das ist folgerichtig, aber nur, wenn man die Akontozeile als Vorbild nimmt.
- Die Bestätigung «Entwurf neu berechnen» ist gut: Sie sagt, was bleibt und was sich ändert, und dass das PDF verworfen wird.
- Nach «Neu berechnen» zeigt der Verlauf des Entwurfs 2025 nur noch «Erstellt». Ein Eintrag «Neu berechnet» fehlt, und auch das verworfene PDF ist aus dem Verlauf verschwunden.
- Im PDF 2025 rutschen die «Hinweise» (Art. 257b OR, Art. 8 VMWG) allein auf Seite 2, Seite 1 hat unten viel freien Platz.
- Der Verlauf 2024 steht in der Reihenfolge Erstellt 20.10.2026, PDF erstellt 20.10.2026, Versendet 14.04.2025. Das liegt an der SQL-Vorbereitung und ist kein Befund.
- Die Bestätigung «Abrechnung berichtigen» nennt die Verjährung (Art. 128 Ziff. 1 OR) zurückhaltend und richtig. Dass sich das nicht rückgängig machen lässt, steht klar da.
- Rechtlich: «verrechnen» ist im Sinn von Art. 120 OR streng genommen ungenau, weil die Forderung aus der nächsten Abrechnung noch gar nicht fällig ist. Gemeint ist eine Gutschrift auf die nächste Abrechnung. Für einen Mieter ist das verständlich, ein Jurist stolpert darüber.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 10 Schritte (Liste, Filter Erledigt/Bezahlt, Abrechnung 2024, PDF 2024 erstellen und lesen, Entwurf 2025, Neu berechnen, PDF 2025 erstellen und lesen, Hilfe durchsuchen, Berichtigen öffnen und abbrechen).

## Ablauf

1. **Abrechnungsliste.** Erwartet: Abrechnungen mit Status. Gesehen: Statusfilter Entwurf 7, Versendet 1, Bezahlt 8, Erledigt 1, Überfällig 0; Thomas Weber 2024 steht nicht auf Seite 1 (Liste nach Datum).
2. **Abrechnung 2024 (NK-22222222-2024-0001).** Erwartet: Status, Hinweis auf den Übertrag, Verweis auf die Folgeabrechnung. Gesehen: Status «Erledigt», Saldo «Rückerstattung CHF 3.00», Zahlung «Der Betrag ist kleiner als CHF 5.00. Er wird mit der nächsten Abrechnung verrechnet.» Verlauf: Erstellt, Versendet 14.04.2025. Kein Verweis auf die Abrechnung 2025 (P-4). Das PDF war noch nicht erstellt («PDF noch nicht erstellt» in der Liste).
3. **PDF 2024 erstellt und heruntergeladen.** Erwartet: Der Mieter liest, dass er die CHF 3.00 nicht überwiesen bekommt und wo sie hingehen. Gesehen (eine Seite): Kopfkasten «Rückerstattung CHF 3.00 – Der Betrag ist kleiner als CHF 5.00. Wir verrechnen ihn mit der nächsten Nebenkostenabrechnung.», darunter die Herleitung. Kein QR-Teil, richtig für eine Rückerstattung. Der Mieter ist im Grundsatz korrekt informiert, nur der Fall Auszug fehlt (P-5).
4. **Entwurf 2025 vorher.** Gesehen: Rückerstattung CHF 34.60, ohne Übertrag (Stand vor der SQL-Vorbereitung).
5. **Neu berechnen.** Erwartet: Bestätigung, danach eine Übertragszeile. Gesehen: Dialog «Entwurf neu berechnen» mit klaren Folgen; danach «Übertrag aus Abrechnung NK-22222222-2024-0001 − CHF 3.00», «Rückerstattung vor Rundung CHF 37.56», «Rundung auf 5 Rappen + CHF 0.04», «Saldo: Rückerstattung CHF 37.60», «Sie erstatten dem Mieter CHF 37.60 zurück.» Nachgerechnet: stimmt.
6. **PDF 2025 erstellt und heruntergeladen.** Gesehen (zwei Seiten): Kopfkasten «Rückerstattung CHF 37.60, Wir überweisen Ihnen den Betrag bis 19.11.2026 …», Herleitung «Ihre Nebenkosten CHF 2'365.44 – Akontobeiträge CHF 2'400.00 – Übertrag CHF 3.00, auf 5 Rappen gerundet». In der Kostenübersicht die Übertragszeile, dreizeilig umbrochen, mit dem Betrag doppelt (P-3). Rechnung stimmt.
7. **Entwurf 2025 nicht versendet.** «Per E-Mail senden» nicht angeklickt.
8. **Statusfilter «Erledigt».** Gesehen: 1 Abrechnung, Thomas Weber 2024, CHF 3.00. Filter «Bezahlt»: 8 Abrechnungen. Erwartet: ein Satz, was «Erledigt» heisst. Gesehen: keiner, auch in der Hilfe nicht (P-2). Was ich erschliesse: «Erledigt» heisst «abgeschlossen ohne Zahlung, weil übertragen». Das ist eine Vermutung.
9. **Abrechnung berichtigen (2024).** Bestätigung ganz gelesen, «Abbrechen» gewählt. Der Text sagt: Die alte bleibt erhalten; enthält eine versendete nächste Abrechnung den Saldo als Übertrag, rechnet die berichtigte ihn als «Bereits verrechnet» an; nicht rückgängig zu machen; Verjährungshinweis. Für meinen Fall (der Übertrag steckt in einem Entwurf) sagt sie nichts (P-1).

## Verwirrung

- «Erledigt» gegenüber «Bezahlt»: nicht erklärt (P-2).
- «Bereits verrechnet»: steht in Anführungszeichen, als ob es eine Zeile auf der berichtigten Abrechnung wäre, ist aber nirgends erklärt.
- «verrechnet» (Bildschirm und PDF 2024) gegenüber «Übertrag» (Abrechnung 2025): zwei Wörter für denselben Vorgang. Nur die Hilfe verbindet sie.
- «die nächste Abrechnung»: welche genau, bleibt offen (P-4).

## Fehlerrisiken

- Nach einer Berichtigung der Abrechnung 2024 könnte der Entwurf 2025 weiter den alten Übertrag von CHF 3.00 tragen, und ich versende ihn so. Dann ist der Betrag doppelt oder falsch angerechnet (P-1).
- Ich halte «Erledigt» für «ausbezahlt» und vergesse, dass der Mieter noch CHF 3.00 gut hat, etwa wenn ich die Folgeabrechnung lösche oder der Mieter auszieht (P-2, P-5).
- Ein Mieter liest «– Übertrag CHF 3.00» als Abzug zu seinen Lasten und reklamiert (P-3).

## Vorschläge

- **P-1:** Seepark Residenz, Abrechnung NK-22222222-2024-0001 (erledigt, Übertrag in den Entwurf NK-22222222-2025-0001), «Abrechnung berichtigen». Hilfreich wäre ein Satz für den Entwurfsfall, z. B. «Der Entwurf NK-… enthält den Saldo als Übertrag. Berechnen Sie ihn nach der Berichtigung neu.» (oder was Dwello tatsächlich tut), mit der Nummer der betroffenen Abrechnung. Dazu ein Satz, was «Bereits verrechnet» auf der berichtigten Abrechnung bedeutet.
- **P-2:** Nebenkostenabrechnungen, Filter «Erledigt». Hilfreich wäre ein sichtbarer Hilfetext beim Filter oder beim Status in der Abrechnung, z. B. «Erledigt: Der Saldo war kleiner als CHF 5.00 und wurde in die nächste Abrechnung übertragen. Es fliesst kein Geld.», und derselbe Eintrag in der Hilfe.
- **P-3:** PDF der Abrechnung 2025 nach «Neu berechnen». Hilfreich wäre eine einzeilige Beschriftung mit Richtung, z. B. «Guthaben aus Abrechnung 2024 (NK-…)» oder «Übertrag Rückerstattung aus Abrechnung NK-…», ohne den Betrag in der Beschriftung zu wiederholen.
- **P-4:** Abrechnung 2024 öffnen, nachdem der Entwurf 2025 den Übertrag enthält. Hilfreich wäre ein Link «Übertragen in NK-22222222-2025-0001» bei «Zahlung» und ein Eintrag im Verlauf.
- **P-5:** PDF 2024. Hilfreich wäre der Zusatz «Endet Ihr Mietverhältnis vorher, erhalten Sie den Betrag mit der Schlussabrechnung.»

## Nicht geprüft

- Wie Dwello den Status «Erledigt» und den Übertrag im normalen Ablauf erzeugt (Versand einer Abrechnung unter CHF 5.00): Die Abrechnung 2024 war per SQL vorbereitet, deshalb sagen Verlauf und Reihenfolge der Einträge dort nichts über den echten Ablauf.
- Die Berichtigung selbst: Laut Aufgabe nicht bestätigt, darum weiss ich nicht, was danach mit dem Entwurf 2025 geschieht.
- Versand des Entwurfs 2025: laut Aufgabe nicht.
- Nachzahlung unter CHF 5.00 (Übertrag zulasten des Mieters) und Schlussabrechnung: in den Demo-Daten nicht vorbereitet.
- Die Akonto-Summe 2024 (von Hand gesetzt, laut Koordinator nicht Teil der Prüfung).
