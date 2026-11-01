# Review #661, Runde 1 (Abschlussrunde vor dem Push)

Bereich: `git diff 81f387f54 08d2ae757` (Commit 08d2ae757), Worktree `/tmp/claude/review-661-cr1`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | tests/e2e/targets/app-frame.ts:17 | Die unveränderte Zeile `currentNavItem` hat jetzt eine kaputte Formatierung (`export const currentNavItem =target(`, das Leerzeichen fehlt; auf der Basis stand `= target(`). Die Änderung gehört nicht zur Anforderung, und die Datei ist nicht mehr Prettier-sauber. CI prüft Prettier nur bei neu hinzugefügten Dateien, darum fällt das dort nicht auf. |
| C-2 | Minor | tests/e2e/targets/app-frame.ts:8 | `mobileMenuButton` kopiert `tests/e2e/targets/accessibility.ts:67` (dieselbe Beschreibung «Menü», dieselbe testid `mobile-menu-button`). Das ist eine Kopie eines vorhandenen Targets (ponytail `reuse:`). `tasks/app-frame.ts` kann das vorhandene Target importieren, denn Tasks dürfen `targets/` nutzen. Alternativ zieht das Target nach `targets/app-frame.ts` um und `accessibility.ts` importiert es von dort. |

Keine Blocker, keine Major.

Geprüft:
- Schichten: Der Step ruft nur den Task auf. Der Task setzt sich aus `Click.on` und Targets zusammen. Die Targets enthalten nur Locators.
- Step-Wiederverwendung: Ein gleichwertiger Step für die Schublade fehlte bisher. «auf der Seite {string}» und «Browserfenster ist {int} Pixel breit» werden wiederverwendet.
- Wortlaut des Szenarios: kein UI-Wort, «Menü» steht analog zu «Hauptnavigation».
- Ob der Step die Schublade prüft: `mobileNavLink` ist auf `getByRole('dialog', { name: 'Hauptnavigation' })` begrenzt. Diese Rolle hat nur der Drawer in `src/lib/ui/MobileNav.svelte` (Zeile 41–45), die Seitenleiste ist ein `nav`. Ein Klick auf die Seitenleiste würde also nicht zählen. Der zweite Klick wartet über Playwrights Actionability-Prüfung, bis der Drawer offen ist.
- Grundlage und Resize: Die Gebäudeliste wird in Desktop-Breite geladen, danach wird auf 390 px verkleinert. Das ist solide, weil der Menüknopf nur per CSS umschaltet (`lg:hidden`, `Header.svelte:43`) und kein JS auf die Breite reagiert (kein `matchMedia`/`innerWidth` in `src/lib`). `help.feature:66` macht es genauso.
- Beispielzeilen: dieselben 13 wie in der Seitenleisten-Gliederung. Die Zeile «Gebäude» bestätigt die Navigation genauso schwach wie dort (die Seite ändert sich nicht), sie verlangt aber, dass der Link im Drawer existiert.
- Kein Red nötig: Die Commit-Message sagt, dass die Szenarien bestehendes Verhalten festhalten. Es gibt keine App-Änderung und keinen Bugfix.
- Keine neuen Texte, Bildschirme oder Zustände, also keine Einträge in `messages/*.json`, `screens.json` oder den a11y-Features nötig.
- Bestehende Szenarien und Grundlage ohne `@wip` sind unverändert. Der Plan-Eintrag ist korrekt.

## Nicht bestätigt

- `bun run test:e2e:wip -g "Menü im schmalen Fenster"`, 13 passed (vom Aufrufer gemeldet).
- `bunx playwright test --project=chromium navigation.feature`, 51 passed (vom Aufrufer gemeldet). Firefox und WebKit hat der Aufrufer nicht gemeldet.
- `bun run lint` (vom Aufrufer gemeldet).
- `bun run check` (vom Aufrufer gemeldet).
