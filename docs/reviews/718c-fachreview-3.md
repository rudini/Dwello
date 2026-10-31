# Fachreview 718c, Runde 2 (Schritt 5): Texte «Neuer Wiederherstellungscode»

Gegenstand: `git diff 0e2933501 1924f765a -- messages backend/src/services src/routes/config` (Worktree review-718c-fach3, 1924f765a). Vorheriger Bericht: `docs/reviews/718c-fachreview-2.md`.

Geschlossen: V-1, V-2

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-3 | Verwalter | Minor | Lädt der Liegenschaftsverwalter das Notfallblatt erst nach Ablauf der 30 Minuten herunter, ohne die Seite neu zu laden, antwortet das Backend `BACKUP_NO_CODE` (409). `src/routes/backup/sheet/+server.ts:9` leitet dann still auf `/dashboard` um. Der Link hat `download`, deshalb kommt kein PDF und kein Hinweis. Die Meldung ist nicht mehr irreführend, sagt aber auch nicht, was geschah. Fix: Bei einem abgelaufenen Ersatzcode auch in `emergencySheet` `BACKUP_CODE_EXPIRED` werfen (gleiche Prüfung wie in `confirmBackupCode`). Die Route leitet dann auf `/config/backup` mit dieser Meldung um statt auf die Übersicht. |

## Nicht bestätigt
- Wie der Browser die Umleitung eines Links mit `download` auf eine HTML-Seite zeigt (leere oder fehlgeschlagene Datei, oder die Übersicht als Datei gespeichert): nicht ausprobiert, nur `src/routes/backup/sheet/+server.ts` gelesen.
- Aus Runde 1 noch offen: Ob die Sicherung direkt nach der Bestätigung fehlschlug, erfährt der Liegenschaftsverwalter nicht im Ablauf (`backup.service.ts`, Fehler nur im Protokoll). Ob `reauth=1` ein neues Cookie setzt (Art. 45c FMG): `generateOAuthUrl` und den Callback nicht gelesen.

Geprüft: Die übernommenen Texte `backup_new_keep_sheet` und `backend_backup_code_expired` stimmen in de/fr/it/en Wort für Wort mit der Tabelle aus Runde 2 überein, die Szenariozeile `sicherung.feature:136` ebenso. en «rental contracts» steht in `backup_keep_sheet` und `backup_new_keep_sheet`, «tenancy agreement» kommt in `en.json` nicht mehr vor. `BACKUP_CODE_EXPIRED` hält gegen `confirmBackupCode` (`backup.service.ts:342-347`): `pendingCode` blendet eine unbestätigte Zeile nur aus, wenn sie älter als 30 Minuten ist und ein bestätigter Code existiert. Die Prüfung `confirmed_at IS NULL` trifft deshalb nur einen verfallenen Ersatzcode, nie den ersten Code der Einrichtung, der unbefristet wartet. Die Zeile bleibt bis zum nächsten `replacePendingCode` bestehen, also verfällt auch eine wiederholte Eingabe richtig. Unbestätigte Zeilen haben immer einen `pending_code`. Die Antwort ist 422 (`routes/backup.ts:15`), `confirmBackup` zeigt sie über `backendMessage` als `backend_backup_code_expired`. Nach dem Neuladen steht darunter das Formular «Neuen Code erstellen», so passt «erstellen Sie einen neuen Code». Den Fall belegt `backup-new-code.pg.test.ts:142-152`.

## Triage

- V-3 (Minor): stays. The page itself says the code expires after 30 minutes, and a confirmation after that says so.
- Cookie of the new sign-in (open since round 1): `/auth/login?reauth=1` uses the same cookies as every sign-in (`dwello_login`, the OAuth state), so the privacy statement needs no new line.
