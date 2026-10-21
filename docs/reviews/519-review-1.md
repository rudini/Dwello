# Review #519, Runde 1 (c7730cd..3b9373e)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/tasks/app-frame.ts:33-37 | `goToOverviewWhileItFails` endet mit dem Klick auf «Zur Übersicht» und wartet nicht auf die Fehlerseite, zu der er führt (tests/e2e/CLAUDE.md: Tasks warten auf ihren Zustand). Das Szenario ist trotzdem stabil, weil `verwalter.sees(pageTitleText)` mit `expect.poll` wiederholt. Ein späterer Schritt nach diesem Task würde aber gegen die noch sichtbare 404-Seite laufen. Der Axe-Zustand `server-error` (tasks/accessibility.ts:208-213) hat dafür sein `Wait.until(...)`. |

Keine Blocker, keine Major.

## Antworten auf die Fragen des Aufrufers

- **Kann eine eigene Meldung einer Load-Funktion auf das Muster passen?** Nein. Alle `error(<status>, …)` in `src` übergeben `m.…()`-Texte (distribution-key, tenant, apartment, save-form, statement, category, config/*, buildings/*, contracts/*). Die einzige feste Zeichenkette ist `error(404, 'Not found')` in `src/routes/gallery/+page.server.ts:6`, und bei 404 greift `messages[404]` vor dem Muster. In `messages/*.json` steht kein Wert «Internal Error», «Unknown Error» oder «Error: <n>».
- **Braucht es einen `handleError`-Hook für unerwartete Fehler auf dem Server?** Nein. `src/hooks.server.ts` hat keinen `handleError` (nur `handle` und `handleFetch`), also bleibt es bei SvelteKits Standardmeldung «Internal Error». Diese fängt das Muster ab. Den Fall deckt der Unit-Test `it.each` mit Status 500 und «Internal Error» ab (`src/__tests__/error-page.test.ts:32`). Vor der Änderung war er rot, denn `$page.error.message` kam unverändert in den `h1`.
- **Szenario, Step, Target, Task:**
  - Die Schritte rufen nur Tasks und Questions auf.
  - Die Question `pageTitleText` gibt den Text selbst zurück.
  - `FailRequests.to` ist der einzige API-Mock. Er wird vor dem Request gesetzt und betrifft nur `__data.json` mit `x-sveltekit-invalidated=11`, wie beim Axe-Zustand.
  - Das Feature beschreibt das Was, nicht das Wie.
  - Die `data-testid` `error-to-overview` ist kebab-case und nennt den Kontext. `Button` reicht `testid` durch.
  - Einzige Abweichung: C-1.
- **Red:** Alle drei neuen `it.each`-Fälle sind ohne die Änderung rot, weil die alte Kette `$page.error?.message` vor `m.error_unexpected()` zeigte. Das Szenario ist ohne die Änderung rot, weil der `h1` «Internal Error» aus dem `load_data` des Clients zeigt.

Geprüft: alle 6 geänderten Dateien. `error_unexpected` steht in allen vier `messages/*.json`. Es gibt keinen neuen Bildschirm und keinen neuen Zustand: `error-server server-error` existiert schon, nur sein Titel ist jetzt übersetzt. Kein Code ausserhalb der Anforderung. Tokens und Komponenten sind unverändert.

## Nicht bestätigt

- **Weitere Standardmeldungen von SvelteKit.** Ich konnte den SvelteKit-Quelltext nicht lesen: `node_modules` im Worktree verweist auf `/home/user/Dwello/node_modules`, und der Zugriff darauf ist gesperrt. Die genannten Quellen von «Internal Error», «Unknown Error» und «Error: <status>» (`get_message`, `HttpError` ohne Body, `load_data` im Client) bestätige ich deshalb nur aus meiner Kenntnis von SvelteKit 2.x, nicht am Code der installierten Version (`^2.7.7`). Offen bleibt, ob andere `SvelteKitError`-Texte auf der Fehlerseite ankommen, z. B. «Method Not Allowed» (405) oder die Meldung zur Body-Grösse bei 413. Das wären englische Texte in allen Sprachen. Sie liegen ausserhalb von #519, weil sie keine «unerwarteten Fehler» sind.
- Unit-Test, Szenario (rot/grün), E2E navigation.feature (38), Axe/Sprache `-g "error-server "` (4), `vitest --changed`, lint und check: vom Aufrufer gemeldet, nicht selbst ausgeführt.
