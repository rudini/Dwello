# Abschliessendes Code-Review #83/#84 (vor dem Push), Runde 1

Worktree: `review-closing` (detached, 62d03ba). Bereich: `git diff aa7ff20 4186d29` (Fixes C-1, C-2 aus `docs/reviews/w4d-s2-review-1.md`), die Doku-Commits 3064ca4 und 9881a24 sowie der Merge 62d03ba von `origin/main`.
Gelesen: alle Dateien im Delta (`statement-pdf-render.test.ts`, `messages/en.json`, `implementation_plan.md`, `docs/reviews/w4d-s2-review-1.md`), die Doku-Commits (`implementation-plan-verlauf.md`, `offene-punkte.md` U-37, `dr-weber-w4d.md`, `workflow-notes-issue-83-84.md`), `FLOORS`/`formatFloor` in `pdf.service.ts`, `helpers/pdf-text.ts` (`flowing`), die kombinierte Merge-Diff und die Änderungen von main an `pdf.service.ts`, `reminder-pdf.ts`, `reminder.service.ts`. Dazu `.claude/skills/ponytail-review/SKILL.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Nit | docs/design/personas/dr-weber-w4d.md:11 | P-4 sagt «Der Brief hat keinen QR-Teil». Seit dem Merge von main (#108, `addPaymentPart` in `reminder-pdf.ts`) hat der Mahnbrief einen QR-Teil, sofern die Abrechnung nicht bezahlt ist. Der Bericht beschreibt den Stand vor dem Merge. Das ist historisch korrekt, aber P-4 ist für Briefe mit QR-Teil überholt. Wer P-4 als offenen Punkt übernimmt, sollte das wissen. |

Keine Blocker und keine Majors.

## Geprüft und bestätigt

- **C-1 aus Slice 2 ist behoben.** Der Test «Stockwerk im französischen PDF» rendert ein fr-PDF mit Stockwerk -1 und -2 und erwartet `A2, 1er sous-sol` bzw. `A2, 2e sous-sol` in `pdf.flowing`. Ohne den Zweig `n === 1` liefert `FLOORS.fr` für -1 «1e sous-sol` (Basis afa4da9:456: `` (n) => `${n}e sous-sol` ``). Der Fall -1 wäre also rot. Der Fall -2 sichert den anderen Zweig und ist auch ohne die Änderung grün. Das ist zulässig. Der Präfix «A2, » passt zu `apartment` in pdf.service.ts:517 (`${number}, ${formatFloor(...)}`). Mit `{ ...refund, apartment: { ...refund.apartment, floor } }` entsteht kein Mutationsrisiko für andere Tests.
- **C-2 aus Slice 2 ist behoben.** `statements_time_share_profile` en lautet jetzt «{percent} under the heating profile». Das passt zum PDF: `sharesNoteHeating` sagt «the share under the heating profile» (pdf.service.ts:328), ebenso `heatingNote`/`heatingPeriodMonths` (:297, :300). Die Meldung wird nur in `CostTable.svelte:41` verwendet. Kein Test pinnt den alten Wortlaut («by heating profile»: kein Treffer in `src`, `tests`, `backend/src`). Ein fehlender Test ist durch die Ausnahme in slice-review, Triage, für geprüften Übersetzungswortlaut gedeckt. de/fr/it sind unverändert und brauchen keine Änderung, da es eine reine Angleichung von en ist.
- **Der Merge hat die Textänderungen dieses Branches behalten.** Die Plus- und Minuszeilen von `git diff <merge-base afa4da9> 9881a24` stimmen für `backend/src/services/pdf.service.ts`, `backend/src/services/reminder-letter.ts` und `messages/` sortiert genau mit `git diff 62d03ba^2 62d03ba` überein.
- **Der Merge hat keine Änderung von main verloren.** Ebenso stimmt `git diff afa4da9 62d03ba^2` für dieselben Pfade genau mit `git diff 9881a24 62d03ba` überein.
- **Kombinierte Diff:** `git show --cc 62d03ba` zeigt bei App-Dateien nur `messages/fr.json` und `messages/it.json`. Dort liegen die Änderungen beider Seiten nebeneinander: `statements_finding_new` behält die Fedlex-Wörter des Branches («terme de congé», «délai de congé», «scadenza di disdetta», «termine di preavviso»). `statements_finding_stock_negative` sowie die neuen Schlüssel `statements_finding_consumption_more/less` von main sind erhalten. Es gibt keine handgemachte Auflösung.
- **Zusammenspiel mit main:** main fügt dem Mahnbrief einen QR-Teil hinzu (`addPaymentPart`, Beschriftung über `translations[language]`). Die Texte des Branches in `reminder-letter.ts` (z. B. «Référence … (à indiquer lors du paiement)») widersprechen dem nicht. Keine Zeile in `reminder-letter.ts` sagt, dass ein Einzahlungsschein fehlt.
- **Die Doku-Commits ändern nur Doku.** Sie archivieren die Session. Offen bleibt nur «PR, CI, merge», und `implementation_plan.md` enthält keine Session mehr. In `offene-punkte.md` ist U-37 korrekt auf «fixed by #84 except the tenancy line (#325)» gekürzt. Workflow-Notizen und Persona-Bericht kommen dazu. In den Persona-Tabellen stehen nur Minor/Nit.
- **ponytail-review:** Ein `it.each` mit zwei Fällen und eine geänderte Zeile. Lean already. Ship.
- **Nichts Fremdes im Delta:** keine Formatierung und kein Refactoring von unberührtem Code.
- **No scenario:** Es gibt keinen neuen Bildschirm und keinen neuen Zustand. Der Ordinalzweig ist jetzt auf der untersten Schicht getestet, die Textangleichung fällt unter die Triage-Ausnahme.

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht selbst ausgeführt:** `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2788 Tests) und die Backend-Tests `pdf-text`, `pdf-translations`, `reminder-letter`, `statement-pdf-data`, `statement-pdf-render`, `statement-pdf.pg`, `swiss-today.pg` und `reminders.pg` (154 Tests). Backend-Tests waren laut Auftrag untersagt. Dass der neue Test auf 62d03ba grün ist, schliesse ich aus dem Code (`formatFloor`, `flowing`) und aus der Meldung des Aufrufers.
- **Rot vor der Änderung:** Den Lauf ohne den Zweig `n === 1` hat der Aufrufer gemeldet. Ich habe ihn nur durch Lesen nachvollzogen (siehe oben).
- **E2E nach dem Merge:** Weder Aufrufer noch ich haben E2E auf 62d03ba gemeldet bzw. ausgeführt. main hat die Positionen im Mahnbrief verschoben (`reminder-pdf.ts`: 250/290 → 215/245). `statement-reminder.feature` lief laut Plan vor dem Merge (148 passed). Ob die Szenarien des Branches zusammen mit den neuen Szenarien von main grün sind, ist nicht bestätigt. CI führt sie aus.
- **Der Mahnbrief mit QR-Teil in fr/it/en** wurde nach dem Merge von keiner Persona gelesen. Das war nicht Teil dieses Deltas.
- **Der Zweig `1er étage`** (positives Stockwerk 1) ist weiterhin ohne Test. Er bestand schon vor dem Branch (afa4da9:456) und wurde deshalb nicht als Befund aufgenommen.
