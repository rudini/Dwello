# Review I, Runde 1 – Mietvertrag auf einen gewählten Tag beenden

Unabhängiges Code- und UX-Review von 9be27ec («feat(contracts): end a contract on a chosen day»). Gelesen: Diff, `ActionDialog`, `FormDialog`, `dialog-submit.ts`, `DateInput`, `Dialog`, `Field`, `contract-status.ts`, die Seite und Aktion `contracts/[id]`, Backend `contract.service.ts` / `routes/contracts.ts` / `apartment.service.ts`, Migration `0001_schema.sql`, Übersicht (`overview.ts`, `dashboard/+page.server.ts`), E2E-Feature und Schritte. Ausgeführt: `contract-status`, `contract-actions`, `contract-detail-page.dom`, `ui-action-dialog.dom`, `tenant-detail-page.dom` (43 Tests grün). E2E nicht ausgeführt.

Kein kritisches Finding. Der Refactor erhält das Verhalten beider Dialoge. Ein Finding «hoch»: Ein beendeter, aber noch laufender Mietvertrag lässt sich löschen.

## Übersicht

| # | Schwere | Finding |
|---|---|---|
| I-1 | hoch | Laufender Mietvertrag mit künftigem Vertragsende lässt sich löschen |
| I-2 | mittel | Künftiger Mietvertrag: der vorgeschlagene Tag (heute) ist immer falsch |
| I-3 | mittel | Server-Aktion prüft den Vertragsbeginn aus dem Formular, nicht den gespeicherten |
| I-4 | mittel | Tests: Felder im Formular, Toast «endet am …», «sendet nichts», künftiger Vertrag ungeprüft |
| I-5 | niedrig | Abgelehnt vom Server: Meldung unten im Dialog statt am Feld, bleibt nach dem Schliessen stehen |
| I-6 | niedrig | Server-Prüfung ohne Formatprüfung (String-Vergleich) |
| I-7 | niedrig | `redirected` wird beim Mounten gelesen, vorher beim Aufruf |
| I-8 | niedrig | Copy: «gekündigt» nicht im Glossar; nur Kündigung durch den Mieter genannt; Folge «Beenden verschwindet» nicht genannt |
| I-9 | niedrig | Kalender ohne `min`; Fehlerzustand nicht in `screens.json` |
| I-10 | niedrig | (vorbestehend) «heute» im Backend in UTC, im Frontend in Europe/Zurich |

## Findings

### I-1 (hoch) Laufender Mietvertrag mit künftigem Vertragsende lässt sich löschen

`src/routes/contracts/[id]/+page.svelte:146` – der Löschdialog ist nur gesperrt, solange `contract.endDate` fehlt. Vorher setzte «Beenden» immer heute, das Fenster war ein Tag. Jetzt geht dies: Beenden auf den 31.03.2027 (Status bleibt «Laufend», Mieter wohnt noch), dann «Löschen» → «Der Mietvertrag von … wird endgültig gelöscht» → der Vertrag ist weg. Für die Abrechnung nach dem Auszug fehlt er dann. Der Löschdialog führt sogar dorthin («Beenden Sie ihn zuerst»). Das widerspricht dem Szenario «Aktiver Mietvertrag kann nicht gelöscht werden» (`contract-detail.feature:43`), das nur den Fall ohne Vertragsende prüft.

Fix: Löschen erst bei `status === 'ended'` (oder `status !== 'active'`, falls künftige Verträge löschbar bleiben sollen). Im Dialog den Grund nennen: «Der Mietvertrag läuft noch bis TT.MM.JJJJ. Löschen können Sie ihn erst danach.» Test zuerst: ein DOM-Test mit `open('2024-04-01', '2099-12-31')` erwartet einen gesperrten Bestätigen-Button, dazu ein Szenario «Laufender Mietvertrag mit Vertragsende kann nicht gelöscht werden». Ob das Backend dieselbe Regel braucht (`deleteContract` prüft nur Abrechnungen), ist eine eigene Frage.

### I-2 (mittel) Künftiger Mietvertrag: der vorgeschlagene Tag ist immer falsch

`+page.svelte:35,38` schlägt immer `data.today` vor. Bei einem künftigen Vertrag (Vertragsbeginn 01.11.2099) meldet ein Klick auf «Mietvertrag beenden» ohne Änderung sofort «Das Vertragsende kann nicht vor dem Vertragsbeginn am 01.11.2099 liegen.». Für die Zielgruppe wirkt ein Vorschlag, den die App selbst ablehnt, wie ein Fehler der App.

Fix: den spätesten der beiden Tage vorschlagen, `endDate = contract.startDate.slice(0, 10) > data.today ? contract.startDate.slice(0, 10) : data.today`. Dazu ein DOM-Test «schlägt bei einem künftigen Mietvertrag den Vertragsbeginn vor». Der Toast-Zweig «endet heute» bleibt richtig.

### I-3 (mittel) Server-Aktion prüft den Vertragsbeginn aus dem Formular

`src/routes/contracts/[id]/+page.server.ts:102` nimmt `startDate` aus dem Formular (`fields` in `+page.svelte:120`). Ein Formular ohne oder mit falschem `startDate` (veraltete Seite nach «Bearbeiten» in einem zweiten Tab, eigene Anfrage) besteht die Prüfung: `endDate < ''` ist nie wahr. Die Daten bleiben trotzdem richtig, denn `contracts_dates_check` (`backend/migrations/0001_schema.sql:86`) lehnt `end_date < start_date` ab und `updateContract` antwortet dann mit 400. Der Benutzer sieht aber nur «Mietvertrag konnte nicht beendet werden.» statt des Grunds. Überschneidungen mit anderen Verträgen der Wohnung können nicht entstehen: Ein Vertrag ohne Vertragsende wird nur kürzer, und `checkContractOverlap` (`contract.service.ts:301-315`) prüft trotzdem. Die Aussage «again in the server action» stimmt also nur für «vor heute».

Fix (eine der beiden Varianten): (a) In der Aktion den Vertrag laden (`GET /api/v1/contracts/:id`, den Aufruf gibt es schon in `load`) und dessen `startDate` verwenden, `startDate` dann aus `fields` streichen. (b) Ehrlicher und kürzer: `startDate` aus dem Formular entfernen, die Prüfung «vor Vertragsbeginn» nur im Dialog machen und eine Backend-Ablehnung der DB-Regel in eine verständliche Meldung übersetzen. Test: ein Aktionstest mit `startDate` aus einem anderen Vertrag als dem gespeicherten.

### I-4 (mittel) Lücken in den Tests

Die neuen Tests scheitern ohne die Änderung; geprüft für `contractEndError`, die Aktion (vor heute → 400, kein Backend-Aufruf), Dialogfeld und Vorschlag sowie die beiden Szenarien. Es fehlen:

- **Felder im Formular:** Kein Unit-Test prüft, dass `endDate` und `startDate` in `formData` landen. Die `enhance`-Mocks übergeben inzwischen ein `FormData` (`contract-detail-page.dom.test.ts:4-12`), der Test liest es aber nicht. Ein `ActionDialog`, der `fields` verliert, fiele erst im E2E auf. Fix: im DOM-Test nach `click('contract-end-confirm')` das übergebene `FormData` prüfen (`endDate` = `'2026-10-10'`), oder in `ui-action-dialog.dom.test.ts` einen Test für `fields` und `check` schreiben (`check` → false sendet nicht).
- **«sendet nichts»** (`contract-detail-page.dom.test.ts:118`): Der Test prüft nur die Meldung, nicht dass `requestSubmit` ausblieb. Fix: `vi.spyOn(HTMLFormElement.prototype, 'requestSubmit')` und `not.toHaveBeenCalled()`.
- **Toast:** Weder «endet heute» noch «endet am 31.12.2099» ist getestet. Fix: mit `answer('success')` nach dem Muster von `redirectAfter` den Toast-Text prüfen.
- **Künftiger Vertrag:** Ein Unit-Test für die Regel existiert, ein Dialog- oder Szenariotest nicht (siehe I-2).
- **Aktion, Vertragsbeginn und fehlendes Datum:** nur in der reinen Funktion getestet, nicht in `actions.end` (siehe I-3).
- **Szenario «Vertragsende in der Vergangenheit»:** Es prüft die Meldung, aber nicht, dass nichts gespeichert wurde. Fix: nach Schliessen des Dialogs «Und der Mietvertrag ist unbefristet» (bzw. kein Vertragsende) – mit positivem Anker, wie `tests/e2e/CLAUDE.md` verlangt. Der Locator `getByRole('dialog').getByTestId('form-error')` (`interactions/contract-detail.ts:10`) trifft Feldfehler und Server-Alert gleichermassen und verletzt Playwrights strict mode, sobald beide sichtbar sind. Fix: den Feldfehler über das Feld ansprechen (`aria-describedby`) oder dem Alert eine eigene testid geben.

### I-5 (niedrig) Abgelehnt vom Server: Meldung unten im Dialog, bleibt nach dem Schliessen stehen

`+page.svelte:119` / `ActionDialog.svelte:69-71`. Lehnt die Aktion ab (z. B. der Dialog war über Mitternacht offen: der Client prüft gegen das alte `data.today`, der Server gegen das neue), erscheint «Das hat nicht geklappt – Das Vertragsende kann nicht vor heute liegen …» als Alert unter dem Feld. Das Feld selbst ist nicht als fehlerhaft markiert und zeigt weiter den alten Vorschlag. `startEnding` löscht nur `endError`, nicht `form.endError`. Wer danach den Dialog schliesst und wieder öffnet, sieht deshalb die alte Meldung zum neuen Vorschlag. Dasselbe gilt für den Löschdialog, dort aber gewollt (`deleting` startet offen). Fix: die Antwort `fail(400, { endError })` aus der Regel am Feld zeigen (`error={endError || form?.endError}`) und beim Öffnen `form` ignorieren, etwa mit einem Flag, das `startEnding` zurücksetzt. Die Meldung des Backends «Mietvertrag konnte nicht beendet werden.» sagt nicht, was zu tun ist (vorbestehend).

### I-6 (niedrig) Server-Prüfung ohne Formatprüfung

`src/lib/contract-status.ts:39-46` vergleicht beliebige Strings. `"abc"` oder `"2026-1-5"` gelten als «heute oder später» und gehen ans Backend, das sie wegen `format: 'date'` ablehnt → generische Meldung. Vom Dialog kommt immer ISO oder leer, deshalb nur ein Härtungspunkt. Fix wie bei `paidDateError` (`src/lib/statement.ts:33-38`): `/^\d{4}-\d{2}-\d{2}$/` statt nur `!endDate`. Das macht beide Regeln auch einheitlicher.

### I-7 (niedrig) `redirected` wird beim Mounten gelesen

`src/lib/ui/ActionDialog.svelte:53`, `src/routes/statements/[id]/FormDialog.svelte:127`. Vorher riefen beide `onsuccess?.()` / `ondone?.()` beim Redirect über den Prop zum Zeitpunkt des Aufrufs auf. Jetzt wird die Funktion beim Mounten an `dialogSubmit` übergeben. `enhance` hat kein `update`, die Svelte-Action behält also die erste Funktion. Heute harmlos: alle Aufrufer übergeben Pfeilfunktionen, die ihren Zustand beim Aufruf lesen. Eine Prop, die die Funktion austauscht, würde aber still die alte rufen. Fix: `() => onsuccess?.()` bzw. `() => ondone?.()` übergeben, wie schon bei `fields`.

Sonst behält `dialogSubmit` das alte Verhalten genau bei. Reihenfolge Redirect-Callback → `await update()` → `busy=false` → Ergebnis; `busy` bleibt bis nach `update()`. ActionDialog bleibt bei Ablehnung offen und zeigt den Fehler, FormDialog schliesst immer. Toast und Fokus auf `h1` nach `tick()` sind unverändert, das `await answered(...)` läuft synchron an derselben Stelle wie vorher. `fields={}` als Vorgabe ändert für den zweiten Aufrufer von `ActionDialog` (`src/routes/tenants/[id]/+page.svelte`, Löschen) nichts.

### I-8 (niedrig) Copy

`+page.svelte:133`: «… zum Beispiel der Tag, auf den der Mieter gekündigt hat.»
- «Kündigung/gekündigt» steht nicht in `UBIQUITOUS_LANGUAGE.md`. Nach den Design-Regeln braucht ein fehlender Begriff `TODO(fachlich prüfen)` und einen Eintrag in `docs/design/offene-punkte.md`; beides fehlt.
- Nur die Kündigung durch den Mieter ist genannt. Vermieterkündigung und Aufhebungsvereinbarung fehlen. Vorschlag: «zum Beispiel der Tag, auf den gekündigt wurde».
- Der Dialog nennt nicht, dass «Beenden» danach verschwindet und ein anderes Vertragsende nur unter «Bearbeiten» geht (Wizard, `PeriodStep` mit `min=startDate`; dort ist auch ein früheres Datum möglich). Die Fehlermeldung nennt «Bearbeiten», der Normalfall nicht. Vorschlag für den Hilfetext: «Ändern können Sie es danach unter «Bearbeiten».»
- Gut: «Sie», «ss», «Bis und mit», Glossarbegriffe Vertragsende/Vertragsbeginn. Die Fehler sagen, was passiert ist und was zu tun ist. Label über dem Feld, Hilfe sichtbar am Feld, Fokus auf das Feld mit dem Fehler (`checkEndDate`, wie `checkPaidDate`).
- Konsistenz mit «Als bezahlt markieren»: gleiches Muster (`DateInput`, `check`, `flushSync`, `focusFirstError`). Abweichungen: Der Vorschlag kommt hier vom Server (`data.today`), dort vom Client (`localToday()`). Der Leer-Fehler lautet hier «Bitte geben Sie das Vertragsende ein.», dort «… als TT.MM.JJJJ ein.». Bei Ablehnung bleibt dieser Dialog offen, der Zahlungsdialog schliesst. Die Abweichungen sind vertretbar, ausser dass der Leer-Fehler gleich lauten sollte.

### I-9 (niedrig) Kalender ohne `min`, Fehlerzustand ohne axe

`+page.svelte:130-137`: `DateInput` erhält kein `min`, der Kalender bietet vergangene Tage an, die dann abgelehnt werden. Fix: `min={max(data.today, startDate)}`, derselbe Wert wie der Vorschlag aus I-2. `tests/a11y/screens.json:11` kennt `end-dialog` nur offen ohne Fehler. Der neue Fehlerzustand am Feld (Fehler plus `aria-describedby`) läuft nicht durch axe. Vorschlag: Zustand `end-dialog-error` aufnehmen.

### I-10 (niedrig, vorbestehend) «heute» in zwei Zeitzonen

Frontend und Aktion nutzen `localToday()` (Europe/Zurich). Das Backend nutzt UTC: `listContracts` (`backend/src/services/contract.service.ts:86`, `toISOString`) und `apartmentStatus` (`apartment.service.ts:32-40`, `current_date` der DB-Session). Mit einem künftigen Vertragsende wird die Grenze sichtbar. Am Tag nach dem Vertragsende zeigt das Detail zwischen 00:00 und 02:00 (Sommer) «Beendet», die Wohnung bleibt «vermietet» und der Vertrag steht noch unter «Laufend». Auch die Übersicht «Vertragsende» (`dashboard/+page.server.ts:92,116`, `status=active`) führt den Vertrag mit «seit 1 Tag». Der Filter `days >= 0` in `overview.ts:177` blendet ihn aus, er erscheint also nicht falsch. Kein Fehler dieses Commits; ein eigener Task «heute im Backend in Europe/Zurich» lohnt sich.

## Ohne Befund

- Datumsvergleich als `YYYY-MM-DD`-String: korrekt, solange beide Seiten ISO sind (siehe I-6). `startDate.slice(0, 10)` deckt Zeitstempel ab.
- Backend: `endDate < startDate` wird durch `contracts_dates_check` abgelehnt (400). Überschneidungen werden bei jedem Datumsupdate geprüft (`updateContract`), durch Kürzen entstehen keine.
- Ein Vertrag mit künftigem Vertragsende bleibt «Laufend» (`contractStatusOn`, Szenario). Die Wohnung bleibt bis und mit Vertragsende «vermietet», der Mieter bleibt aktiv. Die Übersicht zeigt das Vertragsende im Fenster `CONTRACT_END_WINDOW_DAYS`; das wird mit diesem Commit erst richtig nützlich.
- «Beenden» verschwindet, sobald ein Vertragsende gesetzt ist. Ändern geht über «Bearbeiten».
- Der Kommentar «auch ohne JavaScript geprüft» (`contract-actions.test.ts:41`) ist etwas zu stark. Ohne JavaScript öffnet sich der Dialog gar nicht (`onclick`). Die Server-Prüfung ist Absicherung, kein Weg ohne JavaScript.
