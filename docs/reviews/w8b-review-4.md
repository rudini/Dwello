# Code-Review Runde 4: Merge a7aaf90 (claude/w8b-tank-checks)

Geprüft nur mit `git diff`/`git show`/`git grep` auf Commits (b348696, a7aaf90, origin/main = 7b1aaa3 = zweiter Elternteil), nicht im Arbeitsbaum.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-10 | Nit | docs/archive/implementation-plan-verlauf.md:885 | «second merge (pull request conflicted in this archive only): migration renamed to 0014» liest sich, als sei die Umbenennung Folge des Archivkonflikts; Grund ist die von main belegte Nummer 0013. |

Keine Blocker/Major.

## Bestätigt

- `git diff -M b348696 a7aaf90 --name-status -- backend/migrations`: `R100 0013_building_no_tank.sql -> 0014_building_no_tank.sql` (Inhalt unverändert) und `A 0013_contract_moved_out.sql` (von main).
- `git diff origin/main a7aaf90 --stat -- backend/migrations`: nur `0014_building_no_tank.sql` hinzugefügt; Migrationen von main unberührt. `migrate.ts:19` sortiert nach Dateinamen, 0013 (main) läuft vor 0014; keine Doppelnummer ausser der schon bestehenden 0006-Paarung auf main.
- `git diff origin/main a7aaf90 --numstat -- docs/archive/implementation-plan-verlauf.md`: 20 hinzugefügt, 0 entfernt; nur die W8b-Session wird angehängt, alle Einträge von main bleiben.
- `git show --remerge-diff a7aaf90`: der Merge ändert über die automatische Zusammenführung hinaus nur die Umbenennung und das Archiv.
- `git grep building_no_tank a7aaf90`: in src/, backend/src, tests/ keine Referenz (auch nicht auf den alten Namen); im Archiv nur `0014`; `0011_`/`0013_building_no_tank` nur noch in historischen Review-Berichten (`docs/reviews/w8b-*`).

## Nicht bestätigt

- lint, check, vitest (2765), backend type-check, backend test (773, 94.3 %): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Ob eine lokale Entwicklungsdatenbank `0013_building_no_tank.sql` schon angewendet hat (dann würde 0014 `ADD COLUMN` erneut versuchen): nicht prüfbar, betrifft nur ungepushte lokale Stände (wie in w8b-review-2 vermerkt).
