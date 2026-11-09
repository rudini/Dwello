# Review Slice 1374, Runde 1 (`git diff aff89c4b bcdb40e8`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/lib/server/login-flow.ts:31 | `URL.parse` gibt es unter Node 20 vor 20.18 nicht; README und `package.json` nennen Node >= 20.0.0, und das Repo umgeht `URL.parse` genau deshalb schon (statement.ts:291, pdf-refusal.test.ts:131). Dort wirft jede Anmeldung einen TypeError (500). |

## C-1 (Major): `URL.parse` macht jede Anmeldung unter Node 20 kaputt

`safeTarget` läuft auf allen drei Wegen der Anmeldung: beim Start des OAuth-Ablaufs (`rememberLoginFlow`, login-flow.ts:40), beim Rückruf (`takeLoginFlow`, login-flow.ts:57) und bei der Anmeldung mit Passwort (password-login.ts:55). Die Laufzeit, die das Projekt zusichert, ist `"node": ">=20.0.0"` (package.json:86, README.md:45). `URL.parse` kam erst mit Node 22.1 und wurde nach 20.18 zurückportiert. Unter Node 20.0 bis 20.17 wirft `URL.parse(...)` deshalb `TypeError: URL.parse is not a function`. Das passiert ausserhalb des `try` in `takeLoginFlow` und gar nicht abgefangen in `rememberLoginFlow` und `password-login.ts`, also endet jede Anmeldung mit einem 500. Das Repo hat diesen Fall bereits als Befund behandelt: Das Fallback-Review von #1095 (src/__tests__/pdf-refusal.test.ts:131–141, Test «führt auch ohne URL.parse …») und der Kommentar in src/lib/server/statement.ts:291 («URL.canParse, not URL.parse: Node 20 has only the first») verlangen ausdrücklich `URL.canParse` + `new URL`. Die Abweichung, die der Aufrufer gewählt hat («`URL.parse` statt `new URL()`»), läuft dieser Festlegung zuwider. Die Anforderung von #1374 nennt selbst `new URL()`.

So zeigt sich der Fehler: wie in pdf-refusal.test.ts `Reflect.deleteProperty(URL, 'parse')` im Test, dann `GET` von `/auth/login?provider=google&redirectTo=%2Fbuildings` aufrufen. Das Cookie `dwello_login` wird nie gesetzt, die Anfrage wirft. Lokal geprüft: `node -e 'delete URL.parse; URL.parse("/buildings","http://dwello.invalid")'` ergibt `TypeError URL.parse is not a function`.
Behebung: `URL.canParse(t, BASE) ? new URL(t, BASE) : null` (oder `new URL` in `try`), dazu ein Fall ohne `URL.parse` wie in pdf-refusal.test.ts.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, Backend-Type-Check, `fitness --base origin/main --structure`, `bunx vitest run` (4890), E2E chromium authentication.feature (23 grün), die Unit-Fälle rot vor der Änderung (3 rot) und das neue Szenario rot auf dem Basis-Code beim Dann-Schritt. Nach dem Lesen sind die Rot-Läufe plausibel: Die alte Regex `/^\/(?![/\\])/` liess `/\t/…`, `/\n/…` und `/\r/…` durch.
- Ob Node 20.18+ `URL.parse` wirklich mitbringt (Rückportierung), habe ich nicht an einer Node-20-Laufzeit geprüft. Lokal läuft nur Node v22.23.4.

Geprüft: `safeTarget` mit `node -e` an `/\t/evil.example`, `//…`, `/\\…`, `https://…`, `javascript:`, `" //…"`, `http:/evil.example` (wird `/evil.example`), `?x=1`, `#h` und `/buildings?search=See#a`; alle bleiben auf dem eigenen Origin oder fallen auf `/dashboard` zurück. Alle drei Senken nutzen `safeTarget`. Das Szenario ist fachlich formuliert und ohne `@wip`. Der Schritt ruft nur die Aufgabe `openPage`. Keine neuen Texte oder Bildschirme, kein API-Vertrag betroffen. Kein Code ausserhalb der Anforderung.
