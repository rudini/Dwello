# Review 626, Runde 3 (Schlussrunde vor dem Push)

Bereich: `git diff a09c313 87fee8a -- . ':!docs/reviews' ':!docs/design/personas'` (Commit 87fee8a, Worktree review-626-close)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Major | src/routes/invoices/InvoiceUploadDialog.svelte:140 | Bei «Keine KI» kehrt `read()` vor `pagesOf(file)` zurück. Dadurch bleibt `pages[key]` leer, und die Zeile zeigt keine Vorschau der ersten Seite mehr (`preview={pages[row.key]?.[0]}`, :281). Das trifft genau den Fall, in dem der Liegenschaftsverwalter alles selbst abtippt. Kein Test hält die Vorschau fest. |
| C-4 | Major | tests/e2e/features/ki-einstellungen.feature:46 | Die sichtbare Änderung hat kein Szenario: Die Zeile sagt bei «Keine KI» nicht mehr «Die KI hat diese Datei nicht gelesen». Das Szenario prüft nur den Einleitungstext. Der Commit nennt auch kein `No scenario: <reason>`. |
| C-5 | Minor | src/routes/invoices/InvoiceUploadDialog.svelte:140 | Weil `pagesOf` übersprungen wird, kann eine Datei, die sich nicht öffnen lässt, bei «Keine KI» ihren Hinweis «Dwello kann diese Datei nicht öffnen. Bitte füllen Sie die Felder aus.» nicht mehr bekommen. Der Hinweis nennt keine KI (`messages/de.json:1033`) und galt vorher auch bei «Keine KI». |

## C-3: Vorschau fehlt bei «Keine KI»

- **Warum falsch:** Vor 87fee8a hat `read()` auch bei `kiOff` zuerst `pagesOf(file)` aufgerufen. Das Bild der ersten Seite stand dann in `pages[key]`, und `UploadRowFields.svelte:51-52` hat die Vorschau neben den Feldern gezeigt. Persona Anna hat sie in Schritt 6 gesehen («Vorschau der PDF, der Link «Datei gross anzeigen», dann leere Felder», `docs/design/personas/anna-626.md:39`). Jetzt kehrt `read()` in Zeile 140 vorher zurück. `pages[key]` wird nie gesetzt, also gibt es kein `<img>`. Es bleibt nur der Link auf die ganze Datei. Für P-2 genügt es, `/invoices/extract` nicht aufzurufen. `pagesOf` arbeitet nur im Browser und schickt nichts an den Server.
- **So zeigt man den Fehler:** Im DOM-Test `schickt bei «Keine KI» keine Datei zum Auslesen …` (`src/__tests__/invoice-upload-dialog.dom.test.ts:179`) die Zeile öffnen («Angaben prüfen») und das Bild mit dem Alt-Text «Vorschau von rechnung.pdf» erwarten. Der Mock von `pagesOf` liefert ein Bild (:7). Der Test schlägt auf 87fee8a fehl.
- **Behebung:** Die Seiten weiter erzeugen und erst danach bei `kiOff` mit `withoutKi(row, 'off')` zurückkehren. Damit ist auch C-5 behoben.

## C-4: Kein Szenario für die geänderte Zeile

- **Warum falsch:** CLAUDE.md, Workflow 1: Eine sichtbare Verhaltensänderung braucht ein Szenario ohne `@wip`. Die Anforderung von #626 lautet: «nichts im Dialog darf sagen, dass eine KI die Dateien liest». Bis 87fee8a stand in der Zeile genau so ein Satz (Anna P-1). Diese Zusage prüft nur der DOM-Test. Das Szenario «Rechnungen hochladen, wenn keine KI gewählt ist» (`ki-einstellungen.feature:46-50`) endet beim Einleitungstext. Ein Szenario ist mit dem E2E-Stack machbar: «Keine KI» ist gewählt, eine PDF hochladen, dann die Hinweise der Zeile abfragen und eine Negativprüfung auf «KI» machen. Die Hinweise der Zeile fragen bestehende Questions im Upload-Szenario von `invoices.feature` schon ab.
- **So zeigt man den Fehler:** Den Code von 87fee8a in `read()` herausnehmen. Alle E2E-Szenarien bleiben grün.

## Nicht bestätigt

- Lint, check, fallow audit und vitest `invoice-upload-dialog.dom` + `invoice-upload*.test.ts` (85 grün): vom Aufrufer gemeldet, nicht wiederholt.
- Rot des neuen DOM-Tests: nur durch Lesen geprüft. Ohne Zeile 140 ruft der Dialog `/invoices/extract` auf, also schlägt die erste Erwartung fehl. Mit der alten Bedingung für die Hinweise hätte `'off'` den Hinweis «nicht öffnen» bekommen, also schlägt die letzte Erwartung fehl.

Geprüft: `withoutKi` hat keine weiteren Aufrufer, der Fall `'unavailable'` bleibt gleich (`invoice-upload.test.ts:212-280`), es gibt keine neuen Texte in `messages/*.json` und keine Änderungen ausserhalb der Anforderung.
