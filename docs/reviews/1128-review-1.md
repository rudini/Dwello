# Review #1128, Runde 1 (origin/main..0812a6eff)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/focus-after-action.ts:66-68 | Der Namens-Fallback sucht in allen `li a[href]` des Dokuments, auch im Hauptmenü (`NavList.svelte`, `<li><a>`) und in der Brotkrumenleiste (`PageHeader.svelte`), die beide im DOM vor `<main>` stehen. Erfasst der Verwalter einen Verteilschlüssel «Wohnungen» oder eine Kategorie «Dokumente» oder «Hilfe», bekommt der Menülink den Fokus statt der neuen Zeile, und die Meldung weicht der falschen Stelle aus. Wenn die Suche auf `main` beschränkt wird, ist das behoben. |
| C-2 | Minor | src/routes/config/SaveForm.svelte:60 | Der Fallback vergleicht mit dem deutschen Feld `name`. Die Zeile zeigt aber `localName()` (`nameFR`/`nameIT`/`nameEN`, wenn es das gibt). Erfasst der Verwalter in fr/it/en eine Kategorie oder einen Verteilschlüssel und gibt den Namen in seiner Sprache ein (`NameTranslations`), findet die Suche keine Zeile, und der Fokus bleibt wie vor dem Fix auf dem Seitentitel. Weder ein Test noch ein Szenario deckt das ab. |

Keine Blocker oder Majors.

Geprüft: Der Pfad hat Vorrang vor dem Namen. Das zeigt der umbenannte Test mit `'Abwasser'` und `/b`, dort gewinnt `/b`. Der neue DOM-Test ist ohne Fallback rot, denn `/neu` trifft keinen Link, der Fokus bleibt auf `body`, und `getAttribute('href')` gibt `null` zurück. Das neue Szenario ist ohne Fix rot, denn `/config/categories/new` hat in der Liste keinen Link, also greift `focusedText` den Titel. Es nutzt nur bestehende Schritte (Tasks und Questions), steht ohne `@wip` und verwendet keine UI-Wörter. Kein bestehendes Szenario ist verändert. Die Namen sind eindeutig (`CATEGORY_NAME_TAKEN`, `DISTRIBUTION_KEY_NAME_TAKEN`). Heizprofile leiten auf ihre Detailseite weiter, dort gibt es keine Zeile mit ihrem Namen. Für sie ändert sich also nichts. Es gibt keine neuen Texte, Bildschirme, API-Antworten oder Token-Klassen. Der alte Name `focusRowLinkingTo` kommt im Code nicht mehr vor, nur noch in archivierten Berichten. Der Diff enthält nichts Fremdes.

## Nicht bestätigt

- bun run lint, bun run check, bun run fitness, bunx vitest run --changed origin/main (194 bestanden), E2E chromium categories.feature + distribution-keys.feature + heating-profiles.feature (57 bestanden): vom Aufrufer gemeldet.
- Rot-Lauf des Szenarios und des DOM-Tests: vom Aufrufer gemeldet. Durch Lesen beurteilt, siehe «Geprüft».
- Verteilschlüssel: Die Anforderung nennt sie, aber nur der generische DOM-Test deckt sie ab, ein Szenario gibt es nicht («Done means» verlangt nur die Kategorie). Gelesen habe ich `DistributionKeyRow.svelte`: Der Link-Text ist `localName(key)` in einem `span`, und `trim()` passt dazu. Ein Lauf bestätigt das nicht.
