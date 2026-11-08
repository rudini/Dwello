# Code-Review 740-1 (Commit 6336874, `git diff origin/main 6336874`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/tasks/accessibility.ts:707-711, tests/a11y/screens.json:134 | Der Zustand `mobile-menu-open` öffnet das Menü auf dem Tablet (820 px) mit einem Klick auf ☰. Diesen Knopf gibt es ab 768 px nicht mehr. Damit schlagen die Zeilen `dashboard mobile-menu-open` in `accessibility.feature:44` und `sprachen-bildschirme.feature:45` fehl. Ausserdem stimmen der Kommentar «from 1024 px» und `stateMeanings` («mobile and tablet viewport») nicht mehr. |
| C-2 | Major | tests/e2e/targets/invoice-detail.ts:37-39 | Im Dialog «Rechnung löschen» einer abgerechneten Rechnung stehen jetzt zwei `h2`: der Dialogtitel und der Titel von `BilledWarning`. `deleteDialogTitle` (`getByRole('dialog').getByRole('heading')`) findet deshalb zwei Elemente, und das Szenario `invoice-detail.feature:146` bricht mit «strict mode» ab. |
| C-3 | Minor | docs/design/design-decisions.md:28 | In D12 steht weiter «sidebar from 1024 px, drawer below». Das ist nach dieser Änderung falsch. |

## C-1 (Major): Menü-Zustand auf dem Tablet ist nicht mehr erreichbar

`checkAccessibilityOf` prüft jede Zeile in allen Ansichten aus `screens.json`. Tablet hat dort 820 × 1180. Der Zustand überspringt nur `desktop`:

```ts
'mobile-menu-open': (_, viewport) => async (actor) => {
	if (viewport === 'desktop') return; // the sidebar is always open from 1024 px
	await actor.attemptsTo(Click.on(on.mobileMenuButton));
```

Ab 48rem steht ☰ in `<span class="md:hidden">` (Header.svelte:60) und ist mit `display: none` ausgeblendet. Bei 820 px wartet `Click.on` deshalb auf ein unsichtbares Element und bricht nach `actionTimeout` (10 s) ab.

So zeigt man es: Den vollen E2E-Lauf (läuft gerade) für die Zeile `dashboard mobile-menu-open` in beiden Features ansehen.

Behebung: Auch `tablet` überspringen, oder den Zustand nur in der Ansicht `mobile` zeigen. Die Bedeutung in `stateMeanings` und den Kommentar anpassen. Das Szenario prüft damit eine Ansicht weniger. Das deckt die PO-Entscheidung von #740 (Seitenleiste ab 768 px) inhaltlich, aber der Pull Request muss dafür `Spec change approved: #740` nennen (`CLAUDE.md`, Workflow 1).

## C-2 (Major): Dialogtitel «Rechnung löschen» ist nicht mehr eindeutig

Das Szenario «Die lange Bestätigung zum Löschen öffnet auf dem Telefon oben» (`invoice-detail.feature:146`, ohne `@wip`) legt eine Nebenkostenabrechnung an, die die Rechnung enthält. `DeleteConsequences.svelte:24` zeigt im Dialog deshalb `BilledWarning`. Das ist ein `Alert`, und dessen Titel ist jetzt ein `h2` (`BilledWarning.svelte:21`). Neben dem `h2` des Dialogs (`Dialog.svelte:158`) findet `page.getByRole('dialog').getByRole('heading')` damit zwei Elemente. `Text.of` und `ShareInViewport.of` laufen über `single()` (`screenplay/questions.ts:24-27`) und werfen `strict mode: 2 elements found`. Das Szenario ist auf `main` grün und schlägt nach diesem Commit fehl.

Behebung: Das Ziel auf den Dialogtitel einschränken, z. B. mit `getByRole('heading', { level: 2, name: … })` oder über die Beschriftung des Dialogs (`aria-labelledby`). Die Prüfung bleibt damit gleich streng. Dasselbe Muster gilt für jedes andere Ziel, das «die Überschrift» eines Bereichs ohne Namen sucht, in dem ein `Alert` stehen kann (siehe «Nicht bestätigt»).

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, `bunx vitest run` (alle), der Rotlauf von `shell.dom.test.ts` und der drei neuen Szenarien als `@wip`. Das Ergebnis des vollen E2E-Laufs lag noch nicht vor.
- Seitenleiste zwischen 768 und 1024 px: Der Inhalt ist dort jetzt 320 px schmaler (bei 768 px rund 416 px). Ob diese Szenarien weiter halten, konnte ich ohne Lauf nicht prüfen:
  - Schrittanzeige bei 768 px: `statement-generate.feature:907` (Beispiel 768) und `:931`, jeweils mit «bricht keinen Namen … um» und «scrollt nicht seitwärts». `Stepper.svelte` zeigt die Namen nach Fensterbreite (`md:`), nicht nach Breite des Inhalts.
  - Bei 960 × 600, wo vorher keine Seitenleiste stand: `contract-detail.feature:61` und `contract-edit.feature:197` («Hinweis … ganz im ersten Bildschirm»). Der Seitentitel bricht dort früher um.
  - Die a11y- und Sprachzeilen auf dem Tablet (820 px) zeigen jetzt die Seitenleiste neben rund 468 px Inhalt.
- `building-detail.ts:29` (`fuelStocksHeading`, `h2` in `fuel-stocks`): Im Szenario `building-detail.feature:63` gibt es zwei Treffer, falls dort ein Alert von `FuelStocks` erscheint (Kategorien fehlen oder laden nicht). Ob die E2E-Datenbank dort eine Brennstoff-Kategorie hat, habe ich nicht geprüft. Die anderen Dialog-Ziele ohne Namen (`categories.ts:54`, `contract-form.ts:114`) enthalten nach dem Code keinen `Alert`.
- Dass Alert-Titel «aussieht wie bevor»: Keine globale CSS-Regel für `h2` gefunden, also gilt Preflight und die Klassen sind dieselben. Visuell nicht geprüft.

Geprüft: Alert `h2` mit Unit-Test, der an der Basis rot ist. Alle 18 `PageHeader`-Aktionen sind direkte `Button`s (stretch in `flex-col`), der doppelte Wrapper in `invoices/+page.svelte` ist entfernt. Die neuen Fragen liefern Werte (Text, Pixeldifferenz), die Schichten von Screenplay sind eingehalten. Die Grundlage von `contract-detail` zeigt den Hinweis «fehlende Abrechnung». Keine neuen Texte. Ponytail: nichts Unbenutztes und keine Kopie gefunden.
