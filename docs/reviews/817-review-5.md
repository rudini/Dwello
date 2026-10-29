# Code-Review 817, Runde 5 (Schlussrunde CI-Fix, 83f961c..1e426a3)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Gleichzeitige Aufrufe tragen nichts doppelt ein. Unter READ COMMITTED wartet das zweite `UPDATE ... where not expiry_recorded` auf die Zeilensperre und prüft die Bedingung danach an der neuen Zeilenversion erneut. Die Zeile ist dann schon `true`, also wird sie übersprungen, und das zweite INSERT findet nichts mehr in `expired`. Das gilt genauso zusammen mit `listAccessKeys` und `keyOf`, weil beide dieselben `EXPIRE`/`RECORD` verwenden. `occurred_at` ist `timestamptz` (OID 1184). node-postgres liefert den Wert ohne eigenen Type-Parser als `Date`, auf beiden Seiten des `union all`. `id` (uuid) kommt als String, `details` (jsonb) als Objekt; die Antwort hat die Felder `id`/`occurredAt`/`action`/`details` wie `tests/contracts/audit-log.json`. `RETURNING id, occurred_at, action, details` hat dieselbe Spaltenfolge wie die Hauptabfrage, `select *` passt also. `order by occurred_at desc` sortiert nach der SQL-Grammatik das ganze `union all`. Die absteigende Reihenfolge prüft schon `audit-log.pg` «hält den alten und den neuen Satz fest», das den ersten Eintrag nimmt. Der Zeitpunkt `(expires_on + 1)::timestamp at time zone 'Europe/Zurich'` ist derselbe wie vorher. `sqlToday` wird über `getSQL` bei jedem Aufbau der Abfrage neu bestimmt, das Modul-`const` friert den Tag also nicht ein. V-1 (das Protokoll sieht den Ablauf zuerst) prüft `access-key.pg` «hält den Ablauf ohne Abruf im Protokoll fest …»: Dort ist `GET /api/v1/audit-log` der erste Aufruf nach `expire`, und ohne den `union`-Zweig fehlt der Eintrag. Das entfernte `listAuditLog` und der weggefallene Parameter `occurredAt` von `recordAudit` haben keine weiteren Aufrufer. Die rote Fitness P2 auf der Basis belegt den Fix.

## Nicht bestätigt

- Backend type-check, `bun test` von access-key.pg, audit-log.pg und api-contracts.pg (133 pass), `bun run fitness:p2 -- --queries` (audit-log 1 von 1, auf 83f961c 4 von 1), Commit-Hooks: vom Aufrufer gemeldet.
- Das Verhalten bei gleichzeitigen Aufrufen habe ich nur aus der PostgreSQL-Semantik abgeleitet (READ COMMITTED, erneute Prüfung beim UPDATE). Kein Test zeigt es; gesucht in `backend/src/__tests__/access-key.pg.test.ts` und `audit-log.pg.test.ts`.
