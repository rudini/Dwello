# Code-Review: Agent-Berichte kürzer und sicherer (1b5baa08)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | .claude/agents/fach-reviewer.md:25 | Die ELI-Liste nennt OR, VMWG, DSG, DSV, aber nicht FMG und UWG, die dieselbe Datei in der Rolle «Rechtstexte» (Zeile 13: Art. 45c FMG, Art. 8 UWG) verlangt; der Text sagt auch nicht, wie man eine fehlende ELI findet. Ergänzung: FMG `eli/cc/1997/2187_2187_2187`, UWG `eli/cc/1988/223_223_223` (beide mit derselben Abfrage geprüft: FMG Stand 2026-06-01, UWG Stand 2025-01-01, je eine HTML-Datei). |

Geprüft: Punkt 1 (Abfrage selbst ausgeführt: OR DEU Stand 2026-10-01, VMWG ITA 2025-10-01, DSG FRA 2025-07-07, DSV DEU 2025-12-01; VMWG ENG liefert leer, wie der Text sagt; je Stand genau eine HTML-Datei, `LIMIT 1` wählt also nicht zufällig; OR-Datei enthält `id="art_257_b"`; Gesetzestexte nur im Scratchpad, keine Datei im Repository), Punkt 2 (Plan-Punkte in «Geprüft», Wording-Tabelle `key | de | fr | it | en`), Punkt 3 (Persona-Tabelle ohne Nit, Kleinigkeiten in «Beobachtungen»), Punkt 5 (code-reviewer und fach-reviewer: «Geschlossen: …»-Zeile); Abgleich mit `CLAUDE.md` (Workflow 7, «Done means»), `.claude/skills/slice-review/SKILL.md` (Zeilen 32, 38, 41, 42) und `docs/design/personas/README.md` ohne Widerspruch (die Aufzählung «Blocker / Major / Minor / Nit» in slice-review:38 bleibt für daten-pruefer gültig); Diff enthält nichts ausserhalb der Anforderung.

## Nicht bestätigt

- `bunx vitest run src/__tests__/open-work.test.ts` (4 Tests grün): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Ob der Anker-Muster `id="art_<n>_<buchstabe>"` für jedes Gesetz gilt: nur in der OR-Datei gesehen.
