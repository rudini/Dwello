# Review migrations-frozen, Runde 1

Commit-Bereich: `origin/main..dd10ec0` (ein Commit, «fix(db): keep applied migrations unchanged»), gelesen im Worktree `review-migrations-code-reviewer`. Alle sieben geänderten Dateien gelesen: `.github/workflows/ci.yml`, `README.md`, `backend/CLAUDE.md`, `backend/src/__tests__/migrations.pg.test.ts`, `backend/src/db/migrate.ts`, `docs/design/design-decisions.md`, `implementation_plan.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | docs/data-model.md:403-407 | Die alte Regel steht hier unverändert: «Until the first installation, changes go into these two files …» und «recreate those with `bun run db:reset`» ohne Einschränkung auf lokale Datenbanken. Widerspricht der neuen Regel in `backend/CLAUDE.md:24`, die genau diese Datei als Teil jeder Schemaänderung nennt. |
| C-2 | Minor | backend/src/db/migrate.ts:12 | Die Meldung sagt einer Installation nur, was sie nicht tun soll, nicht was zu tun ist (z. B. «die fehlende Migrationsdatei wiederherstellen» / «den Stand des Codes prüfen»). Die Copy-Regel verlangt: was passiert ist und was zu tun ist. |
| C-3 | Nit | .github/workflows/ci.yml:84 | Bei mehreren Dateien enthält `$changed` Zeilenumbrüche; `::error::` nimmt nur die erste Zeile in die Annotation, der Rest («. Put the change …») steht nur im Log. Lokal nachgestellt (Umbenennung + Löschung in Scratch-Repo): Annotation endet nach dem ersten Pfad. `echo "$changed" \| tr '\n' ' '` oder ein `::error file=…::` pro Datei behebt es. |
| C-4 | Nit | .github/workflows/ci.yml:82 | `--diff-filter=MDR` erfasst keinen Typwechsel (`T`, z. B. Datei durch Symlink ersetzt); `--diff-filter=a` (alles ausser Hinzufügen) wäre kürzer und vollständig. |
| C-5 | Nit | implementation_plan.md:9 | Der Plan sagt, `docs/design/design-decisions.md` lasse «until the first installation» fallen; tatsächlich bleibt die Zeile «Session 12» (design-decisions.md:53) als Verlauf stehen und die neue Zeile 54 ersetzt sie. Inhaltlich richtig (Entscheidungslog), nur die Planzeile ist ungenau; ebenso fehlt C-1s Datei in der Liste. |

## C-1 (Major): `docs/data-model.md` beschreibt noch die alte Regel

**Warum falsch:** Anforderung (1) entfernt die Regel «bis zur ersten Installation in 0001/0002 ändern»; (3) verbietet, einer Installation `db:reset` zu raten. `docs/data-model.md:404-407` lautet weiterhin:

> It refuses a database that was set up without this table, or one that has records of migrations that no longer exist (databases from before a baseline); recreate those with `bun run db:reset`. Until the first installation, changes go into these two files (baselines of October 2026, last merged in session 12); afterwards a schema change is a new numbered file.

Die Datei ist in `CLAUDE.md` unter «Documentation» gelistet und wird von `backend/CLAUDE.md:24` als Pflichtbegleiter jeder Migration genannt; wer sie bei der nächsten Schemaänderung liest, findet zwei gegensätzliche Regeln und für die Ablehnung einen Reset-Rat ohne den Hinweis, dass er auf einer Installation alle Daten löscht. Die CI fängt eine Änderung an 0001/0002 zwar ab, den Reset-Rat aber nicht.

**Nachweis:** `grep -n "Until the" docs/data-model.md` im Worktree → Zeile 406. Fix: den Absatz wie `README.md:120-123` formulieren (neue Datei pro Änderung, keine Änderung einer Migration auf `main`, `db:reset` nur lokal).

## Geprüft und bestätigt

- **CI-Schritt (Anforderung 2):** Für `pull_request` checkt `actions/checkout@v4` den Merge-Ref (`refs/pull/N/merge`) aus; mit `fetch-depth: 0` (ci.yml:63) ist `origin/<base_ref>` vorhanden. `origin/main...HEAD` vergleicht mit der Merge-Basis, also die Nettoänderung des PR gegenüber `main`. Ein Merge von `main` in den Branch ändert daran nichts (die von `main` übernommenen Dateien sind in der Basis schon enthalten); eine zurückgenommene Änderung fällt netto weg und wird korrekt nicht gemeldet. Im Scratch-Repo nachgestellt: Umbenennung innerhalb `backend/migrations` → `R` gemeldet (unter neuem Namen), Verschieben nach ausserhalb → als `D` gemeldet (Pathspec vor Rename-Erkennung), neue `0003` → nicht gemeldet. Quoting von `$changed` und des Refs ist korrekt; `base_ref` stammt aus dem eigenen Repository, gleiche Verwendung wie im Job `changes` (ci.yml:32). Der Schritt läuft nur bei Pull Requests; ein direkter Push auf `main` wird nicht geprüft, was der Anforderung («refuse a pull request») entspricht. Der Schritt steht nach Lint/Check; scheitern diese, ist der Job trotzdem rot.
- **Regeltexte (Anforderung 1):** `backend/CLAUDE.md:24` und `README.md:120-123` sagen dasselbe (neue nummerierte Datei; nie ändern, umbenennen, löschen oder neu zusammenführen; CI lehnt ab; `db:reset` nur lokal). `backend/CLAUDE.md:46` (Troubleshooting) bezieht `db:reset` ausdrücklich auf die Entwicklungsdatenbank, das passt. Skills, Agents, Issue-Templates und `docs/test-pyramid.md` enthalten keine Migrationsregel. Entscheidungslog-Zeile vorhanden (design-decisions.md:54).
- **Ablehnungstexte (Anforderung 3):** beide Meldungen in `migrate.ts:22` und `:33` raten `db:reset` nur noch für lokale Datenbanken und warnen vor Datenverlust auf einer Installation; Deutsch mit «ss»-Schreibung unproblematisch (kein ß), verständlich. `migrations.pg.test.ts:54,64` prüft beide vollständigen Texte; der Plan nennt das Rot. Nicht UI-sichtbar, daher keine `messages/*.json` nötig; «No scenario: server-side failure» ist nach Workflow 1 zulässig.
- Planzeilen: `Skills: tdd, ponytail, ponytail-review` und `Test red: …` vorhanden.
- Nichts Fachfremdes im Diff.

## Nicht bestätigt

- Alle vom Aufrufer gemeldeten Checks (`bun run lint`, `bun run check`, `bun run test:coverage`, `cd backend && bun run test` mit 600 bestanden, `bun run type-check`, `bun run deepcheck:audit`, Fallow-/Deepcheck-/Commit-Gates, die lokale Probe des CI-Befehls): «vom Aufrufer gemeldet», nicht erneut ausgeführt (die Backend-Tests laufen unter `bun test` mit PostgreSQL, nicht unter Vitest).
- Ob «Lint and types» in den Branch-Schutzregeln von `main` ein Pflicht-Check ist: im Repository nicht sichtbar; ohne das wäre die Ablehnung nur ein roter Haken, kein Merge-Stopp.
- Verhalten des CI-Schritts auf GitHub selbst (Merge-Ref, Annotation): nur lokal mit `git` nachgestellt, nicht in einem echten Lauf.
