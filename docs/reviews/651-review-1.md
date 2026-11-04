# Code-Review Slice 651, Runde 1 (ab2ce7b)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/ui/MobileNav.svelte:27 | `new MediaQuery('min-width: 1024px')` misst in px, das `lg:hidden` des Menüs und das `lg:block` der Seitenleiste (Tailwind 4, `--breakpoint-lg: 64rem`) in rem. Bei einer grösseren Standardschrift im Browser (z. B. 20 px, `lg` = 1280 px) ist die Abfrage schon bei 1100 px wahr: Menü dort öffnen und das Fenster auf 1300 px ziehen löst kein `change` aus, das Menü bleibt offen, ist durch `lg:hidden` unsichtbar, und die Seite bleibt inert. Das ist genau der Fall, den die Abfrage verhindern soll. Abhilfe: `'(min-width: 64rem)'`. |

## Nicht bestätigt

- `bunx vitest run` (4070 bestanden), `bun run lint`, `bun run check`, Prettier auf den neu hinzugefügten Dateien: vom Aufrufer gemeldet. E2E `navigation.feature` und die Zeilen `mobile-menu-open` für axe und Sprachen in Chromium: vom Aufrufer gemeldet, Ergebnis steht noch aus.
- `No scenario`: Die Begründung, dass Playwright inerten Inhalt in Aria-Snapshot und Rollen-Locatoren weiter aufführt, habe ich nicht geprüft (kein `node_modules`, keine Testseite). Sie ist keiner der in `tests/e2e/CLAUDE.md`, «No scenario», aufgezählten Fälle. Ein Fall nach demselben Grundsatz ist sie aber: Fokus und Zeiger waren schon vorher im Menü gehalten, Neues sieht nur Hilfstechnologie. Die Zeile `No scenario: <reason>` muss im Plan und im Pull-Request-Text stehen. Die Commit-Nachricht nennt sie nicht.
- Dass die beiden neuen DOM-Tests ohne die Änderung rot sind, habe ich durch Lesen bestätigt: Ohne `makeInert` ist das Ergebnis `[]`, ohne die MediaQuery bleibt das Menü offen. Ausgeführt habe ich sie nicht.
- Dass `MediaQuery` von Svelte 5.57 `matchMedia` im Konstruktor aufruft und sich über `addEventListener('change')` anmeldet (davon hängt der Stub im Test ab), habe ich ohne `node_modules` nicht nachgelesen.

Geprüft: alle 6 geänderten Dateien. `makeInert` ist unverändert verschoben, die Inert-Tests in `ui-dialog.dom.test.ts` decken es weiter ab. Beim Schliessen wird erst `restore()` und dann `opener.focus()` aufgerufen, der Fokus landet also nicht auf einem inerten Knopf. `ToastRegion` liegt als Geschwister im Layout und bleibt erreichbar. Die globale Vorgabe für `matchMedia` ist nötig, weil `layout-hydrated`, `public-pages-layout` und `language-switcher` das Layout mit MobileNav einbinden. Keine neuen Texte, Bildschirme oder API-Verträge. `data-testid` `mobile-nav-scrim` entspricht der Konvention. Ponytail: schlank, nichts zu streichen.
