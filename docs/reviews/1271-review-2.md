# Review #1271, Runde 2, Schlussrunde (5b393921..ca7231a5)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Minor | tools/open-work/check-issues.mjs:80, 243 | Ein Fork mit `## Type` «bug, nfr:security», der ein bereites Issue mit dem Label `bug` schliesst, bekommt neben «names more than one category» auch ««Type» says nothing, but #7 is labelled bug». Weil `type` bei mehreren Kategorien `undefined` ist, behauptet die zweite Meldung, «Type» nenne nichts. Das stimmt nicht. Die Prüfung bleibt richtig rot, nur der Text ist falsch. |

Geschlossen: C-1, C-2, C-3

Keine Blocker/Major.

Geprüft: beide Dateien des Deltas. Zu C-1: Doppelte Nennungen werden zusammengefasst, und der Fork-Abgleich nimmt nur die eine Kategorie. Zu C-2: Der Zweig für Pull Requests kommt vor dem Zustand, also wird auch ein geschlossener PR als PR gemeldet. Zu C-3: Mit `issueStatus` antwortet die Stand-in-API für Issues mit 404, für Liste und PR nicht. Beim Lesen schlägt jeder neue Test ohne die Änderung fehl: ohne C-1 hat der Fall «bug, nfr:security» Exit 0, ohne C-2 ist der offene PR mit `bug` bereit. Der 404-Fall prüft bestehenden Code; ohne den `response.ok`-Guard käme «it is undefined». Ausserhalb von `tools/open-work` ist nichts geändert.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run tools/open-work/check-issues.test.ts` (57 grün, die neuen Fälle vor dem Fix rot gesehen), Prettier sauber, Commit-Hooks; lint, check und fitness laut Aufrufer unverändert.
- Offen aus Runde 1: `Gate change approved: #1271` im Text des Pull Requests (geändert sind `tools/` und `.claude/skills/`), und ob «Decided (product owner)» in #1271 diese Gate-Änderung abdeckt. Der Pull Request existiert noch nicht, das Issue habe ich nicht gelesen.
- Ob das `GITHUB_TOKEN` eines Fork-PRs `issues/<n>` lesen darf: im Worktree nicht prüfbar.
