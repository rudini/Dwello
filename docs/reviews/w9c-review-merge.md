# Review: Merge 0c2eb3f (origin/main 69508c2 in claude/w9c-privacy-82-178, 0d1e8ce)

Geprüft: `git show --cc 0c2eb3f`, `git diff 69508c2 0c2eb3f` und `git diff 0d1e8ce 0c2eb3f` für alle Dateien, die beide Seiten seit der Merge-Basis e11a135 geändert haben (messages/*.json, overview.ts, dashboard/+page.server.ts, dashboard.test.ts, overview.test.ts, tests/e2e app-frame targets/tasks/questions/steps, screens.json, accessibility.feature, sprachen-bildschirme.feature, api-contracts.pg.test.ts, tests/contracts/README.md, docs/api-specification.md).

Ergebnis der Konfliktlösung: Beide Seiten bleiben erhalten, nichts doppelt, nichts verloren.
- `src/lib/overview.ts`: `expiredContracts` (A-6) und `formerTenants` (#178) beide in `OverviewInput`; `fixedTermTasks` und `formerDocumentTasks` beide vorhanden; Reihenfolge in `overviewTasks`: Einrichtung, workTasks, successorTasks, fixedTermTasks, formerDocumentTasks (main-Reihenfolge unverändert, #178 hinten angefügt wie auf dem Branch).
- `src/routes/dashboard/+page.server.ts`: `settings()`/`config`/`stored` und `expired()` von main, `formerTenants()` und `list(fetch, 'documents', 'data')` vom Branch; Destrukturierung und `Promise.all` stimmen positionsgleich überein (`stored` ↔ `config`, `documents` ↔ Dokumentliste). Der Name `documents` kollidiert nicht mit main.
- `dashboard.test.ts`: beide Importe (`config`, `statementList`, `documentList`); der Test #178 bleibt, die Mock-Funktion `backend()` wirft bei `/documents`, `list()` fängt das ab (leere Liste), andere Tests bleiben unberührt.
- E2E app-frame: Importe beider Seiten (`Attribute`, `ShareInViewport`, `glossaryExplanation`, `pagePurpose`, `sectionLinks` …), Schritte beider Seiten, keine doppelten Schritte.
- messages: je 1608 Schlüssel in de/fr/it/en, keine doppelten Schlüssel.
- Auto-gemergte Dateien: screens.json/Features (terms demo von main), API-Vertrag mail-transport (Branch), api-specification (`picture?` entfernt durch den Branch, mail-transport durch den Branch) – konsistent.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/routes/dashboard/+page.server.ts:126, src/lib/former-tenant-documents.ts:19 (auch src/routes/tenants/[id]/+page.server.ts:53) | Semantischer Merge-Konflikt: Ein abgelaufener befristeter Mietvertrag ohne «Mieter ist ausgezogen» (A-6) macht den Mieter für #178 zum ehemaligen Mieter. Die Übersicht zeigt dann für dieselbe Person «Befristeten Mietvertrag prüfen» (Wohnt X noch in der Wohnung?) und «Dokumente von X prüfen … Löschen Sie, was Sie nicht mehr brauchen». |
| C-2 | Nit | src/lib/overview.ts:228 | Kein Test hält die Reihenfolge fixedTermTasks vor formerDocumentTasks fest; die Konfliktstelle ist damit nur durch Lesen belegt. |

## C-1 (Major)

**Warum falsch:** `formerTenantDocuments` zählt einen Mieter als ehemalig, sobald alle Verträge nach `contractStatusOn` «ended» sind (Vertragsende < heute). main führt mit A-6 (#115) genau diesen Zustand als offen ein: Vereinbartes Vertragsende vorbei, nicht gekündigt, kein späterer Vertrag, kein `movedOut` heisst «der Mieter ist vielleicht geblieben, der Vertrag läuft dann unbefristet weiter (Art. 266 Abs. 2 OR)». Nach dem Merge fordert die Übersicht den Verwalter für einen Mieter, der vielleicht noch dort wohnt, zum Löschen seiner Dokumente auf (`dashboard_task_former_documents_text_*`), gleichzeitig mit der Frage, ob er noch dort wohnt. Löschen ist irreversibel. Wählt der Verwalter danach «Unbefristet weiterführen», hat er womöglich Mietvertrag oder Übergabeprotokoll eines laufenden Mietverhältnisses gelöscht. Den Zustand gibt es auf keiner der beiden Elternseiten; der Merge erzeugt ihn.

**Nachweis:** In `src/__tests__/dashboard.test.ts` im Test «nennt ehemalige Mieter …» den Vertrag `former` mit `terminated: false`, ohne `movedOut` lassen (so ist er schon) – die Aufgaben enthalten dann `fixed-term-k9` **und** `former-documents-t9` für dieselbe Person. Erwartung nach A-6: kein `former-documents-t9`, solange `fixed-term-k9` offen ist (bzw. erst nach «Mieter ist ausgezogen» oder bei gekündigtem Vertrag). Dasselbe gilt für den Abschnitt «Dokumente aus der Zeit davor» auf `/tenants/t9`.

**Vorschlag:** In `formerTenantDocuments` (oder beim Aufrufer) einen Mieter nicht als ehemalig behandeln, solange sein letzter Vertrag die A-6-Bedingung erfüllt (vereinbartes Ende vorbei, `!terminated && !movedOut`, kein späterer Vertrag der Wohnung); ein Test auf Unit-Ebene und, da sichtbar, ein Schritt im Szenario von #178. Falls der Product Owner das anders will, gehört es unter «Blocked on me».

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` (158 Dateien, 2818 Tests), Backend `bun run type-check` auf 0c2eb3f: vom Aufrufer gemeldet, nicht wiederholt.
- E2E auf dem Merge (läuft beim Aufrufer) und Backend-pg-Tests (u. a. api-contracts.pg.test.ts mit dem neuen mail-transport-Vertrag): nicht ausgeführt, nur gelesen.
- Persona-/Fachsicht, ob C-1 eine Produktentscheidung braucht: nicht geprüft; A-6-Text in docs/anforderungen-vertragsende.md:197-207 gelesen.
