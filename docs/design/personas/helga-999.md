# Helga – Runde 999: Teilzahlungen festhalten und zurücknehmen

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % (Kontrolle bei 200 %), Maus.
Abrechnung: NK-11111111-2025-0001, Hans Müller, Musterhaus Zentrum, Wohnung 1.01, Nachzahlung CHF 215.80, Status «Überfällig».
Gespeichert: Teilzahlung CHF 100.00 (01.11.2026), Teilzahlung CHF 50.00 (01.11.2026, absichtlich falsch), Zurücksetzen der CHF 50.00, Teilzahlung CHF 60.00 (01.11.2026). Am Schluss steht dort: «Bezahlt: CHF 160.00, offen: CHF 55.80».

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung, Abschnitt «Verlauf» | Die Reihenfolge stimmt nicht mit dem überein, was ich gemacht habe. «Teilzahlung über CHF 60.00» steht vor «Teilzahlung vom 01.11.2026 über CHF 50.00 zurückgesetzt», obwohl ich die CHF 50.00 zuerst zurückgenommen und erst danach die CHF 60.00 eingetragen habe. Die Zahlungszeilen haben nur ein Datum und keine Uhrzeit. Wenn ich dem Mieter eine Quittung schreibe, kann ich so nicht sicher sagen, was zuerst war. |
| P-2 | Minor | Abrechnung, Meldung nach dem Zurücksetzen | Die Meldung lautet «Die Zahlung der Abrechnung NK-11111111-2025-0001 ist zurückgesetzt.» Ich bin erschrocken, weil ich dachte, die ganze Zahlung sei weg, also auch die CHF 100.00. Die Meldung nennt weder den Betrag (CHF 50.00) noch dass die CHF 100.00 bleiben. Erst im Abschnitt «Zahlung» weiter unten habe ich gesehen, dass noch CHF 100.00 bezahlt sind. |
| P-3 | Minor | Fenster «Abrechnung als bezahlt markieren», bei der zweiten Teilzahlung | Ist schon ein Teil bezahlt, steht im Fenster «Hans Müller: Nachzahlung CHF 115.80». Auf der Seite selbst steht aber «Der Mieter bezahlt die Nachzahlung von CHF 215.80.» Ich war unsicher, ob die Nachzahlung jetzt geändert wurde. Gemeint ist wohl der offene Rest. Ausserdem heisst das Fenster weiterhin «Abrechnung als bezahlt markieren» und sagt zuerst «Danach können Sie keine Mahnung mehr senden.», obwohl ich nur einen Teil eintragen wollte. Erst nachdem ich den Betrag geändert hatte, wurde der Knopf zu «Teilzahlung festhalten». |

## Beobachtungen

- Das Fenster vor dem Zurücksetzen ist gut. Es heisst «Zahlung zurücksetzen?» und sagt genau, was passiert: «Die Zahlung vom 01.11.2026 über CHF 50.00 wird gelöscht. Was davor festgehalten ist, bleibt: CHF 100.00. Offen sind dann CHF 115.80. Die Abrechnung … hat dann den Status «Überfällig». Der Verlauf hält das Zurücksetzen fest.» Das habe ich verstanden, auch bei 200 % passt alles ins Fenster.
- Der Knopf «Zahlung zurücksetzen» sagt nicht, welche Zahlung er zurücksetzt. Das erfährt man erst im Fenster: Es ist immer die zuletzt eingetragene. Für meine Aufgabe hat das gepasst. Hätte ich mich bei der ersten Zahlung vertippt, wüsste ich nicht, wie ich nur diese korrigiere.
- Nach dem Zurücksetzen verschwindet im Verlauf die Zeile «Teilzahlung über CHF 50.00». An ihrer Stelle steht «Teilzahlung vom 01.11.2026 über CHF 50.00 zurückgesetzt». Datum und Betrag sieht man also noch. Eine eigene Zeile «eingegangen» und eine zweite Zeile «zurückgenommen» gibt es aber nicht.
- Im Abschnitt «Zahlung» und in der Liste «Nebenkostenabrechnungen» steht gut lesbar «Bezahlt: CHF 160.00, offen: CHF 55.80». Das hilft mir, wenn der Mieter nachfragt.
- Einen Knopf für eine Quittung habe ich nicht gefunden. Eine Quittung müsste ich selbst schreiben und dafür die Zahlen aus dem Verlauf abschreiben.
- Den Hinweistext unter «Bezahlter Betrag» habe ich verstanden: «Hat der Mieter erst einen Teil überwiesen, geben Sie diesen Betrag ein. Die Abrechnung bleibt dann mit dem Rest offen.»
- Bei 150 % war der Titel des Fensters «Abrechnung als bezahlt markieren» oben aus dem Bild geschoben. Sichtbar war nur noch «Danach können Sie keine Mahnung mehr senden.»
- Der Status bleibt «Überfällig», auch wenn schon CHF 160.00 bezahlt sind. Das ist richtig, weil noch etwas offen ist.
- Mein erster Klick auf «Als bezahlt markieren», gleich nachdem die Seite erschienen war, hat nichts bewirkt. Es kam kein Fenster und keine Meldung. Erst ein Klick etwa eine Sekunde später hat das Fenster geöffnet.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 11 Schritte: Übersicht, Frist «Hans Müller» anklicken, zweimal «Als bezahlt markieren» mit Teilbetrag, «Zahlung zurücksetzen» mit Bestätigung, noch einmal «Als bezahlt markieren» mit dem richtigen Betrag, Verlauf und Liste prüfen.

## Ablauf

- Klick auf «Als bezahlt markieren», sofort nachdem die Seite geladen war. Erwartet: Ein Fenster für die Zahlung öffnet sich. Gesehen: Nichts geschah. Beim zweiten Versuch einen Moment später ging das Fenster auf.
- Fenster bei einer Teilzahlung. Erwartet: Das Fenster spricht von einer Teilzahlung. Gesehen: Titel «Abrechnung als bezahlt markieren», der Betrag war mit dem vollen Rest vorausgefüllt. Erst nach meiner Eingabe von 100.00 wurde der Knopf zu «Teilzahlung festhalten» (P-3).
- Zweite Teilzahlung. Erwartet: «Nachzahlung CHF 215.80» wie auf der Seite. Gesehen: «Hans Müller: Nachzahlung CHF 115.80» (P-3).
- Meldung nach dem Zurücksetzen. Erwartet: «Die Teilzahlung über CHF 50.00 ist zurückgesetzt». Gesehen: «Die Zahlung der Abrechnung NK-11111111-2025-0001 ist zurückgesetzt.» (P-2).
- Verlauf am Schluss. Erwartet: Die Zeilen stehen in der Reihenfolge, in der ich gearbeitet habe (100, 50, 50 zurückgesetzt, 60). Gesehen: «Teilzahlung über CHF 100.00», «Teilzahlung über CHF 60.00», «Teilzahlung vom 01.11.2026 über CHF 50.00 zurückgesetzt», jeweils nur mit dem Datum 01.11.2026. Die ursprüngliche Zeile über die CHF 50.00 fehlt (P-1).

## Vorschläge

- **P-1:** Abrechnung NK-11111111-2025-0001 öffnen, Teilzahlung 100.00 festhalten, dann 50.00, die 50.00 zurücksetzen und 60.00 festhalten. Im Verlauf steht die 60.00 vor dem Zurücksetzen. Hilfreich wäre eine Reihenfolge nach dem Zeitpunkt des Eintrags oder eine Uhrzeit wie bei «Erstellt». Ausserdem sollte die Zeile «Teilzahlung über CHF 50.00» bleiben und das Zurücksetzen als eigene Zeile darunter stehen. Dann sieht man Eingang und Rücknahme getrennt.
- **P-2:** Bei zwei Teilzahlungen die letzte zurücksetzen und die Meldung lesen. Hilfreich wäre zum Beispiel: «Die Teilzahlung vom 01.11.2026 über CHF 50.00 ist zurückgesetzt. Bezahlt bleiben CHF 100.00.»
- **P-3:** Nach einer ersten Teilzahlung erneut «Als bezahlt markieren» öffnen. Hilfreich wäre «Hans Müller: noch offen CHF 115.80 (Nachzahlung CHF 215.80)». Ausserdem ein Titel, der auch auf eine Teilzahlung passt, zum Beispiel «Zahlung festhalten».

## Nicht geprüft

- Ob das PDF («PDF herunterladen») die Teilzahlungen zeigt oder als Quittung dienen kann. Ich habe es nicht geöffnet, weil die Aufgabe beim Verlauf auf der Seite lag.
- Das Zurücksetzen der ersten Teilzahlung, wenn schon eine zweite eingetragen ist. Ich habe keinen Weg gesehen, eine andere als die letzte Zahlung auszuwählen.
- Eine Teilzahlung mit einem anderen Datum als heute. Ich habe beide Male den vorgeschlagenen 01.11.2026 übernommen.
- Bei 200 % habe ich nur das Fenster zum Zurücksetzen, den Abschnitt «Zahlung» und die Liste angesehen, nicht das Erfassen einer Zahlung.
