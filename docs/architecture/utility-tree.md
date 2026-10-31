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
| Releases | Seit #935 wird `main` wöchentlich am Montag um 06:00 (Schweizer Zeit) getaggt und als Release veröffentlicht, eine Woche ohne Änderung bekommt kein Release. Vorher wurde jeder Merge getaggt. | aus Repo/Config (`release.yml`); vom Nutzer bestätigt (31.10.2026) |
| Backup | Manuelles `pg_dump` und Restore sind dokumentiert (`docs/installation.md` §5). Es gibt keine Automatik, keinen Test und keine Überwachung. | aus Repo/Config |
| Teuerster Fehler | Datenverlust | vom Nutzer bestätigt |
| Sofort erkennbar | Fehlgeschlagenes Backup; fehlgeschlagener Start oder Migration | vom Nutzer bestätigt |
| Verfügbarkeit | Der Betreiber ist zuständig, Dwello liefert Backup und Restore mit. Die 99,5 % aus PRD §7.4 gelten nicht als Ziel von Dwello. | vom Nutzer bestätigt |

## 2. Baum

```
Dwello-Nutzen
├─ Änderbarkeit
│  ├─ Form eines Felds an einem Ort .......... Ä1 Neues Feld an einer Entität            (H/L)
│  └─ Fachregel an einem Ort ................. Ä4 Fachregel nur im Backend              (H/L)
├─ Verfügbarkeit / Resilienz
│  ├─ Kein Datenverlust ...................... R1 Verschlüsseltes, kompatibles Backup   (H/H)
│  └─ Sicheres Update ........................ U1 Wöchentliches Update mit Migration    (H/H)
├─ Betreibbarkeit / Beobachtbarkeit
│  └─ Fehler sofort erkennen ................. O1 Fehlgeschlagenes Backup sichtbar      (H/M)
├─ Testbarkeit
│  └─ Schnelle, verlässliche Rückmeldung ..... T1 CI auf PR und main ≤ 15 min, main grün (H/M)
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
- **Messgrösse und Ziel:** Frontend- und BFF-Dateien, `src/lib/types.ts` eingeschlossen, die das Feld von Hand deklarieren (seit #910, Entscheid PO 28.10.2026: das Backend ist die Quelle des Felds; vorher alle Produktivdateien ausserhalb der DB): **Median ≤ 4, P90 ≤ 8** (vom Nutzer bestätigt, Baseline §7).
- **Heute:** Median **1**, P90 **6**, Max 14 (`rentalContracts.startDate`) über 125 Felder, Frontend und BFF (gemessen 28.10.2026 nach #912; das Ziel ist erreicht; nach #910 Max 18 mit `utilityStatements.periodEnd`). Über alle Schichten ausserhalb der DB: Median 4, P90 12, Max 36 (gemessen 26.10.2026 nach #837 Zyklus 3, `m4-field-spread.csv`; der Median erreicht das Ziel). Seit #843 zählt eine Datei für ein Feld nur, wenn sie ein weiteres Feld derselben Tabelle deklariert (Entscheid PO 26.10.2026; vorher Median 6, P90 19, Max 59 in Phase 0, darunter Worttreffer wie jedes `value:` für `configuration.value`). `schema.ts` ↔ `types.ts`: 26 gemeinsame Änderungen ohne Import (gemessen, Phase 0).
- **Fitness Function:** `tools/arch-baseline/run.sh` → `m4-field-spread.csv` vierteljährlich (Baseline §7, «Messrhythmus»). Schneller wirkt ein CI-Check pro PR: Ein neues Feld in `schema.ts` darf in höchstens 4 Frontend- und BFF-Dateien als Schlüssel auftauchen (seit #910) (Heuristik aus `05-knowledge`).

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
  - Seit #718 Teil 1 (28.10.2026, aus Repo/Config): Sicherung der Datenbank samt Belegen und Schlüsseln, verschlüsselt mit dem Wiederherstellungscode (X25519, nur der öffentliche Schlüssel liegt auf dem Server), täglich um 03:00, beim Start nach mehr als einem Tag und vor jeder Migration; 7 tägliche und 12 monatliche bleiben (`backup.service.ts`). Die Wiederherstellung ist ein Befehl des Betreibers (`docker compose … run --rm restore`, `docs/installation.md` §5). Seit #718 Teil 2 führt Dwello nach der Anmeldung zu «Sicherung einrichten» (Code, Notfallblatt, Bestätigung); erst dann sichert es.
  - `tools/fitness/restore-check.ts` prüft bei jedem PR mit Backend-Änderung und jedem Release: Sicherung der Daten des letzten Release, ohne Code nicht lesbar, mit HEAD wiederhergestellt, Zeilen, Summen und Schlüssel gleich (gemessen 28.10.2026: 0 s mit den Demo-Daten).
  - Gemessen am 31.10.2026 (#974, `bun run fitness:r1`: eine synthetische Datenbank nach 10 Jahren, 5 Liegenschaften mit 50 Wohnungen und 75 Mietverträgen, 2016–2025, je Liegenschaft und Jahr 40 Rechnungen mit Beleg, je Mieter und Jahr ein versendetes Abrechnungs-PDF zu 150 KB; Dateien aus Zufallsbytes, die sich nicht komprimieren lassen; 4 vCPU Xeon, 15 GB):
    - Belege zu 400 KB: Datenbank 1,2 GB, Sicherung 864 MB in 50 s, Restore **24 s**.
    - Belege zu 1 MB: Datenbank 2,8 GB, Sicherung 2,0 GB in 109 s, Restore **97 s**.
    - Das Ziel von 5 min hält mit Abstand. Die Dauer wächst schneller als die Grösse (2,3-fache Grösse, 4-fache Dauer); so weitergerechnet läge die Grenze bei rund 5 GB. Die Mengen (40 Belege pro Liegenschaft und Jahr, 400 KB bis 1 MB pro Beleg) hat der PO bestätigt (31.10.2026, Annahme A2).
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
- **Messgrösse und Ziel:** Datenverlust **0** (vom Nutzer bestätigt: Datenverlust ist der teuerste Fehler). **100 %** der Releases sind als Upgrade von der Vorversion mit Daten getestet (vom Nutzer bestätigt). Ein fehlgeschlagener Start oder eine fehlgeschlagene Migration zeigt sich als «unhealthy», und das Log nennt die Ursache (vom Nutzer bestätigt: muss sofort erkennbar sein). Entscheid PO 28.10.2026 (#782): Ein Container, der wegen der gescheiterten Migration immer wieder neu startet («Restarting»), mit Datei und Ursache im Log, erfüllt das; einen Start ohne Migration mit «unhealthy» gibt es nicht.
- **Heute:**
  - Migrationen laufen beim Start des Backends (`bun scripts/migrate.ts && exec bun run src/index.ts`), je eine Transaktion pro Migration (`backend/src/db/migrate.ts`). Ein Backup vor der Migration gibt es nicht (aus Repo/Config).
  - E2E testet nur Migrationen auf leere DB («migrated fresh before each run», `docs/test-pyramid.md`). Seit Phase 2a prüft `tools/fitness/upgrade-check.sh` jeden PR mit Backend-Änderung als Upgrade vom letzten Release mit Demo-Daten: Zeilenzahlen, Summen der Abrechnungsbeträge und die in den Demo-Daten leeren Tabellen (#783, #782). Eine scheiternde Migration lässt ihre Daten unverändert, der Start bricht mit Exit-Code 1 ab und das Log nennt Datei und Ursache (`migrations.pg.test.ts`, #782).
  - Seit #935 entsteht ein Release wöchentlich am Montag um 06:00 (Schweizer Zeit) und bei einem Lauf von Hand, nicht mehr bei jedem Merge; eine Woche ohne Änderung bekommt keins (`release.yml`, `tools/release/release.sh`, Entscheid PO 31.10.2026). `upgrade-check.sh` prüft damit jeden PR gegen das letzte wöchentliche Release, also den Weg der Vermieter. Die Fusszeile zeigt zwischen zwei Releases die Version mit den Commits seither (`0.4.0+3-gabc1234`).
- **Fitness Function:** CI-Job pro Release: Compose mit dem letzten Tag und Demo-Daten starten → auf HEAD aktualisieren → Healthcheck grün, Zeilenzahlen und Summen gleich. Dazu ein Negativtest: Eine absichtlich fehlschlagende Migration lässt die Daten unverändert und macht den Container «unhealthy» mit lesbarer Ursache.

### O1 Fehlgeschlagenes Backup ist sichtbar

- **Auslöser:** Das tägliche Backup schlägt fehl oder fehlt.
- **Umgebung:** Betrieb, selbst betrieben.
- **Reaktion:** Die App zeigt einen Hinweis. Der Healthcheck meldet den Zustand, und das Log nennt die Ursache (vom Nutzer bestätigt).
- **Messgrösse und Ziel:** Ist seit mehr als **einem Tag** kein Backup gelungen, sieht der Betreiber das spätestens beim nächsten Öffnen der App und sofort im Healthcheck (vom Nutzer bestätigt). Das Alter dient nur als Signal, dass die Sicherung steht. Ob ein Backup taugt, prüft R1.
- **Heute:** Seit #718 Teil 1 meldet `/health` `backup: "stale"` (mit Status 200, damit das Frontend startet und den Hinweis zeigt), wenn seit mehr als einem Tag keine Sicherung gelang; das Log nennt bei jedem Versuch die Ursache (`backup.pg.test.ts`). Seit Teil 2 nennt die Übersicht dem Liegenschaftsverwalter den Tag der letzten Sicherung (Szenario «Ohne Sicherung seit mehr als einem Tag warnt die Übersicht», `backup-notice.dom.test.ts`).
- **Fitness Function:** E2E-Szenario «altes Backup → Hinweis sichtbar» und ein Backend-Test: `/health` meldet einen Fehler, wenn das letzte Backup älter als die Schwelle ist.

### T1 Schnelle und verlässliche CI

- **Auslöser:** Ein PR wird gepusht bzw. auf `main` gemergt.
- **Umgebung:** GitHub Actions. Auf PRs laufen Chromium und API, auf `main` alle drei Browser (`ci.yml`, `docs/test-pyramid.md`).
- **Reaktion:** Volle Rückmeldung, ob grün oder rot. `main` bleibt nach dem Merge grün.
- **Messgrösse und Ziel:** Wanduhrzeit vom Start des ersten Jobs bis zum Ergebnis **≤ 15 min** auf PR **und** auf `main`, und `main` grün (vom Nutzer bestätigt). Die Wartezeit davor, auf `main` meist das Warten auf den vorherigen Lauf derselben Concurrency-Gruppe, zählt nicht zum Ziel und wird getrennt ausgewiesen (Entscheid PO 26.10.2026, #842).
- **Heute** (gemessen, CI):
  - PR: 11 grüne Läufe (Runs 900–918), 9,5–23,6 min, Median etwa 18 min. Läufe von etwa 10 min sind PRs, deren letzter Push nur Doku änderte.
  - `main`: grüne Läufe 43 min (Run 864), 43 min (Run 868), 79 min (Run 880).
  - Kritischer Pfad in Run 868 ist E2E-Shard 5 mit 41 min Testschritt. Die Shards brauchen 20–41 min, axe 11–16 min, Unit-Tests 4 min, Lint und Typen 1,5 min.
  - Von den letzten 20 abgeschlossenen Push-Läufen auf `main` waren 3 grün, 4 rot und 13 abgebrochen, weil ein neuerer Merge sie ersetzte.
  - Ursachen der 4 roten Läufe (gemessen, CI-Logs): keine kam von einem Fehler im gemergten Change. 3 instabile Tests (axe `target-size` nur mobil dunkel in Run 861; Firefox «Suche ohne Treffer» ohne Retry in Run 876; Reihenfolge der Kategorien im PDF in Run 916), 2 Shards am 60-min-Limit, weil `playwright install --with-deps` wegen eines langsamen apt-Spiegels 42–51 min brauchte (Runs 876, 886), 1 repoweiter Check auf Issue-Labels (`check-issues.mjs`, Run 886). Siehe A6.
  - Nach #777 (26.10., Run 40286548319, Merge von #831): PR etwa 13 min. `main` 27 min, die fünf E2E-Shards brauchten im Testschritt 12–26 min (92 min zusammen), axe 9–10 min. Seit #834 läuft E2E auf `main` in 12 Shards: Run 40293821912 brauchte nach dem Start der Jobs 19,6 min, der Testschritt 3,5–18 min, weil je ein Shard die Sprach-Bildschirmprüfungen eines Browsers trug. Seit #838 haben diese sechs eigene Shards. Run 40303722784 (Merge von #839): E2E-Shards 5,5–9,1 min, der Lauf 14,7 min ab dem Start der Jobs (davor 18 min Warten auf den Lauf von #836); kritischer Pfad war axe-Shard 2/3 mit etwa 14 min, seit #840 läuft axe in 4 Shards.
  - Stichprobe 28.10.2026 (gemessen, CI, Actions-API; Dauer ab dem Start des ersten Jobs): `main` die letzten 29 abgeschlossenen Push-Läufe (Runs 1129–1186, 27.–28.10.) 11–17 min, Median **13 min**; 2 über 15 min (17 min, Run 40682977297; 15 min im roten Run 40708772660). PR die letzten 30 Läufe 2–16 min, Median **10 min**, einer über 15 min (Run 40687603886). In den 7 Tagen bis 28.10. waren von 99 abgeschlossenen Push-Läufen auf `main` 91 grün, 3 rot und 5 abgebrochen. Damit hält T1 bis auf Ausreisser (Entscheid PO 28.10.2026: H/H → H/M).
  - Umfang: 851 Szenarien in 53 Feature-Dateien, 2 Worker pro Shard (aus Repo/Config).
- **Fitness Function:** Ein Job am Ende von `ci.yml` schreibt die Laufdauer als Annotation und schlägt bei mehr als 15 min auf `main` Alarm. Dazu eine wöchentliche Auswertung der Quote grüner Läufe auf `main` über die Actions-API.

### P1 Abrechnungslauf für 50 Wohnungen

- **Auslöser:** Der Vermieter erstellt im Assistenten die Abrechnungen einer Liegenschaft mit 50 Wohnungen samt PDFs.
- **Umgebung:** VM wie die Demo (2 OCPU ARM, 12 GB, ohne GPU) (vom Nutzer bestätigt).
- **Reaktion:** Der Assistent zeigt den Fortschritt, und alle Abrechnungen entstehen.
- **Messgrösse und Ziel:** **≤ 30 s** vom Start bis zur letzten Abrechnung (vom Nutzer bestätigt). Damit sind die 10 s und 60 s im PRD ersetzt.
- **Heute:** einmal gemessen am 31.10.2026 (#934, `bun run fitness:p1`: 1 Liegenschaft, 50 Wohnungen, 50 Mietverträge, 12 Rechnungen 2025; echtes Backend und Produktions-Build des Frontends, die Formular-Aktion «generate» des Assistenten über das BFF, danach die PDFs als ZIP des Laufs über das BFF; 4 vCPU Intel Xeon 2.1 GHz, 15 GB RAM, wie ein Runner): Lauf bis zur letzten Abrechnung **3,0 s**, die 50 PDFs **3,5 s**, zusammen **6,5 s** (sieben Läufe 6,4–7,5 s). Damit hält P1 das Ziel auf dem Runner mit Faktor 4,6 Reserve. Die Schleife im BFF (ein `statements/generate` pro Mietvertrag, nacheinander) ist kein Engpass. Die Messung auf der Demo-VM (2 OCPU ARM, 12 GB) steht aus (A4).
- **Fitness Function:** Benchmark-Skript, das 50 Mietverträge anlegt und den Lauf über die BFF-Route misst, wöchentlich auf der Demo-VM. Dazu ein grober Wächter in CI (z. B. ≤ 15 s auf dem Runner, Annahme A4). Das Skript gibt es seit #934 (`tools/fitness/p1-benchmark.ts`, von Hand); ob ein CI-Wächter folgt, entscheidet der PO nach der Messung auf der Demo-VM.

### P2 Wartezeit nach einem Klick

- **Auslöser:** Der Vermieter öffnet eine Liste (z. B. Mieter, Rechnungen) oder die Übersicht.
- **Umgebung:** VM wie die Demo, Daten von 50 Wohnungen über mehrere Jahre.
- **Reaktion:** Die Seite ist ohne spürbare Wartezeit da.
- **Messgrösse und Ziel:** Antwortzeit der API **< 500 ms (p95)** (aus Repo/Config: `docs/tech-stack.md`; eigenes Ziel: vom Nutzer bestätigt). Für die Datenbank nennt `docs/tech-stack.md` zusätzlich Abfragen < 100 ms (p95).
- **Heute:** einmal gemessen am 28.10.2026 (#781, `bun tools/fitness/p2-benchmark.ts`: 50 Wohnungen, 75 Mietverträge, 300 Rechnungen, 225 Abrechnungen 2021–2025; 4 vCPU Xeon 2.8 GHz, im Prozess ohne Netz, je 100 Aufrufe): alle Listen unter 20 ms p95, `contracts/missing-statements` 61 ms, Übersicht `dashboard` 227 ms, `statements/outdated` 1110 ms (die Übersicht lädt sie mit). Nach #919 (Rechnungen und Tankbestand einmal pro Gebäude und Periode, keine volle Abrechnung pro Eintrag): `statements/outdated` **80 ms**, `dashboard` 214 ms; damit hält jede gemessene Route das Ziel. Ob der Wert auf der Demo-VM (2 OCPU ARM) gleich ist, bleibt offen (A4). Entscheid PO 28.10.2026: einmal messen, kein CI-Gate.
- **Fitness Function:** In CI zählt `tools/fitness/p2-benchmark.ts --queries` die SQL-Abfragen eines Aufrufs pro Listen- und Übersichtsroute auf festen kleinen Daten; keine Route darf mehr brauchen als `routeQueries` in `tools/fitness/ratchet.json` (Entscheid PO 28.10.2026, #922: unabhängig von der Maschine, fängt ein N+1 wie #919). Die Antwortzeit misst `bun run fitness:p2` von Hand (100 Aufrufe pro Route, p95); dafür kein CI-Gate, solange A4 offen ist (#781).

### S1 Sitzung und Mieterdaten geschützt

- **Auslöser:** Ein Skript im Browser versucht, die Sitzung zu lesen, oder ein Request ohne gültige Sitzung erreicht BFF oder Backend.
- **Umgebung:** Produktion.
- **Reaktion:** Das Skript findet kein Token. Der Request bekommt 401 oder eine Weiterleitung zum Login.
- **Messgrösse und Ziel:** **0** lesbare Tokens im Browser. **100 %** der Endpunkte antworten ohne Sitzung mit 401 (mit der Freigabe vom Nutzer bestätigt).
- **Heute:** 401 ist getestet (`auth-guard.test.ts`, `auth.pg.test.ts`). Seit #936 ruft `auth.pg.test.ts` jede Route auf, die das Backend registriert (aus `app.routes`, Pfadparameter mit einer Dummy-ID, mit leerem Body), und erwartet 401; ausgenommen ist nur eine Liste öffentlicher Routen mit je einem Grund (Health-Check, Anmeldung, Einrichtung, was die öffentliche Datenschutzerklärung braucht). Dabei fiel auf, dass 40 Routen ohne Sitzung 422 statt 401 antworteten, weil Elysia Body und Query vor dem Auth-Hook prüfte; die Middleware lehnt jetzt schon vor der Prüfung ab. Seit #817 nimmt `/mcp` statt einer Sitzung einen Zugangsschlüssel für KI-Programme an, nur lesend und nur dort; ein fehlender, widerrufener oder abgelaufener Schlüssel bekommt 401, an jeder anderen Route gilt ein Schlüssel nicht (`access-key.pg.test.ts`, ADR 0007). Seit #917 ist getestet, dass das Sitzungs-Cookie HttpOnly und SameSite ist, mit `COOKIE_SECURE` auch Secure (`session-cookie.test.ts`).
- **Fitness Function:** E2E: Nach dem Login enthält `document.cookie` kein JWT. Ein API-Test läuft über alle registrierten Routen ohne Sitzung und erwartet 401.

## 4. Priorisierungsmatrix

Wichtigkeit = geschäftliche Wichtigkeit, Schwierigkeit = Abstand zum Ziel. Die Matrix ist vom Nutzer bestätigt (23.10.2026), mit drei Änderungen: S1 Wichtigkeit H; T1 gilt für PR und `main`; R1 wird mit Verschlüsselung und Kompatibilität H/H. Entscheid PO 28.10.2026: Ä1 und Ä4 haben ihr Ziel erreicht und gehen auf H/L (sie bleiben im Baum, weil die Checks sich auf sie berufen); T1 geht nach der Neumessung auf H/M.

| | Schwierigkeit **H** | **M** | **L** |
|---|---|---|---|
| **Wichtigkeit H** | **U1, R1** | O1, P2, T1 | Ä1, Ä4, S1 |
| **M** | | P1 | |
| **L** | | | |

| ID | Wichtigkeit | Begründung | Schwierigkeit | Begründung |
|---|---|---|---|---|
| Ä1 | H | Der PO hat die Zielwerte am 23.10. festgelegt. Ein neues Feld ist die häufigste Änderung (`db:schema` in 31 % der Features). | L | Bis 28.10.2026 H: Median 6 → 4, P90 19 → 8, ohne gemeinsamen Vertrag zwischen den Schichten (0 Importe FE/BFF → Backend). Nach #910 und #912 Median 1, P90 6: Ziel erreicht, `field-spread` hält es (Entscheid PO 28.10.2026: H/H → H/L). |
| Ä4 | H | Entscheid des PO, #717; das MCP über die API allein hängt daran (#815, #817) | H | Der BFF liest 0 (#717, #788). Seit #815 zählt auch das Frontend: 41 Ableitungen in 20 Dateien (25.10.2026). Entscheid PO 25.10.2026: H/M → H/H. Nach #815 Teil B bis D 0 Ableitungen: Ziel erreicht, `bff-decision` und `frontend-decision` halten es (Entscheid PO 28.10.2026: H/H → H/L). |
| R1 | H | Datenverlust ist der teuerste Fehler. | H | Mehrere Anforderungen zugleich: Automatik, Verschlüsselung mit Wiederherstellungscode, Kompatibilität über Releases und Restore ≤ 5 min. Heute gibt es nur ein manuelles, unverschlüsseltes, ungetestetes Verfahren. Ob 5 min reichen, ist unbekannt (A2). |
| U1 | H | Wöchentliches Update; Datenverlust und fehlgeschlagene Migration müssen erkennbar sein. | H | Kein Backup vor der Migration, kein Upgrade-Test mit Daten. Migrationen gehen nur vorwärts, ein Zurück gibt es nur per Restore. |
| O1 | H | Ein fehlgeschlagenes Backup muss sofort erkennbar sein. | M | Es fehlt ganz, hängt aber nur an R1. |
| T1 | H | Der PO hat das strengste Ziel gewählt, für PR und `main`. | M | Am 23.10.2026 H: `main` 43–79 min, das Drei- bis Fünffache des Ziels, 4 von 7 abgeschlossenen Läufen rot. Am 28.10.2026 `main` Median 13 min, 2 von 29 Läufen über 15 min, 91 von 99 Läufen in 7 Tagen grün (Entscheid PO 28.10.2026: H/H → H/M). |
| P1 | M | Selten genutzt, der Assistent zeigt den Fortschritt. | M | Einmal auf einem Runner-ähnlichen Rechner gemessen (31.10.2026, #934): 6,5 s samt PDFs für 50 Wohnungen, Ziel 30 s. Die Schleife im BFF ist kein Engpass. Die Demo-VM ist nicht gemessen (A4). |
| P2 | H | Wartezeit verunsichert unerfahrene Nutzer (vom Nutzer bestätigt). | M | Einmal gemessen (28.10.2026, #781): alle Listen- und Übersichtsrouten unter dem Ziel, `statements/outdated` nach #919 80 ms statt 1110 ms p95. |
| S1 | H | Vom Nutzer auf H gesetzt | L | Gebaut und getestet (#917, #936). |

**Kandidaten für die ersten Refactorings (H/H):** U1, R1 (bis 28.10.2026 auch Ä1 und T1). **Quick Win (H/L):** S1; Ä1 und Ä4 halten ihr Ziel, der Ratchet sichert es.

## 5. Offene Annahmen

| ID | Annahme | Betrifft | Zu klären durch |
|---|---|---|---|
| A1 | ~~Das Release für die Vermieter ist eine Auswahl der Merge-Tags.~~ **Entschieden:** Es wird nur noch wöchentlich getaggt (vom Nutzer bestätigt). | U1 | erledigt |
| A2 | Eine Installation enthält nach 10 Jahren Belege für höchstens 50 Wohnungen. Der Restore schafft das in ≤ 5 min. | R1 | erledigt: gemessen (31.10.2026, #974): mit 2000 Belegen zu 400 KB bis 1 MB ist die Datenbank 1,2 bis 2,8 GB gross, der Restore dauert 24 bis 97 s. Die Mengen (40 Belege pro Liegenschaft und Jahr, 400 KB bis 1 MB pro Beleg) hat der PO am 31.10.2026 bestätigt. |
| A3 | ~~Schwelle «Backup zu alt» = 26 h~~ **Entschieden:** Gelingt mehr als einen Tag kein Backup, ist das sichtbar. Ausserdem muss jedes Backup nach einem Update einspielbar sein (vom Nutzer bestätigt). | O1, R1 | erledigt |
| A4 | Ein CI-Wächter für P1 auf dem GitHub-Runner sagt etwas über die Demo-VM aus. | P1 | Einmal auf beiden messen. Runner-Seite gemessen (31.10.2026, #934): 6,5 s auf 4 vCPU Xeon 2.1 GHz, 15 GB. Der Lauf arbeitet die Mietverträge nacheinander ab, zählt also vor allem die Leistung eines Kerns. Offen: derselbe Lauf auf der Demo-VM (2 OCPU ARM, 12 GB), erst der Vergleich gibt den Faktor. Ist die VM bis zu 4,6-mal langsamer, hält P1 auch dort. |
| A5 | ~~P2 braucht kein eigenes Szenario.~~ **Entschieden:** P2 ist ein eigenes Szenario (vom Nutzer bestätigt). Der Baum hat damit 9 statt höchstens 8 Szenarien. Einstufung H/M (vom Nutzer bestätigt). | P2 | erledigt |
| A6 | ~~Die rote Quote auf `main` kommt von Rennen und Browser-Unterschieden.~~ **Geprüft (CI-Logs der Runs 861, 876, 886, 916):** Kein roter Lauf kam von einem Fehler im gemergten Change. Ursachen: instabile Tests (3), Infrastruktur, weil die Systempakete für Playwright bei jedem Lauf per apt installiert werden (2), ein repoweiter Label-Check (1). T1 ist damit vor allem ein Problem der Stabilität und der Laufzeit, nicht der Codequalität. | T1 | erledigt |
| A7 | ~~Datenschutz der Backup-Dateien ist Sache des Betreibers.~~ **Entschieden:** Dwello verschlüsselt das Backup, der Schlüssel kommt aus einem generierten Wiederherstellungscode (vom Nutzer bestätigt). Das betrifft nur das Backup. Für die laufende DB bleibt die Verschlüsselung at rest «Vision, nicht geplant» (PRD, #111, #719, #722). | R1, S1 | erledigt |
| A8 | ~~Wie Dwello den Verlust des Codes verhindert, ist offen.~~ **Entschieden:** Dwello zeigt den Code bei der Einrichtung, der Vermieter bestätigt ihn, erst dann ist das Backup aktiv. Dwello erzeugt ein Notfallblatt (PDF) mit Code und Restore-Anleitung. Ein angemeldeter Vermieter kann einen neuen Code erzeugen; alte Backups bleiben mit dem alten Code lesbar (vom Nutzer bestätigt). | R1 | erledigt |
| A9 | Gemeinsame Typen werden aus der API-Form abgeleitet, nicht aus der DB-Tabelle (TP-Ä1/S1). | Ä1, S1 | erledigt (vom Nutzer bestätigt) |
