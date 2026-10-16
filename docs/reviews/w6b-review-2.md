# Code-Review W6b (#63, #105, #106), Runde 2 (Abschlussrunde vor dem Push)

Gegenstand: Worktree `review-w6b-close`, detached auf c1dec5e.
- Review-Fixes `git diff 758b220 d3b2854`: alle 13 geänderten Dateien gelesen (README, `pdf.service.ts`, `reminder-letter.ts`, `docs/tech-stack.md`, `implementation_plan.md`, `PdfAction.svelte`, `tests/e2e/targets/tenant-form.ts`, Berichte `w6b-review-1`, `w6b-fachreview-2`, `w6b-datenpruefung-1`, `helga-w6b`, `weber-w6b`, Workflow-Notizen).
- Merge c1dec5e: `git show c1dec5e --cc` ist leer, es gibt also keine von Hand aufgelösten Stellen. Gelesen habe ich `git diff d3b2854 c1dec5e` (Stat und alle App-Pfade), die beiden `0008_*.sql`, `backend/src/db/migrate.ts` und `migrations.pg.test.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-10 | Minor | `tests/e2e/targets/tenant-form.ts:10` | Das Target ist seit Runde 1 geändert (`getByRole('option')`), und main ist gemergt. Gemeldet sind für c1dec5e aber keine E2E-Läufe. Bisher lief `tenant-edit.feature` («Sprache für Abrechnung und Mahnungen») nur auf 758b220, also mit `.locator('option')`. Nach dem Lesen sollte es grün sein: Playwright behandelt ein `<option>` in einem `<select>` als nicht verborgen und gibt ihm die Rolle `option`. Gesehen ist es nicht. Vor dem Push laufen lassen: `tenant-edit`, `statement-detail`, `statement-reminder` und, wegen des Merge, `statements`/`contract-detail` (CLAUDE.md, «Before marking anything complete») |
| C-11 | Nit | `implementation_plan.md:23` | «Feature review: persona, fach-reviewer, daten-pruefer» ist noch offen, obwohl die drei Reviews als eigene Punkte oben abgehakt sind. Den Punkt abhaken oder streichen |

Aus Runde 1 bleiben C-2, C-3, C-5, C-7, C-8 und C-9 als Minor/Nit offen, unverändert und ohne neue Belege.

Keine Blocker, keine Majors.

## Bestätigt

**Review-Fixes (758b220..d3b2854)**
- **C-1** `README.md:24`: Romanisch ist nicht mehr erwähnt. Die Zeile nennt «Statements and reminders … in German, French, Italian and English». Erledigt.
- **C-4** `PdfAction.svelte:44`: jetzt `pdfIn[language]()`. `language` hat den Typ `Tenant['language']` (de/fr/it/en) und den Standardwert `'de'`. `pdfIn` führt alle vier Schlüssel, die Typprüfung erzwingt die Vollständigkeit. Das Backend kann nach 0008 kein `rm` mehr liefern (CHECK). Erledigt, das Verhalten bleibt gleich (Prüfung im DOM-Test aus Runde 1).
- **C-6** `tenant-form.ts:10`: kein CSS-Selektor mehr. Die Question `offeredLanguages` (`Text.ofAll`) ist unverändert. Erledigt (E2E-Lauf siehe C-10).
- **V-13** `reminder-letter.ts:90`: en «please disregard this reminder.». Kein Test prüft den Satz (`grep disregard` in `backend/src/__tests__` findet nichts). Nach dem Skill `slice-review`, «Triage», braucht ein Wortlaut-Fix einer Übersetzung, den ein Reviewer genannt und geprüft hat, keinen Test. Der Beleg ist `w6b-fachreview-2.md` V-13. Annehmbar.
- **V-14** `docs/tech-stack.md`: Die veraltete Zeile «Further UI languages (fr, it, rm, en); the UI is German only» ist gestrichen. Richtig, denn die Oberfläche ist viersprachig.
- **D-1** `pdf.service.ts:6`: Der Kommentar nennt «DE, FR, IT, EN». Erledigt.
- Ponytail-Review des Deltas: keine Funde. Die Änderungen sind minimal, nichts bleibt ungenutzt zurück.
- Unverwandtes: keines. Berichte, Workflow-Notizen und Plan gehören zum Ablauf.

**Merge c1dec5e (origin/main)**
- **Migrationen:** `migrate.ts:19` sortiert nach Dateinamen. `0008_contract_notice_received.sql` (`rental_contracts`) läuft vor `0008_tenant_language_without_rm.sql` (`tenants`, `configuration`). Die beiden berühren verschiedene Tabellen, die Reihenfolge spielt also keine Rolle. Ein gleiches Präfix gibt es schon (`0006_*` doppelt). `migrate.ts` erkennt Migrationen am vollen Namen, nicht an der Nummer. Keine der beiden ist auf main angewendet worden, bevor die andere existierte: 0008_tenant ist nicht gemergt, 0008_contract kommt neu aus main. Der Test `migrations.pg.test.ts:73` filtert mit `file < '0008_tenant_language_without_rm.sql'`. Damit schliesst er `0008_contract…` in den Zustand «vorher» ein, und das ist korrekt.
- **Sprache, `rm`, Mahnungen:** `git grep "'rm'|Rätoroman|Romansh|language_rm"` in src, backend, tests, messages und docs (ohne Archiv, Berichte, Personas) findet nur `0001_schema.sql` (angewendet, unverändert), die neue Migration, ihren Test, den Hilfetext-Test und die Anforderungszeile. Main bringt keinen neuen Code, der die Sprache des Mieters, Mahnungstitel oder `tenants_language*`/`statements_reminder_*`/`statements_pdf_in_*` liest. Das zeigt der Diff d3b2854..c1dec5e: Die einzigen Treffer für «language» sind Plan- und Berichtszeilen.
- **Mapper:** Main hat in `toStatement` (`src/lib/server/statement.ts:42`) die Destrukturierung auf `?? {}` umgestellt. `tenantLanguage: tenant.language` aus diesem Slice bleibt erhalten. `tests/contracts/statement.json:25` führt `language: "fr"` weiterhin. Die Liste nutzt jetzt denselben Mapper (Regel «One mapper per response»), braucht die Sprache aber nicht.
- **Zusammenspiel:** Main fügt in der Liste den Link «PDF noch nicht erstellt» hinzu (#253). Er führt zur Detailseite, wo im selben Zustand (Entwurf ohne PDF) «PDF auf {Sprache}» aus diesem Slice steht. Das ist stimmig, ein Widerspruch ist nicht zu sehen.
- **Messages:** Die Neuerungen aus main (`statements_pdf_missing(_of)`, `contracts_notice_received*`, `contracts_withdraw_notice_help`) sind ohne Konflikt in allen vier Dateien gemergt. Die Schlüssel dieses Slices sind unberührt.
- **Plan:** genau eine `## Session` (für `open-work.test.ts`). `implementation_plan.md` ist vom Merge nicht betroffen.
- **Doku:** `docs/data-model.md:106`/`:374` und `docs/api-specification.md:81,185,222,232` führen nach dem Merge weiterhin de/fr/it/en und Mahnungen in der Sprache des Mieters.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2664), `cd backend && bun run test` (719, Coverage 94.1 %) auf c1dec5e: **vom Aufrufer gemeldet**. Nicht neu ausgeführt, denn `node_modules` des Worktrees verweist auf `/home/user/Dwello/node_modules`, und dieser Zugriff ist gesperrt.
- E2E auf d3b2854 oder c1dec5e: nicht gemeldet und nicht ausgeführt (siehe C-10).
- Wie pdfkit den geänderten englischen Satz im PDF darstellt: nicht gerendert. `w6b-datenpruefung-1.md:72` sagt ebenfalls, dass er nicht an einem PDF geprüft wurde. Da der Text nur ASCII enthält, ist kein Risiko zu sehen.
