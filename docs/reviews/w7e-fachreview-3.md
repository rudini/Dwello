# Fachreview 3: Protokoll (#357), Eintrag zur berichtigten Abrechnung und Datenschutzerklärung

Gegenstand: `git diff 95dbddb 4116c18` im Worktree `/tmp/claude-0/-home-user-Dwello/3eb48ef7-ceb3-5923-ae2d-df5dd75846f5/scratchpad/review-audit-fach3`. Alle Pfade beziehen sich auf diesen Worktree. Geprüft wurden `audit_statement_corrected` und `audit_privacy` in `messages/{de,fr,it,en}.json`, die Schreibstelle `replaceStatement` (`backend/src/services/statement.service.ts:603-613`), `recordStatementCorrection` (`backend/src/services/audit-log.service.ts:26-28`), die Anzeige (`src/lib/server/audit-log.ts:45`), `docs/api-specification.md:210` und der neue DOM-Test (`src/__tests__/privacy-page.dom.test.ts:104-113`). Massstab waren `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md` und die Texte `statements_correct_*` aus #358.

## Ergebnis

Kein Blocker, kein Major, kein Minor. Der Eintrag passt zu Glossar, Begriffsliste und den Texten aus #358. R-4 ist für die berichtigten Abrechnungen behoben. Die Datenschutzerklärung nennt jetzt alle sechs Arten von Einträgen. Offen bleiben zwei Nit.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| R-6 | Rechtstexte | Nit | `audit_privacy` nennt bei «zurückgesetzte Zahlungen» weiterhin nicht, was festgehalten wird (Abrechnungsnummer, Zahlungsdatum). Das ist der Rest von R-4 |
| V-17 | Verwalter | Nit | de: «zurückgesetzte Zahlungen und Abrechnungen, die … ersetzt wurden» lässt sich auch als «zurückgesetzte … Abrechnungen» lesen |

Mietrecht (M): kein Befund. Der Eintrag wird dem Mieter weder gezeigt noch zugestellt und ändert keinen Betrag.

---

## Prüfung von R-4 (Runde 2)

| Teil von R-4 | Status | Beleg |
|---|---|---|
| Den Absatz um die berichtigten Abrechnungen ergänzen, sobald #358 `recordStatementCorrection` aufruft | **behoben** | `statement.service.ts:608-611` schreibt den Eintrag in derselben Transaktion wie den Status `replaced`. In allen vier Sprachen nennt `audit_privacy` die Abrechnungen, die ersetzt wurden, mit ihrer Nummer. Gespeichert werden nur `statementId` und `number` (`audit-log.service.ts:28`, Test `audit-log.pg.test.ts:211-212`). Die Angabe «(mit ihrer Nummer)» ist also vollständig. |
| «auch wenn Sie die Rechnung oder die Abrechnung löschen» | **zurückgezogen** | Mein Vorschlag aus Runde 2 ging von einer falschen Annahme aus. Gelöscht werden kann nur ein Entwurf (`statement.service.ts:657-660`, `STATEMENT_NOT_DRAFT`). Eine ersetzte, versendete oder zurückgesetzte Abrechnung ist nie ein Entwurf. Mieter, Wohnung und Vertrag lassen sich nicht löschen, solange es eine Abrechnung gibt (`schema.ts:385-391`, `onDelete: 'restrict'`). Der Satz «Die Einträge bleiben, auch wenn Sie die Rechnung löschen» ist deshalb vollständig und richtig. |
| Inhalt des Eintrags zur zurückgesetzten Zahlung (Nummer, Zahlungsdatum) | **offen**, siehe R-6 | |

## R-6 (Nit): Inhalt des Eintrags zur zurückgesetzten Zahlung

**Beleg:** `statement.service.ts:595` speichert `{ statementId, number, paidDate }`. In `messages/de.json` sagt `audit_privacy` «sowie zurückgesetzte Zahlungen und Abrechnungen, die durch eine berichtigte Abrechnung ersetzt wurden (mit ihrer Nummer)». Bei den Rechnungen und neu bei den ersetzten Abrechnungen steht im Absatz, was gespeichert wird, bei den Zahlungen nicht.

**Warum nur ein Nit:** Die Nummer (`NK-<Gebäude-ID>-<Jahr>-…`, `calculation.service.ts:465`) enthält keinen Namen. Das Zahlungsdatum ist ein Datum zum Vorgang. Der Zweck ist genannt. Die Lücke ist uneinheitlich, aber nicht irreführend.

**Korrektur:** de «… sowie zurückgesetzte Zahlungen (mit Abrechnungsnummer und Zahlungsdatum) und Abrechnungen, die durch eine berichtigte Abrechnung ersetzt wurden (mit ihrer Nummer).». fr «… ainsi que les paiements retirés (avec numéro du décompte et date de paiement) et les décomptes remplacés par un décompte rectificatif (avec leur numéro).». it «… nonché i pagamenti rimossi (con numero del conteggio e data di pagamento) e i conteggi sostituiti da un conteggio rettificato (con il loro numero).». en «… reset payments (with statement number and payment date), and statements replaced by a corrected statement (with their number).». Der DOM-Test `privacy-page.dom.test.ts:108-110` prüft den Satz wörtlich und müsste mit angepasst werden. Mit diesem Wortlaut wäre auch V-17 erledigt.

## V-17 (Nit): Bezug von «zurückgesetzte» im deutschen Absatz

**Beleg:** de «sowie zurückgesetzte Zahlungen und Abrechnungen, die durch eine berichtigte Abrechnung ersetzt wurden». Das Adjektiv kann man auf beide Nomen beziehen («zurückgesetzte Abrechnungen»). Erst der Relativsatz macht den Bezug klar. In fr, it und en wiederholen Artikel bzw. Komma den Bezug («les paiements retirés et les décomptes remplacés», «i pagamenti rimossi e i conteggi sostituiti», «reset payments, and statements replaced»), deshalb ist er dort eindeutig.

**Korrektur:** Der Wortlaut aus R-6 trennt die beiden Teile. Ohne R-6 genügt «… sowie zurückgesetzte Zahlungen und die Abrechnungen, die durch eine berichtigte Abrechnung ersetzt wurden (mit ihrer Nummer).».

---

## Bestätigt

- **Glossar.** «Abrechnung {number} durch eine berichtigte Abrechnung ersetzt» übernimmt wörtlich die Statusdefinition «**Ersetzt**: Durch eine berichtigte Abrechnung ersetzt» (`UBIQUITOUS_LANGUAGE.md:173`) und passt zu «Berichtigte Abrechnung» (Z. 161).
- **Unbestimmter Artikel «eine».** Der Eintrag entsteht beim Ersetzen (`replaceStatement`). Die berichtigte Abrechnung wird erst danach als Entwurf erstellt, oder gar nicht (Szenario `statement-detail.feature:607-615`). Mit «eine» und ohne deren Nummer behauptet der Eintrag nichts, was zu diesem Zeitpunkt noch nicht feststeht. Der frühere Text «durch die berichtigte Abrechnung {replacement}» hätte das getan. Dieselbe Formulierung steht in der Bestätigung von #358 («Die Abrechnung {number} wird durch eine berichtigte Abrechnung ersetzt», `statements_correct_open` … `_settled`, `messages/de.json:967-972`). Für den Verwalter genügt das: Die berichtigte Abrechnung nennt die ersetzte («ersetzt NK-…», Glossar Z. 161, Szenario Z. 615), die Verbindung lässt sich also von dort aus finden.
- **Einmalig.** Pro Ersetzen entsteht genau ein Eintrag. Eine Abrechnung, die schon ersetzt ist, lässt sich nicht noch einmal ersetzen (`statement.service.ts:606-607`). Wird eine berichtigte Abrechnung später selbst ersetzt, bekommt sie ihren eigenen Eintrag mit ihrer eigenen Nummer. Das ist richtig.
- **Begriffe fr/it/en** (`docs/design/i18n-begriffe.md:66-68`): décompte rectificatif / conteggio rettificato / corrected statement; remplacé / sostituito / replaced. Der Eintrag und der Absatz verwenden diese Begriffe in allen drei Sprachen, so wie `statements_correct_open` («remplacé par un décompte rectificatif», «sostituito da un conteggio rettificato», «replaced by a corrected statement»). Das abweichende «décompte rectifié» aus Runde 2 ist weg. Genus und Numerus stimmen («Décompte … remplacé», «Conteggio … sostituito», «les décomptes remplacés … (avec leur numéro)», «i conteggi sostituiti … (con il loro numero)»).
- **Französische Typografie:** Im geänderten Teil ist keine Stelle betroffen. Der Rest des Absatzes ist unverändert und wurde in Runde 2 geprüft.
- **Vollständigkeit der Datenschutzerklärung.** Gesucht in `backend/src`. Es gibt genau sechs Schreibstellen: `login` (`routes/audit-log.ts:15`), `management_fee_changed` (`config.service.ts:211, 273`), `category_allocability_changed` (`category.service.ts:195`), `invoice_allocability_changed` (`invoice.service.ts:349`), `payment_reset` (`statement.service.ts:595`) und `statement_corrected` (`statement.service.ts:610`). `audit_privacy` nennt alle sechs. Die Einschränkung zum Inhalt steht unter R-6.
- **Keine Mieternamen** im neuen Snapshot. Die Nummer enthält Gebäude-ID und Jahr (`calculation.service.ts:465`).
- **Ort des Absatzes:** unverändert unter «Welche Daten Dwello speichert» (`src/routes/privacy/+page.svelte:23`).
- **Dokumentation:** `docs/api-specification.md:210` nennt jetzt die richtige Route und die richtigen Felder.
- **Formeln:** keine. Der Eintrag enthält keinen Betrag.

## Fehlende Begriffe

Keine neuen. «Protokoll» bleibt offen in #370.

## Nicht bestätigt

- **DSG-Wortlaut** (Art. 19 Abs. 1 und 2, Art. 6 Abs. 2): Er stammt aus Runde 1 (Fedlex, SR 235.1). In dieser Runde habe ich ihn nicht erneut abgerufen, weil die Änderung an der Anwendung nichts ändert.
- **E2E:** Kein Szenario zeigt den Eintrag «Abrechnung … durch eine berichtigte Abrechnung ersetzt» im Protokoll (gesucht in `tests/e2e/features/settings.feature` und `statement-detail.feature`). Den Text prüft nur der Abbildungstest (`src/__tests__/audit-log-mapping.test.ts`). Auch `privacy.feature:34-36` prüft den neuen Satz nicht, das tut der DOM-Test. Ob es dafür ein Szenario braucht, entscheidet der `code-reviewer`, nicht die Fachprüfung.
- **Bestehende Einträge mit `replacementNumber`:** Vor diesem Commit hat keine Produktivstelle `recordStatementCorrection` aufgerufen, und die Migration ist nur umbenannt (0018 nach 0019). Daten im alten Format sollte es also keine geben. Gegen eine Datenbank habe ich das nicht geprüft.
