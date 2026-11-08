# Datenprüfung #686, Runde 1

Stand: Commit 4152a94 (Worktree `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/review-686-dp`), Persona-Stack auf :3300/:3301, Datenbank `dwello_persona`. Es wurde nichts gestartet, keine Daten geändert; PDFs aus `utility_statements.pdf_blob` gelesen, Seiten per GET mit selbst signiertem Session-Cookie abgerufen.

## Ergebnis

Keine Befunde. Alle sechs Abrechnungen stimmen auf den Rappen mit meiner unabhängigen Neuberechnung, dem gespeicherten Wert, der Webseite und dem PDF überein. An den Berechnungen hat sich nichts geändert.

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| (keine) | – | – | – | – |

Geprüft: NK-22222222-2025-0001 (Weber, de), NK-22222222-2025-0002 (Meier, de, Heizprofil), NK-22222222-2025-0003 (Brunner, de, Heizprofil), NK-22222222-2025-0004 (Bernasconi, it, eigener Satz der Verwaltungspauschale), NK-33333333-2025-0001 (Keller, versendet, Tankbestand), NK-33333333-2025-0002 (Fischer, versendet, Frist 31.12.2026, ohne Verwaltungspauschale); QR-Rechnungen von -22222222-2025-0002 und -0004; Schritt-2-Zählung für Seepark Residenz, Alpenblick und Musterhaus Zentrum 2025.

## Vorgehen und Belege

Skript: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/w686/recompute.py`. Es liest Rechnungen, Verteilschlüssel, Mietverträge, Akonto, Heizprofil und Tankbestand aus der DB und rechnet nach den Regeln in `docs/nebenkostenabrechnung-anforderungen.md` («Regeln in Dwello» 1, 3, 5, 8, 9, 10, 11). Reproduktion: `python3 -I recompute.py` (Ausgabe `ALL STORED OK`), dann `python3 -I pdfcheck.py` (`PDF ALL OK`) und `python3 -I pagecheck.py` (`PAGES ALL OK`). Dwello-Code wurde nicht importiert.

Ergebnisse je Abrechnung (Saldo vor Rundung, Rundung, Saldo; Rundung nur zugunsten des Mieters):

| Abrechnung | Vor Rundung | Rundung | Saldo | Art |
|---|---|---|---|---|
| NK-22222222-2025-0001 | 34.56 | +0.04 | 34.60 | Rückerstattung |
| NK-22222222-2025-0002 | 141.63 | −0.03 | 141.60 | Nachzahlung |
| NK-22222222-2025-0003 | 97.53 | +0.02 | 97.55 | Rückerstattung |
| NK-22222222-2025-0004 | 75.82 | −0.02 | 75.80 | Nachzahlung |
| NK-33333333-2025-0001 | 149.17 | +0.03 | 149.20 | Rückerstattung |
| NK-33333333-2025-0002 | 184.16 | +0.04 | 184.20 | Rückerstattung |

Verglichen wurden je Abrechnung: Kosten des Gebäudes, Wohnungsanteil, Zeitanteil, Ihr Anteil jeder Zeile (DB `utility_statement_line_items`, PDF, Webseite), Zwischensumme, Verwaltungspauschale (3 % bzw. 2.5 % bzw. keine), Ihre Nebenkosten, Akontobeiträge, Saldo vor Rundung, Rundung samt Vorzeichen, Saldo, Mietstage, Kopfbetrag. Alle Werte gleich.

- **Heizkosten Seepark (Meier, Brunner):** Rechnung SR-2024-014 (Rechnungsdatum 20.01.2025, Leistungszeitraum Q4 2024) zählt nicht, SR-2025-014 (Rechnungsdatum 20.01.2026, Leistungszeitraum Q4 2025) zählt in 2025: Heizung 4'115.00. Anteil nach Heizprofil je Rechnung (Meier 100/100/0/0 %, Brunner 0/0/100/100 %) und die Monatssummen 37.20 / 18.60 / 11.00 / 33.20 % stimmen. Zeitanteil 56.14 % (Meier) und 43.86 % (Brunner); Ihr Anteil 591.94 und 462.53; Zusatzzeile «Ihr Anteil: 1'054.47 × Zeitanteil (…) / 4'115.00» stimmt. Der Hinweis dieser Variante («Heizkosten nach Heizprofil «Heizung + Warmwasser»: Bei einer Rechnung mit Leistungszeitraum zählen die Monate …», `heatingNoteOwn`) steht im PDF von Meier und Brunner.
- **Alpenblick:** Heizung nach Verbrauch: 1'792.00 + 4'880.00 − 1'494.00 = 5'178.00, im PDF als Tankbestand-Tabelle gedruckt, Zeitanteil 365/365.
- **Schritt 2 gegen Vorschau/Abrechnung:** `GET /api/statements/invoices?buildingIds=…&periodStart=2025-01-01&periodEnd=2025-12-31` liefert Seepark 15, Alpenblick 6, Musterhaus 19 Rechnungen. Meine SQL-Zählung (Leistungszeitraum, sonst Rechnungsdatum, nur umlagefähige Kategorien) gibt dieselben Zahlen. Die Abrechnungen verwenden 15 (Meier: 1+4+4+4+2) bzw. 6 Rechnungen. Für 2024 ist SR-2024-014 enthalten, für 2026 keine Seepark-Rechnung (SQL und Endpunkt gleich).
- **Zahlungsfrist:** Systemdatum 07.11.2026 (Schweizer Zeit gleicher Tag), `payment_deadline_days` nicht gesetzt (Vorgabe 30). Entwürfe -0001 bis -0004: Abrechnungsdatum 07.11.2026, Frist 07.12.2026 (30 Tage). Keller versendet: 07.12.2026. Fischer versendet: 31.12.2026 (54 Tage, länger als 30, bleibt, wie `datedToday`). PDF, Webseite und DB nennen dieselben Daten. Der Hilfetext («Die Frist läuft ab dem Versand. … auf 30 Tage …; eine längere Frist bleibt.») erscheint auf den vier Entwürfen mit n = 30 und fehlt auf den zwei versendeten.

## QR-Rechnungen

Es gibt zwei Zahlteile (Nachzahlungen): -22222222-2025-0002 (PDF Seite 3) und -0004 (Seite 2). Die vier Rückerstattungen haben keinen QR-Code (alle Seiten gerendert und dekodiert: 0 Codes). Dekodiert mit zxing-cpp (`pdftoppm -png -r 300`, Skript `qrcheck.py`, Venv `w686/env`):

| Abrechnung | IBAN | Betrag | Referenz | Mitteilung | Zahlungspflichtiger |
|---|---|---|---|---|---|
| -0002 | CH4431999123000889012 (= Einstellung, mod 97 gültig, IID 31999) | 141.60 CHF | 000334274286577995050347773 (27 Stellen, Prüfziffer mod 10 gültig, = `qr_bill_reference`) | Nebenkostenabrechnung NK-22222222-2025-0002 | Sarah Meier, Hirschmattstrasse 21, 6003 Luzern, CH |
| -0004 | gleich | 75.80 CHF | 009037788735407510558179502 (gültig, = `qr_bill_reference`) | Conteggio spese accessorie NK-22222222-2025-0004 | Marco Bernasconi, Seeweg 15, 6003 Luzern, CH |

Header SPC/0200/1, Gläubiger Typ S mit Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, Trailer EPD, 31 Zeilen. Der gedruckte Betrag und die Referenz im Zahlteil und im Empfangsschein entsprechen dem QR-Inhalt.

## Nicht bestätigt

- **`heatingNote` (neuer Wortlaut «X % des Wohnungsanteils an den Heizkosten»):** Kein Datensatz erfüllt die Bedingung (Mietvertrag nur für einen Teil der Periode und Heizrechnung ohne Leistungszeitraum). Gesucht in `dwello_persona`: alle 19 Abrechnungen (`heating_share.byDays`/`percent`) und alle Heizrechnungen (`is_heating_cost`): Seepark hat 8 Heizrechnungen, alle mit Leistungszeitraum; Alpenblick und Musterhaus haben nur solche ohne, dort mieten alle die ganze Periode. Kein Datensatz angelegt. Nur der Quelltext wurde gelesen: `backend/src/services/pdf-texts/{de,fr,it,en}.ts` Zeile 57 ändert nur den Text (Diff `origin/main...HEAD` im Backend enthält ausser Tests nur diese vier Zeilen). Rechnerisch ist der Prozentwert der gespeicherte `heating_share.percent` (z. B. 55.8 % bei Meier), der mit dem Zeitanteil der Heizzeile übereinstimmt, wenn er gilt.
- **Webseite und Hilfetext in fr/it/en:** Die Oberflächensprache ist am Konto gespeichert; ein Wechsel würde Daten des Stacks ändern. Geprüft wurde die Webseite nur auf Deutsch. Die Texte `statements_payment_deadline_draft_help` in `messages/{fr,it,en}.json` habe ich gelesen (alle mit `{n}`), aber nicht gerendert.
- **PDF-Sprachen:** Geprüft wurden de (fünf Abrechnungen) und it (Bernasconi). Es gibt in den Datensätzen keinen fr- oder en-Mieter dieser Abrechnungen.
- **Satz der Verwaltungspauschale für Weber, Meier, Brunner, Keller (3 %):** Der Satz des Abrechnungslaufs steht nicht in der DB (Mietvertrag ohne eigenen Satz). Ich habe den gespeicherten Satz 3.0 übernommen; er ist in PDF, Webseite und Zwischensumme einheitlich. Bernasconi (2.5 %) stimmt mit dem eigenen Satz des Mietvertrags.
