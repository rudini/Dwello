# Code-Review H-28 Mieterformular (#717), Runde 2

Bereich: `git diff ea853e00a ac3027f4c` (ohne docs/reviews, implementation_plan.md, docs/archive), Worktree review-h28f-2 bei ac3027f4c. Vorheriger Bericht: docs/reviews/h28f-review-1.md.

## Status der offenen IDs

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| K-1 | Major | behoben | tests/e2e/steps/tenant-form.steps.ts:83 ruft `seed.noAddress` auf; tests/e2e/fixtures/backend.ts:279-287 sendet Kanal `email` mit E-Mail-Adresse und ohne Adresse. `tenantFieldErrors` liefert dafür `[]`. Das Szenario statement-detail.feature:362 prüft weiter dasselbe `Dann` («Zahlbar durch (Name/Adresse)»). Die Strenge bleibt also gleich. Andere Seeds senden keine ungültige Kombination: `address` wird nur noch mit einer vollständigen Adresse aufgerufen (tenant-form.steps.ts:78). |
| K-2 | Minor | behoben | backend/src/services/tenant-fields.ts:38: Die Form der PLZ wird nur geprüft, wenn `country` CH oder LI ist. POST setzt CH als Standard (Zeile 45). Deshalb bleibt api-contracts.pg.test.ts:193 (`postalCode: '84'` ohne Land) bei POSTAL_CODE_DIGITS. Die Tests tenant-fields.test.ts:61 und tenant-channel.pg.test.ts:108-114 wären auf ea853e00a rot (dort gilt CH als Standard, deshalb wird `78462` abgelehnt). |
| K-3 | Minor | behoben für POST | tenant-fields.ts:44-45, routes/tenants.ts:116. Der Test tenant-channel.pg.test.ts:100-105 wäre auf ea853e00a rot (`'email' in t` ist falsch, deshalb wird 201 zurückgegeben). Der PUT, der nur den Kanal sendet, wird weiterhin nicht gegen die gespeicherte Adresse geprüft. So steht es aber in der api-specification.md:89 («the sent ones are checked»). Keine eigene ID. Alle POSTs aus Fixtures und Backend-Tests gehen weiterhin durch, weil sie nur Namen senden oder einen Kanal mit der passenden Adresse: tests/e2e/fixtures/backend.ts:171, tenant-documents.pg.test.ts:25 und :104, statement-generation, statement-period-overlap, allocable-categories (`create('tenants', {firstName, lastName})`), tenant-channel.pg.test.ts:24, :35, :49 und :90. Die Fälle :60, :66 und :76 erwarten ohnehin 400. |
| K-4 | Minor | offen (bleibt nach Entscheid des Aufrufers im Bericht) | backend/src/services/tenant-fields.ts:18 ist eine Kopie von backend/src/services/building-fields.ts:11 |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| K-5 | Minor | backend/src/services/tenant-fields.ts:43-45, backend/src/db/schema.ts:100, docs/api-specification.md:88 | `newTenantFieldErrors` setzt fehlende Felder auf leer, nicht aber den Kanal. Ein POST ohne `correspondenceChannel` wird mit dem DB-Standard `letter` gespeichert und hat trotzdem keine Adresse, PLZ und Ort. Der Doc-Kommentar «what it does not send is stored empty» und die Regel in der Spezifikation («with `letter` address, PLZ and Ort») gelten für diesen Fall deshalb nicht. Den Standard `letter` in die Prüfung aufzunehmen, würde allerdings jeden POST ablehnen, der nur Namen sendet (Fixtures und Backend-Tests, siehe K-3). Am kürzesten wäre es, den Fall in der Spezifikation zu nennen. Die App selbst sendet immer den Kanal. |

Geprüft: dass die drei neuen Tests ohne die Änderung rot wären (durch Lesen); dass `country` laut Schema (`^[A-Z]{2}$`, routes/tenants.ts:42) nicht leer sein kann und `!!t.country` deshalb nur das Fehlen erkennt; der Text der api-specification.md; dass im Diff nichts ohne Bezug zum Auftrag ist.

## Nicht bestätigt

- Diese Prüfungen habe ich nicht erneut ausgeführt, sie sind vom Aufrufer gemeldet: Backend-type-check; tenant-fields.test.ts, tenant-channel.pg.test.ts, api-contracts.pg.test.ts (87 grün); `bun run lint` und `bun run check`; E2E chromium statement-detail, tenant-new, tenant-edit und tenant-detail (124 grün).
- Ob K-1 mit dem alten Seed rot war, ist vom Aufrufer gemeldet. Ich habe es nur aus dem Code abgeleitet (Bericht Runde 1).
- Ob das PDF eines Mieters mit Kanal `email` sonst anders aussieht als eines mit Kanal `letter`: Ich habe nur gelesen, dass das `Dann` gleich bleibt. Die Erzeugung des PDFs in statement.service.ts habe ich nicht im Einzelnen geprüft.
