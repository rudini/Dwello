# Fach-Review W6c (#108 Zahlteil auf Mahnungen, #59 Hinweis Art. 257d OR), Runde 1

Gegenstand: Commit 7e2fb82 (Worktree `review-w6c-fach`), @wip-Szenarien `tests/e2e/features/statement-reminder.feature:69-81` und `tests/e2e/features/help.feature:26-30`, Entwurf `w6c-proposal.md`, bestehender Code (`reminder-letter.ts`, `reminder-pdf.ts`, `reminder.service.ts`, `pdf.service.ts`, `qr-bill.service.ts`, `ReminderModal.svelte`, `messages/*.json`).

Gesetzestexte: Fedlex, konsolidierte Fassungen, gelesen über fedlex.data.admin.ch (Filestore-HTML): OR SR 220 Stand 1.10.2026 (de/fr/it), en Stand 1.1.2026; SchKG SR 281.1 Stand 1.1.2026.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Ein Brief, der nach «Als bezahlt markieren» noch als versendet markiert wird, bekäme einen Zahlteil für eine bezahlte Abrechnung (Doppelzahlung) |
| M-1 | Mietrecht | Minor | «die Mahnung nach Art. 257d OR»: das Gesetz kennt diesen Begriff nicht, und im Glossar ist «Mahnung» die Mahnung von Dwello; die Wortwahl von Art. 266n OR ist klarer (alle vier Sprachen) |
| M-2 | Mietrecht | Minor | Der Hinweis nennt das amtliche Formular (Art. 266l Abs. 2 OR) und die getrennte Zustellung bei einer Familienwohnung (Art. 266n OR) nicht, beides macht die Kündigung sonst nichtig (Art. 266o OR); geht über den Entscheid hinaus |
| M-3 | Mietrecht | Minor | «Betreibung» und «Zahlungsfrist mit Kündigungsandrohung» stehen nicht im Glossar |
| V-2 | Verwalter | Minor | Der Brieftext verweist nicht auf den Zahlteil («überweisen Sie … auf folgendes Konto»); die Abrechnung sagt «mit dem Zahlteil» |
| V-3 | Verwalter | Minor | Szenario: «steht im PDF "CH93 0076 2011 6238 5295 7"» wäre auch ohne Zahlteil erfüllt (der Brieftext enthält die IBAN schon so); die Zusätzlichen Informationen werden nirgends geprüft |
| V-4 | Verwalter | Nit | de «z.B.»: in `messages/de.json` steht 7× «z. B.» und 2× «z.B.» |
| V-5 | Verwalter | Nit | Betrag im Brief «CHF 2320.00» (ohne Tausendertrennzeichen), im Zahlteil «2 320.00», in der Abrechnung «CHF 2'320.00» (schon vorher so) |

---

## V-1 (Major): Zahlteil auf einem nachträglich versendeten Brief zu einer bezahlten Abrechnung

**Beleg.** `backend/src/services/reminder.service.ts:147-155`: `markDocumentPosted` erstellt eine Mahnung mit Status `to_send` mit `reminderOn(statement, …)` neu, prüft den Status der Abrechnung aber nicht (weder `paid` noch, später, `replaced` #120). Auch `statement.service.ts` macht beim Statuswechsel auf `paid` nichts mit offenen Briefen (`grep to_send backend/src/services` findet nur reminder.service.ts). Im Entwurf, #108: «The payment part is drawn again when «Als versendet markieren» remakes the letter (#193), with the same amount and reference.» Der Fall «inzwischen bezahlt» fehlt.
Bei der Abrechnung schliesst Dwello genau diesen Fall aus: `pdf.service.ts:423` «paid: no payment part, or the tenant pays twice», `qrCodeFor` `pdf.service.ts:905-906`; Glossar «Saldo»: «Saldo 0.00: keine Zahlung, kein Zahlteil».

**Warum falsch.** Typischer Ablauf: Der Verwalter löst eine Mahnung per Brief aus, der Mieter zahlt, und der Verwalter markiert die Abrechnung als bezahlt. Ein paar Tage später markiert er den Brief unter «Dokumente» als versendet und druckt ihn aus (so verlangt es `help_payments_4`). Der Mieter erhält eine Mahnung mit scanbarem Zahlteil für einen Betrag, den er schon bezahlt hat. Bisher stand das nur im Brieftext; mit dem QR-Code ist die zweite Zahlung ein Scan. Der Satz «Haben Sie die Zahlung bereits geleistet …» schützt nicht davor, und der Vermieter muss den Betrag zurückzahlen. Der Fehler bestand schon vorher, die Änderung macht ihn aber deutlich sichtbarer (CLAUDE.md, «Done means»).

**Behebung.** `markDocumentPosted` lehnt bei einer Mahnung ab, wenn die Abrechnung nicht mehr `overdue` ist (bezahlt, später ersetzt). Vorschlag: eigener Code, z.B. `REMINDER_STATEMENT_PAID`, mit einer Meldung in allen vier Sprachen:
- de: «Die Abrechnung ist bereits bezahlt. Schicken Sie diese Mahnung nicht mehr ab.»
- fr: «Le décompte est déjà payé. N’envoyez plus ce rappel.»
- it: «Il conteggio è già stato pagato. Non spedisca più questo sollecito.»
- en: «The statement has already been paid. Do not send this reminder any more.»

Eine Alternative wäre, den Brief ohne Zahlteil neu zu erstellen. Das hiesse aber, eine Mahnung für eine bezahlte Forderung zu verschicken, und ist in der Praxis falsch. Ob abgelehnt wird oder der Brief verworfen, entscheidet der Product Owner. Falls das nicht in W6c passt: Issue mit Labels `fachlich`, `entscheiden`. Test zuerst auf der pg-Ebene: Mahnung als Brief, Abrechnung bezahlt, als versendet markieren, Ablehnung.

## M-1 (Minor): «die Mahnung nach Art. 257d OR»

**Beleg.** Entwurf, de: «Eine Mahnung von Dwello ist eine Zahlungsaufforderung, nicht die Mahnung nach Art. 257d OR. … Diese Kündigung verlangt zuerst eine eigene schriftliche Mahnung mit einer Zahlungsfrist …». Gleicher Text im Szenario, `help.feature:29`.
Fedlex, Art. 257d Abs. 1 OR: «Ist der Mieter nach der Übernahme der Sache mit der Zahlung fälliger Mietzinse oder Nebenkosten im Rückstand, so kann ihm der Vermieter schriftlich eine Zahlungsfrist setzen und ihm androhen, dass bei unbenütztem Ablauf der Frist das Mietverhältnis gekündigt werde. Diese Frist beträgt mindestens zehn Tage, bei Wohn- und Geschäftsräumen mindestens 30 Tage.»
Fedlex, Art. 266n OR: «Die Kündigung durch den Vermieter sowie die Ansetzung einer Zahlungsfrist mit Kündigungsandrohung (Art. 257d) sind dem Mieter und seinem Ehegatten, seiner eingetragenen Partnerin oder seinem eingetragenen Partner separat zuzustellen.»
Glossar, `UBIQUITOUS_LANGUAGE.md:182`: «**Mahnung** | Vom Liegenschaftsverwalter ausgelöste Zahlungsaufforderung zu einer versendeten Abrechnung.»

**Warum falsch.** Inhaltlich stimmt der Satz. In der Praxis sagt man auch «Mahnung mit Kündigungsandrohung». Der Text verwendet «Mahnung» aber im selben Satz für zwei Dinge: für die Mahnung von Dwello (Glossar) und für ein Rechtsgeschäft, das erst mit Kündigungsandrohung und 30 Tagen Frist entsteht. Ein unerfahrener Vermieter kann daraus lesen: «eine Mahnung mehr, dann darf ich kündigen». Genau dieses Missverständnis soll #59 verhindern. Das Gesetz selbst sagt «Ansetzung einer Zahlungsfrist mit Kündigungsandrohung» (Art. 266n OR). Ähnlich im Englischen: Nach `docs/design/i18n-begriffe.md:29` heisst Kündigung «notice of termination». «not the notice under Art. 257d CO» kann man deshalb als «nicht die Kündigung» lesen.

**Vorschlag** (Inhalt nach dem Entscheid #59 vollständig, Begriffe nach Art. 266n OR in der jeweiligen Amtssprache):
- de: «Eine Mahnung von Dwello ist eine Zahlungsaufforderung. Sie ist keine Zahlungsfrist mit Kündigungsandrohung nach Art. 257d OR. Weitere Schritte, z. B. eine Betreibung oder eine Kündigung wegen Zahlungsrückstand nach Art. 257d OR, liegen ausserhalb von Dwello. Für diese Kündigung setzen Sie dem Mieter zuerst in einem eigenen Brief eine Zahlungsfrist von mindestens 30 Tagen und drohen ihm die Kündigung an. Lassen Sie sich beraten.»
- fr: «Un rappel de Dwello est une demande de paiement. Il ne fixe pas de délai de paiement assorti d’une menace de résiliation selon l’art. 257d CO. Les démarches suivantes, p. ex. une poursuite ou une résiliation pour demeure du locataire selon l’art. 257d CO, se font en dehors de Dwello. Pour cette résiliation, vous fixez d’abord au locataire, par une lettre distincte, un délai de paiement d’au moins 30 jours assorti d’une menace de résiliation. Faites-vous conseiller.»
- it: «Un sollecito di Dwello è una richiesta di pagamento. Non impone un termine di pagamento con comminatoria di disdetta secondo l’art. 257d CO. I passi successivi, p. es. un’esecuzione o una disdetta per mora del conduttore secondo l’art. 257d CO, avvengono al di fuori di Dwello. Per questa disdetta, imponga prima all’inquilino, con una lettera separata, un termine di pagamento di almeno 30 giorni con comminatoria di disdetta. Si faccia consigliare.»
- en: «A reminder from Dwello is a request for payment. It does not set a time limit for payment with a warning of termination under Art. 257d CO. Further steps, e.g. debt collection proceedings or termination for payment arrears under Art. 257d CO, take place outside Dwello. For this termination, you first set the tenant a payment deadline of at least 30 days in a separate letter, with a warning that you will terminate the lease. Seek advice.»

Dazu ändert sich der erste Prüfsatz im Szenario `help.feature:29`, z.B. zu «Eine Mahnung von Dwello ist eine Zahlungsaufforderung. Sie ist keine Zahlungsfrist mit Kündigungsandrohung nach Art. 257d OR.»

Zum Entwurf (falls er bleibt): fr «mise en demeure», it «diffida» und «comminatoria della disdetta» sind in der Westschweiz und im Tessin gebräuchlich und nicht falsch. Fedlex Art. 266n schreibt aber «menace de résiliation» und «comminatoria di disdetta». it «Si faccia consigliare» und fr «Faites-vous conseiller» passen (Sie-Form). Die Randtitel stimmen: fr «Demeure du locataire», it «Mora del conduttore» (Fedlex, Randtitel zu Art. 257d), en «Tenant in arrears».

## M-2 (Minor, Entscheid nötig): Formular und getrennte Zustellung fehlen

**Beleg.** Fedlex, Art. 266l Abs. 2 OR: «Der Vermieter muss mit einem Formular kündigen, das vom Kanton genehmigt ist und das angibt, wie der Mieter vorzugehen hat, wenn er die Kündigung anfechten oder eine Erstreckung des Mietverhältnisses verlangen will.» Art. 266n OR (Zitat unter M-1). Art. 266o OR: «Die Kündigung ist nichtig, wenn sie den Artikeln 266l–266n nicht entspricht.» Art. 257d Abs. 2 OR: «Bezahlt der Mieter innert der gesetzten Frist nicht, so kann der Vermieter fristlos, bei Wohn- und Geschäftsräumen mit einer Frist von mindestens 30 Tagen auf Ende eines Monats kündigen.» Issue #59, «Problem», nennt Art. 266l Abs. 2 selbst; der Entscheid übernimmt ihn nicht.

**Warum.** Was der Hinweis sagt, ist richtig, aber unvollständig. Gerade die Formfehler (kein kantonales Formular; bei einer Familienwohnung nur dem Mieter zugestellt, schon die Fristansetzung) machen die Kündigung nichtig. «Lassen Sie sich beraten.» fängt das teilweise auf. Kein Blocker, weil der Text nichts Falsches behauptet und der Product Owner den Inhalt entschieden hat.

**Vorschlag** (nur nach Entscheid; sonst Issue `fachlich`, `entscheiden`). Ein zusätzlicher Satz vor «Lassen Sie sich beraten.»:
- de: «Gekündigt wird mit dem amtlichen Formular des Kantons; bei einer Familienwohnung gehen Fristansetzung und Kündigung getrennt an beide Ehegatten oder eingetragenen Partner.»
- fr: «Le congé est donné au moyen de la formule officielle du canton ; pour un logement de la famille, la fixation du délai et le congé sont communiqués séparément à chacun des conjoints ou partenaires enregistrés.»
- it: «La disdetta si dà con il modulo ufficiale del Cantone; per un’abitazione familiare, l’imposizione del termine e la disdetta vanno notificate separatamente a entrambi i coniugi o partner registrati.»
- en: «Notice is given on the canton’s official form; for a family home, the time limit and the notice must be served separately on both spouses or registered partners.»

## M-3 (Minor): fehlende Begriffe

Im Glossar steht nur «Betreibungsauszug» (`UBIQUITOUS_LANGUAGE.md:186`). Die Kündigung wegen Zahlungsrückstand erwähnt es nur in der Zeile «Kündigungsfrist» (`:41`). Nach CLAUDE.md («Domain terms only from UBIQUITOUS_LANGUAGE.md») braucht es ein Issue (`fachlich`, `entscheiden`) mit folgenden Vorschlägen:
- **Betreibung**: «Zwangsvollstreckung einer Geldforderung über das Betreibungsamt (Art. 38 Abs. 1, Art. 67 SchKG), z.B. für eine unbezahlte Nachzahlung; ausserhalb von Dwello.» i18n: poursuite / esecuzione / debt collection proceedings. Fedlex, Art. 38 Abs. 1 SchKG: «Auf dem Wege der Schuldbetreibung werden die Zwangsvollstreckungen durchgeführt, welche auf eine Geldzahlung oder eine Sicherheitsleistung gerichtet sind.»; Art. 67 Abs. 1 SchKG: «Das Betreibungsbegehren ist schriftlich oder mündlich an das Betreibungsamt zu richten.»
- **Zahlungsfrist mit Kündigungsandrohung**: «Schriftliche Frist von mindestens 30 Tagen (Wohnungen), nach deren unbenütztem Ablauf der Vermieter wegen Zahlungsrückstand kündigen darf (Art. 257d OR); keine Mahnung von Dwello.» i18n: délai de paiement assorti d’une menace de résiliation / termine di pagamento con comminatoria di disdetta / time limit for payment with a warning of termination.

Ein Konflikt: Im Glossar ist die «Zahlungsfrist» ein Datum (`:181`), im Gesetz eine Dauer («mindestens 30 Tage»). Deshalb der eigene Begriff oben.

## V-2 (Minor): Brieftext und Zahlteil

**Beleg.** `reminder-letter.ts:39` «Bitte überweisen Sie den Betrag bis ${date} auf folgendes Konto:». Die Abrechnung sagt dagegen «Bitte bezahlen Sie den Betrag bis {date} mit dem Zahlteil.» (`pdf.service.ts:83`). Der Entwurf behält den Brieftext.

**Warum.** In der Praxis verweist eine Mahnung mit Einzahlungsschein auf diesen («mit dem beiliegenden Einzahlungsschein»). Der Mieter soll den Zahlteil nutzen, sonst fehlt bei einer QR-IBAN leicht die Referenz. Kein Fehler, nur eine Unschärfe.

**Vorschlag** (nur wenn ein Zahlteil gedruckt wird, sonst bleibt der heutige Satz):
- de: «Bitte bezahlen Sie den Betrag bis {date} mit dem Zahlteil oder überweisen Sie ihn auf folgendes Konto:»
- fr: «Veuillez payer le montant au plus tard le {date} avec la section paiement ou le virer sur le compte suivant :»
- it: «La preghiamo di pagare l’importo entro il {date} con la sezione pagamento o di versarlo sul seguente conto:»
- en: «Please pay the amount by {date} using the payment part or transfer it to the following account:»

## V-3 (Minor): Szenario prüft den Zahlteil nur teilweise

**Beleg.** `statement-reminder.feature:80` «steht im PDF "CH93 0076 2011 6238 5295 7"». Die IBAN wird so gespeichert, wie sie eingegeben wurde (`config.service.ts:68-73`, kein Normalisieren), und der Brief druckt sie schon heute (`reminder-letter.ts:123` «IBAN ${input.sender.iban}»). Diese Zeile ist also auch ohne Zahlteil erfüllt. Für den Zahlteil sprechen «Empfangsschein», «Zahlteil» und «Währung Betrag CHF 2 320.00».
Betrag nachgerechnet: Heizkosten 4000.00 (einzige Wohnung, ganzes Jahr) + Verwaltungspauschale 3 % (Vorgabe `config.service.ts:33-37`, Seed mit `managementFeeAgreed: true`, `tests/e2e/fixtures/backend.ts:160`) = 4120.00, minus Akonto 12 × 150 = 1800.00, ergibt einen Saldo von 2320.00. Ohne Rundung, weil das schon ein Vielfaches von 5 Rappen ist. Im Zahlteil «2 320.00»: SIX verlangt ein Leerzeichen als Tausendertrennzeichen (Suchtreffer IG/Style Guide: «A blank (space) should be used as the thousands separator and a full stop "." as the decimal separator. The amount must always include two decimal places.»). Bestätigt.
Gegenprobe mit Mieterwechsel: Ein Mieter ab 1.7.2024 hat 184 von 366 Tagen, also 4000 × 184/366 = 2010.93, + 3 % = 60.33, ergibt 2071.26; minus 6 × 150 = 900, ergibt 1171.26 und nach der Rundung zugunsten des Mieters 1171.25. Der Zahlteil übernimmt `statement.balance`, also denselben Wert wie die Abrechnung. Saldo 0 oder Rückerstattung: keine Mahnung (`reminder.service.ts:61`), also kein Zahlteil. Teilzahlungen kennt Dwello nicht (`paidAmount` nur bei Status `paid`, `statement.service.ts:493`), deshalb ist der offene Saldo gleich `balance`.

**Behebung.** IBAN-Zeile weglassen oder durch eine Angabe ersetzen, die nur der Zahlteil hat (z.B. «Zahlbar durch»). Im `reminders.pg.test.ts` den QR-Inhalt prüfen: Betrag `2320.00`, Referenztyp `QRR` mit der Referenz der Abrechnung bei QR-IBAN bzw. `NON`, Mitteilung «Nebenkostenabrechnung <Nummer>» in der Sprache des Mieters.

## V-4 (Nit): «z.B.» / «z. B.»

`messages/de.json`: 7× «z. B.», 2× «z.B.». Vorschlag: «z. B.» (in M-1 schon so). fr «p. ex.», it «p. es.» und en «e.g.» passen zu den bestehenden Texten.

## V-5 (Nit, schon vorher so): Betragsformat im Brief

`reminder-letter.ts:107` `CHF ${amount.toFixed(2)}` ergibt «CHF 2320.00»; in der Abrechnung steht «CHF 2'320.00», im Zahlteil «2 320.00» (nach SIX). Mit dem Zahlteil auf derselben Seite fällt der Unterschied auf. Vorschlag: im Brief `formatCHF` wie in der Abrechnung verwenden. Kein Blocker, gehört nicht zu #108.

---

## Bestätigt (mit Quelle)

- **Kein Kündigungsrecht aus drei Mahnungen von Dwello.** Die Briefe (`reminder-letter.ts:32`, 3. Mahnung «andernfalls müssen wir weitere Schritte einleiten») enthalten keine Kündigungsandrohung, deshalb sind sie keine Fristansetzung nach Art. 257d Abs. 1 OR (Wortlaut oben: «… und ihm androhen, dass bei unbenütztem Ablauf der Frist das Mietverhältnis gekündigt werde»). Die Frist der Briefe beträgt ohnehin nur 10 Tage (`PAYMENT_DAYS`, `reminder.service.ts:29`), weniger als die 30 Tage bei Wohnräumen. Der Entscheid «letters stay without a termination threat» ist so umgesetzt.
- **«mindestens 30 Tage», «schriftlich», «Androhung der Kündigung»** im Hinweis: Art. 257d Abs. 1 OR (de/fr/it wörtlich wie oben; fr «de 30 jours au moins», it «di 30 giorni almeno»). Für Wohnungen (die Mietobjekte von Dwello) gilt 30; die 10 Tage gelten nur ausserhalb von Wohn- und Geschäftsräumen. Mit «mindestens 30 Tagen» liegt man also auf der sicheren Seite.
- **Nebenkosten-Nachzahlung als Grund nach Art. 257d.** «fälliger Mietzinse oder Nebenkosten» (Abs. 1), fr «frais accessoires échus», it «spese accessorie scaduti». Die Nachzahlung aus der Abrechnung fällt darunter, sobald sie fällig ist.
- **Betreibung als möglicher Schritt:** Art. 38 Abs. 1 und Art. 67 Abs. 1 SchKG (oben zitiert).
- **«Mahnung» = «Zahlungsaufforderung»:** Glossar `:182`. Übersetzungen nach `i18n-begriffe.md:67` (rappel / sollecito / reminder), Kündigung `:29` (résiliation / disdetta / notice of termination), Betreibung angelehnt an `:72` (poursuites / esecuzioni / debt collection).
- **Artikelzitate je Sprache** wie im Bestand: de «Art. … OR», fr «art. … CO», it «art. … CO», en «Art. … CO» (`messages/*.json`).
- **Zahlteil, Empfangsschein:** Glossar `:196-197`; Beschriftungen je Sprache aus `pdf.service.ts` (Zahlteil / Section paiement / Sezione pagamento / Payment part), der Hinweis zum Abtrennen ist vorhanden (`pdf.service.ts:108/185/262/339`). Er erfüllt die SIX-Vorgabe für PDF-Rechnungen (Sekundärquellen, z.B. BCVS-FAQ: «… mit dem Scherensymbol oder dem Hinweis «Vor der Einzahlung abzutrennen» oberhalb der Linie»).
- **Referenz:** Eine QR-Referenz nur mit QR-IBAN (`qr-bill.service.ts:332-334, 361`; Raiffeisen: «Die QR-Referenz darf nur mit einer QR-IBAN verwendet werden»). Mit der Referenz der Abrechnung kann der Vermieter eine Zahlung über Abrechnung oder Mahnung derselben Forderung zuordnen. Mit einer normalen IBAN gibt es weder in der Abrechnung noch in der Mahnung eine Referenz; die Zuordnung läuft dann über «Zusätzliche Informationen» (Nummer der Abrechnung). Bestätigt.
- **Zusätzliche Informationen** «Nebenkostenabrechnung <Nummer>» in der Sprache des Mieters, auf 140 Zeichen gekürzt (`qr-bill.service.ts:287, 364`). Die SIX-Grenze (Mitteilung und Rechnungsinformationen zusammen höchstens 140 Zeichen) ist bestätigt über swiss-qr-invoice.org (S1-Syntax): «Die Felder «Unstrukturierte Mitteilung» und «Rechnungsinformationen» dürfen in Summe nicht mehr als 140 Zeichen enthalten.» Für eine Mahnung ist kein besonderer Eintrag nötig.
- **Zahlbar durch = Mieter:** wie bei der Abrechnung; der Inhalt hängt von W3c (#102/#191) ab und ist hier nicht geprüft.
- **E-Mail:** Der Text bleibt, das PDF enthält den Zahlteil (`reminder.service.ts:103-108`). Entspricht dem Entscheid #108.
- **Ohne IBAN kein Zahlteil:** sinnvoll; der Zahlteil kann ohne Konto nicht entstehen.

## Nicht bestätigt

- **SIX Implementation Guidelines v2.4 und Style Guide (Primärquelle):** Der Abruf von six-group.com war hier nicht möglich (Proxy: `connect_rejected`; WebFetch: `ENOTFOUND`). Betragsformat, Abtrennhinweis und 140 Zeichen sind nur über Suchtreffer bzw. Sekundärquellen (Banken-FAQ, swiss-qr-invoice.org) bestätigt. Was IG 2.4 für Mahnungen oder die Wiederverwendung einer Referenz sagt: **unsicher** (mmx-Suche ohne Fundstelle in der IG; in der Praxis üblich, ein Verbot habe ich nicht gefunden).
- **Layout** (Zahlteil unten auf der Briefseite, zweite Seite nur bei Platzmangel): nicht nachgemessen. Nach `reminder-pdf.ts:31-35` beginnt der Text bei y = 290 pt, der Zahlteil bei 842 − 297.6 = 544 pt. Die 3. Mahnung mit langer Adresse und Referenz kann in den Zahlteil reichen. Das prüft der daten-pruefer am PDF.
- **Englische Fedlex-Übersetzung** von Art. 257d (Stand 1.1.2026) lässt «schriftlich» weg («may set a time limit for payment and notify him …»). Sie ist nicht amtlich; der en-Text stützt sich auf de/fr/it.
- **Debitoradresse** im QR-Code (strukturierte Adresse nach IG 2.4, Hausnummer): W3c ändert sie parallel; hier nicht geprüft.
