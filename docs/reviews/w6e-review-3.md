# Code-Review W6e, Runde 3 (Abschluss vor dem Push, #378): `ac0b026..8006072`

Worktree: `/tmp/claude-0/-home-user-Dwello/fb7498aa-16d8-576c-b542-2cec6868dbbd/scratchpad/review-w6e-cr3` (8006072, detached).

Geprüftes Delta (`git log --first-parent ac0b026..8006072`): 23e7d22 (nur Plan), b768990 (C-7, C-8), 7401768 (Workflow-Notiz, Plan) und der Merge 8006072 von origin/main (PR #385). Der Aufrufer nennt nur b768990 und den Merge. 23e7d22 und 7401768 habe ich trotzdem gelesen; sie ändern nur Doku.

Beim Merge habe ich nur geprüft, was diesen Branch betrifft: `src/routes/invoices`, `invoice-pages.dom.test.ts`, `invoice-new.feature`, `invoice-detail.feature`, `statements.steps.ts` und `implementation_plan.md`, jeweils gegen beide Eltern (7401768 und 93581d9).

Zusätzlich gelesen: `MissedWarning.svelte` (ganze Datei), `statements.steps.ts:30-40,140-172`, `invoice-detail.feature:60-90`, `messages/de.json` (`invoices_missed_text`, `statements_scope_period`, `statements_correct*`), `.claude/skills/ponytail-review/SKILL.md` und die `#120`-Verweise in `src`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | erledigt | `tests/e2e/features/invoice-new.feature:26`, `messages/de.json` `invoices_missed_text` | Nach dem Merge von #385 enthält die Warnung «Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung.». Das Szenario «Rechnung einer schon abgerechneten Periode erfassen» prüft genau diesen Satz. Auf 8b2c710 gibt es «Abrechnung berichtigen» in `messages/de.json` nicht (`git grep` ohne Treffer), also wäre der Schritt dort rot. Die Schaltfläche heisst so (`statements_correct`), der Weg stimmt also. |
| C-7 | erledigt | `tests/e2e/features/invoice-detail.feature:88`, `tests/e2e/steps/statements.steps.ts:165-171` | Der neue Schritt prüft den Umfangstext der Liste (`statements_scope_period`: «Abrechnungsperiode 01.01.JJJJ – 31.12.JJJJ»). Diesen Text zeigt die Liste nur mit den Parametern `periodStart`/`periodEnd`. Ohne die Periode im Link wäre der Schritt rot; der Aufrufer meldet, er habe das gesehen. Die Periode stimmt mit der Abrechnung des Seeds überein (`statements.steps.ts:39`, gleiches `inDays(0)`-Jahr). |
| C-8 | erledigt | `src/routes/invoices/MissedWarning.svelte:18,25`, `src/__tests__/invoice-pages.dom.test.ts:273-276` | Jeder Link hat `aria-describedby` auf den Satz seiner Periode; die IDs sind je Periode eindeutig, weil die Perioden der Schlüssel des `each` sind. Der DOM-Test ist auf ac0b026 rot: `getAttribute` gibt `null` zurück, `getElementById(null)!.textContent` wirft einen Fehler. |
| C-11 | Minor | Merge 8006072: `tests/e2e/features/invoice-new.feature:26`, `implementation_plan.md:18` | Der Merge-Commit enthält eigene Änderungen, die in keinem Elternteil stehen (`git diff 7401768 8006072` und `git diff 93581d9 8006072` zeigen beide die Zeile): die neue Szenariozeile zu C-1 und das Abhaken im Plan. Inhaltlich stimmen beide. Aber `git log -p` und Reviews über die erste Elternlinie sehen sie nicht. Besser wäre ein eigener Commit nach dem Merge. Nicht blockierend, weil diese Runde sie geprüft hat. |
| C-12 | Nit | `implementation_plan.md:20` | «PR `Fixes #378` (or `Refs #378`, see above)»: Der Eintrag darüber (Zeile 18) nennt die Alternative `Refs #378` nicht mehr, und mit dem Merge von #385 ist sie ohnehin hinfällig. Kürzer und richtig wäre «PR `Fixes #378`, CI, merge». |
| C-13 | Nit | `tests/e2e/steps/statements.steps.ts:165-171` | Der neue Schritt prüft nur die Periode, nicht das Gebäude: Der Umfangstext nennt kein Gebäude (`statements_scope_period`), und im Szenario gibt es nur «Seeblick». Den Gebäudefilter hält nur der DOM-Test fest (`invoice-pages.dom.test.ts:272`, `href`). Für C-7 reicht das, weil es dort um die Periode ging. |

Die Merge-Kombination ist korrekt:

- `MissedWarning.svelte` hat beide Seiten. Von main fehlt die Markierung `TODO(fachlich prüfen, #120)`; vom Branch kommen `id`/`aria-describedby` und der Link. In `src` gibt es keinen weiteren Marker `TODO(... #120)`, nur Kommentare von #385.
- In `invoice-pages.dom.test.ts` übernehmen die drei festgehaltenen Warnungstexte (Zeilen ~294, ~309, ~781) den Wortlaut von main. Die Tests dieses Branches (Link, `aria-describedby`, Speichern-Fluss) bleiben unverändert erhalten (`git diff 93581d9 8006072` zeigt nur die Branch-Seite).

Ponytail-Review des Deltas: Der neue Schritt neben dem vorhandenen `… der Abrechnungsperiode {string} zeigt` ist nötig, weil die Periode vom laufenden Jahr abhängt und in Gherkin nicht fest stehen kann. `aria-describedby` ist die kürzeste Lösung für C-8. `Lean already. Ship.`

Es sind keine Blocker oder Majors offen.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run src/__tests__/invoice-pages.dom.test.ts src/__tests__/open-work.test.ts src/__tests__/design-guard.test.ts` (478 passed) sowie E2E chromium für invoice-new, invoice-edit, invoice-detail und statement-generate mit den axe- und Sprachzeilen der Rechnungsbildschirme (84 passed): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Rot-Sehen von C-7 (Periode für einen Lauf aus dem Link genommen): vom Aufrufer gemeldet. Durch Lesen bestätigt, dass der Schritt ohne die Periodenparameter fehlschlägt. C-1 und C-8 sind nur durch Lesen geprüft (siehe Tabelle).
- Die Anforderung nennt «versendet oder bezahlt». Der Text von #385 sagt nur «Versendete Abrechnungen». Das ist der Wortlaut, den #358 entschieden hat, und dieser Branch ändert ihn nicht. Ob bezahlte Abrechnungen sich berichtigen lassen, sehe ich nur an den Texten `statements_correct_paid`/`_refunded`; die Backend-Regel habe ich nicht geprüft.
- Die übrigen Dateien des Merges (#385, Backend, Statement-Seiten, a11y) gehören nicht zu diesem Branch und sind nicht geprüft.
- Weiter offen aus Runde 2, im Delta nicht behandelt: C-5 (Minor), C-9 und C-10 (Nit).
