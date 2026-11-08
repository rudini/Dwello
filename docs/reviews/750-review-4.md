# Review 750-4 (Re-Review, Delta c0a9cb1..4d70330)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/unit/hydration-console.test.ts:19 | Der Wechsel von `framenavigated` auf die Navigationsanfrage hat keinen Test auf der untersten Ebene: Die Attrappe ruft nur noch `request` auf, beide Tests bestehen mit dem alten wie mit dem neuen Listener gleich (rot nur ohne Listener). Dass eine Verlaufsänderung (`framenavigated` des Hauptframes nach dem Fehler) die Konsole nicht leert, zeigt nur der manuelle Chromium-Lauf. Ein Test, in dem `goto` nach `pageerror` noch `listeners.framenavigated?.(mainFrame)` auslöst und der Fehler im Stack bleibt, wäre auf c0a9cb1 rot. |

Geprüft: Kurzschluss `isNavigationRequest() &&` vor `request.frame()` (kein Aufruf von `frame()` für Service-Worker-Anfragen), Filter auf den Hauptframe (iframes leeren nicht), clientseitige SvelteKit-Navigation und `replaceState` lösen keine Navigationsanfrage aus, Weiterleitungen leeren erneut (unschädlich), Kommentar Zeile 11 stimmt, Commit-Nachricht nennt den Fix und die unveränderte Vorgabe des Unit-Tests; nichts Fremdes im Delta.

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint, check, `bunx vitest run tests/unit/hydration-console.test.ts src/__tests__/e2e-screenplay-lint.test.ts` (63), Rotlauf des Zwei-Navigationen-Tests ohne Listener-Zeile, Prettier auf geänderten Zeilen, Chromium-Lauf mit `page.route` (/old, /new mit `replaceState`).
- Randfälle, die kein neues Dokument laden, aber eine Navigationsanfrage des Hauptframes stellen (Antwort 204, Download, per `route.abort()` abgebrochen), leeren die Konsole des weiter angezeigten Dokuments; Meldungen des alten Dokuments zwischen Anfrage und Commit (z. B. `pagehide`) landen in der neuen Liste. Ob ein E2E-Schritt das je trifft, habe ich nicht geprüft (nur `tests/e2e/screenplay/abilities.ts` gelesen); für die Anforderung im Normalfall ohne Belang.
