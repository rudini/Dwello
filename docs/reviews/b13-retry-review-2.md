# Code-Review B-13 Retry (#151), Runde 2

Gegenstand: Delta `git diff b5ede33..d3a657c` (Commits `d1ef88b`, `d3a657c`) auf `claude/b13-contracts-unknown`. Geprüft habe ich, ob die Befunde aus Runde 1 (`docs/reviews/b13-retry-review-1.md`) so gelöst sind, wie `implementation_plan.md` es angibt, und ob die Persona-Korrekturen stimmen: Toast und Fokus nach «Erneut versuchen» sowie «(nicht geprüft)» in der Auswahl.

Anforderung (#151): Lassen sich die Mietverträge der Wohnung im Assistenten oder im Bearbeitungsformular nicht laden, bietet der Hinweis «Erneut versuchen» an. Die Schaltfläche lädt die Mietverträge ohne Neuladen der Seite nochmals, und die Eingaben bleiben erhalten. Der Hinweis nennt, was ungeprüft ist und was zu tun ist.

Gelesen habe ich alle geänderten Code-, Test- und Message-Dateien des Deltas, `offene-punkte.md` und `implementation_plan.md`. Die vier Persona-Berichte habe ich nur überflogen, denn sie sind Berichte und kein Code. Zum Umfeld gelesen: `ApartmentStep.svelte`, `ContractsUnknown.svelte`, `ContractWizard.svelte` (Abschnitt, `h2` mit `tabindex="-1"`), `contract-wizard.ts` (`apartmentChoices`), `availableFrom`, `tests/e2e/screenplay/interactions.ts` (`FailRequests`), `tests/e2e/targets/form.ts`, beide Features und die Toast-Zustände in `tests/a11y/screens.json`. `bunx vitest run` mit `contract-form.test.ts`, `contract-edit.dom.test.ts` und `contract-wizard.dom.test.ts` läuft durch: 77 bestanden.

| ID | Schwere | Befund |
|---|---|---|
| R2-1 | Major | Zwei sichtbare neue Verhaltensweisen haben kein Szenario: «(nicht geprüft)» in der Auswahl und die Meldung, wenn der zweite Versuch scheitert. Im Assistenten ist die Verdrahtung von «(nicht geprüft)» gar nicht getestet |
| R2-2 | Minor | Formular: Ein überholter Versuch meldet «geladen», obwohl die Mietverträge noch laden |
| R2-3 | Minor | Die neuen Toasts sind in keinem Sprach- oder axe-Zustand |
| R2-4 | Nit | Die Begründung, mit der R-7 abgelehnt wurde, trägt nicht |
| R2-5 | Nit | Nach einem erfolgreichen Versuch bleibt die rote Meldung mit «Wählen Sie … «Erneut versuchen»» stehen, obwohl die Schaltfläche fehlt |
| R2-6 | Nit | Der Fall «scheitert wieder» (Fehler-Toast) ist nur im Formular getestet, nicht im Assistenten |

## Befunde aus Runde 1

| ID | Plan sagt | Urteil |
|---|---|---|
| R-1 Major | behoben (Test zuerst) | **Behoben.** `ContractForm.svelte:202` leert `refused` nur noch bei einer Überschneidung. `contract-edit.dom.test.ts:334` verlangt, dass `delete-draft-and-save` nach der Ablehnung noch da ist. Mit dem alten `refused = []` wäre der Test rot. |
| R-2 Minor | behoben | **Behoben.** `retried()` setzt den Fokus nach dem Erfolg im Formular auf `#apartment` und im Assistenten auf das `h2` des Schritts (`tabindex="-1"`, `ContractWizard.svelte:238`). Belegt durch `contract-edit.dom.test.ts:168-175` und `contract-wizard.dom.test.ts:276`. |
| R-3 Minor | behoben (Fehler-Toast) | **Behoben** für das Formular (`contract-edit.dom.test.ts:177-185`). Den Assistenten deckt kein Test ab (R2-6), und ein Szenario fehlt (R2-1). |
| R-4 Minor | behoben | **Behoben.** `retryContracts` wartet jetzt auf `successToast` (`tests/e2e/tasks/contract-form.ts:40`). Erst danach prüft das Szenario die Nettomiete. Die Aufgabe wartet also auf den Zustand, zu dem sie führt. |
| R-5 Nit | abgelehnt: ein Szenario lässt nur eine Route scheitern | **Ablehnung angenommen.** Der Doc-Kommentar (`interactions.ts:140`) sagt «The requests …», also alle Routen. Der Schrittparameter `_apartment` bleibt ungenutzt, das ist hinnehmbar. |
| R-6 Nit | behoben (`toBe`) | **Behoben** (`contract-form.steps.ts:257`). |
| R-7 Nit | abgelehnt: beide Antworten laden dieselben Mietverträge | **Begründung trägt nicht**, siehe R2-4. Die Schwere bleibt Nit. |

## Blocker / Major

### R2-1 (Major): Neues sichtbares Verhalten ohne Szenario; Verdrahtung von «(nicht geprüft)» im Assistenten ungetestet

**Stellen:**
- `src/lib/contract-form.ts:141-142`: neues Label `contracts_option_unchecked`.
- `src/routes/contracts/new/ContractWizard.svelte:72-74`: Die Map behält jetzt `null` statt den Eintrag zu entfernen.
- `src/routes/contracts/ContractForm.svelte:99-108`: dasselbe im Formular.
- `src/routes/contracts/new/ContractsUnknown.svelte:5-9`: Fehler-Toast `contracts_apartment_contracts_retry_failed`.

**Warum falsch:** Beide Änderungen sieht der Vermieter direkt. W-01 war vorher der eigene offene Punkt U-15, und R-3/H10 betrifft einen eigenen Fehlerzustand. Laut `CLAUDE.md`, Workflow Schritt 1, braucht jede sichtbare Verhaltensänderung ein Szenario in `tests/e2e/features`, ohne `@wip`, mit `Scenario red: …` im Plan. Der Plan nennt für beide nur «(test first)» (`implementation_plan.md:40`, `:52`), und das Delta ändert kein Feature. Den Fehlerzustand erreicht nur eine scheiternde Browser-Anfrage. Er lässt sich mit `FailRequests.to` am Browser-Rand nachstellen, so wie es «Mietverträge der Wohnung lassen sich nicht laden» schon tut. Das Szenario ist also möglich.

Dazu kommt eine Lücke in den Tests: Für «(nicht geprüft)» gibt es nur den Unit-Test `contract-form.test.ts:168-173` auf `apartmentOption`. Im Assistenten hängt `unknown` an `contracts` (`ContractWizard.svelte:75`), nicht an `availability`.

**So zeigt sich der Fehler:** In `ContractWizard.svelte:73` das alte `flatMap(... list ? [[id, …]] : [])` wieder einsetzen. `bunx vitest run` mit `contract-form.test.ts`, `contract-wizard.dom.test.ts` und `contract-edit.dom.test.ts` bleibt grün (77/77), obwohl die Wohnung 2.01 in der Auswahl des Assistenten wieder wie eine freie aussieht. Ebenso: Die Meldung «konnten wieder nicht geladen werden» aus `retried()` entfernen. Kein E2E-Szenario wird rot.

**Korrektur:** Im Szenario «Mietverträge der Wohnung lassen sich nicht laden» (`contract-new.feature:55-59`) eine Zeile ergänzen, die das Label der Wohnung in der Auswahl als Wert prüft, etwa «Dann heisst die Wohnung "2.01" in der Auswahl "… (nicht geprüft)"». Dazu ein Szenario «Mietverträge lassen sich auch beim erneuten Versuch nicht laden», das die Fehlermeldung als Text prüft. Beide zuerst rot sehen und im Plan notieren.

## Minor / Nit

- R2-2 (Minor) `src/routes/contracts/ContractForm.svelte:134-137`: Wird `loadChosen` überholt, etwa durch einen Doppelklick auf «Erneut versuchen» oder einen Wechsel der Wohnung während des Ladens, löst sich das `Promise.all` des ersten Versuchs trotzdem auf. Dann ist `contractsState === 'loading'`, also `unknown === false`, und `retried` meldet «geladen» und verschiebt den Fokus, bevor die Antwort da ist. Scheitert die zweite Anfrage, folgt ein Fehler-Toast. Die Schaltfläche hat kein `busy`.
- R2-3 (Minor) `tests/a11y/screens.json`: Für die neuen Toasts (`contracts_apartment_contracts_loaded`, `…_retry_failed`) gibt es keinen Zustand wie `saved-toast`. Ihr fr/it/en-Text wird also in keinem `sprachen-bildschirme`-Lauf geprüft.
- R2-4 (Nit) `src/routes/contracts/new/ContractWizard.svelte:97-107`: Die Ablehnung von R-7 trägt nicht. Bei einer wackligen Verbindung, also genau dem Fall von «Erneut versuchen», kann die eine Antwort scheitern und die andere gelingen. Kommt die gescheiterte zuletzt an, erscheint der Hinweis wieder, obwohl schon ein Toast «geladen» kam.
- R2-5 (Nit) `src/routes/contracts/ContractForm.svelte:200`: Nach einem erfolgreichen Versuch bleibt `errors.form` mit «Wählen Sie bei der Wohnung «Erneut versuchen» …» stehen, die Schaltfläche ist aber verschwunden.
- R2-6 (Nit) `src/__tests__/contract-wizard.dom.test.ts:256-277`: Den Fall «scheitert wieder» (Fehler-Toast, der Fokus bleibt) prüft kein Test im Assistenten.

## Bestätigt

- Die Eingabe bleibt erhalten: `retry()` berührt `values` weder im Formular noch im Assistenten. `ContractForm.svelte:360-363` liest `values.apartmentId` nur ausserhalb von `untrack`. Die Umstellung von `attempt` auf direkte Aufrufe ändert das Verhalten des Effekts beim Wechsel der Wohnung nicht.
- `unknown` im Formular (`availability?.get(id) === null`) ist gleichwertig zum alten `!availability.has(id)`, solange die gewählte Wohnung in `apartments` steht. Eine leere Wahl ergibt `undefined` und keinen Hinweis.
- `availableFrom` und `suggestedStartDate` vertragen `null` (`contract-form.ts:158-173`). Die Typen sind konsistent, laut Aufrufer ist `bun run check` sauber.
- Texte: Die drei neuen Schlüssel stehen in allen vier `messages/*.json`, mit Sie/vous/Lei und «ss». Der Erfolgs- und der Fehlertext sagen, was geschah und was zu tun ist.
- E2E-Schichten: Der Schritt ruft nur die Task auf. `retryContracts` nutzt `Click` und `Wait` aus der Screenplay-Schicht und das Target `successToast`.
- `offene-punkte.md`: U-15 ist zu Recht entfernt, weil W-01 jetzt gelöst ist. U-17 und U-18 halten die Persona-Befunde fest, die offen bleiben. Das gehört zur Anforderung.
- Im Delta steht nichts, was nicht zur Anforderung gehört. Neu sind ausser Code und Tests nur Persona- und Review-Berichte und der Plan.

## Nicht bestätigt

- Das Ergebnis des vollen E2E-Laufs, insbesondere ob `Wait.until(successToast)` stabil ist, solange der Toast sichtbar bleibt. Der Aufrufer meldet den Lauf separat. Die Anzeigedauer der Toasts in `$lib/stores` habe ich nicht nachgelesen.
- Ob `sprachen-bildschirme` im Zustand `contracts-unknown` den Text der Optionen eines `<select>` mitprüft und damit «(non vérifié)» usw. abdeckt: Die Prüflogik in `tests/e2e/tasks/` habe ich nicht gelesen.
- Ob die DOM-Tests zu Toast und Fokus vor dem Code rot waren: Ich habe sie nicht zurückgerollt, weil der Arbeitsbaum unverändert bleiben soll. Aus dem Code gefolgert: Ohne `retried()` gibt es keinen Toast, und der Fokus fällt auf `body`.
- Ansage per Screenreader und Fokus im echten Browser: nur aus dem Code und den Persona-Berichten gefolgert.
- Ob Issue #152 (Helga H9 / W-02) existiert und offen ist: nicht abgefragt.
