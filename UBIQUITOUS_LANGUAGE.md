# Ubiquitous Language - Dwello

Die Ubiquitous Language (nach Eric Evans, Domain-Driven Design) definiert ein gemeinsames Vokabular zwischen Entwicklern und Fachexperten. Alle Begriffe in diesem Glossar sind verbindlich und sollen konsistent in Code, Dokumentation, UI und Kommunikation verwendet werden.

> **Konvention:** Deutsch ist die kanonische Domänensprache. Englische Code-Bezeichner sind in Klammern angegeben, wo sie vom deutschen Begriff abweichen.

---

## Liegenschaftsverwaltung (Kernentitäten)

| Begriff                    | Definition                                                                                                                           | Code / Schema           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| **Gebäude**                | Wohn- oder Mischgebäude mit Adresse, PLZ, Ort, Kanton, Baujahr und Gebäudetyp. Zentrale Entität, der alle Wohnungen zugeordnet sind. | `buildings` Tabelle     |
| **Liegenschaft**           | Synonym für Gebäude im Verwaltungskontext.                                                                                           | —                       |
| **Gebäudetyp**             | Klassifikation: Einfamilienhaus, Mehrfamilienhaus, Mischnutzung.                                                                     | `building_type` Feld    |
| **Baujahr**                | Jahr der Erstellung des Gebäudes.                                                                                                    | `year_built` Feld       |
| **Wohnung**                | Einzelne Mieteinheit innerhalb eines Gebäudes. Besitzt Wohnungsnummer, Geschoss, Wohnfläche (m²) und Zimmeranzahl.                   | `apartments` Tabelle    |
| **Geschoss**               | Stockwerk der Wohnung: Parterre, 1. Stock, 2. Stock, Attika, Untergeschoss.                                                          | `floor` Feld            |
| **Wohnfläche**             | Nettowohnfläche in Quadratmetern (m²). Grundlage für flächenbasierte Verteilschlüssel.                                               | `area_m2` Feld          |
| **Zimmeranzahl**           | Anzahl Zimmer (z.B. 3.5 Zimmer). Schweizer Konvention mit halben Zimmern.                                                            | `room_count` Feld       |
| **Belegungsstatus**        | Status einer Wohnung: belegt, leer, reserviert.                                                                                      | `occupancy_status` Feld |
| **Mieter**                 | Person, die eine Wohnung mietet. Enthält Name, Kontaktdaten, Sprache.                                                                | `tenants` Tabelle       |
| **Vermieter**              | Eigentümer oder Liegenschaftsverwalter, der die Wohnung vermietet.                                                                   | —                       |
| **Liegenschaftsverwalter** | Person oder Firma, die Gebäude im Auftrag des Eigentümers verwaltet. Primärer Benutzer von Dwello.                                   | —                       |

---

## Mietvertrag

| Begriff            | Definition                                                                                        | Code / Schema              |
| ------------------ | ------------------------------------------------------------------------------------------------- | -------------------------- |
| **Mietvertrag**    | Rechtliche Vereinbarung zwischen Mieter und Vermieter über die Nutzung einer Wohnung.             | `rental_contracts` Tabelle |
| **Vertragsbeginn** | Startdatum des Mietverhältnisses.                                                                 | `start_date` Feld          |
| **Vertragsende**   | Enddatum des Mietverhältnisses (optional bei unbefristeten Verträgen).                            | `end_date` Feld            |
| **Mietzins**       | Monatliche Grundmiete in CHF (ohne Nebenkosten). Auch: Bestandmiete.                              | `base_rent` Feld           |
| **Zusatzmiete**    | Zusätzliche monatliche Kosten (Garage, Parkplatz, Keller).                                        | `additional_rent` Feld     |
| **Akontobeitrag**  | Monatlicher Vorschuss des Mieters für Nebenkosten. Wird mit der Nebenkostenabrechnung verrechnet. | `monthly_advance` Feld     |
| **Referenzindex**  | Schweizer Referenzzinssatz für die Mietzinsindexierung.                                           | `reference_index` Feld     |

---

## Rechnungswesen

| Begriff                   | Definition                                                                                 | Code / Schema         |
| ------------------------- | ------------------------------------------------------------------------------------------ | --------------------- |
| **Rechnung**              | Beleg eines Dienstleisters für erbrachte Leistungen am Gebäude (z.B. Hauswartung, Heizöl). | `invoices` Tabelle    |
| **Rechnungssteller**      | Firma oder Person, die die Rechnung ausstellt.                                             | `billing_entity` Feld |
| **Rechnungsdatum**        | Datum der Rechnungsstellung.                                                               | `invoice_date` Feld   |
| **Betrag**                | Rechnungsbetrag in CHF.                                                                    | `amount` Feld         |
| **Fälligkeitsdatum**      | Datum, bis zu dem die Rechnung bezahlt werden muss.                                        | `due_date` Feld       |
| **Zahlungsdatum**         | Datum der tatsächlichen Bezahlung.                                                         | `paid_date` Feld      |
| **Leistungsbeschreibung** | Beschreibung der erbrachten Leistung auf der Rechnung.                                     | `description` Feld    |

---

## Nebenkostenkategorien

| Begriff                  | Definition                                                                           | Code / Schema        |
| ------------------------ | ------------------------------------------------------------------------------------ | -------------------- |
| **Nebenkostenkategorie** | Klassifikation der Kostenart. Bestimmt, ob Kosten auf Mieter umgelegt werden dürfen. | `categories` Tabelle |
| **Heizkosten**           | Kosten für Heizung (Öl, Gas, Fernwärme).                                             | Kategorie            |
| **Warmwasser**           | Kosten für Warmwasseraufbereitung.                                                   | Kategorie            |
| **Kaltwasser**           | Kosten für Frischwasserversorgung.                                                   | Kategorie            |
| **Abwasser**             | Kosten für Abwasserentsorgung.                                                       | Kategorie            |
| **Allgemeinstrom**       | Stromkosten für Gemeinschaftsbereiche (Treppenhaus, Keller, Waschküche).             | Kategorie            |
| **Hauswartung**          | Kosten für Hauswart/Hauswartung.                                                     | Kategorie            |
| **Lift**                 | Betriebs- und Wartungskosten des Aufzugs.                                            | Kategorie            |
| **Gartenpflege**         | Kosten für Pflege der Grünanlagen und Aussenanlagen.                                 | Kategorie            |
| **Schneeräumung**        | Kosten für Winterdienst und Schneeräumung.                                           | Kategorie            |
| **Kehricht**             | Kosten für Abfallentsorgung.                                                         | Kategorie            |
| **TV/Kabelgebühren**     | Kosten für Kabelfernsehen und Kommunikation.                                         | Kategorie            |
| **Kaminfeger**           | Kosten für Kaminfeger und Feuerungskontrolle.                                        | Kategorie            |
| **Schädlingsbekämpfung** | Kosten für Schädlingsbekämpfung.                                                     | Kategorie            |
| **Feuerlöscher-Wartung** | Kosten für Wartung der Brandschutzeinrichtungen.                                     | Kategorie            |
| **Verwaltungskosten**    | Administrativer Aufwand für die Nebenkostenabrechnung (max. 3% gemäss OR).           | Kategorie            |
| **Sonstiges**            | Übrige umlagefähige Nebenkosten.                                                     | Kategorie            |

### Umlagefähigkeit

| Begriff                    | Definition                                                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Umlagefähig (zulässig)** | Nebenkosten, die gemäss Schweizer Mietrecht auf den Mieter überwälzt werden dürfen. Alle oben genannten Kategorien.                                          |
| **Nicht umlagefähig**      | Kosten, die der Vermieter selbst tragen muss: Reparaturen, Renovationen, Grundsteuern, Hypothekarzinsen, Gebäudeversicherung, wertvermehrende Investitionen. |

---

## LLM-Kategorisierung

| Begriff                      | Definition                                                                                        | Code / Schema                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------ |
| **Rechnungsklassifizierung** | Automatische Zuordnung einer Rechnung zu einer Nebenkostenkategorie mittels LLM (Ollama/Mistral). | `/api/invoices/categorize`     |
| **LLM-Kategorie**            | Vom LLM vorgeschlagene Kategorie.                                                                 | `llm_category` Feld            |
| **Konfidenz**                | Vertrauenswert des LLM für die vorgeschlagene Kategorie (0-1).                                    | `confidence` Feld              |
| **Manuell überschrieben**    | Flag, ob der Benutzer die LLM-Kategorie korrigiert hat.                                           | `was_manually_overridden` Feld |

---

## Verteilschlüssel

| Begriff                       | Definition                                                                                   | Code / Schema               |
| ----------------------------- | -------------------------------------------------------------------------------------------- | --------------------------- |
| **Verteilschlüssel**          | Methode zur Aufteilung der Gebäudekosten auf die einzelnen Wohnungen.                        | `distribution_keys` Tabelle |
| **Pro Fläche**                | Verteilung proportional zur Wohnfläche (m²). Standardschlüssel.                              | Verteilschlüssel-Typ        |
| **Pro Einheit**               | Gleichmässige Verteilung auf alle Wohnungen.                                                 | Verteilschlüssel-Typ        |
| **Nach Heizprofil**           | Verteilung basierend auf dem monatlichen Heizprofil (für Heiz- und Warmwasserkosten).        | Verteilschlüssel-Typ        |
| **Benutzerdefinierte Formel** | Eigene Verteilungsformel mit Variablen: `{area}`, `{rooms}`, `{units}`, `{volume}`.          | `formula` Feld              |
| **Mieteranteil**              | Prozentualer Anteil eines Mieters an den Gesamtkosten, berechnet durch den Verteilschlüssel. | Berechnung                  |

---

## Heizprofil

| Begriff                     | Definition                                                                                                             | Code / Schema              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **Heizprofil**              | Monatliche Prozentverteilung der Heizkosten über 12 Monate (Summe = 100%). Berücksichtigt regionale Klimaunterschiede. | `heating_profiles` Tabelle |
| **Mittelland-Profil**       | Standardprofil für das Schweizer Mittelland (moderate Winter).                                                         | Vordefiniertes Profil      |
| **Bergregion-Profil**       | Profil für Berggebiete (lange, kalte Winter).                                                                          | Vordefiniertes Profil      |
| **Tessin-Profil**           | Profil für die Südschweiz (milde Winter, kurze Heizsaison).                                                            | Vordefiniertes Profil      |
| **Warmwasser gleichmässig** | Gleichmässige Verteilung (8.33% pro Monat) für Warmwasserkosten.                                                       | Vordefiniertes Profil      |

---

## Nebenkostenabrechnung

| Begriff                       | Definition                                                                                                                                   | Code / Schema                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Nebenkostenabrechnung**     | Jährliche Abrechnung der tatsächlichen Nebenkosten pro Mieter. Vergleicht geleistete Akontobeiträge mit dem effektiven Kostenanteil.         | `utility_statements` Tabelle           |
| **Abrechnungsperiode**        | Zeitraum der Abrechnung (z.B. 01.01.-31.12., 01.07.-30.06., 01.11.-31.10.).                                                                  | `period_start`, `period_end`           |
| **Abrechnungsposition**       | Einzelne Kostenzeile in der Nebenkostenabrechnung (Kategorie, Gesamtbetrag, Mieteranteil).                                                   | `utility_statement_line_items` Tabelle |
| **Gesamtkosten**              | Summe aller umlagefähigen Nebenkosten des Gebäudes in der Abrechnungsperiode.                                                                | Berechnung                             |
| **Geleistete Akontobeiträge** | Summe der monatlichen Vorauszahlungen des Mieters während der Abrechnungsperiode.                                                            | Berechnung                             |
| **Verwaltungsgebühr**         | Administrativer Zuschlag auf die Nebenkosten (max. 3% gemäss Art. 257b OR).                                                                  | `management_fee`                       |
| **Saldo**                     | Differenz zwischen geleistetem Akontobeitrag und tatsächlichem Kostenanteil. Positiv = Nachzahlung, negativ = Rückerstattung.                | Berechnung                             |
| **Mietstage**                 | Anzahl Tage, die ein Mieter während der Abrechnungsperiode die Wohnung bewohnt hat. Grundlage für die anteilsmässige Berechnung (Proration). | Berechnung                             |
| **Proration**                 | Anteilsmässige Berechnung der Nebenkosten bei unterjährigem Ein-/Auszug.                                                                     | Berechnung                             |

### Abrechnungsstatus

| Status         | Bedeutung                                           |
| -------------- | --------------------------------------------------- |
| **Entwurf**    | Abrechnung erstellt, noch nicht versandt. (`draft`) |
| **Versandt**   | Abrechnung dem Mieter zugestellt. (`sent`)          |
| **Bezahlt**    | Nachzahlung/Rückerstattung abgeschlossen. (`paid`)  |
| **Überfällig** | Zahlungsfrist überschritten. (`overdue`)            |

---

## Zahlungsverkehr

| Begriff                | Definition                                                           | Code / Schema                   |
| ---------------------- | -------------------------------------------------------------------- | ------------------------------- |
| **Zahlungsfrist**      | Anzahl Tage nach Versand der Abrechnung, bis die Zahlung fällig ist. | `payment_deadline_days` Config  |
| **Zahlungserinnerung** | Automatische Mahnung bei überfälliger Zahlung.                       | Mahnung                         |
| **Mahnungsstufe**      | Eskalationsstufe der Mahnung (1. Mahnung, 2. Mahnung, etc.).         | —                               |
| **Mahnfrist**          | Anzahl Tage nach Fälligkeit, bevor eine Mahnung ausgelöst wird.      | `reminder_deadline_days` Config |

---

## QR-Rechnung (Schweizer Zahlungsstandard)

| Begriff         | Definition                                                                                          | Code / Schema   |
| --------------- | --------------------------------------------------------------------------------------------------- | --------------- |
| **QR-Rechnung** | Schweizer Standard-Zahlungsbeleg gemäss ISO 20022. Enthält QR-Code mit allen Zahlungsinformationen. | PDF-Generierung |
| **Zahlteil**    | Abtrennbarer Teil der QR-Rechnung mit QR-Code und Zahlungsinformationen.                            | PDF-Komponente  |
| **QR-Referenz** | Eindeutige Referenznummer auf der QR-Rechnung zur Zahlungszuordnung.                                | Berechnung      |
| **IBAN**        | Internationale Bankkontonummer des Vermiters/Verwalters (muss mit "CH" beginnen).                   | `iban` Config   |

---

## Schweizer Mietrecht

| Begriff                      | Definition                                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Obligationenrecht (OR)**   | Schweizer Bundesgesetz, das die Mietvertragsbestimmungen regelt. Insbesondere Art. 257a-257b OR für Nebenkosten. |
| **Art. 257a OR**             | Definiert Nebenkosten als Entgelt für Leistungen des Vermieters, die mit dem Gebrauch der Sache zusammenhängen.  |
| **Art. 257b OR**             | Regelt die Abrechnung der Nebenkosten. Verwaltungskosten dürfen maximal 3% betragen.                             |
| **Umlagefähige Nebenkosten** | Kosten, die der Vermieter dem Mieter in Rechnung stellen darf (abschliessende Liste im Mietvertrag).             |
| **Datenschutzgesetz (DSG)**  | Schweizer Datenschutzgesetz. Relevant für die Verarbeitung von Mieterdaten.                                      |

---

## Konfiguration

| Begriff                   | Definition                                                                          | Code / Schema                       |
| ------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------- |
| **Abrechnungsperiode**    | Konfigurierbare jährliche Abrechnungsperiode (Kalender-, Geschäfts- oder Heizjahr). | `accounting_period` Config          |
| **Verwaltungskostensatz** | Prozentualer Zuschlag für Verwaltungsaufwand (max. 3%).                             | `management_cost_percentage` Config |
| **Firmenname**            | Name des Liegenschaftsverwalters/der Verwaltungsfirma.                              | `company_name` Config               |
| **Firmenadresse**         | Adresse des Liegenschaftsverwalters für Korrespondenz und QR-Rechnung.              | `company_address` Config            |

---

## Mehrsprachigkeit

Dwello unterstützt die vier Landessprachen der Schweiz plus Englisch. Die Sprachpräferenz wird pro Mieter gespeichert und bestimmt die Sprache der Nebenkostenabrechnung.

| Kürzel | Sprache       |
| ------ | ------------- |
| `de`   | Deutsch       |
| `fr`   | Französisch   |
| `it`   | Italienisch   |
| `rm`   | Rätoromanisch |
| `en`   | Englisch      |
