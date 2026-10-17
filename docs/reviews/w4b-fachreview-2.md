# Fachreview W4b (Runde 2): Zahlung einer Abrechnung (#138, #93, #92)

Gegenstand: `git diff b5ecd9d 7e13aaa`, Worktree `review-w4b-fach2` (Commit `7e13aaa`). Runde 1: `docs/reviews/w4b-fachreview-1.md`.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-14 | Verwalter | Minor | fr/it: Bestätigungsknopf «Annuler le paiement» / «Annullare il pagamento» steht neben «Annuler» / «Annullare» (Abbrechen) und liest sich als Storno der Überweisung |
| V-15 | Verwalter | Minor | it «Inserisca al più presto questa data» heisst «so bald wie möglich»; fr «Saisissez au plus tôt cette date» ebenso mehrdeutig; en holprig |
| V-16 | Verwalter | Nit | Zukunftsfehler sagt bei einer Rückerstattung weiter «an dem das Geld eingegangen ist» (Rest von V-2, bestand vorher) |
| V-17 | Verwalter | Nit | Zurücksetzen verwirft jedes gespeicherte PDF, auch eines aus «Versendet»; die Zeile «PDF erstellt» verschwindet aus dem Verlauf; die Bestätigung nennt das nicht |
| V-18 | Verwalter | Nit | Vor der Änderung bezahlte Abrechnungen haben kein `paid_amount` und fehlen in `paidThisMonth` |
| V-19 | Verwalter | Nit | Szenario «Zahlung zurücksetzen» prüft nach erneutem Bezahlen nur den Status, nicht den Verlauf mit beiden Zeilen (Rest von V-7) |
| V-20 | Verwalter | Nit | Bestätigung bei «Versendet» sagt nicht, dass die Abrechnung nach der Zahlungsfrist überfällig wird (Rest von V-4) |

Keine Blocker, keine Major. Keine Befunde der Rollen Mietrecht (M) und Rechtstexte (R): die Änderung berührt weder Datenschutzerklärung noch Nutzungsbedingungen, und kein neuer Text behauptet eine Rechtsfolge (Verzug, Quittung). Offen aus Runde 1 und nicht erneut gezählt: V-3/V-5 (#291, entscheiden), V-9 (#290), V-10, V-12, V-13 (Nits).

---

## V-14 (Minor): «Annuler le paiement» / «Annullare il pagamento»

**Beleg.**
- `messages/fr.json:904` `statements_reset_payment` «Annuler le paiement», `:910` «Paiement du {date} annulé»; `messages/it.json:904` «Annullare il pagamento», `:910` «Pagamento del {date} annullato».
- `messages/fr.json:36` `ui_cancel` «Annuler», `messages/it.json:36` «Annullare»; `src/lib/ui/Dialog.svelte:142` zeigt den Abbrechen-Knopf mit `cancelLabel = m.ui_cancel()` neben dem Bestätigungsknopf (`ResetPaymentDialog.svelte`, `confirmLabel={m.statements_reset_payment()}`).
- `docs/design/i18n-begriffe.md:101` legt «Annuler» / «Annullare» für «Abbrechen» fest.

**Warum falsch.** Im Dialog stehen in fr «Annuler» und «Annuler le paiement», in it «Annullare» und «Annullare il pagamento» nebeneinander: zwei Knöpfe mit demselben Verb und gegensätzlicher Wirkung. Zudem heisst «annuler/annullare un paiement» im Zahlungsverkehr, eine Überweisung zu stornieren; der Vermieter kann glauben, Dwello buche Geld zurück. Der deutsche Begriff ist nicht im Glossar (#290), «Zahlung zurücksetzen» fehlt auch in `i18n-begriffe.md`. Die Folge eines Fehlklicks ist umkehrbar (erneut als bezahlt markieren), darum Minor.

**Behebung.** Ein Verb, das weder «Abbrechen» noch «Storno» bedeutet, und den Begriff in `docs/design/i18n-begriffe.md` mit ❓ aufnehmen (an #290 anhängen):
- fr: «Retirer le paiement saisi» / Titel «Retirer le paiement saisi ?» / Verlauf «Paiement du {date} retiré» / Toast «Le paiement du décompte {number} est retiré.» / Bestätigung «… L’historique conserve le retrait.»
- it: «Rimuovere il pagamento registrato» / «Pagamento del {date} rimosso» / «Il pagamento del conteggio {number} è stato rimosso.» / «… La cronologia registra la rimozione.»
- en «Reset payment» passt.
Ein Test, der prüft, dass `statements_reset_payment` in keiner Sprache mit `ui_cancel` beginnt, sichert es ab.

## V-15 (Minor): «frühestens dieses Datum» in fr/it/en

**Beleg.** `statements_paid_date_before` und `backend_paid_date_before_statement`:
- it (`messages/it.json:394, 904`): «Inserisca al più presto questa data.» «al più presto» vor dem Objekt heisst «so bald wie möglich».
- fr (`messages/fr.json:394, 904`): «Saisissez au plus tôt cette date.» «au plus tôt» direkt nach dem Verb liest sich ebenfalls als «möglichst bald».
- en (`messages/en.json:394, 904`): «Enter this date at the earliest.» grammatisch möglich, aber mehrdeutig.
- de: «Geben Sie frühestens dieses Datum ein.»: richtig.

**Warum falsch.** Der zweite Satz soll sagen, was zu tun ist (Design-Regel «errors say what happened and what to do»). In it und fr sagt er etwas anderes: sofort dieses Datum eingeben. Der Vermieter erfährt nicht, dass auch ein späterer Tag geht.

**Behebung.** Gleichbedeutend mit dem Deutschen, ohne Zeitadverb:
- fr: «Saisissez cette date ou une date ultérieure.»
- it: «Inserisca questa data o una data successiva.»
- en: «Enter this date or a later one.»
Beide Schlüssel je Sprache gleich halten.

## V-16 (Nit): Zukunftsfehler bei einer Rückerstattung

**Beleg.** `messages/de.json` `statements_paid_date_future` und `backend_paid_date_in_future`: «… Geben Sie den Tag ein, an dem das Geld eingegangen ist.»; Hilfe im selben Feld bei Rückerstattung `statements_paid_help_refund` «Der Tag, an dem Sie den Betrag überwiesen haben.»

**Warum.** V-2 ist für den neuen Fehler gelöst (der Satz nennt kein «eingegangen» mehr), der Zukunftsfehler hat den Widerspruch weiter. Bestand vor der Änderung; `backend_paid_date_in_future` übernimmt ihn neu.

**Behebung.** Wie bei V-15 ohne Richtung des Geldes: «Das Zahlungsdatum liegt in der Zukunft. Geben Sie spätestens das heutige Datum ein.» (fr «… Saisissez au plus tard la date d’aujourd’hui.», it «… Inserisca al massimo la data di oggi.», en «… Enter today’s date or an earlier one.»). Das Szenario «Kein Zahlungseingang in der Zukunft» prüft nur den ersten Satz und bleibt gültig.

## V-17 (Nit): Zurücksetzen verwirft jedes PDF

**Beleg.** `backend/src/services/statement.service.ts:504-512` (`resetPayment`): `pdfBlob: null, pdfGeneratedAt: null` ohne Bedingung. `MetadataCard.svelte`: die Zeile «PDF erstellt» hängt an `pdfGeneratedAt`. `statement-pdf.service.ts:136`: nur ein PDF, das während «Bezahlt» erstellt wurde, druckt «Bezahlt am».

**Warum.** V-1 ist erfüllt. Verworfen wird aber auch ein PDF aus «Versendet», also das Dokument, das der Mieter bekam; neu erstellt wird es mit den heutigen Stammdaten (Adresse, IBAN). Das kann der Vermieter heute schon jederzeit selbst auslösen (`POST /:id/generate-pdf`), darum nur Nit. Der Verlauf verliert die Zeile «PDF erstellt», und der Kommentar in `updateStatement` (`:411` «Once paid, the PDF as sent stays») stimmt nicht mehr ganz.

**Behebung.** Entweder nur verwerfen, wenn `pdfGeneratedAt` nach dem Zahlungsdatum bzw. während «Bezahlt» liegt, oder so lassen und in der Bestätigung einen Satz ergänzen: «Das PDF wird beim nächsten Öffnen wieder mit Einzahlungsschein erstellt.» Kommentar `:411` angleichen.

## V-18 (Nit): Altbestand ohne bezahlten Betrag

**Beleg.** `backend/migrations/0007_statement_payment_resets.sql` füllt `paid_amount` nicht nach; `dashboard.ts:129-132` summiert `paid_amount`. Vor `7e13aaa` schrieb nichts `paid_amount` (#93, Problem).

**Warum.** Abrechnungen, die im laufenden Monat vor dem Einspielen als bezahlt markiert wurden, fehlen in `paidThisMonth`. Kein Bildschirm zeigt den Wert (#93), und #93 überlässt die Demodaten H-17; darum nur Nit.

**Behebung.** Optional einmalig `UPDATE utility_statements SET paid_amount = balance WHERE status = 'paid' AND paid_amount IS NULL` (entspricht der Regel aus #93), oder im Plan festhalten, dass der Altbestand bewusst leer bleibt.

## V-19 (Nit): Korrektur ohne Verlauf geprüft

**Beleg.** `tests/e2e/features/statement-detail.feature:107-111`: nach dem Zurücksetzen erneut bezahlt, geprüft wird nur «Dann hat die Abrechnung den Status "Bezahlt"».

**Warum.** V-7 verlangte, dass der Verlauf danach beide Zeilen nennt (Zurücksetzen und neues «Bezahlt»). Der DOM-Test (`statement-pages.dom.test.ts`, «führt im Verlauf jedes Zurücksetzen einer Zahlung») prüft zwei Zurücksetzungen, aber nicht zusammen mit einem neuen Zahlungsdatum.

**Behebung.** Im Szenario eine Zeile «Und nennt der Verlauf "Bezahlt" am Tag des Versands» anhängen (Schritt existiert, `statement-detail.steps.ts:262`).

## V-20 (Nit): Folge «später überfällig» nicht genannt

**Beleg.** `ResetPaymentDialog.svelte`: Status nach Frist richtig gewählt (V-4 erfüllt); `statements_reset_payment_text` nennt nur den Status, der sofort gilt.

**Warum.** Läuft die Frist noch, erfährt der Vermieter nicht, dass die Abrechnung ab dem Tag nach der Zahlungsfrist überfällig wird und er dann mahnen kann. Der Status ist richtig, die Folge unvollständig; für den unerfahrenen Vermieter hilfreich, nicht falsch.

**Behebung.** Optional für «Versendet»: «… hat den Status «Versendet»; nach dem {deadline} ist sie überfällig.»

---

## Bestätigt

- **`checkPaidDate`** (`statement.service.ts:488-494`) nachgerechnet, Abrechnungsdatum 2026-10-16, heute 2026-10-16: `2026-10-16` angenommen (gleich der Untergrenze, `<` ist strikt); `2026-10-15` → `PAID_DATE_BEFORE_STATEMENT {date: 2026-10-16}`; `2026-10-17` → `PAID_DATE_IN_FUTURE {date: heute}`; `2025-02-30` → JS-Datum wird 2025-03-02, `startsWith` scheitert → `PAID_DATE_INVALID`; `2024-02-29` (Schaltjahr) gültig; `2026-1-5` am Regex abgelehnt. Reihenfolge ungültig → zu früh → Zukunft: sinnvoll. Entspricht #138 «Decided» (Untergrenze = Abrechnungsdatum) und «Done means» (drei Codes, Datum der Grenze als Parameter). Der BFF prüft dasselbe (`src/lib/statement.ts`, `paidDateError`), mit leerem `statementDate` nur ohne Untergrenze; das Backend prüft dann.
- **#93, `paidAmount ??= existing.balance`**, auch beim automatischen Bezahlen bei Saldo 0 (`settled` setzt `status: 'paid'`, darum greift `updateData.status === 'paid'`). Nachgerechnet:
  1. Nachzahlung 150.00 und 80.00, Rückerstattung −60.00, alle heute bezahlt → `paid_amount` 150.00 / 80.00 / −60.00; `paidThisMonth` = `owed('paid')` (Status `paid`, Saldo > 0) und `paid_date ≥ Monatsbeginn` = 230.00 (Test `dashboard.pg.test.ts`).
  2. Saldo 0.00 beim Versand → bezahlt, `paid_amount` 0.00, wegen `balance > 0` nicht gezählt (Summe unverändert, Test `statement-lock.pg.test.ts`).
  3. Mieterwechsel: zwei Abrechnungen derselben Wohnung mit 41.60 (bezahlt 02.10.) und 112.25 (bezahlt 12.10.) → 153.85; eine am 30.09. bezahlte zählt im Oktober nicht.
  4. Zurücksetzen der 150.00 → `status` `sent`, `paid_amount` null → `paidThisMonth` 80.00.
  Entspricht #93 «Decided» («`paidThisMonth` counts only Nachzahlungen»).
- **`resetPayment`** (`:500-513`): nur aus `paid` (sonst `STATEMENT_NOT_PAID`), zurück auf `sent`; «Überfällig» ergibt sich aus `lt(paymentDeadline, today)` (`statusCondition`, `:75-77`), der Dialog wählt mit `paymentDeadline < localToday()` dieselbe Grenze (Fristtag selbst noch «Versendet», Glossar `:172` «Zahlungsfrist überschritten»). Zahlungsdatum und Betrag gelöscht, Zurücksetzung mit Tag, Zahlungsdatum und Betrag angehängt, PDF verworfen (V-1). Entspricht #92 «Decided». Mahnungen und `reminder_sent_date` bleiben unverändert, die Mahnstufe zählt aus `data.reminders` weiter.
- **Deutsche Texte:** `statements_paid_date_before` / `backend_paid_date_before_statement` «Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom {date}. Geben Sie frühestens dieses Datum ein.»: Begriffe Zahlungsdatum (Glossar `:67`) und Abrechnungsdatum (UI `statements_statement_date`, #290 offen); gilt für Nachzahlung und Rückerstattung (V-2 erledigt). `statements_reset_payment*`, `statements_history_payment_reset` «Zahlung vom {date} zurückgesetzt», `backend_statement_not_paid`, `backend_paid_date_invalid`: Sie-Form, «ss», sagen, was geschah und was zu tun ist. Die Bestätigung nennt den Status, der gilt (V-4).
- **fr/it/en gegen `i18n-begriffe.md`:** décompte/conteggio/statement (`:55`), date de paiement/data di pagamento/payment date (`:43`), envoyé/en retard/payé bzw. inviato/scaduto/pagato (`:65`, über `statusLabels`), «Date du décompte»/«Data del conteggio»/«Statement date» wie `statements_statement_date`, Historique/Cronologia/History wie `statements_history`, it Knopf im Infinitiv (`:5`). Ausnahmen: V-14, V-15.
- **Verlauf (V-11):** Schlüssel nach Index, jede Zurücksetzung eine Zeile (DOM-Test mit zwei gleichen Zurücksetzungen).
- **Szenarien** (`statement-detail.feature:67-128`, @wip entfernt): Untergrenze mit Fehlertext und Status «Versendet» (#138); Zurücksetzen mit Verlauf; Überfällig nach Ablauf; Bestätigung ohne Änderung; erneutes Bezahlen nach dem Zurücksetzen (V-7, siehe V-19). Kommentar zu «Zahlungseingang mit Datum festhalten» ehrlich gekürzt (V-6); verschiedene Daten prüfen die DOM-Tests (`2025-01-15` / `2025-01-20`, `2025-02-05` / `2025-02-10`).
- **Doku:** `docs/api-specification.md` (Codes, `PUT /:id/status`, `POST /:id/payment-reset`), `docs/data-model.md` (`paid_date`, `paid_amount`, `payment_resets`, Übergang `paid → sent` nur über `resetPayment`), `docs/PRD-Dwello.md:621, 1201, 1211` (V-8): stimmen mit dem Code überein.

## Nicht bestätigt

- **Fachbegriffe fr/it für «Zahlung zurücksetzen»:** `i18n-begriffe.md` kennt den Begriff nicht; meine Vorschläge in V-14 sind nicht durch eine Quelle belegt, nur durch den Gebrauch von «annuler/annullare» als «Abbrechen» in derselben Datei (`:101`). **unsicher**, Entscheid mit #290.
- **Uhrzeit/Zeitzone:** BFF prüft mit `localToday()`, Backend mit `swissToday()`; um Mitternacht oder ausserhalb der Schweiz können beide ein anderes «heute» haben. Bestand vorher; nicht nachgestellt.
- **`PUT /:id/status` mit `status: 'paid'` ohne `paidDate`:** speichert bezahlt ohne Zahlungsdatum (`checkPaidDate` nur bei gesetztem Datum); die Oberfläche sendet immer ein Datum. Bestand vorher, nicht geprüft, ob ein anderer Aufrufer das nutzt.
- **Recht:** keine neue Rechtsbehauptung in Texten oder Szenarien; die Fedlex-Zitate aus Runde 1 (OR Art. 74, 88, 102, 120) gelten unverändert und wurden nicht erneut abgerufen.
- **Quellen gelesen:** Diff `b5ecd9d..7e13aaa`, `messages/{de,fr,it,en}.json`, `docs/design/i18n-begriffe.md`, `UBIQUITOUS_LANGUAGE.md`, `backend/src/services/statement.service.ts`, `statement-pdf.service.ts`, `backend/src/routes/dashboard.ts`, `src/lib/ui/Dialog.svelte`, `ResetPaymentDialog.svelte`, `MetadataCard.svelte`, `statement-detail.feature` und Schritte, Issues #92, #93, #138, #290, #291 (`gh api`).
