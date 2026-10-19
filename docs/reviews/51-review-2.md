# Slice-Review #51, Runde 2 und Schlussrunde (849cb84a auf 4c99d349)

Anforderung: Issue #51 mit dem Entscheid vom 2026-10-19 sowie die Antworten auf Runde 1 (`docs/reviews/51-review-1.md`) und auf Helga P-1 (`docs/design/personas/helga-51.md`). Gelesen habe ich alle 9 geänderten Dateien des Deltas, ohne `docs/reviews` und `implementation_plan.md`. Dazu kamen `tests/e2e/questions/authentication.ts`, `docker-compose.prod.yml`, `docs/design/offene-punkte.md` (Abschnitte und vergebene IDs), Issue #82 mit seinen Kommentaren und Issue #51 mit seinen Kommentaren.

## Status der offenen IDs

| ID | Schwere (R1) | Status | Beleg |
|----|--------------|--------|-------|
| C-1 | Minor | behoben | `oauth.ts:193` `profile.verified_email === true`. Der neue Test «zählt eine Adresse ohne Angabe von Google als nicht bestätigt» (`oauth.test.ts:181`) wäre ohne die Änderung rot, weil `undefined` nicht `toBe(false)` erfüllt. |
| C-2 | Minor | behoben | `/auth/me/+server.ts:43` antwortet auf `!isAllowed(payload)` mit `JWTError` 401, also im selben Format wie bei einer abgelaufenen Sitzung. Der Test `auth-routes.test.ts:331` wäre ohne die Änderung rot, weil die Route dann 200 liefert. Der Test «should return user info for valid session» zeigt weiterhin, dass ein erlaubtes Konto durchkommt. |
| C-3 | Minor | behoben | Der README-Satz (Zeile 287) beschränkt die Aussage jetzt auf die App und nennt die Lücke beim Backend. O-39 steht unter «Operations and security». Die ID ist frei, denn O-36 bis O-38 wurden im Archiv vergeben. Der Text verweist auf O-3. Port 3001 ist in `docker-compose.prod.yml:57` veröffentlicht. |
| C-4 | Nit | bleibt (gewollt) | Bleibt unverändert. Nach dem Fix von P-1 gibt es auch keinen Kreislauf mehr, weil eine neue Anmeldung das Cookie überschreibt. |
| C-5 | Nit | behoben | `auth-routes.test.ts:314` und `:475` haben jetzt ein Semikolon und eine Leerzeile. |
| C-6 | Nit | bleibt (gewollt) | Bleibt unverändert. |
| Helga P-1 | Major | behoben | `oauth.ts:121` setzt nur für Google `prompt=select_account`. Damit zeigt Google bei jeder Anmeldung die Kontoauswahl, und ein abgewiesenes Konto wird nicht still erneut angemeldet. Das neue Szenario «Bei Google das Konto wählen» ist ohne `@wip` und wäre ohne die Änderung rot, weil die Question dann `null` liefert. Der Unit-Test in `oauth.test.ts:63` deckt das ebenfalls ab. |

Kein Widerspruch zu #82: Laut «Decided» schliesst #82 nur `access_type=offline` und `prompt=consent` aus, also dauerhaften Zugriff mit Refresh-Token. `select_account` fordert keine Einwilligung und kein Token an. Die Datenschutzseite erwähnt die Parameter nach #82 nicht, deshalb ändert sich dort kein Text. In der E2E-Prüfung fehlt im Szenario zu #82 jetzt die Prüfung `prompt` = null. Die Strenge bleibt trotzdem erhalten: Das neue Szenario verlangt genau `select_account` und schliesst damit auch eine Kombination wie `select_account consent` aus. Der Unit-Test prüft zusätzlich `not.toContain('consent')`.

## Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Keine Blocker und keine Majors.

Weitere Prüfungen am Delta:
- Ponytail: Das Delta besteht aus je einer Zeile für Fix, Prüfung und Kommentar und lässt nichts Ungenutztes zurück.
- Keine neuen UI-Texte, kein neuer Bildschirm und kein neuer Zustand. `messages/*.json`, `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature` müssen deshalb nicht angepasst werden.
- E2E-Schicht: Der neue Schritt ruft nur die bestehende Question `googleSignInParameter` auf. Die Question liefert den Wert selbst, nicht ja/nein. Die Feature-Sprache beschreibt, was gewollt ist («lässt … das Konto wählen»), nicht wie.
- Commit-Betreff `fix(auth): let Google choose the account`: 41 Zeichen, Typ und Scope sind gültig.
- Keine fachfremden Änderungen.

## Nicht bestätigt

- Vom Aufrufer gemeldet und nicht nachgefahren: `bun run lint` (0), `bun run check` (0 Fehler), `bunx vitest run tests/unit src/__tests__/hooks.server.test.ts` (201 passed), E2E Chromium `--grep "@authentication"` (11 passed). Der E2E-Lauf fand laut Aufrufer vor dem Fix von C-2 statt. Kein E2E-Pfad ruft `/auth/me` auf; das habe ich wie in Runde 1 per grep geprüft. Ich konnte nichts selbst laufen lassen: `node_modules` im Worktree verweist auf `/home/user/Dwello/node_modules`, und der Zugriff darauf wird verweigert.
- Die Rot-Läufe des neuen Szenarios und der beiden neuen Unit-Tests meldet der Aufrufer. Ich habe sie nur durch Lesen beurteilt; alle drei wären ohne die Änderung rot.
- Ob Google mit `prompt=select_account` die Kontoauswahl tatsächlich auch dann zeigt, wenn nur ein Konto angemeldet ist, habe ich nicht am echten Google geprüft. Das ist das dokumentierte Verhalten des Parameters; im Persona- und E2E-Stack lässt es sich nicht prüfen (Helga, «Nicht geprüft»).
- Prettier-Sauberkeit der eigenen Zeilen in `auth-routes.test.ts` und `oauth.test.ts`: nur durch Lesen geprüft, denn `bunx prettier` braucht `node_modules`.
- Helga P-2 und P-3 (Minor) liegen ausserhalb dieses Deltas und bleiben in ihrem Bericht. Für P-3 braucht es einen Entscheid des Product Owners zum Wortlaut.
