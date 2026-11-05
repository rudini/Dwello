# Fachreview 1126-2 (Kostenabstimmung, Re-Review M-1/V-1, Commit bb697b7)

Gegenstand: `git diff eebe63d bb697b7 -- tests/e2e/features` (Worktree `review-1126-fach2`), Issue #1126 «Decided» (PO 05.11.2026, «Invoices changed after creating»), Vorbericht `docs/reviews/1126-fachreview-1.md`.

Geschlossen: M-1, V-1

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-9 | Verwalter | Minor | Rest aus M-1: Eine Position, die nur noch «davon Mieter» hat (alle Rechnungen einer Kategorie gelöscht, umkategorisiert oder nicht mehr umlagefähig), muss als Zeile mit «Kosten des Gebäudes» CHF 0.00 erscheinen und im Total zählen. Kein Szenario und kein geplanter Test pinnt das. Fix: pg-Test (Kaminfeger nach dem Erstellen gelöscht: Zeile 0.00 / 91.00 / -91.00, Total stimmt) |
| V-10 | Verwalter | Minor | Die Regel des Hinweises ist nur mit «beide nicht aktuell» gepinnt. Fix: pg-Test, je Abrechnung: nennen, wenn `invoiceIds.length > 0` oder `fuelStockChanged` (Glossar), nicht `correctionDue` und nicht `carryChanged` allein (`outdatedStatements()`, `statement-invoices.service.ts:182`, nimmt beides, und der Text nennt nur Rechnungen und Tankbestand). Dazu die Teilberichtigung aus V-1: 300.00 nachträglich erfasst, nur Eva berichtigt → 1’500.00 / 1’176.23 / 323.77 (372.95 + 803.28), der Hinweis nennt nur «Marc Huber». Und nach «Nicht berichtigen» bleibt die Abrechnung genannt |
| V-11 | Verwalter | Minor | reports.feature Z. 112 erwartet «CHF -177.05», `formatCurrency(-177.05)` (`src/lib/utils/format.ts:25`) gibt aber «CHF-177.05» aus (ICU de-CH, geprüft mit Node). Die Anzeige im Szenario ist die richtige. Fix: negative Beträge mit Leerzeichen formatieren (Unit-Test für -177.05 und -0.01) |
| V-12 | Verwalter | Minor | Mein Text `reports_note_not_current_*` sagt «ob Sie sie berichtigen müssen». Ein nicht aktueller Entwurf wird aber neu berechnet, nicht berichtigt (Glossar «Nicht aktuelle Abrechnung»: «der Liegenschaftsverwalter berechnet ihn vor dem Versand neu»). Fix: Text unten, Szenario Z. 99 nachführen (`@wip`, frei) |
| V-13 | Verwalter | Minor | reports.feature Z. 6 (Funktionalität) sagt noch «und Rechnungen finde, die keine Abrechnung enthält». Das widerspricht dem Entscheid vom 05.11.2026. Fix: «und Abrechnungen finde, die nicht aktuell sind» |

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| reports_note_not_current_one | 1 Abrechnung dieser Abrechnungsperiode ist nicht aktuell: Seit ihrem Erstellen wurden Rechnungen erfasst, geändert oder gelöscht oder der Tankbestand geändert. Öffnen Sie sie, um zu sehen, ob Sie sie neu berechnen oder berichtigen müssen: {statements}. | 1 décompte de cette période de décompte n’est pas à jour : depuis sa création, des factures ont été saisies, modifiées ou supprimées, ou le stock de combustible a changé. Ouvrez-le pour voir si vous devez le recalculer ou le rectifier : {statements}. | 1 conteggio di questo periodo di conteggio non è aggiornato: dalla sua creazione sono state registrate, modificate o eliminate fatture oppure è cambiata la scorta di combustibile. Lo apra per vedere se deve ricalcolarlo o rettificarlo: {statements}. | 1 statement of this billing period is not up to date: since it was created, invoices were added, changed or deleted, or the fuel stock changed. Open it to see whether you need to recalculate or correct it: {statements}. |
| reports_note_not_current_many | {count} Abrechnungen dieser Abrechnungsperiode sind nicht aktuell: Seit ihrem Erstellen wurden Rechnungen erfasst, geändert oder gelöscht oder der Tankbestand geändert. Öffnen Sie sie, um zu sehen, ob Sie sie neu berechnen oder berichtigen müssen: {statements}. | {count} décomptes de cette période de décompte ne sont pas à jour : depuis leur création, des factures ont été saisies, modifiées ou supprimées, ou le stock de combustible a changé. Ouvrez-les pour voir si vous devez les recalculer ou les rectifier : {statements}. | {count} conteggi di questo periodo di conteggio non sono aggiornati: dalla loro creazione sono state registrate, modificate o eliminate fatture oppure è cambiata la scorta di combustibile. Li apra per vedere se deve ricalcolarli o rettificarli: {statements}. | {count} statements of this billing period are not up to date: since they were created, invoices were added, changed or deleted, or the fuel stock changed. Open them to see whether you need to recalculate or correct them: {statements}. |

## Nicht bestätigt

- Ob der Seed-Schritt «die Rechnung … ist danach gelöscht» (`statement-detail.steps.ts:624`) eine Rechnung löschen darf, die eine versendete Abrechnung enthält, oder ob das Backend das verweigert. Ich habe keine Tests laufen lassen (Auftrag).
- Ob die Detailseite einer versendeten Abrechnung nach «Nicht berichtigen» «Spätere Änderungen» weiter zeigt, sodass der Link aus dem Hinweis dort eine Erklärung findet. Gelesen habe ich nur `statement-invoices.service.ts:100–195`, die Seite nicht.

Geprüft: Beträge der neuen Szenarien (Löschen: 372.95 + 1’004.10 = 1’377.05, 1’200.00 − 1’377.05 = −177.05; nachträglich erfasst: 1’500.00 − 1’101.64 = 398.36; berichtigt statt ersetzt: 1’101.64, sonst 1’400.00), Erkennung gelöschter Rechnungen (`changedInvoices`, `gone`), Link je Mieter im Hinweis, Texte V-2/V-4 in den Szenarien, Art. 257b Abs. 1 OR wie in Runde 1 (Stand 1.10.2026).
