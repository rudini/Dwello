# Review 5 zu #1373 (Abschlussrunde, Fallback-Befunde 15ccc8f9..daf43623)

| ID | Schwere | Datei:Zeile | Befund |
| -- | ------- | ----------- | ------ |

Keine neuen Befunde, keine Blocker/Major.

Geschlossen: C-1 (Review 4; Test in backup-crypto.test.ts:129 aus 15ccc8f9, vor dem Bereich).

Geprüft: `confirmBackupCode` leitet `macKey` mit `recipientOf(pending_code, salt)` über dasselbe `keysOf` ab, das `decryptFile` nutzt. Ein falsch abgeleiteter Schlüssel fiele in backup-new-code.pg.test.ts:136 auf, weil die Sicherung nach der API-Bestätigung signiert ist und dort ohne Bestätigung entschlüsselt wird. Kein Pfad liest `mac_key` einer unbestätigten Zeile (backup.service.ts:60 nur `confirmed_at IS NOT NULL`, :224 nur der geltende Code). Der neue Test in backup-new-code.pg ist auf der Basis rot (Format 1, weil `mac_key` NULL bleibt). `restoreBackup` kopiert in den 0700-Ordner von `mkdtemp`, prüft und entschlüsselt nur die Kopie und löscht sie vor `pg_restore`; `finally` räumt bei einem Fehler auf. Das entspricht dem dritten Entscheid in #1373 samt Satz in docs/installation.md. Der Austauschtest ist ohne die Kopie rot, weil Header und GCM-Tag nicht zusammenpassen. Der signierte Pfad läuft über dieselbe Kopie. `typedConfirmation` verhält sich wie der alte Inline-Callback (Warnung, `trim`, exakter Vergleich, `null` lehnt ab), Test vorhanden. Nichts im Diff gehört nicht zur Anforderung. Kein UI-Text, keine API-Antwort, kein E2E-Code geändert.

## Nicht bestätigt

- Backend-Type-Check, `bun test` auf backup.pg (28), backup-crypto, backup-due, backup-new-code.pg, backup-api.pg und restore-confirmation, `bun run fitness -- --base origin/main --structure` (0 Fehler) und Prettier: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Die Rot-Läufe der drei neuen Tests: vom Aufrufer gemeldet; nur durch Lesen als plausibel bestätigt.
- Dass `prompt` unter Bun als Standardwert von `ask` typgerecht ist: nur aus dem gemeldeten Type-Check geschlossen.
