# Code-Review #499, Runde 2 (Abschlussrunde, b39a53d5..3e8e8b19)

Worktree: `w1-review-499-code2` (detached, 3e8e8b19). Gelesen: der ganze Delta-Diff (6 Dateien), Commit-Nachrichten e9e87f0a und a3d082ad, `git show --remerge-diff 3e8e8b19 -- src`, `Field.svelte:1-100` im Merge-Stand, `DateInput.svelte` (testid-Stellen), `billed-until.pg.test.ts:230-280`, `contract.service.ts:405-432`, `statement.service.ts` (Nummernvergabe), Vorbericht `w1-499-review-1.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|

Keine neuen Befunde (C-5 ff. nicht vergeben). Keine Blocker, keine Major.

## Status der offenen IDs aus Runde 1

- **C-1 (Minor): erledigt.** `api-contracts.pg.test.ts:519-540` legt einen Mietvertrag ab 01.07.2023 an, versendet die Abrechnung 2024 und prüft die Antwort 400 mit `drift` gegen `contract-billed-until-billed.json`. Der Kommentar beim Test für die Variante ohne Datum ist angepasst.
- **C-2 (Minor): erledigt.** `Field` nimmt `testid` (am äusseren `div`), `DateInput` reicht `{testid}-field` weiter, und der Target `billedUntilError` sucht `billed-until-input-field` → `form-error` ohne CSS-Selektor. In `src` und `tests` gibt es keine andere Test-ID auf `-field`, also keine Kollision. Innerhalb von `DateInput` kommt `form-error` nur einmal vor (`Field.svelte:98`).
- **C-3 (Minor): erledigt.** Die Nachricht von e9e87f0a sagt jetzt, dass das Szenario aus 80df615e und der C-1-Test beibehaltenes Verhalten festhalten. Ein früherer Commit kann seine Nachricht nicht mehr ändern, die Angabe im Folgecommit reicht. Der C-1-Test fängt einen bestehenden Vertrag ab, ist also keine Fehlerbehebung.
- **C-4 (Minor): erledigt.** Der pg-Test versendet die berichtigte Abrechnung und erwartet deren Nummer. Rot ohne die Bedingung `or(isNull(successor.id), eq(successor.status, 'draft'))` (beim Lesen geprüft): Dann zählen beide Abrechnungen mit demselben `rentalStart`, und die neue zweite Sortierung nach `statementNumber` nennt die laufend vergebene, kleinere Nummer der ersetzten Abrechnung. So scheitert der Test immer und nicht nur zufällig. Die zweite Sortierung ändert das Verhalten nur bei Gleichstand, der sonst unbestimmt wäre.

## Merge (3e8e8b19)

Den einzigen Konflikt in `src` (`Field.svelte`, die Props `testid` aus #499 und `invalidBy` aus #450) löst der Merge so, dass beide bleiben: in der Destrukturierung, im Typ und im Gebrauch (`data-testid={testid}` am Rahmen, `flagged` in `aria-describedby`). Nichts geht verloren, und es wird nichts Fremdes hinzugefügt.

## Ponytail-Review

Das Delta enthält nur das, was die Befunde verlangen: eine optionale Prop, einen weitergereichten Wert, einen Test je Befund und eine zusätzliche Sortierspalte. Es gibt keinen unbenutzten Code und keine Kopie eines Helfers. Lean already. Ship.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend-`type-check` und `bunx vitest run` (3348): vom Aufrufer gemeldet. `contract.routes.pg.test.ts`: vom Aufrufer gemeldet.
- `billed-until.pg.test.ts` und `api-contracts.pg.test.ts` habe ich selbst laufen lassen (`TEST_DATABASE_URL=…/dwello_test_r499d`): 69 pass, 0 fail.
- E2E (`contract-edit.feature`, die Zeilen von `billed-until-statement` in `accessibility.feature` und `sprachen-bildschirme.feature`): wie verlangt nicht gestartet. Der Aufrufer meldet, dass sie gerade laufen. Ob der neue Target `billed-until-input-field` im Browser trifft, ist damit offen.
- Ob die Fehler aus Runde 1 rot waren, habe ich nur beim Lesen beurteilt, nicht mit Läufen auf Zwischencommits.
- Was der Merge ausserhalb von `src` geändert hat, gehört nicht zum Auftrag und ist nicht geprüft.
