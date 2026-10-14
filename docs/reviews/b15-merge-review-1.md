# Code-Review B-15 Merge, Runde 1

Anforderung: Issue #152 (Variante a: Mieter und Wohnung eines bestehenden Mietvertrags stehen fest; das Bearbeitungsformular nennt sie mit Hilfe, das Backend lehnt einen anderen Mieter oder eine andere Wohnung mit `CONTRACT_PARTIES_FIXED` ab), zusammengeführt mit dem B-13-Fix (#143, #151) von `main`.
Bereich: `git diff 2efcd56..HEAD` (5c93452, 8329e23, 3d0e1ba; die beiden letzten ändern nur `docs/reviews/b15-instruktionen-pruefung.md`).
Schwerpunkt: Zusammenführung in `ContractForm.svelte`, `ContractWizard.svelte`, die angepassten und entfernten #151-Tests, die E2E-Dateien und das Entfernen von U-19.

## Blocker

Keine.

## Major

### M-1 «Erneut versuchen» lässt den Fokus auf die Seite fallen (#151-Verhalten verloren)

`src/routes/contracts/ContractForm.svelte:64`, `:84`, `:96-101`, `:209-213`

`unknown` ist jetzt nur noch `contractsState === 'failed'`. `loadContracts()` setzt `contractsState = 'loading'` synchron, bevor es auf die Antwort wartet. Darum verschwindet der Hinweis `{#if unknown}` mit dem Knopf «Erneut versuchen» sofort beim Klick, und der Fokus fällt auf `<body>`. Scheitert der Versuch wieder, kommen Hinweis und Knopf zurück, aber `retried(true, …)` setzt nur den Toast und keinen Fokus: Die Tastatur- oder Screenreader-Nutzerin steht am Seitenanfang. Ausserdem steht der Hinweis in einem `role="status"`: Er verschwindet und erscheint neu, wird also bei jedem Versuch noch einmal vorgelesen, zusätzlich zum Fehler-Toast.

Auf `main` (2efcd56) blieb `unknown` während des Versuchs wahr, weil `availability.get(apartmentId) === null` bis zum Ende von `loadAvailability()` galt. Der Knopf blieb im DOM und behielt den Fokus, auch bei einem erneuten Fehler. Der Assistent verhält sich weiter so (`ContractWizard.svelte:99-110`: die alte Map gilt, bis die neue da ist). Die #151-Tests beschreiben das Ziel selbst: «the focus does not fall to the page» (`src/__tests__/contract-edit.dom.test.ts`, describe «nach «Erneut versuchen»»). Geprüft ist bisher aber nur der Fall, in dem das Laden klappt.

Nachweis (in einer Kopie im Scratchpad ausgeführt, nicht im Repo): ein DOM-Test mit `fakeBff(() => [500, {}])`, `open()`, `byTestId('contracts-retry').focus()`, `click('contracts-retry')`, `settle()`. Danach `expect(document.activeElement).toBe(byTestId('contracts-retry'))`:
- HEAD: schlägt fehl, der Fokus liegt auf `BODY`, schon während des Ladens und auch danach (der Hinweis ist wieder da).
- 2efcd56 (`main`), gleicher Test mit `tenants`/`apartments`: grün, der Fokus bleibt auf `contracts-retry`.

Vorschlag: den Hinweis während eines erneuten Versuchs stehen lassen (z. B. `'failed'` erst bei einer erfolgreichen Antwort verlassen, wie die Map im Assistenten) und den obigen Test ergänzen. Dann sind wieder mehrere Klicks während des Ladens möglich. Der Anfragezähler (siehe m-1) wird dann wieder gebraucht, und dafür braucht es einen Test für eine überholte Antwort (der frühere Fall von U-19).

## Minor

- m-1 `src/routes/contracts/ContractForm.svelte:83,86,98`: Der Zähler `contractsRequest` und die Abfrage «overtaken by a newer request» können im jetzigen Stand nicht greifen. Es gibt nur eine Wohnung, `$effect` lädt einmal, und der Knopf verschwindet während des Ladens. Mit der Korrektur von M-1 werden sie wieder gebraucht, sonst entfernen.
- m-2 `src/__tests__/contract-edit.dom.test.ts:223-235`: «meldet nichts, solange die Mietverträge noch laden» prüft nur, dass eine nie beantwortete Anfrage nichts meldet, und ist damit trivial grün. Der Kommentar «after the second one has started» beschreibt einen zweiten Versuch, den der Test nicht macht. Den Fall R2-2 (überholter Versuch) deckt der Test nicht mehr ab.

## Nit

- n-1 `src/routes/contracts/new/ContractsUnknown.svelte:17`: Der Kommentar spricht von «The chosen apartment's contracts». Im Bearbeitungsformular wird die Wohnung nicht mehr gewählt (Datei nicht im Diff, nur zur Kenntnis).

## Geprüft und in Ordnung

- `ContractForm.svelte`: Hinweis `apartment-contracts-unknown` mit genau einem «Erneut versuchen» unter «Mieter und Wohnung`, in `role="status"`. Der Hinweis beim Vertragsbeginn (`start-contracts-unknown`) bleibt ohne Knopf und verweist nach oben. Die Prüfung auf Überschneidung schliesst den eigenen Mietvertrag weiter aus (`overlapWarning(…, contract.id)`). «Entwurf löschen und speichern» bleibt gesperrt, solange die Mietverträge nicht geladen sind (`:164`). Nach einem erfolgreichen Laden geht der Fokus auf `startDate`; das Feld existiert (`PeriodStep.svelte`, `DateInput id="startDate"`), und ein Test deckt es ab.
- Kein `min` beim Vertragsbeginn: Das entspricht `main`, wo `availableFrom(…, false)` für die eigene Wohnung auch kein `min` gab. `availableFrom` und `computeAvailability` haben ohne den Parameter für den eigenen Mietvertrag keine weiteren Aufrufer (`ContractWizard.svelte:73,76`, per grep geprüft).
- Entfernte #151-Tests: «wenn nur eine der beiden Anfragen scheitert» (es gibt nur noch eine Anfrage), Wechsel der Wohnung und «nur die letzte Antwort» (die Wohnung lässt sich nicht mehr wechseln). Die Entfernung ist begründet.
- Die E2E-Szenarien #143/#151 in `tests/e2e/features/contract-edit.feature:55-77` sind unverändert und passen weiter zu den Test-IDs. Für `contracts-unknown` im Formular bleibt der Zustand in `tests/e2e/tasks/accessibility.ts:182-186`. `questions/contract-form.ts` und `steps/contract-form.steps.ts` sind sauber zusammengeführt: Fragen geben Werte zurück, das Prüfen ohne Auswahl hat zuerst einen positiven Anker (die Namen), und die Schritte rufen nur Fragen auf.
- U-19 entfernt: Den Grund (`loadAvailability` ohne Zähler) gibt es nicht mehr. Die Nummern U-20/H-21 sind eindeutig, ohne Kollision in `docs/design/offene-punkte.md`.
- `contracts_tenant_help_short` ist aus allen vier `messages/*.json` entfernt und wird nicht mehr verwendet (grep in `src`, `tests/e2e`).

## Nicht bestätigt

- E2E und `bun run test:coverage`, `lint`, `check` sowie die Backend-Tests habe ich nicht ausgeführt. Ausgeführt habe ich nur den Fokus-Nachweis für M-1 in einer Kopie im Scratchpad.
- Die Bildschirmleser-Ausgabe beim zweiten Erscheinen des Hinweises (doppelte Ansage) habe ich aus dem Code abgeleitet, nicht mit einem Screenreader geprüft.
- Inhalt, Fachbegriffe und Übersetzungen der neuen B-15-Texte habe ich nicht erneut geprüft. Sie waren Gegenstand von `b15-review-1..3` und `b15-fachreview-1..3`; der Schwerpunkt dieser Runde ist die Zusammenführung.
