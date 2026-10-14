# Review #99 P-9b (Kategorie «vordefiniert» gespeichert), Runde 1

Commit: `34d18a9..6a944f9` (ein Commit, `fix(db): store whether a category is predefined`), gelesen im Worktree `review-p9b`. Alle 18 geänderten Dateien sind gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/migrations/0001_schema.sql:111 | `categories.type` hat keine `CHECK (type IN ('predefined', 'custom'))`. Die Anforderung verlangt einen Marker «wie `distribution_keys.type`», und `distribution_keys` (Z. 134) und `heating_profiles` (Z. 163) haben diese Einschränkung. Ein Tippfehler in einem späteren Insert wird so still gespeichert, und `toCategory` behandelt ihn als «eigene». |
| C-2 | Minor | tests/contracts/category.json, tests/contracts/README.md:26 | Der Vertrag deckt nur `GET /categories/:id` ab. Die Kategorienliste (`/config/categories/+page.server.ts` liest `GET /categories`) braucht `type` ebenfalls, hat aber keinen Vertrag. `type` in der Liste prüfen heute nur `category-type.pg.test.ts:28` und das E2E-Szenario. Der Lasttest in `categories.test.ts:29` antwortet mit einem eigenen Fake statt mit einem Vertragsbeispiel (das war schon vor diesem Commit so). |
| C-3 | Minor | src/__tests__/categories.test.ts:82-85 | Prettier hat einen unveränderten Testaufruf (`runAction(... 'Pellets' ...)`) umgebrochen. Mit #99 hat das nichts zu tun. CLAUDE.md erlaubt Prettier auf geänderten Dateien, deshalb nur Minor; der Block lässt sich trotzdem zurücknehmen. |
| C-4 | Nit | implementation_plan.md:44 | «`category-predefined.dom.test.ts` (3)»: Die Datei hat 4 Tests. Die Red-Zeile nennt drei Meldungen; offen bleibt, welcher Test nach dem Code geschrieben wurde. |
| C-5 | Nit | backend/migrations/0001_schema.sql:111 | Der Standardwert `'predefined'` folgt `distribution_keys`. Damit wird jede Zeile, die künftig an `createCategory` vorbei eingefügt wird (z.B. `fuel-stock.pg.test.ts:160` mit einer eigenen «Holz»-Kategorie), als vordefiniert gespeichert. Zurzeit unschädlich: In den Demodaten fügt nur `0002_stammdaten.sql` Kategorien ein. |

Es gibt keinen Blocker und keinen Major.

## Geprüft und bestätigt

- **Gespeicherter Marker:** `0001_schema.sql:110-111` und `schema.ts:172`. Die gesäten Zeilen in `0002_stammdaten.sql` (Z. 14, 31) übergeben `type` nicht und erhalten deshalb `predefined`. `createCategory` setzt `type: 'custom'` (`category.service.ts:168`) und überschreibt damit jeden Wert aus dem Body. Der Body ist ohnehin auf die Felder von `categoryBodySchema` beschränkt (`routes/categories.ts:28`), `type` ist dort nicht enthalten, und auch PUT kann ihn nicht ändern.
- **Backend liefert den Marker:** Liste (`category.service.ts:55`), Detail (`:102`) und `/allowed` (`select()`) geben `type` zurück.
- **BFF verwendet den Marker statt der Namensregel:** `src/lib/server/category.ts:25`. Liste und Bearbeiten (`fetchCategory`) laufen beide über `toCategory`. Die alte Namensregel steht nirgends mehr (grep auf `predefined` in `src`).
- **Unit-/DOM-Test:** `category-predefined.dom.test.ts` deckt ab, dass eine eigene Kategorie mit gleichem englischem Namen ihre Beschreibung in der Liste zeigt und keinen Hinweis für vordefinierte. Eine vordefinierte Kategorie behält den Hinweis. Der Test nimmt seine Daten aus dem Vertrag. Ich habe ihn zusammen mit `categories.test.ts` erneut ausgeführt: 14/14 grün.
- **pg-Test:** `category-type.pg.test.ts` prüft, dass eine über die API erfasste Kategorie `custom` ist (POST-Antwort und GET-Detail) und die gesäte «Caretaker» `predefined` (Liste).
- **Vertrag und Doku:** `category.json` ist neu, steht im README und wird in `api-contracts.pg.test.ts:127` gegen die echte API geprüft. `docs/data-model.md:142` nennt die Spalte.
- **Entfernter Test:** Er prüfte die Zuordnung der Namensregel für fünf Fälle. Die Regel gibt es nicht mehr. Was übrig bleibt (Liste lädt über `toCategory`, `predefined` kommt aus dem Backend), decken der verbleibende Lasttest (`categories.test.ts:29`), der DOM-Test und das E2E-Szenario ab. Dass eine eigene Kategorie mit deutschem Schlüssel nicht vordefiniert ist, ist jetzt eine Eigenschaft von `createCategory` und durch den pg-Test gedeckt. Es geht nichts verloren.
- **Szenario:** `categories.feature:52` ohne `@wip`, im Plan mit `Scenario red` vermerkt. Es beschreibt das Anliegen, nicht die Bedienung. Der Schritt ruft nur eine Seed-Aufgabe und die Frage `descriptionOf` auf, die den Text selbst liefert. Die Screenplay-Schichten sind eingehalten (Target → Question → Step). Der Seed reproduziert den Fehler: Mit `nameEN = name` hätte die alte Regel `name === nameEN` gegriffen.
- **Konventionen:** `data-testid="category-description"` ist kebab-case mit Kontext. Es gibt keine neuen UI-Texte, also keine Änderung an `messages/*.json`. Auch einen neuen Bildschirm oder UI-Zustand gibt es nicht: Die Beschreibung in der Liste gab es schon, sie wurde nur fälschlich ausgeblendet. Deshalb ist kein Eintrag in `screens.json` nötig.
- **Plan:** `Skills: tdd, ponytail, ponytail-review`, `Scenario red` und `Test red` sind vorhanden. Die Session enthält nur die laufende Aufgabe und die abgeschlossene vorherige (abgehakt).

## Nicht bestätigt

- Lint, `bun run check`, `bun run test:coverage` (2294), Backend `bun run test` (550) und `type-check`, `deepcheck:audit`, fallow sowie E2E `categories.feature` mit den axe/i18n-Zeilen `categories`, `category-new`, `category-edit` (24): vom Aufrufer gemeldet. Erneut ausgeführt habe ich nur `bunx vitest run` für `category-predefined.dom.test.ts` und `categories.test.ts`.
- `category-type.pg.test.ts` und den neuen Fall in `api-contracts.pg.test.ts` habe ich nicht ausgeführt (Backend-Tests schreiben in die Datenbank). Den Code habe ich gelesen. Dass die Testdatenbank `0002_stammdaten.sql` einspielt (Voraussetzung für «Caretaker»), habe ich nicht nachgeprüft.
- Die rote Phase des Szenarios und der Tests ist nur aus dem Plan übernommen und nicht nachgestellt.
