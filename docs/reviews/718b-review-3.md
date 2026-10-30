# Code-Review 718b, Runde 3 (Abschlussrunde vor dem Push)

Bereich: `git diff c184e6b85 c0a7ba67a` und die Auflösung des Rebase (`git diff origin/main c0a7ba67a -- docs/installation.md messages/de.json tests/e2e/features/privacy.feature`). Worktree: review-718b-code3, Commit c0a7ba67a.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | docs/installation.md:82 | Die Wiederherstellung auf einem neuen Rechner verlangt `docker compose -f docker-compose.prod.yml up -d`. Seit #578 lädt eine Installation nur `compose.yaml` herunter (Zeilen 19–24), und eine Datei `docker-compose.prod.yml` gibt es dort nicht. Der Befehl scheitert also genau im Notfall. Dieser Rest der Rebase-Auflösung widerspricht der Angabe des Aufrufers, dass alle Befehle ohne `-f` auskommen. |
| C-2 | Minor | docs/installation.md:73 | `rsync … --max-delete=5` löscht pro Lauf höchstens 5 Dateien und überspringt den Rest. Dwello löscht jeden Tag etwa eine Sicherung (die achte tägliche), am Monatswechsel eine mehr. Wer «regularly» als wöchentlich versteht, hat pro Lauf etwa 7–8 Löschungen. Der Rückstand wächst dann mit jedem Lauf, und die Kopie behält Sicherungen über 12 Monate hinaus. Der Satz in Klammern sagt aber, dass die 12 Monate eingehalten werden. Abhilfe: einen täglichen Lauf nennen oder die Grenze passend zum Abstand der Läufe wählen. |

## C-1

Warum falsch: Abschnitt 2 der Anleitung beschreibt nur noch die Installation aus `compose.yaml` (ein leerer Ordner, `curl -fsSLO …/compose.yaml`). Den Klon mit `docker-compose.prod.yml` nennt nur noch Abschnitt «An installation from `git clone`» (Zeile 94), als Altfall mit Umstieg. Die Zeile 82 gilt für jeden Betreiber, schickt aber alle auf diese Datei. Sie gehört zum Teil des Diffs, auf den das Notfallblatt verweist (`self`: «… finden Sie das Vorgehen in der Installationsanleitung»). Die Zeilen 77–79 direkt davor verwenden schon richtig `docker compose` ohne `-f`. `compose.yaml` auf main hat den Service `restore` (Profil `restore`, `./backups:/backups:ro`) und beim Backend `./backups:/backups`. Mit `docker compose up -d` würde der Ablauf also funktionieren.

So zeigt man es: In einem leeren Ordner nur mit `compose.yaml` und `backups/` meldet `docker compose -f docker-compose.prod.yml up -d` «open …/docker-compose.prod.yml: no such file or directory».

Abhilfe: `docker compose up -d`.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt:
  - `bun run lint`, `bun run check`, `cd backend && bun run type-check`
  - `cd backend && bun run test` (1757, Abdeckung 96.8 %) und `bunx vitest run` (3811)
  - Prettier auf den seit origin/main hinzugefügten Dateien
  - E2E chromium einrichtung, sicherung und privacy (63), dazu die a11y- und Sprachzeilen `backup …` und `dashboard …` (30)
  - die Rot-Läufe der neuen Szenariozeilen (backup_keep_sheet, Aufbewahrungstext, Datenschutz vor der Bestätigung) und der Tests C-14 und C-13
- C-14 bei gültigem Schlüssel ohne `pg_dump`: Es gelingt, die Kopfzeile zu verschlüsseln, und `exited` wird erst nach dem Datei-I/O erwartet. Ob Bun das `error` (ENOENT) früher meldet und damit eine Ablehnung zunächst unbehandelt bleibt, hängt weiter vom Timing ab. Das war schon in Runde 1 und 2 offen. Der neue Test deckt nur den Fall ab, dass das Verschlüsseln scheitert (backup.pg.test.ts:222). Gelesen habe ich backup.service.ts:104–157, ausgeführt nichts.
- Dass die Sprachprüfung den Code als einen Textknoten erhält (`recoveryCode` in tests/e2e/questions/language.ts:97), habe ich nur aus `backup/+page.svelte:29` gelesen (ein `<p>` mit `break-all`). Das Alphabet von `generateCode` (backup-crypto.ts:26) passt zur Regex.
- fr-, it- und en-Wortlaut des Notfallblatts (emergency-sheet.ts) und `privacy_retention_backup`: Kein Test prüft ihn, er ist nur in den Fachreviews 718b-3 und 718b-4 gelesen. Das ist die Ausnahme für geprüfte Übersetzungen.

Geprüft: Die Umnummerierung auf 0040 ist vollständig (Doku und der Filter des Tests gegen 0039_access_keys von main). Der Datenschutz zeigt die Sicherung schon bei `setup`, und das stimmt, weil `hooks.server.ts:51` die Einrichtung erzwingt. stopDump und die Wartezeit auf die PID (C-13) habe ich gelesen. persona-stack.sh habe ich gelesen. In der Rebase-Auflösung blieben beide Seiten erhalten (`docker compose pull` beim Update, der Abschnitt zum Klon, «next to `compose.yaml`», alle Schlüssel aus de.json, das Szenario in privacy.feature). Alle vier `messages/*.json` haben 2173 Schlüssel.

## Triage

- C-1 (Major): fixed (`docker compose up -d` on a new machine; only the section on clones still names `docker-compose.prod.yml`).
- C-2: fixed; the guide asks for a daily copy, which `--max-delete=5` keeps up with (Dwello deletes about one backup a day).
