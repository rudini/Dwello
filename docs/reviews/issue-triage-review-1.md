# Review issue-triage, Runde 1

Commit: `a1043b7` (`git diff a1043b7~1..a1043b7`), Worktree `review-triage-code-reviewer`.
Gelesen: `.claude/skills/issue-triage/SKILL.md` (ganz), `implementation_plan.md` (Diff), `CLAUDE.md` "Open work", `.github/ISSUE_TEMPLATE/task.md`, `decision.md`, `tools/open-work/check-issues.mjs`, `src/__tests__/open-work.test.ts` (Plan-Regel). Zusätzlich lesend per `gh api` die offenen Issues und Labels von `rudini/Dwello` geprüft.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `.claude/skills/issue-triage/SKILL.md:35` | Zusatzregel «Decision-Vorlage (Abschnitt «Options») ohne `entscheiden` bekommt `entscheiden»` geht über Entscheid (2) hinaus und kann eine bewusste Label-Entfernung des Owners rückgängig machen. |
| C-2 | Minor | `.claude/skills/issue-triage/SKILL.md:25` | `issue_write` ist ohne `method: "update"` und ohne Kontrolle nach dem Schreiben angegeben: Haiku kann `create` wählen (neues Issue) oder ein vorhandenes Label in der vollständigen Liste vergessen (wird dann still entfernt). Vorschlag: Aufruf genau benennen (`method: "update"`, `issue_number`, nur `labels`) und danach das Issue neu lesen und prüfen, dass alle alten Labels noch da sind. |
| C-3 | Minor | `.claude/skills/issue-triage/SKILL.md:34` | Die Abgrenzung fachlich/produkt/bug wird `CLAUDE.md` "Open work" zugeschrieben («as `CLAUDE.md`, "Open work" separates them»), dort steht sie aber nicht (nur die Liste der Labels). Das widerspricht Entscheid (7) (verweisen statt kopieren) und ist eine neue, nirgends entschiedene Definition; ein kleines Modell sucht die Quelle vergeblich. Entweder als eigene Regel des Skills kennzeichnen oder streichen. |
| C-4 | Minor | `.claude/skills/issue-triage/SKILL.md:8`, `:39` | Widerspruch: Z. 8 «when unsure, say so in the comment instead of acting», Z. 39 «When in doubt, leave it out». Bei Duplikaten/verwandten Issues kann Haiku daraus unsichere Hinweise in Kommentare schreiben (Spam). Z. 8 auf Labels einschränken oder Z. 39 als Vorrang benennen. |
| C-5 | Minor | `.claude/skills/issue-triage/SKILL.md:31` | «Keep the titles and labels of all open issues for step 3»: der Vergleich steht in Schritt 4. |
| C-6 | Minor | `implementation_plan.md:9-14` | Das Label `triaged` existiert im Repository nicht (`gh api repos/rudini/Dwello/labels`: betrieb, bug, documentation, duplicate, enhancement, entscheiden, fachlich, …); der Plan hat keinen Punkt, es vor dem ersten Lauf anzulegen (mit Beschreibung). Ob `issue_write` ein fehlendes Label selbst anlegt oder scheitert, ist nicht bestätigt. |
| C-7 | Nit | `.claude/skills/issue-triage/SKILL.md:34` | «`bug` for behaviour that contradicts what is already decided or built»: «contradicts what is built» ist unklar (gebautes Verhalten widerspricht sich nicht selbst); «decided or documented» meint vermutlich das Gemeinte. |
| C-8 | Nit | `.claude/skills/issue-triage/SKILL.md:35` | «a section «Proposed (confirm before starting)»»: CI (`check-issues.mjs`) prüft eine Überschrift (`^#+ *Proposed \(confirm before starting\)`); «a heading `## Proposed (confirm before starting)`» wäre für Haiku eindeutiger als Guillemets. |

## C-1 (Major): Zusatzregel «Options» passt nicht zu Entscheid (2)

**Warum falsch:** Entscheid (2) nennt genau einen Fall für `entscheiden`: ein Abschnitt «Proposed (confirm before starting)» ohne das Label (deckt sich mit `CLAUDE.md` "Open work" und `check-issues.mjs`). Die Decision-Vorlage setzt `entscheiden` bereits per Front-Matter (`.github/ISSUE_TEMPLATE/decision.md:4`, `labels: [entscheiden]`). Ein offenes Issue mit «Options» und ohne `entscheiden` entsteht damit praktisch nur, wenn der Owner das Label bewusst entfernt hat (Entscheid festgehalten, Umsetzungs-Issue noch offen) oder wenn ein Task-Issue eine eigene Überschrift «Options» hat. In beiden Fällen setzt der unbeaufsichtigte Lauf ein Label, das der Owner nicht will, und widerspricht dem Geist von «never change existing labels» (er macht eine Entfernung rückgängig). Keine Regel in `CLAUDE.md` oder CI verlangt `entscheiden` für «Options».

**Wie es fehlschlägt:** Owner entfernt auf einem Decision-Issue nach dem Entscheid `entscheiden` und lässt es offen, bis das Umsetzungs-Issue steht; ein neu erstelltes Task-Issue mit Überschrift `## Options` ohne Proposed-Abschnitt. Schritt 3 (Z. 35) fügt in beiden Fällen `entscheiden` hinzu. Heute betrifft es kein offenes Issue (alle Issues mit «Options» oder «Proposed» tragen `entscheiden`, per `gh api` geprüft), die Regel wirkt also nur auf künftige Fälle, und dort genau auf die falschen.

**Fix:** «or follows the Decision template (a section «Options»)» streichen, oder den Owner ausdrücklich entscheiden lassen und dann im Plan festhalten.

## Nicht bestätigt

- Tests, Lint, Check, deepcheck: nicht neu ausgeführt (kein Code geändert). Commit-Hooks (fallow, deepcheck, Commit-Betreff) «vom Aufrufer gemeldet».
- Ob das GitHub-MCP-Tool `list_issues` Pull Requests mitliefert (REST tut es): falls ja, fehlt in Schritt 1 «skip pull requests». Nicht geprüft, das MCP-Tool steht mir nicht zur Verfügung.
- Ob `issue_write` (update) die Label-Liste ersetzt, wie Z. 25 sagt, und ob es ein nicht existierendes Label (`triaged`) anlegt: nicht geprüft (siehe C-6).
- Verhalten eines Haiku-Laufs auf den realen 92 Issues (Kontextgrösse, Qualität der Duplikat-Erkennung): nicht ausführbar im Review.
- Eintrag «Independent review … Opus 5.5 blog» im Plan: Quelle nicht geprüft.
- Bestätigt am Text: (1) nie schliessen (Z. 25), (3) `triaged` als einzige Ausnahme und zuletzt (Z. 22, 42 ff.), (4) 20, älteste zuerst (Z. 16, 31), (5) Duplikat nur auf dem neueren Issue, bis 3 verwandte, kein Duplikat-Label (Z. 37-38), (6) Englisch, Präfix `Triage:`, kein Kommentar ohne Fund (Z. 40), Wiederholung nach Abbruch ohne Doppelkommentar (Z. 32), Prompt-Injection-Schutz (Z. 27). Plan: eine Session (open-work.test.ts), Session 34 archiviert, «No scenario» begründet.
