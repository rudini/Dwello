# Code-Review: kürzere CLAUDE.md (G-1, G-2, G-5, G-8), Runde 2 (Delta)

Geprüft: `git diff 5d38eb7 c0785c2` (ein Commit, `docs(config): restore two rules lost in the move`) im Worktree `review-shorter-code-2`. Alle fünf geänderten Dateien gelesen: `CLAUDE.md`, `.claude/skills/pull-request/SKILL.md`, `.claude/skills/slice-review/SKILL.md`, `implementation_plan.md` und `docs/reviews/shorter-review-1.md` (Bericht der Runde 1). Gegengelesen: `.claude/skills/workflow-review/SKILL.md`, `.claude/skills/tdd/SKILL.md:56`, `.claude/skills/bdd-acceptance/SKILL.md:321` und die alte `CLAUDE.md` (`git show 42a2147:CLAUDE.md`).

## Funde

| ID | Schwere | Datei:Zeile | Fund |
|---|---|---|---|
| C-5 | Nit (teilweise behoben) | `.claude/skills/bdd-acceptance/SKILL.md:321`, `CLAUDE.md:75` | Neu in «When to ask»: die mehrdeutige Anforderung und «Stop and ask» des Issues. Die Liste passt damit zu `tdd/SKILL.md:56` und zu den «Coding guidelines». Noch offen ist «Ask the user which page to prioritize next» in `bdd-acceptance`. Diese Rückfrage steht nicht in der Liste, die mit «Ask only» abschliessend klingt. |

Neue Blocker/Major aus dem Delta: keine.

## Status der Funde aus Runde 1

- **C-1 (Major): behoben.** `CLAUDE.md`, «Open work»: «Before starting a ready issue, look for open `entscheiden` issues on the same data and ask first when one would change the outcome.» Damit trifft auch der Verweis in «When to ask» wieder.
- **C-2 (Major): behoben.** Schritt 9 in `CLAUDE.md` ist immer geladen und enthält jetzt: «A stop hook outside this repo (`~/.claude/stop-hook-git-check.sh`) may ask to commit, amend or push earlier: it overrides neither step 4 nor this step.» Aus dem Skill ist der Satz entfernt, er steht also nur noch an einer Stelle.
- **C-3: behoben.** Schritt 7: «one closing `code-reviewer` round, its own slice for this limit».
- **C-4: behoben.** «When to ask» übernimmt jetzt den Wortlaut von `commit-gates`: «unless it is small and changes no behavior».
- **C-5: teilweise behoben**, siehe Tabelle.
- **C-6: behoben.** Exit-Codes, Szenario und `No scenario` sind aus dem Pull-Request-Text entfernt. Den `No scenario`-Fall prüft CI weiterhin («Open work»). «with their exit codes» beim `code-reviewer`-Prompt in Schritt 4 stand schon in der Basis `42a2147:CLAUDE.md:59`, ist also nicht neu.
- **C-7: behoben.** Neu steht in Schritt 2: «and its line says so».
- **C-8: behoben.** Split-Issues und der Fix, der zwei Issues schliesst, stehen jetzt in «Open work», das immer geladen ist. Der Skill verweist dorthin.
- **C-9: behoben.** In `slice-review` steht wieder «or contradictory».
- **C-10: behoben.** In Schritt 2 steht wieder «reproduces it first».
- **C-11: behoben.** Schritt 6 nennt jetzt die Ausnahme für den Übersetzungs-Wortlaut und verweist auf die Triage.
- **C-12: behoben.** In Schritt 5 steht wieder «UI changed, or what a screen shows changed (also through a backend change)».
- **C-13: behoben.** Der Installationsbefehl für mmx ist zurück.
- **C-14: abgelehnt, Begründung trägt.** Begründung im Plan: CI postet zu einem Pull Request ohne UI-Änderung keinen Screenshot-Kommentar, «or that there is none» deckt genau diesen Fall ab. Damit gibt es keine neue Pflicht, nur einen Abschluss, den man ehrlich schreiben kann. Den Beleg #264 habe ich nicht angesehen, siehe «Nicht bestätigt».
- **C-15: behoben.** Schritt 7 lässt `workflow-review` jetzt auch «at the end of a request that covered several issues» laden. Der Skill beschreibt dafür den «Collected review».
- **C-16: behoben, soweit G-2 es zulässt.** `pull-request` verweist jetzt auf «When to ask», statt die Liste zu wiederholen. In Schritt 6 und 7 bleiben das Rundenlimit und die Testpflicht als je ein Satz in `CLAUDE.md` stehen. Das verlangt G-2, und `slice-review` führt sie aus.

## Bestätigt

- **Keine Regel verloren:** Die drei Zeilen, die aus `pull-request` entfernt wurden, stehen jetzt in `CLAUDE.md` (Split-Issues und Fix für zwei Issues in «Open work», Stop-Hook in Schritt 9, Frageliste in «When to ask»). Die Liste «Never without the product owner» des Skills deckt «When to ask» vollständig ab: der Force-Push über den Punkt «destructive», alles andere über die letzte Zeile.
- **Wortzahl:** `wc -w CLAUDE.md` ergibt 3'211. Der Planeintrag wurde von 3'050 auf 3'200 nachgeführt.
- **Plan:** `implementation_plan.md` enthält nur die aktuelle Session. Die Zeile für `code-reviewer` Runde 1 hält das Format aus `slice-review` ein.
- **Commit-Subject:** `node .claude/hooks/commit-msg-gate.mjs --check "docs(config): restore two rules lost in the move"` endet mit exit 0.
- **Red-Notizen:** Das Delta ändert nur Markdown, ohne neue Tests oder Szenarien. Es braucht also keine `Red:`-Zeile.
- Selbst neu ausgeführt: `bunx vitest run tools/deepcheck/test/readme.test.ts tools/claude-hooks/commit-msg-gate.test.ts src/__tests__/open-work.test.ts tools/open-work/check-issues.test.ts`, 4 Dateien, 40 Tests grün.

## Nicht bestätigt

- `bun run lint` auf c0785c2 (exit 0): vom Aufrufer gemeldet.
- Die vollen Suites auf 5d38eb7 (`test:coverage`, `check`, Backend `test` und `type-check`): vom Aufrufer gemeldet. Weil das Delta nur Markdown ändert, sind sie für c0785c2 nicht nötig.
- Ob CI zu #264 tatsächlich keinen Screenshot-Kommentar gepostet hat (Begründung für C-14): nicht auf GitHub nachgesehen.
- Ob der Product Owner 3'211 Wörter statt der Zielgrösse «about 2'000» (G-1) annimmt. Die Begründung steht im Plan, eine Zustimmung habe ich nicht gesehen. Gleich wie in Runde 1.
