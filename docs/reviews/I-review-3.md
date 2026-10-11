# Review I, Runde 3 – Mietvertrag auf einen gewählten Tag beenden

Unabhängiges Review von `git diff origin/main...HEAD` (9be27ec, 7b9971a, 8286701) mit Schwerpunkt auf 8286701 («fix(contracts): review I-2 and personas run I»). Gelesen: Diff, `contracts/[id]/+page.svelte` und `+page.server.ts`, `contract-status.ts`, `ActionDialog`, `Dialog`, `DateInput`, `Field`, `focus-error.ts`, `dialog-submit.ts`, `statements/[id]/FormDialog.svelte`, die Tests, Szenarien, E2E-Tasks und `fixtures/dates.ts`, dazu `I-review-1.md`, `I-review-2.md`, `helga-i.md`, `sven-i.md`, `anna-i.md`, `offene-punkte.md` (Session 12) und `design-decisions.md`. Ausgeführt: `contract-detail-page.dom`, `contract-actions`, `contract-status`, `ui-action-dialog.dom`, `tenant-detail-page.dom`, `focus-error.dom` (56 Tests grün), Prettier und ESLint auf den geänderten Dateien (sauber). E2E und Build nicht ausgeführt.

**Ergebnis:** Kein kritisches und kein hohes Finding. Alle Findings «hoch» und «mittel» aus Runde 1 und 2 sind behoben. Drei neue Findings «mittel»:

- Die E2E-Task `endContract` legt «heute» schon beim Laden des Moduls fest.
- Der Blur-Trick ändert für den Screenreader nichts gegenüber dem bisherigen Verhalten. Sven-Major «Fehler nach Enter stumm» ist deshalb nicht glaubhaft behoben.
- Ein laufender Mietvertrag, der irrtümlich erfasst wurde, führt in eine Sackgasse.

## Stand der früheren Findings

### Review I, Runde 1 und 2

| # | Schwere | Stand |
|---|---|---|
| I-1 | hoch | Behoben. `disabled={status === 'active'}` (`+page.svelte:153`): Ein laufender Vertrag, auch mit künftigem Ende, ist gesperrt. DOM-Test (`open('2024-04-01', '2027-03-31')`) und Szenario (`contract-detail.feature:50`) |
| I-2 | mittel | Überholt. Es wird kein Tag mehr vorgeschlagen, `min={earliestEnd}` bleibt (`:36,140`) |
| I-3 | mittel | Behoben (Runde 2). Die Aktion liest den Vertragsbeginn beim Backend (`+page.server.ts:102-111`) |
| I-4 | mittel | Behoben (Runde 2) |
| J-1 | mittel | Behoben. Ein künftiger Vertrag ist löschbar: DOM-Test «lässt einen künftigen Mietvertrag löschen», Szenario «Künftigen Mietvertrag löschen» (`feature:59`), Entscheidung in `design-decisions.md` (Session 12) |
| J-2 | niedrig | Behoben: 409 bei schon gesetztem Vertragsende (`+page.server.ts:107-110`), Test ohne `PUT` |
| J-3 | niedrig | Behoben: `fail(stored.status, …)` (`:103-104`), Test 404 ohne `PUT` |
| J-4 | niedrig | Behoben: Die Vorbedingung läuft über die API (`feature:51-53`) |
| J-5 | niedrig | Testname behoben. Der Kommentar `contract-actions.test.ts:49` («auch ohne JavaScript geprüft: … geht nicht ans Backend») stimmt weiter nicht (siehe K-7) |
| J-6 | niedrig | Vermerkt in `offene-punkte.md:255` |
| J-7 | niedrig | Behoben (`FormDialog.svelte:55`) |
| J-8 | niedrig | Behoben (Prettier sauber) |

### Persona-Majors, die diesen Dialog betreffen

| Persona | Major | Stand |
|---|---|---|
| Helga F1/S1, Sven, Anna R1 | Vorschlag «heute» beendet aus Versehen | Behoben: Das Feld startet leer, leer → «Bitte geben Sie das Vertragsende ein …» |
| Helga S1 (2. Teil) | Vor dem Speichern die Folge nennen («Ab 01.04.2027 gilt die Wohnung als leer») | Weder umgesetzt noch vermerkt (K-6) |
| Helga V1/F2/S2/S3, V2/S4, F3/S5 | Wizard «Befristet», Ende in der Vergangenheit ohne Rückfrage, Vertragsende auf Wohnung/Mieter, Übersicht | Vermerkt (`offene-punkte.md:255`) |
| Helga V5/S7, Anna V2/S3 | Löschdialog «Danach können Sie ihn löschen» | Behoben (neuer Text). Rest: K-4 |
| Anna R2 | Beendeten Vertrag vor der Abrechnung löschen | Teilweise. Der Grund steht nur dort, wo Löschen ohnehin gesperrt ist (K-4) |
| Anna V1/S1, V3, S2 | Übersicht, Mietstatus-Widerspruch, «was jetzt» | Vermerkt |
| Sven | Fehler nach Enter im Feld nicht angesagt | **Als behoben vermerkt, aber nicht wirksam** (K-2) |
| Sven | Fehler steht in `aria-describedby` hinter der langen Hilfe | Gemildert, weil die Hilfe kürzer ist. Die Reihenfolge ist unverändert und für diesen Dialog nicht vermerkt (K-6) |
| Sven | Tab-Reihenfolge, Fokus beim Öffnen auf «Abbrechen» | Vermerkt (Dialog-Komponente) |

## Übersicht neue Findings

| # | Schwere | Finding |
|---|---|---|
| K-1 | mittel | E2E: `endContract` legt «heute» beim Laden des Moduls fest. Flake über Mitternacht |
| K-2 | mittel | Der Blur-Trick ist wirkungsgleich mit dem bestehenden `focusFirstError`. Sven-Major nicht glaubhaft behoben, Vermerk falsch |
| K-3 | mittel | Ein irrtümlich erfasster laufender Mietvertrag: Der Löschdialog weist nur auf «Beenden» hin, eine Sackgasse |
| K-4 | niedrig | Löschdialog: Den Grund «für die Nebenkostenabrechnung behalten» nennt nur der gesperrte Zweig. «gekündigt» hat keine Markierung |
| K-5 | niedrig | Beispieldaten in der Vergangenheit widersprechen der Regel «nicht vor heute» |
| K-6 | niedrig | Zwei Persona-Majors weder umgesetzt noch vermerkt |
| K-7 | niedrig | Kleinere Testlücken, überholter Kommentar |

## Findings

### K-1 (mittel) `endContract` legt «heute» beim Laden des Moduls fest

`tests/e2e/tasks/contract-detail.ts:30`: `export const endContract = endContractOn(inDays(0));`. Das Datum wird ausgewertet, wenn das Modul geladen wird, also wenn der Playwright-Worker die Steps importiert. Der Schritt läuft erst später. Startet ein Lauf vor Mitternacht (Europe/Zurich) und erreicht er «Mietvertrag beenden» danach, tippt der Task gestern. Der Dialog meldet dann «Das Vertragsende kann nicht vor heute liegen.», und `endet der Mietvertrag heute` (`contract-detail.steps.ts:83-86`, rechnet zur Laufzeit) scheitert. Das Fenster ist die ganze Zeit vom Start des Workers bis zu diesem Schritt, nicht nur ein paar Millisekunden. Alle anderen Aufrufe von `inDays` (`dashboard.steps.ts:27,45`, `documents.steps.ts:80,84`) rechnen erst im Schritt.

Fix: `export const endContract = (actor: Actor) => endContractOn(inDays(0))(actor);`. Danach bleibt nur das unvermeidliche Fenster zwischen Tippen und Prüfung (Sekunden). Die Zeitzone selbst stimmt: `inDays` und `localToday()` rechnen beide in Europe/Zurich.

### K-2 (mittel) Der Blur-Trick ändert nichts. Sven-Major nicht glaubhaft behoben

`src/routes/contracts/[id]/+page.svelte:49-52`. Neu ruft `checkEndDate` vor `focusFirstError` noch `document.activeElement.blur()` auf. `focusFirstError` macht aber genau das schon seit c1dd4a4 (`src/lib/ui/focus-error.ts:13`: «already focused … focus it anew»). Getestet ist das in `focus-error.dom.test.ts:36`. Dieser Code war schon im Stand 7b9971a, auf dem Sven den Fehler «nach Enter stumm» gefunden hat. Die Ereignisse sind vorher und nachher gleich: `blur` auf dem Feld, dann `focus` auf demselben Feld, beide in derselben Task, nur durch eine Microtask (`tick()`) getrennt. Neu ist allein, dass `blur` vor statt nach dem DOM-Update kommt. Ein Browser, der Fokusereignisse für die Barrierefreiheit gebündelt verarbeitet, sieht in beiden Fällen keinen Fokuswechsel. Deshalb blieb es bei Sven stumm, und deshalb ändert die neue Zeile daran voraussichtlich nichts.

Kein Test deckt die Zeile. Ein Test würde auch ohne sie grün, weil `focusFirstError` dasselbe tut. `offene-punkte.md:254` vermerkt trotzdem «the field is focused anew so its error is read after Enter» als behoben.

Gefragt war auch, ob der Trick den Fokus verlieren kann. Nein: Solange `endError` gesetzt ist, trägt das Feld `aria-invalid="true"`. `Field` setzt `corrected` über `flushSync` zurück, und `DateInput` zeigt bei ungültigem Text seinen eigenen Fehler. `focusFirstError` findet also immer ein Ziel. Fände es keines, stünde der Fokus auf `body`. Die Falle in `Dialog.svelte:99-106` holt ihn beim nächsten Tab zurück (`at === -1` → erstes Element). Mit der Fokusfalle gibt es keinen Konflikt, denn sie reagiert nur auf Tab und hat keinen `focusin`-Handler. Die Zeile ist also harmlos, aber wirkungslos.

Fix: Den Fehler aktiv ansagen, statt sich auf einen Fokuswechsel zu verlassen. `DateInput` hat schon eine assertive Live-Region (`DateInput.svelte:165`, `announced`). Wird `error` durch eine Prüfung neu gesetzt, sagt sie ihn an (leeren, `flushSync`, setzen, wie in `checkEndDate`). Danach die Zeile `:50` entfernen. Test: Die Live-Region enthält nach Enter mit einem Datum vor heute die Meldung. Mit einem echten Screenreader prüfen (NVDA/VoiceOver). Bleibt es offen, den Vermerk in `offene-punkte.md:254` streichen und unter «Not in this change» aufführen. Dasselbe betrifft «Als bezahlt markieren» (`statements/[id]/+page.svelte:60`, `statements/+page.svelte:52`).

### K-3 (mittel) Ein irrtümlich erfasster laufender Mietvertrag führt in eine Sackgasse

`+page.svelte:153,168-173`. Der Löschdialog sagt jetzt selbst, wofür Löschen da ist: «Löschen Sie einen Mietvertrag nur, wenn er irrtümlich erfasst wurde.» (`:161`). Der häufigste Irrtum bei der Ersterfassung ist aber ein laufender Vertrag: ein bestehendes Mietverhältnis mit Beginn in der Vergangenheit, falsch erfasst (falsche Wohnung, doppelt). Für ihn sagt der Dialog nur: «Ein laufender Mietvertrag kann nicht gelöscht werden. Wurde er gekündigt, tragen Sie unter «Beenden» das Vertragsende ein.» Das hilft nicht:

- «Beenden» nimmt frühestens heute. Der Vertrag bleibt bis und mit heute «Laufend», Löschen geht erst morgen.
- Der Ausweg führt über «Bearbeiten»: ein Vertragsende in der Vergangenheit setzen, dann löschen. Oder den Irrtum direkt im Wizard korrigieren. Der Dialog nennt keinen der beiden Wege.

Auf `main` reichte ein beliebiges Vertragsende. Für die Zielgruppe (selten in der App, wenig Erfahrung) ist das eine Sackgasse.

Fix (Copy, klein): im Zweig ohne Vertragsende ergänzen: «Wurde er irrtümlich erfasst, korrigieren Sie ihn unter «Bearbeiten».». Wenn gewollt ist, dass er sich erst über ein früheres Ende löschen lässt, sagen: «… setzen Sie unter «Bearbeiten» ein Vertragsende vor heute; danach können Sie ihn löschen.». Test zuerst: Erwartung des Texts im DOM-Test `contract-detail-page.dom.test.ts` («lässt einen laufenden Mietvertrag …»). Alternativ die Entscheidung in `design-decisions.md` begründen.

### K-4 (niedrig) Löschdialog: Der Grund steht im falschen Zweig, «gekündigt» ohne Markierung

`+page.svelte:158-173`. Die drei Texte im Vergleich:

- **Künftig/beendet (löschbar):** «… wird endgültig gelöscht. Ein Mietvertrag mit Nebenkostenabrechnungen kann nicht gelöscht werden. Löschen Sie einen Mietvertrag nur, wenn er irrtümlich erfasst wurde.»
- **Laufend mit Ende (gesperrt):** «… läuft bis am 31.03.2027 und kann bis dahin nicht gelöscht werden. Behalten Sie ihn auch danach: Die Nebenkostenabrechnung braucht seine Mietstage.»
- **Laufend ohne Ende (gesperrt):** «Ein laufender Mietvertrag kann nicht gelöscht werden. Wurde er gekündigt, tragen Sie unter «Beenden» das Vertragsende ein.»

Annas Risiko R2 ist das Löschen eines **beendeten** Vertrags, bevor die Abrechnung erstellt ist. Gerade im löschbaren Zweig fehlt der Grund «Die Nebenkostenabrechnung braucht seine Mietstage», der Text sagt nur «nur, wenn irrtümlich erfasst». Den Grund liest nur, wer gar nicht löschen kann. Fix: den Satz in den ersten Zweig übernehmen: «Die Nebenkostenabrechnung braucht seine Mietstage. Löschen Sie einen Mietvertrag nur, wenn er irrtümlich erfasst wurde.». Für einen künftigen Vertrag passt der Satz zu Abrechnungen nicht. Optional einen eigenen kurzen Zweig: «beginnt erst am … und wird endgültig gelöscht».

Weitere Punkte zur Copy:

- «Wurde er gekündigt» (`:170`) nutzt denselben fehlenden Glossarbegriff wie die Hilfe. `TODO(fachlich prüfen)` steht aber nur am Feld (`:135`), und `offene-punkte.md:253` nennt nur die Hilfe. Fix: die Markierung und den Vermerk auf den Löschdialog ausdehnen.
- Sonst in Ordnung: Deutsch, «Sie», «ss», die Glossarbegriffe Mietvertrag, Vertragsende, Vertragsbeginn, Nebenkostenabrechnung und Mietstage (`UBIQUITOUS_LANGUAGE.md:125`). Die Fehlermeldungen im Beenden-Dialog nennen, was zu tun ist. Der 409-Text («Ändern Sie es unter «Bearbeiten».») passt zu «Ein früheres Vertragsende tragen Sie unter «Bearbeiten» ein.». «läuft bis am» neben «Bis und mit diesem Tag» bleibt, wie in J notiert, optional.

### K-5 (niedrig) Beispieldaten in der Vergangenheit

Das Feld zeigt unter der Hilfe «Beispiel: 31.12.2025» (`DateInput.svelte:112`, fest). Wer das Beispiel abtippt, bekommt «kann nicht vor heute liegen» (Sven, Minor). Die Leer-Meldung «zum Beispiel 31.03.2027» (`contract-status.ts:138`) ist fest im Code. Ab dem 01.04.2027 liegt auch sie in der Vergangenheit und widerspricht der Regel. Fix: Beide Beispiele aus `earliestEnd` ableiten (z. B. Ende des übernächsten Monats). Oder in der Meldung nur das Format nennen («… als TT.MM.JJJJ ein»), wie es `paidDateError` tut (I-8). Sonst in `offene-punkte.md` vermerken.

### K-6 (niedrig) Zwei Persona-Majors weder umgesetzt noch vermerkt

- **Helga S1, zweiter Teil:** vor dem Speichern die Folge nennen («Kevin Fischer wohnt bis 31.03.2027. Ab 01.04.2027 gilt die Wohnung OG1 als leer.»). Umgesetzt ist nur das leere Feld. Beenden lässt sich über «Bearbeiten» rückgängig machen, deshalb niedrig. Trotzdem fehlt der Vermerk.
- **Sven, Fehler hinter der Hilfe** (`Field.svelte:44-46`: Hilfe vor Fehler in `aria-describedby`): Mit der kürzeren Hilfe (rund 20 Wörter plus Format und Beispiel) ist es gemildert. Vermerkt ist es nur für den Abrechnungs-Wizard (`offene-punkte.md:242`), nicht für diesen Dialog.

Fix: Beides unter «Not in this change» in `offene-punkte.md` (Session 12) aufführen.

### K-7 (niedrig) Tests

Die neuen Tests scheitern ohne die Änderung (am Code geprüft):

- Leeres Feld: Der alte Code schlug `earliestEnd` vor, `value` wäre nicht `''`.
- «lässt einen künftigen Mietvertrag löschen»: Mit `status !== 'ended'` wäre der Button gesperrt.
- Die neuen Texte des Löschdialogs.
- 409: Der alte Code hätte gespeichert.
- 404: Der alte Code fiel auf `{ startDate: '' }` zurück und schickte ein `PUT`, also `calls` mit `PUT`.
- Das Szenario «Künftigen Mietvertrag löschen».

Negative Prüfungen sind verankert:

- «nicht mehr auffindbar» folgt auf «ist auf der Mietvertragsliste» und `emptyContractList` sichtbar.
- «kann das Löschen nicht bestätigen» prüft `toBeDisabled()`.
- Die `PUT`-Filter folgen auf einen geprüften `fail`.

Lücken:

- `contract-detail-page.dom.test.ts:111-126` (leeres Feld): prüft die Meldung, nicht dass nichts gesendet wurde. Der Mechanismus ist zwar derselbe wie im Test `:128-139`, der Fall «leer» wird aber neu so gesendet. Fix: denselben `submit`-Listener verwenden.
- Kein Test, dass ein erneutes Öffnen ein zuvor getipptes Datum leert (`startEnding`, `:40`).
- Die Blur-Zeile `:50` ist ungetestet und mit dem bestehenden `focusFirstError` nicht testbar (K-2). Die Änderung in `FormDialog` ist ohne beobachtbaren Unterschied. Das ist in Ordnung.
- `contract-actions.test.ts:49`: Der Kommentar «auch ohne JavaScript geprüft: ein Tag vor heute geht nicht ans Backend» stimmt nicht. Die Aktion fragt das Backend (`GET`), und ohne JavaScript öffnet sich der Dialog nicht. Fix: «Absicherung, falls der Dialog umgangen wird: ein Tag vor heute wird nicht gespeichert».

## Ohne Befund

- **Leeres Feld, Ablauf:** Öffnen → leer, `min` = heute bzw. der Beginn eines künftigen Vertrags. Bestätigen ohne Eingabe → Meldung am Feld, Fokus aufs Feld, nichts gesendet (`check` → false). Enter im Feld: `DateInput.onkeydown` macht `flushSync(onblur)` vor dem Fenster-Handler von `Dialog`, `endDate` ist also gesetzt, bevor `check` liest. Ungültiger Text («31.13.2026») → `DateInput` zeigt seinen eigenen Fehler, `check` gibt «Bitte geben Sie das Vertragsende ein» und sendet nicht. Der Toast liest `endDate` beim Erfolg, der Wert stimmt.
- **Löschen nach Status:** `contractStatusOn` mit `data.today` (Europe/Zurich). `future` und `ended` sind löschbar, `active` (mit oder ohne Ende) ist gesperrt. Die Zweige des Texts passen zu `disabled`. Backend und BFF prüfen das nicht, das ist vermerkt (J-6).
- **Server-Aktion:** Reihenfolge Laden → 409 bei vorhandenem Ende → Format, heute, Beginn → `PUT`. Die Statuscodes stimmen. Nach einem 409 bleibt die Seite veraltet («Beenden» sichtbar), weil `update()` bei einem Fehler nicht neu lädt. Die Meldung sagt aber, was zu tun ist. Vertretbar.
- **`document.querySelector('[role="dialog"]')`:** Nur `Dialog` und `MobileNav` haben diese Rolle, beide nur im DOM, wenn sie offen sind. Zwei gleichzeitig offen geht nicht, weil der Dialog den Rest auf `inert` setzt.
- **Formales:** Commit-Subject mit 46 Zeichen, Conventional Commits. Prettier und ESLint sind auf den geänderten Dateien sauber. `implementation_plan.md` und `design-decisions.md` sind nachgeführt.
