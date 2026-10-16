# Code-Review #233, Runde 5 (Slice 4, Runde 2, Delta-Review)

Geprüft im Worktree `review-233-code5` auf Commit 8f562ea1, Delta `git diff 11168a4f 8f562ea1` (11 Dateien). Ich habe alle geänderten Dateien gelesen. Zusätzlich angesehen:

- `validateInvoice` (`src/lib/invoice.ts:36-50`)
- `checkRow`, `REQUIRED`, `FIELD_LABELS` und `FORM_FIELD` (`src/lib/invoice-upload.ts`)
- den Step «bei der Datei von {string} die Kategorie {string} wählt» (`tests/e2e/steps/invoice-upload.steps.ts:130`)
- `.prettierrc`

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-26 | Nit | src/lib/invoice-upload.ts:150 | `validateInvoice({ buildingId: 'chosen in the dialog', ...row.values })` steht wörtlich auch in `checkRow` (Zeile 250). `checkRow(row)` liefert dieselben Feldfehler (der zusätzliche Schlüssel `category` stört `wrong[formField(field)]` nicht). Damit hiesse die Regel «so, wie der Knopf zählt» auch im Code nur einmal. |
| C-27 | Nit | src/lib/server/invoice.ts:145; src/lib/invoice-upload.ts:151-152; src/__tests__/invoice-upload.test.ts:182 | Die neuen Zeilen überschreiten `printWidth: 100`, Prettier würde sie umbrechen. Die umliegenden Zeilen sind ebenso lang, die Abweichung passt also zum Stil der Datei. |

Es gibt keine Blocker und keine Major-Befunde.

## Blocker/Major

Keine.

## Frühere Befunde (C-20 bis C-25)

- **C-20 (Major): behoben.** Drei Szenarien prüfen jetzt die Verhaltensänderungen:
  - «Rechnung ohne KI …» prüft «Füllen Sie aus: Rechnungssteller, Rechnungsdatum, Betrag, Beschreibung.» vor dem Erfassen. Die Reihenfolge entspricht `FIELD_LABELS`.
  - «… nicht umlagefähig sind» wählt die Kategorie «Reparaturen» über einen vorhandenen Step und prüft dann, dass der Hinweis fehlt.
  - Die Gutschrift prüft, dass «Wählen Sie eine Kategorie.» fehlt.
  - Der neue Step `sagt die Datei von {string} nicht {string}` ruft nur Questions auf (Screenplay eingehalten) und setzt einen positiven Anker (`noteOnBeleg … not.toBeNull()`) vor die Negativprüfung.
  - Der Plan vermerkt «Scenario red» für alle drei Fälle, mit `invoice-upload.ts` von a09ae7f6.
- **C-21: behoben.** Der DOM-Test «zeigt den Link auf die grosse Datei erst, wenn die Datei bereit ist» prüft `null` vor `settle()` und danach eine `blob:`-URL. Der Plan vermerkt «red with a09ae7f6's row».
- **C-22: behoben.** Die Zeile «Slice 4 … Skills: tdd, ponytail, ponytail-review» steht im Plan.
- **C-23: behoben.** Der Doc-Kommentar von `toDoOf` nennt jetzt die Kosten, die nicht umlagefähig sind, an erster Stelle, dazu V-8.
- **C-24: behoben.** `Array.isArray(fields)` wird in `fieldsOf` abgewiesen. Der Endpoint-Test prüft `null` und `[]` auf 400, ohne Aufruf des Backends.
- **C-25:** bleibt offen und ist im Plan an #245 übergeben. Das ist triagiert wie verlangt.

## Fix zu Helga, Runde 2 (P-1)

`toDoOf` zählt eine Pflichtangabe jetzt über `validateInvoice` als erledigt, also genau wie `checkRow`, das für den Knopf «Erstellen» zählt:

- Leerzeichen werden getrimmt.
- Ein Betrag muss nach `plainAmount` grösser als 0 sein.

Optionale Felder bleiben bei «irgendetwas eingetragen». Der Unit-Test prüft «abc» als Betrag und Leerzeichen als Rechnungssteller und erwartet «Füllen Sie aus: Rechnungssteller, Betrag.». Den Fall «0» deckt dieselbe Bedingung `> 0` ab. Es gibt keine neuen Texte, `messages/*.json` sind unverändert.

Ein Szenario für diesen Fix fehlt, das werte ich nicht als Major. Die Änderung ist eine Präzisierung desselben Hinweises, der für den Fall «ohne KI» schon im Szenario steht. Workflow 6 lässt eine Persona-Fundstelle mit einem Test auf tieferer Ebene schliessen, und der Plan nennt das «Test red».

Der übrige Diff umfasst Dokumente: den Bericht zu Runde 4, den Persona-Bericht, die Workflow-Review W-1 bis W-7 und die Plan-Zeilen. Er ändert kein Verhalten und gehört zur Aufgabe. Es gibt keine fremden Änderungen und kein Umformatieren von Code, der nicht berührt wurde.

## Nicht bestätigt

- **Selbst ausgeführt:** `bunx vitest run` für `src/__tests__/invoice-upload.test.ts`, `src/__tests__/invoice-upload-endpoints.test.ts` und `src/__tests__/invoice-upload-dialog.dom.test.ts`: 59/59 grün.
- **Vom Aufrufer gemeldet:**
  - `bunx vitest run` (alle, Exit 0)
  - `bun run lint` und `bun run check`
  - die drei geänderten Szenarien: rot mit `invoice-upload.ts` von a09ae7f6, jetzt 3 grün (chromium)
- **Laut Aufrufer noch nicht abgeschlossen:** volles E2E, `bun run test:coverage`, Backend-Suite.
- **Nicht selbst gezeigt** (Dateien ändern ist mir nicht erlaubt): dass die Tests zu C-21, C-24 und Helga P-1 ohne den Fix rot sind. Dafür liegen nur die Plan-Zeilen vor.
- **Nicht gelaufen:** `deepcheck:audit` und fallow auf 8f562ea1. Der Aufrufer meldet sie für diesen Commit nicht.
