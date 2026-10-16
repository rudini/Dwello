# Code-Review #226, Runde 2 (Delta cf49fa58..53b3db99)

Worktree: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-226-code2` (detached bei 53b3db99). Gelesen: alle 12 Dateien des Deltas. Die Code- und Testdateien sind ganz gelesen, die neuen Review-Berichte nur so weit, wie sie den Code betreffen (`226-fachreview-2.md` V-9 bis V-12). Dazu `calculation.service.ts` (`rentedIn`, `rentalShare`, `daysOf`), `pdf.service.ts` (`room`, `row`, `costTable`, `partLines`, `positionHeight`, `partsBelow`, `sharesNote`, vier Übersetzungen), die Fixtures in `statement-pdf-render.test.ts`, `docs/design/i18n-begriffe.md` und `UBIQUITOUS_LANGUAGE.md`.

Kein Blocker, kein Major.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | – | backend/src/services/pdf.service.ts:601-607, 650-656 | **Behoben.** `positionHeight` misst Zeile und Rechnungszeilen. Das ergibt Zeilenhöhe + 6 + Höhe der Rechnungszeilen + 3 und damit mehr, als `row` und `partsBelow` tatsächlich verbrauchen (Zeilenhöhe + Höhe der Rechnungszeilen + 3). Nachgestellt im Speicher (`/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/c226r2/sweep.ts`, 0–129 vorangehende Positionen): Mit Kategorie `"A\nB\nC\nD"`, `"A\n…\nG"` und der Kategorie aus dem Test (103 Zeichen) gibt es auf 53b3db99 keinen Fall mit getrennten Zeilen. Mit 12 Rechnungszeilen und umbrechender Formel (`sweep-many.ts`) auch nicht. Auf einer Kopie von cf49fa58 (`c226r2/old`, per `git archive`) trennt dieselbe Kategorie bei 20, 21, 62 und 103: Der neue Test ist dort rot. |
| C-2 | – | backend/src/services/pdf.service.ts:606 | **Behoben.** `room()` gilt nur, wenn `parts.length`. Eine Position ohne Rechnungszeilen ruft `row(doc, cells, top, { header })` auf wie auf fee5c0e9. |
| C-3 | – | backend/src/services/pdf.service.ts:668-676, 91/161/231/301 | **Behoben.** `otherDays` gilt auch für Positionen mit `invoiceParts`, und `{parts}` steht in allen vier `sharesNote`. Bei alten Abrechnungen (`invoice_parts` NULL) bleibt die Fussnote wie bisher. Den deutschen Text belegen der Render-Test (rot in 4e18ec6e) und die umgekehrte pg-Erwartung. Die Begriffe in fr/it/en siehe C-8. |
| C-4 | – | implementation_plan.md:14, 21 | **Behoben.** Die Zeile `Scenario red` nennt die geänderten Erwartungen und ihr Rot auf pg-Ebene. Die Zeile `No red:` begründet, warum der Test mit der Summe null kein Rot hat. |
| C-5 | – | implementation_plan.md:9 | **Behoben.** |
| C-6 | – | backend/src/services/calculation.service.ts:127-142 | **Behoben.** `rentalShare` verwendet `rentedIn`, und es gibt nur noch eine Definition. Das Verhalten bleibt gleich. |
| C-7 | – | – | Abgelehnt (`periodShare` ist optional). Die Begründung trägt, es bleibt dabei. |
| C-8 | Minor | backend/src/services/pdf.service.ts:161, 231, 301 | Der neue Satz übersetzt «Abrechnungsposition» mit «position», «posizione» und «position». `docs/design/i18n-begriffe.md:55` legt «poste du décompte», «voce del conteggio» und «statement line» fest. V-9 verlangte ausdrücklich, die Begriffe danach zu prüfen. Der Vorschlag aus V-9 wurde wörtlich übernommen. |
| C-9 | Minor | implementation_plan.md:306 | Die zwei neuen pg-Tests für V-12 haben weder eine Zeile `Test red:` noch eine Zeile `No red:`: «nennt eine Rechnung ohne Leistungszeitraum unter der Position mit den Tagen der Periode» und die neue Erwartung `not.toContain('01.06.2025 – 30.06.2025:')`. Beide sichern Code aus cf49fa58 ab. Wie beim Test mit der Summe null gehört dazu, wie ihr Rot gezeigt wurde, oder warum es keines gibt. |
| C-10 | Nit | backend/src/__tests__/statement-pdf-render.test.ts:260-263 | Den neuen Satz der Fussnote prüft nur der deutsche Test. Für fr/it/en prüft kein Test, dass `{parts}` gefüllt wird (die Render-Tests fr/it/en prüfen nur Zeilen und Formel). Laut `226-datenpruefung-1.md` ist fr/it/en «durch die Render-Tests abgedeckt». Für die Fussnote stimmt das nicht. |

## Bestätigt (Delta)

- **`readPdf`/`pageTexts`:** `text` gibt dasselbe wie vorher. Vorher wurden alle TJ-Stücke mit `\n` verbunden, jetzt je Stream und dann die Streams mit `\n`. `filter(Boolean)` entfernt nur Streams ohne Text (Schriften, Bilder). E2E (`tests/e2e/questions/download.ts`) und alle pg-Tests verwenden weiterhin `flowing`. Die Fixtures enthalten «01.04.2025» und «306.52» nur bei der langen Position, also findet `pageOf` die richtige Stelle.
- **V-11:** Regel 5 und der Szenario-Kommentar sagen «Berechnung». Das Szenario bleibt sonst unverändert und ohne `@wip`.
- **V-12, Zahlen nachgerechnet:** 01.08.–31.12. ab dem 15.08. ergibt 139 Tage. Juli–September hat 92 Tage, davon 47 gemietet. (365 × 139/365 + 900 × 47/92) / 1'265 = 598.78 / 1'265 = 47.33 %. Beim Mieter über die ganze Periode hat die negative Prüfung einen positiven Anker vorher (Zeile 105).
- **Diff:** Nichts ausserhalb der Anforderung. Die neuen Dateien unter `docs/reviews/` und `docs/design/personas/` sind Review-Berichte des Workflows. `messages/*.json`, `src/` und a11y bleiben unberührt (nur PDF).

## Nicht bestätigt

- lint, Backend-Tests (647 pass, 93.8 %), type-check, deepcheck:audit, fallow audit und E2E chromium+api `-g "PDF|Abrechnung"` (92 passed, 1 failed «Warnung, wenn für ein Gebäude keine Rechnungen erfasst sind», einzeln grün): vom Aufrufer gemeldet, nicht neu ausgeführt. `bun test` im Backend startet den DB-Preload, das ist mir nicht erlaubt. Ob der Fehlschlag mit dem Delta zu tun hat, habe ich nicht geprüft. Das Delta ändert an der Erzeugung (`calculation.service.ts`) nur die Form von `rentalShare`, nicht das Verhalten.
- Rot von «hält die Rechnungen auch bei einer langen Kategorie …» auf cf49fa58: nur mit meinem eigenen Skript auf einer `git archive`-Kopie nachgestellt (anderer Basis-Datensatz, gleiche Kategorie und Rechnungen, rot bei 20/21/62). Den Test selbst habe ich nicht ausgeführt.
- Rot des Render-Tests zur Fussnote in 4e18ec6e: vom Aufrufer gemeldet (Plan), nicht ausgeführt.
- test:coverage und check: vom Aufrufer gemeldet für cf49fa58. `src/` ist im Delta unverändert (`git diff --stat`).
- Ob die fr/it/en-Sätze für Mieter verständlich sind: nur gegen die Begriffstabelle geprüft (C-8), sprachlich nicht.
