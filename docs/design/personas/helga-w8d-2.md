# Helga – Abrechnung per Brief zustellen, Runde 2 (w8d)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. App: http://localhost:3300, frische Demodaten, Deutsch. Gespeichert nur in «Seepark Residenz» (Abrechnung NK-22222222-2025-0001, Thomas Weber).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/a03dd604-a526-53bc-afb7-d81a674ad4a0/scratchpad/persona-helga-2/`

Geprüft wurde nur, was sich seit Runde 1 geändert hat: P-1 (falscher Kanal im Brief-Dialog) und P-5 (wer stellt den Brief zu).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde zu den geänderten Stellen. P-1 und P-5 aus Runde 1 sind behoben (siehe Ablauf, Schritte 4 und 5). |

## Beobachtungen

- Der Dialogtext sagt «Stellen Sie dem Mieter das PDF zu». Dass ich es ausdrucken und auf die Post bringen muss, steht nicht wörtlich da. Mit «Per Brief, Seeweg 15, 6003 Luzern» direkt darunter verstehe ich es aber. Für mich reicht das.
- Die Adresse im Dialog stimmt mit der «Korrespondenzadresse» auf der Mieterseite überein (Seeweg 15, 6003 Luzern).
- Nach dem Markieren steht im Verlauf weiterhin nur «Versendet 17.10.2026», ohne «per Brief» und ohne Uhrzeit. Auf der Mieterseite stand vorher «Noch keine Dokumente». Das sind P-2 und P-7 aus Runde 1, nicht Teil dieser Runde.
- Die Warnung «Abrechnung nicht versendet» ist ein `status`-Bereich, der Knopf liegt darin. Auf der Seite gibt es daneben noch einen leeren `status` (wie in Runde 1).
- Beim Bestätigen gingen zwei POST an `?/send` (der neue E-Mail-Versuch und das Markieren), beide 200. Das ist der Weg, den ich selbst gegangen bin.

## Aufgabe geschafft: ja

Die E-Mail an Thomas Weber ging wieder nicht durch. Über «Selbst per Brief zustellen» habe ich die Abrechnung als versendet markiert. Status jetzt «Versendet», Meldung «Abrechnung als versendet markiert».

## Aufwand

Etwa 4 Minuten. Abrechnung öffnen → «Per E-Mail senden» → im Dialog «Per E-Mail senden» → Warnung → «Selbst per Brief zustellen» → «Als versendet markieren» (5 Klicks).

## Ablauf

1. **Entwürfe** (`02-entwuerfe.png`). Erwartet: Thomas Weber in der Liste. Gesehen: «Thomas Weber NK-22222222-2025-0001», Rückerstattung CHF 34.60, Entwurf.
2. **E-Mail-Dialog** (`04-mail-dialog.png`). Erwartet: wie in Runde 1. Gesehen: «Korrespondenzkanal: Per E-Mail, thomas.weber@abgewiesen.dwello.test». Hier stimmt das, es ist ja der E-Mail-Dialog.
3. **Warnung nach dem Senden** (`05-warnung.png`). Erwartet: gelbe Warnung mit einem Brief-Knopf. Gesehen: «Abrechnung nicht versendet. Die E-Mail wurde nicht zugestellt. …» und den Knopf «Selbst per Brief zustellen». Das Wort «Selbst» sagt mir sofort: Das mache ich, nicht Dwello. In Runde 1 hiess der Knopf «Per Brief zustellen» und ich dachte, Dwello schickt den Brief. Behoben (P-5).
4. **Brief-Dialog** (`06-brief-dialog.png`, `06-brief-dialog-nur.png`). Erwartet: Brief als Kanal und die Postadresse. Gesehen: Titel «Abrechnung als versendet markieren», «Dwello verschickt die Abrechnung nicht selbst. Stellen Sie dem Mieter das PDF zu und markieren Sie die Abrechnung danach als versendet.», «Stellen Sie das PDF deshalb am selben Tag zu.», dann «Empfänger: Thomas Weber», «Korrespondenzkanal: Per Brief, Seeweg 15, 6003 Luzern», «PDF ansehen (öffnet in neuem Tab)», «Abbrechen», «Als versendet markieren». Kein Widerspruch mehr, keine E-Mail-Adresse, die Adresse zum Anschreiben steht da. Behoben (P-1). Knopf und Dialog sagen jetzt beide, dass ich den Brief selbst zustelle (P-5).
5. **Adresse geprüft** (`08-thomas-mieter-vorher.png`). Auf der Mieterseite: «Korrespondenzadresse Seeweg 15 6003 Luzern». Gleich wie im Dialog.
6. **Bestätigt** (`07-nach-bestaetigen.png`). Erwartet: Status «Versendet» und eine Bestätigung. Gesehen: Meldung «Abrechnung als versendet markiert», «Status: Versendet», Warnung weg, im Verlauf «Versendet 17.10.2026».

## Verwirrung

- «Korrespondenzkanal» bleibt für mich ein schwieriges Wort. Mit «Per Brief, Adresse» dahinter verstehe ich aber, was gemeint ist.

## Fehlerrisiken

- Ich markiere als versendet und bringe den Brief erst morgen zur Post. Der Dialog warnt «am selben Tag», das hilft.
- Später sehe ich auf der Abrechnung nicht, dass es ein Brief war (P-2 aus Runde 1, nicht in dieser Runde geprüft).

## Vorschläge

Keine Befunde in dieser Runde. Nur als Idee, ohne Schwere: Im Brief-Dialog «Drucken Sie das PDF aus und schicken Sie es per Post an die Adresse unten» statt «Stellen Sie dem Mieter das PDF zu». Für Leute wie mich wäre das noch eindeutiger.

## Nicht geprüft

- Den Dialog bei 200 % Zoom: Nach dem Bestätigen ist die Abrechnung versendet, der Dialog lässt sich nicht mehr öffnen, und andere Abrechnungen sollte ich nicht ändern.
- P-2, P-3, P-4, P-6, P-7 aus Runde 1: nicht Teil dieser Aufgabe. Im Verlauf habe ich nur nebenbei gesehen, dass P-7 (keine Uhrzeit) und der fehlende Hinweis «per Brief» (P-2) noch da sind.
- Den Inhalt des PDFs habe ich nicht gelesen.
