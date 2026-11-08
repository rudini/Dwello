# Review #1241, Runde 1 (d1afec13)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | .github/workflows/ci.yml:81-84 | Die Liste lässt die Build-Konfiguration des Frontend-Images aus (`vite.config.ts`, `svelte.config.js`, `paraglide.config.ts`, `project.inlang/`, `tsconfig.json`, dazu `src/lib/version.ts`, das `vite.config.ts` importiert). Der Kommentar «app code the Build and test jobs cover» stimmt für diese Dateien nicht: Das Image baut anders als der Job Build. |
| C-2 | Minor | docs/architecture/utility-tree.md:119 | Dort steht weiter «prüft der CI-Job «Docker images» bei jedem PR mit App-Änderung». Seit diesem Diff ist das falsch. Die anderen drei Dokumente sind angepasst, diese Stelle nicht. |

## C-1 (Major): Image-Build ist durch den Job Build nicht gedeckt

Der Job Build (ci.yml:100-104) führt `bun install --frozen-lockfile` mit Skripten aus. Dabei läuft `prepare` → `bun run i18n` → `bun paraglide.config.ts` und erzeugt `src/lib/paraglide/`. Danach kommt `bun run build`, im vollen Checkout mit `.git`, `backend/`, `tests/` und `docs/`.

Das Frontend-`Dockerfile` macht es anders:
- `bun install --frozen-lockfile --ignore-scripts`. Paraglide kompiliert dort nur das `paraglideVitePlugin` in `vite.config.ts` (Kommentar im Dockerfile).
- Der Build-Kontext hat kein `.git`, kein `backend`, keine `tests`, keine `docs` und kein `*.md` (`.dockerignore`).

Damit hängen genau die Build-Konfigurationsdateien vom Image-Pfad ab, und nur der Job «Docker images» prüft sie. Der gleiche Fall ist schon einmal passiert: Paraglide brach nur im Docker-Build (#945).

So zeigt man den Fehler: Ein PR entfernt `paraglideVitePlugin(paraglideOptions)` aus `vite.config.ts`.
- Build bleibt grün, weil `prepare` die Nachrichten vorher erzeugt hat.
- Die Unit-Tests bleiben grün, weil `vitest.config.ts` ein eigenes Plugin hat.
- E2E bleibt grün, weil es nach `bun install` baut.
- «Docker images» wird übersprungen, weil `vite.config.ts` nicht passt: `grep -qE '<Muster>' <<< vite.config.ts` gibt 1 zurück.
- Erst auf `main` scheitert `docker build` beim Import von `$lib/paraglide/messages`.

Dasselbe gilt für eine Änderung in `svelte.config.js` oder `vite.config.ts`, die etwas aus einem ausgeschlossenen Pfad oder aus `.git` ohne Rückfall liest.

Korrektur: Den Ausdruck um `^(vite\.config\.ts|svelte\.config\.js|paraglide\.config\.ts|tsconfig\.json|src/lib/version\.ts)$|^project\.inlang/` ergänzen. Dazu je eine Zeile in `tools/ci/docker-paths.test.ts` (`it.each`) und den Kommentar richtigstellen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bunx vitest run tools/ci/docker-paths.test.ts tools/deepcheck/test/workflows.test.ts tools/testcheck/test/wiring.test.ts` (27 grün)
  - der neue Test rot vor der Änderung an ci.yml. Nach dem Lesen plausibel: `dockerPattern()` findet ohne die Zeile `echo "docker=…"` nichts, und `expect(line).toBeDefined()` scheitert.
  - lint, check, fitness, backend type-check, Prettier auf der neuen Datei, testcheck audit
- Ob ein Start mit der Umgebung von `compose.yaml` auf PRs sonst geprüft wird:
  - frontend `init` in `src/hooks.server.ts:30` und `src/lib/server/jwt-config.ts` mit `NODE_ENV=production`
  - backend `startBackups` mit `BACKUP_DIR=/backups` in `backend/src/index.ts:30`
  - E2E startet beide ohne `NODE_ENV` und ohne `BACKUP_DIR` (`playwright.config.ts:126-150`). Ob Vite `process.env.NODE_ENV` im SSR-Bundle festlegt, habe ich nicht geprüft. Wenn nicht, prüft auf PRs nur «Docker images» eine Änderung an diesen produktiven Startpfaden, und die neue Liste nimmt sie nicht auf.
  - Ebenso fehlen die Importe von `backup.service.ts` in der Liste (`db/connection.ts`, `backup-crypto.ts`, `emergency-sheet.ts`, `pdf.service.ts`), obwohl die Sicherung vor den Migrationen im Image über sie läuft. Die Backend-Tests decken sie auf dem Host ab, aber nicht im Image (pg_dump 16, Benutzer `bun`, `/backups`).
- Ob «Docker images» in der Branch-Protection ein Required Check ist: in der Worktree nicht sichtbar. Ein Job, den `if` überspringt, gilt dort als erfolgreich, wie schon vor dem Diff im Pfad «nur Doku».

Geprüft:
- grep-Semantik: Pfade an der Wurzel verankert, `--no-renames` gibt bei Umbenennung beide Pfade aus.
- Docs-only-Pfad: `docker` bleibt leer → `'' == 'true'` ist falsch → Job übersprungen. Das ist richtig, weil die Dateien, die der Job liest, seit dem letzten grünen Lauf gleich sind.
- push, schedule und workflow_dispatch: setzen `docker=true`.
- `needs` von `ci-duration` und `main-status`: unverändert richtig.
- Testdatei (läuft im node-Projekt über `tools/**/*.test.ts`), README.md, tech-stack.md, fitness-functions.md.
- ponytail-review: nichts Unbenutztes, keine Kopie eines vorhandenen Helfers.
