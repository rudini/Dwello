# Fach-Review #241 (schliesst auch #239), Runde 3: nur der Delta

Geprüft wurde der Worktree `review-241-fach3` auf Commit 9cade5b6, Diff `3ae2b1d6..9cade5b6`. Gelesen habe ich:

- `pdf.service.ts`: `partStock` in de/fr/it/en, `partText`, `partValues`, `partLines`, `sharesNote`, `heatingSection`, `fuel*`, `sharesNoteFuel`
- `fuel-stock.service.ts`: `fuelStockChange`
- `calculation.service.ts`: `rentalShare`, `daysOf`
- `schema.ts`: `InvoicePart`
- `pdf-format.ts`: `formatCHF`
- die Tests im Delta: `statement-pdf.pg.test.ts:562-579`, `statement-pdf-render.test.ts:284-298` und `statement-detail.feature:278-292`
- `UBIQUITOUS_LANGUAGE.md:132-135`, `docs/design/i18n-begriffe.md:75-76`, `docs/data-model.md:314, 318`
- `docs/nebenkostenabrechnung-anforderungen.md:30, 56, 150`
- den Bericht der Runde 2

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major (bestand schon vorher, durch die Änderung sichtbarer) | Unter den Heizkosten ohne Heizprofil wird eine Brennstoff-Lieferung mit ihrem Leistungszeitraum gewichtet, die Veränderung Tankbestand mit der ganzen Periode. Verrechnet wird dem Mieter so ein Anteil an Einkauf und Lagerabbau, nicht ein Anteil am Verbrauch der Periode. Die neue Zeile zeigt die beiden Zeitbasen jetzt nebeneinander. Das widerspricht «Abgerechnet wird das verbrauchte Heizmaterial, nicht der Einkauf.» im selben PDF |
| V-2 | Verwalter | Nit | Ist die Veränderung negativ, druckt die Berechnung «… + -300.00 × 139/365». Die Zeile selbst ist wahr. Kein Test prüft den negativen Fall |
| V-3 | Verwalter | Nit | In `docs/data-model.md:314, 318` fehlt das neue Feld `fuelStock` von `invoice_parts` |
| V-4 | Verwalter | Nit | In `docs/design/i18n-begriffe.md` fehlt eine Zeile «Veränderung Tankbestand». Die Übersetzungen leiten das Wort aus «Tankbestand» ab |

Mietrecht: keine Befunde zum Delta (siehe V-1 zur Rechtsgrundlage). Rechtstexte: nicht betroffen.

---

## V-1 (Major, bestand schon vorher): Lieferung nach Leistungszeitraum, Veränderung Tankbestand nach Periode

**Beleg.**
- `calculation.service.ts:139-146` (`rentalShare`): Jede «Rechnung» der Gruppe wird mit `rentedIn(invoice) / days(invoice.start, invoice.end)` gewichtet. Das gilt auch für die Lieferung von Heizmaterial mit Leistungszeitraum.
- `fuel-stock.service.ts:98`: Die Veränderung Tankbestand geht als zusätzliche «Rechnung» über `periodStart`–`periodEnd` in dieselbe Gruppe ein.
- `pdf.service.ts:101`: «Abgerechnet wird das verbrauchte Heizmaterial, nicht der Einkauf.»
- `pdf.service.ts:99`: «Kosten Liegenschaft bei Heizmaterial aus dem Tank: der Verbrauch (siehe Heiz- und Warmwasserkosten).»
- Glossar `UBIQUITOUS_LANGUAGE.md:135`: «Zusammen mit den Lieferungen der Abrechnungsperiode ergibt sie den Verbrauch, der zu den Heizkosten zählt (Art. 5 Abs. 2 lit. a VMWG).»
- Art. 5 Abs. 2 lit. a VMWG (SR 221.213.11): «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden;»

**Nachgerechnet** (Szenario `statement-detail.feature:281-292`: Lieferung 900.00 für 01.07.–30.09.2025, Einzug 15.08.2025, eine Wohnung mit 100 % gerechnet):

| Fall | Verbrauch | Dwello | nur nach Mietstagen 139/365 |
|---|---|---|---|
| Tank 600 → 100 (Szenario) | 1'400.00 | 900.00 × 47/92 + 500.00 × 139/365 = 459.78 + 190.41 = **650.19** (46.44 %) | 533.15 |
| Tank 100 → 400 (negativ) | 600.00 | 459.78 − 114.25 = **345.54** (57.59 %) | 228.49 |
| Tank 300 → 300 (null) | 900.00 | 459.78 + 0.00 = **459.78** (51.09 %) | 342.74 |

Der Mieter war 38 % der Periode da. Er zahlt aber 46 % bis 58 % des Verbrauchs, weil Dwello eine Lieferung im Sommer wie Verbrauch im Sommer behandelt. Wird umgekehrt vor dem Einzug geliefert, zahlt er zu wenig.

**Warum falsch.** Bei Heizmaterial aus dem Tank ist der Verbrauch der Periode die Kostengrösse: Anfangsbestand + Lieferungen − Endbestand (Anforderungen `:56`). Wann geliefert wurde, sagt nichts darüber, wann verbraucht wurde. In der Praxis verteilt der Verwalter den Verbrauch nach Heizgradtagen bzw. Heizprofil oder nach Tagen der Periode, nicht nach Lieferdaten. Die Erklärung des PDF ist in sich widersprüchlich: Oben heisst es «der Verbrauch», darunter wird die Lieferung allein nach ihrem Leistungszeitraum geteilt.

**Abgrenzung.** Der Delta ändert keinen Betrag. Die Gewichtung besteht seit #226 bzw. seit dem Tankbestand (#100) auch auf 3ae2b1d6. Mit dem neuen Wortlaut steht die Lieferung aber als «Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 900.00, Ihre Mietstage 47 von 92 Tagen» direkt über «Veränderung Tankbestand 01.01.2025 – 31.12.2025 …». Der Widerspruch ist dadurch sichtbarer. Für #239 ist das kein Blocker, denn die Beschriftung selbst stimmt. Es braucht aber ein Issue mit den Labels `fachlich` und `entscheiden`.

**Was es behebt** (Vorschlag für das Issue). In einer Kategorie mit Tankbestand («Brennstoff (Kategorie)», Glossar `:82`) den Leistungszeitraum der Lieferungen für die Verteilung nicht verwenden. Den Verbrauch (`fuel.total`) wie eine Rechnung ohne Leistungszeitraum über die ganze Periode verteilen, also nach Heizprofil oder nach Mietstagen der Periode. Dann entfällt auch die Zeilenaufstellung unter dieser Position. Das ist eine Änderung der Beträge und eine Produktentscheidung. Sie gehört deshalb nicht zu #241/#239.

## V-2 (Nit): Negative Veränderung in der Berechnung

**Beleg.** `pdf.service.ts:668`: `` `${formatCHF(part.amount)} × ${part.days}/${part.total}` `` wird mit `' + '` verbunden. `formatCHF(-300)` ergibt «-300.00» (`pdf-format.ts:13`). Gedruckt wird:
- «Veränderung Tankbestand 01.01.2025 – 31.12.2025: CHF -300.00, Ihre Mietstage 139 von 365 Tagen»
- «Ihr Anteil: 600.00 × (900.00 × 47/92 + -300.00 × 139/365) / 600.00 = 345.54»

**Bewertung.** Die Zeile ist wahr. Laut Glossar `:135` ist die Veränderung «negativ, wenn der Endbestand höher ist als der Anfangsbestand». Mit dem Abschnitt «Heiz- und Warmwasserkosten» passt sie zusammen: Anfangsbestand 100.00 + Rechnungen 900.00 − Endbestand 400.00 = 600.00, und 100.00 − 400.00 = −300.00. Auch die Gleichung geht auf. Nur liest sich «+ -» schlecht, und kein Test (pg, Render oder Szenario) zeigt den negativen Fall. Den Entscheid von #239 haben die Tests damit nur für den positiven Fall belegt.

**Was es behebt.** Ein Render-Testfall mit `amount: -300` und der erwarteten Zeile. Optional einen negativen Summanden als «− 300.00 × 139/365» drucken (wie `signed`, `pdf.service.ts:554`, mit «–»).

## V-3 (Nit): `data-model.md` nicht nachgeführt

**Beleg.** `docs/data-model.md:314` («`[{start, end, amount, days, total, noPeriod?, whole?}]`») und `:318` nennen `noPeriod` und `whole`, nicht aber `fuelStock` (`schema.ts:341`).

**Was es behebt.** Ergänzen: «`fuelStock` marks the Veränderung Tankbestand, which is no invoice (#239)».

## V-4 (Nit): Begriff in `i18n-begriffe.md`

**Beleg.**
- `i18n-begriffe.md:75`: «Tankbestand / Heizmaterial | stock de combustible / combustible | scorta di combustibile / combustibile | fuel stock / fuel». Eine Zeile für «Veränderung Tankbestand» fehlt.
- Die Texte bilden das Wort richtig aus dem vorhandenen Begriff: «Variation du stock de combustible», «Variazione della scorta di combustibile», «Change in fuel stock».

**Fehlender Begriff (Vorschlag).** Zeile in `i18n-begriffe.md`: «Veränderung Tankbestand | variation du stock de combustible | variazione della scorta di combustibile | change in fuel stock». Der deutsche Begriff steht bereits im Glossar. Ein Issue ist nur nötig, wenn der Product Owner die Übersetzungen eigens bestätigen will.

---

## Bestätigt

- **Begriff und Entscheid #239.**
  - «Veränderung Tankbestand» steht wörtlich im Glossar (`UBIQUITOUS_LANGUAGE.md:135`).
  - Die Zeile nennt die Veränderung «als solche» und nicht «Verbrauch»: `partStock` enthält das Wort nicht, in keiner Sprache.
  - Das Beispiel im Entscheid («: −300.00, 139/365 Tage») ist mit «z. B.» eingeleitet. Die Umsetzung folgt dem Muster der Nachbarzeilen («CHF {amount}, Ihre Mietstage {days} von {total} Tagen»). Das ist innerhalb des Entscheids und gleich gebaut wie `partLine`, `partNoPeriod` und `partBeyond`.
  - fr/it/en verwenden «stock de combustible», «scorta di combustibile» und «fuel stock» aus `i18n-begriffe.md:75`, dazu die schon geprüften «vos jours de location … sur», «i suoi giorni di locazione … su» und «your days rented … of». Höflichkeitsform vous/Lei richtig.
- **Vorrang in `partText`.** `fuelStock` wird zuerst geprüft. Die Veränderung hat weder `noPeriod` noch `whole` (`fuel-stock.service.ts:98`), deshalb gibt es keinen Konflikt. Der pg-Test `:578` schliesst «Leistungszeitraum 01.01.2025 – 31.12.2025» aus.
- **Übereinstimmung mit dem Abschnitt «Heiz- und Warmwasserkosten».** Die Daten 01.01.–31.12.2025 der Zeile sind die Periode. Der Abschnitt nennt «Anfangsbestand am 31.12.2024» (Tag vor der Periode, Glossar `:133`) und «Endbestand am 31.12.2025». Die Zeile mit 500.00 ist 600.00 − 100.00. Mit der Lieferung 900.00 ergibt das 1'400.00 = «= Heizkosten nach Verbrauch» = Kosten Liegenschaft der Position. `sharesNoteFuel` verweist darauf, das ist stimmig (ausser der Verteilung, V-1).
- **Arithmetik Szenario und Tests** (Python):
  - 15.08.–31.12.2025 = 139 Tage, 01.07.–30.09.2025 = 92 Tage, 15.08.–30.09.2025 = 47 Tage.
  - Render-Test: 1'400.00 × (900.00 × 47/92 + 500.00 × 139/365) / 1'400.00 = 459.78 + 190.41 = 650.19, Zeitanteil 46.44 % (`periodShare 0.4644`, `tenantShare 650.19`). Stimmt.
  - V-2 der Runde 2 ist im Render-Fixture übernommen: 0.7338 / 512.08 stimmt.
- **Randfälle.**
  - Veränderung null: Zeile «CHF 0.00», wahr.
  - Lieferung und Veränderung zusammen null (z. B. 300.00 und −300.00): `daysOf` gibt keine Zeilen zurück (`totalAmount === 0`).
  - Lieferung ohne Leistungszeitraum: Lieferung und Veränderung haben dieselben Tage, deshalb erscheint nur «139/365 Tage» und keine Zeile.
  - Mieter über die ganze Periode: keine Zeilen.
  - In allen vier Fällen druckt das PDF keine falsche Beschriftung.
- **Alte gespeicherte Teile ohne `fuelStock`.** Sie gäbe es erst seit #226, das in keinem Release ist (Runde 2). Kein Release druckt also «Leistungszeitraum» für den Tankbestand.
- **Runde-2-Befunde.** V-2 und V-3 (pg-Test `:199-201`) sind im Delta behoben. V-1 bleibt offen in #256. V-4 bleibt abgelehnt.
- **Mietrecht.** Art. 8 Abs. 2 VMWG: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.» Die Zeile benennt die Bestandsveränderung jetzt so, dass der Mieter die Auskunft gezielt verlangen kann. Kein Widerspruch.

## Nicht bestätigt

- **Fedlex-Wortlaut.** Art. 5 und Art. 8 VMWG habe ich aus der Fedlex-Kopie der Runde 2 zitiert (`scratchpad/vmwg.html`), nicht neu abgerufen.
- **Ob die Verteilung nach Lieferdaten (V-1) rechtlich unzulässig ist: unsicher.** Art. 5 Abs. 2 lit. a VMWG nennt den Verbrauch als anrechenbare Kosten. Wie der Verbrauch bei einem Mieterwechsel zeitlich zu verteilen ist, regelt der Wortlaut nicht (gelesen: Art. 5–8 VMWG, Art. 257a–257b OR). Die Praxis «nach Heizgradtagen bzw. Heizprofil» stützt sich auf die Sekundärquellen in `docs/nebenkostenabrechnung-anforderungen.md:30, 56` (unsicher-B).
- **Gerendertes PDF.** Ich habe kein PDF erzeugt und keinen Test ausgeführt. Die Texte stammen aus dem Code und den Testerwartungen. Ob Helvetica bei der Zeile umbricht, habe ich nicht geprüft.
- **Text des Entscheids #239.** Ich habe ihn nur aus dem Auftrag übernommen, das Issue selbst nicht gelesen.
- **Detailseite.** Ob sie die Veränderung Tankbestand irgendwo als Rechnung oder Leistungszeitraum zeigt, habe ich nicht geprüft. `src/` liest `invoiceParts` nicht (grep leer), der Delta betrifft nur das PDF.
