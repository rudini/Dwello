# Code-Review #1029, Runde 2 (Schlussrunde, 02aba59b8)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-2 | Minor | src/__tests__/category-predefined.dom.test.ts:159-167 | Der Titel sagt «auch nach dem Umstellen». Der Test prüft aber nicht, dass das Umstellen gewirkt hat. `category-consequence` hängt nur an `category?.predefined` und nicht an der Wahl. Darum besteht die Prüfung auch dann, wenn der Klick auf `category-allowance-false` oder das Flush nach einem `await Promise.resolve()` nichts ändert. Eine Rückbildung, die den Verweis wieder an die gewählte Antwort koppelt, fiele dann nicht auf. Eine zusätzliche Prüfung würde das zeigen: Der Grund von «Hauswart» (`category-reason`) fehlt in der Beschreibung, oder `category-allowance-false` ist `checked`. |

Geschlossen: C-1. Teil (a) des Befunds ist durch den ersten Test abgedeckt, Teil (b) für eine eigene Kategorie durch den zweiten. Der Fall «Neue Kategorie» ist weiterhin ohne Test. Dort ist `category` undefined, und der Verweis entfällt so trivial wie bei einer eigenen Kategorie. Das ist kein eigener Befund.

Keine Blocker/Major.

Geprüft:
- Der Diff besteht nur aus den zwei Tests.
- Der erwartete Text stimmt mit `categories_predefined_allocable` in `messages/de.json:1678` überein (die Vorlage «Caretaker» ist umlagefähig).
- Der erste Test ist rot ohne `'category-consequence'` in `CategoryForm.svelte:131`: Die Beschreibung bestünde dann nur aus Hilfe und Grund.
- Der zweite Test pinnt Verhalten, das schon auf der Basis 2cfd6477f besteht, und ist kein Bugfix. Das steht in der Commit-Nachricht.
- Beide Tests verwenden die vorhandenen Helfer (`description`, `show`, `byTestId`) und keine neuen.

## Nicht bestätigt
- Vom Aufrufer gemeldet:
  - `bunx vitest run src/__tests__/category-predefined.dom.test.ts`: 17 bestanden.
  - Der erste neue Test war rot, als der Verweis in CategoryForm entfernt war.
  - Prettier: kein Diff auf den geänderten Zeilen.
  - `bun run testcheck:audit`: ohne Befund.
- Nichts davon habe ich selbst ausgeführt.
- Ob der Klick mit einem einzigen `await Promise.resolve()` in jsdom die Wahl tatsächlich umstellt, habe ich nicht ausgeführt. Ich habe es nur aus `RadioGroup.svelte` (bind:value) und aus dem vergleichbaren `click(...)` in `categories-page.dom.test.ts:574` gelesen.
