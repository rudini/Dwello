# Slice-Review #448, Runde 4 (Nachprüfung C-17 bis C-20)

Worktree `review-448-code4`, Commit 0b23ba33. Delta `git diff b97b341a 0b23ba33`: f1616350 (Fix) und 0b23ba33 (nur `docs/reviews/448-review-3.md`). Vorheriger Bericht: `448-review-3.md`.

## Status der offenen IDs aus Runde 3

| ID | Status |
|----|--------|
| C-17 | erledigt. fr/it `glossary_balance_text` sind genau die Fassung von b97b341a^1 mit «frais d’administration» bzw. «spese amministrative» (per Skript geprüft: Ersetzung ergibt das Ergebnis zeichengleich). `statements_notes_help` fr/it haben den PDF-Satz wieder. Drei-Wege-Vergleich aller Schlüssel in allen vier Sprachen (Basis 7261d21a, b97b341a^1, b97b341a^2, 0b23ba33): Ausser diesen beiden Schlüsseln weicht das Ergebnis nur bei fr `statements_paid_date_early` und en `statements_correct_open`, `statements_correct_open_refund`, `backend_statement_paid_amount_invalid` vom Branch ab, und dort nur durch die Typografie aus C-20. Kein weiterer #448-Text ist verloren. Test `i18n.test.ts:22-27` prüft alle vier Sprachen; auf b97b341a fehlten «CHF 5.00» und «PDF» in fr/it, er wäre rot gewesen. |
| C-18 | erledigt. `Correction.svelte:34-35`: `settled` und nicht `carried` (also Saldo 0.00) führt auf `statements_correct_settled`. Der Text existiert in allen vier Sprachen (`messages/*.json:1097`). Der DOM-Test (`statement-pages.dom.test.ts:715-719`) prüft den ganzen Satz bis «erhalten.» und dass «Bereits bezahlt» fehlt. Vorher kam `statements_correct_open` («… erhalten, wird nicht mehr gemahnt … «Bereits bezahlt» …»): beide neuen Erwartungen wären rot gewesen. |
| C-19 | erledigt. Der Kommentar in `0028_statement_carry_over.sql:5` passt zu `carriable` (`statement.service.ts:394-399`). |
| C-20 | erledigt. `i18n.test.ts:30-41` liest die ganze Datei `messages/fr.json` bzw. `en.json`, nicht nur die Schlüssel des PR, und fängt damit auch spätere Texte. Gegenprüfung mit denselben Regexen: auf `origin/main` (a828b368, Stand nach `git fetch`) fr und en ohne Treffer; ebenso im Ergebnis von `git merge-tree --write-tree origin/main 0b23ba33` (konfliktfrei). Der PR macht main also nicht rot. Auf b97b341a hätten sie `statements_paid_date_early` (fr) und die drei en-Schlüssel gemeldet. |

## Neue Befunde

Keine.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | – |

## Nicht bestätigt

- Die vitest-Läufe (i18n, statement-pages.dom, help-page.dom: 226 grün), lint, check, der ganze vitest-Lauf, Fallow- und Commit-Gates: vom Aufrufer gemeldet. Mein Nachlauf von `bunx vitest run src/__tests__/i18n.test.ts src/__tests__/statement-pages.dom.test.ts` im Worktree brach mit `ERR_MODULE_NOT_FOUND` ab (vermutlich fehlen dort `node_modules` oder das generierte `src/lib/paraglide/`); die Ursache konnte ich nicht weiter prüfen. Die roten Läufe vor dem Fix habe ich nur durch Lesen (Texte auf b97b341a gegen die Erwartungen) bestätigt.
- Die fr-Typografieprüfung deckt nur `? ! ;` ab, nicht `:` und den Innenraum von « ». Eine Stichprobe mit Regex auf `origin/main` und dem Merge-Ergebnis fand dort auch keine Verstösse; das ist keine Lücke des PR.
