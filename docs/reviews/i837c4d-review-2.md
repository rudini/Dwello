# Review i837c4d, Runde 2 (d60e160a..699430cb, zugleich Abschlussrunde vor dem Push)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: C-1, C-2, C-3, C-4

## Nicht bestätigt

- Diese Prüfungen des Aufrufers auf 699430cb habe ich nicht selbst laufen lassen. Sie gelten als **vom Aufrufer gemeldet**:
  - `cd backend && bun run type-check`;
  - Backend-`bun test` auf api-contracts und allen tenant*.pg/tenant-fields-Tests (146);
  - `bun run check` (0 Fehler, 4299 Dateien);
  - `bun run lint`;
  - die ganze Frontend-Suite (3696);
  - `bun tools/fitness/fitness.ts --base origin/main` (Spiegel 43, Grenzimporte 0).
- Selbst gelaufen und grün (`bunx vitest run`, 10 Dateien, 176 Tests):
  - `tenants-i18n`, `tenant-list`, `tenant-detail`;
  - `building-lists-load`, `buildings-i18n`, `building-actions`, `category-lists`;
  - `apartment`, `apartments-pages.dom`;
  - `tools/fitness/fitness.test.ts`.

Geprüft:

- **Diff:** Alle 11 geänderten Dateien sind gelesen.
- **C-1, `TenantWithCounts`:** Der Typ ist `Tenant` plus `contractCount`, `isFuture`, `rentalContractId?`, `currentApartment?` und `currentBuilding?`. Das sind genau die Felder, die `getTenant` auswählt und zurückgibt (`tenantFields`, also alle 14 Spalten von `tenants` plus Zähler, `isFuture` und drei Ergänzungen, backend/src/services/tenant.service.ts:168-214). `isActive` steht nur in der Listenzeile, wie `listTenants` es auswählt (:104-105).
- **C-1, `null` bei Wohnung und Liegenschaft:** Es kommt aus dem `leftJoin` (:131-132, :197-198) und ist richtig typisiert.
- **C-1, `rentalContractId?` in der Listenzeile:** `listTenants` setzt das Feld nie. Es stand aber schon im alten `TenantWithOccupancy`; das ist also kein neuer Befund.
- **C-1, Frontend-Typen:** `Tenant` und `TenantListItem` in src/lib/types.ts haben dieselben Felder wie vorher.
- **C-1, Importe:** Kein Import aus `backend/src/services` bleibt in `src`. `backend/src/api/tenant.ts` importiert nur `schema.ts`, die Route prüft ihre Rückgabe weiter mit `satisfies TenantResponse` (routes/tenants.ts:78), und `statement-send` und `reminder` nutzen das typisierte `getTenant` ohne Änderung.
- **C-2:** Der Kommentar steht jetzt über `Required<Pick<…>>` (types.ts:356).
- **C-3:** Das Repo enthält keinen Verweis auf `ApartmentWithBuilding` mehr, ausser im Plan, in Archiv- und Review-Dateien und in einer erzeugten Baseline-CSV.
- **C-4, Mapper:** `toApartmentRow` macht für die Liegenschaftsseite dasselbe wie der alte Inline-Mapper, mit denselben Ersatzwerten. Neu ist nur `buildingName` pro Zeile. Weder `+page.svelte` noch `ApartmentsByFloor.svelte` liest es, also wird es nicht angezeigt.
- **C-4, ADR:** «Nächste Zyklen» stimmt mit dem Code überein.
- **`ratchet.json`:** Die beiden Seiten-Server stehen nicht mehr in der Ausnahme, passend zu den Spiegeln 45 → 43.
- **Sonst:**
  - Keine Verhaltensänderung, kein Szenario nötig, kein neuer Test.
  - Keine Texte, keine UI, keine API-Antwort und kein Vertrag betroffen.
  - Nichts im Diff gehört nicht zur Anforderung.
  - Ponytail-review: kein ungenutzter Code und keine Kopie; der Diff entfernt eine.
