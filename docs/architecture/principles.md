# Architekturprinzipien (Phase 1)

> **Entwurf, nicht vom Team freigegeben.** Stand 23.10.2026. Die Prinzipien folgen aus den H/H-Szenarien Ä1, U1, T1 und R1 (`utility-tree.md`) und den Risiken in `risks-and-tradeoffs.md`. Sie legen keine Lösung fest. Sie sagen, woran eine Lösung gemessen wird.

## AP1 Eine Form hat eine Quelle

Jede Form, die über die Grenze Backend ↔ BFF geht (Antwort, Eingabe, Fehlercode, Statuswerte), wird an **einem** Ort im Backend definiert. BFF und FE leiten sie davon ab, statt sie abzuschreiben. Abgeleitet wird aus der API-Form, nicht aus der Tabelle (TP-Ä1/S1; vom Nutzer bestätigt).

- **Unterstützt:** Ä1 (primär), Ä4; mindert RI-Ä1-1 bis RI-Ä1-3
- **Verstoss erkennbar an:**
  - Eine Produktivdatei ausserhalb von `backend/` deklariert mindestens 3 Felder einer Tabelle als eigene Typ-Properties ohne Import oder Ableitung (`m4-entity-mirrors.csv`).
  - Eine Werteliste wie `active | ended | future` steht in mehr als einer Schicht (`m4-literal-sets.csv`, heute 14 schichtübergreifend).
  - Das Paar `schema.ts` ↔ `src/lib/types.ts` ändert sich gemeinsam, ohne dass eine Import-Beziehung besteht (`m2-file-pairs-units-prod.csv`).
  - Ä1 P90 > 8 in einer Messung.

## AP2 Fachregeln und fachliche Prüfungen entscheidet nur das Backend

Der BFF macht OAuth, Cookies, XSRF, setzt Seiten zusammen und reicht weiter. Was ein Status bedeutet, welche Abrechnung zählt und ob eine Eingabe gültig ist, entscheidet das Backend. Der BFF zeigt dessen Ergebnis oder Fehlercode (Entscheid des PO vom 23.10.2026, #717).

- **Unterstützt:** Ä4 (primär), Ä1 (weniger Deklarationsorte), T1 (Regeln im schnellen `*.pg.test.ts` statt E2E, TP-T1/Ä4)
- **Verstoss erkennbar an:**
  - einem Vergleich gegen einen Statuswert oder einer verankerten fachlichen Regex in `src/lib/server/**`, `+page.server.ts` oder `+server.ts`, die nicht auf der Allowlist für technische Prüfungen steht (`m4-decisions-outside-backend.csv`);
  - Zählungen oder Berechnungen über mehrere Backend-Antworten im BFF (Muster von Paar #13, `overview.ts`).

## AP3 Kein Update ohne Rückweg

Jedes Update sichert vor der ersten Migration Daten und Schlüssel. Jedes Release für die Vermieter ist als Upgrade von seiner Vorversion mit Daten geprüft, und ein Backup der Vorversion lässt sich darin einspielen. Backups sind mit einem Wiederherstellungscode verschlüsselt. Ein Restore ist ein getesteter, gemessener Weg, keine Anleitung.

- **Unterstützt:** U1, R1 (beide primär); mindert RI-U1-1, RI-U1-2, RI-U1-5, RI-R1-3
- **Verstoss erkennbar an:**
  - einem Release-Tag, für den kein grüner Upgrade-Test vom vorherigen Release existiert;
  - einem Startpfad, der `migrate` ausführt, ohne dass vorher ein Backup geschrieben wurde;
  - einem Restore-Test, der das Schlüssel-Volume auslässt, länger als 5 min dauert oder nur ein Backup derselben Version einspielt;
  - einer Backup-Datei, die ohne Wiederherstellungscode lesbar ist.

## AP4 Was der Betreiber wissen muss, meldet Dwello selbst

Fehlgeschlagenes Backup, fehlgeschlagener Start und fehlgeschlagene Migration erscheinen im Healthcheck mit lesbarer Ursache und, wo die App noch läuft, als Hinweis in der App. Der Betreiber muss dafür nicht in `docker logs` suchen.

- **Unterstützt:** U1, O1; mindert RI-U1-3
- **Verstoss erkennbar an:**
  - einem Fehlerpfad in Backup, Start oder Migration, der nur `console.error` schreibt und den Healthcheck grün lässt;
  - einem E2E- oder Backend-Test für «Backup zu alt», der fehlt oder rot ist.

## AP5 Prüfen auf der niedrigsten Ebene, die das Verhalten zeigt

Eine Regel wird im Unit- oder `*.pg.test.ts` geprüft. Das E2E-Szenario prüft den Ablauf und die Sichtbarkeit, nicht jede Variante der Regel. Das teure Signal (alle Browser, alle Bildschirme) ist so verteilt, dass PR und `main` jeweils in 15 min antworten und `main` grün bleibt.

- **Unterstützt:** T1 (primär); folgt aus AP2. Steht schon in `docs/test-pyramid.md` und `CLAUDE.md` Workflow 2 für Bugfixes, hier für jede Regel.
- **Verstoss erkennbar an:**
  - einer CI-Laufzeit über 15 min auf PR oder `main` (Laufzeit-Job aus T1);
  - einem roten oder abgebrochenen Lauf auf `main` ohne Folge-Fix (Quote grüner Läufe);
  - einer Gruppe von Examples-Zeilen in einem `.feature`, die nur Varianten einer Backend-Regel durchspielt (Prüfung im Review; maschinell schwer, Annahme).

## Abdeckung

| Prinzip | Ä1 | Ä4 | U1 | R1 | O1 | T1 |
|---|---|---|---|---|---|---|
| AP1 Eine Quelle | ● | ○ | | | | |
| AP2 Regeln im Backend | ○ | ● | | | | ○ |
| AP3 Update mit Rückweg | | | ● | ● | | |
| AP4 Selbst melden | | | ● | | ● | |
| AP5 Niedrigste Ebene | | | | | | ● |

● primär, ○ unterstützt
