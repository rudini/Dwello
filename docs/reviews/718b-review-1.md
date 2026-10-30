# Code-Review 718b, Runde 1 (6b8d19986..3c805d061, ohne docs/reviews)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tests/e2e/tasks/sicherung.ts:23, :38-42; tests/e2e/tasks/accessibility.ts:668-669 | `confirmBackupCode` klickt «Sicherung starten» und wartet nicht auf den Zustand danach. `freshBackupSetUp` geht danach in `inTurn` sofort zu `look`, das selbst navigiert. Damit ist offen, ob die Bestätigung beim Backend ankommt. |
| C-2 | Major | src/routes/dashboard/BackupNotice.svelte:12-26; tests/a11y/screens.json:187-195; docs/architecture/fitness-functions.md (O1) | Der Hinweis O1 («seit {Datum} keine Sicherung») hat kein Szenario und keine Zeile in a11y/Sprachen. Der Grund «Uhr des Servers» trägt nicht: Der Zustand entsteht aus einem `confirmed_at` in der Vergangenheit, ganz ohne andere Uhr. |
| C-3 | Major | backend/src/services/backup.service.ts:137-138, :185-188 | Zwei Stellen in `createBackup` (Schleife über die `.part`-Dateien) und `restoreBackup` (`pipeline`) sind nur umformatiert. Beide gehören nicht zur Anforderung. |
| C-4 | Minor | backend/src/services/backup.service.ts:41 | `withClient` nimmt für `DATABASE_URL` jetzt den Pool (`idleTimeoutMillis: 30000`). Damit laufen `scripts/migrate.ts` (über `backupBeforeMigration`, im CMD des Dockerfile vor `src/index.ts`) und `scripts/restore.ts` nach getaner Arbeit noch bis zu 30 s weiter, weil eine freie Verbindung offen bleibt. Bei jedem Update mit offener Migration startet das Backend deshalb verzögert. Nur durch Lesen ermittelt. |
| C-5 | Minor | backend/src/services/backup.service.ts:432-444 | `backupSetup`: Zwei gleichzeitige erste Aufrufe legen je einen ausstehenden Code an. Es gibt weder Transaktion noch eindeutigen Index. Eine Antwort kann Code A zeigen, während Bestätigung und Notfallblatt den neueren Code B nehmen (`ORDER BY created_at DESC`). Folge: «Code stimmt nicht», bis der Liegenschaftsverwalter die Seite neu lädt. |
| C-6 | Minor | src/routes/backup/+page.svelte:29 | `break-all` trennt den 29 Zeichen langen Code bei 390 px mitten in einer Vierergruppe (bei 30 px fett passt er nicht auf eine Zeile). Ohne `break-all` bricht er an den Bindestrichen um. |
| C-7 | Minor | src/lib/server/backup.ts:10-18, :30-42; src/routes/backup/sheet/+server.ts:6 | Kein Test unterhalb von E2E für den BFF-Teil. Ungetestet sind die Antwort 502 mit `backup_error_failed`, die Rückgabe `off` bei nicht erreichbarem `/health` (der Hook lässt dann jede Seite durch) und die Weiterleitung von `/backup/sheet` bei 409. |
| C-8 | Minor | src/lib/server/backup.ts:28 | `createdAt` geht an die Seite, `+page.svelte` braucht es aber nicht. |
| C-9 | Minor | backend/src/services/emergency-sheet.ts:67-68, :88 | `swissDay` wiederholt `formatSwissDate` (`pdf-format.ts:4`) samt Umrechnung `sv-SE`/Zürich. `'#111318'` wiederholt `COLORS.ink` (`pdf.service.ts:714`). |
| C-10 | Minor | tests/e2e/fixtures/fresh-installation.ts:15-19 | `FRESH_DATABASE_URL` wiederholt `freshDatabaseUrl` aus playwright.config.ts:36-40. Die Konfiguration importiert schon aus dieser Datei und könnte die Konstante von dort beziehen. |
| C-11 | Minor | tests/e2e/features/privacy.feature:132-135; src/__tests__/auth-guard.test.ts:85-92 | Drei neue Tests sind schon auf 6b8d19986 grün, ohne Vermerk «pins kept behaviour» in einem Commit: das Szenario «Ohne Sicherung nennt die Datenschutzerklärung keine» sowie die Hook-Tests «öffnet die Sicherung, ihr Notfallblatt, …» und «öffnet jede Seite, sobald der Code bestätigt ist». Auf der Basis leitet der Hook nicht um. Der Vermerk muss in den PR-Text oder in den nächsten Commit (CLAUDE.md, Workflow 2). |

## C-1

Warum falsch: Nach tests/e2e/CLAUDE.md warten Tasks auf den Zustand, zu dem sie führen. `freshBackupSetUp` endet direkt nach dem Klick, und der Look navigiert gleich weiter, zum Beispiel nach `/config/ki` (Zustand `ki-provider`). Läuft der POST mit `use:enhance` dann noch, gibt es zwei mögliche Ausgänge:
- Die Navigation bricht ihn ab: Der Hook leitet den Look nach `/backup` um, und der Look scheitert an fehlenden Elementen.
- Der POST kommt erst nach dem ersten Laden der Zielseite an: gleiche Folge.

Bei `confirmShownBackupCode` in einrichtung.feature fängt das nachfolgende `Dann` den Fehler nur zufällig ab.

Wie zeigen: Einen Look auf der frischen Installation laufen lassen, z. B. `ki-provider` im Projekt webkit, während das Backend langsam antwortet. Der Look landet auf «Sicherung einrichten».

Behebung: `confirmShownBackupCode` und `freshBackupSetUp` warten nach dem Klick mit `Wait.until(backupConfirmation)` auf die Übersicht mit der Bestätigung.

## C-2

Warum falsch: CLAUDE.md verlangt für eine sichtbare Verhaltensänderung ein Szenario. Der neue Zustand der Übersicht mit eigenem Link (`backup-stale-guide`) gehört zudem in screens.json, accessibility.feature und sprachen-bildschirme.feature. «No scenario» gilt nur für Zustände, die der E2E-Stack nicht herstellen kann. Diesen kann er herstellen:
- `backupState` rechnet aus `confirmed_at` oder dem letzten erfolgreichen Lauf gegen `now`.
- api-contracts.pg.test.ts:74-76 erzeugt `stale` genau so: einen bestätigten Code mit `confirmedAt` vor zwei Tagen.
- Ein Skript wie `e2e-backup-reset.ts` kann dasselbe auf der Datenbank `dwello_e2e_fresh` tun, ohne die Uhr zu verstellen.

Die Zeile in fitness-functions.md («bräuchte eine andere Uhr des Servers») stimmt deshalb nicht.

Vorbehalt: Der Zeitplan der frischen Installation (alle 15 Minuten) würde ab dem nächsten Takt eine Sicherung erstellen und den Zustand wieder auf `ok` setzen. Das Szenario muss diesen Wettlauf ausschliessen. Geht das nicht, gehört genau dieser Grund in die Begründung, nicht die Uhr.

Wie zeigen: Code mit `confirmed_at = now() - interval '2 days'` in `dwello_e2e_fresh` einfügen und `/dashboard` öffnen: `backup-stale` erscheint.

## C-3

Warum falsch: Laut der Liste in CLAUDE.md, die bei jedem Review gilt, darf der Diff nichts enthalten, was nicht zur Anforderung gehört. Dazu zählt Formatierung von unverändertem Code. Beide Hunks ändern keine Logik, nur den Zeilenumbruch.

Wie zeigen: `git diff 6b8d19986 3c805d061 -- backend/src/services/backup.service.ts`, Hunks `@@ -120` und `@@ -167`.

Behebung: Die beiden Hunks zurücknehmen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt:
  - `bun run lint`, `bun run check` und Backend-Type-Check
  - `bunx vitest run` (3765 Tests)
  - Backend `bun test`: backup*, api-contracts.pg, migrations.pg, auth.pg, api-docs.pg (207 Tests)
  - E2E chromium: einrichtung, sicherung, privacy, ki-einstellungen
  - Axe- und Sprachzeilen von backup, dashboard, ki-settings, setup und invoices (68)
- Rot vor Grün der @wip-Szenarios, von backup-api.pg, der Hook-Umleitung und von backup-notice.dom habe ich nur durch Lesen beurteilt. Bis auf C-11 scheitern alle auf der Basis, am fehlenden Endpunkt oder an der fehlenden Komponente.
- Notfallblatt, Satz zum Datum: Der Code sagt «Code erstellt am {date}. Er gilt für die Sicherungen ab dem Tag, an dem Sie ihn in Dwello bestätigt haben.» Das weicht vom geprüften Wortlaut ab («Code bestätigt am {date}; er gilt für die Sicherungen ab diesem Tag.», docs/reviews/718b-fachreview-1.md:84). Der Grund liegt in der Sache: Das Blatt entsteht vor der Bestätigung. Der fach-reviewer in Schritt 5 muss diesen Satz in allen vier Sprachen lesen. Kein Szenario prüft ihn.
- Hinweis O1: Der Text endet mit «… bei der Person, die Dwello betreut.», das Beispiel in #718 mit «… die Dwello für Sie eingerichtet hat». Das Issue sagt «e.g.», und das Glossar (Zeile 246) stützt «betreut». Ob das als entschiedener Text gilt, entscheidet der Product Owner.
- Die Übersetzungen fr/it/en: Die Schlüssel sind in allen vier Dateien dieselben (verglichen). Den Wortlaut habe ich nur für de und en gelesen, nicht gegen die Tabelle der Fachreview.
- Dass `Spec change approved: #718` im Text des Pull Requests steht: Den PR gibt es noch nicht.
- C-4: Wie Bun bei offenen Verbindungen des Pools die Laufzeit beendet, habe ich nicht ausgeführt, nur gelesen (backend/src/db/connection.ts:15-20, Dockerfile:52, docker-compose.prod.yml:91).
- Ob `pg_dump` in der E2E-Umgebung von CI vorhanden ist (die frische Installation sichert nach jeder Bestätigung). Wenn nicht, steht nur ein Fehler im Log.

Geprüft: Hook-Umleitung (lässt `/backup*`, öffentliche Seiten und `/api/` durch, Fehler von `/health` gibt `off`), Klartext des Codes (bei der Bestätigung gelöscht, mit allen nicht bestätigten Codes, vor der ersten Sicherung), Auth von `/api/v1/backup` hinter `authMiddleware`, Codes `BACKUP_*` mit `backend_<code>`, Contracts, Tokens und Komponenten aus `src/lib/ui` auf der neuen Seite, Datenschutztexte nur bei `ok`/`stale` (R-4), Screenplay-Schichten der neuen Steps, Tasks und Questions, Zurücksetzen der frischen Installation (Fixture und `inTurn` im Lock `installation`), Dokumentation in api-specification, data-model und installation.md.

## Triage

- C-1 (Major): fixed; both confirmations wait for the overview's confirmation.
- C-2 (Major): accepted. Scenario «Ohne Sicherung seit mehr als einem Tag warnt die Übersicht» (seen red with the warning taken out) and the state `backup-stale` in `screens.json` and both a11y features. The race with the schedule is excluded: the state is a code confirmed two days ago whose key cannot encrypt, so every run fails. That run left `pg_dump` running and holding a connection: fixed, test «beendet pg_dump, wenn das Verschlüsseln scheitert», seen red.
- C-3 (Major): fixed in the rebase onto #940 (both hunks gone).
- C-4: fixed (`allowExitOnIdle` on the pool), test «beendet db:migrate gleich nach der Migration …», seen red at 30 s.
- C-11: noted in the commit message.
- C-5, C-6, C-7, C-8, C-9, C-10: stay as Minors here. C-6 is checked by the personas at 390 px.
- 718a review 3 C-1 and C-3 (part 1): fixed here.
