# Code-Review #720, Runde 1 (ecb1ea3)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | backend/src/app.ts:40, backend/src/index.ts:33 | `bun build` (Skript `build`, README:146-147 «Start production server») setzt `process.env.NODE_ENV` beim Bündeln fest ein; ohne `NODE_ENV=production` beim Build liefert `dist/index.js` `/swagger` auch mit `NODE_ENV=production` zur Laufzeit aus. Die neue Zeile in docs/api-specification.md:5 stimmt für diesen Weg nicht |

## C-1 (Major): Im gebündelten Backend greift die Prüfung nicht

**Warum falsch:** Die Anforderung verlangt, dass `/swagger` nur in der Entwicklung erreichbar ist. Das README nennt `bun run build` und dann `bun run start` (`bun run dist/index.js`) als Weg zum Produktionsserver. `bun build src/index.ts --outdir dist --target bun` ersetzt `process.env.NODE_ENV` schon beim Build durch eine feste Zeichenkette. Ist beim Build kein `NODE_ENV` gesetzt, ist das `"development"`. Die Bedingung in app.ts wird damit fest zu `openapi({...})`, egal welches `NODE_ENV` beim Start gilt. Die Dokumentation sagt das Gegenteil: «with `NODE_ENV=production` … both answer 404».

Docker-Image und docker-compose.prod.yml sind nicht betroffen. Beide starten `bun run src/index.ts` ohne Build, und dort gilt `NODE_ENV=production` (backend/Dockerfile:24 und :43, docker-compose.prod.yml:94).

**So zeigt man es** (im Scratchpad nachgestellt):

```
echo "console.log(process.env.NODE_ENV === 'production' ? 'prod' : 'dev')" > a.ts
bun build a.ts --outdir out --target bun   # out/a.js: console.log("dev");
NODE_ENV=production bun out/a.js           # -> dev
```

Mit `Bun.env.NODE_ENV` bleibt die Abfrage im Build erhalten (`console.log(Bun.env.NODE_ENV === "production" ? …)`). Das wäre ein möglicher Fix, ebenso ein Hinweis zum Build in README und api-specification. Der neue Test deckt diesen Weg nicht ab, weil er `src/app.ts` ungebündelt lädt.

## Nicht bestätigt

- `bun run type-check`, `bun run test` (1598 pass, Coverage 96.4 %), `bun run lint` und Prettier: vom Aufrufer gemeldet. Selbst wiederholt habe ich nur `bun test src/__tests__/api-docs.pg.test.ts` (4 pass).
- Den fehlenden Rotlauf des neuen Tests habe ich nur durch Lesen beurteilt: Vor der Änderung hing das Plugin nicht an `NODE_ENV`, also 200/200. Den Basis-Commit habe ich nicht ausgeführt.
- Ob ausser Docker/Compose und `bun run start` noch andere Produktionswege genutzt werden, z. B. ein blankes `bun src/index.ts` ohne `NODE_ENV`, steht in keinem Dokument. Gesucht habe ich in README.md, docs/ und .github/.

Geprüft: Kein E2E-Code, CI-Workflow, keine Playwright-Konfiguration und kein Vertrag in `tests/contracts` braucht `/swagger`. Die Antwort in Produktion ist 404 `{"error":"Not found","code":"NOT_FOUND","params":{}}` (onError NOT_FOUND). Auch ohne `DATABASE_URL` schreibt der Import auf stdout nichts Störendes. Der Unterprozess erbt cwd (`backend/`) und Umgebung korrekt. `restoreElysiaFormats()` bleibt nötig, weil der Plugin-Import weiterhin geladen wird (Zeile 8 und 29 unverändert). Die Doku-Zeilen und die Begründung «No scenario» im Commit sind stimmig.
