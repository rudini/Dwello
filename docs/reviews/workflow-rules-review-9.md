# Code-Review workflow-rules, Runde 9: Delta zu Runde 8 (C-15)

Geprüft: Worktree `review-c15-code-reviewer`, Commit `7784acc`, Delta `git diff 2f8b7ba 7784acc`. Gelesen habe ich alle fünf geänderten Dateien: `CLAUDE.md` (Schritt 7, Zeile 66), `.claude/agents/code-reviewer.md` (Zeile 39), `docs/archive/implementation-plan-verlauf.md` (Zeile 5652), `docs/reviews/workflow-rules-review-8.md` (neu, Kopie meines Berichts aus Runde 8) und `implementation_plan.md` (Session 31). Massstab: die Opus-5.5-Guidance (klare Stopp- und Weiter-Regeln, keine Widersprüche, Belege).

Ergebnis: C-1 bis C-6 sind behoben. Kein Blocker/Major ist offen. Neu ist ein Nit (C-7).

## Status der Befunde aus Runde 8

| ID | Schweregrad | Status | Beleg |
|----|-------------|--------|-------|
| C-1 | Major | behoben | `CLAUDE.md:66`: «for a fix that changes no behavior (docs, agent instructions, comments; a text the user sees is behavior, see step 6)». «text» steht nicht mehr unter den Beispielen. Ein sichtbarer Text gilt ausdrücklich als Verhalten. Das deckt sich mit Schritt 6 (`CLAUDE.md:65`, «a changed help or error text the user sees included»). Persona-Befunde zu UI-Texten bleiben damit beim Test aus Schritt 6. |
| C-2 | Minor | behoben | `CLAUDE.md:66`: «stop, … ask me, unless you fix it and show the fix: with a test shown red and green, or … with one delta review by the same reviewer that confirms it and raises no new Blocker/Major». Die Ausnahme hängt jetzt an der Stoppregel selbst, die Reihenfolge ist also klar. Bestätigt das Delta-Review nicht oder meldet es einen neuen Blocker/Major, ist die Ausnahme nicht erfüllt, und es gilt «stop». «one delta review» begrenzt die Zahl. |
| C-3 | Minor | behoben | Statt «rules» steht «agent instructions». Lint-, Hook- und Guard-Regeln fallen nicht mehr darunter. |
| C-4 | Minor | behoben | `CLAUDE.md:66`: «name the test or the delta review's report in the plan line of the 3rd round». |
| C-5 | Minor | behoben | Session 31 steht in `implementation_plan.md`. Die Archivzeile 5652 nennt H-24 nicht mehr und verweist auf Session 31. Zur Form siehe C-7. |
| C-6 | Nit | behoben | `.claude/agents/code-reviewer.md:39`: «(for a change that alters no behavior, such as docs or agent instructions: by the changed text)». Das passt zu den Begriffen in Schritt 7. |

## Neue Befunde

| ID | Schweregrad | Datei:Zeile | Befund |
|----|-------------|-------------|--------|
| C-7 | Nit | `docs/archive/implementation-plan-verlauf.md:5652` | Die Archivzeile führt C-15 weiter im Teil «open …» und nur mit dem Zusatz «fixed in session 31». Nach dem Format aus Schritt 6 (`open <IDs>, fixed <IDs>`) gehört C-15 in den Teil «fixed». Ein Leser, der nur die IDs überfliegt, sieht C-15 sonst als offen. |

Geprüft und ohne Befund:
- Stopp und Weiter sind jetzt für jeden Fall eindeutig:
  - Behebung mit einem Test, rot und grün gezeigt: weiter.
  - Textfix, vom Delta-Review bestätigt, ohne neuen Blocker/Major: weiter.
  - Textfix, nicht bestätigt oder mit neuem Blocker/Major: stopp und Rückfrage.
  - Verhaltens-Major ohne Test: stopp.
- «Either way there is no 4th round» widerspricht dem Fall «nicht bestätigt» nicht, denn dort wird ohnehin angehalten.
- Kein Widerspruch zu Schritt 4 («Continue only when no Blocker/Major is open (limit: step 7)»), Schritt 6 («Re-review only the delta and the open findings») und Schritt 9. Schritt 9 lässt den `code-reviewer` vor einem Push nur laufen, wenn sich App-Code geändert hat.
- `docs/reviews/workflow-rules-review-8.md` ist inhaltsgleich mit meinem Bericht aus Runde 8.
- Session 31 hat keine Zeile `Skills: …`. Das ist richtig, denn der Slice ändert keinen Code.
- Die Planzeile «code-reviewer round 1 (`docs/reviews/workflow-rules-review-8.md`)» zählt die Runde pro Slice, der Berichtspfad dagegen fortlaufend pro Thema. Das ist mit Schritt 6 vereinbar.

## Nicht bestätigt

- `open-work.test.ts` für den neuen Plan: vom Aufrufer gemeldet («`open-work.test.ts` run for the plan»), von mir nicht wiederholt.
- Ob ein `## Session` unter dem Kopf von `implementation_plan.md` alle Formregeln von `open-work.test.ts` erfüllt, habe ich nur aus dem Text gelesen, nicht im Test nachgeprüft.
- `fach-reviewer.md` und `daten-pruefer.md` habe ich nicht erneut gelesen, sie sind im Delta unverändert. Die neue Ausnahme gilt dort nur über `CLAUDE.md`. Für diese Reviewer gibt es kein eigenes Abschlusskriterium wie das ergänzte in `code-reviewer.md`. Bei ihren Prüfgegenständen (Fachregeln, Beträge, Rechtstexte für Benutzer) ist ein Fix ohne Verhaltensänderung selten.
