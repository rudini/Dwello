# Fach-Review W2d (#79, F-17c): Saldo zugunsten des Mieters auf 5 Rappen

Gegenstand: `tests/e2e/features/statement-rounding.feature` im Commit 355bbe6 (Worktree `review-w2d-fach`) und die geplante Umsetzung (Punkte 1–4 des Auftrags).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Kein Beispiel für einen Saldo von +0.01 bis +0.04, der neu 0.00 wird (V-15). Das ist die eigentliche Verhaltensänderung |
| V-2 | Verwalter | Major | Ein einfaches `Math.floor(betrag * 20)` rundet bei Gleitkomma-Rauschen um 5 Rappen falsch; dann fehlt auch die Zeile «Rundung» |
| V-3 | Mietrecht | Major | Entwürfe behalten die alte kaufmännische Rundung und können nach der Änderung mit bis zu 2 Rappen zulasten des Mieters versendet werden |
| V-4 | Verwalter | Minor | Neben den Zeilen 94 und 148 stehen «kaufmännisch» auch im PRD, im Datenmodell, in design-decisions und in Code-Kommentaren |
| V-5 | Verwalter | Minor | Der Hilfetext sagt nur «zugunsten des Mieters», aber nicht in welche Richtung. Für Laien zu knapp |
| V-6 | Verwalter | Minor | Für PDF und Detailseite gibt es keinen Test nach der neuen Rundungsrichtung; die bestehenden Testdaten zeigen nur die alte Regel |
| V-7 | Verwalter | Nit | Das Szenario hat keinen Rechenweg pro Beispiel; «85.92» als Akonto wirkt ohne Erklärung willkürlich |

Bestätigt (kein Befund): Szenariotitel und Erzählung, die drei Beispielwerte, Punkt 2 für versendete Abrechnungen, die Herleitung der Zeile «Rundung» in PDF und Detailseite, der Zahlteil, die Übersetzungsbegriffe, der neue Text in Zeile 148 (Punkt 4). Siehe «Bestätigt».

---

## V-1 (Major): Beispiel «Saldo +0.01 bis +0.04 wird 0.00» fehlt

**Beleg:** Kommentar im Issue #79 (V-15): «a Saldo of +0.01 to +0.04 becomes 0.00 (no payment, no payment part)». `UBIQUITOUS_LANGUAGE.md:156`: «Saldo 0.00: keine Zahlung, kein Zahlteil». Das Szenario `statement-rounding.feature:23-27` zeigt nur das Abrunden einer Nachzahlung (791.03 → 791.00), das Aufrunden einer Rückerstattung (−48.97 → −49.00) und eine Mini-Rückerstattung (−0.01 → −0.05).

**Warum falsch:** Bisher wurde ein Saldo von +0.03 zu einer Nachzahlung von 0.05 mit Zahlteil. Neu ist er «Ausgeglichen»: Die Abrechnung gilt beim Versenden als bezahlt (`statement.service.ts:484-485`), und das PDF zeigt `balancedRounded`. Genau diesen Fall, den der Mieter sieht, prüft kein Beispiel.

**Behebung:** Ein eigenes Szenario. Mit 1031.03 geht es nicht: Ein Jahres-Akonto aus 2-stelligen Monatsbeträgen ist ein Vielfaches von 0.12, und das trifft 1030.99–1031.02 nicht. Nachgerechnet geht:
```
Szenario: Ein Saldo unter 5 Rappen wird nicht verlangt
  Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "4" Franken für 2024
  Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken mit "86.26" Franken Akonto
  Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 3 % Verwaltungspauschale öffnet
  Dann kostet die Abrechnung von "Anna Keller" "CHF 1’035.15"
  Und beträgt der Saldo von "Anna Keller" "Ausgeglichen CHF 0.00"
```
Rechnung: (1001 + 4) × 1.03 = 1035.15; 12 × 86.26 = 1035.12; Saldo +0.03 → 0.00. `signedFrancs("Ausgeglichen CHF 0.00")` ergibt 0 (`tests/e2e/questions/amounts.ts:8`). Der Hinweis im PDF und der fehlende Zahlteil gehören auf eine tiefere Testebene (V-6).

## V-2 (Major): Abrunden ohne Schutz vor Gleitkomma-Rauschen

**Beleg:** Laut Plan wird ein positiver Saldo auf 5 Rappen abgerundet, ein negativer ebenfalls (also betragsmässig grösser). `calculateBalance(totalCosts, totalAdvancePayments)` übergibt die rohe Differenz (`calculation.service.ts:252-253`). Nachgerechnet mit Node:
- `0.3 - 0.1` = 0.19999999999999998; `Math.floor(x*20)/20` = **0.15** statt 0.20.
- `1031.03 - 1080` = −48.97000000000003 (das ergibt zufällig richtig −49.00); `1031.03 - 1031.04` = −0.0099999999999909 → −0.05 (richtig).
- Mit `Math.floor(Number((x*20).toPrecision(12)))/20` sind alle Rappenwerte von −1000.00 bis +1000.00 richtig, auch 0.3−0.1 → 0.20.

**Warum falsch:** Ein Saldo, der schon auf 5 Rappen steht, würde um weitere 5 Rappen abgerundet. Die Zeile «Rundung» wäre dann 0.05; PDF und Detailseite zeigen sie nur unter 0.05 (`pdf.service.ts:557`, `CostTable.svelte:17`). Die Rechnung in der Abrechnung ginge nicht mehr auf.

**Behebung:** Zuerst auf Rappen runden, dann mit Präzision abrunden, z. B. `Math.floor(Number((roundToRappen(amount) * 20).toPrecision(12))) / 20 + 0`. Der Unit-Test enthält einen verrauschten Wert (`roundTo5Rappen(0.3 - 0.1)` = 0.2) und einen Saldo, der schon auf 5 Rappen steht (10.05 bleibt 10.05, −48.95 bleibt −48.95). `Math.floor` für einen negativen Wert ist richtig: −979.4 → −980, also −49.00. Ein −0 entsteht nicht: Ein negativer Saldo ergibt mindestens −0.05.

## V-3 (Major): Gespeicherte Entwürfe behalten die alte Rundung

**Beleg:** Punkt 2 des Plans: «existing statements (draft or sent) keep their stored balance … A draft gets the new rounding only when the landlord generates it again». `UBIQUITOUS_LANGUAGE.md:157`: «Gerundet wird nur zugunsten des Mieters». Art. 257b Abs. 1 OR (Fedlex, SR 220, Stand 1.1.2026): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …».

**Warum falsch:** Ein Entwurf ist dem Mieter noch nicht zugegangen. Wird er nach der Änderung versendet, verlangt die Abrechnung bis zu 2 Rappen mehr als die Kosten, etwa 791.03 → 791.05. Das widerspricht der entschiedenen Regel und genau dem Grund für #79 (Art. 257b Abs. 1 OR). Der Vermieter erfährt nirgends, dass er den Entwurf neu erstellen muss.

**Behebung:** Eine neue Migration nur für Entwürfe: `UPDATE utility_statements SET balance = floor((total_costs - total_advance_payments) * 20) / 20 WHERE status = 'draft'`. Mit `numeric` in PostgreSQL ist das exakt, `floor` rundet auch negative Werte richtig. Alle anderen Felder des Entwurfs bleiben, PDF und QR-Rechnung lesen den neuen Saldo. Dazu ein `*.pg.test.ts`: Ein Entwurf mit 791.05 hat danach 791.00, ein versendeter behält 791.05. Soll es ohne Migration gehen, entscheidet das der Produktverantwortliche (Issue mit Label `entscheiden`).

Versendete, bezahlte und überfällige Abrechnungen behalten ihren Saldo: siehe «Bestätigt».

## V-4 (Minor): Weitere Stellen mit «kaufmännisch»

**Beleg:**
- `docs/PRD-Dwello.md:480`: «rounded commercially to 5 Rappen»
- `docs/data-model.md:266`: «Saldo, commercially to 5 Rappen»
- `docs/design/design-decisions.md:50`: Zeile «Session 12», mit «rounding against the tenant is an open point»
- `backend/src/services/pdf-format.ts:18`: «commercially to 5 Rappen; a refund the same way as a payment»
- Tests, deren Werte sich ändern: `backend/src/__tests__/statement-pdf-data.test.ts:102-120`, `:123-124` (791.05 → 791.00, −48.95 → −49.00), `backend/src/__tests__/statement-generation.pg.test.ts:242-243, 263, 314, 334`

**Warum falsch:** Nach der Änderung beschreiben diese Stellen eine Regel, die nicht mehr gilt.

**Behebung:** Diese Stellen gleich mitändern. In `design-decisions.md` eine neue Zeile für #79 einfügen, die Zeile «Session 12» bleibt als Verlauf. Zeile 148 der Anforderungen ergänzen: «Ein Saldo von +0.01 bis +0.04 wird 0.00 (keine Zahlung, kein Zahlteil). Vor #79 erstellte und versendete Abrechnungen behalten ihre kaufmännische Rundung.» In Zeile 94 «ist kaufmännisch auf 5 Rappen gerundet» durch «ist zugunsten des Mieters auf 5 Rappen gerundet (Nachzahlung ab-, Rückerstattung aufgerundet)» ersetzen.

Neue Werte in `statement-generation.pg.test.ts` (Mieterwechsel unter dem Jahr, Nachzahlungen): 133.03 → 133.00 (bisher 133.05), 364.47 → 364.45 (gleich), 351.54 → 351.50 (bisher 351.55), 307.84 → 307.80 (bisher 307.85).

## V-5 (Minor): Hilfetext ohne Richtung

**Beleg:** `messages/de.json:105` «… minus seine geleisteten Akontobeiträge, auf 5 Rappen gerundet.» Geplant ist nur die Ergänzung «zugunsten des Mieters». Laut CLAUDE.md («Design-Regeln») sind die Nutzer Laien, die Begriffe werden direkt am Feld erklärt.

**Warum unklar:** «Zugunsten» allein lässt offen, was mit einer Rückerstattung passiert. Das Glossar (`UBIQUITOUS_LANGUAGE.md:157`) nennt die Richtung ausdrücklich.

**Behebung (Wortlaut):**
- de: «…, auf 5 Rappen gerundet, nur zugunsten des Mieters: eine Nachzahlung wird ab-, eine Rückerstattung aufgerundet.»
- fr: «…, arrondie à 5 centimes, uniquement en faveur du locataire : un montant à payer est arrondi vers le bas, un remboursement vers le haut.»
- it: «…, arrotondata a 5 centesimi, solo a favore dell’inquilino: un importo dovuto è arrotondato per difetto, un rimborso per eccesso.»
- en: «…, rounded to 5 centimes, only in the tenant’s favour: an amount due is rounded down, a refund up.»

Die Begriffe stimmen mit `docs/design/i18n-begriffe.md:20` und `:63` überein (locataire/inquilino/tenant; montant à payer/importo dovuto/amount due; remboursement/rimborso/refund). Britisch «favour» passt zu `en.json` («categorised», «recognise»). Nicht vergessen: `src/__tests__/help-page.dom.test.ts:47` liest den Text.

## V-6 (Minor): PDF und Detailseite nicht nach der neuen Regel getestet

**Beleg:** `statement-pdf-render.test.ts:90-100` und `statement-pages.dom.test.ts:613-621` zeigen nur die alte Regel: 184.13 → «+ 0.02 Nachzahlung 184.15», −93.87 → «– 0.02 Rückerstattung 93.85». Nach #79 entsteht keiner dieser Fälle mehr neu.

**Warum:** Die Herleitung ist richtig (siehe «Bestätigt»), aber kein Test belegt die Vorzeichen nach der neuen Regel.

**Behebung:** Die alten Testdaten bleiben und gelten als Abrechnung von vor #79, ein Kommentar sagt das. Neue Fälle dazu:
- Nachzahlung: 791.03 → «Nachzahlung vor Rundung 791.03 Rundung auf 5 Rappen – 0.03 Nachzahlung 791.00»
- Rückerstattung: −48.97 → «… + 0.03 Rückerstattung 49.00»
- Kleinster Fall: −0.01 → «+ 0.04 Rückerstattung 0.05»
- Ausgeglichen: +0.03 → «Nachzahlung vor Rundung 0.03 Rundung auf 5 Rappen – 0.03 Ausgeglichen 0.00», mit `balancedRounded` und ohne Zahlteil

## V-7 (Nit): Rechenweg im Szenario

**Beleg:** `statement-rounding.feature:15` nennt nur «1001.00 + 3 % = 1031.03».

**Behebung:** Den Kommentar ergänzen: «Akonto 12 × 20 = 240.00 → 791.03 → 791.00; 12 × 90 = 1080.00 → −48.97 → −49.00; 12 × 85.92 = 1031.04 → −0.01 → −0.05». Dann sieht man, warum es 85.92 ist. «Nie mehr bezahlt als die tatsächlichen Kosten» (Zeile 6) passt inhaltlich zu Art. 257b Abs. 1 OR («tatsächlichen Aufwendungen»).

---

## Bestätigt

- **Formel nachgerechnet:**
  - 1001 × 1.03 = 1031.03.
  - Nachzahlung: 1031.03 − 240.00 = 791.03 → 791.00 (Rundung −0.03).
  - Rückerstattung: 1031.03 − 1080.00 = −48.97 → −49.00 (Rundung +0.03 vom Betrag aus).
  - Grenzfall Rückerstattung: 1031.03 − 1031.04 = −0.01 → −0.05 (+0.04, das Maximum von «höchstens 4 Rappen»).
  - Grenzfall null: Saldo 0.00 → 0.00; +0.03 → 0.00; Saldo schon auf 5 Rappen, z. B. 0.05 oder −48.95: bleibt.
  - Mieterwechsel unter dem Jahr: siehe V-4. Jeder Mietvertrag wird für sich gerundet; zwei Mieter derselben Wohnung können zusammen bis 8 Rappen weniger zahlen bzw. mehr zurückerhalten. Das ist für den Vermieter vertretbar.
- **Zeile «Rundung» in PDF und Detailseite** (`pdf.service.ts:555-558`, `CostTable.svelte:14-20`): Die Differenz liegt neu bei höchstens 0.04 (in Node: |−0.05 − (−0.01)| = 0.04000000000000001 < 0.05). Die Zeile erscheint also. Die Vorzeichen stimmen mit `UBIQUITOUS_LANGUAGE.md:157` überein: Nachzahlung «–», wachsende Rückerstattung «+». Abrechnungen nach alter Regel (höchstens 0.02) werden weiter richtig hergeleitet. Die Herleitung muss sich nicht ändern.
- **Saldo 0 ohne Zahlteil:** `pdf.service.ts:906` (`balance <= 0` → kein QR), `qr-bill.service.ts:337-338`, die Erledigung beim Versenden in `statement.service.ts:484-485`. Der Text `balancedRounded` («Nach der Rundung auf 5 Rappen müssen Sie nichts bezahlen und erhalten nichts zurück.») passt auf +0.01 bis +0.04. Aus einem negativen Saldo wird nie 0.
- **Vorschau und Erstellung** rechnen gleich: Beide laufen über `calculateStatementForContract` → `calculateBalance` (`calculation.service.ts:403`, `statement.service.ts:306/319`). Das Szenario über die Vorschau prüft also auch die Erstellung.
- **Punkt 2, versendete Abrechnungen:** Sie behalten ihren Saldo, das ist richtig. Der Mieter hat das PDF mit diesem Betrag und dem QR-Zahlteil erhalten, das PDF wird aus den gespeicherten Daten neu erzeugt, und `paidAmount` übernimmt den Saldo (`statement.service.ts:492`). Eine nachträgliche Änderung würde einen Beleg verändern, den der Mieter einsehen kann. Art. 257b Abs. 2 OR: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» Art. 8 Abs. 2 VMWG: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen …». Eine Korrektur läuft über die «Berichtigte Abrechnung» (`UBIQUITOUS_LANGUAGE.md:161`, geplant #120), nicht über eine stille Neuberechnung.
- **Rückerstattung aufrunden:** Der Vermieter zahlt bis 4 Rappen mehr zurück. Mietrechtlich ist das unbedenklich, Art. 257b Abs. 1 OR begrenzt nur nach oben, was der Mieter trägt. In der Praxis ist es üblich und für den Mieter nachvollziehbar.
- **Verwaltungspauschale bleibt auf den Rappen genau:** Das Szenario prüft «kostet CHF 1’031.03». Art. 4 Abs. 3 VMWG: «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.» Die Rundung betrifft nur den Saldo.
- **Punkt 4, neuer Wortlaut für Zeile 148:** stimmt mit dem Glossar überein, Ergänzungen siehe V-4.
- **Begriffe im Szenario** (Saldo, Nachzahlung, Rückerstattung, Akonto, Verwaltungspauschale, Liegenschaftsverwalter): stehen alle in `UBIQUITOUS_LANGUAGE.md`. Kein Begriff fehlt, kein neuer Begriff nötig.

## Nicht bestätigt

- **Bagatellgrenze für alte Abrechnungen** (bis 2 Rappen zulasten des Mieters, versendet vor #79): ob das als geringfügig gilt und keine Berichtigung braucht, ist **unsicher**. Auf Fedlex (OR Art. 257a–257b, VMWG Art. 4–8) steht dazu nichts. `mmx search` lieferte nur Ratgeberseiten. Meine Empfehlung «keine Neuberechnung» stützt sich auf den Belegcharakter (siehe «Bestätigt»), nicht auf eine Bagatellnorm.
- **Pflicht, auf 5 Rappen zu runden:** Ich habe keine Fedlex-Norm gefunden. `mmx search` ergab nur Praxisquellen (SNB-Münzseite, Bankenombudsman zu Kreditkartenrechnungen). Die Aussage in `docs/nebenkostenabrechnung-anforderungen.md:94` («nicht vorgeschrieben (nicht recherchiert)») bleibt **unsicher**. Für #79 spielt das keine Rolle: Option B rundet nie zulasten des Mieters.
- **Wortlaut der Gesetzestexte:** OR aus der Fedlex-Datei `eli/cc/27/317_321_377/20260101/de`, VMWG aus `eli/cc/1990/835_835_835/20251001/de`. Die Fedlex-Webseite selbst lädt ohne JavaScript nicht, die Zitate stammen aus diesen HTML-Dateien.
- **Ob ein Entwurf beim erneuten Erstellen ersetzt wird** (Punkt 2, «generates it again»): nicht geprüft. Von diesem Ablauf hängt ab, ob die Lösung ohne Migration für den Vermieter überhaupt sichtbar ist (V-3).
