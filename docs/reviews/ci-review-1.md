# Code-Review CI-Slice (83994214..16d6bd7d)

Worktree: `/tmp/claude-0/-home-user-Dwello/fb6bec91-79af-59a0-af59-fc55d530205d/scratchpad/review-ci-code` (HEAD 16d6bd7d). Gelesen: alle drei geänderten Dateien vollständig im Diff, dazu `.github/workflows/ci.yml` Jobs `changes` bis `ui-screenshots`, `.github/workflows/release.yml`, `playwright.config.ts` (Projekte, fullyParallel, workers), `package.json` (Playwright ^1.49.1), Basisstand von `implementation_plan.md`.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Nit | `.github/workflows/ci.yml:147` | Kommentar «longest shard 245 s of 905 s»: unklar, was 905 s ist (Summe axe? beide?); datierte Messwerte im Code veralten. Besser: Messung nur im Plan/PR, im Kommentar nur der Grund (Aufteilung nach Testanzahl). |
| C-2 | Nit | `.github/workflows/ci.yml:194` | Cache-Schlüssel hängt an `hashFiles('bun.lock')`: jede Abhängigkeitsänderung (nicht nur Playwright) verwirft den Browser-Cache. Funktional korrekt, nur seltener Treffer; akzeptabel. |
| C-3 | Nit | `.github/workflows/ci.yml:148-155` | Bei PRs ohne UI-Änderung starten jetzt 5 statt 3 axe-Runner, jeder mit Postgres-Service-Container, nur für den `echo`-Schritt. Kostet Runner-Minuten, nicht Laufzeit. Vorbestehendes Muster, durch den Diff verstärkt. |
| C-4 | Nit | `implementation_plan.md:5` | Doppelte Leerzeile vor `## Session` (Basis endet schon mit Leerzeile). Wird beim Archivieren ohnehin entfernt. |

Keine Blocker, keine Major.

## Geprüft und bestätigt

- **Anforderung 1 (concurrency):** `cancel-in-progress: ${{ github.event_name == 'pull_request' }}` ist zulässig (Ausdrücke mit `github`-Kontext sind in `concurrency` auf Workflow-Ebene erlaubt; GitHub-Doku zeigt dasselbe Muster). PRs (`ci-refs/pull/N/merge`) brechen weiter ab; auf `main` läuft der laufende Run zu Ende, ein wartender wird durch den neueren ersetzt. Der Kommentar beschreibt das richtig. Auf `main` erscheinen also weiter einzelne «cancelled»-Runs (die ersetzten wartenden), aber nie mehr der laufende: genau die Anforderung. `release.yml` hat eigene Gruppe und hängt nicht von CI ab.
- **Anforderung 2 (Matrix):** `suite: [e2e, a11y]` × `shard: [1..5]` = 10 Kombinationen. Jeder `include`-Eintrag setzt `suite` auf einen vorhandenen Wert und ergänzt nur neue Schlüssel; er wird daher genau den 5 passenden Kombinationen angehängt und erzeugt keine eigene Kombination (bei der anderen `suite` würde er einen Originalwert überschreiben, also nicht angehängt). Ergebnis: Jobnamen `E2E tests (1/5)` … `(5/5)` und `Accessibility (axe) (1/5)` … `(5/5)`; `matrix.reports`, `matrix.filter`, `matrix.shards` sind in allen 10 gesetzt. `SKIP`/`BROWSERS` (Job-`env` darf `matrix` lesen) und Artefaktnamen `${reports}-${shard}` bleiben eindeutig.
- **e2e-results:** zählt per `startswith("<name> (")` die erfolgreichen Jobs und vergleicht mit `shards: 5`; beide Zeilen angepasst. Übersprungene axe-Shards enden mit `success` und zählen mit. Gesamtzahl Jobs im Run (~19) bleibt unter `per_page=100`. Checknamen «E2E tests» und «Accessibility (axe)» unverändert.
- **Keine Reste mit 2/3 Shards:** `grep` über Repo (ohne `node_modules`, `docs/archive`) nach `shard`, `1/2`, `2/2`, `1/3`, `E2E tests`, `Accessibility (axe)`: nur `ci.yml` und `docs/test-pyramid.md:102-103`, beide angepasst. Skills unter `.claude/` und `tests/e2e/CLAUDE.md` erwähnen keine Shardzahlen.
- **Anforderung 3 (Cache):** `actions/cache@v4` auf `~/.cache/ms-playwright`, Schlüssel `playwright-Linux-<hash>-chromium` bzw. `…-chromium firefox webkit` (Leerzeichen sind in Cache-Schlüsseln erlaubt, nur Kommas nicht). Bei Treffer findet `playwright install` die Browser über ihre Installationsmarker und lädt nichts; `--with-deps` installiert die Systempakete per apt jedes Mal (die liegen nicht im Cache) — korrekt, wie der Kommentar sagt. Gespeichert wird im Post-Schritt nur bei Erfolg; parallele Shards mit gleichem Schlüssel erzeugen höchstens die harmlose Warnung «Unable to reserve cache». PRs können den `chromium`-Schlüssel aus dem `main`-Scope lesen, weil auf `main` der axe-Job ihn schreibt.
- **Browserliste auf main:** vorher `playwright install --with-deps` ohne Argument (alle), jetzt `chromium firefox webkit`; `playwright.config.ts` nutzt nur `chromium`, `firefox`, `webkit` (und `api` auf Chromium), keinen `channel`. Gleichwertig; `install chromium` bringt ab 1.49 die Headless Shell mit.
- **PR-Projektauswahl** (`--project=chromium --project=api` für E2E) unverändert.
- **Nichts Fremdes im Diff:** die Verschiebung des Browser-Ausdrucks in `env.BROWSERS` ist für den Cache-Schlüssel nötig.
- **Tests/Szenario:** reine CI-Konfiguration; der Plan vermerkt `No scenario: CI configuration only`. Kein neuer Test, also keine Rot-Prüfung nötig.

## Ponytail

`ci.yml:148-152`: `suite`-Achse könnte durch `name`-Achse ersetzt werden (Include-Einträge dann ohne `suite:`), spart aber keine Zeile. `shards: 5` steht viermal; als einwertige Achse `shards: [5]` ginge es einmal, bricht aber die getrennte Shardzahl je Suite. Nichts lohnt sich.
net: -0 lines possible. Lean already. Ship.

## Nicht bestätigt

- YAML-Parsing, `bun run lint`, `bunx vitest run src/__tests__/open-work.test.ts tools/deepcheck/test/workflows.test.ts`: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Tatsächliches Verhalten auf GitHub (Matrix-Expansion, Cache-Treffer, Concurrency auf main): kein Run auf diesen Commits; nur aus der Actions-Semantik abgeleitet. Nach dem Push im ersten Run prüfen: 10 Shard-Jobs mit den erwarteten Namen, «E2E tests» und «Accessibility (axe)» grün, im zweiten Run «Cache restored from key: playwright-Linux-…».
- Messwerte (561 s → 235 s, 367 s → 245 s, 6 Shards 310 s): vom Aufrufer gemeldet, nicht nachgemessen. Die Balance auf `main` (alle Browser, andere Testmenge pro Shard) ist nicht gemessen; der 30-min-Timeout pro Shard ist dort aber durch 5 statt 2 Shards eher entspannter.
- Kein actionlint verfügbar.
