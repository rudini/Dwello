# MVA-Umbauplan: Modularer Monolith für Dwello

## Problem & Zielbild

Dwello erfüllt die funktionalen Anforderungen, ist aber entlang technischer Schichten gewachsen (`backend/src/routes`, `backend/src/services`). Ziel ist eine **Minimum Viable Architecture (MVA)** im Sinne von _Continuous Architecture in Practice_ (Erder, Pureur, Woods): die kleinste Architektur, die die bekannten Qualitätsanforderungen erfüllt, und nicht mehr.

Rahmenbedingungen, die den Umfang begrenzen:

- Ein Entwickler, ein Benutzer, weniger als 50 Wohnungen.
- Backend rund 10'000 Zeilen, eine PostgreSQL-Datenbank mit Foreign Keys über alle Fachbereiche.
- Kein verteiltes System, keine zweite Team- oder Modellgrenze.

Leitentscheidungen:

1. **Module statt Bounded Contexts.** Bounded Contexts setzen voneinander abweichende Modelle voraus. Dwello hat ein Modell und eine Sprache. Die Grenzen unten sind Modulgrenzen innerhalb eines Bounded Context.
2. **Entscheidungen verzögern** (Prinzip 3 des Buchs). Events, Value Objects, Read-Models und Anti-Corruption Layer werden erst eingeführt, wenn ein Qualitätsszenario sie verlangt.
3. **Tiefe Module.** Die Schnittstelle eines Moduls ist sein `index.ts`. Keine Facades, die nur an Services weiterreichen.
4. **Verhaltenserhaltender Umbau** in kleinen Schritten, abgesichert durch Tests.

## Qualitätsszenarien

Die Architektur wird an diesen Szenarien gemessen. Die Liste ist ein Vorschlag und muss vor Schritt 2 bestätigt oder ersetzt werden.

| Nr. | Szenario                                                                 | Messgröße                                                      |
| --- | ------------------------------------------------------------------------ | -------------------------------------------------------------- |
| Q1  | Ein neuer Verteilschlüssel-Typ wird eingeführt.                          | Änderungen nur im Modul Nebenkostenabrechnung.                 |
| Q2  | Ollama wird durch einen anderen LLM-Anbieter ersetzt.                    | Änderungen nur in `llm.service` und `config/llm.ts`.           |
| Q3  | Eine Gesetzesänderung betrifft die Berechnung der Nebenkostenabrechnung. | Änderungen nur im Modul Nebenkostenabrechnung, ohne Routen.    |
| Q4  | Das PDF-Layout der Abrechnung ändert sich.                               | Änderungen nur im Rendering, keine Änderung an der Berechnung. |
| Q5  | Die Berechnung wird ohne HTTP und ohne PDF-Erzeugung getestet.           | Ein Unit-Test ruft die Abrechnungserstellung als Funktion auf. |

Q5 ist heute nicht erfüllt: Die Abrechnungserstellung liegt in `backend/src/routes/statements.ts`.

## Strategisches Design

### Subdomains (Distillation)

- **Core Domain: Nebenkostenabrechnung.** Verteilung über Verteilschlüssel, Proration und Heizprofile. Hier steckt die fachliche Komplexität und der Wert des Produkts. Hier lohnt sich Modellierungsaufwand.
- **Supporting: Liegenschaftsverwaltung und Rechnungswesen.** Notwendig, aber fachlich einfach (Stammdaten, Erfassung, Kategorisierung).
- **Generic: Rendering (PDF, QR-Rechnung), Mail, Authentifizierung, Konfiguration.** Austauschbare Technik ohne eigenes Fachmodell.

### Module

Die Module folgen den Abschnitten von `UBIQUITOUS_LANGUAGE.md`. Deutsch ist die kanonische Domänensprache, die englischen Namen sind Code-Bezeichner.

1. **Liegenschaftsverwaltung** (`rental`)
   Glossar-Abschnitte: Liegenschaftsverwaltung, Mietvertrag.
   Gebäude, Wohnung, Mieter, Mietvertrag.
   Services: `building`, `apartment`, `tenant`, `contract`.
   Begründung der Zusammenlegung: Der Belegungsstatus einer Wohnung leitet sich aus den Mietverträgen ab. `apartment.service` liest Mietverträge und Mieter, `building.service` und `contract.service` importieren `apartmentStatus`. Eine Trennung in Portfolio und Tenancy ergäbe einen Zyklus.

2. **Rechnungswesen** (`costs`)
   Glossar-Abschnitte: Rechnungswesen, Nebenkostenkategorien, LLM-Kategorisierung.
   Rechnung, Nebenkostenkategorie, Umlagefähigkeit, Rechnungsklassifizierung.
   Services: `invoice`, `category`, `llm`, `utility-validation`.
   Der frühere Name „Billing“ war irreführend: Eine Rechnung ist laut Glossar der Beleg eines Dienstleisters, nicht eine Forderung an den Mieter.

3. **Nebenkostenabrechnung** (`settlement`, Core)
   Glossar-Abschnitte: Verteilschlüssel, Heizprofil, Nebenkostenabrechnung, Zahlungsverkehr.
   Verteilschlüssel, Heizprofil, Mieteranteil, Proration, Abrechnungsposition, Saldo, Mahnung.
   Services: `distribution-key`, `formula`, `heating-profile`, `calculation`, `prorating`, `statement`, `reminder`, `reminder-letter`, `document`.
   Verteilschlüssel und Heizprofile gehören zusammen, weil beide Regeln der Kostenverteilung sind und beide von `calculation`/`prorating` verwendet werden.
   Die Tabelle `documents` gehört hierher: Sie referenziert Mieter und Nebenkostenabrechnung und enthält Mahnungen. Der PDF-Blob der Abrechnung liegt ohnehin auf `utility_statements`.

4. **Infrastruktur (kein Fachmodul)**
   `pdf.service`, `qr-bill.service`, `reminder-pdf` (reine Renderer ohne Tabellenzugriff), `mail/`, `config.service`, `middleware/auth.ts`, `db/`.
   Jedes Fachmodul darf Infrastruktur importieren, Infrastruktur importiert kein Fachmodul.
   Offener Punkt: `config.service` importiert heute `heatingProfileExists` und `distributionKeyExists` und verletzt damit diese Regel. Auflösung in Schritt 3.

### Abhängigkeiten zwischen Modulen

Pfeil bedeutet „importiert von“; das Ziel des Pfeils ist Upstream.

```
settlement  ──▶  costs  ──▶  rental
     │                          ▲
     └──────────────────────────┘
```

- **`costs` → `rental`:** Eine Rechnung gehört zu einem Gebäude (`buildingExists`).
- **`settlement` → `costs`:** klassifizierte Rechnungen als Eingang der Berechnung (`getInvoicesForStatement`).
- **`settlement` → `rental`:** Wohnungen und Mietverträge als Grundlage der Verteilung.

Die Gegenrichtung ist verboten. Bekannte Verstöße, die in Schritt 3 zu klären sind: `tenant.service`, `contract.service`, `invoice.service` und `utility-validation.service` greifen auf Abrechnungstabellen zu (vermutlich Löschschutz und Sperre bereits abgerechneter Daten).

### Regeln

- Import über Modulgrenzen nur über das `index.ts` des Zielmoduls.
- **Schreiben** auf Tabellen eines anderen Moduls ist verboten.
- **Lesen** per Join über Modulgrenzen bleibt erlaubt. Die Datenbank ist eine einzige, mit Foreign Keys und Cascades über alle Module. Ein Verbot würde Joins durch N+1-Abfragen ersetzen, ohne ein Szenario zu verbessern.
- `routes/dashboard.ts` ist eine reine Leseabfrage über mehrere Module und von der Modulregel ausgenommen.
- Routen enthalten keine Fachlogik und keinen direkten Datenbankzugriff (Ausnahme: Dashboard).

### Ubiquitous Language

Das verbindliche Glossar ist `UBIQUITOUS_LANGUAGE.md` im Projektwurzelverzeichnis. Dieser Plan führt kein zweites Glossar. Das Glossar deckt alle drei Module ab; ein Begriff mit abweichender Bedeutung zwischen Modulen ist nicht bekannt, was die Entscheidung für Module statt Bounded Contexts stützt.

In Schritt 1 am Glossar zu klären:

- **Belegungsstatus:** Glossar nennt ein Feld `occupancy_status` mit den Werten belegt, leer, reserviert. Im Code wird der Status über `apartmentStatus` aus den Mietverträgen abgeleitet. Glossar und Code abgleichen.
- **Mahnung / Zahlungserinnerung:** Beide Begriffe stehen im Glossar, „Mahnung“ ohne eigenen Eintrag. Einen Begriff festlegen.
- **Abrechnungsperiode:** zweimal definiert (Nebenkostenabrechnung und Konfiguration). Zusammenführen oder Unterschied benennen.
- **Dokument:** Die Tabelle `documents` hat keinen Glossareintrag.
- **Modulzuordnung:** Je Glossar-Abschnitt das besitzende Modul vermerken.

## Umsetzung

### Schritt 1 — ADR, Szenarien, Glossar

- Qualitätsszenarien bestätigen.
- Ein ADR unter `docs/adr/` mit Subdomains, Modulen und Abhängigkeitsregeln; Verweis auf `UBIQUITOUS_LANGUAGE.md`.
- Offene Glossarpunkte (siehe „Ubiquitous Language“) in `UBIQUITOUS_LANGUAGE.md` bereinigen.
- Liste der bekannten technischen Schulden im selben ADR (Startbestand siehe „Bekannte technische Schulden“).

Fertig, wenn: ADR liegt vor, Szenarien sind bestätigt, Glossarpunkte sind bereinigt.

### Schritt 2 — Characterization-Tests für die Core Domain

- Bestehende Tests für `calculation`, `prorating`, `heating-profile` und `distribution-key` sichten.
- Lücken mit Tests schließen, die das heutige Ergebnis der Abrechnungserstellung für repräsentative Fälle festhalten (Mieterwechsel in der Abrechnungsperiode, leere Wohnung, Heizprofil, mehrere Verteilschlüssel).
- Tests laufen gegen die echte PostgreSQL-Datenbank, ohne Mocks.

Fertig, wenn: Die Abrechnungserstellung ist durch Tests abgedeckt, die bei geänderten Beträgen fehlschlagen.

### Schritt 3 — Modulordner und Boundary-Regel

- Services nach `backend/src/modules/{rental,costs,settlement}/` verschieben, je Modul ein `index.ts` mit den öffentlich verwendeten Funktionen.
- Infrastruktur nach `backend/src/infrastructure/` (oder am bisherigen Ort belassen, falls der Diff dadurch kleiner bleibt).
- Boundary-Regel mit `fallow` (bereits installiert) einrichten und in `npm run lint` bzw. CI aufnehmen.
- Verbotene Rückbezüge auflösen: je Fall entscheiden, ob die Abfrage in das besitzende Modul wandert und als Funktion exportiert wird (z. B. `hasStatementsForContract`), oder ob ein Lese-Join genügt.
- Abhängigkeit `config.service` → `settlement` auflösen.

Reihenfolge: `settlement` zuerst (Core Domain, größter Nutzen), dann `costs`, dann `rental`. Je Modul ein eigener Commit.

Fertig, wenn: Boundary-Check meldet null Verstöße, alle Tests grün.

### Schritt 4 — Abrechnungserstellung aus der Route lösen

- Orchestrierung aus `backend/src/routes/statements.ts` (Berechnung, Nummernvergabe, QR-Referenz, PDF, Speichern) als Use-Case-Funktionen in das Modul `settlement` verschieben.
- Direkten Datenbankzugriff aus der Route entfernen.
- Prüfen, ob Nebenkostenabrechnung und Abrechnungspositionen atomar geschrieben werden. Im Backend findet sich derzeit kein `db.transaction(`. Falls nicht atomar: Transaktion ergänzen, mit Test.

Fertig, wenn: Szenario Q5 erfüllt, Route enthält nur noch Validierung, Aufruf und Antwort.

### Schritt 5 — Stopp und Neubewertung

Der Umbau endet hier. Weitere Maßnahmen nur, wenn ein Szenario nicht erfüllt ist oder ein neues hinzukommt.

## Bewusst nicht umgesetzt

| Maßnahme                                             | Einführen, wenn                                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| In-Process Domain Events                             | ein zweiter Abnehmer für dasselbe Ereignis existiert oder Verarbeitung asynchron sein muss |
| Value Objects (`Money`, `DateRange`), typisierte IDs | ein Rundungs- oder Verwechslungsfehler auftritt, den Typen verhindert hätten               |
| Read-Models / Denormalisierung                       | eine Leseabfrage messbar zu langsam ist                                                    |
| Anti-Corruption Layer                                | ein externes System mit eigenem Modell angebunden wird (z. B. Bank, Buchhaltung)           |
| Repository-Schicht je Modul                          | die Datenbank oder das ORM gewechselt wird                                                 |
| Getrennte Bounded Contexts                           | ein zweites Team oder ein abweichendes Modell entsteht                                     |
| Umbau des BFF (`src/lib/server`)                     | das BFF mehr als Proxy, Cookies und XSRF übernimmt                                         |

## Verifikation pro Schritt

- Unit-Tests, E2E-Tests, `npm run type-check` und `npm run lint` grün.
- Boundary-Check ohne Verstöße (ab Schritt 3).
- API- und UI-Verhalten unverändert.
- `implementation_plan.md` nachgeführt.

## Bekannte technische Schulden (Startbestand)

- Fachlogik und Datenbankzugriff in `backend/src/routes/statements.ts` (526 Zeilen).
- Kein `db.transaction(` im Backend; Atomarität beim Schreiben von Nebenkostenabrechnung und Abrechnungspositionen ungeprüft.
- Rückbezüge von `rental` und `costs` auf Abrechnungstabellen.
- `config.service` importiert Fachservices.
- `pdf.service` mit 786 Zeilen; Aufteilung erst prüfen, wenn Q4 nicht erfüllt ist.

## Risiken & Gegenmaßnahmen

- **Risiko:** Regression in der Berechnung beim Verschieben.
  **Gegenmaßnahme:** Schritt 2 vor Schritt 3 und 4; reine Verschiebungen und Verhaltensänderungen nie im selben Commit.

- **Risiko:** Versteckte Kopplung über SQL, die der Import-Check nicht sieht.
  **Gegenmaßnahme:** Schreibzugriffe auf fremde Tabellen einmalig per Suche inventarisieren (Schritt 3) und in der Review-Checkliste halten.

- **Risiko:** Umbau kollidiert mit laufender Feature-Arbeit.
  **Gegenmaßnahme:** Ein Modul pro Commit, keine langlebigen Branches.

- **Risiko:** Der Plan wächst wieder.
  **Gegenmaßnahme:** Jede Ergänzung braucht ein Qualitätsszenario, das ohne sie nicht erfüllt ist.

## Hinweise zur Analyse

Die Aussagen zu Abhängigkeiten stammen aus einer Import- und Stichwortsuche, nicht aus einer vollständigen Durchsicht des Codes. Die Rückbezüge auf Abrechnungstabellen und die fehlende Transaktion sind vor Schritt 3 bzw. 4 am Code zu bestätigen.
