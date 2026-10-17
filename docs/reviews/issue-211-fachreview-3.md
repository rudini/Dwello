# Fachreview #211 / #199, Runde 3 (nach der Umsetzung)

Gegenstand: die Regel in `src/lib/accounting-period.ts` (`missingPeriods`, `periodName`), `src/lib/server/missing-statements.ts`, `src/lib/overview.ts`, `src/routes/dashboard/+page.server.ts`, `src/routes/contracts/[id]/+page.server.ts` und `MissingStatement.svelte`. Dazu die Schlüssel `contracts_statement_missing_partial`, `contracts_missing_statement_badge`, `dashboard_task_missing_period_text` und `dashboard_task_missing_periods_text` in de/fr/it/en. Worktree: `review-211-fach3`, Commit ca7170e7, Diff gegen 6a76fbcf. Stichtag: 17.10.2026.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-17 | Verwalter | Major | #211 und #281 sind seit heute (17.10.2026, 10:34) als Duplikat von #408 geschlossen (`fachlich`, `entscheiden`). Der Marker `TODO(fachlich prüfen, #281)` nennt ein geschlossenes Issue, und `check-issues` schlägt deshalb fehl. Den Rechnungslink, wie er umgesetzt ist, führt #408 Punkt 1 noch als offenen Entscheid. «Fixes #211» geht nicht mehr. |
| V-10 | Verwalter | Minor | (Einspruch) Durch diese Änderung wird der allgemeine Mehrzahltext jetzt in **jedem** Fall mit mehreren Bereichen falsch: «Jede Schaltfläche öffnet den Assistenten», obwohl jetzt neben jedem Bereich auch ein Knopf «Rechnungen … ansehen» steht. Bei einem Teilbereich widerspricht zudem «noch keine Nebenkostenabrechnung in Dwello» dem Satz zum Teil. Die Korrektur ist einfach. |
| V-11 | Verwalter | Minor | (teils bestätigt) Gleiche Bereiche erscheinen einmal, das ist richtig. Ein Bereich, der ganz in einem anderen genannten Bereich liegt, wird aber vor diesem genannt: «Ahornhof (01.07.2024 – 31.12.2024, 2024, 2023)». Der Rechnungslink der Übersicht hat keinen Gebäudefilter, und «Abrechnungen erstellen» passt nicht zur Seite des Mietvertrags. |
| V-15 | Verwalter | Minor | Ein Teilbereich wird nicht auf die Mietstage gekürzt. Es erscheinen Tage vor dem Vertragsbeginn oder nach dem Vertragsende, zum Beispiel «für 01.01.2024 – 30.06.2024 gibt es noch keine Abrechnung» bei einem Vertragsbeginn am 01.04.2024. Laut #199 nennt Dwello die Tage ohne Abrechnung. |
| V-18 | Verwalter | Minor | (Rest von V-9) Der Satz nennt die Periode der bestehenden Abrechnung nicht, obwohl #199 sie verlangt. Das geht nur, wenn #199 offen bleibt (Refs, nicht Fixes). |
| V-21 | Verwalter | Minor | Bei einem Teilbereich fehlt der Hinweis «Abgerechnet bis» für den ganzen Hinweis. Für ganze Perioden **vor** der ersten Abrechnung in Dwello wäre «Abgerechnet bis» aber erlaubt und der richtige Ausweg. |
| V-13 | Verwalter | Nit | bestätigt, bleibt: zwei gleiche Links «Rechnungen 2024 ansehen» mit demselben Ziel |
| V-19 | Verwalter | Nit | «Eine bestehende Abrechnung deckt nur einen Teil **der** Abrechnungsperiode ab» stimmt nicht, wenn die Teile in zwei Perioden liegen |
| V-20 | Verwalter | Nit | fr «Immeubles sans décompte : …» nennt jetzt auch Gebäude, die für einen Teil schon eine Abrechnung haben. Deutsch und Italienisch sagen «noch nicht abgerechnet». |
| M-2 | Mietrecht | Minor | (bleibt) Perioden, die über 5 Jahre zurückliegen, erscheinen ohne Warnung. Mit dieser Änderung stehen sie jetzt auch auf der Übersicht. Ein Issue dazu gibt es weiter nicht. |
| V-5 | Verwalter | Minor | (bleibt) Der Rechnungslink filtert nach dem Rechnungsdatum. Der Punkt steht jetzt in #408 Punkt 1, siehe V-17. |
| M-3 | Mietrecht | Minor | (bleibt) unverändert |
| V-7 | Verwalter | Minor | (bleibt) Die UL-Einträge in `UBIQUITOUS_LANGUAGE.md:46–47` sind veraltet. Die Begriffe stehen in #408 Punkt 2. |

## Stand der Befunde aus Runde 2

| ID | Stand |
|----|-------|
| V-9 | Grösstenteils gelöst. Der Text nennt nur noch Tatsachen. «Abgerechnet bis» fehlt bei einem Teilbereich, und `contract-detail.feature` prüft das («nennt … nicht als Ausweg»). Offen sind der Rest (V-18) und eine Überkorrektur (V-21). Der Marker zeigt auf ein geschlossenes Issue (V-17). |
| V-10 | Einspruch, siehe unten |
| V-11 | Teils bestätigt, siehe unten |
| V-12 | Gelöst: `contract-detail.steps.ts:256` prüft auch `${year}-01-01` mit `false` |
| V-13 | Bestätigt als Nit |
| V-14 | Gelöst: Der Marker in `statement-generation.ts:52` ist ersetzt. Das Label `entscheiden` an #211 ist erledigt, weil #211 geschlossen ist (V-17). |
| M-2, V-5, M-3, V-7 | Bleiben Minor. M-2 ist mit dieser Änderung sichtbarer geworden, siehe unten. |

---

## V-17 (Major): #211 und #281 in #408 zusammengeführt

**Beleg.**
- `gh api repos/rudini/Dwello/issues/211`: `state: closed`, `state_reason: duplicate`, closed_at 2026-10-17T10:34:33Z, Kommentar «Consolidated into #408». Bei #281 ist es gleich (10:34:36Z).
- #408 («Decide billed periods …», offen, `fachlich,entscheiden`), Punkt 1: «#211, decided: … the warning links to the building's invoices of the period … **Still open:** the invoice list filters by the year of the Rechnungsdatum …: link anyway, or filter the list by period.»
- `src/routes/contracts/[id]/MissingStatement.svelte:30`: `// TODO(fachlich prüfen, #281): what the landlord does with these days`. `tools/open-work/check-issues.mjs:62–63` meldet einen Fehler, wenn ein Marker ein Issue nennt, das nicht `open` ist.
- `implementation_plan.md`: «pull request (Fixes #211, Refs #199, #281)».

**Warum falsch.** Nach CLAUDE.md, «Open work», braucht eine offene `entscheiden`-Frage zu denselben Daten, die das Ergebnis ändert, zuerst einen Entscheid. #408 Punkt 1 ist eine solche Frage: Die Umsetzung hat «link anyway» gewählt (`overview.ts:invoicesOf`, ohne Jahresfilter bei einem Bereich über den Jahreswechsel). Der Marker lässt CI scheitern. Ein geschlossenes Issue kann der Pull Request nicht schliessen.

**Korrektur.**
- Den Marker und die Kommentare auf #408 umstellen: `MissingStatement.svelte:30`, `+page.server.ts:24/87`, `contract-actions.test.ts:186`, `contract-detail-page.dom.test.ts:302`, `contract-detail.feature:258`.
- Den Pull Request mit `Refs #408` (und `Refs #199`) verknüpfen.
- Unter «Blocked on me» festhalten, dass der Rechnungslink auf den Entscheid in #408 Punkt 1 wartet, oder der Product Owner bestätigt dort «link anyway».

## V-10 (Minor, Einspruch): Der allgemeine Text stimmt nicht mehr

**Beleg.**
- `messages/de.json:1612`: «Der Mietvertrag hat Mietstage in diesen Abrechnungsperioden, aber noch keine Nebenkostenabrechnung in Dwello. Jede Schaltfläche öffnet den Assistenten für alle Mietverträge des Gebäudes in dieser Periode. …»
- `MissingStatement.svelte` zeigt neu pro Bereich zusätzlich `<Button href={period.invoices.href} variant="ghost" icon="invoice">` an. «Jede Schaltfläche öffnet den Assistenten» ist deshalb bei mehreren Bereichen immer falsch, auch ohne Teilbereich.

**Nachgerechnet** (`contract-detail.feature`, «Teilweise abgerechnete Periode», Anna):
- `missingPeriods` ergibt «2025» und «01.10.2024 – 31.12.2024».
- Angezeigt werden der Titel «2 Abrechnungen fehlen», der Satz «… aber noch keine Nebenkostenabrechnung in Dwello. Jede Schaltfläche öffnet den Assistenten …», danach «Eine bestehende Abrechnung deckt nur einen Teil der Abrechnungsperiode ab; …» und die Knöpfe «2025 abrechnen», «Rechnungen 2025 ansehen» und «Rechnungen 2024 ansehen».
- Damit widersprechen sich zwei Sätze direkt.

Für die Einzahl hat die Umsetzung denselben Widerspruch selbst erkannt (Kommentar «untrue for a single part») und den Text weggelassen.

**Korrektur** (einfach, in allen vier Sprachen):
- «Der Mietvertrag hat in diesen Abrechnungsperioden Mietstage ohne Nebenkostenabrechnung in Dwello. Jede Schaltfläche «… abrechnen» öffnet den Assistenten für alle Mietverträge des Gebäudes in dieser Periode. …»
- fr: «… des jours de location sans décompte des charges dans Dwello. Chaque bouton « Établir … » ouvre …»
- it: «… giorni di locazione senza conteggio spese accessorie in Dwello. Ogni pulsante «Allestire …» apre …»
- en: «… days rented without a utility cost statement in Dwello. Each «Bill …» button opens …»

Dazu ein DOM-Test, der den alten Text rot zeigt.

## V-11 (Minor, teils bestätigt): Zusammenfassen auf der Übersicht

**Bestätigt.** `dashboard/+page.server.ts` fasst Bereiche mit gleichem `start/end` pro Gebäude zusammen und sortiert sie nach Beginn absteigend, bei gleichem Beginn nach Ende. Mieterwechsel: Bruno bis 30.06.2024, Carla ab 01.07.2024, beide ohne Abrechnung. Beide Verträge haben «2024», angezeigt wird «Ahornhof (2024)». Das ist richtig.

**Einspruch.** Beispiel aus Runde 2, mit der Umsetzung nachgerechnet:
- Bruno: 01.01.2023–30.06.2024, ohne Abrechnung.
- Carla: ab 01.07.2023, Abrechnung 01.01.–30.06.2024.
- Bruno fehlen damit {2024, 2023}, Carla fehlen {01.07.–31.12.2024, 2023}. Carla ist 2023 nicht gekürzt, weil sie 2023 gar keine Abrechnung hat.
- Ergebnis: «Ahornhof (01.07.2024 – 31.12.2024, 2024, 2023)». Der Teil steht vor der Periode, in der er liegt. Ein Verwalter liest das als zwei verschiedene Lücken.

Weiter offen sind zwei Punkte:
- `overview.ts`: `invoicesOf(newest(missingStatements))` ohne `building`, auch wenn nur ein Gebäude genannt ist.
- Der Knopf «Abrechnungen erstellen» führt bei einem Teilbereich in den Assistenten, die Seite des Mietvertrags bietet dafür keinen an (#211: «same rule»).

**Korrektur.**
- Einen Bereich weglassen, der ganz in einem anderen genannten Bereich desselben Gebäudes liegt. Im Beispiel ergibt das «Ahornhof (2024, 2023)».
- `building=` setzen, wenn nur ein Gebäude genannt ist.
- Die Handlung bei Teilbereichen gehört zu #408 Punkt 2.

Das kann als Minor offen bleiben.

## V-15 (Minor): Teilbereiche nicht auf die Mietstage gekürzt

**Beleg.** Die Logik von `uncovered`/`missingPeriods` habe ich unverändert in ein Skript im Scratchpad kopiert (`calc211/calc.ts`) und mit dem Stichtag 17.10.2026 gerechnet:
- Vertragsbeginn 01.04.2024, Abrechnung 01.07.–31.12.2024: Ergebnis «2025», «01.01.2024 – 30.06.2024».
- Vertrag 01.01.2023–30.11.2024, Abrechnungen 2023 und 01.01.–30.09.2024: Ergebnis «01.10.2024 – 31.12.2024», obwohl der Vertrag am 30.11. endet.

`billsIn` prüft nur, ob es überhaupt einen Mietstag gibt, und kürzt nichts.

**Warum falsch.** #199 (Decided): «Dwello names the uncovered days». Der Satz «für 01.01.2024 – 30.06.2024 gibt es noch keine Abrechnung» nennt drei Monate, in denen der Mieter gar nicht mietete. Für ganze Perioden ist das ungekürzte «2024» richtig, weil der Lauf ganze Perioden abrechnet (Runde 2). Für einen Teil, der keinen Knopf hat und nur eine Auskunft ist, ist es irreführend.

**Korrektur.** Einen Teilbereich, der keine ganze Periode ist, auf [max(Beginn, Vertragsbeginn, Abgerechnet bis + 1), min(Ende, Vertragsende)] schneiden. Dazu einen Unit-Test mit dem ersten Beispiel. Ob das für die Übersicht gleich gilt, folgt aus derselben Funktion.

## V-18 (Minor): Periode der bestehenden Abrechnung fehlt

**Beleg.** #199, Decided: «Dwello names the uncovered days **and the period of the existing statement** (e.g. «… bis 31.12.2024» …)». Der Text lautet: «Eine bestehende Abrechnung deckt nur einen Teil der Abrechnungsperiode ab; …».

**Bewertung.** Das ist zulässig, solange der Pull Request #199 nur referenziert (Plan: «Refs #199»). Den Punkt in #199 oder #408 als offen festhalten. Vorschlag für später: «Die Abrechnung 01.04.2024 – 30.09.2024 deckt nur einen Teil der Abrechnungsperiode 2024 ab; für 01.10.2024 – 31.12.2024 gibt es noch keine Abrechnung.»

## V-21 (Minor): «Abgerechnet bis» fehlt auch dort, wo es hilft

**Beleg.** `MissingStatement.svelte`: Bei `parts.length` ersetzt `hint` den Hinweis «Abgerechnet bis» ganz. Beispiel:
- Vertrag ab 2022, ohne Abrechnung 2022 und 2023, Abrechnung in Dwello 01.04.–31.12.2024 (Vertragsbeginn 2022).
- Es fehlen «2023», «2022» und «01.01.2024 – 31.03.2024». Der Hinweis «Abgerechnet bis» fehlt.
- Mit «Abgerechnet bis» 31.12.2023 wird `billingStart` = 01.01.2024. Für die Abrechnung ist `greatest(2024-04-01, 2024-01-01)` = 01.04.2024, also unverändert. Das Backend nimmt das also an (Prüfung wie in Runde 2, `contract.service.ts` `statementsChanged`).

**Warum.** Hat der Verwalter 2022 und 2023 ausserhalb von Dwello abgerechnet, was nach einem Umstieg auf Dwello typisch ist, erfährt er den Ausweg nicht mehr.

**Korrektur.** Den Hinweis nur weglassen, wenn kein ganzer Bereich vor dem Beginn der ersten Abrechnung in Dwello liegt. Oder einfacher: ihn zeigen, solange es einen Bereich mit Knopf gibt, der vor allen Teilbereichen liegt. Kein Blocker.

## V-13 (Nit, bestätigt)

Im Fall «zwei Lücken» (Abrechnung 01.03.–30.06.2024) ergibt die Rechnung «01.07.2024 – 31.12.2024» und «01.01.2024 – 29.02.2024». Beide Links lauten «Rechnungen 2024 ansehen» und zeigen auf `/invoices?building=…&year=2024`. Das kann so bleiben.

## V-19 (Nit)

Beispiel: Abrechnungen 01.04.–31.12.2023 und 01.04.–31.12.2024, Vertrag ab 01.01.2023. Es fehlen «01.01.2024 – 31.03.2024» und «01.01.2023 – 31.03.2023». Der Satz sagt trotzdem «Eine bestehende Abrechnung … der Abrechnungsperiode». Neutral wäre: «Bestehende Abrechnungen decken nur einen Teil der Abrechnungsperiode ab; …», oder je eine Fassung für einen und für mehrere Teile.

## V-20 (Nit, fr)

`messages/fr.json:269–270`: «Immeubles sans décompte : {buildings}». Seit dieser Änderung steht dort auch «Ahornhof (01.07.2023 – 31.12.2023)» für ein Gebäude mit einer Abrechnung bis 30.06.2023. Vorschlag nach dem deutschen «Noch nicht abgerechnet»: «Pas encore décompté : {buildings}.»

## M-2 (Minor, bleibt; sichtbarer)

Die Übersicht nannte bisher nur die letzte Periode. Jetzt nennt sie jede Periode seit Vertragsbeginn, also auch solche, die über 5 Jahre zurückliegen (`dashboard.feature:13`: Seeblick 2025 … 2020). `docs/nebenkostenabrechnung-anforderungen.md:78` verlangt dafür eine Warnung. «Abgerechnet bis» (#133) ist ein Ausweg. Ein Issue `fachlich` zur Verjährung fehlt noch (Titel der offenen Issues durchgesehen, kein Treffer). Der Beginn der Frist bleibt **unsicher** (Runde 1).

---

## Bestätigt

**Regel `missingPeriods`.** Nachgerechnet mit einer Kopie der Logik, Stichtag 17.10.2026:
- Anna, Vertragsbeginn 01.04.2024, Abrechnung 01.04.–30.09.2024: «2025», «01.10.2024 – 31.12.2024». Das entspricht dem Szenario.
- Wechsel Juli–Juni auf Kalenderjahr, Vertrag ab 01.07.2023, Abrechnung 07.2023–06.2024: «2025», «01.07.2024 – 31.12.2024». Die erste Lücke, 01.01.–30.06.2023, hat keine Mietstage und fällt weg. Das ist der Fall Marc aus #199.
- Randfall null: Abrechnungen 2024 und 2025 decken alles ab, es fehlt nichts.
- Ersetzte Abrechnung (#120): Sie zählt nicht, es fehlt «2025».
- «Abgerechnet bis» 30.06.2025 ohne Abrechnung: «2025» bleibt ganz und hat einen Knopf. Das stimmt mit Runde 2, Punkt 4, überein.
- Juli–Juni bei einer Abrechnung im Kalenderjahr 2024: «01.07.2025 – 30.06.2026», «01.01.2025 – 30.06.2025». Das ist richtig.
- Dashboard-Szenario Bruno (01.01.–31.12.2023, Abrechnung 07.2022–06.2023): «01.07.2023 – 31.12.2023».
- Die Überlappungsregel verhindert, dass die Tage eines Vertrags zweimal abgerechnet werden, so wie es #199 entschieden hat.
- Beträge und Rückerstattungen kommen nicht vor.

**Anzeige.**
- Nur eine ganze Periode bekommt einen Knopf in den Assistenten (`+page.server.ts`, `whole.some`). Das ist richtig, solange der Teil der kurzen Periode in #408 offen ist.
- `periodName`: Ein Kalenderjahr erscheint als Zahl, alles andere mit Daten. Das passt zu den Szenarien.
- Mietvertragsliste: «Abrechnung fehlt» folgt derselben Regel (`missingByContract`). Wenn die Daten nicht lesbar sind, erscheint keine Markierung. #211 hat das entschieden.
- Die Übersicht nutzt dieselbe Funktion, auch für beendete Verträge, so wie #211 es verlangt.

**Texte und Übersetzungen** (gegen `docs/design/i18n-begriffe.md`):
- Abrechnung (kurz): décompte / conteggio / statement.
- Abrechnungsperiode: période de décompte / periodo di conteggio / billing period.
- Gebäude: immeubles / immobili («conteggiati», männlich Mehrzahl, passt).
- Die Badges «Décompte manquant», «Conteggio mancante» und «Statement missing» passen zu den bestehenden Titeln `contracts_statement_missing` (`:1609`).
- Einzahl und Mehrzahl «dieser Periode / dieser Perioden», «cette période / ces périodes», «questo periodo / questi periodi» und «this period / these periods» stimmen. `missingText` wählt nach der Zahl der Bereiche, nicht nach der Zahl der Gebäude. Das ist richtig.
- Der Teilsatz in fr, it und en entspricht dem Deutschen, und «Sie» bzw. «vous» bleibt gewahrt.
- fr: Vor «;» und «:» steht ein normales Leerzeichen. In der Datei ist das gemischt (45-mal ein normales, 27-mal ein geschütztes Leerzeichen vor «;»). Die Stilregel verlangt das geschützte Leerzeichen nur innerhalb von Guillemets, das ist also kein Befund.

**Recht.** Art. 4 Abs. 1 VMWG (Fedlex, SR 221.213.11, https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de, über `mmx search` gefunden): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Dass jeder ungedeckte Teil seit Vertragsbeginn gemeldet wird, setzt diese Pflicht um. Ohne die Kürzung nach V-15 meldet Dwello allerdings auch Tage ausserhalb des Mietverhältnisses.

## Nicht bestätigt

- **Beginn der Verjährung nach Art. 128 Ziff. 1 OR** (M-2): **unsicher**, in dieser Runde nicht neu gesucht.
- **Rechnungsformular «Rechnung schon abgerechnet»**: #211 verlangt dort dieselbe Regel. Dieser Diff ändert `BilledWarning.svelte` nicht, und die Warnung prüft eine andere Frage (Abrechnungen, die diese Rechnung enthalten). Ob das ausreicht, entscheidet jetzt #408 Punkt 1. Nicht geprüft.
- **Zeitzone**: `missingPeriods` nimmt `new Date()` (UTC) und nicht `localToday()`. In der ersten Stunde einer neuen Periode (Schweizer Zeit) fehlt der Hinweis noch. Das war schon vorher so, nicht weiter geprüft.
- **E2E-, Unit- und DOM-Tests**: nicht ausgeführt. Nachgerechnet habe ich nur mit der kopierten Logik (Skript `calc211/calc.ts` im Scratchpad).
- **Issues zu M-2**: Volltextsuche nicht genutzt, nur die Titel der offenen Issues durchgesehen.
