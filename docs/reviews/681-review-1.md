# Code-Review #681, Runde 1 (3f2581493)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/screenplay/interactions.ts:192, tests/e2e/features/apartments.feature:92-96 | Das Szenario «Nach dem Zurückgehen im Browser …» kann nicht an fehlender Popstate-Behandlung scheitern: `Browser.back` wartet nicht auf die Seite, zu der es zurückführt, und der Fokus steht vor dem Zurückgehen schon auf `list-results` |

## C-1 (Major): das Szenario zum Zurückgehen im Browser prüft das Zurückgehen nicht

Ablauf mit der Änderung: nach «wieder alle Wohnungen anzeigt» (Link, neu `isListNavigation` = true) steht der Fokus auf der Überschrift von `ResultList` (`data-testid="list-results"`). `goBackInBrowser` ist `page.goBack()`. Bei einem Zurückgehen im selben Dokument kehrt das zurück, sobald die URL gewechselt hat, also bevor SvelteKit `__data.json` geladen, die Liste neu gezeichnet und `afterNavigate` ausgeführt hat. Die erste Abfrage von `actor.sees(focusedPlace)` (`expect.poll`) findet dann noch die alte, fokussierte Ergebnis-Überschrift mit derselben testid und ist sofort grün.

So zeigt man das Problem: in `isListNavigation` (`src/lib/list-url.ts:23`) nur für `type === 'popstate'` `false` zurückgeben, Link und Formular unverändert lassen. Laut Lesart des Codes bleibt das Szenario grün. Der Rotlauf, den der Aufrufer gemeldet hat, kam vom fehlenden Fokus nach dem Zurücksetzen (Link), denn dieser Schritt kommt im Szenario davor; die Popstate-Hälfte hat er nicht gezeigt. Das verletzt auch `tests/e2e/CLAUDE.md`: Eine Aufgabe wartet auf den Zustand, zu dem sie führt.

Behebung: `goBackInBrowser` als Aufgabe auf den Zustand nach dem Zurückgehen warten lassen (z. B. `Wait.forUrl((url) => url.search !== '')` und die leere Liste sichtbar), und die Frage soll den Wert selbst beantworten, also den Text der fokussierten Überschrift («Keine Wohnungen gefunden» gegenüber «n Wohnungen») statt der gemeinsamen testid. Dann unterscheidet die Prüfung die beiden Zustände, und ein fehlschlagender Lauf zeigt, was die Seite anzeigt. Die Unit-Ebene (`list-url.test.ts`, Fall `popstate`) deckt die Regel ab; das Szenario soll aber nicht etwas behaupten, das es nicht zeigen kann.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: `bun run lint`, `bun run check`, vitest (list-url und die Tests zu EmptyState, ResultList, list-url, invoices/+page und +layout.svelte, 735 grün), E2E `apartments.feature` und `invoices.feature` in Chromium (51 grün), axe- und Sprach-Zeilen von invoices und apartments (28 grün).
- Das Timing von `page.goBack()` gegenüber dem Datenladen von SvelteKit in C-1 ist aus dem Code gelesen, nicht gemessen.
- Ob jetzt ein Link mit geänderter Query auf einer Seite, die keine Liste ist, aber eine `EmptyState` hat, den Fokus ungewollt verschiebt: Ich habe die Seiten mit `EmptyState`/`ResultList` durchgesehen (analytics, reports, dashboard/TaskList, buildings/[id], gallery, config/*) und auf keiner einen Link oder ein `goto` auf denselben Pfad mit anderer Query gefunden.

Geprüft: `isListNavigation` (Link, Popstate, Formular, anderer Pfad, erstes Laden), Rotlauf der Unit-Tests und der beiden anderen Szenarien (beide klar rot ohne die Änderung), dass die bestehenden Regex-Tests auf `data-results` weiter passen, die Wiederverwendung von `buildings_reset_filters` (in allen vier Sprachen vorhanden, schon auf apartments und invoices verwendet), die testid `invoices-show-all` (entspricht `apartments-show-all`), dass der Zustand `filtered-empty` von invoices schon in `screens.json` steht, die Screenplay-Schichten, und dass nichts im Diff ausserhalb der Anforderung liegt.
