# Code-Review 1016b, Runde 2 (Re-Review und Abschlussrunde)

Delta `git diff 8d57cf7 9b56417 -- . ':!docs/reviews'`, Worktree `/tmp/scratchpad/review-1016b-code-reviewer` (detached auf 9b56417). Vorheriger Bericht: `docs/reviews/1016-review-1.md`.

Geschlossen: C-1, C-2

Keine neuen Befunde.

- C-1: Das neue Szenario in `tests/e2e/features/statement-detail.feature:1321-1331` ist ohne `@wip`. Es versendet, hält nur die Bemerkung fest, hält danach eine Zahlung von 10.00 fest und lädt die «Nebenkostenabrechnung, neues PDF» unter «Dokumente» herunter. Erwartet wird «Offener Betrag CHF 432.90». Das Szenario nutzt nur bestehende Steps (`statement-edit.steps.ts:47`, `statement-detail.steps.ts:220/340`, `documents.steps.ts:65`). Diese rufen nur Tasks und Questions auf. Rot nach Lesen: Ohne den Fix bleibt das neue PDF stehen, das vor der Zahlung erstellt wurde. Es nennt keine Zahlung und keinen «Offener Betrag CHF 432.90».
- C-2: `statement-mail.pg.test.ts:515-518` liest den Text des neuen Dokument-PDFs (`readPdf(...).flowing`) und erwartet «Bereits bezahlt CHF 10.00» und «Offener Betrag». Beide Texte stammen aus `pdf.service.ts:133/135` («Betrag der Abrechnung {amount} – Bereits bezahlt {paid}»). Übernähme `keepNewPdf` den alten Inhalt, würde der Test rot.

Geprüft: Der Merge 32d55d8 ist sauber (`git show --cc` zeigt keinen aufgelösten Konflikt). Was er mitbringt, ist #1015 (`statement-lock.pg.test.ts`, `statement.service.ts`, Archiv), also kein Code dieses Slices. Der Archiveintrag 9b56417 gibt den Stand richtig wieder.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `statement-mail.pg.test.ts` (27 pass); das E2E-Szenario mit chromium (grün; mit `backend/src/routes/statements.ts` auf dem Stand von origin/main rot, mit genau dem fehlenden Text); auf 8d57cf7 die volle Backend-Suite (1962 pass), `type-check` und `lint`.
- Ob das Szenario nach `keepNote` ohne eigene Navigation auf der Detailseite landet, auf der `recordPayment` die Zahlung festhält: nur durch den gemeldeten grünen Lauf belegt, die Task `keepNote` habe ich nicht gelesen.
- Ob `newPdfs()` das Feld `content` (base64) liefert: nur durch den gemeldeten grünen Lauf belegt.
