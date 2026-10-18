# Code-Review: schnellere lokale E2E-Läufe (Runde 1)

Geprüft: `git diff 6b2404e b50c148` im Worktree `review-e2e-speed-code` (detached auf b50c148). Gelesen: alle fünf geänderten Dateien sowie `vite.config.ts`, `vitest.config.ts`, `svelte.config.js`, `playwright.screenshots.config.ts`, `.github/workflows/ci.yml` (Jobs e2e-tests und ui-screenshots), `docs/design/tools/persona-stack.sh`, `tests/e2e/tasks/accessibility.ts`, `tests/e2e/tasks/demo.ts`, `tests/e2e/steps/{language,accessibility,demo}.steps.ts`, `src/lib/version.ts`.

Ergebnis: kein Blocker, kein Major. CI-Verhalten bleibt gleich: `CI` ist auf GitHub Actions gesetzt, also wird immer gebaut. `test:e2e` erzeugt mit bddgen alle Features, also starten alle 7 Server. Der Screenshot-Job ruft kein bddgen auf, daher gibt es kein `.features-gen`, und alle Server starten wie bisher. `servers.find(port === 3100)` findet den Server weiterhin. Die Dateien sind Prettier-sauber.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tools/e2e/build-if-changed.mjs:12-13, 27-31; vite.config.ts:31-35 | `src/lib/paraglide/` zählt als Eingabe. Dieser Ordner wird aber vom Paraglide-Plugin *während* des Builds geschrieben, also nach `started`. Nach jeder Änderung an `messages/*.json` baut deshalb auch der nächste Lauf noch einmal. Das erklärt wahrscheinlich die einmal gemessenen 48 s beim zweiten Lauf. Der Ordner wird aus `messages/` und `project.inlang` erzeugt, die beide schon Eingaben sind. Vorschlag: ausschliessen wie `__tests__`. Beleg: Zwei `bunx vitest run tools/e2e` hintereinander lassen die mtimes in `src/lib/paraglide` unverändert (1792166803.47…). Das Plugin schreibt also nur geänderte Dateien, und genau das passiert im ersten Build nach einer Textänderung. |
| C-2 | Minor | tools/e2e/build-if-changed.mjs:11-23, 26; playwright.config.ts:40; vite.config.ts:10, 27 | Ein veralteter Build ist in seltenen Fällen möglich. (a) `APP_VERSION` aus `frontendEnv` in `playwright.config.ts` wird über `define` in den Build eingebaut, aber `playwright.config.ts` ist keine Eingabe. Ändert man den Wert dort, läuft lokal der alte Build, und navigation.feature schlägt mit falscher Version fehl. (b) Eine gelöschte Konfigurationsdatei auf oberster Ebene (`tailwind.config.js`, `postcss.config.js`) fällt durch `existsSync` heraus. Ihr Ordner ist die Repo-Wurzel, und deren mtime wird nicht verglichen, also folgt kein neuer Build. Die Doku nennt beide Fälle nicht. |
| C-3 | Minor | tools/e2e/build-if-changed.test.ts (fehlt); build-if-changed.mjs:35-39 | Die Eigenschaft, die einen veralteten Build verhindern soll, ist ungetestet: «eine während des Builds gespeicherte Datei zählt als geändert» (Stempel auf den Build-Start datiert, `utimesSync`). Das Build-Stub im Test berührt `src/` nie. Lässt man `utimesSync` weg (Stempel = Build-Ende), bleiben alle 7 Tests grün. |
| C-4 | Minor | playwright.config.ts:17-23; tests/e2e/tasks/demo.ts:4; tests/e2e/tasks/accessibility.ts:373 | Die zusätzlichen Server werden nach Dateinamen der Features erkannt, nicht nach den Steps, die 3102/3104 brauchen. Ein Szenario in einer anderen Feature-Datei mit einem Demo- oder Bildschirm-Step bricht lokal mit «connection refused» ab. In den Tasks steht kein Hinweis auf die Liste in `playwright.config.ts`. Auf CI tritt das nicht auf, weil dort alle Server starten. |
| C-5 | Minor | implementation_plan.md:7-15 | Der Slice ändert Code, aber in den Plan-Notizen fehlen die Zeile `Skills: tdd, ponytail, ponytail-review` und je eine Zeile `Test red: <test> – <message>` für die neuen Tests. |
| C-6 | Nit | tools/e2e/build-if-changed.mjs:28; package.json:73 | `readdirSync(…, { recursive: true })` gibt es erst ab Node 20.1. `engines` erlaubt `>=20.0.0`. Auf 20.0 wird die Option still ignoriert, verschachtelte Änderungen fallen dann nicht auf, und es läuft ein veralteter Build. CI und lokal laufen auf Node 22. |

## Blocker/Major

Keine.

## Nicht bestätigt

- Ob bddgen `.features-gen` vor dem Erzeugen leert. Sonst starten nach einem vollen Lauf auch bei `--tags @wip` alle Server; das kostet nur Zeit, ist aber kein Fehler. Den Quellcode in `node_modules/playwright-bdd` konnte ich nicht lesen (Zugriff auf `node_modules` verweigert). Hinweis darauf gibt nur der vom Aufrufer gemeldete Lauf mit `bddgen --tags @buildings` und 4 Servern, vom Aufrufer gemeldet.
- Den Pfad der erzeugten Dateien (`.features-gen/tests/e2e/features/<name>.feature.spec.js`) habe ich nicht selbst geprüft, weil bddgen Dateien schreibt. Nach Aufrufer startet demo.feature nach einem vollen bddgen 7 Server (vom Aufrufer gemeldet).
- Ob das Paraglide-Plugin beim Build tatsächlich nach dem Build-Start schreibt (C-1): aus `vite.config.ts` abgeleitet und durch das mtime-Verhalten unter vitest gestützt. Einen Build habe ich nicht gestartet.
- Ob adapter-node `build/` leert und damit den Stempel nach einem Build durch den Persona-Stack oder von Hand entfernt: Kommentar im Skript und Stub im Test, nicht in `node_modules` nachgesehen.
- Erneut ausgeführt: `bunx vitest run tools/e2e`, 7 bestanden (zweimal).
- Vom Aufrufer gemeldet, nicht erneut ausgeführt: `bun run lint`, `bun run check`, `bun run test:coverage` (vor der Typ-Korrektur), Backend `bun run test` und `type-check`, `deepcheck:audit`, `fallow audit`, die manuellen Playwright-Läufe (8 s, 4 bzw. 7 Server).
- Der vollständige E2E-Lauf (chromium + api) ist offen, Ergebnis unbekannt. Die Messung «46 s → 8 s» ist nicht bestätigt.
