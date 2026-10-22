# Review 626, Schlussrunde, Runde 2 (Delta)

Delta: `git diff 87fee8a aa57375 -- . ':!docs/reviews'` (Worktree review-626-close2, Commit aa57375). Vorheriger Bericht: `docs/reviews/626-review-3.md`.

## Status der offenen IDs

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-3 | Major | behoben | `InvoiceUploadDialog.svelte:142-152`: `pagesOf` läuft jetzt vor der Rückkehr bei `kiOff`. Der DOM-Test öffnet die Zeile und erwartet das Bild (`invoice-upload-dialog.dom.test.ts:198-201`). Ohne die Änderung bleibt `pages[key]` leer, der Test schlägt also fehl. |
| C-4 | Major | offen | Das Szenario ist da (`ki-einstellungen.feature:52-54`), zeigt aber kein Rot. Siehe unten. |
| C-5 | Minor | behoben | Der `catch`-Zweig mit `'unreadable'` (`:147`) steht jetzt vor der Prüfung auf `kiOff`. Einen eigenen Test mit `kiOff` gibt es nicht. Das bleibt so, weil es sich um einen Minor handelt. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-6 | Minor | tests/e2e/tasks/invoice-upload.ts:62-63 | Der alte JSDoc «Opens the dialog on the invoice list, chooses the building and adds the files» steht jetzt über `addBelege`, direkt über dem neuen JSDoc. `addBelege` öffnet aber keinen Dialog. `uploadBelege` hat dagegen keinen Kommentar mehr. Der Kommentar gehört unter `addBelege` zu `uploadBelege`. |

## C-4 (weiter offen): Die Negativprüfung besteht schon, solange die Datei noch gelesen wird

- **Warum falsch:** `addBelege` (`tasks/invoice-upload.ts:64-65`) endet mit dem Upload und wartet nicht, bis die Zeile gelesen ist. Eine neue Zeile beginnt mit `status: 'reading'` (`src/lib/invoice-upload.ts:94`) und zeigt «Wird gelesen …» (`messages/de.json:1027`). Der Hinweis der Zeile kommt erst, wenn `pagesOf` fertig ist, also nach dem Rendern der PDF mit pdf.js. `actor.sees` ist `expect.poll` (`screenplay/actor.ts:47-48`). `not.toContain('KI')` besteht deshalb schon bei der ersten Abfrage, solange die Zeile noch «Wird gelesen …» zeigt. Der positive Anker `toContain(fileName)` ist ebenfalls schon während des Lesens erfüllt und zeigt nicht, dass das Lesen beendet ist. Damit verstösst der Test gegen `tests/e2e/CLAUDE.md`, «Negative checks»: Der Anker muss den Zustand belegen, in dem das Falsche erscheinen würde. Auch die Regel aus dem Auftrag ist verletzt: Tasks warten auf den Zustand, zu dem sie führen. Mit dem Stand vor 87fee8a (Hinweis «Die KI hat diese Datei nicht gelesen») bleibt das Szenario sehr wahrscheinlich grün.
- **So zeigt man den Fehler:** In `withoutKi` für `'off'` wieder den alten KI-Hinweis setzen, oder 87fee8a auf `src/` zurücknehmen, und dann `Rechnungen hochladen, wenn keine KI gewählt ist` laufen lassen. Das Szenario besteht, obwohl die Zeile kurz danach «KI» nennt.
- **Behebung:** Vor der Negativprüfung auf das Ende des Lesens warten. Das geht mit dem bestehenden `Wait.until(belegDetailsToggle(fileName))`, das `openBelegOnceRead` schon nutzt (der Umschalter erscheint erst nach dem Lesen). Alternativ positiv auf den Hinweis bzw. Status der fertigen Zeile prüfen. Danach das Rot einmal mit dem alten Hinweis zeigen.

## Nicht bestätigt

- Lint, check, fallow audit, vitest `invoice-upload-dialog.dom` (52 grün), das volle vitest auf 87fee8a (3669) und E2E chromium (50 bestanden): vom Aufrufer gemeldet, nicht wiederholt.
- Ob das Szenario ohne die Änderung tatsächlich grün bleibt: nur durch Lesen geprüft (Polling in `screenplay/actor.ts:47`, Startstatus in `src/lib/invoice-upload.ts:94`). E2E darf ich nicht starten.

Geprüft: Fixture `frisch.building()` wird in `cleanUp` entfernt (`fixtures/fresh-installation.ts:72`), die Steps rufen nur Tasks und Questions auf, es gibt keine neuen UI-Texte und nichts ausserhalb der Anforderung.
