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
| **Mietstatus** | Status einer Wohnung: Vermietet (`occupied`, ein Vertrag läuft), Wiedervermietet (`relet`, ein künftiger Vertrag ist abgeschlossen), Leer (`vacant`), Gesperrt (`reserved`). Vermietet und Wiedervermietet ergeben sich aus den Mietverträgen; von Hand setzbar sind nur Leer und Gesperrt. **Leer:** Es gibt keinen laufenden und keinen künftigen Mietvertrag; die Wohnung kann vermietet werden. **Gesperrt:** Der Vermieter hat die Wohnung von Hand gesperrt, z.B. während einer Renovation; gilt nur, solange kein Mietvertrag läuft oder abgeschlossen ist. | `status` Feld |
| **Mieter** | Person, die eine Wohnung mietet. Enthält Name, Kontaktdaten, Adresse, Korrespondenzkanal und Sprache. Aktiv mit laufendem oder künftigem Mietvertrag, sonst ehemalig. | `tenants` Tabelle |
| **Korrespondenzkanal** | Wie der Mieter Post erhält: Brief (`letter`, Standard) oder E-Mail (`email`, verlangt eine E-Mail-Adresse). | `correspondence_channel` Feld |
| **Vermieter** | Eigentümer oder Liegenschaftsverwalter, der die Wohnung vermietet. Trägt die Kosten des Leerstands. | — |
| **Liegenschaftsverwalter** | Person oder Firma, die Gebäude im Auftrag des Eigentümers verwaltet. Primärer Benutzer von Dwello. | — |

---

## Mietvertrag

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Mietvertrag** | Rechtliche Vereinbarung zwischen Mieter und Vermieter über die Nutzung einer Wohnung. Pro Wohnung darf sich kein Vertrag mit einem anderen überschneiden. | `rental_contracts` Tabelle |
| **Vertragsbeginn** | Startdatum des Mietverhältnisses. | `start_date` Feld |
| **Vertragsende** | Letzter Tag des Mietverhältnisses. Bei einem befristeten Vertrag das vereinbarte Ende, bei einem gekündigten unbefristeten Vertrag der Kündigungstermin; leer bei einem unbefristeten, ungekündigten Vertrag. | `end_date` Feld |
| **Befristet / Unbefristet** | Befristet: Der Vertrag endet ohne Kündigung am vereinbarten Vertragsende; bleibt der Mieter danach mit Wissen des Vermieters, gilt er als unbefristet (Art. 266 OR). Unbefristet: Der Vertrag läuft, bis er gekündigt wird. | `end_date`, `terminated` |
| **Kündigungstermin** | Tag, auf den ein unbefristeter Mietvertrag gekündigt werden kann (ortsübliche Termine oder laut Mietvertrag). Ist der Vertrag gekündigt, der Tag, auf den gekündigt wurde; Dwello erfasst ihn als Vertragsende. Von der Kündigung bis zu diesem Tag läuft der Vertrag weiter und heisst **gekündigt**. | `end_date` mit `terminated = true` |
| **Kündigung aufheben** | In Dwello: Der gekündigte Vertrag wird wieder unbefristet ohne Vertragsende, wenn Mieter und Vermieter die Kündigung im Einvernehmen zurücknehmen oder die Schlichtungsbehörde oder ein Gericht sie für ungültig erklärt. Nach dem Eingang kann eine Kündigung nicht einseitig zurückgenommen werden. | `end_date: null` |
| **Kündigungsfrist** | Zeit zwischen dem Eingang der Kündigung und dem Kündigungstermin. Für Wohnungen mindestens 3 Monate auf einen ortsüblichen Termin, oder länger, wenn der Mietvertrag es vorsieht (Art. 266a, 266c OR). Kommt die Kündigung zu spät, gilt sie auf den nächsten Termin. Für ausserordentliche Kündigungen (z.B. Zahlungsrückstand, Art. 257d OR) gelten andere Fristen. Dwello prüft die Frist nicht, sondern weist darauf hin. | — |
| **Vertragsstatus** | Laufend, künftig oder beendet, abgeleitet aus Vertragsbeginn und -ende. | Berechnung |
| **Nettomiete** | Monatliche Grundmiete in CHF (ohne Nebenkosten). Auch: Mietzins. | `base_rent` Feld |
| **Zusatzmiete** | Zusätzliche monatliche Kosten (Garage, Parkplatz, Keller). | `additional_rent` Feld |
| **Akonto** | Monatlicher Vorschuss des Mieters für Nebenkosten. Wird mit der Nebenkostenabrechnung verrechnet. | `monthly_advance_payment` Feld |
| **Monatlich total** | Nettomiete + Zusatzmiete + Akonto: der Betrag, den der Mieter laut Mietvertrag jeden Monat bezahlt. Nicht dasselbe wie die Bruttomiete (Nettomiete + Nebenkosten, ohne Zusatzmiete). Das Akonto ist ein Vorschuss, den die Nebenkostenabrechnung abrechnet. | Berechnung |
| **Referenzindex** | Schweizer Referenzzinssatz für die Mietzinsindexierung. | `reference_index` Feld |

---

## Rechnungswesen

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Rechnung** | Beleg eines Dienstleisters für erbrachte Leistungen am Gebäude (z.B. Hauswartung, Heizöl). | `invoices` Tabelle |
| **Lieferant / Rechnungssteller** | Firma oder Person, die die Rechnung ausstellt. | `billing_entity_name` Feld |
| **Rechnungsnummer** | Nummer der Rechnung beim Lieferanten. | `invoice_number` Feld |
| **Rechnungsdatum** | Datum der Rechnungsstellung. Bestimmt, in welche Abrechnungsperiode die Rechnung fällt, sofern kein Leistungszeitraum erfasst ist. | `invoice_date` Feld |
| **Leistungszeitraum** | Zeitraum, für den eine Rechnung gilt (Beginn und Ende oder keines von beiden). Ist er erfasst, zählt vom Betrag nur der Teil, der nach Tagen in die Abrechnungsperiode fällt; abgerechnet werden die tatsächlichen Kosten der Periode (Art. 257b OR, Art. 4 VMWG). | `service_period_start`, `service_period_end` |
| **Betrag** | Rechnungsbetrag in CHF. | `amount` Feld |
| **Fälligkeitsdatum** | Datum, bis zu dem die Rechnung bezahlt werden muss. | `due_date` Feld |
| **Zahlungsdatum** | Datum der tatsächlichen Bezahlung. | `paid_date` Feld |
| **Beschreibung** | Beschreibung der erbrachten Leistung auf der Rechnung. | `description` Feld |
| **Umlagefähige Rechnung** | Die Rechnung fliesst in die Nebenkostenabrechnung ein. Folgt der Kategorie, kann pro Rechnung angepasst werden. | `is_valid_utility_cost` Feld |

---

## Nebenkostenkategorien

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Kategorie** | Klassifikation der Kostenart. Bestimmt, ob Kosten auf Mieter umgelegt werden dürfen. Anzeige deutsch, interner Name englisch. | `categories` Tabelle (`name_de`, `name`) |
| **Heizkosten (Kategorie)** | Kategorie, deren Kosten bei Mieterwechsel nach dem im Abrechnungslauf gewählten Heizprofil auf die Monate verteilt werden, alle anderen Kategorien nach Tagen (z.B. Heizung, Kaminfeger). Ohne Heizprofil wird nach Tagen verteilt. Separat abgerechnetes Warmwasser gehört nicht dazu. | `is_heating_cost` Feld |

### Umlagefähig

Heizung, Warmwasser, Kaltwasser, Abwasser, Allgemeinstrom, Hauswart, Lift, Gartenpflege, Schneeräumung, Kehricht, TV/Kabelanschluss, Kaminfeger, sowie eigene Kategorien, die als umlagefähig erfasst sind.

### Nicht umlagefähig

Verwaltung, Reparaturen, Renovation, Liegenschaftssteuer, Hypothekarzinsen, Gebäudeversicherung, Wertvermehrende Investitionen, Schädlingsbekämpfung, Feuerlöscher-Wartung. Diese Kosten trägt der Vermieter. Der Verwaltungsaufwand für die Nebenkosten wird nicht als Rechnung, sondern über die **Verwaltungspauschale** abgerechnet.

---

## KI-Kategorisierung

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Kategorisierung** | Automatischer Vorschlag einer Kategorie für eine Rechnung mittels LLM (OpenAI-kompatible API, standardmässig lokales Ollama). | `/api/v1/invoices/categorize` |
| **KI-Kategorie** | Von der KI vorgeschlagene Kategorie. | `llm_category_id` Feld |
| **Konfidenz** | Vertrauenswert der KI für die vorgeschlagene Kategorie (0-1). | `llm_confidence` Feld |
| **Manuell überschrieben** | Der Liegenschaftsverwalter hat die KI-Kategorie geändert. | `was_manually_overridden` Feld |
| **Grund der Änderung** | Begründung, warum die KI-Kategorie überschrieben wurde. Pflicht beim Überschreiben. | `manual_override_reason` Feld |

---

## Verteilschlüssel

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Verteilschlüssel** | Formel zur Aufteilung der Gebäudekosten auf die einzelnen Wohnungen. Jede umlagefähige Rechnung kann einen Verteilschlüssel haben; ohne ihn wird sie gleichmässig pro Wohnung verteilt. Die Verwaltungspauschale hat keinen Verteilschlüssel. | `distribution_keys` Tabelle |
| **Pro Fläche (m²)** | Verteilung proportional zur Fläche. | Vordefiniert, `{area}` |
| **Pro Zimmer** | Verteilung proportional zur Zimmeranzahl. | Vordefiniert, `{rooms}` |
| **Pro Einheit** | Gleichmässige Verteilung auf alle Wohnungen. | Vordefiniert, `{units}` |
| **Heizung (Fläche 70 % / Einheit 30 %)** | Gemischter Schlüssel für Heizkosten: 70 % nach Fläche, 30 % zu gleichen Teilen pro Wohnung. | Vordefiniert, `0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}` |
| **Eigener Verteilschlüssel** | Eigene Formel mit den Variablen `{area}`, `{rooms}`, `{units}`, `{volume}` und ihren Summen über alle Wohnungen des Gebäudes (`{area_total}`, `{rooms_total}`, `{units_total}`, `{volume_total}`). | `formula` Feld |
| **Gleichmässig pro Wohnung** | Verteilung einer Rechnung ohne Verteilschlüssel: gleiche Anteile für alle Wohnungen des Gebäudes, auch leere (wie „Pro Einheit“). Den Anteil leerer Wohnungen trägt der Vermieter. | Berechnung |
| **Wohnungsanteil** | Anteil einer Wohnung an den Gebäudekosten gemäss Verteilschlüssel. Der Mieter trägt davon den Teil seiner Mietstage. | Berechnung |

---

## Heizprofil

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Heizprofil** | Monatliche Prozentverteilung der Heizkosten über 12 Monate (Summe = 100%). Wird im Abrechnungslauf gewählt und verteilt die Heizkosten bei Mieterwechsel nach Monaten statt nach Tagen. | `heating_profiles` Tabelle |
| **Tankbestand** | Wert des Brennstoffs im Tank oder Lager (Öl, Flüssiggas, Pellets, Holz) an einem Stichtag, in CHF, bewertet zum Preis der letzten Lieferung. Die Brennstoffkosten der Periode sind Anfangsbestand + Einkäufe − Endbestand (verbrauchte Brennstoffe, Art. 5 VMWG). | `fuel_stocks` Tabelle |
| **Stichtag** | Tag, für den ein Tankbestand erfasst wird: immer der letzte Tag einer Abrechnungsperiode (z.B. 31.12.). Der Bestand am letzten Tag der Vorperiode ist der Anfangsbestand, der Bestand am letzten Tag der Periode der Endbestand. | `reading_date` Feld |
| **Vordefinierte Heizprofile** | Heizung Mittelland, Heizung Bergregion, Heizung Tessin, Heizung + Warmwasser. Nicht änderbar. | `type = 'predefined'` |
| **Eigenes Heizprofil** | Vom Liegenschaftsverwalter erfasstes Profil. | `type = 'custom'` |

---

## Nebenkostenabrechnung

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Nebenkostenabrechnung** | Jährliche Abrechnung der tatsächlichen Nebenkosten pro Mietvertrag. Vergleicht geleistete Akontobeiträge mit dem effektiven Kostenanteil. Bei Mieterwechsel erhält jeder Mietvertrag eine eigene Abrechnung. | `utility_statements` Tabelle |
| **Abrechnungslauf** | Erstellt die Abrechnungen einer Periode für ausgewählte Gebäude, mit Heizprofil und Satz der Verwaltungspauschale. | Wizard „Abrechnungen erstellen“ |
| **Abrechnungsperiode** | Zeitraum der Abrechnung (z.B. 01.01.-31.12., 01.07.-30.06., 01.11.-31.10.). | `period_start`, `period_end` |
| **Abrechnungsposition** | Einzelne Kostenzeile in der Nebenkostenabrechnung (Kategorie, Gesamtbetrag, Mieteranteil). | `utility_statement_line_items` Tabelle |
| **Nebenkosten der Liegenschaft** | Summe aller umlagefähigen Rechnungen des Gebäudes in der Abrechnungsperiode. | Berechnung |
| **Eigene Nebenkosten** | Summe der Mieteranteile aller Abrechnungspositionen einer Abrechnung, vor der Verwaltungspauschale. Auf der Abrechnung: „Zwischensumme“. | Berechnung |
| **Verwaltungspauschale** | Abgeltung des Aufwands für die Nebenkostenabrechnung: ein Prozentsatz der eigenen Nebenkosten des Mieters. Nur zulässig, wenn im Mietvertrag vereinbart. Der Satz wird pro Abrechnungslauf gewählt; üblich sind etwa 3 %. Ein höherer Satz muss dem tatsächlichen Aufwand entsprechen (Art. 4 Abs. 3 VMWG). | `management_fee`, `management_fee_percent` |
| **Geleistete Akontobeiträge** | Summe der monatlichen Vorauszahlungen des Mieters während der Abrechnungsperiode. | `total_advance_payments` |
| **Saldo** | Kostenanteil inklusive Verwaltungspauschale minus geleistete Akontobeiträge, gerundet auf 5 Rappen. Positiv = Nachzahlung, negativ = Rückerstattung. | `balance` |
| **Rundung auf 5 Rappen** | Betrag, um den der Saldo kaufmännisch auf 5 Rappen auf- oder abgerundet wird (höchstens 2 Rappen). Die Abrechnung zeigt den Saldo vor Rundung, die Rundung mit + oder − (vom Betrag aus gesehen: wird er grösser, steht +) und den Saldo. Ohne Rundung entfällt die Zeile. | Berechnung |
| **Mietstage** | Anzahl Tage, die ein Mietvertrag in der Abrechnungsperiode läuft. Grundlage für die anteilsmässige Berechnung. | `rental_days` |
| **Proration** | Anteilsmässige Berechnung der Nebenkosten bei unterjährigem Ein-/Auszug. Leerstand trägt der Vermieter. | Berechnung |

### Abrechnungsstatus

| Status | Bedeutung |
|--------|-----------|
| **Entwurf** | Abrechnung erstellt, noch nicht versendet. (`draft`) |
| **Versendet** | Abrechnung dem Mieter zugestellt. (`sent`) |
| **Bezahlt** | Nachzahlung/Rückerstattung abgeschlossen. (`paid`) |
| **Überfällig** | Versendet und Zahlungsfrist überschritten; wird berechnet, nicht gespeichert. (`overdue`) |

---

## Zahlungsverkehr und Dokumente

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Zahlungsfrist** | Datum, bis zu dem die Abrechnung bezahlt sein muss. Bei einer Rückerstattung das Datum, bis zu dem der Vermieter zurückerstattet (Anzeige: „Rückerstattung bis“). Vorgabe: Anzahl Tage nach dem Versand. | `payment_deadline` Feld, `payment_deadline_days` Config |
| **Mahnung** | Vom Liegenschaftsverwalter ausgelöste Zahlungsaufforderung zu einer versendeten Abrechnung, als PDF in den Dokumenten, per E-Mail oder Brief gemäss Korrespondenzkanal. | `documents` Tabelle |
| **Mahnstufe** | Zahlungserinnerung (1. Stufe), 2. Mahnung, 3. Mahnung. Mehr als 3 Mahnungen sind nicht möglich. | `reminder_level` Feld |
| **Mahnfrist** | Anzahl Tage nach Ablauf der Zahlungsfrist bis zur Mahnung. | `reminder_after_days` Config (Standard 14) |
| **Dokument** | Brief oder E-Mail an einen Mieter (z.B. Mahnung) mit PDF. | `documents` Tabelle |
| **Versandstatus** | Zu versenden (`to_send`, Brief noch zu verschicken) oder Versendet (`sent`). | `status` Feld |

---

## QR-Rechnung (Schweizer Zahlungsstandard)

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **QR-Rechnung** | Schweizer Standard-Zahlungsbeleg gemäss ISO 20022. Enthält QR-Code mit allen Zahlungsinformationen. | PDF-Generierung |
| **Zahlteil** | Abtrennbarer Teil der QR-Rechnung mit QR-Code und Zahlungsinformationen. | PDF-Komponente |
| **QR-Referenz** | Eindeutige Referenznummer auf der QR-Rechnung zur Zahlungszuordnung. | `qr_bill_reference` |
| **IBAN** | Internationale Bankkontonummer des Vermieters/Verwalters (Schweiz oder Liechtenstein, beginnt mit "CH" oder "LI"). | `iban` Config |

---

## Schweizer Mietrecht

| Begriff | Definition |
|---------|-----------|
| **Obligationenrecht (OR)** | Schweizer Bundesgesetz, das die Mietvertragsbestimmungen regelt. Insbesondere Art. 257a-257b OR für Nebenkosten. |
| **Art. 257a OR** | Definiert Nebenkosten als Entgelt für Leistungen des Vermieters, die mit dem Gebrauch der Sache zusammenhängen. |
| **Art. 257b OR** | Nebenkosten sind die tatsächlichen Aufwendungen des Vermieters; Kosten für Reparaturen, Erneuerungen und Steuern gehören nicht dazu. |
| **Art. 4 Abs. 3 VMWG** | Der Verwaltungsaufwand darf nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden. In der Praxis gelten 3 % als Richtwert. |
| **Umlagefähige Nebenkosten** | Kosten, die der Vermieter dem Mieter in Rechnung stellen darf (abschliessende Liste im Mietvertrag). |
| **Datenschutzgesetz (DSG)** | Schweizer Datenschutzgesetz. Relevant für die Verarbeitung von Mieterdaten. |

---

## Konfiguration

| Begriff | Definition | Code / Schema |
|---------|-----------|---------------|
| **Abrechnungsperiode** | Jährliche Abrechnungsperiode (Kalenderjahr, Juli – Juni, November – Oktober). | `accounting_period` Config (`calendar`, `july-june`, `november-october`) |
| **Verwaltungspauschale** | Vorgeschlagener Satz für den Abrechnungslauf. | `management_fee_pct` Config |
| **Standard-Heizprofil** | Vorgeschlagenes Heizprofil für den Abrechnungslauf. | `default_heating_profile_id` Config |
| **Standard-Verteilschlüssel** | Vorgeschlagener Verteilschlüssel für neue Rechnungen. | `default_distribution_key_id` Config |
| **Firmenname** | Name des Liegenschaftsverwalters/der Verwaltungsfirma. | `company_name` Config |
| **Firmenadresse** | Adresse des Liegenschaftsverwalters für Korrespondenz und QR-Rechnung. | `company_address`, `company_postal_code`, `company_city` Config |

---

## Mehrsprachigkeit

Die Oberfläche gibt es auf Deutsch, Französisch, Italienisch und Englisch (Deutsch ist Standard). Jeder Mieter hat eine **Sprache** (`language`, Standard Deutsch), festgelegt im Mieterformular und auf der Mieterseite angezeigt. Die Nebenkostenabrechnung (PDF) wird in dieser Sprache erstellt; für Rätoromanisch vorerst auf Deutsch.

| Kürzel | Sprache |
|--------|---------|
| `de` | Deutsch |
| `fr` | Französisch |
| `it` | Italienisch |
| `rm` | Rätoromanisch |
| `en` | Englisch |
