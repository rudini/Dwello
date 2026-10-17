# Code-Review W5d «Abgerechnet bis» (#133), Runde 2 und Abschlussrunde

Worktree `review-w5d-code2`, Commit f85b076. Geprüft: `git diff e130340 1bf9585` (Korrekturen, alle Code-, Test- und Feature-Dateien gelesen, die Berichte unter `docs/` nur überflogen), der Merge f85b076 (`git show --cc`, `git diff afa4da9 f85b076`, `git diff 1bf9585 f85b076`) und die Stellen, die main seit der Merge-Basis c3d7758 in den berührten Diensten geändert hat (`calculation.service.ts`, `statement-invoices.service.ts`, `contract-status.ts`, `+page.server.ts`).

## Stand der Befunde aus Runde 1

| ID | Stand |
|----|-------|
| C-1 | Behoben. Das Szenario setzt «Abgerechnet bis» auf den 31.12. des letzten Jahres (`contract-detail.steps.ts:238-247`, `lastYear` aus `inDays(0)`). Damit endet die letzte abgeschlossene Periode genau an «Abgerechnet bis», auch nach einem Jahreswechsel. Ohne `billsIn` fehlen 2024 und 2025, das Szenario wäre also rot |
| C-2 | Behoben. `valid()` lehnt einen Text ohne Datum ab (`ContractForm.svelte:152-155`). Der DOM-Test (`contract-edit.dom.test.ts:130-140`) wäre ohne die Änderung rot, weil dann ein PUT gesendet wird |
| C-3 | Behoben, für einen Entwurf (`contract-edit.feature:55-59`). Ohne `billedUntil` in `checkNewDates` würde gespeichert, das Szenario wäre also rot |
| C-4 | Behoben durch den Test zum angebrochenen Monat (`billed-until.pg.test.ts:92-97`: 100 × 16/31 + 7 × 100 = 751.61) |
| C-5 | Laut Aufrufer in #325 aufgenommen (nicht nachgeprüft) |
| C-6, C-7 | Behoben. `Abrechnung(en)` passt auf «genau 1 Abrechnung» (`statement-generate.feature:128`) und auf die Mehrzahl |
| C-8 | Offen gelassen (Nit), unverändert |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-9 | Major | src/routes/contracts/ContractForm.svelte:118-126 | `covered()` fragt nur, ob der Mietvertrag mit den neuen Daten Tage in der Periode des Entwurfs abrechnet, nicht ob es «Abgerechnet bis» ist, das die Periode abdeckt. Ein Vertragsende vor der Periode (oder ein Vertragsbeginn danach) zeigt dann den Text «… rechnet Tage ab, die Sie jetzt als ausserhalb von Dwello abgerechnet eintragen», obwohl niemand «Abgerechnet bis» eingetragen hat |
| C-10 | Minor | tests/a11y/screens.json:26 | Für den neuen Zustand «Entwurf ganz durch ‹Abgerechnet bis› abgedeckt» (eigener Fehlertext und eigene Folge) gibt es keine Zeile. `edit-refused` zeigt nur die Ablehnung wegen des Vertragsendes. Das Layout ist dasselbe und die zwei Texte stehen in allen vier Dateien. Darum ist das nur ein Minor: Die Sprachprüfung sieht die neuen Texte nie |
| C-11 | Nit | src/routes/contracts/ContractForm.svelte:155 | Der Text `m.ui_date_not_a_date({ example: '31.12.2024' })` erscheint nie. `DateInput` zeigt bei ungültigem Text nach dem Verlassen des Felds seinen eigenen `wrongDate` (`shownError`). Ausserdem liegt das feste Beispiel in der Vergangenheit, während `DateInput` ausdrücklich ein Beispiel nimmt, das «nie in der Vergangenheit» liegt |
| C-12 | Nit | src/routes/contracts/ContractForm.svelte:116 | Der Kommentar «the backend answers in English: a valid form is refused …» gehört zu `saveError`. Jetzt steht er über `covered` |

Ponytail-Review: `ContractForm.svelte:155: shrink: Der Wert des Fehlers wird nie gezeigt. Jeder nicht leere Wert reicht als Sperre (C-11).` Sonst ist der Diff schlank: Die Prop `consequence` hat einen Aufrufer und ersetzt nur die Standardfolge, `onlyCovered` wiederholt die Prüfung auf genau einen Entwurf aus `RefusedStatements` in einer Zeile. `net: -0 lines possible.`

Merge f85b076: Die Konflikte sind richtig aufgelöst. `schema.ts`, `routes/contracts.ts`, `contract.service.ts` (`contractFields`), `contract.json`, `data-model.md` und `api-specification.md` haben jetzt beide Felder, `movedOut` von main und `billedUntil` vom Branch. Die PUT-Zeile der API-Spezifikation nennt beide Felder und die 409 für `startDate`/`endDate`/`billedUntil`. In `+page.server.ts` sind `successorAfter`, `nextStepsDue` und `fixedTermCheckDue` von main erhalten (main hat `successorAfter` aus `nextStepsDue` herausgezogen, nicht ersetzt), und nur `rentDaysIn` ist durch `billsIn` ersetzt. In `updateContract` laufen `checkNewDates` (Branch) und das Zurücksetzen von `movedOut` (main) zusammen. Main rechnet die Tage jetzt je Rechnung (`rentalShare`/`daysOf`, #104), und zwar mit `contractOverlap`, das schon von `billingStart` ausgeht. Ein semantischer Konflikt besteht hier nicht. Die Migration `0015_contract_billed_until.sql` folgt auf 0013/0014. `migrate.ts` sortiert nach Dateinamen, und eine lokale Datenbank, die noch den alten Namen 0013 eingetragen hat, bricht mit dem Hinweis auf `db:reset` ab, statt die Spalte doppelt anzulegen. Weil der Branch nie ausgeliefert wurde, ist das richtig.

---

### C-9 (Major): Der Text «ausserhalb von Dwello abgerechnet» erscheint auch ohne «Abgerechnet bis»

**Warum falsch.** `covered(draft)` ist `!billsIn({ startDate, endDate, billedUntil }, period)`. `billsIn` ist auch dann falsch, wenn das neue Vertragsende vor dem Beginn der Periode liegt oder der neue Vertragsbeginn nach ihrem Ende, bei leerem «Abgerechnet bis». Das Backend lehnt beides mit dem Entwurf in `statements` ab (`statementsChanged`: `least(periodEnd, endDate) <> rental_end`). `saveError` gibt dann `contracts_billed_draft_covered` aus: «Der Entwurf NK-2025-0003 rechnet Tage ab, die Sie jetzt als ausserhalb von Dwello abgerechnet eintragen. Löschen Sie den Entwurf. …». Für einen Liegenschaftsverwalter, der nur das Vertragsende korrigiert hat, nennt der Fehler damit eine falsche Ursache. Das verstösst gegen die Regel, dass Fehler sagen, was passiert ist (CLAUDE.md, «Copy»). Vor der Änderung kam hier der Text «Sie können den Entwurf unten löschen und … neu erstellen». V-10 verlangte die neue Folge nur für einen Entwurf, den «Abgerechnet bis» abdeckt.

**So zeigt man den Fehler.** In `contract-edit.dom.test.ts` den bestehenden Test «sagt bei einem Entwurf, der schon Mietstage nach dem Tag enthält, was zu tun ist» (Zeile 409) mit `await endOn('31.12.2024')` statt `'31.03.2025'` laufen lassen. Fixture `contract-end-refused.json` mit dem Entwurf 2025, Vertragsbeginn 2024-04-01. Dann enthält `form-error` «die Sie jetzt als ausserhalb von Dwello abgerechnet eintragen», und «Entwurf löschen und Mietvertrag speichern» führt zur Detailseite statt in den Assistenten. Von Hand: `billsIn({ startDate: '2024-04-01', endDate: '2024-12-31', billedUntil: '' }, { start: '2025-01-01', end: '2025-12-31' })` ergibt `false`.

**Behebung.** Den Fall an «Abgerechnet bis» binden, z. B. `const covered = (draft) => !!values.billedUntil && values.billedUntil >= draft.periodEnd.slice(0, 10)`. Das wäre auch kürzer. Dazu der DOM-Test oben, der zuerst rot ist.

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht selbst wiederholt:** auf f85b076 `bun run lint`, `bun run check`, backend `bun run type-check`, `bunx vitest run` (2785 grün) und `cd backend && bun run test` (787 grün mit Coverage-Check); auf dem Baum von 1bf9585 E2E contract-detail, contract-edit und statement-generate (chromium und api, 102 grün) und das Szenario zu V-10, das ohne den Zweig `covered` rot war. Die E2E-Läufe, Axe und die Sprachzeilen auf f85b076 liefen beim Review noch. Ich habe keine Tests gestartet. Die Rotprüfung der neuen Tests (DOM C-2 und V-10, pg V-14, die Szenarien C-1, C-3 und V-10) habe ich nur durch Lesen beurteilt (siehe Tabelle oben).
- **C-5 in #325:** Ich habe das Issue nicht geöffnet und mich auf die Angabe des Aufrufers und des Plans verlassen.
- **Ablehnungstext bei einer versendeten oder bezahlten Abrechnung:** Für die Felder «Abgerechnet bis» (`contracts_billed_locked_*`) prüfen nur `billed-until.pg.test.ts:143-150` den Code der Ablehnung im Backend und die bestehenden DOM-Tests den Text. Ein Szenario dazu gibt es nicht. Runde 1 hat das unter C-3 als Beispiel genannt, das Szenario mit dem Entwurf genügt für die Verhaltensänderung.
- **Übersetzungen der zwei neuen Texte** in fr, it und en: Ich habe sie mit den bestehenden Begriffen verglichen («période de décompte», «periodo di conteggio», «billing period»). Ob sie zu `i18n-begriffe.md` passen, prüft #325 bzw. der Fachreview.
- **Toast nach dem Löschen eines abgedeckten Entwurfs:** Er meldet nur «gespeichert» und nicht, dass der Entwurf gelöscht ist. Das war vorher beim Weg über den Assistenten genauso, darum ist es kein Befund.
