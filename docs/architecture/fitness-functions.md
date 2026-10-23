# Fitness Functions (Phase 2a)

Stand: 23.10.2026, Basis `origin/main` 868aef9. Die Checks prüfen die Szenarien aus `utility-tree.md` (H/H und H/M) automatisch. Sie messen mit den Skripten aus Phase 0 (`tools/arch-baseline/`), damit jede Zahl dieselbe Definition hat wie in `baseline.md`.

- **Code:** `tools/fitness/fitness.ts` (Checks, Ratchet, `--update`), `tools/fitness/ratchet.json` (Schwellen und Ausnahmen), `tools/fitness/upgrade-check.sh` (U1), Tests in `tools/fitness/fitness.test.ts`
- **Lokal:** `bun run fitness` (neue Dateien vorher `git add -N`, die Skripte sehen nur Dateien, die Git kennt), `bun run fitness -- --base origin/main` wie in CI, `tools/fitness/upgrade-check.sh` (braucht PostgreSQL und die Tags)

## 1. Übersicht

| Szenario | Check | Was gemessen wird, wie | Laufzeit | Ort in der CI | Schwelle | Aktueller Wert |
|---|---|---|---|---|---|---|
| Ä1 (H/H) | `field-spread` | Pro eindeutigem DB-Feld die Produktivdateien ausserhalb der DB, die es als Schlüssel deklarieren (`m4-field-spread.csv`); Median, P90, Max | < 1 s | Job «Architecture fitness», jeder PR und `main` | Ratchet: Median ≤ 6, P90 ≤ 19, Max ≤ 60 (Ziel Ä1: Median ≤ 4, P90 ≤ 8) | 6 / 19 / 60 |
| Ä1, AP1 | `entity-mirror` | Dateien unter `src/`, die ≥ 50 % der eigenen Felder einer Tabelle deklarieren (`m4-entity-mirror-files.csv`) | (gleicher Lauf) | wie oben | keine neue Datei pro Tabelle; Ausnahmeliste | 57 Datei-Tabelle-Paare in 15 Tabellen |
| Ä1, AP1 | `literal-set` | Wertelisten (Unions, `t.Literal`, `pgEnum`, Arrays), die in mehreren Schichten stehen (`m4-literal-sets.csv`) | (gleicher Lauf) | wie oben | keine neue Liste, keine Liste in mehr Dateien; Ausnahmeliste | 14 Listen |
| Ä4 (H/M), AP2 | `bff-decision` | Pro Zeile in `src/lib/server/**`, `+page.server.ts`, `+layout.server.ts`, `+server.ts`, `hooks.server.ts`: Vergleich gegen einen Statuswert oder verankerte Regex (Regex aus `05-knowledge`, jetzt in `lib.ts`) | (gleicher Lauf) | wie oben | jede Fundstelle steht in `technical` (mit Grund) oder in der Ausnahmeliste; Ziel 0 | 14 Fundstellen: 7 technisch, 7 Altlast (#717) |
| Ä1 | `module-cycle` | Zyklen auf Modulebene, nur Produktivmodule (`cycles-module.csv`, Tarjan aus `02-imports`) | (gleicher Lauf) | wie oben | kein neuer Zyklus; Ausnahmeliste | 2 |
| AP1, Architektur BFF | `boundary-import` | Laufzeit-Import zwischen `src/` und `backend/` in eine der beiden Richtungen (`imports-file.csv`, `type_only = no`) | (gleicher Lauf) | wie oben | 0, ohne Ausnahme (`import type` bleibt erlaubt, damit AP1 Typen aus dem Backend ableiten kann) | 0 |
| alle | `ratchet` | `ratchet.json` gegen die Datei der Merge-Base: keine Schwelle höher, keine Ausnahmeliste länger | < 1 s | wie oben | Ausnahmen schrumpfen nur | – |
| Ä1 (Ä3) | `pr-size` | Produktivdateien, -module und -schichten des PR-Diffs gegen die Merge-Base (Definition M1) | < 1 s | wie oben, nur PR | **Warnung** über P90 der Features: 31 Dateien, 20 Module, 5 Schichten | – |
| Ä1, AP1 | `co-change` | Dateipaare verschiedener Produktivschichten, die in den letzten 6 Monaten ≥ 5-mal mit Kopplungsgrad ≥ 30 % gemeinsam geändert wurden, ohne Import (`m2-file-pairs-units-prod.csv`, Skripte 02–04) | 13 s | wie oben, nur nächtlich (`schedule`) | **Warnung** über 26 | 26 |
| T1 (H/H), AP5 | `ci-duration` | Wanduhrzeit vom Start des Laufs bis zum letzten Ergebnis (`run_started_at` über die Actions-API); nächtlich der Anteil grüner Push-Läufe auf `main` in 7 Tagen | < 10 s | Job «CI duration», jeder Lauf | **Warnung** über 15 min; grüne Quote nur Bericht | PR Median ~18 min, `main` 43–79 min (gemessen, CI, `utility-tree.md`) |
| U1 (H/H), AP3 | `upgrade` | Demo-Daten mit dem Backend des letzten Release-Tags laden, mit den Migrationen von HEAD migrieren; Migration muss durchlaufen, keine Tabelle verliert Zeilen | ~6 s (+ `bun install` des alten Backends) | Job «Unit tests», Schritt «Upgrade from the previous release», PR mit Backend-Änderung und jeder Push auf `main` (= jedes Release) | 0 verlorene Zeilen, 0 fehlgeschlagene Migrationen | grün, 21 Tabellen (v0.89.11 → HEAD; zusätzlich v0.70.0 und v0.80.0 → HEAD mit 7 bzw. 10 Migrationen grün) |

Fehler (`::error`) machen den Lauf rot; Warnungen (`::warning`) erscheinen als Annotation, rot wird nichts. Jeder Check nennt das verletzte Prinzip und die Behebung.

## 2. Ratchet

- **Start:** Alle Schwellen sind die Messwerte vom 23.10.2026 (kein Rot am ersten Tag). Der erste Lauf auf 868aef9 ist grün.
- **Nicht schlechter:** `judge` vergleicht die Messung mit `ratchet.json` des Arbeitsstands. `loosened` vergleicht diese Datei mit der der Merge-Base: Eine höhere Schwelle oder eine längere Ausnahmeliste macht den PR rot (Check `ratchet`; bei Wertelisten zählt die Summe der erlaubten Dateien). Ein Eintrag darf sich ändern, solange seine Liste nicht wächst (umbenannte Datei, umformatierte Zeile); die Änderung steht im Diff.
- **Verbesserung festschreiben:** `bun run fitness -- --update` senkt die Schwellen auf bessere Messwerte und entfernt Ausnahmen, die der Code nicht mehr braucht; `--cochange --update` senkt `coChangeWarn`. Das Ergebnis wird mit der Verbesserung committet.
- **Ausnahmeliste:** `ratchet.json` → `exceptions` (`bffDecisions`, `literalSets`, `entityMirrors`, `moduleCycles`), jeder Eintrag mit `reason` und `scenario`. Sie darf nur schrumpfen.
- **Technische Prüfungen:** `technical` in `ratchet.json` (UUID, ISO-Datum eines Query-Parameters, Jahr eines Filters, EGID, JWT-Dauer) ist eine Allowlist, keine Altlast: Sie darf wachsen, jeder Eintrag nennt den Grund. Die Einträge gelten pro Zeile, nicht pro Muster: Dieselbe ISO-Datums-Regex prüft in `contracts/[id]/+page.server.ts` ein Formularfeld (`validFrom`) und steht deshalb als Altlast unter #717.
- **Warnungen** (`prSizeWarn`, `coChangeWarn`) sind keine Gates: PR-Grösse hängt von der Aufgabe ab, Ko-Kopplung vom Zeitfenster. `coChangeWarn` folgt trotzdem dem Ratchet.

## 3. Nachweis: jede Prüfung schlägt bei einer Verletzung an

Lokal auf 643f84ef, Verletzung nur im Arbeitsbaum, danach zurückgesetzt (nichts committet). Neue Dateien mit `git add -N`, sonst sehen die Skripte sie nicht.

| Check | Absichtliche Verletzung | Ergebnis |
|---|---|---|
| `field-spread` | neue Datei `src/lib/fit-proof.ts` mit `{ number: 1 }` (Feld `apartments.number`, Max 60) | rot: «field spread max 61 > ratchet 60» |
| `bff-decision` | `s.status === 'paid'` in `src/lib/server/tenant.ts` | rot, nennt Datei und Zeile, AP2 |
| `literal-set` | `'local' \| 'provider' \| 'none'` in einer neuen Datei | rot: «local\|none\|provider … in 5 files (allowed: 4)» |
| `entity-mirror` | Typ mit 5 Feldern von `kiSettings` in einer neuen Datei | rot, nennt Datei und Tabelle |
| `module-cycle` | `src/lib/utils/format.ts` importiert `$lib/accounting-period` | rot: «fe:lib/accounting-period fe:lib/utils import each other» |
| `boundary-import` | `import { kiSettings } from '../../backend/src/db/schema'` unter `src/lib` | rot, nennt beide Dateien |
| `ratchet` | `fieldSpread.max` 60 → 61 in `ratchet.json` | rot: «fieldSpread.max rose from 60 to 61» |
| `pr-size` | `--base v0.80.0` | Warnung: «156 files, 96 modules and 5 layers» |
| `co-change` | `coChangeWarn` 26 → 20 | Warnung: «26 pairs … (ratchet 20)» |
| `upgrade` | Migration `DELETE FROM fuel_stocks;` | rot: «fuel_stocks 6 -> 0» |
| `upgrade` | Migration `ADD COLUMN … NOT NULL` ohne Default | rot: «the migrations of this checkout fail on the data of v0.89.11» |
| `ci-duration` | Shell-Logik mit Startzeit vor 20 bzw. 10 min | Warnung bei 20 min, keine bei 10 min; grüne Quote aus Beispiel-JSON «1 of 2» |

Ein erster Versuch mit `DELETE FROM audit_log;` blieb grün: Die Tabelle ist in den Demo-Daten leer. Leer sind auch `invoice_documents`, `ki_settings` und `local_accounts`; dort kann der Upgrade-Check keinen Verlust sehen (Grenze unten).

## 4. Nicht oder nur teilweise automatisiert

| Szenario | Warum nicht | Manuelle Alternative |
|---|---|---|
| R1 (H/H) Verschlüsseltes, kompatibles Backup | Es gibt keinen Backup-Mechanismus; ihn zu bauen ist eine funktionale Änderung und in Phase 2 verboten (#718). | Bis #718: vor jedem wöchentlichen Release `pg_dump` und Restore nach `docs/installation.md` §5 auf der Demo-VM durchspielen und die Dauer notieren. Der Release-Job aus R1 wird mit #718 gebaut. |
| O1 (H/M) Fehlgeschlagenes Backup sichtbar | Hängt an R1; ohne Backup nichts zu prüfen. | Mit #718: E2E «altes Backup → Hinweis» und Backend-Test `/health`. |
| U1, zweiter Teil: fehlgeschlagene Migration macht den Container «unhealthy» mit lesbarer Ursache | Heute nicht garantiert; prüfen hiesse Verhalten ändern, falls es fehlt. Der Upgrade-Check prüft nur, dass Migrationen auf Daten durchlaufen und keine Zeilen verlieren. | Review-Checkliste für PRs mit Migration: «läuft auf bestehenden Zeilen (Default, Backfill)?» Der Negativtest kommt mit der Umsetzung von U1 (Backup vor Migration, AP3). |
| U1, Summen der Abrechnungen gleich | Zeilenzahlen fangen Löschungen, keine geänderten Beträge. | `daten-pruefer` bei PRs, die Beträge oder Migrationen an Abrechnungstabellen ändern (`CLAUDE.md` Workflow 5). |
| P2 (H/M) API < 500 ms p95 | Automatisierbar, aber zurückgestellt: Annahme A4 (sagt der GitHub-Runner etwas über die Demo-VM?) ist offen, und ein Benchmark braucht Sitzung und Datenmenge von 50 Wohnungen über Jahre. | Entscheid des Product Owners nötig (siehe Bericht). |
| AP5, dritter Punkt: Examples-Zeilen, die nur Backend-Regeln variieren | Maschinell schwer (Annahme in `principles.md`). | Review-Checkliste `code-reviewer`. |

## 5. Grenzen der Checks

- Die Messungen sind textbasierte Heuristiken aus Phase 0 (Schlüssel `feld:`, Regex-Literale).
- Ausnahmen hängen am Zeilentext bzw. Dateipfad, nicht an der Zeilennummer. Wird eine Altlast-Zeile umformatiert oder ihre Datei umbenannt, meldet der Check sie als neu; dann wird der Eintrag in `ratchet.json` angepasst (die Liste wird nicht länger, `ratchet` bleibt grün).
- `upgrade-check.sh` prüft gegen den letzten Tag. Wird künftig nur wöchentlich getaggt, prüft jeder PR gegen das letzte wöchentliche Release, also genau den Weg der Vermieter.
- Die CI-Dauer misst bis zum Ende der langsamsten Ergebnis-Jobs; Warteschlangen-Zeit vor dem Start zählt nicht.

## 6. Werkzeugwahl

- **Abhängigkeitsregeln und Zyklen:** Wiederverwendung des Import-Graphen aus `02-imports.ts` (löst `$lib` und `.svelte` auf, unterscheidet `import type`). Alternativen: `dependency-cruiser` (reichere Regel-Sprache, aber neue Abhängigkeit und `.svelte` nur mit Zusatz-Konfiguration), `eslint-plugin-boundaries` (Meldung direkt im Editor, aber zweite Definition der Schichten neben `layers.json`). Bei mehr als einer Handvoll Regeln lohnt sich `dependency-cruiser`.
- **Duplizierte Formen:** Entity-Spiegel, Wertelisten und Feldstreuung aus `05-knowledge.ts`. Eine Alternative ist ein gemeinsamer, aus dem Backend generierter API-Typ (z. B. Elysia/Eden oder OpenAPI-Codegen); er wäre die Lösung für AP1, kein Check.
- **CRAP, Deep Modules:** unverändert über `fallow audit` und `deepcheck` (eigene Jobs).
