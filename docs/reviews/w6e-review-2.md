# Code-Review W6e, Runde 2 (#378), `git diff 7ba0b0f ac0b026`

Worktree: `/tmp/claude-0/-home-user-Dwello/fb7498aa-16d8-576c-b542-2cec6868dbbd/scratchpad/review-w6e-cr2` (ac0b026, detached). Alle 13 geänderten Dateien des Deltas gelesen, dazu `src/routes/statements/+page.server.ts`, `backend/src/services/statement.service.ts:105-118` (Filter `periodStart`/`periodEnd`), `backend/src/services/statement-invoices.service.ts:51-74` (`missedIn`), `src/__tests__/helpers/dom.ts`, `tests/e2e/steps/common.steps.ts:20-23`, `tests/e2e/steps/statements.steps.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major (offen) | `messages/de.json` `invoices_missed_text` (unverändert), `implementation_plan.md:17` | Weiter nicht erfüllt: Für versendete oder bezahlte Abrechnungen schickt die Warnung den Verwalter «ausserhalb von Dwello», nicht zu «Abrechnung berichtigen». PR #385 ist noch offen und nicht gemergt (`gh api repos/rudini/Dwello/pulls/385`: `open`, `false`). Der Plan nennt immer noch ohne Bedingung «PR `Fixes #378`». Den Weg (erst `main` nach #385 mergen, sonst `Refs #378`) muss der Plan festhalten, und das Szenario muss danach «Abrechnung berichtigen» prüfen. |
| C-2 | erledigt | `src/routes/invoices/new/+page.svelte:118`, `src/__tests__/invoice-pages.dom.test.ts:609-627` | Mit `returnTo` geht es ohne Prüfung zurück in den Assistenten. Der Test gibt ein nicht leeres `missedIn` zurück und erwartet `/statements/generate`: auf 7ba0b0f rot (dort `/invoices/i9`). |
| C-3 | erledigt | `+page.svelte:112-115`, `invoice-pages.dom.test.ts:656-667` | `saving = false` nur noch im Fehlerzweig. Der Test lässt den GET hängen und erwartet einen gesperrten Knopf: auf 7ba0b0f rot. |
| C-4 | erledigt | `+page.svelte:122`, `invoice-pages.dom.test.ts:645-654` | Schlägt der GET fehl (500), öffnet sich die Rechnungsseite. Die lädt `missedIn` selbst (`[id]/+page.server.ts` über `statementPeriods`). Der Test ist auf 7ba0b0f rot (dort Rückkehr zu `back`). |
| C-5 | Minor (bleibt) | `tests/e2e/features/invoice-edit.feature` | Keine Änderung, die Begründung des Aufrufers ist akzeptiert (Bearbeiten landet auf der Detailseite, `[id]/edit/+page.svelte:97`). |
| C-6 | erledigt | `implementation_plan.md:4-5` | Leerzeile entfernt. |
| C-7 | Minor | `tests/e2e/features/invoice-detail.feature:87` | Das neue Szenario prüft nach dem Klick nur den Seitentitel «Nebenkostenabrechnungen». Es bliebe grün, wenn der Link auf das ungefilterte `/statements` zeigte. Nur der DOM-Test (`invoice-pages.dom.test.ts:265-273`) hält Gebäude und Periode fest. Die Steps dafür gibt es schon: `erfährt der Liegenschaftsverwalter, dass die Liste nur die Abrechnungen der Abrechnungsperiode {string} zeigt` (`statements.steps.ts:159-164`) oder `sieht der Liegenschaftsverwalter die Abrechnung von {string} mit dem Status {string}`. Einer davon würde die Antwort des Systems zeigen. |
| C-8 | Minor | `src/routes/invoices/MissedWarning.svelte:22-28` | Fehlt die Rechnung in mehreren Perioden, haben alle Links denselben Namen («Abrechnungen von Seeblick ansehen»), führen aber zu verschiedenen Zielen. In der Linkliste eines Screenreaders sind sie nicht zu unterscheiden, im Text nur über den Absatz davor. Ein Name mit Periode oder `aria-describedby` auf den Periodensatz wäre eindeutig. axe meldet das standardmässig nicht. |
| C-9 | Nit | `MissedWarning.svelte:12,27` | `buildingName?` und `?? ''` decken einen Fall ab, den `toInvoice` nie liefert (`src/lib/server/invoice.ts:84`: immer ein String). Das folgt nur aus dem optionalen Feld in `InvoiceWithDetails` und ist für die Typprüfung nötig. Unschädlich. |
| C-10 | Nit | `src/routes/invoices/[id]/edit/+page.svelte:115` | Auf der Bearbeiten-Seite führt der neue Link ohne Rückfrage vom Formular weg. Ungespeicherte Änderungen gehen verloren (dort gibt es nur den Hinweis `invoices_unsaved`, kein `beforeNavigate`). Das gilt für die übrigen Links der Seite schon heute. |

Ponytail-Review des Deltas: `Lean already. Ship.` Der Link übernimmt Muster und Klassen aus `PreviewChecks.svelte:108-111`, der Text ist der bestehende `statements_view_of` (in allen vier `messages/*.json`, Zeile 1184). Die Liste filtert über die vorhandenen URL-Parameter (`statements/+page.server.ts:30-48`). Die Perioden aus `missedIn` sind genau die Perioden der Abrechnungen (`statement-invoices.service.ts:62`), der Backend-Filter `gte(periodStart)`/`lte(periodEnd)` trifft sie also.

## C-1 (Major): «Abrechnung berichtigen» fehlt weiterhin

Warum falsch: Die Anforderung verlangt für versendete oder bezahlte Abrechnungen den Weg «Abrechnung berichtigen». Auf ac0b026 gibt es diesen Text und diese Funktion nicht. Die Warnung nennt weiter die Korrektur ausserhalb von Dwello. Der neue Link führt zur gefilterten Liste, aber nicht zu einer Berichtigung. Der vom Aufrufer genannte Weg (nach #385 `main` mergen, sonst `Refs #378`) steht nirgends im Branch. `implementation_plan.md:17` sagt weiter «PR `Fixes #378`, CI, merge». Wird so gemergt, schliesst der PR #378, ohne dass die Zeile erfüllt ist.

Wie zeigen: Im Szenario «Rechnung einer schon abgerechneten Periode erfassen» (oder im neuen Szenario in `invoice-detail.feature`) einen Schritt `warnt die Rechnung "Abrechnung berichtigen"` ergänzen. Auf ac0b026 ist er rot.

Lösung: Den Plan-Eintrag an die Bedingung knüpfen (Merge von #385 und Prüfung im Szenario, sonst `Refs #378` und Eintrag unter «Blocked on me»). Der Befund bleibt offen, bis eine der beiden Bedingungen gilt. Er wird nicht durch neuen Code beantwortet, sondern durch den Weg zum Merge.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/invoice-pages.dom.test.ts` (73 passed), E2E chromium für invoice-new, invoice-edit und invoice-detail sowie die axe- und Sprachzeilen von `invoice-late-detail` (30 passed): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Rot-Sehen: nur durch Lesen geprüft. Die drei geänderten oder neuen DOM-Tests zu C-2, C-3 und C-4 sowie der Link-Test fallen auf 7ba0b0f (siehe Tabelle). Das neue Szenario fällt dort am fehlenden `invoice-missed-statements-link`. Nichts davon ausgeführt.
- Kein neuer Bildschirm und kein neuer Zustand. Der Link liegt in der bestehenden Warnung des Zustands `invoice-late-detail`, den axe nach Angabe des Aufrufers erneut geprüft hat. Für die Bearbeiten-Seite mit Warnung habe ich nicht nachgesehen, ob ein a11y-Zustand sie abdeckt.
- Personas: Das Delta beantwortet Anna P-2 und Marco P-1 (Link auf Gebäude und Periode). Anna P-1 (Übersicht ohne Hinweis, Major) und Marco P-2 (Text nennt nicht den vorliegenden Fall, Major) behandelt das Delta nicht. Weder Plan noch Commit sagen, ob sie zu #385, zu einem Issue oder unter «Blocked on me» gehen. Die Triage liegt beim Aufrufer, ich habe sie nicht bewertet.
- Die gefilterte Liste zeigt alle Abrechnungen des Gebäudes in der Periode, auch solche, die die Rechnung schon enthalten (z. B. später erstellte). Der Linktext behauptet nichts anderes. Ob das für den Verwalter verwirrt, haben die Personas nicht geprüft.
