# Code-Review 506-6 (Copilot-Fixes PR #941, Runde 2)

Bereich: `git diff d687420 6e27564 -- . ':!docs/reviews' ':!implementation_plan.md'` (ein Commit, 6e27564). Vorheriger Bericht: `docs/reviews/506-review-5.md`.

Keine offenen und keine neuen Befunde.

Geschlossen: C-1, C-2, C-3

## Nicht bestätigt

- Vom Aufrufer gemeldet: das neue Szenario auf chromium (1 passed), der C-3-Test rot ohne die beiden Bedingungen im Update und grün mit ihnen, `statement-carry-over.pg.test.ts`, `bun run lint`, Commit-Hooks.
- Ob der Schritt «der Liegenschaftsverwalter den Übertrag als ausgeglichen markiert» unter `Und` nach `Angenommen` gefunden wird: Definiert ist er mit `When` (`tests/e2e/steps/statement-detail.steps.ts:706`). Laut dem Aufrufer ist der Lauf grün. Die Konfiguration von playwright-bdd zum Abgleich der Schlüsselwörter habe ich nicht gelesen.

Geprüft: C-1. Das Szenario `statement-minimum-balance.feature:226` öffnet nach dem Ausgleich von Hand die Bestätigung des Berichtigens. Der neue Schritt fragt den Text des Dialogs ab (`Text.of(correctDialog)`) und ruft keinen Locator direkt auf. Beide Teiltexte stammen aus `statements_correct_carry_settled` in `de.json`. Gegen den alten Zweig `statements_correct_open_settled` wäre das Szenario rot. Für den fehlenden eigenen Rotlauf gilt die Ausnahme aus Workflow 2, weil der DOM-Test rot gesehen wurde. Der nächste Klick kann den Ausgleich nicht überholen: `FormDialog` schliesst erst nach der Antwort, und der Text in `Correction.svelte` ist `$derived`. C-2. Der Kommentar in `statement.service.ts:830` sagt jetzt richtig, dass das Zeitfenster nur verkleinert ist. C-3. Jede der beiden Ablehnungen hängt an genau einer Bedingung. 2024 rechnet den von Hand ausgeglichenen Übertrag 2023 nicht an, deshalb greift dort nur `isNull(carrySettledOn)`. Bei 2024 greift nur `countedBy`, weil der versendete Entwurf 2025 ihn anrechnet. Nimmt man eine der beiden Bedingungen heraus, wird der Test rot.
