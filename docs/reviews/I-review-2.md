# Review I, Runde 2 – Mietvertrag auf einen gewählten Tag beenden

Unabhängiges Review von `git diff origin/main...HEAD` (9be27ec, 7b9971a) mit Schwerpunkt auf 7b9971a («fix(contracts): review I of the chosen end date»). Gelesen: Diff, `contracts/[id]/+page.svelte` und `+page.server.ts`, `contract-status.ts`, `ActionDialog.svelte`, `dialog-submit.ts`, `statements/[id]/FormDialog.svelte`, die Tests und Szenarien, dazu die Löschregeln in `backend/src/services/{contract,tenant,apartment,building}.service.ts`, `tenants/[id]`, `ContractRow`, `contract-history.ts`, `statement-generation.ts` und `dashboard/+page.server.ts`. Ausgeführt: `contract-status`, `contract-actions`, `contract-detail-page.dom`, `ui-action-dialog.dom` und `tenant-detail-page.dom` (47 Tests grün), ESLint auf den geänderten Dateien (sauber). E2E und Build nicht ausgeführt.

**Ergebnis:** Alle Findings «hoch» und «mittel» aus Runde 1 sind behoben (I-1 bis I-4). Die Findings «niedrig» sind behoben oder in `offene-punkte.md` vermerkt, ausser I-7 bei `FormDialog` (siehe J-7). Kein kritisches und kein hohes Finding. Ein neues Finding «mittel»: Die neue Löschregel sperrt künftige Mietverträge, auch solche, die nur irrtümlich erfasst wurden.

## Runde 1 – Stand

| # | Schwere | Stand |
|---|---|---|
| I-1 | hoch | Behoben. `disabled={status !== 'ended'}` (`+page.svelte:149`), der Dialog nennt das Vertragsende (`:159-163`). Neu sind ein DOM-Test und ein Szenario; beide scheitern mit dem alten `!contract.endDate`. Nebenwirkung: siehe J-1. |
| I-2 | mittel | Behoben. `earliestEnd` (`+page.svelte:35`) wird beim Öffnen vorgeschlagen (`:39`). DOM-Test «schlägt bei einem künftigen Mietvertrag den Vertragsbeginn vor». |
| I-3 | mittel | Behoben nach Variante (a). Die Aktion liest `startDate` beim Backend (`+page.server.ts:102-104`), und `startDate` ist aus `fields` gestrichen. Neuer Aktionstest «… vor dem Vertragsbeginn eines künftigen Mietvertrags». Rest: siehe J-3. |
| I-4 | mittel | Behoben. Das `FormData` wird geprüft (`endDate` = `2027-03-31`). Für «sendet nichts» lauscht ein Listener auf `submit`. Toast «endet am 31.03.2027» ist getestet, ebenso der künftige Vertrag (DOM und Aktion). Das Szenario prüft jetzt «ist der Mietvertrag unbefristet», und den Strict-Mode-Konflikt löst `filter({ hasText })`. Nicht getestet ist nur der Toast «endet heute»; das ist vertretbar. |
| I-5 | niedrig | Vermerkt in `offene-punkte.md` (Session 12). |
| I-6 | niedrig | Behoben (`contract-status.ts:40`, Regex; Test mit `31.03.2027` und `2027-3-31`). |
| I-7 | niedrig | Nur in `ActionDialog` behoben; `FormDialog` nicht (J-7). |
| I-8 | niedrig | Behoben. «auf den der Mietvertrag gekündigt ist» mit `TODO(fachlich prüfen)` (`+page.svelte:131`) und Eintrag in `offene-punkte.md`, Hinweis auf «Bearbeiten». |
| I-9 | niedrig | Behoben. `min={earliestEnd}` und Zustand `end-dialog-error` in `screens.json` und `accessibility.feature`. |
| I-10 | niedrig | Vermerkt in `offene-punkte.md`. |

## Übersicht neue Findings

| # | Schwere | Finding |
|---|---|---|
| J-1 | mittel | Künftiger Mietvertrag lässt sich nicht mehr löschen; der Dialog führt in eine Sackgasse |
| J-2 | niedrig | «Beenden» überschreibt ein schon gespeichertes Vertragsende (veraltete Seite) |
| J-3 | niedrig | Schlägt das Laden fehl, prüft die Aktion den Vertragsbeginn still nicht |
| J-4 | niedrig | Neues Szenario setzt die Vorbedingung über die UI |
| J-5 | niedrig | Testname «ohne das Backend zu fragen» stimmt nicht mehr |
| J-6 | niedrig | Löschregel nur in der UI; Backend und BFF-Aktion löschen auch laufende Verträge; nicht vermerkt |
| J-7 | niedrig | `FormDialog` übergibt `ondone` weiterhin direkt (Rest von I-7) |
| J-8 | niedrig | Drei vorher Prettier-saubere Dateien sind es nicht mehr |

## Findings

### J-1 (mittel) Künftiger Mietvertrag lässt sich nicht mehr löschen

`src/routes/contracts/[id]/+page.svelte:149,154-166`. Löschen geht jetzt nur bei `status === 'ended'`. Ein künftiger Vertrag hat den Status `future`, bis sein Vertragsbeginn vorbei ist, und danach `active`. Er lässt sich also erst löschen, wenn er begonnen hat **und** sein Vertragsende vorbei ist.

Ablauf für einen irrtümlich erfassten Vertrag, z. B. falscher Mieter oder ein Nachmieter, der doch nicht einzieht (Vertragsbeginn 01.11.2099):
1. «Löschen» → «Ein Mietvertrag ohne Vertragsende kann nicht gelöscht werden. Beenden Sie ihn zuerst.»
2. «Beenden» → vorgeschlagen und frühestens möglich ist der 01.11.2099 → gespeichert.
3. «Löschen» → «Der Mietvertrag läuft bis am 01.11.2099. Danach können Sie ihn löschen.» Der Button bleibt gesperrt. Ein Vertrag, der noch gar nicht begonnen hat, «läuft» zudem nicht.

Der Vertrag blockiert die Wohnung ab dem 01.11.2099 (`checkContractOverlap`), und der richtige Vertrag lässt sich nicht erfassen. Auf `main` ging es (`disabled={!contract.endDate}`): Vertragsende über «Bearbeiten» setzen, dann löschen. Als Ausweg bleibt nur, im Wizard Vertragsbeginn und -ende in die Vergangenheit zu verschieben. Runde 1 hatte die Variante `status !== 'active'` ausdrücklich für diesen Fall genannt. Die Entscheidung für «nur beendet» ist nirgends begründet.

Fix (Vorschlag): `disabled={status === 'active'}`. Ein künftiger Vertrag hatte noch keine Mietzeit, und das Backend lehnt ihn ohnehin ab, sobald er Nebenkostenabrechnungen hat. Dazu im Dialog ein eigener Zweig: «Der Mietvertrag von {name} beginnt erst am TT.MM.JJJJ und wird endgültig gelöscht.» Test zuerst: ein DOM-Test `open('2099-11-01')` → `contract-delete-confirm` ist aktiv, dazu das Szenario «Künftigen Mietvertrag löschen». Soll «nur beendet» bleiben: die Entscheidung in `docs/design/design-decisions.md` festhalten und für `future` einen Text schreiben, der nicht in die Sackgasse «Beenden Sie ihn zuerst» führt.

### J-2 (niedrig) «Beenden» überschreibt ein gespeichertes Vertragsende

`src/routes/contracts/[id]/+page.server.ts:102-110`. Die Aktion lädt den Vertrag jetzt ohnehin, prüft aber nicht, ob er schon ein Vertragsende hat. Mit einer veralteten Seite (zweiter Tab, Zurück-Taste) ist «Beenden» noch sichtbar, obwohl inzwischen über «Bearbeiten» z. B. der 31.12.2025 gespeichert wurde. Ein Klick setzt dann heute. Ein beendeter Vertrag läuft damit wieder bis heute, und die Wohnung zählt bis heute als vermietet. `checkContractOverlap` verhindert das nur, wenn es einen Nachfolgevertrag gibt. Ein «Vertragsende vor heute, aber nach dem gespeicherten Ende» ist also nicht abgefangen; es wird einfach überschrieben. Fix: `const { startDate, endDate: storedEnd } = …; if (storedEnd) return fail(409, { endError: 'Der Mietvertrag hat schon ein Vertragsende. Ändern Sie es unter «Bearbeiten».' })`. Test: Aktion mit `{ startDate: '2024-04-01', endDate: '2025-12-31' }` → 409, kein `PUT`.

### J-3 (niedrig) Laden schlägt fehl: Prüfung des Vertragsbeginns entfällt still

`+page.server.ts:103`: `stored.ok ? … : { startDate: '' }`. Ist das `GET` nicht ok, besteht jedes Datum ab heute die Prüfung, und erst das `PUT` entscheidet. Die Daten bleiben richtig: 404 kommt als 404 zurück, und `contracts_dates_check` lehnt ein Ende vor dem Beginn mit 400 ab. Die Meldung ist dann aber die generische «Mietvertrag konnte nicht beendet werden.» statt des Grunds. Wirft `fetch` (Backend nicht erreichbar), zeigt die Seite die 500-Fehlerseite statt einer Meldung im Dialog. Das war schon vorher beim `PUT` so. Statuscodes sonst richtig: 400 für die Regel, der Backend-Status bei Ablehnung. Fix, kürzer und ehrlich: `if (!stored.ok) return fail(stored.status, { endError: 'Mietvertrag konnte nicht beendet werden.' });` statt des Ersatzobjekts. Ein Test mit `GET` 404 → 404 ohne `PUT`.

### J-4 (niedrig) Szenario-Vorbedingung über die UI

`tests/e2e/features/contract-detail.feature:52`: «Und der Liegenschaftsverwalter den Mietvertrag auf den "2099-12-31" beendet» ist eine Vorbedingung, die durch den Dialog läuft. `tests/e2e/CLAUDE.md` verlangt: «preconditions always go through the backend API, never through the UI». Schlägt das Beenden fehl, scheitert das Szenario mit einem Timeout am modalen Dialog statt mit einer klaren Meldung. Fix: wie in «Beendeten Mietvertrag löschen» eine eigene Wohnung und einen eigenen Mieter nehmen, mit `"Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2099-12-31" für "900" Franken` (`contracts.steps.ts:28`). Der Grund im Dialog («läuft bis am …») ist nur im DOM-Test geprüft; das genügt.

### J-5 (niedrig) Testname stimmt nicht mehr

`src/__tests__/contract-actions.test.ts:43-44`: «lehnt ein Vertragsende vor heute ab, ohne das Backend zu fragen». Die Aktion fragt jetzt das Backend (`GET`), und der Test prüft nur, dass kein `PUT` erfolgt. Der Kommentar «auch ohne JavaScript geprüft» war schon in Runde 1 zu stark. Fix: «… ab, ohne es zu speichern» und den Kommentar streichen oder richtigstellen («Absicherung, falls der Dialog umgangen wird»).

### J-6 (niedrig) Die Löschregel gilt nur in der Oberfläche

`backend/src/services/contract.service.ts:332-361` prüft nur Abrechnungen. Ebenso die BFF-Aktion `contracts/[id]/+page.server.ts:115-123` und der Proxy `src/routes/api/contracts/[id]/+server.ts` (DELETE). Ein laufender Vertrag lässt sich über einen direkten POST auf `?/delete` oder über die API löschen. Wohnung und Mieter prüfen im Backend dagegen «laufend» als `end_date IS NULL OR end_date >= today` (`apartment.service.ts:255-264`, `tenant.service.ts:278-287`). Runde 1 nannte das «eine eigene Frage». Es ist aber weder behoben noch in `offene-punkte.md` vermerkt. Fix: vermerken, oder in `deleteContract` dieselbe Bedingung wie bei Wohnung und Mieter prüfen (dann passend zu J-1 nur `start_date <= today`), mit einem `*.pg.test.ts`.

Die anderen Bildschirme sind konsistent mit «läuft bis und mit Vertragsende»:
- Mietvertragsliste (`ContractRow.svelte:11`), Wohnungsdetail (`ContractHistory`) und Mieterdetail (`contract-history.ts:14`) nutzen `contractStatusOn`.
- Backend-Filter Wohnung und Mieter sowie `listContracts` nutzen `end_date >= today`; die Zeitzone ist vermerkt (I-10).
- Die Übersicht (`dashboard/+page.server.ts:117`) filtert «Vertragsende» nur auf `status=active` mit gesetztem Ende, also richtig.
- `statement-generation.ts:83` (`movedOut`) behandelt ein künftiges Ende nach der Periode richtig als «nicht ausgezogen».
- Mieter löschen ist bei jedem Vertrag gesperrt (`tenants/[id]/+page.svelte:17`), Gebäude löschen bei jeder Wohnung.

Keine weitere Stelle wertet «hat ein Vertragsende» als «beendet».

### J-7 (niedrig) `FormDialog` übergibt `ondone` direkt

`src/routes/statements/[id]/FormDialog.svelte:55`: I-7 ist nur in `ActionDialog` behoben. Heute ist das harmlos: Der einzige Aufrufer übergibt eine Pfeilfunktion (`statements/[id]/+page.svelte:232`). Fix: `() => ondone?.()`, oder in `offene-punkte.md` vermerken.

### J-8 (niedrig) Formatierung

`bunx prettier --check` meldet `src/lib/contract-status.ts` (Zeile 40, über 100 Zeichen), `src/routes/contracts/[id]/+page.svelte` und `src/__tests__/contract-detail-page.dom.test.ts`. Alle drei waren auf `origin/main` sauber. CI prüft Prettier nicht, und 31 andere Dateien weichen schon ab. Fix: `bunx prettier --write` auf diese drei Dateien.

## Tests und Szenarien

- Die neuen Tests scheitern ohne die Änderung, geprüft am Code:
  - Löschen gesperrt bei künftigem Ende: der alte Code gibt frei.
  - Vorschlag Vertragsbeginn: der alte Code schlägt heute vor.
  - Vertragsbeginn in der Aktion: der alte Code las ihn aus dem Formular, das ihn nicht mehr enthält.
  - `FormData` mit `endDate`.
  - `submit` bleibt aus: ohne `check` feuert `requestSubmit` das Ereignis.
  - Formatprüfung.
- Negative Prüfungen sind verankert. «ist der Mietvertrag unbefristet» prüft positiv den Text «Unbefristet». «kann das Löschen nicht bestätigen» prüft `toBeDisabled()` auf dem sichtbaren Button. `not.toHaveBeenCalled()` folgt auf eine sichtbare Fehlermeldung.
- Der a11y-Zustand `end-dialog-error` wartet auf `form-error` im Dialog. Dort ist nur der Feldfehler sichtbar, kein Strict-Mode-Konflikt.

## Copy und Konventionen

- Copy: Deutsch, «Sie», «ss», Glossarbegriffe Vertragsende/Vertragsbeginn. «gekündigt» ist mit `TODO(fachlich prüfen)` und Eintrag in `offene-punkte.md` markiert. Die Fehler sagen, was zu tun ist.
- «läuft bis am 31.03.2027» ist ein Helvetismus und korrekt. Der Hilfetext sagt aber «Bis und mit diesem Tag»; einheitlicher wäre «Der Mietvertrag läuft bis und mit 31.03.2027.» Optional.
- Commit-Subjects: 47 und 47 Zeichen, Conventional Commits, Scope `contracts`, Imperativ, ohne Punkt. In Ordnung.
- `implementation_plan.md` ist nachgeführt.
