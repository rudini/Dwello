# Code-Review #444, Runde 2 (Abschlussrunde, 462621fb..1abca1ee)

Worktree: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/review-444-code2` (detached, 1abca1ee). Delta ohne `docs/reviews`, `implementation_plan.md`, `docs/design/personas`: `src/__tests__/agreed-categories.dom.test.ts`, `tests/e2e/features/contract-new.feature`, `tests/e2e/steps/agreed-costs.steps.ts`. Alle drei Dateien gelesen.

Keine Blocker, keine Majors.

## Status der IDs aus Runde 1

| ID | Status |
|----|--------|
| C-1 | Erledigt. `contract-new.feature:230` prüft mit «Und ist der Hinweis ohne vereinbarte Nebenkosten eine Warnung» den Ton. Der Schritt (`agreed-costs.steps.ts:164-166`) ruft nur die bestehende Question `noAgreedCostsTone` auf (`Attribute data-tone`, `questions/contract-form.ts:55`) und erwartet den Wert `'caution'`. Das ist ein Wert, kein Ja/Nein, und entspricht dem Nachbarschritt mit `'info'`. Das Screenplay-Schichtmodell bleibt eingehalten, und die Formulierung ist fachlich. |
| C-2 | Bleibt offen (Nit, wie vom Aufrufer entschieden). |
| C-3 | Erledigt. `bunx prettier src/__tests__/agreed-categories.dom.test.ts \| diff …` ergibt keinen Unterschied, ebenso für `agreed-costs.steps.ts`. |
| C-4 | Bleibt offen (Nit, wie vom Aufrufer entschieden). |

## Neue Befunde im Delta

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-5 | Nit | Commit 1abca1ee (Nachricht) | Der Aufrufer begründet den fehlenden Rot-Lauf damit, dass der neue Schritt behaltenes Verhalten festhält. Gemessen am Basis-Commit der Issue (4a18ffd2) stimmt das nicht: Dort setzt `AgreedCategories.svelte:53` den Ton `flatRate ? 'info' : 'caution'`. Mit Akonto und Pauschale ergibt das `info`, der Schritt wäre also rot. Durch Lesen ist damit belegt, dass der Schritt ohne die Änderung fehlschlägt. Ein Rot-Lauf fehlt deshalb nicht in der Sache. Nur die Begründung ist ungenau. Ausserdem: Der Typ `docs` im Betreff passt nur teilweise, weil der Commit auch Testcode ändert. |

## Geprüft und bestätigt

- Ton auf 1abca1ee: `src/routes/contracts/AgreedCategories.svelte:55` setzt `tone={flatRate && !advance ? 'info' : 'caution'}`. Im Szenario (Akonto 150, Pauschale 40, alle Nebenkosten abgewählt) ergibt das `caution`, der neue Schritt prüft also das entschiedene Verhalten.
- Die Änderung im DOM-Test betrifft nur die Formatierung. Die Zusicherung bleibt inhaltlich gleich.
- Im Delta gibt es nichts ohne Bezug zur Anforderung. Es kommen weder neue UI-Texte noch neue Zustände oder API-Änderungen hinzu. Deshalb sind weder `messages/*.json` noch `screens.json` noch Contracts betroffen.

## Nicht bestätigt

- Lint, check, Backend-type-check, `bunx vitest run src/__tests__/agreed-categories.dom.test.ts src/__tests__/open-work.test.ts` (9 grün) und E2E chromium `-g "ohne angekreuzte Nebenkosten warnt"` (2 grün): vom Aufrufer gemeldet. Ich habe sie nicht erneut ausgeführt, nur Prettier auf den zwei Dateien.
- Die neuen Dateien unter `docs/design/personas` und `docs/reviews` sowie `implementation_plan.md` gehören laut Auftrag nicht zum Delta und sind nicht geprüft.
