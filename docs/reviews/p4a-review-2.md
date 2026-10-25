# Review p4a, Runde 2 (Delta dc80c37b..528d25b0)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `backend/src/__tests__/dashboard-tasks.pg.test.ts:59-69` | **Geschlossen.** Der neue Test deckt beide Fälle ab. |

Zum Status von C-1:
- (a) Mit `&& c.endDate >= swissToday()` in `contract-tasks.service.ts:16` fällt `ended` (Ende `2025-03-31`) aus der Liste. Damit schlägt Z. 67 fehl.
- (b) Ohne `eq(rentalContracts.apartmentId, apartmentId)` in `later-contract.ts:10` beginnt `other` (`2099-04-01`) nach beiden Enden. Dann fallen `ended` und `elsewhere` weg, und Z. 67 und 68 schlagen fehl.

Die Commit-Nachricht nennt den Test als Fixierung von bestehendem Verhalten. Das stimmt: Der Produktionscode ist im Delta unverändert, nur die Testdatei hat sich geändert. Einen roten Lauf braucht es deshalb nicht.

Geprüft:
- **Isolation:** `contractWith` und `createRental` legen je ein eigenes Gebäude, eine eigene Wohnung und einen eigenen Mieter mit zufälligem Token an. `other` steht in `rentals`, und `afterAll` räumt es mit `remove()` auf (Vertrag, Mieter, Wohnung, Gebäude).
- **Wirkung auf die Folgetests:** `other` bleibt bis `afterAll` bestehen. Die Folgetests stört das nicht:
  - `other` ist nicht gekündigt und hat kein Ende, steht also weder in `noticedContracts` noch in `expiredContracts`.
  - `fixedTermCheck` sucht über `laterContract` nur in derselben Wohnung.
  - `formerTenantDocuments` arbeitet pro Mieter.
- Das Delta enthält nichts, was nicht zu C-1 gehört.

Neue Befunde: keine.

## Nicht bestätigt

- `dashboard-tasks.pg.test.ts` mit 5 bestandenen Tests und die beiden Mutationsläufe (a) und (b): vom Aufrufer gemeldet, nicht wiederholt. Der Test schreibt in die Datenbank, ein erneuter Lauf ist mir nicht erlaubt. Ich habe die Wirkung beider Mutationen durch Lesen des Tests, von `contract-tasks.service.ts` und `later-contract.ts` nachvollzogen.
- Commit-Hooks grün: vom Aufrufer gemeldet.
