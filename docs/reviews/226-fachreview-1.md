# Fach-Review #226, Runde 1 (vor der Umsetzung)

Gegenstand: @wip-Szenario «PDF nennt bei Rechnungen über verschiedene Leistungszeiträume die Tage jeder Rechnung» (`tests/e2e/features/statement-detail.feature:258-274`, Commit b170c5cc) und die geplanten PDF-Zeilen unter der Abrechnungsposition («01.04.2025 – 30.06.2025: 900.00, 0/91 Tage», «01.07.2025 – 30.09.2025: 900.00, 47/92 Tage»; fr/it/en mit jours/giorni/days).
Worktree: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-226-fach`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Das PDF sagt nicht, wie die Zeilen den Zeitanteil ergeben (nach Beträgen gewichtet); ohne diese Regel kann der Mieter nicht nachrechnen. Heute fehlt bei gewichteten Positionen sogar der Satz zum Leistungszeitraum. |
| V-2 | Verwalter | Minor | Das Szenario nimmt zwei gleich hohe Beträge: ein einfacher Mittelwert der Brüche ergibt dasselbe (25.54 %). Die Gewichtung nach Betrag wird so nicht geprüft. |
| V-3 | Verwalter | Minor | Bei einer Rechnung, die über die Abrechnungsperiode hinausgeht, druckt die Zeile Datum und Betrag des Teils in der Periode, nicht die Werte des Belegs. Der Mieter findet den Beleg so nicht wieder. |
| V-4 | Verwalter | Minor | Wohnungsanteil × gedruckter Prozentwert (zwei Stellen) ergibt nicht genau «Ihr Anteil»: bis 7 Rappen Abweichung bei einem Wohnungsanteil von CHF 2'000. |
| V-5 | Verwalter | Minor | Der Plan («mit gespeicherten Teilen nie der Rückfall») widerspricht Regel 5 der Anforderungen (Mieter über die ganze Periode: «365/365 Tage»). Ausserdem nennt Regel 5 die neuen Zeilen nicht. |
| V-6 | Verwalter | Minor | Bei Gutschriften ergibt sich ein Zeitanteil von 0 % (Summe null) oder über 100 %. Die neuen Zeilen machen das sichtbar und widersprüchlich. Bestand schon vorher (`rentalShare`). |
| V-7 | Verwalter | Nit | Zum Layout: Zeilen direkt unter der Abrechnungsposition, beim Seitenumbruch mit ihr zusammen; offen ist, ob Rechnungen mit demselben Leistungszeitraum zu einer Zeile zusammengefasst werden. |
| V-8 | Verwalter | Nit | Ohne Lieferant oder Beschreibung lässt sich eine Zeile bei der Belegeinsicht nur über Datum und Betrag einem Beleg zuordnen. |

Mietrecht: kein Befund. Das Gesetz schreibt keine Form für die Darstellung des Zeitanteils vor (siehe «Bestätigt» und «Nicht bestätigt»). Die Zeilen machen die Abrechnung besser nachvollziehbar, und für den Mieter ist nichts unzulässig.

## Bestätigt

**Arithmetik** (nachgerechnet mit der Formel aus `calculation.service.ts:131-140` und `days`, Zeile 125):
- 01.04.–30.06.2025 = 91 Tage, 01.07.–30.09.2025 = 92 Tage, 15.08.–30.09.2025 = 47 Tage, 15.08.–31.12.2025 = 139 Mietstage.
- (900 × 0/91 + 900 × 47/92) / 1800 = 459.7826 / 1800 = 0.255435, gedruckt «25.54 %». Stimmt.
- Grenzfall Mieterwechsel: Ein Vormieter vom 01.01. bis 14.08.2025 trägt (900 × 91/91 + 900 × 45/92) / 1800 = 74.46 %. Zusammen mit Lea Graf sind das genau 100 %. Kein Tag wird doppelt oder gar nicht verrechnet; Leerstand trägt der Vermieter (Regel 4).
- Grenzfall Mieter über die ganze Periode: 100 %.
- Der Rückfall «139/365 Tage» (0.38082) greift im Szenario nicht. Das Szenario prüft C-5 also nicht, siehe V-5.

**Gedruckter Betrag:** Richtig ist der Betrag der Rechnung **in der Periode für die Liegenschaft**, wie geplant. Nicht richtig wären das Total der Rechnung oder ein Betrag nach dem Wohnungsanteil.
- Begründung: Alle Rechnungen einer Abrechnungsposition haben denselben Verteilschlüssel (Gruppierung nach Kategorie und Verteilschlüssel, `calculation.service.ts:115`). Der Bruch der Wohnung ist darum ein gemeinsamer Faktor und kürzt sich aus dem Gewicht heraus. Mit den Beträgen auf Ebene der Liegenschaft ergibt sich derselbe Zeitanteil wie auf Ebene der Wohnung.
- Die Summe der Zeilen (900 + 900) ist die Spalte «Kosten Liegenschaft» (1800). Der Mieter kann also auch diese Spalte nachprüfen.
- Gewichtet werden die auf Rappen gerundeten Beträge in der Periode (`invoice.service.ts:429`). Damit stimmen die Zeilen mit dem gespeicherten Zeitanteil überein.

**Begriff «Tage»:** Er entspricht dem bestehenden Bruch «{days}/{total} Tage» (`pdf.service.ts:75`) und Regel 5 der Anforderungen («Das PDF druckt einen Zeitanteil nach Tagen als Bruch «x/y Tage»: y sind die Tage, die die Rechnungen der Abrechnungsposition in der Periode abrechnen …, x die Mietstage darin»). fr/it/en: «jours», «giorni», «days» wie in `pdf.service.ts:144`, `:213`, `:282`.
- «Leistungszeitraum» und «Mietstage» stehen im Glossar (`UBIQUITOUS_LANGUAGE.md:58`, `:137`).
- «Zeitanteil» fehlt im Glossar. Das ist schon als `TODO(fachlich prüfen, #75)` erfasst (`pdf.service.ts:31`); kein neues Issue nötig.
- Die Datumsspanne «01.04.2025 – 30.06.2025» hat dieselbe Form wie `tenancyLine` (`pdf.service.ts:78`).

**Gesetz (Fedlex, Wortlaut).** Die Nummern der Absätze sind im Fedlex-HTML hochgestellt. Quellen: OR in der Fassung vom 01.10.2026, VMWG in der Fassung vom 01.10.2025.
- Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- Art. 257b Abs. 2 OR: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»
- Art. 4 Abs. 1 VMWG: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»
- Art. 8 Abs. 2 VMWG: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»
- Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»

Die Zeilen ordnen jede Rechnung der Zeit zu, in der der Mieter die Leistung tatsächlich genutzt hat, und erleichtern die Belegeinsicht. Keine dieser Normen verlangt oder verbietet eine bestimmte Darstellung.

**Ort der Zeilen:** In der Kostenaufstellung, direkt unter der Abrechnungsposition, nicht in den Hinweisen.
- Begründung: In der Praxis von Treuhändern stehen die Belege einer Kostenart bei dieser Kostenart (Anforderungen Zeile 116, Kostenaufstellung je Kategorie; Zeile 76, Belegliste mit Leistungszeitraum).
- In den Hinweisen müsste der Mieter jede Zeile erst einer Abrechnungsposition zuordnen.
- Die allgemeine Rechenregel gehört dagegen in die Erläuterung unter der Tabelle (`sharesNote`, V-1).

**Wohnungsanteil-Schritt:** Eine zusätzliche Zeile braucht es nicht. Die Abrechnungsposition zeigt schon Wohnungsanteil, Zeitanteil und «Ihr Anteil», und Ihr Anteil = gerundeter Wohnungsanteil × Zeitanteil (Anforderungen Zeile 94). Es fehlt nur die Rechenregel (V-1), und der Prozentwert ist gerundet (V-4).

## Befunde

### V-1 (Major): Rechenregel für die Gewichtung fehlt im PDF

**Beleg:**
- `pdf.service.ts:88-89`: Die Erläuterung lautet «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode{days}{heating}». `{days}` wird zu «; bei einer Rechnung mit Leistungszeitraum Ihre Mietstage darin von dessen Tagen in der Periode».
- `pdf.service.ts:628`: `otherDays` setzt `item.shareDays` voraus. Eine gewichtete Position hat keine `shareDays` (`calculation.service.ts:148-149` gibt `noDays` zurück). Druckt die Abrechnung nur gewichtete Positionen, fehlt darum selbst dieser Satz.
- Nirgends steht, dass mehrere Rechnungen nach ihrem Betrag gewichtet werden.

**Warum falsch:** Done means von #226 verlangt, dass der Mieter den Zeitanteil «from the PDF alone» nachrechnen kann. Aus «0/91 Tage» und «47/92 Tage» liest ein Laie nicht ab, wie er sie verbinden soll. Ein Mittelwert, eine Summe der Tage (47/183 = 25.68 %) und eine Gewichtung nach Betrag sind gleich plausibel. Nur die letzte ist richtig. Anforderungen Zeile 39 verlangt, dass der Anteil des Mieters «nachvollziehbar» ausgewiesen ist.

**Behebung:** Ein eigener Satz in der Erläuterung, sobald eine Position Teile hat. Vorschlag de:

> «; bei Rechnungen über verschiedene Leistungszeiträume trägt jede Rechnung mit ihrem Betrag bei: Summe aus Betrag × Ihre Mietstage / Tage, geteilt durch die Kosten Liegenschaft (die Rechnungen stehen unter der Abrechnungsposition)»

fr/it/en sinngemäss mit den Begriffen aus `docs/design/i18n-begriffe.md` (période de prestation, periodo di prestazione, service period). Alternativ als Formelzeile direkt unter den Rechnungen: «(900.00 × 0/91 + 900.00 × 47/92) / 1'800.00 = 25.54 %». Für Laien ist das am klarsten, und das Problem des Mittelwerts aus V-2 tritt dann gar nicht auf. Ein Test muss prüfen, dass der Satz auch erscheint, wenn keine Position `shareDays` hat.

### V-2 (Minor): Szenario prüft die Gewichtung nicht

**Beleg:** `statement-detail.feature:266-267`: beide Rechnungen über 900. Der Mittelwert (0/91 + 47/92) / 2 = 0.255435 ist dasselbe wie das gewichtete Mittel, also ebenfalls «25.54 %».

**Warum falsch:** Ein falsches Gewicht (Mittelwert statt Betrag) bliebe grün. Die Begründung im Kommentar (Zeile 258-259, «nach den Beträgen gewichtet») hätte so keinen Prüfwert.

**Behebung:** Unterschiedliche Beträge, z. B. 600 (Q2) und 1200 (Q3):
- Gewichtet: (600 × 0/91 + 1200 × 47/92) / 1800 = 613.04 / 1800 = 34.06 %.
- Mittelwert: 25.54 %. Summe der Tage: 47/183 = 25.68 %.

Die Erwartungen wären dann «34.06 %», «01.04.2025 – 30.06.2025: 600.00, 0/91 Tage» und «01.07.2025 – 30.09.2025: 1'200.00, 47/92 Tage». Dabei wird auch das Tausendertrennzeichen geprüft.

### V-3 (Minor): Zeile zeigt den Teil in der Periode, nicht den Beleg

**Beleg:**
- `invoice.service.ts:426-429`: `inPeriod` beschneidet Beginn und Ende auf die Periode und rechnet den Betrag anteilig. Laut Plan druckt die Zeile genau diese Werte («amount in the period»).
- Beispiel: Beleg 01.10.2025 – 31.03.2026 über CHF 1'820.00, Abrechnung 2025. Die Zeile zeigt «01.10.2025 – 31.12.2025: 920.00, x/92 Tage».

**Warum falsch:** Bei der Belegeinsicht (Art. 257b Abs. 2 OR, siehe oben) findet der Mieter keinen Beleg über 920.00 vom 01.10.2025 bis 31.12.2025. Die Erläuterung sagt zwar allgemein «eine Rechnung mit Leistungszeitraum zählt mit den Tagen, die in die Periode fallen» (`pdf.service.ts:88`), aber an der Zeile ist der Teil in der Periode nicht als solcher erkennbar. Für das Nachrechnen des Zeitanteils ist der Teil in der Periode trotzdem richtig.

**Behebung:** Ragt der Leistungszeitraum über die Periode hinaus, zusätzlich den Beleg nennen. Vorschlag: «01.10.2025 – 31.03.2026 (Rechnung 1'820.00), davon 01.10.2025 – 31.12.2025: 920.00, 47/92 Tage». Sonst die Zeile wie geplant. Wenn das zu viel Umfang ist: als offene Arbeit erfassen (Issue `fachlich`).

### V-4 (Minor): Gerundeter Prozentwert geht nicht auf

**Beleg:** Nachgerechnet; `tenantShare = roundToRappen(apartmentShare × periodShare)` mit ungerundetem Anteil (`calculation.service.ts:343`). Gedruckt wird `formatShare` mit zwei Stellen (`pdf.service.ts:398`).

| Wohnungsanteil | Ihr Anteil (exakt) | × 25.54 % |
|---|---|---|
| 450.00 | 114.95 | 114.93 |
| 900.00 | 229.89 | 229.86 |
| 2'000.00 | 510.87 | 510.80 |

**Warum falsch:** Anforderungen Zeile 94 verlangt, dass «die Zeile mit dem Taschenrechner aufgeht». Mit dem Prozentwert geht sie nicht auf, mit den Brüchen der Zeilen schon (229.89).

**Behebung:** In der Erläuterung aus V-1 sagen, dass der Prozentwert gerundet ist und Ihr Anteil mit den Brüchen der Rechnungen gerechnet wird. Oder die Formelzeile aus V-1 drucken. Nicht empfohlen: mehr Nachkommastellen, das überfordert Laien.

### V-5 (Minor): Plan widerspricht Regel 5 (ganze Periode), Regel 5 nennt die Zeilen nicht

**Beleg:**
- `docs/nebenkostenabrechnung-anforderungen.md:145`: «Eine Abrechnungsposition aus Rechnungen über verschiedene Tage … zeigen den Anteil in Prozent (#208, #226); mietet der Mieter die ganze Periode, zeigt erstere seine Mietstage von den Tagen der Periode (z. B. «365/365 Tage»)».
- Plan (`implementation_plan.md`, Session 15): «positions with stored parts never use the fallback».
- Ein Mieter über die ganze Periode bekäme damit «100.00 %» statt «365/365 Tage».

**Warum falsch:** Plan und Anforderung schreiben zwei verschiedene Darstellungen vor. Fachlich ist «100.00 %» mit den Zeilen darunter («91/91 Tage», «92/92 Tage») genauer: Rechnen die Rechnungen nur 183 Tage ab, ist «365/365» nicht der tatsächliche Nenner. Das Szenario deckt C-5 nicht ab (der Rückfallwert 139/365 = 38.08 % liegt weit von 25.54 %).

**Behebung:**
- Regel 5 in derselben Änderung anpassen: Zeilen je Rechnung unter der Abrechnungsposition, Prozentwert auch bei einem Mieter über die ganze Periode, kein Rückfall bei gespeicherten Teilen.
- C-5 mit einem Test auf tieferer Ebene belegen, mit Beträgen im Verhältnis der Tage. Beispiel: 1'810.00 für 01.01.–30.06. (181 Tage) und 1'840.00 für 01.07.–31.12. (184 Tage), Einzug 15.08. Der gewichtete Anteil ist dann genau 139/365, und der Test prüft, dass «38.08 %» mit den Zeilen gedruckt wird und nicht «139/365 Tage».
- Weicht das von einer Entscheidung des Product Owners in #208 ab: `entscheiden`.

### V-6 (Minor, Bestand): Gutschriften ergeben einen Zeitanteil von 0 % oder über 100 %

**Beleg:** `calculation.service.ts:132-133` (`if (group.totalAmount === 0) return 0;`, mit ponytail-Kommentar). Nachgerechnet:
- Rechnung Q3 900 und Gutschrift Q2 −900, Einzug 15.08.: Zeitanteil 0 %, Ihr Anteil 0.00. Nach den Tagen trägt der Mieter aber 900 × 47/92 = 459.78 auf Ebene der Liegenschaft, mal den Bruch der Wohnung.
- Rechnung Q3 900 und Gutschrift Q2 −600, Einzug 01.07.: Zeitanteil 300 % (mal Wohnungsanteil von 300 = Bruch × 900, rechnerisch richtig).

**Warum falsch:** Neu stünden darunter Zeilen wie «900.00, 47/92 Tage», während der Zeitanteil 0 % beträgt. Das ist auf dem PDF widersprüchlich. Bei Summe null verliert der Vermieter den Betrag; zulasten des Mieters geht das nicht. Bei über 100 % stimmt das Ergebnis, sieht für Laien aber wie ein Fehler aus.

**Behebung:** Als offene Arbeit erfassen (Issue `fachlich`). Fachlich richtig wäre «Ihr Anteil» als Summe über die Rechnungen (Bruch der Wohnung × Betrag × Tage / Tage des Leistungszeitraums), unabhängig vom Total. Für #226 genügt, dass die Zeilen bei Summe null nicht gedruckt werden oder das Issue sie nennt.

### V-7 (Nit): Layout der Zeilen

**Beleg:** `pdf.service.ts:592-596`: `row(...)` je Position, `room()` bricht vor einer Zeile um.

**Empfehlung:**
- Zeilen eingerückt in der Spalte «Kategorie» bis vor «Ihr Anteil», in der Farbe `muted` wie die Erläuterung.
- Die Zeilen bleiben beim Seitenumbruch mit ihrer Abrechnungsposition zusammen.
- Mehrere Rechnungen mit demselben Leistungszeitraum: entweder zusammenfassen (Summe, eine Zeile) oder bewusst je Rechnung drucken. Beides ist fachlich richtig; je Rechnung passt besser zur Belegeinsicht.
- Eine Rechnung ohne Leistungszeitraum in einer gemischten Position erscheint mit den Daten der Periode (`invoice.service.ts:426`). Das ist richtig, sollte aber im Test vorkommen.

### V-8 (Nit): Zuordnung zum Beleg

**Beleg:** Die geplante Zeile nennt nur Datum, Betrag und Tage. Anforderungen Zeile 76 schlägt eine Belegliste mit «Datum, Lieferant, Betrag, Kategorie, Leistungszeitraum» vor.

**Empfehlung:** Optional die Beschreibung der Rechnung ergänzen. «Belegliste» ist nicht im Glossar (Anforderungen Zeile 135) und gehört nicht in dieses Issue.

## Fehlende Begriffe

- «Zeitanteil»: nicht im Glossar, schon in #75 erfasst. Kein neues Issue.
- Kein weiterer Begriff fehlt, solange die Zeilen nur «Tage», «Leistungszeitraum», «Mietstage» und «Kosten Liegenschaft» verwenden. Der Vorschlag in V-1 tut das.
- Neu wäre ein Glossarbegriff erst, wenn die Zeilen eine eigene Bezeichnung bekommen (z. B. «Rechnungen dieser Abrechnungsposition»). Vorschlag dann: **Rechnungsanteil**: «Teil einer Rechnung, der in die Abrechnungsperiode fällt, mit den Mietstagen des Mieters darin.» Issue mit den Labels `fachlich` und `entscheiden`, nur falls der Begriff verwendet wird.

## Nicht bestätigt

- **Gesetzliche Pflicht zur Darstellung:** Keine Norm auf Fedlex regelt, wie ein Zeitanteil auf der Abrechnung darzustellen ist. Durchsucht: OR Art. 257a, 257b, VMWG Art. 4, 5, 8. Ebenso wenig ist belegt, dass eine Gewichtung nach Betrag rechtlich geboten ist; sie folgt aus der Periodengerechtigkeit (Anforderungen Zeile 30, dort unsicher-B für Kosten ausser Brennstoffen). **unsicher.**
- **Rechnungen über die Periodengrenze (V-3):** Dass Praxis oder Rechtsprechung für solche Rechnungen den Ausweis des Originalbelegs verlangen, wurde nicht gefunden. Gesucht über `mmx search`, nur Ratgeber-Treffer zur Belegeinsicht allgemein.
- **Andere Rechnungen im Szenario:** Ob das Gebäude «Lindenhof» im Szenario keine weitere Hauswart-Rechnung für 2025 hat, wurde nur in der Grundlage geprüft (`statement-detail.feature:8-29`: nur eine Heizkostenrechnung 2024). Der E2E-Lauf ist Sache des Aufrufers.
- **Bestehendes Issue zu V-6:** Ob es schon eines gibt, wurde nicht geprüft (kein Zugriff auf die Issues in diesem Review).
- **Texte fr/it/en:** Nur die Begriffe für «Tage» geprüft (`pdf.service.ts:144`, `:213`, `:282`). Die endgültigen Texte liegen noch nicht vor.
