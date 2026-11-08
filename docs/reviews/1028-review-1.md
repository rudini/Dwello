# Code-Review #1028, Runde 1 (60f4a28bc, Basis origin/main 75b78a9)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/__tests__/i18n.test.ts:65-72 | Die Liste `rewrittenBy687` hängt an keinem Marker, den CI prüft (`tools/open-work/check-issues.mjs` erkennt nur `TODO(fachlich prüfen, #n)`). Schliesst der Pull Request zu #687, ohne die Liste zu entfernen, schlägt nichts fehl, und die sechs Gründe bleiben für immer ungeprüft. Der Kommentar auf #687 sagt nur «until #687 merges it skips these six», nicht, dass #687 die Liste entfernen muss. Ausserdem nennt er V-3 («OBLF») und V-4 (U+00A0 nach dem Komma vor «al.»/«let.») nicht, die diese Prüfung jetzt verlangt. Lösung: Kommentar auf #687 ergänzen (Liste in `i18n.test.ts` entfernen, Regeln V-3/V-4). |
| C-2 | Minor | tests/e2e/features/categories.feature:78, tests/e2e/steps/categories.steps.ts:341 | Der Schritt «… dass Dwello sie bei jedem Mietvertrag unter "Vereinbarte Nebenkosten" festhält» sagt etwas anderes als der Hinweis, den er prüft. Laut Text hält der Liegenschaftsverwalter sie in Dwello fest («In Dwello halten Sie sie … fest»), nicht Dwello selbst. Das Szenario ist neu und noch nicht auf `main`, die Zeile lässt sich also frei ändern. |

Geprüft:
- In `messages/*.json` ändern sich je Sprache 17 Schlüssel. Ein Skript hat alle Schlüssel mit der Basis verglichen: Ausser bei `categories_contract_note` ändern sich nur Leerzeichen, und die Schlüssel selbst und ihre Reihenfolge bleiben gleich.
- `categories_contract_note` stimmt in allen vier Sprachen Zeichen für Zeichen mit `docs/reviews/1028-fachreview-1.md` überein.
- Die Bezeichnungen passen zu `contracts_agreed_costs_label`.
- In den Schlüsseln, die der Test prüft, brechen die Gesetzesverweise nicht mehr um. Alle Klammerverweise wurden mit markierten U+00A0 und U+2060 aufgelistet: Ein normales Leerzeichen bleibt nur zwischen Gliedern einer Liste («, 256b und 257a») und vor dem Namen des Gesetzes nach «al. 1,», und beides ist erlaubt.
- Die Regex trifft jedes Muster aus dem Entscheid und aus V-3/V-4. Mit `checked.length > 15` kann der Test nicht durch einen leeren Filter grün werden.
- Ohne den Diff schlagen der i18n-Test, der DOM-Test (jetzt `toBe` in vier Sprachen statt `toContain` nur auf Deutsch) und das Szenario fehl.
- `reasons()` und `Text.of` machen U+00A0 zu normalen Leerzeichen (`\s` umfasst U+00A0), deshalb gelten die bestehenden Prüfungen weiter. Der Diff fügt kein U+2060 hinzu.
- Die Texte nutzt nur das Frontend (`CategoryReason.svelte`, `categories/+page.svelte`, `invoices/[id]/+page.svelte`).
- Kein neuer Bildschirm und kein neuer Zustand, also keine neuen a11y- oder Sprachzeilen nötig.
- Die Steps rufen nur Questions auf (`contractHint`). Das Feature beschreibt, was der Liegenschaftsverwalter will, nicht wie. Keine Zeile eines bestehenden Szenarios ändert sich.

## Nicht bestätigt
- Folgende Prüfungen meldet der Aufrufer als gelaufen; ich habe sie nicht selbst ausgeführt:
  - «vom Aufrufer gemeldet»: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`
  - «vom Aufrufer gemeldet»: `bunx vitest run` komplett (4362 Tests, 4 behobene Fehler, danach i18n, categories-page und invoice-pages mit 252 Tests grün)
  - «vom Aufrufer gemeldet»: `bun test src/__tests__/pdf-translations.test.ts`
  - «vom Aufrufer gemeldet»: E2E `categories.feature` und `invoice-detail.feature` (76 Tests)
  - «vom Aufrufer gemeldet»: axe- und Sprachzeilen für categories, category-new, category-edit-predefined und invoice-detail (36 Tests)
  - «vom Aufrufer gemeldet»: die Rot-Läufe auf 0994e9213
  - «vom Aufrufer gemeldet»: Prettier nur auf den eigenen Blöcken
- Ob die Texte mit U+00A0 auf 390 px wirklich ohne seitliches Scrollen umbrechen, habe ich nicht im Browser gesehen. Die längste geschützte Folge ist kurz (etwa «Art. 5 Absatz 2 Buchstabe d»).
