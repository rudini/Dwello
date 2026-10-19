# Helga – Abrechnungen erstellen, Schritt 3: Prüfung der vereinbarten Nebenkosten (Runde 439, zweiter Durchgang)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (zusätzlich 200 %), Maus. Persona-App auf http://localhost:3300 (neuer Build), Deutsch. Nur angeschaut, nichts gespeichert.

Aufgabe: Unter «Abrechnungen erstellen» Alpenblick und die Abrechnungsperiode 2025 wählen, zu Schritt 3 «Heizprofil und Verwaltungspauschale» gehen und «Weiter» klicken, während die Prüfung der Mietverträge (1) 8 Sekunden braucht und (2) mit HTTP 500 scheitert; danach den Fehler aufheben und dem Rat folgen. Geprüft wird, ob mein P-1 aus `helga-439.md` behoben ist.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/helga-439-2/` (`delay.mjs`, `fail.mjs`, `edge.mjs`).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Kein neuer Befund zum geänderten Verhalten. P-1 ist behoben (siehe Ablauf). |

## Beobachtungen

- **P-1 behoben:** Klicke ich während der Prüfung auf «Weiter», steht jetzt fett «Dwello geht weiter, sobald die Mietverträge geprüft sind.» Genau so passiert es: Nach etwa 8 Sekunden zeigt Dwello von selbst «Schritt 4 von 5: Vorschau», und die Seite steht oben beim Schritt 4. Ich muss nichts mehr tun.
- **Mein früherer P-2 (200 %) ist auch behoben:** Der fette Satz unter der roten Meldung sagt jetzt selbst, was zu tun ist: «Dwello konnte die Mietverträge nicht prüfen. Wählen Sie «Erneut versuchen». Gelingt die Prüfung, geht es weiter.» Bei 200 % sehe ich diesen Satz und gleich darüber den Knopf «Erneut versuchen», auch wenn der rote Titel oben ausserhalb des Bildschirms liegt.
- **Mein früherer P-3 ist zum Teil behoben:** Nach «Erneut versuchen» steht kurz «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …» und «Dwello geht weiter, sobald die Mietverträge geprüft sind.» So sehe ich, dass Dwello es nochmals versucht. Scheitert es wieder, steht der Fokus aber weiterhin am Seitenanfang (auf der ganzen Seite) statt beim Knopf, und es steht nirgends, was ich tun soll, wenn es immer wieder scheitert.
- Im Fehlerfall steht «Wählen Sie «Erneut versuchen».» zweimal untereinander: einmal in der roten Meldung, einmal im fetten Satz darunter. Bei 150 % wirkt das doppelt; bei 200 % hilft es mir, weil ich oft nur den unteren Teil sehe.
- Klicke ich «Erneut versuchen», ohne vorher «Weiter» geklickt zu haben, und die Prüfung gelingt, verschwindet die rote Meldung und ich bleibe auf Schritt 3. Das passt: Ich hatte ja nicht «Weiter» gewählt. Eine Bestätigung wie «Die Mietverträge sind geprüft» gibt es nicht; die Meldung verschwindet einfach.
- Klicke ich während der Prüfung «Weiter» und danach «Zurück», bleibe ich auf Schritt 2. Dwello springt nach der Prüfung nicht ungefragt nach vorn. Gut.
- Während der Prüfung und im Fehlerfall sieht «Weiter» ganz normal aus. Das hat mich nicht gestört, weil nach dem Klick der Satz direkt über dem Knopf erscheint.
- Wenn die fetten Sätze erscheinen oder verschwinden, rutschen «Zurück» und «Weiter» um ein paar Zeilen nach unten oder oben (Screenshots `z150-fail-04-after-weiter.png` und `z150-fail-05-retry-running.png`).

## Aufgabe geschafft: ja

Beide Fälle verstanden. Beim Warten ging es von selbst weiter, wie der Satz es versprochen hat. Im Fehlerfall wusste ich, dass ich «Erneut versuchen» wählen muss, und nach der gelungenen Prüfung ging es ohne weiteren Klick zu Schritt 4.

## Aufwand

- Wartezeit: etwa 1 Minute, 4 Klicks (Weiter, Alpenblick, Weiter, Weiter) plus rund 8 Sekunden Warten. Kein zweiter Klick auf «Weiter» mehr nötig.
- Fehlerfall: etwa 2 Minuten, 6 Klicks (Weiter, Alpenblick, Weiter, Weiter, Erneut versuchen [scheitert nochmals], Erneut versuchen [gelingt]).

## Ablauf

1. **/statements/generate öffnen.** Erwartet: Schritt 1 mit der Periode. Gesehen: «Schritt 1 von 5», Beginn 01.01.2025 und Ende 31.12.2025 schon ausgefüllt.
2. **Weiter, Alpenblick ankreuzen, Weiter.** Erwartet: Schritt 3. Gesehen: «Schritt 3 von 5: Heizprofil und Verwaltungspauschale».
3. **Wartezeit, Schritt 3 offen.** Gesehen: Über den Knöpfen grau «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …». Ich weiss, dass etwas läuft.
4. **Gleich «Weiter» klicken.** Erwartet: Eine Erklärung, ob ich warten oder etwas tun muss. Gesehen: Fett «Dwello geht weiter, sobald die Mietverträge geprüft sind.» (`z150-delay-05-after-weiter.png`). Ich verstehe: warten, nichts tun.
5. **Warten.** Erwartet: Es geht von selbst weiter. Gesehen: Nach etwa 8 Sekunden steht «Schritt 4 von 5: Vorschau» mit Abrechnungsperiode, Anzahl Abrechnungen 2 und Kosten CHF 4’946.67; die Seite ist oben beim neuen Schritt (`z150-delay-06-after-check.png`). Genau wie versprochen. P-1 ist behoben.
6. **Fehlerfall, Schritt 3 offen.** Gesehen: Schon vor dem Klick die rote Meldung «Vereinbarte Nebenkosten nicht geprüft – Dwello konnte nicht prüfen, ob die Mietverträge alle Nebenkosten dieser Periode vereinbaren. Ohne diese Prüfung geht es nicht weiter. Wählen Sie «Erneut versuchen».» mit dem Knopf «Erneut versuchen».
7. **«Weiter» klicken.** Erwartet: Es geht nicht weiter, und ich erfahre, was ich tun soll. Gesehen: Ich bleibe auf Schritt 3, darunter fett «Dwello konnte die Mietverträge nicht prüfen. Wählen Sie «Erneut versuchen». Gelingt die Prüfung, geht es weiter.» (`z150-fail-04-after-weiter.png`). Klar.
8. **Bei 200 % dasselbe.** Gesehen: Oben der untere Teil des Knopfs «Erneut versuchen», darunter der fette Satz mit dem Rat (`z200-fail-04-after-weiter.png`). Auch ohne den roten Titel weiss ich, was zu tun ist.
9. **«Erneut versuchen», Prüfung scheitert wieder.** Erwartet: ein Zeichen, dass Dwello es nochmals versucht. Gesehen: kurz «Dwello prüft …» und «Dwello geht weiter, sobald …» (`z150-fail-05-retry-running.png`), danach wieder die rote Meldung und der fette Satz (`z200-fail-06-retry-failed.png`). Der Fokus steht danach auf der ganzen Seite, nicht beim Knopf.
10. **Fehler aufgehoben, «Erneut versuchen».** Erwartet laut Satz: Gelingt die Prüfung, geht es weiter. Gesehen: Nach etwa einer Sekunde steht «Schritt 4 von 5: Vorschau», ohne dass ich nochmals «Weiter» klicken musste.
11. **Zusatz: «Erneut versuchen» gelingt, ohne dass ich vorher «Weiter» geklickt hatte.** Gesehen: Die rote Meldung verschwindet, ich bleibe auf Schritt 3. Passt.
12. **Zusatz: Während der Prüfung zweimal «Weiter», dann «Zurück».** Gesehen: Schritt 2; nach der Prüfung bleibe ich dort. Passt.

## Verwirrung

- Keine neue. «Dwello geht weiter, sobald …» und «Gelingt die Prüfung, geht es weiter.» sind kurz und sagen, was passiert.
- Wie im ersten Durchgang: Ob «alle Nebenkosten dieser Periode» heisst, dass jede einzelne Rechnung im Vertrag stehen muss, weiss ich nicht. Das betrifft den unveränderten Text der roten Meldung.

## Fehlerrisiken

- Scheitert die Prüfung an diesem Tag immer, klicke ich immer wieder auf «Erneut versuchen», ohne zu wissen, ob ich später wiederkommen soll (Rest von P-3 aus dem ersten Durchgang, unverändert).
- Weil «Weiter» während der Prüfung normal aussieht, klicke ich vielleicht mehrmals; das hat aber nichts Falsches ausgelöst (kein Sprung über Schritt 4 hinaus).

## Vorschläge

- Keine neuen Tabellen-IDs. Zum Rest von P-3 aus `helga-439.md`: Nach einem gescheiterten «Erneut versuchen» den Fokus auf «Erneut versuchen» lassen und der roten Meldung «Klappt es wieder nicht, versuchen Sie es später nochmals.» hinzufügen. Reproduktion: `/api/statements/agreements` mit 500 beantworten, Schritt 3, «Erneut versuchen».

## Nicht geprüft

- Speichern und Schritt 5 «Erstellen»: Ich sollte nur schauen.
- Wartezeit bei 200 % Zoom: nur den Fehlerfall bei 200 % angeschaut; bei 150 % war das Verhalten eindeutig.
- Mobile Ansicht, Tastatur, dunkler Modus, andere Sprachen: nicht Helgas Gerät oder nicht in der Aufgabe.
- Eine gelungene Prüfung, bei der ein Mietvertrag die Nebenkosten nicht vereinbart: kommt bei Alpenblick in den Demodaten nicht vor.
