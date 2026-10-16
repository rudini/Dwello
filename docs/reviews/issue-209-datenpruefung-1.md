# Datenprüfung #209, Runde 1 (daten-pruefer)

- Geprüfter Stand: Worktree `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-209-daten`, Commit `6e569c26` (Diff gegen `f106ec6b`)
- Laufende App: Frontend :3300, Backend :3301, Datenbank `dwello_persona` (Demodaten, beim Start mit diesem Code erzeugt)
- Eigene Skripte und Ausgaben: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dp209/` (`recompute.py`, `checkpdf.py`, `qr.py`, `qrcheck.py`, Exporte in `in/`, PDFs in `pdf/`, Seiten in `web/`). Kein Code von Dwello importiert oder kopiert; Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` (Regeln 1 bis 10, besonders Regel 5), `UBIQUITOUS_LANGUAGE.md` und `docs/anforderungen-vertragsende.md`.

## Ergebnis

Kein Blocker, kein Major, kein Minor. Alle 17 Demo-Abrechnungen stimmen auf den Rappen; `heating_share` stimmt in allen 17 mit meiner Nachrechnung überein, und die beiden Abrechnungen nach Heizprofil drucken den gespeicherten Anteil und die gespeicherten Monate in allen vier Sprachen. Ein Nit.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Nit | NK-22222222-2025-0003, `utility_statements.heating_share.percent` (auch `heating` in `POST /preview`, `heatingShare` in `GET /statements/:id`) | `44.2` (auf 2 Stellen gerundet wie die Monate) | `44.199999999999996` (Gleitkomma-Rest; das PDF druckt korrekt «44.20 %», der Betrag ist nicht betroffen, `period_share` = 0.4420) |

### D-1: Gleitkomma-Rest im gespeicherten Prozentsatz

`heatingOfRun` (`backend/src/services/calculation.service.ts`, neu in diesem Diff) rundet die Monate auf zwei Stellen (`Math.round(percentage * 100) / 100`), den Gesamtanteil `percent` aber nicht. 3.7 + 3.6 + 3.7 + 9.5 + 10.7 + 13.0 ergibt in Gleitkomma 44.199999999999996; so steht es in der Datenbank und in den API-Antworten. Für das PDF folgenlos (es formatiert mit zwei Stellen), aber jeder andere Leser des JSON (API-Vertrag, spätere Anzeige auf der Webseite) bekommt den Rest. Vorschlag: `percent` wie die Monate runden.

Nachweis:

```
$ psql -X postgresql://dwello:dwello@localhost:5432/dwello_persona -c \
  "select statement_number, heating_share->'percent' from utility_statements where heating_share->>'byDays'='false'"
NK-22222222-2025-0002 | 55.8
NK-22222222-2025-0003 | 44.199999999999996

POST /api/v1/statements/preview (Vertrag von NK-22222222-2025-0003, 2025, Heizprofil «Heizung + Warmwasser», 3 %)
preview heating {"byDays": false, "percent": 44.199999999999996, "months": [... {"month": 12, "percentage": 13}], ...}
```

Reproduktion: obige Abfrage; oder `GET http://localhost:3301/api/v1/statements/<id von NK-22222222-2025-0003>` mit Bearer-Token und Feld `heatingShare.percent` lesen.

## Geprüft und bestanden

**Nachrechnung (`dp209/recompute.out`, 907 Prüfungen, 0 Abweichungen).** Für jede der 17 Abrechnungen (NK-11111111-2024-0001 bis -0004, NK-11111111-2025-0001 bis -0004, NK-22222222-2024-0001 bis -0003, NK-22222222-2025-0001 bis -0004, NK-33333333-2024-0001 und -0002), 109 Abrechnungspositionen: Mietstage, Anzahl Positionen, je Position Gesamtkosten, Wohnungsanteil, `period_share`, Mieteranteil, `position_rental_days`, `billed_days`; Akontobeiträge, Verwaltungspauschale, Gesamtkosten, Saldo mit Rundung auf 5 Rappen, Prüfziffer der QR-Referenz.

**`heating_share` (neu).** Alle 17 Abrechnungen haben ein Heizprofil und eine Heizkosten-Position (Kategorie Heizung), also nie `null` erwartet:

- 15 Abrechnungen mit Mietvertrag über die ganze Periode: erwartet und gespeichert `{"byDays": true}` (Regel 5: Heizprofil nur bei Ein- oder Auszug).
- NK-22222222-2025-0002 (Sarah Meier, Auszug 30.06.2025, Profil «Heizung + Warmwasser»): erwartet und gespeichert `percent` 55.8 = 13.6 + 12.1 + 11.5 + 9.3 + 5.6 + 3.7 von 100; Monate 1 bis 6 mit diesen Anteilen; Namen = Namen des Profils (alle fünf Felder); Heizungsposition `period_share` 0.5580, Mieteranteil 1'054.47 × 55.80 % = 588.39.
- NK-22222222-2025-0003 (Nina Brunner, Einzug 01.07.2025): `percent` 44.20 (siehe D-1), Monate 7 bis 12 (3.7, 3.6, 3.7, 9.5, 10.7, 13.0), Namen stimmen; `period_share` 0.4420, Mieteranteil 466.08.
- `POST /preview` liefert für diese drei Verträge (0001, 0002, 0003 des Gebäudes 22222222, 2025) dasselbe `heating` wie gespeichert, `GET /statements/:id` dasselbe `heatingShare`; der Preview-Saldo gleicht dem gespeicherten (138.00, -93.85, -34.55).

**Beträge unverändert.** Mieteranteile je Position, Gesamtkosten und Saldo aller 17 Abrechnungen sind identisch mit meiner Nachrechnung aus der Datenprüfung zu #208 (`scratchpad/expected.json`, `expected2024.json`).

**PDF, gespeicherte Fassungen (17 PDFs aus `pdf_blob`, Sprache des Mieters: de, fr, it; `dp209/checkpdf-stored.out`, 237 Prüfungen, 0 Abweichungen).** Jede Zeile Kostenaufstellung (Gesamtkosten, Wohnungsanteil, Zeitanteil, Betrag), Zwischensumme, Verwaltungspauschale, Gesamtkosten, Akonto, Saldo vor Rundung, Rundung, Saldo, QR-Betrag. Der Hinweis «Heizkosten nach Heizprofil …» steht nur in NK-22222222-2025-0002 und -0003, in keiner der 15 Abrechnungen nach Tagen.

**PDF in allen vier Sprachen (de, fr, it, en)** für NK-22222222-2025-0001 (nach Tagen), -0002 und -0003 (nach Heizprofil), im laufenden App über `POST /statements/:id/generate-pdf` erzeugt (`dp209/pdf/lang/`): alle Beträge stimmen; der Heizhinweis druckt den gespeicherten Anteil und die gespeicherten Monate und den Profilnamen der jeweiligen Sprache:

```
de  Heizkosten nach Heizprofil «Heizung + Warmwasser»: 44.20 % ... Jul 3.70 %, Aug 3.60 %, Sep 3.70 %, Okt 9.50 %, Nov 10.70 %, Dez 13.00 %
fr  Frais de chauffage selon le profil « Chauffage + eau chaude » : 44.20 % ... juil. 3.70 %, ... déc. 13.00 %
it  Spese di riscaldamento secondo il profilo «Riscaldamento + acqua calda»: 44.20 % ... lug 3.70 %, ... dic 13.00 %
en  Heating costs by heating profile «Heating + Hot Water»: 44.20 % ... Jul 3.70 %, ... Dec 13.00 %
```

(entsprechend 55.80 % und Jan bis Jun für -0002; für -0001 kein Heizhinweis, Zeitanteil «365/365 Tage/jours/giorni/days»). Danach habe ich die drei Entwürfe wieder ohne Sprache erzeugt (Sprache des Mieters), damit sie wie vorher dastehen; nur `pdf_blob` und `pdf_generated_at` dieser drei Entwürfe haben sich dabei geändert.

**Webseite** `/statements/<id>` für NK-22222222-2025-0001, -0002, -0003 (`dp209/web/`): alle Positionsbeträge, Zwischensumme, Verwaltungspauschale, Gesamtkosten, Akonto, Saldo vor Rundung, Rundung und Saldo stimmen.

**QR-Rechnungen (14 Seiten, `pdftoppm -r 300 -png`, dekodiert mit zxing-cpp im Scratchpad-venv; `dp209/qrcheck.out`, 210 Prüfungen, 0 Abweichungen).** Gespeicherte PDFs aller 10 Nachzahlungen (NK-11111111-2024-0001, -0004; NK-11111111-2025-0001, -0003, -0004; NK-22222222-2024-0002, -0003; NK-22222222-2025-0002, -0004; NK-33333333-2024-0002) sowie NK-22222222-2025-0002 in de, fr, it, en. Je: Kopf SPC/0200/1, QR-IBAN CH4431999123000889012 (Mod-97 gültig, IID 31999 im QR-IID-Bereich), Gläubiger Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, Betrag = nachgerechneter Saldo, CHF, Schuldner = Mieter mit Adresse, Referenztyp QRR, Referenz = gespeicherte, 27 Ziffern, Prüfziffer Mod 10 rekursiv gültig, Mitteilung «<Titel in der PDF-Sprache> <Nummer>», Trailer EPD. Die 7 Rückerstattungen haben richtig keinen QR-Teil.

## Nicht bestätigt

- **Der eigentliche Zweck von #209 im laufenden App: ein Heizprofil wird nach dem Erstellen geändert, umbenannt oder gelöscht, das PDF druckt weiter die gespeicherten Werte.** In den Demodaten nutzen alle Abrechnungen vordefinierte Profile (deren Monatsanteile sich nicht ändern lassen, Regel 6), und Profile zu ändern war mir untersagt. Gespeicherte und aus dem Profil neu gerechnete Werte sind in den Demodaten daher gleich; die PDFs zeigen nur, dass beide übereinstimmen, nicht, dass das PDF den gespeicherten Wert gegenüber einem geänderten Profil bevorzugt. Dies deckt `backend/src/__tests__/statement-pdf.pg.test.ts` («Heizanteil, mit dem die Abrechnung erstellt wurde») ab; den Test habe ich nicht ausgeführt, weil er `dwello_test` neu aufsetzt und andere Prüfer gleichzeitig Tests laufen lassen könnten.
- **Abrechnung, die vor der Migration erstellt wurde (`heating_share` null).** Kommt in den Demodaten nicht vor (alle beim Start mit diesem Code erzeugt); der Rückfall auf die Neuberechnung ist im laufenden App nicht geprüft.
- **Sommerperiode mit 0 % in den Monaten der Periode (`byDays: true` trotz Ein-/Auszug), Periode kürzer als ein Jahr, Ein- oder Auszug mitten im Monat.** Kommt in den Demodaten nicht vor (alle Perioden sind Kalenderjahre, alle Wechsel am Monatsende); für eine Periode unter zwölf Monaten ist offen, ob die gespeicherten Monatsanteile auf die Periode bezogen oder die rohen Jahresanteile sind.
- **Gesendete und bezahlte Abrechnungen in anderen Sprachen als der des Mieters**: nicht neu erzeugt (nur Entwürfe dürfen neu erzeugt werden); geprüft ist ihre gespeicherte Fassung.

## Beobachtungen (ausserhalb der Beträge, ohne Schwere)

- Die Detailseite nennt das Heizprofil aus dem verknüpften Profil (`heatingProfileId`), nicht aus `heating_share.names`, und zeigt «Heizprofil Heizung + Warmwasser» auch bei den 15 Abrechnungen nach Tagen, während deren PDF keinen Heizhinweis hat. Nach dem Umbenennen oder Löschen eines eigenen Profils können Seite und PDF damit verschiedene Namen (oder die Seite keinen) zeigen. Das Verhalten der Seite ist durch diesen Diff nicht geändert; es kann aber neu einen Widerspruch zum PDF ergeben. Auf dem Basis-Commit nicht geprüft.
