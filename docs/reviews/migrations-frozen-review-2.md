# Review migrations-frozen, Runde 2 (Delta)

Commit-Bereich: `dd10ec0..c93bdac` (8600563, a14ced9, c93bdac), gelesen im Worktree `review-migrations-code-reviewer-2`. Alle geänderten Dateien gelesen: `.github/workflows/ci.yml`, `backend/CLAUDE.md`, `backend/src/__tests__/migrations.pg.test.ts`, `backend/src/db/migrate.ts`, `docs/anforderungen-vertragsende.md`, `docs/data-model.md`, `docs/reviews/migrations-frozen-blogreview-1.md`, `docs/reviews/migrations-frozen-review-1.md`, `docs/reviews/workflow-rules-review-migrations-frozen.md`, `implementation_plan.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde. |

## Status der Befunde aus Runde 1

| ID | Schwere | Status | Nachweis |
|---|---|---|---|
| C-1 | Major | behoben | `docs/data-model.md:403-407` nennt jetzt «Dwello is installed», jede Änderung als neue nummerierte Datei, keine Änderung einer Migration auf `main`, `db:reset` nur für eine lokale Datenbank («never an installation (it deletes all records)»). Deckungsgleich mit `backend/CLAUDE.md:24` und `README.md`. Die Suche nach «first installation» / «solange es keine produktive» ausserhalb von `docs/archive` und `docs/reviews` findet nur noch die Verlaufszeile `design-decisions.md:53` (bewusst als Historie behalten, durch Zeile 54 ersetzt) und die korrigierte Stelle `anforderungen-vertragsende.md:42`. |
| C-2 | Minor | behoben | `migrate.ts:11-12`: «… Eine Installation nicht zurücksetzen (alle Daten gingen verloren), sondern mit der Version starten, mit der sie zuletzt lief.» Sagt jetzt, was zu tun ist; für beide Ablehnungen (Zeilen 22, 33) sachlich passend (eine neuere Code-Version mit anderer Baseline bzw. ohne Buchführung). `migrations.pg.test.ts:54,64` prüft den vollen Text; Planzeile nennt das Rot («received "… sonst gehen ihre Daten verloren."»). |
| C-3 | Nit | behoben | `ci.yml:84`: `${changed//$'\n'/, }`. `ubuntu-latest` führt `run:` ohne `shell:`-Angabe mit bash aus (keine `defaults`/`shell` in ci.yml), die Bash-Ersetzung greift also. Lokal nachgestellt: `a.sql\nb.sql` → «a.sql, b.sql. Put …» in einer Zeile. |
| C-4 | Nit | behoben | `ci.yml:82`: `--diff-filter=a` (alles ausser Hinzufügen), erfasst auch `T`. |
| C-5 | Nit | behoben | `implementation_plan.md:9` nennt jetzt `docs/data-model.md`, `docs/anforderungen-vertragsende.md` und dass `design-decisions.md` die Session-12-Zeile als Verlauf behält. |

## Geprüft im Delta

- `backend/CLAUDE.md:24` (aus der Artikel-Review): Korrekturmigration statt Änderung, sonst anhalten und fragen; Stammdatenmigration ändert/löscht nur `WHERE` die Spalten noch die gesäten Werte haben. Klar, widerspricht keiner anderen Regel; reine Dokumentation, keine Verhaltensänderung.
- `docs/reviews/workflow-rules-review-migrations-frozen.md`: Pfad nach Workflow 7 (`<task>` ist ein Kurzname, keine Zahl), Tabelle mit Regelstelle, Geschehenem und Vorschlag; W-1 nennt nun, wo die Installation festgehalten ist (B-4). Planzeilen pro Reviewer und Runde im Format von Workflow 6 vorhanden.
- Nichts Fachfremdes im Delta.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht erneut ausgeführt: `bun run lint`, `cd backend && bun run type-check && bun run test` (600 bestanden), `bun run deepcheck:audit`, YAML-Parse von `ci.yml`, Probe des CI-Befehls im Scratch-Repo (Änderung + Löschung in einer Zeile, neue Datei nicht gemeldet); auf dd10ec0 `bun run test:coverage` und `bun run check`. Das rote Ergebnis des geänderten `migrations.pg.test.ts` ist nur über die Planzeile belegt (Backend-Tests laufen unter `bun test` mit PostgreSQL, nicht unter Vitest).
- Verhalten des CI-Schritts in einem echten GitHub-Lauf (Annotation, Merge-Ref) und ob «Lint and types» ein Pflicht-Check für `main` ist: wie in Runde 1 nur lokal bzw. nicht im Repository sichtbar.
