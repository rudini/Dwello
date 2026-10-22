# Code-Review 577, Runde 1 (895359e..80a0e4f)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/routes/dashboard/KiModelNotice.svelte:10-16 | Entschieden (#497, von #577 übernommen): «the KI model downloads in the background with a progress bar». Umgesetzt ist nur eine Prozentzahl im Titel; `src/lib/ui/ProgressBar.svelte` gibt es, wird aber nicht verwendet |
| C-2 | Major | backend/src/services/setup.service.ts:45-47 | Die Transaktion hält eine Pool-Verbindung und den Advisory-Lock, `hasLocalAccount`/`setLocalAccount` brauchen eine zweite. Bei ≥ `DB_POOL_SIZE` (20) gleichzeitigen öffentlichen POST /api/v1/setup verhungert der Pool, und das gesamte Backend steht still, auch **nach** der Einrichtung (der Lock wird vor der Prüfung auf SETUP_DONE geholt) |
| C-3 | Major | src/routes/dashboard/KiModelNotice.svelte:18; tests/a11y/screens.json:170 | Der neue UI-Zustand «KI-Modell konnte nicht geladen werden» (Alert `caution`) fehlt in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`; auch das Szenario für den gescheiterten Download, das Fachreview V-4 verlangt, fehlt (der Stand-in könnte eine `error`-Zeile senden) |
| C-4 | Major | src/lib/server/password-login.ts:92-96 | Die Sperre der Einrichtung (5 falsche Codes → `setup_error_locked` mit Uhrzeit) ist ein Verhalten, das der Nutzer sieht. Es hat kein Szenario und kein `No scenario: <reason>`, und der Zweig im BFF ist auf keiner Ebene getestet (ebenso die Weiterleitung bei `SETUP_DONE` und 502 bei einem Backend, das nicht antwortet) |
| C-5 | Minor | backend/src/services/local-account.service.ts:27; src/lib/server/password-login.ts:97 | Eine Adresse, die das Browser-`type=email` annimmt und zod ablehnt (`name@localhost`), führt zu einem nicht codierten `Error` → 500. Ein leeres E-Mail-Feld führt zu 422 von Elysia. Beides zeigt «Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.», was weder sagt, was geschehen ist, noch hilft. Ein leerer Code zählt als falscher Code und damit zur Sperre |
| C-6 | Minor | backend/src/services/setup.service.ts:38-41 | `announceSetupCode` hat keinen Test: weder dass der Code nur ohne Konto ins Protokoll kommt, noch dass der geloggte Code (ohne `SETUP_CODE`) der angenommene ist. Alle Tests und E2E setzen `SETUP_CODE` |
| C-7 | Minor | backend/src/services/ki-model.service.ts:30, 39-46 | Antwortet Ollama beim Start nicht (z. B. Neustart des Hosts, bei dem `depends_on` nicht gilt; das Backend hängt ohnehin nicht von `ollama` ab), bleibt der Zustand für den ganzen Lauf `unknown`. Es gibt weder Download noch Hinweis noch einen zweiten Versuch. Endet der Stream ohne `success`, zeigt die Übersicht dauerhaft «wird geladen: N %» (der Test `meldet während des Ladens` hält das sogar fest) |
| C-8 | Minor | backend/src/services/setup.service.ts:39; src/routes/setup/+page.server.ts:11-14 | Mit Google, aber ohne Konto mit Passwort wird trotzdem bei jedem Start ein Einrichtungscode geloggt, und die Action `/setup` (ohne `setupNeeded`-Prüfung) legt mit ihm ein Konto an. Laut Glossar gibt es die Einrichtung nur ohne Anbieter |
| C-9 | Minor | backend/src/routes/local-accounts.ts:45 | `GET /api/v1/setup` ist `GET /api/v1/auth/password` mit umgekehrtem Wert (`!hasLocalAccount()`). Das ist eine Kopie samt neuem Vertrag `setup-needed.json`; `setupNeeded` könnte die bestehende Antwort lesen (mit eigener Behandlung eines Fehlers) |
| C-10 | Minor | src/__tests__/jwt-config.test.ts:21; src/__tests__/privacy-page.dom.test.ts (`nennt Ollama nicht …`); src/__tests__/dashboard-page.test.ts (`zeigt nichts, wenn …`) | Diese Tests sind schon auf 895359e grün. Die Commit-Nachricht von 80a0e4f nennt sie nicht als Pins von bestehendem Verhalten (sie nennt nur die zwei Szenarien) |

## C-1

Die Product-Owner-Entscheidung in #497 (Optionen 2 und «First release») lautet zweimal wörtlich «with a progress bar». Done means von #577 sagt «shows its progress». `KiModelNotice` zeigt nur `ki_model_loading_title({ percent })`. Die Komponente `ProgressBar` (role=progressbar, Tokens) liegt in `src/lib/ui` bereit.
Nachweis: `grep -rn ProgressBar src/routes/dashboard` findet nichts. `dashboard-page.test.ts` prüft nur Text.
Abhilfe: entweder `<ProgressBar value={percent} max={100} label=…>` im Alert, mit DOM-Test und Label in allen vier Sprachen, oder die Abweichung unter «Blocked on me» zur Entscheidung vorlegen.

## C-2

Der Ablauf in `setUpFirstAccount`:
1. `db.transaction`, also Verbindung A aus dem Pool.
2. `pg_advisory_xact_lock(577)` auf A.
3. `hasLocalAccount()` und `setLocalAccount()` laufen über `db`, also auf einer **anderen** Pool-Verbindung.

Jeder Wartende hält eine Pool-Verbindung, solange er auf den Lock wartet. Bei 20 gleichzeitigen Anfragen (`max: POOL_SIZE` = 20, `backend/src/db/connection.ts:12-19`) belegen der Halter und 19 Wartende alle Verbindungen. Die Abfrage des Halters wartet dann in der Warteschlange des Pools, bis `connectionTimeoutMillis` (10 s) abläuft. Danach wird die Transaktion zurückgerollt, und der Nächste hat dasselbe Problem. Ein Angreifer ohne Code und ohne Sitzung hält so das ganze Backend (alle Routen teilen den Pool) dauerhaft blockiert. Er erreicht die Route über die öffentliche Seite `/setup` oder direkt über den veröffentlichten Port 3001. Weil der Lock vor der Prüfung `SETUP_DONE` geholt wird, geht das auch auf einer längst eingerichteten Installation. Die Sperre nach 5 falschen Codes verhindert es nicht, denn sie wird erst unter dem Lock geprüft.
Nachweis: Backend mit `DB_POOL_SIZE=2` starten und zwei POST /api/v1/setup gleichzeitig senden. Die erste Anfrage hängt etwa 10 s und endet mit 500 («timeout exceeded when trying to connect»). Der Test `legt bei gleichzeitigen Einrichtungen nur ein Konto an` sendet nur 3 Anfragen und bemerkt das nicht.
Abhilfe: `hasLocalAccount` vor dem Lock prüfen (Kurzschluss nach der Einrichtung) und Prüfung und Insert unter dem Lock über `tx` laufen lassen (z. B. `hasLocalAccount(tx)` / `setLocalAccount(…, tx)`), sodass nur eine Verbindung pro Anfrage gebraucht wird.

## C-3

CLAUDE.md, «Process»: Jeder neue Zustand kommt in `screens.json` (mit Bedeutung), `accessibility.feature` und `sprachen-bildschirme.feature`. Aufgenommen ist nur `ki-model-loading`. Der Zustand `failed` hat einen anderen Ton (`caution`) und eigene Texte (`ki_model_failed_*`), die so weder axe hell/dunkel noch die Prüfung «fr/it/en ohne Deutsch» sehen.
Fachreview 577 V-4 nennt «der Download des Modells scheitert» ausdrücklich als Fehlzustand ohne Szenario. Hinzugekommen sind nur der Text und ein Test in `dashboard-page.test.ts`. Der Stand-in `llm-stub.ts` (LLM_STUB_PULL) kann den Zustand erzeugen, indem `/stub/pull` eine Zeile `{ error }` sendet. «No scenario» greift daher nicht.
Nachweis: `grep -n "ki-model-failed\|failed" tests/a11y/screens.json tests/e2e/features/einrichtung.feature` findet nichts.

## C-4

Die Sperre ist eine entschiedene Regel (R-5). Ihre Meldung entsteht im BFF (`setup_error_locked` mit Schweizer Uhrzeit aus `params.until`). Weder `setup-page.test.ts` noch ein Szenario löst diesen Zweig aus, und die Meldung erscheint in keinem Test (`grep -rn setup_error_locked src/__tests__ tests` findet nichts). Wird `SETUP_LOCKED` zu `backend_setup_locked` oder `login_error_failed`, bleibt jeder Test grün.
Ein Szenario auf der gemeinsamen frischen Installation würde die Sperre für 15 Minuten im Speicher hinterlassen. Das ist eine gültige Begründung für `No scenario: <reason>`, aber nur zusammen mit einem Test auf tieferer Ebene. Dieser fehlt.
Abhilfe: In `setup-page.test.ts` je ein Fall für 423 (`setup_error_locked` mit Uhrzeit), für 409 (303 nach `/login`) und für ein Backend, das nicht antwortet (502). Dazu `No scenario: …` im Plan und im Pull Request.

## Nicht bestätigt

- `docker-compose.prod.yml` mit echtem Docker-Daemon: Quoting von `$$(cat …)`, Rechte 444 für die Benutzer `sveltekit`/`bun`, `POSTGRES_PASSWORD_FILE`, Restore-Befehl `docker compose run … secrets sh -c 'cp /keys/* /run/dwello/'` und `docker cp dwello-postgres:/run/dwello`. Nur gelesen (docker/init-secrets.sh, docs/installation.md:55-87), nicht ausgeführt.
- Ob Bun-`fetch` einen Pull-Stream über Dutzende Minuten (6 GB) abbricht (Leerlauf- oder Gesamt-Timeout). Ollama sendet laufend Zeilen; nicht geprüft.
- Die Pool-Erschöpfung in C-2 habe ich aus dem Code abgeleitet, nicht ausgeführt (Backend-Tests bzw. ein Start sind mir nicht erlaubt).
- Vom Aufrufer gemeldet, nicht wiederholt: `bun run lint`, `bun run check`, backend `type-check`, `bunx vitest run` (3585), backend `bun run test` (1312, 1 Fehlschlag O-45), E2E chromium (einrichtung 11, Auth/Privacy/axe/Sprachen 150 bzw. 58), `marketing/i18n/build.py`, fallow/deepcheck. Mein Versuch, vitest erneut auszuführen, scheiterte, weil der Zugriff auf `node_modules` gesperrt ist.

Geprüft: Code gelangt weder in den Browser noch ins Frontend-Log; Zeichenvorrat und Länge des Codes; Sperre nach 5 falschen Codes; Fallback `NODE_ENV` in jwt-config; Pfade alter Installationen in init-secrets.sh; kein Pull bei externem Anbieter oder `LLM_ENABLED=false`; Verträge; Glossarzeilen und `privacy_controller_none` wie entschieden; i18n-Begriffe; Screenplay-Schichten, Lock und Timeout in fixtures/test.ts; Tokens der Seite `/setup`; Herkunftsprüfung der Form-Action.
