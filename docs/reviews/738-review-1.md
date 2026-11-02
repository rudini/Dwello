# Code-Review #738, Runde 1 (origin/main..00ca14e65)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/__tests__/statement-wizard.dom.test.ts (fehlt) | Der Fix (`fix(statements)`) hat keinen Test auf der tiefsten Schicht: Hinweis bei fehlgeschlagener Zählung, `aria-labelledby` nur mit Name und Adresse, Beschreibung mit Zählungen, «1 Wohnung» in der Einzahl und Fokus auf der Überschrift beim Fortsetzen sind nur über E2E belegt |
| C-2 | Minor | tests/e2e/targets/statement-generate.ts:174 | Target `stepHeading` wird nirgends verwendet (der Fokus wird über `focusedPlace` geprüft) |
| C-3 | Minor | tests/e2e/tasks/accessibility.ts:751-752 | Kopie von `invoicesCannotBeCounted` und `billedCannotBeChecked` aus `tasks/statement-generate.ts` (die Datei importiert dort schon `goToGeneration` und `leaveSettings`) |

## C-1 (Major): kein DOM-Test für den Fix

`CLAUDE.md`, Workflow 2: «Every bug fix also gets a test that reproduces it first, at the lowest layer that can show it (unit, DOM or `*.pg.test.ts`)». Alle vier Verhaltensweisen lassen sich in `statement-wizard.dom.test.ts` zeigen. Die Datei mountet den Assistenten schon mit einem gefälschten Backend, das `/invoices` und `/statements/billed` pro Pfad beantwortet (z. B. Zeilen 1540, 1575, 1774), und mit einem Entwurf in `localStorage` (Zeilen 1397, 1445). Der Diff ändert dort nur eine einzige Prüfung, und die ist gelockert (`toBe` → `split(' ')).toContain`). Keine neue Prüfung hält:
- `generate-counts-failed` mit dem jeweiligen Text, wenn eine der beiden Antworten fehlschlägt, und kein Hinweis, wenn beide gelingen;
- `aria-labelledby` = Name und Adresse, und `aria-describedby` enthält die Anzahl Rechnungen und die Wohnungen (ohne Rechnungen, wenn die Zählung fehlschlug);
- «1 Wohnung» gegenüber «N Wohnungen»;
- `document.activeElement` ist das `h2` von Schritt 2 nach einem wiederhergestellten Entwurf in Schritt 2, und beim normalen Laden in Schritt 1 nicht.

So zeigen Sie es: Nehmen Sie in `BuildingChoice.svelte` `aria-labelledby` heraus oder setzen Sie die Einzahl zurück, und führen Sie `bunx vitest run src/__tests__/statement-wizard.dom.test.ts` aus. Die Datei bleibt grün; nur E2E fällt durch.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (596 Tests), `open-work.test.ts`, `design-guard.test.ts`, E2E auf Chromium (5 neue Szenarien, die passenden Szenarien aus `statement-generate.feature`, alle `statement-generate`-Zeilen von `accessibility.feature` und `sprachen-bildschirme.feature` inkl. `buildings-counts-failed`, 170 bestanden). Firefox und WebKit liefen nicht.
- 390 px: Dass «Wohnungen» schon auf dem Basis-Commit nicht aus der Karte ragt (Szenario hält bestehendes Verhalten fest, Commit-Nachricht sagt es), kann ich ohne Browser nicht prüfen. Ich habe nur gelesen, dass `HiddenSideways.within` die Karte und alle ihre Teile misst und deshalb ein Überstehen erkennen würde.
- Rot ohne die Änderung nur durch Lesen beurteilt: Die Szenarien zu fehlgeschlagenen Zählungen, Name/Beschreibung und Fokus schlagen auf der Basis fehl (kein Hinweis; Name = ganzer Kartentext; kein Fokus beim Wiederherstellen).

Geprüft: Texte in allen vier `messages/*.json`, Tokens, `data-testid`-Namen, Zeilen für screens.json, a11y und Sprachen; Screenplay-Schichten (Steps rufen nur Tasks und Questions auf); Questions geben Werte zurück (Text, Name, Beschreibung, Pixel, testid); `FailRequests` trifft die Abfragen von `BuildingStep` (`isValidUtilityCost: 'true'`, `/statements/billed`); `failed` wird zurückgesetzt, weil `BuildingStep` nur in Schritt 2 gemountet ist; keine API-Antwort geändert, kein Vertrag betroffen; nichts im Diff, das nicht zur Anforderung gehört.
