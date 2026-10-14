# B-15 Instruktionen, Slice 1: Code-Review Runde 1

Diff `2efcd56..a1b1d10` (ein Commit, `chore(config): B-15 tool improvements`), gelesen im Worktree `review-slice1`. Anforderung: `docs/reviews/b15-instruktionen-pruefung.md`, Abschnitt 2, Punkte 1, 3, 9, 10, 15, mit den Entscheiden des Benutzers (Punkt 1 über `preload` in `backend/bunfig.toml`, kein Hook; keine App-Änderungen). Alle 14 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `.claude/hooks/session-start.sh:11-14` | In einem Klon ohne Remote-Tracking-Ref `origin/main` (Single-Branch-Klon, in `CLAUDE.md` «Fallow gate» als vorkommend genannt) gelingt `git fetch origin main`, aber `git rev-list HEAD..origin/main` scheitert; mit `set -e` bricht der Hook ab, bevor `bun install`, PostgreSQL und der Chromium-Shim laufen. |
| C-2 | Minor | `backend/CLAUDE.md:17`, `CLAUDE.md:23`, `docs/test-pyramid.md:106` | «Every `bun test` in `backend/` loads the preload» stimmt nur für `backend/` selbst: Bun liest `bunfig.toml` nur im Arbeitsverzeichnis. Aus `backend/src` läuft `bun test` ohne Preload (Probe unten), und die bisherige Warnung «Never run `bun test` without the preload» ist entfernt. Vorschlag: «run `bun test` from `backend/`, not a subdirectory». |
| C-3 | Minor | `tools/open-work/check-issues.mjs:59-61` | Eine Listenantwort, die nicht ok ist (z. B. 404, 422, 5xx mit JSON), ergibt ein Objekt ohne `length`; `!issues.length` beendet die Schleife, und die Prüfung gilt stillschweigend als bestanden. Nur 401/403 werden gemeldet. Kein Test für diesen Fehlerweg. |
| C-4 | Minor | `tools/open-work/check-issues.mjs:63` | `body.includes('Proposed (confirm before starting)')` findet die Wendung auch in Fliesstext (z. B. ein Issue, das diese Regel beschreibt, wie Punkt 10 der Prüfung). Da die Prüfung in jedem PR und auf `main` läuft, macht so ein Issue jeden PR rot, ohne dass der PR etwas damit zu tun hat. Eine Prüfung auf die Überschrift (`/^#+\s*Proposed \(confirm before starting\)/m`) wäre genauer. |
| C-5 | Minor | `implementation_plan.md:20` | «Test red: … «Cannot read issues of rudini/Dwello»»: Rot war der Test, weil das Skript `GITHUB_API_URL` noch nicht kannte und gegen die echte API mit 401 abbrach, nicht weil die Label-Prüfung fehlte. Diese Lücke erkennt der Test zwar (ohne die neue Schleife bliebe der Exit-Code 0), gezeigt wurde das Rot aber nicht. |
| C-6 | Nit | `.claude/hooks/session-start.sh:13-14` | Der Hinweis verweist auf «CLAUDE.md, Branches»; dort steht die Regel «am Anfang neu ab `origin/main`» noch nicht (folgt mit Slice 2, Punkt 15). |
| C-7 | Nit | `.claude/hooks/session-start.sh:11` | `git fetch` hat kein Timeout; bei hängendem Netz wartet der Session-Start bis zum Hook-Timeout. |
| C-8 | Nit | `implementation_plan.md:12` | Der Punkt 9 der Checkliste nennt `examplesTitleFormat`; umgesetzt ist der Kommentar `# title-format:` (in der Notiz Zeile 19 begründet). |

## Blocker/Major

### C-1: Session-Start-Hook bricht ohne `origin/main`-Ref ab

`git fetch -q origin main` aktualisiert `refs/remotes/origin/main` nur, wenn die Fetch-Refspec des Remotes `main` abdeckt. In einem Single-Branch-Klon (Refspec `+refs/heads/<branch>:refs/remotes/origin/<branch>`) schreibt der Fetch nur `FETCH_HEAD`; `origin/main` existiert nicht. Die Bedingung des `if` ist dann wahr, die Zuweisung `behind=$(git rev-list --count HEAD..origin/main)` scheitert, und `set -euo pipefail` beendet das Skript mit 128. Alles danach (`bun install`, PostgreSQL mit der Rolle `dwello`, `PLAYWRIGHT_BROWSERS_PATH`) fehlt der Session. Vor dem Diff lief der Hook in diesem Fall durch. Die Zusatzfunktion (ein Hinweis) macht so die bestehende Einrichtung kaputt.

Nachweis (Scratchpad, lokales Repo mit `main` und `feat`, `git clone --single-branch -b feat`, dann die neuen Zeilen unter `set -euo pipefail`):

```
+refs/heads/feat:refs/remotes/origin/feat
fatal: ambiguous argument 'HEAD..origin/main': unknown revision or path not in the working tree.
exit=128          # "reached bun install" wird nie ausgegeben
```

Die Probe im Plan (ein Worktree des Hauptklons, Refspec `+refs/heads/*:refs/remotes/origin/*`) deckt diesen Fall nicht ab. Behebung, z. B.: `git fetch -q origin main:refs/remotes/origin/main` (so wie `CLAUDE.md` es beim Fallow-Gate empfiehlt) oder `HEAD..FETCH_HEAD`, und den Hinweis nicht tödlich machen (`|| true` bzw. Prüfung in der `if`-Bedingung).

## Geprüft und bestätigt

- **1:** `backend/bunfig.toml` setzt `preload = ["./scripts/test-db.ts"]`; die `--preload`-Flags in `backend/package.json` sind entfernt; CI ruft `bun run test` mit `working-directory: backend` auf, bleibt also abgedeckt. Keine weiteren Aufrufe mit `--preload` ausserhalb alter Review-Berichte. Docs (`CLAUDE.md`, `backend/CLAUDE.md`, `docs/test-pyramid.md`) nachgeführt; Einschränkung siehe C-2.
- **3:** `persona-stack.sh` kopiert `build/` nach `/tmp/persona-app` (mit `package.json` für ES-Module und einem Link auf `node_modules`) und startet `node /tmp/persona-app`; alte Server auf 3300/3301 werden vorher beendet, `--no-build` kopiert den letzten Build. `CLAUDE.md` «One build» und `docs/design/arbeitsregeln.md` stimmen mit dem neuen Verhalten überein; Schritt 5 («Never run E2E while the persona stack runs») bleibt gültig.
- **9:** `# title-format: <Bildschirm> <Zustand>` vor den Beispielen beider Grundrisse; `tests/unit/a11y-screens.test.ts` und `tests/unit/i18n-screens.test.ts`, die beide Feature-Dateien lesen, bleiben grün (von mir erneut ausgeführt: 5 bestanden). Kein Code im Repo hängt an den alten Titeln «Example #n». Der Befehl in `tests/e2e/CLAUDE.md` passt zur Titelform «<Grundriss> <Bildschirm> <Zustand>».
- **10:** Neue Schleife über alle offenen Issues (seitenweise, PRs ausgenommen); `GITHUB_API_URL` setzt GitHub Actions selbst, die Vorgabe ist `https://api.github.com`. `tools/**/*.test.ts` liegt im `server`-Projekt von `vitest.config.ts`, läuft also in CI mit. Test von mir erneut ausgeführt: 2 bestanden. Über `gh api` geprüft: die 14 offenen Issues mit dem Abschnitt tragen alle `entscheiden`, die Prüfung macht `main` heute also nicht rot.
- **15:** Hinweis bei Rückstand gegenüber `origin/main` in normalen Klonen korrekt; Fehler siehe C-1.
- Plan-Notizen: `Skills: tdd, ponytail-review` vorhanden; `Test red` für den neuen Test vorhanden (Einschränkung C-5). Keine App-Änderung, daher kein Szenario, keine Texte in `messages/*.json`, keine Einträge in `tests/a11y/screens.json` nötig. Nichts im Diff ausserhalb der Anforderung.

## Nicht bestätigt

- Dass playwright-bdd den Kommentar `# title-format:` auswertet und `--list` 629 Tests ohne doppelte Titel zeigt: vom Aufrufer gemeldet. `bddgen` schreibt `.features-gen`, und `node_modules/playwright-bdd` liegt im Hauptbaum (Lesen gesperrt); nicht selbst geprüft.
- Probeläufe zu 1 (`DATABASE_URL` unter blossem `bun test`), 3 (alter Asset nach neuem Build weiter ausgeliefert) und 15 (Hinweis im Worktree): vom Aufrufer gemeldet. Für 1 habe ich nur das Bun-Verhalten in einem Scratch-Projekt geprüft (Bun 1.4.2: Preload läuft aus dem Verzeichnis mit `bunfig.toml`, nicht aus einem Unterverzeichnis; Grundlage für C-2). Backend-Tests nicht gestartet, weil jeder Lauf `dwello_test` neu anlegt und die Hauptsession parallel arbeitet.
- Backend `bun run test` 539 bestanden, `bun run lint`, `deepcheck:audit`, `fallow audit`: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- `bun run test:coverage`, `bun run check`, E2E: laut Aufrufer noch nicht gelaufen; von mir nicht gestartet.
- Ob adapter-node aus `/tmp/persona-app` alle Laufzeitdateien findet (z. B. Zugriffe relativ zu `process.cwd()`): nur am Skript gelesen; der Probelauf des Aufrufers deckt `/login` und ein Asset ab.
