# Marco – Issue #135: Hinweis «schon abgerechnet» im Abrechnungs-Assistenten, Schritt 2

Persona: Marco, 38, auf dem Smartphone (390 × 844, Touch, 100 %). App: Persona-App auf http://localhost:3300 mit Demodaten. Nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/marco-issue-135/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungen erstellen, Schritt 2 «Gebäude» | Der neue Satz steht in einer nur 159 px schmalen Textspalte (die Karte ist 308 px breit, rechts sitzt «N Wohnungen»). Er bricht auf 8 Zeilen um, «Abrechnungsperiode» steht allein auf einer Zeile; die Karte von Seepark Residenz wird 384 px hoch, die von Musterhaus Zentrum 408 px. Auf meinem Handy passt so knapp eine Gebäudekarte auf den Bildschirm. |
| P-2 | Minor | Abrechnungen erstellen, Schritt 2 «Gebäude» | Der neue Satz sieht genau gleich aus wie die Zeile «15 Rechnungen in der Abrechnungsperiode» (gleiche graue Schrift, 16 px). Der Hinweis «Keine Rechnungen in der Abrechnungsperiode erfasst» bei einem anderen Gebäude ist dagegen farbig und fett hervorgehoben. Ausgerechnet die wichtigste Information («Für dieses Gebäude entsteht keine neue.») fällt beim Überfliegen also nicht auf. |

Nicht bemängelt (geprüft, in Ordnung):
- **Kein seitliches Scrollen:** `scrollWidth` der Seite = 390 = Breite des Bildschirms. Der neue Satz bleibt ganz innerhalb der Kartenränder; kein Wort ist abgeschnitten.
- **Lesbar:** 16 px, Zeilenhöhe 24 px, dunkelgrau auf Weiss (rgb 63,74,84), also kontrastreich genug. Lesbar ist der Satz, nur lang (siehe P-1).
- **Antippen:** Die ganze Karte bleibt eine einzige Tippfläche. Wenn ich mitten auf den neuen Satz tippe, wird Seepark Residenz angekreuzt; ein Tipp in die obere rechte Ecke der Karte nimmt das Häkchen wieder weg. Der Zähler oben wechselt mit («1 von … gewählt»). Weil die Karte durch den Satz höher geworden ist, ist sie eher noch leichter zu treffen.

## Beobachtungen

- **«N Wohnungen» ragt über den rechten Kartenrand hinaus:** «Wohnungen» steht etwa 15 px ausserhalb des Rahmens (Kartenrand bei x = 349, Text bis x = 365), die Zahl steht eine Zeile darüber. Das sieht man auch bei Alpenblick, wo der neue Satz fehlt. Es kommt also nicht vom neuen Satz, aber diese Spalte nimmt dem Satz den Platz weg (P-1). Ein Tipp auf den überstehenden Teil kreuzt die Karte trotzdem an.
- **Gebäude ohne neue Abrechnungen bleiben wählbar:** Seepark Residenz und Musterhaus Zentrum bleiben wählbar, und «Alle Gebäude» kreuzt sie ebenfalls an (Screenshot `07-all-selected.png`: alle Karten blau hinterlegt). Was dann in Schritt 3 bis 5 passiert, habe ich nicht angeschaut.
- **Automatisch gesichert:** Der Assistent zeigt nach dem Ankreuzen «Entwurf gespeichert, 14:19». Gespeichert habe ich nicht selbst. Danach habe ich alles wieder abgewählt; beim nächsten Öffnen begann der Assistent bei Schritt 1 mit «0 von 3 gewählt».
- **Kopfzeile auf ganzseitigen Screenshots:** Die fixierte Kopfzeile steht dort mitten auf der Seite, und Brotkrümelnavigation und Titel liegen darüber (`03-step2-full.png`). Im normalen Bildschirmausschnitt (`05-viewport-seepark.png`) ist alles in Ordnung; das kommt wohl vom Screenshot und ist kein Fehler der App.
- **Fremdes Gebäude «Anna Testhaus»:** Es tauchte zwischendurch auf (eine andere Persona hat es angelegt). Ich habe es nicht bewertet.

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten, 3 Taps bis Schritt 2 (Übersicht › «Abrechnungen erstellen» › «Weiter»), dann Scrollen über drei Karten (die Seite ist auf dem Handy etwa 2000 px lang).

## Ablauf

1. **Übersicht öffnen.** Erwartet: ein Weg zu den Abrechnungen. Gesehen: Die Karte «Nebenkostenabrechnungen erstellen» nennt «Noch nicht abgerechnet: Alpenblick» und hat einen Link «Abrechnungen erstellen». Passt.
2. **«Abrechnungen erstellen» antippen.** Erwartet: die Periode 2025 ist vorgeschlagen. Gesehen: Schritt 1 von 5 mit Beginn 01.01.2025 und Ende 31.12.2025, mit Erklärung «Vorgeschlagen ist die letzte abgelaufene Abrechnungsperiode». Passt.
3. **«Weiter».** Erwartet: Gebäude, und zwar so, dass ich sehe, welche schon abgerechnet sind. Gesehen: drei Karten. Bei Alpenblick steht nur «6 Rechnungen in der Abrechnungsperiode». Bei Seepark Residenz und Musterhaus Zentrum steht zusätzlich «Alle 4 Mietverträge haben schon eine Abrechnung, die in diese Abrechnungsperiode fällt. Für dieses Gebäude entsteht keine neue.» Der Inhalt stimmt mit dem überein, was ich erwartet habe. Aber der Satz ist ein langer schmaler Textblock (P-1) und sieht aus wie die Rechnungszeile (P-2).
4. **Breite prüfen.** Erwartet: nichts ragt seitlich hinaus. Gesehen: Die Seite scrollt nicht seitlich, der neue Satz bleibt in der Karte. Nur «Wohnungen» steht über den Rand (Beobachtung, schon vorher so).
5. **Auf den Satz tippen.** Erwartet: die Karte wird angekreuzt. Gesehen: ja, das Häkchen erscheint und der Zähler wechselt. Ein Tipp in die Ecke nimmt es wieder weg.
6. **«Alle Gebäude» antippen.** Erwartet: vielleicht ein Hinweis, dass zwei Gebäude nichts ergeben. Gesehen: alle Karten sind angekreuzt, es kommt kein weiterer Hinweis. Danach habe ich alles wieder abgewählt.

## Verwirrung

- «… haben schon eine Abrechnung, **die in diese Abrechnungsperiode fällt**»: Unterwegs habe ich kurz überlegt, ob «fällt» bedeutet «liegt ganz darin» oder «überschneidet sich». Für mich reicht es zu wissen, dass schon abgerechnet ist. Der Nebensatz macht den Satz lang, ohne mir beim Entscheiden zu helfen.
- «Keine neue»: Gemeint ist eine neue Abrechnung. Beim ersten Lesen musste ich zurück zum Satzanfang, um das zu verstehen.

## Fehlerrisiken

- Mit P-2 tippe ich schnell auf «Alle Gebäude» und merke nicht, dass zwei von drei Gebäuden nichts ergeben. Ich erwarte dann vielleicht mehr Entwürfe, als entstehen.
- Weil die Karten so lang sind (P-1), scrolle ich an Alpenblick vorbei, dem einzigen Gebäude, um das es eigentlich geht.

## Vorschläge

- **P-1:** So kann man es nachstellen: Handy 390 px, Übersicht › «Abrechnungen erstellen» › «Weiter»; die Karte Seepark Residenz ist 384 px hoch, und der Satz geht über 8 Zeilen in einer Spalte von 159 px. Helfen würde, wenn der Satz unter Zahl und «Wohnungen» über die ganze Kartenbreite laufen dürfte, oder wenn «N Wohnungen» auf dem Handy unter die Adresse rutscht statt eine eigene Spalte zu belegen. Ausserdem ginge es kürzer, etwa «Alle 4 Mietverträge sind schon abgerechnet. Es entsteht keine neue Abrechnung.»
- **P-2:** Gleich nachzustellen; die Zeile «Für dieses Gebäude entsteht keine neue.» mit der farbigen Zeile «Keine Rechnungen in der Abrechnungsperiode erfasst» vergleichen (`07-all-selected.png`). Helfen würde dieselbe Hinweis-Hervorhebung wie bei «Keine Rechnungen …», also Farbe zusammen mit fetter Schrift und Wortlaut, damit die Information nicht nur an der Farbe hängt.

## Nicht geprüft

- Schritte 3 bis 5 und das Ergebnis nach einer Wahl von Seepark Residenz oder Musterhaus Zentrum: Laut Auftrag sollte ich nichts speichern und nur Schritt 2 bewerten.
- Eine Periode, in der nur ein Teil der Mietverträge abgerechnet ist (also der Satz «X von Y …»): Mit den Demodaten von 2025 kommt dieser Fall nicht vor, und eine andere Periode habe ich nicht ausprobiert.
- Dunkelmodus und andere Sprachen: nicht Teil des Auftrags.
