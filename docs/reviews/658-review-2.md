# Code-Review 658, Runde 2 (Delta 01db8a3d..3c671a3e)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-6 | Minor | tests/e2e/features/statement-detail.feature:1641 | Weiter offen (wie Runde 1). Die neue Zeile `cost-table` lässt axe und die Sprachprüfung bei 1600 px laufen. Ob die Tabelle dort ganz zu sehen ist, prüft aber weiter kein Test. |
| C-7 | Minor | tests/e2e/tasks/invoices.ts:39-40, tests/e2e/targets/invoices.ts:30 | `filterInvoicesByCategory` kopiert `chooseInListFilter` (tests/e2e/tasks/list.ts:11-16): Wahl nach Beschriftung. Die Wahl wendet den Filter schon bei der Änderung an (`applyFilterChoice`, #662). Die Aufgabe klickt aber trotzdem gleich danach «Suchen», ohne auf die Navigation zu warten. Auf den Endzustand (URL mit `categoryId`) wartet sie nie. Die Prüfung misst nur die Breite der Wahl und wird davon nicht falsch. `chooseInListFilter('Kategorie', category)` würde reichen; das neue Target fiele weg. |

Geschlossen: C-1, C-2, C-3, C-4, C-5

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, vitest (statement-pages.dom, invoice-pages.dom, ui-navigation-parts.dom, open-work, e2e-screenplay-lint, design-guard, tokens, feature-wording, `--changed origin/main`), E2E chromium contracts/invoices/statements/statement-detail/statement-edit (eine Fehlschlag in «PDF einer inzwischen gelöschten Abrechnung aus der Liste anfordern», einzeln und im ganzen Rerun grün), die Zeilen von accessibility und sprachen-bildschirme der fünf Bildschirme inkl. `cost-table`, das italienische Heizprofil-Szenario in statement-generate, die Breiten-Durchsicht 360–1920 in de/fr/it/en. `bun run fitness` und `cd backend && bun run type-check` meldet der Aufrufer für diese Runde nicht.
- Rotlauf der zwei neuen Szenariogrundrisse (statements.feature:261, invoices.feature:358): nur gelesen. Plausibel bei einem Bereich von etwa 37–56rem: fünf Kacheln ab `@lg` bzw. zwei Filter ab `@xl` sind schmaler als «Filter aufheben» bzw. «Wertvermehrende Investitionen». Die Kategorie kommt aus den Stammdaten (backend/migrations/0002_stammdaten.sql), die `Grundlage` braucht sie also nicht. Gemeldet sind 27 px und 3 px.
- Für die geänderten Grid-Klassen von StatusFilter.svelte:54 und InvoiceSearch.svelte:61/116 gibt es keinen DOM-Test. Ihre Wirkung zeigt sich erst im Layout, belegt ist sie also nur durch die zwei Szenarien.
- Weiter aus Runde 1: Die Positions-Targets von statement-detail lesen jetzt bei 1280 px die Karte. Das ist eine Prüfung von Szenarien ohne `@wip` auf `main`. Der Pull-Request-Text braucht `Spec change approved: #658`; der Pull Request existiert noch nicht. Die Umstellung der Targets ist nicht Teil dieses Deltas.
- Der Zustand `cost-table` vergrössert das Fenster in allen drei Ansichten auf 1600 px. Desktop, Tablet und Mobil prüfen also dieselbe Breite. Ob das im Bericht von axe als drei gleiche Läufe erscheint, wurde nicht geprüft.

Geprüft: C-1 (Regex auf `@4xl:shrink-0`); C-2 (`git diff e6453741 3c671a3e` auf CostTable zeigt nur noch `shown`, Kommentar und den `@container`-Wrapper); C-3 (Zustand in `stateMeanings`, screens.json, beiden Features; Aufgabe nach `Browser.resizeTo` aus `lookAt` mit `Wait.until` auf eine Zeile); C-4 (Test wird ohne `stacked` rot); C-5 (`choiceCuts` für beide Fragen, `single` sichert das `[0]`); Screenplay-Schichten und Wortlaut der neuen Schritte.
