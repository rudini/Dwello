## Bestätigungs-Review (Delta): Screenplay-E2E, `git diff b57241f..89a83eb` (HEAD 89a83eb)

**Ergebnis:** Kein Blocker, kein Major. Alle Minors aus Runde 2 sind geschlossen oder als offene Arbeit erfasst (H-19). Der Nit ist behoben.

Der Delta umfasst einen Commit: `fix(tests): close lint variants from re-review` (46 Zeichen, konform). Geänderte Dateien, alle gelesen:
- `eslint.config.js`
- `src/__tests__/e2e-screenplay-lint.test.ts`
- `tests/e2e/tasks/invoices.ts`
- `docs/design/offene-punkte.md` (Zeile H-19)
- `docs/reviews/screenplay-e2e-review-4.md` und `-5.md` (abgelegte Berichte; `-5.md` ist identisch mit meinem Bericht aus Runde 2, per `diff` geprüft)

Der Delta enthält nichts, was nicht zur Anforderung gehört.

### Was ich ausgeführt habe
- **Verletzungsdateien:** alle aus `scratchpad/viol2/` (f04, f05, q03, q04, q05, s06, s07). Dazu zwei neue: `zzq06.ts` (Parameter umbenannt, `globalThis['setTimeout']`) und `zzs08.steps.ts` (berechneter Zugriff `fx['driver']`, `seed['backend']`).
  - Alle habe ich als `zz*` nach `tests/e2e/{fixtures,questions,steps}/` kopiert und mit `bunx eslint tests/e2e/*/zz* -f json` geprüft.
  - Danach habe ich sie gelöscht. `git status --short` ist leer.
- `bun run lint`: Exit 0. Die erweiterten Selektoren treffen also keinen bestehenden Code, auch nicht die neue Question-Regel `CallExpression[arguments.0.name='actor']`.
- `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 62 von 62 grün (vorher 54; 8 neue Fälle in `:155-167`).

### Minors aus Runde 2

| Minor | Status | Beleg |
|---|---|---|
| steps/: `fx.driver` | geschlossen | `zzs07.steps.ts` 5:31; Test `:157` |
| steps/: destrukturiertes `backend`/`expect` | geschlossen | `zzs07.steps.ts` 6:41 (`const { backend } = seed`) und 8:9 (`const { expect: e } = test`); Tests `:158-159` |
| questions/: Question ruft eine Activity mit `actor` auf | geschlossen | `zzq04.ts` 6:8; Test `:161` |
| questions/: `globalThis.setTimeout` | geschlossen | `zzq05.ts` 4:73; Test `:160` |
| fixtures/: Namespace-Import und Re-Export der Interactions | geschlossen | `zzf05.ts` 1:8 und 3:1; Tests `:162-164` (auch `export *`) |
| fixtures/: Alias `const p = page` / `const { goto } = page` (alt) | erfasst | `offene-punkte.md` H-19 |
| questions/: `fetch` ohne Ability (alt) | erfasst | `offene-punkte.md` H-19 |
| Nit `tasks/invoices.ts:16` Leerzeichen | behoben | Diff |

**Weiterhin gemeldet:**
- `zzf04.ts`: 1:10 und 2:1.
- `zzq03.ts`: 2:1 und 6:8.
- `zzq05.ts` 3:74: Auch `a['attemptsTo']` wird gemeldet, über die allgemeine Playwright-Regel.
- `zzs08.steps.ts` 4:31 und 5:39: Berechneter Zugriff wird ebenfalls gemeldet.
- `zzq06.ts` 9:56: `globalThis['setTimeout']` wird gemeldet.

**`zzs06.steps.ts`** (Step importiert `save` aus einer Fixture): ohne Meldung. Das ist richtig, denn die Kette wird an der Fixture unterbrochen (`zzf04.ts`).

### Blocker
Keine.

### Major
Keine.

### Minor
- `implementation_plan.md:52ff`: Die Session 19 listet die Runden 4 und 5 (`screenplay-e2e-review-4.md`, `-5.md`) und ihre Befunde mit Status nicht. Dasselbe gilt für H-19 als Ziel der zwei alten Minors. CLAUDE.md, Workflow Schritt 6, verlangt das.

### Nit
- `eslint.config.js:195`: Die Regel hängt am Parameternamen `actor`. `question('x', async (a) => { await goToNextStep(a); … })` bleibt ohne Meldung (`zzq06.ts:6`). Fällt unter die allgemeine Aussage von H-19 («matches names, without type information»). Keine eigene Arbeit nötig.
- `zzf05.ts:4`: `export { goToNextStep } from '../tasks/…'` in einer Fixture bleibt ohne Meldung. Unschädlich, denn Steps dürfen Tasks ohnehin importieren.

### Urteil zu den drei Punkten

| Punkt | Urteil |
|---|---|
| 1. Alle Bereiche von tests/e2e auf dem schlanken Screenplay | **erfüllt**. Der Delta ändert unter tests/e2e nur ein Leerzeichen; der Befund aus den Runden 4 und 5 gilt weiter. |
| 2. Lint erzwingt Screenplay ohne Ausnahmen | **erfüllt**. Alle gemeldeten Verletzungen und Varianten werden erkannt. `bun run lint` ist grün. Bewusste Umgehungen per Alias, `fetch` oder umbenanntem Parameter sind als H-19 erfasst. |
| 3. Frühere Befunde behoben | **erfüllt**. Alle Majors der früheren Runden sind geschlossen. Die Minors sind geschlossen oder in H-19 erfasst, der Nit ist behoben. |

### Noch offen
- **H-19** (`offene-punkte.md`): Alias von Playwright-Fixtures in `fixtures/` und `fetch` in `questions/`. Offene Arbeit, kein Merge-Blocker.
- **Commit-Betreffs über 50 Zeichen** aus früheren Commits (54, 52, 52, 51 Zeichen): unverändert. Lösung beim Squash-Merge über den Titel.
- **Minor `implementation_plan.md`:** siehe oben.

### Nicht bestätigt
- E2E-Lauf: laut Auftrag nicht ausgeführt.
- Nicht ausgeführt: `bun run check`, `bun run test:coverage`, Backend-Tests, `deepcheck:audit` und `fallow audit`. Der Delta ändert nur die ESLint-Konfiguration, einen Vitest-Test, ein Leerzeichen und Doku.
- Ob die Einträge im Plan ausserhalb dieses Worktrees (uncommitted) nachgeführt sind: Geprüft habe ich nur `implementation_plan.md` im Worktree bei HEAD 89a83eb.
- Ob ein Squash-Merge geplant ist: nicht feststellbar.
