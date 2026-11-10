# Code-Review Paraglide 3 (Dependabot #1428), Runde 1

Bereich: `git diff origin/main acba08f` (d95fad1, acba08f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `package.json` und `bun.lock` (nur Paraglide 3.2.1 mit `@inlang/sdk` 4.2.0 und der neuen Auflösung von `magic-string`; nichts anderes betroffen); `paraglide.config.ts` (`outputStructure: 'message-modules'` in den gemeinsamen `paraglideOptions`, die `vite.config.ts`, `vitest.config.ts` und der CLI-Aufruf `compile` teilen; laut `defaultCompilerOptions` von 3.2.1 auch der Standard des Compilers; der Kommentar stimmt). Die Laufzeit-APIs, die `src/` nutzt (`baseLocale`, `locales`, `getLocale`, `setLocale`, `overwriteGetLocale`, `Locale`, `paraglideMiddleware` mit `({ request, locale })`), gibt es in der erzeugten 3.2.1-Laufzeit weiterhin. `setLocale` lädt weiterhin standardmässig neu und nur bei `newLocale !== currentLocale`, wie es `LanguageSwitcher.svelte` erwartet. Das Cookie behält Name, max-age und Domain; `cookieSameSite`/`cookieSecure` sind neu, aber nicht gesetzt (undefined/false), also unverändert. Kein Text, keine UI und kein Vertrag geändert, also braucht es keine Einträge in `messages/*.json`, `screens.json` oder `tests/contracts`. «No scenario» ist begründet, weil das Verhalten unverändert bleibt.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (236 Dateien, 4983 Tests), `bun run fitness -- --base origin/main --structure`, E2E `buildings.feature` + `sprachen.feature` auf chromium und api (42 bestanden, nach erzwungenem Neubau), die Reproduktion des `virtual:`-Fehlers vor dem Fix. Nicht selbst ausgeführt.
- Die erzeugte Laufzeit habe ich nur in `/home/user/Dwello/src/lib/paraglide/runtime.js` des Aufrufers gelesen (dort liegt 3.2.1, erkennbar an `getTextDirection`, `cookieSameSite` und `registry.js`). Ob sie genau dem Stand von acba08f entspricht, habe ich nicht geprüft, denn im Review-Worktree gibt es kein `node_modules` und keine erzeugte Ausgabe.
- Die übrigen E2E- und axe-Jobs (alle Features, alle Sprachen) laufen erst in CI.
- `tools/e2e/build-if-changed.mjs` führt `paraglide.config.ts`, `package.json` und `bun.lock` nicht als Eingaben des Builds. Ein lokaler E2E-Lauf kann deshalb einen veralteten Build wiederverwenden. Das betrifft nur lokale Läufe (CI baut immer neu), die Lücke bestand schon vor dieser Änderung, und es geht um eine Gate-Datei. Darum kein Befund dieses Diffs.
