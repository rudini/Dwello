# Review #782, Runde 1 (Schlussrunde), 4ddfc359..d8a20d86

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | docs/architecture/fitness-functions.md:77 | «die erste Log-Zeile nennt Datei und Ursache» stimmt nicht: Bun gibt bei einem ungefangenen Fehler zuerst den Quelltext-Ausschnitt aus (`37 \| … throw new Error(…)` mit `^`), erst danach `error: Migration … fehlgeschlagen: …` und anschliessend den `cause` noch einmal. Nachgestellt mit einem Skript, das wie `migrate.ts` mit `cause` wirft: die ersten vier Zeilen sind Quelltext. Richtig wäre etwa «die erste `error:`-Zeile nennt Datei und Ursache». |
| C-2 | Minor | docs/architecture/fitness-functions.md:26 | Die Zeile `upgrade` beschreibt jetzt den Summenvergleich, die Spalten Grenzwert («0 verlorene Zeilen, 0 fehlgeschlagene Migrationen») und Stand («grün, 21 Tabellen (v0.89.11 → HEAD …)») aber nicht: Die neue Bedingung «0 geänderte Summen» und der Lauf v0.92.0 → HEAD mit 12 Summen fehlen dort, obwohl der Check jetzt daran rot wird. |

Geprüft: `sums()` erfasst alle 12 `numeric`-Spalten von `utility_statements` und `utility_statement_line_items` (Schema Zeilen 472–555, passt zu «12 sums»); eine entfernte Spalte meldet «dropped», eine neue Spalte zählt nicht; der awk-Vergleich ist numerisch. Der pg-Test hält bestehendes Verhalten fest (`backend/src/db/migrate.ts` im Diff unverändert, Transaktion pro Datei), wäre ohne Transaktion rot (das `DELETE` bliebe), und die Commit-Nachricht nennt das; Imports vorhanden. Die Aussage zum Container (`restart: unless-stopped`, Exit 1 vor `exec`) stimmt mit `docker-compose.prod.yml:83–90` überein. Keine UI-, Text-, Contract- oder E2E-Änderung, daher keine Szenarien-, a11y- oder `messages`-Pflicht; nichts im Diff ausserhalb der Anforderung.

## Nicht bestätigt

- `cd backend && bun test src/__tests__/migrations.pg.test.ts` (15 pass), `bun run type-check`, `bash -n tools/fitness/upgrade-check.sh`, `tools/fitness/upgrade-check.sh` v0.92.0 → HEAD grün, Rotlauf mit der Probe-Migration («utility_statements.balance 612.85 -> 619.85») und der simulierte Containerstart mit Exit 1: vom Aufrufer gemeldet, nicht wiederholt (PostgreSQL ohne Passwort hier nicht erreichbar, Upgrade-Check schreibt Dateien).
- Done-means Punkt 1 (CI-Test, der den Container mit scheiternder Migration startet und «unhealthy» prüft) bleibt unerfüllt; die Doku verweist auf einen «Entscheid des Product Owners in #782». In #782 gibt es dazu weder einen Kommentar noch das Label `needs-decision` (geprüft per `gh api …/issues/782` und `/comments`: nur `nfr:reliability`, keine Kommentare). Die Frage muss vor dem Merge dort gestellt werden, sonst verweist die Doku auf nichts.
- Punkt 3 (leere Demo-Tabellen) ist laut Aufrufer bewusst offen; nicht geprüft.
