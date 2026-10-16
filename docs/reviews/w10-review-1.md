# Code-Review W10-1: #156 (B-16) und #155 (F-23)

Gegenstand: `git diff 87dda97 2e135d9` im Worktree `review-w10-code` (detached, 2e135d9). Alle 31 geänderten Dateien gelesen (docs/reviews/w10-fachreview-1.md als Begründung der Textänderungen überflogen).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | tests/e2e/steps/contract-form.steps.ts:721-724 | «schlägt der neue Mietvertrag den Vertragsbeginn … vor» prüft nur die Adresse (`start=`), nicht den Wert, den der Assistent vorschlägt; der Kommentar verweist auf `contract-form.test.ts`, der Test steht aber in `src/__tests__/contract-wizard.test.ts:111-116`. Gleiches Muster wie das bestehende «gilt der neue Mietvertrag für die Wohnung», daher kein Major. |
| C-2 | Minor | src/routes/contracts/new/ContractWizard.svelte:265, src/routes/contracts/new/OpenContracts.svelte:14-33 | Erreicht man den Schritt «Wohnung», bevor die Mietverträge geladen sind, erscheint der Hinweis später ohne Live-Region (Alert `info` hat keine Rolle); `ApartmentStep.svelte` hält dafür eine stets vorhandene `role="status"`-Hülle. Screenreader hören den Hinweis dann nicht. |
| C-3 | Minor | src/__tests__/contract-wizard.dom.test.ts:427-436 | Negativprüfung «schweigt bei einem Mietvertrag mit Vertragsende» ohne positiven Anker (Schritt «Wohnung» / geladene Auswahl), anders als der Test darunter (Z. 446). Würde auch grün, wenn der Schritt nicht erreicht ist. |
| C-4 | Nit | tests/a11y/screens.json:29 | Der Hinweis ist über `every-wizard-step` (`?tenant={tenant}`, Anna mietet 1.01 ohne Ende) in axe und Sprachprüfung abgedeckt; die `stateMeanings`-Beschreibung nennt ihn nicht, nur der Kommentar in `tests/e2e/fixtures/screens.ts:82`. |
| C-5 | Nit | src/lib/utils/contract-availability.ts:32 | ponytail `yagni`: `tenant_id` im gemeinsamen Verfügbarkeitstyp nur, damit der Assistent filtern kann; vertretbar, da `forAvailability` die einzige Abbildung der Antwort ist. |
| C-6 | Nit | implementation_plan.md:19 | Dateiliste nennt `src/routes/contracts/new/OpenContracts.svelte` nicht. |

Keine Blocker, keine Major.

## Ponytail-Review

- `src/lib/utils/contract-availability.ts:L32`: yagni: siehe C-5. Bleibt.
- `src/routes/contracts/ContractForm.svelte:L76-78`: `nextDay`/`dayAfter` aufgeteilt, nötig für Link und Anzeige. Bleibt.
- `OpenContracts.svelte`: Komponente mit einem Aufrufer, hält aber den Assistenten schlank (deepcheck). Bleibt.

net: -0 lines possible. Lean already. Ship.

## Bestätigt (Anforderung gegen Code und Test)

- #156 Nächste Schritte: dritter Link `Neuen Mietvertrag für {name} erfassen` nach `/contracts/new?tenant={tenantId}` zwischen «Nachmieter erfassen» und «Neue Adresse eintragen» (`NextSteps.svelte:34-36`), auch nach erfasstem Nachmieter; DOM-Test `contract-detail-page.dom.test.ts:88-92, 246`; Szenario `contract-detail.feature:168-173`.
- #156 Hinweis im Assistenten: nur Schritt «Wohnung», nur Verträge des gewählten Mieters ohne Vertragsende, mit Link auf den Vertrag, nicht blockierend (`ContractWizard.svelte:79-87, 265`); DOM-Tests `contract-wizard.dom.test.ts:409-451` (anzeigen + weiter, mit Vertragsende, anderer Mieter); Szenarien `contract-new.feature:55-69`. `tenantId` kommt in der Antwort vor (`tests/contracts/contracts.json`).
- #156 Link unter «Bearbeiten»: nennt den Mieter, `?tenant=&start=<Tag nach Vertragsende>` (UTC-sicher, `ContractForm.svelte:76-78, 229-234`); `start` aus der Adresse gewinnt gegen Entwurf und blockiert den Vorschlag `suggestedStartDate` (`contract-form.ts:35`, `contract-wizard.ts:168`); Tests `contract-edit.dom.test.ts:167-180`, `contract-wizard.test.ts:111-116`; Szenario `contract-edit.feature:106-112`.
- #155 Hilfetext unter «Bearbeiten» (offen und mit Vertragsende) und Satz im Dialog «Mietvertrag beenden» (`ContractForm.svelte:224`, `+page.svelte:227-228`); Tests `contract-edit.dom.test.ts:142-158`, `contract-detail-page.dom.test.ts:172-179`; Szenarien `contract-edit.feature:101-104`, `contract-detail.feature:161-165`. Doku `docs/anforderungen-vertragsende.md:34`.
- Texte in allen vier `messages/*.json`, «Beenden»-Verweise stimmen mit `contracts_end_action` je Sprache überein; altes `contracts_parties_fixed_new` nirgends mehr verwendet. Begriffe (Mietvertrag, Vertragsende, Korrespondenzadresse) aus dem Glossar.
- Rot ohne Änderung: alle neuen DOM-/Unit-Tests und Szenarien (fehlende testids, Texte, `start`-Übernahme, Link-href).
- Screenplay: Steps rufen nur Tasks/Questions; Fragen liefern Texte bzw. Wert; Klick-Tasks gefolgt von wartenden Fragen. Features ohne UI-Wörter.
- a11y: Hinweis in `every-wizard-step`, Dialog-Satz in `end-dialog`, neuer Link in `contract-detail-notice` und `contract-edit-notice`; Link 48 px (`min-h-12`), Tokens nur aus der Referenz.
- Sicherheit: keine neuen Endpunkte; Werte in `href` von Svelte escaped.
- Nichts Fremdes im Diff (screens.ts nur ein erklärender Kommentar zur Abdeckung).

## Nicht bestätigt

- `bun run lint`, `bun run check`, backend type-check, `bunx vitest run` der Vertrags-Tests: vom Aufrufer gemeldet (Wiederholung nicht möglich: `node_modules` im Worktree verweist auf das Hauptrepo, Zugriff verweigert).
- E2E chromium der drei Features auf 2e135d9 sowie axe-/Sprachzeilen: vom Aufrufer gemeldet als laufend; die 62 grünen Läufe betrafen den Commit vor dem Verschieben in `OpenContracts.svelte`.
- Fachliche Richtigkeit der Rechtstexte (Art. 560 ZGB, 266i/263 OR, 121 ZGB) und Übersetzungsqualität fr/it/en: nur gegen `w10-fachreview-1.md` gelesen, nicht selbst geprüft.
