# Code-Review O-47, Runde 1 (41d253d..2ae3f66)

## Befunde

Keine Blocker, Major oder Minor.

Geprüft: `playwright.config.ts` setzt nirgends `retries` (weder global noch in einem der Projekte `api`, `chromium`, `firefox`, `webkit`, Z. 181–240), also hat `trace: 'on-first-retry'` nie aufgezeichnet; `trace` wird in keinem Projekt überschrieben, die Änderung gilt also auch für Firefox. CI lädt bei `failure()` `playwright-report/`, `cucumber-report/` und `test-results/` als Artefakt `${reports}-${shard}` hoch (`.github/workflows/ci.yml:240-249`), Aufbewahrung 7 Tage; der Name `e2e-reports-*` in O-47 stimmt mit `matrix.reports` (Z. 189) überein. `test-results/` steht in `.gitignore:43`. Die Zeile O-47 hat die vier Spalten der Tabelle (ID, Point, Where, Decide / do), die ID ist neu und eindeutig (O-46 ist die höchste bisher; die Regex in `open-work.test.ts:69,76` passt), sie ist nicht-funktional (Test-Zuverlässigkeit) und nennt die Issue #575; die genannten Stellen (`handleSearch`, `goto` in `src/routes/buildings/+page.svelte:3,24-26`) existieren. O-41 ist im Archiv (`docs/archive/offene-punkte-verlauf.md:329`). Commit-Betreff `chore(tests): …` hält Konvention und 50 Zeichen ein. Kein Szenario nötig: keine Verhaltensänderung der App. Nichts Fremdes im Diff.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/open-work.test.ts tools/e2e/build-if-changed.test.ts` (16 bestanden): vom Aufrufer gemeldet, nicht wiederholt.
- Kosten: `retain-on-failure` zeichnet jeden Test auf und verwirft die Spur nur bei Erfolg; der Mehraufwand an Laufzeit pro Test (Snapshots, Screenshots im Trace) bei 30-s-Testtimeout und 2 Workern in CI ist nicht gemessen (kein E2E-Lauf erlaubt). Ein knapper Test könnte dadurch langsamer werden; das zeigt erst der nächste CI-Lauf. Grösse: Traces entstehen nur bei Fehlschlägen, das Artefakt nur bei `failure()` und 7 Tage; der HTML-Reporter kopiert Traces zusätzlich nach `playwright-report/data`, sodass sie im Artefakt doppelt liegen können. Eine Grössengrenze von `upload-artifact@v7` wird bei einzelnen Fehlschlägen nicht erreicht; bei einem Massenausfall nicht geprüft.
- Ob der Fehler aus #575 sich im Trace zeigt (Submit nicht ausgeführt vs. Navigation abgebrochen): erst beim nächsten Auftreten prüfbar.
