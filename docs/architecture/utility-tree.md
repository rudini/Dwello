# Quality Attribute Utility Tree (Phase 1)

> **Vom Product Owner freigegeben am 23.10.2026.** Phase 1 nach ATAM und Continuous Architecture; Eingaben: `docs/architecture/baseline.md` (Phase 0), `tools/arch-baseline/out/*.csv`, Repo, CI-Historie und die Antworten des Product Owners vom 23.10.2026.

**Herkunft jeder Zahl:**

- **gemessen (Phase 0):** aus `baseline.md` bzw. `tools/arch-baseline/out/`
- **gemessen (CI):** aus der GitHub-Actions-Historie vom 23.10.2026 (Stichprobe, nicht Phase 0; Läufe unten genannt)
- **aus Repo/Config:** steht in Code, Konfiguration oder Doku des Repos
- **vom Nutzer bestätigt:** Antwort des Product Owners am 23.10.2026
- **Annahme:** weder belegt noch bestätigt; steht unter «Offene Annahmen»

Bestehende Szenarien aus `docs/archive/migration-mva.md` (Q1–Q5, D1–D2, S1–S2, P1–P2, R1–R2) sind hier aufgenommen oder zusammengeführt. Dieser Baum löst `migration-mva.md` ab (archiviert am 23.10.2026). ADRs in `docs/adr/` gibt es noch nicht.

## 1. Kontext

| Thema | Aussage | Herkunft |
|---|---|---|
| Zweck | Private Vermieter in der Schweiz verwalten Liegenschaften, Wohnungen, Mieter, Mietverträge und Rechnungen (von der KI kategorisiert). Dazu kommen Nebenkostenabrechnungen mit PDF und QR-Rechnung. | aus Repo/Config (`CLAUDE.md`, `README.md`) |
| Nutzer | Pro Installation ein Benutzer, höchstens 50 Wohnungen, Nutzung wenige Male im Jahr. | aus Repo/Config; für die nächsten 12 Monate vom Nutzer bestätigt |
| Betrieb | Jede Installation läuft selbst betrieben mit Docker Compose (Postgres 16, Ollama). Dazu kommt eine öffentliche Demo auf einer Oracle-VM (2 OCPU ARM, 12 GB, ohne GPU), die jede Nacht zurückgesetzt wird. Ein gehostetes Angebot ist nicht geplant. | aus Repo/Config (`docker-compose.prod.yml`, `deploy/demo/README.md`); vom Nutzer bestätigt |
| Daten | Namen und Adressen von Mietern, IBAN, Beträge, Belege (Rechnungsdateien und PDFs liegen in der DB). Es gilt das DSG. Bei einer externen KI gehen Belege an den Anbieter. Aufbewahrung 10 Jahre. | aus Repo/Config (`README.md`, `docs/installation.md` §5, PRD §7.3) |
| Releases | Heute wird jeder Merge auf `main` getaggt und als Release veröffentlicht. Künftig wird nur noch wöchentlich getaggt. | heute: aus Repo/Config (`release.yml`); künftig: vom Nutzer bestätigt |
| Backup | Manuelles `pg_dump` und Restore sind dokumentiert (`docs/installation.md` §5). Es gibt keine Automatik, keinen Test und keine Überwachung. | aus Repo/Config |
| Teuerster Fehler | Datenverlust | vom Nutzer bestätigt |
| Sofort erkennbar | Fehlgeschlagenes Backup; fehlgeschlagener Start oder Migration | vom Nutzer bestätigt |
| Verfügbarkeit | Der Betreiber ist zuständig, Dwello liefert Backup und Restore mit. Die 99,5 % aus PRD §7.4 gelten nicht als Ziel von Dwello. | vom Nutzer bestätigt |

## 2. Baum

```
Dwello-Nutzen
├─ Änderbarkeit
│  ├─ Form eines Felds an einem Ort .......... Ä1 Neues Feld an einer Entität            (H/H)
│  └─ Fachregel an einem Ort ................. Ä4 Fachregel nur im Backend              (H/H)
├─ Verfügbarkeit / Resilienz
│  ├─ Kein Datenverlust ...................... R1 Verschlüsseltes, kompatibles Backup   (H/H)
│  └─ Sicheres Update ........................ U1 Wöchentliches Update mit Migration    (H/H)
├─ Betreibbarkeit / Beobachtbarkeit
│  └─ Fehler sofort erkennen ................. O1 Fehlgeschlagenes Backup sichtbar      (H/M)
├─ Testbarkeit
│  └─ Schnelle, verlässliche Rückmeldung ..... T1 CI auf PR und main ≤ 15 min, main grün (H/H)
├─ Performance
│  ├─ Abrechnungslauf ........................ P1 50 Wohnungen samt PDFs ≤ 30 s         (M/M)
│  └─ Wartezeit nach einem Klick ............. P2 Liste oder Übersicht < 500 ms p95      (H/M)
└─ Security
   └─ Sitzung und Mieterdaten geschützt ...... S1 Kein Token lesbar, 401 ohne Sitzung    (H/L)
```

**Weggelassen, mit Grund:**

| Attribut / Szenario | Grund |
|---|---|
| Verfügbarkeit 99,5 % (PRD §7.4) | Dafür ist der Betreiber zuständig (vom Nutzer bestätigt). |
| Skalierbarkeit, Last, Mandantenfähigkeit | Ein Benutzer und höchstens 50 Wohnungen pro Installation, kein gehostetes Angebot in 12 Monaten (vom Nutzer bestätigt). |
| Usability, Barrierefreiheit | CI sichert sie ab (axe mit 0 Verstössen, Personas; `CLAUDE.md` «Design-Regeln»). Sie treiben die Architektur nicht. |
| Ä2 Statusregel, Ä3 Dateien pro Feature (Baseline §7) | Ä2 geht in Ä4 auf. Ä3 bleibt als Leitplanke in der Baseline, Ä1 und Ä4 erklären sie. |
| Q1–Q5, D1, D2 (`docs/archive/migration-mva.md`) | Erfüllt und mit Tests belegt (✅); die Belege stehen im Archiv. Ihre Tests bleiben bestehen, die Szenarien treiben keine Änderung. |

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
- **Umgebung:** Entwicklung. Die Regel steht heute in Backend, BFF und Frontend.
- **Reaktion:** Die Änderung erfolgt nur im Backend. BFF und Frontend zeigen Ergebnis oder Fehlercode (`backendMessage`). Eine Vorprüfung im Frontend ist erlaubt, wenn das Backend dieselbe Eingabe mit demselben Code ablehnt (#815).
- **Messgrösse und Ziel:** fachliche Status-Vergleiche, Prüfregeln und Datums-Ableitungen in BFF und Frontend: **0** (vom Nutzer bestätigt, Entscheid 23.10.2026, #717; Frontend seit 25.10.2026, #815). Eine Verzweigung nur nach dem Statuswert ist Anzeige, kein Verstoss (#815).
- **Heute:** **9** Status-Vergleiche in 5 Dateien, **10** Prüfregeln in 4 Dateien (gemessen, Phase 0). Nach H-28 Schritt 1–4 (bis #785) gemessen am 24.10.2026: **0** Status-Vergleiche, **1** fachliche Prüfregel (`validFrom` beim Löschen eines Akontos) neben 7 technischen; Zählung #13 im Backend (gemessen, `baseline.md` §7a). Danach prüft das Backend den Tag des Akontos; im BFF bleibt nur dessen Form als Pfadschutz (technisch): **0** fachliche Regeln (gelesen). Frontend am 25.10.2026 (#815, gemessen mit `decides`): 82 Zeilen in 35 Dateien, davon 41 Anzeige oder Format und **41** Ableitungen in 20 Dateien. Nach #815 Teil B bis D (25.10.2026, gemessen): **0** Ableitungen im Frontend; jede Fundstelle ist Anzeige, Format oder eine Vorprüfung mit Fehlercode und Backend-Test (Ziel erreicht).
- **Fitness Function:** CI-Check auf `src/lib/server/**`, `src/routes/**/+page.server.ts` und `+server.ts`: Ein Vergleich gegen einen Statuswert oder eine verankerte Regex schlägt fehl, ausser er steht auf einer Allowlist für technische Prüfungen (UUID, ISO-Datum als Query-Parameter, JWT-Dauer). Seit #815 derselbe Check über das Frontend (Komponenten und jede `.ts`-Datei unter `src/` ausser den BFF-Dateien), mit einer Allowlist für Anzeige und Format und einer für Vorprüfungen (Fehlercode und Backend-Test).

### R1 Verschlüsseltes, kompatibles Backup

- **Auslöser:** Die Datenbank geht verloren (Disk, Fehlbedienung, missglücktes Update), auch nachdem seit dem Backup ein Update installiert wurde.
- **Umgebung:** Selbst betriebene Installation, VM wie die Demo.
- **Reaktion:**
  - Dwello erstellt täglich automatisch ein Backup der DB samt Belegen und der Schlüssel (`dwello_secrets`).
  - Dwello verschlüsselt das Backup. Der Schlüssel kommt aus einem **Wiederherstellungscode**, den Dwello erzeugt und den der Vermieter ausdruckt oder notiert (vom Nutzer bestätigt).
  - Mit dem Code stellt der Betreiber den letzten Stand wieder her. Das gilt auch für ein Backup aus Release N, wenn bereits Release N+1 installiert ist: Die Migrationen laufen dann beim Restore automatisch nach (vom Nutzer bestätigt: Datenkompatibilität ist entscheidend).
- **Messgrösse und Ziel:**
  - Datenverlust **≤ 24 h** (aus Repo/Config: PRD §7.4, tägliches Backup; Dwello liefert Backup mit: vom Nutzer bestätigt).
  - Restore **≤ 5 min** (vom Nutzer bestätigt).
  - **100 %** der Releases sind getestet: Ein Backup der Vorversion lässt sich einspielen (vom Nutzer bestätigt).
  - **0** Backup-Dateien sind ohne Wiederherstellungscode lesbar (vom Nutzer bestätigt).
- **Heute:**
  - Backup und Restore sind manuell und unverschlüsselt dokumentiert (`docs/installation.md` §5). Es gibt keine Automatik und keinen Test (aus Repo/Config).
  - Der Dump enthält die Tabelle `schema_migrations`. Nach einem Restore zieht der Start fehlende Migrationen nach (`backend/src/db/migrate.ts`). Kompatibilität ist also angelegt, aber nicht getestet (aus Repo/Config).
  - Die Restore-Dauer ist **unbekannt**, ebenso die DB-Grösse nach einigen Jahren mit Belegen (Annahme A2).
- **Fitness Function:** Job pro Release:
  - Demo-Daten mit dem letzten Release-Tag laden.
  - Backup mit dem mitgelieferten Mechanismus erstellen.
  - Prüfen, dass die Datei ohne Code nicht lesbar ist (keine Klartext-Namen, kein `CREATE TABLE`).
  - Leere DB und leeres Schlüssel-Volume mit HEAD aufsetzen.
  - Restore mit dem Code.
  - Prüfen: Zeilenzahlen pro Tabelle, Summen der Abrechnungen und ein entschlüsseltes Geheimnis sind identisch, Dauer ≤ 5 min.
  - Dazu ein Lasttest mit einer DB in der Grösse von 10 Jahren (A2).

### U1 Wöchentliches Update mit Migration

- **Auslöser:** Der Betreiber installiert das wöchentliche Update. Es enthält eine Migration.
- **Umgebung:** Selbst betrieben, echte Daten aus mehreren Jahren, Update laut `docs/installation.md` §5 (`git pull`, `up -d --build`).
- **Reaktion:** Das Update läuft durch. Schlägt es fehl, ist der Fehler sofort erkennbar, und der Stand vor dem Update lässt sich ohne Datenverlust wiederherstellen.
- **Messgrösse und Ziel:** Datenverlust **0** (vom Nutzer bestätigt: Datenverlust ist der teuerste Fehler). **100 %** der Releases sind als Upgrade von der Vorversion mit Daten getestet (vom Nutzer bestätigt). Ein fehlgeschlagener Start oder eine fehlgeschlagene Migration zeigt sich als «unhealthy», und das Log nennt die Ursache (vom Nutzer bestätigt: muss sofort erkennbar sein).
- **Heute:**
  - Migrationen laufen beim Start des Backends (`bun scripts/migrate.ts && exec bun run src/index.ts`), je eine Transaktion pro Migration (`backend/src/db/migrate.ts`). Ein Backup vor der Migration gibt es nicht (aus Repo/Config).
  - E2E testet nur Migrationen auf leere DB («migrated fresh before each run», `docs/test-pyramid.md`). Ein Upgrade-Test mit Daten existiert nicht (aus Repo/Config).
  - Jeder Merge erzeugt ein Release (aus Repo/Config: `release.yml`). Künftig wird nur noch wöchentlich getaggt (vom Nutzer bestätigt). Umgesetzt ist das noch nicht.
- **Fitness Function:** CI-Job pro Release: Compose mit dem letzten Tag und Demo-Daten starten → auf HEAD aktualisieren → Healthcheck grün, Zeilenzahlen und Summen gleich. Dazu ein Negativtest: Eine absichtlich fehlschlagende Migration lässt die Daten unverändert und macht den Container «unhealthy» mit lesbarer Ursache.

### O1 Fehlgeschlagenes Backup ist sichtbar

- **Auslöser:** Das tägliche Backup schlägt fehl oder fehlt.
- **Umgebung:** Betrieb, selbst betrieben.
- **Reaktion:** Die App zeigt einen Hinweis. Der Healthcheck meldet den Zustand, und das Log nennt die Ursache (vom Nutzer bestätigt).
- **Messgrösse und Ziel:** Ist seit mehr als **einem Tag** kein Backup gelungen, sieht der Betreiber das spätestens beim nächsten Öffnen der App und sofort im Healthcheck (vom Nutzer bestätigt). Das Alter dient nur als Signal, dass die Sicherung steht. Ob ein Backup taugt, prüft R1.
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
  - Ursachen der 4 roten Läufe (gemessen, CI-Logs): keine kam von einem Fehler im gemergten Change. 3 instabile Tests (axe `target-size` nur mobil dunkel in Run 861; Firefox «Suche ohne Treffer» ohne Retry in Run 876; Reihenfolge der Kategorien im PDF in Run 916), 2 Shards am 60-min-Limit, weil `playwright install --with-deps` wegen eines langsamen apt-Spiegels 42–51 min brauchte (Runs 876, 886), 1 repoweiter Check auf Issue-Labels (`check-issues.mjs`, Run 886). Siehe A6.
  - Nach #777 (26.10., Run 40286548319, Merge von #831): PR etwa 13 min. `main` 27 min, die fünf E2E-Shards brauchten im Testschritt 12–26 min (92 min zusammen), axe 9–10 min. Seit #834 läuft E2E auf `main` in 12 Shards: Run 40293821912 brauchte nach dem Start der Jobs 19,6 min, der Testschritt 3,5–18 min, weil je ein Shard die Sprach-Bildschirmprüfungen eines Browsers trug. Seit #838 haben diese sechs eigene Shards.
  - Umfang: 851 Szenarien in 53 Feature-Dateien, 2 Worker pro Shard (aus Repo/Config).
- **Fitness Function:** Ein Job am Ende von `ci.yml` schreibt die Laufdauer als Annotation und schlägt bei mehr als 15 min auf `main` Alarm. Dazu eine wöchentliche Auswertung der Quote grüner Läufe auf `main` über die Actions-API.

### P1 Abrechnungslauf für 50 Wohnungen

- **Auslöser:** Der Vermieter erstellt im Assistenten die Abrechnungen einer Liegenschaft mit 50 Wohnungen samt PDFs.
- **Umgebung:** VM wie die Demo (2 OCPU ARM, 12 GB, ohne GPU) (vom Nutzer bestätigt).
- **Reaktion:** Der Assistent zeigt den Fortschritt, und alle Abrechnungen entstehen.
- **Messgrösse und Ziel:** **≤ 30 s** vom Start bis zur letzten Abrechnung (vom Nutzer bestätigt). Damit sind die 10 s und 60 s im PRD ersetzt.
- **Heute:** **unbekannt**. Die Schleife über die Mietverträge läuft im BFF (`src/lib/server/statement-generation.ts`, aus Repo/Config).
- **Fitness Function:** Benchmark-Skript, das 50 Mietverträge anlegt und den Lauf über die BFF-Route misst, wöchentlich auf der Demo-VM. Dazu ein grober Wächter in CI (z. B. ≤ 15 s auf dem Runner, Annahme A4).

### P2 Wartezeit nach einem Klick

- **Auslöser:** Der Vermieter öffnet eine Liste (z. B. Mieter, Rechnungen) oder die Übersicht.
- **Umgebung:** VM wie die Demo, Daten von 50 Wohnungen über mehrere Jahre.
- **Reaktion:** Die Seite ist ohne spürbare Wartezeit da.
- **Messgrösse und Ziel:** Antwortzeit der API **< 500 ms (p95)** (aus Repo/Config: `docs/tech-stack.md`; eigenes Ziel: vom Nutzer bestätigt). Für die Datenbank nennt `docs/tech-stack.md` zusätzlich Abfragen < 100 ms (p95).
- **Heute:** **unbekannt**, nicht gemessen (aus Repo/Config: `docs/archive/migration-mva.md` P2 ❓).
- **Fitness Function:** Im Benchmark von P1 zusätzlich jede Listen- und Übersichtsroute 100-mal abrufen und p95 bilden, wöchentlich auf der Demo-VM. In CI ein grober Wächter mit derselben Annahme wie A4.

### S1 Sitzung und Mieterdaten geschützt

- **Auslöser:** Ein Skript im Browser versucht, die Sitzung zu lesen, oder ein Request ohne gültige Sitzung erreicht BFF oder Backend.
- **Umgebung:** Produktion.
- **Reaktion:** Das Skript findet kein Token. Der Request bekommt 401 oder eine Weiterleitung zum Login.
- **Messgrösse und Ziel:** **0** lesbare Tokens im Browser. **100 %** der Endpunkte antworten ohne Sitzung mit 401 (mit der Freigabe vom Nutzer bestätigt).
- **Heute:** 401 ist getestet (`auth-guard.test.ts`, `auth.pg.test.ts`). HttpOnly ist so gebaut, aber nicht getestet (aus Repo/Config: `docs/archive/migration-mva.md` S1 ✅, S2 ❓).
- **Fitness Function:** E2E: Nach dem Login enthält `document.cookie` kein JWT. Ein API-Test läuft über alle registrierten Routen ohne Sitzung und erwartet 401.

## 4. Priorisierungsmatrix

Wichtigkeit = geschäftliche Wichtigkeit, Schwierigkeit = Abstand zum Ziel. Die Matrix ist vom Nutzer bestätigt (23.10.2026), mit drei Änderungen: S1 Wichtigkeit H; T1 gilt für PR und `main`; R1 wird mit Verschlüsselung und Kompatibilität H/H.

| | Schwierigkeit **H** | **M** | **L** |
|---|---|---|---|
| **Wichtigkeit H** | **Ä1, Ä4, U1, T1, R1** | O1, P2 | S1 |
| **M** | | P1 | |
| **L** | | | |

| ID | Wichtigkeit | Begründung | Schwierigkeit | Begründung |
|---|---|---|---|---|
| Ä1 | H | Der PO hat die Zielwerte am 23.10. festgelegt. Ein neues Feld ist die häufigste Änderung (`db:schema` in 31 % der Features). | H | Median 6 → 4, P90 19 → 8. Ohne gemeinsamen Vertrag zwischen den Schichten sinkt der Wert nicht (0 Importe FE/BFF → Backend). |
| Ä4 | H | Entscheid des PO, #717; das MCP über die API allein hängt daran (#815, #817) | H | Der BFF liest 0 (#717, #788). Seit #815 zählt auch das Frontend: 41 Ableitungen in 20 Dateien (25.10.2026). Entscheid PO 25.10.2026: H/M → H/H. |
| R1 | H | Datenverlust ist der teuerste Fehler. | H | Mehrere Anforderungen zugleich: Automatik, Verschlüsselung mit Wiederherstellungscode, Kompatibilität über Releases und Restore ≤ 5 min. Heute gibt es nur ein manuelles, unverschlüsseltes, ungetestetes Verfahren. Ob 5 min reichen, ist unbekannt (A2). |
| U1 | H | Wöchentliches Update; Datenverlust und fehlgeschlagene Migration müssen erkennbar sein. | H | Kein Backup vor der Migration, kein Upgrade-Test mit Daten. Migrationen gehen nur vorwärts, ein Zurück gibt es nur per Restore. |
| O1 | H | Ein fehlgeschlagenes Backup muss sofort erkennbar sein. | M | Es fehlt ganz, hängt aber nur an R1. |
| T1 | H | Der PO hat das strengste Ziel gewählt, für PR und `main`. | H | `main` 43–79 min, also das Drei- bis Fünffache des Ziels. 4 von 7 abgeschlossenen Läufen auf `main` waren rot. |
| P1 | M | Selten genutzt, der Assistent zeigt den Fortschritt. | M | Nicht gemessen. Die Schleife im BFF ist ein Verdacht, kein Beleg. |
| P2 | H | Wartezeit verunsichert unerfahrene Nutzer (vom Nutzer bestätigt). | M | Nicht gemessen. Ein Benutzer und wenige Daten sprechen für einen kleinen Abstand, `routes/dashboard.ts` fragt die DB aber ohne Service ab (`docs/archive/migration-mva.md`). |
| S1 | H | Vom Nutzer auf H gesetzt | L | Gebaut. Es fehlt ein Test. |

**Kandidaten für die ersten Refactorings (H/H):** Ä1, U1, T1, R1. **Quick Win (H/L):** S1.

## 5. Offene Annahmen

| ID | Annahme | Betrifft | Zu klären durch |
|---|---|---|---|
| A1 | ~~Das Release für die Vermieter ist eine Auswahl der Merge-Tags.~~ **Entschieden:** Es wird nur noch wöchentlich getaggt (vom Nutzer bestätigt). | U1 | erledigt |
| A2 | Eine Installation enthält nach 10 Jahren Belege für höchstens 50 Wohnungen. Der Restore schafft das in ≤ 5 min. Grösse unbekannt. | R1 | Messung mit synthetischer DB |
| A3 | ~~Schwelle «Backup zu alt» = 26 h~~ **Entschieden:** Gelingt mehr als einen Tag kein Backup, ist das sichtbar. Ausserdem muss jedes Backup nach einem Update einspielbar sein (vom Nutzer bestätigt). | O1, R1 | erledigt |
| A4 | Ein CI-Wächter für P1 auf dem GitHub-Runner sagt etwas über die Demo-VM aus. | P1 | Einmal auf beiden messen |
| A5 | ~~P2 braucht kein eigenes Szenario.~~ **Entschieden:** P2 ist ein eigenes Szenario (vom Nutzer bestätigt). Der Baum hat damit 9 statt höchstens 8 Szenarien. Einstufung H/M (vom Nutzer bestätigt). | P2 | erledigt |
| A6 | ~~Die rote Quote auf `main` kommt von Rennen und Browser-Unterschieden.~~ **Geprüft (CI-Logs der Runs 861, 876, 886, 916):** Kein roter Lauf kam von einem Fehler im gemergten Change. Ursachen: instabile Tests (3), Infrastruktur, weil die Systempakete für Playwright bei jedem Lauf per apt installiert werden (2), ein repoweiter Label-Check (1). T1 ist damit vor allem ein Problem der Stabilität und der Laufzeit, nicht der Codequalität. | T1 | erledigt |
| A7 | ~~Datenschutz der Backup-Dateien ist Sache des Betreibers.~~ **Entschieden:** Dwello verschlüsselt das Backup, der Schlüssel kommt aus einem generierten Wiederherstellungscode (vom Nutzer bestätigt). Das betrifft nur das Backup. Für die laufende DB bleibt die Verschlüsselung at rest «Vision, nicht geplant» (PRD, #111, #719, #722). | R1, S1 | erledigt |
| A8 | ~~Wie Dwello den Verlust des Codes verhindert, ist offen.~~ **Entschieden:** Dwello zeigt den Code bei der Einrichtung, der Vermieter bestätigt ihn, erst dann ist das Backup aktiv. Dwello erzeugt ein Notfallblatt (PDF) mit Code und Restore-Anleitung. Ein angemeldeter Vermieter kann einen neuen Code erzeugen; alte Backups bleiben mit dem alten Code lesbar (vom Nutzer bestätigt). | R1 | erledigt |
| A9 | Gemeinsame Typen werden aus der API-Form abgeleitet, nicht aus der DB-Tabelle (TP-Ä1/S1). | Ä1, S1 | erledigt (vom Nutzer bestätigt) |
