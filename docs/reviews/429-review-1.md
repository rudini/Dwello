# Code-Review #429 «Nebenkostenpauschale pro Monat», Runde 1

Gegenstand: `git diff 4e59e224 fa9cc056` im Worktree `review-429-code` (detached bei fa9cc056). Alle 44 geänderten Dateien gelesen, dazu der Umfeld-Code: `contract.service.ts` (create/update), `startValues`, `ContractWizard.svelte`, die BFF-Proxys, Mieter- und Wohnungsseite, `contract-rent-labels.test.ts`, Issue #429 mit Kommentar und `docs/reviews/429-fachreview-1.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major (Produktentscheid) | UBIQUITOUS_LANGUAGE.md:51–52 | Die Glossarzeilen «Nebenkostenpauschale» und «Monatlich total» sind geändert, aber die Bestätigung des Product Owners zum Wortlaut fehlt. #429 verlangt sie unter «Done means», und `CLAUDE.md` erlaubt sonst keine Änderung an der Datei. |
| C-2 | Minor | src/routes/apartments/[id]/MonthlyCostsCard.svelte:15–17 | Für die Zeile «Nebenkostenpauschale» in den monatlichen Kosten der Wohnung gibt es keinen Test. Das E2E-Szenario prüft nur das Total, `contract-rent-labels.test.ts` nur Akonto und Zusatzmiete. Wird die Zeile entfernt, schlägt kein Test fehl (fach-review V-5). |
| C-3 | Minor | src/routes/contracts/new/RentStep.svelte:27–35 | Das laufende Total im Schritt «Miete» (`contract-monthly-total`) wird mit der Pauschale getestet weder in DOM noch in E2E. `contract-wizard.dom.test.ts:159/279` und `contract-edit.dom.test.ts:71` prüfen es nur ohne. Die E2E-Szenarien prüfen nur das Total der Prüfung. |
| C-4 | Minor | src/lib/contract-form.ts:120 | Die Validierung der Pauschale (negativer oder ungültiger Betrag, Fehler im Schritt «Miete» über `firstStepWithError`) hat keinen Test. |
| C-5 | Minor | backend/src/routes/contracts.ts:53 | Dass die Pauschale beim Erstellen (POST) gespeichert wird, prüft kein Test. `flat-rate-charge.pg.test.ts` prüft nur PUT, `contract-new.feature` endet in der Prüfung (fach-review V-8). Im Code ist es richtig, weil `createContract` `...data` einfügt. |
| C-6 | Minor | src/lib/contract-form.ts:22 | ponytail `yagni`: `flatRateUtilityCharge?` ist optional, «absent in a draft saved before it». `startValues` (`contract-wizard.ts:208–209`) legt den Entwurf aber über `initialContractValues`, das immer `''` setzt, und das Bearbeiten setzt den Wert ebenfalls immer. Als `string` fallen die sieben `?? ''` weg (contract-form.ts:120, contract-wizard.ts:91/101/108/252/275, RentStep.svelte:31). |
| C-7 | Nit | src/lib/contract-wizard.ts:90 | ponytail `yagni`: Der Parameter `categories?` ist optional, aber der einzige Aufrufer (RentStep) übergibt ihn immer. |
| C-8 | Nit | src/routes/contracts/[id]/ContractTerms.svelte:39–42 | ponytail `shrink`: Für ein einziges `data-testid` bekommen drei Zeilen ein `undefined`. Entweder bekommt jede Zeile eine eigene Test-ID, oder der Test findet die Pauschale wie `contract-rent-labels.test.ts` über das `<dt>`. |
| C-9 | Nit | tests/a11y/screens.json:48 | Formatierung ohne Bezug zur Änderung: Bei `"agreed-costs":"Statement…` ist das Leerzeichen nach dem Doppelpunkt weggefallen. |
| C-10 | Nit | messages/en.json:569 | «Dwello still bills them all ticked utility costs» ist holprig. Besser: «still bills them for all ticked utility costs». |
| C-11 | Nit | UBIQUITOUS_LANGUAGE.md:51 | Fach-review V-10 ist offen: «rechnet sie aber nie ab» wiederholt «Sie wird nicht abgerechnet» aus demselben Eintrag. |
| C-12 | Nit | implementation_plan.md:12 | Im Plan steht «nullable, default 0», die Migration legt die Spalte aber `NOT NULL DEFAULT 0` an. Die erledigten Punkte sind nicht abgehakt. |
| C-13 | Nit | src/routes/contracts/new/RentStep.svelte:27–35 | ponytail `reuse`: Das laufende Total rechnet dieselbe Summe wie `contractSummary` (`contract-wizard.ts:121–126`). Die Doppelung bestand schon vor dieser Änderung und wird hier nur erweitert. |

ponytail-review: `net: -10 lines possible` (C-6, C-7, C-8). Keiner dieser Befunde verdeckt einen Fehler.

## C-1 (Major, braucht einen Produktentscheid): Glossar ohne bestätigten Wortlaut

**Warum falsch.** Laut `CLAUDE.md` («Design-Regeln») wird `UBIQUITOUS_LANGUAGE.md` nie bearbeitet. #429 macht davon eine Ausnahme: Die Datei steht unter «Where», und unter «Open points» steht «the product owner confirms their wording». Unter «Done means» verlangt #429: «the glossary rows are confirmed by the product owner». Das Issue und sein einziger Kommentar (2026-10-17T23:42) bestätigen M-1, V-1 und V-2, aber keinen Glossarwortlaut. Fach-review «Fehlende Begriffe» verweist ebenfalls auf diese Bestätigung. Sie steht nirgends.

**Wie zeigen.** `gh api repos/rudini/Dwello/issues/429/comments`: Kein Kommentar enthält den Wortlaut der Zeilen «Nebenkostenpauschale» und «Monatlich total». Die Sache gehört unter «Blocked on me», bis der Product Owner den Wortlaut bestätigt. Dabei gleich V-10 (C-11) berücksichtigen.

## Bestätigt (Anforderung → Code und Test)

- **Feld und Migration 0025:** `0025_contract_flat_rate.sql` legt die Spalte `NOT NULL DEFAULT 0` an, die Nummer folgt auf 0024 von `origin/main`. Schema, Routen (POST optional, PUT partial), `contractFields` und die API-Verträge `contract.json` / `contracts.json` sind angepasst. Test: `flat-rate-charge.pg.test.ts`, red ohne Feld.
- **Prüfschritt:** Zeile und Total in `contractSummary`. Test: `contract-wizard.test.ts` und Szenario «Mietvertrag mit Nebenkostenpauschale prüfen».
- **Vertragsseite:** `contract-flat-rate` und Total über `monthlyTotal(data)`. Test: Szenario «Nebenkostenpauschale nachtragen».
- **Wohnung:** `apartment.ts` und `MonthlyCostsCard`. Das Total ist mit dem Szenario «Monatliche Kosten mit Nebenkostenpauschale» getestet, die Zeile nicht (C-2).
- **Jedes «Monatlich total»:** Vertragsliste, Mieterseite, Vertragshistorie und Wohnung laufen jetzt über `monthlyTotal` (`contract-history.ts`). Test: `apartment.test.ts`. Die Mieterseite liest die Vertragsliste, deren `contractFields` die Pauschale enthält. Laufendes Total: C-3.
- **Nie abgerechnet, nicht im PDF:** `calculation.service.ts` und der PDF-Code lesen das Feld nicht (grep in `backend/src`). Test: `@api`-Szenario in `statement-generate.feature`. Der Commit 11194778 nennt es als «pins kept behaviour». Das ist zulässig, weil der Basis-Commit die Pauschale ebenfalls nicht abrechnet und es kein Bugfix ist.
- **Warnung im Schritt «Miete» und im Bearbeiten:** `flatRateNotice` steht in `RentStep`, das beide Formulare nutzen. Der Text entspricht wörtlich dem Entscheid. Tests: Unit-Test mit allen Bedingungen, Szenario in `contract-new.feature`, a11y- und Sprachzeilen für `contract-new` und `contract-edit`.
- **Übernahme #144:** `RENT`, `lastRent`, `rentTakenOver` und `rentToPreset`. Tests: Unit-Test und Szenario «Nebenkostenpauschale des letzten Mietvertrags übernehmen».
- **Satz in `contracts_no_advance_text`:** steht am Ende in allen vier Sprachen. Test: Step «erfährt …, wo er eine Nebenkostenpauschale einträgt».
- **Texte:** alle neuen Schlüssel in `messages/{de,fr,it,en}.json`. Die Begriffe folgen `i18n-begriffe.md` (Fach-review «Bestätigt»).
- **Neuer Zustand:** `flat-rate-warning` steht in `screens.json` (mit `stateMeanings`) sowie in `accessibility.feature` und `sprachen-bildschirme.feature`, für `contract-new` und `contract-edit`.
- **Screenplay:** Steps rufen nur Tasks und Questions auf. Die Questions liefern Werte (Text, Betrag), die Features beschreiben Fachliches. `toRentStep` wartet auf `agreedCategoryBoxes`, `changeFlatRateUtilityCharge` speichert, und der nächste Step wartet auf die Vertragsseite.
- **Tokens, Komponenten, Sicherheit:** Es gibt nur `MoneyInput` und `Alert` aus `src/lib/ui` und keine neuen Klassen. Der BFF leitet unverändert weiter (XSRF-Prüfung bei POST/PUT bleibt). Kein neues Datenfeld geht an den Client, das er nicht schon über den Vertrag bekam.
- **Red:** Die Tests in cecd7a2d schlagen ohne das Feld fehl (`toBe('0.00')` gegen `undefined`, `flatRateNotice` existiert noch nicht, `monthlyTotal` ergibt 1430 statt 1530). Die Szenarien in `contract-new`, `contract-edit` und `apartment-detail` brauchen `contract-flat-rate-input` oder `contract-flat-rate` oder ein höheres Total, die es ohne die Änderung nicht gibt.

## Nicht bestätigt

- Nicht selbst ausgeführt, vom Aufrufer gemeldet: `bun run lint`, `bun run check`, Backend `bun run type-check`, `bun run test:coverage` (3092), Backend `bun run test` (970), E2E chromium+api für contract-new, contract-edit, apartment-detail und statement-generate (152), axe- und Sprachzeilen inkl. `flat-rate-warning`.
- Selbst erneut ausgeführt: `bunx vitest run` mit `contract-wizard.test.ts`, `contract-form.test.ts`, `apartment.test.ts` und `contract-rent-labels.test.ts`: 79 grün.
- Ob der Demo-Mietvertrag des a11y-Beispiels `contract-edit` Häkchen hat, damit `flat-rate-warning` dort erscheint, habe ich nicht in den Seed-Daten nachgesehen. Der Wait in `tasks/accessibility.ts` würde sonst fehlschlagen, und der Aufrufer meldet die Zeile als grün.
- Ob Elysia ein unbekanntes Feld `flatRateUtilityCharge` im PUT auf dem Basis-Commit verwirft statt es abzuweisen, habe ich nicht ausgeführt. Davon hängt ab, ob das «pins kept behaviour»-Szenario auf dem Basis-Commit grün war. Ich habe es nur aus dem Verhalten von Elysia/TypeBox (normalize) geschlossen.
- Backend-Validierung der Beträge: `t.String()` ohne Prüfung auf Zahl oder Vorzeichen. Das gilt schon für alle bestehenden Beträge des Mietvertrags und ist kein neuer Befund.
