# Code-Review Slice 653, Runde 2 (Delta 2ed01f5..5e33016)

Geschlossen: C-1, C-2, C-3, C-4

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-5 | Minor | src/lib/ui/Dialog.svelte:40 | Der Kommentar zu `describedby` sagt «describes a wide dialog». Seit diesem Delta setzt aber «Abrechnung korrigieren» (`Correction.svelte:156`, über `FormDialog`) die Prop für einen schmalen Dialog und gibt zwei ids an. Der Kommentar stimmt also nicht mehr (in `FormDialog.svelte:35` stimmt er) |

## Nicht bestätigt

- Die Checks des Aufrufers, alle «vom Aufrufer gemeldet»: `bunx vitest run` 4078 grün (vor dem Correction-Test), danach statement-pages 235 grün, `bun run lint` sauber, `bun run check` 0 Fehler, E2E Chromium statement-detail/statements/contract-detail/invoice-detail 226 grün.
- C-1 im ganzen Ablauf: Der neue Test (`ui-dialog.dom.test.ts:139`) zeigt nur, dass bei `onconfirm` der Knopf den Fokus hat. Dass der Wert des Felds bis dahin übernommen ist, habe ich nur aus dem Code geschlossen. `DateInput.svelte:115-119` setzt beim `blur` den bindbaren Wert `value` synchron. Der Listener `onclickcapture` am Footer läuft in der Capture-Phase vor dem delegierten `onclick` des Knopfs. Einen DOM-Test mit «31.12.26» und einem Mausklick auf `contract-end-confirm` gibt es nicht.
- Die roten Läufe habe ich nur durch Lesen geprüft. Jeder der fünf neuen Tests schlägt auf 2ed01f5 fehl:
  - bei `onconfirm` steht der Fokus noch im Feld;
  - der Fokus landet auf `body`, weil die Zeile fehlt;
  - der gefährliche Dialog beginnt im Feld;
  - die Beschreibung ist der Hilfetext;
  - die Beschreibung endet mit dem ersten Absatz statt mit «Das lässt sich nicht rückgängig machen.».
- C-3 trifft auch «Mietvertrag löschen» (`DeleteContract.svelte:72`, Checkbox): Der Dialog beginnt jetzt auf dem Panel. Das passt zur Regel. Dass ein Screenreader beim Fokus auf dem Panel Titel und Beschreibung vorliest, habe ich nicht im Browser geprüft.

Geprüft: alle 6 Dateien des Deltas; die gefährlichen Dialoge mit Feldern (Correction, DeleteContract; die übrigen danger-Dialoge haben kein Feld); Tab vom Panel aus (`trapFocus`, `compareDocumentPosition` mit CONTAINED_BY|FOLLOWING) führt ins erste Feld; Enter auf dem Panel bestätigt nicht (`confirmFromField` nur bei `input`); `[data-results]` gibt es in `ResultList` und `EmptyState`, auch die leere gefilterte Liste ist also abgedeckt; Field-, Checkbox- und Hinweis-Absätze sind über `aria-describedby` referenziert und werden übersprungen; keine neuen Texte oder Bildschirme; ponytail-review: nichts zu kürzen.
