# Code-Review #233, Runde 4 (Slice «Fixes des Feature-Reviews», Runde 1)

Geprüft im Worktree `review-233-code4` auf Commit 11168a4f, Delta `git diff a09ae7f6 11168a4f` (18 Dateien). Ich habe alle geänderten Dateien gelesen. Die Persona- und Review-Berichte habe ich nur so weit gelesen, wie es für die Triage nötig war. Zusätzlich angesehen: `UploadRowNotes.svelte` (Verwendung von `toDoOf`), `SendDialog.svelte` und `BuildingCard.svelte` (weitere Nutzer von `target` in `Button`), `src/routes/api/invoices/+server.ts`, `tests/a11y/screens.json` (`invoice-detail`, `invoice-billed-detail`), `tests/e2e/features/invoices.feature` (Szenarien zum Hochladen), den Step «sagt die Datei von …» (`toContain`), `backend/src/routes/invoices.ts` (`belegSchema`) und `docs/reviews/233-review-3.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-20 | Major | src/lib/invoice-upload.ts:141-160; tests/e2e/features/invoices.feature:83-91, 109-117 | Drei für den Nutzer sichtbare Verhaltensänderungen haben weder ein Szenario noch eine Zeile `No scenario: <reason>`: ohne KI werden die Pflichtangaben sofort genannt (Helga P-1); bei Gutschrift und Mahnung gibt es nichts mehr auszufüllen (Weber P-4); der Hinweis auf gemischte Kosten richtet sich nach der gewählten Kategorie (V-8). Die bestehenden Szenarien sind vor und nach der Änderung grün. |
| C-21 | Minor | src/routes/invoices/UploadRowFields.svelte:48-61; implementation_plan.md:30 | Zu C-12 (der Link erscheint erst, wenn die Datei bereit ist) gibt es keinen Test, der den Link vor dem Auflösen von `fileType` als nicht vorhanden zeigt. Der Plan nennt keine «Test red»-Zeile dafür. |
| C-22 | Minor | implementation_plan.md:33 | Für Slice 4 fehlt die Zeile `Skills: tdd, ponytail, ponytail-review`. |
| C-23 | Nit | src/lib/invoice-upload.ts:137-139 | Der Doc-Kommentar von `toDoOf` nennt die Reihenfolge «Kategorie, Pflichtfelder, unsichere, optionale». Der Hinweis auf gemischte Kosten steht jetzt aber zuerst und fehlt in der Aufzählung. |
| C-24 | Nit | src/lib/server/invoice.ts:145 | `typeof fields !== 'object'` lässt ein JSON-Array (`[]`) als Felder durch. Danach scheitert die Anfrage erst im Backend (422) statt hier mit 400. Das ist harmlos, aber kein «Formular, das kein Formular ist». |
| C-25 | Nit | src/lib/invoice-upload.ts:143 | Eine Zeile im Status `failed` («… oder füllen Sie die Felder aus») nennt die Pflichtangaben weiterhin nicht. Nur `withoutKi` setzt `byHand`. Wer nach dem Scheitern von Hand ausfüllt, erfährt die fehlenden Angaben also erst beim Erstellen. Das gab es schon vor der Änderung, Helga P-1 trifft aber auch diesen Weg. |

## Blocker/Major

### C-20: Sichtbare Verhaltensänderungen ohne Szenario

- **Warum falsch:** CLAUDE.md, Workflow 1, verlangt für jede Verhaltensänderung ein Szenario in `tests/e2e/features` oder eine Zeile `No scenario: <reason>`. Die Ausnahmen gelten für Zustände, die der E2E-Stack nicht herstellen kann. Alle drei Zustände kann er aber herstellen:
  - KI nicht verfügbar: Szenario «Rechnung ohne KI aus einer Datei erfassen».
  - Gutschrift über die Ersatzattrappe: «Werke Gutschrift».
  - Gemischte Kosten: «Lift Service und Reparatur», danach eine nicht umlagefähige Kategorie wählen.

  Der Step `sagt die Datei von {string} {string}` prüft mit `toContain` (`tests/e2e/steps/invoice-upload.steps.ts:166-168`). Die bestehenden Szenarien sehen deshalb weder die neue Zeile «Füllen Sie aus: Rechnungssteller, …» vor dem Erstellen noch das Fehlen von «Wählen Sie eine Kategorie.» bei einer Gutschrift. Auch das Verschwinden des Hinweises nach der Wahl von «Reparaturen» sehen sie nicht. Im Plan steht nur die Zeile «Test red (slice 4)» mit Unit-Tests, ohne «Scenario red» und ohne `No scenario`. Workflow 6 lässt eine Persona-Fundstelle zwar mit einem Test auf tieferer Ebene schliessen. Das ersetzt aber nicht das Szenario, das Workflow 1 für eine Verhaltensänderung verlangt. Und V-8 ist keine Persona-Fundstelle.
- **Wie zeigen, dass es fehlschlägt:** `toDoOf` auf den alten Stand zurücksetzen (zum Beispiel `byHand` ignorieren und die Prüfung auf `documentType` entfernen). `invoices.feature` bleibt dann grün, nur `invoice-upload.test.ts` wird rot.
- **Behebung (Vorschlag):** In «Rechnung ohne KI …» vor dem Erfassen einfügen: `Und sagt die Datei von "Elektro Blitz" "Füllen Sie aus: Rechnungssteller, Rechnungsdatum, Betrag, Beschreibung."`. Für die Gutschrift prüft eine Question den ganzen Hinweistext, mit positivem Anker auf dem Gutschrift-Satz. In «Rechnung mit Kosten, die nicht umlagefähig sind» die Kategorie «Reparaturen» wählen und danach prüfen, dass der Hinweis fehlt (Anker: ein anderer Text der Zeile). Alternativ für jeden Fall eine begründete Zeile `No scenario:`. Für jeden Fall «Scenario red» im Plan vermerken.

## Bestätigt durch Code und Test

- **C-11:** `const file = row.file` wird synchron gelesen. Das Flag `gone` im Cleanup übergeht ein spätes `.then`, also entsteht danach keine URL ohne Freigabe mehr. Selbst ausgeführt: `bunx vitest run` für `invoice-upload.test.ts`, `invoice-upload-endpoints.test.ts`, `invoice-pages.dom.test.ts` und `invoice-upload-dialog.dom.test.ts`: 127/127 grün, **Exit 0**, keine Unhandled Errors.
- **C-12:** Durch Code bestätigt. `{#if fileUrl}` rendert keinen `<button>` mit derselben testid mehr. `openFileLarge` wartet auf den Link. Zum Test siehe C-21.
- **C-13:** `supplierInvoice` legt die Huber-Rechnung (`{invoice}` von `invoice-detail`) mit Beleg, `deductedAmount` und `nonAllocableItems` über `POST /invoices` an. `belegSchema` nimmt die Felder an. «Hauswart» ist umlagefähig, der Hinweis-Alert wird also im Zustand `default` gerendert und von Axe und der Sprachprüfung gesehen. Dass die Zeilen grün sind, hat der Aufrufer gemeldet.
- **C-15:** `belegFor(billedInvoice, '2025-01.pdf')`: Der Löschdialog von `invoice-billed-detail` zeigt jetzt M-6. `seed.beleg` delegiert an `belegFor` und wird in `invoice-upload.steps.ts:119` weiter verwendet.
- **C-18:** `fieldsOf` wirft bei `null` einen `ValidationError` (400). Der Endpoint-Test ruft dafür `invoice = 'null'` auf und erwartet 400, ohne Backend-Aufruf. Einschränkung siehe C-24.
- **V-8:** Der Hinweis auf gemischte Kosten wird in `toDoOf` aus `hints.nonAllocableItems && values.isValidUtilityCost` abgeleitet. Ein Unit-Test schaltet `isValidUtilityCost` um. `notesOn` hat den Parameter `allocable` nicht mehr, es bleibt nichts Ungenutztes zurück. In `UploadRowNotes` folgt `toDoOf` auf `row.notes`, die Reihenfolge (Akonto vor gemischten Kosten) bleibt also.
- **Weber P-4:** `documentType` steht in der Zeile, `toDoOf` gibt bei Gutschrift und Mahnung `[]` zurück. Unit-Test für beide Typen. Der angepasste Test zur Mahnung erwartet nur noch den Mahnungssatz. `checkRow` schützt beim Erstellen weiterhin, falls jemand die Zeile trotzdem auswählt.
- **Helga P-1:** `withoutKi` setzt `byHand: true`, `withProposal` setzt `byHand: false` (erneutes Lesen). Der Unit-Test prüft die Liste und dass eine Angabe verschwindet, sobald sie ausgefüllt ist.
- **Marco P-7:** In `Button.svelte` steht `{@render children()}{newTab}`: zwei benachbarte Textknoten, im `inline-flex` also ein einziges anonymes Flex-Item. Das `<span>` ist entfernt. Den Text gibt es jetzt auch im `<button>`-Zweig, ein deaktivierter Button mit `target` hat ihn also auch. Kein Nutzer im Diff deaktiviert einen solchen Button (BuildingCard, SendDialog, InvoiceBeleg, UploadRowFields hinter `{#if fileUrl}`). Der DOM-Test prüft den Text der Textknoten ohne `.sr-only`.
- **Texte:** Es gibt keine neuen oder geänderten Message-Keys (`messages/*.json` sind nicht im Diff).
- **O-31** in `offene-punkte.md` deckt C-14 und Sven P-1/P-2 ab. Der Plan triagiert V-7, M-3, Anna P-10, C-16, C-17 und C-19 jeweils mit Begründung.
- Im Diff steht nichts, was nicht zur Anforderung gehört. Formatierung und Refactoring betreffen nur die geänderten Stellen.

## Nicht bestätigt

- **Selbst ausgeführt:** die vier oben genannten Vitest-Dateien (127 Tests, Exit 0).
- **Vom Aufrufer gemeldet, nicht selbst ausgeführt:**
  - `bunx vitest run` (157 Dateien, 2605 Tests, Exit 0)
  - `bun run lint`, `bun run check`, `bun run deepcheck:audit`
  - fallow im Commit-Hook
  - E2E chromium+api (148)
  - Axe- und Sprachzeilen (86 plus 8)
- **Nicht auf dem geprüften Commit gelaufen (laut Aufrufer):** E2E nach den letzten Änderungen an `Button` und `byHand`, `bun run test:coverage`, die Backend-Suite (zuletzt auf a09ae7f6).
- **Mit der neuen `Button`-Fassung ungeprüft:** ob Questions der Szenarien `buildings` und `statement-detail` den Linktext exakt lesen. Die Textknoten sind jetzt ohne `<span>` verbunden, Abstände können sich verschieben.
- **Nicht im Browser geprüft (E2E und Build nicht erlaubt):**
  - ob Label und «(öffnet in neuem Tab)» bei 390 px wirklich gemeinsam umbrechen (Marco P-7);
  - ob nirgends seitlich gescrollt werden muss.
- **Fachliche Richtigkeit** des Wegfalls aller Hinweise zum Ausfüllen bei einer Mahnung, auch des Hinweises auf gemischte Kosten: Sache von `fach-reviewer`.
