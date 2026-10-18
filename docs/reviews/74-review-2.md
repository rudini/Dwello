# Review #74 (F-14c), Runde 2: Delta 95b546f..b26adbb

Worktree: `/tmp/claude-0/-home-user-Dwello/fb96b225-d7d3-5f60-a70e-544f6e089c40/scratchpad/review-74-code2`
Gelesen (alle Dateien im Delta): `backend/src/__tests__/fuel-stock.pg.test.ts` (Diff und Zeilen 160-195), `docs/archive/implementation-plan-verlauf.md` (neue Session), `docs/reviews/74-review-1.md`, `docs/reviews/workflow-notes-issue-74.md`, `implementation_plan.md`. Dazu `backend/src/routes/invoices.ts:254-262` (POST `/`).

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-5 | Nit | docs/archive/implementation-plan-verlauf.md:791 | «Push, pull request, CI and merge follow» ist schon angekreuzt, obwohl das noch aussteht. Der Plan muss vor dem letzten Commit archiviert werden, deshalb ist das vertretbar. Genauer wäre «Push, pull request, CI and merge: after this commit (Workflow 9)». |

Keine Blocker und keine Majors.

## Prüfung der offenen Befunde aus Runde 1

- **C-1 (Herkunft #190 → #25): behoben.** Der archivierte Eintrag nennt «since #25 (merged 2026-10-08, before #74 was written)» und beim «No scenario» ebenfalls #25. Die alte Fassung mit #190 ist mit `implementation_plan.md` entfernt. In den Workflow-Notizen steht #25 (2026-10-08), und der flache Klon ist als Ursache des Fehlers genannt. Ob der PR-Text #25 nennt, lässt sich erst prüfen, wenn er vorliegt (siehe «Nicht bestätigt»).
- **C-2 (Status des POST prüfen): behoben.** `expect(purchase.status).toBe(201)` steht vor `toEqual([])`. Die Route setzt `set.status = 201` (`routes/invoices.ts:260`). Meine Angabe «200» aus Runde 1 war falsch. Lehnt die Route die Rechnung ab, wird der Test jetzt rot und bleibt nicht leer grün.
- **C-3: abgelehnt, mit Begründung.** Die Ablehnung trägt: Der Test ist der Nachweis für genau den Fall aus #74 und schliesst das Issue. Es war ohnehin nur ein Nit.
- **C-4: erledigt.** `implementation_plan.md` ist wieder identisch mit der Basis b0c8cef, die Leerzeile am Dateiende eingeschlossen. `git diff --check` meldet sie nur, weil sie schon auf der Basis steht.

## Weitere Prüfung des Deltas

- **Archivierter Eintrag:** Er ist vollständig angekreuzt, nennt die Dateien und «No scenario: …». `open-work.test.ts` erlaubt eine Session, der Plan hat jetzt keine. `bunx vitest run src/__tests__/open-work.test.ts` habe ich selbst ausgeführt: 5/5 grün.
- **`docs/reviews/74-review-1.md`:** Das ist die abgelegte Fassung des Berichts aus Runde 1, unverändert. Die Ablage folgt dem Muster der übrigen Berichte in `docs/reviews/`.
- **`docs/reviews/workflow-notes-issue-74.md`:** Die Ablage folgt dem Muster der übrigen `workflow-notes-issue-*.md`. Alle drei Zeilen sind sachlich zutreffend. Regeldateien werden nicht geändert, es sind nur Vorschläge.
- **Nichts Fremdes im Delta:** bestätigt. Es gibt keinen Produktionscode, keine Texte, keine Verträge und keine E2E- oder a11y-Dateien.
- **ponytail-review:** Die Teständerung ist minimal (eine Bindung, eine Erwartung). Ich habe nichts zu beanstanden.

## Nicht bestätigt

- `cd backend && bun test src/__tests__/fuel-stock.pg.test.ts` (19 pass, mit 201 grün, mit 200 rot): vom Aufrufer gemeldet, nicht erneut ausgeführt (laut Auftrag starte ich keine Backend-Tests). Den Status 201 habe ich durch Lesen von `routes/invoices.ts:260` bestätigt.
- `bun run lint`, `bun run check`, `cd backend && bun run type-check` auf 95b546f: vom Aufrufer gemeldet. Das Delta ändert nur eine Testzeile (typkorrekt durch Lesen: `sendJson` liefert eine `Response`, gleiche Nutzung wie in Zeile 141) und Dokumente.
- Der PR-Text (`Fixes #74`, Herkunft #25, `No scenario: …`) liegt noch nicht vor.
