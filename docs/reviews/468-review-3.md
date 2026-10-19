# Code-Review #468, Runde 3 (Schlussrunde vor dem Push)

Geprüft wurden im Worktree `review-468` (HEAD 9d649e04):

- `git diff 4c51cbb7 e6b51c4f -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/design/personas'`: der Test für C-9 im Commit e6b51c4f.
- `git show --remerge-diff 9d649e04 -- . ':!implementation_plan.md'`: der Merge von origin/main.

## Status der offenen IDs

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-2 | Minor | teilweise | Schritt 3 nach einem gescheiterten Laden hat weiterhin keinen eigenen Test. Den Fehlerweg habe ich durch Lesen und mit dem Probe aus Runde 1 bestätigt. |
| C-3, C-4, C-5, C-7, C-8 | Minor/Nit | offen | Der Aufrufer begründet sie im Schlussbericht; sie blockieren nicht. |
| C-9 | Minor | **geschlossen** | Neuer Test `statement-wizard.dom.test.ts:1180` «wartet bei den erneut geöffneten Einstellungen auf deren eigene Antworten», durch Lesen nachvollzogen. Die `/billed`-Anfragen kommen in dieser Reihenfolge: [0] Schritt 2, [1] `FeeNotAgreed` im ersten Schritt 3, [2] Schritt 2 erneut, [3] `FeeNotAgreed` im zweiten Schritt 3. Wird [1] nach dem erneuten Öffnen beantwortet, würde es ohne `if (left) return;` `feeLoading` auf `false` setzen. Der Test erwartet dann `disabled === true` und wäre rot. Danach entsperrt [3] den Button wieder. Das deckt sich mit der Rot-Angabe in der Commit-Nachricht. |

## Merge 9d649e04

- `--remerge-diff` ist ausserhalb von `implementation_plan.md` leer. Der Merge hat also nichts aufgelöst, das nicht schon in den beiden Eltern stand.
- origin/main bringt seit der Merge-Basis 53618b07 nur #51/#469 (erlaubte E-Mails bei der Anmeldung) und dessen Reviews.
- Mit dieser Änderung überschneidet sich nur `tests/e2e/tasks/accessibility.ts`, und zwar mit einer Zeile (`'login-not-allowed'` in `states`, Zeile 185). Sie liegt weit weg von den Zeilen dieses Diffs.
- Keine Datei aus #468 (Svelte-Komponenten, DOM-Tests, `contract-form.ts`) wurde auf main geändert.

## Neue Befunde

Keine.

## Persona-Befund (nur zur Kenntnis)

Marco P-1 ist laut Aufrufer vorbestehend: Der Hinweis zur Verwaltungspauschale erscheint, wenn «Weiter» entsperrt wird. Der Product Owner hat am 2026-10-19 entschieden: #468 wird gemergt, das Layout folgt in #470. So steht es in `implementation_plan.md`. Den Persona-Bericht `docs/design/personas/marco-468.md` habe ich nicht geprüft; er ist nicht Teil dieses Reviews.

## Nicht bestätigt

- `statement-wizard.dom.test.ts` auf 9d649e04: von mir wiederholt, 79 bestanden. Die übrigen Dateien (contract-wizard, agreed-costs, open-work; zusammen 126) sowie lint, check und backend type-check: vom Aufrufer gemeldet.
- E2E (Chromium + API 164, axe/Sprachen 64): vom Aufrufer gemeldet, aber auf f1a657bc und nicht auf 9d649e04. Das spätere Delta ändert keinen E2E-Code ausser der automatisch gemergten Zeile von #469. Die E2E-Suite von #469 lief auf main.
- Die Entscheidung des Product Owners zu Marco P-1 und #470: vom Aufrufer gemeldet und im Plan vermerkt. Im Issue habe ich sie nicht nachgesehen.
