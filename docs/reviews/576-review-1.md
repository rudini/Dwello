# Code-Review 576 (Konto mit Passwort), Runde 1

Gegenstand: `git diff fef00fd 24e91d7 -- . ':!docs/reviews'`, Worktree `review-576-code` (24e91d7).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | backend/src/services/local-account.service.ts:69-76 | Laufende Fehlversuche heben eine eben gesetzte Sperre wieder auf: das UPDATE setzt bei `locked_until IS NOT NULL` den Zähler auf 1 und `locked_until` auf NULL, auch wenn die Sperre noch gilt |
| C-2 | Major | src/routes/auth/refresh/+server.ts:36-53 | `/auth/refresh` stellt für eine Sitzung mit `provider: 'local'` ein neues JWT mit neuem `iat` aus, ohne beim Backend zu fragen. Eine Sitzung von vor dem Zurücksetzen überlebt dadurch («the old sessions end» gilt nicht) |
| C-3 | Major | src/lib/server/password-login.ts:23-24, docker-compose.prod.yml:30 | In der Produktion fehlt `ORIGIN`. adapter-node nimmt dann `https` an, also ist `url.protocol` nie `http:`: der Hinweis zur unverschlüsselten Verbindung erscheint nie, und die Formularaktion `?/password` scheitert über http an der Origin-Prüfung von SvelteKit |
| C-4 | Major | tests/a11y/screens.json:98-100, routes/login/+page.svelte:38-42 | Der neue Zustand `login-insecure` fehlt in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. Er hat weder ein Szenario noch einen Vermerk `No scenario: <Grund>` |
| C-5 | Minor | messages/*.json `privacy_login_log`; src/lib/server/password-login.ts:44-49 | Laut Text kommt «jede Anmeldung» mit Kennung und E-Mail-Adresse ins Protokoll des Servers. Eine gelungene Anmeldung mit Passwort protokolliert aber weder das BFF noch das Backend (nur OAuth: `logOAuthEvent('login_complete')`, auth/callback/+server.ts:64). Der Rechtstext sagt damit etwas Falsches |
| C-6 | Minor | tests/e2e/tasks/accessibility.ts:197-202; tests/e2e/tasks/authentication.ts:31-32 | Zustand `login-locked`: `Wait.until(on.loginError)` ist schon durch den Hinweis des 5. Fehlversuchs erfüllt. axe und die Sprachprüfung können also die Meldung «falsches Passwort» prüfen statt der Sperre. `signInWithPassword` wartet auf keinen Folgezustand |
| C-7 | Minor | backend/scripts/account.ts:13-14 | `prompt()` zeigt das Passwort beim Eintippen im Terminal an (es bleibt im Scrollback) |
| C-8 | Minor | backend/scripts/account.ts:9, backend/src/routes/local-accounts.ts:18, backend/src/middleware/auth.ts:18 | Der Befehl prüft nur auf «@», PUT nur auf `minLength: 1`. Ein Konto wie `verwalter@homeserver` oder `jürg@example.ch` lässt sich deshalb anlegen und meldet sich auch an. `JwtPayloadSchema` (`z.string().email()`) lehnt aber jede seiner Sitzungen ab. Nachgeprüft mit zod 3.25: `verwalter@homeserver`, `admin@localhost` und `jürg@example.ch` ergeben `false`. Folge: Anmeldung, danach sofort 401 |
| C-9 | Minor | backend/src/services/local-account.service.ts:58,77,80,89 | Entschieden ist: Fehlversuche und Sperren kommen mit der eingetippten E-Mail-Adresse und ohne IP-Adresse ins Protokoll. Kein Test hält das fest |
| C-10 | Minor | backend/scripts/account.ts | «Done means» verlangt Tests auf unterer Ebene für den Befehl zum Zurücksetzen. Getestet ist nur `setLocalAccount` über PUT. Die eigenen Zweige des Skripts (Adresse fehlt, Passwörter verschieden, «Nichts wurde geändert», Exit-Code) hat kein Test |

## C-1: Parallele Fehlversuche heben die Sperre auf

`checkPassword` liest die Zeile zuerst, prüft danach das Passwort (Argon2, langsam) und zählt erst dann:

```ts
failedAttempts: sql`CASE WHEN ${localAccounts.lockedUntil} IS NOT NULL THEN 1 ELSE ${localAccounts.failedAttempts} + 1 END`,
lockedUntil: null
```

Gedacht ist der Zweig `IS NOT NULL` für eine abgelaufene Sperre. Er greift aber auch bei Anfragen, die die Zeile vor dem Setzen der Sperre gelesen haben und erst danach zählen. Ein Angreifer mit z. B. 10 gleichzeitigen Anfragen kommt so voran:

1. Der 5. Fehlversuch setzt `locked_until`.
2. Die übrigen Anfragen, die schon laufen, setzen den Zähler auf 1 zurück und `locked_until` auf NULL.
3. Neue Anfragen lesen die Zeile wieder ungesperrt.

Die Grenze von 5 Versuchen in 15 Minuten wirkt dadurch kaum noch; begrenzt ist nur noch, wie viele Argon2-Prüfungen der Server schafft. Der Aufrufer hat eigens nach einer atomaren Zählung gefragt. Das Zählen ist zwar atomar, das Sperren aber nicht.

So zeigt man es: in `local-account.pg.test.ts` 10 Aufrufe `signIn(email, 'falsch')` mit `Promise.all` gleichzeitig senden, danach `signIn(email, 'richtiges-Passwort')`. Erwartet ist 423, meist kommt 200. Ob der Test rot wird, hängt von der Reihenfolge ab; bei 10 oder mehr Anfragen ist das sehr wahrscheinlich.

Korrektur: ein einziges UPDATE, das zählt und sperrt. Es setzt den Zähler nur zurück, wenn `locked_until <= now()` gilt, und lässt eine laufende Sperre stehen (`WHERE locked_until IS NULL OR locked_until <= now()`; ohne Treffer: gesperrt). `locked_until` setzt es im selben Statement, sobald der neue Zähler 5 erreicht.

## C-2: Eine Sitzung von vor dem Zurücksetzen überlebt über `/auth/refresh`

`localSessionHolds` (Middleware) lehnt ein JWT ab, dessen `iat` vor `password_changed_at` liegt. `/auth/refresh` prüft das JWT aber nur lokal (`verifyJwt`, `isAllowed` gibt bei `local` immer true zurück) und stellt dann mit `generateJwt` ein neues JWT mit dem aktuellen `iat` aus. Das Backend nimmt dieses neue JWT an.

Zwei Wege führen dahin:

- `+layout.svelte:29-36` ruft den Refresh alle 50 Minuten auf. Ein Tab, der vor dem Zurücksetzen offen war, bekommt so ein neues gültiges JWT, bevor er das Backend fragt.
- Wer ein gestohlenes Cookie hat (Session und `dwello_xsrf`), kann `POST /auth/refresh` selbst aufrufen.

Das Zurücksetzen beendet die alten Sitzungen also nicht. Genau das ist der Zweck des Befehls (Glossar, README, Installationsanleitung, Ausgabe von `account.ts`).

So zeigt man es: Sitzung ausstellen, `PUT /api/v1/local-accounts` mit neuem Passwort, dann `POST /auth/refresh` mit dem alten Cookie. Es kommt 200 mit neuem Cookie zurück, und mit diesem Cookie antwortet `/api/v1/buildings` mit 200. Ein Unit-Test für `refresh/+server.ts` mit einem Backend, das das alte Token mit 401 ablehnt, wird heute nicht rot, weil der Refresh das Backend gar nicht fragt.

Korrektur: Bei `provider === 'local'` fragt der Refresh vorher das Backend mit dem alten Token und lehnt bei 401 ab. Alternativ übernimmt er das ursprüngliche `iat` bzw. einen Claim mit dem Zeitpunkt der Anmeldung, und die Middleware prüft diesen.

## C-3: Der Hinweis zu http und die Anmeldung über http in der Produktion

`node_modules/@sveltejs/adapter-node/files/handler.js:208-211` (`get_origin`): Ohne `ORIGIN` und ohne `PROTOCOL_HEADER` ist das Protokoll `'https'`. `docker-compose.prod.yml` setzt für das Frontend kein `ORIGIN`, das Dockerfile auch nicht. Nur Playwright und `persona-stack.sh` setzen es. Folgen in einer Installation nach `docs/installation.md`:

- `insecureConnection(url)` bekommt `https://homeserver.local:3000/login` und gibt immer `false` zurück. Der verlangte Hinweis («Over plain http:// … the sign-in page says that the connection is not encrypted») erscheint nie. Der Unit-Test (`password-login.test.ts:55-64`) baut die URL selbst und sieht das nicht.
- Beim POST auf `?/password` sendet der Browser `Origin: http://…`, `url.origin` ist aber `https://…`. `csrf.checkOrigin` (svelte.config.js:17-19) lehnt mit 403 ab, und die neue Standard-Anmeldung über http scheitert. Für die anderen Formulare war das schon vorher so; neu ist, dass jetzt die Anmeldung selbst ein Formular ist. Mit Google gab es keinen POST.
- Für «sign-in works over http:// on a home server» braucht es zudem `COOKIE_SECURE=false` und `COOKIE_DOMAIN=<Host>`. `docker-compose.prod.yml:37-38` setzt standardmässig `true` und `localhost`. `docs/installation.md` Abschnitt 7 nennt für http/VPN keine dieser Einstellungen.

So zeigt man es: das gebaute Frontend ohne `ORIGIN` starten und `http://<LAN-IP>:3000/login` öffnen; `data-testid="login-insecure"` fehlt. `curl -X POST -H 'Origin: http://<LAN-IP>:3000' -F email=a@b.ch -F password=x 'http://<LAN-IP>:3000/login?/password'` ergibt 403.

Korrektur: `ORIGIN=${PUBLIC_APP_URL:-http://localhost:3000}` für das Frontend in `docker-compose.prod.yml`, mit einem Test in `compose-prod.test.ts`. In der Installationsanleitung die Werte für http im Heimnetz ergänzen: `PUBLIC_APP_URL`, `COOKIE_DOMAIN`, `COOKIE_SECURE=false`.

## C-4: `login-insecure` ohne Prüfung auf Barrierefreiheit und Sprachen und ohne Szenario

Der Hinweis ist ein neuer Zustand der Anmeldeseite (Alert `caution`, zwei neue Texte). CLAUDE.md («Design-Regeln», «Process») verlangt ihn in `screens.json` mit Bedeutung, in `accessibility.feature` und in `sprachen-bildschirme.feature`. «Done means» von #576 zählt ihn als Verhalten auf. Er hat kein Szenario, und kein Commit nennt `No scenario: <Grund>`. Der E2E-Stack kommt an diesen Zustand nicht heran (Playwright setzt `ORIGIN: http://localhost:3100`). Dann braucht es den Vermerk mit Grund und den Test auf unterer Ebene (`login-view.test.ts:82-88` gibt es). Ob die Zeile in `screens.json` trotzdem nötig ist, entscheidet der Aufrufer.

## Nicht bestätigt

- C-3 nicht ausgeführt (kein Build erlaubt). Belegt nur durch Lesen von `adapter-node/files/handler.js:208-211` im `node_modules` des Repos und durch das bekannte Verhalten von `csrf.checkOrigin`. Ob ein Reverse-Proxy beim Betreiber `ORIGIN` oder `PROTOCOL_HEADER` setzt, ist offen.
- C-1 nicht ausgeführt (keine pg-Tests gestartet). Hergeleitet aus der Abfolge Lesen → Argon2 → UPDATE.
- Vom Aufrufer gemeldet, nicht wiederholt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (3535 grün), Backend `bun run test` (1255 grün, 1 rot O-45), E2E chromium (authentication, privacy, settings, sprachen, demo, axe- und Sprachzeilen von login inkl. login-password, login-password-error, login-locked), `python3 marketing/i18n/build.py`, fallow audit.
- Ob `Bun.password.hash` (Standard: Argon2id, Speicher und Zeit) für bekannte und unbekannte Adressen gleich lange braucht, habe ich nicht gemessen. Gelesen: beide Wege machen genau ein `verify`, der bekannte zusätzlich ein UPDATE. Den Unterschied halte ich für unerheblich, zumal die Sperre ein Konto nach Entscheid ohnehin verrät.

Geprüft: Öffentliche Routen vor `authMiddleware`. `PUT/DELETE /local-accounts` nur mit Sitzung und ohne Proxy im BFF (`src/routes/api` hat keinen); ich teile die Einschätzung, dass das dieselben Rechte wie eine Sitzung sind. Weiter: Migration 0032, `schema.ts` und `data-model.md` stimmen überein; Verträge und `api-contracts.pg.test.ts`; `iat` gegenüber `password_changed_at` in Sekunden (eine Sitzung aus derselben Sekunde vor dem Zurücksetzen bleibt gültig, das ist vernachlässigbar). Formularaktion: 401 → 400, 423 mit Uhrzeit in Europe/Zurich, Fehler → 502, `safeTarget`, Cookies, `recordLogin`. `enhance` mit `type === 'error'`; Laden und SSR der Anmeldeseite; `ALLOWED_EMAILS` nur mit Anbieter; `.env.example` und `compose-prod.test.ts`. Texte in allen vier Sprachen, Begriffe nach `i18n-begriffe.md`, Codes `backend_*`, Glossarzeilen nach Entscheid #576, Marketing (#497 → #579). Die neuen Tests wären auf dem Basis-Commit rot (der Test für unbekannte Adressen ist als Festhalten des entschiedenen Verhaltens benannt). Screenplay-Schichten in steps/tasks/questions; ponytail ohne Befund.
