# Persona-Lauf: Dr. Weber, Slice b13-retry (Mietverträge einer Wohnung laden fehlgeschlagen)

Persona: Dr. Weber, 52, juristisch vorsichtig, liest jedes Wort, prüft Plausibilität. Desktop 1440 × 900, Maus.
App: http://localhost:3300 (Demodaten, von Aufrufer gestartet). Simulierter Fehler: Die Browser-Anfrage `GET /api/contracts?apartmentId=<id>` antwortet mit Status 500, nur für eine Wohnung:

- Neuer Mietvertrag und Bearbeiten (Laura Keller): Wohnung EG · Alpenblick (`aaaa3333-3333-3333-3333-111111111111`, laufender Mietvertrag Laura Keller seit 01.11.2022, unbefristet).
- Bearbeiten mit Entwurf einer Nebenkostenabrechnung: Wohnung A2 · Seepark Residenz (`aaaa2222-2222-2222-2222-222222222222`, Sarah Meier 01.08.2021 – 30.06.2025, Nina Brunner seit 01.07.2025, Entwurf NK-22222222-2025-0003).

Der Fehler wurde nie aufgehoben. Skripte und Screenshots: `/tmp/claude-0/persona-weber/`.

## Aufgabe geschafft: ja

Alle Hinweistexte gelesen und beurteilt, das Versprechen «Beim Speichern prüft Dwello in jedem Fall …» im Assistenten und im Bearbeitungsformular geprüft: Es hält. Die überschneidenden Mietverträge wurden in allen drei Versuchen abgelehnt. Nebenbei habe ich einen davon unabhängigen Fehler im Bearbeitungsformular gefunden (Wohnung wechseln wird stillschweigend nicht gespeichert, siehe W-02).

## Aufwand

Etwa 12 Minuten, 15 Durchläufe. Ein Durchlauf durch den Assistenten: 5 Schritte, rund 12 Klicks und Eingaben.

## Ablauf: erwartet und gesehen

1. **Mietverträge, Liste.** Erwartet: Die EG Alpenblick ist an Laura Keller vermietet. Gesehen: «Laura Keller, Wohnung EG · Alpenblick, Laufend seit 01.11.2022, unbefristet». Das ist mein Bezugspunkt.
2. **Neuer Mietvertrag, Schritt 1 Mieter.** Nina Brunner gewählt, «Weiter». Nichts Auffälliges.
3. **Schritt 2 Wohnung, Liste offen, noch nichts gewählt.** Erwartet: Die EG ist entweder «nicht verfügbar» oder als «nicht geprüft» markiert. Gesehen: «Wohnung EG - Alpenblick, 3 Zimmer, 72 m²» steht als **erste** Wohnung zuoberst, ohne jeden Zusatz, vor 2.02, 3.02 und B1. Der Hilfetext über der Liste sagt: «Freie Wohnungen stehen zuoberst. Vermietete Wohnungen sind mit «nicht verfügbar» markiert und lassen sich nicht wählen.» Nach diesem Text muss ich die EG für frei halten. Das ist falsch (siehe W-01). Vor der Auswahl gibt es keinen Hinweis auf einen Ladefehler.
4. **EG gewählt.** Darunter erscheint ein gelber Kasten mit Warnsymbol (Screenshot `11-wohnung-gewaehlt.png`):
   «Überschneidung noch nicht geprüft. Dwello konnte die Mietverträge dieser Wohnung nicht laden. Wählen Sie «Erneut versuchen»; Ihre Eingaben bleiben erhalten. Beim Speichern prüft Dwello in jedem Fall, ob sich der Zeitraum mit einem anderen Mietvertrag dieser Wohnung überschneidet.» Dazu die Schaltfläche «Erneut versuchen».
   Meine Beurteilung: Der Text sagt ehrlich, was nicht geht (laden), was deshalb fehlt (Überschneidung nicht geprüft) und was trotzdem passiert (Prüfung beim Speichern). Das ist gut. Er widerspricht aber dem Hilfetext darüber: Die Liste behauptet stillschweigend «frei», der Kasten sagt «unbekannt». Er sagt auch nicht, dass die Wohnung deshalb womöglich nur scheinbar frei in der Liste steht.
5. **«Erneut versuchen» geklickt (Fehler bleibt).** Erwartet: eine Rückmeldung wie «Laden erneut fehlgeschlagen». Gesehen: Der Kasten sieht genau gleich aus wie vorher. Ich kann nicht erkennen, ob überhaupt etwas passiert ist (W-05).
6. **Schritt 3 Vertragsdauer, Vertragsbeginn 01.01.2027, unbefristet.** Unter dem Datum steht derselbe gelbe Kasten mit dem gleichen Wortlaut wie in Schritt 2, wieder mit «Erneut versuchen». Das passt zusammen.
7. **Schritt 4 Miete:** Nettomiete 1400.00, Akonto 200.00. Monatlich total CHF 1’600.00, rechnerisch richtig.
8. **Schritt 5 Prüfen.** Gleicher gelber Kasten über der Zusammenfassung. Zusammenfassung stimmt (Nina Brunner, EG Alpenblick, Freitag 1. Januar 2027, Unbefristet, 1’400 + 200 + 0 = 1’600).
9. **«Mietvertrag speichern».** Erwartet laut Versprechen: Ablehnung wegen Überschneidung mit Laura Keller. Gesehen: roter Kasten «Der Mietvertrag wurde nicht gespeichert. Der Zeitraum überschneidet sich mit einem anderen Mietvertrag dieser Wohnung. Ändern Sie den Vertragsbeginn oder wählen Sie «Befristet» mit einem früheren Vertragsende.» Seite und Eingaben bleiben erhalten. **Das Versprechen hält.** Ein Mangel: Der gelbe Kasten «Überschneidung noch nicht geprüft» steht weiterhin direkt darüber, obwohl Dwello gerade eine Überschneidung festgestellt hat (W-03). Die Meldung nennt den anderen Mietvertrag nicht, und der Ratschlag passt hier nicht (W-04). In der Liste ist danach kein neuer Mietvertrag von Nina Brunner auf EG.
10. **Gegenprobe im Assistenten mit Wohnung A2 (Fehler auf A2), Thomas Weber, Beginn 01.06.2025.** Die Warnung «liegt in der Vergangenheit» erscheint in Schritt 3 dreimal gleichzeitig (W-08). Nach dem zweiten «Weiter» und dem Speichern kommt dieselbe Überschneidungs-Ablehnung. Gut: Die Überschneidung wird vor der Frage nach dem Entwurf der Nebenkostenabrechnung geprüft.
11. **Bearbeiten, Mietvertrag Laura Keller (EG, Fehler auf EG).** Bei der Wohnung steht derselbe gelbe Kasten, Wortlaut gleich wie im Assistenten. Beim Vertragsbeginn steht ein anderer Text: «Überschneidung noch nicht geprüft. Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung.» «Fehlen noch» lese ich als «es gibt keine Mietverträge» oder «noch nicht erfasst», nicht als «konnten nicht geladen werden» (W-06). Der Verweis nach oben ist sonst sinnvoll.
12. **Bearbeiten, Mietvertrag Marco Bernasconi (OG2, künftig ab 01.12.2026), Wohnung auf EG geändert (Fehler auf EG), «Änderungen speichern».** Erwartet: Ablehnung wegen Überschneidung mit Laura Keller. Gesehen: Weiterleitung zur Detailseite und eine grüne Meldung «Mietvertrag von Marco Bernasconi gespeichert». Auf der Detailseite steht aber weiterhin «Wohnung OG2 · Alpenblick» (Screenshot `23-edit-saved.png`). Gegenprobe ohne Fehler mit einer freien Wohnung (B1 Seepark): ebenfalls «gespeichert», Wohnung bleibt OG2. Der Wechsel der Wohnung wird also immer stillschweigend verworfen, mit Erfolgsmeldung (W-02). Eine Überschneidung ist dadurch nicht entstanden, aber die Meldung «gespeichert» ist unwahr.
13. **Bearbeiten, Mietvertrag Nina Brunner (A2, Fehler auf A2), Vertragsbeginn 01.06.2025.** Hinweis «liegt in der Vergangenheit. Stimmt das Datum?». Speichern: roter Kasten «Der Mietvertrag wurde nicht gespeichert. Der Zeitraum überschneidet sich mit einem anderen Mietvertrag dieser Wohnung.» **Das Versprechen hält auch hier.** Anders als im Assistenten fehlt der Satz, was ich tun soll (W-07).
14. **Gleicher Mietvertrag, Vertragsbeginn 15.07.2025 (keine Überschneidung).** Speichern: «Der Mietvertrag wurde nicht gespeichert. Die Nebenkostenabrechnung NK-22222222-2025-0003 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen.» Dazu ein Link zur Abrechnung, der Satz «Der Entwurf NK-22222222-2025-0003 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.» und die Schaltfläche «Entwurf löschen und Mietvertrag speichern». Der Text ist sachlich richtig und nennt die echte Folge.
15. **Versuch, die Überschneidung über diese Schaltfläche durchzubringen:** Vertragsbeginn zurück auf 01.06.2025 gesetzt. Erwartet: Die Schaltfläche verschwindet oder es kommt eine Ablehnung. Gesehen: Die Schaltfläche und der Entwurfs-Hinweis verschwinden, sobald ich das Datum ändere. Übrig bleibt «Änderungen speichern», und das lehnt die Überschneidung ab (Schritt 13). Ich kann also nicht über diese Schaltfläche einen Entwurf löschen und gleichzeitig eine Überschneidung speichern. Das ist gut. Die Schaltfläche selbst habe ich nicht gedrückt (siehe «Nicht geprüft»).

## Beurteilung der Texte (Aufgabe 1)

- **Gelber Kasten (Wohnung, Vertragsbeginn im Assistenten, Prüfen, Wohnung im Bearbeitungsformular):** Was er sagt, ist richtig und durch meinen Test belegt: Laden fehlgeschlagen, Überschneidung vorher nicht geprüft, beim Speichern geprüft. Er nennt, was nicht geprüft wurde, nämlich die Überschneidung. Dass Speichern sicher ist, finde ich nach dem Test glaubhaft. Nicht stimmig ist er mit dem Hilfetext der Wohnungsliste (W-01) und, nach einer Ablehnung, mit sich selbst («noch nicht geprüft» neben «überschneidet sich», W-03).
- **Vertragsbeginn im Bearbeitungsformular:** Der Text ist kürzer und anders formuliert. «fehlen noch» ist ungenau (W-06).
- **Ablehnung «Entwurf löschen und Mietvertrag speichern»:** Sie erscheint nur ohne Überschneidung. Mit Überschneidung gewinnt die Überschneidungs-Ablehnung. Der Text nennt die betroffene Abrechnung mit Nummer und die Folge (Löschung, neu erstellen). Das ist plausibel und vorsichtig genug.
- **«Laufender Mietvertrag: Änderungen an einem laufenden Mietvertrag gelten sofort. Bei Mietanpassungen sollten Sie die gesetzlichen Kündigungsfristen beachten.»:** Juristisch verkürzt. Eine Mietzinserhöhung braucht auch das amtliche Formular, und Änderungen «gelten sofort» nur in Dwello, nicht im Rechtsverhältnis (W-09, nicht Teil dieses Slices).

## Verwirrung, auch bei Begriffen

- «Freie Wohnungen stehen zuoberst» und die EG steht zuoberst: Ich halte sie für frei, bis ich sie wähle.
- «Überschneidung noch nicht geprüft» bleibt stehen, nachdem Dwello die Überschneidung festgestellt hat. Was gilt jetzt?
- «Die Mietverträge dieser Wohnung fehlen noch»: Fehlen sie in Dwello, oder wurden sie nicht geladen?
- «Erneut versuchen» ohne sichtbare Wirkung: Hat es geklappt oder nicht?
- «Entwurf gespeichert, 20:39» im Assistenten (ein Entwurf des Mietvertrags) und kurz darauf «Entwurf löschen» (ein Entwurf der Nebenkostenabrechnung): zweimal «Entwurf» für zwei verschiedene Dinge. Im Bearbeitungsformular wird es durch die Abrechnungsnummer klar, im Kopf bleibt es aber doppelt belegt.
- «Wählen Sie «Befristet» mit einem früheren Vertragsende»: früher als was? Der andere Mietvertrag beginnt 2022. Ein neues Vertragsende vor 2027 löst die Überschneidung nicht.

## Fehlerrisiken

- Wer der Liste glaubt, wählt eine vermietete Wohnung als «frei», füllt alle 5 Schritte aus und erfährt erst beim Speichern, dass es nicht geht. Datenschaden entsteht keiner, weil die Prüfung beim Speichern greift.
- Wer im Bearbeitungsformular eine andere Wohnung wählt, bekommt «gespeichert» und glaubt, der Mietvertrag sei umgezogen. Nebenkostenabrechnung und Rechnungen laufen dann weiter auf der alten Wohnung. Dieses Risiko besteht unabhängig vom simulierten Fehler (W-02).
- Ohne Angabe, mit welchem Mietvertrag sich der Zeitraum überschneidet, muss ich in der Liste selbst suchen. Wer das nicht tut, ändert vielleicht auf gut Glück Daten oder beendet den falschen Mietvertrag.

## Vorschläge

| ID | Schwere | Bildschirm | Befund und Vorschlag | Reproduktion |
|---|---|---|---|---|
| W-01 | Major | Neuer Mietvertrag, Schritt 2 Wohnung, und Mietvertrag bearbeiten, Feld Wohnung | Eine Wohnung, deren Mietverträge nicht geladen werden konnten, steht ohne Kennzeichnung bei den freien Wohnungen zuoberst. Der Hilfetext sagt, vermietete Wohnungen seien mit «nicht verfügbar» markiert, und ist in diesem Zustand falsch. Vorschlag: in der Option kennzeichnen (z. B. «(nicht geprüft)») und nicht bei den freien einsortieren, oder den Hilfetext im Fehlerfall ergänzen. | Anfrage `GET /api/contracts?apartmentId=aaaa3333-3333-3333-3333-111111111111` mit 500 beantworten, /contracts/new öffnen, Mieter wählen, «Weiter»: Die Option «Wohnung EG - Alpenblick» steht zuoberst ohne Zusatz. |
| W-02 | Major | Mietvertrag bearbeiten | Wohnung wechseln wird nicht gespeichert, trotzdem erscheint «Mietvertrag von … gespeichert». Die Detailseite zeigt die alte Wohnung. Das passiert auch ohne simulierten Fehler. Vorschlag: den Wechsel speichern oder das Feld sperren und erklären, warum die Wohnung nicht geändert werden kann. Nie «gespeichert» melden, wenn eine Eingabe verworfen wurde. | /contracts/02c6bad8-b289-4234-acfc-7f7e09894fc9/edit (Marco Bernasconi, OG2), Wohnung «Wohnung B1 - Seepark Residenz» wählen, «Änderungen speichern»: Erfolgsmeldung, Detailseite und Liste zeigen weiter «Wohnung OG2 · Alpenblick». |
| W-03 | Minor | Neuer Mietvertrag, Prüfen; Mietvertrag bearbeiten | Nach der Ablehnung «Der Zeitraum überschneidet sich …» steht weiter der gelbe Kasten «Überschneidung noch nicht geprüft». Das widerspricht sich. Vorschlag: Den Kasten ausblenden oder anpassen, sobald das Speichern eine Antwort zur Überschneidung gebracht hat. | Wie Ablauf Schritt 9: Fehler auf EG, Nina Brunner, EG, 01.01.2027, 1400.00, speichern. |
| W-04 | Minor | Neuer Mietvertrag, Prüfen (Ablehnung) | Die Ablehnung nennt den überschneidenden Mietvertrag nicht (Mieter, Zeitraum). Der Rat «Befristet mit einem früheren Vertragsende» hilft nicht, wenn der andere Mietvertrag früher beginnt. Vorschlag: «… mit dem Mietvertrag von Laura Keller (seit 01.11.2022, unbefristet)» nennen und den Rat auf den Fall abstimmen. | Wie W-03. |
| W-05 | Minor | Gelber Kasten, «Erneut versuchen» | Schlägt der neue Versuch wieder fehl, ändert sich nichts Sichtbares. Vorschlag: kurz «Wird geladen …» und danach «Erneut fehlgeschlagen, um HH:MM» anzeigen. | Fehler auf EG, Schritt 2, EG wählen, «Erneut versuchen» klicken: Der Kasten bleibt unverändert. |
| W-06 | Minor | Mietvertrag bearbeiten, Vertragsbeginn | «Die Mietverträge dieser Wohnung fehlen noch» ist mehrdeutig, und der Wortlaut weicht vom Assistenten ab, wo an derselben Stelle der volle Text steht. Vorschlag: «Die Mietverträge dieser Wohnung konnten nicht geladen werden, siehe oben bei der Wohnung.» | Fehler auf EG, /contracts/b0000003-0003-0003-0003-000000000001/edit öffnen. |
| W-07 | Minor | Mietvertrag bearbeiten (Ablehnung Überschneidung) | Die Ablehnung sagt nicht, was zu tun ist. Im Assistenten steht es dabei. Vorschlag: gleicher Handlungssatz wie im Assistenten, mit Bezug auf den anderen Mietvertrag (siehe W-04). | Fehler auf A2, /contracts/b0000002-0002-0002-0002-000000000003/edit, Vertragsbeginn 01.06.2025, «Änderungen speichern». |
| W-08 | Minor | Neuer Mietvertrag, Schritt 3 | Die Warnung «Der Vertragsbeginn … liegt in der Vergangenheit. Stimmt das Datum?» erscheint dreimal gleichzeitig: zweimal als Fehlertext am Feld, einmal als Kasten. | Neuer Mietvertrag, Vertragsbeginn 01.06.2025, «Weiter». |
| W-09 | Nit | Mietvertrag bearbeiten, Hinweis «Laufender Mietvertrag» | Verkürzte Rechtsaussage: Für Mietzinserhöhungen gelten das amtliche Formular und Fristen. «Gelten sofort» betrifft nur die Daten in Dwello. Vorschlag: «Änderungen gelten in Dwello sofort. Eine Mietzinsänderung gegenüber dem Mieter braucht Form und Frist nach Gesetz.» (fachlich prüfen lassen) | Laufenden Mietvertrag bearbeiten. |
| W-10 | Nit | Neuer Mietvertrag, Schrittanzeige | «Vertragsdauer» bricht bei 1440 px mitten im Wort um («Vertragsda / uer»). | /contracts/new, Desktop 1440 × 900. |

## Nicht geprüft

- **«Entwurf löschen und Mietvertrag speichern» selbst gedrückt:** nicht gemacht. Das ginge nur ohne Überschneidung, prüft das Versprechen also nicht. Ausserdem hätte es den Entwurf NK-22222222-2025-0003 in den gemeinsam genutzten Demodaten gelöscht. Geprüft ist nur: Mit Überschneidung erscheint die Schaltfläche nicht, und sie verschwindet, sobald man das Datum ändert.
- **Verhalten nach erfolgreichem «Erneut versuchen»:** Die Aufgabe verlangt, den Fehler nicht aufzuheben.
- **Gleichzeitige Änderung durch eine zweite Person** zwischen Ablehnung und erneutem Speichern: als Einzelnutzer nicht nachstellbar.
- **Andere Sprachen, Dunkelmodus, mobile Ansicht:** nicht Teil meiner Persona.
- **Datenstand:** Während meines Laufs hat jemand anders einen Mietvertrag angelegt (Laura Keller, 3.02, ab 01.11.2026). Meine eigenen Speicherversuche haben keine Daten verändert: Alle Überschneidungen wurden abgelehnt, und die beiden «gespeicherten» Wohnungswechsel (W-02) wurden verworfen.
