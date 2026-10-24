# Abschlussrunde H-28 (#717) Schritt 4: `3e9c228f4..HEAD` (12c0ab5e7)

Status der offenen IDs aus `docs/reviews/h28l-review-1.md`:

| ID | Status | Beleg |
|----|--------|-------|
| C-1 | behoben | `backend/src/services/statement-invoices.service.ts:123-127`: Der JSDoc steht wieder direkt über `outdatedStatements`, und `draftOutdated` und `draftsToSend` behalten ihre eigenen Kommentare. |
| C-2 | behoben | `src/__tests__/buildings-i18n.test.ts:137`: `draftIds` ist entfernt. In `src`, `tests` und `backend/src` gibt es keinen Treffer mehr. |
| C-3 | behoben | `tests/contracts/dashboard.json:14-16`: Der Vertrag hat jetzt eine `buildingOccupancy`-Zeile mit den Feldern, die `buildingOccupancy()` liefert (`backend/src/routes/dashboard.ts:49-55`). `drift()` vergleicht nicht leere Arrays am ersten Eintrag. Leer geliefert gilt als Abweichung (`api-contracts.pg.test.ts:40-42`). `dashboard.test.ts:25-34` baut seine Zeilen auf dieser Vertragszeile auf. `recentActivity` bleibt leer. Das ist richtig so, denn der BFF deklariert das Feld nur (`+page.server.ts:26`) und liest es nicht. |

Neue Befunde im Delta: keine.

Geprüft: Das Delta enthält nur die drei Korrekturen und keine fremden Änderungen. Das Verhalten der App bleibt unverändert, deshalb ist kein neuer Test und kein Szenario nötig.

## Nicht bestätigt

- Alle Prüfungen stammen vom Aufrufer, ich habe keine selbst ausgeführt. Er meldet `dashboard.test.ts`, `buildings-i18n.test.ts` und `overview.test.ts` (67 grün), `api-contracts.pg.test.ts` und `dashboard.pg.test.ts` (85 grün), `bun run check` und den Backend-Type-Check. Backend und E2E habe ich auf Wunsch nicht ausgeführt.
- Ob die Rental im Vertragstest ein Gebäude anlegt, sodass `buildingOccupancy` nicht leer geliefert wird, habe ich nur aus dem gemeldeten grünen Lauf von `api-contracts.pg.test.ts` geschlossen. Einen leeren Wert würde `drift()` als Fehler melden.
