# Code-Review B-13 Retry (#151), Runde 3

Gegenstand: Delta `git diff d3a657c..HEAD` (Commits `a9bc706`, `fa36743`) auf `claude/b13-contracts-unknown`. Geprüft habe ich, ob die Befunde aus Runde 2 (`docs/reviews/b13-retry-review-2.md`) so gelöst sind, wie `implementation_plan.md` («Findings code review #151 round 2») es angibt. Dazu habe ich die beiden Ablehnungen bzw. Teil-Lösungen beurteilt (R2-3, R2-5).

Gelesen habe ich alle 15 geänderten Dateien des Deltas. Zum Umfeld gelesen: `ContractForm.svelte` (`unknown`, `loadAvailability`, `loadChosen`, `deleteDraftAndSave`), `ContractWizard.svelte` (`onMount`, `loadContracts`), `ContractsUnknown.svelte`, `addToast` in `src/lib/stores.ts` (Fehler-Toasts bleiben stehen, `duration = 0`), `Actor.sees` (`expect.poll`), die Task `chooseTenant` und die vier Message-Dateien. `bunx vitest run` mit `contract-edit.dom.test.ts`, `contract-wizard.dom.test.ts` und `contract-form.test.ts` läuft durch: 80 bestanden.

| ID | Schwere | Befund |
|---|---|---|
| R3-1 | Minor | Formular: `loadAvailability` ist nicht gegen eine überholte Antwort geschützt. Bei einem Doppelklick kann eine späte Fehlantwort den Hinweis zurückbringen und nach «geladen» noch «wieder nicht geladen» melden |
| R3-2 | Nit | Der Schritt «meldet Dwello {string}» liest nur den Fehler-Toast, obwohl der Name allgemein klingt |

## Befunde aus Runde 2

| ID | Plan sagt | Urteil |
|---|---|---|
| R2-1 Major | behoben (zwei Szenarien, DOM-Tests) | **Behoben.** `contract-new.feature:68-73` prüft das Label der Option als Wert (`apartmentChoiceLabel`, `Text.of`, mit `expect.poll`). `contract-edit.feature:73-77` prüft den Text des Fehler-Toasts. Beide sind ohne `@wip`, und der Plan notiert `Scenario red: …` (`implementation_plan.md:37-38`). Die Verdrahtung im Assistenten deckt jetzt `contract-wizard.dom.test.ts:252` ab. Die Schritte rufen nur Tasks und Questions auf, und die neue Task `retryContractsInVain` wartet auf den Zustand, zu dem sie führt (`errorToast`). |
| R2-2 Minor | behoben (Test zuerst) | **Behoben für den beschriebenen Fall.** `ContractForm.svelte:135` schweigt, solange eine neuere Anfrage lädt. Ohne die Zeile gäbe es in `contract-edit.dom.test.ts:192-204` einen Erfolgs-Toast, weil `availability.get('a2')` nicht `null` ist. Der Test ist also aussagekräftig. Die verwandte Lücke über `loadAvailability` bleibt offen, siehe R3-1. |
| R2-3 Minor | teilweise: Fehler-Toast im Zustand `contracts-unknown`, Erfolgs-Toast nicht | **Teil-Lösung angenommen.** Der Zustand klickt jetzt «Erneut versuchen» und wartet auf `errorToast` (`tests/e2e/tasks/accessibility.ts:185-186`). Weil Fehler-Toasts stehen bleiben, ist das stabil. Der Erfolgs-Toast nutzt dieselbe Komponente. Seinen Text `contracts_apartment_contracts_loaded` habe ich in fr/it/en von Hand geprüft: übersetzt und ohne Deutsch. Ein eigener Zustand würde nur wenig dazu beitragen. |
| R2-4 Nit | behoben (Test zuerst) | **Behoben im Assistenten.** Der Zähler `loads` (`ContractWizard.svelte:98-104`) lässt nur die letzte Ladung gelten, und `retry()` schweigt bei einer überholten Ladung. `contract-wizard.dom.test.ts:293-317` zeigt beides. Im Formular fehlt der gleiche Schutz, siehe R3-1. |
| R2-5 Nit | abgelehnt: die Meldung sagt noch, was als Nächstes zu tun ist | **Ablehnung angenommen.** Der Text `contracts_delete_draft_contracts_unknown` lautet «… Wählen Sie bei der Wohnung «Erneut versuchen» und danach noch einmal «Entwurf löschen und Mietvertrag speichern».» Nach dem Erfolg ist der erste Teil erledigt, der zweite gilt weiter, und die Schaltfläche bleibt (R-1). Ausserdem bestätigt der neue Erfolgs-Toast den ersten Teil. |
| R2-6 Nit | behoben | **Behoben** (`contract-wizard.dom.test.ts:281-291`: Fehler-Toast, der Hinweis bleibt). |

## Blocker / Major

Keine.

## Minor / Nit

- R3-1 (Minor) `src/routes/contracts/ContractForm.svelte:106-109, 75-77, 133-137`: `loadAvailability` schreibt `availability` ohne Zähler. Im Formular hängt `unknown` auch an `availability.get(id) === null`. Ein Beispiel bei einem Doppelklick auf «Erneut versuchen» (die Schaltfläche hat kein `busy`): Die Verfügbarkeit des ersten Versuchs scheitert langsam, der zweite gelingt. Dann meldet der zweite «geladen» und setzt den Fokus. Danach überschreibt die späte Antwort `availability`, und weil `contractsState` jetzt `'loaded'` ist, meldet der erste Versuch «wieder nicht geladen», und der Hinweis kommt zurück. Das ist derselbe Fehler wie R2-4, nur im Formular. Nachweis: ein DOM-Test wie `contract-wizard.dom.test.ts:293-317` für `contract-edit` mit `/contracts?apartmentId=` (erster Versuch langsam und 500, zweiter 200). Erwartet wird, dass nach `releaseFirst()` kein Hinweis und kein Fehler-Toast erscheint. Ohne Zähler in `loadAvailability` wird der Test rot. Dazu kommt eine Nebenwirkung: Endet die neuere Anfrage vor dem überholten Versuch, melden beide Versuche, und es erscheinen zwei Toasts.
- R3-2 (Nit) `tests/e2e/steps/contract-form.steps.ts:282-284`: Der Name «meldet Dwello {string}» klingt allgemein, liest aber nur `errorToast`. Wer den Schritt später für eine Erfolgsmeldung nutzt, scheitert ohne klaren Grund. Besser wäre ein Name wie «meldet Dwello den Fehler {string}».

## Bestätigt

- Die Eingabe bleibt erhalten: Auch die neuen Zeilen in `retry()` und `loadContracts()` berühren `values` nicht.
- `onMount` ruft `loadContracts()` weiterhin ohne `await` auf. Der Rückgabewert `boolean` wird dort zu Recht ignoriert. Die erste Ladung zählt beim Zähler mit, und das ist richtig.
- Texte: Das Delta bringt keine neuen Message-Schlüssel. Der Szenariotext «Die Mietverträge der Wohnung konnten wieder nicht geladen werden.» ist ein Präfix von `contracts_apartment_contracts_retry_failed`.
- Features: Fachsprache ohne «klickt», «Button» oder «Feld». Die bestehenden Szenarien bleiben unverändert.
- `screens.json`: Die Beschreibung von `contracts-unknown` passt zum geänderten Zustand. Einen neuen Zustand gibt es nicht, also brauchen `accessibility.feature` und `sprachen-bildschirme.feature` keine neue Zeile.
- Die Änderungen an `docs/reviews/b13-instruktionen-pruefung.md` halten den Prozess dieser Aufgabe fest und gehören dazu. Das Delta enthält keine Umformatierung von fremdem Code.

## Nicht bestätigt

- Ob der Zustand `contracts-unknown` auf der Bearbeitungsseite die Schaltfläche `contracts-retry` eindeutig findet: Dort gibt es zwei Hinweise, aber nur einer hat `onretry`. Das habe ich aus `ContractsUnknown.svelte` gefolgert und nicht im Browser gesehen. Der Aufrufer meldet die sechs Zeilen als grün.
- Ob das Szenario «Wohnung mit nicht geladenen Mietverträgen ist nicht geprüft» rot würde, wenn nur die Darstellung im Formular kaputt wäre. Es läuft nur im Assistenten. Das Formular nutzt dieselbe `ApartmentStep`-Komponente, die Map mit `null` stützt der Test zu M1 aus #143. Die Szenarien habe ich nicht selbst ausgeführt.
