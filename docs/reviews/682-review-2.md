# Code-Review #682, Runde 2 (Abschlussrunde vor dem Push)

Bereich: `git diff 1d179be 2b58c0b` (ohne `docs/reviews`, `implementation_plan.md`, `docs/archive`), ein Commit 2b58c0b. Vorheriger Bericht: `docs/reviews/682-review-1.md`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1, C-2 (C-3 vom Aufrufer begründet abgelehnt: eine leere Suche auf einer ungefilterten Liste behält dieselbe Adresse, es gibt keinen neuen Fokus).

Geprüft: C-1, `docs/design/design-decisions.md:57` nennt jetzt die Status-Kacheln der Abrechnungen als Links ausserhalb des Panels, die sofort gelten; das stimmt mit `src/routes/statements/+page.svelte:160` überein (`href={(value) => linkWith({ status: value })}`). C-2, `src/__tests__/apartments-pages.dom.test.ts:186-195`: Eine Auswahl im Statusfilter ohne «Suchen» zeigt kein «Filter zurücksetzen», ein Filter in der Adresse zeigt es; das deckt die Bedingung `filtered && data.apartments.length > 0` aus `src/routes/apartments/+page.svelte:15-17,36` ab. Der zweite Aufruf `list()` hängt eine zweite Instanz an, ohne die erste zu entfernen. Die erste Prüfung läuft aber vor dem zweiten Mount, die zweite Prüfung wird von der neuen Instanz erfüllt; der Test bleibt also gültig. Die beiden Persona-Berichte (`docs/design/personas/marco-682.md`, `sven-682.md`) sind Berichte der Feature-Review von #682 und kein App-Code.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/apartments-pages.dom.test.ts` (26 bestanden), Prettier auf den hinzugefügten Dateien.
- Vom Aufrufer gemeldet: Roter Lauf von C-2 mit der alten Bedingung («expected '… Wohnungen …' not to contain 'Filter zurücksetzen'»). Durch Lesen bestätigt: Der Test schlägt mit einer Bedingung fehl, die dem Formularzustand statt der Adresse folgt. Die alte Bedingung selbst habe ich im Bereich nicht gesehen, weil sie vor 1d179be liegt.
