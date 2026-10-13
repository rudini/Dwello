# Code-Review B-13 (#143), Runde 2

Branch `claude/b13-contracts-unknown`, Delta `0c569b8..ef75bb4` (ein Commit, «fix(contracts): address review of B-13 slice»,
44 Zeichen). Alle neun geänderten Dateien sind gelesen. Gelaufen: `bunx vitest run` für `contract-edit.dom.test.ts` und
`contract-wizard.dom.test.ts` (56 grün), `eslint --max-warnings 0` für die geänderten `.ts`- und `.svelte`-Dateien (sauber).

## Blocker/Major

Keine.

## Befunde aus Runde 1

- **M1 behoben.** `ContractForm.svelte:74-77` leitet «unbekannt» jetzt auch aus der fehlenden Wohnung in `availability` ab.
  `:80` gibt bei «unbekannt» `undefined` an `availableFrom`, also weder `min` noch «frei ab». Beide Teilfehler sind getestet
  (`contract-edit.dom.test.ts:145-170`). `chooseA2(1)` lässt die Verfügbarkeitsanfrage scheitern. Vor dem Fix fehlte der Hinweis,
  weil `contractsState` `loaded` war. `chooseA2(2)` lässt die Anfrage der gewählten Wohnung scheitern. Vor dem Fix stand dann
  «frei ab 2100» neben dem Hinweis. Beide Tests zeigen also den Fehler. Den Rotlauf habe ich nur aus dem Code abgeleitet, nicht
  ausgeführt (siehe unten). Die Reihenfolge der `=a2`-Anfragen stimmt: Der Effekt für `availability` (`:106-110`) läuft beim
  Mounten, die Anfrage der gewählten Wohnung erst nach dem Wechsel (`:113-124`).
- **M2 als offene Arbeit erfasst.** U-15 in `docs/design/offene-punkte.md:23`. Es geht um Bedienbarkeit, also gehört der Punkt
  nach `CLAUDE.md` zu den nicht-funktionalen Punkten in `offene-punkte.md`. Die Zeile nennt Ort und nächsten Schritt.
- **M3 behoben.** Beide Hinweise stehen jetzt in einem `role="status"`, der immer im DOM ist (`ApartmentStep.svelte:43-52`,
  `PeriodStep.svelte:81-90`). Das ist geprüft in `contract-edit.dom.test.ts:139-141` und `contract-wizard.dom.test.ts:252-253`.
  Ausserhalb der DOM-Tests liest kein Test und kein Target den Text von `start-date-notice`. Der zusätzliche Inhalt bricht
  deshalb nichts.
- **M4 behoben.** Der Kommentar steht wieder über `describe('Vertragsende in der Vergangenheit')` (`contract-edit.dom.test.ts:172`).
- **M5 zu Recht abgelehnt.** `FailRequests` antwortet nur mit 500 und erfindet keine Daten (`interactions.ts:135-141`).
  Formular und Wizard holen die Mietverträge pro Wohnung über denselben Endpunkt (`ContractForm.svelte:96-97`,
  `ContractWizard.svelte:82-83`). Den Zustand erreichen beide Seiten nur über diese eine Art von Anfrage. Die Begründung trägt.
  Enger wäre ein Filter auf die vorgewählte Wohnung, aber das ist keine Regelverletzung.
- **N1 behoben.** `contract-form.ts:110` ist wieder typisiert, `Array.isArray` bleibt als Schutz zur Laufzeit.
- **N2 zu Recht abgelehnt.** Der Test als Ganzes scheitert vor dem Fix. Die zusätzlichen Prüfungen sichern das Verhalten gegen
  spätere Regressionen ab.
- **N3 behoben.** «Remove @wip» ist abgehakt (`implementation_plan.md:19`), «All checks» steht offen auf einer eigenen Zeile.
- **N4 behoben.** `contract-form.ts:107`.

## Minor

Keine.

## Nit

- N5 `src/routes/contracts/new/ApartmentStep.svelte:44`: Der leere `role="status"`-Container ist ein eigenes Flex-Element.
  Deshalb kommt im Wizard ein zusätzlicher `gap-6` dazu (`ContractWizard.svelte:228`), im Formular ein `gap-4` (`Panel.svelte:14`),
  auch wenn kein Hinweis da ist. `PeriodStep` folgt schon demselben Muster.

## Nicht bestätigt

- **Rotlauf der neuen Tests:** Die Tests für M1 und M3 sind nicht gegen den Stand `0c569b8` gelaufen, weil der Arbeitsbaum
  unverändert bleiben musste. Ihr Scheitern vor dem Fix ist nur aus dem Code abgeleitet (`ContractForm.svelte` bei `0c569b8`:
  `unknown = contractsState === 'failed'`; die Hinweise standen ausserhalb eines `role="status"`).
- **E2E, a11y und Sprachen:** Der Zustand `contracts-unknown` ist nicht gelaufen, weil Build und `.features-gen` Artefakte im
  Arbeitsbaum erzeugen. Der Wrapper `role="status"` ändert das DOM, das axe sieht. Gelesen habe ich `tests/a11y/screens.json:28`,
  `:211`, `:240` und `tests/e2e/tasks/accessibility.ts:176-181`.
- **Gesamtprüfungen:** `bun run check`, `bun run test:coverage`, die Backend-Tests und `deepcheck:audit` sind nicht gelaufen.
  Laut Plan sind sie ebenfalls noch offen (`implementation_plan.md:20`).
