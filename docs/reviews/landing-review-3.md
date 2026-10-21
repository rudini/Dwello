# Code-Review Runde 3 (Abschlussrunde), Slice «landing», Delta 55f6bb9..a36f2ce

## Status der offenen IDs aus Runde 2

| ID | Status |
|---|---|
| C-1 | Unverändert: Entscheid des PO (Freischaltung des Repositorys vor dem Merge), nicht Teil dieses Deltas. |
| C-8 | Behoben. marketing/index.html:478 sagt jetzt «Dwello zieht das vereinbarte Akonto ab; fehlende Zahlungen regeln Sie ausserhalb der Abrechnung.» Das deckt sich mit `UBIQUITOUS_LANGUAGE.md:177` («Akontobeiträge»). Zeile 476 sagt «dem Akonto» statt «Akontozahlungen». Die Übersetzungen folgen `i18n-begriffe.md:39-40`: «acomptes convenus», «acconti pattuiti», «agreed advance payments», jeweils mit dem Satz zu den fehlenden Zahlungen. |
| C-9 | Behoben. fr «pièces justificatives», en «supporting documents» (fr.json/en.json, beide Schlüssel mit «Belege»), wie in `i18n-begriffe.md:44`. Wo «Belege» an anderen Stellen mit «invoices»/«factures» übersetzt ist (en/index.html:8, :654, :823), war das schon vorher so und liegt nicht im Delta. |
| C-10 | Behoben (docs/installation.md:62-74). Weil `pg_dump -f` und `psql -f` im Container schreiben bzw. lesen und `docker cp` die Datei überträgt, gibt es keine Shell-Umleitung mehr: Das Problem mit der UTF-16-Kodierung von `>` in Windows PowerShell und dem fehlenden `<` entfällt. Container `dwello-postgres`, Benutzer und Datenbank `dwello` stimmen mit docker-compose.prod.yml:88-93 überein. `--clean --if-exists` bleibt, die Wiederherstellung ersetzt also die Daten wie beschrieben. |

## Neue Befunde im Delta

Keine.

Geprüft: Die Fach-Minors der zweiten Runde sind umgesetzt. M-2: FAQ «prüfen die Regeln daraus, die Dwello umsetzt», sinngemäss in fr/it/en. V-4: it «immobile» statt «edificio», in it.json und it/index.html bleibt kein «edificio». V-5: «Nach Periodenende» und der Schlusstext «Ist die Abrechnungsperiode vorbei» mit den Begriffen «période de décompte», «periodo di conteggio» und «billing period» aus `i18n-begriffe.md:76`. In `marketing/` steht kein «Frühling», «printemps», «primavera» oder «In spring» mehr. Die erzeugten fr/it/en-HTML-Seiten enthalten alle neuen Übersetzungen.

## Nicht bestätigt

- `python3 marketing/i18n/build.py` ohne Befund (kein Deutsch, keine ungenutzten Schlüssel): vom Aufrufer gemeldet, nicht erneut ausgeführt, weil das Skript die HTML-Dateien schreibt. Ich habe stattdessen mit grep geprüft, dass die neuen Texte in den erzeugten Seiten stehen.
- Die Befehle für Sicherung und Wiederherstellung habe ich nur gelesen und nicht gegen einen laufenden Container ausgeführt. Dass `pg_dump`/`psql` als root im Container ohne Passwort durchkommen, folgt aus der Standard-Authentifizierung `trust` für Unix-Sockets im Image `postgres:16-alpine`. Das ist nicht ausgeführt.
- Die Playwright-Prüfung des Menüs wurde in dieser Runde nicht ausgeführt (sagt der Aufrufer). Der Menü-Code liegt nicht im Delta.
