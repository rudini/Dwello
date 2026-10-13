## Re-Review (Delta): Screenplay-E2E, `git diff 0f55450..b57241f` (HEAD b57241f)

**Ergebnis:** Kein Blocker, kein Major offen. M-1 und M-2 sind geschlossen: Jeder Fall aus dem letzten Bericht wird jetzt gemeldet. Der Minor «throw im Step» ist ebenfalls geschlossen. Es bleiben Umgehungen über Varianten der Schreibweise. Ich führe sie als Minor, gleich wie im letzten Bericht das Aliasing.

Der Delta umfasst einen Commit, `fix(tests): close last Screenplay lint gaps` (43 Zeichen). Geändert sind drei Dateien, alle vollständig gelesen:
- `eslint.config.js`
- `src/__tests__/e2e-screenplay-lint.test.ts`
- `tests/e2e/CLAUDE.md`

| Punkt | Urteil |
|---|---|
| 1. Alle Bereiche von tests/e2e auf dem schlanken Screenplay | **erfüllt** (unverändert zum letzten Bericht; der Delta ändert nichts unter tests/e2e ausser CLAUDE.md) |
| 2. Lint erzwingt Screenplay ohne Ausnahmen | **erfüllt**: alle gemeldeten realistischen Verletzungen werden gemeldet, `noInlineConfig` bleibt; Rest-Varianten siehe Minor |
| 3. Frühere Befunde behoben | **erfüllt**: M-1 und M-2 geschlossen, dazu der Minor «throw im Step»; offene Minors siehe unten |

### Was ich ausgeführt habe
Alles im Worktree. Am Ende ist `git status --short` leer.

- **Verletzungsdateien:**
  - die alten aus `scratchpad/viol/`;
  - neue in `scratchpad/viol2/` (q03, q04, q05, f04, f05, s06, s07).
  - Alle habe ich als `zz*` nach `tests/e2e/{steps,questions,fixtures,tasks,targets}/` kopiert, mit `bunx eslint tests/e2e/*/zz* -f json` geprüft und danach gelöscht.
- `bun run lint`: Exit 0. Die neuen Regeln treffen also keinen bestehenden Code.
- `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 54 von 54 grün (vorher 44).

### Blocker
Keine.

### Major
Keine.

### M-1 (steps/): geschlossen
Regeln in `eslint.config.js:155-167`:
- `ObjectPattern > Property[key.name='driver']`
- `MemberExpression[property.name=/^(backend|expect)$/]`
- `ThrowStatement`

Exakte Fälle aus dem letzten Bericht:

| Fall | Meldung |
|---|---|
| `zzs01.steps.ts`: `({ driver, verwalter, seed })` plus `if (driver === 'api') await seed.backend.post(…)` | 5:20 (driver) und 6:30 (backend) |
| `zzs05.steps.ts`: `seed.backend.post('buildings', {})` | 4:39 |
| `zzs02.steps.ts`: `test.expect(…)` | 6:2 |
| `zzs03.steps.ts`: `throw new Error('missing')` (der frühere Minor) | 7:28 |

- **Tests:** `e2e-screenplay-lint.test.ts:117-124` und `:147-153`.
- **Doku:** `tests/e2e/CLAUDE.md:24` nennt die neuen Grenzen.

### M-2 (questions/, fixtures/): geschlossen

**questions/** (`eslint.config.js:178-203`):
- Der Import von `**/screenplay/interactions*` ist gesperrt.
- `CallExpression[callee.property.name='attemptsTo']` ist gesperrt, ebenso `setTimeout` und `setInterval`.
- `zzq03.ts` (Question klickt und wartet) meldet 2:1 (Import) und 6:8 (`attemptsTo`).
- `zzq02.ts` (`setTimeout`) meldet 4:76.

**fixtures/** (`eslint.config.js:205-223`):
- `**/targets/**` ist gesperrt.
- Aus `screenplay/interactions` ist nur `Cookies` zugelassen (Selektor auf `ImportSpecifier`).
- `zzf04.ts` meldet 1:10 (`Click`) und 2:1 (Target).
- Der Weg über `zzs06.steps.ts` (Step importiert `save` aus der Fixture) ist damit an der Fixture unterbrochen. Der Step selbst bleibt ohne Meldung, was richtig ist: Steps dürfen fixtures/ importieren.

**Bestehender Code:** `fixtures/test.ts` mit `Cookies` bleibt erlaubt (Test `:155-158`, Lint grün). Questions, die Konstanten aus tasks/ importieren (`questions/statement-detail.ts:15-16`, `questions/statement-generate.ts:22`, `questions/authentication.ts:4`), bleiben erlaubt. Deshalb wurde `**/tasks/**` zu Recht nicht gesperrt.

### Minor

**Neu gefunden.** Varianten, die die neuen Regeln umgehen (jeweils 0 Meldungen). Jede ist ein Einzeiler im Selektor; keine trifft heutigen Code (`grep` über questions/ und fixtures/ ohne Treffer).
- `eslint.config.js:157`, steps/: Zugriff ohne Destrukturieren.
  - Fall: `async (fx) => { if (fx.driver === 'api') … }` (`zzs07.steps.ts`).
  - Die Regel prüft nur `ObjectPattern`.
  - Vorschlag: `MemberExpression[property.name='driver']`.
- `eslint.config.js:161`, steps/: Destrukturieren statt Member-Zugriff.
  - Fälle: `const { backend } = seed; backend.post(…)` und `const { expect: e } = test; e(1)` (`zzs07.steps.ts`).
  - Vorschlag: zusätzlich `ObjectPattern > Property[key.name=/^(backend|expect)$/]`.
- `eslint.config.js:195`, questions/: Die Question ruft eine Activity aus tasks/ direkt als Funktion auf.
  - Fall: `await goToNextStep(actor)` (`zzq04.ts`; `goToNextStep = Click.on(nextButton)`, `tasks/contract-form.ts:32`). Damit klickt die Question ohne `attemptsTo`.
  - Vorschlag: `CallExpression[arguments.0.name='actor']:not([callee.type='MemberExpression'])`.
- `eslint.config.js:199`, questions/: `globalThis.setTimeout(…)` wird nicht gemeldet (`zzq05.ts:4`). Der Selektor prüft nur `callee.name`.
- `eslint.config.js:221`, fixtures/: Diese Formen gehen an der `Cookies`-Ausnahme vorbei (`zzf05.ts`):
  - der Namespace-Import `import * as I from '../screenplay/interactions'`;
  - der Re-Export `export { Click as Klick } from '../screenplay/interactions'`.

**Aus dem letzten Bericht, im Delta nicht angefasst:**
- `eslint.config.js:225-228`, fixtures/: Alias per Zuweisung (`const p = page; p.on(…)`, `const ctx = context`, `const b = browser`) wird weiterhin nicht gemeldet (`zzf02.ts` Zeilen 2, 3, 5). `const { goto } = page` wird ebenfalls nicht gemeldet (`zzf03.ts:3`).
  - **Vertretbar zu lassen:** Das ist bewusste Verschleierung, fixtures/ hat vier Dateien, und das Review sieht sie.
  - Als offene Arbeit führen (Zeile in `offene-punkte.md`).
- `tests/e2e/questions/documents.ts:17`: `fetch` ohne Ability wird weiterhin nicht gemeldet, auch gegen das eigene Backend (`zzq01.ts:3`).
  - **Vertretbar zu lassen:** Der Mail-Catcher braucht `fetch`, und eine Sperre nach URL wäre brüchig.
  - Als offene Arbeit führen.
- Commit-Betreffs über 50 Zeichen (in `git log origin/main..HEAD`, unverändert):
  - `chore(tests): move a11y, language, frame to Screenplay` (54)
  - `fix(tests): close remaining Screenplay lint bypasses` (52)
  - `chore(tests): move invoices and config to Screenplay` (52)
  - `chore(tests): move statement-generate to Screenplay` (51)

  **Vertretbar:** Ein Umschreiben verlangt Rebase und Force-Push (destruktiv, nur mit Zustimmung). Beim Squash-Merge einen konformen Titel wählen. Der neue Commit hält die Grenze ein.

### Nit
- `tests/e2e/tasks/invoices.ts:16`: `searchInvoices =(term`, das Leerzeichen fehlt noch.

### Nicht bestätigt
- E2E-Lauf: laut Auftrag nicht ausgeführt.
- `bun run check`, `bun run test:coverage`, Backend-Tests, `deepcheck:audit` und `fallow audit`: im Delta nicht ausgeführt. Der Delta ändert nur die ESLint-Konfiguration, einen Vitest-Test und Doku.
- Ob ein Squash-Merge geplant ist (betrifft den Minor zu den Commit-Betreffs): nicht feststellbar.
