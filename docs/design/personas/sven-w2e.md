# Sven: bezahlte Abrechnung berichtigen (Dialog) und Status «Ersetzt»

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, Zoom 100 %. Bewertet habe ich den Barrierefreiheitsbaum (Playwright-Snapshot und der Baum von Chromium über CDP), den Tastaturfokus nach jedem Tab und die Netzwerkanfragen. Gespeichert habe ich nichts. Den Dialog habe ich einmal mit «Abbrechen» und einmal mit Escape geschlossen. Es wurde keine einzige Anfrage ausser GET gesendet.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/75e5ca16-73bb-53c3-8081-5e81a17d9c45/scratchpad/sven-w2e/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung im Status «Ersetzt» (NK-33333333-2024-0001) | Die Überschrift «Weitere Aktionen» (Ebene 2) wird angesagt, aber darunter steht nichts. Ich springe zu dieser Überschrift und lande direkt bei «Verlauf». |
| P-2 | Minor | Abrechnungsliste | Ersetzte Abrechnungen lassen sich nicht gezielt finden. Im Filter «Nach Status filtern» gibt es kein «Ersetzt». Die Zahlen 10 + 1 + 6 + 0 = 17 passen nicht zu «20 Abrechnungen». Den Status «Ersetzt» höre ich in jeder Zeile nur als losen Text nach dem Betrag. |
| P-3 | Nit | Bestätigungsdialog «Abrechnung berichtigen» | Ich löse «Abrechnung berichtigen» aus, bestätigen soll ich aber mit «Abrechnung ersetzen». Für dieselbe Handlung höre ich zwei Verben. Ausserdem kommt der Satz «Das lässt sich nicht rückgängig machen.» erst ganz am Ende der langen Beschreibung, nach dem Absatz über die Verjährung. |
| P-4 | Nit | Abrechnung im Status «Ersetzt» | Unter «Verlauf» stehen nur Erstellt, PDF erstellt, Versendet und Bezahlt. Wann die Abrechnung ersetzt wurde, höre ich nirgends. |

## Beobachtungen

- Der Dialog ist sauber gebaut. Er hat `role=dialog` und `aria-modal=true`. Sein Name ist «Abrechnung berichtigen», seine Beschreibung der ganze Text (über `aria-describedby`). Im Baum von Chromium bleiben bei offenem Dialog nur `main`, der Dialog, seine Überschrift und die zwei Buttons übrig, der Hintergrund ist also wirklich stumm.
- Beim Öffnen liegt der Fokus auf «Abbrechen», der sicheren Wahl. Mit Tab und Shift+Tab wechselt der Fokus nur zwischen «Abbrechen» und «Abrechnung ersetzen» und verlässt den Dialog nicht.
- Nach «Abbrechen» und nach Escape ist der Dialog weg (auch aus dem DOM), und der Fokus steht wieder auf «Abrechnung berichtigen». So soll es sein.
- Der Dialogtext nennt die Folgen konkret: Die Nummer der alten Abrechnung, dass sie erhalten bleibt, und dass die CHF 29.80 angerechnet werden, die am 05.05.2025 zurückerstattet wurden.
- Bei der ersetzten Abrechnung höre ich gleich nach der Überschrift «Status: Ersetzt», dann «Diese Abrechnung ist ersetzt» und dann den Link «Ersetzt durch NK-33333333-2024-0003». Dieser Link ist das erste Ziel in `main` nach «PDF herunterladen». Die neue Abrechnung verweist mit dem Link «Ersetzt die Abrechnung NK-33333333-2024-0001 vom 14.04.2025» zurück und nennt «Bereits zurückerstattet auf NK-33333333-2024-0001». Die Verweise in beide Richtungen sind gut.
- Der Hinweis «Diese Abrechnung ist ersetzt» ist ein normaler Absatz, weder Überschrift noch Hinweisbereich. In der Lesereihenfolge kommt er früh genug, mit Überschriften-Navigation finde ich ihn aber nicht. Optisch ist er ein blauer Hinweiskasten mit Info-Symbol (Screenshot 09).
- Beim ersten Versuch drückte mein Skript Enter auf «Abrechnung berichtigen», bevor die Seite fertig geladen war. Es ging kein Dialog auf, und es kam auch keine Ansage. Ein Mensch drückt kaum so schnell 33 Mal Tab. Ich halte das nur fest.
- Nach einem Seitenwechsel (Liste Seite 2, Detailseite) steht der Fokus auf `body`. Das ist üblich, ich fange dann mit «Zum Inhalt springen» an.
- In den Demodaten steht unter «Verlauf» «Erstellt 17.10.2026», die Abrechnung wurde aber am 14.04.2025 versendet. Das liegt an den Demodaten.
- Andere Testpersonen hatten schon drei Abrechnungen ersetzt (Laura Keller, Thomas Weber, Hans Müller, alle 2024). Ich habe nur die von Laura Keller geöffnet.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten mit 10 Skriptläufen. Mit der Tastatur sind es 27 Tabs bis zur Zeile von Kevin Fischer (Liste «Bezahlt») und 33 Tabs bis «Abrechnung berichtigen» auf der Detailseite. Mit der Überschrift «Weitere Aktionen» sind es nur 2 Tabs. Ab der Liste sind es 46 Tabs bis «Nächste Seite» und dann 31 Tabs bis zur ersetzten Abrechnung.

## Ablauf

1. Übersicht → Link «9 Bezahlt». Erwartet: eine Liste der bezahlten Abrechnungen. Gesehen: «Nach Status filtern», darunter «9 Abrechnungen». Die erste Zeile ist der Link «Kevin Fischer NK-33333333-2024-0002», danach höre ich «Alpenblick, Wohnung OG1 …», «Rückerstattung CHF 29.80» und «Bezahlt». Passt.
2. Enter auf der Zeile. Erwartet: die Detailseite. Gesehen: Titel «Abrechnung NK-33333333-2024-0002 - Dwello», Überschrift auf Ebene 1, dann «Status: Bezahlt». Oben ist nur «Zahlung zurücksetzen». Wie man berichtigt, steht dort nicht. Ich habe es über die Überschriften gefunden: «Weitere Aktionen» → Button «Abrechnung berichtigen».
3. Enter oder Leertaste auf «Abrechnung berichtigen». Erwartet: eine Bestätigung, die die Folgen nennt. Gesehen: Der Dialog «Abrechnung berichtigen» wird mit seinem ganzen Text als Beschreibung angesagt, der Fokus steht auf «Abbrechen». Danach kommen 4 Absätze (ersetzt, bleibt erhalten, rechnet CHF 29.80 an / danach korrigieren und senden / Verjährung Art. 128 Ziff. 1 OR / nicht rückgängig zu machen) und die Buttons «Abbrechen» und «Abrechnung ersetzen».
4. Tab und Shift+Tab im Dialog. Erwartet: Der Fokus bleibt im Dialog. Gesehen: Er bleibt im Dialog, die beiden Buttons wechseln sich ab.
5. «Abbrechen» mit Enter, im zweiten Lauf Escape. Erwartet: Der Dialog geht zu, der Fokus kehrt zum Auslöser zurück, nichts wird gespeichert. Gesehen: So ist es, und es wurde keine Anfrage ausser GET gesendet.
6. Abrechnungsliste ohne Filter. Erwartet: ein Filter «Ersetzt». Gesehen: Es gibt keinen. Die Liste hat 2 Seiten. Auf Seite 2 höre ich bei drei Zeilen den Text «Ersetzt».
7. Enter auf «Laura Keller NK-33333333-2024-0001». Erwartet: eine deutliche Ansage, dass die Abrechnung nicht mehr gilt, und ein Weg zur neuen. Gesehen: «Status: Ersetzt», «Diese Abrechnung ist ersetzt», der Link «Ersetzt durch NK-33333333-2024-0003». Es gibt keine Buttons für Aktionen mehr, die Überschrift «Weitere Aktionen» ist aber leer (P-1). Im Verlauf steht kein Datum der Ersetzung (P-4).
8. Enter auf «Ersetzt durch …». Gesehen: Die neue Abrechnung im Status «Entwurf» mit dem Link zurück «Ersetzt die Abrechnung … vom 14.04.2025».

## Verwirrung

- Ich habe «berichtigen» gewählt und soll dann «ersetzen» bestätigen (P-3). Erst nach einem Moment habe ich verstanden, dass beides dasselbe ist: Die alte Abrechnung wird durch eine berichtigte ersetzt.
- «Sie bleibt unverändert erhalten» und kurz danach «Das lässt sich nicht rückgängig machen»: Beim ersten Hören klang das widersprüchlich. Gemeint ist, dass der Vorgang endgültig ist und nicht die alte Abrechnung.
- Was ist mit einer ersetzten Abrechnung, die schon bezahlt ist? Auf der ersetzten Seite steht weiterhin «Bezahlt am 05.05.2025» und «Sie erstatten dem Mieter CHF 32.35 zurück.». Das ist im Präsens formuliert, als stünde die Rückerstattung noch aus.

## Fehlerrisiken

- Der Bestätigungsbutton «Abrechnung ersetzen» liegt direkt nach «Abbrechen». Ein schnelles Tab und Enter löst also die endgültige Handlung aus. Abgefedert wird das dadurch, dass der Fokus anfangs auf «Abbrechen» steht.
- Wenn ich in der Liste eine ersetzte Abrechnung nicht als solche erkenne (der Status kommt erst nach dem Betrag), schicke ich vielleicht die falsche PDF.

## Vorschläge

- **P-1:** Bezahlte Abrechnung berichtigen lassen (oder eine bestehende «Ersetzt» öffnen), mit der Überschriften-Navigation zu «Weitere Aktionen» springen: Darunter ist nichts. Lösung: Bei einer ersetzten Abrechnung die Überschrift und die leere Karte weglassen.
- **P-2:** `/statements` öffnen und «Nach Status filtern» anhören: Es fehlt «Ersetzt», und die Summe der Filter passt nicht zur Gesamtzahl. Lösung: einen Filter «Ersetzt» hinzufügen, oder ersetzte Abrechnungen bei «Bezahlt» mitzählen. Den Status in den Namen des Zeilenlinks aufnehmen oder direkt nach dem Link sagen.
- **P-3:** Den Dialog öffnen und den Text bis zum Ende anhören. Lösung: Den Bestätigungsbutton gleich benennen wie den Auslöser, etwa «Abrechnung berichtigen», oder «Berichtigung starten». Den Satz zur Unumkehrbarkeit direkt nach dem ersten Satz bringen.
- **P-4:** Eine ersetzte Abrechnung öffnen und zu «Verlauf» springen. Lösung: einen Eintrag «Ersetzt am …» ergänzen.

## Nicht geprüft

- Das Bestätigen («Abrechnung ersetzen»), weil der Auftrag war, nichts zu speichern. Wie es nach dem Ersetzen angesagt wird und wohin der Fokus dann geht, habe ich deshalb nicht geprüft.
- Einen echten Screenreader (NVDA, VoiceOver). Bewertet habe ich den Barrierefreiheitsbaum von Chromium, wie es die Persona vorsieht. Ob der Inhalt einer `role=status`-Region angesagt wird, ist dort nicht zu hören.
- Die PDF der ersetzten Abrechnung. Ob sie als ersetzt gekennzeichnet ist, kann ich als Screenreader-Nutzer im Browser nicht prüfen.
- Die ersetzten Abrechnungen von Thomas Weber und Hans Müller. Ich habe nur eine geöffnet, wie es der Auftrag verlangt.
