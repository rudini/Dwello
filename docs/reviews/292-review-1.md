# Code-Review #292, Runde 1 (6a76fbcf..c033562c)

Worktree: `/tmp/claude-0/-home-user-Dwello/885a1125-b6db-5975-8e5c-ec01f947f577/scratchpad/review-292-code`. Alle 24 geänderten Dateien gelesen, dazu `src/lib/server/invoice.ts`, `src/lib/server/category.ts` (`toCategory`: `key`, `predefined`), `backend/src/routes/categories.ts`, `api-contracts.pg.test.ts` (Drift-Prüfung), `tests/a11y/screens.json`, `tests/e2e/fixtures/screens.ts`, `tests/e2e/CLAUDE.md` (Rules), Issue #292, #397, #398, #399 und #407.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | messages/de.json:104 (`glossary_allocable_text`, auch fr/it/en; gepinnt in help.feature:41, help-page.dom.test.ts:91) | Die Hilfe-Seite hat noch die alte, weiche Vertragsregel «wenn der Mietvertrag sie als Nebenkosten nennt». Der Vertragshinweis und der Hilfetext sagen jetzt «jede dieser Kostenarten einzeln». Liegt ausserhalb von «Where» in #292: Issue öffnen oder an #407 anhängen |
| C-2 | Minor | – (Fachreview V-1, Major) | Die Beschreibung von «Lift» (`0002_stammdaten.sql:20`, «ohne … Serviceabos mit Reparaturen») steht auf der Bearbeitungsseite neben dem neuen Lift-Grund (Vollservicevertrag). Verschoben nach #399, als Duplikat geschlossen zugunsten von #407 (`entscheiden`, offen). Gehört unter «Blocked on me», weil dieser Widerspruch mit dieser Änderung entsteht |
| C-3 | Minor | src/__tests__/invoice-pages.dom.test.ts:305-319; tests/e2e/features/invoice-detail.feature:483-496 | «ausgeschlossen» und «umgestellt» (DOM) sowie «Ausgeschlossene Rechnung … nennt keinen Grund» (E2E) bestehen auch auf dem Basis-Commit, weil es dort nie einen Grund gab. Das Szenario «eigene Kategorie» scheitert auf dem Basis-Commit nur an der Fixture (`predefinedCategory("Dachsanierung")`), nicht am Verhalten. Sie sichern die Grenzen von `reasonCategory`/`reasonOf` ab und scheitern, wenn diese Grenzen fehlen; als Schutztests annehmbar, aber «seen red» stimmt nur für eine Implementierung ohne diese Grenzen |
| C-4 | Nit | tests/e2e/features/invoice-detail.feature:473 | «also umlagefähig.» passt auf jeden umlagefähigen Grund. Dass es der Grund von «Hauswart» ist, prüft nur der DOM-Test (invoice-pages.dom.test.ts:292-296). Ein Wort aus dem Hauswart-Grund (z. B. «Die Hauswartung ist also umlagefähig.») wäre strenger |
| C-5 | Nit | src/__tests__/categories-page.dom.test.ts:163 | shrink: `expect([reason, reason.indexOf(short)]).toEqual([reason, …])` → `expect(reason.indexOf(short), reason).toBe(reason.indexOf(law) + law.length - short.length)` |
| C-6 | Nit | src/routes/config/categories/CategoryReason.svelte:31-33 | Freistehender Kommentar mit TODO-Markern und Leerzeile, an keine Deklaration gebunden; besser über `REASONS` (Z. 5) |
| C-7 | Nit | src/routes/invoices/[id]/+page.svelte:385; CategorizationPanel.svelte:406 | `reasonOf(reasonCategory(invoice))` wird zweimal ausgewertet (Seite für den Hinweis, Panel für den Grund). Kurz und lesbar; nur erwähnt |
| C-8 | Nit | implementation_plan.md:61 | Doppelte Leerzeile vor `## Session` |

Ponytail-review: C-5, C-6, C-7. Die Änderung an der Fixture (`backend.ts:520-522`), der Typ `category` in `types.ts:334` und `reasonCategory` sind die kürzeste Lösung. Die Umbrüche in `invoice.service.ts:44-51` und `language.ts:559-573` entstehen durch die Zeilenlänge (Prettier), sie sind keine fremde Umformatierung. net: -3 lines possible.

Keine Blocker, keine Majors.

## Bestätigt (Anforderung → Code und Test)

- Jeder Grund endet mit «also (nicht) umlagefähig»: messages/de.json:1379-1399; Test categories-page.dom.test.ts:144-151 (alle 21, de). Die anderen Sprachen sind gleich gebaut («therefore (not) allocable» usw.), aber ungetestet.
- OR/VMWG pro Grund ausgeschrieben, die Abkürzung erst danach: Test categories-page.dom.test.ts:154-165 (alle vier Sprachen); Szenario categories.feature («Obligationenrecht, OR»).
- Feuerlöscher-Wartung und Schädlingsbekämpfung «umstritten» mit dem Merkblatt: de.json:1398-1399 (Wortlaut wie Fachreview M-1, M-3); Szenario categories.feature:438-439, 450; DOM-Test Z. 99, 186.
- Lift mit dem Wartungsanteil eines Vollservicevertrags: de.json:1384; Szenario Z. 440; DOM-Test Z. 100.
- Gebäudeversicherung mit der Ausnahme für die Heizung (Art. 5 Absatz 2 Buchstabe h VMWG): de.json:1392; Szenario Z. 442.
- Vertragshinweis und Hilfetext «jede dieser Kostenarten einzeln nennt»: de.json:1378, 1400; DOM-Test Z. 87, 175; Szenario Z. 445.
- Hinweis bei unsicherer KI «Im Zweifel: nicht umlagefähig»: de.json:1678; categories.test.ts:216-254 (de/fr/it/en); Szenario Z. 458.
- Die Rechnung zeigt den Grund ihrer Kategorie, nicht als Warnung (`<p class="text-ink-muted">`, kein Alert): CategorizationPanel.svelte:406, +page.svelte:385; Backend liefert `category.type` (invoice.service.ts:76), Contract invoice.json:30 (die Drift-Prüfung in api-contracts.pg.test.ts:128 wird ohne die Backend-Änderung rot); DOM-Tests invoice-pages.dom.test.ts:292-303; Szenarien invoice-detail.feature:471-480.
- Keinen Grund zeigen bei einer eigenen Kategorie, bei geänderter Umlagefähigkeit der Kategorie und bei einer ausgeschlossenen Rechnung: `reasonOf` und `reasonCategory` (CategoryReason.svelte:38-47); Tests siehe C-3; der allgemeine Hinweis bleibt dort (Szenarien Z. 487, 495).
- Alle Texte in allen vier `messages/*.json` (je 25 Schlüssel, dieselben Schlüssel). Der Merkblatt-Titel ist in `language.ts` als Eigenname erlaubt.
- Demo-Rechnungen «Wartungsabonnement Lift»: demo-data.sql:107, 126.
- Screens: kein neuer Bildschirm; `invoice-detail` default zeigt den Grund (Hauswart-Rechnung aus der Fixture). Markers #397 und #398 sind offen.
- E2E-Schichten: Schritte rufen nur Questions auf (`reasonOfCategory`, `reasonsOfCategory`, `tenancyLawNotes`); die Negativprüfungen haben vorher einen positiven Anker; die Features enthalten keine UI-Wörter.

## Nicht bestätigt

- Ausgeführt habe ich selbst: `bunx vitest run src/__tests__/categories-page.dom.test.ts src/__tests__/categories.test.ts src/__tests__/invoice-pages.dom.test.ts` (165 bestanden).
- Vom Aufrufer gemeldet, nicht wiederholt: `bun run lint`, `bun run check`, Backend `bun run type-check`, volle `bunx vitest run` (3015), `bun test api-contracts.pg.test.ts category-allocability.pg.test.ts`, E2E chromium für `categories.feature` und `invoice-detail.feature` (38), axe und Sprachzeilen für categories, category-new, category-edit-predefined und invoice-detail (24).
- Fachliche Richtigkeit der fr/it/en-Wortlaute: verlassen auf `docs/reviews/292-fachreview-1.md`. Ob die Nits V-11 und V-13 dort umgesetzt sind, habe ich nur stichprobenartig geprüft (it «ordinanza concernente la locazione» im Test).
- Ob `bun run llm:eval` nötig ist: Prompt und Kategorienbeschreibung sind unverändert, daher wohl nicht.
