# Code-Review #922, Runde 1 (Abschlussrunde vor dem Push)

Bereich: `git diff 78707d95 7e9f890d -- . ':!implementation_plan.md'`, Worktree `review-i922-code` (7e9f890d).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `.github/workflows/ci.yml:211-213` | Der Schritt «Queries per route» läuft nur, wenn `backend/` oder `tests/contracts/` geändert sind (`ci.yml:77`). Ein Pull Request, der nur `tools/fitness/ratchet.json` (z. B. ein von Hand gesenktes `routeQueries`) oder `tools/fitness/p2-benchmark.ts` (Datensatz, Routenliste) ändert, wird nicht geprüft; rot wird erst `main`. Das gilt auch für diesen Pull Request: Er ändert keine Datei unter `backend/`, der neue Schritt läuft also zum ersten Mal auf `main`. Behebung: `tools/fitness/(p2-benchmark\.ts\|ratchet\.json)` in die Bedingung bzw. den `backend`-Filter aufnehmen. |

Keine Blocker, keine Major.

## Antworten auf die Fragen des Aufrufers

- **Zählt das Patchen von `Client.prototype.query` jede Abfrage?** Ja. Das Backend nutzt nur `pg` (`backend/src/db/connection.ts`: `new Pool` + `drizzle-orm/node-postgres`; kein anderer Treiber unter `backend/src` ausser Tests). `Pool.prototype.query` holt einen Client und ruft `client.query` auf, wird also genau einmal gezählt (der Pool selbst ist nicht gepatcht, keine Doppelzählung). Transaktionen von Drizzle laufen über `pool.connect()` und `client.query('begin' …)`, also ebenfalls gezählt (BEGIN/COMMIT mit). `createRequire(backend/package.json)('pg')` löst dasselbe Modul auf wie der ESM-Import des Backends; der Rotlauf (256 statt 28) belegt, dass die Zählung greift.
- **CI-Bedingung:** Lücke siehe C-1. Auf `main` ist `backend=true` immer gesetzt (`ci.yml:66-67`), dort läuft der Schritt bei jedem Push.
- **Datumsabhängigkeit:** Keine gefunden. Die Abfragezahl hängt an Schleifen über Daten, nicht am Datum: `outdatedStatements` lädt pro Gebäude und Periode der vorhandenen Abrechnungen (2021–2024, fest), `missingByContract` macht unabhängig von der Zahl fehlender Perioden drei Abfragen, das Dashboard rechnet `swissToday()` nur in Bedingungen einzelner Abfragen (`fixedTermCheck`, `formerTenantDocuments`): die Vertragsenden (2023-06-30) liegen dauerhaft vor heute, die Verzweigungen kippen also nicht.
- **Dashboard 68 → 82 bei drei Gebäuden:** Es wächst pro Gebäude (`buildingOccupancy`, zwei Zählungen pro Gebäude) und pro Vertrag bzw. Mieter (`contractTasks`: `laterContract` pro beendetem Vertrag, `formerTenantDocuments` pro Mieter), nicht pro Periode, also nicht mit den Jahren. Bei unter 50 Wohnungen gemessen 214 ms p95, Ziel < 500 ms gehalten, und der Ratchet verhindert ab jetzt ein weiteres Wachstum auf dem festen Datensatz. Kein Blocker/Major, daher nach CLAUDE.md («Open work») kein Issue aus diesem Review nötig.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run tools/` (340 bestanden), Prettier, `bun run fitness`, die zwei `--queries`-Läufe mit gleichen Zahlen und der Rotlauf mit dem N+1 von #919: vom Aufrufer gemeldet. Nicht wiederholt: Der Review-Worktree hat keine `node_modules` (Zugriff auf die des Hauptbaums gesperrt), und `--queries` legt die Datenbank `dwello_bench` neu an (schreibt).
- Ob `psql` auf dem GitHub-Runner vorhanden ist: angenommen, weil `upgrade-check.sh` im selben Job läuft; wegen C-1 zeigt das erst der erste Lauf auf `main`.
- Dass der warm-up-Aufruf keine Abfragen nach seiner Antwort nachschiebt (sie würden dem gezählten Aufruf zugerechnet): im Code keine Fire-and-forget-Abfrage auf den GET-Routen gefunden; die gleich bleibenden Zahlen zweier Läufe sind vom Aufrufer gemeldet.

Geprüft: `fitness.ts` (`queryFindings`, `tightenQueries`, `loosened`, `tighten` behält `routeQueries` über `...r`), `fitness.test.ts` (drei Tests, ohne die Änderung rot: fehlende Exporte bzw. `loosened` ohne Befund), `p2-benchmark.ts` (Datensatz 12 Verträge / 120 Rechnungen / 36 Abrechnungen nachgerechnet, `--update` schreibt nur ohne Befund), `ratchet.json`, `ci.yml`, beide Docs (Werte stimmen mit `ratchet.json`), ponytail-review: Lean already. Ship.
