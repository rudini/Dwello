# Code-Review 653, Runde 5 (Fix Fallback-Review #1127), db1f458 gegen de96fb0

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/features/statement-send.feature:76-84 | Die Korrektur ändert Verhalten, das Nutzer bemerken (Fokus bleibt nach «Stattdessen per Brief zustellen» im Dialog, der Dialog beschreibt sich danach mit dem Brief-Text), hat aber kein Szenario und kein `No scenario: <reason>` (der Commit nennt keins) |

## C-1 (Major): Szenario fehlt für den sichtbaren Fix

Warum falsch: CLAUDE.md, Workflow 1, verlangt für jede Verhaltensänderung, auch für einen Fix, den ein Nutzer bemerkt, ein Szenario ohne `@wip`. Ein `No scenario: <reason>` gilt nur, wenn der E2E-Stack den Zustand nicht herstellen kann. Hier kann er es: «Stattdessen per Brief zustellen» (statement-send.feature:76) erreicht genau diesen Zustand. Ein Schritt, der den Fokus im Dialog prüft, ist schon üblich (contract-detail.feature:28 «steht der Fokus im Feld … des Dialogs»), und «erklärt die Bestätigung des Versands» (statement-send.steps.ts:58) prüft schon die Erklärung des Dialogs. Den Teil mit dem Fokus gab es schon vor diesem PR (der Knopf entfernt sich selbst, der Fokus fällt auf `body`). Er ist also ein Fix an Verhalten von `main`, nicht nur am eigenen Code des PRs. Die Ausnahme in Workflow 2 («A scenario added for a fix whose lower-layer test was seen red needs no red run») erspart nur den Rotlauf, nicht das Szenario.
So zeigt man es: Man ergänzt im Szenario «Stattdessen per Brief zustellen» nach dem Wechsel zum Brief und vor dem Bestätigen etwa «Dann steht der Fokus im Dialog» und «Und erklärt die Bestätigung des Versands "Dwello verschickt die Abrechnung nicht selbst."». Auf de96fb0 schlagen beide fehl (der Fokus liegt auf `body`, `aria-describedby` zeigt auf einen entfernten Absatz). Prüfen sollte man das in der Version, in der die Questions nur über den Screenplay-Layer gehen.

## Nicht bestätigt

- Lint ohne Befund, `bunx vitest run src/__tests__/statement-pages.dom.test.ts src/__tests__/ui-dialog.dom.test.ts` mit 265 bestandenen Tests, der neue DOM-Test vor dem Fix rot: vom Aufrufer gemeldet.
- E2E statement-detail, invoice-detail und contract-detail: vom Aufrufer gemeldet als laufend, Ergebnis unbekannt.
- Ob jsdom `document.activeElement` nach dem Entfernen des fokussierten Knopfs auf `body` setzt, ob also die Fokus-Assertion des neuen Tests (statement-pages.dom.test.ts:1683) ohne Fix rot war: nur gelesen, nicht ausgeführt. Der Commit meldet den Test als rot gesehen, der Aufrufer nennt aber nur die fehlende Beschreibung als Grund.
- Verhalten in echten Browsern (Chrome und Firefox setzen den Fokus beim Entfernen auf `body`, die Observer-Callback läuft danach als Microtask): nur gelesen.

Geprüft: keine Schleife (der Observer beobachtet nur `childList`/`subtree`; die gesetzte `id`, das neu gezeichnete `aria-describedby` und das Fokussieren sind Attribut- oder Fokusänderungen; ein Blur-Fehler, den das Fokussieren auslöst, findet `activeElement` schon auf dem Panel). Zusammenspiel mit dem Effekt für den ersten Fokus (läuft vorher, Fokus liegt dann nicht auf `body`) und dem Busy-Effekt (beide fokussieren dasselbe Panel). `disconnect` beim Schliessen leert die Warteschlange. Ein Dialog hinter einem anderen ist `inert` (makeInert), dort bleibt `focus()` wirkungslos. Fehlermeldungen (ActionDialog:88, DeleteDialog:93) stehen nach dem ersten Absatz und ändern die Beschreibung nicht. Die Live-Zeile von DateInput ist durch `p:not([aria-live])` bzw. ein `div` ausgeschlossen. Den Fokus kann es nur dann holen, wenn er schon auf `body` liegt.
