# Fach-Review #669, Runde 1 (Szenarien db9466c, Texte Helga P-2 und P-5)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Im Assistenten «Neuer Mietvertrag» verweist der Überschneidungstext auf einen Hinweis «beim Vertragsbeginn», den es in Schritt 2 «Wohnung» und Schritt 5 «Prüfen» nicht gibt |
| V-2 | Verwalter | Minor | «Der Hinweis dazu steht beim Vertragsbeginn» stimmt auch im Bearbeiten und in Schritt 3 nicht ganz: der Kasten «Zeitraum überschneidet sich» steht unter Vertragsende bzw. «Abgerechnet bis» (`src/routes/contracts/new/PeriodStep.svelte:145`). Fix: den Kasten mit seinem Titel nennen (Texte unten) |
| V-3 | Verwalter | Major | Kein `@wip`-Szenario für die Entscheidung P-2 im Assistenten (Meldung mit Vertragsbeginn, und «Die Mietverträge der Wohnung sind geladen.» ohne Vertragsbeginn) |
| V-4 | Verwalter | Minor | `contract-edit.feature:79, 86, 94` prüfen noch «… steht oben bei der Wohnung.»; die Entscheidung P-5 gibt die Änderung frei. Fix: im selben PR auf den neuen Satz ändern, `Spec change approved: #669` |

## V-1 (Major)

Beleg: Die Entscheidung P-2 gilt im Assistenten, «once a Vertragsbeginn is entered». `retry()` und damit `retried()` laufen in drei Schritten (`src/routes/contracts/new/ContractWizard.svelte:370, 382, 403`): Wohnung, Vertragsdauer und Prüfen. Der Kasten «Zeitraum überschneidet sich» steht nur in `PeriodStep.svelte:145`, also in Schritt 3. Ein eingetragener Vertragsbeginn ist auch in Schritt 2 möglich (zurück aus Schritt 3) und in Schritt 5 (die Mietverträge waren in Schritt 3 nicht geladen, «Weiter» konnte die Überschneidung also nicht prüfen).

Warum falsch: In Schritt 2 und 5 sucht der Vermieter einen Hinweis, den der Bildschirm nicht zeigt. Ein Vermieter mit wenig Erfahrung weiss dann nicht, was er tun soll.

Fix: zwei Texte. Im Bearbeiten und in Schritt 3 nennt der Text den Kasten (`contracts_apartment_contracts_overlap`). In Schritt 2 und 5 sagt er, was zu tun ist, und nennt den Schritt (`contracts_apartment_contracts_overlap_step`, mit `{number}` und `{step}` wie bei `statements_draft_dropped_building_one`). Dazu ein Szenario für den Fall Schritt 5.

## V-3 (Major)

Beleg: `git show db9466c -- tests/e2e/features/contract-new.feature` bringt nur Sven P-3. Die Entscheidung legt aber zwei Verhalten im Assistenten fest: die neue Meldung, sobald ein Vertragsbeginn eingetragen ist, und die alte Meldung ohne Vertragsbeginn. Keines der beiden hält ein Szenario fest, auch nicht in den Szenarien ohne `@wip` («sind geladen» kommt in keiner `.feature`-Datei vor).

Fix: in `contract-new.feature` drei `@wip`-Szenarien.
- Erneut laden in Schritt 2 ohne Vertragsbeginn: «Die Mietverträge der Wohnung sind geladen.»
- Erneut laden in Schritt 3 mit Vertragsbeginn, ohne Überschneidung: Text `contracts_apartment_contracts_checked`.
- Erneut laden in Schritt 5 mit Überschneidung: Text `contracts_apartment_contracts_overlap_step`.

Die zwei Szenarien zu P-2 im Bearbeiten (`contract-edit.feature:156-173`) übernehmen in der letzten Zeile den Text von `contracts_apartment_contracts_overlap` aus der Tabelle.

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| contracts_apartment_contracts_checked | Die anderen Mietverträge dieser Wohnung sind geladen. Der Zeitraum überschneidet sich mit keinem davon. | Les autres contrats de bail de cet appartement sont chargés. La période ne chevauche aucun d’entre eux. | Gli altri contratti di locazione di questo appartamento sono caricati. Il periodo non si sovrappone a nessuno di essi. | The other rental contracts for this apartment are loaded. The period does not overlap with any of them. |
| contracts_apartment_contracts_overlap | Die anderen Mietverträge dieser Wohnung sind geladen. Der Zeitraum überschneidet sich mit einem davon. Welcher es ist, steht im Hinweis «Zeitraum überschneidet sich». | Les autres contrats de bail de cet appartement sont chargés. La période chevauche l’un d’entre eux. Le message « Les périodes se chevauchent » précise lequel. | Gli altri contratti di locazione di questo appartamento sono caricati. Il periodo si sovrappone a uno di essi. Quale sia, lo indica l’avviso «Il periodo si sovrappone». | The other rental contracts for this apartment are loaded. The period overlaps with one of them. The note «Period overlaps» names it. |
| contracts_apartment_contracts_overlap_step | Die anderen Mietverträge dieser Wohnung sind geladen. Der Zeitraum überschneidet sich mit einem davon. Ändern Sie den Vertragsbeginn oder das Vertragsende im Schritt {number} «{step}». | Les autres contrats de bail de cet appartement sont chargés. La période chevauche l’un d’entre eux. Modifiez le début ou la fin du contrat à l’étape {number} « {step} ». | Gli altri contratti di locazione di questo appartamento sono caricati. Il periodo si sovrappone a uno di essi. Modifichi l’inizio o la fine del contratto nel passo {number} «{step}». | The other rental contracts for this apartment are loaded. The period overlaps with one of them. Change the contract start or contract end in step {number} «{step}». |
| contracts_apartment_contracts_see_apartment | «Erneut versuchen» steht oben auf der Seite. | « Réessayer » se trouve en haut de la page. | «Riprovare» si trova in alto nella pagina. | «Try again» is at the top of the page. |

`contracts_apartment_contracts_loaded` bleibt unverändert und gilt nur noch im Assistenten ohne Vertragsbeginn. `{step}` steht für `m.contracts_period()`: «Vertragsdauer», «Durée du contrat», «Durata del contratto», «Contract term». `{number}` ist 3.

Zu P-5, Aufteilen des Keys: Er braucht keine Aufteilung. `contracts_apartment_contracts_see_apartment` erscheint nur, wenn `ContractsUnknown` ohne `onretry` läuft. Das geschieht nur beim `PeriodStep` in `ContractForm.svelte:313`. Im Assistenten übergeben alle drei Stellen `onretry` (`ContractWizard.svelte:370, 382, 403`) und zeigen den Knopf selbst. Der neue Satz gilt also nur im Bearbeiten. Zwei Dinge empfehle ich, beides ohne fachliche Wirkung: den Key in `…_see_top` umbenennen und den Kommentar in `PeriodStep.svelte:40` («points to the apartment's») anpassen.

## Nicht bestätigt

- Ob `overlapError` im Frontend dieselbe Regel prüft wie das Backend beim Speichern. Nur dann ist «überschneidet sich mit keinem davon» eine verlässliche Aussage. Gelesen habe ich nur die Aufrufe in `ContractForm.svelte:107` und `ContractWizard.svelte:120`, nicht `overlapError` selbst.
- Der Fall `overlapSaid` im Assistenten: Die Überschneidung steht schon im Feldfehler, der Kasten fehlt dann, und der Titel «Zeitraum überschneidet sich» ist nicht zu sehen. Nach der Logik in `ContractWizard.svelte:122, 299-302` scheint das bei nicht geladenen Mietverträgen nicht vorzukommen, nicht geprüft im Browser.
- Die Szenarien zum Bearbeiten (Sven P-3, Helga P-5, `contract-edit.feature:72, 91-92`) sagen «bei der Wohnung». Steht der Hinweis künftig oben im Formular, trifft das nicht mehr wörtlich zu. Die Zeilen ohne `@wip` deckt die Freigabe nicht (sie gilt nur für die Zeilen mit dem Satz beim Vertragsbeginn). In den neuen `@wip`-Szenarien liesse sich «bei der Wohnung» frei ersetzen, etwa durch «oben im Formular».

Geprüft: Begriffe aus UBIQUITOUS_LANGUAGE.md (Liegenschaftsverwalter, Mietvertrag, Wohnung, Vertragsbeginn), Schweizer Schreibung, Daten im Szenario zur Überschneidung (Anna Keller ab 2024-04-01, Bruno Meier 2022-01-01 bis 2024-03-31, der Vertragsbeginn 2024-01-01 überschneidet sich), die Abdeckung von Sven P-1, P-3 und P-4 und von Helga P-1 und P-5 im Bearbeiten; kein Rechtssatz betroffen.
