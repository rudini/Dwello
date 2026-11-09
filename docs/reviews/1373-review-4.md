# Review 4 zu #1373 (Abschlussrunde, CI-Fix 50511226..6dd96bfb)

| ID  | Schwere | Datei:Zeile | Befund |
| --- | ------- | ----------- | ------ |
| C-1 | Minor | backend/src/services/backup-crypto.ts:133-135 | Der neu geschriebene Wächter «Die Datei ist keine Sicherung von Dwello.» (falsche Magic, leere Datei, kürzer als der Header, gekürzte signierte Datei) hat in `backend/src/__tests__` keinen Test; die Umstellung auf `indexOf` und `end = size - format * SIGNATURE` ist nur durch Lesen als gleichwertig belegt, kein Test würde einen Fehler darin rot zeigen. |

Keine Blocker/Major.

Geprüft: die Randfälle bleiben beim Lesen gleich. Bei einer leeren Datei und bei einer, die kürzer ist als der Header, bleibt der nicht gelesene Teil von `head` null, also `format = -1`, Abbruch. Gültige Magic bei weniger als 124 bzw. 156 Bytes: `end < HEADER + TAG`, gleiche Meldung. Falsche Magic: `-1` bricht ab, bevor `end` zählt. Der UTF-8-Vergleich der Magics ist exakt, weil sie ASCII sind und ungültige Bytes nie zu ASCII werden. Bei einer Datei unter 48 Bytes ist `position = 0` und der Wächter greift immer. Steht der Wächter, ist `size >= 124`, `tail` ist also voll gelesen. Der Tag-Ausschnitt liegt unsigniert bei `tail[32..48]` und signiert bei `tail[0..16]`, beides stimmt; die Signatur liegt bei `tail[16..48]`. `[REFUSED, FORGED][format]` passt zur alten Zuordnung. `confirmUnsigned` wird nur bei unsignierten Dateien aufgerufen, das HMAC nur bei signierten, beides vor der Entschlüsselung. `pipeline(..., hmac)` wartet auf `finish` (nach `_flush`), und `read()` liefert die ganzen 32 Bytes des Digests. Der Roundtrip und die Fälschungstests (backup-crypto.test.ts:28, 48, 75, 87, 96, 107) decken Tag, Signatur und Meldungen ab. Nichts im Diff gehört nicht zur Anforderung.

## Nicht bestätigt

- Backend-Type-Check, `bun test` auf backup.pg, backup-crypto, backup-new-code.pg, backup-api.pg und backup-due (57 Tests), `bun run fitness -- --structure --base origin/main` (0 Fehler, fallow 95.8) und Prettier auf der Datei: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Dass `hmac.read()` nach `pipeline` unter Bun den Digest liefert und nicht `null`: nur aus den gemeldeten grünen Roundtrip-Tests geschlossen (encryptStream hängt die Signatur so an, decryptFile prüft sie).
