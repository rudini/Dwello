# Review i837c2, Runde 1 (`git diff 96d17cd0 15ce21e2`)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde |

Ponytail-review: «Lean already. Ship.» Den Re-Export `export type { ContractWithDetails }` in `backend/src/services/contract.service.ts:28` nutzen `statement-run.service.ts:9` und `prorating.service.ts:14`. Er ist also weder ungenutzt noch eine Kopie.

Geprüft:
- **Inner Joins:** `rental_contracts.apartment_id`, `tenant_id` und `apartments.building_id` sind NOT NULL mit FK, sowohl in `backend/migrations/0001_schema.sql:35,74-75` als auch in `schema.ts`. Keine Migration setzt `DROP NOT NULL`. Der Mieter-FK hat `restrict`, die Wohnungs- und Gebäude-FKs haben `cascade`. Es geht also keine Zeile verloren. `tenants.first_name` und `last_name` sind NOT NULL, darum ist `tenantName` nie null.
- **Listen-Mapper ohne Rückfallwerte:** Für jede reale Antwort bleibt das Ergebnis gleich. `baseRent` und `monthlyAdvancePayment` sind NOT NULL. `additionalRent` (Default `'0'`) kommt als `'0.00'` oder `null`, und `|| null` lieferte dasselbe. `endDate` ist `null` oder ein Datum, nie `''`. `terminated` ist ein NOT-NULL-Boolean. `buildingName`, `apartmentNumber` und `buildingAddress` sind über die Inner Joins garantiert.
- **`data.advancePayment`:** Das Backend sendet es nicht (`backend/src/routes/contracts.ts:148-158`, `tests/contracts/contract.json`). Das entfernte Feld `tenantFirstName/LastName` liest keine Komponente mehr (grep).
- **Typen:** `satisfies ContractResponse` steht an der Route. `src/lib/types.ts` importiert nur `backend/src/api/*` (ADR 0005). Die neuen Dateien sind Prettier-sauber.
- **Tests:** Die Loader der Liste und der Detailseite sind über `contract-actions.test.ts` und `building-lists-load.test.ts` mit `tests/contracts/contracts.json` und `contract.json` abgedeckt. Die Teständerungen in `tenant-detail.test.ts` und `contract-list.test.ts` betreffen nur Typen bzw. tote Felder.
- **Kein Szenario nötig:** Es ist reines Refactoring ohne sichtbare Änderung. Die PR braucht `No scenario: <reason>`.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, Backend-`bun test` (34 Dateien), `bun run fitness` inkl. der Ratchet-Senkung (`active|ended|future` 4→2, `occupied|relet|reserved|vacant` entfernt, `types.ts` aus den Entity-Spiegeln) und die Commit-Hooks: vom Aufrufer gemeldet.
- Frontend-Vitest: Von den 30 gemeldeten Dateien habe ich 4 selbst neu laufen lassen: `contract-actions`, `building-lists-load`, `tenant-detail` und `contract-list` (92 Tests grün). Die übrigen sind vom Aufrufer gemeldet.
