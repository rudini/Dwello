# Review demo-update, Runde 1

Commit 1ea7023 (Diff 0d56a9d..1ea7023), Worktree `review-update-code-reviewer`. Gelesen: `deploy/demo/update.sh`, `deploy/demo/reset-demo.sh`, `deploy/demo/README.md` (ganz), dazu `deploy/demo/docker-compose.yml`, `docker-compose.prod.yml`, `backend/Dockerfile`, `implementation_plan.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | deploy/demo/update.sh:13-17 | Schlägt der Build fehl, steht HEAD schon auf origin/main: Der nächste Lauf beendet sich still mit 0 und versucht es nie wieder. Die Demo bleibt bis zum nächsten Merge auf dem alten Stand, und der Clone ist den laufenden Containern voraus. |
| C-2 | Minor | deploy/demo/README.md:96 | «a few seconds without the app» stimmt nicht: Das Frontend wartet auf `service_healthy` des neuen Backends (Healthcheck-Intervall 30 s, `docker-compose.prod.yml:33-35,71-75`), und vorher laufen die Migrationen (`backend/Dockerfile:43`). Wird das Backend neu erstellt, fehlt die App also rund 30 bis 60 s. |
| C-3 | Minor | deploy/demo/README.md:99-102, update.sh:17 | Die ganze Ausgabe von `up -d --build` (Build-Log ohne TTY, oft hunderte Zeilen) und jeder Fetch-Fehler (alle 5 min, solange GitHub nicht erreichbar ist) landen in `demo-update.log`. Abschnitt 7 sagt nichts zu logrotate (Abschnitt 6, Zeile 92, schon), und «The log names each update and its commit» beschreibt das Log zu knapp. |
| C-4 | Minor | deploy/demo/update.sh:8, reset-demo.sh:9 | Lock in `/tmp`: Legt ein anderer Benutzer die Datei an (z. B. `sudo deploy/demo/reset-demo.sh` von Hand nach einem Neustart, der `/tmp` leert), scheitert `exec 9>` für `ubuntu` (Datei gehört root, 0644; dazu `fs.protected_regular` im Sticky-Verzeichnis). Danach bricht update.sh alle 5 min mit einem Fehler ab, und der nächtliche Reset fällt aus. Ein Lock in `$HOME` oder im Clone (z. B. `.git/`) vermeidet das. |
| C-5 | Minor | deploy/demo/update.sh:11 | Ist der Clone nicht auf main, schreibt das Script alle 5 min eine Zeile und endet mit 1 (288 Zeilen am Tag). Das ist gewollt laut, verstärkt aber C-3. Nur notiert. |
| C-6 | Minor | implementation_plan.md | Die Datei hat keine `## Session` für diese Aufgabe (nur die 3 Kopfzeilen): Es fehlen Checkliste und geänderte Dateien (Workflow 8). |
| C-7 | Nit | deploy/demo/update.sh:16 | Ist der Arbeitsbaum auf der VM geändert (z. B. Caddyfile von Hand angepasst), scheitert `merge --ff-only`. Bei jedem Lauf stehen dann «updating to …» und der git-Fehler erneut im Log. Das ist sichtbar und richtig, Abschnitt 7 könnte es aber kurz erwähnen. |

## C-1 (Major): Ein fehlgeschlagener Build wird nie wiederholt

**Warum falsch:** update.sh vergleicht in Zeile 13 `HEAD` mit `origin/main`. HEAD rückt aber schon in Zeile 16 vor (`git merge --ff-only`), also vor dem Build in Zeile 17. Bricht `docker compose … up -d --build` ab, beendet `set -e` das Script nach dem Merge. Gründe dafür gibt es unter cron auf einer A1-VM genug: ein Netzfehler bei `bun install` oder beim Image-Pull, zu wenig Speicher, ein voller Datenträger, ein Fehler im neuen Dockerfile. Beim nächsten Lauf gilt dann HEAD = origin/main, und das Script endet in Zeile 13 still mit 0.

Folgen:
- Die Demo bleibt beim alten Stand, bis jemand wieder etwas nach main merged. Die Anforderung «aktualisiert sich bei jedem Merge» ist damit nicht erfüllt.
- Nichts meldet den Fehler, ausser einer letzten Zeile «updating to …» ohne «done» im Log.
- Clone und laufende Container gehen auseinander: Die Compose-Dateien und `reset-demo.sh` stammen aus dem neuen Commit, die Images aus dem alten.

Dasselbe gilt, wenn der Build gelingt und das neue Backend beim Start an einer Migration scheitert: Compose meldet dann einen Fehler, weil das Backend nicht healthy wird, und auch das wiederholt niemand.

**Nachweis (Sandbox im Scratchpad, `sbx-upd`):** Bare-Repo mit einem neuen Commit auf main, dazu ein `docker`-Stub, der bei `compose` mit 1 endet.

```
run 1:
2026-10-14T18:37:33+00:00 updating to 980bbec second
docker compose -f docker-compose.prod.yml ... up -d --build
exit 1
run 2:
exit 0          <- kein erneuter Build, kein Log
```

**Behebung (Vorschlag):** Den zuletzt erfolgreich deployten Commit erst nach `up -d --build` in eine Datei schreiben (z. B. `.git/demo-deployed`) und in Zeile 13 `origin/main` mit dieser Datei vergleichen statt mit HEAD. Dann baut jeder Lauf nach einem Fehler neu, bis ein Build gelingt. Eine Zeile mehr; die laute Wiederholung alle 5 min ist hier erwünscht.

## Geprüft und in Ordnung

- **Cron-Umgebung:** `docker` (get.docker.com legt es in `/usr/bin`), `git`, `flock` und `date` liegen im Standard-PATH von cron (`/usr/bin:/bin`). Das Compose-Plugin findet `docker` selbst. cron setzt HOME aus passwd, und ssh liest `~/.ssh/config` und `known_hosts` über getpwuid (die Host-Key-Abfrage ist mit dem `git clone` aus Abschnitt 5 erledigt). Der Deploy-Key hat keine Passphrase (`-N ""`). cron setzt die Zusatzgruppen, die Gruppe `docker` gilt also. `git branch --show-current` braucht git ≥ 2.22 (Ubuntu 24.04: 2.43).
- **`git fetch origin main`** aktualisiert `refs/remotes/origin/main` über den Standard-Refspec; der Vergleich in Zeile 13 ist also aktuell.
- **`[ … ] && exit 0` unter `set -e`:** Ist der Test falsch, bricht das Script nicht ab (das gilt nicht für eine `&&`-Liste). Richtig.
- **Script ersetzt sich während des Laufs:** git löscht die alte Datei und legt sie beim Checkout neu an (neuer Inode). dash liest weiter aus dem offenen Deskriptor des alten Inodes, und das Script (825 Byte) liegt ohnehin ganz im ersten Lesepuffer. Der neue Stand gilt ab dem nächsten Lauf. Kein Problem.
- **Zusammenspiel mit reset-demo.sh:** Der Reset wartet blockierend (`flock 9`), update.sh gibt sofort auf (`flock -n`, exit 0). Docker-Container erben fd 9 nicht (sie startet dockerd, nicht die CLI), der Lock endet also mit dem Script. Der Reset-Trap `compose start backend` läuft noch unter dem Lock. Nach einem Update ohne Fehler nutzt der Reset die neuen Images.
- **Lauf ohne Änderung:** Nur `git fetch`, kein Docker-Aufruf, keine Ausgabe. Das Log wächst nicht.
- **README Abschnitt 5 und 7, Rest:** «migrations included» stimmt (`backend/Dockerfile:43`). Pfade, Cron-Zeile, Lock-Aussage und der Hinweis auf `.env.example` stimmen mit dem Script überein.
- **Umfang:** Alle drei Dateien gehören zur Anforderung, nichts ist umformatiert. Weder App-Code noch UI-Texte, Szenarien oder Verträge sind betroffen. Ein E2E-Szenario ist nicht nötig, weil sich kein Verhalten der App ändert.

## Nicht bestätigt

- `sh -n` beider Scripts und der Sandbox-Test des Aufrufers (Lauf ohne Änderung, neuer Commit, gehaltener Lock, nicht auf main): vom Aufrufer gemeldet. Selbst nachgestellt habe ich nur den Fall «Build schlägt fehl, dann nächster Lauf» (C-1).
- Verhalten auf der echten VM (Ubuntu 24.04 aarch64): Pfade der Docker-Installation, ob `/tmp` beim Booten geleert wird, `fs.protected_regular` (C-4). Das stammt aus den Ubuntu-Standards, auf der VM habe ich es nicht geprüft.
- Wie lange die App beim Neustart wirklich fehlt (C-2): aus den Healthcheck-Einstellungen in `docker-compose.prod.yml` abgeleitet, nicht gemessen. Die «3 to 5 minutes of building» auf A1 habe ich ebenfalls nicht geprüft.
- lint, Tests und deepcheck: Nicht relevant, weil der Diff weder App-Code noch Tests ändert. Ich habe sie nicht ausgeführt.
