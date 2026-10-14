# Review B-15 Slice 3 (Runde 1): PR öffnen und automatisch mergen

Geprüft: `git show 49105a6` (CLAUDE.md «Keep going»-Absatz, implementation_plan.md Slice 3) im Worktree `review-slice3-code-reviewer` (detached auf 955bc2c), dazu CLAUDE.md und `.claude/settings.json` auf 955bc2c, `.github/workflows/ci.yml` und die Repo-Einstellungen (`gh api repos/rudini/Dwello`, nur gelesen). Die späteren Commits 2f60bc1/955bc2c ändern den Absatz nicht.

Die Anforderung (PR öffnen, Konflikte lösen, bei Grün automatisch mergen) ist abgedeckt; die Merge-Methode Merge-Commit passt zur Branches-Regel (nach dem Merge ist `origin/main` dem alten Branch voraus, der Neustart braucht keinen Force-Push). Zwei Lücken betreffen den Ablauf nach dem PR und den Endzustand, wenn etwas auf Freigabe wartet.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | CLAUDE.md:69 | Konfliktlösung und CI-Fix werden gepusht, während Auto-Merge schon an ist: Sie mergen ohne Review und ohne lokale Checks, entgegen Workflow 4 und der Branches-Regel (Zeile 93, `code-reviewer` auf dem Merge-Commit). |
| C-2 | Major | CLAUDE.md:69 | Der alte Endzustand «say so once under Blocked on me and stop, without asking again» ist gestrichen. Wartet Push, PR oder Merge auf Freigabe, fehlt jetzt, was zu tun ist. Dazu widerspricht «merging with … an open Blocker/Major» den Ausnahmen aus Workflow 7. |
| C-3 | Minor | CLAUDE.md:69 | «subscribe to the pull request» ist werkzeugabhängig. Offen bleibt: was tun, wenn die Session nicht warten kann; wie viele CI-Fix-Runden; was gilt bei Rot, das auch auf `main` rot ist oder flaky ist (Fix ausserhalb des Scopes, «Stay in scope»). |
| C-4 | Minor | .claude/settings.json:39-75 | Keine `ask`-Regel für einen Push auf `main` (`git push origin main`, `… HEAD:main`) und für `gh pr merge --admin`. Die neue Freigabepflicht steht nur im Text, Force-Push dagegen ist technisch abgesichert. |
| C-5 | Minor | CLAUDE.md:69, 93 | «When it is done … push the branch, open a pull request» gilt wörtlich auch für Sessions und Subagents, die auf eigenem Branch committen (Zeile 93). Sie würden eigene PRs nach `main` mergen. Es fehlt: nur die Session, der der Benutzer die Aufgabe gab. |
| C-6 | Minor | CLAUDE.md:69 | «a pull request for a task in which I said to only commit»: Der Push des Branches ist nicht genannt. Ein Agent könnte bei «nur committen» pushen, ohne einen PR zu öffnen. Besser: «a push or pull request …». |
| C-7 | Nit | CLAUDE.md:69 | Im Repo ist `allow_auto_merge` false. «turn on auto-merge» schlägt also heute immer fehl, und der Normalfall ist der Rückfall «merge it yourself then». Die Reihenfolge im Text sollte die Realität abbilden. |
| C-8 | Nit | .github/workflows/ci.yml:213 | Der Job «UI screenshots» kommentiert Screenshots für den Menschen im PR. Mit dem automatischen Merge sieht sie niemand mehr vor dem Merge. Gewollt laut Anforderung, aber nirgends erwähnt. |
| C-9 | Nit | implementation_plan.md:57-59 | Slice 3 fehlt die Notiz «No code changed: no `Test red`, no `ponytail-review`», die Slice 2 hat. |

## C-1 (Major): Ungeprüfte Commits mergen sich selbst

Warum falsch: Der neue Text schaltet Auto-Merge beim Öffnen des PR ein. Danach heisst es nur «on a merge conflict merge `origin/main` … and resolve it …, on red CI fix the cause and push». Jeder solche Push wird gemergt, sobald CI grün ist (oder im Rückfall vom Agenten selbst). Weder `code-reviewer` (Workflow 4, «Continue only when no Blocker/Major is open») noch die Checks aus «Before marking anything complete» müssen vorher laufen. Die Branches-Regel (Zeile 93) verlangt `code-reviewer` auf dem Merge-Commit bei Konflikten in App-Code, nennt aber keinen Zeitpunkt vor dem Push. Mit Auto-Merge kommt der Review so zu spät. CI deckt nicht alles ab, was lokal verlangt ist: E2E, Personas, Fach-Review und Datenprüfung laufen nicht in CI.

Wie zeigen: Ein PR ist offen, Auto-Merge an, `main` bekommt eine Änderung in derselben Svelte-Datei. Der Agent folgt dem Text: Er mergt `origin/main`, löst den Konflikt und pusht. Wird CI grün, ist die Konfliktlösung auf `main`, ohne `code-reviewer` und ohne die betroffenen E2E-Szenarien. Dasselbe passiert bei einem CI-Fix, der Verhalten ändert (Workflow 6 verlangt dafür zuerst einen roten Test).

Vorschlag: «… resolve it, run the checks of "Before marking anything complete" and, for conflicts in app code or a fix that changes code, `code-reviewer` on the new commits before pushing them».

## C-2 (Major): Kein Endzustand mehr, wenn etwas auf Freigabe wartet

Warum falsch: Der alte Satz «A task whose finish line includes a push is done when its commits are local, every check passes and only the push waits for my approval: say so once under "Blocked on me" and stop, without asking again» war der Schutz gegen Schleifen mit dem Stop-Hook (der bei jedem Stopp zum Pushen auffordert). Der neue Text zählt auf, was Freigabe braucht: Push auf `main`, Force-Push, Merge bei Rot oder mit offenem Blocker/Major, PR bei «nur committen». Er sagt aber nicht, dass die Aufgabe dann fertig ist und der Agent einmal unter «Blocked on me» meldet und stoppt. Schlimmer: Die Klammer «When it is done (…, nothing under "Blocked on me" waits on a decision)» macht das Warten auf eine Entscheidung zu einer Bedingung von «done». Eine Aufgabe mit einer `entscheiden`-Frage ist nach dem Wortlaut nie fertig.

Zweitens nimmt Workflow 7 (Zeile 66) zwei Arten offener Blocker/Major ausdrücklich aus: Produktentscheid und bereits auf dem Basis-Commit vorhanden. Sie werden Open Work, und die Aufgabe ist trotzdem fertig. Der neue Text verlangt für «merging with … an open Blocker/Major» eine Freigabe. Unklar bleibt, ob ein schon bestehender Blocker/Major (als Issue offen) den automatischen PR/Merge blockiert. Zwei Sessions können das verschieden lesen.

Wie zeigen: Genau diese Aufgabe (B-15, im Plan «a task where the user said to only commit (as this one)») endet nach dem neuen Text ohne Anweisung. Der Stop-Hook fordert zum Pushen auf, der Satz «does not override … this rule» verbietet es. Was der Agent dann melden und wann er stoppen soll, steht nicht mehr da. Gleiches gilt für einen Fix eines Problems, das schon vor der Änderung bestand und als Major Open Work wurde.

Vorschlag: Den alten Endzustand allgemein behalten. Etwa: «When a push, pull request or merge waits for my approval (list above) or for a decision, the task is done once its commits are local and every check passes: say so once under "Blocked on me" and stop, without asking again.» Und klären: «open Blocker/Major» meint die nicht ausgenommenen. Die zwei Ausnahmen aus Workflow 7 blockieren den Merge nicht (oder blockieren ihn ausdrücklich).

## Nicht bestätigt

- `tools/claude-hooks/commit-msg-gate.test.ts`, `src/__tests__/open-work.test.ts` grün und Lint sauber: «vom Aufrufer gemeldet». Nicht erneut ausgeführt, weil der Zugriff auf `node_modules` durch eine Deny-Regel gesperrt ist.
- Branch-Protection von `main` (Required Checks): `gh api repos/rudini/Dwello/branches/main/protection` gibt 403 zurück, Rulesets sind leer. Ob «It merges itself once CI is green» bei eingeschaltetem Auto-Merge tatsächlich auf CI wartet, hängt von Required Checks ab und ist nicht bestätigt. Heute ist Auto-Merge im Repo ohnehin aus (`allow_auto_merge: false`; `allow_merge_commit: true`).
- Fallow-/Deepcheck-Gate beim Push nach einem Merge von `origin/main`: aus dem Gate-Text (Vergleich gegen `origin/main`) ist kein Konflikt zu erwarten, aber nicht ausgeführt.
- Ob der Stop-Hook `~/.claude/stop-hook-git-check.sh` nach dem automatischen Merge Ruhe gibt (Branch gepusht und gemergt): liegt ausserhalb des Repos und wurde nicht gelesen.
