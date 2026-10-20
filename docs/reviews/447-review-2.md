# Code-Review #447, Runde 2 (Delta)

Gegenstand: Worktree `review-447-code2` (detached 7bff891b). Gelesen: `git diff 151a17c8 b5b7dcb3` (8 Dateien, ohne Reviews/Plan/Archiv/Personas), `git show --remerge-diff 7f8a262a` (4 `messages/*.json`, `help-page.dom.test.ts`) und `git diff 7f8a262a 7bff891b` (nur `docs/archive/implementation-plan-verlauf.md`).

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 | geschlossen | `statement-detail.feature:703-718` Szenario «Vor dem Berichtigen einer Kette nennt die Bestätigung, was insgesamt zurückerstattet ist», ohne `@wip`. Der Then-Schritt (`statement-detail.steps.ts:465-470`) prüft über die Frage `correctConfirmation` den Text «die Sie auf diese und die ersetzten Abrechnungen insgesamt zurückerstattet haben.». Dieser Satz steht nur in `statements_correct_refunded_chain` (`messages/de.json:1063`). Der alte Code in `Correction.svelte` zeigte bei jeder Kette `paid_chain` («… bezahlt wurden»), deshalb ist das Szenario dort rot. Seed: `sendStatement`/`markPaid` haben neu den Parameter `which` (`backend.ts:343-366`). Den Schlüssel «Berichtigte Abrechnung …» setzt `replaceStatement` (`backend.ts:362`). Der Schritt ruft nur den Seed auf und fasst die Seite nicht an. |

## Neue Befunde im Delta

Keine.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | keine neuen Befunde |

## Bestätigt

- 0-%-Szenario in `contract-new.feature:149`: Es nutzt jetzt den Schritt «… mit einer Verwaltungspauschale von {string} % bis zur Prüfung erfasst». Diesen Schritt gibt es auf der Basis c09ec4fd schon unverändert (`contract-form.steps.ts:355-362`). Der eingeführte Schritt «… mit einem eigenen Satz von … vermieten will» und der Helfer `withOwnRate` sind entfernt, Reste gibt es keine. Gegenüber der Basis enthält `contract-form.steps.ts` von #447 nur noch den Schritt für das Bearbeiten (`agreeManagementFee(rate)`), den `contract-edit.feature:143` nutzt.
- #485: Die Zeilen «Eigener Satz» und «Satz des Abrechnungslaufs» in `i18n-begriffe.md:76-77` stimmen mit dem Entscheid im Issue überein (fr «taux propre» / «taux de l’établissement des décomptes», it «aliquota propria» / «aliquota dell’allestimento dei conteggi», en «own rate» / «rate of the statement run»). Die App schreibt die Begriffe schon so (`contracts_fee_run`, `contracts_fee_rate_label`, `contracts_error_fee_rate_zero`, `statements_fee_help`, `statements_fee_of_own` in fr/it/en). Kein Hilfetext weicht ab.
- fr `glossary_fee_text` entspricht FR-7, ausser bei den Teilen, die zum noch nicht entschiedenen Begriffswechsel und zu «bis 3 %» gehören. it `glossary_fee_text` und `config_help_management_fee` entsprechen IT-17 (a, c) und IT-18 («Compenso»). Die Kleinschreibung «suo» folgt dem Vorschlag IT-20, also der Mehrheit im UI. «3 %» und das NBSP in fr `config_help_management_fee` sind gegenüber 151a17c8 unverändert. Kein Test nagelt die alte fr/it-Formulierung fest (`grep` nach «Admis seulement», «Retribuzione», «Ammesse solo», «lo registra presso» ohne Treffer).
- Merge 7f8a262a: Die Konflikte in `glossary_balance_text` (de/fr/it/en) sind richtig gelöst. Das Wort von main fällt weg («geleisteten»/«versés»/«versati»/«made», #477), der Satz von #447 zur berichtigten Abrechnung bleibt. Der Pin `help-page.dom.test.ts:101` folgt dem gelösten Text. `help.feature:48` prüft nur den Teil zur berichtigten Abrechnung und bleibt gültig. Kein Test im Repo verlangt «geleisteten Akontobeiträge» noch.
- 7f8a262a..7bff891b: nur Archiv, kein Code.
- Selbst neu ausgeführt auf 7bff891b: `bunx vitest run` mit `help-page.dom.test.ts`, `config-pages.test.ts`, `statement-pages.dom.test.ts` und den neun `*-i18n*`-Tests (`i18n.test.ts` eingeschlossen): 12 Dateien, 235 Tests grün.

## Nicht bestätigt

- vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` gesamt (3170 grün, 1 Timeout in `tools/deepcheck/test/check.test.ts`), Backend `management-fee.pg.test.ts`, `statement-pdf-render.test.ts`, `statement-correction.pg.test.ts` (108 grün) und E2E auf b5b7dcb3 (257 grün, das Ketten-Szenario rot mit dem alten `Correction.svelte`). E2E wurde nach dem Merge nicht erneut ausgeführt.
- Netto-Rückerstattung im neuen Szenario: Der Kommentar `statement-detail.feature:703-705` sagt, die Nachzahlung der berichtigten Abrechnung sei kleiner als die erste Rückerstattung. Die Beträge habe ich nicht nachgerechnet, sie hängen von den Seed-Rechnungen in Lindenhof ab. Belegt ist es nur durch den gemeldeten grünen E2E-Lauf: `refunded_chain` erscheint nur bei `offset < 0` (`Correction.svelte:28-36`). Rot mit dem alten Code allein belegt das nicht.
