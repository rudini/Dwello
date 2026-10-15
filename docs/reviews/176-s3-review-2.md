# Code-Review #176 Slice 3, Runde 2 (Delta)

Worktree `review-176-s3-delta` auf `679089a`. Geprüft ist das Delta `9253072..679089a` mit allen 16 Dateien. `9253072` (das `@wip`-Datenschutzszenario und `backend/scripts/llm-eval.ts`) habe ich nur überflogen. Zusätzlich gelesen, weil das Delta sie mitbetrifft: `DistributionKeyForm.svelte`, `HeatingProfileForm.svelte`, `Button.svelte`, `Alert.svelte`, `PeriodStep.svelte` (verwendet ebenfalls `RadioGroup`), `new/+page.svelte`, die Aufrufer von `focusFirstError` und `helpers/dom.ts`.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| E-11 | Major | `src/routes/config/SaveForm.svelte:44-51` | Der Enter-Handler ruft `form.requestSubmit(<Speichern-Knopf>)` auch dann auf, wenn der Knopf `busy` und damit `disabled` ist (`Button.svelte:88`). Ein zweites Enter während des Speicherns sendet also ein zweites Mal. Das betrifft alle drei Stammdaten-Formulare. Bisher hat die implizite Übermittlung des Browsers einen deaktivierten Standardknopf übersprungen. |
| E-12 | Minor | `src/routes/config/SaveForm.svelte:59-65` | `saving` und `checking` werden gemeinsam auf `false` gesetzt, sobald irgendeine Antwort eintrifft. Wer während der KI-Prüfung speichert (Klick oder Enter), bekommt den Speichern-Knopf wieder freigegeben, sobald die Prüfung endet, obwohl das Speichern noch läuft. Der Prüfknopf ist schon ab dem Speicherklick nicht mehr `busy`, obwohl die Prüfung noch läuft. |
| E-13 | Minor | `src/routes/config/categories/CategoryForm.svelte:111-113`, `CategoryProposal.svelte:10` | Die Live-Region (`role="status"`) entsteht erst zusammen mit ihrem Inhalt (`{#if proposal}` um die ganze Komponente). Ein Screenreader sagt meist nur Änderungen in einer Region an, die es schon gibt. Der erste Vorschlag, also der Hauptfall, wird daher oft nicht angesagt. Der Test prüft nur, dass die Rolle vorhanden ist (`categories-page.dom.test.ts:165-169`). E-3 ist damit noch offen. |
| E-14 | Minor | `src/routes/config/SaveForm.svelte:43-51`, `DistributionKeyForm.svelte:89` | Beim Verteilschlüssel speichert Enter in «Formel» jetzt, statt wie bisher «Formel testen» auszuführen (der Prüfknopf steht im Baum vor dem Speichern-Knopf). Das Verhalten eines anderen Formulars ändert sich, ohne Test in `distribution-keys-pages.dom.test.ts` und ohne Eintrag im Plan. |
| E-15 | Minor | `CategoryForm.svelte:102-108`, `Button.svelte:88` | `busy` deaktiviert den Prüfknopf, der gerade den Fokus hat. Nach der Focus-Fixup-Regel fällt der Fokus dann auf `body`. Nach einem Vorschlag findet `focusFirstError` (`SaveForm.svelte:66`) kein Ziel, weil die Ton-`caution`/`info`-Alerts keine Rolle `alert` haben. Wer mit der Tastatur arbeitet, beginnt nach jeder KI-Prüfung wieder oben auf der Seite. |
| E-16 | Nit | `src/lib/server/category.ts:89-96` | Ein 422 (Name über 100 Zeichen) zeigt jetzt «Die KI ist nicht erreichbar oder ist sich nicht sicher». Das ist richtig übersetzt, sagt aber nicht, was passiert ist. |
| E-17 | Nit | `src/__tests__/categories-page.dom.test.ts:152-162`, `implementation_plan.md:108` | Für den Test «lässt eine eigene Wahl stehen …» gibt es keine Zeile `Test red`. Mit dem alten Code konnte er nicht rot sein. Rot wäre er nur gegen die Variante «immer zurücksetzen». |
| E-18 | Nit | `src/routes/config/SaveForm.svelte:44` | `<svelte:window onkeydown>` mit der Prüfung `field.form !== form` lässt sich mit `onkeydown` direkt am `<form>` kürzer schreiben, ohne globalen Listener. |

## Frühere Befunde (Runde 1)

| ID | Status | Beleg |
|----|--------|-------|
| E-1 | behoben | `CategoryForm.svelte:54-60`: `kiChoice` merkt sich die Wahl der KI. Bei `{ error }` wird nur zurückgesetzt, wenn die Wahl noch der KI-Wahl entspricht (über `untrack`, also ohne Schleife). Tests in `categories-page.dom.test.ts:141-162`, von mir grün ausgeführt. Sonderfall ohne Gewicht: Hat der Liegenschaftsverwalter erst um- und dann auf denselben Wert zurückgewählt, setzt eine spätere unsichere Prüfung seine Wahl zurück. |
| E-2 | behoben | Der Selektor in `focus-error.ts:10-12` liefert den ersten Treffer in Dokumentreihenfolge, auch über beide Teile der Selektorliste. Die Radios verweisen auf die Meldung (`RadioGroup.svelte:26-29,60`). Test `categories-page.dom.test.ts:286-294` ist grün. In `PeriodStep.svelte:96` hat die `RadioGroup` keinen `error`, dort ändert sich also nichts. |
| E-3 | offen | Siehe E-13. |
| E-4 | behoben, mit Nachfolgern | Der Knopf ist `busy` (Test `:172-184`). Siehe E-12 und E-15. |
| E-5 | behoben für Kategorien | Test `:268-275`. Siehe E-11 und E-14. |
| E-6 | behoben | `category.ts:89-96` mit Tests `categories.test.ts:167-182`. Den eigenen Text des Backends zeigt die Seite nicht mehr, `null` führt nicht mehr zu einem TypeError. Siehe E-16. |
| E-7 | behoben | `messages/it.json:1087` lautet «L’inquilino». In `it.json` kommt «conduttore» nicht mehr vor. |
| E-8 | Ablehnung trägt | Die Wahl bleibt sichtbar, und die Begründung lässt sich durch erneutes Prüfen wieder holen. |
| E-9 | behoben | Die Doppelungen sind aus `targets/accessibility.ts` entfernt. `tasks/accessibility.ts:70-73` nutzt `targets/categories`, das erlauben die Schichtregeln. Es gibt keine Restverweise. |
| E-10 | Ablehnung trägt | Das betrifft nur den Stellvertreter, und das Backend sendet immer `messages`. |

## Blocker/Major

### E-11 (Major): Enter speichert ein zweites Mal, während das Speichern läuft

`SaveForm.svelte:44-51`:

```svelte
<svelte:window
	onkeydown={(event) => {
		...
		event.preventDefault();
		form.requestSubmit(form.querySelector<HTMLButtonElement>(`[data-testid="${submitTestid}"]`));
	}}
/>
```

**Warum falsch:** `requestSubmit(submitter)` prüft laut HTML-Spezifikation nur, ob der Knopf ein Submit-Knopf dieses Formulars ist. Ob er `disabled` ist, prüft es nicht. Die implizite Übermittlung des Browsers dagegen tut nichts, wenn der Standardknopf deaktiviert ist. Bisher hat das `busy` des Speichern-Knopfs (`disabled={disabled || busy}`, `Button.svelte:88`) ein zweites Enter wirkungslos gemacht, zum Beispiel bei den Heizprofilen, deren einziger Submit-Knopf der Speichern-Knopf ist. Jetzt geht ein zweiter POST hinaus, und `use:enhance` setzt `saving` erneut. Ein zweites Enter ist bei der Zielgruppe (unerfahren, wenige Male im Jahr) nicht selten, gerade wenn der Server langsam antwortet.

Folgen bei einem neuen Datensatz:
- Kategorien und Heizprofile prüfen den Namen nur in der Anwendung, vor dem Einfügen (`category.service.ts:157`, `heating-profile.service.ts:181`). In `backend/src/db/schema.ts:162-220` gibt es keinen eindeutigen Index auf den Namen. Laufen die beiden Anfragen gleichzeitig, entstehen zwei gleichnamige Datensätze.
- Sonst wird die zweite Anfrage mit «Name schon vergeben» abgelehnt. Diese Ablehnung trifft nach der Weiterleitung der ersten ein, und `update()` wendet sie auf die neue Seite an.

Dazu kommt bei der Kategorie: Während der KI-Prüfung (der Prüfknopf ist `busy`) startet Enter im Namen ein Speichern, das neben der Prüfung herläuft (siehe E-12).

**Nachweis:** Der DOM-Test `speichert mit Enter im Namen …` ersetzt `requestSubmit` durch einen Mock und sieht das nicht. So lässt es sich zeigen: Den Test so erweitern, dass zuerst `server.submit!(...)` mit dem Speichern-Knopf als `submitter` aufgerufen wird (jetzt ist `saving` true, der Knopf ist `disabled`), dann Enter auf `category-name-input` auslösen. Erwartet wird, dass `requestSubmit` nicht aufgerufen wird. Heute wird er aufgerufen. Im Browser: `/config/heating-profiles/new`, Name und Anteile ausfüllen, Netzwerk drosseln, im Namen zweimal Enter drücken. Im Netzwerk-Tab erscheinen zwei POST-Anfragen.

**Behebung, kurz:** Nur senden, wenn der Knopf nicht deaktiviert ist (`if (!button.disabled) form.requestSubmit(button)`). Oder `button.click()` aufrufen, das einen deaktivierten Knopf von sich aus ignoriert. Ob während `checking` gespeichert werden darf, gehört zu E-12.

## Nicht bestätigt

- Selbst ausgeführt, alle grün: `bunx vitest run` für `categories-page.dom.test.ts`, `categories.test.ts` und `focus-error.dom.test.ts` (49 Tests) sowie `distribution-keys-pages.dom.test.ts`, `heating-profiles-pages.dom.test.ts`, `contract-wizard.dom.test.ts` und `category-predefined.dom.test.ts` (52 Tests). Dabei gibt jsdom einmal «Not implemented: HTMLFormElement's requestSubmit() method» aus. Ob das neu ist (aus dem Fenster-Listener) oder schon vorher kam (Klick auf einen Submit-Knopf), habe ich nicht geklärt, weil ich im Worktree keinen anderen Commit auschecken darf.
- Nur vom Aufrufer gemeldet: lint, `bun run check`, `deepcheck:audit`, das Fallow-Gate und `test:coverage` (abgesehen von den zwei absichtlich roten Datenschutz-Tests, die nicht im Commit sind). Laut Aufrufer sind die E2E-Läufe nach diesen Fixes noch nicht wiederholt. Damit sind die Szenarien «Kostenkategorien», accessibility und sprachen-bildschirme auf `679089a` unbestätigt.
- E-11, E-12, E-13 und E-15 habe ich aus dem Code und dem Verhalten nach HTML-Spezifikation und Screenreader-Praxis abgeleitet. Ausgeführt habe ich sie nicht: Ich darf keine Testdatei schreiben und kein E2E starten. Wie gut verschiedene Screenreader eine frisch eingefügte `role="status"`-Region ansagen, ist unterschiedlich (E-13).
- Dass die rot gezeigten Tests rot waren, steht nur in der Planzeile `implementation_plan.md:108`. Nachvollzogen habe ich das nicht.
- `9253072` (`llm-eval.ts`, `privacy.feature`, `app-frame.steps.ts`) habe ich laut Auftrag nur überflogen und nicht geprüft.
- Die Doku-Zeile in `docs/test-pyramid.md:82` passt: `backend/src/__tests__/helpers/llm.ts` existiert. Laut Planzeile `:107` gehört sie zur Behebung D-11 aus Slice 1–2, ist also kein fremder Umbau. Den Inhalt von `docs/reviews/176-s12-review-2.md` (Bericht der anderen Runde) habe ich nicht geprüft.
