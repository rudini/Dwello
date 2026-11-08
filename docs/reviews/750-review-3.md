# Review 750, Runde 3 (Delta 363295a..c0a9cb1)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine Befunde |

Geprüft: `abilities.ts` leert `console` beim `framenavigated` des Hauptframes (Unterframes bleiben ohne Wirkung); `hydrated()` in `interactions.ts:14-22` liest die Liste erst nach `goto`/`reload`/Klick, zeigt also nur die Meldungen des zuletzt geladenen Dokuments. Der neue Test «nennt nur die Konsole der zuletzt geladenen Seite» schlägt ohne den Listener fehl (`of /buildings` stünde im Stack); `failure.cause` toBe `timeout` pinnt das schon vorhandene `{ cause: error }`, und der Aufrufer meldet es mit entferntem `cause` rot. Testtitel beschreiben, was geprüft wird; kein Bezug zu UI-Texten, Szenarien oder Verträgen (reine Testinfrastruktur, Szenarien unverändert). Der Diff enthält nichts Fremdes zur Anforderung.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run tests/unit/hydration-console.test.ts src/__tests__/e2e-screenplay-lint.test.ts` (63 bestanden), Prettier auf den geänderten Zeilen, die Rot-Läufe beider neuen Assertions und der Lauf in echtem Chromium mit zwei `data:`-Seiten: vom Aufrufer gemeldet. Der CI-Lauf aller Browser war auf 53e89ba, also vor diesem Delta.
- Playwright meldet `framenavigated` auch bei Navigationen innerhalb des Dokuments (History-API). Ob SvelteKit beim Start (`history.replaceState` vor dem Hydrieren) so die Liste leert und damit Meldungen von vor dem Router-Start verliert, habe ich nicht geprüft (kein `node_modules` im Worktree). Fehler beim Hydrieren selbst und ein fehlgeschlagenes Laden des Moduls (dann startet der Router nicht) bleiben nach dem Code in jedem Fall erhalten; der Chromium-Lauf des Aufrufers lief ohne SvelteKit.
