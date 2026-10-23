# Code-Review H-28 (#717) Schritt 3, Schlussrunde (Fixes C-1..C-4 aus h28j-review-1)

Bereich: `git diff c0536fd86 89d2fe2ed -- . ':!docs/reviews'` (Commit `89d2fe2ed`), Worktree `review-h28k-code`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/tenant.service.ts:189 | Der neue Tiebreak `desc(rentalContracts.id)` hat keinen Test. Der neue Test (`contract.routes.pg.test.ts:88-100`) prüft nur zwei laufende Verträge mit unterschiedlichem Beginn (2024-04-01 und 2025-01-01). Streicht man die Zeile, bleiben alle Tests grün. Die Anforderung nennt den Gleichstand aber ausdrücklich: zwei laufende Verträge mit demselben Beginn, erwartet wird die grössere id. |

Keine Blocker und keine Major.

Geprüft: alle 10 geänderten Dateien.
- C-2: Die Existenzabfrage läuft in derselben Transaktion `q`. Ein inzwischen gelöschter Entwurf lässt die Änderung durch, ein gespeicherter, nicht betroffener wird abgelehnt.
- Rot durch Lesen bestätigt für den neuen Test in `contract-end.pg.test.ts`: Auf `c0536fd86` antwortet das Backend 400. Auch der umgebaute Test in `api-contracts` nennt jetzt eine bestehende Abrechnung eines fremden Vertrags und bleibt deshalb bei 400.
- C-3: `drift` meldet einen fehlenden Schlüssel. Das alte `undefined` fiele also im Vertrags-Abgleich auf. `getApartment` liefert alle Schlüssel aus `apartment.json`, über `apartmentFields`.
- C-4: Ohne `|| changes.fuelStockChanged` liefert der Test `[]`. Das Ergebnis wird damit rot.
- `api-specification.md` ist angepasst.
- Kein UI-, Text-, Screen- oder E2E-Teil im Diff.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: der neue C-2-Test rot vor der Änderung, C-1 und C-4 rot ohne den jeweiligen Code, die pg-Tests `contract-end`, `contract.routes`, `statement-run` und `api-contracts`, `bunx vitest run --changed origin/main` (827 grün), `bun run lint`, `bun run check`, der Backend-Type-Check und `bunx fallow audit`. Backend-Tests habe ich auf Wunsch nicht gestartet.
- Selbst erneut ausgeführt: `bunx vitest run src/__tests__/apartment.test.ts` (33 grün).
- Der Tiebreak bei zwei künftigen Verträgen mit gleichem Beginn liegt ausserhalb der Anforderung. Die alte BFF-Sortierung (`868aef918`, `tenants/[id]/+page.server.ts:23-25`) gab bei Gleichstand 1 zurück und war dort nicht eindeutig. Jetzt gilt auch hier die absteigende id. Einen Vergleich mit dem alten Verhalten habe ich nicht angestellt.
