# Code-Review #1434 (abgelehnte Abmeldung), Runde 1

Bereich: `git diff 42aea777 7d402f35` (Commits 224b5b9e, 7d402f35), Worktree `review-logout-refused-code`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | docs/api-specification.md:381, :390 | Die API-Spezifikation sagt nach dem Diff Falsches: Zeile 381 «Clears the auth cookies (also without a valid XSRF token). → `{ success: true }`», obwohl `/auth/logout` jetzt ohne gültiges Token 403 `XSRF_ERROR` antwortet und die Cookies stehen lässt; Zeile 390 «`dwello_xsrf` … `maxAge` = `JWT_EXPIRY`», obwohl `src/hooks.server.ts:57-61` das Cookie beim Laden einer Seite mit der Restlaufzeit der Sitzung neu setzt. |

Keine Blocker, keine Majors.

Geprüft: Logout-Route (403 `XSRF_ERROR`, Sitzung bleibt; Unit-Test mit echtem `validateXsrfToken`/`clearAuthCookies` wäre auf der Basis mit 200 rot), Header (403 → Menü zu, Fokus auf den Menüknopf, `Alert tone="critical"` mit `role="alert"`, kein `goto`; DOM-Test rot ohne Änderung), Hook (neues XSRF-Cookie nur mit gültiger, erlaubter Sitzung und nur ohne vorhandenes Cookie, `maxAge` = `exp` − jetzt, also Ende mit der Sitzung wie die Datenschutzerklärung sagt; beide Tests rot ohne Änderung bzw. ohne Guard; kein CSRF-Gewinn für Fremdseiten, da der Header-Token fehlt und das Cookie nicht lesbar ist), Text in allen vier `messages/*.json` (Sie/Lei-Form, Begriffe wie `header_logout`), `screens.json` mit `stateMeanings`, `accessibility.feature`, `sprachen-bildschirme.feature`, beide neuen Szenarien ohne `@wip` (das zweite zeigt auch, dass die Sitzung nach der Ablehnung besteht), Screenplay-Schichten (Steps rufen nur Tasks/Questions; `Cookies.loseXsrf` als Interaction; `refusedSignOut` wartet auf den Fehler), keine Änderung bestehender Szenarien oder Step-Definitionen, nur nötige Test-Anpassungen (`cookies.set` in Hook-Fakes), keine fremden Änderungen; ponytail-review: nichts Unbenutztes, keine Kopie eines Helfers (`setXsrfToken` wiederverwendet).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main --structure`, `cd backend && bun run type-check`, `bunx vitest run --changed origin/main` (994 grün), `tests/unit/a11y-screens.test.ts`, `src/__tests__/open-work.test.ts`, E2E Chromium (`authentication.feature` mit beiden neuen Szenarien, `navigation.feature`, `privacy.feature`, Abmelde-Szenarien aus Vertrag und Sprachen, axe- und Sprachzeile «dashboard logout-refused») sowie die gemeldeten Rot-Läufe.
- Firefox/WebKit: laut Aufrufer in der Sandbox nicht installiert; ob `Cookies.loseXsrf` (`clearCookies({ name })`) und die Szenarien dort grün laufen, ist offen.
- Dass SvelteKit ein in `handle` gesetztes Cookie auch an die 303-Antworten von `redirectTo` (`/login` → `/dashboard`, `/backup`) hängt, habe ich nur aus dem Framework-Verhalten abgeleitet, nicht im Code von `@sveltejs/kit` gelesen (kein `node_modules`); für die Seitenladung der Szenarien (200-Antwort) ist es durch das zweite Szenario belegt.
