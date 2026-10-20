# Code-Review #450 / #490, Runde 4 (Re-Review und Abschlussrunde vor dem Push)

Gegenstand: `git diff 3b263d58 b1377023` im Worktree `review-450-code4` (Commit b1377023), also f89e211d und b1377023. Gelesen habe ich alle zwölf Dateien des Deltas, dazu `Field.svelte` ganz, `TextInput.svelte:66`, `settings.steps.ts:21-31`, `playwright.config.ts` (Timeouts, Worker, Retries), `.github/workflows/ci.yml:136-201`, `tests/a11y/screens.json` (Zustände von `/config`) und alle Aufrufer von `seed.iban`. Vorheriger Bericht: `docs/reviews/450-review-3.md`.

## Status der offenen IDs aus Runde 3

| ID | Schwere | Status | Beleg |
|---|---|---|---|
| C-1 | Major | behoben | `settings.feature:52` ergänzt das Szenario «IBAN ohne Firmenadresse» (ohne `@wip`) um «Und kennzeichnen die Einstellungen Firmenname, PLZ und Ort als fehlend». Der Schritt (`settings.steps.ts:62-66`) ruft nur die Question `settingInvalid` auf, die den Wert von `aria-invalid` liefert (`questions/settings.ts:6`, Muster `paidDateInvalid`). Die Gegenprobe für die Strasse erwartet `null`, und das passt zu `TextInput.svelte:66` (`aria-invalid={control.invalid \|\| undefined}`). Wird `namedBy` immer `undefined`, kann der Schritt nur rot sein; das deckt sich mit dem gemeldeten Rotlauf (8 von 8). |
| C-2 | Minor | behoben | `Field.svelte:56-62`: Ein `input`-Listener am Formular setzt `edited`. `edited` steuert nur `flagged`, also nur die Markierung über `invalidBy`, nicht die eigene Fehlermeldung eines Feldes. Beim Absenden setzt der `submit`-Listener (capture) `edited` zurück. Kommt dieselbe Ablehnung wieder, sind die Felder also wieder markiert. Der DOM-Test (`ui-fields.dom.test.ts:94-108`) tippt in ein Feld ausserhalb des `Field`. Ohne den Listener bleibt `aria-invalid="true"`, der Test ist dann rot. Dass die Markierung überhaupt gesetzt wird, prüft schon der Test an `:75`. |
| C-3 | Minor | behoben | `statement-endpoints.test.ts:181-189` geht über `CREDITOR_ADDRESS_MISSING`, `IBAN_MISSING` und `IBAN_INVALID`. Der Code steht im erwarteten Objekt, eine Abweichung nennt also den Code. Fehlt einer der Codes in `SETTINGS_CODES`, wird der Test rot. Die Gegenprobe mit 404 ohne Link bleibt. |
| O-34 | (offene-punkte) | behoben, Archiv stimmt | Einzelheiten siehe unten |

## Neue Befunde

Keine. Im Delta gibt es keinen Blocker, keinen Major und keinen Minor.

## O-34: die Sperre auf die globalen Einstellungen

**So funktioniert sie** (`tests/e2e/fixtures/settings-lock.ts`): `mkdirSync` legt das Verzeichnis atomar an. Wer es nicht anlegen kann, fragt alle 100 ms erneut. Ein Verzeichnis, das älter als 60 s ist, wird entfernt. `finally` gibt die Sperre wieder frei. Die Fixture `globalSettings` (`test.ts:53-58`) ist `auto`. Sie hält die Sperre während `use()`, also über die Grundlage und alle Schritte. `seed.iban` (`backend.ts:308`) hält sie nur für den `PUT`.

**Deadlock: keiner möglich.**
- *Verschachtelt:* Die Sperre ist nicht reentrant. Ein Deadlock gäbe es also nur, wenn ein Szenario mit dem Tag selbst `seed.iban` aufruft. Das tun die beiden markierten Szenarien nicht: ihre Grundlage ist `openSettings` (`settings.steps.ts:21-23`), ihre Schritte schreiben über die UI. Auch `seed`, `cleanUp` und `verwalter` schreiben keine Konfiguration; `put('config'` kommt in `tests/e2e` nur in `backend.ts:308` vor.
- *Fehlgeschlagenes Szenario:* Schlägt eine Prüfung fehl oder läuft der Test in sein Zeitlimit, baut Playwright die Fixtures ab. `use()` kehrt zurück, und `finally` gibt die Sperre frei. Eine verwaiste Sperre bleibt nur zurück, wenn ein Worker hart beendet wird (Absturz, Kill nach dem Teardown-Timeout). Diese Sperre wird nach 60 s übernommen. Das Warten endet also immer.

**Timeout: kein neues Risiko für einen grünen Lauf, aber eine Fehlerkette, wenn schon etwas rot ist.**
- Die Wartezeit in der Fixture zählt zum Test-Timeout (30 s, `playwright.config.ts:62`; Retries gibt es keine). In CI laufen pro Job 2 Worker (`:60`). Ein Wartender wartet dort höchstens so lange, wie das eine andere laufende Szenario die Sperre hält: Login, Seite, Speichern, erneutes Öffnen, Cleanup, also einige Sekunden. Lokal mit 4 Worker kann ein markiertes Szenario hinter bis zu drei anderen warten. Der gemeldete Lauf (`--repeat-each=8`, chromium, 24 von 24 grün) deckt genau diesen Fall ab.
- Hält ein *fehlschlagendes* markiertes Szenario die Sperre bis zu seinem Timeout, kann der Wartende im anderen Worker ebenfalls in seinen Timeout laufen. Das ist ein Folgefehler. Rot wäre der Lauf ohnehin schon.
- Bei einer verwaisten Sperre ist die Übernahme nach 60 s länger als die 30 s Test-Timeout. Die Szenarien, die in diesem Fenster die Sperre brauchen, scheitern deshalb an ihrem Timeout und warten nicht auf die Übernahme. Das betrifft nur Läufe, in denen ein Worker hart beendet wurde, und ist auch dann kein Deadlock. In CI läuft jeder Shard auf einem frischen Runner, `tmpdir` ist dort leer. Lokal baut `bun run test:e2e` vor dem Lauf das Frontend; bis dahin ist eine verwaiste Sperre aus einem abgebrochenen Lauf meist schon älter als 60 s. Die 60 s sind die vorsichtige Seite: Ein kürzerer Wert würde einem Halter, der bis zum Timeout und dann im Teardown hängt, die Sperre nehmen. Ich melde das nicht als Befund.
- *Geltungsbereich:* Die Sperre gilt pro Maschine. In CI läuft jeder Shard als eigener Job auf einem eigenen Runner mit eigener Datenbank (`ci.yml:137-201`). Die drei Browser-Projekte eines Shards laufen auf derselben Maschine und sind damit abgedeckt.

**Fehlt das Tag bei einem Szenario? Nein.**
- In `settings.feature` schreiben nur die beiden markierten Szenarien. «Ungültige IBAN», «Ungültige PLZ», «Frist ausserhalb des erlaubten Bereichs» und «IBAN ohne Firmenadresse» werden abgelehnt und schreiben nichts. «Die Einstellungen sagen, was eine IBAN braucht» und «Fristen sind erklärt» lesen nur. Der a11y-Eintrag `/config` hat nur den Zustand `default` (`screens.json:611-615`).
- Ausserhalb von `settings.feature` schreibt nur `seed.iban` die Einstellungen («die Verwaltung hat die IBAN … hinterlegt», `statements.steps.ts:133-135`; in acht Features, immer die CH-IBAN), und diese Schreibung ist gesperrt.
- Diese Szenarien lesen die IBAN danach ungesperrt im PDF. Keines prüft aber, ob es die CH- oder die LI-IBAN ist: Die Prüfungen im PDF sind «Zahlbar durch», «IBAN mit» (verneint) und Beträge, und `CH93`/`LI21` kommen ausserhalb von `settings.feature` nur in den `Angenommen`-Zeilen vor. Beide IBANs geben einen Zahlteil, und keine ist eine QR-IBAN. Ein drittes Tag braucht es also nicht.

**Doku:** Die Zeile O-34 ist aus `offene-punkte.md` entfernt. Der Archiv-Eintrag (`offene-punkte-verlauf.md:329-331`) beschreibt die Sperre richtig, auch dass `seed.iban` sie nimmt und dass seriell laufen nicht gereicht hätte. Die Kommentare in `settings.feature:13`, `test.ts:53` und `settings-lock.ts:5-7` stimmen mit dem Code überein. Die ID O-34 war schon einmal vergeben (`implementation-plan-verlauf.md:586`, axe-Upload); das liegt vor dieser Änderung und hat mit ihr nichts zu tun.

## Weitere Pflichtprüfungen im Delta

- Verhaltensänderung mit Szenario: Die neue Markierung (C-1) und deren Aufheben (C-2) gehören zu Helga P-2. Für die Markierung gibt es jetzt das Szenario. Für das Aufheben bei einer Eingabe gibt es den DOM-Test. Das ist die unterste Schicht, die es zeigen kann, und es ist eine Folge des schon gemeldeten Zustands, kein neuer Bildschirm.
- Neue Bildschirme oder Zustände: keine; neue Texte: keine (`messages/*.json` unverändert).
- Screenplay: Der Schritt ruft nur `verwalter.sees(...)` mit Questions auf, kein Locator. Die Question liefert den Wert des Attributs, nicht ja/nein.
- Unabhängig von der Anforderung: nichts. Alle Änderungen gehören zu C-1 bis C-3 oder zu O-34, das der Koordinator in diesen PR geholt hat.
- Ponytail: Es bleibt nichts Ungenutztes zurück. `withSettingsLock` wird zweimal genutzt, und einen bestehenden Helper dafür gibt es nicht.
- Red-Tests: Die drei Tests aus C-1 bis C-3 sind ohne die Änderung rot (siehe Tabelle). Die Sperre ist mit der Messung belegt: 3 von 8 rot ohne, 24 von 24 grün mit.

## Nicht bestätigt

- **Checks, vom Aufrufer gemeldet:** `bun run lint`, `bun run check`; vitest `ui-fields.dom`, `config-pages`, `settings`, `statement-endpoints`, `documents`, `open-work`, `e2e-screenplay-lint` (130 grün); die Rot- und Grünläufe von C-1 (8 von 8 rot mit `namedBy` → `undefined`), C-2 (DOM-Test rot vor dem Fix) und O-34 (3 von 8 rot ohne Tag, 24 von 24 grün mit Sperre, nur chromium). Selbst neu laufen lassen wollte ich `bunx vitest run` für `ui-fields.dom` und `statement-endpoints`. Das ging nicht: Der Zugriff auf `node_modules` (Verweis nach `/home/user/Dwello/node_modules`) ist für mich gesperrt.
- **E2E** für settings, statement-detail, statement-reminder und documents (chromium + api): Das Ergebnis reicht der Aufrufer nach. Die Sperre ist mit firefox und webkit im selben Job nicht gemessen; dass sie dort hält, folgt nur aus dem Code (gleiche Maschine, gleicher `tmpdir`).
- **`No scenario: <Grund>` für Dr. Weber P-1 und P-2:** Offen wie in Runde 3. Der Pull Request existiert noch nicht. Beim Öffnen muss er beide Gründe nennen.
- **Plan:** Das archivierte Session W5-450 (`implementation-plan-verlauf.md:2037-2048`) nennt Runde 3 und 4 und das Schliessen von O-34 noch nicht. Laut Koordinator steht die Checkliste im Pull Request; dort ist es nachzutragen.
