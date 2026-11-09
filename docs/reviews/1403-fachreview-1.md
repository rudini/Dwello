# Fachreview 1403-1: Warnung im Mahndialog bei fälliger Berichtigung

Subjekt: @wip-Szenario «Vor einer Mahnung warnt Dwello, wenn die Abrechnung zu berichtigen ist», tests/e2e/features/statement-reminder.feature:197-207, Worktree review-1403-fach (b1ebbc68).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Major | «neu berechnet schuldet Anna Keller CHF 3’073.95»: ein Betrag, den noch keine Abrechnung verlangt, wird als geschuldet bezeichnet |
| V-1 | Verwalter | Major | Der neue Betrag muss der offene Betrag sein, den die berichtigte Abrechnung verlangen würde (Saldo neu minus Teilzahlungen, auf 5 Rappen zugunsten des Mieters gerundet), vom Backend berechnet, nicht `recalculated.balance − paidAmount` im Frontend |
| V-2 | Verwalter | Major | Regel für die Varianten fehlt: ohne sie würde der Hauptsatz bei einer neuen Rückerstattung oder einem Betrag unter dem Mindestbetrag einen falschen offenen Betrag nennen |
| V-3 | Verwalter | Minor | «Ohne fällige Berichtigung bleibt der Dialog unverändert» (PO) ist nirgends festgehalten; Fix: DOM-Test des ReminderModal ohne `correctionDue`: kein Element `reminder-correction` |
| V-4 | Verwalter | Minor | Z. 206 «eine Mahnung sendet» klickt laut tests/e2e/tasks/documents.ts:40-41 zuerst wieder `reminderButton`, während der Dialog schon offen ist. Fix: ein Schritt, der im offenen Dialog bestätigt, z.B. «Wenn der Liegenschaftsverwalter die Mahnung trotzdem sendet» (`Click.on(confirmReminderButton)`, `Wait.until(reminderFeedback)`). Fachlich ist «Zu versenden» die richtige Prüfung (Brief) |

## M-1 (Major): «schuldet» für einen nicht abgerechneten Betrag

- Beleg: statement-reminder.feature:205 «… neu berechnet schuldet Anna Keller CHF 3’073.95 statt CHF 2’320.00 …»; derselbe Dialog sagt in ReminderModal.svelte:50-53 «{tenant} schuldet noch CHF 2’320.00».
- Warum falsch: Geschuldet und mahnbar ist nur eine fällige Forderung. Art. 102 Abs. 1 OR (Stand 1. Oktober 2026): «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.» Fällig ist der höhere Betrag erst, wenn die berichtigte Abrechnung beim Mieter ist. Bis dahin schuldet Anna Keller CHF 2’320.00. Im selben Dialog stünden zwei Sätze mit «schuldet» und verschiedenen Beträgen nebeneinander. Sinkt der Betrag durch die Neuberechnung, verlangt die alte Abrechnung mehr als die tatsächlichen Aufwendungen. Art. 257b Abs. 1 OR (Stand 1. Oktober 2026): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …». Diese Wirkung gehört in den Satz, nicht eine neue Schuld.
- Fix: Formulieren wie der Hinweis auf der Detailseite («Neu berechnet ergibt sich für …», messages/de.json:1472), und zwar mit dem Begriff «Offener Betrag» (UBIQUITOUS_LANGUAGE.md:194, den die Mahnung schon nennt). Text: `statements_reminder_correction_due` unten. Z. 205 des Szenarios wird damit zu:
  «Diese Abrechnung ist zu berichtigen: Neu berechnet ergibt sich für Anna Keller ein offener Betrag von CHF 3’073.95 statt CHF 2’320.00. Berichtigen Sie die Abrechnung mit «Abrechnung berichtigen», bevor Sie mahnen.»

## V-1 (Major): welcher Betrag als «neu»

- Entscheid zu Frage 1: Verglichen werden die offenen Beträge. `{before}` = `openAmount(statement)`, also genau der Betrag, den der Dialog unter «schuldet noch» nennt. `{now}` = der Saldo, den die berichtigte Abrechnung hätte. Diese rechnet das Bezahlte an (UBIQUITOUS_LANGUAGE.md:191, 192, 207).
- Beleg: Die berichtigte Abrechnung rechnet `calculateBalance(totalCosts + carryOver, totalAdvancePayments + priorPayments)` mit `priorPayments = paidAmount + priorPayments` der ersetzten Abrechnung (backend/src/services/statement-generation.service.ts:52-55, 72-73) und rundet den Saldo nach dem Abzug ab (calculation.service.ts:297-299, pdf-format.ts:20). `recalculated.balance` (statement-generation.service.ts:211) ist dagegen der Saldo vor Zahlungen, und der ist schon gerundet.
- Nachgerechnet:
  - Szenario ohne Teilzahlung: alt 4’000 + 3 % (120.00) = 4’120.00, minus 12 × 150 = 1’800, ergibt **2’320.00**. Neu 4’732 + 141.96 = 4’873.96, minus 1’800 = 3’073.96, abgerundet **3’073.95**. Das bestätigt die Beträge der Probe und der Zeile 205 (Verwaltungspauschale vereinbart: tests/e2e/fixtures/backend.ts:221; Vorgabe 3 %: config.service.ts:58).
  - Mit Teilzahlung 1’000.00: Der Dialog nennt 1’320.00. Die berichtigte Abrechnung ergibt 4’873.96 − 2’800 = 2’073.96, also 2’073.95. Hier stimmt auch 3’073.95 − 1’000.
  - Randfall: Saldo vor Rundung 3’073.99, Teilzahlung 1’000.01. Die berichtigte Abrechnung ergibt 2’073.98, gerundet **2’073.95**. Das Frontend käme auf 3’073.95 − 1’000.01 = 2’073.94, gerundet **2’073.90**. Die Warnung nennt also 5 Rappen weniger, als die berichtigte Abrechnung verlangt.
- Fix: Das Backend liefert den Betrag in `correctionOf`/`recalculation` mit, z.B. `recalculated.open`, berechnet wie die berichtigte Abrechnung (`calculateBalance(…, advances + priorPayments + paidAmount)`), dazu ob er eingefordert wird (siehe V-2). Das Frontend rechnet nicht selbst nach.

## V-2 (Major): Varianten (Fragen 2 bis 4)

Drei Texte reichen. Die Mahnung ist nur bei einer überfälligen Nachzahlung mit offenem Betrag zu haben (StatusActions.svelte:30-32), `{before}` ist also immer grösser als 0. Welcher Text gilt, hängt vom offenen Betrag nach der Berichtigung ab (V-1):

| Fall | Text |
|------|------|
| Neuer offener Betrag wird eingefordert (≥ CHF 5.00, auf der Schlussabrechnung > 0) und ist anders als `{before}` | `statements_reminder_correction_due` |
| Neuer offener Betrag ≤ 0 (ausgeglichen oder Rückerstattung), oder unter dem Mindestbetrag und damit übertragen (nicht auf der Schlussabrechnung) | `statements_reminder_correction_nothing_due` |
| Gleicher offener Betrag (nur eine Position ändert sich), `recalculated` null (nicht neu berechenbar) oder `uncalculableKeys` nicht leer (#1309) | `statements_reminder_correction_unquantified` |

- Warum: Mit `francs()` (src/lib/statement.ts:114) ohne Vorzeichen würde der Hauptsatz eine neue Rückerstattung von CHF 255.00 als «offenen Betrag von CHF 255.00» ausgeben. Ein übertragener Rest unter CHF 5.00 wird nicht eingefordert (UBIQUITOUS_LANGUAGE.md:197-198). Beides wäre falsch. In diesen Fällen wäre die Mahnung eine Forderung über mehr als die tatsächlichen Aufwendungen (Art. 257b Abs. 1 OR, Zitat bei M-1). Deshalb rät der Text dort «statt zu mahnen». Senden bleibt laut PO möglich.
- `recalculated.belowMinimum` (statement-generation.service.ts:213-214) taugt dafür nicht: Es prüft die Saldi vor Zahlungen. Massgebend ist der offene Betrag nach Abzug der Teilzahlungen. Ein eigener Satz zum Mindestbetrag entfällt, weil die zweite Variante den Fall abdeckt.
- Gleicher Betrag braucht keine eigene Variante: Der Hinweis auf der Seite nennt die Änderung («Neu berechnet bleibt der Saldo … gleich, aber eine Position ändert sich», de.json:1480).
- Beispiele: Rückerstattung (Heizkosten neu 1’500: 1’545 − 1’800 = −255.00) gibt den zweiten Text. Teilzahlung 2’000 und neuer Saldo 2’003.00 geben offen 3.00, also übertragen, also den zweiten Text. Dieselben Zahlen auf einer Schlussabrechnung geben den ersten Text mit «CHF 3.00 statt CHF 320.00».
- «Nicht berichtigt» gewählt: `correctionDue` ist falsch (statement-invoices.service.ts:184), also keine Warnung. Das ist richtig, denn der Verwalter hat entschieden, und die alte Abrechnung gilt.

## Texte

| key | de | fr | it | en |
|-----|----|----|----|----|
| statements_reminder_correction_due | Diese Abrechnung ist zu berichtigen: Neu berechnet ergibt sich für {tenant} ein offener Betrag von CHF {now} statt CHF {before}. Berichtigen Sie die Abrechnung mit «Abrechnung berichtigen», bevor Sie mahnen. | Ce décompte doit être rectifié : le recalcul donne pour {tenant} un montant dû de CHF {now} au lieu de CHF {before}. Rectifiez le décompte avec « Rectifier le décompte » avant d’envoyer un rappel. | Questo conteggio va rettificato: il ricalcolo dà per {tenant} un importo dovuto di CHF {now} invece di CHF {before}. Rettifichi il conteggio con «Rettificare il conteggio» prima di inviare un sollecito. | This statement needs to be corrected: recalculating gives {tenant} an amount outstanding of CHF {now} instead of CHF {before}. Correct the statement with «Correct statement» before you send a reminder. |
| statements_reminder_correction_nothing_due | Diese Abrechnung ist zu berichtigen: Neu berechnet ist von {tenant} statt CHF {before} nichts mehr einzufordern. Berichtigen Sie die Abrechnung mit «Abrechnung berichtigen», statt zu mahnen. | Ce décompte doit être rectifié : d’après le recalcul, il n’y a plus rien à réclamer à {tenant}, au lieu de CHF {before}. Rectifiez le décompte avec « Rectifier le décompte » au lieu d’envoyer un rappel. | Questo conteggio va rettificato: secondo il ricalcolo non c’è più nulla da richiedere a {tenant}, invece di CHF {before}. Rettifichi il conteggio con «Rettificare il conteggio» invece di inviare un sollecito. | This statement needs to be corrected: recalculating leaves nothing more to claim from {tenant} instead of CHF {before}. Correct the statement with «Correct statement» instead of sending a reminder. |
| statements_reminder_correction_unquantified | Diese Abrechnung ist zu berichtigen. Was sich geändert hat und was zu tun ist, sagt der Hinweis auf dieser Seite. Berichtigen Sie die Abrechnung, bevor Sie mahnen. | Ce décompte doit être rectifié. La remarque sur cette page indique ce qui a changé et ce qu’il faut faire. Rectifiez le décompte avant d’envoyer un rappel. | Questo conteggio va rettificato. L’indicazione su questa pagina dice che cosa è cambiato e che cosa fare. Rettifichi il conteggio prima di inviare un sollecito. | This statement needs to be corrected. The note on this page says what has changed and what to do. Correct the statement before you send a reminder. |

`{now}` und `{before}` ohne «CHF» und ohne Vorzeichen, wie `francs()`. ` ` ist das geschützte Leerzeichen, wie es fr.json heute schon vor «:» und in « » setzt. Der dritte Text nennt den Knopf nicht: Solange ein Verteilschlüssel nicht berechenbar ist, lehnt Dwello «Abrechnung berichtigen» ab (UBIQUITOUS_LANGUAGE.md:142).

## Nicht bestätigt

- Beträge der Zeile 205 nur von Hand nachgerechnet (Fixture, Config-Vorgabe, Rundung im Code), Szenario nicht selbst laufen lassen. Das deckt sich mit der Probe des Aufrufers.
- V-4: Dass der zweite Klick auf `reminderButton` am offenen modalen Dialog scheitert, ist nur aus tasks/documents.ts:40-41 abgeleitet, nicht ausgeführt.
- fr-Typografie (U+00A0) nur an `statements_later_sent` und `ui_draft_saved` in messages/fr.json geprüft.

Geprüft: Beträge 2’320.00 und 3’073.95; Prüfung «Zu versenden» als Beleg, dass Senden möglich bleibt; keine Warnung nach «Nicht berichtigt»; Begriffe Offener Betrag, Berichtigte Abrechnung, Mahnung und Hinweis gegen UBIQUITOUS_LANGUAGE.md und docs/design/i18n-begriffe.md:102-126; kein Begriff fehlt.
