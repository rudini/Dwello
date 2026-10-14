# Review B-15 Instruktionen, Slice 2 (Runde 1)

Geprüft: `git diff a1b1d10..aa2758a` (Commit `aa2758a`, «docs(config): B-15 instruction improvements») im Worktree `review-slice2`. Anforderung: Abschnitt 2 von `docs/reviews/b15-instruktionen-pruefung.md` (Branch `origin/claude/workflow-improvements`), Punkte 2, 4, 5, 6, 7, 8, 10 (zweite Hälfte), 11, 12, 13, 14, 15 (Regelteil) und 16, mit den Entscheiden des Benutzers zu 4, 5 und 16. Gelesen habe ich alle 8 geänderten Dateien sowie `backend/demo/demo-data.sql`, `backend/src/db/demo-data.ts`, `docs/design/tools/persona-stack.sh`, `docs/test-pyramid.md`, `tests/contracts/README.md`, `.claude/skills/tdd/SKILL.md`, `.claude/hooks/session-start.sh`, `docs/design/arbeitsregeln.md` und `src/__tests__/open-work.test.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `CLAUDE.md:54`, `:58`; `.claude/agents/fach-reviewer.md:12` | Laut Entscheid bekommt jeder Reviewer immer einen eigenen Worktree. Die Regel verlangt aber einen Worktree «of the reviewed commit». Für `fach-reviewer` in Schritt 1 (Szenario vor der Umsetzung) gibt es keinen solchen Commit, und gerade dort arbeitet die Hauptsession nach Punkt 5 weiter. |
| C-2 | Major | `docs/test-pyramid.md:33`, `:41` (nicht im Diff) | Die neue Vertragsregel (`CLAUDE.md`, Gotchas: «also when the response itself is unchanged (add a contract when there is none)») widerspricht `test-pyramid.md`, wo es zweimal heisst «where a contract exists» bzw. «where one exists». Punkt 8 ist damit nur zur Hälfte umgesetzt. |
| C-3 | Minor | `CLAUDE.md:54` | Laut Punkt 5 schreibt man «only lower-layer tests and watch them fail», solange `fach-reviewer` läuft. Der Skill `tdd` (`.claude/skills/tdd/SKILL.md:18-29`) verbietet aber ausdrücklich, zuerst alle Tests zu schreiben («Horizontal Slices»). Es fehlt eine Angabe, wie viele Tests es sein dürfen (z.B. «at most the next red test»). Der Benutzer hat dies so entschieden; es fehlt nur die Abgrenzung zum Skill. |
| C-4 | Minor | `CLAUDE.md:93` | In «Branches» steht weiterhin «(review subagents only read your tree)». Seit Schritt 4 lesen Reviewer aber ihren eigenen Worktree. |
| C-5 | Minor | `CLAUDE.md:58`, `:65` | Der Reviewer liest nur im Worktree, schreibt seinen Bericht aber an den Pfad `docs/reviews/…` aus Schritt 6. Offen bleibt, in welchem Baum das ist. Liegt der Bericht im Worktree, scheitert `git worktree remove` an der unversionierten Datei, oder der Bericht geht verloren. Ein Satz wie «name an absolute report path in your tree or the scratchpad» fehlt. |
| C-6 | Minor | `CLAUDE.md:65` | Format der Rundenzeile «open …, fixed …, rejected …»: Unklar ist, ob ein in Runde 2 behobener Befund aus Runde 1 die Zeile von Runde 1 ändert oder in der Zeile von Runde 2 steht. |
| C-7 | Minor | `docs/design/personas/README.md:27-48` | Personas lesen diese README ganz (`persona.md:7`). Damit sehen sie die neue Tabelle mit IDs und Testzuständen («invoices missing on purpose»). Das widerspricht «Never read … other docs» und kann ihre Befunde beeinflussen. Abhilfe: Persona überspringt den Abschnitt, oder die Tabelle kommt in eine Datei nur für den Aufrufer. |
| C-8 | Minor | `CLAUDE.md:93` | «start the branch anew from `origin/main`»: Wird der Branch unter demselben Namen neu angelegt, braucht der spätere Push ein Force-Push, und vor einem solchen muss man fragen (Absatz «Keep going»). Gemeint ist vermutlich ein neuer Branchname oder eine Rückfrage. |
| C-9 | Nit | `CLAUDE.md:56` | Die Plannotiz `Skills: tdd, ponytail-review` zeigt nicht, dass der Skill `ponytail` geladen wurde. Genau dieses Laden war in Punkt 6 strittig. |
| C-10 | Nit | `CLAUDE.md:58` | Der Pfad `<scratchpad>/review-<slice>` ist für zwei gleichzeitige Reviewer auf demselben Slice nicht eindeutig, z.B. `fach-reviewer` und `daten-pruefer` in Schritt 5, die je einen eigenen Worktree brauchen. Ein Teil wie `review-<slice>-<reviewer>` fehlt. |

## Blocker/Major

### C-1: Kein Worktree für `fach-reviewer` vor der Umsetzung

Schritt 4 schreibt vor: «Give every reviewer subagent (`code-reviewer`, `fach-reviewer`, `daten-pruefer`) its own worktree of the reviewed commit». Die drei Agenten lesen «only in the worktree the caller names (the reviewed commit)». In Schritt 1 prüft `fach-reviewer` aber ein `@wip`-Szenario vor der Umsetzung. Der Workflow sieht dafür keinen Commit vor (committet wird erst nach einem Slice, Schritt 4). Und genau in dieser Zeit schreibt die Hauptsession laut dem neuen Satz in Schritt 1 Tests im eigenen Baum.

So zeigt sich das Problem: Eine neue Session folgt Schritt 1 und will `fach-reviewer` starten. Nach Schritt 4 braucht sie einen Worktree eines Commits, den es nicht gibt. `fach-reviewer.md` verbietet zugleich, im Baum des Aufrufers zu lesen. Die Session muss also entweder ohne Regel einen `@wip`-Commit machen oder den eigenen Baum nennen, was gegen den Entscheid «always» verstösst. Abhilfe: In Schritt 1 ein Satz wie «commit the `@wip` scenario and give `fach-reviewer` a worktree of that commit (Workflow 4)».

### C-2: `test-pyramid.md` erlaubt weiterhin erfundene Antworten

Neu sagt `CLAUDE.md` (Gotchas, API contracts), dass jeder Frontend-Test, der eine Backend-Antwort liest, sie aus `tests/contracts` nimmt, und dass ein fehlender Vertrag angelegt wird. `docs/test-pyramid.md` ist das Dokument, das `CLAUDE.md` für Testdoubles nennt («Test doubles in tests follow `docs/test-pyramid.md`»). Dort steht weiterhin:

- Zeile 33: «fake backend via `fetch` stub / `fakeBff` (from the API contracts in `tests/contracts` where one exists)»
- Zeile 41: «Fake backend responses in frontend tests come from `tests/contracts/*.json` where a contract exists»

Genau dieser Fall trat in B-15 auf (Tabelle Zeile 14): Ein Ladetest für `GET /contracts/:id` erfand die Antwort, weil kein Vertrag existierte. Eine Session, die Testdoubles nach `test-pyramid.md` baut, darf das weiterhin. Abhilfe: Beide Stellen auf «from `tests/contracts`; add a contract when there is none» ändern. Ein Satz in `tests/contracts/README.md` wäre konsistent, ist aber nicht nötig.

## Bestätigt

- **Punkt 2:** Ich habe die Tabelle Zeile für Zeile mit `demo-data.sql` (Gebäude, Wohnungen, Mieter, Verträge, `terminated`) und `demo-data.ts` (`runs`) abgeglichen.
  - Alle 13 Zeilen stimmen: Namen, Wohnungen, Vertrags-IDs, Beginn- und Enddaten, gekündigt (`b…099` und `b0000002…0002`), Sprachen fr/it, die leeren Wohnungen 2.02, 3.02, B1 und OG2 sowie die Abrechnungen 2025 (Müller `sent`; Musterhaus- und Seepark-Rest `draft`; Alpenblick ohne).
  - Die Aussagen «paid statement 2024 for every contract that ran in 2024» und «no fixed-term, no future contract» stimmen ebenfalls: Beide Verträge mit Enddatum sind `terminated`, Nina Brunner beginnt am 01.07.2025.
  - Die Regel für eigene Gebäude steht in `CLAUDE.md` Schritt 5 und in `persona.md` (bestehend).
- **Punkt 4:** Schritt 4 sowie die Agenten `code-reviewer`, `fach-reviewer` und `daten-pruefer` sind angepasst. Ausnahmen: C-1, C-4, C-5. In Schritt 5 darf man weiterarbeiten, weil `persona-stack.sh` von `/tmp/persona-app` aus ausliefert. Das Backend läuft zwar aus dem Baum des Aufrufers, liest zur Laufzeit aber keine Dateien nach (geprüft per grep auf `Bun.file`/`readFile` in `backend/src`).
- **Punkt 5:** Umgesetzt, auch «no texts in `messages/*.json`». Ausnahme: C-3.
- **Punkt 6:** «Process», Schritt 2 (bestehend) und Schritt 3 verlangen, die Skills zu laden.
- **Punkt 7:** Die Klammer in Schritt 6 ist ergänzt.
- **Punkt 8:** In `CLAUDE.md` umgesetzt. Die optionale Lint-Regel ist als H-22 in `offene-punkte.md` erfasst. Ausnahme: C-2.
- **Punkt 10 (zweite Hälfte):** «search the open issues … (`search_issues`)» steht in «Open work». Issues legt nur der Aufrufer an (`fach-reviewer.md:23`), die Agenten brauchen also keine Änderung.
- **Punkt 11:** Schritt 8 hat «before the final commit», `code-reviewer.md:16` die Prüfung «holds only the current session». Das passt zu `open-work.test.ts:43`.
- **Punkt 12:** Der bestehende Satz im Absatz «Keep going» deckt den Vorschlag ab. Keine Änderung ist richtig.
- **Punkt 13:** In den Coding guidelines umgesetzt.
- **Punkt 14:** In Schritt 6 umgesetzt. Ausnahme: C-6.
- **Punkt 15 (Regelteil):** «Branches» enthält den Fetch beim Start, den Neubeginn bzw. Merge und `code-reviewer` auf dem Merge-Commit. Der Wortlaut passt zum Hinweis in `session-start.sh:12-13`. Ausnahme: C-8.
- **Punkt 16:** Umgesetzt in `CLAUDE.md` Schritt 5 und `persona.md:10`. `.claude/settings.json` ist nicht geändert, wie entschieden.
- **Umfang:** Kein App-Code ist geändert. Nichts im Diff ist fremd zur Anforderung: H-22 gehört zu Punkt 8, der Plan zur Session.
- **Plannotizen:** «Slice 2 notes» sind vollständig. «No code changed: no `Test red`, no `ponytail-review`» ist für einen reinen Doku-Slice zulässig.
- **Widersprüche:** Keine zu `backend/CLAUDE.md`, `tests/e2e/CLAUDE.md` oder `docs/design/arbeitsregeln.md`. Die betroffenen Regeln dort betreffen den archivierten Redesign-Ablauf oder sind unverändert gültig. Gefunden habe ich nur die Widersprüche in C-2, C-3 und C-4.

## Nicht bestätigt

- `bun run lint` clean: vom Aufrufer gemeldet, nicht neu ausgeführt (der Diff enthält nur Markdown).
- `bunx vitest run src/__tests__/open-work.test.ts tools/`, 207 pass: vom Aufrufer gemeldet. Ich habe den Lauf im Worktree zusammen mit `src/__tests__/e2e-screenplay-lint.test.ts` wiederholt: 24 Dateien, 261 Tests grün.
- Ob die Demo-Daten beim Persona-Lauf genau so geladen werden: `persona-stack.sh` ruft `backend/scripts/demo-data.ts` auf. Ich habe nicht nachgelesen, ob das Skript nur `loadDemoData()` aufruft oder weitere Daten anlegt, und den Stack wie vorgegeben nicht gestartet.
- Ob `git worktree add --detach` mit verlinktem `node_modules` für Backend-Tests (`bun run test` in `backend/`) im Worktree funktioniert: nicht ausgeführt. Ich habe es nur für Vitest im Frontend gesehen.
