# Code-Review #499, Runde 3 (Abschlussrunde, Delta nach Runde 2: ba7ccc37 Merge, ba431add Fix)

Worktree: `w1-review-499-code3` (detached, ba431add). Gelesen: `git show ba431add` (2 Dateien), `git show --remerge-diff ba431add^ -- . ':!docs'` (leer, der Merge hat keine Konflikte), `contract.service.ts:400-436` (`checkBilledByDwello` im ganzen), `ContractForm.svelte:155-166` (`billedByDwello`), `contract-edit.dom.test.ts:250-262`, `messages/de.json:472-473`, `schema.ts:463` (Statusliste), dazu `git diff ba7ccc37^2..ba431add` (der ganze #499-Diff gegen main) nach Stellen durchsucht, die Status aufzählen.
Vorgabe des Koordinators: «settled» ist eine versendete Abrechnung und zählt für «Abgerechnet bis» wie «sent».

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|

Keine neuen Befunde (C-5 ff. nicht vergeben). Keine Blocker, keine Major.

## Status der offenen IDs

Aus Runde 1 und 2 ist keine ID offen (C-1 bis C-4 sind in Runde 2 erledigt).

## Fragen des Aufrufers

- **Richtige Nummer und Periode bei «settled»:** Ja. `inArray(status, ['sent', 'paid', 'settled'])` (`contract.service.ts:423`) nimmt die Abrechnung in dieselbe Abfrage auf. Nummer, Periode und `date` kommen aus derselben Zeile wie bei «sent». Die Sortierung nach `rentalStart` und dann `statementNumber` hängt nicht vom Status ab.
- **Als berichtigte Abrechnung einer ersetzten:** Ja. Ist die berichtigte Abrechnung «settled», ist `successor.id` gesetzt und ihr Status nicht `draft`. Dann fällt die ersetzte Abrechnung aus dem `replaced`-Zweig heraus, und die berichtigte zählt selbst über `inArray`. Genannt wird also ihre Nummer, wie im Fall C-4 mit «sent». Einen eigenen Test für eine berichtigte Abrechnung im Status settled gibt es nicht. Dieser Fall läuft aber über dieselbe `inArray`-Bedingung, die der neue `it.each`-Fall prüft. Das ist kein Befund.
- **Als erste Abrechnung ab Vertragsbeginn:** Ja. Ob `BILLED_UNTIL_BILLED_START` kommt, entscheidet nur `daysAfter(rentalStart, -1) < startDate` (`:432-434`), und das hängt nicht vom Status ab.
- **Andere Stellen, die nur sent/paid/replaced kennen:** Keine, die das Verhalten bestimmt. `billedByDwello` in `ContractForm.svelte:161` prüft nur den Code-Präfix `BILLED_UNTIL_BILLED` und kennt keinen Status. `backend_billed_until_billed(_start)` nennt keinen Status. Die übrigen Treffer «sent or paid» im #499-Diff sind Kommentare, Testnamen mit «versendete» (Fälle, die wirklich `sent` setzen) und der englische Entwicklertext des `CodedError` (`:435`, gleich in `tests/contracts/contract-billed-until-billed*.json`). Den sieht kein Nutzer, und eine Abrechnung im Status settled ist versendet. Das ist also nicht falsch. Die Szenarien in `contract-edit.feature` setzen keinen Status. Sie benutzen die E2E-Abrechnung 2025, und die ist «settled». Laut Aufrufer sind sie auf ba431add grün.

## Rot ohne die Änderung

Der neue Fall `it.each(['paid', 'settled'])` (`billed-until.pg.test.ts:204`) scheitert mit der alten Liste `['sent', 'paid']` bei `settled` (beim Lesen geprüft): Die Abrechnung passt dann in keinen Zweig der Abfrage, der PUT gibt 200 zurück, und `toMatchObject({ code: 'BILLED_UNTIL_BILLED' })` scheitert. Damit hat die Fehlerbehebung einen pg-Test, der den Fehler nachstellt. Das sichtbare Verhalten deckt das bestehende Szenario ab, das in CI (Lauf 39440541716) rot war.

## Ponytail-Review

Der Fix ergänzt einen Status in einer Liste und einen `it.each`-Fall. Es gibt keinen unbenutzten Code und keine Kopie eines Helfers. Lean already. Ship.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend-`type-check`, `bunx vitest run` (3390), `billed-until.pg`/`api-contracts.pg` (71 pass), E2E `contract-edit` (39 passed) und die Zeilen `billed-until-statement` (2 passed): vom Aufrufer gemeldet. Den pg-Test wollte ich mit `dwello_test_r499e` selbst laufen lassen. Das ging nicht: Im Worktree führt `node_modules` auf `/home/user/Dwello/node_modules`, und der Zugriff darauf ist gesperrt.
- Ob der neue Fall rot ist, habe ich nur beim Lesen beurteilt, nicht mit einem Lauf auf ba7ccc37.
- Was der Merge unter `docs/` geändert hat, gehört nicht zum Auftrag und ist nicht geprüft.
