# Review #777, Runde 1 (836ecca5..ae848a2c, .github/workflows/ci.yml)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Blocker | .github/workflows/ci.yml:240 | `oven-sh/setup-bun@v2` im Playwright-Image braucht `unzip`, das Image hat keines: jeder E2E- und axe-Shard (ohne SKIP) bricht vor den Tests ab |
| C-2 | Minor | docs/architecture/risks-and-tradeoffs.md:105 | RI-T1-4 beschreibt weiter den apt-Install bei jedem Lauf, zitiert den entfernten ci.yml-Kommentar («their system packages are installed each time») und sagt «offen als #777», obwohl der PR #777 schliessen soll |

## C-1 (Blocker): setup-bun scheitert im Container an fehlendem `unzip`

Warum falsch:
- setup-bun v2 (`src/action.ts`, Z. 182–183) lädt Bun als ZIP und entpackt es mit `extractZip` aus `@actions/tool-cache`. Unter Linux ruft das `extractZipNix` auf, das mit `io.which('unzip', true)` beginnt (`packages/tool-cache/src/tool-cache.ts`, Z. 398–399) und ohne `unzip` mit «Unable to locate executable file: unzip» abbricht.
- `utils/docker/Dockerfile.noble` von Playwright installiert auf `ubuntu:noble` nur `curl wget gpg ca-certificates nodejs git openssh-client zstd` und dazu `playwright-core install-deps`. Dessen Liste für `ubuntu24.04-x64` (`nativeDeps.ts`, Z. 242 ff.: xvfb, Schriften, Browser-Bibliotheken) enthält kein `unzip`, und das Basis-Image `ubuntu:noble` bringt es auch nicht mit.
- Auch der Cache von setup-bun (standardmässig an) hilft nicht: Er speichert `$HOME/.bun/bin/bun`, im Container also `/github/home/.bun/bin/bun`. Weil der Pfad in die Cache-Version eingeht, treffen die Einträge der Host-Jobs (`/home/runner/...`) nicht, und der erste Lauf im Container muss herunterladen.

Wie zeigen: Der CI-Lauf des PR. In jedem Shard mit `SKIP != 'true'` schlägt der Schritt «Run oven-sh/setup-bun@v2» mit der unzip-Meldung fehl. Lokal ohne CI: `docker run --rm mcr.microsoft.com/playwright:v1.64.1-noble which unzip` gibt nichts aus.

Wie beheben: kein apt zur Laufzeit, sonst ist #777 nicht erfüllt. Möglich ist etwa Bun über npm ins Home installieren (`npm install -g --prefix "$HOME/.local" bun@<Version>` plus `$HOME/.local/bin` in `GITHUB_PATH`; das npm-Paket holt das Binary über optionale Abhängigkeiten, ohne unzip). Ob setup-bun einen Weg ohne unzip anbietet, habe ich nicht geprüft.

## Nicht bestätigt

- Ob der Rest im Container läuft, kann erst ein CI-Lauf zeigen. Nach dem Lesen erwarte ich keine weiteren Fehler:
  - `actions/checkout`: git ist im Image.
  - `setup-node`: entpackt mit tar und gzip aus dem Manifest. Ob der Fallback auf `.tar.xz` gebraucht wird und `xz` fehlt, ist ungeprüft.
  - `upload-artifact` ist reines JS.
  - `HOME=/github/home` und `/__w` gehören uid 1001; `--user 1001` empfiehlt auch die Playwright-Dokumentation.
  - Postgres ist im Container-Modus unter dem Namen `postgres` erreichbar; `ports` bleibt dabei wirkungslos.
  - `PLAYWRIGHT_BROWSERS_PATH=/ms-playwright` ist im Image gesetzt, und das Image enthält alle drei Browser samt Systempaketen. Die Version passt: 1.64.1 für `playwright` und `playwright-core` in bun.lock.
  - Mehr brauchen Firefox und WebKit nach dem Dockerfile nicht.
- Die Datenbank-URLs: Alle Wege leiten sich aus `E2E_DATABASE_URL` ab, gelesen in playwright.config.ts:9–36 und tests/e2e/fixtures/backend.ts:12 und weitergegeben als `DATABASE_URL` an backend/scripts/e2e-db.ts und e2e-client.ts. Auf localhost bleiben nur die Ports der App und der Stubs, und die laufen im selben Container.
- Der sed-Ausdruck in `changes` gibt auf ae848a2c `1.64.1` aus (nachgeführt). Die Zeile steht vor jedem `exit 0`, die Ausgabe ist also nur leer, wenn bun.lock sein Format ändert. Dann scheitern alle Shards laut an `v-noble`.
- Ob es den Tag `v1.64.1-noble` auf MCR gibt: vom Aufrufer gemeldet, nicht geprüft.
- Die axe-Shards mit `SKIP=true` laden jetzt ebenfalls das Image. Das kostet Zeit, ist aber kein Fehler.
- `ui-screenshots` (ci.yml:440) liegt ausserhalb von #777: Der Bericht nennt nur «E2E tests» und «Accessibility (axe)». Kein Befund.
- Der Text von #777 selbst wurde nicht gelesen (kein GitHub-Zugriff in dieser Sitzung). Die Anforderung stammt aus dem Auftrag des Aufrufers.

Geprüft: Diff vollständig gelesen (ci.yml; implementation_plan.md nur zur Einordnung); ponytail-review: der entfernte `BROWSERS`-Eintrag und der Browser-Cache lassen nichts Unbenutztes zurück; kein Bezug zu Szenarien, Texten oder UI («No scenario» im Plan ist für eine reine CI-Änderung zulässig).
