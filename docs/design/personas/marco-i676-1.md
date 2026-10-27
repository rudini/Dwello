# Marco: Fusszeile mit Versionsnummer (#676)

Marco, 38, Smartphone 390 × 844, Touch; zusätzlich 360 × 780, Querformat 844 × 390 und einmal Desktop 1440 × 900. Persona-App http://localhost:3300 (Demodaten). Nur angeschaut, nichts gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Blocker | Fusszeile, alle Seiten (Dashboard, Gebäude, Gebäude «Musterhaus Zentrum», Einstellungen), alle Grössen | Statt «Version 0.12.0+123-gabcdef1» steht überall «© 2026 Dwello · Version unbekannt». Die Versionsnummer, die ich prüfen sollte, sehe ich nirgends. Schon die Antwort des Servers auf `/dashboard` enthält «Version unbekannt»; es liegt also nicht an meinem Handy. Ob der Fehler im Build der Persona-App liegt oder in der Änderung, kann ich als Nutzer nicht unterscheiden. |

## Beobachtungen

- Ausser der falschen Version ist die Fusszeile sauber: Bei 390 px, im Querformat und auf dem Desktop stehen «© 2026 Dwello · Version unbekannt» auf einer Zeile und darunter (Desktop: rechts daneben) «Datenschutz» und «Nutzungsbedingungen». Schrift 16 px, gut lesbar. Kein Element der Fusszeile ragt über den Rand.
- **Hilfsprüfung, nicht als Nutzer:** Weil die echte Nummer fehlte, habe ich im Browser den Text «Version unbekannt» testweise durch «Version 0.12.0+123-gabcdef1» ersetzt (nur in meinem Fenster, nichts gespeichert). Ergebnis auf der Gebäude-Seite:
  - 390 px, 844 px quer, 1440 px: alles auf einer Zeile, die Nummer endet bei 362 px bzw. weit vor dem Rand.
  - 360 px und 320 px: die Zeile bricht nach «© 2026 Dwello ·» um, «Version 0.12.0+123-gabcdef1» steht geschlossen auf der zweiten Zeile, nie in der Nummer getrennt. Der Mittelpunkt bleibt am Ende der ersten Zeile hängen; sieht etwas verloren aus, stört aber nicht.
  - Die Fusszeile selbst ist nie breiter als der Bildschirm.
  Das ersetzt keine Prüfung mit der echten Nummer aus dem Build.
- Bei 360 px (auch 320 px) lässt sich jede Seite um 9 px seitlich schieben. Ursache ist nicht die Fusszeile, sondern der Kopf: das Symbol «Benutzermenü» rechts oben endet bei 369 px und ist im Screenshot rechts angeschnitten. Gilt auf Dashboard, Gebäude, Einstellungen und Datenschutz.
- Gebäude-Liste bei 360 px: der Knopf «Route planen (öffnet in neuem Tab)» bricht in zwei Spalten zu je zwei Zeilen um («Route / planen» neben «(öffnet in / neuem Tab)»), wirkt zerrissen.
- Auf dem Handy finde ich «Einstellungen» nur über «Menü öffnen» oben links; ging, aber nicht auf den ersten Blick.

## Aufgabe geschafft: teilweise

Seiten geöffnet, Fusszeile in allen Grössen geprüft; die eigentliche Versionsnummer 0.12.0+123-gabcdef1 wird aber nicht angezeigt (P-1).

## Aufwand

Rund 10 Minuten, 4 Seiten × 4 Bildschirmgrössen, dazu eine Hilfsprüfung mit 5 Grössen.

## Ablauf

- Gebäude-Seite über die Adresse `/gebaeude` aufgerufen: erwartet die Gebäudeliste, gesehen eine «nicht gefunden»-Seite. Über die Kachel «3 Gebäude» im Dashboard kam ich auf `/buildings`.
- Fusszeile Dashboard 390 px: erwartet «© 2026 Dwello · Version 0.12.0+123-gabcdef1», gesehen «© 2026 Dwello · Version unbekannt». Gleich auf Gebäude, Gebäude-Detail, Einstellungen, bei 360 px, quer und auf dem Desktop.
- 360 px: erwartet kein seitliches Scrollen, gesehen 9 px seitlich verschiebbar (Benutzermenü im Kopf, siehe Beobachtungen).

## Vorschläge

- **P-1:** Persona-App öffnen (gebaut mit `0.12.0+123-gabcdef1`), Dashboard, ganz nach unten scrollen: dort steht «Version unbekannt». Prüfen, ob die Version beim Build der Persona-App wirklich mitgegeben wurde bzw. ob der Server sie zur Laufzeit liest; danach mit der echten Nummer erneut prüfen lassen (vor allem 360 px und 320 px).

## Nicht geprüft

- Die echte Versionsnummer in der Fusszeile: die App zeigt sie nicht (P-1). Ich habe 4 Seiten in 4 Grössen geöffnet und die Serverantwort angesehen; überall «Version unbekannt». Die Darstellung der langen Nummer nur per Textersatz im eigenen Browser geprüft (siehe Beobachtungen).
- Dunkelmodus und andere Sprachen: nicht Teil der Aufgabe.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ad862b70-2b73-562f-beb6-23e157e4abea/scratchpad/marco-i676/`.
