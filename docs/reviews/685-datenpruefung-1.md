# Datenprüfung #685, Runde 1

Worktree: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/review-685-dp` (Commit f09db09). Prüfobjekt ist die laufende Persona-Stack-Instanz (Backend :3301, Frontend :3300, Datenbank `dwello_persona`) mit diesem Code.

## Ergebnis

Keine Befunde (kein Blocker, kein Major, kein Minor). Alle vier Abrechnungen stimmen mit meiner unabhängigen Neuberechnung auf den Rappen überein: gespeicherte Werte, Detailseite, PDF (de und fr) und QR-Rechnung. Die Berechnung ist nicht verändert: `git diff origin/main...HEAD --name-only` enthält ausserhalb von Tests und Docs nur `backend/src/services/pdf.service.ts`, `backend/src/services/pdf-texts/*.ts`, `src/routes/statements/[id]/CostTable.svelte` und `tools/fitness/ratchet.json`. Kein Berechnungsdienst und kein Mapper ist berührt.

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| – | – | – | – | keine Befunde |

## Vorgehen

1. Eigenes Skript `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/dp/recompute.py` (Python, nur `psql` lesend; ohne Import von Dwello-Code). Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` («Regeln in Dwello» 1, 3, 5, 8, 9, 10, Themen 3 und 4) und `UBIQUITOUS_LANGUAGE.md`. Eingaben aus der Datenbank: Rechnungen (Leistungszeiträume, Rechnungsdatum), Kategorien (Heiz-/Brennstoffkennzeichen, vereinbarte Kategorien der Abrechnung), Verteilschlüssel-Formeln, alle Wohnungen des Gebäudes (auch leere), Mietverträge, Akonto-Staffel, Heizprofile, Tankbestände.
   - Wohnungsanteil = Kosten × Anteil der Wohnung nach Formel (Formel für jede Wohnung ausgewertet, Anteil an der Summe).
   - Zeitanteil nach Tagen (Mietstage / Tage der Periode) bzw. bei Heizkosten und Teilperiode nach Heizprofil je Rechnung (Monate des Mietverhältnisses / Monate der Rechnung im Heizprofil, auf zwei Stellen gerundet); Müller und Dubois: Heizkosten nach Verbrauch (Anfangsbestand 31.12.2024 + Lieferung − Endbestand 31.12.2025).
   - Verwaltungspauschale 3 % der Zwischensumme, Akonto nach Monaten des Mietvertrags, Saldo nur zugunsten des Mieters auf 5 Rappen gerundet (Nachzahlung ab, Rückerstattung auf).
   - Ausgabe: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/dp/recompute.out` (188 Prüfungen, 0 Abweichungen, «ALL OK»), Erwartungswerte in `expected.json`.
2. PDF: über `GET /api/v1/statements/{id}/pdf` des Backends abgerufen (JWT wie `persona-kit.mjs`), mit `pdftotext -layout` gelesen und mit `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/dp/pdfcheck.py` verglichen (Ausgabe `pdfcheck.out`, 188 Prüfungen, «ALL PDF OK»): jede Position genau einmal, Spalten Kosten, Wohnungsanteil, Zeitanteil, Ihr Anteil, Zwischensumme, Verwaltungspauschale, Ihre Nebenkosten, Akonto, Saldo vor Rundung, Rundungszeile mit Vorzeichen, Saldo, Banner.
3. Detailseite: `GET /statements/{id}` mit Session-Cookie, SSR-HTML mit `pagecheck.py` ausgewertet: Spalte «Anteil» zeigt immer zwei Dezimalstellen und stimmt mit meinem `round(Ihr Anteil / Kosten × 100, 2)` überein; Zwischensumme, Pauschale, Summe, Akonto, Saldo vor und nach Rundung stehen auf der Seite.
4. QR-Rechnung: Seite mit `pdftoppm -png -r 300` gerendert, mit `zxing-cpp` (Python-venv `dp/qrenv` im Scratchpad) dekodiert, mit `qrcheck.py` geprüft.

## Pro Datensatz

| Abrechnung | Positionen | Seitenumbruch | Saldo | QR-Rechnung |
|---|---|---|---|---|
| NK-22222222-2025-0003 (Brunner, 01.07.–31.12.2025, Heizprofil, de, 2 Seiten) | 5 von 5, je einmal | Letzte Zeile «Allgemeinstrom» mit den Summen auf Seite 2, Kopfzeile wiederholt, Erläuterung und «Heiz- und Warmwasserkosten» bei den Summen | Rückerstattung 97.53 → 97.55 (+ 0.02) | keine (Rückerstattung hat keinen Zahlteil, auf beiden Seiten kein QR-Code gefunden) |
| NK-22222222-2025-0002 (Meier, 01.01.–30.06.2025, Heizprofil, de, 3 Seiten) | 5 von 5, je einmal | «Allgemeinstrom» mit den Summen auf Seite 2, Kopfzeile wiederholt | Nachzahlung 141.63 → 141.60 (– 0.03) | Seite 3 dekodiert: alle Felder stimmen |
| NK-11111111-2025-0001 (Müller, 8 Positionen, Tankbestand, de, 3 Seiten) | 8 von 8, je einmal | «Kaminfeger» mit den Summen auf Seite 2, Kopfzeile wiederholt | Nachzahlung 215.82 → 215.80 (– 0.02) | Seite 3 dekodiert: alle Felder stimmen |
| NK-11111111-2025-0003 (Dubois, 8 Positionen, Tankbestand, fr, 3 Seiten) | 8 von 8, je einmal | «Ramonage» mit den Summen auf Seite 2, Kopfzeile wiederholt | Nachzahlung 142.38 → 142.35 (– 0.03) | Seite 3 dekodiert: alle Felder stimmen |

QR-Felder (je Abrechnung geprüft): Kopf `SPC/0200/1`; IBAN gleich Konfiguration, Prüfsumme mod 97 gültig, QR-IID im QR-IBAN-Bereich (31999); Zahlungsempfänger und Schuldner (Name, Strasse, PLZ, Ort, Land) wie in Konfiguration und Mieterdaten; Betrag gleich Saldo der Abrechnung (215.80 / 141.60 / 142.35), Währung CHF; Referenztyp QRR, 27 Stellen, gleich `qr_bill_reference`, Prüfziffer (Modulo 10 rekursiv) gültig; Mitteilung «Nebenkostenabrechnung NK-…» bzw. «Décompte des charges NK-…»; Abschluss `EPD`. Der gedruckte Zahlteil (Betrag, Referenz) entspricht dem dekodierten Code.

Einzelwerte, die ich von Hand gegengerechnet habe: Brunner Heizung 1'054.47 × (395.00 + 1'410.00) / 4'115.00 = 462.53 (43.86 %); Meier Heizung 1'054.47 × (1'520.00 + 790.00) / 4'115.00 = 591.94 (56.14 %); Müller Heizung (0.7 × 75.5 / 492.5 + 0.3 × 1 / 6) × 6'957.80 = 1'094.53; Dubois 1'188.48; Verbrauch 2'650.00 + 6'565.00 − 2'257.20 = 6'957.80; Prozentwerte der Heizprofil-Erläuterung (37.20 / 18.60 / 11.00 / 33.20 %) stimmen mit den Monatswerten des Profils überein.

## Anmerkungen (kein Befund)

- **Rundung des Wohnungsanteils bei Brunner «Hauswart»:** Rechnet man 3'060.00 × 82/320 × 184/365 ohne Zwischenrundung, ergibt sich 395.28; Dwello rechnet vom gedruckten, gerundeten Wohnungsanteil (784.13 × 184/365 = 395.29), und das PDF zeigt genau diese Spalten. Nach dem Dokument ist keine der beiden Reihenfolgen festgelegt; die gedruckte Zeile ist in sich nachrechenbar. Auswirkung 1 Rappen auf die Zwischensumme (1'303.37 statt 1'303.36), der Saldo bleibt gleich (−97.54 oder −97.53 ergibt beide −97.55). Unverändert gegenüber vor #685, da keine Berechnung angefasst wurde. Nur wenn die Produktverantwortliche eine Reihenfolge festlegen will, wäre das ein eigener Punkt.
- **Seiteneffekt meiner Abrufe:** `GET /api/v1/statements/{id}/pdf` erzeugt das PDF eines Entwurfs neu (`pdf_generated_at`/`updated_at` der Entwürfe NK-22222222-2025-0002, NK-22222222-2025-0003 und NK-11111111-2025-0003 stehen auf 09:48:24; NK-22222222-2025-0003 war schon 09:43:50 erzeugt, NK-11111111-2025-0004 hat 09:44 eine andere Sitzung neu erzeugt). Inhalt, Beträge und Abrechnungsdatum (07.11.2026) haben sich nicht geändert; die versendete Abrechnung NK-11111111-2025-0001 wird nicht neu erzeugt (Abrechnungsdatum 28.09.2026, `pdf_generated_at` 09:42:26).

## Geprüft

Geprüft: NK-22222222-2025-0003, NK-22222222-2025-0002, NK-11111111-2025-0001, NK-11111111-2025-0003 (gespeicherte Positionen und Summen, Detailseite «Anteil» mit zwei Dezimalstellen, PDF de und fr inklusive Seitenumbruch ohne verlorene oder doppelte Zeile, Saldo und Rundung auf 5 Rappen, QR-Rechnung der drei Abrechnungen mit Zahlteil).

## Nicht bestätigt

- **Neuer Monatszeilen-Text («Anteile der Monate Ihres Mietverhältnisses im Heizprofil, das die Heizkosten eines Jahres auf die zwölf Monate verteilt: …»):** Er erscheint nur, wenn eine Heizrechnung ohne Leistungszeitraum mit Heizprofil abgerechnet wird (`heatingNote` oder `heatingNoteParts` in `backend/src/services/pdf.service.ts`, Zeilen 669–680). Bei Brunner und Meier haben alle vier Fernwärme-Rechnungen einen Leistungszeitraum (`heatingNoteOwn`, keine Monatszeile); Müller und Dubois rechnen nach Verbrauch. Die vier Datensätze zeigen den Text also nicht, und die Persona-Datenbank hat keine andere Abrechnung mit Heizprofil und Rechnung ohne Leistungszeitraum. Ich habe die Texte in `backend/src/services/pdf-texts/de.ts` nur gelesen; die Zahlen darin kann ich an keinem Datensatz prüfen. Ein Test mit solchem Datensatz oder ein Datensatz, den der Aufrufer anlegt, würde das schliessen.
- **PDF in it und en:** Unter den vier Datensätzen ist kein italienisch- oder englischsprachiger Mieter; die Sprache hängt am Mieter, und ich ändere keine Daten der gemeinsam genutzten Datenbank. Der geänderte Erläuterungstext der Heizung steht in `pdf-texts/it.ts` und `en.ts`, wurde aber nicht gerendert.
- **Seitenumbruch bei nur einer Position (Überschrift und Kopfzeile wandern mit):** Keiner der vier Datensätze hat nur eine Position. Der Fall ist unter den Demo-Abrechnungen nicht vorhanden (alle haben 5 oder 8 Positionen); nicht geprüft.
- **Optik der Seitenumbrüche:** Nur Seiten 1 und 2 von Brunner und Seite 2 von Dubois habe ich als Bild angesehen (60 dpi); alle anderen Umbrüche prüfte ich über den Text (Zeilen, Kopfzeile, Summen auf derselben Seite), nicht über das Bild.
