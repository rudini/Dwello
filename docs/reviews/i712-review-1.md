# Review #712, Runde 1 (6b3656c7..8e1ddf49)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | eslint.config.js:49 | `apiKey` prüft nur `key.value` (String-Literal). Ein berechneter Template-Schlüssel, dessen Text `/api/v1/` enthält, bleibt unentdeckt: `{ [\`${HOST}/api/v1/c\`]: { id: 'c1' } }` lintet sauber (mit ESLint-API im Worktree geprüft). Das ist naheliegend, weil viele Tests schon `` `${API}/…` ``-URLs bauen (z. B. src/__tests__/tenant-detail.test.ts:42). Ein Template mit `/api/v1/` im festen Teil liesse sich über `TemplateLiteral > TemplateElement[value.raw=/…/]` erfassen. Bei `${API}` mit `API = '…/api/v1'` kann eine Lint-Regel ohne Scope-Analyse ohnehin nichts sehen. |

Geprüft: Selektor und Ausnahme mit Spread (Probe: String-Schlüssel in einfachen oder doppelten Anführungszeichen, berechneter String-Schlüssel, Array von Objekten und Zuweisung `backend['/api/v1/…'] = […]` werden abgelehnt, `{ ...contract, id }` und `/api/v2/` nicht). Kein anderer `no-restricted-syntax`-Block für `src/**/__tests__` oder `tests/unit` wird überschrieben oder überschreibt den neuen; die anderen stehen nur in `tests/e2e/**`. Alle Frontend-Testdateien liegen unter den beiden Globs (vitest-Include, `find`). Die Zählung stimmt: `'/api/v1/` kommt vor der Änderung in genau zwei Dateien vor, und nur contract-edit-load.test.ts:8-9,41,43 legt Antworten unter Pfaden ab (Werte aus tests/contracts bzw. Spread). Ohne die Regel hätte jeder Ablehnungsfall in backend-response-lint.test.ts kein `no-restricted-syntax` gemeldet, die Fälle wären also rot gewesen. Testtitel sind deutsch. Der Diff enthält nichts Fremdes. «No scenario» ist begründet. Ponytail: kein ungenutzter Code und keine Kopie eines Helfers.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Prettier auf der neuen Testdatei und auf eslint.config.js, `src/__tests__/e2e-screenplay-lint.test.ts`: vom Aufrufer gemeldet, nicht nachgelaufen.
- Rot der Ausnahme mit Spread (`:not(:has(> SpreadElement))`): Dass der Fall ohne die Ausnahme rot war, ist vom Aufrufer gemeldet. Beim Lesen: Ohne `:not` würde `{ ...contract, id: 'c2' }` gemeldet, der Test wäre also rot.
- Nachgelaufen: `bunx vitest run src/__tests__/backend-response-lint.test.ts`, 4 Tests bestanden.
