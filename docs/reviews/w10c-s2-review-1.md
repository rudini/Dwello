# Code-Review W10c, Slices 2 und 4 (#363 / #91), Runde 1

Geprüft wurde `git diff 8b1a322 acb9da6` im Worktree `review-w10c-s2-code` (Commit acb9da6, ein Commit). Ich habe alle 33 geänderten Dateien gelesen. Gelesen habe ich ausserdem RadioGroup, Alert, FeeNotAgreed, StatementStep und StatementWizard (ganz), die Backend-Route `/contracts/:id/agreements`, `agreed-category.service.ts`, `toPdfData`, die E2E-Fixtures und -Tasks sowie `docs/reviews/w10c-fachreview-1.md` (V-1, V-12, M-1, M-2, V-9). `ponytail-review` ist angewendet.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | src/routes/statements/generate/AgreedCosts.svelte:34-50; StatementWizard.svelte:163 | `unanswered` ist 0, bis `/api/statements/agreements` antwortet. Bei einem Fehler bleibt es 0 (`data ?? []`, keine Meldung). «Weiter» geht dann ohne Frage zur Vorschau, und die unbeantworteten Kategorien fehlen ohne Hinweis in den Abrechnungen. Für diesen Fehlerzustand gibt es kein Szenario |
| C-2 | Major | tests/a11y/screens.json:432; accessibility.feature; sprachen-bildschirme.feature | Der neue Zustand «Antwort nicht gespeichert» (und die Notiz «Beim Mietvertrag gespeichert.») ist in keiner a11y- oder Sprachzeile. `statements_agreement_save_failed` und `_saved` sieht die Sprachprüfung nie |
| C-3 | Minor | src/routes/statements/generate/AgreementQuestion.svelte:29-41 | Speichern läuft noch: Die Frage zählt als unbeantwortet, zeigt aber keinen Fehler (`answer` ist gesetzt). «Weiter» tut dann nichts, und `showErrors` findet kein `aria-invalid`. Zwei schnelle Antworten hintereinander schicken zwei PUT, die gleichzeitig laufen. Die erste Antwort setzt «gespeichert», obwohl die zweite noch läuft, und welche zuletzt gespeichert ist, ist offen |
| C-4 | Minor | AgreementQuestion.svelte:52-58 | Der Erfolg wird über `role="status"` angesagt, der Speicherfehler nicht: Die Fehlerzeile von RadioGroup ist keine Live-Region, der Fokus bleibt auf der Option |
| C-5 | Minor | (fehlt) src/__tests__/*.dom.test.ts | Kein DOM-Test für AgreedCosts und AgreementQuestion: Zählung, Zurücksetzen nach einem Fehler, Notiz, Sperre während des Ladens. Diese Regeln zeigt nur E2E. Der Text der Notiz wird nirgends geprüft, denn `agreementAnswered` wartet nur auf irgendeinen Text |
| C-6 | Minor | messages/fr.json:720-722; messages/it.json:720-722 | Die Frage steht in der Einzahl und weiblich («est-elle convenue», «è pattuita»), die Antworten in der Mehrzahl («Convenus»/«Non convenus», «Pattuite»/«Non pattuite»). Im Französischen passt auch das Geschlecht nicht |
| C-7 | Minor | tests/e2e/fixtures/screens.ts:123-137 | Waldblick (2 Wohnungen, 2 Mieter, 2 Mietverträge, 2 Kategorien, 2 Rechnungen) wird für jede a11y- und Sprachzeile angelegt. Nach der Änderung liefen nur drei Zeilen. Die Beschreibung «Glasfaser» ist deutsch, der Kommentar sagt «names alike in every language» |
| C-8 | Minor | src/__tests__/statement-generation.test.ts:293-321 | Der Test bleibt grün, wenn man den Filter `rows.filter(...)` (statement-generation.ts:116) entfernt. Auch dass ein schon abgerechneter Mietvertrag nicht gefragt wird, zeigt er nicht (`statements` ist leer) |
| C-9 | Nit | src/lib/server/api-proxy.ts:293-298 | yagni: `method: 'PUT' \| 'POST'`, aber nur PUT hat einen Aufrufer. Den Parameter entfernen und `'PUT'` fest setzen |
| C-10 | Nit | backend/src/__tests__/agreed-categories.pg.test.ts:216,272; api-contracts.pg.test.ts:160 | Zwei Tabs statt einem. In api-contracts ist dabei eine unveränderte bestehende Zeile (`it('GET /categories/:id …`) umformatiert worden, die nicht zur Aufgabe gehört |
| C-11 | Nit | AgreementQuestion.svelte:56-58 | Die leere `<p role="status">` steht bei jeder Frage und vergrössert den Abstand (`gap-4`) |
| C-12 | Nit | tests/e2e/steps/agreed-costs.steps.ts:34-46 | Given und When unterscheiden sich nur in der Zeitform und rufen dieselbe Task auf. Das entspricht dem Muster im Repo, deshalb nur ein Hinweis |

ponytail-review: `api-proxy.ts:L293-298: yagni: method-Union mit einem Aufrufer. 'PUT' fest.` (C-9). `setAgreedCategories` ist kürzer als vorher, und `forwardMutation` ersetzt eine neunte Kopie. Sonst gibt es nichts zu kürzen. net: -2 lines possible.

## Blocker / Major

### C-1: «Weiter» übergeht die Fragen, solange sie laden oder wenn das Laden scheitert

**Warum falsch.** Die Anforderung lautet: ««Weiter» needs every answer.» Das Backend verlangt keine Antwort. Eine unbeantwortete Kategorie gilt als nicht vereinbart und wird nicht abgerechnet (agreed-category.service.ts:2-4, calculation.service.ts:319-320, api-specification «null (not answered; not billed)»). Die Sperre in StatementWizard.svelte:163 hängt allein an `unansweredAgreements`. AgreedCosts setzt den Wert beim Mount auf 0, weil `contracts` dann `[]` ist (Z. 30, 46-50), und erst die Antwort des Ladens setzt ihn richtig. Zwei Fälle umgehen die Sperre:
- Laden läuft noch: Ein Link öffnet direkt Schritt 3 (`chosen`), oder man kommt aus Schritt 4 zurück, und AgreedCosts wird neu gemountet. Ein früher Klick auf «Weiter» schickt `?/preview` ab.
- Laden scheitert: `api.get` liefert `{ error }`, `contracts = data ?? []`, es erscheint keine Meldung. Das gilt auch, wenn das Backend für einen einzigen Mietvertrag einen Fehler liefert, denn `call` wirft und die BFF-Route antwortet mit 500 (statement-generation.ts:28-44, 105).

In beiden Fällen erstellt der Liegenschaftsverwalter Abrechnungen ohne die neue Kategorie, ohne gefragt worden zu sein und ohne Hinweis. Laut tests/e2e/CLAUDE.md, «Rules», Failure states, braucht dieser Zustand ein Szenario: Die Anfrage stellt der Browser, also ist er mit `FailRequests` erreichbar. Ein solches Szenario fehlt.

Die Task `openSettingsFor` (tests/e2e/tasks/statement-generate.ts:55) wartet nicht auf die geladenen Fragen, bevor «weitergeht» klickt. Ob das Szenario «Ohne Antwort geht der Assistent nicht weiter» grün ist, hängt deshalb vom Timing ab.

**So zeigt man den Fehler.** Im Szenario «Die Antwort gilt für die Abrechnung» vor dem Öffnen der Einstellungen `FailRequests.to('/api/statements/agreements', {})` setzen und weitergehen, ohne zu antworten. Die Vorschau erscheint, und Anna kostet «CHF 350.00» (Heizung und Lift, ohne Treppenhausreinigung), statt dass eine Frage oder ein Fehler erscheint. Kürzer geht es mit einem DOM-Test: AgreedCosts mounten, wobei `fetch` nie antwortet oder 500 liefert. Dann ist `unanswered` gleich 0.

**Behebung (Vorschlag).** Bis die Antwort da ist, gilt «unbekannt» (zum Beispiel `unanswered = -1` oder ein eigener Zustand `loaded`). «Weiter» sperrt dann mit einer Meldung. Scheitert das Laden, zeigt der Schritt einen Fehler (Alert critical, Text in vier Sprachen) und lässt nicht weiter. Dazu kommen ein Szenario für den Fehlerzustand und die Zeile in a11y und Sprachen. `openSettingsFor` wartet auf den geladenen Schritt.

### C-2: Neuer UI-Zustand ohne a11y- und Sprachzeile

**Warum falsch.** CLAUDE.md, Design-Regeln, «Process»: Jeder neue Zustand kommt in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. Der Zustand `agreed-costs` zeigt nur die Pflichtfehler und den Hinweis «Nicht vereinbarte Nebenkosten». Den Speicherfehler («Ihre Antwort wurde nicht gespeichert …») erreicht man über `FailRequests` (Muster: «set it on the open page and then `Navigate.reload`»), er hat aber keine Zeile. Deshalb prüft weder axe noch die Sprachprüfung ihn oder die Übersetzungen von `statements_agreement_save_failed` und `statements_agreement_saved` in fr/it/en.

**So zeigt man den Fehler.** `grep -n "agreement" tests/a11y/screens.json` findet nur `agreed-costs`. `tasks/accessibility.ts:251-252` beantwortet keine Frage und stört kein Speichern.

**Behebung.** Ein Zustand, zum Beispiel `agreement-save-failed`: `FailRequests.to('/api/contracts/<Hanna>/agreements', {})`, eine Antwort, dann auf den Fehler warten. Die Antwort wird dabei nicht gespeichert, der Zustand lässt sich also in jedem Viewport wiederholen. Die Notiz «Beim Mietvertrag gespeichert.» lässt sich so nicht wiederholen. Für sie reicht der DOM-Test aus C-5, oder sie bekommt eine Begründung in der Bedeutung des Zustands.

## Bestätigt (Anforderung gegen Code und Test)

- Frage je Mietvertrag in Schritt 3 mit «Vereinbart» / «Nicht vereinbart», als radiogroup mit Legende und Fehler pro Gruppe: AgreedCosts.svelte und AgreementQuestion.svelte, RadioGroup (`min-h-12`). E2E-Szenarien Z. 31 und 38.
- Die Antwort wird sofort über `PUT /api/contracts/:id/agreements` gespeichert. Der Proxy prüft XSRF (`validateXsrfForMutation`). Die Notiz erscheint nach dem Speichern, der Fehler beim Scheitern (Szenario Z. 82). Die Antwort wirkt in der Abrechnung (Szenario Z. 47, Beträge 400 / 1050).
- Ohne Antwort bleibt der Assistent in Schritt 3 (Szenario Z. 38). Der Fokus geht auf die erste Option der fehlerhaften radiogroup: Der Selektor in StatementWizard.svelte:135 trifft die Option, weil RadioGroup `aria-invalid` auf dem `fieldset[role=radiogroup]` setzt. Das habe ich durch Lesen geprüft, kein Test prüft den Fokus. Ausnahmen davon: C-1, C-3.
- Zurück zu Schritt 3: AgreedCosts wird neu gemountet und lädt neu. Beantwortete Kategorien werden nicht mehr gefragt, «nicht vereinbart» erscheint im Hinweis. Ausnahme: das Fenster aus C-1.
- Gefragt werden die Mietverträge, die der Lauf abrechnet (`contractsInPeriod`, dieselbe Quelle wie `previewStatements`). Die Namen kommen in der UI-Sprache (`namesById`).
- Hinweis mit Link je Mietvertrag, nach dem Vorbild FeeNotAgreed. Die Texte folgen V-12 (Szenarien Z. 67 und 76).
- Der Text «Neu» folgt V-1 in vier Sprachen, die Empfehlung «nicht umlagefähig» ist gestrichen (statement-wizard.test.ts:217). Ohne die Änderung wäre der Test rot.
- PDF: Der Satz steht als erste Zeile der «Hinweise» und nennt nur Kategorien mit Position (M-2). Ohne `agreedCategoryIds` erscheint er nicht. Vier Übersetzungen sind in pdf.service.ts, Test in agreed-categories.pg.test.ts:198-213. Ohne die Änderung wäre er in beiden Teilen rot. Das E2E-Szenario Z. 91 prüft dazu «Lift» negativ, nach einer positiven Prüfung.
- `setAgreedCategories` arbeitet als ein INSERT … SELECT. Eine unbekannte id fällt weg, eine leere Liste speichert alles als nicht vereinbart. Der Test (agreed-categories.pg.test.ts:273) wäre auf 8b1a322 im Teil «unbekannte id» rot (Fremdschlüsselfehler), im Teil «leere Liste» grün.
- API-Vertrag `contract-agreements.json` mit Prüfung in api-contracts.pg.test.ts. README und api-specification sind ergänzt.
- Alle neuen Texte stehen in allen vier `messages/*.json`, die `TODO(fachlich prüfen, #369/#368)`-Marker sind gesetzt. Tokens: nur `text-accent`, `text-ink-muted`, `gap-*`.
- Die Screenplay-Schichten sind eingehalten: Die Steps rufen nur Tasks und Questions auf. Die Feature-Sprache beschreibt das Ziel, nicht die Bedienung.

## Nicht bestätigt

- Vom Aufrufer gemeldet und nicht wiederholt: `bun run lint`, `bun run check`, Backend `type-check`, die fünf Backend-Testdateien und E2E `statement-agreed-costs.feature` (chromium und api). Ebenso die a11y- und Sprachzeilen `agreed-costs`, `every-wizard-step` und `link-preset`, die volle Vitest-Suite (2815) und der volle E2E-Lauf vor Slice 2. Backend-Tests und E2E waren mir untersagt.
- Selbst wiederholt: `bunx vitest run src/__tests__/statement-generation.test.ts src/__tests__/statement-wizard.test.ts`, 43 Tests grün.
- Die übrigen a11y- und Sprachzeilen nach der Erweiterung von `seedFor` (C-7): nicht gelaufen. Ob eine Seite die Beschreibung «Glasfaser» in fr/it/en zeigt und die Sprachprüfung sie meldet, habe ich nicht geprüft.
- Rechnungen ohne Kategorie: `calculation.service.ts:320` behält Gruppen ohne `categoryId` (Slice 1), `agreedCosts` lässt sie weg (statement-pdf.service.ts:139). Ob eine solche Position in eine Abrechnung kommen kann und das PDF dann «Abgerechnet sind nur … vereinbarten Nebenkosten: …» neben einer Position «Nicht kategorisiert» druckt, habe ich nicht verfolgt (Fachreview M-3).
- V-9 (Kategorienamen als Abbild speichern): Das PDF nennt die heutigen Namen aus `categoryNames`. Ob das in einen späteren Slice gehört, steht nicht im Auftrag.
- Ob das Szenario «Ohne Antwort geht der Assistent nicht weiter» nur durch Timing grün ist (C-1), habe ich nur durch Lesen beurteilt, nicht ausgeführt.
- Ob die Bindung mit Funktion (`bind:value={() => answer, choose}`) mit RadioGroups `bind:group` beim Zurücksetzen auf `''` beide Optionen abwählt: Das habe ich gelesen (Svelte ^5.57), nicht getestet. Das Szenario Z. 82 prüft nur den Fehlertext.
