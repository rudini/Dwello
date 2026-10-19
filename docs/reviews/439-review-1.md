# Code-Review #439, Runde 1 (`3f0297f6..ae91957c`)

Alle 14 geänderten Dateien gelesen, dazu `StatementWizard.svelte` (submitStep, showErrors, edited), `StatementStep.svelte`, `AgreedCosts.svelte` und die E2E-Aufgaben in `tests/e2e/tasks/statement-generate.ts`, `tests/e2e/targets/wizard.ts` und `tests/e2e/helpers` bzw. `src/__tests__/helpers/dom.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/features/statement-agreed-costs.feature:109-116 | Das neue Szenario wiederholt die Vorbedingungen und das «Wenn» von «Die vereinbarten Nebenkosten lassen sich nicht prüfen» (Z. 99-107) Wort für Wort, nur das «Dann» ist neu. Im bestehenden Szenario prüft das «Dann» eine Meldung, die schon vor dem Klick auf «Weiter» sichtbar ist. Eine Zeile `Und erklärt der Assistent "…"` dort zeigt dasselbe (ponytail `shrink`, etwa -9 Zeilen). |
| C-2 | Minor | src/routes/statements/generate/AgreementsCheck.svelte:31-35 | Ein zweiter Klick auf «Weiter» lässt den Hinweis einfach stehen (der `role="alert"`-Knoten wird nicht neu eingefügt), deshalb liest ein Screenreader beim zweiten Mal nichts vor. `showErrors()` setzt den Fokus nicht, weil es kein `aria-invalid` gibt. Bei den Fehlern der anderen Schritte ist das genauso, es blockiert also nicht. |
| C-3 | Nit | src/routes/statements/generate/AgreementsCheck.svelte:10 | `error` ist hier nur ein Merker, den der Text `m.statements_agreement_error()` füllt («Bitte wählen Sie …»). Ein `boolean` (`waiting`) würde sagen, was gemeint ist. Der Kommentar `// «Weiter» was chosen` gleicht das aus. |

Ponytail-Review: Die Auslagerung in `AgreementsCheck.svelte` hat nur einen Aufrufer. Sie ist aber mit dem Komplexitäts-Gate von fallow begründet und verschiebt den Code unverändert (`onretry` statt `attempt++`). Ausser C-1 ist nichts überflüssig. net: -9 lines possible.

Keine Blocker, keine Major.

## Prüfung der Anforderung

- **«Weiter» bleibt nie stumm**: Bestätigt durch Code und Tests.
  - Code: `StatementWizard.submitStep` setzt `errors.agreements`, sobald `agreementsBlocking` gilt. `AgreedCosts` gibt `error` an `AgreementsCheck` weiter. Das zeigt den Hinweis `agreements-wait`, solange `status !== 'loaded'`, also beim Laden und nach einem Fehler. Ist die Prüfung geladen und sind noch Fragen offen, zeigt `AgreementQuestion` die Fehlermeldung wie bisher.
  - Fehlerfall: E2E-Szenario (FailRequests).
  - Ladefall: DOM-Test mit einem `fetch`, der nie antwortet. Das wiederhergestellte `fetch` kommt aus `afterEach` in `helpers/dom.ts`.
- **Szenario oder `No scenario`**: Den Fehlerzustand kann der E2E-Stack erzeugen, also gibt es ein Szenario ohne `@wip`. Den Ladezustand kann er nur mit Verzögerung erzeugen, dafür gibt es den DOM-Test in `agreed-costs.dom.test.ts`. Das entspricht dem Issue.
- **Texte**: `statements_agreements_wait` ist in allen vier `messages/*.json`.
  - de: «Sie»-frei, aber sachlich.
  - fr/it: Höflichkeitsform und die Begriffe «contrats de bail» bzw. «contratti di locazione» wie in den Nachbartexten.
- **Rot ohne Änderung**: Beim Lesen beide neuen Tests geprüft. Das Szenario und der DOM-Test fragen nach `agreements-wait`, das es auf dem Basis-Commit nicht gibt, also scheitern beide ohne die Änderung.
- **a11y/Sprachen**: Der neue Zustand im Fehlerfall wird über den bestehenden Zustand `agreements-failed` abgedeckt. Dessen Bedeutung in `screens.json` ist ergänzt, und die Aktivität klickt jetzt «Weiter» und wartet auf `agreements-wait`. Die Zeilen in `accessibility.feature` und `sprachen-bildschirme.feature` gibt es schon. Der Alert ist weiterhin sichtbar, die frühere Abdeckung geht also nicht verloren.
- **Screenplay**: Der Schritt «erklärt der Assistent» ruft nur die Frage `agreementsWaiting` auf (`Text.of`, sie liefert den Wert). Das Target liegt in `targets/statement-generate.ts`. Das «Wenn» nutzt den bestehenden Schritt «weitergeht» (Klick auf `wizard-next`). Die Meldung erscheint synchron, und `sees(...).toContain` wartet auf sie.
- **Tokens/Komponenten**: `text-ink`, `text-ink-muted`, `font-semibold`, `Alert`, `Button`. Keine Rohwerte.
- **Sicherheit/API**: Kein Backend, keine neue Anfrage, kein Vertrag betroffen.
- **Kein fremder Inhalt**: Die Verschiebung in `AgreementsCheck.svelte` ist begründet. `implementation_plan.md` gehört zum Workflow.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (inklusive des einmal roten `tools/claude-hooks/fallow-gate.test.ts`), die E2E-Szenarien und die axe- und Sprach-Zeilen von `agreements-failed`: vom Aufrufer gemeldet.
- Den DOM-Test wollte ich nachlaufen lassen, das ging nicht. Das `node_modules` des Worktrees zeigt auf `/home/user/Dwello/node_modules`, und eine Deny-Regel sperrt den Zugriff darauf.
- Dass das Szenario und der DOM-Test vor dem Code rot waren: vom Aufrufer gemeldet. Beim Lesen sind beide ohne die Änderung rot (siehe oben).
- Der Ladezustand mit Hinweis läuft weder durch axe noch durch die Sprachprüfung (E2E kann ihn nicht erzeugen). Gleiche Elemente wie im Fehlerzustand, deshalb kein Befund.
