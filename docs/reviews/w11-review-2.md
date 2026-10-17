# Code-Review W11, Runde 2 (Abschluss vor dem Push): PDF nennt die Rechnung (#236)

Geprüfter Stand: Worktree `review-w11-close`, detached auf 8ba1f5e. Delta seit Runde 1 (c453a49):
- e59119b: Antwort auf C-1, dazu Dokumente.
- 8ba1f5e: Merge von origin/main (93581d9, u. a. PR #385 / #120, berichtigte Abrechnung).

Gelesen habe ich `git show e59119b`, `git diff 93581d9 8ba1f5e` (alles, was der Branch auf main legt, also `backend/src`, Feature, Fachdokument, Archiv, Personas- und Review-Dokumente) und `git diff e59119b 8ba1f5e` für die beiden PDF-Services. Tests habe ich selbst nicht ausgeführt.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-5 | Nit | docs/archive/implementation-plan-verlauf.md:1178 | Der Punkt «closing review … `docs/reviews/w11-review-2.md`» ist schon abgehakt. Die Datei steht aber nicht im Commit, der Bericht liegt im Scratchpad. Vor dem Push die Datei nach `docs/reviews/` übernehmen oder den Verweis anpassen. |
| C-6 | Nit | 8ba1f5e (Merge) | Der Merge-Commit enthält eigene Inhalte des Branches: `docs/design/personas/dr-weber-w11.md`, `docs/reviews/w11-datenpruefung-1.md` und die Verschiebung der Session ins Archiv. Diese Inhalte haben mit dem Merge nichts zu tun. Im Log sind sie so schwer zu finden. Es sind nur Dokumente, App-Code ist nicht betroffen. |

Keine Blocker oder Majors. C-2 (Nit) und C-3 (Minor) aus Runde 1 bleiben offen, wie der Aufrufer sagt.

## Geprüft und bestätigt

- **C-1 erledigt.** `nameOf` lautet jetzt `(part.noPeriod || same > 1 ? part.description : undefined)` (pdf.service.ts:757). Der Kommentar nennt die Invariante. Ich habe nachgeprüft, dass sie hält:
  - `fuelStockChange` liefert pro Gebäude höchstens einen Teil (fuel-stock.service.ts:74-102, `return [ … ]` mit einem Element).
  - Dieser Teil hat `fuelStock: true` und nie `noPeriod` (:100).
  - Damit hat er nie `noPeriod`, und `same > 1` kann für `partStock` nicht eintreten. Der Tankbestand bekommt nie einen Namen.
- **Merge: beide Verhaltensweisen bleiben erhalten.**
  - `git diff 93581d9 8ba1f5e -- backend/src` zeigt genau die Änderung des Branches aus Runde 1 plus C-1: `partNamed` in vier Sprachen, `Part`, `partLines` mit `texts`/`nameOf`, und `lineItemOf` mit `description` aus `item.invoices?.[i]`. Nichts von #120 fehlt oder ist doppelt.
  - `git diff e59119b 8ba1f5e` auf pdf.service.ts und statement-pdf.service.ts zeigt nur die Hunks von #120: `replacesNote`/`prior*`/`and` in vier Sprachen, `replaces` in `StatementPDFData`, Hinweis in `title`, `priorOf`/`priorLine`/`totalRows`/`priorRow`, und `replaces` in `toPdfData`. Sie liegen in anderen Funktionen als `partLines`/`nameOf`/`lineItemOf`, es gibt keine Überschneidung.
- **Berichtigte Abrechnung und Zuordnung über den Index.** `correctStatement` (statement.service.ts:614 ff.) kopiert keine Positionen. Es rechnet die Abrechnung neu und speichert `invoiceParts` und `invoices` wie bisher zusammen (:427-428). Die Zuordnung `invoiceParts[i]` zu `invoices[i]` gilt also auch für eine berichtigte Abrechnung. Eine ersetzte Abrechnung (`replaced`) behält ihre Zeilen (:476-477).
- **Tests nach dem Merge.**
  - Der neue Render-Fall braucht `mixed`, `special` und `config`. Alle drei gibt es im zusammengeführten `statement-pdf-render.test.ts` noch (:11, :308, :329).
  - Der pg-Test steht unverändert drin.
  - Das Szenario steht genau einmal in `statement-detail.feature`, ohne `@wip`. Die 104 Zeilen von main liegen in anderen Szenarien.
- **Fachdokument (V-6).** Regel 5 nennt jetzt «die Veränderung des Tankbestands nie». Das stimmt mit dem Code überein.
- **Plan.** `implementation_plan.md` ist gleich wie auf main. Die Session W11 steht im Archiv, mit allen Reviews und Personas (bis auf C-5).
- **Offene Arbeit.** Kein `TODO(…, #236)` im Code. Der Pull Request darf `Fixes #236` sagen.
- **Feature-Reviews (nur gelesen).**
  - `w11-datenpruefung-1.md` hat keine Befunde.
  - `dr-weber-w11.md` hat P-1 und P-2 als Minor und P-3 als Nit. Sie betreffen die Wortwahl bzw. das Merkmal und gehören laut Plan zu #256. Keiner davon ist Blocker oder Major.
- **ponytail-review.** Das Delta streicht eine Bedingung (C-1) und fügt nichts hinzu. Ausliefern.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `cd backend && bun run type-check` auf 8ba1f5e;
  - `bun test src/__tests__/statement-pdf.pg.test.ts src/__tests__/statement-pdf-render.test.ts src/__tests__/statement-pdf-data.test.ts` mit 118 bestanden, auf 8ba1f5e;
  - Render-Tests mit 52 bestanden, auf e59119b;
  - `bun run lint` und `bun run check` auf c453a49, auf 8ba1f5e noch nicht gelaufen (der Aufrufer will sie vor dem Push ausführen).
- E2E des Szenarios «PDF nennt die Rechnung, wenn Daten und Betrag sie nicht unterscheiden» und der PDF-Szenarien von #120 auf dem Merge-Stand: Dazu meldet der Aufrufer keinen Lauf. Durch Lesen schliesse ich, dass sich die Texte nicht stören. Kein «steht im PDF nicht» von #120 trifft einen Text von #236 und umgekehrt. Ausgeführt habe ich es nicht.
- Dass ein Teil des Tankbestands nie einen Namen bekommt, belegt nur die Invariante im Code (fuel-stock.service.ts:84-102). Kein Test hält das fest. Der Wegfall der Absicherung (C-1) ändert daran nichts, denn auch vorher prüfte es kein Test.
