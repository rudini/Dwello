# Code-Review #144 (P-17), Runde 3 (Abschlussrunde vor dem Push)

Worktree `review-p17-code3`, detached bei af72df8. Geprüft wurde `git diff d0b9370 af72df8`. Gelesen habe ich alle drei geänderten Dateien: `tests/e2e/fixtures/backend.ts`, `tests/e2e/fixtures/screens.ts` und `docs/reviews/p17-review-2.md`. Dazu kamen `RentStep.svelte` (Bedingung des Absatzes), der Zustand `rent-taken-over` in `tests/e2e/tasks/accessibility.ts` und die Pfade in `tests/a11y/screens.json`, die `noticedContract` und `noticedApartment` verwenden.

Ergebnis: kein Blocker und kein Major. C-9 ist erledigt.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde. |

ponytail-review (Delta): Der Diff besteht aus einem Feld im Seed und einem optionalen Feld im Typ. Das ist das Minimum, um den Absatz in den Zustand zu bringen. Lean already. Ship.

## Geprüft und bestätigt

- **C-9 erledigt:** `seed.contract` breitet `...contract` nach dem Standardwert `additionalRent: '0'` aus. Damit kommen die 80.00 ans Backend, und die Route nimmt `additionalRent` als String an (`backend/src/routes/contracts.ts:41`). Im Zustand `rent-taken-over` (`?tenant={tenant}&apartment={noticedApartment}`, Wohnung 2.01) übernimmt der Assistent die Zusatzmiete aus Doras Mietvertrag. Dadurch ist `values.additionalRent` gesetzt, und `RentStep.svelte:33` zeigt den Absatz `contracts_rent_taken_over_additional`. Der Task wartet auf `contract-rent-taken-over`. Der Absatz wird im selben Render-Durchgang angezeigt, axe und die Sprachprüfung sehen ihn also.
- **Keine Nebenwirkung auf andere Prüfungen:** `seedFor` in `screens.ts` wird nur von den Accessibility- und Sprachschritten verwendet (`accessibility.steps.ts`, `language.steps.ts`, `tasks/accessibility.ts`). Kein Fach-Szenario prüft Beträge aus diesen Seed-Daten. Die übrigen Zustände auf `/contracts/{noticedContract}` und `/edit` sowie die Tank-Vorschau für Bergsicht zeigen höchstens einen anderen Betrag an. Keiner dieser Zustände prüft einen Betrag.
- **Formatierung:** `bunx prettier <datei> | diff` zeigt für beide Fixture-Dateien keinen Unterschied.
- **Rote Tests:** Es gibt keinen neuen Test. Die Änderung erweitert die Testdaten eines bestehenden Zustands, ein roter Lauf ist dafür nicht nötig.
- **Nichts Fremdes im Delta:** Der kopierte Bericht aus Runde 2 gehört zum Ablauf.

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint ohne Befund, check mit 0 Fehlern, E2E chromium mit den axe- und Sprachzeilen der Mietvertrags- und Abrechnungsbildschirme (112 bestanden). Ich habe keinen dieser Läufe wiederholt (E2E ist mir untersagt). Dass der Absatz im Zustand `rent-taken-over` wirklich erscheint, habe ich nur durch Lesen von `RentStep.svelte` und der Seed-Daten beurteilt, nicht im Browser.
- C-10 (Nit, Runde 2) ist durch dieses Delta nicht berührt und bleibt offen wie berichtet.
