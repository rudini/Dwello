# Review #1241, Runde 2 (Delta d1afec13..e7353cbc)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-2 | Minor | docs/architecture/utility-tree.md:120 | Zeile 119 ist korrigiert. Die Zeile «Fitness Function» direkt darunter sagt aber weiter «(`compose-update-check.sh`, bei jedem PR mit App-Änderung)», und das stimmt seit #1241 nicht mehr. Gleiche Korrektur wie in Zeile 119. |

Geschlossen: C-1

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bunx vitest run tools/ci/docker-paths.test.ts` (26 grün)
  - die 6 neuen `it.each`-Zeilen rot vor der Änderung an ci.yml. Nach dem Lesen plausibel: Das alte Muster trifft keinen dieser Pfade.
  - lint, Prettier auf der Testdatei
- Die nicht übernommenen Importe von `backup.service.ts`: Ich habe keinen konkreten Fehler gefunden, den nur Docker fängt. Offen bleibt der Hinweis aus Runde 1: pg_dump 16, Benutzer `bun`, `/backups` im Image. Das ist kein Befund.

Geprüft: Das neue Muster deckt alle lokalen Importe von `vite.config.ts` ab (`paraglide.config.ts`, `src/lib/version.ts`) und auch `svelte.config.js` (nur Pakete) sowie `project.inlang/settings.json`. `tsconfig.json` erweitert nur das erzeugte `.svelte-kit/tsconfig.json`. Der `git describe` in `vite.config.ts` hat einen Rückfall, das ist unverändert. Die Anker `^…$` und `^project\.inlang/` sind richtig, der Kommentar stimmt jetzt.
