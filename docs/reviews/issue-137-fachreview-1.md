# Fachreview #137, Runde 1: Heizkosten einer Sommerperiode im PDF

Gegenstand: `@wip`-Szenario «Heizkosten einer Sommerperiode stehen im PDF nach Tagen» (`tests/e2e/features/statement-detail.feature:175-187`, Commit 6fda8bc, Worktree `review-137-fach`), vor der Umsetzung. Geprüft gegen `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, VMWG und OR auf Fedlex sowie gegen den Code, den die Umsetzung ändern wird (`backend/src/services/statement-pdf.service.ts`, `pdf.service.ts`, `prorating.service.ts`, `calculation.service.ts`).

Fedlex-Fassungen: VMWG (SR 221.213.11), Stand 1.10.2025, `https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1990/835_835_835/20251001/de/html/…`; OR (SR 220), Stand 1.1.2025, `https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/27/317_321_377/20250101/de/html/…`.

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major | Das Szenario prüft nicht, dass der Hinweis nach Art. 8 Abs. 1 VMWG bleibt. Die naheliegende Umsetzung (keine `heating`-Daten für eine Zeile nach Tagen) entfernt ihn. |
| M-2 | Mietrecht | Major (vorbestehend) | Hat eine Abrechnung Heizkosten, aber kein Heizprofil und keinen Tankbestand, fehlt der Hinweis nach Art. 8 Abs. 1 VMWG schon heute. |
| V-1 | Verwalter | Minor | Antwort auf die Frage: Ja, `sharesNote` soll den Heizkosten-Satz nur drucken, wenn eine Zeile nach dem Heizprofil verteilt ist. Das Szenario erkennt den Satz heute nicht («nach dem Heizprofil» ≠ «nach Heizprofil»). |
| V-2 | Verwalter | Minor | Regel 5 in `nebenkostenabrechnung-anforderungen.md` nennt die Verteilung nach Tagen in einer Periode ohne Heizanteil nicht. |
| V-3 | Verwalter | Minor | «Sommerperiode» und «nach Tagen» stehen nicht im Glossar. Glossarbegriff ist «Mietstage»; für die Periode fehlt ein Begriff. |
| V-4 | Verwalter | Nit | Regelfrage (nicht durch #137 geändert): Sprung zwischen «Periode mit einem Heizmonat» (Mieter trägt 0 %) und «Periode ohne Heizmonat» (Mieter trägt nach Mietstagen). |
| V-5 | Verwalter | Nit | Das Beispiel rechnet einen Heizöl-Einkauf vom 30.06. in einer Sommerperiode ab (Einkauf statt Verbrauch, Art. 5 Abs. 2 lit. a VMWG). Das ist bekannt und dokumentiert, aber kein gutes Musterbeispiel. |
| V-6 | Verwalter | Nit | Die Abrechnung über 92 Tage heisst im Schritt «Abrechnung 2024», und das Glossar nennt die Nebenkostenabrechnung «jährlich». Rechtlich zulässig, siehe unten. |

## Antwort auf die Frage zu `sharesNote`

**Ja.** Der Satz «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode, bei Heizkosten der Anteil nach dem Heizprofil.» (`backend/src/services/pdf.service.ts:87`, ebenso fr/it/en Z. 153, 219, 285) soll den Teil «bei Heizkosten der Anteil nach dem Heizprofil» nur tragen, wenn mindestens eine Abrechnungsposition `byProfile` ist. Begründung und Prüfung im Szenario: siehe V-1.

## Befunde

### M-1 (Major, Mietrecht): Der Hinweis nach Art. 8 Abs. 1 VMWG ist nicht abgesichert

**Beleg.**
- `backend/src/services/pdf.service.ts:663`: `...(data.heating || data.fuel ? [t.noteHeating] : [])`. Der Hinweis «Sie können eine detaillierte Abrechnung der Heiz- und Warmwasserkosten verlangen (Art. 8 Abs. 1 VMWG).» (Z. 97) hängt also an `data.heating`.
- `backend/src/services/statement-pdf.service.ts:136-151` (`heatingOf`) liefert `data.heating`, also genau die Daten, aus denen `heatingLines` (pdf.service.ts:616-626) die Notiz «Heizkosten nach Heizprofil …» und die Monatsliste baut.
- Die kürzeste Umsetzung von «keine «nach Heizprofil»-Notiz» ist, dass `heatingOf` bei einer Verteilung nach Tagen `{}` zurückgibt. Dann fällt in dieser Abrechnung auch der Art.-8-Hinweis weg, obwohl sie Heizkosten enthält. Das Szenario (Z. 186-187) würde trotzdem grün.
- Fedlex, Art. 8 Abs. 1 VMWG: «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann.»

**Warum falsch.** Eine Abrechnung mit Heizkosten nach Mietstagen ist keine detaillierte Heizkostenabrechnung. Der Hinweis ist deshalb Pflicht, unabhängig davon, wie der Anteil verteilt wurde.

**Korrektur.**
- Im Szenario nach Z. 187 ergänzen: `Und steht im PDF "detaillierte Abrechnung der Heiz- und Warmwasserkosten"`.
- In der Umsetzung den Hinweis an «die Abrechnung hat eine Heizkosten-Position» binden (in `generateStatementPdf` gibt es dafür schon `hasHeating`), nicht an `data.heating`.
- Damit ist M-2 zugleich behoben.

### M-2 (Major, vorbestehend, Mietrecht): Ohne Heizprofil fehlt der Art.-8-Hinweis

**Beleg.**
- `statement-pdf.service.ts:139-140`: Ohne `statement.heatingProfileId` gibt `heatingOf` `{}` zurück.
- `fuelOf` (Z. 155-159) liefert nur mit Tankbestand etwas.
- Deshalb druckt `notes()` (pdf.service.ts:663) bei einer Abrechnung mit Heizkosten-Kategorie, aber ohne Heizprofil und ohne Tank, nur den Belegeinsicht-Hinweis.
- Gemäss Regel 5 (`nebenkostenabrechnung-anforderungen.md:145`) ist dieser Fall zulässig: «ohne Heizprofil auch die Heizkosten nach Tagen».
- Wortlaut von Art. 8 Abs. 1 VMWG: siehe M-1.

**Warum falsch.** Wie bei M-1. Der Fehler besteht schon auf dem Basis-Commit und kommt nicht von #137. Er gehört aber zur selben Bedingung im Code.

**Korrektur.** Wie bei M-1. Wird er nicht in #137 behoben, wird er offene Arbeit: ein `bug`-Issue, Szenario «Abrechnung ohne Heizprofil nennt das Recht auf die detaillierte Heizkostenabrechnung».

### V-1 (Minor, Verwalter): `sharesNote` widerspricht der Zeile nach Mietstagen, und das Szenario merkt es nicht

**Beleg.**
- In der Sommerperiode druckt die Heizkosten-Zeile nach dem Fix «48/92 Tage». Die allgemeine Notiz unter der Tabelle sagt aber weiter «bei Heizkosten der Anteil nach dem Heizprofil» (pdf.service.ts:87, ausgegeben Z. 601 ohne Bedingung).
- Der Mieter liest damit zwei widersprüchliche Erklärungen zur selben Zeile.
- `nebenkostenabrechnung-anforderungen.md:39` verlangt, dass «den Anteil des Mieters nachvollziehbar» ausgewiesen wird (unsicher-B, Sekundärquellen).
- Fedlex, Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, …». Eine Pflicht zur Nachvollziehbarkeit nennt der Wortlaut nicht ausdrücklich. Die Begründung stützt sich deshalb auf die Anforderung und die Praxis, nicht auf einen Fedlex-Wortlaut.
- Der «Done means» des Issues («the PDF has no «nach Heizprofil» note for it») deckt diesen Satz sinngemäss ab.
- Das Szenario prüft `nicht "nach Heizprofil"`. Der Satz in `sharesNote` lautet aber «nach **dem** Heizprofil». Das Szenario bliebe also grün, auch wenn der Satz stehen bleibt.

**Warum falsch.** Die Erklärung im PDF passt nicht zur Zeile. Bei Abrechnungen ganz ohne Heizprofil oder ohne Heizkosten-Position ist das schon heute so (vorbestehend). Bei #137 wird es aber neu sichtbar, weil die Zeile jetzt ausdrücklich «Tage» zeigt.

**Korrektur.**
- Den Heizkosten-Satz nur drucken, wenn mindestens eine Position `byProfile` ist. Ohne ihn lautet der Text: «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode.» (fr/it/en entsprechend kürzen; neuer Text in allen vier Sprachen).
- Im Szenario Z. 187 ersetzen durch `Und steht im PDF nicht "Heizprofil"`. In den deutschen PDF-Texten kommt «Heizprofil» nur in `heatingNote` (Z. 66) und `sharesNote` (Z. 87) vor. Die Prüfung erfasst damit beide Sätze, ist aber nicht zu breit.
- Dass eine Abrechnung nach Profil den Satz behält, ist im E2E heute nicht abgesichert. Das sollte ein Test einer tieferen Schicht übernehmen (z. B. `statement-pdf.pg.test.ts`, neben «nennt das Heizprofil …», Z. 79): «Done means» verlangt «a line shared by the profile stays unchanged».

### V-2 (Minor, Verwalter): Die Anforderung nennt die Ausnahme nicht

**Beleg.**
- `nebenkostenabrechnung-anforderungen.md:145` (Regel 5): «Kosten einer Heizkosten-Kategorie werden für einen Mietvertrag, der nur einen Teil der Periode läuft (Ein- oder Auszug), nach dem Heizprofil auf die Monate der ganzen Periode verteilt, … ohne Heizprofil auch die Heizkosten nach Tagen.»
- Die Ausnahme in `prorating.service.ts:233-237` (Periode mit 0 % im Profil → nach Tagen) fehlt dort.
- Abgesichert ist sie nur in `heating-distribution.pg.test.ts:165-187`.

**Warum falsch.** Mit #137 richtet sich das PDF nach dieser Regel. Die Quelle, an der Reviewer und Verwalter die Regel prüfen, nennt sie aber nicht.

**Korrektur.** In Regel 5 nach «ohne Heizprofil auch die Heizkosten nach Tagen» ergänzen: «Haben alle Monate der Abrechnungsperiode im gewählten Heizprofil 0 % (z. B. eine Periode nur aus Sommermonaten), werden die Heizkosten nach Mietstagen verteilt, und das PDF zeigt sie wie jede andere Position als Mietstage / Tage der Periode.»

### V-3 (Minor, Verwalter): Begriffe im Szenario

**Beleg.**
- Szenariotitel und Kommentar Z. 175/177: «Sommerperiode», «nach Tagen».
- Glossar: «Mietstage» (`UBIQUITOUS_LANGUAGE.md:137`, «Anzahl Tage, die ein Mietvertrag in der Abrechnungsperiode läuft. Grundlage für die anteilsmässige Berechnung.»), «Abrechnungsperiode» (Z. 129), «Heizprofil» (Z. 115).
- «Sommerperiode» steht nicht im Glossar. Einen Begriff für eine Periode ohne Heizanteil gibt es nicht.

**Warum falsch.** Die Projektregel lässt in Szenarien nur Glossarbegriffe zu. «Sommer» ist zudem ungenau: Entscheidend ist das Profil, nicht die Jahreszeit (ein eigenes Heizprofil kann auch Mai oder September mit 0 % führen).

**Korrektur.**
- Titel: «Heizkosten einer Abrechnungsperiode ohne Anteil im Heizprofil stehen im PDF nach Mietstagen».
- Kommentar: «Eine Abrechnungsperiode, deren Monate im Heizprofil 0 % haben: die Heizkosten werden nach Mietstagen verteilt».
- **Fehlender Begriff, Vorschlag fürs Issue** (Labels `fachlich`, `entscheiden`): «**Periode ohne Heizanteil**: Abrechnungsperiode, deren Monate im gewählten Heizprofil zusammen 0 % haben. Ihre Heizkosten werden nach Mietstagen verteilt.»

### V-4 (Nit, Verwalter): Regelfrage, durch #137 nicht geändert

**Nachgerechnet** (Profil «Winter», Einzug 15.07.2024, Heizkosten-Wohnungsanteil CHF 500):

| Abrechnungsperiode | Profilanteil der Periode | Profilanteil des Mieters | Zeitanteil | Ihr Anteil |
|---|---|---|---|---|
| 01.06.–31.08.2024 | 0 % | 0 % | 48/92 Tage = 52.17 % | CHF 260.87 |
| 01.05.–31.08.2024 | 2 % (Mai) | 0 % | 0/2 = 0 % | CHF 0.00 |
| 01.01.–31.12.2024 | 100 % | Jul–Dez: 0+0+2+8+14+26 = 50 % | 50 % | CHF 250.00 |

Eine Periode mit nur einem Heizmonat mehr lässt den Mieter also von 52 % auf 0 % fallen. Das ist die Folge des Monatsmodells. Der Fallback nach Tagen ist nur dort nötig, wo die Profilrechnung 0/0 ergibt.

**Mit dem Gesetz vereinbar.** Art. 7 Abs. 1 VMWG: «Die Heizungskosten für nicht vermietete Wohn- und Geschäftsräume trägt der Vermieter.» Den Leerstand 01.06.–14.07. (44/92) trägt beim Fallback der Vermieter, das passt. Art. 5 Abs. 1 VMWG: «Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.» Abgerechnet werden nur tatsächliche Kosten, verteilt auf Mieter und Leerstand, also höchstens 100 %.

**Nicht vorgeschrieben.** Wie Heizkosten bei einem Mieterwechsel aufzuteilen sind, regeln Art. 4–8 VMWG nicht (siehe «Nicht bestätigt»).

**Korrektur.** Für #137 nichts. Die Abweichung gehört dokumentiert (V-2). Ob der Sprung gewollt ist, kann der Produktverantwortliche bei Gelegenheit entscheiden (optional ein Issue `fachlich`, `entscheiden`).

### V-5 (Nit, Verwalter): Einkauf statt Verbrauch im Beispiel

**Beleg.**
- Die Grundlage legt «Heizöl 2024» über CHF 1000 mit Datum 2024-06-30 an (`tests/e2e/fixtures/backend.ts:245-248`). Die Sommerperiode rechnet diesen Einkauf ab.
- Fedlex, Art. 5 Abs. 2 lit. a VMWG: «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden;».
- Dwello rechnet ohne Tankbestand bewusst die Lieferungen ab und weist im Abrechnungslauf darauf hin (`nebenkostenabrechnung-anforderungen.md:150`, Regel 10).

**Warum erwähnt.** Ein im Juni gekauftes Heizöl wird im Winter verbraucht. Ein Mieter, der nur im Sommer abgerechnet wird, trägt so Kosten, die nicht in seiner Periode verbraucht wurden. Am Ziel des Szenarios (der Text im PDF) ändert das nichts.

**Korrektur.** Keine nötig. Optional im Szenario-Kommentar «(Heizöl ohne Tankbestand: Einkauf)» vermerken, oder für dieses Szenario eine Heizkosten-Position mit typischen Sommerkosten wählen (Kaminfeger, Revision; Art. 5 Abs. 2 lit. d/e VMWG).

### V-6 (Nit, Verwalter): Kurze Abrechnungsperiode

**Beleg.**
- Glossar Z. 127: «Nebenkostenabrechnung: Jährliche Abrechnung …». Z. 193: «Jährliche Abrechnungsperiode».
- Im Szenario Z. 183 heisst die Abrechnung 01.06.–31.08.2024 trotzdem «Abrechnung 2024». Der Kommentar in `backend.ts:149` erklärt das.
- Der Wizard erlaubt freie Daten (`src/routes/statements/generate/PeriodStep.svelte:26,34`).
- Fedlex, Art. 4 Abs. 1 VMWG: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Eine kürzere Periode ist also zulässig, etwa bei einer Umstellung der Abrechnungsperiode.

**Korrektur.** Keine für #137. Dass das Glossar «jährlich» schreibt, eine kürzere Periode aber zulässt, fällt auf. Ein Glossar-Issue lohnt sich nur, wenn der Produktverantwortliche kurze Perioden ausdrücklich will.

## Bestätigt

- **Mietstage und Tage der Periode:**
  - 01.06.–31.08.2024 = 30 + 31 + 31 = 92 Tage.
  - 15.07.–31.08.2024 = 17 + 31 = 48 Mietstage.
  - 48/92 = 0.521739. Gespeichert wird 0.5217 (`calculation.service.ts:327`), gedruckt bisher «52.17 %».
  - Die Toleranz in `timeShare` (pdf.service.ts:426, < 0.00005) hält mit |0.5217 − 0.521739| = 0.000039. Mit `byProfile = false` druckt das PDF also «48/92 Tage» (Text `days`, Z. 74). Der Erwartungswert des Szenarios stimmt.
- **Ihr Anteil mit dem Taschenrechner** (Anforderung Z. 94):
  - Wohnungsanteil 500 × 48/92 = 260.87.
  - Bestehender Test `heating-distribution.pg.test.ts:177-187`: 300 × 62/92 = 202.17 (0.6739), nachgerechnet.
- **Randfälle:**
  - Einzug am 01.06. ergibt 92/92 = 100 %.
  - Auszug am 14.07. bei Folgemieter ab 15.07. ergibt 44/92 = 47.83 % und 48/92 = 52.17 %. Zusammen sind das 92/92: Die Anteile zweier Mieter ergeben den Wohnungsanteil (bis auf die Rappenrundung je Abrechnung).
  - Heizkosten 0 ergeben in `handleMidYearMoves` den Anteil 0.
- **Begriffe:** «Mietstage», «Abrechnungsperiode», «Heizprofil», «Nebenkostenabrechnung», «Mieter», «Liegenschaftsverwalter», «Wohnung» und «leer» (Mietstatus) stehen im Glossar und sind richtig verwendet. «Zeitanteil» steht nicht im Glossar, ist aber bereits als `TODO(fachlich prüfen, #75)` geführt (pdf.service.ts:31).
- **Zeile der Mietdauer:** «Ihr Mietverhältnis in dieser Periode: 15.07.2024 – 31.08.2024 (48 Mietstage von 92 Tagen)» (pdf.service.ts:77) entspricht Anforderung Z. 41.

## Nicht bestätigt

- **Aufteilung der Heizkosten beim Mieterwechsel (Profil oder Tage):** Art. 4–8 VMWG (Fedlex, Stand 1.10.2025, ganz gelesen) und Art. 257a/257b OR (Fedlex, Stand 1.1.2025) enthalten dazu keine Regel. Die Praxis mit Heizgradtagen und Monatsanteilen ist nur über Sekundärquellen belegt (Anforderung Z. 67, unsicher-B). Ob in einer Periode ohne Heizanteil eine Verteilung nach Tagen üblich ist, habe ich nicht gefunden. Die Regel ist deshalb **unsicher** (Praxis), aber nicht gesetzwidrig (V-4).
- **«Nachvollziehbar» als Rechtspflicht:** Ein Fedlex-Wortlaut fehlt. Art. 257b Abs. 2 OR regelt nur die Belegeinsicht («Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»). V-1 stützt sich auf die Anforderung (unsicher-B) und ist rechtlich **unsicher**.
- **Fassung des OR:** Ich habe die Fassung vom 1.1.2025 aus dem Fedlex-Filestore verwendet. Ob es eine neuere gibt, habe ich nicht geprüft (Art. 257b ist seit Langem unverändert).
- **Texte in fr/it/en:** Das Szenario prüft nur Deutsch. Ob `heatingNote` und `sharesNote` in fr/it/en mit dem Fix ebenso wegfallen bzw. gekürzt werden, kann erst der Diff zeigen. Das gehört in die Fachreview der Umsetzung.
- **Toleranz in `timeShare`:** Bei Perioden mit 16, 32, 80, 160 oder 320 Tagen (Bruch mit genau fünf Nachkommastellen, z. B. 1/32) kann die Rundung auf vier Stellen genau 0.00005 abweichen. Dann druckt das PDF Prozent statt Tage. Für #137 (92 Tage) ist das nicht relevant und betrifft eher den Code als die Fachlichkeit. Ich habe es nicht weiter verfolgt.
