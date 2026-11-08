# Review i845, Runde 1 (db886e34, `git diff HEAD^ HEAD`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/areas.json:28-235 | Viele `paths` nennen gemeinsam genutzte Module (BFF-Mapper in `src/lib/server`, Backend-Services), die auch andere Bereiche oder die ganze App importieren; ihre Änderung wählt nur einen Bereich. Zwei sind ganz dem falschen Bereich zugeordnet. Kein Test prüft, ob ein zugeordnetes Modul nur im eigenen Bereich importiert wird |
| C-2 | Major | tests/e2e/areas.json:16 | `(^\|/)__tests__/` in `ignore` lässt `backend/src/__tests__/helpers/pdf-text.ts` durch, das `tests/e2e/questions/download.ts:4` importiert: eine Änderung daran führt nur `always` aus, keines der Szenarien mit PDF-Prüfung |
| C-3 | Minor | docs/test-pyramid.md:102 | «unit tests, tools and docs count for no area» stimmt nicht für E2E-Code unter `__tests__` (C-2). Ausserdem sagt der eingeschobene Satz nicht, dass die Freigabe nach `ignore` auch `tests/contracts/` betrifft |

## C-1 Gemeinsam genutzte Module wählen nur einen Bereich

Laut Entscheid führen geteilte Teile alles aus («shared components … run everything»). `areas.json` ordnet aber Module, die mehrere Bereiche importieren, einem einzigen Bereich zu. Die Ausgabe des Skripts im Worktree (`echo <datei> | node tools/ci/e2e-areas.mjs`):

- `backend/src/services/invoice.service.ts` → nur `features/invoice` (plus `always`). Der Service wird aber auch von `statement.service.ts`, `calculation.service.ts`, `statement-invoices.service.ts`, `cost-reconciliation.service.ts` und `agreed-category.service.ts` importiert. Ein Fehler in den Rechnungssummen zeigt sich in `statement-*.feature` und `reports.feature`, die dabei nicht laufen.
- `src/lib/server/missing-statements.ts` → `features/statement`. Der einzige Importeur ist aber `src/routes/contracts/+page.server.ts:4`, also das Szenario «Mietvertragsliste zeigt eine fehlende Abrechnung» (`contracts.feature:85`), und das läuft dabei nicht. Gleich falsch zugeordnet ist `backend/src/services/contract-tasks.service.ts` (Bereich contracts, einziger Importeur ist `backend/src/routes/dashboard.ts`).
- `src/lib/server/backup.ts` → nur `sicherung.feature`. Importiert wird es aber von `src/hooks.server.ts` (jede Anfrage), `dashboard/+page.server.ts`, `privacy/+page.server.ts` und `config/+page.server.ts`. Ähnlich sieht es im Backend aus: `backup.service.ts`, `ki-settings.service.ts`, `ki-model.service.ts` und `setup.service.ts` importieren `backend/src/index.ts` bzw. `app.ts` beim Start.
- Weitere Fälle, Modul → Importeure aus anderen Bereichen:
  - `src/lib/server/apartment.ts` → `buildings/[id]`
  - `tenant.ts` → `contracts/new`, `contracts/[id]`, `documents`
  - `contract-history.ts` → `tenants/[id]`
  - `category.ts` → `contracts/*`
  - `documents.ts` → `tenants/[id]`, `statements/[id]`, `statement-actions.ts`
  - `settings.ts` → `statements/[id]`, `statements/[id]/edit`
  - `heating-profile.ts` → `statements/generate`
  - `cost-reconciliation.ts` → `reports/*`
  - `statement.ts` → `documents/refused`
  - `zip-download.ts` → `tenants/[id]/export`
  - `ki-settings.ts` → `invoices/+page.server.ts`
  - Backend:
    - `building.service` → `invoices.ts`, `reports.ts`, `apartments.ts`, `invoice.service`
    - `apartment.service` → `contract.service`, `statement.service`, `calculation.service`, `dashboard.ts`, `data-export.service`
    - `tenant.service` → `document.service`, `statement-send.service`, `reminder.service`, `contracts.ts`
    - `contract.service` → `statement-run`, `statement-pdf`, `calculation`, `prorating`, `dashboard.ts`
    - `statement.service` → `dashboard.ts`, `tenant-export.service`, `contract-tasks.service`, `reminder.service`
    - `statement-invoices.service` → `invoices.ts`, `dashboard.ts`
    - `statement-run.service` → `contracts.ts`, `move-out`
    - `statement-pdf.service` → `config.ts`, `reminder.service`
    - `category.service` → `invoice.service`, `llm.service`
    - `distribution-key.service`, `heating-profile.service` → `calculation.service`, `config.service` (beim Heizprofil auch `statement-run` und `statement-pdf`)
    - `document.service` → `invoice.service`, `statement-send.service`, `contract-tasks.service`
    - `access-key.service` → `mcp.ts`, `audit-log.ts`, `data-export.service`
    - `config.service` → acht Statement-, Dashboard- und Export-Services
    - `default-setting` → `heating-profile.service`, `distribution-key.service`
    - `tenant-export.service` → `data-export.service`

So zeigt es sich: Ein PR ändert nur `src/lib/server/missing-statements.ts` so, dass `missingByContract` leer antwortet. Das Skript gibt `features/statement` aus, `contracts.feature:86` läuft nicht, der PR wird grün, und erst `main` wird rot. Genau dieses Risiko (zu wenig gewählt) fängt `main` erst nach dem Merge.

So lässt es sich beheben: In `paths` gehören nur Module, die ausschliesslich der eigene Bereich importiert. Meist sind das die Seiten- und Routendateien. Ein geteiltes Modul bleibt ohne Bereich (dann läuft alles) oder nennt die Features aller Bereiche, die es nutzen. Dazu gehört ein Test in `e2e-areas.test.ts`, der für jede Datei, die ein `paths`-Muster trifft, die Importeure in `src/` und `backend/src` sucht und verlangt, dass sie im selben Bereich liegen. Sonst öffnet ein späterer Import aus einem anderen Bereich die Lücke wieder, ohne dass es jemand merkt.

## C-2 E2E-Code unter `__tests__` wird übergangen

`tests/e2e/questions/download.ts:4` importiert `readPdf` aus `../../../backend/src/__tests__/helpers/pdf-text`. Benutzt wird es von `statement-detail.steps.ts`, `statement-generate.steps.ts`, `tenant-documents.steps.ts`, `tenant-export.steps.ts` und `data-export.steps.ts`. `echo backend/src/__tests__/helpers/pdf-text.ts | node tools/ci/e2e-areas.mjs` gibt nur `features/sprachen-bildschirme.feature features/demo.feature` aus. Eine Änderung, die alle PDF-Fragen leer antworten lässt, bleibt damit im PR unbemerkt. Laut Entscheid gehören E2E-Schritte (`tests/e2e/`) zu «run everything», und dieser Helfer ist E2E-Code ausserhalb von `tests/e2e/`. Abhilfe: In `ignore` nur Testdateien ausnehmen (`\.test\.ts$`, `__tests__/.*\.test\.ts$`) und keine Helfer. Ein Test sollte prüfen, dass keine Datei, die `tests/e2e/**` importiert, unter `ignore` fällt.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - vitest `tools/ci`, `tools/deepcheck/test`, `tools/testcheck/test`
  - open-work (289)
  - lint, check, fitness, backend type-check
  - prettier auf den neuen Dateien
  - testcheck- und deepcheck-Audit
  - der jq-Lauf für 2/5/12 Shards
  - `playwright test --list` (454 Tests in 6 Dateien gegen 1705 in 57)
  - dass die neuen Tests vor dem Code rot waren
- Dass Playwright bei einem Dateifilter, der zu einer gelöschten Feature-Datei auf nichts trifft, nicht abbricht: nur aus der Logik abgeleitet (die übrigen Filter treffen immer); nicht ausgeführt.
- Ob Features eines Bereichs über Seiten eines anderen Bereichs navigieren (z. B. Wohnungsszenarien über die Gebäudedetailseite): nicht in den Tasks nachverfolgt; die Importeure in C-1 genügen als Beleg.
- Ob das CI-Laufzeitziel (weniger Runner-Minuten) erreicht wird: Messung laut Entscheid erst nach dem Merge.

Geprüft: Verdrahtung in Shell und YAML (`set -e` mit `[ -n ] &&` als letzte Anweisung im `if` bricht nicht ab, lokal mit `bash -eo pipefail` geprüft; `--arg filter`; `changed.txt` vor der Docs-only-Prüfung erzeugt, `fetch-depth: 0`); `e2e-results` zählt mit `shards` = 2 die Jobs «E2E tests (n/2)» richtig; `bun run test:e2e --` hängt die Filter an `playwright test` an; `tools/e2e/build-if-changed.mjs` in `ignore` ist unkritisch, weil jeder E2E-Lauf ihn startet; ponytail-review: kein ungenutzter Code, keine Kopie eines Helfers.
