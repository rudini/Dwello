# Code-Review 548, Runde 2 (6f963da..dfd07ac)

## Status der offenen IDs aus 548-review-1

- C-1 (Minor): erledigt in 8dd31d0. Der neue DOM-Test (invoice-upload-dialog.dom.test.ts:225) füllt von mehreren markierten Feldern nur den Rechnungssteller und erwartet den Satz weiter. Mit `every` statt `some` fehlt der Satz, weil `category` immer in `errors` steht. Der Test wird dann rot. Die Commit-Nachricht nennt ihn als Pinning-Test, und das ist richtig: Auf 6f963da hält das Verhalten schon, und der Test gehört zu keinem Bugfix.

## Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-2 | Major | tests/e2e/features/invoices.feature:116–133 | Der Fix von P-1 ändert sichtbares Verhalten: Das Feld Verteilschlüssel ist nicht mehr rot und zeigt keinen Fehlertext mehr, sobald die Kategorie den Schlüssel mitbringt. Dafür gibt es kein Szenario und kein `No scenario: <reason>`. Weder dfd07ac noch die Plan-Zeile 27 nennen einen Grund. |

### C-2 (Major): Szenario für den Fix von P-1 fehlt

Für jede Verhaltensänderung, auch einen Bugfix, den der Benutzer sieht, verlangt CLAUDE.md (Workflow 1, «Done means») ein Szenario ohne `@wip` oder `No scenario: <reason>`. Der Fix in UploadRowFields.svelte:112 ist so ein Bugfix: Persona Helga hat ihn als Major gemeldet, weil das rote Feld sie zu einem anderen Verteilschlüssel verleiten kann. Gezeigt ist er nur im DOM-Test (invoice-upload-dialog.dom.test.ts:104). Das Szenario «Rechnung ohne KI aus einer Datei erfassen» wählt den Verteilschlüssel nach der Kategorie von Hand (Zeile 128). Das hat den Fehler schon vorher verdeckt, denn ein `input` am Feld nimmt den Fehler über `corrected` in Field.svelte:39–45 weg.

Der E2E-Stack kann den Zustand herstellen: `seed.invoiceOn('Seeblick', 'Allgemeinstrom', …)` (tests/e2e/fixtures/screens.ts:236) legt den letzten Schlüssel der Kategorie an, und so setzt die Wahl der Kategorie den Schlüssel selbst. Nachweis: Auf 6f963da mit diesem Seed «Rechnungen erstellen» (Verteilschlüssel leer), dann die Kategorie wählen. Eine Question nach dem Fehlertext des Verteilschlüssel-Felds gibt dann noch «Wählen Sie, wie die Kosten verteilt werden.» zurück, auf dfd07ac nichts mehr. Nach der Ausnahme in Workflow 2 braucht das Szenario keinen eigenen roten Lauf, denn der DOM-Test war rot.

## Zu den Fragen des Aufrufers

- `keyError={row.values.distributionKeyId ? undefined : errors.distributionKeyId}` passt zum Muster von #245 und ist vollständig. `validateInvoice` (src/lib/invoice.ts:58) gibt für `distributionKeyId` nur «Pflicht» zurück. `checkRow` (src/lib/invoice-upload.ts:296–302) übernimmt nur diesen Schlüssel, und `servicePeriodErrors` schreibt in eigene Felder. Mit gesetztem Schlüssel kann es also keinen anderen Fehler am Verteilschlüssel geben, den der Ausdruck verschlucken würde. Die Kategorie verliert ihren Fehler über `corrected` in Field.svelte, weil der Benutzer das Feld bedient. Den Schlüssel setzt das `$effect` in InvoiceCategoryFields.svelte:49–54 ohne Eingabe, darum braucht er die Bedingung am Wert. Leert der Benutzer den Schlüssel danach wieder, zeigt das Feld den Fehler erneut. Der Effekt in Field.svelte:48–50 hat `corrected` zurückgesetzt, als der Fehler wegfiel. Das stimmt mit dem Satz «Füllen Sie die markierten Felder aus.» überein, der dann ebenfalls wiederkommt (UploadRowNotes.svelte:19). Ich werte das deshalb nicht als Fehler.
- P-2 und P-3 sind vorbestehend, da stimme ich zu. P-2 («Prüfen Sie: Rechnungsdatum.» kommt aus `row.unsure` in `toDoOf`) berührt der Diff nicht. P-3: Der Satz gilt nach der Anforderung nur für Felder, die beim letzten Versuch markiert waren. Ein später geleerter Betrag war auch auf der Basis nie markiert und wurde nie in den Hinweisen genannt. Die Änderung macht den Fall nicht widersprüchlicher.

Geprüft: Diff in UploadRowFields.svelte und in beiden neuen DOM-Tests. Der P-1-Test wird ohne den Fix beim Lesen rot: Der Fehlertext des Felds bleibt, und der Hinweis aus `toDoOf` fällt live weg. Keine neuen Texte, kein neuer Bildschirm, nichts ausserhalb der Anforderung.

## Nicht bestätigt

- `bunx vitest run src/__tests__/invoice-upload-dialog.dom.test.ts` (50 grün, P-1-Test vorher rot), `bunx vitest run --changed origin/main`, `bun run lint`, `bun run check`: vom Aufrufer gemeldet. Ich konnte nichts erneut laufen lassen, weil `node_modules` im Worktree auf /home/user/Dwello/node_modules zeigt und eine Deny-Regel den Zugriff verweigert.
- Beim Lesen gefunden, nicht im Browser nachgeprüft, ausserhalb des Diffs und vorbestehend: «Neue Rechnung» (src/routes/invoices/new/+page.svelte:183) und «Rechnung bearbeiten» (src/routes/invoices/[id]/edit/+page.svelte:180) geben weiter `keyError={errors.distributionKeyId}` aus dem Stand beim Absenden weiter. Dort bleibt das Feld vermutlich ebenso rot, wenn nach einem abgelehnten Absenden die Kategorie den Schlüssel setzt. Kandidat für ein Issue, kein Befund dieses Diffs.
