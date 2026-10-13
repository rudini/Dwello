# Review Slice 1 (Hooks) – Branch `claude/b13-workflow-improvements`, Runde 1

Bereich: `git diff 0f0583d~1..0f0583d` (Commit `0f0583d fix(config): block skipped audits, check subjects`), gelesen im Worktree `review-s1`.
Anforderung: Punkte 1 und 2 aus `docs/reviews/b13-instruktionen-pruefung.md`, «Verbesserungen an Instruktionen, Skills, Hooks».

Gelesen: alle 8 geänderten Dateien (`.claude/hooks/commit-msg-gate.mjs`, `.claude/hooks/fallow-gate.sh` ganz, `.claude/settings.json`, `CLAUDE.md`, `eslint.config.js`, `implementation_plan.md`, `tools/claude-hooks/commit-msg-gate.test.ts`, `tools/claude-hooks/fallow-gate.test.ts`).
Selbst ausgeführt: `bunx vitest run tools/claude-hooks` (16/16 grün); 25 zusätzliche Befehle gegen `commit-msg-gate.mjs` (Skript `scratchpad/cm-cases.mjs`); `fallow audit` 2.104.0 und `fallow-gate.sh` in Scratch-Klonen (`scratchpad/fx`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `.claude/hooks/fallow-gate.sh:89`, `CLAUDE.md:85` | Der Ausweg «git fetch origin main» hilft genau im Fall nicht, den der Plan als einzigen Auslöser nennt (Single-Branch-Klon): `origin/main` entsteht nicht, das Gate blockiert weiter, `bunx fallow audit --base origin/main` endet ebenfalls mit Exit 2. |
| C-2 | Minor | `.claude/hooks/commit-msg-gate.mjs:8` | `git -C <pfad> commit -m "…"` wird nicht erkannt (Exit 0 bei «bad subject»). Gerade Agenten mit zurückgesetztem cwd und Worktrees nutzen `git -C`. Dieselbe Lücke haben `fallow-gate.sh:27` und `deepcheck-gate.sh`. |
| C-3 | Minor | `.claude/hooks/commit-msg-gate.mjs:41` | Nur der erste `git commit` eines Befehls wird geprüft: `git commit -m "fix(api): ok" && git commit -m "bad"` geht durch. |
| C-4 | Minor | `tools/claude-hooks/fallow-gate.test.ts:34` | Der Test prüft nur den festen Hinweistext, der bei jedem Exit 2 erscheint, nicht die Ursache («could not detect base branch»); auch C-1 bleibt dadurch unsichtbar. Kein Test, dass der Hinweis wirklich entsperrt. |
| C-5 | Minor | `.claude/hooks/commit-msg-gate.mjs:11-31` | Eigener Shell-Wort-Parser (Heredoc-Regex, Quotes) für einen PreToolUse-Hook; `-F`, `-C`, Editor und `\"` im Betreff (Betreff erscheint als `say \hi\ …`) bleiben ungeprüft bzw. ungenau. Ein echter Git-`commit-msg`-Hook (via `core.hooksPath` aus `session-start.sh`) bekäme die fertige Nachricht und wäre kürzer; die Wahl ist im Plan nicht begründet gegenüber dieser Alternative. |
| C-6 | Nit | `.claude/hooks/commit-msg-gate.mjs:51` | `feat(api)!: …` (Breaking-Change-Form der Conventional Commits) wird mit «write type(scope)» blockiert; CLAUDE.md erwähnt `!` nicht, also korrekt, nur die Meldung führt in die Irre. |

## C-1 (Major): Ausweg aus der Blockade funktioniert im genannten Fall nicht

**Warum falsch.** Das Gate blockiert jetzt jeden `git commit` und `git push`, solange fallow keine Basis findet. Laut Entscheid in `implementation_plan.md` (Session 24, Punkt 1) passiert das «only when none exists (single-branch clone)». In einem Single-Branch-Klon ist `remote.origin.fetch` aber `+refs/heads/<branch>:refs/remotes/origin/<branch>`; `git fetch origin main` schreibt dann nur `FETCH_HEAD`, nicht `refs/remotes/origin/main`. Der Agent folgt dem Hinweis aus Hook-Meldung und CLAUDE.md, bleibt blockiert, und `bunx fallow audit --base origin/main` scheitert mit Exit 2 («origin/main» existiert nicht). Die Anforderung verlangt, dass CLAUDE.md den funktionierenden Befehl nennt; der genannte Weg führt in eine Sackgasse, in der weder Commit noch Push möglich ist.

**Nachweis (reproduziert in `scratchpad/fx`, fallow 2.104.0):**

```
git clone --single-branch --branch feature up c4 && cd c4
git switch -c newwork            # kein Upstream
git remote set-head origin -d    # kein origin/HEAD (mit origin/HEAD findet fallow origin/feature als Basis)
git fetch origin main            # wie vom Hook empfohlen
git rev-parse --verify origin/main   -> fehlt
bash .claude/hooks/fallow-gate.sh <<< '{"tool_input":{"command":"git commit -m x"}}'
  fallow-gate: blocked: fallow audit did not run (could not detect base branch. …)
  fallow-gate: without a base branch run git fetch origin main, then bunx fallow audit --base origin/main.
  exit 2
fallow audit --base origin/main  -> exit 2
git fetch origin main:refs/remotes/origin/main && fallow audit -> verdict pass, "merge-base with origin/main"
```

Ebenso funktioniert `git remote set-branches --add origin main && git fetch origin`. Abhilfe: Hinweis in Hook und CLAUDE.md auf `git fetch origin main:refs/remotes/origin/main` ändern und im Test (C-4) den Single-Branch-Fall mit dem empfohlenen Befehl durchspielen (Gate danach Exit 0).

## Bestätigt

- Punkt 1, Blockieren statt Überspringen: `fallow-gate.sh:85-92` endet bei Exit 2 bzw. `"error": true` mit Exit 2; Test `fallow-gate.test.ts` war laut Plan rot mit der alten «skipping»-Meldung und ist grün. Die Abweichung vom Vorschlag (kein Fallback auf `--base origin/main`) ist im Plan begründet; ich habe sie nachgeprüft: fallow findet `origin/main`, `origin/HEAD` bzw. den Upstream selbst. Die Änderung am generierten Skript ist als Dwello-spezifisch markiert.
- Punkt 1, CLAUDE.md Gotchas nennt `bunx fallow audit --base origin/main` (aber siehe C-1).
- Punkt 2: Typ, Scope (beide aus CLAUDE.md gelesen, Liste existiert einmal), Länge ≤ 50, kein Punkt am Ende. Getestete Formen: `-m "…"`, `-m'…'`, `-m"…"`, `--message …`, `--message=…`, `-qam`, Heredoc mit `'EOF'` und `EOF`, mehrere `-m` (nur der erste ist der Betreff), Umlaute (Zeichen, nicht Bytes), `cd … && git commit`, leerer Betreff, doppeltes Leerzeichen nach dem Doppelpunkt. Registrierung in `.claude/settings.json` ist getestet. Der Hook lief im Review gegen meinen eigenen Bash-Aufruf und blockierte korrekt.
- ESLint-Erweiterung auf `.claude/hooks/*.mjs` ist nötig (Node-Globals) und minimal.
- Keine App-Dateien, keine UI-Texte, keine API-Antworten geändert: Szenario, a11y-Listen, `messages/*.json` und Contracts sind nicht betroffen. Kein unbezogener Diff.

## Nicht bestätigt

- Verhalten in der echten Claude-Code-Laufzeit bei parallelen PreToolUse-Hooks (Reihenfolge, Zusammenführen der Meldungen): nur die Registrierung in `settings.json` gelesen, nicht in einer Session mit blockierendem Fallow und blockierendem Betreff zugleich ausprobiert.
- Ob fallow ausser «could not detect base branch» weitere Exit-2-Fälle hat, die jetzt jeden Commit blockieren und für die der Hinweistext nicht passt: nur `fallow --version` und die Audit-JSON gesehen, keine fallow-Doku zu Exit-Codes gelesen.
- `bun run test:coverage`, `bun run check`, Backend und E2E: nicht ausgeführt (laut Aufrufer offen; keine App-Änderung).
