# Code-Review 1197, Runde 2 (Abschlussrunde, Slice Persona Helga P-1)

Bereich: `git diff e6c06ab ad1f192 -- . ':!docs/reviews'` (Worktree review-1197-code2, ad1f192)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde |

Geprüft: Das Ziel des Selektors in `showErrors()` (`StatementWizard.svelte:192`). Es greift nur, wenn `AgreementsCheck` den Alert zeigt, und das geschieht nur in Schritt 3, weil `LateChecks` den `step` bekommt. Ein ungültiges Feld in Schritt 3 steht im DOM früher und bekommt den Fokus weiterhin zuerst. Während eines erneuten Versuchs ist «Weiter» belegt («Bitte warten …»), also ist kein Konflikt mit #688 möglich. Der DOM-Test (`statement-wizard.dom.test.ts:1341`) und das neue Szenario (`statement-agreed-costs.feature:111`) schlagen ohne den Selektorzusatz fehl: Ohne ihn bleibt der Fokus auf der Überschrift (DOM-Test) bzw. auf «Weiter» (E2E). Der zusammengelegte Regex-Schritt (`agreed-costs.steps.ts:75`) prüft für das bestehende Szenario (Zeile 133) dasselbe wie vorher, also wird nichts gelockert. Es gibt keine neuen Texte und keinen neuen Bildschirm oder Zustand (der Alert ist bereits erfasst), daher sind `messages/*.json` und `screens.json` nicht betroffen. Das Feature beschreibt das Ziel, nicht die Bedienung. Der Schritt ruft nur eine Question auf, die Screenplay-Schichten sind eingehalten. Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Vom Aufrufer gemeldet (nicht selbst ausgeführt): `bun run lint`, `bun run check`, `bun run fitness`, vitest `statement-wizard.dom.test.ts`, `agreed-costs.dom.test.ts` sowie die Tests, die screens.json, messages und features lesen (708 bestanden). Ebenfalls gemeldet: der Rot-Lauf des DOM-Tests vor dem Fix und der Rot-Lauf des Szenarios mit ausgebautem Fix ("Weiter" erhalten), danach grün. E2E chromium auf die gefilterten Szenarien, 193 bestanden.
- Ob `focus()` den Knopf bei 150 % bzw. 200 % Zoom so weit ins Bild scrollt, dass auch der Titel des Alerts zu sehen ist: Das hängt vom Browser ab und lässt sich durch Lesen nicht beurteilen. Natives `focus()` scrollt nur das Element selbst ins Bild. Bestätigen würde das erst eine erneute Persona-Runde.
