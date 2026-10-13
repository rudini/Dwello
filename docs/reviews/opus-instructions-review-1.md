# Review: Anweisungen gegen «Getting the most out of Opus 5.5» (R-1 bis R-6), Runde 1

Bereich: `git diff 8e229d4..58a314d` (Commit `58a314d docs(config): align skills with keep-going rule`).
Gelesen: alle 8 geänderten Dateien vollständig bzw. im geänderten Abschnitt mit Umfeld (`.claude/settings.json`, `.claude/skills/tdd/SKILL.md`, `.claude/skills/bdd-acceptance/SKILL.md`, `.claude/skills/ponytail/SKILL.md`, `.claude/agents/code-reviewer.md`, `.claude/agents/persona.md`, `implementation_plan.md`, `docs/archive/implementation-plan-verlauf.md`), dazu `backend/package.json`, `backend/scripts/db-reset.ts`, `backend/CLAUDE.md`, `README.md`, `docs/design/tools/persona-stack.sh`, die übrigen Agenten und Ponytail-Skills.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | `.claude/settings.json:40-50` | Der Befehl, mit dem Dwello tatsächlich eine Datenbank löscht (`bun run db:reset`, Entwicklungsdatenbank `dwello`), fragt nicht; `dropdb` wird im Projekt so nicht aufgerufen |
| C-2 | Major | `.claude/settings.json:41-49` | Präfixregeln greifen bei den im Projekt üblichen Formen nicht: `docker compose -f docker-compose.dev.yml down -v`, `git push origin x --force`, `git push origin +x`, `rm -fr` / `rm -r` |
| C-3 | Minor | `.claude/settings.json:40-50` | Weitere Befehle, die ungesicherte Arbeit verwerfen, fehlen: `git checkout -- .`/`git checkout .`, `git restore`, `git stash drop`/`clear`, `git branch --delete --force`, `git worktree remove --force`, `bun run db:push` |
| C-4 | Minor | `.claude/agents/code-reviewer.md:34-36` | Tabelle plus «Minor/Nit: at most one line each»: jede Minor/Nit steht doppelt; keine konsolidierte Tabelle, sondern Tabelle + Liste |
| C-5 | Minor | `.claude/agents/persona.md:17,23` | Gleiches Doppel: Tabelle mit Schwere und «Vorschläge, each marked Blocker / Major / Minor / Nit»; unklar, ob die Tabelle die Vorschläge zusammenfasst (gleiche IDs) |
| C-6 | Minor | `.claude/skills/ponytail/SKILL.md:72-73` | Das Plugin `ponytail@ponytail` ist in `.claude/settings.json` zusätzlich aktiviert; dessen unveränderte SKILL.md kennt den Dwello-Satz nicht, R-6 wirkt nur, wenn die Projektkopie geladen wird |
| C-7 | Nit | `.claude/settings.json:48` | `dropdb dwello_e2e` direkt fragt nach, obwohl `CLAUDE.md` das Neuaufsetzen von `dwello_test`/`dwello_e2e`/`dwello_persona` ausdrücklich «Not destructive» nennt |
| C-8 | Nit | `.claude/settings.json:45` | `git clean:*` fragt auch bei `git clean -n` (Trockenlauf) |
| C-9 | Nit | `.claude/skills/tdd/SKILL.md:56` | «the scenario and the issue already say what to build»: nicht jede Aufgabe hat ein Issue (z. B. diese Session); «the task or issue» wie in `bdd-acceptance` wäre genauer |

## Blocker/Major

### C-1 `bun run db:reset` fragt nicht (Major)

`.claude/settings.json:40-50`. R-4 verlangt Nachfrage vor destruktiven Datenbankbefehlen. Im Projekt löscht `bun run db:reset` (`backend/package.json:19` → `backend/scripts/db-reset.ts` → `backend/scripts/e2e-db.ts:27`, `DROP DATABASE IF EXISTS … WITH (FORCE)`) die Entwicklungsdatenbank `dwello`, die laut `CLAUDE.md` unangetastet bleiben soll. `backend/CLAUDE.md:24,43` empfiehlt den Befehl sogar als Lösung bei Migrationsfehlern, ein Agent wird ihn also ohne Rückfrage ausführen. `dropdb` dagegen ruft nur `persona-stack.sh` innerhalb eines Skripts auf; dort greift eine Bash-Regel ohnehin nicht (sie prüft nur die Befehlszeile).

Nachweis: In einer Sitzung im Auto-Modus `cd backend && bun run db:reset` ausführen lassen: keine Rückfrage, `dwello` ist danach leer bis auf die Stammdaten.

Behebung: `"Bash(bun run db:reset:*)"` (und `db:push`, siehe C-3) in `ask` aufnehmen; `dropdb` kann bleiben.

### C-2 Präfixregeln verfehlen die üblichen Schreibweisen (Major)

`.claude/settings.json:41-49`. Regeln mit `:*` sind Präfixregeln (Syntax gültig, gleich wie die bestehende `Bash(mmx search:*)`), sie greifen nur, wenn die Befehlszeile genau so beginnt:

- `docker compose down -v:*` (Zeile 49): Dwello startet PostgreSQL mit `docker compose -f docker-compose.dev.yml …` (`bdd-acceptance/SKILL.md:16`, `README.md:270` mit `docker-compose -f …`). Das passende `docker compose -f docker-compose.dev.yml down -v` löscht das Volume mit allen Datenbanken und fragt nicht. Die Regel trifft damit den einzigen Fall nicht, den es im Projekt gibt.
- `git push --force:*` / `-f:*` (Zeilen 41-43): `git push origin HEAD --force`, `git push -u origin x -f` und `git push origin +x` beginnen anders und fragen nicht.
- `rm -rf:*` (Zeile 47): `rm -fr`, `rm -r -f`, `rm -Rf`, `rm -r` fragen nicht.

Nachweis: Jeden der genannten Befehle im Auto-Modus ausführen lassen (gefahrlos mit `--dry-run` bzw. auf ein Scratch-Verzeichnis): keine Rückfrage.

Behebung: Platzhalter in der Mitte (`"Bash(git push * --force*)"`, `"Bash(git push *-f*)"`, `"Bash(git push *+*)"`, `"Bash(docker compose * down -v*)"`, `"Bash(docker-compose * down -v*)"`, `"Bash(rm -r*)"`, `"Bash(rm -f*)"`), sofern die eingesetzte Claude-Code-Version Platzhalter an beliebiger Stelle kennt (siehe «Nicht bestätigt»); sonst die konkreten Schreibweisen des Projekts aufzählen.

## Bestätigt

- R-1: `tdd/SKILL.md:51-58` verlangt keine Bestätigung oder Freigabe mehr; Plan in die Checkliste von `implementation_plan.md`; Rückfrage nur bei mehreren Lesarten (deckt sich mit `CLAUDE.md`, Coding guidelines). Keine Reste in `tests.md`, `mocking.md`, `refactoring.md`.
- R-2: `bdd-acceptance/SKILL.md:23` hebt im Dwello-Abschnitt (der laut Zeile 12 die generischen Teile überschreibt) Phase 2 und «Iteration» auf; fehlende Begriffe als `TODO(fachlich prüfen, #…)` plus Issue, wie `CLAUDE.md`, Design-Regeln/Open work.
- R-3: `/codebase-design` kommt im Repo nicht mehr vor (nur noch im Plan); `tools/deepcheck/README.md` existiert, `deepcheck:audit` passt zu `CLAUDE.md` Schritt 3.
- R-5: Tabellen in `code-reviewer.md:34` und `persona.md:17`; `fach-reviewer.md:21` und `daten-pruefer.md:16` hatten bereits eine. Doppelungen siehe C-4, C-5.
- R-6: Satz in `ponytail/SKILL.md:72-73` sitzt direkt nach der Ausnahme für angeforderte Berichte und widerspricht `CLAUDE.md` nicht.
- Plan: Session 21 unverändert ins Archiv verschoben (Text identisch), Session 22 mit Checkliste, Dateien pro Punkt und `No scenario:`-Begründung. Commit-Betreff 47 Zeichen, Conventional Commit.
- Kein Widerspruch zu `CLAUDE.md` «Keep going … ask only when blocked, before anything destructive»: die `ask`-Regeln setzen genau dieses «before anything destructive» technisch durch (ausser C-7).

## Nicht bestätigt

- Platzhalter an beliebiger Stelle (`Bash(git push * --force*)`) und die Wortgrenze bei `:*` (ob `git push --force:*` auch `--force-with-lease` trifft) hängen von der Claude-Code-Version ab; nicht ausprobiert, kein Zugriff auf die Laufzeit-Dokumentation der eingesetzten Version. Die Syntax `Bash(<präfix>:*)` selbst ist gültig.
- Ob `ask`-Regeln auch für Teilbefehle in Ketten (`cd backend && bun run db:reset`) und im Modus `bypassPermissions` greifen: nicht geprüft.
- Welche Ponytail-SKILL.md geladen wird, wenn Projektkopie und Plugin beide vorhanden sind (C-6): Plugin ist in dieser Umgebung nicht installiert (`~/.claude/plugins/installed_plugins.json` leer).
- R-7 (vom Product Owner nicht gewählt): Inhalt nicht im Repo; ob die Entscheidung irgendwo festgehalten werden muss, nicht prüfbar.
- Tests: keine; Änderung betrifft nur Anweisungen und Konfiguration, kein Test im Repo deckt `.claude/` ab.
