# Code-Review S-1 bis S-6, Runde 2 (Delta 3c9ce03..450789e)

Geprüft: `git diff 3c9ce03 450789e` im Worktree `review-s16-2`. Alle 5 geänderten Dateien gelesen: `bdd-acceptance/SKILL.md`, `arbeitsregeln.md`, `offene-punkte.md`, `s16-review-1.md`, `implementation_plan.md`. Verglichen mit `tests/e2e/features/building-detail.feature`, `tests/e2e/steps/common.steps.ts`, `tests/e2e/CLAUDE.md` und dem alten Skill (`git show e8dfe9a:.claude/skills/bdd-acceptance/SKILL.md:181-187`).

| ID | Schwere | Datei:Zeile | Fund |
|---|---|---|---|
| C-1 | – (behoben) | `.claude/skills/bdd-acceptance/SKILL.md:31` | Die Navigationsregel ist zurück: Jeder Ausgang hat genau ein Szenario, das nur den Wechsel prüft. Endseiten haben keins. |
| C-2 | – (behoben) | `.claude/skills/bdd-acceptance/SKILL.md:3,8` | `description` und Einleitung sind jetzt auf Dwello beschränkt. Sie bieten weder ein Bootstrap noch «any running system» an. |
| C-3 | – (behoben) | `docs/design/offene-punkte.md:61` | H-13 beschreibt jetzt den tatsächlichen Stand (siehe unten). |
| C-4 | – (behoben) | `docs/design/arbeitsregeln.md:3` | «(subagent `persona`)» hängt an den Personas, und das README steht nur noch einmal im Satz. |
| C-5 | Nit | `.claude/skills/bdd-acceptance/SKILL.md:31` | Das Beispiel nennt nur «Dann ist der Liegenschaftsverwalter auf der Seite …». Die Features prüfen einen Wechsel auch mit «… auf der Detailseite von …» (18×), «… auf der Mietvertragsliste» und «… auf der Gebäudeliste». Ein «z. B.» oder «Dann ist der Liegenschaftsverwalter auf der …» würde nicht nahelegen, dass nur dieser eine Step zählt. |

## Geprüft und in Ordnung

- **Navigationsregel gegen Dwello:** `building-detail.feature:29-49` hat ein Szenario je Ausgang, und jedes endet nur mit «Dann ist der Liegenschaftsverwalter auf der Seite …». Der Step (`common.steps.ts:20-23`) prüft den Seitentitel (`pageTitle`), keine URL. Die neue Formulierung «checks only that the move happened» ist deshalb genauer als die alte «(URL check)» und passt zum Code. Es bleibt auch kein Widerspruch zu `tests/e2e/CLAUDE.md:29` («names the page»). Das alte Abschlusskriterium «every page has a `.feature` file; … no scenario crosses page boundaries» fehlt. Seine Regel «eine Datei pro Seite» ist genau die offene Frage von H-13. Mit diesem Fund ist das also richtig erfasst und geht nicht verloren.
- **H-13 stimmt:** Mit `grep -i "per page|per area|feature file"` in `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `docs/test-pyramid.md` und `.claude/` findet sich keine Regel, wie Features geschnitten werden. Die Features sind teils nach Seite geschnitten (`building-detail.feature`, `tenant-edit.feature`), teils nach Bereich oder Thema (`navigation.feature`, `breadcrumb.feature`, `statement-rounding.feature`). «Decide whether to write a rule, and where» ist ein passender nächster Schritt.
- **Plan:** Die Zeile zur Runde 1 nennt den Bericht und den Status von C-1 bis C-4. Der Eintrag für Runde 2 bleibt offen, und das ist richtig.
- **Fremde Änderungen:** keine. `s16-review-1.md` ist der Bericht aus Runde 1 und gehört zum Ablauf.
- **Neuer Blocker oder Major:** keiner.

## Nicht bestätigt

- Diese Checks auf 450789e kommen vom Aufrufer, ich habe sie nicht erneut ausgeführt:
  - `bun run lint` 0
  - `bunx vitest run src/__tests__/open-work.test.ts` 0
