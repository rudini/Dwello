# Review #815 Teil A, Runde 2 (Delta be5b3176..39bf0186, zugleich Abschlussrunde vor dem Push)

`origin/main` hat keine Commits über 39bf0186 hinaus (`git log --oneline 39bf0186..origin/main` ist leer).

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status | Beleg |
|---|---|---|---|
| C-1 | Major | behoben | `{#if status === 'overdue' && owes && !waiting}` steht jetzt in `exceptions.frontendDecisions` (`tools/fitness/ratchet.json:755-759`). Der Grund nennt Betrag oder Frist und «#815 C»; das passt zum Schnitt im Issue (C = Abrechnungen, Abrechnungsdetail). |
| C-2 | Minor | behoben | Beide Zeilen aus Correction.svelte (:34, :41) stehen jetzt in den Ausnahmen (`ratchet.json:743-754`). In `display` bleiben für Correction/StatusActions nur reine Statusverzweigungen (`askPaid`, `sent \|\| overdue`, `paid`, `draft`). |
| C-3 | Minor | behoben | `isFrontendFile` (`tools/fitness/fitness.ts:254-259`) nimmt jede `.svelte`-Datei und jede `.ts`-Datei unter `src/`, ausser BFF-Dateien, `.d.ts`, `__tests__` und Paraglide. Neu erfasst werden heute `src/routes/config/help.ts` und `src/routes/statements/generate/preview.ts`; beide haben keinen Treffer (grep). Die neuen Tests (`fitness.test.ts:338-349`) schlagen mit der alten Bedingung bei `+page.ts`, `config/help.ts` und `hooks.client.ts` fehl. |
| C-4 | Minor | behoben | Der Beleg nennt jetzt 834a80d4. Dieser Stand hat den Frontend-Check schon (`frontendDecisions` kommt dort in `fitness.ts` vor). |

Die Zahlen habe ich in `ratchet.json` nachgezählt: 41 `display`, 0 `preChecks`, 41 Ausnahmen in 20 Dateien. Sie stimmen mit `fitness-functions.md` (§1, §6), `utility-tree.md` (Ä4 «Heute», Prioritätsbegründung) und `principles.md` (AP2) überein.

## Neue Befunde im Delta

Keine.

## Nicht bestätigt

- `bun run fitness` grün (82 Fundstellen, 41 Ausnahmen), lint und Prettier auf `ratchet.json`: vom Aufrufer gemeldet. `bun run fitness` habe ich nicht wiederholt, weil es Dateien schreibt. Dass die zwei neu erfassten Dateien keinen Treffer haben, habe ich nur per grep nach Status-, Datums- und Regex-Mustern geprüft, nicht mit `decides`.
- Das Rot der neuen `isFrontendFile`-Tests vor dem Export: vom Aufrufer gemeldet. Nach Lesen fallen sie ohne die Änderung rot aus (siehe C-3).

Geprüft: `bunx vitest run tools/fitness/fitness.test.ts` von mir wiederholt, 28/28 grün; Prettier auf `fitness.ts` und `fitness.test.ts` sauber; `git diff --check` ohne Befund; ponytail-review ohne Befund (der Export wird nur für den Test gebraucht, die Logik ist nicht doppelt); der Commit-Betreff entspricht den Regeln.
