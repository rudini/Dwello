# Code-Review 521, Runde 1 (c9b8e27..45d9cdc, Worktree /tmp/scratchpad/review-521-code-reviewer)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/routes/contracts/[id]/consent-letter/+server.ts:9 | Die Ablehnung `CONSENT_LETTER_NONE` (und 404) kommt als rohes Backend-JSON beim Verwalter an, wegen `attachment` und `download` als gespeicherte Datei. `backend_consent_letter_none` wird nirgends angezeigt. Für den Zustand gibt es weder Szenario noch Zeilen in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. |
| C-2 | Minor | backend/src/services/consent-letter.service.ts:22, messages/de.json:1887 (und fr/it/en) | `CONSENT_LETTER_NONE` kommt auch dann, wenn die Abrechnungsperiode gewechselt hat, die kurze Periode aber nicht mehr offen ist (eigene Abrechnung darüber, `open` false) oder der Mietvertrag dort keine Mietstage hat. In diesen Fällen ist der Satz «Die Abrechnungsperiode hat … nicht gewechselt» falsch. |
| C-3 | Minor | backend/src/services/accounting-period.ts:329 | Die Bedingungen `open` und `way.start === earlier.switched` in `consentPeriod` hat kein Test. Entfernt man eine davon, bleiben alle Tests grün. Fachreview 521-1 Abschnitt 4 verlangt die Ablehnung mit Code auch für «Mietvertrag hat keine kurze Periode» (früherer Typ bekannt). Der pg-Test prüft nur den Fall ohne früheren Typ. |
| C-4 | Minor | backend/src/services/consent-letter.ts:120 | `swissDate` kopiert `formatSwissDate` (backend/src/services/pdf-format.ts:4), das der Service in derselben Änderung schon importiert. |
| C-5 | Minor | backend/src/services/consent-letter.service.ts:39, consent-letter.ts:144 | Der Dateiname ist fest deutsch («Zustimmung-Abrechnungsperiode-…»). `consentLetter` gibt `title` in der Sprache des Mieters zurück, niemand verwendet ihn. Die Mahnung bildet ihren Dateinamen aus `letter.title` (reminder.service.ts:151). Ein Mieter mit fr/it/en erhält einen Brief in seiner Sprache, aber unter deutschem Namen. |

## C-1 (Major): Ablehnung des Briefs zeigt kein Wort für den Verwalter

**Warum falsch:** `proxyFile` (src/lib/server/file-proxy.ts) reicht Status und Body unverändert weiter. Fehlt der Content-Disposition-Header, setzt es `attachment`. Bei 409 bekommt der Browser `{"error":"…","code":"CONSENT_LETTER_NONE"}` als Download, denn der Link hat `download` (MissingStatement.svelte:86, OverlapWays.svelte:47). Er zeigt keine Seite.
- CLAUDE.md, Konventionen: eine Backend-Ablehnung, die die UI zeigt, erscheint mit `backendMessage()`. Die Meldung `backend_consent_letter_none` ist in allen vier Sprachen da, aber kein Code ruft sie auf (`grep -rn CONSENT_LETTER_NONE src` findet nichts). Sie ist also toter Text.
- CLAUDE.md, Design-Regeln «Process» verlangt eine Zeile in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. Gemeint ist eine Seite, die eine `+server.ts`-Route beantwortet, etwa eine Ablehnung, die man in einem Tab öffnet.
- tests/e2e/CLAUDE.md «Failure states» verlangt ein Szenario.

Der Zustand ist erreichbar:
- über eine veraltete Seite des Mietvertrags, z.B. wenn die kurze Periode inzwischen abgerechnet ist, oder wenn im Assistenten in einem zweiten Tab etwas geändert wurde;
- über die eingetippte Adresse.

Das Muster dafür gibt es schon: `src/routes/api/statements/[id]/pdf/+server.ts` mit `pdfRefusal` aus `src/lib/server/statement.ts:259`, und der Zustand `statement-pdf-refused` in `screens.json`.

**So zeigt man, dass es scheitert:** Aufbau des V-1-Szenarios, dann `/contracts/<id>/consent-letter` direkt öffnen. Statt eines Satzes lädt der Browser eine JSON-Datei herunter. Ein E2E-Szenario mit diesem Aufbau («öffnet den Brief zur Zustimmung direkt» → «sagt die Seite "Für diesen Mietvertrag gibt es keinen Brief zur Zustimmung …"») ist auf 45d9cdc rot.

**Fix:** Die Route antwortet bei einem Status ungleich 200 mit `pdfRefusal(status, body)`, wie die PDF-Route der Abrechnung. Dazu ein Szenario und je eine Zeile in den drei Dateien für den Zustand.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`; Backend-Tests consent-letter (unit, pg), accounting-period, statement-run (unit, pg), api-contracts.pg, Mahnungstests (284 pass); `bunx vitest run --changed origin/main` (906 pass) und die Tests, die geänderte Dateien lesen (1114 pass); E2E chromium contract-detail + statement-generate (156 pass); accessibility und sprachen-bildschirme vollständig auf chromium (604 pass); Prettier auf den neuen Dateien. Firefox/WebKit-E2E und die ganze Backend-Suite mit Coverage liefen nicht.
- Hinweis (2) des Umsetzers: Der Link auf der Seite des Mietvertrags steht nur bei `firstShort`, so wie Fachreview 521-1 Abschnitt 3 es vorgibt. Gibt es nach dem Wechsel eine spätere kurze Periode (eine Abrechnung des Gebäudes deckt nur einen Teil einer späteren Periode), dann markiert das Backend `consent` bei einem Teil, den die UI nie zeigt. Den Brief gibt es dann nur noch im Assistenten. Abschnitt 3 entscheidet diesen Fall nicht; dafür braucht es eine fachliche Entscheidung, keinen Codebefund. Nachgesehen: MissingStatement.svelte:42, statement-run.service.ts:122-131.
- Hinweis (3): Fachreview 521-1 legt weder den Wortlaut von `backend_consent_letter_none` in den vier Sprachen fest noch den Dateinamen. Ob die Begriffe passen, prüft der `fach-reviewer` in Schritt 5. Zur inhaltlichen Ungenauigkeit siehe C-2, zur Sprache des Dateinamens C-5.
- Das V-1-Szenario «Ohne Wechsel der Abrechnungsperiode …» ist auf der Basis grün, wie die Commit-Nachricht von e26b1c9 sagt. Es hat einen positiven Anker (Rat ab 2024-10-01). Rot werden kann nur der unterste Test (pg 409, Unit `consentPeriod` null). Ob jemand die negative Prüfung durch Entfernen der Bedingung `consent ?` (+page.server.ts:87) rot gesehen hat, ist nicht belegt.
- Ob `drift` in api-contracts.pg das Element von `overlap.consent` in `tests/contracts/statement-run.json` wirklich vergleicht, wenn die echte Antwort ein leeres Array liefert: nicht gelesen. Der Aufrufer meldet den Test grün.

Geprüft: Wortlaut de/fr/it/en des Briefs gegen Fachreview 521-1 Abschnitt 2 (gleich lautend), Bedingung aus V-1 über `earlierType`, V-2 über `billsIn`/`missingWays`, V-3, M-1, M-2, Frist +30 Tage, Absender und Empfänger wie bei der Mahnung, Texte in allen vier `messages/*.json` (FR mit geschütztem Leerzeichen vor «:»), `data-testid`, Screenplay-Schichten, neue Zustände in screens.json und in beiden Features, API-Verträge, Authentifizierung über `handleFetch`, Tokens/Komponenten (`Button` mit `download`).
