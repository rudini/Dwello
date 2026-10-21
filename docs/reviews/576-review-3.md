# Code-Review 576 (Konto mit Passwort), Runde 3

Gegenstand: `git diff 41fb5d9 eb133d5 -- . ':!docs/reviews'`, Worktree `review-576-r3` (eb133d5).

## Status der offenen IDs aus Runde 2

| ID | Status |
|---|---|
| C-7 | offen (Minor, unverändert) |
| C-10 | offen (Minor, unverändert) |
| C-11 | erledigt: «Der fünfte Fehlversuch nennt die Sperre» (`authentication.feature:107-112`) meldet sich viermal falsch an, jeweils auf einer frisch geöffneten Seite. Danach prüft es den Hinweis des 5. Versuchs. `sees(loginHint)` fragt so lange nach (`expect.poll`), bis der Hinweis zum Text passt. Der Hinweis «stimmen nicht» vom 4. Versuch kann den Test also nicht grün machen. Auf dem Verhalten vor dem Fix (401 beim 5. Versuch) bleibt er bei «stimmen nicht» stehen und wird rot. Kein eigener Rotlauf nötig, weil der Backend-Test rot gesehen wurde (Workflow 2) |
| C-12 | offen (Minor, unverändert) |
| C-13 | offen (Minor, unverändert) |
| C-14 | erledigt: `it.each` über leere E-Mail, E-Mail nur aus Leerzeichen und leeres Passwort (`password-login.test.ts:129-144`). Ohne die Prüfung in `password-login.ts:35` würde `fetch` aufgerufen und mit dem Konto antworten. Dann wäre `calls` nicht leer und das Ergebnis kein 400. Der Test wäre also rot |
| C-15 | erledigt: Schritt «steht das falsche Passwort nicht mehr da» (`authentication.feature:90`, `authentication.steps.ts:126`) |

## Neue Befunde

Keine.

## Nicht bestätigt

- Tests nicht wiederholt: `bunx vitest run src/__tests__/password-login.test.ts` bricht im Worktree mit `ERR_MODULE_NOT_FOUND` ab, weil `node_modules` fehlen. Vom Aufrufer gemeldet: `password-login.test.ts` (18 grün), E2E chromium `-g "Fehlversuch|falschem Passwort"` (3 grün), lint und check sauber auf db02df8.

Geprüft: der Sitzungseintrag in `docs/archive/implementation-plan-verlauf.md` stimmt mit den Berichten überein. Er nennt die Runden 1–3, die erledigten Majors C-1 bis C-4 und C-11 und die offenen Minors C-7, C-10, C-12 und C-13. `implementation_plan.md` ist nicht geändert. Die Schritte halten die Screenplay-Schichten ein, und der Text der Feature-Datei nennt keine Elemente der Oberfläche.
