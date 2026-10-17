# Fachreview #133, Runde 3: Behebung von V-10

Worktree `review-w5d-fach3`, Commit f85b076 (Merge von `origin/main`). Delta `e130340..1bf9585` in `src/routes/contracts`, `messages/*.json`, `contract-edit.feature`, `contract-edit.dom.test.ts`. Der Merge 1bf9585..f85b076 ändert `ContractForm.svelte` und `RefusedStatements.svelte` nicht, die Behebung steht in f85b076 unverändert (`ContractForm.svelte:116-143, 203-206`).

**Ergebnis: V-10 ist behoben.** Der Fall aus #133 («Abgerechnet bis» deckt die ganze Periode eines Entwurfs ab) nennt jetzt die richtige Folge und öffnet den Assistenten nicht mehr. Neu sind zwei Minor und ein Nit. Ein weiterer Minor bestand schon vor der Änderung.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-10 | Verwalter | (Major) | **behoben** |
| V-15 | Verwalter | Minor | Die neue Meldung gilt für jeden Entwurf, für den `billsIn` falsch wird, also auch für ein Vertragsende vor der Periode. Dort nennt sie einen falschen Grund («die Sie jetzt als ausserhalb von Dwello abgerechnet eintragen») |
| V-16 | Verwalter | Minor | «Für diese Abrechnungsperiode erstellt Dwello keine Abrechnung» klingt, als gäbe es für die ganze Periode keine Abrechnung. Gemeint ist nur dieser Mietvertrag. Der Wortlaut ist mein eigener Vorschlag aus Runde 2 |
| V-17 | Verwalter | Minor (bestand schon vorher) | «Beenden» auf der Vertragsseite mit einem Vertragsende vor der Periode des Entwurfs: weiterhin «Erstellen Sie jetzt die Nebenkostenabrechnung neu» und Weiterleitung in den Assistenten |
| V-18 | Verwalter | Nit | Das Szenario prüft nicht, dass der Entwurf weg ist |

---

## V-10: bestätigt behoben

- **Bedingung.** `covered(draft)` = `!billsIn({startDate, endDate, billedUntil}, {periodStart, periodEnd})` (`ContractForm.svelte:118-126`). `onlyCovered` verlangt genau einen Entwurf. Das passt zum Backend: `onlyDraft` (`contract.service.ts:375`) löscht nur dann. Bei mehreren Abrechnungen oder einer versendeten bleibt `billedDaysError` (Ablehnung ohne Löschangebot). Das ist richtig.
- **Grenzen nachgerechnet** (`billsIn`, `contract-status.ts:23-35`, Periode 01.01.–31.12.2025, Vertragsbeginn vor 2025, unbefristet):
  - «Abgerechnet bis» 31.12.2025 → from = 2026-01-01 > 2025-12-31 → `billsIn` falsch → neuer Text, zurück zur Vertragsseite. Das entspricht dem Glossar («übergehen Abrechnungsperioden, die bis dahin enden»).
  - 30.12.2025 → from = 31.12.2025 ≤ 31.12.2025 → wahr → alter Text, Assistent. Richtig: Ein Mietstag bleibt abzurechnen.
  - 30.06.2025 → wahr → alter Text (Szenario «Abgerechnet bis» nach dem Beginn einer Abrechnung). Richtig.
  - Feld geleert (`null`) → from = Vertragsbeginn → wahr → alter Text. Richtig, die Periode wird wieder abgerechnet.
  - «Abgerechnet bis» vor dem Vertragsbeginn → keine Wirkung (`until >= begin`), gleich wie `billingStart` im Backend.
- **Folge vor dem Löschen:** `contracts_delete_draft_covered_consequence` ersetzt die Standardfolge (`RefusedStatements.svelte:38`) und ist über `aria-describedby` an der Schaltfläche (DOM-Test). Das erfüllt «Irreversible actions confirm with their real consequence».
- **Danach:** `deleteDraftAndSave` geht nach `back` (`/contracts/{id}`) statt `wizardLink` (Z. 203-206). Die Meldung danach lautet «Mietvertrag von {name} gespeichert» (`contracts_saved_toast`) und enthält kein «neu erstellen». Die Vertragsseite zeigt für 2025 keinen Hinweis auf fehlende Abrechnungen, weil «Abgerechnet bis» die Periode abdeckt. Das ist widerspruchsfrei.
- **Tests:** Der DOM-Test prüft Text, Folge, kein «neu erstellen» und `goto('/contracts/c1')`. Das Szenario `contract-edit.feature:103-110` prüft Meldung, Detailseite und «Abgerechnet bis 31.12.2025». Beide Zweige (ganz abgedeckt / teilweise) haben je ein Szenario. Die Tests habe ich nicht ausgeführt.
- **Texte FR/IT/EN** gegen `i18n-begriffe.md` (Zeilen 58, 65, 67):
  - FR: brouillon, période de décompte, décompte, établir; «décompter» als Verb wie in `contracts_billed_until_help` («Dwello ne décompte qu’à partir…»). Apostroph typografisch (’). Richtig.
  - IT: bozza, periodo di conteggio, conteggio, allestire, Lei-Form («indica», «Elimini»). Richtig.
  - EN: draft, billing period, statement, «creates no statement» wie im Hilfetext. Richtig.
  - Alle drei sagen inhaltlich dasselbe wie der deutsche Text. Ob V-16 umgesetzt wird, betrifft alle vier Sprachen.
- **Glossar:** Entwurf, Abrechnungsperiode, Abrechnung, Mietvertrag. Keine neuen Begriffe. «ausserhalb von Dwello abgerechnet» ist der Wortlaut des Glossareintrags «Abgerechnet bis» (`UBIQUITOUS_LANGUAGE.md:47`).

---

## V-15 (Minor): Falscher Grund bei einem Vertragsende vor der Periode

**Beleg.** `covered` fragt nur, ob der Vertrag die Periode nach den neuen Formularwerten noch abrechnet (`ContractForm.svelte:118-126`). Das Backend lehnt jede Datumsänderung ab, die die Mietstage eines Entwurfs ändert (`checkNewDates`, `contract.service.ts:361-372`: `startDate`, `endDate` und `billedUntil`).

**Fall.** Ein Mieter ist Ende 2024 ausgezogen. Der Liegenschaftsverwalter hat das Vertragsende nicht eingetragen, und der Abrechnungslauf 2025 hat einen Entwurf erstellt. Im Bearbeitungsformular trägt er jetzt das Vertragsende 31.12.2024 ein (vergangenes Vertragsende, bestätigt).
`billsIn`: from = Vertragsbeginn, to = 2024-12-31; max(from, 2025-01-01) = 2025-01-01 > min(2024-12-31, 2025-12-31) → falsch → `covered`. Die Meldung lautet dann «Der Entwurf NK-2025-… rechnet Tage ab, die Sie jetzt als ausserhalb von Dwello abgerechnet eintragen». Er hat aber kein «Abgerechnet bis» eingetragen. Das gilt auch für einen Vertragsbeginn, der hinter das Periodenende verschoben wird.
Folge und Weiterleitung stimmen in diesem Fall (kein Mietstag mehr in 2025, also keine Abrechnung, zurück zur Vertragsseite). Der Grund ist falsch, und ein unerfahrener Verwalter sucht dann einen Fehler im Feld «Abgerechnet bis». Am Betrag ändert sich nichts, deshalb Minor.

**Behebung.** Den neuen Text nur zeigen, wenn erst «Abgerechnet bis» die Periode ausschliesst:
`covered = billsIn({ startDate, endDate }, period) && !billsIn({ startDate, endDate, billedUntil }, period)`.
Für den Fall «Vertrag liegt nicht mehr in der Periode» die Folge «Der Entwurf {number} wird gelöscht. Für {name} erstellt Dwello für diese Abrechnungsperiode keine Abrechnung.» und die Rückkehr zur Vertragsseite behalten, aber mit einem eigenen Grund. Vorschlag: «Der Entwurf {number} rechnet Mietstage ab, die nach den neuen Vertragsdaten nicht mehr im Mietvertrag liegen. Löschen Sie den Entwurf.» Neuer Text, also vier Sprachen und ein DOM-Test (Vertragsende 31.12.2024, Entwurf 2025).

## V-16 (Minor): «Für diese Abrechnungsperiode … keine Abrechnung» ist zu weit

**Beleg.** `messages/de.json` `contracts_billed_draft_covered` und `contracts_delete_draft_covered_consequence`: «Für diese Abrechnungsperiode erstellt Dwello keine Abrechnung.» Das Glossar sagt: «**Nebenkostenabrechnung** | Jährliche Abrechnung … pro Mietvertrag» (`UBIQUITOUS_LANGUAGE.md:148`).

**Warum.** Die Abrechnungen der anderen Mietverträge im Gebäude für 2025 entstehen weiterhin. Ein Verwalter mit mehreren Wohnungen kann den Satz so lesen, als sei 2025 für das ganze Gebäude erledigt. Den Wortlaut habe ich in Runde 2 selbst vorgeschlagen. Er ist trotzdem zu weit.

**Behebung.** Den Mietvertrag nennen, zum Beispiel:
- Meldung: «Der Entwurf {number} rechnet Tage ab, die Sie jetzt als ausserhalb von Dwello abgerechnet eintragen. Löschen Sie den Entwurf. Für diesen Mietvertrag erstellt Dwello in dieser Abrechnungsperiode keine Abrechnung.»
- Folge: «Der Entwurf {number} wird gelöscht. Für diesen Mietvertrag erstellt Dwello in dieser Abrechnungsperiode keine Abrechnung.»
- FR «Pour ce contrat de bail, Dwello n’établit pas de décompte pour cette période de décompte.», IT «Per questo contratto di locazione Dwello non allestisce alcun conteggio per questo periodo di conteggio.», EN «Dwello creates no statement for this rental contract in this billing period.»

Die DOM-Prüfung `toContain('Für diese Abrechnungsperiode …')` und die Szenariozeile `contract-edit.feature:107` müssen dann mit.

## V-17 (Minor, bestand schon vorher): «Beenden» mit einem Vertragsende vor der Periode des Entwurfs

**Beleg.** `src/routes/contracts/[id]/+page.server.ts`: `endOn` → `billedDaysError(refused)` («… danach neu erstellen»). Nach dem Löschen folgt `toWizard` (Weiterleitung in den Assistenten der Periode). `+page.svelte:93` zeigt `contracts_draft_deleted_toast` («Erstellen Sie jetzt die Nebenkostenabrechnung neu.»).

**Warum.** Das ist dieselbe Lage wie in V-15, nur über «Beenden». Liegt das Vertragsende vor dem Beginn der Periode des Entwurfs, gibt es für diesen Mietvertrag keine Abrechnung mehr. Dwello verlangt trotzdem eine neue und öffnet den Assistenten. Den Fehler gibt es schon auf dem Basis-Commit. Mit «Abgerechnet bis» hat er nichts zu tun, und die Änderung macht ihn nicht sichtbarer. Er gehört also nicht zu #133 und wird ein Issue (`fachlich`).

**Behebung.** Dieselbe Prüfung wie im Formular (`billsIn` mit dem neuen Vertragsende). Ist sie falsch, die Folge aus V-15/V-16 verwenden und auf die Vertragsseite zurückkehren statt `toWizard`. Der Hinweis «neu erstellen» entfällt dann.

## V-18 (Nit): Szenario ohne Nachweis, dass der Entwurf gelöscht ist

**Beleg.** `contract-edit.feature:103-110` endet mit Detailseite und «Abgerechnet bis». Den Schritt «findet die Abrechnungsliste keine Abrechnung 2025 von "Anna Keller"» gibt es bereits (Z. 101).

**Behebung.** `Und findet die Abrechnungsliste keine Abrechnung 2025 von "Anna Keller"` anhängen.

---

## Fehlende Begriffe

Keine. Die Texte aus V-15 und V-16 verwenden nur Glossarwörter (Entwurf, Mietvertrag, Mietstage, Abrechnungsperiode, Abrechnung). Die offenen FR/IT/EN-Wortlaute für «Abgerechnet bis» liegen weiter in #325.

## Nicht bestätigt

- **Testlauf:** Ich habe weder den DOM-Test noch das Szenario ausgeführt (Review nur lesend). Die Grenzfälle habe ich von Hand mit `billsIn` nachgerechnet.
- **Rechtliche Seite:** Diese Runde stellt keine neue rechtliche Behauptung auf. Die Löschung eines unversendeten Entwurfs betrifft den Mieter nicht. Die Aussage aus Runde 2 zu Art. 257b Abs. 1 OR bleibt unverändert.
- **V-15 im Backend:** Dass `statementsChanged` den Entwurf 2025 bei einem Vertragsende 31.12.2024 meldet, habe ich aus `checkNewDates` (`contract.service.ts:369`) gefolgert. Die SQL von `statementsChanged` habe ich nicht im Einzelnen nachgelesen. Meldet sie den Entwurf nicht, tritt V-15 nicht auf, dafür aber eine stille Abweichung zwischen Entwurf und Vertrag.
- **Merge f85b076:** Die aus `main` übernommenen Änderungen (`FixedTermCheck.svelte`, `[id]/+page.server.ts`, Nachrichten) habe ich nur darauf geprüft, ob sie die Behebung berühren. Das tun sie nicht. Fachlich geprüft habe ich sie nicht.
