# Code-Review 718b, Runde 4 (Abschlussrunde, Delta)

Bereich: `git diff c0a7ba67a 217cab7a7` (docs/installation.md, docs/reviews/718b-review-3.md). Worktree: review-718b-code4, Commit 217cab7a7. Vorheriger Bericht: docs/reviews/718b-review-3.md.

Keine offenen und keine neuen Befunde.

Geschlossen: C-1, C-2

## Nicht bestätigt

- Vom Aufrufer gemeldet: Für das Delta waren keine Prüfungen nötig, weil es nur Doku ändert. Ich habe nichts ausgeführt, auch keinen `docker compose`-Lauf. Die Wiederherstellung auf einem neuen Rechner habe ich nur gegen `compose.yaml` auf 217cab7a7 gelesen.

Geprüft: Der Ablauf der Wiederherstellung (docs/installation.md:73–82) funktioniert mit einer Installation, die nur `compose.yaml` hat. `docker compose up -d` startet `secrets`, das `./backups` anlegt und die Schlüssel des neuen Rechners schreibt, und danach `postgres`. `restore` liegt im Profil `restore` und wird von `docker compose run --rm restore …` gestartet, obwohl das Profil nicht aktiv ist. Der Dienst hängt nur von `postgres` (healthy) ab, bindet `./backups:/backups:ro` und `dwello_secrets` und liest `db_password` des neuen Rechners. Das deckt den Satz «the database password stays the one of the new machine». `docker-compose.prod.yml` nennt nur noch der Abschnitt zum Klon (Zeilen 94/98). Zu C-2: Bei einem täglichen Lauf holt `--max-delete=5` die höchstens zwei Löschungen pro Tag ein, auch wenn einige Läufe ausfallen. Der Satz zu den 12 Monaten stimmt damit.
