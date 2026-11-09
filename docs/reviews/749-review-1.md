# Review #749, Runde 1 (16581bae, `git diff origin/main HEAD`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `Dockerfile:58-59` setzt `ENV NODE_USE_ENV_PROXY=1` in der Stufe `runner` (`FROM node:26-alpine AS runner`, Zeile 50), kein `ProxyAgent` im Code; ohne `HTTPS_PROXY` ändert die Variable nichts. `src/__tests__/dockerfile.test.ts` schneidet die Stufe `runner` heraus und ist ohne die ENV-Zeile rot. `docs/tech-stack.md:152` und `:324` nennen jetzt Node 26 und den Proxy über `HTTPS_PROXY`; der veraltete Hinweis auf Node 20 und O-42 ist entfernt, und ausserhalb von `docs/archive` steht keine weitere Erwähnung von Node 20 mehr. Kein Diff an UI, Texten, Verträgen oder E2E; `No scenario` ist begründet (das Image läuft nicht im E2E-Stack). Kein unbeteiligter Code im Diff.

## Nicht bestätigt

- Dass Node 26 im gebauten Image `fetch` tatsächlich über `HTTPS_PROXY` schickt: Ein Image wurde weder gebaut noch gestartet (kein Docker, kein Build erlaubt); nur der Dockerfile-Text ist gelesen.
- `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main`, `cd backend && bun run type-check`, `bunx vitest run src/__tests__/dockerfile.test.ts tools/ci/docker-paths.test.ts src/__tests__/open-work.test.ts` (31 bestanden, neuer Test vorher rot), Prettier auf der neuen Datei: vom Aufrufer gemeldet.
- CI-Image-Build: vom Aufrufer gemeldet, dass er erst in CI läuft.
