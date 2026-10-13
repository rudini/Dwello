# Code-Review B-13 Retry (#151), Runde 1

Gegenstand: `git diff e9ec9ed..b5ede33` (Branch `claude/b13-contracts-unknown`), Anforderung #151: Lassen sich die Mietverträge der Wohnung im Assistenten oder im Bearbeitungsformular nicht laden, bietet der Hinweis «Erneut versuchen» an. Die Schaltfläche lädt sie ohne Neuladen der Seite nochmals, und die Eingaben bleiben erhalten. Der Text nennt, was ungeprüft ist und was zu tun ist (Wortlaut aus `docs/reviews/b13-retry-fachreview-1.md`).

Gelesen habe ich alle 21 geänderten Dateien sowie das Umfeld in `ContractForm.svelte`, `ContractWizard.svelte`, `Alert.svelte`, `Button.svelte`, `tests/e2e/screenplay/{interactions,actor,questions}.ts`, `tests/e2e/tasks/accessibility.ts` und `tests/a11y/screens.json`. `bunx vitest run src/__tests__/contract-edit.dom.test.ts src/__tests__/contract-wizard.dom.test.ts` läuft durch (59 bestanden).

| ID | Schwere | Befund |
|---|---|---|
| R-1 | Major | Die neue Ablehnung «Entwurf nicht gelöscht» verlangt einen Schritt, den es nicht mehr gibt |
| R-2 | Minor | Nach erfolgreichem «Erneut versuchen» verliert die Tastatur den Fokus |
| R-3 | Minor | Scheitert «Erneut versuchen» noch einmal, ändert sich nichts Sichtbares |
| R-4 | Minor | Das Szenario prüft «Eingabe bleibt», bevor die Mietverträge nachgeladen sind |
| R-5 | Nit | `FailRequests.noLonger` hebt alle Routen auf; der Schritt ignoriert den Parameter Wohnung |
| R-6 | Nit | `enteredBaseRent` wird mit `toContain` statt mit Gleichheit geprüft |
| R-7 | Nit | Mehrfaches Klicken im Assistenten: Antworten ohne Reihenfolgeschutz |

## Blocker / Major

### R-1 (Major): Die Ablehnung «Entwurf nicht gelöscht» nennt eine Schaltfläche, die dabei verschwindet

**Stelle:** `messages/*.json` (neuer Schlüssel `contracts_delete_draft_contracts_unknown`, de: «… Wählen Sie bei der Wohnung «Erneut versuchen» und danach noch einmal «Entwurf löschen und Mietvertrag speichern».»), angezeigt über `src/routes/contracts/ContractForm.svelte:184`.

**Warum falsch:** Im selben Zweig von `deleteDraftAndSave` setzt `ContractForm.svelte:192` `refused = []`. Die Schaltfläche `delete-draft-and-save` steht nur unter `{#if refused.length}` (`ContractForm.svelte:276`) und ist nach dieser Ablehnung also weg. Ein erfolgreiches «Erneut versuchen» bringt sie auch nicht zurück, und die rote Meldung mit der Aufforderung bleibt stehen (`errors.form` wird beim Nachladen nicht zurückgesetzt). Der Vermieter sucht eine Schaltfläche, die es nicht gibt. Tatsächlich muss er zuerst nochmals «Mietvertrag speichern» wählen; erst die nächste Ablehnung des Backends zeigt das Angebot wieder an. Der Text ist neu in diesem Diff und soll laut #151 sagen, «was zu tun ist».

**So zeigt sich der Fehler:** Im bestehenden DOM-Test `löscht keinen Entwurf, wenn die Mietverträge der Wohnung nicht geladen werden konnten` (`src/__tests__/contract-edit.dom.test.ts:286-299`) nach `click('delete-draft-and-save'); await settle();` die Zeile `expect(byTestId('delete-draft-and-save')).toBeNull()` ergänzen. Der Test bleibt grün, die genannte Schaltfläche ist also nicht mehr da. Danach `click('contracts-retry'); await settle();` mit nun erfolgreichen Mietverträgen: `form-error` zeigt weiterhin denselben Text, und `delete-draft-and-save` bleibt `null`.

**Korrektur (eine der beiden):** In diesem Zweig `refused` behalten (nur beim Fall Überschneidung leeren), damit das Angebot neben der Meldung stehen bleibt. Oder den Text auf «… und danach noch einmal «Mietvertrag speichern»» ändern, in allen vier Sprachen, mit Rückfrage beim `fach-reviewer`, weil der Wortlaut aus dessen Review stammt. Zuerst braucht es einen Test, der scheitert.

## Minor / Nit

- R-2 (Minor) `src/routes/contracts/new/ContractsUnknown.svelte:36`: Nach erfolgreichem Nachladen verschwindet der Hinweis samt der fokussierten Schaltfläche, und der Fokus fällt auf `body`. Das betrifft den Assistenten (Schritte 2, 3, 5) und die Bearbeitungsseite. Weder ein Test noch axe deckt das ab.
- R-3 (Minor) `ContractForm.svelte:240`, `ContractWizard.svelte:276-283`: Scheitert die erneute Anfrage, bleibt der Hinweis unverändert stehen, ohne `busy` und ohne Rückmeldung. Für ungeübte Nutzer sieht das aus, als hätte der Klick nichts bewirkt. Die Persona Helga sollte das prüfen.
- R-4 (Minor) `tests/e2e/features/contract-edit.feature:68-70`: «Dann ist die Nettomiete "980" noch eingetragen» trifft schon vor dem Klick zu. Diese Prüfung läuft also, bevor die Mietverträge nachgeladen sind, und ist kein Anker für den Zustand danach. Die Prüfungen «keinen Hinweis mehr» sollten zuerst stehen, oder `retryContracts` wartet, bis der Hinweis verschwunden ist.
- R-5 (Nit) `tests/e2e/screenplay/interactions.ts:141`, `tests/e2e/steps/contract-form.steps.ts:544`: `unrouteAll()` hebt jede Route auf, nicht nur die der Wohnung, und der Schritt nimmt `_apartment` entgegen, ohne es zu verwenden.
- R-6 (Nit) `tests/e2e/steps/contract-form.steps.ts:553`: `toContain('980')` würde auch «9800» gelten lassen. Für einen Feldwert passt `toBe`.
- R-7 (Nit) `src/routes/contracts/new/ContractWizard.svelte:101-104`: Bei schnell wiederholtem «Erneut versuchen» darf eine ältere Antwort eine neuere überschreiben. Das Formular schützt sich davor mit `contractsRequest`, der Assistent nicht.

## Bestätigt

- Bearbeitungsformular: `attempt` löst beide Effekte erneut aus (`ContractForm.svelte:108`, `:117`). `values` bleibt unberührt. Der Hinweis bleibt während des Ladens stehen, weil `availability` erst mit der neuen Antwort ersetzt wird. Belegt durch den DOM-Test `contract-edit.dom.test.ts:151-167` und das Szenario `contract-edit.feature:62-71` (ohne `@wip`, «Scenario red» steht im Plan).
- Assistent: `loadContracts` ersetzt nur `contracts`, die Eingaben bleiben erhalten. Belegt durch `contract-wizard.dom.test.ts:256-272`: Beginn bleibt, frühester Beginn neu 2100-01-01.
- Pro Seite gibt es eine einzige Schaltfläche: Auf der Bearbeitungsseite zeigt der Hinweis beim Vertragsbeginn ohne `onretry` nur einen Verweis (DOM-Test prüft `contracts-retry` mit Anzahl 1). Im Assistenten zeigt jeder Schritt höchstens einen Hinweis.
- Texte: Alle fünf neuen bzw. geänderten Schlüssel stehen in allen vier `messages/*.json` und entsprechen wörtlich dem Fachreview. Der alte Text kommt in Tests und Szenarien nicht mehr vor.
- Design: `Button` (min-h-12, `type="button"`, löst also im `<form>` kein Absenden aus), `Alert` mit `action`, Icon `refresh` vorhanden. Keine rohen Farben oder Klassen.
- E2E-Schichten: Die Schritte rufen nur Tasks und Questions auf. Die neue Route-Aktivität liegt in `tests/e2e/screenplay/`. Die Feature-Sprache beschreibt das Was, nicht das Wie.
- `screens.json`: Die Zustände `contracts-unknown` (Assistent und Formular) und `contracts-unknown-review` decken den Hinweis mit Schaltfläche ab. Ein neuer Zustand kommt nicht hinzu.
- Im Diff steht nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Ob die DOM-Tests ohne den Code rot waren, habe ich nicht ausgeführt, weil der Arbeitsbaum unverändert bleiben sollte. Gefolgert habe ich es aus dem Code: Ohne `contracts-retry` kann `click('contracts-retry')` nicht gelingen.
- Ob axe eine Schaltfläche im Schritt «Zeitraum» des Assistenten prüft: `tests/e2e/tasks/accessibility.ts:180-198` erreicht nur Schritt 2 und Schritt 5. Der Schritt 3 verwendet dieselbe Komponente, deshalb ist das nicht tragend.
- Fokusverhalten und Rückmeldung (R-2, R-3) mit echtem Screenreader und echter Tastatur: nur aus dem Code gefolgert.
