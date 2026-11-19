# Fachreview #1457 «Sicherung vor jedem Update», Runde 2 (Commit 74c4e24, Delta cbb3173..74c4e24)

Geschlossen: V-1, V-2, V-3, V-4, V-5, V-6, V-8

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-7 | Verwalter | Minor | Unverändert offen, liegt beim Product Owner (#1457 entscheidet die Zeilen «Update» und «Sicherung» in `UBIQUITOUS_LANGUAGE.md` nicht). Wortlaut wie in Runde 1 |
| V-9 | Verwalter | Minor | Der Schritt «hat Dwello eine Sicherung erstellt, bevor das Update etwas heruntergeladen hat» vergleicht den **Beginn** der letzten erfolgreichen Sicherung (`since` = `max(started_at)`, `backend/src/services/backup.service.ts:236, 247`) mit dem Auftrag an den Stand-in, nicht ihr Ende. Eine Sicherung, die parallel zum Auftrag läuft, wäre hier grün. Das hält den Merge nicht auf: `backend/src/__tests__/update.pg.test.ts` («erstellt eine Sicherung, bevor es den Update-Dienst beauftragt») zählt beim Auftrag die abgeschlossenen Läufe (`finished_at`, ohne `error`). Szenario 2 legt zudem fest, dass das Update auf das Ergebnis der Sicherung wartet. Behebung, falls gewünscht: Im Kommentar des Schritts (`tests/e2e/steps/aktualisierung.steps.ts:127`) «begonnen» statt «erstellt» sagen und auf den pg-Test verweisen |

## Nicht bestätigt

- Wie lange `createBackup` auf einer echten Installation dauert, habe ich nicht gemessen. Das Limit von 60 Minuten (`src/lib/server/api-proxy.ts:192`) stimmt mit der Stunde aus `update_overlay_slow` überein. Ob eine grosse Installation darunter bleibt, ist nicht belegt. Tests habe ich auftragsgemäss nicht ausgeführt.

Geprüft: V-1 (POST `/update` bekommt 60 min, GET und `/update/later` bleiben bei 30 s; das Fenster öffnet sofort mit «Sichern» und fragt erst nach 202 ab; Schritte durchgerechnet: POST offen → 1 von 3, `pulling` → 2, `backend`/`frontend` → 3, `done` → neu laden; ein altes `done`/`failed` wird vor 202 nicht mehr gelesen), V-2 (Titel und Schritt wie vorgeschlagen; «erschienen» schliesst die Sicherung der Einrichtung aus; Szenario 2 zitiert zwei Teilsätze von `backend_update_backup_failed` wörtlich), V-3 (`/status` vor `createBackup`), V-4 (nur `UPDATE_BACKUP_FAILED` im Fenster, ohne `update_failed_log`), `backend_update_backup_failed` und `update_confirm_text` in de/fr/it/en wörtlich gleich wie die Tabelle der Runde 1 (fr mit U+00A0 vor «;»), `docs/installation.md:89, 94` wörtlich wie vorgeschlagen, `screens.json` «Neu starten», Datenschutzerklärung und Mietrecht nicht berührt.
