# Fachreview #211 / #199, Runde 2 (Szenarien vor der Umsetzung)

Gegenstand: die `@wip`-Szenarien und die Kommentare zu #211/#199/#133 in `dashboard.feature`, `contracts.feature` und `contract-detail.feature` sowie die zugehörigen Schritte. Dazu die Regel nach V-6 und die vier geplanten Texte. Worktree: `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/review-211-fach2` (Commit c662362a). Stichtag der Szenarien: 17.10.2026, also `lastYear` = 2025.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-9 | Verwalter | Major | Text 1 sagt etwas Falsches («Der Assistent rechnet nur ganze Abrechnungsperioden ab»). Der Hinweis «Abgerechnet bis» darunter führt bei einer Teilabdeckung ins Leere. Die Periode der bestehenden Abrechnung nennt der Text nicht (#199). |
| V-10 | Verwalter | Minor | Die bestehenden Texte des Hinweises widersprechen dem neuen Satz («aber noch keine Nebenkostenabrechnung», «Jede Schaltfläche öffnet den Assistenten») |
| V-11 | Verwalter | Minor | Übersicht: Offen ist, wie die Teile mehrerer Mietverträge eines Gebäudes zusammengefasst werden. Der Rechnungslink hat keinen Gebäudefilter, und die Handlung «erstellen Sie dann die Abrechnungen» passt nicht zu einem Teilbereich. |
| V-12 | Verwalter | Minor | Der Schritt «bietet … für die Tage ab "2024-10-01" keine Abrechnung zum Erstellen an» wird auch grün, wenn noch der falsche Link auf die ganze Periode 2024 da ist |
| V-13 | Verwalter | Nit | Zwei Teilbereiche im selben Jahr ergeben zwei gleiche Links «Rechnungen 2024 ansehen» |
| V-14 | Verwalter | Nit | Ablauf: #211 hat noch das Label `entscheiden`. Der Marker `TODO(fachlich prüfen, #199)` in `statement-generation.ts:52` wird mit dieser Änderung falsch. |
| M-2 | Mietrecht | Minor | (aus Runde 1, offen) Perioden, die vor über 5 Jahren endeten, erscheinen ohne Hinweis. Ein Issue dazu gibt es nicht. |
| V-5 | Verwalter | Minor | (aus Runde 1, offen) Der Rechnungslink filtert nach dem Jahr des Rechnungsdatums, #211 verlangt «filtered by building and period». Ein Issue dazu gibt es nicht. |
| M-3 | Mietrecht | Minor | (aus Runde 1, offen) Der Satz in #199 «not for every period since the Vertragsbeginn» ist nicht geklärt |
| V-7 | Verwalter | Minor | (aus Runde 1, teilweise offen) Die UL-Einträge «Hinweis auf fehlende Abrechnungen» und «Abgerechnet bis» sind veraltet. Diese Änderung braucht die neue Bedeutung schon jetzt, nicht erst mit #281. |

## Stand der Befunde aus Runde 1

| ID | Stand | Begründung |
|----|-------|------------|
| M-1 | aus dieser Änderung genommen, offen in #281 | Das Angebot der kurzen Periode ist entfernt (`contract-detail.feature:259`). Im Szenario «Teilweise abgerechnete Periode» ist Anna einzige Mieterin, dort entstehen keine gemischten Perioden. |
| V-1 | aus dieser Änderung genommen, offen in #281 | Die Szenarien für Schritt 2 sind entfernt. In `statement-generate.feature` steht kein `@wip` zu #199 mehr. |
| V-2 | teilweise gelöst | Der Knopf für den Teilbereich fehlt jetzt, das ist richtig. Der neue Text ist aber falsch, siehe V-9 und V-10. |
| V-3 | gelöst | #133 ist auf main. Neue Szenarien: `dashboard.feature:162–170`, `contracts.feature:76–79`, `contract-detail.feature:246–251`. |
| M-2 | offen (Minor) | unverändert, siehe unten |
| V-4 | gelöst | `dashboard.feature:172–184`, nachgerechnet unter «Bestätigt» |
| V-5 | offen (Minor) | unverändert, siehe unten |
| V-6 | gelöst (Regel) | Die Regel ist jetzt festgelegt und nachgerechnet, siehe «Bestätigt». Den Unit-Test für zwei Lücken in einer Periode braucht es noch bei der Umsetzung. |
| M-3 | offen (Minor) | Der Kommentar vom 16.10.2026 in #199 klärt den Satz nicht |
| V-7 | teilweise | #281 nennt unter «Terms to decide with it» die Begriffe zur kurzen Periode. Was davon diese Änderung schon braucht, steht unter V-7 unten. |
| V-8 | gelöst | `dashboard.steps.ts`: `(?<=[(, ])${period}[,)]`. «Ahornhof (01.07.2023 – 31.12.2023)» trifft «2023» nicht mehr, «Ahornhof (2025, 2023)» schon. |

---

## V-9 (Major): Text 1 ist falsch und lässt den Verwalter ohne Ausweg

**Beleg.**
- Geplanter Text 1: «Für die übrigen Tage erstellt Dwello noch keine Abrechnung: Der Assistent rechnet nur ganze Abrechnungsperioden ab.»
- Der Assistent nimmt freie Daten an: `src/routes/statements/generate/PeriodStep.svelte:21–34` (zwei `DateInput` ohne Bindung an die Einstellung). `src/routes/statements/generate/+page.server.ts` `chosen()` übernimmt jedes gültige `start`/`end`. Der Lauf überspringt nur Verträge, deren Abrechnung die gewählte Periode **schneidet** (`src/lib/server/statement-generation.ts:63–66`). Wählt der Verwalter im Szenario «Teilweise abgerechnete Periode» (Anna, Abrechnung 01.04.–30.09.2024) die Periode 01.10.2024 – 31.12.2024, schneidet nichts, und Dwello erstellt Annas Abrechnung. Die Aussage ist also falsch.
- Der Hinweis «Abgerechnet bis» bleibt unter dem neuen Satz stehen (`messages/de.json:1614–1615`: «Haben Sie diese Periode ausserhalb von Dwello abgerechnet? Tragen Sie … «Abgerechnet bis» ein.»). Für einen Teilbereich nach einer Abrechnung in Dwello lehnt das Backend das ab. Die Prüfung steht in `backend/src/services/contract.service.ts:326–327` und `:330–350` (`statementsChanged`). Nachgerechnet: «Abgerechnet bis» 31.12.2024 ergibt `billingStart` 01.01.2025. Für Annas Abrechnung ist `greatest(2024-04-01, 2025-01-01)` = 01.01.2025, und das ist nicht ihr `rental_start` 01.04.2024. Die Abrechnung gilt damit als geändert, und es folgt `BilledDaysError`. Das zeigt auch `contract-edit.feature:55–59`. Ausser bei einem Entwurf, den der Verwalter löscht, gibt es damit keinen Weg, den Hinweis zu beenden.
- #199 (Decided): «Dwello names the uncovered days **and the period of the existing statement** (e.g. «… bis 31.12.2024» …)». Dieser Teil hängt nicht am Angebot der kurzen Periode (#281). Text 1 sagt nur «Eine Abrechnung».
- Art. 4 Abs. 1 VMWG (Fedlex, SR 221.213.11): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Bleiben 01.10.–31.12.2024 offen, rechnet niemand Annas Akontobeiträge für diese drei Monate ab.

**Warum falsch.** Die Zielgruppe glaubt dem Text: Sie erfährt, dass Dwello es nicht kann, und findet den Weg nicht, den der Assistent heute anbietet. Der zweite Hinweis schickt sie in eine Ablehnung. Die Warnung bleibt so für immer stehen, ohne Handlung (Design-Regel «errors say what happened and what to do»).

**Korrektur.**
1. Den Text auf Tatsachen beschränken und die bestehende Abrechnung nennen (#199). Einzahl, als Vorschlag: «Die Abrechnung 01.04.2024 – 30.09.2024 deckt nur einen Teil der Abrechnungsperiode 2024 ab. Für 01.10.2024 – 31.12.2024 gibt es noch keine Abrechnung.»
2. Die Handlung ist ein Produktentscheid und gehört als Kommentar in #281. Option a: «Wählen Sie im Assistenten diese Tage als Abrechnungsperiode.» Das ist der heutige Weg und für ein Gebäude mit einem einzigen Mietvertrag fachlich richtig, sonst gilt das Risiko aus M-1. Option b: keine Handlung, ausdrücklich bis #281. Bis zum Entscheid darf der Text den Assistenten nicht als unfähig darstellen; «Dwello erstellt noch keine» verspricht zudem eine künftige Funktion.
3. Bei einem Teilbereich mit einer Abrechnung in Dwello davor den Hinweis «Abgerechnet bis» weglassen, oder ihn nur bei ganzen Perioden zeigen. Ein Szenario oder DOM-Test prüft, dass er dort fehlt.

## V-10 (Minor): Die bestehenden Texte widersprechen dem Teilfall

**Beleg.** `messages/de.json:1609`: «Der Mietvertrag hat Mietstage in dieser Abrechnungsperiode, aber noch keine Nebenkostenabrechnung. Der Assistent erstellt die Abrechnungen …». `:1611` (Mehrzahl): «… aber noch keine Nebenkostenabrechnung in Dwello. Jede Schaltfläche öffnet den Assistenten für alle Mietverträge des Gebäudes in dieser Periode.» Im Szenario «Teilweise abgerechnete Periode» fehlen für Anna zwei Bereiche, nachgerechnet: 2025 ganz und 01.10.–31.12.2024. Es gilt also die Mehrzahl, und der neue Satz kommt dazu. Dann steht «noch keine Nebenkostenabrechnung» neben «Eine Abrechnung deckt nur einen Teil … ab». Für 01.10.–31.12.2024 gibt es keinen Knopf in den Assistenten, wohl aber den Link «Rechnungen 2024 ansehen». Er hat die Form eines Knopfs, falls er wie die anderen ein `Button` ist.

**Korrektur.** Eine Fassung, die beide Fälle trägt: «Der Mietvertrag hat in diesen Abrechnungsperioden Mietstage ohne Nebenkostenabrechnung in Dwello.» Einzahl: «… in dieser Abrechnungsperiode …». Den zweiten Satz statt «Jede Schaltfläche» an den Knopf binden: «Die Schaltfläche «… abrechnen» öffnet den Assistenten …». So bleibt der Text richtig, wenn bei einem Teilbereich kein Knopf da ist. Alle vier Sprachen.

## V-11 (Minor): Übersicht, Zusammenfassen pro Gebäude, Rechnungslink und Handlung

**Beleg.** Geplanter Text 3: «Noch nicht abgerechnet: Ahornhof (2025, 01.07.2024 – 31.12.2024), Seeblick (2023). … Its invoice link goes to the newest period.» Heute baut `src/lib/overview.ts:104–110` den Link ohne Gebäude (`/invoices?year=…`), und der Knopf führt auf `/statements/generate` ohne Periode (`:158`).

**Nachrechnung.** Ahornhof, Bruno vom 01.01.2023 bis 30.06.2024 ohne Abrechnung, Carla ab 01.07.2023 mit Abrechnung 01.01.–30.06.2024:
- Bruno fehlen 2023 und 2024.
- Carla fehlen 01.07.–31.12.2023 und 01.07.–31.12.2024.

Pro Gebäude stünden damit «2024, 01.07.2024 – 31.12.2024, 2023, 01.07.2023 – 31.12.2023» da. Der Teilbereich liegt jeweils in der ganzen Periode, und das Ende ist gleich, also bestimmt «das Neuste zuerst» die Reihenfolge nicht eindeutig.

**Warum.** Die Liste wird lang und doppelt. Der Link «Rechnungen 2025 ansehen» zeigt alle Gebäude, die Rechnungen von Seeblick 2023 aber gar nicht. Der Text sagt «erstellen Sie dann die Abrechnungen». Für einen Teilbereich sagt die Seite des Mietvertrags dagegen, dass es keinen Knopf gibt, und #211 verlangt «All screens use the same rule».

**Korrektur.**
- Festlegen, dass Dwello pro Gebäude unterschiedliche Bereiche nennt und einen Bereich weglässt, der ganz in einem anderen genannten liegt («2024, 2023»). Sortiert wird nach Ende, dann nach Beginn, absteigend.
- Den Link mit `building=` bauen, wenn nur ein Gebäude genannt ist.
- Für die Handlung bei Teilbereichen gilt dasselbe wie in V-9, Punkt 2: entweder dieselbe Formulierung wie am Mietvertrag, oder «Öffnen Sie den Mietvertrag, um zu sehen, welche Tage fehlen». Ein Unit-Test in `overview` für das Beispiel.

## V-12 (Minor): Schwache Prüfung «keine Abrechnung zum Erstellen»

**Beleg.** `contract-detail.steps.ts:250–256` prüft `missingStatementOffered("2024-10-01")`, also das testid `contract-missing-statement-link-2024-10-01` (`targets/contract-detail.ts:48–51`). Eine Umsetzung, die den Bereich unter dem Beginn der Periode führt und weiter `wizardLink(building, "2024-01-01", "2024-12-31")` anbietet, besteht den Schritt. Das ist genau der Fehler aus V-2: Der Lauf 2024 überspringt Anna, weil ihre Abrechnung die Periode schneidet. Er endet bei «Alle Mietverträge haben in dieser Periode schon eine Abrechnung …» (`messages/de.json:1271`).

**Korrektur.** Im selben Schritt auch `missingStatementOffered("2024-01-01")` mit `false` prüfen. Als Gegenprobe prüfen, dass der Knopf für 2025 (`2025-01-01`) da ist; dieser Bereich fehlt Anna in diesem Szenario ganz.

## V-13 (Nit): Doppelte Rechnungslinks

**Beleg.** Geplanter Text 2: ein Link pro Bereich. Eine Abrechnung vom 01.03. bis 30.06.2024 bei einem Vertragsbeginn 2023 lässt zwei Lücken in 2024: 01.01.–28.02. und 01.07.–31.12. Zweimal erscheint dann «Rechnungen 2024 ansehen» mit demselben Ziel.

**Korrektur.** Pro Jahr nur einen Link zeigen, oder den Link unter den Bereichen eines Jahres nur einmal setzen.

## V-14 (Nit): Ablauf

- #211 hat die Labels `entscheiden,produkt`, obwohl es einen Abschnitt «Decided (product owner)» hat. Nach CLAUDE.md, «Open work», gehört `entscheiden` dann weg. Das kann `check-issues` beim Pull Request stören.
- `src/lib/server/statement-generation.ts:52`: `TODO(fachlich prüfen, #199): … the dashboard counts only one inside the period`. Nach dieser Änderung ist das falsch. Den Marker anpassen; bleibt #199 wegen #281 offen, auf #281 zeigen lassen. Ein Pull Request mit `Fixes #199` darf keinen Marker auf #199 übrig lassen.

## M-2 (Minor, aus Runde 1): Perioden über 5 Jahre

**Beleg.** Grundlage von `dashboard.feature:13`: Anna mietet seit 01.01.2020 und hat keine Abrechnung. Am 17.10.2026 nennt die Aufgabe damit «Seeblick (2025, 2024, 2023, 2022, 2021, 2020)». `docs/nebenkostenabrechnung-anforderungen.md:78`: «Abrechnungen nicht für Perioden erstellen lassen, die über 5 Jahre zurückliegen (Warnung).» Art. 128 Ziff. 1 OR (Fedlex, Wortlaut aus Runde 1): «Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen; …». Wann die Frist beginnt, ist **unsicher** (Runde 1). In den offenen Issues gibt es keines zur Verjährung (Titel der offenen Issues durchgesehen).

**Korrektur.** Ein Issue `fachlich` nach Anforderung `:78` eröffnen; kein Blocker für diese Änderung.

## V-5 (Minor, aus Runde 1): Rechnungslink nach Rechnungsdatum

**Beleg.** `src/routes/invoices/+page.server.ts:18–21` filtert mit `year` das Rechnungsdatum, `:25–28` bietet nur sechs Jahre an. #211 (Decided): «invoice list filtered by building and period». Text 2 sagt «Rechnungen 2024 ansehen» und nicht «Rechnungen dieser Periode», die Beschriftung stimmt also. Bei einem Bereich über den Jahreswechsel filtert der Link nur noch nach Gebäude. Das weicht vom Entscheid ab, weil die Rechnungsliste keinen Periodenfilter hat. Für diesen Fall erlaubt CLAUDE.md, «Coding guidelines», nur das Kürzen auf den Ort, den die App hat, und verlangt eine Erwähnung im Pull Request. Es gibt kein offenes Issue für einen Periodenfilter nach Leistungszeitraum.

**Korrektur.** Die Abweichung im Pull Request und in #211 nennen. Ein Issue für einen Periodenfilter mit Leistungszeitraum eröffnen (Regel 1, `docs/nebenkostenabrechnung-anforderungen.md:141`).

## M-3 (Minor, aus Runde 1)

Unverändert: Der Satz in #199 «not for every period since the Vertragsbeginn» lässt sich gegen #211 lesen. Einen klärenden Satz in #199 ergänzen, zum Beispiel «gemeint: nur die ungedeckten Tage statt der ganzen Periode; welche Perioden, entscheidet #211». An den Szenarien ändert das nichts.

## V-7 (Minor, aus Runde 1, Begriffe)

**Beleg.** `UBIQUITOUS_LANGUAGE.md:46`: «Hinweis auf fehlende Abrechnungen | Warnung, die die beendeten Abrechnungsperioden nennt, in denen der Mietvertrag Mietstage, aber keine Abrechnung hat, seit Vertragsbeginn (seit «Abgerechnet bis»: geplant, #133).» `:47`: «Abgerechnet bis … | geplant (#133)». #133 ist auf main, und mit dieser Änderung nennt der Hinweis auch Teile von Perioden. #281 behandelt die Begriffe nur zusammen mit der kurzen Periode.

**Vorschläge** (für ein Issue `fachlich` + `entscheiden`, oder als Kommentar in #281 mit der Bitte, sie vorzuziehen):
- **Hinweis auf fehlende Abrechnungen:** «Warnung, die jeden zusammenhängenden Teil einer beendeten Abrechnungsperiode nennt, den keine Abrechnung des Mietvertrags abdeckt und in dem der Mietvertrag Mietstage hat: eine ganze Abrechnungsperiode mit ihrem Namen (z. B. 2023), sonst mit den Daten. Gezählt wird seit Vertragsbeginn, nach «Abgerechnet bis» erst ab dem Tag danach. Steht auf der Übersicht, in der Mietvertragsliste («Abrechnung fehlt») und am Mietvertrag.»
- **Abgerechnet bis:** Status «umgesetzt (#133)» statt «geplant».
- Bis zum Entscheid: `TODO(fachlich prüfen, #<issue>)` an den neuen Texten. Ausgenommen ist «Abrechnung fehlt»: #211 hat es entschieden.

---

## Bestätigt

**Regel (V-6), nachgerechnet.** P ist eine beendete Periode, U die ungedeckten zusammenhängenden Teile, gezeigt wird jeder Teil mit mindestens einem Mietstag.
1. Anna (`contract-detail.feature:254`), Vertragsbeginn 01.04.2024, Abrechnung 01.04.–30.09.2024:
   - P = 2024: U = 01.01.–31.03. und 01.10.–31.12. Der erste Teil hat keine Mietstage, also bleibt «01.10.2024 – 31.12.2024».
   - P = 2025: U = ganz, also «2025».

   Der erwartete Text stimmt.
2. Bruno (`dashboard.feature:152`), 01.01.–31.12.2023, Abrechnung 01.07.2022–30.06.2023:
   - P = 2023: U = 01.07.–31.12.2023, also gezeigt.
   - P = 2022: U = 01.01.–30.06.2022, ohne Mietstage, also nichts.
   - P = 2024/2025: keine Mietstage.

   Es stimmt.
3. Randfall null: Ist die Abrechnung gleich P, ist U leer, und nichts fehlt. Endet der Vertrag am 30.06.2024 bei einer Abrechnung 01.07.2023–30.06.2024, hat U 2024 keine Mietstage, und es fehlt nichts.
4. Randfall «Abgerechnet bis» mitten in der Periode: Vertrag ab 2023, «Abgerechnet bis» 30.06.2023, keine Abrechnung. 2023 hat Mietstage ab 01.07., also wird «2023» gezeigt, ungekürzt. Das ist richtig: Der Lauf über 2023 rechnet nach UL `:47` ab dem 01.07. ab, und die Lücke ist dieselbe Periode. Der neue Satz zum Teilbereich darf hier **nicht** kommen, denn der Bereich ist eine ganze Periode. Ein Unit-Test sollte das festhalten.
5. Randfall Mieterwechsel: Bruno bis 30.06.2024, Carla ab 01.07.2024, beide ohne Abrechnung. Jeder Vertrag nennt «2024», die Übersicht nennt das Gebäude einmal mit «2024», wenn nach V-11 zusammengefasst wird.
6. Randfall berichtigte Abrechnung: Die ersetzte zählt nicht, die berichtigte hat dieselbe Periode und deckt sie ab, also fehlt nichts. Das passt zu `+page.server.ts:107` (#120).
7. Rückerstattung: In diesen Szenarien gibt es keine Beträge, es ist nichts nachzurechnen.

**Szenarien nachgerechnet** (Stichtag 17.10.2026):
- «Erinnerung nennt eine ältere Periode ohne Abrechnung» (`dashboard.feature:142`): Ahornhof (2023), Seeblick (2025 … 2020).
- «Erinnerung übergeht ausserhalb von Dwello abgerechnete Perioden» (`:163`): «Abgerechnet bis» ist das Vertragsende 31.12.2023, danach gibt es keine Mietstage, also wird Ahornhof nicht genannt.
- «Erinnerung endet mit der Abrechnung jedes Mietvertrags der Periode» (`:131`): Bruno 01.04.2024–30.09.2025 mit den Abrechnungen 2024 und 2025, vollständig abgedeckt.
- «Erinnerung bleibt, bis jeder Mietvertrag der Periode abgerechnet ist» (`:172`): Bruno 2024 und 2025, Carla nur 2024, also fehlt Carla 2025. Eine Umsetzung «pro Gebäude» (in jeder Periode gibt es eine Abrechnung im Gebäude) liesse Ahornhof weg. Das Szenario fängt diesen Fehler also wieder (V-4 gelöst).
- Mietvertragsliste (`contracts.feature:64–79`): Anna ab 01.04.2024 ohne Abrechnung, es fehlen 2024 und 2025, also «Abrechnung fehlt». Ben 2024 mit der Abrechnung 2024: kein Hinweis. Anna mit «Abgerechnet bis» 31.12.2025: Die erste Periode mit Mietstagen ist 2026 und noch nicht beendet, also kein Hinweis.
- «Rechnungen der fehlenden Periode anzeigen» (`contract-detail.feature:264`): Anna fehlt 2024 ganz, nicht auf ihre Mietstage gekürzt, also «2024». Der Link geht auf Gebäude Ahornhof und Jahr 2024.

**Texte.**
- Text 4 «Abrechnung fehlt»: in #211 entschieden, passt zum Titel am Mietvertrag (`messages/de.json:1608`, «Abrechnung {period} fehlt»).
- Text 2 «Rechnungen 2024 ansehen» / «Rechnungen ansehen»: bestehende Labels (`messages/de.json:258–259`). Die Beschriftung verspricht nicht mehr, als der Filter kann.
- Text 3: Dass ganze Perioden mit dem Jahr und Teile mit Daten genannt werden und das Neuste zuerst steht, entspricht `periodOf` in `MissingStatement.svelte:12–17`. «dieser Periode» / «dieser Perioden» richtig in Einzahl und Mehrzahl. Dass der Satz «Die Abrechnungsperiode {start} – {end} ist abgelaufen» wegfällt, ist richtig, denn es sind jetzt mehrere Perioden.

**Recht.**
- Art. 4 Abs. 1 VMWG (Fedlex, SR 221.213.11, Fassung 01.10.2025): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Eine Erinnerung für jede beendete Periode seit Vertragsbeginn, ohne die ausserhalb abgerechneten, setzt diese Pflicht um.
- Die Überlappungsregel verhindert, dass dieselben Mietstage desselben Vertrags zweimal abgerechnet werden (Beispiele oben). Das Problem über mehrere Verträge (M-1) berührt diese Änderung nicht mehr.

## Nicht bestätigt

- **Art. 128 OR / Beginn der Verjährung** der Nebenkostenforderung: **unsicher** (Runde 1, `docs/nebenkostenabrechnung-anforderungen.md:160`). In dieser Runde nicht neu auf Fedlex gesucht.
- **Wortlaut Art. 4 Abs. 1 VMWG:** in dieser Runde über `mmx search` geprüft. Der Treffer kam von justement.ch (Fassung 01.10.2025), nicht direkt von Fedlex; der Wortlaut ist derselbe wie das Fedlex-Zitat aus Runde 1.
- **Ob eine Umsetzung den Teilbereich unter dem Beginn der Periode oder des Bereichs führt:** noch nicht umgesetzt. Darauf zielt V-12.
- **Bestehende Issues für V-5 und M-2:** Die Volltextsuche (`search/issues`) ist in dieser Sitzung gesperrt (HTTP 403). Durchgesehen habe ich die Titel aller offenen Issues (`repos/rudini/Dwello/issues?state=open`) und kein passendes gefunden.
- **Erinnerung erst 6 Monate nach Periodenende** (`docs/nebenkostenabrechnung-anforderungen.md:44`): unverändert, nicht Gegenstand dieser Änderung.
- **fr/it/en** der vier Texte: noch nicht vorhanden, nicht geprüft.
