# Review #1170, Runde 1 (4563b476)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|

Keine Befunde.

Geprüft: alle vier geänderten Dateien; `deploy/demo/docker-compose.yml:21-23` setzt beide Variablen mit `:?` (verweigert auch leere Werte, wie sie `.env.example` vorgibt) und überschreibt die `${…:-}`-Einträge von `docker-compose.prod.yml:45,47`; `reset-demo.sh:6` und `update.sh:23` übergeben `--env-file deploy/demo/.env`, die nächtliche Rücksetzung und das Update interpolieren also dieselben Werte; README Abschnitt 5 nennt die Startverweigerung, Zeile 106 den Abgleich von `.env` nach einem Update; der neue Test in `compose-prod.test.ts:140-145` schlägt auf der Basis fehl (keine `:?`-Zeilen im Frontend-Dienst) und folgt dem Muster der Nachbartests; `No scenario` ist begründet (kein Bildschirm ändert sich); nichts Fremdes im Diff.

## Nicht bestätigt

- `bun test src/__tests__/compose-prod.test.ts` (18 bestanden, Test rot gesehen), `bun run lint`, `bun run check`, `bun run type-check` im Backend, `bun run fitness -- --base origin/main --structure`: vom Aufrufer gemeldet.
- Manueller Lauf von `docker compose … config` mit fehlendem bzw. gesetztem Betreiber: vom Aufrufer gemeldet; nicht selbst ausgeführt, nur die Compose-Dateien gelesen.
- Dass der Product Owner beide Werte in der `.env` der Demo-VM setzt, bevor `update.sh` das nächste Release zieht (sonst bricht das automatische Update ab): ausserhalb des Repos, nicht prüfbar.
