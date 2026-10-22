# Code-Review #387, Runde 2 (Delta 5d6888eb..9d5dc0f1)

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status |
|----|---------|--------|
| C-1 | Major | Geschlossen. `tests/e2e/features/statement-generate.feature:725–734` öffnet den Assistenten mit Evas ersetzter Abrechnung «Winter» und Marcs Abrechnung «Sommer» und erwartet den Vorschlag «Sommer». Auf dem Basis-Commit wäre die Periode verschieden eingestellt, und das Heizprofil käme aus den Einstellungen. Das Szenario ist dort also rot. Es nutzt nur bestehende Schritte (Frage `proposedHeatingProfile`, Seed `replaceStatement`) und ist nicht mit `@wip` markiert. Den Hinweistext prüft es nicht. Die Flags dafür (`differing: false`, `fromStatements: true`) deckt aber der Ladetest «übergeht eine ersetzte Abrechnung» ab. |
| C-2 | Minor | Bleibt offen (unverändert, wie vom Aufrufer gemeldet). |
| C-3 | Minor | Geschlossen. `+page.server.ts:78`: `.catch(() => [])` fängt den Fehler von `unbilledContracts` ab. Ohne fehlende Mietverträge bleibt `named` leer, und `load` fällt auf die Einstellungen zurück. Der neue Ladetest (`statement-generate-actions.test.ts:295–319`) lässt `statements?buildingId=…&limit=1000` mit 500 antworten. Genau diese URL lädt `contractsOf` (statement-generation.ts:108), sie enthält kein `periodStart`. Ohne `catch` würde `load` werfen. Der Test ist also ohne die Änderung rot. |
| C-4 | Minor | Bleibt offen (unverändert). |

## Neue Befunde im Delta

Keine.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: `bun run lint`, `bun run check`, `bunx vitest run statement-generate-actions.test.ts` (21) und E2E `statement-generate.feature` chromium + api (103). Den Vitest-Lauf im Worktree hat die Sandbox verweigert (Zugriff auf `node_modules`).
- Rot des neuen Szenarios auf der Basis nur durch Lesen geprüft. Ohne Standard-Heizprofil in den Einstellungen zeigt die Auswahl die erste Option der Liste (sortiert nach `type`, `name`, heating-profile.service.ts:70; kein leerer Eintrag in `SettingsStep.svelte:65`). Dass dies in der E2E-Datenbank nicht das Heizprofil «Sommer» dieses Szenarios ist, habe ich nicht nachgesehen. Wegen der Namen pro Lauf (`names.get`) ist es aber unwahrscheinlich.

Geprüft: Die Prettier-Umbrüche im Testfile betreffen nur Zeilen, die dieser Pull Request selbst hinzugefügt hat. Sie sind keine fremde Umformatierung.
