# W1 Code-Review 1 (44c17e3a..6b126632, Merge 772596ef)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | CLAUDE.md:74-83, implementation_plan.md:34 | T7 nur teilweise umgesetzt: Workflow 9, «When to ask» und die Schlussüberschriften stehen weiter in `CLAUDE.md`, und die Datei ist gewachsen statt geschrumpft (21669 -> 22217 Bytes). Der Plan hakt T7 trotzdem als erledigt ab. |
| C-2 | Minor | CLAUDE.md:70 vs. CLAUDE.md:74, .claude/skills/pull-request/SKILL.md:8, :24 | Die neue Ausnahme mit dem Draft-Pull-Request widerspricht Workflow 9 («push nothing before "Done means" holds») und `pull-request` Z. 8 («nothing is pushed before»). «Open and drive» kennt keinen Draft-Pfad: Es eröffnet einen normalen Pull Request und merged, obwohl Reviews fehlen. |
| C-3 | Minor | CLAUDE.md:103, CLAUDE.md:72 | «Branches» sagt «the closing round reviews the merge commit with the rest», und Workflow 7 sagt, vor jedem Push prüfe eine Schlussrunde «the code not reviewed yet». Beides stimmt nicht mehr, seit `pull-request` Z. 20 einen sauberen Merge und einen E2E-CI-Fix davon ausnimmt (T1, T3). |
| C-4 | Minor | vitest.config.ts:36-37 | `testTimeout: 20_000` gilt für das ganze Projekt `server`, also auch für alle `src/**/*.test.ts`. Vorschlag K3(e) wollte den längeren Timeout «only for the process-spawning tests in tools/». Ein hängender Unit-Test in `src/` schlägt jetzt erst nach 20 s statt nach 5 s fehl. |
| C-5 | Minor | docs/design/arbeitsregeln.md:5 | Dort steht weiter «`UBIQUITOUS_LANGUAGE.md` (never edit it)». Das widerspricht der neuen Regel in den Design-Regeln (K4). |
| C-6 | Minor | .claude/skills/tdd/SKILL.md:27 | Der Skill sagt: «list the behaviors in the checklist of `implementation_plan.md`». Parallele Sessions müssen die Datei laut dem neuen Plan-Header aber unberührt lassen und führen die Checkliste in der Beschreibung des Pull Requests (K1). |

## C-1 (Major)

**Warum falsch:** Die Anforderung lautet «apply every proposal», also auch T7. T7 schlägt vor, die Workflow-Schritte, die Reviewer nie brauchen, in die Skills zu verschieben, die sie ausführen (`pull-request`, `workflow-review`): Schritt 8, Schritt 9, «When to ask» und die Schlussüberschriften. Dann schrumpft `CLAUDE.md` für jeden der rund 100 Subagent-Läufe. Umgesetzt ist nur Schritt 8, und zwar in den Header von `implementation_plan.md`. Gleichzeitig kamen neue Sätze dazu (Workflow 2, 5, 7, «When to ask», Gotchas, Coding guidelines). Darum lädt jeder Subagent jetzt mehr als vorher. Das ist das Gegenteil des Ziels von T7. Der Plan-Eintrag «T7 move plan and pull-request details out of `CLAUDE.md`» ist abgehakt, beim Pull Request wurde aber nichts verschoben.

**Wie man es zeigt:**
- `git show 44c17e3a:CLAUDE.md | wc -c` ergibt 21669, `git show 6b126632:CLAUDE.md | wc -c` ergibt 22217.
- Die Zeilen 74 (Schritt 9), 76-81 («When to ask») und 83 (Schlussüberschriften) stehen unverändert in `CLAUDE.md`.

**Behebung:** Entweder Schritt 9, «When to ask» und die Schlussüberschriften verschieben. Oder die engere Auslegung im Plan festhalten (Workflow-Notiz) und den Product Owner fragen, ob T7 nur für Schritt 8 gelten soll.

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet, ich habe sie nicht wiederholt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (169 Dateien, 3406 Tests), die Tests der Regeldateien (40 grün) und der Handlauf von `persona-stack.sh` mit `--no-build --keep-db` und mit `--no-build`.
- K5: Dass fallow 2.104 im Standard-Gate `new-only` eine geerbte Klon-Gruppe als `"introduced": false` behält, habe ich nicht geprüft. `bun.lock` zeigt `fallow@2.104.0`, in `.fallowrc.json` und in `.claude/hooks/fallow-gate.sh` ist kein Gate-Modus gesetzt. fallow habe ich nicht ausgeführt.
- K13: Ob ein isolierter Worktree Schleifen wirklich verweigert, wie der Zusatz in «Formatting» sagt, ist hier nicht prüfbar. Das Verhalten kommt vom Harness, nicht aus dem Repo.
- Der Verweis «Hand-over» in Workflow 5 zeigt auf einen Abschnitt, der existiert (`slice-review` Abschnitt 4). Ob ein Worker ohne Koordinator schon in Workflow 4 an die Draft-Regel kommt, habe ich nicht entschieden: Der Satz steht nur unter Workflow 5, K2 nannte «Workflow 4/5».

Geprüft: Diese Vorschläge sind im geänderten Text umgesetzt: K1 bis K4 (ohne die alten Kopien aus C-5 und C-6), K6 bis K13 sowie T1 bis T6. Das gilt auch für die Punkte 2 und 3 aus dem Opus-5.5-Review: `fach-reviewer` meldet keine Nits mehr, eine Minor-Zeile startet keine eigene Runde, und eine Entscheidung bleibt bis zum Wiederaufnehmen stehen. In `persona-stack.sh` werden `--keep-db` und `--no-build` in beliebiger Reihenfolge erkannt, und `set -e` greift weiterhin beim letzten Glied der `||`-Listen. Der Merge 772596ef hat keine Konfliktauflösung, und der neue Abschnitt «After the merge» in `pull-request` liest sich stimmig mit den Sätzen des Slices.
