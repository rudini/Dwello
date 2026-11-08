# Code-Review 1288-closing, Runde 2

Delta: `git diff bc187e4 b49ff59 -- . ':!docs/reviews'` (Worktree review-1288-code3). Vorheriger Bericht: docs/reviews/1288-closing-review-1.md.

Geschlossen: C-1, C-2

Keine neuen Befunde.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | – |

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint und testcheck:audit auf b49ff59 sauber. Ebenfalls gemeldet: E2E chromium für das neue Szenario und das erweiterte #1288-Szenario grün, axe- und Sprach-Zeilen contract-new apartment-cleared / contracts-unknown mit 6 bestanden. Vor dem Delta gemeldet: type-check, check, fitness, vitest --changed (811), contract-new + contract-edit (139), Prettier. Auch die roten Läufe der DOM- und i18n-Tests sind nur gemeldet. Selbst ausgeführt habe ich nichts.
- Rote Läufe der beiden neuen Szenario-Zeilen: Ich habe sie nur gelesen und nicht laufen lassen. Ohne ApartmentStep.svelte:54-56 enthielte die Beschreibung nur `contracts_apartment_help` («Wohnungen mit einem Mietvertrag ohne Vertragsende …»), nicht den geprüften Satz aus `contracts_apartment_cleared_text`. Mit dem alten Wortlaut («Ist er gekündigt») fände `toContain` den Satz nicht. Beide wären also rot.

Geprüft: Das neue Szenario (contract-new.feature:177-187) nutzt den bestehenden Schritt `apartmentSelectDescription` (`Accessible.descriptionOf`, toContain) und baut auf der Grundlage auf, wie das Nachbarszenario. Der neue Schritt `erklärt der Hinweis auf den Mietvertrag von …` ruft nur die bestehende Question `runningContractHintTextOf` auf und verletzt keine Screenplay-Schicht. Das erweiterte #1288-Szenario gibt es auf origin/main (ec3a731) nicht: Es ist neu, eine Zeile darf also ohne Spec-Freigabe dazukommen. Der Kommentar in tests/e2e/tasks/contract-form.ts:234 beschreibt jetzt `openClearedApartmentContract` richtig. Das Delta enthält nichts, was nicht zum Auftrag gehört.
