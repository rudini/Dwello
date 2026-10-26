# Review i837c4b, Abschlussrunde 1 (Fix ca2c315c..a411b92c, ADR-Text ca2c315c)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-2 | Minor | docs/architecture/adr/0005-api-typen-im-eigenen-modul.md:146, :148 | Der Abschnitt «Zyklus 4b» sagt, dass die Services mit d14464c7 gegen die Typen geprüft werden. Er nennt aber nur den Cast von `getApartment` und dessen `leftJoin`. Bei d14464c7 gab `listApartments` jedoch noch `results as ApartmentWithDetails[]` zurück. Auch dort lief die Liegenschaft auf der Basis 3e58bd21 über `leftJoin` (Zeilen 151 und 161 der Basis). Den Cast entfernt erst a411b92c, und dieser Commit fehlt in der Schritt-Tabelle. Zeile 148 sollte darum beide Funktionen nennen, und die Tabelle braucht eine Zeile für a411b92c. |

Geschlossen: C-1

Keine Blocker, keine Major.

Geprüft:
- a411b92c entfernt nur den Cast. `results` kommt aus derselben Auswahl `apartmentFields` mit `innerJoin`, die auch `getApartment` ohne Cast nutzt. Damit ist `buildingName` nicht mehr nullable, und `building`, `currentTenantName` und die übrigen Detailfelder bleiben in `ApartmentWithDetails` optional. Zur Laufzeit ändert sich nichts. Die anderen Aufrufer (`statement.service.ts:710`, `calculation.service.ts:366`, `routes/apartments.ts:75`) bekommen denselben Typ wie vorher. Ein Test ist nicht nötig, weil sich nur ein Typ ändert und die Typprüfung den Fall abdeckt.
- Diese Angaben im ADR-Text stimmen mit dem Code überein:
  - Die Messwerte vorher (4 / 12 / 36, Entity-Spiegel 46, Wertelisten 10) und nachher (45 und 10) passen zu `tools/fitness/ratchet.json` auf 3e58bd21 und a411b92c.
  - Die Commits 415f1028 und d14464c7 gibt es.
  - `getApartment` hatte auf der Basis den Cast und den `leftJoin`.
  - `BuildingAddress` ist dieselbe Pick wie vorher in `ContractDetails` (`backend/src/api/contract.ts:29`).
  - `AddressHit`, `RegisterApartment` und `RegisterBuilding` stehen in `src/lib/types.ts`, der Abruf bleibt in `building-register.ts`.
  - Keine Svelte-Datei unter `src/routes/buildings` importiert `+page.server`.

## Nicht bestätigt

- `cd backend && bun test src/__tests__/apartment` (24 grün): vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Selbst erneut ausgeführt: `cd backend && bun run type-check` auf a411b92c, ohne Fehler.
- Die Testzahlen in der ADR-Tabelle (120, 1644 und 3694 Tests) habe ich nicht nachgezählt. Den Lauf von `fitness` habe ich nicht wiederholt, weil er Dateien schreibt. Die Messwerte habe ich nur mit `ratchet.json` verglichen.
