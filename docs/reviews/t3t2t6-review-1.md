# Code-Review t3t2t6, Runde 1 (`git diff fe09f93c 4f2c824d`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `.claude/skills/pull-request/SKILL.md:19` (mit `:25`, `CLAUDE.md:105`) | «Before each push» Schritt 1 verlangt «Merge `origin/main` once» vor **jedem** Push, auch vor Pushes von CI- oder Review-Fixes. Das widerspricht `:25`, das einen neueren `main` nur bei Konflikt, rotem Check oder Merge-Bereitschaft erlaubt, und es führt T2s Kosten wieder ein. |
| C-2 | Minor | `.claude/skills/pull-request/SKILL.md:20` | Es fehlt, welchen Bereich die gemeinsame Abschlussrunde (Merge-Commit plus Rest) bekommt. Mit `git diff <letzter geprüfter Commit> <Merge-Commit>` liest der Reviewer den ganzen neu hereingeholten `main` mit; nötig wäre z.B. `git diff <base> <merge>` plus `git show --remerge-diff <merge>` für die Konfliktauflösung. |
| C-3 | Minor | `CLAUDE.md:61`, `.claude/agents/code-reviewer.md:17` | «behaviour the change keeps» sagt nicht, worauf es sich bezieht. Ein Test, der nach einem Bugfix geschrieben wird, «hält» das korrigierte Verhalten ebenfalls fest. Präziser wäre «Verhalten, das schon der Basis-Commit zeigt; ein Bugfix zählt nie dazu». Wörtlich bleibt die Bugfix-Regel intakt (ein Fix ändert Verhalten), aber sie ist nicht gegen diese Lesart abgesichert. |
| C-4 | Nit | `.claude/agents/fach-reviewer.md:23-24` | «nothing beyond its row (evidence and fix in a few words)»: Die Tabelle hat keine Spalte für Beleg und Fix, sie gehören also in «short finding». Es fehlt ein Wort dazu, wo sie stehen. |
| C-5 | Nit | Commit `4f2c824d`, Betreff | «one merge per push» stützt die falsche Lesart von C-1. Die Anforderung meint einen Merge direkt vor dem (ersten) Push. |

## C-1 (Major)

Warum falsch: Die Anforderung T2 sagt, `main` wird einmal direkt vor dem Push gemergt. Ein neuerer `main` kommt danach nur bei Konflikt, bei einem roten Check, den `main` behebt, oder bei Merge-Bereitschaft dazu, nicht während der Pull Request auf den Product Owner wartet.

Der Abschnitt heisst «Before each push», und die Skill-Beschreibung lädt ihn «on every later push» (`SKILL.md:3`). Schritt 1 lautet jetzt «Merge `origin/main` once …». Wer nach dem ersten Push einen CI-Fix pusht, folgt diesem Abschnitt und mergt erneut `main`, auch wenn der Pull Request auf den Product Owner wartet. Damit stehen zwei Regeln derselben Datei gegeneinander (`:19` gegen `:25`), und es bleibt genau das wiederholte Mergen, das T2 abschaffen soll: 21 Runden laut `docs/reviews/workflow-rules-review-2026-10-17-2.md`, T2.

So zeigt sich der Fehler: Man spielt einen Pull Request durch, der wartet und einen roten CI-Lauf hat, den `main` nicht behebt. «Red CI: fix the cause and push» führt zu «Before each push», und Schritt 1 verlangt dort einen Merge von `main`, den `:25` verbietet.

Fix (Vorschlag): `:19` z.B. «Before the first push, merge `origin/main` once (no rebase, no force-push); later merges only as in "Open and drive". Then "Before marking anything complete" passes.» In `CLAUDE.md:105` ebenso «before the first push».

## Geprüft

- **T3:** `fach-reviewer.md` schreibt bei Minor/Nit nur noch die Zeile. Beide Agents berichten bei einer Wiederholungsprüfung nur noch den Stand der offenen IDs und neue Befunde, `fach-reviewer` ohne bestätigte Regeln. Das passt zu `slice-review` («For a re-review give only the delta, the open finding IDs and the previous report») und zur Triage-Regel, dass jeder Bericht Schwere und Beleg nennt.
- **T2, Konfliktauflösung:** Sie wird weiter geprüft, auf drei Wegen:
  - in der Abschlussrunde (`SKILL.md:20`: «a conflict resolved in it»);
  - bei späteren Konflikt-Merges (`SKILL.md:25`: «A conflict in app code gets a `code-reviewer` round»);
  - über Workflow 7, weil jeder Push danach die Abschlussrunde auslöst.

  Der aus Gotchas «Branches» entfernte Satz steht damit sinngemäss noch in der Skill.
- **T6:** Die Ausnahme steht in Workflow 2, in «Done means» und in `code-reviewer.md`. Der Commit, der den Test hinzufügt, nennt sie in der Commit-Nachricht. Das Commit-Gate lässt einen Body zu (`tools/claude-hooks/commit-msg-gate.test.ts:25,30`).
- **T6, übrige Regeln:** Die Bugfix-Regel (Workflow 2, letzter Satz), Workflow 6 und die Triage in `slice-review` («red before the fix») bleiben unverändert. Sie gelten für Verhaltensänderungen und widersprechen der Ausnahme nicht. Workflow 1 und `docs/test-pyramid.md` («See red») betreffen Verhaltensänderungen beziehungsweise neue Features, ebenfalls kein Widerspruch. `tdd` und `tests/e2e/CLAUDE.md` enthalten nichts Gegenteiliges.
- **Plan:** `implementation_plan.md` hat eine Session, die Punkte sind passend abgehakt.
- **Abgrenzung:** Nichts im Diff ist fremd zur Anforderung.

## Nicht bestätigt

- Die Tests `open-work`, `e2e-screenplay-lint`, deepcheck `readme`, `commit-msg-gate` und `check-issues` (94 Tests) sind **vom Aufrufer gemeldet**. Mein Versuch, `open-work` und `readme` erneut auszuführen, scheiterte im Worktree mit `ERR_MODULE_NOT_FOUND`, vermutlich weil `node_modules` nicht verlinkt ist.
- Ob GitHub für den Merge einen aktuellen Branch verlangt: nicht geprüft. Davon hängt ab, ob «otherwise ready to merge» einen weiteren Merge erzwingt.
