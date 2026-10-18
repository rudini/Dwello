# Code-Review #66, Runde 1 (0f3d5d1d..a65a2c03)

Worktree: `/tmp/claude-0/-home-user-Dwello/3fdb8c73-c9cc-5628-83f0-67a7b1a60366/scratchpad/review-66-code` (detached a65a2c03). Alle 16 geänderten Dateien gelesen.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `tests/a11y/screens.json:294-340` | Die befristete Variante des Hinweises (`contracts_running_text_fixed_term`) erscheint auf keinem Bildschirm der a11y- und Sprachprüfung. `contract-edit` zeigt einen unbefristeten, `contract-edit-notice` einen gekündigten Mietvertrag. Es ist nur eine Textvariante im selben `Alert`, ohne neue Struktur. Die Übersetzungen fr/it/en sind vorhanden und stimmen mit `statements_akonto_raise_fixed_term` und `i18n-begriffe.md:30-33` überein. Deshalb kein Major. |
| C-2 | Nit | `tests/e2e/features/contract-edit.feature:177-182` | Das befristete Szenario prüft nicht, dass der Satz zum Kündigungstermin fehlt. Das unbefristete prüft nicht, dass der befristete Satz fehlt (Fach-Review V-3). Beides deckt `contract-edit.dom.test.ts:159-174` ab, auch den gekündigten Fall. Das ist die tiefere Schicht, also genügt es. |
| C-3 | Nit | `src/lib/ui/MoneyInput.svelte:33` | `helpTestid="{testid}-help"` ergibt ohne `testid` den Wert `data-testid="undefined-help"`, zum Beispiel in der Galerie (`src/routes/gallery/+page.svelte:129-135`). `DateInput.svelte:128` macht es genauso, das Muster ist also bestehend. |
| C-4 | Nit | `tests/e2e/features/contract-new.feature:157` | Am Dateiende fehlt der Zeilenumbruch (laut Diff hatte die Basis einen). |
| C-5 | Nit | `implementation_plan.md:15` | Dort steht «PR "Fixes #66"». Weil der Hinweis ohne Akonto bewusst offen bleibt, muss es laut Auftrag «Refs #66» heissen. |

Ponytail-Review: Schlank, ausliefern. `runningText` ist ein einziges `$derived` mit einem Aufrufer. Die neuen Target-, Question- und Step-Paare sind das Screenplay-Minimum. net: -0 lines possible.

Keine Blocker, keine Majors.

## Bestätigt

- **Akonto-Hilfe, Option A:** Alle vier Sprachen nennen die im Mietvertrag vereinbarten Nebenkosten und behalten die Beispiele (`messages/*.json:742`). Die Schreibweise «zum Beispiel» folgt Fach-Review V-5. Geprüft durch `contract-wizard.dom.test.ts:153` (rot ohne neuen Text) und das Szenario `contract-new.feature:153-157`: Das Target `contract-advance-payment-input-help` gibt es erst durch die Änderung an `MoneyInput.svelte`, ohne sie scheitert das Szenario.
- **Hinweis zum laufenden Mietvertrag, Art. 269d OR:** `contracts_running_text` übernimmt wortgleich die Regel von `statements_akonto_raise` (de:683 gegenüber de:1077, ebenso in fr/it/en). Bei `endDate && !terminated` steht der Satz von #76 (`ContractForm.svelte:70-74`). Der gekündigte Mietvertrag bekommt den allgemeinen Text, wie verlangt. Geprüft durch den DOM-Test mit den Fällen unbefristet, gekündigt und befristet und mit Negativprüfung (rot ohne Änderung: das Testid `contract-running-hint` fehlte), dazu die E2E-Szenarien `contract-edit.feature:172-182`.
- **TODO-Marker:** Die Marker zu #66 sind entfernt (`ContractForm.svelte`, `RentStep.svelte`). `TODO(fachlich prüfen, #388)` steht in `ContractForm.svelte:233`. #388 ist offen mit den Labels `fachlich` und `entscheiden`, und ein Kommentar in #388 nennt `contracts_running_text_fixed_term` (per `gh api` geprüft).
- **Hinweis ohne Akonto:** Bewusst nicht umgesetzt. Es gibt keine Spur davon im Diff, und der Punkt im Plan ist offen (`implementation_plan.md:11`).
- **Screenplay:** Die Steps rufen nur Questions auf (`Text.of`). Die Features beschreiben fachlich, ohne Wörter wie «klickt» oder «Button». Die Testids sind kebab-case mit Kontext. `@wip` ist entfernt.
- **Design und Sicherheit:** Es gibt keine neuen Klassen, `Alert` stammt aus `src/lib/ui`, und kein Backend-Pfad wurde berührt.

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet, ich habe sie nicht wiederholt: `bun run lint`, `bun run check`, vitest (contract-edit.dom, contract-wizard.dom, contract-wizard, contracts-i18n, i18n, open-work, design-guard, ui-i18n.dom), E2E chromium (9 bestanden) sowie die Commit-Hooks fallow, deepcheck und commit subject. Ob die Tests rot waren, habe ich nur durch Lesen beurteilt.
- Ob die Seed-Daten des a11y-Bildschirms `contract-edit` einen unbefristeten Mietvertrag ergeben, habe ich nur aus der Beschreibung in `screens.json` geschlossen. Das Seed-Skript habe ich nicht gelesen.
- Fach-Review V-1 (Akonto «gilt sofort», #90) und M-3/M-4/M-5/M-6 sind fachliche Punkte. Laut Fach-Review bestanden sie schon vorher oder gehen über den Entscheid hinaus. Ihre Triage habe ich nicht geprüft.
