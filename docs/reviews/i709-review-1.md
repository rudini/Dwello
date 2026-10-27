# Review i709, Runde 1 (`git diff 702f494c 246a5162`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | eslint.config.js:37-41 | Die Regel lässt `fetch` unter anderem Namen durch: `const { fetch: f } = globalThis; await f('/x');` in `tests/e2e/tasks/x.ts` meldet keinen Fehler, weil `Property > Identifier.key` ausgenommen ist und der Wert `f` heisst; dasselbe gilt für `const g = globalThis; g.fetch(…)`. Damit erreicht ein Task das Backend weiterhin an `CallTheApi` vorbei, ohne dass Lint anschlägt. Das ist genau das Problem aus #709, nur auf einem Umweg. Gezeigt per `ESLint.lintText` gegen die Konfiguration im Worktree. |
| C-2 | Minor | eslint.config.js:40, tests/e2e/CLAUDE.md:33-38 | Die Lint-Meldung verweist für das fetch-Verbot und den Zugriff auf «other services through screenplay/» auf `tests/e2e/CLAUDE.md`. Die Schichttabelle dort nennt weder das Verbot noch den Mail-Catcher als Teil von `screenplay/`. Die Meldung zeigt also auf eine Regel, die im Dokument nicht steht. |

Keine Blocker oder Majors.

## Nicht bestätigt

- `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts` (60 bestanden), `bun run lint`, `bun run check`, `bun run test:e2e -- --project=chromium -g "per E-Mail"` (9 bestanden) und Prettier auf den geänderten Zeilen: vom Aufrufer gemeldet, nicht neu ausgeführt. Die Lint-Konfiguration habe ich stattdessen direkt mit `ESLint.lintText` im Worktree geprüft:
  - Die fünf neuen Ablehnungsfälle schlagen nur wegen der neuen Regel an. Ohne sie greift keine andere Regel aus `noPlaywright` (gelesen), sie wären also rot.
  - Diese Formen werden abgelehnt: `globalThis.fetch` in fixtures und targets, ein destrukturiertes `{ fetch }` und `typeof fetch`.
  - Diese Formen bleiben erlaubt: `actor.abilityTo(CallTheApi).fetch` sowie `fetch` in `tests/e2e/screenplay/`.

Geprüft: Anforderung #709 (Variante ohne Ausnahme, Mail-Catcher in `screenplay/questions.ts`). `mailsTo` liefert dieselbe Antwortform wie vorher. Der Filter in fixtures und targets behält die neue Regel. Es gibt keine weiteren `fetch`-Aufrufe in `tests/e2e/` ausserhalb von `screenplay/` und keine Änderung ohne Bezug zur Anforderung. `No scenario` ist für eine reine Tooling-Änderung angemessen.
