# Review: E2E in jedem Browser auf Pull Requests (Commit 1b948848, Runde 1, zugleich Schlussrunde)

Gelesen per `git show 1b948848:<pfad>` (geprüfter Commit, nicht der Arbeitsbaum): `.github/workflows/ci.yml`, `docs/test-pyramid.md`, `tests/e2e/CLAUDE.md`, `playwright.config.ts`, `package.json` (Skripte `test:e2e*`), `docs/tech-stack.md`, `docs/design/arbeitsregeln.md`, `.claude/skills/pull-request/SKILL.md`, `tools/deepcheck/test/workflows.test.ts` (nur Fundstelle).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | docs/tech-stack.md:437 | Sagt weiterhin «PRs: Chromium + API driver; main: all browsers»; widerspricht der neuen CI und den mitgeänderten `test-pyramid.md`/`tests/e2e/CLAUDE.md`. |
| C-2 | Nit | .github/workflows/ci.yml:143 | `timeout-minutes: 60` gilt jetzt auch für die axe-Shards auf PRs (vorher 30); harmlos, nur erwähnt, weil die alte Unterscheidung mit wegfällt. |

## C-1 (Major): veraltete Doku in docs/tech-stack.md

`docs/tech-stack.md`, Abschnitt "CI/CD Pipeline", Zeile 437:

```
| E2E tests | `bun run test:e2e` (PRs: Chromium + API driver; main: all browsers); skipped for docs-only changes |
```

Nach 1b948848 laufen PRs alle Browser plus `api` (ci.yml:158 `BROWSERS` hängt nur noch an `matrix.reports`, ci.yml:201 ohne `--project`-Einschränkung). Die Anforderung verlangt, dass keine Doku mehr sagt, PRs liefen nur Chromium; der Commit passt `test-pyramid.md` an, diese Stelle nicht. Nachweis: `git grep -n "PRs: Chromium" 1b948848 -- docs` liefert genau diese Zeile. Korrektur: eine Zeile, z. B. «all browsers and the API driver, on pull requests too».

## Geprüft und bestätigt

- **BROWSERS (ci.yml:158):** nur noch `a11y-reports` → `chromium`, sonst `chromium firefox webkit`; unabhängig vom Event. Bestätigt per YAML-Parse.
- **Playwright-Cache-Key (ci.yml:194):** `…-${{ env.BROWSERS }}`; PR und main teilen damit denselben Key je Suite, keine weitere Änderung nötig.
- **Install-Step (ci.yml:198):** `bunx playwright install --with-deps ${{ env.BROWSERS }}`; installiert auf PRs nun Firefox und WebKit mit Systempaketen, wie auf main.
- **Testlauf (ci.yml:201):** `--project=chromium --project=api` für PRs entfernt; der E2E-Filter `--grep-invert @a11y` wählt damit alle vier Projekte (api, chromium, firefox, webkit), identisch zu main. Die axe-Suite behält `--project=chromium` über `matrix.filter`.
- **e2e-results-Gate:** zählt erfolgreiche Shards per Jobname (`"E2E tests ("`), unabhängig von Browsern; unverändert korrekt.
- **cancel-in-progress (ci.yml:12):** unterscheidet PR/main nur für das Abbrechen veralteter Läufe, nicht für Browser; keine Änderung nötig.
- **UI screenshots (ci.yml:321):** installiert `chromium` fest und nutzt `playwright.screenshots.config.ts`, nicht `BROWSERS`; nicht betroffen.
- **Timeout 60 min:** main-Läufe mit allen Browsern brauchten laut Aufrufer 23 bis 29 min je Shard; 60 min ist dieselbe Grenze wie bisher auf main, also gut doppelte Reserve. Passt.
- **playwright.config.ts / `test:e2e`:** keine Verzweigung nach PR/main; `process.env.CI` steuert nur Workers (2), Reporter und `reuseExistingServer`, für PR und main gleich. Firefox/WebKit-Projekte haben bereits `grepInvert: /@a11y/`. Keine Änderung nötig.
- **Übrige Doku:** `tests/e2e/CLAUDE.md:8-9` und `docs/test-pyramid.md:102` korrekt angepasst. `docs/design/arbeitsregeln.md:48` (`--project=chromium --project=api   # E2E incl. the axe check`) beschreibt einen lokalen Lauf, nicht PR-CI: kein Befund. In `.claude/` (Skills, Agents, Hooks) und `CLAUDE.md` keine Aussage über PR-Browser (grep nach chromium/firefox/webkit/browser/"PR CI"/minut).
- **Commit:** Conventional Commit, Betreff 41 Zeichen, `No scenario: CI only.` begründet. Kein unzusammenhängender Diff.
- **Ponytail:** Diff minimal (Bedingung entfernt statt neue Konstrukte); nichts Ungenutztes zurückgelassen.

## Nicht bestätigt

- YAML parst (python yaml): vom Aufrufer gemeldet; zusätzlich selbst per `git show 1b948848:.github/workflows/ci.yml | python3 -c yaml.safe_load` geparst, Werte von `timeout-minutes` und `env` geprüft.
- open-work- und deepcheck-workflows-Tests (8 passed): vom Aufrufer gemeldet, nicht erneut ausgeführt (der Diff ändert an den von `workflows.test.ts` geprüften Jobs `deepcheck`/Workflow-Struktur nichts Relevantes).
- Tatsächliche Laufzeit und Stabilität eines PR-Laufs mit allen Browsern: erst im nächsten CI-Lauf sichtbar; nicht prüfbar ohne CI.
- `implementation_plan.md` gemäss Auftrag ausgeklammert.
