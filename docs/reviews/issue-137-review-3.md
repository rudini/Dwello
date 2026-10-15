# Review issue #137, Runde 3 (Delta 3976b25..f6bd25a, Merge b6c63c0)

Worktree: `review-137-code3` (detached auf b6c63c0). Gelesen: alle Dateien des Deltas (`prorating.service.ts`, `statement-pdf.service.ts`, `prorating.pg.test.ts`, `statement-generate.feature`, `statement-generate.steps.ts`, `tasks/statement-generate.ts`, `tasks/statement-generate-api.ts`, `implementation_plan.md`, die zwei Berichte unter `docs/reviews/`), dazu der einzige Aufrufer in `calculation.service.ts:300-320`, die verwendeten Given-Schritte (`statement-detail.steps.ts:38-55`, `building-detail.steps.ts:27`) und die Grundlage von `statement-generate.feature`. Der Merge b6c63c0 bringt nur Dateien von `main` (LLM-Konfiguration, #202-Berichte, `categories-ki.feature`); `implementation_plan.md` gleicht nach dem Merge f6bd25a, und auf der `main`-Seite war keine Session offen (`git diff b6c63c0^2 b6c63c0`). Es geht also nichts verloren, und eine Session reicht.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | – (behoben) | `tests/e2e/features/statement-generate.feature:77-102` | Das `@api`-Szenario ist vorhanden und nicht `@wip`. Die Rechnung im Kommentar stimmt: 900 × 62/92 = 606.52, die Hälfte (2 Wohnungen, gleich verteilt) = 303.26, × 48/62 = 234.78, + 3 % = 241.82. Der gemeldete Rotwert 162.97 entspricht genau der alten Regel (606.52 × 48/92 / 2 × 1.03), das Szenario unterscheidet also die beiden Regeln. Der UI-Pfad (`EnterDate` mit `periodStart`/`periodEnd`) und der API-Pfad (`...options` überschreibt die Jahresperiode in `run`) führen zur selben Periode, und beide antworten über `PREVIEW_TOTALS` bzw. die Vorschau mit einem Betrag. Die Planzeile `Scenario red` ist da. |
| C-5 | – (behoben) | `backend/src/services/prorating.service.ts:195-213` | Die Union ist eingeengt. `calculation.service.ts:313` und `statement-pdf.service.ts:145` prüfen `byDays`, bevor sie `share`/`percentage` lesen. Der entfernte Rückgriff ohne Profil war schon seit Runde 1 tot, denn die Berechnung nahm bei `byDays` immer `rentalShare`. Das Verhalten ändert sich also nicht. `calculateProrationDays`/`calculateDaysBetween` werden weiterhin gebraucht (Z. 75, 156, 163, 263, 298). Die Tests prüfen die neue Form mit `toEqual({ byDays: true })` bzw. `toMatchObject`. |
| C-4 | – | – | Wie verlangt hier nicht bewertet (fach-reviewer Runde 2). |
| C-6 | Nit | `tests/e2e/steps/statement-generate.steps.ts:123-124` | Der Schritt gibt `Number(start.slice(0, 4))` als `year` an `openPreview` weiter. Sobald `periodStart`/`periodEnd` gesetzt sind, verwenden beide Pfade dieses Jahr nicht. Es ist ein toter Parameter auf diesem Weg; das Verhalten ist korrekt. |

Es gibt keinen neuen Blocker und keinen neuen Major.

Weitere Prüfungen ohne Befund:
- Keine neuen UI-Texte und keine neuen Bildschirmzustände: `messages/*.json`, `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature` sind nicht betroffen.
- Screenplay: Der neue Schritt ruft nur die Aufgabe `openPreview` auf. Die Aufgabe wartet im UI-Pfad auf `previewCount`, bevor die Frage folgt.
- Feature-Text: Fachsprache, kein «klickt», «Button» oder «Feld».
- Die bestehenden Szenarien sind unverändert. Der Standard von `openPreview` (ganzes Jahr) bleibt per `??` gleich.
- API-Vertrag: Die Antwort der Vorschau ist unverändert.

## Nicht bestätigt

- Die folgenden Prüfungen hat der Aufrufer gemeldet, ich habe sie nicht erneut ausgeführt:
  - lint 0, check 0, deepcheck:audit still, fallow sauber
  - test:coverage 2432 bestanden
  - Backend-Test 613 bestanden, type-check 0
  - E2E statement-detail + statement-generate (chromium + api) 56 bestanden
- Den Rotwert des Szenarios (erwartet CHF 241.82, erhalten 162.97, mit dem D-1-Fix herausgenommen) habe ich nur rechnerisch nachvollzogen (siehe C-3), nicht ausgeführt. E2E und Backend-pg-Tests schreiben in Datenbanken bzw. Builds und sind mir nicht erlaubt.
