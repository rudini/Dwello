# Ubiquitous Language - Dwello

Die Ubiquitous Language (nach Eric Evans, Domain-Driven Design) definiert ein gemeinsames Vokabular zwischen Entwicklern und Fachexperten. Alle Begriffe in diesem Glossar sind verbindlich und sollen konsistent in Code, Dokumentation, UI und Kommunikation verwendet werden.

> **Konvention:** Deutsch ist die kanonische Domänensprache. Englische Code-Bezeichner sind in Klammern angegeben, wo sie vom deutschen Begriff abweichen.

---

## Liegenschaftsverwaltung (Kernentitäten)

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Gebäude** | Wohn- oder Mischgebäude mit Adresse, PLZ, Ort, Kanton, Baujahr und Gebäudetyp. Zentrale Entität, der alle Wohnungen zugeordnet sind. | `buildings` Tabelle |
| **Liegenschaft** | Synonym für Gebäude im Verwaltungskontext. | — |
| **Gebäudetyp** | Klassifikation: Mehrfamilienhaus, Einfamilienhaus, Geschäftshaus, Gewerbegebäude, Mischnutzung. | `building_type` Feld |
| **Baujahr** | Jahr der Erstellung des Gebäudes. | `year_built` Feld |
| **Wohnung** | Einzelne Mieteinheit innerhalb eines Gebäudes. Besitzt Wohnungsnummer, Stockwerk, Fläche (m²) und Zimmeranzahl. | `apartments` Tabelle |
| **Wohnungsnummer** | Bezeichnung der Wohnung im Gebäude (z.B. 3.01), pro Gebäude eindeutig. | `number` Feld |
| **Stockwerk** | Lage der Wohnung: UG, EG, 1. OG, 2. OG usw. | `floor` Feld (Zahl: -1 = UG, 0 = EG) |
| **Fläche** | Nettowohnfläche in Quadratmetern (m²). Grundlage für flächenbasierte Verteilschlüssel. | `area` Feld |
| **Zimmeranzahl** | Anzahl Zimmer (z.B. 3.5 Zimmer). Schweizer Konvention mit halben Zimmern. | `rooms` Feld |
| **Mietstatus** | Status einer Wohnung: Vermietet (`occupied`, ein Vertrag läuft), Vermietet ab {Datum} (`relet`, nur ein künftiger Vertrag ist abgeschlossen), Leer (`vacant`), Gesperrt (`reserved`). «Vermietet bis {Datum}» ist kein eigener Mietstatus, sondern zeigt das Vertragsende des laufenden Mietvertrags an, solange kein Mietvertrag ab dem Tag danach erfasst ist. **Leer:** Es gibt keinen laufenden und keinen künftigen Mietvertrag; die Wohnung kann vermietet werden. **Gesperrt:** Der Vermieter hat die Wohnung gesperrt, z.B. während einer Renovation. | `status` Feld |
| **Mieter** | Person, die eine Wohnung mietet. Enthält Name, Kontaktdaten, Korrespondenzadresse, Korrespondenzkanal und Sprache. Aktiv mit laufendem Mietvertrag, künftig mit nur einem künftigen Mietvertrag, ehemalig, wenn alle seine Mietverträge beendet sind; ein Mieter ohne Mietvertrag hat keinen dieser Status. | `tenants` Tabelle |
| **Korrespondenzadresse** | Adresse des Mieters (mit Land, Vorgabe Schweiz), an die Abrechnungen und Mahnungen gehen. Nach dem Auszug trägt der Vermieter die neue Adresse ein. | `address`, `postal_code`, `city` Felder; Land geplant (#102) |
| **Korrespondenzkanal** | Wie der Mieter Post erhält: Brief (`letter`) oder E-Mail (`email`). | `correspondence_channel` Feld |
| **Vermieter** | Eigentümer oder Liegenschaftsverwalter, der die Wohnung vermietet. | — |
| **Liegenschaftsverwalter** | Person oder Firma, die Gebäude im Auftrag des Eigentümers verwaltet. Primärer Benutzer von Dwello. | — |

---

## Mietvertrag

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Mietvertrag** | Rechtliche Vereinbarung zwischen Mieter und Vermieter über die Nutzung einer Wohnung. | `rental_contracts` Tabelle |
| **Vertragsbeginn** | Startdatum des Mietverhältnisses. | `start_date` Feld |
| **Vertragsende** | Letzter Tag des Mietverhältnisses. Bei einem befristeten Vertrag das vereinbarte Ende, bei einem gekündigten unbefristeten Vertrag der Kündigungstermin; leer bei einem unbefristeten, ungekündigten Vertrag. | `end_date` Feld |
| **Befristet / Unbefristet** | Befristet: Der Vertrag endet ohne Kündigung am vereinbarten Vertragsende; bleibt der Mieter danach und lässt ihn der Vermieter bleiben, ohne zu widersprechen, gilt er als unbefristet (stillschweigende Fortsetzung, Art. 266 Abs. 2 OR). Unbefristet: Der Vertrag läuft, bis er gekündigt wird. | `end_date`, `terminated` |
| **Auszug bestätigt** | Der Vermieter hat bestätigt, dass der Mieter nach dem vereinbarten Vertragsende eines befristeten Mietvertrags ausgezogen ist. Dwello fragt dann nicht mehr, ob der Mietvertrag unbefristet weiterläuft. Ändert sich das Vertragsende, fällt die Bestätigung weg. | `moved_out` Feld |
| **Kündigungstermin** | Tag, auf den ein unbefristeter Mietvertrag gekündigt werden kann (ortsübliche Termine oder laut Mietvertrag). Ist der Vertrag gekündigt, der Tag, auf den gekündigt wurde. Von der Kündigung bis zu diesem Tag läuft der Vertrag weiter und heisst **gekündigt**. | `end_date` mit `terminated = true` |
| **Kündigung aufheben** | In Dwello: Der gekündigte Vertrag wird wieder unbefristet ohne Vertragsende, wenn Mieter und Vermieter die Kündigung im Einvernehmen zurücknehmen oder die Schlichtungsbehörde oder ein Gericht sie für ungültig erklärt. Nach dem Eingang kann eine Kündigung nicht einseitig zurückgenommen werden. | `end_date: null` |
| **Kündigungsfrist** | Zeit zwischen dem Eingang der Kündigung und dem Kündigungstermin. Für Wohnungen mindestens 3 Monate auf einen ortsüblichen Termin, oder länger, wenn der Mietvertrag es vorsieht (Art. 266a, 266c OR). Kommt die Kündigung zu spät, gilt sie auf den nächsten Termin. Für ausserordentliche Kündigungen (z.B. Zahlungsrückstand, Art. 257d OR) gelten andere Fristen. | — |
| **Vertragsstatus** | Laufend, künftig oder beendet, abgeleitet aus Vertragsbeginn und -ende. | Berechnung |
| **Nachmieter** | Mieter, dessen Mietvertrag für dieselbe Wohnung nach dem Vertragsende eines gekündigten oder befristeten Mietvertrags beginnt. | — |
| **Ersatzmieter** | Zumutbarer, zahlungsfähiger neuer Mieter, den der Mieter bei vorzeitiger Rückgabe vorschlägt und der bereit ist, den Mietvertrag zu den gleichen Bedingungen zu übernehmen (Art. 264 Abs. 1 OR). | — |
| **Mieterwechsel** | Ein Mietvertrag einer Wohnung endet, und ein neuer Mietvertrag mit einem anderen Mieter beginnt. Jeder Mietvertrag erhält seine eigene Nebenkostenabrechnung. | — |
| **Hinweis auf fehlende Abrechnungen** | Warnung, die die Tage ohne Abrechnung eines Mietvertrags nennt: eine ganze beendete Abrechnungsperiode mit ihrem Namen (z.B. 2023), sonst mit den Daten; seit Vertragsbeginn, bei «Abgerechnet bis» ab dem Tag danach. | — |
| **Abgerechnet bis** | Datum am Mietvertrag: Bis zu diesem Tag sind die Nebenkosten ausserhalb von Dwello abgerechnet. Abrechnungsläufe und der Hinweis auf fehlende Abrechnungen übergehen Abrechnungsperioden, die bis dahin enden; reicht eine Abrechnungsperiode darüber hinaus, zählen Mietstage und geleistete Akontobeiträge erst ab dem Tag danach. | `billed_until` Feld |
| **Nettomiete** | Monatliche Grundmiete in CHF (ohne Nebenkosten). Auch: Mietzins. | `base_rent` Feld |
| **Zusatzmiete** | Zusätzliche monatliche Kosten (Garage, Parkplatz, Keller). | `additional_rent` Feld |
| **Akonto** | Monatlicher Vorschuss des Mieters für Nebenkosten. Wird mit der Nebenkostenabrechnung verrechnet. | `monthly_advance_payment` Feld |
| **Nebenkostenpauschale** | Fester Betrag des Mieters für im Mietvertrag vereinbarte Nebenkosten. Sie wird nicht abgerechnet: keine Nachzahlung und keine Rückerstattung. Für ihre Höhe ist auf Durchschnittswerte dreier Jahre abzustellen (Art. 4 Abs. 2 VMWG). Nicht zu verwechseln mit der Verwaltungspauschale. Dwello erfasst sie im Mietvertrag als «Nebenkostenpauschale pro Monat» und zählt sie im Monatlich total. Nebenkosten, die der Mieter pauschal bezahlt, erhalten bei «Vereinbarte Nebenkosten» kein Häkchen. Zahlt der Mieter alle Nebenkosten pauschal, hat sein Mietvertrag in Dwello kein Akonto und kein Häkchen. | `flat_rate_utility_charge` Feld (#66, #429) |
| **Monatlich total** | Nettomiete + Zusatzmiete + Akonto + Nebenkostenpauschale: der Betrag, den der Mieter laut Mietvertrag jeden Monat bezahlt. Das Akonto ist ein Vorschuss, den die Nebenkostenabrechnung abrechnet; die Nebenkostenpauschale rechnet sie nicht ab. | Berechnung |
| **Referenzindex** | Schweizer Referenzzinssatz für die Mietzinsindexierung. | `reference_index` Feld |
| **Vereinbarte Nebenkosten** | Die Kategorien, die der Mietvertrag dem Mieter als Nebenkosten auferlegt (Art. 257a Abs. 2 OR). Nur sie fliessen in seine Nebenkostenabrechnung; den Anteil seiner Wohnung an den übrigen trägt der Vermieter. Ein neuer Mietvertrag beginnt mit allen umlagefähigen Kategorien angekreuzt. Für eine Kategorie, die danach umlagefähig wird oder neu erfasst wird, ist beim Mietvertrag noch nichts angegeben: Dwello rechnet sie nicht ab und fragt im Abrechnungslauf nach, sobald sie Kosten hat. | `contract_categories` Tabelle (`agreed`) |
| **Nicht vereinbart** | Der Liegenschaftsverwalter hat angegeben, dass der Mietvertrag die Kategorie nicht vorsieht; Dwello fragt nicht mehr nach. | `agreed = false` |
| **Vereinbart ab** | Tag, ab dem eine Kategorie im Mietvertrag vereinbart ist, z.B. weil der Vermieter sie mit dem amtlichen Formular neu eingeführt hat (Art. 269d Abs. 3 OR). Leer: ab Vertragsbeginn. Dwello rechnet die Kategorie nur für die Tage ab diesem Datum ab. | geplant (#407) |
| **Vereinbarte Verwaltungspauschale** | Ob der Mietvertrag eine Verwaltungspauschale vereinbart: «Ja, zum Satz des Abrechnungslaufs», «Ja, mit eigenem Satz» oder «Nein». Pflichtwahl beim Erfassen eines Mietvertrags, ohne Vorgabe. Bestehende Mietverträge gelten als «Nein», bis der Vermieter einträgt, was der Mietvertrag sagt. Eine neue Verwaltungspauschale während des Mietverhältnisses braucht das amtliche Formular (Art. 269d Abs. 3 OR). | `management_fee_agreed` Feld |
| **Eigener Satz** | Prozentsatz der Verwaltungspauschale, der im Mietvertrag steht; geht dem Satz des Abrechnungslaufs vor. Grösser als 0 bis 10 %. | `management_fee_percent` Feld; «grösser als 0» geplant (#402) |
| **Mietzinsdepot** | Sicherheit in Geld, die der Mieter leistet und die der Vermieter bei einer Bank auf einem Sparkonto oder Depot auf den Namen des Mieters hinterlegt; bei Wohnräumen höchstens drei Monatszinse (Art. 257e OR). Dwello erfasst es nicht. | — |
| **Freigabe des Mietzinsdepots** | Die Bank gibt das Mietzinsdepot heraus: mit Zustimmung beider Parteien, gestützt auf einen rechtskräftigen Zahlungsbefehl oder ein rechtskräftiges Gerichtsurteil. Hat der Vermieter innert einem Jahr nach Ende des Mietverhältnisses keinen Anspruch rechtlich geltend gemacht, kann der Mieter es von der Bank zurückverlangen (Art. 257e Abs. 3 OR). In der Oberfläche «bis das Mietzinsdepot freigegeben ist». | — |

---

## Rechnungswesen

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Rechnung** | Forderung eines Rechnungsstellers für Leistungen oder Lieferungen am Gebäude (z.B. Hauswartung, Heizöl); ihre hochgeladene Datei ist der Beleg. | `invoices` Tabelle |
| **Lieferant / Rechnungssteller** | Firma oder Person, die die Rechnung ausstellt. | `billing_entity_name` Feld |
| **Rechnungsnummer** | Nummer der Rechnung beim Lieferanten. | `invoice_number` Feld |
| **Rechnungsdatum** | Datum der Rechnungsstellung. | `invoice_date` Feld |
| **Leistungszeitraum** | Zeitraum, für den eine Rechnung gilt (Beginn und Ende oder keines von beiden). | `service_period_start`, `service_period_end` |
| **Betrag** | Rechnungsbetrag in CHF. | `amount` Feld |
| **Fälligkeitsdatum** | Datum, bis zu dem die Rechnung bezahlt werden muss. | `due_date` Feld |
| **Zahlungsdatum** | Datum der tatsächlichen Bezahlung. | `paid_date` Feld |
| **Beschreibung** | Beschreibung der erbrachten Leistung auf der Rechnung. | `description` Feld |
| **Umlagefähige Rechnung** | Die Rechnung fliesst in die Nebenkostenabrechnung ein. | `is_valid_utility_cost` Feld |
| **Abgerechnet (Rechnung)** | Die Rechnung ist in einer Nebenkostenabrechnung enthalten, gleich welchen Status diese hat (Entwurf, versendet, bezahlt oder ersetzt). | Berechnung |
| **Gutschrift (eines Rechnungsstellers)** | Dokument eines Rechnungsstellers, das einen Betrag zurückerstattet oder eine Rechnung mindert. Senkt die tatsächlichen Aufwendungen (Art. 257b Abs. 1 OR); Dwello erfasst sie nicht als eigene Rechnung, sondern zieht sie vom Betrag der zugehörigen Rechnung ab. Ist diese Rechnung schon abgerechnet, braucht es eine berichtigte Abrechnung. Nicht zu verwechseln mit der Rückerstattung an den Mieter. | — |
| **Akontorechnung (eines Rechnungsstellers)** | Teilrechnung eines Rechnungsstellers über einen Vorschuss auf seine Leistungen; die Schlussrechnung zieht sie ab. In Dwello wird die Schlussrechnung mit dem Total der Leistungen und dem Leistungszeitraum laut Beleg erfasst; erfasste Akontorechnungen werden gelöscht, auch abgerechnete, und ihre Abrechnungen werden neu berechnet (Entwurf) oder berichtigt. Nicht zu verwechseln mit dem Akonto des Mieters. | — |
| **Schlussrechnung (eines Rechnungsstellers)** | Rechnung eines Rechnungsstellers über das Total seiner Leistungen, die seine Akontorechnungen abzieht. Dwello erfasst sie mit dem Total vor dem Abzug. | — |
| **Mahnung eines Rechnungsstellers** | Zahlungserinnerung zu einer Rechnung; Mahngebühren und Verzugszinsen sind keine Nebenkosten. Nicht zu verwechseln mit der Mahnung an einen Mieter. | — |
| **Beleg** | Hochgeladene Datei einer Rechnung (Scan, Foto oder PDF), höchstens eine pro Rechnung. Wird mit der Rechnung gelöscht. Erleichtert die Belegeinsicht des Mieters (Art. 257b Abs. 2 OR); die Originalrechnung bewahrt der Liegenschaftsverwalter auf. | `invoice_documents` Tabelle |

---

## Nebenkostenkategorien

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Kategorie** | Klassifikation der Kostenart. Bestimmt, ob Kosten auf Mieter umgelegt werden dürfen. | `categories` Tabelle (`name_de`, `name`) |
| **Heizkosten (Kategorie)** | Kategorie für die Kosten der Heizung (z.B. Heizung, Kaminfeger). Separat abgerechnetes Warmwasser gehört nicht dazu. | `is_heating_cost` Feld |
| **Brennstoff (Kategorie)** | Merkmal einer umlagefähigen Heizkosten-Kategorie: Ihre Rechnungen sind Lieferungen von Heizmaterial (z.B. Heizöl, Pellets). Nur eine solche Kategorie hat einen Tankbestand. | `is_fuel` Feld |
| **Vordefinierte Kategorie** | Mit Dwello gelieferte Kategorie (die mit Namen genannten Kategorien der Listen unter «Umlagefähig» und «Nicht umlagefähig»); Gegenstück zur eigenen Kategorie des Liegenschaftsverwalters. In der Oberfläche «Von Dwello». | `type = 'predefined'` |
| **Eigene Kategorie** | Kategorie, die der Liegenschaftsverwalter erfasst hat. | `type = 'custom'` |
| **Umlagefähigkeit** | Ob die Kosten einer Kategorie in die Nebenkostenabrechnung fliessen können (Art. 257b OR, Art. 4–6c VMWG); bezahlen muss der Mieter sie nur, wenn der Mietvertrag sie vorsieht (Art. 257a Abs. 2 OR). Beim Erfassen Pflichtwahl, ohne Vorgabe. | `is_allowed_utility_cost` Feld |
| **Grund der Umlagefähigkeit** | Fester Satz einer vordefinierten Kategorie, warum ihre Kosten umlagefähig sind oder nicht, mit dem Gesetzesartikel. Entfällt, sobald der Liegenschaftsverwalter die Umlagefähigkeit ändert. Nicht zu verwechseln mit dem Grund der Änderung. | — |
| **Vollservicevertrag (Lift)** | Vertrag mit dem Lifthersteller, der neben der Wartung auch Reparaturen und Ersatzteile deckt. Umlagefähig ist nur der Anteil der Wartung; den Rest trägt der Vermieter (Art. 256 Abs. 1 OR). | — |

### Umlagefähig

Heizung, Warmwasser, Kaltwasser, Abwasser, Allgemeinstrom, Hauswart, Lift, Gartenpflege, Schneeräumung, Kehricht, TV/Kabelanschluss, Kaminfeger, sowie eigene Kategorien, die als umlagefähig erfasst sind.

### Nicht umlagefähig

Verwaltung, Reparaturen, Renovation, Liegenschaftssteuer, Hypothekarzinsen, Gebäudeversicherung, Wertvermehrende Investitionen, Schädlingsbekämpfung, Feuerlöscher-Wartung. Diese Kosten trägt der Vermieter. Der Verwaltungsaufwand für die Nebenkosten wird nicht als Rechnung, sondern über die **Verwaltungspauschale** abgerechnet.

---

## KI-Kategorisierung

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Kategorisierung** | Automatischer Vorschlag einer Kategorie für eine Rechnung durch ein Sprachmodell (KI). | `/api/v1/invoices/categorize` |
| **KI-Kategorie** | Von der KI vorgeschlagene Kategorie. | `llm_category_id` Feld |
| **Konfidenz** | Wie sicher die KI bei einem Vorschlag ist (0–100 %), für die Kategorie und für jede ausgelesene Angabe. | `llm_confidence` Feld (0–1) |
| **Auslesen** | Die KI liest Rechnungssteller, Rechnungsnummer, Rechnungsdatum, Fälligkeitsdatum, Leistungszeitraum, Beschreibung und Betrag aus einer hochgeladenen Datei; ihre Werte sind Vorschläge. | — |
| **Vorschlag der KI (Kategorie)** | Einstufung einer neuen Kategorie als umlagefähig oder nicht umlagefähig durch die KI, mit Begründung und Artikel. Nur beim Erfassen; ab Konfidenz 70 %; der Liegenschaftsverwalter entscheidet. | — |
| **Manuell überschrieben** | Der Liegenschaftsverwalter hat die KI-Kategorie geändert. | `was_manually_overridden` Feld |
| **Grund der Änderung** | Begründung, warum die KI-Kategorie überschrieben wurde. | `manual_override_reason` Feld |

---

## Verteilschlüssel

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Verteilschlüssel** | Formel zur Aufteilung der Gebäudekosten auf die einzelnen Wohnungen. | `distribution_keys` Tabelle |
| **Pro Fläche (m²)** | Verteilung proportional zur Fläche. | Vordefiniert, `{area}` |
| **Pro Zimmer** | Verteilung proportional zur Zimmeranzahl. | Vordefiniert, `{rooms}` |
| **Pro Einheit** | Gleichmässige Verteilung auf alle Wohnungen. | Vordefiniert, `{units}` |
| **Heizung (Fläche 70 % / Einheit 30 %)** | Gemischter Schlüssel für Heizkosten: 70 % nach Fläche, 30 % zu gleichen Teilen pro Wohnung. | Vordefiniert, `0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}` |
| **Eigener Verteilschlüssel** | Eigene Formel mit den Variablen `{area}`, `{rooms}`, `{units}`, `{volume}` und ihren Summen über alle Wohnungen des Gebäudes (`{area_total}`, `{rooms_total}`, `{units_total}`, `{volume_total}`). | `formula` Feld |
| **Gleichmässig pro Wohnung** | Verteilung einer Rechnung ohne Verteilschlüssel: gleiche Anteile für alle Wohnungen des Gebäudes (wie „Pro Einheit“). | Berechnung |
| **Wohnungsanteil** | Anteil einer Wohnung an den Gebäudekosten gemäss Verteilschlüssel. | Berechnung |

---

## Heizprofil

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Heizprofil** | Monatliche Prozentverteilung der Heizkosten über 12 Monate. | `heating_profiles` Tabelle |
| **Monatsanteil** | Prozent eines Monats im Heizprofil; die zwölf Monatsanteile ergeben 100 % (auf ±0.1 Prozentpunkte genau). | `january_pct` … `december_pct` |
| **Anteil nach Heizprofil** | Summe der Monatsanteile über die Tage, an denen der Mietvertrag läuft, geteilt durch die Summe der Monatsanteile über die abgerechneten Tage (ohne Leistungszeitraum die Abrechnungsperiode, mit Leistungszeitraum dessen Tage in der Periode). Ein angebrochener Monat zählt mit dem Teil seiner Tage (Monatsanteil × Tage / Tage des Monats). Rechnungen einer Kategorie mit Tankbestand zählen immer über die ganze Periode. Gerechnet aus diesen Monatswerten, auf zwei Stellen gerundet wie im PDF: geplant, #232. | `utility_statements.heating_share` (`percent`); an der Abrechnungsposition `period_share` |
| **Tankbestand** | Wert des Heizmaterials im Tank oder Lager (Öl, Flüssiggas, Pellets, Holz) an einem Stichtag, in CHF. | `fuel_stocks` Tabelle |
| **Stichtag** | Tag, für den ein Tankbestand erfasst wird. Der Tankbestand am Tag vor Beginn der Abrechnungsperiode heisst Anfangsbestand, der an ihrem letzten Tag Endbestand. | `reading_date` Feld |
| **Heizmaterial** | Brennstoff der Heizung im Tank oder Lager (Wort aus Art. 8 Abs. 2 VMWG: «Anfangs- und Endbestand von Heizmaterialien»). | — |
| **Veränderung Tankbestand** | Anfangsbestand minus Endbestand des Heizmaterials im Tank oder Lager. Zusammen mit den Lieferungen der Abrechnungsperiode ergibt sie den Verbrauch, der zu den Heizkosten zählt (Art. 5 Abs. 2 lit. a VMWG). Negativ, wenn der Endbestand höher ist als der Anfangsbestand. | Berechnung |
| **Verbrauch (Heizmaterial)** | Anfangsbestand plus Lieferungen der Abrechnungsperiode minus Endbestand, in CHF; das wird als Heizkosten abgerechnet (Art. 5 Abs. 2 lit. a VMWG). Fehlt der Anfangs- oder Endbestand, rechnet Dwello die Lieferungen ab. | Berechnung |
| **Gebäude ohne Tank** | Merkmal eines Gebäudes: Es hat keinen Tank und kein Lager für Heizmaterial, oder der Tank ist stillgelegt. Der Abrechnungslauf fragt dann nicht nach dem Tankbestand, ausser die Abrechnungsperiode hat noch Heizmaterial (Anfangsbestand über 0) oder einen erfassten Tankbestand mit Stichtag in der Periode. In der Oberfläche «Kein Tank oder Tank stillgelegt». | `no_tank` Feld |
| **Vordefinierte Heizprofile** | Mit Dwello gelieferte Heizprofile: Heizung Mittelland, Heizung Bergregion, Heizung Tessin, Heizung + Warmwasser. | `type = 'predefined'` |
| **Eigenes Heizprofil** | Vom Liegenschaftsverwalter erfasstes Profil. | `type = 'custom'` |

---

## Nebenkostenabrechnung

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Nebenkostenabrechnung** | Abrechnung der tatsächlichen Nebenkosten pro Mietvertrag und Abrechnungsperiode, mindestens jährlich (Art. 4 Abs. 1 VMWG). Vergleicht geleistete Akontobeiträge mit dem effektiven Kostenanteil. | `utility_statements` Tabelle |
| **Abrechnungsnummer** | Nummer einer Nebenkostenabrechnung, NK-{Gebäude}-{Jahr}-NNNN; {Gebäude} sind die ersten acht Zeichen der Kennung des Gebäudes, Jahr = Ende der Abrechnungsperiode; laufend je Gebäude und Jahr. Wird nie zweimal vergeben, die Nummer eines gelöschten Entwurfs bleibt eine Lücke. | `statement_number` Feld, Zähler `statement_numbers` |
| **Abrechnungsdatum** | Datum der Nebenkostenabrechnung. Beim Entwurf der Tag der Erstellung; Dwello setzt es auf den Tag, an dem die Abrechnung als versendet markiert wird. Ab ihm läuft die Zahlungsfrist. Ein Zahlungsdatum davor nimmt Dwello nicht an. | `statement_date` Feld |
| **Abrechnungslauf** | Erstellt die Abrechnungen einer Periode für ausgewählte Gebäude, mit Heizprofil und Satz der Verwaltungspauschale (für Mietverträge mit vereinbarter Verwaltungspauschale ohne eigenen Satz). | Wizard „Abrechnungen erstellen“ |
| **Abrechnungsperiode** | Zeitraum der Abrechnung (z.B. 01.01.-31.12., 01.07.-30.06., 01.11.-31.10.). Die Einstellung «Abrechnungsperiode» (Kalenderjahr, Juli – Juni, November – Oktober) schlägt sie im Abrechnungslauf vor. | `period_start`, `period_end`; Einstellung `accounting_period` (`calendar`, `july-june`, `november-october`) |
| **Tage ohne Abrechnung** | Zusammenhängende Tage einer beendeten Abrechnungsperiode, an denen ein Mietvertrag Mietstage hat und die keine seiner Abrechnungen abdeckt. | Berechnung |
| **Kurze Abrechnungsperiode** | Abrechnungsperiode unter zwölf Monaten für Tage, die keine Abrechnung des Gebäudes abdeckt, z.B. nach einem Wechsel der Einstellung «Abrechnungsperiode». Gilt für alle Mietverträge des Gebäudes. In der Praxis «Rumpfperiode»; in der Oberfläche «kurze Abrechnungsperiode». | geplant (#408) |
| **Abrechnungsposition** | Einzelne Kostenzeile in der Nebenkostenabrechnung (Kategorie, Gesamtbetrag, Mieteranteil). | `utility_statement_line_items` Tabelle |
| **Nebenkosten des Gebäudes** | Summe aller umlagefähigen Rechnungen des Gebäudes in der Abrechnungsperiode. | Berechnung |
| **Kosten des Gebäudes** | Betrag einer Abrechnungsposition für das ganze Gebäude in der Abrechnungsperiode, vor der Verteilung auf die Wohnungen. Eine Rechnung mit Leistungszeitraum zählt mit den Tagen in der Periode, Heizmaterial aus dem Tank mit dem Verbrauch. | Berechnung |
| **Eigene Nebenkosten** | Summe der Mieteranteile aller Abrechnungspositionen einer Abrechnung, vor der Verwaltungspauschale. Auf der Abrechnung: „Zwischensumme“. | Berechnung |
| **Verwaltungspauschale** | Abgeltung des Aufwands für die Nebenkostenabrechnung: ein Prozentsatz der eigenen Nebenkosten des Mieters. Nur zulässig, wenn im Mietvertrag vereinbart (vereinbarte Verwaltungspauschale; sonst 0 %). Üblich sind bis 3 %; ein höherer Satz muss dem tatsächlichen Aufwand entsprechen (Art. 4 Abs. 3 VMWG). Höchstens 10 % (Plausibilitätsgrenze, kein Rechtssatz). | `management_fee`, `management_fee_percent` |
| **Satz des Abrechnungslaufs** | Prozentsatz der Verwaltungspauschale, den der Liegenschaftsverwalter im Abrechnungslauf wählt (vorgeschlagen aus den Einstellungen); gilt für Mietverträge mit «Ja, zum Satz des Abrechnungslaufs». 0 bis 10 %. | Eingabe im Wizard „Abrechnungen erstellen“ (nicht gespeichert; die Abrechnung hält in `management_fee_percent` den angewandten Satz) |
| **Geleistete Akontobeiträge** | Summe der monatlichen Vorauszahlungen des Mieters während seiner Mietstage in der Abrechnungsperiode. | `total_advance_payments` |
| **Saldo** | Kostenanteil inklusive Verwaltungspauschale minus geleistete Akontobeiträge; bei einer berichtigten Abrechnung zusätzlich minus, was der Mieter auf die ersetzten Abrechnungen schon bezahlt hat (plus, was der Vermieter schon zurückerstattet hat). Gerundet auf 5 Rappen zugunsten des Mieters. Positiv = Nachzahlung, negativ = Rückerstattung; Saldo 0.00 oder unter dem Mindestbetrag: keine Zahlung, kein Zahlteil. | `balance`, `prior_payments`; Rundung zugunsten des Mieters: geplant (#79) |
| **Bereits bezahlt / Bereits zurückerstattet** | Zeile der berichtigten Abrechnung: was der Mieter auf die ersetzten Abrechnungen schon bezahlt hat; bei einer Rückerstattung «Bereits zurückerstattet», was der Vermieter schon erstattet hat. Wird vom Saldo abgezogen bzw. dazugezählt. | `prior_payments` |
| **Mindestbetrag** | Fester Betrag von CHF 5.00. Ist der gerundete Saldo kleiner (Nachzahlung oder Rückerstattung), wird er übertragen; auf der Schlussabrechnung gilt kein Mindestbetrag. | geplant (#403) |
| **Übertrag** | Ein Saldo unter dem Mindestbetrag (CHF 5.00), Nachzahlung oder Rückerstattung, wird nicht eingefordert oder ausbezahlt, sondern in der nächsten Abrechnung desselben Mietvertrags verrechnet. Auf der Schlussabrechnung gibt es keinen Übertrag. | geplant (#403) |
| **Rundung auf 5 Rappen** | Differenz zwischen dem Saldo und dem Saldo vor Rundung. Gerundet wird nur zugunsten des Mieters: eine Nachzahlung ab-, eine Rückerstattung aufgerundet. Im PDF mit + oder – vom gezeigten Betrag aus: +, wenn er durch die Rundung grösser wird. | Berechnung; zugunsten des Mieters: geplant (#79) |
| **Abgerechnete Tage** | Die Tage, die eine Rechnung in der Abrechnungsperiode abrechnet: ohne Leistungszeitraum die Tage der Abrechnungsperiode, mit Leistungszeitraum dessen Tage innerhalb der Abrechnungsperiode. Rechnen alle Rechnungen einer Abrechnungsposition dieselben Tage ab, sind das die abgerechneten Tage der Position (`billed_days`); sonst gelten sie je Rechnung (`invoice_parts`). | `billed_days`, `invoice_parts` (nicht gespeichert bei einem Mietvertrag über die ganze Periode) |
| **Mietstage der Position** | Anzahl der Tage, an denen der Mietvertrag läuft, innerhalb der abgerechneten Tage einer Rechnung oder Abrechnungsposition. | `position_rental_days`, je Rechnung `invoice_parts` (`days`) |
| **Zeitanteil** | Anteil eines Mietvertrags an einer Abrechnungsposition nach der Zeit: Mietstage der Position geteilt durch die abgerechneten Tage; bei mehreren Rechnungen nach ihren Beträgen für die abgerechneten Tage gewichtet. Heizkosten mit Heizprofil im Abrechnungslauf bei Ein- oder Auszug: je Rechnung der Anteil nach Heizprofil, bei mehreren Rechnungen nach ihren Beträgen gewichtet, ausser die Monate der Abrechnungsperiode haben darin zusammen 0 % (dann nach Tagen). Mieteranteil = Wohnungsanteil × Zeitanteil (im PDF: «Ihr Anteil»). | `period_share` |
| **Berichtigte Abrechnung** | Neue Nebenkostenabrechnung, die eine versendete oder bezahlte Abrechnung ersetzt («ersetzt NK-…»). Die alte bleibt unverändert erhalten und erhält den Status «Ersetzt». Was Mieter oder Vermieter auf die ersetzte Abrechnung schon bezahlt haben, wird angerechnet. Forderungen aus der Nebenkostenabrechnung verjähren in der Regel nach fünf Jahren (Art. 128 Ziff. 1 OR); ab wann die Frist läuft, ist nicht einheitlich geklärt. | `replaces_id`, Status `replaced` |
| **Mietstage** | Anzahl Tage, die ein Mietvertrag in der Abrechnungsperiode läuft, ab dem Tag nach «Abgerechnet bis», wenn dieses Datum in die Periode fällt. Grundlage für die anteilsmässige Berechnung. | `rental_days` |
| **Leerstand** | Zeit, in der eine Wohnung keinen laufenden Mietvertrag hat. Den Anteil der Nebenkosten dafür trägt der Vermieter (für Heizkosten Art. 7 Abs. 1 VMWG); Dwello rechnet ihn keinem Mieter an. Die Ausnahme von Art. 7 Abs. 2 VMWG wendet Dwello nicht an. | Berechnung |
| **Proration** | Anteilsmässige Berechnung der Nebenkosten bei unterjährigem Ein-/Auszug. | Berechnung |

### Abrechnungsstatus

| Status | Bedeutung |
|--------|-----------|
| **Entwurf** | Abrechnung erstellt, noch nicht versendet. (`draft`) |
| **Versendet** | Abrechnung dem Mieter zugestellt. (`sent`) |
| **Bezahlt** | Nachzahlung/Rückerstattung mit einer Zahlung abgeschlossen. Lässt sich mit «Zahlung zurücksetzen» zurücknehmen. (`paid`) |
| **Erledigt** | Status einer versendeten Abrechnung ohne Zahlung, weil der Saldo 0.00 ist oder übertragen wird. Sie hat kein Zahlungsdatum und wird nicht gemahnt. (geplant #403) |
| **Überfällig** | Versendet und Zahlungsfrist überschritten. (`overdue`) |
| **Ersetzt** | Durch eine berichtigte Abrechnung ersetzt; wird nicht gemahnt und zählt nicht als Abrechnung der Periode; Zahlungsdatum und Saldo der ersetzten Abrechnung bleiben erhalten. (`replaced`) |

---

## Zahlungsverkehr und Dokumente

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Zahlungsfrist** | Datum, bis zu dem die Abrechnung bezahlt sein muss. Bei einer Rückerstattung das Datum, bis zu dem der Vermieter zurückerstattet (Anzeige: „Rückerstattung bis“). | `payment_deadline` Feld, `payment_deadline_days` Config |
| **Zahlung zurücksetzen** | Nimmt eine falsch erfasste Zahlung einer Abrechnung zurück: Zahlungsdatum und bezahlter Betrag werden gelöscht, der Status wird wieder Versendet bzw. Überfällig. Der Verlauf und das Protokoll halten das Zurücksetzen mit dem Datum der zurückgesetzten Zahlung fest. | `payment_resets` |
| **Zahlungsfrist einer Mahnung** | Datum, bis zu dem der Mieter nach einer Mahnung bezahlen soll; 10 Tage ab dem Datum des Briefs. Die Zahlungsfrist der Abrechnung bleibt unverändert, die Abrechnung bleibt «Überfällig». Die nächste Mahnstufe ist ab dem Tag danach möglich. | `documents` (Zahlungsfrist des Briefs) |
| **Mahnung** | Vom Liegenschaftsverwalter ausgelöste Zahlungsaufforderung zu einer versendeten Abrechnung. | `documents` Tabelle |
| **Mahnstufe** | Zahlungserinnerung (1. Stufe), 2. Mahnung, 3. Mahnung. | `reminder_level` Feld |
| **Mahnfrist** | Anzahl Tage nach Ablauf der Zahlungsfrist bis zur Mahnung. | `reminder_after_days` Config |
| **Dokument** | Brief oder E-Mail an einen Mieter (z.B. Mahnung) mit PDF, oder vom Liegenschaftsverwalter hochgeladene Datei zu einem Mieter. | `documents` Tabelle |
| **Hochgeladenes Dokument** | Datei, die der Liegenschaftsverwalter zu einem Mieter ablegt, z.B. Übergabeprotokoll oder Betreibungsauszug. | `documents.type = 'upload'` |
| **Ausweiskopie** | Kopie eines amtlichen Ausweises des Mieters, als hochgeladenes Dokument abgelegt. | `documents.type = 'upload'` |
| **Versandstatus** | Zu versenden (`to_send`, Brief noch zu verschicken) oder Versendet (`sent`). | `status` Feld |

---

## QR-Rechnung (Schweizer Zahlungsstandard)

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **QR-Rechnung** | Schweizer Standard-Zahlungsbeleg gemäss ISO 20022. Enthält QR-Code mit allen Zahlungsinformationen. | PDF-Generierung |
| **Zahlteil** | Abtrennbarer Teil der QR-Rechnung mit QR-Code und Zahlungsinformationen. | PDF-Komponente |
| **Empfangsschein** | Teil der QR-Rechnung links neben dem Zahlteil, den der Zahlende als Quittung behält (Begriff der SIX). | PDF-Komponente |
| **QR-Referenz** | Eindeutige Referenznummer auf der QR-Rechnung zur Zahlungszuordnung. | `qr_bill_reference` |
| **IBAN** | Internationale Bankkontonummer des Vermieters/Verwalters. | `iban` Config |

---

## Schweizer Mietrecht

| Begriff | Definition |
|---------|-----------|
| **Obligationenrecht (OR)** | Schweizer Bundesgesetz, das die Mietvertragsbestimmungen regelt. Insbesondere Art. 257a-257b OR für Nebenkosten. |
| **Verordnung über die Miete (VMWG)** | Bundesratsverordnung (SR 221.213.11, amtlich «Verordnung über die Miete und Pacht von Wohn- und Geschäftsräumen»); regelt unter anderem Nebenkostenabrechnung, Verwaltungskosten und Heizkosten (Art. 4–8 VMWG). |
| **Umlagefähige Nebenkosten** | Kosten einer umlagefähigen Kategorie. Bezahlen muss der Mieter sie nur, wenn sie zu den vereinbarten Nebenkosten seines Mietvertrags gehören. |
| **Datenschutzgesetz (DSG)** | Schweizer Datenschutzgesetz. Relevant für die Verarbeitung von Mieterdaten. |
| **Betreiber** | Person oder Firma, die eine Dwello-Installation auf einem Server einrichtet und betreibt: der Vermieter selbst oder ein Anbieter in seinem Auftrag. Name, Adresse und Kontakt aus `OPERATOR_NAME`, `OPERATOR_ADDRESS`, `OPERATOR_CONTACT`. Verantwortlich für die Anmeldung, das Protokoll des Servers und die Cookies; für die erfassten Daten nur Auftragsbearbeiter, wenn er nicht der Vermieter selbst ist (in der Datenschutzerklärung geplant, #411). |
| **Verantwortlicher (DSG)** | Wer über Zweck und Mittel der Bearbeitung von Personendaten entscheidet (Art. 5 Bst. j DSG). Für die Daten, die in Dwello erfasst werden, auch die der Mieter, der Vermieter; für Anmeldung, Protokoll des Servers und Cookies der Betreiber (in der Datenschutzerklärung geplant, #411). |
| **Auftragsbearbeiter (DSG)** | Wer Personendaten im Auftrag des Verantwortlichen bearbeitet (Art. 5 Bst. k DSG), etwa ein Anbieter, der Dwello für den Vermieter betreibt (in der Datenschutzerklärung geplant, #411). |
| **Protokoll des Servers** | Aufzeichnung des Servers über Anmeldungen, Verlängerungen der Sitzung und Abmeldungen, mit Kennung des Kontos und E-Mail-Adresse, sowie über Fehler; nur der Betreiber liest es, er bestimmt die Aufbewahrung. Nicht zu verwechseln mit dem Protokoll unter «Einstellungen». |

---

## Einstellungen

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Verwaltungspauschale** | Einstellung: Satz, den der Abrechnungslauf vorschlägt. | `management_fee_pct` Config |
| **Standard-Heizprofil** | Vorgeschlagenes Heizprofil für den Abrechnungslauf. | `default_heating_profile_id` Config |
| **Standard-Verteilschlüssel** | Vorgeschlagener Verteilschlüssel für neue Rechnungen. | `default_distribution_key_id` Config |
| **Firmenname** | Name des Liegenschaftsverwalters/der Verwaltungsfirma. | `company_name` Config |
| **Firmenadresse** | Adresse des Liegenschaftsverwalters für Korrespondenz und QR-Rechnung. | `company_address`, `company_postal_code`, `company_city` Config |
| **Protokoll** | Liste unter «Einstellungen», die mit Datum und Uhrzeit Anmeldungen und Änderungen festhält, die Abrechnungen beeinflussen (Verwaltungspauschale, Umlagefähigkeit von Kategorien und Rechnungen, zurückgesetzte Zahlungen, berichtigte Abrechnungen). Einträge bleiben, bis der Liegenschaftsverwalter sie löscht. Nicht zu verwechseln mit dem Protokoll des Servers und dem Übergabeprotokoll. | `audit_log` Tabelle |

---

## Mehrsprachigkeit

Die Oberfläche gibt es auf Deutsch, Französisch, Italienisch und Englisch (Deutsch ist Standard). Jeder Mieter hat eine **Sprache** (`language`, Standard Deutsch), festgelegt im Mieterformular und auf der Mieterseite angezeigt. Die Nebenkostenabrechnung (PDF) wird in dieser Sprache erstellt, die Mahnungen ebenfalls (geplant, #106).

| Kürzel | Sprache |
|--------|---------|
| `de` | Deutsch |
| `fr` | Französisch |
| `it` | Italienisch |
| `en` | Englisch |
