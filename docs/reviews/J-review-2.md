# Review J, Runde 2 – Fixes zu Review J-1 und Personas J1

Unabhängiges Review von 9ec5873 «fix(contracts): review J-1 and personas J1» gegen 7806061. Massstab sind `docs/reviews/J-review-1.md` (J-1 … J-8), die Personaberichte `docs/design/personas/helga-j1.md`, `anna-j1.md`, `sven-j1.md` und der Entscheid des Product Owners: J-1, J-2, J-3, J-5, J-6, J-7, Sven M1 (Dialogtitel) und Anna m2/Sven m4 (Meldung nach «Kündigung aufheben») beheben, die Demodaten korrigieren statt einen neutralen Zustand für alte Verträge einzuführen (A-1.5 bleibt), alles andere in `docs/design/offene-punkte.md` als offen festhalten.

Gelesen: `git show 9ec5873` vollständig; dazu `contract.service.ts` (`checkNotice`, `createContract`, `updateContract`), `routes/contracts.ts`, `demo/demo-data.sql`, `helpers/rental.ts`, `api-contracts.pg.test.ts` (`drift`), `contracts/+page.server.ts`, `ContractForm.svelte`, `contract-form.ts` (`initialContractValues`, `contractBody`), `new/PeriodStep.svelte`, `contracts/[id]/+page.svelte`, `ActionDialog.svelte`, `Dialog.svelte`, `dashboard/+page.server.ts` (vor und nach 52322c3), `lib/server/contract-history.ts`, die geänderten Szenarien und Schritte (`contract-detail`, `contract-edit`, `dashboard`, `contract-form.steps.ts`, `contracts.steps.ts`, `dashboard.steps.ts`, `fixtures/backend.ts`), `tests/contracts/README.md`, `anforderungen-vertragsende.md` (A-1, A-6), `api-specification.md`, `offene-punkte.md`, `implementation_plan.md` (Session 15).

Ausgeführt:
- `bunx vitest run` für `contract-actions`, `contract-detail-page.dom`, `contract-edit.dom`, `dashboard`, `contract-status`, `contract-wizard.dom`, `contract-list`: 119 Tests grün.
- Backend `bun test --preload ./scripts/test-db.ts` für `api-contracts.pg.test.ts`, `contract-end.pg.test.ts`, `demo-data.pg.test.ts`: 37 grün. `bun run type-check`, `bun run lint`, `bun run check`: sauber.
- Gegenprobe auf dem Elternstand in einem Scratch-Worktree (7806061 mit den neuen Tests und Beispielen von 9ec5873, danach entfernt): Es scheitern genau die neuen Prüfungen, jede aus dem richtigen Grund. `contract-actions` «gibt der Liste weiter …»: `expected undefined to be true`. `contract-detail-page.dom`: Titel «Mietvertrag beenden?». `contract-edit.dom`: Meldung «Mietvertrag von Anna Keller gespeichert». `dashboard` (zwei Tests): unsortiert «Seeblick, Lindenhof, Ahornhof, Erlenhof, Birkenhof». `contract-end.pg` J-2: rohes SQL statt `A notice needs an end date`. `demo-data.pg`: `terminated: false` für beide Vormieter. Die Grenztage `k7`/`k8` in `dashboard.test.ts` sind auch auf dem Elternstand grün, wie erwartet: Sie schützen vor einem künftigen `<` statt `<=`.
- Sonde im selben Worktree mit `contract.service.ts` von 9ec5873 (temporärer pg-Test, gelöscht): `PUT { endDate: '2099-03-31', terminated: true }` → 200; danach `PUT { endDate: null, terminated: true }` → **400** `{"error":"A notice needs an end date"}`, gespeichert bleibt `2099-03-31`, gekündigt (J2-1). `POST` mit `terminated: true` ohne `endDate` → 400 mit derselben Meldung.
- E2E nicht ausgeführt (die Suite lief parallel); die geänderten Szenarien nur gelesen.

**Ergebnis:** Die Fixes zu J-1, J-2, J-3, J-6, J-8, Sven M1 und Anna m2/Sven m4 sind richtig und durch Tests belegt, die auf dem Elternstand aus dem richtigen Grund scheitern. Keine Regression bei den anderen Aufrufern: Der Assistent für neue Verträge sendet weiter `terminated: false`, die Aktion «Beenden» sendet das Flag nur mit Datum, die Meldung nach dem Speichern sagt «aufgehoben» nur, wenn ein gespeicherter gekündigter Vertrag über «Kündigung aufheben» (einzige Option mit `isUnlimited`) gespeichert wird. Das Demo-SQL ist idempotent. Sechs Findings, eines «mittel», fünf «niedrig»: `offene-punkte.md` hält nicht alles fest, was offen bleibt (J2-5), und J-5 sowie J-7 sind nur zum Teil erledigt (J2-2, J2-4).

## Prüfung der Fixes

| Finding | Fix | Ergebnis |
|---|---|---|
| J-1 Liste ohne `terminated` | `terminated: !!c.terminated` im Loader; Unit-Test mit `contracts.json`; `Dann` im Szenario «Gekündigter Mietvertrag bleibt unbefristet» | Richtig und vollständig. Der Schritt sucht die Zeile über den Namen und prüft `, gekündigt` |
| J-2 rohes SQL | `checkNotice` vor dem Schreiben in `createContract` und `updateContract`; pg-Test für `PUT`; API-Doku | Richtig für den gemeldeten Fall. Die Kombination `{ endDate: null, terminated: true }` verhält sich anders als vorher und als die Doku sagt (J2-1). `POST` ungetestet (J2-2) |
| J-3 Reihenfolge | `localeCompare(…, 'de-CH')`; gleichnamige Gebäude in `offene-punkte.md` | Richtig. Mit der Sortierung spielt die Reihenfolge der Testdaten keine Rolle mehr |
| J-5 Testlücken | neues Szenario pro Mietvertrag; ganze Texte statt `toContainText`; Optionsfeld mit `toBeChecked()`; Grenztage im Unit-Test | Zum Teil. Wohnung und Mieter (`toContractHistory`) weiter ohne Test für «gekündigt» (J2-2). Das neue Szenario hat zwei ausgezogene Mieter, Ahornhof ist also leer; gegen den Code vor A-9 scheitert es darum (auch) wegen des leeren Gebäudes. Gegen eine Regression auf «eine Abrechnung im Gebäude genügt» scheitert es aber richtig. Kein Befund |
| J-6 API-Verträge | `contracts.json`, `period-statements.json`, Drift-Tests, `dashboard.test.ts` nutzt die Beispiele | Richtig. `endDate` wird im Drift-Test nicht geprüft (J2-3) |
| J-7 Copy | `TODO(fachlich prüfen)` über `contractPeriod`, `contractEnd`, «Kündigung aufheben» | Zum Teil: «Befristet» ohne Datum ist weder umgesetzt noch in A-1.3 angepasst (J2-4) |
| J-8 / Anna M2 Demodaten | `UPDATE … SET terminated = TRUE` für die zwei Vormieter; pg-Test | Richtig. Idempotent (das `UPDATE` setzt bei jedem `db:demo` denselben Wert), läuft nach den `INSERT` beider Verträge |
| Sven M1 Dialogtitel | «Mietvertrag von {Name}, Wohnung {Nummer}, beenden?» | Richtig. Der Titel ist ein `h2` ohne feste Breite und bricht an Leerzeichen und Bindestrichen um; bei 390 px bleibt kein seitliches Scrollen, ausser bei einem einzelnen Wort über rund 25 Zeichen, das auch der Seitentitel «Mietvertrag von {Name}» schon hätte. Das Gebäude fehlt im Titel; in den Demodaten sind die Wohnungsnummern eindeutig, mit dem Mieternamen genügt es. Kein Befund |
| Anna m2 / Sven m4 Meldung | `contract.terminated && values.isUnlimited` | Richtig. Ein unbefristeter Vertrag ohne Kündigung (`terminated: false`) meldet weiter «gespeichert»; «Befristet» oder ein geänderter Kündigungstermin auch. Wortlaut kürzer als die Vorschläge, aber gleichbedeutend |

## Übersicht Findings

| # | Schwere | Finding |
|---|---|---|
| J2-1 | niedrig | `PUT { endDate: null, terminated: true }` gibt neu 400, obwohl die API-Doku sagt, `endDate: null` hebe das Flag auf und ein gespeichertes Ende genüge |
| J2-2 | niedrig | J-5 nur zum Teil: Wohnung und Mieter ohne Test für «gekündigt»; die Prüfung bei `POST` ohne Test |
| J2-3 | niedrig | Drift-Test für `contracts.json` prüft `endDate` nicht, weil der Testvertrag kein Ende hat |
| J2-4 | niedrig | J-7 Punkt 2 nicht erledigt: A-1.3 verlangt im Assistenten «Befristet bis TT.MM.JJJJ», der neue Satz unter «Umgesetzt» widerspricht dem ohne Entscheid |
| J2-5 | mittel | `offene-punkte.md` hält zehn Personabefunde und zwei Punkte aus Review J-1 nicht als offen fest |
| J2-6 | niedrig | Zwei Kommentare stehen nach dem Einfügen über dem falschen Code |

## Findings

### J2-1 (niedrig) Kündigung ohne Ende: Verhalten und API-Doku stimmen nicht überein

`backend/src/services/contract.service.ts:344`, `docs/api-specification.md:85`. `updateContract` ruft `checkNotice(data.terminated, data.endDate !== undefined ? data.endDate : current.endDate)`. Mit `endDate: null` und `terminated: true` im selben Request wirft die Prüfung, obwohl der Vertrag ein Ende gespeichert hat. Vor 9ec5873 war die Antwort 200 und der Vertrag wieder unbefristet ohne Kündigung (Sonde 1 in Review J-1). Die Doku sagt jetzt «`terminated: true` needs an end date (stored or sent)» und «`endDate: null` also clears `terminated`»; nach beiden Sätzen müsste der Request gelingen.

Mit der Sonde geprüft: gekündigter Vertrag mit Ende 31.03.2099, `PUT { endDate: null, terminated: true }` → 400 `{"error":"A notice needs an end date"}`, gespeichert bleibt die Kündigung.

Fehlerszenario: Ein Skript oder eine künftige Aktion «Kündigung aufheben» auf der Detailseite (Helga m4, Anna m1, Sven m5) schickt das ganze Objekt mit geändertem `endDate: null` und dem alten `terminated: true` zurück. Nach der Doku wird der Vertrag unbefristet, tatsächlich kommt 400 und die Kündigung bleibt. Aus dem heutigen UI nicht erreichbar: `contractBody` sendet bei `isUnlimited` immer `terminated: false`.

Fix: Eine Regel wählen. Kürzeste Variante, die zur Doku passt: in `updateContract` `checkNotice(data.terminated && data.endDate !== null, …)`, also wie bisher `endDate: null` gewinnt; dazu ein Fall im pg-Test «`{ endDate: null, terminated: true }` → 200, unbefristet ohne Kündigung». Oder die strengere Regel behalten und die Doku ändern: «`terminated: true` needs an end date after the update; `{ endDate: null, terminated: true }` is refused».

### J2-2 (niedrig) J-5 nur zum Teil umgesetzt

- `src/lib/server/contract-history.ts:18`. J-5 verlangte einen Unit-Test für `toContractHistory` mit `terminated: true`, weil Wohnung und Mieter «gekündigt» nur über diese Abbildung bekommen. Es gibt keinen (`grep -rn gekündigt src/__tests__`: nur Detail, Bearbeiten, Mietvertragsliste). Fehlerszenario: Wer `toContractHistory` wie früher den Listen-Loader Feld für Feld neu baut und `terminated` vergisst, macht aus jeder Kündigung auf der Wohnungs- und Mieterseite wieder «befristet» (J-1 an zwei weiteren Stellen), und alle Tests bleiben grün. Fix: in `tenant-detail.test.ts` neben dem bestehenden `toContractHistory`-Test `expect(toContractHistory({ id: 'c', startDate: '2024-04-01', endDate: '2099-03-31', terminated: true }, 'Anna').terminated).toBe(true)` (oder den Text der Zeile).
- `contract.service.ts:279`. `checkNotice` in `createContract` hat keinen Test; entfernt man den Aufruf, bleibt `contract-end.pg.test.ts` grün, und `POST` liefert wieder rohes SQL. Fix: im selben `describe` ein `POST /api/v1/contracts` mit `terminated: true` ohne `endDate` → 400 mit `A notice needs an end date`.

### J2-3 (niedrig) Drift-Test prüft `endDate` der Mietvertragsliste nicht

`backend/src/__tests__/api-contracts.pg.test.ts:136-139` mit `:44` und `drift` (`:23`). `tests/contracts/README.md`: «Optionale Felder sind in den Testdaten gefüllt: Liefert die API `null`, prüft der Test den Typ nicht.» Der Testvertrag wird mit `createRental(token, { startDate: '2024-01-01', … })` ohne `endDate` angelegt; `drift` überspringt `null`. `contracts.json` hat `"endDate": "2099-03-31"`, geprüft wird es nie. Ebenso ist `terminated` dort `false`, ein Wechsel auf `"true"`/`"false"` als String fiele zwar auf, ein fehlendes Flag bei gekündigten Verträgen nicht.

Fehlerszenario: Das Backend liefert `endDate` künftig als Objekt (z.B. `{ date, terminated }`) oder benennt es um. Der Drift-Test bleibt grün; die Übersicht vergleicht `String(c.endDate) >= period.start` mit `"[object Object]"` und nennt ausgezogene Mieter nicht mehr.

Fix: Im Drift-Test einen eigenen Vertrag mit Ende und Kündigung anlegen (`createRental(…, { startDate: '2024-01-01', endDate: '2099-03-31', … })`, dann `PUT { terminated: true }`) oder den bestehenden vor dem Test so setzen und danach zurück; Beispiel und Antwort sind dann gefüllt.

### J2-4 (niedrig) J-7 Punkt 2 nicht erledigt, A-1.3 widerspricht dem Stand

`docs/anforderungen-vertragsende.md:27` und `:35-38`, `src/routes/contracts/new/PeriodStep.svelte:34-38`. J-7 bot zwei Wege: das Label «Befristet bis TT.MM.JJJJ» bilden oder A-1.3 auf Detailseite und Listen beschränken. Keiner ist gemacht. A-1.3 verlangt weiter «Die Detailseite, die Mietvertragsliste und der Assistent zeigen: befristet: «Befristet bis TT.MM.JJJJ»». Der neue Satz unter «Umgesetzt» sagt «Unter «Bearbeiten» heisst die Option nur «Befristet»; das Datum steht im Feld darunter (Review J-1, J-7)» und klingt wie ein Entscheid, den es nicht gibt; der Product Owner hatte J-7 zu den klaren Fixes gezählt. Der Assistent für neue Verträge nutzt dieselbe Option und ist im Satz nicht genannt.

Fehlerszenario: Wer A-1 später gegen die Anforderung prüft (z.B. eine Persona oder ein Fachreview), findet im Assistenten «Befristet» statt «Befristet bis 31.12.2099» und meldet A-1 als nicht erfüllt, obwohl «umgesetzt» darübersteht. `offene-punkte.md:259` führt es zwar als offen, die Anforderung selbst aber nicht.

Fix: Entweder in `PeriodStep.svelte` `label: endDate ? contractEnd(endDate, false) : 'Befristet'` (wie bei der gekündigten Option, mit DOM-Test) oder A-1.3 ändern: «Die Detailseite und die Listen zeigen …; der Assistent nennt die Option «Befristet», das Datum steht im Feld» und im Satz unter «Umgesetzt» «Assistent und Bearbeiten» schreiben.

### J2-5 (mittel) `offene-punkte.md` hält nicht alles Offene fest

`docs/design/offene-punkte.md:258-259`. Der Product Owner verlangte, alles, was nicht behoben wird, als offen festzuhalten. Die Zeile «Left low (review J-1, personas J1)» nennt J-4, J-3 (gleichnamige Gebäude), J-7, Sven m1, m2, m3, m5, m7, m8, m10, Helga m1, m3, m4 und Anna m1. Es fehlen:

- Sven m6: Zeilenlink nur mit dem Namen, zweiter Link pro Zeile, «, gekündigt» per Tab nicht hörbar. Sven schreibt, dass genau das in diesem Lauf zum Verzählen und zu falschen Daten bei Laura Keller geführt hat; der neue Dialogtitel (M1) fängt es ab, behebt die Ursache aber nicht.
- Sven m9 (assertiver Seitentitel nach «Änderungen speichern») und m11 (Live-Regionen beim Laden schon gefüllt).
- Anna m3 («Beenden» klingt nach sofort, Titel «Mietvertrag kündigen oder beenden»), m4 (erste Option heisst nach «Kündigung aufheben» weiter «Unbefristet, …»), m5 (Erfolgsmeldung verdeckt bei 1024 × 768 die Karte «Miete pro Monat»), m6 (Hilfe erklärt «befristet» und «Kündigung» nicht).
- Helga m2 («Prüfen Sie das Jahr» verunsichert, wenn das Jahr stimmt) und m5 (Kästchen weit weg vom Speichern-Knopf; die Zeile zu Runde 6 nennt nur Helga I5 m2, m4, m5).
- Aus Review J-1: der Hinweis zu A-6 («Dokumente»): A-1.5 setzt für A-6 eine Grenze «nach der Einführung von A-1», Dwello speichert dafür kein Datum. Und der fehlende Test aus J-5 (J2-2).

Fehlerszenario: Im nächsten Persona-Lauf meldet Sven den Zeilenlink zum dritten Mal; niemand findet ihn in `offene-punkte.md` und kann nicht sagen, ob er bewusst offen ist oder übersehen wurde. Bei A-6 baut jemand die Aufgabe ohne Stichtag, und die Übersicht fragt nach jedem alten befristeten Vertrag.

Fix: Die genannten Punkte in die Zeile «Left low» aufnehmen (je mit Kürzel, wie die übrigen) und bei A-6 in `anforderungen-vertragsende.md` einen Satz ergänzen: «Für die Grenze aus A-1.5 braucht es einen festen Stichtag (Konstante) oder ein Datum am Vertrag; Dwello speichert heute keines.»

### J2-6 (niedrig) Kommentare über dem falschen Code

- `backend/src/services/contract.service.ts:270-276`: `checkNotice` ist zwischen den JSDoc «Create a new contract» und `createContract` eingefügt. Der Kommentar steht jetzt über `checkNotice`, direkt gefolgt von dessen eigenem JSDoc; `createContract` hat keinen mehr.
- `backend/src/__tests__/demo-data.pg.test.ts:129-139`: Der neue Test steht zwischen dem Kommentar «Bei einem Mieterwechsel erhält jeder Mietvertrag eine eigene Abrechnung über seine Mietstage» und dem Test, zu dem er gehört.

Fehlerszenario: Wer `contract.service.ts` liest, hält «Create a new contract» für die Beschreibung von `checkNotice`; im Test erklärt der Kommentar zum Mieterwechsel den Test zu den Vormietern.

Fix: `checkNotice` samt JSDoc über den Kommentar «Create a new contract» setzen; den neuen Test über den Kommentar zum Mieterwechsel setzen.

## Dokumente

- `api-specification.md`: J-2 eingetragen; zum Widerspruch siehe J2-1.
- `anforderungen-vertragsende.md`, A-1 «Umgesetzt»: Die Mietvertragsliste stimmt jetzt. Zum Satz über «Befristet» siehe J2-4; der Satz zu den Demodaten stimmt (A-1.5 bleibt, Entscheid des Product Owners).
- `offene-punkte.md`: «Fixed after …» ist richtig (J-1, J-2, J-3, Sven M1, Anna m2/Sven m4, Anna M2/J-8). «Left low» ist unvollständig (J2-5).
- `implementation_plan.md`, Session 15: Der Eintrag nennt alle Fixes; «stricter scenarios and a per-contract scenario (J-5)» verschweigt, dass der Test für Wohnung und Mieter fehlt (J2-2).
- `tests/contracts/README.md`: beide neuen Beispiele eingetragen.
