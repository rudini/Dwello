# Code-Review #1153, Schlussrunde 1 (Delta ee376e46c..85ff07524)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1, C-2 (aus `docs/reviews/1153-review-1.md`).

Geprüft: Das `$effect` in `ApartmentStep.svelte:33-35` liest nur `apartmentId` und schreibt `cleared`. `retry()` (`ContractWizard.svelte:168-170`) setzt `cleared` und `values.apartmentId = ''` im selben synchronen Abschnitt, deshalb löscht der Effekt den frisch gesetzten Hinweis nicht. Die Bedingung `{#if cleared}` passt dazu. `discardDraft` setzt `cleared = null` (:259). Der erweiterte DOM-Test (Auswahl wieder leeren) wäre auf der Basis rot gewesen, weil dort `cleared && !apartmentId` den Kasten wieder zeigt. Der Verwerfen-Test wird ohne die Zeile :259 rot, denn danach wählt niemand eine Wohnung, und der Effekt setzt `cleared` nicht zurück. `closeWarning` wartet mit `Wait.forCount(warningToast, 0)` (`Wait` ist schon importiert, `interactions.ts:137`). Bis zum Schritt :166 im Szenario zeigt sich nur diese eine Warnung. Ponytail findet nichts: kein ungenutzter Code und keine Kopie eines Helfers. Im Delta gibt es keine neuen Texte, Bildschirme oder testids.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, `bunx vitest run src/__tests__/contract-wizard.dom.test.ts` (60 grün), Prettier auf den geänderten Zeilen. E2E `contract-new.feature` (55 grün) und die axe- und Sprachzeilen `contract-new apartment-cleared` (2 grün) liefen auf ee376e46c, noch nicht auf 85ff07524. Der geänderte Task `closeWarning` ist also im E2E noch ungeprüft.
- Den Rot-Lauf des Verwerfen-Tests (ohne `cleared = null`) meldet der Aufrufer. Ich habe ihn nur durch Lesen beurteilt.
