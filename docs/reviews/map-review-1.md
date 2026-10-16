# Code-Review #129 (Karte entfernen), Runde 1

Gegenstand: `git diff 50264e3 64c00a1` (97bf68f Szenarien, 64c00a1 Umsetzung), Worktree `review-map-code` auf 64c00a1. Alle 35 geänderten Dateien gelesen. `bun.lock` und die gelöschten Dateien habe ich gegen den Basiscommit gelesen.

Ergebnis: kein Blocker, kein Major.

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Nit | `src/__tests__/tokens.test.ts:90` | Im Testnamen «färben Platzhalter, und Rahmen ohne Farbangabe mit Tokens» steht ein überzähliges Komma. Richtig wäre «färben Platzhalter und Rahmen ohne Farbangabe mit Tokens». |
| C-2 | Nit | `src/__tests__/privacy-i18n.dom.test.ts:14` | `describe` heisst «… auf Französisch und Italienisch», der neue Test (Z. 29–31) prüft aber auch `en`. |
| C-3 | Nit | `tests/e2e/features/building-detail.feature:16` | Fach-Review V-1 ist nicht übernommen: Der Titel sagt «Gebäudeseite», die Schritte sagen «Detailseite von …». Der Befund war optional. |
| C-4 | Nit | `tests/e2e/targets/building-detail.ts:15` | Die Negativprüfung «keine Karte» hängt an `building-mini-map`, einer `data-testid`, die kein Code mehr rendert. Sie schlägt nur noch an, wenn genau diese Komponente zurückkommt. Für das verlangte Szenario ist das in Ordnung, nichts zu tun. |

Ponytail-Review: Lean already. Ship. (net: -0 lines possible). Der Diff löscht nur, und die neuen E2E-Teile (Seed `buildingCoordinates`, Target, Question, zwei Steps) braucht das Szenario, damit es ohne die Änderung rot wird.

## Bestätigt (Anforderung gegen Code und Test)

- **`BuildingMiniMap.svelte`, ihr DOM-Test, `leaflet` und `@types/leaflet` (package.json, bun.lock samt `@types/geojson`) sowie die Regel `.leaflet-container` sind entfernt.** Im Worktree findet `grep -rniE "leaflet|carto|mini-map|buildings_map|privacy_third_2"` ausserhalb von Archiv, Reviews und Personas nur noch die Tests, das E2E-Target und den als entfallen markierten PRD-Abschnitt (`docs/PRD-Dwello.md:1512–1514`). Die übrigen Treffer für «leaflet» meinen das Merkblatt des Mieterverbands und haben mit der Karte nichts zu tun.
- **Die Gebäudeseite zeigt die Adresse als Text.** `BuildingFacts.svelte` hat keinen Kartenblock mehr. `place` wird weiter für `building-address` gebraucht. Abgedeckt durch das Szenario «Die Gebäudeseite zeigt die Adresse als Text ohne Karte». Es ist ohne die Änderung rot: Mit gesetzten Koordinaten hat der Basiscommit das `div` mit `data-testid="building-mini-map"` schon serverseitig gerendert (`BuildingFacts.svelte` alt, Z. 50–56), also wäre `Count` 1 gewesen. Die Adressprüfung steht als positiver Anker vor der Negativprüfung (`tests/e2e/CLAUDE.md`, «Negative checks»).
- **Seed:** Der PUT mit nur `latitude`/`longitude` passt zu `buildingUpdateSchema = t.Partial(buildingBodySchema)` (`backend/src/routes/buildings.ts:45–52`).
- **CARTO-Absatz `privacy_third_2`:** in allen vier `messages/*.json` und in `src/routes/privacy/+page.svelte` gestrichen. Die übrigen Datenschutztexte sind unverändert. Getestet wird das so:
  - `privacy-page.dom.test.ts:157–159` (de, `not.toContain('CARTO')`);
  - `privacy-i18n.dom.test.ts:29–31` (fr, it, en);
  - E2E `privacy.feature:38`.

  Alle drei waren vor der Änderung rot, weil der Absatz «CARTO» enthielt. Das Löschen des Schlüssels hinterlässt eine Lücke in der Nummerierung (1, 3, 4, 5). Das ist bewusst so, ein Umnummerieren wäre unnötige Änderung.
- **`buildings_map` und `buildings_map_of`:** in allen vier Sprachen entfernt. Neue Texte gibt es keine.
- **Deployment und Doku:** `PUBLIC_CARTO_API_KEY` ist aus `.env.example`, `deploy/demo/.env.example` und `docker-compose.prod.yml` entfernt. Die Karte ist aus `docs/tech-stack.md` (Liste, Diagramm, Abschnitt, Env, Tabelle) und `README.md` gestrichen und im PRD als entfallen markiert. U-23 in `docs/design/offene-punkte.md` ist auf die offenen Teile gekürzt, die erledigten Teile stehen in `docs/archive/offene-punkte-verlauf.md`. Damit sind die Fach-Review-Befunde R-2, R-3 und R-4 umgesetzt.
- **Koordinaten:** Die DB-Spalten bleiben (`tests/contracts/building*.json` unverändert, `docs/data-model.md` und `docs/api-specification.md` unverändert, beide richtig). Das Mapping ist aus den drei Gebäude-Loads und aus `Building` in `src/lib/types.ts` entfernt. Im Frontend liest oder setzt nichts mehr `latitude`/`longitude`, das Target-Grep findet nur den E2E-Seed.
- **Konventionen:**
  - Die E2E-Schichten sind eingehalten: Target in `targets/`, Question `Count.of` (liefert eine Zahl) in `questions/`, und die Steps rufen nur Question und Seed auf.
  - Keine neuen Bildschirme oder Zustände, also keine Einträge in `screens.json` und den a11y-Features nötig. Dort erwähnt nichts die Karte.
  - Keine Token- und keine Sicherheitsfragen: Der Diff entfernt nur einen Browseraufruf an einen Dritten.
  - Nichts im Diff hat mit der Anforderung nichts zu tun.
  - Commit-Betreffe ≤ 50 Zeichen, Conventional Commits.

## Nicht bestätigt

- **Gemeldete Prüfungen**, alle vom Aufrufer gemeldet und nicht selbst wiederholt:
  - `bun run lint`
  - `bun run check`
  - `cd backend && bun run type-check`
  - `bunx vitest run` (157 Dateien)
  - E2E `building-detail.feature` und `privacy.feature` (chromium, api)

  Den Versuch, die betroffenen Vitest-Dateien neu laufen zu lassen, hat eine Deny-Regel auf `/home/user/Dwello/node_modules` blockiert. Das Worktree nutzt die `node_modules` des Hauptrepos.
- **«Vor der Änderung rot gesehen»** (Szenarien, Privacy-DOM-Tests): Das habe ich nur durch Lesen beurteilt (siehe oben), nicht ausgeführt.
- **R-1 aus `docs/reviews/map-fachreview-1.md`** (Kommentar in #82, dass CARTO kein Dritter mehr ist): Das steht im Plan noch offen (`implementation_plan.md:11`). Es ist keine Code-Änderung, und ob es erledigt ist, habe ich in GitHub nicht geprüft.
- **Laufende App ohne Netzwerkaufrufe an `cartocdn`:** nur statisch geprüft. Ein Grep nach `carto` in `src/`, `svelte.config.js`, `vite.config.ts`, `deploy/` und `docker-compose*.yml` findet nichts, eine CSP gibt es nicht. Einen Build oder einen Netzwerkmitschnitt habe ich nicht gemacht.
