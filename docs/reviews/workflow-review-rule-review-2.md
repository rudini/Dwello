# Code-Review workflow-review-rule, Runde 2 (Delta)

Geprüft: Worktree `review-wfrule-r2`, Commit `42ec684`, Delta `git diff 7bae4dc..42ec684`. Alle vier geänderten Dateien sind gelesen: `CLAUDE.md` (Zeilen 67 und 84), `docs/archive/implementation-plan-verlauf.md` (Session 34 wieder entfernt), `docs/reviews/workflow-review-rule-review-1.md` (neu, Bericht der Runde 1) und `implementation_plan.md` (Session 34). Zusätzlich gelesen: `CLAUDE.md:76` und `:78` («stop», die drei Schlussüberschriften), Schritt 8 und 9 sowie die Liste `docs/reviews/*workflow-rules-review*`.

Ergebnis: Alle Befunde der Runde 1 sind behoben. Es gibt keinen neuen Blocker und keinen neuen Major.

## Befunde der Runde 1

| ID | Status | Beleg |
|----|--------|-------|
| C-1 (Major) | behoben | Statt unter «Blocked on me» wird der Bericht jetzt unter «Found» genannt. Neu steht dort: «It does not hold up step 9» (`CLAUDE.md:67`). Damit greift `:76` («Blocked on me … and stop») nicht mehr. «Found» passt zu `:78` («findings by ID and status …»). |
| C-2 (Minor) | behoben | Der Name lautet jetzt `workflow-rules-review-<task>.md`, mit `issue-42` oder einem Kurznamen. Den Fall «never a bare number» schliesst der Text ausdrücklich aus. Die alten Berichte `workflow-rules-review-1.md` bis `-9.md` tragen nur Nummern und kollidieren daher nicht. `b13-workflow-rules-review-1.md` hat ein anderes Präfix. Es gibt nur noch einen Review pro Aufgabe, deshalb braucht es keine Rundennummer. |
| C-3 (Minor) | behoben | Der Umfang ist abgegrenzt: «also a bug fix a user can see, or a task that ends blocked here; not a task without app changes» (`CLAUDE.md:67`). |
| C-4 (Minor) | behoben | Unter «Open work» steht jetzt der Rückverweis «(findings of the workflow review in step 7 stay in its report)» (`CLAUDE.md:84`). Zusätzlich steht in `:67` «(an exception to "Open work")». |
| C-5 (Nit) | behoben | Der Text legt fest: «before its session is archived (step 8)», «committed with the task, gets a plan item». Die Reihenfolge ist damit eindeutig: Schritt 7, dann Workflow-Review, dann Archivierung, dann der finale Commit und zuletzt der Push in Schritt 9. |
| C-6 (Minor) | behoben (Stand Repo) | Die Session 34 ist aus dem Archiv entfernt und steht wieder in `implementation_plan.md`, mit offenen Punkten «code-reviewer round 2 (delta)» und «Session archived». Die Zeile für Runde 1 steht in der Session. Gegenüber `origin/main` ist das Archiv netto unverändert (`git diff --stat origin/main..HEAD` zeigt nur `CLAUDE.md`, den Bericht und den Plan). Der frühere Push vor dem Ende der Aufgabe lässt sich nicht rückgängig machen. Laut Aufrufer wird vor dem nächsten Push archiviert. |
| C-7 (Nit) | behoben | Der Umfang nennt jetzt `docs/test-pyramid.md`, `docs/design/personas/README.md` und `.github/ISSUE_TEMPLATE/` als «documents these make binding». |

## Neue Befunde

| ID | Schweregrad | Datei:Zeile | Befund |
|----|-------------|-------------|--------|
| C-8 | Nit | `CLAUDE.md:67` | «a task that ends blocked here» deckt nicht ab, wann der Review bei einem Stopp nach Runde 3 fällig ist. Dort heisst es «stop … ask me». Die Session wird erst später archiviert. Wörtlich gelesen schreibt der Agent den Review also erst, wenn die Aufgabe nach der Antwort weiterläuft. Beim Stopp schreibt er ihn nicht, obwohl der Stopp den Anlass gibt. Ein Agent liest das vermutlich trotzdem richtig. Blockiert nicht. |
| C-9 | Nit | `implementation_plan.md:14` | Die Zeile «Files:» nennt `docs/archive/implementation-plan-verlauf.md`, aber nicht `implementation_plan.md`. Das stimmt erst nach der Archivierung. Bei früheren Sessions ist die Form gleich, daher ohne Folgen. |

## Nicht bestätigt

- `bunx vitest run src/__tests__/open-work.test.ts`: Im Worktree habe ich den Test erneut gestartet. Er bricht mit `ERR_MODULE_NOT_FOUND: vitest` ab, weil der Worktree keinen Symlink `node_modules` hat. Den Symlink habe ich nicht angelegt, um keine Datei zu ändern. Das Ergebnis 4/4 grün ist deshalb «vom Aufrufer gemeldet». Der Plan hat offene Punkte, eine Session ist erlaubt. Danach sollte der Test grün sein. Der Test schliesst `docs/reviews` und `docs/archive` aus (Runde 1, `open-work.test.ts:16-22`).
- Ob PR #172 schon gepusht ist und ob vor dem nächsten Push wirklich archiviert wird, kenne ich nur aus der Angabe des Aufrufers. GitHub habe ich nicht geprüft.
- Lint, check und deepcheck:audit hat weder der Aufrufer noch ich ausgeführt. Bei einer reinen Doku-Änderung ist das ohne Folgen.
