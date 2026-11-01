# Fachreview #999, Schritt 1, Runde 1

Gegenstand: die fünf `@wip`-Szenarien mit #999 in `tests/e2e/features/statement-detail.feature:233-298` und der Entwurf `docs/reviews/999-entwurf.md`. Worktree `/tmp/scratchpad/review-999-fach-reviewer`, Commit `a003af3`.
Rechtsquelle: OR, Fedlex-Fassung Stand 1. Oktober 2026 (`eli/cc/27/317_321_377/20261001`).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major (braucht einen Entscheid) | Das Glossar «Zahlung zurücksetzen» verlangt im Verlauf Datum **und Betrag** der zurückgesetzten Zahlung. Der Entwurf lässt die Zeile für eine einzelne vollständige Zahlung ohne Betrag (`statements_history_payment_reset`) und führt dafür einen zweiten Schlüssel `…_amount` ein |
| V-2 | Verwalter | Minor | Zurückgesetzte Teilzahlung: Der Entwurf behält ihre Zeile «Teilzahlung über …» im Verlauf. Ein «Bezahlt» verschwindet dagegen nach dem Zurücksetzen (`MetadataCard.svelte:108`), und eine Quittung (Art. 88 OR) darf eine nicht geleistete Zahlung nicht nennen. Abhilfe: Die Zeile entfällt, und die Zeile des Zurücksetzens trägt Datum und Betrag. Szenario 1 erhält `Und nennt der Verlauf keine Teilzahlung über "CHF 50.00" von vor 5 Tagen` |
| V-3 | Verwalter | Minor | Die Bestätigungstexte stimmen nicht in jedem Fall. Bei nur einer Teilzahlung davor steht trotzdem die Mehrzahl («Die Teilzahlungen davor …: CHF 100.00»). Bei einer Rückerstattung sind «nichts mehr bezahlt» und «reste dû»/«ancora dovuto» falsch (Regel 5 von #959). «Sie hat den Status» liest sich wie die Anrede. Abhilfe: neutrale Texte, siehe Tabelle |
| V-4 | Verwalter | Minor | Das Szenario «Die letzte Zahlung einer in Teilen bezahlten Abrechnung zurücksetzen» (Z. 274-285) öffnet nur die Bestätigung. Kein Szenario prüft das Ergebnis dieses Falls und `statements_history_payment_reset_amount`. Abhilfe: zurücksetzen lassen, dann `hat die Abrechnung den Status "Versendet"` und `nennt das Panel Zahlung "Bezahlt: CHF 100.00, offen: CHF 342.90"` |
| V-5 | Verwalter | Minor | Das Protokoll hält nur das Datum fest (`backend/src/services/statement.service.ts:881` `recordAudit('payment_reset', { …, paidDate })`, `audit_payment_reset`). Das Glossar verlangt «Der Verlauf und das Protokoll … mit Datum und Betrag». Abhilfe: `paidAmount` ins Audit, neuer Text `audit_payment_reset_amount` (Tabelle) |
| M-1 | Mietrecht | Minor | Bei einer in Teilen bezahlten Abrechnung nennt der Verlauf den Betrag der Schlusszahlung nicht (nur «Bezahlt» mit Datum). Eine Quittung kann der Mieter für jede Zahlung verlangen (Art. 88 Abs. 1 OR). Abhilfe: eine Zeile `statements_history_payment` «Zahlung über {amount}» mit dem Datum, nur wenn Teilzahlungen davor festgehalten sind. Das geht über Regel 1 hinaus und gehört deshalb in das «Decided» von #999 |

Rechnung (Saldo Eva Frei 442.90, laut Fachreview 959-1):
- Szenario 1: 442.90 − 100.00 − 50.00 = 292.90. Nach dem Zurücksetzen der 50.00 bleibt 442.90 − 100.00 = 342.90, wie «Bezahlt: CHF 100.00, offen: CHF 342.90».
- Szenario 4: 100.00 + 342.90 = 442.90, die Abrechnung ist also «Bezahlt». Nach dem Zurücksetzen sind 342.90 offen.
- Szenario 3 (Randfall, die einzige Teilzahlung): 10.00 zurück, offen 442.90, keine Zeile im Panel. Die Zahlungsfrist ist abgelaufen, also «Überfällig».
- Rückerstattung −120.00 mit den Teilen 50.00 und 30.00: Wird 30.00 zurückgesetzt, ist «festgehalten» 50.00 und offen 70.00. Die neutralen Texte unten stimmen hier, die Texte des Entwurfs nicht (V-3).

## Blocker/Major

**V-1.** Belege:
- `UBIQUITOUS_LANGUAGE.md:224`: «Der Verlauf und das Protokoll halten das Zurücksetzen mit Datum und Betrag der zurückgesetzten Zahlung fest.»
- Entwurf, Tabelle «Wann welcher Text gilt», Zeile 1: `statements_history_payment_reset` unverändert, also «Zahlung vom {date} zurückgesetzt».
- Das Szenario «Zahlung zurücksetzen» (Z. 177-186, nicht `@wip`) prüft über `statement-detail.steps.ts:501` wörtlich `toContain("Zahlung vom ${D} zurückgesetzt ${D}")`.

Warum: Das Glossar ist entschieden (#959), der Entwurf weicht davon ab. Rechtlich ist der Betrag dort nicht nötig. Art. 88 OR betrifft Zahlungen, nicht ihr Zurücksetzen, und der Betrag einer einzelnen vollständigen Zahlung ist der Saldo, der auf derselben Seite steht. Nötig ist der Betrag also nur nach dem Glossar. Jede Lösung braucht deshalb einen Entscheid:
- **A (empfohlen, Spec change):** ein Text für jedes Zurücksetzen mit bekanntem Betrag, «Zahlung vom {date} über {amount} zurückgesetzt». `statements_history_payment_reset` bleibt nur für Zahlungen vor #959, deren Betrag fehlt (`reset.paidAmount` null, `statement.service.ts:865`). Die Zeile 185 des Szenarios prüft dann «Zahlung vom {D} über CHF 442.90 zurückgesetzt {D}». Dafür braucht es ein Issue mit «Decided (product owner)» und `Spec change approved: #<n>`.
- **B (kleinster Weg, Szenario bleibt):** der Entwurf, wie er ist. Der PO hält im «Decided» von #999 fest, dass bei einer einzelnen vollständigen Zahlung der Saldo als Betrag gilt, und lässt die Glossarzeile entsprechend ergänzen («… mit Datum und, nach Teilzahlungen, Betrag»).
- **Nicht empfohlen:** den Betrag als zweite Zeile unter dem Zurücksetzen. Das Szenario würde damit zwar halten, aber jede Rücknahme hätte zwei Zeilen im Verlauf.

## Antworten auf die Fragen 1-7

1. **Die Zeile der zurückgesetzten Teilzahlung entfällt (V-2).** Die Zeile des Zurücksetzens nennt Datum und Betrag, so geht nichts verloren. Das passt zu «Bezahlt», das heute nach dem Zurücksetzen auch verschwindet. So nennt der Verlauf, aus dem der Liegenschaftsverwalter eine Quittung ausstellt, nur Zahlungen, die wirklich eingegangen sind. Die Zahlungszeilen stehen vor den Zeilen des Zurücksetzens, nach Datum.
2. **Ja, eine eigene Zeile «Zahlung über {amount}» mit dem Datum, nur nach Teilzahlungen (M-1).** «Bezahlt» bleibt unverändert, darauf stützen sich die Szenarien in Z. 157 ff. Bei einer einzelnen Zahlung genügt «Bezahlt», denn ihr Betrag ist der Saldo.
3. **Laut Glossar ja, rechtlich nein (V-1).** Empfehlung A mit Entscheid. Wenn der PO keinen Spec change will, ist B vertretbar.
4. **Rückerstattung:** Das Glossar nennt auch diese Zahlung eine Teilzahlung. Im Verlauf liest der Liegenschaftsverwalter «Teilzahlung über» aber als Eingang. Empfehlung: `statements_history_part_refund` «Zurückerstattet: {amount}», ohne Vorzeichen, gleich wie `statements_part_refunded`. Die Zeile des Zurücksetzens bleibt «Teilzahlung vom … zurückgesetzt», das ist Glossar. Die Bestätigungen werden neutral (V-3). Ein DOM-Test mit Saldo < 0 genügt, ein Szenario braucht es nicht.
5. **Nicht die Mehrzahl (V-3):** «Was davor festgehalten ist, bleibt: {kept}.» Der Satz stimmt bei einer oder mehreren Zahlungen und auch bei einer Rückerstattung. Den Vorschlag «Was davor bezahlt ist …» empfehle ich nicht, er ist bei einer Rückerstattung falsch.
6. **Der Knopf bleibt «Zahlung zurücksetzen».** Laut Glossar (Z. 224) umfasst der Begriff ausdrücklich die Teilzahlung, und die Bestätigung nennt, welche Zahlung zurückgesetzt wird.
7. **Einverstanden.** Der Text `statements_reset_payment_text` sagt «gilt wieder als nicht bezahlt», bei einer in Teilen bezahlten Abrechnung bleiben aber CHF 100.00 festgehalten. Dort gilt deshalb `statements_reset_part_payment_text`. «Bezahlt am» entfällt mit dem Status «Versendet», das sagt der Status schon.

## Texte

Die Szenarien 2 und 4 (`@wip`) prüfen danach «Was davor festgehalten ist, bleibt: CHF 100.00. Offen sind dann CHF 342.90.»; die Schritte zu Datum und Betrag (`vom {D} über {amount}`, `Teilzahlung vom {D} über {amount} zurückgesetzt`) bleiben gültig. fr: vor «:» steht ein geschütztes Leerzeichen.

| key | de | fr | it | en |
|-----|----|----|----|----|
| statements_reset_part_payment_text | Die Zahlung vom {date} über {amount} wird gelöscht. Was davor festgehalten ist, bleibt: {kept}. Offen sind dann {open}. Die Abrechnung {number} hat dann den Status «{status}». Der Verlauf hält das Zurücksetzen fest. | Le paiement de {amount} du {date} est supprimé. Ce qui a été enregistré avant reste : {kept}. Le montant ouvert est alors de {open}. Le décompte {number} a alors le statut « {status} ». L’historique conserve le retrait. | Il pagamento di {amount} del {date} viene cancellato. Quanto registrato prima resta: {kept}. L’importo aperto è allora di {open}. Il conteggio {number} ha allora lo stato «{status}». La cronologia registra la rimozione. | The payment of {amount} on {date} is deleted. What was recorded before stays: {kept}. The open amount is then {open}. Statement {number} then has the status «{status}». The history records the reset. |
| statements_reset_only_part_payment_text | Die Teilzahlung vom {date} über {amount} wird gelöscht. Für die Abrechnung {number} ist dann keine Zahlung mehr festgehalten. Offen sind {open}, der Status bleibt «{status}». Der Verlauf hält das Zurücksetzen fest. | Le paiement partiel de {amount} du {date} est supprimé. Plus aucun paiement n’est alors enregistré pour le décompte {number}. Le montant ouvert est de {open}, le statut reste « {status} ». L’historique conserve le retrait. | Il pagamento parziale di {amount} del {date} viene cancellato. Per il conteggio {number} non risulta allora più registrato alcun pagamento. L’importo aperto è di {open}, lo stato resta «{status}». La cronologia registra la rimozione. | The part payment of {amount} on {date} is deleted. No payment is then recorded for statement {number}. The open amount is {open}, the status stays «{status}». The history records the reset. |
| statements_history_part_payment | Teilzahlung über {amount} | Paiement partiel de {amount} | Pagamento parziale di {amount} | Part payment of {amount} |
| statements_history_part_refund | Zurückerstattet: {amount} | Remboursé : {amount} | Rimborsato: {amount} | Refunded: {amount} |
| statements_history_part_payment_reset | Teilzahlung vom {date} über {amount} zurückgesetzt | Paiement partiel de {amount} du {date} retiré | Pagamento parziale di {amount} del {date} rimosso | Part payment of {amount} on {date} reset |
| statements_history_payment_reset_amount | Zahlung vom {date} über {amount} zurückgesetzt | Paiement de {amount} du {date} retiré | Pagamento di {amount} del {date} rimosso | Payment of {amount} on {date} reset |
| statements_history_payment | Zahlung über {amount} | Paiement de {amount} | Pagamento di {amount} | Payment of {amount} |
| audit_payment_reset_amount | Zahlung vom {date} über {amount} zur Abrechnung {number} zurückgesetzt | Paiement de {amount} du {date} du décompte {number} retiré | Pagamento di {amount} del {date} relativo al conteggio {number} rimosso | Payment of {amount} on {date} for statement {number} reset |

Die wiederverwendeten Schlüssel (`statements_reset_payment*`, `statements_history_payment_reset`, `statements_status_paid`) bleiben in allen vier Sprachen, wie sie sind. Sie stimmen mit `docs/design/i18n-begriffe.md:91,100` überein.

Fehlende Begriffe: keine. Für «Teilrückerstattung» schlage ich keinen Begriff vor. Der Verlauf kommt mit «Zurückerstattet: …» aus.

## Nicht bestätigt

- Ob `Text.of(statementHistory)` die Zeilen in der Reihenfolge des DOM ohne Zeilenumbruch zusammensetzt. Davon hängt ab, ob eine zweite Zeile (die nicht empfohlene Lösung zu V-1) das bestehende `toContain` hält. Ich habe nur `statement-detail.steps.ts:501` und `MetadataCard.svelte:118-125` gelesen.
- Ob «Überfällig» nach dem Zurücksetzen aus `status: 'sent'` abgeleitet wird (`statement.service.ts:862`). Das sagt nur der Kommentar dort, die Ableitung habe ich nicht gelesen. Szenario 3 prüft es.

Geprüft: Art. 69, 85, 88 OR wörtlich (Fedlex, Stand 1.10.2026); die Beträge der fünf Szenarien; die Begriffe gegen `UBIQUITOUS_LANGUAGE.md:186-224` und `i18n-begriffe.md`; die Schritte in `statement-detail.steps.ts:500-547` gegen die Texte.
