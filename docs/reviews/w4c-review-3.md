# Code-Review W4c, Runde 3 (abschliessend vor dem Push)

Geprüfter Stand: Worktree `review-w4c-code3`, detached auf `b1fe1f0`. Delta zu Runde 2: Merge-Commit `de1ed73` (origin/main mit #115 und #59) und `b1fe1f0` (Einstellungs-Szenarien zusammengelegt).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. Kein Blocker, kein Major. |

## Geprüft

**Merge `de1ed73`** (`git show --cc de1ed73`, dazu `git diff 4dbeb8a de1ed73 --stat -- src backend messages`):
- Konflikte nur in `src/__tests__/buildings-i18n.test.ts`, `src/__tests__/overview.test.ts` (Fixture `OverviewInput`: `paymentDeadlineDays`, `reminderAfterDays` und `expiredContracts` stehen alle drin, Kommata stimmen) und `docs/archive/implementation-plan-verlauf.md` (beide Sessions erhalten, keine offene Session in `implementation_plan.md`).
- `src/lib/overview.ts`: `OverviewInput` hat beide Erweiterungen. `workTasks` (Mahnfrist #64, Rückerstattung ausgenommen, `nextReminderFrom` #107) und `fixedTermTasks` (A-6) sind unabhängig voneinander. `overviewTasks` hängt `fixedTermTasks` hinten an, `overviewDeadlines` filtert Zahlungen weiterhin mit `paymentDeadlineDays` (#87).
- `src/routes/dashboard/+page.server.ts`: `today` kommt jetzt einmal aus `localToday()` und wird für `input.today` und `expired(allContracts, today)` verwendet. `paymentDeadlineDays`/`reminderAfterDays` werden aus `stored` gelesen, dazu kommen `expiredContracts`. Beide Features sind korrekt kombiniert.
- Was main sonst mitbringt (`ReminderModal.svelte`, Hilfe-Seite, Texte zu Art. 257d OR und A-6) berührt die Mahnfrist-Logik nicht und widerspricht den Hilfetexten zur Mahnfrist nicht.

**`b1fe1f0`**:
- `settings.feature`: Ein einziges Szenario «Absender und Fristen hinterlegen» speichert jetzt das ganze Formular. Die übrigen Szenarien («Ungültige IBAN», «Ungültige PLZ», «Frist ausserhalb des erlaubten Bereichs») senden ungültige Formulare. `saveSettings` in `src/lib/server/settings.ts` gibt dann `fail(400)` zurück, bevor es PUT oder DELETE aufruft. Sie schreiben also nichts, und es bleibt kein Race.
- Andere Schreibzugriffe auf die Konfiguration in E2E: nur `seed.iban` (`tests/e2e/fixtures/backend.ts:240`). Alle Aufrufe in `statements.feature` und `statement-detail.feature` setzen dieselbe IBAN «CH93 0076 2011 6238 5295 7» wie das Szenario. Das passt zur Erklärung in der Workflow-Notiz.
- Strenge: Gleich wie vorher. IBAN und beide Fristen werden nach erneutem Öffnen geprüft. Der neue Step «sind die Zahlungsfrist … hinterlegt» öffnet die Seite nicht mehr selbst, folgt aber direkt auf den Step, der sie neu öffnet. Ohne #87 scheitert das Szenario rot, weil die Felder fehlen (`Enter … into settingField`).
- Screenplay: Die Steps rufen nur `saveSettings`, `openSettings` und `storedSetting` auf. Der zusammengelegte Step-Text ersetzt die Regex. Es gibt keine verwaisten Step-Texte mehr (grep über `tests/e2e` und `docs` ohne Archiv). Die Feature-Sprache bleibt fachlich.
- `docs/reviews/workflow-notes-issue-64-87-55.md`: Die neue Zeile beschreibt die Ursache zutreffend (`saveSettings` löscht geleerte Felder per DELETE, nachdem der PUT gelungen ist).
- Keine Änderungen ohne Bezug zur Anforderung.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend `type-check`, `bunx vitest run` (2762 Tests), E2E `dashboard.feature` und `settings.feature` (46 bestanden): vom Aufrufer gemeldet. Mein Versuch, `bunx vitest run` für `overview.test.ts`, `dashboard.test.ts` und `buildings-i18n.test.ts` neu laufen zu lassen, scheiterte schon an der Vorprüfung: Eine Deny-Regel blockiert den Zugriff auf `/home/user/Dwello/node_modules`, auf das der Worktree zeigt.
- Ob das Race mit einem einzigen speichernden Szenario unter voller Parallelität ganz ausbleibt, belegen nur der Code (siehe oben) und der vom Aufrufer gemeldete grüne Lauf. Einen wiederholten Lauf habe ich nicht gemacht.
