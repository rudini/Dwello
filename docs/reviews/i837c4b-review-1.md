# Review i837c4b, Runde 1 (origin/main 3e58bd21 .. d14464c7)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/apartment.service.ts:146 | `listApartments` gibt `results as ApartmentWithDetails[]` weiter zurück. Damit entfällt für `GET /apartments` die Compilerprüfung, die ADR 0005 Schritt 1 mit dem Rückgabetyp verlangt: Ein `as` lässt auch Zeilen durch, denen ein Pflichtfeld fehlt, und `buildingName`, `blocked` und `availableFrom` sind jetzt Pflicht. Der Cast wird nicht mehr gebraucht. `getApartment` wählt dieselben `apartmentFields` mit demselben `innerJoin` und gibt sie ohne Cast zurück; die Backend-Typprüfung ist grün. |

Keine Blocker, keine Major.

Geprüft: Für #857 sind alle Bau-Kanten der Gebäude erledigt (`[id]/+page.svelte`, `FuelStockList.svelte`, `FuelStocks.svelte`, `edit/+page.svelte` mit `PageData`; `AddressSearch.svelte`, `BuildingForm.svelte`, `RegisterApartments.svelte` aus `$lib/types`). Keine Svelte-Komponente unter `src/routes/buildings` importiert noch `+page.server` oder `$lib/server`. Der Mapper bleibt in `building-register.ts`. `BuildingDetailsData` wird nur noch in `building-actions.test.ts` und `buildings-i18n.test.ts` gebraucht. Weitere geprüfte Punkte:
- `innerJoin` verhält sich gleich, denn `apartments.building_id` ist NOT NULL mit ON DELETE CASCADE (`schema.ts:60-62`); das gilt auch für die Zählabfrage.
- `toBuilding` und `fetchApartment` laufen zur Laufzeit gleich wie vorher (nur Casts entfernt; `a.building!` ist durch `getApartment` gedeckt).
- `BuildingAddress` ist dieselbe Pick wie vorher in `ContractDetails`.
- `Building`, `BuildingWithStats` und `Apartment` in `src/lib/types.ts` haben dieselben Feldtypen wie vorher. Von Hand deklariert sind nur Felder, die der BFF zusammensetzt oder füllt (`reletStarts`, `reservedCount`, `area`/`rooms` mit `'0'` als Ersatz).
- Der Eintrag in `ratchet.json` passt zur Verschiebung.
- Die neue Datei `backend/src/api/building.ts` ist Prettier-sauber.
- Szenario: «No scenario» ist für reine Typänderungen begründet. Texte, a11y und `messages` sind nicht betroffen.
- ponytail-review findet ausser C-1 nichts zu streichen.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bun run test:coverage`, `cd backend && bun run test`, `bun tools/fitness/fitness.ts --base origin/main` sowie `bunx vitest run --changed origin/main` auf 415f1028: alle vom Aufrufer gemeldet. Selbst erneut ausgeführt habe ich nur `bunx vitest run` für `apartment.test.ts`, `building-actions.test.ts`, `buildings-i18n.test.ts` und `building-register.test.ts` (102 grün).
- Dass der Cast in C-1 ohne Folgefehler wegfallen kann, ist nur gelesen, nicht kompiliert: `getApartment` nutzt dieselben Felder ohne Cast.
- Der ADR-Abschnitt «Zyklus 4b» mit der Messung fehlt in diesem Slice. Er steht in `implementation_plan.md:19` noch offen und ist darum nicht als Befund gewertet.
