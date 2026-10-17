# Review #356 ZIP eines Abrechnungslaufs, Runde 4 (Abschluss vor dem Push)

Worktree: `/tmp/claude-0/-home-user-Dwello/94414f17-b1bd-53cb-a045-3212fe00129f/scratchpad/review-zip-code4` (5509e48, detached).
Umfang: `git diff 396cd26 fdb2714` (5 Dateien, alle gelesen: `tests/e2e/tasks/accessibility.ts`, `docs/reviews/workflow-notes-issue-356.md`, `docs/reviews/zip-review-3.md`, `implementation_plan.md`, `docs/archive/implementation-plan-verlauf.md`) und der Merge 5509e48 (kombinierter Diff von `tests/e2e/fixtures/screens.ts` und `docs/archive/implementation-plan-verlauf.md`; dazu `git diff fdb2714 5509e48` der Dateien, die dieser Slice auch berührt: `src/lib/server/statement-generation.ts`, `src/lib/statement-wizard.ts`, `backend/src/services/statement.service.ts`, `tests/contracts/statement.json`, `tests/e2e/tasks/accessibility.ts`).

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-13 | erledigt | `docs/reviews/workflow-notes-issue-356.md:6` | Nennt jetzt `2016 + n % 7` und den Lernpunkt (Modulzähler pro Worker, Testdaten pro Szenario). |
| C-14 | erledigt | `tests/e2e/tasks/accessibility.ts:99-104` | Kommentar zu `previewOf` steht jetzt direkt über `previewOf`, der zu `resultRuns` über `resultRuns`. Nur Kommentare verschoben. |
| C-15 | Nit | `docs/archive/implementation-plan-verlauf.md:1021-1022` | Nach der Konfliktauflösung fehlt die Leerzeile zwischen der «Files changed …»-Zeile der Session #68/#102/#191/#114 und `## Session 2026-10-17: #111 …`. Rendert als Überschrift (ATX darf einen Absatz unterbrechen), weicht aber vom Format aller übrigen Sessions ab. |

## Blocker/Major

Keine.

## Anforderung gegen Code und Test (Delta)

- C-13, C-14: durch den geänderten Text bestätigt (siehe Tabelle).
- Plan: Session aus `implementation_plan.md` entfernt, im Archiv vollständig und abgehakt (inkl. Runde 3); `implementation_plan.md` hat danach keine Session mehr. Durch Text bestätigt.
- Merge `screens.ts`: Zustandsliste der frühen Rückkehr enthält `generation-result` (dieser Slice) sowie `old-address-task` und `old-address-preview` (main); die frühe Rückkehr liefert `heatingProfile: ''`, passend zum Typ `Example` (Z. 25) und zur vollen Rückgabe (`heatingProfile: ids.heatingProfile!`). Keine Konfliktmarker in beiden Dateien.
- Neue Seed-Daten von main gegen den Zustand `generation-result` (`accessibility.ts:350-364`, Jahre `2016 + n % 7` = 2016–2022, nur Gebäude `example.building` = Seeblick): main fügt Ida und Kurt (Bergsicht 2.04/2.05, Verträge 2024-01-01 bis 2024-06-30) und die Abrechnung «Ida 2024» in **Bergsicht** hinzu; in Seeblick ändert main nur Carlas Vertragsende von 2099-12-31 auf 2098-12-31 (#296). Damit hat Seeblick in 2016–2022 weiterhin keine Abrechnungen und keine Rechnungen (Abrechnungen 2023–2025, Rechnungen 2024/2025), Anna, Bruno und Carla bleiben abrechenbar, `confirm-missing-invoices` erscheint weiter. Der Kommentar Z. 99–100 stimmt nach dem Merge.
- Zusammenspiel mit main ausserhalb der Konflikte: `generateStatements` (BFF) liest aus der Generate-Antwort nur `id`; main ergänzt `oldAddress` in Antwort und `tests/contracts/statement.json`, das berührt die ZIP-Route nicht. Mains `updateStatementStatus` setzt beim Versenden `pdfBlob` zurück; die ZIP enthält frisch erzeugte Entwürfe, nicht betroffen. `statement-wizard.ts` importiert `impossible` jetzt aus `contract-form` (main, #296), unabhängig vom ZIP-Code.

## Nicht bestätigt

- `bun run lint` sauber, `bun run check` 0 Fehler, Backend-Type-Check sauber, Vitest 2812 passed, E2E `--project=chromium --project=api -g "Nebenkostenabrechnungen erstellen|generation-result|statement-zip-refused|gelöscht"` 62 passed, alles auf 5509e48: vom Aufrufer gemeldet, nicht selbst ausgeführt (E2E nicht erlaubt; Vitest nicht wiederholt, da das Delta nur Kommentare, Markdown und Testdaten von main betrifft).
- Mains eigener Code im Merge (A-5 #114, #79, #296 usw.) ist nicht Teil dieses Reviews; er wurde in dessen eigenen Reviews geprüft. Nebenbei gesehen, nicht von diesem Slice: der Kommentar `accessibility.ts:368` nennt «Fritz moved out», die Seed-Daten meinen Ida/Kurt (Fritz zieht 2100 ein) – stammt von main.
