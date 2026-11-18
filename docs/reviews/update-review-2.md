# Code-Review Slice `update`, Runde 2 (3db5c36..bcad5d5)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-7 | Minor | compose.yaml:105, backend/src/services/update.service.ts:15 | Unverändert offen (siehe Runde 1): Eine Installation mit fester `DWELLO_VERSION` und dem alten compose.yaml fragt GitHub und zeigt «manual» |
| C-8 | Minor | src/lib/server/auth.ts:162, src/lib/server/update.ts:29, src/routes/config/+page.server.ts:647 | Unverändert offen ausser dem Vertrag: Das Löschen von `dwello_update_later` beim Abmelden, der fehlende Hinweis ohne `appVersion` und das ausgeblendete Feld «Updates» ohne `checks` haben weiter keinen Test |
| C-11 | Minor | .github/workflows/release.yml | Unverändert offen: `releases/latest` nennt die neue Version, bevor die Images unter `latest` liegen |
| C-12 | Minor | backend/src/services/update.service.ts:22-31, src/lib/ui/UpdateNotice.svelte:42 | Die Korrekturen von C-4 (Fehler von `getConfig` innerhalb von `try`), C-5 (`AbortSignal.timeout(10_000)`) und C-6 (`slow = false` beim nächsten Start) ändern Verhalten, aber kein Test pinnt sie. Wird eine der Zeilen entfernt, bleiben alle Tests grün (update.pg.test.ts und update-notice.dom.test.ts enthalten weder einen Ablehnungs- oder Timeout-Fall noch einen zweiten Start) |
| C-13 | Minor | src/lib/ui/UpdateNotice.svelte:131, src/lib/ui/UpdateProgress.svelte:52-60 | Nach «Schliessen» im Zustand «failed» wird die Fläche entfernt, und der Fokus fällt auf `body`. Er geht nicht an «Aktualisieren» zurück, wie es `Dialog` mit `opener?.focus()` tut. Wer die Tastatur nutzt, beginnt wieder oben auf der Seite |

Geschlossen: C-1, C-2, C-3, C-4, C-5, C-6, C-9, C-10, C-8 (nur der Vertrag `update_check` in tests/contracts/config.json)

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (1090), `design-guard`, `tokens`, `open-work`, die Backend-Tests update.pg, updater, compose-images, api-contracts und auth.pg (203), die volle Backend-Suite auf 3db5c36, E2E auf 3db5c36 (126/126) sowie die axe- und Sprachzeilen (22/22). Der Lauf von aktualisierung und den `update-*`-Zeilen auf bcad5d5 war noch nicht fertig. Von den Rot-Läufen für C-1 bis C-3 ist nur gemeldet, dass es sie gab (Commit-Text von bcad5d5). Durch Lesen bestätigt: Ohne die Änderung scheitert compose-images an `environment` (undefined), updater.test am Zurückrollen nach dem `DELETE` mit 500 und update-notice.dom.test an `activeElement`.
- C-1 gegen ein echtes Docker habe ich nicht geprüft (`docker compose up`, danach `fetch('http://updater:3002/status')`). Gelesen habe ich updater.ts:161 (`PORT ?? 3002`), compose.yaml:153-158 und den Test.
- Ob die Fokus-Reihenfolge von C-2 im Browser hält, habe ich nur gelesen: Die Bereinigung des `Dialog` (`opener?.focus()`, Aufheben von `inert`) läuft während des `await apiCall`, also bevor die Fläche erscheint. Ein E2E-Schritt mit Tastatur fehlt; die Prüfung steht nur in jsdom.
- docs/design/tools/persona-stack.sh (d037600) lief nicht. Ob `RELEASE` in docs/design/personas/README.md beschrieben werden muss, habe ich nicht geprüft.

Geprüft: compose.yaml zusammen mit compose-images.test.ts (C-1); `makeInert` und die Fokuslogik in UpdateProgress.svelte samt dem Fall «restore» ohne «Schliessen», der auf dem Titel landet (C-2); das Entfernen der bisherigen Container nach `done` in updater.ts mit seinem Test (C-3); `data-testid="backup-code-shown"` und die Wiederverwendung der Targets aus settings.ts (C-9, C-10); die Allowlist in auth.pg.test.ts und die Variable `UPDATE_STUB_RELEASE` (Standard 1.4.0 lässt E2E unverändert).
