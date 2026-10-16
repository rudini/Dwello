# Dr. Weber: Rechnungen hochladen (KI-Auslesen, Beleg, Datenschutz)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus. App: Persona-Stack auf http://localhost:3300 (Demodaten, Version 0.4.12+9-g3e3f99c). Nur angesehen, nichts gespeichert; der Upload-Dialog wurde mit «Abbrechen und verwerfen» verlassen, die Löschbestätigung mit Escape geschlossen.

Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/weber-rechnungen-hochladen/`

Hinweis: Die KI-Antworten kommen im Persona-Stack von einem Platzhalter mit festen Antworten, nicht von einem Modell. Was die KI *vorschlägt* (Rechnungssteller = Dateiname, gleiche Werte bei beiden Dateien), bewerte ich deshalb nicht; bewertet sind die Texte, mit denen Dwello mir diese Vorschläge vorlegt.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Upload-Dialog, Datei «Werke Schlussrechnung 2025.pdf» | Der Hinweis «Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Erfassen Sie den Betrag so, dass jede Leistung nur einmal zählt.» sagt nicht, ob der vorgeschlagene Betrag (CHF 1250.00) vor oder nach Abzug der Akontozahlungen ist und welchen Betrag ich eintragen soll. «So, dass jede Leistung nur einmal zählt» setzt voraus, dass ich weiss, ob die Akontorechnungen schon in Dwello erfasst sind. |
| P-2 | Major | Upload-Dialog, Datei «Lift Service und Reparatur.pdf» | Hinweis: «Die Rechnung enthält Kosten, die nicht umlagefähig sind (z.B. Reparaturen). Erfassen Sie diese als eigene Rechnung.» Gleichzeitig ist «Umlagefähig» angehakt und der Betrag ist offenbar der Gesamtbetrag. Es steht nicht da, dass ich den Betrag hier um die Reparatur kürzen muss, welcher Teil das ist, noch wo und wie ich die «eigene Rechnung» erfasse (im Dialog geht das nicht). Wer nur den Hinweis liest und «2 Rechnungen erstellen» klickt, rechnet Reparaturen den Mietern ab. |
| P-3 | Minor | Upload-Dialog, Liste der Dateien | Beide Dateien stehen auf «Bitte prüfen», sind aber schon mit «Diese Rechnung erstellen» angehakt, und «2 Rechnungen erstellen» ist aktiv, ohne dass ich die Angaben je geöffnet habe. Der Einleitungssatz verspricht «Sie prüfen sie, bevor Dwello die Rechnungen erstellt»; der Dialog setzt das nicht durch. (Ob das Erstellen wegen der leeren Kategorie abgelehnt würde, habe ich nicht geprüft: kein Speichern.) |
| P-4 | Minor | Upload-Dialog, Hinweis «Beleg» | «Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» Der Dialog sagt nicht, ob Dwello die hochgeladene Datei selbst als Beleg zur Rechnung speichert. Erst die Datenschutzerklärung verrät, dass hochgeladene Dateien als Belege gespeichert bleiben. Ich weiss im Dialog also nicht, ob mein Upload die Belegeinsicht schon abdeckt oder ob ich das Papier zusätzlich brauche. |
| P-5 | Minor | Datenschutz, «Weitergabe an Dritte» | «Das Sprachmodell läuft auf dem Server des Betreibers; die Daten verlassen dafür den Server nicht.» ist eine absolute Zusage. Was das Modell erhält (die ganze Datei, also auch Namen und Adressen auf der Rechnung), steht nicht da. Ebenso fehlt, was mit Dateien geschieht, die die KI gelesen hat, die ich dann aber verwerfe («Abbrechen und verwerfen»): Werden sie auf dem Server gelöscht? Der Abschnitt zu Belegen nennt nur «bis Sie den Beleg ersetzen oder die Rechnung löschen». |
| P-6 | Minor | Rechnungsseite, Karte «Beleg» | Bei einer abgerechneten Rechnung ohne Beleg stehen drei Texte untereinander: «Zu dieser Rechnung ist kein Beleg gespeichert.», die Warnung «Rechnung schon abgerechnet – Die Rechnung ist abgerechnet; Mieter können den Beleg verlangen.» und die Info «Beleg – Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» Die Warnung sagt nicht, was ich tun soll (Beleg hinzufügen? Original bereithalten?), und die Info wiederholt fast dasselbe. |
| P-7 | Nit | Upload-Dialog und Datenschutz | Im Dialog heisst es «die KI», in der Datenschutzerklärung «ein Sprachmodell». Für mich als Leser ist nicht sicher, dass dasselbe gemeint ist. |

## Beobachtungen

- Das Dateifeld (Dialog und Rechnungsseite) zeigt den Text des Browsers «Choose Files / No file chosen» auf Englisch (Headless-Chromium mit Locale de-CH). Ob ein echter Browser das deutsch zeigt, weiss ich nicht.
- Im Bedienungsbaum (Accessibility-Tree) zeigt «Kategorie» im ausgeklappten Vorschlag nur «Kategorie auswählen», obwohl die Liste 21 Kategorien enthält; «Verteilschlüssel» zeigt alle Optionen. Möglicherweise etwas für Sven.
- Die vorgeschlagenen Werte (Platzhalter-KI): Rechnungssteller = Dateiname («Werke Schlussrechnung 2025», «Lift Service und Reparatur»), bei beiden Rechnungsnummer R-1001, Beschreibung «Allgemeinstrom Q1», Leistungszeitraum 01.01.–31.03.2026 für eine «Schlussrechnung 2025», Kategorie leer. Für eine echte KI wäre das alles falsch, hier ist es der Platzhalter.
- Die Hilfe zum Leistungszeitraum nennt als Beispiel 2024, die Datumsfelder als Beispiel 31.12.2026.
- Der Hinweis «Die KI ist unsicher. Bitte prüfen Sie den Wert.» erscheint erst im ausgeklappten Vorschlag unter dem Rechnungsdatum; davor steht ein leerer Absatz.
- Die Löschbestätigung ist gut: Sie nennt Rechnungssteller und Betrag, die betroffene Abrechnungsperiode und was mit Entwürfen und versendeten Abrechnungen zu tun ist.
- Die Abbrechen-Rückfrage «Hochladen abbrechen? – Hochgeladene Dateien und Ihre Eingaben gehen verloren.» mit «Weiter prüfen» / «Abbrechen und verwerfen» ist klar.
- Netzwerk: Beim Lesen der Dateien schickte der Browser nur `POST /api/invoices/extract` an Dwello selbst (localhost:3300), keine Anfrage an einen fremden Dienst. Das stützt aus Sicht des Browsers die Datenschutzerklärung; was der Server weiterreicht, kann ich nicht sehen.

## Aufgabe geschafft

Ja (alle verlangten Schritte angesehen; ein Beleg zu einer Seepark-Rechnung liess sich nicht ansehen, weil keine Seepark-Rechnung einen hat, siehe «Nicht geprüft»).

## Aufwand

Etwa 15 Minuten, 8 Durchgänge (Rechnungsliste, Dialog, Upload, Angaben beider Dateien, Abbrechen, Datenschutz, Rechnungsseite, Löschbestätigung, Suche nach Rechnungen mit Beleg).

## Ablauf

1. **Rechnungsliste öffnen.** Erwartet: Knopf zum Hochladen. Gesehen: «Rechnungen hochladen» neben «Rechnung erfassen», gut auffindbar.
2. **Dialog öffnen.** Erwartet: Erklärung, was mit meinen Dateien passiert. Gesehen: «Wählen Sie das Gebäude und die Dateien Ihrer Rechnungen. Die KI liest die Angaben aus; Sie prüfen sie, bevor Dwello die Rechnungen erstellt.» und der Kasten «Beleg: Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» Dateifeld gesperrt mit «Wählen Sie zuerst das Gebäude.» Klar. Offen bleibt, ob die Datei als Beleg gespeichert wird (P-4). Screenshot 02-dialog.png.
3. **«Seepark Residenz» wählen.** Gesehen: «PDF, JPG oder PNG, je höchstens 10 MB, bis zu 20 Dateien auf einmal. Ausgewählte Dateien liest die KI sofort aus.» Gut: Ich weiss, dass das Auslesen sofort beginnt.
4. **Beide Dateien wählen.** Erwartet: pro Datei die erkannten Angaben mit Betrag. Gesehen: pro Datei nur Dateiname, Badge «Bitte prüfen», ein gelber Hinweis, angehakt «Diese Rechnung erstellen», «Angaben prüfen», «Datei entfernen». Betrag und Rechnungssteller sehe ich erst nach dem Aufklappen. Knopf «2 Rechnungen erstellen» schon aktiv (P-3). Screenshot 04-vorschlaege.png.
5. **Hinweis Werke lesen.** Erwartet: welcher Betrag gilt. Gesehen: Abzug CHF 1’000.00 genannt, Anweisung «so, dass jede Leistung nur einmal zählt». Nach dem Aufklappen: Betrag 1250.00. Ich kann nicht sagen, ob 1250 der Rest nach Abzug ist oder der Gesamtbetrag (P-1).
6. **Hinweis Lift lesen.** Erwartet: welcher Teil nicht umlagefähig ist und was ich hier eintrage. Gesehen: «… Erfassen Sie diese als eigene Rechnung.» Aufgeklappt: Betrag 1250.00, «Umlagefähig» angehakt, kein Hinweis zum Kürzen (P-2).
7. **Abbrechen.** Erwartet: Rückfrage. Gesehen: «Hochladen abbrechen?» mit klarer Folge; nach «Abbrechen und verwerfen» weiterhin 83 Rechnungen. Screenshot 07-abbrechen.png.
8. **Datenschutz (Fusszeile).** Erwartet: was die KI erhält und wie lange Dateien bleiben. Gesehen: Belege «dienen der Belegeinsicht der Mieter und bleiben gespeichert, bis Sie den Beleg ersetzen oder die Rechnung löschen»; Sprachmodell «läuft auf dem Server des Betreibers; die Daten verlassen dafür den Server nicht.» Inhalt der Daten an die KI und verworfene Dateien fehlen (P-5). Screenshot 08-datenschutz.png.
9. **Rechnung «ewl Energie Wasser Luzern, Fernwärme Q4 2025» (Seepark) öffnen.** Gesehen: Karte «Beleg» mit drei Texten (P-6), Dateifeld «Datei des Belegs» und «Beleg hinzufügen». Screenshot 09-rechnung.png.
10. **«Rechnung löschen» öffnen.** Gesehen: «Die Rechnung von ewl Energie Wasser Luzern über CHF 1’410.00 wird gelöscht. … Das lässt sich nicht rückgängig machen.», Warnung zur Abrechnungsperiode 01.01.2025 – 31.12.2025, Anleitung zu Entwürfen und versendeten Abrechnungen, «Bewahren Sie den Beleg auf: Der Mieter kann Einsicht verlangen.» Mit Escape geschlossen, nichts gelöscht. Screenshot 10-loeschen.png.

## Verwirrung

- «Erfassen Sie den Betrag so, dass jede Leistung nur einmal zählt»: welche Zahl ist gemeint?
- «Erfassen Sie diese als eigene Rechnung»: wo, und muss ich dann diese Rechnung kürzen?
- «Beleg» im Dialog: Ist meine hochgeladene Datei der Beleg, oder brauche ich das Papier?
- «KI» gegenüber «Sprachmodell».
- Auf der Rechnungsseite: «Mieter können den Beleg verlangen» bei «kein Beleg gespeichert»: Muss ich jetzt etwas tun?

## Fehlerrisiken

- Mit zwei Klicks («2 Rechnungen erstellen») werden Vorschläge übernommen, die als «Bitte prüfen» markiert sind: Akonto doppelt gezählt (P-1) oder Reparaturen als umlagefähig abgerechnet (P-2).
- Ein Vermieter, der glaubt, der Upload sei sein Beleg, wirft das Original weg; löscht er später die Rechnung, ist laut Datenschutz auch der Beleg weg (P-4).

## Vorschläge

- **P-1:** Rechnungsliste → «Rechnungen hochladen» → Seepark Residenz → «Werke Schlussrechnung 2025.pdf» → Hinweis lesen, «Angaben prüfen». Hilfreich: im Hinweis sagen, welchen Betrag die KI eingetragen hat («Der Betrag CHF 1’250.00 ist der Rest nach Abzug von CHF 1’000.00 Akonto.») und wann man welchen Betrag nimmt («Sind die Akontorechnungen schon in Dwello erfasst, behalten Sie den Rest; sonst tragen Sie den Gesamtbetrag ein.»).
- **P-2:** Gleicher Weg mit «Lift Service und Reparatur.pdf». Hilfreich: den nicht umlagefähigen Teil nennen, wenn die KI ihn kennt, und konkret anweisen: «Ziehen Sie die Reparatur hier vom Betrag ab und erfassen Sie sie danach mit ‹Rechnung erfassen› als nicht umlagefähig.»
- **P-3:** Gleicher Weg, ohne «Angaben prüfen» zu öffnen. Hilfreich: Dateien mit «Bitte prüfen» nicht vorab anhaken, oder «Erstellen» erst nach dem Aufklappen zulassen.
- **P-4:** Dialog öffnen, Kasten «Beleg» lesen. Hilfreich: «Dwello speichert die Datei als Beleg zur Rechnung. Bewahren Sie das Original trotzdem auf; …»
- **P-5:** Fusszeile → Datenschutz → «Weitergabe an Dritte». Hilfreich: nennen, was das Sprachmodell erhält (Inhalt der Datei inkl. Namen und Adressen), und was mit verworfenen Dateien passiert («werden nicht gespeichert» oder «nach … gelöscht»).
- **P-6:** Rechnung «ewl Energie Wasser Luzern, Fernwärme Q4 2025» öffnen. Hilfreich: die Warnung mit einer Handlung schliessen («Fügen Sie den Beleg hinzu oder halten Sie das Original bereit.») und die Info «Beleg» in diesem Fall weglassen.
- **P-7:** Dialog und Datenschutz vergleichen. Hilfreich: ein Wort für beides, oder im Datenschutz «Sprachmodell (in Dwello ‹KI›)».

## Nicht geprüft

- Eine Seepark-Rechnung *mit* gespeichertem Beleg: Keine der 40 Seepark-Rechnungen hat einen, und einen hinzuzufügen wäre Speichern (Auftrag: nur ansehen). Deshalb auch nicht gesehen, ob die Löschbestätigung sagt, dass der gespeicherte Beleg mitgelöscht wird.
- Ob «2 Rechnungen erstellen» mit leerer Kategorie abgelehnt würde und mit welchem Text (kein Speichern erlaubt).
- Ob ein Server die gelesenen, dann verworfenen Dateien behält: Aus dem Browser nicht sichtbar.
