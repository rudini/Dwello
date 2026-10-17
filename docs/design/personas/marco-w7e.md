# Marco – Zahlung zurücksetzen und Protokoll (w7e)

Persona: Marco, 38, auf dem Smartphone (390 × 844, Touch). Gebäude: Seepark Residenz.
Aufgabe: Die Nebenkostenabrechnung 2024 von Thomas Weber ist als bezahlt markiert, das Geld kam aber zurück. Die Zahlung zurücksetzen. Danach prüfen, wo Dwello die Änderung festhält und ob der Eintrag sagt, um welche Abrechnung und welche Zahlung es geht. Die ganze Liste der Einträge auf dem Handy ansehen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Protokoll (`/config/audit-log`) | Der Eintrag nennt nur die Abrechnungsnummer «NK-22222222-2024-0001» und das Zahlungsdatum, aber weder den Mieter (Thomas Weber) noch die Wohnung oder den Betrag (CHF 70.25). Der Eintrag ist auch kein Link zur Abrechnung. |
| P-2 | Minor | Abrechnung, Bestätigungsdialog / Einstellungen | Der Dialog sagt «Der Verlauf hält das Zurücksetzen fest», vom Protokoll steht nirgends etwas. Das Protokoll fand ich nur ganz unten in den Einstellungen, unter dem Speichern-Knopf (bei rund 4330 von 4660 px Seitenhöhe). |
| P-3 | Nit | Abrechnung, Verlauf | Die Zeile «Zahlung vom 05.05.2025 zurückgesetzt» hat nur das Datum (17.10.2026), «Erstellt» und «PDF erstellt» haben auch die Uhrzeit, das Protokoll ebenfalls (04:13). |

## Beobachtungen

- Kostenaufstellung auf dem Handy: «TV/Kabelanschluss» wird mitten im Wort umgebrochen («TV/Kabelanschl / uss», Screenshot 03-detail.png).
- Nach dem Zurücksetzen ist die Abrechnung eine **Rückerstattung** (ich schulde Thomas Weber CHF 70.25) und hat den Status «Überfällig». Auf der Übersicht steht dann «1 Überfällig», aber «Überfällige Beträge CHF 0.00». Das passt für mich nicht zusammen, auch wenn ich verstehe, dass hier ich der Schuldner bin. Den Hinweis «Bei einer Rückerstattung überweisen Sie den Betrag und markieren die Abrechnung danach als bezahlt» unter «Als Nächstes zu tun» fand ich hilfreich.
- Unter «Fristen» steht danach «14.05.2025 Zahlungsfrist · Thomas Weber seit 521 Tagen abgelaufen». Das stimmt zwar, wirkt aber alarmierend, weil ich ja gerade erst erfahren habe, dass das Geld zurückkam.
- Im Protokoll standen auch Einträge anderer Personen (Verwaltungspauschale, Kategorie «Gartenpflege», Anmeldungen). Die habe ich nicht angefasst und werte sie nicht.
- Der Knopf «Löschen» ist bei jedem Protokolleintrag rot und gross (48 px). Ein Fehltipp wird aber abgefangen: Der Dialog «Eintrag löschen?» nennt den Eintrag wörtlich und sagt «Die Änderung selbst bleibt bestehen. Das lässt sich nicht rückgängig machen.» Ich habe «Abbrechen» gewählt, der Eintrag blieb stehen.

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 Minuten, 9 Taps: Übersicht → «9 Bezahlt» → Thomas Weber → «Zahlung zurücksetzen» → bestätigen → Verlauf ansehen → Menü (kein Protokoll gefunden) → Benutzermenü → Einstellungen → ganz nach unten scrollen → «Protokoll».

## Ablauf

1. **Übersicht.** Erwartet: ein Weg zu den bezahlten Abrechnungen. Gesehen: Kachel «9 Bezahlt» unter «Nebenkostenabrechnungen». Gut.
2. **Liste «Bezahlt».** Erwartet: Thomas Weber schnell finden. Gesehen: Zeile «Thomas Weber NK-22222222-2024-0001, Seepark Residenz, Wohnung A1, Rückerstattung CHF 70.25, Bezahlt». Keine seitliche Verschiebung (Seitenbreite 390 px).
3. **Abrechnung.** Erwartet: ein Knopf, um die Zahlung zurückzunehmen. Gesehen: Oben direkt unter «PDF herunterladen» der Knopf «Zahlung zurücksetzen», Status «Bezahlt». Unten der Verlauf mit «Bezahlt 05.05.2025».
4. **Tippen auf «Zahlung zurücksetzen».** Erwartet: eine Rückfrage. Gesehen: Dialog «Zahlung zurücksetzen?»: «Die Abrechnung NK-22222222-2024-0001 gilt dann wieder als nicht bezahlt und hat den Status «Überfällig». Das Zahlungsdatum 05.05.2025 wird gelöscht. Der Verlauf hält das Zurücksetzen fest.» Darunter die Knöpfe «Zahlung zurücksetzen» (gross, dunkel) und «Abbrechen». Klar und ehrlich, was passiert (04-confirm.png).
5. **Bestätigen.** Erwartet: eine Bestätigung und ein neuer Status. Gesehen: Meldung «Die Zahlung der Abrechnung NK-22222222-2024-0001 ist zurückgesetzt.», Status «Überfällig», der Knopf heisst jetzt «Als bezahlt markieren». «Bezahlt am» ist aus dem Abschnitt «Zahlung» verschwunden.
6. **Verlauf auf der Abrechnung.** Erwartet: ein Eintrag zum Zurücksetzen. Gesehen: «Zahlung vom 05.05.2025 zurückgesetzt – 17.10.2026» an Stelle von «Bezahlt 05.05.2025». Verständlich, aber ohne Uhrzeit (P-3) (06-verlauf.png).
7. **Gibt es eine Gesamtliste?** Erwartet: etwas wie «Protokoll» oder «Änderungen» im Menü. Gesehen: Weder im Hauptmenü (Übersicht, Gebäude, Wohnungen, Mieter, Mietverträge, Rechnungen, Nebenkostenabrechnungen, Dokumente, Einstellungen, Kategorien, Verteilschlüssel, Heizprofile, Hilfe) noch im Benutzermenü.
8. **Einstellungen.** Gesehen: Eine lange Seite mit Absender, Verwaltungspauschale, Fristen, Vorschlägen und dem Knopf «Einstellungen speichern». Erst darunter steht ein Abschnitt «Protokoll» mit dem Link «Protokoll» und dem Text «Anmeldungen und Änderungen, die Ihre Abrechnungen beeinflussen, mit Datum». Hätte ich ohne den Auftrag nicht gesucht (P-2).
9. **Protokoll.** Erwartet: mein Eintrag zuoberst und klar, worum es geht. Gesehen: Karte «17.10.2026, 04:13 – Zahlung der Abrechnung NK-22222222-2024-0001 vom 05.05.2025 zurückgesetzt». Die Abrechnung und die Zahlung (über ihr Datum) sind erkennbar. Wer der Mieter war und um wie viel Geld es ging, steht nicht da, und ich kann nicht zur Abrechnung tippen (P-1).
10. **Ganze Liste auf dem Handy.** Gesehen: 8 Karten untereinander, jede mit Datum und Uhrzeit, Text und einem roten Knopf «Löschen». Lange Texte brechen sauber um (auch die Abrechnungsnummer wird beim Bindestrich getrennt). Keine seitliche Verschiebung: Seitenbreite 390 px, kein Element in `main` scrollt seitlich (10-protokoll-full.png). Gut lesbar.
11. **Fehltipp auf «Löschen» (eigener Eintrag).** Erwartet: eine Rückfrage. Gesehen: Dialog «Eintrag löschen?» mit dem Eintragstext. Abgebrochen, der Eintrag ist noch da.

## Verwirrung

- **«Verlauf» oder «Protokoll»?** Der Dialog spricht vom Verlauf, gemeint ist offenbar der Abschnitt auf der Abrechnung. Dass es zusätzlich ein Protokoll gibt, sagt mir niemand. Zwei Namen für zwei Orte: Ich war unsicher, was der Unterschied ist.
- **«NK-22222222-2024-0001»**: Diese Nummer merke ich mir nicht. Im Protokoll suche ich nach «Weber».
- **«Überfällig» bei einer Rückerstattung**: Klingt, als ob der Mieter mir etwas schuldet. Erst der Text «Sie erstatten dem Mieter CHF 70.25 zurück.» machte es klar.
- **Das Protokoll unter «Einstellungen»**: Ich stelle dort nichts ein, ich will nur nachsehen.

## Fehlerrisiken

- Wenn mehrere Zahlungen zurückgesetzt wurden, unterscheide ich die Einträge im Protokoll nur an der Abrechnungsnummer und muss jede Nummer in der Abrechnungsliste suchen.
- Der rote «Löschen»-Knopf auf jeder Karte ist gross und liegt beim Scrollen mit dem Daumen im Weg. Durch die Rückfrage ist das Risiko aber gering.
- Nach dem Zurücksetzen steht die Abrechnung als «seit 521 Tagen» überfällig da. Ein eiliger Nutzer könnte meinen, er müsse sofort mahnen, obwohl es eine Rückerstattung ist.

## Vorschläge

- **P-1:** Übersicht → «9 Bezahlt» → «Thomas Weber NK-22222222-2024-0001» → «Zahlung zurücksetzen» → bestätigen → Einstellungen → «Protokoll». Der Eintrag lautet nur «Zahlung der Abrechnung NK-22222222-2024-0001 vom 05.05.2025 zurückgesetzt». Hilfreich wäre: Mieter und Wohnung im Text («… von Thomas Weber, Seepark Residenz, Wohnung A1»), eventuell auch der Betrag, und den Eintrag zur Abrechnung verlinken.
- **P-2:** Dieselben Schritte bis zum Dialog «Zahlung zurücksetzen?». Er nennt nur den Verlauf, und das Protokoll liegt unter dem Speichern-Knopf der Einstellungen. Hilfreich wäre: im Dialog oder in der Erfolgsmeldung zusätzlich «… und im Protokoll» mit Link, oder ein Link «Alle Änderungen im Protokoll» beim Verlauf der Abrechnung. Das Protokoll könnte in den Einstellungen auch weiter nach oben rücken oder im Menü unter «Einstellungen und Hilfe» stehen.
- **P-3:** Abrechnung nach dem Zurücksetzen → Verlauf. «Zahlung vom 05.05.2025 zurückgesetzt» zeigt nur «17.10.2026». Hilfreich wäre die Uhrzeit wie bei «Erstellt» («17.10.2026, 04:13»), damit Verlauf und Protokoll gleich aussehen.

## Nicht geprüft

- Erneutes «Als bezahlt markieren» nach dem Zurücksetzen: nicht verlangt, und dann wäre der Zustand für die Prüfung nicht mehr der zurückgesetzte.
- Löschen eines Protokolleintrags bis zum Ende: Ich habe nur die Rückfrage geöffnet und abgebrochen, um keine Spuren zu löschen. Fremde Einträge habe ich nicht angetippt.
- Andere Sprachen, Dark Mode und der Fehlerfall (eine fehlschlagende Anfrage beim Zurücksetzen): nicht Teil des Auftrags.
- Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/3eb48ef7-ceb3-5923-ae2d-df5dd75846f5/scratchpad/marco-w7e/` (01-dashboard.png bis 11-loeschen.png, s1.mjs bis s10.mjs).
