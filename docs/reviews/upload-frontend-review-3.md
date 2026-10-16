# Code-Review #217, Upload-Slices, Runde 5 (Delta)

Worktree: `review-upload-code5` (3b17d9fe). Bereich: `git diff be436c1d 3b17d9fe` (ein Commit, `fix(invoices): answer review round 4`).

Gelesen habe ich:
- alle Code-, Test-, Vertrags- und E2E-Dateien des Deltas;
- die vier `messages/*.json` an der geänderten Stelle;
- die neuen Plan-Zeilen der Session #217.

Die neuen Persona-Berichte (`*-rechnungen-hochladen-2.md`) und `upload-fachreview-3.md` sind Berichte, kein Code. Ich habe sie nur dort gelesen, wo der Plan einen Fix auf sie stützt (M-5, V-15, V-16, fehlende Kategorie).

## Stand der Befunde aus Runde 4

| ID | Stand | Beleg |
|----|-------|-------|
| C-29 | behoben | `implementation_plan.md:37`: `Scenario red (slice 3 …)` nennt je Szenario die rote Assertion. Darunter Gutschrift «checked true» und Beleg «shown false (download)». Der Schritt «öffnet der Beleg die (PDF\|JPG)-Datei» prüft jetzt auch `belegShown` (`invoice-upload.steps.ts:179`). |
| C-30 | weitgehend behoben | `implementation_plan.md:38` listet die Tests je Datei. Rest siehe C-40. |
| C-31 | behoben | `invoiceNumber: "R-1001"` steht in `tests/contracts/invoice.json`. Der Load-Test `invoices.test.ts:138` prüft die Zuordnung mit Daten aus dem Vertrag. `drift` toleriert `null` aus dem Backend. |
| C-32 | behoben | `fieldsOf` (`src/lib/server/invoice.ts:138-144`) wirft `ValidationError`, das gibt 400. Test `invoice-upload-endpoints.test.ts:64-67`, kein Aufruf des Backends. |
| C-33 | teilweise | Getestet sind jetzt der Fokus auf das erste fehlende Feld (`invoice-upload-dialog.dom.test.ts:256`) und die Absage des Backends beim Beleg (`invoice-pages.dom.test.ts:851`). Ungetestet bleibt `oncreated` mit den erstellten Rechnungen nach dem Verwerfen → C-39. |
| C-34 | Ablehnung angenommen | Die Begründung trägt: eine zusätzliche Anfrage pro Load ist billiger als eine zweite Variante von `invoiceChoices`. |
| C-35 | behoben | Der Kommentar nennt jetzt die Reihenfolge von «Prüfen Sie: …» (`invoice-upload.ts:103`). |
| C-36 | behoben | `missingIn` lässt selbst gefüllte Felder weg (`invoice-upload.ts:161-166`). Test «nennt ein selbst ausgefülltes Feld …». Ein ähnlicher Rest ist C-42. |
| C-37 | behoben | `backend/src/config/llm.ts:315`; `questions.ts:189,197`. |
| C-38 | behoben | `implementation_plan.md:23`: «C-19..C-26, C-28 …, C-27 open in #233». |

## Weitere Fixes im Delta

- **Fachreview M-5 / T-1:** «Originalrechnung» in allen vier Sprachen. Das stimmt mit `UBIQUITOUS_LANGUAGE.md:64` überein. Im fr und it passen Genus und Pronomen («la consulter», «consultarla»). Der DOM-Test ist angepasst.
- **Fachreview V-15:** `valuesOf` behält bei einer selbst gewählten Kategorie auch `isValidUtilityCost` (`invoice-upload.ts:156`). Test «behält mit der gewählten Kategorie …».
- **Fachreview V-16:** Der Titel des Szenarios ist geändert, die Schritte sind dieselben.
- **Persona Runde 2:** Eine fehlende Kategorie steht in «Prüfen Sie: …» (`invoice-upload.ts:173`). Das Label `buildings_category` gibt es in allen vier Sprachen. Test «nennt eine fehlende Kategorie …». Das Szenario hält die alte Assertion: «Elektro Blitz» hat eine sichere Kategorie.
- **Split von `withProposal` für fallow:** Das Verhalten ist gleich geblieben. Geprüft habe ich `read`, `chosen`, `typed` und `distributionKeyId` in derselben Reihenfolge wie vorher sowie `preselected` gleich der alten Bedingung.
- **Blob-Polyfill nach `helpers/dom.ts` verschoben:** Der neue Beleg-Test braucht ihn (`fileRefusal`). Das ist kein Umbau ohne Grund.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-39 | Minor | src/routes/invoices/InvoiceUploadDialog.svelte:151; src/__tests__/invoice-upload-dialog.dom.test.ts | Rest von C-33. Kein Test erstellt zuerst eine Rechnung, verwirft dann den Dialog und prüft, dass `oncreated` mit der erstellten Rechnung aufgerufen wird. Die Liste würde dann nicht aktualisiert. Der Plan meldet C-33 trotzdem als «fixed … (tests)». |
| C-40 | Minor | implementation_plan.md:38 | Der Plan sagt: «the duplicate-link and focus-after-partial-create tests were written after the code». Ein Rot durch Herausnehmen des Codes steht nicht dabei. Dasselbe gilt für die neuen Tests «Rechnungsnummer des Backends» (Load) und «400 bei ungültigem JSON». Ausserdem heisst der Fokus-Test «… wenn nichts erstellt wurde», nicht «after partial create». |
| C-41 | Nit | src/lib/invoice-upload.ts:130-133 | Zwei Kommentarblöcke stehen übereinander über `FORM_FIELD`. Der erste («The values the KI read …, V-15») gehört zu `valuesOf` drei Zeilen tiefer. |
| C-42 | Nit | src/lib/invoice-upload.ts:173, 247-251 | Gegenstück zu C-36 für `unsure`. Hat der Verwalter ein Feld selbst gefüllt und liest die KI es beim erneuten Lesen unsicher, gewinnt der eingetippte Wert. Das Feld sagt trotzdem «unsicher gelesen» und steht in «Prüfen Sie: …». |

Keine neuen Blocker oder Major.

## Nicht bestätigt

- **Selbst wiederholt** (`bunx vitest run`, alle grün):
  - `invoice-upload.test.ts` und `invoice-upload-dialog.dom.test.ts`: 34 Tests;
  - `invoice-pages.dom.test.ts`, `invoices.test.ts` und `invoice-upload-endpoints.test.ts`: 90 Tests.
- **Vom Aufrufer gemeldet, nicht wiederholt:**
  - `bun run test:coverage` (157 Dateien, über dem Floor), `bun run lint`, `bun run check`, `bun run deepcheck:audit`, `bunx fallow audit`;
  - Backend `bun run test` (635/0, darunter `api-contracts.pg.test.ts` mit dem neuen Feld `invoiceNumber`) und `type-check`;
  - E2E chromium+api auf den Rechnungs- und verwandten Features (74 bestanden);
  - Axe- und Sprachzeilen (48 bestanden).
- **Rot der Szenarien und Tests:** Was in `implementation_plan.md:37-38` steht, habe ich nicht nachgestellt. Für die drei neuen Tests in `invoice-upload.test.ts` (Kategorie, selbst gefülltes Feld, umlagefähig) habe ich die alte Logik von `withProposal` gelesen: Sie wären dort rot gewesen.
- **Inhalt der Fachtexte:** Den Satz «Bewahren Sie die Originalrechnung auf» und die Übersetzungen habe ich nur auf Begriff und Vollständigkeit geprüft. Inhaltlich sind sie Sache von `fach-reviewer` (Runde 3: M-5).
