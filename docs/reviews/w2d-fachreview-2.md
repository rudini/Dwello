# Fach-Review W2d (#79), Runde 2

Gegenstand: `git diff 355bbe6 ba593eb` im Worktree `review-w2d-fach2` (Commit ba593eb), geprüft gegen die Befunde aus `docs/reviews/w2d-fachreview-1.md`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | – | **Erledigt.** Szenario «Eine Nachzahlung unter 5 Rappen wird nicht verlangt» mit den richtigen Zahlen |
| V-2 | Verwalter | – | **Erledigt.** Die neue Formel ist für alle Rappenwerte von −2000.00 bis +2000.00 richtig, auch mit Gleitkomma-Rauschen |
| V-3 | Mietrecht | – | **Erledigt.** Migration 0013 rundet nur Entwürfe neu und leert ihr PDF; versendete und bezahlte behalten ihren Saldo |
| V-4 | Verwalter | – | **Übernommen** (PRD, Datenmodell, design-decisions, Anforderungen Z. 94 und 148, `pdf-format.ts`, Testwerte) |
| V-5 | Verwalter | – | **Übernommen** in allen vier Sprachen, gross geschriebenes «Eine» korrekt |
| V-6 | Verwalter | – | **Übernommen** (PDF: alle vier Fälle; Detailseite: Nachzahlung und kleinste Rückerstattung) |
| V-7 | Verwalter | – | **Übernommen** |
| V-8 | Verwalter | Nit | Anforderungen Z. 148: «Eine schon versendete Abrechnung behält ihren kaufmännisch gerundeten Saldo» gilt nur für Abrechnungen, die vor #79 versendet wurden |
| V-9 | Verwalter | Nit | Der neue PDF-Fall «Ausgeglichen» prüft nicht, dass der Zahlteil fehlt; die Detailseite hat keinen Fall +0.03 → 0.00 |

Kein Blocker, kein Major offen.

---

## V-1: erledigt

**Beleg:** `tests/e2e/features/statement-rounding.feature:29-35`. Nachgerechnet: (1001.00 + 4.00) × 1.03 = 1035.15 (Pauschale 30.15); 12 × 86.26 = 1035.12; Saldo +0.03 → 0.00. Der Schritt «gibt es eine Heizkostenrechnung über …» legt nur eine weitere Rechnung an (`tests/e2e/steps/statement-detail.steps.ts:66-69`). Der Titel nennt jetzt «Nachzahlung» statt «Saldo». Das ist genauer, denn nur ein positiver Saldo kann 0 werden. `@wip` ist entfernt, die Umsetzung liegt vor.

## V-2: erledigt

**Beleg:** `backend/src/services/pdf-format.ts:222`:
```ts
export const roundTo5Rappen = (amount: number) => Math.floor(Math.round(roundToRappen(amount) * 100) / 5) / 20 + 0;
```
**Nachgerechnet** (Node-Skript, Saldo als verrauschte Differenz `kosten − akonto` für jeden Rappenwert von −2000.00 bis +2000.00, verglichen mit `floor(rappen / 5) × 5`): 0 Abweichungen, nie −0, nie eine Nachzahlung über dem ungerundeten Betrag. Die Zeile «Rundung» beträgt höchstens 0.04, sie erscheint also immer (Grenze < 0.05).

Einzelwerte:
- 0.3 − 0.1 → 0.20
- 784.13 − 878 → −93.90
- +0.04 → 0
- −0.01 → −0.05
- 1035.15 − 1035.12 → 0
- 791.03 → 791.00
- −48.97 → −49.00
- 0 → 0
- 99 999 999.99 → 99 999 999.95
- NaN → NaN

Der Unit-Test `statement-pdf-data.test.ts:124-160` deckt jede Endziffer in beiden Richtungen ab, dazu Rauschen, Werte schon auf 5 Rappen (±1.15, 791.05, −48.95) und den Fall −0.

## V-3: erledigt

**Beleg:** `backend/migrations/0013_statement_balance_tenant_favour.sql:7-9`. In PostgreSQL nachgerechnet, `floor(v*20)/20` auf `numeric(12,2)`:
- 791.03 → 791.00
- −48.97 → −49.00
- −0.01 → −0.05
- 0.03 → 0.00
- 791.05, −48.95 und −0.05 bleiben

Die Formel stimmt mit der App überein, denn `total_costs` und `total_advance_payments` sind dieselben auf Rappen gerundeten Werte, aus denen `calculateBalance` rechnet (`calculation.service.ts:392-403`, `:246`). Gespeichert sind sie als DECIMAL(12,2) (`0001_schema.sql:237-248`). Es gibt nur die Status `draft`, `sent` und `paid` (`0001_schema.sql`, `statements_status_check`), «Überfällig» wird abgeleitet. Die Bedingung `status = 'draft'` erfasst also genau die Abrechnungen, die dem Mieter noch nicht zugegangen sind. Das gecachte PDF wird geleert und mit dem neuen Saldo neu erzeugt. Die QR-Referenz hängt nicht vom Betrag ab. Ein Entwurf, der 0.00 wird, erhält beim Versenden keinen Zahlteil (`pdf.service.ts:906`). Der Test `migrations.pg.test.ts:89-123` prüft alle Fälle: Nachzahlung, Rückerstattung, +0.05 → 0.00, 0.00 → −0.05, unverändert mit PDF, sent, paid. Damit ist Art. 257b Abs. 1 OR («die tatsächlichen Aufwendungen des Vermieters», Zitat aus Runde 1) auch für bestehende Entwürfe eingehalten.

## V-4: übernommen

`docs/PRD-Dwello.md:480`, `docs/data-model.md:266`, `docs/design/design-decisions.md:51` (neue Zeile #79, die Zeile «Session 12» bleibt als Verlauf), `docs/nebenkostenabrechnung-anforderungen.md:94` und `:148`, `backend/src/services/pdf-format.ts:220-221`. Die neuen Werte in `statement-generation.pg.test.ts` sind die aus Runde 1: 133.00, 364.45, 351.50, 307.80. Auch beim Mieterwechsel stimmen sie: 133.03 → 133.00 und 364.47 → 364.45.

Weitere Treffer für «kaufmännisch»/«commercially» sind richtig:
- Rundung auf Rappen: `pdf-format.ts:16`, `statement-pdf-data.test.ts:95`
- Heizprofil-Monate: `heating-profile.service.ts:366`
- ausdrücklich als vor #79 markiert: `statement-pages.dom.test.ts:610`, `statement-pdf-render.test.ts:32`
- ein früherer Persona-Bericht als Verlauf: `docs/design/personas/weber-f2.md:17`

## V-5: übernommen

`messages/{de,fr,it,en}.json:105` folgen wörtlich dem Vorschlag. Nach dem Doppelpunkt folgt in de ein vollständiger Satz, darum ist «Eine» gross richtig. fr, it und en schreiben klein, wie in diesen Sprachen üblich. `help-page.dom.test.ts:47-49` prüft den vollen Satz.

## V-6: übernommen

Im PDF (`statement-pdf-render.test.ts:96-105`):
- 184.13 → «– 0.03 Nachzahlung 184.10»
- 93.87 → «+ 0.03 Rückerstattung 93.90»
- 0.01 → «+ 0.04 Rückerstattung 0.05»
- 0.03 → «– 0.03 Ausgeglichen 0.00»

Die Salden kommen aus `calculateBalance`, nicht von Hand. Auf der Detailseite (`statement-pages.dom.test.ts:629-641`): Nachzahlung «− CHF 0.03» und kleinste Rückerstattung «+ CHF 0.04». Die Vorzeichen stimmen mit `UBIQUITOUS_LANGUAGE.md:157` überein. Die alten Testdaten tragen einen Kommentar, dass sie vor #79 gerundet wurden. Rest siehe V-9.

## V-7: übernommen

`statement-rounding.feature:15-16` nennt den Rechenweg aller drei Beispiele, `:29` den des neuen Szenarios.

## V-8 (Nit): «schon versendete» ist zu weit gefasst

**Beleg:** `docs/nebenkostenabrechnung-anforderungen.md:148`: «Eine schon versendete Abrechnung behält ihren kaufmännisch gerundeten Saldo; Entwürfe wurden neu gerundet.»
**Warum:** Eine Abrechnung, die nach #79 erstellt und versendet wird, ist nicht kaufmännisch gerundet. Der Satz liest sich, als ob jede versendete Abrechnung kaufmännisch gerundet wäre.
**Behebung:** «Eine vor #79 versendete Abrechnung behält ihren kaufmännisch gerundeten Saldo; Entwürfe wurden mit der Umstellung neu gerundet.»

## V-9 (Nit): Ausgeglichen ohne Zahlteil nicht ausdrücklich geprüft

**Beleg:** `statement-pdf-render.test.ts:103-104` prüft nur den Text «Ausgeglichen 0.00». `statement-pages.dom.test.ts` hat keinen Fall mit Saldo 0 nach Rundung von +0.03.
**Warum:** Das Verhalten stimmt, denn `pdf.service.ts:906` (`balance <= 0` → kein QR) ist unverändert und alt. Belegt ist es für diesen neuen Weg aber nicht. Es ist der Fall, den Mieter neu erhalten.
**Behebung:** Im Fall `evened` zusätzlich `expect(...).not.toContain('Zahlteil')` und den Text `balancedRounded` prüfen. Auf der Detailseite einen Fall `{ totalCosts: 600.03, totalAdvancePayments: 600, balance: 0 }` mit «Nachzahlung vor Rundung CHF 0.03 Rundung auf 5 Rappen − CHF 0.03».

---

## Fehlende Begriffe

Keine. Saldo, Nachzahlung, Rückerstattung, Akonto, Verwaltungspauschale, Entwurf, Ausgeglichen und Zahlteil stehen alle in `UBIQUITOUS_LANGUAGE.md`.

## Nicht bestätigt

- **Tests nicht selbst ausgeführt:** `bun test` im Worktree braucht `node_modules`, das auf den Arbeitsbaum des Aufrufers (`/home/user/Dwello`) verweist. Der Zugriff wurde verweigert. Die Formel habe ich unabhängig in Node nachgerechnet und die SQL-Formel direkt in PostgreSQL. Ob `migrations.pg.test.ts`, `statement-pdf-*.test.ts` und die DOM-Tests grün sind, habe ich nicht gesehen.
- **E2E-Szenario nicht ausgeführt:** Ob es die Vorschau mit «Ausgeglichen CHF 0.00» anzeigt, habe ich nur aus dem Code und `tests/e2e/questions/amounts.ts` (Runde 1) abgeleitet.
- Die Punkte «Bagatellgrenze für alte Abrechnungen» und «Pflicht zur 5-Rappen-Rundung» aus Runde 1 bleiben **unsicher**. Neue Fedlex-Quellen habe ich nicht gesucht, an #79 ändert sich dadurch nichts.
