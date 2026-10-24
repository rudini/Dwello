# Code-Review C2, Runde 1: Mieter des Mietvertrags über `toTenant`

Bereich: `git diff ddce6ae6 6465d832` (ohne `docs/reviews`, `implementation_plan.md`, `docs/archive`), Commits b51c4b0d, 9e65d4a3, 6465d832. Worktree `review-c2-code-reviewer` (detached 6465d832).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | docs/architecture/adr/0002-mieter-des-mietvertrags-ueber-totenant.md:61 | «Drei Seiten an einem Mapper: Mieterliste, Mieterdetail und Vertragsdetail … Ändert er sich, ändern sich alle drei» stimmt nicht: `toTenant` erreicht über `loadTenant` auch die Mieter-Bearbeitung (`src/routes/tenants/[id]/edit/+page.server.ts:3,6`), also vier Seiten. |

Keine Blocker, keine Majors.

## Nicht bestätigt

- Lint, `bun run check`, `bunx vitest run` (3638), `bun run fitness` (Entity-Spiegel 55), E2E `contract-detail.feature` und `contract-edit.feature` (Chromium und API, 96), Commit-Hooks fallow, deepcheck, Commit-Betreff: vom Aufrufer gemeldet. Einen erneuten Lauf von `bunx vitest run src/__tests__/contract-actions.test.ts` hat die Sandbox blockiert (der Worktree verlinkt `node_modules` ins Hauptverzeichnis, und das ist gesperrt).
- Messwerte der ADR (`tenants.firstName`/`lastName` 16 → 15, `language` 22 → 21, Mieter-Spiegel 4 → 3): nicht nachgemessen (Skripte schreiben CSV-Dateien). Nur gegen `tools/fitness/ratchet.json` abgeglichen: Der Eintrag `contracts/[id]` unter `tenants` fehlt jetzt, übrig sind `tenant-form.ts`, `tenant.ts` und `types.ts`.
- Rote Läufe: Den roten ersten Versuch (6 Tests mit `TypeError … reading 'id'`) habe ich nur durch Lesen nachvollzogen. Ohne `tenant` im Stub ist `toTenant(undefined)` bei `data.id` ein TypeError. b51c4b0d nennt sich im Commit-Text Pinning von bestehendem Verhalten und ist kein Bugfix, braucht also keinen roten Lauf.

Geprüft:
- `toContract()` (`src/routes/contracts/[id]/+page.server.ts:131`). Alle Leser von `contract.tenant` sind `+page.svelte:35` (Name), `:157` und `ContractParties.svelte` (id, Vor-/Nachname, E-Mail und Telefon nur über `{#if}`). Kein anderer Load ruft `toContract` auf, die Actions lesen den Mieter nicht. `''` statt `null` für E-Mail und Telefon ist gleichwertig falsy.
- `firstName`, `lastName` und `language` sind NOT NULL (`backend/src/db/schema.ts:91-95`), der Rückfall auf `'de'` war also nicht erreichbar. `tenant_id` ist NOT NULL mit `restrict` (`schema.ts:121-123`). `getContract` holt den Mieter immer per Join mit sechs Feldern (`backend/src/services/contract.service.ts:186-193`).
- Die zusätzlichen Schlüssel aus `toTenant` sind `undefined`, `anonymisableFrom: null` oder `isFuture: false`. Es verlassen also keine neuen Daten den Server.
- `filled`, `none` und `Tenant` werden weiter gebraucht, es bleibt nichts Ungenutztes zurück.
- In der Testdatei ändern sich nur die Stubs, keine Assertion: `tenant` steht vor `...contract`, ein Test kann den Mieter also weiter überschreiben. Die Stubs nehmen den Mieter aus `tests/contracts/contract.json`.
- ADR 0001 (Hinweis «Erledigt»), `fitness-functions.md` (55, Historienzeile) und Ratchet passen zum Diff.
- Ponytail: kürzester Diff, keine Abstraktion dazu. Keine UI-Texte, keine Szenarien, keine Fremdänderungen.
