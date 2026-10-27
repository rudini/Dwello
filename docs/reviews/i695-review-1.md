# Review #695, Runde 1 (`d3e23ff0..0344b691`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: alle vier geänderten Dateien (`paraglide.config.ts`, `vite.config.ts:4,32`, `vitest.config.ts:4,10`, `package.json:18`). Die Optionen stehen jetzt nur noch in `paraglide.config.ts:5-9` und werden von beiden Configs und `bun run i18n` (also auch `check` und `prepare`) genutzt. `import.meta.main` ist beim Laden der Configs falsch, also kompiliert der Import nicht. Die Datei ist über `*.config.ts` in `tsconfig.json` eingeschlossen; der Dockerfile installiert mit `--ignore-scripts`, kopiert die Datei (nicht in `.dockerignore`) und baut über das Vite-Plugin. Kein anderer Ort (Docs, CI, `.claude/settings.json`) nennt den alten CLI-Aufruf. Der Diff ist minimal und enthält nichts Fremdes. Weil sich nichts ändert, was ein Nutzer sieht, ist `No scenario` begründet.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: gleiche Ausgabe von altem CLI-Aufruf und `bun run i18n`, `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/i18n.test.ts`, `bunx vite build`, Prettier.
- Ob `compile()` ohne das frühere `--silent` mehr loggt, habe ich nicht geprüft. Die Quellen in `node_modules/@inlang/paraglide-js` sind für mich gesperrt (deny rule). Auf die erzeugten Dateien hat das keinen Einfluss.
- Selbst erneut ausgeführt: `bunx vitest run tests/unit/vite-config.test.ts` (lädt das geänderte `vite.config.ts` mit `resolveConfig`): 1 bestanden. Der Aufrufer hatte ihn nicht genannt, obwohl der Test eine geänderte Datei liest.
