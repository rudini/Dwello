# Review 1173, Runde 3: Merge von main (05b8aa2)

Umfang: `git show --remerge-diff 05b8aa2 -- src` (zwei Konflikte, beide als Vereinigung aufgelöst), dazu `src/routes/+layout.svelte` als Ganzes und `git diff` gegen beide Eltern (f1adfd4, c6c7963).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine Befunde |

Geprüft: Die Titelzeile (`+layout.svelte:74-76`) steht vor dem `keep` und vor den frühen Returns von #662 (`:80`, `:82`) und läuft deshalb bei jeder Navigation. Die beiden Regionen kommen sich nicht in die Quere, weil sie sich ausschliessen: `pageTitle` wird nur bei einem anderen Pfad gesetzt, `isListNavigation` (`src/lib/list-url.ts:27`) gibt bei einem anderen Pfad `false` zurück. Eine Navigation füllt also höchstens eine der beiden Regionen, entweder die assertive Titel-Region oder den höflichen Status. Der Diff gegen f1adfd4 enthält nur die #662-Teile (`beforeNavigate`-Import, `listResult`/`navigations`, frühe Returns, Status-Region), der Diff gegen c6c7963 nur die #1173-Teile (Stummschalten des Announcers, `pageTitle`, Titelzeile, Titel-Region). Keine Seite hat etwas verloren. Im Test bleiben beide `describe`-Blöcke vollständig, der Mock von `$app/navigation` enthält `beforeNavigate`, und die Imports sind die Obermenge (`flushSync`, `beforeNavigate`). Ausser diesen zwei Dateien gab es keine weiteren Konflikte.

## Nicht bestätigt

- bun run lint, bun run check, vitest `layout-hydrated.dom.test.ts` (11 Tests) und E2E chromium für die Features tenant-documents, tenants, apartments und contracts (63 bestanden) auf 05b8aa2: vom Aufrufer gemeldet.
- CI auf dem PR und der workflow_dispatch-Lauf für alle Browser vor dem Merge: vom Aufrufer gemeldet.
- Dass ein echter Screenreader die beiden Regionen nicht gleichzeitig ansagt, folgt aus dem Code (sie schliessen sich gegenseitig aus). Laufzeitverhalten habe ich nicht beobachtet.
