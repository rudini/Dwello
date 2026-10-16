# Dr. Weber – Zahlung zurücksetzen (Runde w4b)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: http://localhost:3300 (Deutsch), Persona-Datenbank mit Demodaten. Gespeichert habe ich nur in «Seepark Residenz» (NK-22222222-2024-0002 Sarah Meier, NK-22222222-2024-0001 Thomas Weber).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/3a249483-dd2a-5ba2-b226-2da9cde281a8/scratchpad/dr-weber-w4b/`.

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung (Detail), Verlauf | Beim Zurücksetzen wird das gespeicherte PDF stillschweigend verworfen: «PDF herunterladen» wird zu «PDF erstellen», der Eintrag «PDF erstellt» verschwindet aus dem Verlauf. Wer danach das PDF öffnet, bekommt einen neuen Eintrag «PDF erstellt 16.10.2026» nach «Versendet 14.04.2025». Der Verlauf behauptet damit, das PDF sei 18 Monate nach dem Versand entstanden. Der Bestätigungsdialog sagt dazu nichts. |
| P-2 | Minor | Dialog «Zahlung zurücksetzen?» bei einer Rückerstattung | Der Text ist derselbe wie bei einer Nachzahlung: «gilt dann wieder als nicht bezahlt und hat den Status «Überfällig»». Bei einer Rückerstattung zahle aber ich, nicht der Mieter. Der Dialog sagt nicht, dass dann ich mit der Überweisung im Verzug bin. |
| P-3 | Minor | Dialog «Abrechnung als bezahlt markieren» | Eine Fehlermeldung bleibt stehen, wenn ich das Datum ändere: Unter «20.10.2026» stand weiter «liegt vor dem Abrechnungsdatum vom 14.04.2025». Unter «05.05.2025» stand weiter «liegt in der Zukunft». Erst nach dem nächsten Klick auf Speichern kam die richtige Meldung. Die angezeigte Meldung passt also nicht zum eingegebenen Datum. |
| P-4 | Minor | Dialog «Abrechnung als bezahlt markieren» bei einer Rückerstattung | Der Hilfetext passt («Der Tag, an dem Sie den Betrag überwiesen haben»), die Ablehnung aber nicht: «Das Zahlungsdatum liegt vor dem Abrechnungsdatum …». Auch der Titel «Abrechnung als bezahlt markieren» und das Feld «Bezahlt am» bleiben gleich. |
| P-5 | Minor | Abrechnung (Detail), Verlauf | Nach dem erneuten Erfassen steht im Verlauf «Zahlung vom 05.05.2025 zurückgesetzt – 16.10.2026» und darunter «Bezahlt – 05.05.2025». Die Daten sind nicht chronologisch. Es ist nicht klar, ob sich das Zurücksetzen auf die alte oder auf die neue Zahlung bezieht. Bei gleichem Datum sehen beide Zeilen gleich aus. |
| P-6 | Minor | Übersicht (Dashboard) nach dem Zurücksetzen der Rückerstattung | Dort stehen «1 Überfällig», aber «Überfällige Beträge CHF 0.00». Unter Fristen steht «Zahlungsfrist · Thomas Weber, seit 520 Tagen abgelaufen», obwohl die Detailseite für denselben Fall «Rückerstattung bis» sagt. Wer offen ist und um welchen Betrag es geht, bleibt auf der Übersicht unklar. Der Text unter «Überfällige Abrechnungen prüfen» erklärt den Fall der Rückerstattung immerhin richtig. |

## Beobachtungen

- Im Verlauf steht «Erstellt 16.10.2026, 22:15» vor «Versendet 14.04.2025». Erstellt nach dem Versand ist unplausibel. Ich halte das für eine Folge der Demodaten (sie werden beim Start erzeugt), nicht für einen Fehler dieser Änderung.
- Das PDF erwähnt den Zahlungsstatus weder vorher noch nachher. Der Text ist vor und nach dem Zurücksetzen gleich (Textvergleich bei Meier und Weber). Das ist korrekt, denn das PDF ist das versendete Dokument. Es behauptet also nirgends, dass bezahlt wurde.
- Nach dem Zurücksetzen gibt es bei der Nachzahlung (Meier) «Mahnung senden», bei der Rückerstattung (Weber) nicht. Das ist richtig.
- Im Dialog «als bezahlt markieren» steht bei der Nachzahlung «Danach können Sie keine Mahnung mehr senden», bei der Rückerstattung nicht. Das ist richtig.
- Der Bestätigungsdialog bei Meier ist korrekt: Die Frist vom 14.05.2025 ist abgelaufen, also stimmt «Überfällig». Er nennt das Datum 05.05.2025, das gelöscht wird, und sagt, dass der Verlauf das Zurücksetzen festhält. Nach dem Bestätigen erscheint die Meldung «Die Zahlung der Abrechnung NK-22222222-2024-0002 ist zurückgesetzt.» und der Fokus liegt auf der Überschrift.
- Für den Mieter Sarah Meier steht im PDF die Adresse Hirschmattstrasse 21, 6003 Luzern, die Wohnung liegt am Seeweg 15. Das kommt wohl aus den Demodaten (Zustelladresse) und ist nicht Teil dieser Aufgabe.
- Ich habe zum Prüfen das PDF über `/api/statements/<id>/pdf` geladen, wie es der Link «PDF» in der Liste tut. Schon das Laden (GET) legt nach dem Zurücksetzen ein neues PDF an und schreibt «PDF erstellt» in den Verlauf. **Nebenwirkung, die ich verursacht habe:** Ein Referenzaufruf auf die Abrechnung NK-11111111-2025-0001 (Hans Müller, Musterhaus Zentrum, nicht mein Gebäude) hat dort um 22:17 einen Eintrag «PDF erstellt» erzeugt. Ich wollte dort nur lesen. Die übrigen Einträge dort (Zurücksetzen, Bezahlt 16.10.2026) stammen nicht von mir und zählen nicht als Befund.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, etwa 25 Schritte (zwei Rücksetzungen, sechs abgelehnte Datumseingaben, zwei gültige Erfassungen, PDF-Vergleiche).

## Ablauf

1. **Liste «Bezahlt» → Sarah Meier, NK-22222222-2024-0002.** Erwartet: Status «Bezahlt», Zahlungsdatum, eine Aktion zum Rückgängigmachen. Gesehen: «Bezahlt», «Bezahlt am 05.05.2025», die Schaltfläche «Zahlung zurücksetzen» oben neben «PDF herunterladen». Leicht zu finden.
2. **«Zahlung zurücksetzen» geklickt.** Erwartet: ein Dialog, der die Folgen nennt. Gesehen: «Zahlung zurücksetzen? Die Abrechnung … gilt dann wieder als nicht bezahlt und hat den Status «Überfällig». Das Zahlungsdatum 05.05.2025 wird gelöscht. Der Verlauf hält das Zurücksetzen fest.» Das ist klar und für eine Nachzahlung korrekt. Was er verschweigt: dass das gespeicherte PDF verworfen wird (P-1).
3. **Bestätigt.** Gesehen: Status «Überfällig» (rot, mit Symbol), «Bezahlt am» ist weg, und es gibt «Mahnung senden» und «Als bezahlt markieren». Im Verlauf steht «Zahlung vom 05.05.2025 zurückgesetzt – 16.10.2026». Unerwartet: «PDF herunterladen» wurde zu «PDF erstellen», und «PDF erstellt» fehlt im Verlauf (P-1). In der Liste steht nun «Überfällig» mit «Als bezahlt markieren».
4. **PDF geprüft.** Erwartet: kein Hinweis auf «bezahlt». Gesehen: Der Text ist identisch mit dem PDF vor dem Zurücksetzen, ohne Zahlungsvermerk. Danach stand im Verlauf «PDF erstellt 16.10.2026, 22:17» nach «Versendet 14.04.2025» (P-1).
5. **«Als bezahlt markieren», Datum 10.04.2025 (vor dem Versand).** Erwartet: Ablehnung. Gesehen: «Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom 14.04.2025. Geben Sie frühestens dieses Datum ein.» Das ist korrekt, und der Fokus bleibt im Feld. 13.04.2025 wurde ebenso abgelehnt, die Grenze stimmt.
6. **20.10.2026 und 17.10.2026 (Zukunft, heute ist der 16.10.2026).** Erwartet: Ablehnung. Gesehen: «Das Zahlungsdatum liegt in der Zukunft. Geben Sie den Tag ein, an dem das Geld eingegangen ist.» Das ist korrekt, aber vor dem Absenden stand noch die alte Meldung unter dem neuen Datum (P-3).
7. **32.13.2025.** Gesehen: «Dieses Datum gibt es nicht. Bitte geben Sie es als TT.MM.JJJJ ein …» Das ist korrekt.
8. **05.05.2025 (gültig).** Gesehen: Der Dialog schliesst, die Meldung «Abrechnung als bezahlt markiert» erscheint, der Status ist «Bezahlt», «Bezahlt am 05.05.2025», und «PDF herunterladen» ist wieder da. Im Verlauf steht «Bezahlt 05.05.2025» unter «zurückgesetzt 16.10.2026» (P-5).
9. **Thomas Weber, NK-22222222-2024-0001 (Rückerstattung CHF 70.25).** Die Detailseite sagt richtig «Sie erstatten dem Mieter CHF 70.25 zurück» und «Rückerstattung bis 14.05.2025». Der Dialog «Zahlung zurücksetzen?» hat aber wörtlich denselben Text wie bei Meier (P-2). Nach dem Bestätigen: Status «Überfällig», keine Mahnung (richtig). Auf der Übersicht stehen «1 Überfällig» und «Überfällige Beträge CHF 0.00» (P-6).
10. **PDF bei Weber über «PDF erstellen».** Gesehen: Die Schaltfläche wird zu «PDF herunterladen», im Verlauf steht «PDF erstellt 16.10.2026, 22:19» nach «Versendet 14.04.2025». Der Inhalt ist identisch mit dem PDF vorher und hat keinen Zahlungsvermerk.
11. **Weber wieder als bezahlt erfasst:** 01.04.2025 wurde abgelehnt («Das Zahlungsdatum …», P-4), 05.05.2025 angenommen. Am Ende sind beide Abrechnungen wieder «Bezahlt am 05.05.2025».

## Verwirrung

- «Zahlung zurücksetzen» bei einer Rückerstattung: Wessen Zahlung? Bei Weber ist es meine Überweisung. «Überfällig» heisst dann, dass ich im Verzug bin. Das steht nirgends ausdrücklich.
- «PDF erstellen» bei einer längst versendeten Abrechnung: Erstelle ich damit ein neues Dokument, das vom versendeten abweichen könnte? Für mich als vorsichtigen Vermieter ist das die heikelste Stelle. Was der Mieter am 14.04.2025 bekommen hat, muss nachweisbar bleiben.
- «Zahlungsdatum» bei einer Rückerstattung (P-4).
- «Überfällige Beträge CHF 0.00» neben einer überfälligen Abrechnung (P-6).

## Fehlerrisiken

- Wer nach dem Zurücksetzen ein neues PDF erzeugt, nachdem sich Stammdaten geändert haben (Adresse, Bankkonto, Verwaltungsangaben), bekommt womöglich ein anderes Dokument als das versendete. Der Verlauf zeigt dann nur noch das neue Erstelldatum (P-1). Ob sich der Inhalt tatsächlich ändern kann, habe ich nicht geprüft. In meinem Fall war er identisch.
- Eine stehen gebliebene Fehlermeldung (P-3) kann dazu verleiten, ein eigentlich gültiges Datum wieder zu ändern.
- Bei gleichem Zahlungsdatum vor und nach der Korrektur kann man im Verlauf nicht erkennen, was korrigiert wurde (P-5).

## Vorschläge

- **P-1:** Seepark Residenz → Sarah Meier 2024 → «Zahlung zurücksetzen» → bestätigen. Danach steht «PDF erstellen» statt «PDF herunterladen», und «PDF erstellt» fehlt im Verlauf. Das PDF öffnen: Der Verlauf zeigt «PDF erstellt <heute>» nach «Versendet 14.04.2025». Was helfen würde: das versendete PDF beim Zurücksetzen behalten (die Zahlung ändert sein Inhalt nicht). Mindestens aber den ursprünglichen Verlauf-Eintrag behalten und im Dialog sagen, was mit dem PDF geschieht.
- **P-2:** Thomas Weber 2024 → «Zahlung zurücksetzen». Was helfen würde: ein eigener Text für Rückerstattungen, etwa «Die Rückerstattung gilt dann wieder als nicht überwiesen. Die Frist vom 14.05.2025 ist abgelaufen, die Abrechnung hat dann den Status «Überfällig». Das Überweisungsdatum 05.05.2025 wird gelöscht.»
- **P-3:** Bei einer überfälligen Abrechnung den Dialog «Als bezahlt markieren» öffnen, 10.04.2025 eingeben und absenden, dann 20.10.2026 eingeben und Tab drücken. Die alte Meldung bleibt stehen. Was helfen würde: die Meldung beim Ändern des Werts sofort neu prüfen oder entfernen.
- **P-4:** Weber zurücksetzen → «Als bezahlt markieren» → 01.04.2025. Was helfen würde: bei Rückerstattungen «Das Überweisungsdatum liegt vor …», das Feld «Überwiesen am» und der Titel «Rückerstattung als überwiesen markieren».
- **P-5:** Zurücksetzen und mit demselben Datum neu erfassen. Was helfen würde: im Verlauf das Erfassungsdatum der Zahlung zeigen («Bezahlt am 05.05.2025, erfasst am 16.10.2026») oder chronologisch nach Erfassung sortieren mit klarer Beschriftung.
- **P-6:** Weber zurücksetzen → Übersicht. Was helfen würde: bei den Fristen «Rückerstattung bis · Thomas Weber» schreiben und neben «Überfällige Beträge» offene Rückerstattungen getrennt ausweisen (oder erklären, dass nur Forderungen an Mieter zählen).

## Nicht geprüft

- Ob der Server ein ungültiges Datum auch ohne die Prüfung im Browser ablehnt: Bei allen Ablehnungen ging keine Anfrage an den Server, die Prüfung lief nur im Browser. Als Benutzer kann ich die Browserprüfung nicht umgehen.
- Das heutige Datum (16.10.2026) und genau das Abrechnungsdatum 14.04.2025 als Grenzwert habe ich nicht gespeichert. Ich wollte die Abrechnungen auf ihr ursprüngliches Datum zurücksetzen. Abgelehnt wurden 13.04.2025 und 17.10.2026.
- «Mahnung senden» nach dem Zurücksetzen habe ich nicht ausgelöst. Es hätte eine Mail an einen Demo-Mieter ausgelöst, und das gehört nicht zur Aufgabe.
- Ob ein neu erzeugtes PDF nach geänderten Stammdaten vom versendeten abweicht (siehe Fehlerrisiken). Dafür hätte ich Stammdaten ändern müssen.
- Andere Sprachen, Mobile, Tastaturbedienung.
