# Code-Review #578 / PR #944, Runde 3 (Abschlussrunde, Delta c06545a..7277ca8)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `compose.yaml`, `docker-compose.prod.yml` und `Dockerfile` fragen den Health-Endpunkt der Web-App jetzt über `127.0.0.1:3000` ab. Die Web-App lauscht auf 0.0.0.0 (adapter-node ohne `HOST`). Ein anderer Health-Check auf `localhost:3000` steht in keiner Compose-Datei mehr; der `curl` im CI-Schritt läuft auf dem Runner. Der neue Test liest alle drei Stellen, und durch den Vergleich der beiden Compose-Dateien bleiben sie gleich. Der Test schlägt auf c06545a fehl, weil dort `localhost` steht. Der Diagnose-Schritt in `ci.yml` nutzt die Containernamen `dwello-frontend` und `dwello-backend` aus `compose.yaml` und endet weiterhin mit `exit 1`. Beide Commits gehören zur Anforderung; es gibt keine UI-, i18n- oder Scenario-Änderung. `No scenario` gilt, weil nur Build und CI geändert sind.

## Nicht bestätigt

- Ob der Job «Docker images» mit 7277ca8 grün läuft: Das lässt sich nur in CI zeigen. Ich habe keinen Lauf gesehen.
- Der Backend-Health-Check nutzt weiter `localhost:3001` (Bun-`fetch`, `backend/Dockerfile:49`, `compose.yaml:128`). Nach dem gemeldeten CI-Protokoll scheiterte nur das Frontend, deshalb ist das hier kein Befund.
- Vom Aufrufer gemeldet: `bun run lint` grün; compose-images und compose-prod mit 21 pass; der neue Test war vor dem Fix rot.
