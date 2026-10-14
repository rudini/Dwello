# Review B-1 (#53), Runde 1 – code-reviewer

Commit-Bereich: `61e47eb..a740ed6` (Commit `a740ed6`), gelesen im Worktree `review-b1-code-reviewer`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | docs/api-specification.md:66 | Der neue Query-Parameter `search` von `GET /api/v1/apartments` fehlt in der API-Spezifikation (die anderen Listen führen `search` auf, z.B. Zeile 50). |
| C-2 | Minor | backend/src/__tests__/apartment-search.pg.test.ts:63-77 | «Die Suche kombiniert sich mit dem Statusfilter» ist durch keinen Test belegt; nur die Kombination mit `buildingId` (Zeile 64) und im Szenario mit dem Gebäudefilter. Der Code (`and(...conditions)`, apartment.service.ts:103) deckt es ab, ein Test mit `search` + `status` fehlt. |
| C-3 | Nit | backend/src/services/apartment.service.ts:88 | `%` und `_` im Suchbegriff wirken als ILIKE-Platzhalter (z.B. findet «2_01» auch «2.01»). Gleich wie in `building.service.ts:40-42`, also konsistent; nur zur Kenntnis. |

Keine Blocker oder Major.

## Geprüft und bestätigt

- Suche nach Wohnungsnummer oder Gebäudename, ohne Gross-/Kleinschreibung: `or(ilike(number), ilike(buildings.name))` (apartment.service.ts:87-89), analog zur Gebäudesuche; pg-Tests «nach Wohnungsnummer» (mit `buildingId`) und «nach Gebäudename» (Name in Grossbuchstaben).
- Total zählt nur Treffer: Count-Query joint jetzt `buildings` (apartment.service.ts:129-133), sonst wäre `buildings.name` in der WHERE-Klausel ungültig; pg-Test «zählt nur die Treffer» mit `limit=1`, total 3.
- Route nimmt `search` an (routes/apartments.ts:32, 68); der BFF-Load sendet `search` bereits (src/routes/apartments/+page.server.ts:9, 17), das Formular setzt ihn (ApartmentFilters.svelte:44). Antwortform unverändert, daher kein Contract-Update nötig.
- Szenarien in apartments.feature:33-42: Suche nach Gebäudename (via `names` auf den UUID-Namen abgebildet, damit isoliert) und Nummer «2.01» innerhalb des eigenen Gebäudes (Gebäudefilter mit Seed-Id); Szenario ohne Treffer mit Hinweis «Keine Wohnungen gefunden» (`apartments_none_found`, in allen vier Sprachen vorhanden). Keine neuen UI-Texte, kein `@wip`.
- Screenplay: Steps rufen nur Tasks/Questions; Task `searchApartments` wartet auf die URL mit dem Suchbegriff (gleiches Muster wie `filteredBy`); Question liefert den Hinweistext (Wert, nicht ja/nein); Targets mit `data-testid` in kebab-case.
- screens.json: `queries`-Override von `apartments` und der B-1-Satz im `$comment` entfernt; der Mechanismus `queries` wird von drei anderen Screens weiter genutzt (Zeilen 212, 315, 339), also nichts Unbenutztes zurückgelassen. Der Zustand `filtered-empty` nutzt jetzt den Standard `?search=keine-treffer-a11y` (tests/e2e/fixtures/screens.ts:16).
- Plan: Session mit `Scenario red`, `Test red` und `Skills: tdd, ponytail, ponytail-review`.
- Keine fachfremden Änderungen, `git diff --check` sauber.

## Nicht bestätigt

- `bun run lint`, `cd backend && bun run type-check`, `bun run deepcheck:audit`: vom Aufrufer gemeldet.
- Backend-pg-Tests (14 bestanden, inkl. `apartment-search.pg.test.ts`) und die Rot-Phase («total 4 statt 3»): vom Aufrufer gemeldet; nicht erneut ausgeführt (braucht PostgreSQL, ausserhalb von vitest).
- E2E «Wohnungsliste», axe/i18n-Zeilen von `apartments`, Hydration-Szenario (14 bestanden) und die Rotmeldungen der Szenarien: vom Aufrufer gemeldet; E2E darf ich nicht starten.
- `bun run test:coverage`, `bun run check`: laut Aufrufer noch in Arbeit, Ergebnis unbekannt.
