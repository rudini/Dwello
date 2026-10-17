# Fachreview W2e (#358 / #120): berichtigte Abrechnung – Runde 2 (Feature-Review)

Gegenstand: `git diff 1dfdaa2^2 1dfdaa2` in `messages/*`, `backend/src/services/{pdf,statement}.service.ts`, `src/routes/statements`, `src/routes/contracts`, `tests/e2e/features`, `docs/anforderungen-vertragsende.md`, `docs/data-model.md`. Zum Nachvollziehen zusätzlich gelesen: `statement-pdf.service.ts`, `contract.service.ts:320-345`, `src/lib/server/statement-generation.ts:40-80`, `src/routes/dashboard/+page.server.ts:60-90`, `backend/src/routes/dashboard.ts:110-135`, `statement-correction.pg.test.ts` (Testnamen), `statement-pdf-render.test.ts:398-403`.
Worktree: `review-w2e2-fach` bei 1dfdaa2. Grundlagen: #120 «Decided (product owner)» und Kommentare (16.10.2026), #358, #360, #362, `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, Runde 1 (`docs/reviews/w2e-fachreview-1.md`).

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-12 | Verwalter | Minor | Bestätigung «bezahlt» nennt den Saldo der Abrechnung als angerechneten Betrag: bei einer Kette zu wenig, bei Saldo 0.00 («rechnet die CHF 0.00 an, die … bezahlt wurden») sinnlos |
| V-13 | Verwalter | Minor | Bestätigung einer versendeten Rückerstattung: «Hat der Mieter schon bezahlt …» und «wird nicht mehr gemahnt» passen nicht, der Vermieter zahlt |
| V-14 | Verwalter | Minor | Nach der Absage ohne Mietstage bleibt auf der ersetzten Abrechnung «Erstellen Sie danach die berichtigte Abrechnung» mit dem Knopf, der immer abgelehnt wird |
| V-15 | Verwalter | Minor | Dashboard «Bezahlt diesen Monat» verliert eine Zahlung, sobald ihre Abrechnung ersetzt ist |
| V-16 | Verwalter (en) | Minor | en: Absagen ohne Mietstage mit «rent days» / «accounting period» statt «days rented» / «billing period» (`i18n-begriffe.md:60,67`) |
| V-17 | Verwalter | Nit | PDF de: «… ersetzt die Abrechnung NK-… . Diese gilt nicht mehr.» – «Diese» lässt sich auf die neue Abrechnung beziehen |
| V-18 | Verwalter | Nit | Gemischte Kette (Nachzahlung und Rückerstattung bezahlt): Zeile «Bereits bezahlt/zurückerstattet auf A und B» nennt eine Abrechnung mit der falschen Richtung; die Absage ohne Mietstage nennt nur die letzte Nummer |
| V-19 | Verwalter | Nit | Betrag in den Absagen ohne Mietstage mit `toFixed(2)`: ab 1000 ohne Tausender-Apostroph («CHF 1234.50») |
| V-20 | Glossar / i18n | Nit | `TODO(fachlich prüfen, #362)` nur in `CostTable.svelte`, nicht an den PDF-Texten; neue Begriffe fehlen in `i18n-begriffe.md` (in #362 «Where» genannt) |
| V-21 | Verwalter (en) | Nit | en `statements_correct_open`: «no longer reminded» ist kein idiomatisches Englisch |

Keine Blocker, keine Majors. Alle Befunde aus Runde 1 sind beantwortet (Tabelle unten).

---

## Runde 1: Stand der Befunde

| ID R1 | Stand | Beleg |
|-------|-------|-------|
| V-1 (Major) | beantwortet wie vorgeschlagen: Hinweis in der Bestätigung; Teilzahlungen in #360 (`entscheiden`, offen) | `messages/de.json:961` «Hat der Mieter schon bezahlt, markieren Sie sie zuerst als bezahlt.»; bei einer Rückerstattung falsch adressiert, siehe V-13 |
| V-2 (Major) | beantwortet: Satz unter dem Titel, mit Zusatz «Bezahlen Sie nur noch den Saldo …» nur bei offener Nachzahlung | `pdf.service.ts:66-67,574-579`; Szenario `statement-detail.feature` «PDF der berichtigten Abrechnung …»; Wortlaut de siehe V-17 |
| V-3 (Major) | beantwortet: nur gleicher Beginn und gleiches Ende | `statement.service.ts:357-374` (`openReplaced`, `eq(periodStart)`, `eq(periodEnd)`), BFF `statement-generation.ts:58-64` (`replacedHere`), pg-Test «verknüpft im Abrechnungslauf keine Abrechnung einer anderen Periode». Eine ersetzte Abrechnung einer überlappenden anderen Periode zählt im Lauf weiter als abgerechnet, der Mietvertrag wird übersprungen; so entsteht keine falsche Anrechnung. Der vorgeschlagene erklärende Hinweis fehlt; das nehme ich als vertretbar hin (kein Befund), weil «Hinweis auf fehlende Abrechnungen» die Periode wieder nennt (`contracts/[id]/+page.server.ts:106-109`, Dashboard `+page.server.ts:71`). |
| V-4 (Minor) | beantwortet: Zeile nennt alle Abrechnungen der Kette mit Zahlung | `correctionsOf` (`statement.service.ts:308-324`), PDF `priorLine`, Test `statement-pdf-render.test.ts:398-403`; Restfall V-18 |
| V-5 (Minor) | beantwortet: drei Texte mit Betrag | `messages/de.json:415-417`, `correctStatement` (`statement.service.ts:629-640`), Szenario «Keine berichtigte Abrechnung ohne Mietstage …», pg-Test «sagt je nach Zahlung, was zu tun ist» |
| V-6 (Minor) | beantwortet: nach Status, mit Betrag und «Das lässt sich nicht rückgängig machen.» | `Correction.svelte:16-28`, `messages/de.json:961-967`; Betrag siehe V-12 |
| V-7 (Minor) | beantwortet: «berichtigen Sie zuerst jede dieser Abrechnungen» | `messages/de.json` `contracts_billed_locked_rest`, `contracts_continue_locked_rest`; Szenarien angepasst |
| V-8 (Minor) | beantwortet wörtlich | `contracts_delete_billed_locked` |
| M-1 (Minor) | beantwortet: Vorbehalt in `statements_missing_consequence` bleibt (`messages/de.json:1209`, unverändert), Verjährung in `invoices_missed_text`, `statements_later_sent`, `statements_correct_limit` wörtlich wie entschieden | #120 Kommentar 16.10.2026 |
| V-9 (Minor) | beantwortet: überfällig + «weder … Berichtigung» im Szenario «Ersetzte Abrechnung bleibt unverändert»; Szenario ohne Mietstage; Rückerstattung, Kette, Abrechnungslauf als pg-Tests; BFF-Filter in `src/__tests__/statement-generation.test.ts`. Ein E2E-Szenario für den Lauf fehlt, Unit- und pg-Test decken die Regel ab. | `statement-detail.feature:589-681` |
| V-10 (Nit) | beantwortet: «Die berichtigte Abrechnung rechnet an …»; «noch nicht speichern» löst den Widerspruch | `statements_correct_next`, `contracts_billed_locked_rest` |
| V-11 (Nit) | beantwortet: «+ bereits zurückerstattet CHF …» | `pdf.service.ts:600-609`, Test `statement-pdf-render.test.ts:403` |
| G-1 (Minor) | beantwortet: #362 (`entscheiden`, offen) mit dem Vorschlag; Marker siehe V-20 | – |

---

## Befunde

### V-12 (Minor) Bestätigung «bezahlt»: angerechneter Betrag ist der Saldo, nicht was angerechnet wird

**Beleg.** `src/routes/statements/[id]/Correction.svelte:19-23`: `amount: formatCurrency(Math.abs(statement.balance))`. Angerechnet wird aber `paidSoFar(replaced)` = `paidAmount + priorPayments` (`statement.service.ts:351-352`). `updateStatementStatus` markiert eine Abrechnung mit Saldo 0.00 beim Versand selbst als bezahlt (`statement.service.ts:551`: «A Saldo of 0 … is settled once sent»).

**Rechnung.**
- Kette: A bezahlt 442.90, B (berichtigt, Saldo 187.45) bezahlt. Ersetzen von B: Die Bestätigung sagt «Die berichtigte Abrechnung rechnet die CHF 187.45 an, die am … bezahlt wurden.» Angerechnet werden 187.45 + 442.90 = 630.35.
- Saldo 0.00 (häufig nach der Rundung auf 5 Rappen): «… rechnet die CHF 0.00 an, die am {Abrechnungsdatum} bezahlt wurden.» Es wurde nichts bezahlt.

**Warum falsch.** Die Bestätigung soll die echte Folge nennen (CLAUDE.md, Design-Regeln; Runde 1 V-6). Der Verwalter liest einen zu kleinen Betrag bzw. eine Zahlung, die es nicht gab.

**Fix.** Den Betrag aus `paidAmount + priorPayments` zeigen (oder vom Backend liefern, wie `priorPaidOn`). Ist er 0.00, den Text `statements_correct_open` ohne den Satz zur Zahlung verwenden, besser ein eigener Satz: «Die Abrechnung {number} wird ersetzt. Sie bleibt unverändert erhalten. Ihr Saldo war 0.00, die berichtigte Abrechnung rechnet nichts an.» DOM-Test für Kette und Saldo 0.

### V-13 (Minor) Bestätigung einer offenen Rückerstattung spricht den Mieter als Zahler an

**Beleg.** `messages/de.json:961` `statements_correct_open` gilt für jede versendete/überfällige Abrechnung (`Correction.svelte:18-19`), auch mit negativem Saldo: «… wird nicht mehr gemahnt … Hat der Mieter schon bezahlt, markieren Sie sie zuerst als bezahlt.» Eine Rückerstattung wird nicht gemahnt (`backend_reminder_refund`), und bezahlt hat, wenn, der Vermieter (Glossar «Rückerstattung», `UBIQUITOUS_LANGUAGE.md:156`).

**Warum falsch.** Der Verwalter hat die Rückerstattung vielleicht schon überwiesen, liest aber nur vom Mieter. Ohne «als bezahlt markieren» rechnet die berichtigte Abrechnung die Rückerstattung nicht an, und er erstattet doppelt.

**Fix.** Ein zweiter Text bei Saldo < 0: «Die Abrechnung {number} wird ersetzt. Sie bleibt unverändert erhalten und lässt sich nicht mehr als bezahlt markieren. Haben Sie die Rückerstattung schon überwiesen, markieren Sie sie zuerst als bezahlt.» In allen vier Sprachen; DOM-Test.

### V-14 (Minor) Sackgasse nach der Absage ohne Mietstage

**Beleg.** `Correction.svelte:39-60`: Eine ersetzte Abrechnung ohne `replacedBy` zeigt immer `statements_replaced_todo` («… Erstellen Sie danach die berichtigte Abrechnung.») und den Hauptknopf «Berichtigte Abrechnung erstellen». Hat der Mietvertrag keine Mietstage mehr in der Periode, lehnt `correctStatement` jeden Versuch ab (`statement.service.ts:629-640`); die Absage erscheint nur nach dem Klick.

**Warum.** Der Fall (Anna I4) ist abgeschlossen, sobald der Verwalter zurückerstattet bzw. den Mieter informiert hat. Die Seite verlangt aber auf Dauer eine Handlung, die es nicht gibt. Ein seltener Nutzer klickt wieder und wieder.

**Fix.** Das Backend liefert im Detail, ob der Mietvertrag in der Periode noch Mietstage hat; ohne sie zeigt der Hinweis statt Knopf und «Erstellen Sie danach …» den passenden Text aus `backend_statement_no_rental_days_*` (ohne «Darum gibt es …» nicht nötig). Szenario: das bestehende «Keine berichtigte Abrechnung ohne Mietstage in der Periode» um «bietet die Detailseite keine berichtigte Abrechnung an» ergänzen. Alternativ (Runde 1, Frage 4) Entscheid des Product Owners über eine berichtigte Abrechnung ohne Kosten; dann ins Issue #360 oder ein neues `entscheiden`-Issue.

### V-15 (Minor) «Bezahlt diesen Monat» verliert ersetzte Zahlungen

**Beleg.** `backend/src/routes/dashboard.ts:129-132`: `paidThisMonth` summiert `paidAmount` über `statusCondition('paid')` = `status = 'paid'` (`statement.service.ts:105`). Eine im Monat bezahlte und danach ersetzte Abrechnung hat `status = 'replaced'` und fällt heraus; die berichtigte Abrechnung trägt nur den Rest. (Ausserhalb der genannten Pfade, aber Folge des neuen Status.)

**Rechnung.** Eva Frei zahlt am 3. des Monats 442.90, am 10. ersetzt der Verwalter: «Bezahlt diesen Monat» sinkt von 442.90 auf 0.00, obwohl das Geld eingegangen ist.

**Fix.** Für `paidThisMonth` `status IN ('paid','replaced')` mit `paid_date` im Monat. pg-Test. Die Zählung der Status-Tabs bleibt, wie sie ist.

### V-16 (Minor) en: Begriffe der Absagen ohne Mietstage

**Beleg.** `messages/en.json:415-417`: «The rental contract no longer has rent days in this accounting period.» `docs/design/i18n-begriffe.md:60`: Abrechnungsperiode = «billing period»; `:67`: Mietstage = «days rented». Sonst 59× «billing period», 13× «days rented», «accounting period» und «rent days» nur in diesen drei Schlüsseln.

**Fix.** «The rental contract no longer has any days rented in this billing period. So there is no corrected statement. …»

### V-17 (Nit) PDF de: Bezug von «Diese»

**Beleg.** `pdf.service.ts:66`: «Diese Abrechnung ersetzt die Abrechnung {number} vom {date}. Diese gilt nicht mehr.» (mein Wortlaut aus Runde 1). Der Mieter kann das zweite «Diese» als «diese Abrechnung», also die neue, lesen. fr «Celui-ci», it «Quest’ultimo», en «That statement» sind eindeutig.

**Fix.** «Diese Abrechnung ersetzt die Abrechnung {number} vom {date}. Die Abrechnung {number} gilt nicht mehr.» (mit `replacesPay`: «… gilt nicht mehr: Bezahlen Sie nur noch den Saldo dieser Abrechnung.»). Szenario-Text `statement-detail.feature` «Diese gilt nicht mehr: …» anpassen.

### V-18 (Nit) Gemischte Kette und Nummer in der Absage

**Beleg.** `priorLine` (`pdf.service.ts:600-609`) und `CostTable.svelte` wählen die Bezeichnung nach dem Vorzeichen der Summe, `priorPaidOn` nennt jede Abrechnung mit `paidAmount ≠ 0` (`statement.service.ts:321`).

**Rechnung.** A Rückerstattung −20.00 bezahlt, B Nachzahlung 10.00 bezahlt; Summe −10.00 → «Bereits zurückerstattet auf A und B + 10.00», obwohl auf B der Mieter bezahlt hat. Der Betrag stimmt. Ebenso die Absage `backend_statement_no_rental_days_paid`: Betrag = ganze Kette, Text «die er auf {number} bezahlt hat» nennt nur die letzte Abrechnung.

**Fix.** Selten, darum Nit: In der Liste nur die Abrechnungen nennen, deren Zahlung dieselbe Richtung hat wie die Summe, oder bei gemischter Kette die neutrale Zeile «Bereits verrechnet auf …» (in #362 mitentscheiden). Absage: `{numbers}` wie in der Zeile.

### V-19 (Nit) Betragsformat in den Absagen

**Beleg.** `statement.service.ts:635`: `amount: Math.abs(paid).toFixed(2)`; die übrigen Texte zeigen Beträge mit Schweizer Tausender-Apostroph (`formatCHF`, `pdf-format.ts:10`).

**Fix.** Den Betrag mit `formatCHF` (Backend) übergeben oder als Zahl, die das Frontend mit `formatCurrency` formatiert.

### V-20 (Nit) Marker #362 und `i18n-begriffe.md`

**Beleg.** `grep "#362"`: nur `CostTable.svelte` (Kommentar über `priorLabel`). Die PDF-Texte `priorPaid`, `priorRefunded`, `priorPaidShort`, `priorRefundedShort` (`pdf.service.ts:68-71` und je Sprache) tragen keinen Marker; #362 sagt «The texts carry TODO». `docs/design/i18n-begriffe.md` enthält keine der neuen Übersetzungen (berichtigte Abrechnung, Ersetzt, Bereits bezahlt).

**Fix.** Marker `TODO(fachlich prüfen, #362)` an den PDF-Übersetzungen; die Tabelle aus Runde 1 (wie umgesetzt, mit «Établir» / «Allestire» statt «Créer» / «Creare», passend zu `i18n-begriffe.md:101`) in `i18n-begriffe.md` aufnehmen, sobald #362 entschieden ist.

### V-21 (Nit) en «no longer reminded»

**Beleg.** `messages/en.json:961`: «It is kept unchanged, no longer reminded and can no longer be marked as paid.»

**Fix.** «It is kept unchanged, gets no more reminders and can no longer be marked as paid.»

---

## Formeln (nachgerechnet)

Grundlage: `calculateStatement` (`statement.service.ts:339-350`): `balance = calculateBalance(totalCosts, akonto + priorPayments)` = `roundTo5Rappen(totalCosts − akonto − prior)`; `roundTo5Rappen` = `floor(Rappen / 5) / 20` (`pdf-format.ts:20`), also abwärts, bei negativen Beträgen betragsmässig aufwärts: immer zugunsten des Mieters. `paidSoFar` = `paidAmount + priorPayments` (`:351-352`).

1. **Szenario-Fall.** Ersetzt: Kosten 442.90, Akonto 0, bezahlt 442.90. Berichtigt: 430.00 + 732.00 × 91/366 (= 182.00) = 612.00, + 3 % = 18.36 → 630.36. Saldo = floor(18 746 / 5)/20 → 630.36 − 442.90 = 187.46 → **187.45**. Bestätigt (Szenario «Berichtigte Abrechnung rechnet die Zahlung an», PDF-Szenario «Nachzahlung 187.45», «bereits bezahlt CHF 442.90»). Detail und PDF zeigen die Rundung −0.01 aus `unrounded` = 187.46 (`CostTable.svelte`, `pdf.service.ts:595`).
2. **Rückerstattung, Randfall.** Kosten 395.03, Akonto 420.00, schon zurückerstattet −20.00 (prior = −20.00): 395.03 − 420.00 + 20.00 = −4.97 → floor(−99.4) = −100 → **−5.00**, Rückerstattung 5.00 statt 4.97: zugunsten des Mieters. PDF-Zeile «+ bereits zurückerstattet CHF 20.00», Rundung «+ 0.03» (Betrag wächst). Bestätigt.
3. **Kette.** A bezahlt 442.90 → B (prior 442.90, Saldo 187.45) bezahlt 187.45 → C mit gleichen Kosten 630.36: prior = 187.45 + 442.90 = 630.35, Saldo roundTo5(0.01) = **0.00**. Der Mieter hat insgesamt 630.35 ≤ 630.36 bezahlt. Bestätigt; Bestätigungstext siehe V-12.
4. **Null.** Nur versendet: `paidAmount` null → prior 0, Saldo wie eine neue Abrechnung (pg-Test «rechnet bei einer nur versendeten Abrechnung nichts an»). Saldo 0.00 beim Versand automatisch bezahlt (`statement.service.ts:551`) → `paidAmount` 0, wird in `priorPaidOn` ausgelassen (`:321`) und erzeugt keine Zeile. Bestätigt (Text V-12).
5. **Ohne Mietstage.** paid > 0 / < 0 / = 0 → drei Codes (`statement.service.ts:636-639`). Richtung wie Runde 1 V-5. Bestätigt.
6. **Mieterwechsel.** Die berichtigte Abrechnung rechnet nur den Mietvertrag der ersetzten (`contractId`, `statement.service.ts:622`) mit dessen Mietstagen; die Abrechnung des Nachmieters bleibt unberührt. Bestätigt.
7. **Verwaltungspauschale** nur einmal: Satz der ersetzten übernommen (`statement.service.ts:627`), die ersetzte zählt nicht mehr. Art. 4 Abs. 3 VMWG (Wortlaut Runde 1). Bestätigt.

## Regeln und Begriffe (bestätigt)

- Status «Ersetzt» (`replaced`): nicht gemahnt (`reminder.service.ts:58`, pg-Test), nicht bezahlt / zurückgesetzt (`StatusActions.svelte:26,36`), nicht bearbeitet (`updateStatement` `STATEMENT_REPLACED`, `MoreActions.svelte:16`), zählt nicht als Abrechnung der Periode (Dashboard, Mietvertrag, Lauf), sperrt die Vertragsdaten nicht (`contract.service.ts:334`, Szenarien `contract-edit.feature`, `contract-detail.feature`). Entspricht #120 Kommentar 16.10.2026.
- Begriffe: «Berichtigte Abrechnung», «Ersetzt», «Abrechnungsperiode», «Mietstage», «Saldo», «Rückerstattung», «Abrechnungslauf» aus dem Glossar; kein «storniert», «Gutschrift», «Nachtragsabrechnung» in neuen Texten (`grep` in `messages/de.json`; `anforderungen-vertragsende.md` nennt sie nur als verworfen).
- `docs/anforderungen-vertragsende.md` A-11 und `docs/data-model.md` beschreiben, was der Code tut (Status-Übergang, `prior_payments`, Ein-Mal-Verknüpfung `statements_replaces_idx`).
- Verjährung: alle vier Sprachen geben den Entscheid wieder («in der Regel», «nicht einheitlich geklärt» / «en règle générale … pas clarifié de manière uniforme» / «di regola … non è chiarito in modo uniforme» / «usually … not settled uniformly»). Art. 128 Ziff. 1 OR (Fedlex, Wortlaut aus Runde 1): «Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen;».
- Mietrecht: Die Anrechnung des Bezahlten verhindert, dass mehr als die tatsächlichen Aufwendungen verlangt werden (Art. 257b Abs. 1 OR, Fedlex: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …»); die ersetzte Abrechnung mit Positionen bleibt für die Belegeinsicht (Art. 257b Abs. 2 OR) erhalten. Der PDF-Hinweis sagt dem Mieter, dass er die alte QR-Rechnung nicht mehr bezahlen soll.
- fr/it gegen `i18n-begriffe.md`: «décompte», «période de décompte», «jours de location», «contrat de bail», «Établir» / «conteggio», «periodo di conteggio», «giorni di locazione», «Allestire», «sollecitato» passen. en siehe V-16, V-21.

## Nicht bestätigt

- **Fedlex-Wortlaute** habe ich in dieser Runde nicht neu abgerufen; die Zitate stammen aus Runde 1 (Fedlex-Filestore, OR Stand 1.10.2026, VMWG Stand 1.10.2025). Die drei Punkte «unsicher» aus Runde 1 (Beginn der Verjährung, vorbehaltlos bezahlter Saldo als Anerkennung, Verjährung der Rückforderung des Mieters) gelten unverändert; der umgesetzte Text deckt sie mit dem Vorbehalt ab.
- **PDF einer ersetzten Abrechnung:** `statement-pdf.service.ts:310` liefert das gespeicherte PDF; ob eine ersetzte Abrechnung ohne gespeichertes PDF neu erzeugt werden kann (dann ohne «bezahlt»-Vermerk, `:136` nur bei `status === 'paid'`, und ohne Hinweis «ersetzt»), habe ich nicht geprüft.
- **QR-Betrag der berichtigten Abrechnung** = Saldo (187.45): nur aus `balance` in `statement-pdf.service.ts:134` geschlossen, QR-Teil nicht gelesen.
- **Persona-Sicht** (Bildschirme, Dialog, Sprachen am Bildschirm) und axe-Ergebnisse: nicht ausgeführt, nur Code und Texte gelesen.
- **«Décompte rectificatif» / «conteggio rettificato»** als übliche Westschweizer / Tessiner Bezeichnung: weiterhin nicht an einer Quelle geprüft.
- Gelesen: Diff wie oben, `gh api` #120 (Kommentare), #360, #362.

## Neue Issues (Vorschlag für den Caller)

Keine neuen Begriffe ausserhalb von #362. V-14 (Ende ohne Mietstage) braucht nur dann ein `entscheiden`-Issue, wenn statt des Hinweises eine berichtigte Abrechnung ohne Kosten gewünscht ist.
