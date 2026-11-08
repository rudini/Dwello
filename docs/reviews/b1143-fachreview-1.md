# Fach-Review b1143, Schritt 1, Runde 1

Gegenstand: Commit 48a8a57 (Diff gegen 75b78a9), `tests/e2e/features/contract-edit.feature:239`, Text `contracts_delete_draft_contracts_unknown` (#1143).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Minor | Im Vorschlag kann «Laden Sie sie» grammatisch auch auf «die Wohnung» zeigen (das letzte Nomen davor, feminin Singular, auch «sie»). Fix: «Laden Sie die Mietverträge oben auf der Seite …», wie in der Tabelle unten. In fr/it/en ist das Pronomen eindeutig («Chargez-les», «Li carichi», «Load them»). |

## Wording

| key | de | fr | it | en |
|-----|----|----|----|----|
| contracts_delete_draft_contracts_unknown | Dwello hat den Entwurf nicht gelöscht: Die anderen Mietverträge dieser Wohnung liessen sich nicht laden, darum lässt sich nicht prüfen, ob die Wohnung frei ist. Laden Sie die Mietverträge oben auf der Seite mit «Erneut versuchen» und löschen Sie den Entwurf danach noch einmal. | Dwello n’a pas supprimé le brouillon : les autres contrats de bail de cet appartement n’ont pas pu être chargés, il n’est donc pas possible de vérifier si l’appartement est libre. Chargez-les en haut de la page avec « Réessayer », puis supprimez à nouveau le brouillon. | Dwello non ha eliminato la bozza: non è stato possibile caricare gli altri contratti di locazione di questo appartamento, quindi non si può verificare se l’appartamento è libero. Li carichi in alto nella pagina con «Riprovare» e poi elimini di nuovo la bozza. | Dwello did not delete the draft: the other rental contracts for this apartment could not be loaded, so Dwello cannot check whether the apartment is free. Load them at the top of the page with «Try again», then delete the draft again. |

fr: vor «:» und innerhalb « … » je U+00A0, wie im heutigen Text (Zeile 2033); Apostroph U+2019 in fr und it.

Die Szenariozeile `contract-edit.feature:239` übernimmt den deutschen Text oben. `src/__tests__/contract-edit.dom.test.ts:839` hält noch den ersten Satz des alten Texts fest und muss mit angepasst werden.

## Nicht bestätigt

- «frei (Wohnung)» steht nicht in `UBIQUITOUS_LANGUAGE.md` (offenes Issue #1142). Für diesen Text hat der Product Owner in #1143 entschieden; der Text übernimmt die Wörter des Hinweises aus #666 (`contracts_apartment_contracts_unknown` / `_text`, messages/*.json:2020–2021) in allen vier Sprachen («libre», «libero», «free»).

Geprüft: Die Knopfbeschriftung stimmt in allen vier Sprachen mit `contracts_apartment_contracts_retry` überein (ContractsUnknown.svelte:75, Erneut versuchen / Réessayer / Riprovare / Try again). Der Knopf steht oben auf der Bearbeitungsseite (ContractForm.svelte:268), solange die Mietverträge nicht geladen sind. Nach einem erfolgreichen neuen Laden lässt sich derselbe Entwurf löschen (ContractForm.svelte:246–250: `refused` wird nur bei einer Überschneidung geleert). Weitere Punkte: Text ohne Klick- oder Tipp-Anweisung; «Entwurf»/«brouillon»/«bozza»/«draft» und «Mietvertrag»/«contrat de bail»/«contratto di locazione»/«rental contract» nach Glossar und i18n-begriffe.md; Anrede Sie/vous/Lei; Swiss «ss». Keine Rechtsfrage berührt, darum kein Fedlex-Zitat.
