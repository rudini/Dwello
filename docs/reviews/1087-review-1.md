# Code-Review #1087, Runde 1 (243a602..de0de60)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: einzige Änderung `src/routes/documents/DeliveryFailure.svelte:22-26`. `wrap-anywhere` ist ein Tailwind-Utility (tailwindcss ^4.3.3, ab 4.1 vorhanden) und weder Farbe noch arbitrary value, also mit der Token-Referenz vereinbar. `overflow-wrap: anywhere` fliesst in die min-content-Breite ein und braucht deshalb kein `min-w-0` am Elternteil. Die Komponente wird auch auf `statement-detail-undelivered` verwendet; dort gilt die gleiche Wirkung, ohne Nebenwirkung auf andere Texte. Der neue Text ist ein Kommentar, kein UI-Text, daher nichts in `messages/*.json`. Die Fehlerseite ist schon in `tests/a11y/screens.json:338` und `sprachen-bildschirme.feature:87` geführt, also kein neuer Bildschirm. Das Fehlen eines Tests auf tieferer Ebene ist begründet: jsdom misst kein Layout, und eine Prüfung des Klassennamens würde das Verhalten nicht belegen. Das unveränderte Szenario deckt den Fix ab. Commit-Betreff hat 47 Zeichen und folgt Conventional Commits. Kein Diff ausserhalb der Anforderung.

## Nicht bestätigt

- E2E Firefox `-g "undelivered"` 6/6 auf de0de60. Rot vorher (3 von 5 Läufen, 396/476/556 px), danach 4/4 Wiederholungen grün. Chromium inkl. axe 6/6 (vom Aufrufer gemeldet; nicht ausgeführt, der Worktree hat keine `node_modules`).
- `bun run lint`, `bun run check`, Backend type-check, vitest design-guard/tokens/`--changed origin/main`, Prettier (vom Aufrufer gemeldet).
- Dass der zweite Fehler (statement-generate, «Die Wahl der Gebäude passt in ein schmales Fenster») durch #1082 (e6f60ce, 96cea14) behoben ist, samt den CI-Läufen 41699408079/41706105448 und den 7/7 lokalen Firefox-Läufen (vom Aufrufer gemeldet; weder CI-Logs noch die Commits von #1082 gelesen).
- Ob die Begründung im Kommentar für Firefox stimmt (kein Umbruch an Bindestrichen zwischen Zifferngruppen): im Browser nicht nachgeprüft, nur über die gemeldeten Messwerte.
