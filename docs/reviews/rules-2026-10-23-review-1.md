# Code-Review Runde 1: Workflow-Review 2026-10-23 anwenden (ef632e62)

Bereich: `git diff ef632e62^ ef632e62`, Worktree `review-rules` (detached auf ef632e62).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Blocker | `.github/workflows/ci.yml:84-86`, `:130`; `tools/open-work/check-issues.mjs:40-43` | Der Job `static-checks` hat nur `contents: read, issues: read`; `GET pulls/<n>` braucht `pull-requests: read`. In einem privaten Repo schlägt deshalb jeder Pull Request entweder mit Exit 1 fehl (403) oder liest still einen leeren Text (404) |
| C-2 | Major | `.claude/skills/slice-review/SKILL.md:41`; `CLAUDE.md:90` | Die neue Regel «Minor, auf den zwei oder mehr Personas stossen, wird ein Issue (`CLAUDE.md`, "Open work")» verweist auf eine Regel, die das Gegenteil sagt: «from reviews only the two kinds of Blocker/Major». `CLAUDE.md` hat Vorrang, also wird der Entscheid L4 nicht umgesetzt |
| C-3 | Minor | `tools/open-work/check-issues.mjs:40-43` | Eine Antwort auf `pulls/<n>`, die nicht OK ist und weder 401 noch 403 lautet (404, 500 mit JSON), ergibt `body` undefined, also `''`. Damit sind die Prüfung «closes #n, but markers still name it» und die Prüfung «No scenario» still abgeschaltet, statt dass der Lauf fehlschlägt oder auf `PR_BODY` zurückfällt. Für diesen Fall gibt es keinen Test |
| C-4 | Minor | `tests/e2e/CLAUDE.md:65,74` | Der neue Grund «fix of a red `main` whose failing scenario covers it unchanged» steht unter dem Einleitungssatz «A state the E2E stack cannot produce gets a lower-layer test». Beides stimmt für diesen Fall nicht: Das Szenario erzeugt den Zustand, und einen Test auf tieferer Ebene braucht es nicht. Der Satz verlangt also etwas, das der Entscheid L7 nicht meint |
| C-5 | Minor | `tests/e2e/CLAUDE.md:78` | «takes that instance's settings lock»: Die frische Installation hat kein «settings lock», sondern `withLock('installation')` (`tests/e2e/fixtures/settings-lock.ts:26,36`; `tasks/accessibility.ts:721`). Für die KI-Einstellung, den Fall aus L3, zeigt die Regel damit auf den falschen Lock |

## C-1 (Blocker)

**Warum falsch:** Sobald ein Job einen `permissions`-Block hat, stehen alle nicht genannten Rechte auf `none` (`ci.yml:84-86`: nur `contents: read`, `issues: read`). Das Repo `rudini/Dwello` ist privat (`gh api repos/rudini/Dwello` → `private`). Für `GET /repos/{o}/{r}/pulls/{n}` braucht `GITHUB_TOKEN` das Recht «Pull requests: read». Die Folgen:
- **Bei 403:** `get()` endet mit «Cannot read issues … check GITHUB_TOKEN» und Exit 1. Damit ist `static-checks` auf jedem Pull Request rot.
- **Bei 404:** Es greift C-3: `prBody` ist leer, und beide Prüfungen am Text des Pull Requests sind abgeschaltet, auch die bisher funktionierende Prüfung «markers still name it».

Der neue Test kann das nicht zeigen, weil er einen Stand-in-Server ohne Rechteprüfung nutzt.

**So lässt es sich zeigen:** Der erste CI-Lauf eines Pull Requests auf diesem Commit, Schritt `node tools/open-work/check-issues.mjs`. Lokal geht es auch: mit einem Token ohne Pull-Request-Recht `GET repos/rudini/Dwello/pulls/<n>` aufrufen.

**Fix:** `pull-requests: read` im Job `static-checks` ergänzen. Zusätzlich C-3 beheben, damit ein fehlendes Recht laut fehlschlägt.

## C-2 (Major)

**Warum falsch:** Der Entscheid L4 «same Minor → issue» steht nur im Skill `slice-review`. Der Satz in `CLAUDE.md` «Open work» lässt aus Reviews weiterhin nur Blocker/Major zu, die «Done means» nennt. Der neue Skill-Satz beruft sich ausdrücklich auf genau diesen Abschnitt.

Ein Agent, der `CLAUDE.md` folgt (geht vor), eröffnet kein Issue. Ein Agent, der dem Skill folgt, verstösst gegen `CLAUDE.md`. Das ist der Fall «two instructions that disagree».

**So lässt es sich zeigen:** `CLAUDE.md:90` und `.claude/skills/slice-review/SKILL.md:41` nebeneinander lesen.

**Fix:** In `CLAUDE.md` «Open work» die Ausnahme ergänzen, etwa «…; from reviews only the two kinds of Blocker/Major "Done means" names, and a Minor two or more personas meet in the same place».

## Nicht bestätigt

- Ob GitHub bei C-1 mit 403 oder mit 404 antwortet: Ohne CI-Lauf liess sich das nicht prüfen. Beide Fälle sind beschrieben.
- Vom Aufrufer gemeldet: `bun run lint` OK, `bun run check` 0 Fehler, `bunx vitest run --changed origin/main` 123 bestanden, `bash -n persona-stack.sh` OK, `src/__tests__/open-work.test.ts` und `tools/deepcheck/test/readme.test.ts` grün.
- Selbst erneut ausgeführt: `bunx vitest run tools/claude-hooks/commit-msg-gate.test.ts tools/open-work/check-issues.test.ts`, 30 bestanden.
- Ob die beiden neuen Tests ohne die Änderung rot wären, habe ich durch Lesen beurteilt. Der Push-Test erwartet Status 2, den der alte Hook nie liefert. Der API-Test erwartet Exit 1, obwohl `PR_BODY` leer ist. Beide wären also rot.

Geprüft: Hook `commit-msg-gate.mjs`, nämlich Regex aus `gitCalls`, `git -C` über `dirOf`, Filter für Scratch-Repos, Ausnahme für Merges wie in der CI (`ci.yml:119`), still durchgelassen ohne `origin/main`, Zusammenspiel mit der Commit-Prüfung im selben Befehl; Hook läuft bei jedem Bash-Aufruf (`.claude/settings.json:153-167`); Push auf `main` ohne `PR_NUMBER` fällt auf `PR_BODY` zurück; `setsid nohup` in `persona-stack.sh`; Aussagen stimmen mit dem Code überein: `*.svelte.dom.test.ts` mit `$state` (`vitest.config.ts`, `ki-settings-page.svelte.dom.test.ts`), stdout des Backends (Playwright-Standard `stdout: 'ignore'`, keine Überschreibung in `playwright.config.ts`), `default` zuerst (alle Bildschirme in `screens.json`), `llm:eval` über `DATABASE_URL`; Prettier-Befehl wie in `ci.yml:125`; übrige Regeltexte entsprechen der Entscheidtabelle L1–L11; nichts Fremdes im Diff.
