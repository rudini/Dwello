# Slice-Review Runde 2: Abrechnungsliste – Mietstage und fehlendes PDF (#248, #253)

Geprüft: Worktree `review-list-code2` (detached, c359371), nur das Delta `git diff 543b7cc c359371` (19 Dateien, alle gelesen; die Persona- und Review-Berichte nur auf Ablage und Inhalt zu P-1).

## Stand der Befunde aus Runde 1

| ID | Stand | Beleg |
|---|---|---|
| C-1 | geschlossen | `toStatement` übernimmt `data.rentalStart`/`data.rentalEnd` (src/lib/server/statement.ts:67-68); Join, Feld `contract` und `tenancyInPeriod` entfernt; `statements.json` und `statement.json` tragen die Felder, `api-contracts.pg.test.ts` prüft sie gegen die echte API (vom Aufrufer gemeldet). |
| C-2 | geschlossen | `statementRowForYear` filtert auf `NK-[0-9A-F]{8}-<Jahr>-` (tests/e2e/targets/statements.ts:10); passt zu `generateStatementNumber` (calculation.service.ts:444, Jahr = Jahr des Periodenendes, wie zuvor `31.12.<Jahr>`); die Nummer steht in jeder Zeile (StatementRow.svelte:36). Die Negativprüfung in contract-detail.feature hängt damit nicht mehr an den Mietstagen. |
| C-3 | geschlossen | docs/api-specification.md:211 nennt `rentalStart`/`rentalEnd` und `statements.json`. |
| C-4 | geschlossen | `Wait.until(on.shown('statement-pdf-missing'))`, Target `pdfMissing` entfernt. |
| C-5 | geschlossen | ein Fall «nennt die abgerechneten Tage …» (statement-list-load.test.ts:66-75). |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-6 | Major | src/routes/statements/[id]/PartiesPanel.svelte:42-44 | Die Detailseite setzt einen Teil von #104 um, aber nicht mit dem dort entschiedenen Text: #104 «Decided (product owner)» verlangt «Ihr Mietverhältnis in dieser Periode: … – …», das Delta zeigt «184 Mietstage (01.07.2024 – 31.12.2024)». Zudem ausserhalb von #248/#253. |
| C-7 | Major | src/routes/statements/[id]/PartiesPanel.svelte:42-44, tests/e2e/features/statement-detail.feature | Sichtbare Verhaltensänderung der Detailseite (Daten der Mietstage) ohne Szenario in `tests/e2e/features`; nur ein DOM-Test (statement-pages.dom.test.ts:472-477). |
| C-8 | Nit | src/routes/statements/[id]/PartiesPanel.svelte:43 | Template-Literal in `{…}` statt Markup: `{m.statements_rental_days({ days: statement.rentalDays })} ({formatDate(statement.rentalStart)} – {formatDate(statement.rentalEnd)})` (ponytail: shrink). |
| C-9 | Nit | implementation_plan.md:12 | «Files: … (list joins the contract dates)» ist nach C-1 veraltet; die Liste übernimmt die gespeicherten Daten. |

Ponytail-Review des Deltas: das Delta ist netto kürzer (Join, Typfeld, Hilfsfunktion, zwei Testfälle, ein Target entfernt). Einziger Punkt: C-8.

## C-6 (Major): Teilumsetzung von #104 mit einem anderen als dem entschiedenen Text

**Warum falsch:** Issue #104 ist offen und hat unter «Decided (product owner)» festgelegt, dass die Detailseite die Daten des Mietverhältnisses in der Periode mit dem Satz «Ihr Mietverhältnis in dieser Periode: … – …» zeigt. Das Delta zeigt die Daten stattdessen als Klammerzusatz zu «184 Mietstage» unter der Beschriftung «Mietstage in der Abrechnungsperiode». CLAUDE.md, «Coding guidelines»: jede Änderung an einem entschiedenen Text ausser den dort erlaubten ist Sache des Product Owners; «When to ask»: Arbeit ausserhalb der Anfrage (die Anfrage nennt #248 und #253, nicht #104) braucht vorher eine Frage. Der Code-Kommentar im DOM-Test beruft sich auf #104, setzt aber dessen Wortlaut nicht um; ein späteres #104 müsste die Stelle wieder ändern.

**Wie zeigen:** `gh api repos/rudini/Dwello/issues/104` «Decided»-Abschnitt gegen `statement-pages.dom.test.ts:476` (`'184 Mietstage (01.07.2024 – 31.12.2024)'`).

**Fix:** entweder die Detailänderung aus dem Slice nehmen (P-1 betrifft die Liste; deren Zeile nennt jetzt «…, 184 Mietstage», und die Detailseite bleibt #104 überlassen), oder den entschiedenen Satz als neue Meldung in allen vier `messages/*.json` umsetzen, mit Szenario, und #104 im Pull Request als teilweise erledigt nennen; die Abweichung vom Wortlaut sonst unter «Blocked on me».

## C-7 (Major): Detailänderung ohne Akzeptanzszenario

**Warum falsch:** CLAUDE.md, Workflow Schritt 1, und die Pflichtprüfung: jede für den Benutzer sichtbare Verhaltensänderung hat ein Szenario ohne `@wip` in `tests/e2e/features`. Die Detailseite zeigt neu die Daten der Mietstage; kein Feature prüft das (`grep -rn "Mietstage" tests/e2e/features` findet nur das Listenszenario statements.feature:66 und Kommentare). Kein «No scenario: <Grund>» im Delta.

**Wie zeigen:** Die Zeile in PartiesPanel.svelte auf `{m.statements_rental_days(...)}` zurücksetzen: alle E2E-Szenarien bleiben grün.

**Fix:** entfällt, wenn C-6 die Detailänderung herausnimmt; sonst ein Szenario in statement-detail.feature (über eine Question, die den angezeigten Text der Mietstage liefert).

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` (2625), `cd backend && bun run type-check`: vom Aufrufer gemeldet. Selbst neu ausgeführt: `bunx vitest run src/__tests__/statement-list-load.test.ts src/__tests__/statement-pages.dom.test.ts src/__tests__/statement-mapping.test.ts`: 3 Dateien, 95 Tests grün.
- `backend/src/__tests__/api-contracts.pg.test.ts` (27): vom Aufrufer gemeldet; laut Aufrufer vor der PartiesPanel-Änderung gelaufen, Backend und Contracts seither unverändert (im Delta nur ein Commit, nicht weiter prüfbar).
- E2E chromium (210, inkl. statements.feature:66 mit «, 184 Mietstage», contract-detail-Negativprüfung mit dem neuen Locator, axe/Sprachen für `pdf-missing`): vom Aufrufer gemeldet.
- Rot ohne das Delta (durch Lesen): der neue Mapping-Fall (vorher lieferte `toStatement` ohne `contract` das Periodenende/-beginn `2024-01-01`), der list-load-Fall (Contract ohne `contract` ergab `2025-01-01`), die beiden DOM-Fälle (Zeile ohne «184 Mietstage», Detail ohne Daten) und die geänderte Szenariozeile schlagen ohne die Änderung fehl. Der Locator-Wechsel hat keinen eigenen Test; er wird von den bestehenden Szenarien benutzt.
- Ob die längere Zeilenangabe bei 390 px ohne seitliches Scrollen umbricht: nicht selbst gesehen; `break-words` am Container, axe/Layout laut Aufrufer grün.
- Übersetzungen: das Delta verwendet nur die bestehende Meldung `statements_rental_days` (in allen vier Dateien vorhanden); Satzzeichen «, » und «( )» sind in fr/it/en unauffällig.
