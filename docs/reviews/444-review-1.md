# Code-Review #444, Runde 1 (4a18ffd2..462621fb)

Worktree: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/review-444-code` (detached, 462621fb). Ohne `docs/reviews`, `implementation_plan.md`.

Keine Blocker, keine Majors.

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Minor | tests/e2e/features/contract-new.feature:223-229 | Das Szenario «Mit Akonto und ohne angekreuzte Nebenkosten warnt das Formular» prüft nur den Text, nicht den Ton `caution`. Genau den hat der Product Owner entschieden («auch mit einer Nebenkostenpauschale»). Das Nachbarszenario prüft den Ton schon mit `noAgreedCostsTone` (`toBe('info')`). Der DOM-Test deckt den Ton ab (`bg-caution-soft`), deshalb nur Minor. Ein Schritt `Und ... ist eine Warnung` mit `noAgreedCostsTone` → `'caution'` würde den Szenarionamen einlösen. |
| C-2 | Nit | src/__tests__/agreed-categories.dom.test.ts:64-83 | Ein `it` prüft drei Fälle (Akonto+Pauschale, nur Akonto, ohne Akonto) und räumt mit `document.body.innerHTML = ''` von Hand auf. Der Name nennt nur den ersten Fall. Zwei oder drei `it` wären klarer. |
| C-3 | Nit | src/__tests__/agreed-categories.dom.test.ts:78 | Eine eigene Zeile ist nicht Prettier-sauber (`bunx prettier … \| diff` will den Aufruf `toContain('Er bezahlt aber ein Akonto.')` umbrechen). |
| C-4 | Nit | src/routes/contracts/new/RentStep.svelte:147 | ponytail `reuse:` `parseFloat(plainAmount(values.advancePayment)) > 0` folgt der Zeile darüber (`flatRate`). `src/lib/contract-wizard.ts:87` hat dafür `amount()` (nicht exportiert). Akzeptabel, so wie es ist. Insgesamt: Lean already. Ship. |

## Geprüft und bestätigt

- **Ton:** Mit `AgreedCategories.svelte:55` (`tone={flatRate && !advance ? 'info' : 'caution'}`) ist der Hinweis mit Akonto immer `caution`, auch mit einer Pauschale. Ohne Akonto bleibt alles wie bisher.
- **Texte:** `contracts_agreed_costs_none_text_advance` ersetzt mit Akonto den bisherigen Text, der Titel bleibt gleich. Die Texte in de/fr/it/en stimmen Wort für Wort mit dem Abschnitt «Decided (product owner)» von #444 überein (per `gh api` gelesen). Alle vier `messages/*.json` sind ergänzt.
- **Neuer Vertrag und Bearbeiten:** `AgreedCategories` wird nur in `RentStep.svelte` verwendet. `RentStep` wird von `ContractWizard.svelte` (neuer Mietvertrag) und von `ContractForm.svelte` (Bearbeiten) eingebunden. Damit gilt die Änderung auf beiden Wegen, wie es im Abschnitt «Problem» der Issue steht.
- **Szenario in `contract-edit.feature:168-172`:** Es prüft weiter den Pauschale-Satz. Der Vertrag aus der Grundlage hat kein Akonto («für "950" Franken»), also bleibt das Szenario gültig. Laut Aufrufer lief es mit `-g "Nebenkosten…"` grün.
- **Rot vor der Änderung (durch Lesen beurteilt):**
  - Das Szenario schlägt auf dem Basis-Commit fehl, weil dort mit Pauschale der Text ohne «Kreuzen Sie die Nebenkosten an, für die der Mieter Akonto bezahlt.» steht.
  - Der DOM-Test schlägt schon an der ersten Zusicherung fehl (`bg-caution-soft`, weil `advance` dort ignoriert wird und `flatRate` den Ton `info` setzt).
  - Die Zusicherung `boxes([])` ohne «Akonto» hält nur bestehendes Verhalten fest, das ist zulässig.
  - Szenario und erster Teil des Tests standen in ac118888 als `@wip`.
- **Barrierefreiheit und Sprachen:** Der neue Zustand `agreed-costs-none-advance` steht in `tests/a11y/screens.json` (mit `stateMeanings`, `queries`, contract-new und contract-edit), in `accessibility.feature` und in `sprachen-bildschirme.feature`, je für contract-new und contract-edit. Der Task in `tests/e2e/tasks/accessibility.ts` trägt ein Akonto ein, wählt alle Nebenkosten ab und wartet, bis der Hinweis angezeigt wird.
- **Screenplay:** Die neuen Schritte verwenden bestehende Steps, die nur Tasks und Questions aufrufen (`agreed-costs.steps.ts:156-162`, `contract-form.steps.ts:534-545`). Die Feature-Sprache ist fachlich, ohne «klickt», «Button» oder «Feld».
- **Übrige Regeln:** Kein neues UI-Element, nur ein bestehendes `Alert` mit Token-Ton. Keine Backend- oder API-Änderung, also kein Contract nötig. Keine Diff-Teile ohne Bezug zur Anforderung.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` (3110 grün) und E2E chromium `-g "Nebenkosten|agreed-costs-none|flat-rate-warning"` (128 grün, inklusive axe- und Sprachzustand `agreed-costs-none-advance`): vom Aufrufer gemeldet. Mein Versuch, `bunx vitest run src/__tests__/agreed-categories.dom.test.ts` erneut laufen zu lassen, scheiterte: Der Zugriff auf `node_modules` (verlinkt nach `/home/user/Dwello`) wurde durch eine Deny-Regel blockiert.
- Das rote Ergebnis von Szenario und DOM-Test vor dem Code: vom Aufrufer gemeldet. Durch Lesen beurteilt, siehe oben.
- Der Schritt «Prüfen» zeigt weiterhin «Akonto CHF 150.00» neben «Vereinbarte Nebenkosten: Keine», ohne Hinweis. Der Abschnitt «Problem» der Issue nennt das, der Entscheid deckt aber nur den Hinweis bei den Häkchen ab. Deshalb ist das kein Befund. Ob der Product Owner das so meint, kann ich nicht bestätigen.
