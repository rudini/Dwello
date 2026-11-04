# Code-Review #1068, Runde 1

Bereich: `git diff origin/main HEAD -- . ':!docs/reviews'` (34cad2e, b96cb09), Worktree `review-1068-code`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/statements/generate/BuildingStep.svelte:79 | Die Bedingung von `recalculate` ist nur im positiven Fall getestet: kein Test zeigt, dass der Hinweis zu «Neu berechnen» fehlt, wenn kein Gebäude abgerechnete Mietverträge hat, oder wenn das einzige betroffene Gebäude nicht wählbar ist (`!unchoosable(...)`, #1088). `generate-recalculate-note` kommt nur in `statement-wizard.dom.test.ts:1967-1968` vor (Anzahl 1); beide Teile der Bedingung lassen sich entfernen, ohne dass ein Test rot wird. |
| C-2 | Minor | src/routes/statements/generate/BuildingStep.svelte:138-142 | Der Hinweis zu «Neu berechnen» hat keine `id` und gehört nicht zu `describedBy` der Gruppe (Z. 33-37). Vorher hörte ein Screenreader den Satz in der Beschreibung jeder Checkbox. Jetzt hört er ihn beim Tabben gar nicht mehr, nur noch beim Lesen der Seite. Der Hinweis zu nicht geladenen Zählungen am selben Ort ist dagegen ausdrücklich «read with the group, not only seen» (Z. 31). Wenn man die `id` in `describedBy` der Gruppe aufnimmt, wird der Satz einmal angesagt, beim Eintritt in die Gruppe, und die Beschreibung jeder Checkbox bleibt ein einziger Satz. |

Keine Blocker, keine Major.

Geprüft: alle vier Fälle aus Einzahl/Mehrzahl und «alle abgerechnet» (mit einem und mit mehreren Mietverträgen) im Code und im DOM-Test (Z. 1790, 1821-1824, 1951, 1965-1966); Texte wörtlich wie «Decided (product owner)» in #1068; alle vier `messages/*.json` mit gleichen Schlüsseln und Platzhaltern; keine verwaisten Schlüssel (`statements_building_billed_one/many` ist nirgends mehr verwendet, `statements_building_recalculate` braucht auch `PreviewEmpty.svelte:33`); der Satz zu «Neu berechnen» steht einmal über der Liste; die Beschreibung der Checkbox ist ein Satz; nur Tokens (`text-ink-muted`, `basis-full`); der Zustand ist durch die Zeile `statement-generate | buildings-billed` in screens.json, accessibility.feature und sprachen-bildschirme.feature abgedeckt; die Schichten im E2E-Code sind eingehalten (Target -> Question `Text.ofAll` -> Step); die Question gibt den Text selbst zurück, und `toEqual([text])` prüft genau einmal; beide geänderten Szenarien und der neue DOM-Test schlagen auf dem Basis-Commit fehl (alte Texte, fehlende testid); die geänderten Zeilen der Szenarien prüfen nicht weniger als vorher, sondern einen neuen Text und dazu einen neuen Schritt; ponytail-review ohne Befund; nichts ausserhalb der Anforderung.

## Nicht bestätigt

- `Spec change approved: #1068` im Text des Pull Requests: Es gibt noch keinen Pull Request. Die geänderten Szenarien (statement-generate.feature:460-465, 474) haben kein `@wip` auf `main` und brauchen diese Zeile; der Entscheid im Issue deckt die Änderung.
- Folgende Checks hat nur der Aufrufer gemeldet: bun run lint, bun run check, bun run fitness, `bunx vitest run --changed origin/main` (114 bestanden), E2E Chromium statement-generate.feature (94 bestanden), axe- und Sprachzeilen «statement-generate» (148 bestanden), die gesehenen roten Läufe.
- Die Formulierungen auf fr/it/en habe ich nicht fachlich geprüft. Das hat `fach-reviewer` getan (docs/reviews/1068-fachreview-1.md, nicht gelesen).
