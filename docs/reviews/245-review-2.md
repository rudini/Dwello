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

## Runde 4 (Merge 2)

Gegenstand: nur die Konfliktauflösung im Merge-Commit `2e57da40` (Parents `ea275a66` = w9-issue-245, `319335ef` = origin/main; Merge-Base `f8471e13`). Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/w9-review-245-code-5`, detached auf `2e57da40`, unverändert (`git status` leer).

### Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

### Geprüft

- `git show 2e57da40 --cc -- src/lib/ui/Field.svelte`: beide Props sind da, `labelTestid` (#245, Destrukturierung Z. 17, Typ Z. 29) und `testid` (#499, Z. 18 und Z. 31 mit Kommentar). `data-testid={testid}` sitzt am äusseren `div` (Z. 83), `data-testid={labelTestid}` am `label` (Z. 84). Auch die übrigen #245-Änderungen in Field sind erhalten: `note.quiet`, `warning`/`noteLook`. Keine Konfliktmarker.
- Nichts verloren, Seite main: `git diff ea275a66 2e57da40` gegen `git diff f8471e13 319335ef` (index-Zeilen ignoriert). Die beiden Diffs unterscheiden sich nur in Hunk-Kontext und -Offsets von `docs/archive/implementation-plan-verlauf.md` und in `src/lib/ui/Field.svelte`, dort nur durch die #245-Zeilen im Kontext. Gleiche 27 Dateien, 588+/6-, wie bei `git diff ea275a66^2 319335ef --stat`. Die Stat `94989978..2e57da40` (57 Dateien) enthält zusätzlich den ersten Merge `ea275a66`, deshalb ist sie grösser. Sie ist kein Zeichen für Verlust.
- Nichts verloren, Seite #245: `git diff f8471e13 ea275a66` gegen `git diff 319335ef 2e57da40`. Sie unterscheiden sich nur in Kontext und Offsets (Archiv, `messages/*.json`) und in den #499-Zeilen von Field.svelte.
- Archiv: die Sessions W9c (#245, Z. 2243), W1b (#499, Z. 2257) und W3-451 (Z. 2269) stehen alle drin, keine ist doppelt.
- Aufrufer: `InvoiceCategoryFields.svelte:60` übergibt `labelTestid="invoice-category-label"` (Target `tests/e2e/targets/invoice-form.ts:21`). `DateInput.svelte` übergibt `testid="{testid}-field"` (#499). Die beiden Props kollidieren nicht.

### Nicht bestätigt

- Die Unit- und DOM-Tests habe ich nicht neu laufen lassen. `bunx vitest run src/__tests__/contract-edit.dom.test.ts` bricht im Review-Worktree mit `ERR_MODULE_NOT_FOUND` ab, weil dort keine `node_modules` liegen. Lint, Check und Tests der Merge-Auflösung gelten daher nur als «vom Aufrufer gemeldet».
- E2E wurde gemäss Auftrag nicht gestartet (gemeinsamer Container). Die Szenarien, die die Selektoren `invoice-category-label` und `{testid}-field` nutzen, sind nicht bestätigt.

## Runde 5 (Merge 3)

Gegenstand: die Konfliktauflösung im Merge-Commit `8df35114` (Parents `8df35114^1` = w9-issue-245, `1110abb8` = origin/main mit #539/#452; Merge-Base `319335ef`) und der Fix `048c8b8c` (`checkRow`: Kategorie zuerst). Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/w9-review-245-code-6`, detached auf `048c8b8c`, unverändert (`git status` leer).

Offene IDs aus den Runden 1 bis 4: keine.

### Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `src/lib/invoice-upload.ts:296-298` (048c8b8c) | Der Fix stellt nur die Kategorie nach vorne. Hinter ihr bleibt die Reihenfolge von `validateInvoice`: Datum, Rechnungssteller, Beschreibung, Betrag, **dann** Verteilschlüssel. Die Zeile (`toDoOf`, Z. 176-178) nennt dagegen den Verteilschlüssel **vor** den Pflichtfeldern. Ein Beispiel ist eine von der KI gelesene Datei mit Kategorie, ohne Verteilschlüssel (kein Vorschlag, kein Standard) und ohne Betrag (`missing: ['amount']`). Die Zeile nennt zuerst «Wählen Sie, wie die Kosten verteilt werden.», `openReason` unter «Noch offen» aber den Betragsfehler. Das ist dieselbe Abweichung, die der Commit für die Kategorie behebt («the same reason as the row»), und der Testname «nennt als Grund einer offenen Datei ihre erste Aufgabe» deckt diesen Fall nicht. Behebung z. B. `{ category, distributionKeyId, ...errors }` mit einer weiteren Zeile im Unit-Test. |

Keine Blocker, keine Major.

### Geprüft

- **`git show 8df35114 --cc`:** Keine Konfliktmarker (`git grep '<<<<<<<\|>>>>>>>'` in `src`, `tests` und `messages` leer). Die Auflösung entspricht in allen sechs Punkten der Beschreibung des Aufrufers.
- **Nichts verloren:** Ich habe die Zeilen von `git diff -U0 319335ef 1110abb8` mit `git diff -U0 8df35114^1 8df35114` verglichen, sortiert und ohne Kopfzeilen, ebenso `git diff 319335ef 8df35114^1` mit `git diff 1110abb8 8df35114`. Abweichungen gibt es auf beiden Seiten nur an den beschriebenen Stellen: der Import in `InvoiceUploadRow.svelte`, `proposeKey` (main entfernt es), die umgestellten Schritte im Szenario «Rechnung ohne KI aus einer Datei erfassen» und der entfernte Schritt «sagt die Datei von {string} nichts mehr». Sonst fehlt keine Zeile, auch keine aus `invoice-upload.ts`, `InvoiceUploadDialog.svelte`, `[id]/edit/+page.svelte`, aus den Targets, Questions oder Steps.
- **Reste von #455:** `git grep 'proposeKey\|keyFor\b\|row\.proposedKey\|proposedKey:'` in `src` und `tests` ist leer. Der Dialog nutzt `proposedKey` aus `$lib/invoice` (Z. 54-61) zusammen mit `const tank = $derived(...)` (Z. 53). An der Zeile stehen `keyProposal` und `{tank}`. `UploadRowFields.svelte:110-112` gibt `keyProposal`, `bind:keyChosen` und `keyError` weiter.
- **`invoice-upload.ts`:** `UploadRow` hat `notRead` (#245) und `keyChosen` (main), `proposedKey` gibt es nicht mehr. `FIELD_LABELS` bleibt in Formularreihenfolge. In `toDoOf` stehen `notRead`, Kategorie, `invoices_error_key_required` und die Pflichtfelder mit `byHand` (#245, inkl. `status === 'failed'`).
- **Bearbeiten-Seite:** Jedes Prop, das `[id]/edit/+page.svelte` an `InvoiceCategoryFields` gibt, ist dort deklariert (Z. 21-44). Der Loader liefert `statements` (`statementPeriods`, `src/lib/server/invoice.ts:130`), `latestKeys` und `defaultDistributionKeyId` (`invoiceChoices`, Z. 59-60) sowie `returnTo`. `keyNote` ist auf der Seite definiert (Z. 62). `errors.category` setzt die Seite weiter (Z. 97).
- **R-1, weiter abgedeckt:** Der neue Schritt `Dann sagt die Datei von "Elektro Blitz" nicht "Wählen Sie eine Kategorie."` folgt direkt auf die Wahl der Kategorie (`invoices.feature:101`). Dieser Check entspricht dem Vorschlag aus Runde 1. Auf 9353cc58 ist er rot: `errors.category` aus dem ersten Erstellen steht ohne Bedingung in den Hinweisen und bleibt bis zum nächsten Erstellen stehen. Auf dem Merge ist er grün (`UploadRowNotes.svelte:16`). Anker ist das `not.toBeNull()` des Schritts (`invoice-upload.steps.ts:206`). Ohne Hinweis wäre auch der Satz weg. Das reicht hier, weil der Satz vor der Wahl sichtbar war: Ein Wettlauf kann den Check also nur fälschlich rot machen, nie fälschlich grün. Dass die Zeile danach noch einen Hinweis hat, stimmt (Verteilschlüssel fehlt, `toDoOf` Z. 177). Der entfernte Schritt «nichts mehr» wird von keinem Szenario mehr benutzt (`git grep 'nichts mehr' tests/e2e` findet nur den anderen Schritt «erklärt die Auswahl … nichts mehr»). Die Question `noteOnBeleg` bleibt in Gebrauch.
- **048c8b8c:** Ohne den Fix ist der neue Unit-Test rot. `{ ...errors, category }` stellt `distributionKeyId` vor `category`, also liefert `openReason` «Wählen Sie, wie die Kosten verteilt werden.». `validateInvoice` setzt nie einen Schlüssel `category`, die Spread-Reihenfolge überschreibt also nichts. `openReason` wird nur in `InvoiceUploadDialog.svelte:80` gebraucht. Der Fix behebt die Wechselwirkung mit #452 im Szenario «Nur vollständige Rechnungen werden gezählt und erstellt». Rest: C-1.
- **Ponytail-review:** Der Merge bringt nichts Ungenutztes. Der Schritt ohne Nutzer ist entfernt, und `proposeKey` ist mitsamt Import weg.
- **Nichts Fremdes:** Ausser der Konfliktauflösung und dem Fix ändert der Merge nichts gegenüber den beiden Seiten.

### Nicht bestätigt

- vitest 3449/3449 (vor dem Fix), die Rechnungs-Dateien nach dem Fix 174/174, E2E auf 8df35114 (539 passed, 1 failed, der vom Fix behobene Fall), axe- und Sprachzeilen der Rechnungs-Bildschirme (40 passed) und alle Rechnungs-Features nach dem Fix (78 passed): vom Aufrufer gemeldet. Ich habe nichts wiederholt, weil der Worktree kein `node_modules` hat. E2E war laut Auftrag nicht erlaubt. Lint und `bun run check` nennt der Aufrufer nicht. Die Prop-Typen der Bearbeiten-Seite habe ich nur gelesen, nicht mit svelte-check geprüft.
- Das Rot des R-1-Schritts auf 9353cc58 habe ich nur aus dem Code abgeleitet (`git show 9353cc58:src/routes/invoices/UploadRowNotes.svelte` nimmt `errors.category` ohne Bedingung auf), nicht ausgeführt.
- **Hinweis, kein Befund dieses Diffs:** Schritt «nichts mehr» war die strengere Prüfung aus Runde 2, und auf dem Merge könnte er nach der Wahl des Verteilschlüssels nicht mehr grün werden. Beim ersten Erstellen setzt `checkRow` auch `distributionKeyId`. `errors` wird erst beim nächsten Erstellen neu gesetzt (`InvoiceUploadDialog.svelte:198`). Deshalb bleibt «Füllen Sie die markierten Felder aus.» (`UploadRowNotes.svelte:17`) nach der Wahl des Schlüssels stehen. Das ist dieselbe Art Fehler wie Helga P-1, jetzt für den Verteilschlüssel. Er besteht schon auf origin/main 1110abb8 (gleiche Zeile in `UploadRowNotes.svelte`, Schlüssel dort Pflicht) und war in Runde 2 schon für die übrigen Felder notiert. Der Merge macht ihn nicht sichtbarer, er prüft ihn nur nicht mehr. Nach «Open work» gehört er in ein Issue (`bug`) oder ergänzt ein vorhandenes. Gesucht habe ich nicht (keine GitHub-Abfrage in diesem Auftrag).
