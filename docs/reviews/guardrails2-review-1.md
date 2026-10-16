# Code-Review guardrails2, Runde 1 (`git diff 40ba767 d32ca39`)

Worktree: `/tmp/claude-0/-home-user-Dwello/7e919a24-054e-56e7-9c0f-82137de40f52/scratchpad/review-guardrails2-code` (HEAD d32ca39). Alle 17 geänderten Dateien gelesen. Kein Blocker, kein Major.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | CLAUDE.md:101, docs/design/tools/persona-stack.sh:18 | «E2E may run while personas run» stimmt nur, wenn der Persona-Stack vor E2E startet. Beide nutzen denselben KI-Stand-in auf :2527 (persona-stack.sh startet ihn nur, wenn noch keiner antwortet; playwright.config.ts:74 hat `reuseExistingServer: true`) und dasselbe SMTP :2525. Startet E2E zuerst, übernimmt der Persona-Stack den Stand-in von Playwright, und Playwright beendet ihn am Ende des E2E-Laufs: Die Personas haben dann keine KI mehr. Der alte Text warnte vor «a persona stack started during an E2E run», der neue sagt dazu nichts. Die Reihenfolge nennen (Stack zuerst) oder den Stand-in im Stack auf einem eigenen Port starten. |
| C-2 | Minor | docs/design/arbeitsregeln.md:79 | Veraltet: «a copy of the production build on 3300; `--no-build` reuses the last build». Jetzt baut der Stack einen eigenen Build, und `--no-build` liefert nur den letzten Persona-Build aus. Fehlt `/tmp/persona-app`, bricht das Skript wegen `set -e` bei `cp package.json` ab (persona-stack.sh:14). |
| C-3 | Minor | docs/design/personas/README.md:19 vs. CLAUDE.md:61 | CLAUDE.md verlangt «once per affected persona». Die Matrix macht aber bei jeder geänderten Ansicht Marco betroffen (Device), dazu die Persona des Bildschirms und je nach Art der Änderung eine weitere. «Usually one or two fit» stimmt also selten, und «when unsure, the two that fit best» widerspricht «once per affected persona». Unklar ist, ob die Matrix gilt oder die Obergrenze. |
| C-4 | Minor | CLAUDE.md:67 | Die neue Ausnahme «a wording fix of a translation that a reviewer named and checked needs none» kollidiert mit dem nächsten Satz desselben Schritts, «A fixed persona finding is closed by a test that shows it (… red before the fix)», wenn eine Persona die Übersetzung bemängelt hat. Es fehlt, welche Regel dann gilt. |
| C-5 | Nit | .claude/skills/slice-review/SKILL.md:29 | Verweist für den Fehlerzustand (Request/SQL) auf «`CLAUDE.md`, Workflow 5». Die Einzelheiten stehen jetzt in `docs/design/personas/README.md`, «Running a review». Die Kette über den Verweis in CLAUDE.md:61 funktioniert, ein direkter Verweis wäre kürzer. |
| C-6 | Nit | Commit d32ca39 | Typ `docs(config)` für eine Änderung an Tooling und Konfiguration (svelte.config.js, persona-stack.sh, Hook, Tests). `chore(config)` passt besser. |

Ponytail-review des Diffs: nichts zu streichen. Lean already. Ship.

## Geprüft und bestätigt

- **Verschiebungen:** Die fünf «No scenario»-Fälle stehen wörtlich in tests/e2e/CLAUDE.md:61–69, und CLAUDE.md:53 verweist darauf. Auch die Persona-Einzelheiten sind vollständig in personas/README.md «Running a review» angekommen: Fehlerzustand mit Request oder SQL, keine Persona bei Zuständen ausserhalb des Stacks, Build-Zeit-Werte mit `APP_VERSION`, PDF mit Dr. Weber und daten-pruefer. CLAUDE.md:61 verweist dorthin. Neu dazugekommen ist das SQL, das blockierende Demo-Datensätze entfernt.
- **svelte.config.js:** Ohne `BUILD_DIR` gilt `out: 'build'` (Standard von adapter-node) und `outDir: '.svelte-kit'` (Standard). CI, Dockerfile und Workflows setzen `BUILD_DIR` nicht (per grep geprüft). `.svelte-kit/persona` ist durch `.gitignore`, die ESLint-Ignores und die `include`-Liste der tsconfig von lint, check und vitest ausgeschlossen. Die Root-tsconfig erweitert weiter `.svelte-kit/tsconfig.json`, und das überschreibt der Persona-Build nicht.
- **persona-stack.sh:** adapter-node leert sein `out` vor dem Schreiben. Deshalb kommen `package.json` und `node_modules`-Link erst nach dem Build, so wie das Skript es macht. `ln -sfn` ersetzt einen alten Link.
- **pdf-translations.test.ts ist nicht trivial grün:** Ich habe die Parse-Logik gegen das echte `pdf.service.ts` nachgebaut. Ergebnis: de 75 Schlüssel, fr/it/en je 74, es fehlt nur `sqm` (in `shared`). Wenn `title` aus fr entfernt wird, meldet der Test `['title']`. Bricht das Parsen (anderes Format), ist die fr-Liste leer und der Test wird rot. Der Schutz `> 50` fängt einen leeren de-Block ab. Alle Schlüssel haben die Form `\t\t\w+:`.
- **open-work-Test:** 91 IDs gefunden. Eine duplizierte Zeile meldet `['U-1']`. Die Kopfzeilen `| ID |` werden nicht erfasst.
- **commit-msg-gate:** Ohne `--check` bleibt der Ablauf wie vorher (stdin-JSON, gleiche `calls` und Meldungen). Mit `--check` wird stdin nicht gelesen, und die Zeile «nothing in this command ran» entfällt. Der Red-Grund (`JSON.parse('')`) ist plausibel.
- **Fallow- und Deepcheck-Hooks auf `git push` behalten:** begründet. `git merge` erzeugt Commits, die kein `git commit`-Hook sieht. Das passt zu Workflow 9: volle Checks vor dem ersten Push, danach lint, check und betroffene Tests.
- **Konsistenz deepcheck:audit:** CLAUDE.md:58, tdd-Skill, code-reviewer-Beschreibung, tools/deepcheck/README.md:67 und readme.test.ts sind stimmig. Ein «after each step» bleibt nur in historischen Dokumenten (DEEP-MODULE_BRIEF.md).
- **ponytail-review:** Der Schritt steht jetzt in code-reviewer.md:16. In aktiven Regeln gibt es keinen Rest eines eigenen Schritts oder einer Notiz «Skills:».
- **Weitere umgesetzte Vorgaben:** Issue-Vorlage («how a landlord reaches the state»; «pin» stand schon in task.md:22), Prüfung offener `entscheiden`-Issues, grill-me Schritt 4, geteiltes Issue in Workflow 8, Triage «= P-1», Exit-Codes, Stash-Gotcha (Ablauf wie in den git-Docs zu `--keep-index`), `--check` im Gotcha.
- **Plan:** Er enthält eine Session.
- **Red-Zeilen:** für alle drei neuen Tests vorhanden. readme.test.ts hat nur einen neuen Namen und braucht keine.
- **Nichts Fremdes im Diff:** keine Formatierung und kein Refactoring an unberührtem Code. Keine App-Änderung, also braucht es weder Szenario noch messages oder a11y.

## Nicht bestätigt

- Die Checks `bun run test:coverage` (0, 2608), `bun run lint` (0), `bun run check` (0), `cd backend && bun run test` (0, 683) und `bun run type-check` (0) sowie die Hook-Durchläufe beim Commit: vom Aufrufer gemeldet. Selbst ausgeführt habe ich `bunx vitest run src/__tests__/open-work.test.ts tools/claude-hooks/commit-msg-gate.test.ts tools/deepcheck/test/readme.test.ts`: Exit 0, 37 Tests.
- `backend/src/__tests__/pdf-translations.test.ts` habe ich nicht mit `bun test` laufen lassen, weil der Preload Testdatenbanken neu anlegt. Die Logik habe ich mit Node nachgebaut (siehe oben). Dass der Test grün ist: vom Aufrufer gemeldet.
- Persona-Stack mit `BUILD_DIR` und E2E «Fusszeile» (3 passed) während die Persona-App antwortete: vom Aufrufer gemeldet. Nicht nachgeprüft, weil ein Build Dateien schreibt. Gleichzeitige Builds (Paraglide schreibt dabei `src/lib/paraglide/`) und die Reihenfolge «E2E zuerst» (C-1) hat niemand ausprobiert.
