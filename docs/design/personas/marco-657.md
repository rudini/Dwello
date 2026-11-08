# Marco, #657: Anmelden, Kopfzeile, Hilfe und Sprache auf dem Handy

Persona: Marco, 38, Handy, wenig Zeit. Geräte: 390 × 844 (Touch) und 360 × 740 (kleines Android). Nichts gespeichert ausser der Sprachwahl, die die Aufgabe verlangt; am Ende steht Dwello wieder auf Deutsch.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Kopfzeile (angemeldet, 360 und 390 px) | Die Sprachwahl ist auf dem Handy nur im Menü (☰) zu finden, ganz oben über «Hilfe». Ich habe sie zuerst hinter dem Personen-Symbol (Benutzermenü) und dann unter «Einstellungen» gesucht: an beiden Orten fehlt sie, und es gibt keinen Hinweis, wo sie ist. Abgemeldet steht sie dagegen direkt oben rechts in der Kopfzeile. |

## Beobachtungen

- Anmelden (abgemeldet, ohne Cookie): Auf 390 × 844 passt alles ohne Scrollen auf den Bildschirm (Seitenhöhe = Bildschirmhöhe 844). Auf 360 × 740 steht «Mit Google anmelden» bei y 465–513, gut sichtbar; nur die Fusszeile («© 2026 Dwello Version unbekannt», Datenschutz, Nutzungsbedingungen) liegt unterhalb (Seite 835 px hoch). Zum Anmelden muss ich nicht scrollen.
- «Mit Google anmelden» ist nur umrandet, nicht gefüllt. Es ist die einzige Aktion der Seite, sieht aber wie ein Nebenknopf aus. Ich habe ihn trotzdem sofort gefunden.
- Auf Französisch bricht «Se connecter avec Google» bei 360 px auf zwei Zeilen um (Knopf 52 px hoch). Das sieht etwas gedrängt aus, ist aber gut lesbar.
- In der Fusszeile der Anmeldeseite steht «Version unbekannt». Als Nutzer verstehe ich nicht, was mir das sagen soll.
- Kopfzeile angemeldet: Bei 390 und 360 px stehen dort nur Menü (☰, 48 × 48), «Dwello» und das Personen-Symbol (48 × 48, rechter Rand bei 374 bzw. 344 px). Nichts ragt hinaus, nichts wird abgeschnitten, keine Seitwärts-Scrollleiste (scrollWidth = Bildschirmbreite). Auf Französisch («Ouvrir le menu», «Menu utilisateur») ist es gleich.
- Hilfe über ☰: Das Menü geht als Schublade von links auf. «Hilfe» ist der erste Eintrag, mit Fragezeichen-Symbol. Ein Tipp führt zu /help. Dort gibt es oben eine Sprungliste; «Nebenkostenabrechnungen erstellen» springt zum richtigen Abschnitt (/help#statements), und die Überschrift steht oben im Bild. Der Text erklärt die fünf Schritte, Entwurf, Versand und Zahlungsfrist kurz und verständlich.
- Im Hilfetext steht «nach Mietstagen ab». Gemeint ist wohl «Miettagen». Das ist ein Tippfehler.
- Sprachwahl im Menü: Nach dem Tippen auf «Deutsch» öffnet sich eine Liste (Deutsch ✓, Français, Italiano, English) mit grossen Zielen. Nach «Français» schliesst die Schublade, die Übersicht steht sofort auf Französisch (lang=fr) und bleibt es auch nach dem Neuladen. Zurück über ☰ → «Langue : Français» → «Deutsch» geht genauso schnell. Das Sprachsymbol (文A) mit dem Namen der Sprache erkenne ich auch, wenn ich die Sprache nicht verstehe.
- Abgemeldet setzt die Sprachwahl auf der Anmeldeseite nur ein Cookie `PARAGLIDE_LOCALE` (gelesen in den Cookies des Browsers).

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten, rund 14 Tipps: Anmeldeseite 0 (nur schauen), Kopfzeile 0, Hilfe 3 (☰, Hilfe, Sprunglink), Sprache 7 (Benutzermenü und Einstellungen als Umweg, dann ☰, Sprache, Français; ☰, Langue, Deutsch).

## Ablauf

- Sprache wechseln: Ich erwartete die Sprache im Personen-Menü oben rechts, weil sie dort auf der Anmeldeseite stand. Dort sind nur E-Mail, «Einstellungen» und «Abmelden». Unter «Einstellungen» gibt es auch keine Sprache. Gefunden habe ich sie erst im ☰-Menü, ganz oben.

## Vorschläge

- P-1: Angemeldet, 360 × 740, /dashboard → Personen-Symbol antippen: keine Sprachwahl. «Einstellungen» öffnen: keine Sprachwahl. ☰ öffnen: Sprachwahl oben in der Schublade. Hilfreich wäre die Sprachwahl auch im Benutzermenü, also dort, wo sie abgemeldet oben rechts stand, oder ein Eintrag «Sprache» unter «Einstellungen», der auf die Sprachwahl verweist.

## Nicht geprüft

- Die echte Anmeldung mit Google: Im Persona-Stack gibt es kein OAuth. Ich habe nur geprüft, ob der Knopf ohne Scrollen sichtbar ist.
- Italienisch und Englisch habe ich nicht durchgeklickt, nur Französisch und zurück, wie verlangt.
- Querformat und Systemschrift mit 200 % auf dem Handy: nicht Teil der Aufgabe.
