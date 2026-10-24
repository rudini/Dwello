# Code-Review c3, Runde 2 (Abschluss, nur Delta)

Range `7cc5c2bf..9f5dabd7` (ohne docs/reviews, implementation_plan.md, docs/archive), Worktree `review-c3b-code-reviewer` @ 9f5dabd7. Vorbericht: `docs/reviews/c3-review-1.md`.

## Status offener IDs

- **C-1 (Minor): erledigt.** `getTenant` (backend/src/services/tenant.service.ts:178) hat keine Rückgabe-Annotation und keinen Cast mehr. `TenantDetail` (:38) und `TenantResponse` (:41) folgen damit der Abfrage und enthalten kein `isActive` mehr. `satisfies TenantResponse` (backend/src/routes/tenants.ts:78) prüft jetzt gegen die tatsächliche Form. Der Kommentar (:37, :40) und ADR 0003 Punkt 2 sind wahr.

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-2 | Minor | src/lib/types.ts:70 | `Omit<ApiTenant, … 'isActive' …>` nennt einen Schlüssel, den `TenantResponse` seit diesem Fix nicht mehr hat. `Omit` akzeptiert jeden Schlüssel, darum meldet `svelte-check` nichts. Der Eintrag ist toter Code und behauptet, das Backend sende ein `isActive`, das der Frontend-Typ wegfiltern müsse. Das widerspricht genau dem, was C-1 korrigiert hat. Lösung: `'isActive'` aus der Liste entfernen. |

## Geprüft

Es gibt keine Änderung zur Laufzeit, nur Typen ohne Cast. `statement-send.service.ts:24-85` und `reminder.service.ts:88-153` lesen nur `id`, `firstName`, `lastName`, `email`, `language` und `correspondenceChannel`. Kein Aufrufer las `isActive`. Mit dem abgeleiteten Typ werden `currentApartment` und `currentBuilding` (leftJoin) zu `string | null | undefined`. Kein Aufrufer im Backend liest sie. Im Frontend fallen sie per `Omit` aus `Tenant` heraus (types.ts:70). `GET /:id/history` (`getTenantWithHistory`) hat im Frontend keinen Aufrufer und keinen Vertrag. `contractCount` bleibt `sql<number>` wie bisher. Die Vorwärtsreferenz `ReturnType<typeof getTenant>` erzeugt keinen Zyklus mit der Annotation von `getTenantWithHistory`.

## Nicht bestätigt

- Backend `type-check` und `bun run test` (1562), Frontend `bun run check`, `bun run lint`, `bunx vitest run` (3638) und `bun run fitness`: vom Aufrufer gemeldet. Mein eigener `tsc --noEmit` im Worktree brach ab, weil der Zugriff auf `node_modules` (Symlink ins Hauptrepo) gesperrt ist. Das Ergebnis ist daher nicht verwertbar.
