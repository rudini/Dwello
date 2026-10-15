# Review: Workflow-Regeln aus `workflow-rules-review-issue-212.md` übernommen (Runde 2, Delta)

Worktree: `review-rules-212`, Stand 41bdfd3. Delta: `git diff 32c8bbc 41bdfd3`. Geändert sind `CLAUDE.md` (Workflow 1, Workflow 9, «Open work»), `backend/CLAUDE.md`, die Zusammenfassung, das Archiv und die eingecheckte Kopie von Bericht 1. Alle Änderungen im Delta sind gelesen.

## Status der Befunde aus Runde 1

| ID | Schwere | Status | Beleg |
|---|---|---|---|
| C-1 | Major | behoben | `CLAUDE.md:54`: «the task still finishes and its pull request is merged (step 9), but it says `Refs #n` …». `backend/CLAUDE.md:18` sagt jetzt «leaves the issue open» statt «does not finish the task». Damit ist klar: Der Task ist fertig, die PR wird gepusht und gemergt, und erst danach stoppt die Session mit dem fehlenden Lauf unter «Blocked on me». Der Widerspruch zu Workflow 9 und zu `backend/CLAUDE.md` ist weg. Step 7 kollidiert nicht mehr: Seine zwei Ausnahmen betreffen offene Reviewer-Befunde, der fehlende Lauf ist kein Befund. |
| C-2 | Minor | behoben, mit neuem Rest C-7 | Workflow 9 (`CLAUDE.md:72`) und «Open work» (`CLAUDE.md:89`) verweisen jetzt auf `Refs #n`. |
| C-3 | Minor | behoben | `CLAUDE.md:54`: «(with the scenario or `No scenario: <reason>` in its text as usual)». |
| C-4 | Minor | behoben, mit neuem Rest C-8 | `CLAUDE.md:54`: Die Session, der der Product Owner das Ergebnis gibt, schliesst das Issue oder arbeitet es neu auf. |
| C-5 | Nit | behoben | `docs/reviews/workflow-rules-findings-summary.md:10`: «A change to the allocability prompt …». |
| C-6 | Minor | behoben | Archiv Z. 6194 f.: «delta review below» entfernt; die Zeile für Runde 1 ist eingetragen. Dass die Session schon archiviert ist, nehme ich zurück: Workflow 8 verlangt das Archivieren vor dem letzten Commit, und Folgecommits nach einem Review sind in diesem Ablauf vorgesehen. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-7 | Nit | CLAUDE.md:89 | «The commit or PR says `Fixes #n` (`Refs #n` in the KI case of Workflow 1); the issue closes on merge.» Wörtlich gelesen gilt «the issue closes on merge» auch im KI-Fall. Workflow 1 sagt dort aber: «the issue stays open». Kurze Korrektur: «; with `Fixes #n` the issue closes on merge». |
| C-8 | Minor | CLAUDE.md:54 | «closes it when the score did not drop» reicht als Kriterium nicht. Bei einem Bug wie #212 kann der Score gleich bleiben, obwohl der Fall, der das Issue ausgelöst hat (Treppenhausreinigung mit `qwen2.5:3b`), weiter falsch beantwortet wird. Genau dieser Fall war der Anlass für 212 #1. Zudem lässt die Regel offen, womit «drop» verglichen wird. Die Session konnte den Vorher-Lauf mit dem Standardmodell nicht machen, also braucht es auch den Vorher-Wert vom Product Owner oder einen anderen Bezugswert. Vorschlag: «closes it when the score did not drop and the cases the issue names are answered right». Das Issue-«Done means» (`CLAUDE.md:89`) fängt einen Teil davon auf, deshalb nur Minor. |

## Nicht bestätigt

- Checks auf 41bdfd3: nicht erneut ausgeführt. Das Delta ändert nur Dokumente.
- `.claude/agents` und `.claude/skills` auf weitere Stellen mit `Fixes #n` durchsucht: nicht gemacht, wie in Runde 1.
- Der Product Owner liefert zum Ergebnis womöglich auch den Vorher-Wert. Ob das so vorgesehen ist, sagt die Regel nicht (siehe C-8).

Urteil: Mergen möglich. C-1 bis C-6 sind behoben, offen sind nur C-7 (Nit) und C-8 (Minor), kein Blocker oder Major.
