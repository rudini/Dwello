# Code-Review wfr1108, Runde 1

Bereich: `git diff 23e679bdb 44ff72f70 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` (Worktree `review-wfr1108-code`), dazu die zwei «Decided»-Absätze in `docs/reviews/workflow-rules-review-2026-11-07.md` und `-11-08.md`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | .claude/hooks/fitness-gate.sh:36 | Der Rückfall ohne `origin/main` (Lauf ohne `--base`) hat keinen Test: Der erste Test läuft zwar ohne `origin/main`, prüft aber die Argumente nicht (`ran` wird nicht gelesen). Schreibt man die Zeile so um, dass immer `--base origin/main` übergeben wird, bleibt jeder Test grün. Mit dem echten `fitness.ts` würde `git merge-base` dann scheitern, die Zusammenfassungszeile fehlen und der Hook mit einem Hinweis durchlassen, also gar nicht mehr sperren. |

Keine Blocker oder Majors.

Geprüft: Anforderung 1 (Hook mit Pfadfilter, Verb-Prüfung über `git-calls.mjs`, Sperre mit exit 2 und Fehlerzeilen, Hinweis ohne Zusammenfassungszeile, Eintrag in `settings.json` mit Timeout, Zusammenfassungszeile unbedingt vor `process.exit`, auch bei `--format github` wie in CI; `bun` in CI-Job `unit-tests` vorhanden; Doku in `commit-gates`, `CLAUDE.md` Gotchas, «Before marking anything complete» und `fitness-functions.md`), Anforderung 2 (`i18n` + `svelte-kit sync` vor dem Build, «not ready» mit `tail` des Logs unter `set -e`; der Sync ohne `BUILD_DIR` erzeugt die `.svelte-kit/tsconfig.json`, die die tsconfig im Root erweitert, das Build-`outDir` `.svelte-kit/persona` synchronisiert Vite selbst), Anforderungen 3 bis 5 am geänderten Text (`grill-me` Schritt 1, `CLAUDE.md` Workflow 1 und 7, `pull-request` «Before each push» 2, untereinander stimmig). Rot-Begründung jedes neuen Tests aus dem Lesen nachvollziehbar. Nichts im Diff ohne Bezug zur Anforderung.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run src/__tests__/open-work.test.ts tools/claude-hooks tools/fitness tools/deepcheck/test/readme.test.ts tools/testcheck/test/wiring.test.ts tests/unit` (354), Prettier --check auf den neuen Dateien, die Rot-Läufe der Hook-Tests und des Tests der Zusammenfassungszeile, der Hook-Lauf von Hand (exit 0 in 3.5 s), der Rot- und Grün-Lauf der Build-Folge von `persona-stack.sh` in einem frischen Worktree.
- Das ganze Skript `persona-stack.sh` (braucht PostgreSQL) lief nicht, auch beim Aufrufer nicht; gelesen habe ich nur den Build-Zweig und den `set -e`-Ablauf davor.
- `tools/open-work/check-issues.mjs` lief nicht (kein GITHUB_TOKEN, laut Aufrufer).
- Commits in einem anderen Worktree (`git -C`, `cd`): Der Hook prüft `git status` von `CLAUDE_PROJECT_DIR`, nicht vom Worktree, in dem committet wird. Das ist dieselbe Konvention wie bei fallow, deepcheck und testcheck (`commit-gates`). Ob Slice-Commits von Subagenten in eigenen Worktrees so nie durch das Fitness-Gate laufen, habe ich nicht geprüft; dazu müsste man wissen, wie `CLAUDE_PROJECT_DIR` für diese Sitzungen gesetzt ist.
