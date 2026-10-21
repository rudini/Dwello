# Fachreview #576, Runde 2 (Umsetzung)

Gegenstand: `git diff 9dfdaf1 24e91d7` (Texte, Szenarien, Glossar, Login- und Datenschutzseite, Anleitung, Marketing). Zum Abgleich mit dem Verhalten gelesen: `backend/src/services/local-account.service.ts`, `src/lib/server/password-login.ts`, `src/lib/server/login-flow.ts`, `src/routes/auth/{callback,refresh,logout}/+server.ts`. Worktree `review-576-fach2` (24e91d7). Mietrecht ist nicht betroffen.

## Status der offenen IDs aus Runde 1

| ID | Status |
|---|---|
| R-1 | erledigt (de/fr/it/en, `login-view.test.ts:84`) |
| R-2 | erledigt (Aufteilung in `privacy/+page.svelte:108–123`, DOM-Test `privacy-page.dom.test.ts:469`) |
| V-1 | erledigt (Szenario; `password-login.test.ts:105`) |
| V-2 | erledigt (vier Sprachen, `login-view.test.ts:51`) |
| R-3 | erledigt |
| R-4 | teilweise, siehe R-9 |
| R-5 | erledigt (Entscheid #576; das Backend protokolliert ohne IP, `local-account.service.ts:59,77,81,89`) |
| R-6 | erledigt (vier Sprachen, privacy.feature) |
| R-7 | erledigt für `privacy_cookies_5`, Rest siehe R-10 |
| V-3 | erledigt |
| V-4 | erledigt |
| V-5 | erledigt (`password-login.ts:26`, Test `password-login.test.ts:93`) |
| V-6 | erledigt (Entscheid #576, `local-account.pg.test.ts:87`) |
| V-7 | erledigt |
| V-8 | erledigt |
| V-9 | erledigt (zwei Zeilen im Glossar und in `i18n-begriffe.md`) |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-8 | Rechtstexte | Minor | `privacy_login_log` sagt «Jede Anmeldung … wird im Protokoll des Servers festgehalten, mit der Kennung des Kontos und … der E-Mail-Adresse». Eine erfolgreiche Anmeldung mit Passwort schreibt aber keine Zeile ins Protokoll des Servers: `password-login.ts:44–49` ruft nur `recordLogin` auf (Protokoll unter «Einstellungen»). Der OAuth-Weg protokolliert dagegen `login_complete` mit `userId` und `email` (`auth/callback/+server.ts:64`). Das Glossar («Protokoll des Servers») sagt dasselbe wie der Text. Korrektur: Im Passwort-Weg die gleiche Zeile schreiben (`logOAuthEvent('login_complete', 'local', { userId: account.sub, email: account.email })` oder ein eigenes Ereignis) und mit einem Unit-Test festhalten. Den Text nicht ändern. |
| R-9 | Rechtstexte | Minor | `privacy_login_local_1` sagt «eine allfällige Sperre, bis sie abläuft» (en «a lock until it ends», fr/it ebenso). `checkPassword` (`local-account.service.ts:62–82`) löscht `locked_until` und `failed_attempts = 5` beim Ablauf aber nicht. Beide bleiben bis zum nächsten Versuch oder zum Befehl gespeichert, also womöglich unbegrenzt. Art. 6 Abs. 4 DSG (Fedlex, SR 235.1): «Sie werden vernichtet oder anonymisiert, sobald sie zum Zweck der Bearbeitung nicht mehr erforderlich sind.» Korrektur am Text, der damit stimmt: «Dazu speichert Dwello die Zahl der Fehlversuche und das Ende einer allfälligen Sperre bis zur nächsten erfolgreichen Anmeldung.» Das in alle vier Sprachen übernehmen und den Test in `privacy-page.dom.test.ts` nachziehen. Die andere Möglichkeit: Beim Ablauf der Sperre beide Werte löschen. |
| R-10 | Rechtstexte | Minor | `privacy_cookies_3` («dwello_oauth_state» und «dwello_login») erscheint unbedingt (`privacy/+page.svelte:146`). In einer Installation nur mit Passwort setzt Dwello diese Cookies nie (`password-login.ts:47–48` setzt nur Sitzung und XSRF). Korrektur: Den Absatz nur mit `data.providers.length` zeigen, oder ihn mit «Bei der Anmeldung über einen Anbieter …» beginnen. |
| V-10 | Verwalter | Minor | Die Glossarzeile **Protokoll des Servers** (UBIQUITOUS_LANGUAGE.md:247) nennt nur Anmeldungen, Verlängerungen, Abmeldungen und Fehler. Die Fehlversuche mit Passwort und die Sperren mit eingetippter E-Mail-Adresse nennt sie nicht, obwohl die Zeile **Sperre (Anmeldung)** und `privacy_login_local_log` das sagen. Der Product Owner hat diese Zeile nicht freigegeben, deshalb Issue (Wortlaut unten). |

## Fehlende Begriffe (Issue `fachlich`, `entscheiden`)

- **Protokoll des Servers**, neuer Wortlaut: «Aufzeichnung des Servers über Anmeldungen, Verlängerungen der Sitzung und Abmeldungen, mit Kennung des Kontos und E-Mail-Adresse, über Fehlversuche und Sperren der Anmeldung mit Passwort, mit der eingetippten E-Mail-Adresse und ohne IP-Adresse, sowie über Fehler; nur der Betreiber liest es, er bestimmt die Aufbewahrung. Nicht zu verwechseln mit dem Protokoll unter «Einstellungen».»

## Nicht bestätigt

- Ob `insecureConnection` (`password-login.ts:23`) hinter einem Reverse-Proxy mit HTTPS fälschlich warnt, wenn `ORIGIN` bzw. `PROTOCOL_HEADER` nicht gesetzt ist. Das ist Umsetzung, keine Fachprüfung, und `docs/installation.md` Abschnitt 7 nennt keine der beiden Variablen. Gehört zum `code-reviewer`.
- `PUT /api/v1/local-accounts` (`backend/src/routes/local-accounts.ts:36`) erlaubt jeder Sitzung, weitere Konten mit Passwort anzulegen. Der Entscheid in #576 geht von «one account per installation» aus. Ob das für mehr als den E2E-Stack erreichbar ist, habe ich nicht geprüft. Gehört zum `code-reviewer`.
- Die Uhrzeit der Sperre in en lautet je nach Locale «02:05 PM» (`hour: '2-digit'`). Ob die Persona das so liest, habe ich nicht geprüft.

Geprüft: fr/it/en aller neuen und geänderten Schlüssel gegen `i18n-begriffe.md` (Betreiber, Protokoll des Servers, Konto mit Passwort, Sperre); Sie-Form und ss in de; die Glossarzeilen gegen den Entscheid in #576; Verhalten bei unbekannter Adresse, Sperre (5 Versuche/15 Minuten, die Zählung beginnt nach dem Ablauf neu), Befehl zum Zurücksetzen und Ende der Sitzungen, abgeglichen mit `local-account.service.ts` und `local-account.pg.test.ts`; README, `docs/installation.md` und Marketing (de/fr/it/en) passen zu Passwort als Standard und Google als Option; im Protokoll des Servers keine IP-Adresse (`logger`-Aufrufe in BFF und Backend).
