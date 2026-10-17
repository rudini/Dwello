# Persona-Review: Marco – Zahlung erfassen, zurücksetzen, neu erfassen (Runde w4b)

Marco, 38, auf dem Smartphone (390 × 844, Touch), App auf http://localhost:3300 (Deutsch), Demo-Daten. Gespeichert habe ich nur in «Musterhaus Zentrum» (Abrechnung NK-11111111-2025-0001, Hans Müller, Wohnung 1.01). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/3a249483-dd2a-5ba2-b226-2da9cde281a8/scratchpad/marco-w4b/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung, Bestätigung «Zahlung zurücksetzen?» | Nach dem Zurücksetzen ist das PDF weg: oben steht «PDF erstellen» statt «PDF herunterladen», und «PDF erstellt» fehlt im Verlauf. Die Bestätigung sagt dazu nichts. Später war wieder ein PDF da, mit neuer Zeit (22:17), ohne dass ich etwas dafür getan hätte. |
| P-2 | Minor | Abrechnung, Verlauf | Nach dem Zurücksetzen fehlt der Eintrag «Bezahlt». Es bleibt nur «Zahlung vom 28.09.2026 zurückgesetzt – 16.10.2026». Bei «Zurückgesetzt» und «Bezahlt» steht nur das Datum, bei «Erstellt» auch die Uhrzeit. Wann ich die erste Zahlung erfasst habe, sehe ich nicht. Bei zwei Einträgen am selben Tag erkenne ich die Reihenfolge nur an der Position in der Liste. |
| P-3 | Nit | Dialog «Abrechnung als bezahlt markieren» | Das Feld heisst «Bezahlt am», die Fehlermeldung spricht vom «Zahlungsdatum». Das frühestmögliche Datum (28.09.2026) erfahre ich erst nach dem Tippen auf «Als bezahlt markieren». Der Hilfetext zeigt als Beispiel «31.12.2026», ein Datum in der Zukunft. |
| P-4 | Nit | Bestätigung «Zahlung zurücksetzen?» | Die Bestätigung nennt nur die Nummer «NK-11111111-2025-0001», nicht den Mieter. Gerade weil ich mich beim Mieter vertan habe, würde mir «Hans Müller» sofort sagen, dass es die richtige Abrechnung ist. Der Bezahlt-Dialog nennt den Namen («Hans Müller: Nachzahlung CHF 215.80»). |

## Beobachtungen

- Der Weg vom Dashboard war schnell: Unter «Fristen» stand «28.10.2026 Zahlungsfrist · Hans Müller in 12 Tagen». Ein Tipp darauf, und ich war in der Abrechnung, mit «Als bezahlt markieren» gleich oben.
- Den Dialog konnte ich auf dem Handy gut bedienen: Er passt ohne Scrollen auf den Bildschirm, die Knöpfe sind gross genug, und das Datum ist mit heute (16.10.2026) vorausgefüllt. Unter dem Feld steht das Datum ausgeschrieben («Montag, 6. Januar 2025»). Das hilft, Tippfehler zu erkennen.
- Die Fehlermeldung bei 06.01.2025 ist klar: «Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom 28.09.2026. Geben Sie frühestens dieses Datum ein.» Das Feld wird rot umrandet, und mein Eintrag bleibt stehen. Sobald ich das Datum korrigiert hatte, verschwand die Meldung auf dem Bildschirm.
- Im Accessibility-Baum steht die Fehlermeldung zweimal, die zweite vermutlich in einem Bereich, der nur vorgelesen wird. Nach der Korrektur auf 28.09.2026 stand die alte Meldung dort noch, obwohl das Datum jetzt gültig war. Sehen kann ich das nicht; ein Screenreader würde es vielleicht noch vorlesen (für Sven).
- Die Bestätigung beim Zurücksetzen ist gut: «Die Abrechnung … gilt dann wieder als nicht bezahlt und hat den Status «Versendet». Das Zahlungsdatum 28.09.2026 wird gelöscht. Der Verlauf hält das Zurücksetzen fest.» Das stimmte alles.
- Die Bestätigungsmeldungen unten («Abrechnung als bezahlt markiert», «Die Zahlung der Abrechnung NK-11111111-2025-0001 ist zurückgesetzt.») überdecken die Kostenaufstellung. Sie lassen sich mit einem X schliessen.
- Im Verlauf steht «Versendet 28.09.2026» unter «Erstellt 16.10.2026, 22:15»: Versendet wäre also vor der Erstellung. Das kommt wohl von den Demo-Daten.
- Der Verlauf ist ganz unten auf einer rund 4300 px langen Seite. Auf dem Handy muss ich lange scrollen, um zu sehen, was passiert ist.
- In der Liste «Nebenkostenabrechnungen» hat die Zeile von Hans Müller nach dem Zurücksetzen wieder den Status «Versendet» und einen eigenen Knopf «Als bezahlt markieren».

## Aufgabe geschafft: ja

## Aufwand

Etwa 4 Minuten, 11 Schritte (Taps und Eingaben): Schritt 1 sechs (Frist antippen, «Als bezahlt markieren», Datum tippen, speichern → Fehler, Datum korrigieren, speichern), Schritt 2 drei (Zurücksetzen, Bestätigung lesen und bestätigen, zum Verlauf scrollen), Schritt 3 zwei (Dialog öffnen, mit dem vorausgefüllten Datum speichern).

## Ablauf

1. **Dashboard.** Erwartet: Ich finde Hans Müller irgendwo. Gesehen: Unter «Fristen» steht «Zahlungsfrist · Hans Müller in 12 Tagen». Ein Tipp öffnet die Abrechnung NK-11111111-2025-0001, Status «Versendet», Nachzahlung CHF 215.80.
2. **«Als bezahlt markieren».** Erwartet: ein Datumsfeld. Gesehen: Dialog «Abrechnung als bezahlt markieren», Hinweis «Danach können Sie keine Mahnung mehr senden.», Feld «Bezahlt am» mit 16.10.2026 und Kalenderknopf, darunter «Hans Müller: Nachzahlung CHF 215.80».
3. **06.01.2025 eingeben und speichern.** Erwartet: Es wird gespeichert, oder eine Warnung kommt. Gesehen: Nichts wird gesendet (kein Request). Das Feld wird rot mit «Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom 28.09.2026. Geben Sie frühestens dieses Datum ein.» (Screenshot 07-submit.png). Da merke ich: Januar 2025 kann gar nicht sein, die Abrechnung kam ja erst im September 2026.
4. **So erfassen, wie die App es zulässt: 28.09.2026.** Erwartet: Die Meldung verschwindet, und es wird gespeichert. Gesehen: Die Meldung verschwindet sofort. Nach dem Speichern zeigt die Seite «Status: Bezahlt», «Bezahlt am 28.09.2026», den Knopf «Zahlung zurücksetzen» und die Meldung «Abrechnung als bezahlt markiert». Im Verlauf steht neu «Bezahlt 28.09.2026».
5. **«Zahlung zurücksetzen» antippen.** Erwartet: eine Rückfrage. Gesehen: «Zahlung zurücksetzen?» mit dem Text zu Status, gelöschtem Zahlungsdatum und Verlauf (Screenshot 10-reset-confirm.png). Den Mieter nennt sie nicht (P-4).
6. **Bestätigen.** Erwartet: Status «Versendet», und der Verlauf zeigt das Zurücksetzen. Gesehen: «Status: Versendet», die Meldung «Die Zahlung der Abrechnung … ist zurückgesetzt.» und «Bezahlt am» weg. Neu war aber auch, dass oben statt «PDF herunterladen» jetzt «PDF erstellen» stand (Screenshot 11-after-reset.png). Im Verlauf: «Erstellt 16.10.2026, 22:15 / Versendet 28.09.2026 / Zahlung vom 28.09.2026 zurückgesetzt 16.10.2026». Die Einträge «PDF erstellt» und «Bezahlt» waren weg (P-1, P-2). Was passiert ist, verstehe ich: Die Zahlung vom 28.09. wurde heute zurückgesetzt. Die Uhrzeit fehlt.
7. **Seite neu geladen.** Gleicher Verlauf, gespeichert. Beim nächsten Öffnen war wieder «PDF herunterladen» da, mit «PDF erstellt 16.10.2026, 22:17» im Verlauf (P-1).
8. **Neu erfassen für heute.** Erwartet: Das Datum ist mit heute vorausgefüllt. Gesehen: 16.10.2026 vorausgefüllt, ein Tipp auf Speichern. Danach «Status: Bezahlt», «Bezahlt am 16.10.2026», und im Verlauf zusätzlich «Bezahlt 16.10.2026» unter dem Eintrag zum Zurücksetzen (Screenshot 14-paid-today-full-bottom.png).

## Verwirrung

- «Bezahlt am» und «Zahlungsdatum» meinen dasselbe; ich habe kurz gezögert, ob die Meldung mein Feld meint (P-3).
- «PDF erstellen» nach dem Zurücksetzen: Ist das PDF, das Hans bekommen hat, jetzt weg? Muss ich es neu erstellen und neu schicken? (P-1)
- «Abrechnungsdatum» kannte ich vorher nicht als Grenze. Oben auf der Seite steht es nicht, nur weiter unten im Abschnitt «Zahlung», und den verdeckt der Dialog.

## Fehlerrisiken

- Wer das Datum nicht genau weiss, nimmt einfach das vorgeschlagene «frühestens 28.09.2026». So wie ich in Schritt 4 entsteht dann ein Zahlungsdatum, das nicht stimmt, nur weil die App es zulässt.
- Ich könnte nach P-1 auf «PDF erstellen» tippen und meinen, ich müsse die Abrechnung neu verschicken.
- Ohne Mieternamen in der Rückfrage (P-4) setze ich bei mehreren offenen Tabs leicht die falsche Abrechnung zurück.

## Vorschläge

- **P-1:** Abrechnung von Hans Müller als bezahlt markieren, dann «Zahlung zurücksetzen» → bestätigen. Oben steht «PDF erstellen», «PDF erstellt» fehlt im Verlauf. Hilfreich wäre: Das PDF bleibt beim Zurücksetzen erhalten. Oder, falls es neu erstellt werden muss, sagt die Bestätigung das und auch, ob der Mieter etwas Neues bekommen muss.
- **P-2:** Gleiche Schritte, dann zum Verlauf scrollen. Hilfreich wäre: den Eintrag «Bezahlt» (mit Datum der Erfassung) stehen lassen und dazu «Zahlung zurückgesetzt» eintragen, beide mit Uhrzeit wie bei «Erstellt».
- **P-3:** Dialog öffnen, 06.01.2025 eingeben, speichern. Hilfreich wäre: in Hilfetext und Meldung denselben Begriff verwenden, und der Hilfetext nennt das frühestmögliche Datum schon vor dem Speichern («frühestens 28.09.2026, das Abrechnungsdatum»).
- **P-4:** Eine bezahlte Abrechnung öffnen und auf «Zahlung zurücksetzen» tippen. Hilfreich wäre: Die Bestätigung nennt Mieter und Betrag wie der Bezahlt-Dialog («Hans Müller: Nachzahlung CHF 215.80»).

## Nicht geprüft

- Den Kalenderknopf neben «Bezahlt am»: Ich habe das Datum getippt. Ob der Kalender Daten vor dem Abrechnungsdatum sperrt, weiss ich nicht.
- Ob das PDF beim Zurücksetzen gelöscht und dann im Hintergrund neu erstellt wird oder erst beim Öffnen einer Seite: Ich sehe nur, dass es nach dem Zurücksetzen fehlte und beim nächsten Öffnen mit neuer Zeit wieder da war. Ob sich der Inhalt geändert hat, habe ich nicht geprüft.
- Ob ein vom Server abgelehntes Datum anders gemeldet wird als die Prüfung im Browser: Ich habe keine Anfrage fehlschlagen lassen.
- Das Bezahlt-Markieren direkt aus der Liste «Nebenkostenabrechnungen».
