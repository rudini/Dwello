# Fachreview 1 zu #453 «Abgerechnet bis» (vor der Umsetzung)

Gegenstand: @wip-Szenarien in df62c688 (Worktree `review-453-fach`), geplante Texte `453-texte.md`, Randfälle. Grundlage: Issue #453, Entscheid im Kommentar 6249569443 (Punkte 3 bis 6), `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, Code im Worktree (`pdf.service.ts`, `statement-pdf.service.ts`, `contract.service.ts`, `prorating.service.ts`, `messages/*.json`).

## Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Text «Alle Mietverträge von {Gebäude} sind … schon ausserhalb von Dwello abgerechnet» erscheint laut Plan, sobald die Vorschau eines Gebäudes leer ist. Das ist falsch, wenn ein Teil schon eine Abrechnung in Dwello hat und nur der Rest übergangen ist. |
| V-2 | Verwalter | Minor | Welche Mietverträge «übergangen» sind, ist nicht festgelegt. Auch «Abgerechnet bis» nach dem Vertragsende, aber vor dem Periodenende, lässt keine Mietstage übrig (`prorating.service.ts:160-176`, `proration` = null). Ohne Zeile wäre der Mietvertrag still weg (das Problem von #327). Lösung: übergangen = Mietvertrag in der Periode ohne Mietstage wegen «Abgerechnet bis»; dazu ein Backend-Test mit Eva Frei bis 30.06.2024. |
| V-3 | Verwalter | Minor | Glossar «Abgerechnet bis» (`UBIQUITOUS_LANGUAGE.md:48`) nennt nur «Abrechnungsperioden, die bis dahin enden», nicht den Fall von V-2. Vorschlag siehe «Fehlende Begriffe»; Issue mit `fachlich`, `entscheiden`. |
| V-4 | Verwalter | Minor | it Seite 2 (`heatingMonths`, `partProfile`, NEW) sagt «della sua locazione», die entschiedene Zeile zum Mietverhältnis dagegen «Il suo rapporto di locazione». Lösung: «Quote dei mesi conteggiati del suo rapporto di locazione: {months}» bzw. «… del suo rapporto di locazione in tale periodo: …». |
| V-5 | Verwalter | Minor | «(am Mietvertrag)» als fr «(dans le contrat de bail)», it «(nel contratto di locazione)», en «(on the rental contract)» liest sich wie eine Angabe im unterschriebenen Vertrag. Gemeint ist das Feld in Dwello. Lösung: fr «(saisi pour le contrat de bail)», it «(registrato per il contratto di locazione)», en «(entered for the rental contract)». So schon fr `glossary_days_text`, «indiqué pour le contrat de bail». |
| V-6 | Verwalter | Minor | Assistent: Was mit einem eingetragenen «Abgerechnet bis» geschieht, wenn der Vertragsbeginn danach auf heute oder später geändert wird (Feld verschwindet), ist offen. Lösung: Ein ausgeblendetes Feld wird nicht gesendet und nicht in der Prüfung gezeigt; DOM-Test. |
| M-1 | Mietrecht | Minor | Die Prüfung im Backend muss die zusammengeführten Werte nehmen (gespeichert + neu, wie `newDates`, `contract.service.ts:362-373`). Auch ein späterer Vertragsbeginn in «Mietvertrag bearbeiten» hinter ein gespeichertes «Abgerechnet bis» wird abgelehnt. Lösung: Backend-Test «Vertragsbeginn nach Abgerechnet bis». |
| M-2 | Mietrecht | Minor | Die Grenzwerte fehlen als Tests: «Abgerechnet bis» = heute (Europe/Zurich) und = Vertragsbeginn sind erlaubt, heute + 1 und Vertragsbeginn − 1 werden abgelehnt. Gehört in den Backend-Test der beiden Ablehnungen. |
| V-7 | Verwalter | Nit | en `tenancyLine` bleibt «({days} of {total} days)», die neue Zeile sagt «(31 of 366 days rented)». Angleichen an «days rented» (Begriff `i18n-begriffe.md:84`). |
| V-8 | Verwalter | Nit | fr Grammatik und Stil (NEW): nach «{name} :» klein weiter («décompté jusqu’au»); «Dwello n’établit aucun décompte»; «ont déjà été décomptés» statt «sont déjà décomptés» (Warnung im Assistenten); Ablehnung vor dem Beginn besser «est antérieur au début du contrat ({date})» statt «se situe avant le début du contrat, le {date}». |
| V-9 | Verwalter | Nit | it Grammatik und Stil (NEW): «sono già state conteggiate» statt «sono già conteggiate»; «è anteriore all’inizio del contratto ({date})» statt «è prima dell’inizio del contratto, il {date}»; «non può essere una data futura». |
| V-10 | Verwalter | Nit | en Ablehnung vor dem Beginn: «is before the contract start on {date}» oder «… ({date})». |
| V-11 | Verwalter | Nit | In `453-texte.md` stehen in fr normale Leerzeichen vor «:», «;» und in « ». Im Code wie bestehend ` ` verwenden (`pdf.service.ts:172`, `messages/fr.json:1653`), auch in `tenancyBilledLine` fr. |
| V-12 | Verwalter | Nit | Teilmonat: Das PDF sagt nicht, wie z. B. CHF 61.94 (120 × 16/31) entsteht. Das gilt schon heute bei Ein- und Auszug im Monat und ist nicht neu durch #453. Kein Handlungsbedarf in diesem Issue. |

## Beleg und Lösung zu Blocker/Major

### V-1 (Major)
- **Beleg:** `453-texte.md`, `statements_preview_all_skipped`: «replaces «keine Mietverträge» for that building». Entscheid Punkt 4: «sind alle Mietverträge eines Gebäudes übergangen, statt «keine Mietverträge»: …». Die Vorschau ist heute auch leer, wenn alle Mietverträge schon eine Abrechnung dieser Periode haben (`messages/de.json:1307`, «… keine Mietverträge ohne Abrechnung …»). Beispiel: Lindenhof 2024, Marc Huber hat schon eine Dwello-Abrechnung 2024, Eva Frei ist bis 31.12.2024 abgerechnet. Die Vorschau ist leer, aber der Satz «Alle Mietverträge von Lindenhof sind … schon ausserhalb von Dwello abgerechnet» stimmt für Marc Huber nicht.
- **Warum falsch:** Der Verwalter liest, Marc Huber sei ausserhalb von Dwello abgerechnet. Er sucht dann eine Abrechnung, die es nicht gibt, oder hält die Dwello-Abrechnung für doppelt. Genau diese falsche Aussage soll Punkt 4 beseitigen (`w5d-fachreview-1.md` V-6).
- **Lösung:** Den eigenen Text nur zeigen, wenn **jeder** Mietvertrag des Gebäudes in der Periode wegen «Abgerechnet bis» übergangen ist. Im gemischten Fall gilt der bestehende leere Text plus eine Zeile pro übergangenem Mietvertrag. Dafür einen DOM-Test oder Backend-Test mit dem Beispiel oben. Das ist eine Lesart des Entscheids, kein neuer Entscheid.

## Antworten auf die offenen Fragen in `453-texte.md`

1. **Erklärsatz über den Totalen** (`pdf.service.ts:693`, «Ihre Nebenkosten CHF … – Geleistete Akontobeiträge CHF …»): **Ja, denselben Wortlaut «Geleistete Akontobeiträge ab {date}» verwenden**, aber nur wenn die Zeile zum Mietverhältnis «Abgerechnet bis» nennt. Sonst steht im Satz eine andere Bezeichnung für denselben Betrag als in der Zeile darunter (`pdf.service.ts:778`). Der Mieter sieht dann wieder ein Akonto ohne Zeitraum (#325, P-2). In allen vier Sprachen gleich: fr «Acomptes versés à partir du {date}», it «Acconti versati dal {date}», en «Advance payments made from {date}».
2. **partProfile auf Seite 2:** **Ja, auch dort «abgerechneten Monate»**, unter derselben Bedingung wie `heatingMonths`. Der Heizanteil rechnet ab `billingStart` (`calculation.service.ts:489`, `handleMidYearMoves(…, billingStart(contract), …)`). Die aufgeführten Monate sind also die abgerechneten und nicht alle Monate des Mietverhältnisses (Eva Frei: nur März statt Januar bis März). Ohne «Abgerechnet bis» in der Periode bleibt der Text unverändert. it siehe V-4.

## Nachgerechnet

- Eva Frei, «Abgerechnet bis» 29.02.2024, Periode 2024: 01.03. bis 31.03.2024 = 31 Tage, 2024 hat 366 Tage. Akonto 1 Monat × 120.00 = 120.00. Hauswart 732.00 / 366 = 2.00 pro Tag × 31 = 62.00, mit 3 % = 63.86. Saldo 63.86 − 120.00 = −56.14, auf 5 Rappen zugunsten des Mieters −56.15 («Rückerstattung CHF 56.15»). **bestätigt** (bestehendes Szenario `statement-generate.feature:156-164`).
- Marc Huber 01.05. bis 31.12.2024: 31+30+31+31+30+31+30+31 = 245 Mietstage. **bestätigt**.
- «Abgerechnet bis» 15.03.2024: 16.03. bis 31.03. = 16 Mietstage. Akonto 120 × 16/31 = 61.935… = 61.94. Extern sind damit 120 × 15/31 = 58.06 abgerechnet, zusammen 120.00, nichts doppelt. **bestätigt**. Akontozeile «Geleistete Akontobeiträge ab 16.03.2024».
- Randfall Akonto 0 (Marc Huber ohne Akonto): Zeile «…, 245 Mietstage, Akonto CHF 0.00». Das ist korrekt, das Szenario prüft nur den Anfang. **bestätigt**.

## Randfälle

| Fall | Ergebnis | Status |
|---|---|---|
| = heute | erlaubt (eine Abrechnung bis heute kann heute vorliegen); Vergleich mit dem Schweizer Datum | bestätigt, Test fehlt (M-2) |
| = Vertragsbeginn | erlaubt, `billingStart` = Tag danach (`contract.service.ts:327-328`). PDF z. B. «… bis 01.04.2024 sind mit einer früheren Abrechnung abgerechnet. Diese Abrechnung umfasst 02.04.2024 – …», Akonto April 120 × 29/30 = 116.00 | bestätigt, Test fehlt (M-2) |
| nach dem Vertragsende, ≤ heute | nicht abzulehnen: Die externe Abrechnung reicht bis zu ihrem Periodenende, z. B. 30.06.2024 für einen Auszug am 31.03.2024. Der Mietvertrag hat dann keine Mietstage und ist übergangen | bestätigt, Lücke V-2/V-3 |
| vor dem Periodenbeginn (z. B. 31.12.2023 für 2024) | keine Zeile «Abgerechnet bis», `billedOf` gibt `{}` (`statement-pdf.service.ts:196`); in der Vorschau keine «Abgerechnet bis»-Zeile | bestätigt |
| = Periodenende | keine Abrechnung, Zeile «übergangen» (Szenario Marc Huber 31.12.2024) | bestätigt |
| Mieterwechsel in der Periode | Eva/Marc, Leerstand April nicht im Total; Notiz zum Total entsprechend | bestätigt |

## Szenarien

- Die Begriffe in allen sechs neuen Szenarien stammen aus dem Glossar: Mietvertrag, Vertragsbeginn, Abgerechnet bis, Mietstage, Akonto, Abrechnungsperiode, Liegenschaftsverwalter. «Übergangen» ist das Verb des Glossars (Zeile 48). **bestätigt**.
- Die Daten stimmen mit dem Grundlage-Teil überein: Anna Keller ab 01.04.2024 → «vor dem Vertragsbeginn 01.04.2024», Assistent 2020-01-01 → «01.01.2020». Heute ist der 19.10.2026, also liegen 2099 in der Zukunft und 2025-12-31 bzw. 2024-12-31 in der Vergangenheit. **bestätigt**.
- Die Texte in den Szenarien sind wortgleich mit dem Entscheid (Punkte 3 bis 6). **bestätigt**.
- Szenarien für V-1, V-2, M-1 und M-2 fehlen; tiefere Tests genügen (siehe Lösung).

## Fedlex

- Art. 4 Abs. 1 VMWG (fedlex.admin.ch/eli/cc/1990/835_835_835/de): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Das trägt die Ablehnung eines Datums in der Zukunft: Es würde Abrechnungen still unterdrücken. «Abrechnung» ist auf fr «décompte», auf it «conteggio»: fr «Si le bailleur perçoit les frais accessoires sur la base d'un décompte, il doit établir celui-ci au moins une fois par an et le présenter au locataire.», it «Se il locatore riscuote spese accessorie sulla base di un conteggio, deve allestirlo almeno una volta all'anno e presentarlo al conduttore.» Die fr/it-Fassungen habe ich nur über justement.ch und lexfind.ch gelesen, nicht direkt auf Fedlex; sie stimmen mit dem Fedlex-Zitat im Entscheidkommentar überein. Damit sind «décompte», «conteggio» und «allestire» in den NEW-Texten belegt.
- Mietrecht: Weder die PDF-Zeile noch die Ablehnungen nehmen dem Mieter ein Recht. Die neue Zeile sagt ihm, welcher Zeitraum und welches Akonto diese Abrechnung umfasst. Kein Befund.

## Native-Lesung (Done means)

- **Geprüft:** Grammatik, Register (vous, Lei), Begriffe gegen `i18n-begriffe.md` und Fedlex, Gleichheit mit dem Deutschen, Typografie. Daraus V-4, V-5, V-7 bis V-11.
- **Nicht ersetzbar:** Eine Native-Lesung durch eine Person aus der Romandie, dem Tessin und dem englischen Sprachraum. Dazu gehören die Idiomatik der ganzen Sätze (z. B. «ont été décomptés dans un décompte antérieur», «sono stati conteggiati in un conteggio precedente»), Schweizer Regionalgebrauch und wie ein Mieter die PDF-Sätze versteht. Dieser Punkt der Done means bleibt offen («Blocked on me» beim Aufrufer, vgl. #342).

## Fehlende Begriffe

- **Abgerechnet bis** (Ergänzung zu `UBIQUITOUS_LANGUAGE.md:48`), Vorschlag: «… Abrechnungsläufe und der Hinweis auf fehlende Abrechnungen übergehen einen Mietvertrag in Abrechnungsperioden, die bis dahin enden oder in denen der Mietvertrag bis dahin endet (übergangener Mietvertrag); reicht die Abrechnungsperiode darüber hinaus, zählen Mietstage und geleistete Akontobeiträge erst ab dem Tag danach.» Issue mit den Labels `fachlich` und `entscheiden`.

## Nicht bestätigt

- Ob der Hinweis auf fehlende Abrechnungen im Fall von V-2 (nach dem Vertragsende abgerechnet) schon schweigt: nicht im Code nachgesehen (nicht Gegenstand von #453). Gesucht habe ich nur `billedUntil` und `billingStart` in `backend/src/services`.
- Die fr- und it-Wortlaute von Art. 4 Abs. 1 VMWG direkt auf Fedlex: nur Sekundärquellen gelesen (siehe oben), nicht die Fedlex-Seite selbst.
- Wie der Assistent die Bestätigung «Vertragsbeginn in der Vergangenheit» mit dem neuen Feld kombiniert (Task `contract-form.ts`): Das ist Ablauf, nicht Fachlichkeit, und nicht geprüft.
- Die Native-Lesung fr/it/en (siehe oben).
