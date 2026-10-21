# Review #522, Runde 1 (ce1b9ec..68ab4a0)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/lib/contract-form.ts:193, backend/src/services/agreed-category.service.ts:42 | Der Weg «Kategorie in einem anderen Tab geändert, während das Formular offen ist», den das Issue nennt, bleibt still. **Bearbeiten:** Eine Kategorie war vereinbart (Zeile `agreed=true`), war dann nicht mehr umlagefähig und wird nach dem Laden wieder umlagefähig. Sie fehlt dann in `contract.agreedCategoryIds` und unter den Kästchen. `answeredOnly` zählt sie als beantwortet und setzt sie beim Speichern auf `agreed=false`. Damit fällt sie ohne Hinweis weg (das war vor dem Diff schon so). **Neuer Mietvertrag:** Eine Kategorie, die nach dem Laden angelegt wird, wurde vorher ohne Klick vereinbart. Jetzt wird sie still als «nicht vereinbart» beantwortet und nicht mehr als offene Frage gelassen, so dass die Abrechnung nicht nachfragt. Was abgerechnet wird, entspricht zwar dem, was das Formular zeigt. Die Zeile «weder behalten noch fallen gelassen, ohne dass der Verwalter es sieht» gilt für diesen Weg aber nicht. Zu lösen ist das entweder mit einem Backend, das nur angezeigte IDs beantwortet, oder durch eine Begründung im Pull Request bzw. ein eigenes Issue. |
| C-2 | Minor | src/lib/contract-form.ts:193-195, src/lib/contract-wizard.ts:113-115 | Beide neuen Filter wiederholen die Regel «angekreuzt = `agreed?.includes(id) ?? true` unter den angezeigten», die `agreedNames` (src/lib/contract-form.ts:199-200) schon enthält. Ein Helfer, der die angekreuzten Kategorien liefert, könnte alle drei Stellen bedienen. Heute steht dieselbe Regel an drei Orten, dazu `isAgreed` in AgreedCategories.svelte. |

Keine Blocker oder Majors.

Geprüft:
- **Bearbeiten mit `answeredOnly`:** Der Body enthält jetzt immer «angezeigt ∩ vereinbart». Das Bearbeiten hat auch vorher immer eine Liste gesendet, weil `initialContractValues` sie aus dem Mietvertrag übernimmt. Neu ist nur, dass versteckte vereinbarte Kategorien herausgefiltert werden.
- **Vereinbarte Kategorie, die nicht mehr umlagefähig ist:** Sie fehlt in `agreedCategoryIds()` des Backends und unter den Kästchen. `answered` verlangt `isAllowedUtilityCost`, also bleibt die Zeile unberührt. Abgerechnet wird sie ohnehin nicht. Keine Änderung.
- **Nie beantwortete umlagefähige Kategorie beim Bearbeiten:** Sie bleibt unbeantwortet wie vorher (W10c S3 C-1).
- **Entwurf im localStorage mit IDs, die nicht mehr angezeigt werden:** Body, `flatRateNotice`, `agreedNames` und `noneTicked` filtern einheitlich auf die angezeigten Kategorien.
- **Andere Aufrufer:** `contractBody` hat nur zwei Aufrufer (ContractForm, ContractWizard). Kein anderer PUT oder POST hängt davon ab, dass `agreedCategoryIds` fehlt.
- **`/categories/allowed`:** gleiche Sortierung wie die Liste (`sortOrder`, `name`), gleiche Route-Gruppe. Der Vertrag ist ergänzt.
- **Detailseite:** Sie nennt jetzt jede vereinbarte umlagefähige Kategorie.
- **Rote Tests aus dem Code beurteilt:** `categories.test`, `contract-new-load`, `contract-form` und `contract-wizard` scheitern alle ohne die Änderung (alte URL ergibt 404 bzw. ein Absturz bei `{categories}`; `agreedCategoryIds` fehlt; Zähler 1 statt 0).
- **Verdrahtung `contractBody(…, categories)`:** abgedeckt durch die E2E-Szenarien contract-new.feature:199 und contract-edit.feature:201.
- **«No scenario»:** Die Begründung hält. Mehr als 100 Kategorien in der gemeinsamen E2E-Datenbank würden Kategorien paralleler Szenarien aus den anderen Listen mit `limit=100` verdrängen (config/categories, buildings/[id]). Der Weg über einen zweiten Tab ist ein Rennen.
- **AgreedCategories.svelte:** Der verlangte DOM-Test fehlt, das ist aber vertretbar, weil die Komponente unverändert ist und die Body-Regel per Unit-Test belegt ist.
- **Sonst:** keine UI-Texte, keine Tokens, keine fremden Änderungen.

## Nicht bestätigt
- `bunx vitest run --changed origin/main` (904), `bun run lint`, `bun run check`, Backend type-check, `api-contracts.pg.test.ts` (56), E2E Chromium contract-*/contracts.feature (145) und die Rot-Läufe der neuen Tests: vom Aufrufer gemeldet, nicht wiederholt.
- Ob es für `src/lib/server/invoice.ts:45` (`categories?limit=100` im Rechnungsformular) ein eigenes Issue gibt: Die Issue-Suche ist aus dieser Sitzung gesperrt (gh search: 403).
- Ob «No scenario: …» auch im Plan und im Pull Request steht (`tests/e2e/CLAUDE.md`): Es steht nur in der Commit-Nachricht. `implementation_plan.md` ist vom Review ausgenommen.
