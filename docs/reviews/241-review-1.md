# Code-Review #241, Runde 1

Geprüft wurde der Worktree `review-241-code` mit `git diff 88583151 3ae2b1d6` (Commits 16d6c2e9, 696cdeea, 3ae2b1d6). Alle 12 geänderten Dateien sind gelesen. Die Anforderung stammt aus dem Issue #241, Abschnitt «Decided (product owner)» (per `gh api` gelesen), dazu `docs/reviews/241-fachreview-1.md`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `backend/src/services/fuel-stock.service.ts:98`, `backend/src/services/pdf.service.ts:670` | Die Veränderung des Tankbestands hat weder `noPeriod` noch `whole`. Sie läuft deshalb in `partLine` und steht neu mit der Beschriftung «Leistungszeitraum 01.01.2025 – 31.12.2025: CHF −300.00, …» im PDF. Das ist eine falsche Angabe, die erst diese Änderung erzeugt. |
| C-2 | Minor | `backend/src/services/pdf.service.ts:706-707` | Die neue Bedingung `rounded: parts ? …` hat keinen Test, der zeigt, dass der Satz fehlt, wenn keine Position Rechnungszeilen hat. Dasselbe gilt für `sharesNoteParts`. V-3 der Fachprüfung hat das für das Szenario in Zeile 218 vorgeschlagen. |
| C-3 | Minor | `tests/e2e/features/statement-detail.feature:257-276` | Die neuen Zeilen nach V-1 («Ohne Leistungszeitraum: …» und «Leistungszeitraum … (Rechnung CHF …), davon …») sind Verhalten, das der Benutzer sieht. Sie sind nur in pg- und Render-Tests abgedeckt, nicht in einem Szenario. Mit den vorhandenen Schritten wären sie erreichbar («für die Zeit vom … bis …» weglassen oder über das Periodenende legen). «Done means» verlangt nur das eine Szenario. |
| C-4 | Nit | `backend/src/services/pdf.service.ts:123, 152-155, 171` | Vor «:» und «;» stehen in den neuen französischen Zeilen gewöhnliche Leerzeichen statt U+00A0 (V-5 der Fachprüfung). Der Plan führt V-5 als «fixed», umgesetzt ist aber nur `t.colon`. Der Mangel bestand schon vorher (U-37, U-26). |
| C-5 | Nit | `docs/design/offene-punkte.md:43` | Die Zeile U-37 sagt noch, die Erläuterung nenne nicht, dass «Ihr Anteil» = Wohnungsanteil × Zeitanteil ist. Diesen Teil beantwortet #241 jetzt, die Zeile ist nicht nachgeführt. |
| C-6 | Nit | `backend/src/services/invoice.service.ts:518` | Der Zweig `whole` ist nur mit einem Leistungszeitraum getestet, der über das Ende der Periode hinausreicht. Ein Leistungszeitraum, der vor der Periode beginnt (`start !== servicePeriodStart`), hat keinen Test. |
| C-7 | Nit | `implementation_plan.md:4-5` | Vor `## Session` stehen zwei Leerzeilen statt einer. |

## C-1 (Major): Die Veränderung des Tankbestands heisst neu «Leistungszeitraum»

**Warum es falsch ist.**
- `fuelStockChange` gibt `inPeriod: { start: periodStart, end: periodEnd, amount: opening − closing }` zurück, ohne `noPeriod` und ohne `whole` (`fuel-stock.service.ts:98`).
- `calculation.service.ts:119` übernimmt `...invoice.inPeriod` in die Gruppe. Bei einer Heizposition nach Tagen speichert `daysOf` die Werte als `invoice_parts`, wenn eine Heizrechnung einen anderen Leistungszeitraum hat. Das ist der Fall von #239: ein Lauf ohne Heizprofil oder mit Monaten zu 0 %, dazu ein Mietvertrag über einen Teil der Periode.
- `partText` (`pdf.service.ts:670`) wählt dann `partLine`. Vor #241 druckte das PDF «01.01.2025 – 31.12.2025: −300.00, 139/365 Tage» ohne Beschriftung. Neu druckt es «Leistungszeitraum 01.01.2025 – 31.12.2025: CHF −300.00, Ihre Mietstage 139 von 365 Tagen».
- Damit tritt genau der Fehler auf, den V-1 der Fachprüfung als Major eingestuft hat: Das Wort «Leistungszeitraum» steht vor Daten, die kein Leistungszeitraum einer Rechnung sind. Für diese Zeile gibt es nicht einmal eine Rechnung (Art. 257b Abs. 2 OR, Belegeinsicht).
- #239 bestand schon vorher. Die Beschriftung macht den Mangel aber ausdrücklicher und widersprüchlicher. Nach CLAUDE.md, Workflow 7 («not when the change makes it more visible or contradictory») ist er deshalb ein Befund dieser Änderung.
- #226 ist noch in keinem Release-Tag (`git tag --contains 3c664d3c` ist leer). Der Fehler käme also nicht in ein Release, wenn #239 vorher gemergt wird. Das ist aber eine Frage der Reihenfolge, nicht des Codes.

**Wie es sich als Fehler zeigt.** Ein pg-Test wie die bestehenden in `statement-pdf.pg.test.ts`:
1. Ein Heizöltank mit Anfangs- und Endbestand.
2. Eine Heizrechnung mit Leistungszeitraum 01.07.–30.09.2025.
3. Eine Abrechnung ohne Heizprofil für einen Mieter, der am 15.08.2025 einzieht.

Das PDF enthält dann `Leistungszeitraum 01.01.2025 – 31.12.2025: CHF` für die Veränderung des Tankbestands.

**Wie es sich beheben lässt.** Eine der folgenden Möglichkeiten:
- Den entschiedenen Text von #239 («Veränderung Tankbestand …») in diesen Pull Request nehmen.
- Bis #239 der Tankbestand-Zeile die alte, unbeschriftete Form lassen. Dafür bräuchte sie eine eigene Markierung.
- Festhalten (Blocked on me), dass #241 nur zusammen mit #239 und vor dem nächsten Release gemergt wird.

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht selbst wiederholt:**
  - Backend `bun run test` 675 pass, 94.0 % Zeilen.
  - type-check.
  - lint, check.
  - test:coverage 2606 passed.
  - fallow audit, deepcheck:audit.
  - E2E: das geänderte Szenario grün, `statement-detail.feature` 31 passed.
- **Selbst wiederholt:** `bun test src/__tests__/statement-pdf-render.test.ts` in `backend/`, 36 pass, 0 fail.
- **Umbruch in E2E und pg-Tests:** Ob «steht im PDF» den langen Hinweissatz (Szenario Zeile 276) auch dann findet, wenn das PDF ihn umbricht, habe ich nur aus dem gemeldeten grünen Lauf übernommen. Die pg-Tests mit Datenbank habe ich nicht selbst laufen lassen.
- **Vor #241 gespeicherte `invoice_parts`:** Sie haben weder `noPeriod` noch `whole`. Beim erneuten Erstellen des PDF erhielte eine Rechnung ohne Leistungszeitraum deshalb fälschlich die Beschriftung «Leistungszeitraum <Periode>». Kein Befund, weil #226 in keinem Release-Tag liegt (nur in Entwicklungsdatenbanken). Ob irgendwo eine produktive Datenbank mit `main`-Ständen nach dem 16.10. läuft, konnte ich nicht prüfen.
- **Bestätigt durch Code und Test:**
  - P-1 mit V-6 bis V-8, Text und Bedingungen in `sharesNote`: Render-Test «erklärt die Rechnungen … in kurzen Sätzen», Heizprofil-Test Zeile 72, pg-Test Zeile 198, Szenario.
  - P-2: Render- und pg-Tests, Szenario.
  - P-3: Formel in `partShare`, nachgerechnet 900 × 613.04 / 1'800 = 306.52, 1'206.52 × 623.26 / 1'206.52 und 1'265 × 598.78 / 1'265. Sie passt zu `tenantShare = roundToRappen(apartmentShare × periodShare)` (`calculation.service.ts:353`).
  - V-1 in vier Sprachen (Render-Test `it.each`) und über die Datenbank (pg-Tests, Zeilen 213-247).
  - V-2: Spalte und Satz.
  - fr, it und en verwenden die Begriffe aus `i18n-begriffe.md`, einschliesslich der neuen Zeile «Leistungszeitraum».
- **Ohne Befund:**
  - `invoiceParts` steht in keiner API-Antwort, die das Frontend liest. Kein Vertrag in `tests/contracts` betroffen.
  - Keine UI-Texte, also nichts in `messages/*.json`, `screens.json` oder den a11y-Features.
  - Keine E2E-Screenplay-Änderungen ausser den Feature-Zeilen.
  - Prettier ist auf den geänderten Backend-Dateien sauber.
  - Kein veralteter Text in `docs/` ausserhalb von Archiv und Reviews.
