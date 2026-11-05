# Marco, Runde 653: Dialoge auf dem Handy

Persona: Marco, 38, Handy 390 × 844, Touch. App: Persona-Build von Branch w-653 auf http://localhost:3300, Demodaten. Gespeichert habe ich nur im Gebäude «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/marco-653/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde zu den geänderten Dialogen. Alle drei Dialoge öffnen oben mit dem Titel, die Fehlermeldung beim Datum sehe ich sofort, und nach dem Speichern bin ich oben auf der Seite und sehe die Bestätigung. |

## Beobachtungen

- **Rechnung löschen (abgerechnete Rechnung):** Der Dialog füllt den ganzen Bildschirm (16 px Rand ringsum). Zuerst sehe ich den Titel «Rechnung löschen», den Satz «… wird gelöscht … Das lässt sich nicht rückgängig machen.» und den gelben Kasten «Rechnung schon abgerechnet» mit den drei Abrechnungen. Die Knöpfe stehen etwa 400 px unter dem Bildschirmrand, ich muss durch den langen Hinweistext scrollen. Dass es weitergeht, sehe ich nur daran, dass der Text unten mitten im Satz abgeschnitten ist. Gestört hat mich das nicht, weil ich zuerst die Warnung lesen soll.
- Im Löschdialog steht «Rechnung löschen» (rot, oben) über «Abbrechen» (unten). Mit dem Daumen landet man unten auf «Abbrechen», das ist die sichere Seite.
- **Mietvertrag beenden:** Der Dialog öffnet oben, der Titel «Mietvertrag von Nina Brunner, Wohnung A2, beenden?» ist ganz zu sehen, der Cursor steht im Feld «Vertragsende». Die zwei Hilfetexte (vor allem der zu «Kündigung erhalten am» mit Familienwohnung und Art. 266l–266o OR) sind auf dem Handy sehr lang. Bis zu «Mietvertrag beenden» muss ich etwa eine Bildschirmhöhe scrollen.
- Nach dem Beenden deckt die Meldung unten («Der Mietvertrag von Nina Brunner endet am 31.12.2026. Die nächsten Schritte sehen Sie oben auf der Seite.») die Hälfte des Knopfs «Neuen Mietvertrag für Nina Brunner erfassen» ab. Die Meldung lässt sich mit X schliessen.
- Auf dem beendeten Mietvertrag steht «Vertragsdauer: Laufend» und darunter «Unbefristet, gekündigt auf den 31.12.2026». Das stimmt bis Ende Jahr, auf den ersten Blick wirkt es aber widersprüchlich.
- **Versenden:** «Als versendet markieren» habe ich nicht direkt auf der Abrechnung gefunden. Es kommt erst über «Per E-Mail senden» und dann «Stattdessen per Brief zustellen». Beim Wechsel bleibt der Dialog offen, wird kürzer und rückt in die Mitte. Titel und Knöpfe sind dann ohne Scrollen sichtbar.
- Im Briefdialog steht «Dwello legt sie dann unter «Dokumente» ab. Drucken Sie sie dort aus.» Nach dem Markieren gibt es auf der Abrechnung keinen Link zu «Dokumente». Ganz unten im «Verlauf» steht aber «Versendetes PDF herunterladen», das reicht mir zum Drucken.
- In der Kostenaufstellung bricht «TV/Kabelanschluss» mitten im Wort um («TV/Kabelanschl / uss»). Das war nicht Teil der Aufgabe.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 20 Schritte: Rechnung suchen und öffnen (3), Löschdialog öffnen und abbrechen (2), Mietvertrag suchen (3), Dialog öffnen, falsches Datum, bestätigen, korrigieren, bestätigen (5), Abrechnung suchen (3), «Per E-Mail senden», «Stattdessen per Brief zustellen», «Als versendet markieren» (3).

## Ablauf

1. **Rechnung löschen** (Facility Service AG, «Hauswartung Q4 2024», in drei bezahlten Abrechnungen 2024). Den Knopf habe ich ganz unten auf der Seite angetippt (Seite rund 1780 px gescrollt). Erwartet: Der Dialog öffnet vielleicht in der Mitte der langen Seite oder zeigt zuerst die Knöpfe. Gesehen: Der Dialog sitzt am oberen Bildschirmrand, der Inhalt steht ganz oben (Titel, Warnung, gelber Kasten «Rechnung schon abgerechnet»). Die Knöpfe sind unter dem Rand, man muss scrollen. «Abbrechen» schliesst den Dialog, ich bin wieder auf der Rechnung und nichts ist gelöscht. (Screenshot `04-delete-dialog-viewport.png`)
2. **Mietvertrag beenden** (Nina Brunner, Wohnung A2). Ich habe «31.13.26» eingegeben und «Mietvertrag beenden» angetippt. Erwartet: Der Fehler steht vielleicht weiter unten neben dem Knopf, und ich muss ihn suchen. Gesehen: Der Dialog bleibt offen und springt nach oben. Gleich unter dem Feld steht in Rot «Dieses Datum gibt es nicht. Bitte geben Sie es als TT.MM.JJJJ ein, zum Beispiel 31.12.2026.», der Cursor steht wieder im Feld. Es wurde nichts gesendet. (Screenshot `08-wrong-date.png`)
3. Dann habe ich «31.12.26» eingegeben und einmal bestätigt. Erwartet: Vielleicht muss ich zweimal tippen, oder das zweistellige Jahr wird nicht verstanden. Gesehen: Ein Tippen genügt. Der Dialog schliesst, oben steht der Kasten «Nächste Schritte», unten die Meldung «… endet am 31.12.2026 …». Im Vertrag steht jetzt «gekündigt auf den 31.12.2026». Das Datum wurde also übernommen. (Screenshot `10-after-confirm.png`)
4. **Versenden** (Entwurf NK-22222222-2025-0004, Marco Bernasconi, Wohnung B2). Erwartet: ein Knopf «Als versendet markieren» auf der Abrechnung. Gesehen: Er ist nur über «Per E-Mail senden» und dann «Stattdessen per Brief zustellen» erreichbar (siehe Beobachtungen). Nach «Als versendet markieren» bin ich oben auf der Abrechnung: Titel, Status «Versendet», neuer Hauptknopf «Als bezahlt markieren» und unten die Meldung «Abrechnung als versendet markiert». Die Meldung war nach 10 Sekunden weg. (Screenshots `13-letter-dialog.png`, `15-after-sent.png`)

## Vorschläge

Keine Tabellen-IDs. Zu den Beobachtungen, falls jemand daran arbeitet:
- Löschdialog auf dem Handy: Den langen Hinweis kürzen oder unter einem «Mehr erfahren» zusammenklappen, damit die Knöpfe näher an der Warnung stehen.
- Nach dem Beenden des Mietvertrags: Die Meldung so platzieren, dass sie keinen Knopf im Kasten «Nächste Schritte» verdeckt, oder sie früher ausblenden.
- Nach «Als versendet markieren»: einen Link «Zu den Dokumenten» in die Meldung, wie es der Dialog verspricht.

## Nicht geprüft

- Rechnung wirklich löschen: In der Aufgabe stand nur abbrechen.
- Der Dialog «Per E-Mail senden» bis zum Ende: Ich habe per Brief markiert, wie verlangt. Ein E-Mail-Versand hätte über den Mail-Dienst laufen müssen.
- Das zweite Datumsfeld «Kündigung erhalten am» mit falschem Datum und der Kalenderknopf neben den Feldern: Nicht verlangt, ich habe sie nicht angetippt.
- Ob die Seite hinter dem offenen Dialog mitscrollt, wenn man im Dialog wischt: Die Wischgeste habe ich nicht nachgestellt. Gemessen habe ich nur die Position des Dialoginhalts (oben).
