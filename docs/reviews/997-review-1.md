# Review #997, Slice 1 (f214344a8..3892dfc4a)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tools/fitness/compose-update-check.sh:57 | Das Update läuft mit der `compose.yaml` des PR statt mit der des Release. Vermieter laden für ein Update keine neue `compose.yaml`, sie machen `docker compose pull && docker compose up -d` (docs/installation.md:72, Kopf von compose.yaml). Der Weg, den die Vermieter wirklich gehen, ist damit nicht geprüft. |
| C-2 | Minor | tools/fitness/compose-update-check.sh:15, 44–48 | Der Release-Tag entsteht vor den Images (release.yml: Job `release` setzt den Tag, erst danach pusht der Job `images`). Zwischen den beiden Jobs, oder wenn der Job `images` scheitert, wird jeder PR und jeder Lauf auf `main` rot. Die Meldung «the release … does not start from its compose.yaml» verschweigt dann die eigentliche Ursache: das Image fehlt auf ghcr.io. |
| C-3 | Minor | tools/fitness/compose-update-check.sh:32, 37 | Code ohne Nutzer: `in_backend` reicht `"${@:2}"` an `docker compose exec` weiter, aber beide Aufrufe (Z. 50, 53) übergeben nur ein Argument. `WAIT_TIMEOUT` setzen weder CI noch die Doku. Ersatz: weglassen bzw. fest `300`. |

## C-1: Das Update nimmt die `compose.yaml` des PR, nicht die der Vermieter

Warum es falsch ist: Das Issue beschreibt den Weg der Vermieter als «`docker compose pull` und `docker compose up -d` von den Images des letzten Release auf die Images dieser Änderung». Done means verlangt «switch to the images of the pull request». docs/installation.md:72 nennt als Update `docker compose pull`, dann `docker compose up -d` und ändert allenfalls `DWELLO_VERSION`. Die `compose.yaml` bleibt also die, die beim Vermieter liegt. Das Skript kopiert aber in Z. 57 `"$repo/compose.yaml"` über die `compose.yaml` des Release. Der Kopf des Skripts (Z. 2) und der Text in utility-tree.md («so, wie der Vermieter es macht») sagen damit etwas Falsches.

Wie es scheitert: Ein PR ändert `compose.yaml` so, dass das neue Backend-Image davon abhängt, zum Beispiel ein neuer Schlüssel in `init-secrets` oder eine neue Variable bzw. ein neues Volume im `command` des Backends, ohne das das neue Image nicht startet. Der Check wird grün, denn beide Teile kommen aus dem PR. Bei jedem Vermieter mit der alten `compose.yaml` wird das Backend nach `docker compose up -d` aber nicht gesund. Genau diesen Fehler soll U1 finden: «Ein kaputtes Image, ein geändertes Volume … zeigt sich sonst erst bei den Vermietern» (#997, «Problem»).

Vorschlag: Den zweiten `up` mit der behaltenen `compose.yaml` des Release und `DWELLO_VERSION=$NEW` laufen lassen (`latest` findet die lokal gebauten Images). Wer auch die neue `compose.yaml` prüfen will, hängt einen weiteren Lauf an. Der ersetzt den Lauf mit der alten Datei aber nicht.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bash -n` auf beide Skripte; `bun run fitness` grün; `upgrade-check.sh` v0.107.0 → HEAD grün; `compose-update-check.sh ci v0.107.0` grün; `--broken ci v0.107.0` grün; rote Läufe (kaputtes Image ohne `--broken`, Migration ohne `backupBeforeMigration`). Diese Läufe nutzten lokal gebaute Images auf Ersatz-Basisimages. Dass die Images von ghcr.io in CI gezogen werden und laufen, ist nicht belegt.
- Der CI-Lauf selbst (nicht gepusht). Nicht geprüft ist auch, ob `docker compose up --wait` im `--broken`-Fall auf dem Runner früh abbricht, statt die 300 s Timeout abzuwarten, während das Backend mit `restart: unless-stopped` neu startet. Lokal laut Aufrufer 45 s.
- Ob `bun scripts/demo-data.ts` im Produktions-Image des Release (NODE_ENV=production) läuft. Gelesen: backend/Dockerfile (`COPY . .`). Die Ausführung ist nur durch die lokalen Läufe des Aufrufers belegt.

Geprüft: Job-Bedingung (`app`, auf `main` immer true) deckt Backend, compose.yaml und Dockerfiles ab; `fetch-depth: 0` für Tags und `HEAD^`; Auslagerung in data-totals.sh verhaltensgleich zu upgrade-check.sh (Filter `backend` um data-totals.sh ergänzt); Abfragen auf die Sicherung gegen `backup_runs` und `schema_migrations.applied_at` (backend/src/db/migrate.ts:38, backup.service.ts:264–305); Doku von U1 und Tabelle der Fitness Functions passt zum Skript, bis auf C-1.
