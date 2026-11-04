# Code-Review Slice 651, Runde 4 (Delta b01409e..8be1db9)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/ui/MobileNav.svelte:26 | Auf angemeldeten Seiten ohne aktuellen Bereich in `navGroups` (z. B. `/reports`, `/backup`, `/analytics`) gibt es keinen sichtbaren `main-nav-link` mit `aria-current="page"`. Dann ist `current` entweder `undefined` oder, wenn die Seite eine Brotkrumenspur hat, das nicht fokussierbare `<li aria-current="page">` aus `PageHeader.svelte:34`. In beiden Fällen bleibt `focus()` wirkungslos, und der Fokus fällt wie vor der Änderung auf `body`. Die Anforderung «an eine sichtbare Stelle» gilt dort also nicht. Ein Ausweg wäre, auf `#main-content` (`tabindex="-1"`) zurückzufallen; zudem den Selektor auf `[data-testid="main-nav-link"][aria-current="page"]` eingrenzen. |

Geprüft: Fokus-Fallback in MobileNav (Reihenfolge im DOM: `Navigation` steht vor `main`, der Link der Seitennavigation wird also vor dem Brotkrumen-`li` gefunden; der Drawer-Link ist ab lg `lg:hidden` und damit nicht sichtbar; beim Schliessen im schmalen Fenster mit Escape oder Link geht der Fokus wie bisher auf den Öffner). Die Attrappe für `matchMedia` antwortet nur auf `(min-width: 64rem)`. Das passt zu `new MediaQuery('min-width: 64rem')`, weil Svelte die Abfrage in Klammern setzt. Das neue Szenario mit seinen Steps und der Task `openMobileMenu` hält die Screenplay-Schichten ein. `focusedText` gibt den Text selbst zurück, und `sees` fragt wiederholt ab. Ohne die Änderung schlägt das Szenario fehl, weil der Fokus auf `body` steht und dessen Text nicht «Gebäude» ist. Es gibt keine neuen UI-Texte und keine neuen Bildschirme oder Zustände. Nichts im Diff gehört nicht zur Anforderung.

## Nicht bestätigt
- lint, check, `vitest --changed` (4076 bestanden), fitness, navigation.feature (52 bestanden) und Prettier auf `shell.dom.test.ts` und `MobileNav.svelte`: vom Aufrufer gemeldet.
- Rotlauf des Szenarios (Fokus auf `body`) und der rote Breakpoint-Test bei 1024px: vom Aufrufer gemeldet. Beim Lesen erscheinen beide plausibel.
- `checkVisibility` in jsdom: Den neuen Zweig deckt nur E2E ab. jsdom hat kein Layout, eine tiefere Schicht kann ihn also nicht zeigen.
