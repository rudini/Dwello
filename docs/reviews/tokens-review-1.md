# Slice-Review 1: Tokens und Tempo des Agenten-Workflows (fd77a177..20594ded)

Worktree: `/tmp/claude-0/-home-user-Dwello/e78133c4-2c95-5be5-9d56-ba7284233cb8/scratchpad/review-tokens-code` (detached, 20594ded). Ein Commit, neun Dateien, alle gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | implementation_plan.md:137 | Punkt 1 nennt die Regel «compact or start a fresh session at a break» in «`CLAUDE.md`, Workflow». Im Commit steht sie aber unter Gotchas (`CLAUDE.md:108`, «Context») und sagt etwas anderes: über 200k Tokens am Ende des Laufs einmal `/compact` oder eine neue Session empfehlen. Den Plantext an die tatsächliche Regel anpassen. |
| C-2 | Nit | .claude/skills/pull-request/SKILL.md:26 | «and of each its log's end or a `grep`» liest sich schwer, z. B. «and from each only the end of its log or a `grep` for the error». |
| C-3 | Nit | tools/claude-hooks/fallow-gate.test.ts:64 | ponytail `delete:` Die Assertion `toContain('nothing in this command ran')` deckt schon der erste Test ab (Zeile 41). Nichts ersetzt sie. |

Keine Blocker, keine Majors.

## Abgleich mit der Anforderung

1. **Autocompact 75 -> 30 und Regel:** `.claude/settings.json:3` steht auf 30. Die Regel steht in `CLAUDE.md:108`: gezielt lesen, Ausgaben filtern, Hinweis bei über 200k Tokens. Bestätigt (zum Plantext siehe C-1).
2. **CI-Diagnose schlank:** In `pull-request/SKILL.md:26` steht: nur fehlschlagende Jobs, Check-Runs des letzten Commits, Log-Ende oder `grep`, höchstens ein Subagent pro Runde. Bestätigt.
3. **Gezielt lesen statt `cat`:** `CLAUDE.md:108` nennt `grep -n`, `Read` mit `offset`/`limit` und `sed -n` und sagt, dieselbe Datei nicht unverändert erneut zu lesen. Bestätigt.
4. **fallow-Gate gibt Befunde aus statt JSON:** Der Hook macht bei einem Block einen zweiten Lauf `audit --format compact --quiet` und fällt auf das JSON zurück, wenn dieser nichts ausgibt (`fallow-gate.sh:83-89`). Selbst nachgeprüft:
   - Der Hook der Basis (`git show fd77a177:.claude/hooks/fallow-gate.sh`) gibt im selben Probe-Projekt 5742 Bytes aus, ohne die Zeile `unused-export:src/a.ts:2:unusedHelper`.
   - Der neue Hook gibt 348 Bytes aus, mit dieser Zeile, Exit 2.
   - Der neue Test wäre also ohne die Änderung rot (Zeilen 64-66). Bestätigt.
5. **Schnellere lokale Checks:** `package.json:20` hat `--cache`, und `.eslintcache` steht in `.gitignore`. Die ESLint-Konfiguration nutzt keine typbasierten Regeln (kein `parserOptions.project`), der Cache kann also keine Befunde aus anderen Dateien verdecken. In CI gibt es keinen Cache. `vitest.config.ts:47` setzt `pool: 'vmThreads'` nur im Projekt `dom`. `CLAUDE.md:15` nennt `bunx vitest run --changed origin/main`, samt dem richtigen Hinweis, dass Tests, die Dateien als Text lesen, nicht mitlaufen. Bestätigt.

Keine fremden Änderungen im Diff. Commit-Betreff hat 46 Zeichen. Kein Szenario nötig: nur Tooling und Regeln, keine App-Änderung, keine UI-Texte, keine Verträge.

ponytail-review: Nur C-3. Der JSON-Rückfall im Hook ist eine kleine Absicherung und keine spekulative Flexibilität. Sonst schlank.

## Nicht bestätigt

- **Kommentar `vitest.config.ts:46`:** Er sagt «One jsdom per worker instead of one per file … files still isolated». Ob Vitest 5 im Pool `vmThreads` wirklich ein jsdom pro Worker statt pro Datei anlegt, konnte ich nicht prüfen: Das Lesen von `node_modules/vitest/dist` ist durch eine Deny-Regel gesperrt. Wenn jsdom weiterhin pro Datei entsteht, ist nur der Kommentar ungenau (Nit), das Verhalten nicht.
- **Bedeutung von `autocompact_percentage_override`:** Ob 30 tatsächlich «Kompaktierung bei 30 % des Kontextfensters» bedeutet, steht nicht im Repo. Der Schlüssel war schon vorher gesetzt, nur der Wert ist neu.
- **Laufzeit-Angaben** (vitest 92 s -> 61 s, dom 45 s -> 25 s, ESLint 22 s -> 1 s warm): vom Aufrufer gemeldet.
- **Weitere Checks:** `bun run lint`, `bun run check`, `cd backend && bun run type-check`, voller `bunx vitest run` (3135 grün) und `bun run test:coverage`: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- **Selbst nachgeprüft:** `bunx vitest run src/__tests__/open-work.test.ts tools/claude-hooks tools/deepcheck/test/readme.test.ts` (4 Dateien, 39 Tests grün) und den Rot-Lauf des neuen fallow-gate-Tests von Hand gegen den Hook der Basis (siehe Punkt 4).
