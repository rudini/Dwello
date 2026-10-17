# Review W8c-2 (#65, Option A), Runde 1: `git diff 0f3d5d1d cef3720c`

Geprüft im Worktree `review-w8c2-code` (detached auf cef3720c). Gelesen: alle 16 geänderten Dateien des Diffs, dazu `PreviewChecks.svelte` (ganz), `PreviewStep.svelte` und `StatementStep.svelte` (Verwendung von `period`), `statement-wizard.dom.test.ts:480-515`, `tests/e2e/CLAUDE.md` (Regel «Negative checks») und `.claude/skills/ponytail-review/SKILL.md`.

Ergebnis: kein Blocker, kein Major.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | tests/e2e/targets/statement-generate.ts:44, src/__tests__/statement-wizard.dom.test.ts:509 | Die negativen Prüfungen suchen `data-testid="partial-invoices"`, das die App nach der Änderung nirgends mehr ausgibt (`grep` findet es nur in den Tests). Vor der Änderung waren sie rot (die alte Logik hätte für 15.03.2024 bzw. 15.01.–31.03.2024 `partly` = wahr ergeben, 291 bzw. 275 Tage > 90). Als Schutz gegen ein Wiederkommen des Hinweises unter einem anderen Testid oder in einem anderen Alert greifen sie aber nicht. Für eine Entfernung annehmbar; ein Textanker («Teil der Periode») wäre strenger. |
| C-2 | Nit | implementation_plan.md:4-5 | Zwei Leerzeilen vor `## Session`, sonst überall eine. |

## Bestätigt

- **Hinweis entfernt:** `GAP_DAYS`, `daysBetween`, `partly`, `Period` und das Feld `partial` sind aus `src/lib/statement-wizard.ts` weg; das Alert mit `testid="partial-invoices"` und sein `TODO(fachlich prüfen, #65)` aus `PreviewChecks.svelte`. `grep -rn "statements_partial\|GAP_DAYS\|partial-invoices"` findet ausserhalb der Tests und Review-Berichte nichts mehr; kein `TODO(…, #65)`-Marker bleibt (wichtig für `Fixes #65` und `check-issues.mjs`).
- **Texte:** `statements_partial_title`/`statements_partial_text` in allen vier `messages/*.json` entfernt (de/fr/it/en je 2 Zeilen). Kein neuer Text.
- **`period`-Parameter:** `invoiceRows(coverage, buildings)`; alle drei Aufrufer angepasst (`PreviewStep.svelte:35`, `StatementStep.svelte:95,98`). `period` bleibt in `PreviewStep` als Prop nötig, denn `PreviewChecks` braucht es weiter für `notOver` (`PreviewStep.svelte:90`); kein toter Rest. Die Vorjahresprüfung pro Kategorie (`categoryCheck`, Backend) ist unverändert.
- **Szenario:** «Ohne Vorjahr weist die Vorschau nicht auf Monate ohne Rechnung hin» (`statement-generate.feature:200-206`) ohne `@wip` im zweiten Commit, mit positivem Anker («nennt die Vorschau für "Lindenhof" 1 erfasste Rechnung») vor der negativen Prüfung, wie `tests/e2e/CLAUDE.md` verlangt. Kaminfeger nur 2024 → `hasComparison` falsch; 15.03.–31.12. sind 291 Tage > 90 → vor der Änderung rot am Hinweis. Die Frage `Count.of(partialInvoices)` antwortet mit einer Anzahl; Step ruft nur die Frage auf (Screenplay eingehalten). Formulierung ohne UI-Wörter.
- **Unit-/DOM-Tests:** die beiden Tests auf `partial` sind gelöscht, `toEqual` ohne `partial` wäre mit dem alten Code rot gewesen (zusätzliches Feld). Der DOM-Test prüft Ankertext und Abwesenheit. Selbst nachgelaufen: `bunx vitest run src/__tests__/statement-wizard.test.ts src/__tests__/statement-wizard.dom.test.ts` → 89 bestanden.
- **a11y/Sprachen:** der entfernte Zustand war nicht in `tests/a11y/screens.json`, `accessibility.feature` oder `sprachen-bildschirme.feature` eingetragen (nur `upload-partial`, ein anderer Bildschirm); nichts zu entfernen, kein neuer Zustand.
- **Kein Fremdes im Diff:** nur Entfernung, Testanpassung, Plan und Fach-Review-Bericht. Keine Formatierungsänderungen an unberührtem Code. Keine Backend-, API- oder Vertragsänderung (`tests/contracts` unberührt, korrekt).

## Ponytail-Review

Lean already. Ship. (Der Diff ist netto −83/+90, davon 54 Zeilen Fach-Review-Bericht; im Code nur Löschungen und die eine neue E2E-Frage/-Target/-Step, die das Szenario braucht.)

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` von statements-i18n, i18n, design-guard, backend-codes, open-work: vom Aufrufer gemeldet.
- `bun run test:e2e -- --project=chromium tests/e2e/features/statement-generate.feature` (53 bestanden) und das Rotsehen des Szenarios vor der Änderung: vom Aufrufer gemeldet; das Rot habe ich nur durch Lesen (Daten gegen `partly`, alte Fassung im Diff) nachvollzogen.
- Rotsehen der Unit- und DOM-Tests vor der Codeänderung: vom Aufrufer gemeldet; nach Lesen plausibel (siehe oben).
- Ob #65 den Entscheid «Option A» und kein Label `entscheiden` mehr trägt: Issue nicht gelesen; der Plan (`implementation_plan.md:8`) behauptet es. `tools/open-work/check-issues.mjs` nicht gelaufen (übernimmt CI).
- Persona-Berichte (`docs/design/personas/anna-final-b.md:28`) erwähnen den alten Hinweis noch; das sind historische Berichte, nicht geprüft und nicht zu ändern.
