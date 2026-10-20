# Fach-Review 3 zu #454: Umsetzung nach Runde 2 (2026-10-20)

Gegenstand: `git diff 72645866 fa464b46` im Worktree `review-454-fach-3` (detached, fa464b46), dazu die Bildschirme Übersicht (Aufgaben «Entwürfe sind nicht aktuell», «Abrechnung berichtigen»), Hinweis und «Nicht berichtigen» auf der Abrechnung, Verlauf, Rechnungsliste mit dem Filter «Abrechnungsperiode», Assistent (Bestehende Abrechnungen). Vorrunden: `docs/reviews/454-fachreview-1.md`, `-2.md`. Gelaufen: `bun test src/__tests__/statement-invoices.pg.test.ts` (DB `dwello_test_r454h`): 39 pass, 0 fail.

Fedlex (Wortlaut aus den Runden 1 und 2, OR «Stand am 1. Oktober 2026»):
- Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …»
- Art. 128 Ziff. 1 OR: «Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen;»
- Art. 8 Abs. 2 VMWG: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»

## Status der offenen Befunde aus Runde 2

| ID | Status |
|---|---|
| V-16 | Erledigt: `statement-invoices.pg.test.ts:173` «meldet andere Werte auch bei gleichem Verbrauch», dazu Anfangsbestand (`:184`) und höherer Endbestand (`:194`). |
| V-17 | Erledigt (A): `LaterChanges.svelte`, Texte `statements_later_sent_none` / `_declined` wörtlich wie vorgeschlagen; `dashboard.feature:156`, `:175`. |
| V-18 | Erledigt: fällig nur mit Hinweis (`correctable` verlangt `invoiceIds.length > 0 \|\| fuelStock`) und anderem Ergebnis. |
| V-19 | Erledigt: `statement-generation.ts`, `changedNotes`, Texte `statements_existing_fuel_stock` / `_outdated_fuel_stock`; `statement-generate.feature:619`, `statement-wizard.dom.test.ts:1066`. |
| M-3 | Erledigt (B): `declineCorrection` verweigert mit `STATEMENT_CORRECTION_LOWERS_BALANCE`, Knopf nur bei `correctionDeclinable`. Neue Folgefrage: V-30. |
| V-20 | Erledigt (`statements_later_draft`, `statements_recalculate_hint`). |
| V-21 | Erledigt: `check.result !== correctionDeclined.result`; Test `:437` «… nicht fällig, wenn die Abrechnung wieder stimmt». |
| V-22 | Erledigt (siehe «Bestätigt»). |
| V-23 | Erledigt: `CORRECTED` enthält `settled`; Test `:391`. |
| V-24 | Erledigt: `statements_decline_correction_text` wörtlich wie vorgeschlagen. |
| V-25 | Erledigt: `backend_statement_correction_not_due` wörtlich. |
| V-26 | Teilweise: Kopfkommentar `invoice-period-filter.pg.test.ts:1–5` angepasst; Kommentar im Issue nicht geprüft (siehe «Nicht bestätigt»). |
| V-27 | Erledigt: `FIVE_YEARS_AGO` in `overview.ts`, Schweizer Tag (`localToday`, Europe/Zurich), 29.02. → 28.02. |
| V-28 | Nicht übernommen, wie in Runde 2 als vertretbar bezeichnet. Kein offener Punkt. |
| V-29 | Erledigt: `dashboard.feature:174` «am heutigen Tag». |

## Neue Befunde

| ID | Rolle | Schwere | PO-Entscheid | Befund |
|---|---|---|---|---|
| V-30 | Verwalter | Major | ja | `raises` ist strikt `>`: Bleibt der Saldo gleich (nur Anteile verschoben, Rundung auf 5 Rappen, beide Saldi unter CHF 5), ist «Nicht berichtigen» gesperrt. Die Aufgabe bleibt, bis eine berichtigte Abrechnung mit gleichem Betrag erstellt ist, und eine Ablehnung würde «senkt den Saldo» behaupten. |
| V-31 | Verwalter | Minor | nein | `backend_statement_correction_lowers_balance` «senkt den Saldo» ist bei einer Rückerstattung missverständlich (−50 → −233 «senkt», der Mieter erhält mehr) und nennt den Grund nicht. Vorschlag unten. Dieselbe Ablehnung kommt auch, wenn sich die Abrechnung nicht neu berechnen lässt (`correctionDeclinable` ohne `check`). Dort stimmt sie nicht. |
| V-32 | Verwalter | Minor | nein | Ist das Berichtigen fällig, aber «Nicht berichtigen» gesperrt (M-3 B), erklärt die Abrechnung nicht, warum der Knopf fehlt. Vorschlag: ein eigener Satz nach `statements_later_sent` (der entschiedene Text bleibt): «Die Neuberechnung ergibt für {tenant} eine tiefere Nachzahlung oder eine höhere Rückerstattung. Berichtigen Sie die Abrechnung, sonst verlangen Sie mehr als die tatsächlichen Kosten.» |
| V-33 | Verwalter | Nit | ja | `dashboard_task_outdated_drafts_text` (entschieden in E-4, mein Vorschlag aus Runde 1): «… wurden Rechnungen … gelöscht oder der Tankbestand geändert». Das ausgelassene «wurden» passt nicht zum Singular «der Tankbestand». Besser: «… erfasst, geändert oder gelöscht, oder der Tankbestand wurde geändert.» (wie V-8). fr/it/en sind richtig. |
| V-34 | Verwalter | Nit | nein | Verlauf (`MetadataCard.svelte`): «Nicht berichtigt» steht immer nach «Bezahlt», nicht nach Datum. Wird nach «Nicht berichtigen» bezahlt, ist die Reihenfolge falsch. Zeilen nach Datum sortieren. Ein zweites «Nicht berichtigen» überschreibt das erste Datum: vertretbar. |
| V-35 | Verwalter | Nit | nein | Test `:446` stellt den tieferen Saldo mit `balance: '9999.00'` her, nicht mit einer gelöschten Rechnung (Fall aus M-3: Hauswart CHF 732 gelöscht, 187.45 → 4.45). Einen echten Fall ergänzen, dazu einen mit gleichem Saldo (V-30). |

## Begründung der Major-Befunde

### V-30: Gleicher Saldo sperrt «Nicht berichtigen»

- **Beleg:** `backend/src/services/statement.service.ts` `recalculation`: `raises: Number(now.balance) > Number(statement.balance)`. `statement-invoices.service.ts` `statementChanges`: `correctionDeclinable: due && !!check?.raises`. Der Saldo wird auf 5 Rappen abgerundet (`pdf-format.ts:20`, `roundTo5Rappen`, `Math.floor`). Ein Saldo unter CHF 5 wird weder verlangt noch ausbezahlt (`pdf-format.ts:22–23`, `belowMinimum`).
- **Nachgerechnet** (4 Wohnungen, Pro Einheit, Akonto 1200.00, Kosten 1387.45, Saldo 187.45):
  - Eine Rechnung CHF 0.16 kommt dazu, Anteil 0.04. Kosten 1387.49, roh 187.49, abgerundet 187.45. Saldo gleich, Anteil Hauswart 183.00 → 183.04. `changes` = true, `raises` = false: fällig, nicht ablehnbar.
  - Saldo 4.00 → 3.00 (beide unter CHF 5, keiner wird verlangt): fällig, nicht ablehnbar, obwohl sich am Geld nichts ändert.
  - Zum Vergleich: Hauswart 732 gelöscht, 187.45 → 4.45 (`raises` false, richtig gesperrt). Hauswart 732 dazu, 187.45 → 370.45 (`raises` true, richtig erlaubt).
- **Warum falsch:** M-3 B soll verhindern, dass Dwello mehr verlangt als «die tatsächlichen Aufwendungen» (Art. 257b Abs. 1 OR). Bei gleichem Saldo oder bei zwei Saldi unter der Mindestgrenze verlangt die Abrechnung nicht mehr. Trotzdem bleibt die Aufgabe, bis der Vermieter eine berichtigte Abrechnung mit neuer Nummer und gleichem Betrag erstellt. Das ist der Fall, den E-3 und E-6 verhindern sollten (V-4). Lädt die Seite den Knopf und kippt der Fall danach auf «gleich», sagt die Ablehnung «Die Neuberechnung senkt den Saldo», was nicht stimmt.
- **Fix (PO, denn M-3 B ist als «nur, wenn der neue Saldo für den Mieter höher ist» entschieden; der Fall «gleich» war nicht bedacht):**
  - A (empfohlen): Ablehnbar, wenn der Saldo nicht sinkt (`>=`). Dazu den Saldo so vergleichen, wie er verlangt wird: unter CHF 5 gilt 0. Begründung wie M-3: das Geld bleibt gleich oder der Vermieter verzichtet.
  - B: Bei gleichem Saldo gilt das Berichtigen nicht als fällig (E-3 enger: nur der Saldo zählt). Das ändert E-3, nach dem auch ein anderer Anteil an einer Position zählt (Art. 8 Abs. 2 VMWG: der Mieter kann die Unterlagen prüfen). Nicht empfohlen.
  - C: Wie umgesetzt. Dann braucht die Ablehnung einen Text ohne «senkt» und V-32 einen Satz für den gleichen Saldo.

## Vorschläge zum Wortlaut

- **V-31, `backend_statement_correction_lowers_balance`:** «Nach der Neuberechnung zahlt der Mieter weniger nach oder erhält mehr zurück. Berichtigen Sie die Abrechnung mit «Abrechnung berichtigen».» fr: «Après le recalcul, le locataire paie moins ou reçoit un remboursement plus élevé. Rectifiez le décompte avec « Rectifier le décompte ».» it: «Dopo il ricalcolo l’inquilino paga meno o riceve un rimborso maggiore. Rettifichi il conteggio con «Rettificare il conteggio».» en: «After recalculating, the tenant pays less or gets a larger refund. Correct the statement with «Correct statement».» Lässt sich die Abrechnung nicht neu berechnen, braucht die Ablehnung einen eigenen Code und Text, zum Beispiel «Dwello kann diese Abrechnung nicht neu berechnen. Berichtigen Sie sie mit «Abrechnung berichtigen».» (heute nur über die API erreichbar, da der Knopf dann fehlt).
- **V-33:** siehe Tabelle.

## Fehlende Begriffe

- «Nicht berichtigt»: liegt in #538 (Marker `TODO(fachlich prüfen, #538)` in `backend/src/db/schema.ts:458`). Der Vorschlag aus Runde 2 gilt weiter. Mit M-3 B ergänzen: «Nur möglich, wenn die Neuberechnung den Saldo nicht senkt.» (bzw. «erhöht», je nach Entscheid zu V-30).
- Sonst keine neuen Begriffe.

## Bestätigt

- **(a) Texte:**
  - `dashboard_invoices_of_period` «Rechnungen für {Periode} ansehen» und `dashboard_invoices_of_building` «Rechnungen von {Gebäude} für {Periode} ansehen» (V-22): bestätigt. `invoicesOf` nennt das Gebäude, sobald mehr als ein Gebäude im Text steht (`missing.length > 1`), ein Kalenderjahr als «2025», sonst den Bereich («Rechnungen für 01.07.2024 – 30.06.2025 ansehen»). Der Link setzt Gebäude und Periode, wie der Filter sie liest.
  - `statements_recalculate_hint` (V-20): «Geänderte Rechnungen und einen geänderten Tankbestand übernimmt «Neu berechnen» …»: bestätigt (Neuberechnung nimmt `agreedStock`, `calculatedRows`).
  - `backend_statement_correction_lowers_balance`: inhaltlich richtig, wenn die Neuberechnung den Saldo senkt. Wortlaut: V-31.
  - `statements_later_fuel_stock`, `statements_later_and_fuel_stock`, `statements_later_title_fuel_stock`, `_both`, `statements_history_correction_declined`, `dashboard_task_correct_text` mit allen drei `{later}`-Formen: grammatisch richtig («Seit dem Erstellen der Abrechnung … von Anna Keller wurde der Tankbestand der Abrechnungsperiode geändert. Berichtigen Sie …»).
  - fr/it/en aller neuen Texte: Begriffe nach `docs/design/i18n-begriffe.md` geprüft: Abrechnungsperiode (période de décompte / periodo di conteggio / billing period), Tankbestand (stock de combustible / scorta di combustibile / fuel stock), Saldo (solde / saldo / balance), Abrechnungsposition (poste / voce / statement line), Abrechnung berichtigen (Rectifier le décompte / Rettificare il conteggio / Correct statement), Berichtigte Abrechnung (décompte rectificatif / conteggio rettificato / corrected statement), Leistungszeitraum, Rechnungsdatum, Übersicht (vue d’ensemble / panoramica / overview), Entwurf (brouillon / bozza / draft). Französische Guillemets mit Leerschlag, Italienisch ohne, Knöpfe im Infinitiv («Ne pas rectifier», «Non rettificare»), Anrede vous/Lei: alles eingehalten. Keine deutschen Reste.
- **(b) Regeln:**
  - «fällig» = Hinweis vorhanden (Rechnungen oder Tankbestand) **und** Neuberechnung anders als die Abrechnung **und** anders als das gespeicherte «Nicht berichtigt»-Ergebnis. Lässt sich nicht neu berechnen (`recalculated` wirft, Test `:407`), gilt der Hinweis allein. Das ist auch lösbar: «Abrechnung berichtigen» meldet bei einem Mietvertrag ohne Mietstage in der Periode `STATEMENT_NO_RENTAL_DAYS_*` mit dem Betrag (`correctStatement`), der Vermieter kommt also weiter.
  - Vergleich: Saldo und Anteil je Kategorie und Verteilschlüssel, Anteile 0.00 ausgelassen (`sharesOf`, `Number(tenantShare) !== 0`; Anteile sind schon auf Rappen gerundet, `calculation.service.ts:229`, `:398`). Neuberechnung mit Heizprofil, Verwaltungspauschale und `priorPayments` der Abrechnung, Übertrag wie bei «Abrechnung berichtigen» (`calculateStatement`, `carriedOver`): die Prüfung sagt also voraus, was die berichtigte Abrechnung ergibt. Beispiele: V-30. Randfall Bruno (Rechnung nach Auszug, Anteil 0.00): nicht fällig, Test `:375`, `dashboard.feature:150–156`.
  - Saldo-Vorzeichen: `calculateBalance` = Kosten − Akonto, positiv ist Nachzahlung. `raises` (höher) heisst also: der Mieter schuldet mehr oder erhält weniger zurück, und «Nicht berichtigen» ist ein Verzicht des Vermieters. Beispiel Rückerstattung −50.00 → −20.00: ablehnbar (Vermieter zahlt 50 statt 20 zurück, zugunsten des Mieters); −50.00 → −233.00: gesperrt. Richtig nach M-3 B.
  - «Überfällig» wie «versendet»: `CORRECTED = ['sent', 'overdue', 'paid', 'settled']`; `overdue` wird aus der Zahlungsfrist berechnet (`statement.service.ts:210–215`, `:301–307`), Test `:383`.
  - Verjährungssatz: fünf Kalenderjahre ab dem Schweizer Tag (`localToday`, `timeZone: 'Europe/Zurich'`), `periodEnd < FIVE_YEARS_AGO(today)`. Nachgerechnet: heute 20.10.2026 → Grenze 20.10.2021; Periodenende 31.12.2020 ja, 20.10.2021 nein (genau fünf Jahre sind nicht «mehr als»), 19.10.2021 ja. Heute 29.02.2028 → `Date.UTC(2023, 1, 29)` = 01.03.2023, Monat weicht ab, `setUTCDate(0)` → 28.02.2023; Periodenende 28.02.2023 nein, 27.02.2023 ja. Der Satz behauptet keine Verjährung (Beginn der Frist nach Art. 130 Abs. 1 OR ist die Fälligkeit, Runde 1), er rät zur Beratung: richtig.
  - Entwürfe: jede Änderung macht nicht aktuell (Rechnungen oder Tankbestand), die Aufgabe «Entwürfe prüfen» zählt nur die aktuellen (`currentDrafts`), damit kein Entwurf doppelt als «zustellen» erscheint: richtig.
  - Rechnungsliste mit dem Filter «Abrechnungsperiode»: Regel 1 (`inPeriodOf`) ist jetzt dieselbe Bedingung wie in `getInvoicesForStatement`; Gruppen nur mit dem Filter; «davon {Betrag} in der Abrechnungsperiode» nur bei einem Leistungszeitraum über die Periode hinaus (Rechnung aus Runde 2: 900 × 31 / 90 = 310.00). Neuer Testfall «service outside, dated inside» (Leistungszeitraum ab Januar, Periode 01.12.2025 – 31.01.2026): gehört dazu, der Leistungszeitraum berührt die Periode.
- **(c)** «Nicht berichtigt» liegt in #538 mit Marker in `schema.ts`: bestätigt.

## Nicht bestätigt

- V-26: ob der Kommentar zu «Done means» Punkt 1 in Issue #454 ergänzt ist: GitHub nicht gelesen, nur der Test-Kommentar im Worktree.
- Ob `calculateStatementForContract` bei offenen Vereinbarungen wirft (dann gälte «nicht neu berechenbar», und der Hinweis allein machte fällig), während `correctStatement` mit `refuseOpenAgreements` ablehnt: nur `recalculated` und `correctStatement` gelesen; `calculation.service.ts` nicht bis dahin verfolgt.
- DOM- und E2E-Tests nicht ausgeführt (Auftrag); `statement-pages.dom.test.ts:646` («… nicht an, wenn das Berichtigen den Saldo senken würde») nur nach Namen geprüft.
- Ob der Mieter einen zu hoch bezahlten Saldo nach Art. 62/63 OR oder vertraglich zurückfordert: wie Runde 2 **unsicher**. Für V-30 nicht nötig.
