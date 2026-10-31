# Risiken, Sensitivity und Tradeoffs (Phase 1, ATAM-light)

> **Vom Product Owner freigegeben am 23.10.2026.** Nur die H/H-Szenarien aus `utility-tree.md`: Ä1, U1, T1, R1. Herkunft wie dort: gemessen (Phase 0), gemessen (CI), aus Repo/Config, vom Nutzer bestätigt, Annahme. Ein Beleg nennt die Datei, den Commit oder den CI-Lauf.

## Ä1 Neues Feld an einer Entität

**Sensitivity Points:**

| SP | Entscheidung heute | Wirkung auf Ä1 | Beleg |
|---|---|---|---|
| SP-Ä1-1 | Die Grenze BFF ↔ Backend ist HTTP ohne gemeinsamen Typ. `src/lib/types.ts` spiegelt das Schema von Hand. | Jedes Feld wird mindestens doppelt deklariert. | 0 Importe FE/BFF → Backend; `types.ts` «Match backend schema»; Paar `schema.ts` ↔ `types.ts` 26 gemeinsame Änderungen ohne Import (gemessen, Phase 0) |
| SP-Ä1-2 | Eingabeformen stehen getrennt im Elysia-Routenschema (`t.Object`), im Drizzle-Schema und in BFF-Formularen. | Ein Feld braucht Prüfung an mehreren Orten. | Validierungs-Schlüsselwörter: Backend 412, FE 23, BFF 8 (gemessen, Phase 0); Paar #4 `routes/contracts` ↔ `contract.service` (`search: query.search`, 64d2b16fa) |
| SP-Ä1-3 | `types.ts` ist eine zentrale Sammeldatei für alle Bereiche. | Unabhängige Features werden gekoppelt. | `types.ts` in 37 von 113 Features; Paar `messages/*` ↔ `types.ts` 36 (gemessen, Phase 0; H3) |
| SP-Ä1-4 | Pro Vorgang gibt es zwei Formulare (`ContractForm` und `ContractWizard`). | Ein Feld kommt zweimal in die UI. | Paar #14, 12 gemeinsame Änderungen; `ContractFormValues` in 3 Dateien (gemessen, Phase 0; H5) |

**Tradeoff Points:**

| TP | Kollision | Erklärung |
|---|---|---|
| TP-Ä1/S1 | Ä1 ↔ S1 (Datenschutz) | Typen direkt aus dem Drizzle-Schema abzuleiten senkt die Zahl der Dateien. Dann sieht das Frontend aber jedes DB-Feld, etwa verschlüsselte Geheimnisse (`ki-settings.service.ts`) oder interne Spalten. Abgeleitet werden sollte aus der **API-Antwort**, nicht aus der Tabelle. |
| TP-Ä1/T1 | Ä1 ↔ T1 | Ein generierter Vertrag (Codegen oder ein gemeinsames Paket) kostet einen Build-Schritt in CI. Er ersetzt aber Prüfungen der Fixtures gegen die API und manche E2E-Prüfung einer Feldform. Netto ist der Effekt auf die Laufzeit unklar (Annahme). |
| TP-Ä1/Ä4 | Ä1 ↔ Ä4: **kein Konflikt, Synergie** | Prüfregeln aus dem BFF ins Backend zu verschieben (#717) entfernt BFF-Deklarationen eines Felds (`building-form.ts`, `tenant-form.ts`). Beides senkt die Streuung. |

**Risiken:**

| ID | Risiko | Beleg |
|---|---|---|
| RI-Ä1-1 | Der handgepflegte Spiegel driftet unbemerkt. Laufzeit-Umwandlungen verdecken das, sodass ein Feld still `0` oder `undefined` wird. | PR #539: `Number(c.allocableInvoiceCount) \|\| 0` im BFF-Mapper; `isHeatingCost` mit gleichem Kommentar in `schema.ts` und `types.ts` (acdcc9ab4) (gemessen/abgeleitet, Phase 0) |
| RI-Ä1-2 | Ein Kernfeld wie `apartments.number` steht in 59 Produktivdateien. Eine Umbenennung oder Formänderung wird teuer und fehleranfällig. | `m4-field-spread.csv` (gemessen, Phase 0) |
| RI-Ä1-3 | Die Fehlerverträge sind nur durch Konvention geteilt. Eine Umbenennung im Backend bricht den BFF erst zur Laufzeit. | Paar #17, `StatementsAfterEndError` → `BilledDaysError` (fa6f5df22) |

**Nicht-Risiken (helfen heute):**

- `tests/contracts/*.json` wird gegen die echte API geprüft (`api-contracts.pg.test.ts`). Eine Drift fällt in den Tests auf, wenn auch erst dort (aus Repo/Config).
- Die Regel «One mapper per response» (`CLAUDE.md`) begrenzt Mapper im BFF.
- Textuelle Duplikation 0,87 %, keine Laufzeit-Zyklen, Deepcheck ohne flache Module (gemessen, Phase 0).
- Coded Errors (`coded-error.ts`, `backendMessage`) geben dem Fehlervertrag schon eine Form; es fehlt nur die Typisierung über die Grenze.

## U1 Wöchentliches Update mit Migration

**Sensitivity Points:**

| SP | Entscheidung heute | Wirkung auf U1 | Beleg |
|---|---|---|---|
| SP-U1-1 | Die Migration läuft im Startbefehl des Backend-Containers, vor dem Server, mit `restart: unless-stopped`. | Eine fehlschlagende Migration erzeugt eine Neustart-Schleife. Der Frontend-Container wartet auf `backend: service_healthy`, der Vermieter sieht also keine App. | `docker-compose.prod.yml` (Startbefehl `migrate.ts && exec bun run src/index.ts`; `depends_on … service_healthy`) (aus Repo/Config) |
| SP-U1-2 | Je eine Transaktion pro Migration. Angewendete Migrationen sind unveränderlich. | Eine fehlgeschlagene Migration hinterlässt keinen halben Zustand. Ein Zurück auf die alte Version gibt es aber nur per Restore. | `backend/src/db/migrate.ts` (BEGIN/COMMIT); CI-Schritt «Migrations unchanged» (aus Repo/Config) |
| SP-U1-3 | **Erledigt (#578):** Das Update holt fertige Images (`docker compose pull`), gebaut wird nur noch aus dem Klon. Vorher: Update = `git pull` + `up -d --build` auf der Maschine des Betreibers. Die Images werden lokal gebaut. | Das Update hängt von Netz, Build-Werkzeugen und Plattenplatz beim Betreiber ab und kann auf halbem Weg scheitern. | `docs/installation.md` §5; `build:` in `docker-compose.prod.yml` (aus Repo/Config) |
| SP-U1-4 | Die Schlüssel liegen in einem eigenen Volume (`dwello_secrets`) neben der DB. | Ein Backup nur der DB macht verschlüsselte Geheimnisse nach einem Restore unlesbar. | `ki-settings.service.ts` (AES-256-GCM aus `ENCRYPTION_KEY`), `docs/installation.md` §5, PR #644 (aus Repo/Config) |
| SP-U1-5 | ~~Jeder Merge wird ein Release.~~ **Erledigt (#935):** Es wird wöchentlich getaggt, Montag 06:00. | Ein Betreiber aktualisiert auf ein wöchentliches Release; jeder PR ist als Upgrade von diesem geprüft. | `release.yml`, README «Versions» (aus Repo/Config) |

**Tradeoff Points:**

| TP | Kollision | Erklärung |
|---|---|---|
| TP-U1/T1 | U1 ↔ T1 | Ein Upgrade-Test vom letzten Tag mit Daten kostet CI-Zeit (Compose-Start, Migration, Prüfung). Er gehört darum in den Release- oder Nacht-Job, nicht in jeden PR-Lauf. |
| TP-U1/R1 | U1 ↔ R1 (Restore ≤ 5 min) | Ein Backup vor jeder Migration verlängert das Update um die Dump-Dauer. Belege in der DB machen Dump und Restore gross (A2). |
| TP-U1/S1 | U1/R1 ↔ S1 | Mehr Backups (auch vor jedem Update) heissen mehr Kopien aller Mieterdaten samt Schlüsseln. Entschärft durch die Verschlüsselung der Backups (vom Nutzer bestätigt, R1). |

**Risiken:**

| ID | Risiko | Beleg |
|---|---|---|
| RI-U1-1 | **Erledigt (#718):** Dwello sichert vor jeder Migration; scheitert die Sicherung, bricht das Update ab, ohne die Datenbank zu ändern. Vorher: **Datenverlust bei einem Update:** Vor der Migration gibt es kein Backup. Ein Update mit fachlich falscher, aber technisch erfolgreicher Migration lässt sich nur mit dem letzten manuellen Backup zurücknehmen, falls es eines gibt. | Startbefehl in `docker-compose.prod.yml`; Backup nur manuell (`docs/installation.md` §5) (aus Repo/Config) |
| RI-U1-2 | **Erledigt (#783, #782):** `upgrade-check.sh` migriert bei jedem PR mit Backend-Änderung die Demo-Daten des letzten Release und vergleicht Zeilen und Summen. Vorher: Migrationen werden nie gegen Daten einer Vorversion getestet, nur gegen eine leere DB. | `docs/test-pyramid.md` («migrated fresh before each run») (aus Repo/Config) |
| RI-U1-3 | Ein fehlgeschlagener Start ist nur über `docker logs` erkennbar. Der Vermieter hat keine technischen Kenntnisse (`docs/installation.md`, Einleitung). | Healthchecks in Compose; Ursache nur im Log (aus Repo/Config) |
| RI-U1-4 | `ollama/ollama:latest` ist nicht gepinnt. Ein Update kann das KI-Verhalten ändern, ohne dass Dwello sich ändert. Behoben mit #719: `ollama/ollama:0.40.11`. | `docker-compose.prod.yml` (aus Repo/Config) |
| RI-U1-5 | Ein Restore ohne das Schlüssel-Volume macht verschlüsselte Geheimnisse still unlesbar. | `ki-settings.service.ts` Z. 60 («cannot be read … after a restore without the keys») (aus Repo/Config) |

**Nicht-Risiken (helfen heute):**

- Je eine Transaktion pro Migration (SP-U1-2), kein halber Schema-Zustand.
- CI verbietet, angewendete Migrationen zu ändern.
- Healthchecks existieren für Backend, Frontend und Postgres. O1 und U1 können darauf aufbauen.
- Backup und Restore sind dokumentiert und schliessen die Schlüssel ein (`docs/installation.md` §5).
- Die Demo aktualisiert sich automatisch (`deploy/demo/update.sh`) und testet so jeden Merge mit Demo-Daten im Betrieb, allerdings nach der nächtlichen Rücksetzung und ohne Prüfung der Daten.

## T1 Schnelle und verlässliche CI

**Sensitivity Points:**

| SP | Entscheidung heute | Wirkung auf T1 | Beleg |
|---|---|---|---|
| SP-T1-1 | ATDD: Jedes sichtbare Verhalten bekommt ein E2E-Szenario. | Die Spitze der Pyramide wächst mit jedem Feature: 851 Szenarien, `statement-detail.feature` allein 100. | `CLAUDE.md` Workflow 1; Zählung `tests/e2e/features` (aus Repo/Config); 88,5 % der Features ändern Acceptance-Tests (gemessen, Phase 0) |
| SP-T1-2 | Auf `main` laufen alle E2E in drei Browsern, auf PRs nur in Chromium. | Der `main`-Lauf dauert 43–79 min statt etwa 18 min. | `ci.yml` (`BROWSERS`, `PROJECTS`); Runs 864, 868, 880 (gemessen, CI) |
| SP-T1-3 | Fünf Shards, Playwright teilt nach Zahl der Tests, 2 Worker pro Shard. | Die Shards sind ungleich: 20–41 min. Der langsamste bestimmt die Dauer. | `playwright.config.ts` (`workers: process.env.CI ? 2 : 4`); Run 868 (gemessen, CI) |
| SP-T1-4 | axe prüft jeden Bildschirm und Zustand hell und dunkel, dazu drei Bildschirm-Register von Hand. | 11–16 min in drei Shards. Jeder neue Bildschirm verlängert den Lauf. | `docs/test-pyramid.md`; Run 868; Baseline M2-Kontext (Grad bis 0,98) |
| SP-T1-5 | Fachregeln liegen teilweise im BFF und FE (H2). | Sie lassen sich nur über den Browser end-to-end prüfen, nicht im schnellen `*.pg.test.ts`. | Baseline §5 H2 (gemessen/abgeleitet, Phase 0) |

**Tradeoff Points:**

| TP | Kollision | Erklärung |
|---|---|---|
| TP-T1/Qualität | T1 ↔ Fehlerfindung | Weniger Browser auf `main` spart Zeit, findet aber die Rennen nicht mehr, die laut `test-pyramid.md` nur Firefox oder WebKit zeigt. |
| TP-T1/Usability | T1 ↔ Barrierefreiheit | Weniger axe-Prüfungen (z. B. nur geänderte Bildschirme) sparen Zeit. Die Regel «0 Verstösse auf allen Bildschirmen» wird dann nur noch nachts geprüft. |
| TP-T1/U1 | T1 ↔ U1 | Siehe TP-U1/T1: Der Upgrade-Test braucht Platz ausserhalb des PR-Pfads. |
| TP-T1/Ä4 | T1 ↔ Ä4: **Synergie** | Regeln im Backend lassen sich mit `*.pg.test.ts` prüfen (Backend-Tests 68 s in Run 868). Damit kann ein E2E-Szenario auf den Ablauf schrumpfen. |

**Risiken:**

| ID | Risiko | Beleg |
|---|---|---|
| RI-T1-1 | **`main` ist oft rot oder ungeprüft:** von 20 abgeschlossenen Läufen 4 rot und 13 abgebrochen. Merges landen auf einer Basis, deren Zustand niemand kennt. | Actions-API, Push-Läufe auf `main` am 23.10. (gemessen, CI); Ursachen offen (A6) |
| RI-T1-2 | Die E2E-Laufzeit wächst linear mit den Features, denn jedes Feature bringt Szenarien. Ohne Gegenmassnahme entfernt sich T1 weiter vom Ziel. | SP-T1-1; 16 Testdateien pro Feature im Median (gemessen, Phase 0, Kontext) |
| RI-T1-3 | Die ungleichen Shards verschenken Parallelität: 41 gegen 20 min. | Run 868 (gemessen, CI). Nach #777: 12 gegen 26 min in Run 40286548319; seit #834 läuft `main` in 12 Shards |
| RI-T1-4 | Die Systempakete für Playwright werden bei jedem Lauf per apt installiert; nur die Browser kommen aus dem Cache. Ein langsamer Spiegel brauchte 42–51 min und brach Shards am 60-min-Limit ab, obwohl die Tests grün waren. | Runs 876, 886 (gemessen, CI). Seit #777 laufen die E2E- und axe-Shards im Playwright-Image der gesperrten Version, ohne apt zur Laufzeit; der Job «UI screenshots» installiert noch selbst |
| RI-T1-5 | Instabile Tests ohne Retry machen `main` rot, ohne dass der Change schuld ist: axe `target-size` nur mobil dunkel, Firefox-Suche mit 5 s Timeout, PDF-Test abhängig von der Reihenfolge der Positionen (`statement-pdf.service.ts`: Kategorien in der Reihenfolge von `lineItems`). | Runs 861, 876, 916 (gemessen, CI); `playwright.config.ts` ohne Retries (aus Repo/Config); PDF-Reihenfolge behoben in #768, die Firefox-Suche in #754, axe nach dem Wiederherstellen eines Entwurfs in #778 |
| RI-T1-6 | Ein repoweiter Check (`check-issues.mjs`) hängt an Labels fremder Issues und macht jeden Lauf rot, bis jemand die Labels setzt. | Run 886 (gemessen, CI) |

**Nicht-Risiken (helfen heute):**

- PRs, die nur Doku ändern, überspringen E2E, Backend-Tests und axe (`tools/ci/docs-only-since.mjs`). Solche Läufe dauern etwa 10 min.
- axe wird übersprungen, wenn sich nichts Sichtbares geändert hat.
- Unit-Tests (4 min), Lint und Typen (1,5 min) sowie der Build (1,5 min) sind schnell und laufen parallel.
- Die Testpyramide und die Regel «auf der niedrigsten Ebene, die das Verhalten zeigt» sind schon dokumentiert (`docs/test-pyramid.md`, `CLAUDE.md` Workflow 2).

## R1 Verschlüsseltes, kompatibles Backup

**Sensitivity Points:**

| SP | Entscheidung heute | Wirkung auf R1 | Beleg |
|---|---|---|---|
| SP-R1-1 | Belege (Rechnungsdateien, PDFs) liegen in der DB. | Das Backup ist vollständig mit einem Dump. Seine Grösse wächst aber mit den Jahren, und davon hängt Restore ≤ 5 min ab. | `docs/installation.md` §5 («uploaded invoices and PDFs are stored in the database too») (aus Repo/Config); A2 |
| SP-R1-2 | Die Schlüssel liegen in `dwello_secrets`, getrennt von der DB. | Ein Backup muss beide umfassen. Beim Restore müssen die Schlüssel vor dem ersten Start zurück. | `docs/installation.md` §5; `ki-settings.service.ts` (aus Repo/Config) |
| SP-R1-3 | Die angewendeten Migrationen stehen in `schema_migrations` in der DB. Der Start zieht fehlende nach. | Ein Backup aus Release N lässt sich in N+1 einspielen, ohne eigenen Mechanismus. | `backend/src/db/migrate.ts` (aus Repo/Config) |
| SP-R1-4 | **Erledigt (#718):** Der Backend-Dienst sichert selbst (täglich um 03:00), in den Ordner `backups` neben `compose.yaml`. Vorher: Compose enthält keinen Dienst für zeitgesteuerte Aufgaben und kein Volume für Backups. | Wo das tägliche Backup läuft und wohin es schreibt, ist eine neue Entscheidung. | `docker-compose.prod.yml` (aus Repo/Config) |

**Tradeoff Points:**

| TP | Kollision | Erklärung |
|---|---|---|
| TP-R1/Datenverlust | Verschlüsselung ↔ Datenverlust | Geht der Wiederherstellungscode verloren, ist jedes Backup wertlos. Das ist genau der teuerste Fehler. Die Verschlüsselung tauscht ein Datenschutzrisiko gegen ein Verfügbarkeitsrisiko; gemindert nach A8. |
| TP-R1/RTO | Verschlüsselung und Kompatibilität ↔ Restore ≤ 5 min | Beim Restore kommen Entschlüsseln und das Nachziehen der Migrationen zum Einspielen dazu, bei grossen DBs mit Belegen (A2). |
| TP-R1/T1 | R1 ↔ T1 | Der Kompatibilitätstest pro Release (Vorversion → HEAD, mit Restore) gehört in den wöchentlichen Release-Job, nicht in jeden PR-Lauf. |
| TP-R1/U1 | R1 ↔ U1: **Synergie** | Das Backup vor jeder Migration (U1) ist derselbe Mechanismus wie das tägliche Backup. Ein Upgrade-Test und ein Restore-Test teilen Aufbau und Prüfung. |

**Risiken:**

| ID | Risiko | Beleg |
|---|---|---|
| RI-R1-1 | **Verlorener Wiederherstellungscode = Datenverlust.** Die Zielgruppe nutzt Dwello wenige Male im Jahr und hat wenig technische Erfahrung. Gemindert durch Bestätigung bei der Einrichtung, Notfallblatt (PDF) und neuen Code (vom Nutzer bestätigt, A8); ein Rest bleibt, wenn Code und Blatt verloren gehen. | `CLAUDE.md` «Design-Regeln» (aus Repo/Config) |
| RI-R1-2 | Ein Backup auf derselben Platte wie die DB geht mit ihr verloren. Heute legt die Anleitung die Kopie «auf ein anderes Gerät», von Hand. | `docs/installation.md` §5 (aus Repo/Config) |
| RI-R1-3 | **Erledigt (#718):** `restore-check.ts` stellt bei jedem PR mit Backend-Änderung eine Sicherung der Vorversion mit HEAD wieder her. Vorher: Kompatibilität ist angelegt (SP-R1-3), aber nie mit Daten einer Vorversion getestet. Eine Migration, die auf echten Daten scheitert (z. B. ein NOT NULL ohne Default), macht das Backup unbrauchbar. | `docs/test-pyramid.md` («migrated fresh») (aus Repo/Config) |
| RI-R1-4 | **Erledigt (#974):** Nach 10 Jahren 24–97 s gemessen (1,2–2,8 GB), Mengen vom PO bestätigt (A2). Vorher: Restore-Dauer und DB-Grösse sind unbekannt. 5 min könnten bei 10 Jahren Belegen nicht reichen. | A2 |

**Nicht-Risiken (helfen heute):**

- `schema_migrations` und Migrationen beim Start (SP-R1-3) machen Backups vorwärtskompatibel, ohne eigenen Mechanismus.
- Je eine Transaktion pro Migration: Ein gescheiterter Restore mit Migration hinterlässt keinen halben Zustand.
- Backup und Restore samt Schlüsseln sind schon dokumentiert (`docs/installation.md` §5). Die Automatik kann darauf aufbauen.
- AES-256-GCM ist im Backend schon vorhanden (`ki-settings.service.ts`).

## Querbezug zu S1 (H/L, kein H/H)

S1 ist keine Phase-6-Analyse wert, weil nur ein Test fehlt. S1 ist aber Gegenspieler in TP-Ä1/S1, TP-U1/S1 und TP-R1/Datenverlust. Entschieden: Typen werden aus der API-Form abgeleitet, Backups werden verschlüsselt (vom Nutzer bestätigt).
