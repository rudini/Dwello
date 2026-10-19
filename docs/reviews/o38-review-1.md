# Code-Review O-38 (E2E-Reste nach versandten Abrechnungen), Runde 1

Geprüft: `git diff 3e728e19 81bc1d71` im Worktree `review-o38-code` (ein Commit, `81bc1d71 fix(tests): purge sent statements in E2E cleanup`). Alle sechs geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `tests/e2e/fixtures/backend.ts:545-548` | Ohne `E2E_DATABASE_URL` bekommt das Skript kein `DATABASE_URL`; `bun run` im Ordner `backend/` liest dann `backend/.env` (README, Schritt 6) und damit die Entwicklungsdatenbank. Die Schutzprüfung wirft, `execFileSync` wirft, und jedes Szenario schlägt beim Aufräumen fehl. Der Rest des Aufräumens läuft dann nicht mehr. Lokal betrifft das jeden Entwickler mit `backend/.env`, CI nicht. |
| C-2 | Minor | `tests/e2e/fixtures/backend.ts:545` | `cwd: 'backend'` hängt vom cwd des Playwright-Workers ab (Repo-Wurzel bei `bun run test:e2e` und in CI). Robuster wäre ein Pfad relativ zur Datei. Heute ist das korrekt. |
| C-3 | Nit | `tests/e2e/fixtures/backend.ts:545` | Bun wird auch gestartet, wenn ein Szenario keine Namen angelegt hat (`tokens` leer). Das Skript löscht dann nichts (`LIKE ANY('{}')`), kostet aber pro Szenario einen Prozessstart samt DB-Verbindung und blockiert den Worker synchron. Lösung: `if (tokens.length)`. |
| C-4 | Nit | `docs/design/offene-punkte.md`, `docs/archive/offene-punkte-verlauf.md:325` | O-38 ist schon als behoben archiviert, obwohl der volle Lauf (Plan, Punkt «Full Chromium + API run green») und ein grüner `main`-Lauf in Firefox/WebKit noch ausstehen. Erst nach Bestätigung abschliessen, oder im Archivtext «auf CI zu bestätigen» schreiben. |

## C-1 (Major): Das Aufräumen greift ohne `E2E_DATABASE_URL` auf `backend/.env` zurück

**Warum falsch:** `env: { ...process.env, DATABASE_URL: process.env.E2E_DATABASE_URL }`. Normalerweise ist `E2E_DATABASE_URL` nicht gesetzt: `playwright.config.ts:8-9` setzt die Voreinstellung nur in einer eigenen Konstante, nicht in `process.env`. Node lässt Umgebungsvariablen mit dem Wert `undefined` weg. Das Kind sieht also kein `DATABASE_URL`. Ein `DATABASE_URL` aus der Shell des Entwicklers wird damit ebenfalls entfernt. Bun lädt dann `.env` und `.env.local` aus dem cwd `backend/`. Laut README (Zeile 96) liegt dort das `DATABASE_URL` der Entwicklungsdatenbank (`…/dwello`). `e2e-purge-statements.ts:10` wirft deshalb `Not an E2E database`. Die Schutzprüfung erfüllt damit ihren Zweck: Es wird nichts in der Entwicklungsdatenbank gelöscht. Weil `cleanUp` aber vor `removeTenants` wirft, schlägt jedes Szenario mit dem Fixture `seed` in seinem Teardown fehl, und seine Daten bleiben liegen.

Lokal lief es nur deshalb grün, weil `/home/user/Dwello/backend` keine `.env` hat. In CI gibt es keine `.env`, dort greift die Voreinstellung im Skript (`dwello_e2e`). Für `main` funktioniert der Fix also, `bun run test:e2e` bricht aber für jeden Entwickler ab, der nach README eingerichtet ist. Der Workflow verlangt die betroffenen E2E-Szenarien lokal vor «complete».

**Nachweis:** Probe im Scratchpad (`envprobe/`: eine `.env` mit `DATABASE_URL=…/dwello`, Skript `console.log(process.env.DATABASE_URL)`, aufgerufen wie im Fixture mit `execFileSync('bun', ['run','p'], { cwd, env: { ...process.env, DATABASE_URL: process.env.E2E_DATABASE_URL } })`). Ausgabe: `postgresql://dwello:dwello@localhost:5432/dwello`. Mit gesetzter URL kommt `…/dwello_e2e` an. Wer es nachstellen will: `backend/.env` mit `DATABASE_URL=postgresql://dwello:dwello@localhost:5432/dwello` anlegen und `bun run test:e2e -- --project=api` starten. Jedes Szenario mit Daten scheitert dann mit «Not an E2E database».

**Lösung:** Die URL immer explizit übergeben, mit derselben Voreinstellung wie `playwright.config.ts`, zum Beispiel `DATABASE_URL: process.env.E2E_DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello_e2e'`. Noch besser ist eine gemeinsame Konstante für Config und Fixture.

## Geprüft und in Ordnung

- **Verweise auf `utility_statements`:** Schema (`backend/src/db/schema.ts`) und Migrationen (`0001_schema.sql:277,300`, `0018_statement_correction.sql:7`) kennen genau drei:
  - `utility_statement_line_items.statement_id` mit `ON DELETE CASCADE`, wird mitgelöscht.
  - `documents.statement_id` mit `RESTRICT`. Das Skript löscht diese Dokumente vorher. Versandte Abrechnungen (`statement-send.service.ts:51-53`) und Mahnungen (`reminder.service.ts:132-134`) setzen `statementId` immer.
  - `utility_statements.replaces_id` (Selbstbezug) ohne Aktion, also `NO ACTION`. Postgres prüft das erst am Ende der Anweisung. Weil die berichtigte Abrechnung zum selben Vertrag gehört (`openReplaced` über `contractId`/Periode, `statement.service.ts:340-355`) und damit zum selben Mieter, löscht dasselbe `DELETE … WHERE id IN (…)` beide. Kein Verstoss.
- **Andere Verweise:** Andere Tabellen verweisen nicht auf Abrechnungen. Mietverträge, Wohnungen und Mieter verweisen nur in Gegenrichtung, mit `RESTRICT`. Sie werden danach wie bisher über die API gelöscht. Hochgeladene Dokumente löscht `deleteTenant` (`tenant.service.ts:301`).
- **Schutzprüfung:** `pathname.startsWith('/dwello_e2e')` lässt nur `dwello_e2e` und `dwello_e2e_empty` zu. Das genügt gegen versehentliches Löschen in `dwello` oder `dwello_test`. Wie `e2e-db.ts` prüft das Skript keinen Host, das ist gleichwertig zum Bestehenden.
- **Abgrenzung:** Die Muster sind die zufälligen 12-Hex-Token des Szenarios (`backend.ts:16-21`; Mieter: `lastName: token`, Zeile 154). Parallele Szenarien treffen sich nicht. Die E-Mail-Token aus `names.set('E-Mail …')` treffen keinen Namen und sind harmlos. Die Werte gehen als gebundener Parameter (`$1`) ein, eine SQL-Injection ist nicht möglich.
- **CI:** Der Job `e2e` hat Postgres auf 5432 mit `dwello/dwello`, installiert in `backend/` (`pg` vorhanden), startet `bun run test:e2e` aus der Repo-Wurzel und setzt weder `E2E_DATABASE_URL` noch eine `.env`. Das Skript fällt dort auf `dwello_e2e` zurück und läuft.
- **A11y- und Sprachen-Beispiele:** Sie säen über dasselbe Fixture (`fixtures/screens.ts:37-66`, mit `sendStatement('Bruno', 2025)`). Jedes Beispiel hinterliess also bisher eine versandte Abrechnung, und der Fix deckt das ab.
- **Konventionen:** Die Commit-Zeile hat 47 Zeichen, Typ/Scope `fix(tests)` ist erlaubt, «No scenario: test infrastructure only» ist begründet (reine Testinfrastruktur, kein Verhalten der App). Es gibt keine UI-Texte, keine API-Antwort und keine Design-Fragen. Fremde Änderungen im Diff gibt es keine.
- **Ponytail:** Der Diff ist kurz und bringt kein neues API in die App (das Löschen bleibt nur über die E2E-Datenbank möglich, wie O-38 es verlangte). Das Ergebnis sind nur C-2 und C-3.

## Erklärt die Diagnose auch Fehler A?

Plausibel, aber nicht belegt. `agreements-loading` hängt an `contractAgreements` (`src/lib/server/statement-generation.ts`). Dieser Aufruf fragt nur die gewählten Gebäude ab und wächst nicht direkt mit den Resten. `statementWizardSteps` (`tests/e2e/tasks/accessibility.ts:495-511`) klickt aber kurz nach Schritt 2 weiter. Der `/statements/billed`-Aufruf von `BuildingStep.svelte:37` mit zwei Backend-Anfragen pro Gebäude für alle (bis 1000) Gebäude läuft dann noch. Unter Firefox und WebKit, mit parallelen Workern, liegt es nahe, dass die Anfragen für Schritt 3 hinter diesen tausenden Backend-Anfragen (Pool, CPU) warten. Ein Messwert dafür liegt nicht vor.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend-`type-check`, `bunx vitest run open-work.test.ts`, Prettier auf der neuen Datei: vom Aufrufer gemeldet.
- statement-detail.feature in Chromium (68 bestanden) und der Datenbankstand vorher/nachher (23 Reste, danach 0): vom Aufrufer gemeldet. Ein E2E-Lauf war mir nicht erlaubt.
- Voller Chromium- und API-Lauf: läuft laut Aufrufer noch. Nicht bestätigt.
- Firefox und WebKit (die eigentlich roten Shards) und damit, ob `main` wieder grün wird: nicht lokal prüfbar. Bestätigt erst der nächste `main`-Lauf.
- Fehler A als Folge der Reste: nur aus dem Code geschlossen (siehe oben), ohne Messung.
- Die Reproduktion mit 600 eingefügten Gebäuden: vom Aufrufer gemeldet.
