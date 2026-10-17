# Fachreview W6d (#94): Mindest-Saldo CHF 5, Runde 2

Gegenstand: `git diff 45eadbe 4e7bad1` (unsere Seite nach dem Merge von #341), Worktree `review-w6d-fach2` (4e7bad1). Geprüft: PDF-Texte `waivedDue`/`waivedRefund` (de/fr/it/en), `statements_summary_waived_*`, `backend_reminder_below_minimum`, die Regeln in `pdf-format.ts`, `pdf.service.ts`, `statement.service.ts`, `reminder.service.ts`, `src/lib/statement.ts`, `PaymentPanel.svelte`, Bearbeiten-Seite, Bezahlt-Dialoge, Szenario `statement-minimum-balance.feature`, Doku (PRD, data-model, Anforderungen).

**Ergebnis: kein neuer Blocker oder Major.** Die Umsetzung entspricht dem Entscheid in #94. Offen bleibt der Major M-1 aus Runde 1 (#352, Produktentscheid).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major (Runde 1, offen) | Kleine Rückerstattung einbehalten: unverändert, liegt als #352 beim Produktverantwortlichen. Die Umsetzung folgt #94 und widerspricht ihm nicht |
| V-10 | Verwalter | Minor | Vor #94 versendete Abrechnungen mit Saldo 0.05–4.95: Detailseite sagt «Sie verzichten darauf», Mahnung wird abgelehnt, «Bezahlt am» ist ausgeblendet, obwohl der Mieter einen Zahlteil erhalten hat und der Status «Versendet»/«Überfällig» bleibt |
| V-11 | Verwalter | Minor | Nach «Zahlung zurücksetzen» einer erlassenen Abrechnung: Übersicht zählt sie als überfällig (Betrag in «Offen»/«Überfällig»), nennt die Zahlungsfrist unter «Fristen» und schlägt «sonst können Sie eine Mahnung senden» vor; gehört zu #291 |
| V-12 | Verwalter | Nit | fr `backend_reminder_below_minimum` «ni rappelé» passt nicht zum bestehenden «ne fait pas l’objet d’un rappel» |

## Bestätigt

- **Regel und Formel** (`pdf-format.ts:23`, `src/lib/statement.ts:38`): `Math.abs(balance) < 5` auf dem gespeicherten, schon gerundeten Saldo. Nachgerechnet mit der Rundung zugunsten des Mieters (`roundTo5Rappen`, #341, Akonto 1'200.00):
  - 1'203.00 → 3.00 → erlassen (Nachzahlung); 1'197.00 → −3.00 → erlassen (Rückerstattung).
  - 1'204.98 → 4.98 → abgerundet 4.95 → erlassen; 1'205.02 → 5.02 → 5.00 → eingefordert; 1'195.02 → −4.98 → `floor(−99.6)/20` = −5.00 → ausbezahlt; 1'204.95 / 1'195.05 → ±4.95 → erlassen; 1'205 / 1'195 → ±5.00 → offen. Deckt sich mit den Beispielen Z. 77–84 (V-6 erledigt).
  - Randfall 0: 1'200.03 → 0.03 → 0.00 → «Nach der Rundung auf 5 Rappen …» (Zweig `balance === 0` in `settledText` zuerst, `pdf.service.ts:553`). 1'199.97 → −0.03 → aufgerundet −0.05 → erlassene Rückerstattung «Wir zahlen ihn nicht aus.» (fällt unter M-1/#352).
  - Mieterwechsel: jede Abrechnung hat ihren Saldo, Schwelle je Abrechnung; kein Sonderfall im Code.
- **V-1 erledigt:** `balanceText` prüft `belowMinimum` vor `paidDate` (`pdf.service.ts:561–562`); das PDF nach dem Versand sagt nicht «Bezahlt am»/«Überwiesen am» (Szenario Z. 28, 42). Kein Zahlteil, keine Zahlungsinfo: `owed()` (`pdf.service.ts:940`) an beiden Stellen.
- **V-2 erledigt:** `REMINDER_BELOW_MINIMUM` (`reminder.service.ts:63–64`) nach der Prüfung auf Rückerstattung; Oberfläche `owes={claimed(...)}`; Szenario Z. 59–67 und `reminders.pg.test.ts`. Restfolgen des Zurücksetzens: V-11.
- **paidAmount 0.00** beim Versand (`statement.service.ts:487`), passt zu `dashboard.ts:130–133` (`paidThisMonth` zählt keinen erlassenen Betrag); Doku `data-model.md:272` nachgeführt.
- **Texte, Mietrecht:** Nachzahlung «Wir verzichten darauf; Sie müssen nichts bezahlen.» ist ein klarer Erlass (M-2 erledigt). Art. 115 OR: «Eine Forderung kann durch Übereinkunft ganz oder zum Teil auch dann formlos aufgehoben werden, wenn zur Eingehung der Verbindlichkeit eine Form erforderlich oder von den Vertragschliessenden gewählt war.» (Wortlaut aus Runde 1, Fedlex OR Stand 1.10.2026.) Die Vorlegepflicht bleibt erfüllt (Art. 4 Abs. 1 VMWG, Runde 1).
- **Übersetzungen** (V-8 erledigt): fr «Nous y renonçons ; vous n’avez rien à payer.» / «Nous ne vous le virons pas.», it «Vi rinunciamo; non deve pagare nulla.» / «Non glielo bonifichiamo.», en «We waive it; you do not need to pay anything.» / «We will not pay it out.»; Detailseite fr «Vous y renoncez.» / «Vous ne le virez pas.», it «Lei vi rinuncia.» / «Lei non lo bonifica.», en «You waive it.» / «You do not pay it out.»; Mahnung-Ablehnung de/it/en: sinngleich und mit den bestehenden Verben (virer, bonificare, sollecito, reminder). Ausnahme V-12.
- **Detailseite** (V-4, V-9 erledigt): ohne Zahlungsfrist und «Bezahlt am» unter CHF 5; Saldo 0 zeigt weiter «Es ist nichts zu bezahlen.»; Rückerstattungstext im Szenariogrundriss Z. 56.
- **Bearbeiten-Seite** ohne Fristfeld unter CHF 5 (Persona Marco P-1, Dr. Weber P-3): richtig, es gibt keine Frist für einen erlassenen Betrag. Ohne Feld schickt der BFF keine `paymentDeadline` (`edit/+page.server.ts:20–28`); die gespeicherte Frist bleibt unverändert (wirkt nur nach dem Zurücksetzen, V-11).
- **Bezahlt-Dialoge:** «Danach können Sie keine Mahnung mehr senden» nur bei `claimed` (Liste und Detail): richtig, unter CHF 5 gibt es ohnehin keine Mahnung.
- **Doku:** `nebenkostenabrechnung-anforderungen.md:45`, `:93`, `:151` und PRD stimmen mit Code und #94 überein (inkl. Verweis auf #352).
- **PDF-Darstellung** (Dr. Weber P-5): Der Satz zum Erlass steht im selben Ergebniskasten direkt unter «Nachzahlung CHF 3.40» (`balanceBox`, `pdf.service.ts:580–600`), wie beim Saldo 0. Fachlich in Ordnung; eine Kennzeichnung in der Kopfzeile wäre Gestaltung, kein Fachbefund.

## Befunde

### M-1 (Mietrecht, Major, aus Runde 1): unverändert offen

- **Beleg:** `pdf.service.ts:94` «Der Betrag ist kleiner als CHF 5.00. Wir zahlen ihn nicht aus.», `messages/de.json` `statements_summary_waived_refund`. Begründung und Fedlex-Wortlaute (Art. 257b Abs. 1, 115, 6 OR) siehe `docs/reviews/w6d-fachreview-1.md`, M-1; Persona Dr. Weber P-2 kommt zum selben Schluss.
- **Stand:** #352 offen. Die Umsetzung entspricht dem Entscheid in #94; der Befund stellt den Entscheid selbst in Frage → «Blocked on me», kein Merge-Hindernis aus der Umsetzung. Je nach Entscheid auch Dr. Weber P-6 («Sie müssen nichts tun.») mitnehmen.

### V-10 (Verwalter, Minor): Vor #94 versendete Kleinsaldo-Abrechnungen

- **Beleg:** Keine Migration setzt bestehende Abrechnungen um (`backend/migrations/0016_*` betrifft nur Entwürfe und die Rundung). Die Oberfläche entscheidet allein am Saldo: `PaymentPanel.svelte:14–31` (`waived` → «Sie verzichten darauf», ohne Zahlungsfrist, ohne «Bezahlt am»), `+page.svelte:135` (`owes={claimed(...)}`), `reminder.service.ts:64` lehnt ab. Ein neu erstelltes PDF dieser Abrechnung sagt ebenfalls «Wir verzichten darauf» (`balanceText` ohne Statusprüfung).
- **Warum:** Der Mieter hat vor #94 eine Abrechnung mit Zahlteil über z. B. CHF 3.00 erhalten. Jetzt zeigt Dwello dem Vermieter «Sie verzichten darauf», lässt die Abrechnung aber «Überfällig» stehen (Übersicht zählt sie) und blendet ein erfasstes «Bezahlt am» aus, obwohl Geld eingegangen ist. Ein neu erstelltes PDF widerspricht dem zugestellten. Wenige Fälle, aber widersprüchlich.
- **Was es löst** (eine Variante): (a) die Regel nur auf Abrechnungen anwenden, die mit dem Versand erledigt wurden (z. B. Oberfläche und Mahnung an `status === 'paid' && paidAmount === '0.00'` bzw. Versanddatum nach dem Deployment), oder (b) eine Migration, die versendete, unbezahlte Abrechnungen mit `abs(balance) < 5` unverändert lässt und nur dokumentiert, dass sie wie vor #94 behandelt werden, oder (c) bewusst hinnehmen und in `nebenkostenabrechnung-anforderungen.md` Pkt. 11 festhalten («Vor #94 versendete Abrechnungen …»), wie bei #79 für die Rundung. Mindestens: «Bezahlt am» nur ausblenden, wenn `paidAmount` 0.00 ist.

### V-11 (Verwalter, Minor): Folgen des Zurücksetzens ausserhalb der Detailseite

- **Beleg:** `resetPayment` (`statement.service.ts:512–527`) setzt auf `sent`, nach der Frist `overdue`. Dann: `dashboard.ts:111,127–128` summiert `balance > 0` in «Offen»/«Überfällig» ohne Mindestbetrag; `src/lib/overview.ts:123–133` zählt sie in die Aufgabe «Überfällige Abrechnungen prüfen» mit dem Text «… sonst können Sie eine Mahnung senden» (`messages/de.json:242`); die Fristen-Liste nennt die Zahlungsfrist (Persona Dr. Weber P-4). Szenario Z. 66 hält «Überfällig» sogar fest. Der Dialog «Als bezahlt markieren» fragt dann nach dem Geldeingang und speichert den Saldo als bezahlten Betrag (#291, V-5).
- **Warum:** #94 «settled on sending and cannot be gemahnt»: die Mahnung ist gesperrt, aber die Übersicht schickt den Vermieter zu einer Mahnung, die es nicht gibt, und führt einen erlassenen Betrag als ausstehend. Nur nach einer bewussten Handlung des Vermieters, daher Minor.
- **Was es löst:** in #291 nachtragen (Kommentar existiert, nennt aber nur Zurücksetzen und Bezahlt-Betrag): Übersicht-Summen und -Aufgabe sowie Fristen-Liste nennen die Abrechnung nicht, oder einfacher «Zahlung zurücksetzen» bei Saldo 0 und unter CHF 5 nicht anbieten (Persona Marco P-3, Dr. Weber P-4).

### V-12 (Verwalter, Nit): fr Mahnung-Ablehnung

- **Beleg:** `messages/fr.json` `backend_reminder_below_minimum` «Il n’est ni réclamé ni rappelé.»; bestehend `backend_reminder_refund` «Un remboursement ne fait pas l’objet d’un rappel».
- **Vorschlag:** «Le montant est inférieur à CHF 5.00. Il n’est pas réclamé et ne fait pas l’objet d’un rappel.»

## Fehlende Begriffe

- «Mindestbetrag» sowie die Nachführung von Saldo, Bezahlt, Zahlungsdatum: bereits #353 (Vorschlag Runde 1, V-5). Dazu aus den Personas (Dr. Weber P-1, Marco P-2) der Hinweis zum Status «Bezahlt» einer erlassenen Abrechnung: Vorschlag für #353, Glossar **Bezahlt**: «… bei Saldo 0.00 oder unter dem Mindestbetrag mit dem Versand (erlassen, bezahlter Betrag 0.00).» und Versandmeldung de «Abrechnung als versendet markiert. Der Betrag ist kleiner als CHF 5.00: Die Abrechnung ist damit erledigt.» (deckt auch V-7).

## Nicht bestätigt

- Ob produktiv schon versendete Abrechnungen mit Saldo unter CHF 5 bestehen (V-10): keine Datenbank geprüft; nur Migrationen und Code gelesen.
- Neue Fedlex-Abrufe in dieser Runde nicht gemacht: es gibt keine neue Rechtsaussage; die Wortlaute (Art. 6, 115, 257b OR; Art. 4 VMWG) stammen aus Runde 1 (`docs/reviews/w6d-fachreview-1.md`, «Nicht bestätigt»). M-1-Würdigung zu Art. 6 OR bleibt **unsicher**.
- Szenarien und Tests nicht ausgeführt (Review am Diff); `api`-Verhalten des Backend-PUT ohne `paymentDeadline` nur aus dem BFF-Code gelesen, nicht im Backend-Validator geprüft.
- `docs/design/i18n-begriffe.md` nicht gegen jedes neue Wort geprüft; Übersetzungen nur am Bestand der Nachbarschlüssel gemessen.
