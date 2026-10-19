# Review 612, Runde 1 (auch Abschlussrunde vor dem Push)

Bereich: `git diff 33fe1d98 33d34081` (1 Commit `33d34081 fix(tests): wait for apartment choice in wizard`), gelesen im Worktree
`/tmp/claude-0/-home-user-Dwello/e9211292-8906-5267-a76e-82d2c2cdf877/scratchpad/review-612`.
Geänderte Dateien, alle gelesen: `implementation_plan.md`, `tests/e2e/tasks/accessibility.ts`, `tests/e2e/tasks/contract-form.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/tasks/accessibility.ts:153-162 | `toRentStep` klickt weiterhin zweimal «Weiter» über die Wohnung aus der Adresse, ohne auf die Wohnungsauswahl zu warten: dieselbe Race wie in «overlap-warning», in 4 Zeilen `contract-new` (agreed-costs-none, flat-rate-warning, flat-rate-warning-advance, agreed-costs-none-advance) beider Features. |
| C-2 | Nit | tests/e2e/tasks/contract-form.ts:160-161 | Der Kommentar nennt nur «the notices» als Ursache; schon der Wechsel vom Ladetext zur Wohnungsauswahl (Label, Hilfetext, 48-px-Select) verschiebt «Weiter» (siehe C-1). Etwa: «once its contracts are loaded: the choice and the notices that replace the loading text move «Weiter» …». |

## C-1 (Major): `toRentStep` hat dieselbe Race

Code (`tests/e2e/tasks/accessibility.ts:153-162`, unverändert durch den Diff):

```ts
const toRentStep: Activity = async (actor) => {
	if ((await actor.answer(pageAddress)).includes('/contracts/new'))
		await actor.attemptsTo(
			Click.on(nextButton),
			Click.on(nextButton),
			EnterDate.of('2030-01-01').into(startDateInput),
```

Warum das falsch ist: `ContractWizard.svelte:306-316` zeigt auf Schritt 2 `ApartmentStep` mit `loading={!contracts}`; solange
`contracts` null ist, rendert `ApartmentStep.svelte:31-32` nur `<p role="status">` (eine Zeile). Wenn `loadContracts()`
(`ContractWizard.svelte:134-142`) `contracts` setzt, ersetzt der `Select` (Label, Hilfetext, Control) diese Zeile. `WizardNav`
steht unterhalb der `<section>` (`ContractWizard.svelte:350`), daher rutscht «Weiter» nach unten, auch **ohne** Hinweis
(die Zeilen nutzen `freeApartment`, `tests/a11y/screens.json` ab Zeile 271, also keinen OpenContracts- oder Verfügbarkeitshinweis).
Das ist genau der Mechanismus, den der Fix für «overlap-warning» und `goToRentWith` behebt; der Fix ist unvollständig, und
Firefox/WebKit können in diesen Zeilen gleich scheitern (dann an `EnterDate … into(startDateInput)`). Die Anforderung ist «main's CI
grün», und der Aufrufer bat ausdrücklich um die Suche nach weiteren Doppelklicks.

Wie zeigen: lokal nur mit Firefox/WebKit reproduzierbar (wie «overlap-warning», Lauf 612); im Code nachvollziehbar wie oben.
Behebung: das zweite `Click.on(nextButton)` durch `keepApartment` ersetzen (der Import ist schon da).

## Geprüft und bestätigt

- **Gleiches Update für Auswahl und Hinweis:** `loading`, `openContracts` (OpenContracts), `startLimit.notice` (`availability-info`)
  und `unknown` sind alle `$derived` aus dem einen `$state` `contracts`, das in `loadContracts()` in einer synchronen Zuweisung gesetzt
  wird (`listed` direkt danach im selben Task). Svelte 5 flusht das in einem Durchlauf; die Wohnungsauswahl und beide Hinweise
  erscheinen zusammen. Der Vorschlags-Effekt (`ContractWizard.svelte:169-175`) ändert nur `values.startDate`, das Schritt 2 nicht
  rendert. `Wait.until` wartet auf `visible` (`screenplay/interactions.ts:106`). Warten auf `apartmentSelect` reicht also.
- **Erster Klick (Schritt 1):** `TenantStep` hängt nicht von `contracts` ab; dort verschiebt das Laden nichts.
- **Weitere Doppelklicks durch eine vorgewählte Wohnung:** `overlap-warning`, `rent-taken-over`, `goToRentWith` behoben;
  `contracts-unknown-review` (`accessibility.ts:411-413`) wartet auf `apartmentContractsUnknown`, das im selben Update wie die
  Auswahl erscheint: ok; `contracts-unknown` klickt nur einmal und wartet dann; `contractWizardSteps` wartet nach jedem Klick auf
  den nächsten Schritt; `fillContract`/`chooseTenantAndApartment` wählen die Wohnung per `Select.option` (wartet auf das Select);
  die Steps «weitergeht» klicken einmal, danach prüft ein `Dann`. Offen bleibt nur C-1.
- **Screenplay-Schichten:** `keepApartment` ist eine Task in `tasks/contract-form.ts` aus Interaktionen und Targets; `accessibility.ts`
  (Task-Ebene) importiert sie; keine Step-Datei geändert, kein Locator ausserhalb `targets/`. Kein `Wait`-Doppel (`goToNextStep`
  ist `Click.on(nextButton)`), die Task wartet auf den Zustand vor dem nächsten Schritt.
- **Scope/Einfachheit (ponytail-review):** kleinster Diff, nichts Unbenutztes, keine fremden Änderungen; der Plan-Eintrag beschreibt
  die Änderung und die Dateien.
- **Pflichtpunkte:** keine Verhaltensänderung der App (nur Testcode), daher kein neues Szenario, keine neuen Texte/Bildschirme; keine
  API-Antwort geändert.
- **Rote Tests:** Fix an Testcode gegen eine Flake; ein Rot ist nur in Firefox/WebKit sichtbar (Lauf 612, Screenshot laut Aufrufer).
  Keine neue Szenariozeile.

## Nicht bestätigt

- lint, check, prettier auf den geänderten Zeilen: vom Aufrufer gemeldet.
- Chromium-Zeilen (13 passed) und `contract-new.feature` Chromium + API (33 passed): vom Aufrufer gemeldet; E2E nicht selbst gestartet.
- Dass der Fix in Firefox/WebKit grün ist (und dass Lauf 600 in WebKit dieselbe Ursache hat): nur per Code-Lesen plausibel;
  Firefox/WebKit nicht verfügbar, CI-Logs und Screenshot nicht eingesehen.
