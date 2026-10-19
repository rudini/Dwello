# Fach-Review #464, Runde 2 (Umsetzung `fccaa297..b71bb4c5`)

Gegenstand: die Umsetzung (`7ff3c3db`, `b71bb4c5`), gemessen an Runde 1 (`docs/reviews/464-fachreview-1.md`, F-1 bis F-15) und an den Entscheiden des Product Owners in #464 vom 2026-10-19 (F-3, F-4 Option A, F-10, F-13). Dazu die Texte, die seit Runde 1 neu sind, in de/fr/it/en. Gelesen im Worktree `review-464-fach` (detached, `b71bb4c5`), nichts darin geändert. Die Formeln habe ich mit `advanceLines` aus dem Worktree nachgerechnet (Skript im Scratchpad, ohne Datenbank).

## Status der Befunde aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| F-1 | erledigt | `advance_lines` JSONB an der Abrechnung (`0026_contract_advance_payments.sql:18`). `calculatedRows` speichert die Zeilen beim Erstellen und beim Neuberechnen (`statement.service.ts:404`, `:484`). Das PDF druckt nur Gespeichertes (`statement-pdf.service.ts:137`). Ohne Zeilen (vor #464) kommt nur das Total. |
| F-2 | erledigt | Jede Zeile wird gerundet, das Total ist ihre Summe (`calculation.service.ts:430`). Nachgerechnet: 95.00, 02.01.–02.03.2024 ergibt 91.94 + 95.00 + 6.13 = **193.07**. Der Altfall 150, 16.03.–15.09.2024 bleibt bei **902.42**. |
| F-3 | **teilweise**, siehe V-1 | Die Ablehnung gibt es, mit Szenario (`contract-edit.feature:209`). Die Vergleichsregel weicht aber vom Entscheid ab. |
| F-4 | **teilweise**, siehe V-1 | Die Warnung ist umgesetzt (`Correction.svelte:36–41`, Szenario `statement-detail.feature:800`). Den Weg danach («the landlord enters the earlier amount with its date») versperrt V-1, sobald es weitere gespeicherte Abrechnungen gibt. |
| F-5 | erledigt | Der Betrag wird beim Lesen bestimmt (`currentAdvance`, `advance-payment.service.ts:22–29`). Stichtag: heute, bei einem künftigen Mietvertrag der Vertragsbeginn, bei einem beendeten das Vertragsende. Er gilt über `contractFields` für Liste, Detail, Wohnung und Vertragshistorie. |
| F-6 | erledigt | `noteAdvance` steht in allen vier Sprachen wortgleich zum Vorschlag (`pdf.service.ts:52, 153, 253, 353`), mit Szenario (`statement-detail.feature:822`). Er erscheint nur bei einem Total über 0, das ist richtig. |
| F-7 | erledigt | `Dann steht im PDF "Geleistete Akontobeiträge – 580.00"`. |
| F-8 | erledigt | Das Szenario hat 50, ab 01.07.2024 80 und ab 01.01.2025 100. Erwartet sind 2 × 50 + 6 × 80 = **580.00**, nachgerechnet. Die Zeile von 2025 fällt richtig weg. |
| F-9 | erledigt | Der PDF-Wortlaut entspricht dem Vorschlag in allen vier Sprachen, «1 Monat/mois/mese/month» eingeschlossen. Nachgerechnet: «2 Monate × CHF 50.00 (01.05.2024 – 30.06.2024) 100.00» und «6 Monate × CHF 80.00 (01.07.2024 – 31.12.2024) 480.00». |
| F-10 | erledigt | Ein späteres «Gültig ab» muss der Erste eines Monats sein. Nur der Vertragsbeginn darf auf einen anderen Tag fallen. Nicht vor dem Vertragsbeginn, nicht nach dem Vertragsende (`advance-payment.service.ts:45–59`). Zu den Texten siehe unten. |
| F-11 | als Issue offen | #477 («Glossary: «Gültig ab» …»), Labels `fachlich` und `entscheiden`. Der Marker steht in `AdvanceFrom.svelte:10`. |
| F-12 | erledigt | Die Hilfe empfiehlt für eine Senkung eine schriftliche Mitteilung und verlangt kein Formular. Der Rechtssatz bleibt **unsicher** (Nicht bestätigt). |
| F-13 | erledigt | Ein Eintrag mit demselben Tag ersetzt den alten (`onConflictDoUpdate`, `:65`). Der erste lässt sich nicht löschen (`:73`), die späteren schon (Szenario `contract-detail.feature:386`). Siehe aber V-2: Ersetzen ist jetzt der Standardweg. |
| F-14 | erledigt | Ein DOM-Test prüft beide Vertragsarten, mit und ohne den alten Satz (`contract-edit.dom.test.ts:123–133`, `:215–218`). |
| F-15 | erledigt | Die Auskunft gibt `advancePayments` mit jedem «Gültig ab» aus (`tenant-export.service.ts:65`). Die Zeilen der Abrechnungen sind mit `advanceLines` dabei. |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Die Ablehnung vergleicht das Total vor und nach der Änderung, nicht mit dem gespeicherten Total. Ein Betrag, der zur versendeten Abrechnung passt, wird deshalb abgelehnt. Das widerspricht dem Entscheid zu F-3 und versperrt den Weg aus F-4, sobald der Mietvertrag mehr als eine gespeicherte Abrechnung hat. |
| V-2 | Verwalter / Mietrecht | Major | Das Bearbeiten-Formular füllt «Gültig ab» mit dem Tag des heutigen Betrags. Ändert der Vermieter nur den Betrag, ersetzt er ihn rückwirkend ab diesem Tag, oft ab Vertragsbeginn. Für die Zeit, die noch nicht abgerechnet ist, kommt so V-1 aus #66 zurück. Eine Erhöhung gilt dann rückwirkend, also vor dem Kündigungstermin. |
| V-3 | Verwalter | Major | Wird der Vertragsbeginn verschoben, behält der erste Eintrag seinen alten Tag. Ein neuer Betrag zwischen dem neuen Beginn und diesem Tag wird dann zum «ersten» und gilt ab Vertragsbeginn. Der bisherige gilt erst danach, die Beträge sind vertauscht. Wird der Beginn hinter einen späteren Eintrag geschoben, zeigt die Vertragsseite unmögliche Zeiträume. |
| V-4 | Verwalter | Minor | `contracts_advance_from_help` «… der Erste eines Monats.» widerspricht dem vorgefüllten Vertragsbeginn, wenn dieser mitten im Monat liegt. Er sagt auch nicht, dass derselbe Tag den Betrag korrigiert. Text: siehe V-2. |
| V-5 | Mietrecht | Minor | `contracts_advance_change_help(_fixed_term)` (Erhöhung, Kündigungstermin, Formular) steht auch bei einem Mietvertrag, der noch nicht begonnen hat oder beendet ist (`ContractForm.svelte:75–77`, ohne Prüfung von `running`). Dort ist eine Änderung eine Korrektur der Erfassung, keine Vertragsänderung. Fix: Den Zusatz nur zeigen, wenn `running` gilt. |
| V-6 | Verwalter | Minor | Bei einem abgelehnten Löschen sagt `backend_advance_changes_statement/_draft` «… oder wählen Sie ein späteres «Gültig ab»». Im Löschdialog gibt es kein Datum. Fix: eigene Codes fürs Löschen, Text unten. |
| V-7 | Verwalter | Minor | `statements_advance_differs` sagt nur «Prüfen Sie die Akontobeträge am Mietvertrag». Ein früherer Betrag lässt sich aber erst eintragen, wenn dieser Entwurf gelöscht ist (`ADVANCE_CHANGES_DRAFT`). Wer nicht weiss, wie Dwello vorgeht, findet diesen Weg nicht. Text unten. |
| V-8 | Verwalter | Minor | it: Buttons und Titel stehen im Imperativ der Du-Form («Elimina l’acconto …»). Regel: Infinitiv (`i18n-begriffe.md:5`), Vorbild `buildings_fuel_delete_*`. Fix: «Eliminare l’acconto dal {from}», Titel «Eliminare l’acconto dal {from}?», Bestätigen «Eliminare l’acconto». Ausserdem «una data «Valido dal» più tardi» → «successiva» (zweimal). |
| V-9 | Verwalter | Nit | Der Titel des Löschdialogs weicht vom Muster ab («Bestand vom {date} löschen?»). Fix: «Akonto ab {from} löschen?» / «Supprimer l’acompte dès le {from} ?» / «Delete advance payment from {from}?». Im Text fehlt «von»: «Das Akonto von {amount} ab {from} wird gelöscht. Ab dann gilt wieder das Akonto von {before}.» |
| V-10 | Verwalter | Nit | Wer nur «Gültig ab» ändert, legt einen zweiten Eintrag mit demselben Betrag an. Die Vertragsseite zeigt dann zwei Zeilen mit gleichem Betrag, das PDF fasst sie zusammen. Fix: keinen Eintrag anlegen, wenn der Betrag dem an diesem Tag geltenden gleicht. |
| V-11 | Verwalter | Nit | Die Warnung kommt auch dann, wenn nur die Mietstage abweichen, etwa wenn die Berichtigung ein korrigiertes Vertragsende übernimmt. Mit dem Text aus V-7 («Stimmt ein früherer Betrag nicht, …») ist das hinnehmbar. |

Bestätigt sind ausserdem diese Regeln:
- **Der erste Betrag gilt ab dem Vertragsbeginn**, auch wenn sich der Beginn verschiebt. Im Rechnen gilt für jeden Tag vor dem ältesten «Gültig ab» der älteste Betrag (`advanceLines`, `amountOn`, `:118`). Zu den Randfällen siehe V-3.
- **Die Warnung erscheint nur bei einer berichtigten Abrechnung im Entwurf** (`Correction.svelte:37–41`: `status === 'draft' && replaces && |Δ| ≥ 0.005`). Szenario: 8 × 50 = **400.00** gegen 8 × 80 = **640.00**, nachgerechnet.
- **Die Mieterdaten-Auskunft nennt jeden Betrag** (F-15).
- **Die Ablehnung prüft das Total vor und nach der Änderung**: Das steht so im Code (`:99–101`). Die Regel selbst ist aber falsch, siehe V-1.

---

## Nachrechnung (Skript gegen `advanceLines` aus dem Worktree)

| Fall | Zeilen | Total |
|---|---|---|
| 50, ab 01.07.2024 80, ab 01.01.2025 100; Mietstage 01.05.–31.12.2024 | 2 × 50 = 100.00; 6 × 80 = 480.00 | **580.00** ✓ |
| 95, 02.01.–02.03.2024 (F-2) | 30/31 × 95 = 91.94; 1 × 95 = 95.00; 2/31 × 95 = 6.13 | **193.07** ✓ |
| 120, Mietstage ab 16.03.2024 («Abgerechnet bis» 15.03., #453) | 16/31 × 120 = 61.94; 9 × 120 = 1’080.00 | **1’141.94** ✓ |
| Null: 150, ab 01.10.2024 0 | 9 × 150 = 1’350.00; 3 × 0 = 0.00 | **1’350.00** ✓ (die Nullzeile bleibt, der Hinweis erscheint) |
| Ein- und Auszug, 150, 16.03.–15.09.2024 | 77.42 + 5 × 150 + 75.00 | **902.42** ✓ |
| Beginn 15.03.2024 mitten im Monat, ab 01.04.2024 120; bis 10.06.2024 | 17/31 × 100 = 54.84; 2 × 120 = 240.00; 10/30 × 120 = 40.00 | **334.84** ✓ |
| V-1: Abrechnung 2024 (gespeichert 1’800 = 12 × 150), Eintrag 200 ab 2023 → 150 ab 2023 und 200 ab 2026 | vorher 2’400, nachher 1’800 | **abgelehnt**, obwohl nachher = gespeichert ✗ |
| V-3: Beginn von 15.03. auf 01.01.2024 verschoben (erster Eintrag 100 bleibt «ab 15.03.»), neu 120 ab 01.02.2024 | Jan.–März 3 × 120 = 360.00; Apr.–Dez. 9 × 100 = 900.00 | **1’260.00** statt gewollt 1 × 100 + 11 × 120 = **1’420.00** ✗ |

Mieterwechsel: Jeder Mietvertrag hat seine eigenen Einträge (`contract_id` im Primärschlüssel), Eva Frei und Marc Huber teilen keinen. Rückerstattung: Das Generate-Szenario (−75.30) aus Runde 1 gilt unverändert.

---

## V-1 (Major): Die Ablehnung vergleicht vorher mit nachher statt mit dem gespeicherten Total

**Beleg.**
- `backend/src/services/advance-payment.service.ts:98–101`:
  ```ts
  // only what this change alters: a statement that counted another Akonto already stays editable (F-4)
  const total = (amounts: Amounts) => advanceLines(amounts, …).reduce(…);
  if (Math.abs(total(after) - total(before)) < 0.005) continue;
  ```
- Entscheid #464 zu F-3: «An amount that matches the sent statement may be entered.» Zu F-4: «the landlord enters the earlier amount with its date».
- Vorschlag in Runde 1, F-3: «Dwello vergleicht neu gerechnet gegen `total_advance_payments`.»

**Warum falsch.** Ein Fall nach V-6 aus #66, nachgerechnet: Der Mietvertrag läuft seit 2023, die Abrechnungen 2023, 2024 und 2025 sind mit 150 versendet. Vor der Migration wurde das Akonto auf 200 gesetzt, die Migration setzt also 200 ab Vertragsbeginn. Der Vermieter berichtigt 2025, sieht die Warnung (2’400 statt 1’800) und will 150 ab Vertragsbeginn und 200 ab 01.01.2026 eintragen.
1. Zuerst lehnt Dwello mit `ADVANCE_CHANGES_DRAFT` ab, denn der Entwurf ändert sich. Der Vermieter löscht ihn.
2. Dann lehnt Dwello mit `ADVANCE_CHANGES_STATEMENT` für 2023 und 2024 ab: vorher 2’400, nachher 1’800. Dabei sind 1’800 genau die gespeicherten Totale.

Der Vermieter müsste also alle früheren, richtigen Abrechnungen berichtigen, um seine Daten zu korrigieren. Andernfalls versendet er die berichtigte Abrechnung 2025 mit 2’400. Das wären 600 zu Lasten des Vermieters, bei einer Senkung zu Lasten des Mieters. Der Kommentar nennt den Grund für die Regel: Eine schon abweichende Abrechnung soll unbeteiligte Änderungen nicht sperren. Das ist berechtigt, deckt aber nur den halben Entscheid.

**Fix.**
- Ablehnen, wenn beides zutrifft: Das Total ändert sich (vorher ≠ nachher), und das neue Total weicht vom gespeicherten `total_advance_payments` ab.
  - Passt das neue Total zum gespeicherten, wird der Betrag angenommen. Das ist der Entscheid zu F-3 und F-4.
  - Ändert sich das Total einer schon abweichenden Abrechnung nicht, wird der Betrag ebenfalls angenommen. Das ist der heutige Grund.
- Bei einer Abrechnung von vor #464 (`advance_lines` null) wurde einmal über alle Monate gerundet (F-2). Der Vergleich mit dem gespeicherten Total braucht dort 1 Rappen Toleranz, sonst scheitert ein richtiger Betrag bei angebrochenen Monaten (193.06 gegen 193.07).
- Ein Test zum Fall oben gehört in `contract-advance.pg.test.ts`: drei Abrechnungen, Korrektur des ersten Betrags, wird angenommen.
- Für einen Entwurf bleibt es beim Entscheid «a draft is deleted first». Der Text aus V-7 sagt das dem Vermieter.

## V-2 (Major): Ohne neues Datum ersetzt ein geänderter Betrag den heutigen rückwirkend

**Beleg.**
- `src/lib/contract-form.ts:84–88`: `advancePaymentFrom` erhält den `validFrom` des heute geltenden Eintrags, beim einzigen Eintrag also den Vertragsbeginn. Der DOM-Test bestätigt das: `expect(…'contract-advance-from-input').value).toBe('01.04.2024')` (`contract-edit.dom.test.ts:101`).
- `advance-payment.service.ts:44, 60, 65`: Bei demselben Tag wie der erste Eintrag wird der erste überschrieben (upsert).
- `contracts_running_text`: «Ein neues Akonto gilt ab dem Tag, den Sie dazu eintragen.»

**Warum falsch.** Der häufigste Fall ist der Vermieter mit wenig Erfahrung, der «Akonto pro Monat» von 150 auf 200 setzt und speichert. Er trägt kein Datum ein, weil schon eines dasteht. Ist die laufende Periode noch nicht abgerechnet, gilt 200 nun ab Vertragsbeginn. Genau diesen Fehler soll #464 beheben (#66 V-1: 300 zu viel zurückerstattet). Bei einer Erhöhung widerspricht das zudem der Hilfe und dem Gesetz. Art. 269d Abs. 3 OR: «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, …». Abs. 2: «Die Mietzinserhöhung ist nichtig, wenn der Vermieter: a. sie nicht mit dem vorgeschriebenen Formular mitteilt; …». Abs. 1: «… auf den nächstmöglichen Kündigungstermin …» (Fedlex, OR Stand 1.10.2026, zitiert in Runde 1). Eine rückwirkende Erhöhung kann es danach nicht geben. Ist die Periode schon abgerechnet, lehnt Dwello zwar ab. Die Meldung «Das Akonto ab 01.04.2024 ändert die Abrechnung …» sagt dem Laien aber nicht, dass ihm nur das Datum fehlt.

**Fix** (Entscheid PO nur, falls er den Vorschlag ändern will; F-13 bleibt so):
- Im laufenden Mietvertrag schlägt «Gültig ab» den nächsten Ersten des Monats nach heute vor (innerhalb des Mietvertrags). Bei einem Mietvertrag, der noch nicht begonnen hat, bleibt der Vertragsbeginn, denn dort ist eine Änderung eine Korrektur. Bei einem beendeten Mietvertrag bleibt der Tag des letzten Betrags.
- Betrag und «Gültig ab» nur senden, wenn der Betrag sich geändert hat. Sonst legt jedes Speichern anderer Felder einen Eintrag an (siehe auch V-10).
- Hilfe `contracts_advance_from_help` (ersetzt V-4):
  - de: «Tag, ab dem das neue Akonto gilt: der Erste eines Monats. Um einen falsch eingetragenen Betrag zu korrigieren, tragen Sie seinen Tag aus «Akonto nach Zeitraum» ein; der erste Betrag gilt ab dem Vertragsbeginn.»
  - fr: «Jour à partir duquel le nouvel acompte s’applique : le premier d’un mois. Pour corriger un montant saisi par erreur, indiquez son jour figurant sous « Acompte par période » ; le premier montant s’applique dès le début du bail.»
  - it: «Giorno da cui vale il nuovo acconto: il primo di un mese. Per correggere un importo inserito per errore, inserisca il suo giorno indicato in «Acconto per periodo»; il primo importo vale dall’inizio del contratto.»
  - en: «Day from which the new advance payment applies: the first of a month. To correct an amount entered by mistake, enter its day from «Advance payment by period»; the first amount applies from the contract start.»
  - «Akonto nach Zeitraum» erscheint erst ab zwei Beträgen (`AdvancePeriods.svelte:45`). Mit nur einem Betrag gilt der zweite Satz für den Vertragsbeginn. Der Halbsatz nach dem Strichpunkt deckt das.
- DOM-Test: Wer nur den Betrag ändert, sendet den nächsten Ersten, nicht den Vertragsbeginn.

## V-3 (Major): Verschobener Vertragsbeginn, der erste Eintrag behält seinen alten Tag

**Beleg.**
- `advance-payment.service.ts:42–44`: «the first amount keeps its day, also when the Vertragsbeginn moves». `updateContract` passt die Einträge beim Datumswechsel nicht an (`contract.service.ts:408–425`; `contractAdvancePayments` wird ausserhalb von `advance-payment.service.ts` nirgends geschrieben).
- `setAdvance` prüft `from < startDate` gegen den neuen Beginn, aber nicht gegen den ersten Eintrag (`:52`).
- `AdvancePeriods.svelte:48–50`: Die erste Zeile beginnt beim Vertragsbeginn, die übrigen beim gespeicherten Tag.

**Warum falsch** (nachgerechnet, Tabelle oben). Der Mietvertrag wurde mit Beginn 15.03.2024 und 100 erfasst. Später wird der Beginn auf 01.01.2024 korrigiert, und der Vermieter trägt 120 ab 01.02.2024 ein. Der neue Eintrag ist jetzt der älteste und gilt ab Vertragsbeginn, also auch im Januar. Der bisherige erste gilt erst ab 15.03.2024. Ergebnis: 1’260.00 statt 1’420.00, und die Vertragsseite zeigt «CHF 120.00 vom 01.01.2024 bis 14.03.2024», «CHF 100.00 ab 15.03.2024». Auch der falsche Eintrag (der ursprünglich erste) lässt sich jetzt löschen. Umgekehrt: Wird der Beginn hinter einen späteren Eintrag geschoben (Beginn 01.09.2024, Eintrag ab 01.07.2024), zeigt die Seite «… vom 01.09.2024 bis 30.06.2024». Endet der Mietvertrag vor einem späteren Eintrag, steht «… vom 01.01.2027 bis 31.12.2026». Die Regel «der erste gilt ab Vertragsbeginn» stimmt also nur im Rechnen und nur, solange der Beginn nicht vor einen späteren Eintrag fällt.

**Fix.**
- Verschiebt sich der Vertragsbeginn, rückt der erste Eintrag in derselben Transaktion auf den neuen Beginn (`valid_from = startDate`). Dann ist «der erste gilt ab Vertragsbeginn» gespeichert und nicht nur erschlossen. Ein neues «Gültig ab» liegt so nie vor dem ersten.
- Ein neuer Beginn an oder nach einem späteren Eintrag, oder ein Vertragsende vor einem solchen, wird abgelehnt (coded error). Zum Beispiel de: «Ab {date} gilt ein anderes Akonto. Löschen Sie zuerst dieses Akonto, oder wählen Sie einen früheren Vertragsbeginn.» Beim Ende: «… oder wählen Sie ein späteres Vertragsende.» Eine stille Löschung wäre ebenfalls möglich, braucht dann aber den Product Owner.
- Test in `contract-advance.pg.test.ts` für beide Richtungen.

---

## Texte der Minor-Befunde (de, fr, it, en)

**V-6, Löschen abgelehnt** (neue Codes, z. B. `ADVANCE_DELETE_CHANGES_STATEMENT` / `_DRAFT`):
- de: «Das Akonto ab {from} zählt in der Abrechnung {number}, die schon erstellt ist. Berichtigen Sie zuerst diese Abrechnung.» / «Das Akonto ab {from} zählt im Entwurf {number}. Löschen Sie zuerst den Entwurf.»
- fr: «L’acompte dès le {from} compte dans le décompte {number}, déjà établi. Rectifiez d’abord ce décompte.» / «L’acompte dès le {from} compte dans le brouillon {number}. Supprimez d’abord le brouillon.»
- it: «L’acconto dal {from} conta nel conteggio {number}, già allestito. Rettifichi prima questo conteggio.» / «L’acconto dal {from} conta nella bozza {number}. Elimini prima la bozza.»
- en: «The advance payment from {from} counts in statement {number}, which has already been created. Correct this statement first.» / «The advance payment from {from} counts in draft {number}. Delete the draft first.»

**V-7, `statements_advance_differs`** (ersetzt den letzten Satz):
- de: «… ({before}). Stimmt ein früherer Betrag am Mietvertrag nicht, löschen Sie diesen Entwurf, tragen Sie den Betrag mit seinem «Gültig ab» ein und erstellen Sie die berichtigte Abrechnung erneut.»
- fr: «… ({before}). Si un montant antérieur du contrat de bail est faux, supprimez ce brouillon, saisissez le montant avec sa date « Valable dès le », puis établissez à nouveau le décompte rectificatif.»
- it: «… ({before}). Se un importo precedente del contratto di locazione non è corretto, elimini questa bozza, inserisca l’importo con la sua data «Valido dal» e allestisca di nuovo il conteggio rettificato.»
- en: «… ({before}). If an earlier amount in the rental contract is wrong, delete this draft, enter the amount with its «Valid from» date and create the corrected statement again.»

## Neue Texte geprüft und bestätigt (ausser den Befunden oben)

- `contracts_advance_from_label`: «Gültig ab» / «Valable dès le» / «Valido dal» / «Valid from». Bestätigt, offen nur im Glossar (#477).
- `contracts_advance_change_help`: wortgleich mit dem Vorschlag aus Runde 1, in allen vier Sprachen. Die Formularpflicht für eine Erhöhung ist belegt durch Art. 269d Abs. 1–3 OR und Art. 19 Abs. 1 lit. a Ziff. 1–2 VMWG («die bisherige Belastung des Mieters für Nebenkosten», «die neue Belastung des Mieters für Nebenkosten»), Fedlex, zitiert in Runde 1. Siehe aber V-5.
- `contracts_advance_change_help_fixed_term`: Vorschlag aus Runde 1 mit dem beschlossenen Satz aus #76. Den Satz «Tragen Sie bei «Gültig ab» den Tag nach dem Kündigungstermin ein» weglassen ist richtig, ein befristeter Mietvertrag hat keinen Kündigungstermin.
- `contracts_running_text(_fixed_term)`: wortgleich mit dem Vorschlag. «… und für berichtigte Abrechnungen» stimmt weiter (`correctStatement` «from today's data»).
- `contracts_advance_help`: wortgleich mit dem Vorschlag (Beschluss #90).
- `contracts_advance_periods`, `contracts_advance_period`, `contracts_advance_period_open`: Zeitraum geschlossen bis zum Tag vor dem nächsten Eintrag, beim letzten bis zum Vertragsende, sonst «ab». Das stimmt mit dem Szenario überein (`contract-edit.feature:201–202`: «CHF 150.00 vom 01.04.2024 bis 30.06.2025», «CHF 200.00 ab 01.07.2025»).
- `contracts_advance_delete_text`: Die Folge ist richtig benannt, denn nach dem Löschen gilt der vorherige Betrag (`before` = vorheriger Eintrag) bis zum nächsten Eintrag. Wortlaut: V-9.
- `backend_advance_from_not_month_start` («zum Beispiel {next}» = Erster des Folgemonats des eingegebenen Tags), `backend_advance_from_before_start`, `backend_advance_from_after_end`: bestätigt, alle vier Sprachen.
- `backend_advance_changes_statement`, `backend_advance_changes_draft`: bestätigt, ausser beim Löschen (V-6) und it «più tardi» (V-8).
- `backend_advance_first_not_deletable`: bestätigt. Über die Oberfläche ist er nicht erreichbar, weil der erste Eintrag keinen Löschknopf hat.
- `statements_advance_differs_title`: bestätigt.
- PDF `advanceMonths`, `advanceMonth`, `advanceDays`, `noteAdvance`: bestätigt (F-6, F-9). Bei «{days}/{daysInMonth} Tage» bleibt die Mehrzahl auch bei «1/31 Tage». Das ist vertretbar, weil es als Bruch zu lesen ist.

## Begriffe

Keine neuen Begriffe ausser denen in #477 («Gültig ab», die Ergänzungen zu «Akonto» und «Geleistete Akontobeiträge»). «Akonto nach Zeitraum» ist eine Überschrift und kein Fachbegriff. «Berichtigte Abrechnung», «Entwurf», «Vertragsbeginn» und «Vertragsende» sind richtig verwendet.

## Nicht bestätigt

- **Senkung ohne Formular** («Für eine Senkung genügt eine schriftliche Mitteilung»): Das ist weiter nur ein Umkehrschluss aus «zu Lasten des Mieters» (Art. 269d Abs. 3 OR), **unsicher**. Gelesen: OR Stand 1.10.2026 (Fedlex, Runde 1). Neu gesucht habe ich nicht.
- **Unter welchen Absatz von Art. 269d OR eine Akonto-Erhöhung fällt**: unverändert offen (Runde 1). Für den Text spielt es keine Rolle.
- **#453 «Geleistete Akontobeiträge ab {Datum}»**: Im Worktree steht die Bezeichnung im PDF noch nicht (`pdf.service.ts`, gesucht nach «Akontobeiträge ab»). Die Zeilen beginnen beim gespeicherten Beginn der Mietstage (`overlapStart`). Ob dieser nach «Abgerechnet bis» liegt, habe ich nur an `billingStart` in `calculation.service.ts:206` gesehen, nicht für `overlapStart` geprüft.
- **Verweigertes Löschen im Dialog**: Ob der Fehlerzustand des Löschdialogs ein E2E-Szenario hat (`tests/e2e/CLAUDE.md`, Fehlerzustände), habe ich nicht geprüft. Hinzugekommen ist nur der Zustand `advance-delete-dialog` (`accessibility.feature:91`).
- **fr/it/en** der Vorschläge hier: nach `docs/design/i18n-begriffe.md`, ohne muttersprachliche Prüfung.
- **Wohnung, monatliche Kosten**: Sie kommen über `GET /contracts?apartmentId=` (`src/lib/server/apartment.ts:39`). Dass diese Liste `contractFields` (`currentAdvance`) verwendet, habe ich an `contract.service.ts:59–62` gesehen, aber nicht im Test.
