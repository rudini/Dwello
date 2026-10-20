# Code-Review #461 (mit #501), Runde 3 (Schlussrunde)

Delta: `git diff e2346626 6ba20ebc -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` (Commits 98b8b9ac, 6ba20ebc). Worktree: `review-461-code3` (detached auf 6ba20ebc).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta. |

Keine Blocker oder Majors.

## Status der offenen IDs aus der Vorrunde

- **461-review-2 C-6 (Minor): behoben.** In `messages/en.json` stehen `backend_formula_unknown_variable` und `backend_formula_not_computable` jetzt mit einfachem Escape (`\\{area\\}`), wie in de/fr/it. Der neue Test `Formelvariablen in den Meldungen` (`src/__tests__/i18n.test.ts:13-19`) rendert beide Meldungen in allen vier Sprachen über `m.*({…}, { locale })`. Er prüft auf `{persons}` und `{area}` und darauf, dass kein Backslash vorkommt. Gegen den alten englischen Text schlägt er fehl, denn dort ergibt der doppelte Escape einen Backslash und einen Platzhalter. Der Fehler kam erst mit eb57b671 in diesen Branch und ist nicht auf `main`. Darum braucht es kein Szenario für einen Bugfix.
- **461-fachreview-2 (zur Einordnung, nicht meine IDs):** M-1 (`possa`), V-1 (fr/it «début du contrat» / «inizio del contratto»), V-2 (it «la fine del contratto è il {date}»), V-3 (it «categorie preimpostate» und neue Zeile in `docs/design/i18n-begriffe.md:68`), V-4 (it «avvia») und R-1 (en «at most the first three pages») sind alle so umgesetzt, wie der Bericht sie vorschlägt.

## Bestätigt im Delta

- **#501, Art. 264 Abs. 1 OR:** `contracts_notice_period_short` nennt jetzt in allen vier Sprachen den vom Mieter vorgeschlagenen, zumutbaren Ersatzmieter. Der Hinweis deckt sich inhaltlich mit dem Schluss von `glossary_notice_period_text` in jeder Sprache: de «zumutbaren Ersatzmieter vorschlägt», fr «que vous ne pouvez raisonnablement refuser», it «che Lei non possa ragionevolmente rifiutare», en «you cannot reasonably refuse». Das kleine «le» vor «propone» im Italienischen folgt dem Glossar und anderen bestehenden Texten (`help_payments_1`).
- **Test zu #501:** Der neue `it.each` in `src/__tests__/i18n.test.ts:121-130` prüft das Satzende in allen vier Sprachen. Gegen den alten Text («Ein Ersatzmieter übernimmt …») schlägt er fehl.
- **Szenario:** Der Schritt in `tests/e2e/steps/contract-detail.steps.ts:406` ist an den neuen deutschen Wortlaut angepasst. Er gehört zum Szenario «Kündigung mit zu kurzer Frist» (`tests/e2e/features/contract-detail.feature:182`, ohne `@wip`). Der Schritt geht nur über die Question `noticePeriodHintText`, die Screenplay-Schichten bleiben also eingehalten. Der Text wird nur an einer Stelle angezeigt: `src/routes/contracts/[id]/+page.svelte:47`.
- **Vier Sprachen:** Jeder geänderte Text ist in allen vier Dateien vorhanden, oder es ist eine Korrektur nur der Übersetzung in einer Sprache. Die neue Zeile in i18n-begriffe («preimpostato» = vordefiniert, «predefinito» = Standard) passt zu allen `*predefined*`- und `*default*`-Schlüsseln in `it.json`, die ich per Skript verglichen habe. Bei «Standard» steht weiterhin «predefinito».
- **R-1:** Mit dem en-Text stimmen jetzt alle vier Sprachen überein: de «höchstens», fr «au plus», it «al massimo».
- **Ponytail:** Das Delta ändert nur Texte, einen Test und einen Schritt. Es bleibt kein unbenutzter Code zurück.
- Nichts im Delta hat mit der Anforderung nichts zu tun.

## Nicht bestätigt

- Selbst laufen lassen, grün: `bunx vitest run src/__tests__/i18n.test.ts` (51/51).
- Vom Aufrufer gemeldet: `bun run lint` und `bunx vitest run src/__tests__` (2737/2737) auf 6ba20ebc, `bun run check` und Backend-`type-check` auf 98b8b9ac.
- Der E2E-Lauf von `contract-detail.feature` (Szenario «Kündigung mit zu kurzer Frist») und der übrigen betroffenen Features steht aus (beim Aufrufer wartet er auf die Sperre). Dass der Schritt mit dem neuen Text grün wird, folgt nur aus dem Lesen: Der Schritt prüft einen Teil des deutschen Texts in `messages/de.json:1650`.
- Ob der alte englische Text mit doppeltem Escape einen Backslash zeigt oder ob die Kompilierung scheitert: nicht ausprobiert. Der neue Test schlägt in beiden Fällen fehl.
- Den fachlichen Wortlaut der fr/it-Texte habe ich nur mit dem Glossar und `docs/design/i18n-begriffe.md` abgeglichen, nicht rechtlich geprüft (das ist die Aufgabe von fach-reviewer).
