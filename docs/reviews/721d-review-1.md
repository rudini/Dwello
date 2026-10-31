# Review 721d, Runde 1 (bfe568be9..ce97aeee1)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | svelte.config.js:29, src/__tests__/csp.test.ts:28 | Die Kommentare begründen `blob:` in connect-src mit der App («may be read by its own scripts», «the page reads a file it holds itself»). Die App ruft eine blob:-Adresse aber nie mit fetch/XHR ab: `src/routes/invoices/UploadRowFields.svelte:40` erzeugt sie nur für den Link. Gelesen wird sie nur vom E2E-Schritt `OpenInNewTab` (tests/e2e/screenplay/interactions.ts:137-139). Der Kommentar sollte sagen, dass die Freigabe für das Lesen im Akzeptanztest da ist, damit sie später niemand als App-Bedarf hält oder als unnötig streicht. |

Sicherheitsurteil: Die Lösung ist unbedenklich. Eine `blob:`-Adresse kann nur der eigene Origin erzeugen und lesen, und Skripte laufen nur über `script-src 'self'`. Ein solches Skript hält den Blob ohnehin schon selbst. Über `blob:` kann nichts nach aussen gehen, die Freigabe öffnet also keinen Kanal für Datenabfluss. `default-src`, `script-src` und `object-src` bleiben unverändert.

Kleinere Lösung: keine gleichwertige gefunden. `page.evaluate` läuft in der Hauptwelt der Seite und unterliegt deshalb der CSP, und XHR fällt ebenfalls unter connect-src. `bypassCSP` würde die CSP für das ganze E2E abschalten. Ein Auslesen über CDP wäre ein grösserer Eingriff als eine einzige Direktive. Die Begründung des Aufrufers trägt.

Geprüft: der ganze Diff (2 Dateien), die übrigen CSP-Direktiven in svelte.config.js:22-35, die Verwendung von blob: in src/ und der E2E-Schritt OpenInNewTab. Der neue Test schlägt ohne die Änderung fehl, weil connect-src vorher fehlte und `directives['connect-src']` damit undefined war.

## Nicht bestätigt
- vitest csp.test.ts, 4 bestanden: vom Aufrufer gemeldet.
- E2E invoices.feature in Chromium, 34 bestanden, Szenario «Eine hochgeladene Datei gross ansehen» eingeschlossen: vom Aufrufer gemeldet.
- Ob CI-Shard 2/5 jetzt grün ist: nicht geprüft, ich habe keine Tests ausgeführt.
