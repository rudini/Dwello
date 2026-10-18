# Code-Review #222, Runde 1

Gegenstand: Worktree `review-222-code`, Commit `4eff7e61`, `git diff origin/main 4eff7e61` (12 Dateien). Anforderung: Issue #222, «Decided (product owner)», Teile `invoices_upload_deducted`, `invoices_beleg_deducted`, drei Zeilen in `docs/design/i18n-begriffe.md`, zwei Szenarien in `tests/e2e/features/invoices.feature`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | implementation_plan.md:5-23 | Die Zeile `Skills: tdd, ponytail, ponytail-review` fehlt, obwohl der Slice Code ändert (`messages/*.json`, Tests). |
| C-2 | Minor | implementation_plan.md:7, UBIQUITOUS_LANGUAGE.md:71 | Laut Plan stehen die Glossareinträge «seit #244» im Glossar. Der Satz zu Variante A fehlt dort aber: Die Zeile sagt nur «die Akontorechnungen nicht zusätzlich» und nennt keine Ausnahme für abgerechnete Akontorechnungen. Damit widersprechen die neuen Hinweise im Moment dem Glossar. Die Änderung ist Sache des Produktverantwortlichen, aber im Plan fehlt ein Punkt dafür. Nach CLAUDE.md (Design-Regeln) gehört er unter «Blocked on me», und der Pull Request wird erst nach dieser Änderung gemergt. |
| C-3 | Nit | implementation_plan.md:14 | «open V-7, V-8 (Minor), V-10 (Nit) as issues» nennt keine Nummern. Passende offene Issues gibt es: #261, #262 und #263. |
| C-4 | Nit | implementation_plan.md:19 | Das Item nennt nur «Akontorechnung», der Diff fügt aber drei Zeilen ein (auch «Mahnung eines Rechnungsstellers» und «Auslesen»). Die geänderten Dateien sind im Plan nicht aufgeführt (Workflow 8). |
| C-5 | Nit | docs/design/i18n-begriffe.md:39 vs. :70 | Im Englischen heisst «Mahnung eines Rechnungsstellers» «payment reminder», das gleiche Wort wie «Zahlungserinnerung» an den Mieter (Zeile 70). Das entspricht dem bestehenden UI-Text (`invoices_upload_reminder`) und dem Vorschlag aus 222-fachreview-2 V-5. In der Tabelle sind die zwei Begriffe aber nicht unterschieden. |

Es gibt keine Blocker und keine Majors.

## Bestätigt

- **Texte wie entschieden:** Alle 8 Texte (`invoices_upload_deducted` und `invoices_beleg_deducted` in de/fr/it/en) habe ich per Skript mit dem Issue-Text verglichen (`gh api …/issues/222`). Nach dem Ersetzen von U+00A0 durch ein Leerzeichen sind alle identisch.
  - In fr `invoices_beleg_deducted` steht vor «:» U+00A0, kein U+0020 (wie in `i18n-begriffe.md` verlangt).
  - Apostrophe sind U+2019.
- **Szenarien:**
  - `invoices.feature:106-108` «Schlussrechnung mit abgezogenen Akontorechnungen» und `:162-167` «Der Hinweis auf abgezogene Akontorechnungen bleibt bei der Rechnung» erwarten den de-Text Wort für Wort.
  - Im Feature steht kein `@wip` mehr.
  - Die Steps sind unverändert. Im Plan stehen beide Szenarien als red (`Scenario red`, Zeilen 10 und 15).
- **Unit- und DOM-Tests:** `invoice-upload.test.ts:47,59` und `invoice-pages.dom.test.ts:879` prüfen den neuen de-Text. Im Plan steht `Test red` (Zeile 16).
- **i18n-begriffe:** Die drei Zeilen (Zeilen 38-40) stimmen mit den Wörtern überein, die die UI schon verwendet: lit/legge/reads, rappel/sollecito/payment reminder. Akontorechnung ist übersetzt wie entschieden.
- **Keine neuen Bildschirme oder Zustände:** Es ändern sich nur Texte bestehender Zustände, darum braucht es keine Einträge in `screens.json`, `accessibility.feature` oder `sprachen-bildschirme.feature`.
- **Umfang:**
  - Kein Backend, kein Prompt, keine Komponente geändert.
  - Kein Vertrag in `tests/contracts` betroffen.
  - Nichts ausserhalb der Anforderung: Die Fachreview-Berichte und der Plan gehören zum Workflow.
  - Begriff «Akontozahlungen» → «Akontorechnungen»: Die Szenarien heissen jetzt nach dem Glossarbegriff. In `tests/` und `src/` kommt das alte Wort nicht mehr vor; Treffer gibt es nur noch in alten Persona-Berichten.

## Nicht bestätigt

- Lint, deepcheck:audit, Vitest (invoice-upload, invoice-pages.dom, open-work: 93 bestanden) und `test:e2e:wip` (chromium, beide Szenarien, vor dem Entfernen von `@wip`): vom Aufrufer gemeldet. Den Vitest-Lauf konnte ich nicht wiederholen, weil der Zugriff auf `node_modules` (Symlink in den Arbeitsbaum des Aufrufers) durch eine Deny-Regel gesperrt ist.
- Den E2E-Lauf ohne `@wip` und die a11y- und Sprachbildschirme mit den längeren Texten (z.B. kein seitliches Scrollen bei 390 px) habe ich nicht gesehen. Der Aufrufer lässt sie vor dem Push laufen.
- Die Änderung am Glossar durch den Produktverantwortlichen (Variante A bei «Akontorechnung») liegt ausserhalb des Umfangs. Am Commit liegt sie nicht vor (`UBIQUITOUS_LANGUAGE.md:71`), siehe C-2.
