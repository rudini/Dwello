# Review i782b, Runde 1 (Abschlussrunde), c4f76f31 gegen 486fc7e8

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tools/fitness/upgrade-check.sh:23-29 | Die Fixture setzt voraus, dass alle vier Tabellen im alten Tag existieren. `ki_settings` und `local_accounts` fehlen in v0.80.0 und v0.70.0 (`git show v0.80.0:backend/src/db/schema.ts`). Diese Tags nennt `docs/architecture/fitness-functions.md:26` als grün geprüft, und das Skript erlaubt sie als `[tag]`-Argument (Zeile 5). Mit diesen Tags bricht das Skript jetzt mit einem rohen psql-Fehler ab (`ON_ERROR_STOP` + `set -e`), ohne `::error`-Annotation. CI ist nicht betroffen, weil dort der Standard-Tag v0.92.0 läuft und alle vier Tabellen hat. |

Geprüft: Die Spalten und NOT-NULL-Bedingungen der vier Tabellen in v0.92.0 (`audit_log.action/details`, `invoice_documents` mit `invoice_id` als PK und FK und `content` als text, `ki_settings.mode` mit `id` Default 1, `local_accounts.email/password_hash`) passen zu den INSERTs. Die Leer-Warnung liest `before.txt` korrekt aus (awk auf Spalte 2, `paste` mit `pipefail` unkritisch). Der Doku-Text in `fitness-functions.md:67,70` stimmt mit dem Code überein. Der Diff enthält nichts, was nicht zur Anforderung gehört. Es gibt keine UI- oder App-Änderung, also braucht es weder Szenario noch a11y-Einträge noch messages.

## Nicht bestätigt

- `tools/fitness/upgrade-check.sh` v0.92.0 → HEAD grün (21 Tabellen, 12 Summen, keine Leer-Warnung): vom Aufrufer gemeldet. Nicht wiederholt, weil der Check eine Datenbank und einen Worktree anlegt.
- Rotlauf mit der Probe-Migration `DELETE FROM local_accounts;` («local_accounts 1 -> 0»): vom Aufrufer gemeldet. Nach dem Lesen plausibel: Vorher war die Tabelle leer, also 0 -> 0 und grün.
- Der Zweig der Leer-Warnung (Zeile 43) wurde nie ausgeführt: Mit der Fixture ist keine Tabelle leer. Nur durch Lesen geprüft.
- CHECK-Constraints von `ki_settings` (`id = 1`, `mode IN (...)`): vom Aufrufer gemeldet. Die Constraints liegen in den Migrationen; ich habe nur `schema.ts` von v0.92.0 gelesen.
