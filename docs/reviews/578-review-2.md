# Code-Review #578, Runde 2 (105bd30..e45cb34)

Keine offenen und keine neuen Befunde.

Geschlossen: C-1, C-2, C-3, C-4, C-5, C-6, C-7

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`; compose-images und compose-prod (20 pass); `python3 marketing/i18n/build.py` für fr, it und en.
- Ob `docker compose up --wait` auf dem Runner grün wird (Pull von `alpine:3.20` und `postgres:16-alpine`, der einmalige Dienst `secrets`, das Backend ohne `ollama`): Lokal läuft kein Docker. Das zeigt erst der Job «Docker images» im Pull Request. Gelesen habe ich `ci.yml:105-129` und die `image:`-Zeilen von `compose.yaml`. Kein Dienst setzt `pull_policy`, also gilt `missing`, und die lokal getaggten ghcr-Images werden nicht gezogen.
- `needs` in `strategy.matrix` (`release.yml:57`): Laut GitHub-Dokumentation stehen in `jobs.<id>.strategy` die Kontexte `github`, `needs`, `vars` und `inputs` zur Verfügung, der Ausdruck ist also zulässig. Ob er tatsächlich die Version liefert, zeigt erst ein Release-Lauf.
- Weiterhin offen aus Runde 1: ob die ghcr-Pakete beim ersten Push öffentlich sind, die arm64-Builds unter QEMU, `No scenario: <reason>` im Text des Pull Requests, ein Update mit erhaltenen Daten.

Geprüft: Die Seiten fr, it und en enthalten kein `git clone`, kein `docker-compose.prod.yml` und keinen deutschen Kommentar mehr. Der neue Schlüssel ist in allen drei Tabellen. Die zwei entfernten Schlüssel stehen nicht mehr in `marketing/index.html`, und `build.py:96` bricht bei Schlüsseln ab, die auf keiner Seite vorkommen. Ausserdem: `-f docker-compose.yml` in `tech-stack.md`, Compose 2.23.1 und arm64 in `installation.md`, das CI-Filter `backend` für `docker/`, `compose.yaml` und `docker-compose.prod.yml`, `APP_VERSION` nur für das Frontend.
