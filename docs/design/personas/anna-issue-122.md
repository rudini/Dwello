# Persona Anna – Issue #122 (Tab-Icon / Favicon)

Persona: Anna, 29, Erstvermieterin, kommt nach Monaten zurück. Aufgabe (statt Standardaufgabe): Mit mehreren offenen Browser-Tabs die Übersicht auf einem Desktop-Fenster (1280 px) öffnen, in hellem und dunklem Farbschema; beurteilen, ob ich den Dwello-Tab am Icon finde und ob es zum Logo im Header passt (`/favicon.svg` bei 16 und 32 px neben dem Header-Logo). Nur angeschaut, nichts gespeichert.

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/anna-issue-122/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Browser-Tab (Favicon) | Das Icon richtet sich nach dem Farbschema des Betriebssystems, nicht nach dem der Tab-Leiste. Ist das System hell, der Browser aber dunkel (oder umgekehrt), ist das Haus kaum zu sehen: Dunkelblau `#1B5873` auf dunklem Tab `#35363a` ≈ 1.6:1, Hellblau `#86BFDA` auf weissem Tab ≈ 2.0:1. |
| P-2 | Nit | Browser-Tab (Favicon) | Bei 16 px ist das Haus nur ein dünner Umriss (Strich ca. 1.2 px). Neben gefüllten, farbigen Icons anderer Seiten (Mail, E-Banking) fällt er schwächer auf; ich finde ihn, muss aber kurz suchen. |

## Beobachtungen

- Fusszeile der Übersicht: «© 2026 Dwello · Version unbekannt». «Version unbekannt» wirkt für mich wie ein Fehler.
- Kachel «Gebäude und Wohnungen»: die Beschriftungen «Wiedervermietet» und «Leer» stossen bei 1280 px direkt aneinander («WiedervermietetLeer» liest sich wie ein Wort).
- «Abrechnungen erstellen» steht zweimal auf der Übersicht (Hauptknopf im «Nächster Schritt» und Kachel unter «Häufige Arbeiten»).
- Unter `/favicon.ico` und `/favicon.png` antwortet die App mit 404; es gibt nur das SVG (siehe «Nicht geprüft»).

## Aufgabe geschafft: ja

## Aufwand

ca. 15 Minuten, 6 Schritte (Übersicht hell, Übersicht dunkel, Header-Ausschnitte, nachgebaute Tab-Leiste hell/dunkel bei 16 und 32 px, Gegenprobe mit gemischtem Farbschema bei 1x und 2x Pixeldichte).

## Ablauf

1. **Übersicht öffnen (hell, 1280 × 800).** Erwartet: Tab mit Dwello-Icon und erkennbarem Titel. Gesehen: Weiterleitung auf `/dashboard`, Tab-Titel «Übersicht - Dwello», im Kopf der Seite genau ein Icon-Verweis `rel="icon"` auf `/favicon.svg` (`image/svg+xml`), Antwort 200. Bild `01-uebersicht-light.png`.
2. **Übersicht dunkel.** Erwartet: dasselbe, Icon heller. Gesehen: gleicher Titel, gleicher Icon-Verweis; Header-Logo hellblau. Bild `01-uebersicht-dark.png`.
3. **Header-Logo mit Favicon vergleichen.** Erwartet: dasselbe Haus in derselben Farbe. Gesehen: Das Favicon ist genau das Haus aus dem Header (gleiche Form, gleiche Strichstärke). Farbe hell: Header `rgb(27, 88, 115)` = Favicon `#1B5873`; dunkel: Header `rgb(134, 191, 218)` = Favicon `#86BFDA`. In `03-tabs-light-x1.png` / `03-tabs-dark-x1.png` stehen Favicon 16 px, 32 px und das Header-Logo nebeneinander: sie sehen gleich aus, nur verschieden gross. Passt.
4. **Tab finden zwischen anderen Tabs (nachgebaute Tab-Leiste, 16 px).** Erwartet: Ich erkenne Dwello am Icon, ohne den Titel zu lesen. Gesehen: Fünf Tabs (Mail mit rotem Umschlag, Dwello, E-Banking mit rotem Quadrat, Wetter mit gelbem Punkt, Neuer Tab mit Globus). Das blaue Haus ist eindeutig anders als die übrigen und erinnert mich an «meine Wohnungen». Hell gut lesbar, dunkel (hellblau auf dunkelgrau) ebenfalls gut. Es ist aber das zarteste Icon in der Leiste (P-2).
5. **32 px (z. B. Taskleiste, grosse Lesezeichen).** Erwartet: klar. Gesehen: klar und sauber, hell wie dunkel.
6. **Gegenprobe gemischtes Farbschema** (`04-mix-*.png`, 1x und 2x). Erwartet: Icon bleibt sichtbar. Gesehen: System hell + dunkle Tab-Leiste: dunkelblaues Haus auf dunkelgrau, fast unsichtbar. System dunkel + helle Tab-Leiste: hellblaues Haus auf weiss, blass. Passende Kombinationen sind gut (hell ≈ 7.8:1, dunkel ≈ 6.0:1) (P-1).

## Verwirrung

- Keine neuen Begriffe durch die Änderung. Das Haus-Symbol verstehe ich sofort als «Liegenschaften / Wohnungen».
- Ein Haus-Umriss ist ein sehr verbreitetes Symbol (Startseite-Knöpfe, Router-Oberflächen, Smart-Home-Apps). Neben solchen Tabs müsste ich wohl doch den Titel lesen.

## Fehlerrisiken

- Mit hellem System und dunklem Browser-Design (oder umgekehrt) sehe ich das Icon kaum und klicke mich durch die Tabs (P-1).
- In Browsern ohne SVG-Favicon-Unterstützung würde wieder das Standard-Icon erscheinen, weil es keinen Ersatz (`.ico`/`.png`) gibt (nicht geprüft, siehe unten).

## Vorschläge

- **P-1:** Reproduktion: Skript `mix.mjs` im Scratch-Ordner; `/favicon.svg` mit `prefers-color-scheme: light` auf dunklem Hintergrund `#35363a` und mit `dark` auf `#ffffff` rendern (Bilder `04-mix-light-x2.png`, `04-mix-dark-x2.png`). Was helfen würde: Ein Icon, das auf beiden Hintergründen trägt, unabhängig vom Systemschema, z. B. ein gefülltes Quadrat mit abgerundeten Ecken in der Akzentfarbe und das Haus darin weiss (wie viele App-Icons), oder ein heller/dunkler Rand um das Haus.
- **P-2:** Reproduktion: `03-tabs-light-x1.png` – Dwello-Tab bei 16 px neben gefüllten Icons. Was helfen würde: dieselbe Lösung wie P-1 (gefüllte Fläche) oder ein dickerer Strich nur im Favicon; damit würde das Icon auch eigenständiger gegenüber anderen Haus-Symbolen.

## Nicht geprüft

- Echte Browser-Tab-Leiste: Das Testwerkzeug läuft ohne sichtbare Browseroberfläche (headless). Die Tab-Leiste habe ich deshalb mit Farben von Chrome nachgebaut und das echte `/favicon.svg` darin eingesetzt; die Darstellung im echten Browser-Chrome (Kantenglättung, Grau-Abdunklung inaktiver Tabs) kann leicht abweichen.
- Safari und ältere Browser: ob sie das SVG-Favicon anzeigen, konnte ich nicht prüfen; einen PNG/ICO-Ersatz gibt es nicht (404).
- Ob Chrome/Firefox das `prefers-color-scheme` im Favicon nach System- oder Browser-Design auswerten, konnte ich headless nicht im echten Browser-Chrome beobachten; P-1 beruht auf dem Rendern des SVG mit beiden Schemen auf beiden Hintergründen.
- Mobile Ansicht und Lesezeichen/Startbildschirm-Icon (`apple-touch-icon` fehlt) waren nicht Teil der Aufgabe.
