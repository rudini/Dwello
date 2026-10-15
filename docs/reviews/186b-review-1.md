# Code-Review #186 Slice B, Runde 1

Gegenstand: `f50d112..80c804a` (ein Commit `80c804a`, Worktree `review-186b-code`), dazu das Delta der Review von Slice 216 (`docs/reviews/216-review-1.md`: L-2 behoben, L-3 und L-4 abgelehnt).

Ergebnis: ein Major (M-1), sonst nur Minor und Nit.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| M-1 | Major | `src/routes/config/categories/CategoryForm.svelte:120`, `CategoryReason.svelte:315-318` | Auf der Bearbeitungsseite richtet sich der Grund nach der gespeicherten Kategorie (`category`), nicht nach der Wahl im Formular (`values.allowed`). Wählt der Liegenschaftsverwalter die andere Umlagefähigkeit, bleibt der Satz stehen, der das Gegenteil begründet. Das ist genau der Widerspruch aus H-4. |
| M-2 | Nit | `src/routes/config/categories/CategoryForm.svelte:120` | Der Grund steht als loser Absatz nach der `RadioGroup` und ist nicht per `aria-describedby` mit der Gruppe verbunden. Wer per Tab in die Radios springt, hört ihn nicht. Der Hilfetext der Gruppe ist dagegen verbunden. |
| M-3 | Nit | `tests/e2e/fixtures/backend.ts:271-274` | `predefinedCategoryId` wiederholt zum fünften Mal die Suche `get('categories?limit=100') … find(nameDE === …)` (vgl. `invoiceOn`, `predefinedCategoryAllowance`, `supplierInvoice` in derselben Datei). Eine gemeinsame Suche würde reichen. |
| M-4 | Nit | `tests/e2e/fixtures/screens.ts:90` | `seedFor` ruft `predefinedCategoryId` für jede Bildschirmzeile auf, nicht nur für `{predefinedCategory}`. Das ist eine zusätzliche Backend-Abfrage pro axe- und Sprachzeile. |
| M-5 | Nit | `src/routes/config/categories/CategoryReason.svelte:287-309` | Die Umlagefähigkeit jedes Schlüssels ist eine zweite Kopie der Werte aus `backend/migrations/0002_stammdaten.sql:15-39`. Kein Test verbindet die beiden. Ändert eine spätere Migration einen vordefinierten Wert, verschwindet der Grund stillschweigend. Heute stimmen alle 21 Schlüssel und Werte überein (geprüft). |

## M-1 (Major): Grund widerspricht der Wahl im Bearbeitungsformular

- **Was falsch ist:** `<CategoryReason {category} />` bekommt die geladene Kategorie. `reasonOf` vergleicht deshalb mit `category.isAllowedUtilityCost`, also dem gespeicherten Wert. Die Radiogruppe darüber hält `values.allowed`. Nach dem Umschalten auf «Umlagefähig» steht unter der gewählten Option bei «Feuerlöscher-Wartung» weiter «Brandschutz ist auch nötig, wenn das Gebäude leer steht; die Wartung hängt nicht mit dem Gebrauch zusammen.» Das bleibt auch nach einer abgelehnten Speicherung mit umgestellter Wahl so.
- **Warum das zählt:** Laut Anforderung wird der Satz nur gezeigt, solange die Kategorie ihre vordefinierte Umlagefähigkeit behält; wer sie umstellt, sieht keinen. H-4 nennt als Grund ausdrücklich «ein Widerspruch auf demselben Bildschirm». Der Kommentar in `CategoryReason.svelte:312-313` sagt selbst: «so no sentence argues against the choice next to it». Die Bearbeitungsseite ist der Ort, an dem umgestellt wird, und genau dort gilt die Regel nicht. Der Test «nennt keinen festen Grund, wenn … geändert hat» (`categories-page.dom.test.ts:108`) prüft nur die Liste.
- **So zeigt man den Fehler:** DOM-Test mit `show(EditCategoryPage, { data: { category: fireExtinguisher }, form: null })`, dann die Option `true` der Gruppe `isAllowedUtilityCost` anklicken. Erwartet wird, dass `category-reason` fehlt. Tatsächlich ist der Satz noch da.
- **Mögliche Korrektur:** Die Wahl im Formular übergeben, z. B. `<CategoryReason category={category && { ...category, isAllowedUtilityCost: values.allowed === 'true' }} />`. Soll der Satz beim Bearbeiten dagegen absichtlich als Begründung der Vorgabe stehen bleiben, gehört das als Entscheid zum `fach-reviewer`. Dann müssen auch Anforderung und Kommentar angepasst werden.

## Bestätigt durch Code und Test

- **Grund je vordefinierter Kategorie in Liste und Bearbeitung, vier Sprachen:** `CategoryReason.svelte` (21 Schlüssel). Die Schlüssel und ihre Umlagefähigkeit stimmen alle mit `0002_stammdaten.sql:15-39` überein, auch `'Electricity Common Areas'` und `'Fire Extinguisher Maintenance'` (gespeichertes `name`, nicht `name_en`). Der Komponent ist in `CategoryRow.svelte:33` und `CategoryForm.svelte:120` eingebunden. `key` kommt in `toCategory` aus `c.name` (`category.ts:18`). `updateCategory` sendet nur `nameDE`, der Schlüssel bleibt also beim Umbenennen erhalten. Tests: `categories-page.dom.test.ts` «nennt in der Liste den Grund …» (ein Beispiel umlagefähig und eines nicht, ganzer Satz) und «nennt den Grund beim Bearbeiten …»; `categories.test.ts` «behält den Schlüssel …» liest den Vertrag `tests/contracts/category.json`. Szenarien `categories.feature:62-75` ohne `@wip`. Alle 21 `categories_reason_*` stehen in de/fr/it/en, fr/it/en ohne deutschen Rest (gelesen), und entsprechen den Korrekturen aus `186-fachreview-1.md` (H-1, H-5 bis H-9, H-15, H-17, H-21; stichprobenweise wörtlich verglichen: Reparaturen, Renovation, Verwaltung, Kehricht, Heizung, Warmwasser mit «Abs. 1» nach H-15).
- **Nicht bei geänderter Umlagefähigkeit (Liste), nie bei eigenen Kategorien:** DOM-Tests «nennt keinen festen Grund …» und «nennt bei eigenen Kategorien keinen Grund, auch mit dem Namen einer vordefinierten»; Szenario «Geänderte vordefinierte Kategorie …» mit positivem Anker («ist … nicht umlagefähig») vor der negativen Prüfung. Bearbeitungsformular: siehe M-1.
- **Hinweis auf den Mietvertrag einmal in der Liste (H-14):** `+page.svelte:71`, Test «sagt in der Liste, dass der Mieter nur bezahlt …», Szenarioschritt «erfährt der Liegenschaftsverwalter …». Der Text steht in allen vier Sprachen.
- **Hilfetext:** «bei Heizung und Lift zählen nur Betrieb und Wartung der Anlage» und «Bei Wasser, Abwasser und Kehricht …», wörtlich nach H-16, in vier Sprachen; Test «grenzt im Hilfetext Wartung ein und nennt Kehricht».
- **«Absatz» statt «Abs.»:** In `messages/de.json` steht kein «Abs.» mehr. Die Änderung an `invoices_legal_text` ist im Plan begründet, und ihr Test ist nachgeführt (`invoice-pages.dom.test.ts:210`).
- **Bildschirme:** `category-edit-predefined` steht in `screens.json`, `accessibility.feature:143` und `sprachen-bildschirme.feature:144`; die Seed-ID kommt aus `screens.ts:90`.
- **E2E-Schichten:** Die Schritte rufen nur Fragen und Tasks auf (`categories.steps.ts:212-237`). `Wait.until(nameInput)` in `openPredefinedCategory` wartet auf den Zustand nach dem Klick. Die Fragen liefern Text bzw. Anzahl.
- **Tokens/UI:** nur `text-ink-muted`, keine neuen Bedienelemente.
- **Plan:** Für Slice B stehen `Test red` je Test, `Scenario red` und `Skills: tdd, ponytail, ponytail-review` im Plan.
- **Delta 216:** L-2 ist durch `invoice-pages.dom.test.ts` «nennt auf fr/it die Gebäudeversicherung …» abgedeckt (grün nachgeprüft, die Locale wird im `finally` zurückgesetzt). Die Ablehnung von L-3 hält: Mit `enabled: boolean` und der Prüfung `!data.enabled` würden die rund zehn DOM-Tests ohne `enabled` (`privacy-page.dom.test.ts`, `privacy-i18n.dom.test.ts`) den Text «aus» zeigen. Weil das Backend das Feld immer sendet, ist das Risiko gering. Die Ablehnung von L-4 hält ebenfalls: Der Hilfetext ist Fliesstext, der Rechnungshinweis zählt Kategorienamen auf.

## Nicht bestätigt

- Von mir erneut ausgeführt und grün: `bunx vitest run src/__tests__/categories-page.dom.test.ts src/__tests__/categories.test.ts src/__tests__/invoice-pages.dom.test.ts src/__tests__/no-german-in-code.test.ts` (453 Tests).
- «Vom Aufrufer gemeldet», nicht erneut ausgeführt: `bun run lint`, `bun run check`, `deepcheck:audit`, `fallow audit`, das Rot der neuen Tests und Szenarien (auch das Rot von L-2 vor K-2) und E2E chromium (45 Tests, «Grund der Umlagefähigkeit beim Bearbeiten» 3 von 3 mit `--repeat-each`).
- Die fachliche Richtigkeit der fr/it/en-Übersetzungen der 21 Gründe (Begriffe wie «abonnements de service», «OBLF»/«OLAL») habe ich nicht geprüft. Das gehört in die Feature-Review des `fach-reviewer`.
- Ob der Grund auf der Bearbeitungsseite bei Mobilbreite ohne seitliches Scrollen umbricht: nur aus dem Markup geschlossen (ein Absatz ohne feste Breite). axe- und Sprachzeilen hat der Aufrufer gemeldet.
