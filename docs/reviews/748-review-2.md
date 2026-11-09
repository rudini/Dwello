# Review Slice 748, Runde 2 (Delta 5989dfbf..49b43f66)

Geschlossen: C-1, C-2, C-3

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-4 | Minor | src/__tests__/tenant-export.test.ts:88 | `while (calls.length < 2) await reader.read();` bricht nicht ab, wenn der Stream endet. Holt eine Regression gar keine Datei mehr, liefert `read()` nach dem Ende sofort `{ done: true }`. Die Schleife läuft dann nur noch in Mikrotasks, und der Timeout von vitest kommt nie an die Reihe. Der Test hängt den Worker, statt rot zu werden. Behebung: Schleife bei `done` verlassen. |
| C-5 | Minor | backend/src/services/tenant-export.service.ts:207-209 | Seit C-3 lässt die Route nur die drei Arten zu. Der Zweig `read ? … : []` und `kind: string` mit `as keyof typeof sources` sind damit toter Code, denn `exportFile` hat nur diesen einen Aufrufer (routes/tenants.ts:114). Kürzer: `kind: keyof typeof sources` und der Wächter entfällt. |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bun run lint`
  - `bunx vitest run src/__tests__/tenant-export.test.ts` (5)
  - `cd backend && bun run type-check`
  - `bun test src/__tests__/tenant-export.pg.test.ts` (17)
- Ob die neuen Tests rot waren, habe ich nur durch Lesen beurteilt:
  - C-1-Test: Werden alle Dateien vorab geholt, ist `calls` direkt nach `GET` 3 und der Test schlägt fehl. Holt `pull` alle Dateien auf einmal, steht `calls` nach der Schleife auf 3. Der erste `pull` liest nur `daten.json`, ohne Abruf. Darum ist «direkt nach GET nur die Liste» unabhängig vom Timing.
  - C-2-Test: Fällt die Mieter-Bedingung weg, liefert `contract/<id>` 200 statt 404.
  - C-3-Test: Ohne die Union antwortet die Route mit 500 (TypeError aus `sources.valueOf`).
- Ob 422 die übliche Antwort des Backends auf ungültige Parameter ist, habe ich nur an management-fee.pg.test.ts gesehen, nicht am globalen `onError`. docs/api-specification.md:97 nennt für diese Route nur 404.
- Data-Descriptor (fflate `ZipPassThrough`): Gegen die Einschätzung des Aufrufers, dass Windows Explorer, macOS Archive Utility und 7-Zip ihn lesen, habe ich keinen Gegenbeleg gefunden. Selbst geprüft ist es nicht.

Geprüft: Delta gegen C-1 bis C-3. Zurücksetzen von `contractPdf` im `finally`: Der Vormieter hat beim Anlegen kein PDF. Vertrag und Doku sind nicht betroffen, weil die Antwort gleich bleibt. Keine fremden Änderungen.
