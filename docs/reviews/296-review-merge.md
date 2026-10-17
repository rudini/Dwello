# Code-Review: Merge-Commit f7910d9 (#296, origin/main in claude/w10b-start-year-296)

Worktree: `/tmp/claude-0/-home-user-Dwello/e15917e2-7c43-5793-a424-48cbe5ea53b1/scratchpad/review-296-merge`
Geprüft: `git show --cc f7910d9`, `git diff f7910d9^1 f7910d9` (was main bringt), `git diff f7910d9^2 f7910d9` (was der Branch gegenüber main noch ändert, 12 Dateien).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | docs/archive/implementation-plan-verlauf.md:887 | Der Merge von `main` mit drei Konflikten steht nicht in der Session #296; andere Sessions vermerken ihre Merges (z. B. W4b «Merged origin/main», W7c «Second merge of `main`»). |

Keine Blocker, keine Majors.

## Konfliktauflösung

- `src/lib/statement-wizard.ts:3-4`: Import von `impossible, impossibleYear` aus `./contract-form` (Branch) plus `isFeeRate` aus `./utils/format` (main). Richtig: Beide Seiten bleiben erhalten. `isFeeRate` wird in der Datei verwendet (main), `impossible` liegt jetzt in `contract-form.ts:44-45`.
- `src/lib/contract-wizard.ts:3-10` (automatisch zusammengeführt): `impossible`, `impossibleYear` (Branch) und `managementFeeText` (main) werden beide aus `./contract-form` importiert. Die alten Exporte in `contract-wizard.ts` sind entfernt, es gibt keinen Re-Export.
- `tests/e2e/fixtures/screens.ts:52-53`: Carlas Vertrag endet am 2098-12-31 (Branch), und `seed.managementFee('Carla', false)` (main, #89) bleibt. Für main hängt nichts am Ende 2099: Der Hinweis `management-fee-not-agreed` im Schritt «Heizprofil und Verwaltungspauschale» braucht nur einen Vertrag, der 2025 läuft. Das gilt für 2015–2098 ebenso. Die A-6-Aufgabe (#115) greift erst bei einem abgelaufenen Ende, also auch nicht bei 2098.
- `docs/archive/implementation-plan-verlauf.md`: Die Sessions von main (W6b, W5c, W4b-Mietstatus, #110, W2c, W7c) und die Session #296 sind vollständig erhalten. `implementation_plan.md` hat keine offene Session mehr. Im Baum finden sich keine Konfliktmarker (`git grep` auf `<<<<<<<`/`>>>>>>>`/`=======`).
- Der Diff `f7910d9^2..f7910d9` enthält nur die Änderungen des Branches (#296). Der Merge bringt nichts Fremdes mit.

## Hängt etwas aus main an den alten Orten oder Daten?

- In `src` und `tests` importiert nichts mehr `impossible`/`impossibleYear` aus `contract-wizard`. Einziger Importeur ausser `contract-wizard.ts` ist `statement-wizard.ts`, und zwar aus `contract-form`. `contracts-i18n.test.ts` importiert ebenfalls aus `$lib/contract-form`.
- Nirgends wird noch ein Vorschlag «01.01.2100» oder ein Ende 2099-12-31 von Carla bzw. Wohnung 1.04 erwartet. `accessibility.ts:297` wartet auf `01.01.2099`. Alle anderen Fundstellen mit 2099/2100 haben eigene Daten:
  - Doras Kündigung 2099-03-31, Vorschlag `01.04.2099` (`accessibility.ts:306`)
  - Feature-Szenarien mit Einzug 2099-11-01
  - `contract-edit.dom.test.ts` mit `start=2099-04-01`
  - der neue Test `contract-form.test.ts:53`, der `2100-01-01` absichtlich verwirft
- Main hat Fritz neu eingeführt, mit einem Vertrag ab 2100-01-01 auf Wohnung 2.03 (`screens.ts:92`). Er ist offen befristet und hat damit kein «frei ab». Kein a11y-Zustand wählt 2.03 im Assistenten, und kein Link `start=` führt aus ihm heraus. Mit #296 kollidiert das also nicht.
- Main bringt den Link `/contracts/new?tenant=…&start={nextDay(endDate)}` in `ContractForm.svelte:226` mit. `initialContractValues` (`contract-form.ts:57`) verwirft dafür jetzt ein Jahr ausserhalb 19xx/20xx, abgedeckt durch `contract-form.test.ts:50-55`.
- Die neuen Zustände aus main in `accessibility.ts` (`moved-out-dialog`, `continue-refused`, Verwaltungspauschale in Assistent und Abrechnung) verwenden weder Wohnung 1.04 noch den Startvorschlag.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check` und der volle `bunx vitest run` (157 Dateien, 2758 Tests) auf f7910d9 sind vom Aufrufer gemeldet. Ein Teillauf (`contract-form`, `contract-wizard.dom`, `contracts-i18n`, `statement-wizard.dom`, `contract-wizard`) war nicht möglich: `node_modules` des Worktrees verweist auf `/home/user/Dwello/node_modules`, und dieser Zugriff ist durch eine Deny-Regel gesperrt.
- Die E2E-Zeilen für Axe und Sprachen der Vertrags- und Abrechnungsbildschirme laufen beim Aufrufer noch. Ob `overlap-warning` mit `01.01.2099` und der Zustand `management-fee-not-agreed` mit Carlas Ende 2098 grün sind, habe ich nur durch Lesen geprüft (siehe oben).
- Der Inhalt des Slices (#296) war schon in den Runden `docs/reviews/296-review-1.md` und `296-review-2.md` geprüft. Hier habe ich nur den Merge geprüft; ponytail-review habe ich auf den Merge angewandt und nichts gefunden.
