# Code-Review: schnellere lokale E2E-Läufe (Runde 2, Delta)

Geprüft: `git diff 447c267 1ac138f` und `git diff b50c148 447c267` im Worktree `review-e2e-speed-code` (detached auf 1ac138f). Gelesen habe ich alle geänderten Dateien des Deltas: `tools/e2e/build-if-changed.mjs`, `tools/e2e/build-if-changed.test.ts`, `tests/e2e/tasks/demo.ts`, `tests/e2e/tasks/accessibility.ts`, `implementation_plan.md` und `docs/reviews/e2e-speed-review-1.md`. Dazu `playwright.config.ts`, `tests/e2e/CLAUDE.md:20`, `.github/workflows/ci.yml` (NODE_VERSION) und das `Dockerfile`.

Ergebnis: C-1 bis C-5 sind behoben, die Ablehnung von C-6 ist berechtigt. Es gibt einen neuen Befund (Nit), keinen Blocker und keinen Major.

## Status der Befunde aus Runde 1

| ID | Status | Beleg |
|----|--------|-------|
| C-1 | behoben | `build-if-changed.mjs:33` schliesst `src/lib/paraglide` aus. Der Test «baut nicht neu, wenn der Build nur die Übersetzungen aus messages/ erzeugt hat» schreibt die Datei während des Builds. Ohne den Filter wäre deren mtime > Stempel, und es käme zu einem 2. Build. `messages/` und `project.inlang` bleiben Eingaben. |
| C-2 | behoben | (a) `playwright.config.ts` ist jetzt Eingabe (`:24`), Test «baut neu, wenn sich die Version für den Build geändert hat». (b) Der Stempel enthält die Liste der vorhandenen Eingaben (`:39`, `:35`). Fehlt eine Datei, unterscheidet sich die Liste, `built` wird 0, und es folgt ein Build. Test «baut neu, wenn eine Konfigurationsdatei gelöscht wurde». Ein alter, leerer Stempel aus Runde 1 löst einmal einen neuen Build aus. Das ist unschädlich. |
| C-3 | behoben | Test «baut neu, wenn während des Builds eine Datei gespeichert wurde». Die Datei wird im Build-Prozess geschrieben, also mindestens um den Start eines Node-Prozesses nach `started`. Ohne `utimesSync` hat der Stempel das Build-Ende als mtime (≥ Datei), und der Test zeigt 1 statt 2. Das ist der gemeldete Rotlauf, von mir nachvollzogen, aber nicht erneut ausgeführt. |
| C-4 | behoben | Hinweise auf `usesExtraInstances` stehen in `tests/e2e/tasks/demo.ts:4` und `tests/e2e/tasks/accessibility.ts:372`. Der Name existiert in `playwright.config.ts:21`. |
| C-5 | behoben | `implementation_plan.md` enthält jetzt `Skills: tdd, ponytail, ponytail-review …` und `Test red:`-Zeilen für alle Tests aus Runde 1 und 2. Für den Test, der sofort grün war, steht dort «No red» mit Begründung. |
| C-6 | Ablehnung hält | `.github/workflows/ci.yml:13` setzt `NODE_VERSION: 22`, lokal läuft `node --version` = v22.22.0. Das `Dockerfile` (`node:20-alpine`) baut nur das Image und startet kein E2E, also auch `build-if-changed.mjs` nicht. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-7 | Nit | tests/e2e/CLAUDE.md:20; tools/e2e/build-if-changed.mjs:24 | Die Doku zählt die Eingaben als «`src/` without `__tests__`, `messages/`, `static/`, its configuration and packages» auf. Sie nennt nicht, dass jetzt auch `playwright.config.ts` dazugehört. Wer dort etwas ändert, das mit dem Build nichts zu tun hat (Timeout, Worker, Serverliste), löst lokal einen vollen Build von etwa 40 s aus. Mit der Doku in der Hand ist das unerwartet. Vorschlag: «… and `playwright.config.ts` (APP_VERSION)» ergänzen. |

## Blocker/Major

Keine.

## Nicht bestätigt

- Selbst erneut ausgeführt: `bunx vitest run tools/e2e`, 11 bestanden. `bunx prettier --check` auf `tools/e2e` und den beiden Task-Dateien: sauber.
- Die Rotläufe der vier neuen Tests (vom Aufrufer gemeldet) habe ich nicht erneut ausgeführt, weil ich dafür Code entfernen müsste. Bei C-3 und C-1 habe ich sie aus dem Code nachvollzogen (siehe oben).
- Vom Aufrufer gemeldet, nicht erneut ausgeführt: `bun run lint`, `deepcheck:audit`.
- Der vollständige E2E-Lauf (chromium + api) lief laut Aufrufer noch auf einem früheren Commit, Ergebnis unbekannt. `test:coverage`, `check`, Backend `test` und `type-check` sind für 1ac138f nicht gemeldet.
- Ob das Paraglide-Plugin beim Build ausserhalb von `src/lib/paraglide` schreibt: Laut `vite.config.ts:31` ist `outdir` nur `./src/lib/paraglide`. Einen Build habe ich nicht gestartet.
