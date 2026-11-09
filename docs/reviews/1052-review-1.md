# Code-Review #1052 Teil 1 (30cbf5be..e4160fad), Runde 1

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: alle 10 geänderten Dateien gelesen. `layers.json:44,48-49`: Die Regeln stehen vor den allgemeinen Regeln für `fe:routes/$1` und `fe:ui`. Dateien direkt in `statements/` und `config/` bleiben im Stammmodul, `+server.ts` geht weiter vorher an `bff:endpoint`. Die Stammdateien von `statements/` und `config/` importieren nichts aus ihren Unterordnern (nur Unterordner → `../`), also kein Modulzyklus. Innerhalb von `src/lib/ui` importiert keine Basiskomponente etwas aus `form` oder `navigation`, und `form` importiert nichts aus `navigation`. `navigation` → `fe:ui` (Icon, IconButton) und → `fe:lib/menu-keys` geht nur in eine Richtung. `plainAmount` ist unverändert verschoben, alle Importer sind umgestellt (kein Rest-Import aus `$lib/invoice`). `utils/format.ts` importiert nur paraglide, also kein Zyklus mit `invoice.ts`. Beide neuen classify-Tests (`lib.test.ts:16-36`) schlagen ohne die neuen Regeln fehl (bisher `fe:routes/statements` bzw. `fe:ui`). `ratchet.json` ändert nur durch `--update` gesenkte oder entfallene Einträge, plus die Umstellung der Schlüsselreihenfolge durch das Tool. Keine UI-Texte, keine Verträge, keine E2E-Dateien betroffen. Bei einer Verschiebung ohne Verhaltensänderung ist `No scenario` begründet.

## Nicht bestätigt

- Vom Aufrufer gemeldet: die zwei neuen classify-Tests rot vor den layers.json-Regeln (den config-Teil allein); `bun run fitness -- --base origin/main` 0 Fehler (vorher fe:routes/contracts 17 > 16); `bunx vitest run --changed origin/main` (106 Dateien, 2445 Tests); vitest für tools, open-work und design-guard (1052 Tests); lint; check; XS 12.2 % → 5.3 % (structure.ts analyze + fallow health).
- Ob die neuen Werte in `ratchet.json` (z. B. `statement-run.service.ts` ganz gestrichen, laut `wc -l` 411 Zeilen, `schema.ts` 663) dem Messwert des Tools entsprechen: nicht nachgemessen (kein Lauf erlaubt). Gesehen habe ich nur, dass jeder Eintrag sinkt oder wegfällt, also nur strenger wird.
- Die eingecheckten CSV-Dateien in `tools/arch-baseline/out/` (z. B. `imports-file.csv`) nennen noch die alten Module `fe:ui` und `fe:routes/config`. Sie sind nicht Teil des Diffs, und ich habe nicht geprüft, ob sie nach dem Repo-Brauch bei einer Änderung der Klassifizierung neu erzeugt werden.
