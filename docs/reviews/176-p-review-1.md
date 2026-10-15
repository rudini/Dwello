# Code-Review #176, Slice «Persona-Fixes», Runde 1

Geprüft: `dca92f6..969f233` (ein Commit, `fix(config): KI proposal follows the checked name`), Worktree `/tmp/claude-0/-home-user-Dwello/fbb18b34-b688-5fdb-9b9f-9f01da7bd45c/scratchpad/review-176-p-code`. Alle 19 geänderten Dateien sind gelesen; die Persona-Berichte und `176-datenpruefung-1.md` nur auf ihren Bezug zum Diff hin.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| G-1 | Major | `src/routes/config/categories/CategoryForm.svelte:57-65` | Wird das Speichern abgelehnt (`form = { errors }`, kein `proposal`), nimmt der Effekt die Wahl der KI zurück, obwohl der Name gleich bleibt. Das ist eine Regression gegenüber dem Basis-Commit (`if (!proposal) return`). Sie widerspricht der Ablehnung von E-8 (`implementation_plan.md:41`). Ein Test dafür fehlt. |
| G-2 | Major | `tests/e2e/features/categories.feature:62-80`, `implementation_plan.md:29-30` | Kein Szenario für die neuen Verhaltensweisen: Der Vorschlag gilt nur für den geprüften Namen (Helga P-1), und eine eigene Wahl bleibt bei der Prüfung stehen (Sven P-2, Marco P-1). Im Plan steht weder `Scenario red` noch `No scenario: …`. |
| G-3 | Major | `tests/a11y/screens.json:33-34, 424-425`, `accessibility.feature:129-130`, `sprachen-bildschirme.feature:130-131` | Zwei neue UI-Zustände fehlen in allen drei Listen: «Die KI prüft die Kategorie …» während der Prüfung und der Vorschlag mit «Ihre Wahl bleibt …». `ki-proposal` beschreibt nur den vorgewählten Fall. |
| G-4 | Minor | `CategoryForm.svelte:54, 62-64` | `kiChoice` vergisst nicht, wenn der Liegenschaftsverwalter die Wahl selbst ändert. Wählt er danach selbst wieder den Wert, den die KI früher gesetzt hatte, gilt diese Wahl weiter als Wahl der KI. Ablauf: KI setzt «Nicht umlagefähig», er klickt «Umlagefähig» und dann wieder «Nicht umlagefähig». Eine zweite Prüfung, die «Umlagefähig» ergibt (z. B. nach einer geänderten Beschreibung), überschreibt dann seine Wahl und meldet «Dwello hat diese Wahl vorgewählt». Ändert er nach demselben Hin und Her den Namen, verschwindet seine eigene Wahl (Helgas Ablauf, Schritt 5; ihr Vorschlag zu P-1: «solange ich sie nicht selbst angeklickt habe»). Das widerspricht «Die KI überschreibt nie eine Wahl des Liegenschaftsverwalters». |
| G-5 | Minor | `CategoryForm.svelte:57`, `src/lib/server/category.ts:86-89` | Die KI prüft Name und Beschreibung. Ändert sich nur die Beschreibung, bleiben Vorschlag und Wahl der KI trotzdem stehen. Die Anforderung nennt nur den Namen. Vorschlag: die Lücke als offene Arbeit festhalten oder auch die Beschreibung vergleichen. |
| G-6 | Minor | `src/__tests__/ui-choices.dom.test.ts:78-92`, `src/lib/ui/RadioGroup.svelte:26-32` | Die neue Reihenfolge in `aria-describedby` (Fehler zuerst) gilt in der gemeinsamen Komponente. Getestet ist sie nur für die Option und nur über `CategoryForm`. Die Reihenfolge am `fieldset` (Fehler vor Hilfe) ist ungetestet. Die tiefste Schicht wäre `ui-choices.dom.test.ts`. |
| G-7 | Nit | `src/routes/config/categories/CategoryProposal.svelte:25` | «Dwello hat diese Wahl vorgewählt. Sie entscheiden: …» steht auch dann noch, wenn der Liegenschaftsverwalter die Wahl danach geändert hat. |
| G-8 | Nit | `CategoryForm.svelte:118-124` | Kommt die Antwort für einen Namen, den der Liegenschaftsverwalter während der Prüfung geändert hat, wird die Statusregion nach «Die KI prüft …» leer. Ein Screenreader hört nicht, dass die Antwort verworfen wurde. |

## Blocker/Major

### G-1: Abgelehntes Speichern nimmt die Wahl der KI zurück

`current` ist `proposal?.name === values.name.trim() ? proposal : undefined`. Nach einem abgelehnten Speichern liefert `saveRecord` `fail(…, { errors })` (`src/lib/server/save-form.ts:23, 34`). Dann setzt `new/+page.svelte:25` `proposal={… : undefined}`, `current` wechselt von der Antwort zu `undefined`, und der Effekt läuft in den `else`-Zweig: `values.allowed === kiChoice` → `values.allowed = kiChoice = ''`. Die Wahl verschwindet ohne Hinweis, obwohl im Namensfeld noch der geprüfte Name steht. Die Anforderung verlangt dagegen, dass die Wahl bleibt, solange der Name gleich ist; erst eine Namensänderung nimmt sie zurück. Im Basis-Commit blieb sie, und darauf stützt sich die Ablehnung von E-8 («after a refused save the choice the KI made stays visible»), die nun nicht mehr stimmt.

Ausgelöst wird das durch jede Ablehnung beim Speichern, bei der der Name gleich bleibt, z. B. einen Fehler des Backends (`errors.form`). Beim zweiten Speichern kommt dann «Wählen Sie, ob die Kosten umlagefähig sind», obwohl der Liegenschaftsverwalter die Wahl der KI gesehen und angenommen hatte. Bei «Name schon vergeben» wechselt der Name danach ohnehin.

Nachweis (Test, der heute rot ist; nicht ausgeführt, weil ich im Worktree keine Datei anlegen darf, Begründung oben):

```ts
const props = checked('Gartenpflege', { isAllowedUtilityCost: true, reasoning: 'Betrieb' });
props.form = { errors: { form: 'Die Kategorie konnte nicht gespeichert werden.' } };
flushSync();
expect(choice('Umlagefähig').checked).toBe(true); // heute false
```

Möglicher Fix: «keine neue Antwort» (`proposal` fehlt) von «Name passt nicht» unterscheiden, z. B. die letzte Antwort in einer lokalen `$state` halten und nur ersetzen, wenn `proposal` gesetzt ist.

### G-2: Kein Szenario für die Verhaltensänderung

Die Fixes ändern, welche Wahl gespeichert wird, wenn der Liegenschaftsverwalter nach der Prüfung den Namen ändert (Helga P-1, Major, Risiko: «eine Dachsanierung den Mietern verrechnet») oder vor der Prüfung selbst gewählt hat (Sven P-2, Major). Die Szenarien in `categories.feature:62-80` decken keinen der beiden Fälle ab; der Commit ändert nichts unter `tests/e2e/`. CLAUDE.md, Workflow 1, verlangt für jede Verhaltensänderung ein Szenario, das zuerst rot war. Workflow 6 lässt für einen behobenen Persona-Befund auch einen Test einer tieferen Schicht genügen. Wer G-2 mit Workflow 6 ablehnt, sollte das im Plan begründen. Ich halte zwei Szenarien trotzdem für nötig: Es geht um die Wahl der Umlagefähigkeit, also darum, welche Kosten in der Abrechnung landen, und beide Befunde waren Major. Zeigen lässt sich das so: Im Basis-Commit läuft heute jedes Szenario der Kategorien grün, obwohl die Wahl nach einer Namensänderung stehen bleibt.

### G-3: Neue Zustände fehlen in a11y- und Sprachprüfung

CLAUDE.md, Design-Regeln/Process, verlangt neue Zustände in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. Neu sind (1) der Text während der Prüfung `categories_proposal_checking` (`CategoryForm.svelte:119-120`) und (2) der Vorschlag mit `categories_proposal_kept` (`CategoryProposal.svelte:25`). Keiner läuft durch axe (hell/dunkel, drei Geräte) oder durch die Prüfung «kein Deutsch in fr/it/en». `ki-proposal` (`screens.json:33`) zeigt nur den Fall mit `applied`. Für (1) ist die Antwort auf `?/propose` verzögert zu beantworten, für (2) vor der Prüfung selbst zu wählen.

## Geprüft und bestätigt

- **`$effect` mit `current`:** Er liest nur `current` und schreibt nur in `untrack`. Eine Schleife entsteht nicht, weil `current` nicht von `values.allowed` abhängt. Der Ablauf «Prüfen, Name ändern, Name zurück, nochmals prüfen» gibt nichts Veraltetes:
  - Zurück auf den alten Namen: dieselbe Antwort, die Wahl der KI kommt wieder.
  - Erneute Prüfung: neues Objekt, `applied` wird neu berechnet.
  - Dieselbe Antwort zweimal (gleicher Inhalt, neues Objekt) gibt dasselbe Ergebnis.
  - Eine eigene Wahl vor der Prüfung bleibt, wenn `kiChoice` leer ist.
  - Ausnahmen: G-1 und G-4.
- **Bearbeiten einer Kategorie:** Ohne `proposal` ist `values.allowed` dort `'true'`/`'false'` und ungleich `kiChoice` (`''`). Der Effekt ändert nichts.
- **BFF:** Der Typ `Proposal` und `name: body.nameDE` sind getrimmt wie `values.name.trim()` (`category.ts:35, 43`). `categories.test.ts` ist angepasst. Der Rückgabewert stammt aus dem BFF, nicht aus dem Backend, also kein Vertrag unter `tests/contracts` betroffen.
- **SaveForm, Fokus:** `focused` wird erst gelesen, wenn die Antwort da ist. Der Fokus geht nur zurück, wenn er auf `body` steht und es eine Prüfaktion ist. Das Speichern ist nicht betroffen. Für die Verteilschlüssel («Formel testen») ist das Verhalten gleich oder besser. Test: «lässt den Fokus, wo er …».
- **RadioGroup:** `PeriodStep.svelte:96-105` übergibt weder `help` noch `error` und ist nicht betroffen. Die Reihenfolge ist jetzt dieselbe wie in `Checkbox.svelte:34` (Fehler zuerst). Der Fehler wird nur ohne Wahl übergeben (`CategoryForm.svelte:103`), mit Test.
- **Tokens:** `mt-4` ist Stufe 4 des 8-px-Rasters (`docs/design/token-referenz.md:45`), `text-ink-muted` ein Token. Den Abstand gibt es nur, wenn die Region Inhalt hat (E-19/E-20).
- **i18n:** Die drei neuen Schlüssel stehen in allen vier Dateien, mit Sie/vous/Lei. «IA»/«AI» entsprechen `docs/design/i18n-begriffe.md:44`. E-22/F-21 (fr «indique si», it «indichi se») sind mit Test umgesetzt.
- **Plan:** `Skills:`-Zeile und `Test red`-Zeilen sind vorhanden. `offene-punkte.md` U-24 und U-29 hängen mit der Aufgabe zusammen.

## Nicht bestätigt

- Diese Prüfungen habe ich nicht wiederholt (alle vom Aufrufer gemeldet): lint, check, deepcheck, fallow, test:coverage (151 Dateien / 2376 Tests), Backend 579, type-check, E2E chromium + api 676.
- Selbst ausgeführt: `bunx vitest run` auf `categories-page.dom.test.ts`, `categories.test.ts`, `privacy-i18n.dom.test.ts` und `ui-choices.dom.test.ts`: 4 Dateien, 57 Tests grün.
- Dass die neuen Tests zuerst rot waren, habe ich nicht nachgeprüft. Ich habe nur die Zeile im Plan gelesen (`implementation_plan.md:30`).
- Den Nachweistest zu G-1 habe ich nicht ausgeführt: Vitest nimmt nur Dateien unter `src/**` (`vitest.config.ts:29, 44`), und im Worktree darf ich nichts anlegen. G-1 und G-4 stützen sich auf das Nachvollziehen des Codes.
- Den Fokus in einem echten Browser (Chrome nimmt einem gesperrten Knopf den Fokus, `focused` ist dann `body`) habe ich nicht geprüft. Im jsdom-Test wird das mit `blur()` in `update` nachgestellt.
