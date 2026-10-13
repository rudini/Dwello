# Review: Behebung C-10 bis C-16, Runde 3

Bereich: `git diff 0480272..ef4aa58` (Commit `ef4aa58 fix(config): ask for docker-compose and git forms`).
Gelesen: alle geänderten Dateien (`.claude/settings.json` Abschnitt `permissions` vollständig, `implementation_plan.md` Session 22, `docs/reviews/opus-instructions-review-2.md`), dazu `docs/design/tools/persona-stack.sh` und alle `dropdb`/`DROP DATABASE`-Stellen im Repo.
Grundlage für die Regelsemantik: die vom Aufrufer zitierte Doku (`*` an beliebiger Stelle, Leerzeichen vor abschliessendem `*` = Wortgrenze, `:*` nur am Ende als alte Präfixform, ask/deny greifen auf jeden Teilbefehl einer Kette).

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-17 | Minor | `.claude/settings.json:46` | `git push * -d *` verlangt etwas zwischen `git push` und ` -d ` sowie ein Leerzeichen danach: `git push -d origin <branch>` (Option zuerst) und `git push origin <branch> -d` (Option am Ende) fragen nicht. `"Bash(git push -d *)"` und `"Bash(git push * -d)"` würden die Lücke schliessen |
| C-18 | Nit | `.claude/settings.json:73,75` | `*down*--volumes*` ist neben `*down*-v*` überflüssig: `--volumes` enthält `-v` (gilt für `docker compose` und `docker-compose`) |

Kein Blocker, kein Major.

## Bestätigt

- C-10 behoben: `docker-compose *down*-v*` (Zeile 74) trifft `docker-compose -f docker-compose.dev.yml down -v` und `… down --volumes`; `docker-compose -f docker-compose.dev.yml up -d`, `… down` ohne `-v` und `… logs -f backend` treffen nicht (kein `down` bzw. kein `-v` danach).
- C-11 behoben: `git checkout *-- *` trifft `git checkout -- <pfad>` und `git checkout HEAD -- <pfad>`, nicht `git checkout --track …`/`--orphan …` (kein `-- `); `git checkout -f*`/`* -f*`, `git switch -f*`/`* -f*`, `git switch *--discard-changes*`, `git worktree remove -f*`/`* -f*` decken die genannten Formen.
- C-12 teilweise behoben (`dropdb dwello *` trifft `dropdb dwello --if-exists`, nicht `dropdb dwello_e2e`, da nach `dwello` ein Leerzeichen verlangt ist). Ablehnung für Wrapper-Formen trägt: eine Shell-Hülle (`su -c`, `bash -c`, `psql -c`) entzieht jeden Befehl den Präfixregeln, eine Regel je Hülle wäre unvollständig; das einzige `dropdb` im Repo (`persona-stack.sh:8`) löscht `dwello_persona`, das `CLAUDE.md` als nicht destruktiv nennt.
- C-13 behoben für `--delete` und `origin -d <branch>` (Rest: C-17). Ablehnung für `git push origin :<branch>` trägt: jedes Muster für `:<branch>` endet auf `:*` und würde als alte Präfixform gelesen, also bei jedem Push fragen.
- C-14, C-15, C-16 Ablehnungen tragen: alle Nits, die Folge ist eine Rückfrage zu viel, nicht ein verlorener Datenbestand; C-15 zusätzlich richtig begründet (eine allow-Regel kann eine ask-Regel nicht einschränken).
- Keine Rückfrage bei Routinebefehlen durch die neuen Regeln: `git push -u origin <branch>` (kein ` -d `, kein `--delete`), `git switch -c x` und `git switch -c fix-foo` (kein ` -f`, `-f` in `fix-foo` ohne Leerzeichen davor), `git checkout feature-x` und `git checkout -b feature-fix` (kein ` -f`, kein `-- `), `git worktree add …` (keine `remove`-Regel trifft), `bun run db:migrate` (weder `db:reset` noch `db:push`).
- `.claude/settings.json` ist gültiges JSON; Commit-Betreff 49 Zeichen, Conventional Commit, Scope `config`; Session 22 listet ID, Schwere, Status und Grund jeder Ablehnung.
- Nichts Fremdes im Diff (der Bericht von Runde 2 gehört zum Ablauf).

## Nicht bestätigt

- Die Regeln nicht im Claude-Code-Laufzeitmatcher ausgeführt (kein Zugriff aus dem Review); alle Aussagen folgen aus der zitierten Doku. Offen bleibt wie in Runde 2, ob ein Muster ohne abschliessendes `*` (`dropdb dwello`, `git checkout .`) am Zeilenende verankert ist und ob `dropdb dwello *` mit Wortgrenze auch blosses `dropdb dwello` trifft (dafür steht ohnehin Zeile 67).
- Tests: keine; kein Test im Repo deckt `.claude/` ab.
