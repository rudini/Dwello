# Review i727, Runde 1 (0f1d9111..25424a1d)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | docs/tech-stack.md:444 (und Tabelle 432-442) | «No Docker image is built or pushed in CI.» ist mit dem neuen Job `docker` falsch; die Job-Tabelle der CI/CD-Pipeline nennt «Docker images» nicht. Der Diff lässt den Satz unverändert stehen. |

Keine Blocker/Major.

Geprüft: Job `docker` in `.github/workflows/ci.yml` (Kontexte und Dockerfiles wie in `docker-compose.prod.yml`: `.`/`Dockerfile` und `./backend`/`Dockerfile`); `needs`-Ergänzungen in `ci-duration` und `main-status` (für `main-status` färbt ein fehlgeschlagener `docker`-Job den Lauf auf main rot, wie gewollt). Frontend-Dockerfile gegen `.dockerignore`: `bun install --frozen-lockfile --ignore-scripts` überspringt `prepare` (Paraglide), daher ist `project.inlang` beim Install nicht nötig; `project.inlang/`, `messages/`, `src/`, `static/`, `tailwind.config.js`, `svelte.config.js`, `vite.config.ts` liegen im Build-Kontext; die Importe aus `backend/` (ausgeschlossen) in `src/lib/types.ts` und `src/lib/server/*.ts` sind alle `import type` (mit `verbatimModuleSyntax`, beim Bundling entfernt); kein Import aus `tests/`, `docs/` oder `*.md`; `ARG APP_VERSION=` hat einen Default, `vite.config.ts` fällt ohne `.git` auf `''` zurück. Kein Workspace und keine Patches in `package.json`, `bun.lock` ohne weitere Workspace-Pakete. Backend-Dockerfile: `backend/bun.lock` vorhanden, keine `install`/`prepare`-Skripte in `backend/package.json`. Gate `app`: `false` nur bei ausschliesslich `docs/`, `.claude/` und `*.md` (bzw. nur Dokumentation seit dem letzten grünen Lauf); `.dockerignore` schliesst `docs` und `*.md` (ausser README.md, das kein Build-Schritt liest) aus, `.claude/` wird nicht gelesen. Ein übersprungener Pull Request kann das Image also nicht ändern, und auf main läuft der Job immer. Damit hält «every pull request» in der Sache; die Abweichung vom Wortlaut sollte der Pull Request nennen.

## Nicht bestätigt

- Ob beide Images in CI tatsächlich bauen: Ein `docker`-Client ist in dieser Umgebung vorhanden, aber Builds sind dem Reviewer untersagt. Ich habe nur die Dockerfiles und die `.dockerignore`-Dateien gelesen (siehe oben). Der erste CI-Lauf des Pull Requests ist der Test.
- YAML parst; `bunx vitest run tools/deepcheck/test/workflows.test.ts tools/testcheck/test/wiring.test.ts` (6 bestanden): vom Aufrufer gemeldet.
- Ob «Docker images» ein Required Check werden soll (Branch-Protection ist im Repo nicht sichtbar): nicht geprüft. Ein übersprungener Job zählt dort als erfolgreich.
