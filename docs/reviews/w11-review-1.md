# Code-Review W11, Runde 1: PDF nennt die Rechnung (#236, V-8 von #226)

Geprüfter Stand: Worktree `review-w11-code`, `git diff origin/main c453a49` (498381d Szenario, c453a49 Umsetzung). Alle acht geänderten Dateien gelesen. Selbst keine Tests ausgeführt.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | backend/src/services/pdf.service.ts:701 | ponytail `delete:` Die Bedingung `!part.fuelStock` in `nameOf` wird nie wirksam. Der Teil des Tankbestands hat nie `noPeriod` (fuel-stock.service.ts:100), und `partStock` kommt pro Position nur einmal vor, also gilt nie `same > 1`. Kein Test schlägt fehl, wenn man sie entfernt. Ersatz: die Bedingung streichen, oder sie als Absicherung behalten und das im Kommentar sagen. net: -1 Bedingung. |
| C-2 | Nit | backend/src/services/pdf.service.ts:160 | FR `partNamed` setzt die geschützten Leerzeichen als unsichtbare Zeichen. Die übrigen FR-Vorlagen schreiben sie als ` ` (:145, :178, :182). Das Ergebnis ist richtig (geprüft mit `od -c`), im Review sieht man es aber nicht. |
| C-3 | Minor | backend/src/services/pdf.service.ts:687-690 | Ist eine Zeile `partBeyond` gleich wie eine andere, steht zweimal «(Rechnung …)» in derselben Zeile: «… (Rechnung CHF 1'200.00), davon …: CHF …, Ihre Mietstage … (Rechnung «X»)». Das ist schwer lesbar, und kein Test zeigt diesen Fall. |

Keine Blocker oder Majors.

## Geprüft und bestätigt

- **Zuordnung über den Index (Hauptfrage des Aufrufers).** Beide Listen kommen aus `group.invoices`, in derselben Reihenfolge:
  - `calculation.service.ts:120` füllt `group.invoices` in der Reihenfolge von `invoices` (:310-313). Rechnungen und Tankbestand stehen in einer Liste, der Tankbestand zuletzt.
  - `invoiceParts` entsteht dort mit `group.invoices.map` (:156), ebenso `invoices` (:382). Beide Listen werden nicht gefiltert.
  - Beide werden zusammen gespeichert (`statement.service.ts:367-368`), als jsonb-Arrays (`schema.ts:473-474`), die ihre Reihenfolge behalten.
  - `statement-invoices.service.ts:42` filtert nur für die Anzeige und schreibt nichts zurück. Eine andere Stelle, die nur eine der beiden Spalten ändert, habe ich nicht gefunden.
  - Eine Abrechnung von vor #96 hat `invoices = null`. Dann wird `description` undefined, und die Zeile bleibt ohne Namen (`statement-pdf.service.ts:93`). Das ist richtig: Ein gespeichertes PDF ändert sich nicht still.
- **Regeln der Triage:**
  - Eine Zeile ohne Leistungszeitraum nennt ihre Rechnung immer (`noPeriod`).
  - Eine Zeile mit gleichem Text wie eine andere derselben Position nennt sie (`same > 1`).
  - Der Tankbestand bekommt nie einen Namen (C-1).
  - Format «… (Rechnung «{description}»)» in vier Sprachen (:82, :160, :238, :316). Die Anführungszeichen folgen dem Stil der übrigen Vorlagen derselben Sprache.
  - Leere Beschreibungen kommen nicht vor: `schema.ts:250` notNull, `routes/invoices.ts:50` `minLength: 1`.
  - Zeichen ausserhalb von WinAnsi gehen durch `winAnsi` (pdf.service.ts:958-964). Lange Beschreibungen umbrechen in `partsBelow` und `positionHeight` (PARTS_WIDTH).
- **Tests (beurteilt durch Lesen):**
  - `statement-pdf.pg.test.ts` prüft an einer echten Abrechnung die Zeile ohne Leistungszeitraum, die zwei gleichen Zeilen und die eindeutige Zeile ohne Namen. Ohne die Änderung schlägt er fehl.
  - Die Render-Fälle zeigen den Wortlaut in fr, it und en. Ohne die jeweilige Vorlage schlagen sie fehl.
  - Das Szenario (`statement-detail.feature:423-444`) hat kein `@wip`, prüft beide Fälle und mit «steht im PDF nicht» auch die eindeutige Zeile. Ohne die Änderung ist es rot.
  - Es kommen keine neuen Steps dazu. Die Beschreibung «{Kategorie} {Datum}» stammt aus `fixtures/backend.ts:364`.
- **Bestehende PDF-Szenarien und Tests.** Ihre Prüfungen von Teilzeilen sind Teilstrings, eine angehängte Bezeichnung bricht sie also nicht. Kein «steht im PDF nicht» stösst sich an den neuen Texten (`grep` in `tests/e2e/features`).
- **Konventionen.**
  - Die Texte im PDF stehen wie bisher in den Übersetzungen des Backends, nicht in `messages/*.json`.
  - Kein neuer Bildschirm und kein neuer UI-Zustand, also keine Einträge in `screens.json`.
  - Die API-Antwort bleibt gleich: Das Feld `description` kommt nur intern zum PDF dazu, ein Vertrag in `tests/contracts` ist nicht betroffen.
  - Das Fachdokument (`docs/nebenkostenabrechnung-anforderungen.md`, Regel 5) und der Plan sind nachgeführt. Im Diff steht nichts, was nicht zur Anforderung gehört.
- **ponytail-review.** Nur C-1. Sonst schlank, ausliefern.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bun run lint`, `bun run check`, `cd backend && bun run type-check`;
  - `bun test src/__tests__/statement-pdf.pg.test.ts` (45 bestanden) und `src/__tests__/statement-pdf-render.test.ts` (52 bestanden);
  - E2E `-g "PDF nennt"` (6 bestanden);
  - dass die neuen Tests zuerst rot waren.
- Fachreview V-2 (Beschreibung ist als Merkmal unzuverlässig, Rechnungsdatum oder Rechnungsnummer wären besser): Issue #236 legt «description or Rechnungssteller» fest (per `gh api` gelesen). Haben zwei gleiche Zeilen dieselbe Beschreibung, unterscheidet sie auch die Bezeichnung nicht. Das ist eine Produktentscheidung (laut Aufrufer in #256 vorgeschlagen) und kein Codemangel. Den Stand von #256 habe ich nicht nachgesehen.
- Ob das PDF eine sehr lange Beschreibung, bei der die Position höher als eine Seite wird, sauber umbricht, habe ich nicht geprüft (`room`/`positionHeight` nur gelesen).
