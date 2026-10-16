# Fach-Review #241, Runde 1: Szenario und geplante Texte (vor der Umsetzung)

Geprüft: Worktree `review-241-fach`, Commit 16d6c2e9 (`tests/e2e/features/statement-detail.feature:258-277`), der heutige Stand von `backend/src/services/pdf.service.ts` (`sharesNote`, `partLines`, `timeShare`), `backend/src/services/calculation.service.ts`, `backend/src/services/invoice.service.ts` (`inPeriod`), dazu `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md` und `docs/nebenkostenabrechnung-anforderungen.md` (Regel 5). Geprüft wurden auch die Entscheide P-1 bis P-3 von #241, wie sie im Auftrag stehen, sowie die Entwürfe für fr, it und en.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Die Beschriftung «Leistungszeitraum» (P-2) erscheint auch vor Zeilen, die keinen Leistungszeitraum einer Rechnung zeigen: bei einer Rechnung ohne Leistungszeitraum (dann stehen die Daten der Abrechnungsperiode da) und bei einem Leistungszeitraum, der über die Periode hinausreicht (dann stehen gekürzte Daten und ein gekürzter Betrag da) |
| V-2 | Verwalter | Minor | Die Spalte Zeitanteil zeigt bei solchen Positionen weiter den gerundeten Prozentwert (34.06 %). Der neue Hinweis sagt «Ihr Anteil ist der Wohnungsanteil mal den Zeitanteil», der Satz «der Prozentwert ist gerundet» fällt weg. 900.00 × 34.06 % = 306.54, gedruckt ist 306.52: genau der Widerspruch, den P-3 vermeiden will |
| V-3 | Verwalter | Minor | Szenario «Eine Rechnung mit Leistungszeitraum steht im PDF mit ihren Tagen in der Periode» (`statement-detail.feature:218`) und die Backend-Tests erwarten noch den alten Hinweistext. Sie werden rot, wenn der Text geändert wird |
| V-4 | Verwalter | Minor | Regel 5 in `docs/nebenkostenabrechnung-anforderungen.md:145` zitiert noch das alte Format der Zeilen und der Berechnung |
| V-5 | Verwalter | Minor | Französisch: Die neuen Zeilen brauchen vor «:» ein U+00A0. `partLines` fügt heute fest `': '` ein, im Französischen fehlt dann das Leerzeichen ganz |
| V-6 | Verwalter | Minor | Entscheid P-1: «Hat eine Abrechnungsposition mehrere solche Rechnungen» passt nicht genau dazu, wann die App die Zeilen druckt |
| V-7 | Verwalter | Minor | Entscheid P-1: «Ihr Anteil ist der Wohnungsanteil mal **den** Zeitanteil» ist grammatisch falsch (richtig: «mal der Zeitanteil») |
| V-8 | Verwalter | Nit | Entscheid P-1: «Bei Heizkosten gilt der Anteil nach dem Heizprofil» steht direkt nach dem Satz zu «Ihr Anteil». Man kann ihn so lesen, als gelte für «Ihr Anteil» bei Heizkosten etwas anderes. Gemeint ist laut Glossar der Zeitanteil |
| V-9 | Verwalter | Nit | Entscheid P-1: Satz 2 nennt nur den Zähler (Ihre Mietstage im Leistungszeitraum), nicht den Nenner (die Tage des Leistungszeitraums in der Periode). Bei «31/62 Tage» lässt sich die 62 nur über den Satz zu «Kosten Liegenschaft» erschliessen |
| V-10 | Verwalter | Nit | Kleinigkeiten in den Entwürfen fr, it und en (Wortstellung bei «92 sur 92 jours» und «92 of 92 days», «cette période», «Pour le chauffage») |
| V-11 | Verwalter | Nit | «Leistungszeitraum» fehlt in der Tabelle von `docs/design/i18n-begriffe.md`, obwohl die App den Begriff in allen Sprachen verwendet |

Mietrecht: keine Befunde. Die geplanten Texte widersprechen keiner Norm. Belege siehe unten unter «Bestätigt».

---

## V-1 (Major): «Leistungszeitraum» vor Daten, die nicht der Leistungszeitraum der Rechnung sind

**Beleg.**
- `backend/src/services/invoice.service.ts:507-517` (`inPeriod`): Bei einer Rechnung ohne Leistungszeitraum gilt `return { start: periodStart, end: periodEnd, amount }`. Bei einer Rechnung mit Leistungszeitraum wird der Beginn auf die Periode gekürzt (`start = max(servicePeriodStart, periodStart)`, `end = min(…)`), der Betrag ebenso (`amount × Tage in der Periode / Tage des Leistungszeitraums`).
- `backend/src/services/calculation.service.ts:117-119`: Die Gruppe übernimmt `...invoice.inPeriod`. Laut `:153-161` (`daysOf`) entstehen `invoiceParts`, sobald die Rechnungen einer Gruppe nicht alle dieselben Tage haben, also auch bei einer Rechnung ohne Leistungszeitraum neben einer mit.
- `pdf.service.ts:643-645`: Jede Zeile druckt `part.start – part.end: part.amount`. Mit P-2 kommt davor «Leistungszeitraum».
- Glossar `UBIQUITOUS_LANGUAGE.md:63`: «**Leistungszeitraum**: Zeitraum, für den eine Rechnung gilt (Beginn und Ende oder keines von beiden).»
- Regel 5 (`docs/nebenkostenabrechnung-anforderungen.md:145`) beschreibt die Zeilen als «jede Rechnung mit ihren Tagen in der Periode, ihrem Betrag dafür». Die Zeilen zeigen also den Teil der Rechnung in der Periode, nicht ihren Leistungszeitraum.

**Nachgerechnet, zwei Fälle (Periode 2025, Einzug 15.08.2025):**
1. Hauswart A ohne Leistungszeitraum, CHF 600.00, Rechnungsdatum 05.03.2025. Hauswart B mit Leistungszeitraum 01.07.–30.09.2025, CHF 1'200.00. Das PDF würde drucken: «Leistungszeitraum 01.01.2025 – 31.12.2025: CHF 600.00, Ihre Mietstage 139 von 365 Tagen». Die Rechnung A hat aber keinen Leistungszeitraum. (139 = 17 + 30 + 31 + 30 + 31 Tage vom 15.08. bis 31.12.)
2. Hauswart C mit Leistungszeitraum 01.11.2025 – 31.01.2026 (92 Tage), CHF 1'200.00. In der Periode liegen 61 Tage, also 1'200 × 61/92 = CHF 795.65. Das PDF würde drucken: «Leistungszeitraum 01.11.2025 – 31.12.2025: CHF 795.65, Ihre Mietstage 61 von 61 Tagen». Auf dem Beleg stehen 01.11.2025 – 31.01.2026 und CHF 1'200.00.

**Warum falsch.** Der Mieter darf die Belege einsehen. Art. 257b Abs. 2 OR (Fedlex, SR 220, Stand 01.01.2026): «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» Bei dieser Einsicht findet er auf dem Beleg einen anderen oder gar keinen Leistungszeitraum und einen anderen Betrag, als das PDF unter dem Wort «Leistungszeitraum» nennt. Dass die Abrechnung deshalb rechtlich mangelhaft wäre, ist **unsicher**: Fedlex enthält keinen Wortlaut zur Nachvollziehbarkeit, die Anforderung stützt sich auf die Praxis (Thema 2, unsicher-B). Für einen Verwalter ist es jedoch klar eine falsche Angabe in der Abrechnung, und sie entsteht erst durch die neue Beschriftung. Das alte Format druckte keine Beschriftung.

**Was es behebt.** Das Beispiel in P-2 deckt diese beiden Fälle nicht ab. Sie brauchen einen Entscheid des Product Owners (Issue mit den Labels `fachlich` und `entscheiden`). Vorschlag:
- Rechnung ohne Leistungszeitraum: «Ohne Leistungszeitraum: CHF 600.00, Ihre Mietstage 139 von 365 Tagen der Abrechnungsperiode».
- Gekürzter Leistungszeitraum: «Leistungszeitraum 01.11.2025 – 31.01.2026, davon in der Abrechnungsperiode 01.11.2025 – 31.12.2025: CHF 795.65, Ihre Mietstage 61 von 61 Tagen». Dafür braucht `InvoicePart` den ursprünglichen Leistungszeitraum.

Hinweis: Die Fälle sind mit E2E-Schritten erreichbar (Rechnung mit oder ohne «für die Zeit vom … bis …»). Ein Render-Test pro Fall genügt. Wenn #236 oder #239 genau diese Fälle schon behandeln (siehe «Nicht bestätigt»), gehört der Befund dorthin. Dann darf #241 die Beschriftung aber erst einführen, wenn diese Fälle geklärt sind, oder es muss die Beschriftung auf Zeilen mit einem ungekürzten Leistungszeitraum beschränken.

## V-2 (Minor): Gerundeter Prozentwert in der Spalte, Satz «mal den Zeitanteil» ohne Rundungshinweis

**Beleg.** `pdf.service.ts:449`: `if (item.invoiceParts) return formatShare(item.periodShare)` druckt in der Spalte «Zeitanteil» 34.06 %. Den heutigen Hinweis «der Prozentwert ist gerundet» (`:91`) enthält der entschiedene Text P-1 nicht mehr.

**Nachgerechnet.** (600 × 0/91 + 1'200 × 47/92) / 1'800 = 0.340580. Damit ergibt 900.00 × 0.340580 = 306.52 (gedruckt in «Ihr Anteil»). Die Spalte gibt 900.00 × 34.06 % = 306.54. Die Abweichung beträgt 2 Rappen. Im Beispiel von P-3 ist der Wert genau 50.00 %, dort weicht nichts ab.

**Warum falsch.** Nach P-3 soll gerade kein gerundeter Prozentwert mit einem Betrag multipliziert werden. Die Spalte verlangt aber genau das: Sie steht in derselben Zeile wie der Wohnungsanteil, und der neue Satz «Ihr Anteil ist der Wohnungsanteil mal den Zeitanteil» lädt dazu ein, die beiden zu multiplizieren.

**Was es behebt.** Der Product Owner muss entscheiden, was die Spalte bei diesen Positionen zeigt (Labels `fachlich`, `entscheiden`). Vorschläge: «siehe unten» statt des Prozentwerts, oder der Prozentwert bleibt und der Satz zu den mehreren Rechnungen erhält den Zusatz «der Prozentwert in der Tabelle ist gerundet».

## V-3 (Minor): Weitere Tests erwarten den alten Text

**Beleg.**
- `tests/e2e/features/statement-detail.feature:218`: `Und steht im PDF "Ihre Mietstage darin von dessen Tagen in der Periode"`. Das ist der Text von `sharesNoteDays`, den P-1 ersetzt.
- `backend/src/__tests__/statement-pdf.pg.test.ts:198, 216` und `backend/src/__tests__/statement-pdf-render.test.ts:257, 263` prüfen ebenfalls die alten Texte.

**Was es behebt.** Zeile 218 erwartet neu «Bei einer Rechnung mit Leistungszeitraum zählen Ihre Mietstage in diesem Zeitraum.» Diese Szenario-Änderung gehört in denselben `@wip`-Schritt und wird erst rot gezeigt. Die Backend-Tests werden mit dem Plan nachgeführt. Für das Szenario von Zeile 218 sollte ausserdem eine Zeile prüfen, dass der Satz «Hat eine Abrechnungsposition mehrere solche Rechnungen …» fehlt, wenn keine Position solche Zeilen hat. Die Bedingung bleibt ja bestehen.

## V-4 (Minor): Regel 5 zitiert das alte Format

**Beleg.** `docs/nebenkostenabrechnung-anforderungen.md:145` nennt als Beispiele «(«01.07.2025 – 30.09.2025: 1'200.00, 47/92 Tage»)» und «(«(600.00 × 0/91 + 1'200.00 × 47/92) / 1'800.00 = 34.06 %»)».

**Was es behebt.** Die Beispiele werden im selben Änderungssatz auf die neuen Zeilen umgestellt («Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 1'200.00, Ihre Mietstage 47 von 92 Tagen», «Ihr Anteil: 900.00 × (…) / 1'800.00 = 306.52»). Sonst widerspricht die Anforderung dem PDF.

## V-5 (Minor): Französische Typografie der neuen Zeilen

**Beleg.**
- `pdf.service.ts:644` fügt fest `${…}: ${…}` ein. Die Übersetzungen haben dafür einen eigenen Schlüssel `colon` (fr `' : '`, `:118`), aber mit einem gewöhnlichen Leerzeichen.
- `messages/fr.json` setzt 87-mal U+00A0 vor «:». Im PDF kommt das kein einziges Mal vor.
- `docs/design/offene-punkte.md:43` (U-37) sagt: «French PDF texts lack the non-breaking space before «;» and «:»».

**Was es behebt.**
- Neue und geänderte französische Texte erhalten U+00A0 vor «:»: «Part temporelle : …», «Période de prestation 01.07.2025 – 30.09.2025 : CHF 765.00, …» und «Votre part : 784.13 × …».
- Die Zeilen holen den Doppelpunkt aus der Übersetzung, nicht aus dem Code.
- Helvetica kann U+00A0 drucken (`printable`, `pdf.service.ts:410`).
- Die übrigen französischen PDF-Texte gehören weiter zu U-37 und U-26.

## V-6 (Minor): «mehrere solche Rechnungen» passt nicht genau zur Regel

**Beleg.** `calculation.service.ts:153-161`: Zeilen gibt es, wenn die Rechnungen einer Position verschiedene Tage abrechnen. Bei zwei Rechnungen mit demselben Leistungszeitraum gibt es keine Zeilen. Dagegen gibt es Zeilen bei einer Rechnung mit Leistungszeitraum neben einer ohne (V-1, Fall 1). Dort hat die Position nur eine «solche» Rechnung.

**Warum.** Der Satz «Hat eine Abrechnungsposition mehrere solche Rechnungen, steht die Berechnung darunter» kündigt in beiden Fällen etwas anderes an, als das PDF zeigt. Das ist ein Detail im entschiedenen Text und kein Fehler der Umsetzung.

**Was es behebt.** Den Product Owner fragen, zusammen mit V-1. Vorschlag: «Hat eine Abrechnungsposition Rechnungen über verschiedene Tage, steht die Berechnung darunter.»

## V-7 (Minor): «mal den Zeitanteil»

**Beleg.** In P-1 und im Szenario `statement-detail.feature:277` steht: «Ihr Anteil ist der Wohnungsanteil mal den Zeitanteil.»

**Warum.** «mal» regiert keinen Kasus. Beide Glieder stehen im gleichen Fall wie das Subjekt («Die Fläche ist die Länge mal die Breite»). Richtig ist deshalb «Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil» oder «… der Wohnungsanteil multipliziert mit dem Zeitanteil». Die Entwürfe fr, it und en sind korrekt («multipliée par», «moltiplicata per», «times»).

**Was es behebt.** Der Text ist entschieden. Deshalb nicht selbst korrigieren, sondern den Product Owner fragen (Kommentar in #241 oder ein `entscheiden`-Issue).

## V-8 (Nit): Bezug des Heizkosten-Satzes

**Beleg.**
- In P-1 steht der Satz «Bei Heizkosten gilt der Anteil nach dem Heizprofil.» nach «Ihr Anteil ist …».
- Das Glossar (`UBIQUITOUS_LANGUAGE.md:155`, Zeitanteil) sagt: «Heizkosten mit Heizprofil im Abrechnungslauf: der Anteil nach dem Heizprofil. Mieteranteil = Wohnungsanteil × Zeitanteil».
- Der Code macht es so: Die Spalte Zeitanteil zeigt den Prozentwert des Heizprofils (`pdf.service.ts:446-451`, `calculation.service.ts:343-344`).

**Warum.** Gemeint ist der Zeitanteil. Wer den Satz direkt nach «Ihr Anteil» liest, kann ihn auf «Ihr Anteil» beziehen. Die Rechnung selbst stimmt.

**Was es behebt.** Vorschlag an den Product Owner: «Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.» Andernfalls bleibt der Text, wie er entschieden ist.

## V-9 (Nit): Satz 2 ohne Nenner

**Beleg.**
- In P-1 heisst es: «Bei einer Rechnung mit Leistungszeitraum zählen Ihre Mietstage in diesem Zeitraum.»
- Der Nenner ist laut Regel 5 «Tage des Leistungszeitraums in der Periode».
- Das Szenario `statement-detail.feature:205-218` druckt «31/62 Tage» bei einem Leistungszeitraum 01.07.–30.09. in einer Periode 01.06.–31.08.

**Warum.** Die 62 lässt sich nur über den ersten Satz erschliessen («eine Rechnung mit Leistungszeitraum zählt mit den Tagen, die in die Periode fallen»). Der Text ist entschieden, deshalb nur ein Hinweis für den Product Owner. Bei den Zeilen unter der Position nennt P-2 den Nenner ausdrücklich («von 92 Tagen»).

## V-10 (Nit): Entwürfe fr, it, en

Die Begriffe stimmen mit `docs/design/i18n-begriffe.md` überein:
- part temporelle, quota temporale, time share
- jours de location, giorni di locazione, days rented
- période de décompte, periodo di conteggio, billing period
- poste du décompte, voce del conteggio, statement line
- part du logement, quota appartamento, apartment share
- profil de chauffage, profilo di riscaldamento, heating profile
- Votre part, La sua quota, Your share (wie `yourShare`)
- période de prestation, periodo di prestazione, service period (wie `messages/*.json:720`)

Höflichkeitsform: vous und Lei, «i suoi» klein wie im übrigen PDF.

Kleinigkeiten:
- fr «vos jours de location 92 sur 92 jours» liest sich holprig. Das übrige PDF schreibt «({days} jours sur {total})» (`:149`). Vorschlag: «… : CHF 765.00, 92 de vos jours de location sur 92 jours» oder näher am Deutschen «vos jours de location : 92 sur 92». Am besten gleich gebaut wie it «i suoi giorni di locazione 92 su 92», das ohne das Schluss-«giorni» auskommt.
- en «your days rented 92 of 92 days»: Vorschlag «your days rented: 92 of 92 days» würde einen zweiten Doppelpunkt bringen. Es reicht, die Form an die deutsche anzugleichen und für alle drei Sprachen einheitlich zu entscheiden.
- fr «dans cette période»: eindeutiger ist «dans cette période de prestation», weil im Satz davor die «période de décompte» steht.
- fr «Pour le chauffage» und it «Per il riscaldamento»: Das PDF sagt sonst «frais de chauffage» und «spese di riscaldamento» (`:138`, `:208`). Vorschlag: «Pour les frais de chauffage …» und «Per le spese di riscaldamento …».

## V-11 (Nit): «Leistungszeitraum» fehlt in i18n-begriffe.md

**Beleg.** `docs/design/i18n-begriffe.md` hat keine Zeile für den Begriff. `messages/fr.json:720` («Période de prestation») und `messages/en.json:720` («Service period») verwenden ihn bereits.

**Vorschlag für eine Zeile:** `| Leistungszeitraum | période de prestation | periodo di prestazione | service period |`. Das ist eine Dokumentänderung, kein neuer Begriff. Das Glossar enthält «Leistungszeitraum».

---

## Bestätigt

- **Arithmetik des Szenarios** (mit bun nachgerechnet):
  - Tage: 01.04.–30.06.2025 = 30 + 31 + 30 = 91. 01.07.–30.09.2025 = 31 + 31 + 30 = 92. Mietstage ab 15.08. darin: 17 + 30 = 47. Im April bis Juni: 0.
  - Kosten Liegenschaft: 600 + 1'200 = 1'800.00.
  - Ihr Anteil: 900.00 × (0 + 613.0435) / 1'800.00 = 306.5217, gedruckt 306.52.
  - Mittelwert der Brüche (0 + 47/92) / 2 = 25.54 %, wie im Kommentar.
  - P-3: 900.00 × 34.06 % = 306.54, wie im Issue.
  - Randfall Gutschrift (eigenes Beispiel: CHF 1'200.00 für 01.04.–30.06., Gutschrift CHF -300.00 für 01.07.–30.09., Wohnungsanteil 450.00): 450.00 × (1'200.00 × 0/91 + -300.00 × 47/92) / 900.00 = -76.63. Die Formel geht auf. Sie druckt dann allerdings «+ -300.00» (Nit, nicht Teil von #241; der Gutschrift-Fall liegt in #237).
  - Randfall Summe null: Laut Regel 5 und `calculation.service.ts:154` gibt es keine Zeilen.
- **Ihr Anteil = Wohnungsanteil × Zeitanteil**:
  - Glossar `UBIQUITOUS_LANGUAGE.md:155` («Mieteranteil = Wohnungsanteil × Zeitanteil (im PDF: «Ihr Anteil»)»).
  - Anforderung Thema 6 (`docs/nebenkostenabrechnung-anforderungen.md:94`, «Ihr Anteil = gerundeter Wohnungsanteil × Zeitanteil»).
  - Code: `calculation.service.ts:353`, `tenantShare = roundToRappen(apartmentShare × periodShare)` mit dem auf Rappen gerundeten Wohnungsanteil. Die gedruckte Formel mit «900.00» ergibt also genau den gedruckten Betrag, und die Beträge der Zeilen ergeben zusammen genau die Kosten Liegenschaft (`:118`).
  - Der Satz passt zur Formel mit «/ 1'800.00» (Kosten Liegenschaft): Der Klammerausdruck geteilt durch die Kosten Liegenschaft ist der Zeitanteil.
- **Heizkosten-Satz nur bei Positionen nach Heizprofil** (`sharesNote`, `:676`, `byProfile`). Das passt zu Regel 5: nach Heizprofil nur bei Ein- oder Auszug, sonst nach Tagen ohne Heizprofil-Hinweis.
- **Begriffe**: Leistungszeitraum (`:63`), Mietstage (`:157`), Abrechnungsperiode (`:147`), Abrechnungsposition (`:148`), Wohnungsanteil (`:123`), Zeitanteil (`:155`), Heizprofil (`:131`) stehen im Glossar. «Ihr Anteil» ist laut Glossar die Beschriftung im PDF. Die Übersetzungen stehen in `i18n-begriffe.md`.
- **Mietrecht.**
  - Art. 4 Abs. 1 VMWG (Fedlex, SR 221.213.11, Stand 01.10.2025): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»
  - Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …»
  - Der neue Text ändert keinen Betrag. Er erklärt die Aufteilung nach Tagen, die Regel 5 und Thema 1 festlegen (Periodengerechtigkeit, unsicher-B in der Anforderung). Kein Widerspruch zum Gesetz.

## Fehlende Begriffe

Kein neuer Begriff nötig. Für V-1 braucht es eine Formulierung für «Leistungszeitraum, davon in der Abrechnungsperiode» und für «ohne Leistungszeitraum». Vorschläge stehen bei V-1, zu entscheiden in einem Issue mit den Labels `fachlich` und `entscheiden`. Der Vermerk `TODO(fachlich prüfen, #75)` in `pdf.service.ts:32` sagt, «Zeitanteil» stehe nicht im Glossar. Das Glossar führt ihn inzwischen (`:155`). Das ist ein Nit, bestand schon vorher und gehört zu #75.

## Nicht bestätigt

- **Issues #236 und #239** («the same invoice lines, next», laut `implementation_plan.md:8`): Ihr Text liegt nicht im Worktree. Ich konnte nicht prüfen, ob sie die Fälle von V-1 (keine oder gekürzte Leistungszeiträume) bereits behandeln.
- **Rechtliche Pflicht zur Nachvollziehbarkeit** (V-1, V-2): Fedlex enthält dazu keinen Wortlaut. Ich habe Art. 257a und 257b OR sowie Art. 4–8 VMWG gelesen (Dateien in `scratchpad/fedlex/`). Nur Art. 257b Abs. 2 OR (Belegeinsicht) betrifft die Frage. Deshalb **unsicher**.
- **Textsuche im E2E-Schritt:** Ich habe nicht geprüft, ob «steht im PDF» einen Text findet, den das PDF über mehrere Zeilen umbricht (der lange Hinweistext in `:277`). Das gehört zur Technik, nicht zu dieser Prüfung.
- **Exakte Entscheidtexte von #241:** Ich habe sie nur aus dem Auftrag übernommen. Das Issue selbst liegt nicht im Worktree.
