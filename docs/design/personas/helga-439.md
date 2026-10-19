# Helga – Abrechnungen erstellen, Schritt 3: Prüfung der vereinbarten Nebenkosten (Runde 439)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (zusätzlich 200 %), Maus. Persona-App auf http://localhost:3300, Deutsch. Nur angeschaut, nichts gespeichert.

Aufgabe: Unter «Abrechnungen erstellen» Alpenblick und die Abrechnungsperiode 2025 wählen, zu Schritt 3 gehen und «Weiter» klicken, während die Prüfung der Mietverträge (a) mit HTTP 500 scheitert und (b) 8 Sekunden braucht.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/helga-439/` (`fail2.mjs`, `fail200.mjs`, `delay.mjs`, `run.mjs`).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Schritt 3, Prüfung dauert | Ist die Prüfung fertig, verschwinden «Dwello prüft …» und «Es geht erst weiter, wenn …» einfach, und der Assistent bleibt auf Schritt 3. Nichts sagt mir, dass ich jetzt nochmals «Weiter» klicken muss. Den Satz «Es geht erst weiter, wenn Dwello die Mietverträge geprüft hat» habe ich so verstanden, dass es danach von selbst weitergeht. |
| P-2 | Minor | Schritt 3, Prüfung gescheitert, 200 % Zoom | Nach dem Klick auf «Weiter» sehe ich bei 200 % nur den Satz «Es geht erst weiter, wenn Dwello die Mietverträge geprüft hat.» und den unteren Rand von «Erneut versuchen». Die rote Meldung mit dem Grund liegt oben ausserhalb des Bildschirms. Der fette Satz sagt nicht, was ich tun soll. |
| P-3 | Nit | Schritt 3, «Erneut versuchen» scheitert wieder | Scheitert die Prüfung nach «Erneut versuchen» wieder, erscheint sofort dieselbe rote Meldung. Ich sehe nicht, ob Dwello es überhaupt nochmals versucht hat, und es steht nirgends, was ich tun soll, wenn es immer wieder scheitert (später nochmals versuchen?). Danach steht der Fokus wieder am Seitenanfang statt beim Knopf. |

## Beobachtungen

- Der Fehlerfall ist gut gelöst: Die rote Meldung «Vereinbarte Nebenkosten nicht geprüft – Dwello konnte nicht prüfen, ob die Mietverträge alle Nebenkosten dieser Periode vereinbaren. Ohne diese Prüfung geht es nicht weiter. Wählen Sie «Erneut versuchen».» steht schon da, bevor ich «Weiter» klicke, direkt über den Knöpfen. Sie sagt, was passiert ist und was ich tun soll.
- Nach «Erneut versuchen» bei einer gelungenen Prüfung verschwindet die Meldung, und «Weiter» führt zu Schritt 4 «Vorschau».
- «Weiter» sieht in beiden Fällen ganz normal aus, auch wenn es nicht geht. Erst nach dem Klick kommt der fette Satz. Das hat mich nicht gestört, weil der Satz gleich über den Knöpfen erscheint.
- Wenn die Prüfung fertig ist, rutscht die ganze Seite unten um eine Zeile nach oben. Der Knopf «Weiter» steht dann an einer anderen Stelle als vorher (Screenshots `delay-05` und `delay-06`).
- Das Wort «vereinbaren» kenne ich aus meinem Mietvertrag. Was genau geprüft wird («ob die Mietverträge die Nebenkosten dieser Periode vereinbaren»), verstehe ich ungefähr: ob im Vertrag steht, dass der Mieter Nebenkosten zahlt.
- Der Hilfetext zum Heizprofil oben auf Schritt 3 ist sehr lang (ein Absatz mit neun Sätzen). Bei 150 % füllt er fast den ganzen Bildschirm. Das hat mit dieser Aufgabe nichts zu tun.

## Aufgabe geschafft: ja

Beide Fälle verstanden. Im Fehlerfall wusste ich sofort, was ich tun soll. Im Fall mit der Wartezeit kam ich weiter, aber erst, nachdem ich gemerkt habe, dass ich nochmals klicken muss.

## Aufwand

- Fehlerfall: etwa 2 Minuten, 6 Schritte (Weiter, Alpenblick wählen, Weiter, Weiter, Erneut versuchen, Weiter).
- Wartezeit: etwa 1 Minute, 5 Schritte plus rund 10 Sekunden Warten, bis ich merke, dass nichts mehr passiert.

## Ablauf

1. **/statements/generate öffnen.** Erwartet: eine Seite zum Starten. Gesehen: «Abrechnungen erstellen», Schritt 1 von 5, Beginn 01.01.2025 und Ende 31.12.2025 schon ausgefüllt, mit dem Wochentag darunter. Gut.
2. **Weiter → Schritt 2 «Gebäude».** Erwartet: eine Liste der Gebäude. Gesehen: Alpenblick, Seepark Residenz und Musterhaus Zentrum mit Adresse, Anzahl Rechnungen und Wohnungen. Ich habe nur Alpenblick angekreuzt.
3. **Weiter → Schritt 3 (Prüfung scheitert).** Erwartet: Heizprofil und Verwaltungspauschale. Gesehen: oben der lange Text zum Heizprofil, unten über den Knöpfen die rote Meldung «Vereinbarte Nebenkosten nicht geprüft» mit dem Knopf «Erneut versuchen» (`fail-v04-afterWeiter-viewport.png`).
4. **Weiter klicken.** Erwartet: Es geht nicht weiter, und ich erfahre warum. Gesehen: Ich bleibe auf Schritt 3. Unter der roten Meldung erscheint fett «Es geht erst weiter, wenn Dwello die Mietverträge geprüft hat.» Das verstehe ich: Erst «Erneut versuchen».
5. **Bei 200 % Zoom dasselbe.** Gesehen: Oben sieht man nur den unteren Teil des Knopfs «Erneut versuchen», der rote Text ist ausserhalb des Bildschirms, darunter steht der fette Satz (`z200-fail-v04-afterWeiter-viewport.png`). Ich müsste nach oben scrollen, um zu lesen, warum. → P-2
6. **«Erneut versuchen», Prüfung scheitert wieder.** Erwartet: ein Zeichen, dass es nochmals versucht wird. Gesehen: Die gleiche Meldung steht sofort wieder da, wie wenn nichts passiert wäre. → P-3
7. **«Erneut versuchen», Prüfung gelingt.** Gesehen: Die rote Meldung und der fette Satz verschwinden. **Weiter** → Schritt 4 von 5 «Vorschau». Gut.
8. **Zweiter Durchgang, Prüfung dauert 8 Sekunden. Schritt 3 öffnen.** Gesehen: Über den Knöpfen steht grau «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …». Gut, so weiss ich, dass etwas läuft.
9. **Gleich «Weiter» klicken.** Erwartet: Warten oder eine Erklärung. Gesehen: Darunter erscheint fett «Es geht erst weiter, wenn Dwello die Mietverträge geprüft hat.» (`delay-05-after-weiter-viewport.png`). Ich denke: Gut, dann warte ich, es geht dann von selbst weiter.
10. **Warten.** Nach etwa 8 Sekunden verschwinden beide Sätze. Ich bin immer noch auf Schritt 3, und nichts sagt mir, dass die Prüfung fertig ist oder was ich jetzt tun soll (`delay-06-after-check-viewport.png`). Ich habe eine Weile gewartet und dann doch nochmals «Weiter» geklickt. → P-1
11. **Weiter → Schritt 4 «Vorschau».** Erst dann ging es weiter.

## Verwirrung

- «Es geht erst weiter, wenn Dwello die Mietverträge geprüft hat.» heisst für mich: «Warten Sie, es geht dann weiter.» Es geht aber nicht von selbst weiter; ich muss nochmals klicken.
- Als die Sätze verschwunden sind, wusste ich nicht, ob die Prüfung gelungen ist oder ob einfach etwas verschwunden ist.
- «Vereinbarte Nebenkosten» und «vereinbaren» sind verständlich. Ob «alle Nebenkosten dieser Periode» heisst, dass jede einzelne Rechnung im Vertrag stehen muss, weiss ich nicht.

## Fehlerrisiken

- Im Fall mit der Wartezeit bleibe ich vielleicht lange auf Schritt 3 sitzen und denke, Dwello arbeite noch, oder ich schliesse die Seite, weil «es hängt».
- Bei 200 % Zoom lese ich nur den fetten Satz und weiss nicht, dass ich auf «Erneut versuchen» klicken soll. Dann klicke ich immer wieder auf «Weiter».
- Scheitert die Prüfung an diesem Tag immer, klicke ich immer wieder auf «Erneut versuchen», ohne zu wissen, ob ich später wiederkommen soll.

## Vorschläge

- **P-1:** Reproduktion: Anfragen an `/api/statements/agreements` um 8 s verzögern, Periode 2025, Alpenblick, Weiter zu Schritt 3, sofort «Weiter» klicken, warten. Hilfreich wäre: Nach dem Klick wartet der Assistent und geht nach der Prüfung von selbst zu Schritt 4. Oder, wenn er stehen bleibt: Nach der Prüfung erscheint ein Satz wie «Die Mietverträge sind geprüft. Wählen Sie «Weiter».», und der Satz während der Prüfung lautet «Bitte warten Sie, bis Dwello die Mietverträge geprüft hat, und wählen Sie dann «Weiter».»
- **P-2:** Reproduktion: Zoom 200 %, `/api/statements/agreements` mit 500 beantworten, Schritt 3, «Weiter». Hilfreich wäre: Der fette Satz unter «Weiter» sagt selbst, was zu tun ist («… Wählen Sie oben «Erneut versuchen».»), oder die Seite scrollt beim Klick zur roten Meldung.
- **P-3:** Reproduktion: `/api/statements/agreements` mit 500 beantworten, Schritt 3, «Erneut versuchen». Hilfreich wäre: Während des neuen Versuchs kurz «Dwello prüft …» zeigen, der Meldung den Satz «Klappt es wieder nicht, versuchen Sie es später nochmals.» hinzufügen und den Fokus auf «Erneut versuchen» lassen.

## Nicht geprüft

- Mobile Ansicht und Tastaturbedienung: nicht Helgas Gerät.
- Andere Sprachen: Die Persona-App läuft auf Deutsch.
- Dunkler Modus: nicht in der Aufgabe.
- Schritt 5 «Erstellen» und das Speichern: Ich sollte nur schauen, nicht speichern.
- Der Fall, dass die Prüfung gelingt, aber ein Mietvertrag die Nebenkosten nicht vereinbart: In den Demodaten von Alpenblick kam das nicht vor, und es war nicht Teil der Aufgabe.
