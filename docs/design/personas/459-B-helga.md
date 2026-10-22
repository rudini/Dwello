# Helga – #459 Slice B: «Mieter anonymisieren»

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus, Deutsch. Lauf am 22.10.2026, 12:35–12:39 Uhr (nach rund 4 Minuten Wartezeit), Persona-App auf http://localhost:3300.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/helga-459B/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mieterseite, Abschnitt «Mieter anonymisieren» | Der Abschnitt sagt nur, *dass* ich darf (10 Jahre seit Ende 2015), aber nicht, *was* dabei passiert. Das erfahre ich erst im Bestätigungsfenster. Ausserdem: «Damals endete der letzte Mietvertrag **oder** ging die letzte Abrechnung …». Der Vertrag endete laut derselben Seite 2014, also weiss ich nicht, was 2015 war. |
| P-2 | Minor | Bestätigungsfenster «Sarah Meier anonymisieren?» | «Name, Kontaktdaten und Dokumente … werden endgültig entfernt. Die Beträge der Abrechnungen bleiben.» Hier steht nicht, dass der Mietvertrag bleibt, dass auch die gespeicherten Abrechnungs-PDFs (die verschickte Fassung) verschwinden, und auch kein Hinweis, vorher «Daten exportieren» zu nutzen, falls ich noch etwas brauche. Bei «Dokumente» denke ich an meine hochgeladene Ausweiskopie, nicht an die Abrechnung. |
| P-3 | Minor | Mieterseite nach dem Anonymisieren, Erfolgsmeldung | Die Meldung lautet «Mieter «Anonymisierter Mieter» anonymisiert». Ich wollte lesen, dass *Sarah Meier* anonymisiert wurde. So ist mir zuerst nicht klar, ob es die richtige Person war. |
| P-4 | Minor | Mieterseite nach dem Anonymisieren | Die Seite sieht aus wie ein unvollständig erfasster Mieter: «Keine E-Mail-Adresse erfasst», «Keine Telefonnummer erfasst», «Keine Adresse erfasst», daneben aber «Korrespondenzkanal: Per E-Mail». Dazu die Knöpfe «Bearbeiten», «Mietvertrag erfassen» (Hauptaktion) und «Daten exportieren». Nirgends steht «Dieser Mieter wurde am … anonymisiert». Ich hätte Angst, dass ich etwas vergessen habe, und würde vielleicht die Daten wieder eintragen. |
| P-5 | Minor | Abrechnung NK-22222222-2024-0002 nach dem Anonymisieren | Statt «PDF herunterladen» steht jetzt «PDF erstellen». Im Verlauf fehlt der Eintrag «PDF erstellt». Das neu erstellte PDF ist nicht mehr das verschickte: Der QR-Zahlteil fehlt, dafür steht «Bezahlt am 05.05.2025. Vielen Dank.», und das Abrechnungsdatum ist ein anderes. Die Seite erklärt nicht, warum das alte PDF weg ist. |

## Beobachtungen

- **Testdaten wirken widersprüchlich** (vermutlich vom Aufsetzen des Laufs): Der Vertrag von Sarah Meier endet am 30.06.2014. Trotzdem gibt es für sie eine bezahlte Abrechnung 2024 (Abrechnungsdatum und «Versendet» 01.03.2015, «Bezahlt» 05.05.2025, 366 Mietstage) und einen **Entwurf 2025** (NK-22222222-2025-0002, 01.01.–30.06.2025, 181 Mietstage). Dwello liess mich trotzdem anonymisieren. Der Entwurf 2025 bietet danach weiter «Als versendet markieren» und «PDF erstellen» an, für einen Mieter ohne Adresse. Mit echten Daten wäre ein offener Entwurf ein Grund, nicht zu anonymisieren, oder wenigstens ein Hinweis im Bestätigungsfenster. Ich habe den Entwurf nicht angefasst.
- **Mietvertrag** nach dem Anonymisieren: «Mietvertrag von Anonymisierter Mieter», Beträge und Daten sind unverändert. Das Banner «7 Abrechnungen fehlen» (2008–2014 abrechnen) steht weiterhin da, schon vor dem Anonymisieren. Für einen Mieter, der vor 12 Jahren ausgezogen ist, verwirrt mich das.
- **Mieterliste**: Der Eintrag heisst jetzt «Anonymisierter Mieter», «Keine laufende Miete», ohne Kontaktzeile. Mit mehreren anonymisierten Mietern hätte ich lauter gleiche Zeilen und könnte sie nicht unterscheiden. Ich hatte aber nur einen.
- Die Ausweiskopie ist auf der Mieterseite («Noch keine Dokumente.») und unter «Dokumente» verschwunden. Die Aufgabe «Hochgeladene Dokumente prüfen» ist weg. Unter «Dokumente» und auf der Übersicht steht nirgends mehr «Sarah».
- Das Bearbeiten-Formular des anonymisierten Mieters ist offen und hat leere Namensfelder. Ich könnte also wieder einen Namen eintragen.
- Mein erster Klick auf «Mieter anonymisieren», gleich nach dem Laden der Seite, tat nichts. Ein zweiter Versuch nach kurzem Warten öffnete das Fenster. Wahrscheinlich war die Seite noch nicht fertig geladen (Skript klickte sehr schnell). Ein echter Mensch merkt das kaum.
- Das Bestätigungsfenster selbst ist gut: Der Titel nennt Sarah Meier, «endgültig» steht drin, der rote Knopf heisst wie die Aktion, «Abbrechen» ist daneben. Die Schrift ist bei 150 % gut lesbar.

## Aufgabe geschafft: ja

Sarah Meier ist anonymisiert und gespeichert. Der Aufruf `POST /tenants/…006?/anonymise` gab 200 zurück, und Liste, Vertrag und Abrechnungen zeigen danach «Anonymisierter Mieter».

## Aufwand

Etwa 4 Minuten, rund 12 Schritte: Liste, Mieterseite, Vertrag ansehen, Abrechnungen suchen (Seite 2), PDF vorher, anonymisieren (2 Klicks), danach Liste, Vertrag, Abrechnung 2024, PDF neu erstellen und herunterladen, Entwurf 2025.

## Ablauf

1. **Mieterliste** (`/tenants`). Erwartet: Sarah finden. Gesehen: «Sarah Meier, Keine laufende Miete» unter zehn Mietern. Gut.
2. **Mieterseite Sarah Meier**. Erwartet: Ein Hinweis, ob ich ihre Daten löschen darf. Gesehen: der Abschnitt «Mieter anonymisieren»: «Seit dem Ende des Jahres 2015 sind 10 Jahre vergangen … Läuft noch eine Betreibung oder ein Verfahren, warten Sie damit.» und ein Umriss-Knopf. Daraus verstehe ich: Ich darf, sofern kein Verfahren läuft. Was dabei passiert, steht hier nicht (P-1). Darunter der Vertrag 01.08.2008–30.06.2014 und die gelbe Box «Hochgeladene Dokumente prüfen» mit der Ausweiskopie.
3. **Vorher angeschaut**: Vertrag (Name, E-Mail, Telefon von Sarah) und Abrechnung 2024 (Status «Bezahlt», PDF mit Adresse Hirschmattstrasse 21 und QR-Zahlteil «Zahlbar durch Sarah Meier»). Die Abrechnung 2024 musste ich auf Seite 2 der Abrechnungsliste suchen.
4. **Klick «Mieter anonymisieren»**. Erwartet: eine Rückfrage. Gesehen: das Fenster «Sarah Meier anonymisieren?» mit dem Text aus P-2, «Abbrechen» und einem roten «Mieter anonymisieren». Ich weiss jetzt: Name, Kontakt und Dokumente sind weg, die Beträge bleiben. Zum Vertrag und zu den PDFs steht nichts.
5. **Bestätigt**. Erwartet: eine Meldung «Sarah Meier wurde anonymisiert» und eine Seite, die das zeigt. Gesehen: Titel «Anonymisierter Mieter», grüne Meldung «Mieter «Anonymisierter Mieter» anonymisiert» (P-3), Kontaktdaten «Keine … erfasst», Korrespondenzkanal weiter «Per E-Mail», «Noch keine Dokumente.». Der Abschnitt «Mieter anonymisieren» ist verschwunden (P-4).
6. **Mieterliste**: «Anonymisierter Mieter, Keine laufende Miete». Das passt.
7. **Vertrag**: «Mietvertrag von Anonymisierter Mieter», «Keine E-Mail-Adresse erfasst», Beträge gleich. Wie erwartet, nur das alte Banner «7 Abrechnungen fehlen» stört.
8. **Abrechnung 2024**: Mieter «Anonymisierter Mieter», Beträge gleich, aber «PDF erstellen» statt «PDF herunterladen» (P-5). Nach «PDF erstellen» konnte ich das PDF herunterladen: Empfänger nur «Anonymisierter Mieter» ohne Adresse, alle Beträge gleich (Nachzahlung CHF 121.05), kein QR-Zahlteil mehr, dafür «Bezahlt am 05.05.2025. Vielen Dank.». Kein «Meier» und keine «Hirschmattstrasse» mehr im PDF.
9. **Entwurf 2025**: ebenfalls «Anonymisierter Mieter», weiter «Als versendet markieren» (siehe Beobachtungen).

## Verwirrung

- «anonymisieren»: Ich kenne das Wort, aber erst das Fenster erklärt es. Ein Satz direkt im Abschnitt («Dwello entfernt Name, Kontaktdaten und Dokumente; Verträge und Beträge bleiben») hätte mir die Angst genommen.
- «Ende des Jahres 2015 … endete der letzte Mietvertrag oder ging die letzte Abrechnung»: Welches von beidem? Der Vertrag endete ja 2014.
- «Dokumente»: Gehören die Abrechnungs-PDFs dazu? Offenbar ja, denn sie mussten neu erstellt werden.
- «Anonymisierter Mieter» in der Erfolgsmeldung statt des Namens.

## Fehlerrisiken

- Nach dem Anonymisieren lädt die Seite mit «Bearbeiten» und «Mietvertrag erfassen» dazu ein, den Mieter wieder zu befüllen oder weiterzuverwenden (P-4).
- Wer vor dem Anonymisieren nicht exportiert, verliert die verschickte PDF-Fassung, ohne dass das angekündigt wurde (P-2, P-5).
- Ein offener Entwurf (hier 2025) bleibt versendbar, obwohl der Mieter keine Adresse mehr hat (Beobachtungen).

## Vorschläge

- **P-1**: Mieter mit abgelaufener Frist öffnen. Im Abschnitt einen Satz ergänzen, was entfernt wird und was bleibt, und den Grund eindeutig nennen (z. B. «Die letzte Abrechnung ging 2015 an Sarah Meier»).
- **P-2**: «Mieter anonymisieren» klicken. Im Fenster ergänzen: «Mietverträge und Abrechnungen bleiben ohne Namen erhalten; gespeicherte PDFs werden gelöscht. Brauchen Sie die Daten noch, exportieren Sie sie vorher.»
- **P-3**: Anonymisieren bestätigen. Die Meldung sollte den alten Namen nennen: «Sarah Meier ist anonymisiert.»
- **P-4**: Anonymisierte Mieterseite öffnen. Oben einen Hinweis zeigen («Am 22.10.2026 anonymisiert»), «Keine … erfasst» und «Per E-Mail» ersetzen oder ausblenden, und «Mietvertrag erfassen» nicht mehr als Hauptaktion zeigen.
- **P-5**: Abrechnung 2024 des anonymisierten Mieters öffnen. Kurz erklären, dass das PDF beim Anonymisieren gelöscht wurde und ein neues ohne Namen erstellt wird.

## Nicht geprüft

- 200 % Zoom und der Dunkelmodus: nicht verlangt, aus Zeitgründen weggelassen.
- Der Fall «Frist noch nicht abgelaufen»: Ob der Abschnitt dann fehlt oder etwas anderes sagt, konnte ich nicht sehen. Ich hatte nur Sarah, und andere Mieter habe ich nicht angefasst.
- Den Datenexport nach dem Anonymisieren habe ich nicht heruntergeladen.
- Den Entwurf 2025 habe ich nicht verändert und kein PDF davon erstellt.
