# Code-Review #1372, Runde 1 (f38666c3)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/ki-settings.service.ts:142 | Die Prüfung `!['http:', 'https:'].includes(url.protocol)` hat keinen Test, der ohne sie rot wird: `ki-settings.pg.test.ts` prüft nur `?`, `#`, Anmeldedaten und `'kein url'` (das scheitert schon an `URL.parse`). Ohne die Bedingung blieben alle Tests grün, obwohl z. B. `file:///etc` (Bun-`fetch` liest `file:`) dann wieder angenommen würde. Ein Beispiel wie `ftp://…` oder `file:///…` in der Schleife deckt sie ab. |

Keine Blocker/Major.

Geprüft: alle 17 Dateien des Diffs; Sperre der Prüfung durch den Betreiber (Service, Test rot ohne Guard); `LLM_ENABLED` erreicht den Backend-Container über `docker-compose.prod.yml:110` (`LLM_ENABLED=${LLM_ENABLED:-}`) und `--env-file deploy/demo/.env`, ergibt `byOperator` und Modus `local` (`http://ollama:11434/v1`); `new URL(…, \`${baseUrl}/\`)` gleicher Zielpfad wie vorher bei gültigen Adressen; `redirect: 'error'` an allen drei Aufrufen mit `ki.baseUrl`/Schlüssel, mit Tests für Prüfung, Kategorisieren und `/models`; BFF ordnet `KI_ADDRESS_INVALID` dem Feld der Adresse zu (Unit-Test aus Vertrag), Prüfen zeigt `backend_ki_address_invalid` über `backendMessage`; Text in allen vier `messages/*.json`; Vertrag `ki-settings-address-invalid.json` und `api-contracts.pg.test.ts`; `docs/api-specification.md`; Szenario rot ohne Änderung (Speichern gelingt sonst), Schritte rufen nur Tasks, Negativprüfung über die Datenschutzerklärung; kein neuer Bildschirmzustand (Fehler am Adressfeld wie bei fehlender Adresse, Meldung der Prüfung wie bei `KI_KEY_FOR_NEW_ADDRESS`); ponytail-review: nichts zu streichen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bun run fitness -- --base origin/main`, `bunx vitest run --changed origin/main` (660 Tests), vitest open-work + design-guard, Backend `ki-settings.pg.test.ts`, `api-contracts.pg.test.ts`, `compose-prod.test.ts` (171 grün), `bun run test:e2e:wip -g "Eine Adresse mit"` (3 grün vor dem Entfernen von `@wip`), Prettier auf der neuen Vertragsdatei, die roten Läufe jedes neuen Tests.
- Die laufende Demo: `.env.example` ist nur die Vorlage; ob die `deploy/demo/.env` des Servers `LLM_ENABLED=true` erhält, liegt beim Betreiber (`deploy/demo/README.md:104` sagt das allgemein). Nicht aus dem Repo prüfbar.
- Schon gespeicherte Adressen mit `?`, `#` oder Anmeldedaten (vor dieser Änderung gespeichert) prüft `callLlm`/`isLlmAvailable` nicht nach; gesucht in `llm.service.ts` und `currentKi()`. Auf der Demo leert der nächtliche Reset sie; ausserhalb des Auftrags dieses Slices.
- Die https-/private-Adressen-/Dienstnamen-Regel ist laut Auftrag ausgeklammert (Entscheid ausstehend, Konflikt mit #580).
