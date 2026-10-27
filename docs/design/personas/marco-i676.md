# Marco: Fusszeile mit Versionsnummer (#676), zweite Runde

Marco, 38, Smartphone 390 × 844, Touch; zusätzlich 360 × 780, 320 × 640, Querformat 844 × 390 und einmal Desktop 1440 × 900. Persona-App http://localhost:3300 (Demodaten, Build mit «0.12.0+123-gabcdef1»). Seiten: Übersicht (Dashboard), Gebäude, Gebäude «Musterhaus Zentrum», Einstellungen. Nur angeschaut, nichts gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde an der Fusszeile. |

## Beobachtungen

- Die Fusszeile zeigt jetzt auf allen vier Seiten und in allen fünf Grössen «© 2026 Dwello · Version 0.12.0+123-gabcdef1», darunter bzw. daneben «Datenschutz» und «Nutzungsbedingungen». Der Fehler aus der ersten Runde («Version unbekannt», `marco-i676-1.md`, P-1) ist behoben.
- 390 px und Querformat 844 px: alles auf einer Zeile, die Nummer endet bei 362 px, also innerhalb des Bildschirms. Auf dem Screenshot gut lesbar.
- 360 px und 320 px: die Zeile bricht nach «© 2026 Dwello ·» um, «Version 0.12.0+123-gabcdef1» steht geschlossen auf der zweiten Zeile (gemessen: eine einzige Zeile, von 16 bis 234 px). Die Nummer wird nie getrennt. Der Mittelpunkt bleibt am Ende der ersten Zeile hängen; sieht etwas verloren aus, stört mich aber nicht.
- Desktop 1440 px: Version links, die zwei Links rechts, alles auf einer Zeile.
- Die Fusszeile ist nie breiter als der Bildschirm: ihr rechter Rand und der ihres längsten Elements («Nutzungsbedingungen», endet bei 307 px) liegen bei 360 und 320 px innerhalb.
- Bei 360 px und 320 px ist die Seite trotzdem 369 px breit und lässt sich etwas seitlich schieben; im Screenshot bei 360 px ist das Symbol «Benutzermenü» oben rechts angeschnitten. Das kommt vom Kopf, nicht von der Fusszeile, und stand schon in der ersten Runde.

## Aufgabe geschafft: ja

## Aufwand

Rund 6 Minuten; 4 Seiten × 5 Grössen, dazu bei 360 und 320 px mit Wischen bis ganz nach unten gescrollt.

## Ablauf

- Fusszeile bei 320 px per Ausschnitt-Screenshot fotografiert: erwartet die ganze Fusszeile, gesehen nur «© 2026 Dwello ·», der Rest war abgeschnitten. Das lag an meinem Screenshot, nicht an der App: Als ich wie mit dem Finger ganz nach unten gewischt habe, standen Version und Links vollständig da.

## Vorschläge

Keine Befunde, daher keine Vorschläge.

## Nicht geprüft

- Dunkelmodus und andere Sprachen: nicht Teil der Aufgabe.
- Echtes Gerät mit Schriftvergrösserung des Systems: im Browser des Persona-Kits nicht einstellbar.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ad862b70-2b73-562f-beb6-23e157e4abea/scratchpad/marco-i676-2/`.
