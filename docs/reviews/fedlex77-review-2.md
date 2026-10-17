# Code-Review #77 (Fedlex-Prüfung), Runde 2 (Fix für C-1)

Worktree: `review-fedlex77-code2` auf 739a21f6. Diff `git diff 196b27ef 739a21f6`, 7 Dateien, alle gelesen: `docs/reviews/fedlex77-review-1.md`, `implementation_plan.md`, `src/lib/ui/RadioGroup.svelte`, `tests/e2e/features/contract-new.feature`, `tests/e2e/questions/contract-form.ts`, `tests/e2e/steps/contract-form.steps.ts`, `tests/e2e/targets/contract-form.ts`. Gelesen zum Vergleich: `RentStep.svelte:87–95` (RadioGroup mit `testid="contract-fee-choice"`), `contract-form.steps.ts:397–408` (bestehende Schritte «erfasst einen Mietvertrag für die Wohnung», «bis zur Miete weitergeht»), `contract-new.feature:1–12` (Grundlage), `messages/{de,fr,it,en}.json:743`, die übrigen `*-help`-Targets in `tests/e2e/targets`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | erledigt | `contract-new.feature:140–145` | Szenario für die korrigierte Hilfe ist da, ohne `@wip`; siehe «Bestätigt» |
| C-2 | Minor | `messages/de.json:757` | offen aus Runde 1, nicht erneut geprüft |
| C-3 | Nit | `messages/de.json:743` | offen aus Runde 1, nicht erneut geprüft |
| C-4 | erledigt | `implementation_plan.md:11` | Punkt abgehakt, mit Begründung |
| C-5 | Nit | `docs/reviews/fedlex77-fachreview-1.md` | offen aus Runde 1, nicht erneut geprüft |

Keine neuen Befunde. Ponytail-Review: Der Fix ist klein (ein Attribut in `RadioGroup`, ein Target, eine Frage, ein Schritt, ein Szenario). Die bestehenden Schritte für Given und When werden wiederverwendet. Der Umbruch des `<p>` auf drei Zeilen ist Prettier-Formatierung der geänderten Zeile. Nichts Unbenutztes.

## Bestätigt

- **C-1 behoben.** Das Szenario «Hilfe zu einer neuen Verwaltungspauschale während der Mietdauer» erreicht den Schritt Miete über bestehende Aufgaben (`openNewContractFor`, `goToRentWith`). Die Frage `feeHelpText = Text.of(feeHelp)` gibt den Text zurück, keinen Ja/Nein-Wert. Der Schritt verlangt «mitteilen und begründen, mindestens zehn Tage vor Beginn der Kündigungsfrist» und «frühestens ab dem nächstmöglichen Kündigungstermin», beides wörtlich in `de.json:743`. Gegen den alten Text («mitteilen; sie gilt erst ab dem nächsten …», siehe Runde 1) schlagen beide Assertions fehl. Das habe ich durch Lesen geprüft, der Aufrufer meldet es zusätzlich als ausgeführt.
- **Screenplay-Schichten:** Der Schritt ruft nur `verwalter.sees(<Frage>)` auf. Das Target liegt in `targets/` und nutzt `getByTestId`. Die Frage liegt in `questions/`. Die Feature-Sprache sagt, was der Verwalter erfährt, nicht wie er es tut.
- **`data-testid`:** `contract-fee-choice-help` folgt dem bestehenden Muster `<testid>-help` (`invoice-utility-cost-checkbox-help`, `billed-until-input-help`). Ohne `testid` gibt `testid && …` `undefined` zurück, das Attribut fällt dann weg. Das Verhalten für Aufrufer ohne `testid` (Galerie, `CategoryForm`, `AgreementQuestion`) bleibt also gleich. Kein neuer Bildschirm und kein neuer Zustand, darum sind `screens.json` und die a11y-Features nicht betroffen. Kein neuer Text in `messages/*.json`.
- **Plan:** C-4 ist abgehakt. Der Grund «No scenario» ist durch das Szenario ersetzt.

## Nicht bestätigt

- Selbst ausgeführt auf 739a21f6: `bunx vitest run src/__tests__/contract-wizard.dom.test.ts`, 36/36 grün. Damit ist gezeigt, dass das geänderte `RadioGroup`-Markup den DOM-Test des Assistenten nicht bricht.
- Vom Aufrufer gemeldet: `bun run test:e2e -- --project=chromium -g "Neuen Mietvertrag erfassen"` (23 bestanden, vorher rot gegen den alten de-Text), `bun run lint`, `bun run check` (0 Fehler), `bunx vitest run` komplett (3005 bestanden), Prettier sauber. E2E habe ich laut Auftrag nicht gestartet.
- Ob eine Option eines `RadioGroup` den Wert `help` hat und dann dieselbe testid wie der Hilfeabsatz bekäme: Ich habe die Optionswerte nicht überall gelesen. Bei der Verwaltungspauschale sind es `run`, `own` und `none`, dort gibt es also keine Kollision.
