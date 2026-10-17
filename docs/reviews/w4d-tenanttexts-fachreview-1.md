# Fach-Review 1: Mietertexte (#84, Option B), Triage vor der Umsetzung

Gegenstand: `w4d-84-triage.md` (Zeilen «Apply in this PR») mit den Berichten `native-fr.md`, `native-it.md`, `native-en.md`. Geprüft gegen den Code im Worktree `review-terms-fach` (Commit 8ded4b1): `backend/src/services/pdf.service.ts`, `backend/src/services/reminder-letter.ts`, `backend/src/services/reminder.service.ts`. Massstab sind `UBIQUITOUS_LANGUAGE.md` (UL), `docs/design/i18n-begriffe.md` (i18n), `messages/*.json` sowie die Fedlex-Texte im Scratchpad (`co-fr.txt`, `co-it.txt`, `oblf-fr.txt`, `oblf-it.txt`).

Ergebnis: Keine Zeile, die angewendet werden soll, ist mietrechtlich falsch. Keine der Formulierungen für die 3. Mahnung droht mit einer Kündigung. Offen sind zwei Folgepunkte, die in denselben PR gehören (V-1, V-2). Von den zurückgestellten Zeilen muss keine in diesen PR; zwei Zeilen haben jedoch einen Fedlex-Beleg, der in die jeweilige Ablage gehört (M-3, M-4).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | FR-15 «Solde nul» und EN-19 «Nil balance» nur im PDF zu ändern, verletzt die Regel in i18n:3: Die Oberfläche zeigt weiter «Soldé» und «Settled» (`statements_balance_settled`, messages/fr.json:937, en.json:937). Dieselbe Änderung gehört in diesen PR; zudem fehlt in i18n eine Zeile «Ausgeglichen». |
| M-1 | Mietrecht | – (bestätigt) | 3. Mahnung (FR-19, IT-1, EN-24): Keine Fassung erfüllt Art. 257d Abs. 1 OR; es gibt keine Androhung einer Kündigung. #59 bleibt gewahrt. |
| V-2 | Verwalter | Nit | EN-24 «further action» weicht vom Hilfetext ab, der «Further steps» erklärt (en.json:1054). Entweder dort angleichen oder «steps» behalten. |
| V-3 | Verwalter | Nit | IT-1, FR-20 «ce rappel» und FR-19 «deux rappels» hängen vom Mahnungs-Wort ab, das in #83 noch offen ist (terms-fachreview-1, V-1). Ändert #83 das Wort, sind diese Texte nachzuziehen. |
| M-2 | Mietrecht | – (bestätigt) | EN-17 «supporting documents» entspricht i18n (Beleg) und dem Sinn von Art. 257b Abs. 2 OR («pièces justificatives» / «documenti giustificativi»). |
| M-3 | Mietrecht | Nit | Zurückgestellt IT-8: Fedlex-it sagt «rapporto di locazione» (Art. 257d cpv. 1, 257f cpv. 3 CO). Der Beleg gehört in den Kommentar zu #325/#133. |
| M-4 | Mietrecht | Minor | Zurückgestellt FR-M9: Der Vorschlag «Investissements à plus-value» ist nicht der Fedlex-Wortlaut. Art. 14 OBLF sagt «investissements créant des plus-values», it «investimenti di valorizzazione» (heute schon so). Das gehört ins Migrations-Issue. |

## Befunde

### V-1 (Minor): «Ausgeglichen» unterschiedlich in PDF und Oberfläche

**Beleg.** i18n:3: «Where the statement PDF (`backend/src/services/pdf.service.ts`) already translates a term, the UI reuses its translation.» PDF: pdf.service.ts:129 `balanced: 'Soldé'`, :206 `'Saldato'`, :283 `'Settled'`. Oberfläche: messages/fr.json:937 `"statements_balance_settled": "Soldé"`, it.json:937 `"In pareggio"`, en.json:937 `"Settled"`. In i18n gibt es keine Zeile «Ausgeglichen»; nur «Saldo / Nachzahlung / Rückerstattung» ist geregelt.

**Warum.** Inhaltlich sind FR-15 und EN-19 richtig. UL:156 sagt «Saldo 0.00: keine Zahlung, kein Zahlteil», und «Soldé» oder «Settled» klingen nach einer schon geleisteten Zahlung. «Solde nul» und «Nil balance» stützen sich auf den verbindlichen Begriff solde / balance. Auch wenn nach der Rundung auf 0 gestellt wird, stimmt die Aussage, denn der Saldo ist laut UL:156 der gerundete Betrag. Ändert man aber nur das PDF, sieht der Vermieter in der Abrechnungsliste «Soldé», während der Mieter auf dem PDF «Solde nul» liest. Im Italienischen beseitigt IT-5 genau diesen heutigen Unterschied, denn die Oberfläche sagt schon «In pareggio».

**Korrektur.** Im selben PR `statements_balance_settled` in fr auf «Solde nul» und in en auf «Nil balance» setzen. In i18n eine Zeile «Ausgeglichen | solde nul | in pareggio | nil balance» ergänzen.

### M-1 (bestätigt): Die 3. Mahnung droht nicht mit einer Kündigung (#59)

**Beleg.** Art. 257d al. 1 CO (co-fr.txt:1392): «… le bailleur peut lui fixer par écrit un délai de paiement et lui signifier qu’à défaut de paiement dans ce délai il résiliera le bail.» it (co-it.txt:1389): «… avvertirlo che, scaduto infruttuosamente questo termine, il rapporto di locazione sarà disdetto.»

**Geplante Texte.**
- FR-19: «… faute de quoi nous nous verrons contraints d’entreprendre d’autres démarches»
- IT-1: «… altrimenti dovremo adottare ulteriori provvedimenti»
- EN-24: «… otherwise we will have to take further action»

**Bewertung.**
- Keine Fassung nennt eine Kündigung oder die Auflösung des Mietverhältnisses. Die zweite Voraussetzung von Art. 257d Abs. 1, die Androhung, fehlt also in allen Sprachen.
- Die Folge bleibt so offen wie im deutschen Text «weitere Schritte einleiten» (reminder-letter.ts:34).
- Der Hilfetext (messages/*.json:1054) erklärt dem Vermieter, dass solche Schritte ausserhalb von Dwello stattfinden und dass eine Kündigung einen eigenen Brief braucht.
- «se voir contraint», «adottare provvedimenti» und «further action» sind übliche Formeln für eine Betreibung. Keine davon ist ein Fachwort des Mietrechts für die Kündigung.
- Die Reihenfolge der Stufen ist gesichert: reminder.service.ts:62 rechnet `level = countReminders + 1`. Die 3. Mahnung folgt also immer auf die Zahlungserinnerung und die 2. Mahnung, und der Wortlaut von IT-1 «il promemoria e il sollecito» stimmt.

Der Widerspruch zwischen «sofort» und der Frist im selben Brief (FR-22) ist kein Rechtsproblem. Er ist mit Recht als Produktentscheid zurückgestellt.

### V-2 (Nit): EN-24 und der Hilfetext

**Beleg.** en.json:1054: «Further steps, e.g. debt collection proceedings or termination …». Der Brief würde nach EN-24 «further action» sagen.

**Korrektur.** Dafür gibt es keine Regel, deshalb Nit. Wer die beiden Texte verbinden will, behält «further steps» oder ändert im selben PR auch den Hilfetext auf «Further action, e.g. …». In de, fr und it passen Brief und Hilfe zusammen: weitere Schritte / autres démarches – démarches suivantes / provvedimenti – passi successivi. Für it ist das eine leichte Abweichung, aber kein Fehler.

### V-3 (Nit): Abhängigkeit vom Mahnungs-Wort in #83

**Beleg.**
- reminder-letter.ts:44 und :61: Brieftitel «Rappel de paiement / 2e rappel / 3e rappel» und «Promemoria di pagamento / 2° sollecito / 3° sollecito».
- IT-1 nennt «il sollecito».
- FR-20 setzt «ce rappel».
- Laut terms-fachreview-1 (V-1, M-3) bleibt das Wort für die Mahnung ❓ für eine muttersprachliche Person; im Gespräch sind «sommation» und «diffida».

**Korrektur.** Für diesen PR braucht es keine Änderung. Ändert #83 die Wörter, müssen IT-1, FR-19 und FR-20 im selben Zug folgen.

### M-2 (bestätigt): EN-17 «supporting documents»

**Beleg.**
- i18n, Zeile Beleg: «pièce justificative | giustificativo | supporting document».
- Art. 257b al. 2 CO (co-fr.txt:1386): «… lui permettre de consulter les pièces justificatives»; it: «dei documenti giustificativi».
- Art. 8 Abs. 2 OBLF (oblf-fr.txt:60): «Le locataire ou son mandataire dûment autorisé».
- fr und it des PDFs (pdf.service.ts:182, :259) verwenden schon die Fedlex-Wörter.

**Bewertung.** «receipts» ist zu eng; «supporting documents» trifft den Begriff des Gesetzes. Das Einschieben von «To do so» entspricht dem deutschen «dafür». Die Wendung «a person you authorise» deckt sich mit «mandataire dûment autorisé».

### Weitere angewendete Zeilen: bestätigt

- **FR-1 bis FR-3:** «verser» entspricht dem Hilfetext des Glossars, der das Verb schon so verwendet (fr.json:107 «vous lui versez le montant (« Remboursement au plus tard le »)»). «au plus tard le» gibt «bis {date}» korrekt als Frist wieder (pdf.service.ts:87).
- **FR-4:** Ohne Befund.
- **FR-5, FR-6 sowie IT-2, IT-3:** «au moyen de / tramite la section paiement» lässt die QR-Bezeichnungen von SIX unberührt (Zahlteil = «section paiement» / «sezione pagamento», i18n).
- **FR-7 und EN-1:** Die Ordinalzahlen habe ich nachgerechnet.
  - FR: 1 ergibt «1er sous-sol», 2 «2e sous-sol».
  - EN, Suffix-Formel: 1 → st, 2 → nd, 3 → rd, 4 → th (Fallback `??`), 11, 12, 13 → th, 21 → st, 111 → th.
  - Die britische Zählung (ground, 1st, 2nd) entspricht der Schweizer (EG, 1. OG). Für n = 1 steht «basement», für n ≥ 2 «basement level n».
- **FR-8:** Die geschützten Leerzeichen sind typografisch richtig und berühren keinen Fachbegriff.
- **FR-16:** Fachlich ohne Befund. Art. 8 al. 2 OBLF (oblf-fr.txt:60) spricht von «l’état des stocks de combustibles au début et à la fin», also im Plural.
- **FR-17 bis FR-19, FR-20:** Ohne Befund, siehe auch M-1 und V-3.
- **IT-4 «Osservazioni»:** Kein Rechtsbegriff, ohne Befund.
- **IT-6:** Der Verweis entspricht jetzt dem Abschnittstitel `heatingSection` «Spese di riscaldamento e acqua calda» (pdf.service.ts:252).
- **IT-9:** «Arrotondamento a 5 centesimi» passt zu UL:157 «Rundung auf 5 Rappen» und zu den anderen Sprachen (pdf.service.ts:46, 124, 278).
- **IT-10, IT-11:** «rimborso» ist der verbindliche Begriff (i18n Rückerstattung).
- **EN-2 bis EN-5, EN-14:** «heating profile», «billing period» und «tenancy» bleiben erhalten. «under the heating profile» ändert die Bedeutung nicht.
- **EN-10:** Die neue Erklärung «your apartment’s part of the building costs under the distribution key» deckt sich mit UL:124: «Anteil einer Wohnung an den Gebäudekosten gemäss Verteilschlüssel». «counts only for its days within the period» entspricht UL:64 und UL:160.
- **EN-11, EN-15, EN-16, EN-18, EN-20, EN-21, EN-23:** Ohne Befund. EN-18 verwendet den verbindlichen Begriff «fuel stock» (i18n).

## Zurückgestellte Zeilen: Bewertung

- **FR-10 bis FR-14, IT-7, EN-6 bis EN-9, EN-12, EN-13 (#256):** Richtig zugeordnet. Sie betreffen die Rechenzeilen, über die #256 entscheidet.
- **FR-9, IT-8 (tenancyLine):** Die Zuordnung zu #325/#133 ist richtig. Zu IT-8 siehe M-3: Fedlex-it sagt «rapporto di locazione» (co-it.txt:1389, Art. 257d cpv. 1 «il rapporto di locazione sarà disdetto»; co-it.txt:1401, Art. 257f cpv. 3). Unter Option B spricht das für IT-8; ich empfehle, den Beleg in den Kommentar aufzunehmen.
- **FR-21, EN-25 (Anrede), FR-22 («sofort» und Frist):** Produktentscheide, richtig zurückgestellt. Rechtlich gibt es keine Vorgabe zur Anrede.
- **FR-M*, IT-M*, EN-M* (Migration):** Richtig zurückgestellt. Ins neue Issue gehört zusätzlich:
  - **M-4 (Minor):** Für FR-M9 den Fedlex-Wortlaut verwenden. Art. 14 OBLF (oblf-fr.txt:101): «investissements créant des plus-values», nicht «Investissements à plus-value». it «Investimenti di valorizzazione» entspricht schon Fedlex (oblf-it.txt:101 «investimenti di valorizzazione»).
  - FR-M5 und EN-M5 berühren den verbindlichen Begriff Wartung (i18n: maintenance / servicing). Ob «Fire Extinguisher Maintenance» Wartung im Sinn von Art. 5 Abs. 2 lit. g VMWG ist, entscheidet das Issue, nicht die Übersetzung.
- **EN-22 und EN-26:** Die Ablehnung ist vertretbar; beides betrifft nur Stil.

## Fehlende Begriffe (Issue durch den Aufrufer)

- «Ausgeglichen» (Saldo 0.00) fehlt in i18n. Vorschlag: fr «solde nul», it «in pareggio», en «nil balance». Der Begriff Saldo (UL:156) ist schon geregelt, das ist nur eine abgeleitete Statusbezeichnung. Ein Issue braucht es nur, wenn der Aufrufer die Zeile nicht im selben PR ergänzt (V-1).

## Nicht bestätigt

- Ob die inoffizielle englische Fassung des OR auf Fedlex in Art. 257b para. 2 «supporting documents» sagt, habe ich nicht nachgeschlagen. EN-17 stützt sich auf i18n und den Sinn der fr/it-Texte.
- Welche englische Abkürzung Fedlex für die VMWG verwendet (Beobachtung in native-en.md), habe ich nicht geprüft.
- Die Aussagen zur Praxis («n’a pas encore été réglé» in Schweizer Mahnungen, «Nil balance» im britischen Gebrauch, «custode» im Tessin) haben keine Fedlex-Quelle. Ich habe sie nur auf Widerspruch zu Recht und Begriffen geprüft und keinen gefunden.
- Wie U+00A0 im PDF dargestellt wird (FR-8), habe ich nicht geprüft.
