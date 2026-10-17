# Code-Review Merge W10c (#363), Runde 4: Merge von origin/main (#357) in 3b126245

Gegenstand: Merge-Commit 3b126245 (Eltern dc6407a, 271e511c), Worktree `review-w10c-merge4`. Gelesen habe ich die kombinierte Auflösung (`git show --cc 3b126245`, ohne `docs/reviews` und `docs/design/personas`). Sie enthält diese Dateien: `0020_contract_categories.sql` (umbenannt), `migrations.pg.test.ts`, `docs/api-specification.md`, `docs/archive/implementation-plan-verlauf.md`, `messages/fr.json` und `tests/e2e/fixtures/screens.ts`. Ausserdem habe ich die Änderungen von main in `category.service.ts`, `config.service.ts`, `invoice.service.ts`, `statement.service.ts`, `app.ts` und `0019_audit_log.sql` gelesen, dazu `refuseOpenAgreements` (statement.service.ts:625-641), die neuen Szenarien in `settings.feature`, den Eintrag `audit-log` in `screens.json` und die Verweise auf Migrationsnummern im Repo.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | docs/data-model.md:155 | Dort steht noch «Migration `0019` gave a contract with statements …». Die Migration heisst jetzt `0020_contract_categories.sql`. `0019` ist seit dem Merge `0019_audit_log.sql`, wie Zeile 436 sagt. Darum führt der Verweis jetzt auf die falsche Datei. Korrektur: `0020` |
| C-2 | Nit | docs/data-model.md:484 | Die Übersicht der Migrationen endet mit «0003 … 0019». Es gibt aber `0020`. Korrektur: `0003 … 0020` |
| C-6 (R3) | Minor, bleibt | backend/src/services/statement.service.ts:638-640 | `{categories}` steht weiterhin mit deutschen Namen (`nameDE \|\| name`). Vom Merge nicht berührt |
| C-5 (R3) | erledigt | messages/fr.json:415 | Jetzt «établit le décompte rectificatif». Das entspricht dem Begriff aus `i18n-begriffe.md` |
| C-7 (R3) | erledigt | docs/api-specification.md:248 | `STATEMENT_AGREEMENTS_OPEN` (`categories`) steht jetzt unter den 409-Codes von `POST /:id/correction`. Code und Parameter stimmen mit statement.service.ts:638-640 überein, der Status 409 mit `correctionStatus` (routes/statements.ts:33, 226) |

Keine Blocker, keine Majors.

## Bestätigt beim Lesen

- **Migrationsreihenfolge:** `migrate.ts` wendet die Dateien in Namensreihenfolge an und führt sie in `schema_migrations` nach Dateinamen. Ein Journal gibt es nicht (`backend/migrations/meta` fehlt). `0019_audit_log.sql` legt nur `audit_log` an und berührt keine Tabelle, die `0020_contract_categories.sql` liest oder schreibt (`utility_statements`, `utility_statement_line_items`, `invoices`, `categories`, `rental_contracts`). Darum läuft 0020 nach 0019 unverändert. Die Umbenennung trifft keine angewendete Migration ausserhalb dieses Branches, denn der Branch ist nicht gemergt.
- **migrations.pg.test.ts:129:** Der Filter `file < '0020_contract_categories.sql'` nimmt jetzt `0019_audit_log.sql` in den Zustand «vorher» mit. Das ist richtig, denn so ist der Zustand vor 0020 wirklich. Der Test prüft weiterhin, was 0020 selbst übernimmt. Andere Verweise auf `0019_contract_categories` gibt es im Code nicht mehr (grep über backend, src, tests, docs). Ausnahmen sind C-1 und C-2.
- **Audit-Änderungen von main und vereinbarte Kategorien:**
  - `statement.service.ts`: Main ändert `resetPayment` und `replaceStatement`, jetzt in einer Transaktion mit `recordStatementCorrection`. Der Branch ändert `correctStatement` und `refuseOpenAgreements`. Die Hunks sind getrennt. `replaceStatement` setzt nur den Status und kennt keine Vereinbarung. Die Ablehnung der Berichtigung läuft danach in `correctStatement` wie zuvor.
  - `category.service.ts`: Main schreibt beim Wechsel der Umlagefähigkeit einen Eintrag und zählt die ausgeschlossenen Rechnungen. `contract_categories` fasst die Funktion nicht an. Das ist dasselbe Verhalten wie auf dc6407a, wo eine später umlagefähige Kategorie keine Zeile hat (data-model.md:154-155).
  - `invoice.service.ts` und `config.service.ts`: Hier gibt es keine Berührung mit Vereinbarungen.
- **screens.ts:** Die Auflösung behält beide Seeds. Die Seeds des Branches für Waldblick, Hanna und Ines und der Seed von main (`Rasenpflege` umlagefähig, danach nicht umlagefähig) laufen nacheinander. `Rasenpflege` hat keine Rechnungen. Der Assistent fragt darum in den Zuständen `agreed-costs` und `agreement-save-failed` nicht nach ihr, und die Benennung von Ines' Kosten bleibt gleich. Die Seeds des Branches (Mietvertrag, Rechnung anlegen, `agreement`) schreiben keinen Protokolleintrag, denn main protokolliert nur Änderungen an Kategorie, Rechnung, Pauschale, Zahlung und Berichtigung. Der Zustand `audit-log` `default` sieht also dieselben Einträge wie auf main. In `backend.ts` gibt es keine doppelten Hilfsfunktionen.
- **implementation-plan-verlauf.md:** Beide Sessions sind vollständig erhalten. Die W10c-Session nennt 0020 und Runde 4, die W7e-Session von main ist unverändert angehängt.
- **Nichts Fremdes:** Die kombinierte Auflösung enthält nur die Umbenennung, deren Folgen und die beiden Korrekturen aus Runde 3.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend-Type-Check, `bunx vitest run` (2918 grün) und Backend-pg-Tests `migrations`, `agreed-categories`, `api-contracts`, `audit-log` (77 grün): vom Aufrufer gemeldet, nicht selbst wiederholt.
- E2E der betroffenen Szenarien (`settings.feature`, `statement-agreed-costs.feature`, `accessibility.feature` und `sprachen-bildschirme.feature` für `audit-log` und `statement-generate`): laufen laut Aufrufer noch. Ergebnis unbekannt.
- Ob 0020 auf einer Entwicklungsdatenbank, die schon `0019_contract_categories.sql` hatte, sauber läuft, ist nicht geprüft. 0020 würde dort mit `CREATE TABLE contract_categories` scheitern. Das betrifft nur lokale Datenbanken dieses Branches, nicht main oder Produktion.
