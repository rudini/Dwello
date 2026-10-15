# Code-Review: Workflow-Regeln aus den Reviews angewendet (Runde 2, Delta)

Geprüft: Worktree `review-rules-r2`, Commit `3d41a3a` (detached), Delta `git diff eee15f1 3d41a3a`, 13 Dateien. Alle gelesen, der Bericht aus Runde 1 (`docs/reviews/workflow-rules-apply-review-1.md`) als Grundlage. Massstab: `opus-guidance.md`. Gelesen dazu: `.claude/hooks/commit-msg-gate.mjs` (ganz), `tools/claude-hooks/commit-msg-gate.test.ts`, `tools/deepcheck/test/helpers.ts`, `.claude/settings.json` (Hook-Aufruf), `src/__tests__/design-guard.test.ts:15-54`, `src/lib/server/statement.ts:97-111`, `backend/scripts/llm-eval.ts`, `backend/CLAUDE.md:15-18`, `tests/e2e/CLAUDE.md:13-16`, `docs/reviews/workflow-rules-review-issue-125.md` (R-2), `docs/reviews/workflow-rules-review-5.md` (W-28).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-19 | Minor | `backend/CLAUDE.md:18` vs. `CLAUDE.md:54` | C-6 ist nur zur Hälfte behoben. `CLAUDE.md` verlangt `llm:eval` jetzt nur noch bei einer Änderung am Prompt von `proposeAllocability`. `backend/CLAUDE.md:18` sagt weiterhin «`llm:eval` is run before and after a change to a KI prompt», also bei jedem Prompt. Die beiden Regeln widersprechen sich |
| C-20 | Minor | `tools/claude-hooks/commit-msg-gate.test.ts:56-75`, `.claude/hooks/commit-msg-gate.mjs:19` | Der Zweig `!repository` (Verzeichnis ist kein Repository oder `git` scheitert, dann wird der Commit geprüft) hat keinen Test. Alle Fälle laufen mit einem cwd, das ein Repository ist (ROOT, Scratch-Repo, Worktree). Ohne `!repository ||` bleiben alle Tests grün, und das Gate liesse einen solchen Commit ohne Prüfung durch |
| C-21 | Minor | `CLAUDE.md:53` | C-4 ist nur teilweise behoben. Die Ausnahme «only a step that needs a screen element the change creates is written with the code» trifft weiterhin fast jede neue UI-Funktion. Sie ist auch unnötig: Ein Schritt, der auf ein noch fehlendes Element (`data-testid`) wartet, scheitert genau an der fehlenden Funktion. `tests/e2e/CLAUDE.md:16` sagt selbst: «a step waiting for a missing element fails after 10 s» |
| C-22 | Minor | `CLAUDE.md:67` | C-9 ist durch die Definition von «app code» (`src/`, `backend/src/`, `backend/migrations/`, `messages/`) behoben, sie lässt aber `tests/` und `.claude/hooks/` aus. Damit wird ein Fix zu einem Minor-Befund, der ein E2E-Szenario, eine Assertion oder ein Gate ändert, nie wieder geprüft. Der `code-reviewer` prüft aber gerade dort, ob die Szenarien gleich streng bleiben |
| C-23 | Minor | `docs/reviews/workflow-rules-findings-summary.md:60` | Die Ablehnung von 125 R-2 (zweite Hälfte) trägt nicht. Der Vorschlag lautete «the guard allows **exactly** that», also nur Systemfarben in `<style>`. Der Guard lässt in einem `<style>`-Element aber auch `color: red` durch, denn `design-guard.test.ts:19` erfasst nur Hex- und Funktionsfarben, `:21` nur `style`-Attribute. `token-referenz.md:3` («only the browser's system colours») wird dort also nicht durchgesetzt. Der Ablehnungsgrund müsste das sagen, oder die Lücke wird offene Arbeit |
| C-24 | Nit | `.claude/hooks/commit-msg-gate.mjs:16` | `project` wird auf oberster Ebene berechnet, also startet jeder Bash-Aufruf einen `git`-Prozess, auch ohne `git commit`. Fehlt `git` im PATH, ist `spawnSync(...).stdout` gleich `null`, und der Hook bricht bei jedem Bash-Aufruf mit Status 1 ab (nicht blockierend, Stacktrace auf stderr). Praktisch harmlos, weil ohne `git` auch kein Commit läuft |
| C-25 | Nit | `implementation_plan.md:15` | Die Checks-Zeile nennt noch 2438 Tests; auf `3d41a3a` meldet der Aufrufer 2439 |

Keine Blocker/Major.

## Commit-Gate (gezielt geprüft, nachgestellt mit dem Hook aus dem Worktree, Eingabe als PreToolUse-JSON)

| Fall | Ergebnis |
|---|---|
| cwd `/home/user/Dwello` (Haupt-Checkout), Betreff `bad.` | Status 2, blockiert |
| cwd = dieser Worktree im Scratchpad (ausserhalb des Projektordners) | blockiert |
| Hook des Haupt-Checkouts, cwd = Worktree im Scratchpad | blockiert (gleiches `--git-common-dir`, `/home/user/Dwello/.git`) |
| cwd `backend/`, cwd `/home/user/Dwello/.git` | blockiert |
| cwd = anderes Repository (`git init` im Scratchpad) | Status 0 |
| `git -C <anderes Repo> commit`, auch relativ (`-C ../r2exp/other`) | Status 0 |
| `cd <anderes Repo> && git commit …` bei cwd Dwello | blockiert (`cd` wird nicht verfolgt, wie dokumentiert) |
| cwd kein Repository / Verzeichnis existiert nicht | blockiert (`repositoryOf` liefert `''`, sichere Richtung) |
| `git` nicht im PATH | Status 1, Absturz bei `.stdout.trim()`; Claude Code wertet das als nicht blockierenden Fehler (C-24) |

Der Text in `CLAUDE.md:97` («commits in another repository (a scratch repository, reached by `git -C` or the cwd, not by a `cd` in the command) pass; a worktree of Dwello is checked wherever it lies») stimmt mit diesem Verhalten überein. Nicht erwähnt ist, dass ein cwd ohne Repository geprüft wird. Das ist die sichere Richtung und braucht keinen Text. `--path-format=absolute` braucht git ≥ 2.31 (hier 2.43). Mit einem älteren git wäre die Ausgabe leer, und es würde wieder alles geprüft (sichere Richtung).

## Status C-1 bis C-18

| ID | Status | Beleg |
|---|---|---|
| C-1 (Major) | behoben | Entscheid nach `git rev-parse --git-common-dir` (`commit-msg-gate.mjs:14-20`). Test «checks a worktree of the project outside its folder» (`commit-msg-gate.test.ts:63`), rot mit dem Hook von `eee15f1` laut Plan. Nachgestellt, siehe Tabelle oben |
| C-2 (Major) | behoben | `CLAUDE.md:53`: «how the UI shows a refusal its own checks never send to the backend». Der Wortlaut ist etwas holprig, beschränkt die Ausnahme aber wie verlangt |
| C-3 | behoben | `cd` wird nicht mehr ausgewertet. Testfälle `cd /tmp && …` und `(cd /tmp && git commit -m a) && …` blockieren (`test.ts:43-44`) |
| C-4 | teilweise | Die Schritte kommen jetzt zuerst. Die verbliebene Ausnahme ist C-21 |
| C-5 | behoben | Satzbruch korrigiert |
| C-6 | teilweise | `CLAUDE.md:54` auf `proposeAllocability` beschränkt, stimmt mit `llm-eval.ts:10,56` überein. Der Widerspruch zu `backend/CLAUDE.md:18` ist C-19 |
| C-7 | behoben | «which you run before starting the persona and name in its task» (`CLAUDE.md:61`) |
| C-8 | behoben | Vorbehalt «no persona can reach a new text of it» ergänzt |
| C-9 | behoben, Rest als C-22 | Schritt 6 und 9 verwenden jetzt denselben Begriff «app code» mit Definition |
| C-10 | behoben | Ausnahme eng gefasst, jede andere Änderung an einem entschiedenen Text braucht den Product Owner |
| C-11 | behoben | «merged only after the product owner made the edit» (`CLAUDE.md:45`) |
| C-12 | behoben, Rest als C-23 | 135 W-4 als «in part» mit Grund, 125 R-2 zweite Hälfte abgelehnt, 202 #3 ergänzt |
| C-13 | behoben | Skills-Zeile mit `ponytail-review`, Zeile zu `session-start.sh` widerspruchsfrei |
| C-14 | behoben | `token-referenz.md:3` nennt `<meta name="color-scheme">`, wie `statement.ts:107`. «literal colour (hex, `rgb()`, `oklch()`)» statt «colour value» |
| C-15 | behoben | «before the git call» in allen drei Gates |
| C-16 | behoben | `personas/README.md:5` |
| C-17 | behoben | `test-pyramid.md:33` |
| C-18 | behoben (dokumentiert) | Kommentar nennt die Nebenwirkung (`no-german-in-code.test.ts:8-9`) |

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht wiederholt:** `bun run lint`, `bun run check`, `bun run deepcheck:audit`, `bunx fallow audit`, `bun run test:coverage` (152 Dateien, 2439 Tests, einmal Timeout in `tools/deepcheck/test/check.test.ts`), Backend `bun run test` (614) und `type-check`. **Selbst wiederholt:** `bunx vitest run tools/claude-hooks/commit-msg-gate.test.ts src/__tests__/no-german-in-code.test.ts`: 2 Dateien, 364 Tests grün.
- **Rote Phase von C-1/C-3** (`implementation_plan.md`): nicht durch Einsetzen des Hooks von `eee15f1` nachgeprüft. Dass der alte Hook die drei Fälle durchliess, folgt aber aus Runde 1 (dort nachgestellt).
- **Ob Claude Code im Hook-Input als `cwd` das nach einem früheren `cd` beibehaltene Verzeichnis liefert:** nicht nachprüfbar, ohne den Hook in einer echten Session auszulösen. Davon hängt nur ab, ob ein Scratch-Commit über ein früheres `cd` durchgeht. In beiden Fällen bleibt Dwello geprüft.
- **Mutation `!repository ||` entfernt (C-20):** nur durch Lesen der Testfälle bestätigt, nicht ausgeführt (keine Dateien im Worktree geändert).

Urteil: mergebar. C-1 und C-2 sind behoben, keine neuen Blocker/Major; offen bleiben die Minors C-19 bis C-23 und die Nits C-24 und C-25.
