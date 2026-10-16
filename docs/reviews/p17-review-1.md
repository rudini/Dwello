# Code-Review #144 (P-17), Runde 1

Worktree `review-p17-code`, detached bei b388738, Diff `5f7e47c..b388738` (3 Commits, 28 Dateien). Alle geänderten Dateien gelesen, dazu `ContractWizard.svelte` ganz, `contract-form.ts`, `contract-status.ts`, `DateInput.svelte`, `Alert.svelte`, `tests/e2e/fixtures/{screens,backend}.ts`, `tests/contracts/contracts.json` und `docs/reviews/p17-fachreview-1.md`.

Ergebnis: kein Blocker, kein Major.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/routes/contracts/new/ContractWizard.svelte:104 | M-1 ist im Wizard nicht abgesichert: Die Regel «nur Mietverträge mit Vertragsbeginn vor dem neuen» (`lastRent(..., values.startDate)`) ist nur als Unit-Test von `lastRent` geprüft. Wird das zweite Argument im Wizard weggelassen, bleibt jeder Test grün (DOM-Test: einziger Mietvertrag 2015, Vertragsbeginn 2027; E2E: nur der Mietvertrag von Bruno). Einen zweiten, späteren Mietvertrag in den DOM-Test aufnehmen. |
| C-2 | Minor | src/routes/tenants/new/+page.svelte:28-31 | «Abbrechen» behält die Wohnung (laut Anforderung ausdrücklich verlangt). Gezeigt nur durch den SSR-Test des `href` (`tenant-new-page.test.ts:38-42`), ohne Szenario. Das `href` belegt das Verhalten vollständig, deshalb nicht Major. Wer es sichtbar haben will: ein Schritt «bricht das Erfassen des Mieters ab» im Szenario «Vorgewählte Wohnung bleibt …». |
| C-3 | Minor | src/routes/contracts/new/ContractWizard.svelte:76,177-186 | `preset` lebt nur im Speicher. Nach einem wiederhergestellten Entwurf (oder nach dem Umweg über «Neuen Mieter erfassen») gelten vorbelegte Beträge als eingetippt. Ändert der Verwalter danach Wohnung oder Vertragsbeginn, bleiben die alten Beträge stehen, und der Hinweis verschwindet. Die Anforderung verletzt das nicht (ein Betrag wird nie überschrieben), es ist aber ein unerwarteter Grenzfall. Ein Satz im Plan oder ein Kommentar genügt. |
| C-4 | Nit | src/lib/contract-wizard.ts:232 | `rentTakenOver` liest eine ungültige Eingabe («abc») wegen `parseFloat(...) \|\| 0` als 0. Neben einem leer übernommenen Feld gilt sie damit als «übernommen»: Der Hinweis bleibt, und ein Wechsel der Wohnung überschreibt sie. Der Schritt lehnt die Eingabe vorher ohnehin ab, deshalb nur ein Nit. |
| C-5 | Nit | src/routes/contracts/new/ContractWizard.svelte:105-114 | Der Hinweis erscheint auch dann, wenn nichts vorbelegt wurde, die Felder aber zufällig dieselben Beträge enthalten. Das kommt bei einem Entwurf vor, und ebenso bei einem letzten Mietvertrag mit lauter 0.00: Dann sind alle Felder leer, und der Hinweis wird trotzdem angezeigt. |
| C-6 | Nit | src/lib/contract-wizard.ts:192-201 | ponytail `reuse:`: `ListedContract` wiederholt Felder von `RentalContract` (`src/lib/types.ts:75`). Ersetzen durch `Pick<RentalContract, 'id' \| 'startDate' \| 'endDate' \| 'terminated' \| 'baseRent' \| 'additionalRent' \| 'monthlyAdvancePayment'>` (dafür `kept` auf `string \| number` erweitern), etwa −8 Zeilen. |
| C-7 | Nit | tests/e2e/questions/contract-form.ts:12-13 | Die neuen Imports stehen mitten in der sonst alphabetischen Liste. |
| C-8 | Nit | implementation_plan.md:4-5 | Doppelte Leerzeile vor `## Session`. |

ponytail-review (Ergebnis): Außer C-6 ist nichts zu streichen. `rentOf` ist nötig: Sonst würde `Object.assign(values, next)` den `startDate` des alten Mietvertrags in den neuen schreiben. Kürzer möglich: etwa −8 Zeilen.

## Geprüft und bestätigt

- **Umweg über «Neuen Mieter erfassen»:** `TenantStep.svelte:59-64` (href mit `apartment`), `TenantForm.svelte:49` (verstecktes Feld), `tenant-form.ts:80-84` (Weiterleitung mit `encodeURIComponent`, Wert nicht im Backend-Body). Tests: `contract-wizard.dom.test.ts:463-469`, `tenant-form.test.ts:114-129`, `tenant-new-page.test.ts:38-42`, E2E-Szenario Z. 111-116. Ohne die Änderung wird alles rot: Die Weiterleitung enthielt keine Wohnung, und ohne Eingabe gibt es keinen Entwurf, der sie wiederherstellen könnte (`touched`).
- **Unbekannte Wohnungs-ID in der Adresse:** `startValues` (`contract-wizard.ts:173`) verwirft sie. Kein Open Redirect: Die Weiterleitung geht immer auf einen festen Pfad.
- **Vorbelegung:** Erst beim Betreten von «Miete» (Effekt `step !== 4`). Nur in leere oder noch vorbelegte Felder, eingetippte Beträge bleiben (`rentToPreset`, Unit-Tests Z. 156-180). 0.00 bleibt leer (`kept`, Unit- und DOM-Test). Vergleich als Zahl (V-6, Test Z. 166-170). Der Hinweis nennt nur den Zeitraum mit `contractPeriod` (V-2, M-3; DOM-Test prüft «01.01.2015 – 31.12.2019, gekündigt»). Er verschwindet nach einer Änderung (DOM-Test). Texte V-1/V-3 in allen vier `messages/*.json`.
- **Vertragsbeginn:** `values.startDate` ist ISO (`DateInput.svelte:10`). Damit vergleicht `lastRent` richtig, auch als Zeichenkette.
- **Neuer Bildschirmzustand `rent-taken-over`:** in `screens.json` (mit `stateMeanings`), in `accessibility.feature`, in `sprachen-bildschirme.feature`, im Task (`tasks/accessibility.ts:270-278`, wartet auf den vorgeschlagenen Vertragsbeginn und auf den Hinweis) und in der Fixture (`noticedApartment`).
- **Screenplay:** Die Steps rufen nur Tasks und Questions auf. Die Questions liefern Werte (`Value.of`, `Text.of`). Die Szenario-Texte sind fachlich formuliert.
- **API-Vertrag:** Die gelesenen Felder (`baseRent`, `additionalRent`, `monthlyAdvancePayment`, `terminated`, `startDate`, `endDate`) stehen in `tests/contracts/contracts.json`. Die Antwort ist unverändert.
- **Design:** Nur `Alert` aus `src/lib/ui`, keine neuen Bedienelemente, keine Klassen.
- **Nichts Fremdes im Diff:** Alle Änderungen gehören zu #144.

## Nicht bestätigt

- Selbst nachgeprüft: `bunx vitest run` für contract-wizard, contract-wizard.dom, tenant-form und tenant-new-page, 75 bestanden.
- Vom Aufrufer gemeldet: lint, check, Backend type-check, vitest i18n und contracts-i18n, E2E chromium contract-new.feature, tenants, axe- und Sprachzeilen für contract-new und tenant-new.
- Ob die E2E-Szenarien ohne die Änderung rot sind, habe ich nur durch Lesen beurteilt (Weiterleitung ohne `apartment`, leere Beträge ohne Vorbelegung), nicht ausgeführt.
- Das Verhalten bei langsam geladenen Mietverträgen, wenn «Miete» vor der Antwort erreicht wird, habe ich nur gelesen: Der Effekt läuft neu, wenn `listed` eintrifft. Kein Test zeigt das.
