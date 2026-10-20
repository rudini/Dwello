# Code-Review ci-speed, Runde 1

Bereich: `git diff 0b47e626 63fd5d15` (ein Commit, 63fd5d15), gelesen im Worktree `review-ci-speed-code`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | docs/tech-stack.md:429, :437, :438 | Die Doku sagt weiterhin, dass ein Push auf `main` «without E2E and axe» läuft, dass E2E «on push to `main`» übersprungen wird und dass axe nur auf PRs und nachts läuft. Seit ci.yml:45-46 stimmt das nicht mehr, denn ein Push läuft mit `app=true`/`ui=true`. Die Zeile «skipped for docs-only changes» beschreibt die neue Regel (Doku-only seit grünem Lauf, auch ohne Backend-Tests) ebenfalls nicht. Das ist die einzige Stelle, die im Repo noch das Überspringen auf `main` behauptet. Gesucht in `*.md`, `*.yml`, `*.ts` und `*.mjs` ohne `docs/archive` und `docs/reviews`. |
| C-2 | Minor | implementation_plan.md:12 | Der Punkt «Skill `pull-request`: merge `main` and auto-merge as the new settings allow» ist abgehakt. Der Diff ändert im Skill aber nur den Satz in Zeile 19. `.claude/skills/pull-request/SKILL.md:25` (main mergen, «when GitHub refuses the merge because the branch is behind») und `:27` («the repository has no auto-merge») sind unverändert. Entweder ist der Haken falsch, oder der Punkt gehört offen zu Zeile 10 (Einstellungen), bis der Owner sie umgestellt hat. |

Keine Blocker, keine Major.

## Geprüft und bestätigt

- **Anforderung (1):** ci.yml:45-46. Jedes Ereignis ausser `pull_request` (push, schedule, workflow_dispatch) setzt `backend`, `app` und `ui` auf true. Damit laufen bei einem Push auf `main` die E2E-Shards (ci.yml:159) und axe ohne `SKIP` (ci.yml:178). Die Kommentare ci.yml:7, :23-25 und `docs/test-pyramid.md:102-103` stimmen damit überein.
- **Anforderung (2):** Das Skript `tools/ci/docs-only-since.mjs` ist nur dann grün, wenn ein grüner Commit ein echter Vorfahre von head ist und der Zwei-Punkt-Diff (Baumvergleich) nur Doku enthält. Der Pfadfilter ist derselbe wie in ci.yml:58. Durchgespielte Fälle:
  - **Abgebrochene Läufe:** `status=success` schliesst `cancelled` aus. Bei einem Code-Push, der durch einen Doku-Push abgebrochen wird, zählt der Code-Commit nicht als grün. Der Diff vom älteren grünen Commit enthält dann den Code, also läuft alles.
  - **Merge von `main` in den Branch:** Der Diff vom letzten grünen Commit zum Merge enthält den Code von `main`, also läuft alles. Hat `main` nur Doku geändert, wird zu Recht übersprungen.
  - **Re-runs:** Ein später roter Re-run nimmt den Lauf aus der Erfolgsliste. Ein Re-run auf demselben SHA ergibt `commit === head` und damit den vollen Lauf.
  - **Ketten:** Ein übersprungener grüner Lauf bleibt transitiv korrekt, weil der Baumdiff ab dem zuletzt wirklich getesteten Commit nur Doku enthält.
  - **Merge-Commit des Checkouts gegen `pull_request.head.sha`:** Am echten Repo geprüft. Die Runs-API liefert für `pull_request`-Läufe als `head_sha` den PR-Kopf und nicht den synthetischen Merge-Commit: Der grüne Lauf `f5793660…` von `w3-issue-451` ist `0b47e626^2`. Der Kopf ist als zweiter Elternteil des Merge-Commits mit `fetch-depth: 0` lokal vorhanden. `node tools/ci/docs-only-since.mjs 0b47e626^2 f5793660… ed086c9e…` liefert dort 1, richtig, weil `ed086c9e..f5793660` Code enthält.
  - **SHA nicht lokal vorhanden** (Force-Push, fremder Fork): `merge-base` endet mit Status 128, das ergibt false.
- **`gh api`:** Mit `-X GET -f branch=…` hängt gh den Parameter an die schon vorhandene Query an. Read-only am Repo getestet: Alle Treffer haben `head_branch=w3-issue-451`, `event=pull_request`, `conclusion=success`. Die Job-Berechtigungen `contents: read` und `actions: read` reichen, auch für Forks mit read-only-Token. Für die Fehlerbehandlung gilt: `|| true` lässt die Liste leer oder ohne gültige SHAs, daraus folgt Exit 1 und der volle Lauf. Ein Fehler führt also nie zum Überspringen.
- **Shell-Injection:** `head_ref` kommt über die Umgebungsvariable `HEAD_REF` und ist gequotet. `${{ github.event.pull_request.head.sha }}` und `github.repository` sind nicht frei wählbar. `$green` ist absichtlich ungequotet und enthält nur SHAs aus der API. Das Skript ruft `git` mit `execFileSync`/`spawnSync` ohne Shell auf.
- **`e2e-results` und Pflicht-Checks bei `app=false`:** Bei ci.yml:255 endet der Job mit Exit 0. Die Checks «E2E tests» und «Accessibility (axe)» melden also bestanden, die Shard-Jobs werden übersprungen. Das ist derselbe Mechanismus wie bisher bei Doku-PRs. Scheitert `changes`, bleibt ci.yml:254 rot.
- **Unit-Tests, Lint, Build, Migrations-Check und Fallow** laufen auch bei einem übersprungenen Doku-Push. Tests, die Doku lesen (`open-work`, Tokens, deepcheck `readme`), sind Vitest-Tests und laufen weiter. In `backend/src/__tests__`, `backend/scripts` und `tests/e2e` liest kein Test eine Datei unter `docs/`, `.claude/` oder `*.md`. Laufzeitcode nennt solche Pfade nur in Kommentaren.
- **Test:** `tools/ci/docs-only-since.test.ts` liegt im Include `tools/**/*.test.ts` (vitest.config.ts:32). Ohne Skript schlagen die beiden Ja-Fälle fehl (Zeile 36, 50). Die vier Nein-Fälle bestehen auch ohne Skript, sie zeigen ihr Rot nur gegen ein zu grosszügiges Skript. Einen Fehler des Skripts fangen die Ja-Fälle, deshalb führe ich das nicht als Befund.
- «No scenario: CI configuration» ist stimmig, weil sich am Verhalten der App nichts ändert. Der Diff enthält nichts, was mit der Anforderung nichts zu tun hat.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run tools/ci tools/deepcheck/test/workflows.test.ts tools/open-work src/__tests__/open-work.test.ts tools/claude-hooks/commit-msg-gate.test.ts`, «YAML parses»: vom Aufrufer gemeldet. Mein erneuter Lauf von `bunx vitest run tools/ci` scheiterte daran, dass die Berechtigungen den Zugriff auf `node_modules` verweigerten.
- «Neuer Test vorher rot gesehen»: vom Aufrufer gemeldet. Durch Lesen bestätigt nur für die beiden Ja-Fälle, siehe oben.
- Fallow und das neue `tools/ci/docs-only-since.mjs`: Die Datei hat keine Exports und wird nur über `new URL(...)` im Test und aus ci.yml aufgerufen. In `.fallowrc.json` steht sie nicht unter `entry`, anders als `tools/open-work/check-issues.mjs`. Ob der CI-Job «Fallow audit» sie als ungenutzte Datei meldet, konnte ich nicht prüfen, weil ich Fallow nicht gestartet habe. Der Commit-Hook lief laut Commit durch.
- Ein grüner Lauf eines früheren PRs mit demselben Branchnamen oder mit anderem Basis-Branch (gestapelter PR) kann zählen, weil die Pfadfilter jenes Laufs gegen dessen Basis rechneten. Die Integration mit dem aktuellen `main` deckt dann erst der Push auf `main` ab. Das passt zu Anforderung (1), ist aber nicht getestet.
- Die GitHub-Einstellungen (Pflicht-Checks, «Require branches to be up to date», Auto-Merge) liegen ausserhalb des Diffs und sind nicht geprüft.
