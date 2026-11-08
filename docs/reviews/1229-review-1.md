# Code-Review Slice 1229, Runde 1

Bereich: `git diff 86bcc951c33b64627328f119ec4ec864c972dbc0 5f18b4c` (ein Commit, `fix(services): load every record of whole lists`), Worktree `review-1229-code`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

## Nicht bestätigt

- `bun run type-check` (backend) grün: vom Aufrufer gemeldet.
- `bun test src/__tests__/whole-lists.pg.test.ts` mit 23 bestanden, 0 fehlgeschlagen (~58 s): vom Aufrufer gemeldet.
- Rot vor dem Fix: vom Aufrufer gemeldet. Der Mutationslauf (jede `limit: null`-Stelle einzeln auf ihr altes Limit zurück) läuft noch. Beim Lesen fällt jede der 31 Stellen in mindestens einem Test einzeln durch: Zur Sortierung liegt der gesuchte Datensatz immer hinter mindestens 1000 neueren (10000 bei `reportPeriods`). Der Rest steht unter «Geprüft». Eine Stelle hängt vom Zustand der Test-DB ab: `runDefaultsOf` mit begrenzten Mietverträgen fällt nur deshalb durch, weil `management_fee_pct` in der Test-DB nicht 5 ist (Standard 3, `config.service.ts`).
- Frontend `bun run lint`/`check`, `bun run fitness` sowie die Commit-Gates fallow, deepcheck und testcheck für das neue `backend/src/db/paged.ts` und die neue Testdatei: nicht gemeldet, nicht ausgeführt.
- Ausserhalb des Bereichs der Issue (sie nennt `backend/src/services` und `backend/src/routes`): Der BFF lädt ganze Listen weiter mit `limit=1000`. Am nächsten am Fall der Issue ist `src/lib/server/statement-generation.ts:290` (`statements?buildingId=…&limit=1000`, die Abrechnungen eines Gebäudes für die Vorschau). Dazu kommen `src/lib/server/statement.ts:230`, `src/lib/server/invoice.ts:44-45`, `src/lib/server/distribution-key.ts:36` und `src/routes/**/+page.server.ts` (Gebäude, Wohnungen, Kategorien, Heizprofile, Verteilschlüssel). Ob dafür eine Issue nötig ist, entscheidet der Aufrufer. Im Backend lädt keine Stelle mehr eine ganze Liste mit festem Limit: Die Standardwerte (`listDistributionKeys` 100, `listBuildings` 20, `listTenants` 50, `listInvoices` 20) erreicht kein interner Aufrufer ohne Limit (grep über die `list*(`-Aufrufe in `backend/src`).

Geprüft: alle 31 geänderten Stellen und `paged()`. Dazu die Defaults bei `null` (Destrukturierungs-Default greift nicht, `undefined` bei `listContracts({ apartmentId })` bleibt «alle»), `.where(undefined)` bei Kategorien und Heizprofilen sowie der Kommentar bei `missingByContract`. Weiter die Sortierung der Testdaten, Stelle für Stelle: Mietverträge nach `startDate` (2002 vor 2000), Abrechnungen nach `statementDate`, dann `createdAt` (die Kopien von s2 sind neuer, s3 hat das Datum 2000-07-15), Wohnungen nach Stockwerk (1 vor 9), Kategorien nach `sortOrder` (-1 vor 99999, Typ standardmässig `predefined`), Heizprofile nach Typ und Name («A …» vor «Zuletzt …»). Ebenso Aufräumen und Isolation (`finally` je Test, `afterAll` über die eigenen Wohnungen, Gebäude-Kaskade, Mieter mit Token, `llmConfig` zurückgesetzt, LLM-Cache mit Token-Schlüssel), ponytail-review (ein Helfer statt zweier Inline-Kopien, nichts ungenutzt), keine API-Antwort, kein UI-Text und kein Screen geändert, «No scenario» stichhaltig.
