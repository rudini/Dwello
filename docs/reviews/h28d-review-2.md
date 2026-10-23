# Code-Review H-28 (#717), Slice «Kennzeichen aus dem Laufplan», Runde 2

Bereich: `git diff e9ac0eabc ecf72e780` (ohne docs/reviews, implementation_plan.md, docs/archive), Worktree `review-h28d-2`. Vorheriger Bericht: `docs/reviews/h28d-review-1.md`.

## Status der offenen IDs

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| H-1 | Major | behoben | `src/__tests__/statement-endpoints.test.ts:327-328` erwartet jetzt `statementRun.withoutFee`, also das, was der BFF unverändert weiterreicht. Der Helfer `plan()` in `src/__tests__/statement-generate-actions.test.ts:9-16` setzt neutrale Kennzeichen (`movedOut: false`, `fixedTerm: false`, `shortenedTo: null`, `withoutFee: []`), und der befristete Eintrag (Z. 152) trägt `fixedTerm: true`. Die beiden Tests habe ich zusammen mit `statement-generation.test.ts` und `statement-wizard.dom.test.ts` selbst laufen lassen: alle grün. |
| H-2 | Minor | behoben | `docs/api-specification.md:266` nennt jetzt `withoutFee`, `movedOut`, `fixedTerm` und `shortenedTo`, passend zu `flagsOf` und `planRun` in `backend/src/services/statement-run.service.ts:54-75`. |
| H-3 | Minor | behoben | Der Typ `Contract` in `src/lib/server/statement-generation.ts:11-18` führt `startDate`, `endDate`, `billedUntil` und `managementFeeAgreed` nicht mehr, und keines dieser Felder wird in der Datei noch gelesen. `billingStart` in `src/lib/contract-status.ts:19` wird nicht mehr exportiert und nur noch in Z. 36 verwendet. |

## Neue Befunde

Keine.

## Rote Tests in form-selects.dom.test.ts

Die Annahme des Aufrufers stimmt. Ich habe die Datei selbst laufen lassen und dieselben 6 Fehler bekommen, alle mit «Cannot find module …/node_modules/.ssr-…/….js» aus `src/__tests__/helpers/hydrate.ts`. Der Grund: `serverRender` (Z. 19-29) kompiliert die Komponente mit `mkdtempSync(resolve('node_modules/.ssr-'))` in ein temporäres Verzeichnis unter `node_modules` und lädt sie dort mit `import()`. Im Worktree ist `node_modules` ein Symlink auf das Hauptrepo. Deshalb findet der Import des frisch geschriebenen Moduls über den Worktree-Pfad die Datei nicht. Es scheitert also das Laden des Moduls, keine Prüfung im Test.

Keine der fünf Komponenten, die der Test rendert, importiert eine geänderte Datei. `grep` auf `contract-status` und `statement-generation` in BuildingField, StatusField, DefaultsSection, StatementSearch und SettingsStep findet nichts.

Geprüft: der ganze Delta-Diff (5 Dateien), die API-Doku gegen `statement-run.service.ts` und die Verwendung von `billingStart` in `src` und `backend/src`.

## Nicht bestätigt

- bun run lint, bun run check, fallow audit und der vollständige Lauf von `bunx vitest run` (3624 bestanden, 6 rot): vom Aufrufer gemeldet, nicht selbst wiederholt.
- Ob `form-selects.dom.test.ts` in einem Checkout ohne Symlink-`node_modules` grün ist: nicht vorgeführt. Die Ursache habe ich nur durch Lesen von `hydrate.ts` beurteilt; `node_modules` im Hauptrepo kann ich nicht einsehen (Zugriff verweigert).
