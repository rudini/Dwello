# Code-Review #211 / #199 (jetzt #408), Runde 2

Worktree: `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/review-211-code2` (Commit 40002869), Delta `ca7170e7..40002869` (4 Commits, 22 Dateien). Alle geänderten Dateien im Delta gelesen; die Persona- und Fachreview-Berichte nur auf Befunde, die den Code betreffen.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | erledigt | `MissingStatement.svelte:30`, Kommentare, `contract-detail.feature:258` | Marker und Kommentare nennen jetzt #408. `grep "#281"` in `src`, `backend/src`, `tests` findet nichts mehr. #408 ist offen (`fachlich,entscheiden`), #199 offen. |
| C-2 | Major (Produktentscheid, bleibt) | `src/lib/overview.ts`, `MissingStatement.svelte` | Bestätigt als Fall für «Blocked on me» mit `Refs #408`/`Refs #199`. Zum Rechnungsformular kein Einwand: `invoiceStatements` (`backend/src/services/statement-invoices.service.ts:71-87`) bestimmt «abgerechnet» über die Abrechnungen des Gebäudes und über `getInvoicesForStatement(building, periodStart, periodEnd)`, also über die Periode der Abrechnung und nicht über das Kalenderjahr. |
| C-3 | erledigt | `messages/*.json:1612`, `contract-detail-page.dom.test.ts:276` | Neuer Text in allen vier Sprachen. Die Namen der Schaltflächen passen zu `contracts_statement_create` (de «abrechnen», fr «Établir», it «Allestire», en «Bill»). Der DOM-Test scheitert mit dem alten Text. **Aber:** zum fr-Text siehe C-16. |
| C-4 | teilweise, siehe C-17 | `tests/a11y/screens.json:287-293` | Zustand, Bedeutung, beide Features und der Seed sind vorhanden. Die Bildschirmliste verletzt aber eine Regel der Unit-Tests (C-17). |
| C-16 | Major | `messages/fr.json:1612` | Der neue fr-Text setzt `« Établir »` mit normalem Leerzeichen. `src/__tests__/i18n.test.ts:23` («Französisch setzt Guillemets mit geschütztem Leerzeichen innen») ist auf 40002869 rot. |
| C-17 | Major | `tests/a11y/screens.json:287-293` | Der neue Bildschirm `contract-partly-billed-detail` beginnt mit `partly-billed` statt mit `default`. `tests/unit/a11y-screens.test.ts:25` («beginnt jeden Bildschirm mit seinem Grundzustand») ist auf 40002869 rot. |
| C-5 … C-11 | Minor (bleiben) | wie Runde 1 | Kein Einwand, dass sie Minor bleiben. C-5 = V-18, C-6 = V-21, C-7 = V-15, C-8 = V-11 decken sich mit Fachreview 3, die sie ebenfalls als Minor führt. |
| C-18 | Nit | `tests/e2e/tasks/accessibility.ts:224-225` | ponytail `reuse:` `'partly-billed'` ist dieselbe Activity wie `'missing-statements'`. Mit C-17 (Zustand `default`) fällt der Eintrag ganz weg. |
| C-19 | Nit | `tests/e2e/fixtures/screens.ts:127-131` | Lea wird in jedem Bildschirm mit Ids geseedet, auch in den Assistenten für Bergsicht 2024 (`old-address-preview`, `every-wizard-step`). Deren Inhalt ändert sich dadurch (zusätzlich ein Mietvertrag mit einer Abrechnung für einen Teil von 2024). Laut Aufrufer ist der E2E-Lauf grün. Den Seed nur für `partlyBilledContract` anzulegen, wäre aber enger. |

ponytail-review des Deltas: L224-225 reuse (C-18). Sonst ist der Delta knapp (Umstellen der Reihenfolge, eine Zeile pro Periode). net: −2 Zeilen möglich.

## C-16 (Major): fr-Guillemets ohne geschütztes Leerzeichen

**Warum falsch.** In der Typografie für Französisch steht innen an «» ein geschütztes Leerzeichen (U+00A0). Das Repo prüft das, und CI wird damit rot.

**Zeigen.** `bunx vitest run src/__tests__/i18n.test.ts` auf 40002869: 1 failed, Treffer `contracts_statements_missing_text` mit «Chaque bouton « Établir » ouvre …» (normale Leerzeichen).

**Korrektur.** `« Établir »` in `messages/fr.json:1612`.

## C-17 (Major): Neuer Bildschirm ohne Grundzustand an erster Stelle

**Warum falsch.** `tests/unit/a11y-screens.test.ts:25-27` verlangt `states[0] === 'default'` für jeden Bildschirm. `contract-partly-billed-detail` hat nur `["partly-billed"]`. CI wird rot.

**Zeigen.** `bunx vitest run tests/unit/a11y-screens.test.ts` auf 40002869: 1 failed, Treffer `contract-partly-billed-detail`.

**Korrektur.** Wie bei `contract-moved-out-detail`: `"states": ["default"]`, in beiden Features die Zeile `| contract-partly-billed-detail | default |`. Die Bedeutung «partly-billed» in `stateMeanings` und den Eintrag in `tasks/accessibility.ts` entfernen. Was der Bildschirm zeigt, kann ein Kommentar beim Seed festhalten. Ob `stateMeanings` eine Bedeutung je Bildschirm erlaubt, habe ich nicht geprüft; ein Zustand `partly-billed` an zweiter Stelle nach `default` ginge auch, prüft dann aber dieselbe Seite zweimal.

## Nicht bestätigt

- `bun run lint`: vom Aufrufer gemeldet. `bun run check` und `cd backend && bun run type-check` sind für 40002869 nicht gemeldet und nicht gelaufen.
- Selbst gelaufen auf 40002869: `bunx vitest run tests/unit/a11y-screens.test.ts tests/unit/i18n-screens.test.ts src/__tests__/i18n.test.ts src/__tests__/contract-detail-page.dom.test.ts src/__tests__/contract-list.test.ts src/__tests__/contract-actions.test.ts src/__tests__/open-work.test.ts`. Ergebnis: 155 grün, 2 rot (C-16, C-17). Der Aufrufer hat genau diese beiden Dateien nicht gemeldet. Die volle Unit-Suite habe ich nicht laufen lassen.
- E2E (`-g "Bildschirm|Mietvertragsdetail|Mietvertragsliste|Übersicht"`: 496 grün, 1 rot und beim Wiederholen grün): vom Aufrufer gemeldet. Ob axe für `contract-partly-billed-detail` gelaufen ist, und das in allen Ansichten hell und dunkel: nicht gesehen. Nach C-17 ändert sich der Zustandsname, also muss der Lauf wiederholt werden. Den unstabilen Lauf `contract-new` overlap-warning habe ich nicht untersucht; er liegt ausserhalb des Deltas.
- api-contracts pg test (39/39): vom Aufrufer gemeldet.
- `tools/open-work/check-issues.mjs`: nicht gelaufen. Den Zustand von #408 und #199 habe ich über `gh api` bestätigt.
- C-2, Rechnungsformular: nur den Code gelesen, nicht den Kommentar aus #226 selbst. Dass das Formular «die Überschneidungsregel» anwendet, stützt sich auf `statement-invoices.service.ts` und Fachreview 1.
- Rote Tests durch Lesen beurteilt: Der neue DOM-Test (`contract-missing-statement-period-2023-01-01`) scheitert mit dem alten Markup am fehlenden Element. Der Test in `contract-list.test.ts:121` scheitert mit der alten Reihenfolge (Badge vor der Vertragsdauer). Beides ist plausibel, aber nicht ausgeführt.
- Die Persona-Majors (Anna P-1/P-2, Helga P-1/P-2) und Fachreview 3 V-17 gehören zur Triage des Aufrufers. Ich habe sie nur gelesen; nach meinem Verständnis gehen sie auf #408 Punkte 1 und 2 zurück, also auf C-2.
