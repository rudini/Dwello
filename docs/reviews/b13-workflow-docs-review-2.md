# Review Slice 2 (b13-workflow-improvements), Runde 2 (nur Delta)

Anforderung: Punkte 4, 10, 12, 16 und 18 aus `docs/reviews/b13-instruktionen-pruefung.md` sowie die offenen Befunde C-1 bis C-6 aus `docs/reviews/b13-workflow-docs-review-1.md`.
Umfang: `git diff 7fba747..3d75123 -- CLAUDE.md .claude/agents .claude/skills tests/e2e/CLAUDE.md` (5 Dateien, je eine Zeile), Triage in `implementation_plan.md`, Session 24, «Findings slice 2». Gelesen im Worktree `review-s2b` (3d75123).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | (Major) | `CLAUDE.md:63`, `.claude/agents/persona.md:10` | Behoben: Nur Personas, die speichern müssen, bekommen ein eigenes Gebäude («there are three»). Die anderen schauen nur, und `persona.md` sagt dazu: «Without a building from the caller, do not save». |
| C-2 | (Minor) | `.claude/agents/code-reviewer.md:21`, `.claude/skills/bdd-acceptance/SKILL.md:21` | Behoben: Beide Stellen sagen jetzt «one endpoint with all its calls» bzw. «that endpoint (all its calls)», gleich wie `CLAUDE.md:53`, `tests/e2e/CLAUDE.md:64` und `docs/test-pyramid.md:30`. |
| C-3 | (Minor) | `.claude/agents/persona.md:10` | Behoben: Ohne Gebäude speichert die Persona nicht. Datensätze anderer Personas, die sie in Übersichten sieht, sind keine Befunde. |
| C-4 | (Nit) | `tests/e2e/CLAUDE.md:64` | Behoben: «lifts every route of the page» stimmt mit `unrouteAll()` überein (`screenplay/interactions.ts:141`). |
| C-5 | (Nit) | `package.json:13` | Die Ablehnung hält: Runde 1 hat nachgewiesen, dass `bddgen` den Ordner leert und ein rotes `bddgen` die `&&`-Kette anhält. Was übrig bleibt (ein `playwright test` von Hand ohne `bddgen`), deckt die Notiz in `tests/e2e/CLAUDE.md:15` ab. |
| C-6 | (Nit) | Commit 72a901d | Die Ablehnung hält: Es geht nur um die Testkonfiguration, das Verhalten der App ändert sich nicht. Den Commit umzuschreiben, während er geprüft wird, würde gegen Workflow 4 verstossen. |
| C-7 | Nit | `CLAUDE.md:63` | «(there are three)» schreibt die Zahl der Demo-Gebäude fest. Wenn sich `backend/demo/demo-data.sql` ändert, stimmt die Zahl nicht mehr. Besser wäre ein Verweis auf die Demodaten statt der Zahl. |

Die IDs in Klammern sind Befunde aus Runde 1 mit ihrem damaligen Schweregrad; sie sind geschlossen.

## Blocker/Major

Keine offen.

## Bestätigt

- Das Delta enthält nichts ausserhalb der Befunde. Jede geänderte Zeile gehört zu C-1 bis C-4, Formatierung oder Umbauten fremder Stellen gibt es nicht.
- `CLAUDE.md` Workflow 5 und `persona.md` widersprechen sich nicht. Der Aufrufer gibt höchstens drei Personas ein Gebäude, und nur diese speichern. Punkt 10 (speichern wie ein Benutzer) und Punkt 18 (keine fremden Datensätze im eigenen Gebäude) gelten damit beide.
- `docs/design/arbeitsregeln.md` («Persona runs: how») und `docs/design/personas/README.md` enthalten keine Regel zum Speichern oder zu Gebäuden, die der neuen Zeile widerspricht (gesucht nach «save», «speicher», «building», «Gebäude»).
- Nach dem Delta sagt keine Anweisung mehr «a failing request» ohne «ein Endpunkt mit allen seinen Aufrufen» (gesucht in `CLAUDE.md`, `.claude/`, `tests/e2e/CLAUDE.md` und `docs/test-pyramid.md`).
- Für eine reine Doku-Änderung braucht es weder ein Szenario noch Texte in `messages/*.json` oder einen Vertrag.

## Nicht bestätigt

- **`actionTimeout: 10000` über alle Browser:** Das ist der offene Punkt aus Runde 1 (begrenzt das Warten in `Wait.until` und `DownloadFrom` auf 10 s). Der volle E2E-Lauf läuft beim Aufrufer noch, und ich durfte ihn nicht starten. Erst sein Ergebnis im Plan schliesst den Punkt.
- **Ob die drei Demo-Gebäude zu den Aufgaben der speichernden Personas passen** (eine freie Wohnung, ein Jahr ohne Abrechnung): nicht nachgeprüft, weil keine Persona gelaufen ist.
- Die Prüfergebnisse des Aufrufers (Coverage, Backend, Lint) habe ich übernommen und nicht selbst neu laufen lassen.
