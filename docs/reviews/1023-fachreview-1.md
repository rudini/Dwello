# Fachreview 1023-1: «Nicht berichtigen» vergleicht die rohen Saldi (Szenario vor der Umsetzung)

Gegenstand: `tests/e2e/features/statement-minimum-balance.feature:237-249` (Commit fc923d9), Entscheid #1023 (PO 2026-11-02, Option 1).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Der Backend-Test `statement-invoices.pg.test.ts:540-566` («erlaubt «Nicht berichtigen», wenn beide Saldi unter CHF 5 liegen», 4.00 → 3.00) legt V-30 A fest und widerspricht #1023. Unter dem Entscheid sinkt der Saldo dort. |
| V-2 | Verwalter | Minor | `docs/api-specification.md:302` sagt noch «below CHF 5 counts as 0, but in a Schlussabrechnung», ebenso der Kommentar `statement.service.ts:609`. Fix: «the recalculation does not lower the raw Saldo (#1023)». |
| V-3 | Verwalter | Minor | Der Szenariotitel «Sinkt ein Saldo unter CHF 5» heisst wörtlich «fällt unter CHF 5». Das ging schon unter V-30 A (z. B. 10.00 → 3.00 sinkt). Geprüft wird aber 3.00 → −3.00, beide Seiten unter CHF 5. Fix: «Sinkt ein Saldo unter CHF 5 weiter, bietet die Abrechnung «Nicht berichtigen» nicht an». |
| M-1 | Mietrecht | Minor | Für eine Altabrechnung, deren Nachzahlung nach #94 erlassen wurde (`statement-payment.ts:25-32`: bezahlt mit 0.00, Saldo ≥ 0, unter CHF 5), ist der verlangte Betrag 0 und nicht der rohe Saldo. Unter dem neuen Vergleich gilt z. B. 3.00 (erlassen) → 2.00 als «sinkt». Dann fehlt «Nicht berichtigen», und der Satz «sonst verlangen Sie mehr als die tatsächlichen Kosten» stimmt nicht. Fix: Für `before` gilt bei einer so erlassenen Nachzahlung 0, sonst der rohe Saldo. Pin-Test in `statement-invoices.pg.test.ts`. |

## V-1: Backend-Test, der V-30 A festlegt

- Beleg: `backend/src/__tests__/statement-invoices.pg.test.ts:540-542` mit dem Kommentar «a Saldo below CHF 5 counts as 0» und der Erwartung `{ correctionDue: true, correctionDeclinable: true, correctionLowers: false }` (Saldo 4.00, neu 3.00). Der Code dazu ist `statement.service.ts:609-611` (`claimed`).
- Warum falsch: #1023 ersetzt V-30 A. Wird nicht berichtigt, verrechnet die nächste Abrechnung einen Übertrag von 4.00 statt 3.00. Der Mieter bezahlt dann 1.00 mehr als die tatsächlichen Aufwendungen. OR Art. 257b Abs. 1 (Fedlex, Stand 1. Oktober 2026): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- Was es behebt:
  - Den Test im selben Schritt wie den Code umkehren: `correctionDeclinable: false`, `correctionLowers: true`, Titel z. B. «verweigert «Nicht berichtigen», wenn ein Saldo unter CHF 5 weiter sinkt», Kommentar mit Verweis auf #1023.
  - Das ist eine Teständerung, keine Änderung eines Szenarios. Der PR nennt #1023 als Grund.
  - `claimed` entfällt. `before`/`after` sind dann `Number(statement.balance)` und `Number(now.balance)`. Zur Ausnahme für Altabrechnungen siehe M-1.

## Nachrechnung

| Fall | bisher (V-30 A) | nach #1023 | richtig? |
|------|-----------------|------------|----------|
| Szenario: 1'197 + 6 = 1'203 − 1'200 = +3.00; ohne die 6.00: 1'197 − 1'200 = −3.00 | 0 → 0: Angebot ja, `declineCosts` null | sinkt: kein Angebot | ja. Ohne Berichtigung +3 statt −3, der Mieter bezahlt 6.00 zu viel |
| −3.00 → +3.00 | Angebot, Unterschied 6.00 | Angebot, Unterschied 6.00 (`difference` war schon roh) | ja. Der Vermieter verliert 6.00 |
| 0.00 → −3.00 | 0 → 0: Angebot | sinkt: kein Angebot | ja. Sonst geht die Rückerstattung von 3.00 verloren |
| 4.00 → 3.00 (V-1) | Angebot | sinkt: kein Angebot | ja |
| Schlussabrechnung | roh | roh | unverändert |

`declineCosts` (`statement.service.ts:617`) braucht nach dem Wechsel auf rohe Saldi keine eigene Änderung. `after >= before && difference > 0` heisst dann einfach `difference > 0`. Der Satz «Den Unterschied von CHF {amount} tragen Sie selbst.» stimmt mit dem Übertrag in allen vier Sprachen (`messages/*.json:1362`).

Zum erwarteten Satz: Die Seite zeigt dann
- «… eine Rückerstattung von CHF 3.00 statt einer Nachzahlung von CHF 3.00. Ein Saldo unter CHF 5.00 wird weder eingefordert noch ausbezahlt, sondern mit der nächsten Abrechnung verrechnet.» und darunter
- `statements_later_lowers`: «… Berichtigen Sie die Abrechnung, sonst verlangen Sie mehr als die tatsächlichen Kosten.»

Die beiden Sätze widersprechen sich nicht: Der verrechnete Saldo wird mit der nächsten Abrechnung eben doch verlangt. `statements_later_below_minimum`, `statements_later_lowers`, `statements_decline_correction_text` und `statements_decline_correction_difference` brauchen in de/fr/it/en keine Änderung.

Geprüft: Beträge im Szenariokommentar (1'197.00 + 6.00 = 1'203.00 − Akonto 12 × 100.00 = 3.00 bzw. −3.00, passt zum rot gesehenen Lauf); Begriffe Saldo, Übertrag, Nachzahlung, Rückerstattung, Akonto, Nebenkosten, «Nicht berichtigen» (`UBIQUITOUS_LANGUAGE.md:184, 190-191, 199, 201`; Zeile 199 «sinkt der Saldo dabei nicht» passt schon zu #1023); `correctionDeclinable`/`correctionLowers` und `declineCorrection` (`statement-invoices.service.ts:135-150`) folgen `recalculation()`, keine eigene Änderung nötig; die Szenarien ohne `@wip` mit «Nicht berichtigen» (`dashboard.feature:198-206`, `statement-detail.feature:1128-1147`) haben Saldi über CHF 5 und bleiben gültig.

## Nicht bestätigt

- M-1: Ob eine unter #94 im PDF mitgeteilte erlassene Nachzahlung ein bindender Erlass nach Art. 115 OR ist, ist **unsicher**. Wortlaut (Fedlex, Stand 1. Oktober 2026): «Eine Forderung kann durch Übereinkunft ganz oder zum Teil auch dann formlos aufgehoben werden, …». Es braucht eine Übereinkunft, und ob das stillschweigende Annehmen des Mieters genügt, habe ich nicht belegt. Auch ohne diese Frage stimmt der Satz «sonst verlangen Sie mehr» dort nicht. Vorbestehend und unverändert: Bei derselben Altabrechnung und einem steigenden Saldo (3.00 erlassen → 6.00) zeigt `declineCosts` 3.00 statt 6.00. Gesucht in `statement-payment.ts`, `statement-pdf.service.ts:179` und `docs/nebenkostenabrechnung-anforderungen.md:152`.
