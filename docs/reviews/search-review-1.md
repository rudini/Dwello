# Slice-Review: wortweise Suche (#373, #160) – 92b5427..a59f10a

Worktree: `review-search-cr` (detached a59f10a). Alle 22 geänderten Dateien gelesen, dazu `Field.svelte`, `EmptyState.svelte`, `listApartments` vollständig, `tests/e2e/fixtures/backend.ts` (`unique`, `removeBuildings`), Issue #373 (Text per `gh api`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/apartment.service.ts:114-118 | Nur das deutsche «Wohnung» wird übergangen; die Karte heisst in fr/it/en «Appartement/Appartamento/Apartment {number}» (`messages/*.json:333`), «Appartement 3.02» findet dort nichts. Der Kommentar «as the card names it» gilt nur für de. #373 hat «Wohnung» entschieden, eine Erweiterung wäre eine Produktentscheidung (Issue oder Notiz im PR). |
| C-2 | Minor | backend/src/services/word-search.ts:4-6 | Keine Längengrenze für `search` (Routen `t.String()` ohne `maxLength`); neu erzeugt jedes Wort 3–4 `ILIKE`-Klauseln. Begrenzung fehlte schon vorher, wird durch den Diff aber verstärkt. Nur angemeldet, Einzelnutzer: kein Merge-Blocker, Zeile in `offene-punkte.md` erwägen. |
| C-3 | Nit | backend/src/services/apartment.service.ts:115-119 | ponytail `shrink:` Wörter werden geteilt, gefiltert, wieder verbunden und in `everyWordIn` erneut geteilt. Kürzer: `everyWordIn(search.replace(/(?<!\S)wohnung(?!\S)/gi, ''), [...])`, oder `everyWordIn` die Wortliste filtern lassen. net: -3 Zeilen möglich. |
| C-4 | Nit | tests/e2e/fixtures/backend.ts:111-114 | `withNames` ersetzt per `String.replace` Teilstrings, nur das erste Vorkommen: ein Gherkin-Name, der in einem anderen Wort steckt («Seepark» in «Seeparkweg»), würde mitten im Wort ersetzt. Bei den heutigen Namen harmlos. |
| C-5 | Nit | src/routes/buildings/+page.svelte:56 | Die Gebäudesuche sucht jetzt auch wortweise, erklärt sich aber weiter nur im Platzhalter («Name oder Adresse»), was #373 für die Wohnungssuche als Problem nennt. Nicht von #373 verlangt; nur Hinweis. |

Keine Blocker, keine Majors.

## Geprüft und bestätigt

- **Wortweise Wohnungssuche** (`word-search.ts`, `apartment.service.ts`): jedes Wort per `and(or(ilike…))` in Nummer, Gebäudename, `address`, `city`; «Wohnung» (Gross-/Kleinschreibung egal) wird übergangen; nur «Wohnung» ergibt `and()` = `undefined`, das `and(...conditions)` herausfiltert, also werden alle Wohnungen gelistet. Die Zählabfrage nutzt dieselbe `whereClause` mit Join. pg-Tests: Name+Nummer, Strasse+Nummer, Ort+Nummernteil, «Wohnung» im Begriff, nur «Wohnung» (total 3); Datensätze, die nicht passen dürfen: 2.02, 3.01 und die 2.01 im anderen Gebäude. Jeder neue Test schlägt mit dem alten Ganzbegriff-`ILIKE` fehl (nach Lesen beurteilt).
- **Gebäudesuche**: dieselbe Regel auf Name, Strasse, Ort; pg-Test mit Treffer, anderem Gebäude und leerem Ergebnis («Lindenhof … Uster»), ohne die Änderung rot. Die E2E-Bereinigung `buildings?search=${token}` funktioniert weiter (ein Wort).
- **Hilfetext**: `help` + `helpTestid` über `TextInput` → `Field` (`aria-describedby` zeigt auf den Hilfetext), Platzhalter entfernt; `apartments_search_placeholder` wird nirgends mehr verwendet. Deutscher Text stimmt Wort für Wort mit #373 überein.
- **Leerzustand**: mit Begriff (`trim`) `apartments_none_found_search_text({ search })`, nur mit Gebäude- oder Statusfilter der alte Text; Ausgabe als Textknoten in `EmptyState` (kein `{@html}`), also keine Einschleusung von HTML. Deutscher Text wie in #373.
- **i18n**: beide Schlüssel in allen vier Dateien; Begriffe nach `i18n-begriffe.md` (localité/località/town, rue/via/street).
- **DOM-Tests**: Hilfe über `aria-describedby`, kein Platzhalter; Leerzustand nennt den Begriff. Beide ohne die Änderung rot.
- **E2E**: neue Szenarien in `apartments.feature` (wortweise inkl. Strasse und «Wohnung», Leerzustand mit Begriff, Hilfetext) und `buildings.feature` (wortweise), ohne `@wip`. Die eindeutige Strasse hat eine eigene UUID: «Wohnung Seestrasse 5 H2» belegt also wirklich die Suche nach Strasse. Die Steps rufen nur Tasks und Questions auf; die Questions geben Text und Anzahl zurück; die Features beschreiben das Was, nicht das Wie. Die bestehenden Szenarien sind unverändert.
- **a11y/Sprachen**: kein neuer Bildschirm; der Zustand `filtered-empty` existiert schon; der Suchbegriff der Fixture ist nicht mehr deutsch, da die Wohnungsliste ihn wiederholt (`screens.ts:16`), gehört also zur Anforderung.
- Tokens und Komponenten: keine neuen Klassen, nur `src/lib/ui`. Prettier ist auf den neuen und geänderten Backend-Dateien sauber. Keine fremden Änderungen im Diff; `implementation_plan.md` ist eine Session-Notiz.
- API-Verträge: Die Antwortform bleibt gleich, also war kein Vertrags-Update nötig.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` (2810), `cd backend && bun run type-check`, `cd backend && bun run test` (821, Coverage-Untergrenze), E2E apartments/buildings (chromium + api, repeat-each=3) und axe-/Sprachzeilen: vom Aufrufer gemeldet, nicht selbst ausgeführt (Backend-Tests und E2E auf Anweisung nicht gestartet).
- Ob `xq-a11y-0` auf allen Listen mit `filtered-empty` (Rechnungen, Mietverträge, Mieter, Gebäude) wirklich leer bleibt: nur über die gemeldeten axe-Zeilen, nicht im Code der anderen Suchen geprüft.
- Wie fr/it/en mit Hilfetext unter nur einer der drei Spalten (`md:grid-cols-3`) aussehen: nicht im Browser angesehen, das ist Sache des Persona-Reviews.
