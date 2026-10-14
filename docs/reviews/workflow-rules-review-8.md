# Code-Review workflow-rules, Runde 8: C-15 (Textfix in der 3. Runde)

Geprüft: Worktree `review-c15-code-reviewer`, Commit `2f8b7ba` (`git diff 2f8b7ba~1 2f8b7ba`): `CLAUDE.md` Workflow-Schritt 7 (Zeile 66) erhält einen Satz, `docs/design/offene-punkte.md` verliert die Zeile H-24. Beide geänderten Dateien sind gelesen.

Anforderung: Ein Blocker/Major der 3. Runde, dessen Behebung kein Verhalten ändert, braucht keinen Test; ein Delta-Review desselben Reviewers, das ihn bestätigt, gilt als Behebung und ist keine 4. Runde.

Neuer Satz (`CLAUDE.md:66`):

> A fix that changes no behavior (text, docs, rules) needs no test: a delta review by the same reviewer that confirms it counts as fixed and is not a 4th round.

Die Anforderung ist umgesetzt. Der Satz widerspricht aber wörtlich Schritt 6 (C-1), und für zwei Fälle bleibt offen, ob man anhält oder weitermacht (C-2).

## Befunde

| ID | Schweregrad | Datei:Zeile | Befund |
|----|-------------|-------------|--------|
| C-1 | Major | `CLAUDE.md:66` (vs. `CLAUDE.md:65`) | Das Beispiel «(text, …)» für einen Fix ohne Verhaltensänderung widerspricht Schritt 6. Dort gilt «a changed help or error text the user sees» als Verhaltensänderung, die zuerst einen roten Test braucht. |
| C-2 | Minor | `CLAUDE.md:66` | Die Reihenfolge der Regeln bleibt offen. Der Satz davor sagt bei jedem Textfix weiterhin «stop, … ask me». Offen bleibt auch, was gilt, wenn das Delta-Review den Fix nicht bestätigt oder einen neuen Blocker/Major meldet. Diese Lücke erlaubt endlose Delta-Reviews. |
| C-3 | Minor | `CLAUDE.md:66` | Mit «rules» lassen sich auch Lint-, Design-Guard-, Hook- oder Berechtigungsregeln lesen. Das sind prüfbare Verhaltensänderungen (z. B. `fallow-gate.test.ts`, `design-guard.test.ts`). |
| C-4 | Minor | `CLAUDE.md:66`, `CLAUDE.md:65` | Es ist nicht festgelegt, wo das bestätigende Delta-Review protokolliert wird. Schritt 6 verlangt eine Planzeile «per reviewer and round», der Satz davor «say so in its plan line». Das Delta-Review «is not a 4th round», bekommt also weder eine eigene Zeile noch einen Berichtspfad `-review-<n>.md`. |
| C-5 | Minor | `docs/archive/implementation-plan-verlauf.md:5652`, `implementation_plan.md` | Plannotizen: `implementation_plan.md` hat keine Session für diese Aufgabe. Die Zeile der Runde, die C-15 meldete, steht weiter auf «open … C-15 (Nit, needs a decision) → `offene-punkte.md` H-24». Diese H-24 gibt es jetzt nicht mehr. Schritt 6 verlangt, dass ein später behobener Befund seinen Status in dieser Zeile ändert. |
| C-6 | Nit | `.claude/agents/code-reviewer.md` (letzter Absatz) | Das Abschlusskriterium des Reviewers lautet «every requirement line is either confirmed by code and a test». Ein Delta-Review eines Textfixes kann so nie «bestätigen», es muss den Punkt unter «Nicht bestätigt» führen. Ein Halbsatz wie «or, for a fix that changes no behavior, by the changed text» schliesst das. |

## C-1 (Major): Widerspruch zu Schritt 6 bei Texten

Wo: `CLAUDE.md:66`, «A fix that changes no behavior (text, docs, rules) needs no test», gegenüber `CLAUDE.md:65` (Schritt 6), «A fix that changes behavior (a changed help or error text the user sees included) gets a failing test first.»

Warum falsch: Schritt 6 zählt einen sichtbaren Hilfe- oder Fehlertext ausdrücklich zur Verhaltensänderung. Schritt 7 nennt «text» als erstes Beispiel für das Gegenteil. Das klammernde «changes no behavior» löst den Widerspruch nicht auf, denn das Beispiel ist genau das, woran sich ein Leser hält. Die Guidance verlangt Anweisungen ohne Widersprüche. Hier entscheidet der Widerspruch darüber, ob ein Test Pflicht ist.

So zeigt sich der Fehler: Ein Persona- oder Code-Review meldet in Runde 3 einen Major, z. B. dass eine Fehlermeldung in `messages/de.json` nicht sagt, was zu tun ist. Nach Schritt 7 ist das ein «text»-Fix: ändern, Delta-Review, behoben, ohne Test. Damit fällt der rote Test aus Schritt 6 weg. Bei Personas fällt auch weg, was Schritt 6 verlangt: «A fixed persona finding is closed by a test that shows it». Dazu kommt ein Persona-Delta-Review, das Schritt 6 nur bei neuem Text vorsieht.

Fix: «A fix that changes no behavior (docs, agent instructions, comments; not a text the user sees, see step 6) needs no test: …»

## Nicht bestätigt

- Prüfläufe: vom Aufrufer gemeldet (lint, check, test:coverage mit einem Netzwerk-Timeout in `fallow-gate.test.ts`, der allein grün lief; Backend-Tests auf dem Eltern-Commit). Ich habe nichts davon wiederholt. Der Diff ändert nur Markdown, und kein Test liest die geänderten Sätze. `open-work.test.ts` prüft Marker, keine Prosa.
- Verweise auf H-24: `grep -rn "H-24"` im ganzen Worktree (ohne `node_modules`, `.git`) findet ausserhalb von `docs/archive/` nichts. In `docs/archive/implementation-plan-verlauf.md` stehen nur Zeile 5652 (siehe C-5) und 5655 (Dateiliste). Das ist Historie, keine offene Verweisstelle.
- Schritt 4 («Continue only when no Blocker/Major is open (limit: step 7)»): kein Widerspruch. Ein bestätigter Fix schliesst den Befund.
- Schritt 9 (`code-reviewer` vor jedem Push nur «when app code changed»): kein Widerspruch. Ein reiner Doku-Fix löst keine Runde aus.
- `.claude/agents/fach-reviewer.md` und `daten-pruefer.md`: Ich habe nur nach «round»/«delta» gesucht und keine Rundenregel gefunden. Die neue Regel gilt also nur über `CLAUDE.md`.
- Ob der Product Owner «text» bewusst auch für sichtbare UI-Texte gemeint hat: Den Entscheid kenne ich nur aus der Formulierung des Aufrufers. In `docs/reviews/workflow-rules-review-7.md:12` (C-15) steht als Beispiel «Text, Doku, Konfiguration, wie hier C-1». Dort ist ein Text in Anweisungen gemeint, kein UI-Text.
