# Code-Review Runde 2 (Abschlussrunde), Slice «landing-anim» (898038f..9f27ab9, marketing)

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 | behoben | `hidden` im Markup (index.html:528, 586), `.anim-play[hidden] { display: none; }` (index.html:193), Skript `b.hidden = false` (index.html:979) |
| C-2 | behoben | fr.json:351 «Mettre en pause», it.json:351 «Mettere in pausa» |
| C-3 | behoben | build.py:23, die vier Einträge sind entfernt; «Lift» in fr/it übersetzt, in en bleibt «Lift» korrekt stehen |
| C-4 | behoben | sr-only-`figcaption` mit allen Beispielwerten (index.html:546), in fr/it/en übersetzt |

## Neue Befunde im Delta

Keine. Keine Blocker, keine Majors, keine Minors.

Geprüft: Zustandsmaschine mit `label()` (sichtbarer Text steht am Anfang des Namens, WCAG 2.5.3; der Anfangsname der zwei Knöpfe unterscheidet sich schon ohne aria-label); `data-end` bleibt das letzte Ende (`a-chk` endet bei 5.1 s, `a-mark` unverändert); WCAG 2.2.2 ist nicht anwendbar, weil der Nutzer den Ablauf startet, und eine Pause gibt es trotzdem; `aria-label` der Figuren wird von build.py als Attribut übersetzt (build.py:37, 61) und vom Skript in der jeweiligen Sprache gelesen (fr/it/en/index.html:527, 584); `max-width: 480px` bei 200 % Zoom: Karte 300 px + Knopf 48 px + Abstand 12 px passen in 450 px; mit reduzierter Bewegung hat die Figur jetzt Name und Inhalt (Sven P-4); die Begriffe der Bildunterschrift entsprechen i18n-begriffe.md (émetteur de la facture, emittente della fattura), «À vérifier»/«Da verificare» entsprechen den bestehenden Einträgen fr/it.json:344; die generierten Seiten haben je dieselben 31 geänderten Zeilen wie die deutsche.

## Nicht bestätigt

- **build.py, vom Aufrufer gemeldet:** nicht erneut ausgeführt, weil es Dateien schreibt. Abgeglichen habe ich nur die generierten Seiten (Stichproben von aria-label und figcaption in fr/it/en).
- **Playwright, vom Aufrufer gemeldet:** Screenshot bei 960×600, aria-label nach dem Drücken, Endtext nach 5.7 s, ohne JS und bei reducedMotion beide Knöpfe ausgeblendet, kein Überlauf bei 390 und 1440 px.
- **Vorlesen:** Wie ein echter Screenreader die Figur mit aria-label und sr-only-figcaption ansagt, habe ich nicht geprüft.
