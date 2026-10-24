# Code-Review Zyklus 3, Pilot B (Runde 1)

Range `bc30b2a7..7cc5c2bf` (ohne docs/reviews, implementation_plan.md, docs/archive), Worktree `review-c3-code-reviewer` @ 7cc5c2bf.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/tenant.service.ts:37-38, :177, :221; backend/src/routes/tenants.ts:75-78; docs/architecture/adr/0003-mietertyp-aus-dem-backend.md:24 | `TenantResponse` sagt, sie sei «die Antwort von GET /tenants/:id», und laut ADR verhindert `satisfies`, dass «der Typ vom Gesendeten abweichen kann». Das stimmt nicht. `getTenant` wählt nur `tenantFields` und `isFuture` aus (:177) und castet am Ende `as TenantWithOccupancy` (:221). Darum verlangt der Typ `isActive: boolean`, das GET /:id nie sendet (`tests/contracts/tenant.json` hat kein `isActive`). `satisfies` prüft nur gegen den gecasteten Typ und kann solche Abweichungen nicht finden. Zur Laufzeit folgt nichts daraus, weil das Frontend `isActive` weglässt. Falsch sind aber der Kommentar und der Satz in der ADR. Und der Mechanismus, den die ADR für weitere Entitäten empfiehlt, sichert weniger zu, als sie behauptet: Eine neue Spalte, die nicht in `tenantFields` steht, landet im Typ, aber nie in der Antwort. Belegen lässt es sich so: Ohne `as TenantWithOccupancy` in Zeile 221 meldet `tsc` das fehlende `isActive`. |

Geprüft:
- Keine Laufzeitänderung. Alle Backend-Änderungen betreffen nur Typen (`$type`, Cast im Filter, `satisfies`, `as const`, Re-Export).
- `import type` mit `verbatimModuleSyntax` wird entfernt, also gelangt kein Backend-Code ins Client-Bundle.
- Die CI-Jobs «Lint and types» installieren `backend/node_modules`.
- `Json<>` passt für alle Felder, die bleiben: `createdAt` und `updatedAt` sind `Date`, also `string`. Sonst gibt es nur Strings, Booleans und `null`, keine verschachtelten Felder. `anonymisedOn` und `contractCount` sind ausgelassen.
- Der abgeleitete `Tenant` hat dieselben Pflicht- und optionalen Felder wie vorher. Einzige Einengung: `createdAt`/`updatedAt` sind jetzt `string` statt `Date | string`. Weder `toTenant` noch eine andere Stelle setzt sie.
- `TenantListItem` überschreibt `currentApartment`/`isActive` ohne Konflikt, weil das `Omit` sie entfernt.
- Umbenennung vollständig, Ratchet-Werte stimmen mit der ADR überein.
- Kein UI-Text, keine Migration, kein Szenario geändert.
- Backend `tsc --noEmit` habe ich nachgefahren: grün.

## Nicht bestätigt

- vom Aufrufer gemeldet:
  - Backend `bun run test` (1562)
  - Frontend `bun run lint`, `bun run check`, `bunx vitest run` (3638), `bun run build`
  - `bun run fitness` (Entity-Spiegel 54, Boundary-Importe 0)
  - E2E Mieter (30), Chromium und API
  - Commit-Hooks
- Die Messwerte der ADR (Feldstreuung, `02-imports`/`05-knowledge`) habe ich nicht nachgemessen, nur gegen `ratchet.json` und `fitness-functions.md` abgeglichen.
- Ob der Pull-Request-Text `No scenario: <reason>` (reines Refactoring) enthält, lässt sich erst am Pull Request prüfen.
