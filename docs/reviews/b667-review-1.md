# Code-Review b667, Runde 1 (8beb200, #667)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tests/e2e/tasks/accessibility.ts:709 | Der Zustand `overlap-refused` auf `contract-new` zeigt nicht die Ablehnung der Überschneidung. Der Grund: `FailRequests.to('/api/contracts', {})` lässt auch das POST des Speicherns mit 500 scheitern. Damit prüfen die neuen Zeilen in screens.json, accessibility.feature und sprachen-bildschirme.feature nicht den neuen Zustand. |
| C-2 | Minor | backend/src/services/contract.service.ts:187, 200 | `orderBy(startDate)` (V-3) und `terminated: 1` sind im Backend ohne Test. Kein pg-Test hat einen Zeitraum, der zwei Mietverträge überschneidet, oder einen gekündigten anderen Mietvertrag. |
| C-3 | Minor | src/lib/contract-form.ts:431-436 | Beginnt der andere, unbefristete Mietvertrag am selben Tag wie der eingegebene, rät Dwello zu `end_other`. Dieser Rat lässt sich nicht befolgen: Jedes Vertragsende des anderen Mietvertrags liegt am oder nach dem Vertragsbeginn, und beide Grenzen zählen, also bleibt die Überschneidung. Die Regel 3 des Fach-Reviews ist wörtlich umgesetzt. Die Korrektur braucht ein Wort des `fach-reviewer`. |
| C-4 | Minor | tests/e2e/steps/contract-form.steps.ts:688-691 | Der neue Schritt «sieht … die Ablehnung {string}» fragt nur ja/nein ab (`errorMessageShown(...)` mit `toBe(true)`), statt den Text zu lesen. Schlägt er fehl, zeigt er `false` und nicht, was Dwello sagt. Das verstösst gegen `tests/e2e/CLAUDE.md`, «Questions». |
| C-5 | Minor | src/routes/contracts/ContractForm.svelte:99, 141 | Nach einer Ablehnung ändert der Liegenschaftsverwalter den Zeitraum. `edited()` löscht `errors.form` aber nur bei abgelehnten Abrechnungen. Deshalb bleibt der Hinweis «Überschneidung noch nicht geprüft» bei Wohnung und Vertragsbeginn ausgeblendet, obwohl Dwello den neuen Zeitraum noch nicht geprüft hat. |

## C-1 (Major): `overlap-refused` im Assistenten erreicht die Ablehnung nie

**Beleg:**
- `tests/e2e/screenplay/interactions.ts:186-188`: Die Route passt, sobald `url.pathname === path` gilt. Mit `{}` gilt `every()` immer, und die Methode wird nicht gefiltert.
- `src/lib/api.ts:117`: `apiCall('/contracts', { method: 'POST' })` (ContractWizard.svelte:274) geht an `/api/contracts`.
- Mit 500 und ohne Body:
  - `ContractWizard.svelte:281-282`: `overlapRefusal` gibt null zurück, also bleibt `refusal = ''`, und `errors.form` wird `savedFailed(...)` = `contracts_save_failed`.
  - `refused` bleibt false, also steht `review-contracts-unknown` weiter da.
- `Wait.until(on.formProblem)` (targets/accessibility.ts:17) ist mit jedem `form-error` erfüllt. Deshalb wird der Lauf grün.

Für `contract-edit-earlier` stimmt der Zustand, denn das PUT geht an `/api/contracts/{id}`.

**Warum falsch:** axe und die Sprachprüfung sehen auf `contract-new` den allgemeinen Speicherfehler mit Hinweis, nicht die neue Ablehnung mit Rat und ohne Hinweis. Laut `stateMeanings` und CLAUDE.md, «Process», muss dieser neue Zustand geprüft sein. Damit fehlt die Prüfung des neuen Zustands im Assistenten. Das betrifft auch die neuen Texte in fr/it/en: Niemand prüft, ob sie dort ohne Deutsch erscheinen.

**Zeigen:** Den Zustand in `contract-new` laufen lassen und danach den Text von `form-error` lesen: Dort steht «Der Mietvertrag wurde nicht gespeichert …» ohne «überschneidet sich mit dem Mietvertrag von …», und `review-contracts-unknown` ist sichtbar.

**Fix:** Nur das Laden der Mietverträge scheitern lassen, etwa mit `FailRequests.to('/api/contracts', { apartmentId: <limitedApartment> })` wie bei `contractsCannotBeLoaded`. Danach auf die Ablehnung warten, nicht auf irgendeinen `form-error`.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet, ich habe sie nicht ausgeführt:
  - vitest: 4197 bestanden
  - lint, check und backend type-check: sauber
  - backend contract-overlap.pg und api-contracts.pg: 113 bestanden
  - E2E contract-new und contract-edit: 90 bestanden
  - axe: 72 bestanden
- Nicht gelaufen sind die ganze Backend-Suite, fitness, fallow und p2-benchmark.
- W-10, Stepper `flex-1` → `flex-auto`: Das Layout habe ich nicht gesehen.
  - Ob das Szenario auf der Basis bei 1440 px rot ist, sehe ich nur aus Weber W-10.
  - Unklar ist, ob kurze Namen umbrechen, wenn erledigte Schritte mit langem Wert (`wizard-step-value`) breiter werden, zwischen xl und 1440 px, im Mietvertrags- und im Abrechnungsassistenten. Das Szenario prüft nur Schritt 1 ohne erledigte Schritte.
  - Unter md ist die Liste versteckt (`hidden md:flex`), deshalb ist 390 px nicht betroffen.
- Das a11y-Ablauf `overlap-refused` im Bearbeitungsformular (Vertragsende 2015-06-30 für Vreni mit `contractEndPastConfirm`) habe ich nur gelesen, nicht ausgeführt.
- Das Issue #667 habe ich mit `gh api repos/rudini/Dwello/issues/667` gelesen, nicht mit mcp__github__issue_read.

Geprüft:
- Wortlaut aller neuen und geänderten Schlüssel in de/fr/it/en: per Skript Wort für Wort gleich wie b667-fachreview-1.md. In fr steht U+00A0 an « » (end_before, end_other, confirm_past). `backend_contract_overlap` ist unverändert, `contracts_overlap_wizard` ist überall entfernt.
- Keine Szenariozeile ohne @wip auf main ist geändert: Der Diff der Features hat nur Zusätze, und auf main zitiert keine Szenariozeile einen geänderten Text.
- Die sechs Szenarien sind ohne @wip und rot ohne die Änderung, ebenso die neuen Unit-, DOM- und pg-Tests.
- Die Regeln für den Rat (a, b, c) an den Grenzen am selben Tag, ausser C-3.
- Der Status des anderen Mietvertrags (`future`/`active`) wirkt nur ohne Vertragsende.
- Ein anonymisierter Mieter hat immer einen beendeten Mietvertrag, also kommt `end_other` ohne Namen nicht vor.
- API-Verträge contract-overlap.json und contracts.json; api-specification.md.
- Fixture Vreni (nur die Mieterseite bietet die Anonymisierung an).
- Screenplay-Schichten der neuen Steps.
