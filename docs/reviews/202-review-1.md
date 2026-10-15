# Code-Review #202, Runde 1

Geprüfter Stand: Worktree `review-202-code`, Commits `039eb29..8bc5674` (`1d1f0df` chore(tests): add @wip KI category scenario, `8bc5674` fix(services): show KI the predefined categories).

Gelesen: alle 8 geänderten Dateien (`backend/scripts/llm-stub.ts`, `backend/src/__tests__/category-allocability.pg.test.ts`, `backend/src/config/llm.ts`, `backend/src/services/llm.service.ts`, `docs/reviews/202-scenario-fachreview-1.md`, `implementation_plan.md`, `tests/e2e/features/categories-ki.feature`, `tests/e2e/steps/categories.steps.ts`), dazu `category.service.ts` (`listCategories`, `updateCategory`), `0002_stammdaten.sql`, `tests/e2e/tasks/accessibility.ts` (Bildschirm `ki-proposal-kept`), `backend/scripts/llm-eval.ts`, `tests/e2e/features/categories.feature`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `backend/src/services/llm.service.ts:214`, `backend/src/services/category.service.ts:175-191` | Eine vordefinierte Kategorie, deren Umlagefähigkeit der Vermieter geändert hat (z. B. «Hauswart» auf nicht umlagefähig oder «Reparaturen» auf umlagefähig), steht mit seiner Einstufung unter «VORDEFINIERTE …» im Prompt. Der Rest von Fachreview M-1 (Variante 1: «nur in ihrem Auslieferungszustand»), dort aber als «fixed» geführt. Die Entscheidung des Product Owners («type 'predefined'») ist umgesetzt. Die Lücke gehört deshalb als offene Arbeit ins Issue, nicht in diesen Slice. |
| C-2 | Nit | `implementation_plan.md:7`, `implementation_plan.md:9` | Der Plan nennt das Szenario «… wie die bestehenden» und den Test «zeigt der KI die bestehenden Kategorien …». Im Code heissen sie «… wie die vordefinierten» (`categories-ki.feature:8`) und «zeigt der KI die vordefinierten Kategorien …» (`category-allocability.pg.test.ts:59`). |
| C-3 | Nit | `backend/src/__tests__/category-allocability.pg.test.ts:73` | Die Zusicherung `not.toContain(own)` (eigene Kategorien bleiben draussen) war nie rot. Der Filter `type === 'predefined'` kam mit demselben Code, und die Red-Notiz zeigt nur das Scheitern von `toContain`. Ohne Filter würde sie fehlschlagen, weil `categoryLines` die eigene, nicht umlagefähige Kategorie listet. Das ist aber nicht gezeigt. |

Keine Blocker oder Major.

## Bestätigt

- **Korrektheit:** `buildAllocabilityPrompt` (`llm.ts:166-185`) füllt zwei Blöcke über das vorhandene `categoryLines`. Die Überschrift der umlagefähigen enthält den Vorbehalt aus Art. 257a Abs. 2 OR (Fachreview M-2). `proposeAllocability` (`llm.service.ts:213-215`) übergibt nur Kategorien mit `type === 'predefined'`. Ein Fehler von `listCategories` landet im vorhandenen `catch` und führt zu `null`, also «kein Vorschlag». Das ist dasselbe Verhalten wie bei einem KI-Fehler. Der Ersatz der Platzhalter läuft weiter in einem Durchgang, sodass Namen oder Beschreibungen des Vermieters nicht als Platzhalter gelesen werden.
- **Test auf unterster Ebene:** `category-allocability.pg.test.ts:59-79` läuft gegen echtes PostgreSQL und den KI-Stand-in. Er prüft drei Dinge:
  - die Zeile «Hauswart» im umlagefähigen Block,
  - die Zeile «Reparaturen» im nicht umlagefähigen Block,
  - dass die eigene Kategorie fehlt.

  Die erwarteten Zeilen stimmen mit `0002_stammdaten.sql:21,30` überein.
- **Szenario:** `categories-ki.feature` ist ohne `@wip` und ohne Hintergrund, womit Fachreview V-1 behoben ist. Die Formulierung ist fachlich, ohne UI-Wörter. Der neue Schritt (`categories.steps.ts:170-172`) ruft nur `verwalter.sees(allowedChosen)` auf, nutzt also Screenplay. Der Plan hält «Scenario red» fest.
- **Stand-in:** `llm-stub.ts:44-66` antwortet nur dann «umlagefähig», wenn die Zeile «Caretaker (Hauswart)» zwischen den beiden VORDEFINIERT-Überschriften steht. Sonst gibt er den Fehler aus #202 wieder. Die Einschränkung auf `/treppenhaus/` lässt «Fassadenreinigung» beim Standardeintrag (Fachreview V-2). Der Bildschirm `ki-proposal-kept` (`accessibility.ts:194-195`) bekommt weiterhin «umlagefähig», jetzt mit der Begründung «wie beim Hauswart» in allen vier Sprachen.
- **Konventionen:** keine UI-Texte, keine `messages/*.json`, keine neuen Bildschirmzustände. Die Antwort von `/categories/propose` bleibt gleich, also ist kein Vertrag in `tests/contracts` betroffen. Keine fachfremden Änderungen. Prettier prüft `backend/` nicht (`.prettierignore`).
- **Plan:** `Skills: tdd, ponytail, ponytail-review` ist vorhanden, ebenso die Zeilen «Test red», «Scenario red» und die Zeile von fach-reviewer Runde 1.

## Nicht bestätigt

- `bun run lint`, `bun run deepcheck:audit`, `cd backend && bun test src/__tests__/category-allocability.pg.test.ts` (8 grün, vorher rot), `bun run type-check` (Backend) und der Szenario-Lauf (grün, vorher rot an `allowedChosen`): vom Aufrufer gemeldet, nicht wiederholt (Backend-Tests und E2E darf ich nicht starten).
- Coverage, `bun run check`, die ganze Backend-Testsuite und die ganze E2E-Suite: laut Aufrufer nicht gelaufen. Ungeprüft bleibt, ob andere Szenarien oder die Bildschirmprüfungen (`ki-proposal-kept`) mit der neuen Stand-in-Begründung grün bleiben.
- Wie das Standardmodell `qwen2.5:3b` mit dem neuen Prompt urteilt: `bun run llm:eval` (`backend/scripts/llm-eval.ts:28`, «Treppenhausreinigung» erwartet umlagefähig) ist laut Plan noch offen. Die Wirkung auf ein echtes Modell ist damit nicht belegt.
- Issue #202 selbst («Done means»): nicht gelesen. Die Anforderung stammt aus der Zusammenfassung des Aufrufers und aus der Fachreview (`docs/reviews/202-scenario-fachreview-1.md`). Die Entscheidung des Product Owners zu M-1 ist nur im Plan (`implementation_plan.md:9`) festgehalten.
