# Code-Review 1093d, Runde 2 (Delta `d62182106..cca57e8b1`)

Keine offenen und keine neuen Befunde.

Geschlossen: C-1, C-2

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (988 Tests, documents.test.ts eingeschlossen), E2E Chromium der Features tenant-documents und documents, axe-Zeile documents-refused-settings; der neue Test «zeigt die Fehlerseite auch mit einem Code, den Dwello nicht kennt» zuerst rot gesehen.
- WebKit: ob ein PDF-Dokument mit `application/pdf` + `attachment` gespeichert und ein Foto mit `application/octet-stream` nicht angezeigt wird, zeigt erst der nächste All-Browser-CI-Lauf.
- Mobile Safari (iOS): Vorschau eines PDF-Dokuments ohne Gerät nicht prüfbar; der Header ist jetzt wieder derselbe wie auf der Basis (`application/pdf`).

Geprüft: `proxyFile` liefert für `kind === 'application/pdf'` den Typ unverändert, damit ist `documents.test.ts:118` wieder erfüllt, und der Foto-Test (`pdf-refusal.test.ts:190`) bleibt auf Octet-Stream; das Backend setzt `content-type` exakt auf den gespeicherten `mimeType` (`backend/src/routes/file-response.ts:7`), ein Vergleich mit Gleichheit reicht. Die Code-Prüfung `/^[A-Z_]+$/` schliesst `__proto__`, `constructor`, `toString` aus; alle bekannten Codes (z. B. `IBAN_INVALID`, `DOCUMENT_NOT_FOUND`) passen weiter; der neue Test ist auf der Basis rot (`gone['__proto__']()` wirft, `gone['constructor']()` liefert ein Objekt statt des Titels). C-2 steht in der Commit-Nachricht von cca57e8b1.
