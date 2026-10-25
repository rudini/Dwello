# Code-Review 720, Runde 2 (Delta ecb1ea3..37422c2)

## Status der offenen IDs aus Runde 1

- C-1 (Major): **geschlossen.** `bun build src/index.ts --target bun` (Bun 1.4.4, wie Skript `build`) behält im Bundle `Bun.env.NODE_ENV === "production"` (app.ts) und `Bun.env.NODE_ENV !== "production"` (index.ts) als Laufzeitzugriff. Eine Probe mit `process.env.NODE_ENV === "production"` wird dagegen beim Bündeln zu `false` – der neue Test fällt also bei einem Rückfall auf `process.env` (Swagger antwortet dann mit 200 statt 404). Ausserhalb der Tests liest `backend/src` `process.env.NODE_ENV` nirgends mehr. Die Zeile in docs/api-specification.md:5 stimmt jetzt.

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-2 | Minor | backend/src/__tests__/api-docs.pg.test.ts:18 | `mkdtempSync(join(tmpdir(), 'dwello-bundle-'))` wird nie entfernt. Jeder Lauf von `bun run test` lässt ein Bundle von 4,2 MB in `/tmp` zurück (auf dieser Maschine liegen schon vier `/tmp/dwello-bundle-*`). Abhilfe: nach dem Lauf des Subprozesses `rmSync(outdir, { recursive: true, force: true })` aufrufen. |

Geprüft: Ein Build, der fehlschlägt, lässt den Test korrekt rot werden (leere Ausgabe wird zu `[0]`). Der Build dauert etwa 0,3 s und bleibt damit weit unter dem Test-Timeout. Im Delta steht nichts, das nicht zu #720 gehört.

## Nicht bestätigt

- `cd backend && bun run type-check` ok sowie `bun run test` mit 1599 bestanden, 0 fehlgeschlagen und 96,4 % Coverage: vom Aufrufer gemeldet, nicht erneut ausgeführt. Dass der neue Test vor dem Fix rot war, habe ich nur durch Lesen und die `process.env`-Probe oben bestätigt, nicht mit einem Lauf auf ecb1ea3.
