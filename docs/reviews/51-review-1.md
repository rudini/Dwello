# Slice-Review #51, Runde 1 (4c99d349 auf 53618b07)

Anforderung: Issue #51 (O-1) mit Entscheid vom 2026-10-19 (`ALLOWED_EMAILS=*` für die öffentliche Demo). Gelesen wurden alle 31 geänderten Dateien sowie `src/routes/auth/{me,logout,login}`, `src/lib/server/auth.ts`, `error-handler.ts`, `login/+page.server.ts`, `Dockerfile`, `deploy/demo/docker-compose.yml` und `tests/e2e/fixtures/test.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `src/lib/server/oauth.ts:190`, `src/lib/server/allowed-emails.ts:275` | Fehlt `verified_email` im Google-Profil, ist `emailVerified` `undefined`. Der Standardwert `emailVerified = true` in `isAllowed` lässt die Adresse dann als bestätigt durch (fail-open). Das widerspricht «only addresses Google reports as verified». Die v2-Userinfo liefert das Feld beim Scope `email` immer, darum ist das Risiko nur latent. Vorschlag: `emailVerified: profile.verified_email === true` mit einem Test «Profil ohne verified_email». |
| C-2 | Minor | `src/routes/auth/me/+server.ts:21-47`, `src/hooks.server.ts:12` | `/auth/*` ist öffentlich. `/auth/me` prüft kein `isAllowed` und antwortet einer abgewiesenen Sitzung mit 200 und ihren Benutzerdaten. Die Sitzung gilt dort also nicht als abgemeldet. Die App ruft `/auth/me` nirgends auf (nur in `tests/unit/auth-routes.test.ts`). Es werden nur die eigenen Daten des Kontos sichtbar, darum ist der Befund nicht blockierend. |
| C-3 | Minor | `README.md:287`, `docker-compose.prod.yml:56-57` | «An address removed from the list loses its open sessions at its next request» stimmt nur für den Weg über das BFF. `docker-compose.prod.yml` veröffentlicht das Backend auf 3001, und das Backend akzeptiert das noch gültige JWT bis zum Ablauf (`JWT_EXPIRY=7d`). Das Issue entscheidet ausdrücklich «BFF only», und die Lücke besteht schon vor dieser Änderung. Den README-Satz einschränken oder eine Zeile in `docs/design/offene-punkte.md` anlegen; ein Produktentscheid ist nicht nötig. |
| C-4 | Nit | `src/hooks.server.ts:50-52` | Das Session-Cookie einer abgewiesenen Sitzung bleibt bestehen. Jede Seite leitet erneut auf `/login?error=not_allowed` um, und `handleFetch` reicht das JWT bei öffentlichen Seiten weiter ans Backend. Funktional ist das unschädlich, weil eine neue Anmeldung das Cookie überschreibt. |
| C-5 | Nit | `tests/unit/auth-routes.test.ts:314`, `:455` | Die neuen Tests folgen auf `})` ohne Semikolon und ohne Leerzeile. Diese eigenen Zeilen sind nicht Prettier-sauber. |
| C-6 | Nit | `src/routes/auth/callback/+server.ts:49,58` | Das JWT wird vor der Prüfung mit `isAllowed` erzeugt und bei einer Abweisung verworfen. Die Prüfung könnte vor `generateJwt` stehen (ponytail). |

Keine Blocker und keine Majors.

## Bestätigt (Code und Test)

- Die Liste wird getrennt und ohne Rücksicht auf Leerzeichen und Grossschreibung verglichen. `*` und eine fehlende Liste lassen jedes Konto zu. Microsoft und unbestätigte Google-Adressen werden mit gesetzter Liste abgewiesen. Belege: `allowed-emails.ts`, `tests/unit/allowed-emails.test.ts`; der Test schlägt ohne Modul fehl.
- `fetchUserProfile` liefert `emailVerified` (`tests/unit/oauth.test.ts`; `toBe(true)` schlägt ohne die Änderung fehl). `generateJwt` übernimmt nur sub, email, name und provider, `emailVerified` gelangt also nicht ins JWT.
- Callback: Ein Konto ohne Zugang erhält keine Sitzung, die Cookies werden geräumt, und die Umleitung geht auf `/login?error=not_allowed` (`auth-routes.test.ts:314`). Die Abweisung wird als `login_failed` mit `reason` und E-Mail protokolliert. Das entspricht dem bisherigen `login_complete`, das die E-Mail ebenfalls protokolliert, und dem Logging-Hinweis in `deploy/demo/docker-compose.yml`.
- `hooks.server.ts`: Eine Seite führt auf `/login?error=not_allowed`, die API antwortet mit 401, und ein erlaubtes Konto kommt durch (`src/__tests__/hooks.server.test.ts`). `/login` mit abgewiesener Sitzung zeigt die Anmeldeseite, weil `locals.user` leer ist. Das deckt das E2E-Szenario ab.
- `/auth/refresh` weist ab, und es wird kein neues JWT erzeugt (`auth-routes.test.ts:455`).
- Andere Stellen, die Sitzungen ausstellen: `generateJwt` und `setSessionCookie` werden nur in callback und refresh aufgerufen (grep über `src`). Beide prüfen jetzt. Ausnahme bei der Annahme von Sitzungen: `/auth/me` (C-2).
- `init`: Der Unit-Test zeigt die Abweisung in Produktion ohne Liste sowie den Start mit `*` und in der Entwicklung. Das `Dockerfile` setzt `NODE_ENV=production` (Zeilen 39 und 49), `docker-compose.prod.yml` ebenfalls (Zeile 21). Der E2E-Start mit `node build` ohne `NODE_ENV` löst die Prüfung nicht aus. Das ist unkritisch, weil beide Instanzen `ALLOWED_EMAILS` setzen.
- Demo: `deploy/demo/.env.example` setzt `ALLOWED_EMAILS=*`. `docker-compose.prod.yml` reicht `${ALLOWED_EMAILS:-}` an das Frontend durch. `deploy/demo/docker-compose.yml` ergänzt nur und überschreibt `environment` nicht. Der Aufruf mit `--env-file deploy/demo/.env` liefert die Variable für die Interpolation. `deploy/demo/README.md` nennt sie.
- E2E: `playwright.config.ts` setzt den Wert in `frontendEnv`, den laut Kommentar beide Instanzen übernehmen. `persona-stack.sh` setzt ihn, und `persona-kit.mjs` signiert für `verwalter@example.com`. Keine andere E2E-Sitzung nutzt eine andere Adresse oder Microsoft (grep `tests/e2e`).
- Szenario «Sitzung eines Kontos ohne Zugang»: ohne `@wip`, nach dem Muster von «Abgelaufene Sitzung». Die Schritte rufen nur Tasks und Questions auf (`holdSessionWithoutAccess`, `openPage`, `loginHint`). Die Question liefert den Text selbst. Die Feature-Sprache beschreibt fachlich, was geschieht, nicht wie. Ohne die Änderung schlägt das Szenario fehl, weil die Übersicht erscheint.
- Der Zustand `login-not-allowed` steht in `screens.json` (mit `stateMeanings`), `accessibility.feature`, `sprachen-bildschirme.feature` und `fixtures/screens.ts`; der Task wartet auf `on.loginError`.
- Texte: `login_error_not_allowed` steht wortgleich zum Issue in de, fr, it und en, Schweizer Schreibung ohne ß. `LOGIN_ERRORS.not_allowed` und `login/+page.server.ts` zeigen ihn über `Object.hasOwn`.
- Docs: `.env.example`, `docker-compose.prod.yml` und README, einschliesslich des Satzes zu `JWT_SECRET`, stehen im Diff. `implementation_plan.md` gehört zum Slice. Es gibt keine fachfremden Änderungen.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run tests/unit src/__tests__/hooks.server.test.ts src/__tests__/i18n.test.ts` (228 passed) und E2E Chromium `--grep "@authentication|login"` (20 passed) sind vom Aufrufer gemeldet und nicht nachgefahren. Im Review-Worktree fehlt `node_modules`, `bunx prettier` scheiterte dort an `prettier-plugin-svelte`.
- Die Rot-Läufe der neuen Tests und des Szenarios sind vom Aufrufer gemeldet. Ich habe sie nur durch Lesen beurteilt (siehe oben); alle wären ohne die Änderung rot.
- Ob SvelteKit 2.70.3 mit adapter-node 5.5.7 den `init`-Hook beim Start ausführt, also über das top-level `await server.init()` in `handler.js`, sodass ein Wurf den Prozess beendet, und ob Vite 6 `process.env.NODE_ENV` im SSR-Build stehen lässt, habe ich nicht im Quelltext geprüft. Der Zugriff auf `/home/user/Dwello/node_modules` wurde verweigert. Nach meinem Kenntnisstand trifft beides zu; einen Laufzeitbeweis gibt es nur durch einen Start des Docker-Images.
- Ob der echte Google-Endpunkt `oauth2/v2/userinfo` `verified_email` immer liefert (siehe C-1), ist nicht geprüft.
