# Fachreview #1001, Runde 1 (Commit b887231)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Bei einer Abrechnung, die vor #959 als bezahlt markiert wurde, ist `payments` leer (`statement.service.ts:853` «a statement paid before #959 has no list»). Der Mieterexport gibt dann `payments: []` neben gesetztem `paidAmount`/`paidDate` aus (`tenant-export.service.ts:134`). Das liest sich wie «keine Zahlung festgehalten» und weicht vom Export des Liegenschaftsverwalters ab, der für diesen Fall eine Zahlung aus `paidDate`/`paidAmount` bildet (`data-export.service.ts:539`). Abhilfe: dieselbe Rückfallregel in `tenant-export.service.ts:134` übernehmen, dazu ein `*.pg.test.ts`-Fall mit `payments: []` und `paidDate` gesetzt. |

Keine Blocker/Major.

Geprüft: V-5 aus 959-1 ist für Abrechnungen mit Zahlungsliste erfüllt: Jede festgehaltene Zahlung erscheint mit Datum und Betrag, `paidAmount`/`paidDate` bleiben (`tenant-export.service.ts:131-134`, Test `tenant-export.pg.test.ts:274`). Die Abbildung nimmt nur `date` und `amount` auf. Das sind alle Felder von `Payment` (`schema.ts:435`), also verlassen keine internen Felder den Server. Die Daten waren bereits gespeichert und gehen über den bestehenden Weg (der Liegenschaftsverwalter übergibt die Datei dem Mieter). Es gibt keinen neuen Empfänger und kein neues Land, deshalb brauchen weder die Datenschutzerklärung (`privacy_controller_3`) noch `tenants_export_help` noch `terms_responsibility_5` eine Änderung. DSG Art. 25 Abs. 2 lit. b (Stand 7. Juli 2025): «die bearbeiteten Personendaten als solche». Art. 28 Abs. 1 (gleicher Stand): «die Herausgabe ihrer Personendaten, die sie ihm bekanntgegeben hat, in einem gängigen elektronischen Format». Beides ist mit der Liste besser erfüllt als mit der Summe allein. Die Begriffe «Teilzahlung» und `payments` stimmen mit `UBIQUITOUS_LANGUAGE.md:186` überein. Die Zeile in `docs/api-specification.md:90` stimmt mit dem Code überein.

## Nicht bestätigt

- Ob in Produktivdaten Abrechnungen aus der Zeit vor #959 mit leerer Liste vorkommen: Gelesen habe ich nur die Kommentare in `statement.service.ts:853` und `data-export.service.ts:534`. Eine Datenbank habe ich nicht abgefragt.
