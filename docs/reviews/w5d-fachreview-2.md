# Fachreview #133 «Abgerechnet bis»: Umsetzung (Commit fd56594), Runde 2

Gegenstand: `git diff c3d7758 fd56594` im Worktree `review-w5d-fach2`, dazu die Bildschirme Mietvertrag bearbeiten, Mietvertragsdetail, Vorschau des Abrechnungslaufs und das PDF der Abrechnung.
Quellen: `UBIQUITOUS_LANGUAGE.md:46-47, 159`, `docs/design/i18n-begriffe.md`, Issue #133 (Entscheid und Kommentar vom 16.10.2026), #325, #327, #328, Runde 1 (`docs/reviews/w5d-fachreview-1.md`). Die Fedlex-Zitate sind dieselben wie in Runde 1 (am 16.10.2026 aus dem Fedlex-Filestore abgerufen: VMWG, Stand 1.10.2025; OR, Stand 1.10.2026).

## Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-10 | Verwalter | Major | Ein Entwurf, den «Abgerechnet bis» ganz abdeckt (der Hauptfall von #133), wird mit dem Satz «… und die Nebenkostenabrechnung danach neu erstellen» gelöscht, und danach öffnet sich der Assistent. Für diese Periode darf es aber keine Abrechnung geben |
| V-11 | Verwalter | Minor | Der Ablehnungstext spricht von den «bisherigen Vertragsdaten» und von «das Datum». Er nennt «Abgerechnet bis» nicht, und bei einem geleerten Feld gibt es kein Datum zum Prüfen |
| V-12 | Verwalter | Minor | «Abgerechnet bis» wird nicht auf Plausibilität geprüft. Ein Datum in der Zukunft (Tippfehler im Jahr) lässt Abrechnungen still wegfallen |
| V-13 | Verwalter | Nit | Die Vorschau sagt weiterhin «Den Anteil leerer Wohnungen trägt der Vermieter …». Die ausserhalb abgerechneten Tage fehlen im Betrag ebenfalls, der Satz sagt das nicht (gehört zu #327) |
| V-14 | Verwalter | Nit | Der Fall «Abgerechnet bis» mitten im Monat (Akonto als Teilmonat) prüft kein Test. Der Code rechnet ihn richtig |

Keiner der Befunde aus Runde 1 ist noch offen, ausser denen in den Issues #325, #327 und #328 (siehe «Runde 1»).

---

### V-10 (Major): Ein vollständig abgedeckter Entwurf soll «neu erstellt» werden

**Beleg.**
- `backend/src/services/contract.service.ts` (`checkNewDates`): Eine Änderung von `billedUntil`, die die Mietstage eines Entwurfs ändert, ergibt eine 409 mit dem Entwurf. Ist der Entwurf die einzige betroffene Abrechnung, wird er mit `deleteDraft` gelöscht.
- `src/lib/contract-status.ts:170` → `messages/de.json:1414` `contracts_billed_draft_one`: «… wurde mit den bisherigen Vertragsdaten berechnet. Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen.»
- `messages/de.json:1472` `contracts_delete_draft_consequence`: «Der Entwurf {number} wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.»
- `src/routes/contracts/ContractForm.svelte:176`: Nach dem Löschen leitet `put(wizardLink(draft.buildingId, draft.periodStart, draft.periodEnd), draft.id)` in den Assistenten dieser Periode weiter.

**Warum falsch.** Genau so entsteht #133 (Problem: «every Abrechnungslauf for that period creates a new draft for it»). Der Liegenschaftsverwalter hat schon einen Lauf 2024 gemacht, Dwello hat einen Entwurf für Eva Frei erstellt, obwohl 2024 ausserhalb abgerechnet ist. Jetzt trägt er «Abgerechnet bis 31.12.2024» ein. Dwello verlangt dann, den Entwurf zu löschen und die Abrechnung «danach neu» zu erstellen, und öffnet den Assistenten für 2024. Dort fehlt Eva (`billsIn`), oder die Vorschau meldet «keine Mietverträge». Die Bestätigung einer nicht umkehrbaren Löschung nennt also eine falsche Folge (CLAUDE.md, Design-Regeln: «Irreversible actions confirm with their real consequence»). Ein unerfahrener Verwalter, der eine Abrechnung erwartet, sucht danach einen Fehler. Am Betrag ändert sich nichts, deshalb Major und nicht Blocker.
Liegt «Abgerechnet bis» *innerhalb* der Periode des Entwurfs (zum Beispiel 29.02.2024), ist der heutige Text richtig, denn dann wird die Abrechnung ab dem 01.03. wirklich neu erstellt.

**Behebung.** Im BFF (`ContractForm.svelte`, `billedDaysError`) unterscheiden, ob `billsIn({ ...values, billedUntil }, { start: draft.periodStart, end: draft.periodEnd })` noch wahr ist:
- wahr: wie heute;
- falsch: Text zum Beispiel «Der Entwurf {number} rechnet Tage ab, die Sie jetzt als ausserhalb von Dwello abgerechnet eintragen. Löschen Sie den Entwurf. Für diese Abrechnungsperiode erstellt Dwello keine Abrechnung.» und als Folge «Der Entwurf {number} wird gelöscht.». Danach auf die Vertragsseite zurück, nicht in den Assistenten.
Dazu ein Szenario in `contract-edit.feature` (Entwurf 2024 vorhanden, «Abgerechnet bis 31.12.2024», Entwurf löschen, kein Assistent, kein Hinweis «… neu erstellen») und die Texte in vier Sprachen. Die Wörter sind aus dem Glossar (Entwurf, Abrechnungsperiode, «Abgerechnet bis»).

### V-11 (Minor): Der Ablehnungstext nennt «Abgerechnet bis» nicht

**Beleg.** `messages/de.json:1410-1412`: «Die Nebenkostenabrechnung {numbers} wurde mit den bisherigen Vertragsdaten berechnet. Dwello ändert sie nicht, darum lässt sich das Datum nicht speichern. Prüfen Sie das Datum. Stimmt es, klären Sie die Korrektur der Abrechnung direkt mit dem Mieter.» Der Text steht oben im Formular (`errors.form`). Der pg-Test lehnt auch `billedUntil: null` ab (`billed-until.pg.test.ts:144`).

**Warum.** Ändert der Verwalter nur «Abgerechnet bis», versteht er «das Datum» meist richtig. «Abgerechnet bis» ist ein Feld am Mietvertrag, also zählen auch «Vertragsdaten» noch. Zwei Fälle lesen sich aber falsch:
- Er hat das Feld geleert: «lässt sich das Datum nicht speichern. Prüfen Sie das Datum», aber es gibt kein Datum.
- Er hat Vertragsende und «Abgerechnet bis» zusammen geändert: Der Text sagt nicht, welches Datum die Abrechnung trifft.
Inhaltlich stimmt die Ablehnung. Ein versendetes NK für Tage, die jetzt als ausserhalb abgerechnet gelten, wäre eine doppelte Abrechnung. «klären Sie die Korrektur der Abrechnung direkt mit dem Mieter» ist dafür der richtige Rat (Art. 257b Abs. 1 OR: «die tatsächlichen Aufwendungen des Vermieters»).

**Behebung.** Hat sich nur «Abgerechnet bis» geändert (das BFF kennt den Anfangswert), einen eigenen Satz statt `contracts_billed_locked_rest`, zum Beispiel «Dwello ändert sie nicht, darum lässt sich «Abgerechnet bis» nicht ändern. Prüfen Sie «Abgerechnet bis». Stimmt es, klären Sie die Korrektur der Abrechnung direkt mit dem Mieter.» Das gilt auch für ein geleertes Feld. Sonst bleibt alles wie heute. Ein Unit-Test für `billedDaysError` mit diesem Fall.

### V-12 (Minor): Keine Plausibilitätsprüfung

**Beleg.** `backend/src/routes/contracts.ts:63`: nur `format: 'date'`. In `contract-form.ts` gibt es keine Prüfung für `billedUntil`.

**Warum.** Abrechnen kann man nur Tage, die vorbei sind. Ein «Abgerechnet bis» nach heute ist praktisch immer ein Tippfehler (2052 statt 2025). Die Folge zeigt sich still und erst Monate später: Der Hinweis auf fehlende Abrechnungen schweigt, und der Lauf übergeht den Mieter. Der Mieter erhält dann keine Abrechnung, obwohl Art. 4 Abs. 1 VMWG verlangt: «… muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Das Zeigen auf der Vertragsseite (`contract-billed-until`) mildert das, deshalb nur Minor.

**Behebung.** Im Formular ein Datum nach heute ablehnen, mit einem Fehler am Feld, zum Beispiel ««Abgerechnet bis» liegt in der Zukunft. Tragen Sie den letzten Tag der letzten Abrechnung ausserhalb von Dwello ein.» Mit einem Test. Wenn das nicht in #133 gehört: ein Issue `fachlich`.

### V-13 (Nit): Hinweis zum Gesamtbetrag in der Vorschau

**Beleg.** `PreviewStep.svelte:57`, `messages/de.json:1130`: «Den Anteil leerer Wohnungen trägt der Vermieter; er ist in diesem Betrag nicht enthalten.»

**Warum.** Die Tage bis «Abgerechnet bis» verrechnet Dwello niemandem. Das ist richtig, denn sie sind ausserhalb abgerechnet. Die Summe ist dann aber auch ohne Leerstand kleiner als die Kosten der Liegenschaft, und der Satz erklärt das nicht. Das gehört zu #327 (Vorschau erklärt «Abgerechnet bis»). Ein Kommentar dort genügt.

### V-14 (Nit): Akonto im Teilmonat nicht getestet

**Nachgerechnet** mit `calculateTotalAdvancePayments` (`calculation.service.ts:228-247`), das jetzt `overlapStart` = Tag nach «Abgerechnet bis» erhält (`prorating.service.ts:160`). Eva, abgerechnet bis 15.03.2024, 120.00 Akonto: Akonto 16/31 × 120.00 = 61.94, Kosten 16 × 2.00 = 32.00 + 0.96 = 32.96, Saldo −28.98, auf 5 Rappen −29.00. Der Code rechnet das so (`roundToRappen`, `pdf-format.ts:17`: 61.935… → 61.94). Der pg-Test prüft nur ganze Monate (01.05.2024, `billed-until.pg.test.ts:105`). Ein `expect` mit `billedUntil('2024-05-15')` (231 Tage, Akonto 100 × (17/31 + 7) = 754.84) würde den Teilmonat absichern. Optional.

---

## Runde 1: Stand der Behebungen

| Runde 1 | Stand | Beleg |
|---|---|---|
| V-1 Akonto | **behoben** | `statement-generate.feature` neu: Eva 120 Akonto, «Rückerstattung CHF 56.15». Nachgerechnet: 63.86 − 120.00 = −56.14 → −56.15. Ohne die Regel wären es 3 × 120 und −296.15, das Szenario unterscheidet also. pg-Test: 245 Tage, 8 × 100 = 800 |
| M-1 PDF | **behoben**, Wortlaut offen in #325 | `pdf.service.ts:83` `tenancyBilledLine`, `statement-pdf.service.ts` `billedOf`. Der pg-Test prüft «Ihr Mietverhältnis in dieser Periode: 01.01.2024 – 31.12.2024. Abgerechnet bis 30.04.2024; diese Abrechnung umfasst 01.05.2024 – 31.12.2024 (245 Mietstage von 366 Tagen)». Grenzfälle in `billedOf` geprüft (siehe «Bestätigt»). Die Detailseite der Abrechnung (`PartiesPanel.svelte:40`) zeigt nur die Zahl der Mietstage, das ist richtig. Die Listenzeile (`StatementRow.svelte:46`) zeigt «01.03.2024 – 31.03.2024, 31 Mietstage», also die abgerechneten Tage. Für den Verwalter ist das richtig, der Mieter sieht sie nicht |
| V-2 Sperre | **behoben**, Texte siehe V-10/V-11 | `checkNewDates` rechnet mit `billingStart` aus gespeichertem und neuem `billedUntil`. Der pg-Test nimmt ein neues Vertragsende an, wenn die versendete Abrechnung (ab 01.05.) bleibt, und lehnt «2024-06-30» und `null` ab. Die Kündigung (`endOn`, ohne `billedUntil`) behält das gespeicherte Datum (`newDates` filtert `undefined`) |
| V-3 Grenze | **behoben** | Szenario 1: Marc Huber bis 2024-12-31 = Periodenende, nur Eva bleibt. pg-Test: `CONTRACT_NOT_IN_PERIOD` bei «Abgerechnet bis» = Periodenende |
| V-4 Periode darüber hinaus | **behoben** | `contract-actions.test.ts`: abgerechnet bis 30.06. des Vorjahres. Das Vorvorjahr ist übergangen, Vorjahr und laufendes Jahr fehlen weiter |
| V-5 Hilfetext | **behoben** | `messages/de.json` `contracts_billed_until_help` ist wörtlich der Vorschlag. FR/IT/EN siehe unten |
| V-6 Vorschau | Issue #327 (`produkt`, `entscheiden`) | passt, Ergänzung V-13 |
| V-7 Assistent | Satz geprüft (`contract-detail.feature`), Feld: Issue #328 | passt |
| V-8 Glossar | Issue #325 (`fachlich`, `entscheiden`) | passt. `glossary_days_text` bleibt bis zum Entscheid unverändert |
| V-9 Marc Huber, Heizprofil | **behoben** | Szenario: Marc «CHF 504.70» (245 × 2.00 = 490.00 + 14.70). pg-Test Heizprofil Mai–Dez. 2+0+0+0+2+8+14+26 = 52 % → 520.00 |

## Texte FR/IT/EN gegen `i18n-begriffe.md`

Geprüft: `contracts_billed_until`, `contracts_billed_until_help`, `contracts_statement(s)_missing_billed_elsewhere`, `tenancyBilledLine`.
- FR: contrat de bail, frais accessoires, période de décompte, décompte, établir, jours de location, acomptes versés, alles wie in der Tabelle. Guillemets mit geschütztem Leerzeichen (U+00A0, geprüft mit `od`), auch vor «:» und «?». Im PDF gibt es kein geschütztes Leerzeichen vor «;», das ist wie bei den bestehenden FR-Zeilen im PDF.
- IT: contratto di locazione, spese accessorie, periodo di conteggio, conteggio, allestire, giorni di locazione, acconti versati, Lei-Form («Compili», «Inserisca»). Guillemets ohne Leerzeichen. Richtig.
- EN: rental contract, utility costs, billing period, statement, days rented, advance payments made. «» wie in den übrigen EN-Texten (73 Stellen). Richtig.
- «Abgerechnet bis» FR «Décompté jusqu’au», IT «Conteggiato fino al», EN «Billed until»: Die Zeile in `i18n-begriffe.md:65` ist mit ❓ (#325) markiert. Das ist richtig, solange der Produktverantwortliche nicht entschieden hat.
- Inhalt: Alle drei Hilfetexte sagen dasselbe wie der deutsche (letzter Tag, Beispiel 30.06.2024, keine Abrechnung bis dahin, Mietstage und geleistete Akontobeiträge ab dem Tag danach).

## Bestätigt

- **Eine Regel an allen Stellen:** `billingStart` (Backend) und `billsIn` (BFF) rechnen beide «später von Vertragsbeginn und Tag nach «Abgerechnet bis»» (`billedUntil >= startDate`). Verwendet für Mietstage (`handleMultipleContracts`), Akonto (`overlapStart`), Mietstage der Position (`rentedIn`), Heizprofil (`handleMidYearMoves`, auch `heatingOfRun` fürs PDF), den Lauf (`contractsOf`), den Hinweis auf fehlende Abrechnungen und die Sperre. Schalttag: `daysAfter('2024-02-29', 1)` = 2024-03-01.
- **Andere Mieter unverändert:** Marc Huber 504.70 mit und ohne «Abgerechnet bis» von Eva. Anteile je Vertrag, keine Normierung. Die Tage vor dem ersten abgerechneten Tag trägt niemand, also keine Überverteilung (Art. 257b Abs. 1 OR: «die tatsächlichen Aufwendungen des Vermieters»).
- **`billedOf` im PDF:** Die neue Zeile erscheint nur, wenn `billingStart(contract) === statement.rentalStart` und das Mietverhältnis in der Periode früher beginnt. Geprüft: «Abgerechnet bis» vor der Periode (31.12.2023 bzw. 30.06.2023 bei Periode 2024) ergibt die alte Zeile. Ein Einzug in der Periode mit «Abgerechnet bis» danach nennt den Vertragsbeginn. Ein «Abgerechnet bis» vor dem Vertragsbeginn hat keine Wirkung. Weil die Sperre jede Änderung ablehnt, die `rental_start` ändern würde, passt das aktuelle `billedUntil` des Vertrags immer zur gespeicherten Abrechnung.
- **Sperre für frühere Dwello-Abrechnungen:** Ein «Abgerechnet bis» nach einer versendeten Dwello-Abrechnung (zum Beispiel 2023 versendet, dann bis 30.06.2024 eingetragen) wird abgelehnt (`greatest(…) <> rental_start`). Das ist richtig, sonst wäre 2023 doppelt abgerechnet.
- **Backend setzt die Regel auch ohne Lauf durch:** `CONTRACT_NOT_IN_PERIOD` bei einer ganz abgedeckten Periode (pg-Test). Damit ist ein Punkt aus Runde 1 «Nicht bestätigt» erledigt.
- **Vertragsseite:** Die Zeile «Abgerechnet bis» erscheint nur, wenn das Datum gesetzt ist (`ContractTerms.svelte:60`).
- **Mietrecht:** Eine kürzere Abrechnung für den Rest der Periode ist zulässig (Art. 4 Abs. 1 VMWG: «jährlich mindestens einmal»). Die Mietdauer im PDF ist nicht mehr falsch (M-1).

## Fehlende Begriffe

Keine neuen. Die Texte für V-10 und V-11 verwenden nur Glossarwörter (Entwurf, Abrechnungsperiode, «Abgerechnet bis»). Die offenen Wortlaute liegen in #325. Ich schlage vor, V-10 und V-11 dort oder in einem neuen Issue `fachlich` zu ergänzen, falls sie nicht in #133 behoben werden.

## Nicht bestätigt

- **E2E-Lauf:** Ich habe keine Tests ausgeführt (nur gelesen, Review ohne Änderungen). Ob die drei neuen Szenarien und der pg-Test grün sind, ist nicht geprüft. Die Zahlen der Szenarien habe ich von Hand nachgerechnet.
- **Folgen der rechtlichen Abrechnungsperiode und Heizöl-Tankbestand bei «Abgerechnet bis» mitten in der Periode:** wie in Runde 1 unverändert offen (Fedlex: OR Art. 257a–257c, VMWG Art. 4 und 8 ohne einschlägigen Wortlaut).
- **Meldung `backend_contract_not_in_period`** («Der Mietvertrag liegt nicht in der Abrechnungsperiode …») bei einem ausserhalb abgerechneten Mietvertrag: Der Grund stimmt nicht genau. Erreichbar ist sie nur über eine veraltete Seite oder direkt über die API, weil das BFF solche Verträge vorher übergeht (`contractsOf`). Ob es einen anderen Weg in der UI gibt, habe ich nicht vollständig geprüft (gesucht in `src/routes/statements`).
- **Dashboard und Rechnungsformular** (#211): weiterhin ohne «Abgerechnet bis», ausserhalb von #133 entschieden.
