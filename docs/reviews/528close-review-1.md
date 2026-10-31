# Code-Review #528, Abschlussrunde vor dem Push, Runde 1

Bereich: `git diff ad27732 6104a67 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` (Commit 6104a67, Worktree /tmp/claude/review-528-close)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde |

Geprüft: Alle sechs geänderten Dateien sind gelesen. `statements_split_keys_line`, `_line_many` und `_preview_end` stimmen in de/fr/it/en Zeichen für Zeichen mit der Wortlaut-Tabelle in `docs/reviews/528-fachreview-2.md:20-22` überein. Im Französischen stehen geschützte Leerzeichen innen an den Guillemets und vor dem Doppelpunkt. Der Knopfname im Hinweis entspricht in allen vier Sprachen `statements_create_drafts` (`messages/*.json:1445`, verwendet in `StatementWizard.svelte:327`). Den alten Wortlaut prüft kein Test und kein Schritt mehr (grep in `src`, `tests`, `backend`). Der DOM-Test (`statement-pages.dom.test.ts:1000`) und der E2E-Schritt (`statement-detail.steps.ts:753`) prüfen jetzt den neuen deutschen Text und sind dabei nicht lockerer geworden. Die Szenarien sind laut dem Review neu auf diesem Branch, ein Spec change ist also nicht nötig. Im Diff ist nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- `bunx vitest run src/__tests__/statement-pages.dom.test.ts src/__tests__/statement-wizard.dom.test.ts` (300 bestanden): vom Aufrufer gemeldet.
- Rotlauf des DOM-Tests vor der Textänderung: vom Aufrufer gemeldet. Laut skill slice-review (Triage) braucht ein Wortlaut-Fix geprüfter Übersetzungen ohnehin keinen Rotlauf.
- E2E-Schritt `sagt der Entwurf, dass … abgerechnet wird` mit dem neuen Text: nicht ausgeführt, kein Lauf gemeldet. Ich habe nur gelesen, dass der Teilstring `{category} wird in mehreren Positionen abgerechnet` im deutschen `statements_split_keys_line(_many)` vorkommt.
- `git merge origin/main` ohne Änderung: vom Aufrufer gemeldet, nicht nachgeprüft.
