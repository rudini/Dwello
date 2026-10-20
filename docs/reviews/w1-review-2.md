# W1 Code-Review 2 (Delta cdfcdca5..ef6e4f0e)

## Status der offenen IDs aus `docs/reviews/w1-review-1.md`

- C-1 (Major): erledigt. Der Product Owner hat die Anforderung neu gefasst, und ef6e4f0e setzt die drei Verschiebungen um. `CLAUDE.md` ist von 22337 auf 20360 Bytes geschrumpft (`git show cdfcdca5:CLAUDE.md | wc -c` gegenüber `wc -c CLAUDE.md`).

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-7 | Minor | CLAUDE.md:78, .claude/skills/issue-triage/SKILL.md:10 | Zwei Verweise zeigen noch auf «Open work», obwohl die Regeln dort nicht mehr stehen. «When to ask» nennt für die Regel «ein offenes `entscheiden`-Issue auf denselben Daten» weiter `("Open work")`. `issue-triage` sagt: «The rules for issues are in `CLAUDE.md`, "Open work" … read them first». Die Regeln zu Bereitschaft, `entscheiden` und Entscheidungs-Issues stehen jetzt aber in `issue-work`. Laut Anforderung sollen die Verweise mitgehen. Über die Zeile in «Open work» findet man sie zwar noch, aber nur mit einem Umweg. |

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet, ich habe sie nicht wiederholt: `bun run lint`; `bunx vitest run` mit `open-work`, `commit-msg-gate`, `check-issues` und deepcheck `readme` (40 grün); `bunx prettier --check tools/open-work/check-issues.mjs`.
- Ob der Harness den Skill beim Satz «Setze #n um» tatsächlich lädt, kann ich nur an seinem Text beurteilen. Die Beschreibung nennt «Setze #n um» und «work on #n» ausdrücklich, und in `CLAUDE.md:91` steht ein Verweis auf den Skill. Laufen lassen habe ich es nicht.

Geprüft: Die drei Punkte aus «Open work» stehen Wort für Wort in `issue-work`. «One build» steht in `tests/e2e/CLAUDE.md` unter «Run», mit der richtigen E2E-Portnummer 3100 (`playwright.config.ts:27`). In `personas/README.md` stehen der Persona-Port 3300 und der Verweis auf «Run». Der Teil von «Cloud sessions» zu `session-start` ist vollständig in «Run» übernommen, der Satz zum Scratchpad bleibt in `CLAUDE.md`. In Workflow 5 fehlt nichts: Bei «Which personas» kam «each gets a task on the change» dazu. Fehlerzustände, Speichern, Sprachen und PDFs stehen schon im README. `grill-me` und der Kommentar in `check-issues.mjs` sind nachgeführt. Ausser in Archiv und Plan verweist nichts mehr auf «One build». Die übrigen Verweise auf «Open work» (Marker, Labels, `offene-punkte.md`) treffen weiterhin zu. Am Diff ist nichts, was nicht zur Anforderung gehört.
