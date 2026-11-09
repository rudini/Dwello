# Dr. Weber, Runde 1309: Verteilschlüssel lässt sich nicht berechnen

Desktop 1440 × 900, Maus, Persona-App auf :3300 (Demodaten). Ich habe nichts gespeichert. «Neu berechnen» am Entwurf habe ich wie verlangt ausgelöst; Dwello hat es abgelehnt. Die Dialoge «Per E-Mail senden» und «Abrechnung berichtigen» habe ich nur geöffnet und mit «Abbrechen» geschlossen. Im Assistenten bin ich bis zur Vorschau gegangen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritt 4 «Vorschau», Kostenabstimmung | Die Vorschau sagt nichts über den Verteilschlüssel, der sich nicht berechnen lässt. Stattdessen zeigt die Kostenabstimmung «Gartenpflege (Halbe Zimmer)» CHF 540.00, davon Mieter CHF 0.00, davon tragen Sie CHF 540.00, und «Gartenpflege (Pro Fläche (m²))» CHF 395.00, davon Mieter CHF 707.19, davon tragen Sie **CHF -312.19**. Ein negativer Vermieteranteil ohne Erklärung. Ich lese daraus entweder «ich trage 540 Franken» oder «die Mieter haben zu viel bezahlt». Beides stimmt so nicht. Bei den drei Entwürfen steht nur «Rechnungen … erfasst, geändert oder gelöscht», nicht die eigentliche Ursache. Die versendete Abrechnung von Hans Müller kommt in der Liste gar nicht vor. |
| P-2 | Major | Abrechnung NK-11111111-2025-0001 (Hans Müller, versendet/überfällig), Hinweis «Verteilschlüssel lässt sich nicht berechnen» | Der Hinweis sagt «Wählen Sie bei diesen Rechnungen den Verteilschlüssel …», nennt aber keine Rechnung. In den Abrechnungspositionen steht überall «Pro Fläche» bzw. «Pro Einheit», also der Stand beim Versand. «Halbe Zimmer» kommt auf der Seite nirgends vor. Welche Rechnung betroffen ist (Gartenbau Huber, 14.05.2025, CHF 540.00), habe ich erst aus der Fehlermeldung von «Neu berechnen» am Entwurf von Anna Schmidt erfahren. Wer nur eine versendete Abrechnung hat, findet die Rechnung von hier aus nicht. Ob die versendete Abrechnung selbst richtig ist, sagt die Seite auch nicht. |
| P-3 | Major | Abrechnung NK-11111111-2025-0002 (Anna Schmidt, Entwurf), «Per E-Mail senden» | Dwello sagt selbst, der Entwurf sei nicht aktuell und lasse sich nicht neu berechnen. Trotzdem ist «Per E-Mail senden» oben als Hauptaktion da. Im Dialog steht zwar «Dieser Entwurf ist nicht aktuell … Berechnen Sie ihn neu, bevor Sie ihn zustellen», der Knopf «Per E-Mail senden» bleibt aber aktiv (nicht disabled). Ich habe ihn nicht gedrückt. Danach sieht es aus, als könne ich einen Entwurf zustellen, von dem Dwello selbst sagt, dass er nicht stimmt. |
| P-4 | Minor | Entwurf Anna Schmidt, Dialog «Entwurf neu berechnen» | Der Bestätigungsdialog sagt «Beträge, Positionen und Saldo ändern sich» und warnt nur vor «Verschiedene Verteilschlüssel in einer Kategorie». Dass die Neuberechnung an «Halbe Zimmer» scheitern wird, sagt er nicht. Erst nach dem Bestätigen kommt «Das hat nicht geklappt». Den Dialog bestätige ich also umsonst. |
| P-5 | Minor | Entwurf Anna Schmidt (Wohnung 1.02), Hinweis | «Die Formel von «Halbe Zimmer» teilt für die Wohnung 1.01 … durch null.» Auf der Abrechnung der Wohnung 1.02 habe ich zuerst an eine Verwechslung der Wohnung gedacht. Dass der Schlüssel für das ganze Gebäude gerechnet wird und deshalb eine fremde Wohnung alle Abrechnungen blockiert, steht nicht da. |
| P-6 | Minor | Abrechnung Hans Müller, Hinweis; Übersicht, «Nächster Schritt» | «Ändert die Neuberechnung danach den Saldo oder eine Position, berichtigen Sie …». Auf derselben Seite steht aber «Dwello kann die Abrechnung deshalb nicht neu berechnen», und der Assistent sagt «Versendete Abrechnungen lassen sich nicht neu berechnen». Welche Neuberechnung gemeint ist und wer sie auslöst, verstehe ich nicht. Gemeint ist wohl, dass Dwello später von selbst rechnet und «hier darauf hinweist». In der Übersicht steht als Überschrift des nächsten Schritts «Abrechnung berichtigen», bevor feststeht, dass überhaupt berichtigt werden muss. Das kann zu einer unnötigen Berichtigung führen. |

## Beobachtungen

- Die Fehlermeldung von «Neu berechnen» ist gut: Sie nennt Schlüssel, Gebäude, Wohnung, Ursache (Division durch null) und die betroffene Rechnung mit Lieferant, Datum und Betrag. Dazu kommen die zwei Wege (vereinbarten Schlüssel wählen oder Formel korrigieren) und die Warnung, dass eine Formeländerung für alle Gebäude gilt. So sollte der Hinweis auf beiden Abrechnungsseiten auch aussehen.
- Die Rechnungsnummer im Fehlertext ist kein Link. Ich habe die Rechnung über die Positionsliste gefunden («Gartenpflege Frühjahr 2025»).
- Der Fehlertext steht unter dem gelben Hinweis, die Seite springt nicht dorthin. Auf 1440 × 900 war er gerade noch sichtbar.
- Auf der Rechnung «Gartenbau Huber» (Verteilschlüssel «Halbe Zimmer», zuletzt geändert 08.11.2026, 22:05) steht nur «Abrechnungen nicht aktuell … Berechnen Sie die Entwürfe … neu». Dass genau diese Rechnung die Neuberechnung blockiert, steht dort nicht. Wer von der Rechnung aus kommt, versucht «Neu berechnen» und scheitert wieder.
- Unter «Einstellungen» › «Verteilschlüssel» steht bei «Halbe Zimmer» «1 Rechnung», ohne Link zu dieser Rechnung. Die Formel `1 / (({rooms} - 3.5) * ({rooms} - 3.5))` erklärt die Division durch null bei 3.5 Zimmern. «Formel testen» zeigt mit den vier Beispielwohnungen (2 bis 5 Zimmer) unauffällige Anteile (5 %, 45 %, 45 %, 5 %). Der Hinweis warnt zu Recht, dass der Test nur mit Beispielwohnungen rechnet.
- Der Hinweis auf dem Entwurf ist ein einziger langer Absatz mit zwei Ursachen (Schlüssel und geänderte Rechnung). «einiger Rechnungen», obwohl es nur eine ist.
- Hans Müllers Abrechnung ist überfällig. «Mahnung senden» ist weiter oben angeboten, obwohl der Hinweis die Richtigkeit der Abrechnung offen lässt. Ob ich mahnen darf, sagt Dwello nicht.
- Rechtlich: Der Hinweis auf Art. 128 Ziff. 1 OR (fünf Jahre, Beginn nicht einheitlich geklärt, «Lassen Sie sich im Zweifel beraten») ist vorsichtig formuliert und für mich plausibel. Ebenso Art. 257a Abs. 1 OR bei der Gartenpflege. Der Dialog «Abrechnung berichtigen» erklärt die Folgen klar (die bisherige Abrechnung bleibt erhalten und wird nicht mehr gemahnt, Feld «Bereits bezahlt», «Das lässt sich nicht rückgängig machen»).
- Im Assistenten ist im Schritt 3 «Heizung + Warmwasser» vorgewählt, die bestehenden Abrechnungen 2025 nennen aber «Heizung Mittelland». Mit «Weiter» ab der Vorschau bleibe ich auf derselben Seite, mit «Wählen Sie eine andere Abrechnungsperiode oder andere Gebäude». Das ist für 0 Abrechnungen verständlich.
- In der Übersicht ist die Kachel «3 Entwürfe sind nicht aktuell» mit dem Zusatz zum Verteilschlüssel verständlich.

## Aufgabe geschafft: teilweise

Was falsch ist und was ich am Entwurf tun muss, habe ich herausgefunden, aber erst über die Fehlermeldung von «Neu berechnen». Ob die versendete Abrechnung von Hans Müller richtig ist, beantwortet Dwello nicht. Die Vorschau im Assistenten hat mich mit einem negativen Vermieteranteil eher verunsichert als informiert.

## Aufwand

Etwa 25 Minuten, 14 Durchgänge (Übersicht, Liste, zwei Abrechnungen, Neu berechnen, zwei Dialoge, Rechnung, Verteilschlüssel samt «Formel testen», Assistent Schritt 1 bis 4).

## Ablauf

- Abrechnung Hans Müller: Ich erwartete, dass der Hinweis die betroffene Rechnung nennt. Ich sah «einiger Rechnungen» ohne Namen, und in den Positionen kommt «Halbe Zimmer» nicht vor.
- Entwurf Anna Schmidt, «Neu berechnen»: Ich erwartete, dass der Dialog warnt, dass es nicht gehen wird. Ich sah «Beträge … ändern sich», nach dem Bestätigen dann «Das hat nicht geklappt» mit der Rechnung Gartenbau Huber, 14.05.2025, CHF 540.00.
- Entwurf Anna Schmidt, «Per E-Mail senden»: Ich erwartete einen gesperrten Versand. Ich sah eine Warnung, der Knopf «Per E-Mail senden» war aber aktiv.
- Hinweis auf dem Entwurf von Wohnung 1.02: Ich erwartete eine Angabe zu Wohnung 1.02. Ich sah «Wohnung 1.01».
- Assistent, Vorschau: Ich erwartete denselben Hinweis zum Verteilschlüssel wie auf den Abrechnungen. Ich sah keinen, dafür «davon tragen Sie CHF -312.19» und CHF 540.00 «Halbe Zimmer» ganz beim Vermieter. Die versendete Abrechnung fehlt in der Liste.

## Vorschläge

- **P-1:** Abrechnungen erstellen → Periode 2025 → «Musterhaus Zentrum» → Weiter → Vorschau. Hilfreich wäre, wenn die Vorschau denselben Hinweis zeigt wie die Abrechnungen («Halbe Zimmer» lässt sich für Wohnung 1.01 nicht berechnen, betroffen ist Rechnung Gartenbau Huber …). Eine Kostenabstimmung mit einem Schlüssel, der sich nicht berechnen lässt, sollte keine Zahlen zeigen, oder sie klar als «nicht berechenbar» kennzeichnen. Einen negativen Vermieteranteil müsste Dwello erklären (Abrechnungen mit früherem Rechnungsstand). Die versendete Abrechnung sollte bei «Abrechnungen pro Mietvertrag» auch erscheinen, mit Verweis auf «Abrechnung berichtigen».
- **P-2:** Abrechnungen → Hans Müller NK-11111111-2025-0001. Der Hinweis sollte die betroffenen Rechnungen wie die Fehlermeldung nennen, als Link zur Rechnung, und den heutigen Schlüssel jeder Rechnung dem Schlüssel beim Versand gegenüberstellen. Ein Satz dazu, ob die versendeten Beträge auf dem damaligen Stand weiter gelten, würde die Frage «stimmt die Abrechnung?» beantworten.
- **P-3:** Entwurf Anna Schmidt → «Per E-Mail senden». Solange sich der Entwurf nicht berechnen lässt, sollte der Versand gesperrt sein (Knopf deaktiviert, mit Begründung). Alternativ müsste ich ausdrücklich bestätigen, dass ich den veralteten Stand zustelle.
- **P-4:** Entwurf Anna Schmidt → «Neu berechnen». Hilfreich wäre, wenn der Dialog die bekannte Ursache schon nennt und «Neu berechnen» dort nicht als machbare Aktion anbietet.
- **P-5:** Entwurf Anna Schmidt, Hinweis. Ein Satz wie «Der Schlüssel wird für alle Wohnungen des Gebäudes gerechnet; scheitert er an einer Wohnung, lässt sich keine Abrechnung des Gebäudes berechnen» würde helfen.
- **P-6:** Abrechnung Hans Müller und Übersicht. Hilfreich wäre, wenn Dwello sagt, wer rechnet und wann («Sobald der Verteilschlüssel berechnet werden kann, zeigt Dwello hier, ob sich Saldo oder Positionen ändern»). In der Übersicht passt als Überschrift eher «Verteilschlüssel prüfen» statt «Abrechnung berichtigen».

## Nicht geprüft

- Den Versand des veralteten Entwurfs habe ich nicht ausgelöst, weil ich nicht speichern durfte. Ob das Backend ihn ablehnen würde, weiss ich deshalb nicht. Ich habe nur gesehen, dass der Knopf aktiv ist.
- «Abrechnung berichtigen» habe ich nicht bestätigt, weil das nicht rückgängig zu machen ist und nicht gespeichert werden sollte. Ob die berichtigte Abrechnung mit dem kaputten Schlüssel überhaupt erstellt werden kann, bleibt offen.
- Den Verteilschlüssel der Rechnung und die Formel von «Halbe Zimmer» habe ich nicht geändert, weil das gespeichert hätte. Was der Hinweis nach der Korrektur zeigt, habe ich deshalb nicht gesehen.
- Das PDF der beiden Abrechnungen habe ich nicht geöffnet. Die Aufgabe nannte nur die Seiten und den Assistenten.

Screenshots und Skripte: /tmp/claude-0/-home-user-Dwello/572ae737-1651-512e-ac2c-478fec66fac3/scratchpad/weber-1309/ (u. a. 03-mueller.png, 04-schmidt.png, 05-neu-berechnen.png, 06-nach-neu-berechnen.png, 07-senden-dialog.png, 08-berichtigen-dialog.png, 17-wizard-4.png).
