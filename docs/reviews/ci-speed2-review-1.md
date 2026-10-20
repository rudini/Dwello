# Code-Review ci-speed2, Runde 1

Range: `git diff 930c1ae7 9aadfcdb` (ein Commit, `chore(ci): Chromium on PRs, report a red main`), gelesen im Worktree `review-ci-speed2-code`. Alle sechs geänderten Dateien sind gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | .github/workflows/ci.yml:444 | `RED` zählt nur `failure`. Ein benötigter Job, der an `timeout-minutes` scheitert, hat das Ergebnis `cancelled`, während `cancelled()` falsch bleibt (der Workflow selbst wurde nicht abgebrochen). Dann läuft «Main status» mit `RED=false`: Es meldet nichts und schliesst ein offenes Issue mit «… ist grün», obwohl der Lauf nicht grün war. Bei den E2E-Shards fängt `e2e-results` das ab (der Job zählt erfolgreiche Shards und schlägt fehl). Bei `build`, `static-checks`, `unit-tests` und `fallow` (Standard-Timeout 6 h) fängt es niemand ab. Die Lösung ist `contains(needs.*.result, 'failure') \|\| contains(needs.*.result, 'cancelled')`. |
| C-2 | Minor | .claude/skills/pull-request/SKILL.md:32 | Der Check-in «about 45 minutes later» sagt nicht, was zu tun ist, wenn der Lauf von `main` mit dem Merge-Commit dann noch läuft oder noch wartet. Auf `main` laufen die Läufe nacheinander, und nur der neueste wartende bleibt erhalten (ci.yml:12–17). Ein Lauf, der den Merge enthält, kann also erst nach einem laufenden Vorgänger starten. Mit allen drei Browsern in 5 Shards (Timeout 60 min) ist er nach 45 Minuten oft nicht fertig. Die Session bleibt dann ohne Anweisung: erneut einplanen oder unter «Blocked on me» stoppen. Damit ist die Done-Zeile (SKILL.md:34) für diesen Fall nicht entscheidbar. Ein Halbsatz würde reichen, z.B. «still running: arm another check-in». |

Keine Blocker oder Majors.

## Geprüft, ohne Befund

- **Ausdrücke:** `BROWSERS` (ci.yml:181) ergibt für die axe-Prüfung und für Pull Requests `chromium`, sonst alle drei Browser. Bei `PROJECTS` (ci.yml:182) ergibt `a && b && 'str' || ''` bei falscher Bedingung `''` (aus `false || ''`), also nur ein doppeltes Leerzeichen im `run` (ci.yml:225). Die Projekte `api` und `chromium` kommen ohne Abhängigkeits-Projekte aus (playwright.config.ts:181–203). Der `--grep-invert @a11y` des Filters wirkt auch auf `chromium`, das selbst kein `grepInvert` hat.
- **Cache-Key:** Der Key hing schon vorher an `env.BROWSERS` (ci.yml:218, unverändert). E2E-Shards eines Pull Requests teilen jetzt den Key `…-chromium` mit der axe-Prüfung, die auf `main` ihn anlegt. Pull-Request-Läufe dürfen Caches von `main` lesen.
- **`main-status`, Fälle:**
  - Push oder Nightly auf `main`: Der Job läuft, `github.ref` ist `refs/heads/main`.
  - `pull_request` (`refs/pull/N/merge`) und `workflow_dispatch` auf einem anderen Branch: Der Job wird übersprungen.
  - Abgebrochener Workflow: übersprungen, wegen `!cancelled()`.
  - Fehlgeschlagener `changes`: Die abhängigen Jobs werden übersprungen, `changes` selbst ist `failure`, also `RED=true`.
  - `fallow` übersprungen (Nightly): kein Rot.
  - `needs` enthält alle Jobs, die auf `main` laufen. `deepcheck` und `ui-screenshots` laufen nur in Pull Requests.
- **Berechtigungen und `gh`:** Der Job setzt `issues: write`. Es gibt keine Workflow-weiten `permissions`, also gilt die Job-Ebene. `GH_REPO` reicht `gh` ohne Checkout. Der Titel wird zusätzlich exakt per `jq` verglichen. Das Label `bug` ist ein erlaubtes Themen-Label (CLAUDE.md, «Open work»).
- **Shell-Injection:** In den `run`-Block gelangen nur `github.event_name` und `github.sha`, beide nicht vom Benutzer steuerbar. `RUN` und `RED` kommen über `env`.
- **`tools/open-work/check-issues.mjs`:** prüft Marker, `Fixes`-Issues mit App-Änderungen ohne Szenario und «Proposed» ohne `entscheiden`. Das automatisch eröffnete Issue berührt keine dieser Regeln. Ein Fix-Pull-Request mit `Fixes #<Issue>` braucht wie jeder andere ein Szenario oder `No scenario:`.
- **Doku:** Die Zeilen sind konsistent mit ci.yml: `docs/test-pyramid.md:102`, `docs/tech-stack.md:437,441`, `tests/e2e/CLAUDE.md:9`. Sonst nennt nirgends im Repo (ausser `docs/archive`, `docs/reviews`) alle Browser für Pull Requests.
- **Skill und CLAUDE.md:** «this branch restarted on `origin/main`» stimmt mit «Gotchas», «Branches» überein. Das Mergen des Fix-Pull-Requests bei rotem `main` fällt unter «When to ask» («merging with a red check (also one red on `main`)»), CLAUDE.md:84. Der Skill verweist mit «through this skill again» auf seine Zeile «Never without the product owner», SKILL.md:28. Das ist konsistent: Die Session stoppt dort mit einer Frage. Ein Widerspruch ist es nicht.
- **Ponytail:** Nichts ungenutzt, keine Kopie eines bestehenden Helfers.
- **Kein unbeteiligter Diff:** Alle Änderungen gehören zu Anforderung (1) oder (3).
- **Szenario:** `No scenario: CI configuration`. Das Verhalten der App ändert sich nicht.

## Nicht bestätigt

- **Vom Aufrufer gemeldet**, nicht erneut ausgeführt:
  - `bun run lint`, `bun run check`, `cd backend && bun run type-check`
  - `bunx vitest run tools/deepcheck/test/workflows.test.ts tools/open-work src/__tests__/open-work.test.ts tools/claude-hooks/commit-msg-gate.test.ts tools/ci`
  - YAML parst
  - `bunx playwright test --list` mit 3240 bzw. 1098 Tests. Nicht erneut ausgeführt, weil `bddgen` Dateien schreibt.
- **Timeout-Ergebnis `cancelled` (C-1):** aus der Kenntnis des Verhaltens von GitHub Actions. Hier nicht in einem echten Lauf beobachtet.
- **Laufzeit eines vollen CI-Laufs auf `main` (C-2):** nicht gemessen. Gesucht in ci.yml (timeout-minutes 60 pro Shard), keine Laufhistorie gelesen.
- **`send_later`:** Ob dieses Werkzeug in den Sessions verfügbar ist, ist nicht prüfbar. Erwähnt wird es nur in `docs/reviews/b15-instructions-opus55-review-1.md:50`.
- **Verzögerung des Suchindex:** `gh issue list --search` nutzt die Suche. Ein gerade eröffnetes Issue könnte kurz nicht gefunden werden. Ebenso könnten ein Nightly und ein Push-Lauf (verschiedene Concurrency-Gruppen) gleichzeitig je ein Issue eröffnen. Beides ist unwahrscheinlich und ungetestet.
