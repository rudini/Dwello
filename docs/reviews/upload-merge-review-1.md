# Code-Review: Merge-Commit 7579d685 (feat/invoice-upload-217 ← origin/main), Runde 1

Geprüft: `git show --cc 7579d685`, `git diff 57a6f19c 7579d685`, `git diff 2187df3f 7579d685`, die Änderungen von `main` seit der Merge-Basis c91aa8e9 und ein nachgerechneter Auto-Merge (`git merge-tree --write-tree 57a6f19c 2187df3f` → ad46d8ec), verglichen mit dem Commit.

Ergebnis: Ausser den sechs Konfliktdateien, der Umbenennung der Migration und den zwei Doku-Zeilen, die die Migration nennen (`docs/data-model.md:211`, `implementation_plan.md:15`), ist der Commit identisch mit dem Auto-Merge. Alle Konflikte sind so gelöst, dass beide Seiten erhalten sind:

- `README.md:292`: Der Satz des Branches zu hochgeladenen Rechnungsdateien (#217) steht im Text von `main` (Land aus `LLM_PROVIDER_COUNTRY`, `LLM_ENABLED=false` mit Hinweis in der Datenschutzerklärung).
- `backend/src/__tests__/api-contracts.pg.test.ts:174–203`: Beide Tests sind vollständig (extract, propose refused). Der Import von `llmConfig` aus `main` ist erhalten.
- `messages/{de,fr,it,en}.json:133–135`: Die Texte des Branches für `privacy_llm_external`/`privacy_llm_local` und `privacy_llm_off` aus `main` sind übernommen. `main` hatte die beiden ersten Texte nicht geändert (geprüft mit `git diff c91aa8e9 2187df3f`). Keine doppelten Schlüssel, alle vier Dateien haben 1437 Schlüssel.
- Migration `0005_invoice_documents.sql`: Inhalt unverändert. Sie hängt nicht von 0003/0004 ab (andere Tabellen). `migrate.ts:19` sortiert nach Dateiname. Code und Tests verweisen nirgends mehr auf `0003_invoice_documents`.

Auf semantische Konflikte geprüft, ohne Befund:

- **`proposeAllocability`** (main #186) wirft jetzt CodedErrors statt `null` zurückzugeben. Der Branch ruft die Funktion nicht auf. `extractInvoice` (Branch) hat sein eigenes Muster mit `null` und `EXTRACTION_UNAVAILABLE` in der Route. `llm-eval.ts` fängt den Fehler ab (Code aus main).
- **`llm-stub.ts`**: Die Prüfung «KI-Ausfall» aus `main` steht in `reply()`. Die Weiche `answer()` des Branches (Datei → `read`, `RECHNUNGSDATEN:` → `categorize`, sonst `reply`) lässt sie unberührt.
- **Datenschutzseite** (main #216): `+page.svelte:11–16` zeigt `privacy_llm_off` nur bei `enabled === false`. Die DOM-Tests des Branches ohne `enabled` landen weiterhin beim lokalen bzw. externen Text. Ist die KI aus, gibt `extractInvoice` `null` zurück (Antwort 503). Es wird also nichts übermittelt, und `privacy_llm_off` stimmt auch für hochgeladene Dateien.
- **`schema.ts`**: `invoiceDocuments` (Branch) und `heatingShare`/Spalten mit Tagen (main) stehen an verschiedenen Stellen.
- **Fehlercodes**: Für alle Codes gibt es `backend_<code>`: `KI_PROPOSAL_UNAVAILABLE`, `KI_PROPOSAL_UNSURE`, `EXTRACTION_UNAVAILABLE`, `BELEG_NOT_FOUND`, `DOCUMENT_*`.
- **`screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`, `fixtures/screens.ts`, `tasks/accessibility.ts`**: Die Zustände `ki-unsure`/`ki-unavailable`/`category-edit-predefined` aus main und `upload-dialog`/`upload-discard-dialog` des Branches stehen nebeneinander. Das ist der Auto-Merge ohne Eingriff.
- **`invoice-detail.feature` und `invoice-pages.dom.test.ts`**: Die geänderte Formulierung des Hinweises aus main (#185) und die Beleg-Tests des Branches stehen beide da.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `docs/design/offene-punkte.md:105`, `implementation_plan.md:51` («Found: `swiss-today.pg.test.ts` fails …») | Zeile O-29 und die Notiz unter «Found» sind nach dem Merge veraltet. `main` hat genau diesen Fehler mit #223 behoben (a7f0dcab: `afterAll` löscht `utilityStatements` direkt, `swiss-today.pg.test.ts:70–71`) und die eigene Zeile H-27 entfernt. Der Aufrufer meldet für das Backend 0 fail. O-29 entfernen und die Notiz anpassen. |

Keine Blocker oder Major-Befunde.

## Nicht bestätigt

- Backend `bun run type-check` sauber und `bun run test` mit 650 pass, 0 fail: vom Aufrufer gemeldet.
- `bun run check` mit 0 Fehlern: vom Aufrufer gemeldet.
- `bun run test:coverage` mit 157 Dateien und 2576 Tests grün: vom Aufrufer gemeldet. Das schliesst die Konsistenztests `tests/unit/a11y-screens.test.ts` und `tests/unit/i18n-screens.test.ts` für die zusammengeführten Bildschirmlisten ein.
- `bun run lint` sauber: vom Aufrufer gemeldet.
- Den gezielten Lauf `bunx vitest run` (privacy-page, invoice-pages, a11y-/i18n-screens) im Worktree konnte ich nicht wiederholen. `node_modules` des Worktrees verweist auf `/home/user/dwello/node_modules`, und der Zugriff darauf ist gesperrt.
- E2E läuft laut Aufrufer parallel; ein Ergebnis liegt nicht vor. Ob der zusammengeführte Stand-in in einem Lauf die Upload-Szenarien und das Szenario «KI-Ausfall» aus main beide bedient, habe ich nur im Code bestätigt (`backend/scripts/llm-stub.ts:94–155`), nicht durch einen Lauf.
