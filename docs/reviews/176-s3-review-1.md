# Code-Review #176 Slice 3, Runde 1

Commit-Bereich: `487401b..dcfcfd7`. Das sind zwei Commits: `87a4f05` (`feat(config): KI proposes whether allocable`), gelesen im Worktree `review-176-s3-code`, und `dcfcfd7` (`fix(config): split the KI proposal display`, Nachkomme von `87a4f05`). Den zweiten habe ich auf Hinweis des Aufrufers mit `git show dcfcfd7` aus dem gemeinsamen Objektspeicher gelesen. Gelesen sind alle 31 Dateien aus `87a4f05` und die 3 Dateien aus `dcfcfd7`. Zeilenangaben gelten für den Stand `dcfcfd7`.

`dcfcfd7` ändert das Verhalten nicht. `CategoryProposal.svelte` zeigt dieselben zwei Alerts wie vorher (Ton `caution` ohne Vorschlag, sonst `info`, Testid `category-proposal`). Der Stellvertreter ist nur anders aufgeteilt. Die Prettier-Umbrüche in `CategoryForm.svelte` betreffen nur eigene Zeilen dieses Slices.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| E-1 | Major | `src/routes/config/categories/CategoryForm.svelte:53-55` | Ein früherer Vorschlag der KI bleibt gewählt, wenn eine spätere Prüfung keine sichere Antwort bringt. Die Wahl wird nie zurückgesetzt, und das Formular zeigt «Kein Vorschlag der KI … Wählen Sie selbst» neben einer von der KI vorgewählten Option. |
| E-2 | Major | `src/lib/ui/RadioGroup.svelte:35`, `src/lib/ui/focus-error.ts:10-12`, `src/routes/config/SaveForm.svelte:50` | Wird das Speichern nur wegen der fehlenden Wahl abgelehnt, bekommt kein Element den Fokus und die Fehlermeldung wird nicht vorgelesen: `aria-invalid` steht am `fieldset`, nicht an einem `input`, und die Meldung hat kein `role="alert"`. |
| E-3 | Minor | `src/routes/config/categories/CategoryProposal.svelte:10-25` | Der Vorschlag und der Hinweis ohne Vorschlag werden nicht angesagt: `Alert` hat bei `info`/`caution` keine Rolle, und der Fokus bleibt auf dem Knopf. Bei «Formel testen» steht das Ergebnis in `role="status"` (`FormulaTestResult.svelte:10`). Die Wahl ändert sich also für Screenreader-Nutzer ohne Ansage. |
| E-4 | Minor | `src/routes/config/categories/CategoryForm.svelte:94-101`, `SaveForm.svelte:44` | «Von der KI prüfen lassen» zeigt keinen Ladezustand (kein `busy`), obwohl die KI bis zu `LLM_TIMEOUT` = 30 s braucht (`backend/src/config/llm.ts:21`). Wenn nichts passiert, klicken unerfahrene Nutzer nochmals oder speichern, während die Prüfung noch läuft. |
| E-5 | Minor | `src/routes/config/categories/CategoryForm.svelte:98` | Mit Enter in «Name» oder «Beschreibung» wird jetzt die KI gefragt statt gespeichert: Implizites Absenden nimmt den ersten Submit-Knopf im Baum, und das ist jetzt der Prüfknopf. Diese Verhaltensänderung deckt kein Test ab. |
| E-6 | Minor | `src/lib/server/category.ts:87-89` | Antwortet das Backend mit `ok` und einem Körper, der kein JSON ist, wirft `answer.isAllowedUtilityCost` einen TypeError (Ergebnis: 500 statt Hinweis). Ein 422 von Elysia (Name über 100 Zeichen; das Feld hat kein `maxlength`) zeigt über `backendMessage` den eigenen Text des Backends, in jeder Sprache. Gegen die Regel «never the backend's own text». |
| E-7 | Minor | `messages/it.json:1087` | «Il conduttore paga …»: Laut `docs/design/i18n-begriffe.md:20` heisst Mieter «inquilino». Die anderen 79 Stellen in `it.json` verwenden «inquilino». |
| E-8 | Nit | `src/routes/config/categories/new/+page.svelte:23-28`, `CategoryForm.svelte:104-106` | Wird das Speichern nach einem Vorschlag abgelehnt (z. B. Name schon vergeben), ist `form` = `{errors}`. Die Begründung der KI verschwindet, die vorgewählte Option bleibt. |
| E-9 | Nit | `tests/e2e/targets/accessibility.ts:20-22` | `categoryNameInput`, `categoryProposeButton` und `categoryProposal` doppeln `nameInput`, `proposeButton` und `proposal` aus `tests/e2e/targets/categories.ts:6-11`. |
| E-10 | Nit | `backend/scripts/llm-stub.ts:61` (dcfcfd7) | Nach dem Umbau fehlt `messages[0]?.`. Eine Anfrage an `/chat/completions` ohne `messages` wirft jetzt und ergibt einen 500 statt wie vorher 503. Betrifft nur den Stellvertreter; die KI-Aufrufe des Backends senden immer `messages`. |

## Blocker/Major

### E-1 (Major): Ein veralteter Vorschlag bleibt vorgewählt, wenn die KI unsicher ist

`CategoryForm.svelte:53-55`:

```svelte
$effect(() => {
    if (proposal && 'reasoning' in proposal) values.allowed = String(proposal.isAllowedUtilityCost);
});
```

Der Zweig ohne Vorschlag (`{ error }`) lässt `values.allowed` unverändert. Ablauf:

1. Name «Dachsanierung» eingeben und «Von der KI prüfen lassen» wählen. Die KI ist sicher: «Nicht umlagefähig» wird gewählt.
2. Den Namen auf «Bewachung» ändern und nochmals prüfen lassen. Das Backend antwortet mit 503 `KI_NO_PROPOSAL`.

Ergebnis: «Nicht umlagefähig» bleibt gewählt, und darunter steht «Kein Vorschlag der KI. … Wählen Sie selbst …». Laut Anforderung wird ohne sichere Antwort nichts vorgewählt («Eine Kategorie ist nie umlagefähig, nur weil niemand hingeschaut hat»). Die Wahl stammt hier von der KI und galt einem anderen Namen. Ein unerfahrener Liegenschaftsverwalter speichert sie leicht so. Das entscheidet, ob die Rechnungen auf die Mieter umgelegt werden.

Nachweis, dass es fehlschlägt, als DOM-Test in `categories-page.dom.test.ts`: `NewCategoryPage` mit `form: { proposal: { isAllowedUtilityCost: false, reasoning: 'x' } }` mounten, dann die Props auf `form: { proposal: { error: '…' } }` umstellen (`rerender`/`$set`) und `choice('Nicht umlagefähig').checked` prüfen. Das ergibt heute `true`. Das E2E-Szenario «Ohne sichere Antwort …» deckt das nicht ab, weil es nur einmal fragt.

Behebung, kurz: Merken, welchen Wert die KI vorgewählt hat. Bei `{ error }` die Wahl auf `''` zurücksetzen, wenn sie noch diesem Wert entspricht. Eine Wahl, die der Liegenschaftsverwalter selbst getroffen hat, bleibt stehen. Eine Alternative ist, bei `{ error }` immer zurückzusetzen. Das ist mit dem Hinweis «Wählen Sie selbst» vereinbar, ist aber eine Entscheidung.

### E-2 (Major): Ablehnung «Wählen Sie, ob die Kosten umlagefähig sind.» ohne Fokus und ohne Ansage

`SaveForm.svelte:50` ruft nach jeder Antwort `focusFirstError` auf. Das sucht `:is(input, select, textarea)[aria-invalid="true"]` und danach `[role="alert"]` (`focus-error.ts:10-12`). Laut seinem Kommentar soll so nach einer Ablehnung das erste ungültige Feld fokussiert und vorgelesen werden. `RadioGroup.svelte:35` setzt `aria-invalid` aber nur am `fieldset`. Die Meldung (`RadioGroup.svelte:68-74`) hat kein `role="alert"`, und `errors.form` ist leer, also gibt es auch kein `form-error`-Alert.

Ablauf: Name eingeben, keine Wahl treffen, «Kategorie speichern». Der Fokus bleibt auf dem Speichern-Knopf, und der Screenreader sagt nichts. Die Ablehnung ist die zentrale neue Regel dieses Slices. Sie ist nur visuell sichtbar, und axe erkennt das nicht. Im Zustand `submit-empty` ist der Name leer, deshalb fällt es dort nicht auf.

Nachweis: DOM-Test mit `NewCategoryPage` und `form: { errors: { isAllowedUtilityCost: '…' } }`, dann `focusFirstError(form)` aufrufen und `document.activeElement` prüfen. Er bleibt `body`. Oder E2E: nach dem Speichern ohne Wahl ist der fokussierte Knopf weiterhin `category-submit`.

Behebung: `aria-invalid` (oder das `aria-describedby` der Meldung) an die Radios setzen, damit `focusFirstError` das erste Radio findet. Ein Test der Komponente zeigt das zuerst rot.

## Nicht bestätigt

- Alle Checks des Aufrufers sind «vom Aufrufer gemeldet», auch die Läufe auf `dcfcfd7` (DOM-Tests und das Kategorien-E2E mit 21 bestanden). Ich habe keinen erneut ausgeführt: `bun run test:coverage` (146 Dateien, 2334 Tests), lint, `bun run check`, `deepcheck:audit`, Fallow-Gate, Backend `bun run test` (570) und `type-check`, die E2E-Szenarien «Kostenkategorien» (5 neue), accessibility/sprachen-bildschirme mit `ki-proposal`/`ki-no-proposal`, Rechnungen und Datenschutz (140 + 21).
- E-1 und E-2 habe ich aus dem Code abgeleitet (`CategoryForm.svelte`, `RadioGroup.svelte`, `focus-error.ts`, `SaveForm.svelte`). Ich habe sie nicht ausgeführt, weil ich keine Testdatei in den Worktree schreiben darf.
- Dass fr/it/en keinen deutschen Text zeigen, hängt an den Begründungen in `backend/scripts/llm-stub.ts`. Ob ein echtes Modell der Zeile «Sprache der Begründung: Französisch» folgt, lässt sich nicht prüfen. Dafür ist die Auswertung in Slice 4 gedacht.
- `getLocale()` in der BFF-Aktion (`category.ts:84`) hängt an `paraglideMiddleware` in `src/hooks.server.ts:39`. Die Sprache «de» belegt ein Unit-Test. Für fr/it/en verlasse ich mich auf das gemeldete Szenario `sprachen-bildschirme`.
- Folgendes ist durch Code und Test bestätigt:
  - Backend: Schwelle 0.7/0.69, keine KI, unbrauchbare Antwort, Prompt mit `LEGAL_BASIS` und Sprache (`category-allocability.pg.test.ts`).
  - Vertrag `tests/contracts/category-proposal.json`: Prüfung im Backend (`api-contracts.pg.test.ts`) und im Frontend (`categories.test.ts`).
  - Pflichtwahl beim Speichern; Bearbeiten ohne KI, mit der gespeicherten Wahl.
  - Hilfetext mit Art. 257a Absatz 2 OR und «Gebäudeversicherung» in allen vier Sprachen.
  - Neue Texte in allen vier `messages/*.json`.
  - Neue Zustände in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`.
  - `docs/api-specification.md` nachgeführt.
  - Planzeilen «Test red», «Scenario red» und «Skills» vorhanden.
  - Design: Prüfknopf ist `secondary` mit `min-h-12`, nur Token-Klassen, die Radios mit Legend und Hilfetext am Feld.
