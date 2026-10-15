# Review #142, Runde 1 – Fehlende Abrechnungen am Mietvertrag

Geprüft: `git diff e445b1e..600edda` im Worktree `review-142-code` (detached auf 600edda). Gelesen: alle 19 geänderten Dateien, dazu `backend/src/routes/statements.ts`, `backend/src/services/statement.service.ts` (Filter), `backend/src/db/schema.ts` (Spaltentypen), `src/lib/ui/Button.svelte`, `tests/contracts/README.md` und `period-statements.json`, `tests/a11y/screens.json`, `tests/e2e/fixtures/screens.ts`.

Kein Blocker, kein Major.

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Minor | `src/__tests__/contract-actions.test.ts:88-102` | Der Test liest neu `periodStart`/`periodEnd` der Abrechnungsliste und die Mietvertragsantwort aus eigenen Fakes statt aus `tests/contracts/period-statements.json` bzw. `contract.json` (Gotcha «API contracts»). Die Zeile für `period-statements.json` in `tests/contracts/README.md` nennt nur `?periodStart=…&periodEnd=…`, nicht die neue Anfrage `?contractId=…`. |
| C-2 | Minor | `src/routes/contracts/[id]/+page.server.ts:77`, `src/__tests__/contract-actions.test.ts:92` | Dass nur Abrechnungen *dieses* Mietvertrags zählen, hängt jetzt allein am Query-Parameter `contractId` (der BFF prüft `s.contractId` nicht mehr). Der Fake beantwortet jede URL mit `/statements?`, und das E2E-Szenario hat nur Abrechnungen von Anna Keller: Wer `contractId=` aus Zeile 77 entfernt, bekommt alle Tests grün, und die Abrechnung eines anderen Mietvertrags (z.B. Vormieter derselben Wohnung) würde eine Periode als abgerechnet zählen. Die gleiche Lücke bestand schon vor dem Diff (der alte Test hatte auch keine fremde Abrechnung). Vorschlag: Fake antwortet nur auf `contractId=c1`, oder ein Fall mit einer Abrechnung eines anderen Mietvertrags. |
| C-3 | Minor | `tests/a11y/screens.json:236-264`, `tests/e2e/fixtures/screens.ts:48,57,62,68` | Der neue Zustand «mehrere fehlende Abrechnungen» wird von axe und der Sprachprüfung nur zufällig über `default` besucht (Anna ab 2015 mit Abrechnungen 2024/2025, also 2015–2023 offen; Dora ab 2015 ohne Abrechnung). Weder `stateMeanings` noch ein Kommentar im Seed nennt ihn; eine Änderung am Seed liesse ihn stillschweigend fallen. Der Zustand mit einer einzigen fehlenden Periode (bisher bei Dora: nur 2025) wird jetzt nirgends mehr von axe besucht. Sein Markup hat sich aber nur in der Klasse des Wrappers geändert. |
| C-4 | Nit | `src/routes/contracts/[id]/MissingStatement.svelte:36` | `variant={single ? undefined : 'secondary'}`: Beide Zweige ergeben `secondary`, weil das der Standard von `Button` ist (`src/lib/ui/Button.svelte:11`). Die Zeile ist ohne Wirkung und kann weg. |
| C-5 | Nit | `src/lib/accounting-period.ts:23-30` | Die Schleife hat keine Schranke: Bei `since === ''` (oder einem anderen Wert, der vor `'0000'` sortiert) endet sie nie, und der Seitenaufruf hängt. Praktisch ausgeschlossen, weil `start_date` `notNull` ist (`backend/src/db/schema.ts:119`). Mit einer Schranke (z.B. `back < 100`) wäre es trotzdem robust. |
| C-6 | Minor | `src/routes/contracts/[id]/+page.server.ts:80-84` | Der Diff verstärkt ein bestehendes Verhalten: `accounting_period` lässt sich frei ändern (`backend/src/routes/config.ts:75`). Nach einem Wechsel (z.B. calendar → july-june) liegt keine alte Kalenderjahr-Abrechnung mehr *innerhalb* einer neuen Periode. Bisher meldete die Seite deshalb fälschlich nur die letzte Periode, jetzt jede seit Vertragsbeginn. Die Regel ist die von A-10 und damit fachlich zu klären: als offene Arbeit festhalten, nicht in diesem Slice lösen. |
| C-7 | Nit | `src/__tests__/settings.test.ts:177` | Der Test für `endedPeriodsSince` steht im `describe` «Standardwerte im Abrechnungs-Assistenten», obwohl er die Funktion für die Mietvertragsseite prüft. |

## Blocker/Major

Keine.

## Bestätigt

- **Abgelaufene Perioden ab Vertragsbeginn, die neueste zuerst, je mit `wizardLink`:**
  - Code: `accounting-period.ts:21-30` und `+page.server.ts:70-86`.
  - Tests: `settings.test.ts` (calendar, july-june, laufende Periode) und `contract-actions.test.ts` mit «nennt jede abgelaufene Periode …» (drei Jahre, das mittlere abgerechnet, prüft Reihenfolge und `href`).
- **Kein Hinweis für eine laufende Periode und für Perioden vor dem Vertragsbeginn:**
  - Code: `lastCompletedPeriod` liefert nur abgelaufene Perioden; die Schleife bricht bei `end < since` ab; zusätzlich filtert `rentDaysIn`.
  - Tests: `settings.test.ts:275` und «schweigt für Perioden vor dem Vertragsbeginn …».
- **Regel «abgerechnet»:** Sie entspricht der bisherigen. Der Backend-Filter prüft `gte(periodStart)` und `lte(periodEnd)` (`statement.service.ts:104-105`), also Enthaltensein; der BFF prüft nun dasselbe auf Strings. `period_start` und `period_end` sind `date`-Spalten (`schema.ts:333-334`) und kommen deshalb als `YYYY-MM-DD`, der Stringvergleich hält. Der Filter `contractId` existiert im Backend (`statements.ts:44`) und ist dort getestet (`statement-list-contract.pg.test.ts:48`). `limit` hat im Backend keine Obergrenze.
- **Komponente:**
  - Eine Periode: Titel und Text wie bisher.
  - Mehrere Perioden: «{count} Abrechnungen fehlen» und je Periode ein Knopf «Abrechnung {period} erstellen».
  - DOM-Tests: `contract-detail-page.dom.test.ts:185-215`.
  - Tokens: `flex flex-wrap gap-2`. Die Knöpfe sind mindestens 48 px hoch (`min-h-12` in `Button`).
- **Texte:** Alle drei neuen Schlüssel stehen in allen vier `messages/*.json`, mit Sie/vous/Lei und einem Verb auf dem Knopf. Die Begriffe passen zu `dashboard_create_statements` und zu `docs/design/i18n-begriffe.md:91`.
- **E2E:**
  - Das neue Szenario ist ohne `@wip`; `Scenario red` steht im Plan.
  - Die negative Prüfung hat ihren positiven Anker im Schritt davor.
  - Die Frage liefert den Text des Hinweises.
  - Die Schritte rufen nur Tasks und Questions auf.
  - Das Jahr 2024 im Szenario bleibt über die Jahre richtig, weil der Vertrag fest am 2024-04-01 beginnt.
  - Das bestehende Szenario «Fehlende Abrechnung am Mietvertrag» klickt jetzt den Link `…-link-<letztes Jahr>-01-01` und deckt damit 2026 den Zustand mit mehreren Perioden ab (2024 und 2025 offen).
- **Plan:** `Skills: tdd, ponytail, ponytail-review`, `Test red` für jeden neuen Test und `Scenario red` sind vorhanden.
- **Sonstiges:** Kein fremder Code ist im Diff. Prettier meldet auf allen geänderten Code-Dateien keine Abweichung (`bunx prettier <file> | diff`).
- **Selbst wiederholt:** `bunx vitest run` auf `contract-actions`, `contract-detail-page.dom`, `settings`, `contract-rent-labels` und `tenant-email-link`: 81 passed.

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht wiederholt:** lint 0, check 0, `deepcheck:audit` still, fallow sauber, `test:coverage` 2434 passed, E2E `contract-detail.feature` chromium + api 28 passed, axe- und Sprachzeilen von contract-detail 12 passed, Backend unverändert. Letzteres ist durch `git diff --stat` bestätigt: keine Datei unter `backend/`.
- **Anzahl der Commits:** Der Aufrufer nennt drei. `git log e445b1e..600edda` zeigt nur zwei: 503d57f und 600edda.
- **Darstellung bei Nutzerinnen und Nutzern:** Bei einem Vertrag, der lange vor der Nutzung von Dwello begann, zeigt die Seite viele Knöpfe (im a11y-Seed 9 bzw. 11). Das verlangt die Anforderung («ab Vertragsbeginn»). Ob das für die Zielgruppe Orientierung oder Lärm ist, kann ich nicht beurteilen. Das ist Sache der Personas (Workflow 5).
- **Mobile Ansicht:** Dass lange Knopftexte über den Jahreswechsel (z.B. «Établir le décompte 01.07.2024 – 30.06.2025») bei 390 px umbrechen statt seitlich zu scrollen, habe ich nur aus den Klassen geschlossen (`inline-flex` ohne `whitespace-nowrap`). Die a11y-Läufe zeigen nur Kalenderjahre.
