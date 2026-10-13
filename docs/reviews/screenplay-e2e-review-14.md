# Code-Review Screenplay-E2E, Endstand 6734ba2 (gesamter Stand `origin/main...HEAD`, kein Delta)

**Ergebnis:** Kein Blocker, ein Major. Das Muster (Punkt 1) hält. Die Werte-Questions lesen das gerenderte DOM richtig. Alle früheren Blocker/Major sind behoben (Punkt 3). Bei der Durchsetzung (Punkt 2) bleibt ein gewöhnlicher Weg offen: Ein When- oder Then-Step reicht `seed` an eine Task oder einen Step-Helfer weiter und handelt so am UI und an der Ability vorbei.

| Punkt | Urteil | Eigener Beleg |
|---|---|---|
| 1 Muster | erfüllt | `bun run lint` sauber, `bun run check` 0 Fehler (2818 Dateien), Lint-/Strukturtest 145/145 grün. Gelesen: Kern (`screenplay/*`), Fixtures, alle `questions/*`, Steps/Tasks/Targets für statement-detail, statement-generate und accessibility. `sees` = `expect.poll` (`actor.ts:47-49`). UI oder API wird nur über `throughUiOrApi`/`can(CallTheApi)` gewählt. Abgleich mit dem DOM: `heatingCosts` liest die Zellen in der Reihenfolge von `CostTable.svelte:61-65` (`43 %` ergibt 43, `CHF 430.00` ergibt 430). `saldoIn`/`amountAfter` passen zu `PreviewStep.svelte:116-123` (`Kosten {amount}`, `balanceLabel` + Betrag; der Akonto-Hinweis steht dahinter). Die Regex von `statementsCreated` deckt `statements_created_one/_many` ab (`messages/de.json:996-997`). Abweichungen nur als Minor (m-3 bis m-6). |
| 2 Erzwingung | nicht erfüllt | Eigene Verstoss-Dateien (zz*, wieder gelöscht): Helfer-Ordner, `.js`-Datei, `Step(` mit `seed`, `$testInfo.annotations` werden gemeldet bzw. vom Strukturtest abgelehnt. Durch kommen M-1 (gewöhnlicher Code) sowie die Minors m-1/m-2. |
| 3 Frühere Findings | erfüllt | Die Major aus R1–R12 sind durch die Fälle im Lint-Test (grün) und eigene Varianten bestätigt. R13 B-1 ist behoben (Zellen-Target `statementLineItemCells`, mit dem DOM abgeglichen). Experten-M-1: Werte statt Ja/Nein, Singular erfasst. Experten-M-2 ist teilweise behoben, der Rest steht in H-20 (`offene-punkte.md`). Experten-M-3: `git ls-files … --exclude-standard` (`e2e-screenplay-lint.test.ts:15`). Die Statusangaben im Archiv (Session 19) stimmen für alle Blocker/Major. Eine Fix-Beschreibung zu einem Minor ist zu weit (m-1). |

## Blocker

Keine.

## Major

**M-1: Ein When-/Then-Step handelt über `seed`, indem er `seed` an eine Task oder an einen Step-Helfer weitergibt. Damit wählt der Step am Ende doch zwischen UI und API.**
- Ort:
  - `eslint.config.js:318-322`: Die Regel greift nur bei `seed.<x>(…)` direkt im `When(`/`Then(`/`Step(`-Aufruf.
  - `eslint.config.js:335-349`: Tasks haben keine Regel zu `seed` oder `.backend`.
  - `tests/e2e/CLAUDE.md:25` erlaubt Tasks ausdrücklich `fixtures/ (types, test data)`.
- Warum Major: Das ist gewöhnlicher Code ohne Umgehungsabsicht.
  - Die Lint-Meldung bei `seed.sendStatement` im When lautet «the actor acts through tasks». Wer ihr folgt, schreibt eine Task, die `seed` bekommt. Das geht durch.
  - Der Code macht es schon vor: `seed` wird weitergereicht, in `statementPath(seed, …)` (Question, `questions/statements.ts:14`), in `exampleOf(seed, …)` und im Step-Helfer `sentWithDeadline(seed, …)` (`steps/dashboard.steps.ts:34`). Diesen Helfer in einem When wiederzuverwenden, ist naheliegend.
  - Folge: Die Handlung im When läuft im Projekt chromium über die API, nicht über das UI. Mit `seed.backend` in der Task wählt sie die API fest, nicht über die Ability. Genau das war R12 M-1 und R4 M-1 (`seed.backend`), nur eine Ebene tiefer.
- Beweis (Lint Exit 0, Dateien wieder gelöscht):
  ```ts
  // tests/e2e/tasks/zza.ts
  import type { TestData } from '../fixtures/backend';
  import type { Activity } from '../screenplay/actor';
  export const sendStatementOf = (seed: TestData, tenant: string, year: number): Activity => async () => {
  	await seed.sendStatement(tenant, year);
  };
  export const sendThroughBackend = (seed: TestData, id: string): Activity => async () => {
  	await seed.backend.put(`statements/${id}/status`, { status: 'sent' });
  };
  // tests/e2e/steps/zza.steps.ts
  When('… versendet die Abrechnung {int} von {string}', async ({ verwalter, seed }, year, tenant) => {
  	await verwalter.attemptsTo(sendStatementOf(seed, tenant, year));
  });
  // tests/e2e/steps/zzc.steps.ts: Helfer im Step-Modul, aufgerufen im When
  async function sent(seed: TestData, tenant: string) { await seed.sendStatement(tenant, 2024); }
  When('… versendet {string}', async ({ seed }, tenant) => { await sent(seed, tenant); });
  ```
  Dasselbe gilt für eine Question: `(seed: TestData, id) => question('…', async () => (await seed.backend.get(`statements/${id}`)).status)` in `questions/zzb.ts` liest auch im UI-Projekt über die API (Exit 0).
- Abhilfe, einer der Wege:
  - In tasks/ und questions/ `TestData` (`fixtures/backend`) nicht mehr importieren lassen und `MemberExpression[property.name='backend']` sperren. `statementPath` nimmt dann die Id (`seed.idOf(…)`), nicht `seed`.
  - In Steps `seed` als Argument eines Aufrufs innerhalb von `When(`/`Then(`/`Step(` sperren. `exampleOf` müsste dann in ein Given wandern, siehe m-7.
  - Dazu je einen Fall im Lint-Test und einen Halbsatz in `tests/e2e/CLAUDE.md:25` («test data» = Namen, Ids, Daten, nicht `seed`).

## Minor
- **m-1** Targets haben keine Import-Freigabeliste:
  - `eslint.config.js:426-437` ist eine Sperrliste. `import { expect } from '@playwright/test'` und `import axios from 'axios'` in `targets/zzt.ts` geben Exit 0.
  - Damit sind zwei Aussagen zu weit: `tests/e2e/CLAUDE.md:19` («Each layer imports only from an allowlist») und das Archiv `docs/archive/implementation-plan-verlauf.md:5247-5248` («each layer has an import allowlist»). Für den Kern gilt dasselbe, dort ist Playwright gewollt.
- **m-2** `screenplay/questions.ts`: Eine neue Web-Question mit `one.getAttribute('href')` oder `one.evaluate(fn)` ohne Timeout geht durch (Exit 0). Beide Aufrufe warten automatisch. Die Regel `eslint.config.js:266` erfasst nur `is…`/`boundingBox` ohne Argumente. Im Archiv (`:5245-5246`) heisst es «state reads only with a timeout». Betrifft nur den geschlossenen Kern.
- **m-3** `tests/e2e/questions/statement-detail.ts:35` mit `targets/statement-detail.ts:5-8`: `Text.ofAll` über alle Zeilen, deren Text «Heizung» enthält, ohne Strict Mode.
  - Auch Verteilschlüssel heissen «Heizung …» (`backend/migrations/0002_stammdaten.sql:49,63,73`).
  - Hat eine zweite Position einen solchen Schlüssel, liefert das Destrukturieren still die erste Zeile. Besser die Zeile über die exakte erste Zelle wählen.
- **m-4** Anteil in % in zwei Formen:
  - UI: auf zwei Stellen gerundet (`src/lib/server/statement.ts:19`).
  - API: `Number(sharePercentage)` mit vier Stellen (`questions/statement-detail.ts:41`).
  - Bei krummen Anteilen (33.3333 gegenüber 33.33) antworten die beiden Treiber also nicht «in a form both protocol drivers share» (`tests/e2e/CLAUDE.md:35`). Heute rechnen alle Szenarien mit ganzen Zahlen.
- **m-5** Ja/Nein über Werte, entgegen `tests/e2e/CLAUDE.md:35`:
  - `questions/documents.ts:15-19`: `mailsTo` macht aus Anhangnamen ein `true`/`false` «ist PDF».
  - `questions/app-frame.ts:11-14` (`pageOverflowsSideways`): macht aus Pixeln ein Ja/Nein.
  - `questions/contract-detail.ts:18-21`: macht aus dem Sichtanteil ein Ja/Nein.
  - Schlägt eine Prüfung fehl, fehlt der echte Wert, also der Dateiname bzw. die px.
- **m-6** `questions/statement-detail.ts:30-31`: Zwei JSDoc-Kommentare übereinander. Der erste («Whether the tenant bears …») ist veraltet.
- **m-7** `steps/accessibility.steps.ts:13` und `steps/language.steps.ts:63`: Then-Steps legen Testdaten an, über `exampleOf(seed, …)` und `fixtures/screens.ts:34-66`. Das widerspricht `tests/e2e/CLAUDE.md:24` («`seed` for preconditions, only in `Given`»). Entweder ein Given einführen oder die Ausnahme dokumentieren.

## Nit
- `tests/e2e/CLAUDE.md:25` schweigt zu Schleifen und Assertions in Tasks. `while (!(await actor.answer(Visibility.of(x)))) await actor.attemptsTo(Navigate.reload)` und `actor.sees(…)` in einer Task gehen durch (`tasks/zzd.ts`, Exit 0). Die Regel ist bisher nicht formuliert, deshalb kein Lint-Befund. Sie sollte aber für Tasks entschieden werden.

## Nicht bestätigt
- E2E auf 6734ba2 nicht selbst ausgeführt, wie vorgegeben. Ob die vier auf fdfa6ef roten Szenarien jetzt grün sind, folgt hier nur aus dem Lesen von `CostTable.svelte`, `GenerationStep.svelte:43-47` und `messages/de.json:996-997`. Der parallele Lauf muss es zeigen.
- DOM-Tests (Hydration-Helfer) und `bun run test:coverage` liefen nicht; sie scheitern laut Vorgabe in diesem symlinkten Worktree. Backend-Tests liefen nicht (nicht Teil des Diffs).
- `generateStatementsViaApi` (`after.billed - billed`) zählt Verträge mit einer Abrechnung in der Periode, nicht Abrechnungen. Ob das Backend pro Vertrag genau eine anlegt, habe ich nicht geprüft.
- Die Reviews 1–12 habe ich in ihren Major-Abschnitten gelesen und gegen den Lint-Test und eigene Varianten geprüft. Nicht jeden Minor-Status im Archiv habe ich einzeln nachvollzogen.
- Die Features (H-18, UI-Wörter) und die Mehrheit der Steps/Tasks ausserhalb von statement-*/accessibility habe ich nur über den Lint geprüft, nicht Zeile für Zeile.
- `git status` im Worktree ist am Ende sauber.
