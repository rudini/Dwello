# Code-Review #1395, Runde 3 (CI-Fix, `851e47fe..a57f3003`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: `backend/src/services/statement-invoices.service.ts:56-106`. Die Semantik ist gegenüber `851e47fe` unverändert: Liegenschaft ohne Wohnungen (Left Join, `max` = null → `?? 0`, es zählt `buildings.updated_at`); gelöschte Wohnung (eine harte Löschung berührt `buildings.updated_at`, das weiter in jede Zeile eingeht); unbekannte Liegenschaft (`at.get(id) ?? 0` → `new Date(0)`, wie vorher `building?.at … ?? 0`). Das `group by buildings.id` mit nicht aggregiertem `buildings.updated_at` ist in PostgreSQL zulässig, weil `buildings.id` der Primärschlüssel ist (`schema.ts:31`, funktionale Abhängigkeit). Zu den Zeitstempeltypen: Beide Spalten sind `timestamp` ohne Zeitzone im Modus `date` (`schema.ts:45,76`). `max(apartments.updatedAt)` wird über die Spalte gemappt und liefert `Date | null`, wie schon der alte Code mit `apartment?.at?.getTime()` vorausgesetzt hat. `where(undefined)` filtert nicht. Der Memo-Schlüssel `'apartments changed'` lädt einmal pro Liste, der Einzel-Loader `direct` filtert auf die Liegenschaft. Kein ungenutzter Code bleibt zurück. Nur `perPeriod` und `direct` rufen die Funktion auf.

## Nicht bestätigt

- Backend-Type-Check grün, vom Aufrufer gemeldet.
- pg-Tests `statement-outdated-values` und `statement-invoices` (64 bestanden, 0 fehlgeschlagen), vom Aufrufer gemeldet.
- p2-Benchmark `--queries` mit 23 Abfragen für `/api/v1/statements/outdated` und allen übrigen Routen unverändert, vom Aufrufer gemeldet. Ich habe die Abfragen nicht gezählt, nur gelesen: Je Liste kommen eine gruppierte Abfrage und eine Abfrage für die Verteilschlüssel dazu.
- `bun run fitness -- --base origin/main --structure` mit 0 Fehlern, vom Aufrufer gemeldet, und zwar für den früheren Head. Der Lauf auf `a57f3003` steht aus.
- Die Ratsche auf 23 anzuheben steht nicht in diesem Commit. Bis zu diesem Commit bleibt «Queries per route» in CI rot (die Ratsche steht noch auf 21). Ob «Gate change approved: #1395» im PR-Text steht, habe ich nicht geprüft.
