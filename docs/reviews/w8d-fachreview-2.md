# Fachreview #86 «Abrechnung per E-Mail senden», Runde 2

Gegenstand: Worktree `review-w8d-fach2`, Commit 15bc472, Diff gegenüber 02a3e46. Geprüft wurde nur der eigene Teil von #86 (`4918710..15bc472`). Die Rundung zugunsten des Mieters (#79, `pdf-format.ts`, Migration 0016) kam über den Merge von `main` und wurde dort separat geprüft (`docs/reviews/w2d-fachreview-*.md`).

Gesamturteil: kein Blocker, kein Major. Das Verhalten entspricht dem Entscheid von #86 (Option 2). Die Runde-1-Befunde V-1, V-3 (Fallwahl), V-8 und V-9 sowie R-2 sind umgesetzt. Neu sind vier Minor und drei Nit.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-10 | Verwalter | Minor | Die E-Mail spricht von «den Betrag», nennt ihn aber nirgends (weder Nachzahlung noch Rückerstattung). |
| V-11 | Verwalter | Minor | Nach einer gescheiterten E-Mail zeigt der Briefdialog «Korrespondenzkanal: Per E-Mail, keine E-Mail-Adresse erfasst» statt der Postadresse. |
| V-12 | Verwalter | Minor | Ist die E-Mail draussen und scheitert danach das Speichern von Status oder Dokument, bleibt die Abrechnung ein Entwurf ohne Beleg, und ein zweites Senden verschickt sie doppelt. |
| V-13 | Verwalter | Minor | Französisch: «par courrier» in drei neuen Texten, obwohl Brief laut Begriffsliste «lettre» heisst; der Hilfetext sagt im selben Ablauf «Pour une lettre». |
| V-14 | Verwalter | Nit | Szenario-Titel, Feature-Beschreibung und Schrittname sagen weiterhin «die Zahlungsfrist … beginnt». Laut Glossar ist die Zahlungsfrist ein Datum. |
| V-15 | Verwalter | Nit | Der Betreff «Nebenkostenabrechnung – NK-…» ist anders aufgebaut als bei den Mahnungen und nennt weder Jahr noch Objekt. |
| V-16 | Verwalter | Nit | Italienisch: «In allegato le inviamo» klein geschrieben, der Saldosatz in derselben E-Mail aber gross («Le bonifichiamo», «La preghiamo»). |

## Bestätigt (mit Quelle)

- **Verhalten entspricht dem Entscheid** (`backend/src/services/statement-send.service.ts`):
  - Mieter mit Kanal E-Mail: PDF per E-Mail und Dokument (`type: statement`, `channel: email`, `status: sent`, Z. 37-62).
  - Kanal Brief oder `byLetter`: nur `updateStatementStatus(id, 'sent')` (Z. 22), also manuell wie bisher.
  - Ein Fehler ohne Adresse, ohne Einrichtung oder mit Abweisung wirft vor dem Statuswechsel einen eigenen Code (Z. 23, 45-48). Die Abrechnung bleibt «Entwurf», es entsteht kein Dokument (`statement-mail.pg.test.ts:154-186`).
  - Die UI bietet danach «Per Brief zustellen» an (`SendFeedback.svelte`, `statement-actions.ts` `UNDELIVERED`).
  - Nur ein Entwurf lässt sich senden (`STATEMENT_ALREADY_SENT`).
- **Zahlungsfrist ab dem erfolgreichen Versand.** `datedToday` (`statement.service.ts:450-453`) läuft sowohl im PDF (`statement-pdf.service.ts:254`) als auch beim Statuswechsel (`statement.service.ts:484`). Nachgerechnet mit `payment_deadline_days` = 30:
  - Versand am 17.10.2026: Frist 16.11.2026 (14 Tage bis 31.10., dann 16 Tage).
  - Versand am 31.12.2026: Frist 30.01.2027.
  - SMTP-Abweisung am 17.10.: Das PDF hat die Daten des Entwurfs schon auf 17.10./16.11. gesetzt (`statement-pdf.service.ts:270`). Brief am 20.10.: max(16.11., 19.11.) = 19.11.2026. Der Fehlversuch verschiebt die Frist also nicht nach vorn. Dieses Speichern beim Entwurf gab es schon vorher bei der PDF-Vorschau.
  - Saldo 0: Die Abrechnung wird beim Versand «Bezahlt» (`statement.service.ts:486`), und die E-Mail sagt «Sie müssen nichts bezahlen» bzw. mit Rundung «… und erhalten nichts zurück».
  - Mieterwechsel in der Periode: Die E-Mail nennt die Abrechnungsperiode (`period_start`/`period_end`, `docs/data-model.md:254`), dieselbe wie das PDF. Die Mietdauer steht im PDF.
  - Abgedeckt durch das Szenario «läuft die Zahlungsfrist 30 Tage ab dem Tag des Versands» (`statement-send.feature:30, 60`) und `statement-mail.pg.test.ts:110-131, 203-218`.
- **Der Saldosatz der E-Mail ist der des PDFs** (`balanceText`, `pdf.service.ts:545-552`), in allen vier Sprachen. Je nach Fall heisst er Nachzahlung mit Zahlteil, Rückerstattung mit IBAN-Bitte oder ausgeglichen. Damit ist V-3 aus Runde 1 inhaltlich erledigt, bis auf den Betrag (V-10).
- **Begriffe der E-Mail** gemäss `docs/design/i18n-begriffe.md:55` (Nebenkostenabrechnung / décompte des charges / conteggio spese accessorie / utility cost statement). Anrede und Gruss teilt sie mit den Mahnungen (`reminder-letter.ts`). Der Kleinbuchstabe nach «Guten Tag …,» ist im Deutschen korrekt.
- **UI-Texte de/it/en** nach Begriffsliste:
  - Zeile 22-23 (Korrespondenzkanal, Brief/E-Mail = lettera/letter).
  - Zeile 66-67 (Entwurf/Versendet, Zahlungsfrist = termine di pagamento/payment deadline).
  - Zeile 70 (Dokument), Zeile 92 (erfassen = registrare/add), Zeile 100 («Als versendet markieren»).
  - Schaltflächen beginnen mit einem Verb, Italienisch im Infinitiv («Inviare per e-mail», «Recapitare per lettera»).
  - Die französischen Guillemets haben ein geschütztes Leerzeichen (geprüft auf Byte-Ebene, U+00A0).
  - `ui_sending` folgt in jeder Sprache der Schreibweise von `ui_saving` («Envoi…» ohne, «Invio …»/«Sending …» mit Leerzeichen).
- **Fehlermeldungen** `backend_statement_*`: Sie sagen, was geschah und was zu tun ist (CLAUDE.md, Design-Regeln «Copy»), und sind einheitlich formuliert («Die E-Mail wurde nicht zugestellt.»). V-8 ist erledigt.
- **Dokument zählt nicht als Mahnung:** `+page.server.ts` filtert `type === 'reminder'`. `statement-mail.pg.test.ts:142-150` prüft, dass die erste Mahnung die Zahlungserinnerung bleibt. Gelöscht werden nur `upload`-Dokumente (`document.service.ts:125`).
- **Dokument speichert genau das gesendete PDF** (`statement-mail.pg.test.ts:130-131`, Byte-Vergleich). Das erfüllt M-1 aus Runde 1 teilweise; Adresse und Zeitpunkt siehe «Nicht bestätigt».
- **PRD «Sending (#86)»** (`docs/PRD-Dwello.md:624-628`) stimmt mit Code, API-Spezifikation und Szenarien überein.
- **`help_statements_4`** stimmt mit dem Verhalten überein. Die bisherige Aussage «Dwello verschickt die Abrechnungen nicht selbst» ist entfernt. Im Briefdialog (`statements_send_text_1`) bleibt sie und ist dort richtig.
- **Mietrecht:**
  - Für Form und Zustellweg der Abrechnung gibt es keine Vorschrift. Fedlex SR 220, Art. 257b Abs. 2 OR: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» Er regelt nur das Einsichtsrecht.
  - Die Hinweise nach Art. 8 Abs. 2 VMWG («Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen …») stehen im angehängten PDF.
  - Beide Zitate stammen aus Runde 1 (Fedlex-Filestore, OR Stand 1.10.2026, VMWG 1.10.2025). Weil sich die Rechtsgrundlage seit Runde 1 nicht geändert hat, wurden sie nicht neu abgerufen.
  - Durch die Änderung ist nichts unzulässig oder irreführend geworden.
- **Datenschutz, `privacy_third_1`:** Der Text (R-2) zählt auf, was das PDF tatsächlich enthält: Korrespondenzadresse, Wohnung und Mietdauer, Kosten und Verteilung, Saldo, IBAN und Zahlungsreferenz (`pdf.service.ts:854, 903`). Auch die Mahnungen hängen ein PDF an (`reminder.service.ts:112`), «mit dem PDF im Anhang» stimmt also für beide. fr/it/en sagen dasselbe.

## Befunde

### V-10 (Minor): E-Mail nennt den Betrag nicht

- **Beleg:** `reminder-letter.ts` `statementMail` hängt nur `balanceText` an. Der Satz lautet «Bitte bezahlen Sie den Betrag bis {date} mit dem Zahlteil.» bzw. «Wir überweisen Ihnen den Betrag bis {date}. Teilen Sie uns dafür Ihre IBAN mit …» (`pdf.service.ts:84, 88-90`). Im PDF steht der Betrag direkt darüber in der Saldo-Box (`balanceBox`), in der E-Mail fehlt er. Für die E2E-Daten (Heizkosten 4000, Akonto 12 × 150 = 1800) lautet die E-Mail: «im Anhang erhalten Sie die Nebenkostenabrechnung … für die Periode 01.01.2024 – 31.12.2024. Bitte bezahlen Sie den Betrag bis 16.11.2026 mit dem Zahlteil.» Ob es 2200 Franken sind oder eine Rückerstattung, steht nicht da.
- **Warum es falsch ist:** «den Betrag» hat in der E-Mail kein Bezugswort. In der Praxis nennt ein Begleitschreiben zur Abrechnung den Saldo mit Art und Betrag. So hatte es auch V-3 aus Runde 1 vorgeschlagen («Ihre Nachzahlung beträgt CHF {Betrag}»). Bei einer Rückerstattung weiss der Mieter ohne PDF nicht, wofür er seine IBAN schicken soll. «mit dem Zahlteil» verweist ausserdem auf etwas, das nur im Anhang liegt.
- **Lösung:** Vor dem Saldosatz eine Zeile mit der Beschriftung des PDFs (`amountDue` / `refund`, also «Nachzahlung» / «Rückerstattung» bzw. «Montant à payer», «Importo dovuto», «Amount due») und `formatCurrency(balance)` einfügen, z. B. «Nachzahlung: CHF 2'200.00». Bei Saldo 0 entfällt die Zeile. Der pg-Test prüft den Betrag mit. Optional «mit dem Zahlteil im PDF».

### V-11 (Minor): Briefdialog nach gescheiterter E-Mail zeigt den E-Mail-Kanal

- **Beleg:** `SendDialog.svelte`. `address` hängt von `byEmail` ab, also vom Kanal des Mieters, nicht vom gewählten Weg (`emails = byEmail && !byLetter`). Nach «Per Brief zustellen» (`SendFeedback.svelte`) zeigt der Dialog deshalb:
  - den Titel «Abrechnung als versendet markieren»,
  - den Text «Dwello verschickt die Abrechnung nicht selbst. Stellen Sie dem Mieter das PDF zu …»,
  - darunter «Korrespondenzkanal: Per E-Mail, keine E-Mail-Adresse erfasst» (bzw. die abgewiesene Adresse).
- **Warum es falsch ist:**
  - Der Verwalter bestätigt einen Brief und sieht dabei weder die Postadresse, an die er das PDF schicken muss, noch den Weg, den er gerade wählt.
  - Die Bestätigung nennt damit nicht die tatsächliche Folge (CLAUDE.md, Design-Regeln: «Irreversible actions confirm with their real consequence»).
  - Gerade unerfahrene Verwalter fragen sich hier, ob nun doch eine E-Mail geht.
- **Lösung:** Im Briefmodus (`!emails`) Kanal «Per Brief» und `statement.tenantAddress` (bzw. `statements_no_address`) zeigen. Optional eine Zeile «Korrespondenzkanal des Mieters: E-Mail» als Hinweis. Ein Schritt im Szenario «Nach gescheiterter E-Mail per Brief zustellen»: «nennt die Bestätigung den Korrespondenzkanal "Per Brief"».

### V-12 (Minor): E-Mail versendet, aber nichts festgehalten

- **Beleg:** `statement-send.service.ts:38-62`. Nach `send()` folgen `updateStatementStatus` und `createDocument` ohne Transaktion und ohne Fehlerbehandlung.
- **Warum es fachlich falsch ist:** Scheitert einer der beiden Schritte, hat der Mieter die Abrechnung mit Zahlungsfrist erhalten. In Dwello bleibt sie aber «Entwurf» ohne Dokument, oder «Versendet» ohne Beleg. Der Verwalter sieht nur «Abrechnung konnte nicht versendet werden.» (`statements_send_failed`) und sendet erneut, der Mieter bekommt dann zwei Abrechnungen. Der Beleg des Zugangs (M-1 aus Runde 1, Art. 8 ZGB) fehlt gerade im Streitfall.
- **Lösung:** Status und Dokument in einer Transaktion schreiben. Scheitert sie nach dem Versand, den Fehler loggen und dem Verwalter einen eigenen Code melden: «Die E-Mail wurde versendet, aber nicht gespeichert. Markieren Sie die Abrechnung als versendet.» Mindestens die Reihenfolge so wählen, dass der Status zuerst gespeichert wird. Selten, deshalb Minor.

### V-13 (Minor): «par courrier» statt «par lettre»

- **Beleg:** `messages/fr.json` in `statements_send_by_letter` («Remettre par courrier»), `backend_statement_tenant_no_email`, `backend_statement_mail_failed` und `backend_statement_mail_not_configured`. `docs/design/i18n-begriffe.md:23`: «Brief / E-Mail | lettre / e-mail». Der neue Hilfetext sagt «Pour une lettre», die übrigen Texte in fr.json verwenden «par lettre» (4 Treffer). «par courrier» kommt nur in diesen neuen Texten vor.
- **Warum es falsch ist:** Die Begriffsliste schreibt «exactly these words» vor (`i18n-begriffe.md:3`). Der Verwalter liest im selben Ablauf zwei Wörter für denselben Kanal.
- **Lösung:** «Remettre par lettre», «… ou remettez-le par lettre», «Remettez le décompte par lettre, …». it/en sind korrekt («per lettera», «by letter»).

### V-14 (Nit): «Zahlungsfrist beginnt» im Szenario

- **Beleg:**
  - `statement-send.feature:5` («die Zahlungsfrist am Tag des Versands beginnt»).
  - Z. 21 und der Schrittname in `statement-send.steps.ts:34`.
  - Glossar `UBIQUITOUS_LANGUAGE.md:181`: «Zahlungsfrist | Datum, bis zu dem die Abrechnung bezahlt sein muss.»
- **Lösung:** «… und die Zahlungsfrist ab dem Tag des Versands rechnet». So lautet bereits der Dialogtext und der Schritt Z. 30.

### V-15 (Nit): Betreff

- **Beleg:** `statementMail` erzeugt «Nebenkostenabrechnung – NK-…», `reminderLetter` dagegen «Zahlungserinnerung – Nebenkostenabrechnung NK-…» (`w.subject`).
- **Warum:** Der Mieter erkennt Jahr und Objekt nicht im Posteingang. Üblich wäre etwa «Nebenkostenabrechnung 2024, Birkenhof 1.01». Mit `w.subject(number)` und ohne Gedankenstrich wäre der Betreff wenigstens gleich aufgebaut wie bei den Mahnungen.
- **Lösung:** `subject: w.subject(input.statementNumber)`. Jahr und Objekt nur, wenn gewünscht (kein Issue nötig).

### V-16 (Nit): Höflichkeitsform im Italienischen

- **Beleg:** `reminder-letter.ts` it: `In allegato le inviamo il …`. In derselben E-Mail folgt `balanceText` mit «La preghiamo …» bzw. «Le bonifichiamo …» (`pdf.service.ts:238, 242`).
- **Lösung:** «In allegato Le inviamo il …», wie im PDF.

## Fehlende Begriffe

Keine. Die neuen Texte verwenden nur Glossarbegriffe: Nebenkostenabrechnung, Abrechnung, Korrespondenzkanal, Brief, E-Mail, Dokument, Entwurf, Versendet, Zahlungsfrist, Saldo (nur in Code und PRD), Zahlteil. «Per Brief zustellen» und «Per E-Mail senden» sind Aktionen, keine neuen Fachbegriffe.

## Nicht bestätigt

- **R-1 (Staat des Mailversand-Anbieters Resend, Art. 19 Abs. 4 DSG):** Laut Auftrag entschieden in #82 und von einer parallelen Session umgesetzt. In diesem Commit fehlt der Staat in `privacy_third_1` weiterhin. Die Frage bleibt offen, bis #82 gemergt ist.
- **R-3 aus Runde 1 («eigener SMTP-Server»):** Weder umgesetzt noch erwähnt. Es ist ein schon bestehender Befund, zu klären mit #82.
- **M-1 aus Runde 1 (Empfängeradresse und Zeitpunkt im Verlauf/Dokument):** Das Dokument speichert das PDF und `sentAt`, aber nicht die E-Mail-Adresse, an die gesendet wurde (`schema.ts:501-527` hat kein Feld dafür). Wie M-1 behandelt wurde, nennt der Auftrag nicht. Eine Folgeaufgabe wäre möglich, falls nicht schon im Folge-Issue zu V-4 bis V-6.
- **Ab wann eine E-Mail als zugegangen gilt:** Weiterhin keine Fedlex-Norm gefunden (**unsicher**, wie in Runde 1).
- **Ein nicht eingerichteter Mailversand in der UI:** Nur im pg-Test geprüft (`statement-mail.pg.test.ts:167-173`). Ob die UI den Titel «Abrechnung nicht versendet» und «Per Brief zustellen» dazu zeigt, folgt aus `UNDELIVERED` in `statement-actions.ts`. In einem Test gesehen habe ich es nicht. In `statement-actions.test.ts` und `statement-pages.dom.test.ts` habe ich nicht im Detail nachgelesen.
- **Fedlex-Zitate:** Aus Runde 1 übernommen und nicht neu abgerufen, weil sich die Rechtsfragen nicht geändert haben.
- **Tests:** Keine ausgeführt (laut Auftrag keine Backend-Tests und kein E2E).
