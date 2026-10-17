# Code-Review 6 (Abschluss), #357, PR #384: Delta 4116c18..a184bc2

Worktree: `review-audit-code6` bei a184bc2. Gelesen: alle zehn geänderten Dateien im Delta (`git diff 4116c18 a184bc2`), dazu `backend/src/services/statement.service.ts:595`, `audit-log.service.ts:28`, `audit-log.pg.test.ts:25-45, 166-213` und `src/routes/privacy/+page.svelte:23`.

Kein Blocker, kein Major.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Nit | `backend/src/__tests__/audit-log.pg.test.ts:213` | Der Eintrag wird erst nach den `expect` gelöscht. Schlägt eine Erwartung fehl, bleibt er in `dwello_test` liegen. Ein `cleanUps.push(...)` (oder `try/finally`) wäre robuster. Im Erfolgsfall ist C-3 aus Review 5 behoben. |
| C-2 | Nit | `backend/src/__tests__/audit-log.pg.test.ts:166-187` | Der Test «Zahlung zurücksetzen» lässt seinen Eintrag `payment_reset` (Details ohne `token`) weiterhin liegen. Das war schon vor dem Delta so (Review 5, C-3 nennt es) und wird durch das Delta nicht schlimmer. |

## Bestätigt

- **R-6/V-17:** `audit_privacy` in `messages/{de,fr,it,en}.json:1655` übernimmt den Wortlaut der Korrektur aus `docs/reviews/w7e-fachreview-3.md` (R-6) wörtlich. Die Angaben stimmen mit dem, was der Code festhält: `statement.service.ts:595` schreibt `{ statementId, number, paidDate }`. Der deutsche Satz trennt jetzt die «zurückgesetzten Zahlungen» klar von den «Abrechnungen» (V-17). Alle vier Sprachen sind gleich angepasst.
- **DOM-Test:** `privacy-page.dom.test.ts:110` prüft den neuen deutschen Satz wörtlich. Mit dem alten Text in `de.json` schlägt er fehl, er war also beim Lesen rot. Kein weiterer Test und kein Feature prüfen den alten Satz (grep in `src`, `tests`).
- **C-2 (Review 5):** Der Kommentar in `settings.feature:67-71` nennt jetzt auch das Berichtigen. Das stimmt mit dem Code: beides läuft über `recordAudit`.
- **C-3 (Review 5):** Siehe C-1, im Erfolgsfall behoben.
- **C-6 (Review 5):** Die Archivzeile `implementation-plan-verlauf.md:1169` nennt jetzt `recordStatementCorrection` ohne die veraltete Signatur. Das passt zur Zeile 1182.
- Die Berichtskopien `docs/reviews/w7e-fachreview-3.md` und `w7e-review-5.md` sind reine Dokumentation und passen zum Delta.
- Im Delta ist nichts, was nicht zur Anforderung gehört, und keine fremde Umformatierung.

## Nicht bestätigt

- `bun run check`, `bun run lint`, `bunx vitest run` (2894) und `cd backend && bun test src/__tests__/audit-log.pg.test.ts` (15 pass): vom Aufrufer gemeldet, nicht neu ausgeführt. Backend-Tests und E2E durfte ich nicht starten.
- Ein E2E-Szenario für den geänderten Wortlaut gibt es nicht. Ich werte das als Wortlaut-Korrektur aus einem Review (Ausnahme laut Skill `slice-review`, «Triage»). Es ändert kein Verhalten. Der Text der Datenschutzerklärung ist auf DOM-Ebene abgedeckt. Ob `privacy.feature` den Absatz prüft, habe ich nicht nachgesehen. Per grep enthält kein Feature den Satz.
- Die Qualität der Übersetzungen in fr/it/en habe ich nicht fachlich geprüft. Sie entsprechen wörtlich dem Vorschlag des fach-reviewers.
