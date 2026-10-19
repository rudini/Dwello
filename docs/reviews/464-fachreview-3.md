# Fach-Review #464, Runde 3 (Delta `b71bb4c5..06aac4c5`)

Gegenstand: die Antworten auf `docs/reviews/464-fachreview-2.md` (V-1 bis V-11) und die neuen oder geänderten Texte in de/fr/it/en. Gelesen im Worktree `review-464-fach3` (detached, `06aac4c5`), nichts darin geändert. Die Fälle unten habe ich am Code nachvollzogen (`advance-payment.service.ts`, `contract.service.ts:420–425`, `contract-form.ts`), ohne Datenbank.

## Status der offenen IDs aus Runde 2

| ID | Status | Beleg |
|---|---|---|
| V-1 (Major) | erledigt | `advance-payment.service.ts:131`: Dwello nimmt die Änderung an, wenn das Total gleich bleibt oder wenn das neue Total auf 1 Rappen zum gespeicherten `total_advance_payments` passt. Nachgerechnet am Fall aus Runde 2: vorher 2’400, nachher 1’800, gespeichert 1’800, also angenommen. 160 statt 150 ergibt 1’920, also abgelehnt. Test: `contract-advance.pg.test.ts` («nimmt einen Betrag an, der zum gespeicherten Akonto …»). Der Test hat eine Abrechnung, nicht drei. Die Schleife prüft aber jede Abrechnung für sich, das reicht. |
| V-2 (Major) | erledigt, mit einem Folgefall (V-12) | `contract-form.ts:53–64`: Im laufenden Mietvertrag wird der nächste Erste vorgeschlagen, im künftigen der Vertragsbeginn, im beendeten der Tag des letzten Betrags. Das Akonto wird nur gesendet, wenn sich der Betrag geändert hat (`advanceChanged`, `:166–172`). Dezember geht richtig ins neue Jahr (`Date.UTC(year, 12, 1)`). Tests: `contract-form.test.ts`. |
| V-3 (Major) | **teilweise**, siehe V-12 | `alignAdvances` (`:91–110`) rückt den ersten Eintrag auf den Vertragsbeginn und lehnt einen Beginn an oder nach einem späteren Eintrag ab, ebenso ein Ende davor. Nachgerechnet am Fall aus Runde 2 (Beginn 15.03. auf 01.01.2024, dann 120 ab 01.02.2024): 1 × 100 + 11 × 120 = **1’420.00**, wie gewollt. Offen bleibt der Fall, in dem Beginn, Betrag und «Gültig ab» im selben Speichern geändert werden (V-12). |
| V-4 | erledigt | `contracts_advance_from_help` entspricht in allen vier Sprachen dem Vorschlag. |
| V-5 | erledigt | `ContractForm.svelte:77–82`: Der Zusatz erscheint nur, wenn `running` gilt. |
| V-6 | erledigt | Eigene Codes `ADVANCE_DELETE_CHANGES_STATEMENT/_DRAFT`, die Texte entsprechen dem Vorschlag (de/fr/it/en). Test vorhanden. |
| V-7 | erledigt | `statements_advance_differs` entspricht dem Vorschlag in allen vier Sprachen. |
| V-8 | erledigt | it: «Eliminare l’acconto dal {from}», Titel «… ?», Bestätigen «Eliminare l’acconto», zweimal «successiva». |
| V-9 | erledigt | Titel mit `{from}` in allen vier Sprachen, in `AdvancePeriods.svelte:80` übergeben. de-Text mit «von». |
| V-10 | erledigt | Durch V-2: Ist der Betrag unverändert, wird nichts gesendet. Siehe aber V-13. |
| V-11 (Nit) | offen, hinnehmbar | Unverändert. Der Text aus V-7 deckt den Fall ab. |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-12 | Verwalter | Major | Werden Vertragsbeginn, Betrag und «Gültig ab» im selben Speichern geändert und ist «Gültig ab» der neue Vertragsbeginn, entsteht ein zweiter Eintrag statt einer Korrektur des ersten. Wird der Beginn vorverlegt, bleibt der alte, falsche Betrag ab dem alten Beginn stehen. Wird er verschoben, lehnt Dwello ab, und die Meldung verlangt das Löschen eines Akontos, das es nicht gibt. |
| V-13 | Verwalter | Minor | Ändert der Vermieter nur «Gültig ab» und nicht den Betrag, sendet das Formular nichts (`contract-form.ts:166`). Das Speichern gelingt, die Eingabe ist aber still verloren. Fix: Ist nur das Datum geändert, einen Hinweis am Feld zeigen, etwa «Um ein Akonto auf einen anderen Tag zu legen, löschen Sie es unter «Akonto nach Zeitraum» und tragen Sie es neu ein.» (Text in vier Sprachen bei der Umsetzung). Oder das Feld nur dann aktiv machen, wenn sich der Betrag geändert hat. |
| V-14 | Verwalter | Minor | it `backend_contract_start_after_advance`: «scelga un inizio del contratto precedente» lässt sich als «den Beginn des vorherigen Mietvertrags» lesen, denn «precedente» passt zu «inizio» und zu «contratto». Fix: «… oppure anticipi l’inizio del contratto.», beim Ende analog «… oppure posticipi la fine del contratto.» |
| V-15 | Verwalter | Nit | fr `backend_contract_start_after_advance`: «un début du bail plus tôt» klingt holprig. Fix: «… ou choisissez un début du bail antérieur.» |
| V-16 | Verwalter | Nit | Ein laufender Mietvertrag, der in diesem Monat endet: Der nächste Erste liegt nach dem Ende, also wird der Tag des letzten Betrags vorgeschlagen (`contract-form.ts:62`). Ein geänderter Betrag ersetzt diesen dann rückwirkend, oft ab Vertragsbeginn. Das kommt selten vor, die Ablehnung aus V-1 schützt abgerechnete Zeit, und die Hilfe nennt den Weg. Fix, falls gewünscht: in diesem Fall das Feld leer lassen, dann greift `contracts_error_advance_from_required`. |

## V-12 (Major): Beginn und erstes Akonto im selben Speichern korrigiert

**Beleg.**
- `contract.service.ts:420–425`: Erst werden die neuen Vertragsdaten gespeichert, dann läuft `setAdvance(…, advancePaymentFrom)`, danach `alignAdvances`.
- `advance-payment.service.ts:48`: Nur `from === first?.validFrom` gilt als erster Betrag. Ein `from`, das dem **neuen** `startDate` gleicht, ist erlaubt (`:49`, `from !== startDate`). Es wird als eigener Eintrag eingefügt (`:63–67`).
- `contracts_advance_from_help` sagt: «… der erste Betrag gilt ab dem Vertragsbeginn.» Im künftigen Mietvertrag ist der Vertragsbeginn auch der Vorschlag (`contract-form.ts:59`). Wer den Beginn korrigiert, passt «Gültig ab» deshalb naheliegend gleich mit an.

**Warum falsch** (am Code nachvollzogen):
- Fall B, Beginn vorverlegt. Ein künftiger Mietvertrag: Beginn 01.04.2027, 100. Der Vermieter korrigiert im selben Formular auf Beginn 15.03.2027, Akonto 120 und «Gültig ab» 15.03.2027.
  - `setAdvance`: `first` = 01.04., `from` = 15.03. ≠ `first`, also wird (15.03., 120) eingefügt.
  - `alignAdvances`: Der Eintrag vom 01.04. liegt nicht an oder vor dem Beginn, also keine Ablehnung. Der erste ist jetzt der 15.03., nichts zu verschieben.
  - Ergebnis: 120 vom 15.03. bis 31.03.2027, danach 100. Gewollt war 120 für die ganze Zeit. Die erste Abrechnung zählt also zu wenig Akonto, rund 20 pro Monat, und der Fehler fällt nicht auf.
- Fall A, Beginn verschoben. Beginn 15.03.2027 auf 01.04.2027, Akonto 120, «Gültig ab» 01.04.2027.
  - `setAdvance` fügt (01.04., 120) ein.
  - `alignAdvances` findet einen späteren Eintrag am neuen Beginn und lehnt mit `CONTRACT_START_AFTER_ADVANCE` ab: «Ab 01.04.2027 gilt ein anderes Akonto. Löschen Sie zuerst dieses Akonto …».
  - Dieses Akonto hat der Vermieter eben selbst eingetragen, und nach dem Rollback gibt es es nicht. Der Weg, den die Meldung nennt, existiert nicht.
- Im laufenden Mietvertrag gilt dasselbe, sobald der Vermieter bei einer Korrektur des Beginns den neuen Beginn statt des alten aus «Akonto nach Zeitraum» einträgt. Mit nur einem Betrag ist diese Liste nicht sichtbar (`AdvancePeriods.svelte:45`).

**Fix.**
- In `setAdvance` gilt auch der neue Vertragsbeginn als erster Betrag: `if (from === first?.validFrom || from === startDate) from = undefined;`. Dann ersetzt der Betrag den ersten Eintrag mit dessen altem Tag, und `alignAdvances` rückt ihn auf den neuen Beginn. Nachvollzogen: Fall B ergibt 120 ab 15.03.2027, ein Eintrag. Fall A ergibt 120 ab 01.04.2027, ein Eintrag, keine Ablehnung.
- Ein Test in `contract-advance.pg.test.ts` für beide Richtungen: ein PUT mit `startDate`, `monthlyAdvancePayment` und `advancePaymentFrom = startDate` ergibt genau einen Eintrag ab dem neuen Beginn.

## Neue oder geänderte Texte geprüft und bestätigt (ausser V-13 bis V-15)

- `backend_advance_delete_changes_statement/_draft` (de/fr/it/en): wortgleich mit V-6. Sie nennen kein Datum mehr, das passt zum Löschdialog.
- `backend_contract_start_after_advance`, `backend_contract_end_before_advance` (de, en): entsprechen dem Vorschlag aus V-3. Sie sagen, was passiert ist und was zu tun ist. Der Löschweg besteht («Akonto ab {from} löschen» auf der Vertragsseite), ausser in V-12 Fall A. fr «une fin du bail plus tardive» ist richtig. Zu it siehe V-14, zu fr-Beginn V-15.
- `contracts_error_advance_from_required`:
  - de «Geben Sie an, ab welchem Tag das neue Akonto gilt, zum Beispiel den Ersten des nächsten Monats.»
  - fr «Indiquez à partir de quel jour le nouvel acompte s’applique, par exemple le premier du mois prochain.»
  - it «Indichi da quale giorno vale il nuovo acconto, per esempio il primo del mese prossimo.»
  - en «Enter the day from which the new advance payment applies, for example the first of next month.»
  - Bestätigt: Sie-Form, it mit Lei, Hinweis auf das Tun. Die Meldung kommt nur, wenn das Feld leer ist und sich der Betrag ändert (`contract-form.ts:143–146`).
- `backend_advance_changes_statement/_draft`, it: «successiva» richtig (V-8). Der Hinweis «oder wählen Sie ein späteres «Gültig ab»» gilt beim Setzen weiter.
- `contracts_advance_delete_title` (vier Sprachen): Frage mit Datum. fr mit Leerzeichen vor «?», wie in fr üblich.
- Demo-Daten: Ein Eintrag je Mietvertrag ab Vertragsbeginn mit dem bisherigen Betrag, wie die Migration 0026. Das ist richtig.

## Nachrechnung

| Fall | Ergebnis |
|---|---|
| V-1: 200 ab 2024 migriert, Abrechnung 2024 gespeichert 1’800; Eingabe 150 | nachher 12 × 150 = 1’800.00 = gespeichert, **angenommen** ✓ |
| V-1: dieselbe, Eingabe 160 | 1’920.00 ≠ 1’800.00 und ≠ vorher, **abgelehnt** ✓ |
| V-1: Abrechnung vor #464, 95, 02.01.–02.03.2024, gespeichert 193.06 (einmal gerundet) | neu 193.07, Differenz 0.01 < 0.015, **angenommen** ✓ |
| V-3: Beginn 15.03. auf 01.01.2024, 120 ab 01.02.2024 | 100.00 + 11 × 120 = **1’420.00** ✓ |
| V-12 Fall B: Beginn 01.04. auf 15.03.2027, 120 «Gültig ab» 15.03.2027 | 120 nur bis 31.03., danach 100 ✗ (gewollt 120 durchgehend) |
| Null: Akonto 0 auf 0 unverändert | `advanceChanged` false, nichts gesendet ✓ |

Mieterwechsel und Rückerstattung: Das Delta ändert daran nichts. Die Einträge gehören weiter je einem Mietvertrag (`contract_id`), die Fälle aus Runde 2 gelten unverändert.

## Fehlende Begriffe

Keine neuen. «Gültig ab» bleibt bei #477 offen.

## Nicht bestätigt

- Gesetz: Das Delta enthält keinen neuen Rechtssatz. Die Zitate zu Art. 269d OR und Art. 19 VMWG stammen aus Runde 1 und 2 und wurden nicht neu abgerufen. Dass für eine Senkung eine schriftliche Mitteilung genügt, bleibt **unsicher** (wie in Runde 2).
- V-12 habe ich am Code nachvollzogen, nicht mit einem Testlauf: Der Worktree ist schreibgeschützt, und es gibt keinen Test für diesen Fall.
- Ob `amountError` ein Komma im Betrag zulässt («150,50»), habe ich nicht geprüft. `advanceChanged` vergleicht mit `Number()`, ein Komma gälte dort als Änderung. Das ist ohne Folge, solange die Validierung Kommas ablehnt.
