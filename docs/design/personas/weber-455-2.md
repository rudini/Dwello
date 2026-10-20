# Persona-Review: Dr. Weber, Akontorechnungen und Schlussrechnung (#455), Runde 2

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus.
App: http://localhost:3300 (Persona-Stack, Demodaten), Gebäude «Musterhaus Zentrum» (Speichern dort Teil der Aufgabe).
Geänderte Regel (Option C): Die Schlussrechnung wird mit dem Total und dem Leistungszeitraum vom Beleg erfasst. Erfasste Akontorechnungen werden gelöscht, auch abgerechnete. Danach werden ihre Abrechnungen neu berechnet (Entwürfe) oder berichtigt (versendete und bezahlte).
Runde 1: `docs/design/personas/weber-455.md`.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/weber-455-2/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-5 | Nit | Rechnungen hochladen (Hinweis Schlussrechnung) | Gilt noch, aber schwächer als in Runde 1. Der Hinweis ist weiter ein einziger Absatz mit sieben Sätzen. Mitten in die Handlungsfolge «löschen … entfernen … danach nachführen» ist der Satz «Übernehmen Sie den Leistungszeitraum der Rechnung.» geschoben. Auf der Rechnungsseite und bei «Rechnung bearbeiten» ist der Hinweis jetzt kürzer und gut zu lesen. |
| P-6 | Minor | Rechnung löschen (Bestätigung, Kasten «Rechnung schon abgerechnet») | Die Bestätigung sagt: «Berechnen Sie danach die Entwürfe … neu» und «Versendete oder bezahlte Abrechnungen berichtigen Sie …». Sie sagt nicht, dass die Schlussrechnung **vorher** erfasst sein muss. Wer zuerst die Akontorechnung löscht und gleich danach neu berechnet oder berichtigt, bekommt eine Abrechnung ohne diese Kosten. Bei einer versendeten Abrechnung geht dann eine Gutschrift an den Mieter. Später, mit der Schlussrechnung, ist eine zweite Berichtigung nötig. Der Hinweis beim Hochladen und der auf der Seite der Schlussrechnung haben dieses Problem nicht, denn dort ist die Schlussrechnung schon da. |
| P-7 | Nit | Rechnung löschen (Bestätigung) | «Löschen Sie nur falsch erfasste Rechnungen oder Akontorechnungen, die eine Schlussrechnung ersetzt.» Grammatisch ist das richtig, denn «ersetzt» steht im Singular, Subjekt ist also die Schlussrechnung. Beim ersten Lesen verstand ich aber «Akontorechnungen, die eine Schlussrechnung ersetzen», also das Gegenteil. Erst beim zweiten Lesen wurde es klar. |

## Stand der Befunde aus Runde 1

- **P-1 (Major): erledigt.** Den Rat, den Restbetrag in die Folgeperiode zu schieben, gibt es nicht mehr. Nachbelastung und Überschuss werden jetzt gleich behandelt. Die Schlussrechnung trägt das Total und den Leistungszeitraum vom Beleg. Die Abrechnungen der Periode werden nachgeführt. Damit trägt jede Abrechnungsperiode ihre tatsächlichen Kosten, wie es Art. 257b Abs. 1 OR verlangt. Die Regel widerspricht auch nicht mehr der Hilfe zum Leistungszeitraum («Wer später einzieht, zahlt nur für seine Zeit»). Der Satz «So trägt jede Abrechnungsperiode ihre tatsächlichen Kosten.» begründet die Regel in einfachen Worten. Das gefällt mir.
- **P-2 (Minor): erledigt.** Der Satz lautet jetzt «Prüfen Sie, dass die Akontorechnungen nicht zusätzlich erfasst sind.» Das ist eine klare Aufforderung und klingt nicht mehr wie ein Prüfergebnis.
- **P-3 (Minor): erledigt.** Ob «abgerechnet» auch Entwürfe meint, ist jetzt egal: Die Akontorechnung wird in jedem Fall gelöscht («auch wenn sie schon abgerechnet ist»). Die Folge wird nach Status getrennt genannt: Entwürfe mit «Neu berechnen», versendete oder bezahlte mit «Abrechnung berichtigen». Beide Knöpfe gibt es unter genau diesem Namen. «Neu berechnen» sah ich auf dem Entwurf NK-11111111-2025-0002, «Abrechnung berichtigen» auf der versendeten NK-11111111-2025-0001. Damit ist auch meine Frage aus Runde 1 beantwortet, wie man eine versendete Abrechnung berichtigt.
- **P-4 (Minor): erledigt.** Im Akonto-Hinweis steht jetzt «Kommt die Schlussrechnung erst nach der Abrechnung dieser Periode, …». Es ist eindeutig, was gemeint ist.
- **P-5 (Nit): teilweise.** Siehe Tabelle.

## Beobachtungen

- Rechtlich halte ich die neue Regel für richtig. Art. 257a OR erlaubt Nebenkosten nur für tatsächliche Aufwendungen, Art. 257b OR verlangt die tatsächlichen Kosten der Periode. Eine Akontorechnung ist nur eine Schätzung des Lieferanten. Rechnet man sie in Ermangelung der Schlussrechnung vorläufig ab, wie es der Akonto-Hinweis vorsieht, ist das vertretbar. Später wird es mit der Schlussrechnung und einer Berichtigung richtiggestellt. Ein Mieter, der in der Periode noch nicht wohnte, wird nie belastet.
- In der Löschbestätigung steht: «die berichtigte Abrechnung rechnet an, was schon bezahlt ist». Das ist für mich der entscheidende Satz. Der Mieter zahlt nicht doppelt, er zahlt nur den Unterschied nach oder bekommt ihn zurück.
- Über die Grenzen einer Berichtigung steht nichts. Ich meine: Eine Nachforderung verjährt (in der Regel nach fünf Jahren, Art. 128 OR), und auch ein ausgezogener Mieter muss die Berichtigung erhalten. Für die Akonto-Fälle, die meist nur wenige Monate zurückliegen, ist das kaum von Belang. Ich nenne es nur der Vollständigkeit halber, ohne Schwere.
- «Sie fliesst dann in keine neue Nebenkostenabrechnung mehr ein.» und «Die Entwürfe enthalten sie weiter» passen zusammen. Ich verstehe daraus, dass Dwello Entwürfe beim Löschen nicht von selbst neu berechnet. Darum der Auftrag «Neu berechnen». Das ist ehrlich formuliert.
- Die Löschbestätigung nennt nur die Abrechnungsperiode («Für die Abrechnungsperiode 01.01.2025 – 31.12.2025 gibt es schon Abrechnungen mit dieser Rechnung.»). Welche davon Entwürfe sind und welche versendet, sehe ich nur auf der Rechnungsseite («In Abrechnungen enthalten»: drei Entwürfe, eine versendet). Für den nächsten Schritt wäre die Liste in der Bestätigung hilfreich.
- Auf der Rechnungsseite der neuen Schlussrechnung heisst es: «Der Betrag ist das Total vor dem Abzug.» Das ist jetzt ohne Ausnahme richtig, denn der frühere Zusatz «weniger die Akontorechnungen, die schon abgerechnet sind» ist weg. CHF 1’250.00 = CHF 250.00 Zahlbetrag + CHF 1’000.00 Akonto. Nachgerechnet, stimmt.
- Wie in Runde 1 ist das Häkchen bei der Akontorechnung von sich aus leer und bei der Schlussrechnung gesetzt. Gute Voreinstellung.
- In meinem Skript führte ein Klick auf die Zeile in der Rechnungsliste und auf einen Abrechnungslink zuerst nicht weiter. Beim zweiten Versuch, mit Warten auf die neue Adresse, ging es. Das lag vermutlich am Skript, nicht an der App.

## Aufgabe geschafft: ja

Beide Hinweise gelesen. Ich habe nur die Schlussrechnung erfasst (Allgemeinstrom, CHF 1’250.00, Leistungszeitraum 01.01.–31.03.2026), die Akontorechnung nicht. Den Hinweis auf der Rechnungsseite und bei «Rechnung bearbeiten» gelesen. Die Löschbestätigung einer Rechnung in einer versendeten Abrechnung geöffnet und abgebrochen, nichts gelöscht.

## Aufwand

Etwa 10 Minuten, 7 Skriptläufe. In der App: «Rechnungen hochladen», Gebäude wählen, 2 Dateien wählen, «Angaben prüfen», Kategorie wählen, «1 Rechnung erstellen». Danach Rechnungsseite, «Rechnung bearbeiten», ältere Rechnung, «Rechnung löschen», «Abbrechen», zwei Abrechnungen ansehen.

## Ablauf

1. **Rechnungen hochladen, Musterhaus Zentrum, beide PDFs.** Erwartet: zwei Hinweise nach der neuen Regel. Gesehen (01-upload-result.png): «2 von 2 Dateien gelesen. Bitte prüfen: 2.»
   - Zur Schlussrechnung: «Auf der Rechnung sind Akontorechnungen von CHF 1’000.00 abgezogen. Als Betrag ist das Total vor dem Abzug vorgeschlagen: CHF 1’250.00.» Dann: löschen «auch wenn sie schon abgerechnet sind», Dateien hier mit «Datei entfernen» entfernen, «Sonst zählen sie doppelt», Leistungszeitraum übernehmen, danach Entwürfe «Neu berechnen» und versendete oder bezahlte Abrechnungen «Abrechnung berichtigen», «So trägt jede Abrechnungsperiode ihre tatsächlichen Kosten.»
   - Zur Akontorechnung: Erklärung «Vorschuss», «Erfassen Sie in der Regel nur die Schlussrechnung mit dem Total. Kommt die Schlussrechnung erst nach der Abrechnung dieser Periode, setzen Sie das Häkchen … löschen Sie sie, wenn Sie die Schlussrechnung erfassen.»
   - Inhaltlich richtig und nachvollziehbar. Die Form ist ein langer Block (P-5).
2. **Entscheid.** Die Akontorechnung ist nicht erfasst, beide Belege gelten für dieselbe Periode. Also nur die Schlussrechnung erfassen. Das stimmt mit dem Hinweis überein.
3. **«Angaben prüfen», Kategorie «Allgemeinstrom».** Gesehen (02-angaben.png, 03-before-save.png): Leistungszeitraum 01.01.–31.03.2026 vorgeschlagen, Betrag 1250.00. Das Häkchen der Akontorechnung ist leer, der Knopf heisst «1 Rechnung erstellen».
4. **Erstellen.** Gesehen (04-after-save.png): «1 Rechnung erstellt, Werke Schlussrechnung, 31.03.2026».
5. **Rechnungsseite.** Erwartet: ein Hinweis ohne die alte Ausnahme. Gesehen (05-detail.png): Betrag CHF 1’250.00, darunter «Auf dem Beleg sind Akontorechnungen von CHF 1’000.00 abgezogen. Der Betrag ist das Total vor dem Abzug.» Es folgen die Aufforderung zur Prüfung, die Löschanweisung mit «auch wenn sie schon abgerechnet ist», das Nachführen nach Status und «Der Leistungszeitraum ist der auf dem Beleg.» Kurz und eindeutig. «In Abrechnungen enthalten: Keine».
6. **«Rechnung bearbeiten».** Gesehen (06-edit-betrag.png): derselbe Text unter dem Feld Betrag. In sich stimmig.
7. **Ältere Rechnung «ewz, Allgemeinstrom Q4 2025» (CHF 230.10), «Rechnung löschen».** Die Rechnung ist in NK-…-0001 (Versendet) und drei Entwürfen enthalten. Erwartet: eine Warnung, die die Folgen nennt. Gesehen (07-delete-038.png):
   - Titel «Rechnung löschen»: «Die Rechnung von ewz über CHF 230.10 wird gelöscht. Sie fliesst dann in keine neue Nebenkostenabrechnung mehr ein. Das lässt sich nicht rückgängig machen.»
   - Kasten «Rechnung schon abgerechnet»: Periode 2025. «Löschen Sie nur falsch erfasste Rechnungen oder Akontorechnungen, die eine Schlussrechnung ersetzt.» (P-7). Entwürfe danach «Neu berechnen» (P-6), versendete oder bezahlte mit «Abrechnung berichtigen», «die berichtigte Abrechnung rechnet an, was schon bezahlt ist», Original aufbewahren, Einsichtsrecht des Mieters.
   - «Abbrechen» geklickt. Der Dialog schloss sich, und der Browser schickte keine Anfrage ausser GET (im Netzwerk nachgesehen).
8. **Kontrolle der genannten Knöpfe.** Gesehen: «Neu berechnen» auf dem Entwurf NK-11111111-2025-0002 (08-0002.png), «Abrechnung berichtigen» auf der versendeten NK-11111111-2025-0001 von Hans Müller, Wohnung 1.01 (08-0001.png). Die Namen stimmen mit den Hinweisen überein.

## Verwirrung

- «Akontorechnungen, die eine Schlussrechnung ersetzt»: wer ersetzt wen? (P-7)
- «danach» in der Löschbestätigung: nach dem Löschen oder nach dem Erfassen der Schlussrechnung? (P-6)
- Keine unklaren Begriffe mehr. «abgerechnet», «Entwurf», «versendet», «bezahlt» und die beiden Knopfnamen passen zu dem, was die App zeigt.

## Fehlerrisiken

- Wer die Akontorechnung über die Löschbestätigung zuerst löscht und sofort berichtigt, bevor die Schlussrechnung erfasst ist, schickt dem Mieter eine Gutschrift. Später muss er ein zweites Mal berichtigen. Das sind zwei Schreiben an den Mieter statt einem, und es wirkt unprofessionell (P-6).
- Wer den langen Hochlade-Hinweis überfliegt, übersieht vielleicht das Nachführen der Abrechnungen am Ende (P-5).

## Vorschläge

- **P-5.** Reproduktion: Rechnungen hochladen, Musterhaus Zentrum, «Werke Schlussrechnung.pdf», den Hinweis lesen. Was hilft: als kurze Liste in der Reihenfolge der Handlung, zum Beispiel: 1. Leistungszeitraum vom Beleg übernehmen. 2. Erfasste Akontorechnungen löschen, ausgewählte Dateien entfernen. 3. Abrechnungen mit ihnen nachführen (Entwürfe «Neu berechnen», versendete oder bezahlte «Abrechnung berichtigen»).
- **P-6.** Reproduktion: eine Rechnung von Musterhaus Zentrum öffnen, die in einer versendeten Abrechnung steckt (z. B. ewz, Allgemeinstrom Q4 2025), «Rechnung löschen», den Kasten «Rechnung schon abgerechnet» lesen. Was hilft: ein Satz vor dem Nachführen, zum Beispiel «Ersetzt eine Schlussrechnung diese Akontorechnung, erfassen Sie zuerst die Schlussrechnung. Berechnen Sie danach die Entwürfe …».
- **P-7.** Reproduktion: wie P-6. Was hilft: «… oder Akontorechnungen, an deren Stelle eine Schlussrechnung tritt.» oder «… oder Akontorechnungen, für die Sie die Schlussrechnung erfassen.»

## Nicht geprüft

- Das Löschen selbst und was danach mit den Entwürfen und der versendeten Abrechnung geschieht: Die Rechnung gehört zu den Demodaten, und die Aufgabe verbot das Löschen.
- «Abrechnung berichtigen» und «Neu berechnen» ausgeführt: Ich habe nur nachgesehen, ob es die Knöpfe gibt. Das Ausführen hätte fremde Abrechnungen verändert.
- Der Fall «Akontorechnung schon erfasst und abgerechnet, dann die Schlussrechnung hochladen»: In Musterhaus Zentrum gibt es keine solche Akontorechnung. Den Text habe ich deshalb nur gelesen und beurteilt.
- Andere Sprachen, dunkler Modus, PDF der Abrechnung: nicht Teil der Aufgabe.
