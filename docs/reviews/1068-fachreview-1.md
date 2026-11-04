# Fachreview #1068, Schritt 1, Runde 1 (Commit 34cad2e)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | fr/en der vier Schlüssel «some billed»: «seul l’autre est décompté» / «only the other one is billed» lässt sich als Zustand lesen («ist schon abgerechnet») und widerspricht dann dem ersten Satzteil; de «wird abgerechnet» und it «viene conteggiato» sagen klar den Vorgang. Beleg: w1068-drafts.json, alle vier `statements_building_billed_*_rest_*`; en «billed» heisst in der App sonst der Zustand (`dashboard_task_missing_period_text` «Not yet billed»). Fix: Futur, Texte unten. |

key | de | fr | it | en
---|---|---|---|---
statements_building_billed_one_rest_one | {billed} von {total} Mietverträgen hat schon eine Abrechnung; nur der übrige wird abgerechnet. | {billed} contrat de bail sur {total} a déjà un décompte ; seul l’autre sera décompté. | {billed} contratto di locazione su {total} ha già un conteggio; viene conteggiato solo l’altro. | {billed} of {total} rental contracts already has a statement; only the other one will be billed.
statements_building_billed_one_rest_many | {billed} von {total} Mietverträgen hat schon eine Abrechnung; nur die übrigen werden abgerechnet. | {billed} contrat de bail sur {total} a déjà un décompte ; seuls les autres seront décomptés. | {billed} contratto di locazione su {total} ha già un conteggio; vengono conteggiati solo gli altri. | {billed} of {total} rental contracts already has a statement; only the others will be billed.
statements_building_billed_many_rest_one | {billed} von {total} Mietverträgen haben schon eine Abrechnung; nur der übrige wird abgerechnet. | {billed} contrats de bail sur {total} ont déjà un décompte ; seul l’autre sera décompté. | {billed} contratti di locazione su {total} hanno già un conteggio; viene conteggiato solo l’altro. | {billed} of {total} rental contracts already have a statement; only the other one will be billed.
statements_building_billed_many_rest_many | {billed} von {total} Mietverträgen haben schon eine Abrechnung; nur die übrigen werden abgerechnet. | {billed} contrats de bail sur {total} ont déjà un décompte ; seuls les autres seront décomptés. | {billed} contratti di locazione su {total} hanno già un conteggio; vengono conteggiati solo gli altri. | {billed} of {total} rental contracts already have a statement; only the others will be billed.

(de und it unverändert; fr: Leerzeichen vor «;» als geschütztes Leerzeichen wie angekündigt.)

## Nicht bestätigt

- Rechtliche Aussagen enthält der Gegenstand keine (reiner Hinweistext im Assistenten); Fedlex nicht abgefragt.

Geprüft: de aller sechs Texte wörtlich gegen den Entscheid #1068 (inkl. Szenariozeilen 464, 474); Wahl Einzahl/Mehrzahl für billed/rest mit (1,2), (1,3), (2,3), (3,5), Randfälle (1,1) und (n,n) → «all», (0,n) → kein Hinweis (`BuildingChoice.svelte:38`); «die übrigen werden abgerechnet» stimmt mit dem Lauf überein: `total` = Verträge mit Mietstagen (`plan.contracts`, übergangene Verträge mit «Abgerechnet bis» separat in `skipped`), der Lauf erstellt genau für `inPeriod` ohne `billed` Abrechnungen (`src/lib/server/statement-generation.ts:94-96, 104-110`); Begriffe Mietvertrag/Abrechnung in fr/it/en gemäss `docs/design/i18n-begriffe.md:35, 81` und «décompté/conteggiato» wie sonst in der App; neuer Schritt «sagt die Wahl der Gebäude einmal» prüft genau ein Vorkommen (`toEqual([text])`); keine andere nicht-@wip-Szenariozeile nutzt die alten Texte.
