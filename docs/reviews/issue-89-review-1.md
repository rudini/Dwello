# Code-Review #124, #89, #60 (Verwaltungspauschale), Runde 1

Worktree: `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/review-89-code` (detached 0c7a596), Bereich `8486d9e..0c7a596` (73cd845, 6d844dc, 0c7a596). Alle 68 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `src/routes/statements/generate/+page.server.ts:48,72,79` | `fromStatements` hängt jetzt an `runRate`, das Heizprofil kommt aber weiter aus `other` (`others[0]`). Haben in der Periode nur Mietverträge mit «Nein» oder eigenem Satz eine Abrechnung, übernimmt der Assistent das Heizprofil aus einer Abrechnung. Der Hinweis sagt aber «Heizprofil und Verwaltungspauschale kommen aus den Einstellungen» (`statements_preset_from_settings`). Das stimmt dann nicht. Der Test `statement-generate-actions.test.ts` (Fall `mixed.slice(0, 2)`) schreibt `fromStatements: false` fest, ohne das Heizprofil zu prüfen. |
| C-2 | Minor | `src/routes/contracts/new/ContractWizard.svelte:56,143`, `src/routes/contracts/ContractForm.svelte:105-108`, `src/lib/ui/RadioGroup.svelte:46` | `edited()` löscht `errors[event.target.id]`. Die Radios heissen aber `managementFee-0..2`, nicht `managementFee`. Deshalb bleibt «Bitte wählen Sie, ob im Mietvertrag eine Verwaltungspauschale vereinbart ist.» samt `aria-invalid` stehen, nachdem der Verwalter gewählt hat, bis er wieder «Weiter» oder «Speichern» wählt. Alle anderen Felder löschen ihren Fehler bei der Eingabe. Abhilfe: in `errorKey` aufnehmen oder per Präfix abbilden. |
| C-3 | Minor | `tests/e2e/tasks/accessibility.ts:355` | Der a11y- und Sprachdurchlauf «every-wizard-step» ruft in Schritt 3 `look` auf, sobald `heating-profile-select` sichtbar ist. `FeeNotAgreed` lädt seine Liste aber erst danach (`$effect` → `/statements/billed`). Ob axe und die Sprachprüfung den neuen Hinweis `management-fee-not-agreed` (Carla, `fixtures/screens.ts:51`) sehen, hängt deshalb vom Timing ab. Beim Vertragsassistenten wartet der Durchlauf auf `contract-fee-rate-hint`, hier fehlt `Wait.until(on.shown('management-fee-not-agreed'))`. |
| C-4 | Minor | `src/routes/statements/generate/FeeNotAgreed.svelte:13-21` | Scheitert `/statements/billed`, fehlt der Hinweis stillschweigend. Der Verwalter erstellt dann Abrechnungen mit 0 % und erfährt nicht, welche Verträge betroffen sind. Für diesen Fehlerzustand gibt es kein Szenario und keinen Test. BuildingStep fällt bei derselben Anfrage genauso still zurück: ein bestehendes Muster, durch diese Änderung aber folgenreicher. |
| C-5 | Minor | `src/routes/statements/generate/FeeNotAgreed.svelte:14` | ponytail `reuse:`: BuildingStep holt `/statements/billed` für dieselben Gebäude und dieselbe Periode schon in Schritt 2 (`BuildingStep.svelte:41-49`). Schritt 3 holt die Antwort ein zweites Mal. Besser `withoutFee` aus Schritt 2 weitergeben, das spart den zweiten Request und das `$effect`. |
| C-6 | Minor | `tests/e2e/tasks/statement-generate.ts:104` | `openContractWithoutFee` ist ein reines `Click.on` und wartet nicht auf den Zustand, zu dem es führt (Detailseite). Vergleiche `recordInvoiceFromWarning` mit `Wait.forUrl`. |
| C-7 | Minor | `backend/src/routes/contracts.ts:35-38`, `backend/src/services/calculation.service.ts:258-265` | Die API nimmt `managementFeeAgreed: false` mit einem `managementFeePercent` an und speichert beides. Ein PUT nur mit `managementFeeAgreed: true` belebt einen alten eigenen Satz wieder. Die UI sendet immer beide Felder, also ist das nur über die API erreichbar. |
| C-8 | Nit | `src/lib/contract-form.ts:34` | `String(parsePercent(...))` zeigt in fr/it «Convenus, 2.5 %» statt «2,5 %». Das folgt dem bestehenden Muster (`CostTable.svelte:87`). |
| C-9 | Nit | `src/__tests__/contract-wizard.dom.test.ts:182` | Die unberührte Zeile `it('zeigt vor dem Speichern …'` ist jetzt um einen Tab zu weit eingerückt. |
| C-10 | Nit | `backend/src/__tests__/demo-data.pg.test.ts:151-152` | Der neue Test steht zwischen dem Kommentar «Bei einem Mieterwechsel …» und dem Test, zu dem dieser Kommentar gehört. |
| C-11 | Nit | `docs/PRD-Dwello.md:475` | Die Feature-Zeile sagt weiter «0% or more», obwohl die Übersicht darüber jetzt 0–10 % nennt. |

ponytail-review: C-5 (`reuse:`, etwa −12 Zeilen). Sonst ist der Diff schlank: `isFeeRate` und `USUAL_MAXIMUM` sind einmal in `format.ts` geteilt, `managementFee` wird im Backend-Schema einmal gespreizt. `net: -12 lines possible.`

Keine Blocker oder Majors.

## Bestätigt durch Code und Test

- #124 Route: `statements.ts:34` `maximum: 10`. Config: `config.service.ts:35` `v <= 10`. `management-fee.pg.test.ts` prüft, dass 10 rechnet und gespeichert wird und dass 10.01 bei Vorschau und Erstellen 422 gibt und keine Abrechnung entsteht. Config prüft 10 → 200, 10.01 → 400, gespeichert bleibt 10. Vor der Änderung wären diese Tests rot gewesen (`minimum: 0` ohne Maximum, Validator `v >= 0`).
- #124 am Feld: `statement-wizard.ts` und `settings.ts` über `isFeeRate`, getestet in `statement-wizard.test.ts` (10 ok, 10.01 Fehler) und `settings.test.ts` (10,01 abgelehnt, kein Backend-Aufruf). Text «von 0 bis 10» in allen vier Sprachen. Der Hinweis über 3 % in `SettingsStep.svelte` ist unverändert, nur der Import kommt aus `format.ts`. Das Szenario «Pauschale über 10 %» mit «1000» ist ohne `@wip`.
- #89 Daten: Migration 0007 (`DEFAULT FALSE`, damit sind bestehende Verträge «Nein», CHECK 0–10), Schema, `contractFields`, API-Verträge `contract.json` und `building-contracts.json`, `data-model.md`.
- #89 Rechnung: `feePercentOf` setzt «Nein» auf 0, ein eigener Satz geht vor, sonst gilt der Satz des Laufs bzw. die Einstellung. Abgedeckt durch `management-fee.pg.test.ts` (0, eigener Satz 2 %, 0.00 gespeichert, ohne Angabe nicht vereinbart, 10.01 → 422) und das `@api`-Szenario «Pauschale nur mit vereinbarter Verwaltungspauschale» (250.00 / 765.00).
- #89 Pflichtwahl ohne Vorgabe: `initialContractValues` → `''`, `validateContract`. Tests in `contract-form.test.ts`, `contract-wizard.dom.test.ts` und im Szenario «Ohne Angabe zur Verwaltungspauschale geht es nicht weiter». Bearbeiten und Detailseite: Szenario «Vereinbarte Verwaltungspauschale nachtragen» und `contract-detail-page.dom.test.ts`. Prüfschritt: «Verwaltungspauschale mit eigenem Satz prüfen».
- #89 Hinweis im Assistenten: `billedContracts().withoutFee` (`statement-generation.test.ts`), `FeeNotAgreed` (`statement-wizard.dom.test.ts`) und zwei Szenarien (nennt den Vertrag, Link öffnet ihn). Die Negativprüfung «Aber nicht …» folgt der Positivprüfung.
- V-1: `+page.server.ts` übernimmt den Satz nur aus einer Abrechnung eines Vertrags zum Satz des Laufs (`statement-generate-actions.test.ts`). Das Szenario «Neue Abrechnung übernimmt den Satz des Abrechnungslaufs» wäre vorher rot gewesen: Die Liste ist nach `createdAt desc` sortiert, Annas 0 %-Abrechnung kommt zuerst, und `limit=1` hätte 0 vorgeschlagen.
- M-1: `contracts_fee_help` als sichtbare Hilfe am RadioGroup, mit Art. 269d OR. M-2: Hinweis bei eigenem Satz über 3 % (`RentStep.svelte`, DOM-Test, a11y-Durchlauf wartet auf `contract-fee-rate-hint`). V-2, V-5, V-6: Texte, Doku, Demodaten (`demo-data.pg.test.ts`).
- #60: Die Markierung ist entfernt, die Quelle (Merkblatt 2026) steht im Kommentar `format.ts:70-71`. «bis 3 %» bleibt in den Texten.
- Konventionen: Alle 13 neuen Schlüssel haben in de, fr, it und en dieselbe Schlüsselmenge. Die `data-testid` sind kebab-case. Nur Token-Klassen. Die neuen Begriffe sind mit `TODO(fachlich prüfen, #286)` markiert, #286 ist offen und trägt die Labels `fachlich` und `entscheiden`. Die E2E-Steps rufen nur Tasks und Questions auf.

## Nicht bestätigt

- Alle Checks des Aufrufers sind nur «vom Aufrufer gemeldet»: lint, check, backend type-check, vitest (2631), Backend-Tests (692, Coverage 94.1 %), E2E (112) und die axe- und Sprachzeilen (60). Selbst laufen lassen konnte ich nichts: Der Zugriff auf `node_modules` (Symlink nach `/home/user/Dwello`) ist gesperrt, also konnte `bunx vitest run` nicht starten.
- Ob der Hinweis `management-fee-not-agreed` im axe- und Sprachdurchlauf tatsächlich geprüft wurde (C-3), lässt sich ohne Lauf nicht feststellen.
- Den Inhalt der Fachreview `docs/reviews/issue-89-fachreview-1.md` habe ich nicht gegen die Rechtsquellen geprüft. Geprüft habe ich nur, ob die genannten Punkte M-1, M-2, V-1, V-2, V-5 und V-6 im Code umgesetzt sind.
- Ob die Migration-Reihenfolge stimmt (zwei Dateien `0006_*`, neu `0007_*`), habe ich nur aus den Dateinamen abgeleitet. Den Runner habe ich nicht gelesen.
