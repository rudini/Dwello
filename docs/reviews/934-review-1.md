# Code-Review Runde 1, Slice 934 (`origin/main..32677b307`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tools/fitness/p1-benchmark.ts:15, 67-75 | Die Ports 3300/3301 sind die des Persona-Stacks (`docs/design/tools/persona-stack.sh:14`, `docs/design/arbeitsregeln.md:79`). `free()` beendet mit `fuser -k` ohne Rückfrage, was dort läuft, auch einen laufenden Persona-Stack einer parallelen Sitzung. |
| C-2 | Major | tools/fitness/p1-benchmark.ts:77 | Das Skript baut über `tools/e2e/build-if-changed.mjs`, aber ohne `APP_VERSION=v1.4.0` aus `playwright.config.ts:62`. Danach steht der E2E-Stempel auf einem Build mit der Version aus `git describe`, und der nächste lokale E2E-Lauf übernimmt diesen Build. |
| C-3 | Minor | tools/fitness/p1-benchmark.ts:112-120 | Es fehlt die Prüfung `created.length === APARTMENTS`. Legt die Aktion weniger oder keine Abrechnungen an, gilt der Lauf trotzdem als gelungen (bei 0 ist auch `files.length === created.length` erfüllt). Die Zeiten sehen dann aus wie ein Lauf über 50 Wohnungen, obwohl die Doku von 50 spricht. |

## C-1: Benchmark beendet den Persona-Stack

`persona-stack.sh` startet ohne `--second` das Backend auf 3301 und das Frontend auf 3300. `p1-benchmark.ts` beendet beim Start und im `finally` mit `fuser -k -s 3300/tcp 3301/tcp` jeden Prozess auf diesen Ports. Nach `CLAUDE.md` (Gotchas, «Cloud sessions») laufen mehrere Sitzungen im selben Container, und Workflow Schritt 5 lässt Personas gegen den Stack laufen. Startet eine andere Sitzung `bun run fitness:p1`, verschwindet die App mitten in der Persona-Runde. Die Persona meldet dann Verbindungsfehler als Befunde, und der Grund ist schwer zu finden. Umgekehrt beendet ein danach gestarteter Persona-Stack den Benchmark mitten in der Messung (`persona-stack.sh:16`).
So zeigt man es: `docs/design/tools/persona-stack.sh` starten, dann `bun run fitness:p1` ausführen. Danach antwortet `curl localhost:3300/health` nicht mehr.
Abhilfe: eigene, freie Ports nehmen (z. B. 3320/3321, wie P2 eine eigene Datenbank hat). Ist ein Port belegt, mit einer Meldung abbrechen, statt fremde Prozesse zu beenden. Im `finally` nur die selbst gestarteten Prozesse beenden: Mit `detached: true` reicht `process.kill(-child.pid)`.

## C-2: Benchmark hinterlässt dem E2E-Lauf einen Build mit falscher Version

`build-if-changed.mjs` schreibt nach jedem Build `build/.e2e-built`. Seine Kopfzeile verlässt sich darauf, dass nur der E2E-Lauf diesen Stempel setzt und ein Build «by hand, possibly with another APP_VERSION, leaves no stamp». Der Benchmark ruft das Skript aber ohne `APP_VERSION` auf, und `vite.config.ts:12` backt dann `git describe` ein. Danach findet `playwright.config.ts` den Stempel aktuell und überspringt den Build. Das Szenario «Die Fusszeile zeigt die Version der App» (navigation.feature) wird damit lokal rot, ohne dass der Code etwas dafür kann. Dazu kommt: Läuft gerade ein lokaler E2E-Lauf mit wiederverwendetem Server auf 3100 aus `build/`, leert `vite build` diesen Ordner unter ihm.
So zeigt man es: eine Datei unter `src/` ändern, `bun run fitness:p1` ausführen, dann `bun run test:e2e -- --grep "Version der App"`. Der Build wird übersprungen und das Szenario schlägt fehl.
Abhilfe: das Skript mit derselben Umgebung wie der E2E-Lauf bauen lassen (`APP_VERSION` aus `playwright.config.ts`). Oder ohne Stempel in einen eigenen Ordner bauen, wie es der Persona-Stack mit `/tmp/persona-app` tut.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check` grün, Prettier sauber, fünf Läufe des Skripts mit den Werten 2,9–3,4 s (Lauf), 3,4–3,7 s (PDFs) und 6,4–7,1 s (zusammen). Selbst nichts ausgeführt (kein `node_modules`, keine Datenbank).
- Dass die Seed-Daten wirklich 50 Abrechnungen ergeben (alle sechs Kategorien vorhanden, also 12 Rechnungen, und kein Mietvertrag übersprungen): nur gelesen in `contractsInPeriod` (`src/lib/server/statement-generation.ts:89-110`). Das Skript prüft es nicht (C-3).
- Die Messung auf der Demo-VM, wie im Requirement dem PO überlassen.

Geprüft: Die Messspanne geht vom POST der Formular-Aktion bis zu ihrer Antwort. Die Aktion endet mit der letzten `statements/generate`-Antwort (`generateStatements`, nacheinander). Die PDFs werden nicht aus einem Cache geholt: Für Entwürfe macht `getStatementPdf` (`backend/src/services/statement-pdf.service.ts:369`) bei jedem Abruf ein neues PDF, und die ZIP-Route holt die PDFs nacheinander über das BFF. Ist die Antwort `failure` oder `redirect`, bricht das Skript ab. Das Herausfiltern der IDs aus der devalue-Form stimmt für `{ created: string[] }`. Die Datenbank `dwello` und ein Dev-Server auf 5173/3001 werden nicht berührt, weil `DATABASE_URL` vor den Imports gesetzt und an das Backend übergeben wird. Die Zahlen in der Doku passen zu den gemeldeten Läufen (30 / 6,5 ≈ 4,6). Kein CI-Wächter.

## Triage

- C-1 (Major): fixed. Ports of its own (3320/3321); a used port stops the run with a message; only the two servers it started are stopped (their process groups).
- C-2 (Major): fixed. It builds into `/tmp/p1-app` with `BUILD_DIR`, as the persona stack does, without the E2E stamp.
- C-3: fixed. Fewer than 50 statements stop the run.
- Two more runs after the fixes: 7.0 s and 7.5 s.
