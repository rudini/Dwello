# Sven, landing-anim: die zwei Animationen der Website

Persona: Sven, 45, blind, nur Tastatur, beurteilt nach dem Accessibility-Baum (`readOut`) und dem fokussierten Element. Desktop 1440 × 900. Seite: statische Website http://localhost:3310/index.html (nicht die App). Nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/sven-landing-anim/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Website, beide Animationen | Nach dem ersten Drücken heissen beide Knöpfe gleich («Anhalten», «Weiter abspielen», «Nochmals abspielen»). In einer Liste aller Knöpfe weiss ich nicht mehr, welcher zu welchem Abschnitt gehört. Den neuen Namen erfahre ich nur, wenn mein Screenreader die Namensänderung am fokussierten Knopf vorliest. Nichts wird angesagt (die Statusregion bleibt leer), und es gibt kein `aria-pressed`. |
| P-2 | Minor | Website, «Rechnungen per Drag & Drop» | Die Animation zeigt Beispielwerte, die nirgends als Text stehen: Wasserversorgung Zürich, CHF 930.00, Datum 31.03.2025 mit «Bitte prüfen», Kategorie Kaltwasser. Die nummerierten Schritte sagen nur allgemein «Die KI liest Betrag, Datum und Kategorie». Das Beispiel mit dem Hinweis «Bitte prüfen» bekomme ich nicht mit. |
| P-3 | Nit | Website, beide Animationen | Der Knopf steht allein in einer Abbildung ohne Namen. Was er abspielt, ist für mich nicht wahrnehmbar, und das sagt mir niemand (etwa «zeigt die drei Schritte oben als Bild»). Ich drücke einen Knopf, und für mich passiert nichts ausser der Namensänderung. |
| P-4 | Nit | Website, «Rechnungen per Drag & Drop», reduzierte Bewegung | Mit `prefers-reduced-motion: reduce` verschwindet der Knopf, aber im Baum bleibt eine leere, unbenannte Abbildung («figure» ohne Inhalt). |

## Beobachtungen

- Beide Knöpfe sind gleich nach dem Einstieg mit Tab erreichbar: Tab 15 «Ablauf abspielen», Tab 16 «Verteilung abspielen». Davor kommen Navigation, Sprachen, zweimal «Demo ansehen» und «So kommen Sie zu Dwello».
- In der Tab-Reihenfolge stehen die Knöpfe weit weg von ihrem Abschnitt, weil sonst in den Funktionsabschnitten nichts fokussierbar ist. Wer nur mit Tab springt, hört «Ablauf abspielen» ohne Überschrift davor. Mit der Überschriften-Navigation geht es gut.
- Nichts spielt von selbst: Nach 3 Sekunden ohne Eingabe liegt der Fokus noch auf `body`, und beide Knöpfe heissen weiter «… abspielen».
- Der Fokus bleibt in jedem Zustand auf dem Knopf. Kein Sprung, keine Meldung, keine Änderung im Baum ausser dem Knopfnamen.
- Die Animation selbst steht nicht im Baum (versteckt). Das ist richtig, denn sonst würden sich ändernde Texte vorgelesen.
- Zum Beispiel mit dem Lift steht der ganze Inhalt als Satz direkt über dem Knopf: CHF 1'690.00, sechs Wohnungen zu je CHF 281.67, Wohnung 1.01 von Hans Müller. Die Nummern der Wohnungen (1.01 bis 3.02) zeigt nur das Bild. Mir genügt der Satz.
- Mit meinem Werkzeug habe ich einmal einen Nebeneffekt gesehen: Nach einem ganzseitigen Screenshot während der Wiedergabe stimmte der Knopfname einmal nicht mit dem Tastendruck überein. Mit Tastatur allein konnte ich das in 10 Versuchen mit verschiedenen Zeitpunkten nicht nachstellen. Ich vermute, es liegt am Screenshot (der die Seite kurz vergrössert), nicht an der Seite.

## Aufgabe geschafft

Ja.

## Aufwand

Etwa 25 Minuten, 7 Skripte. Für jeden Knopf Enter, Leertaste, gemischte Tasten und ein Lauf bis zum Ende. Dazu ein Lauf mit reduzierter Bewegung.

## Ablauf

1. **Seite öffnen, 3 s warten.** Erwartet: nichts bewegt sich, kein Fokus gestohlen. Gesehen: Fokus auf `body`, Knöpfe «Ablauf abspielen» und «Verteilung abspielen» unverändert.
2. **Tab durch die Seite.** Erwartet: beide Knöpfe erreichbar. Gesehen: Tab 15 und 16, danach geht es weiter zu «dwello.next_steps() …» und zur Anleitung.
3. **«Ablauf abspielen» mit Enter.** Erwartet: Start, Fokus bleibt, neuer Name. Gesehen: «Anhalten», Fokus auf dem Knopf. Im Bild zeigt eine Karte nach und nach Rechnungssteller, Betrag, Datum und Kategorie.
4. **Nochmals Enter.** Erwartet: Pause. Gesehen: «Weiter abspielen». Zwei Screenshots im Abstand von 2,4 s sind gleich, das Bild steht also still.
5. **Nochmals Enter, dann warten.** Erwartet: weiter bis zum Ende. Gesehen: «Anhalten», nach etwa 3 s «Nochmals abspielen». Fokus immer auf dem Knopf.
6. **Dasselbe mit der Leertaste, dann mit gemischten Tasten** (Enter/Leertaste abwechselnd). Gesehen: jeder Druck wechselt zuverlässig zwischen «Anhalten» und «Weiter abspielen».
7. **«Nochmals abspielen» drücken.** Gesehen: startet neu, «Anhalten».
8. **«Verteilung abspielen»** (Tab weiter) mit Enter und mit Leertaste. Gesehen: dieselben Zustände, Ende nach etwa 2,5 s. Im Bild zuerst die Zeile «Lift CHF 1'690.00», darunter erscheinen die Wohnungen 1.01 bis 3.02 mit je 281.67. Der Satz mit dem Beispiel steht direkt darüber.
9. **Statusregion geprüft.** Erwartet: entweder eine kurze Meldung oder Stille. Gesehen: die Region bleibt in allen Zuständen leer. Es wird nichts angesagt.
10. **Reduzierte Bewegung** (`page.emulateMedia({ reducedMotion: 'reduce' })` auf der Seite des Kits, kein eigener Start nötig; `matchMedia` bestätigt `reduce`). Erwartet: keine Knöpfe, Text bleibt. Gesehen: beide Knöpfe fehlen im Baum und in der Tab-Reihenfolge (Tab 15 ist jetzt «dwello.next_steps() …»). Die drei Schritte und der Satz zum Lift bleiben. Im Abschnitt «Drag & Drop» bleibt eine leere Abbildung (P-4).

## Verwirrung

- «Ablauf abspielen»: Welcher Ablauf? Erst die Überschrift davor sagt es. Als Blinder frage ich mich, ob ich etwas höre oder nur etwas sehe. Es ist nur etwas zum Sehen.
- Zwei gleichnamige «Anhalten» bzw. «Nochmals abspielen» in der Knopfliste (P-1).

## Fehlerrisiken

- Kaum welche: nichts startet von selbst, der Fokus bleibt, und die Inhalte stehen (bis auf die Beispielwerte, P-2) als Text da.
- Ein Screenreader, der die Namensänderung am fokussierten Knopf nicht vorliest, lässt mich im Unklaren, ob das Drücken gewirkt hat.

## Vorschläge

- **P-1** Nachstellen: Tab bis «Ablauf abspielen», Enter, Tab zu «Verteilung abspielen», Enter, dann die Knopfliste des Screenreaders öffnen: zweimal «Anhalten». Hilfreich wäre ein gleichbleibender Name mit Zustand, etwa «Ablauf der Rechnung abspielen» mit `aria-pressed`, oder Namen mit Bezug: «Ablauf anhalten», «Verteilung nochmals abspielen».
- **P-2** Nachstellen: Abschnitt «Rechnungen per Drag & Drop» im Baum lesen. Die Werte 930.00, 31.03.2025, Kaltwasser und «Bitte prüfen» fehlen. Hilfreich wäre ein Satz wie beim Lift: «Ein Beispiel: Die Rechnung der Wasserversorgung Zürich über CHF 930.00 vom 31.03.2025 bekommt die Kategorie Kaltwasser; das Datum markiert Dwello mit „Bitte prüfen“.»
- **P-3** Nachstellen: «Ablauf abspielen» drücken, im Baum ändert sich nur der Knopfname. Hilfreich wäre eine Beschreibung am Knopf (`aria-describedby`), etwa «Zeigt die Schritte oben als bewegtes Bild».
- **P-4** Nachstellen: Seite mit `prefers-reduced-motion: reduce` öffnen, im Baum steht nach der Liste «So kommt eine Rechnung in Dwello» ein leeres `figure`. Hilfreich wäre, die ganze Abbildung auszublenden statt nur den Knopf.

## Nicht geprüft

- Ein echter Screenreader (NVDA, VoiceOver): ich habe nur den Accessibility-Baum und den Fokus gelesen. Ob die Namensänderung am fokussierten Knopf vorgelesen wird, hängt vom Screenreader ab.
- Andere Sprachen (FR/IT/EN) der Website.
- Mobile und Zoom: nicht Teil meines Profils.
- Ob die Animation pausiert, wenn sie aus dem Bild gescrollt wird: als Blinder nicht wahrnehmbar.
