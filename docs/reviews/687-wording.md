# #687 Helga P-7: plain words in the category reasons (proposal for `fach-reviewer`)

Decided (product owner) in #687: the hard words «abgegolten», «gebrauchstauglich», «Vollservicevertrag», «Verzinsung und Abschreibung» in the category help are replaced in this issue; `fach-reviewer` reviews the wording before `messages/*.json` change (CLAUDE.md, Workflow 1).

Shown where `CategoryReason` and `CategoryForm` show a predefined category's reason: category list and form, invoice detail. French uses U+00A0 before ; : ! ? » and after «, as the current texts do. Only the sentences named below change; the rest of each text stays word for word.

## What else changes with it

- `tests/e2e/features/invoice-detail.feature:27` (not `@wip`) checks «Reparaturen sind mit dem Mietzins abgegolten, also nicht umlagefähig.»; it becomes «Reparaturen sind in der Nettomiete schon enthalten, also nicht umlagefähig.» This is a spec change: the pull request needs `Spec change approved: #687` (the decision names «abgegolten»).
- `src/__tests__/categories-page.dom.test.ts:678` pins the de elevator text literally; it follows the new text.
- `categories.feature:67` («als Grund "Vollservicevertrag"», `toContain`) keeps passing: the term stays.
- Not changed: the category descriptions in the backend (migrations, `backend/src/config/llm.ts`, Art. 6 VMWG quoted for the KI) and `UBIQUITOUS_LANGUAGE.md`: they are not help texts, and no row is named by the decision.

## `categories_reason_repairs`

Reason: «gebrauchstauglich» → «so erhalten, dass man sie wie vereinbart nutzen kann»: Art. 256 para. 1 OR speaks of the «vorausgesetzter Gebrauch»; «wie vereinbart» keeps that link without the legal word (Helga's «gut wohnen» would be narrower: a property may also hold business premises). «mit dem Mietzins abgegolten» → «in der Nettomiete schon enthalten»: Helga's proposal «in der Miete schon enthalten», with the main term «Nettomiete» of `UBIQUITOUS_LANGUAGE.md` (Mietzins is its synonym there); «Nettomiete» also says the Nebenkosten are not meant. fr/it/en: «état approprié à l’usage» / «stato idoneo all’uso» / «fit for use» the same way («use as agreed»); «loyer» / «pigione» / «rent» become «loyer net» / «pigione netta» / «net rent» (`docs/design/i18n-begriffe.md`, row Nettomiete).

### de

Current:

> Der Vermieter muss die Liegenschaft in gebrauchstauglichem Zustand erhalten (Art. 256 Absatz 1 Obligationenrecht, OR). Reparaturen sind mit dem Mietzins abgegolten, also nicht umlagefähig.

Proposed:

> Der Vermieter muss die Liegenschaft so erhalten, dass man sie wie vereinbart nutzen kann (Art. 256 Absatz 1 Obligationenrecht, OR). Reparaturen sind in der Nettomiete schon enthalten, also nicht umlagefähig.

### fr

Current:

> Le bailleur doit entretenir l’immeuble dans un état approprié à l’usage (art. 256, al. 1, du Code des obligations, CO). Les réparations sont couvertes par le loyer ; elles ne sont donc pas répercutables.

Proposed:

> Le bailleur doit entretenir l’immeuble de sorte qu’on puisse l’utiliser comme convenu (art. 256, al. 1, du Code des obligations, CO). Les réparations sont déjà comprises dans le loyer net ; elles ne sont donc pas répercutables.

### it

Current:

> Il locatore deve mantenere l’immobile in stato idoneo all’uso (art. 256 cpv. 1 del Codice delle obbligazioni, CO). Le riparazioni sono coperte dalla pigione, quindi non addebitabili.

Proposed:

> Il locatore deve mantenere l’immobile in modo che si possa usare come convenuto (art. 256 cpv. 1 del Codice delle obbligazioni, CO). Le riparazioni sono già comprese nella pigione netta, quindi non addebitabili.

### en

Current:

> The landlord must keep the property fit for use (Art. 256 para. 1 Code of Obligations, CO). Repairs are covered by the rent, and therefore not allocable.

Proposed:

> The landlord must keep the property in a state in which it can be used as agreed (Art. 256 para. 1 Code of Obligations, CO). Repairs are already included in the net rent, and therefore not allocable.

## `categories_reason_renovation`

Reason: as for repairs, «gebrauchstauglich» and «abgegolten» get the same words; «Mietzinserhöhung» stays (a common word, also used in the contract part of the app).

### de

Current:

> Renovationen erhalten das Gebäude in gebrauchstauglichem Zustand; das ist Pflicht des Vermieters (Art. 256 Absatz 1 Obligationenrecht, OR) und mit dem Mietzins abgegolten. Der wertvermehrende Teil kann eine Mietzinserhöhung begründen. Renovationen sind also nicht umlagefähig.

Proposed:

> Renovationen erhalten das Gebäude so, dass man es wie vereinbart nutzen kann; das ist Pflicht des Vermieters (Art. 256 Absatz 1 Obligationenrecht, OR) und in der Nettomiete schon enthalten. Der wertvermehrende Teil kann eine Mietzinserhöhung begründen. Renovationen sind also nicht umlagefähig.

### fr

Current:

> Les rénovations maintiennent le bâtiment dans un état approprié à l’usage ; c’est une obligation du bailleur (art. 256, al. 1, du Code des obligations, CO), couverte par le loyer. La part qui augmente la valeur peut justifier une hausse de loyer. Les rénovations ne sont donc pas répercutables.

Proposed:

> Les rénovations maintiennent le bâtiment de sorte qu’on puisse l’utiliser comme convenu ; c’est une obligation du bailleur (art. 256, al. 1, du Code des obligations, CO), déjà comprise dans le loyer net. La part qui augmente la valeur peut justifier une hausse de loyer. Les rénovations ne sont donc pas répercutables.

### it

Current:

> Le ristrutturazioni mantengono l’edificio in stato idoneo all’uso; è un obbligo del locatore (art. 256 cpv. 1 del Codice delle obbligazioni, CO), coperto dalla pigione. La parte che aumenta il valore può giustificare un aumento della pigione. Le ristrutturazioni non sono quindi addebitabili.

Proposed:

> Le ristrutturazioni mantengono l’edificio in modo che si possa usare come convenuto; è un obbligo del locatore (art. 256 cpv. 1 del Codice delle obbligazioni, CO), già compreso nella pigione netta. La parte che aumenta il valore può giustificare un aumento della pigione. Le ristrutturazioni non sono quindi addebitabili.

### en

Current:

> Renovations keep the building fit for use; that is the landlord’s duty (Art. 256 para. 1 Code of Obligations, CO) and covered by the rent. The part that adds value can justify a rent increase. Renovations are therefore not allocable.

Proposed:

> Renovations keep the building in a state in which it can be used as agreed; that is the landlord’s duty (Art. 256 para. 1 Code of Obligations, CO) and already included in the net rent. The part that adds value can justify a rent increase. Renovations are therefore not allocable.

## `categories_reason_mortgage`

Reason: «sie ist mit dem Mietzins abgegolten» → «ihre Kosten sind in der Nettomiete schon enthalten»: not the financing but its costs are in the rent. fr «ses frais», it «i suoi costi», en «its costs» likewise.

### de

Current:

> Die Finanzierung der Liegenschaft hängt nicht mit dem Gebrauch zusammen (Art. 257a Absatz 1 Obligationenrecht, OR); sie ist mit dem Mietzins abgegolten, also nicht umlagefähig.

Proposed:

> Die Finanzierung der Liegenschaft hängt nicht mit dem Gebrauch zusammen (Art. 257a Absatz 1 Obligationenrecht, OR); ihre Kosten sind in der Nettomiete schon enthalten, also nicht umlagefähig.

### fr

Current:

> Le financement de l’immeuble n’est pas lié à l’usage (art. 257a, al. 1, du Code des obligations, CO) ; il est couvert par le loyer et n’est donc pas répercutable.

Proposed:

> Le financement de l’immeuble n’est pas lié à l’usage (art. 257a, al. 1, du Code des obligations, CO) ; ses frais sont déjà compris dans le loyer net et ne sont donc pas répercutables.

### it

Current:

> Il finanziamento dell’immobile non è legato all’uso (art. 257a cpv. 1 del Codice delle obbligazioni, CO); è coperto dalla pigione, quindi non addebitabile.

Proposed:

> Il finanziamento dell’immobile non è legato all’uso (art. 257a cpv. 1 del Codice delle obbligazioni, CO); i suoi costi sono già compresi nella pigione netta, quindi non addebitabili.

### en

Current:

> Financing the property is not linked to the use (Art. 257a para. 1 Code of Obligations, CO); it is covered by the rent, and therefore not allocable.

Proposed:

> Financing the property is not linked to the use (Art. 257a para. 1 Code of Obligations, CO); its costs are already included in the net rent, and therefore not allocable.

## `categories_reason_administration`

Reason: «ist mit dem Mietzins abgegolten» → «Die Kosten … sind in der Nettomiete schon enthalten». fr «Le coût de» rather than «Les frais d’administration», it «I costi» rather than «spese amministrative»: those words already name the Verwaltungspauschale in the same text.

### de

Current:

> Die allgemeine Verwaltung ist mit dem Mietzins abgegolten. Den Aufwand für die Nebenkostenabrechnung können Sie über die Verwaltungspauschale anrechnen (Art. 4 Absatz 3 Verordnung über die Miete, VMWG), wenn der Mietvertrag sie nennt (Art. 257a Absatz 2 Obligationenrecht, OR); Verwaltungsarbeit für den Heizbetrieb gehört zur Heizung (Art. 5 Absatz 2 Buchstabe i VMWG). Die allgemeine Verwaltung ist also nicht umlagefähig.

Proposed:

> Die Kosten der allgemeinen Verwaltung sind in der Nettomiete schon enthalten. Den Aufwand für die Nebenkostenabrechnung können Sie über die Verwaltungspauschale anrechnen (Art. 4 Absatz 3 Verordnung über die Miete, VMWG), wenn der Mietvertrag sie nennt (Art. 257a Absatz 2 Obligationenrecht, OR); Verwaltungsarbeit für den Heizbetrieb gehört zur Heizung (Art. 5 Absatz 2 Buchstabe i VMWG). Die allgemeine Verwaltung ist also nicht umlagefähig.

### fr

Current:

> L’administration générale est couverte par le loyer. Le travail lié à l’établissement du décompte des charges peut être facturé au moyen des frais d’administration (art. 4, al. 3, de l’ordonnance sur le bail, OBLF) si le contrat de bail les mentionne (art. 257a, al. 2, du Code des obligations, CO) ; le travail administratif lié au chauffage fait partie des frais de chauffage (art. 5, al. 2, let. i, OBLF). L’administration générale n’est donc pas répercutable.

Proposed:

> Le coût de l’administration générale est déjà compris dans le loyer net. Le travail lié à l’établissement du décompte des charges peut être facturé au moyen des frais d’administration (art. 4, al. 3, de l’ordonnance sur le bail, OBLF) si le contrat de bail les mentionne (art. 257a, al. 2, du Code des obligations, CO) ; le travail administratif lié au chauffage fait partie des frais de chauffage (art. 5, al. 2, let. i, OBLF). L’administration générale n’est donc pas répercutable.

### it

Current:

> L’amministrazione generale è coperta dalla pigione. Il lavoro per il conteggio spese accessorie può essere addebitato con le spese amministrative (art. 4 cpv. 3 dell’ordinanza concernente la locazione, OLAL) se il contratto di locazione le indica (art. 257a cpv. 2 del Codice delle obbligazioni, CO); il lavoro amministrativo per il riscaldamento fa parte delle spese di riscaldamento (art. 5 cpv. 2 lett. i OLAL). L’amministrazione generale non è quindi addebitabile.

Proposed:

> I costi dell’amministrazione generale sono già compresi nella pigione netta. Il lavoro per il conteggio spese accessorie può essere addebitato con le spese amministrative (art. 4 cpv. 3 dell’ordinanza concernente la locazione, OLAL) se il contratto di locazione le indica (art. 257a cpv. 2 del Codice delle obbligazioni, CO); il lavoro amministrativo per il riscaldamento fa parte delle spese di riscaldamento (art. 5 cpv. 2 lett. i OLAL). L’amministrazione generale non è quindi addebitabile.

### en

Current:

> General administration is covered by the rent. The work for the utility cost statement can be charged through the management fee (Art. 4 para. 3 Tenancy Ordinance, VMWG) if the rental contract names it (Art. 257a para. 2 Code of Obligations, CO); administrative work for running the heating is part of the heating costs (Art. 5 para. 2 let. i VMWG). General administration is therefore not allocable.

Proposed:

> The costs of general administration are already included in the net rent. The work for the utility cost statement can be charged through the management fee (Art. 4 para. 3 Tenancy Ordinance, VMWG) if the rental contract names it (Art. 257a para. 2 Code of Obligations, CO); administrative work for running the heating is part of the heating costs (Art. 5 para. 2 let. i VMWG). General administration is therefore not allocable.

## `categories_reason_heating`

Reason: «Verzinsung und Abschreibung der Anlage» (Art. 6 VMWG) → «die Zinsen auf dem Geld, das in ihr steckt, und ihr Wertverlust»: says what the legal words mean (interest on the capital and wear of the system). fr «l’intérêt et l’amortissement», it «interessi e ammortamento», en «interest and depreciation» resolved the same way.

### de

Current:

> Brennstoff, Energie, Wartung und Betrieb der Heizung sind anrechenbar (Art. 5 Verordnung über die Miete, VMWG); Reparatur, Erneuerung, Verzinsung und Abschreibung der Anlage nicht (Art. 6 VMWG). Die laufenden Heizkosten sind also umlagefähig.

Proposed:

> Brennstoff, Energie, Wartung und Betrieb der Heizung sind anrechenbar (Art. 5 Verordnung über die Miete, VMWG); Reparatur und Erneuerung der Anlage, die Zinsen auf dem Geld, das in ihr steckt, und ihr Wertverlust nicht (Art. 6 VMWG). Die laufenden Heizkosten sind also umlagefähig.

### fr

Current:

> Le combustible, l’énergie, la maintenance et l’exploitation du chauffage sont répercutables (art. 5 de l’ordonnance sur le bail, OBLF) ; la réparation, le renouvellement, l’intérêt et l’amortissement de l’installation ne le sont pas (art. 6 OBLF). Les frais courants de chauffage sont donc répercutables.

Proposed:

> Le combustible, l’énergie, la maintenance et l’exploitation du chauffage sont répercutables (art. 5 de l’ordonnance sur le bail, OBLF) ; la réparation et le renouvellement de l’installation, les intérêts sur l’argent investi dans celle-ci et sa perte de valeur ne le sont pas (art. 6 OBLF). Les frais courants de chauffage sont donc répercutables.

### it

Current:

> Combustibile, energia, manutenzione ed esercizio del riscaldamento sono computabili (art. 5 dell’ordinanza concernente la locazione, OLAL); riparazione, rinnovo, interessi e ammortamento dell’impianto no (art. 6 OLAL). Le spese correnti di riscaldamento sono quindi addebitabili.

Proposed:

> Combustibile, energia, manutenzione ed esercizio del riscaldamento sono computabili (art. 5 dell’ordinanza concernente la locazione, OLAL); riparazione e rinnovo dell’impianto, gli interessi sul denaro investito in esso e la sua perdita di valore no (art. 6 OLAL). Le spese correnti di riscaldamento sono quindi addebitabili.

### en

Current:

> Fuel, energy, servicing and operation of the heating are chargeable (Art. 5 Tenancy Ordinance, VMWG); repair, renewal, interest and depreciation of the system are not (Art. 6 VMWG). The running heating costs are therefore allocable.

Proposed:

> Fuel, energy, servicing and operation of the heating are chargeable (Art. 5 Tenancy Ordinance, VMWG); repair and renewal of the system, interest on the money invested in it and its loss in value are not (Art. 6 VMWG). The running heating costs are therefore allocable.

## `categories_reason_elevator`

Reason: «Vollservicevertrag» stays as the term (`UBIQUITOUS_LANGUAGE.md` and `docs/design/i18n-begriffe.md` list it; scenario `categories.feature:67` checks it), but is explained first: «Deckt der Vertrag mit der Liftfirma auch Reparaturen (Vollservicevertrag)». fr «contrat de maintenance complet», it «contratto di manutenzione completo», en «full-service contract» are already plain: unchanged.

### de

Current:

> Strom, Notruftelefon und Wartung des Lifts hängen mit dem Gebrauch zusammen (Art. 257a Absatz 1 Obligationenrecht, OR); Reparaturen und Ersatzteile trägt der Vermieter. Deckt ein Vollservicevertrag auch Reparaturen, ist nur sein Anteil für die Wartung umlagefähig: Erfassen Sie unter «Lift» nur diesen Anteil. Strom, Notruftelefon und Wartung sind also umlagefähig.

Proposed:

> Strom, Notruftelefon und Wartung des Lifts hängen mit dem Gebrauch zusammen (Art. 257a Absatz 1 Obligationenrecht, OR); Reparaturen und Ersatzteile trägt der Vermieter. Deckt der Vertrag mit der Liftfirma auch Reparaturen (Vollservicevertrag), ist nur sein Anteil für die Wartung umlagefähig: Erfassen Sie unter «Lift» nur diesen Anteil. Strom, Notruftelefon und Wartung sind also umlagefähig.

### fr

Unchanged.

### it

Unchanged.

### en

Unchanged.
