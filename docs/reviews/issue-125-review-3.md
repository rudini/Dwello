# Code-Review issue-125, Runde 3 (Delta)

Geprüft wurde `git show 8340626` im Worktree `review-125-code-3` (detached, auf 8340626). Gelesen habe ich alle 20 geänderten Dateien. Dazu kamen aus dem Umfeld:
- `src/lib/server/statement.ts` (`pdfRefusal`)
- `src/routes/statements/[id]/pdf/+server.ts`
- `backend/src/routes/statements.ts` (`pdfFailure`, generate-pdf)
- `backend/src/services/statement-pdf.service.ts` (`generateStatementPdf`)
- `src/__tests__/backend-codes.test.ts`
- die Verwendungen des Steps «liest der Liegenschaftsverwalter {string}» in `tests/`
- `pageBody` und `pageText` auf `origin/main`: Dort gibt es beide nicht, sie stammen aus diesem Slice. Sie zu entfernen hinterlässt nichts Ungenutztes.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-16 | Nit | tests/e2e/steps/statement-detail.steps.ts:216-218 | Der Wortlaut «liest der Liegenschaftsverwalter {string}» ist allgemein, der Step liest aber nur `pdf-refusal-message`. Er dient auch `statements.feature:58`, also der Liste. Ein späteres Szenario, das ihn für einen anderen Text nutzt, scheitert erst zur Laufzeit, weil das Ziel fehlt. Ein Wortlaut, der die Seite nennt, wäre eindeutiger. |

Blocker oder Major gibt es in diesem Delta keine.

## Stand der Befunde aus Runde 2

- **C-9: behoben.** `backend()` in `statement-endpoints.test.ts:93-100` hat weder den Zweig `generated` noch den POST-Zweig. Die uncodierte JSON-Antwort ist durch eine Text-Antwort mit Status 502 ersetzt (Z. 113-119). Die Route liest sie mit `response.json().catch(() => null)` und zeigt den Ersatzsatz. Der Test prüft Status und Satz.
- **C-10: Ablehnung nachvollziehbar.**
  - Die Abbildung von Code auf Satz läuft für jeden Code über dasselbe `backendMessage`.
  - `backend-codes.test.ts` stellt sicher, dass es zu jedem Code des Backends eine Meldung `backend_<code>` gibt.
  - Den Wortlaut zu IBAN prüft im BFF weiterhin kein Test. Das ist ein Restrisiko ohne eigenes Verhalten.
- **C-11: behoben.**
  - `statement.ts:115` trägt `data-testid="pdf-refusal-message"`.
  - Target `pdfRefusalMessage` steht in `targets/statement-detail.ts:41`, die Question `pdfRefusalText` in `questions/statement-detail.ts:22`.
  - Der Step prüft mit `toBe` (`statement-detail.steps.ts:217`). Beide Szenarien verwenden ihn, `statement-detail.feature:154` und `statements.feature:58`, und beide landen auf `pdfRefusal`.
  - Die Schichtenregeln sind eingehalten: Der Step ruft nur die Question auf.
  - Die Unit-Tests wurden auf `<p[^>]*>` bzw. `>…</p>` angepasst.
- **C-12: behoben.** `implementation-plan-verlauf.md` (letzte Session) enthält jetzt beide Zeilen:
  - «Scenario red (round 1 fix): … found no link (text/plain page)»
  - «Test red (C-5): … received 500, expected 503»
- **C-13: behoben.** `design-decisions.md` D7b hält die Entscheidung des Product Owners vom 15.10.2026 fest, mit Begründung und Ort.
- **C-14: behoben.**
  - Neuer Vertrag `tests/contracts/statement-pdf-failed.json`, im README eingetragen.
  - `api-contracts.pg.test.ts:207-211` prüft ihn gegen die echte API. `keine-id` trifft die uuid-Spalte in `getStatement`, das ergibt einen uncodierten Fehler. Daraus macht `pdfFailure` die Antwort 500 mit `PDF_FAILED`.
  - Der DOM-Test (`statement-pages.dom.test.ts:689`) verwendet den Vertrag.
- **C-15: behoben.**
  - Die beiden Bugs fehlen in O-20.
  - Issue #159 hat einen Kommentar vom 15.10.2026 07:38 mit beiden Beobachtungen (gelesen über `gh api`).
  - O-20 behält nur die nicht-funktionalen Punkte und die Dateinamen.

Persona-Runde 2: Helga P-1 bis P-4 und Marco P-1 bis P-3 sind nur Minor oder Nit. Sie stehen gesammelt als O-21 in `offene-punkte.md`. Laut Workflow Schritt 7 ist das als offene Arbeit zulässig.

Das Archivieren der Session ist korrekt:
- `implementation_plan.md` enthält nur noch den Kopf.
- Die Session steht vollständig in `docs/archive/implementation-plan-verlauf.md`.
- Die Zeile `Skills: tdd, ponytail, ponytail-review` ist vorhanden.

## Nicht bestätigt

- **Selbst wiederholt, grün:** `bunx vitest run` mit `statement-endpoints.test.ts`, `statement-list-load.test.ts` und `statement-pages.dom.test.ts` (95 bestanden).
- **Vom Aufrufer gemeldet, nicht wiederholt:**
  - `bun run test:coverage` (2378), `bun run lint`, `bun run check`
  - Backend `bun run test` und `bun run type-check`, darunter der neue Vertragstest
  - `deepcheck:audit`
  - E2E chromium und api: `statement-detail.feature`, `statements.feature` (31) und `statement-generate.feature` (22)
  - die axe- und Sprachzeilen `statement-pdf-refused`, `statement-detail` und `statements`
- **Nicht selbst geprüft:**
  - Den Status 500 des neuen Vertragstests habe ich nur im Code nachvollzogen, ohne Lauf, weil ich ohne Datenbank-Lauf geprüft habe.
  - Dass der E2E-Step mit `toBe` grün ist, beruht nur auf dem gemeldeten E2E-Lauf. E2E habe ich nicht gestartet, wie vorgegeben.
