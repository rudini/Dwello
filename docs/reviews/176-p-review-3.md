# Code-Review #176, Slice «Persona-Fixes», Runde 3 (Delta) und Merge-Commit

Geprüft im Worktree `/tmp/claude-0/-home-user-Dwello/fbb18b34-b688-5fdb-9b9f-9f01da7bd45c/scratchpad/review-176-p3` (auf `37b4f68`):

- `37b4f68`: Rest von G-3 (Zustand `ki-checking`), G-9 und G-10. Alle 11 geänderten Dateien sind gelesen.
- `6fd5b2c`: Merge von `origin/main` in den Zweig. Gelesen sind die Konfliktdateien und der Unterschied zum automatischen Merge-Baum.

Als Umgebung kamen dazu: `tests/e2e/tasks/accessibility.ts` (`lookAt`, `askKi`), `RadioGroup.svelte`, `CategoryForm.svelte:40-80`, `targets/categories.ts`, `playwright.config.ts:63-95`, `backend/src/config/llm.ts` und `backend/src/services/llm.service.ts:60-95`.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| G-11 | Minor | `backend/scripts/llm-stub.ts:24`, `:68`, `:71-78`; `tests/e2e/tasks/accessibility.ts:186` | Laut Code und Kommentar antwortet der Stand-in bei «langsam» nach 60 s. Tatsächlich schliesst `Bun.serve` die Verbindung schon nach rund 10 s, weil `idleTimeout` dort standardmässig 10 s beträgt. Selbst ohne diese Grenze würde das Backend nach 30 s abbrechen (`LLM_TIMEOUT`, Standard 30000, `llm.service.ts:71`). Für axe bleiben also etwa 10 s statt «a minute». |
| G-12 | Nit | `6fd5b2c` (Merge) | Der Merge-Commit enthält `docs/reviews/176-p-review-2.md` und den Plan-Nachtrag U-29 → U-30. Beide stehen in keinem der beiden Eltern. Die Datei gehört zur Aufgabe, doch `git log -p` ohne `-m`/`--cc` zeigt sie nicht, und ein Blick auf die Konfliktlösung übersieht sie leicht. |

## Stand der Befunde aus Runde 2

| ID | Stand | Beleg |
|---|---|---|
| G-3 | behoben (mit G-11 als Minor zur Stabilität) | Der Zustand `ki-checking` steht in allen drei Listen: `screens.json:37` (beschrieben) und `:434` (der Seite `category-new` zugeordnet), `accessibility.feature:135`, `sprachen-bildschirme.feature:136`. Die Aufgabe `ki-checking` gibt einen Namen mit «Langsam…» ein, klickt «Von der KI prüfen lassen» und wartet mit `Wait.until` auf `category-proposal-checking`. Damit sehen axe und die Sprachprüfung den Text `categories_proposal_checking` und den gesperrten Knopf im Formular. `lookAt` erreicht den Zustand für jede Variante neu (`tasks/accessibility.ts`, `lookAt`), also beginnt das Fenster bei jeder Variante wieder bei null. Der Browser fängt nichts ab, die Regel aus `docs/test-pyramid.md` ist eingehalten. Ausser in `hydration.feature:6` (Prosa) kommt «langsam» in keinem Szenario und keinem Demo-Datensatz vor. Kein anderer Ablauf landet also versehentlich auf der verzögerten Antwort. |
| G-9 | behoben | `RadioGroup.svelte:61` setzt `data-testid={testid && \`${testid}-${option.value}\`}`. Ohne `testid` fehlt das Attribut. Der Test in `ui-choices.dom.test.ts:110-114` prüft das, und `targets/accessibility.ts:21` nutzt jetzt `byTestId('…', 'category-allowance-false')`. Kollisionen mit bestehenden Test-IDs habe ich nicht gefunden. Die Werte sind `true`/`false` bzw. die Dauern, und `contract-duration-*` sowie `category-allowance-*` kommen sonst nirgends vor. `targets/categories.ts:8-9` (über Rolle und Name) bleibt so. Das betrifft nur deutsche Szenarien und war nicht Teil der Forderung. |
| G-10 | behoben | `categories-page.dom.test.ts:268` prüft jetzt auch `choice('Nicht umlagefähig').checked === false`. |
| G-1, G-4 bis G-7 | behoben (Runde 2) | Im Delta unverändert. |
| G-2 | Ablehnung hält | Unverändert. |

## Blocker/Major

Keine.

### Erläuterung zu G-11 (Minor, kein Merge-Blocker)

Nachgestellt in einem Skript im Scratchpad, nicht im Worktree: Ein `Bun.serve` mit `fetch: () => Bun.sleep(15_000).then(...)` und ein `fetch` dagegen, unter Bun 1.4.2.

```
error TypeError: The socket connection was closed unexpectedly … 12013
warn: Bun.serve() timed out a request after 10 seconds. Pass `idleTimeout` to configure.
```

`llm-stub.ts:71-78` setzt kein `idleTimeout`. Nach rund 10 s sieht das Backend also eine abgebrochene Verbindung, die Prüfung endet ohne Vorschlag, und das Formular verlässt den Zustand «Die KI prüft …». In der gemeldeten E2E-Runde reichte das, weil jede Variante den Zustand neu erreicht. Auf einer ausgelasteten CI kann der Zustand aber mitten in axe oder in der Sprachprüfung wechseln. Dann prüft der Lauf je nach Zeitpunkt etwas anderes, und der Kommentar «after a minute» (Stub, Aufgabe, Plan) stimmt nicht.

Behebung: im Stand-in `idleTimeout` über die Verzögerung setzen (`Bun.serve({ idleTimeout: … })`, höchstens 255 s). Die Verzögerung unter `LLM_TIMEOUT` legen, z. B. 25 s, oder in `playwright.config.ts` für das E2E-Backend `LLM_TIMEOUT` höher setzen. Danach die Kommentare anpassen.

## Merge `6fd5b2c`: geprüft und bestätigt

- **`messages/{de,fr,it,en}.json`:** Für jeden Schlüssel habe ich einen Dreiwegevergleich gemacht: Basis `03c7708`, Zweig `6fd5b2c^1`, main `6fd5b2c^2`, Ergebnis `6fd5b2c`.
  - Erwartet ist der Wert der Seite, die sich geändert hat, und bei gleichem Wert dieser Wert. Alle vier Dateien sind «ok», je 1337 Schlüssel.
  - Kein Schlüssel wurde auf beiden Seiten verschieden geändert.
  - Es gibt keine doppelten Schlüssel (textuell geprüft, `JSON.parse` würde sie verschlucken) und keine Konfliktmarker.
  - Die neuen Schlüssel von main und die Texte des Zweigs sind damit vollständig vorhanden.
  - `37b4f68` ändert `messages/` nicht.
- **Unterschied zum automatischen Merge-Baum** (`git merge-tree --write-tree 6fd5b2c^1 6fd5b2c^2` gegen `6fd5b2c`): Abweichungen gibt es nur in den acht Konfliktdateien sowie in `implementation_plan.md` und `docs/reviews/176-p-review-2.md` (G-12). Alle anderen Dateien entsprechen genau dem automatischen Merge.
- **`docs/api-specification.md`:** Beide Seiten sind erhalten:
  - `KI_NO_PROPOSAL` und `POST /propose` vom Zweig
  - die Upload-Codes, `POST /tenants/:id/documents`, `DELETE /documents/:id` und die Dokumentfelder mit `mimeType` von main
- **`tests/contracts/README.md`:** `category-proposal.json` (Zweig) und die vier Dokument-Verträge (main) sind beide da.
- **`docs/design/tools/persona-stack.sh`:** Der KI-Stand-in mit `LLM_BASE_URL` auf `:2527` (Zweig) und `BODY_SIZE_LIMIT=11M` (main) sind beide da.
- **`docs/design/offene-punkte.md`:** U-29 (#174) von main ist erhalten, die Zeile dieser Aufgabe heisst jetzt U-30, und O-19 von main ist da. Die Verweise im aktuellen Plan (`implementation_plan.md:45-47`) zeigen auf U-30. Die älteren Berichte `176-p-review-1.md:59` und `176-p-review-2.md:30` nennen noch «U-29». Sie sind historisch, und der Plan leitet richtig um.

## Weiteres geprüft

- **Umfang von `37b4f68`:** Alle Änderungen gehören zu G-3, G-9 oder G-10. Ich habe keine fremde Formatierung gefunden. `CategoryForm.svelte:133-135` bekommt nur die Test-ID.
- **Screenplay:** Die Aufgabe `ki-checking` liegt in der Task-Schicht, und die Targets sind über `byTestId` gebaut. Kein Schritt greift direkt auf die Seite zu.
- **Plan:** Die Zeilen für Runde 2 und den Merge sind da, G-9 hat eine `Test red`-Zeile. G-10 ist als «behaviour held already» vermerkt: Die Zusicherung kam nachträglich und hatte deshalb kein Rot. Das ist nachvollziehbar, weil sie kein neues Verhalten zeigt.
- **Selbst ausgeführt:** `bunx vitest run` auf `src/__tests__/categories-page.dom.test.ts` und `src/__tests__/ui-choices.dom.test.ts`. Ergebnis: 43 Tests grün.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt:
  - lint, check, deepcheck und das Fallow-Gate
  - test:coverage (152 Dateien / 2408+ Tests)
  - Backend 594 und type-check
  - E2E chromium und api, 697 bestanden, samt den Zeilen `ki-checking` (axe und Sprache)
- Ob der Test aus G-9 vor der Änderung rot war, habe ich nicht nachgeprüft. Ich habe nur die Plan-Zeile gelesen.
- Was das Formular nach dem Verbindungsabbruch durch den Stand-in genau zeigt und ob axe in der gemeldeten Runde je in dieses Fenster fiel, habe ich nicht gesehen. E2E starte ich nicht. Belegt ist nur das Verhalten von `Bun.serve` (Skript im Scratchpad).
- Die übrigen Dateien, die main im Merge mitbringt (Funktion #174), habe ich nicht inhaltlich geprüft. Sie entsprechen dem automatischen Merge und sind auf main bereits reviewt (`docs/reviews/upload-review-*.md`).
