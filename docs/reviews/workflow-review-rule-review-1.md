# Code-Review workflow-review-rule, Runde 1

Geprüft: Worktree `review-wfrule-code-reviewer`, Commit `7bae4dc`, `git diff origin/main...HEAD` (Commits 1b2eb62, 7bae4dc). Gelesen: beide geänderten Dateien (`CLAUDE.md`, neuer Absatz Zeile 67; `docs/archive/implementation-plan-verlauf.md`, Zeilen 5763–5771), dazu `implementation_plan.md`, `src/__tests__/open-work.test.ts`, die Liste `docs/reviews/` (insbesondere `workflow-rules-review-1.md` und `-9.md`), `.claude/agents/*.md`, `.claude/skills/*/SKILL.md`, `tests/e2e/CLAUDE.md`, `backend/CLAUDE.md` (per Suche nach `docs/reviews` und «Blocked on me»).

Ergebnis: Der Absatz erfüllt die Anforderung im Kern: er gilt für jedes Feature, umfasst Instruktionen, Skills, Agents und Hooks, nennt den Pfad `docs/reviews/workflow-rules-review-*.md`, verlangt nur das Review und verbietet die Umsetzung. Ein Major: Der Absatz verweist auf «Blocked on me», und laut `CLAUDE.md:76` heisst ein Eintrag dort «stop». Ein Agent, der das wörtlich nimmt, hält vor dem Pull Request an.

## Befunde

| ID | Schweregrad | Datei:Zeile | Befund |
|----|-------------|-------------|--------|
| C-1 | Major | `CLAUDE.md:67` (mit `:76`, `:78`) | «name it under "Blocked on me"» und «I decide which to apply» ergeben zusammen mit «When something waits for my approval or a decision, say so once under "Blocked on me" and stop» einen Halt vor Schritt 9 (Pull Request, Merge) nach jedem Feature. |
| C-2 | Minor | `CLAUDE.md:67` | Der Dateiname `workflow-rules-review-<slice>.md` liegt im selben Namensraum wie die Berichte aus Schritt 6 für den Slice «workflow-rules»: `docs/reviews/workflow-rules-review-1.md` bis `-9.md` sind Code-Reviews. Ein Glob `workflow-rules-review-*.md` findet beide Arten. `<slice>` ist für ein Feature mit mehreren Slices nicht festgelegt. Ein zweiter Workflow-Review mit demselben Slice-Namen überschreibt den ersten, weil die Rundennummer fehlt. |
| C-3 | Minor | `CLAUDE.md:67` | «feature» ist nicht abgegrenzt. Offen bleibt, ob der Review auch bei sichtbaren Bugfixes (Schritt 1: «feature or behavior change») gilt, bei Aufgaben ohne App-Code (wie dieser) und bei Aufgaben, die nach Schritt 7 mit offenem Blocker/Major unter «Blocked on me» enden. Gerade diese Aufgaben zeigen am ehesten Regelprobleme, und nach «once a feature is done» fallen sie weg. |
| C-4 | Minor | `CLAUDE.md:84-85` | Unter «Open work» steht weiter «There is no other list» und «A point you find but do not fix becomes an issue … in the same task». Die Ausnahme steht nur in Schritt 7. Wer nur «Open work» liest, eröffnet für die Befunde Issues. Ein Rückverweis würde das verhindern. |
| C-5 | Nit | `CLAUDE.md:67` | Es fehlt die Angabe, ob die Review-Datei vor dem Push committet wird und ob sie einen Punkt im Plan bekommt. Schritt 8 archiviert die Session «before the final commit», aber der Review fällt danach an («before the pull request»). |
| C-6 | Minor | `docs/archive/implementation-plan-verlauf.md:5768` | «Session archived» ist abgehakt, `implementation_plan.md` ist leer, und laut Aufrufer ist PR #172 schon offen, obwohl code-reviewer Runde 1 noch läuft. Das widerspricht Schritt 8 («When the task is done») und Schritt 9 («push nothing before the task is done»). Die Zeile «code-reviewer round 1 (…)» aus Schritt 6 hat keine Session in `implementation_plan.md`, in die sie gehört. |
| C-7 | Nit | `CLAUDE.md:67` | Im Umfang fehlen Regeldokumente, die `CLAUDE.md` selbst verbindlich nennt: `docs/test-pyramid.md`, `docs/design/personas/README.md` und `.github/ISSUE_TEMPLATE/`. Die Anforderung sagt «etc.». |

## C-1 (Major): Workflow-Review unter «Blocked on me» stoppt die Aufgabe vor dem Pull Request

**Warum falsch:** `CLAUDE.md:76` sagt: «When something waits for my approval or a decision, say so once under "Blocked on me" and stop, without asking again.» Der neue Absatz verlangt, den Bericht unter «Blocked on me» zu nennen, und sagt im selben Satz «I decide which to apply». Die Befunde warten also auf eine Entscheidung. `CLAUDE.md:78` beschreibt «Blocked on me» als «decisions, open Blocker/Major, new issues and rows». Ein Workflow-Review gehört in keine dieser Kategorien und blockiert nichts. Er passt zu «Found».

**Wie es fehlschlägt:** Ein Agent schliesst ein Feature ab (Schritt 7). Er schreibt `docs/reviews/workflow-rules-review-x.md` mit zwei Vorschlägen. Er nennt den Bericht unter «Blocked on me», wie verlangt, und wendet `:76` an: Es wartet etwas auf die Entscheidung des Product Owners, also «stop». Er beendet den Lauf ohne Push, ohne Pull Request und ohne Merge (Schritt 9). Das passiert nach jedem Feature, das einen nicht leeren Workflow-Review hat. «before the pull request» legt nur die Reihenfolge fest und sagt nicht, dass es danach weitergeht. Auch die Variante «No findings» landet unter «Blocked on me», obwohl nichts entschieden werden muss.

**Behebung (Vorschlag):** Den Bericht unter «Found» (oder «Changed») nennen und ausdrücklich ergänzen: «it does not hold up step 9».

## Nicht bestätigt

- `bunx vitest run src/__tests__/open-work.test.ts`: im Worktree erneut ausgeführt, 4/4 grün. `docs/reviews` und `docs/archive` sind dort ausgenommen (`open-work.test.ts:16-22`). Der neue Absatz bricht also keinen Test.
- Kein Werkzeug parst den Wortlaut von `CLAUDE.md` Schritt 7 oder die Dateinamen in `docs/reviews/`. Gesucht habe ich in `src/__tests__`, `tools/`, `.claude/hooks`, `.claude/agents`, `.claude/skills`. `tools/deepcheck/test/readme.test.ts` und `tools/claude-hooks/commit-msg-gate.test.ts` nennen `CLAUDE.md`, betreffen aber andere Abschnitte. Das habe ich nur per Suche geprüft, die Tests habe ich nicht ausgeführt.
- Lint, check, deepcheck:audit und die vollständigen Suites hat der Aufrufer nicht ausgeführt, und ich auch nicht. Bei einer reinen Doku-Änderung ist das ohne Folgen.
- Dass PR #172 vor diesem Review gepusht wurde (C-6), habe ich nur aus der Angabe des Aufrufers. Auf GitHub habe ich es nicht geprüft.
- Archiveintrag: Die Nummer 34 folgt auf die höchste bisherige (33; «Session 32» kommt im Archiv schon vorher doppelt vor, nicht durch diesen Diff). Die Zeilen «Files:» und «Skills:» haben dieselbe Form wie in Session 32 (demo VM). Die Zeile für code-reviewer Runde 1 fehlt noch (siehe C-6).
