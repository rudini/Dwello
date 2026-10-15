# Review slice «skill slice-review», Runde 1

Geprüft: `git diff aba7193 45af1a3` im Worktree `review-slice-skill` (45af1a3). Gelesen: `CLAUDE.md` (ganzer Workflow), `.claude/skills/slice-review/SKILL.md`, `implementation_plan.md`, alle vier `.claude/agents/*.md`, `docs/design/arbeitsregeln.md` («Review cycle», «Personas», «Persona runs: how»), Massstab `opus-guidance.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `.claude/skills/slice-review/SKILL.md:12` | Neue Vorbedingung für jeden Reviewer: «lint, the affected tests and `bun run deepcheck:audit` are clean on it». Im alten Text galt das nur für den Slice-Review von `code-reviewer` (alter Schritt 4); der `fach-reviewer` auf dem `@wip`-Szenario-Commit (Workflow 1) und die Feature-Review-Reviewer (Workflow 5) hatten diese Bedingung nicht. Kleine Bedeutungsänderung; besser «For `code-reviewer`: …» oder auf `CLAUDE.md` Schritt 4 verweisen. |
| C-2 | Minor | `.claude/skills/slice-review/SKILL.md:26-32` | «Name in each reviewer's prompt» passt nicht zu jedem Agenten: die Persona braucht die Persona und ihre Aufgabe (`persona.md:7`, `CLAUDE.md` Schritt 5 «each with a task on the change»), der `daten-pruefer` die betroffenen Datensätze (`daten-pruefer.md:7` «names the change and the affected records»); beides fehlt in der Liste. Umgekehrt verlangt die Liste für Personas Commit-Bereich und Checks, die eine Persona nicht lesen darf (`persona.md:12`). Kein Verlust gegenüber dem alten Text (der hatte keine Liste), aber die Liste wirkt abschliessend. Vorschlag: pro Agent unterscheiden oder auf `arbeitsregeln.md` «Persona prompt essentials» verweisen. |
| C-3 | Minor | `.claude/skills/slice-review/SKILL.md:30` | «the building they may save in» für jede Persona; `CLAUDE.md` Schritt 5 gibt ein Gebäude nur der Persona, die speichern muss («the others only look»). Besser «the building, if it needs to save». |
| C-4 | Minor | `.claude/skills/slice-review/SKILL.md:12,39-40` und `CLAUDE.md:59,66` | Regeln stehen doppelt: Vorbedingung und Prompt-Inhalt von `code-reviewer` (CLAUDE.md:59 und SKILL.md:12/28-31), «Check each finding's evidence … reject … with the reason» (CLAUDE.md:66 und SKILL.md:39), «a fix that changes behavior … gets a failing test first» (CLAUDE.md:66 und SKILL.md:40). Der Auftrag war: Regeln in `CLAUDE.md`, Ablauf im Skill. Doppelt formulierte Regeln driften; im Skill genügt der Verweis (wie bei SKILL.md:8). |
| C-5 | Nit | `CLAUDE.md:59` | Die Definition «reviewer subagent (`code-reviewer`, `fach-reviewer`, `daten-pruefer`)» ist entfallen; «Load the skill `slice-review` before starting any reviewer subagent» lässt offen, ob die Persona dazugehört. Die Skill-`description` nennt sie, also lädt die Sitzung den Skill wohl auch dort; ein «(also `persona`)» würde es eindeutig machen. |
| C-6 | Nit | `CLAUDE.md:55,64` | Workflow 1 und 5 verweisen nur mit «(skill `slice-review`)» statt «load the skill»; der Ladebefehl steht erst in Schritt 4, obwohl der `fach-reviewer` in Schritt 1 zuerst läuft. Wirkt dank der `description` trotzdem, aber «load» an der ersten Stelle wäre zuverlässiger. |
| C-7 | Nit | `.claude/skills/slice-review/SKILL.md:44` | Keine Regel, was zu tun ist, wenn `git worktree remove` ohne `--force` scheitert (z. B. Reviewer hat Dateien angelegt) oder ein Reviewer meldet «no worktree» bzw. App nicht erreichbar. Leitfaden Punkt 1/4: Stopp-Bedingung nennen. Im alten Text fehlte das auch. |
| C-8 | Nit | `docs/design/arbeitsregeln.md:78` | «the reviews after the redesign follow `CLAUDE.md`, Workflow steps 4 to 7» – nicht geändert, führt aber weiterhin über Schritt 4 zum Skill; optional «and skill `slice-review`» ergänzen. |
| C-9 | Nit | `implementation_plan.md:4-5` | Zwei Leerzeilen vor `## Session`. |

Keine Blocker, keine Major.

## Abgleich Satz für Satz (Check 1)

Jeder aus `CLAUDE.md` entfernte Satz steht entweder noch in `CLAUDE.md` oder im Skill mit gleicher Bedeutung:

- Alt Schritt 4 «results of the checks … rerun after any change since» → CLAUDE.md:59 (Checks) + SKILL.md:12 («A check you ran before a later change, run again»), SKILL.md:31 («with their results»).
- Eigener Worktree je `code-reviewer`/`fach-reviewer`/`daten-pruefer`, Befehle, Name im Prompt → SKILL.md:13-19, 30.
- Report-Pfad im Scratchpad, später an seinen Ort kopieren → SKILL.md:32, 38.
- «keep working in your tree, but do not amend or rebase» → SKILL.md:34.
- `node_modules`-Leseverbot → SKILL.md:22.
- Worktree nach Triage entfernen, kein `--force` → SKILL.md:44.
- Alt Schritt 6: Dateinamen `<slice>-review-<n>.md`, `-fachreview-`, `-datenpruefung-`, Persona-Pfad → SKILL.md:32, 38; Planzeilenformat, «findings stay in the report», Statusänderung in der Zeile der auslösenden Runde → SKILL.md:41-43.
- Workflow 1 und 5 «(step 4)» → «(skill `slice-review`)»: gleiche Bedeutung.

Kein Bedeutungsverlust gefunden; Bedeutungserweiterungen siehe C-1 und C-3.

## Widersprüche (Check 2)

Kein Widerspruch zu den Agenten: Persona-Berichtspfad `docs/design/personas/<persona>-<slice>.md` (SKILL.md:32 = `persona.md:17`), Worktree-Pflicht der drei Reviewer (alle drei Agenten stoppen ohne Worktree), Port :3300 (`persona.md:9`, `daten-pruefer.md:9`), Persona ohne Worktree (`CLAUDE.md:64`). `arbeitsregeln.md` «Persona runs: how» widerspricht nicht (Persona schreibt nur ihren Bericht ins Repository). Lücken der Prompt-Liste: C-2, C-3.

## Laden und Doppelungen (Check 3)

`CLAUDE.md:59` sagt ausdrücklich «Load the skill `slice-review` before starting any reviewer subagent»; die `description` nennt alle vier Agenten und die Schritte 1, 4–6. Laden ist damit verlässlich (Schwächen C-5, C-6). Ablauf an anderer Stelle: nur `arbeitsregeln.md` «Review cycle» (Redesign-Archiv, als abgeschlossen markiert, Zeile 1-3) und «Persona prompt essentials» (ergänzend, nicht doppelt). Doppelt formulierte Regeln: C-4.

## Leitfaden (Check 4)

Ziellinie vorhanden (SKILL.md:46, konkret prüfbar). Wann/welcher Reviewer und Stopp nach Runde 3 bleiben in `CLAUDE.md` (SKILL.md:8 verweist korrekt). Keine Denk-Anweisungen. Fehlende Stopp-Bedingungen für Fehlerfälle: C-7.

## Nicht bestätigt

- lint 0, check 0, test:coverage 2442 grün, Backend-Tests 615, type-check: vom Aufrufer gemeldet, nicht erneut ausgeführt (Änderung betrifft nur Markdown; `src/__tests__/open-work.test.ts:20` scannt `.claude/skills` auf Marker, der Skill enthält keine).
- Ob Claude Code den Skill tatsächlich automatisch aus der `description` lädt: nicht ausprobiert, nur Frontmatter-Format mit `.claude/skills/tdd/SKILL.md` verglichen (gleich).
- Kürzung von `CLAUDE.md`: nur aus dem Diff (Schritt 4 und 6 kürzer, 4 Zeilen geändert), Zeichenzahl nicht gemessen.

Urteil: mergebar, keine Blocker/Major; vier Minors (C-1 bis C-4) sollten vor dem Merge kurz nachgezogen werden.
