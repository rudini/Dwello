# Review #296, Runde 1 (84ea945..90e8393)

Worktree: `/tmp/claude-0/-home-user-Dwello/e15917e2-7c43-5793-a424-48cbe5ea53b1/scratchpad/review-296-code`

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Minor | src/routes/contracts/ContractForm.svelte:225, src/lib/contract-form.ts:35 | Zweiter Weg zum selben Widerspruch bleibt offen: Der Link «Neuen Mietvertrag für … erfassen» auf einem Mietvertrag mit Vertragsende 31.12.2099 öffnet den Assistenten mit `start=2100-01-01`, `initialContractValues` übernimmt das ungeprüft, und «Weiter» meldet «Das Jahr ist nicht möglich». Ein Vertragsende 2099 lässt die eigene Prüfung zu, der Fall ist also genauso erreichbar wie der von #296. Das Issue nennt nur `suggestedStartDate` («Where»), daher Minor; Abhilfe in einer Zeile: `startDate: impossible(start) ? '' : start` in `initialContractValues` (mit Unit-Test), oder ein Issue anlegen. |
| C-2 | Nit | src/lib/contract-wizard.ts:59, src/lib/contract-form.ts:174 | `impossible` liegt jetzt in `contract-form.ts`, die zugehörige Meldung `impossibleYear` in `contract-wizard.ts`; `statement-wizard.ts` importiert deshalb aus zwei Modulen. Beide zusammen zu verschieben hielte Prüfung und Text beieinander. Kein Defekt. |
| C-3 | Nit | implementation_plan.md:5 | Doppelte Leerzeile vor `## Session`. |

Keine Blocker, keine Major.

## Geprüft und bestätigt

- **Anforderung:** `suggestedStartDate` (src/lib/contract-form.ts:177-183) gibt `null` zurück, sobald `impossible(availableFrom)` gilt; der einzige Aufrufer, der Effekt in `src/routes/contracts/new/ContractWizard.svelte:166-172`, füllt dann nichts ein. Die Datumsprüfung (19xx/20xx) bleibt unverändert, gewählt wurde also «nichts vorschlagen», wie im Issue erlaubt.
- **Verschiebung von `impossible`:** sie ist nötig, weil `contract-wizard.ts` bereits aus `contract-form.ts` importiert (sonst ein Zyklus). Alle Aufrufer (`contract-wizard.ts:63,64,91`, `statement-wizard.ts:39,40`) sind angepasst, und `impossible` hat kein anderes Ziel als diese.
- **Test rot ohne Änderung:** `contract-form.test.ts:191-193` erwartet `null` für `freeFrom('2100-01-01')`; der alte Code gab `'2100-01-01'` zurück, der Test wäre also rot. Der bestehende Test (Z. 186-189) sichert, dass ein gültiger Tag weiter vorgeschlagen wird.
- **Testdaten 2099 → 2098:** In `contract-wizard.dom.test.ts` (a3) sind alle Erwartungen konsistent angepasst (Vorschlag `01.01.2099`, `min` `2099-01-01`; der eingetippte `01.01.2101` im Retry-Test bleibt bewusst unverändert, er prüft nur, dass Getipptes erhalten bleibt). `tests/e2e/fixtures/screens.ts:43,50` und der Axe-Zustand `overlap-warning` (`tests/e2e/tasks/accessibility.ts:288-289`) passen zusammen: Vorschlag 01.01.2099, getippter Beginn 2020 überschneidet 2015-2098. Andere Verwendungen von 1.04 (`limitedApartment`) hängen nicht am Jahr.
- **Szenario:** Keins; `No scenario: <Grund>` steht im Commit und im Plan, wie es das Issue vorsieht.
- **Texte, i18n, Tokens, a11y, Sicherheit:** Der Diff ändert keine Texte, kein Markup und keine API. Neue Bildschirme oder Zustände gibt es nicht, daher keine Einträge in `screens.json` oder den Features nötig.
- **E2E-Schichten:** Die Änderung in `accessibility.ts` betrifft nur Werte, Struktur und Screenplay-Schichten bleiben gleich.
- **Nichts Fremdes im Diff:** Alle Änderungen gehören zu #296.
- **ponytail-review:** Nichts zu streichen. `suggestedStartDate` ist kürzer als vorher oder gleich lang; zur Aufteilung von `impossible` und `impossibleYear` siehe C-2.

## Nicht bestätigt

- Selbst erneut ausgeführt im Worktree: `bunx vitest run src/__tests__/contract-form.test.ts src/__tests__/contract-wizard.dom.test.ts src/__tests__/contract-wizard.test.ts`, 71/71 grün.
- `bun run lint`, `bun run check`, `cd backend && bun run type-check` und die volle `bunx vitest run` (158 Dateien): vom Aufrufer gemeldet.
- Dass der neue Unit-Test vor dem Fix rot war: vom Aufrufer gemeldet; durch Lesen bestätigt (s. oben), nicht ausgeführt.
- E2E-Zeilen Axe/Sprachen für die Vertragsbildschirme (Zustand `overlap-warning` mit 1.04): vom Aufrufer als laufend gemeldet, nicht ausgeführt (E2E ist mir untersagt).
