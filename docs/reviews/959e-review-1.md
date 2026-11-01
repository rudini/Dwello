# Code-Review 959e, Runde 1 (Schlussrunde vor dem Push)

Bereich: `git diff 687010f fde1423` (ein Commit, fde1423), Worktree `/tmp/scratchpad/review-959e-code-reviewer`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/statements/[id]/FormDialog.svelte:49 | Der Fix des Toasts hat nur das E2E-Szenario als reproduzierenden Test. Den Fehler kann auch die tiefere DOM-Schicht zeigen (CLAUDE.md, Workflow 2: «at the lowest layer that can show it»): `statement-pages.dom.test.ts` spielt `update` schon selbst (`after({ update: … })`, Z. 1884), und ein `*.svelte.dom.test.ts` mit `$state`-Props (Muster vorhanden) kann in `update()` die `data.statement` mit `paidAmount` 300.00 ersetzen und dann den Toast «Teilzahlung für Abrechnung …» prüfen. Ohne den Fix wäre dieser Test rot. Das Verhalten selbst ist durch das Szenario abgedeckt. |

Geprüft: Ursache 1 stimmt mit dem Code überein (`dialogSubmit` wartet auf `update()` und ruft erst danach `answered`; `paidSuccess` hängt über `part` an `isPartPayment(statement, paidAmount)`; 300.00 < 432.90, nach dem Neuladen aber nicht < 132.90). `said` wird beim Absenden im Callback `fields` gesetzt, also vor dem Request; das gilt auch für die übrigen sieben Aufrufer von FormDialog, deren `success` gleich bleibt oder sich ebenfalls erst nach dem Neuladen ändern würde. Das neue Szenario würde vor dem Fix gelesen an «Abrechnung als bezahlt markiert» scheitern; Task `recordPayment` wartet auf den Toast, Question `paymentDone` gibt dessen Text zurück, die Steps rufen nur Tasks und Questions auf, die Formulierung ist fachlich. Es kommen keine neuen Texte und keine neuen Zustände hinzu (messages, screens.json und die Features für a11y/Sprachen sind nicht betroffen). Backend: `paidDate` ist jetzt das späteste Datum der Zahlungsliste, wie es `docs/api-specification.md:301` beschreibt («then `paid` on the latest payment day»). Der neue pg-Test wäre vor dem Fix gelesen rot (`paidDate && …` ergibt `undefined`, damit bleibt `paidDate` null) und setzt mit zwei Resets den gemeinsamen Zustand des `describe` zurück. Kein Pfad in `backend/src` außerhalb der Tests verlässt sich auf `paidDate` null bei bezahlt ohne Datum. Im Diff ist nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, die ganze Backend-Suite (1954 pass) und E2E `tests/e2e/features/statement-detail.feature` auf chromium (123 passed): vom Aufrufer gemeldet.
- Dass beide neuen Tests rot waren: vom Aufrufer gemeldet. Bestätigt habe ich es nur durch Lesen des Codes vor und nach dem Fix (`backend/src/services/statement.service.ts:811-812`, `src/lib/ui/dialog-submit.ts`, `src/routes/statements/[id]/+page.svelte:104-117`).
- Die Angabe, die BFF sende immer ein Datum, habe ich nicht nachgeprüft. Davon hängt nur ab, wie weit die Änderung bei einer vollen Zahlung ohne Datum für Nutzer sichtbar ist (null wird zu heute), nicht ob sie korrekt ist.
