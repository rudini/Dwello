# Code-Review t3t2t6, Runde 2 (`git diff 4f2c824d 27ca9454`)

Vorheriger Bericht: `docs/reviews/t3t2t6-review-1.md`.

## Stand der offenen IDs

| ID | Schwere | Stand | Beleg |
|---|---|---|---|
| C-1 | Major | behoben | `.claude/skills/pull-request/SKILL.md:19` sagt jetzt «Before the first push, merge `origin/main` once …; later merges only as in "Open and drive"». `CLAUDE.md:105` sagt ebenfalls «before the first push». Damit stehen `:19` und `:25` nicht mehr gegeneinander. |
| C-2 | Minor | nicht behoben, durch C-6 ersetzt | Die neue Bereichsangabe ist da, zeigt aber den falschen Bereich, siehe C-6. |
| C-3 | Minor | behoben | `CLAUDE.md:61` sagt «behaviour the base commit already shows and the change keeps …, never one of a bug fix». `code-reviewer.md:17` prüft genau das. |
| C-4 | Nit | behoben | `fach-reviewer.md:24` sagt «its short finding names evidence and fix in a few words». |
| C-5 | Nit | bleibt wie vereinbart | Betreff von `4f2c824d`. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-6 | Major | `.claude/skills/pull-request/SKILL.md:20` | «for a merge commit in the delta, `<base>` is its first parent» ergibt `git diff <merge>^1 <merge>`. Das ist genau der hereingeholte `main`, nicht die Arbeit der Session. Ausserdem fallen die Minor/Nit-Fixes vor dem Merge aus dem Bereich. |
| C-7 | Nit | `.claude/skills/pull-request/SKILL.md:25` | «when GitHub refuses the merge because the branch is behind» ist enger als T2s «until it is ready to merge». Es passt zur Anforderung und klärt den offenen Punkt aus Runde 1. Ob das Repository einen aktuellen Branch verlangt, bleibt offen (siehe «Nicht bestätigt»). |

## C-6 (Major)

**Warum falsch:** Ein Merge, den man auf dem Branch erstellt, hat als ersten Parent die Spitze des Branches und als zweiten `origin/main`. Darum zeigt `git diff <merge>^1 <merge>` alles, was `main` seit der Abzweigung neu gebracht hat, samt Konfliktauflösung. Der Reviewer liest also den ganzen fremden `main`-Stand, also genau die Kosten, die C-2 vermeiden wollte.

Dazu kommt ein zweites Problem. Schritt 1 legt den Merge direkt vor den Push. Die Minor/Nit-Fixes, die die Abschlussrunde laut Schritt 2 prüfen soll («Minor/Nit fixes, a conflict resolved in it, a CI fix»), liegen daher normalerweise *vor* dem Merge. Wird `<base>` auf den ersten Parent des Merges gesetzt, liegen sie ausserhalb des Bereichs. Ungeprüfter Code geht dann in den Push, entgegen Workflow 7 («one closing `code-reviewer` round reviews the code not reviewed yet»).

**So zeigt sich der Fehler:** Man spielt den Ablauf durch:
1. Der letzte geprüfte Commit ist A.
2. Danach folgt der Nit-Fix-Commit B.
3. Dann kommt der Merge M von `origin/main`.
4. Nach `:20` wird `<base>` = `M^1` = B, also gilt `git diff B M`. Der Nit-Fix B fehlt im Bereich, und dazu kommen alle Änderungen aus `main`.

**Fix (Vorschlag):** Der Bereich bleibt `git diff <letzter geprüfter Commit> <merge>^1` für die eigenen Commits. Für den Merge kommt `git show --remerge-diff <merge>` für die Konfliktauflösung hinzu. Ein Wortlaut wäre etwa: «for a merge commit in the delta, the range ends at its first parent and its conflict resolution is `git show --remerge-diff <merge>`». Ein Fix nach dem Merge braucht zusätzlich `git diff <merge> <commit>`.

## Geprüft

- Alle Dateien im Delta habe ich gelesen: `code-reviewer.md`, `fach-reviewer.md`, `pull-request/SKILL.md`, `CLAUDE.md`, `implementation_plan.md` und `docs/reviews/t3t2t6-review-1.md`.
- Ausser `CLAUDE.md:105` und `SKILL.md:3,19` nennt keine andere Stelle in `CLAUDE.md` oder `.claude/` einen Merge «vor dem Push» (grep nach «first push», «before the push»).
- `git show --remerge-diff` gibt es ab Git 2.36. Im Worktree läuft Git 2.43.0.
- Plan: Runde 1 ist abgehakt, Runde 2 ist offen. Das passt.
- Der Commit-Betreff `docs(config): merge main only before first push` hat 46 Zeichen und hält die Konvention ein.
- Nichts im Delta ist fremd zur Anforderung.

## Nicht bestätigt

- Die Tests `open-work`, deepcheck `readme`, `commit-msg-gate` und `check-issues` (40 Tests) sind **vom Aufrufer gemeldet**. Ich habe sie nicht erneut ausgeführt, weil der Delta nur Regeltext ändert. In Runde 1 scheiterte ein erneuter Lauf im Worktree an `ERR_MODULE_NOT_FOUND`.
- Ob GitHub in `rudini/Dwello` einen aktuellen Branch verlangt (Branch-Protection «require branches to be up to date»), habe ich nicht geprüft. Davon hängt ab, ob die neue Bedingung in `SKILL.md:25` je greift.
- C-6 beruht auf der Git-Semantik der Parents eines Merges. Ein Beispiel-Repository habe ich nicht angelegt, weil ausser dem Bericht nichts geschrieben werden darf.
