# Review #1373, Runde 2 (925c3f1e..e960c9c1)

Geschlossen: C-1, C-2

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Minor | backend/src/__tests__/backup.pg.test.ts:297 | Teilweise offen: ohne Signaturprüfung wird der Test jetzt rot (Restore geht durch), aber der gefälschte Inhalt ist der Dump der aktuellen Datenbank. «lässt die Datenbank, wie sie ist» (`Lindenhof`) hält darum auch, wenn die Prüfung erst nach `DROP SCHEMA` und Einspielen käme; die Reihenfolge zeigte erst eine Änderung nach der Sicherung (wie `UPDATE … 'Neuer Stand'` im Test der unsignierten Sicherung, Zeile 317) |
| C-4 | Minor | backend/src/__tests__/backup-crypto.test.ts:106 | «lehnt eine veränderte nicht signierte Sicherung auch nach der Bestätigung ab» pinnt Verhalten der Basis (GCM-Tag), die Commit-Nachricht von e960c9c1 sagt das nicht (nur «C-2 tests a changed unsigned file»); nach CLAUDE.md, Workflow 2, gehört es in den Pull-Request-Text oder die nächste Commit-Nachricht |
| C-5 | Minor | backend/scripts/restore.ts:31 | Die Bestätigung selbst (Warnung ausgeben, nur genau `WIEDERHERSTELLEN` nach `trim()` nimmt an, `null` bei fehlender Eingabe lehnt ab) hat keinen Test; die Tests übergeben `() => true`/`() => false` direkt an `restoreBackup`/`decryptFile`. Ein vertauschter Vergleich oder ein fehlendes `console.log(warning)` bliebe grün |

## Nicht bestätigt

- Vom Aufrufer gemeldet: backend `bun run type-check` grün; `bun test` für backup.pg, backup-crypto, backup-new-code.pg, backup-api.pg, backup-due grün (57 Tests); Prettier nur auf eigenen Zeilen; Commit-Hooks grün; Rot gesehen bei C-1 (`column "mac_key" does not exist`), den unsignierten Tests (Krypto, pg) und dem Restore-Fälschungstest ohne Signaturprüfung.
- Rot nach Lesen plausibel: C-1-Test (alte Abfrage nennt `mac_key` direkt), «… nur nach der Warnung und der Bestätigung» und «… ohne Bestätigung ab und schreibt nichts» (vorher wurde Format 1 ohne Rückfrage entschlüsselt und geschrieben), pg-Test der unsignierten Sicherung (vorher kein Abbruch, `Neuer Stand` wäre überschrieben).
- `tools/fitness/restore-check.ts` ruft `restoreBackup` ohne Bestätigung mit einer unsignierten Sicherung des Vorgänger-Release auf und scheitert damit künftig; laut Aufrufer bekannt, Gate-Datei, wartet auf Freigabe. Nicht gelesen, ob CI dieses Pull Requests deswegen rot wird.
- Verhalten von `prompt()` unter `docker compose run --rm restore` (TTY) nur aus docs/installation.md:78 geschlossen, nicht ausgeführt.
- Dass das entfernte `pendingCode: null` in backup-new-code.pg.test.ts:146 anderswo abgedeckt ist, nicht geprüft; der Test kam erst mit 925c3f1e dazu, ist also keine Spezifikation auf `main`.

Geprüft: C-1-Behebung (`to_jsonb(b) ->> 'mac_key'`, Test ohne 0046, 0046 ist die letzte Migration), Reihenfolge in `decryptFile` (Code, Signatur, Bestätigung, erst dann Entschlüsseln; Standard lehnt ab), Warnungstext wortgleich zur Entscheidung, Weitergabe durch `restoreBackup`, docs/installation.md gegen Option A, Umformatierungen nur auf Zeilen aus 925c3f1e, keine UI-Texte, Verträge oder Szenarien betroffen (Operator-CLI), ponytail-review ohne Befund.
