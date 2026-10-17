# Code-Review W2e3 (#358 / #120), Fix-Runde nach dem Feature-Review, Runde 1

Bereich: `git diff 1dfdaa2 c543f94` (ein Commit c543f94), gelesen im Worktree `review-w2e3-code`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `backend/src/routes/dashboard.ts:129-136`, `src/routes/statements/[id]/PaymentPanel.svelte:15-16`, `Correction.svelte:56-61,101` | Mehrere Verhaltensänderungen, die der Verwalter sieht, haben kein Szenario und keinen Vermerk `No scenario: <Grund>`, auch nicht im Commit: «Bezahlt diesen Monat» behält die Zahlung einer ersetzten Abrechnung (V-15, ein Bugfix), die ersetzte Abrechnung sagt «gilt nicht mehr» statt «Sie erstatten dem Mieter …», der Link «Mietvertrag öffnen», die Erfolgsmeldung nach dem Ersetzen |
| C-2 | Major | `src/routes/statements/[id]/Correction.svelte:101` | Die Erfolgsmeldung und der Fokus nach dem Ersetzen (Antwort auf C-2 aus w2e2-review-1, dort «mit DOM-Test» verlangt) haben auf keiner Ebene einen Test. Ohne `success=` bleiben alle Tests grün |
| C-3 | Minor | `src/routes/statements/[id]/Correction.svelte:23-30` | Kette (V-12): Der Betrag stimmt jetzt (630.35), der Satz sagt aber «…, die am {paidDate} bezahlt wurden». 442.90 davon wurden an einem anderen Tag auf einer früheren Abrechnung bezahlt. Die Bestätigung nennt damit ein falsches Datum. Der DOM-Test (`statement-pages.dom.test.ts:539-543`) prüft nur den Betrag. Fix: Bei `priorPayments ≠ 0` ohne Datum formulieren oder die Nummern wie `priorPaidOn` nennen |
| C-4 | Minor | `backend/src/services/statement.service.ts:635` | `formatCHF` gruppiert mit `'` (U+0027). Die UI zeigt Franken mit `’` (`src/lib/utils/format.ts:26-29`). Die Absage zeigt also «CHF 1'036.00», die Seite daneben «CHF 1’036.00». Der Testkommentar «as the UI shows francs» (`statement-correction.pg.test.ts:295`) stimmt deshalb nicht genau. Fix: Den Betrag als Zahl im Parameter liefern und im BFF mit `formatCurrency` formatieren, oder das Zeichen angleichen |
| C-5 | Minor | `src/routes/statements/[id]/Correction.svelte:18-22` | Eine versendete berichtigte Abrechnung mit `priorPayments` (z. B. 442.90), die erneut ersetzt wird, zeigt `statements_correct_open`. Dass die nächste Abrechnung die 442.90 weiter anrechnet (`paidSoFar`, `statement.service.ts:354`), steht nirgends. Die Folge ist nur teilweise genannt (V-12 «Kette») |
| C-6 | Minor | `src/routes/statements/[id]/PaymentPanel.svelte:34-40` | Bei einer ersetzten Abrechnung bleiben «Zahlungsfrist» bzw. «Rückerstattung bis» mit Datum stehen, direkt unter «gilt nicht mehr». Das ist derselbe Widerspruch wie C-6/P-4, nur kleiner |
| C-7 | Minor | `src/routes/statements/[id]/Correction.svelte:78` | Der Knopf «Berichtigte Abrechnung erstellen» nutzt `disabled={creating}` statt der Button-Prop `busy` (`src/lib/ui/Button.svelte:38`, mit `busyLabel`). Damit fehlt der sichtbare und vorgelesene Hinweis «Bitte warten». ponytail `reuse:` `busy={creating}` |
| C-8 | Nit | `src/routes/statements/[id]/+page.svelte:65-66,161` | ponytail `shrink:` `laterHint`, ein `$derived` mit einem Aufrufer → `{#if data.laterInvoices && statement.status !== 'replaced'}` (−2 Zeilen) |
| C-9 | Nit | `src/routes/statements/[id]/PaymentPanel.svelte:17-21` | Die verschachtelte Bedingung ist nicht nach Prettier eingerückt (`bunx prettier … \| diff` zeigt die Zeilen 18-21). Das sind eigene geänderte Zeilen |
| C-10 | Nit | `tests/e2e/features/statement-generate.feature:47-55` | Der Kommentar sagt «der Lauf erstellt ihre berichtigte». Das Szenario prüft aber nur die Anzahl, nicht dass die neue Abrechnung die ersetzte nennt (#358 «Done means»: «verknüpft»). Ein Schritt «nennt die Abrechnung, dass sie die Abrechnung 2024 von "Eva Frei" ersetzt» gibt es schon (`statement-detail.feature:602`) |
| C-11 | Nit | `src/routes/statements/[id]/Correction.svelte:56-61` | Der Link «Mietvertrag öffnen» ist ein reiner Textlink ohne `min-h-12`. Er folgt demselben Muster wie `statement-replaced-by-link` daneben; `InvoiceFacts.svelte:48` zeigt die 48-px-Variante |

## C-1 (Major) Verhaltensänderungen ohne Szenario

**Warum falsch.** Laut CLAUDE.md, Workflow Schritt 1, beginnt jede Verhaltensänderung, auch ein sichtbarer Bugfix, mit einem Szenario in `tests/e2e/features`, oder sie trägt `No scenario: <Grund>`. Der Commit ändert, was der Verwalter sieht:
- Dashboard «Bezahlt diesen Monat» (V-15): Eine bezahlte und danach ersetzte Abrechnung zählt jetzt mit (`dashboard.ts:131-135`). Der Fehler wird nur im pg-Test gezeigt (`dashboard.pg.test.ts:83-84,127`).
- Die ersetzte Abrechnung sagt «Diese Abrechnung ist ersetzt und gilt nicht mehr …» (`PaymentPanel.svelte:15-16`), ohne Hinweis auf später erfasste Rechnungen (`+page.svelte:66`). Dazu kommt der Link «Mietvertrag öffnen» (`Correction.svelte:56-61`).

`grep -rn "diesen Monat\|Mietvertrag öffnen\|gilt nicht mehr" tests/e2e/features` findet nur den PDF-Satz (`statement-detail.feature:679`). Das Szenario «Ersetzte Abrechnung bleibt unverändert» (`statement-detail.feature:628-636`) prüft weder die Zusammenfassung noch den Hinweis noch den Link. Der Commit nennt kein `No scenario:`.

**So zeigt man es.** `PaymentPanel.svelte:15-16` auf den Stand vor dem Commit zurücknehmen, oder in `dashboard.ts` wieder nur `owed('paid')` verwenden: Kein Szenario in `tests/e2e/features` schlägt fehl.

**Fix.** Im Szenario «Ersetzte Abrechnung bleibt unverändert» einen Schritt ergänzen, der die Zusammenfassung als Text abfragt («… gilt nicht mehr»), und einen, der sagt, dass kein Hinweis auf geänderte Rechnungen erscheint (der Schritt «weist die Abrechnung auf keine geänderten Rechnungen hin» besteht schon, `statement-detail.feature:590`). Für das Dashboard braucht es ein Szenario «Bezahlt diesen Monat» nach dem Ersetzen. Ist das im E2E-Stack nicht isoliert möglich (die Summe läuft über alle Abrechnungen), gehört ein `No scenario: <Grund>` mit Verweis auf den pg-Test in die PR-Beschreibung.

## C-2 (Major) Die Erfolgsmeldung nach dem Ersetzen ist ungetestet

**Warum falsch.** C-2 aus `docs/reviews/w2e2-review-1.md:9` verlangte die Meldung «mit DOM-Test». CLAUDE.md, Workflow Schritt 6: Ein Fix, der Verhalten ändert, bekommt zuerst einen fehlschlagenden Test. `grep -rn "?/replace\|statement-correct-confirm" src/__tests__ tests/e2e/screenplay` findet nur die Prüfung der Knopfbeschriftung (`statement-pages.dom.test.ts:524`). Die Meldung «Die Abrechnung ist ersetzt.» und der Fokus auf `h1` sind auf keiner Ebene geprüft.

**So zeigt man es.** `success={m.statements_replaced_done()}` in `Correction.svelte:101` entfernen und dann `bunx vitest run src/__tests__/statement-pages.dom.test.ts` laufen lassen: Alles bleibt grün.

**Fix.** Ein DOM-Test nach dem Muster von «bestätigt den Zahlungseingang und setzt den Fokus auf den Titel» (`statement-pages.dom.test.ts:1113-1125`): `actions.get('?/replace')` mit `result: { type: 'success' }` aufrufen, dann `toasts` = `['Die Abrechnung ist ersetzt.']` und `document.activeElement` = `h1` prüfen.

## Bestätigt (Code und Test gelesen)

- **C-1 (Szenario Abrechnungslauf):** `statement-generate.feature:47-55`, `@api`, die Schritte gibt es. Ohne `replacedHere` (`src/lib/server/statement-generation.ts:57-62`) zählt Eva als abgerechnet, und es entsteht 0 statt 1. Das Szenario wird also rot.
- **C-3 / V-12:** Der Betrag ist `paidAmount + priorPayments`, genau wie `paidSoFar` im Backend. Bei 0 erscheint der Satz `statements_correct_settled`. Die DOM-Tests dazu (`:539-550`) werden ohne die Änderung rot. Den verbleibenden Datumsfehler beschreibt C-3 oben.
- **V-13:** Die Rückerstattung hat einen eigenen Text. Der DOM-Test (`:553-558`) wird ohne die Änderung rot.
- **C-4:** Der Knopf ist gesperrt, solange er läuft. Der DOM-Test (`:613-618`) wird ohne die Änderung rot, siehe aber C-7.
- **C-5:** `MoreActions.svelte` rendert bei `replaced` kein Panel. Der DOM-Test (`:591-597`) wird ohne die Änderung rot. `status !== 'draft'` deckt dieselben Status ab wie vorher die Liste (`StatementStatus`, `types.ts:275`).
- **C-6:** Die Zusammenfassung ist gelöst, der DOM-Test wird ohne die Änderung rot.
- **C-8:** Der Test für «überfällig» (`:560-563`) sichert gegen Rückschritte. Er war vorher nicht rot, weil `overdue` schon in der Liste stand; mehr verlangte C-8 nicht.
- **C-9:** Marker `TODO(fachlich prüfen, #362)` in `pdf.service.ts:600`.
- **C-10:** fr verwendet überall «rectificatif», `i18n-begriffe.md` hat die neuen Zeilen.
- **C-15:** Nur die zwei Rückgabeobjekte in `statement-actions.ts` sind umformatiert, siehe C-9.
- **V-15:** Der pg-Test (270 statt 230) wird ohne die Änderung rot.
- **V-16 / V-21:** Die en-Texte sind angepasst.
- **V-17:** Der PDF-Satz steht in vier Sprachen. `replacesPay` wird angehängt statt per `replace(/\.$/…)`. Die Tests `statement-pdf-render.test.ts:380,388` und die E2E-Zeile `statement-detail.feature:679` sind angepasst.
- **V-19:** `formatCHF` ist eingebaut, siehe C-4.
- **V-20:** Marker und Glossarzeilen sind da.
- **Personas:** Die Texte im Dialog, der Bestätigungsknopf `statements_correct` und die Reihenfolge «nicht rückgängig» vor der Verjährung sind umgesetzt. Ein DOM-Test zeigt die Reihenfolge (`:524-525`). Kein Hinweis auf später erfasste Rechnungen (`:599-603`). Der Link zum Mietvertrag (`:606-609`). Der Mapper liefert `contractId` und `paidAmount` (`statement-mapping.test.ts:55`), der Contract `tests/contracts/statement.json` ist ergänzt. Weber P-1 zu Recht abgelehnt: Die Datenprüfung bestätigt 43.77 → 43.80 (Rundung zugunsten des Mieters, `w2e-datenpruefung-1.md:23`).
- **Texte:** Alle neuen Schlüssel (`statements_correct_open_refund`, `_settled`, `statements_replaced_done`, `statements_summary_replaced`, `statements_replaced_contract`) stehen in allen vier `messages/*.json`. Der entfernte Schlüssel `statements_correct_confirm` wird nirgends mehr verwendet.
- **Bildschirme:** Kein neuer Zustand. `statement-replaced-detail` und `correct-dialog` stehen schon in `tests/a11y/screens.json:35,483`.
- **Nicht zugehörige Änderungen:** keine. Die fr-Zeile `statements_missing_consequence` gehört zu C-10.

## Nicht bestätigt

- Neu ausgeführt: `bunx vitest run src/__tests__/statement-pages.dom.test.ts src/__tests__/statement-mapping.test.ts`, 130 grün.
- Vom Aufrufer gemeldet, nicht neu ausgeführt: `bunx vitest run` (2837), `bun run check`, `bun run lint`, `cd backend && bun run type-check && bun run test` (843, Coverage 94.6 %). Damit auch `dashboard.pg.test.ts`, `statement-correction.pg.test.ts`, `statement-pdf-render.test.ts` und `api-contracts.pg.test.ts` mit dem ergänzten Contract.
- Das volle E2E läuft laut Aufrufer noch. Dass das neue Szenario im Abrechnungslauf grün ist und die geänderte PDF-Zeile in `statement-detail.feature:679` passt, ist nicht bestätigt. Gelesen: Schritte und `statement-generation.ts`.
- axe und Sprachen-Läufe (fr/it/en ohne Deutsch) für die geänderten Texte auf `statement-replaced-detail` und `correct-dialog`: nicht ausgeführt.
- `open-work`/`check-issues` für den neuen Marker #362 (ob das Issue offen ist und das richtige Label hat): nicht geprüft, kein Zugriff auf GitHub verwendet.
- PDF-Texte fr/it/en (`pdf.service.ts:151-152,235-236,319-320`): nur gelesen, kein Test für diese Sprachen im Diff.
