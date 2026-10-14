# Slice-Review b15, Runde 1

Anforderung: Issue #152 (B-15), Variante (a): Mieter und Wohnung eines bestehenden Mietvertrags lassen sich nicht ändern; das Bearbeitungsformular nennt beide als Text mit Hilfe, das Backend lehnt einen anderen Mieter oder eine andere Wohnung mit `CONTRACT_PARTIES_FIXED` ab.
Commit-Bereich: `8e229d4..8545bed` (ein Commit, `fix(contracts): keep tenant and apartment fixed`).

## Ergebnis

Kein Blocker, kein Major. Die Anforderung ist umgesetzt und getestet:

- Backend: `contractUpdateSchema` nimmt `apartmentId`/`tenantId` an (`backend/src/routes/contracts.ts:63-64`), `updateContract` lehnt einen abweichenden Wert mit `CodedError('CONTRACT_PARTIES_FIXED')` ab, bevor etwas gespeichert wird (`backend/src/services/contract.service.ts:353-355`). Die Route liefert dafür 400 mit `code` über `errorBody`. `contract-parties.pg.test.ts` deckt andere Wohnung, anderen Mieter und gleiche Werte ab (lokal 3/3 grün). Der erste Test wäre vor der Änderung rot (Elysia hat das Feld still entfernt, also 200).
- Formular: keine Auswahl mehr, Mieter und Wohnung stehen als `<dl>` mit Hilfetext da (`src/routes/contracts/ContractForm.svelte:177-190`). DOM-Test `contract-edit.dom.test.ts:110-121` prüft Namen, Hilfe und das Fehlen beider Auswahlfelder. Der Load-Test prüft die Namen.
- Szenario `contract-edit.feature:71-75` ohne `@wip`. Der Plan notiert «Scenario red: …». Lokal grün (alle 11 Szenarien von `contract-edit.feature` in Chromium bestanden).
- Texte: `contracts_parties_fixed_help` und `backend_contract_parties_fixed` stehen in allen vier `messages/*.json`; `contracts_tenant_help_short` ist überall entfernt und wird nirgends mehr benutzt.
- `docs/api-specification.md` ist nachgeführt. Der Bildschirm `contract-edit` steht bereits in `tests/a11y/screens.json` (Zustand `default` zeigt den neuen Text), es gibt keinen neuen Bildschirm und keinen neuen Zustand.
- Screenplay-Schichten eingehalten: Die Steps rufen nur Questions auf, die Targets nutzen `data-testid`, und die Negativprüfung «nicht ändern» (`Count` = 0) folgt nach dem positiven Anker (Namen).
- Die Archivierung von Session 21 in `implementation_plan.md` und `docs/archive/implementation-plan-verlauf.md` verlangt Workflow-Schritt 8; sie hat nichts mit der Anforderung zu tun, ist aber vorgeschrieben.

## Blocker / Major

Keine.

## Minor

- m-1 `src/lib/utils/contract-availability.ts:75-82`: Der Parameter `excludeContractId` von `computeAvailability` ruft im App-Code niemand mehr auf (der einzige Aufrufer war `availabilityOf` im entfernten Teil von `ContractForm.svelte`). Diese Änderung hat ihn unbenutzt gemacht, er bleibt aber stehen (benutzt nur noch von `contract-availability.test.ts:96`).
- m-2 `src/routes/contracts/[id]/edit/+page.server.ts:25-28`: `...contract` gibt die ganze Backend-Zeile an die Seite weiter (`tenantEmail`, `notes`, `contractPdf`, `tenantName`, `createdAt` …), getippt als `RentalContract`. Vorher wurde auf die Felder des Formulars abgebildet. Das ist kein Leck an Dritte (eigene Daten), aber mehr Daten im Client als nötig und ein Typ, der nicht stimmt.
- m-3 `src/__tests__/contract-edit-load.test.ts:6-16`: Der Load-Test erfindet die Antwort von `GET /contracts/:id` selbst. Die neu gelesenen verschachtelten Felder `tenant.firstName`, `apartment.number`, `building.name` hat kein Vertrag in `tests/contracts` gegen die echte API geprüft (CLAUDE.md, «API contracts»). Das E2E-Szenario deckt es nur indirekt ab.
- m-4 `messages/de.json:1250` (ebenso fr/it/en:1250): `backend_contract_parties_fixed` sagt «Beenden Sie den Mietvertrag». Genau diese Formulierung hat Fachreview V-2 im Hilfetext ersetzt («Beenden» gibt es nur ohne Vertragsende). In der Meldung steht sie noch und fehlt auch der Weg für einen Erfassungsfehler (V-1).

## Nit

- n-1 `backend/src/services/contract.service.ts:354`: Die Zeile ist über 140 Zeichen lang, nicht Prettier-formatiert (`printWidth` 100).
- n-2 `tests/e2e/steps/contract-form.steps.ts:229`: Die Wohnung wird nur mit `toContain('Wohnung 2.01')` geprüft. Das Gebäude im angezeigten Wert («… - Ahornhof») prüft niemand.
- n-3 `src/routes/contracts/[id]/edit/+page.server.ts:30`: Kein Test deckt den Rückfall `building.name || building.address` ab.

## Nicht bestätigt

- Die vollständigen Prüfungen habe ich nicht laufen lassen: `bun run test:coverage`, `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`, `fallow audit`, `deepcheck`. Gelaufen sind nur `contract-edit.dom.test.ts`, `contract-edit-load.test.ts`, `contract-form.test.ts`, `backend-codes.test.ts` (47/47 grün), `contract-parties.pg.test.ts` (3/3) und `contract-edit.feature` in Chromium (11/11).
- Die Prüfungen axe und Sprachen (`accessibility.feature`, `sprachen-bildschirme.feature`) für `contract-edit` mit dem neuen Hilfetext habe ich nicht laufen lassen, ebenso Firefox/WebKit. Die Übersetzungen in fr/it habe ich nur gelesen, nicht fachlich gegen `docs/design/i18n-begriffe.md` geprüft.
- Dass `CONTRACT_PARTIES_FIXED` im UI ankommt, ist nicht prüfbar: Das Formular sendet immer die gespeicherten Werte. `saveError` (`ContractForm.svelte:93-97`) würde den Code ohnehin nur als «nicht gespeichert» zeigen, nicht mit `backendMessage()`. Die Meldung erfüllt also nur `backend-codes.test.ts`.
- Nicht gelesen, weil ausserhalb des Commit-Bereichs: die ungetrackten Dateien `docs/design/personas/sven-b15.md` und `docs/reviews/b15-fachreview-2.md` im Arbeitsbaum.
