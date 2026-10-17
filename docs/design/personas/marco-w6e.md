# Marco – Nachträgliche Rechnung 2024 und der Hinweis «Abrechnungen nicht aktuell» (w6e)

Persona: Marco, 38, auf dem Smartphone (390 × 844, Touch), wenig Zeit. Persona-App auf http://localhost:3300 mit Demodaten. Ich habe nur im Gebäude «Seepark Residenz» gespeichert: eine Rechnung «Hauswart Muster AG», CHF 250.00, Kategorie Hauswart, Rechnungsdatum 20.12.2024 (Beschreibung «Hauswartung Dezember 2024»). Abrechnungen habe ich nur angeschaut, nichts gelöscht, berichtigt oder zurückgesetzt.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/fb7498aa-16d8-576c-b542-2cec6868dbbd/scratchpad/persona-marco/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Rechnung (Detail nach dem Speichern) | Im Hinweis «Abrechnungen nicht aktuell» gibt es keinen Link zu den betroffenen Abrechnungen. Ich musste selbst über Menü > Nebenkostenabrechnungen > Gebäude filtern suchen. Die Liste hat keinen Filter nach Jahr oder Periode und zeigt nicht, welche Abrechnungen veraltet sind. |
| P-2 | Major | Rechnung (Detail nach dem Speichern) | Der Hinweis beginnt mit «Löschen Sie die Entwürfe dieser Periode und erstellen Sie die Abrechnungen erneut». Für Seepark 2024 gibt es aber keine Entwürfe, alle drei Abrechnungen sind «Bezahlt». Was für mich gilt, steht erst im dritten Satz und spricht von «Versendete Abrechnungen». Ob «Bezahlt» da mitgemeint ist, ist offen. Der Text sagt nicht, welcher Fall bei mir vorliegt. |
| P-3 | Minor | Rechnung (Detail nach dem Speichern) | Die Meldung «Rechnung von Hauswart Muster AG gespeichert» liegt unten über dem Hinweistext und verdeckt genau die Zeilen «… ausserhalb von Dwello: Schicken Sie dem Mieter …». |
| P-4 | Minor | Rechnung (Detail nach dem Speichern) | Auf dem Handy ist der Hinweis ein Textblock von rund 18 Zeilen ohne Schritte oder Aufzählung. Er nennt weder das Gebäude noch wie viele Abrechnungen betroffen sind. |
| P-5 | Minor | Abrechnung (Detail, 2024) | «Seit dem Erstellen dieser Abrechnung wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht.» Welche Rechnung, steht nicht da. Es gibt keinen Link, keinen Betrag und keine Angabe, ob sie erfasst, geändert oder gelöscht wurde. Für einen berichtigten Brief an den Mieter brauche ich genau das. |
| P-6 | Nit | Rechnung (Detail nach dem Speichern) | Über dem Hinweis steht als grösster Knopf «Rechnung bearbeiten». Der eigentliche nächste Schritt (Abrechnungen ansehen) hat keinen Knopf. |

## Beobachtungen

- Der Hinweis bleibt da: Wenn ich die Rechnung später wieder öffne, steht «Abrechnungen nicht aktuell» immer noch dort. Das ist gut.
- Die Übersicht (Dashboard) sagt nach dem Speichern nichts über 2024. Unter «Als Nächstes zu tun» stehen nur die Periode 2025 (Alpenblick) und die 7 Entwürfe. Wer die Rechnungsseite zu schnell verlässt, erfährt nichts mehr, ausser er öffnet zufällig eine Abrechnung von 2024.
- Die Abrechnung 2024 von Thomas Weber zeigt gut sichtbar den Kasten «Rechnungen seit der Abrechnung geändert». Das ist hilfreich, nur ohne Link (P-5).
- Direkt über diesem Warnkasten steht der Knopf «Zahlung zurücksetzen». Auf dem Handy liegt er nahe beim Warnkasten. Wer nach einer Aktion zum «Berichtigen» sucht, könnte ihn für die Korrektur halten.
- Im Verlauf der Abrechnung steht «Erstellt 17.10.2026», aber «Versendet 14.04.2025». Das kommt wohl von den Demodaten, sieht aber widersprüchlich aus.
- Formular: Das Rechnungsdatum ist mit dem heutigen Datum vorbelegt (17.10.2026). Der Hilfetext sagt zum Glück gleich darüber «nicht das heutige». Der Wochentag unter dem Feld («Freitag, 20. Dezember 2024») bestätigt die Eingabe, das hat mir gefallen.
- Der Hilfetext zum Leistungszeitraum ist auf dem Handy sehr lang (etwa 12 Zeilen), obwohl das Feld optional ist.
- Kategorie und Verteilschlüssel waren schnell gewählt. «Keiner – die Kosten werden gleichmässig pro Wohnung verteilt» ist auf der Detailseite klar. In der Abrechnung 2024 wird Hauswart aber «Pro Fläche (m²)» verteilt. Ob meine neue Rechnung ohne Verteilschlüssel bei einer Neuberechnung anders verteilt würde, hat mir niemand gesagt.
- Im Barrierefreiheitsbaum stand nach der Auswahl beim Feld «Kategorie (optional)» nur noch die Option «Kategorie auswählen», sichtbar war aber «Hauswart» gewählt. Gespeichert wurde Hauswart. Vermutlich ein Effekt beim Auslesen, nicht von mir als Nutzer bemerkbar.

## Aufgabe geschafft: teilweise

Die Rechnung habe ich erfasst und gespeichert. Den Hinweis auf 2024 habe ich gesehen und verstanden, dass meine Abrechnungen 2024 nicht mehr stimmen. Was ich konkret tun muss, wusste ich nicht sicher. Der erste Rat (Entwürfe löschen) passte nicht, und für die bezahlten Abrechnungen schickt mich Dwello «ausserhalb von Dwello» weiter. Die betroffenen Abrechnungen habe ich nur über eigenes Suchen gefunden.

## Aufwand

- Etwa 4 Minuten für Marco, rund 14 Taps und Eingaben.
- Rechnung erfassen: 9 Schritte (Übersicht > «Rechnung erfassen», Gebäude, Datum, Betrag, Rechnungssteller, Beschreibung, Kategorie, «Rechnung speichern»).
- Den Abrechnungen nachgehen: 5 Schritte (Menü, «Nebenkostenabrechnungen», Gebäude «Seepark Residenz», «Suchen», Abrechnung Thomas Weber 2024).

## Ablauf

1. **Übersicht öffnen.** Erwartet: ein schneller Weg zu «Rechnung erfassen». Gesehen: Unter «Häufige Arbeiten» gibt es «Rechnung erfassen». Gut auffindbar, ganzer Balken antippbar. (Screenshot 01-dashboard.png: Kachel «Nebenkostenabrechnungen erstellen» für 2025/Alpenblick oben, darunter Entwürfe, dann die Liste der häufigen Arbeiten.)
2. **Formular «Neue Rechnung».** Erwartet: wenige Felder. Gesehen: Gebäude, Rechnungsdatum (vorbelegt mit heute), Leistungszeitraum (optional), Betrag, Rechnungssteller, Beschreibung, Kategorie, Verteilschlüssel, «Umlagefähig» angehakt. Die Kategorien erscheinen, sobald das Gebäude gewählt ist. (02-form.png)
3. **Ausfüllen.** Erwartet: problemlos. Gesehen: Datum 20.12.2024 akzeptiert, darunter «Freitag, 20. Dezember 2024». Betrag mit «CHF»-Präfix. Kategorie «Hauswart» gewählt. (03-filled.png: alle Felder lesbar, keine seitliche Scrollleiste.)
4. **«Rechnung speichern».** Erwartet: «Gespeichert», vielleicht ein Hinweis, dass 2024 schon abgerechnet ist. Gesehen: Ich lande auf der Detailseite «Hauswart Muster AG». Oben steht der Knopf «Rechnung bearbeiten», darunter ein gelber Kasten mit Warndreieck: «Abrechnungen nicht aktuell – Für die Abrechnungsperiode 01.01.2024 – 31.12.2024 gibt es schon Abrechnungen ohne diese Rechnung oder mit einem früheren Stand davon.» Danach kommt der lange Absatz (Entwürfe löschen und neu erstellen, versendete ausserhalb von Dwello berichtigen, Differenz erstatten, beraten lassen). Unten im Bild verdeckt die Erfolgsmeldung «Rechnung von Hauswart Muster AG gespeichert» zwei bis drei Zeilen des Kastens. (04-after-viewport.png, 04-after-full.png)
   Lesbarkeit: Schrift gross genug, Kontrast gut, die Überschrift sagt sofort «nicht aktuell». Ich muss aber zweimal scrollen. Einen Knopf «Abrechnungen 2024 ansehen» suche ich vergeblich.
5. **Wohin jetzt?** Erwartet: ein Link aus dem Hinweis. Gesehen: keiner. Ich tippe auf das Menü (06-menu.png) und dann auf «Nebenkostenabrechnungen».
6. **Abrechnungsliste.** Erwartet: Filter nach Jahr oder eine Markierung «nicht aktuell». Gesehen: 17 Abrechnungen auf 2 Seiten, Filter nur nach Status, Suche und Gebäude. 2025 steht oben, 2024 muss ich suchen. (08-statements.png)
7. **Gebäude «Seepark Residenz» filtern.** Gesehen: 7 Abrechnungen, davon 4 Entwürfe 2025 und 3 Abrechnungen 2024 (Bernasconi, Meier, Weber), alle «Bezahlt». In der Liste steht bei den 2024ern kein Hinweis «nicht aktuell». (09-statements-seepark.png) Jetzt merke ich: «Entwürfe löschen» trifft auf mich nicht zu. Die Entwürfe hier sind von 2025. Hätte ich den ersten Satz befolgt, hätte ich womöglich die falschen gelöscht.
8. **Abrechnung NK-22222222-2024-0001 (Thomas Weber) öffnen.** Erwartet: Sie sagt mir, dass sie veraltet ist. Gesehen: Status «Bezahlt», darunter der gelbe Kasten «Rechnungen seit der Abrechnung geändert – Seit dem Erstellen dieser Abrechnung wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht. Versendete Abrechnungen berichtigen Sie ausserhalb von Dwello …». In der Kostenaufstellung bei Hauswart stehen Q1 bis Q4 2024 (je CHF 750.00), meine CHF 250.00 fehlen erwartungsgemäss. (10-statement-2024-viewport.png, 10-statement-2024-full.png) Weiter führt der Weg nicht. Dwello sagt, ich soll ausserhalb berichtigen, nennt aber keine Differenz pro Mieter.
9. **Rechnungen 2024** (Kontrolle). Die Rechnungsliste hat einen Jahresfilter, die Abrechnungsliste nicht. (11-invoices-2024.png)

## Verwirrung

- «Löschen Sie die Entwürfe dieser Periode»: Welche Entwürfe? Bei mir gibt es für 2024 keine. Die einzigen Entwürfe in Seepark sind von 2025.
- «Versendete Abrechnungen»: Meine sind «Bezahlt», nicht «Versendet». Sind die mitgemeint? Ich nehme es an, sicher bin ich nicht.
- «Abrechnungen ohne diese Rechnung oder mit einem früheren Stand davon»: Bei einer neuen Rechnung ist «früherer Stand» verwirrend. Ich habe ja nichts geändert.
- «Ob Sie zusätzliche Kosten noch nachverlangen können, ist nicht in jedem Fall sicher: Lassen Sie sich im Zweifel beraten.» Von wem? Mietverband, Hauseigentümerverband, Anwalt? Und lohnen sich CHF 250 auf 4 Wohnungen (etwa CHF 60 pro Mieter) überhaupt? Hier lässt Dwello mich allein.
- «Schicken Sie dem Mieter eine berichtigte Abrechnung mit dem Beleg»: Wie erstelle ich die berichtigte Abrechnung, wenn Dwello sie nicht neu rechnet? Dwello zeigt mir den neuen Betrag pro Mieter nicht.
- Auf der Abrechnung: «1 Rechnung … erfasst, geändert oder gelöscht». Welche der drei Möglichkeiten?

## Fehlerrisiken

- Wer den ersten Satz befolgt, sucht Entwürfe zum Löschen und erwischt die Entwürfe 2025 desselben Gebäudes (gleiche Liste, gleicher Status-Filter «Entwurf»).
- Der Knopf «Zahlung zurücksetzen» steht direkt über dem Warnkasten der bezahlten Abrechnung. Wer «korrigieren» will, könnte ihn antippen.
- Wer die Rechnungsseite verlässt, bevor er den Kasten gelesen hat, findet den Hinweis nicht mehr: Die Übersicht zeigt nichts zu 2024, die Abrechnungsliste markiert nichts.
- Die Erfolgsmeldung verdeckt einen Teil des Hinweises. Beim schnellen Lesen auf dem Handy fehlt so der Satz zum Berichtigen.

## Vorschläge

- **P-1:** Übersicht > «Rechnung erfassen» > Seepark Residenz, 20.12.2024, CHF 250.00, Hauswart > «Rechnung speichern». Der Hinweis hat keinen Link. Hilfreich wäre ein Knopf im Hinweis, etwa «Abrechnungen 2024 ansehen», der die Abrechnungsliste schon auf Gebäude und Periode gefiltert öffnet. Dazu in der Liste eine Markierung «nicht aktuell» an den betroffenen Abrechnungen.
- **P-2:** Gleiche Schritte. Der Text sollte nur den Fall nennen, der vorliegt: «Für Seepark Residenz 2024 gibt es 3 Abrechnungen, alle schon versendet oder bezahlt. Berichtigen Sie sie ausserhalb von Dwello …». Den Satz zu den Entwürfen nur zeigen, wenn es Entwürfe gibt. Und klar sagen, dass «bezahlt» auch «versendet» heisst.
- **P-3:** Nach dem Speichern auf 390 px ganz oben bleiben: Die Erfolgsmeldung liegt über dem gelben Kasten. Hilfreich wäre, die Meldung bei sichtbarem Hinweis oben anzuzeigen, schneller auszublenden oder den Hinweis selbst als Bestätigung zu nehmen.
- **P-4:** Gleiche Schritte. Den Absatz in kurze Schritte oder Aufzählungspunkte teilen. Gebäude und Anzahl betroffener Abrechnungen nennen. Den Teil mit Rechtsrat einklappbar machen oder als eigenen kurzen Satz bringen.
- **P-5:** Nach dem Speichern: Menü > Nebenkostenabrechnungen > Gebäude «Seepark Residenz» > «Suchen» > «Thomas Weber NK-22222222-2024-0001». Hilfreich wäre die Rechnung namentlich mit Link und Betrag («Hauswart Muster AG, CHF 250.00, neu erfasst am 17.10.2026»). Noch besser wäre der Mehrbetrag für diesen Mieter, damit ich die berichtigte Abrechnung schreiben kann.
- **P-6:** Detailseite nach dem Speichern. Solange der Hinweis sichtbar ist, sollte der nächste Schritt (Abrechnungen ansehen) der Hauptknopf sein, und «Rechnung bearbeiten» zweitrangig.

## Nicht geprüft

- Den Fall mit Entwürfen in der Periode (Löschen und neu erstellen): Für Seepark 2024 gibt es keine Entwürfe, und ich sollte nichts löschen oder berichtigen.
- Was nach einer Neuberechnung herauskäme und wie der Verteilschlüssel «Keiner» die neue Rechnung verteilen würde: Dafür hätte ich Abrechnungen neu erstellen müssen.
- Ob die Erfolgsmeldung von selbst verschwindet und nach wie vielen Sekunden: Ich habe nur einmal gespeichert und direkt danach den Screenshot gemacht. Für einen zweiten Versuch hätte ich eine doppelte Rechnung anlegen müssen.
- Das PDF der Abrechnungen 2024: Ich habe es nicht geöffnet, es gehörte nicht zur Aufgabe.
- Den Dunkelmodus und andere Sprachen.
