# Code-Review: Landingpage «wärmer, nicht grösser», Runde 3 (Abschluss, bcf2d78)

Delta `git diff 29cc002 bcf2d78 -- marketing` (Commit bcf2d78), Worktree `review-landing-warm-close3`. Vorheriger Bericht: `docs/reviews/landing-warm-review-2.md`.

## Status der offenen IDs aus Runde 2

| ID | Status | Beleg |
|---|---|---|
| C-10 | erledigt | `.hero .paper a:focus-visible { outline-offset: -3px; }` (`marketing/index.html:145`). Die Spezifität (0,3,1) schlägt die globale Regel `:focus-visible` (`:88`). Der 3-px-Ring liegt jetzt ganz innerhalb der Fläche des Links, also innerhalb der Clip-Box von `.paper` (`overflow: hidden`, `:135`). |
| C-11 | erledigt | `.pdfs` steht im DOM direkt nach `.lede` und vor `.actions` (`:398–405`). `display: contents` und `order` sind weg. Ab 980 px setzt `.hero-copy > * { grid-column: 1 }` alle Kinder in Spalte 1. `.hero .pdfs` (0,2,0) überschreibt das mit Spalte 2, `grid-row: 1 / 6`. Bei der automatischen Platzierung kommen Badge, h1, Lede, Aktionen und Hinweis in die Zeilen 1–5. Der Brief überspannt genau diese Zeilen. Geschätzte Höhe des Briefblocks bei 1440 px: etwa 330 px. Das ist kleiner als die Textspalte, darum werden die Zeilen nicht gestreckt. Fokus und Vorlesen folgen jetzt auf jeder Breite dem Satz, der auf den Brief zeigt. |
| C-12 | erledigt | Das `aria-label` ist entfernt. Der Link bekommt seinen Namen aus dem Alt-Text (Inhalt des Briefs), in allen vier Sprachen (de `:399`, gebaute fr/it/en geprüft). Der Schlüssel «Abrechnung vergrössert anzeigen» ist aus fr/it/en gelöscht, kein Rest im Repo. |
| C-13 | erledigt | Der Alt-Text nennt nur noch die Kategorie, die das Bild zeigt: de «etwa den Lift» (`:510`), fr «l’ascenseur», it «l’ascensore», en «TV/cable» (`i18n/{fr,it}.json:261`, `en.json:258`). Der alte Schlüssel ist in allen drei Tabellen ersetzt. |

## Neue Befunde

Keine.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: axe-core (de/fr/it/en, hell und dunkel, 1440/768/390, 0 Verstösse, kein seitliches Scrollen); Tab-Reihenfolge bei 390 px und 1440 px; Oberkante des Briefs bei 396 px auf 390 px Breite; Animationen unverändert.
- C-10 und C-11 habe ich nicht im Browser gesehen, ich habe keinen Browser gestartet. Grundlage sind das CSS (Outline innerhalb der Clip-Box; Platzierungsregeln des Grids) und die Reihenfolge im DOM. Die Höhe des Briefblocks im Vergleich zur Textspalte bei 980–1440 px ist aus `--max: 1200px`, den Spaltenanteilen von `.pdfs` (`:213–214`) und den Bildmassen geschätzt, nicht gemessen.
- Selbst wiederholt: `marketing/i18n/build.py` lief im Speicher, `write_text` war abgefangen. Es gibt kein «German left?» und keinen unbenutzten Schlüssel. Alle neun gebauten Seiten für fr/it/en sind byte-gleich mit den committeten.
- Geprüft: `hero-grid` wird nirgends mehr verwendet. Dass `max-width: 820px` an `.hero-copy` weggefallen ist, ändert unter 980 px nichts, denn dort hatte `display: contents` die Box bisher aufgehoben. Ponytail: Die Änderung ist kürzer als vorher (50+/53−), es gibt keinen toten Code.
