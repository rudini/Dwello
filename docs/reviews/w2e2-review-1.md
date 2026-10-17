# Code-Review W2e Slices 2 (UI) und 3 (PDF) und Merge 1dfdaa2, Runde 1

Gegenstand: `git diff d53f732 f0f8a92` (f9ce273 UI, f0f8a92 PDF, mit den Fixes aus `docs/reviews/w2e1-review-1.md`), 2f3edef (Migration umbenannt in 0018), Merge 1dfdaa2 (`git show --cc` für `pdf.service.ts`, `+page.svelte`, `api-specification.md`, `tests/e2e/{questions,steps,targets}/statement-detail.ts`). Worktree `review-w2e2-code` (detached, 1dfdaa2).
Anforderung: #358 «Done means», Fachreview `docs/reviews/w2e-fachreview-1.md` (V-1..V-11, M-1, G-1), Slice-1-Review C-1..C-11.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `tests/e2e/features/statement-generate.feature` (fehlt) | Der Abrechnungslauf, der einen ersetzten Mietvertrag wieder abrechnet und die neue Abrechnung mit der ersetzten verknüpft (#358 «Done means», 3. Punkt), hat kein Szenario und kein `No scenario: <Grund>`. Fachreview V-9 hatte es verlangt |
| C-2 | Minor | `src/routes/statements/[id]/Correction.svelte:90-97` | Der Dialog «Abrechnung ersetzen» übergibt `FormDialog` kein `success`: Danach kommt keine Bestätigung, und der Fokus geht verloren, weil der Auslöser «Abrechnung berichtigen» verschwindet (`FormDialog.svelte:51-55` behandelt genau diesen Fall nur mit `success`). Fix: `success={m.statements_replaced_done({ number })}`, in vier Sprachen, mit DOM-Test |
| C-3 | Minor | `src/routes/statements/[id]/Correction.svelte:16-27` | Für «bezahlt» nennt der Dialog `abs(balance)` als angerechneten Betrag. Bei Saldo 0 (seit dem Merge beim Versand sofort `paid`) steht dann «rechnet die CHF 0.00 an, die … bezahlt wurden». Bei einer bezahlten berichtigten Abrechnung fehlt `priorPayments`, obwohl die nächste Abrechnung `paidAmount + priorPayments` anrechnet (`paidSoFar`, `statement.service.ts:354`). Fix: den Betrag aus `balance + priorPayments` bilden, für 0 einen eigenen Satz |
| C-4 | Minor | `src/routes/statements/[id]/Correction.svelte:69-76` | «Berichtigte Abrechnung erstellen» ist ein schlichtes `use:enhance` ohne `busy`. Ein Doppelklick schickt zwei POSTs; der zweite läuft auf `statements_replaces_idx` und endet als `CALCULATION_FAILED` («Versuchen Sie es erneut»). Das ist der UI-Teil von Slice-1-C-8. Fix: `busy` wie in `FormDialog` (`dialogSubmit`) |
| C-5 | Minor | `src/routes/statements/[id]/+page.svelte:190-196`, `MoreActions.svelte:15-32` | Bei einer ersetzten Abrechnung bleibt das Panel «Weitere Aktionen» leer: Bearbeiten, Berichtigen und Löschen sind alle aus. Das ist eine Überschrift ohne Funktion (Design-Regeln, Anti-Patterns). Fix: Panel bei `status === 'replaced'` weglassen |
| C-6 | Minor | `src/routes/statements/[id]/PaymentPanel.svelte:13-19` | Eine ersetzte, unbezahlte Abrechnung sagt weiter «Der Mieter bezahlt die Nachzahlung von CHF …», mit Zahlungsfrist. Das widerspricht «Diese Abrechnung ist ersetzt» und PDF-Satz «gilt nicht mehr». Fix: bei `replaced` die Zusammenfassung weglassen oder in die Vergangenheit setzen; der Saldo selbst bleibt (Entscheid #120) |
| C-7 | Minor | `src/routes/statements/[id]/edit/+page.server.ts:32` | `PUT /:id` liefert jetzt `STATEMENT_REPLACED` (C-4 aus Slice 1). Die Bearbeitungsseite zeigt aber nur `statements_save_failed` («Versuchen Sie es erneut»), etwa aus einem alten Tab. `backend_statement_replaced` erscheint so in der UI nie. Fix: `backendMessage(await response.json(), m.statements_save_failed())`, mit Test aus einem Contract |
| C-8 | Minor | `src/routes/statements/[id]/MoreActions.svelte:22` | Kein Test zeigt, dass eine **überfällige** Abrechnung «Abrechnung berichtigen» anbietet (#358 nennt sent, overdue, paid). Ohne `'overdue'` in der Liste bleiben DOM-Tests und E2E grün. Fix: DOM-Test `detail({ status: 'overdue' })` |
| C-9 | Minor | `backend/src/services/pdf.service.ts:178-181` (und fr/it/en) | Die Zeile «Bereits bezahlt auf …» / «Bereits zurückerstattet auf …» geht im PDF an den Mieter, hat aber keinen Marker `TODO(fachlich prüfen, #362)`. Nur `CostTable.svelte:19` trägt ihn. Fix: den Marker bei den PDF-Texten setzen |
| C-10 | Nit | `messages/fr.json:1209`, `docs/design/i18n-begriffe.md` | fr nennt es neu «décompte rectificatif», in `statements_missing_consequence` steht weiter «décompte rectifié». `i18n-begriffe.md` hat weder «Berichtigte Abrechnung» noch «Ersetzt» noch «Bereits bezahlt» |
| C-11 | Nit | `src/routes/statements/[id]/CostTable.svelte:17-60,173-184` | ponytail `shrink:` Array `adjustments` mit `signed`, `getLocale` und Spread-Bedingungen (+40 Zeilen) für eine zusätzliche Zeile. Ein weiterer Block `{#if prior}…{/if}` neben den bestehenden Rundungszeilen genügt |
| C-12 | Nit | `backend/src/services/pdf.service.ts:259-270` | ponytail `stdlib:` Die Aufzählung mit `slice/join` und vier Schlüsseln `and` wird zu `new Intl.ListFormat(language, { type: 'conjunction' }).format(paidOn)`, wie in `CostTable.svelte`; `yagni:` `priorRow` hat einen Aufrufer, inline |
| C-13 | Nit | `src/lib/server/statement.ts:60-66` | ponytail `yagni:` `correctionOf` hat einen Aufrufer; die vier Felder direkt in `toStatement` |
| C-14 | Nit | `src/routes/statements/[id]/MoreActions.svelte:23` | «Abrechnung berichtigen» hat dasselbe Icon `edit` wie «Bearbeiten» direkt darüber |
| C-15 | Nit | `src/lib/server/statement-actions.ts:52,59` | Eigene neue Zeilen über `printWidth` (Prettier); die Datei ist schon vorher nicht sauber, darum nur die eigenen Zeilen |
| C-16 | Nit | `tests/e2e/questions/statement-detail.ts` (`changeOffers`) | Die Frage summiert fünf Zählungen. Schlägt die Prüfung fehl, zeigt sie «1», aber nicht welches Angebot. Besser: die Namen der sichtbaren Angebote als Liste, Erwartung `[]` |

## C-1 (Major) Der Abrechnungslauf nach dem Ersetzen hat kein Szenario

**Beleg.** #358 «Done means», 3. Punkt: «a statement run of that period bills the contract again and links the new statement to the replaced one». `grep -rln ersetzt tests/e2e/features/` findet nur `contract-detail`, `contract-edit`, `statement-detail` und (anderes Thema) `invoice-detail.feature`. `statement-generate.feature` hat kein Szenario mit einer ersetzten Abrechnung. Das Verhalten prüfen nur `src/__tests__/statement-generation.test.ts` (BFF, mit gestubbtem Backend) und `statement-correction.pg.test.ts`. Fachreview V-9: «Der Abrechnungslauf, der den Mietvertrag wieder abrechnet und verknüpft …, hat kein Szenario. Ich empfehle eines in `statement-generate.feature`.»

**Warum falsch.** CLAUDE.md, Workflow 1: Jede Verhaltensänderung beginnt mit einem Szenario. Der Review-Auftrag verlangt das ausdrücklich als Major. Der Lauf ist eine eigene Oberfläche: Der Assistent mit Vorschau, «noch nicht abgerechnet» und dem Ergebnis. Dass der BFF-Lauf (`statement-generation.ts`) und das Backend (`openReplaced` mit gleicher Periode, `replacesId`) zusammen den Mietvertrag wieder abrechnen und verknüpfen, zeigt kein Test über den ganzen Stack. Ein Fehler im Zusammenspiel bliebe grün: der BFF-Filter, der Periodenvergleich im Backend, die Vorschau, die den Mietvertrag nicht anbietet.

**Wie zeigen.** Ein Szenario in `statement-generate.feature`, sinngemäss: «Angenommen … die versendete Abrechnung 2024 von "Eva Frei" ist ersetzt / Wenn der Liegenschaftsverwalter die Abrechnungen 2024 von "Lindenhof" erstellt / Dann nennt die neue Abrechnung von "Eva Frei", dass sie die Abrechnung 2024 ersetzt». Auf 1dfdaa2 gibt es dafür weder Schritte noch Szenario. Alternativ `No scenario: <Grund>` im Plan und im PR, falls der E2E-Stack es nicht erreicht. Das trifft hier nicht zu, die Schritte für «ist ersetzt» bestehen.

## Merge 1dfdaa2

Die Auflösung habe ich mit `git show --cc` geprüft, sie ist ohne Befund:
- `pdf.service.ts`: Die neuen fr-Texte sind übernommen, `replacesPay` hat wie die W4d-Texte ` ` vor dem Doppelpunkt. Die Heiztexte sind die von main.
- `api-specification.md`: Beide Sätze stehen jetzt im Status-Absatz, der Versand-Satz von main und der Satz zu `STATEMENT_REPLACED`.
- `+page.svelte`: `MoreActions` und `OldAddressWarning` werden beide importiert, `Correction` und `OldAddressWarning` stehen beide auf der Seite.
- In den E2E-Dateien (questions, steps, targets) stehen beide Seiten nebeneinander, nichts ist doppelt oder fehlt.

## Geprüft und bestätigt

- Ersetzen mit Bestätigung nach Status (V-6), Satz «nicht rückgängig», Verjährung im Wortlaut des Entscheids (M-1): `Correction.svelte`, `messages/*.json:953-973`, DOM-Tests in `statement-pages.dom.test.ts`, E2E «Vor dem Berichtigen die Folge bestätigen».
- Eine ersetzte Abrechnung bietet weder Zahlung, Mahnung, Bearbeitung noch Berichtigung an (`StatusActions.svelte`, `MoreActions.svelte`): DOM-Test und E2E «Ersetzte Abrechnung bleibt unverändert», mit abgelaufener Frist (V-9). `nextReminderFrom` gilt nur für `sent`.
- Links «Ersetzt durch» / «Ersetzt die Abrechnung», Zeile «Bereits bezahlt auf …» / «Bereits zurückerstattet auf …» mit Kette (V-4, V-11): DOM-Tests und E2E.
- PDF: «gilt nicht mehr», «Bezahlen Sie nur noch» nur bei offener Nachzahlung (V-2), Abzug vor der Rundung, Herleitungszeile, fr: `statement-pdf-render.test.ts`, `statement-pdf-data.test.ts`, E2E-Szenario zum PDF. Ohne die Änderung schlagen die neuen Tests fehl (gelesen).
- Texte, die nach ausserhalb von Dwello schickten, zeigen jetzt auf die Berichtigung; die Marker #120 sind entfernt; die vier Sprachen sind vollständig (`i18n.test.ts`, `backend-codes.test.ts` erneut ausgeführt).
- Slice-1-Befunde: C-3 (wörtliche Codes), C-4 (`errorBody` und pg-Test), C-5 (Test der Periode), C-6 (API-Doku), C-7 (Reihenfolge `priorPaidOn`), C-9, C-10 sind behoben. C-8 ist offen (siehe C-4 hier).
- Übersicht (Slice-1-C-2): Filter und Test in `dashboard.test.ts`.
- a11y- und Sprachzeilen für die neuen Zustände: `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`, Seed in `fixtures/screens.ts`.
- A-11 in `docs/anforderungen-vertragsende.md` ist als umgesetzt markiert und nennt Migration 0018.
- API-Contract `statement-correction-refused.json`, Prüfung in `api-contracts.pg.test.ts`.
- Tokens: nur Token-Klassen und Komponenten aus `src/lib/ui` (`design-guard.test.ts` grün). Eine Primäraktion pro Zustand: «Berichtigte Abrechnung erstellen» nur bei einer ersetzten Abrechnung ohne berichtigte; dort zeigt `StatusActions` nichts.

## Nicht bestätigt

- `bunx vitest run` (gesamt, 2829), `bun run check`, `bun run lint`, `cd backend && bun run type-check && bun run test` (843, Coverage 94.5 %): vom Aufrufer gemeldet. Selbst erneut ausgeführt habe ich nur `statement-pages.dom`, `statement-actions`, `i18n`, `backend-codes`, `design-guard` und `open-work` (554 grün).
- E2E vor dem Merge (11 Szenarien, PDF-Szenario, 22 a11y- und Sprachzeilen): vom Aufrufer gemeldet; nicht selbst ausgeführt (gemeinsame Datenbanken und Ports).
- Der volle E2E-Lauf nach dem Merge steht aus. Besonders: `fixtures/screens.ts` ändert die gemeinsamen Daten der a11y-Bildschirme. Carlas Abrechnung 2024 ist jetzt ersetzt, dazu kommen eine berichtigte Abrechnung und eine ersetzte Abrechnung 2025 in «Seeblick». Andere Bildschirme (Abrechnungsliste und Zähler, Assistent 2025 für Seeblick, Übersicht) zeigen damit andere Daten. Ob sie weiter 0 Verstösse und keine deutschen Texte zeigen, ist nicht geprüft.
- Ob ein Doppel-POST auf `/correction` (C-4) eine Nummer des Zählers verbraucht (Lücke, #97), habe ich nicht geprüft. Gesucht habe ich in `backend/src/routes/statements.ts:218-228`.
- Personas, `fach-reviewer` (neue Texte im PDF) und `daten-pruefer` (Beträge, PDF): nicht Teil dieses Reviews, im Plan noch offen.
