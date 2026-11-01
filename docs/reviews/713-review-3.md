# Review 713, Runde 3 (Abschlussrunde), Delta e018565b4..d6b5fddbf

Geschlossen: C-6, C-7, C-8

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-9 | Minor | .claude/hooks/main-push-guard.mjs:98 | Ein relatives `cd` nach einem unbekannten Verzeichnis macht es wieder «bekannt»: `resolve(dir ?? '.', to)` hängt es an das cwd des Hook-Prozesses statt `dir` unbekannt zu lassen. `cd "$REPO" && cd sub && git push` löst gegen `<Hook-cwd>/sub` auf, das es meist nicht gibt; `spawnSync` liefert nichts, keine Rückfrage, auch wenn `$REPO/sub` ein Checkout von main ist. Das ist derselbe Fall, den C-8 schliessen sollte. Ein Fix: `dir = !dir && !to.startsWith('/') ? undefined : …` |
| C-10 | Minor | .claude/hooks/main-push-guard.mjs:97 | Der neu eingeführte Ersatz von `~` (`cd ~/…`, `cd` ohne Argument) hat keinen Test, der ohne ihn rot wird: ohne ihn bleibt `~` unbekannt und der Push fragt auch so. Den Ersatz zeigt erst ein Fall, der durchgeht, z.B. `cd ~ && git push` mit `HOME` = onFeature im `env` des Hook-Aufrufs |
| C-11 | Minor | .claude/hooks/main-push-guard.mjs:27 | Seit der Backtick nicht mehr trennt, läuft eine echte Command-Substitution mit Push ohne Rückfrage durch: `` echo `git push origin main` `` liefert die Wörter `["echo","`git","push","origin","main`"]`, keine Rückfrage (vor dem Fix eine). `$(git push origin main)` fragt weiterhin, weil `(` trennt. Weder der Kopfkommentar (Z. 2–7) noch SKILL.md nennen diese Lücke, kein Test hält sie fest. Selten bei Agents, darum Minor |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: die 3 neuen Fälle zuerst rot, `main-push-guard.test.ts` grün (29 Fälle), `tools/claude-hooks` grün (64 Tests), Lint und Prettier grün.
- Die Rot-Läufe habe ich nur durch Lesen beurteilt: «a cd the hook cannot resolve» (alt: `resolve(onFeature, '$CHECKOUT')`, kein solches Verzeichnis, keine Rückfrage), «a pushd …» (alt hat `pushd` nicht verfolgt), Heredoc (alt hat der Backtick getrennt) und der Fall mit der Fortsetzungszeile (alt ohne die Ersetzung `\\\n` Z. 17: `HEAD:main` wird ein eigenes Kommando) werden ohne den Fix rot.

Geprüft: Die Session-Befehle `git push -q -u origin <feature> 2>&1 | grep -v …`, `cd /home/user/Dwello && git push -q origin <feature>` und `git fetch` bleiben ohne Rückfrage (absoluter Pfad ohne `$`/`` ` ``/`~`, Z. 98; `fetch` ist für `toMain` ein anderer git-Befehl, Z. 63). Kopfkommentar und SKILL.md stimmen mit dem Verhalten überein, nur C-11 fehlt dort.
