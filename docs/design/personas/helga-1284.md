# Helga – #1284 «Aufgehobene Wohnung»

Desktop 1440 × 900, Zoom 150 % (Löschdialog auch bei 200 %), Maus. Gebäude: Seepark Residenz. Heute laut Dwello: 08.11.2026.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Wohnung B1 (Detail), Gebäude Seepark Residenz (Liste) | Nach dem Speichern von «Aufgehoben ab 01.04.2026» steht bei B1 weiter «Leer – Es läuft kein Mietvertrag, die Wohnung kann vermietet werden» und der grosse blaue Knopf «Mietvertrag erfassen». In der Wohnungsliste des Gebäudes steht B1 nur als «Leer». Die Wohnung gibt es seit dem 1. April nicht mehr; ich weiss nicht, ob ich ihr jetzt noch einen Mieter geben kann oder soll. |
| P-2 | Minor | Wohnung A1 bearbeiten, Feld «Aufgehoben ab» | Der Hilfetext sagt bei der vermieteten A1 genau das Gleiche wie bei der leeren B1: «Bis zum Tag davor zählt sie in den Abrechnungen mit, und ihren Anteil tragen Sie.» Bei A1 bezahlt doch Herr Weber seine Nebenkosten, nicht ich. Da bin ich unsicher geworden, ob Dwello mir seine Kosten aufbürdet. |
| P-3 | Minor | Wohnung A1 bearbeiten, Meldung «Nicht gespeichert» | Die Meldung sagt, ich soll «zuerst ein Vertragsende» erfassen, aber nicht wo. Es gibt keinen Link zum Mietvertrag von Thomas Weber; ich müsste selber über «Mietverträge» suchen. |
| P-4 | Minor | Wohnung B1 bearbeiten, Feld «Aufgehoben ab» | Mein Neffe sprach von «nächstem Frühling», ich habe den 01.04.2026 eingetippt. Das liegt schon über sieben Monate zurück. Dwello hat ohne jeden Hinweis gespeichert. Ein Satz wie «Dieser Tag liegt in der Vergangenheit, Abrechnungen ab dann rechnen ohne die Wohnung» hätte mich stutzig gemacht. |
| P-5 | Minor | Wohnung B1, Dialog «Wohnung B1 löschen?» | Der Text ist ein einziger langer Block mit acht Sätzen. Bei 200 % sind die Knöpfe unten abgeschnitten (nur ihr oberer Rand ist zu sehen). Den wichtigen Satz zu «Aufgehoben ab» habe ich erst beim zweiten Lesen gefunden, er steht mitten im Block. |

## Beobachtungen

- Der Löschdialog bei B1 hat mich gerettet: Er sagt klar «löschen Sie sie nicht, sondern erfassen Sie unter «Bearbeiten» im Feld «Aufgehoben ab» den Tag». Ich wusste danach genau, wohin.
- Unter dem Datumsfeld erscheint nach dem Eintippen «Mittwoch, 1. April 2026». Das ist schön, so sehe ich, dass Dwello das Datum richtig verstanden hat.
- Der Hilfetext am Feld ist sehr lang (sieben Sätze plus Format). Den Satz «Wird eine andere Wohnung dadurch grösser, kann Dwello ihre neue Fläche noch nicht ab diesem Tag berücksichtigen» verstehe ich nicht: Muss ich dann etwas tun? Bei uns wird B1 ja zum Treppenhaus, also keine Wohnung grösser, glaube ich.
- «Eine berichtigte Abrechnung rechnet mit diesem Tag» – was eine berichtigte Abrechnung ist, weiss ich nicht. Beruhigend war «Versendete Abrechnungen bleiben unverändert».
- Das Wort «Aufgehoben» passt für mich nicht ganz zu einer Wohnung; ich hätte «Gibt es nicht mehr ab» gesucht. Mit dem Hilfetext war es aber verständlich.
- Die Meldung bei A1 ist sonst gut: Sie nennt den Namen Thomas Weber, sagt warum es nicht geht und zwei Auswege. Das Datum blieb im Feld stehen, nichts wurde gespeichert; A1 zeigt danach kein «Aufgehoben ab».
- Der Löschdialog bei der vermieteten A1 («kann nicht gelöscht werden, weil sie Mietverträge hat») erwähnt das Feld «Aufgehoben ab» nicht. Wer dort hinkommt, erfährt nichts vom richtigen Weg.
- Die Meldung «Wohnung B1 gespeichert» schwebt nach dem Speichern über dem Text der Wohnungsangaben und verdeckt einen Teil des Satzes zur leeren Wohnung.
- Ob ich jetzt etwas an den Abrechnungen 2026 tun muss, sagt mir Dwello nirgends. Ich nehme an, nichts, solange ich sie erst erstelle.

## Aufgabe geschafft: ja

B1 nicht gelöscht, sondern «Aufgehoben ab 01.04.2026» gespeichert; die Wohnungsseite zeigt «Aufgehoben ab 01.04.2026». Bei A1 hat Dwello abgelehnt; ich verstehe warum.

## Aufwand

Etwa 12 Minuten, 9 Schritte (Gebäude → Seepark Residenz → B1 → Löschen lesen → Abbrechen → Bearbeiten → Datum → Speichern → prüfen; dann A1 Löschen lesen, Bearbeiten, Datum, Speichern).

## Ablauf

- Nach dem Speichern bei B1 erwartet: die Wohnung ist als «aufgehoben» oder «gibt es nicht mehr» gekennzeichnet. Gesehen: Mietstatus weiterhin «Leer … kann vermietet werden», Knopf «Mietvertrag erfassen» hervorgehoben; nur unten in den Angaben neu «Aufgehoben ab 01.04.2026» (P-1).
- Beim Eintippen von 01.04.2026 erwartet: ein Hinweis, falls der Tag schon vorbei ist. Gesehen: kein Hinweis, gespeichert (P-4).
- Bei A1 im Hilfetext erwartet: ein Satz für vermietete Wohnungen. Gesehen: «ihren Anteil tragen Sie», wie bei der leeren Wohnung (P-2).
- Bei der Ablehnung bei A1 erwartet: ein Link zum Mietvertrag. Gesehen: nur Text (P-3).
- Löschdialog bei 200 % erwartet: Knöpfe sichtbar. Gesehen: Knöpfe unten abgeschnitten, nur ihr oberer Rand sichtbar (P-5).

## Vorschläge

- **P-1:** Seepark Residenz → B1 → Bearbeiten → «Aufgehoben ab» 01.04.2026 → Änderungen speichern. Danach auf der Wohnungsseite den Status wie «Aufgehoben seit 01.04.2026 – die Wohnung gibt es nicht mehr» zeigen statt «kann vermietet werden», «Mietvertrag erfassen» nicht mehr als Hauptknopf anbieten, und in der Wohnungsliste des Gebäudes ebenfalls «Aufgehoben ab …» zeigen.
- **P-2:** A1 → Bearbeiten → Hilfetext bei «Aufgehoben ab» lesen. Für vermietete Wohnungen einen eigenen Satz, z. B. «Bis zum Tag davor zählt sie in den Abrechnungen mit», ohne «tragen Sie»; oder «ihren Anteil trägt der Mieter oder, wenn sie leer steht, Sie».
- **P-3:** A1 → Bearbeiten → 01.04.2026 → Änderungen speichern. In der Meldung einen Link «Mietvertrag von Thomas Weber öffnen» anbieten.
- **P-4:** B1 → Bearbeiten → 01.04.2026 (heute 08.11.2026) → speichern. Unter dem Feld einen Hinweis zeigen, wenn der Tag in der Vergangenheit liegt, und was das für schon erstellte Abrechnungen 2026 heisst.
- **P-5:** B1 → Löschen bei 200 % Zoom. Den Text in kurze Absätze teilen, den Rat «Aufgehoben ab» als eigenen Absatz oder mit Link «Wohnung bearbeiten» zuerst zeigen; die Knöpfe ohne Scrollen sichtbar halten.

## Nicht geprüft

- Wie eine Nebenkostenabrechnung 2026 für Seepark Residenz B1 danach rechnet: Ich habe keine Abrechnung erstellt, weil das nicht zur Aufgabe gehörte; ich habe nur die Texte gelesen.
- Ob sich die Knöpfe im Löschdialog bei 200 % durch Scrollen im Dialog erreichen lassen: nur der Screenshot angesehen, nicht gescrollt.
- Das Kalender-Symbol neben dem Feld habe ich nicht benutzt, nur getippt.
- Löschen habe ich nirgends bestätigt; A1 blieb unverändert.
