# Fachreview 1410-3 (Commit 80d8e392, `git diff efc684fe 80d8e392`)

Vorheriger Bericht: `docs/reviews/1410-fachreview-2.md`.

Geschlossen: V-6, V-3b, V-5

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-3a | Verwalter | Minor | Unverändert offen, wie in Runde 2 beschrieben: Die Löschbestätigung rechnet mit dem ganzen Leistungszeitraum, `deletedWithinRetention` aber mit dem gespeicherten `end`. Fix wie dort. |

## Nicht bestätigt

- Wie in Runde 2: Tankbestände und Lieferungen in den Tank (`fuelStock`) und die Frist; fr/it-Begriffe des StHG auf Fedlex FRA/ITA; der Stichtag Rechnungsdatum im Steuerrecht (**unsicher**). Der Delta ändert an keinem dieser Punkte etwas.

Geprüft: V-6: `listedIn` (`invoice-retention.ts:37-38`) trifft die letzte Periode, die `inPeriodOf` (`invoice-period.ts:32-36`) zeigt. Leistungszeitraum-Beginn und -Ende sind nur zusammen gesetzt (`0001_schema.sql:196-198`). Nachgerechnet: Kalenderjahr; Heizkosten 2015 vom 15.02.2016 am 15.01.2027 ergeben 2015 / 31.12.2026 / 1. Mit einer Rechnung vom 30.06.2015 am 15.06.2026 ergibt das 2015 / 31.12.2025 / 1. Juli–Juni: Leistungszeitraum bis 30.06.2015 und Rechnung vom 10.08.2015 zählen in 2014/15, Frist 31.12.2026. Die SQL-Vorauswahl `< (Jahr−9)-01-01` ist eine Obermenge. `{date}` als spätestes `keepUntil` macht den Satz «endete am» für jede gezählte Rechnung wahr. Hält der Vermieter eine Periode mit «Behalten», nennt die Übersicht auch Rechnungen dieser Periode nicht mehr, deren Frist erst später endet. Das deckt sich mit der Glossarzeile «Behalten» («die Rechnungen einer Abrechnungsperiode»). V-3b: Nur gelöschte Rechnungen fallen nach der Frist weg, eine noch erfasste bleibt eine Änderung. Das stimmt mit dem Glossar «Nicht aktuelle Abrechnung» überein. V-5: Grenztag 31.12.2034 / 01.01.2035 getestet. Glossarzeilen «Aufbewahrungsfrist» und «Behalten» stimmen mit `keepUntil` und `keepInvoicePeriod` überein, ebenso die Zeilen in `i18n-begriffe.md`. `dashboard_task_retention_keep_help` stimmt in de/fr/it/en mit der Glossarzeile «Behalten» überein (Aufgabe entfällt, Dwello löscht nichts) und hält die Sprachregeln ein (fr « » mit geschütztem Leerzeichen, it «Lei»). Er steht sichtbar beim Button (`RetentionHint.svelte:38-49`, `describedby`). `RetentionNote` ist ein reiner Umbau ohne Textänderung.
