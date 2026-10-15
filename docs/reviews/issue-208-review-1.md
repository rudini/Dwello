# Code-Review #208, Runde 1

Bereich: `git diff c91aa8e 0fb8145` (2fcb254 Szenarien `@wip`, 0fb8145 Fix, Migration, Doku, `@wip` entfernt). Worktree: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-208-code`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `backend/src/services/prorating.service.ts:213-215`, `backend/src/__tests__/statement-pdf.pg.test.ts:85-104` | Die Normierung des Heizprofils auf die Monate einer Periode unter einem Jahr (`tenant.percentage / period.percentage`) hat keinen Test mehr, der sie festhält: Die beiden Tests, die sie prüften, laufen wegen D-2 jetzt nach Tagen. |
| C-2 | Minor | `backend/src/services/calculation.service.ts:144-145` | Kein Test für den Zweig «Rechnungen einer Position über verschiedene Tage → kein Bruch, Prozent» (Regel 5 neu, `docs/nebenkostenabrechnung-anforderungen.md:145`). Fällt die Prüfung weg, druckt das PDF einen falschen Bruch, z. B. den Bruch der ersten Rechnung. Kein Test schlägt dann fehl (`service-period.pg.test.ts:63-77` prüft nur Beträge). |
| C-3 | Nit | `backend/src/__tests__/statement-pdf.pg.test.ts:166-168` | Der neue `describe` steht zwischen dem Kommentar «Heizöl im Tank: …» und dessen `describe('Tankbestand im PDF')`. Der Kommentar steht jetzt über dem falschen Block. |
| C-4 | Nit | `backend/src/services/pdf.service.ts:224` | Italienisch «i suoi giorni di locazione compresi in esso sui suoi giorni nel periodo»: Das erste «suoi» meint Lei, das zweite die Rechnung bzw. den Leistungszeitraum. Das ist doppeldeutig, z. B. «sui giorni di quest’ultimo nel periodo». |

## C-1 (Major): Die Normierung des Heizprofils für eine Periode unter einem Jahr ist nicht mehr getestet

**Warum das falsch ist:** `handleMidYearMoves` teilt den Anteil der Mietmonate durch den Anteil der Periodenmonate. Bei einer Periode unter einem Jahr (z. B. bei einem Verkauf) bestimmt diese Division den Betrag eines Mieters mit Ein- oder Auszug. Vor dem Fix haben zwei Tests sie festgehalten:
- `statement-pdf.pg.test.ts` «nennt bei einer Periode unter einem Jahr den Anteil an den Heizkosten der Periode» (Periode Juli bis Dezember, erwartet «100.00 %»);
- `heating-distribution.pg.test.ts:154` «belastet in einer Periode unter einem Jahr den Mieter der ganzen Periode mit dem ganzen Wohnungsanteil» (Mai bis Dezember, `periodShare: 1`).

Beide haben einen Mietvertrag über die ganze Periode. Seit der neuen Zeile `prorating.service.ts:209` (`if (effectiveStart <= periodStart && effectiveEnd >= periodEnd) return { byDays: true }`) gehen sie nach Tagen und erreichen die Division nicht mehr. Der erste wurde auf Tage umgeschrieben, der zweite besteht jetzt trivial.

Die übrigen Tests nach Heizprofil decken die Division nicht ab:
- «41.50 %» in `statement-pdf.pg.test.ts:78`, 0.43/0.52 in `heating-distribution.pg.test.ts:125-151` und `prorating.pg.test.ts:96` laufen alle über ein ganzes Jahr: `period.percentage` ist 100, die Division ändert nichts.
- `heating-distribution.pg.test.ts:197-207` (Januar bis 19. Oktober, Einzug im Mai) prüft nur Zwischensumme = Summe der Positionen, keinen Anteil.

Die Anforderung «Heizung nach Profil bei einem Mietvertrag über einen Teil der Periode behält ihren Prozentsatz» ist damit nur für Jahresperioden belegt.

**So zeigt sich der Fehler:** In `prorating.service.ts:214` `const percentage = (tenant.percentage / period.percentage) * 100;` durch `const percentage = tenant.percentage;` ersetzen. Nach der obigen Analyse bleiben alle Backend-Tests grün (nicht ausgeführt, siehe «Nicht bestätigt»). Ein Mieter mit Einzug am 1. Oktober in einer Periode vom 1. Juli bis 31. Dezember zahlt dann im Mittelland 40.5 % statt 40.5/41.5 = 97.59 % der Heizkosten der Wohnung.

**Behebung:** einen Test in `prorating.pg.test.ts` (`handleMidYearMoves`) für einen Einzug in einer Periode unter einem Jahr, z. B. die Periode 2024-07-01 bis 2024-12-31 mit einem Mietvertrag ab 2024-10-01: erwartet wird `percentage` ≈ 97.59 und `byDays: false`. Rot zeigen, indem die Division herausgenommen wird.

## Geprüft und bestätigt

- **D-2, Mietvertrag über die ganze Periode nach Tagen:** `prorating.service.ts:208-209`. Neuer Test `prorating.pg.test.ts:128-135`, PDF-Test `statement-pdf.pg.test.ts:85-104` («184/184 Tage», kein «Heizprofil», Hinweis Art. 8 VMWG), Szenario `statement-detail.feature:190-202` ohne `@wip`. Beide Aufrufer bekommen dieselbe Regel: die Berechnung (`calculation.service.ts:318-327`, mit den Vertragsdaten, die die Funktion selbst auf die Periode begrenzt) und `heatingOf` (`statement-pdf.service.ts:138-146`, mit den Mietdaten in der Periode). Datumswerte: alles `new Date('YYYY-MM-DD')` (UTC-Mitternacht, `statement.service.ts:298-299`), der Vergleich `<=`/`>=` stimmt also.
- **Beträge:** Für einen Mietvertrag über die ganze Periode lieferte das Heizprofil `tenant/period = 1`. Nach Tagen ergibt `rentalShare` ebenfalls 1, auch bei einem Leistungszeitraum und bei der Tankbestandsänderung (die Mietdauer deckt alle Tage ab). Der Betrag bleibt gleich, Abweichungen höchstens im Gleitkomma vor `roundToRappen`.
- **D-3, Bruch eines Leistungszeitraums:** `daysOf` (`calculation.service.ts:139-146`), gespeichert in `statement.service.ts:350-351`, gelesen in `statement-pdf.service.ts:89`, gedruckt in `pdf.service.ts:437-442`. Test `statement-pdf.pg.test.ts:168-199` («31/62 Tage 303.26»: 606.52 × 31/62 = 303.26), Szenario `statement-detail.feature:204-218`. `days()` begrenzt auf ≥ 0, so wird ein Mieter ohne Tage im Leistungszeitraum zu «0/y Tage». Ohne Leistungszeitraum ist `start`/`end` die Periode, y also die Tage der Periode wie bisher.
- **Profil-Zeilen speichern keine Tage** (`shareDays = noDays`), und `timeShare` prüft zuerst `byProfile`. Der «41.50 %»-Test bleibt grün.
- **Alte Abrechnungen** (Spalten `NULL`): `shareDays` ist `undefined`, es gilt die bisherige Heuristik (`pdf.service.ts:443-444`). Wird das PDF einer alten Abrechnung über die ganze Periode neu erzeugt, gibt `heatingOf` jetzt `byDays` zurück: Es druckt «x/x Tage» ohne Heizprofil-Hinweis, passend zum gespeicherten `periodShare` 1.
- **Migration:** neue Datei `0003_line_item_days.sql`, nur `ADD COLUMN`, nullable. `0001`/`0002` sind unverändert. `migrate.ts` wendet die Dateien nach Namen an, es braucht kein Journal. `schema.ts` und `docs/data-model.md` passen dazu.
- **API-Verträge:** `GET /statements/:id` und die Vorschau liefern zwei Felder mehr. `tests/contracts/*.json` enthalten nur, was das Frontend liest, und das Frontend liest keine Anteilsfelder (`grep periodShare src` leer). Es braucht keine Vertragsänderung.
- **PDF-Hinweistexte:** `sharesNoteDays` ist in de/fr/it/en vorhanden, `{days}` steht in allen vier `sharesNote`. Das französische « ; » folgt dem bestehenden Text. Der Hinweis erscheint nur, wenn ein Bruch andere Tage hat als die Periode.
- **UI-Texte:** `messages/*.json` sind unverändert. Es gibt keinen neuen Bildschirm und keinen neuen Zustand (nur der PDF-Inhalt ändert sich), daher keine Einträge in `screens.json`/a11y nötig.
- **E2E:** Es gibt keine neuen Steps, die Szenarien nutzen bestehende (`statement-detail.steps.ts:50,64,71,208,212`, «mietete … von … bis» wie in `contract-detail.feature`). Die Features beschreiben fachlich, ohne «klickt»/«Button».
- **Plan:** nur die aktuelle Session. `Scenario red` für beide Szenarien, `Test red` für die drei neuen bzw. geänderten Tests, `Skills: tdd, ponytail, ponytail-review` vorhanden.
- **Commits:** Die Betreffzeilen halten die Konventionen ein. Es gibt keine fremden Umformatierungen.

## Nicht bestätigt

- Gemeldete Checks, nicht wiederholt (`node_modules` des Worktrees verweist auf das Haupt-Repo, das hier gesperrt ist): Frontend `bun run test:coverage` (2458), `bun run lint`, `bun run check`, `bun run deepcheck:audit`, `bunx fallow audit`; Backend `bun run type-check`, `bun run test` (618 grün, 1 Fehler im `afterAll` von `swiss-today.pg.test.ts`, H-27); E2E chromium + api (112 grün, auf dem Commit vor dem `noDays`-Umbau). Alle vom Aufrufer gemeldet.
- Die Mutation in C-1 ist nicht ausgeführt, sondern aus den Testdaten hergeleitet (Perioden und Mietdaten aller Tests mit `heatingProfileId` in `backend/src/__tests__/` gelesen).
- Ob Issue #75 (Marker `TODO(fachlich prüfen, #75)` in `schema.ts:409`) und #226 offen sind: kein Zugriff auf GitHub geprüft.
- Ob in den Demodaten von Lindenhof weitere Hauswart-Rechnungen im Juni bis August 2025 liegen, die den Bruch im Szenario D-3 zu Prozent machen würden: nicht nachgesehen. Das Szenario ist laut Aufrufer grün.
- Fachliche Richtigkeit der Hinweistexte fr/it/en über C-4 hinaus: Sache von `fach-reviewer`.
