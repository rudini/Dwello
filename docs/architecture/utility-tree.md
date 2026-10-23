# Quality Attribute Utility Tree (Phase 1)

> **Entwurf, nicht vom Team freigegeben.** Stand 23.10.2026. Phase 1 nach ATAM und Continuous Architecture; Eingaben: `docs/architecture/baseline.md` (Phase 0), `tools/arch-baseline/out/*.csv`, Repo, CI-Historie und die Antworten des Product Owners vom 23.10.2026.

**Herkunft jeder Zahl:**

- **gemessen (Phase 0):** aus `baseline.md` bzw. `tools/arch-baseline/out/`
- **gemessen (CI):** aus der GitHub-Actions-Historie vom 23.10.2026 (Stichprobe, nicht Phase 0; Läufe unten genannt)
- **aus Repo/Config:** steht in Code, Konfiguration oder Doku des Repos
- **vom Nutzer bestätigt:** Antwort des Product Owners am 23.10.2026
- **Annahme:** weder belegt noch bestätigt; steht unter «Offene Annahmen»

Bestehende Szenarien aus `docs/migration-mva.md` (Q1–Q5, D1–D2, S1–S2, P1–P2, R1–R2) sind hier aufgenommen oder zusammengeführt. Sie gelten erst, wenn ein ADR sie bestätigt (`migration-mva.md`, Schritt 1). Dieser Baum soll das vorbereiten.

## 1. Kontext

| Thema | Aussage | Herkunft |
|---|---|---|
| Zweck | Private Vermieter in der Schweiz verwalten Liegenschaften, Wohnungen, Mieter, Mietverträge und Rechnungen (von der KI kategorisiert). Dazu kommen Nebenkostenabrechnungen mit PDF und QR-Rechnung. | aus Repo/Config (`CLAUDE.md`, `README.md`) |
| Nutzer | Pro Installation ein Benutzer, höchstens 50 Wohnungen, Nutzung wenige Male im Jahr. | aus Repo/Config; für die nächsten 12 Monate vom Nutzer bestätigt |
| Betrieb | Jede Installation läuft selbst betrieben mit Docker Compose (Postgres 16, Ollama). Dazu kommt eine öffentliche Demo auf einer Oracle-VM (2 OCPU ARM, 12 GB, ohne GPU), die jede Nacht zurückgesetzt wird. Ein gehostetes Angebot ist nicht geplant. | aus Repo/Config (`docker-compose.prod.yml`, `deploy/demo/README.md`); vom Nutzer bestätigt |
| Daten | Namen und Adressen von Mietern, IBAN, Beträge, Belege (Rechnungsdateien und PDFs liegen in der DB). Es gilt das DSG. Bei einer externen KI gehen Belege an den Anbieter. Aufbewahrung 10 Jahre. | aus Repo/Config (`README.md`, `docs/installation.md` §5, PRD §7.3) |
| Releases | Jeder Merge auf `main` wird getaggt und als Release veröffentlicht. Ziel ist ein Takt von einer Version pro Woche an die Vermieter. | aus Repo/Config (`release.yml`); Takt vom Nutzer bestätigt |
| Backup | Manuelles `pg_dump` und Restore sind dokumentiert (`docs/installation.md` §5). Es gibt keine Automatik, keinen Test und keine Überwachung. | aus Repo/Config |
| Teuerster Fehler | Datenverlust | vom Nutzer bestätigt |
| Sofort erkennbar | Fehlgeschlagenes Backup; fehlgeschlagener Start oder Migration | vom Nutzer bestätigt |
| Verfügbarkeit | Der Betreiber ist zuständig, Dwello liefert Backup und Restore mit. Die 99,5 % aus PRD §7.4 gelten nicht als Ziel von Dwello. | vom Nutzer bestätigt |

## 2. Baum

```
Dwello-Nutzen
├─ Änderbarkeit
│  ├─ Form eines Felds an einem Ort .......... Ä1 Neues Feld an einer Entität            (H/H)
│  └─ Fachregel an einem Ort ................. Ä4 Fachregel nur im Backend              (H/M)
├─ Verfügbarkeit / Resilienz
│  ├─ Kein Datenverlust ...................... R1 Backup und Restore mitgeliefert       (H/M)
│  └─ Sicheres Update ........................ U1 Wöchentliches Update mit Migration    (H/H)
├─ Betreibbarkeit / Beobachtbarkeit
│  └─ Fehler sofort erkennen ................. O1 Fehlgeschlagenes Backup sichtbar      (H/M)
├─ Testbarkeit
│  └─ Schnelle, verlässliche Rückmeldung ..... T1 CI auf PR und main ≤ 15 min, main grün (H/H)
├─ Performance
│  └─ Abrechnungslauf ........................ P1 50 Wohnungen samt PDFs ≤ 30 s         (M/M)
└─ Security
   └─ Sitzung und Mieterdaten geschützt ...... S1 Kein Token lesbar, 401 ohne Sitzung    (H/L)
```

**Weggelassen, mit Grund:**

| Attribut / Szenario | Grund |
|---|---|
| Verfügbarkeit 99,5 % (PRD §7.4) | Dafür ist der Betreiber zuständig (vom Nutzer bestätigt). |
| Skalierbarkeit, Last, Mandantenfähigkeit | Ein Benutzer und höchstens 50 Wohnungen pro Installation, kein gehostetes Angebot in 12 Monaten (vom Nutzer bestätigt). |
| P2 API-Antwortzeit < 500 ms p95 (`docs/tech-stack.md`) | Es gibt kein Indiz für ein Problem. Der Wert lässt sich im Lauf für P1 mitmessen (Annahme A5). |
| Usability, Barrierefreiheit | CI sichert sie ab (axe mit 0 Verstössen, Personas; `CLAUDE.md` «Design-Regeln»). Sie treiben die Architektur nicht. |
| Ä2 Statusregel, Ä3 Dateien pro Feature (Baseline §7) | Ä2 geht in Ä4 auf. Ä3 bleibt als Leitplanke in der Baseline, Ä1 und Ä4 erklären sie. |
| Q1–Q5, D1, D2 (`migration-mva.md`) | Erfüllt und mit Tests belegt (✅). Sie bleiben dort und treiben keine Änderung. |

## 3. Szenarien

### Ä1 Neues Feld an einer bestehenden Entität

- **Auslöser:** Der Product Owner verlangt ein neues Attribut, z. B. das Land der Korrespondenzadresse (PR #361).
- **Umgebung:** Entwicklung. Die Entität hat eine Liste, ein Detail und ein Formular.
- **Reaktion:** Das Feld ist in DB, API, BFF und UI verfügbar und wird im Backend geprüft.
- **Messgrösse und Ziel:** Produktivdateien ausserhalb der DB, die das Feld von Hand deklarieren: **Median ≤ 4, P90 ≤ 8** (vom Nutzer bestätigt, Baseline §7).
- **Heute:** Median **6**, P90 **19**, Max 59 (`apartments.number`) über 125 Felder (gemessen, Phase 0, `m4-field-spread.csv`). `schema.ts` ↔ `types.ts`: 26 gemeinsame Änderungen ohne Import (gemessen, Phase 0).
- **Fitness Function:** `tools/arch-baseline/run.sh` → `m4-field-spread.csv` vierteljährlich (Baseline §7, «Messrhythmus»). Schneller wirkt ein CI-Check pro PR: Ein neues Feld in `schema.ts` darf in höchstens 4 weiteren Produktivdateien als Schlüssel auftauchen (Heuristik aus `05-knowledge`).

### Ä4 Fachregel nur im Backend

- **Auslöser:** Eine Fachregel oder eine fachliche Formularprüfung ändert sich.
- **Umgebung:** Entwicklung. Die Regel steht heute in Backend und BFF.
- **Reaktion:** Die Änderung erfolgt nur im Backend. Der BFF reicht Ergebnis oder Fehlercode weiter (`backendMessage`).
- **Messgrösse und Ziel:** fachliche Status-Vergleiche und Prüfregeln im BFF: **0** (vom Nutzer bestätigt, Entscheid 23.10.2026, #717).
- **Heute:** **9** Status-Vergleiche in 5 Dateien, **10** Prüfregeln in 4 Dateien (gemessen, Phase 0). Seither sind mehrere #717-PRs gemergt (#641, #646, #649, #762, #763, #767). Ein neuer Wert ist **unbekannt**, bis `run.sh` erneut läuft.
- **Fitness Function:** CI-Check auf `src/lib/server/**`, `src/routes/**/+page.server.ts` und `+server.ts`: Ein Vergleich gegen einen Statuswert oder eine verankerte Regex schlägt fehl, ausser er steht auf einer Allowlist für technische Prüfungen (UUID, ISO-Datum als Query-Parameter, JWT-Dauer).

### R1 Backup und Restore mitgeliefert

- **Auslöser:** Die Datenbank geht verloren (Disk, Fehlbedienung, missglücktes Update).
- **Umgebung:** Selbst betriebene Installation, VM wie die Demo.
- **Reaktion:** Aus dem mitgelieferten, automatisch erstellten Backup stellt der Betreiber den letzten Stand wieder her. Das Backup umfasst die DB samt Belegen und die Schlüssel (`dwello_secrets`).
- **Messgrösse und Ziel:** Datenverlust **≤ 24 h** (aus Repo/Config: PRD §7.4, tägliches Backup; Dwello liefert Backup mit: vom Nutzer bestätigt). Restore **≤ 5 min** (vom Nutzer bestätigt).
- **Heute:** Backup und Restore sind manuell dokumentiert (`docs/installation.md` §5). Es gibt keine Automatik und keinen Test (aus Repo/Config). Die Restore-Dauer ist **unbekannt**, ebenso die DB-Grösse einer Installation nach einigen Jahren mit Belegen (Annahme A2).
- **Fitness Function:** CI- oder Nacht-Job: Demo-Daten laden → Backup mit dem mitgelieferten Mechanismus → leere DB und leeres Schlüssel-Volume → Restore → Zeilenzahlen pro Tabelle, Summen der Abrechnungen und ein entschlüsseltes Geheimnis identisch, Dauer ≤ 5 min. Dazu ein Lasttest mit einer DB in der Grösse von 10 Jahren (A2).

### U1 Wöchentliches Update mit Migration

- **Auslöser:** Der Betreiber installiert das wöchentliche Update. Es enthält eine Migration.
- **Umgebung:** Selbst betrieben, echte Daten aus mehreren Jahren, Update laut `docs/installation.md` §5 (`git pull`, `up -d --build`).
- **Reaktion:** Das Update läuft durch. Schlägt es fehl, ist der Fehler sofort erkennbar, und der Stand vor dem Update lässt sich ohne Datenverlust wiederherstellen.
- **Messgrösse und Ziel:** Datenverlust **0** (vom Nutzer bestätigt: Datenverlust ist der teuerste Fehler). **100 %** der Releases sind als Upgrade von der Vorversion mit Daten getestet (Vorschlag). Ein fehlgeschlagener Start oder eine fehlgeschlagene Migration zeigt sich als «unhealthy», und das Log nennt die Ursache (vom Nutzer bestätigt: muss sofort erkennbar sein).
- **Heute:**
  - Migrationen laufen beim Start des Backends (`bun scripts/migrate.ts && exec bun run src/index.ts`), je eine Transaktion pro Migration (`backend/src/db/migrate.ts`). Ein Backup vor der Migration gibt es nicht (aus Repo/Config).
  - E2E testet nur Migrationen auf leere DB («migrated fresh before each run», `docs/test-pyramid.md`). Ein Upgrade-Test mit Daten existiert nicht (aus Repo/Config).
  - Jeder Merge erzeugt ein Release. Den wöchentlichen Takt setzt heute nichts um (aus Repo/Config: `release.yml`).
- **Fitness Function:** CI-Job pro Release: Compose mit dem letzten Tag und Demo-Daten starten → auf HEAD aktualisieren → Healthcheck grün, Zeilenzahlen und Summen gleich. Dazu ein Negativtest: Eine absichtlich fehlschlagende Migration lässt die Daten unverändert und macht den Container «unhealthy» mit lesbarer Ursache.

### O1 Fehlgeschlagenes Backup ist sichtbar

- **Auslöser:** Das tägliche Backup schlägt fehl oder fehlt.
- **Umgebung:** Betrieb, selbst betrieben.
- **Reaktion:** Die App zeigt einen Hinweis. Der Healthcheck meldet den Zustand, und das Log nennt die Ursache (vom Nutzer bestätigt).
- **Messgrösse und Ziel:** Ein fehlgeschlagenes oder über **26 h** altes Backup ist spätestens beim nächsten Öffnen der App sichtbar und sofort im Healthcheck (Schwelle 26 h: Annahme A3).
- **Heute:** nicht vorhanden. `/health` und Compose-Healthchecks gibt es (aus Repo/Config), sie kennen kein Backup.
- **Fitness Function:** E2E-Szenario «altes Backup → Hinweis sichtbar» und ein Backend-Test: `/health` meldet einen Fehler, wenn das letzte Backup älter als die Schwelle ist.

### T1 Schnelle und verlässliche CI

- **Auslöser:** Ein PR wird gepusht bzw. auf `main` gemergt.
- **Umgebung:** GitHub Actions. Auf PRs laufen Chromium und API, auf `main` alle drei Browser (`ci.yml`, `docs/test-pyramid.md`).
- **Reaktion:** Volle Rückmeldung, ob grün oder rot. `main` bleibt nach dem Merge grün.
- **Messgrösse und Ziel:** Wanduhrzeit vom Push bis zum Ergebnis **≤ 15 min** auf PR **und** auf `main`, und `main` grün (vom Nutzer bestätigt).
- **Heute** (gemessen, CI):
  - PR: 11 grüne Läufe (Runs 900–918), 9,5–23,6 min, Median etwa 18 min. Läufe von etwa 10 min sind PRs, deren letzter Push nur Doku änderte.
  - `main`: grüne Läufe 43 min (Run 864), 43 min (Run 868), 79 min (Run 880).
  - Kritischer Pfad in Run 868 ist E2E-Shard 5 mit 41 min Testschritt. Die Shards brauchen 20–41 min, axe 11–16 min, Unit-Tests 4 min, Lint und Typen 1,5 min.
  - Von den letzten 20 abgeschlossenen Push-Läufen auf `main` waren 3 grün, 4 rot und 13 abgebrochen, weil ein neuerer Merge sie ersetzte.
  - Umfang: 851 Szenarien in 53 Feature-Dateien, 2 Worker pro Shard (aus Repo/Config).
- **Fitness Function:** Ein Job am Ende von `ci.yml` schreibt die Laufdauer als Annotation und schlägt bei mehr als 15 min auf `main` Alarm. Dazu eine wöchentliche Auswertung der Quote grüner Läufe auf `main` über die Actions-API.

### P1 Abrechnungslauf für 50 Wohnungen

- **Auslöser:** Der Vermieter erstellt im Assistenten die Abrechnungen einer Liegenschaft mit 50 Wohnungen samt PDFs.
- **Umgebung:** VM wie die Demo (2 OCPU ARM, 12 GB, ohne GPU) (vom Nutzer bestätigt).
- **Reaktion:** Der Assistent zeigt den Fortschritt, und alle Abrechnungen entstehen.
- **Messgrösse und Ziel:** **≤ 30 s** vom Start bis zur letzten Abrechnung (vom Nutzer bestätigt). Damit sind die 10 s und 60 s im PRD ersetzt.
- **Heute:** **unbekannt**. Die Schleife über die Mietverträge läuft im BFF (`src/lib/server/statement-generation.ts`, aus Repo/Config).
- **Fitness Function:** Benchmark-Skript, das 50 Mietverträge anlegt und den Lauf über die BFF-Route misst, wöchentlich auf der Demo-VM. Dazu ein grober Wächter in CI (z. B. ≤ 15 s auf dem Runner, Annahme A4).

### S1 Sitzung und Mieterdaten geschützt

- **Auslöser:** Ein Skript im Browser versucht, die Sitzung zu lesen, oder ein Request ohne gültige Sitzung erreicht BFF oder Backend.
- **Umgebung:** Produktion.
- **Reaktion:** Das Skript findet kein Token. Der Request bekommt 401 oder eine Weiterleitung zum Login.
- **Messgrösse und Ziel:** **0** lesbare Tokens im Browser. **100 %** der Endpunkte antworten ohne Sitzung mit 401 (Vorschlag).
- **Heute:** 401 ist getestet (`auth-guard.test.ts`, `auth.pg.test.ts`). HttpOnly ist so gebaut, aber nicht getestet (aus Repo/Config: `migration-mva.md` S1 ✅, S2 ❓).
- **Fitness Function:** E2E: Nach dem Login enthält `document.cookie` kein JWT. Ein API-Test läuft über alle registrierten Routen ohne Sitzung und erwartet 401.

## 4. Priorisierungsmatrix

Wichtigkeit = geschäftliche Wichtigkeit, Schwierigkeit = Abstand zum Ziel. Die Matrix ist vom Nutzer bestätigt (23.10.2026), mit zwei Änderungen: S1 Wichtigkeit H, T1 gilt für PR und `main`.

| | Schwierigkeit **H** | **M** | **L** |
|---|---|---|---|
| **Wichtigkeit H** | **Ä1, U1, T1** | Ä4, R1, O1 | S1 |
| **M** | | P1 | |
| **L** | | | |

| ID | Wichtigkeit | Begründung | Schwierigkeit | Begründung |
|---|---|---|---|---|
| Ä1 | H | Der PO hat die Zielwerte am 23.10. festgelegt. Ein neues Feld ist die häufigste Änderung (`db:schema` in 31 % der Features). | H | Median 6 → 4, P90 19 → 8. Ohne gemeinsamen Vertrag zwischen den Schichten sinkt der Wert nicht (0 Importe FE/BFF → Backend). |
| Ä4 | H | Entscheid des PO, #717 | M | #717 ist mit mehreren PRs schon weit gekommen. Der Rest ist nicht neu gemessen. |
| R1 | H | Datenverlust ist der teuerste Fehler. | M | Das Verfahren ist dokumentiert, aber nicht automatisiert und nicht getestet. Ob 5 min für den Restore reichen, ist unbekannt (A2). |
| U1 | H | Wöchentliches Update; Datenverlust und fehlgeschlagene Migration müssen erkennbar sein. | H | Kein Backup vor der Migration, kein Upgrade-Test mit Daten. Migrationen gehen nur vorwärts, ein Zurück gibt es nur per Restore. |
| O1 | H | Ein fehlgeschlagenes Backup muss sofort erkennbar sein. | M | Es fehlt ganz, hängt aber nur an R1. |
| T1 | H | Der PO hat das strengste Ziel gewählt, für PR und `main`. | H | `main` 43–79 min, also das Drei- bis Fünffache des Ziels. 4 von 7 abgeschlossenen Läufen auf `main` waren rot. |
| P1 | M | Selten genutzt, der Assistent zeigt den Fortschritt. | M | Nicht gemessen. Die Schleife im BFF ist ein Verdacht, kein Beleg. |
| S1 | H | Vom Nutzer auf H gesetzt | L | Gebaut. Es fehlt ein Test. |

**Kandidaten für die ersten Refactorings (H/H):** Ä1, U1, T1. **Quick Win (H/L):** S1.

## 5. Offene Annahmen

| ID | Annahme | Betrifft | Zu klären durch |
|---|---|---|---|
| A1 | Das Release für die Vermieter ist eine Auswahl der Merge-Tags, z. B. der Tag von Montag. Die Tags pro Merge bleiben. | U1 | Product Owner |
| A2 | Eine Installation enthält nach 10 Jahren Belege für höchstens 50 Wohnungen. Der Restore schafft das in ≤ 5 min. Grösse unbekannt. | R1 | Messung mit synthetischer DB |
| A3 | Schwelle «Backup zu alt» = 26 h (täglich plus Puffer) | O1 | Product Owner |
| A4 | Ein CI-Wächter für P1 auf dem GitHub-Runner sagt etwas über die Demo-VM aus. | P1 | Einmal auf beiden messen |
| A5 | P2 (< 500 ms p95) ist erfüllt und braucht kein eigenes Szenario. | P2 | Im Lauf für P1 mitmessen |
| A6 | Die rote Quote auf `main` (4/7) kommt von Rennen zwischen parallelen Merges und Browser-Unterschieden, nicht von echten Fehlern. Ursachen nicht untersucht. | T1 | Auswertung der roten Läufe 861, 876, 886, 916 |
| A7 | Datenschutz der Backup-Dateien (enthalten alle Mieterdaten und Schlüssel) ist Sache des Betreibers. Verschlüsselung at rest ist «Vision, nicht geplant» (PRD, #111, #719, #722). | R1, S1 | Product Owner |
