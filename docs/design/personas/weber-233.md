# Persona-Lauf: Dr. Weber, Runde 233

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus.
Aufgabe: die neuen Texte zu Belegen, Upload-Hinweisen, abgerechneten Rechnungen und KI im Datenschutz auf Richtigkeit und Plausibilität prüfen. Nur angesehen; gespeichert, gelöscht oder bestätigt habe ich nichts (das Hochladen habe ich mit «Abbrechen und verwerfen» verworfen).
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/weber-233/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Rechnungen hochladen, Hinweis «Werke Schlussrechnung 2025.pdf» | Der Hinweis schlägt das Total vor dem Abzug der Akontozahlungen vor (CHF 1’250.00) und warnt nur davor, die Akontozahlungen *künftig* als eigene Rechnungen zu erfassen. Der häufige Fall fehlt: Die Akontorechnungen des Werks wurden im Jahr schon erfasst. Dann zählt das vorgeschlagene Total die CHF 1’000.00 doppelt. Der Hinweis sagt nicht, dass man dann nur den Restbetrag einträgt oder die Akontorechnungen löscht. |
| P-2 | Minor | Rechnungen hochladen, Hinweis «Werke Schlussrechnung 2025.pdf» | «Akontozahlungen» ist in Dwello auch der Begriff für die Vorauszahlungen der Mieter. Hier sind die Zahlungen des Vermieters an das Werk gemeint. Ein Vermieter könnte meinen, er dürfe die Akontozahlungen der Mieter nicht erfassen. |
| P-3 | Minor | Rechnungen hochladen, Zeile «Lift Service und Reparatur.pdf» | Nachdem ich die Kategorie «Reparaturen» gewählt habe, steht der Hinweis unverändert da: «Tragen Sie hier nur den umlagefähigen Betrag ein und erfassen Sie den Rest danach … in der Kategorie Reparaturen». Gleich darunter steht jetzt aber «Nicht umlagefähige Kategorie». Beides zusammen widerspricht sich. Ausserdem bekommt die Rest-Rechnung aus «Rechnung erfassen» keinen Beleg, und der Hinweis sagt nicht, dass man die Datei dort mit «Beleg hinzufügen» anfügen soll. Beim Sammelscan steht das. |
| P-4 | Minor | Rechnungen hochladen, Zeile «Werke Gutschrift 2025.pdf» | Der Hinweis sagt «Erstellen Sie daraus keine Rechnung». In derselben Box stehen aber «Wählen Sie eine Kategorie.», «Prüfen Sie: Rechnungsdatum.» und «Ergänzen Sie …: Fälligkeitsdatum.». Das sind Aufträge für eine Rechnung, die man nicht erstellen soll. Die Gutschrift wird ausserdem nirgends als Beleg gespeichert, obwohl sie für die Belegeinsicht zur Rechnung gehört. Der Text sagt nur, man solle sie auf Papier aufbewahren. |
| P-5 | Minor | Rechnung löschen (Bestätigung) und Rechnung bearbeiten (Warnung) | «Rechnung schon abgerechnet» sagt nicht, in welchem Zustand die Abrechnungen sind. Bei «ewl … Fernwärme Q4 2025» sind alle vier Abrechnungen der Seepark Residenz 2025 Entwürfe (in der Abrechnungsliste geprüft). Der Text spricht trotzdem von versendeten oder bezahlten Abrechnungen, die man ausserhalb von Dwello berichtigen müsse. Ich kann nicht erkennen, ob mich das betrifft. |
| P-6 | Minor | Rechnung löschen und Rechnung bearbeiten | Die Anleitung für versendete oder bezahlte Abrechnungen nennt nur einen Fall: zu viel Bezahltes zurückzahlen. Wird die Rechnung nach oben korrigiert, entsteht eine Nachforderung. Ob und wie man sie beim Mieter geltend macht, sagt der Text nicht. |
| P-7 | Minor | Datenschutz, «Weitergabe an Dritte» | «Die KI läuft auf dem Server des Betreibers; die Daten verlassen dafür den Server nicht.» ist als Tatsache formuliert. Als Nutzerin kann ich das nicht prüfen. Stimmen kann es nur, wenn der Betreiber die KI wirklich lokal betreibt. Hängt das von der Einrichtung ab, ist die Zusage im Datenschutztext zu absolut. |
| P-8 | Nit | Rechnungen hochladen, Zeile «Lift Service und Reparatur.pdf» | «z.B. Reparaturen» im Hinweis, «z. B. Reparaturen, Gebäudeversicherung» im Text zur Kategorie direkt darunter. Die Schreibweise ist uneinheitlich. |

## Beobachtungen

- Die Rechnungsseite von «ewl Energie Wasser Luzern, Fernwärme Q4 2025» zeigt nicht, dass die Rechnung schon abgerechnet ist. Das erfahre ich erst unter «Rechnung bearbeiten» oder beim Löschen.
- Beim Hochladen ist «Diese Rechnung erstellen» bei der Schlussrechnung angekreuzt, bei der Lift-Rechnung nicht. Warum, steht nirgends.
- Die Fussleiste zeigt «0 Rechnungen erstellen (1 unvollständig)». Welche Rechnung unvollständig ist, muss ich selbst suchen (es ist die Schlussrechnung, ihr fehlt die Kategorie).
- Im Upload ist die Kategorie Pflicht, unter «Rechnung bearbeiten» heisst sie «Kategorie (optional)».
- Die Werte der KI-Vertretung (Rechnungsdatum 31.03.2026, Leistungszeitraum Q1 2026, Beschreibung «Allgemeinstrom Q1» für eine «Schlussrechnung 2025», Rechnungsnummer R-1001 bei allen Dateien) sind feste Antworten der Testumgebung, keine Befunde.
- Die Hilfe zum Leistungszeitraum nennt als Beispiel 01.10.2024 bis 31.12.2024, das Feldformat 31.12.2026. Die Jahre springen.
- Im Datenschutz heisst es «Verwaltung der Liegenschaften», in der App sonst «Gebäude».

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten, 8 Durchgänge im Browser: Upload mit 4 Dateien, Details aufgeklappt, Kategorie gewechselt, Abbrechen und verwerfen, Rechnungsseite, Lösch-Bestätigung geöffnet und abgebrochen, Bearbeiten-Seite, Abrechnungsliste zum Gegenprüfen, Datenschutz.

## Ablauf

1. **Rechnungen → «Rechnungen hochladen».**
   - Erwartet: Ich erfahre, was mit meinen Dateien geschieht.
   - Gesehen: «Dwello speichert die Datei jeder erstellten Rechnung als Beleg. Dateien, aus denen Sie keine Rechnung erstellen, speichert Dwello nicht. Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.»
   - Bewertung: Klar und rechtlich richtig. Der Mieter hat nach Art. 257b Abs. 2 OR ein Recht auf Einsicht in die Belege. Der Text passt zur Abbruchfrage («Hochgeladene Dateien und Ihre Eingaben gehen verloren.») und zum Datenschutz.
2. **Gebäude «Musterhaus Zentrum», vier Dateien gewählt.** Ergebnis: «4 von 4 Dateien gelesen. Bitte prüfen: 4.» (Screenshot `04-upload-gelesen.png`: vier Zeilen mit gelber Hinweisbox).
   - **Schlussrechnung:** «Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Vorgeschlagen ist das Total der Leistungen vor dem Abzug …» Vorgeschlagen sind CHF 1’250.00. Dass in die Abrechnung das Total gehört, ist richtig. Es fehlt aber der Fall, dass die Akontorechnungen schon erfasst sind (P-1), und der Begriff ist doppeldeutig (P-2).
   - **Lift:** Der Hinweis zu gemischten Kosten ist an sich gut. Ein Lift-Abonnement ist umlagefähig, eine Reparatur nicht.
   - **Gutschrift:** «Das ist eine Gutschrift. Erstellen Sie daraus keine Rechnung. Verringern Sie den Betrag der Rechnung …» Das ist sachlich richtig, aber die übrigen Aufträge in der Box widersprechen ihm (P-4).
   - **Sammelscan:** «Diese Datei enthält mehrere Rechnungen …» Der Weg über «Beleg hinzufügen» ist plausibel. Das Ankreuzfeld ist folgerichtig gesperrt.
3. **Lift: Kategorie «Reparaturen» gewählt.**
   - Erwartet: Der Hinweis passt sich an.
   - Gesehen: «Wählen Sie eine Kategorie.» verschwindet. «Umlagefähig» wird gesperrt und abgehakt, mit «Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein.» und «Nicht umlagefähige Kategorie – Kosten dieser Kategorie (z. B. Reparaturen, Gebäudeversicherung) können nicht auf Mieter umgelegt werden.» Das ist richtig.
   - Der gelbe Hinweis bleibt aber unverändert und widerspricht jetzt (P-3). «Diese Rechnung erstellen» bleibt nicht angekreuzt.
4. **«Abbrechen».** Es erscheint «Hochladen abbrechen?» mit «Hochgeladene Dateien und Ihre Eingaben gehen verloren.». Mit «Abbrechen und verwerfen» bestätigt; danach ist kein Dialog mehr offen. Das ist konsistent.
5. **Rechnung «ewl … Fernwärme Q4 2025».**
   - Abschnitt «Beleg»: «Zu dieser Rechnung ist kein Beleg gespeichert. Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» Darunter folgen die Dateiwahl und «Beleg hinzufügen». Das ist verständlich.
   - Erwartet hatte ich einen Hinweis «abgerechnet» schon hier, er fehlt (Beobachtung).
6. **«Rechnung löschen» geöffnet.**
   - Gesehen: «Die Rechnung von ewl Energie Wasser Luzern über CHF 1’410.00 wird gelöscht. Sie fliesst dann in keine neue Nebenkostenabrechnung mehr ein. Das lässt sich nicht rückgängig machen.» Danach folgt «Rechnung schon abgerechnet» mit dem Vorgehen für Entwürfe und für versendete oder bezahlte Abrechnungen sowie der Hinweis auf die Einsicht.
   - Die Folgen sind konkret und mit Betrag genannt, das ist gut. Es fehlt aber der Zustand der betroffenen Abrechnungen (P-5), und die Anleitung deckt nur einen Fall ab (P-6).
   - Mit «Abbrechen» geschlossen.
7. **«Rechnung bearbeiten».** «Bestehende Abrechnungen ändern sich dadurch nicht.» und die Warnung, dass die Abrechnungen dann nicht mehr stimmen. Inhaltlich gleich wie beim Löschen und schlüssig, mit denselben Lücken (P-5, P-6). Nicht gespeichert; «Änderungen speichern» war ohnehin gesperrt.
8. **Datenschutz.** Unter «Weitergabe an Dritte» steht, dass die KI Rechnungen kategorisiert, Dateien ausliest und neue Kategorien prüft und dass die Daten den Server nicht verlassen (P-7). Unter «Welche Daten Dwello speichert» steht, dass Belege mit allem Inhalt gespeichert bleiben, bis der Beleg ersetzt oder die Rechnung gelöscht wird. Das passt zur Upload-Einleitung.

## Verwirrung

- «Akontozahlungen» (Schlussrechnung): die des Mieters oder meine an das Werk?
- «hier in ihrer Zeile» (Gutschrift): Gemeint ist die Zeile der zugehörigen Rechnung in diesem Upload. Das geht nur, wenn sie im selben Upload liegt. Ich musste es zweimal lesen.
- «Rechnung schon abgerechnet»: welche Abrechnungen, und sind sie schon beim Mieter?
- Wird beim Löschen ein gespeicherter Beleg mitgelöscht? Der Datenschutz sagt ja, die Lösch-Bestätigung sagt es nicht. Hier war kein Beleg vorhanden.

## Fehlerrisiken

- Doppelt verrechnete Werkkosten, wenn die Akontorechnungen schon erfasst sind und man das vorgeschlagene Total übernimmt (P-1). Das trifft direkt die Mieter.
- Lift-Rechnung: Wer nur auf «Reparaturen» umstellt und den vollen Betrag stehen lässt, rechnet den umlagefähigen Service-Anteil nicht ab. Der unveränderte Hinweis lenkt dabei eher ab (P-3).
- Unvollständige Belegeinsicht, weil Gutschrift und Rest-Rechnung keinen Beleg in Dwello haben (P-3, P-4).

## Vorschläge

- **P-1:** Reproduktion: Rechnungen → «Rechnungen hochladen» → Musterhaus Zentrum → «Werke Schlussrechnung 2025.pdf». Hilfreich wäre ein Satz wie: «Haben Sie die Akontorechnungen des Werks schon als Rechnungen erfasst, tragen Sie hier nur den Restbetrag ein.»
- **P-2:** Gleiche Schritte. Statt «Akontozahlungen» besser «Ihre Akontozahlungen an den Rechnungssteller» oder «Akontorechnungen des Werks».
- **P-3:** Gleiche Schritte, «Lift Service und Reparatur.pdf» → «Angaben prüfen» → Kategorie «Reparaturen». Der Hinweis sollte sich nach der Wahl anpassen, zum Beispiel: «Tragen Sie hier nur den Reparaturanteil ein und erfassen Sie den umlagefähigen Rest mit «Rechnung erfassen».» Zusätzlich: «… und fügen Sie diese Datei dort mit «Beleg hinzufügen» an.»
- **P-4:** Gleiche Schritte, «Werke Gutschrift 2025.pdf». In dieser Zeile Kategorie, Datum und Fälligkeit nicht verlangen. Vorschlagen, die Gutschrift als zweiten Beleg an die Rechnung anzufügen, oder ausdrücklich sagen, dass Dwello sie nicht speichert.
- **P-5:** Rechnungen → «ewl Energie Wasser Luzern, Fernwärme Q4 2025» → «Rechnung löschen» oder «Rechnung bearbeiten». Den Zustand nennen («4 Entwürfe, keine versendet») und nur den Teil der Anleitung zeigen, der zutrifft.
- **P-6:** Gleiche Schritte. Auch die Nachforderung erwähnen: «Ist die Korrektur zu Ihren Gunsten, teilen Sie dem Mieter die Nachforderung mit Begründung mit.»
- **P-7:** Datenschutz öffnen. Die Aussage an die Einrichtung knüpfen, zum Beispiel: «In dieser Installation läuft die KI auf dem Server des Betreibers». Sonst den Anbieter nennen, wenn eine externe KI eingerichtet ist.
- **P-8:** «z. B.» einheitlich mit schmalem Leerschlag schreiben.

## Nicht geprüft

- Ob die KI-Daten wirklich auf dem Server bleiben: Das kann ich als Nutzerin nicht sehen, der Browser ruft die KI nicht selbst auf.
- Die Lösch-Bestätigung einer Rechnung, *mit* gespeichertem Beleg: Die geprüfte Rechnung hatte keinen, eine andere habe ich nicht gesucht.
- Den Fall mit versendeten oder bezahlten Abrechnungen: Zur geprüften Rechnung gibt es nur Entwürfe.
- Alles, was Speichern verlangt hätte (Rechnungen erstellen, Beleg hinzufügen, Gutschrift in eine Rechnung einrechnen): Laut Auftrag nur ansehen.
