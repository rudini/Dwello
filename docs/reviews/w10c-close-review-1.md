# Abschliessendes Code-Review W10c (#363 / #91), Runde 1

Geprüft habe ich im Worktree `review-w10c-close` (675e5c5) Folgendes: den Merge a9bd54a (nur seine Konfliktauflösung und das Ergebnis gegen `c17ab22`), den Docs-Commit 67fdd3f und den Fix-Commit 675e5c5 (alle Code-, Test-, Text- und a11y-Dateien; die neuen Berichte unter `docs/` nur überflogen). Dazu kommt die Nachprüfung von C-1, C-2 und C-3 aus `docs/reviews/w10c-s3-review-1.md`. Ausserdem gelesen: `agreed-category.service.ts` (ganz), `toPdfData`, `calculation.service.ts:320`, `RentStep.svelte`, `ContractForm.svelte:263`, `ContractWizard.svelte` (`editField`), `Alert.svelte`, `helpers/dom.ts`, `screenplay/interactions.ts` (`Uncheck`, `FailRequests`), `screenplay/questions.ts` (`Count`), `AgreedCosts.svelte` (testids). `ponytail-review` ist angewendet.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | backend/src/services/contract.service.ts:392; tests/e2e/features/statement-agreed-costs.feature, contract-edit.feature | Für die Korrektur von S3-C-1 gibt es kein Szenario. Gemeint ist: Speichern im Bearbeiten lässt eine unbeantwortete Kategorie unbeantwortet, der Assistent fragt also weiter. Das ändert, was der Benutzer sieht, und der E2E-Stack kann es erzeugen. Belegt ist es nur durch den pg-Test |
| C-2 | Major | src/routes/contracts/AgreedCategories.svelte:47-58; tests/e2e/features/contract-edit.feature, contract-new.feature | Der neue Hinweis «Keine Nebenkosten vereinbart» (Persona P-1) hat kein Verhaltensszenario in `tests/e2e/features`. Er läuft nur als a11y- und Sprachzustand mit, und dort wird sein Text nicht geprüft |
| C-3 | Major | backend/src/services/statement-pdf.service.ts:139-142; statement-agreed-costs.feature:99-107 | Die Korrektur M-1 ändert das PDF: Mit einer Position ohne Kategorie fehlt der Satz «Abgerechnet sind nur …». Dazu gibt es weder ein Szenario noch `No scenario: <reason>`. Belegt ist es nur durch den Unit-Test |
| C-4 | Major | tests/a11y/screens.json:246-266; accessibility.feature; sprachen-bildschirme.feature | Der Hinweis erscheint auch im Schritt «Mietzins» von «Neuer Mietvertrag» (RentStep.svelte:116 gehört zu beiden Formularen). Der Zustand `agreed-costs-none` steht aber nur unter `contract-edit`. Die Regel verlangt ihn «once per place it appears (each page, each wizard step)» |
| C-5 | Minor | backend/src/services/agreed-category.service.ts:50-52 | Mit `answeredOnly` zählt jede Kategorie mit Zeile als «beantwortet», auch eine, die nicht mehr umlagefähig ist. Das Formular zeigt und schickt nur umlagefähige (`agreedCategoryIds` filtert, `agreeableCategories` auch). Ein Speichern setzt deshalb eine früher vereinbarte, inzwischen nicht umlagefähige Kategorie auf `agreed = false`. Vor 675e5c5 blieb sie unberührt. Wird sie wieder umlagefähig, gilt sie still als «nicht vereinbart». Kurze Behebung: `… IN (SELECT …) AND ${categories.isAllowedUtilityCost}` |
| C-6 | Minor | src/routes/contracts/AgreedCategories.svelte:28-29; ContractWizard.svelte:205-208 | Für S3-C-6 (Fokus mit «Ändern» auf die Feldgruppe `#agreedCosts`) gibt es keinen Test. Ohne `id="agreedCosts"` blieben alle Tests grün |
| C-7 | Nit | src/routes/contracts/AgreedCategories.svelte:49 | Gibt es keine umlagefähige Kategorie (`categories` leer, `agreed` `[]` im Bearbeiten), verlangt der Hinweis Häkchen, die es gar nicht gibt |
| C-8 | Nit | docs/nebenkostenabrechnung-anforderungen.md:26 | «nennt im PDF die vereinbarten, die es abrechnet»: Es fehlt der Zusatz aus M-1 (nur ohne Position ohne Kategorie) |
| C-9 | Nit | src/__tests__/agreed-categories.dom.test.ts:268-277 | `document.body.innerHTML = ''` mitten im Test. Die erste Komponente bleibt bis `afterEach` gemountet. Zwei Tests wären klarer |
| C-10 | Nit | src/__tests__/agreed-categories.dom.test.ts:258 | ponytail `shrink:` Der Test «kreuzt … an» prüft nur `c2` als angekreuzt. Er gehört zu S3-C-5 und ist nicht schädlich, er deckt den Weg «wieder ankreuzen» aber weiterhin nicht ab (S3-C-5 bleibt teilweise offen, wie gemeldet) |

ponytail-review: `answeredOnly` als Optionsobjekt mit einem Aufrufer ist vertretbar, weil `q` davor optional ist. Die zwei Targets `agreedCategoryBox` und `agreedCategoryBoxAt` mit `Count` und Schleife sind die kürzeste Form ohne neue Interaction. Sonst finde ich nichts zu kürzen. net: -0 lines possible. Lean already.

## Blocker / Major

### C-1: Die Korrektur «Speichern lässt unbeantwortete Kategorien offen» hat kein Szenario

**Warum falsch.** CLAUDE.md, Workflow 1, und dieser Auftrag verlangen für jede Verhaltensänderung, die der Benutzer sieht, ein Szenario in `tests/e2e/features` ohne `@wip`. Vor 675e5c5 hat jedes Speichern im Bearbeiten eine neue umlagefähige Kategorie als «nicht vereinbart» gespeichert, und der Assistent fragte nicht mehr. Jetzt fragt er weiter. Das sieht der Liegenschaftsverwalter im Assistenten. Im Diff der Features steht nur ein verschobener Kommentar (statement-agreed-costs.feature:89, 99). Der E2E-Stack kann den Zustand erzeugen, deshalb reicht `No scenario` nicht. Der Commit nennt auch keinen Grund.

**So zeigt man den Fehler.** Das Szenario folgt dem Muster von statement-agreed-costs.feature:31-36 und nutzt nur vorhandene Steps:
- Angenommen, es gibt die umlagefähige Kategorie «Treppenhausreinigung» mit einer Rechnung 2024 in «Rosenhof».
- Der Liegenschaftsverwalter trägt beim Mietvertrag von «Anna Keller» etwas ein (zum Beispiel «Lift» nicht vereinbart, Step aus contract-edit.feature:126) und speichert.
- Dann öffnet er die Einstellungen 2024. Dann fragt der Assistent, ob «Treppenhausreinigung» im Mietvertrag von «Anna Keller» vereinbart ist.

Auf 42a38f8 wäre das Szenario rot: keine Frage, nur «nicht vereinbart». Auf 675e5c5 ist es grün.

### C-2: Der Hinweis «Keine Nebenkosten vereinbart» hat kein Verhaltensszenario

**Warum falsch.** Es ist ein neuer Hinweis mit neuem Text, also ein sichtbares Verhalten (Persona P-1). Der Zustand `agreed-costs-none` in tests/e2e/tasks/accessibility.ts:252-256 wartet nur darauf, dass `contract-agreed-costs-none` sichtbar ist. Was der Hinweis sagt, prüft er nicht, und die a11y- und Sprachdateien sind keine Szenarien zum Verhalten. Was der Liegenschaftsverwalter will, steht in keiner Feature-Datei.

**So zeigt man den Fehler.** `grep -rn "Keine Nebenkosten vereinbart\|keine Nebenkosten" tests/e2e/features` findet nichts. Vorschlag für contract-edit.feature: «Wenn der Liegenschaftsverwalter beim Mietvertrag keine Nebenkosten als vereinbart einträgt, Dann warnt das Formular "Ohne Häkchen rechnet Dwello diesem Mieter keine Nebenkosten ab. …"». Die Question gibt den Text zurück. Ohne die Änderung ist das Szenario rot.

### C-3: Der PDF-Satz fehlt neben einer Position ohne Kategorie, und das zeigt kein Szenario

**Warum falsch.** M-1 ändert, was im PDF des Mieters steht. Der Satz «Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: …» fällt weg, sobald eine Position keine Kategorie hat (statement-pdf.service.ts:139-142). Der Grund: `calculation.service.ts:320` rechnet Gruppen ohne Kategorie jedem Mieter ab. Den Wegfall zeigt nur `statement-pdf-data.test.ts:84-92`. Ich habe ihn gelesen: Die Fixture hat in Zeile 54 eine Position ohne Kategorie, der Test wäre vor der Änderung also rot gewesen. Der E2E-Stack kann aber eine Rechnung ohne Kategorie anlegen (Arrange über die API). Deshalb gilt die Ausnahme «No scenario» nicht, und eine Begründung steht auch nirgends.

**So zeigt man den Fehler.** Das Szenario «Das PDF nennt die vereinbarten Nebenkosten» (statement-agreed-costs.feature:99) als Gegenstück mit «Und im Gebäude "Rosenhof" gibt es eine Rechnung ohne Kategorie über "100" Franken für 2024» (neuer Given-Step über die API), Dann «steht im PDF nicht "Abgerechnet sind nur"». Auf 42a38f8 wäre es rot.

Wenn der Aufrufer meint, dass der Satz unter Datenprüfung und Fachreview fällt und kein eigenes Szenario braucht, gehört die Begründung als `No scenario: <reason>` in den Pull Request. Dann ist dieser Befund nur noch Minor.

### C-4: Der Zustand `agreed-costs-none` fehlt bei «Neuer Mietvertrag»

**Warum falsch.** CLAUDE.md, Design-Regeln, «Process»: Ein neuer Zustand steht «once per place it appears (each page, each wizard step)» in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. `AgreedCategories` steckt in `RentStep.svelte:116`. RentStep nutzen der Assistent «Neuer Mietvertrag» (Schritt «Mietzins», mit anderem Hilfetext `contracts_agreed_costs_help`) und `ContractForm.svelte:263`. Der Zustand steht nur bei `contract-edit` (screens.json:298). Axe (hell und dunkel, drei Viewports) und die Sprachprüfung sehen den Hinweis im Assistenten nie.

**So zeigt man den Fehler.** `grep -n "agreed-costs-none" tests/a11y/screens.json` findet nur Zeile 43 (Bedeutung) und 298 (`contract-edit`), keine unter `contract-new` (Zeilen 246-266). Die Task in tasks/accessibility.ts:252 öffnet den Schritt «Mietzins» nicht. Für `contract-new` braucht sie den Weg dorthin, Muster `every-wizard-step` bzw. die Query `?tenant={tenant}&apartment={freeApartment}`.

## Nachprüfung Slice 3 (w10c-s3-review-1.md)

- **C-1 (Major): im Code behoben, das Szenario fehlt (jetzt C-1 oben).** Nur `updateContract` übergibt `answeredOnly: true` (contract.service.ts:392). Die Anlage bleibt bei `isAllowedUtilityCost`. Die Bedingung `answered OR agreed` schreibt nur Kategorien mit Zeile oder mit Häkchen. Eine Kategorie ohne Zeile, die nicht angekreuzt ist, bleibt also ohne Zeile und damit unbeantwortet. Der pg-Test (agreed-categories.pg.test.ts:99-101) wäre vorher rot gewesen: Ohne `answeredOnly` hätte das alte `WHERE isAllowedUtilityCost` «Dachreinigung» mit `false` eingefügt. Der Fall «speichert die vereinbarten Nebenkosten» (Z. 82-89) bleibt grün, weil «Lift» seit der Anlage eine Zeile hat. Die API-Spezifikation ist nachgeführt (docs/api-specification.md:96). Neue Lücke durch die Korrektur: C-5.
- **C-2 (Major): behoben.** `toSettings` beantwortet jetzt jeden anderen Pfad mit `[500]` (statement-wizard.dom.test.ts:236). Selbst ausgeführt: `bunx vitest run` mit statement-wizard.dom, agreed-categories.dom, categories, i18n und design-guard ergibt 5 Dateien, 504 Tests grün, Exit-Code 0, keine unbehandelten Fehler. Ausgabe: /tmp/claude-0/-home-user-Dwello/e60c0fa6-2a4d-5c91-b5be-bcf2af1f206b/scratchpad/w10c-close-vitest.txt
- **C-3 (Major): behoben.** `agreements-failed` steht in screens.json:45 (Bedeutung), :440 und :446 (Query wie `agreed-costs`), in accessibility.feature und in sprachen-bildschirme.feature. Die Task (tasks/accessibility.ts:258-263) besteht nur aus Interactions (`FailRequests.to`, `Navigate.reload`, `Wait.until`), und das Ziel `agreements-failed` ist der testid des Alerts (AgreedCosts.svelte:68). Der Zustand speichert nichts und lässt sich in jedem Viewport wiederholen.
- **C-6:** Die Feldgruppe hat `id="agreedCosts"` und `tabindex="-1"`, `editField` findet sie über `[id="…"]`. Dazu fehlt ein Test (C-6 oben).
- **C-9:** `buildings_categories_load_failed` («… Laden Sie die Seite neu.») steht in allen vier Sprachen. Der Test categories.test.ts:278-281 prüft den Text, und mit dem alten Schlüssel wäre er rot. `categories_load_failed` braucht `config/categories` weiter, es bleibt also nichts Ungenutztes zurück.
- **C-14, C-15:** behoben (Kommentare an der richtigen Stelle, `choose`).
- C-4, C-5 (teilweise), C-7, C-8, C-10 bis C-13 und C-16 bleiben wie gemeldet.

## Bestätigt

- **Merge a9bd54a, beide Seiten erhalten.** `git diff c17ab22 a9bd54a` für pdf.service.ts, fr.json und it.json zeigt nur Zeilen dieses Branches: `agreedCosts` in vier Sprachen, `agreedCosts?` im Typ, die `agreed`-Zeile vor `noteReceipts`, die neuen Schlüssel `contracts_agreed_costs_*` und `statements_agreement*`/`statements_not_agreed*` sowie `statements_finding_new` in der Fassung von #91. Die Texte von main sind erhalten:
  - fr: «terme de congé», «délai de congé» und `noteStock` «les stocks initial et final». `terme de résiliation` und `délai de résiliation` kommen 0-mal vor.
  - it: `notes: 'Osservazioni'`, «scadenza di disdetta» und «termine di preavviso». `termine di disdetta` und `prossimo termine` kommen nicht mehr vor. «la prossima» steht nach V-2 an allen sieben Stellen.
  - en: `noteReceipts` «supporting documents. To do so, please contact …», `fuelInvoices` und `fuelTotal` in der Fassung von main.
  - Die Auflösung übernimmt in `contracts_agreed_costs_help_edit` und `statements_finding_new` die Begriffe von main in den Text des Branches.
- **V-2 (it):** «per la prossima scadenza di disdetta» in `contracts_agreed_costs_help_edit` und `statements_finding_new` (it.json:722, 1011).
- **M-1:** Bedingung `agreedCategoryIds && lineItems.every(item => item.categoryId)` (statement-pdf.service.ts:139-142). Die Verwaltungspauschale ist keine Position, und Brennstoffpositionen tragen ihre Kategorie, deshalb unterdrückt die Bedingung den Satz nicht ohne Grund. Der Unit-Test deckt beide Richtungen ab, dazu den Fall vor #91 (`agreedCategoryIds: null`).
- **P-1:** Der Hinweis erscheint nur bei `agreed?.length === 0`, also nicht bei einem neuen Mietvertrag ohne Wahl (`undefined`, alle angekreuzt). `Alert tone="caution"` steht in einem `role="status"`, das immer da ist, wie beim Hinweis zur Verwaltungspauschale (RentStep.svelte:107-113). Es gibt nur Token-Klassen und eine Komponente aus `src/lib/ui`. Die Texte stehen in allen vier `messages/*.json`, auf Deutsch mit «Sie», ohne ß, mit Handlungsaufforderung. fr «aucuns frais accessoires» ist richtig (Pluralwort). Der DOM-Test (agreed-categories.dom.test.ts:268) wäre ohne den Hinweis rot gewesen (testid fehlt).
- **Screenplay:** Die a11y-Tasks nutzen nur Interactions und Questions (`Count`, `Uncheck`), und die neuen Targets stehen in `targets/accessibility.ts`. Ist kein Kästchen da, läuft `Wait.until` in eine Zeitüberschreitung, es gibt also kein falsches Grün.
- **Docs 67fdd3f:** Der Stand der Anforderungstabelle stimmt mit #91 und #363 überein, #368 und #369 sind verlinkt. Die Ausnahme M-1 fehlt (C-8).
- **Sicherheit:** Es gibt keinen neuen Endpunkt. Der PUT läuft über den bestehenden BFF mit XSRF, und das SQL bindet `contractId` als Parameter.
- **Nichts Fremdes im Diff:** Die Umbenennung, die verschobenen Kommentare und die it-Grammatik gehen auf gemeldete Befunde zurück.

## Nicht bestätigt

- Diese Prüfungen meldet der Aufrufer, wiederholt habe ich sie nicht: `bunx vitest run` voll (2842), `bun run check`, `bun run lint`, Backend `type-check`, Backend `bun test statement-pdf-data.test.ts agreed-categories.pg.test.ts`, Backend `bun run test` voll (847, 94.5 %, vor den letzten Korrekturen), `bun run test:coverage` (vor den letzten Korrekturen) und E2E chromium+api (177). Backend-Tests und E2E waren mir untersagt.
- Die a11y- und Sprachzeilen `agreed-costs-none` und `agreements-failed` habe ich nur gelesen. Ob ihr Lauf in den 177 E2E-Fällen enthalten war, hängt am Muster «contract-edit |statement-generate» und ist nur vom Aufrufer gemeldet.
- Ob `[500]` ohne Body in `fakeBff` überall die Fehlerpfade auslöst, habe ich nicht geprüft. Gesehen habe ich nur Exit-Code 0 ohne Fehler.
- Die neuen Berichte (personas/marco-w10c.md, weber-w10c.md, w10c-fachreview-2.md, w10c-datenpruefung-1.md) habe ich nicht inhaltlich geprüft. Offen laut Plan (implementation_plan.md:158): der zweite Lauf von Marco zum Hinweis und Runde 3 von `fach-reviewer` zu M-1.
- Ob der Pull Request für C-1, C-2 oder C-3 ein `No scenario: <reason>` enthalten wird, kann ich nicht sehen. Der Commit 675e5c5 und der Plan nennen keinen Grund.
