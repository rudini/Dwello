# Fachreview #448, Runde 2 (Umsetzung)

Gegenstand: `git diff 42231a00 c326846d` (Worktree `review-448-fach2`, Commit c326846d). Anforderung: #448 «Decided (product owner)» mit den PO-Antworten vom 2026-10-19 (M-1, V-2, V-4) und #484 «Decided». Vorheriger Bericht: `docs/reviews/448-fachreview-1.md`. Gesetzeszitate wie in Runde 1 (Fedlex, OR Stand 1.10.2026), keine neuen Rechtsfragen.

## Status der IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| M-1 (Major) | **erledigt** | `statement.service.ts` `carriable`: `status='paid' and paidAmount=0 and -5 < balance < 0`; Tests «übernimmt eine kleine Rückerstattung … nach #94» und «übernimmt keine kleine Nachzahlung …». Die alte Abrechnung bleibt unverändert. Neue Lücke bei ihrer Berichtigung: M-5. |
| V-1 (Major) | **erledigt** | `Correction.svelte`: bei `balance < 0` Feld «Bereits zurückerstattet» mit eigener Hilfe; `paidOn()` speichert den Betrag negativ; pg-Test «hält bei einer Rückerstattung das schon Zurückerstattete negativ fest». |
| V-2 (Major) | **erledigt, mit zwei neuen Majors** | Regel umgesetzt (siehe Prüfpunkt 2). Offen: Entwurf als «verrechnet» (V-14), Berichtigung einer #94-Rückerstattung (M-5). |
| V-3 (Major) | **erledigt** | `statements_notes_help` «… Die Bemerkung steht im PDF.», Szenario «Eine geänderte Bemerkung steht im PDF». Ob bestehende Bemerkungen gedruckt werden sollen, steht nicht im Issue. Das bleibt eine Minor-Notiz: ein versendetes PDF wird nur neu erstellt, wenn sich die Bemerkung ändert. |
| V-4 (Major) | **erledigt** | `UBIQUITOUS_LANGUAGE.md` Z. 163 und 178 stimmen wörtlich mit #484 überein. |
| M-2 (Minor) | offen | PDF-Text unverändert (entschiedener Wortlaut), kein Angebot zur sofortigen Auszahlung. |
| M-3 (Minor) | offen, erweitert | Kein Hinweis auf einen offenen Übertrag ohne nächste Abrechnung. Zwei weitere Wege zum Verlust: V-16, V-17. |
| V-5 (Minor) | **erledigt** | Glossarzeilen «Schlussabrechnung» und «Saldo» eingetragen (Z. 175, 179). |
| V-6 (Minor) | offen | `pdf.service.ts` `carriedOver`: «Der Betrag ist kleiner als CHF 5.00. Der Betrag von CHF {amount} …», entschiedener Text aus #403. Den Vorschlag entscheidet der PO. |
| V-7 (Minor) | **erledigt** | Die Betragsspalte zeigt «+ 3.00» bzw. «– 3.00», die Kurzform «+ Übertrag CHF 3.00». |
| V-8 (Minor) | teilweise | Der Code ist richtig: übertragen wird der gespeicherte, gerundete `balance`. Ein pg-Test mit 3.02 → 3.00 fehlt noch. |
| V-9 (Minor) | **erledigt** | pg-Test für das Vertragsende 2025-01-01, 2024-06-30 und 2024-01-01; PDF der Schlussabrechnung ohne «verrechnet» (`statement-pdf-render.test.ts:329`). |
| V-10 (Minor) | teilweise | Die Dokumente sind nachgezogen (`nebenkostenabrechnung-anforderungen.md` Nr. 11). Offen: `statements_summary_waived_refund` «Sie zahlen ihn nicht aus.» auf der Detailseite einer #94-Rückerstattung, die nach M-1 jetzt übertragen wird (V-18). |
| V-11 (Minor) | offen | Die übertragene Abrechnung nennt nicht, wohin der Betrag ging (`countedBy` dient nur der Berichtigung). |
| V-12 (Minor) | **erledigt** | Leer oder negativ wird mit `STATEMENT_PAID_AMOUNT_INVALID` abgelehnt. Ein Betrag über dem Saldo ist zulässig (Überzahlung wird zur Rückerstattung); das ist richtig. |
| M-4 (Nit) | offen | unverändert |
| V-13 (Nit) | offen | App «− CHF 3.00» (U+2212, `statement-pages.dom.test.ts:546`), PDF «– 3.00» (Halbgeviertstrich). |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-14 | Verwalter / Mietrecht | Major | Ein **Entwurf** gilt als «verrechnet». Wird er danach neu berechnet oder gelöscht und neu erstellt, verliert er den Übertrag, die berichtigte Abrechnung rechnet ihn aber weiter an: CHF 3.00 gehen verloren oder werden doppelt angerechnet. |
| M-5 | Verwalter / Mietrecht | Major | Wird eine nach #94 erledigte Rückerstattung (Status «Bezahlt», 0.00) berichtigt, nachdem die nächste Abrechnung sie schon übertragen hat, rechnet die berichtigte Abrechnung nichts als «Bereits verrechnet» an. Der Mieter erhält die Rückerstattung doppelt. |
| V-15 | Verwalter | Minor | Glossarzeile «Berichtigte Abrechnung» (Z. 184) nennt nur «eine versendete oder bezahlte Abrechnung», jetzt auch eine erledigte. Der Begriff «Bereits verrechnet mit NK-…» fehlt im Glossar. Formulierung siehe unten. |
| V-16 | Verwalter | Minor | Pro Abrechnung wird nur ein Übertrag gezählt (`carried_from_id`, `limit 1`, die jüngste). Mehrere offene, z.B. zwei #94-Rückerstattungen 2023 und 2024, rücken je eine Periode nach. Ist die nächste Abrechnung die Schlussabrechnung, geht die ältere verloren (M-3). Fix: alle offenen einrechnen oder mindestens die Schlussabrechnung alle. |
| V-17 | Verwalter | Minor | `final` wird bei jedem Lesen aus dem aktuellen Vertragsende berechnet. Wird das Vertragsende nach dem Versand auf den 31.12. der Periode gesetzt (ändert die Mietstage nicht, also nicht gesperrt), gilt die erledigte Abrechnung plötzlich als Schlussabrechnung. Die Detailseite zeigt dann CHF 3.00 als Nachzahlung (`unpaid()` false), ein neu erstelltes PDF einen Zahlteil, und der Übertrag hat keine nächste Abrechnung mehr. Fix: den Status «Erledigt» vor `final` werten (PDF `minimumOf`, `PaymentPanel`), dazu ein pg-Test. |
| V-18 | Verwalter | Minor | Detailseite einer #94-Rückerstattung: «Der Betrag ist kleiner als CHF 5.00. Sie zahlen ihn nicht aus.» stimmt nach M-1 nicht mehr. Vorschlag: «Der Betrag ist kleiner als CHF 5.00. Er wird mit der nächsten Abrechnung verrechnet.» (= `statements_summary_carried`). Das PDF bleibt, wie es versendet wurde. |
| V-19 | Verwalter | Minor | `glossary_balance_text` sagt nicht, dass der Übertrag in den Saldo zählt, und nennt die Rundung vor dem Übertrag, obwohl vor der Rundung eingerechnet wird. Ausserdem «geleisteten Akontobeiträge» statt «Akontobeiträge» (#484/#477). Vorschlag siehe Prüfpunkt 5. |
| V-20 | Verwalter | Minor | EN `statements_status_settled` «Settled» liest sich im Englischen als «bezahlt» und steht im Filter neben «Paid». Vorschlag «Closed» (gleiche Bedeutung wie FR «Clôturé», IT «Chiuso»). |
| V-21 | Verwalter | Nit | EN `statements_correct_paid_help` / `_refunded_help` «…, also a part.» ist kein idiomatisches Englisch. Vorschlag: «…, including a partial payment.» bzw. «…, including a partial amount.». |
| V-22 | Verwalter | Nit | PDF-Zeile «Übertrag aus Abrechnung NK-…: CHF 3.00» mit Betragsspalte «+ 3.00» nennt den Betrag in derselben Zeile zweimal. Der Wortlaut ist entschieden (#403), deshalb nur Nit. |

## Major-Befunde

### V-14 Ein Entwurf gilt als «verrechnet»

- Beleg: `backend/src/services/statement.service.ts:384-389` `countedBy` zählt jede Abrechnung mit `carried_from_id`, auch einen Entwurf. `offsetOf()` (Z. 744-749) setzt daraufhin `paidAmount` der ersetzten Abrechnung. `recalculateStatement()` (Z. 518-548) übernimmt `replacesId` und `priorPayments`, `carriedFromId` aber nicht: es ruft `carriedOver()` neu auf, und die ersetzte Abrechnung ist nicht mehr `carriable` (Status `replaced`). Der Test «rechnet einen schon übertragenen Saldo … als verrechnet an» (`statement-carry-over.pg.test.ts:217`) prüft genau den Fall mit Entwurf `next`, ohne Neuberechnung.
- Nachgerechnet (A 2024 erledigt, B 2025 Entwurf, eigener Saldo 50.00):
  - Nachzahlung: A +3.00 → B 53.00. A berichtigt, richtiger Saldo 20.00 → A' = 20.00 − 3.00 = 17.00. Neue Rechnung, B neu berechnet → 50.00. Der Mieter zahlt 67.00 statt 70.00, der Vermieter verliert 3.00.
  - Rückerstattung: A −3.00 → B 47.00; A' = 20.00 + 3.00 = 23.00; B neu → 50.00. Der Mieter zahlt 73.00 statt 70.00. Das ist mehr als die tatsächlichen Aufwendungen, gegen Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters […]» (Zitat Runde 1).
  - Ohne Neuberechnung (Kontrolle): 17.00 + 53.00 = 70.00. Richtig.
  - Randfall: A' mit unverändertem Saldo 3.00 → 0.00, «Erledigt»; dann B neu berechnet → 50.00. Die 3.00 sind verloren.
- Warum falsch: Ein Entwurf ist dem Mieter noch nicht mitgeteilt und ändert sich noch. «Bereits verrechnet mit NK-B» im PDF der berichtigten Abrechnung verweist auf eine Abrechnung, die der Mieter nicht hat und deren Übertrag noch entfallen kann.
- Fix (eindeutig): «verrechnet» heisst «in einer versendeten Abrechnung» (`countedBy` nur `status <> 'draft'`). Ein Entwurf, der die ersetzte Abrechnung zählt, verliert beim Ersetzen den Übertrag (im selben Vorgang neu berechnen oder `carried_from_id` leeren und den Saldo nachführen); die nächste Abrechnung nimmt dann den Saldo der berichtigten, wie in der V-2-Regel. Dazu ein pg-Test: ersetzen bei einem Entwurf, der zählt, danach den Entwurf neu berechnen, die Summe stimmt. Die Regel ins Issue: «… ist ihr Saldo schon in einer versendeten nächsten Abrechnung als Übertrag …».

### M-5 Berichtigung einer nach #94 erledigten Rückerstattung

- Beleg: `statement.service.ts:744-749` `if (statement.status !== 'settled') return {};`. Eine #94-Rückerstattung hat den Status `paid` mit `paidAmount = 0.00` und wird nach M-1 trotzdem übertragen (`carriable`, Z. 392-395). `replaceStatement()` nimmt `paid` an (Z. 733), fragt bei `paid` aber kein «Bereits bezahlt» ab. Kein Test zu diesem Fall.
- Nachgerechnet: A 2024 nach #94 mit −3.00, B 2025 versendet mit «Übertrag aus Abrechnung A: – 3.00». A berichtigt, richtiger Saldo +7.00 → A' = 7.00 − 0.00 = 7.00 (richtig wäre 7.00 + 3.00 = 10.00, denn B hat die 3.00 schon gutgeschrieben). Der Vermieter verliert 3.00. Ist A' unverändert −3.00, erhält der Mieter 3.00 doppelt (in B und mit A').
- Warum falsch: Die V-2-Regel gilt für jeden übertragenen Saldo. Die #94-Rückerstattung ist nach dem PO-Entscheid M-1 einer.
- Fix (eindeutig): in `offsetOf()` dieselbe Bedingung wie `carriable` verwenden statt `status === 'settled'`, dazu ein pg-Test «berichtigt eine nach #94 erledigte Rückerstattung, die die nächste Abrechnung schon zählt».

## Prüfpunkte des Auftrags

### 1. Offene IDs aus Runde 1

Siehe Tabelle oben. Eindeutige Empfehlung: ja.

### 2. V-2-Regel

Umsetzung geprüft (`replaceStatement`, `offsetOf`, `correctionsOf`, `carriedOver`, `CostTable.svelte`, `pdf.service.ts` `offsetLine`):

- Eine erledigte Abrechnung lässt sich berichtigen, das Feld «Bereits bezahlt» erscheint nicht (`askPaid` nur `sent`/`overdue`), und ein mitgesandter Betrag wird mit 409 abgelehnt. Bestätigt (pg-Test Z. 207).
- Schon übertragen: `paidAmount` = Saldo der ersetzten Abrechnung. Der Saldo der berichtigten zieht ihn ab bzw. zählt ihn dazu, und die Zeile «Bereits verrechnet mit NK-…» erscheint statt «Bereits bezahlt auf»; `priorLine` zieht den Betrag aus «Bereits bezahlt» heraus. Vorzeichen: Nachzahlung «– 3.00», Rückerstattung «+ 3.00». Bestätigt.
  - A +3.00 → B; A' unverändert: 3.00 − 3.00 = 0.00, «Erledigt», kein neuer Übertrag. Richtig.
  - A −3.00 → B; A' mit +10.00 Kosten: 7.00 − (−3.00) = 10.00. Richtig.
  - Teilzahlung (V-1): Rückerstattung −40.00, schon 15.00 überwiesen → `paidAmount` −15.00; neuer Saldo −50.00 → −50.00 − (−15.00) = −35.00. Richtig.
- Noch nicht übertragen: Die ersetzte Abrechnung ist nicht mehr `carriable`, die nächste nimmt den Saldo der berichtigten (pg-Test Z. 231: −2.00). Bestätigt.
- Berichtigte Abrechnung übernimmt den Übertrag der ersetzten (Fall c): `carriedOver` zählt Abrechnungen derselben Periode nicht als «schon gezählt». Bestätigt (pg-Test Z. 151).
- Saldo 0.00 erledigt und ersetzt: nicht `carriable` (`balance <> 0`), kein `countedBy`. Richtig.
- Texte: App `statements_offset_with` «Bereits verrechnet mit {numbers}», PDF «Bereits verrechnet mit {numbers}» und Kurzform «bereits verrechnet»; FR «Déjà compensé avec» / «déjà compensé», IT «Già compensato con» / «già compensato», EN «Already offset against» / «already offset». Für den Mieter verständlich und in den vier Sprachen gleichbedeutend. «compensé»/«compensato» ist auch der Rechtsbegriff der Verrechnung (Art. 120 OR, FR «compensation»); rechtlich bleibt es eine Anrechnung (M-2), vertretbar. Bestätigt.
- Nicht in Ordnung: V-14 (Entwurf), M-5 (#94-Rückerstattung).

Empfehlung: eindeutig. Die Regel ist richtig umgesetzt bis auf V-14 und M-5; beide Fixes oben.

### 3. M-1

Kleine Rückerstattungen aus nach #94 erledigten Abrechnungen werden übertragen, Nachzahlungen nicht; die alte Abrechnung bleibt «Bezahlt» mit 0.00 und ihrem PDF. Bestätigt (pg-Tests Z. 165, 180). Grenze `-5 < balance < 0` stimmt mit `belowMinimum` (gerundeter Saldo) überein; eine wirklich ausbezahlte kleine Rückerstattung hat `paidAmount` = Saldo ≠ 0 (#93) und wird richtigerweise nicht übertragen. Rechtlich wie in Runde 1 (Art. 115 OR: «Eine Forderung kann durch Übereinkunft ganz oder zum Teil … formlos aufgehoben werden …»; ohne Übereinkunft besteht die Forderung des Mieters weiter). Lücken: M-5, V-16 (mehrere alte Rückerstattungen), V-18 (Text der Detailseite).

Empfehlung: eindeutig (M-1 erledigt; M-5 beheben, V-16/V-18 als Minor).

### 4. Hilfetext «Bereits zurückerstattet»

«Was Sie dem Mieter auf diese Abrechnung schon überwiesen haben, auch ein Teilbetrag.» richtet sich an den Verwalter (Sie-Form) und nennt den Zahlenden richtig. Er ist parallel zu «Was der Mieter auf diese Abrechnung schon überwiesen hat, auch ein Teilbetrag.» und passt zur Glossarzeile «Bereits zurückerstattet» (Z. 176: «was der Vermieter schon erstattet hat»). FR «Ce que vous avez déjà versé au locataire sur ce décompte, même un montant partiel.» und IT «Quanto ha già versato all'inquilino su questo conteggio, anche un importo parziale.» sind korrekt und in der Form der Anrede (vous / Lei) einheitlich. EN «What you have already paid the tenant on this statement, also a part.»: Inhalt richtig, Wortlaut V-21.

Empfehlung: eindeutig, den deutschen Text so übernehmen (PO bestätigt im Issue), EN nach V-21 anpassen.

### 5. Neue Texte

| Text | Urteil |
|---|---|
| `statements_summary_carried` «Der Betrag ist kleiner als CHF 5.00. Er wird mit der nächsten Abrechnung verrechnet.» (FR/IT/EN gleichbedeutend) | bestätigt; erscheint richtigerweise nicht auf der Schlussabrechnung (`unpaid()` mit `final`). |
| `statements_status_settled` DE «Erledigt», FR «Clôturé», IT «Chiuso», EN «Settled» | DE, FR, IT bestätigt (neutral, kein «bezahlt»; FR «Soldé» oder «Liquidé» wären näher an «bezahlt», also nicht besser). EN: V-20, «Closed». |
| `statements_carry_over` «Übertrag aus Abrechnung {number}» | bestätigt (entschiedener Wortlaut ohne Betrag, der steht in der Spalte mit Vorzeichen). |
| `statements_paid_date_early` «Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom {date}. Trotzdem speichern?», Knopf «Trotzdem speichern» | bestätigt, wörtlich #403 (4). |
| `backend_paid_date_before_period_end` / `statements_paid_date_before_period` «… vor dem Ende der Abrechnungsperiode am {date}. Geben Sie frühestens dieses Datum ein.» | bestätigt; Prüfung `paidDate < periodEnd`, das Periodenende selbst ist zulässig, der Text stimmt damit überein. |
| `statements_notes_help` «Zum Beispiel eine Absprache mit dem Mieter. Die Bemerkung steht im PDF.» | bestätigt (V-3). |
| `statements_notes_help_correction` «Schreiben Sie hier, warum Sie die Abrechnung berichtigen. Die Bemerkung steht im PDF.» | bestätigt, #403 (6). |
| `glossary_balance_text` | V-19. Vorschlag: «Der Kostenanteil des Mieters samt Verwaltungspauschale minus seine Akontobeiträge, plus eine übertragene Nachzahlung bzw. minus eine übertragene Rückerstattung der vorherigen Abrechnung, auf 5 Rappen gerundet, nur zugunsten des Mieters: Eine Nachzahlung wird ab-, eine Rückerstattung aufgerundet. Ist der Saldo positiv, zahlt der Mieter nach (Nachzahlung); ist er negativ, erhält er Geld zurück (Rückerstattung). Ein Saldo unter CHF 5.00 wird nicht eingefordert oder ausbezahlt, sondern in der nächsten Abrechnung desselben Mietvertrags verrechnet (Übertrag); die Schlussabrechnung kennt keinen Mindestbetrag.» FR/IT/EN entsprechend. |
| PDF `carriedOver` (vier Sprachen) | inhaltlich bestätigt, entschiedener Wortlaut; Stil V-6 (offen, PO). |
| PDF `carryOver` «Übertrag aus Abrechnung {number}: CHF {amount}» (FR «Report du décompte», IT «Riporto dal conteggio», EN «Carried over from statement») | bestätigt, entschiedener Wortlaut; V-22 (Nit). |
| Glossarzeilen Abrechnungsdatum, Saldo, Übertrag, Schlussabrechnung | bestätigt: wörtlich die Vorschläge aus #484, im Saldo «Akontobeiträge» (#484 «Decided»). Lücke V-15. |

Empfehlung: eindeutig für alle Zeilen ausser `statements_status_settled` EN. «Closed» ist eine klare Empfehlung, aber Übersetzungswortlaut ohne fachliche Quelle; die ❓ in `docs/design/i18n-begriffe.md` für FR/IT kann nach diesem Review entfallen, wenn der PO zustimmt.

## Vorgeschlagene Begriffe (Issue: `fachlich`, `entscheiden`)

- **Bereits verrechnet mit NK-…** (neu, Zeile nach «Bereits bezahlt / Bereits zurückerstattet»): «Zeile der berichtigten Abrechnung: der Saldo der ersetzten Abrechnung, den die nächste versendete Abrechnung schon als Übertrag enthält. Wird wie «Bereits bezahlt» vom Saldo abgezogen bzw. bei einer Rückerstattung dazugezählt.» Code: `paid_amount` der ersetzten Abrechnung, `carried_from_id` der nächsten.
- **Berichtigte Abrechnung** (ändern): «Neue Nebenkostenabrechnung, die eine versendete, bezahlte oder erledigte Abrechnung ersetzt («ersetzt NK-…»). … Was Mieter oder Vermieter auf die ersetzte Abrechnung schon bezahlt haben oder was die nächste Abrechnung schon als Übertrag enthält, wird angerechnet. …»

## Nicht bestätigt

- Ob der Mieter bei einem Übertrag die sofortige Auszahlung verlangen kann (M-2, Art. 75 OR): unverändert aus Runde 1, keine Rechtsprechung gesucht.
- Reihenfolge beim Versand: Wird Abrechnung 2023 erst versendet («Erledigt»), nachdem 2024 schon erstellt ist, zählt 2024 den Übertrag nur nach einer Neuberechnung, sonst erst 2025 (V-16). Gelesen: `carriedOver()`, `updateStatementStatus()`; kein Test dazu in `statement-carry-over.pg.test.ts`.
- Ob ein erledigter Saldo der berichtigten Abrechnung (A' «Erledigt») richtig in die übernächste geht, wenn B schon A zählt: der Code nimmt ihn in die nächste ungezählte spätere Abrechnung (C); gelesen in `carriedOver()`, kein Test.
- E2E-Abdeckung der Zeilen «Bereits verrechnet mit» und «Bereits zurückerstattet»: nur DOM- und pg-Tests (`statement-pages.dom.test.ts:554`, `:642`; `statement-pdf-render.test.ts:620`), kein Szenario gefunden (`grep` in `tests/e2e/features`). Prozessfrage für `code-reviewer`, nicht fachlich.
- Daten und PDF nicht ausgeführt (keine Tests laufen lassen); alle Beträge oben von Hand nachgerechnet.
