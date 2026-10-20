# Code-Review #454 (#408 Punkte 1, 7, 8), Runde 1

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/review-454-code` (5dde9bb9), Range `6095bab9f8b1..5dde9bb9` ohne `docs/reviews`, `implementation_plan.md`, `docs/archive`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | backend/src/services/statement-invoices.service.ts:68 | `CORRECTED = ['sent', 'paid', 'settled']` lässt den Status `overdue` weg. `getStatement`/`listStatements` geben einer versendeten Abrechnung nach der Zahlungsfrist den Status `overdue` (statement.service.ts:210–216, 302–308). Eine überfällige Abrechnung mit nachträglicher Rechnung bekommt deshalb keine Aufgabe «Abrechnung berichtigen», «Nicht berichtigen» wird mit `STATEMENT_CORRECTION_NOT_DUE` abgelehnt, und die Abrechnungsseite sagt fälschlich «… Sie müssen die Abrechnung nicht berichtigen.» |
| C-2 | Minor | tests/contracts/statement-changed-invoices.json:1–5; src/__tests__/invoices.test.ts:84–87 | Verträge unvollständig: `correctionDeclinable`, das der BFF liest (`src/lib/server/statement.ts:144`), fehlt im Vertrag. `toInvoice` liest `inPeriod` aus einem selbst geschriebenen Objekt statt aus `tests/contracts/invoice-list.json`, das keine Antwort mit Filter «Abrechnungsperiode» enthält (CLAUDE.md, Gotchas «API contracts»). |
| C-3 | Minor | tests/e2e/fixtures/backend.ts:429–430; tests/e2e/tasks/statement-detail.ts:82–84; tests/e2e/targets/statement-detail.ts:93–98 | Die neuen Funktionen stehen zwischen einem bestehenden Kommentar und dessen Funktion. «Value of the heating oil in the building's tank …» steht jetzt über `changeFuelStock`, und `fuelStock` hat keinen Kommentar mehr. «#338: a draft is calculated again …» steht über `declineCorrection`, «#338: «Neu berechnen» and its confirmation» über den Targets von «Nicht berichtigen». Diese Kommentare beschreiben jetzt den falschen Code. |
| C-4 | Minor | src/lib/server/statement-actions.ts:105–110; src/routes/statements/[id]/+page.server.ts:84–87 | Für den BFF-Aufruf `declineCorrection` und die Action `?/declineCorrection` gibt es keinen Unit-Test. Die Ablehnung (409 mit `STATEMENT_CORRECTION_NOT_DUE` / `…_LOWERS_BALANCE` → `backend_…`-Text im Alert) prüft keine Schicht im Frontend. Nur der Erfolgsfall läuft über E2E. |
| C-5 | Minor | src/routes/invoices/+page.svelte:40–48 | Der Filtertext prüft `periodStart`/`periodEnd` nicht. Bei einer Adresse mit ungültigem Datum nennt die Liste einen Filter «Abrechnungsperiode», den der Loader (`+page.server.ts:19`) gar nicht ans Backend gibt (Text mit `formatDate` eines ungültigen Werts, Liste ungefiltert). Das kommt nur bei einer von Hand geänderten Adresse vor. |
| C-6 | Minor | tests/a11y/screens.json:395–405, 545–556 | Die Zustände der Abrechnungsseite nach «Nicht berichtigen» (Satz `statements_later_sent_declined`, Verlauf «Nicht berichtigt») und «ändert nichts für den Mieter» (`statements_later_sent_none`) sind weder in `screens.json` noch in `accessibility.feature` noch in `sprachen-bildschirme.feature`. Es kommen keine neuen Bedienelemente dazu, nur andere Texte im bestehenden Alert und im Verlauf. Deshalb Minor und nicht Major. Ob fr/it/en dort kein Deutsch zeigen, prüft kein Lauf. |

## C-1 (Major): überfällige Abrechnungen sind nie «zu berichtigen»

**Warum falsch:** `statementChanges` liest den Status aus `getStatement`, und das ist der berechnete Status: `sent` mit `paymentDeadline < today` wird zu `overdue`. `replaceStatement` nimmt deshalb ausdrücklich `['sent', 'overdue', 'paid', 'settled']` (statement.service.ts:796). `CORRECTED` hat `overdue` nicht. Daraus folgt:
- `correctable` ist false, also `correctionDue: false` und `correctionDeclinable: false`.
- `outdatedStatements` nimmt die Abrechnung nicht auf (`changes?.correctionDue`). Die Übersicht zeigt keine Aufgabe «Abrechnung berichtigen». Gerade dieser Fall ist häufig: Die Abrechnung ist versendet, noch nicht bezahlt, und die Frist ist abgelaufen. «Done means» Punkt 2 verlangt die Aufgabe für «a sent or paid statement with the same hint». Der Test `overview.test.ts:365` («vor den überfälligen Abrechnungen», Fachreview V-12: vor der Mahnung *derselben* Abrechnung) beschreibt einen Fall, den das Backend nie liefert.
- `LaterChanges.svelte:37–44` zeigt dann `statements_later_sent_none`: «Für {Mieter} ändert das weder den Saldo noch eine Position. Sie müssen die Abrechnung nicht berichtigen.» Das ist falsch, und zwar auch dann, wenn die Neuberechnung den Saldo ändert. Auf dem Basis-Commit stand hier `statements_later_sent` («… berichtigen Sie mit «Abrechnung berichtigen»»). Für überfällige Abrechnungen ist das also eine Regression.
- `POST /:id/decline-correction` lehnt mit `STATEMENT_CORRECTION_NOT_DUE` ab.

**So zeigt man den Fehler:** In `statement-invoices.pg.test.ts`, «Abrechnung berichtigen fällig», im Helfer `sent` zusätzlich `paymentDeadline: '2020-01-01'` setzen. Dann eine Rechnung vom `2024-02-15` erfassen: `due(id)` ist false statt true, und `GET /statements/outdated` enthält die Abrechnung nicht. Alle neuen Tests und Szenarien nehmen eine Abrechnung mit «Zahlungsfrist in 10 Tagen» oder ohne Frist, deshalb fällt es nicht auf. Ein DOM-Test von `LaterChanges` mit `status: 'overdue'` und `correctionDue: false` zeigt den Satz «Sie müssen die Abrechnung nicht berichtigen». Fix: `overdue` in `CORRECTED` aufnehmen. Dazu gehören ein pg-Test und eine Szenariozeile in `dashboard.feature` mit einer überfälligen Abrechnung.

## Ponytail-Review

- `src/routes/invoices/InvoiceItems.svelte:26–40`: shrink: `{#if !grouped}…{/if}` und `{#each grouped ? groups : [] …}` sind zwei Zweige für eine Wahl. Mit `{#if grouped}…{:else}…{/if}` geht es mit einer Zeile weniger. (Funktioniert so, daher kein Befund.)
- Sonst sind die neuen Teile genutzt. `invoiceExists` ist gelöscht (war auf der Basis ungenutzt).

net: -1 lines possible.

## Geprüft und in Ordnung

- Regel 1 als `inPeriodOf`: Teilen sich `listInvoices` und `getInvoicesForStatement`, dieselbe Auswahl. E-1: alle Rechnungen, umlagefähige zuerst (`orderBy desc(isValidUtilityCost)`), gruppiert in `InvoiceItems`. «davon CHF …» aus `inPeriod`. BFF validiert die Daten (Regex), Backend `format: 'date'`.
- Link der fehlenden Abrechnung (Übersicht und Mietvertrag): Gebäude-ID und Periode, auch über den Jahreswechsel (Szenario 2023-07-01 – 2024-06-30) und älter als fünf Jahre (`invoices.test.ts`, 2019/2020). Der Jahresfilter bleibt. Der Mietvertrag nimmt die angebotene Periode (`way`, Fachreview V-2).
- Tankbestand (E-2, V-3): `sameStock` vergleicht Kategorie, Stichtage und Werte gegen `agreedStock` von heute. Ist `agreedCategoryIds` null, gelten alle Kategorien. Dazu pg-Tests für geändert, gelöscht, neu, nicht vereinbart und dieselben Werte.
- `correctionDue` (E-3, V-18, V-21): nur mit Hinweis UND anderem Ergebnis; nach «Nicht berichtigen» nur, wenn sich das Ergebnis vom gespeicherten unterscheidet. `correctionDeclinable` nur bei höherem Saldo (M-3 B). Jeder Fall hat einen pg-Test. `recalculated()` teilt die Berechnung mit `recalculateStatement`; diese verhält sich weiter gleich (Saldo mit `priorPayments`, `replacesId`).
- Route `/outdated` steht vor `/:id`. `result` geht nicht an den Client (Route entfernt es, `toStatement` übernimmt nur `on`). Ablehnungen mit Code und `backend_…`-Text in allen vier Sprachen.
- Übersicht: «{count} Entwürfe sind nicht aktuell» vor den Entwürfen, je Gebäude und Periode ein Link (Abrechnungsliste unterstützt `building`, `periodStart`, `periodEnd`, `status`). Die Entwurfsaufgabe zählt nur aktuelle. Texte E-4/E-5 wörtlich. Fünf Jahre nach dem Kalender (29.02. → 28.02.). Ein Ladefehler von `/outdated` ergibt `[]` (Test).
- Messages: alle neuen und geänderten Schlüssel in de/fr/it/en (gleiche Schlüsselmenge in allen vier Diffs).
- a11y: `invoices/period-filter` und `statement-sent-detail/decline-dialog` in `screens.json` (mit `stateMeanings`), `accessibility.feature` und `sprachen-bildschirme.feature`. Die neuen Aufgaben der Übersicht zeigt `dashboard/default` (Seed mit nachträglicher Rechnung 2025).
- Migration 0029: `ADD COLUMN correction_declined JSONB`, nullable, passt zu `schema.ts`. Sie ist für sich korrekt; die Nummer wird beim Merge angepasst.
- E2E-Schichten: Steps rufen nur Tasks und Questions auf. Questions liefern Texte und Anzahlen. Features beschreiben Fachliches. Negativprüfungen stehen nach einer positiven Prüfung. Kein Szenario trägt `@wip`.
- `toContract` aus `load` gezogen: gleiche Felder und Defaults (`||`-Semantik bleibt), laut Commit wegen der fallow-Komplexität der berührten Datei.
- Rote Tests: Die Tests kamen in `chore(tests)`-Commits vor dem Code. Sie lesen Felder und Texte, die es auf der Basis nicht gibt. Das als «kept behaviour» bezeichnete Szenario («Kein Hinweis, wenn der Tankbestand … unverändert ist») besteht auf der Basis und ist kein Bugfix.

## Nicht bestätigt

- bun run lint, bun run check, cd backend && bun run type-check, bunx fallow audit: vom Aufrufer gemeldet.
- vitest der betroffenen Dateien: vom Aufrufer gemeldet. Mein Lauf (`bunx vitest run …`) im Worktree war nicht möglich, weil `node_modules` auf `/home/user/Dwello` verweist und dort gesperrt ist.
- Backend-Tests: `statement-invoices.pg.test.ts` und `invoice-period-filter.pg.test.ts` selbst gelaufen (42 grün, `dwello_test_r454c`). `api-contracts.pg.test.ts` und die übrige Suite: vom Aufrufer gemeldet.
- E2E (fünf Features, a11y- und Sprachzeilen auf 5dde9bb9): vom Aufrufer gemeldet bzw. noch laufend. Ob `decline-dialog` den Knopf findet (Bruno 2025 im Seed muss `sent` und nicht `overdue` sein, siehe C-1) und ob die Gruppenüberschriften `h3` in der Rechnungsliste axe `heading-order` bestehen, hängt an diesem Lauf. Gelesen habe ich `tests/e2e/fixtures/screens.ts:76–102`.
- Die vom Aufrufer gemeldeten «Timeouts unter Last» in der ganzen vitest-Suite: Die Dateinamen kenne ich nicht, deshalb kann ich nicht prüfen, ob eine geänderte Datei darunter ist.
- Löschung von `invoiceExists` (invoice.service.ts, auf der Basis ungenutzt): Der Commit nennt sie, aber nicht, ob fallow sie verlangt hat. `commit-gates` blockiert nur *neue* ungenutzte Exporte. Verlangt das Gate sie nicht, ist es eine von der Anforderung unabhängige Änderung (ohne Verhaltensänderung). fallow habe ich nicht laufen lassen.
- Marker `TODO(fachlich prüfen, #538)` in `schema.ts`: nicht geprüft, ob Issue #538 offen ist und das richtige Label hat (`open-work`/`check-issues` nicht gelaufen).
