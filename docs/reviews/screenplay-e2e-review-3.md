## Re-Review Runde 3: `git diff 95bfd7f..3151cad` (Screenplay-E2E)

**Ergebnis:** M-1 ist für steps/, tasks/ und questions/ geschlossen, für fixtures/ aber nicht. Es bleibt ein Major offen, Blocker gibt es keinen.

**Was ich ausgeführt habe:**
- `bun run lint`: Exit 0.
- `bun run check`: 0 Fehler.
- `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 40 von 40 grün.
- Umgehungen habe ich mit `bunx eslint --stdin --stdin-filename …` geprüft, über das Skript `try.sh` im Scratchpad.
- Der Working Tree ist sauber. E2E habe ich laut Auftrag nicht ausgeführt.

**Wo ich die Grenze ziehe:**
- **Als realistisch gilt:**
  - ein direkter Methodenaufruf auf einem Playwright-Objekt, das in der Schicht greifbar ist (Fixture-Parameter, `page` im Target);
  - Importe, auch dynamische Importe und `require`;
  - Assertion-Bibliotheken;
  - der Griff zu `page` über ein Property, über Destrukturieren oder über einen Literal-Schlüssel.
- **Als bewusste Verschleierung gilt** (das kann kein Lint ohne Typinformation fangen, und ich werte es nicht):
  - eine Methode oder ein Element in eine Variable holen (`const c = states[k]; c()`, `const f = el.click`);
  - `Reflect.get` oder `Object.values(actor)`;
  - Casts auf private Felder;
  - Umbenennen beim Destrukturieren, um eine Namensregel zu umgehen.

### Blocker
Keine.

### Major

**M-1 (Rest): In fixtures/ gehen Playwright-Aufrufe durch, die nicht auf der Namensliste stehen. Ein solcher Aufruf steht schon im Code.**

- **Wo:**
  - `eslint.config.js:169-182`: Der Fixture-Block verbietet nur die Methodennamen aus `playwrightActions` und `playwrightReads`. Die Fixture-Parameter `page`, `context`, `browser` und `request` sind dort ausdrücklich erlaubt (der ObjectPattern-Filter ist entfernt). Damit läuft jede andere Methode auf diesen Parametern ohne Meldung durch.
  - `tests/e2e/CLAUDE.md:29` sagt für fixtures/ aber «no Playwright calls».
- **Nachweis:** Alle folgenden Zeilen bleiben in `tests/e2e/fixtures/zz.ts` ohne `no-restricted-*`-Meldung. Es ist gewöhnlicher Fixture-Code, keine Verschleierung:
  - `async ({ page }: { page: Page }) => { page.on('dialog', (d) => d.accept()); }`: Ein versteckter Dialog-Handler ändert das Verhalten aller Szenarien.
  - `page.url()`, `page.title()`, `page.close()`, `page.setDefaultTimeout(5000)`
  - `context.grantPermissions(['clipboard-read'])`, `context.newPage()`, `context.tracing.start(...)`
  - `browser.newContext({ locale: 'fr-CH' })`
  - `(request: APIRequestContext) => request.get('/api/buildings')`
- **Schon im Code:** `tests/e2e/fixtures/backend.ts:16-19` ruft Playwrights `APIRequestContext` auf (`request.post`, `get`, `put` und `delete`). Das ist Playwright ausserhalb von screenplay/ und targets/. Der Lint lässt es durch, und das Doc behauptet das Gegenteil.
- **Warum das blockiert:** Die Anforderung lautet «Playwright only in screenplay/ and targets/, every violation fails lint, no exception list». Ausgerechnet in der Schicht, die per Definition `page`, `context` und `browser` in der Hand hat, hängt die Regel an einer unvollständigen Namensliste.
- **Vorschlag:**
  - In fixtures/ jeden Member-Zugriff auf die Fixture-Parameter verbieten, zum Beispiel `MemberExpression[object.name=/^(page|context|browser|request)$/]`. Weiterreichen bleibt erlaubt (`new BrowseTheWeb(page)`, `use(page)`, `testData(request, …)`).
  - Dazu `ObjectPattern > Property[key.name=/^(page|context|browser|request)$/][value.type='Identifier']:not([value.name=/^(page|context|browser|request)$/])` verbieten, also das Umbenennen beim Destrukturieren.
  - `backend.ts` auf `fetch` umstellen oder den HTTP-Teil in `screenplay/` verschieben (zu `CallTheApi`).
  - Je ein Fall für `page.on` und `request.get` gehört in `e2e-screenplay-lint.test.ts`.

### Geschlossen aus Runde 2 (mit Nachweis)
- **Dynamischer Import und `require`:** gesperrt (`eslint.config.js:36`). Tests sind vorhanden (`e2e-screenplay-lint.test.ts:69-71`). In steps/ gehen `import('@playwright/test')`, `require` und Assertion-Bibliotheken nicht mehr durch. `@jest/globals` mit `expect(...)` wird über die `expect`-Regel gefangen.
- **Pfadvarianten der Abilities:** gesperrt (`**/screenplay/abilities*`, `**/screenplay/**/abilities*`). Tests sind vorhanden.
- **Berechnete Aufrufe und Zugriffe** (`x["click"]()`, `` x[`click`]() ``, `x[act]()`, `f['page']`): gesperrt. Tests sind vorhanden.
- **`request`-Ketten und Download-Methoden:** gesperrt (`path`, `suggestedFilename`, `saveAs` und `createReadStream` in `playwrightActions`).
- **Lesende Aufrufe in Targets** (`url`, `textContent` …): gesperrt. Ein Test ist vorhanden.
- **`quick`-Kommentar** (`questions.ts:19-20`) und die Leerzeile in `building-detail.ts`: behoben.
- **Die `page`-Fixture-Änderung** (`fixtures/test.ts:23-27`) verhält sich gleich: `Cookies.add` → `pageOf(actor).context().addCookies(cookies)` (`interactions.ts:131-132`). Typen sind ok (`bun run check` ist grün). Das Wegwerf-Actor-Objekt «Liegenschaftsverwalter» ist harmlos.

### Minor
- `eslint.config.js:198-205` (targets/): `page.on('dialog', …)` und `page.request.get(...)` gehen in einem Target ohne Meldung durch. «locators only» ist also nur über eine Namensliste abgesichert, aber nicht realistisch dringend.
- `tests/e2e/tasks/accessibility.ts:251`: Der Ausweg `const reachState = states[example.state]` zeigt, dass die Regel für berechnete Aufrufe legitimen Code trifft und sich durch eine Variable trivial umgehen lässt. Das ist vertretbar, weil in tasks/ kein Playwright-Objekt greifbar ist. Ein Kommentar wäre aber gut.

### Nit
- `eslint.config.js:30-33`: Die Regel für berechneten Zugriff trifft auch legitimen Code wie `headers['content-type']` in questions/. Nachweis: `actor.recall<Record<string,string>>('h')['content-type']` wird gemeldet.
- `eslint.config.js:202`: `all` in der Leseliste der Targets trifft auch `Promise.all(...)`.
- In questions/ gehen `actor.recall<Download>(DOWNLOAD).url()`, `.failure()` und `.delete()` weiterhin durch. Das ist kaum realistisch.

### Nicht bestätigt
- E2E-Lauf (gleiche Wirkung der `page`-Fixture im Browser): laut Auftrag nicht ausgeführt.
- `test:coverage`, das Backend und die fallow- und deepcheck-Gates: nicht ausgeführt.
- Ob TypeScript `../screenplay/abilities.js` in diesem Projekt auflöst: nicht geprüft. Der Lint sperrt die Variante ohnehin.
