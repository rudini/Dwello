# Code-Review #432, Runde 1

Gegenstand: `git diff 0d616e86 9ffbb20f -- . ':!docs/reviews' ':!implementation_plan.md'` im Worktree `review-432-code` (detached auf 9ffbb20f). Gelesen: alle 13 geänderten Dateien, dazu `src/routes/contracts/new/RentStep.svelte`, `tests/e2e/targets|questions/contract-form.ts`, Issue #432 (GitHub API), `docs/reviews/432-fachreview-1.md`, `UBIQUITOUS_LANGUAGE.md` (Akonto, Nebenkostenpauschale).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | src/__tests__/contract-wizard.test.ts:120-127 | Der Grenzfall Akonto «0» (soll den Text ohne Akonto zeigen, Fach-Review «Grenzfälle») ist nicht festgehalten; der Code deckt ihn über `amount()` richtig ab. Optional eine Zeile `expect(flatRateNotice({ ...mixed, advancePayment: '0' }, categories)).toContain('trotzdem')`. |
| C-2 | Nit | tests/e2e/steps/contract-form.steps.ts:544-546 | Der neue allgemeine Schritt «warnt das Formular zur Nebenkostenpauschale {string}» und der bestehende «warnt das Formular, dass Dwello … trotzdem abrechnet» (Z. 548) prüfen dieselbe Frage; der bestehende liesse sich auf den neuen zurückführen. Kein Handlungsbedarf in diesem Slice. |

Keine Blocker, keine Major.

## Bestätigt

- **Regel:** `flatRateNotice` (`src/lib/contract-wizard.ts:90-97`) gibt bei Pauschale > 0 und mindestens einem Häkchen (keine Auswahl: alle Kategorien) eine Warnung, mit Akonto > 0 den Text `contracts_flat_rate_warning_text_advance`, sonst den bisherigen. Pauschale 0/leer oder keine Häkchen: `null`. Entspricht «Decided (product owner)» 2026-10-18/19.
- **Texte:** de/fr/it/en in `messages/*.json:570` wörtlich gleich mit dem Issue (Abgleich Zeichen für Zeichen, auch das typografische Apostroph in it). Titel und Text ohne Akonto unverändert, wie entschieden.
- **Unit-Test:** `contract-wizard.test.ts:119-127` war auf der Basis rot (Basis gab mit Akonto `null`); die entfernte Zeile `advancePayment: '50' → null` gibt das alte, nun geänderte Verhalten wieder und musste weg. Selbst erneut ausgeführt: 26/26 grün.
- **Szenario:** `contract-new.feature:204-210`, ohne `@wip`; prüft Satz 3, der nur in der Variante steht, also rot auf der Basis (keine Warnung) und unterscheidet die Variante vom Text ohne Akonto. Schritte rufen nur Tasks (`enterAdvancePayment`) und Fragen (`flatRateWarningText`) auf; Formulierung fachlich («einträgt»), Begriffe aus dem Glossar.
- **Bildschirme:** neuer Zustand `flat-rate-warning-advance` in `tests/a11y/screens.json` (mit `stateMeanings`, Query für contract-new, beide Orte contract-new und contract-edit), `accessibility.feature` und `sprachen-bildschirme.feature` je zweimal; Zustandstask in `tests/e2e/tasks/accessibility.ts:291-298` wartet auf die Warnung.
- **Design/A11y:** keine Markup-Änderung; die Warnung nutzt weiter `Alert` in `role="status"` (`RentStep.svelte:91-101`), gemeinsam für Neu und Bearbeiten.
- **Sicherheit/API:** keine Backend-, BFF- oder Vertragsänderung; `tests/contracts` nicht betroffen.
- **Nichts Fremdes im Diff;** Commit-Betreffe im Format.
- **ponytail-review:** Lean already. Ship. (net: -0 lines possible; C-2 ist eine Vereinheitlichung bestehender Steps, keine Kürzung dieses Diffs.)

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` (3109), E2E `-g "Nebenkostenpauschale|flat-rate-warning"` (13) und `-g flat-rate-warning-advance` (4): vom Aufrufer gemeldet; nur `bunx vitest run src/__tests__/contract-wizard.test.ts` selbst wiederholt.
- Rot des Szenarios an der fehlenden Warnung (a0c0bf90) und des Unit-Tests (75f8405f): vom Aufrufer gemeldet; durch Lesen plausibel (Basis `flatRateNotice` liefert mit Akonto `null`).
- Ob die Anzeige in «Mietvertrag bearbeiten» mit einem dort schon gespeicherten Akonto erscheint: nur über die a11y-/Sprachzeile `contract-edit | flat-rate-warning-advance` abgedeckt (vom Aufrufer als grün gemeldet), kein Verhaltensszenario in `contract-edit.feature`; der Schritt `RentStep.svelte` ist gemeinsam, das Issue verlangt nur ein Szenario.
