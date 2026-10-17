# Code-Review W8d (#86 Abrechnung per E-Mail senden), Runde 3 (Abschluss vor dem Push)

Gegenstand: Worktree `review-w8d-code3` bei a61e817, Delta `git diff c9ba3c0 a61e817` (7 Dateien). Alle gelesen: `tests/e2e/targets/statement-detail.ts`, `implementation_plan.md`, `docs/archive/implementation-plan-verlauf.md` (neue Session), `docs/reviews/w8d-review-2.md`, `docs/reviews/workflow-notes-issue-86.md`, `docs/design/personas/helga-w8d-2.md`, `docs/design/personas/dr-weber-w8d-2.md`. Zum Abgleich gelesen: `messages/de.json:80, 1102, 1108`, `src/routes/statements/[id]/SendFeedback.svelte:15`, `src/__tests__/statement-pages.dom.test.ts:830`, die Geschichte von `help_statements_4` und `statements_send_text_2` (`git log -S`, `git diff`).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-16 | Nit | docs/archive/implementation-plan-verlauf.md:1040 | «Dr. Weber … Minors in texts this change did not touch» stimmt nur zum Teil: P-4 (Hilfe: «Ab dem Tag des Versands läuft die Zahlungsfrist») betrifft `help_statements_4`, das dieser Branch neu geschrieben hat (die Formulierung der Frist als Zeitraum wurde übernommen). P-1 (Brief-Dialog ohne Satz zur Zahlungsfrist) betrifft zwar das unveränderte `statements_send_text_2`, der Widerspruch zum E-Mail-Dialog entsteht aber erst durch diesen Branch. Beides sind Minors/Nits der Persona und bleiben im Bericht; nur die Begründung im Archiv ist ungenau. |
| C-17 | Nit | docs/archive/implementation-plan-verlauf.md:1043 | Der Punkt «workflow-review, session archived, pull request `Fixes #86`» ist abgehakt, bevor der Pull Request existiert. Sobald der Push folgt, stimmt er. |
| C-18 | Nit | tests/e2e/targets/statement-detail.ts:56 | Die Zeile ist 130 Zeichen lang (printWidth 100); Prettier würde sie umbrechen. Die Zeile war schon vorher zu lang, und die Nachbarzeilen der Datei sind es auch; ein Umbruch nur dieser Zeile wäre aber «format only your own lines». |

ponytail-review, Delta: eine Codezeile (nur die Beschreibung des Ziels), sonst Doku. Lean already. Ship.

Keine Blocker, keine Majors.

## Bestätigt

- **C-14 (Runde 2) behoben.** Das Ziel `deliverByLetterButton` heisst jetzt «Selbst per Brief zustellen» und entspricht `statements_send_by_letter` in `messages/de.json:1108` und dem DOM-Test (`statement-pages.dom.test.ts:830`). Der Locator (`statement-send-by-letter`, `SendFeedback.svelte:15`) ist unverändert; das Verhalten der E2E-Schritte ändert sich nicht, nur die Beschreibung in Fehlermeldungen. Kein Test muss dafür rot gewesen sein.
- **Plan.** `implementation_plan.md` enthält keine `## Session` mehr, nur Titel und Einleitung.
- **Archiv.** Die Session «2026-10-17 W8d» steht am Ende von `docs/archive/implementation-plan-verlauf.md` (Reihenfolge wie die Sessions davor). Alle Checklistenpunkte sind `[x]`; ohne Kästchen sind nur die Zeilen «No daten-pruefer: …» und «Files: …», die schon im Plan keine Aufgaben waren. Die zwei im Plan offenen Punkte (Persona-Nachläufe; Abschlussrunde, workflow-review, Archiv, PR) sind als erledigte Punkte mit ihren Berichten nachgetragen, ausserdem der Merge von origin/main und die Workflow-Notizen. Kein Punkt `[ ]` in den Zeilen 1023–1043.
- **Persona-Berichte Runde 2.** Helga bestätigt P-1 und P-5 aus Runde 1 als behoben, keine neuen Befunde. Dr. Weber bestätigt seine Majors P-1 und P-2 aus Runde 1 als behoben; neu nur Minors/Nits (P-1, P-2 Minor; P-3 bis P-5 Nit). Die Zusammenfassung im Archiv entspricht dem bis auf C-16. Kein offener Blocker/Major aus Personas.
- **Review-Bericht Runde 2** ist unverändert als Datei abgelegt (keine Blocker/Majors; C-12, C-13, C-15 bleiben laut Archiv stehen, C-14 behoben).
- **Workflow-Notizen** `docs/reviews/workflow-notes-issue-86.md`: vier Zeilen im Format Rule / What happened / Proposed change; der Fix an `persona-stack.sh` ist dort als bereits erledigt beschrieben.
- **Nichts Fremdes im Delta:** keine App-Code-Änderung, keine Formatierung unberührter Zeilen.

## Nicht bestätigt

- **Prüfungen des Aufrufers:** `src/__tests__/open-work.test.ts` auf a61e817 bestanden; `bun run lint`, `bun run check`, `bunx vitest run` und die Backend-Suite auf c9ba3c0 bestanden: vom Aufrufer gemeldet. Nicht selbst wiederholt: Der Zugriff auf `node_modules` des Worktrees (Verweis auf `/home/user/Dwello/node_modules`) ist durch eine Regel gesperrt, und `bunx prettier` fand `prettier-plugin-svelte` nicht. Dass `open-work.test.ts` mit dem leeren Plan grün ist, habe ich nur durch Lesen des Plans gestützt (keine Session, keine offenen Kästchen).
- **E2E:** nicht gestartet (Vorgabe). Dass die umbenannte Zielbeschreibung keinen Schritt bricht, ist nur durch Lesen belegt (die Beschreibung wird nirgends verglichen; der Locator ist gleich).
- **Persona-Berichte:** Screenshots und Skripte in `scratchpad/persona-helga-2/` und `scratchpad/persona-weber-2/` nicht angesehen; die Aussagen der Berichte nur mit `messages/de.json` abgeglichen.
