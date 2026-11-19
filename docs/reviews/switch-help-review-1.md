# Code-Review «switch-help», Runde 1 (Schlussrunde vor dem Push), c871275..d47a8fa

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`; `bun run check`; `bun run fitness -- --base origin/main --structure`; `cd backend && bun run type-check`; `bunx vitest run --changed origin/main` (629 passed); `bunx vitest run src/__tests__/open-work.test.ts src/__tests__/i18n.test.ts src/__tests__/contract-rent-labels.test.ts` (89 passed); `cd backend && bun test src/__tests__/backup.pg.test.ts` (28 pass); Prettier auf den neuen Dateien; E2E chromium (neues Szenario, «Die Suche nach neuen Versionen speichert beim Umschalten», axe- und Sprachzeilen `config backup-links` und `config update-check-saved`, 8 passed); Rot-Läufe von Unit-Test und `@wip`-Szenario vor den Texten.
- Rot ohne Änderung nur durch Lesen beurteilt: `src/__tests__/update-check-help.test.ts:17` (`endsWith` des Satzes) und der Schritt `settings.steps.ts:106` mit neuem Feld `updateCheck` (`toContain` des Satzes auf der Beschreibung von `setting-updateCheck`, `src/routes/config/+page.svelte:118,120`) schlagen auf dem Basisstand fehl, weil der Satz dort fehlt.
- Ausserhalb des Auftrags (nur das Glossar ist verlangt): `messages/de.json:2480` (`backup_location`) sagt weiter «die letzten 7 täglichen»; schon im Fach-Review unter «Nicht bestätigt» genannt.

Geprüft: alle 10 Dateien des Diffs; deutscher Satz und Glossarsatz wörtlich wie entschieden, übriger Hilfetext in allen vier Sprachen unverändert, `privacy.feature` unberührt; neues Szenario ohne `@wip`, nur lesend auf der frischen Installation (keine Isolationsfrage), Schritt ruft nur Task `openFreshSettings` und Question `settingHelp` (Screenplay-Schichten eingehalten, Question liefert den Text); keine neue Bildschirmzeile nötig; Ponytail: nichts Ungenutztes, kein kopierter Helfer.
