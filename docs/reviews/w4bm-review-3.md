# Code-Review W4b-Mietstatus, Runde 3 (Abschluss, e39481c..c7c11ba)

Worktree: `/tmp/claude-0/-home-user-Dwello/91846713-a6c9-5452-8f2c-4a3754630714/scratchpad/review-w4bm-code3` (detached, c7c11ba). Gelesen habe ich alle neun Dateien der Delta. Dazu kamen `apartment-detail.feature`, `dashboard.feature`, die Schritte `erklärt die Wohnungsseite beim Mietstatus` (`apartment-detail.steps.ts:90`) und `erklärt die Belegung` (`dashboard.steps.ts:187`), `BuildingFigures.svelte:62/150`, die Status-Logik in `apartment.service.ts:42-54`, die Nutzer von `statusText` sowie V-1 in `w4bm-fachreview-1.md` und `w4bm-fachreview-2.md`.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-9 | erledigt | `apartment-detail.feature:31`, `dashboard.feature:21`, `dashboard-page.test.ts:170-177` | Beide Szenarien prüfen jetzt den Nebenkosten-Hinweis, und zwar bei einer Wohnung, die nie vermietet war: 3.02 in Lindenhof und 1.02 in Seeblick haben keinen Mietvertrag. Mit der alten Bedingung (`&& lastContractEnd` bzw. `some((v) => v.lastContractEnd)`) wären beide Schritte und der neue Seitentest rot. Die Schritte nutzen bestehende Questions, die den Text liefern (`toContain` bzw. `toBe`) |
| C-10 | erledigt | `src/routes/contracts/new/+page.server.ts`, `contract-new-load.test.ts` | Gegen den Merge-Base mit `origin/main` (84ea945) ist der Diff leer. Die Rücknahme ist also vollständig. `statusText` nutzen weiter vier Komponenten; nichts bleibt ungenutzt zurück |
| C-11 | erledigt (abgelehnt, Grund trägt) | `implementation_plan.md:17` | Der Teil von P-3 zu 3.02 ist V-1 des Fach-Reviews (Minor). `w4bm-fachreview-2.md:65` erklärt ihn ausdrücklich zur Sache des Product Owners. Die Ablehnung mit Grund ist daher korrekt. Weil der Punkt Minor ist, braucht es laut CLAUDE.md, «Open work», kein Issue |
| C-12 | erledigt | `tests/contracts/apartments.json:10` | `occupied` mit `currentContractEnd`, `nextContractStart` und einem früheren `lastContractEnd` passt jetzt zusammen: `occupied` geht in `apartment.service.ts:53-54` vor `relet` |
| C-13 | erledigt | `implementation_plan.md:16-17` | Die Zeile mit den falschen Anführungszeichen ist ersetzt |
| C-14 | Nit | `implementation_plan.md:17` | Die Zeile zu Runde 2 nennt C-13 nicht, obwohl er erledigt ist |

ponytail-review: In der Delta habe ich nichts zum Kürzen gefunden. Die Rücknahme von C-10 auf den Stand von `main` ist der kürzeste Diff. Eine Löschung von `status` im Assistenten wäre Arbeit an Code, den der Branch nicht ändert. Die neuen Tests und Szenariozeilen nutzen nur bestehende Schritte.

Keine Blocker, kein Major.

## Anforderungen: Abgleich der Delta

- **#145 / Persona Anna P-1 und P-3 (Wohnung, die nie vermietet war):**
  - Auf der Wohnungsseite und auf der Übersicht ist der Hinweis jetzt auf zwei Ebenen getestet: Seitentest und E2E. Für die Wohnungsseite gibt es zusätzlich den DOM-Test aus Runde 2.
  - Der Text stammt aus bestehenden Schlüsseln. Neue UI-Texte gibt es in dieser Delta nicht.
  - Es gibt auch keinen neuen Bildschirmzustand. `apartment-detail-vacant` steht schon in den a11y-Listen.
- **#58 (Assistent):** Im Assistenten ändert sich nichts gegenüber `main`. Das ist richtig, denn der Assistent zeigt den Status nicht an.
- **Persona-Bericht (a456df5):** Es ist nur Dokumentation. Der absolute Pfad zum Scratchpad entspricht dem bisherigen Brauch, siehe `anna-233.md` und `anna-i*.md`.
- **Screenplay:** Die Steps rufen nur Questions auf (`apartmentInfo('status')`, `occupancyHelp`). Die Szenariozeilen sagen, was der Verwalter liest, nicht wie er die Seite bedient.
- **Nichts Fremdes:** Alle Änderungen beantworten C-9 bis C-12 oder den Persona-Durchgang.

## Nicht bestätigt

Selbst erneut ausgeführt: `bunx vitest run` für `dashboard-page.test.ts`, `dashboard.test.ts` und `contract-new-load.test.ts`. Ergebnis: 26 bestanden.

Vom Aufrufer gemeldet, nicht erneut ausgeführt:
- `bun run lint`, `bun run check` und Backend type-check, auf c7c11ba und nach dem Merge von `origin/main`
- `bunx vitest run` komplett (2725)
- Backend `tenant-status.pg`, `apartment-status.pg` und `api-contracts.pg` (47). Dass der geänderte Beispieldatensatz in `apartments.json` die Drift-Prüfung besteht, habe ich nur durch Lesen geprüft: `drift()` vergleicht Typen, und `status` bleibt ein String
- Volles E2E chromium+api (837), aber auf e39481c. Die zwei neuen Szenariozeilen liefen dabei also nicht mit
- E2E der betroffenen Features auf dem gemergten Stand: laut Aufrufer läuft es noch. Dass die beiden neuen Zeilen grün sind, ist deshalb nicht bestätigt. Rot vor der Änderung habe ich nur durch Lesen beurteilt

Nicht geprüft: den Merge mit `origin/main` selbst. Der Worktree steht auf c7c11ba, nicht auf dem Merge-Commit.
