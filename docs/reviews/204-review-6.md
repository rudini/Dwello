# Review 6 (Merge b086219, PR #297, #204/#220)

Geprüft: `git diff b086219^2 b086219` (was der Zweig über main bringt, 24 Dateien, nur Dateien dieses PR) und `git diff b086219^1 b086219` (was main bringt, v. a. #166/#219 und #250/#254), im Worktree `review-204-merge3`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | backend/src/__tests__/migrations.pg.test.ts:42 | Kommentar «every migration before 0021» stimmt nach dem Merge nicht mehr: der Filter lässt nur 0021 weg, 0022 läuft mit. Am Test ändert das nichts (0022 fasst `categories` nicht an), nur der Text sollte «every migration except» heissen. |
| C-2 | Minor | (Prüfangabe) | Die Angabe «b4a6a97, gleiches Backend» stimmt nicht: zwischen b4a6a97 und b086219 hat main `category.service.ts` (`updateCategory` behält den Schlüssel einer vordefinierten Kategorie, `deleteCategory` lehnt vordefinierte mit `CATEGORY_PREDEFINED` ab), `category-predefined.pg.test.ts` und `service-period.pg.test.ts` geändert. Beim Lesen sehe ich keine Wechselwirkung mit 0021 und den neuen pg-Tests: Die Tests ändern keine vordefinierte Kategorie über die API und löschen keine. Die Backend-Suite auf b086219 sollte aber vor dem Merge einmal laufen (CI tut es). |

Keine Blocker oder Majors.

## Geprüft und bestätigt

- **Konfliktauflösung** `tests/e2e/questions/categories.ts` und `tests/e2e/steps/categories.steps.ts`: Beide Seiten sind ganz erhalten (`hiddenDescription` mit `HiddenText` und `descriptionInput`; `kindOf`, `whyNotDeletable` und `predefinedHintText` mit `Accessible`, `kindBadge` und `predefinedHint`). Die Imports sind vollständig, kein Rest ist doppelt oder ungenutzt.
- **`categoryRow` mit exaktem Namen** (`targets/categories.ts:3-7`): Er filtert auf `category-name` mit `exact: true`. In `CategoryRow.svelte` enthält `category-name` nur `localName(category)`; das Badge `category-kind` aus main liegt ausserhalb davon. So treffen main's neue Szenarien die richtige Zeile: «Liegenschaftssteuer» (vordefiniert) und «Treppenhausreinigung» über `names.get(title)`, also über den vollen gespeicherten Namen. Der Negativ-Check «nicht löschen» (`Enabled.of(deleteButton)`) wird nicht weicher: Eine fehlende Zeile liefe in einen Timeout und ergäbe kein `false`. `distribution-keys` hat eigene Targets und ist nicht betroffen.
- **`categories.feature`**: Unser Szenario (Telefon, Heizung) und die drei neuen Szenarien aus main (#166) stehen unverändert nebeneinander. Die Grundlage ist unverändert, und kein Szenario wurde gelockert.
- **`CategoryForm.svelte`**: Unser `Textarea` (rows 6, `category-description-input`) und main's `ki`-Prop (`{#if ki}` statt `{#if action}`) liegen in getrennten Hunks. `new/+page.svelte` übergibt `ki={data.kiEnabled}`, und die Bearbeitungsseite zeigt den KI-Knopf nicht mehr; unser Szenario braucht ihn nicht.
- **Migration**: `0021_category_descriptions.sql` vor `0022_contract_billed_until.sql`. `migrate.ts:19` sortiert nach Namen und lehnt nur unbekannte, schon angewandte Dateien ab (`:30`). Eine Datenbank mit 0022 und ohne 0021 bekommt 0021 nachgereicht; beide Dateien sind voneinander unabhängig.
- Keine neuen Texte, Bildschirme oder Zustände durch den Merge: `messages/*.json` und `screens.json` sind auf unserer Seite unverändert.
- DOM- und Unit-Tests selbst neu laufen lassen: `bunx vitest run src/__tests__/category-predefined.dom.test.ts src/__tests__/categories-page.dom.test.ts src/__tests__/categories.test.ts src/__tests__/design-guard.test.ts` ergibt 504 von 504 grün.

## Nicht bestätigt

- lint, check und Playwright chromium `-g 'ategor'` (60 bestanden) auf b086219: vom Aufrufer gemeldet.
- Backend type-check und Backend-Suite (932 bestanden): vom Aufrufer gemeldet, und zwar auf b4a6a97, nicht auf b086219 (siehe C-2). Selbst nicht ausgeführt (schreibt in die Datenbank). Gelesen: `category.service.ts` und `category-predefined.pg.test.ts` aus main sowie unsere Tests `migrations.pg.test.ts`, `invoice-categorization.pg.test.ts` und `heating-profiles.pg.test.ts`.
- `llm:eval`: Ergebnisse stehen nur im Plan-Archiv; nicht nachgeprüft.
