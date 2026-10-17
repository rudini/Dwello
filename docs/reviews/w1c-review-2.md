# Code-Review W1c (#132), Runde 2 (Abschlussrunde vor dem Push)

Gegenstand: `git diff a2a921a 3edc963` im Worktree `review-w1c-code2` (detached, 3edc963), Commits 1de0da1, 153524c und 3edc963. Den Merge von `main` (99d26a2) habe ich nicht geprüft. Alle 16 geänderten Dateien habe ich gelesen. Die vier Berichte (`marco-w1c.md`, `weber-w1c.md`, `w1c-fachreview-2.md`, `w1c-review-1.md`) habe ich nur so weit gelesen, wie die Fixes auf sie verweisen. Dazu kam der Code darum herum: `heatingOfRun` (`backend/src/services/calculation.service.ts:435-460`), `handleMidYearMoves` (`backend/src/services/prorating.service.ts:190-225`), `ChangedStatements.svelte`, `fixtures/screens.ts` (Seed von `preview-outdated`), `tests/contracts/statements.json` und der Schritt `sagt die Vorschau {string}`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-12 | Major | `tests/e2e/features/statement-generate.feature` (fehlt); `src/lib/server/statement-generation.ts:157` | Die sichtbare Verhaltensänderung aus Dr. Weber P-2 / Fachreview V-8 hat kein Szenario: Bei einer Abrechnung, die die Heizkosten nach Tagen verteilt hat, nennt die Vorschau kein anderes Heizprofil. Belegt ist das nur durch den Unit-Test `statement-generation.test.ts:353`. |
| C-13 | Minor | `src/lib/server/statement-generation.ts:157` | Die Bedingung `share?.byDays === true` ist breiter als die Regel. Nur `reason: 'wholePeriod'` hängt nicht vom Heizprofil ab (`prorating.service.ts:216`). Bei `reason: 'noHeatingMonths'` (`prorating.service.ts:221`) tragen die Monate der Periode im verwendeten Heizprofil 0 %, und ein anderes Heizprofil des Laufs würde nach Monatsanteilen verteilen. Beispiel: Periode Juni bis August, gemischt mit Mittelland und einem Profil mit Sommeranteil. Gleiches gilt für `{ byDays: true }` ohne Grund, wenn das Profil beim Berechnen fehlte (`calculation.service.ts:445`). Dann verschwindet ein echter Unterschied. Vorschlag: `share?.reason === 'wholePeriod'`. Der Test bei Z. 353 nimmt schon `wholePeriod`. |
| C-14 | Minor | `tests/a11y/screens.json:42`; `tests/e2e/tasks/accessibility.ts:342` | Seit P-2 zeigt `preview-outdated` nur noch den Entwurf mit fehlender Rechnung, denn die Seed-Abrechnungen laufen über die ganze Periode, und die Bedeutung wurde entsprechend gekürzt. Die Hinweise «Erstellt mit dem Heizprofil …», «… Verwaltungspauschale …» und der Rat `statements_existing_same_settings` laufen damit durch keinen axe- und keinen Sprachen-Lauf mehr. Zuvor behauptete die Bedeutung das. Es ist derselbe Schritt, «once per place» ist also formal erfüllt. Für fr/it/en fehlt aber der Beleg, dass diese Texte nicht deutsch erscheinen. Gehört zu C-9. |
| C-15 | Nit | `src/lib/server/statement-generation.ts:197`, `:201` | Wenn eine der beiden Abfragen scheitert, fallen alle Einstellungshinweise weg. Ein Fehler bei den Heizprofilen unterdrückt so auch den Satz-Hinweis, der keine Heizprofile braucht. Ein Fehler bei den Mietverträgen unterdrückt auch den Heizprofil-Hinweis. Für einen reinen Hinweis vertretbar. Nur festgehalten. |
| C-16 | Nit | `src/routes/statements/generate/PreviewEmpty.svelte:26` | Der Abstand für Marco P-3 (`flex flex-col gap-2`, Token des 8-px-Rasters) hat keinen Test. Für eine reine Abstandsklasse ist das angemessen, und der design-guard deckt die Token-Regel ab. |

Stand der offenen Befunde aus Runde 1:

| ID | Stand |
|----|-------|
| C-2 | Gilt weiter: `editedSince` (`statement-generation.ts:147-150`) vergleicht weiterhin `updatedAt` (auch Fachreview V-12). |
| C-3 | Gilt weiter und wiegt etwas mehr: `heatingShare` fehlt in `tests/contracts/statements.json` (0 Treffer). Die neue Regel liest jetzt auch `heatingShare.byDays`/`reason`, im Unit-Test von Hand gebaut (`statement-generation.test.ts:347`, `:354`). Indirekt belegt ist das Feld durch das grüne E2E-Szenario «… Heizprofil danach bearbeitet …», das `byDays === false` aus `GET /statements` braucht. |
| C-4 | Gilt weiter: `Profile`, `Listed` als `Record<string, any>` mit `eslint-disable` (`:137-139`), dazu `managementFeePercent` und `createdAt` roh (`:148`, `:167`). |
| C-6 | Gilt weiter: die Mietverträge werden doppelt geholt (`:194`, über `contractsOf` Z. 51). |
| C-7 | Teilweise behoben: Ein Mietvertrag über die ganze Periode wird nicht mehr genannt. Offen bleibt: ohne Heizkosten (`heatingShare` null) wird ein anderes Heizprofil weiterhin genannt, und ohne gespeicherten Namen steht «Unbekannt» (V-9). Neu kommt C-13 dazu. |
| C-9 | Gilt weiter, erweitert durch C-14. |
| C-10 | Gilt weiter (`tests/e2e/steps/statement-generate.steps.ts:432`). |
| C-11 | Gilt weiter (`statement-generation.ts:199-204`). |
| C-1, C-5, C-8 | Behoben, siehe unten. |

ponytail-review des Deltas:
- `statement-generation.ts:L147-150`: `editedSince` ist eine neue Hilfsfunktion für eine einzige Aufrufstelle. Sie macht `profileDifference` lesbarer und ist neutral. Kein Befund.
- `statement-generation.ts:L195`: Die Typangabe `[{ contracts?: Contract[] }, Profile[]]` ersetzt den Cast `(contracts as Contract[])`. Das ist gleich lang und typsicherer. Kein Befund.
- `PreviewEmpty.svelte:L14-17`: Der Shrink-Vorschlag aus Runde 1 (Prop `outdatedOnly` statt Kopie mit Nullfeldern) bleibt offen. Der Test macht die Kopie jetzt aber belastbar. Nit, keine neue ID.
- net: Das Delta enthält nichts Ungenutztes. Den Ersatz von Z. 157 (C-13) kostet keine Zeile mehr.

## Blocker/Major

### C-12 (Major): Kein Szenario für «kein Heizprofil-Unterschied bei Verteilung nach Tagen»

**Warum falsch:** 3edc963 ändert, was der Liegenschaftsverwalter in der Vorschau sieht. Vorher stand bei einer Abrechnung über die ganze Periode «Erstellt mit dem Heizprofil «X», die neuen Abrechnungen mit «Y»», dazu der Rat, dasselbe Heizprofil zu wählen (Dr. Weber P-2). Das entfällt jetzt. Dahinter steht eine fachliche Regel (Fachreview V-8, PRD-Zeile 540: «made with another Heizprofil»), und sie gehört zu den Abnahmekriterien von #132. CLAUDE.md, Workflow Schritt 1, verlangt für jede Verhaltensänderung ein Szenario. Die E2E-Umgebung kann den Zustand herstellen: Der Seed kennt Mietverträge über die ganze Periode (z. B. Anna/Bruno in Seeblick, `fixtures/screens.ts:64-65`), `No scenario` ist also nicht begründbar. Die bestehenden Szenarien zum Heizprofil (`statement-generate.feature:371-386`) nehmen alle «Eva Frei» mit Januar bis März, also nur Fälle mit Mieterwechsel.

**Wie sich das Fehlen zeigt:** Entfernt man Z. 157 (`if (share?.byDays === true) return …`), wird nur der Unit-Test «nennt kein anderes Heizprofil, wenn die Abrechnung die Heizkosten nach Tagen verteilt hat» rot. Alle Szenarien in `statement-generate.feature` bleiben grün. Auch die axe-Zeile `preview-outdated` bleibt grün, denn sie wartet nur auf `existing-statements-changed-{building}`, und der veraltete Entwurf erscheint so oder so.

**Vorschlag:** Ein Szenario, etwa «Vorschau nennt kein anderes Heizprofil bei einer Abrechnung über die ganze Abrechnungsperiode». Darin eine Abrechnung mit «Winter» für einen Mietvertrag über das ganze Jahr, die Vorschau mit «Heizung Mittelland» und eine Negativprüfung nach einem positiven Anker (z. B. ein Satz-Hinweis derselben Abrechnung oder die Kennzahl der Vorschau). Wird C-13 übernommen, passt die Regel des Szenarios unverändert.

## Abgleich mit dem Delta

- **C-1 behoben:** `.catch(() => [{}, []])` um beide Abfragen (`statement-generation.ts:193-198`) und `known.length` als Bedingung (`:201`). Bei leeren Heizprofilen steht so nie «Unbekannt». Der Test `statement-generation.test.ts:407` lässt beide Abfragen mit 500 scheitern und erwartet den veralteten Entwurf. Ohne das `catch` würde `invoicesInPeriod` werfen, der Test war also rot. Das gemerkte Promise `profiles` (`:217-219`) hängt nach einem Fehler für alle Gebäude im abgelehnten Zustand. Jedes Gebäude fängt das aber selbst ab, und eine unbehandelte Ablehnung entsteht nicht, weil `Promise.all` einen Handler anhängt.
- **C-5 behoben:** Im DOM-Test `statement-wizard.dom.test.ts:461` hat der veraltete Entwurf jetzt `profileEdited: 'Winter'` und einen Satz. Erwartet wird als Notiz genau der Satz zu den fehlenden Rechnungen. Ohne `.map(...)` in `PreviewEmpty.svelte:17` kämen die Sätze zum Heizprofil und zum Satz dazu, der Test wäre also rot.
- **C-8 behoben:** Der JSDoc steht wieder über `droppedNotes` (`statement-wizard.ts:340`).
- **P-2 / V-8:** Code (`:157`) und Unit-Test (`:353`, rot ohne die Zeile, denn `hp2` ≠ Lauf). Der bestehende Test zum gelöschten Heizprofil wurde auf `byDays: false` umgestellt (`:347`), damit er seinen Fall weiter zeigt. Das ist richtig. Szenario fehlt (C-12), Bedingung zu breit (C-13).
- **Marco P-3:** `PreviewEmpty.svelte:26` mit `gap-2` (Token, 8 px). Das Gegenstück in `ChangedStatements.svelte:8` verwendet denselben Abstand.
- **V-14:** de `statements_existing_profile_edited` lautet jetzt «Die Abrechnung rechnet …». fr («Celui-ci est calculé …»), it («Il conteggio è calcolato …») und en («The statement uses …») sagten es schon so. DOM-Test (`:940`) und Szenario (`statement-generate.feature:400`) sind nachgezogen. Im Repo gibt es keinen Rest von «Sie rechnet mit».
- **V-15:** en `statements_existing_fee_contract` und `_none` lauten jetzt «provides for». Das ist nur Englisch, fr, it und de sind unverändert. Im Repo gibt es keinen Rest von «now agrees».
- **PRD (1de0da1):** Die Zeile 540 beschreibt die Hinweise so, wie der Code sie liefert: veraltete Entwürfe, gleiche Periode, anderes oder bearbeitetes Heizprofil, Satz «than the run would store for the contract», Links, «Neu berechnen» in #338. Die Einschränkung aus P-2 (nur wo das Heizprofil wirkt) nennt die PRD nicht. Ich führe das als Teil von C-12/C-13 und nicht als eigenen Befund.
- **`screens.json` / `accessibility.ts`:** Die Bedeutung und der Kommentar entsprechen dem Seed nach P-2 (siehe C-14).
- **`implementation_plan.md`:** Die Punkte sind nachgeführt. Weber P-1 steht unter «Blocked on me», weil die Regel «nur Entwürfe» vom Product Owner entschieden wurde. Das ist kein Befund dieses Reviews.
- **Nicht Verlangtes:** keines. Alle Änderungen gehen auf einen benannten Befund oder die PRD von #132 zurück.
- **Screenplay:** Das Delta ändert im E2E nur einen Szenariotext und einen Kommentar. Keine neuen Schritte, Tasks oder Questions.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run` (2802 auf 3edc963, 2803 nach dem Merge), fallow-Audit, E2E `--project=chromium --project=api` mit `statement-generate.feature` und `statement-detail.feature` (108), axe-/Sprachzeilen `preview-outdated`, `tank-question`, `preview-all-billed` (6). `cd backend && bun run type-check` und `api-contracts.pg.test.ts` meldet der Aufrufer für dieses Delta nicht. Das Delta berührt weder Backend noch Verträge.
- Selbst erneut ausgeführt auf 3edc963: `bunx vitest run src/__tests__/statement-generation.test.ts src/__tests__/statement-wizard.dom.test.ts`, 82 von 82 bestanden.
- Ob «Weiter» als Hauptaktion in der leeren Vorschau (Marco P-2) und Weber P-3 (Vorschlag in Schritt 3) bewusst offen bleiben, steht im Plan nicht ausdrücklich. Die Personaberichte habe ich nur zu P-1 bis P-3 gelesen.
- Der Merge 99d26a2 ist nicht geprüft, wie vereinbart.
- Ob es in der Praxis vorkommt, dass ein Lauf mit einem Heizprofil gegen eine Abrechnung mit `noHeatingMonths` läuft (C-13): Belegt ist nur, dass der Zustand möglich ist (Szenario `statement-generate.feature:93` erzeugt `noHeatingMonths` mit Mittelland). Eine Kombination mit einem zweiten Profil habe ich nicht ausgeführt.
