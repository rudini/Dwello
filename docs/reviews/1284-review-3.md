# Code-Review #1284 «Aufgehobene Wohnung» (mit #1302), Schlussrunde 3

Bereich: `git diff 9ca8a22 857b99b^1 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive' ':!docs/design/personas'` (Worktree `review-1284-cr3`, Commit 857b99b, sauberer Merge von origin/main). Vorbericht: `docs/reviews/1284-review-2.md`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-2 | Minor | src/routes/apartments/[id]/edit/+page.svelte:43-51, src/lib/server/apartment-form.ts:216-219 | Unverändert offen (siehe Vorbericht): Ein ungültiges Datum bei «Aufgehoben ab» löscht einen gespeicherten Tag ohne Rückfrage. |
| C-4 | Minor | backend/src/services/prorating.service.ts:388, backend/src/services/pdf-segments.ts:54, src/lib/server/statement.ts:264-271 | Unverändert offen (siehe Vorbericht): Fallen alle Kosten vor den Tag, zeigt die Position «je Zeitraum» mit einer Zeile. Einleitungstext und Hinweis fehlen. |
| C-8 | Minor | backend/src/services/pdf-segments.ts:38 | Der Fix von C-3 kopiert wörtlich den Ausdruck aus `keyFactor` (backend/src/services/pdf.service.ts:512): `keyShare.includes('+') ? `(${keyShare.replace(/\n/g, ' ')})` : keyShare`. Die Regel «gemischter Schlüssel in Klammern» steht jetzt an zwei Orten. Ein gemeinsamer Helfer z. B. in `pdf-format.ts` wäre ohne Zirkelimport möglich (`pdf.service` importiert schon `pdf-segments`). |

Geschlossen: C-1, C-3, C-5, C-6, C-7

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check` (0 Fehler), `bun run fitness`, `cd backend && bun run type-check`, `bunx vitest run` (221 Dateien, 4650 pass), `cd backend && bun run test` (2152 pass, Coverage 97.3 %), Prettier auf den neuen Dateien, E2E `-g "Aufgehobene Wohnung"` chromium + api (12 passed auf 5c1b1ba). Ebenfalls vom Aufrufer gemeldet: der rote Lauf des neuen Szenarios (Prüfung in `checkContractOverlap` herausgenommen) und der rote Lauf des Render-Tests zu C-3. Beim Lesen sind beide ohne die Änderung rot: Ohne die Sperre speichert das Formular, und es erscheint keine Fehlermeldung. Ohne den Fix fehlen die Klammern.
- Der Wortlaut ist im BFF-Test nur über die Aktion «Mietvertrag beenden» der Detailseite festgehalten (`contract-actions.test.ts`, `actions.end`). Das Szenario prüft den Weg über die Bearbeitungsseite (`ContractForm`). Der Assistent «Neuer Mietvertrag» (`ContractWizard.svelte:293`, `backendMessage`) hat für diese Sperre keinen eigenen Test. Gelesen: Alle drei Wege nutzen dieselbe Abbildung `backendMessage` mit `backend_<code>`, darum erwarte ich kein abweichendes Verhalten.
- `api-contracts.pg.test.ts`: Der neue Fall setzt `discontinuedFrom` direkt in der Datenbank. Dass `rented.remove()` die Wohnung danach trotzdem löscht, habe ich nicht ausgeführt. Der Aufrufer meldet die Suite als grün.
- Aus dem Vorbericht weiter offen und nicht Teil dieses Bereichs: V-1 (a)/(b) mit #1301 und V-4 (Status «Aufgehoben seit»).

Geprüft: Die Glossarzeile steht wörtlich wie im «Decided (product owner)» von #1302 (per REST gelesen). Gelesen und in Ordnung: die Verschiebung von `DiscontinuedNotes.svelte` (keine relativen Importe, einzige Verwendung angepasst), `daysAfter(cuts[i], -1)` gleichwertig zur alten Rechnung, die Formatkorrekturen, der Step zu C-7 über `errorMessage` (Text statt ja/nein), der Contract mit `code` und `params`, die Steps des neuen Szenarios (vorhanden, nur Tasks und Questions) und die vier Sprachen von `backend_contract_apartment_discontinued`.
