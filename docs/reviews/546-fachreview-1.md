# Fachreview #546, Runde 1 (Schritt 1, vor der Umsetzung)

Worktree: /tmp/scratchpad/review-546-fach-reviewer (80ab61d)

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Ändert die Neuberechnung nur eine Position, nicht den Saldo, oder bleibt der verlangte Saldo gleich, dann ergäbe der Satz «… von CHF X statt CHF X» und die Bestätigung «Den Unterschied von CHF 0.00 tragen Sie selbst». Es braucht einen eigenen Satz, und der Kostensatz muss in diesem Fall wegfallen. |
| V-2 | Verwalter | Major | Der «Unterschied» muss der neue Saldo minus der bisherige Saldo sein, wie beide im Hinweis stehen, und nicht die Differenz der verlangten Beträge (`claimed`). Ein Saldo unter CHF 5 geht nicht verloren, er wird übertragen. |
| M-1 | Mietrecht | Major (braucht einen Entscheid, widerspricht PO 2026-10-20, V-30 A) | Fällt der Saldo innerhalb der Spanne unter CHF 5 (z. B. 4.00 → −4.00 oder 4.00 → 3.00), wird «Nicht berichtigen» trotzdem angeboten. Der Mieter bezahlt dann über den Übertrag mehr als die tatsächlichen Kosten. Mit #546 wird das sichtbar: Der Hinweis zeigt, dass der Saldo sinkt, bietet «Nicht berichtigen» aber trotzdem an. |
| V-3 | Verwalter | Major | Das Szenario legt nur den Fall Nachzahlung → Nachzahlung fest. Für die übrigen Fälle gibt es keine Regel: Webers Fall Rückerstattung → Nachzahlung, Saldo 0 auf einer der beiden Seiten, unveränderter Saldo, Saldo unter CHF 5. |
| V-4 | Verwalter | Minor | Ein Saldo unter CHF 5 erscheint ohne Erklärung («statt CHF 3.00»). Man liest daraus, dass CHF 3.00 verlangt wurden. Lösung: Ist eine Seite (ausser 0.00, ausser Schlussabrechnung) unter CHF 5, folgt der Satz `statements_later_below_minimum` (siehe Wording). |
| V-5 | Verwalter | Minor | Der Szenariotitel sagt «was der Verzicht kostet». Nach `UBIQUITOUS_LANGUAGE.md:201` ist «Nicht berichtigt» aber «kein Verzicht auf eine Forderung». Lösung: «… und was es kostet, nicht zu berichtigen». |

## V-1: unveränderter oder gleich verlangter Saldo

- Beleg: `backend/src/services/statement.service.ts:606-612`. `changes` ist auch wahr, wenn nur `sharesOf(...)` sich ändert. `raises: after >= before` ist auch bei Gleichheit wahr, damit sind `correctionDue` und `correctionDeclinable` beide wahr (`statement-invoices.service.ts:130-136`). Ein Beispiel: Eine Rechnung wechselt mit gleichem Betrag und gleichem Schlüssel die Kategorie. Ein zweites Beispiel ist die Rundung auf 5 Rappen. Ein drittes ist der von PO bestätigte Test 4.00 → 3.00 (`statement-invoices.pg.test.ts:505`): Verlangt sind beide Male 0.
- Warum falsch: Der Satz «eine Nachzahlung von CHF 442.90 statt CHF 442.90» ist sinnlos. Und «CHF 0.00 tragen Sie selbst» stimmt nicht, beim Fall 4.00 → 3.00 erst recht nicht (siehe M-1).
- Lösung:
  - Bei gleichem Saldo steht `statements_later_now_same`.
  - Den Satz `statements_decline_correction_difference` zeigt die Seite nur, wenn der neue Saldo minus der bisherige grösser als 0 ist.
  - Das Backend liefert dazu beide Saldi (bisher und neu) und `final` (für V-4).
  - Lässt sich die Abrechnung nicht neu berechnen (`check` null, V-31), fällt der Satz mit den Beträgen weg.

## V-2: was «Unterschied» ist

- Beleg:
  - `UBIQUITOUS_LANGUAGE.md:191` (Übertrag): «Ein Saldo unter dem Mindestbetrag … wird nicht eingefordert oder ausbezahlt, sondern in der nächsten Abrechnung desselben Mietvertrags verrechnet.»
  - `:213` (Erledigt): «Ein übertragener Betrag ist damit nicht bezahlt; er wird mit der nächsten Abrechnung eingefordert oder zurückerstattet.»
  - `docs/nebenkostenabrechnung-anforderungen.md:152`.
- Nachgerechnet:
  1. Szenario: Bisher 430.00 + 3 % = 442.90, Saldo 442.90. Neu (430.00 + 732 × 91/366 = 182.00) × 1.03 = 630.36. Zugunsten des Mieters auf 5 Rappen abgerundet ergibt das **630.35**. Der Unterschied ist 630.35 − 442.90 = **187.45**, gleich viel wie im Szenario «Berichtigte Abrechnung rechnet die Zahlung an». Die Platzhalter 999.99 werden 630.35 und 187.45. Diese Rechnung gehört als Kommentar über das Szenario.
  2. Weber: −34.60 → +162.00. Die Abrechnung bleibt, wie sie ist: Der Vermieter zahlt 34.60 aus und fordert 162.00 nicht ein. Er trägt **196.60** = neu − bisher. «Tragen Sie selbst» stimmt hier.
  3. Randfall unter CHF 5 (keine Schlussabrechnung): 3.00 → 50.00. Mit `claimed` wäre der Unterschied 50.00 − 0 = 50.00. Die 3.00 kommen aber mit der nächsten Abrechnung als Übertrag herein. Ohne Berichtigung verliert der Vermieter also **47.00** = neu − bisher. Ein weiterer Fall: −3.00 → 50.00 ergibt 53.00 und nicht 50.00.
  4. Rückerstattung → grössere Rückerstattung: Hier sinkt der Saldo, also gilt `lowers`, und «Nicht berichtigen» wird nicht angeboten. Die Frage, ob der Mieter etwas «trägt», stellt sich deshalb nicht. Bei allen Fällen, in denen «Nicht berichtigen» angeboten wird und der Unterschied grösser als 0 ist, verzichtet tatsächlich der Vermieter auf Geld. «Tragen Sie selbst» stimmt also.
- Lösung: `Betrag = Saldo neu − Saldo bisher` (die rohen gerundeten Saldi, so wie der Hinweis sie zeigt). Der Liegenschaftsverwalter kann die Zahl dann aus den beiden Beträgen im Hinweis nachrechnen. Bei einer Schlussabrechnung sind die rohen Saldi und die verlangten Beträge gleich.

## M-1: «Nicht berichtigen», obwohl der Saldo unter CHF 5 sinkt

- Beleg: `statement.service.ts:610-612`. Ein Saldo unter CHF 5 zählt dort als 0, deshalb ist 4.00 → −4.00 für die App «raises». OR Art. 257b Abs. 1 (Fedlex, Stand 1. Oktober 2026): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- Warum falsch: Wird nicht berichtigt, verrechnet die nächste Abrechnung +4.00 statt −4.00. Der Mieter bezahlt dann 8.00 mehr als die tatsächlichen Aufwendungen, und `statements_later_lowers` warnt nicht davor. Bisher sah man das nicht, weil die Seite keine Beträge zeigte. Mit #546 steht da «eine Rückerstattung von CHF 4.00 statt einer Nachzahlung von CHF 4.00», und daneben wird «Nicht berichtigen» angeboten. Die Seite widerspricht sich also sichtbar.
- Lösung (braucht einen PO-Entscheid, denn sie ändert V-30 A und den Test `statement-invoices.pg.test.ts:505`): `raises` und `lowers` vergleichen die rohen Saldi, auch unter CHF 5, weil der Übertrag später eingefordert wird. Bis zum Entscheid gilt die Regel aus V-1: Ist der Unterschied 0 oder kleiner, zeigt die Bestätigung keinen Kostensatz.

## V-3: Regeln für die übrigen Fälle fehlen

- Beleg: `tests/e2e/features/statement-detail.feature:1039-1046` hat nur ein Beispiel (Nachzahlung → Nachzahlung). Die Formulierungen der anderen Fälle sind sprachlich nicht dieselben («statt einer Rückerstattung von …», «ein ausgeglichener Saldo statt …»). Ohne eine festgelegte Regel wählt die Umsetzung sie frei.
- Lösung: Die Fälle aus der Wording-Tabelle unten kommen als Unit- oder DOM-Test auf `LaterChanges.svelte` oder auf die Auswahlfunktion, je Fall eine Zeile, und zwar mindestens: Rückerstattung → Nachzahlung (Weber), Nachzahlung → ausgeglichen, Saldo gleich (V-1), Unterschied ≤ 0 ohne Kostensatz (V-1/M-1), unter CHF 5 (V-4). Im E2E-Szenario genügt der eine Fall mit 630.35 / 187.45.

## Wording

Platzierung: Der Satz mit den Beträgen steht als eigener Absatz direkt nach `statements_later_sent` und vor `statements_later_lowers`. Danach folgt `statements_later_below_minimum`, wenn er zutrifft. In der Bestätigung steht `statements_decline_correction_difference` als erster Absatz vor `statements_decline_correction_text`, damit die Folge in Franken zuerst kommt. Alle Beträge erscheinen ohne Vorzeichen (Betrag des Saldos), die Richtung sagt das Wort. Deutsch: «statt» steht mit Genitiv («statt einer Rückerstattung», «statt eines ausgeglichenen Saldos»). Haben beide Seiten dieselbe Art, entfällt das Nomen nach «statt», wie der PO es festgelegt hat.

| key | de | fr | it | en |
|-----|----|----|----|----|
| statements_later_now_due_was_due | Neu berechnet ergibt sich für {tenant} eine Nachzahlung von CHF {now} statt CHF {before}. | Le recalcul donne pour {tenant} un montant à payer de CHF {now} au lieu de CHF {before}. | Il ricalcolo dà per {tenant} un importo dovuto di CHF {now} invece di CHF {before}. | Recalculating gives {tenant} an amount due of CHF {now} instead of CHF {before}. |
| statements_later_now_refund_was_refund | Neu berechnet ergibt sich für {tenant} eine Rückerstattung von CHF {now} statt CHF {before}. | Le recalcul donne pour {tenant} un remboursement de CHF {now} au lieu de CHF {before}. | Il ricalcolo dà per {tenant} un rimborso di CHF {now} invece di CHF {before}. | Recalculating gives {tenant} a refund of CHF {now} instead of CHF {before}. |
| statements_later_now_due_was_refund | Neu berechnet ergibt sich für {tenant} eine Nachzahlung von CHF {now} statt einer Rückerstattung von CHF {before}. | Le recalcul donne pour {tenant} un montant à payer de CHF {now} au lieu d’un remboursement de CHF {before}. | Il ricalcolo dà per {tenant} un importo dovuto di CHF {now} invece di un rimborso di CHF {before}. | Recalculating gives {tenant} an amount due of CHF {now} instead of a refund of CHF {before}. |
| statements_later_now_refund_was_due | Neu berechnet ergibt sich für {tenant} eine Rückerstattung von CHF {now} statt einer Nachzahlung von CHF {before}. | Le recalcul donne pour {tenant} un remboursement de CHF {now} au lieu d’un montant à payer de CHF {before}. | Il ricalcolo dà per {tenant} un rimborso di CHF {now} invece di un importo dovuto di CHF {before}. | Recalculating gives {tenant} a refund of CHF {now} instead of an amount due of CHF {before}. |
| statements_later_now_due_was_settled | Neu berechnet ergibt sich für {tenant} eine Nachzahlung von CHF {now} statt eines ausgeglichenen Saldos. | Le recalcul donne pour {tenant} un montant à payer de CHF {now} au lieu d’un solde nul. | Il ricalcolo dà per {tenant} un importo dovuto di CHF {now} invece di un saldo in pareggio. | Recalculating gives {tenant} an amount due of CHF {now} instead of a nil balance. |
| statements_later_now_refund_was_settled | Neu berechnet ergibt sich für {tenant} eine Rückerstattung von CHF {now} statt eines ausgeglichenen Saldos. | Le recalcul donne pour {tenant} un remboursement de CHF {now} au lieu d’un solde nul. | Il ricalcolo dà per {tenant} un rimborso di CHF {now} invece di un saldo in pareggio. | Recalculating gives {tenant} a refund of CHF {now} instead of a nil balance. |
| statements_later_now_settled_was_due | Neu berechnet ergibt sich für {tenant} ein ausgeglichener Saldo statt einer Nachzahlung von CHF {before}. | Le recalcul donne pour {tenant} un solde nul au lieu d’un montant à payer de CHF {before}. | Il ricalcolo dà per {tenant} un saldo in pareggio invece di un importo dovuto di CHF {before}. | Recalculating gives {tenant} a nil balance instead of an amount due of CHF {before}. |
| statements_later_now_settled_was_refund | Neu berechnet ergibt sich für {tenant} ein ausgeglichener Saldo statt einer Rückerstattung von CHF {before}. | Le recalcul donne pour {tenant} un solde nul au lieu d’un remboursement de CHF {before}. | Il ricalcolo dà per {tenant} un saldo in pareggio invece di un rimborso di CHF {before}. | Recalculating gives {tenant} a nil balance instead of a refund of CHF {before}. |
| statements_later_now_same | Neu berechnet bleibt der Saldo für {tenant} gleich, aber eine Position ändert sich. | Le recalcul ne change pas le solde de {tenant}, mais un poste change. | Il ricalcolo non cambia il saldo di {tenant}, ma cambia una voce. | Recalculating does not change the balance for {tenant}, but a statement line changes. |
| statements_later_below_minimum | Ein Saldo unter CHF 5.00 wird weder eingefordert noch ausbezahlt, sondern mit der nächsten Abrechnung verrechnet. | Un solde inférieur à CHF 5.00 n’est ni réclamé ni remboursé, mais reporté sur le décompte suivant. | Un saldo inferiore a CHF 5.00 non viene né richiesto né rimborsato, ma riportato nel conteggio successivo. | A balance below CHF 5.00 is neither claimed nor paid out but carried over to the next statement. |
| statements_decline_correction_difference | Den Unterschied von CHF {amount} tragen Sie selbst. | Vous supportez vous-même la différence de CHF {amount}. | La differenza di CHF {amount} la sostiene Lei. | You bear the difference of CHF {amount} yourself. |

## Nicht bestätigt

- Ob Dwello Beträge ab CHF 1'000 mit Apostroph formatiert (`formatCHF`/`formatCurrency`). Die Texte setzen das Format der bestehenden Hinweise voraus. Nicht geprüft.
- Bei einer Abrechnung, die nach #94 erledigt wurde und deren Nachzahlung unter CHF 5 erlassen ist (`paidNothing`, `statement-payment.ts:24`), wird nichts übertragen. Dort könnte die Differenz der verlangten Beträge statt der rohen Differenz (V-2) richtig sein. Ich habe nicht nachgeprüft, ob solche Abrechnungen nach #454 überhaupt «zu berichtigen» werden können.
- Issue #454 und die Begründung zu V-30 A habe ich nicht gelesen (nur die Kommentare im Code und in den Tests). Gesucht in `docs/`, `backend/src`, `gh api issues/546`.

Geprüft: OR Art. 257a/257b (Fedlex, Stand 1. Oktober 2026). Begriffe Saldo, Nachzahlung, Rückerstattung, ausgeglichen, Übertrag gemäss `UBIQUITOUS_LANGUAGE.md:184-213` und `docs/design/i18n-begriffe.md:93,105`. «Tragen Sie selbst» stimmt für alle Fälle, in denen «Nicht berichtigen» angeboten wird und der Unterschied grösser als 0 ist. Das Szenario beschreibt in Fachsprache, was der Liegenschaftsverwalter will. Seine Schritte nennen nur das Feature, das der Glossarbegriff «Nicht berichtigt» bezeichnet.
