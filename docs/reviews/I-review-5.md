# Review I, Runde 5 – Bearbeiten, Ablehnung durch das Backend, Befunde der Personas

Unabhängiges Review von d4667dc «fix(contracts): review I-4 and personas I3» gegen seinen Vorgänger eb52bce. Die Änderung beantwortet `I-review-4.md` (L-1 bis L-10) und die Persona-Berichte `helga-i3.md`, `sven-i3.md` und `anna-i2.md`. Entscheide des Product Owners: Nur ein Mietvertrag, der noch nicht begonnen hat, lässt sich löschen. Ein vergangenes Vertragsende braucht eine Bestätigung (Dialog «Beenden» und «Bearbeiten»). Ein Vertragsende vor dem Ende einer gespeicherten Nebenkostenabrechnung des Vertrags wird abgelehnt. «Beenden» und «Löschen» sind getrennte Aktionen.

Gelesen: `git show d4667dc` vollständig. Dazu `contract.service.ts` (`updateContract`, `createContract`, `statementsAfter`), `routes/contracts.ts`, `statement.service.ts` (`generateStatement`), `statement-pdf.service.ts` (`rentalEnd`), `schema.ts` (`utility_statements`, `rental_days`), `db/demo-data.ts` und `demo/demo-data.sql`, die Test-Hilfen `rental.ts`. Im Frontend `contract-status.ts`, `ContractForm.svelte`, `PastEndConfirm.svelte`, `contracts/[id]/+page.svelte` und `+page.server.ts`, `PeriodStep.svelte`, `contract-form.ts` (`contractBody`, `initialContractValues`), `api.ts`, `Checkbox.svelte`, `DateInput.svelte`, `Dialog.svelte` und die Liste seiner Verwender, `dashboard/+page.server.ts` (`missingPeriod`). Tests: `contract-status`, `contract-actions`, `contract-detail-page.dom`, `contract-edit.dom`, `helpers/action.ts`, `contract-end.pg.test.ts`, `api-contracts.pg.test.ts`, Szenarien, Steps, Tasks und Interactions der Änderung, `tests/a11y/screens.json`, `interactions/accessibility.ts` (Seed). Dokumente: `CLAUDE.md`, `backend/CLAUDE.md`, `tests/e2e/CLAUDE.md`, `UBIQUITOUS_LANGUAGE.md`, `I-review-4.md`, die drei Persona-Berichte, `I-fachreview-1.md`, `anforderungen-vertragsende.md`, `offene-punkte.md` (Session 12), `design-decisions.md`, `api-specification.md`.

Ausgeführt:
- `bunx vitest run` für `contract-status`, `contract-actions`, `contract-detail-page.dom`, `contract-edit.dom`: 61 Tests grün.
- Backend `bun test --preload ./scripts/test-db.ts` für `contract-end.pg.test.ts`, `api-contracts.pg.test.ts`, `required-fields.pg.test.ts`: 18 Tests grün. `bun run type-check`: sauber.
- Eine Sonde als temporärer pg-Test im Scratchpad (danach gelöscht): Mietvertrag 01.01.2023–30.06.2025, danach die Abrechnung 2025 erzeugt. `PUT` mit unverändertem Vertragsende und neuer Nettomiete → **409**. `PUT` nur mit `startDate: 2025-05-01` → 200.
- `bunx eslint` auf den geänderten `.ts`/`.svelte`-Dateien: sauber. `bunx prettier --check` auf den geänderten Dateien: zwei Testdateien nicht formatiert (M-9).
- E2E, volle Suiten und Server nicht ausgeführt.

**Ergebnis:** Ein Finding «hoch»: Die neue Backend-Regel lehnt jede Änderung eines beendeten Mietvertrags ab, sobald seine Schlussabrechnung erstellt ist. Das ist der Normalfall nach einem Auszug, und die Demo-Daten enthalten ihn (Sarah Meier, Seepark A2). Die Meldung rät dann, einen korrekten Entwurf zu löschen. Drei Findings «mittel»: Im Formular «Bearbeiten» wird das Kästchen nicht angesagt. Ein Vertragsbeginn hinter den Beginn einer Abrechnung bleibt ungeprüft, obwohl Anna B1 als erledigt gilt. A-7 ist mit der Überschneidungsregel nicht umsetzbar. Dazu fünf Findings «niedrig».

Die übrigen Punkte der Runde 4 sind sauber umgesetzt. Die Regel liegt jetzt im Backend und gilt damit für «Beenden» und «Bearbeiten» (L-2). Die Bestätigung ist an den Tag gebunden (L-4). Die Meldung unterscheidet Entwurf und versandte Abrechnung (L-1). `gt(periodEnd, endDate)` vergleicht `date` mit `YYYY-MM-DD` in PostgreSQL richtig. Das Aufheben des Vertragsendes (`null`) und ein `PUT` nur mit `startDate` lösen keine Prüfung aus. Andere Aufrufer von `updateContract` gibt es nur in Tests. `demo-data.ts` ruft es nicht auf, `seed.contractEnd` in den E2E-Fixtures setzt nur Verträge ohne Abrechnung.

## Stand der früheren Findings (Runde 4)

| # | Schwere | Stand |
|---|---|---|
| L-1 | hoch | Behoben für den Fall, den die Runde beschrieb: Der Entwurf wird mit Nummer genannt und soll zuerst gelöscht werden. Bei einer versandten Abrechnung kein Vorschlag eines späteren Tags mehr (`contract-status.ts:68-77`). Rest: Bei einem korrekten Datum endet die versandte Variante ohne Ausweg (M-6). Neu falsch ist der Fall «Schlussabrechnung schon erstellt» (M-1) |
| L-2 | mittel | Behoben. Das Backend prüft über `contractId` (`contract.service.ts:289-300,338-341`) |
| L-3 | mittel | Behoben. `billedTo` ist weg. Rest: Ein 409 ohne `statements` oder ohne JSON führt zu einer Ausnahme (M-8) |
| L-4 | mittel | Behoben. `confirmedDay` statt Boolean, im Dialog und im Formular. Erneutes Öffnen leert die Box (`startEnding`). Rest: Die Fehlermeldung nennt nach einer Datumsänderung den alten Tag (M-5) |
| L-5 | mittel | Behoben für die neue Antwort: `tests/contracts/contract-end-refused.json`, geprüft in `api-contracts.pg.test.ts:129-134`, verwendet in den Unit-Tests |
| L-6 | mittel | Behoben: A-3.1 ohne Vorschlag, A-4.4 ohne Doppelung, A-4 mit Voraussetzung, A-2 aufgelöst, A-1.5 ergänzt. Rest: «Wohnungsabnahme» und «Mietzinsdepot» (`anforderungen-vertragsende.md:112`) weiter ohne *(Glossar fehlt)*. Neu: A-7 widerspricht der Überschneidungsregel (M-4) |
| L-7 | niedrig | Behoben: «nicht vermietet», «Seit dem …», Folge für den Vermieter genannt |
| L-8 | niedrig | Erster Teil behoben («… oder korrigieren Sie das Vertragsende»). Lösch-Ablehnung auf veralteter Seite bleibt, in `offene-punkte.md` vermerkt |
| L-9 | niedrig | Behoben: `offene-punkte.md`, Szenario-Kommentar, `screens.json` (`end-dialog-error` bestätigt jetzt leer, neuer Zustand `past-end-error`), Testkommentar |
| L-10 | niedrig | Behoben: `isDay` lehnt `2025-13-01` und `2025-02-30` ab, `DELETE`-Proxy entfernt (kein Aufrufer mehr), `endedSince` an Monats-, Jahres- und Schaltjahresgrenzen getestet, Test für heute/später positiv verankert (Wochentag). Rest: «heute» selbst wird weiter nicht geprüft |

## Stand der Persona-Befunde, die `offene-punkte.md:263` als behoben nennt

| Befund | Stand |
|---|---|
| Helga M1, Anna m5 (Dialog zu hoch) | Behoben: Der Dialog scrollt in sich (`Dialog.svelte:125`). Die Knöpfe scrollen mit, sie bleiben nicht fest sichtbar. Das hat Helga vorgeschlagen, es ist aber nicht beansprucht |
| Helga M2 (Tippfehler im Jahr) | Teilweise: Der Hinweis «Das ist über ein Jahr her. Prüfen Sie das Jahr.» steht in der grauen Hilfe, mitten in 47 Wörtern (M-7) |
| Helga M4, Anna B1 (Bearbeiten ohne Prüfung) | Teilweise: Bestätigung und Abrechnungsprüfung gelten jetzt auch unter «Bearbeiten». Die Prüfung blockiert aber auch korrekte Daten (M-1). Annas zweiter Teil (Vertragsbeginn hinter eine Abrechnung) fehlt (M-3) |
| Helga m1 («Mietstage») | Behoben: «also die Tage, an denen er gilt» |
| Sven Major (Kästchen stumm) | Im Dialog behoben. Im Formular «Bearbeiten» nicht (M-2) |
| Sven Minor (Fehler bleibt nach dem Ankreuzen) | Behoben, getestet |
| Sven Minor (zwei Daten), Anna m4 | Behoben: Label nennt den getippten Tag |
| Sven Minor (Hilfe erklärt den Grund nicht) | Behoben: «Das Vertragsende liegt in der Vergangenheit.» |
| Anna M1 (Ablehnung ohne Weg) | Für Entwürfe behoben, ohne Link (als offen vermerkt) |

## Übersicht neue Findings

| # | Schwere | Finding |
|---|---|---|
| M-1 | hoch | Die Backend-Regel vergleicht mit dem Ende der Abrechnungsperiode statt mit den abgerechneten Mietstagen. Nach der Schlussabrechnung lässt sich ein beendeter Mietvertrag nicht mehr speichern, auch wenn nur die Miete ändert. Die Meldung rät, einen korrekten Entwurf zu löschen |
| M-2 | mittel | «Bearbeiten»: Die Live-Region entsteht zusammen mit dem Kästchen (`{#if endChanged}`). Bei einem unbefristeten Vertrag wird das Kästchen deshalb nicht angesagt |
| M-3 | mittel | Ein Vertragsbeginn hinter den Beginn einer gespeicherten Abrechnung wird angenommen. Anna B1 gilt als erledigt, dieser Teil fehlt |
| M-4 | mittel | A-7 setzt einen zweiten Vertrag derselben Wohnung im selben Zeitraum voraus. Den lehnt das Backend als Überschneidung ab. Szenario nicht ausführbar |
| M-5 | niedrig | Nach einer Datumsänderung nennt die Fehlermeldung am Kästchen noch den alten Tag (Dialog und Formular) |
| M-6 | niedrig | Copy der Ablehnung: «nach diesem Tag» ohne Bezug im Formular, «Der Entwurf NK-…, NK-… enthält», «versandt» statt «Versendet», versandte Abrechnung ohne Ausweg bei richtigem Datum |
| M-7 | niedrig | Kästchen: 38–47 Wörter Hilfe vor dem Fehler, die Live-Region liest alles bei jedem neuen Tag und den Fehler doppelt. Jahres-Warnung nur in grauer Hilfe, «der Vermieter» statt «Sie» |
| M-8 | niedrig | Aktion `end`: 409 ohne `statements` oder ohne JSON → Ausnahme und Fehlerseite statt Meldung |
| M-9 | niedrig | Testlücken: Ansage nur im Dialog geprüft und nicht verankert, Formular-Test verdeckt M-1, Prettier in zwei Testdateien, verwirrende Testdaten |

## Findings

### M-1 (hoch) Nach der Schlussabrechnung lässt sich ein beendeter Mietvertrag nicht mehr speichern

`backend/src/services/contract.service.ts:289-300,338-341`. `updateContract` lehnt ab, sobald `data.endDate` gesetzt ist und eine Abrechnung des Vertrags `periodEnd > endDate` hat. `periodEnd` ist aber das Ende der **Abrechnungsperiode** des Gebäudes (`statement.service.ts:301-302`), nicht der letzte abgerechnete Mietstag. Eine Abrechnung für einen Vertrag, der in der Periode endet, rechnet nur bis zum Vertragsende (`statement-pdf.service.ts:138`: `rentalEnd = earlier(contract.endDate, periodEnd)`, dazu `rental_days`). Geprüft wird ausserdem bei jedem `PUT` mit `endDate`, auch wenn es sich nicht ändert. Das Formular «Bearbeiten» sendet `endDate` immer mit, wenn «Befristet» gewählt ist (`src/lib/contract-form.ts:92-100`). Ein beendeter Vertrag erscheint dort als «Befristet».

Mit einer Sonde geprüft: Vertrag 01.01.2023–30.06.2025, danach Abrechnung 2025 erzeugt (Periode 01.01.–31.12.2025). `PUT` mit `endDate: 2025-06-30` (unverändert) und neuer `baseRent` → **409** mit dem Entwurf.

Fehlerszenario (Demo-Daten): Sarah Meier ist am 30.06.2025 aus Seepark A2 ausgezogen (`demo/demo-data.sql:71`). Ihr Entwurf 2025 hat `periodEnd` 31.12.2025 (`db/demo-data.ts:30`). Der Verwalter merkt, dass das Akonto falsch erfasst ist, und korrigiert es unter «Bearbeiten». Er bekommt «Der Mietvertrag wurde nicht gespeichert – Der Entwurf NK-… enthält schon Mietstage nach diesem Tag. Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu.» Der Entwurf ist korrekt. Löscht er ihn und speichert, geht es. Erstellt er die Abrechnung danach neu, ist der Vertrag wieder gesperrt. Ist die Schlussabrechnung schon versandt, heisst es «… ist schon versandt und rechnet Mietstage bis 31.12.2025 ab. Das Vertragsende kann nicht davor liegen.» Beides ist falsch: Sie rechnet bis 30.06.2025. Dann lässt sich der Vertrag nie mehr bearbeiten. Das betrifft jeden Mieterwechsel, also den Hauptfall der Proration.

Dazu die Gegenrichtung, ohne eigenes Finding: Verschiebt man das Ende nach hinten (30.06. → 31.08.2025, ohne Nachmieter), nimmt das Backend es an. Die Abrechnung rechnet dann zu wenige Mietstage ab.

Fix:
- Mit den abgerechneten Tagen vergleichen statt mit `periodEnd`: abgerechnet bis `least(period_end, coalesce(<gespeichertes Vertragsende>, period_end))`. Genauer geht es mit `rental_days`: `greatest(period_start, <Vertragsbeginn>) + rental_days - 1`. Abgelehnt wird nur, wenn das neue Ende davor liegt.
- Nur prüfen, wenn sich das Ende ändert (`data.endDate !== current.endDate`).
- In der Antwort den abgerechneten Tag statt `periodEnd` liefern, damit die Meldung «rechnet Mietstage bis …» stimmt. `contract-end-refused.json` und `api-specification.md` nachführen.
- Test zuerst in `contract-end.pg.test.ts`: Vertrag mit Ende 30.06.2025, Abrechnung 2025 danach erzeugt, `PUT` mit gleichem Ende und neuer Miete → 200. `PUT` mit Ende 31.05.2025 → 409.

### M-2 (mittel) «Bearbeiten»: Das Kästchen erscheint ohne Ansage

`src/routes/contracts/ContractForm.svelte:186-193`, `PastEndConfirm.svelte:20-41`. Die Live-Region `<div aria-live="polite">` steckt in `PastEndConfirm`. Das Formular rendert die Komponente nur `{#if endChanged}`. Bei einem unbefristeten Vertrag ist `values.endDate` leer, und das gespeicherte Ende auch. `endChanged` ist also `false`, bis `DateInput` einen ganzen Tag liefert (`typed()` gibt bis dahin `''` zurück). In diesem Moment werden `endChanged` und `past` gleichzeitig wahr. Die Region wird mit ihrem Inhalt eingefügt. Screenreader sagen den Inhalt einer Live-Region, die mit Inhalt entsteht, in der Regel nicht an. Die Region muss vorher leer im DOM stehen. Im Dialog klappt das, weil `PastEndConfirm` beim Öffnen schon leer da ist.

Fehlerszenario: Sven öffnet «Bearbeiten» beim unbefristeten Vertrag von Nina Brunner. Er wählt «Befristet», tippt 31.08.2026 und hört nur «Montag, 31. August 2026». Er drückt Enter und landet im Fehler. Das ist genau der Major aus `sven-i3.md`, den `offene-punkte.md:263` als behoben führt («the checkbox is announced when it appears»).

Fix: `PastEndConfirm` immer rendern und `endDate={endChanged ? values.endDate : ''}` übergeben. Test zuerst im `contract-edit.dom.test.ts`: Vor dem Tippen gibt es schon ein leeres Element mit `aria-live`, und danach steht das Kästchen darin.

### M-3 (mittel) Ein Vertragsbeginn hinter eine Abrechnung wird angenommen

`backend/src/services/contract.service.ts:338-341`. Geprüft wird nur `endDate`. Mit der Sonde geprüft: Ein Vertrag ab 01.01.2023 mit Abrechnung 2025 (Mietstage ab 01.01.2025) nimmt `PUT { startDate: '2025-05-01' }` mit 200 an. Anna B1 verlangt ausdrücklich «Dasselbe für eine Verschiebung des Vertragsbeginns hinter eine bestehende Abrechnung». `offene-punkte.md:263` führt «Anna B1» als behoben. A-7.3 greift nur einen Teil auf (Verschiebung in die Zukunft).

Fehlerszenario: Der Verwalter korrigiert unter «Bearbeiten» den Vertragsbeginn von Pierre Dubois von 01.01.2023 auf 01.05.2025. Der Entwurf 2025 rechnet weiter 365 Mietstage ab. Ein Vormieter für Januar bis April 2025 lässt sich jetzt erfassen und erhält in seiner Abrechnung dieselben Tage noch einmal. Genau diesen Widerspruch soll die Regel verhindern.

Fix: In `updateContract` auch `startDate` prüfen. Abgelehnt wird, wenn eine Abrechnung des Vertrags Mietstage vor dem neuen Beginn hat (`greatest(period_start, <alter Beginn>) < neuer Beginn` und `period_end >= <alter Beginn>`). Gleiche 409-Form, Meldung in `statementsAfterEndError` verallgemeinern. Andernfalls «Anna B1» in `offene-punkte.md` als teilweise behoben führen und den Beginn als offenen Punkt eintragen. Test zuerst als `*.pg.test.ts`.

### M-4 (mittel) A-7 ist mit der Überschneidungsregel nicht umsetzbar

`docs/anforderungen-vertragsende.md:204,212-215`. A-7.1 erlaubt das Löschen, «wenn für dieselbe Wohnung im selben Zeitraum ein anderer Mietvertrag besteht». Das Szenario setzt voraus: «derselbe Mietvertrag ist ein zweites Mal erfasst». Laut Glossar darf sich pro Wohnung kein Vertrag mit einem anderen überschneiden (`UBIQUITOUS_LANGUAGE.md:34`). `createContract` und `updateContract` lehnen das ab (`contract.service.ts:273-283,320-334`). Die Vorbedingung lässt sich weder über die App noch über das Backend herstellen (E2E-Vorbedingungen gehen über die API, `tests/e2e/CLAUDE.md`).

Fehlerszenario: Wer A-7 umsetzt, schreibt den Schritt «derselbe Mietvertrag ist ein zweites Mal erfasst». Die Fixture bekommt 400 «overlap». Wer daraufhin die Überschneidungsprüfung lockert, gefährdet die Proration. Annas tatsächlicher Fall war anders: derselbe Mieter in einer anderen Wohnung, oder ein Vertrag für den falschen Mieter.

Fix: A-7 an die realen Fälle anpassen. Zum Beispiel «ein begonnener Vertrag ohne Abrechnung, der Verwalter bestätigt die irrtümliche Erfassung». Das Szenario mit einem erfassbaren Duplikat schreiben: gleicher Mieter, andere Wohnung, gleicher Zeitraum. Die Bedingung «für dieselbe Wohnung im selben Zeitraum» streichen.

### M-5 (niedrig) Die Fehlermeldung am Kästchen nennt nach einer Datumsänderung den alten Tag

Dialog: `src/routes/contracts/[id]/+page.svelte:40-52`. `pastError` wird nur in `startEnding`, `checkEndDate` und beim Ankreuzen geleert. Formular: `ContractForm.svelte:104-107`. `edited()` löscht beim Tippen im Datumsfeld nur `errors.endDate`, nicht `errors.pastConfirmed`.

Fehlerszenario: Der Verwalter tippt 31.03.2025 und bestätigt ohne Haken. Das ergibt «Bitte bestätigen Sie, dass der Mietvertrag am 31.03.2025 endete …». Er sieht den Tippfehler und korrigiert auf 31.03.2026. Das Label sagt jetzt «Der Mietvertrag endete am 31.03.2026.», die rote Meldung darunter noch «am 31.03.2025», und das Kästchen bleibt `aria-invalid`. Ein Laie fragt sich, ob die Korrektur gegriffen hat.

Fix: Den Fehler leeren, wenn sich der Tag ändert. Zum Beispiel in `PastEndConfirm` die Meldung nur zeigen, solange sie für `endDate` gilt, oder im Dialog `pastError` in einem `$effect` auf `endDate` zurücksetzen. Im Formular gehört `endDate` in `errorKey` mit zum Löschen von `pastConfirmed`. DOM-Test zuerst.

### M-6 (niedrig) Copy der Ablehnung

`src/lib/contract-status.ts:72-76`.
- «Der Entwurf NK-… enthält schon Mietstage nach **diesem Tag**.» Im Dialog steht das Feld darüber. Im Formular steht die Meldung unten in der Alert-Box «Der Mietvertrag wurde nicht gespeichert», ohne Bezug auf das Vertragsende. Fix: den Tag nennen: «… enthält schon Mietstage nach dem 31.03.2025.»
- Mehrere Entwürfe ergeben «Der Entwurf NK-2024-0002, NK-2025-0003 enthält». Fix: Mehrzahl («Die Entwürfe … enthalten»).
- «ist schon **versandt**»: Der Abrechnungsstatus heisst im Glossar «Versendet» (`UBIQUITOUS_LANGUAGE.md:133`). Auch «Bezahlt» landet in diesem Zweig. Fix: «ist schon versendet».
- Versandte Abrechnung: «Das Vertragsende kann nicht davor liegen. Prüfen Sie das Datum.» Stimmt das Datum (der Mieter ist wirklich früher ausgezogen), gibt es keinen Weg. `offene-punkte.md:206` sagt für versandte Abrechnungen schon «correct it outside Dwello». Fix: «Stimmt das Datum, korrigieren Sie die Abrechnung ausserhalb von Dwello und melden Sie sich …» oder den Fall in `offene-punkte.md` (Session 12, Review I) ausdrücklich nennen. Das hat Runde 4 (L-1) verlangt.

### M-7 (niedrig) Kästchen: Länge, doppelte Ansage, Jahres-Warnung

`src/routes/contracts/PastEndConfirm.svelte:20-41`.
- Die Hilfe hat 38 Wörter, mit Jahres-Warnung 47 (Sven I3: 22). `aria-describedby` liest Hilfe vor Fehler (`Checkbox.svelte:34`). Bei Sven kommt der Fehler damit noch später als in I3 («Fehler zuerst» war sein Vorschlag).
- Die Live-Region umfasst das ganze Kästchen. Jeder neue vergangene Tag ändert Label und Hilfe und löst eine neue Ansage von bis zu 47 Wörtern aus, zusätzlich zur Ansage des Wochentags in `DateInput`. Der Fehler wird in die Region eingefügt und deshalb zweimal angesagt: über die Region und über den Fokuswechsel auf das Kästchen.
- Helga M2 verlangte eine deutliche Warnung. «Das ist über ein Jahr her. Prüfen Sie das Jahr.» steht als zweiter Satz in grauer Hilfe (`text-ink-muted`). Helga hat in I3 genau diese Hilfe gelesen und trotzdem angekreuzt.
- «Die Nebenkosten dieser Zeit trägt der Vermieter.» Der Leser ist der Vermieter. CLAUDE.md verlangt «Sie». Runde 4 schlug «Die Nebenkosten danach tragen Sie.» vor.

Fix: Nur einen kurzen Satz in die Live-Region legen (z. B. «Das Vertragsende liegt in der Vergangenheit. Bestätigen Sie es unten.») und die Checkbox ausserhalb lassen. Die Jahres-Warnung als eigene sichtbare Zeile in `text-caution` oder als `Alert` über dem Kästchen. Die Hilfe auf zwei Sätze kürzen.

### M-8 (niedrig) Aktion `end`: 409 ohne `statements` stürzt ab

`src/routes/contracts/[id]/+page.server.ts:136-138`. `statementsAfterEndError((await response.json()).statements)` setzt voraus, dass jedes 409 JSON mit einem Array `statements` ist. Ist die Antwort kein JSON (Proxy), wirft `json()`. Fehlt `statements`, wirft `statements.find`. Dann zeigt SvelteKit die Fehlerseite statt einer Meldung im Dialog. Heute liefert das Backend 409 nur mit `statements`. Ein künftiges 409 (z. B. die Löschregel aus A-7.4 im selben Router) bricht die Aktion. Das Formular (`ContractForm.svelte:110-111`) prüft dagegen mit `Array.isArray`.

Fix: `const body = await response.json().catch(() => ({}))` und `Array.isArray(body.statements)` wie im Formular, sonst die allgemeine Meldung. Unit-Test mit `{ status: 409, answer: { error: 'x' } }`.

### M-9 (niedrig) Testlücken und Formales

- `contract-detail-page.dom.test.ts:170-177` «sagt das Kästchen an» prüft nur, dass das Kästchen in einem `[aria-live]` steckt. Nicht geprüft wird, dass die Region vorher leer existierte. Für das Formular fehlt der Test ganz. Deshalb bleibt M-2 unbemerkt.
- `contract-edit.dom.test.ts:146-153` «fragt bei einem unveränderten Vertragsende nicht nach» antwortet auf jedes `PUT` mit 200. Der echte Fall (beendeter Vertrag mit Schlussabrechnung) gibt 409 (M-1). Ein Backend-Test für diesen Fall fehlt, siehe Fix M-1.
- `contract-status.test.ts:95-106`: Die versandte NK-2024-0001 hat `periodEnd` 31.12.2025, die Meldung sagt «rechnet Mietstage bis 31.12.2025 ab». Das passt nicht zur Nummer und verdeckt, welcher Tag gemeint ist. Fix: `periodEnd` pro Abrechnung als Parameter.
- `bunx prettier --check`: `src/__tests__/contract-actions.test.ts:63` und `contract-detail-page.dom.test.ts:213` sind nicht formatiert. CI prüft Prettier nicht, andere Dateien im Repo sind auch unformatiert. Trotzdem Teil dieser Änderung.
- A-2 ist als «umgesetzt» markiert. Die alte A-2.1 verlangte die Prüfung auch in der Server-Aktion ohne JavaScript. Das Formular «Bearbeiten» speichert über den BFF-Proxy `PUT /api/contracts/[id]`, die Bestätigung eines vergangenen Endes prüft nur der Client. Das ist vertretbar, weil die Abrechnungsregel jetzt im Backend liegt. Es sollte aber im umgesetzten Text stehen («Bestätigung nur im Browser»).

## Ohne Befund

- **Backend-Form der Antwort:** 409 `{ error, statements: [{ id, statementNumber, status, periodEnd }] }`. Sie ist in `api-specification.md:85` dokumentiert, als Beispiel in `tests/contracts/contract-end-refused.json` abgelegt und in `api-contracts.pg.test.ts` gegen die echte API geprüft. `periodEnd` kommt als `YYYY-MM-DD` (Spalte `date`). `null` als Ende und Änderungen nur am Beginn lösen die Prüfung nicht aus. Die Prüfung läuft nach der Überschneidungsprüfung, ein 404 kommt vorher.
- **`apiCall`-`details`:** Das Feld ist optional und kommt nur dazu. Die übrigen Aufrufer (`invoices/new`, `ContractWizard`) lesen nur `message` oder prüfen auf `error`. Kein Test vergleicht das ganze Fehlerobjekt.
- **`endChanged`:** Befristet → Unbefristet → Befristet behält den getippten Tag (`PeriodStep` leert ihn nicht). Das gespeicherte Ende wird nicht erneut bestätigt. Ein Vertrag mit vergangenem Ende, bei dem nur die Miete ändert, fragt nicht. Ein geändertes vergangenes Ende fragt. Ein leeres Ende bei «Befristet» zeigt kein Kästchen. Der Fehler am Kästchen verschwindet beim Ankreuzen (Setter und `edited()`). Der Fokus springt bei einem Fehler auf das Kästchen (getestet).
- **Assistent «Neuer Mietvertrag»:** `ContractWizard` und `PeriodStep` sind nicht geändert. `PastEndConfirm` hängt nur am Formular «Bearbeiten». Das Verhalten des Assistenten bleibt gleich (Anna m7 ist als offen vermerkt).
- **`Dialog.svelte`:** `max-h-full` bezieht sich auf den festen Container (`fixed inset-0 p-4`), auch bei `items-end` auf dem Handy. Kurze Dialoge sehen gleich aus. Die Fokusfalle sucht weiter im Panel. Der fokussierte Fehler wird vom Browser in den sichtbaren Bereich gescrollt. Keiner der 17 Verwender hat ein absolut positioniertes Popover, das jetzt abgeschnitten würde. Der Kalender von `DateInput` ist ein natives `showPicker()`.
- **«über ein Jahr»:** `yearAgo` ist heute minus ein Jahr, gleicher Tag. Genau ein Jahr zurück warnt nicht, ein Tag davor schon. Am 29.02. vergleicht der String «JJJJ-02-29» trotzdem richtig.
- **A11y-Zustand `past-end-error`:** `inDays(-30)` liegt nach dem Vertragsbeginn des Seeds (Anna ab 2015-01-01, `interactions/accessibility.ts:46`). Der Zustand wartet auf das Kästchen mit `aria-invalid="true"`. Im Formular sendet er ohne Haken, es entsteht also kein `PUT` gegen Annas Abrechnung 2025.
- **Szenarien:** «Dialog im kleinen Fenster» prüft, dass der Knopf ganz sichtbar gescrollt werden kann. Ohne die Änderung bleibt er im fixen Overlay abgeschnitten. Die Szenarien zur Ablehnung prüfen «ist der Mietvertrag unbefristet» erst nach der Meldung.
- **Requirements:** A-2 ist bis auf M-9 korrekt als umgesetzt beschrieben. A-8 und A-9 sind prüfbar. A-9 nennt `missingPeriod` und die heutige Belegung richtig (`dashboard/+page.server.ts:69-75`).
- **Formales:** Conventional Commit mit 42 Zeichen im Subject. `implementation_plan.md`, `design-decisions.md` und `offene-punkte.md` sind nachgeführt. ESLint ist sauber, der Backend-Typecheck auch.
