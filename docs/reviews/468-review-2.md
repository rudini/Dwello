# Code-Review #468, Runde 2 (Re-Review)

Geprüft wurde das Delta `git diff f1a657bc 4c51cbb7 -- . ':!docs/reviews' ':!implementation_plan.md'` (Commit 4c51cbb7) im Worktree `review-468`. Gelesen: alle vier geänderten Dateien vollständig im Delta.

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-1 | Major | **geschlossen** | `BuildingStep.svelte:32,50,61-64` und `FeeNotAgreed.svelte:22,30,34-37`: Pro Lauf des Effekts gibt es ein Flag `left`. Der Teardown setzt es, und `.then` kehrt dann sofort zurück. Damit sind alte Antworten einer zerstörten Instanz und eines neu gestarteten Effekts beide abgefangen. Der Test «wartet beim erneut geöffneten Schritt auf dessen eigene Antworten» (`statement-wizard.dom.test.ts:286`) entspricht meinem Probe-Test aus Runde 1, und der war ohne Fix rot. |
| C-2 | Minor | teilweise | Der neue Test «lässt weitergehen, wenn Rechnungen und Abrechnungen nicht geladen werden konnten» (`:307`) deckt Schritt 2 nach einem Fehler ab. Laut Commit-Nachricht hält er bestehendes Verhalten fest, so wie die Basis es zeigt (ohne Sperre war «Weiter» immer aktiv); das ist kein Bugfix. Weiterhin fehlen Schritt 3 nach einem Fehler und das Verlassen von Schritt 3 während des Ladens; siehe auch C-9. |
| C-3 | Minor | offen | Begründung angekündigt für den Schlussbericht |
| C-4 | Minor | offen | ebenso |
| C-5 | Minor | offen | ebenso |
| C-6 | Nit | **geschlossen** | `contract-wizard.dom.test.ts:436`: Der Kommentar steht wieder über seinem Test. |
| C-7 | Nit | offen | ebenso |
| C-8 | Nit | offen | ebenso |

## Neue Befunde im Delta

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-9 | Minor | `src/routes/statements/generate/FeeNotAgreed.svelte:22,30` | Der Fix für C-1 in `FeeNotAgreed` hat keinen eigenen Test. Der neue Test prüft nur Schritt 2. Würde man `if (left) return;` in `FeeNotAgreed` entfernen, bliebe die Suite grün. Ein Test für Schritt 3 mit «Zurück» und «Weiter», bei dem nur die alte `/statements/billed`-Antwort ankommt, würde das zeigen. Das Muster ist identisch und durch Lesen bestätigt, darum ist es kein Major. |

Ponytail: Das Delta ist schlank genug, es gibt nichts zu kürzen.

## Nicht bestätigt

- DOM-Tests statement-wizard, agreed-costs und contract-wizard: von mir auf 4c51cbb7 wiederholt, 120 bestanden.
- Lint und check auf 4c51cbb7: vom Aufrufer gemeldet.
- E2E Chromium + API (164) und die axe-/Sprachzeilen (64): vom Aufrufer gemeldet, und zwar auf f1a657bc, nicht auf 4c51cbb7. Das Delta ändert keinen E2E-Code. Der Fix verschiebt die Entsperrung nur in einem Fall, den die E2E-Tasks nicht auslösen (Zurück während des Ladens).
- Dass der neue C-1-Test vor dem Fix rot war: vom Aufrufer gemeldet. Durch Lesen gestützt, denn er ist inhaltlich gleich wie mein in Runde 1 roter Probe-Test.
