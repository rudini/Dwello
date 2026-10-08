# Architektur: Minimum Viable Architecture für Dwello

## Ziel

Dwello soll eine **Minimum Viable Architecture (MVA)** im Sinne von _Continuous Architecture in Practice_ (Erder, Pureur, Woods) haben: die kleinste Architektur, die die Qualitätsanforderungen erfüllt, und nicht mehr.

Daraus folgt das Vorgehen:

1. **Qualitätsmerkmale vor Funktionen** (Prinzip 2): Die Architektur wird an den Qualitätsszenarien unten gemessen, nicht an einem Zielbild.
2. **Entscheidungen verzögern** (Prinzip 3): Eine Architekturänderung braucht ein Szenario, das heute nicht erfüllt ist. Ohne ein solches Szenario bleibt die Struktur, wie sie ist.
3. **Entscheidungen festhalten:** Jede getroffene oder bewusst verschobene Entscheidung steht als eigenes ADR in `docs/adr/`.
4. **Kleine Schritte** (Prinzip 4): Umbauten erhalten das Verhalten, sind durch Tests abgesichert und trennen Verschieben und Verhaltensänderung in getrennte Commits.

Rahmenbedingungen: ein Entwickler, ein Benutzer, weniger als 50 Wohnungen, eine PostgreSQL-Datenbank, kein verteiltes System. Das Backend hat rund 10'000 Zeilen in zwei Schichten: `backend/src/routes` (HTTP) und `backend/src/services` (Fachlogik und Datenzugriff).

## Qualitätsszenarien

Die Szenarien beschreiben Auslöser und Messgrösse, ohne einen Entwurf vorauszusetzen. Der Stand ist am Code vom Oktober 2026 gemessen.

| Nr. | Merkmal | Szenario | Messgrösse | Stand |
| --- | --- | --- | --- | --- |
| Q1 | Änderbarkeit | Der Liegenschaftsverwalter braucht einen neuen Verteilschlüssel aus Fläche und Zimmerzahl. | Ohne Code-Änderung. | ✅ Eigene Verteilschlüssel mit Formel (`formula.service.ts`) |
| Q2 | Änderbarkeit | Ollama wird durch einen anderen LLM-Anbieter ersetzt. | Änderungen nur in `llm.service.ts` und `config/llm.ts`. | ⚠️ Fast: `routes/invoices.ts` importiert `isOllamaAvailable` |
| Q3 | Änderbarkeit | Eine Gesetzesänderung betrifft die Berechnung der Nebenkostenabrechnung. | Änderungen nur in den Berechnungsservices (`calculation`, `prorating`, `distribution-key`, `formula`, `heating-profile`); keine Route, kein Rendering. | ✅ Die Berechnung liegt in diesen Services |
| Q4 | Änderbarkeit | Das PDF-Layout der Abrechnung ändert sich. | Änderungen nur im Rendering (`pdf.service.ts`), keine an der Berechnung. | ✅ |
| Q5 | Testbarkeit | Die Abrechnung wird ohne HTTP und ohne PDF berechnet und getestet. | Ein Test ruft die Abrechnungserstellung als Funktion auf. | ✅ `generateStatement`, getestet in `statement-creation.pg.test.ts` |
| D1 | Datenintegrität | Eine versendete oder bezahlte Abrechnung wird bearbeitet. | Beträge und Positionen bleiben unverändert. | ✅ `updateStatement` lehnt ab; Mietvertrag mit Abrechnung nicht löschbar |
| D2 | Datenintegrität | Die Abrechnungserstellung bricht mitten im Schreiben ab. | Keine Abrechnung ohne ihre Positionen. | ✅ `db.transaction` in `statement.service.ts` |
| S1 | Sicherheit | Ein Aufruf ohne gültige Sitzung erreicht das BFF oder das Backend. | Antwort 401 oder Umleitung zur Anmeldung; der Browser sieht nie ein Token. | ✅ `auth-guard.test.ts`, `auth.pg.test.ts` |
| P1 | Performance | Der Verwalter erstellt die Abrechnungen einer Liegenschaft mit 50 Wohnungen. | Unter 60 s (Ziel aus `docs/tech-stack.md`). | ❓ Nicht gemessen |
| R1 | Resilienz | Ollama ist nicht erreichbar. | Rechnungen lassen sich trotzdem erfassen und von Hand kategorisieren. | ✅ Szenario „Neu kategorisieren ohne laufende KI“ |
| R2 | Resilienz | Die Datenbank geht verloren. | Wiederherstellung mit höchstens einem Tag Datenverlust (PRD: tägliches Backup). | ❌ Kein Backup eingerichtet |

Die Liste ist ein Vorschlag. Sie gilt, sobald sie im ADR bestätigt ist (Schritt 1).

## Strukturelle Mängel

Diese Punkte verletzen keine Messgrösse, machen aber die bestehende Schichtung unsauber. Sie werden behoben, wenn der betroffene Code ohnehin angefasst wird.

- `config.service.ts` (Konfiguration) importiert `heatingProfileExists` und `distributionKeyExists` aus den Fachservices.
- `db/demo-data.ts` importiert `statement.service` und `statement-pdf.service`. Das ist für die Demodaten gewollt, gehört aber nicht unter `db/`, sondern zu den Skripten.
- `routes/invoices.ts` nennt Ollama beim Namen (siehe Q2).
- `invoice.service.ts` (`deleteInvoice`) prüft nicht, ob eine Rechnung in einer Abrechnung steckt. Rechnungen und Abrechnungspositionen sind nicht verknüpft; ob eine Verknüpfung nötig ist, entscheidet ein Szenario, nicht dieser Plan.

## Umsetzung

### Schritt 1: Szenarien bestätigen, Entscheidungen festhalten

- Qualitätsszenarien bestätigen, ergänzen oder streichen.
- Je Entscheidung ein kurzes ADR in `docs/adr/`. Startbestand:
  - Zwei Schichten (Routen, Services) statt Modulordner, solange alle Szenarien erfüllt sind.
  - Ein Modell und eine Sprache (`UBIQUITOUS_LANGUAGE.md`), keine Bounded Contexts.
  - Lese-Joins über Fachbereiche sind erlaubt; die Datenbank ist eine einzige mit Foreign Keys.
  - Die bewusst verschobenen Massnahmen (siehe unten).

Fertig, wenn: Die Szenarien sind bestätigt und die ADRs liegen vor.

### Schritt 2: Offene Szenarien schliessen

Nur für Szenarien, die nicht erfüllt sind:

- **R2:** tägliches Backup der Datenbank in `docker-compose.prod.yml` und eine dokumentierte, einmal geprobte Wiederherstellung.
- **P1:** Abrechnungserstellung für 50 Wohnungen einmal messen. Wenn das Ziel verfehlt wird, ein eigenes Szenario mit Massnahme.
- **Q2:** `isOllamaAvailable` in einen anbieterneutralen Namen umbenennen.

Fertig, wenn: Alle bestätigten Szenarien sind erfüllt.

### Schritt 3: Stopp

Der Umbau endet hier. Weitere Massnahmen nur, wenn ein Szenario nicht mehr erfüllt ist oder ein neues hinzukommt. Die Szenarien werden bei jeder grösseren Änderung neu bewertet.

Bereits erledigt (vor diesem Plan): Die Abrechnungserstellung ist aus `routes/statements.ts` in `statement.service.ts` und `statement-pdf.service.ts` gewandert (Q5, D2).

## Wenn ein Szenario einen Schnitt verlangt

Falls ein Änderbarkeits-Szenario später nicht mehr erfüllt ist, weil Änderungen über zu viele Services streuen, bildet dieser Abschnitt den Ausgangspunkt. Er ist eine Entscheidungshilfe, kein Auftrag.

**Wo sich Aufwand lohnt** (Distillation nach Evans):

- **Kern: Nebenkostenabrechnung.** Verteilschlüssel, Proration, Heizprofile, Saldo. Hier stecken die fachliche Komplexität und der Wert des Produkts.
- **Unterstützend: Liegenschaften und Rechnungen.** Stammdaten, Erfassung, Kategorisierung.
- **Generisch: Rendering (PDF, QR-Rechnung), Mail, Authentifizierung, Konfiguration.** Austauschbare Technik.

**Mögliche Module** entlang der Abschnitte von `UBIQUITOUS_LANGUAGE.md`:

| Modul | Services |
| --- | --- |
| Liegenschaftsverwaltung (`rental`) | `building`, `apartment`, `tenant`, `contract` |
| Rechnungswesen (`costs`) | `invoice`, `category`, `llm`, `utility-validation` |
| Nebenkostenabrechnung (`settlement`) | `distribution-key`, `formula`, `heating-profile`, `calculation`, `prorating`, `statement`, `statement-pdf`, `reminder`, `reminder-letter`, `document` |
| Infrastruktur | `pdf`, `qr-bill`, `reminder-pdf`, `config`, `conflict`, `default-setting`, `mail/`, `middleware/`, `db/` |

**Abhängigkeitsrichtung:** `settlement` importiert `costs` und `rental`, `costs` importiert `rental`; Infrastruktur importiert kein Fachmodul. Heutige Abweichungen:

- `contract.service.ts` liest `utility_statements` (Löschschutz, D1). Als Lese-Zugriff zulässig oder als Funktion aus `settlement` zu exportieren.
- `invoices.distribution_key_id` verweist auf `distribution_keys`, und `invoice.service.ts` joint die Tabelle. Damit hängt `costs` an `settlement`. Vor einem Schnitt ist zu entscheiden, ob der Verteilschlüssel zu `costs` gehört oder der Lese-Join erlaubt bleibt.
- `config.service.ts` und `db/demo-data.ts` (siehe Strukturelle Mängel).

`fallow` kann Architekturgrenzen prüfen (Zonen und Regeln in `.fallowrc.json`, Anzeige mit `npx fallow list --boundaries`); das wäre die Prüfung in CI.

## Bewusst nicht umgesetzt

| Massnahme | Einführen, wenn |
| --- | --- |
| Modulordner mit `index.ts` und Boundary-Check | ein Änderbarkeits-Szenario wegen gestreuter Änderungen nicht erfüllt ist |
| In-Process Domain Events | ein zweiter Abnehmer für dasselbe Ereignis existiert oder Verarbeitung asynchron sein muss |
| Value Objects (`Money`, `DateRange`), typisierte IDs | ein Rundungs- oder Verwechslungsfehler auftritt, den Typen verhindert hätten |
| Read-Models / Denormalisierung | eine Leseabfrage messbar zu langsam ist (P1) |
| Anti-Corruption Layer | ein externes System mit eigenem Modell angebunden wird (z. B. Bank, Buchhaltung) |
| Repository-Schicht | die Datenbank oder das ORM gewechselt wird |
| Getrennte Bounded Contexts | ein zweites Team oder ein abweichendes Modell entsteht |
| Umbau des BFF (`src/lib/server`) | das BFF mehr als Proxy, Cookies und XSRF übernimmt |

## Verifikation

- Die Checkliste aus `CLAUDE.md` ist grün (`npm run test:coverage`, `npm run lint`, `npm run check`, `cd backend && bun run test && bun run type-check`, betroffene E2E-Szenarien).
- Die Stand-Spalte der Qualitätsszenarien ist nachgeführt.
- `implementation_plan.md` ist nachgeführt.

## Risiken

- **Der Plan wächst wieder.** Jede Ergänzung braucht ein Szenario, das ohne sie nicht erfüllt ist.
- **Szenarien veralten unbemerkt.** Die Stand-Spalte nennt, wo möglich, den Test, der das Szenario belegt. P1 und R2 haben noch keinen.
