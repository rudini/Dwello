# Slice-Review w3b, Runde 2 (Schlussrunde vor dem Push): #97, #101, nur Delta

Geprüft: Worktree `review-w3b-code2` (detached auf 44db0fd), `git diff d65b754 44db0fd` (Commits 2f08300, 44db0fd). Alle 7 geänderten Dateien gelesen: `docs/api-specification.md`, `docs/design/offene-punkte.md`, `docs/design/personas/weber-w3-abrechnungsnummer.md`, `docs/reviews/w3b-review-1.md`, `docs/reviews/workflow-notes-issue-97-101.md`, `implementation_plan.md`, `src/__tests__/statement-endpoints.test.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-8 | Nit | `src/lib/server/statement.ts:109` | C-3 ist nur zur Hälfte behoben. Der Testname nennt jetzt den Unterstrich, der Doc-Kommentar von `pdfFileName` sagt aber weiter «only ASCII letters, digits, dot and dash». Der Ersatzname `'statement.pdf'` bleibt ungetestet; das hält der Aufrufer selbst nicht als behoben fest, er ist aber Teil von C-3. |
| C-9 | Nit | `implementation_plan.md:16` | In der Zeile «Files:» fehlen die Dateien des Deltas (`docs/api-specification.md`, `docs/design/offene-punkte.md`, Persona-Bericht, Review-Berichte, Workflow-Notizen). Workflow 8 verlangt, die geänderten Dateien festzuhalten. |

Ponytail-Review: Das Delta besteht aus Doku, Berichten und einer Umbenennung eines Testnamens; nichts davon lässt sich kürzen. `Lean already. Ship.`

Keine Blocker, keine Majors.

## Bestätigt

- **C-1:** `docs/api-specification.md:223` nennt jetzt `<number>.pdf`, wie es das Backend liefert (`backend/src/routes/statements.ts:324`: `filename="${result.statementNumber}.pdf"`). Ein Verweis auf das Issue in Klammern ist in dieser Datei üblich (z. B. Z. 104, 117).
- **C-3 (Testname):** Der Name nennt jetzt den Unterstrich, passend zu `[^\w.-]`. Ich habe `bunx vitest run src/__tests__/statement-endpoints.test.ts src/__tests__/open-work.test.ts` selbst laufen lassen: 2 Dateien, 21 Tests, alle grün.
- **C-7:** Vor `## Session` steht nur noch eine Leerzeile (`cat -A` geprüft).
- **O-34** (`offene-punkte.md`): Der Befund ist nicht funktional (Zuverlässigkeit der Tests), steht also richtig in dieser Datei und nicht in einem Issue. Die neue ID folgt auf O-33. Was die Zeile behauptet, stimmt mit dem Code überein: Das Szenario «Abrechnungen bei Mieterwechsel mit Leerstand erstellen» (`statement-generate.feature:36`) nennt kein Heizprofil. Die Schritte `statement-generate.steps.ts:67` und `:81` rufen `generateStatements` ohne Optionen auf. Der vorgeschlagene Schritt «… mit dem Heizprofil {string} erstellt» existiert (`:76`), und das #97-Szenario verwendet ihn (`feature:84`).
- **Persona-Bericht Dr. Weber:** Er liegt am üblichen Ort (`docs/design/personas/`) und hat keinen Blocker und keinen Major. P-1 (der Löschdialog sagt nicht, dass die Nummer nicht neu vergeben wird) und P-2 (die Lücke in der Nummernfolge wird nicht erklärt) sind Minor. Sie decken sich mit der Fachreview V-2 und verlangen nach «Done means» weder ein Issue noch eine Zeile. Der Bericht bestätigt #101 im echten Ablauf: Der Download aus der Liste und von der Detailseite heisst `NK-…-0001.pdf`, beide Dateien sind identisch. Er bestätigt auch #97: Wer eine gelöschte Abrechnung neu erstellt, erhält 0005 statt 0003, die Beträge bleiben gleich. Das stützt den Verzicht auf `daten-pruefer`, weil sich kein Betrag geändert hat.
- **Workflow-Notizen:** Die Datei folgt dem Namensmuster der bestehenden Notizen (`docs/reviews/workflow-notes-issue-*.md`). Der Plan-Eintrag «Workflow note: …» ist abgehakt und verweist auf die Datei.
- **Review-Bericht Runde 1:** Er liegt jetzt unverändert unter `docs/reviews/`, wie die anderen Berichte.
- **Nichts Fremdes im Delta:** Jede Änderung gehört zu den Befunden der Runde 1, zum Feature-Review oder zum Plan.

## Nicht bestätigt

- `bun run lint` und `bun run check` auf 2f08300: vom Aufrufer gemeldet. Das Delta von 2f08300 zu 44db0fd enthält nur Markdown; das habe ich mit `git diff --stat` geprüft.
- Vollständige Läufe auf d65b754 (vitest 2651, Backend 704): vom Aufrufer gemeldet.
- Den Persona-Lauf selbst habe ich nicht nachgeprüft, nur den Bericht gelesen. Die Screenshots im Scratchpad habe ich nicht angesehen.
- Ob O-34 wirklich flaky ist (Fremdschlüssel-Fehler bei parallelen Läufen): Ich habe nur gelesen, dass das Szenario kein Heizprofil nennt, und keine E2E gestartet.
