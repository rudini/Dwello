# Code-Review #245, Runde 2 (Schlussrunde)

Gegenstand: `git diff 9353cc58 709ea965 -- . ':!docs/reviews' ':!docs/design/personas'` (42e72381 Behebung C-1 bis C-3 aus `245-review-1.md`, 709ea965 Persona Helga 245 P-1) und der Merge-Commit 1079aaa6 (origin/main 6095bab9 in w9-issue-245, Konflikt `src/lib/ui/Field.svelte`). Worktree `w9-review-245-code-2`, detached auf 1079aaa6. Anforderung: Issue #245, `docs/reviews/245-fachreview-1.md`, `docs/reviews/245-review-1.md`, `docs/design/personas/helga-245.md`, `marco-245.md`.

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| R-1 | Major | `src/routes/invoices/UploadRowNotes.svelte:16`, `tests/e2e/features/invoices.feature:90-100` | Die Behebung von Helga P-1 ändert sichtbares Verhalten, das schon auf main besteht. Sie bringt aber kein Szenario mit und nennt auch kein `No scenario: <reason>` (Commit 709ea965). |

Vorheriger Bericht `245-review-1.md`: C-1, C-2 und C-3 sind behoben (siehe unten). Darüber hinaus keine Blocker und keine weiteren Major.

## R-1 (Major): Kein Szenario für die Behebung von P-1

**Warum falsch:** Der stehengebliebene Hinweis «Wählen Sie eine Kategorie.» ist kein Fehler, der erst mit #245 entstanden ist. Auf der Merge-Basis a828b368 nimmt `UploadRowNotes.svelte` `errors.category` ohne Bedingung in die Hinweise auf. Den Fehler sieht also heute schon jeder Benutzer auf main. Nach `CLAUDE.md` (Workflow 1, «Done means») braucht eine sichtbare Fehlerbehebung ein Szenario in `tests/e2e/features` ohne `@wip`. Der DOM-Test `nimmt die fehlende Kategorie zurück, sobald sie nach dem Erstellen gewählt ist` ist die richtige unterste Schicht, ersetzt das Szenario aber nicht. Der E2E-Stack kann diesen Zustand erzeugen: Das Szenario «Rechnung ohne KI aus einer Datei erfassen» (`invoices.feature:90`) geht genau diesen Weg. Erstellen ohne Kategorie, die Datei sagt «Wählen Sie eine Kategorie.», dann wählt der Verwalter «Allgemeinstrom». Zwischen dem Wählen und dem zweiten Erstellen prüft das Szenario aber nichts.

**Wie zeigen:** In diesem Szenario nach `Wenn der Liegenschaftsverwalter bei der Datei von "Elektro Blitz" die Kategorie "Allgemeinstrom" wählt` einen Anker einfügen, z. B. `Dann bietet Dwello "1 Rechnung erstellen" an` (der Schritt ist vorhanden, `invoices.feature:183`). Danach folgt `Und sagt die Datei von "Elektro Blitz" nicht "Wählen Sie eine Kategorie."`. Auf 9353cc58 wird der Schritt rot, weil `errors.category` stehen bleibt. Mit 709ea965 wird er grün.

## Bestätigt durch Code und Test

- **C-1** (`src/lib/invoice-upload.ts:209-211`): Den Mischkosten-Grund nennt Dwello nur noch bei `documentType === 'invoice'`, `!several` und `!duplicateOf`. Gutschrift und angekreuzte Zeile bleiben wie vorher. Der neue Unit-Test (`invoice-upload.test.ts:260-262`) prüft die drei Fälle mehrere Rechnungen, Duplikat und Akontorechnung. Gelesen: Auf der Basis ist jede dieser Zeilen nicht vorausgewählt (`preselected`, `invoice-upload.ts:259`), und `mixedCosts` gilt für sie. Jede gibt dort also den Mischkosten-Text zurück, der Test ist rot. Das passt zur Bedingung von `toDoOf` (`recorded`, `several`).
- **C-2** (`InvoiceUploadDialog.svelte:82`, `UploadResult.svelte:9,27`): `key: row.key` wird mitgegeben, die Liste ist nach `one.key` geschlüsselt. `m.invoices_upload_still_open_item(one)` erhält jetzt das zusätzliche Feld `key`. Paraglide nimmt nur die benannten Parameter, deshalb ändert das nichts. Der DOM-Test lädt `scan.pdf` zweimal und erwartet beide in der Liste «Noch offen».
- **C-3** (`tests/e2e/fixtures/dates.ts:12`): `thisYear` ist exportiert, die beiden Steps importieren den Helfer, die Kopie und der alte `inDays`-Import sind weg. Die übrigen `Number(inDays(0).slice(0, 4))` in `dashboard.steps.ts`, `statement-generate.steps.ts`, `statements.steps.ts` und `tenant-export.steps.ts` stammen nicht aus diesem Diff.
- **P-1** (`UploadRowNotes.svelte:15-16`): Ist eine Kategorie gewählt, entfällt `errors.category`. Wird sie wieder geleert, bringt `toDoOf` den Satz zurück (`invoice-upload.ts:175`), das `Set` zeigt ihn nur einmal. Gelesen: Der DOM-Test ist auf der Basis rot, weil `errors` erst beim nächsten Erstellen neu gesetzt wird (`InvoiceUploadDialog.svelte:200`) und der Satz bis dahin stehen bleibt. Neue Texte gibt es nicht, also auch keine Änderung in `messages/*.json` und keinen neuen a11y-Zustand.
- **`docs/design/offene-punkte.md` U-3:** Marco 245 P-3 ist als Teil eines bestehenden, nicht-funktionalen Punkts eingetragen (Dialog auf dem Telefon). Das passt zu «Open work».
- **Merge 1079aaa6, `Field.svelte`:** Gegen origin/main (`git diff 6095bab9 1079aaa6 -- src/lib/ui`) ändert sich nur das, was #245 bringt: `labelTestid`, `note.quiet` mit `warning` und `noteLook`, dazu `Checkbox.svelte`. Von main bleiben `invalidBy`, `flagged`, `edited` und die Einträge in `describedBy` vollständig erhalten. `invalid = !!shown || !!flagged` entspricht dem Ausdruck von main. `hasHelp` ersetzt `(help || example)` an beiden Stellen ohne Unterschied: Im `filter(Boolean)` von `describedBy` ergibt `hasHelp && helpId` dasselbe. `TextInput.svelte` unterscheidet sich nicht von main. Den Konflikt hat der Merge also ohne Verlust gelöst.
- **Ponytail-review:** Im Diff nichts Ungenutztes und keine Kopie eines bestehenden Helfers (C-3 ist aufgelöst). `invalid` und `hasHelp` sind wegen der Template-Komplexität von fallow herausgezogen und ändern kein Verhalten.
- **Screenplay:** Die geänderten Steps rufen weiter nur `seed` und `verwalter.sees(...)` auf. `thisYear` ist ein Fixture-Helfer, kein Seitenzugriff.
- **Nichts Fremdes im Diff:** Alle Änderungen gehören zu C-1 bis C-3, P-1, dem Eintrag von Marco P-3 oder der Archiv-Session.

## Nicht bestätigt

- `bun run lint`, `bun run check`, backend `type-check` und `bunx vitest run` (3400 von 3401, `tools/deepcheck/test/cli.test.ts` nur unter Last rot): vom Aufrufer gemeldet. Ich habe sie nicht wiederholt, weil der Worktree kein `node_modules` hat.
- E2E der Rechnungs- und Dashboard-Features und die axe- und Sprachzeilen der Rechnungs-Bildschirme: laufen laut Aufrufer noch, Ergebnis ausstehend.
- Rot des C-2-DOM-Tests auf der Basis: nur aus dem Svelte-Verhalten abgeleitet (`each_key_duplicate` im Dev-Build, den Vitest kompiliert), nicht ausgeführt.
- Die Meldung `invoices_upload_fields_missing` (`UploadRowNotes.svelte:17`) bleibt nach dem Ausfüllen der übrigen Felder ebenfalls bis zum nächsten Erstellen stehen. Das ist dieselbe Art Fehler wie P-1, besteht aber schon auf der Basis und gehört nicht zu P-1. Deshalb kein Befund dieses Diffs. Ob Helga oder Marco es gesehen haben: in `helga-245.md` nicht erwähnt.
- `docs/archive/implementation-plan-verlauf.md`: nur als Teil des Diffs gesehen (Session-Archiv), nicht inhaltlich gegen den Plan geprüft.

## Runde 2 (Commit 2e017a5f, nur R-1)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta. |

**R-1: geschlossen.** Das Szenario «Rechnung ohne KI aus einer Datei erfassen» (`tests/e2e/features/invoices.feature:99-100`) prüft jetzt nach der Wahl der Kategorie «Allgemeinstrom» zuerst den Anker `Dann bietet Dwello "1 Rechnung erstellen" an` und danach `Und sagt die Datei von "Elektro Blitz" nichts mehr`. Das Szenario ist nicht `@wip`.

- **Anker:** `createLabel` (`src/routes/invoices/InvoiceUploadDialog.svelte:116-122`) zählt nur vollständige gewählte Zeilen. Vor der Wahl der Kategorie ist die Zeile unvollständig, und die Schaltfläche heisst nicht genau «1 Rechnung erstellen». Der Anker wartet also auf den Zustand nach der Wahl. Er ist positiv (der Dialog ist offen, die Zeile wird gezählt) und deckt eine Fehlerseite oder eine verschwundene Zeile ab. So hält das Szenario die Regel «Negative checks» aus `tests/e2e/CLAUDE.md` ein.
- **Negativer Check:** Der neue Schritt (`tests/e2e/steps/invoice-upload.steps.ts:202-205`) ruft nur `verwalter.sees(noteOnBeleg(…)).toBeNull()` auf, also eine bestehende Question (`tests/e2e/questions/invoice-upload.ts:33`, `Text.of`). Er greift weder auf die Seite noch auf einen Locator zu, die Screenplay-Schichten bleiben eingehalten. `null` heisst: kein Hinweis zu dieser Datei. Das ist enger als «nicht ‹Wählen Sie eine Kategorie.›» und erfasst jede Variante des stehengebliebenen Satzes. Die Abweichung vom Vorschlag in Runde 1 ist begründet: Der vorhandene Schritt `sagt … nicht {string}` verlangt zuerst `not.toBeNull()` (Zeile 198), und nach der Behebung gibt es keinen Hinweis mehr.
- **Rot:** Nach dem Lesen wird der Schritt auf 9353cc58 rot. Dort nimmt `UploadRowNotes.svelte` `errors.category` ohne Bedingung auf, und `errors` wird erst beim nächsten Erstellen neu gesetzt. Der Hinweis bleibt also stehen. Das deckt sich mit dem gemeldeten «Received: "Hinweise zu Elektro Blitz … Wählen Sie eine Kategorie."». Die Commit-Nachricht sagt zwar «pin», nennt aber den roten Lauf. Eine Ausnahme ohne Rot wird also nicht beansprucht.
- **Feature-Sprache:** «sagt die Datei … nichts mehr» beschreibt, was der Verwalter sieht, nicht wie er es bedient.

### Nicht bestätigt

- Rot auf 9353cc58 und grün auf 2e017a5f (1 passed): vom Aufrufer gemeldet. E2E habe ich nicht gestartet (Vorgabe). Bestätigt ist beides nur durch das Lesen von `UploadRowNotes.svelte` und `InvoiceUploadDialog.svelte`.
- Lint grün: vom Aufrufer gemeldet, nicht erneut ausgeführt.

## Runde 3 (Merge 89217dea, origin/main 57211576 in w9-issue-245)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde im Merge. |

Offene IDs aus den Runden 1 und 2: keine. R-1 wurde in Runde 2 geschlossen.

### Bestätigt

- **Treue des Merges:** Die Merge-Basis ist 6095bab9. `git diff --numstat 6095bab9 57211576` und `git diff --numstat 2e017a5f 89217dea` über `src tests messages backend` sind gleich, bis auf `src/routes/invoices/InvoiceUploadDialog.svelte` (3/1 statt 2/1, das ist die Auflösung aus Punkt 3). Bei den Dateien, die beide Seiten ändern (`InvoiceUploadRow.svelte`, `invoice-upload-dialog.dom.test.ts`, `invoice-pages.dom.test.ts`, `invoice-detail.steps.ts`, `tasks/invoice-form.ts`, `messages/de.json`), sind die geänderten Zeilen des Merge-Deltas zeilengleich mit denen von main. Der Merge verliert also nichts von main und bringt sonst nichts Fremdes hinein.
- **Konflikt 1** (`src/routes/invoices/[id]/edit/+page.svelte:34-35`): Beide Props bleiben erhalten. `+page.server.ts` liefert beide: `statements` über `statementPeriods` (`src/lib/server/invoice.ts:119-125`) und `tanks` über `tankCategories`. Das Template nutzt beide, `data.tanks` in Zeile 65 (`deliversToTank`) und `data.statements` in Zeile 126 (`BilledWarning`). Der Import nennt `deliversToTank` (main) und `BilledStatement` (#245).
- **Konflikt 2** (`tests/e2e/steps/invoice-form.steps.ts`): Die drei Schritte von #245 und der Schritt von main «erklärt das Formular beim Leistungszeitraum nicht {string}» stehen nebeneinander. Die Schritte haben verschiedene Texte, es gibt also keine doppelte Definition. Importiert werden `chooseBuilding` (main) und `clearCategory` (#245). Alle Schritte rufen nur Tasks und Questions auf.
- **Punkt 3** (`src/routes/invoices/InvoiceUploadDialog.svelte:50,283`): `const tank = $derived(buildings.find(...)?.tank)` hängt von `buildings` (Prop) und `buildingId` (`$state`) ab und wird bei jeder Änderung neu berechnet. Das verhält sich wie der Ausdruck von main im Template. `tank` wird nur in Zeile 283 gebraucht, und `InvoiceUploadRow` nimmt es entgegen (`tank?: string`, Zeile 29) und gibt es an `UploadRowFields` weiter (Zeile 102). Die Verhaltensänderung bleibt aus, deshalb braucht es keinen neuen Test.
- **Texte:** In allen vier `messages/*.json` ist das JSON gültig, es gibt je 1879 Schlüssel, keiner doppelt.
- **`docs/design/offene-punkte.md`:** U-3 (#245) und O-44 (main) sind beide da. Keine ID ist doppelt.
- **Plan-Archiv:** Die Sessions W9c (#245), W3-451 und «faster CI round trips» stehen nacheinander, keine fehlt.

### Nicht bestätigt

- Lint und svelte-check grün: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Vitest der Rechnungs-Dateien: Ich habe `bunx vitest run` auf `invoice-pages.dom.test.ts`, `invoice-upload-dialog.dom.test.ts`, `invoices.test.ts` und `invoice-upload.test.ts` versucht. Der Lauf bricht beim Start ab (`Cannot find package 'vitest'`), weil der Review-Worktree kein `node_modules` hat. Das Ergebnis meldet der Aufrufer nach. Der Worktree ist danach unverändert (`git status` leer).
- E2E der Rechnungs-Features: nicht gestartet (Vorgabe), das Ergebnis meldet der Aufrufer nach. Durch Lesen nicht geprüft habe ich, ob die neuen Szenarien von main (Tank-Hilfe beim Leistungszeitraum, `invoice-new.feature`) mit der Pflicht-Kategorie von #245 in «Rechnung bearbeiten» zusammen laufen. Den Code habe ich nur bis zur Weitergabe der Props verfolgt.
