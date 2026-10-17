# Code-Review #204 / #220, Runde 3 (Re-Review von C-5)

Gegenstand: Die Basis `4c1d1a5` gibt es im Worktree nicht, deshalb `git diff HEAD~2 HEAD`. Das sind die Commits 71e65ee (Workflow-Notizen) und dcf08b2 (Korrektur), Worktree `review-204-close2`.

Gelesen:
- alle Dateien des Deltas
- dazu `backend/migrations/0007_category_descriptions.sql` (längster Text: Heizung, rund 205 Zeichen)
- `src/lib/ui/Textarea.svelte`, `CategoryRow.svelte` (`category-name`)
- `tests/e2e/screenplay/interactions.ts` (`Browser.resizeTo`), `tests/e2e/fixtures/screens.ts`
- `tests/a11y/screens.json` (mobile 390 × 844)
- die übrigen Aufrufer von `categoryRow`

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-5 | erledigt | src/routes/config/categories/CategoryForm.svelte:108 | Details unter «Bestätigt». |
| C-6 | erledigt | src/__tests__/category-predefined.dom.test.ts:46 | Der Test greift jetzt über `byTestId('category-description-input')` zu. |
| C-7 | erledigt | backend/src/__tests__/migrations.pg.test.ts:98-100 | Der Test prüft wieder, dass der Lift unverändert bleibt. |
| C-8 | Nit | tests/e2e/features/categories.feature:76 | «zeigt das Feld «Beschreibung» …» beschreibt die UI statt des Ziels. Besser wäre etwa «Dann ist die ganze Beschreibung zu lesen». Es gibt Vorbilder mit «Feld» (z. B. `statement-edit.feature:31`), deshalb nur ein Nit. |
| C-9 | Nit | tests/e2e/screenplay/questions.ts:57 | Der Zweig `scrollWidth - clientWidth` greift beim einzigen Aufrufer (`textarea`, bricht um) nie. Er ist aber harmlos und macht die Frage allgemein. |

Es gibt keinen Blocker und keinen Major.

## Bestätigt

**C-5 (rows 6 und Szenario):**
- **Abhilfe:** `rows={6}` ist die kürzeste Abhilfe aus Runde 2. Bei 390 px passen etwa 42 Zeichen auf eine Zeile. Der längste gelieferte Text (Heizung) braucht damit rund 5 Zeilen, 6 Zeilen reichen also.
- **Dieselben Komponenten:** `Textarea` aus `src/lib/ui`, keine neuen Klassen, keine neuen Texte. Deshalb braucht es nichts in `messages/*.json` und nichts in `screens.json`.
- **Szenario:** «Ganze Beschreibung einer vordefinierten Kategorie auf dem Telefon» steht ohne `@wip` in `categories.feature`. Es wählt bewusst den längsten Text (Heizung) und die Breite `viewports.mobile` (390 × 844), dieselbe wie bei axe.
- **Rot ohne die Änderung:** Gelesen ist das Szenario ohne die Änderung rot. Bei 3 Zeilen bleiben rund 2 bis 3 Zeilen von je etwa 24 px verborgen. Das passt zu den gemeldeten 72 px. Der Fehler zeigt den Wert (Pixel), nicht nur ja/nein.
- **Screenplay:** Die Steps rufen nur die Task `usePhone` und die Question `hiddenDescription`. `usePhone` folgt dem Muster von `useWindowWidth` und `useWindowOf`. Die Target-Ebene enthält keinen CSS-Selektor, nur `data-testid`.
- **Isolation:** Jedes Szenario bekommt eine eigene Page, die Viewport-Grösse wirkt also nicht in andere Szenarien hinein. Die Task läuft vor der Navigation.
- **Gemeinsame Frage:** `HiddenText` nutzt `single` und `quick` wie `Value`. Fehlt das Feld, antwortet sie `null`, und `toBe(0)` schlägt fehl. Ein leeres Durchlaufen ist damit ausgeschlossen.

**`categoryRow` mit genauem Namen:**
- Die Änderung ist nötig, weil «Heizung» jetzt auch in den Beschreibungen von Gebäudeversicherung und Verwaltung steht.
- Sie ist nicht unbeteiligt: Ohne sie fände das neue Szenario mehrere Zeilen (strict mode).
- `category-name` gibt es in `CategoryRow.svelte:27`.
- Andere Aufrufer: `categoryListed` und `listedCategoriesNamed` in `questions/categories.ts`. Mit dem genauen Namen sind sie strenger, nicht lockerer, die Strenge der Szenarien sinkt also nicht.

**C-6 / C-7:**
- Der DOM-Test ist mit `rows` 6 grün; ich habe ihn erneut laufen lassen.
- Die Prüfung auf den Lift wird rot, sobald `0007` die Zeile `Elevator` überschreibt.

**71e65ee:**
- Die Workflow-Notizen sind Dokumentation nach Schritt 8, das Plan-Item ist abgehakt. Es gibt keine Verhaltensänderung.
- `implementation_plan.md` nennt die geänderten Dateien und lässt «Re-review of C-5, PR» offen.

**Formatierung:** `prettier` zeigt in den neuen Zeilen keine Abweichung. Die einzige Abweichung in `CategoryForm.svelte` (Zeile 47) stammt nicht aus diesem Delta.

**Ponytail-Review:** Das Delta ist schlank: ein Prop, eine Task, eine Frage, ein Target und ein Szenario. Unbenutzt ist nichts, abgesehen von C-9.

**Unbeteiligte Änderungen:** keine.

## Nicht bestätigt

Erneut laufen lassen: `bunx vitest run src/__tests__/category-predefined.dom.test.ts`, 5 pass.

Vom Aufrufer gemeldet, nicht wiederholt:
- `bun run lint`
- `bun run check`
- Playwright chromium `-g 'ategor|Rechnung'` (186 passed)
- backend `migrations.pg.test.ts` (5 pass)
- Szenario rot mit `rows` 3 (72 px verborgen)

E2E und pg-Tests starte ich nicht, weil sie Build und Datenbank neu aufsetzen. Deshalb ist nicht gemessen:
- wie viel Reserve 6 Zeilen bei 390 px tatsächlich lassen (geschätzt: eine Zeile)
- ob Fonts, die auf anderen Geräten schmaler oder breiter laufen, das ändern

Eine vom Vermieter selbst verlängerte Beschreibung kann weiterhin im Feld scrollen. Das verlangt die Anforderung nicht.
