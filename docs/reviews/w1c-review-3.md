# Code-Review W1c (#132), Runde 3 (Fix zu C-12 und C-13)

Gegenstand: `git diff 5fa0a92 6d5cae6` im Worktree `review-w1c-code3` (detached, 6d5cae6). Ich habe alle 5 geänderten Dateien gelesen: `statement-generation.ts`, `statement-generation.test.ts`, `statement-generate.feature`, `implementation_plan.md` und `docs/reviews/w1c-review-2.md`, den Bericht aus Runde 2, der jetzt eingecheckt ist. Dazu kam der Code darum herum: `handleMidYearMoves` (`backend/src/services/prorating.service.ts:188-225`), `heatingOfRun` (`backend/src/services/calculation.service.ts:435-460`), `seed.statement` (`tests/e2e/fixtures/backend.ts:176-193`), die Schritte `sagt die Vorschau {string}` und `zur Abrechnung {int} von {string} sagt die Vorschau nichts` (`tests/e2e/steps/statement-generate.steps.ts:432-449`), die Targets und Questions dazu, `Text.of` (`tests/e2e/screenplay/questions.ts:33`), `PreviewChecks.svelte:109-124` und `ChangedStatements.svelte`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-17 | Nit | `src/__tests__/statement-generation.test.ts:359` | Der dritte Fall aus C-13 hat keinen eigenen Test: `{ byDays: true }` ohne `reason`, wenn das Heizprofil beim Berechnen fehlte (`calculation.service.ts:445`). Die Bedingung `reason === 'wholePeriod'` deckt ihn mit ab. Einen Test braucht es dafür nicht. |

Stand der Befunde aus Runde 2:

| ID | Stand |
|----|-------|
| C-12 | Behoben, siehe unten. |
| C-13 | Behoben, siehe unten. |
| C-2, C-3, C-4, C-6, C-7 (Rest), C-9, C-10, C-11, C-14, C-15, C-16 | Unverändert, das Delta berührt sie nicht. Zu C-7: Die Erweiterung durch C-13 ist erledigt. |

ponytail-review des Deltas: Im Code ändert sich nur eine Zeile, dazu ein Kommentar. Ein Test und ein Szenario kommen dazu. Nichts bleibt ungenutzt, und es gibt keinen kürzeren Weg. Kein Befund.

## Blocker/Major

Keine.

## Abgleich mit dem Delta

- **C-13 behoben:** `statement-generation.ts:157` lautet jetzt `if (share?.reason === 'wholePeriod') return …`. Genau diesen Wert setzt `handleMidYearMoves` für einen Mietvertrag über die ganze Periode (`prorating.service.ts:216`), unabhängig vom Heizprofil. `noHeatingMonths` (`:221`) und `{ byDays: true }` ohne Profil (`calculation.service.ts:445`) zählen wieder als Unterschied. Der Kommentar passt zur neuen Regel. Der neue Unit-Test (`statement-generation.test.ts:359-364`) baut eine Abrechnung mit `hp2` und `{ byDays: true, reason: 'noHeatingMonths' }` und erwartet den Heizprofil-Hinweis. Mit der alten Bedingung `byDays === true` wäre das Ergebnis `[]` gewesen, der Test war also rot. Der bestehende Test mit `wholePeriod` (Z. 353) bleibt grün und hält die Regel aus P-2 fest. Ich habe die Datei selbst erneut laufen lassen: 24 von 24 bestanden.
- **C-12 behoben:** Neues Szenario `statement-generate.feature:379-391`, ohne `@wip`. Lea Graf mietet 3.02 seit 2024-01-01 ohne Ende, also über die ganze Periode 2024. Es gibt eine Heizkostenrechnung, damit `heatingOfRun` nicht `null` liefert (`calculation.service.ts:443`). Die Abrechnung wird über den echten Endpunkt `statements/generate` mit «Winter» erzeugt (`fixtures/backend.ts:184`) und erhält damit `reason: 'wholePeriod'` vom Backend, nicht von Hand gesetzt. Die Vorschau läuft mit «Heizung Mittelland» und demselben Satz von 3 %.
  - Rot ohne den Fix: Nimmt man Z. 157 heraus, hat die Abrechnung ein anderes Heizprofil. Sie steht dann in `row.changed`, und `ChangedStatements.svelte` rendert `existing-statement-notes-{id}`. `Text.of` liefert dann einen Text statt `null`, also wird `toBeNull()` rot. Das passt zur Angabe des Aufrufers.
  - Negativprüfung nach positivem Anker: Der Anker `statements_existing_note` («Bestehende Abrechnungen bleiben, wie sie sind, auch Entwürfe. …», `toContain`) steht im selben `Alert` wie die Liste `ChangedStatements` (`PreviewChecks.svelte:110-123`) und kommt mit derselben Antwort. Ist der Anker sichtbar, ist die Liste schon gerendert. Die Negativprüfung kann also nicht vorzeitig grün werden.
  - Screenplay: Es gibt keine neuen Schritte. Die bestehenden Schritte rufen nur Questions (`existingStatementsText`, `notesOnExistingStatement`) über `verwalter.sees`, die Question liefert den Text selbst. Der Szenariotitel sagt, was der Liegenschaftsverwalter sieht, nicht, wie er bedient. Isolation: Dasselbe Muster (Lindenhof, 3.02, Lea Graf) nutzen schon `:94` und `:314`.
  - Domänenbegriffe: «Heizprofil», «Abrechnungsperiode», «Mietvertrag» und «Verwaltungspauschale» werden wie in den Nachbarszenarien verwendet. Der Titel sagt «Periode» statt «Abrechnungsperiode». Das ist knapp, aber eindeutig, und der Kommentar verweist auf #247.
- **Texte, a11y:** Das Delta ändert keine UI-Texte und keine neuen Bildschirmzustände. `messages/*.json`, `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature` sind nicht betroffen.
- **`implementation_plan.md`:** Runde 2 ist abgehakt, Runde 3 steht als offener Punkt. Das ist richtig.
- **`docs/reviews/w1c-review-2.md`:** Das ist der Bericht aus Runde 2, unverändert eingecheckt. Er gehört zum Ablauf, ist also nicht fremd.
- **Nicht Verlangtes:** keines.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, fallow-Audit, `bunx vitest run` (2804 bestanden), E2E `--project=chromium --project=api tests/e2e/features/statement-generate.feature` (57 bestanden), Rot des neuen Szenarios bei herausgenommener Bedingung. Das Rot habe ich nur durch Lesen geprüft, siehe oben.
- Selbst erneut ausgeführt auf 6d5cae6: `bunx vitest run src/__tests__/statement-generation.test.ts`, 24 von 24 bestanden.
- `cd backend && bun run type-check` meldet der Aufrufer nicht. Das Delta berührt kein Backend.
- Dass das Szenario nicht an einem anderen Hinweis scheitert (z. B. am Satz-Hinweis, falls der Mietvertrag keinen Satz von 3 % vorsieht): Das sieht man nur, wenn das Szenario läuft. Der Aufrufer meldet es als grün.
