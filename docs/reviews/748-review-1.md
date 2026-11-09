# Review Slice 748, Runde 1 (5989dfbf, Basis 2ece846b)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/__tests__/tenant-export.test.ts:24 | Kein Test zeigt, dass der BFF streamt: Ein BFF, der alle Dateien vorab holt und mit `zipSync` zippt (genau das Speicherproblem aus #748), besteht alle Tests. |
| C-2 | Minor | backend/src/__tests__/tenant-export.pg.test.ts:141 | Die Weigerung für fremde Dateien ist für `contract/<id>` nicht abgedeckt: Der Vormieter (`former`) hat kein `contractPdf`. Fällt die Mieter-Bedingung in `sources.contract` (tenant-export.service.ts:200) weg, bleibt der Test grün. |
| C-3 | Minor | backend/src/services/tenant-export.service.ts:208 (Route tenants.ts:122, `kind: t.String()`) | `sources[kind]` liest auch Prototyp-Schlüssel. Mit `kind` = `hasOwnProperty`, `valueOf` oder `__proto__` gibt es einen TypeError und damit 500 statt 404; `constructor` antwortet 404 nur zufällig (der String wird iteriert). Behebung: `kind` auf die drei Arten begrenzen (`t.UnionEnum` oder `Object.hasOwn`). |

## C-1: Das Streaming selbst ist ungetestet

Kern von #748 auf der BFF-Seite: Jede Datei wird erst geholt, wenn der Browser den nächsten Teil liest. So hält der Server nie alle Dateien gleichzeitig. Die Tests zeigen das nicht:

- Der erste Test prüft `calls` erst nach `await response.arrayBuffer()`. Er zeigt also nur, dass jede Datei einzeln geholt wird, nicht wann.
- Der zweite Test zeigt den Abbruch bei einem Fehler.

So zeigt man, dass das fehlt: Man ersetzt in `+server.ts` den Aufruf von `zipStreamDownload` durch `await Promise.all(files.map(read))` und anschliessend `zipDownload(...)`. Alle Tests bleiben grün, obwohl dann wieder alle Dateien gleichzeitig im Speicher liegen.

Die unterste Ebene, die das zeigen kann, ist dieser Unit-Test:

- Die Vorlage bekommt zwei Dateien.
- Direkt nach `GET`, vor dem Lesen des Körpers und nach einem Mikrotask, enthält `calls` nur die Liste.
- Nach dem ersten `reader.read()`-Durchgang ist die zweite Datei noch nicht geholt.

Der Code selbst ist richtig; geprüft am fflate-0.8.3-Quelltext:

- Der Standard-HWM ist 1. Jedes `pull` gibt Kopf, Daten und Data-Descriptor synchron aus. Der nächste `pull` kommt erst, wenn die Queue leer ist.
- `zip.end()` gibt das Inhaltsverzeichnis mit `final` aus, danach `close`.
- Ein Fehler in `read` lehnt `pull` ab, und der Stream geht in den Fehlerzustand.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main`
  - `cd backend && bun run type-check`
  - `bunx vitest run` (4845)
  - Backend-pg-Tests api-contracts, tenant-export und data-export (156)
  - E2E tenants.feature und datenexport.feature, chromium+api (21)
  - fallow-Gate
- Ob die Tests rot waren (die neue Weigerung ohne Mieter-Bedingung; der Abbruch ohne den `file.ok`-Wächter): nur durch Lesen beurteilt. Beide würden ohne die Änderung fehlschlagen.
- Kompatibilität: fflate schreibt gestreamte Einträge mit Data-Descriptor (`ZipPassThrough`: STORED mit Flag 8, fflate index.cjs:1887). fflate `unzipSync` und das E2E lesen das. Ältere oder streamende Entpacker (z. B. Java `ZipInputStream`) lehnen STORED mit Data-Descriptor ab. Mit Windows Explorer und macOS Archive Utility nicht geprüft.
- Wenn eine Datei mitten im Download fehlt (z. B. gelöscht zwischen Liste und Abruf), bricht der Browser-Download ab. Das ist ein Zustand des Browsers, kein Bildschirm der App. Ob ihn der E2E-Stack erzeugen kann (`tests/e2e/CLAUDE.md`, failure states), nicht abschliessend beurteilt. Der Unit-Test deckt ihn ab.

Geprüft:

- Auth: `authMiddleware` vor `tenantRoutes` (backend/src/app.ts:110/119), `handleFetch` setzt das JWT.
- Mieter-Bedingung in allen drei Quellen.
- PDF-Wahl unverändert: mailed, dann keptFirst, dann stored; Entwürfe ohne PDF.
- Vertrag `tests/contracts/tenant-export.json` und docs/api-specification.md stimmen.
- Kein neuer UI-Text und kein neuer Bildschirm.
- Keine fremden Änderungen im Diff.
- ponytail-review: kein ungenutzter Code und keine Kopie eines Helfers; `zipDownload` wird von config/export weiter genutzt.
