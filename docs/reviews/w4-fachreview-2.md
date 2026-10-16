# Fachreview W4, Runde 2: Umsetzung #247, #230, #232

Geprüft: Worktree `review-w4-fach2`, Commit ae75ecc, `git diff 9583d04 ae75ecc`.
Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `docs/nebenkostenabrechnung-anforderungen.md` (Regel 5), Issue #232 («Decided (product owner)», C-5), Code im Worktree.
Fedlex-Zitate (OR Stand 1.1.2026, VMWG Stand 1.10.2025) sind aus Runde 1 (`docs/reviews/w4-fachreview-1.md`) übernommen; in dieser Runde nicht neu abgerufen.
Nachrechnung mit `scratchpad/w4calc/check.mjs` und `scratchpad/w4calc/sim.mjs` (Node). Die Skripte bilden `calculateHeatingShare` und `handleMidYearMoves` nach und vergleichen mit exakter Ganzzahlrechnung in Hundertsteln, kaufmännisch gerundet.
Simuliert: 6 Profile (4 vordefinierte, «Winter», «Halbwert»), 5 Perioden (2024, 2025, Jan–Jun 2024, Jul–Dez 2024, Okt 2024–Mär 2025), jeder Ein- und Auszugstag: 15'288 Fälle, 7'644 Mieterwechsel.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-5 | Mietrecht | Major | C-5: Bei einer Abrechnung vor #209 steht die Heizposition mit dem Prozentwert des Heizprofils im PDF. Die Erläuterung sagt aber nur «Zeitanteil: Ihre Mietstage»; der Satz «Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil» fällt neu weg. Das PDF widerspricht sich |
| M-6 | Mietrecht | Minor | Teilung und Monatswerte werden binär gerundet. Ein genauer Halbfall wird abgerundet: Das PDF druckt «54.12 % / 70.40 % = 76.87 %», richtig wäre 76.88 % |
| V-8 | Verwalter | Minor | `profiles_shares_keep`: «in dieser Abrechnungsperiode» hat auf der Seite des Heizprofils keinen Bezug. Der Fehler stammt aus meinem eigenen Vorschlag M-1 |
| M-7 | Mietrecht | Nit | Die Summe über zwei Mietverträge kann jetzt +0.02 % ergeben (vorher stimmten die Beträge auf den Rappen). Das folgt aus dem Entscheid zu #232 |
| M-8 | Mietrecht | Nit | Für M-2 (ganzes Jahr, Profil ≠ 100.00 %) fehlt ein Test auf unterer Ebene; der Code ist richtig |
| V-9 | Verwalter | Nit | Das Glossar nennt die Rundung beim «Anteil nach Heizprofil» noch «geplant, #232» |
| V-10 | Verwalter | Nit | Bestand schon: Bei einem Anteil von 100 % druckt das PDF keine Monate, auch bei einem Auszug während der Periode |

---

## M-5 (Major): Abrechnung vor #209, Heizposition ohne passende Erläuterung

**Beleg.**
- `statement-pdf.service.ts:131–140` (`heatingOf`): Ohne gespeicherten Anteil gibt es `{}` zurück, also kein `run.heating`.
- `statement-pdf.service.ts:121`: Daraus folgt `byProfile = false` für alle Positionen.
- `pdf.service.ts:483–484` (`timeShare`): `period_share` (z. B. 0.4) entspricht nicht Mietstage / Tage, deshalb druckt die Position «40.00 %».
- `pdf.service.ts:723`: Der Satz `sharesNoteHeating` («Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.») steht nur bei `byProfile`. Übrig bleibt `sharesNote` mit «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode.».
- `pdf.service.ts:542`: Darüber steht «Ihr Mietverhältnis in dieser Periode: 01.07.2025 – 31.12.2025 (184 Mietstage von 365 Tagen)».
- Der Test `statement-pdf.pg.test.ts` «nennt bei einer vor #209 erstellten Abrechnung kein Heizprofil» verlangt genau das: `"… 40.00 % 400.00"` und `not.toContain('Heizprofil')`. Damit schliesst er auch den allgemeinen Satz aus.

Auf der Basis 9583d04 rechnete `recomputedHeating` den Anteil neu, `run.heating` war gesetzt. Beide Erklärungen standen also im PDF.

**Warum falsch.**
- Der Mieter (Einzug 1.7.) liest: Zeitanteil = Mietstage = 184/365 = 50.41 %. Belastet werden ihm aber 40.00 %.
- Bei einem Einzug im Winter ist es umgekehrt: Der Prozentwert liegt über den Mietstagen, und der Mieter hält das für eine Überforderung.
- Die Erläuterung ist für diese Position sachlich falsch. Das ist kein bloss fehlender Hinweis.
- `getStatementPdf` (`statement-pdf.service.ts:290–297`) erstellt das PDF neu: bei einem Entwurf an jedem neuen Tag, nach dem Versenden und nach dem Bezahlen. Ein Entwurf von vor #209, der jetzt versendet wird, geht also mit diesem PDF an den Mieter.
- Art. 257b Abs. 1 OR: «… die tatsächlichen Aufwendungen des Vermieters …». Art. 8 Abs. 1 VMWG verlangt den Hinweis auf die detaillierte Abrechnung; er bleibt im PDF.
- Dass die Abrechnung den Anteil «nachvollziehbar» ausweisen muss, steht in den Anforderungen (Zeile 39, unsicher-B), nicht im Gesetzeswortlaut. Die Einstufung als Major stützt sich darauf, dass das PDF dem Mieter eine **falsche** Erklärung gibt (irreführend), nicht auf einen fehlenden Hinweis.

**Verhältnis zu C-5.** Der Product Owner hat entschieden: «statements created before #209 are not recalculated; the Heizprofil note appears only where a share is stored.» Mit «Heizprofil note» ist der Abschnitt «Heizkosten nach Heizprofil «…»: … %» gemeint (`heatingNote`/`heatingLines`). Den allgemeinen Satz in der Erläuterung der Anteile nennt der Entscheid nicht. Er nennt kein Profil, keine Monate, rechnet nichts neu und gibt nur wieder, was gespeichert ist (`period_share`). Das Problem ist deshalb **neu durch die Umsetzung entstanden** und keine Folge des Entscheids. Es betrifft nur Abrechnungen vor #209, dort aber jede Heizposition nach Heizprofil.

**Korrektur.**
- Ohne gespeicherten Anteil die Heizposition als `byProfile` markieren, wenn alles zutrifft:
  - `heatingProfileId` ist gesetzt,
  - es gibt Heizkosten,
  - der `period_share` der Heizposition weicht von `rentalDays / periodDays` ab. Das ist dieselbe Prüfung wie in `timeShare`, `pdf.service.ts:483`.
- Dann druckt die Position weiter den Prozentwert, und die Erläuterung erhält den bestehenden Satz `sharesNoteHeating`. Den Abschnitt «Heizkosten nach Heizprofil …» gibt es weiterhin nicht (C-5).
- Es ist kein neuer Text nötig.
- Den Test so ändern, dass er «Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil» erwartet und «Heizkosten nach Heizprofil» ausschliesst.
- Grenzfall: Bei einer Abrechnung vor #209, die nach Tagen geteilt hat (Sommerperiode mit Leistungszeitraum, #137), kann `period_share` auch von Mietstage / Tage abweichen. Dann stünde der Satz zu Unrecht da. Das ist selten und weniger schädlich als der heutige Widerspruch.
- Liest der Aufrufer C-5 so, dass auch dieser Satz entfällt: Entscheid des Product Owners, unter «Blocked on me».

## M-6 (Minor): Binäre Rundung trifft genaue Halbfälle

**Beleg.**
- `heating-profile.service.ts:367`: `Math.round((monthPct * daysInPeriod * 100) / daysInMonth) / 100`.
- `prorating.service.ts:190`: `Math.round((tenant.percentage / period.percentage) * 10000) / 100`.
- Beide rechnen mit Kommazahlen, deshalb kann ein genauer Halbfall knapp unter .5 landen.

**Nachgerechnet** (`check.mjs`, `sim.mjs`):
- **Teilung, Beispiel aus den Stammdaten.** «Heizung + Warmwasser», Periode 01.10.2024–31.03.2025, Einzug 20.11.2024.
  - Mieter: November 10.7 × 11/30 = 3.92, dazu 13.00 + 13.60 + 12.10 + 11.50, zusammen 54.12 %.
  - Periode: 9.5 + 10.7 + 13.0 + 13.6 + 12.1 + 11.5 = 70.40 %.
  - 54.12 / 70.40 = 0.76875, genau auf der Hälfte. JS ergibt 76.87, kaufmännisch richtig ist 76.88.
  - Das PDF druckt «Anteil nach Heizprofil: 54.12 % / 70.40 % = 76.87 %.» Wer nachrechnet, kommt auf 76.88 %. Bei CHF 1'000 sind das CHF 0.10 zu wenig.
  - Über alle 15'288 simulierten Fälle ist das der einzige Treffer.
  - Über alle Paare T ≤ P ≤ 100.10 % weicht die Teilung 1'921-mal ab.
- **Monatswerte.** Mit den vordefinierten Profilen und den Testprofilen gibt es 0 Abweichungen. Bei eigenen Heizprofilen sind es 3'963 von rund 4.1 Mio. Kombinationen aus Monatsanteil, Tagen und Monatslänge.
  - Beispiel: Februar 4.06 % × 1/28 = 0.145; JS ergibt 0.14, richtig ist 0.15.
- Den Halbfall aus V-6 (13.9 × 7/28 = 3.475 → 3.48) trifft JS zufällig richtig. Das Szenario «70.98 %» ist deshalb grün, beweist aber die Rundung nicht.

**Warum.** #232 soll erreichen, dass der Anteil aus den gedruckten Werten folgt. Mit dem Beispiel ist die gedruckte Teilung selbst falsch gerundet. Der Betrag ist um höchstens 0.01 % des Wohnungsanteils zu klein, also zum Nachteil des Vermieters. Für den Mieter ist das nicht schädlich, aber nicht nachrechenbar.

**Korrektur.** In ganzen Hundertsteln rechnen:
- Monat: `Math.round(Math.round(monthPct * 100) * days / daysInMonth) / 100`.
- Teilung: `Math.round(Math.round(t * 100) * 10000 / Math.round(p * 100)) / 100`.
- Ein Quotient aus ganzen Zahlen trifft den Halbfall in Gleitkomma exakt: Der Abstand zu .5 ist sonst mindestens 1/(2P), weit über der Rechengenauigkeit.
- Unit-Tests mit dem Beispiel oben (76.88) und mit Februar 4.06 × 1/28 (0.15) ergänzen.

## V-8 (Minor): «in dieser Abrechnungsperiode» ohne Bezug

**Beleg.** `messages/de.json` `profiles_shares_keep`: «… löschen Sie die Entwürfe aller Mietverträge der betroffenen Wohnungen in dieser Abrechnungsperiode …». Der Text steht auf der Bearbeitungsseite des Heizprofils (`HeatingProfileForm.svelte:411–416`). Dort gibt es keine Abrechnungsperiode, auf die «dieser» zeigen kann.

Der Wortlaut ist mein eigener Vorschlag aus Runde 1 (M-1). Der Fehler liegt bei mir, nicht bei der Umsetzung.

**Warum.** Ein Verwalter mit wenig Erfahrung fragt sich: «Welche Periode?» Ein Heizprofil kann in mehreren Perioden verwendet sein.

**Korrektur.** «in der betroffenen Abrechnungsperiode».
- fr: «dans la période de décompte concernée»
- it: «nel periodo di conteggio interessato»
- en: «in the billing period concerned»

Szenario `heating-profiles.feature` und DOM-Test entsprechend anpassen. Der Inhalt (Abrechnungen behalten ihre Anteile, Entwürfe löschen und neu erstellen, keine Sperre) bleibt wie im Entscheid zu #230.

## M-7 (Nit): Summe über einen Mieterwechsel bis +0.02 %

**Beleg** (`sim.mjs`). «Heizung + Warmwasser», Periode 01.10.2024–31.03.2025, Mieterwechsel am 22.02.2025:
- Februar 12.1 × 21/28 = 9.075 → 9.08 und 12.1 × 7/28 = 3.025 → 3.03. Zusammen 12.11 statt 12.10.
- Anteile: 55.88 / 70.40 = 79.375 → 79.38 % und 14.53 / 70.40 = 20.64 %. Zusammen 100.02 %.
- Bei CHF 1'000 sind das CHF 0.20 zu viel.
- Über 7'644 Wechsel: 7'628-mal genau 100.00, 15-mal +0.01, einmal +0.02, nie darunter.

**Warum nur Nit.** Vor #232 rechnete der Betrag mit dem ungerundeten Anteil, die Beträge beider Mieter ergaben die Kosten auf den Rappen genau. Jetzt folgt der Betrag aus dem gedruckten Prozentwert. Das hat der Product Owner in #232 so entschieden («the share and the amount follow from the printed values»). Die Abweichung ist geringfügig im Sinn von Art. 257b Abs. 1 OR («tatsächlichen Aufwendungen»). Sie ergänzt M-4 aus Runde 1: dort höchstens ±0.01, jetzt in Perioden unter einem Jahr bis +0.02.

**Korrektur.** Keine nötig. Zur Kenntnis in #256 (Rundung), falls dort die Rundung neu entschieden wird.

## M-8 (Nit): Test für M-2 fehlt

**Beleg.** `prorating.service.ts:188–190` teilt jetzt immer. `calculation.service.ts:48` speichert `periodMonths`, sobald `periodPercent !== 100`, auch bei einem ganzen Jahr. Das PDF druckt dann die Teilung (`pdf.service.ts:744–748`).

Nachgerechnet mit Profil «Winter», Dezember 26.1, zusammen 100.10 %, Periode 2024, Wechsel am 1.7.:
- 50.00 / 100.10 = 49.95 %.
- 50.10 / 100.10 = 50.05 %.
- Zusammen 100.00 %.

Der Code ist richtig. Der in Runde 1 vorgeschlagene Test auf unterer Ebene fehlt im Diff (`prorating.pg.test.ts` prüft nur Perioden unter einem Jahr).

**Korrektur.** Einen Test mit diesem Profil ergänzen: ganzes Jahr, Ergebnis 49.95 % und `periodPercentage` 100.1.

## V-9 (Nit): Glossar noch «geplant»

**Beleg.** `UBIQUITOUS_LANGUAGE.md:134`, «Anteil nach Heizprofil»: «Gerechnet aus diesen Monatswerten, auf zwei Stellen gerundet wie im PDF: geplant, #232.»

Die Umsetzung entspricht der Definition. «geplant» stimmt nach dem Merge nicht mehr. Das Glossar darf hier niemand ändern; der Product Owner streicht «geplant» nach dem Merge.

## V-10 (Nit, bestand schon)

**Beleg.** `pdf.service.ts:741`: Bei `percent >= 100` druckt das PDF nur «100.00 % der Heizkosten …», ohne Monate. Beispiel: Auszug am 10.06., Periode Januar–Juni, «Winter» (Juni 0 %). Der Mieter trägt 100 % der Heizkosten, obwohl er 21 Tage nicht gemietet hat. Die Monate mit «Jun 0.00 %» und die Teilung 50.00 / 50.00 würden das erklären.

Das bestand schon unter #229. Diese Änderung macht es nicht sichtbarer. Keine Massnahme in dieser Aufgabe.

---

## Bestätigt (mit Quelle)

**PDF `heatingLines`: welcher Satz bei welchem gespeicherten Anteil** (`pdf.service.ts:736–749`, `statement-pdf.service.ts:131–140`):

| Gespeichert | PDF |
|---|---|
| kein `heatingShare` (vor #209) | kein Heizprofil-Abschnitt (C-5); siehe M-5 |
| `byDays: true` (mit oder ohne Grund) | kein Heizprofil-Abschnitt (Regel 5; `anforderungen.md:145` «ohne Heizprofil-Hinweis») |
| `percent ≥ 100` | nur «… % der Heizkosten …» |
| ohne `periodPercent` (#209) | Monate des Mieters, ohne Summen |
| `periodPercent = 100` (ganzes Jahr, Profil 100.00) | Monate des Mieters; der Anteil ist ihre Summe, damit nachrechenbar |
| `periodPercent ≠ 100`, ohne `periodMonths` (#229) | alter Satz mit beiden Summen, ohne Teilung (Test `earlier`); richtig, weil der gespeicherte Anteil ungerundet gerechnet wurde |
| `periodPercent ≠ 100`, mit `periodMonths` (neu) | Monate des Mieters, Monate der Periode, beide Summen, Teilung mit dem Prozentwert der Position; auch bei einem ganzen Jahr mit Profil ≠ 100.00 (M-2 erledigt) |

**Weitere Prüfungen am PDF:**
- Die Summe des Mieters im PDF (`sum`) wird aus denselben gerundeten Monaten gebildet wie `totalPercentage`. Beides in Hundertsteln; 200'000 Zufallsfolgen ohne Abweichung.
- Der Prozentwert in der Teilung (`shown`) ist `period_share × 100` der Position. Bei neuen Abrechnungen ist er gleich `percent` (`calculation.service.ts:347, 368`: zwei Stellen, als `period_share` auf vier Stellen).

**PDF-Wortlaut de/fr/it/en (`heatingPeriodMonths`):**
- Glossarbegriffe «Anteil nach Heizprofil» und «Abrechnungsperiode».
- Nach `i18n-begriffe.md`: profil de chauffage / profilo di riscaldamento / heating profile (Z. 52) und période de décompte / periodo di conteggio / billing period (Z. 57).
- Satzbau gleich wie im bestehenden `heatingPeriodSums` (fr « ; » mit Leerzeichen wie dort). V-4 ist erledigt.

**UI-Texte:**
- `statements_profile_reason_no_heating_months`: Glossarwortlaut des Zeitanteils (`UBIQUITOUS_LANGUAGE.md:160`) und Regel 5; V-1 ist erledigt.
- `statements_profile_reason_whole_period`: Regel 5; fr «contrat de bail», it «contratto di locazione», en «rental contract» (`i18n-begriffe.md:25`).
- `statements_profile_not_applied` und `statements_profile_not_applied_unknown`: «non appliqué» bzw. «non applicato» passen grammatisch zu «profil» und «profilo» (männlich).
- `profiles_shares_keep`:
  - «Entwürfe», «Versendete»: brouillon/bozza/draft und envoyé/inviato/sent (Z. 65).
  - «erstellen Sie die Abrechnungen erneut»: «établissez» und «allestisca» wie «Établir les décomptes» und «Allestire i conteggi» (Z. 96).
  - Inhalt wie M-1, Ausnahme V-8.
- `src/lib/server/statement.ts:380–397`:
  - Grund, Name beim Erstellen, sonst aktueller Name.
  - Ohne Grund «(nicht angewendet)», wie in V-2 als vertretbar beurteilt.
  - Fehlt das Profil ganz (`handleMidYearMoves` ohne Profil), steht kein Name.

**Rechnung `calculateHeatingShare` / `handleMidYearMoves`:**
- Rosenhof: Einzug 5.1., Januar 18 × 27/31 = 15.68; 47.68 / 50.00 = 95.36 %, CHF 953.60 (Test `prorating.pg.test.ts`, Szenario).
- Eva Frei Januar–März: 43.00 / 50.00 = 86.00 %, CHF 860.00 bei CHF 1'000.
- Grenzfall null: Einzug 10.6., Periode Januar–Juni, «Winter»: 0.00 / 50.00 = 0.00 %, Betrag 0.00. Die Teilung wird gedruckt und ist richtig.
- Grenzfall ganzes Jahr, Profil 100.00: Teilung durch 100 = Summe des Mieters; das PDF druckt keine Teilung.
- Betrag = Wohnungsanteil × gerundeter Prozentwert (`calculation.service.ts:335–347`, `share = totalHeatingCosts × percentage / 100`). Damit ist #256 V-7 für neue Abrechnungen erledigt.
- Monatswerte mit vordefinierten Profilen: 0 Abweichungen von kaufmännischer Rundung (siehe M-6 zu eigenen Profilen und zur Teilung).

**C-5:** Ohne gespeicherten Anteil wird nichts neu gerechnet, und der Heizprofil-Abschnitt fehlt. Das entspricht dem Entscheid in #232. Die Folge für die Erläuterung steht unter M-5.

**Szenarien:** `@wip` entfernt; die Texte stimmen mit `messages/de.json` und `pdf.service.ts` überein. Der Kommentar zum Halbfall ist korrigiert (V-6 erledigt; siehe M-6 zur Robustheit).

## Fehlende Begriffe und Texte

Keine neuen. V-8 ändert einen bestehenden Text, im Rahmen des Entscheids zu #230: Vorschlag oben, kein Issue nötig, wenn der Aufrufer ihn übernimmt. Für V-9 kein Issue, der Product Owner streicht «geplant» nach dem Merge.

## Nicht bestätigt

- **«Anteil nach Heizprofil» in fr/it/en** («Part selon le profil de chauffage», «Quota secondo il profilo di riscaldamento», «Share by heating profile»): Der Begriff fehlt in `docs/design/i18n-begriffe.md`. Die Fassung folgt dem Muster von `heatingNote` («selon le profil», «secondo il profilo», «by heating profile»), ist aber nicht festgelegt. Gesucht in `i18n-begriffe.md` («Anteil nach», «Heizprofil»).
- **Echte PDF-Ausgabe für M-5:** Nicht erzeugt (keine Ausführung gegen die Datenbank). Hergeleitet aus `statement-pdf.service.ts:121, 131–140`, `pdf.service.ts:483–484, 542, 714–724` und dem Test «nennt bei einer vor #209 erstellten Abrechnung kein Heizprofil».
- **Wie viele Abrechnungen vor #209 bei Nutzern bestehen:** Nicht feststellbar. Die Demo-Daten (`backend/src/db/demo-data.ts`) erstellen ihre Abrechnungen mit der aktuellen Berechnung.
- **Zeitzone in `calculateHeatingShare`** (lokale `getMonth`/`setDate` mit UTC-Daten, `Math.ceil` über Tagesdifferenzen): Bestand schon, nicht Teil des Diffs, nicht geprüft.
- **Rundung je Monat als Fachpraxis:** wie in Runde 1 ohne Quelle (**unsicher**).
- **Fedlex-Wortlaut:** in dieser Runde nicht neu abgerufen, aus Runde 1 übernommen.
