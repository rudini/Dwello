# Code-Review 1464-back-2, Runde 1 (Schlussrunde vor dem Push)

Bereich: `git diff 64417b1 be96f9f` (ohne docs/reviews, implementation_plan.md, docs/archive, docs/design/personas)

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Minor | src/lib/server/invoice.ts:121-127 | `returnToOf` steht zwischen dem JSDoc-Block von `statementPeriods` und der Funktion. Der Block («The periods with statements that bill this invoice …») hängt jetzt an `returnToOf` (Editor-Hover, Doku), und `statementPeriods` hat keinen mehr. Der Kommentar sagt damit über `returnToOf` etwas Falsches. Behebung: die zwei neuen Zeilen über den JSDoc-Block oder unter `statementPeriods` setzen. |

Keine Blocker, keine Major.

Geprüft: Der Bearbeiten-Link der Detailseite hängt `returnTo` kodiert an und lässt ihn ohne `returnTo` unverändert. Das Bearbeiten liest ihn über `localPath` (edit/+page.server.ts:30) und kehrt nach dem Speichern dorthin zurück (edit/+page.svelte:61). Der DOM-Test schlägt ohne die Änderung fehl, weil der href dann `/invoices/{id}/edit` ist. `returnToOf` verhält sich wie der frühere Ausdruck im Load. Das zeigt der Load-Test invoices.test.ts:480-487 (eigener Pfad bleibt, fremde Adresse wird `null`). Der Import von `localPath` aus `$lib/invoice` im Server-Modul ist zulässig. ponytail-review: kein ungenutzter Code. `new`/`edit` lesen `returnTo` weiter mit dem eigenen Ausdruck. Das ist Code, den der Diff nicht berührt, also kein Befund. Keine neuen Texte, Testids, Bildschirme oder E2E-Änderungen im Delta.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bunx vitest run src/__tests__/invoices.test.ts src/__tests__/invoices-i18n.test.ts` (44), `bunx vitest run --changed origin/main` auf 0a57ae5+ (316), `bun run fitness -- --base origin/main --structure` auf be96f9f (0 Fehler), lint und check auf 0a57ae5 (auf be96f9f laut Aufrufer noch laufend), Commit-Hooks.
- Den Rot-Lauf des neuen DOM-Tests habe ich nur durch Lesen beurteilt (invoice-pages.dom.test.ts:399-407 gegen den alten href).
