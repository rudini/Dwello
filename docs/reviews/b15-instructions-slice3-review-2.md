# Review B-15 Slice 3 (Runde 2): PR öffnen, Konflikte lösen, bei Grün mergen

Geprüft im Worktree `review-slice3-r2-code-reviewer` (detached auf 87632ba): `git show 375d588` (CLAUDE.md «Keep going», `.claude/settings.json`, `implementation_plan.md`, dazu `.claude/hooks/session-start.sh` und `docs/reviews/b15-instructions-slice1-review-2.md` aus Slice 1) und die Branches-Zeile aus 87632ba (CLAUDE.md:93). Gelesen: CLAUDE.md:64-73 und :93, `.claude/settings.json` ganz, `~/.claude/stop-hook-git-check.sh` und die Repo-Einstellungen (`gh api repos/rudini/Dwello`, nur gelesen: `allow_auto_merge: false`, `allow_merge_commit: true`, `allow_squash_merge: true`, `delete_branch_on_merge: false`).

## Stand der Befunde aus Runde 1

| ID | Stand |
|----|-------|
| C-1 (Major) | behoben: vor jedem Push auf den offenen PR laufen die Checks erneut, Konflikte in App-Code und Code-Fixes bekommen vorher eine `code-reviewer`-Runde. Passt zu CLAUDE.md:93. |
| C-2 (Major) | zum Teil behoben: der Endzustand «say so once under Blocked on me and stop» ist wieder da. Was den Merge blockiert, ist aber neu mehrdeutig, siehe C-10. |
| C-3 | behoben (abonnieren, wo möglich; Rot auch auf `main` und eine vierte Fix-Runde nur mit Freigabe). Der Rest steht in C-11. |
| C-4 | zum Teil behoben: `ask`-Regeln für die üblichen Formen, Lücken siehe C-12. |
| C-5, C-6 | behoben. |
| C-7 | behoben. `allow_auto_merge: false` bestätigt, die Session mergt selbst. |
| C-8 | behoben. Zum Wortlaut siehe C-13. |
| C-9 | behoben (implementation_plan.md:60). |

Die Anforderung ist erfüllt: PR öffnen, Konflikte per Merge von `origin/main` lösen, bei Grün mergen (die Session selbst, weil das Repo kein Auto-Merge hat). Die Branches-Zeile aus 87632ba stimmt: Nach einem Merge-Commit ist die alte Branch-Spitze Vorfahre von `origin/main`. Hat jemand nach dem Merge weitergepusht oder den PR per Squash gemergt (`allow_squash_merge: true`), wird der Push abgelehnt. Ein Force-Push bleibt dann durch die `ask`-Regeln und den Satz «Ask … before … force-push» abgesichert.

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-10 | Major | CLAUDE.md:69, 71 | «merging while a finding is listed under "Blocked on me"» ist mehrdeutig. Unter «Blocked on me» stehen nach Zeile 71 auch «new issues and rows in offene-punkte.md», und Minors, die offen bleiben, werden Open Work (Workflow 7). Streng gelesen braucht dann fast jeder Merge eine Freigabe. Das widerspricht dem Plan (Punkt 17: «with an open Blocker/Major»). |
| C-11 | Minor | CLAUDE.md:69 | «otherwise checking it before it stops»: Läuft CI beim Stopp noch, fehlt ein Endzustand. Der Satz «When a push, pull request or merge waits for my approval or a decision» deckt «wartet auf CI» nicht ab. Der PR bleibt dann still ungemergt. Vorschlag: «PR-Link und ‹wartet auf CI› unter Blocked on me nennen». |
| C-12 | Minor | .claude/settings.json:46-50 | Die `ask`-Regeln greifen bei `git push origin main`, `git push -u origin main`, `git push origin main --tags`, `git push origin HEAD:main`, `git push origin x:main` und `gh pr merge 12 --admin`. Bei `git push -u origin claude/x` und `git push origin claude/main-fix` greifen sie zu Recht nicht. Sie greifen aber auch nicht bei Pushes, die ebenfalls auf `main` gehen: `git push`, `git push origin` oder `git push -u origin HEAD` mit ausgechecktem `main` (CLAUDE.md:93 verbietet `main` als Arbeits-Branch nicht, «named branch» schliesst ihn ein), `git push origin HEAD:refs/heads/main`, `git push origin refs/heads/main`, `git -C <dir> push origin main` und die GitHub-MCP-Werkzeuge (`push_files`, `create_or_update_file`, `merge_pull_request`). Die Regel gilt dort nur durch den Text. |
| C-13 | Nit | CLAUDE.md:69 | «the CI screenshot comment named in the closing report» steht in der Klammer zum Inhalt des PR. Es liest sich wie ein Bestandteil des PR, obwohl der Kommentar erst nach dem CI-Lauf entsteht. Besser nach «merge it yourself»: «… and name its CI screenshot comment in the closing report». |
| C-14 | Nit | implementation_plan.md:59 | Punkt 17 sagt weiter «merging red or with an open Blocker/Major», CLAUDE.md:69 dagegen «while a finding is listed under Blocked on me». Nach C-10 angleichen. |
| C-15 | Nit | 375d588 | Der Fix-Commit von Slice 3 enthält auch den Fix C-9 aus Slice 1 Runde 2 (`.claude/hooks/session-start.sh`, `docs/reviews/b15-instructions-slice1-review-2.md`). Die Commit-Nachricht nennt ihn nicht. |

## C-10 (Major): Unklar, welcher Eintrag unter «Blocked on me» den Merge blockiert

Warum falsch: Der Kern der Anforderung ist «wenn grün, automatisch mergen». Die neue Ausnahme verlangt eine Freigabe, sobald «a finding is listed under "Blocked on me"». Was unter dieser Überschrift steht, legt CLAUDE.md:71 fest: «decisions, open Blocker/Major, new issues and rows in `docs/design/offene-punkte.md`». Workflow 6/7 machen jeden offen gelassenen Minor/Nit zu Open Work, also zu einem neuen Issue oder einer Zeile in `offene-punkte.md`. Solche Einträge stehen dann unter «Blocked on me». Es sind Befunde (Findings) eines Reviewers. Eine Session, die wörtlich liest, mergt praktisch nie selbst. Eine andere liest «finding» als «Blocker/Major» (so wie der Plan, Punkt 17) und mergt. Diese Mehrdeutigkeit war schon Teil von Runde-1-C-2 («Zwei Sessions können das verschieden lesen»). Sie ist nur verschoben.

Wie zeigen: Eine Aufgabe endet mit einem Minor aus `code-reviewer`, der als Zeile H-23 in `offene-punkte.md` landet. Die Schlussmeldung nennt ihn nach Zeile 71 unter «Blocked on me». CI ist grün. Nach CLAUDE.md:69 wörtlich: «merging while a finding is listed under Blocked on me» braucht eine Freigabe, also kein Merge. Nach dem Plan (Punkt 17) wird gemergt.

Vorschlag: «… and merging while a Blocker/Major is open, the two kinds Workflow 7 excepts included». Damit sind Open-Work-Minors ausdrücklich kein Hindernis. Punkt 17 im Plan gleich formulieren (C-14).

## Nicht bestätigt

- `.claude/settings.json` ist gültiges JSON, `src/__tests__/open-work.test.ts` und `tools/claude-hooks` (22) sind grün: «vom Aufrufer gemeldet», nicht erneut ausgeführt.
- Wie die `ask`-Muster genau passen (C-12), habe ich aus der dokumentierten Glob-Semantik der Bash-Regeln von Claude Code abgeleitet: `*` passt auf beliebige Zeichen, auch Leerzeichen und die leere Zeichenkette. Mit einem echten Permission-Prompt ist das nicht getestet. Ebenfalls offen: ob `ask`-Regeln im Modus `bypassPermissions` oder Auto noch nachfragen.
- Branch-Protection und Required Checks von `main`: nicht lesbar (Runde 1: 403). Ob «CI is green on the latest commit and the pull request is mergeable» alle Jobs meint oder nur die Required Checks, bleibt offen.
- Stop-Hook: gelesen. Nach einem Push mit Upstream meldet er nichts mehr. Bei unsignierten Commits rät er zu `--amend`/`rebase`, was auf einem gepushten Branch einen Force-Push bräuchte. Den fangen CLAUDE.md:69 («does not override») und die `ask`-Regeln ab. Nicht ausgeführt.
