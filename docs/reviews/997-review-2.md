# Review #997, Runde 2 (3892dfc4a..e6a0a580b, dazu a0e035168)

Geschlossen: C-1, C-2, C-3

Keine neuen Befunde.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bash -n`; `compose-update-check.sh ci v0.107.0` grün; `--broken ci v0.107.0` grün (Ursache «Migration 9999_compose_update_check_broken.sql fehlgeschlagen: division by zero», Sicherung vorhanden, 43 s); `ci-broken` rot; `ci-nobackup` rot («applied 1 migrations without a Sicherung»); `ci v0.106.1` rot mit der Meldung aus C-2. Die Images wurden lokal auf Ersatz-Basisimages gebaut, nicht von ghcr.io gezogen.
- Der CI-Lauf selbst, insbesondere `docker compose pull` der Release-Images von ghcr.io auf dem Runner (tools/fitness/compose-update-check.sh:47). Die Meldung in Z. 48 nennt als Ursache immer das fehlende Image. Fällt der Pull aus einem anderen Grund aus (Netz, Rate-Limit), zeigt das stderr von `docker compose pull` die wirkliche Ursache direkt darüber.

Geprüft: C-1: Der zweite `up` (Z. 64) läuft mit der behaltenen `compose.yaml` des Release (Z. 44; die Kopie aus dem Repo ist entfernt). Das Image `${DWELLO_VERSION:-latest}` steht in v0.107.0:compose.yaml Z. 36/83/138, damit greift `DWELLO_VERSION=latest` auf die in ci.yml gebauten `:latest`-Images. Die `compose.yaml` des PR startet weiterhin frisch im Schritt «Start compose.yaml». C-2: eigene Prüfung mit eigener Meldung vor dem ersten `up` (Z. 45–50). C-3: `"${@:2}"` und `WAIT_TIMEOUT` sind entfernt, nirgends mehr verwendet. Kommentare in Skript-Kopf und ci.yml, utility-tree.md, fitness-functions.md, Plan und Workflow-Notiz stimmen mit dem Code überein.
