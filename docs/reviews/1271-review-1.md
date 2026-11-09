# Review #1271, Runde 1 (d796b65b..5b393921)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tools/open-work/check-issues.mjs:79-80 | «Type» mit mehreren Kategorien (z. B. `bug, nfr:security` oder «kein domain, sondern nfr:usability») geht grün; es zählt das erste gültige Wort. Die Anforderung und der Hinweis der Vorlage verlangen genau eine Kategorie; bei einem Fork entscheidet die Reihenfolge, ob er zum Label passt. |
| C-2 | Minor | tools/open-work/check-issues.mjs:233 | `readiness` liest `issues/<n>`, und das liefert auch Pull Requests. Ein Fork, der `Closes #<PR-Nummer>` schreibt, gilt als bereit, wenn dieser PR offen ist und genau ein Typ-Label trägt. Die Anforderung verlangt ein offenes Issue (der Marker-Check oben schliesst PRs über `pull_request` bereits aus). |
| C-3 | Minor | tools/open-work/check-issues.mjs:233 | Der Zweig «#n is not ready: it is missing (HTTP …)» hat keinen Test (die Stand-in-API antwortet für Issues immer 200). |

Keine Blocker/Major.

Geprüft: alle vier Dateien des Diffs; Vorlage, Skill-Text, Abschnitts-Parser (CRLF, `###`, HTML-Kommentare, leerer Abschnitt, fehlender Abschnitt), Ausnahme für Dependabot, Fork-Erkennung über head/base, Überspringen ohne PR_NUMBER/Token (Push, lokal), CI-Aufruf in `.github/workflows/ci.yml:224-240` (PR_NUMBER und Token gesetzt, Skript der Zielbranch); Tests für jeden roten Fall aus «Done means» und den grünen Fall; jeder neue Test schlägt beim Lesen ohne die Änderung fehl (Vorlagentest: auf der Basis «lacks», nicht «empty»); `SECTIONS` ändert die Aussage der bestehenden Tests nicht.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main`, `bunx vitest run tools/open-work tools/deepcheck/test src/__tests__/open-work.test.ts tools/claude-hooks`, Prettier auf den geänderten Zeilen, Commit-Hooks; rot gesehen: die roten Fälle, Dependabot (Ausnahme entfernt), der Vorlagentest auf der Basisvorlage.
- `Gate change approved: #1271` im Text des Pull Requests (geändert sind `tools/` und `.claude/skills/`): Der Pull Request existiert noch nicht. Auch ob «Decided (product owner)» in #1271 diese Gate-Änderung abdeckt, habe ich nicht geprüft (nur den Anforderungstext des Aufrufers gelesen).
- Ob das `GITHUB_TOKEN` eines Fork-PRs bei `pull_request` `pulls/<n>` und `issues/<n>` lesen darf: setzt ein öffentliches Repository voraus, im Worktree nicht prüfbar.
