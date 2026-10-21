# Code-Review 576 (Konto mit Passwort), Runde 2 (Schlussrunde vor dem Push)

Gegenstand: `git diff 24e91d7 db02df8 -- . ':!docs/reviews' ':!docs/design/personas'`, Worktree `review-576-close` (41fb5d9, Merge ohne Konflikte, nicht geprüft).

## Status der offenen IDs aus Runde 1

| ID | Status |
|---|---|
| C-1 | erledigt: ein UPDATE zählt und sperrt (`local-account.service.ts:76-86`). Eine laufende Sperre bleibt stehen (`CASE WHEN locked_until > at`). Unter READ COMMITTED wertet PostgreSQL ein wartendes UPDATE mit der neuen Zeile neu aus. Siehe aber C-13 zum Test |
| C-2 | erledigt: `auth_time` wird bei der Anmeldung gesetzt (`auth.ts:45`) und beim Verlängern übernommen (`refresh/+server.ts:53`). Die Middleware vergleicht ihn (`middleware/auth.ts:70`). Beide Tests wären auf 24e91d7 rot |
| C-3 | erledigt: `ORIGIN` in `docker-compose.prod.yml:32` mit Test, Abschnitt für das Heimnetz in `installation.md`. `COOKIE_SECURE=false` steht schon in `.env.example:109`, «keep» stimmt also |
| C-4 | erledigt durch den Vermerk `No scenario` (E2E-Stack mit `ORIGIN` localhost). Der Vermerk steht noch nicht im Pull Request, siehe «Nicht bestätigt» |
| C-5 (= R-8) | erledigt: `logOAuthEvent('login_complete', 'local', …)` mit Unit-Test |
| C-6 | erledigt: jeder Versuch auf einer frisch geöffneten Seite. Der 5. Versuch zeigt jetzt die Sperre, `Wait.until(loginError)` wartet also auf sie |
| C-7 | offen (Minor, unverändert) |
| C-8 | erledigt für den Befehl und `setLocalAccount`. Neuer Nebeneffekt bei PUT, siehe C-12 |
| C-9 | erledigt (`local-account.pg.test.ts`, Protokolltest) |
| C-10 | offen (Minor, unverändert) |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-11 | Major | tests/e2e/features/authentication.feature:99-105; tests/e2e/tasks/authentication.ts:35-39 | Für Benutzer sichtbar ändert sich: Der 5. Fehlversuch meldet jetzt die Sperre statt «stimmen nicht» (Persona Dr. Weber P-1). Kein Szenario prüft das. «Nach fünf Fehlversuchen …» prüft erst den 6. Versuch. `failSignIns` wartet nur auf irgendeinen Hinweis |
| C-12 | Minor | backend/src/services/local-account.service.ts:27; backend/src/routes/local-accounts.ts:12-15 | `setLocalAccount` wirft bei einer unbrauchbaren Adresse ein einfaches `Error`. `refused` wirft es weiter, `PUT /api/v1/local-accounts` antwortet also mit 500 statt 400 mit Code. `api-specification.md:231` nennt diesen Fall nicht, und kein Test prüft ihn über PUT |
| C-13 | Minor | backend/src/__tests__/local-account.pg.test.ts:141-148 | «hält die Sperre auch bei vielen gleichzeitigen Fehlversuchen» wird auf 24e91d7 nur rot, wenn ein UPDATE erst nach dem zweiten UPDATE (dem Sperren) des 5. Versuchs ankommt. Bei 7 Anfragen, deren Argon2-Prüfungen im Threadpool fast gleichzeitig enden, ist das nicht sicher. Der Test belegt den Fehler von C-1 also nicht verlässlich |
| C-14 | Minor | src/lib/server/password-login.ts:34-35; src/__tests__/password-login.test.ts | Leere Felder melden «stimmen nicht», ohne das Backend zu fragen. Das hält nur E2E fest. Kein Unit-Test prüft es, auch nicht die Fälle «nur Passwort leer» und «E-Mail nur aus Leerzeichen». Auch dass kein Aufruf an das Backend geht (also kein gezählter Fehlversuch), prüft keiner |
| C-15 | Minor | tests/e2e/features/authentication.feature:90 | «Und ist das Feld "Passwort" leer» beschreibt die Oberfläche statt das Anliegen (`tests/e2e/CLAUDE.md`: kein «Feld»). Etwa: «Und ist das falsche Passwort nicht mehr eingetragen» |

## C-11: Der 5. Fehlversuch meldet die Sperre, ohne Szenario

Bis 24e91d7 antwortete der 5. Fehlversuch mit 401 («E-Mail-Adresse oder Passwort stimmen nicht»). Erst der nächste Versuch meldete die Sperre. Jetzt wirft `checkPassword` beim sperrenden Versuch sofort `ACCOUNT_LOCKED` (`local-account.service.ts:89-92`), und die Anmeldeseite zeigt «Nach mehreren Fehlversuchen ist die Anmeldung gesperrt bis …». Das ist eine Änderung, die der Verwalter sieht, und die Behebung eines Befunds einer Persona. CLAUDE.md, Workflow 1, verlangt dafür ein Szenario.

Das Szenario «Nach fünf Fehlversuchen ist die Anmeldung gesperrt» (Zeile 99-105) bleibt auf dem Basis-Commit grün: Es meldet sich zuerst fünfmal falsch an (`failSignIns`, wartet auf einen beliebigen `loginError`) und prüft danach den Hinweis des 6. Versuchs. Auch der Zustand `login-locked` in `accessibility.ts` stellt keine Frage nach dem Text. Belegt ist das neue Verhalten nur im Backend (`nennt die Sperre schon beim 5. Fehlversuch`).

So zeigt man es: Das Szenario auf 24e91d7 laufen lassen. Es ist grün.

Korrektur: Das Szenario so umbauen, dass es den 5. Versuch prüft. Etwa: «Angenommen der Besucher hat sich viermal mit einem falschen Passwort angemeldet / Wenn der Besucher sich mit einem falschen Passwort anmeldet / Dann sieht der Besucher einen Hinweis, der mit "… gesperrt bis" beginnt». Zur Wirkung der Sperre auf das richtige Passwort kommt ein eigener Schritt oder ein eigenes Szenario dazu.

## Nicht bestätigt

- Tests nicht wiederholt: `bunx vitest run` war nicht möglich, weil `node_modules` des Worktrees auf `/home/user/Dwello/node_modules` zeigt und dort das Lesen verboten ist. Vom Aufrufer gemeldet: lint, check, Backend type-check, `bunx vitest run` (3540 grün), Backend `bun run test` (1263 grün, Coverage-Grenze erreicht), E2E chromium `-g "Anmeld|Passwort|Datenschutz|login|Abmelden|Sitzung"` (84 grün, die neuen Schritte zuvor rot).
- C-13 nicht ausgeführt (keine pg-Tests auf dem Basis-Commit gestartet). Hergeleitet aus der Abfolge «Lesen → Argon2 → UPDATE → zweites UPDATE» in 24e91d7.
- Der Vermerk `No scenario: <Grund>` zu C-4 steht laut Aufrufer erst im Pull Request. Im Commit db02df8 steht er nicht.
- Ob das Leeren des Passworts nur im DOM (der Zustand von `TextInput` mit `bind:value` behält den alten Wert) später einen Unterschied macht, habe ich nur gelesen: Die nächste Eingabe überschreibt den Zustand, ein Re-Render ohne Eingabe setzt den Wert nicht neu.

Geprüft: SQL von C-1 (abgelaufene Sperre beginnt mit 1, `NULL <= at` fällt in den ELSE-Zweig), Präzision von `until` beim Vergleich, `auth_time` für OAuth-Sitzungen und alte Sitzungen ohne den Claim, Texte R-9 in allen vier Sprachen, R-10 mit DOM-Test, Fokus über `focusFirstError` (der kritische Hinweis steht vor `login-insecure`, und nur er hat `role="alert"`), Screenplay-Schichten der neuen Schritte und Fragen, Rot der neuen Unit-, DOM- und pg-Tests (ausser C-13) durch Lesen.
