# Code-Review W10c, Slice 3 und Korrekturen aus Slice 2 (#363 / #91), Runde 1

Geprüft: `git diff acb9da6 42a38f8` (ein Commit, 51 Dateien) im Worktree `review-w10c-s3-code`. Gelesen habe ich alle geänderten Dateien. Ausserdem: `Checkbox.svelte`, `ContractWizard.svelte` (Entwurf, Speichern), `ContractForm.svelte` (Speichern), `contract-wizard.ts` (`startValues`), `backend/src/routes/contracts.ts`, `agreed-category.service.ts`, `StatementWizard.svelte` (`submitStep`, `showErrors`), die E2E-Tasks und -Targets zu Vertrag und Assistent, `docs/reviews/w10c-s2-review-1.md` und `docs/reviews/w10c-fachreview-1.md` (V-6, V-7, Antwort 1). `ponytail-review` ist angewendet.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | src/lib/contract-form.ts:80, 140; src/routes/contracts/ContractForm.svelte:141; backend/src/services/agreed-category.service.ts:41-49 | «Mietvertrag bearbeiten» schickt `agreedCategoryIds` bei jedem Speichern mit, auch wenn kein Kästchen geändert wurde. Jede noch unbeantwortete umlagefähige Kategorie wird damit «nicht vereinbart». Die Frage in Schritt 3 erscheint für sie nie mehr, und Dwello rechnet sie nicht ab |
| C-2 | Major | src/__tests__/statement-wizard.dom.test.ts:236 | `fakeBff` antwortet in `toSettings` auf jeden anderen Pfad mit `{}`. BuildingStep und FeeNotAgreed werfen dann 15 unbehandelte Rejections. `bunx vitest run src/__tests__/statement-wizard.dom.test.ts` endet mit Exit-Code 1, CI ist rot |
| C-3 | Major | tests/a11y/screens.json:431-441; accessibility.feature:140; sprachen-bildschirme.feature:141 | Der neue Zustand «Vereinbarte Nebenkosten nicht geprüft» (Alert mit «Erneut versuchen», Korrektur zu C-1 aus Slice 2) fehlt in screens.json, in der a11y-Prüfung und in der Sprachprüfung. Weder axe noch die Sprachprüfung sehen ihn oder `statements_agreements_failed_*` / `_retry` in fr/it/en |
| C-4 | Minor | src/lib/contract-form.ts:80 | Dass das Bearbeiten die gespeicherte Liste zeigt, prüft kein Test. Ohne `agreedCategoryIds: contract.agreedCategoryIds` bleiben alle Tests grün (das E2E-Szenario entfernt nur ein Häkchen). Ein Speichern hakte dann jede «nicht vereinbarte» Kategorie wieder als vereinbart an |
| C-5 | Minor | src/routes/contracts/AgreedCategories.svelte:17-23 | Für `tick` und die Bindung über Funktionen gibt es keinen DOM-Test. Nur E2E entfernt ein Häkchen. Den Weg «wieder ankreuzen» (`on ? [...list, id]`) prüft kein Test |
| C-6 | Minor | src/lib/contract-wizard.ts:167; ContractWizard.svelte:206-209 | «Ändern» bei «Vereinbarte Nebenkosten» öffnet Schritt 4. Es gibt aber kein Element mit `id`/`name` `agreedCosts`, deshalb bleibt der Fokus auf der Überschrift statt auf der Feldgruppe. Bei den anderen Zeilen kommt er auf das Feld |
| C-7 | Minor | src/routes/statements/generate/AgreedCosts.svelte:66-73 | «Erneut versuchen» verschwindet beim Klick (`status = 'loading'`), und der Fokus fällt auf `body`. Muster im Repo: `retried()` in src/routes/contracts/new/ContractsUnknown.svelte:6 |
| C-8 | Minor | src/__tests__/agreed-costs.dom.test.ts:170-187 | Dass «Weiter» während des Ladens sperrt (`status !== 'loaded'` vor der Antwort), zeigt kein Test. Der Test prüft `blocking` erst nach `settle()`, also mit schon geladenen Fragen. Setzt man den Startwert auf `'loaded'`, bleibt alles grün |
| C-9 | Minor | src/lib/server/category.ts:40 | `categories_load_failed` («Fehler beim Laden der Kategorien») sagt nicht, was zu tun ist (Copy-Regel). `buildings_categories_load_failed` («… Laden Sie die Seite neu.») gibt es schon |
| C-10 | Minor | src/lib/contract-wizard.ts:176-192; ContractWizard.svelte:117-130 | Entwurf: Wird eine Kategorie nach dem Entwurf erfasst, ist sie nicht angekreuzt und wird als «nicht vereinbart» gespeichert, ohne Hinweis. Bei einem frischen Mietvertrag wäre sie angekreuzt. Eine inzwischen gelöschte id lässt das Backend weg, das ist unschädlich |
| C-11 | Minor | tests/e2e/features/contract-new.feature:142-151 | Beide Szenarien zum neuen Mietvertrag prüfen nur «Prüfen». Ob der gespeicherte Mietvertrag die Liste hat, zeigt erst der Unit-Test von `contractBody` mit den Backend-Tests, nicht der Weg durch den Assistenten |
| C-12 | Nit | src/lib/contract-wizard.ts:102 | ponytail `yagni:` Der Standardwert `categories = []` dient nur dem Test mit drei Argumenten (contract-wizard.test.ts:94). Den Parameter zur Pflicht machen und im Test `[]` übergeben |
| C-13 | Nit | src/__tests__/contract-form.test.ts:184 | Eine unveränderte Zeile (`it('sendet die Verwaltungspauschale …`) ist auf zwei Tabs eingerückt worden, das ist eine fremde Formatierung |
| C-14 | Nit | tests/e2e/features/statement-agreed-costs.feature:89-90; tests/e2e/tasks/accessibility.ts:250-252 | Kommentare stehen beim falschen Element: «M-2 … PDF» über dem neuen Szenario, und der Kommentar von `agreed-costs` steht jetzt über `agreement-save-failed` |
| C-15 | Nit | src/routes/contracts/AgreedCategories.svelte:18 | Der Name `tick` erinnert an Sveltes `tick()`. `choose` oder `toggle` wäre klarer |
| C-16 | Nit | src/lib/server/category.ts:39 | `?limit=100`: Mehr Kategorien würden beim Bearbeiten als «nicht vereinbart» gespeichert. Das Muster gibt es schon an drei anderen Stellen, für unter 50 Wohnungen ist es kaum realistisch |
| S2-C-3 | Minor | AgreementQuestion.svelte:29-41 | aus Runde 1 von Slice 2, unverändert (wie vom Aufrufer gemeldet) |
| S2-C-4 | Minor | AgreementQuestion.svelte:52-58 | aus Runde 1, unverändert |
| S2-C-8 | Minor | src/__tests__/statement-generation.test.ts:293-321 | aus Runde 1, unverändert |
| S2-C-10 | Nit | backend/src/__tests__/agreed-categories.pg.test.ts:216,272 | aus Runde 1, unverändert |
| S2-C-11 | Nit | AgreementQuestion.svelte:56-58 | aus Runde 1, unverändert |
| S2-C-12 | Nit | tests/e2e/steps/agreed-costs.steps.ts:34-46 | aus Runde 1, unverändert |

ponytail-review: `contract-wizard.ts:L102: yagni: Standardwert für Tests. Pflichtparameter.` (C-12). `api-proxy.ts` ist jetzt schlank (C-9 aus Slice 2 erledigt). Sonst gibt es nichts zu kürzen. net: -0 lines possible (eine Signatur).

## Blocker / Major

### C-1: Jedes Speichern im Bearbeiten beantwortet offene Kategorien mit «nicht vereinbart»

**Warum falsch.** Die Anforderung lautet: «Without a choice the form sends no list … a choice sends `agreedCategoryIds`». Im Bearbeiten ist aber immer eine Liste da. `initialContractValues` übernimmt `contract.agreedCategoryIds` (contract-form.ts:80), und der GET liefert sie immer, als Array (backend/src/routes/contracts.ts:115). `contractBody` schickt sie deshalb bei jedem PUT mit (contract-form.ts:140, ContractForm.svelte:141), auch wenn der Liegenschaftsverwalter nur die Nettomiete oder eine Notiz ändert. `setAgreedCategories` schreibt dann für jede andere umlagefähige Kategorie `agreed = false` (agreed-category.service.ts:41-49). Das trifft auch eine Kategorie, die nach dem Erfassen des Mietvertrags angelegt wurde und noch unbeantwortet ist. Die Fachreview bestätigt drei Zustände (w10c-fachreview-1.md, Antwort 1: vereinbart, nicht vereinbart, unbeantwortet), und Slice 2 fragt gerade nach den unbeantworteten. Nach einem beliebigen Speichern fragt der Assistent nicht mehr. Er nennt die Kategorie nur noch unter «Nicht vereinbarte Nebenkosten», und der Vermieter trägt ihre Kosten, ohne je gefragt worden zu sein. Im Formular sieht eine unbeantwortete Kategorie genau aus wie eine nicht vereinbarte (AgreedCategories.svelte:17), der Liegenschaftsverwalter kann den Unterschied also nicht erkennen.

**So zeigt man den Fehler.**
- Unit: `contractBody(initialContractValues(contract))` mit `tests/contracts/contract.json` enthält `agreedCategoryIds`, obwohl nichts gewählt wurde.
- E2E (Muster aus statement-agreed-costs.feature:57): «Treppenhausreinigung» anlegen, mit einer Rechnung 2024 in «Rosenhof». Dann im Mietvertrag von Anna Keller nur die Nettomiete ändern und speichern. Danach die Einstellungen 2024 öffnen: Es kommt keine Frage nach «Treppenhausreinigung», nur der Hinweis «nicht vereinbart».

**Behebung (Vorschlag).** Das Bearbeiten schickt die Liste nur, wenn ein Kästchen geändert wurde, zum Beispiel mit einem Vergleich zur geladenen Liste oder einem Merker in AgreedCategories. Dazu ein Test, der zuerst rot ist. Ob eine unbeantwortete Kategorie im Formular sichtbar als «noch nicht angegeben» erscheinen soll, entscheidet der Product Owner, falls nötig mit einem Issue.

### C-2: Die Vitest-Suite endet rot (unbehandelte Rejections)

**Warum falsch.** Die neue Zeile in `toSettings` (statement-wizard.dom.test.ts:236) beantwortet jede Anfrage ausser `/statements/agreements` mit `200 {}`. Vorher schlug `fetch` mit einer relativen URL fehl, und `api` lieferte `{ error }`. Jetzt bekommen BuildingStep.svelte:37 (`data.invoices is not iterable`), BuildingStep.svelte:48 (`data.map`) und FeeNotAgreed.svelte:20 (`data?.flatMap`) ein Objekt statt einer Liste und werfen. Vitest meldet «15 errors» und endet mit Exit-Code 1, auch wenn alle 182 Tests der Datei grün sind. «`bunx vitest run` all pass» trifft auf 42a38f8 nicht zu.

**So zeigt man den Fehler.** `bunx vitest run src/__tests__/statement-wizard.dom.test.ts; echo $?` gibt `1` aus und zeigt «Vitest caught 15 unhandled errors». Ich habe es auf 42a38f8 ausgeführt.

**Behebung.** In `toSettings` nur `/statements/agreements` mit `[]` beantworten und den Rest wie bisher fehlschlagen lassen (z. B. `[500, {}]`), oder jedem Pfad eine passende Antwort aus `tests/contracts` geben.

### C-3: Der Zustand «nicht geprüft» hat keine a11y- und keine Sprachzeile

**Warum falsch.** CLAUDE.md, Design-Regeln, «Process»: Jeder neue Zustand kommt in `screens.json` (mit `stateMeanings`), in `accessibility.feature` und in `sprachen-bildschirme.feature`. Die Korrektur von C-1 (Slice 2) bringt einen neuen Zustand: den Alert `agreements-failed` mit «Erneut versuchen» (AgreedCosts.svelte:66-76). Neu ist nur `agreement-save-failed` (screens.json:43, 435). Das E2E-Szenario prüft den deutschen Text, aber axe (hell und dunkel, drei Viewports) und die Prüfung auf Deutsch in fr/it/en laufen nie über ihn. Auch die Notiz während des Ladens wird in keinem Zustand angehalten. Sie ist flüchtig, deshalb ist sie hier nicht Teil des Befunds.

**So zeigt man den Fehler.** `grep -n "agreements-failed\|agreement-check" tests/a11y/screens.json tests/e2e/features/*.feature` findet keine Zeile. Der Zustand ist im Browser erreichbar: `FailRequests.to('/api/statements/agreements', {})`, danach `Navigate.reload` (Muster: tests/e2e/CLAUDE.md).

**Behebung.** Ein Zustand, z. B. `agreements-check-failed`, unter `statement-generate` mit derselben Query wie `agreed-costs`, in allen drei Dateien.

## Re-Review Slice 2

- **C-1 (Major): behoben, mit Lücken.** Der Status `loading/loaded/failed` und `blocking` stehen in AgreedCosts.svelte:32-59, StatementWizard.svelte:163 sperrt «Weiter». Eine Antwort ohne Liste zählt als Fehler (Z. 47-48). Der DOM-Test «Fragen nicht geladen» (agreed-costs.dom.test.ts:219) und das E2E-Szenario «Die vereinbarten Nebenkosten lassen sich nicht prüfen» wären ohne die Änderung rot: Ohne Alert schlägt die Question fehl, und der Assistent ginge zur Vorschau. Jede Task, die Schritt 3 verlässt, wartet über `leaveSettings` (tasks/statement-generate.ts:46, 82, 113; tasks/accessibility.ts:110, 418), und `openSettingsFor` wartet auf die geladenen Fragen. Offen sind: der Ladefall ohne Test (C-8), der Fehlerzustand ohne a11y- und Sprachzeile (C-3) und der Fokus nach «Erneut versuchen» (C-7).
- **C-2 (Major): behoben.** `agreement-save-failed` steht in screens.json, accessibility.feature:140 und sprachen-bildschirme.feature:141. `FailRequests.toPathsMatching` ist eine Interaction auf der Screenplay-Schicht, und der Zustand speichert nichts, er ist also in jedem Viewport wiederholbar. Die Notiz «Beim Mietvertrag gespeichert.» prüft jetzt der DOM-Test (agreed-costs.dom.test.ts:184).
- **C-5: behoben.** Vier DOM-Tests für AgreedCosts und AgreementQuestion: Sperre, PUT-Body, Speicherfehler, Laden und erneutes Laden.
- **C-6: behoben.** fr «Convenue/Non convenue», it «Pattuita/Non pattuita», auch im Fliesstext von `statements_agreements_text`.
- **C-7: Beschreibung behoben** («FTTH»). Die Zahl der Seeds pro Zeile ist unverändert, das war nicht verlangt.
- **C-9: behoben** (`forwardPut`).
- C-3, C-4, C-8, C-10, C-11, C-12 bleiben wie gemeldet (Zeilen S2-C-n).

## Bestätigt (Slice 3, Anforderung gegen Code und Test)

- Neuer Mietvertrag: Ohne Wahl ist `agreedCategoryIds` `undefined`. Alle Kästchen sind angekreuzt (AgreedCategories.svelte:17), es wird keine Liste geschickt (contract-form.ts:140), und das Backend vereinbart alle umlagefähigen Kategorien. Belegt durch contract-form.test.ts:179 (ohne die Änderung rot) und die Szenarien contract-new.feature:142, 148 (ohne die Änderung rot, weil die Zeile fehlt).
- Eine Wahl schickt die Liste. Jede andere umlagefähige Kategorie wird «nicht vereinbart» (Backend-Service, Test aus Slice 1). Die leere Liste wird mitgeschickt (contract-form.test.ts:181).
- «Prüfen» nennt die vereinbarten Kategorien, ohne Wahl alle, sonst «Keine» (contract-wizard.ts:163-168, Test contract-wizard.test.ts:105, ohne die Änderung rot).
- Seite des Mietvertrags: Die Zeile «Vereinbarte Nebenkosten» erscheint. Können die Kategorien nicht geladen werden, ist der Wert `null`, die Zeile fehlt und der Rest bleibt (+page.server.ts:186-190, ContractTerms.svelte:64-72). Tests: contract-actions.test.ts:309 und 319. E2E: contract-edit.feature:125, mit einer Positiv- vor der Negativprüfung.
- `agreeableCategories` filtert nach umlagefähig und benennt in der UI-Sprache. Bei einer Fehlantwort wirft es `error(status)` (categories.test.ts:267, 272). «Neu» und «Bearbeiten» laden mit `await` ohne Auffangen. Der catch in edit/+page.server.ts:36-38 gibt den Status weiter. Ein Seitentest für den Fehlerweg fehlt, der Weg ist aber direkt (siehe «Nicht bestätigt»).
- Bindung in Svelte 5: `bind:checked={get, set}` auf ein `$bindable` einer Kindkomponente gibt es ab Svelte 5.9 (package.json: ^5.57.1). Der Getter liest `agreed`, der Setter ersetzt das Array, die Bindung `bind:agreed={values.agreedCategoryIds}` reicht es bis `values` weiter. Das E2E-Abwählen geht durch.
- Barrierefreiheit der Feldgruppe: `fieldset` mit `legend`, Hilfetext sichtbar über den Kästchen und über `aria-describedby` verbunden. Jede Zeile ist ein `label` mit `min-h-12` (48 px). Bei 390 px eine Spalte, ab `sm` zwei. Nur Token-Klassen (`gap-*`, `text-ink(-muted)`, `font-semibold`).
- Texte: Alle neuen Schlüssel stehen in allen vier `messages/*.json`, die Hilfetexte folgen V-6 (Neu und Bearbeiten). Die Begriffe «umlagefähig» (imputable/addebitabile/allocable) und «frais accessoires/spese accessorie» stimmen mit `docs/design/i18n-begriffe.md` und den bestehenden Texten überein. Der Marker `TODO(fachlich prüfen, #369)` ist gesetzt.
- API-Vertrag: `tests/contracts/contract.json` hat `agreedCategoryIds`, die Prüfung macht api-contracts.pg.test.ts:147. Der Typ steht in `RentalContract`.
- Sicherheit: Der PUT/POST des Mietvertrags läuft über den bestehenden BFF mit XSRF. Das Backend prüft `agreedCategoryIds` als `uuid[]` (routes/contracts.ts:42), eine unbekannte id fällt weg.
- Screenplay: Die Steps rufen nur Tasks und Questions auf. `firstAgreementYes` und `agreementsLoading` sind Targets, und die Features sagen, was der Liegenschaftsverwalter will. Die vier `@wip` sind entfernt, und kein bestehendes Szenario wurde gelockert.

## Nicht bestätigt

- Vom Aufrufer gemeldet und nicht wiederholt: `bun run check`, `bun run lint`, die E2E-Läufe «@statements|statement-generate» (189) und die Vertragsszenarien (96, vor `leaveSettings`) mit der Nachkontrolle, ebenso die a11y- und Sprachzeilen `agreement-save-failed`. Backend-Tests und E2E waren mir untersagt.
- Selbst ausgeführt: die neun geänderten Vitest-Dateien. Ergebnis: 182 grün, aber 15 unbehandelte Fehler mit Exit-Code 1 (C-2). Der volle Lauf `bunx vitest run` endet ebenfalls mit Exit-Code 1: 2822 grün, 6 rot in `form-selects.dom.test.ts` («Cannot find module … node_modules/.ssr-*/…» aus `helpers/hydrate.ts`), dazu dieselben 15 Fehler. Die sechs roten Tests sehe ich als Umgebungsproblem dieses Worktrees (der Hydrate-Build schreibt in `node_modules`), nicht als Folge des Diffs. Auf dem Basis-Commit habe ich das nicht geprüft. Ausgabe: /tmp/claude-0/-home-user-Dwello/e60c0fa6-2a4d-5c91-b5be-bcf2af1f206b/scratchpad/vitest-full-s3.txt
- Dass `statement-wizard.dom.test.ts` auf acb9da6 ohne unbehandelte Fehler lief, habe ich nur durch Lesen geschlossen: Vorher installierte `toSettings` kein `fakeBff`. Ausgeführt habe ich den Basis-Commit nicht.
- Ob die Fehlerseite bei «Neu» und «Bearbeiten», wenn die Kategorien nicht laden, ein eigener a11y-Zustand sein müsste: Sie ist die allgemeine Fehlerseite. Den Server-Load kann der E2E-Stack nicht stören, deshalb braucht es `No scenario: <reason>` im Pull Request. Ob er das sagt, kann ich nicht sehen.
- Ob `Wait.until(on.formProblem)` im Zustand `agreement-save-failed` auf den Speicherfehler wartet und nicht auf ein anderes `aria-invalid`: nur gelesen (targets/accessibility.ts:16).
- V-7 der Fachreview (Szenarien Folgevertrag V-10, eigene umlagefähige Kategorie beim neuen Mietvertrag, Kategorie nicht mehr umlagefähig): Laut Auftrag nicht Teil dieses Slices, nicht geprüft.
