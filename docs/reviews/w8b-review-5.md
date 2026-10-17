# Code-Review Runde 5 (Merge c0052ff, Delta)

Geprüft nur über Commit-Referenzen (`git diff`/`git show`/`git grep` auf c0052ff), nicht über einen Arbeitsbaum: der Aufrufer nannte keinen eigenen Worktree, Git-Objekte ändern sich aber nicht.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

## Bestätigt

- `git diff -M b3a43b7 c0052ff -- backend/migrations`: `R100 0014_building_no_tank.sql -> 0015_building_no_tank.sql` (Inhalt unverändert) und `A 0014_line_item_invoices.sql` (von main).
- `git diff a235fdb c0052ff -- backend/migrations`: nur `0015_building_no_tank.sql` kommt hinzu; die Migrationen von main sind unberührt. `migrate.ts` sortiert nach Dateinamen, also läuft 0014 (main) vor 0015. Die Nummer 0015 ist nicht doppelt vergeben.
- `git diff a235fdb c0052ff -- docs/archive/implementation-plan-verlauf.md`: 20 Zeilen hinzugefügt, keine entfernt. Die Session W1b von main bleibt vollständig, der W8b-Eintrag steht danach. Darin sind die Dateiliste (`0015_building_no_tank.sql`) und die Merge-Zeile («third merge … renamed to 0015») nachgeführt.
- `git show --remerge-diff c0052ff`: Ausser der Umbenennung und der Konfliktlösung im Archiv enthält der Merge nichts.
- `git grep 0014_building_no_tank c0052ff`: In `src/`, `backend/src` und `tests/` gibt es keinen Treffer. Der alte Name steht nur noch in `docs/reviews/w8b-review-4.md`, und dort ist er korrekt, denn er hält den Stand dieser Runde fest.

## Nicht bestätigt

- lint, check, vitest (2780), backend type-check, backend test (790, 94.4 %): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Eine lokale Entwicklungsdatenbank, auf der `0014_building_no_tank.sql` schon lief, bricht beim Start mit dem Hinweis auf `db:reset` ab (`migrate.ts`, «unknown»). Das betrifft nur Datenbanken dieses Branches, denn der Name war nie auf main. Die Test-Datenbanken werden neu aufgesetzt. Deshalb ist das kein Befund.
