# B-15 (#152) Code-Review, Runde 3

Umfang: Delta `5f97d8b..2fa32bd` (Commit `2fa32bd fix(contracts): name earliest start and links`) und Status der Befunde m-5 und n-4 aus Runde 2.

## Blocker / Major

Keine.

## Status der Befunde aus Runde 2

- m-5 (Minor): **behoben.** `tests/e2e/steps/contract-form.steps.ts:244` prüft jetzt `toContain('mit «Beenden»')`. Der Hilfetext aus Runde 1 (`8545bed`, Schlüssel `contracts_parties_fixed_help`) enthält «mit «Beenden»» nicht. Mit dem alten Text würde das Szenario also rot. Siehe aber n-5.
- n-4 (Nit): **zu Recht in die offene Arbeit verschoben.** Es ist ein nicht-funktionaler Punkt (Usability). Er steht jetzt in `docs/design/offene-punkte.md` Zeile U-15 («the links in «Mieter und Wohnung», like «Abbrechen», leave the form without asking …»), mit `ContractForm.svelte` als Ort. Im Plan ist er als «open work U-15» geführt. Das entspricht «Open work» in `CLAUDE.md`.

## Minor

- m-6 `src/routes/contracts/ContractForm.svelte:204`: «Neuen Mietvertrag erfassen» führt auf das blanke `/contracts/new`. Das bestehende Muster für denselben Schritt übergibt die Wohnung: «Nachmieter erfassen» verlinkt `/contracts/new?apartment=…` (`src/lib/overview.ts:163`, `src/routes/apartments/[id]/+page.svelte:42`, `contract-detail-page.dom.test.ts:89`). Bei einem Mieterwechsel muss die Verwalterin die Wohnung im Wizard erneut wählen. Ausserdem steht der Link auch in der Variante «open» (ohne Vertragsende). Dort verlangt der Text, zuerst «Beenden» zu nutzen. Der Link bietet so einen Weg an, der bei einem Mieterwechsel an der Verfügbarkeitsprüfung des Wizards endet (laufender unbefristeter Mietvertrag auf derselben Wohnung). Nachweis: DOM-Test `contract-edit.dom.test.ts:139` prüft für die Variante «open» nur `href` = `/contracts/new`.
- m-7 `tests/e2e/features/contract-edit.feature:72-75`: Die neu sichtbaren Teile dieses Deltas sind nur im DOM-Test belegt: das früheste Datum, der zweite Link und der Linkname mit Mieter. Das Szenario prüft davon nichts. Für einen Hilfetext ist der DOM-Test die tiefste passende Schicht, deshalb nur Minor. Der Plan nennt dafür weder «Scenario red» noch einen Grund.

## Nit

- n-5 `implementation_plan.md:47`: m-5 ist als «fixed» geführt, aber zur neuen Prüfung gibt es keine Notiz «Scenario red». Sie kam erst nach dem Fix aus `5f97d8b` dazu und wurde nie rot gesehen.
- n-6 `src/routes/contracts/ContractForm.svelte:69-70`: Die Rechnung «Tag danach» steht ein drittes Mal inline im Code (vgl. `src/lib/statement-wizard.ts:93`, `src/lib/utils/contract-availability.ts:52` `addDays`). Sie ist nur über den DOM-Test abgedeckt.
- n-7 `messages/de.json:1254`: Der neue Text `backend_contract_parties_fixed` («Geben Sie diesem Mietvertrag ein Vertragsende …») passt nicht zu einem Mietvertrag, der schon ein Vertragsende hat. Der Fall ist selten, weil die UI das Feld gar nicht anbietet.

## Weitere Prüfungen (ohne Befund)

- Texte: `contracts_parties_fixed_ended` (mit `{date}`), `contracts_parties_fixed_link` (mit `{name}`), das neue `contracts_parties_fixed_new` und `backend_contract_parties_fixed` stehen in allen vier `messages/*.json`. Der Verweis «Vertragsdauer / Contract term / Durée du contrat / Durata del contratto» stimmt mit `contracts_period` (Zeile 580) in jeder Sprache überein. In fr stehen jetzt geschützte Leerzeichen (U+00A0) innerhalb der « » (Bytes geprüft).
- Datum: `dayAfter` rechnet auf UTC-Mitternacht, `formatDate` bei 10 Zeichen ebenfalls in UTC. Damit gibt es keinen Versatz durch die Zeitzone. Ein `endDate` mit Zeitanteil wird durch `slice(0, 10)` abgeschnitten. Der DOM-Test prüft «frühestens ab 01.04.2099» für das Ende 31.03.2099.
- Design: Der zweite Link nutzt dieselbe Token-Klasse `link` (`min-h-12`, `text-accent`). Es gibt keinen neuen Bildschirm und keinen neuen Zustand. Die Varianten sind weiterhin `contract-edit` / `contract-edit-notice` in `tests/a11y/screens.json`. `data-testid` `contract-parties-new` ist kebab-case mit Kontext.
- Screenplay: Der Step ruft nur die Question `partiesHelpText` auf, nicht die Seite.
- Umfang: Die Persona- und Fachreview-Berichte, der Plan und U-15 sind Workflow-Artefakte. Im Delta gibt es nichts, was nicht zur Anforderung gehört.
- Gelaufen und grün: `contract-edit.dom.test.ts` + `backend-codes.test.ts` (33/33), ESLint auf `ContractForm.svelte`, `contract-form.steps.ts` und `contract-edit.dom.test.ts` ohne Warnung.

## Nicht bestätigt

- Das E2E-Szenario «Mieter und Wohnung stehen im Mietvertrag fest» habe ich nicht laufen lassen (keine App gestartet). Nur der Step-Code wurde gelesen.
- `bun run check`, `test:coverage`, die Backend-Tests und `fallow`/`deepcheck` liefen nicht. Das Backend ist im Delta nicht geändert, nur der Text in `messages/*.json`.
- Ob der Wizard einen Mieterwechsel ohne vorheriges «Beenden» wirklich ablehnt oder nur warnt (m-6): Ich habe nur `ContractWizard.svelte:56-75` gelesen (`startLimit`, `overlapWarning`), nicht durchgespielt.
