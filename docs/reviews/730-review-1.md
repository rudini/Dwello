# Review #730, Runde 1 (3e72bc74)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: alle 12 geänderten Dateien. `favicon.svg` (weisses Lucide-`House` auf `#1B5873` = helles `accent`, kein `prefers-color-scheme` mehr), die PNGs mit 180/192/512 px (angesehen: randlose Akzentfläche, weisses Haus), Manifest und Links in `app.html`. Statische Dateien liefert SvelteKit/adapter-node vor `hooks.server.ts` aus, sie sind also auch ohne Sitzung erreichbar. Die Unit-Tests in `app-html.test.ts` schlagen ohne die Änderung fehl (Links fehlen, Manifest fehlt, Farbe/Medienabfrage). Das neue Szenario schlägt beim Lesen ohne die Änderung fehl (`touchIcon: 'missing'`, `manifestIcons: []`), ohne `@wip`, mit Fachsprache statt UI-Wörtern. Die Grundlage («auf der Gebäudeliste») gilt. Der Step ruft nur die Question auf, und die Question gibt die geladenen Content-Types zurück. Kein bestehender Schritt und kein bestehender Test prüft jetzt weniger. D7a passt zum Entscheid. Keine UI-Texte, kein neuer Bildschirmzustand (nur Browser-Chrome), keine API-Änderung, kein fremder Diff.

## Nicht bestätigt

- vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main`, `cd backend && bun run type-check`, `bunx vitest run --changed origin/main` und `src/__tests__/app-html.test.ts` (6 bestanden, neue Tests rot vor der Änderung gesehen), design-guard/tokens/e2e-screenplay-lint, E2E `--project=chromium -g "Symbol"` (2 bestanden, neues Szenario als @wip am eigenen Step rot gesehen), Prettier.
- Dass die PNGs aus `favicon.svg` ohne `rx` gerendert wurden: Das Skript ist nicht committet. Ich habe nur die Bilder angesehen, sie stimmen optisch überein. Kein Test vergleicht ihren Inhalt mit dem SVG.
- Wie das Symbol in echter Browser-Chrome hell/dunkel aussieht und wie es iOS/Android auf dem Startbildschirm darstellen: Das zeigt kein Test, es ist Sache der Persona-Runde (`docs/design/personas/README.md`, «Browser chrome»).
