# Code-Review 5 (abschliessend): Protokoll #357, Delta 95dbddb..4116c18

Worktree: `/tmp/claude-0/-home-user-Dwello/3eb48ef7-ceb3-5923-ae2d-df5dd75846f5/scratchpad/review-audit-code5` (4116c18). Gelesen: alle 15 Dateien des Deltas, dazu `replaceStatement` und `resetPayment` (`statement.service.ts`), `audit-log.service.ts`, `migrate.ts`, `api-contracts.pg.test.ts` (Audit-Log-Vertrag), `settings.feature`, `statement-detail.feature` (Berichtigung), `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, Issue #357 (über `gh api`), Skill `ponytail-review`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `backend/src/services/audit-log.service.ts:26-28` | ponytail `yagni`: `recordStatementCorrection` ist jetzt ein Einzeiler-Wrapper mit einem Aufrufer; `resetPayment` (`statement.service.ts:595`) ruft `recordAudit` direkt auf. `recordAudit('statement_corrected', { statementId: id, number: existing.statementNumber }, tx)` in `replaceStatement` und `recordAudit` im Test «Einträge löschen» würden reichen. net: etwa -4 Zeilen. |
| C-2 | Nit | `tests/e2e/features/settings.feature:67-70` | Der Kommentar nennt die Einträge, die nur `audit-log.pg.test.ts` prüft (Anmeldung, Verwaltungspauschale, Zahlung zurücksetzen). Die Berichtigung, die jetzt dazukommt, nennt er nicht. Das Issue verlangt pro Aktion nur einen `*.pg.test.ts`, also ist das kein fehlendes Szenario. |
| C-3 | Nit | `backend/src/__tests__/audit-log.pg.test.ts:194-212` mit `:38-40` | `afterAll` löscht nur Einträge, deren Details das `token` enthalten. Der neue Eintrag `{ statementId, number: 'NK-2023-…' }` enthält es nicht und bleibt in `dwello_test` liegen. Beim Test «Zahlung zurücksetzen» (`:169ff.`) ist das schon so. Hier wäre ein Löschen nach `statementId === id` angebracht. |
| C-4 | Nit | `backend/src/services/statement.service.ts:604-611` | Die Statusprüfung liegt ausserhalb der Transaktion, und das `UPDATE` hat keine Statusbedingung. Zwei gleichzeitige `POST /replace` würden beide durchlaufen, und jetzt stünden zwei Protokolleinträge da. Der Check-then-act stammt aus #358 und ist beim Einzelbenutzer praktisch nicht erreichbar. |
| C-5 | Nit | `messages/de.json:1649` | «durch eine berichtigte Abrechnung ersetzt» steht auch dann im Protokoll, wenn nie eine berichtigte Abrechnung entsteht (Szenario «Keine berichtigte Abrechnung ohne Mietstage in der Periode»). Der Wortlaut folgt dem Glossar («Ersetzt: Durch eine berichtigte Abrechnung ersetzt»), sachlich ist er also gedeckt. Ob er so bleibt, entscheidet der Fach-Review, nicht dieser Review. |
| C-6 | Nit | `docs/archive/implementation-plan-verlauf.md:1167` | Die ältere Zeile nennt noch `recordStatementCorrection(replaced, replacement)`. Die neue Zeile 1182 stellt das richtig, das passt als Verlauf. Höchstens ein «(später geändert)» anfügen. |

Keine Blocker und keine Major.

## Bestätigt

- **Korrektheit:** `replaceStatement` schreibt Statuswechsel und Eintrag in einer Transaktion (`tx.update` und `recordStatementCorrection(existing, tx)`; `recordAudit` nimmt `tx` als `Writer`). `existing` ist das Ergebnis von `getStatement` und hat deshalb `statementNumber`. Weil der Eintrag erst nach den beiden Prüfungen (`STATEMENT_NOT_FOUND`, `STATEMENT_NOT_REPLACEABLE`) geschrieben wird, entsteht bei einer abgelehnten Ersetzung kein Eintrag.
- **Felder:** `replacementId` und `replacementNumber` kommen sonst nirgends mehr vor (grep über `src`, `tests`, `backend/src` und die Docs). Vertrag `tests/contracts/audit-log.json`, Mapper `src/lib/server/audit-log.ts:45` und Zeile in `api-specification.md` passen zusammen.
- **Migration:** `0019_audit_log.sql` ist unverändert umbenannt. Auf `origin/main` liegt nur `0018_statement_correction.sql`, und sie berührt `audit_log` nicht. `migrate.ts` sortiert nach Dateinamen, die Reihenfolge stimmt also.
- **Texte:** Beide Schlüssel sind in allen vier `messages/*.json` geändert. Die Begriffe entsprechen `i18n-begriffe.md:66` (décompte rectificatif, conteggio rettificato, corrected statement) und dem Glossar, Eintrag «Ersetzt».
- **Tests rot ohne Änderung (beim Lesen geprüft):** Der pg-Test über `POST /statements/:id/replace` scheitert ohne den Aufruf in `replaceStatement`, weil `entry` dann undefined ist. `audit-log-mapping.test.ts` und `privacy-page.dom.test.ts` erwarten den neuen Text, den es vorher nicht gab.
- **Szenario:** Laut Issue #357 («Done means») braucht jede protokollierte Aktion einen `*.pg.test.ts`, ein E2E-Szenario gibt es nur für «Änderungen im Protokoll sehen», und das besteht. Ein fehlendes Szenario ist daher kein Major.
- **Neue Screens oder UI-Zustände:** keine. a11y und `sprachen-bildschirme.feature` sind nicht betroffen.
- **Fremde Änderungen:** keine im Delta.
- **Sicherheit:** Die Route ist unverändert. Ausser Statusnummer und ID gelangen keine neuen Daten zum Client.

## Nicht bestätigt

- lint, check, backend type-check, `bunx vitest run` (2894), `cd backend && bun run test` (881, Coverage 94.8 %), E2E chromium `-g "Protokoll|Datenschutz|berichtig|ersetzt|audit-log "` (41): vom Aufrufer gemeldet. Selbst neu gelaufen: `bunx vitest run src/__tests__/audit-log-mapping.test.ts src/__tests__/privacy-page.dom.test.ts`, 32 von 32 grün.
- Der neue pg-Test ist nur gelesen, nicht ausgeführt (Backend-Tests sind laut Auftrag ausgeschlossen).
- Der fachliche Wortlaut des Protokolleintrags und des Datenschutzabsatzes in fr, it und en (R-4) ist Sache des Fach-Reviews. Hier ist nur der Abgleich mit `i18n-begriffe.md` gemacht.
