# Code-Review #1172, Runde 1 (af64d898 gegen origin/main 75b78a9)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | playwright.screenshots.config.ts:10 | Der Kommentar nennt einen falschen Grund. Er begründet den Produktions-Build damit, dass «`bun run dev` renders some corners differently on CI». Nach dem eigenen Befund der Session und der Commit-Nachricht weichen die Ecken aber auch zwischen zwei Aufnahmen vom selben Server ab, und dagegen hilft die Toleranz in `changed-areas.ts`. Was der Build (zusammen mit `env`) tatsächlich behebt, ist die MCP-Adresse mit dem eigenen Port der Basis auf /config/access-keys, und dazu dient die Produktions-Build-Entscheidung. |

Keine Blocker oder Major.

Geprüft: Die Basis läuft jetzt mit `node build` und `ORIGIN=http://localhost:3100` (playwright.config.ts:47-49), deshalb ist `url.origin` in `src/routes/config/access-keys/+page.server.ts:23` auf beiden Seiten 3100. Die XSRF- und Proxy-Prüfungen (`src/lib/server/api-proxy.ts`, `src/hooks.server.ts:86`) vergleichen nicht mit dem Origin der Seite, die Aufrufe der Basis über 3200 bleiben also gültig. Die Screenshots laden nur per GET. `differs` wird in `changedAreas` und in `looksTheSame` gleich angewendet, der Grössenvergleich bleibt erhalten. `shaded()` trifft die Zelle (16, 32). Die Rot-Läufe lassen sich nachvollziehen: Ohne Toleranz schlagen die beiden Kantenglättungs-Tests fehl. Der Test «um mehr als eine Kantenglättung» hält bestehendes Verhalten fest, die Commit-Nachricht sagt das, und rot wurde er gezeigt, indem die Schranke (SHADE auf 3) entfernt wurde. Der Konfig-Test schlägt mit `bun run dev` und mit ORIGIN 3200 fehl. `tests/unit` ist im vitest-Projekt `server` enthalten. Es gibt kein fremdes Diff. Für ponytail gibt es nichts zu streichen. Das Diff macht die Erweiterung aus #697 nicht schwerer: `webServer` und `projects` bleiben getrennt.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness`, Backend-Type-Check, `bunx vitest run tests/unit/ui-screenshot-changed-areas.test.ts tests/unit/ui-screenshots-config.test.ts` (12 bestanden), Prettier auf den neuen Dateien, die Commit-Hooks und der lokale Lauf über 7 Routen (zweimal keine Seite als geändert, mit geänderter Meldung nur /config/access-keys).
- Ob CI zuverlässig erfüllt, was das Issue unter «Done means» verlangt («UI screenshots»-Kommentar ohne unberührte Seiten), zeigt erst ein CI-Lauf. Gelesen habe ich `.github/workflows/ci.yml:469-536` und `tests/ui-screenshots/screenshots.spec.ts`.
- Offen ist auch, ob der zweite `vite build` der Basis auf CI innerhalb des geerbten `timeout: 180000` (playwright.config.ts:151) und der 20 Minuten des Jobs (ci.yml:474) bleibt. Das lässt sich nur auf CI sehen.
- Ob SHADE = 2 auf CI alle Kantenglättungs-Abweichungen auffängt, ist nicht geprüft. Belegt ist nur Δ1 (Angabe des Aufrufers zu den Bildern von #1187/#1192).
