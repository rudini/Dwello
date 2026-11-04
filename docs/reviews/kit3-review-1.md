# Code-Review kit3, Runde 1 (code-reviewer)

Bereich: `git diff 243a602 b456ede` (220fc65, 649835b, 045fe4a, b456ede), Worktree `review-kit3-code-reviewer` (detached b456ede).
Quellen von Kit/Adapter gelesen im Bun-Cache (`~/.bun/install/cache/@sveltejs/kit@3.1.1@@@1`, `adapter-node@6.0.1@@@1`), da der Worktree kein `node_modules` hat.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|---------|
| C-1 | Blocker | vite.config.ts:51, compose.yaml:56, docker-compose.prod.yml:54, docs/design/tools/persona-stack.sh:45, playwright.config.ts:49, tools/fitness/p1-benchmark.ts:92 | adapter-node 6 liest `ORIGIN` nicht mehr: ohne `paths.origin` hält er jede Anfrage für `https://<Host>`. Auf jeder http-Installation lehnt Kit jedes Formular-POST mit 403 ab (auch die Anmeldung mit Passwort); Notfallblatt und MCP-Adresse zeigen https und kommen aus dem Host-Header |
| C-2 | Major | src/routes/login/PasswordForm.svelte:20, src/routes/statements/[id]/SendDialog.svelte:64 (und alle anderen `action="?/…"` mit `use:enhance` ausserhalb von ActionDialog) | Kit 3 öffnet nach `enhance` die Adresse der Aktion ohne Query. Angepasst ist nur ActionDialog. Ein falsches Passwort auf `/login?redirectTo=…` verliert `redirectTo`, und eine Aktion auf `/statements/[id]?pdf-change=…` lässt den Hinweis «PDF geändert» verschwinden. Das ändert Verhalten, und kein Test deckt es ab |
| C-3 | Minor | tests/e2e/CLAUDE.md:18, tests/unit/vite-config.test.ts:11 | Kommentare und Doku sind veraltet: `BUILD_DIR` steht noch bei «`svelte.config.js`» (die Datei ist gelöscht), und das Laden der `.env` wird noch mit «`$env/dynamic/private`» begründet (heute `$app/env/private`). 649835b hat diese beiden Stellen übersehen |

## C-1 (Blocker): Öffentliche Adresse der App fehlt seit adapter-node 6

Was falsch ist:
- `adapter-node@6.0.1/src/env.js` kennt `ORIGIN` nicht mehr. `src/handler.js` nimmt `origin` aus `builder.config.paths.origin`, und dieser Wert wird beim Build festgelegt (`index.js:69`). Fehlt er, rechnet `get_origin()` mit `PROTOCOL_HEADER || 'https'` und dem `Host`-Header.
- `vite.config.ts` setzt kein `paths.origin`. Alle Stellen, die `ORIGIN` setzen, wirken daher nicht mehr: compose.yaml, docker-compose.prod.yml, persona-stack.sh, playwright.config.ts und p1-benchmark.
- `backend/src/__tests__/compose-prod.test.ts:75` prüft weiter, dass `ORIGIN` in Compose steht. Der Test bleibt grün, obwohl die Zeile nichts mehr bewirkt. Sein Kommentar (Z. 55) beschreibt genau diesen Fehler: «without ORIGIN, adapter-node takes every request for https, refuses the sign-in form».

Folgen in Produktion, nicht nur in E2E:
- Die CSRF-Prüfung in Kit 3 (`runtime/server/respond.js:116`, `csrf.js:37`) vergleicht den `Origin`-Header des Browsers (`http://homeserver.local:3000`) mit `url.origin` (`https://homeserver.local:3000`). Das Ergebnis ist 403 «Cross-site POST form submissions are forbidden» für jede Form-Action. Betroffen sind die Anmeldung `?/password`, `/setup` und alle Speichern- und Löschen-Aktionen.
- Das gilt für den Docker-Standard (`PUBLIC_APP_URL:-http://localhost:3000`), für die dokumentierte Heimserver-Installation (docs/installation.md:151–156, «Dwello accepts the sign-in only at the address in `PUBLIC_APP_URL`» stimmt nicht mehr) und für den Persona-Stack.
- `insecureConnection(url)` (src/lib/server/password-login.ts:26) wird nie wahr. Die Warnung vor einer unverschlüsselten Verbindung fällt damit still weg.
- Notfallblatt (`src/routes/backup/sheet/+server.ts:8`) und MCP-Adresse (`src/routes/config/access-keys/+page.server.ts:23`) bauen auf `url.origin` auf. Sie zeigen https, und der Wert kommt jetzt aus dem frei setzbaren Host-Header statt aus der konfigurierten Adresse. Deshalb ist «Notfallblatt enthält die Adresse» rot.
- Hinter Caddy mit https bleibt die App lauffähig, solange Caddy den Host weitergibt. Die Adresse kommt dann aber trotzdem aus dem Header.
- `paths.origin` beim Build reicht allein nicht: Die Images werden fertig gebaut von ghcr.io geladen (compose.yaml:36), und die Adresse jeder Installation ist erst zur Laufzeit bekannt (`PUBLIC_APP_URL`). Gebraucht wird ein Weg zur Laufzeit, etwa ein eigener Einstieg um `build/handler.js`, der Protokoll und Host aus `ORIGIN` setzt. Die Prüfung in compose-prod.test.ts muss danach prüfen, was wirklich wirkt.
- Der E2E-Workaround (`PROTOCOL_HEADER=x-e2e-proto` und `extraHTTPHeaders`) ist nicht committet. Er würde auch nur die Tests reparieren, nicht die Installation.

So lässt sich der Fehler zeigen:
1. `bun run build`, dann `ORIGIN=http://localhost:3000 PORT=3000 node build`.
2. `curl -i -X POST 'http://localhost:3000/login?/password' -H 'Origin: http://localhost:3000' -H 'Content-Type: application/x-www-form-urlencoded' -d 'email=a&password=b'`. Antwort: 403 statt einer Antwort der Action.
3. Alternativ einen Schritt dieser Art: E2E auf b456ede ohne den lokalen Workaround in playwright.config.ts laufen lassen.

## C-2 (Major): Andere Formulare verlieren die Query der Seite

Was falsch ist:
- In Kit 3 navigiert `enhance` nach `result.location` (`runtime/app/forms/client.js:89–109`). `result.location` ist die Adresse der Aktion ohne den `/name`-Schlüssel (`server/page/actions.js:74`). Unterscheidet sich die Query von der aktuellen Adresse (`is_current_location`), lädt Kit die Seite unter der anderen Adresse. Das gilt auch für `update()` im eigenen Callback (`client.js:247`), denn `navigate` ist standardmässig an.
- b456ede behebt das nur in `ActionDialog.svelte`. Alle anderen `?/…`-Formulare (Liste mit `grep -rn 'action="?/' src/routes`) bleiben betroffen. Zwei Fälle, die der Verwalter sieht:
  - `/login?redirectTo=/tenants/…` (hooks.server.ts:60), dann ein falsches Passwort: Kit öffnet `/login`, `data.redirectTo` ist `null`, und das versteckte Feld `redirectTo` fällt weg. Nach dem richtigen Passwort landet der Verwalter auf dem Dashboard statt auf der verlangten Seite (`safeTarget(null)`). Auf main bleibt die Adresse erhalten (Kit 2: `invalidateAll` auf derselben URL).
  - `/statements/[id]?pdf-change=…` (Weiterleitung aus edit/+page.server.ts:44), dann Versenden, Mahnen oder Bezahlt-Markieren (eigene Formulare, nicht ActionDialog): Kit öffnet `/statements/[id]`, und der Hinweis `statement-pdf-changed` verschwindet. Das passiert auch bei einer Ablehnung.
- Die Anforderung lautet «kein Verhaltenswechsel». Kein Test und kein Szenario deckt diese Fälle ab. Die E2E-Läufe waren bis auf zwei bekannte Fehler grün und haben das deshalb nicht gefunden.

So lässt sich der Fehler zeigen:
- Ein DOM-Test für `PasswordForm` (oder allgemein für `enhance` mit `?/name` unter einer Adresse mit Query) erwartet, dass das Formular die Query behält. Das ginge über denselben Ansatz wie in ActionDialog, zentral für alle `?/`-Formulare, oder über `update({ navigate: false })`.
- Für den sichtbaren Login-Fall braucht es ein Szenario: Seite verlangt, falsches Passwort, dann richtiges Passwort, danach ist die verlangte Seite offen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt:
  - lint grün; check 0 Fehler; Backend type-check grün
  - vitest 4049/4053 (open-work rot wegen einer fremden Datei); Coverage 92.9/85.3/94.1/91.9
  - Build grün; `node build` nach Installation nur der Produktionsabhängigkeiten (login/health 200)
  - E2E mit nicht committetem Workaround: accessibility.feature grün, sonst 1420 grün und 2 rot (datenexport fr wegen der Umgebung; sicherung «Notfallblatt enthält die Adresse», das ist C-1)
- Dass `$app/env/private` im Dev-Server (`bun run dev`) die Werte aus `.env` liest wie früher `$env/dynamic/private`: nicht ausgeführt. Gelesen habe ich `EnvVarConfig.static` (Standard: Wert beim Start gelesen) und den Kommentar in vite.config.ts zum Kopieren der `.env`.
- Dass `sveltekit({ outDir, adapter({ out }) })` mit `BUILD_DIR` wirklich nach `.svelte-kit/persona` und `/tmp/persona-app` baut: nur aus dem Code gelesen. Der Persona-Stack ist wegen C-1 ohnehin betroffen.
- Dass die Paraglide-Middleware ohne `url`-Strategie (paraglide.config.ts:8) den Request unverändert weitergibt, sodass das entfernte `event.request = request` nichts ändert: nicht in der Paraglide-Quelle geprüft.

Geprüft: Kit landet bei den devDependencies und wird gebündelt (adapter-node 6: `noExternal: true`, extern bleiben nur `dependencies`). Der entfernte `cookie`-Override ist richtig (Kit 3 bringt `cookie@2.0.1`). typescript ^6 verlangt der Peer von Kit 3. Die Fallbacks auf `''` in src/env.ts verhalten sich mit allen `||`- und `===`-Lesern wie früher `undefined`. tests/mocks/app-env.ts und src/__tests__/helpers/app-state.svelte.ts sind in Ordnung. Der neue ActionDialog-Test wäre ohne b456ede rot. `redirect(..., { external: true })` braucht nur /auth/login. Die Umstellung von `$app/stores` auf `$app/state` ist mechanisch. csp, `$lib` und `BUILD_DIR` sind wie vorher übernommen.
