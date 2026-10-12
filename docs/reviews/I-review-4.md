# Review I, Runde 4 – Vertragsende in der Vergangenheit, Löschen nur vor Vertragsbeginn

Unabhängiges Review von `git diff c7613c7..HEAD` (7324c57 «feat(contracts): end in the past, keep started ones», b8ba33b Anforderungsdokument). Die Änderung setzt IF-1 und IF-3 aus `I-fachreview-1.md` um, nach drei Entscheiden des Product Owners: (1) nur ein Mietvertrag, der noch nicht begonnen hat, lässt sich löschen; (2) ein vergangenes Vertragsende geht im Dialog mit einer angekreuzten Bestätigung der Folge; (3) ein Vertragsende vor dem Ende einer gespeicherten Nebenkostenabrechnung des Vertrags wird abgelehnt.

Gelesen: Diff, `contract-status.ts`, `contracts/[id]/+page.svelte` und `+page.server.ts`, `Checkbox`, `ActionDialog`, `dialog-submit.ts`, `DateInput`, `focus-error.ts`, die drei Testdateien, `helpers/action.ts`, `contract-detail.feature` mit Steps, Tasks, Interactions und `fixtures/backend.ts` (`statement`), `tests/a11y/screens.json` und `interactions/accessibility.ts`, `tests/contracts/README.md`. Im Backend `statement.service.ts` (`listStatements`, Filter), `routes/statements.ts`, `contract.service.ts` (`updateContract`, `deleteContract`), `apartment.service.ts` (`apartmentStatus`, `deleteApartment`), `calculation.service.ts` (Akonto), `schema.ts`. Dazu `UBIQUITOUS_LANGUAGE.md`, `offene-punkte.md` und `design-decisions.md` (Session 12), `docs/api-specification.md`, `docs/PRD-Dwello.md`, `src/lib/overview.ts`, `I-review-3.md`, `I-fachreview-1.md`, `docs/anforderungen-vertragsende.md`, die Mieterseite (Löschdialog).

Ausgeführt: `bunx vitest run` für `contract-status`, `contract-actions`, `contract-detail-page.dom` (44 Tests grün). `bunx eslint` auf den geänderten `.ts`/`.svelte`-Dateien: sauber. `bunx prettier --check` auf allen geänderten Dateien: sauber. `endedSince` mit Node an Randfällen geprüft. E2E, volle Suiten und Server nicht ausgeführt.

**Ergebnis:** Kein kritisches Finding. Ein Finding «hoch»: Die Ablehnungsmeldung wegen einer Abrechnung rät dem Laien, ein falsches Vertragsende einzutragen. Fünf Findings «mittel»: Die Abrechnungsprüfung sucht über den Mieter statt über den Mietvertrag. Sie lässt bei einem Backend-Fehler durch oder stürzt ab. Die Bestätigung bleibt angekreuzt, wenn das Datum danach ändert. Die neue Backend-Abfrage hat keinen API-Vertrag. Das Anforderungsdokument enthält Widersprüche. Dazu Kleinigkeiten zu Texten, Doku und Tests.

Die Datumslogik stimmt: `endedSince` rechnet in UTC und ist damit unabhängig von der Zeitzone des Servers. Monats- und Jahresende sowie Schaltjahre (28.02.2024 → 29.02.2024, 29.02.2024 → 01.03.2024, 31.12.2024 → 01.01.2025) sind richtig. Seite und Aktion rechnen «heute» beide in Europe/Zurich. Ohne JavaScript lässt sich der Dialog nicht öffnen («Beenden» ist ein `onclick`). Die Felder `endDate` und `pastConfirmed` erreichen die Aktion also nur mit JavaScript. Die Prüfung in der Aktion schützt gegen veraltete oder umgangene Seiten.

## Stand der früheren Findings (Runde 3, soweit vom Diff berührt)

| # | Schwere | Stand |
|---|---|---|
| K-1 | mittel | Behoben: `endContract` rechnet «heute» erst im Schritt (`tests/e2e/tasks/contract-detail.ts:32`) |
| K-3 | mittel | Überholt. Der Löschdialog eines begonnenen Vertrags verweist auf «Bearbeiten» (`+page.svelte:184-187`). Dort lassen sich Mieter und Wohnung ändern (`ContractForm.svelte:144-155`) |
| K-4 | niedrig | Überholt. Neuer Text ohne «gekündigt», der Grund «braucht seine Mietstage» steht jetzt im gesperrten Zweig, und das ist jetzt jeder begonnene Vertrag |
| K-5 | niedrig | Teilweise. Die Leer-Meldung nimmt das laufende Jahr (`contract-status.ts:41`). Ein Beispiel in der Vergangenheit stört nicht mehr, weil vergangene Tage jetzt erlaubt sind |
| K-7 | niedrig | Der Kommentar «auch ohne JavaScript» steht neu über einem anderen Test (`contract-actions.test.ts:54`) und stimmt weiterhin nicht (L-9) |

## Übersicht neue Findings

| # | Schwere | Finding |
|---|---|---|
| L-1 | hoch | Ablehnung wegen einer Abrechnung: «Wählen Sie den 31.12.2025 oder einen späteren Tag» verleitet dazu, ein falsches Vertragsende einzutragen. Ein Entwurf wird nicht unterschieden |
| L-2 | mittel | `billedTo` sucht die Abrechnungen über den heutigen Mieter (`tenantId`). Wurde der Mieter unter «Bearbeiten» geändert, findet die Prüfung nichts |
| L-3 | mittel | `billedTo`: Antwortet das Backend mit einem Fehler, wird ohne Prüfung gespeichert. Ist die Antwort kein JSON, gibt es eine Fehlerseite |
| L-4 | mittel | Die Bestätigung bleibt angekreuzt, wenn das Datum danach ändert. Sie gilt dann für einen Tag, der nie bestätigt wurde |
| L-5 | mittel | Neue Backend-Abfrage `GET /statements?tenantId=…` ohne API-Vertrag in `tests/contracts`. Der Test antwortet mit einem Mischobjekt |
| L-6 | mittel | Anforderungsdokument: A-3 «vorgeschlagen ist heute» meldet bei jeder spät erfassten Kündigung eine zu kurze Frist. A-4 doppelt die 60-Tage-Frist. A-2.2 widerspricht dem umgesetzten Text |
| L-7 | niedrig | Hilfe der Bestätigung: «gilt die Wohnung als leer» stimmt nicht, wenn die Wohnung Gesperrt ist. «Ab diesem Tag» bei einem vergangenen Tag |
| L-8 | niedrig | Meldungen ohne «was tun»: fehlende Bestätigung (kein Hinweis auf ein falsches Datum), Lösch-Ablehnung der Aktion |
| L-9 | niedrig | Veraltete Doku und Kommentare: `offene-punkte.md:261`, Szenario-Kommentar, `screens.json`, Testkommentar |
| L-10 | niedrig | Kleinere Lücken: Server-Absturz bei Datum wie `2025-13-01`, BFF-Proxy `DELETE /api/contracts/[id]` ohne Regel, fehlende Tests, Commit-Subject mit 51 Zeichen |

## Findings

### L-1 (hoch) Die Ablehnung wegen einer Abrechnung rät zu einem falschen Vertragsende

`src/routes/contracts/[id]/+page.server.ts:126-131`. Liegt das neue Vertragsende vor dem `periodEnd` einer gespeicherten Abrechnung des Vertrags, meldet die Aktion: «Die Nebenkostenabrechnung bis 31.12.2025 enthält schon Mietstage nach diesem Tag. Wählen Sie den 31.12.2025 oder einen späteren Tag.»

Fehlerszenario: Die Mieterin ist am 31.03.2025 ausgezogen. Der Verwalter hat die Kündigung nie erfasst und im Januar 2026 den Lauf 2025 gestartet. Jetzt gibt es einen Entwurf mit 365 Mietstagen. Er erfasst das Vertragsende 31.03.2025 und bekommt die Meldung. Die Zielgruppe (Laien, wenige Male im Jahr in der App) befolgt den Rat und wählt den 31.12.2025. Dann bleibt der Vertrag 9 Monate zu lang laufend. Die Mieterin zahlt in der Abrechnung Nebenkosten für eine Zeit, in der sie nicht mehr dort wohnt. Ein Nachmieter ab 01.04.2025 lässt sich wegen der Überschneidungsprüfung nicht erfassen. Die richtige Handlung wäre: den Entwurf löschen, das Vertragsende setzen, den Entwurf neu erstellen.

Die Meldung unterscheidet nicht nach dem Status der Abrechnung. Die Liste liefert `status` aber mit (`statementColumns`). Sowohl das Fachreview (IF-8, `I-fachreview-1.md:133`: «Löschen Sie den Entwurf und erstellen Sie ihn neu. Bei versandten Abrechnungen ablehnen.») als auch das neue Anforderungsdokument (A-2.2) verlangen genau diese Unterscheidung. Der umgesetzte Text widerspricht beiden.

Fix:
- Entwurf (`status === 'draft'`): «Für diesen Mietvertrag gibt es einen Entwurf der Nebenkostenabrechnung bis 31.12.2025 mit Mietstagen nach diesem Tag. Löschen Sie den Entwurf, beenden Sie den Mietvertrag und erstellen Sie die Abrechnung neu.» Dazu der Link `/statements?contract={id}`, den die Seite schon hat (`+page.svelte:119`).
- Versandt oder bezahlt: keinen späteren Tag empfehlen. Stattdessen sagen, was passiert ist und was zu tun ist, z. B. «Die Nebenkostenabrechnung bis 31.12.2025 ist schon versandt und enthält Mietstage nach diesem Tag. Ein früheres Vertragsende ist deshalb nicht möglich. Klären Sie die Abrechnung zuerst mit dem Mieter.» Der genaue Weg (Gutschrift, Storno) ist ein Produktentscheid und gehört in `offene-punkte.md`.
- Test zuerst: zwei Fälle in `contract-actions.test.ts` (Entwurf, versandt) mit der jeweiligen Meldung. Szenario `contract-detail.feature:43-49` an den Entwurfsfall anpassen.

### L-2 (mittel) Die Abrechnungsprüfung sucht über den Mieter statt über den Mietvertrag

`+page.server.ts:99-106,146`. `billedTo` lädt `statements?tenantId=<heutiger Mieter des Vertrags>` und filtert danach nach `contractId`. Eine Abrechnung speichert aber ihren eigenen `tenantId` (`schema.ts:321`). `updateContract` (`contract.service.ts:293-326`) erlaubt, `tenantId` und `apartmentId` eines Vertrags mit Abrechnungen zu ändern, und passt die Abrechnungen nicht an. Der neue Löschdialog empfiehlt das ausdrücklich: «Ist er falsch erfasst, korrigieren Sie ihn unter «Bearbeiten».» (`+page.svelte:186`).

Fehlerszenario: Ein Vertrag ist für den falschen Mieter erfasst, der Lauf 2025 hat einen Entwurf erzeugt (Mieter A). Der Verwalter korrigiert unter «Bearbeiten» auf Mieter B und beendet dann auf den 31.03.2025. `statements?tenantId=B` liefert den Entwurf nicht, die Prüfung findet nichts, das Ende wird gespeichert. Der Entwurf widerspricht nun dem Vertrag, genau der Fall, den Regel (3) verhindern soll.

Nebenbei: `limit=100` schneidet bei mehr als 100 Abrechnungen pro Mieter ab. Sortiert ist nach `statementDate desc`. Das ist bei unter 50 Wohnungen praktisch unerreichbar und kein eigenes Finding.

Fix: nach dem Vertrag filtern, nicht nach dem Mieter. Am einfachsten ein Filter `contractId` in `statementFilterConditions` (`statement.service.ts:79-94`) und in der Route (`statements.ts:59`). Besser: die Regel im Backend durchsetzen (`updateContract`, 409), wie A-2.4 es ohnehin verlangt. Dann gilt sie auch für «Bearbeiten», und die BFF muss nur die Meldung übersetzen. Test zuerst als `*.pg.test.ts`: Vertrag mit Abrechnung, Mieter geändert, früheres Ende → abgelehnt.

### L-3 (mittel) `billedTo` lässt bei einem Fehler durch oder stürzt ab

`+page.server.ts:100-102`. Der Status der Antwort wird nicht geprüft.
- Antwortet das Backend mit einem Fehler als JSON (401 nach abgelaufenem Token, 500 mit `{ error }`), ist `.data` `undefined`. Dann gilt `[]`, die Prüfung ist bestanden, und das `PUT` speichert das Ende ohne Abrechnungsprüfung. Die Prüfung schlägt also offen fehl.
- Ist die Antwort kein JSON (502 eines Proxys, HTML), wirft `response.json()`. Die Aktion endet mit einer unbehandelten Ausnahme, und SvelteKit zeigt statt der Meldung im Dialog die Fehlerseite. `ActionDialog` (`dialog-submit.ts:20`) ruft `update()` auch bei `result.type === 'error'` auf.

Die übrigen Aufrufe der Aktion behandeln `!ok` mit `fail(status, …)` (`:142-143`, `:154-155`).

Fix: `if (!response.ok) return fail(response.status, { endError: 'Mietvertrag konnte nicht beendet werden.' })` vor `json()`. Dafür muss `billed` ein `fail` oder einen Tag liefern können. Alternativ prüft das Backend (L-2), dann entfällt der Aufruf. Test zuerst: `runAction` mit einem `fetch`, das für `/statements` 500 liefert → `status: 500`, kein `PUT`. Dafür braucht `helpers/action.ts` eine Antwort pro URL (siehe L-5).

### L-4 (mittel) Die Bestätigung bleibt angekreuzt, wenn das Datum danach ändert

`+page.svelte:44-51,153-161`. `pastConfirmed` wird nur in `startEnding` zurückgesetzt. Ändert das Datum, bleibt das Häkchen.
- Fall A: Der Verwalter tippt 31.03.2025, kreuzt an und korrigiert dann auf 31.03.2024 (etwa nach einem Blick in den Ordner). Das Label wechselt auf «seit dem 01.04.2024», das Häkchen bleibt. Gesendet wird `pastConfirmed=on` für einen Tag, dessen Folge er nie bestätigt hat.
- Fall B: Er tippt einen vergangenen Tag, kreuzt an und tippt dann einen künftigen Tag. Die Box verschwindet, `pastConfirmed` bleibt `true`. Tippt er danach wieder einen vergangenen Tag, erscheint die Box schon angekreuzt.

Die Bestätigung ist die Schutzmassnahme aus Entscheid (2), unter anderem gegen Tippfehler im Jahr (`contract-status.test.ts:56`). So verliert sie ihre Wirkung, sobald man das Datum korrigiert, also gerade beim Tippfehler.

Fix (klein): Die Bestätigung an den Tag binden, z. B. `let confirmedFor = $state('')`. Die Checkbox setzt `confirmedFor = checked ? endDate : ''`, und `pastConfirmed` ist `$derived(confirmedFor === endDate)`. Test zuerst im DOM-Test: Datum tippen, ankreuzen, anderes vergangenes Datum tippen → Box nicht angekreuzt, Bestätigen sendet nicht. Ein zweiter Test prüft, dass erneutes Öffnen die Box leert. Auch das ist bisher ungetestet.

### L-5 (mittel) Neue Backend-Abfrage ohne API-Vertrag

`+page.server.ts:100-105` liest aus `GET /api/v1/statements` die Felder `data[].contractId` und `data[].periodEnd`. Das Backend liefert beide: `statementColumns` enthält alle Spalten ausser `pdfBlob` (`statement.service.ts:38`), `periodEnd` ist `date`, also `YYYY-MM-DD`. Das ist aber nirgends abgesichert:
- `tests/contracts/` hat keine Datei für die Statement-Liste (`README.md`, Tabelle).
- `contract-actions.test.ts:73-110` antwortet mit `runAction` auf jeden Aufruf mit demselben Objekt `{ startDate, tenantId, data: [...] }`, also Vertrag und Liste vermischt (`helpers/action.ts:19`).

CLAUDE.md verlangt: «frontend tests take backend responses from `tests/contracts/*.json`» und «braucht das Frontend ein neues Feld, kommt es zuerst ins Beispiel» (`tests/contracts/README.md`). Benennt das Backend `periodEnd` um oder liefert es ein `Date`-Objekt, bleibt der Unit-Test grün, und die Prüfung findet nie etwas (`undefined.slice` würde zudem werfen).

Fix: `tests/contracts/statements.json` (Liste mit `data[].contractId`, `data[].periodEnd`, `data[].status` für L-1) anlegen, in `api-contracts.pg.test.ts` gegen `GET /statements?tenantId=…` prüfen und im Unit-Test verwenden. `runAction` braucht dafür eine Antwort pro URL. Für den Vertrag selbst gibt es ebenfalls keinen Vertrag (`GET /contracts/:id` mit `startDate`, `endDate`, `tenantId`). Er kann im selben Schritt dazukommen.

### L-6 (mittel) Anforderungsdokument: Widersprüche und Lücken

`docs/anforderungen-vertragsende.md`. Die Anforderungen sind gut gegliedert und meist prüfbar. Diese Stellen passen nicht:

1. **A-3.1 gegen die umgesetzte Funktion:** «Kündigung erhalten am (…), vorgeschlagen ist heute». Seit 7324c57 ist ein vergangenes Vertragsende der Normalfall der späten Erfassung (IF-3). Mit «heute» als Vorschlag liegt das Vertragsende vor dem Eingang. Der Abstand ist negativ, also «weniger als 3 Monate», und A-3.2 meldet bei jeder spät erfassten Kündigung einen falschen Fristhinweis. Ausserdem haben die Personas in Lauf I gezeigt, dass ein vorgeschlagenes «heute» übernommen wird, ohne es zu prüfen (deshalb ist das Vertragsende leer). Fix: kein Vorschlag, Feld leer. Den Hinweis nur zeigen, wenn beide Tage gesetzt sind und der Eingang vor dem Vertragsende liegt. Dazu ein Szenario «spät erfasste Kündigung: kein Fristhinweis».
2. **A-4.1 gegen A-4.4 und `src/lib/overview.ts:145,180`:** Die neue Aufgabe erscheint «ab dem Tag, an dem es erfasst ist», die bestehende Frist «Vertragsende» (60 Tage) «bleibt». In den letzten 60 Tagen nennt die Übersicht denselben Vertrag also zweimal, einmal als Aufgabe und einmal als Frist. Fix: festlegen, ob die Frist die Aufgabe ersetzt oder ob die Aufgabe in den letzten 60 Tagen die Frist übernimmt. Dazu ein Szenario, das genau einen Eintrag erwartet.
3. **A-4.1 Wortlaut:** Die Anforderung nennt «Der Mietvertrag von {Name} … Suchen Sie einen Nachmieter.», das Szenario erwartet «Nachmieter für Wohnung 2.01 suchen». Eines davon angleichen. «Nachmieter» steht nicht im Glossar und ist nicht als *(Glossar fehlt)* markiert, ebenso «Mietzinsdepot» und «Wohnungsabnahme».
4. **A-4 hängt an A-1:** «gekündigtes Vertragsende» gibt es erst mit A-1. A-4 nennt keine Voraussetzung, A-6 schon.
5. **A-2.2 gegen den Code:** A-2.1 verlangt «dieselben Regeln wie Beenden». A-2.2 verlangt für Entwürfe einen anderen Text als den, den «Beenden» heute zeigt (L-1). Nach dem Fix von L-1 ist das konsistent. Sonst ist das Dokument in sich widersprüchlich.
6. **A-2, zweites Szenario:** Es hat kein `Angenommen`. Welcher Vertrag, welche Seite? So ist es nicht ausführbar.
7. **A-1.5:** «Bestehende Verträge mit Vertragsende gelten als *vereinbart*.» Darunter fallen auch Verträge, die bis zur Umsetzung über «Beenden» gekündigt wurden. Mit A-6 bekommen sie nach Ablauf die Aufgabe «Befristeten Mietvertrag prüfen». Ohne produktive Datenbank ist das vertretbar, sollte aber dastehen.

Ohne Befund: A-2 (Problem und Regel 4 mit `*.pg.test.ts`), A-5 und A-6 sind prüfbar formuliert. Die rechtlich unsicheren Stellen sind als «fachlich prüfen» markiert. Der Abschnitt «Ebenfalls offen» stimmt mit dem Code überein (Backend löscht weiter jeden Vertrag ohne Abrechnung).

### L-7 (niedrig) Hilfe der Bestätigung: «leer» und «Ab diesem Tag»

`+page.svelte:157`: «Ab diesem Tag gilt die Wohnung als leer, wenn kein neuer Mietvertrag beginnt. Das Akonto des Mieters zählt nur bis zum Vertragsende.»
- **Leer:** Ohne laufenden oder künftigen Vertrag zeigt die Wohnung den gespeicherten Status, Leer oder Gesperrt (`apartment.service.ts:31-40`). Wurde die Wohnung früher auf Gesperrt gesetzt (z. B. Renovation vor diesem Mieter), bleibt der gespeicherte Status Gesperrt, und nach dem Beenden zeigt sie «Gesperrt», nicht «Leer». «leer» klein geschrieben ist zudem nicht als Mietstatus erkennbar. Fix: «Ab diesem Tag ist die Wohnung nicht mehr vermietet, wenn kein neuer Mietvertrag beginnt.» Oder «… hat die Wohnung den Mietstatus Leer oder Gesperrt.»
- **Zeitform:** Der Tag liegt immer in der Vergangenheit. «Seit diesem Tag gilt …» passt zum Label «ist seit dem … beendet».
- **Akonto:** Die Aussage stimmt (`calculation.service.ts:196-215`, `rentalEnd` = Vertragsende). Die Folge, die für den Vermieter zählt, fehlt aber: Die Nebenkosten ab diesem Tag trägt er selbst (Leerstand, IF-1/IF-2). Optionaler Zusatz: «Die Nebenkosten danach tragen Sie.»
- Glossar: «Mietstage» und «Akonto» stehen im Glossar. «Kündigungstermin» ist am Feld mit `TODO(fachlich prüfen)` markiert (`+page.svelte:144`) und in `offene-punkte.md` vermerkt. In Ordnung.

### L-8 (niedrig) Meldungen ohne «was tun»

- `contract-status.ts:56`: «Bitte bestätigen Sie, dass der Mietvertrag seit dem 01.04.2025 beendet ist.» Die Bestätigung soll auch einen Tippfehler im Jahr auffangen (`contract-status.test.ts:56`). Die Meldung bietet aber nur das Ankreuzen an. Fix: «… Stimmt das Datum nicht, korrigieren Sie das Vertragsende.»
- `+page.server.ts:166-169`: «Ein Mietvertrag, der begonnen hat, kann nicht gelöscht werden: Die Nebenkostenabrechnung braucht seine Mietstage.» Die Meldung erscheint nur bei einer veralteten Seite: Der Vertrag war gestern künftig, heute hat er begonnen. Dann steht sie im Dialog unter dem alten Text «… hat noch nicht begonnen und wird endgültig gelöscht.», und der Knopf bleibt aktiv, weil `update()` bei einem Fehler nicht neu lädt. Fix: den Satz aus dem Dialog übernehmen («Ist er falsch erfasst, korrigieren Sie ihn unter «Bearbeiten».») oder «Laden Sie die Seite neu.» ergänzen.

### L-9 (niedrig) Veraltete Doku und Kommentare

- `docs/design/offene-punkte.md:261` nennt weiter «a future contract entered by mistake cannot be deleted without an end» und «the backend and the BFF delete action still delete a running contract, the rule is in the dialog only (review I, J-6)». Beides stimmt nicht mehr: Künftige Verträge sind löschbar, und die BFF-Aktion prüft (`+page.server.ts:165`). Das widerspricht dem neuen Eintrag zwei Zeilen darüber (`:258`). Fix: beide Teilsätze streichen bzw. auf «the backend API» kürzen.
- `tests/e2e/features/contract-detail.feature:64`: Der Kommentar «Gekündigt, aber noch laufend: gelöscht werden kann er erst nach dem Vertragsende» widerspricht der neuen Regel. Fix: «Gekündigt, aber noch laufend: er hat begonnen und bleibt».
- `tests/a11y/screens.json:12`: `end-dialog-error` heisst noch «with a Vertragsende before today: the error at the field». Die Interaktion (`interactions/accessibility.ts:155-160`) tippt 31.01.2024 bei einem Vertrag ab 2015. Das ist jetzt ein erlaubter vergangener Tag. Der Zustand zeigt deshalb den Fehler an der Bestätigung und nicht mehr am Feld. Die neue Checkbox ist so zufällig im Axe-Lauf abgedeckt, der Feldfehler nicht mehr. Fix: Beschreibung anpassen («… a past Vertragsende confirmed nowhere: the error at the confirmation»). Für den Feldfehler einen zweiten Zustand vorsehen (leer bestätigen), mit Zeile in `accessibility.feature`.
- `src/__tests__/contract-actions.test.ts:54`: «auch ohne JavaScript». Ohne JavaScript öffnet sich der Dialog nicht (K-7). Fix: «Absicherung, falls der Dialog umgangen wird».

### L-10 (niedrig) Kleinere Lücken

- **Ungültiges Datum in der Aktion:** `contractEndError` prüft nur das Muster `\d{4}-\d{2}-\d{2}`. Bei `endDate=2025-13-01` ohne `pastConfirmed` ruft `pastEndConfirmation` → `endedSince` → `toISOString()` auf und wirft `RangeError: Invalid time value` (mit Node geprüft). Ergebnis: 500 statt 400. `2025-02-30` ergibt «seit dem 03.03.2025». Erreichbar nur mit einer gebauten Anfrage, denn `DateInput` liefert nur echte Tage. Fix: in `contractEndError` auch die Gültigkeit prüfen, z. B. `parseSwissDate(formatDate(endDate))` oder ein Vergleich nach dem Rundweg über `Date`.
- **Commit-Subject:** «feat(contracts): end in the past, keep started ones» (7324c57) hat 51 Zeichen, CLAUDE.md erlaubt höchstens 50. Schon versioniert, nur für künftige Commits.
- **BFF-Proxy:** `src/routes/api/contracts/[id]/+server.ts:37-44` leitet `DELETE` ungeprüft ans Backend weiter. Aus der App wird er nicht aufgerufen, er ist aber erreichbar und umgeht die Regel «nur vor Vertragsbeginn». `offene-punkte.md:258` nennt nur «the backend API». Fix: den Handler entfernen (ungenutzt) oder die Ausnahme dort vermerken.
- **Tests:**
  - `contract-detail-page.dom.test.ts` «fragt bei heute und späteren Tagen nicht nach einer Bestätigung» prüft nur den 31.03.2027, nicht heute (`2026-10-10`). Die Prüfung `toBeNull()` ist nicht verankert, denn ohne die Änderung gab es die Box nie, und der Test wäre auch dann grün. Fix: zusätzlich heute prüfen und vorher positiv verankern, z. B. dass der Tag in Worten (`formatDateLong`) neben dem Feld sichtbar ist.
  - Kein Unit-Test für `endedSince` an Monats- und Schaltjahresgrenzen. Die Logik stimmt (siehe oben), der Test fehlt.
  - Kein Test für erneutes Öffnen nach angekreuzter Bestätigung (siehe L-4).
  - Die übrigen neuen Tests scheitern ohne die Änderung: neue Meldungstexte, `pastConfirmed` im Formular, Toast «ist seit dem … beendet», 409 bei Abrechnung (der zweite Eintrag `c2` mit späterem `periodEnd` sichert den Filter nach `contractId`), Löschen nur künftig (`it.each` über ohne Ende, künftiges und vergangenes Ende). Die negativen Prüfungen auf `PUT`/`DELETE` folgen auf ein geprüftes `fail`. Die Szenarien prüfen «ist der Mietvertrag unbefristet» erst nach der Meldung im Dialog. In Ordnung.

## Ohne Befund

- **Löschen:** Dialog (`disabled={status !== 'future'}`) und Aktion (`startDate <= localToday()` → 409) stimmen überein. Ein Vertrag, der heute beginnt, gilt als begonnen, wie in `contractStatusOn`. Die Aktion lädt den Vertrag vorher. Ein 404 geht als `fail(404)` zurück, eine Ablehnung des Backends (Abrechnungen, `deleteContract`) als `fail(status)` mit Meldung im Dialog. Die Mieterseite («Mieter mit Mietverträgen bleiben erhalten») widerspricht der neuen Regel nicht. Die Wohnungslöschung kaskadiert beendete Verträge ohne Abrechnung (`schema.ts`, `onDelete: 'cascade'`), hat aber keine Oberfläche. PRD und API-Spezifikation legen keine Löschregel für Verträge fest, die jetzt widersprochen würde.
- **Beenden:** Reihenfolge der Aktion: Laden → 409 bei vorhandenem Ende → Format und Vertragsbeginn → Bestätigung → Abrechnungen → `PUT`. Die Prüfung im Client und in der Aktion verwendet dieselben Funktionen. Ein künftiges Vertragsende braucht keine Bestätigung, ein Ende heute auch nicht (der Vertrag ist bis und mit heute laufend).
- **A11y:** Die Checkbox hat ein sichtbares Label und Hilfe. `aria-describedby` verweist auf Hilfe und Fehler, `aria-invalid` ist gesetzt (`Checkbox.svelte:30-35`). `focusFirstError` findet sie über `input[aria-invalid="true"]` und verschiebt den Fokus vom Bestätigen-Knopf auf die Box, also ein echter Fokuswechsel, der angesagt wird. Die Fläche ist mit `min-h-12` mindestens 48 px hoch. Nur Token-Klassen.
- **Copy:** «Sie», «ss», kurze Sätze, Verben auf den Knöpfen. Die Glossarbegriffe Mietvertrag, Vertragsende, Vertragsbeginn, Nebenkostenabrechnung, Mietstage und Akonto sind richtig verwendet.
- **Formales:** Conventional Commits. `implementation_plan.md` und `design-decisions.md` sind nachgeführt. Prettier und ESLint sind sauber.
