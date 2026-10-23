# Code-Review #470, Runde 3 (494f73af..d6127bac)

## Status der offenen IDs aus Runde 2

| ID | Status | Beleg |
|----|--------|-------|
| C-3 | geschlossen | `noted` wird jetzt auch bei `status === 'failed'` gesetzt (src/routes/statements/generate/AgreedCosts.svelte:59). LateChecks reicht den Wert über `costsNoted` weiter (LateChecks.svelte:30, :42), StatementWizard bindet ihn an `checksNoted` (:336) für `late-checks-note` (:314). Die neue Prüfung `expect(props.noted).toBe(true)` im Fehlerfall (src/__tests__/agreed-costs.dom.test.ts:145-146) schlägt auf 494f73af fehl, weil `contracts` dort leer bleibt. FeeNotAgreed zeigt bei einem Fehler nichts an und braucht deshalb keine Zeile. |
| C-4 | geschlossen | Der neue Schritt «Und sagt der Assistent über «Weiter», dass unten Hinweise stehen» (tests/e2e/features/statement-management-fee.feature:68) prüft den Text über `Text.of(lateChecksNote)` und die Lage über `Gap.between(lateChecksNote, nextButton)` (tests/e2e/questions/statement-generate.ts:160-162). Das Target filtert auf `visible: true`, und `sees` fragt wiederholt ab (`expect.poll`). Ohne die Zeile kommt also ein leerer Text oder `null` zurück, und der Schritt ist rot. Die Schichten sind eingehalten: Der Schritt ruft nur Questions auf. |
| C-5 | geschlossen | `expect(props.noted).toBe(true)` bei offenen Fragen (agreed-costs.dom.test.ts:51-52). Der Test sichert vorhandenes Verhalten des Slices ab, ein Rot ist nicht nötig. |

## Neue Befunde

Keine.

## Nicht bestätigt

- Diese Läufe auf d6127bac habe ich nicht neu ausgeführt, die Ergebnisse sind vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run` für agreed-costs.dom und statement-wizard.dom (100 Tests), E2E statement-management-fee und statement-agreed-costs (36 Tests). Ebenso vom Aufrufer gemeldet: E2E auf f7fb01d4 (177 Tests) und das Rot der C-3-Prüfung vor der Korrektur.
- Ob `invisible` in echten Browsern dieselbe Höhe hält und «Weiter» auf 390 px stillsteht, habe ich ohne Browser nicht gemessen. Das neue Szenario prüft nur, dass die Zeile über «Weiter» steht.

Geprüft: Die Zustände `agreed-costs` in `screens.json`, `accessibility.feature:187` und `sprachen-bildschirme.feature:188` (offener Punkt aus Runde 2). `docs/reviews/470-review-2.md` liegt dort, wie es Skill `slice-review` verlangt. Das Delta enthält keine fremden Änderungen.
