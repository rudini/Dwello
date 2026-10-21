# Review #519, Runde 2 (Abschluss, 3b9373e..234391e)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Keine Blocker, keine Major, keine Minor.

## Status der offenen IDs aus Runde 1

- **C-1 (Minor): behoben.** `goToOverviewWhileItFails` (tests/e2e/tasks/app-frame.ts:34-40) wartet nach dem Klick mit `Wait.until(text('Versuchen Sie es später erneut.'))` auf die Fehlerseite. Das unterscheidet die beiden Seiten: `+error.svelte:18` zeigt bei 404 `error_hint_404` («Prüfen Sie die Adresse …») und sonst `error_hint_retry`. Der Text erscheint also erst auf der Fehlerseite des gescheiterten Ladens, nicht auf der 404-Seite, von der der Task startet.
  - **Schichten nach tests/e2e/CLAUDE.md:** Der Task importiert ein Target (`text` aus `targets/accessibility`) und eine Interaction (`Wait`). Das tun andere Tasks auch (z. B. `tasks/accessibility.ts:39, 212`). Der Step ruft weiterhin nur den Task auf (`steps/app-frame.steps.ts:307`).
  - Der feste deutsche Text ohne `say(...)` ist hier richtig, denn das Szenario in `navigation.feature:59` läuft nur auf Deutsch.

## P-1 (Persona anna-519): vorbestehend, einverstanden

Der Hinweis kommt aus `m.error_hint_retry()` mit dem Text «Versuchen Sie es später erneut.». Auf dem Basis-Commit c7730cd ist er schon gleich, sowohl in `src/routes/+error.svelte:14` als auch in `messages/de.json:144`. Der Diff c7730cd..234391e ändert weder den Schlüssel noch seine Übersetzungen. #519 betrifft nur die Überschrift (h1). Die Änderung macht den Hinweis nicht widersprüchlicher. Jetzt steht über ihm ein verständlicher Satz statt «Internal Error», er wird also eher klarer. Deshalb ist P-1 kein Befund dieser Änderung. Er bleibt im Persona-Bericht.

Geprüft: der einzige Code-Diff im Bereich (`tests/e2e/tasks/app-frame.ts`), die Commit-Message und der Persona-Bericht. Kein Code ausserhalb der Anforderung. Nach 234391e folgt kein Merge-Commit: HEAD des Worktrees ist 234391e.

## Nicht bestätigt

- `bun run lint` und das Szenario «Die Fehlerseite nennt einen unerwarteten Fehler in Worten» (Chromium, 1 passed): vom Aufrufer gemeldet, nicht selbst ausgeführt (laut Auftrag keine Tests).
