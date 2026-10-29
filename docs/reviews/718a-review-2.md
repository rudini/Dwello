# Code-Review #718 Teil 1, Runde 2 (Delta a76ac8b18..dd92455b5)

Keine offenen und keine neuen Befunde.

Geschlossen: C-1, C-2, C-3, C-4, C-5, C-6, C-7, C-8

Status je ID aus Runde 1:

- C-1 (Major), geschlossen: `/health` antwortet immer mit 200 und `status: "ok"`. Den Zustand meldet es im Body (`backup: "stale"`, `since`), und der Test prüft 200 zusammen mit `stale`. Der Healthcheck in Compose (`r.ok`) und `depends_on: service_healthy` des Frontends hängen damit nicht mehr an der Sicherung. api-specification, utility-tree O1, fitness-functions und data-model sind nachgezogen, und nirgends steht mehr 503 oder `backup_stale`.
- C-2 (Major), geschlossen: `resolve(backend, …)` (restore-check.ts:70, 73) nimmt einen absoluten Pfad unverändert. Beide Zweige in upgrade-check.sh übergeben jetzt einen absoluten Pfad: Zeile 48 `"$OLD/backend"`, Zeile 66 `"$PWD/backend"`. Damit läuft heute derselbe Codepfad, den der Zweig der Vorversion nehmen wird.
- C-3 (Major), geschlossen: `docs/installation.md` ist gleich wie auf dem Basis-Commit 5834a929f (leerer Diff). Die manuelle Anleitung für Sicherung und Wiederherstellung ist zurück. utility-tree R1 verweist bis Teil 2 auf §5 («5. Start», dort steht die Anleitung).
- C-4 (Minor), geschlossen: Der Test macht eine Sicherung einer Datenbank, die ohne 0037 migriert ist, und prüft nach der Wiederherstellung, dass 0037 verbucht ist und das Gebäude, das nach der Sicherung dazukam, fehlt. Ohne `migrate` in `restoreBackup` fehlt 0037, der Test wird also rot.
- C-5 (Minor), geschlossen: Ein falsches `pg_dump` im PATH mit Exit-Code 1. Der Test prüft die Ausnahme, einen leeren Ordner (auch die `.part`-Datei ist weg) und `backup_runs.error`. PATH wird im `finally` zurückgesetzt.
- C-6 (Minor), geschlossen: `pipeline(...).catch(() => {})` (backup.service.ts:170) fängt den EPIPE ab. Die Ursache meldet der Exit-Code von `pg_restore` mit `stderr`, und das `finally` mit `rm(work)` läuft. Wenn der Lesestrom scheitert, schliesst `pipeline` stdin, und `pg_restore` scheitert mit seinem Exit-Code. Es gibt keinen Test, wie in Runde 1 nur aus dem Code gelesen.
- C-7 (Minor), geschlossen: Die Schlüssel werden vor `migrate` geschrieben (backup.service.ts:177-185). Der Test mit `9999_broken.sql` prüft, dass die Wiederherstellung abgelehnt wird, dass `encryption_key` geschrieben ist und dass die Daten wiederhergestellt sind. Ohne die neue Reihenfolge fehlt die Datei, der Test wird rot. Der zweite Teil von C-7 (eine leere Datenbank nach einem Abbruch von `pg_restore`, nicht dokumentiert) fällt weg, weil die Anleitung für `run --rm restore` erst mit Teil 2 kommt.
- C-8 (Minor), geschlossen: Nach einer gelungenen Sicherung werden alle `*.backup.part` gelöscht (backup.service.ts:122-123), und der Test prüft das. Zwei Läufe gleichzeitig, die sich gegenseitig die `.part` löschen könnten, gibt es nicht: `startBackups` sperrt mit `running`, und `backupBeforeMigration` läuft in `scripts/migrate.ts` vor dem Server.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bun test src/__tests__/backup* auth.pg api-docs.pg` (88), `tools/fitness/upgrade-check.sh` (Restore-Prüfung grün mit dem absoluten Pfad), die roten Läufe zu C-1, C-4, C-5, C-7 und C-8.
- Aus dem Code gelesen, nicht ausgeführt: Ob `child_process.spawn` unter Bun ein zur Laufzeit geändertes `process.env.PATH` übernimmt (C-5-Test). Der Aufrufer meldet den Test als rot ohne die Prüfung des Exit-Codes, also wird das falsche `pg_dump` aufgerufen. Ob `migrate` 0037 auch dann anwendet, wenn 0038 schon verbucht ist (C-4-Test), habe ich ebenfalls nicht ausgeführt; der Aufrufer meldet den Test als grün.
- Weiterhin offen aus Runde 1: der Docker-Build mit `postgresql-client-16`, `prompt()` in `docker compose run --rm restore` sowie `chown` auf Docker Desktop und rootless Docker.

Geprüft: alle 10 Dateien des Deltas, ponytail-review ohne Befund, nichts Fremdes im Delta, keine UI-Texte betroffen.
