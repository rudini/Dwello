# Code-Review #722, Abschlussrunde 1 (03b5a46fa..4049a2c7f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: C-1 (`docs/installation.md:133`, stimmt mit `compose.yaml:209,241` überein: ein leeres `{$DWELLO_DOMAIN}` macht den Site-Block zum globalen Optionsblock, Caddy bricht ab), C-2 (`README.md:283` verweist auf §7, wo der eigene Reverse Proxy beschrieben ist; der Kommentar in `backend/src/__tests__/compose-images.test.ts:86-87` stimmt mit `deploy/demo/docker-compose.yml:39-52` überein, die den Dienst `caddy` auf `docker-compose.prod.yml` legt und bei einem gleichnamigen Dienst dessen `profiles` übernehmen würde), C-3 (`docs/installation.md:158`, `caddy:2-alpine` in `compose.yaml:200` hat kein DNS-Modul). Der Diff ist reiner Text, nichts Unbeteiligtes.

## Nicht bestätigt

- Dass Caddy ohne `DWELLO_DOMAIN` wirklich mit einer Fehlermeldung in `docker logs dwello-caddy` abbricht: nur aus dem Caddyfile in `compose.yaml:241-245` abgeleitet, nicht ausgeführt.
- backend `compose-images.test.ts` (8 grün): vom Aufrufer gemeldet.
