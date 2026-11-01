# #999 Teilzahlung zurücksetzen und im Verlauf nennen: Textentwurf

Entwurf für die Fachprüfung (CLAUDE.md, Workflow 1). Noch nichts davon steht in `messages/*.json`.
Szenarien: `tests/e2e/features/statement-detail.feature`, die fünf `@wip`-Szenarien mit `#999`.

Beispiel in allen Texten: Saldo CHF 442.90, Teilzahlungen CHF 100.00 (vor 10 Tagen) und CHF 50.00 (vor 5 Tagen).
`{amount}`, `{kept}` und `{open}` sind Beträge mit «CHF», wie in `statements_part_paid`; `{date}` ist TT.MM.JJJJ.

## Wann welcher Text gilt

| Fall | Knopf | Text der Bestätigung | Zeile im Verlauf nach dem Zurücksetzen |
|---|---|---|---|
| Bezahlt mit einer einzigen Zahlung (oder vor #959 bezahlt, ohne Liste) | wie heute | `statements_reset_payment_text`, unverändert | `statements_history_payment_reset`, unverändert |
| Versendet/Überfällig, die letzte von mehreren Teilzahlungen | wie heute | neu `statements_reset_part_payment_text` | neu `statements_history_part_payment_reset` |
| Versendet/Überfällig, die einzige Teilzahlung | wie heute | neu `statements_reset_only_part_payment_text` | neu `statements_history_part_payment_reset` |
| Bezahlt in Teilen, die letzte Zahlung (erreichte den Saldo) | wie heute | neu `statements_reset_part_payment_text` | neu `statements_history_payment_reset_amount` |

Teilzahlung heisst nach Glossar eine Zahlung unter dem offenen Betrag; die Zahlung, die den Saldo erreicht, ist keine.

## Wiederverwendete Schlüssel (unverändert)

| Schlüssel | de |
|---|---|
| `statements_reset_payment` (Knopf und Bestätigungsknopf) | Zahlung zurücksetzen |
| `statements_reset_payment_title` | Zahlung zurücksetzen? |
| `statements_reset_payment_done` | Die Zahlung der Abrechnung {number} ist zurückgesetzt. |
| `statements_reset_payment_failed` | Die Zahlung konnte nicht zurückgesetzt werden. Versuchen Sie es erneut. |
| `statements_reset_payment_text` | Die Abrechnung {number} gilt dann wieder als nicht bezahlt und hat den Status «{status}». Das Zahlungsdatum {date} wird gelöscht. Der Verlauf hält das Zurücksetzen fest. |
| `statements_history_payment_reset` | Zahlung vom {date} zurückgesetzt |
| `statements_status_paid` (Zeile «Bezahlt» im Verlauf) | Bezahlt |

fr/it/en dieser Schlüssel bleiben, wie sie sind (fr «Retirer le paiement saisi», it «Rimuovere il pagamento registrato», en «Reset payment», nach `docs/design/i18n-begriffe.md`).

## Neue Schlüssel

### `statements_reset_part_payment_text` (Bestätigung, Teilzahlungen davor bleiben)

- de: Die Zahlung vom {date} über {amount} wird gelöscht. Die Teilzahlungen davor bleiben festgehalten: {kept}. Offen sind dann {open}. Die Abrechnung {number} hat dann den Status «{status}». Der Verlauf hält das Zurücksetzen fest.
- fr: Le paiement du {date} de {amount} est supprimé. Les paiements partiels antérieurs restent enregistrés : {kept}. Le reste dû est alors de {open}. Le décompte {number} a alors le statut « {status} ». L’historique conserve le retrait.
- it: Il pagamento del {date} di {amount} viene cancellato. I pagamenti parziali precedenti restano registrati: {kept}. L’importo ancora dovuto è allora di {open}. Il conteggio {number} ha allora lo stato «{status}». La cronologia registra la rimozione.
- en: The payment of {date} for {amount} is deleted. The part payments before it stay recorded: {kept}. The outstanding amount is then {open}. Statement {number} then has the status «{status}». The history records the reset.

Beispiel de: «Die Zahlung vom 27.10.2026 über CHF 50.00 wird gelöscht. Die Teilzahlungen davor bleiben festgehalten: CHF 100.00. Offen sind dann CHF 342.90. Die Abrechnung NK-… hat dann den Status «Versendet». Der Verlauf hält das Zurücksetzen fest.»

### `statements_reset_only_part_payment_text` (Bestätigung, die einzige Teilzahlung)

- de: Die Teilzahlung vom {date} über {amount} wird gelöscht. Für die Abrechnung {number} ist dann nichts mehr bezahlt, offen sind {open}. Sie hat den Status «{status}». Der Verlauf hält das Zurücksetzen fest.
- fr: Le paiement partiel du {date} de {amount} est supprimé. Plus rien n’est alors payé sur le décompte {number} ; le reste dû est de {open}. Il a le statut « {status} ». L’historique conserve le retrait.
- it: Il pagamento parziale del {date} di {amount} viene cancellato. Per il conteggio {number} non risulta allora più nulla di pagato; l’importo ancora dovuto è di {open}. Ha lo stato «{status}». La cronologia registra la rimozione.
- en: The part payment of {date} for {amount} is deleted. Nothing is then paid on statement {number}; the outstanding amount is {open}. It has the status «{status}». The history records the reset.

### `statements_history_part_payment` (Verlauf, eine Zeile je Teilzahlung, Datum in der rechten Spalte)

- de: Teilzahlung über {amount}
- fr: Paiement partiel de {amount}
- it: Pagamento parziale di {amount}
- en: Part payment of {amount}

### `statements_history_part_payment_reset` (Verlauf, Datum des Zurücksetzens rechts)

- de: Teilzahlung vom {date} über {amount} zurückgesetzt
- fr: Paiement partiel du {date} de {amount} retiré
- it: Pagamento parziale del {date} di {amount} rimosso
- en: Part payment of {date} for {amount} reset

### `statements_history_payment_reset_amount` (Verlauf, letzte Zahlung einer in Teilen bezahlten Abrechnung zurückgesetzt)

- de: Zahlung vom {date} über {amount} zurückgesetzt
- fr: Paiement du {date} de {amount} retiré
- it: Pagamento del {date} di {amount} rimosso
- en: Payment of {date} for {amount} reset

## Fragen an die Fachprüfung

1. **Zurückgesetzte Teilzahlung im Verlauf:** Soll die zurückgesetzte Teilzahlung ihre Zeile «Teilzahlung über …» behalten (der Verlauf wächst nur, #968) und die Zeile «… zurückgesetzt» kommt dazu, oder verschwindet ihre Zeile? Der Entwurf behält sie; das Szenario prüft nur die Zeile des Zurücksetzens und die verbleibende Teilzahlung.
2. **Letzte Zahlung einer in Teilen bezahlten Abrechnung im Verlauf:** Nennt der Verlauf sie als eigene Zeile mit Betrag (neben «Bezahlt» mit ihrem Datum), oder genügt «Bezahlt»? Regel 1 verlangt nur jede Teilzahlung; für die Quittung (Art. 88 Abs. 2 OR) wäre der Betrag der Schlusszahlung auch nötig.
3. **Betrag beim Zurücksetzen einer vollständigen Zahlung:** Das Glossar («Zahlung zurücksetzen») sagt, der Verlauf hält Datum **und Betrag** fest. Die Zeile `statements_history_payment_reset` hat heute keinen Betrag, und das Szenario «Zahlung zurücksetzen» (nicht `@wip`) prüft sie wörtlich. Der Entwurf lässt sie unverändert; einen Betrag dort braucht einen Entscheid (Spec change).
4. **Rückerstattung (Saldo < 0, Regel 5):** Heisst die Zeile auch dort «Teilzahlung über CHF 50.00» (Betrag ohne Vorzeichen), oder braucht es «Teilrückerstattung» / «Zurückerstattet: …»? Das Glossar nennt beides «Teilzahlung»; der Hilfetext sagt bei der Rückerstattung «zurückerstattet».
5. **Einzahl/Mehrzahl:** «Die Teilzahlungen davor bleiben festgehalten: CHF 100.00» steht auch bei nur einer Teilzahlung davor in der Mehrzahl, mit der Summe. Ist das so verständlich, oder besser «Was davor bezahlt ist, bleibt festgehalten: CHF 100.00»?
6. **Knopf:** Der Entwurf behält «Zahlung zurücksetzen» auch bei einer Teilzahlung (Glossarbegriff). Soll er bei einer Teilzahlung «Teilzahlung zurücksetzen» heissen?
7. **Zahlungsdatum in der Bestätigung einer in Teilen bezahlten Abrechnung:** Der heutige Text («gilt dann wieder als nicht bezahlt», «Das Zahlungsdatum … wird gelöscht») stimmt dort nicht, weil CHF 100.00 bezahlt bleiben; deshalb gilt dort der neue Text. Einverstanden?
