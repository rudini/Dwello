# Code-Review #447, Runde 1

Gegenstand: `git diff c09ec4fd 151a17c8` (0dcdbcea rote Tests und @wip-Szenarien, 151a17c8 Umsetzung), Worktree `review-447-code` (detached 151a17c8). Alle 32 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `src/routes/statements/[id]/Correction.svelte:15-36`, `messages/*.json` (`statements_correct_refunded_chain`, `statements_correct_paid_chain`) | Sichtbare Verhaltensänderung (V-1: neuer Hinweis beim Berichtigen einer Kette mit Rückerstattung, «insgesamt» im Hinweis einer bezahlten Kette) ohne Szenario in `tests/e2e/features` und ohne `No scenario: <Grund>`. |

## Blocker/Major im Einzelnen

### C-1: Hinweis beim Berichtigen einer Kette ohne Szenario
- Warum falsch: Die Änderung behebt einen Fehler, den der Liegenschaftsverwalter sieht. Bisher stand bei jeder Kette «… bezahlt wurden», auch wenn der Vermieter netto zurückerstattet hatte (Fachreview V-1). Neu wählt `offsetText[offset < 0 ? 'refunded' : 'paid'][priorPayments ? 1 : 0]` den Text `statements_correct_refunded_chain`, und `statements_correct_paid_chain` sagt neu «insgesamt». `CLAUDE.md`, Workflow 1, verlangt dafür ein Szenario ohne `@wip` oder, wenn der E2E-Stack den Zustand nicht erzeugen kann, `No scenario: <Grund>`. Beides fehlt: `grep -rn 'Die berichtigte Abrechnung rechnet\|ersetzten Abrechnungen' tests/e2e` findet nur die Saldo-Zeile in `help.feature:48`. Die Szenarien zur Berichtigung in `statement-detail.feature:706-790` prüfen den Hinweis im Bestätigungsdialog nicht. Die Commit-Nachricht 151a17c8 nennt keinen Grund.
- Abgedeckt ist es nur auf DOM-Ebene: `statement-pages.dom.test.ts:571-579`. Der Test ist rot ohne die Änderung (vorher erschien `paid_chain` mit «bezahlt wurden»).
- So zeigt man es: Es gibt kein Feature-Szenario, das ohne die Änderung rot wird. Wird `Correction.svelte` auf die alte Zeile `if (statement.priorPayments) return m.statements_correct_paid_chain(paid);` zurückgesetzt, bleibt jede Szenario-Datei grün.
- Lösung: Ein Szenario in `statement-detail.feature` mit einer Kette, in der netto zurückerstattet wurde. Beispiel: Rückerstattung bezahlt, berichtigt, die berichtigte Abrechnung bezahlt, dann noch einmal berichtigen. Es prüft den Hinweis «… die Sie auf diese und die ersetzten Abrechnungen insgesamt zurückerstattet haben.». Wenn die Seed-Schritte diese Kette nicht erzeugen können: `No scenario: <Grund>` im Pull Request, mit dem DOM-Test als tiefster Schicht.

## Bestätigt (Anforderung gegen Code und Test)

- Eigener Satz 0 %, Feld: `src/lib/contract-form.ts:110-115` (`ownRateError`), Unit-Test `contract-form.test.ts:154-165` (0, 0,00, 0.0). Rot auf der Basis, weil die alte Prüfung `isFeeRate` 0 annahm. Neuer Wizard und Bearbeiten nutzen beide `validateContract` (`ContractWizard`/`contract-wizard.ts:63`, `ContractForm.svelte:161`).
- Eigener Satz 0 %, Backend: Das Muster in `backend/src/routes/contracts.ts:41-44` lehnt `0`, `0.0` und `0.00` ab. Es nimmt `0.01` bis `0.99`, `1` bis `9.99` und `10`/`10.0`/`10.00` an. Von Hand geprüft: `0.1`, `0.10`, `0.05` passen, `00.5` nicht. Den Wert, den der BFF sendet (`String(parsePercent(...))`, z. B. `0.05`, `2.5`), deckt das Muster ab. Test `management-fee.pg.test.ts:224-229`, rot auf der Basis (altes `\d(\.\d{1,2})?` nahm 0 an).
- Satz des Abrechnungslaufs bleibt 0 bis 10: `isFeeRate` (`format.ts:81`), `settings.ts:53` und `statement-wizard.ts:52` sind unverändert. `statements_error_fee` bleibt «von 0 bis 10», die bestehenden Tests in `settings.test.ts` und `statement-wizard*.test.ts` behalten den Text.
- V-2: eigener Text `contracts_error_fee_rate` «von 0,01 bis 10» in allen vier Sprachen, Unit-Test angepasst.
- Feldfehler in allen vier Sprachen wie im Entscheid. fr mit U+00A0 in den Guillemets (V-4, per `cat -A` geprüft).
- «bis 3 %» in `glossary_fee_text` und `config_help_management_fee` in allen vier Sprachen. Tests: `help-page.dom.test.ts`, `config-pages.test.ts`, `help.feature`. Dazu `nebenkostenabrechnung-anforderungen.md:60` (V-11).
- it «Costi dell’immobile» in `statements_building_costs`, PDF `totalAmount`, `sharesNote`, `sharesNoteFuel` und `i18n-begriffe.md`. Render-Test mit `not.toContain('Costi immobile')` (V-6).
- `glossary_balance_text` nennt in allen vier Sprachen das schon Bezahlte und das schon Zurückerstattete auf den ersetzten Abrechnungen, it mit «Lei» (V-3). `audit_empty_text` nennt die vorgeschlagene Verwaltungspauschale und die berichtigten Abrechnungen (V-12, DOM-Test).
- Marker #286, #294, #362, #369 und #370 sind entfernt. `grep` in `src backend/src tests messages` findet keinen Marker mehr. Es bleibt nur die Glossar-Zeile `i18n-begriffe.md:82` «(#362)», und die ist kein Marker.
- Szenarien «Eigener Satz von 0 % wird abgelehnt» (`contract-new.feature`) und «… beim Bearbeiten abgelehnt» (`contract-edit.feature`) sind ohne `@wip`. Die Schritte rufen nur Tasks auf (`reviewContract`, `agreeManagementFee(rate)`), die Prüfung geht über die bestehende Frage `errorMessageShown`. Die Features sagen, was der Verwalter will. Ohne die Änderung schlägt das Szenario beim Then fehl (der Wizard ginge weiter zur Prüfung, die Fehlermeldung fehlt), nicht in einem fehlenden Schritt.
- Neue Bildschirme oder Zustände gibt es keine: Der Feldfehler steht an einem bestehenden Feld. API-Antworten sind unverändert, daher kein Vertrag in `tests/contracts` nötig. Design-Tokens: kein Markup geändert.
- Ponytail: `ownRateError` und `offsetText` werden genutzt. `statements_error_fee` wird weiter von Einstellungen und Wizard genutzt. Kein toter Code.
- Neu ausgeführt: `bunx vitest run` mit `contract-form.test.ts`, `statement-pages.dom.test.ts`, `help-page.dom.test.ts`, `audit-log-page.dom.test.ts` und `config-pages.test.ts`: 5 Dateien, 175 Tests grün.

## Nicht bestätigt

- vom Aufrufer gemeldet: `bunx vitest run` gesamt (3143 grün, 2 Timeouts), `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bun test management-fee.pg.test.ts statement-pdf-render.test.ts` (82 grün) und die roten Läufe auf 0dcdbcea. Die roten Läufe habe ich nur durch Lesen beurteilt: Jeder neue oder geänderte Test schlägt ohne die Änderung fehl.
- E2E der betroffenen Features: läuft beim Aufrufer, Ergebnis offen. Ob `errorMessageShown` den Feldfehler am Satzfeld im Wizard und im Bearbeitungsformular findet, habe ich nur aus dem Code geschlossen (gleiche Frage wie bei den übrigen Feldfehlern).
- Fachreview V-7 (fehlende Zeilen «Eigener Satz» und «Satz des Abrechnungslaufs» in `i18n-begriffe.md`, laut Fachreview als Issue mit `fachlich`/`entscheiden`): Der Diff enthält keine Zeile und keinen Verweis darauf. Ob das Issue eröffnet ist, konnte ich nicht prüfen, weil die Issue-Suche über `gh api search/issues` in dieser Sitzung gesperrt ist (403). Ebenso nicht geprüft: Einträge im Plan (`implementation_plan.md` ist nicht im Diff).
- Bestehende Mietverträge mit gespeichertem eigenem Satz 0 % («Stop and ask» des Issues): Der Bearbeiten-Pfad lädt sie als «own» mit 0 und lehnt sie beim nächsten Speichern mit dem neuen Feldfehler ab. Das ist das im Issue zugelassene Verhalten. In Demo- und Seed-Daten fand `grep` keinen Satz 0. Eine Installation mit solchen Daten konnte ich nicht prüfen.
