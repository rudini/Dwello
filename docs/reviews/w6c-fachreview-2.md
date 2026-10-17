# Fach-Review W6c (#108 Zahlteil auf Mahnungen, #59 Hinweis Art. 257d OR), Runde 2

Gegenstand: `git diff 7e2fb82 7ac04a3` im Worktree `review-w6c-fach2` (Commit 7ac04a3): `reminder.service.ts`, `reminder-pdf.ts`, `pdf.service.ts` (`addPaymentPart`), `statement-pdf.service.ts` (`qrBillConfig` exportiert), `messages/*.json` (`statements_reminder_257d`), `help/+page.svelte`, `ReminderModal.svelte`, Tests und Szenarien.
Zusätzlich gerendert (Skript im Scratchpad `fr2/render.ts`, ruft `reminderLetter` + `renderReminderPdf` mit Zahlteil auf): Zahlungserinnerung de/en, 2. Mahnung it, 3. Mahnung de/fr/it, mit kurzer und langer Adresse.

Gesetzestexte: Fedlex wie in Runde 1 (OR SR 220, Stand 1.10.2026; SchKG SR 281.1); der Inhalt des Hinweises ist gegenüber dem Vorschlag aus Runde 1 unverändert, die Zitate dort gelten weiter.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-6 | Verwalter | Minor | Der Zahlteil steht immer allein auf Seite 2, auch bei der kürzesten Zahlungserinnerung; der Brief verweist nicht darauf (verstärkt V-2) |
| V-7 | Verwalter | Minor (vorbestehend) | Ohne IBAN entsteht eine Mahnung «auf folgendes Konto: IBAN» ohne Konto; die Abrechnung wird in diesem Fall abgelehnt |
| V-8 | Verwalter | Minor (vorbestehend) | Ohne Firmenname/Adresse nennt der Zahlteil «Dwello Property Management, 8000 Zürich» als Zahlungsempfänger; jetzt auch auf jeder Mahnung |
| V-9 | Verwalter | Minor | Test: `'120.00'` steht schon im Brieftext, belegt den Zahlteil nicht; Inhalt des QR-Codes einer Mahnung ungeprüft |
| M-4 | Mietrecht | Nit | en: «time limit for payment» und «payment deadline» im selben Hinweis für denselben Begriff |
| V-10 | Verwalter | Nit | Hilfe: der Hinweis ist Schritt 5 einer nummerierten Anleitung; Szenariotitel nutzt noch die alte Formulierung |
| V-11 | Verwalter | Nit (vorbestehend) | en: Mitteilung im Zahlteil «Utility Cost Statement …», Brief «Utility cost statement …» |

Stand der Befunde aus Runde 1: V-1 erledigt (Übergangslösung, Entscheid in #322 offen), M-1 erledigt, V-3 erledigt, V-4 erledigt; M-2, V-2, V-5 bleiben offen als Minor/Nit (Begründung des Aufrufers nachvollziehbar); M-3 siehe unten.

---

## V-6 (Minor): Zahlteil immer auf einer eigenen Seite

**Beleg.** `pdf.service.ts` (`addPaymentPart`): `if (doc.y > PAGE.height - PAYMENT_PART - 24) doc.addPage();` — der Zahlteil beginnt bei 842 − 297.6 = 544 pt, umgebrochen wird ab doc.y > 520 pt. JSDoc: «at the foot of the letter's page … a new page when the letter reaches into it». Gerendert: Zahlungserinnerung de, Empfänger «Anna Keller, Seestrasse 5, 1003 Lausanne», Absender «Hans Muster» → `pdfinfo`: 2 Seiten; die Grussformel endet auf Seite 1 bei rund 530 pt (Bild `fr2/sde1-1.png`), Seite 2 enthält nur «Vor der Einzahlung abzutrennen» und den Zahlteil (`fr2/en1-2.png`). Ebenso 2 Seiten für alle anderen gerenderten Fälle. Der Brieftext beginnt bei y = 290 pt (`reminder-pdf.ts`), mit Absätzen, `moveDown(2)` und zweizeiliger Grussformel reicht schon der kürzeste Brief über 520 pt.

**Warum.** Ein Zahlteil auf einer eigenen Seite ist zulässig, aber: (1) Der Code will ihn auf derselben Seite und tut es nie; (2) der Brief sagt «Bitte überweisen Sie den Betrag … auf folgendes Konto:» und nennt die zweite Seite nicht. Druckt der Verwalter nur Seite 1 (z.B. weil die Abrechnung einseitig ausgedruckt wurde) oder übersieht der Mieter das zweite Blatt, ist der Zahlteil aus #108 wirkungslos. In der Praxis steht der Einzahlungsschein bei einer einseitigen Mahnung unten auf derselben Seite.

**Behebung.** Entweder den Brief kompakter setzen (Text höher beginnen, z.B. Datum/Betreff näher an die Adresse, kleinere Abstände), damit Zahlungserinnerung bis 3. Mahnung mit normaler Adresse auf Seite 1 passen, mit Test auf die Seitenzahl; oder den Kommentar korrigieren und V-2 umsetzen, mit Verweis auf die Seite, z.B. de «Bitte bezahlen Sie den Betrag bis {date} mit dem Zahlteil auf der nächsten Seite oder überweisen Sie ihn auf folgendes Konto:» (fr «… avec la section paiement à la page suivante ou le virer sur le compte suivant :», it «… con la sezione pagamento alla pagina seguente o di versarlo sul seguente conto:», en «… using the payment part on the next page or transfer it to the following account:»). Die Layoutfrage prüft der daten-pruefer am echten PDF.

## V-7 (Minor, vorbestehend): Mahnung ohne Konto

**Beleg.** `reminder-letter.ts` druckt immer `${w.payBy(...)}\nIBAN ${input.sender.iban}`; `sender()` liefert `''` ohne IBAN (`config.service.ts` Vorgabe `''`). `src/lib/server/settings.ts:41-42` erlaubt eine leere IBAN. Die Abrechnung lehnt dann ab (`statement-pdf.service.ts:304-305`, `IBAN_MISSING`). Der neue Test «druckt ohne IBAN keinen Zahlteil» (`reminders.pg.test.ts`) prüft nur, dass kein Zahlteil kommt, und legt damit einen Brief «auf folgendes Konto: IBAN» ohne Kontonummer fest.

**Warum.** Eine Zahlungsaufforderung ohne Zahlungsweg ist für den Mieter nicht erfüllbar und wirkt unprofessionell. Der Fall entsteht, wenn der Verwalter die IBAN nach dem Versand der Abrechnung löscht. Vorbestehend; die Änderung macht ihn durch den Test aber zum gewollten Verhalten.

**Behebung.** `nextLevel`/`sendReminder` lehnt ohne IBAN ab wie die Abrechnung (Code `IBAN_MISSING` wie bei der Abrechnung; eine Meldung `backend_IBAN_MISSING` gibt es in `messages/*.json` noch nicht, sie kommt neu in alle vier Sprachen), Test anpassen. Sonst Issue (`fachlich`).

## V-8 (Minor, vorbestehend): erfundener Zahlungsempfänger

**Beleg.** `statement-pdf.service.ts:26-30`: `companyName: companyName || 'Dwello Property Management'`, `postalCode: … || '8000'`, `city: … || 'Zürich'`. Firmenname, Adresse, PLZ und Ort sind in den Einstellungen freiwillig (`config.service.ts:48-66`, Vorgabe `''`). `reminder.service.ts` nutzt jetzt dieselbe `qrBillConfig()`. Im Brief steht als Absender und Grussformel der leere Name, im Zahlteil derselben Mahnung «Dwello Property Management, 8000 Zürich».

**Warum.** Der Zahlungsempfänger ist Pflichtangabe der QR-Rechnung und wird dem Mieter in seiner Banking-App angezeigt; ein fremder Name bei einer Mahnung weckt Misstrauen (Phishing-Verdacht), und Banken mit Namensabgleich können warnen. Vorbestehend bei der Abrechnung; mit #108 steht der Widerspruch jetzt auch auf derselben Seite wie der leere Absender.

**Behebung.** Ohne Name, Adresse, PLZ und Ort keinen Zahlteil bzw. ablehnen wie bei fehlender IBAN; nie einen Platzhalter-Empfänger drucken. Eher ausserhalb von W6c: Issue (`fachlich`), Bezug zu #78 (SIX IG 2.4, Pflichtfelder).

## V-9 (Minor): Test belegt den Betrag im Zahlteil nicht

**Beleg.** `reminders.pg.test.ts`, «druckt den Zahlteil mit dem offenen Saldo …»: `expect(text).toContain('120.00')` — der Brief enthält schon «Offener Betrag: CHF 120.00» (`reminder-letter.ts`, `chf`). Referenz (3×) und Beschriftungen sind gut belegt. Der Inhalt des QR-Codes (Betrag, `QRR`/`NON`, Mitteilung in der Sprache des Mieters) wird für die Mahnung nirgends geprüft; das E2E-Szenario prüft immerhin «Währung Betrag CHF 2 320.00» (nur im Zahlteil so formatiert).

**Behebung.** Im pg-Test einen Betrag ≥ 1000 verwenden und auf die Zahlteil-Schreibweise prüfen (z.B. «1 171.25»), und die Mitteilung prüfen, z.B. fr «Décompte des charges <Nr>». Fachlich bestätigt habe ich den Inhalt durch Rendern (siehe «Bestätigt»).

## M-4 (Nit): en, zwei Ausdrücke für die Zahlungsfrist

**Beleg.** `messages/en.json` `statements_reminder_257d`: «It does not set a time limit for payment with a warning of termination …» und «you first set the tenant a payment deadline of at least 30 days». `docs/design/i18n-begriffe.md:66`: Zahlungsfrist = «payment deadline». (Stammt aus meinem eigenen Vorschlag in Runde 1.)

**Behebung.** «It does not set a payment deadline with a warning of termination under Art. 257d CO.» de/fr/it sind einheitlich («Zahlungsfrist», «délai de paiement», «termine di pagamento»).

## V-10 (Nit): Hinweis als Schritt 5

**Beleg.** `src/routes/help/+page.svelte:58` `<ol class="… list-decimal …">`; der Hinweis ist das fünfte `<li>` nach vier Handlungsschritten. Szenariotitel `help.feature`: «Die Hilfe grenzt die Mahnung von der Mahnung nach Art. 257d OR ab» (die in M-1 abgelöste Formulierung).

**Behebung.** Optional als eigener Absatz unter der Liste; Titel z.B. «Die Hilfe grenzt die Mahnung von der Kündigungsandrohung nach Art. 257d OR ab».

## V-11 (Nit, vorbestehend): Gross-/Kleinschreibung en

`pdf.service.ts:267` `title: 'Utility Cost Statement'` → Mitteilung «Utility Cost Statement NK-…»; Brief `reminder-letter.ts` «Utility cost statement NK-…». Auf derselben Mahnung sichtbar. Vereinheitlichen, sobald die Abrechnung ohnehin angefasst wird.

## M-3 aus Runde 1

Akzeptiert: «Betreibung» und die Kündigung wegen Zahlungsrückstand stehen im Entscheid von #59 selbst (CLAUDE.md: ein im geschlossenen Issue entschiedener Begriff braucht keinen Marker). Ein Glossareintrag bleibt empfehlenswert (Vorschläge aus Runde 1), kein Befund mehr.

---

## Bestätigt (mit Quelle)

- **Hinweistext (#59)** in allen vier Sprachen wörtlich wie der Vorschlag aus Runde 1 (ausser M-4). Inhalt deckt den Entscheid von #59 (Zahlungsaufforderung; Betreibung oder Kündigung nach Art. 257d OR ausserhalb von Dwello; eigene schriftliche Frist ≥ 30 Tage mit Kündigungsandrohung; «Lassen Sie sich beraten.»). Fedlex Art. 257d Abs. 1 OR: «… so kann ihm der Vermieter schriftlich eine Zahlungsfrist setzen und ihm androhen, dass bei unbenütztem Ablauf der Frist das Mietverhältnis gekündigt werde. Diese Frist beträgt mindestens zehn Tage, bei Wohn- und Geschäftsräumen mindestens 30 Tage.» Art. 266n OR: «… Ansetzung einer Zahlungsfrist mit Kündigungsandrohung (Art. 257d) …». «in einem eigenen Brief» ist Praxisempfehlung, nicht Gesetzeswortlaut, aber korrekt, weil die Briefe von Dwello keine Androhung enthalten (`reminder-letter.ts`, 3. Mahnung «weitere Schritte»). Ort: Hilfe «Zahlungen und Mahnungen» und Dialog nach der 3. Mahnung, wie entschieden; der TODO-Marker #59 ist entfernt.
- **Dialog nach der 3. Mahnung:** «Klären Sie das weitere Vorgehen direkt mit dem Mieter.» und danach der Hinweis widersprechen sich nicht.
- **Betrag:** Zahlteil und QR-Code nehmen `statement.balance` (`reminder.service.ts`, `addPaymentPart` → `qrAmount(Number(balance))`; QR `formatAmount` = `toFixed(2)`), dieselbe gespeicherte Zahl wie Abrechnung (`statement-pdf.service.ts:134`) und Brief. Nachgerechnet: 2320 → «2 320.00», 1171.25 → «1 171.25», 12345.6 → «12 345.60», 0.05 → «0.05» (Leerzeichen als Tausendertrenner nach SIX, siehe Runde 1). Saldo 0 oder Rückerstattung: keine Mahnung (`nextLevel`, `REMINDER_REFUND`), also kein Zahlteil. Teilzahlungen gibt es nicht.
- **Referenz:** `statementQRReference(statement.id)`, nur mit QR-IBAN (`qr-bill.service.ts:332-334, 361`), identisch mit Abrechnung und Brieftext; mit normaler IBAN `NON` ohne Referenz, Zuordnung über die Mitteilung. Test zählt 3 Vorkommen (Brief, Empfangsschein, Zahlteil).
- **Mitteilung und Sprache:** `t.title` in der Sprache des Mieters (Fallback de). Gerendert: de «Nebenkostenabrechnung NK-2024-0012», fr «Décompte des charges …», it «Conteggio spese accessorie …», en «Utility Cost Statement …»; Beschriftungen «Zahlteil/Section paiement/Sezione pagamento/Payment part», «Zahlbar durch/Payable par/Pagabile da/Payable by», Abtrennhinweis vorhanden.
- **Bezahlt:** `statement.status === 'paid'` → kein Zahlteil (Test vorhanden). Wird «bezahlt» zurückgenommen (`statement.service.ts:513-519`, Status wieder `sent`), bekommt ein danach neu erstellter Brief wieder einen Zahlteil — richtig. Die übrigen Status (`draft`) erreichen `reminderOn` nicht. Ob der Brief zu einer bezahlten Abrechnung überhaupt noch entstehen darf: #322.
- **Ohne IBAN:** kein Zahlteil (zum Brieftext siehe V-7).
- **E-Mail:** der Zahlteil kommt im PDF-Anhang (`deliverByEmail` hängt `pdf` an), wie in #108 entschieden.
- **Szenario #108:** «Zahlbar durch» kommt im Brieftext in keiner Sprache vor (`reminder-letter.ts`), belegt also den Zahlteil (V-3 erledigt). Betrag 2320.00 wie in Runde 1 nachgerechnet.

## Nicht bestätigt

- **SIX IG 2.4 / Style Guide als Primärquelle:** weiter nicht abrufbar (Runde 1); ob ein Zahlteil allein auf Seite 2 ohne Verweis im Brief den Empfehlungen entspricht, **unsicher** (nach meinem Kenntnisstand zulässig).
- **QR-Code selbst gescannt:** nicht decodiert (kein Decoder im Worktree genutzt); der Inhalt folgt aus `qrData`, dessen gedruckte Werte ich im Rendering gesehen habe. Der Abgleich Bild ↔ Druck ist Sache des daten-pruefers.
- **Seitenumbruch mit realen Daten** (Absender aus den Einstellungen, Adresse aus der Datenbank): nur mit eigenen Beispieldaten gerendert, nicht über den Server.
- **#322:** Entscheid offen; die Übergangslösung (Brief ohne Zahlteil, Text sagt weiter «Offener Betrag») habe ich nur auf den Zahlteil hin geprüft.
- **Englische Fedlex-Fassung** nicht amtlich (Runde 1).
