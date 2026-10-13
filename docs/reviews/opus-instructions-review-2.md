# Review: Behebung C-1 bis C-9, Runde 2

Bereich: `git diff 58a314d..0480272` (Commit `0480272 fix(config): cover project's destructive commands`).
Gelesen: alle geänderten Dateien (`.claude/settings.json` vollständig, `.claude/agents/code-reviewer.md`, `.claude/agents/persona.md`, `.claude/skills/tdd/SKILL.md`, `implementation_plan.md`, `docs/reviews/opus-instructions-review-1.md`), dazu `backend/package.json`, `docker-compose.dev.yml`, `README.md:270-275`, `docs/design/tools/persona-stack.sh`, `.claude/skills/ponytail/SKILL.md` im Stand `8e229d4`.
Grundlage für die Regelsemantik: die vom Aufrufer zitierte Doku (`*` an beliebiger Stelle, Leerzeichen vor abschliessendem `*` = Wortgrenze, ask/deny greifen auf jeden Teilbefehl einer Kette, ask fragt auch in auto/bypassPermissions).

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-10 | Major | `.claude/settings.json:62-63` | Die im Repo dokumentierte Schreibweise `docker-compose -f docker-compose.dev.yml down -v` (Bindestrich) fragt nicht; C-2 ist für Compose nur halb behoben |
| C-11 | Minor | `.claude/settings.json:47-49,54` | Weitere Formen, die ungesicherte Arbeit verwerfen, fehlen: `git checkout HEAD -- <pfad>`, `git checkout -f`, `git switch -f`/`--discard-changes`, `git worktree remove -f` |
| C-12 | Minor | `.claude/settings.json:58-59` | `dropdb` greift nur ohne Wrapper und mit `dwello` am Ende: die Repo-Form `su postgres -c "dropdb dwello"` (wie `persona-stack.sh:8`), `dropdb dwello --if-exists` und `psql -c "DROP DATABASE dwello"` fragen nicht |
| C-13 | Minor | `.claude/settings.json:41-44` | Löschen eines entfernten Branches fragt nicht: `git push origin --delete <branch>`, `git push origin -d <branch>`, `git push origin :<branch>` |
| C-14 | Nit | `.claude/settings.json:60-61` | `*db:reset*`/`*db:push*` fragen auch bei reinem Lesen (`grep -rn db:reset backend`) und bei `git commit -m "…db:reset…"` |
| C-15 | Nit | `.claude/settings.json:49` | `git restore *` fragt auch bei `git restore --staged <datei>` (nur Unstage, verwirft nichts) |
| C-16 | Nit | `.claude/settings.json:59` | `dropdb * dwello` fragt auch bei `dropdb dwello_e2e -U dwello` (Testdatenbank, laut `CLAUDE.md` nicht destruktiv) |

## Blocker/Major

### C-10 `docker-compose … down -v` fragt nicht (Major)

`.claude/settings.json:62-63` erfassen nur `docker compose` (Leerzeichen). Die einzige Gebrauchsanweisung im Repo schreibt den Befehl mit Bindestrich: `docker-compose.dev.yml:2` («Usage: docker-compose -f docker-compose.dev.yml up -d»), `docker-compose.prod.yml:2`, `README.md:270,275`. Ein Agent, der den Stack nach dieser Anleitung abbaut, schreibt `docker-compose -f docker-compose.dev.yml down -v`; das löscht das Volume mit der Entwicklungsdatenbank `dwello` und allen Testdatenbanken. Der Befehl beginnt mit `docker-compose`, keine der beiden Regeln trifft. Runde 1 hatte genau diese Schreibweise als Behebung vorgeschlagen (`opus-instructions-review-1.md:34,40`); im Plan steht C-2 trotzdem als «fixed».

Nachweis: im Auto-Modus `docker-compose -f docker-compose.dev.yml down -v` ausführen lassen (gefahrlos mit einem leeren Compose-Projekt oder `--dry-run` bei Compose v2.17+): keine Rückfrage.

Behebung: `"Bash(docker-compose *down*-v*)"` und `"Bash(docker-compose *down*--volumes*)"` ergänzen.

## Bestätigt

- C-1 behoben: `*db:reset*` (Zeile 60) trifft `bun run db:reset`, `cd backend && bun run db:reset` (Teilbefehl) und `bun --cwd backend run db:reset`; kein anderes Skript in `backend/package.json` enthält `db:reset`, also keine Rückfrage bei Testdatenbanken.
- C-2 behoben bis auf C-10: `git push *--force*` trifft `git push --force`, `git push origin x --force`, `--force-with-lease`; `git push -f*` und `git push * -f*` treffen `-f` an jeder Stelle; `git push * +*` trifft `git push origin +x`. `rm -r*`, `rm -R*`, `rm -f*` treffen `rm -rf`, `rm -fr`, `rm -r -f`, `rm -Rf`, `rm -r`. `docker compose *down*-v*` trifft `docker compose -f docker-compose.dev.yml down -v`.
- C-3 behoben bis auf C-11: `git checkout .`, `git checkout -- *`, `git restore *`, `git stash drop/clear`, `git branch -D *`, `git branch *--force*` (deckt `--delete --force`), `git worktree remove *--force*`, `*db:push*`.
- C-4 behoben: `code-reviewer.md:34-35` eine Tabelle, Minor/Nit nur als Zeile, Blocker/Major darunter mit ID.
- C-5 behoben: `persona.md:17,23` Tabelle mit Schwere, «Vorschläge» verweisen per Tabellen-ID, keine zweite Schwere-Angabe.
- C-6 Ablehnung trägt: die Projektkopie `.claude/skills/ponytail/SKILL.md` enthielt schon vor `8e229d4` Dwello-Sätze (Zeilen 108-109 in jenem Stand), die Projektkopie ist also bereits die massgebliche Fassung; Plugin-Skills sind nach Doku mit `ponytail:` namensgeräumt, `/ponytail` aus `CLAUDE.md` meint die Projektkopie.
- C-7 behoben: `dropdb dwello` / `dropdb * dwello` treffen `dwello_e2e`, `dwello_test`, `dwello_persona` am Ende nicht (Ausnahme C-16).
- C-8 Ablehnung trägt: `git clean -n` ist selten, eine engere Regel (`git clean -f*`) verfehlt `git clean -df`/`-xdf`; die Rückfrage beim Trockenlauf ist der kleinere Schaden.
- C-9 behoben: `tdd/SKILL.md:56,58` «the task or issue».
- Keine Rückfrage bei Routinebefehlen: `git push -u origin <branch>` (auch mit Branchnamen wie `claude/fix-foo`, da ` -f` ein Leerzeichen vor `-f` verlangt), `git push origin HEAD`, `git push --follow-tags` (`--f` ≠ ` -f`), `bun run db:migrate`, `bun run db:demo`, `bun run dev:demo`, `docker compose -f docker-compose.dev.yml down` ohne `-v`, `git checkout <branch>`, `git switch -c <branch>`. Rückfrage bei `rm -f`/`rm -r` im Scratchpad: vom Aufrufer als akzeptabel genannt.
- `.claude/settings.json` ist gültiges JSON; Commit-Betreff 49 Zeichen, Conventional Commit; Plan-Session 22 listet ID, Schwere, Status und Grund der Ablehnungen.
- Nichts Fremdes im Diff.

## Nicht bestätigt

- Die Regeln selbst nicht im Claude-Code-Laufzeitmatcher ausgeführt (kein Zugriff auf die Laufzeit aus dem Review heraus); die Aussagen oben folgen aus der vom Aufrufer zitierten Doku. Offen insbesondere: ob ein Muster ohne abschliessendes `*` (`dropdb * dwello`, `git checkout .`) bis zum Zeilenende verankert ist, ob Umgebungsvariablen-Präfixe (`PGPASSWORD=… dropdb dwello`) vor dem Abgleich entfernt werden, und ob `git clean *` (Wortgrenze) auch blosses `git clean` trifft (harmlos, das verweigert ohne `-f`).
- Ob `docker-compose` (v1) in der Zielumgebung installiert ist: nicht geprüft; die Repo-Anleitung setzt es voraus (C-10).
- Tests: keine; kein Test im Repo deckt `.claude/` ab.
