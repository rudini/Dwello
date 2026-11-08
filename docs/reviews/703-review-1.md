# Review 703, Runde 1 (Abschlussrunde), Commit daf6d792

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/CLAUDE.md:85 | Wörtlich gelesen schickt «a new scenario goes into the file of the page where it starts» ein neues Szenario ohne Anmeldung, das auf der Übersicht oder bei den überfälligen Abrechnungen beginnt, nach `dashboard.feature` bzw. `statements.feature`. `.claude/skills/bdd-acceptance/SKILL.md:18` verlangt dafür `authentication.feature`, und dort beginnen heute schon solche Szenarien auf fremden Seiten (`authentication.feature:19-40`). Dasselbe gilt für bereichsübergreifende Dateien (`accessibility.feature`, `sprachen-bildschirme.feature`, die `CLAUDE.md` «Process» vorschreibt) und für Themen-Dateien wie `statement-rounding.feature` oder `categories-ki.feature`. Die Regel nennt nicht, dass eine Bereichsdatei vor der Datei der Startseite Vorrang hat. Der Wortlaut entspricht der Entscheidung in #703. Ein Zusatz wie «a scenario of an area file (e.g. `authentication.feature`) stays there» ändert einen entschiedenen Text und braucht deshalb die Zustimmung des Product Owners. |

Geprüft: Die Regel gibt «Decided (product owner)» von #703 (2026-11-04) vollständig und ohne Abweichung wieder: Ort `tests/e2e/CLAUDE.md`, eine Datei pro Seite oder Bereich, ein neues Szenario in der Datei seiner Startseite, keine Datei wird umbenannt oder aufgeteilt. Beide Beispiele gibt es (`tests/e2e/features/building-detail.feature`, `tests/e2e/features/statements.feature`). Die Regel steht unter «Rules», der Diff enthält nichts, was nicht zur Anforderung gehört, und «No scenario» passt, weil nur Dokumentation geändert ist. Ausserhalb des Bereichs liegt `docs/archive/sessions/703.md`: Die Session-Datei nennt als Ort des Berichts `docs/reviews/703-review-1.md`, diesen Pfad gibt es im Repo (`docs/reviews/`).

## Nicht bestätigt

- open-work, check-issues, commit-msg-gate, deepcheck readme, feature-wording, e2e-screenplay-lint-Tests, Prettier auf der neu hinzugefügten Archivdatei: vom Aufrufer gemeldet.
- `Fixes #703` und `No scenario` im Text des Pull Requests: Den Pull Request gibt es noch nicht, die Angaben stehen nur in `docs/archive/sessions/703.md`.
