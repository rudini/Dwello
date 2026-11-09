# Review 1373, Runde 3 (Abschlussrunde), Delta e960c9c1..a5884d10

Geschlossen: C-3, C-4

| ID | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| C-5 | Minor | backend/scripts/restore.ts:31 | Weiter offen (unverändert seit Runde 2): Die Bestätigung selbst (Warnung ausgeben, nur `WIEDERHERSTELLEN` nach `trim()` nimmt an, `null` lehnt ab) hat keinen Test |

Keine neuen Befunde. Kein Blocker/Major.

Geprüft: 6e0fc2b1 (der `UPDATE … 'Neuer Stand'` nach der Sicherung macht den Test rot, falls die Signaturprüfung fehlt oder erst nach `DROP SCHEMA` käme; die Commit-Nachricht nennt den Test aus e960c9c1 als Pin von bestehendem Verhalten, damit ist C-4 erledigt); a5884d10 (`() => true` als sechstes Argument passt zur Signatur von `restoreBackup` in backup.service.ts:175, wird nur bei einer unsignierten Sicherung aufgerufen (backup-crypto.ts:156), entspricht wörtlich der Gate-Freigabe in #1373; die Commit-Nachricht nennt «Gate change approved: #1373»).

## Nicht bestätigt

- Gemeldet vom Aufrufer: `bun tools/fitness/restore-check.ts` backup/restore auf dwello_e2e auf a5884d10 grün, backup.pg-Test grün, auf e960c9c1 type-check, lint, svelte-check, `bun run fitness -- --base origin/main` und `--structure`, betroffene vitest-Dateien grün.
- Ob der PR-Text «Gate change approved: #1373» trägt: der PR existiert noch nicht; CI prüft das.
- Ob der Test aus 6e0fc2b1 ohne Signaturprüfung rot wird: nur durch Lesen beurteilt (stimmt), den Lauf meldet der Aufrufer.
