# Code-Review #144 (P-17), Runde 2 (Abschlussrunde vor dem Push)

Worktree `review-p17-code2`, detached bei d0b9370. Geprüft: `git diff b388738 d0b9370 -- src messages tests` ohne die Teile aus `main`, also die eigenen Commits cf4a669 und 2f21d23, der Docs-Commit 3b6c845 und das Merge-Ergebnis von d0b9370 in den Dateien, die beide Seiten geändert haben. Gelesen: alle geänderten Dateien der eigenen Commits, dazu `RentStep.svelte` ganz, `rentTakenOver`/`kept`/`rentToPreset` in `src/lib/contract-wizard.ts`, `tests/contracts/contracts.json`, `docs/design/personas/helga-p17.md`, `docs/reviews/workflow-notes-issue-144.md`, `implementation_plan.md`, sowie in den Merge-Dateien `tests/e2e/fixtures/screens.ts`, `tests/e2e/tasks/accessibility.ts`, `tests/a11y/screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`.

Ergebnis: kein Blocker, kein Major.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-9 | Minor | tests/e2e/fixtures/screens.ts:82 | Der neue Satz `contracts_rent_taken_over_additional` wird im Zustand `rent-taken-over` nie angezeigt: Doras Mietvertrag (Wohnung 2.01) hat keine Zusatzmiete. Damit sehen axe und die Sprachprüfung (fr/it/en ohne Deutsch) den neuen Absatz nicht. Abgedeckt ist er nur durch den deutschen DOM-Test. Abhilfe: Dora in der Fixture eine Zusatzmiete geben, z. B. `additionalRent: '80.00'` (das zeigt den Hinweis vollständig). Vorher prüfen, ob andere Zustände auf `noticedContract` dadurch andere Beträge zeigen. |
| C-10 | Nit | src/routes/contracts/new/RentStep.svelte:33 | Die Bedingung liest das Feld (`values.additionalRent`), nicht den übernommenen Betrag. War die Zusatzmiete leer und tippt der Verwalter «0» oder «0.00», bleibt `rentTakenOver` wahr, weil als Zahl verglichen wird (0 = 0). Dann erscheint der Satz «leeren Sie die Zusatzmiete» zu einem Betrag von null. Gleiche Ursache wie C-4/C-5 aus Runde 1. |

ponytail-review (Delta): Die Änderung ist eine einzige Zeile `{#if}` mit einem neuen Schlüssel. Nichts zu streichen. Lean already. Ship. (C-6 aus Runde 1 bleibt bestehen.)

## Geprüft und bestätigt

- **P-1 (Satz zum Parkplatz nur mit Zusatzmiete):** Solange der Hinweis sichtbar ist, entsprechen die Felder den übernommenen Beträgen (`rentTakenOver`). `values.additionalRent` ist also genau dann gesetzt, wenn der letzte Mietvertrag eine Zusatzmiete über 0 hatte (`kept` macht aus 0.00 einen leeren Wert). Das entspricht dem Vorschlag der Persona. Ausnahme: C-10. Leert der Verwalter die Zusatzmiete wie empfohlen, verschwindet der ganze Hinweis. Das ist folgerichtig.
- **Roter Test:** Im bestehenden DOM-Test steht jetzt zusätzlich `not.toContain('Parkplatz')`. Die Testdaten aus `contracts.json` haben `additionalRent: "0.00"`. Vor 2f21d23 stand der Parkplatz-Satz fest in `contracts_rent_taken_over_text`, die Prüfung wäre also rot gewesen. Der neue Test «nennt den Parkplatz nur, wenn …» wäre auch vor der Änderung grün gewesen. Er sichert aber ab, dass der Satz mit Zusatzmiete nicht verloren geht. Das genügt der Triage-Regel für Persona-Befunde (Test auf tieferer Ebene, rot vor dem Fix).
- **P-2 (neue Formulierung):** Der Sinn ist in allen vier Sprachen gleich. Der Satz zum Parkplatz ist aus `contracts_rent_taken_over_text` entfernt und steht als eigener Schlüssel in de/fr/it/en. Die JSON-Dateien sind gültig und haben keine doppelten Schlüssel. «Zusatzmiete» stammt aus `UBIQUITOUS_LANGUAGE.md` (Beispiel Parkplatz). Kein E2E-Schritt prüft den alten Text: `contract-form.steps.ts:375` prüft nur «aus dem letzten Mietvertrag dieser Wohnung». Das bleibt gleich.
- **Kein Szenario für P-1:** Laut `slice-review`, «Triage», reicht für einen behobenen Persona-Befund ein Test auf tieferer Ebene. Kein Major.
- **cf4a669:** Nur die Reihenfolge der Imports in `tests/e2e/questions/contract-form.ts` (C-7 erledigt). C-8 ist durch die Archivierung des Plans hinfällig: `implementation_plan.md` hat keine Session mehr.
- **Merge d0b9370:** In `screens.ts` sind `noticedApartment: seed.idOf('2.01')` und Doras Mietvertrag samt Kündigung auf 2099-03-31 unverändert. Neu aus `main` sind die Seeds für Bruno 2024 (Heizkostenrechnung, Mahnung) im Gebäude Seeblick sowie die IDs `remindedStatement` und `remindedLetter`. Sie berühren 2.01/Bergsicht nicht. In `tasks/accessibility.ts` ist `'rent-taken-over'` vollständig erhalten (wartet auf 01.04.2099 und auf den Hinweis). Die neuen Zustände aus `main` (`delete-unconfirmed`, `marked-sent`) haben andere Schlüssel, die Imports sind ohne Doppelungen zusammengeführt. In `screens.json` sind Zustand und Query `rent-taken-over` mit `stateMeanings` erhalten. Die Zeilen in beiden Features sind vorhanden. In den gemergten Dateien gibt es keine Konfliktmarker. Die neuen Zustände aus `main` auf `contract-detail-notice` (Löschdialog, unbestätigt) löschen Doras Mietvertrag nicht. Ausserdem bekommt jeder Bildschirm eigene Seed-Daten.
- **Docs-Commit:** Die Session ist in `docs/archive/implementation-plan-verlauf.md` archiviert, die Sessions W6 und W7 aus `main` sind beide erhalten. Die Workflow-Notizen sind sachlich.
- **Nichts Fremdes im Delta.**

## Nicht bestätigt

- Selbst nachgeprüft: `bunx vitest run src/__tests__/contract-wizard.dom.test.ts src/__tests__/contract-wizard.test.ts src/__tests__/i18n.test.ts`, 68 bestanden.
- Vom Aufrufer gemeldet: lint, check, Backend type-check, `bun run test:coverage` (2661 bestanden).
- Vom Aufrufer gemeldet, laufend und mir nicht bekannt: E2E contract-new, tenants, contract-detail sowie die axe- und Sprachzeilen für contract-new, tenant-new und contract-detail. Ob `rent-taken-over` nach dem Merge in E2E grün ist, habe ich nur durch Lesen beurteilt.
- Ob die Wortwahl in fr/it/en («videz le loyer supplémentaire», «svuoti la pigione supplementare») `docs/design/i18n-begriffe.md` folgt, habe ich nur an den Begriffen geprüft, die schon in denselben Dateien stehen, nicht fachlich.
