# Review 1039/1035, Runde 1 (c55ef59)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | UBIQUITOUS_LANGUAGE.md:270-272 | Die drei neuen Zeilen «Export aller Daten», «Datendatei» und «Export eines Mieters» stehen in der Tabelle «Schweizer Mietrecht». Diese Tabelle hat nur zwei Spalten (`| Begriff | Definition |`, :255-256). Die Zeilen haben aber drei Zellen (`… | #496 |`, `… | #435 |`). In GitHub-Markdown fällt die überzählige Zelle weg, also sieht man die Issue-Verweise in der Darstellung nicht. Die Nachbarzeilen derselben Tabelle (Sicherung, Notfallblatt, Einrichtung) schreiben den Verweis in Klammern in die Definition, z.B. «… (#718, #860). \|». So sollten es auch die neuen Zeilen tun: «… dem Export eines Mieters (#496). \|» usw. |

Keine Blocker oder Major.

Geprüft: Die vier Zeilen und die Ergänzung «Protokoll» stimmen wörtlich mit den Issue-Texten #1039 (Option 1) und #1035 (Vorschlag) überein. «Brief zur Zustimmung (Abrechnungsperiode)» steht in der dreispaltigen Tabelle «Nebenkostenabrechnung», und die Zeile in `i18n-begriffe.md` hat vier Zellen. Die Zeile «Export eines Mieters» passt zu `tenants_export_title` und `tenants_export_help` (de) und zu `exportTenant` in `backend/src/services/tenant-export.service.ts`: Kontaktdaten, Mietverträge, Abrechnungen, Mahnungen, Dokumente, `dataFile` im ZIP von `src/routes/tenants/[id]/export/+server.ts`, Art. 28 DSG. Die bestehenden Hilfetexte folgen den Begriffen schon in allen vier Sprachen: `config_export_help` mit daten.json, données.json, dati.json und data.json; `contracts_consent_letter_download`, `statements_consent_letter_download_of` und `backend_consent_letter_none` mit accord, consenso und agreement, ebenso der Brief selbst in `backend/src/services/consent-letter.ts`. In `src`, `backend`, `tests` und `messages` steht kein Marker `TODO(fachlich prüfen, #1039/#1035)` mehr. Treffer gibt es nur noch in Review-Berichten unter `docs/reviews`, die Verlauf sind. Die Kommentaränderungen ändern kein Verhalten. Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- `bunx vitest run src/__tests__/open-work.test.ts` (4 grün), eslint auf den vier geänderten Svelte- und TS-Dateien, `grep -rn "#1039\|#1035" src backend/src tests messages` ohne Treffer: vom Aufrufer gemeldet.
- Die Begründung `No scenario: glossary and code comments only` im Text des Pull Requests (CI `check-issues`): Der Pull Request lag nicht vor.
- Hinweis ohne Befund, weil der Text vom Product Owner entschieden ist: Die Zeile «Datendatei» nennt «daten.json». Im Export eines Mieters heisst die Datei aber nach der Sprache des Mieters (`NAMES` in `tenant-export.service.ts`: données.json, dati.json, data.json), im Export aller Daten nach der Sprache der Oberfläche. Für den deutschen Glossartext trifft «daten.json» zu.
