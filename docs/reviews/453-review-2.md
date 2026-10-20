# Code-Review 2 zu #453 «Abgerechnet bis» (mit #325, #480)

Gegenstand: Delta `git diff fdd72b0d 6ab79f7b -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` im Worktree `review-453-code2` (detached, 6ab79f7b). Vorheriger Bericht: `453-review-1.md`.

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 (Blocker) | behoben | `tests/e2e/fixtures/screens.ts:96` seedet Dora jetzt mit 2015-12-31 (nach dem Vertragsbeginn 2015-01-01, vor heute). Kein Bildschirm hängt an Doras Periode 2015: `preview-skipped` braucht nur Emil in Bergsicht 2014 (Zeilen 113-114), die Vorschau 2025 bleibt unberührt. |
| C-2 | behoben | `ContractForm.svelte:157-158` und `ContractWizard.svelte:244,254-256` zeigen ohne `code` `contracts_save_failed`. Tests in beiden DOM-Dateien («zeigt eine Ablehnung ohne Code nicht auf Englisch») schlagen auf fdd72b0d fehl, weil `backendMessage` dort `body.error` «Tenant not found» zurückgibt (`src/lib/backend-error.ts:46-47`). Neuer API-Vertrag `tests/contracts/contract-tenant-refused.json`, geprüft in `api-contracts.pg.test.ts` gegen `backend/src/routes/contracts.ts:190-193` (400, nur `error`). |
| C-3 | behoben | `contract-wizard.dom.test.ts`, «nennt eine codierte Ablehnung beim Speichern in Worten». |
| C-4 | behoben | `statement-pdf-render.test.ts`, «nennt unter einer Heizrechnung mit Leistungszeitraum die abgerechneten Monate». Der erwartete Text passt zu `partProfileBilled` de (`pdf.service.ts:94`). Ich habe den Test wiederholt: grün. |
| C-5 | behoben | Die Commit-Nachricht von 6ab79f7b nennt die drei Tests bzw. das Szenario als Tests, die bestehendes Verhalten festhalten. Auf c09ec4fd zeigt sich das Verhalten schon, und es geht um keinen Bugfix. |
| C-6 | behoben | `contract-wizard.dom.test.ts`: `vi.useFakeTimers({ toFake: ['Date'] })` und `setSystemTime(2026-06-15)` in `beforeEach`, `useRealTimers` in `afterEach`. Das deckt auch die älteren Tests der Datei ab. |

## Neue Befunde im Delta

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-7 | Minor | `backend/src/services/pdf.service.ts:634` | Der neue Absatz (`moveDown(0.4)`, Datenprüfung D-2) vor der Zeile zum Mietverhältnis hat keinen Test. Die Texttests sehen ihn nicht. Einen Abstand zeigt nur eine Prüfung der y-Lage, z. B. über die Positionen, die `textOf` liefert. |

Keine Blocker, keine Majors.

## Abgleich mit der Anforderung (Delta)

- #480: Die Zeile in `UBIQUITOUS_LANGUAGE.md` entspricht wörtlich dem Entscheid in der Issue (Option 1, «Akontobeiträge» ohne «geleistete»). Die Issue sagt, der Product Owner habe den Eintrag beauftragt. `contracts_billed_until_help` folgt in allen vier `messages/*.json`, «geleistete/made/versés/versati» ist entfernt. Geprüft wird das in `contract-edit.dom.test.ts` (de, ganzer Satz) und im neuen Schritt in `contract-edit.feature:157` mit `contract-form.steps.ts:610-615`. Der Schritt ruft nur eine Question auf, die Text zurückgibt. Der Schritt ist auf fdd72b0d rot, denn dort fehlt der Teilsatz. Das Verhalten selbst (der übergangene Mietvertrag nach dem Vertragsende) war schon in Runde 1 bestätigt.
- Helga P-2: Mit `ContractWizard.svelte:272-273` kommt die Rückfrage zum Vertragsbeginn erst, wenn «Abgerechnet bis» keinen Fehler mehr hat. Der neue DOM-Test schlägt auf fdd72b0d fehl: `focusFirstError` setzt den Fokus dort auf das erste Feld mit Fehler, den Vertragsbeginn, und die Seite zeigt `contracts_confirm_past` mit «nochmals auf «Weiter»». `confirmedPastStart` wird erst in `periodWarnings` gesetzt. Die Rückfrage geht deshalb nicht verloren, sie erscheint beim nächsten «Weiter».
- Native-Lesung: Die Texte in `pdf.service.ts` (fr/it/en) und `messages/{fr,it,en}.json` entsprechen den Vorschlägen in `453-native-it.md` (IT-1 bis IT-7). Die geänderten `tenancyBilledLine` sind im Render-Test in allen vier Sprachen nachgezogen. Für die übrigen umformulierten Übersetzungen gilt die Ausnahme für geprüfte Übersetzungen (Skill `slice-review`, «Triage»).
- D-2: umgesetzt, ohne Test (C-7).
- Design, Sicherheit, Screenplay: Das Delta ändert keine Klassen, keine Auth und keine Endpunkte. Die Steps rufen nur Questions auf.
- Ponytail: Ich habe nichts Unbenutztes gefunden und keine Kopie eines bestehenden Helfers.
- Nichts im Delta hat mit der Anforderung nichts zu tun. Die Persona-Berichte `docs/design/personas/{helga,weber}-453.md` sind Berichte.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: `bun run lint`, `bun run check`, die Vitest-Läufe von contract-form, contract-wizard, statement-wizard.dom, statement-generation und statement-generate-actions, die Backend-Tests pdf-translations, pdf-text, reminder-pdf, api-contracts.pg und billed-until.pg. Laufen beim Aufrufer noch: Backend-Type-Check und E2E der vier Features samt den neuen Zeilen für axe und Sprachen.
- Selbst wiederholt auf 6ab79f7b: `bunx vitest run` für contract-wizard.dom und contract-edit.dom (95 Tests grün), `bun test statement-pdf-render.test.ts -t 'abgerechneten Monate|Abgerechnet bis'` (10 Tests grün).
- E2E und Persona-Stack habe ich nicht gestartet (Vorgabe). Dass C-1 im Lauf behoben ist, habe ich nur im Code nachgelesen (`screens.ts:94-96`, `contract.service.ts` `checkBilledUntil`).
- Native-Lesung fr/en: Die Übernahme aller Vorschläge habe ich nur für it einzeln geprüft. Für fr und en habe ich die Texte im Diff gelesen, die Berichte `453-native-fr.md` und `453-native-en.md` aber nicht Zeile für Zeile verglichen. Beide sind laut Aufrufer übernommen, FR-9 und EN-10 in der kürzeren Form.
