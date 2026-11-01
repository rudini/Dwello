# Code-Review #683, Slice 1 (c90c8a8da)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/ui/RadioGroup.svelte:24-40, src/routes/config/categories/CategoryReason.svelte:55-61 | Die neue Prop `describedby` der geteilten Komponente `RadioGroup` (Reihenfolge Fehler, Hilfe, weiterer Text) und die Bezeichnung «Begründung» in `CategoryReason` sind nur durch das E2E-Szenario abgedeckt. Ein DOM-Test könnte beides zeigen: `ui-choices.dom.test.ts` prüft `aria-describedby` der Gruppe bereits für `help` und `error`, aber nicht für `describedby`; `categories-page.dom.test.ts` prüft die Bezeichnung nicht. |

Keine Blocker oder Major.

Geprüft: alle 11 geänderten Dateien. Die Bezeichnung steht in allen vier `messages/*.json`. Der Wortlaut «Begründung» stammt aus der Anforderung des Issues; der Fachbegriff im Code und im Szenario bleibt «Grund der Umlagefähigkeit». Die Klassen sind nur Tokens (`font-semibold`, `text-ink`, `text-ink-muted`). Ändert der Verwalter die Umlagefähigkeit, verschwinden der Grund und `describedby` zusammen (`reasonOf(chosen)`), es bleibt also kein Verweis auf eine fehlende id. Andere Aufrufer von `CategoryReason` ohne `id` zeigen den Grund wie bisher. Die Screenplay-Schichten sind eingehalten: Steps rufen nur Questions auf, Targets mit `data-testid`. Die Questions geben den Wert selbst zurück (Text, Accessible Description). Beide Steps scheitern ohne die Änderung: `category-reason-label` fehlt auf der Basis, und die Beschreibung der Gruppe enthielt nur `categories_allocable_help` ohne «umstritten». Es ist kein neuer Bildschirm und kein neuer Zustand (sichtbarer Text auf dem bestehenden Zustand `category-edit-predefined`). Kein Szenario ohne `@wip` und kein bestehender Step wurde geändert. Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` (design-guard, tokens, Dateien zu RadioGroup/CategoryReason/CategoryForm/categories_reason, 660 bestanden), E2E `categories.feature` in Chromium (28 bestanden), axe- und Sprachzeilen von category-edit, category-edit-predefined und category-check (12 bestanden): vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Den Text von Issue #683 konnte ich nicht lesen (`gh issue view` lieferte nichts). Die Anforderung habe ich so übernommen, wie der Aufrufer sie zitiert.
