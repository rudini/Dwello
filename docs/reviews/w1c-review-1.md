# Code-Review W1c (#132), Runde 1

Gegenstand: `git diff 69508c2..a2a921a` im Worktree `review-w1c-code` (Commits b9660be, 9a5ff56, 6bd023f und der Merge). Alle 31 geänderten Dateien gelesen, dazu der Code darum herum: `contractsOf`, `feePercentOf` (`backend/src/services/calculation.service.ts:257-266`), `heatingOfRun` (`calculation.service.ts:435-458`), `updateHeatingProfile` (`backend/src/services/heating-profile.service.ts:198-243`), `toStatement`, `toHeatingProfile`, `PreviewStep.svelte`, `SettingsStep.svelte`, der Seed in `tests/e2e/fixtures/screens.ts`, `tests/e2e/screenplay/questions.ts` und das Fachreview `docs/reviews/w1c-fachreview-1.md`.

Ergebnis: kein Blocker, kein Major. Jede Zeile der Anforderung ist durch Code und Test belegt (siehe unten). Die Befunde betreffen Robustheit, Konventionen und Vereinfachung.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `src/lib/server/statement-generation.ts:189`, `:218-219` | Die neuen Abfragen `contracts?buildingId=…` und `heating-profiles?limit=100` laufen über `call()`, das bei einem Fehler wirft. Dann schlägt die ganze Vorschau fehl, obwohl die Angaben nur ein Hinweis sind. `changedInvoiceCount` (`statement.ts:532-538`) und der Vollständigkeitscheck (`.catch(() => undefined)`, Z. ~236) liefern im Fehlerfall dagegen nur keinen Hinweis. Der Test «zeigt die Vorschau auch, wenn die geänderten Rechnungen nicht laden» deckt nur die geänderten Rechnungen ab. |
| C-2 | Minor | `statement-generation.ts:155-157`; `backend/src/services/heating-profile.service.ts:239` | `updatedAt` ändert sich bei jeder Bearbeitung des Heizprofils, auch wenn nur der Name, die Beschreibung oder `isActive` geändert wird. Dann sagt der Text «… rechnet mit den Monatsanteilen von damals», obwohl die Monatsanteile gleich geblieben sind. Die Anforderung gibt den Vergleich über `updatedAt` vor. Den Randfall in #132 oder in einem Issue festhalten oder später die Monatsanteile vergleichen (Fachreview V-1). |
| C-3 | Minor | `tests/contracts/statements.json`; `statement-generation.ts:150-157`; `src/__tests__/statement-generation.test.ts:214`, `:221` | Der neue Code liest `heatingShare` (`names`, `byDays`) aus `GET /statements`. Der Vertrag `statements.json` enthält das Feld nicht. Die Unit-Tests bauen `heatingShare` von Hand, entgegen CLAUDE.md, Gotchas, «API contracts». Die Form prüft im Moment nur `statement.json`, und zwar für `GET /statements/:id`. |
| C-4 | Minor | `statement-generation.ts:137`, `:141-144`, `:157`, `:163` | «One mapper per response» wird verletzt. Die Antwort von `GET /heating-profiles` hat schon einen Mapper (`src/lib/server/heating-profile.ts:10`, ohne `updatedAt`). Der Diff führt dazu einen eigenen Typ `Profile` ein, und `Listed` ist ein `Record<string, any>` mit `eslint-disable`. `managementFeePercent` und `createdAt` werden roh gelesen, obwohl `toStatement` beides schon abbildet (`statement.ts:80`, `:89`) und dieselbe Funktion `toStatement(listed)` ohnehin aufruft. |
| C-5 | Minor | `src/routes/statements/generate/PreviewEmpty.svelte:14-17`; `src/__tests__/statement-wizard.dom.test.ts:285-295` | Bei einer leeren Vorschau setzt `outdated()` bei veralteten Entwürfen `profile`, `profileEdited` und `fee` auf null. Diesen Schritt prüft kein Test: Der veraltete Entwurf im DOM-Test hat ohnehin `profile: null` und `fee: null`. Ohne `.map(...)` bliebe der Test grün, und ein veralteter Entwurf mit anderem Heizprofil würde «die neuen Abrechnungen mit …» nennen, obwohl der Lauf nichts erstellt. |
| C-6 | Minor | `statement-generation.ts:55` und `:189` | Die Aktion `preview` holt die Mietverträge jedes Gebäudes zweimal, einmal über `previewStatements` → `contractsOf` und einmal über `invoicesInPeriod` → `changedStatements`. Die Abrechnungen holt sie ebenfalls doppelt, das bestand schon vorher. (ponytail: reuse) |
| C-7 | Nit | `statement-generation.ts:150-153` | Ein anderes Heizprofil wird auch genannt, wenn es gar nichts bewirkt: ohne Heizkosten (`heatingShare` null) oder bei einem Mietvertrag über die ganze Periode (`byDays: true`), siehe Fachreview V-8. Ein gelöschtes Heizprofil ohne gespeicherte Namen erscheint als «Unbekannt», und der Rat «dasselbe Heizprofil» lässt sich dann nicht befolgen (V-9). |
| C-8 | Nit | `src/lib/statement-wizard.ts:313` | Der JSDoc-Kommentar von `droppedNotes` («What the restored draft named …») steht jetzt über `const step` und hat sich so von seiner Funktion gelöst. |
| C-9 | Nit | `tests/e2e/fixtures/screens.ts` (Seed, 2024); `tests/e2e/tasks/accessibility.ts:341` | `ChangedStatements` in `PreviewEmpty` (alle Mietverträge abgerechnet, ein Entwurf veraltet) läuft durch kein axe- und keinen Sprachen-Lauf. Im Seed von `preview-all-billed` ist 2024 kein Entwurf veraltet, die Rechnung des Lieferanten ist auf heute datiert. Es ist derselbe Schritt des Assistenten, die Regel «once per place» ist also erfüllt. |
| C-10 | Nit | `tests/e2e/steps/statement-generate.steps.ts:432` | Der Schritt `sagt die Vorschau {string}` liest nur den Hinweis «Bestehende Abrechnungen» (`existingStatements`). Der Name verspricht die ganze Vorschau. |
| C-11 | Nit | `statement-generation.ts:192-197` (ponytail: shrink) | Die Funktion `settings` prüft für jede Abrechnung `same.includes(listed)` und sucht den Mietvertrag mit `find` über alle. Kürzer geht es, wenn die Einstellungen nur über `same` laufen und das Ergebnis über die id zusammengeführt wird. |

ponytail-review (Zusammenfassung):
- `statement-generation.ts:L137-144: reuse:` eigener `Profile`-Typ plus `nameOf`. Ersatz: `toHeatingProfile` um `updatedAt` erweitern und mitbenutzen.
- `statement-generation.ts:L157, L163: reuse:` rohes `listed.createdAt` und `listed.managementFeePercent ?? 0`. Ersatz: die Felder von `toStatement(listed)`, das schon aufgerufen wird.
- `statement-generation.ts:L186-191: reuse:` zweite Abfrage der Mietverträge. Ersatz: das Ergebnis von `contractsOf` weitergeben.
- `PreviewEmpty.svelte:L14-17: shrink:` die Felder per Kopie auf null setzen. Ersatz: Ein Prop `outdatedOnly` an `ChangedStatements` oder `changedNotes` lässt die übrigen Gründe weg.
- net: etwa -15 Zeilen möglich.

## Blocker/Major

Keine.

## Abgleich mit der Anforderung

- **Veraltete Entwürfe** über `GET /statements/:id/changed-invoices`, nur bei Entwürfen: `statement-generation.ts:485`. Belegt durch die Unit-Tests «nennt einen Entwurf …» und «fragt nur bei Entwürfen …» sowie die E2E-Szenarien 1 und 7.
- **Anderes Heizprofil, beide Namen (V-2):** `profileDifference`. Belegt durch Unit-Tests (auch für ein gelöschtes Profil mit gespeichertem Namen), DOM-Test und E2E-Szenario 3.
- **Nachträglich bearbeitetes Heizprofil (V-1)**, nur wenn `byDays === false`: `statement-generation.ts:155-157`. Belegt durch einen Unit-Test (bearbeitet nachher, vorher, nach Tagen) und E2E-Szenario 4. Einschränkung siehe C-2.
- **Satz je Fall (M-1):** `feeDifference` entspricht `feePercentOf` im Backend. Belegt durch einen Unit-Test für alle drei Fälle, gleich und null, sowie durch DOM-Tests und E2E-Szenario 5.
- **Nur dieselbe Abrechnungsperiode (V-4):** `same` in `statement-generation.ts:184`. Belegt durch Unit-Tests (überschneidende und frühere Periode).
- **«Bestehende Abrechnungen bleiben …» und wo dieselben Einstellungen zu wählen sind:** `PreviewChecks.svelte:31-36` und `sameSettingsNote`. Belegt durch DOM-Tests und die E2E-Szenarien 1, 3 und 6. Der Rat erscheint nur, wenn der Lauf die abweichende Einstellung selbst wählt (DOM-Test).
- **Links zu den Abrechnungen:** `ChangedStatements.svelte`. Belegt durch einen DOM-Test (`href`, Linktext) und E2E-Szenario 7 (die Detailseite öffnet sich).
- **Leere Vorschau nennt nur veraltete Entwürfe:** `PreviewEmpty.svelte`. Belegt durch einen DOM-Test (Filter) und E2E-Szenario 2. Lücke beim Zurücksetzen der Felder: C-5.
- **Unveränderte Abrechnung wird nicht genannt:** belegt durch E2E-Szenario 6 mit positivem Anker vor der Negativprüfung.
- **Option 4 nicht enthalten:** bestätigt, «Neu berechnen» kommt im Diff nicht vor.
- **Texte in allen vier `messages/*.json`:** alle sieben neuen Schlüssel und der geänderte `statements_existing_note` sind in de, fr, it und en vorhanden.
- **a11y-/Sprachzustand `preview-outdated`:** in `screens.json` (mit `stateMeanings`), `accessibility.feature`, `sprachen-bildschirme.feature`, `tasks/accessibility.ts` und `fixtures/screens.ts` eingetragen.
- **Rote Tests:** Alle neuen Unit- und DOM-Tests und alle sieben Szenarien scheitern ohne die Änderung: Ohne sie gibt es kein Feld `changed`, kein Element `existing-statement-notes-*` und den neuen Satz in `statements_existing_note` nicht. Kein Szenario trägt `@wip`.
- **Screenplay:** Die Schritte rufen nur Tasks, Questions und den Seed auf. Die Questions liefern Text. Der Task `openExistingStatement` wartet auf die URL. Die Features beschreiben kein UI-Vokabular.
- **Nicht Verlangtes:** Die Verschiebung von `laterInvoices` → `changedInvoiceCount` (`statement.ts`, `statements/[id]/+page.server.ts`) ist für die Wiederverwendung nötig. Die Änderung `seed.idOf` → `seed.heatingProfileId` im bestehenden Schritt braucht das vordefinierte «Heizung Mittelland». Beides gehört also zur Aufgabe.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2800), `bun test src/__tests__/api-contracts.pg.test.ts` (auf 9a5ff56; danach berührt 6bd023f keinen Vertrag), E2E `statement-generate.feature` (56), die axe- und Sprachzeilen für preview-outdated, tank-question und preview-all-billed (6) sowie das fallow-Audit.
- Selbst erneut ausgeführt: `bunx vitest run src/__tests__/statement-generation.test.ts src/__tests__/statement-wizard.dom.test.ts src/__tests__/statement-wizard.test.ts src/__tests__/statement-generate-actions.test.ts` mit 118 von 118 bestanden.
- Ob der Zustand `preview-outdated` wirklich auch eine Abrechnung mit einem anderen Heizprofil zeigt, wie `stateMeanings` sagt: Das hängt von `default_heating_profile_id` der E2E-Datenbank ab (`+page.server.ts` load). Nur gelesen, nicht ausgeführt. Sicher belegt ist nur das Warten auf `existing-statements-changed-{building}`.
- Ob der Code mit PR #298 zusammenpasst (`PreviewChecks.svelte`, `PreviewEmpty.svelte`, `statement-generation.ts`): Den PR habe ich nicht gelesen. Wer zuletzt merged, muss Fachreview V-6 beachten: Nennt die Liste Abrechnungen, bleibt der Ton «caution».
- Die Übersetzungen fr, it und en habe ich nur sprachlich gelesen. Gegen `docs/design/i18n-begriffe.md` habe ich nur die Begriffe Entwurf, Abrechnungsperiode und Heizprofil geprüft. Das Fachreview hat sie nicht geprüft.
