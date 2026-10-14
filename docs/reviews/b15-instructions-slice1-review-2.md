# B-15 Instruktionen, Slice 1: Code-Review Runde 2

Delta `49105a6..2f60bc1` (`fix(config): B-15 slice 1 review findings`), gelesen im Worktree `review-slice1-code-reviewer` (detached auf `955bc2c`). Geprüft wurden nur das Delta und die offenen Befunde C-1 bis C-8 aus `docs/reviews/b15-instructions-slice1-review-1.md`; C-6 zusätzlich gegen `CLAUDE.md` aus `aa2758a`. Alle 8 Dateien des Deltas gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | – (behoben) | `.claude/hooks/session-start.sh:11-15` | Vergleich gegen `FETCH_HEAD`, `timeout 20`, `rev-list … \|\| echo 0`; Probe siehe unten. |
| C-2 | – (behoben) | `CLAUDE.md:23`, `backend/CLAUDE.md:17`, `docs/test-pyramid.md:106` | Alle drei Stellen sagen jetzt «started in `backend/` itself», `backend/CLAUDE.md` nennt den Unterordner-Fall ausdrücklich. |
| C-3 | – (behoben) | `tools/open-work/check-issues.mjs:66-70`, `check-issues.test.ts:57-61` | Nicht-ok-Listenantwort ergibt `Cannot list open issues (HTTP n)` und Exit 1; neuer Test mit 500. |
| C-4 | – (behoben) | `tools/open-work/check-issues.mjs:75` | Prüfung auf die Überschrift `/^#+ *Proposed \(confirm before starting\)/m`; Fliesstext (#11 im Test) läuft durch. |
| C-5 | – (behoben) | `implementation_plan.md:43` | Das Rot der Label-Prüfung selbst ist notiert (Prüfung entfernt: «expected 0 to be 1»). |
| C-6 | – (behoben durch `aa2758a`) | `CLAUDE.md:93` | «Branches» enthält jetzt die Regel (am Anfang `git fetch origin main`, neu ab `origin/main` bei gemergtem PR, sonst mergen). |
| C-7 | – (behoben) | `.claude/hooks/session-start.sh:11` | `timeout 20 git fetch …`; ein Abbruch (Exit 124) überspringt nur den Hinweis. |
| C-8 | – (behoben) | `implementation_plan.md:12` | Checkliste nennt jetzt den Kommentar `# title-format:`. |
| C-9 | Nit | `.claude/hooks/session-start.sh:13` | Auf einem detached HEAD lautet der Hinweis «branch  is 2 commits behind …» (leerer Name aus `git branch --show-current`). Schon in Runde 1 so vorhanden, nicht durch das Delta entstanden; nur kosmetisch. |

Keine offenen Blocker/Major.

## Blocker/Major

Keine.

## Geprüft und bestätigt

- **C-1, Probe neu aufgebaut** (Scratchpad `c1probe`: lokales `origin` mit `main` 2 Commits vor `feat`, `git clone --single-branch -b feat`, Refspec `+refs/heads/feat:refs/remotes/origin/feat`; Zeilen 9-15 des Hooks unter `set -euo pipefail`, danach `echo REACHED`):
  - alter Block (`49105a6`): `fatal: ambiguous argument 'HEAD..origin/main'`, `exit=128`, `REACHED` fehlt (Rot bestätigt);
  - neuer Block, Single-Branch-Klon: Hinweis «branch feat is 2 commits behind origin/main …», `REACHED`, `exit=0`;
  - ohne Remote: kein Hinweis, `REACHED`, `exit=0`;
  - auf dem Stand von `main` und nur voraus: kein Hinweis, `exit=0`;
  - detached HEAD und fremde Historie: Hinweis, `exit=0` (siehe C-9).
  `FETCH_HEAD` nach `git fetch origin main` enthält nur `main`, der Vergleich ist auch im normalen Klon richtig. Fällt `rev-list` aus, ist stdout leer und `|| echo 0` liefert `0`, also kein Abbruch bei `[ "$behind" -eq 0 ]`.
- **C-3/C-4:** `bunx vitest run tools/open-work/check-issues.test.ts` von mir erneut ausgeführt: 3 bestanden. Über `gh api` geprüft: alle 14 offenen Issues, deren Text die Wendung enthält, tragen `entscheiden` und treffen das neue Überschriftenmuster; die Vorlage `.github/ISSUE_TEMPLATE/task.md:15` schreibt `## Proposed (confirm before starting)`, das Muster passt also zur Vorlage. `main` wird durch die Änderung nicht rot.
- **Neue Probleme durch das Delta:** keine gefunden. Der 401/403-Pfad von `get()` bleibt unverändert vorrangig; die Testhilfe setzt den Status nur für die Liste. Der neu eingecheckte Bericht `docs/reviews/b15-instructions-slice1-review-1.md` entspricht Workflow 6. Nichts ausserhalb der Befunde geändert.

## Nicht bestätigt

- C-5: das Rot der Label-Prüfung (Prüfung entfernt, «expected 0 to be 1») und die Rot-Notizen der beiden neuen Tests (`implementation_plan.md:42`): vom Aufrufer gemeldet; nicht nachgestellt, weil das Entfernen von Code im Worktree eine Dateiänderung wäre. Der Begründung nach schlüssig (ohne Schleife Exit 0; mit `includes` hätte #11 Exit 1 ergeben; ohne `response.ok`-Prüfung bricht `[]`-lose 500-Antwort die Schleife stillschweigend ab).
- `bun run lint`, `fallow audit`, `deepcheck:audit`: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- `bun run test:coverage` (2282 bestanden, Zeilen 90.11 %), `bun run check` (0 Fehler), Backend-Type-Check: vom Aufrufer gemeldet, und zwar auf dem Stand vor dem Fix-Commit; für das Delta (Shell-Hook, Doku, ein `.mjs`-Skript und sein Test) nicht erneut gelaufen.
- Der Hook selbst wurde nicht als Ganzes ausgeführt (er installiert Pakete und startet PostgreSQL); geprüft wurde nur der geänderte Block in den Probe-Repos.
