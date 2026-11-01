# Code-Review 521c, Runde 1 (Abschlussrunde vor dem Push)

Bereich: `git diff efb682e 9e6e307 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` im Worktree `/tmp/scratchpad/review-521c-code-reviewer` (d4239aa, saubere Zusammenführung, nicht geprüft).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/features/contract-detail.feature:349 | Der neue Schritt «heisst die Datei …» hält Verhalten fest, das schon der Basis-Commit zeigt (`consent-letter.service.ts:40` in efb682e; im Bereich gibt es keine Änderung, durch die er rot würde). Die Commit-Nachricht von 9e6e307 sagt nicht, dass er bestehendes Verhalten festhält (CLAUDE.md, Workflow 2). Das gehört in den Text des Pull-Requests. Basis und Art der Änderung sind in Ordnung: Der Basis-Commit zeigt das Verhalten schon, und es ist kein Bugfix. |

Keine Blocker oder Majors.

Geprüft: Route `GET /:id/consent-letter` antwortet jetzt mit `refusal('CONTRACT_NOT_FOUND', …)`, wie die beiden anderen Contract-Routen. Den pg-Test hat der Aufrufer vor der Änderung rot gesehen; ohne Code fiele die Antwort auf `undefined` zurück. Das neue Szenario für den unbekannten Mietvertrag wäre ohne die Änderung rot: `pdfRefusal` fällt ohne Code auf `backend_pdf_failed` zurück. `backend_contract_not_found` steht in allen vier `messages/*.json`. Der Zustand «Ablehnung» ist als `contract-consent-letter-refused` schon in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`; er hat dieselben Bedienelemente, nur einen anderen Satz. Der Schritt für den Dateinamen nimmt das letzte Wort des Seed-Namens, also den Token, den der Seed als `lastName` speichert (`fixtures/backend.ts:171`). Er prüft damit den echten Nachnamen. Die Schritte rufen nur Tasks und Questions auf. Der Unit-Test zu P-3 steht in `backend/src/__tests__/reminder-pdf.test.ts:38`. Der Diff enthält keine fremden Änderungen und keinen ungenutzten Code.

## Nicht bestätigt

- Ob im Text des Pull-Requests «No scenario: the page break of a PDF is not visible to the E2E text steps; reminder-pdf.test.ts shows it» für P-3 steht: Den Text des Pull-Requests gibt es noch nicht.
- Ob der Dateiname in der Sprache des Mieters stimmt (fr), zeigt nur `consent-letter.pg.test.ts:83`, kein Szenario. Das Szenario prüft nur Deutsch. Gelesen, nicht ausgeführt.
- vom Aufrufer gemeldet: `bun run lint` sauber, `bun run check` sauber, `cd backend && bun run type-check` sauber, `bun test src/__tests__/consent-letter.pg.test.ts` 6 bestanden (neuer 404-Code-Test vor der Routenänderung rot: «Received undefined»), E2E chromium `-g "Brief"` 22 bestanden. Die Prüfungen auf dem zusammengeführten Head laufen laut Aufrufer noch.
