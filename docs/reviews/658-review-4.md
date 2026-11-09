# Review 658, Runde 4 (Abschlussrunde, Fixes des Fallback-Reviews von PR #1355)

Delta: `git diff 5fbca558 212a1819` (ein Commit, 212a1819)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/targets/statement-detail.ts:5-7 | `costTableRegion` steht zwischen dem Kommentar «A position as shown: a row of the table, or a card … the card's first value is the category» und `statementLineItem`, zu dem er gehört. Jetzt steht er über der Tabellenregion und beschreibt sie falsch. Der neue Target gehört über diesen Kommentar oder unter `statementLineItem`. |

Kein Blocker, kein Major.

Geprüft: Filterraster `@2xl:grid-cols-2 @5xl:grid-cols-3` und die Spannweite der Knopfzeile passen zueinander (5 Felder, Knopfzeile über alle Spalten). Beispiele 1440/1920 im Szenario der langen Kategorie stehen im Commit als vorher rot. Die Kachel-Beispiele 1168/1440 und das Tabellen-Szenario bei 1920 nennt die Commit-Nachricht als gepinntes, beibehaltenes Verhalten (keine Fehlerbehebung). `ScrollsSideways.by` misst nur die sichtbare Region von `Table.svelte` (`overflow-x-auto`, `role="region"`). In der Kartenvariante liegt sie in `hidden @5xl:block`, die Frage gibt dort `null` zurück und `toBe(0)` schlägt fehl. Der Schritt prüft also wirklich die Tabellenvariante und gibt einen Wert zurück. Der Schritt ruft nur eine Frage auf. Die Formulierung des Features nennt keine UI-Elemente. Kein neuer Text, kein neuer Bildschirm oder Zustand, kein Diff ohne Bezug zur Anforderung.

## Nicht bestätigt

- vom Aufrufer gemeldet: bun run lint, bun run check, vitest invoice-pages.dom, e2e-screenplay-lint, open-work, feature-wording (183); E2E chromium invoices.feature (52), Szenarien Statuskachel, lange Kategorie und Tabelle; accessibility- und sprachen-bildschirme-Zeilen der Rechnungen (26); fitness --base origin/main 0 Fehler.
- Die Rotläufe der Beispiele 1440/1920 (lange Kategorie) vor dem Fix habe ich nicht nachgeprüft. Lesbar ist nur: Mit `@4xl:grid-cols-4` hätte jede Spalte bei einer Seite von höchstens 1152 px rund 250 px. Das passt zur gemeldeten Kürzung um 38 px.
- Ob im Panel der Kostenaufstellung bei 1920 px noch eine zweite sichtbare `region` liegt (das wäre ein Strict-Mode-Fehler der Frage), habe ich nur aus dem Markup von `CostTable.svelte` und `Table.svelte` geschlossen. Gefunden habe ich keine. Laut Aufrufer läuft das Szenario grün.
- Fallback-Befund (1) (Containing Block des Upload-Overlays) ist im Delta nicht geändert. Die Messung am Build stammt vom Aufrufer.
