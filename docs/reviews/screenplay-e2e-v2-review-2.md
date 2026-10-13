## Re-Review Runde 2: Screenplay-E2E, Delta `git diff 62bac41..6f3b082`

**Ergebnis:** Es gibt keinen offenen Blocker und keinen offenen Major. B-1 und M-1 aus Runde 1 sind behoben. Das Delta bringt keine neuen Blocker oder Major.

### Blocker / Major
Keine.

**B-1 (CI: `bddgen` scheitert an `$lib`) ist behoben.**
- Was der Autor geändert hat:
  - `package.json:12-13` ruft jetzt `svelte-kit sync && bddgen && playwright test` auf.
  - CI ruft dieses Skript auf (`.github/workflows/ci.yml:161`).
  - Die Argumente nach `--` landen weiterhin bei `playwright test`, denn es ist der letzte Befehl der Kette.
  - Andere CI-Jobs rufen `bddgen` nicht direkt auf. `ci.yml:266` nutzt eine eigene Screenshot-Konfiguration ohne `bddgen`.
- So habe ich es nachgeprüft:
  - `git archive 6f3b082` in den Scratchpad entpackt, ohne `.svelte-kit`.
  - Darauf `bun run i18n`, `svelte-kit sync` und `bddgen` laufen lassen: Exit 0, 617 `test(`-Einträge wie in Runde 1.

**M-1 (Verzweigen auf den Treiber) ist behoben.**
- In steps/ sind gesperrt (`eslint.config.js:158-161`):
  - das Destrukturieren von `driver`,
  - der Zugriff `.driver`.
- In steps/, tasks/, questions/ und fixtures/ ist `.can(` gesperrt (`eslint.config.js:37-40`, über `noPlaywright`).
- Für targets/ fällt die `can`-Regel über den Filter `property.name=` weg (`eslint.config.js:235`). Das ist harmlos, und screenplay/ ist nicht betroffen. `throughUiOrApi` (`screenplay/abilities.ts:54`) bleibt erlaubt.
- Die Tests stehen in `src/__tests__/e2e-screenplay-lint.test.ts:101-115`.

**Ausgeführt:**
- `npx eslint tests/e2e …`: sauber. Die neuen Regeln treffen also keinen bestehenden Code.
- `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 51/51 grün.
- `bunx tsc --noEmit -p tsconfig.json`: ohne Fehler.

### Minors aus Runde 1
- **`answer` in Steps:** behoben (`eslint.config.js:162-165`, mit Test).
- **Handler in Fixtures:** behoben. `on`, `once`, `off`, `addListener` und `removeListener` sind gesperrt (`eslint.config.js:208-209`, mit Test). Das trifft nur fixtures/, also gibt es keinen Konflikt mit `Click.on` in tasks/.
- **`contractHistoryLists` (Ja/Nein):** behoben. Die neue Question `contractHistoryNaming` (`questions/apartment-detail.ts:21-26`) ist mindestens so streng wie die alte:
  - `toEqual(expected)` prüft die Zeilenzahl und die Reihenfolge.
  - Jede Zeile muss den erwarteten Namen enthalten.
  - `includes` statt `new RegExp` prüft wörtlich. Das ist eher strenger, weil Sonderzeichen in Namen nicht mehr als Muster gelten.
  - Scheitert die Prüfung, zeigt sie die Texte der abweichenden Zeilen.
  - Genutzt wird sie in `steps/apartment-detail.steps.ts:82-83` und `steps/tenant-detail.steps.ts:72-73`.
- **Fixtures bedienen die UI: nur teilweise behoben.** Gesperrt ist jetzt nur der Import aus `targets/`.
- **`fetch` am Mail-Catcher:** Die Ablehnung für `questions/documents.ts` trägt. Die allgemeine Lücke bleibt aber offen, siehe unten.

### Minor
- `eslint.config.js:186-212`: Eine Fixture kann weiterhin über Tasks oder Interactions die UI bedienen. Geprüft mit `ESLint.lintText`, Ergebnis `[]` für:
  ```ts
  import { openStatementDetail } from '../tasks/statement-detail';
  import { Navigate } from '../screenplay/interactions';
  export const f = async (actor) => { await actor.attemptsTo(openStatementDetail('/x'), Navigate.to('/statements')); };
  ```
  - Das widerspricht «preconditions always through the backend API … never through the UI» (`tests/e2e/CLAUDE.md`, fixtures-Zeile).
  - Mögliche Abhilfe: in fixtures/ zusätzlich `**/tasks/**` sperren und aus `screenplay/interactions` nur `Cookies` erlauben.
- `eslint.config.js` (steps, tasks, fixtures): `fetch(…)` an der Ability `CallTheApi` vorbei ist weiterhin nirgends gesperrt. Die Ablehnung begründet nur den Mail-Catcher, nicht die Lücke allgemein. Wenn das so bleibt, gehört es in die offene Arbeit.

### Nit
- `questions/amounts.ts:8`: `… * francs(saldo) || 0` macht nicht nur aus `-0` eine 0, sondern auch aus `NaN`. Ein Saldo-Text, aus dem sich keine Zahl lesen lässt (etwa «CHF 1.00.»), ergibt jetzt still 0, statt die Prüfung scheitern zu lassen. Heute nicht ausgelöst: `amountAfter` liefert nur Treffer der Regex `AMOUNT`.
- `steps/*.steps.ts`: Ein Zweig über `$testInfo.project.name === 'api'` geht ohne Meldung durch (per `lintText` geprüft). Das ist eher Umgehung als ein realistisches Muster.
- `src/__tests__/e2e-screenplay-lint.test.ts:101-108`: Der Testname «Treiber-Weichen und Prüfungen ohne sees» deckt auch den Fall `p.on('dialog', …)` in einer Fixture ab, der weder das eine noch das andere ist.

### Weitere Punkte des Autors bestätigt
- **`percent`** (`questions/statement-detail.ts:31-32`): Die Regex lehnt «50.00 %» ab und nimmt «50 %» und «33.33 %» an. Das passt zur UI, denn `src/lib/server/statement.ts:19` rundet auf eine Zahl, und `CostTable.svelte:64` zeigt `{item.percentage} %`.
- **Kommentar** in `tasks/statement-detail.ts:19`: korrigiert.
- **Doku:** `docs/test-pyramid.md:67` und `tests/e2e/CLAUDE.md:15` sind nachgeführt.
- **Ablehnung des Nit zur BFF-Fehlermeldung:** trägt. `src/lib/server/statement-generation.ts:38-39` nimmt die Meldung zum Code des Backends; fehlt ein Code, nennt die Ersatzmeldung `statements_backend_failed` Pfad und Status.

### Nicht bestätigt
- Kein E2E-Lauf, wie vorgegeben. Ob die beiden Vertragshistorie-Szenarien und das Heizkosten-Szenario mit der neuen Question und `percent` grün sind, habe ich nicht gesehen. Gelesen habe ich dazu die Features, `CostTable.svelte` und `statement.ts`.
- Den CI-Lauf selbst habe ich nicht gesehen, nur den lokalen Nachbau aus einem sauberen `git archive`. `bun install` mit `prepare` (Paraglide) habe ich durch `bun run i18n` ersetzt.
- Nicht ausgeführt: `bun run check`, `test:coverage`, fallow, deepcheck und das Backend.
