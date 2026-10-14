# Code-Review Slice «demo», Runde 1

Commit-Bereich `61e47eb..f25f635` (ein Commit, `f25f635 chore(docker): add demo deployment on Oracle VM`), gelesen im Worktree `review-demo-code-reviewer`. Alle neun geänderten Dateien gelesen, dazu `docker-compose.prod.yml`, `backend/Dockerfile`, `.dockerignore`, `backend/.dockerignore`, `.gitignore`, `backend/scripts/e2e-db.ts`, `backend/scripts/demo-data.ts`, `src/lib/server/jwt-config.ts`, `backend/src/middleware/auth.ts`, `src/routes/auth/callback/+server.ts`, `src/lib/server/login-flow.ts`, `src/lib/server/error-handler.ts`, `src/lib/server/oauth.ts`, `src/routes/login/+page.server.ts`, `backend/src/mail/index.ts`, `backend/src/routes/documents.ts`, Datenschutztexte in `messages/de.json`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `deploy/demo/README.md:5`, `messages/de.json` (`privacy_stored_2`, `privacy_login_1`) | Die Besucher erfahren nirgends, dass alle dieselben Daten sehen und diese nachts gelöscht werden; «Do not enter real data» steht nur in der Betreiber-Anleitung. Die Datenschutzerklärung der Demo beschreibt eine Einzelinstallation und stimmt für die öffentliche Demo nicht. |
| C-2 | Minor | `deploy/demo/README.md:23` | Die Aussage, Besucher und nächtlicher Reset reichten «usually» gegen das Zurückfordern im Leerlauf, hält nicht: Oracle misst das 95. Perzentil von CPU, Netz und (bei A1) Speicher über 7 Tage, jeweils unter 20 %. Ein Reset von 30 s pro Nacht und ein Node/Postgres-Stack mit ca. 1 GB von 12 GB bleiben darunter. Empfehlung: das Upgrade auf Pay-as-you-go als Schritt aufnehmen, nicht nur als Möglichkeit erwähnen. |
| C-3 | Minor | `deploy/demo/reset-demo.sh:11` | Bricht `demo-data.ts` nach dem DROP/CREATE ab (oder `e2e-db.ts` mitten in den Migrationen), bleibt die Demo bis zur nächsten Nacht leer oder halb migriert. Der Fehler steht nur in `demo-reset.log`, niemand wird benachrichtigt. Mindestens im README erwähnen (Log prüfen, Skript von Hand erneut starten). |
| C-4 | Minor | `deploy/demo/docker-compose.yml:6-18`, `src/routes/auth/callback/+server.ts:46` | Bei jeder Anmeldung wird die E-Mail-Adresse des Besuchers geloggt (`login_complete`). Der Docker-Logtreiber `json-file` hat ohne `logging.options.max-size` keine Grösse und kein Alter als Grenze. Bei einer öffentlichen Demo sammeln sich so die Adressen aller Besucher zeitlich unbegrenzt auf der Platte (Platz auf dem 50-GB-Volume, Datenschutz). Empfehlung: im Overlay `logging: {driver: json-file, options: {max-size: 10m, max-file: "3"}}`. |
| C-5 | Minor | `deploy/demo/.env.example:10` | Bleibt `POSTGRES_PASSWORD` leer, setzt `docker-compose.prod.yml` (`${POSTGRES_PASSWORD:-dwello}`) still `dwello`. Postgres ist in der Demo nicht veröffentlicht, das Risiko ist also klein (O-3), aber ein leerer Wert sollte nicht unbemerkt durchgehen: `${POSTGRES_PASSWORD:?}` im Overlay oder ein Hinweis. (Leeres `JWT_SECRET` ist abgedeckt: `src/lib/server/jwt-config.ts:17` bricht ab.) |
| C-6 | Minor | `implementation_plan.md:22` | Steht «Skills: none loaded», obwohl der Slice Code ändert (Dockerfile, Compose, Shell-Skript); verlangt ist `Skills: tdd, ponytail, ponytail-review` (ponytail-review mindestens auf den Diff). |
| C-7 | Nit | `deploy/demo/Caddyfile:2-5` | Keine Sicherheits-Header (HSTS u. a.); Caddy setzt sie nicht von selbst. `header Strict-Transport-Security "max-age=31536000"` wäre eine Zeile. |
| C-8 | Nit | `deploy/demo/README.md:12-17` | Die INPUT-Regeln für 80/443 braucht es für Ports, die Docker veröffentlicht, nicht: Docker leitet sie per DNAT über FORWARD/DOCKER weiter, an INPUT vorbei. Sie schaden nicht. Der Satz «blocks these ports» passt aber nur, wenn Caddy ohne Docker liefe. |
| C-9 | Nit | `deploy/demo/reset-demo.sh:10` | Der `EXIT`-Trap von dash läuft nicht, wenn das Skript per SIGTERM oder SIGINT abbricht (z. B. bei einem Abbruch von Hand). Danach bleibt das Backend gestoppt. `trap '…' EXIT INT TERM` deckt das ab. |
| C-10 | Nit | `deploy/demo/README.md:58` | Bei jedem Update entstehen mit `up -d --build` alte, nicht mehr benannte Images, und `demo-reset.log` wächst ohne Grenze. Auf 50 GB zeigt sich das erst nach Monaten; `docker image prune -f` nach dem Update würde reichen. |
| C-11 | Nit | `deploy/demo/docker-compose.yml:24-26` | UDP 443 ist nicht veröffentlicht, Caddy kündigt aber HTTP/3 an (Alt-Svc). Die Browser fallen still auf TCP zurück. Entweder `"443:443/udp"` (plus Oracle-Regel) oder so lassen. |

## C-1 (Major): öffentliche Demo ohne Hinweis an die Besucher

**Warum falsch:** Die Anforderung verlangt bewusst geteilte Daten ohne Trennung pro Benutzer. Damit wird jede Eingabe eines Besuchers allen anderen Besuchern gezeigt, die sich mit Google anmelden (OAuth-Status «In production», `README.md:40`). Gibt jemand echte Mieter ein (Name, Adresse, E-Mail, Mietzins), legt die Demo Personendaten Dritter offen. Auf der Website warnt nichts davor: Die Login-Seite (`src/routes/login/+page.svelte`) zeigt nur die Anbieter-Buttons. Der Warnhinweis steht nur in `deploy/demo/README.md:5`, und das liest nur der Betreiber. Die ausgelieferte Datenschutzerklärung sagt sogar, die Anmeldedaten würden «nur, um die Sitzung zu führen» verwendet (`privacy_login_1`). Sie nennt weder das Teilen der Daten noch das Löschen in der Nacht noch das Log der E-Mail-Adressen (C-4). Den Betreiber trifft nach revDSG die Informationspflicht.

**Wie zeigen:** Den Stack nach `deploy/demo/README.md` starten, mit Konto A einen Mieter «Max Echt» anlegen, mit Konto B anmelden: Unter `/tenants` erscheint der Mieter. Auf `/login`, `/dashboard` und `/privacy` weist kein Text auf das Teilen oder den nächtlichen Reset hin.

**Vorschlag:** Ein Demo-Hinweis (z. B. über `PUBLIC_DEMO=true`, auf der Login-Seite und im Layout: «Demo: Alle Besucher sehen dieselben Daten; jede Nacht wird alles zurückgesetzt. Geben Sie keine echten Daten ein.») und ein passender Absatz in der Datenschutzerklärung. Das ist eine Änderung der App: Szenario, alle vier `messages/*.json`, a11y-Einträge. Wird sie nicht in diesem Task gemacht, braucht es vor dem Livegang ein Issue (`produkt`, ggf. `entscheiden`) und einen Eintrag unter «Blocked on me». Ohne Hinweis sollte die Demo nicht öffentlich gehen.

## Bestätigt

- Self-Hosting bleibt unberührt: `docker-compose.prod.yml` ist im Diff unverändert. Die Dockerfile-Änderung (`--ignore-scripts`) nützt auch Self-Hostern. Das einzige Paket mit Install-Skript ist `esbuild` (`postinstall`), und esbuild findet sein Binary über das optionale Plattformpaket. Paraglide kompiliert in `vite build` (`vite.config.ts:16`).
- Overlay: `ports: !reset []` auf frontend, backend, postgres und ollama; nur Caddy veröffentlicht 80/443. Der Caddyfile-Pfad wird relativ zum Projektverzeichnis (Repo-Wurzel, erste `-f`-Datei) aufgelöst. `deploy/demo/.env` ist durch `.gitignore:13` ignoriert, `git pull` auf der VM gerät also nicht in Konflikt.
- Mailversand: `docker-compose.prod.yml` gibt `MAIL_TRANSPORT` nicht weiter, also wirft `backend/src/mail/index.ts:24`. Besucher können über Mahnungen keine E-Mails an beliebige Adressen auslösen.
- Swagger (O-4) und das Backend sind von aussen nicht erreichbar.
- Reset: `e2e-db.ts` löscht mit `DROP DATABASE … WITH (FORCE)` und baut die DB aus den Migrationen neu auf. Volumes bleiben. Fehlt `deploy/demo/.env`, bricht `compose stop` ab, bevor der Trap gesetzt ist und bevor gelöscht wird. Ein versehentlicher Lauf auf einer Self-Hosting-Installation ohne diese Datei löscht also nichts. Der Trap startet das Backend auch dann, wenn `compose run` scheitert.
- Cron: absolute Pfade, `cd "$(dirname "$0")/../.."`, `docker` unter `/usr/bin` liegt im PATH von cron. Die Zeitzone wird in Schritt 1.4 gesetzt.
- Oracle-Limit 2 OCPU / 12 GB seit Mitte 2026: per Websuche bestätigt (Oracle Community, InfoQ, Juli 2026).
- Google-Scopes `openid email profile` (`src/lib/server/oauth.ts:47`): nicht sensibel, die README-Aussage stimmt. Der Microsoft-Button erscheint nur, wenn Microsoft konfiguriert ist (`getConfiguredProviders`).

## Nicht bestätigt

- `bun run lint`, `bunx vitest run src/__tests__/open-work.test.ts`, `docker compose … config`, der manuelle Stack-Test (Ports, HTTPS, 308, CSRF mit eigenem und fremdem Origin, Reset in 17 s), der Rot/Grün-Nachweis von `docker build` sowie test:coverage, check und Backend-Tests (diese liefen noch): vom Aufrufer gemeldet, nicht erneut ausgeführt (Docker und Builds sind mir untersagt).
- Build und Lauf auf aarch64 (Oracle A1): Alle Basis-Images sind Multi-Arch, aber das wurde nur auf der Sandbox-Architektur gebaut. Ollama mit `qwen2.5:3b` auf 2 OCPU wurde nicht gestartet (im Stack-Test ausgelassen); Dauer und Speicherbedarf einer Kategorisierung sind unbekannt.
- Mindestversion von Compose für `!reset` (README: 2.24): nicht nachgeprüft.
- Feldnamen im DNS-Formular von Infomaniak («Source», «Target») und die Option TTL «1 hour»: nicht geprüft (kein Zugang).
- Dass die Let's-Encrypt-HTTP-01-Challenge auf Oracle mit den Default-Regeln in der FORWARD-Chain von Ubuntu durchkommt (C-8): aus der Docker-Logik abgeleitet, nicht auf einer Oracle-VM getestet.
- Ob `demo-data.ts` Daten relativ zum heutigen Datum anlegt (damit die Demo nach Monaten noch «aktuell» wirkt): nicht geprüft, liegt ausserhalb des Diffs.
