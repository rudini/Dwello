# Review Slice 1 (Hooks) – Branch `claude/b13-workflow-improvements`, Runde 2 (Delta)

Bereich: `git diff 0f0583d..e3ea106 -- .claude tools docs/design/offene-punkte.md` und die Zeile «Fallow gate» in `CLAUDE.md` (Gotchas); die übrigen CLAUDE.md-Zeilen gehören zu Slice 2 und sind nicht Teil dieser Runde.
Gelesen im Worktree `review-s2` (72a901d): `.claude/hooks/commit-msg-gate.mjs` (ganz), `.claude/hooks/fallow-gate.sh` (Delta), `tools/claude-hooks/commit-msg-gate.test.ts`, `tools/claude-hooks/fallow-gate.test.ts`, `docs/design/offene-punkte.md` (H-20), Triage in `implementation_plan.md`, Session 24, «Findings slice 1».
Selbst ausgeführt: `bunx vitest run tools/claude-hooks` (18/18 grün); 9 zusätzliche Befehle gegen `commit-msg-gate.mjs` (Skript `scratchpad/r2-cases.mjs`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | – | `.claude/hooks/fallow-gate.sh:89`, `CLAUDE.md` Gotchas «Fallow gate» | Behoben: Hinweis lautet `git fetch origin main:refs/remotes/origin/main`; der Test führt genau den Befehl aus der Hook-Meldung im Single-Branch-Klon aus und erwartet danach Exit 0. |
| C-2 | – | `.claude/hooks/commit-msg-gate.mjs:8` | Behoben für `git -C <pfad> commit` (Test vorhanden). Die beiden anderen Gates: als H-20 in `offene-punkte.md` erfasst. |
| C-3 | – | `.claude/hooks/commit-msg-gate.mjs:8,40-61` | Behoben: alle `git commit` eines Befehls werden geprüft, Meldungen zusammengeführt (Test mit `&& git commit --amend -m`). |
| C-4 | – | `tools/claude-hooks/fallow-gate.test.ts:37-44` | Behoben: Test prüft die Ursache «could not detect base branch» und, dass der genannte Fetch entsperrt. |
| C-5 | – | – | Ablehnung trägt (siehe unten). |
| C-6 | – | – | Ablehnung trägt (siehe unten). |
| C-7 | Nit | `.claude/hooks/commit-msg-gate.mjs:8` | `git -C "/pfad mit leerzeichen" commit`, `git -C/x commit` und globale Optionen wie `git -c user.name=x commit` werden nicht erkannt (Exit 0 bei falschem Betreff). Im Repo ohne Leerzeichen in Pfaden praktisch nicht relevant; passt zur Art von H-20 (Textabgleich), dort mitnehmen. |

Kein Blocker, kein Major offen.

## Bestätigt

- **C-1:** In der Runde 1 reproduzierten Situation (Single-Branch-Klon, kein Upstream, kein `origin/HEAD`) blockiert das Gate mit «could not detect base branch»; der Test liest den Befehl per Regex aus der echten Hook-Meldung (`/run (git fetch [^,]+)/`), führt ihn aus und erwartet `status: 0`. Damit ist Meldung und Wirkung gekoppelt; mit dem alten Hinweis wäre der Test rot (in Runde 1 nachgestellt: `origin/main` entsteht nicht). CLAUDE.md nennt denselben Befehl. Dass CLAUDE.md nicht mehr `bunx fallow audit --base origin/main` nennt (Vorschlag in Punkt 1), ist richtig: ohne `origin/main` scheitert dieser Befehl ebenfalls, nach dem Fetch findet fallow die Basis selbst.
- **C-2/C-3:** Selbst geprüft: `git commit -m "fix(api): ok"; git commit -m <falsch>` blockiert; `… && git -C /x commit --amend --no-edit` geht durch (kein `-m`, wie dokumentiert); `git -C /x push` und ein Betreff, der «git commit» im Text enthält, gehen durch. Die zweite Fundstelle innerhalb eines Anführungszeichens ergibt kein `-m` und wird übersprungen.
- **C-5 (Ablehnung):** Ein Git-`commit-msg`-Hook über `core.hooksPath` bräuchte Einrichtung pro Klon; `session-start.sh` läuft nur in Cloud-Sessions, lokale Checkouts und Worktrees blieben ungeprüft. Der PreToolUse-Hook greift in jeder Claude-Session ohne Einrichtung. Die ungeprüften Formen (`-F`, Editor) sind im Hook-Kopf (Zeile 4) dokumentiert. Die Begründung hält.
- **C-6 (Ablehnung):** CLAUDE.md erlaubt `!` nicht; die Meldung nennt die erwartete Form `type(scope): subject` mit der Typliste. Hält.
- **H-20** in `docs/design/offene-punkte.md`: nicht-funktional, richtige Liste, mit Ort und nächstem Schritt. Den Heredoc-Fall habe ich selbst ausgelöst: ein Testbefehl, der nur Text `git commit -m "…"` enthielt, wurde von `commit-msg-gate.mjs` blockiert; die Zeile beschreibt das zutreffend.
- Kein unbezogener Diff im geprüften Bereich; keine App-Dateien, UI-Texte, API-Antworten oder E2E-Dateien betroffen (Szenario, a11y-Listen, `messages/*.json`, Contracts nicht nötig).

## Nicht bestätigt

- Ob `git fetch origin main:refs/remotes/origin/main` auch in einem Klon wirkt, in dem `origin/main` bereits existiert, aber nicht vorspulbar ist (ohne `+` lehnt Git das ab): dann findet fallow aber eine Basis und blockiert nicht aus diesem Grund; nicht ausprobiert.
- Verhalten mehrerer PreToolUse-Hooks zugleich in der echten Claude-Code-Laufzeit: weiterhin nur die Registrierung gelesen (wie Runde 1).
- `bun run test:coverage`, Backend-Tests und E2E: nicht ausgeführt (keine App-Änderung im Delta); lint, `bun run check`, fallow audit und deepcheck:audit laut Aufrufer grün, nicht selbst wiederholt.
