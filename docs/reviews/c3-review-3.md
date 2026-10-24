# Code-Review c3, Runde 3 (Abschluss, nur Delta)

Range `9f5dabd7..79b8ab77` (ohne docs/reviews, implementation_plan.md, docs/archive), Worktree `review-c3c-code-reviewer` @ 79b8ab77. Vorberichte: `docs/reviews/c3-review-1.md`, `docs/reviews/c3-review-2.md`.

## Status offener IDs

- **C-2 (Minor): erledigt.** src/lib/types.ts:68 nennt in der `Omit`-Liste nur noch `contractCount`, `anonymisedOn`, `currentApartment` und `currentBuilding`. Alle vier gibt es in `TenantResponse` (backend/src/services/tenant.service.ts:29-32, :164-165, :221-222). Andere Zeilen ändert der Commit nicht.

## Neue Befunde

Keine.

Geprüft: Die übrigen `isActive`-Treffer im Frontend gehören zu Mieterlisten-Zeilen und Heizprofilen (src/__tests__/tenant-list.test.ts, tenant-detail.test.ts:272, heating-profile.ts:20), nicht zu `TenantResponse`. Die Zeile ist kürzer als 100 Zeichen und hat dieselbe Form, wie Prettier sie ausgibt. Das Laufzeitverhalten bleibt gleich, darum braucht es keinen Test.

## Nicht bestätigt

- `bun run check` (0 Fehler), `bun run lint` und `bunx vitest run` (3638): vom Aufrufer gemeldet. Ich habe sie nicht erneut ausgeführt, weil die Änderung nur einen Typ betrifft.
- Prettier lief nicht; die Prettier-Form habe ich nur durch Lesen geprüft.
