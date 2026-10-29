# Code-Review #945, Runde 1 (72efbde..38c01c6)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | Dockerfile:7-8, backend/src/__tests__/compose-images.test.ts:57-58 | Der Kommentar «the runtime dependencies have no native code» stimmt nicht: `pdfjs-dist@6.4.299` hat die optionale Abhängigkeit `@napi-rs/canvas` (bun.lock:807, 211), die pro Plattform ein `.node`-Paket installiert (`@napi-rs/canvas-linux-x64-musl`, bun.lock:229). `prod-deps` läuft jetzt auf `$BUILDPLATFORM`, also landet im arm64-Image das x64-musl-Binary statt `linux-arm64-musl`. Heute folgenlos, weil pdf.js nur im Browser läuft (`src/lib/file-pages.ts:1-21`, dynamischer Import aus `InvoiceUploadDialog.svelte`) und der Server das Canvas-Modul nie lädt; der Kommentar sollte das als Grund nennen statt «kein nativer Code», sonst bricht ein späterer serverseitiger pdf.js-Einsatz nur auf arm64. |

Keine Blocker, keine Major.

Zu den Fragen des Aufrufers:
- `--platform=$BUILDPLATFORM` ohne `ARG`: BuildKit setzt `BUILDPLATFORM` als vordefiniertes globales Argument, das in `FROM` ohne Deklaration gilt. Der PR-Job (`docker build` auf ubuntu-latest, BuildKit Standard) und buildx im Release nutzen BuildKit; nur der alte Builder (`DOCKER_BUILDKIT=0`) liesse es leer.
- `prod-deps` (`FROM deps`) erbt die Plattform von `deps`, also `$BUILDPLATFORM`; richtig.
- Laufzeit auf arm64: `runner` kopiert nur `build/`, `package.json` und `node_modules` aus `prod-deps`. Außer dem ungenutzten Canvas-Binary aus C-1 entsteht dort nichts Plattformabhängiges; `node` selbst kommt aus `node:26-alpine` der Zielplattform. Die nativen Build-Werkzeuge (esbuild, rollup) laufen in `deps`/`builder` auf derselben Plattform, für die sie installiert wurden.

Geprüft: Dockerfile-Stufen und `COPY --from`, Release-Workflow (buildx, QEMU, `linux/amd64,linux/arm64`), CI-Job «Docker images», neuer Test (vor dem Fix rot, da Stufe `bun` und `--platform` fehlten), Plan-Eintrag; nichts Fremdes im Diff.

## Nicht bestätigt
- `bun run lint` grün – vom Aufrufer gemeldet.
- `bun test src/__tests__/compose-images.test.ts` 7 pass, neuer Test vorher rot – vom Aufrufer gemeldet (durch Lesen plausibel).
- Ein Build des Images für amd64 oder arm64 lief weder beim Aufrufer noch hier; ob der arm64-Release-Build jetzt durchläuft und ob `@napi-rs/canvas-linux-x64-musl` tatsächlich in `prod-deps/node_modules` landet, zeigt erst ein Build (gesehen nur in bun.lock).
