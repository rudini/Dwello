# Review #1373, Slice 1, Runde 1 (origin/main..925c3f1e)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Blocker | backend/src/services/backup.service.ts:59 | `confirmedCode` liest `mac_key`, das es vor 0046 nicht gibt; `backupBeforeMigration` läuft genau vor 0046 und scheitert an `column "mac_key" does not exist`: jede Installation mit `BACKUP_DIR` und bestätigtem Code kann 0046 nie anwenden, der Container startet nicht mehr |
| C-2 | Minor | backend/src/__tests__/backup-crypto.test.ts:48 | «lehnt eine veränderte Sicherung ab» kippt `bytes[length - 20]`, das liegt jetzt in der Signatur; die GCM-Prüfung der weiter angenommenen unsignierten Dateien (Format 1) und ihr Lesepfad in `decryptFile` haben keinen Test mehr |
| C-3 | Minor | backend/src/__tests__/backup.pg.test.ts:297 | Der Restore-Test mit dem Inhalt `'{}'` scheitert auch ohne Signaturprüfung vor `DROP SCHEMA` (Kopf nicht lesbar, `JSON.parse`); «lässt die Datenbank, wie sie ist» zeigt die Reihenfolge nicht, das täte nur ein gefälschter Inhalt mit gültigem Kopf und Dump |

## C-1 (Blocker): Migration 0046 bricht auf jeder bestehenden Installation mit Sicherung ab

`backend/scripts/migrate.ts` ruft `migrate(url, migrations, () => backupBeforeMigration(url))`; `migrate` ruft `before` vor der ersten offenen Migration, hier vor `0046_backup_mac_key.sql`. `backupBeforeMigration` ruft `withClient(url, confirmedCode)` (ausserhalb seines `try`), und `confirmedCode` prüft nur `to_regclass('backup_codes')`, dann `SELECT public_key, salt, mac_key, confirmed_at FROM backup_codes …`. Auf einer Datenbank bis 0045 gibt es die Spalte nicht: der Aufruf wirft, `migrate` bricht ab, `bun scripts/migrate.ts && exec bun run src/index.ts` (docker-compose.prod.yml:93, backend/Dockerfile:53) startet die App nicht. Ein Ausweg über die Wiederherstellung hilft auch nicht: `restoreBackup` liest `inForce` mit derselben Abfrage aus der aktuellen Datenbank.

Die Tests fangen das nicht: «Sicherung vor einer Migration» arbeitet auf Datenbanken mit allen Migrationen, und «beendet db:migrate …» lässt 0038, 0040 und 0046 weg (keine Tabelle `backup_codes`, also kein Code).

Zeigen: Datenbank nur bis 0045 migrieren (Kopie des Ordners ohne `0046_backup_mac_key.sql`), einen bestätigten Code einfügen, dann `migrate(url, migrations, () => backupBeforeMigration(url, dir, secrets))` mit dem vollen Ordner: wirft `column "mac_key" does not exist`, erwartet ist eine Sicherung im Ordner und 0046 angewendet. Behebung z. B. die Spalte nur lesen, wenn es sie gibt (`to_jsonb(b) ->> 'mac_key'` aus `backup_codes b`, oder `SELECT *`).

## Entwurfsentscheid `mac_key` im Klartext in `backup_codes`

Kein Blocker/Major. Fälschen braucht den Schlüssel; aus einer Sicherung ist er ohne Code nicht zu holen (die Datenbank liegt darin nur verschlüsselt), die Anforderung «cannot be taken from backups» hält. Wer die Datenbank lesen kann, könnte fälschen, braucht dazu aber zusätzlich Schreibzugriff auf den Sicherungsordner, und der offene Code liegt bis zur Bestätigung ohnehin in derselben Tabelle. Einziger Vorbehalt: das Projekt verschlüsselt Geheimnisse in der Datenbank sonst mit `ENCRYPTION_KEY` (`ki_settings.api_key_encrypted`, docs/data-model.md:532); das wäre ohne Compose-Änderung möglich und schützte gegen ein Leck nur auf SQL-Ebene. Das ist eine Abwägung, kein Mangel des Diffs.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run type-check` (backend) grün; `bun test` für backup.pg, backup-crypto, backup-api.pg, backup-due, backup-new-code.pg grün (52 Tests); Prettier sauber; Commit-Hooks (fallow, deepcheck, testcheck, fitness) grün; Rot gesehen bei Fälschungstest (Krypto), «signiert … sobald der Code bestätigt ist» und dem #953-Test ohne `mac_key` im Wieder-Einfügen.
- Rot nach Lesen plausibel: Krypto-Fälschungstest (vorher ignorierte `encryptStream` den `macKey`, Format 1 wurde angenommen), «signiert …» (vorher Format 1), #953-Zusatz (ohne `mac_key` im Wieder-Einfügen schreibt der neue Code unsigniert). Der Restore-Fälschungstest (backup.pg.test.ts:297) wäre vorher rot nur an der Meldung, siehe C-3.
- Die Annahme unsignierter Dateien (Format 1) lässt jede Fälschung im alten Format weiter durch; laut Auftrag folgt das im nächsten Slice und ist kein Befund. Der Punkt «refuses a file whose authenticator does not match» der Anforderung ist erst damit ganz erfüllt.
- Lauf gegen eine echte Datenbank auf Stand 0045 (C-1) nicht ausgeführt, nur aus `migrate.ts`, `db/migrate.ts` und `confirmedCode` gelesen.

Geprüft: Format (gleich lange Magie, HMAC über Kopf, Chiffrat und Tag, `timingSafeEqual`, Prüfung vor dem Entschlüsseln und damit vor `DROP SCHEMA`), Ableitung des Schlüssels per HKDF aus dem scrypt-Seed (Wiederherstellung auf neuer Maschine braucht nur den Code), kurze und abgeschnittene Dateien, Schreiben vor `rename` der `.part`-Datei, Bestätigung behält `mac_key`, #953-Wieder-Einfügen, data-model.md, keine UI-Texte, keine Verträge, kein Szenario nötig (Operator-CLI), ponytail-review ohne weiteren Befund, nichts Fremdes im Diff.
