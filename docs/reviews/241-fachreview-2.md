# Fach-Review #241, Runde 2: PDF-Texte nach der Umsetzung

Geprüft: Worktree `review-241-fach2`, Commit 3ae2b1d6, Diff `88583151..3ae2b1d6`. Gelesen: `backend/src/services/pdf.service.ts` (`sharesNote`, `partLines`, `partText`, `partValues`, `timeShare`, die Texte partLine, partNoPeriod, partBeyond, partShare und sharesNote* in de/fr/it/en), `invoice.service.ts` (`inPeriod`), `calculation.service.ts` (`rentalShare`, `daysOf`, Heizprofil-Zweig), `prorating.service.ts` (`handleMidYearMoves`), `heating-profile.service.ts` (`calculateHeatingShare`), Regel 5 in `docs/nebenkostenabrechnung-anforderungen.md`, `docs/design/i18n-begriffe.md`, `docs/data-model.md`, die Tests `statement-pdf-render.test.ts`, `statement-pdf.pg.test.ts` und `tests/e2e/features/statement-detail.feature`. Grundlage sind die Befunde aus Runde 1 (`docs/reviews/241-fachreview-1.md`) und die Entscheide des Product Owners, wie sie im Auftrag stehen.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Neu steht in jeder Abrechnung «Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil.». Bei einer Position nach Heizprofil ist der gedruckte Zeitanteil aber gerundet, und der Rundungshinweis erscheint nur bei Positionen mit Rechnungszeilen. Beispiel: 2'400.00 × 38.87 % = 932.88, gedruckt sind 932.98 |
| V-2 | Verwalter | Nit | Die Testdaten «special» im Render-Test rechnen nicht auf: tenantShare 418.70 und periodShare 0.6. Richtig wären 512.08 und 73.38 %. Das PDF dieses Tests druckt also eine falsche Gleichung |
| V-3 | Verwalter | Nit | Kein Test prüft, dass «Hat eine Abrechnungsposition …» und «Der Prozentwert ist gerundet; …» fehlen, wenn keine Position Rechnungszeilen hat. Diesen Rest von Runde 1, V-3, hat die Umsetzung nicht übernommen |
| V-4 | Verwalter | Nit | Französisch: Vor «:» und «;» steht in den neuen Zeilen und Sätzen ein gewöhnliches Leerzeichen (`colon: ' : '`). Das passt zum übrigen PDF und ist bereits als U-37 erfasst. Damit ist V-5 aus Runde 1 nur teilweise behoben |
| V-5 | Verwalter | Nit | Teil P-2 der Zeile U-37 in `docs/design/offene-punkte.md` («names only the numerator and not that «Ihr Anteil» = «Wohnungsanteil» × «Zeitanteil»») ist mit #241 erledigt, die Zeile ist aber nicht nachgeführt |

Mietrecht: keine Befunde. Rechtstexte: nicht betroffen.

---

## V-1 (Minor): «Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil» bei Heizkosten nach Heizprofil ohne Rundungshinweis

**Beleg.**
- `pdf.service.ts:64` (de) `sharesNote`: «… Zeitanteil: Ihre Mietstage in der Abrechnungsperiode.{days}{parts} Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil.{rounded}{heating}». Der Satz steht jetzt in jeder Abrechnung. Vorher stand er nur im Teilsatz zu den Rechnungen über verschiedene Tage, zusammen mit «der Prozentwert ist gerundet» (Basis `pdf.service.ts:91`).
- `pdf.service.ts:707`: `rounded: parts ? t.sharesNoteRounded : ''`. Den Rundungshinweis gibt es nur, wenn eine Position `invoiceParts` hat.
- `calculation.service.ts:344-346`: Bei Heizkosten nach Heizprofil gilt `tenantShare = roundToRappen(heatingResult.share)` und `periodShare = heatingResult.percentage / 100`. `prorating.service.ts:215-217`: `share = totalHeatingCosts * (percentage / 100)` mit dem ungerundeten Prozentwert. `heating-profile.service.ts:366`: Die Monatsanteile werden nach Tagen gekürzt (`monthPct * daysInPeriod / daysInMonth`), deshalb ist der Prozentwert bei einem Ein- oder Auszug im Monat fast nie glatt.
- `pdf.service.ts:424, 467-471`: Die Spalte «Zeitanteil» druckt `formatShare(periodShare)` mit zwei Nachkommastellen.

**Nachgerechnet** (vordefiniertes Profil «Heizung + Warmwasser», `backend/migrations/0002_stammdaten.sql:64-66`, Periode 2025, Einzug 15.08.2025):
- Zeitanteil = 3.60 × 17/31 + 3.70 + 9.50 + 10.70 + 13.00 = 38.874194 %, gedruckt 38.87 %.
- Wohnungsanteil 2'400.00: Ihr Anteil = 2'400.00 × 0.38874194 = 932.98 (gedruckt). Mit dem gedruckten Zeitanteil: 2'400.00 × 38.87 % = 932.88. Die Differenz beträgt 10 Rappen.
- Wohnungsanteil 900.00: 349.87 gedruckt, 900.00 × 38.87 % = 349.83, also 4 Rappen Differenz.
- Randfall Mietvertrag über die ganze Periode: Hier wird nicht nach dem Heizprofil gerechnet (`prorating.service.ts:208-209`), sondern nach Tagen («365/365 Tage»). Der Satz stimmt dann genau.

**Warum falsch.** P-3 von #241 will gerade verhindern, dass der Mieter einen gerundeten Prozentwert mit dem Wohnungsanteil multipliziert und ein anderes Ergebnis erhält. Bei Positionen mit Rechnungszeilen löst der Satz «Der Prozentwert ist gerundet; Ihr Anteil folgt aus der Berechnung unter der Position.» das Problem. Bei Heizkosten nach Heizprofil fordert die Erläuterung neu ausdrücklich zur Multiplikation auf, sagt aber nichts über die Rundung. Das trifft jede Abrechnung mit Mieterwechsel und Heizprofil, also den häufigsten Fall des Heizprofils (Regel 5). Das Ergebnis ist eine Abrechnung, deren eigene Erklärung nicht aufgeht. Der Betrag selbst ist richtig: Glossar `UBIQUITOUS_LANGUAGE.md:155` («Mieteranteil = Wohnungsanteil × Zeitanteil») mit dem ungerundeten Anteil.

**Was es behebt.** Der Wortlaut ist entschieden. Deshalb braucht es den Product Owner (Kommentar in #241 oder ein Issue mit den Labels `fachlich`, `entscheiden`). Vorschläge:
- Den Rundungshinweis auch dann drucken, wenn eine Position nach Heizprofil geteilt ist, mit einem eigenen kurzen Satz, zum Beispiel «Der Prozentwert ist gerundet.» (fr «Le pourcentage est arrondi.», it «La percentuale è arrotondata.», en «The percentage is rounded.»).
- Oder den Satz «Ihr Anteil ist …» nur zusammen mit dem Rundungshinweis drucken.

Den Betrag aus dem gerundeten Prozentwert zu rechnen, wäre eine Änderung der Beträge und gehört nicht zu #241. Ein Render-Test mit `byProfile`, `periodShare: 0.3887`, `apartmentShare: 2400` und `tenantShare: 932.98` zeigt den Fall.

## V-2 (Nit): Testdaten «special» rechnen nicht auf

**Beleg.** `backend/src/__tests__/statement-pdf-render.test.ts:55`: `totalAmount: 1395.65, apartmentShare: 697.83, periodShare: 0.6, … tenantShare: 418.70` mit den Zeilen `600 × 139/365` und `795.65 × 61/61`.

**Nachgerechnet.**
- 600.00 × 139/365 + 795.65 × 61/61 = 228.49 + 795.65 = 1'024.14.
- 697.83 × 1'024.14 / 1'395.65 = 512.08.
- Zeitanteil = 1'024.14 / 1'395.65 = 73.38 %.

Das PDF dieses Tests druckt also «Ihr Anteil: 697.83 × (…) / 1'395.65 = 418.70» und den Zeitanteil 60.00 %. Der Test prüft diese Zeile nicht und bleibt deshalb grün. Wer die Testdaten aber als Beispiel übernimmt, übernimmt eine falsche Rechnung.

**Was es behebt.** In den Testdaten `tenantShare: 512.08` und `periodShare: 0.7338` setzen und die Zeile «Ihr Anteil: 697.83 × (600.00 × 139/365 + 795.65 × 61/61) / 1'395.65 = 512.08» mitprüfen.

## V-3 (Nit): Bedingte Sätze ohne Gegenprobe

**Beleg.**
- `pdf.service.ts:706-707`: Die Sätze `sharesNoteParts` und `sharesNoteRounded` erscheinen nur, wenn `parts` gilt.
- Das Szenario «Eine Rechnung mit Leistungszeitraum steht im PDF mit ihren Tagen in der Periode» (`statement-detail.feature:205-218`) hat eine einzige Rechnung 01.07.–30.09.2025 in der Periode 01.06.–31.08.2025, also keine Rechnungszeilen. Es prüft nur, dass «Bei einer Rechnung mit Leistungszeitraum …» erscheint.
- Weder die pg-Tests noch die Render-Tests prüfen, dass die beiden Sätze fehlen.

**Warum.** Bei einer Position ohne Zeilen wäre der Satz «Ihr Anteil folgt aus der Berechnung unter der Position» falsch, weil dort keine Berechnung steht. Die Bedingung ist heute richtig, aber kein Test schützt sie.

**Was es behebt.** Eine Zeile im Szenario `Und steht im PDF nicht "Der Prozentwert ist gerundet"` oder ein `not.toContain` im pg-Test «erklärt den Bruch einer Rechnung mit Leistungszeitraum» (`statement-pdf.pg.test.ts:197`).

## V-4 (Nit): Französische Typografie

**Beleg.**
- `pdf.service.ts:123`: `colon: ' : '` mit U+0020. Die neuen Texte `partLine`, `partNoPeriod`, `partBeyond` und `partShare` übernehmen diesen Doppelpunkt (`pdf.service.ts:663, 665`). Das ist richtig: Der Doppelpunkt kommt jetzt aus der Übersetzung und nicht mehr aus dem Code.
- `sharesNoteRounded` fr: «Le pourcentage est arrondi ; …», ebenfalls mit U+0020.
- `pdf.service.ts:40` (`heatingPeriodSums`) druckt bereits ` %`. Helvetica kann U+00A0 also drucken.
- `docs/design/offene-punkte.md:43` (U-37): «French PDF texts lack the non-breaking space before «;» and «:»».

**Bewertung.** Die neuen Texte folgen der Konvention des übrigen PDF. Das bekannte Problem U-37 wird nicht schlimmer, als es schon ist. Ich habe den Zeilenumbruch mit den Helvetica-Breiten bei 7.5 pt und 408 pt Breite (`PARTS_WIDTH`) nachgerechnet. Bei den Testwerten bricht keine der neuen Zeilen vor dem « : » um. Die lange Zeile `partBeyond` bricht nach «CHF 795.65, vos» um. Mit anderen Beträgen könnte der Doppelpunkt aber an den Anfang einer Zeile rutschen.

**Was es behebt.** Mit U-37 und U-26 zusammen erledigen: fr `colon: ' : '` und U+00A0 vor «;» in allen französischen PDF-Texten. Ein eigenes Issue ist nicht nötig. Es reicht ein Hinweis in U-37, dass auch die Texte von #241 betroffen sind.

## V-5 (Nit): U-37 nicht nachgeführt

**Beleg.** `docs/design/offene-punkte.md:43`, Teil P-2. Neu steht in `sharesNote` (alle vier Sprachen) «Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil.». Teil P-1 von U-37 (der Heizkosten-Satz verweist nicht auf den Abschnitt «Heiz- und Warmwasserkosten») bleibt offen. Der neue Satz «Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.» verweist ebenfalls nicht auf den Abschnitt.

**Was es behebt.** In U-37 den Teil P-2 als mit #241 erledigt streichen.

---

## Befunde aus Runde 1: Stand

| Runde 1 | Stand | Beleg |
|---|---|---|
| V-1 | behoben | `partNoPeriod` und `partBeyond` (de `pdf.service.ts:77-78`) entsprechen wörtlich dem Entscheid. `inPeriod` (`invoice.service.ts:513-519`) setzt `noPeriod`, wenn Beginn oder Ende fehlt (Glossar `:63`: «Beginn und Ende oder keines von beiden»), und `whole`, wenn der Leistungszeitraum vorne oder hinten über die Periode hinausreicht. `daysOf` (`calculation.service.ts:161-162`) gibt beides an die Zeilen weiter. fr, it und en sind gleich gebaut |
| V-2 | behoben | `sharesNoteRounded` erscheint bei Rechnungszeilen. Den Restfall Heizprofil behandelt V-1 dieser Runde |
| V-3 | behoben | Szenario `:218`, pg-Tests `:197, 216-220, 235, 251-252, 288` und Render-Tests nachgeführt. Rest siehe V-3 dieser Runde |
| V-4 | behoben | Regel 5 (`docs/nebenkostenabrechnung-anforderungen.md:145`) zitiert die drei Zeilenformen und «Ihr Anteil: 900.00 × (…) / 1'800.00 = 306.52». Der Halbsatz «der Zeitanteil der Position bleibt der gerundete Prozentwert, die Erläuterung sagt das» stimmt mit `timeShare` (`:469`) überein |
| V-5 | teilweise | Der Doppelpunkt kommt aus `t.colon`. Das U+00A0 ist zu U-37 verschoben, siehe V-4 dieser Runde |
| V-6, V-7, V-8 | behoben | de entspricht wörtlich den entschiedenen Sätzen. fr «Si un poste du décompte comporte des factures sur des jours différents, le calcul figure en dessous.», «Votre part est la part du logement multipliée par la part temporelle.», «Pour les frais de chauffage, la part temporelle est la part selon le profil de chauffage.». it und en entsprechen dem Sinn. Die Begriffe stimmen mit `i18n-begriffe.md` überein |
| V-9 | Ablehnung bestätigt | Jede Rechnungszeile nennt den Nenner («Ihre Mietstage 47 von 92 Tagen»). Beim einzelnen Bruch «31/62 Tage» erklärt der erste Satz der Erläuterung die 62 |
| V-10 | behoben | fr «vos jours de location 47 sur 92», en «your days rented 47 of 92», fr «dans cette période qui comptent», fr «Pour les frais de chauffage», it «Per le spese di riscaldamento» |
| V-11 | behoben | `i18n-begriffe.md:59` «période de prestation / periodo di prestazione / service period», übereinstimmend mit `messages/fr.json:720`, `messages/it.json:720` und `messages/en.json:720` |

## Bestätigt

**Sind die Zeilen in jedem Fall wahr?**
- *Leistungszeitraum innerhalb der Periode:* «Leistungszeitraum {start} – {end}» zeigt den Leistungszeitraum des Belegs. Der Betrag ist der Rechnungsbetrag: `roundToRappen(amount × d/d)` = amount. Wahr.
- *Ohne Leistungszeitraum:* Es werden keine Daten gedruckt. «von 365 Tagen der Abrechnungsperiode» ist richtig, weil `total` = Tage der Periode ist (`inPeriod` gibt Periodenbeginn und Periodenende zurück). Wahr.
- *Über die Periode hinaus (vorne oder hinten):* Gedruckt werden der Leistungszeitraum und der Betrag des Belegs, danach «davon» mit dem Teil in der Periode und dem gekürzten Betrag. Ein Leistungszeitraum, der vor der Periode beginnt, erscheint ebenfalls als «davon», denn `beyond` prüft beide Enden (nur im Code gelesen, siehe «Nicht bestätigt»).
- *Heizkosten:* Eine Position nach Heizprofil hat nie Rechnungszeilen (`calculation.service.ts:331, 344-347`, `shareDays = noDays`). Heizkosten nach Tagen (ohne Heizprofil oder mit 0 % in den Monaten der Periode) haben `byProfile` false und erhalten deshalb keinen Heizprofil-Satz. Wahr, bis auf die Rundung (V-1).
- *Mietvertrag über die ganze Periode:* Es gibt keine Zeilen (`daysOf`, `wholePeriod`), die Spalte zeigt «365/365 Tage», die Sätze zu den Zeilen und zur Rundung fehlen. «Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil» stimmt dann genau (× 1). Der pg-Test `:288` bestätigt, dass keine Zeile gedruckt wird.
- *Die Erläuterung:* In der Reihenfolge Zeitanteil, Leistungszeitraum, Zeilen, «Ihr Anteil», Rundung, Heizprofil entspricht sie den Entscheiden P-1, V-2, V-6, V-7 und V-8. Szenario `statement-detail.feature:276` prüft den Text wörtlich.

**Nachgerechnet** (Python, auf Rappen gerundet):
- Szenario `statement-detail.feature:273-275`: 900.00 × (600.00 × 0/91 + 1'200.00 × 47/92) / 1'800.00 = 306.52. Zeitanteil 34.06 %. Tage: 01.04.–30.06. = 91, 01.07.–30.09. = 92, ab 15.08. darin 47.
- pg «Prozent»: 900.00 × 62/92 = 606.52 (01.07.–31.08. von 01.07.–30.09.). 1'206.52 × (600.00 × 16/30 + 606.52 × 31/62) / 1'206.52 = 320.00 + 303.26 = 623.26. Spalte: 623.26 / 1'206.52 = 51.66 %. 1'206.52 × 51.66 % = 623.29 ≠ 623.26, was der Rundungshinweis abdeckt.
- pg «zufällig 139/365»: 3'650.00 × (1'810.00 × 0/181 + 1'840.00 × 139/184) / 3'650.00 = 1'390.00.
- pg «ohne Leistungszeitraum»: 1'265.00 × (365.00 × 139/365 + 900.00 × 47/92) / 1'265.00 = 139.00 + 459.78 = 598.78.
- Render «über die Periode hinaus»: 01.11.2025–31.01.2026 = 92 Tage, davon 61 in 2025. 1'200.00 × 61/92 = 795.65. Mietstage ab 15.08.: 139 von 365. Die Zeilen stimmen, nicht aber `tenantShare` in den Testdaten (V-2).
- Randfall null: `rentalShare` gibt 0 zurück, `daysOf` gibt keine Zeilen zurück (`totalAmount === 0`), Regel 5 sagt «ergeben die Rechnungen zusammen null, nennt es sie nicht». Stimmt überein.
- Randfall Gutschrift: Laut Glossar `UBIQUITOUS_LANGUAGE.md:69` erfasst Dwello eine Gutschrift nicht als eigene Rechnung. Ein negativer Betrag in «(Rechnung CHF …)» gehört zu #237 und nicht zu #241.
- Ihr Anteil in der Zeile = gedruckter Betrag: `apartmentShare` ist auf Rappen gerundet (`calculation.service.ts:180, 195, 207`), die Teilbeträge ebenso (`inPeriod`), und `tenantShare = roundToRappen(apartmentShare × rentalShare)` rechnet mit genau diesen Werten. Die gedruckte Gleichung geht deshalb immer auf.

**Begriffe.** Leistungszeitraum (`UBIQUITOUS_LANGUAGE.md:63`), Mietstage (`:157`), Zeitanteil (`:155`), Abrechnungsposition (`:148`), Abrechnungsperiode, Wohnungsanteil, Heizprofil und «Ihr Anteil» (laut Glossar `:155` die Beschriftung im PDF) sind belegt. «Rechnung» ist im Glossar ebenfalls belegt. Die Übersetzungen entsprechen `i18n-begriffe.md`: période de prestation, jours de location, part temporelle, poste du décompte, profil de chauffage, période de décompte; periodo di prestazione, giorni di locazione, quota temporale, voce del conteggio, periodo di conteggio; service period, days rented, time share, statement line, billing period. Die Höflichkeitsform ist richtig: vous, Lei («i suoi», «La sua quota»), Sie.

**Dokumente.** `docs/data-model.md:314, 318` beschreibt `noPeriod` und `whole` wie im Code (`schema.ts:335-342`). «parts stored before have neither» trifft zu. Die gespeicherten Zeilen gibt es erst seit #226: Merge 3c664d3c am 16.10.2026, in keinem Release-Tag (`git tag --contains 3c664d3c` ist leer, letzter Tag v0.4.11 vom 15.10.2026). In keinem Release kann also eine alte Abrechnung eine Rechnung ohne Leistungszeitraum als «Leistungszeitraum 01.01.–31.12.» drucken.

**Mietrecht.** Der neue Text ändert keinen Betrag, er beschriftet und erklärt nur.
- Art. 257b Abs. 1 OR (SR 220, Fedlex): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- Abs. 2: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» Mit dem Betrag und dem Leistungszeitraum des Belegs in `partBeyond` findet der Mieter den Beleg jetzt wieder.
- Art. 4 Abs. 1 VMWG (SR 221.213.11): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»
- Kein Widerspruch. Ob eine Erläuterung, die um Rappen nicht aufgeht (V-1), die Abrechnung rechtlich angreifbar macht, ist **unsicher**: Fedlex enthält keinen Wortlaut zur Nachvollziehbarkeit (gelesen in Art. 257a–257b OR und Art. 4–8 VMWG, Kopien in `scratchpad/or.html` und `scratchpad/vmwg.html`).

## Fehlende Begriffe

Keine. Für V-1 braucht es nur einen kurzen Satz zum gerundeten Prozentwert (Vorschlag oben), zu entscheiden mit den Labels `fachlich` und `entscheiden`.

## Nicht bestätigt

- **Leistungszeitraum, der vor der Periode beginnt:** Die Zeile «Leistungszeitraum 01.11.2024 – 31.01.2025 (Rechnung …), davon 01.01.2025 – 31.01.2025: …» habe ich nur im Code geprüft (`invoice.service.ts:518`). Kein Test zeigt diesen Fall.
- **Gerendertes PDF:** Ich habe kein PDF erzeugt. `node_modules` im Worktree verweist auf den Arbeitsbaum des Aufrufers, und der Zugriff darauf war gesperrt. Die Texte stammen aus dem Code und den Testerwartungen. Den Zeilenumbruch habe ich mit den Helvetica-Breiten geschätzt (`scratchpad/wrap/wrap.py`).
- **Beleg bei einer einzelnen Rechnung über die Periode hinaus, oder bei einem Mietvertrag über die ganze Periode:** Ohne Rechnungszeilen nennt das PDF weder den Betrag noch den Leistungszeitraum des Belegs. Im Szenario `:211-218` erscheinen in «Kosten Liegenschaft» 606.52 für einen Beleg über 900.00. Das bestand schon vor #241, und #241 deckt diesen Fall nicht ab. Ob #236 ihn abdeckt, konnte ich nicht prüfen: Der Text des Issues liegt nicht im Worktree.
- **Wortlaut der Entscheide:** Ich habe ihn nur aus dem Auftrag übernommen. Issue #241 selbst habe ich nicht gelesen.
