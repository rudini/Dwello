# Slice-Review: Abrechnungsliste – Mietstage und fehlendes PDF (#248, #253)

Geprüft: Worktree `review-list-code`, `git diff 87dda97 543b7cc` (1 Commit, 24 Dateien, alle gelesen).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/lib/server/statement.ts:31-38, backend/src/services/statement.service.ts:58,145-152,194 | Die Abrechnung speichert ihre abgerechneten Mietstage schon (`utility_statements.rental_start/rental_end`, notNull, im Listen-Response über `statementColumns` enthalten). Der Diff holt stattdessen die *aktuellen* Vertragsdaten per Join und klemmt sie im BFF an die Periode: doppelte Regel, zweite Wahrheitsquelle, und `toStatement` überschreibt beim Detail-Load die gespeicherten Mietstage mit der ganzen Periode. |
| C-2 | Major | tests/e2e/targets/statements.ts:7-10 (unverändert, durch den Diff betroffen) | `statementRowForYear` erkennt eine Abrechnung an `31.12.${year}`. Die Zeile zeigt jetzt das Mietende statt des Periodenendes; bei einem Auszug in der Periode findet der Locator die Abrechnung nicht mehr. Die Negativprüfung «findet die Abrechnungsliste keine Abrechnung 2025 von "Anna Keller"» (contract-detail.feature:176) wird dadurch vakuum. |
| C-3 | Minor | docs/api-specification.md:209 | `GET /statements` nennt das neue Feld `contract` nicht (entfällt, wenn C-1 die gespeicherten `rentalStart`/`rentalEnd` nutzt; dann diese dort nennen). |
| C-4 | Nit | tests/e2e/targets/accessibility.ts:38 | `bySelector('…', '[data-testid="statement-pdf-missing"]')` statt des vorhandenen `shown('statement-pdf-missing')` (gleiche Wirkung, `.first()` inklusive). |
| C-5 | Nit | src/__tests__/statement-list-load.test.ts:65-98 | Nach C-1 prüfen die drei Klemm-Fälle eine Regel, die nicht mehr im BFF liegt; ein Fall «Liste übernimmt die gespeicherten Mietstage» reicht (die Klemmung testet bereits calculation/contract-end im Backend). |

Ponytail-Review:
- `backend/src/services/statement.service.ts:L15,L58,L145-146,L152,L194`: delete: Join auf `rentalContracts` und Feld `contract`. Die Zeile hat `rentalStart`/`rentalEnd` schon.
- `src/lib/server/statement.ts:L31-38,L77`: delete: `tenancyInPeriod`. Ersatz: `rentalStart: data.rentalStart, rentalEnd: data.rentalEnd`.
- `tests/contracts/statements.json:L23`: shrink: `contract` durch `"rentalStart": "2025-07-01", "rentalEnd": "2025-12-31"` ersetzen.
- `tests/e2e/targets/accessibility.ts:L38`: reuse: `shown('statement-pdf-missing')`.
- net: etwa -20 Zeilen möglich.

## C-1 (Major): gespeicherte Mietstage ignoriert, Regel im BFF dupliziert

**Warum falsch:** `backend/src/db/schema.ts:373-375` speichert pro Abrechnung `rentalStart`/`rentalEnd` als «the billed rent days; the contract's dates may not change them (contract.service.ts, statementsChanged)». `listStatements` liefert sie bereits (`...row.statement`). Der Diff
1. fügt einen Join und ein API-Feld `contract` hinzu, um dieselbe Information aus dem Mietvertrag zu rekonstruieren;
2. kopiert die Klemmregel (`greatest(periodStart, startDate)` / `least(periodEnd, endDate)`, schon in `calculation.service.ts` und `contract.service.ts:303-304`) in den BFF; CLAUDE.md: Geschäftslogik gehört in `backend/src/services`;
3. setzt in `toStatement` bei jeder Antwort ohne `contract`, also beim Detail-Load (`loadStatement`), `rentalStart = periodStart` und `rentalEnd = periodEnd`, obwohl das Backend die echten Mietstage mitliefert. Der Typ verspricht «the Mietvertrag's days within the period», das Detail bekommt aber die ganze Periode. Heute liest nur `StatementRow` das Feld; die nächste Verwendung auf der Detailseite zeigt bei einem Einzug in der Periode falsche Daten.

**Wie zeigen:** `toStatement({ ...statementJson, periodStart: '2025-01-01', periodEnd: '2025-12-31', rentalStart: '2025-07-01', rentalEnd: '2025-12-31' })` ohne `contract` liefert `rentalStart: '2025-01-01'`. Gleiche Zahl auch für die Liste, solange die Vertragsdaten zur gespeicherten Abrechnung passen (das sichert `BilledDaysError`). Gegen die Daten, die das PDF druckt, wird aber nie geprüft.

**Fix:** In `toStatement` `rentalStart: data.rentalStart, rentalEnd: data.rentalEnd`; Backend-Join, `contract`-Feld und `tenancyInPeriod` entfernen; im Vertrag `statements.json` die beiden Felder statt `contract` (dann prüft `api-contracts.pg.test.ts` sie gegen die echte API, das Detail-Contract `statement.json` ebenfalls nachziehen, wenn der Detail-Load darauf getestet wird).

## C-2 (Major): Jahres-Locator hängt am Periodenende, das die Zeile nicht mehr zeigt

**Warum falsch:** `statementRowForYear(tenant, year)` filtert die Zeilen auf den Text `31.12.${year}`. Vor dem Diff zeigte jede Zeile `periodStart – periodEnd`; jetzt `rentalStart – rentalEnd`. Für einen Mietvertrag, der in der Periode endet, fehlt `31.12.<Jahr>`:
- `statementOfYearListed(...)` meldet `false`, `openStatement`, `statementPdfLink`, `statementPdfMissingLink` finden nichts;
- `listedStatementsOfYear(...)` zählt 0. Das macht die Negativprüfung in contract-detail.feature:176 («Entwurf löschen und Mietvertrag beenden», Ende `2025-03-31`) vakuum: Bleibt der Entwurf durch einen Fehler stehen, während das Ende gespeichert wird, zeigt die Zeile `01.01.2025 – 31.03.2025`, der Locator findet sie nicht und die Prüfung «keine Abrechnung 2025» besteht trotzdem. Das ist weniger streng als vorher (tests/e2e/CLAUDE.md: gleiche Strenge, Negativprüfungen).

**Wie zeigen:** In jenem Szenario den Löschschritt des Entwurfs im Backend auslassen, das Beenden aber zulassen: Die Prüfung bleibt grün.

**Fix:** Den Locator an etwas binden, das die Abrechnungsperiode eindeutig nennt, z. B. die Abrechnungsnummer (`NK-…-${year}-`, `calculation.service.ts:444`), die die Zeile weiter zeigt.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`: vom Aufrufer gemeldet.
- Ganze `bunx vitest run` (2625): vom Aufrufer gemeldet; selbst neu ausgeführt nur `statement-list-load.test.ts`, `statement-pages.dom.test.ts`, `statement-mapping.test.ts`: 95 grün.
- `backend/src/__tests__/api-contracts.pg.test.ts` (27): vom Aufrufer gemeldet.
- E2E statements-Features (49) und axe-/Sprachzeilen des Screens `statements` inkl. `pdf-missing` (12): vom Aufrufer gemeldet. Ob der a11y-Seed unter `?status=draft` einen Entwurf ohne PDF hat, habe ich nicht im Seed nachgesehen; `Wait.until(on.pdfMissing)` würde sonst scheitern.
- Rot ohne die Änderung (durch Lesen beurteilt): die drei list-load-Fälle, die DOM-Fälle zu #248 und #253 (ausser dem Gegenfall «mit PDF», der auch vorher grün ist und als Abgrenzung dient) und die drei neuen Szenarien schlagen ohne den Diff fehl.
- Übersetzungen von «PDF noch nicht erstellt» in fr/it/en passen zu den vorhandenen `statements_pdf_created`; ein eigener Eintrag in `docs/design/i18n-begriffe.md` existiert nicht und ist für «PDF» nicht nötig.
- Tokens/Komponente des Links (`min-h-12`, `text-accent`, `hover:text-accent-strong`): wie in `src/lib/ui/PageHeader.svelte:28`; Design-Guard vom Aufrufer gemeldet.
