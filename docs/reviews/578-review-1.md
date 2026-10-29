# Code-Review #578, Runde 1 (285fc11..105bd30)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | .github/workflows/ci.yml:125 | `--pull never` startet auch `alpine:3.20` (secrets) und `postgres:16-alpine`, die auf dem Runner nicht liegen: der Schritt scheitert mit «No such image», Dwello wird nie gefragt |
| C-2 | Major | marketing/index.html:570; marketing/{en,fr,it}/index.html:571-618; marketing/i18n/*.json | Nur die deutsche Seite nennt den Download; die Seiten fr/it/en zeigen weiter `git clone` und `docker-compose.prod.yml`, und der neue Kommentar «# 1. Dwello herunterladen: eine Datei in einen leeren Ordner (Windows: curl.exe)» fehlt in den Tabellen von `i18n/build.py` |
| C-3 | Minor | docs/tech-stack.md:374 | `docker-compose up -d  # PostgreSQL on 5432` im Klon nimmt jetzt `compose.yaml` (vor `docker-compose.yml`) und startet die ganze Installation aus ghcr.io ohne Port 5432; `container_name: dwello-postgres` stösst mit der Entwicklungs-Datenbank zusammen. Nötig: `-f docker-compose.yml` |
| C-4 | Minor | docs/installation.md:12 | `configs.<name>.content` braucht Docker Compose ab 2.23.1; die Anleitung verlangt nur «Compose v2», ein älteres Compose (etwa auf einem NAS) lehnt die Datei ab |
| C-5 | Minor | docs/installation.md:12; .github/workflows/release.yml:41 | «PCs and Macs (amd64)» stimmt nicht: Macs mit Apple-Chip sind arm64 |
| C-6 | Minor | .github/workflows/ci.yml:77 | `compose-images.test.ts` läuft nur bei `backend=true`; ein Pull Request, der nur `compose.yaml`, `docker-compose.prod.yml` oder `docker/init-secrets.sh` ändert, lässt den Test aus, der beide gleich hält (erst `main` merkt es) |
| C-7 | Minor | .github/workflows/release.yml:75 | `build-args: APP_VERSION` geht auch an das Backend, dessen `backend/Dockerfile` kein `ARG APP_VERSION` hat: ungenutzt |

## C-1

`docker compose up --pull never` holt kein Image, auch keines, das fehlt. Lokal gebaut sind nur `ghcr.io/rudini/dwello-frontend:latest` und `-backend:latest`. `frontend` hängt an `secrets` (`alpine:3.20`) und über `backend` an `postgres` (`postgres:16-alpine`). Die Runner-Images `ubuntu-latest` (24.04) bringen keine Docker-Images mit, und keines der beiden Dockerfiles baut auf ihnen auf (`node:26-alpine`, `oven/bun:1`). Compose legt bei einem fehlenden Image mit der Pull-Policy `never` keinen Container an und bricht ab.

So zeigt man den Fehler: der Job «Docker images» im Pull Request, oder auf einem Rechner ohne `alpine:3.20` die Befehle `docker image rm alpine:3.20`, dann `docker compose up --pull never frontend`. Damit ist «CI starts compose.yaml once and checks that Dwello answers» nicht erfüllt. Die Lösung ist `--pull missing`, der Standard: Die lokal getaggten ghcr-Images sind dann vorhanden und werden nicht gezogen. Holen muss Compose nur alpine und postgres.

## C-2

«Done means» verlangt «`marketing/index.html` (commands in «Einrichten») updated». `marketing/README.md` erklärt `index.html` zur Quelle der Seiten fr/it/en. Nach einer Änderung deutscher Texte kommen sie in `i18n/{fr,it,en}.json`, und `python3 marketing/i18n/build.py` läuft. Das ist nicht geschehen:

- `grep -n 'git clone' marketing/en/index.html` findet die Zeilen 571, 592 und 616.
- In `marketing/i18n/en.json:125` steht nur der alte Schlüssel `"code:# 1. Dwello herunterladen"`.
- Für den neuen Kommentar gibt es keine Übersetzung, `build.py` würde daran anhalten.

Wer die Seite auf Französisch, Italienisch oder Englisch öffnet, bekommt weiter die Installation mit Klon und Build, die #578 abschafft. Das widerspricht auch der Regel «jeder neue oder geänderte Text in allen Sprachen».

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `cd backend && bun run type-check`, `bun test` von compose-images, compose-prod und init-secrets (25 pass), `bunx vitest run tools/release` und open-work (16 pass), `docker compose -f compose.yaml config -q`.
- Ob ghcr.io die Pakete beim ersten Push öffentlich macht: Für ein Paket eines Benutzers ist die Sichtbarkeit beim ersten Veröffentlichen laut GitHub privat, auch wenn das Paket über das Label `org.opencontainers.image.source` am öffentlichen Repository hängt. Vielleicht muss man es einmal von Hand auf «public» stellen. Der Kommentar in `release.yml:40` sagt «public with the repository». Kein Job prüft einen Pull ohne Anmeldung. Gelesen habe ich `release.yml:38-79`.
- Ob die arm64-Builds unter QEMU durchlaufen (`bun install` und Build im Backend, SvelteKit-Build im Frontend), und wie lange sie dauern. Das zeigt erst ein Release.
- Ob `up --wait` mit dem einmaligen Dienst `secrets` (endet mit 0) grün bleibt: Das hängt von der Compose-Version des Runners ab. Ob das Backend ohne den Dienst `ollama` gesund wird: Das zeigt erst der CI-Lauf, den C-1 im Moment verhindert.
- `No scenario: <reason>` im Text des Pull Requests: Den gibt es noch nicht, und die Commit-Nachricht nennt keinen Grund.
- Ob O-46 geschlossen ist: `docs/archive` liegt ausserhalb des Bereichs.
- Ein Update mit `pull` und `up -d`, bei dem die Daten bleiben: Belegt ist das nur durch `name: dwello` und die festen Namen der Volumes (Test «heisst wie eine Installation aus dem Klon»). Gelaufen ist es nicht.

Geprüft: `release.sh` und sein Test (Version auch beim schon getaggten Merge, rot ohne die Änderung), die Matrix, die Tags und die Rechte in `release.yml`, die Serialisierung über `concurrency`, `compose.yaml` gegen `docker-compose.prod.yml` (nur Port 3000, `$$` im eingebetteten Skript), die rote Phase von `compose-images.test.ts`, das CI-Filter `app` (umfasst `compose.yaml`), `/health` im Frontend, `docs/installation.md` (Download, Update, Umzug aus dem Klon mit `COMPOSE_PROJECT_NAME`), der Abschnitt «Deployment» im README.
