# Fachreview #509, Runde 1 (Commit 6cfaf87, vor der Umsetzung)

Gegenstand: roter Test `backend/src/__tests__/statement-pdf-render.test.ts:724-738`, @wip-Szenario `tests/e2e/features/statement-detail.feature:258-273`, geplante Textänderung (Punkte 1–3 des Auftrags).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Major | Die Bedingung «keine Rechnung ohne Leistungszeitraum» reicht nicht. Eine zweite Heizkostenposition ohne Rechnungszeilen (andere Kategorie oder anderer Verteilschlüssel) teilt nach dem Anteil des Abrechnungslaufs. Fällt der Prozentwert weg, kann der Mieter ihren Zeitanteil nicht mehr nachrechnen. |
| V-1 | Verwalter | Major | Die fr-Erwartungen enthalten ` `, die Hilfsfunktion `readPdf` macht aber jedes geschützte Leerzeichen zu einem normalen. Die fr-Zeile kann deshalb nie grün werden. Die Prüfungen `not.toContain('52.00 %')` (alle Sprachen) und `'Parts des mois de votre bail :'` prüfen nichts. |
| V-2 | Verwalter | Minor | Das Szenario prüft Punkt 2 nicht: Es fehlt `Und steht im PDF nicht "Anteile der Monate Ihres Mietverhältnisses:"` (der Doppelpunkt direkt nach dem Wort, damit die Rechnungszeile «… Mietverhältnisses darin:» nicht trifft). |
| V-3 | Verwalter | Minor | Die Testdaten lassen sich nicht nachrechnen. Das PDF druckt «(1'000.00 × 0.00 % + 1'000.00 × 40.00 %) / 2'000.00 = 520.00», richtig wäre 400.00. Der Zeitanteil 26.00 % müsste 20.00 % sein. Fix: im neuen Test `periodShare: 0.2, tenantShare: 400` setzen (`statement-pdf-render.test.ts:732`). |
| V-4 | Verwalter | Minor | fr/it: Nach dem Doppelpunkt beginnt der Satz neu mit einem Grossbuchstaben («: Pour une facture», «: Per una fattura»). In fr und it schreibt man nach einem Doppelpunkt klein. Fix: eigener Textschlüssel mit «pour une facture …» und «per una fattura …» (de: Grossschreibung nach Doppelpunkt vor ganzem Satz zulässig; en: zulässig). |

## M-1 (Major): Anteil des Laufs fällt weg, obwohl eine andere Position ihn braucht

**Beleg.**
- Die Rechnungen werden nach Kategorie und Verteilschlüssel gruppiert: `backend/src/services/calculation.service.ts:121`, Schlüssel `` `${categoryId}-${distributionKeyId}` ``.
- Eine Heizkostengruppe, deren Rechnungen alle die Daten der Periode haben (ohne Leistungszeitraum, oder mit Leistungszeitraum 01.01.–31.12.), teilt nach dem Anteil des Laufs und hat keine Rechnungszeilen: `calculation.service.ts:216`. Dort steht: `if (heating && !ownDays) return { …, periodShare: heating.percentage / 100, shareDays: noDays }`.
- Im PDF ist sie trotzdem `byProfile` (`statement-pdf.service.ts:91`), und ihr Zeitanteil ist der Prozentwert des Laufs (`pdf.service.ts:684`).
- Ein häufiger Fall aus der Praxis: Heizung (Fernwärme, Quartalsrechnungen mit Leistungszeitraum) und Warmwasser oder Heizungsservice/Kaminfeger (Jahresrechnung ohne Leistungszeitraum) als getrennte Kategorien.

**Warum falsch.**
- Laut Plan, Punkte 1 und 2, entfallen dann sowohl der Prozentwert des Laufs als auch die Monatszeile.
- Die zweite Position zeigt in der Spalte «Zeitanteil» z. B. 82.00 %, aber das PDF erklärt nirgends, woher diese Zahl kommt.
- Art. 8 Abs. 1 VMWG verlangt eine «detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten». Den Wortlaut habe ich wie in `docs/reviews/451-fachreview-1.md:54` übernommen; heute war Fedlex nicht abrufbar, siehe «Nicht bestätigt». Der Anteil wäre ohne den Prozentwert nicht mehr nachrechenbar.
- Heute leistet das die Monatszeile mit der Teilung «{tenant} % / {period} % = {percent} %» (`heatingPeriodMonths`).

**Fix.**
- Kurzform (nur der zweite Satz, ohne Monatszeile) nur dann, wenn jede `byProfile`-Position Rechnungszeilen hat (`invoiceParts`) und keine Zeile `noPeriod` ist.
- Sobald eine `byProfile`-Position ohne `invoiceParts` vorkommt oder eine Rechnung ohne Leistungszeitraum: Text und Monatszeile wie heute.
- Dazu ein Test mit zwei Heizkostenpositionen: Position A mit Rechnungszeilen, alle mit Leistungszeitraum, Position B ohne Rechnungszeilen. Erwartet: der Prozentwert und die Monatszeile bleiben.
- Hinweis zur Formulierung für diesen Mischfall: Heute heisst es «{percent} % für eine Rechnung ohne Leistungszeitraum». Für Position B mit einem Leistungszeitraum über die ganze Periode stimmt das nicht genau. Das bestand schon vor der Änderung und wird durch sie nicht sichtbarer, deshalb hier kein Befund.

## V-1 (Major): fr-Zeile des Tests bleibt immer rot, Negativprüfungen prüfen nichts

**Beleg.**
- `backend/src/__tests__/helpers/pdf-text.ts:27`: `.replace(/ /g, ' '); // a protected space reads as a space`.
- Der Test erwartet dagegen `'Frais de chauffage selon le profil « Winter » : … ; …'` (`statement-pdf-render.test.ts:727`) und prüft `not.toContain('52.00 %')` (`:735`).
- Bestehende Erwartungen in derselben Datei schreiben normale Leerzeichen, z. B. «0.00 % / 43.00 %» bei `:708`.

**Warum falsch.**
- Auch nach einer korrekten Umsetzung bleibt die fr-Zeile rot.
- `'52.00 %'` und `'Parts des mois de votre bail :'` kommen im gelesenen Text nie vor. Diese Prüfungen wären auch dann grün, wenn Prozentwert und Monatszeile stehen blieben.
- Zur Zeit fängt nur `absent` («ohne Leistungszeitraum») die Regression ab, und nur für Punkt 1.

**Fix.** In den Erwartungen ` ` durch ein normales Leerzeichen ersetzen: `'52.00 %'` und `'Parts des mois de votre bail :'`.

## Fehlende Begriffe

Keine. Alle verwendeten Begriffe stehen im Glossar `UBIQUITOUS_LANGUAGE.md`: Heizprofil (:146), Leistungszeitraum (:74), Anteil nach Heizprofil (:148), Zeitanteil (:187), Abrechnungsposition.

## Nicht bestätigt

- Fedlex, Art. 8 VMWG: Die Seite `fedlex.admin.ch/eli/cc/1990/835_835_835/de` liefert ohne JavaScript keinen Text. `mmx search` bestätigt den Anfang von Abs. 1 («Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- …»). Den vollen Wortlaut habe ich aus früheren Reviews übernommen (`docs/reviews/451-fachreview-1.md:54`, `issue-137-fachreview-1.md:32`). Die Begründung von M-1 stützt sich auf diesen Wortlaut; die Nachrechenbarkeit als Massstab ergibt sich daraus nur sinngemäss: **unsicher** im strengen Sinn.
- Ob der Bildschirm der Abrechnung (Detailseite) denselben Anteil des Laufs zeigt, habe ich nicht geprüft. Das Issue betrifft nur das PDF.

Geprüft:
- Wortlaut de/fr/it/en des zweiten Satzes: gleich wie der bereits geprüfte Text in `heatingNoteParts`, sachlich richtig.
- Wegfall der Monatszeile, wenn alle Positionen Rechnungszeilen mit Leistungszeitraum haben: richtig. Jede Rechnungszeile (`partProfile`) zeigt die Monate im Heizprofil, die Monate des Mietverhältnisses darin und die Teilung, auch angebrochene Monate (`monthList`). Nachrechenbar bleibt es also. Monate ohne Rechnung bestimmen keinen Betrag.
- Auch bei «Abgerechnet bis» (`heatingMonthsBilled`) ist der Wegfall richtig.
- Mieter über die ganze Periode (100 %): unkritisch.
- E2E-Szenario nachgerechnet: Q1 2025 mit Jan 18 + Feb 14 + Mär 11 = 43 %. Lea Graf ab 01.02. hat Feb + Mär = 25 %, also 25 / 43 = 58.14 %. Bisher hätte das PDF dazu fälschlich «82.00 % für eine Rechnung ohne Leistungszeitraum» gedruckt (Feb–Dez = 82 %). Das Szenario erreicht also den neuen Zweig.
- Randfall 0 %: Ein Mieter ohne Monate in der Rechnung bekommt 0 / 43 = 0.00 %. Haben die Monate im Heizprofil zusammen 0 %, wird nach Tagen gerechnet; das erklärt weiterhin `sharesNoteHeatingParts`.
- Der Test lief rot, und zwar am fehlenden Verhalten (de/it/en). fr ist zusätzlich durch V-1 rot.
