# Code-Review W5d, Runde 5: Merge origin/main (cdc055e1) in den Zweig von PR #350 (#133)

Geprüft: Merge-Commit 21bd2d59 (`git show --cc 21bd2d59`, `git diff 21bd2d59^1 21bd2d59 -- src backend tests messages`), Worktree `review-w5d-merge2`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| – | – | – | Keine Befunde. |

Keine Blocker oder Majors.

## Geprüft

- `src/lib/server/statement-generation.ts`: Im Typ `Contract` stehen jetzt beide Felder (`billedUntil?` vom Zweig, `terminated?` von main). Main nutzt die Mietverträge in `previewStatements` (`movedOut`, `fixedTerm`, `buildingId`), und zwar über `contractsInPeriod`, also schon mit dem `billsIn`-Filter des Zweigs. Ein Mietvertrag, der bis über die Periode hinaus abgerechnet ist, ergibt keine Vorschauzeile und deshalb auch keinen `fixedTerm`-Hinweis. Das passt: Der Lauf rechnet ihn nicht ab. Der Hinweis für neue Kosten pro Liegenschaft (`+page.server.ts`, Action `preview`) leitet sich aus diesen Vorschauzeilen ab und folgt demselben Filter.
- `src/routes/statements/generate/+page.server.ts` (`chosen`, #119): Hier liest main die ungefilterte Mietvertragsliste, aber nur, um eine Abrechnung ihrem Satz zuzuordnen (`managementFeeAgreed`). `billedUntil` spielt dabei keine Rolle. Kein Konflikt.
- Backend von main (#94, Mindestsaldo: `pdf.service.ts`, `statement.service.ts`, `reminder.service.ts`): Diese Änderungen arbeiten mit dem gespeicherten Saldo und berühren weder `billingStart` noch das Datum «Abgerechnet bis». Kein Konflikt. Die Liste der Mietverträge im Backend liefert beide Felder (`contract.service.ts:35,37`, `routes/contracts.ts:66,68`).
- `tests/contracts/building-contracts.json`: Beide Felder sind drin. `api-contracts.pg.test.ts` prüft sie gegen die echte API.
- `tests/e2e/steps/contracts.steps.ts`: Main hat den Ausdruck auf `mietete/mietet … (befristet )von` erweitert. Die bisherigen Formulierungen passen weiterhin darauf. Mit den Schritten des Zweigs ist er nicht mehrdeutig (siehe grep in `tests/e2e/steps`).
- Plan-Archiv: Die Sessions W6d und W5d stehen beide drin, nichts ist verloren. `implementation_plan.md` enthält keine offene Session.
- Der Merge bringt keine Änderungen, die mit der Anforderung nichts zu tun haben: Ausserhalb der drei Konfliktdateien entspricht der Diff zum ersten Elternteil den Änderungen von main.

## Nicht bestätigt

- lint, check, backend type-check, vitest (2946), backend `bun run test` (926), E2E contract-detail, contract-edit und statement-generate (chromium + api, 129): vom Aufrufer gemeldet, nicht selbst erneut ausgeführt.
- E2E-Features von main, die der Aufrufer nicht ausgeführt hat (`statement-minimum-balance.feature`), unter dem Merge: nicht ausgeführt. Ihr Zusammenspiel mit «Abgerechnet bis» habe ich nur im Code gelesen, ein Konflikt ist dort nicht zu sehen.
