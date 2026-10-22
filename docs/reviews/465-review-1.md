# Code-Review #465, Runde 1 (e6b3623a..ac690222)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | UBIQUITOUS_LANGUAGE.md:146-156 (Abschnitt «Heizprofil») | Die entschiedene Glossarzeile «Quelle der Monatsanteile» fehlt. PDF, Migration und Tests verwenden den Begriff bereits. |
| C-2 | Minor | backend/src/services/statement-pdf.service.ts:176-178 | Der Rückgriff für Abrechnungen, die vor #465 erstellt wurden (V-4), ist ungetestet: Ohne `sources` in `heatingShare` gilt die heutige Quelle des Profils, und bei einem gelöschten Profil entfällt die Zeile. Kein Test legt `heatingShare` ohne `sources` an. |
| C-3 | Minor | backend/src/services/reminder-pdf.ts:36,41-47 | Die Mahnung hat jetzt ebenfalls die eingebettete Schrift. Eine Anrede mit «Łukasz» wurde dort bisher mit der Standardschrift falsch gedruckt. Kein Test zeigt ein Zeichen ausserhalb von WinAnsi im PDF der Mahnung (`reminder-pdf.test.ts` und `reminders.pg.test.ts` haben nur den Helfer gewechselt). |
| C-4 | Minor | src/routes/config/+page.svelte:115-129 (über `SettingField.svelte:30`) | Telefon und E-Mail werden als `type="text"` gerendert. Das Mieterformular verwendet für dieselben Angaben `type="tel"` und `type="email"` (`TenantFormFields.svelte:66,78`). Auf dem Handy erscheint deshalb nicht die passende Tastatur. |
| C-5 | Minor | docs/api-specification.md:183-192, docs/data-model.md:450-458 | In den Tabellen der Konfigurationsschlüssel fehlen `company_phone` (≤ 50 Zeichen) und `company_email` (Format, ≤ 255 Zeichen). Beide Dokumente beschreiben die Schlüssel damit unvollständig. |

## C-1 (Major): Glossarzeile «Quelle der Monatsanteile» fehlt

Unter «Decided (product owner)» vom 2026-10-22 verlangt #465 ausdrücklich eine «new row in `UBIQUITOUS_LANGUAGE.md`, section «Heizprofil»» mit dieser Definition: vordefiniertes Profil mit Merkblatt, Herausgeber und Tabelle; eigenes Profil mit «Eigenes Profil des Vermieters»; gedruckt so, wie die Abrechnung erstellt wurde; Spalten `heating_profiles.source_de/fr/it/en`.

Nachweis: `grep -n "Quelle der Monatsanteile" UBIQUITOUS_LANGUAGE.md` liefert in ac690222 nichts, und der Range ändert die Datei nicht. Gleichzeitig druckt `pdf.service.ts` (`heatingSource`) den Begriff, die Szenarien in `statement-detail.feature` prüfen ihn, und `heating-profiles.pg.test.ts` trägt ihn im describe-Namen.

Laut CLAUDE.md (Design-Regeln, Copy) dürfen nur Begriffe aus dem Glossar verwendet werden. Ohne diese Zeile wäre der Begriff weder geklärt noch mit einem TODO-Marker versehen, und der Pull Request würde #465 schliessen, ohne die Entscheidung umzusetzen.

Behebung: die Zeile im Abschnitt «Heizprofil» ergänzen und sie im Pull Request nennen.

## Nicht bestätigt

- Die Grösse des PDF mit der Teilmenge der Schrift («a size that can be e-mailed»): Kein Test prüft sie. Messen wollte ich mit einem Bun-Skript im Scratchpad. Das scheiterte: Über `pdf.service` scheitert schon der Import an `@noble/hashes`, und der direkte Zugriff auf `pdfkit` ist nicht möglich, weil `backend/node_modules` in den Arbeitsbaum des Aufrufers zeigt und dort per Regel gesperrt ist. pdfkit bettet TTF-Schriften grundsätzlich als Teilmenge ein (`registerFont`), gemessen habe ich das aber nicht.
- Die Laufzeit des Docker-Images: Das Backend-Dockerfile kopiert mit `COPY . .`, und `.dockerignore` schliesst weder `assets/` noch `*.txt` aus. Gelesen, nicht gebaut.
- Ob ein Briefkopf mit sehr langem Firmennamen und langer Adresse (je zwei Zeilen) über dem Gebäudeblock bei 45 mm endet: Nur gerechnet (etwa 7 × 9.2 pt ab 40 pt ergibt rund 105 pt, also unter 127.6 pt). Kein Test deckt das ab.
- Vom Aufrufer gemeldet, nicht selbst wiederholt: `bun run lint`, `bun run check`, Backend-Typprüfung, `bunx vitest run --changed origin/main` (539) sowie i18n/open-work (118), Backend `statement-pdf-render`, `statement-pdf.pg`, `reminders.pg`, `config.pg`, `heating-profiles.pg`, `migrations.pg`, `api-contracts.pg`, E2E chromium+api (statement-detail, settings, invoices, sprachen, statement-agreed-costs, statement-minimum-balance, statement-reminder) und der bekannte Fehler in heating-distribution.pg (O-45).

Geprüft: Briefrahmen (Ort/Datum, Anrede und Gruss aus `reminder-letter.ts`, Einleitung, Gruss nach den Hinweisen vor dem Zahlteil), Texte aller vier Sprachen gegen die Tabelle in Fachreview 465-1, Briefkopf nur auf Seite 1 und Telefon/E-Mail nur, wenn sie gefüllt sind (V-2), Quelle in `heatingShare` gespeichert (V-4), eigene Profile immer «Eigenes Profil des Vermieters» (V-6), Migration 0037 gegen die Namen der vordefinierten Profile, Validierung in Backend und BFF, Vertrag `tests/contracts/config.json`, Hilfetexte (V-3) in allen vier `messages/*.json`, Screenplay-Schichten der neuen Schritte, Lizenzdatei der Schrift, keine Standardschrift mehr in `backend/src/services`.
