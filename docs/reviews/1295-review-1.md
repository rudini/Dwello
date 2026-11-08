# Code-Review #1295, Runde 1 (Schlussrunde vor dem Push)

Worktree: review-1295-code bei 6728ac4. Bereich: `git diff a46af7f f12b82c` ohne docs/reviews und docs/design/personas, dazu der Merge f12b82c..6728ac4 (berührt keine Datei des Slices).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/contracts/new/ReviewStep.svelte:47-50, src/routes/contracts/new/ContractWizard.svelte:408, src/routes/contracts/ContractForm.svelte:316 (mit PeriodStep.svelte:174) | Drei der geänderten Link-Stellen haben keinen Test, der den neuen Text mit der Wohnung prüft. Für den Link in «Prüfen» (contract-wizard.dom.test.ts:679 prüft nur `not.toBeNull()`), den Link in der Ablehnung beim Speichern im Assistenten (:338 prüft nur `href`) und den Link im Kasten «Zeitraum überschneidet sich» im Bearbeitungsformular (contract-edit.dom.test.ts:565 prüft nur den Kastentext) schlägt kein Test an, wenn die Stelle eine falsche oder leere Wohnung übergibt. svelte-check fängt nur eine fehlende Prop ab. Mit Test abgedeckt sind PeriodStep im Assistenten am Feld (:957 und das neue Szenario), die aufgehobene Wahl (:559 und contract-new.feature:227), die Ablehnung im Bearbeitungsformular (contract-edit.dom.test.ts:572) und OpenContracts (:993, contracts-i18n). |

Keine Blocker, keine Major.

Geprüft: Wortlaut in allen vier messages/*.json wie in 1295-fachreview-1 (inkl. anonymisierter Variante); `contracts_open_contract_link` ist ausser in docs/reviews nirgends mehr referenziert; jede Stelle mit OverlapLink übergibt die Wohnung des betroffenen Mietvertrags (aufgehobene Wahl: `cleared.apartment`; sonst die gewählte bzw. bearbeitete Wohnung, also die Wohnung des Mietvertrags, mit dem sich der Zeitraum überschneidet); OpenContracts nimmt den Namen aus `tenant_name` des Vertrags des gewählten Mieters und steht weiterhin unter dem Feld, in derselben Reihenfolge wie vorher; `chosenApartmentName` ersetzt die Suche in `contractSummary` und ist keine Kopie eines bestehenden Helpers; die Spec-Änderung in contract-new.feature:227 deckt `Spec change approved: #1295` (Commits 602ab1a, f12b82c); das neue Szenario ist nicht mehr `@wip`; mit `toBe` auf den ganzen Linktext ist es auf der Basis rot; der Step ruft nur eine Question, die den Text liefert; der Feature-Text sagt, was der Verwalter will; Namen laufen über `named(names, …)`; keine neuen Zustände für screens.json; kein Diff ohne Bezug zur Anforderung; ponytail-review ohne Befund.

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint, check, fitness, testcheck:audit und deepcheck:audit sauber; vitest --changed origin/main mit 843 bestanden; E2E chromium contract-new + contract-edit mit 142 bestanden (contract-detail nur vor dem letzten Refactor); axe- und Sprachzeilen contract-new mit 42 bestanden, contract-edit nur vor dem letzten Refactor; das neue Szenario und die anonymisierten i18n-Pins rot gesehen. Ich habe nichts davon selbst ausgeführt.
- Ob fr/it/en im Linktext kein Deutsch zeigen, hängt an `apartmentName` (lokalisiert laut Fachreview). In diesem Slice nicht geändert, nur gelesen.
