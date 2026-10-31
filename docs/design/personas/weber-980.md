# Persona-Review Dr. Weber, Slice 980

Desktop 1440 × 900, Maus, Persona-Stack auf :3300 (Demodaten). Gespeichert nur in «Alpenblick». Skripte und Screenshots: `/tmp/scratchpad/weber-980/`.

Geänderte Rechnung: Kaminfeger Zurbuchen, «Kaminfegerarbeiten Heizanlage 2024», 15.10.2024, AB-2024-005, Betrag CHF 290.00 → CHF 310.00.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnung (Detail), «In Abrechnungen enthalten» | Nach dem Berichtigen stehen vier Abrechnungen gleichrangig unter «In Abrechnungen enthalten»: «NK-…-0004, Entwurf», «NK-…-0003, Entwurf», «NK-…-0002, Ersetzt», «NK-…-0001, Ersetzt». Dass 0003 und 0004 die berichtigten Abrechnungen sind und die Rechnung mit CHF 310.00 abrechnen, die ersetzten aber mit dem früheren Stand (CHF 290.00), steht nirgends. Die Warnung ist weg, aber positiv gesagt wird es nicht. Ich musste jede Abrechnung öffnen, um zu sehen, welcher Betrag wo steckt. |
| P-2 | Minor | Rechnung (Detail), Warnung «Abrechnungen nicht aktuell» | Die Warnung nennt nicht, welche Abrechnungen betroffen sind. Nachdem ich Kevin Fischers Abrechnung berichtigt hatte, stand dieselbe Warnung unverändert da. Ob sie noch wegen Laura Keller oder wegen etwas anderem erscheint, musste ich selbst herausfinden. Auch die verlinkte Liste der Abrechnungen markiert die betroffenen nicht. |
| P-3 | Minor | Rechnung (Detail), Warnung, und Abrechnung (Detail), Hinweis «Rechnungen seit der Abrechnung geändert» | Der Text sagt «Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen»». Beide Abrechnungen waren aber «Bezahlt», nicht «Versendet». Das Bearbeitungsformular sagt richtig «Versendete oder bezahlte Abrechnungen». Bei einer bezahlten Abrechnung könnte man meinen, die Anweisung gelte für sie nicht. |

## Beobachtungen

- Die Warnung erscheint wie erwartet sofort nach dem Speichern, zusammen mit der Meldung «Rechnung von Kaminfeger Zurbuchen gespeichert» (Screenshot `07-after-save.png`: gelbe Box mit Warnsymbol, Titel, Link «Abrechnungen von Alpenblick ansehen», Erklärtext). Schon vor dem Speichern warnt das Formular «Rechnung schon abgerechnet» mit der Liste der Abrechnungen. Das ist gut.
- Nach beiden Berichtigungen ist die Warnung auf der Rechnung verschwunden. Sie bleibt also nicht stehen, und die Abrechnungsperiode ist korrekt als erledigt erkannt. Im Zwischenzustand (nur 0002 ersetzt, noch keine berichtigte erstellt) und nach der ersten Berichtigung blieb sie zu Recht stehen.
- Die Warnung verschwindet, obwohl die berichtigten Abrechnungen erst Entwürfe sind (PDF noch nicht erstellt, nicht versendet). Rechnerisch ist das richtig. Ein Hinweis, dass die Mieter noch nichts erhalten haben, fehlt aber auf der Rechnungsseite. Die Abrechnung selbst zeigt «Status: Entwurf».
- Der Weg Warnung → Liste → Abrechnung → «Abrechnung berichtigen» → Dialog → «Berichtigte Abrechnung erstellen» war verständlich. Der Link führt auf eine Liste, die auf Alpenblick und die Periode 2024 gefiltert ist. Die Abrechnung zeigt «Rechnungen seit der Abrechnung geändert» mit Knopf direkt daneben. Der Dialog nennt den angerechneten Betrag (CHF 29.80, zurückerstattet am 05.05.2025) und sagt, dass es sich nicht rückgängig machen lässt. Dass es zwei Schritte sind (erst ersetzen, dann erstellen), sagt der Dialog («Danach können Sie … die berichtigte Abrechnung erstellen»). Ein Zwischenzustand «Ersetzt» ohne Nachfolger ist trotzdem möglich, wenn man nach dem ersten Schritt abbricht.
- Die Abrechnung meldet nur «1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht», ohne die Rechnung zu nennen.
- Nachgerechnet: Kevin Fischer (38.43 %): Kaminfeger 111.45 → 119.14, Nebenkosten 2'970.20 → 2'977.89, Akonto 3'000.00, bereits zurückerstattet 29.80. Nachzahlung 7.69, gerundet 7.65. Laura Keller (28.24 %, mit 3 % Verwaltungspauschale): Nebenkosten 2'247.66 → 2'253.48, Akonto 2'280.00, bereits zurückerstattet 32.35. Nachzahlung 5.83, gerundet 5.80. Beide stimmen.
- Kevins berichtigte Abrechnung zeigt «Als versendet markieren», Lauras «Per E-Mail senden», obwohl bei Kevin eine E-Mail-Adresse hinterlegt ist. Den Grund habe ich nicht geprüft.
- Das Bearbeitungsformular listet nach dem Berichtigen auch die ersetzten Abrechnungen unter «In Abrechnungen enthalten» und sagt «Ändern Sie diese Rechnung, stimmen diese Abrechnungen nicht mehr». Für ersetzte Abrechnungen ist das ohne Belang.
- Der Verjährungshinweis (Art. 128 Ziff. 1 OR) steht wortgleich in der Warnung, im Hinweis auf der Abrechnung und im Dialog, auf einem Weg also dreimal.

## Aufgabe geschafft: ja

## Aufwand

Etwa 12 Minuten, rund 14 Schritte: Rechnungsliste filtern, Rechnung öffnen, bearbeiten, speichern, Warnung lesen, Liste öffnen, je Abrechnung öffnen, berichtigen, bestätigen und berichtigte erstellen (2 × 4), Rechnung erneut öffnen.

## Ablauf

- Rechnung nach der ersten Berichtigung (Kevin) geöffnet. Erwartet: Die Warnung nennt, dass noch NK-…-0001 von Laura Keller fehlt. Gesehen: derselbe allgemeine Text wie vorher (P-2).
- Rechnung nach beiden Berichtigungen geöffnet. Erwartet: Die Seite sagt, dass die Rechnung in den berichtigten Abrechnungen 0003 und 0004 mit CHF 310.00 abgerechnet ist. Gesehen: keine Warnung mehr, aber vier gleichrangige Einträge mit Status, ohne «berichtigt» oder Betrag (P-1).
- Hinweistext bei bezahlten Abrechnungen. Erwartet: eine Anweisung für bezahlte Abrechnungen. Gesehen: «Versendete Abrechnungen berichtigen Sie …» (P-3).

## Vorschläge

- **P-1:** Rechnung 2024 von Alpenblick ändern, beide Abrechnungen 2024 berichtigen und berichtigte erstellen, Rechnung öffnen. Hilfreich wäre, ersetzte Abrechnungen von den gültigen zu trennen, etwa als «Berichtigte Abrechnung, ersetzt NK-…-0002» oder mit einer eigenen Zeile «Früher abgerechnet in (ersetzt)». Dazu ein kurzer Satz, dass die gültigen Abrechnungen den aktuellen Stand der Rechnung enthalten.
- **P-2:** Rechnung ändern, nur eine der beiden Abrechnungen berichtigen, Rechnung öffnen. Hilfreich: In der Warnung die betroffenen Abrechnungen nennen (Nummer, Mieter), am besten als Links direkt zur Abrechnung.
- **P-3:** Rechnung einer Periode mit bezahlten Abrechnungen ändern, Rechnung oder Abrechnung öffnen. Hilfreich: «Versendete oder bezahlte Abrechnungen berichtigen Sie …», wie im Bearbeitungsformular.

## Nicht geprüft

- PDF der berichtigten Abrechnungen nicht erstellt und nicht gelesen: nicht Teil der Aufgabe, die Entwürfe sollten nicht weiter verändert werden.
- Der Weg über «Neu berechnen» bei Entwürfen: In Alpenblick 2024 gab es keine Entwürfe.
- «Nicht berichtigen» nicht ausprobiert: Ich wollte beide Abrechnungen berichtigen.
- Mobile Ansicht und Tastaturbedienung: nicht Teil von Dr. Webers Profil.
