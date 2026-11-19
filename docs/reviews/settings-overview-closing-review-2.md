# Code-Review settings-overview, Abschlussrunde 2 (Delta fac68cf..d08599f)

Vorheriger Bericht: docs/reviews/settings-overview-closing-review-1.md (keine Befunde).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde im Delta. |

Geprüft: Sperre `saving` im `onchange` plus erneutes Senden nach erfolgreicher Antwort, wenn `result.data.updateCheck` vom Schalter abweicht (auch zweimal Umschalten, wieder auf den Ausgangsstand: nichts wird gesendet; Ablehnung: Zurückstellen auf den gespeicherten Stand, `redirect`/`error` laufen über denselben Zweig); DOM-Tests per Lesen: der Test zum zweiten Umschalten wird ohne die Sperre bei `toHaveLength(1)` rot, der Test «sendet nichts mehr» ohne den Vergleich, der Rollback-Test ohne die Rollback-Zeile; `toSettingsOverview` liefert dieselben Felder wie die frühere Inline-Abbildung und liegt neben `toSettings`/`atFields`, die die Absender-Seite für dieselbe `/config`-Antwort verwendet. Ablehnung 4 hält: `distribution-keys`, `heating-profiles` und `sender` importieren `../help` auf dieselbe Weise. Ablehnung 5 hält: der folgende Schritt fragt `updateCheckSavedText` mit `actor.sees(...).toBe(text)`, und `sees` ist `expect.poll` (tests/e2e/screenplay/actor.ts:47–48).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main --structure`, `bunx vitest run --changed origin/main` (1044 Tests), Commit-Hooks, E2E chromium `-g "speichert beim Umschalten|tägliche Suche|drei Gruppen|melden e| config "` (13 bestanden, auf demselben Stand vor dem Commit).
- Die Rotläufe der drei neuen DOM-Tests habe ich nur durch Lesen beurteilt.
- Ein schnelles doppeltes Umschalten deckt kein E2E-Szenario ab; das Timing lässt sich im E2E-Stack nicht zuverlässig herstellen, und es ist eine Korrektur innerhalb des noch nicht gemergten Verhaltens dieses Pull Requests, keine Verhaltensänderung gegenüber `main`. Ob der Pull-Request-Text das erwähnt, habe ich nicht geprüft.
