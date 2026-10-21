# Review #583, Runde 1 (5486524..02283af)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/__tests__/invoices.test.ts:245-254 | Der neue Test baut die Antwort von `GET /categories` von Hand (`{ categories: [...] }` aus dem handgeschriebenen `caretaker`), statt sie aus `tests/contracts` zu nehmen; für die Listenantwort gibt es keinen Contract (`category.json` deckt nur das einzelne Element ab). CLAUDE.md, Gotchas «API contracts»: «add a contract when there is none». Das Muster stand schon vorher in der Datei (Z. 15, 117, 151), der neue Test erweitert es. |

Keine Blocker, keine Major.

Geprüft: Backend nimmt `limit=1000` an (`backend/src/routes/categories.ts:25` `t.Optional(t.String())`, `parseInt`; `category.service.ts:33,69` ohne Obergrenze, nur Default 100); 1000 ist das «alle» des Repos (`llm.service.ts:29,222`), über 1000 Kategorien sähe auch die KI nicht alle, darum für ein Einbenutzer-MVP tragfähig gegen die Done-Bedingung; alle Rechnungsformulare beziehen Kategorien nur über `invoiceChoices` (`invoices/+page.server.ts:49` inkl. «Rechnungen hochladen» via `InvoiceUploadDialog` aus `data.categories`, `new`, `[id]`, `[id]/edit`), kein clientseitiger Abruf von `/api/categories` in Rechnungskomponenten; `tankCategories` lädt keine Kategorienliste; der neue Test schlägt mit `limit=100` fehl (Fake liefert `slice(0, 100)`, erwartet 150); `No scenario`-Begründung steht in der Commit-Nachricht; kein UI-Text, kein Diff ausserhalb der Anforderung; die übrigen 100er-Grenzen (`config/categories/+page.server.ts:9`, `buildings/[id]/+page.server.ts:44`, `namesById`) liegen ausserhalb von #583 (laut Aufrufer #585, nicht nachgeprüft).

## Nicht bestätigt

- Red-Lauf des neuen Tests, `bunx vitest run --changed origin/main` (182 passed), `bun run lint`, `bun run check`: vom Aufrufer gemeldet, nicht erneut ausgeführt; der Red-Zustand ist nur durch Lesen des Tests bestätigt.
- Dass #585 die übrigen 100er-Grenzen (Kategorienseite, Liegenschaftsseite, `namesById` in `statement.ts`) tatsächlich erfasst: Issue nicht eingesehen.
- Verhalten des Backends mit `limit=1000` gegen die echte Datenbank (Backend-Tests nicht ausgeführt, auf Wunsch des Aufrufers).
