# Review i815b2, Runde 1 (#815 B2, B3a, B3b; 5c543d4a..99ffc069)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tools/fitness/ratchet.json:275 (Zeile `src/lib/contract-wizard.ts:69`), src/routes/contracts/new/ContractWizard.svelte:77 | Die Vorprüfung «Abgerechnet bis» nach heute im Assistenten vergleicht mit dem Tag des Browsers (`new Date().toLocaleDateString('sv-SE')`), das Backend mit `swissToday()`. Westlich von Zürich lehnt der Assistent einen Tag ab, den das Backend annimmt. Damit ist sie keine zulässige Vorprüfung nach #815 |
| C-2 | Minor | tools/fitness/ratchet.json:275 | Als Beleg für die Vorprüfung im Assistenten (Erfassen, `POST /contracts`) ist `billed-until.pg.test.ts` eingetragen. Dieser Test zeigt `BILLED_UNTIL_FUTURE` nur beim Speichern (`PUT`, Zeile 28/80). Das Backend lehnt auch beim Erfassen ab (`contract.service.ts:359`), aber kein Test zeigt das |
| C-3 | Minor | backend/src/services/apartment.service.ts:51, backend/src/__tests__/apartment-availability.pg.test.ts:49 | Den Grenzfall «letztes Vertragsende gestern» (`max + 1 = heute`, dann `availableFrom` null) prüft kein Test. Wird `>` zu `>=` geändert, bleibt der Test grün. Genau an dieser Grenze zeigt die neue Fassung bei einem Browser in der Schweizer Zeitzone etwas anderes als die alte: Früher stand «verfügbar ab <heute>» mit Vertragsbeginn heute vorbelegt, jetzt steht «Wohnung verfügbar» ohne Vorbelegung (siehe unten). Das widerspricht «Verhalten unverändert» und ist nirgends festgehalten |
| C-4 | Minor | src/__tests__/contract-new-load.test.ts:74-76 | Der neue Test steht zwischen dem Kommentar «B-14 (#147): an empty choice …» und dem `it.each`, zu dem dieser Kommentar gehört. Jetzt beschreibt der Kommentar den falschen Test |

## C-1 (Major): Vorprüfung im Assistenten mit einem anderen «heute» als das Backend

Was #815 verlangt: Eine Vorprüfung im Frontend ist nur erlaubt, wenn das Backend dieselbe Eingabe mit demselben Code ablehnt. Mit B2 steht die Zeile `const billed = today && billedUntilError(offeredBilledUntil(values, today), today);` (`src/lib/contract-wizard.ts:69`) jetzt als gültige Vorprüfung in `preChecks`.

Der Assistent übergibt aber `today = new Date().toLocaleDateString('sv-SE')` (`ContractWizard.svelte:77`, Kommentar «local YYYY-MM-DD»), also den Tag in der Zeitzone des Browsers. Das Backend prüft dagegen mit `swissToday()` (`contract.service.ts:344`). Bearbeitungsformular und Vertragsseite sind korrekt: Sie nehmen `localToday()` mit `Europe/Zurich` (`ContractForm.svelte:67`) bzw. `data.today` vom Server.

So zeigt man den Fehler: Browser auf `America/New_York`, Uhr auf 25.10.2026 01:00 Schweizer Zeit (das ist 24.10. 19:00 in New York). «Abgerechnet bis» = 25.10.2026 eintragen. Der Assistent meldet `backend_billed_until_future` und lässt nicht weiter. `PUT`/`POST` mit `billedUntil: swissToday()` gibt dagegen 200 zurück (`billed-until.pg.test.ts:84`). In der Gegenrichtung (Browser östlich) lehnt das Backend ab, und der Assistent zeigt den Code. Das ist unkritisch.

Zur Behebung: die Zeile in `preChecks` mit dem Schweizer Tag prüfen lassen (z. B. `localToday()` an `stepErrors` übergeben) oder sie unter `exceptions.frontendDecisions` lassen. Die Ursache stammt aus der Zeit vor dem Diff. Erst B2 erklärt die Zeile aber zur gleichwertigen Vorprüfung, und genau danach fragt die Anforderung.

## Zum alten Verhalten von `computeAvailability` (Beleg zu C-3)

Die alte Fassung lief mit Browser in `Europe/Zurich` und letztem Vertragsende = gestern so ab: `parseDate('JJJJ-MM-TT')` ergibt Mitternacht UTC, `today` ist Mitternacht lokal (22:00/23:00 UTC am Vortag), `addDays` rechnet lokal. Damit war `availableFromDate` (heute 00:00 UTC) grösser als `today`, also `available-from` mit dem heutigen Tag. In allen anderen Fällen stimmt das SQL mit der alten Regel überein: ein unbefristeter Vertrag irgendwo in der Liste blockiert (`exists … end_date is null`), sonst gilt `max(end) + 1`, wenn dieser Tag nach heute liegt, sonst frei. `bool_and` ist neben `blocked` überflüssig, aber richtig. Ohne Verträge gibt `having` keine Zeile zurück, also null.

## Nicht bestätigt

- Alle Prüfungen des Aufrufers auf 99ffc069 (lint, check, backend type-check, `bunx vitest run`, Backend-Tests advance-proposal, apartment-availability, api-contracts, contract.routes, `bun run fitness`, E2E contract-new, contract-detail/-edit/contracts): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Rotläufe: vom Aufrufer gemeldet. Nach dem Lesen fallen alle neuen Tests ohne die Änderung (fehlender Export bzw. fehlende Felder, Mapping, Vorschlag aus dem Backend, `computeAvailability`-Signatur).
- Ob der Pull Request für die sichtbare Änderung an der Grenze (C-3) bzw. für «Verhalten unverändert» `No scenario: <reason>` angibt: Es gibt noch keinen PR-Text. In `tests/e2e/features` fehlt ein neues Szenario. Die Commit-Typen `fix(...)` deuten auf einen Fix hin.

Geprüft: B2-Pfade der Vorprüfungen (Bearbeitungsformular und Vertragsseite senden `PUT /contracts/:id`; `checkEnd` und `checkBilledUntil` lehnen dort mit dem genannten Code ab, `contract-end-refusals.pg.test.ts` und `billed-until.pg.test.ts:80` zeigen es; `PastEndConfirm` gibt es nur in diesen beiden). `proposedAdvanceFrom` entspricht der alten Frontend-Fassung, auch bei «endet vor dem nächsten Ersten» (alt: `next <= endDate` ist falsch, also der Tag des letzten Betrags) und bei Verträgen ohne Akonto (`?? null` bzw. `advancePayments &&`). Der Edit-Loader reicht das Feld ungefiltert durch. Kann die Vertragsliste einer Wohnung nicht geladen werden, bleibt sie `null`, die Wohnung also «nicht geprüft» (`list && …`). Verträge `contract.json`, `apartment(s).json` und `api-specification.md` sind nachgeführt, keine neuen UI-Texte. Ponytail: nichts zu kürzen.
