# Review demo-update, Runde 2

Delta 1ea7023..3a515c0 (Commit 3a515c0), Worktree `review-update-code-reviewer-2`. Gelesen: `deploy/demo/update.sh`, `deploy/demo/reset-demo.sh`, `deploy/demo/README.md` (Abschnitt 7 und alle Stellen zu Lock und Cron), `implementation_plan.md`, `docs/reviews/demo-update-review-1.md`. Alle Dateien des Deltas sind gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-8 | Minor | implementation_plan.md:17 | Die Zeile `Skills:` nennt nur ponytail. Für einen Slice, der Code ändert (die Scripts sind Code), verlangt Workflow 3 auch `ponytail-review`. Dass es kein tdd gibt, ist begründet (Sandbox statt Suite), `ponytail-review` fehlt aber ohne Grund. |
| C-9 | Nit | deploy/demo/README.md:96 | «It needs … no local changes to tracked files: then `git merge --ff-only` fails on every run». Hier liest sich «then» wie eine Folge der Bedingung. Gemeint ist «otherwise». |
| C-10 | Nit | deploy/demo/update.sh:19-20 | `docker image prune` läuft vor dem Schreiben der Markierung. Schlägt nur das Prune fehl, ist die App deployt, aber jeder Lauf baut neu. Das ist sehr unwahrscheinlich. Wird die Markierung vor dem Prune geschrieben, ist der Fall ausgeschlossen. |

Es gibt keinen Blocker und keinen Major.

## Status der Befunde aus Runde 1

| ID | Status | Nachweis |
|---|---|---|
| C-1 (Major) | behoben | update.sh:14 vergleicht `origin/main` mit `.git/demo-deployed`. Die Datei wird erst nach `up -d --build` und `prune` geschrieben (Zeile 20). Nach einem Fehler ist `merge --ff-only` ein No-op, und der Build läuft erneut. In meiner Sandbox (`scratchpad/sbx-r2`: Bare-Repo, `docker`-Stub, der fehlschlagen kann) gilt: Erster Lauf ohne Markierung → Build, Markierung c582d86. Kein neuer Commit → still, exit 0. Neuer Commit, Build schlägt fehl → exit 1, Markierung bleibt. Zweiter Fehler → erneuter Versuch, exit 1. Build gelingt → Markierung 0b1d1a4. Danach still. Das gilt auch, wenn der Start an einer Migration scheitert, weil `up -d` dann ebenfalls ungleich 0 endet. Zusätzlich geprüft: Ein lokaler Commit auf der VM (HEAD vor origin/main) führt zu keiner Endlosschleife, da origin/main gleich der Markierung bleibt. |
| C-2 (Minor) | behoben | README.md:96 sagt jetzt: «about a minute without the app (the new backend migrates and must report healthy …)». |
| C-3 (Minor) | behoben | README.md:102: Das Log enthält die Build-Ausgabe und eine Zeile pro Lauf, solange GitHub nicht erreichbar ist, dazu der Hinweis auf `logrotate`. |
| C-4 (Minor) | behoben | Beide Scripts setzen den Lock in `.git/demo.lock` (update.sh:8, reset-demo.sh:9), jeweils nach `cd` ins Repo-Root. Kein Verweis auf `/tmp/dwello-demo.lock` ist übrig (grep). Der Lock hält: In der Sandbox endet update.sh bei gehaltenem Lock still mit 0. Es bleibt ein Restfall, der kein Befund ist: Ein `sudo reset-demo.sh` vor dem allerersten Cron-Lauf würde die Datei als root anlegen. Danach bleibt die Datei aber bestehen, ein Neustart leert sie nicht mehr. |
| C-5 (Minor) | abgelehnt (gewollt) | Die Begründung im Plan ist schlüssig. Ich akzeptiere sie. |
| C-6 (Minor) | behoben | implementation_plan.md:5-19: Session 32 enthält Checkliste, Dateien, «No scenario»-Begründung und Triage-Zeile. Die Lücke bei den Skills steht unter C-8. |
| C-7 (Nit) | behoben | README.md:96 erwähnt lokale Änderungen und den `--ff-only`-Fehler im Log. Zur Formulierung siehe C-9. |

## Weiter geprüft

- **Erster Lauf:** Ohne Markierung liefert `cat … 2>/dev/null` einen leeren String. Der Vergleich ist dann falsch, und es wird einmal gebaut. Das stimmt mit README.md:96 überein.
- **`.git/demo-deployed` und `.git/demo.lock`:** Beide liegen in `.git`, darum sieht git sie nicht. `git status --porcelain --ignored` im Sandbox-Clone ist leer, ein `merge --ff-only` stört also nichts.
- **Umfang:** Das Delta ändert nur die zwei Scripts, README Abschnitt 7, den Plan und das Review-Protokoll aus Runde 1. Es enthält keinen App-Code, keine Texte, Szenarien oder Verträge.

## Nicht bestätigt

- `sh -n` beider Scripts: vom Aufrufer gemeldet. Mit `sh` ausgeführt habe ich update.sh in der Sandbox (siehe C-1). reset-demo.sh habe ich nicht ausgeführt, nur die geänderte Zeile 9 gelesen.
- Die Sandbox-Läufe des Aufrufers: vom Aufrufer gemeldet. Ich habe dieselben Fälle selbst nachgestellt (siehe oben).
- Verhalten auf der echten VM: Rechte von `.git`, ob cron als `ubuntu` läuft, die tatsächliche Ausfallzeit beim Umschalten. Das ist abgeleitet, nicht gemessen.
- lint, Tests und deepcheck: nicht ausgeführt, weil das Delta keinen App-Code ändert.
