# Slice-Review Hilfetexte (#109, #67, #69), Runde 1

Worktree `review-help-code`, Commit c035d78, Bereich `git diff bd4b58d c035d78` (4234f26 Szenarien und rote Tests, c035d78 Umsetzung). Alle 19 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `implementation_plan.md:9-10`, `tests/e2e/features/help.feature:26-42` | Die sichtbaren Textkorrekturen aus #67 (`glossary_period_text`, `config_help_distribution_key`) und #69 (u. a. `settings_iban_help` mit Rückerstattung, Glossartexte zu Mahnung, Zahlungsfrist, Umlagefähig) haben kein Szenario. Plan und Commit nennen auch kein `No scenario: <Grund>`. |
| C-2 | Minor | `src/routes/config/categories/CategoryForm.svelte:172-174` | Der neue Hilfetext `categories_translations_help` steht als `<p>` im Fieldset, ist aber nicht über `aria-describedby` verknüpft. Ein Screenreader liest ihn beim Tabben in die Felder nicht vor. Vorbild: `HeatingProfileForm.svelte:69` (`<fieldset aria-describedby="shares-help">`). |
| C-3 | Nit | `messages/{fr,it,en}.json` `categories_sort_order_help` | «à nombre égal, le nom décide» / «decide il nome» / «the name decides»: Bei gleicher Zahl sortiert `category.service.ts:65` nach der Spalte `name`, also nach dem deutschen Namen. Angezeigt wird in fr/it/en aber der übersetzte Name (`src/lib/names.ts:16`). Für Nutzer in fr/it/en wirkt die Reihenfolge darum unsortiert. |
| C-4 | Nit | `src/__tests__/help-page.dom.test.ts:85-94` | Der Test prüft, dass die Links zu den Abschnitten passen, aber nicht, dass der Inhalt vor dem ersten Abschnitt steht («beginnt mit einem Inhalt»). Das Szenario prüft es auch nicht. |
| C-5 | Nit | `implementation_plan.md:4-5` | Eine zusätzliche Leerzeile vor `## Session`. |

Ponytail-Review: keine Kürzung. `Panel` erhält `id` und `scroll-mt-24` für alle Panels. Das ist die kürzeste Form, ein Anker auf `Panel` braucht genau das. Die Testids `glossary-entry`/`-term`/`-explanation` werden vom E2E-Target gebraucht, `pageAnchor` folgt dem Muster von `pagePath` (`questions/navigation.ts:6`). Lean already. Ship. `net: -0 lines possible.`

## C-1 (Major): Textkorrekturen aus #67 und #69 ohne Szenario

**Warum falsch.** Laut `CLAUDE.md`, Workflow 1, beginnt jede Verhaltensänderung mit einem Szenario, auch ein Fehler, den der Nutzer sieht. #67 ist so ein Fehler: Die Hilfe widerspricht dem Glossar («Das Rechnungsdatum bestimmt …», «Jede Rechnung hat einen Verteilschlüssel»). Ohne Szenario darf eine Änderung nur bleiben, wenn der E2E-Stack den Zustand nicht erreicht (`tests/e2e/CLAUDE.md`, «No scenario»). Diese Texte erreicht er aber: Es gibt schon den Step `erklärt die Hilfe den Begriff {string} mit {string}` (`app-frame.steps.ts:153`) und `erklärt die Hilfe unter {string} {string}`. Hilfetexte wurden im Repo bisher auch per Szenario abgesichert (`help.feature:23-24`, «Mehrere Rechnungen auf einmal»). Dazu kommt: Die Rückerstattung in der IBAN-Hilfe hat der Product Owner in #69 ausdrücklich entschieden.

Die DOM-Tests (`help-page.dom.test.ts:56-83`, `distribution-keys-pages.dom.test.ts:48-55`, `config-pages.test.ts:102-109`) belegen das Verhalten auf der untersten Schicht. Sie ersetzen das Szenario aber nicht. Das Done means von #67 nennt die Unit-Tests zusätzlich, nicht stattdessen («Plus the general finish in CLAUDE.md, Workflow»).

**So zeigt man den Fehler.** `glossary_period_text` und `settings_iban_help` in `messages/de.json` auf den Stand von bd4b58d zurücksetzen und `help.feature`, `settings*.feature` und `distribution-keys*.feature` laufen lassen: Sie bleiben grün.

**Abhilfe (kurz).** Eine Zeile «Abrechnungsperiode | Ohne Leistungszeitraum bestimmt das Rechnungsdatum» im Szenariogrundriss `help.feature:27-36`. Dazu ein Szenario für die IBAN-Hilfe mit Rückerstattung in der passenden Einstellungs-Feature und eines für den Verteilschlüssel-Text auf der Seite «Verteilschlüssel». Die Alternative ist ein begründetes `No scenario: …` im Plan und im Pull Request. Ob das hier zulässig ist, entscheidet der Aufrufer, die Regel in `tests/e2e/CLAUDE.md` deckt diesen Fall nicht.

## Bestätigt (Anforderung → Code und Test)

- #109, vier neue Glossarbegriffe in vier Sprachen: `Glossary.svelte:62-78`, `messages/*.json:113-121`; `help-page.dom.test.ts:40-44`, `help.feature:27-36`. Die Begriffe stimmen mit `i18n-begriffe.md:28,29,49` und den Vertrags- und Rechnungs-Labels überein (`contracts_limited`/`unlimited`, `invoices_status_manual`, `invoices_override_reason`). Die Abweichung von `UBIQUITOUS_LANGUAGE.md:38` («mit Wissen») ist bewusst und an #317 (`entscheiden`) übergeben. `UBIQUITOUS_LANGUAGE.md` ist unverändert.
- #109, Inhalt mit Links und Anker `#glossary`, bei 390 px: `+page.svelte:55-67`, `Panel.svelte:9-18` (`scroll-mt-24` gegen den Sticky-Header `top-16`); Test `help-page.dom.test.ts:85-94` und Szenario `help.feature:38-42` (Anker `#glossary`, Anteil im Fenster > 0, kein seitliches Scrollen). Links mit `min-h-12` und Token-Klassen wie in `PageHeader.svelte:28`; kein neuer Navigationseintrag.
- #67: `glossary_period_text` ist in allen vier Sprachen wortgleich mit PR #289 (per `gh api` verglichen). `config_help_distribution_key` entspricht `UBIQUITOUS_LANGUAGE.md:123`, und das Backend verteilt ohne Schlüssel gleichmässig (`calculation.service.ts:177-196`). Die Tests schlagen auf dem alten Text fehl.
- #69: Die Befunde M-1 bis V-13 aus `docs/reviews/help-fachreview-1.md` sind in allen vier Sprachen wörtlich übernommen (M-3, M-4, V-9, V-13 in den neuen Texten; V-6 in `it`). Die Belege habe ich stichprobenweise am Code geprüft: Rückerstattung und IBAN `pdf.service.ts:91`, Sortierung `category.service.ts:65`, Rückfall auf Deutsch `names.ts:16`. Die IBAN-Hilfe nennt die Rückerstattung (`config-pages.test.ts:103`).
- Rote Tests (beim Lesen geprüft): Jeder neue DOM-Test erwartet Text oder Testids, die es auf bd4b58d nicht gibt. Die Szenarien scheitern ohne die Änderung (kein `glossary-entry`, kein `help-contents`).
- Screenplay: Steps rufen nur Tasks und Questions auf. Die Questions liefern Werte (Text, Anker, Anteil). Die Feature-Sprache ist fachlich («wählt», nicht «klickt»). Kein neuer Bildschirm, darum keine neuen Einträge in `screens.json` nötig.
- Nichts Fachfremdes im Diff.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (alle 157 Dateien), E2E chromium für help.feature, die Settings-, Categories- und Distribution-Keys-Features sowie die Axe- und Sprachzeilen von help, help-public, config, category-new, category-edit, category-edit-predefined und distribution-keys. Selbst nachgefahren habe ich nur `bunx vitest run` für `help-page.dom`, `distribution-keys-pages.dom`, `categories-page.dom` und `config-pages`: 4 Dateien, 82 Tests grün.
- Mergekonflikte mit PR #289 habe ich nicht probiert, ein Fetch hätte ins Repo geschrieben. Laut `gh api .../pulls/289/files` ändert #289 ebenfalls `help.feature` (Anhang am Dateiende), `help-page.dom.test.ts` und `+page.svelte`, dort die Schritte von `invoices`, eine Zeile neben dem neuen `id: 'invoices'`. Textkonflikte sind also wahrscheinlich, bei den Message-Texten nicht.
- Die Rechtsaussagen (Art. 257d, 266, 266a OR, Art. 4 VMWG) beruhen auf dem Fachreview. Ich habe nur geprüft, ob die Texte zum Review und zum Code passen.
- Ob der Fokus nach einem Ankersprung per Tastatur sinnvoll weitergeht, habe ich nicht im Browser gesehen.
