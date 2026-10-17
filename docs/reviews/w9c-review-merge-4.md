# Review Merge-Commit 0f0c4ba (origin/main f900e5b in claude/w9c-privacy-82-178)

Geprüft im Worktree `review-w9c-merge4` (detached bei 0f0c4ba): `git show 0f0c4ba -- src/routes/dashboard/+page.server.ts`, `git diff f900e5b 0f0c4ba` und `git diff 836a724 0f0c4ba` für `src/routes/dashboard/+page.server.ts`, `src/lib/overview.ts`, `src/__tests__/dashboard.test.ts`; Meldungsschlüssel in `messages/*.json`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | src/__tests__/dashboard.test.ts:152-121 (`backend()`) | Das Standard-Double kennt `/documents` nicht; die Tests von main (Aufgabenlisten mit `toEqual`, z. B. Z. 187, 231, 288) erhalten `documents = []` nur, weil `list()` den geworfenen Fehler `unexpected …` schluckt. Funktioniert, ist aber implizit; ein Eintrag `'/documents': { data: [] }` würde es sichtbar machen. Bestand schon vor dem Merge auf dem Branch. |
| C-2 | Nit | src/__tests__/dashboard.test.ts:155-177 | Der #178-Test nutzt `t9`, den main im Entwurfs-Double als Mieter mit alter Adresse (`old-address-t9`) führt. Kein Fehler (Prüfung mit `toContainEqual`), zeigt aber nebenbei, dass beide Aufgaben für denselben Mieter nebeneinander bestehen, ohne es zu prüfen. |

Keine Blocker/Majors.

## Bestätigt

- Auflösung: `Promise.all` holt `statements?status=draft&limit=100` und danach `documents`; die Destrukturierung `drafts, documents` entspricht genau dieser Reihenfolge. Gegenüber main kommen nur der Import `formerTenantDocuments`, die Funktion `formerTenants`, der Abruf `documents` und `formerTenants: …` hinzu; gegenüber dem Branch nur `oldAddresses` und der Entwurfs-Abruf. Nichts geht verloren.
- `src/lib/overview.ts`: gegenüber main rein additiv (`formerTenants?` in `OverviewInput`, `formerDocumentTasks` als letzte Gruppe in `overviewTasks`); `addressTasks` (W3c) bleibt unverändert davor. Die beiden Aufgabenarten haben getrennte IDs (`old-address-<id>` / `former-documents-<id>`) und getrennte Eingaben (Entwürfe gegenüber Verträgen+Dokumenten): kein semantischer Konflikt; ein Mieter kann sinnvoll beide Aufgaben haben (Abrechnung an alte Adresse; Dokumente prüfen).
- Meldungen: `dashboard_task_former_documents*` und `statements_old_address` in allen vier `messages/*.json` vorhanden.
- Tests erreichen beide Seiten: die Tests von main zu `old-address-t9` (Z. 187, 231) und der #178-Test (Z. 155) laufen gegen die zusammengeführte `load`. Selbst nachgeführt: `bunx vitest run src/__tests__/dashboard.test.ts src/__tests__/overview.test.ts` grün (2 Dateien, 30 Tests).

## Nicht bestätigt

- lint, `bun run check`, vollständiges `bunx vitest run` (158 Dateien, 2842 Tests), Backend-Type-Check: vom Aufrufer gemeldet.
- Die übrigen vom Merge berührten Dateien (Docs, a11y-/Sprach-Features, `tests/e2e/questions/language.ts`, `overview.test.ts`) hatten laut Aufrufer keine Konflikte in App-Code; nicht im Einzelnen gelesen. E2E-Szenarien nicht ausgeführt (laut Auftrag ausgeschlossen).
