# Review: Workflow-Regeln aus `workflow-rules-review-issue-212.md` übernommen (Runde 1)

Worktree: `review-rules-212` (detached, 32c8bbc). Diff: `git diff fd87bba 32c8bbc` (4 Dateien, alle gelesen), dazu der Merge `git show fd87bba --cc`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | CLAUDE.md:54, backend/CLAUDE.md:18 | Ob der Task mit fehlendem Eval fertig ist, ob die PR geöffnet und gemergt wird und wann die Session stoppt, ist unklar. Workflow 1, Workflow 9, step 7, Z. 78 und `backend/CLAUDE.md` widersprechen sich. |
| C-2 | Minor | CLAUDE.md:72, CLAUDE.md:89 | Workflow 9 und «Open work» verlangen weiterhin ohne Ausnahme `Fixes #n`. Die neue Ausnahme `Refs #n` aus Workflow 1 ist dort nicht verwiesen. |
| C-3 | Minor | CLAUDE.md:54 | Mit `Refs #n` überspringt CI (`tools/open-work/check-issues.mjs:30-37`) die Prüfung, ob die PR ein Szenario ändert, weil die PR kein Issue schliesst. Die Regel sagt nicht, dass das Szenario oder `No scenario:` trotzdem in den PR-Text gehört. |
| C-4 | Minor | CLAUDE.md:54 | Die Regel nennt nicht, was nach dem Bericht des Product Owners geschieht: wer das Issue schliesst und was bei schlechtem Ergebnis passiert (z. B. neues `bug`-Issue oder Wiederaufnahme). |
| C-5 | Nit | docs/reviews/workflow-rules-findings-summary.md:10 | Die Zusammenfassung sagt «KI prompt changes need `llm:eval`». Die Regel gilt aber nur für den Prompt von `proposeAllocability`. Für die anderen Prompts gibt es keine Fälle, das ist ausdrücklich so gewollt. Die Zusammenfassung ist hier weiter gefasst als die Regel. |
| C-6 | Minor | docs/archive/implementation-plan-verlauf.md:6194 | Der Eintrag ist abgehakt und sagt «delta review below», darunter steht aber keine Zeile für den Delta-Review. Ausserdem liegt die Session schon im Archiv, obwohl der Review noch läuft. Laut Workflow 8 wird sie erst archiviert, wenn alles abgehakt ist. |

## C-1 (Major): Unklar, ob der Task mit fehlendem Eval fertig ist

Warum falsch: Die Sätze, die eine Session in diesem Fall befolgen muss, widersprechen sich.

- `backend/CLAUDE.md:18` (neu): «… which then is not the default model's and does not finish the task (`CLAUDE.md`, Workflow 1)».
- `CLAUDE.md:54` (neu): «the pull request says `Refs #n` instead of `Fixes #n`, the missing run goes under "Blocked on me", and the issue stays open until the product owner reports the result.» Workflow 1 sagt nirgends, dass der Task nicht fertig ist. Es setzt eine geöffnete PR voraus.
- `CLAUDE.md` Workflow 9: «push nothing before the task is done (step 7 …)». Wenn der Task laut `backend/CLAUDE.md` nicht fertig ist, darf es gar keine PR geben, die `Refs #n` sagen könnte.
- `CLAUDE.md:68` (step 7) zählt genau zwei Arten offener Punkte auf, mit denen ein Task unter «Blocked on me» enden darf. Der fehlende Eval ist keine davon.
- `CLAUDE.md:78`: «When something waits for my approval or a decision, say so once under "Blocked on me" and stop». Danach muss die Session vor dem Merge stoppen. Workflow 9 dagegen sagt, sie merge, sobald CI grün ist.
- Vergleich: `CLAUDE.md:45` regelt einen ähnlichen Fall eindeutig: «its pull request is merged only after the product owner made the edit». Die neue Regel enthält keine solche Aussage zum Merge.

Befund 1 im #212-Review verlangt: «require an `llm:eval` run with the default model before the task counts as done … keep the issue open». Die Regel muss also festlegen, ob der Task als fertig gilt, gepusht und gemergt wird und das Issue offen bleibt, oder ob er vor dem Merge stoppt. Die Opus-5.5-Leitlinie (Punkte 1, 3, 12) verlangt klare Regeln dafür, wann gestoppt und wann weitergemacht wird.

Wie zeigen: Spielen Sie den Fall durch, den #212 selbst hatte: Eine Cloud-Session ändert den Prompt und kann `qwen2.5:3b` nicht ziehen. Nach `backend/CLAUDE.md` + Workflow 9 pusht sie nicht. Nach Workflow 1 öffnet sie eine PR mit `Refs #n`. Nach Workflow 9 + step 7 merget sie bei grünem CI. Nach Z. 78 stoppt sie. Für jeden der drei möglichen Wege gibt es einen Satz, der ihn verlangt.

Vorschlag: Ein Satz in Workflow 1 legt das fest, zum Beispiel: «… the task counts as done without it: open and merge the pull request with `Refs #n` …» oder «… merge only after the product owner reports the result». Den Halbsatz in `backend/CLAUDE.md` daran angleichen. In step 7 und Workflow 9 auf die Ausnahme verweisen (siehe auch C-2).

## Abgleich mit den Befunden des #212-Reviews

- 212 #1: übernommen in `CLAUDE.md:54` und `backend/CLAUDE.md:18`, mit den Lücken aus C-1 und C-4.
- 212 #2: übernommen, «(a prompt sent to the KI included)» steht bei «domain rules» (`CLAUDE.md:55`). Kein Widerspruch.
- 212 #3: in 202 #2 aufgegangen. In der Zusammenfassung korrekt als «212 #1, #3» geführt.

## Merge fd87bba

Der Konflikt in `docs/archive/implementation-plan-verlauf.md` ist korrekt aufgelöst. Gegen beide Eltern geprüft (`diff <(git show <parent>:<file>) <(git show fd87bba:<file>)`):

- Gegenüber 1bc2a8d (main) fehlt keine Zeile.
- Gegenüber 6148886 fehlt nur die alte Überschrift «Session 2026-10-15 (7): apply the workflow rules reviews». Sie heisst jetzt «(8)», weil die #212-Session die Nummer (7) trägt.

Beide Sessions sind vollständig erhalten.

## Nicht bestätigt

- Lint, check, deepcheck:audit, fallow audit, test:coverage (2442), Backend-Tests (615) und type-check: vom Aufrufer gemeldet, nicht erneut ausgeführt. Der Diff ändert nur Dokumente.
- Ob #212 auf GitHub noch offen ist: nicht geprüft. Das archivierte #212-Session-Log zeigt «PR `Fixes #212`» und den Eval «handed to the product owner». Die neue Regel hätte `Refs #212` verlangt.
- Andere Agenten und Skills (`.claude/agents`, `.claude/skills`), die `Fixes #n` verlangen könnten: nur `CLAUDE.md` per grep geprüft, eine PR-Vorlage gibt es nicht.

Urteil: Nicht mergen, bis C-1 behoben ist. Der Merge ist sauber. Die neue Regel lässt offen, ob der Task fertig ist, gepusht und gemergt wird, wenn der Eval fehlt.
