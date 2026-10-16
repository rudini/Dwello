# Code-Review O-34 (Runde 1), `git diff 3ec5a3b b9640a7`

Worktree: `/tmp/claude-0/-home-user-Dwello/47b3da8b-5735-56e7-bbb5-130a8ff4f5d9/scratchpad/review-o34-code` (detached auf b9640a7).
Gelesen: alle drei geänderten Dateien (`tests/e2e/tasks/accessibility.ts`, `docs/design/offene-punkte.md`, `implementation_plan.md`), dazu `tests/e2e/tasks/invoice-upload.ts` (`uploadBelege`), `tests/e2e/fixtures/screens.ts` (`Example`, `seedFor`), `src/routes/invoices/InvoiceUploadDialog.svelte` (Optionswert = Gebäude-ID), `backend/src/routes/invoices.ts:152` und `backend/src/services/invoice.service.ts:243` (BUILDING_NOT_FOUND), `tests/e2e/fixtures/backend.ts` (cleanUp löscht Gebäude), `.claude/skills/ponytail-review/SKILL.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | tests/e2e/tasks/accessibility.ts:107 | `'/contracts/new': Select.option({ index: 1 }).from(tenantSelect)` wählt nach demselben Muster den alphabetisch ersten Mieter der geteilten E2E-Datenbank, womöglich den eines parallelen Szenarios. Dort wird nichts gespeichert, also keine Zeitüberschreitung zu erwarten; nur als Hinweis, falls derselbe Zustand später flackert. Nicht Teil dieses Auftrags. |

Keine Blocker, keine Major.

## Prüfung gegen die Anforderung

- **Ursache statt Timeout:** Es wird kein Timeout erhöht. Die Diagnose ist im Code nachvollziehbar: `startUpload` wählte `index: 1` des Gebäude-Selects (Optionen sind alle Gebäude, Wert = `b.id`, `InvoiceUploadDialog.svelte:68`). Das Backend lehnt das Auslesen bzw. Erfassen für ein gelöschtes Gebäude mit `BUILDING_NOT_FOUND` ab (`routes/invoices.ts:152`, `invoice.service.ts:243`), und die Fixture-cleanUps löschen Gebäude (`fixtures/backend.ts:100,211`). Das erklärt beide CI-Symptome (kein Hinweis «unsicher», kein Ergebnis).
- **Fix:** Alle fünf Upload-Zustände nutzen jetzt `uploadBelege(example.building, …)`. `example.building` ist die ID des «Seeblick»-Gebäudes aus dem eigenen Seed (`screens.ts`, `seedFor`); die fünf Upload-Zustände stehen bereits in der Liste der geseedeten Zustände, also ist `building` nie leer. Das eigene Gebäude wird erst im cleanUp des eigenen Szenarios gelöscht, nach dem Zustand. Zusätzlich landet die in `upload-partial`/`upload-discard-created` erfasste Rechnung jetzt im eigenen Gebäude statt in einem fremden: auch fremde Szenarien werden nicht mehr gestört.
- **Verhalten der Zustände unverändert:** Der KI-Stand-in reagiert auf Dateinamen, nicht auf das Gebäude; die Kategorisierung von «Elektro Blitz» hängt nicht am Gebäude. Sichtbar ändert sich nur der Gebäudename im Select (eigener Seed statt eines fremden), was für die Sprachprüfung eher stabiler ist.
- **Keine App-Änderung:** Der Diff berührt nur Testcode und Doku; `No scenario` ist begründet (Plan, Session-Text).
- **O-34 entfernt:** Zeile in `docs/design/offene-punkte.md` gelöscht; die einzigen weiteren Nennungen sind `implementation_plan.md` und das Archiv (Historie).
- **Screenplay-Schichten:** Die Zustände rufen weiter nur Tasks/Interactions auf; `uploadBelege` ist ein bestehender Task. Keine Steps, Features oder Targets geändert.
- **Rot ohne Änderung:** Durch Lesen plausibel: mit `index: 1` hängt der Zustand von fremden Gebäuden ab, mit der Seed-ID nicht. Die Churn-Messung (5/6 rot alt, 15/15 grün neu) ist vom Aufrufer gemeldet, nicht von mir wiederholt.
- **Unbeteiligte Änderungen:** keine. Entfernte Importe (`Upload`, `uploadBuildingSelect`, `uploadFileInput`, `uploadInvoicesButton`, `type File`) werden im File nicht mehr verwendet; `Select` bleibt wegen Zeile 107. Prettier-Ausgabe der Datei ist identisch mit der Datei.
- **Ponytail-Review:** `startUpload` gelöscht, bestehender Task `uploadBelege` wiederverwendet; `createPartly` bekommt nur den nötigen Parameter. Lean already. Ship. (net: -0 lines possible)
- **Texte, Tokens, a11y-Listen, Contracts:** nicht betroffen (keine neuen Texte, Zustände oder API-Antworten).

## Nicht bestätigt

- E2E `--grep "invoices upload-"` (10 bestanden) sowie die Churn-Messungen rot/grün: vom Aufrufer gemeldet, auftragsgemäss nicht selbst ausgeführt.
- `bun run lint`, `bun run check`, `cd backend && bun run type-check`: vom Aufrufer gemeldet.
- `bunx vitest run src/__tests__/open-work.test.ts`: von mir wiederholt, 5/5 grün.
- Dass die CI-Fehler in Run 38937449261 tatsächlich durch gelöschte fremde Gebäude entstanden (und nicht zusätzlich durch Last): nur aus dem Code und der Beschreibung des Aufrufers abgeleitet; CI-Log nicht eingesehen.
