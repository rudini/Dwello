# Code-Review #662, Runde 2 (6202bf9)

Bereich: `git diff d7474ba 6202bf9` ohne Reports, Personas, Plan und Archiv (Commits 609aaec, 4dd4526, 6202bf9). Vorheriger Report: `docs/reviews/662-review-1.md`.

Geschlossen: C-1, C-2, C-3

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Major | tests/a11y/screens.json:551-567 (src/routes/invoices/+page.svelte:96-109) | Der Zustand «Jahr ohne Rechnungen» hat jetzt ein eigenes Bedienelement («Filter zurücksetzen» unter dem Hinweis, S-4). Mit #662 erreicht man ihn ausserdem mit einer einzigen Wahl. Trotzdem fehlt er in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. |
| C-5 | Minor | src/routes/+layout.svelte:66-74, 105-106 | `listResult` wird nur bei einer Wahl gesetzt, die den Fokus behält, und danach nie wieder geleert: nicht nach «Suchen», nicht nach dem Zurücksetzen und nicht beim Wechsel auf eine andere Seite. Die Statusregion ist das erste Element im `body`, ausserhalb jeder Landmark. Im Lesemodus hört man darum auf jeder folgenden Seite zuerst ein veraltetes Ergebnis wie «2 Wohnungen». |
| C-6 | Minor | src/routes/+layout.svelte:72-74 | Das vorherige Leeren (`listResult = ''`) soll bewirken, dass dieselbe Anzahl nach einer weiteren Wahl erneut angesagt wird. Kein Test zeigt das: Nimmt man die Zeile heraus, bleiben `layout-hydrated.dom.test.ts` und die Szenarien grün, denn jedes prüft nur eine Wahl. |

## C-4 (Major)

**Warum falsch:** Laut CLAUDE.md (Design-Regeln, Process) kommt jeder Zustand mit eigenen Bedienelementen in alle drei Listen. Der Zustand fehlte dort schon vor dieser Änderung. Die Änderung macht ihn aber sichtbarer: Die Jahreswahl gilt jetzt sofort, und S-4 fügt ihm einen zweiten Knopf hinzu. Deshalb zählt die Ausnahme «existed before» nicht. Für den neuen Knopf (Ghost-`Button` mit Icon neben der `EmptyState`-Aktion) läuft weder axe (hell/dunkel, drei Breiten) noch die Sprachprüfung fr/it/en.

**Die Begründung im Commit trägt hier nicht.** Dort heisst es: «a year without invoices in the whole E2E database, which parallel scenarios cannot guarantee». Das gilt für die gemeinsame Datenbank der Szenarien. Die a11y-Prüfung hat aber eine leere Instanz (`playwright.config.ts:13-19`, `stateMeanings.empty`), und `queries` erlaubt pro Zustand eine eigene Adresse. Ein Zustand wie `empty-year` mit `?year=<laufendes Jahr>` auf der leeren Instanz zeigt genau diesen Hinweis mit dem Knopf, und zwar deterministisch.

**So zeigt man es:** `grep -n '"invoices"' -A16 tests/a11y/screens.json` listet keinen Jahreszustand. Der Zustand `empty` lädt `/invoices` ohne `year`, landet also im Zweig `{:else}` und nicht in `{#if onlyYear}`.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: E2E 128 über acht Listen-Features, vitest 505, lint, check, fitness, fallow, Prettier.
- `No scenario` für S-4: Für die gemeinsame E2E-Datenbank ist die Begründung stichhaltig. `filterYears` bietet das laufende Jahr und die fünf davor an (`src/routes/invoices/+page.server.ts:34-37`), und parallele Szenarien legen Rechnungen mit aktuellen Daten an. Ob ein Szenario die leere Instanz nutzen könnte, wie es `einrichtung.feature` mit den Zusatzinstanzen tut, habe ich nicht geprüft. Der Grund muss noch in den Text des Pull Requests.
- Ob Playwrights `selectOption` den Select selbst fokussiert, ist offen. Davon hängt ab, ob «bleibt der Fokus im Filter» ohne den H-2-Fix rot würde. H-2 belegt der DOM-Test «gibt dem Filter den Fokus, auch wenn er ihn bei der Wahl nicht hatte», und der ist ohne `event.target.focus` rot.
- Bildschirmleser selbst (ob das Leeren und Neusetzen nach `tick()` in NVDA/VoiceOver zu einer zweiten Ansage führt): nur gelesen.

Geprüft: Zwischen Merge-Base a46bf5c und 6202bf9 entfällt in einem Szenario ohne `@wip` auf `main` nur die freigegebene Zeile in `apartments.feature`. Die übrigen geänderten Szenarien sind neu auf diesem Branch, und der entfernte Schritt «steht über der Liste» stammt aus d7474ba. Die umgestellten Tasks `searchApartments` und `searchTenant` prüfen dasselbe wie vorher: erst warten, bis die Adresse die Wahl trägt, am Ende `search` in der Adresse. Bei `''` stimmt die Adresse sofort, und der Rückabgleich hängt an `$page.url.search` bzw. an einem unveränderten `value`, also wird der getippte Text nicht überschrieben. Die vier neuen Szenarien wären mit d7474ba rot, weil der getippte Text mitginge. `applyFilterChoice` (nur sichtbare `input[name]`, versteckte Statement-Felder bleiben, `replaceState`, `preventScroll`), DOM-Tests für H-1, H-2, S-2 und S-4 sind ohne die Änderung rot. S-1 Layout-Test ist ohne die Region rot. Keine neuen Texte (`buildings_reset_filters` wiederverwendet), nur Token-Klassen, Screenplay-Schichten, Verschiebung nach `src/lib/utils` ohne Reste, ponytail-review ohne Befund.
