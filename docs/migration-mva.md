# Architektur: Minimum Viable Architecture für Dwello

## Ziel

Dwello soll eine **Minimum Viable Architecture (MVA)** im Sinne von _Continuous Architecture in Practice_ (Erder, Pureur, Woods) haben: die kleinste Architektur, die die Qualitätsanforderungen erfüllt, und nicht mehr.

Daraus folgt das Vorgehen:

1. **Qualitätsmerkmale vor Funktionen** (Prinzip 2): Die Architektur wird an den Qualitätsszenarien unten gemessen, nicht an einem Zielbild.
2. **Entscheidungen verzögern** (Prinzip 3): Eine Architekturänderung braucht ein Szenario, das heute nicht erfüllt ist. Ohne ein solches Szenario bleibt die Struktur, wie sie ist.
3. **Entscheidungen festhalten:** Jede getroffene oder bewusst verschobene Entscheidung steht als eigenes ADR in `docs/adr/`.
4. **Kleine Schritte:** Umbauten erhalten das Verhalten, sind durch Tests abgesichert, und Verschieben und Verhaltensänderung landen in getrennten Commits.

Rahmenbedingungen: ein Entwickler, ein Benutzer, weniger als 50 Wohnungen, eine PostgreSQL-Datenbank, kein verteiltes System. Das Backend hat rund 10'000 Zeilen ohne Tests. Die Fachlogik liegt in zwei Schichten: `backend/src/routes` (HTTP) und `backend/src/services` (Fachlogik und Datenzugriff); daneben `db/`, `config/`, `mail/` und `middleware/`.

## Qualitätsszenarien

Szenario und Messgrösse setzen keinen Entwurf voraus; die Dateien in der Spalte „Stand und Nachweis“ zeigen, wo das Szenario heute erfüllt wird. Gemessen am Code vom Oktober 2026.

| Nr. | Merkmal | Szenario | Messgrösse | Stand und Nachweis |
| --- | --- | --- | --- | --- |
| Q1 | Änderbarkeit | Der Liegenschaftsverwalter braucht einen neuen Verteilschlüssel aus Fläche und Zimmerzahl. | Ohne Code-Änderung. | ✅ Eigene Formeln (`formula.service.ts`); `distribution-keys.feature` |
| Q2 | Änderbarkeit | Ollama wird durch einen anderen LLM-Anbieter mit OpenAI-kompatibler API ersetzt. | Ohne Code-Änderung, nur über die Konfiguration (`.env`); die Datenschutzerklärung deckt beide Fälle ab. | ✅ Jede OpenAI-kompatible API über `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL` (`config/llm.ts`); `invoice-categorization.pg.test.ts` |
| Q3 | Änderbarkeit | Eine Gesetzesänderung betrifft die Berechnung der Nebenkostenabrechnung. | Keine Änderung an Routen, UI oder Rendering. | ✅ Berechnung in `calculation`, `prorating`, `distribution-key`, `formula`, `heating-profile` |
| Q4 | Änderbarkeit | Das PDF-Layout der Abrechnung ändert sich. | Keine Änderung an der Berechnung. | ✅ `pdf.service.ts`; neue Felder zusätzlich in `statement-pdf.service.ts` |
| Q5 | Testbarkeit | Die Berechnung einer Abrechnung wird geprüft. | In einem automatisierten Test ohne Webserver und ohne PDF. | ✅ `generateStatement`; `statement-creation.pg.test.ts` |
| D1 | Datenintegrität | Eine versendete, überfällige oder bezahlte Abrechnung soll geändert oder gelöscht werden. | Abgelehnt; Beträge und Positionen bleiben unverändert. Ein Test belegt es. | ✅ Nur ein Entwurf lässt sich löschen, ergänzen oder in den Beträgen ändern (`statement.service.ts`); `statement-lock.pg.test.ts`. Ein Mietvertrag mit Abrechnung lässt sich nicht löschen |
| D2 | Datenintegrität | Die Abrechnungserstellung bricht mitten im Schreiben ab. | Keine Abrechnung ohne ihre Positionen. | ✅ `db.transaction` in `createStatement`; `statement-creation.pg.test.ts` („speichert keine Abrechnung, wenn …“) |
| S1 | Sicherheit | Ein Aufruf ohne gültige Sitzung erreicht das BFF oder das Backend. | Antwort 401 oder Umleitung zur Anmeldung. | ✅ `auth-guard.test.ts`, `auth.pg.test.ts` |
| S2 | Sicherheit | Ein Skript im Browser versucht, die Sitzung zu lesen. | Der Browser hat keinen Zugriff auf ein Token (HttpOnly-Cookie). | ❓ So gebaut (BFF), aber kein Test |
| P1 | Performance | Der Liegenschaftsverwalter erstellt im Assistenten die Abrechnungen einer Liegenschaft mit 50 Wohnungen, inklusive PDF. | Vom Start bis zur letzten Abrechnung unter 60 s auf der Zielhardware. | ❓ Nicht gemessen; die Schleife über die Mietverträge liegt im BFF (`src/lib/server/statement-generation.ts`). Die PRD nennt einmal 60 s und einmal 10 s; Schritt 1 legt den Wert fest |
| P2 | Performance | Der Liegenschaftsverwalter öffnet eine Liste oder das Dashboard. | API-Antwort unter 500 ms (p95), Ziel aus `docs/tech-stack.md`. | ❓ Nicht gemessen |
| R1 | Resilienz | Der LLM-Anbieter ist nicht erreichbar. | Rechnungen lassen sich trotzdem erfassen und von Hand kategorisieren. | ⚠️ Neu kategorisieren getestet (`invoice-detail.feature`); Erfassen fängt den Fehler ab (`categorizeWithKi`), aber ohne Test |
| R2 | Resilienz | Die Datenbank geht verloren. | Höchstens ein Tag Datenverlust, Wiederherstellung in unter einer Stunde, Probe monatlich (PRD). | ❌ Kein Backup eingerichtet |

Die Liste ist ein Vorschlag. Sie gilt, sobald sie im ADR bestätigt ist (Schritt 1).

## Strukturelle Mängel

Diese Punkte machen die Schichtung unsauber, ohne selbst ein Szenario zu verletzen. Sie werden behoben, wenn der betroffene Code ohnehin angefasst wird.

- `config.service.ts` (Konfiguration) importiert `heatingProfileExists` und `distributionKeyExists` aus den Fachservices.
- `db/demo-data.ts` importiert `statement.service` und `statement-pdf.service`. Das ist für die Demodaten gewollt, gehört aber nicht unter `db/`, sondern zu den Skripten.
- `routes/dashboard.ts` fragt die Datenbank selbst ab statt über einen Service.
- `reminder-pdf.ts` (Rendering) importiert den Typ von `reminder-letter.ts` (Fachlogik der Mahnung).
- `config/llm.ts` führt die Kategorien für den Prompt (`SWISS_UTILITY_CATEGORIES`) als zweite Liste neben der Tabelle `categories`; `utility-validation.service.ts` nutzt sie ebenfalls.

## Umsetzung

Bereits erledigt: Die Abrechnungserstellung ist aus `routes/statements.ts` in `statement.service.ts` und `statement-pdf.service.ts` gewandert, mit Transaktion (Q5, D2). Jede Abrechnung ausser dem Entwurf ist gesperrt, auch eine überfällige (D1).

### Schritt 1: Szenarien bestätigen, Entscheidungen festhalten

- Qualitätsszenarien bestätigen, ergänzen oder streichen; den Zielwert für P1 festlegen.
- Klären, ob eine Rechnung, die in einer Abrechnung steckt, gelöscht werden darf. `deleteInvoice` prüft es nicht, und Abrechnungspositionen verweisen nicht auf Rechnungen. Wenn nicht: als Szenario aufnehmen.
- Je Entscheidung ein kurzes ADR in `docs/adr/`. Startbestand:
  - Zwei Schichten (Routen, Services) statt Modulordner, solange alle Änderbarkeits-Szenarien erfüllt sind.
  - Ein Modell und eine Sprache (`UBIQUITOUS_LANGUAGE.md`), keine Bounded Contexts.
  - Lese-Joins über Fachbereiche sind erlaubt; die Datenbank ist eine einzige mit Foreign Keys.
  - Die bewusst verschobenen Massnahmen (siehe unten).

Fertig, wenn: Die Szenarien sind bestätigt und die ADRs liegen vor.

### Schritt 2: Offene Szenarien schliessen

Nur für Szenarien, die nicht erfüllt sind, je mit einem Test, der vorher fehlschlägt:

- **R2:** tägliches Backup der Datenbank in `docker-compose.prod.yml`, dokumentierte Wiederherstellung, erste Probe.
- **R1, S2:** fehlende Tests ergänzen.
- **P1, P2:** einmal messen. Wenn ein Ziel verfehlt wird, ein eigenes Szenario mit Massnahme.

Fertig, wenn: Alle bestätigten Szenarien sind erfüllt und belegt.

### Schritt 3: Stopp

Der Umbau endet hier. Weitere Massnahmen nur, wenn ein Szenario nicht mehr erfüllt ist oder ein neues hinzukommt. Die Szenarien werden bei jeder grösseren Änderung neu bewertet.

## Wenn ein Szenario einen Schnitt verlangt

Falls ein Änderbarkeits-Szenario später nicht mehr erfüllt ist, weil Änderungen über zu viele Services streuen, bildet dieser Abschnitt den Ausgangspunkt. Er ist eine Entscheidungshilfe, kein Auftrag.

**Wo sich Aufwand lohnt** (Distillation nach Evans):

- **Kern: Nebenkostenabrechnung.** Verteilschlüssel, Proration, Heizprofile, Saldo. Hier stecken die fachliche Komplexität und der Wert des Produkts.
- **Unterstützend: Liegenschaften und Rechnungen.** Stammdaten, Erfassung, Kategorisierung.
- **Generisch: Rendering (PDF, QR-Rechnung), Mail, Authentifizierung, Konfiguration.** Austauschbare Technik.

**Mögliche Module** entlang der Abschnitte von `UBIQUITOUS_LANGUAGE.md`:

| Modul | Services und weitere Dateien |
| --- | --- |
| Liegenschaftsverwaltung (`rental`) | `building`, `apartment`, `tenant`, `contract` |
| Rechnungswesen (`costs`) | `invoice`, `category`, `llm`, `utility-validation`, `config/llm.ts` |
| Nebenkostenabrechnung (`settlement`) | `distribution-key`, `formula`, `heating-profile`, `calculation`, `prorating`, `statement`, `statement-pdf`, `reminder`, `reminder-letter`, `document` |
| Infrastruktur | `pdf`, `qr-bill`, `reminder-pdf`, `config`, `conflict`, `default-setting`, `mail/`, `middleware/`, `db/` |

Jede Route gehört zum Modul ihres Services; `routes/dashboard.ts` liest über alle Module und bleibt ausserhalb.

**Abhängigkeitsrichtung:** `settlement` importiert `costs` und `rental`, `costs` importiert `rental`; Infrastruktur importiert kein Fachmodul. Heutige Abweichungen:

- `contract.service.ts` liest `utility_statements` (Löschschutz, D1). Als Lese-Zugriff zulässig oder als Funktion aus `settlement` zu exportieren.
- `invoices.distribution_key_id` verweist auf `distribution_keys`, und `invoice.service.ts` joint die Tabelle. Damit hängt `costs` an `settlement`. Vor einem Schnitt ist zu entscheiden, ob der Verteilschlüssel zu `costs` gehört oder der Lese-Join erlaubt bleibt.
- `config.service.ts`, `db/demo-data.ts` und `reminder-pdf.ts` (siehe Strukturelle Mängel).

`fallow` kann Architekturgrenzen prüfen (Zonen und Regeln in `.fallowrc.json`, Anzeige mit `npx fallow list --boundaries`); das wäre die Prüfung in CI. Heute sind keine Grenzen konfiguriert.

## Bewusst nicht umgesetzt

| Massnahme | Einführen, wenn |
| --- | --- |
| Modulordner mit `index.ts` und Boundary-Check | ein Änderbarkeits-Szenario wegen gestreuter Änderungen nicht erfüllt ist |
| In-Process Domain Events | ein zweiter Abnehmer für dasselbe Ereignis existiert oder Verarbeitung asynchron sein muss |
| Value Objects (`Money`, `DateRange`), typisierte IDs | ein Rundungs- oder Verwechslungsfehler auftritt, den Typen verhindert hätten |
| Read-Models / Denormalisierung | P2 nicht erfüllt ist |
| Anti-Corruption Layer | ein externes System mit eigenem Modell angebunden wird (z. B. Bank, Buchhaltung); dann mit eigenem Änderbarkeits-Szenario |
| Repository-Schicht | ein Szenario den Wechsel der Datenbank oder des ORM verlangt |
| Getrennte Bounded Contexts | ein zweites Team oder ein abweichendes Modell entsteht |
| Umbau des BFF (`src/lib/server`) | ein Szenario Logik im BFF verlangt, die über Proxy, Cookies, XSRF und das Zusammenstellen von Seiten hinausgeht |

## Verifikation

- Die Checkliste aus `CLAUDE.md` ist grün (`npm run test:coverage`, `npm run lint`, `npm run check`, `cd backend && bun run test && bun run type-check`, betroffene E2E-Szenarien).
- Die Spalte „Stand und Nachweis“ ist nachgeführt.
- `implementation_plan.md` ist nachgeführt.

## Risiken

- **Der Plan wächst wieder.** Jede Ergänzung braucht ein Szenario, das ohne sie nicht erfüllt ist.
- **Szenarien veralten unbemerkt.** Nur Szenarien mit einem Test bleiben verlässlich belegt. Heute fehlt er für Q3 und Q4 (statische Abhängigkeiten, prüfbar mit fallow-Grenzen), S2, P1, P2, R1 (Erfassen) und R2.
