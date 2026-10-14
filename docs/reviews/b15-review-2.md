# Slice-Review b15, Runde 2

Anforderung: Issue #152 (B-15), Variante (a): Mieter und Wohnung eines Mietvertrags stehen fest.
Geprüfter Bereich: Delta `8545bed..5f97d8b` (ein Commit, `fix(contracts): guide to the next step on edit`), dazu die Befunde aus `docs/reviews/b15-review-1.md` und ihre Triage in `implementation_plan.md`.

## Ergebnis

Kein Blocker, kein Major. Alle Befunde aus Runde 1 sind behoben oder mit tragfähigem Grund abgelehnt. Neu sind ein Minor und ein Nit.

## Befunde aus Runde 1

| ID | Schwere | Status laut Plan | Prüfung |
|---|---|---|---|
| m-1 | Minor | behoben | Bestätigt. `excludeContractId` ist aus `src/lib/utils/contract-availability.ts:74` entfernt, ebenso der zugehörige Test. Kein Aufrufer übergibt mehr ein zweites Argument. |
| m-2 | Minor | abgelehnt | Ablehnung trägt. Es sind die eigenen Daten des Verwalters auf seiner eigenen Seite. Die feldweise Kopie hatte fallow als Klon gemeldet. Rest: Der Typ `RentalContract` deckt die zusätzlichen Felder nicht ab. Das ist harmlos, ich melde es nicht erneut. |
| m-3 | Minor | behoben | Bestätigt. `tests/contracts/contract.json` ist neu, `api-contracts.pg.test.ts:122-125` prüft sie gegen `GET /contracts/:id` (lokal grün). `contract-edit-load.test.ts` liest die Antwort jetzt aus dem Vertrag. |
| m-4 | Minor | behoben | Bestätigt. `backend_contract_parties_fixed` nennt in allen vier Sprachen nur noch den neuen Mietvertrag und nicht mehr «Beenden». |
| n-1 | Nit | behoben | Bestätigt (`contract.service.ts:354-355`). |
| n-2 | Nit | abgelehnt | Ablehnung trägt. `contract-edit-load.test.ts:15` prüft «Wohnung 2.01 · Ahornhof» vollständig. |
| n-3 | Nit | behoben | Bestätigt. `contract-edit-load.test.ts:25-31` deckt den Rückfall auf die Adresse ab. |

## Neue Befunde zum Delta

### Blocker / Major

Keine.

### Minor

- m-5 `tests/e2e/steps/contract-form.steps.ts:242`: Das Szenario prüft nur `toContain('Bei einem Mieterwechsel')`. Diesen Text gab es schon vor dem Fix. Der sichtbare Fix der Persona-Majors H15-2/S-1 (Weg über «Beenden», Link zur Seite des Mietvertrags, Einleitung ohne Mieter und Wohnung) ist nur im DOM-Test belegt (`contract-edit.dom.test.ts:111-142`). Mit dem Hilfetext aus Runde 1 bliebe das Szenario grün, und der Plan notiert für die Fixes kein «Scenario red».

### Nit

- n-4 `src/routes/contracts/ContractForm.svelte:195`: Der neue Link «Zur Seite des Mietvertrags» verlässt das Formular ohne Rückfrage, genau wie «Abbrechen» (gleiches Ziel `back`). Das widerspricht etwas der Begründung, mit der S-6 abgelehnt wurde («Links führen weg von ungespeicherten Änderungen»).

## Weitere Prüfungen (ohne Befund)

- Texte: `contracts_parties_fixed_open/_ended/_mistake/_link` und die geänderten `contracts_edit_purpose` und `backend_contract_parties_fixed` stehen in allen vier `messages/*.json`. Der entfernte Schlüssel `contracts_parties_fixed_help` wird nirgends mehr benutzt. Die Bezeichnung der Aktion stimmt mit `contracts_end_action` überein (Beenden / Terminer / Terminare / End contract).
- Zustandslogik: Die Variante «ended» erscheint bei gespeichertem `endDate`. Die Detailseite bietet «Beenden» genau dann nicht an (`src/routes/contracts/[id]/+page.svelte:117`). Beide Varianten sind im DOM-Test geprüft.
- a11y/Sprachen: Die Variante «open» zeigt `contract-edit` (default), die Variante «ended» zeigt `contract-edit-notice` (Mietvertrag mit Kündigung), beide stehen in `tests/a11y/screens.json`. Damit gibt es keinen neuen Bildschirm.
- Design: Der Link nutzt nur Tokens (`text-accent`, `hover:text-accent-strong`) und `min-h-12`. Das gleiche Muster für Inline-Links gibt es schon an anderen Stellen. `design-guard.test.ts` ist grün.
- Die Persona- und Fachreview-Berichte sowie die Zeile U-15 in `offene-punkte.md` sind Workflow-Artefakte (Schritte 5 und 6) und gehören zur Anforderung.
- Gelaufen und grün: `contract-edit.dom.test.ts`, `contract-edit-load.test.ts`, `contract-availability.test.ts`, `backend-codes.test.ts` (49/49), `design-guard.test.ts` + `open-work.test.ts` (367/367), `api-contracts.pg.test.ts` + `contract-parties.pg.test.ts` (17/17), ESLint auf den geänderten Quelldateien ohne Warnung.

## Nicht bestätigt

- Diese Prüfungen habe ich nicht laufen lassen: `bun run test:coverage`, `bun run check`, das ganze `bun run lint`, das ganze Backend `bun run test`/`type-check`, `fallow audit`, `deepcheck:audit`.
- E2E (`contract-edit.feature`), `accessibility.feature` und `sprachen-bildschirme.feature` für `contract-edit` und `contract-edit-notice` mit den neuen Texten und dem Link habe ich nicht laufen lassen.
- Die fr/it/en-Formulierungen habe ich nur gelesen, nicht gegen `docs/design/i18n-begriffe.md` geprüft.
- Die Persona-Berichte `helga-b15.md`/`sven-b15.md` und `b15-fachreview-2.md` habe ich nur auf die Triage hin gelesen, nicht inhaltlich nachgeprüft.
