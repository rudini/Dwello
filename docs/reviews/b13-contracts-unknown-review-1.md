# Code-Review B-13 (#143), Runde 1

Branch `claude/b13-contracts-unknown`, Bereich `8e229d4..HEAD`. HEAD ist `0c569b8`. Das ist der umformulierte Commit
`ae11b0c` mit identischem Baum (`git diff ae11b0c 0c569b8` ist leer). Betreff «fix(contracts): unloaded apartment is not free»
(46 Zeichen) hält die Commit-Regel ein.

Alle 21 geänderten Dateien sind gelesen. Gelaufen sind `bunx vitest run` für `contract-edit.dom.test.ts` und
`contract-wizard.dom.test.ts` (54 grün) sowie `eslint --max-warnings 0` für die geänderten `.ts`- und `.svelte`-Dateien (sauber).

## Blocker/Major

Keine.

Die Anforderung ist erfüllt:

- **Hinweise:** Im Wizard (`ContractWizard.svelte:69-80`) und im Formular (`ContractForm.svelte:74`) zeigen die Wohnungswahl und der
  Vertragsbeginn `contracts_apartment_contracts_unknown`. Der Text existiert in allen vier `messages/*.json` (Zeile 1269).
- **Keine Untergrenze, kein «frei ab»:** Eine Wohnung, deren Mietverträge nicht geladen werden konnten, fehlt in `availability`.
  Daher liefert `availableFrom` weder `min` noch einen Hinweis, und der Wizard schlägt keinen Beginn vor (`suggestedStartDate(undefined)`).
- **Tests:** DOM-Tests in beiden Dateien. Szenarien in `contract-new.feature` und `contract-edit.feature`, ohne `@wip`, mit
  `Scenario red` im Plan.
- **a11y- und Sprachzustände:** Der Zustand `contracts-unknown` ist in `screens.json`, `accessibility.feature` und
  `sprachen-bildschirme.feature` eingetragen.
- **Fehlschlagende Anfrage:** `FailRequests` liegt in `tests/e2e/screenplay/interactions.ts:130`, antwortet nur mit 500 und
  erfindet keine Daten.
- **Screenplay-Schichten:** Die Steps rufen nur Tasks und Questions auf. Die Questions liefern Texte (`Text.of`).

## Minor

- M1 `src/routes/contracts/ContractForm.svelte:74` und `:97-106`: Im Formular kommen «unbekannt» und die Untergrenze aus zwei
  getrennten Anfragen für dieselbe Wohnung. `unknown` hängt an `contractsState`, `startLimit` an `availability`. Wenn nur eine
  davon fehlschlägt, entstehen Widersprüche:
  - Schlägt nur die `availability`-Anfrage fehl, wirkt die Wohnung frei (kein Hinweis, kein `min`). Das ist der ursprüngliche Fehler.
  - Schlägt nur die andere fehl, stehen der Hinweis und «frei ab» samt `min` nebeneinander.

  Der Wizard leitet beides aus einer Map ab. Das Formular könnte `unknown` ebenso aus der Map ableiten, wenn sie Einträge mit
  `null` behält. Nachweis: im DOM-Test `fakeBff` die erste `=a2`-Anfrage mit 500 und die zweite mit 200 beantworten.
- M2 `src/lib/contract-form.ts:149` und `src/lib/contract-wizard.ts:177-186`: In der Auswahlliste trägt eine Wohnung mit
  unbekannten Mietverträgen dieselbe Beschriftung wie eine freie (nur der Name). Der Hinweis erscheint erst nach der Wahl.
- M3 `src/routes/contracts/new/ApartmentStep.svelte:43-49` und `PeriodStep.svelte:81-87`: `Alert tone="caution"` hat keine
  Live-Region (`Alert.svelte:25`). Der Hinweis erscheint nach dem Wechsel der Wohnung oder nach dem asynchronen Laden im Formular,
  ein Screenreader liest ihn aber nicht vor. Er ist auch nicht per `aria-describedby` mit dem Feld verbunden. Der Hinweis zur
  Vergangenheit direkt darunter steht absichtlich in `role="status"` (`PeriodStep.svelte:89-90`).
- M4 `src/__tests__/contract-edit.dom.test.ts:118-119`: Der neue Test steht zwischen dem Kommentar «wie beim Beenden: ein Tippfehler im
  Jahr …» und dem `describe`, zu dem dieser Kommentar gehört (`:142`). Der Kommentar steht jetzt über dem falschen Test.
- M5 `tests/e2e/tasks/accessibility.ts:178`: `FailRequests.to('/api/contracts', {})` lässt alle Anfragen für Mietverträge scheitern.
  `docs/test-pyramid.md:30` erlaubt aber «that one request». Für den Zustand würde die Anfrage der vorgewählten Wohnung genügen.

## Nit

- N1 `src/lib/contract-form.ts:110-116`: `contracts?: unknown` wird durch `Array.isArray` zu `any[]`, die Typprüfung der Felder
  (`c.startDate` …) geht verloren. Vorher war die Liste typisiert.
- N2 `src/__tests__/contract-wizard.dom.test.ts:246-247` und `contract-edit.dom.test.ts:137-139`: Die Prüfungen «kein Beginn
  vorgeschlagen» und `min === ''` wären auch vor dem Fix grün gewesen, denn die gescheiterte Wohnung galt als frei. Den Fehler
  zeigen nur die Prüfungen der `testid`s.
- N3 `implementation_plan.md`: «Remove @wip» ist nicht abgehakt, die Szenarien sind aber schon ohne `@wip` committet.
- N4 `src/lib/contract-form.ts:107-108`: Die Herkunftsangabe «(Haiku review)» im API-Kommentar ist Rauschen.

## Nicht bestätigt

- **E2E-Szenarien grün:** Weder `bun run test:e2e` noch die a11y- und Sprachzustände `contracts-unknown` sind gelaufen, weil das
  Build- und `.features-gen`-Artefakte im Arbeitsbaum erzeugt. Gelesen: Features, Steps, Tasks, Targets, Questions und
  `interactions.ts`. Offen bleibt, ob der Zustand `contracts-unknown` im Wizard nach `Navigate.reload` und
  `Click.on(nextButton)` sicher auf Schritt 2 landet (`tasks/accessibility.ts:178-181`).
- **Gesamtprüfungen:** `bun run check`, `bun run test:coverage`, die Backend-Tests und `deepcheck:audit` sind nicht gelaufen.
- **Fehlender Eintrag im Plan:** Die Persona-Reviews (Helga, Sven) stehen im Plan noch offen. Das ist kein Mangel dieses Slices.
