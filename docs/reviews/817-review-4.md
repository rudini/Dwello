# Code-Review 817, abschliessende Runde, Runde 2 (Delta 750571c..f564b23)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde |

Geschlossen: C-13, C-14.

C-13: Das Szenario «Den neuen Zugangsschlüssel und die Adresse kopieren» (tests/e2e/features/zugangsschluessel.feature:26-34) klickt beide Knöpfe im Kasten. Es prüft jeweils den Text der neuesten Erfolgsmeldung (`toast-success` mit `.last()`; `addToast` hängt neue Meldungen hinten an, src/lib/stores.ts:41). Beim Lesen schlägt es ohne die Knöpfe fehl (Klick-Timeout) und ebenso, wenn `done` falsch ist. Die Schritte rufen nur Tasks und Questions auf. Die Question liefert den Text selbst. Was in der Zwischenablage steht, prüfen die DOM-Tests.

C-14: Der Test «kopiert auch die Adresse oben auf der Seite und sagt es» schlägt fehl, wenn `done` in +page.svelte:57 fehlt. Der Test «zeigt im Dialog zum Widerrufen, dass nichts widerrufen wurde» schlägt fehl bei `error={undefined}` in +page.svelte:118, denn `form-error` wird nur bei `error` gezeigt (ActionDialog.svelte:87-88).

Geprüft: alle 7 Dateien des Deltas; `permissions` nur im Chromium-Projekt. Firefox würde `clipboard-write` als unbekannte Berechtigung ablehnen, darum gehört sie dort nicht hin.

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint, check, `vitest --changed origin/main` (638 pass), E2E chromium+api `zugangsschluessel.feature` (6 passed). Ebenfalls vom Aufrufer gemeldet: rot ohne die Knöpfe und ohne die Freigabe.
- Firefox und WebKit: Durch Lesen lässt sich nicht bestätigen, dass das Szenario dort ohne Freigabe hält. Die Bedingungen dafür sind erfüllt: `writeText` steht am Anfang des Klick-Handlers vor jedem `await` (CopyButton.svelte:11-13), damit gilt die Aktivierung durch den Nutzer noch. Die Klicks von Playwright sind echte Eingaben. `http://localhost:3100` gilt als sicherer Kontext. Für Firefox headless rechne ich damit, dass es hält (eigene Zwischenablage für headless). Unsicher ist WebKit headless unter Linux: Ob `writeText` dort auflöst, ablehnt (dann Meldung «copy failed», Szenario rot) oder hängen bleibt, hängt vom Port ab. Den Code von Playwright und WebKit habe ich nicht gesehen. Auch der Kommentar in playwright.config.ts:265-266 («Firefox and WebKit let a click write to it») ist damit unbelegt.
  Kleinster sicherer Weg, ohne Code zu ändern: Vor dem Merge CI auf dem Branch mit `workflow_dispatch` starten (`gh workflow run ci.yml --ref <branch>`). Bei einem Ereignis, das kein `pull_request` ist, ist `PROJECTS` leer (.github/workflows/ci.yml:244), und dann laufen auch firefox und webkit. Fällt nur WebKit durch, ergänzt man dort dieselbe Zeile `permissions: ['clipboard-write']`, sofern Playwright sie für WebKit annimmt. Sonst braucht es eine Entscheidung, das Szenario in WebKit auszunehmen, denn das schwächt die Prüfung dort.
