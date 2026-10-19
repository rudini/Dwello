# Code-Review #468, Runde 1: «Weiter» wartet, solange ein Schritt lädt

Geprüft: `git diff 53618b07 f1a657bc -- . ':!implementation_plan.md'` (ein Commit, f1a657bc), Worktree `review-468`. Gelesen: alle 11 geänderten Dateien, dazu `Button.svelte`, `Stepper.svelte`, `StatementWizard.svelte`, `AgreementsCheck.svelte`, `ContractWizard.svelte` (Laden, Vorschlag, Wiederholen), `src/lib/api.ts`, `tests/e2e/tasks/statement-generate.ts`, `contract-form.ts`, die Svelte-Quelle von `prop()` (5.57.1), Issue #468.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | `src/routes/statements/generate/BuildingStep.svelte:31-59`, `FeeNotAgreed.svelte:20-33` | Die Antwort eines schon verlassenen Schritts setzt `loading = false` über die Bindung und entsperrt «Weiter» im neu geöffneten Schritt, während dessen Anfrage noch läuft (nachgewiesen). |
| C-2 | Minor | `src/__tests__/statement-wizard.dom.test.ts`, `contract-wizard.dom.test.ts` | Kein Test zeigt, dass ein gescheitertes Laden die Sperre wieder aufhebt, und keiner prüft das Verlassen von Schritt 3 während des Ladens. `submit()` umgeht `disabled`, deshalb würde die übrige Suite eine hängende Sperre nicht bemerken. |
| C-3 | Minor | `tests/e2e/tasks/contract-form.ts:165`, `tests/e2e/tasks/accessibility.ts:158,388,397` | `goToNextStep, goToNextStep` bzw. `Click.on(nextButton), Click.on(nextButton)`: Das sind zwei Klicks in Folge über einen asynchronen Schritt, und der Fachname des Schritts («Wohnung übernehmen») geht verloren. Das funktioniert, weil `locator.click()` auf einen aktiven Button wartet, ist aber nicht lesbar (`tests/e2e/CLAUDE.md`: Tasks sind fachliche Tätigkeiten). |
| C-4 | Minor | `src/__tests__/contract-wizard.dom.test.ts:437`, `statement-wizard.dom.test.ts:1094` | Beide Tests klicken «Weiter» während des Ladens. Das geht im UI nicht mehr. Sie gehen über einen Pfad, den die Oberfläche jetzt sperrt (siehe unten). |
| C-5 | Minor | `tests/a11y/screens.json`, `tests/e2e/tasks/accessibility.ts:507` | Der Zustand «Weiter: Bitte warten …» in den Schritten 2 und 3 hat keinen eigenen a11y-Eintrag. `statementWizardSteps` prüft Schritt 2 direkt nach `generate-all-buildings`. Ob dabei der Ladezustand oder der geladene Zustand drankommt, ist Zufall. Es ist kein Major, weil der E2E-Stack den Zustand nicht halten kann (derselbe Grund wie bei «No scenario») und weil das Aussehen eines belegten Primär-Buttons schon über `ki-checking` geprüft wird. |
| C-6 | Nit | `src/__tests__/contract-wizard.dom.test.ts:416-417` | Der neue Test steht zwischen dem Kommentar «Fehler behoben: kam der Vorschlag an …» und dem Test, zu dem der Kommentar gehört. |
| C-7 | Nit | `tests/e2e/tasks/accessibility.ts:110-111` | reuse: `tickBuilding` ist derselbe Ablauf wie `chooseBuilding` ohne den ersten Klick (`tests/e2e/tasks/statement-generate.ts:50-54`). Vorschlag: `tickBuilding` dort exportieren, `chooseBuilding = goToNextStep + tickBuilding`. net: etwa −3 Zeilen. |
| C-8 | Nit | `src/lib/ui/WizardNav.svelte:43-49` | Bei gesperrtem «Weiter» löst Enter in einem Feld von Schritt 3 (z. B. Verwaltungspauschale) nichts aus, und es kommt keine Rückmeldung. Vorher kam die Meldung von #439. Das folgt aus dem Entscheid «sperren». Die Statuszeile «… werden geprüft» liest es vor, darum nur zur Kenntnis. |

Ponytail-Review: Ausser C-7 nichts. Das zusammengefasste `$effect` in `StatementStep` ist nötig. Drei Kinder können nicht an dieselbe Variable gebunden werden, weil der Teardown eines Kindes sonst das `true` eines anderen überschreibt. Das `$derived` im ContractWizard ist die kürzeste Form.

## C-1 (Major): Eine veraltete Antwort hebt die Sperre auf

**Warum falsch:** `BuildingStep` und `FeeNotAgreed` setzen `loading = false` im `.then` der Anfrage, ohne zu prüfen, ob ihr Effekt noch lebt. Svelte 5 gibt den Schreibzugriff auf eine `$bindable`-Prop auch nach dem Zerstören der Komponente an den Setter der Eltern weiter (`node_modules/svelte/src/internal/client/reactivity/props.js`, `prop()`: der Setter-Pfad prüft kein `DESTROYED`). Ablauf:

1. Schritt 2 öffnet, Anfrage A läuft.
2. «Zurück»: Der Teardown setzt `buildingsLoading = false`, das ist richtig.
3. «Weiter»: Eine neue `BuildingStep`-Instanz setzt `true`, Anfrage B läuft.
4. A antwortet: Das `.then` der alten Instanz setzt `buildingsLoading = false`. «Weiter» ist aktiv, obwohl die Zahlen von B noch fehlen. Wenn sie ankommen, verschieben sie die Zeilen und den Button. Genau das wollte #468 verhindern.

Dasselbe passiert in Schritt 3 mit `FeeNotAgreed` (Schritt 3, «Zurück», «Weiter», «Weiter»). `AgreedCosts` ist nicht betroffen: Dort leitet sich `loading` aus dem eigenen `status` ab, und der Effekt der zerstörten Instanz läuft nicht mehr. Der ContractWizard ist auch nicht betroffen (`$derived`).

**Nachweis:** Ein Probe-Test in einer Kopie des Worktrees (`/tmp/claude-0/-home-user-Dwello/e9211292-8906-5267-a76e-82d2c2cdf877/scratchpad/probe468/src/__tests__/probe468.dom.test.ts`) macht Folgendes: Jede Anfrage bleibt offen. Dann `next`, `Zurück`, `next`, danach werden nur die beiden Anfragen der ersten Instanz beantwortet. Erwartet ist `disabled === true`, das Ergebnis ist **false** (rot).

**Behebung (klein):** Den Effekt als verlassen markieren, z. B. `let left = false; … .then(() => { if (left) return; …; loading = false; }); return () => { left = true; loading = false; };`. Das gilt in beiden Komponenten. Es kann auch die veralteten Schreibzugriffe auf `invoiceCounts`/`contracts` gleich mit abfangen. Der Probe-Test oben ist der rote Test dazu, einmal für Schritt 2 und einmal für Schritt 3.

## Zu den Fragen des Aufrufers

- **Jeder Pfad, der einen Schritt verlässt, setzt `loading` zurück:**
  - «Zurück» und der Stepper rufen beide `goTo` auf. Der Stepper führt nur zurück (`Stepper.svelte`: Buttons nur für `number < current`). Das `{#if step}` in `StatementStep` zerstört das Kind, und dessen Teardown setzt `false`. Für Schritt 2 ist das durch den Test «lässt nach «Zurück» während des Ladens wieder weitergehen» belegt, für Schritt 3 nur durch Lesen (C-2).
  - Wiederherstellen eines Entwurfs: `onMount` setzt `step` direkt, und die Kinder werden normal montiert.
  - Periodenwechsel: Er geschieht nur in Schritt 1, wo kein ladendes Kind montiert ist.
  - «Erneut versuchen» in `AgreedCosts`: `attempt++` setzt `status = 'loading'` und damit `loading = true`, die Antwort setzt `false`.
  - Im ContractWizard bleibt `contracts` beim Wiederholen gesetzt, also ohne Sperre wie vorher (#143/#151).
  - Offen ist nur der umgekehrte Fall C-1.
- **Ein gescheitertes Laden beendet `loading`:** `request()` in `src/lib/api.ts` fängt jeden Fehler ab und gibt `{ error }` zurück. `Promise.all` lehnt darum nicht ab. Mit Probe nachgewiesen: Bei 500 und bei einem werfenden `fetch` ist «Weiter» in Schritt 2 aktiv, und bei 500 ist es nach `agreements-failed` auch in Schritt 3 aktiv (`probe468b.dom.test.ts`, grün). In den Tests des Commits fehlt das (C-2).
- **`$bindable` aus Effekten und Teardowns schreiben:** Das ist in Svelte 5 zulässig (keine `state_unsafe_mutation`, der Teardown läuft ausserhalb des Templates), und die Tests laufen ohne Warnung. Die Grenze dieses Musters ist C-1: Der Setter überlebt die Komponente.
- **Das zusammengefasste `$effect` in `StatementStep`:** Es ist korrekt. Es braucht keinen eigenen Teardown, weil die Teardowns der Kinder die drei Teilwerte zurücksetzen.
- **Barrierefreiheit:**
  - `Button` setzt bei `busy` `disabled` und `aria-busy`.
  - Der Fokus liegt nach `goTo` auf der Überschrift, nicht auf «Weiter». Ein gesperrter Button verliert darum keinen Fokus.
  - Der Wiederholen-Button, der in `AgreedCosts` verschwindet, verliert ihn wie vorher; das ist nicht Teil dieses Diffs.
  - `disabled:opacity-60` ist von axe-Kontrastregeln für deaktivierte Controls ausgenommen.
  - Enter bei gesperrtem Standard-Button: C-8.
- **Der Test «überschreibt einen schon getippten Vertragsbeginn nicht»:** Der Pfad «Schritt 3, bevor die Mietverträge geladen sind» ist über die Oberfläche nicht mehr erreichbar. `restoreDraft` stellt keinen Schritt wieder her, und Enter wird bei einem deaktivierten Standard-Button nicht abgeschickt. `startEdited` bleibt trotzdem nötig: «Erneut versuchen» in Schritt 3 (`PeriodStep onretry`) lädt die Mietverträge neu, während schon getippt wird. Vorschlag (C-4): Den Test auf diesen Weg umstellen (Laden scheitert, Schritt 3, tippen, wiederholen). Gleiches gilt für den #439-Test in `statement-wizard.dom.test.ts:1094`: Er sollte über «Prüfung scheitert, Weiter, Erneut versuchen» laufen, denn das ist der Weg, auf dem `agreements-wait` noch erscheint. Beides blockiert nicht.
- **E2E-Tasks:**
  - Ausserhalb von `tickBuilding` hakt keine Stelle ein Gebäude an, bevor Schritt 2 geladen ist:
    - `chooseBuilding` wartet schon auf `buildingInvoiceCount`.
    - `chooseAllBuildings` folgt im Feature auf «nennt die Wahl für …», also auf den geladenen Schritt.
    - `buildings-billed` wartet auf `generate-building-billed-*`.
  - Auf «Weiter» während des Ladens warten jetzt `locator.click()` (aktiv) und `leaveSettings` (Agreements).
  - Die Doppelklicks über «Wohnung» funktionieren aus demselben Grund, siehe C-3.
- **a11y- und Sprachprüfungen an Schritt 2 während des Ladens:** `ui_please_wait` steht in allen vier `messages/*.json` (de/fr/it/en), die Sprachprüfung findet also kein Deutsch. Zum Zufall, welcher Zustand geprüft wird: C-5.

## Rot-Prüfung (durch Lesen)

- «lässt bei den Gebäuden erst weitergehen …», «lässt bei den Einstellungen erst weitergehen …» und «lässt bei der Wohnung erst weitergehen …» scheitern auf der Basis bei `disabled === true`. Sie sind also rot ohne die Änderung.
- «lässt nach «Zurück» während des Ladens wieder weitergehen» ist auf der Basis grün (dort gibt es keine Sperre). Rot ist er nur ohne den Teardown, also gegenüber der ersten Fassung. Das genügt für einen Test neuen Verhaltens im selben Commit.
- Die E2E-Änderungen sind Anpassungen von Tasks und kein neues Szenario. «No scenario: …» steht im Commit, und die Begründung trägt (`FailRequests` kann eine Anfrage nur scheitern lassen, nicht offen halten).

## Nicht bestätigt

- E2E-Lauf der betroffenen Features (Chromium + API): vom Aufrufer gemeldet als «läuft, nicht bestätigt». Nicht von mir ausgeführt (E2E ist mir untersagt). Ob Firefox und WebKit mit den Doppelklicks aus C-3 stabil sind, ist nur gelesen, nicht gelaufen.
- `bun run lint`, `bun run check` und das Fallow-Gate: vom Aufrufer gemeldet, nicht wiederholt.
- DOM-Tests (statement-wizard, agreed-costs, contract-wizard, wizard-navigation, ui-navigation-parts): von mir auf f1a657bc wiederholt, 126 bestanden.
- «Jeder neue Test wurde zuerst rot gesehen»: vom Aufrufer gemeldet; oben durch Lesen beurteilt.
- Ob axe den Ladezustand von Schritt 2 tatsächlich einmal prüft: Er ist im E2E nicht deterministisch zu erreichen; ich habe `statementWizardSteps` und `contractWizardSteps` in `tests/e2e/tasks/accessibility.ts` gelesen.
- Die Probe-Tests liefen in einer Kopie des Worktrees unter `/tmp/claude-0/-home-user-Dwello/e9211292-8906-5267-a76e-82d2c2cdf877/scratchpad/probe468/`, nicht im Worktree selbst.
