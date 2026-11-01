# Review #713 (6ddfeef0e..d0e794e63), Runde 1 / Abschlussrunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | .claude/hooks/main-push-guard.mjs:39, :67-68 | `cd <checkout von main> && git push` geht durch: der Hook löst das Ziel in `input.cwd` auf, das `cd` davor wird zwar als eigenes Kommando erkannt, aber nicht verfolgt |
| C-2 | Minor | .claude/hooks/main-push-guard.mjs:47 | Umleitung mit Leerzeichen (`git push origin > /tmp/log`, `git push origin 2> /dev/null`): nur `>` wird verworfen, das Ziel `/tmp/log` gilt als Refspec, also wird `@{push}` nicht gefragt; mit main ausgecheckt geht der Push durch. Gleich bei `\`-Zeilenfortsetzung (`git push origin \⏎HEAD:main`: `\` wird Refspec, `HEAD:main` ein eigenes Kommando) |
| C-3 | Minor | .claude/hooks/main-push-guard.mjs:68 | Präfixe vor `git` gehen durch: `env X=1 git push`, `X=1 git push`, `GIT_DIR=… git push`, `command git push`, `timeout 60 git push`, `bash -c "git push"`, `` `git push` ``; ebenso `git --git-dir <dir> push` (:44 wertet `<dir>` als anderes Git-Kommando) |
| C-4 | Minor | .claude/hooks/main-push-guard.mjs:48, :60-63 | Refspecs, die main mitnehmen, ohne main zu nennen: `git push origin :` (matching), `git push origin 'refs/heads/*:refs/heads/*'`, `@` als HEAD (`git push origin @` mit main ausgecheckt), DWIM-Ziel `feature:heads/main`; `push.default=matching` bzw. `remote.origin.mirror=true` bei nacktem `git push` (`@{push}` nennt dann nur den eigenen Branch) |
| C-5 | Minor | tools/claude-hooks/main-push-guard.test.ts:38-46 | Kein Ask-Fall für `git push origin main` (Ziel = Quelle, :61 `target = source`) und `git push origin :main` aus dem Feature-Branch; `--mirror`/`--branches` ungetestet |

## C-1 (Major)

Warum falsch: Die Anforderung (#713) ist ein Hook, der das Push-Ziel auflöst; der Kernfall des Issues ist der nackte `git push` mit main ausgecheckt. Subagenten bekommen ihr cwd vor jedem Bash-Aufruf zurückgesetzt und schreiben darum fast jeden Befehl als `cd /abs/pfad && …` (so auch die Vorgaben in `CLAUDE.md`, Gotchas, und diese Review-Umgebung). Für diese Form löst der Hook das Ziel im falschen Verzeichnis auf: `toMain` startet bei `resolve(input.cwd …)` (:39), das Wortpaar `['cd', dir]` aus `commands()` wird in :68 verworfen. Steht `input.cwd` auf einem Feature-Branch und `dir` ist ein Checkout von main, liefert `@{push}`/`rev-parse HEAD` den Feature-Branch, es kommt kein `ask`. Keine der Text-Regeln in `.claude/settings.json:92-103` trifft `cd … && git push`, und `git push` steht in keinem `allow`, d. h. im Auto-/Bypass-Modus läuft er ohne Rückfrage.

Nachweis: Tokenizer in-memory ausgeführt: `"cd /x && git push"` ergibt `[["cd","/x"],["git","push"]]`; :68 behält nur das zweite, `dir` bleibt `input.cwd`. Test, der rot wäre: in `main-push-guard.test.ts` `['cd in einen Checkout von main', () => onFeature, 'cd "%MAIN%" && git push']` in die Ask-Liste.

Abhilfe (kurz): in der Schleife über `commands(command)` ein `cd <dir>` als neues `dir` für die folgenden Kommandos übernehmen (relativ zu `input.cwd`). Dass `commit-msg-gate.mjs:7` das `cd` bewusst nicht verfolgt, trägt hier nicht: dort fällt bei einem Fehlgriff nur eine Prüfung aus, hier geht ein Push auf main ohne Rückfrage durch.

## Zu den vom Aufrufer genannten Fällen

- `git push origin main` vom Feature-Branch: korrekt, :61 setzt `target = source` = `main`, Rückfrage. Nur ungetestet (C-5).
- `git push origin :main`: korrekt, `target` = `main`, Rückfrage (C-5).
- `cd dir && git push`: Lücke, Major (C-1).
- `env X=1 git push` / `command git push`: Lücke, Minor (C-3). Solche Präfixe schreibt ein kooperativer Agent selten aus Versehen; bewusstes Umgehen ist nicht das Bedrohungsmodell eines Ask-Hooks.
- Upstream des Feature-Branches auf main: korrekt. Bei `push.default=simple` (Standard) lässt sich `@{push}` mit abweichendem Upstream-Namen nicht auflösen, der Hook fällt auf `feature` zurück, und Git selbst verweigert den Push («upstream branch … does not match»). Bei `push.default=upstream` liefert `@{push}` `origin/main`, also Rückfrage. Kein Befund.

## Nicht bestätigt

- Rotlauf ohne Hook (11 rot), grün mit Hook (12 Tests), Rotlauf des Registrierungstests ohne Settings-Eintrag, `tools/claude-hooks` (47 Tests), `bun run lint`, `bun run check`, `jq` auf `settings.json`, manueller `git push` auf einem Feature-Branch: vom Aufrufer gemeldet. Selbst nichts ausgeführt außer dem Tokenizer `commands()` in-memory (node -e, ohne Schreibzugriff).
- Branch-Schutz auf main (die zweite Lösung der Anforderung): `gh api repos/rudini/Dwello/branches/main` liefert `protected: true`, die Regeln selbst (`/protection`) gibt 403 zurück. Ob ein direkter Push abgewiesen wird (Admin-Bypass, enforce_admins), ist offen; davon hängt ab, wie weit C-1 bis C-4 tragen.
- Ob `permissionDecision: "ask"` aus einem PreToolUse-Hook auch im Bypass-/Auto-Modus wirklich eine Rückfrage auslöst: nur aus der Hook-Schnittstelle erschlossen, nicht ausprobiert.
- Das Verhalten von `@{push}` bei `simple` mit abweichendem Upstream und bei `matching`: aus dem Git-Verhalten erschlossen, nicht in einem Klon ausprobiert (keine schreibenden Befehle).

Geprüft: Registrierung in `settings.json:170-177`, Abschnitt in `commit-gates/SKILL.md:32-34` (stimmt mit dem Code überein), Commit-Subject, nichts Fremdes im Diff, keine App-Änderung (kein Szenario nötig), kein ungenutzter Code.
