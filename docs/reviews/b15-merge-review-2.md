# Code-Review B-15 Merge, Runde 2

Anforderung: Issue #152 zusammengeführt mit dem B-13-Fix (#143, #151): «Erneut versuchen» behält Eingabe und Fokus, nur die letzte Antwort zählt.
Bereich: nur das Delta `git diff 3d0e1ba..e67b11c` (e67b11c) und die offenen Befunde aus `docs/reviews/b15-merge-review-1.md`.
Gelesen: `src/routes/contracts/ContractForm.svelte` (ganz bis zum Hinweis beim Vertragsbeginn), `src/__tests__/contract-edit.dom.test.ts` (Block «nach «Erneut versuchen»» und die #143/#151-Tests davor), `src/routes/contracts/new/ContractsUnknown.svelte`, `src/__tests__/helpers/dom.ts` (`click`, `settle`), `docs/archive/implementation-plan-verlauf.md` (Session 26), `tests/e2e/features/contract-edit.feature:55-77`.

## Stand der Befunde aus Runde 1

| ID Runde 1 | Schwere | Status | Nachweis |
|---|---|---|---|
| M-1 | Major | behoben | `ContractForm.svelte:65,90`: `unknown` ist jetzt ein eigener Zustand und ändert sich erst, wenn eine Antwort entscheidet. Während des Ladens bleibt der Hinweis mit «Erneut versuchen» im DOM, der Fokus bleibt auf dem Knopf, auch nach einem erneuten Fehler. Da der Hinweis im `role="status"` nicht verschwindet und neu erscheint, fällt auch die doppelte Ansage weg. Test `contract-edit.dom.test.ts:225-232` prüft den Fokus direkt nach dem Klick (`click` ruft `flushSync`, die Prüfung ist also nicht trivial) und nach `settle()`. In Runde 1 schlug derselbe Test auf 3d0e1ba mit Fokus auf `BODY` fehl. |
| m-1 | Minor | behoben | Der Zähler `contractsRequest` wird wieder gebraucht (zwei Klicks während des Ladens sind möglich). `loadContracts()` gibt `false` zurück, wenn eine neuere Anfrage es überholt hat, und `retry()` meldet dann nichts (`:87,100`). Test `:235-253`: Der erste Versuch antwortet spät mit 500, der zweite lädt. Danach bleibt der Hinweis weg, und es gibt genau einen Erfolgs-Toast. Ohne die Abfrage `request !== contractsRequest` würde die späte Antwort `unknown = true` setzen und einen Fehler-Toast auslösen: Beide Erwartungen würden fehlschlagen. Das habe ich aus dem Code abgeleitet und nicht ausgeführt. |
| m-2 | Minor | behoben | Der trivial grüne Test ist durch «nimmt nur die letzte Antwort, wenn zweimal versucht wird» ersetzt. Dieser beantwortet die überholte Anfrage wirklich und deckt den früheren Fall U-19 bzw. R2-2 ab. |
| n-1 | Nit | behoben | `ContractsUnknown.svelte:17`: «The apartment's contracts …». |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `docs/archive/implementation-plan-verlauf.md:5467-5470` | Zu den beiden neuen Tests fehlen die Zeilen `Test red: <Test> – <Meldung>`. «fixed (test first)» nennt weder den Test noch die Meldung. Für M-1 ist der rote Lauf in Runde 1 belegt, für den Test zur überholten Antwort nirgends. |

## Blocker / Major

Keine.

## Geprüft und in Ordnung

- Der Hinweis beim Vertragsbeginn (`start-contracts-unknown`, `ContractForm.svelte:241`) hängt am selben `unknown` und bleibt während eines Versuchs ebenfalls stehen. Das ist folgerichtig, weil die Überschneidung bis zur Antwort weiter nicht geprüft ist.
- `deleteDraftAndSave` prüft weiter `contractsState !== 'loaded'`. Während eines erneuten Versuchs nennt die Meldung «lädt noch» (`contractsMessage('loading')`), das passt zum Zustand.
- Beim ersten Laden ist `unknown` `false`, bis die Antwort scheitert. Das entspricht dem Verhalten vor dem Delta.
- Kein Text geändert, also keine `messages/*.json` betroffen. Kein neuer Bildschirm und kein neuer Zustand (a11y- und Sprachlisten bleiben gleich). Keine E2E-Dateien im Delta.
- Kein neues Szenario nötig: M-1 war ein Rückschritt innerhalb des noch nicht zusammengeführten Branches. Gegenüber `main` stellt das Delta das Verhalten von #151 wieder her. Der Fokus ist im DOM-Test geprüft, der niedrigsten Schicht, die ihn zeigen kann. Die Szenarien zu #151 (`contract-edit.feature:62-77`) sind unverändert.
- Das Delta ist knapp: 12 Zeilen in der Komponente, keine Änderungen ausserhalb der Anforderung. Mit dabei sind nur der Bericht aus Runde 1 und der Eintrag im Plan.
- `bunx vitest run src/__tests__/contract-edit.dom.test.ts`: von mir erneut ausgeführt, 37 von 37 grün.

## Nicht bestätigt

- Dass der Test zur überholten Antwort ohne den Zähler rot wird, habe ich nur aus dem Code abgeleitet (`ContractForm.svelte:87-90`). In einer Kopie ausgeführt habe ich ihn nicht.
- `bun run test:coverage`, `lint`, `check`, `deepcheck:audit`, die Backend-Tests und E2E habe ich nicht ausgeführt. Der Aufrufer hat dazu keine Ergebnisse gemeldet. Laut Plan ist der Punkt «Finish» (Session 26) noch offen.
- Die Ausgabe des Bildschirmlesers (keine doppelte Ansage mehr) habe ich aus dem Code abgeleitet, nicht mit einem Screenreader geprüft.
