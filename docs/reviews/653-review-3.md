# Code-Review 653, Runde 3 (Abschluss): 5e33016..3ea611c und Merge d2a9396

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-6 | Blocker | src/routes/statements/[id]/FormDialog.svelte:56-58 | Der Merge setzt nach jeder erfolgreichen FormDialog-Aktion den Fokus auf `#statement-status-line`, auch nach «Neu berechnen» in den weiteren Aktionen (MoreActions.svelte:76-82). Damit bricht das Szenario von main ohne `@wip` «Nach dem Neuberechnen bleibt der Liegenschaftsverwalter, wo er war» (statement-detail.feature:1003-1009). |
| C-7 | Major | src/__tests__/statement-pages.dom.test.ts:993-1003, 1941-1953 | Der Merge hat die Tests von #1096 («setzt den Fokus nicht selbst auf den Seitentitel») durch die Tests von #653 ersetzt. Es fehlt ein DOM-Test, der zeigt, dass «Neu berechnen» (ein Bedienelement, das bleibt) den Fokus nach der Aktion behält. So hat kein Unit-Test C-6 gefangen, und die 271 grünen Tests sagen darüber nichts. |

## C-6 (Blocker): Der Merge bricht das Szenario «Nach dem Neuberechnen …» von main

Die Begründung des Merges trifft nur für die Aktionen im PageHeader zu: «Als bezahlt markieren» (+page.svelte:320-338) und Versenden (SendDialog). FormDialog wird aber auch an anderen Stellen gebraucht, jeweils mit `success`: MoreActions.svelte:70 (`redeliver`) und :82 (`recalculate`), Correction.svelte:154, NewPdfToSend.svelte:27, CarrySettleDialog.svelte:17 und ResetPaymentDialog.svelte:54. MoreActions liegt in der Seitenleiste in einem `Panel` (MoreActions.svelte:29), nicht im PageHeader. «Neu berechnen» bleibt nach der Aktion stehen: Der Dialog gibt den Fokus an diesen Knopf zurück, und auf main bleibt er dort. Das ist der Fall «a control drawn anew keeps it» in focus-after-action.ts:57, getestet in focus-after-action.dom.test.ts:70-76. Seit d2a9396 läuft nach `await tick()` der Aufruf `document.getElementById('statement-status-line')?.focus()` und nimmt dem Knopf den Fokus weg.

So schlägt es fehl:
- `Dann steht der Fokus wieder auf «Neu berechnen»` (statement-detail.steps.ts:950-952): `focusedText` ergibt «Status: Entwurf» statt «Neu berechnen».
- `Und bleibt die Seite an ihrer Stelle, …`: `focus()` läuft ohne `preventScroll`. Die Statuszeile steht oben unter dem PageHeader (+page.svelte:225-239), und `stayAtMoreActions` (tasks/statement-detail.ts:161) hat die Seite zuvor auf die Mitte der weiteren Aktionen gescrollt. Der Browser scrollt also zur Statuszeile hinauf. Genau diesen Sprung hat #1096 behoben («nach «Neu berechnen» sprang die Seite ganz nach oben»).

Das widerspricht auch dem Entscheid in #1096: Der Fokus bleibt, wo der Liegenschaftsverwalter war. Erneutes Zustellen (`redeliver`) ist genauso betroffen, sofern sein Knopf bleibt.

Lösung im Sinn beider Issues: Den Fokus nur dann auf die Statuszeile setzen, wenn er nach der Aktion auf `body` liegt, also wenn das Bedienelement verschwunden ist (`if (document.activeElement === document.body)`). Oder nur für die Aktionen im PageHeader, über eine Prop. Der Test dazu gehört zuerst rot in statement-pages.dom.test.ts (siehe C-7). Danach das E2E-Szenario Zeile 1003 laufen lassen.

## C-7 (Major): Kein Test unter E2E für den behaltenen Fokus nach «Neu berechnen»

Die Auflösung des Konflikts in statement-pages.dom.test.ts übernimmt nur die Seite von #653. Die Erwartung von #1096 («nicht auf dem Seitentitel», «wo er war») hat in diesem Seitentest keinen Ersatz für Aktionen, deren Knopf bleibt. focus-after-action.dom.test.ts prüft nur das Modul mit eigenem Markup, nicht FormDialog. Der Fall ist im DOM zeigbar: Detailseite eines Entwurfs, «Neu berechnen», bestätigen, `settle()`, dann `document.activeElement` gleich `statement-recalculate-button` (die testid der Seite). Auf d2a9396 wäre dieser Test rot.

## Nicht bestätigt

- E2E nach dem Merge: nicht gelaufen (vom Aufrufer gemeldet). C-6 ist aus dem Code abgeleitet: FormDialog.svelte:51-60, MoreActions.svelte:76-82, statement-detail.steps.ts:945-952, tasks/statement-detail.ts:161.
- Vom Aufrufer gemeldet, auf d2a9396 grün: `bun run lint`, `bun run check`, `bun run fitness`, `bunx vitest run src/__tests__/statement-pages.dom.test.ts src/__tests__/focus-after-action.dom.test.ts src/__tests__/ui-dialog.dom.test.ts` (271 bestanden).
- Ob nach dem Fix von P-1 im Dialog «Mietvertrag beenden» der Hinweis `contracts_end_notice_hint` die Beschreibung wird: nur gelesen (contracts/[id]/+page.svelte:193-261, DateInput.svelte:178-185), nicht im Browser gesehen.

Geprüft: Den Fix von C-5 (Kommentar in Dialog.svelte:40) und P-1 (`p:not([aria-live])` in Dialog.svelte:77-80; der neue Test ui-dialog.dom.test.ts:74-85 ist ohne die Änderung rot, weil sonst die leere Zeile `d-words` die Beschreibung wäre). Den Import von `tick` in FormDialog.svelte:3 hat der Merge wiederhergestellt. Der Kommentar von SendDialog passt (dort verschwindet der Knopf). Die übrigen Merge-Dateien unter `src` hatten keinen Konflikt.
