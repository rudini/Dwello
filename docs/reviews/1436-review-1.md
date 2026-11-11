# Code-Review #1436 (Runde 1, Abschlussrunde), Commit 6230c802

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: `compose.yaml:243` liest jetzt `header Strict-Transport-Security "max-age=31536000; includeSubDomains"` (Done means von #1436 erfüllt); `deploy/demo/Caddyfile:4` gleich; der neue Test `compose-images.test.ts:60-65` prüft beide Dateien mit der vollständigen Zeile und schlägt auf `origin/main` an beiden `toContain` fehl (rot durch Lesen bestätigt); keine weitere Caddy-Konfiguration mit dem Header im Repo (`docker-compose.prod.yml` hat keinen Caddy; grep über das Repo ohne `docs/archive`); keine Doku zitiert den alten Header; keine UI-Texte, keine Bildschirme, keine API betroffen; nichts Fremdes im Diff. Entscheidung `marketing/.htaccess` hält: #1436 nennt nur die Caddy-Konfiguration in `compose.yaml`, und `includeSubDomains` auf der Apex-Domain dwello.ch (Infomaniak, Apache) würde HTTPS für alle Subdomains von dwello.ch erzwingen, auch für fremd betriebene (Mail/Webmail) – das ist eine Betriebsentscheidung ausserhalb dieses Issues. Bei `demo.dwello.ch` und `{$DWELLO_DOMAIN}` wirkt der Zusatz nur auf deren eigene Unter-Subdomains. `No scenario` (Header kommt vom Caddy, den der E2E-Stack nicht startet) ist stichhaltig.

## Nicht bestätigt

- `bun test src/__tests__/compose-images.test.ts` (9 pass), Rot-Lauf des neuen Tests vor der Konfigurationsänderung, `bunx vitest run tools/ci/docker-paths.test.ts` (26 passed), Backend type-check, lint, check, fitness (0 Fehler), Prettier auf der Testdatei: vom Aufrufer gemeldet.
- Ob auf dwello.ch tatsächlich Subdomains ohne HTTPS (Mail/Webmail) betrieben werden: nicht geprüft (kein DNS-/Live-Zugriff); die Begründung für `marketing/.htaccess` gilt unabhängig davon, da sie ausserhalb des Issue-Umfangs liegt.
