# Review J, Runde 1 – Kündigung oder Befristung, Erinnerung pro Mietvertrag

Unabhängiges Review der zwei Commits nach f1bc98c auf `claude/relaxed-ride-tciycq`: 52322c3 «feat(statements): remind of every contract of the period» (A-9) und 87ac838 «feat(contracts): tell a notice from a fixed term» (A-1). Massstab sind `docs/anforderungen-vertragsende.md` (A-1 und A-9, dazu A-3, A-4, A-6 und A-10, die auf A-1 aufbauen), `CLAUDE.md` (Design-Regeln, Workflow) und `tests/contracts/README.md`.

Gelesen: `git diff f1bc98c..87ac838` vollständig. Im Backend `0001_schema.sql`, `schema.ts`, `routes/contracts.ts` (Validierung, Fehlerbehandlung), `contract.service.ts` (`listContracts`, `createContract`, `checkNewDates`, `updateContract`), `statement.service.ts` (`statementFilterConditions`, `listStatements`), `routes/statements.ts`, `routes/dashboard.ts` (`buildingOccupancy`), `demo/demo-data.sql`. Im Frontend `dashboard/+page.server.ts`, `lib/overview.ts`, `lib/accounting-period.ts`, `lib/server/statement-generation.ts`, `contract-status.ts`, `contract-form.ts`, `lib/server/contract-history.ts`, `lib/server/apartment.ts`, `tenants/[id]/+page.server.ts`, `contracts/+page.server.ts`, `ContractRow.svelte`, `ContractHistory.svelte`, `TenantContracts.svelte`, `contracts/[id]/+page.server.ts`, `+page.svelte`, `ContractTerms.svelte`, `edit/+page.server.ts`, `ContractForm.svelte`, `new/PeriodStep.svelte`, `RadioGroup.svelte`, `DateInput.svelte`, `api/contracts/[id]/+server.ts`. Tests: `dashboard.test.ts`, `contract-status`, `contract-edit.dom`, `contract-actions`, `contract-form`, `contract-edit-load`, `contract-end.pg.test.ts`, `api-contracts.pg.test.ts`, die Szenarien und Schritte in `dashboard.feature`, `contract-detail.feature`, `contract-edit.feature`, `accessibility.feature`, `tests/a11y/screens.json`, `fixtures/backend.ts`, `interactions/accessibility.ts`. Dokumente: `UBIQUITOUS_LANGUAGE.md`, `data-model.md`, `api-specification.md`, `offene-punkte.md`, `implementation_plan.md` (Session 15), `tests/contracts/README.md`, `I-review-6.md`.

Ausgeführt:
- `bunx vitest run` für `dashboard`, `contract-status`, `contract-edit.dom`, `contract-actions`, `contract-form`, `contract-edit-load`, `contract-wizard`, `contract-wizard.dom`, `contract-list`, `contract-detail-page.dom`: 148 Tests grün.
- Backend `bun test --preload ./scripts/test-db.ts` für `contract-end.pg.test.ts` und `api-contracts.pg.test.ts`: 24 grün. `bun run type-check`: sauber.
- `bun run lint` und `bun run check`: sauber (0 Fehler, 0 Warnungen). `bunx prettier --check` auf den geänderten `.ts`/`.svelte`-Dateien: sauber.
- Zwei Sonden, danach gelöscht:
  1. Temporärer pg-Test im Backend (unbefristeter Vertrag ab 01.04.2024): `PUT { terminated: true }` → **400** mit `"error": "Failed query: update \"rental_contracts\" set \"terminated\" = $1 … params: true, …, <id>"`. `POST /contracts` mit `terminated: true` ohne `endDate` → **400** mit `"Failed query: insert into \"rental_contracts\" …"`. `PUT { endDate: null, terminated: true }` → 200, gespeichert `terminated: false`. Nach `PUT { endDate: '2099-03-31', terminated: true }` und `PUT { endDate: '2099-06-30' }` liefern `GET /contracts?apartmentId=…` und `?tenantId=…` `["2099-06-30", true]`: Die Listen-Endpunkte liefern `terminated`, ein neues Ende ohne Flag behält die Kündigung.
  2. Temporärer Vitest gegen `load` aus `src/routes/contracts/+page.server.ts` mit einer Backend-Antwort `{ endDate: '2099-03-31', terminated: true }`: `data.contracts[0].terminated` ist **`undefined`** (J-1).
- E2E, volle Suiten und Server nicht ausgeführt.

**Ergebnis:** A-9 ist richtig umgesetzt. Die Erinnerung prüft pro Mietvertrag, die Grenzen der Periode stimmen auf den Tag, auch für Juli–Juni. A-1 ist im Backend, auf der Detailseite, unter «Bearbeiten» und in den Listen von Wohnung und Mieter richtig umgesetzt. Die Mietvertragsliste `/contracts` zeigt aber jeden gekündigten Mietvertrag weiter als «befristet», weil der Loader das Feld nicht übernimmt (J-1, hoch). Genau diese Verwechslung soll A-1 beseitigen, und A-1 steht als «umgesetzt» im Dokument. Kein Test deckt die Liste ab. Dazu sieben Findings «niedrig»: rohe SQL-Meldung bei `terminated` ohne Vertragsende (J-2), Reihenfolge und Zusammenfassung der Gebäude in der Erinnerung (J-3), eine Erinnerung, die der Assistent nicht erledigen kann (J-4), Testlücken (J-5), fehlende Felder in den API-Verträgen (J-6), Copy und Glossar (J-7), Demodaten (J-8).

## Prüfung der Erinnerung pro Mietvertrag (A-9)

`missingPeriod` (`src/routes/dashboard/+page.server.ts:69-79`) nimmt jeden Mietvertrag mit `startDate <= period.end` und `endDate` leer oder `>= period.start`, ohne Abrechnung in der Periode (`contractId` aus `GET /statements?periodStart&periodEnd`, `statement.service.ts:91-92`: Periode der Abrechnung liegt ganz in der abgefragten).

| Fall | Ergebnis |
|---|---|
| Vertrag endet am ersten Tag der Periode / beginnt am letzten | Richtig: genannt, ein Mietstag reicht. Der Unit-Test prüft nur die Tage ausserhalb (30.06.2025, 01.07.2026) |
| Vertrag endet am Tag vor der Periode, beginnt am Tag danach | Richtig: nicht genannt (getestet) |
| Vertrag ohne Mietstage in der Periode | Gibt es nach dieser Bedingung nicht; nicht genannt |
| Abrechnungsperiode Juli–Juni | Richtig: `lastCompletedPeriod` liefert 01.07.–30.06., der Unit-Test läuft mit `july-june` |
| Gebäude mit Abrechnung pro Mietvertrag, ein Vertrag der Periode später erfasst | Richtig: Das Gebäude erscheint wieder, der Assistent erstellt nur die fehlende Abrechnung (`statement-generation.ts:46-55`) |
| Mieter ausgezogen, Gebäude heute leer (Helga I3) | Richtig: genannt (Unit-Test und Szenario) |
| Limit 1000 bei Mietverträgen und Abrechnungen | Backend kappt `limit` nicht (`listContracts`, `listStatements`). Bei unter 50 Wohnungen reicht es für Jahrzehnte. Kein Befund |
| Mietvertragsliste nicht erreichbar | Die Erinnerung verschwindet ohne Hinweis (`list` gibt `[]`). Das entspricht der Regel in Zeile 47 und Zeile 63 («better no task than every building») und dem Test «zeigt die Kennzahlen auch, wenn eine Liste nicht erreichbar ist». Kein Befund |
| Reihenfolge und gleichnamige Gebäude | Siehe J-3 |
| Abrechnung über eine andere Periode | Siehe J-4 |

## Prüfung von `terminated` (A-1)

| Stelle | Ergebnis |
|---|---|
| Schema, `schema.ts`, `data-model.md` | Spalte und `contracts_terminated_check` gleich in allen drei |
| `POST` / `PUT`, Validierung | `terminated` optional. Ohne Vertragsende greift erst die Datenbank: 400 mit SQL-Text (J-2) |
| `updateContract` | `endDate: null` setzt `terminated: false`, auch wenn `terminated: true` mitkommt (geprüft). Ein neues Ende ohne Flag behält die Kündigung (geprüft) |
| BFF «Beenden» | Sendet `terminated: true`. «Beenden» gibt es nur ohne Vertragsende (`+page.svelte:91`), ein befristeter Vertrag wird so nie «gekündigt» |
| «Bearbeiten» | `contractBody` sendet `terminated: !isUnlimited && terminated`. Gekündigt bleibt gekündigt, «Kündigung aufheben» sendet `endDate: null`, «Befristet» sendet `false` (DOM-Tests) |
| Assistent für neue Verträge | Bindet `terminated` nicht, `PeriodStep` fällt auf `false` zurück, `POST` mit `terminated: false`. Wizard-Tests grün |
| Detailseite | `contractEnd` richtig |
| Wohnung, Mieter | `toContractHistory` übernimmt `terminated`; beide Loader lesen `GET /contracts?…`, das `terminated` liefert (Sonde 1). Ungetestet |
| Mietvertragsliste `/contracts` | **Falsch**, J-1 |
| API-Verträge | `terminated` fehlt in `tests/contracts` (J-6) |

## Übersicht Findings

| # | Schwere | Finding |
|---|---|---|
| J-1 | hoch | Die Mietvertragsliste übernimmt `terminated` nicht. Jeder gekündigte Mietvertrag heisst dort «…, befristet» |
| J-2 | niedrig | `terminated: true` ohne Vertragsende gibt 400 mit dem rohen SQL-Text samt Parametern; die API-Doku nennt die Regel nicht |
| J-3 | niedrig | Die Erinnerung ordnet die Gebäude nach dem jüngsten Vertragsbeginn und fasst gleichnamige Gebäude zusammen; der Unit-Test prüft eine Reihenfolge, die das Backend nicht liefert |
| J-4 | niedrig | Übersicht und Assistent zählen eine Abrechnung verschieden (ganz in der Periode / überlappt). Dann bleibt eine Erinnerung, die der Assistent nicht erledigen kann |
| J-5 | niedrig | Tests: ein A-9-Szenario ist schon mit dem alten Code grün, die Listen sind für `terminated` ungetestet, zwei E2E-Prüfungen wurden aufgeweicht |
| J-6 | niedrig | `terminated`, `buildingName` (Mietvertragsliste) und `contractId` (Abrechnungsliste) liest das Frontend, sie fehlen in `tests/contracts` |
| J-7 | niedrig | Copy: neue Begriffe ohne `TODO(fachlich prüfen)` im Code; «Befristet» im Assistenten ohne Datum, anders als A-1.3 |
| J-8 | niedrig | Demodaten: Vormieter «ausgezogen per 28.02.2021» und der Mieterwechsel per 30.06.2025 erscheinen als «befristet» |

## Findings

### J-1 (hoch) Die Mietvertragsliste zeigt einen gekündigten Mietvertrag als «befristet»

`src/routes/contracts/+page.server.ts:36-55`. Der Loader baut jede Zeile Feld für Feld neu auf und lässt `terminated` weg. `ContractRow.svelte:30` ruft `contractPeriod(…, contract.terminated)` mit `undefined` auf, der Standardwert `false` ergibt «befristet». TypeScript merkt nichts, weil `terminated` in `RentalContract` optional ist.

Mit Sonde 2 geprüft: Backend-Antwort `{ endDate: '2099-03-31', terminated: true }` → `data.contracts[0].terminated === undefined`.

Fehlerszenario: Der Verwalter beendet den unbefristeten Mietvertrag von Anna Keller mit «Mietvertrag beenden» auf den 31.03.2099. Die Detailseite zeigt richtig «Unbefristet, gekündigt auf den 31.03.2099». Unter «Mietverträge» steht «01.04.2024 – 31.03.2099, befristet». A-1.3 nennt die Mietvertragsliste ausdrücklich, und der Abschnitt «Umgesetzt» sowie `implementation_plan.md` (Session 15, «the lists add befristet/gekündigt») melden sie als erledigt. Wer in der Liste «befristet» liest, prüft die Kündigung nicht mehr, das ist das Problem, für das A-1 «hoch» war.

Fix:
- Test zuerst: in `contract-actions.test.ts` (dort wird `listLoad` schon geladen) oder `contract-list.test.ts` eine Backend-Antwort mit `terminated: true` → Zeile enthält «gekündigt». Dazu ein `Dann` im Szenario «Gekündigter Mietvertrag bleibt unbefristet», z.B. «Und zeigt die Mietvertragsliste für "Anna Keller" "gekündigt"».
- `terminated: c.terminated === true,` in die Abbildung in `contracts/+page.server.ts` aufnehmen.

### J-2 (niedrig) `terminated` ohne Vertragsende: 400 mit rohem SQL-Text

`backend/src/routes/contracts.ts:37,50,144-150,161-173`, `contract.service.ts:285,343`. Keine Prüfung vor der Datenbank. `contracts_terminated_check` lehnt ab, der `catch` gibt `error.message` von Drizzle weiter.

Mit Sonde 1 geprüft: `PUT { terminated: true }` auf einen unbefristeten Vertrag → 400 `"Failed query: update \"rental_contracts\" set \"terminated\" = $1, \"updated_at\" = $2 where … returning \"id\", \"apartment_id\", … params: true,2026-10-12T…,<id>"`. `POST` mit `terminated: true` ohne `endDate` → 400 `"Failed query: insert into \"rental_contracts\" …"`.

Fehlerszenario: Eine künftige Funktion (A-4 «Nachmieter suchen», A-6 «Unbefristet weiterführen») oder ein Skript setzt die Kündigung getrennt vom Datum. Statt einer klaren Meldung kommt eine SQL-Anweisung mit Spaltenliste und Werten zurück. Aus dem heutigen UI nicht erreichbar: `contractBody` und die Aktion «Beenden» senden `terminated: true` nur mit Datum. Kein 500, die Datenbank hält die Regel.

Fix: In `checkNewDates`/`createContract` vor dem Schreiben prüfen: `terminated === true` und kein Vertragsende (neu oder gespeichert) → `throw new Error('A notice needs an end date')`. pg-Test in `contract-end.pg.test.ts`: `PUT { terminated: true }` auf einen unbefristeten Vertrag → 400 mit dieser Meldung. In `api-specification.md` bei `POST`/`PUT` ergänzen: «`terminated` needs an `endDate`; a new `endDate` without `terminated` keeps the stored flag».

### J-3 (niedrig) Reihenfolge und Zusammenfassung der Gebäude in der Erinnerung

`src/routes/dashboard/+page.server.ts:77`. Die Namen kommen in der Reihenfolge der Mietvertragsliste, also absteigend nach Vertragsbeginn (`contract.service.ts:135`), und werden über den Namen zusammengefasst.

Fehlerszenario 1: Gebäude «Seeblick» (Vertrag seit 2020), «Lindenhof» (neuer Vertrag ab 01.08.2025), «Ahornhof» (seit 2023). Das Backend liefert die Verträge in der Reihenfolge Lindenhof, Ahornhof, Seeblick, die Übersicht schreibt «Noch nicht abgerechnet: Lindenhof, Ahornhof, Seeblick.» Ein neuer Mietvertrag ändert die Reihenfolge. Der Unit-Test (`dashboard.test.ts:15-21,105`) gibt die Verträge nicht in der Reihenfolge des Backends und prüft «Seeblick, Lindenhof, Ahornhof.», eine Reihenfolge, die das echte Backend nicht liefert.

Fehlerszenario 2: Zwei Gebäude «Seeblick» in Winterthur und in Uster, beide ohne Abrechnung. Die Erinnerung nennt «Seeblick» einmal. Erstellt der Verwalter die Abrechnungen für das eine, bleibt die Erinnerung mit demselben Wort stehen, und er weiss nicht, welches gemeint ist.

Fix: Namen sortieren (`.sort((a, b) => a.localeCompare(b, 'de-CH'))`) und den Test auf die Backend-Reihenfolge stellen. Für gleichnamige Gebäude über die Wohnung zusammenfassen (`apartmentId` → Gebäude aus `apartments?limit=1000`, das der Loader schon liest) oder `buildingId` in `contractFields` aufnehmen. Das zweite ist selten und darf in `offene-punkte.md`.

### J-4 (niedrig) Übersicht und Assistent zählen eine Abrechnung verschieden

`src/routes/dashboard/+page.server.ts:60-65` mit `backend/src/services/statement.service.ts:91-92`: abgerechnet ist ein Vertrag, wenn eine Abrechnung **ganz in** der Periode liegt. `src/lib/server/statement-generation.ts:49-52`: abgerechnet ist ein Vertrag, wenn eine Abrechnung die Periode **überlappt**. Der Assistent lässt die Periode frei wählen (`statements/generate`, Vorschlag aus der Einstellung). Das bestand pro Gebäude schon vorher; pro Mietvertrag trifft es jetzt jeden einzelnen Vertrag.

Fehlerszenario: Die Einstellung war «Juli–Juni», für Bruno Meier gibt es die Abrechnung 01.07.2024–30.06.2025. Der Verwalter stellt auf «Kalenderjahr» um. Die Übersicht nennt für 2025 «Noch nicht abgerechnet: Ahornhof», weil die Abrechnung nicht ganz in 2025 liegt. Der Assistent für 01.01.–31.12.2025 findet Brunos Vertrag als abgerechnet (Überlappung) und erstellt nichts. Die Erinnerung bleibt, ohne dass der Verwalter sie erledigen kann. Dasselbe gilt für eine frei gewählte Periode über den Jahreswechsel.

Fix: Eine Regel für beide, z.B. eine Funktion `billedContracts(statements, period)` in `$lib`, die beide Stellen nutzen. Fachlich entscheiden, ob «überlappt» oder «liegt ganz darin» gilt. Bis dahin als offenen Punkt in `offene-punkte.md`.

### J-5 (niedrig) Testlücken

- `tests/e2e/features/dashboard.feature:109-117`, «Erinnerung endet mit der Abrechnung jedes Mietvertrags der Periode», ist auch mit dem alten Code grün: Ahornhof ist heute leer und wurde vorher nie genannt, Seeblick (Anna, ohne Abrechnung) wurde immer genannt. Das Szenario zeigt A-9.2 nicht. Fix: Ahornhof mit zwei Mietverträgen der Periode, dem ausgezogenen Bruno und einer laufenden Mieterin; mit Abrechnung nur für die Mieterin wird Ahornhof genannt, mit beiden nicht. Die erste Hälfte scheitert mit dem alten Code.
- Kein Test prüft «gekündigt» in einer Liste: weder `/contracts` (daher J-1) noch Wohnung oder Mieter (`toContractHistory`, `ContractHistory.svelte`, `TenantContracts.svelte`). Fix: Unit-Test für `toContractHistory` mit `terminated: true` und der Test aus J-1.
- `tests/e2e/steps/contract-detail.steps.ts:111,115`: «endet der Mietvertrag heute» und «endet der Mietvertrag am …» prüfen jetzt `toContainText` statt `toHaveText`. Die drei Szenarien mit «Beenden» (`contract-detail.feature:22,28,35`) sind damit grün, ob die Seite «Befristet bis» oder «Unbefristet, gekündigt auf den» zeigt; A-1.2 («Beenden» setzt immer *gekündigt*) prüft im Browser nur das neue Szenario mit 2099. Fix: In diesen drei Szenarien den ganzen Text prüfen («Dann zeigt der Mietvertrag "Unbefristet, gekündigt auf den 31.12.2099"»). `contract-edit.feature:41` (Ende unter «Bearbeiten», also befristet) kann «Befristet bis 31.03.2025» prüfen.
- `tests/e2e/steps/contract-form.steps.ts:203`, «zeigt die Vertragsdauer …», prüft den Text der ganzen Gruppe. Es ist auch grün, wenn «Befristet» gewählt ist. Der DOM-Test prüft die Auswahl; im Szenario genügt `getByRole('radio', { name: … })` mit `toBeChecked()`.
- `dashboard.test.ts:19-20` prüft nur die Tage ausserhalb der Periode, nicht den ersten und letzten Tag darin. Ein `<` statt `<=` fiele nicht auf. Fix: ein Vertrag, der am 01.07.2025 endet.

### J-6 (niedrig) Neue Felder fehlen in den API-Verträgen

`tests/contracts/building-contracts.json`, `tests/contracts/README.md` («braucht das Frontend ein neues Feld, kommt es zuerst ins Beispiel»). Neu liest das Frontend `terminated` (Detailseite, Bearbeiten, Listen), `buildingName` aus `GET /contracts` (Übersicht) und `contractId` aus `GET /statements?periodStart…` (Übersicht). Keines steht in einem Beispiel; `dashboard.test.ts` antwortet mit eigenen Fakes. Benennt das Backend z.B. `contractId` um, bleibt `api-contracts.pg.test.ts` grün, und die Übersicht nennt danach jedes Gebäude mit einem Mietvertrag der Periode als nicht abgerechnet.

Fix: `"terminated": false` und `"buildingName": "Ahornhof"` in `building-contracts.json`; ein Beispiel für die Abrechnungsliste mit `contractId` (oder `statement.json` für den Listen-Endpunkt prüfen) und in `dashboard.test.ts` verwenden.

### J-7 (niedrig) Copy und Glossar

- `src/lib/contract-status.ts:29-45`: «befristet», «gekündigt», «Befristet bis», «Unbefristet, gekündigt auf den» stehen nicht im Glossar (`UBIQUITOUS_LANGUAGE.md` kennt nur «Vertragsende» mit «leer bei unbefristeten Verträgen»). `offene-punkte.md` nennt die Texte «TODO(fachlich prüfen)», im Code fehlt der Vermerk. `offene-punkte.md:27` sagt aber, jede Stelle sei im Code markiert (`grep -rn "TODO(fachlich prüfen)" src`). Fix: `// TODO(fachlich prüfen)` über `contractPeriod` und `contractEnd`, wie in `PeriodStep.svelte:31`.
- A-1.3 verlangt, dass der Assistent einen befristeten Vertrag «Befristet bis TT.MM.JJJJ» nennt. `PeriodStep.svelte:34-38` zeigt nur «Befristet», die gekündigte Option dagegen mit Datum. Fix: entweder das Label wie bei der Kündigung mit `contractEnd(endDate, false)` bilden oder A-1.3 auf Detailseite und Listen beschränken.
- «Kündigung aufheben» ist eine Handlung in einer Gruppe, die sonst Zustände nennt («Vertragsdauer»). Die Folge steht als Beschreibung daneben, wie A-1.4 verlangt. Kein Befund, nur ein Punkt für den nächsten Persona-Lauf: Ob Helga erkennt, dass erst «Speichern» die Kündigung aufhebt.

### J-8 (niedrig) Demodaten zeigen Kündigungen als Befristung

`backend/demo/demo-data.sql:71,82`. Der Vormieter mit der Notiz «Vormieter, ausgezogen per 28.02.2021» und der Mieterwechsel 01.08.2021–30.06.2025 (danach neuer Vertrag ab 01.07.2025) haben ein Vertragsende ohne `terminated`. Die Wohnungs- und Mieterseite zeigen «01.06.2018 – 28.02.2021, befristet». A-1.5 erlaubt das für alte Daten, die Demodaten sind aber das, was Personas und Interessenten sehen; fast jeder Auszug ist eine Kündigung.

Fix: In beiden `INSERT` die Spalte `terminated` mit `TRUE` setzen. `db:demo` fügt nur ein (`ON CONFLICT DO NOTHING`), bestehende Demodatenbanken brauchen `db:reset`.

## Dokumente

- `anforderungen-vertragsende.md`, A-1 «Umgesetzt»: nennt die Mietvertragsliste, die nach J-1 noch falsch ist. Nach dem Fix stimmt der Satz.
- A-1.5 verlangt für A-6 eine Grenze «vereinbartes Ende nach der Einführung von A-1». Dwello speichert dafür nichts; alle bestehenden Verträge haben `terminated = false`. Für A-6 braucht es einen festen Stichtag (Konstante) oder ein Datum am Vertrag. Als Hinweis bei A-6 ergänzen.
- `api-specification.md`: siehe J-2. `data-model.md` und `schema.ts` stimmen mit `0001_schema.sql` überein.
- `implementation_plan.md`, Session 15: vollständig bis auf J-1 («the lists add …»).
