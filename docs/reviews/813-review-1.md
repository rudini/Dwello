# Review 813, Runde 1 (c64da85..8c94555)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tools/arch-baseline/layers.json:39 | Die neue Regel `bff:endpoint/$1` steht vor `^src/routes/auth/.*` → `bff:auth` (Zeile 40) und greift deshalb auch für alle fünf `src/routes/auth/*/+server.ts`: Modul jetzt `bff:endpoint/auth` statt `bff:auth`; die Regel `bff:auth` greift für keine Datei mehr |
| C-2 | Minor | tools/arch-baseline/lib.test.ts:12-14 | Der Test für die Demo-Daten prüft nur Schicht und `kind`, nicht das Modul. Die Modulregel `backend/demo` (layers.json:54), die allein die `db → be`-Kanten aus `deps:graph` entfernt (graph.ts filtert nach Modulpräfix, nicht nach `kind`), ist ungetestet: Ohne sie bleibt der Test grün, und das Modul ist wieder `db:demo-data` |

## C-1 (Major)

Warum falsch: Das Issue #813 verlangt `bff:`-Module für `+server.ts` unter `src/routes` «outside `api`/`auth`, which already have their own modules». `api` ist ausgenommen, weil `bff:api/$1` davor steht; `auth` aber nicht, weil `bff:auth` erst danach kommt (erste passende Regel gewinnt). So benennt die Änderung das bestehende Auth-Modul in jeder Modulmetrik (Importgraph, Zyklen, Modulpaare, `deps:graph`) um, und eine Regel in `layers.json` greift für keine Datei mehr. Der Eintrag in §6 von `fitness-functions.md` erwähnt diese Umbenennung nicht.

Nachweis (im Worktree ausgeführt):

```
bun -e "import {classify} from './tools/arch-baseline/lib.ts'; console.log(classify('src/routes/auth/login/+server.ts'))"
→ {"layer":"BFF","kind":"prod","module":"bff:endpoint/auth"}
```

Vor der Änderung lautete das Modul `bff:auth`. Behebung: die Regel `bff:endpoint/$1` hinter `bff:auth` setzen (oder `auth` im Muster ausnehmen) und einen Testfall `src/routes/auth/login/+server.ts` → `bff:auth` ergänzen. Dieser Testfall ist heute rot.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht erneut ausgeführt: `bun tools/fitness/fitness.ts` vorher und nachher mit gleichen Werten, `--update` lässt `ratchet.json` unverändert, Modulgraph 656 → 650 Kanten mit 0 `db → be`-Kanten und 7 verbleibenden `fe → bff`-Kanten (nicht aus `+server.ts`), `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run …` (36 bestanden), Prettier, Commit-Hooks, Rot-Lauf der zwei neuen Tests vor der Änderung an `layers.json`. Beim Lesen: Beide Tests schlagen auf c64da85 fehl (dort `fe:routes/statements` bzw. `DB`/`prod`).
- `fitness.ts --cochange` (Wert `coChangeWarn`) hat der Aufrufer nicht gemessen. Ich habe es nicht ausgeführt, weil es Dateien schreibt. Die Schicht von `+server.ts` war schon vorher BFF. Wo ich nachgesehen habe: `git log --since=2026-04-25 -- backend/src/db/demo-data.ts` zeigt nur einen Commit, die Schwelle liegt bei ≥ 5 gemeinsamen Änderungen. Eine Änderung des Werts ist daher unwahrscheinlich, aber nicht gemessen.
- `prSizeWarn` (31/20/5) stammt aus der Historie mit der alten Einteilung. Ein PR, der `+page.svelte` und `+server.ts` desselben Bereichs ändert, zählt jetzt ein Modul mehr. Das Werkzeug berechnet die Schwelle nicht neu, deshalb nicht geprüft.

Geprüft: Diff vollständig gelesen (layers.json, lib.test.ts, fitness-functions.md §6); `classify` für `src/routes/health/+server.ts`, `src/routes/api/tenants/+server.ts` und die vier Beispiele aus dem Issue; Commit-Text mit `No scenario:` und `Fixes #813`; Ausnahmen in `ratchet.json`: keine hing an der alten Einteilung.
