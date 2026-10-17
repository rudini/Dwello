# Review #356 ZIP eines Abrechnungslaufs, Runde 3 (Delta 1533b17..396cd26)

Worktree: `/tmp/claude-0/-home-user-Dwello/94414f17-b1bd-53cb-a045-3212fe00129f/scratchpad/review-zip-code3` (396cd26, detached). Gelesen: alle 4 Dateien des Deltas (`tests/e2e/tasks/accessibility.ts`, `implementation_plan.md`, `docs/reviews/zip-review-2.md`, `docs/reviews/workflow-notes-issue-356.md`), dazu `tests/e2e/fixtures/screens.ts` (`seedFor`, alle Jahreszahlen) und `.claude/skills/workflow-review/SKILL.md` (Ablage der Workflow-Notizen).

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-11 | erledigt | `tests/e2e/tasks/accessibility.ts:351` | `2016 + (resultRuns++ % 7)`: Jahre 2016–2022. Laut `screens.ts` haben Anna, Bruno und Carla Verträge ab 2015 (Z. 48–50); Abrechnungen gibt es nur 2023, 2024, 2025 (Z. 64–70), Heizrechnungen und Rechnungen nur 2024/2025 (Z. 53, 56, 69, 77). In 2016–2022 ist also alles abrechenbar und ohne Rechnungen (`confirm-missing-invoices` erscheint). Pro Worker laufen axe (6 Blicke) und Sprachen (3 Blicke) zusammen 9-mal: die Werte gehen 0..5, 6, 0, 1 bzw. 0..2, 3..6, 0, 1 – innerhalb jedes Szenarios (eigenes Gebäude) stets verschieden, da je ≤ 6 aufeinanderfolgende Werte mod 7. Kein Blick erreicht 2023 oder später. Kommentare (Z. 101–102 und 348) stimmen jetzt. |
| C-12 | erledigt | `implementation_plan.md` | Widersprüchliche Zeile gestrichen. |
| C-13 | Nit | `docs/reviews/workflow-notes-issue-356.md:6` | Notiz nennt noch «`2016 + n % 9`»; der Code nimmt jetzt `% 7` (2016–2022). Und der eigentliche Lernpunkt aus C-11 fehlt: ein Modulzähler läuft pro Worker über alle Szenarien, die Testdaten aber pro Szenario. |
| C-14 | Nit | `tests/e2e/tasks/accessibility.ts:99-103` | Der Kommentar «The statement wizard's preview …» gehört zu `previewOf`, steht aber über dem Block zu `resultRuns` (bestand schon vor dem Delta, jetzt durch zwei Kommentarzeilen weiter abgerückt). |

## Blocker/Major

Keine offen.

## Anforderung gegen Code und Test (Delta)

- C-11 (Ergebnisschritt verlässlich in axe- und Sprachprüfung): durch Code und Testdaten bestätigt (siehe Tabelle); Wiederholungen nach einem Fehler starten in Playwright einen neuen Worker, der Zähler beginnt dort wieder bei 0.
- C-12: durch geänderten Text bestätigt.
- Workflow-Notiz: Ablage nach `workflow-review` (`docs/reviews/workflow-notes-<task>.md`), Plan-Eintrag abgehakt; Inhalt siehe C-13.
- `docs/reviews/zip-review-2.md`: unverändert gegenüber meinem Bericht aus Runde 2 übernommen.

## Nicht bestätigt

- `bun run lint` sauber auf 396cd26: vom Aufrufer gemeldet.
- E2E vor dem Fix `--project=chromium --workers=1 -g "generation-result"` rot (Sprachen-Szenario wartet vergeblich auf `generation-result`), nach dem Fix `--workers=1 -g "generation-result|statement-zip-refused"` 4 passed: vom Aufrufer gemeldet, nicht selbst ausgeführt (kein E2E erlaubt). Der gemeldete rote Lauf passt zur Begründung von C-11 in Runde 2.
- `bun run check`, Vitest: auf diesem Commit nicht gemeldet; das Delta ändert nur eine Zahl und Kommentare in E2E-Code sowie Markdown.
