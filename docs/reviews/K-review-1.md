# Review K, Runde 1 – Bevorstehendes Vertragsende, Abrechnung nach einem geänderten Vertragsende

Unabhängiges Review der zwei Commits nach a7571ac auf `claude/relaxed-ride-tciycq`: 9c46bbf «feat(contracts): show an upcoming contract end» (A-4) und fc88fcf «feat(contracts): recreate a statement after an end» (A-10). Massstab sind `docs/anforderungen-vertragsende.md` (A-4 und A-10; die Absätze «Umgesetzt» beschreiben bewusste Abweichungen), `CLAUDE.md` (Design-Regeln, Workflow, i18n), `backend/CLAUDE.md` und `tests/e2e/CLAUDE.md`.

Gelesen: `git diff a7571ac..fc88fcf` vollständig. Im Backend `apartment.service.ts` (`currentContractEnd`, `apartmentStatus`, `nextContractStart`), `contract.service.ts` (`listContracts`, `checkContractOverlap`, `statementsChanged`, `checkNewDates`, `updateContract`), `statement.service.ts` (`statementFilterConditions`, `listStatements`, `getStatement`, `deleteStatement`), `0001_schema.sql` (Fremdschlüssel von `utility_statements`), `demo/demo-data.sql`. Im Frontend `dashboard/+page.server.ts`, `TaskList.svelte`, `lib/overview.ts`, `lib/apartment.ts`, `lib/server/apartment.ts`, `apartments/+page.server.ts`, `ApartmentFacts.svelte`, `ApartmentCard.svelte`, `apartments/[id]/edit/+page.server.ts`, `StatusField.svelte`, `buildings/[id]/+page.server.ts`, `ApartmentsByFloor.svelte`, `contracts/[id]/+page.server.ts`, `+page.svelte`, `NextSteps.svelte`, `MissingStatement.svelte`, `RefusedStatements.svelte`, `ContractForm.svelte`, `contracts/new/+page.server.ts`, `ContractWizard.svelte`, `ApartmentStep.svelte`, `lib/contract-wizard.ts`, `lib/contract-form.ts`, `lib/utils/contract-availability.ts`, `ui/ActionDialog.svelte`, `ui/Button.svelte`, `api/statements/[id]/+server.ts`, `statements/generate/+page.server.ts`, `StatementWizard.svelte`, `StatementStep.svelte`, `lib/server/statement-generation.ts`, `lib/server/statement.ts`, `lib/names.ts`, `CostTable.svelte`, `svelte.config.js`. Tests: alle neuen und geänderten Unit-, DOM-, pg- und E2E-Tests (Liste in `implementation_plan.md`, Session 17), `tests/contracts/*.json`, `tests/a11y/screens.json`, `interactions/accessibility.ts`. Dokumente: `anforderungen-vertragsende.md` (A-4, A-10), `api-specification.md`, `offene-punkte.md`, `i18n-begriffe.md`, `implementation_plan.md` (Session 17), `J-review-1.md`.

Ausgeführt:
- `bunx vitest run` für `apartment`, `buildings-i18n`, `contract-actions`, `contract-detail-page.dom`, `contract-edit.dom`, `dashboard`, `overview`, `settings`, `statement-generate-actions`, `statement-mapping`, `statement-wizard.dom`, `no-german-in-code`, `backend-codes`, `design-guard`, `tokens`: 15 Dateien, 925 Tests grün.
- Backend `bun test --preload ./scripts/test-db.ts` für `apartment-status.pg.test.ts`, `api-contracts.pg.test.ts`, `contract-end.pg.test.ts`: 38 grün. `bun run type-check`: sauber.
- `bun run lint` und `bun run check`: sauber (0 Fehler, 0 Warnungen).
- Zwei Sonden, danach gelöscht:
  1. Temporärer pg-Test im Backend: `GET /statements?buildingId=not-a-uuid&…` und `GET /contracts?buildingId=not-a-uuid&limit=1000` → **500** mit Klartext `Failed query: select …` (kein JSON). Ebenso `periodStart=2025-02-30` (passiert die Prüfung `isDay` im Assistenten) → 500.
  2. Temporärer Vitest gegen `load` und `actions.preview` aus `statements/generate/+page.server.ts` mit `?building=not-a-uuid&start=2025-01-01&end=2025-12-31` und einem Backend, das wie in Sonde 1 antwortet: `defaultBuildingIds` = `['not-a-uuid']`, die Vorschau gibt `fail(400, { error: "Unexpected token 'F', \"Failed que\"... is not valid JSON" })` (K-5).
- E2E, volle Suiten und Server nicht ausgeführt.

**Ergebnis:** A-4 und A-10 sind im Kern richtig umgesetzt. Die Aufgabe «Nachmieter … suchen» erscheint ab dem Tag der Erfassung bis zum Vertragsende, erkennt einen späteren Vertrag derselben Wohnung und verdrängt die Frist; `currentContractEnd` ist eindeutig, weil Verträge einer Wohnung sich nicht überschneiden dürfen; «Vermietet bis …» erscheint in Wohnungsliste, Wohnungsseite, Gebäudeseite und im Statusfeld unter «Bearbeiten». Die Ablehnung verlinkt jede Abrechnung, die Aktion im Dialog prüft serverseitig, dass nur ein Entwurf dieses Mietvertrags gelöscht wird und ein vergangenes Ende bestätigt ist, und leitet in den Assistenten mit Gebäude und Periode. Texte sind in allen vier Sprachen, mit Sie/vous/Lei und den Begriffen aus `i18n-begriffe.md`. Zwei Findings «mittel»: Die «Nächsten Schritte» stehen auf jedem gekündigten Mietvertrag für immer, auch Jahre nach dem Auszug und mit Nachmieter (K-1, in den Demodaten sichtbar), und das Angebot «Entwurf löschen und …» bleibt nach einer Änderung von Datum oder Feldern stehen und löscht dann einen Entwurf, den die neuen Werte gar nicht betreffen, oder löscht ihn und speichert nichts (K-2). Dazu sieben Findings «niedrig».

## Prüfung von A-4

| Fall | Ergebnis |
|---|---|
| Grenze «heute» | `String(c.endDate) >= today` mit `localToday()` (Schweizer Zeit): Am letzten Tag erscheint die Aufgabe noch, am Tag danach nicht mehr. Nicht getestet (K-8). Dass sie ohne Nachmieter am Tag nach dem Ende verschwindet, siehe K-6 |
| Nachmieter erkannt | Jeder Vertrag derselben Wohnung mit `startDate > endDate`, nicht nur einer ab dem Tag danach. Ein Vertrag ab dem gleichen Tag ist durch die Überschneidungsprüfung ausgeschlossen. Laut «Umgesetzt» gewollt; kein Befund |
| Liste mit 1000 Verträgen | `listContracts` kappt `limit` nicht, sortiert nach Vertragsbeginn absteigend. Bei unter 50 Wohnungen reicht es. Fällt die Liste aus, verschwindet die Aufgabe still, wie bei A-9. Kein Befund |
| Reihenfolge, Anzahl | Nach den übrigen Aufgaben, das früheste Ende zuerst (Unit-Test). Pro Kündigung eine Karte; ohne andere Aufgaben wird die erste zur Hauptaktion der Übersicht (`TaskList.svelte`). Bei unter 50 Wohnungen tragbar |
| Frist «Vertragsende» | Entfällt für jeden gekündigten Vertrag, auch für einen, der keine Aufgabe (mehr) hat (K-6) |
| `currentContractEnd`, `limit 1` ohne Ordnung | Unkritisch: `checkContractOverlap` verhindert zwei laufende Verträge einer Wohnung (`createContract`, `checkNewDates`). «Heute» rechnet das Backend in UTC (bekannt, IF-10) |
| Abbildungen | Wohnungsliste, Wohnungsseite (`fetchApartment`), Gebäudeseite, Statusfeld unter «Bearbeiten» (dasselbe `fetchApartment`, `statusText`) zeigen «Vermietet bis …». Mieterseite bewusst nicht (Abweichung). Mit nahtlosem Nachmieter siehe K-4 |
| «Nächste Schritte», `/contracts/new?apartment=…` | Der Assistent übernimmt die Wohnung (`initialContractValues`), die Verfügbarkeit nennt den Tag nach dem Ende als frühesten Beginn. Der Abschnitt erscheint aber zu lange (K-1) |

## Prüfung von A-10

| Stelle | Ergebnis |
|---|---|
| Backend-Ablehnung | `periodStart`, `buildingId` über `innerJoin(apartments)`; `utility_statements.apartment_id` ist `NOT NULL`, es fällt also keine Abrechnung aus der Ablehnung. API-Vertrag nachgeführt |
| `endDeletingDraft`: nur ein Entwurf dieses Mietvertrags | Richtig (`ownDraft`: `contractId` und `status === 'draft'`; zusätzlich lehnt `deleteStatement` Nicht-Entwürfe ab). Unit-Test vorhanden |
| … vergangenes Ende | Richtig, `endDay` prüft vor dem Löschen (Unit-Test) |
| … PUT nach dem Löschen abgelehnt | Entwurf weg, Vertrag unverändert. Im Dialog praktisch nur bei einem Wettlauf erreichbar; unter «Bearbeiten» planbar erreichbar (K-2). Ungetestet (K-8) |
| … CSRF/XSRF | Form-Actions sind durch `csrf.checkOrigin` geschützt, wie alle übrigen Actions; der XSRF-Header gilt nur für `src/routes/api`. Kein Befund |
| … Weiterleitung | `303` auf `/statements/generate?building=…&start=…&end=…` aus der gelesenen Abrechnung; richtig. Ohne Bestätigung, dass der Vertrag beendet ist (K-3) |
| `deleteDraftAndSave` | Validiert vor dem Löschen, `busy` am Knopf. Fehlerpfade siehe K-2 und K-7 |
| `RefusedStatements.svelte` | Links mit sprechendem Namen («Nebenkostenabrechnung NK-… öffnen»), Folge als Text vor dem Knopf. Im Dialog stehen Links und Knopf vor der Fehlermeldung, die den Fokus erhält (K-3) |
| `missingStatement` | Grenzen mit beiden Tagen eingeschlossen, auch Juli–Juni; Vertrag ohne Mietstage in der Periode (später begonnen, früher beendet) ergibt nichts; Abrechnungen der Wohnung, gefiltert auf `contractId`. `building` fehlt nie (Vertrag → Wohnung → Gebäude, alle `NOT NULL`). Zählt eine Abrechnung nur, wenn ihre Periode ganz in der abgefragten liegt, der Assistent zählt Überlappung: dieselbe Lücke wie J-4 |
| Assistent mit Vorauswahl | Entwurf im Browser übersprungen (gewollt). Heizprofil und Pauschale aus `limit=1`: `listStatements` sortiert nach `statementDate` absteigend, also die jüngste Abrechnung, nicht beliebig. Ohne Prüfung der Parameter direkt Schritt 3 (K-5) |
| Heizprofil auf der Detailseite | `leftJoin` (Spalte nullable, `ON DELETE SET NULL`), `localName` in der UI-Sprache. Richtig |

## Übersicht Findings

| # | Schwere | Finding |
|---|---|---|
| K-1 | mittel | «Nächste Schritte» erscheint auf jedem gekündigten Mietvertrag für immer, auch nach dem Auszug und mit Nachmieter; «Neue Adresse eintragen» führt dann zum Mieter, der vielleicht eine andere Wohnung mietet |
| K-2 | mittel | Das Angebot «Entwurf löschen und …» bleibt nach einer Änderung stehen; es löscht dann einen Entwurf, den die neuen Werte nicht betreffen, oder löscht ihn und speichert wegen einer Überschneidung nichts |
| K-3 | niedrig | Dialog: Links und Löschknopf stehen vor der Fehlermeldung, die den Fokus erhält; der zweite Knopf hat keinen Busy-Zustand, keine Fokusführung bei einer Ablehnung und keine Bestätigung nach dem Erfolg |
| K-4 | niedrig | «Vermietet bis 31.03.» auch mit einem Nachmieter ab 01.04.: liest sich wie ein bevorstehender Leerstand |
| K-5 | niedrig | Assistent mit Vorauswahl springt ohne Prüfung von Gebäude und Periode in Schritt 3; ein unbekanntes Gebäude endet in «Unexpected token 'F' … is not valid JSON» |
| K-6 | niedrig | Übersicht: Ohne Nachmieter verschwindet die Aufgabe am Tag nach dem Ende; ein gekündigter Vertrag mit Nachmieter hat weder Aufgabe noch Frist. Beides weicht von A-4.1 und A-4.4 ab, ohne Begründung |
| K-7 | niedrig | `deleteDraftAndSave`: ein abgelehntes Löschen zeigt «nicht gespeichert» statt der Meldung des Backends, das Angebot bleibt |
| K-8 | niedrig | Tests: Akzeptanzkriterium «Abrechnung nicht mehr auffindbar» fehlt im Szenario, ein `Dann` prüft nur die URL, Lücken bei «heute» und beim PUT nach dem Löschen, Zustand «abgelehnt» unter «Bearbeiten» nicht im axe-Check |
| K-9 | niedrig | `api-specification.md`: `heatingProfile` in `GET /statements/:id`, `currentContractEnd` in `GET /apartments/:id`, `heatingProfileId`/`managementFeePercent` in der Abrechnungsliste fehlen |

## Findings

### K-1 (mittel) «Nächste Schritte» auf jedem gekündigten Mietvertrag, auch Jahre nach dem Auszug

`src/routes/contracts/[id]/NextSteps.svelte:14`, `src/routes/contracts/[id]/+page.svelte:123-127`. Die einzige Bedingung ist `terminated`. Ob der Vertrag schon geendet hat oder die Wohnung schon einen Nachmieter hat, prüft der Abschnitt nicht, anders als die Aufgabe in der Übersicht (`noticed`, `dashboard/+page.server.ts:91`).

Fehlerszenario (Demodaten, `backend/demo/demo-data.sql:80-86`): Der Vormieter-Vertrag `b0000001-…-099` (Mieter `a0000001-…-009`, 01.06.2018 – 28.02.2021) ist gekündigt. Seine Seite zeigt heute, 2026, «Nächste Schritte: Der Mietvertrag ist gekündigt. Erfassen Sie den Mietvertrag des Nachmieters, sobald er unterschrieben ist. Für die Schlussabrechnung braucht es die neue Adresse des Mieters.» mit «Nachmieter erfassen» und «Neue Adresse eintragen». Die Wohnung ist seit 2021 wieder vermietet; derselbe Mieter mietet seit 01.05.2021 eine Wohnung im dritten Gebäude (`b0000003-…-002`). Ein Laie, der der Anleitung folgt, überschreibt die Adresse eines laufenden Mieters oder versucht einen zweiten Vertrag für eine vermietete Wohnung. Die Design-Regel «Prefer guidance» wird hier zur Fehlleitung.

Fix:
- Test zuerst in `contract-detail-page.dom.test.ts`: gekündigter Vertrag mit Ende vor `today` → `contract-next-steps` fehlt.
- Den Abschnitt nur zeigen, solange der Vertrag läuft oder künftig ist (`status !== 'ended'`, `contractStatusOn` ist auf der Seite schon berechnet). «Nachmieter erfassen» zusätzlich nur ohne späteren Vertrag der Wohnung; der Loader kann dafür `contracts?apartmentId=…` lesen (dieselbe Regel wie `noticed`) oder `apartment.nextContractStart` übernehmen.

### K-2 (mittel) Das Angebot «Entwurf löschen und …» bleibt nach einer Änderung stehen

Dialog: `src/routes/contracts/[id]/+page.svelte:66,174-185`. `refused` hängt an `form` aus der letzten Antwort; das versteckte Feld `endDate` nimmt aber den aktuellen Wert des Datumsfelds. Ein neues Datum löscht nur den Fehler am Feld (`$effect`, Zeile 49-54), nicht das Angebot.
Formular: `src/routes/contracts/ContractForm.svelte:57,109-112,139,158-167,236`. `refused` wird nur in `put()` gesetzt, `edited` löscht nur den Fehler des Felds, `errors.form` und `refused` bleiben bis zum nächsten Speichern. Eine Überschneidung ist im Formular nur eine Warnung (`overlapWarning`, `PeriodStep.svelte:110`), `valid()` hält sie nicht auf.

Fehlerszenarien:
1. Dialog «Beenden»: Ende 31.03.2025, vergangenes Ende bestätigt → Ablehnung mit NK-2025-0003 (Entwurf). Der Verwalter merkt den Tippfehler und schreibt 31.03.2099. Das Angebot steht weiter da («Der Entwurf NK-2025-0003 wird gelöscht»). Klick → `endDeletingDraft` mit `endDate=2099-03-31`: Entwurf gelöscht, Vertrag endet 2099, Weiterleitung in den Assistenten 2025. Die Ablehnung hätte es für 2099 nie gegeben; der Entwurf (allenfalls mit von Hand geänderten Notizen und Zahlungsfrist) ist ohne Grund weg.
2. «Bearbeiten»: Vertragsbeginn 01.05.2025 → Ablehnung mit dem Entwurf 2025. Der Verwalter ändert den Beginn auf 01.02.2024; der Vormieter wohnt bis 31.03.2024, die Seite zeigt nur die Warnung. Klick auf «Entwurf löschen und Mietvertrag speichern» → `DELETE /statements/s1` (204), dann `PUT` → 400 Überschneidung. Der Entwurf ist gelöscht, der Mietvertrag nicht gespeichert, die Meldung nennt nur die Überschneidung. Die Abweichung in «Umgesetzt» und in `offene-punkte.md` nennt diesen Fall als Restrisiko; er entsteht aber erst, weil das Angebot zu veralteten Werten gehört.

Fix:
- Tests zuerst: DOM-Test im Dialog (Datum nach der Ablehnung ändern → `delete-draft-and-end` fehlt) und in `contract-edit.dom.test.ts` (Feld nach der Ablehnung ändern → `delete-draft-and-save` fehlt).
- Dialog: das Angebot nur zeigen, solange `endDate` dem abgelehnten Tag entspricht (den Tag in `fail(409, { …, refused, refusedDay })` mitgeben). Formular: in `edited` `refused = []` setzen.
- Besser zusätzlich: Löschen und Speichern in einem Schritt im Backend (z. B. `PUT /contracts/:id` mit `deleteDraft: <id>` in einer Transaktion, die zuerst Überschneidung und übrige Abrechnungen prüft). Dann gibt es den Zustand «Entwurf weg, Vertrag alt» nicht mehr, und die Abweichung in `offene-punkte.md` entfällt.

### K-3 (niedrig) Dialog: Reihenfolge, Fokus, Busy-Zustand und Bestätigung der neuen Aktion

`src/lib/ui/ActionDialog.svelte:79-84`, `src/routes/contracts/[id]/+page.svelte:174-185`.
- `RefusedStatements` steht in `children`, die Fehlermeldung danach. `showRefusal` setzt den Fokus auf die Meldung. Wer mit Screenreader oder Tastatur weitergeht, kommt von der Meldung zu «Abbrechen» und «Mietvertrag beenden» (das wieder abgelehnt wird); Links und «Entwurf löschen und Mietvertrag beenden» liegen davor und werden übersprungen. Unter «Bearbeiten» stimmt die Reihenfolge (Meldung, dann Links und Knopf).
- Das zweite Formular nutzt `use:enhance` ohne Rückruf: kein `busy` am Knopf (Doppelklick sendet zweimal), bei einer Ablehnung (`fail(409, { endError })` ohne `refused`) verschwindet der gedrückte Knopf samt Fokus, und `showRefusal` läuft nicht.
- Nach Erfolg kommt der Verwalter in den Assistenten ohne Meldung, dass der Mietvertrag beendet und der Entwurf gelöscht ist; unter «Bearbeiten» gibt es den Toast (`ContractForm.svelte` `put`), im Dialog nicht.

Fehlerszenario: Screenreader-Nutzerin beendet auf 31.03.2025, hört die Ablehnung, drückt Tab: «Abbrechen». Die angebotene Lösung hört sie nicht. Nach der Lösung landet sie bei «Einstellungen» des Assistenten, ohne Bestätigung, ob der Vertrag beendet ist.

Fix: `RefusedStatements` im Dialog nach der Meldung rendern (z. B. als zweiter Snippet-Slot `afterError` in `ActionDialog`), den Knopf mit `busy` versehen und das Formular mit `dialogSubmit` wie die Hauptaktion senden; vor der Weiterleitung `addToast('success', …)` mit dem Ende und der gelöschten Nummer. DOM-Test: Reihenfolge Meldung vor Knopf.

### K-4 (niedrig) «Vermietet bis …» mit nahtlosem Nachmieter

`src/lib/apartment.ts:105-106`, `backend/src/__tests__/apartment-status.pg.test.ts` («nennt das Ende des laufenden Vertrags», Nachmieter ab `day(41)`). Der Status nennt das Ende auch, wenn der Nachmieter am Tag danach einzieht; die Zeile hat `nextContractStart` schon.

Fehlerszenario: Anna Keller gekündigt auf 31.03.2099, Bruno Meier ab 01.04.2099 erfasst. Wohnungsliste und Gebäudeseite zeigen «Vermietet bis 31.03.2099». A-4 will die Kündigungszeit sichtbar machen, weil Leerstand droht; hier droht keiner, die Übersicht hat die Aufgabe richtig schon entfernt. Der Verwalter sucht trotzdem.

Fix: In `statusText` bei `nextContractStart` = Tag nach `currentContractEnd` «Vermietet» lassen oder «Vermietet bis …, wiedervermietet ab …» zeigen (eine Meldung in vier Sprachen, Begriff «Wiedervermietet» ist im Glossar). Unit-Test in `apartment.test.ts`.

### K-5 (niedrig) Assistent mit Vorauswahl: Schritt 3 ohne Prüfung der Parameter

`src/routes/statements/generate/+page.server.ts:22-33`, `StatementWizard.svelte:62-65`, `src/lib/server/statement-generation.ts:35`. `chosen` prüft nur das Format der Tage, nicht das Gebäude, nicht `start <= end`, nicht ein gültiges Datum. Der Weg zurück aus «Rechnung erfassen» (`schritt=3`) springt nur, wenn Schritt 1 und 2 fehlerfrei sind (`complete`, Zeile 95-96); der neue Weg nicht. Schritt 3 nennt weder Gebäude noch Periode.

Fehlerszenario (Sonden 1 und 2): `/statements/generate?building=not-a-uuid&start=2025-01-01&end=2025-12-31` (abgeschnittener Link, gelöschtes Gebäude mit alter UUID ergibt eine leere Vorschau) öffnet «Einstellungen». «Weiter» → Backend 500 mit Klartext → `call()` liest `response.json()` vor der Statusprüfung → die Seite zeigt «Unexpected token 'F', "Failed que"... is not valid JSON», auf Englisch, ohne Hinweis, was zu tun ist. `start=2025-02-30` endet gleich.

Fix: In `chosen` nur ein Gebäude aus `buildings` übernehmen und `start <= end` mit echtem Datum verlangen, sonst `null` (Unit-Test in `statement-generate-actions.test.ts`). Im Assistenten wie beim Weg zurück nur springen, wenn `selectionErrors` für Schritt 1 und 2 leer sind. In `call()` den Status vor `json()` prüfen (bestehende Schwäche, hier neu von aussen erreichbar).

### K-6 (niedrig) Übersicht: Aufgabe endet mit dem Vertrag, Frist fehlt für gekündigte Verträge mit Nachmieter

`src/routes/dashboard/+page.server.ts:91,149`. A-4.1: «Die Aufgabe verschwindet, sobald für die Wohnung ein Mietvertrag ab dem Tag danach erfasst ist.» A-4.4: Die Frist entfällt «für einen Vertrag mit dieser Aufgabe». Umgesetzt ist: Aufgabe nur bis zum Vertragsende, Frist nie für gekündigte Verträge. «Umgesetzt» beschreibt das Verhalten, nennt es aber nicht unter «Abweichungen» und begründet es nicht.

Fehlerszenarien:
1. Anna Keller gekündigt auf 31.10.2026, kein Nachmieter. Am 01.11.2026 ist die Wohnung leer, die Aufgabe «Nachmieter für Wohnung 2.01 suchen» ist weg, gerade wenn der Leerstand beginnt, den A-4 verhindern soll.
2. Anna Keller gekündigt auf 15.11.2026, Bruno Meier ab 16.11.2026 erfasst. Die Übersicht nennt weder Aufgabe noch Frist «Vertragsende» (vor Session 17: Frist 60 Tage vorher). Wohnungsabnahme und Depot (im Problem von A-4 genannt) erinnert nichts mehr.

Fix: Entweder die Anforderung umsetzen (Aufgabe ohne `endDate >= today`, solange kein späterer Vertrag; Frist für gekündigte Verträge ohne Aufgabe, also `endingContracts` aus `!noticed.has(c.id)`), oder die Abweichung in «Umgesetzt» begründen. Unit-Tests in `dashboard.test.ts` für beide Fälle.

### K-7 (niedrig) Abgelehntes Löschen unter «Bearbeiten» ohne die Meldung des Backends

`src/routes/contracts/ContractForm.svelte:162-166`. `DELETE` gibt bei einem inzwischen versendeten Entwurf `STATEMENT_NOT_DRAFT` (`statement.service.ts:489-491`), die Seite zeigt `contracts_save_failed`. `CLAUDE.md` verlangt `backendMessage()`; die Meldung `backend_statement_not_draft` gibt es. `refused` bleibt mit dem alten Status «draft», das Angebot steht weiter da.

Fehlerszenario: Zweites Fenster versendet NK-2025-0003, im ersten klickt der Verwalter «Entwurf löschen und Mietvertrag speichern» → «Der Mietvertrag wurde nicht gespeichert …» mit demselben Angebot darunter; jeder weitere Klick endet gleich.

Fix: `errors = { form: backendMessage(deleted.error, m.contracts_save_failed()) }` und `refused = []`. DOM-Test mit `DELETE` → 400 `STATEMENT_NOT_DRAFT`.

### K-8 (niedrig) Testlücken

- `contract-detail.feature`, «Entwurf löschen und Mietvertrag beenden»: Das Akzeptanzkriterium «Und ist die Abrechnung 2025 von "Anna Keller" nicht mehr auffindbar» fehlt. Das Szenario wäre auch grün, wenn der Vertrag beendet, der Entwurf aber (z. B. nach einer Änderung an `ownDraft`) nicht gelöscht würde.
- `contract-detail.feature`, «Nächste Schritte nach der Kündigung»: `Dann gilt der neue Mietvertrag für die Wohnung "2.01"` prüft nur `apartment=<id>` in der URL (`contract-detail.steps.ts`), nicht die vorgewählte Wohnung im Assistenten; der Kommentar im Schritt verspricht mehr.
- `contract-edit.feature`, «Entwurf löschen und Mietvertrag speichern»: prüft nur die Weiterleitung, nicht den gespeicherten Vertragsbeginn 01.05.2025.
- `contract-actions.test.ts`: kein Fall «PUT nach dem Löschen abgelehnt» für `endDeletingDraft` (Rückgabe und dass kein Redirect folgt).
- `dashboard.test.ts`: kein Vertrag mit Ende heute (Grenze von `noticed`), keiner mit einem späteren Nachmieter mit Lücke (Unit-Test hat nur `n4` am Tag danach).
- `tests/a11y/screens.json`: der Zustand «abgelehnt mit Angebot» unter «Bearbeiten» (`contract-edit`) fehlt; nur der Dialog (`end-dialog-refused`) ist im axe- und Sprachcheck. Ebenso der Assistent mit Vorauswahl (Schritt 3 direkt).

Die negativen E2E-Prüfungen haben Anker: «keine Frist» nach der positiven Aufgabe, «keine Aufgabe» nach der Belegung von Seeblick. Die neuen Szenarien in `statement-generate.feature` und `statement-detail.feature` scheitern mit dem alten Code aus dem richtigen Grund (Schritt 1 statt Einstellungen, kein `statement-heating-profile`).

Fix: die fehlenden `Dann` ergänzen (bestehender Schritt für «nicht mehr auffindbar» oder `GET` über `fixtures/backend.ts`), die Unit-Fälle nachtragen, `contract-edit` um einen Zustand `refused` erweitern.

### K-9 (niedrig) API-Dokumentation unvollständig

`docs/api-specification.md:67,206,210`. Nachgeführt sind die Wohnungsliste und die 409-Ablehnung. Es fehlen `heatingProfile { id, name, nameDE, nameFR, nameIT, nameEN } | null` in `GET /statements/:id` (`tests/contracts/statement.json` hat es), `currentContractEnd` (und das ältere `nextContractStart`) in `GET /apartments/:id`, das `fetchApartment` liest, sowie `heatingProfileId` und `managementFeePercent` in den Einträgen von `GET /statements`, die der Assistent jetzt liest (`tests/contracts/period-statements.json` hat sie).

Fix: die drei Zeilen ergänzen.
