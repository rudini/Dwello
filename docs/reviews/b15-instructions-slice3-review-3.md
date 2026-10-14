# Review B-15 Slice 3 (Runde 3): PR öffnen, Konflikte lösen, bei Grün mergen

Geprüft im Worktree `review-slice3-r3-code-reviewer` (detached auf ced248f): `git show ced248f` (CLAUDE.md:69, `.claude/settings.json`, `implementation_plan.md`, `docs/reviews/b15-instructions-slice3-review-2.md`). Gelesen: CLAUDE.md:64-71 und :93, `.claude/settings.json` ganz, implementation_plan.md:50-70.

## Stand der offenen Befunde

| ID | Stand |
|----|-------|
| C-10 (Major) | behoben. CLAUDE.md:69 sagt jetzt «merging while a Blocker/Major is open (the two kinds Workflow 7 lets a task finish with included)». Open-Work-Minors halten den Merge nicht mehr auf. Die zwei Arten aus Workflow 7 brauchen ausdrücklich eine Freigabe. Das passt zu Plan-Punkt 17. |
| C-11 | behoben («If CI still runs when you must stop … say under "Blocked on me" that it waits for CI and is not merged»). |
| C-12 | zum Teil behoben, siehe C-16. |
| C-13 | behoben (der Screenshot-Kommentar wird jetzt nach dem Merge im Schlussbericht genannt). |
| C-14 | behoben (implementation_plan.md:61: «merging red or with an open Blocker/Major»). |
| C-15 | Ablehnung trägt: Workflow 4 verbietet ein Amend, solange ein Reviewer läuft. Der Plan nennt C-9 aus Slice 1 Runde 2 (Zeile 53). |

Keine neue Lücke und kein neuer Widerspruch in «Keep going», Workflow 7 und den Schluss-Überschriften. «Blocked on me» (CLAUDE.md:71) nimmt den Fall «wartet auf CI» über die Regel in :69 auf, und die Ausnahme ist mit Workflow 7 abgeglichen. `mcp__github__merge_pull_request` steht nicht unter `ask` (auch kein Wildcard-Eintrag `mcp__github__*`). Der eigene Merge der Session wird also nicht aufgehalten. Die neuen Bash-Muster treffen den eigenen Push der Session (`git push -u origin <branch>`, auch mit `git -C`) nicht.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-16 | Minor | implementation_plan.md:66, CLAUDE.md:93 | Gleiche Art wie C-12. Die Begründung, warum ein blosses `git push` bei ausgechecktem `main` ohne Muster bleibt («the Branches rule forbids working on `main`»), steht so nicht in CLAUDE.md:93. Dort steht nur «work only on a named branch», und `main` ist ein benannter Branch. Entweder die Branches-Zeile ergänzen («never `main`») oder die Begründung im Plan richtigstellen. |
| C-17 | Nit | .claude/settings.json:54-55 | `mcp__github__push_files` und `mcp__github__create_or_update_file` fragen bei jedem Branch nach, nicht nur bei `main`. Pusht eine Session ihren eigenen Branch über MCP statt mit `git push`, bekommt sie eine Rückfrage, obwohl CLAUDE.md:69 diesen Push erlaubt. Das ist harmlos, weil `git push` der übliche Weg ist. Pro Branch lässt sich die Regel nicht eingrenzen. |
| C-18 | Nit | .claude/settings.json:50-52 | Die Muster `*refs/heads/main*`, `git -C * push * main*` und `*:main*` treffen auch Branches, die mit `main` beginnen (`main-fix`, `maintenance`). Folge: nur eine unnötige Rückfrage. Bei den Mustern ohne `-C` (Zeilen 46-49) ist das nicht so; die Muster sind also uneinheitlich. |

Kein Blocker und kein Major offen.

## Nicht bestätigt

- `.claude/settings.json` parst: selbst geprüft (`python3 json.load`, ok).
- `src/__tests__/open-work.test.ts` und `tools/claude-hooks/commit-msg-gate.test.ts` (21 grün): «vom Aufrufer gemeldet». Ein erneuter Lauf scheiterte, weil eine Deny-Regel den Zugriff auf `node_modules` blockiert hat.
- Wie die `ask`-Muster passen (C-16 bis C-18), ist aus der Glob-Semantik der Bash-Regeln abgeleitet (`*` passt auf beliebige Zeichen, auch Leerzeichen). Mit einem echten Permission-Prompt ist das nicht getestet. Ebenfalls offen, wie in Runde 2: ob `ask` im Modus Auto oder `bypassPermissions` noch nachfragt.
- Ob `mcp__github__merge_pull_request` bei roten Checks, die nicht Pflicht sind, oder mit `merge_method: squash` mergt, verhindert nur der Text (CLAUDE.md:69). Branch-Protection und Required Checks von `main` sind nicht lesbar (Runde 1: 403).
