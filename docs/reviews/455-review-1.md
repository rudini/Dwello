# Code-Review #455 (mit #481, #482, #483), Runde 1

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/review-455-code` (detached, cd08fd80). Bereich: `git diff c09ec4fd cd08fd80` ohne `docs/reviews`, `ResultList.svelte` und die Listen-Routen. In `src/routes/invoices/+page.svelte` habe ich nur den Upload-Link geprüft.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/features/invoices.feature:112, :119, :127, :188, :198, :204; invoice-detail.feature:130, :138, :147, :151; invoice-edit.feature:23; invoice-new.feature:56 | Alle neuen und geänderten Szenarien tragen auf cd08fd80 noch `@wip`. Darunter sind zwei, die auf der Basis aktiv liefen («Schlussrechnung mit abgezogenen Akontorechnungen», «Der Hinweis auf abgezogene Akontorechnungen bleibt bei der Rechnung»). Sie fallen jetzt aus den Läufen heraus. |
| C-2 | Major | src/routes/invoices/InvoiceUploadRow.svelte:33-40, src/lib/invoice-upload.ts:126-129 | Der Vorschlag des Verteilschlüssels nach dem Hochladen ist ein Fehler aus #268, den der Benutzer sieht. Dafür gibt es kein Szenario in `tests/e2e/features`, obwohl der E2E-Stack den Fall herstellen kann. |
| C-3 | Minor | src/lib/ui/Dialog.svelte:86 | Steht der Fokus auf einem `select`, schliesst Escape keinen Dialog mehr, auch nicht, wenn die Liste des `select` zu ist. Das gilt für alle Dialoge der App. |
| C-4 | Minor | src/lib/ui/FileInput.svelte:50 | Der sichtbare Knopftext ist `aria-hidden`. Der zugängliche Name («Datei des Belegs», «Dateien hierher ziehen oder auswählen») enthält den sichtbaren Text «Datei auswählen» / «Dateien auswählen» nicht (WCAG 2.5.3 «Label in Name», Stufe A). Ein Nutzer mit Sprachsteuerung, der «Datei auswählen klicken» sagt, trifft das Feld nicht. |
| C-5 | Minor | src/lib/server/invoice.ts:105-110 | Die neue Weitergabe von `statements` im Mapper `statementPeriods` hat keinen Test. `src/__tests__/invoices.test.ts:218-226` prüft nur `billedIn`/`missedIn`. Ungeprüft bleiben auch die leere Liste, wenn die Anfrage scheitert, und der Weg zu `InvoiceFacts`. |
| C-6 | Minor | src/__tests__/invoice-upload-dialog.dom.test.ts:378-382 | Der Test liest die Antwort von `GET /invoices` (Liste), baut deren Hülle `{ invoices, total }` aber selbst. `tests/contracts` hat für die Liste keinen Vertrag; die Regel der Gotchas verlangt einen, wenn keiner da ist. |
| C-7 | Minor | UBIQUITOUS_LANGUAGE.md:81 | Die Glossarzeile «Akontorechnung» sagt noch «Der Betrag **einer** abgerechneten Akontorechnung … mit **ihr**». Die neuen UI-Texte sagen nach dem Entscheid zu #481 «der abgerechneten Akontorechnungen … mit ihnen». #481, «Done means», verlangt dafür eine Änderung durch den Product Owner. Der Product Owner hat nur bei #483 den Eintrag in Auftrag gegeben. Bis dahin widersprechen sich Glossar und Oberfläche, und der Pull Request kann #481 nicht schliessen. Das gehört unter «Blocked on me». |

## Blocker / Major

### C-1: Szenarien stehen noch unter `@wip`
- **Evidenz:** `grep -n "@wip" tests/e2e/features/invoice*.feature` auf cd08fd80 findet 12 Treffer, an den Zeilen der Tabelle. Commit cd08fd80 ändert die Features nur in ihren Texten, die Tags bleiben. Die Szenarien «Schlussrechnung mit abgezogenen Akontorechnungen» (invoices.feature:112) und «Der Hinweis auf abgezogene Akontorechnungen bleibt bei der Rechnung» (:188) hatten auf c09ec4fd kein `@wip`. Commit 6f16ab0f hat es ihnen gegeben.
- **Warum falsch:** Ein Szenario mit `@wip` läuft in `bun run test:e2e` nicht (CLAUDE.md, «Done means» und Workflow 1). Keine der Verhaltensänderungen von #455 ist damit abgenommen. Die zwei bisher aktiven Szenarien sind schwächer als vorher (Regel «gleiche Strenge wie vorher»). Dass der Aufrufer die Features «jetzt ohne @wip» laufen liess, ist im geprüften Commit nicht festgehalten.
- **Nachweis:** `bun run test:e2e -- tests/e2e/features/invoices.feature` lässt die genannten Szenarien aus. Der Grep oben zeigt sie.
- **Abhilfe:** Die `@wip`-Tags entfernen und die Features grün laufen lassen.

### C-2: Kein Szenario für den vorgeschlagenen Verteilschlüssel
- **Evidenz:** Den Vorschlag lösen `proposeKey` (src/lib/invoice-upload.ts:126-129), `keyFor` (InvoiceUploadDialog.svelte:58-70) und der Effekt in InvoiceUploadRow.svelte:33-40 aus. Tests gibt es nur darunter: invoice-upload.test.ts («Verteilschlüssel einer Datei») und invoice-upload-dialog.dom.test.ts:377-401. In `tests/e2e/features/invoices.feature` erwähnt kein Szenario den Verteilschlüssel nach dem Hochladen. Der Commit nennt auch kein `No scenario: <reason>`.
- **Warum falsch:** #455, «Decided» vom 2026-10-19, nennt den leeren Verteilschlüssel einen Fehler: Die Hochladefunktion soll den Schlüssel der Rechnungen derselben Kategorie im Gebäude vorschlagen. Für eine Fehlerbehebung, die der Benutzer sieht, verlangt CLAUDE.md, Workflow 1, ein Szenario. Der Stack kann den Zustand herstellen: eine Rechnung «Allgemeinstrom» in «Seeblick» mit einem anderen Schlüssel als dem Standard anlegen, «Werke Schlussrechnung» hochladen (der Stand-in kategorisiert sie) und den Schlüssel der Zeile prüfen.
- **Nachweis:** `grep -n -i "verteilschlüssel" tests/e2e/features/invoices.feature` findet nichts zum Hochladen.
- **Hinweis:** Auch die Behebung «Rechnungen hochladen tut direkt nach dem Laden nichts» (`href="?upload"`) hat kein Szenario. Dort genügt `No scenario: <reason>` im Pull Request, weil sich ein Klick vor der Hydration im E2E-Stack nicht zuverlässig herstellen lässt. Das fehlt bisher.

## Bestätigt (Code und Test)
- **Prompt (#262, Punkt 4):** `advance_invoice` ist im Prompt, in `DOCUMENT_TYPES` und im Typ `Extraction` (backend/src/config/llm.ts:268, :303, :326). Die Abgrenzung zur Ratenrechnung nach V-4 ist drin. Test: llm-extraction.test.ts:104-108. Der Stand-in erkennt «… Akontorechnung».
- **Akontorechnung beim Hochladen:** Sie ist nicht vorausgewählt (das galt schon auf der Basis, `preselected` prüft `documentType === 'invoice'`). Der Hinweis entspricht wörtlich dem Entscheid, mit dem Wortlaut von #482 Option A. Wählt der Liegenschaftsverwalter sie aus, kommen die üblichen To-dos (`toDoOf`, invoice-upload.ts:155-160). Tests: invoice-upload.test.ts, «wählt eine Akontorechnung nicht …» und «… ausgewählten Akontorechnung …».
- **Kurze Zeile mit Total, Regel als Hilfetext:** Der de-Text von `invoices_upload_deducted` entspricht wörtlich Punkt 6.1. Ohne gelesenes Total gibt es die Variante `_no_total` (V-5). Die Regel ist der Rest von #222 plus der Satz von Punkt 3, mit dem Wortlaut von #481. Die Zeile steht nach den Aufgaben (UploadRowNotes.svelte:18-19). Tests: invoice-upload.test.ts und invoice-upload-dialog.dom.test.ts:341-353.
- **Rechnungsseite und «Rechnung bearbeiten»:** `DeductedHint` steht beim Betrag (InvoiceFacts.svelte:45-47, InvoiceDataFields.svelte:132), nicht mehr in der Beleg-Karte (InvoiceBeleg.svelte:32-35). Die Texte von V-1 und V-2 entsprechen wörtlich dem Entscheid vom 2026-10-19. Tests: invoice-pages.dom.test.ts (Bearbeiten, Detail, Beleg-Karte ohne «Akontorechnungen»).
- **«In Abrechnungen enthalten» (#263):** Das Backend liefert jede Abrechnung, in der die Rechnung ist, mit Nummer und Status in jedem Status, «overdue» berechnet aus `listStatements`. Test: statement-invoices.pg.test.ts:181-192. Vertrag und api-specification sind nachgeführt. Die Seite zeigt immer eine Zeile mit verlinkten Einträgen oder «Keine». Tests: invoice-pages.dom.test.ts. en: `invoices_billed_title` und `invoices_beleg_billed` wie beschlossen. i18n-begriffe: «in a statement».
- **Punkt 2 (#276):** Der Satz steht wörtlich in `invoices_service_period_years` (de). fr/it/en sind sinngleich. Test: invoice-pages.dom.test.ts:603-606.
- **Ältere Beobachtungen aus #268**, je mit einem Test, der ohne die Änderung fehlschlägt:
  - eigener Dateiknopf: DOM-Tests im Upload und beim Beleg;
  - leerer Absatz: date-input.dom.test.ts:37-43;
  - Escape im `select`: invoice-upload-dialog.dom.test.ts:365-375;
  - Upload-Link vor der Hydration: invoice-pages.dom.test.ts:97-103;
  - Verteilschlüssel: siehe C-2.

  «Manuell» bleibt, wie der Product Owner entschieden hat.
- **#483:** Die Glossarzeile «Schlussrechnung» entspricht wörtlich dem Vorschlag, wie der Product Owner es in Auftrag gegeben hat. i18n-begriffe: facture finale / fattura finale / final invoice. In messages/*.json kommt keine andere Übersetzung vor.
- **Texte:** Alle neuen und geänderten Schlüssel stehen in allen vier `messages/*.json`.
- **Sicherheit:** `GET /api/invoices` läuft über den bestehenden Proxy mit Session. Neue mutierende Wege gibt es nicht.
- **a11y-Abdeckung:** Die Zustände `invoice-detail` und `invoice-edit` «default» zeigen den Hinweis beim Betrag; ihr Seed hat `deductedAmount` (tests/e2e/fixtures/screens.ts:60-64). `invoice-billed-detail` zeigt die verlinkten Abrechnungen, `upload-dialog` die kurze Zeile mit Regel. Neue Einträge in screens.json braucht es deshalb nicht.
- **Rot der neuen Tests, beurteilt durch Lesen:** Alle Unit-, DOM- und pg-Tests schlagen ohne die Änderung fehl. «Eine ausgewählte Akontorechnung erstellen» besteht auf der Basis, weil der Stand-in der Basis keine Akontorechnung kennt. Ohne die Änderung in `toDoOf` fehlt aber «Wählen Sie eine Kategorie.», und das Szenario wird rot. Das reicht.
- **Screenplay:** Die Steps rufen nur Tasks, Questions und den Seed auf. Die Questions geben Text zurück, Ja/Nein nur bei Sichtbarkeit und Auswahl.
- **Einfachheit (ponytail-review):** Nichts Unbenutztes, keine Kopie eines bestehenden Helfers. Lean already.

## Nicht bestätigt
- **Vom Aufrufer gemeldet, nicht selbst wiederholt:**
  - `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx fallow audit`;
  - `bunx vitest run` (3160 grün, 5 Timeouts);
  - Backend: `llm-extraction`, `statement-invoices.pg`, `api-contracts.pg`, `invoice-extraction.pg`;
  - E2E: Rot auf dem Basis-Build und der Lauf der Rechnungs-Features.

  Meinen Versuch `bunx vitest run` auf den betroffenen Dateien im Worktree bricht ab: `Cannot find package 'vitest'`, der Worktree hat keine `node_modules`. Installiert habe ich nichts.
- **`bun run llm:eval` vor und nach der Prompt-Änderung** (#455, «Done means»): Der Aufrufer meldet keinen Lauf. Laut backend/CLAUDE.md:18 misst `llm:eval` nur die Umlagefähigkeit («the invoice prompts have no cases yet»). Ob die echte KI eine Akontorechnung erkennt und eine Schlussrechnung weiter als `invoice` liest, zeigt deshalb kein Lauf. Der Pull Request muss `Refs #455` sagen und Modell und Werte nennen.
- **Accessibility- und Sprachen-Szenarien** (axe hell und dunkel, fr/it/en ohne Deutsch) auf den geänderten Zuständen: nicht gelaufen und nicht gemeldet.
- **`No scenario: <reason>` für den Upload-Link vor der Hydration:** kann erst im Pull Request stehen (siehe C-2).
- **Abschluss des Fachreviews** (CLAUDE.md, Workflow 1): `docs/reviews/455-fachreview-1.md` liegt ausserhalb meines Bereichs. Dass V-1, V-2, V-3, V-5 und V-6 umgesetzt sind, habe ich an den Texten bestätigt. Eine Folgerunde des fach-reviewer habe ich nicht gesucht.
