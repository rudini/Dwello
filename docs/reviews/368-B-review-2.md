# Code-Review #368 Slice B «Vereinbart ab», Runde 2 (Re-Review)

Delta: `git diff 045d0cca bd3fba3c -- . ':!docs'` (Commits 91329022, bd3fba3c), Worktree `review-368-B-code` auf bd3fba3c. Vorheriger Bericht: `docs/reviews/368-B-review-1.md`.

## Status der offenen IDs

| ID | Status | Beleg |
|---|---|---|
| C-1 (Major) | geschlossen | calculation.service.ts:379–381: `heatingOfRun` bekommt den Mietvertrag des mit `fromDay` verschobenen Laufs, also dieselbe Grundlage (`startDate = from`, `billedUntil: null`), mit der `byRunProfile` die Heizkosten-Position teilt. Der Test «hält den Heizanteil ab diesem Tag mit der erstellten Abrechnung fest» (agreed-from.pg.test.ts:157) erwartet `byDays: false` und die Summe Okt.–Dez. des Profils. Auf der Basis hätte er `{ byDays: true, reason: 'wholePeriod' }` gelesen, ist also rot ohne die Änderung. Randfälle siehe C-6 |
| C-2 (Major) | geschlossen | `agreed-from-refused` (contract-new, contract-edit) und `agreement-from-refused` (statement-generate) stehen in screens.json (mit `stateMeanings` und `queries`), in accessibility.feature und in sprachen-bildschirme.feature, einmal pro Ort. Die Tasks erreichen die Ablehnung des Backends: Das Formular prüft den Tag nicht selbst (nur `agreed-category.service.ts:91` lehnt ab). Im Assistenten speichert `setDay` → `choose('from')` sofort, und `failed` zeigt `backend_agreed_from_before_start` an der Frage. 2000-01-01 liegt vor dem Vertragsbeginn 2030-01-01 von contract-new |
| P-1 Weber (Major, Persona) | geschlossen | `contracts_agreed_costs_help_edit` nennt in allen vier Sprachen «Neu berechnen» / «Recalculer» / «Ricalcolare» / «Recalculate» und benutzt dieselbe Formulierung wie die bestehenden Texte (`buildings_fuel_delete_text`, `statements_recalculate`). Die Aussage stimmt: `recalculateStatement` rechnet über `calculateStatementForContract` neu und liest dabei die aktuellen `agreedCategoryIds`/`agreedFromDays` des Mietvertrags. Der DOM-Test (contract-edit.dom.test.ts:432) ist ohne den neuen Satz rot |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-6 | Minor | backend/src/services/calculation.service.ts:379–380 | Der gespeicherte Heizanteil folgt nur dem ersten Heizkosten-Tag. (a) Mehrere Heizkosten-Kategorien mit verschiedenen Tagen, oder eine mit Tag neben einer ohne Tag: Der `heatingShare` passt nur zu einer der Positionen. Diese Grenze nennt der Aufrufer selbst. Sie ist weder im Code noch in einem Issue oder einer Zeile in `offene-punkte.md` festgehalten. (b) Liegt der Tag nach dem Ende der Miettage in der Periode, gibt `fromDay` `null` zurück, und `?? run` speichert den Anteil über den ganzen Mietvertrag. Die Heizkosten-Position wird dann gar nicht abgerechnet, der PDF-Block mit dem Heizprofil (`heatingLines`) erscheint aber trotzdem (wie C-3 beim Tankbestand). Beide Fälle prüft kein Test |

Keine neuen Blocker oder Major.

## Nicht bestätigt

- Alle vom Aufrufer gemeldeten Prüfungen auf bd3fba3c, «vom Aufrufer gemeldet», keine davon selbst wiederholt: `bun run lint`, `bun run check`, Backend-Type-Check, agreed-from.pg (9), statement-*.pg und Heizung/Brennstoff (322), contract-edit.dom.test.ts (60), E2E-Zeilen `from-refused` in accessibility.feature und sprachen-bildschirme.feature auf chromium (6).
- Ob `Wait.until(on.formProblem)` in `agreed-from-refused` auf contract-edit wirklich die Ablehnung des Backends abwartet und nicht eine andere Meldung des Formulars: `formProblem` trifft jedes `form-error` oder `aria-invalid`. Belegt ist das nur durch den Ablauf der Task (der Vertragsbeginn der Fixture liegt vermutlich nach 2000-01-01; `fixtures/screens.ts` habe ich nicht gelesen) und durch das gemeldete E2E.

Geprüft: Commit-Nachrichten, Texte in allen vier `messages/*.json`, Targets ohne CSS-Selektoren, Steps unverändert (Tasks und Targets nur in den Screenplay-Schichten).
