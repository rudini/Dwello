# Code-Review #662, Runde 3 (219ab27, Schlussrunde vor dem Push)

Bereich: `git diff 6202bf9 219ab27` ohne Reports, Personas, Plan und Archiv (Commit 219ab27). Vorheriger Report: `docs/reviews/662-review-2.md`.

Geschlossen: C-4, C-5, C-6

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Zur Frage bei C-4, ob das Warten genügt: Ja. `Wait.until(on.emptyHint)` trifft zwar jeden Leer-Hinweis (`[data-testid$="-empty"]`, also den Rahmen `invoices-empty` aller drei Zweige). Welcher Zweig erscheint, hängt aber nur an der Adresse und an der leeren Liste (`src/routes/invoices/+page.svelte:27-33, 94-96`). Die Seite wird auf dem Server gerendert, und die leere Instanz hat keine Rechnungen. Mit `?year=<laufendes Jahr>` und ohne weitere Parameter ist darum nur der Zweig `onlyYear` möglich. Dass genau diese Adresse den Jahreshinweis mit «Filter zurücksetzen» zeigt, belegt der DOM-Test `src/__tests__/list-filters.dom.test.ts:144-154`. Der a11y-Zustand soll axe und die Sprachprüfung auf diesen Bildschirm richten, und dafür reicht das. Ein Warten auf einen eigenen Selektor würde nichts belegen, was der DOM-Test nicht schon zeigt. Auch der Jahreswechsel ist kein Problem: Liegen Testlauf und Server in verschiedenen Jahren, nimmt `invoiceQuery` trotzdem jedes vierstellige Jahr an, und `onlyYear` liest das Jahr aus der Adresse.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: vitest (4365 Tests), E2E der Listen-Features (128/128), die Zeilen `empty` und `empty-year` (4/4), lint, check, fitness, fallow und Prettier.
- Ob ein Bildschirmleser (NVDA/VoiceOver) das Leeren in `beforeNavigate` und das Setzen nach `tick()` im echten Browser als zweite Ansage ausgibt, habe ich nur gelesen. Zwischen den beiden Schritten liegt mindestens der Ladevorgang der Seite, also kommen die zwei DOM-Änderungen getrennt.
- Ein Szenario für S-5 und C-5: Den Wettlauf zweier Navigationen kann der E2E-Stack nicht zuverlässig herstellen, der DOM-Test ist die tiefste Schicht dafür. Der Grund `No scenario` muss in den Text des Pull Requests. Den habe ich nicht gesehen.

Geprüft: `beforeNavigate` leert den Status bei jeder Client-Navigation: Wahl, «Suchen» (GET-Formular), Zurücksetzen und Seitenwechsel. Der Zähler `navigations` verwirft eine ausstehende Ansage, sobald eine neuere Navigation begonnen hat. Ohne die jeweilige Zeile wird jeder der drei neuen DOM-Tests rot: ohne das Leeren in `beforeNavigate` Test 1 (`between`) und Test 2, ohne den Vergleich `turn === navigations` Test 3. Alle drei DOM-Tests, die das Layout einbinden, mocken `beforeNavigate` (`grep` über `routes/+layout.svelte`). `empty-year` steht in `screens.json` (mit `stateMeanings`), in `accessibility.feature`, in `sprachen-bildschirme.feature`, in `states` und in `instanceOf`. Die Adresse wird in `tests/e2e/fixtures/screens.ts` berechnet. Keine neuen Texte, keine Token-Klassen berührt, Screenplay-Schichten eingehalten, ponytail-review ohne Befund, nichts ausserhalb der Anforderung.
