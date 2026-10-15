# Code-Review issue-128, Runde 1

Geprüft: `origin/main..98516f6` (1 Commit, `fix(i18n): drop engine text from formula error`) im Worktree `review-128-code`. Alle 9 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | messages/de.json:418 (gleich fr/it/en:418) | Der neue Text nennt als erlaubte Variablen nur `{area}`, `{rooms}`, `{volume}`, `{units}`; erlaubt sind auch die Summen `{area_total}` … `{units_total}` (formula.service.ts:10-27, `backend_formula_unknown_variable` Zeile 409). Wer eine Summe verwendet, wird fehlgeleitet. |
| C-2 | Minor | backend/src/services/formula.service.ts:323, 401; messages/de.json:419, 424 | Die Meldung erscheint im Alert viermal (drei Musterwohnungen plus Wohnungsprüfung) und ist jetzt rund 140 Zeichen lang; das Alert hat damit rund 700 Zeichen, dazu doppelt «Die Formel kann für eine Wohnung nicht berechnet werden: Die Formel kann nicht berechnet werden. …». Die Struktur gab es schon vorher, die Länge kommt aus dieser Änderung. Die Personas sollen das beurteilen. |
| C-3 | Minor | docs/api-specification.md:29 | Dort steht noch `FORMULA_NOT_COMPUTABLE {detail}`; der Code hat keine Params mehr. |
| C-4 | Nit | tests/e2e/features/distribution-keys.feature:28-31, tests/e2e/targets/form.ts:4-5 | Das Szenario prüft mit `filter({ hasText })` nur einen Teilstring. Es bliebe grün, wenn der englische Text wieder hinter dem Hinweis stünde. Die Abwesenheit des Texts zeigen nur die Unit-Tests (`params: {}` im Backend, `toBe` im Frontend). Der Schritt bestand schon vorher. |
| C-5 | Nit | messages/de.json:418 (gleich fr/it/en) | `%` ist ebenfalls ein erlaubtes Rechenzeichen (formula.service.ts:226-229), fehlt aber in der Aufzählung «(+, -, *, /)». |

## C-1 (Major): unvollständige Liste der erlaubten Variablen

**Warum falsch:** Die Anforderung verlangt, dass die Meldung sagt, was zu prüfen ist, «the allowed variables» eingeschlossen. Die Meldung sagt «Prüfen Sie … die Variablen {area}, {rooms}, {volume} und {units}.» Die Summenvariablen sind aber erlaubt und gerade für gemischte Schlüssel gedacht (Kommentar formula.service.ts:10-11). Die Meldung zu einer unbekannten Variable nennt sie auch («und ihre Summen wie {area_total}», messages/de.json:409). Ein unerfahrener Verwalter, der `{area_total}` richtig verwendet und sich nur bei einem Rechenzeichen vertippt hat, liest jetzt, dass `{area_total}` nicht zu den erlaubten Variablen gehört. Er sucht den Fehler dann an der falschen Stelle. Das betrifft alle vier Sprachen.

**Wie zeigen:** `validateFormulaForDistribution('{area} / {area_total} 2')` (im Worktree mit `bun -e` ausgeführt) liefert viermal `reason: 'FORMULA_NOT_COMPUTABLE'`. Die UI zeigt dazu den Text, der die Summen auslässt. Ein Test in `backend-error.test.ts`, der für diesen Fall `{area_total}` im Text erwartet, schlägt fehl.

**Lösung:** Die Liste wie in `backend_formula_unknown_variable` ergänzen («… und ihre Summen wie {area_total}»), in allen vier Sprachen, und Unit-Test und Szenario anpassen.

## Bestätigt

- Backend: `coded('FORMULA_NOT_COMPUTABLE', …)` hat keine Params mehr (formula.service.ts:249). Der englische Text steht nur noch in `error`. `FORMULA_SAMPLE_FAILED` und `FORMULA_APARTMENT_FAILED` geben nur noch `sample` und `reason` weiter (mit `bun -e` geprüft).
- `backend_formula_not_computable` ist in allen vier `messages/*.json` ohne `{detail}`: Sie/vous/Lei bzw. formelles «Verifichi», «ss» kommt nicht vor, die Begriffe passen zu den bestehenden Formelmeldungen (Rechenzeichen/opérateurs/operatori/operators).
- Backend-Unit-Test formula-codes.test.ts:47-53 mit «{area} 2» zeigt den Code ohne Params. Frontend-Unit-Test backend-error.test.ts:132-144 zeigt den Text ohne den Detailtext, auch wenn der Body noch `detail` mitschickt.
- Ein Szenario ohne `@wip` ist vorhanden. Im Plan stehen `Scenario red`, `Test red` (für beide Tests) und `Skills: tdd, ponytail, ponytail-review`.
- Kein neuer Bildschirm und kein neuer UI-Zustand (nur ein anderer Text im bestehenden Fehler-Alert), also kein Eintrag in `screens.json` und den a11y-/Sprachen-Features nötig. Keine API-Contracts berührt (kein Contract enthält `FORMULA_NOT_COMPUTABLE`). Nichts geändert, das nicht zur Anforderung gehört.
- Der Kommentar `// #128:` ist kein Open-Work-Marker (Regex `TODO(fachlich prüfen, #n)` in tools/open-work/check-issues.mjs:24), blockiert also `Fixes #128` nicht.

## Nicht bestätigt

- `bunx vitest run src/__tests__/backend-error.test.ts`: von mir erneut ausgeführt, 13 grün.
- `bun run test:coverage` (2419), `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`, `deepcheck:audit`, E2E chromium+api `distribution-keys.feature` (9 grün): vom Aufrufer gemeldet.
- Backend-Test `formula-codes.test.ts`: nicht erneut ausgeführt, weil `bun test` in `backend/` über das Preload die Testdatenbank neu anlegt. Das Verhalten habe ich stattdessen mit `bun -e` gegen `validateFormulaForDistribution` geprüft.
- Wie der Alert tatsächlich aussieht (Länge, Umbruch bei 390 px, siehe C-2): ohne laufende UI nicht geprüft. Die Persona-Prüfung steht noch aus.
- Ob «Rechenzeichen» bzw. die Übersetzungen den Begriffen in `docs/design/i18n-begriffe.md` folgen: dort steht kein Eintrag dazu (grep in `i18n-begriffe.md` und `UBIQUITOUS_LANGUAGE.md`). Konsistent mit den bestehenden Meldungen in Zeile 414.
